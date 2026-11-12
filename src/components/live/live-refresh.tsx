"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps a live lesson page up to date without Realtime: every `every` seconds
 * (while the tab is visible) it asks /api/live/<id>/version for a small
 * fingerprint and reloads the page's data only when it changed.
 * Shows a small dot: green = in sync, grey = no answer from the server.
 */
export function LiveRefresh({
  sessionId,
  watch = ["session", "answers", "participants"],
  every = 4,
}: {
  sessionId: string;
  watch?: ("session" | "answers" | "participants")[];
  every?: number;
  /** kept for older callers; not used */
  wait?: number;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(true);
  const last = useRef<string | null>(null);
  const key = watch.join(",");
  useEffect(() => {
    let stop = false;
    const tick = async () => {
      if (stop || document.visibilityState !== "visible") return;
      try {
        const res = await fetch(`/api/live/${sessionId}/version?parts=${key}`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const { v } = (await res.json()) as { v: string };
        if (last.current !== null && v !== last.current) router.refresh();
        last.current = v;
        setOk(true);
      } catch {
        setOk(false);
      }
    };
    void tick();
    const t = setInterval(() => void tick(), every * 1000);
    const onVisible = () => void tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop = true;
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [sessionId, key, every, router]);
  return <span title={ok ? "In sync" : "Reconnecting…"} className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-success" : "bg-muted"}`} />;
}
