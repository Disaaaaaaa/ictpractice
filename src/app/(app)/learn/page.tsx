import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryMap, getSchoolTree, mainPlans, plansFor } from "@/lib/curriculum";
import { getProgressContext, loAverage, topicProgress } from "@/lib/progress";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress";
import { CurriculumViewToggle } from "@/components/view-toggle";
import { TopicRow } from "@/components/topic-card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Learn & Practice" };

export default async function LearnPage({ searchParams }: PageProps<"/learn">) {
  const profile = await requireProfile();
  const sp = await searchParams;
  const supabase = await createClient();
  const isStudent = profile.role === "student";
  const [fullTree, ctx, mastery] = await Promise.all([
    getSchoolTree(),
    getProgressContext(),
    isStudent ? getMasteryMap(supabase, profile.id) : Promise.resolve(new Map<string, number>()),
  ]);
  const progress = new Map(topicProgress(ctx, mastery).map((t) => [t.id, t]));
  // Grade 12 students get the 2025-26 Grade 11 KTP they were taught by instead of the new one.
  const tree = plansFor(fullTree, profile);
  const param = typeof sp.grade === "string" ? sp.grade : "";
  const current =
    tree.find((g) => g.key === param) ??
    tree.find((g) => String(g.grade) === param) ??
    tree.find((g) => g.grade === profile.grade && g.forStudentGrade === null) ??
    tree.find((g) => g.grade === profile.grade) ??
    tree[0];

  return (
    <>
      <PageHeader
        title="Learn & Practice"
        description="Theory packs, practice questions and topic exams, organised the way they are taught."
        actions={<CurriculumViewToggle active="school" />}
      />
      {!current ? (
        <EmptyState title="No curriculum loaded">Ask an administrator to import the curriculum.</EmptyState>
      ) : (
        <>
          <nav className="mb-6 flex gap-2" aria-label="Grade">
            {tree.map((g) => (
              <Link
                key={g.key}
                href={`/learn?grade=${g.key}`}
                aria-current={g === current ? "page" : undefined}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium",
                  g === current ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2",
                )}
              >
                {g.title}
                {!isStudent && g.forStudentGrade ? ` (Grade ${g.forStudentGrade} students)` : ""}
              </Link>
            ))}
          </nav>
          <div className="space-y-6">
            {current.terms.map((term) => {
              const termLos = [...new Set(term.units.flatMap((u) => u.topics.flatMap((t) => progress.get(t.id)?.loIds ?? [])))];
              const termValue = loAverage(termLos, mastery);
              return (
                <Card key={term.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <div>
                      <h2 className="text-lg font-semibold">{term.title}</h2>
                      <p className="text-sm text-muted">
                        {term.units.length} units{term.hours ? ` · ${term.hours} hours` : ""}
                      </p>
                    </div>
                    {isStudent && (
                      <div className="flex w-48 items-center gap-2">
                        <ProgressBar value={termValue} label={`${term.title} progress`} />
                        <span className="w-10 text-right text-sm tabular-nums">{formatPercent(termValue)}</span>
                      </div>
                    )}
                  </div>
                  <CardBody className="space-y-5">
                    {term.units.map((unit) => (
                      <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
                        <h3 id={`unit-${unit.id}`} className="mb-2 text-sm font-semibold">
                          <span className="mr-2 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-muted">{unit.code}</span>
                          {unit.title}
                          {!isStudent && unit.topics.some((t) => t.hours) && (
                            <span className="ml-2 text-xs font-normal text-muted">{unit.topics.reduce((h, t) => h + (t.hours ?? 0), 0)} h</span>
                          )}
                        </h3>
                        {unit.topics.length === 0 ? (
                          <p className="text-sm text-muted">
                            {unit.hiddenTopics > 0 ? "The topics of this unit are not open for your class yet." : "Revision unit — use Exam Papers and Mock Exams."}
                          </p>
                        ) : (
                          <div className="grid gap-2">
                            {unit.topics.map((t) => {
                              const p = progress.get(t.id);
                              return (
                                <TopicRow
                                  key={t.id}
                                  slug={t.slug}
                                  title={t.title}
                                  meta={[t.lessons && `Lessons ${t.lessons}`, t.period].filter(Boolean).join(" · ")}
                                  hours={isStudent ? undefined : t.hours}
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
              );
            })}
            {(() => {
              // not in any plan of the viewer: for Grade 12 students the 2025-26 KTP covers most of them
              const planned = new Set((isStudent ? tree : mainPlans(tree)).flatMap((g) => g.terms.flatMap((t) => t.units.flatMap((u) => u.topics.map((x) => x.id)))));
              const examOnly = [...progress.values()].filter((t) => t.examOnly && !planned.has(t.id));
              if (!examOnly.length) return null;
              return (
                <Card className="border-warning/40">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold">Exam-only topics</h2>
                    <p className="text-sm text-muted">
                      Assessed in Paper 1-2-3 but not part of the calendar plan. They also appear under Exam Papers.
                    </p>
                  </div>
                  <CardBody className="grid gap-2">
                    {examOnly.map((t) => (
                      <TopicRow
                        key={t.id}
                        slug={t.slug}
                        title={t.title}
                        meta={t.papers.map((p) => `Paper ${p}`).join(" · ")}
                        mastery={t.mastery}
                        status={t.status}
                        showProgress={isStudent}
                      />
                    ))}
                  </CardBody>
                </Card>
              );
            })()}
          </div>
        </>
      )}
    </>
  );
}
