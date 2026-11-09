"use client";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { toggleReveal } from "@/app/(app)/teacher/lessons/actions";

export type PresenterVote = { id: string; title: string; text: ReactNode; labels: string[]; counts: number[]; correct: boolean[]; revealed: boolean; answered: number };
export type PresenterSlide = { kind: "theory"; heading: string; sub: string | null; body: ReactNode } | { kind: "vote"; vote: PresenterVote };

/** Theory as slides on the projector; arrow keys / space move between slides. */
export function Presenter({ sessionId, title, slides, live }: { sessionId: string; title: string; slides: PresenterSlide[]; live: ReactNode }) {
  const [i, setI] = useState(0);
  const [pending, start] = useTransition();
  const box = useRef<HTMLDivElement>(null);
  const go = useCallback((d: number) => setI((x) => Math.min(slides.length - 1, Math.max(0, x + d))), [slides.length]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);
  const s = slides[i];
  return (
    <div ref={box} className="flex min-h-[calc(100vh-6rem)] flex-col rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border px-5 py-2 text-sm text-muted">
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {live}
        <span className="tabular-nums">{i + 1} / {slides.length}</span>
        <button type="button" onClick={() => void box.current?.requestFullscreen?.()} className="rounded p-1 hover:bg-surface-2" aria-label="Full screen"><Maximize2 className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-auto px-8 py-6 text-lg [&_table]:text-base">
        {s?.kind === "theory" ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{s.heading}</p>
            {s.sub && <h2 className="mt-1 text-3xl font-bold">{s.sub}</h2>}
            <div className="mt-6 space-y-4">{s.body}</div>
          </>
        ) : s?.kind === "vote" ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Together task — vote on your laptop</p>
            <h2 className="mt-1 text-3xl font-bold">{s.vote.title}</h2>
            <div className="mt-4 text-xl">{s.vote.text}</div>
            <ul className="mt-6 space-y-3">
              {s.vote.labels.map((l, k) => {
                const total = Math.max(1, s.vote.counts.reduce((a, b) => a + b, 0));
                const good = s.vote.revealed && s.vote.correct[k];
                return (
                  <li key={k} className="grid grid-cols-[minmax(0,1fr)_14rem_3rem] items-center gap-4">
                    <span className={cn("text-xl", good && "font-bold text-success")}>{l}</span>
                    <span className="h-4 overflow-hidden rounded bg-border">
                      <span className={cn("block h-full transition-all", good ? "bg-success" : "bg-primary")} style={{ width: `${(100 * s.vote.counts[k]) / total}%` }} />
                    </span>
                    <span className="text-right text-xl tabular-nums">{s.vote.counts[k]}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex items-center gap-4 text-base">
              <span className="text-muted">{s.vote.answered} answered</span>
              <button type="button" disabled={pending} onClick={() => start(async () => void (await toggleReveal(sessionId, s.vote.id)))} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-surface-2">
                {s.vote.revealed ? <><EyeOff className="h-5 w-5" /> Hide answer</> : <><Eye className="h-5 w-5" /> Show answer</>}
              </button>
            </div>
          </>
        ) : null}
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-2">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 hover:bg-surface-2 disabled:opacity-40"><ChevronLeft className="h-5 w-5" /> Back</button>
        <div className="flex gap-1">{slides.map((_, k) => <span key={k} className={cn("h-1.5 w-1.5 rounded-full", k === i ? "bg-primary" : "bg-border")} />)}</div>
        <button type="button" onClick={() => go(1)} disabled={i === slides.length - 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 hover:bg-surface-2 disabled:opacity-40">Next <ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
