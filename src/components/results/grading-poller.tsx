"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-renders the page while marking is in progress; nudges the grader once. */
export function GradingPoller({ attemptId, kick }: { attemptId: string; kick: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (kick) void fetch(`/api/attempts/${attemptId}/grade`, { method: "POST" });
    let n = 0;
    const id = setInterval(() => {
      n++;
      router.refresh();
      if (n > 40) clearInterval(id);
    }, 4000);
    return () => clearInterval(id);
  }, [attemptId, kick, router]);
  return null;
}
