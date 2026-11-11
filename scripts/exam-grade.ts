/**
 * Writes the teacher's marks for exam answers exported by exam-queue.ts.
 *
 *   npx tsx --env-file=.env.local scripts/exam-grade.ts <marks.json> [--dry-run]
 *
 * marks.json: [ { "result_id": "...", "mark": 2, "feedback": "What was good and what was missing" }, ... ]
 *   or { "marks": [ … ], "insights": [ … ] } — insights are what the teacher noticed
 *   about a student (see scripts/lib/insights.ts and src/lib/insights.ts):
 *   { "result_id": "<an answer of the student>", "kind": "habit", "tag": "no-scenario-link",
 *     "text": "Answers are not linked to the scenario." }   ("resolve": true closes one)
 *
 * Each mark is stored as the teacher's mark (as in the Results page), the
 * attempt's score is recomputed, and the student is notified once all of
 * the attempt's answers are marked.
 */
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { insightInput, writeInsights } from "./lib/insights";

const mark = z.object({ result_id: z.string().uuid(), mark: z.number().min(0), feedback: z.string().max(2000).default("") });
const schema = z.union([z.array(mark).transform((marks) => ({ marks, insights: [] })), z.object({ marks: z.array(mark).default([]), insights: z.array(insightInput).default([]) })]);
const { values, positionals } = parseArgs({ allowPositionals: true, options: { "dry-run": { type: "boolean", default: false } } });

async function main() {
  if (!positionals[0]) throw new Error("Usage: scripts/exam-grade.ts <marks.json> [--dry-run]");
  const { marks, insights } = schema.parse(JSON.parse(readFileSync(positionals[0], "utf8")));
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const attempts = new Set<string>();
  for (const m of marks) {
    const { data: r } = await db.from("grading_results").select("id, attempt_id, max_mark, original_ai_mark, final_mark, teacher_override_mark").eq("id", m.result_id).maybeSingle();
    if (!r) {
      // a written answer from a lesson taught live: the mark goes on the answer, the feedback to every member
      const { data: l } = await db.from("live_answers").select("id, members, max_mark, answer, live_sessions(lesson_no, topics(title))").eq("id", m.result_id).maybeSingle();
      if (!l) throw new Error(`${m.result_id}: not found`);
      if (m.mark > Number(l.max_mark)) throw new Error(`${m.result_id}: ${m.mark} is more than ${l.max_mark}`);
      console.log(`${m.result_id}: ${m.mark}/${l.max_mark} (lesson task, ${l.members.length} student${l.members.length === 1 ? "" : "s"})`);
      if (values["dry-run"]) continue;
      // the feedback is kept with the answer, so the group sees it on the Lesson page at once
      await db.from("live_answers").update({ awarded: m.mark, needs_review: false, answer: { ...(l.answer as object), teacher_feedback: m.feedback || null } }).eq("id", m.result_id);
      const s = l.live_sessions as unknown as { lesson_no: number; topics: { title: string } | null } | null;
      await db.from("notifications").insert(
        (l.members as string[]).map((id) => ({
          user_id: id, type: "feedback", title: `${s?.topics?.title ?? "Lesson"} · Lesson ${s?.lesson_no ?? ""}: ${m.mark}/${Number(l.max_mark)}`,
          body: m.feedback || "Your lesson task has been checked.", link: "/live",
        })),
      );
      continue;
    }
    if (m.mark > Number(r.max_mark)) throw new Error(`${m.result_id}: ${m.mark} is more than ${r.max_mark}`);
    console.log(`${m.result_id}: ${m.mark}/${r.max_mark}${r.teacher_override_mark != null ? " (replaces an earlier teacher mark)" : ""}`);
    if (values["dry-run"]) continue;
    const { error } = await db
      .from("grading_results")
      .update({ teacher_override_mark: m.mark, teacher_feedback: m.feedback || null, needs_review: false, reviewed_at: new Date().toISOString(), status: "COMPLETE", error: null })
      .eq("id", m.result_id);
    if (error) throw new Error(`${m.result_id}: ${error.message}`);
    await db.from("grade_audit").insert({
      grading_result_id: m.result_id, action: "override", original_ai_mark: r.original_ai_mark, previous_mark: r.final_mark, final_mark: m.mark,
      reason: "Marked in the teacher's checking session",
    });
    attempts.add(r.attempt_id as string);
  }
  for (const id of attempts) {
    await db.rpc("recompute_attempt_score", { p_attempt_id: id });
    const { data: a } = await db.from("attempts").select("student_id, status, percentage, exams(title)").eq("id", id).single();
    if (!a) continue;
    await db.rpc("recompute_mastery", { p_student_id: a.student_id });
    if (a.status === "GRADED") {
      const title = (a.exams as unknown as { title: string } | null)?.title ?? "Your exam";
      await db.from("notifications").insert({
        user_id: a.student_id, type: "result", title: `${title}: ${Math.round(Number(a.percentage))}%`, body: "Your written answers have been marked.", link: `/results/${id}`,
      });
    }
    console.log(`attempt ${id}: ${a.status} ${a.percentage != null ? `${Math.round(Number(a.percentage))}%` : ""}`);
  }
  if (insights.length) for (const line of await writeInsights(db, insights, values["dry-run"])) console.log(`insight ${line}`);
  if (!values["dry-run"]) await db.from("audit_logs").insert({ action: "exam.teacher_check", entity_type: "grading_result", details: { marked: marks.length, attempts: attempts.size, insights: insights.length } });
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
