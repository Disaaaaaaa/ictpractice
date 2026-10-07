"use client";
import { AnswerInput, QuestionText } from "@/components/questions/answer-input";
import { GroupStem } from "@/components/questions/group-stem";
import type { AnswerData, PaperQuestion } from "@/lib/questions/types";

/** Read-only rendering of a submitted answer. */
export function AnswerReview({
  question,
  answer,
  correctKeys,
  showStem = false,
}: {
  question: PaperQuestion;
  answer: AnswerData | null;
  correctKeys?: string[];
  /** first part of a structured question: show the shared stem */
  showStem?: boolean;
}) {
  return (
    <div className="space-y-4">
      {showStem && <GroupStem q={question} />}
      <QuestionText text={question.question_text} type={question.question_type} />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Answer</p>
        {answer ? (
          <AnswerInput question={question} value={answer} onChange={() => {}} disabled correctKeys={correctKeys} />
        ) : (
          <p className="text-sm italic text-muted">No answer given.</p>
        )}
      </div>
    </div>
  );
}
