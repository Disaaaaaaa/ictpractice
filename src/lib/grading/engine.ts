import "server-only";
import { gradeDeterministic, type MarkingPointResult } from "./deterministic";
import { AiUnavailableError, PROMPT_VERSION, gradeWithAI } from "./ai";
import { isAnswerBlank, type AnswerData, type MarkingEntry, type QuestionContent, type QuestionType } from "../questions/types";

export type GradeOutcome = {
  /** FAILED = transient error (e.g. OpenAI down); the grader retries later. */
  status: "COMPLETE" | "FAILED";
  method: MarkingEntry["grading_method"];
  awarded: number | null;
  max: number;
  confidence: number | null;
  points: MarkingPointResult[];
  feedback: string | null;
  needsReview: boolean;
  originalAiMark: number | null;
  aiModel: string | null;
  promptVersion: string | null;
  error: string | null;
};

export type GradeInput = {
  questionText: string;
  questionType: QuestionType;
  objectives: string[];
  marking: MarkingEntry;
  answer: AnswerData | null;
  aiConfidenceThreshold: number;
  examInstructions?: string | null;
  content?: QuestionContent;
  /** Stem shared by the parts of a structured question */
  groupStem?: string | null;
};

function base(input: GradeInput): GradeOutcome {
  return {
    status: "COMPLETE",
    method: input.marking.grading_method,
    awarded: null,
    max: input.marking.marks,
    confidence: null,
    points: [],
    feedback: null,
    needsReview: false,
    originalAiMark: null,
    aiModel: null,
    promptVersion: null,
    error: null,
  };
}

/** Scale a mark obtained against the question's own marks to the exam's marks. */
function rescale(mark: number, from: number, to: number) {
  if (from === to || from <= 0) return mark;
  return Math.round((mark * to) / from);
}

/**
 * Marks one answer. Objective questions are marked deterministically (fast,
 * free, reliable); written answers go to the AI examiner; MANUAL questions are
 * queued for the teacher.
 */
export async function gradeAnswer(input: GradeInput): Promise<GradeOutcome> {
  const out = base(input);
  const { marking } = input;
  const max = marking.marks;

  if (isAnswerBlank(input.answer)) {
    return { ...out, awarded: 0, feedback: "No answer was given." };
  }

  const method = marking.grading_method;

  if (method === "MANUAL") {
    return { ...out, needsReview: true, feedback: null };
  }

  let provisional: number | null = null;
  if (method === "AUTO" || method === "HYBRID") {
    const det = gradeDeterministic(input.questionType, max, marking.accepted_answers, input.answer);
    if (det.decided && (method === "AUTO" || det.fullyCorrect)) {
      return { ...out, awarded: det.awarded, points: det.points, feedback: det.feedback };
    }
    if (method === "AUTO") {
      // No usable answer key: a teacher has to mark it.
      return { ...out, needsReview: true, error: det.decided ? null : det.reason };
    }
    if (det.decided) provisional = det.awarded;
  }

  // AI or HYBRID fallthrough
  try {
    const questionMarks = marking.question_marks ?? max;
    const ai = await gradeWithAI({
      questionText: input.questionText,
      questionType: input.questionType,
      maxMark: questionMarks,
      commandWord: marking.command_word,
      markScheme: marking.mark_scheme,
      markingPoints: marking.marking_points ?? [],
      modelAnswer: marking.model_answer,
      acceptedAlternatives: marking.accepted_answers?.values ?? [],
      aiInstructions: marking.ai_grading_instructions,
      objectives: input.objectives,
      examInstructions: input.examInstructions,
      groupStem: input.groupStem ?? marking.group_stem ?? null,
      content: input.content,
      answer: input.answer!,
    });
    const awarded = rescale(ai.awarded, questionMarks, max);
    return {
      ...out,
      awarded,
      originalAiMark: awarded,
      confidence: ai.confidence,
      points: ai.points,
      feedback: ai.feedback,
      needsReview: ai.needsReview || ai.confidence < input.aiConfidenceThreshold,
      aiModel: ai.model,
      promptVersion: PROMPT_VERSION,
    };
  } catch (e) {
    if (e instanceof AiUnavailableError) {
      // Not transient: send to the teacher instead of retrying forever.
      return {
        ...out,
        awarded: provisional,
        needsReview: true,
        error: "AI marking is not configured — teacher marking required.",
      };
    }
    return { ...out, status: "FAILED", error: (e as Error).message.slice(0, 500) };
  }
}
