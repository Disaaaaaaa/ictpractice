"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Crown, FileText, Laptop, Loader2, Maximize, Presentation, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AnswerData } from "@/lib/questions/types";
import { AnswerInput, type AnswerableQuestion } from "@/components/questions/answer-input";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { getRealtimeClient } from "@/lib/supabase/client";
import { heartbeat, reportFullscreen, submitLive, vote, type LiveSubmit } from "@/app/(app)/live/actions";

/** Tells the server the student is in the lesson (every 60 s). */
export function Heartbeat({ sessionId }: { sessionId: string }) {
  useEffect(() => {
    void heartbeat(sessionId);
    const t = setInterval(() => void heartbeat(sessionId), 60_000);
    return () => clearInterval(t);
  }, [sessionId]);
  return null;
}

/**
 * While no lesson is running: reloads the page as soon as the teacher starts
 * one (Realtime insert, RLS sends only the student's own class), with a slow
 * poll while the tab is visible as a fallback.
 */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    let stop = false;
    let cleanup = () => {};
    void getRealtimeClient().then((supabase) => {
      if (stop) return;
      const ch = supabase
        .channel("live-wait")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_sessions" }, () => router.refresh())
        .subscribe();
      cleanup = () => void supabase.removeChannel(ch);
    });
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => {
      stop = true;
      cleanup();
      clearInterval(t);
    };
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
  previous: { answer: AnswerData; awarded: number | null; max: number | null; needsReview: boolean; feedback?: string | null } | null;
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
      {!result && previous?.feedback && (
        <div className="rounded-md border border-info bg-info-soft px-3 py-2 text-sm">
          <p className="font-semibold text-info">Teacher&apos;s feedback · {previous.awarded}/{previous.max}</p>
          <p>{previous.feedback}</p>
        </div>
      )}
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

export function PaperCard() {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-surface-2 p-5 text-center">
      <FileText className="mx-auto h-10 w-10 text-primary" />
      <p className="mt-2 text-xl font-semibold">Work on your printed worksheet</p>
      <p className="mt-1 text-sm text-muted">Write your answers on paper. Your teacher will open the next step here.</p>
    </div>
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

/**
 * Keeps the lesson full screen. The student joins with one click (browsers
 * only allow full screen after a click); if they leave it, the lesson is covered
 * until they return, and the teacher sees it. Where the browser has no full
 * screen for pages (some phones), the lesson fills the window instead.
 */
export function LessonStage({ sessionId, children }: { sessionId: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(false);
  const [full, setFull] = useState(false);
  // the browser has no full screen for pages, or refused it: the lesson fills the window instead
  const [refused, setRefused] = useState(false);
  const supported = typeof document !== "undefined" && Boolean(document.fullscreenEnabled) && !refused;

  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === box.current;
      setFull(on);
      void reportFullscreen(sessionId, on);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [sessionId]);

  const enter = async () => {
    setJoined(true);
    if (!supported || !box.current) return;
    try {
      await box.current.requestFullscreen({ navigationUI: "hide" });
    } catch {
      setRefused(true);
      void reportFullscreen(sessionId, false);
    }
  };
  const covered = !joined || (supported && !full);

  return (
    <div ref={box} className={cn("relative", (full || (joined && !supported)) && "fixed inset-0 z-50 overflow-auto bg-background p-4 sm:p-8")}>
      {children}
      {covered && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-6 backdrop-blur">
          <div className="max-w-md space-y-4 text-center">
            <Maximize className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-2xl font-semibold">{joined ? "Return to the lesson" : "Your lesson has started"}</h2>
            <p className="text-muted">
              {joined
                ? "The lesson works in full screen. Leaving it is shown to your teacher."
                : "The lesson opens in full screen. Stay in it until your teacher ends the lesson."}
            </p>
            <Button size="lg" onClick={() => void enter()}>{joined ? "Back to full screen" : "Join the lesson"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
