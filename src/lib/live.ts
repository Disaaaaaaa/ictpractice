import "server-only";
import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";
import { gradeAnswer } from "./grading/engine";
import { getGradingSettings } from "./grading/attempt-grader";
import type { AnswerData, MarkingEntry } from "./questions/types";
import type { MarkScheme, Question } from "./db-types";
import type { AnswerableQuestion } from "@/components/questions/answer-input";
import type { LivePlan, LiveState } from "./live-plan";

// Lessons taught live: sessions, their questions and marking.
// See supabase/migrations/20261109000027_live_lessons.sql.

type Supa = Awaited<ReturnType<typeof createClient>>;

export type LiveSession = {
  id: string;
  class_id: string;
  topic_id: string;
  lesson_no: number;
  teacher_id: string;
  plan: LivePlan;
  state: LiveState;
  started_at: string;
  ended_at: string | null;
};

export type LiveQuestion = AnswerableQuestion & {
  title: string;
  question_text: string;
  marks: number;
  grading_method: string;
  practice_enabled: boolean;
};

export type LiveAnswer = {
  id: string;
  block_id: string;
  item: string;
  question_id: string | null;
  student_id: string;
  members: string[];
  answer: AnswerData & { selected?: string | string[] };
  awarded: number | null;
  max_mark: number | null;
  needs_review: boolean;
  updated_at: string;
};

export async function getSession(supabase: Supa, id: string): Promise<LiveSession | null> {
  const { data } = await supabase.from("live_sessions").select("*").eq("id", id).maybeSingle();
  return (data as LiveSession | null) ?? null;
}

/** The lesson running now in one of the student's classes. */
export async function getActiveSessionForStudent(supabase: Supa, studentId: string): Promise<LiveSession | null> {
  const { data: classes } = await supabase.from("class_members").select("class_id").eq("student_id", studentId).eq("status", "active");
  const ids = (classes ?? []).map((c) => c.class_id as string);
  if (!ids.length) return null;
  const { data } = await supabase
    .from("live_sessions")
    .select("*")
    .in("class_id", ids)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as LiveSession | null) ?? null;
}

/** The questions of a plan, keyed by id (loaded with the service role: lesson tasks are not practice). */
export async function getPlanQuestions(plan: LivePlan): Promise<Map<string, LiveQuestion>> {
  const ids = [...new Set(plan.stages.flatMap((s) => s.blocks.flatMap((b) => [...b.tasks, ...b.together].map((q) => q.id))))];
  if (!ids.length) return new Map();
  const { data } = await createAdminClient()
    .from("questions")
    .select("id, title, question_text, question_type, marks, grading_method, content, practice_enabled, question_options(key, content, sort_order)")
    .in("id", ids);
  type Row = Omit<LiveQuestion, "options"> & { question_options: { key: string; content: string; sort_order: number }[] };
  return new Map(
    ((data ?? []) as unknown as Row[]).map((r) => [
      r.id,
      {
        ...r,
        options: [...r.question_options].sort((a, b) => a.sort_order - b.sort_order).map(({ key, content }) => ({ key, content })),
      },
    ]),
  );
}

/** Marks an answer the same way as practice (no AI: written answers wait for the teacher). */
export async function markLiveAnswer(questionId: string, answer: AnswerData) {
  const admin = createAdminClient();
  const [{ data: q }, { data: scheme }] = await Promise.all([
    admin.from("questions").select("*, question_objectives(learning_objectives(code)), parent:parent_id(question_text)").eq("id", questionId).maybeSingle(),
    admin.from("mark_schemes").select("*").eq("question_id", questionId).eq("is_current", true).maybeSingle(),
  ]);
  if (!q || !scheme) return null;
  const question = q as Question & { question_objectives: { learning_objectives: { code: string } }[]; parent: { question_text: string } | null };
  const s = scheme as MarkScheme;
  const marking: MarkingEntry = {
    question_type: question.question_type,
    grading_method: question.grading_method,
    marks: question.marks,
    command_word: question.command_word,
    mark_scheme: s.mark_scheme,
    marking_points: s.marking_points,
    model_answer: s.model_answer,
    accepted_answers: s.accepted_answers,
    ai_grading_instructions: s.ai_grading_instructions,
    explanation: s.explanation,
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
    questionId: question.id,
    context: "practice",
    aiDisabled: true,
  });
  return { question, scheme: s, outcome };
}

/** The moment `minutes` ago, as an ISO string (for "seen recently"). */
export const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
