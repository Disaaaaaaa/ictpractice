import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryMap, getPaperTree } from "@/lib/curriculum";
import { getProgressContext, paperReadiness, topicProgress } from "@/lib/progress";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { ReadinessRow } from "@/components/ui/progress";
import { CurriculumViewToggle } from "@/components/view-toggle";
import { TopicRow } from "@/components/topic-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Exam Papers" };

export default async function PapersPage({ searchParams }: PageProps<"/papers">) {
  const profile = await requireProfile();
  const sp = await searchParams;
  const supabase = await createClient();
  const isStudent = profile.role === "student";
  const [tree, ctx, mastery] = await Promise.all([
    getPaperTree(),
    getProgressContext(),
    isStudent ? getMasteryMap(supabase, profile.id) : Promise.resolve(new Map<string, number>()),
  ]);
  const progress = new Map(topicProgress(ctx, mastery).map((t) => [t.id, t]));
  const readiness = new Map(paperReadiness(ctx, mastery).map((r) => [r.paper, r]));
  const selected = tree.find((p) => p.number === Number(sp.paper)) ?? tree[0];

  return (
    <>
      <PageHeader
        title="Exam Papers"
        description="The same topics, organised by the exam component that assesses them."
        actions={<CurriculumViewToggle active="paper" />}
      />
      {!selected ? (
        <EmptyState title="No exam structure loaded" />
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {tree.map((p) => {
              const r = readiness.get(p.number);
              const sections = p.groups.flatMap((g) => g.sections);
              return (
                <Link
                  key={p.id}
                  href={`/papers?paper=${p.number}`}
                  aria-current={p.number === selected.number ? "page" : undefined}
                  className={cn(
                    "rounded-xl border bg-surface p-4 transition-colors hover:bg-surface-2",
                    p.number === selected.number ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                >
                  <p className="text-lg font-semibold">{p.title}</p>
                  <p className="mb-3 text-xs text-muted">
                    {p.groups.map((g) => g.title).join(" · ")} — {sections.length} sections
                  </p>
                  {isStudent && <ReadinessRow label="Readiness" value={r?.value ?? null} />}
                </Link>
              );
            })}
          </div>

          <div className="space-y-6">
            {selected.groups.map((group) => (
              <Card key={group.id}>
                <div className="border-b border-border px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{selected.title}</p>
                  <h2 className="text-lg font-semibold">{group.title}</h2>
                </div>
                <CardBody className="space-y-5">
                  {group.sections.map((section) => (
                    <section key={section.id} aria-labelledby={`sec-${section.id}`}>
                      <h3 id={`sec-${section.id}`} className="mb-2 text-sm font-semibold">
                        {section.code && (
                          <span className="mr-2 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-muted">{section.code}</span>
                        )}
                        {section.title}
                      </h3>
                      {section.topics.length === 0 ? (
                        <p className="text-sm text-muted">No topics mapped to this section yet.</p>
                      ) : (
                        <div className="grid gap-2">
                          {section.topics.map((t) => {
                            const p = progress.get(t.id);
                            return (
                              <TopicRow
                                key={t.id}
                                slug={t.slug}
                                title={t.title}
                                meta={p ? (p.examOnly ? "Exam only — not in the 2026-27 calendar plan" : `Grade ${p.grade} · ${p.termTitle} · ${p.unitCode} ${p.unitTitle}`) : undefined}
                                mastery={p?.mastery ?? null}
                                status={p?.status ?? "Not Started"}
                                showProgress={isStudent}
                              />
                            );
                          })}
                        </div>
                      )}
                    </section>
                  ))}
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
