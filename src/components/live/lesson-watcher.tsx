"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";

/**
 * For students: opens the Lesson page as soon as their teacher starts a lesson
 * (Realtime insert on live_sessions; RLS only sends their own class's lessons).
 */
export function LessonWatcher() {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith("/live") || path.startsWith("/attempt/")) return;
    const supabase = getBrowserClient();
    const ch = supabase
      .channel("lesson-watcher")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_sessions" }, () => router.push("/live"))
      .subscribe();
    return () => void supabase.removeChannel(ch);
  }, [path, router]);
  return null;
}
