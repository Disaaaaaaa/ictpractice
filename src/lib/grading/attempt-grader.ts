import "server-only";
import { createAdminClient } from "../supabase/admin";
import { gradeAnswer, type GradeOutcome } from "./engine";
import type { AnswerData, MarkingEntry, Paper } from "../questions/types";

type Admin = ReturnType<typeof createAdminClient>;

export async function getGradingSettings(admin: Admin) {
  const { data } = await admin.from("system_settings").select("value").eq("key", "ai_grading").maybeSingle();
  const v = (data?.value ?? {}) as { confidence_threshold?: number; max_retries?: number };
  return { threshold: v.confidence_threshold ?? 0.8, maxRetries: v.max_retries ?? 5 };
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Marks a submitted attempt. Idempotent and safe to call repeatedly (after
 * submit, from the retry cron, or when a teacher requests a regrade): it takes
 * a lock on the attempt, marks only results that are not COMPLETE, and leaves
 * failed AI calls as FAILED so a later run retries them. A submission is never
 * lost because of an OpenAI error.
 */
export async function gradeAttempt(attemptId: string): Promise<{ status: string; graded: number } | null> {
  const admin = createAdminClient();
  const staleBefore = new Date(Date.now() - 10 * 60_000).toISOString();

  const { data: locked } = await admin
    .from("attempts")
    .update({ grading_status: "IN_PROGRESS", grading_started_at: new Date().toISOString() })
    .eq("id", attemptId)
    .neq("status", "IN_PROGRESS")
    .or(`grading_status.in.(PENDING,FAILED),and(grading_status.eq.IN_PROGRESS,grading_started_at.lt.${staleBefore})`)
    .select("id, student_id, exam_version_id")
    .maybeSingle();
  if (!locked) return null; // already graded or being graded

  try {
    const [{ data: payload }, { data: answers }, { data: existing }, settings] = await Promise.all([
      admin.from("exam_version_payloads").select("paper, marking").eq("exam_version_id", locked.exam_version_id).single(),
      admin.from("answers").select("id, question_id, submitted_answer").eq("attempt_id", attemptId),
      admin.from("grading_results").select("question_id, status, retries").eq("attempt_id", attemptId),
      getGradingSettings(admin),
    ]);
    if (!payload) throw new Error("exam version payload missing");
    const paper = payload.paper as Paper;
    const marking = payload.marking as Record<string, MarkingEntry>;
    const answerBy = new Map((answers ?? []).map((a) => [a.question_id as string, a]));
    const resultBy = new Map((existing ?? []).map((r) => [r.question_id as string, r]));

    // Make sure every question has a row, so the score cannot complete early.
    const missing = paper.questions.filter((q) => !resultBy.has(q.id));
    if (missing.length) {
      await admin.from("grading_results").upsert(
        missing.map((q) => ({
          attempt_id: attemptId,
          question_id: q.id,
          answer_id: answerBy.get(q.id)?.id ?? null,
          grading_method: marking[q.id]?.grading_method ?? "MANUAL",
          status: "PENDING",
          max_mark: q.marks,
        })),
        { onConflict: "attempt_id,question_id", ignoreDuplicates: true },
      );
    }

    const todo = paper.questions.filter((q) => resultBy.get(q.id)?.status !== "COMPLETE");
    await mapLimit(todo, 3, async (q) => {
      const m = marking[q.id];
      const answer = (answerBy.get(q.id)?.submitted_answer ?? null) as AnswerData | null;
      const retries = (resultBy.get(q.id)?.retries ?? 0) + 1;
      let outcome: GradeOutcome;
      if (!m) {
        outcome = {
          status: "COMPLETE", method: "MANUAL", awarded: null, max: q.marks, confidence: null, points: [],
          feedback: null, needsReview: true, originalAiMark: null, aiModel: null, promptVersion: null,
          error: "No marking data in this exam version",
        };
      } else {
        outcome = await gradeAnswer({
          questionText: q.question_text,
          questionType: q.question_type,
          objectives: q.objectives.map((o) => o.code),
          marking: m,
          answer,
          aiConfidenceThreshold: settings.threshold,
          examInstructions: paper.exam.instructions,
          content: q.content,
          groupStem: q.group_stem ?? null,
        });
      }
      // Give up on AI after max retries: the teacher marks it.
      if (outcome.status === "FAILED" && retries >= settings.maxRetries) {
        outcome = { ...outcome, status: "COMPLETE", needsReview: true };
      }
      await admin
        .from("grading_results")
        .update({
          answer_id: answerBy.get(q.id)?.id ?? null,
          grading_method: outcome.method,
          status: outcome.status,
          awarded_mark: outcome.awarded,
          max_mark: q.marks,
          feedback: outcome.feedback,
          confidence: outcome.confidence,
          marking_points: outcome.points,
          needs_review: outcome.needsReview,
          ai_model: outcome.aiModel,
          prompt_version: outcome.promptVersion,
          original_ai_mark: outcome.originalAiMark,
          graded_at: outcome.status === "COMPLETE" ? new Date().toISOString() : null,
          retries,
          error: outcome.error,
        })
        .eq("attempt_id", attemptId)
        .eq("question_id", q.id)
        .is("teacher_override_mark", null);
    });

    await admin.rpc("recompute_attempt_score", { p_attempt_id: attemptId });
    await admin.rpc("recompute_mastery", { p_student_id: locked.student_id });
    const { data: after } = await admin.from("attempts").select("status").eq("id", attemptId).single();
    return { status: after?.status ?? "SUBMITTED", graded: todo.length };
  } catch (e) {
    await admin.from("attempts").update({ grading_status: "FAILED" }).eq("id", attemptId);
    throw e;
  }
}

/** Retries everything that is waiting: used by the cron route and the teacher dashboard. */
export async function gradePendingAttempts(limit = 20): Promise<number> {
  const admin = createAdminClient();
  await admin.rpc("expire_overdue_attempts");
  const staleBefore = new Date(Date.now() - 10 * 60_000).toISOString();
  const { data } = await admin
    .from("attempts")
    .select("id")
    .neq("status", "IN_PROGRESS")
    .or(`grading_status.in.(PENDING,FAILED),and(grading_status.eq.IN_PROGRESS,grading_started_at.lt.${staleBefore})`)
    .order("submitted_at")
    .limit(limit);
  let n = 0;
  for (const a of data ?? []) {
    try {
      if (await gradeAttempt(a.id)) n++;
    } catch {
      // stays FAILED; next run retries
    }
  }
  return n;
}
