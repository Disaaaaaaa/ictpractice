"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getRealtimeClient } from "@/lib/supabase/client";

type Participant = { student_id?: string; fullscreen?: boolean | null };

/**
 * Reloads the page's server data when a live lesson changes: the session row,
 * its answers or its participants (Supabase Realtime). To save server time:
 * - changes arriving close together cause one reload (at most one per `wait` ms);
 * - a student's "still here" heartbeat does not reload the page — only a new
 *   student or a change of full screen does;
 * - the slow poll runs only while Realtime is disconnected and the tab is visible.
 * Shows a small dot: green = live, grey = reconnecting.
 */
export function LiveRefresh({
  sessionId,
  watch = ["session", "answers", "participants"],
  every = 30,
  wait = 1500,
}: {
  sessionId: string;
  watch?: ("session" | "answers" | "participants")[];
  every?: number;
  wait?: number;
}) {
  const router = useRouter();
  const [live, setLive] = useState(false);
  const liveRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = watch.join(",");
  useEffect(() => {
    const refresh = () => {
      if (timer.current) return; // one reload for a burst of changes
      timer.current = setTimeout(() => {
        timer.current = null;
        router.refresh();
      }, wait);
    };
    // full-screen state of each student seen so far
    const seen = new Map<string, boolean | null | undefined>();
    const onParticipant = (p: { eventType: string; new: Participant }) => {
      const id = p.new?.student_id;
      if (!id) return;
      const fs = p.new.fullscreen;
      const known = seen.has(id);
      seen.set(id, fs);
      if (p.eventType === "INSERT" || (known && seen.get(id) !== fs) || (!known && fs === false)) refresh();
    };
    let stop = false;
    let cleanup = () => {};
    void getRealtimeClient().then((supabase) => {
      if (stop) return;
      let ch = supabase.channel(`live-${sessionId}-${key}`);
      if (key.includes("session")) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "live_sessions", filter: `id=eq.${sessionId}` }, refresh);
      if (key.includes("answers")) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "live_answers", filter: `session_id=eq.${sessionId}` }, refresh);
      if (key.includes("participants")) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` }, onParticipant);
      ch.subscribe((status: string) => {
        liveRef.current = status === "SUBSCRIBED";
        setLive(liveRef.current);
      });
      cleanup = () => void supabase.removeChannel(ch);
    });
    const poll = setInterval(() => {
      if (!liveRef.current && document.visibilityState === "visible") router.refresh();
    }, every * 1000);
    return () => {
      clearInterval(poll);
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      stop = true;
      cleanup();
    };
  }, [sessionId, key, every, wait, router]);
  return <span title={live ? "Live" : "Reconnecting…"} className={`inline-block h-2 w-2 rounded-full ${live ? "bg-success" : "bg-muted"}`} />;
}
