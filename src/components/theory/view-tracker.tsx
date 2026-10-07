"use client";
import { useEffect, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";

/** Records that a student has read a theory section once it has been on screen for a few seconds. */
export function SectionViewTracker({ sectionId, enabled }: { sectionId: string; enabled: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let done = false;
    const target = ref.current.parentElement ?? ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (done) return;
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            done = true;
            void getBrowserClient().rpc("mark_theory_viewed", { p_section_id: sectionId });
            io.disconnect();
          }, 4000);
        } else if (timer) clearTimeout(timer);
      },
      { threshold: 0.3 },
    );
    io.observe(target);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [sectionId, enabled]);
  return <span ref={ref} hidden />;
}
