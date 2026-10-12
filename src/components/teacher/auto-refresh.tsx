"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Re-renders the server page every `seconds` while the tab is visible, so a
 * monitor stays current without a realtime channel.
 */
export function AutoRefresh({ seconds = 15 }: { seconds?: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (!on) return;
    const tick = () => {
      if (document.visibilityState === "visible") startTransition(() => router.refresh());
    };
    const id = setInterval(tick, seconds * 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [on, seconds, router]);

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={() => setOn((v) => !v)} aria-pressed={on}>
        <span className={cn("h-2 w-2 rounded-full", on ? "bg-success" : "bg-border")} aria-hidden />
        {on ? `Live · every ${seconds} s` : "Paused"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => startTransition(() => router.refresh())} disabled={pending} aria-label="Refresh now">
        <RefreshCw className={cn("h-4 w-4", pending && "animate-spin")} />
      </Button>
    </div>
  );
}
