import { cn } from "@/lib/cn";

/** LO code, marked when it comes from the Paper 1-2-3 specification rather than the KTP. */
export function LoCode({ code, paper, className }: { code: string; paper?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap font-mono", className)}>
      {code}
      {paper && (
        <span className="rounded bg-warning-soft px-1 py-px font-sans text-[10px] font-semibold uppercase tracking-wide text-warning" title="Objective from the Paper 1-2-3 exam specification (not in the 2026-2027 calendar plan)">
          Paper
        </span>
      )}
    </span>
  );
}
