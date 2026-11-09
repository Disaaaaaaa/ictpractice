"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Crown, Laptop, Loader2, Presentation, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AnswerData } from "@/lib/questions/types";
import { AnswerInput, type AnswerableQuestion } from "@/components/questions/answer-input";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { heartbeat, submitLive, vote, type LiveSubmit } from "@/app/(app)/live/actions";

/** Tells the server the student is in the lesson (every 30 s). */
export function Heartbeat({ sessionId }: { sessionId: string }) {
  useEffect(() => {
    void heartbeat(sessionId);
    const t = setInterval(() => void heartbeat(sessionId), 30_000);
    return () => clearInterval(t);
  }, [sessionId]);
  return null;
}

/** Reloads the page every few seconds (used while no lesson is running). */
export function AutoRefresh({ seconds = 10 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}

export function PollCard({ sessionId, blockId, question, options, mine }: { sessionId: string; blockId: string; question: string; options: string[]; mine: number | null }) {
  const [chosen, setChosen] = useState<number | null>(mine);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-3">
      <p className="text-lg font-medium">{question}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            disabled={pending}
            onClick={() => start(async () => { setChosen(i); await vote(sessionId, blockId, i); })}
            className={cn("rounded-lg border px-4 py-3 text-left", chosen === i ? "border-primary bg-primary-soft font-medium" : "border-border hover:bg-surface-2")}
          >
            {o}
          </button>
        ))}
      </div>
      {chosen != null && <p className="text-sm text-success">Your answer is saved — you can change it.</p>}
    </div>
  );
}

export type StudentQuestion = AnswerableQuestion & { title: string; question_text: string; marks: number };

export function LiveQuestion({
  sessionId,
  blockId,
  question,
  previous,
  correctKeys,
  canAnswer,
}: {
  sessionId: string;
  blockId: string;
  question: StudentQuestion;
  previous: { answer: AnswerData; awarded: number | null; max: number | null; needsReview: boolean } | null;
  /** shown once the teacher reveals the answer */
  correctKeys?: string[];
  canAnswer: boolean;
}) {
  const [value, setValue] = useState<AnswerData | null>(previous?.answer ?? null);
  const [result, setResult] = useState<LiveSubmit | null>(null);
  const [pending, start] = useTransition();
  const shown = result?.ok
    ? result
    : previous
      ? { ok: true as const, awarded: previous.awarded, max: previous.max ?? question.marks, fullMarks: previous.awarded != null && previous.awarded === previous.max, needsReview: previous.needsReview, feedback: null }
      : null;
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 font-medium">{question.title}</p>
        <span className="text-xs text-muted">[{question.marks}]</span>
      </div>
      <Markdown>{question.question_text}</Markdown>
      <AnswerInput question={question} value={value} onChange={setValue} disabled={!canAnswer || pending} correctKeys={correctKeys} />
      {canAnswer && (
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" disabled={pending || !value} onClick={() => start(async () => setResult(await submitLive(sessionId, blockId, question.id, value)))}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />} {shown ? "Check again" : "Check"}
          </Button>
          {result && !result.ok && <span className="text-sm text-danger">{result.error}</span>}
          {shown && (
            <span className={cn("inline-flex items-center gap-1 text-sm font-medium", shown.needsReview ? "text-info" : shown.fullMarks ? "text-success" : "text-warning")}>
              {shown.needsReview ? "Handed in — your teacher will check it" : shown.fullMarks ? <><CheckCircle2 className="h-4 w-4" /> Correct · {shown.awarded}/{shown.max}</> : <><XCircle className="h-4 w-4" /> {shown.awarded}/{shown.max} — think again</>}
            </span>
          )}
        </div>
      )}
      {result?.ok && result.feedback && !result.fullMarks && !result.needsReview && <p className="text-sm text-muted">{result.feedback}</p>}
    </div>
  );
}

export function BoardCard({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-muted">
      <Presentation className="h-5 w-5" /> {text}
    </p>
  );
}

export function GoToLaptop({ host, members }: { host: string; members: string[] }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-primary bg-primary-soft p-5 text-center">
      <Laptop className="mx-auto h-10 w-10 text-primary" />
      <p className="mt-2 text-xl font-semibold">Go to {host}&apos;s laptop</p>
      <p className="mt-1 text-sm text-muted">Your group: {members.join(", ")}</p>
    </div>
  );
}

export function HostBadge({ members }: { members: string[] }) {
  return (
    <p className="flex items-center gap-2 rounded-md bg-warning-soft px-3 py-2 text-sm">
      <Crown className="h-4 w-4 text-warning" /> Your group works on <b>your</b> laptop: {members.join(", ")}
    </p>
  );
}
