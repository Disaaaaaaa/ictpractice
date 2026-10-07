import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { contentId, splitLoRef } from "../../src/lib/content/ids";
import type { AuthoredPart, AuthoredQuestion } from "../../src/lib/content/schema";
import { comparePartLabels } from "../../src/lib/questions/parts";
import { PROGRAMME_VERSION, SPEC_VERSION } from "./push-theory";

/**
 * Upserts a topic's questions (same deterministic ids as the seed builder),
 * versions changed mark schemes, and rebuilds + publishes the topic exam.
 * Published exam versions already taken by students are never modified.
 */
export async function pushQuestions(opts: {
  slug: string;
  title: string;
  grade: number;
  questions: AuthoredQuestion[];
  status: "draft" | "published";
  examMinutes?: number;
  /** topic exam: chosen question keys, title and instructions (default: all questions) */
  exam?: { keys?: string[]; title?: string; instructions?: string };
  source: string;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Uploading needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  const db = createClient(url, key, { auth: { persistSession: false } });

  const { data: version } = await db.from("curriculum_versions").select("id").eq("code", PROGRAMME_VERSION).single();
  const { data: topic } = await db.from("topics").select("id").eq("curriculum_version_id", version!.id).eq("slug", opts.slug).single();
  if (!topic) throw new Error(`Topic ${opts.slug} not found in the database`);
  const { ids, changedSchemes } = await upsertQuestions(db, {
    versionId: version!.id,
    questions: opts.questions,
    status: opts.status,
    grade: opts.grade,
    topicIdOf: () => topic.id,
    defaultSource: "original",
  });
  // Questions of this topic that are no longer in the file are archived (never deleted: exams may use them).
  const keep = new Set(ids);
  const { data: existing } = await db.from("questions").select("id").eq("topic_id", topic.id).eq("source_type", "original").is("archived_at", null);
  const stale = (existing ?? []).map((q) => q.id as string).filter((id) => !keep.has(id));
  if (stale.length) await db.from("questions").update({ status: "archived", archived_at: new Date().toISOString() }).in("id", stale);

  // Topic exam: all questions of the topic, republished as a new version.
  let examNote = "topic exam not published (questions are drafts)";
  const examQuestions = opts.exam?.keys?.length
    ? opts.exam.keys.map((k) => opts.questions.find((q) => q.key === k)!).filter(Boolean)
    : opts.questions;
  const examTitle = opts.exam?.title ?? `${opts.title} — Topic Exam`;
  const examInstructions = opts.exam?.instructions ?? "Answer all questions. Your answers are saved automatically.";
  if (opts.status === "published" && examQuestions.length >= 3) {
    const examId = contentId("exam", "topic", opts.slug);
    const marks = examQuestions.reduce((s, q) => s + marksOf(q), 0);
    const { data: exam } = await db.from("exams").select("id").eq("id", examId).maybeSingle();
    if (!exam) {
      const { error: eErr } = await db.from("exams").insert({
        id: examId,
        curriculum_version_id: version!.id,
        kind: "topic",
        title: examTitle,
        description: `Exam-style questions on ${opts.title}.`,
        instructions: examInstructions,
        topic_id: topic.id,
        grade: opts.grade,
        duration_minutes: opts.examMinutes ?? Math.max(10, Math.round(marks * 1.3)),
        status: "draft",
        integrity_mode: "warn",
        max_violations: 3,
        show_mark_scheme: true,
      });
      if (eErr) throw new Error(`exam: ${eErr.message}`);
    } else {
      await db
        .from("exams")
        .update({ title: examTitle, instructions: examInstructions, duration_minutes: opts.examMinutes ?? Math.max(10, Math.round(marks * 1.3)) })
        .eq("id", examId);
    }
    await db.from("exam_questions").delete().eq("exam_id", examId);
    const { error: eqErr } = await db
      .from("exam_questions")
      .insert(examQuestions.map((q, i) => ({ id: contentId("exam-question", examId, q.key), exam_id: examId, question_id: contentId("question", q.key), sort_order: i })));
    if (eqErr) throw new Error(`exam questions: ${eqErr.message}`);
    const { data: versionId, error: pErr } = await db.rpc("publish_exam", { p_exam_id: examId });
    if (pErr) throw new Error(`publish exam: ${pErr.message}`);
    const { data: v } = await db.from("exam_versions").select("version, question_count, total_marks, duration_minutes").eq("id", versionId).single();
    examNote = `topic exam v${v?.version}: ${v?.question_count} questions, ${v?.total_marks} marks, ${v?.duration_minutes} min`;
  }

  await db.from("audit_logs").insert({
    action: "questions.import",
    entity_type: "topic",
    entity_id: topic.id,
    details: { source: opts.source, questions: ids.length, archived: stale.length, changed_schemes: changedSchemes, status: opts.status },
  });
  return { archived: stale.length, changedSchemes, examNote };
}

export const loId = (ref: string) => {
  const { code, paper } = splitLoRef(ref);
  return contentId("lo", paper ? SPEC_VERSION : PROGRAMME_VERSION, code);
};

type Db = SupabaseClient;

export const marksOf = (q: AuthoredQuestion) =>
  q.type === "structured" ? Math.max(1, (q.parts ?? []).reduce((t, p) => t + p.marks, 0)) : q.marks;

/**
 * Upserts questions (structured stems first, then their parts) with options,
 * objectives and versioned mark schemes. Returns the ids written.
 */
export async function upsertQuestions(
  db: Db,
  opts: {
    versionId: string;
    questions: AuthoredQuestion[];
    status: "draft" | "published";
    grade: number;
    topicIdOf: (q: AuthoredQuestion | AuthoredPart) => string | null;
    defaultSource: string;
    defaultPractice?: boolean;
    /** mock exams: every question belongs to this paper */
    paperNumber?: number;
  },
) {
  // Structured questions are stored as a stem plus one row per part (parents first).
  type Item = { q: AuthoredQuestion | AuthoredPart; parentId: string | null; order: number };
  const items: Item[] = opts.questions.flatMap((q) => {
    const parts = [...(q.parts ?? [])].sort((a, b) => comparePartLabels(a.part_label, b.part_label));
    const stem: AuthoredQuestion = q.type === "structured" ? { ...q, marks: marksOf(q), objectives: q.objectives.length ? q.objectives : [...new Set(parts.flatMap((p) => p.objectives))] } : q;
    return [{ q: stem, parentId: null, order: 0 }, ...parts.map((p, i) => ({ q: p, parentId: contentId("question", q.key), order: i }))];
  });
  const { data: papers } = await db.from("paper_components").select("id, number").eq("curriculum_version_id", opts.versionId);
  const paperIdByNumber = new Map((papers ?? []).map((p) => [p.number as number, p.id as string]));
  const { data: loPapers } = await db
    .from("objective_paper_map")
    .select("learning_objective_id, paper_components(number)")
    .in("learning_objective_id", [...new Set(items.flatMap(({ q }) => q.objectives.map(loId)))]);
  const paperOfLo = new Map(
    ((loPapers ?? []) as unknown as { learning_objective_id: string; paper_components: { number: number } }[]).map((r) => [r.learning_objective_id, r.paper_components.number]),
  );

  let changedSchemes = 0;
  for (const { q, parentId, order } of items) {
    const qid = contentId("question", q.key);
    const counts = new Map<number, number>();
    for (const r of q.objectives) {
      const p = paperOfLo.get(loId(r));
      if (p) counts.set(p, (counts.get(p) ?? 0) + 1);
    }
    const paper = opts.paperNumber ?? [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
    const { error } = await db.from("questions").upsert({
      id: qid,
      curriculum_version_id: opts.versionId,
      title: q.title,
      question_text: q.text,
      question_type: q.type,
      marks: q.marks,
      difficulty: q.difficulty,
      command_word: q.command_word ?? null,
      grading_method: q.grading,
      grade: opts.grade,
      paper_component_id: paper ? (paperIdByNumber.get(paper) ?? null) : null,
      topic_id: opts.topicIdOf(q),
      content: q.content ?? {},
      source_type: q.source ?? opts.defaultSource,
      source_reference: q.source_reference ?? null,
      practice_enabled: q.practice ?? opts.defaultPractice ?? true,
      status: opts.status,
      archived_at: null,
      parent_id: parentId,
      part_label: parentId ? (q.part_label ?? null) : null,
      part_order: order,
    });
    if (error) throw new Error(`question ${q.key}: ${error.message}`);

    await db.from("question_options").delete().eq("question_id", qid);
    if (q.options?.length) {
      const { error: oErr } = await db
        .from("question_options")
        .insert(q.options.map((o, i) => ({ id: contentId("option", q.key, o.key), question_id: qid, key: o.key, content: o.content, sort_order: i })));
      if (oErr) throw new Error(`options ${q.key}: ${oErr.message}`);
    }
    await db.from("question_objectives").delete().eq("question_id", qid);
    const { error: loErr } = await db
      .from("question_objectives")
      .insert([...new Set(q.objectives)].map((r) => ({ question_id: qid, learning_objective_id: loId(r) })));
    if (loErr) throw new Error(`objectives ${q.key}: ${loErr.message}`);
    if (q.type === "structured") continue; // the stem has no mark scheme; its parts do

    const scheme = {
      mark_scheme: q.scheme.mark_scheme,
      marking_points: q.scheme.points ?? [],
      model_answer: q.scheme.model_answer ?? null,
      accepted_answers: q.scheme.accepted ?? {},
      ai_grading_instructions: q.scheme.ai_instructions ?? null,
      explanation: q.scheme.explanation ?? null,
    };
    const { data: current } = await db.from("mark_schemes").select("*").eq("question_id", qid).eq("is_current", true).maybeSingle();
    const same =
      current &&
      JSON.stringify([current.mark_scheme, current.marking_points, current.model_answer, current.accepted_answers, current.ai_grading_instructions, current.explanation]) ===
        JSON.stringify([scheme.mark_scheme, scheme.marking_points, scheme.model_answer, scheme.accepted_answers, scheme.ai_grading_instructions, scheme.explanation]);
    if (!same) {
      if (current) await db.from("mark_schemes").update({ is_current: false }).eq("id", current.id);
      const v = (current?.version ?? 0) + 1;
      const { error: msErr } = await db.from("mark_schemes").insert({ id: contentId("scheme", q.key, v), question_id: qid, version: v, is_current: true, ...scheme });
      if (msErr) throw new Error(`mark scheme ${q.key}: ${msErr.message}`);
      changedSchemes++;
    }
  }

  return { ids: items.map(({ q }) => contentId("question", q.key)), changedSchemes };
}
