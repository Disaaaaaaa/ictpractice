"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Crown, Download, Eye, EyeOff, LayoutList, Maximize2, MonitorOff, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AnswerData } from "@/lib/questions/types";
import { AnswerInput, type AnswerableQuestion } from "@/components/questions/answer-input";
import { endLesson, showSlide, toggleReveal } from "@/app/(app)/teacher/lessons/actions";

export type SlideStats = { answered: number; expected: number; pct: number | null; toCheck: number };
export type SlideText = { who: string; lines: string[] };

export type Slide = { key: string } & SlideBody;
type SlideBody =
  | { kind: "title"; blockId: null; title: string; topic: string; className: string; objectives: { all: string; most: string; some: string } | null; codes: string[]; values: string[]; vocabulary: string[] }
  | { kind: "step"; blockId: string; stage: string; from: number; to: number; title: string; mode: string; learners: string; teacher: string; poll: { question: string; labels: string[]; counts: number[] } | null; groups: { label: string; client: string | null; members: { name: string; host: boolean }[] }[] }
  | { kind: "theory"; blockId: string; heading: string; sub: string; body: ReactNode }
  | {
      kind: "question";
      blockId: string;
      together: boolean;
      question: AnswerableQuestion & { title: string; text: ReactNode; marks: number };
      correct: string[];
      revealed: boolean;
      stats: SlideStats;
      bars: { labels: string[]; counts: number[]; correct: boolean[] } | null;
      texts: SlideText[];
    };

const noop = () => {};

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function LessonPresenter({
  sessionId,
  title,
  minutes,
  startedAt,
  ended,
  slides,
  open,
  startBlock,
  startSlide,
  planHref,
  joined,
  classSize,
  outOfFullscreen,
  live,
}: {
  sessionId: string;
  title: string;
  minutes: number;
  startedAt: string;
  ended: boolean;
  slides: Slide[];
  open: string[];
  startBlock: string | null;
  /** the slide students see now (state.slide) */
  startSlide: string | null;
  planHref: string | null;
  joined: number;
  classSize: number;
  /** names of joined students whose lesson is not full screen */
  outOfFullscreen: string[];
  live: ReactNode;
}) {
  const bySlide = startSlide ? slides.findIndex((x) => x.key === startSlide) : -1;
  const first = bySlide >= 0 ? bySlide : Math.max(0, startBlock ? slides.findIndex((x) => x.blockId === startBlock) : 0);
  const [i, setI] = useState(first);
  const [auto, setAuto] = useState(true);
  const [rail, setRail] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const box = useRef<HTMLDivElement>(null);
  const opened = useRef(new Set(open));
  useEffect(() => {
    open.forEach((b) => opened.current.add(b));
  }, [open]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const go = useCallback((n: number) => setI(Math.min(slides.length - 1, Math.max(0, n))), [slides.length]);

  // the students follow the teacher's slide; reaching a step opens it to the class
  const s = slides[i];
  const sent = useRef<string | null>(startSlide);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(() => {
    if (ended || !s || sent.current === s.key) return;
    const t = setTimeout(() => {
      sent.current = s.key;
      const openId = auto && s.blockId && !opened.current.has(s.blockId) ? s.blockId : null;
      if (openId) opened.current.add(openId);
      queue.current = queue.current.then(() => showSlide(sessionId, s.key, openId)).catch(() => undefined);
    }, 250);
    return () => clearTimeout(t);
  }, [s, auto, ended, sessionId]);
  const [revealing, start] = useTransition();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(i + 1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(i - 1); }
      if (e.key === "f") void box.current?.requestFullscreen?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, i]);

  // the steps, for the rail
  const steps = useMemo(() => {
    const out: { blockId: string; title: string; index: number }[] = [];
    slides.forEach((x, k) => {
      if (x.kind === "step") out.push({ blockId: x.blockId, title: x.title, index: k });
    });
    return out;
  }, [slides]);
  const currentStep = [...steps].reverse().find((st) => st.index <= i);

  return (
    <div ref={box} className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-xl border border-border bg-surface [&:fullscreen]:h-screen [&:fullscreen]:rounded-none">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2 text-sm">
        <button type="button" onClick={() => setRail((r) => !r)} className="rounded p-1 hover:bg-surface-2" aria-label="Steps"><LayoutList className="h-5 w-5" /></button>
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
        {live}
        <span className="font-mono tabular-nums text-muted">{clock(now - new Date(startedAt).getTime())} / {minutes}:00</span>
        <span className="inline-flex items-center gap-1 text-muted"><Users className="h-4 w-4" /> {joined}/{classSize}</span>
        {outOfFullscreen.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded bg-danger-soft px-2 py-0.5 text-danger" title={outOfFullscreen.join(", ")}>
            <MonitorOff className="h-4 w-4" /> {outOfFullscreen.length} left full screen
          </span>
        )}
        {planHref && <a href={planHref} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:bg-surface-2"><Download className="h-4 w-4" /> Lesson plan</a>}
        <Link href={`/teacher/lessons/${sessionId}/console`} className="rounded-lg border border-border px-2.5 py-1 hover:bg-surface-2">Class overview</Link>
        {!ended && (
          <label className="inline-flex items-center gap-1.5 text-muted" title="Open each step to the class when you reach it">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> auto-open
          </label>
        )}
        <button type="button" onClick={() => void box.current?.requestFullscreen?.()} className="rounded p-1 hover:bg-surface-2" aria-label="Full screen (F)"><Maximize2 className="h-4 w-4" /></button>
        {!ended && (
          <form action={endLesson.bind(null, sessionId)} onSubmit={(e) => { if (!confirm("End the lesson for the whole class?")) e.preventDefault(); }}>
            <button type="submit" className="rounded-lg bg-danger px-2.5 py-1 text-white hover:opacity-90">End lesson</button>
          </form>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {rail && (
          <nav className="w-60 shrink-0 overflow-y-auto border-r border-border p-2 text-sm">
            <button type="button" onClick={() => go(0)} className={cn("block w-full rounded px-2 py-1.5 text-left hover:bg-surface-2", i === 0 && "bg-primary-soft text-primary")}>Title</button>
            {steps.map((st) => (
              <button key={st.blockId} type="button" onClick={() => go(st.index)} className={cn("flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-surface-2", currentStep?.blockId === st.blockId && "bg-primary-soft text-primary")}>
                <span className={cn("h-2 w-2 shrink-0 rounded-full", open.includes(st.blockId) ? "bg-success" : "bg-border")} />
                <span className="truncate">{st.title}</span>
              </button>
            ))}
          </nav>
        )}
        <div className="min-w-0 flex-1 overflow-y-auto px-8 py-6 text-lg [&_table]:text-base">
          {s && <SlideView s={s} sessionId={sessionId} pending={revealing} start={start} planHref={planHref} ended={ended} />}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <button type="button" onClick={() => go(i - 1)} disabled={i === 0} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 hover:bg-surface-2 disabled:opacity-40"><ChevronLeft className="h-5 w-5" /> Back</button>
        <span className="text-sm text-muted">{currentStep ? currentStep.title : "Title"} · {i + 1} / {slides.length}</span>
        <button type="button" onClick={() => go(i + 1)} disabled={i === slides.length - 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 hover:bg-surface-2 disabled:opacity-40">Next <ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

function Bars({ labels, counts, correct, showCorrect, big = false }: { labels: string[]; counts: number[]; correct?: boolean[]; showCorrect?: boolean; big?: boolean }) {
  const total = Math.max(1, counts.reduce((a, b) => a + b, 0));
  return (
    <ul className={cn("space-y-2", big && "space-y-3")}>
      {labels.map((l, k) => {
        const good = showCorrect && correct?.[k];
        return (
          <li key={k} className="grid grid-cols-[minmax(0,1fr)_12rem_2.5rem] items-center gap-4">
            <span className={cn(big ? "text-xl" : "text-base", good && "font-bold text-success")}>{l}</span>
            <span className="h-3 overflow-hidden rounded bg-border">
              <span className={cn("block h-full transition-all", good ? "bg-success" : "bg-primary")} style={{ width: `${(100 * counts[k]) / total}%` }} />
            </span>
            <span className="text-right tabular-nums">{counts[k]}</span>
          </li>
        );
      })}
    </ul>
  );
}

function SlideView({ s, sessionId, pending, start, planHref, ended }: { s: Slide; sessionId: string; pending: boolean; start: (fn: () => Promise<void>) => void; planHref: string | null; ended: boolean }) {
  if (s.kind === "title") {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{s.topic} · {s.className}</p>
          <h1 className="mt-1 text-4xl font-bold">{s.title}</h1>
          {s.codes.length > 0 && <p className="mt-2 text-base text-muted">Learning objectives: {s.codes.join(", ")}</p>}
        </div>
        {s.objectives && (
          <div className="rounded-xl bg-surface-2 p-5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">By the end of the lesson</p>
            <p><b>All</b> will be able to {s.objectives.all}.</p>
            <p><b>Most</b> will be able to {s.objectives.most}.</p>
            <p><b>Some</b> will be able to {s.objectives.some}.</p>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {s.values.length > 0 && (
            <div className="rounded-xl border border-border p-4">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">NIS values</p>
              <p>{s.values.join(" · ")}</p>
            </div>
          )}
          {s.vocabulary.length > 0 && (
            <div className="rounded-xl border border-border p-4">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">Key words</p>
              <p className="text-base">{s.vocabulary.join(", ")}</p>
            </div>
          )}
        </div>
        {planHref && (
          <a href={planHref} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-base text-primary-fg hover:bg-primary-hover">
            <Download className="h-5 w-5" /> Download the lesson plan (ҚМЖ)
          </a>
        )}
      </div>
    );
  }
  if (s.kind === "step") {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{s.stage} · {s.from}–{s.to} min · {s.mode}</p>
          <h1 className="mt-1 text-4xl font-bold">{s.title}</h1>
          <p className="mt-3 text-2xl">{s.learners}</p>
          <p className="mt-3 text-sm text-muted">Teacher: {s.teacher}</p>
        </div>
        {s.poll && (
          <div className="rounded-xl bg-surface-2 p-5">
            <p className="mb-4 text-2xl font-semibold">{s.poll.question}</p>
            <Bars labels={s.poll.labels} counts={s.poll.counts} big />
          </div>
        )}
        {s.groups.length > 0 && (
          <div>
            <p className="mb-3 flex items-center gap-2 text-base font-medium"><Crown className="h-5 w-5 text-warning" /> Each group works on this person&apos;s laptop</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {s.groups.map((g) => (
                <li key={g.label} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-semibold text-muted">{g.label}{g.client ? ` · ${g.client}` : ""}</p>
                  {g.members.map((m) => (
                    <p key={m.name} className={cn("text-lg", m.host && "font-bold")}>{m.host && <Crown className="mr-1 inline h-4 w-4 text-warning" />}{m.name}</p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  if (s.kind === "theory") {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{s.heading}</p>
        <h2 className="mt-1 text-3xl font-bold">{s.sub}</h2>
        <div className="mt-6 space-y-4">{s.body}</div>
      </div>
    );
  }
  const q = s.question;
  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{s.together ? "Together — vote on your laptop" : "Task"} · [{q.marks}]</p>
        <h2 className="text-3xl font-bold">{q.title}</h2>
        <div className="text-xl">{q.text}</div>
        <div className="pointer-events-none text-base">
          <AnswerInput question={q} value={null as AnswerData | null} onChange={noop} disabled correctKeys={s.revealed ? s.correct : undefined} />
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-xl bg-surface-2 p-4">
          <p className="text-3xl font-bold tabular-nums">{s.stats.answered}<span className="text-lg font-normal text-muted"> / {s.stats.expected} answered</span></p>
          {s.stats.pct != null && <p className={cn("mt-1 text-xl font-semibold", s.stats.pct >= 70 ? "text-success" : s.stats.pct >= 40 ? "text-warning" : "text-danger")}>{s.stats.pct}% correct</p>}
          {s.stats.toCheck > 0 && <p className="mt-1 text-sm text-info">{s.stats.toCheck} written answers to check</p>}
        </div>
        {s.bars && <Bars labels={s.bars.labels} counts={s.bars.counts} correct={s.bars.correct} showCorrect={s.revealed || ended} />}
        {!ended && s.correct.length > 0 && (
          <button type="button" disabled={pending} onClick={() => start(async () => void (await toggleReveal(sessionId, q.id)))} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-base hover:bg-surface-2">
            {s.revealed ? <><EyeOff className="h-5 w-5" /> Hide answer</> : <><Eye className="h-5 w-5" /> Show answer</>}
          </button>
        )}
        {s.texts.length > 0 && (
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {s.texts.map((t, k) => (
              <div key={k} className="rounded-lg border border-border p-3 text-sm">
                <p className="mb-1 font-semibold">{t.who}</p>
                {t.lines.map((l, j) => <p key={j} className="whitespace-pre-wrap">{l}</p>)}
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
