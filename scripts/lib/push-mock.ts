import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { contentId } from "../../src/lib/content/ids";
import type { AuthoredMock } from "../../src/lib/content/schema";
import { PROGRAMME_VERSION } from "./push-theory";
import { marksOf, upsertQuestions } from "./push-questions";

/**
 * Uploads a mock exam: figures (public "media" bucket), original PDFs
 * (private "papers" bucket, staff only), its questions, and the exam itself,
 * then publishes a new exam version. Same deterministic ids as the seed builder.
 */
export async function pushMock(opts: {
  mock: AuthoredMock;
  figures: { file: string; path: string }[];
  pdfs: { file: string; path: string }[];
  status: "draft" | "published";
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Uploading needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  const db = createClient(url, key, { auth: { persistSession: false } });
  const m = opts.mock;

  for (const f of opts.figures) {
    const { error } = await db.storage.from("media").upload(f.path, readFileSync(f.file), { contentType: "image/png", upsert: true, cacheControl: "3600" });
    if (error) throw new Error(`figure ${f.path}: ${error.message}`);
  }
  for (const f of opts.pdfs) {
    const { error } = await db.storage.from("papers").upload(f.path, readFileSync(f.file), { contentType: "application/pdf", upsert: true });
    if (error) throw new Error(`pdf ${f.path}: ${error.message}`);
  }

  const { data: version } = await db.from("curriculum_versions").select("id").eq("code", PROGRAMME_VERSION).single();
  const versionId = version!.id as string;
  const [{ data: topics }, { data: paper }] = await Promise.all([
    db.from("topics").select("id, slug").eq("curriculum_version_id", versionId),
    db.from("paper_components").select("id").eq("curriculum_version_id", versionId).eq("number", m.paper).single(),
  ]);
  const topicId = new Map((topics ?? []).map((t) => [t.slug as string, t.id as string]));

  const { ids, changedSchemes } = await upsertQuestions(db, {
    versionId,
    questions: m.questions,
    status: opts.status,
    grade: m.grade ?? 12,
    topicIdOf: (q) => (q.topic ? (topicId.get(q.topic) ?? null) : null),
    defaultSource: "mock",
    defaultPractice: false,
    paperNumber: m.paper,
  });

  // Questions that were in an earlier import of this mock but are gone now are archived.
  const examId = contentId("exam", "mock", m.key);
  const prefix = m.questions[0]?.key.split("-")[0];
  if (prefix) {
    const { data: old } = await db.from("questions").select("id").eq("source_type", "past_paper").like("source_reference", `NIS ${m.year} Paper ${m.paper} %`).is("archived_at", null);
    const keep = new Set(ids);
    const stale = (old ?? []).map((q) => q.id as string).filter((id) => !keep.has(id));
    if (stale.length) await db.from("questions").update({ status: "archived", archived_at: new Date().toISOString() }).in("id", stale);
  }

  const row = {
    id: examId,
    curriculum_version_id: versionId,
    kind: "mock",
    title: m.title,
    description: m.description ?? null,
    instructions: m.instructions ?? null,
    topic_id: null,
    paper_component_id: paper?.id ?? null,
    year: m.year,
    grade: m.grade ?? 12,
    duration_minutes: m.duration,
    availability_start: m.availability_start ?? null,
    availability_end: m.availability_end ?? null,
    attempt_limit: m.attempt_limit ?? null,
    integrity_mode: m.integrity_mode ?? "warn",
    max_violations: m.max_violations ?? 3,
    show_mark_scheme: m.show_mark_scheme ?? true,
    teacher_resources: m.teacher_resources,
  };
  const { data: existing } = await db.from("exams").select("id").eq("id", examId).maybeSingle();
  const { error: eErr } = existing
    ? await db.from("exams").update(row).eq("id", examId)
    : await db.from("exams").insert({ ...row, status: "draft" });
  if (eErr) throw new Error(`exam: ${eErr.message}`);

  const keys = [...m.include, ...m.questions.map((q) => q.key)];
  await db.from("exam_questions").delete().eq("exam_id", examId);
  const { error: eqErr } = await db
    .from("exam_questions")
    .insert(keys.map((k, i) => ({ id: contentId("exam-question", examId, k), exam_id: examId, question_id: contentId("question", k), sort_order: i })));
  if (eqErr) throw new Error(`exam questions: ${eqErr.message}`);

  const marks = m.questions.reduce((s, q) => s + marksOf(q), 0);
  let note = `${m.questions.length} questions, ${marks} marks, ${changedSchemes} mark scheme(s) changed — exam left as draft`;
  if (opts.status === "published") {
    const { data: versionIdNew, error: pErr } = await db.rpc("publish_exam", { p_exam_id: examId });
    if (pErr) throw new Error(`publish exam: ${pErr.message}`);
    const { data: v } = await db.from("exam_versions").select("version, question_count, total_marks").eq("id", versionIdNew).single();
    note = `exam v${v?.version} published: ${m.questions.length} questions (${v?.question_count} parts), ${v?.total_marks} marks`;
  }
  await db.from("audit_logs").insert({ action: "mock.import", entity_type: "exam", entity_id: examId, details: { key: m.key, questions: ids.length, status: opts.status } });
  return { note };
}
