// Writes learner insights (table learner_insights) from the teacher's checks.
// An open insight with the same student, tag and topic is confirmed (seen + 1,
// new text) instead of duplicated; "resolve" closes one that no longer applies.
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export const insightInput = z
  .object({
    // who: an exam answer from the queue (student and topic come from its attempt) …
    result_id: z.string().uuid().optional(),
    // … or the student directly, with the topic's slug for gaps and strengths
    student_id: z.string().uuid().optional(),
    topic: z.string().optional(),
    kind: z.enum(["strength", "gap", "habit"]),
    tag: z.string().regex(/^[a-z0-9-]{2,60}$/),
    text: z.string().min(3).max(400),
    resolve: z.boolean().default(false),
  })
  .refine((x) => x.result_id || x.student_id, { message: "an insight needs result_id or student_id" });
export type InsightInput = z.infer<typeof insightInput>;

type Who = { student: string; topic: string | null; attempt: string | null };

async function whoOf(db: SupabaseClient, i: InsightInput): Promise<Who> {
  if (i.result_id) {
    const { data: r } = await db.from("grading_results").select("attempt_id, attempts(student_id, exams(topic_id))").eq("id", i.result_id).maybeSingle();
    const a = r?.attempts as unknown as { student_id: string; exams: { topic_id: string | null } | null } | null;
    if (!r || !a) throw new Error(`insight: answer ${i.result_id} not found`);
    return { student: a.student_id, topic: a.exams?.topic_id ?? null, attempt: r.attempt_id as string };
  }
  let topic: string | null = null;
  if (i.topic) {
    const { data: t } = await db.from("topics").select("id").eq("slug", i.topic).maybeSingle();
    if (!t) throw new Error(`insight: unknown topic ${i.topic}`);
    topic = t.id as string;
  }
  return { student: i.student_id!, topic, attempt: null };
}

/** Saves the insights; returns one line per insight for the log. */
export async function writeInsights(db: SupabaseClient, items: InsightInput[], dryRun: boolean): Promise<string[]> {
  const log: string[] = [];
  for (const i of items) {
    const w = await whoOf(db, i);
    // habits are about how a student answers, whatever the topic
    const topic = i.kind === "habit" ? null : w.topic;
    let q = db.from("learner_insights").select("id, seen").eq("student_id", w.student).eq("tag", i.tag).is("resolved_at", null);
    q = topic ? q.eq("topic_id", topic) : q.is("topic_id", null);
    const { data: open } = await q.maybeSingle();
    const now = new Date().toISOString();
    if (i.resolve) {
      log.push(`${w.student.slice(0, 8)} ${i.tag}: ${open ? "resolved" : "nothing to resolve"}`);
      if (open && !dryRun) await db.from("learner_insights").update({ resolved_at: now, updated_at: now }).eq("id", open.id);
      continue;
    }
    log.push(`${w.student.slice(0, 8)} ${i.kind} ${i.tag}: ${open ? `confirmed (${open.seen + 1})` : "new"}`);
    if (dryRun) continue;
    const { error } = open
      ? await db.from("learner_insights").update({ text: i.text, kind: i.kind, seen: open.seen + 1, last_attempt_id: w.attempt ?? undefined, updated_at: now }).eq("id", open.id)
      : await db.from("learner_insights").insert({ student_id: w.student, topic_id: topic, kind: i.kind, tag: i.tag, text: i.text, last_attempt_id: w.attempt });
    if (error) throw new Error(`insight ${i.tag}: ${error.message}`);
  }
  return log;
}
