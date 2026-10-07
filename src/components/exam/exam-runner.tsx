"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, Check, ChevronLeft, ChevronRight, Clock, CloudOff, Flag, Loader2, Maximize, Save, Send, Wifi,
} from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import { isAnswerBlank, paperLabel, type AnswerData, type PaperQuestion } from "@/lib/questions/types";
import type { IntegrityEventType, IntegrityMode } from "@/lib/db-types";
import { AnswerInput, QuestionText } from "@/components/questions/answer-input";
import { GroupStem } from "@/components/questions/group-stem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeCycleButton } from "@/components/theme-toggle";

export type RunnerInit = {
  serverNow: string;
  attempt: {
    id: string;
    status: string;
    started_at: string;
    deadline_at: string;
    violation_count: number;
    integrity_mode: IntegrityMode;
    max_violations: number;
    require_fullscreen: boolean;
    current_question: number;
  };
  examTitle: string;
  questions: PaperQuestion[];
  answers: { question_id: string; answer: AnswerData | null; flagged: boolean; saved_at: string }[];
};

type Dirty = Record<string, { answer: AnswerData | null; flagged: boolean; time_delta: number }>;
type SaveState = "idle" | "pending" | "saving" | "saved" | "error" | "offline" | "syncing";
type QueuedEvent = { type: IntegrityEventType; started_at: string; ended_at: string | null; metadata?: Record<string, unknown> };

const SAVE_DEBOUNCE_MS = 1500;
const HEARTBEAT_MS = 15000;

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function storageSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: server autosave still works */
  }
}

export function ExamRunner({ init }: { init: RunnerInit }) {
  const router = useRouter();
  const supabase = getBrowserClient();
  const attemptId = init.attempt.id;
  const questions = init.questions;
  const cacheKey = `exam-cache:${attemptId}`;

  // ---------------------------------------------------------------- state
  const [answers, setAnswers] = useState<Record<string, AnswerData | null>>(() =>
    Object.fromEntries(init.answers.map((a) => [a.question_id, a.answer])),
  );
  const [flagged, setFlagged] = useState<Set<string>>(
    () => new Set(init.answers.filter((a) => a.flagged).map((a) => a.question_id)),
  );
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(0, (init.attempt.current_question ?? 1) - 1), questions.length - 1),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [online, setOnline] = useState(true);
  const [violations, setViolations] = useState(init.attempt.violation_count);
  const [warning, setWarning] = useState<string | null>(null);
  const [superseded, setSuperseded] = useState(false);
  const [needsFullscreen, setNeedsFullscreen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState(false);

  // ---------------------------------------------------------------- refs (stable across renders)
  const sessionId = useRef<string>("");
  const dirty = useRef<Dirty>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushing = useRef<Promise<void> | null>(null);
  const offset = useRef(0); // server clock − client clock, set on mount and every heartbeat
  const deadline = useRef(new Date(init.attempt.deadline_at).getTime());
  const questionShownAt = useRef(0);
  const flushRef = useRef<() => Promise<void>>(async () => {});
  const finished = useRef(false);
  const eventQueue = useRef<QueuedEvent[]>([]);
  const openEvents = useRef<Record<string, Promise<string | null>>>({});
  const indexRef = useRef(index);
  const answersRef = useRef(answers);
  const flaggedRef = useRef(flagged);
  const submittingRef = useRef(false);
  const autoSubmitTried = useRef(false);
  const sessionClaimed = useRef(false);
  useEffect(() => {
    indexRef.current = index;
    answersRef.current = answers;
    flaggedRef.current = flagged;
  }, [index, answers, flagged]);

  const serverNow = () => Date.now() + offset.current;
  const [remaining, setRemaining] = useState(() =>
    Math.round((new Date(init.attempt.deadline_at).getTime() - new Date(init.serverNow).getTime()) / 1000),
  );

  const current = questions[index];
  const answeredCount = useMemo(
    () => questions.filter((q) => !isAnswerBlank(answers[q.id])).length,
    [questions, answers],
  );

  // ---------------------------------------------------------------- persistence
  const persistLocal = useCallback(() => {
    storageSet(cacheKey, { dirty: dirty.current, savedAt: Date.now() });
  }, [cacheKey]);

  const recordTime = useCallback(() => {
    const q = questions[indexRef.current];
    if (!q) return;
    const delta = Math.min(300, Math.round((Date.now() - questionShownAt.current) / 1000));
    questionShownAt.current = Date.now();
    if (delta <= 0) return;
    const entry = dirty.current[q.id];
    if (entry) entry.time_delta = Math.min(300, entry.time_delta + delta);
    else
      dirty.current[q.id] = {
        answer: answersRef.current[q.id] ?? null,
        flagged: flaggedRef.current.has(q.id),
        time_delta: delta,
      };
  }, [questions]);

  const flush = useCallback(async (): Promise<void> => {
    if (flushing.current) return flushing.current;
    const items = Object.entries(dirty.current);
    if (items.length === 0 || finished.current) return;
    if (!navigator.onLine) {
      setSaveState("offline");
      return;
    }
    const snapshot = { ...dirty.current };
    dirty.current = {};
    setSaveState((s) => (s === "offline" || s === "error" ? "syncing" : "saving"));
    flushing.current = (async () => {
      const { data, error } = await supabase.rpc("save_answers_bulk", {
        p_attempt_id: attemptId,
        p_session_id: sessionId.current,
        p_items: items.map(([question_id, v]) => ({ question_id, ...v })),
      });
      if (error) {
        // put back what failed, unless newer edits replaced it
        for (const [qid, v] of Object.entries(snapshot)) {
          if (!dirty.current[qid]) dirty.current[qid] = v;
          else dirty.current[qid].time_delta = Math.min(300, dirty.current[qid].time_delta + v.time_delta);
        }
        persistLocal();
        if (/SESSION_SUPERSEDED/.test(error.message)) setSuperseded(true);
        setSaveState(navigator.onLine ? "error" : "offline");
        throw error;
      }
      const result = data as { error?: string; server_now?: string } | null;
      if (result?.error === "ATTEMPT_CLOSED") {
        finished.current = true;
        router.replace(`/results/${attemptId}`);
        return;
      }
      if (result?.server_now) offset.current = new Date(result.server_now).getTime() - Date.now();
      persistLocal();
      setSaveState(Object.keys(dirty.current).length ? "pending" : "saved");
    })().finally(() => {
      flushing.current = null;
    });
    return flushing.current.catch(() => {
      // retry with backoff while there is something to save
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => void flushRef.current(), 4000);
    });
  }, [attemptId, persistLocal, router, supabase]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  const scheduleSave = useCallback(() => {
    setSaveState("pending");
    persistLocal();
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void flush(), SAVE_DEBOUNCE_MS);
  }, [flush, persistLocal]);

  const updateAnswer = useCallback(
    (qid: string, value: AnswerData | null) => {
      setAnswers((a) => ({ ...a, [qid]: value }));
      const prev = dirty.current[qid];
      dirty.current[qid] = { answer: value, flagged: flaggedRef.current.has(qid), time_delta: prev?.time_delta ?? 0 };
      scheduleSave();
    },
    [scheduleSave],
  );

  const toggleFlag = useCallback(
    (qid: string) => {
      setFlagged((f) => {
        const next = new Set(f);
        if (next.has(qid)) next.delete(qid);
        else next.add(qid);
        const prev = dirty.current[qid];
        dirty.current[qid] = {
          answer: answersRef.current[qid] ?? null,
          flagged: next.has(qid),
          time_delta: prev?.time_delta ?? 0,
        };
        return next;
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= questions.length) return;
      recordTime();
      setIndex(i);
      setNavOpen(false);
      window.scrollTo({ top: 0 });
    },
    [questions.length, recordTime],
  );

  // ---------------------------------------------------------------- integrity events
  const sendEvent = useCallback(
    async (ev: QueuedEvent): Promise<string | null> => {
      if (finished.current) return null;
      if (!navigator.onLine) {
        eventQueue.current.push(ev);
        return null;
      }
      const { data, error } = await supabase.rpc("log_integrity_event", {
        p_attempt_id: attemptId,
        p_session_id: sessionId.current,
        p_event_type: ev.type,
        p_started_at: ev.started_at,
        p_ended_at: ev.ended_at,
        p_metadata: ev.metadata ?? {},
      });
      if (error) {
        eventQueue.current.push(ev);
        return null;
      }
      const r = data as { event_id?: string; violation_count?: number; auto_submitted?: boolean; ignored?: boolean };
      if (typeof r.violation_count === "number") setViolations(r.violation_count);
      if (r.auto_submitted) {
        finished.current = true;
        router.replace(`/results/${attemptId}?reason=violations`);
      }
      return r.event_id ?? null;
    },
    [attemptId, router, supabase],
  );

  const startEvent = useCallback(
    (key: string, type: IntegrityEventType, metadata?: Record<string, unknown>) => {
      if (key in openEvents.current) return;
      openEvents.current[key] = sendEvent({ type, started_at: new Date(serverNow()).toISOString(), ended_at: null, metadata });
    },
     
    [sendEvent],
  );

  const endEvent = useCallback(
    async (key: string, warn: boolean) => {
      if (!(key in openEvents.current)) return;
      const pending = openEvents.current[key];
      delete openEvents.current[key];
      const id = await pending;
      if (id) await supabase.rpc("close_integrity_event", { p_event_id: id, p_ended_at: new Date(serverNow()).toISOString() });
      if (warn && init.attempt.integrity_mode !== "monitor" && !finished.current) setWarning(key);
    },
     
    [init.attempt.integrity_mode, supabase],
  );

  // ---------------------------------------------------------------- submit
  const submit = useCallback(
    async (auto = false) => {
      if (finished.current || submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      setSubmitError(null);
      recordTime();
      try {
        await flush();
        if (Object.keys(dirty.current).length && navigator.onLine) await flush();
      } catch {
        /* submit anyway: the server keeps the last saved state */
      }
      const { error } = await supabase.rpc("submit_attempt", { p_attempt_id: attemptId, p_session_id: sessionId.current });
      if (error) {
        submittingRef.current = false;
        if (!auto) setSubmitting(false);
        setSubmitError(friendlyError(error, "The exam could not be submitted. Check your connection and try again."));
        return;
      }
      finished.current = true;
      try {
        localStorage.removeItem(cacheKey);
      } catch {}
      void fetch(`/api/attempts/${attemptId}/grade`, { method: "POST" });
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      router.replace(`/results/${attemptId}`);
    },
    [attemptId, cacheKey, flush, recordTime, router, supabase],
  );

  // ---------------------------------------------------------------- mount: session, cache, listeners
  useEffect(() => {
    offset.current = new Date(init.serverNow).getTime() - Date.now();
    questionShownAt.current = Date.now();
    const key = `exam-session:${attemptId}`;
    let isReload = false;
    try {
      const existing = sessionStorage.getItem(key);
      if (existing) {
        sessionId.current = existing;
        isReload = true;
      } else {
        sessionId.current = newSessionId();
        sessionStorage.setItem(key, sessionId.current);
      }
    } catch {
      sessionId.current = newSessionId();
    }

    // Restore answers that were typed but not yet confirmed by the server.
    const cached = storageGet<{ dirty: Dirty }>(cacheKey);
    if (cached?.dirty && Object.keys(cached.dirty).length) {
      dirty.current = cached.dirty;
      // Local cache can only be read after hydration, so this runs in the mount effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers((a) => ({ ...a, ...Object.fromEntries(Object.entries(cached.dirty).map(([k, v]) => [k, v.answer])) }));
      setFlagged((f) => {
        const next = new Set(f);
        for (const [k, v] of Object.entries(cached.dirty)) {
          if (v.flagged) next.add(k);
          else next.delete(k);
        }
        return next;
      });
    }

    // Guard: React strict mode runs mount effects twice in development; claim the session once.
    if (!sessionClaimed.current) {
      sessionClaimed.current = true;
      void supabase
        .rpc("claim_attempt_session", { p_attempt_id: attemptId, p_session_id: sessionId.current, p_is_reload: isReload })
        .then(({ data }: { data: unknown }) => {
          const r = data as { status?: string; violation_count?: number; auto_submitted?: boolean } | null;
          if (r?.status && r.status !== "IN_PROGRESS") {
            finished.current = true;
            router.replace(`/results/${attemptId}`);
            return;
          }
          if (typeof r?.violation_count === "number") setViolations(r.violation_count);
          void flush();
        });
    }

    if (init.attempt.require_fullscreen && !document.fullscreenElement && document.fullscreenEnabled) {
      setNeedsFullscreen(true);
    }
    setOnline(navigator.onLine);

    const onVisibility = () => {
      if (finished.current) return;
      if (document.visibilityState === "hidden") {
        recordTime();
        void flush();
        startEvent("tab", "TAB_HIDDEN");
      } else {
        questionShownAt.current = Date.now();
        void endEvent("tab", true);
      }
    };
    let blurTimer: ReturnType<typeof setTimeout> | undefined;
    const onBlur = () => {
      if (finished.current) return;
      // A tab switch also blurs the window; only report blur when the page stays visible.
      blurTimer = setTimeout(() => {
        if (document.visibilityState === "visible" && !document.hasFocus()) startEvent("blur", "WINDOW_BLUR");
      }, 400);
    };
    const onFocus = () => {
      if (blurTimer) clearTimeout(blurTimer);
      void endEvent("blur", true);
    };
    const onFullscreen = () => {
      if (finished.current || !init.attempt.require_fullscreen) return;
      if (!document.fullscreenElement) {
        startEvent("fs", "FULLSCREEN_EXIT");
        setNeedsFullscreen(true);
      } else {
        setNeedsFullscreen(false);
        void endEvent("fs", true);
      }
    };
    const onOffline = () => {
      setOnline(false);
      setSaveState("offline");
      eventQueue.current.push({ type: "CONNECTION_LOST", started_at: new Date(serverNow()).toISOString(), ended_at: null });
    };
    const onOnline = async () => {
      setOnline(true);
      eventQueue.current.push({ type: "CONNECTION_RESTORED", started_at: new Date(serverNow()).toISOString(), ended_at: null });
      const queued = eventQueue.current.splice(0);
      for (const ev of queued) await sendEvent(ev);
      setSaveState("syncing");
      try {
        await flush();
      } catch {}
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (finished.current) return;
      e.preventDefault();
    };
    const onPageHide = () => {
      if (finished.current) return;
      recordTime();
      persistLocal();
      const items = Object.entries(dirty.current).map(([question_id, v]) => ({ question_id, ...v }));
      const body = JSON.stringify({ session_id: sessionId.current, answers: items, leaving: true });
      navigator.sendBeacon?.(`/api/attempts/${attemptId}/beacon`, new Blob([body], { type: "application/json" }));
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("fullscreenchange", onFullscreen);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);

    // No copy, cut, paste, drag-and-drop or context menu while the exam is open.
    // Capture phase on window so the code editor never receives the event.
    let noticeTimer: ReturnType<typeof setTimeout> | undefined;
    const blockClipboard = (e: Event) => {
      if (finished.current) return;
      if (e.type === "beforeinput") {
        const t = (e as InputEvent).inputType;
        if (t !== "insertFromPaste" && t !== "insertFromDrop" && t !== "insertFromPasteAsQuotation") return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.type !== "dragstart" && e.type !== "dragover") {
        setClipboardNotice(true);
        if (noticeTimer) clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => setClipboardNotice(false), 2500);
      }
    };
    const blocked = ["copy", "cut", "paste", "contextmenu", "dragstart", "dragover", "drop", "beforeinput"] as const;
    for (const type of blocked) window.addEventListener(type, blockClipboard, true);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
      for (const type of blocked) window.removeEventListener(type, blockClipboard, true);
      if (noticeTimer) clearTimeout(noticeTimer);
      if (blurTimer) clearTimeout(blurTimer);
    };
    // Mount-only: handlers read the latest state through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------- timer + heartbeat
  useEffect(() => {
    const tick = setInterval(() => {
      const secs = Math.round((deadline.current - serverNow()) / 1000);
      setRemaining(secs);
      if (secs <= 0 && !finished.current && !submittingRef.current && !autoSubmitTried.current) {
        autoSubmitTried.current = true;
        setConfirmSubmit(false);
        void submit(true);
      }
    }, 500);
    return () => clearInterval(tick);
     
  }, [submit]);

  useEffect(() => {
    const beat = async () => {
      if (finished.current || !navigator.onLine || !sessionId.current) return;
      const { data, error } = await supabase.rpc("attempt_heartbeat", {
        p_attempt_id: attemptId,
        p_session_id: sessionId.current,
        p_current_question: indexRef.current + 1,
        p_online: true,
      });
      if (error || !data) return;
      const r = data as { status: string; server_now: string; deadline_at: string; violation_count: number; superseded: boolean };
      offset.current = new Date(r.server_now).getTime() - Date.now();
      deadline.current = new Date(r.deadline_at).getTime();
      setViolations(r.violation_count);
      if (r.superseded) setSuperseded(true);
      if (r.status !== "IN_PROGRESS") {
        finished.current = true;
        router.replace(`/results/${attemptId}`);
      }
    };
    const id = setInterval(beat, HEARTBEAT_MS);
    const first = setTimeout(beat, 2000);
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, [attemptId, router, supabase]);

  // Keyboard navigation (not while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable=true], .cm-editor")) return;
      if (e.key === "ArrowRight") goTo(indexRef.current + 1);
      if (e.key === "ArrowLeft") goTo(indexRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const enterFullscreen = async () => {
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
    await Promise.race([document.documentElement.requestFullscreen().catch(() => {}), timeout]);
    setNeedsFullscreen(false);
  };

  // ---------------------------------------------------------------- render
  const unanswered = questions.length - answeredCount;
  const timeTone = remaining <= 60 ? "text-danger" : remaining <= 300 ? "text-warning" : "text-fg";
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
  const groupTotal = current.group_id
    ? questions.filter((q) => q.group_id === current.group_id).reduce((s, q) => s + q.marks, 0)
    : undefined;

  const saveLabel: Record<SaveState, React.ReactNode> = {
    idle: <span className="text-muted">All answers saved</span>,
    pending: <span className="text-muted">Unsaved changes…</span>,
    saving: (
      <span className="inline-flex items-center gap-1 text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </span>
    ),
    saved: (
      <span className="inline-flex items-center gap-1 text-success">
        <Check className="h-3.5 w-3.5" /> Saved
      </span>
    ),
    error: (
      <span className="inline-flex items-center gap-1 text-warning">
        <AlertTriangle className="h-3.5 w-3.5" /> Your answer could not be saved. Retrying…
      </span>
    ),
    offline: (
      <span className="inline-flex items-center gap-1 text-danger">
        <CloudOff className="h-3.5 w-3.5" /> Connection lost. Your answers are stored on this device.
      </span>
    ),
    syncing: (
      <span className="inline-flex items-center gap-1 text-info">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing…
      </span>
    ),
  };

  const navGrid = (
    <ol className="grid grid-cols-5 gap-2 lg:grid-cols-4">
      {questions.map((q, i) => {
        const done = !isAnswerBlank(answers[q.id]);
        const isFlag = flagged.has(q.id);
        return (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index ? "step" : undefined}
              aria-label={`Question ${paperLabel(q)}${done ? ", answered" : ", unanswered"}${isFlag ? ", flagged" : ""}`}
              className={cn(
                "relative flex h-10 w-full items-center justify-center rounded-lg border font-semibold tabular-nums transition-colors",
                paperLabel(q).length > 4 ? "text-[11px]" : "text-sm",
                i === index
                  ? "border-primary bg-primary text-primary-fg"
                  : done
                    ? "border-success/40 bg-success-soft text-success"
                    : "border-border bg-surface hover:bg-surface-2",
              )}
            >
              {paperLabel(q)}
              {isFlag && <Flag className="absolute -right-1 -top-1 h-3.5 w-3.5 fill-warning text-warning" aria-hidden />}
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{init.examTitle}</p>
            <p className="hidden text-xs sm:block">{saveLabel[saveState]}</p>
          </div>
          <div className={cn("flex items-center gap-1.5 font-mono text-xl font-semibold tabular-nums", timeTone)} role="timer" aria-live="off">
            <Clock className="h-5 w-5" aria-hidden />
            {formatClock(remaining)}
          </div>
          <div className="hidden text-sm font-medium tabular-nums sm:block">
            Q {paperLabel(current)} · {index + 1}/{questions.length}
          </div>
          {violations > 0 && (
            <Badge tone="danger">
              <AlertTriangle className="h-3 w-3" /> {violations}
              {init.attempt.integrity_mode === "auto_submit" ? ` / ${init.attempt.max_violations}` : ""}
            </Badge>
          )}
          <ThemeCycleButton />
          <span title={online ? "Online" : "Offline"} className={online ? "text-success" : "text-danger"}>
            {online ? <Wifi className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
          </span>
        </div>
        <p className="px-4 pb-2 text-xs sm:hidden">{saveLabel[saveState]}</p>
        {remaining <= 300 && remaining > 0 && (
          <div className="bg-warning-soft px-4 py-1 text-center text-xs font-medium text-warning" role="status">
            {remaining <= 60 ? "Less than one minute left — the exam will submit automatically." : "5 minutes remaining."}
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6">
        {/* Question navigator */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-4">
            <p className="text-sm font-semibold">Questions</p>
            {navGrid}
            <ul className="space-y-1 text-xs text-muted">
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-success-soft ring-1 ring-success/40" /> Answered ({answeredCount})</li>
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-surface ring-1 ring-border" /> Unanswered ({unanswered})</li>
              <li className="flex items-center gap-2"><Flag className="h-3 w-3 fill-warning text-warning" /> Flagged ({flagged.size})</li>
            </ul>
          </div>
        </aside>

        {/* Question */}
        <main id="main" className="min-w-0 flex-1">
          <button
            type="button"
            className="mb-4 w-full rounded-lg border border-border bg-surface px-4 py-2 text-left text-sm font-medium lg:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
          >
            Question {paperLabel(current)} ({index + 1} of {questions.length}) · {answeredCount} answered — {navOpen ? "hide" : "show"} all
          </button>
          {navOpen && <div className="mb-4 rounded-lg border border-border bg-surface p-3 lg:hidden">{navGrid}</div>}

          <article className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-7" aria-labelledby="question-heading">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 id="question-heading" className="text-lg font-semibold">
                Question {paperLabel(current)}
              </h2>
              <Badge tone="primary">
                {current.marks} mark{current.marks === 1 ? "" : "s"}
              </Badge>
              {current.section_label && <Badge>{current.section_label}</Badge>}
              <button
                type="button"
                onClick={() => toggleFlag(current.id)}
                aria-pressed={flagged.has(current.id)}
                className={cn(
                  "ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium",
                  flagged.has(current.id) ? "border-warning bg-warning-soft text-warning" : "border-border hover:bg-surface-2",
                )}
              >
                <Flag className={cn("h-4 w-4", flagged.has(current.id) && "fill-warning")} />
                {flagged.has(current.id) ? "Flagged" : "Flag for review"}
              </button>
            </div>
            <div className="select-none">
              <GroupStem q={current} total={groupTotal} />
              <QuestionText text={current.question_text} type={current.question_type} />
            </div>
            <div className="mt-6">
              <AnswerInput
                key={current.id}
                question={current}
                value={answers[current.id] ?? null}
                onChange={(v) => updateAnswer(current.id, v)}
                disabled={submitting || superseded}
              />
            </div>
          </article>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => goTo(index - 1)} disabled={index === 0}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button variant="ghost" onClick={() => { recordTime(); void flush(); }} disabled={saveState === "saving"}>
              <Save className="h-4 w-4" /> Save
            </Button>
            {index < questions.length - 1 ? (
              <Button onClick={() => goTo(index + 1)}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="success" onClick={() => setConfirmSubmit(true)}>
                <Send className="h-4 w-4" /> Finish exam
              </Button>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={() => setConfirmSubmit(true)} disabled={submitting}>
              <Send className="h-4 w-4" /> Submit exam
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            {questions.length} questions · {totalMarks} marks · leaving this window is recorded
          </p>
        </main>
      </div>

      {clipboardNotice && (
        <div role="status" className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-fg px-4 py-2 text-sm font-medium text-background shadow-lg">
          Copy and paste are disabled during the exam.
        </div>
      )}

      {/* Integrity warning (spec §29) */}
      {warning && (
        <Modal labelledBy="integrity-title">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-6 w-6" />
            <h2 id="integrity-title" className="text-lg font-semibold">Warning</h2>
          </div>
          <p className="mt-3">
            {warning === "fs" ? "You exited fullscreen mode." : "You left the exam window."}
          </p>
          <p className="mt-1 text-sm text-muted">This event has been recorded and will be visible to your teacher.</p>
          <p className="mt-3 font-semibold">
            Violation: {violations}
            {init.attempt.integrity_mode === "auto_submit" && (
              <span className="font-normal text-danger">
                {" "}— the exam is submitted automatically at {init.attempt.max_violations}.
              </span>
            )}
          </p>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setWarning(null)} autoFocus>
              Return to exam
            </Button>
          </div>
        </Modal>
      )}

      {needsFullscreen && !superseded && !warning && (
        <Modal labelledBy="fs-title">
          <h2 id="fs-title" className="text-lg font-semibold">Fullscreen required</h2>
          <p className="mt-2 text-sm text-muted">
            This exam runs in fullscreen. Exiting fullscreen during the exam is recorded.
          </p>
          <div className="mt-5 flex justify-end">
            <Button onClick={enterFullscreen} autoFocus>
              <Maximize className="h-4 w-4" /> Enter fullscreen
            </Button>
          </div>
        </Modal>
      )}

      {superseded && (
        <Modal labelledBy="sup-title">
          <h2 id="sup-title" className="text-lg font-semibold">Exam opened elsewhere</h2>
          <p className="mt-2 text-sm text-muted">
            This exam is now open in another window or on another device, so this window has stopped saving. The event has
            been recorded. Continue in the other window, or reopen the exam here.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              onClick={() => {
                try {
                  sessionStorage.removeItem(`exam-session:${attemptId}`);
                } catch {}
                finished.current = true;
                window.location.reload();
              }}
            >
              Continue here
            </Button>
          </div>
        </Modal>
      )}

      {confirmSubmit && (
        <Modal labelledBy="submit-title">
          <h2 id="submit-title" className="text-lg font-semibold">Submit exam?</h2>
          {unanswered > 0 ? (
            <p className="mt-2">
              You have <strong>{unanswered}</strong> unanswered question{unanswered === 1 ? "" : "s"}.
            </p>
          ) : (
            <p className="mt-2">You have answered every question.</p>
          )}
          {flagged.size > 0 && <p className="mt-1 text-sm text-warning">{flagged.size} question(s) are flagged for review.</p>}
          <p className="mt-2 text-sm text-muted">Are you sure you want to submit? You cannot change your answers afterwards.</p>
          {submitError && <p className="mt-3 text-sm text-danger">{submitError}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmSubmit(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="success" onClick={() => submit(false)} disabled={submitting} autoFocus>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Exam
            </Button>
          </div>
        </Modal>
      )}

      {submitting && !confirmSubmit && (
        <Modal labelledBy="auto-title">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <h2 id="auto-title" className="font-semibold">Time is up — submitting your exam…</h2>
          </div>
          {submitError && (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-danger">{submitError}</p>
              <Button onClick={() => { setSubmitError(null); void submit(true); }}>Try again</Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, labelledBy }: { children: React.ReactNode; labelledBy: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl">{children}</div>
    </div>
  );
}
