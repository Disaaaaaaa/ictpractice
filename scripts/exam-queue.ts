/**
 * Exports the exam answers waiting for the teacher's check (written answers
 * while exam marking is in queue mode, or answers the AI could not mark), so
 * they can be marked in one sitting and written back with exam-grade.ts.
 *
 *   npx tsx --env-file=.env.local scripts/exam-queue.ts --out <dir> [--topic <slug>]
 *
 * <dir>/manifest.json: one entry per answer with the question, its mark
 * scheme and the student's answer.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";

const { values } = parseArgs({ options: { out: { type: "string" }, topic: { type: "string" } } });

type PaperQ = { id: string; question_text: string; question_type: string; marks: number; content?: unknown; group_stem?: string | null; part_label?: string | null; group_title?: string | null };

async function main() {
  if (!values.out) throw new Error("Usage: scripts/exam-queue.ts --out <dir> [--topic <slug>]");
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data: results, error } = await db
    .from("grading_results")
    .select("id, attempt_id, question_id, max_mark, answer_id, attempts!inner(id, student_id, exam_version_id, submitted_at, status, exams!inner(title, lesson_no, topics(slug)))")
    .eq("needs_review", true)
    .is("teacher_override_mark", null)
    .neq("attempts.status", "IN_PROGRESS");
  if (error) throw new Error(error.message);
  type Row = {
    id: string; attempt_id: string; question_id: string; max_mark: number; answer_id: string | null;
    attempts: { id: string; student_id: string; exam_version_id: string; submitted_at: string; exams: { title: string; lesson_no: number | null; topics: { slug: string } | null } };
  };
  let rows = (data(results) as Row[]);
  if (values.topic) rows = rows.filter((r) => r.attempts.exams.topics?.slug === values.topic);

  const versions = [...new Set(rows.map((r) => r.attempts.exam_version_id))];
  const { data: payloads } = await db.from("exam_version_payloads").select("exam_version_id, paper, marking").in("exam_version_id", versions.concat("00000000-0000-0000-0000-000000000000"));
  const byVersion = new Map((payloads ?? []).map((p) => [p.exam_version_id as string, p]));
  const answerIds = rows.map((r) => r.answer_id).filter((x): x is string => Boolean(x));
  const { data: answers } = await db.from("answers").select("id, submitted_answer").in("id", answerIds.concat("00000000-0000-0000-0000-000000000000"));
  const answerBy = new Map((answers ?? []).map((a) => [a.id as string, a.submitted_answer]));
  const students = [...new Set(rows.map((r) => r.attempts.student_id))];
  const { data: profiles } = await db.from("profiles").select("id, first_name, last_name, username").in("id", students.concat("00000000-0000-0000-0000-000000000000"));
  const nameOf = new Map((profiles ?? []).map((p) => [p.id as string, `${p.first_name} ${p.last_name}`.trim() || (p.username as string)]));

  const manifest = rows
    .sort((a, b) => a.attempts.exams.title.localeCompare(b.attempts.exams.title) || a.question_id.localeCompare(b.question_id) || a.attempts.submitted_at.localeCompare(b.attempts.submitted_at))
    .map((r) => {
      const p = byVersion.get(r.attempts.exam_version_id);
      const q = ((p?.paper as { questions: PaperQ[] } | undefined)?.questions ?? []).find((x) => x.id === r.question_id);
      const m = (p?.marking as Record<string, Record<string, unknown>> | undefined)?.[r.question_id] ?? {};
      return {
        result_id: r.id,
        exam: r.attempts.exams.title,
        student: nameOf.get(r.attempts.student_id) ?? r.attempts.student_id,
        submitted: r.attempts.submitted_at,
        question: q ? { part: q.part_label ?? null, group: q.group_title ?? null, stem: q.group_stem ?? null, text: q.question_text, type: q.question_type, content: q.content ?? null } : null,
        max_mark: Number(r.max_mark),
        mark_scheme: { mark_scheme: m.mark_scheme ?? null, points: m.marking_points ?? null, model_answer: m.model_answer ?? null, accepted: m.accepted_answers ?? null },
        answer: r.answer_id ? (answerBy.get(r.answer_id) ?? null) : null,
      };
    });
  mkdirSync(values.out, { recursive: true });
  writeFileSync(join(values.out, "manifest.json"), JSON.stringify(manifest, null, 2));
  const per = new Map<string, number>();
  for (const x of manifest) per.set(x.exam, (per.get(x.exam) ?? 0) + 1);
  console.log(`${manifest.length} answers waiting for the teacher's check → ${values.out}/manifest.json`);
  for (const [k, n] of per) console.log(`  ${k}: ${n}`);
}
const data = <T>(x: T) => x ?? [];

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
