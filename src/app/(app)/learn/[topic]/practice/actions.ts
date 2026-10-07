"use server";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { gradeAnswer } from "@/lib/grading/engine";
import { getGradingSettings } from "@/lib/grading/attempt-grader";
import type { MarkingPointResult } from "@/lib/grading/deterministic";
import type { AcceptedAnswers, AnswerData, MarkingEntry, MarkingPoint } from "@/lib/questions/types";
import type { MarkScheme, Question } from "@/lib/db-types";

export type PracticeResult =
  | {
      ok: true;
      awarded: number | null;
      max: number;
      feedback: string | null;
      points: MarkingPointResult[];
      needsReview: boolean;
      correctKeys?: string[];
      fullMarks: boolean;
    }
  | { ok: false; error: string };

export type PracticeReveal =
  | { ok: true; explanation: string | null; markScheme: string | null; modelAnswer: string | null; points: MarkingPoint[] }
  | { ok: false; error: string };

const LIMITS = { perMinute: 30, aiPerTenMinutes: 20 };

/**
 * Loads a question and its current mark scheme for practice, refusing when the
 * question is not open for practice or is part of an exam the student is sitting.
 */
async function loadForPractice(studentId: string, questionId: string) {
  const admin = createAdminClient();
  const { data: q } = await admin
    .from("questions")
    .select("*, question_objectives(learning_objectives(code)), parent:parent_id(question_text)")
    .eq("id", questionId)
    .eq("status", "published")
    .eq("practice_enabled", true)
    .is("archived_at", null)
    .maybeSingle();
  if (!q) return { error: "This question is not available for practice." } as const;

  const { data: open } = await admin
    .from("attempts")
    .select("exam_version_id")
    .eq("student_id", studentId)
    .eq("status", "IN_PROGRESS");
  if (open?.length) {
    const { data: payloads } = await admin
      .from("exam_version_payloads")
      .select("paper")
      .in("exam_version_id", open.map((o) => o.exam_version_id));
    const inExam = (payloads ?? []).some((p) =>
      ((p.paper as { questions: { id: string }[] }).questions ?? []).some((x) => x.id === questionId),
    );
    if (inExam) return { error: "Finish your exam before practising this question." } as const;
  }

  const { data: scheme } = await admin
    .from("mark_schemes")
    .select("*")
    .eq("question_id", questionId)
    .eq("is_current", true)
    .maybeSingle();
  return { admin, question: q as Question & {
      question_objectives: { learning_objectives: { code: string } }[];
      parent: { question_text: string } | null;
    }, scheme: scheme as MarkScheme | null };
}

function correctKeysOf(accepted: AcceptedAnswers): string[] | undefined {
  const c = accepted.correct;
  if (typeof c === "string") return [c];
  if (Array.isArray(c)) return c;
  return undefined;
}

export async function checkPracticeAnswer(questionId: string, answer: AnswerData | null): Promise<PracticeResult> {
  const profile = await requireProfile();
  const loaded = await loadForPractice(profile.id, questionId);
  if ("error" in loaded) return { ok: false, error: loaded.error ?? "Unavailable" };
  const { admin, question, scheme } = loaded;
  if (!scheme) return { ok: false, error: "This question has no mark scheme yet." };
  if (JSON.stringify(answer ?? {}).length > 60_000) return { ok: false, error: "Your answer is too long." };

  const minuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count: recent } = await admin
    .from("practice_attempts")
    .select("id", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .gte("created_at", minuteAgo);
  if ((recent ?? 0) >= LIMITS.perMinute) return { ok: false, error: "You are checking answers very quickly. Wait a moment and try again." };

  const usesAI = question.grading_method === "AI" || question.grading_method === "HYBRID";
  if (usesAI) {
    const { count: aiRecent } = await admin
      .from("practice_attempts")
      .select("id", { count: "exact", head: true })
      .eq("student_id", profile.id)
      .in("grading_method", ["AI", "HYBRID"])
      .gte("created_at", new Date(Date.now() - 10 * 60_000).toISOString());
    if ((aiRecent ?? 0) >= LIMITS.aiPerTenMinutes) {
      return { ok: false, error: "AI feedback limit reached for now. Try again in a few minutes." };
    }
  }

  const marking: MarkingEntry = {
    question_type: question.question_type,
    grading_method: question.grading_method,
    marks: question.marks,
    command_word: question.command_word,
    mark_scheme: scheme.mark_scheme,
    marking_points: scheme.marking_points,
    model_answer: scheme.model_answer,
    accepted_answers: scheme.accepted_answers,
    ai_grading_instructions: scheme.ai_grading_instructions,
    explanation: scheme.explanation,
  };
  const settings = await getGradingSettings(admin);
  const outcome = await gradeAnswer({
    questionText: question.question_text,
    questionType: question.question_type,
    objectives: question.question_objectives.map((o) => o.learning_objectives.code),
    marking,
    answer,
    aiConfidenceThreshold: settings.threshold,
    content: question.content,
    groupStem: question.parent?.question_text ?? null,
  });

  if (outcome.status === "FAILED") {
    return { ok: false, error: "Automatic feedback is temporarily unavailable. Try again later." };
  }

  // Only marked practice counts towards mastery (blank answers are not recorded).
  if (outcome.awarded !== null && answer) {
    await admin.from("practice_attempts").insert({
      student_id: profile.id,
      question_id: questionId,
      answer_data: answer,
      awarded_mark: outcome.awarded,
      max_mark: outcome.max,
      grading_method: outcome.method,
      feedback: outcome.feedback,
    });
    await admin.rpc("recompute_mastery", { p_student_id: profile.id });
    await admin.from("profiles").update({ last_activity_at: new Date().toISOString() }).eq("id", profile.id);
  }

  return {
    ok: true,
    awarded: outcome.awarded,
    max: outcome.max,
    feedback:
      outcome.feedback ??
      (outcome.needsReview ? "This answer cannot be marked automatically — ask your teacher to check it." : null),
    points: outcome.points,
    needsReview: outcome.needsReview,
    correctKeys: outcome.awarded !== null ? correctKeysOf(scheme.accepted_answers) : undefined,
    fullMarks: outcome.awarded === outcome.max,
  };
}

export async function revealPractice(questionId: string): Promise<PracticeReveal> {
  const profile = await requireProfile();
  // Explanations, mark schemes and model answers are for staff only.
  if (profile.role === "student") return { ok: false, error: "The mark scheme is available to teachers only." };
  const loaded = await loadForPractice(profile.id, questionId);
  if ("error" in loaded) return { ok: false, error: loaded.error ?? "Unavailable" };
  const { scheme } = loaded;
  if (!scheme) return { ok: false, error: "This question has no mark scheme yet." };
  return {
    ok: true,
    explanation: scheme.explanation,
    markScheme: scheme.mark_scheme || null,
    modelAnswer: scheme.model_answer,
    points: scheme.marking_points ?? [],
  };
}
