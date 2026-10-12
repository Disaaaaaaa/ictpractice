"use client";
import { useActionState, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormState } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { saveClassTopicVisibility } from "@/app/(app)/teacher/actions";

export type VisibilityGroup = { key: string; title: string; topics: { id: string; title: string }[] };
export type VisibilitySection = { key: string; title: string; groups: VisibilityGroup[] };

/**
 * Tick list of topics for one class: ticked = shown to the class, unticked = hidden.
 * Nothing is saved until the teacher presses Save.
 */
export function TopicVisibilityForm({
  classId,
  className,
  sections,
  hidden: initialHidden,
}: {
  classId: string;
  className: string;
  sections: VisibilitySection[];
  hidden: string[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveClassTopicVisibility, {});
  const [hidden, setHidden] = useState(() => new Set(initialHidden));
  const all = useMemo(() => [...new Set(sections.flatMap((s) => s.groups.flatMap((g) => g.topics.map((t) => t.id))))], [sections]);
  const saved = useMemo(() => new Set(initialHidden), [initialHidden]);
  const changes = all.filter((id) => hidden.has(id) !== saved.has(id)).length;

  const set = (ids: string[], hide: boolean) =>
    setHidden((prev) => {
      const next = new Set(prev);
      for (const id of ids) if (hide) next.add(id); else next.delete(id);
      return next;
    });
  const shownIn = (ids: string[]) => ids.filter((id) => !hidden.has(id)).length;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="class_id" value={classId} />
      <input type="hidden" name="hidden_ids" value={[...hidden].join(",")} />

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm">
        <span>
          <strong className="tabular-nums">{shownIn(all)}</strong> of {all.length} topics shown to {className}
          {hidden.size > 0 && <> · <strong className="tabular-nums">{all.filter((id) => hidden.has(id)).length}</strong> hidden</>}
        </span>
        <span className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => set(all, false)}><Eye className="h-4 w-4" /> Show all</Button>
          <Button variant="secondary" size="sm" onClick={() => set(all, true)}><EyeOff className="h-4 w-4" /> Hide all</Button>
        </span>
      </div>

      {sections.map((section) => {
        const sectionIds = section.groups.flatMap((g) => g.topics.map((t) => t.id));
        if (sectionIds.length === 0) return null;
        return (
          <section key={section.key} className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{section.title}</h2>
              <span className="text-xs text-muted tabular-nums">{shownIn(sectionIds)} / {sectionIds.length} shown</span>
              <span className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => set(sectionIds, false)}>Show all</Button>
                <Button variant="ghost" size="sm" onClick={() => set(sectionIds, true)}>Hide all</Button>
              </span>
            </div>
            {section.groups.filter((g) => g.topics.length > 0).map((group) => {
              const ids = group.topics.map((t) => t.id);
              const shown = shownIn(ids);
              return (
                <fieldset key={group.key} className="rounded-xl border border-border bg-surface">
                  <legend className="sr-only">{group.title}</legend>
                  <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-[var(--primary)]"
                        checked={shown === ids.length}
                        ref={(el) => {
                          if (el) el.indeterminate = shown > 0 && shown < ids.length;
                        }}
                        onChange={(e) => set(ids, !e.target.checked)}
                        aria-label={`Show all topics of ${group.title}`}
                      />
                      {group.title}
                    </label>
                    <span className="ml-auto text-xs text-muted tabular-nums">{shown} / {ids.length} shown</span>
                  </div>
                  <ul className="grid gap-x-6 gap-y-1 px-4 py-3 sm:grid-cols-2">
                    {group.topics.map((t) => {
                      const isHidden = hidden.has(t.id);
                      return (
                        <li key={t.id}>
                          <label className={cn("flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-sm hover:bg-surface-2", isHidden && "text-muted")}>
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[var(--primary)]"
                              checked={!isHidden}
                              onChange={(e) => set([t.id], !e.target.checked)}
                            />
                            <span className={cn(isHidden && "line-through decoration-border")}>{t.title}</span>
                            {isHidden && <EyeOff className="ml-auto mt-0.5 h-3.5 w-3.5 shrink-0" aria-label="Hidden" />}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              );
            })}
          </section>
        );
      })}

      {/* Stays in view while the teacher scrolls the list. */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg">
        <span className="text-sm" role="status">
          {state.error ? (
            <span className="text-danger">{state.error}</span>
          ) : changes > 0 ? (
            <Badge tone="warning">{changes} unsaved change{changes === 1 ? "" : "s"}</Badge>
          ) : state.ok ? (
            <span className="text-success">{state.message}</span>
          ) : (
            <span className="text-muted">Tick the topics {className} should see, then save.</span>
          )}
        </span>
        <Button type="submit" className="ml-auto" disabled={pending || changes === 0}>
          {pending ? "Saving…" : `Save for ${className}`}
        </Button>
      </div>
    </form>
  );
}
