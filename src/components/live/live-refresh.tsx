"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";

/**
 * Reloads the page's server data when a live lesson changes: the session row,
 * its answers or its participants (Supabase Realtime), with a slow poll as a
 * fallback. Shows a small dot: green = live, grey = reconnecting.
 */
export function LiveRefresh({ sessionId, watch = ["session", "answers", "participants"], every = 15 }: { sessionId: string; watch?: ("session" | "answers" | "participants")[]; every?: number }) {
  const router = useRouter();
  const [live, setLive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = watch.join(",");
  useEffect(() => {
    const refresh = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 400);
    };
    const supabase = getBrowserClient();
    let ch = supabase.channel(`live-${sessionId}-${key}`);
    if (key.includes("session")) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "live_sessions", filter: `id=eq.${sessionId}` }, refresh);
    if (key.includes("answers")) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "live_answers", filter: `session_id=eq.${sessionId}` }, refresh);
    if (key.includes("participants")) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` }, refresh);
    ch.subscribe((status: string) => setLive(status === "SUBSCRIBED"));
    const poll = setInterval(() => router.refresh(), every * 1000);
    return () => {
      clearInterval(poll);
      if (timer.current) clearTimeout(timer.current);
      void supabase.removeChannel(ch);
    };
  }, [sessionId, key, every, router]);
  return <span title={live ? "Live" : "Reconnecting…"} className={`inline-block h-2 w-2 rounded-full ${live ? "bg-success" : "bg-muted"}`} />;
}
