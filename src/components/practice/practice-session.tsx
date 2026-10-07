"use client";
import { useState, useTransition } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Lightbulb, ListChecks, Loader2, RotateCcw, XCircle } from "lucide-react";
import { AnswerInput, QuestionText } from "@/components/questions/answer-input";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/cn";
import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  type AnswerData,
  type CommandWord,
  type Difficulty,
  type GradingMethod,
  type QuestionContent,
  type QuestionOption,
  type QuestionType,
} from "@/lib/questions/types";
import {
  checkPracticeAnswer,
  revealPractice,
  type PracticeResult,
  type PracticeReveal,
} from "@/app/(app)/learn/[topic]/practice/actions";

export type PracticeQuestion = {
  id: string;
  title: string;
  question_text: string;
  question_type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  command_word: CommandWord | null;
  grading_method: GradingMethod;
  content: QuestionContent;
  options: QuestionOption[];
  objectives: string[];
  /** parts of a structured question: shared stem and "(a)" label */
  group_stem?: string | null;
  group_title?: string | null;
  part_label?: string | null;
};

type QState = {
  answer: AnswerData | null;
  result?: PracticeResult;
  reveal?: PracticeReveal;
  hint?: boolean;
};

const DIFF_TONE = { easy: "success", medium: "info", hard: "warning", exam: "danger" } as const;

export function PracticeSession({ questions }: { questions: PracticeQuestion[] }) {
  const [filter, setFilter] = useState<Difficulty | "all">("all");
  const list = filter === "all" ? questions : questions.filter((q) => q.difficulty === filter);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<Record<string, QState>>({});
  const [pending, startTransition] = useTransition();
  const [revealing, startReveal] = useTransition();

  const q = list[Math.min(index, list.length - 1)];
  const s: QState = (q && state[q.id]) ?? { answer: null };
  const set = (patch: Partial<QState>) => setState((all) => ({ ...all, [q.id]: { ...(all[q.id] ?? { answer: null }), ...patch } }));

  const check = () =>
    startTransition(async () => {
      const result = await checkPracticeAnswer(q.id, s.answer);
      set({ result });
    });
  const reveal = () =>
    startReveal(async () => {
      const r = await revealPractice(q.id);
      set({ reveal: r });
    });
  const retry = () => set({ answer: null, result: undefined, reveal: undefined, hint: false });

  const done = Object.entries(state).filter(([, v]) => v.result?.ok).length;
  const result = s.result?.ok ? s.result : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <aside className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold">Difficulty</p>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "easy", "medium", "hard", "exam"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setFilter(d);
                  setIndex(0);
                }}
                aria-pressed={filter === d}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  filter === d ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2",
                )}
              >
                {d === "all" ? "All" : DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">
            Questions <span className="font-normal text-muted">· {done} checked</span>
          </p>
          <ol className="space-y-1">
            {list.map((item, i) => {
              const r = state[item.id]?.result;
              const icon =
                r?.ok && r.awarded !== null ? (
                  r.fullMarks ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-warning" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border" />
                );
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={item.id === q?.id ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                      item.id === q?.id ? "bg-primary-soft text-primary" : "hover:bg-surface-2",
                    )}
                  >
                    {icon}
                    <span className="truncate">
                      {i + 1}. {item.part_label ? `${item.group_title ?? "Question"} ${item.part_label}` : item.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      {!q ? (
        <p className="text-sm text-muted">No questions at this difficulty.</p>
      ) : (
        <div className="min-w-0 space-y-4">
          <article className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-7">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="mr-auto text-lg font-semibold">
                {q.part_label ? `${q.group_title ?? q.title} — part ${q.part_label}` : q.title}
              </h2>
              <Badge tone="primary">{q.marks} mark{q.marks === 1 ? "" : "s"}</Badge>
              <Badge tone={DIFF_TONE[q.difficulty]}>{DIFFICULTY_LABELS[q.difficulty]}</Badge>
              <Badge>{QUESTION_TYPE_LABELS[q.question_type]}</Badge>
              {q.command_word && <Badge>{q.command_word[0].toUpperCase() + q.command_word.slice(1)}</Badge>}
            </div>
            {q.group_stem && (
              <div className="mb-5 rounded-lg border border-border bg-surface-2 p-4">
                <Markdown>{q.group_stem}</Markdown>
              </div>
            )}
            <QuestionText text={q.question_text} type={q.question_type} />
            <div className="mt-6">
              <AnswerInput
                key={q.id + (s.result ? "-checked" : "")}
                question={q}
                value={s.answer}
                onChange={(answer) => set({ answer, result: undefined })}
                disabled={pending}
                correctKeys={result?.correctKeys}
              />
            </div>
            <p className="mt-4 text-xs text-muted">Objectives: {q.objectives.map((c) => `LO ${c}`).join(", ")}</p>
          </article>

          {s.hint && q.content.hint && (
            <Alert tone="info" title="Hint">
              <Markdown>{q.content.hint}</Markdown>
            </Alert>
          )}

          {s.result && !s.result.ok && <Alert tone="warning">{s.result.error}</Alert>}

          {result && (
            <div
              className={cn(
                "rounded-xl border p-5",
                result.awarded === null
                  ? "border-border bg-surface"
                  : result.fullMarks
                    ? "border-success/40 bg-success-soft"
                    : "border-warning/40 bg-warning-soft",
              )}
              role="status"
            >
              <div className="flex flex-wrap items-center gap-3">
                {result.awarded === null ? (
                  <CircleHelp className="h-6 w-6 text-muted" />
                ) : result.fullMarks ? (
                  <CheckCircle2 className="h-6 w-6 text-success" />
                ) : (
                  <XCircle className="h-6 w-6 text-warning" />
                )}
                <p className="text-lg font-semibold">
                  {result.awarded === null ? "Self-assess with the mark scheme" : `${result.awarded} / ${result.max} marks`}
                </p>
              </div>
              {result.feedback && <p className="mt-2 text-sm">{result.feedback}</p>}
              {result.points.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {result.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {p.awarded ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                      )}
                      <span>
                        {p.criterion}
                        {p.comment && <span className="text-muted"> — {p.comment}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {result.needsReview && result.awarded !== null && (
                <p className="mt-2 text-xs text-muted">The AI examiner was not fully confident about this mark.</p>
              )}
            </div>
          )}

          {s.reveal?.ok && (
            <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
              {s.reveal.explanation && (
                <section>
                  <h3 className="mb-1 text-sm font-semibold">Explanation</h3>
                  <Markdown>{s.reveal.explanation}</Markdown>
                </section>
              )}
              {s.reveal.markScheme && (
                <section>
                  <h3 className="mb-1 text-sm font-semibold">Mark scheme</h3>
                  <Markdown>{s.reveal.markScheme}</Markdown>
                </section>
              )}
              {s.reveal.modelAnswer && (
                <section>
                  <h3 className="mb-1 text-sm font-semibold">Model answer</h3>
                  <Markdown>{s.reveal.modelAnswer}</Markdown>
                </section>
              )}
            </div>
          )}
          {s.reveal && !s.reveal.ok && <Alert tone="warning">{s.reveal.error}</Alert>}

          <div className="flex flex-wrap items-center gap-2">
            {!result ? (
              <Button onClick={check} disabled={pending || !s.answer}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {pending && (q.grading_method === "AI" || q.grading_method === "HYBRID") ? "Marking…" : "Check Answer"}
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => set({ result: undefined })}>
                <RotateCcw className="h-4 w-4" /> Try Again
              </Button>
            )}
            {q.content.hint && !s.hint && (
              <Button variant="ghost" onClick={() => set({ hint: true })}>
                <Lightbulb className="h-4 w-4" /> Show Hint
              </Button>
            )}
            {!s.reveal?.ok && (
              <Button variant="ghost" onClick={reveal} disabled={revealing}>
                <ListChecks className="h-4 w-4" /> Show Explanation &amp; Mark Scheme
              </Button>
            )}
            <Button variant="ghost" onClick={retry}>
              Retry Question
            </Button>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous question">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIndex((i) => Math.min(list.length - 1, i + 1))}
                disabled={index >= list.length - 1}
                aria-label="Next question"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
