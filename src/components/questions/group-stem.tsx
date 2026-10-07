import { Markdown } from "@/components/markdown";
import type { PaperQuestion } from "@/lib/questions/types";

/** Shared scenario / figure / code of a structured question, shown above each of its parts. */
export function GroupStem({ q, total }: { q: Pick<PaperQuestion, "group_stem" | "group_number" | "group_title">; total?: number }) {
  if (!q.group_stem) return null;
  return (
    <section className="mb-5 rounded-lg border border-border bg-surface-2 p-4" aria-label={`Question ${q.group_number}`}>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Question {q.group_number}
        {total ? <span className="font-normal normal-case tracking-normal">· [Total: {total}]</span> : null}
      </p>
      <Markdown>{q.group_stem}</Markdown>
    </section>
  );
}
