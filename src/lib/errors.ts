// Turns database / RPC error codes into messages a student or teacher can act on.
const MESSAGES: Record<string, string> = {
  NOT_AUTHENTICATED: "Your session has ended. Please sign in again.",
  FORBIDDEN: "You do not have permission to do that.",
  EXAM_NOT_FOUND: "This exam could not be found.",
  EXAM_NOT_AVAILABLE: "This exam is not available right now.",
  EXAM_ARCHIVED: "This exam has been archived.",
  ASSIGNMENT_NOT_FOUND: "This assignment could not be found.",
  ASSIGNMENT_NOT_AVAILABLE: "This assignment is not open yet.",
  ASSIGNMENT_DEADLINE_PASSED: "The deadline for this assignment has passed.",
  ATTEMPT_LIMIT_REACHED: "You have used all the attempts allowed for this exam.",
  ATTEMPT_NOT_FOUND: "This exam attempt could not be found.",
  ATTEMPT_CLOSED: "This exam has already been submitted.",
  SESSION_SUPERSEDED: "This exam was opened in another window or device.",
  QUESTION_NOT_IN_EXAM: "That question is not part of this exam.",
  ANSWER_TOO_LARGE: "Your answer is too long to save.",
  EXAM_HAS_NO_QUESTIONS: "Add at least one question before publishing.",
  EXAM_HAS_UNPUBLISHED_QUESTIONS: "Publish all questions in this exam before publishing it.",
  EXAM_HAS_QUESTIONS_WITHOUT_MARK_SCHEME: "Every question needs a mark scheme before the exam can be published.",
  NO_MARK_TO_ACCEPT: "There is no mark to accept — enter a mark instead.",
  INVALID_MARK: "The mark must be between 0 and the maximum for this question.",
  REASON_REQUIRED: "Please give a reason for changing the mark.",
  RESULT_NOT_FOUND: "That result could not be found.",
};

export function friendlyError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const raw =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : "";
  const code = Object.keys(MESSAGES).find((k) => raw.includes(k));
  return code ? MESSAGES[code] : fallback;
}

export function errorCode(error: unknown): string | null {
  const raw = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "";
  return Object.keys(MESSAGES).find((k) => raw.includes(k)) ?? null;
}
