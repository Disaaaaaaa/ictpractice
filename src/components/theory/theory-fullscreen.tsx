"use client";
import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Wraps a theory pack and lets the student read it full screen. Uses the
 * Fullscreen API where available; otherwise (e.g. iPhone Safari) the pack is
 * shown as a fixed full-window overlay. Esc leaves either mode.
 */
export function TheoryFullscreen({ title, children }: { title: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(false); // real browser fullscreen
  const [overlay, setOverlay] = useState(false); // fallback overlay
  const active = native || overlay;

  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === box.current;
      setNative(on);
      if (on) setOverlay(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlay(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // the overlay scrolls, not the page
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [overlay]);

  async function enter() {
    const el = box.current;
    if (el?.requestFullscreen && document.fullscreenEnabled) {
      // Some browsers and embedded views never settle the promise: give up after a moment.
      const ok = await Promise.race([
        el.requestFullscreen().then(() => true, () => false),
        new Promise<boolean>((r) => setTimeout(() => r(false), 800)),
      ]);
      if (ok || document.fullscreenElement === el) return;
    }
    setOverlay(true);
  }

  function exit() {
    if (document.fullscreenElement) void document.exitFullscreen();
    setOverlay(false);
  }

  return (
    <div
      ref={box}
      data-fs={active}
      className={cn("group", active && "overflow-y-auto bg-background", overlay && "fixed inset-0 z-50")}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          active ? "sticky top-0 z-10 mb-4 border-b border-border bg-surface/95 px-4 py-2.5 backdrop-blur sm:px-8" : "mb-4 justify-end",
        )}
      >
        {active && <p className="mr-auto truncate text-sm font-semibold">{title}</p>}
        <button
          type="button"
          onClick={active ? exit : enter}
          aria-pressed={active}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
        >
          {active ? <Minimize2 className="h-4 w-4" aria-hidden /> : <Maximize2 className="h-4 w-4" aria-hidden />}
          {active ? "Exit full screen" : "Full screen"}
        </button>
      </div>
      <div className={cn(active && "mx-auto max-w-6xl px-4 pb-10 sm:px-8")}>{children}</div>
    </div>
  );
}
