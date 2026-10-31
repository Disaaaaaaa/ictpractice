import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { contentId } from "../../src/lib/content/ids";
import type { AuthoredTopic } from "../../src/lib/content/schema";
import { marksOf } from "./push-questions";
import { PROGRAMME_VERSION } from "./push-theory";

/**
 * Writes a topic's lessons (content/topics/<slug>.json → "lessons"): the
 * lesson rows, the lesson of every theory section and practice question, and
 * one short Exam Mode test per lesson. Run after the theory and questions
 * are uploaded (theory:apply and questions:apply call it).
 *
 * A lesson exam is republished only when its questions or time change, so
 * re-running it does not pile up versions.
 */
export async function pushLessons(db: SupabaseClient, slug: string, topic: AuthoredTopic, title: string, grade: number) {
  if (!topic.lessons?.length) return "no lessons";
  const { data: version } = await db.from("curriculum_versions").select("id").eq("code", PROGRAMME_VERSION).single();
  const { data: row } = await db.from("topics").select("id").eq("curriculum_version_id", version!.id).eq("slug", slug).single();
  if (!row) throw new Error(`Topic ${slug} not found`);
  const topicId = row.id as string;
  const lessons = topic.lessons;

  const { error: lErr } = await db
    .from("topic_lessons")
    .upsert(lessons.map((l, i) => ({ topic_id: topicId, number: i + 1, title: l.title })), { onConflict: "topic_id,number" });
  if (lErr) throw new Error(`lessons: ${lErr.message}`);
  await db.from("topic_lessons").delete().eq("topic_id", topicId).gt("number", lessons.length);

  // Theory sections by title.
  const { data: pack } = await db.from("theory_packs").select("id").eq("topic_id", topicId).maybeSingle();
  if (pack) {
    const { data: sections } = await db.from("theory_sections").select("id, title").eq("theory_pack_id", pack.id);
    for (const s of sections ?? []) {
      const n = lessons.findIndex((l) => l.sections.includes(s.title as string));
      await db.from("theory_sections").update({ lesson_no: n < 0 ? null : n + 1 }).eq("id", s.id);
    }
  }

  // Questions: clear, then set each lesson's questions and their parts.
  await db.from("questions").update({ lesson_no: null }).eq("topic_id", topicId);
  for (const [i, l] of lessons.entries()) {
    const ids = l.questions.map((k) => contentId("question", k));
    const { error } = await db.from("questions").update({ lesson_no: i + 1 }).in("id", ids);
    if (error) throw new Error(`lesson ${i + 1} questions: ${error.message}`);
    await db.from("questions").update({ lesson_no: i + 1 }).in("parent_id", ids);
  }

  // One exam per lesson.
  const notes: string[] = [];
  for (const [i, l] of lessons.entries()) {
    const n = i + 1;
    const examId = contentId("exam", "lesson", slug, n);
    if (!l.exam) {
      await db.from("exams").update({ archived_at: new Date().toISOString(), status: "archived" }).eq("id", examId).is("archived_at", null);
      continue;
    }
    const qs = l.exam.questions.map((k) => topic.questions.find((q) => q.key === k)!);
    const marks = qs.reduce((s, q) => s + marksOf(q), 0);
    const examTitle = l.exam.title ?? `${title} — Lesson ${n} test`;
    const fields = {
      title: examTitle,
      description: `Lesson ${n} of ${title}: ${l.title}`,
      instructions: `Answer all questions. Total: ${marks} marks. Time: ${l.exam.duration} minutes. Your first attempt counts towards your SAU points.`,
      duration_minutes: l.exam.duration,
      archived_at: null,
    };
    const { data: existing } = await db.from("exams").select("id, duration_minutes, current_version_id").eq("id", examId).maybeSingle();
    if (!existing) {
      const { error } = await db.from("exams").insert({
        id: examId,
        curriculum_version_id: version!.id,
        kind: "topic",
        topic_id: topicId,
        lesson_no: n,
        grade,
        status: "draft",
        integrity_mode: "warn",
        max_violations: 3,
        show_mark_scheme: true,
        ...fields,
      });
      if (error) throw new Error(`lesson ${n} exam: ${error.message}`);
    } else {
      await db.from("exams").update(fields).eq("id", examId);
    }
    const wanted = qs.map((q) => contentId("question", q.key));
    const { data: current } = await db.from("exam_questions").select("question_id").eq("exam_id", examId).order("sort_order");
    const same =
      existing?.current_version_id &&
      existing.duration_minutes === l.exam.duration &&
      JSON.stringify((current ?? []).map((c) => c.question_id)) === JSON.stringify(wanted);
    if (same) {
      notes.push(`L${n} test unchanged`);
      continue;
    }
    await db.from("exam_questions").delete().eq("exam_id", examId);
    const { error: eqErr } = await db
      .from("exam_questions")
      .insert(qs.map((q, k) => ({ id: contentId("exam-question", examId, q.key), exam_id: examId, question_id: contentId("question", q.key), sort_order: k })));
    if (eqErr) throw new Error(`lesson ${n} exam questions: ${eqErr.message}`);
    const { error: pErr } = await db.rpc("publish_exam", { p_exam_id: examId });
    if (pErr) throw new Error(`publish lesson ${n} exam: ${pErr.message}`);
    notes.push(`L${n} test: ${qs.length} q, ${marks} marks, ${l.exam.duration} min`);
  }
  // Lessons that no longer exist lose their exams.
  const { data: extra } = await db.from("exams").select("id").eq("topic_id", topicId).gt("lesson_no", lessons.length).is("archived_at", null);
  if (extra?.length) await db.from("exams").update({ archived_at: new Date().toISOString(), status: "archived" }).in("id", extra.map((e) => e.id));
  return `${lessons.length} lessons; ${notes.join("; ")}`;
}

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  return createClient(url, key, { auth: { persistSession: false } });
}
