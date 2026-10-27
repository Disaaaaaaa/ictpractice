/**
 * Uploads a summative assessment (SAU) from content/summative/<key>.json as a
 * DRAFT exam of kind "summative" for a unit. It is never published here: the
 * teacher reviews it, sets the time and publishes it in the exam builder,
 * then opens it for a class on the Summative Assessments page.
 *
 * content/summative/ is not in the repository (the papers and their mark
 * schemes must not be public).
 *
 *   npm run summative:apply -- <key> --owner <username> [--exam <exam id> | --variant-of <exam id>] [--publish]
 *
 * --owner  the teacher who will own the exam and its questions (so they can
 *          edit and publish them)
 * --exam   fill an existing draft summative instead of creating a new one;
 *          its title and settings are kept, only the duration, empty
 *          instructions and the question list are set
 * --no-dates  with --variant-of: do not copy the base exam's availability window
 * --variant-of  create the exam as another variant of that summative: its
 *          time, attempt limit, integrity rules and dates are copied from the
 *          base exam so that every variant is sat under the same conditions
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { authoredQuestionSchema } from "../src/lib/content/schema";
import { contentId } from "../src/lib/content/ids";
import { marksOf, upsertQuestions } from "./lib/push-questions";
import { PROGRAMME_VERSION } from "./lib/push-theory";

const schema = z.object({
  key: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  unit: z.string(),
  title: z.string().min(1).max(200),
  instructions: z.string().max(5000).optional(),
  duration: z.number().int().min(1).max(600),
  questions: z.array(authoredQuestionSchema).min(1),
});

const ROOT = join(__dirname, "..");
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { owner: { type: "string" }, exam: { type: "string" }, "variant-of": { type: "string" }, publish: { type: "boolean", default: false }, "no-dates": { type: "boolean", default: false } },
});

async function main() {
  const key = positionals[0];
  if (!key || !values.owner) throw new Error("Usage: npm run summative:apply -- <key> --owner <username> [--exam <exam id>]");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error("Uploading needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  const db = createClient(url, service, { auth: { persistSession: false } });
  const doc = schema.parse(JSON.parse(readFileSync(join(ROOT, "content/summative", `${key}.json`), "utf8")));

  const { data: version } = await db.from("curriculum_versions").select("id").eq("code", PROGRAMME_VERSION).single();
  const versionId = version!.id as string;
  const [{ data: units }, { data: topics }, { data: owner }] = await Promise.all([
    db.from("units").select("id, code, terms!inner(grades!inner(number, curriculum_version_id, for_student_grade))").eq("code", doc.unit),
    db.from("topics").select("id, slug").eq("curriculum_version_id", versionId),
    db.from("profiles").select("id, role").eq("username", values.owner).maybeSingle(),
  ]);
  type Unit = { id: string; terms: { grades: { number: number; curriculum_version_id: string; for_student_grade: number | null } } };
  const unit = ((units ?? []) as unknown as Unit[]).find((u) => u.terms.grades.curriculum_version_id === versionId && u.terms.grades.for_student_grade === null);
  if (!unit) throw new Error(`Unit ${doc.unit} not found`);
  if (!owner || owner.role === "student") throw new Error(`No teacher or admin with the username ${values.owner}`);
  const grade = unit.terms.grades.number;
  const topicId = new Map((topics ?? []).map((t) => [t.slug as string, t.id as string]));
  for (const q of doc.questions.flatMap((q) => [q, ...(q.parts ?? [])])) {
    if (q.topic && !topicId.has(q.topic)) throw new Error(`${q.key}: topic ${q.topic} not found`);
  }

  // Published so the exam can be published later; practice stays off, which keeps
  // the questions out of everything a student can read until they sit the exam.
  const { ids, changedSchemes } = await upsertQuestions(db, {
    versionId,
    questions: doc.questions.map((q) => ({ ...q, practice: false, parts: q.parts?.map((p) => ({ ...p, practice: false })) })),
    status: "published",
    grade,
    topicIdOf: (q) => (q.topic ? (topicId.get(q.topic) ?? null) : null),
    defaultSource: "teacher",
    defaultPractice: false,
  });
  await db.from("questions").update({ created_by: owner.id }).in("id", ids);

  const examId = values.exam ?? contentId("exam", "summative", doc.key);
  const { data: existing } = await db.from("exams").select("id, kind, title, instructions, status, current_version_id").eq("id", examId).maybeSingle();
  if (values.exam && !existing) throw new Error(`Exam ${values.exam} not found`);
  if (existing && existing.kind !== "summative") throw new Error("That exam is not a summative assessment");
  const baseId = values["variant-of"];
  if (existing) {
    const { error } = await db
      .from("exams")
      .update({ ...(baseId ? {} : { duration_minutes: doc.duration }), unit_id: unit.id, grade, ...(existing.instructions ? {} : { instructions: doc.instructions ?? null }) })
      .eq("id", examId);
    if (error) throw new Error(`exam: ${error.message}`);
  } else if (baseId) {
    // Another variant: same conditions as the base exam.
    const { data: base } = await db.from("exams").select("*").eq("id", baseId).maybeSingle();
    if (!base || base.kind !== "summative" || base.variant_of) throw new Error("--variant-of must be the base exam of a summative assessment");
    const { data: siblings } = await db.from("exams").select("variant_no").eq("variant_of", baseId);
    const { error } = await db.from("exams").insert({
      id: examId,
      curriculum_version_id: versionId,
      kind: "summative",
      title: doc.title,
      description: base.description,
      instructions: base.instructions ?? doc.instructions ?? null,
      unit_id: base.unit_id,
      grade: base.grade,
      duration_minutes: base.duration_minutes,
      // --no-dates: e.g. a retake variant, sat through an assignment with its own dates
      availability_start: values["no-dates"] ? null : base.availability_start,
      availability_end: values["no-dates"] ? null : base.availability_end,
      attempt_limit: base.attempt_limit,
      integrity_mode: base.integrity_mode,
      max_violations: base.max_violations,
      require_fullscreen: base.require_fullscreen,
      show_results: base.show_results,
      results_release_at: base.results_release_at,
      show_mark_scheme: base.show_mark_scheme,
      variant_of: baseId,
      variant_no: Math.max(1, ...(siblings ?? []).map((x) => x.variant_no as number)) + 1,
      status: "draft",
      created_by: owner.id,
    });
    if (error) throw new Error(`exam: ${error.message}`);
  } else {
    const { error } = await db.from("exams").insert({
      id: examId,
      curriculum_version_id: versionId,
      kind: "summative",
      title: doc.title,
      instructions: doc.instructions ?? null,
      unit_id: unit.id,
      grade,
      duration_minutes: doc.duration,
      attempt_limit: 1,
      status: "draft",
      integrity_mode: "warn",
      max_violations: 3,
      show_mark_scheme: false,
      created_by: owner.id,
    });
    if (error) throw new Error(`exam: ${error.message}`);
  }

  await db.from("exam_questions").delete().eq("exam_id", examId);
  const { error: eqErr } = await db
    .from("exam_questions")
    .insert(doc.questions.map((q, i) => ({ exam_id: examId, question_id: contentId("question", q.key), sort_order: i })));
  if (eqErr) throw new Error(`exam questions: ${eqErr.message}`);

  // Only on request: publishing makes the exam usable, but it stays hidden until access is opened for a class.
  let published = "";
  if (values.publish) {
    const { error: pErr } = await db.rpc("publish_exam", { p_exam_id: examId });
    if (pErr) throw new Error(`publish: ${pErr.message}`);
    const { data: e } = await db.from("exams").select("status, exam_versions!exams_current_version_fk(version, total_marks)").eq("id", examId).single();
    published = ` — PUBLISHED (${e?.status})`;
  }
  await db.from("audit_logs").insert({ action: "summative.import", entity_type: "exam", entity_id: examId, details: { key: doc.key, questions: ids.length } });
  const marks = doc.questions.reduce((s, q) => s + marksOf(q), 0);
  console.log(
    `✓ ${doc.key}: ${doc.questions.length} questions (${ids.length} rows), ${marks} marks, ${doc.duration} min, ${changedSchemes} mark scheme(s) written — ` +
      `exam "${existing?.title ?? doc.title}" is ${existing?.status ?? "draft"}${existing?.current_version_id ? " (already has a published version; publish again to release these questions)" : ", not published"}`,
  );
  console.log(`  /teacher/exams/${examId}${published}`);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
