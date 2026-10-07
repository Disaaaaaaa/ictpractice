import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Trophy } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryMap } from "@/lib/curriculum";
import { getProgressContext, overallMastery, paperReadiness, topicProgress } from "@/lib/progress";
import { attemptLink, getRecentAttempts, getStudentAssignments, getStudentClasses } from "@/lib/student-data";
import { formatDate, formatPercent, nowMs } from "@/lib/format";
import { STATUS_TONE } from "@/lib/mastery";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { ProgressBar, ReadinessRow } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AttemptStatusBadge } from "@/components/attempt-status";

export const metadata: Metadata = { title: "Dashboard" };

export default async function StudentDashboard() {
  const profile = await requireProfile(["student"]);
  const supabase = await createClient();
  const grade = profile.grade ?? 12;

  const [ctx, mastery, classes, attempts, assignments, { data: mocks }, { data: lastTheory }] = await Promise.all([
    getProgressContext(),
    getMasteryMap(supabase, profile.id),
    getStudentClasses(supabase, profile.id),
    getRecentAttempts(supabase, profile.id, 50),
    getStudentAssignments(supabase),
    supabase
      .from("exams")
      .select("id, title, year, availability_end, paper_components(number)")
      .eq("kind", "mock")
      .in("status", ["published", "scheduled"])
      .order("availability_end", { ascending: true, nullsFirst: false })
      .limit(3),
    supabase
      .from("theory_progress")
      .select("viewed_at, theory_sections(theory_packs(topics(slug, title)))")
      .eq("student_id", profile.id)
      .order("viewed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  await supabase.rpc("bump_activity");

  const topics = topicProgress(ctx, mastery).filter((t) => t.grade <= grade);
  const overall = overallMastery(ctx, mastery, grade);
  const completed = topics.filter((t) => t.status === "Secure" || t.status === "Mastered").length;
  const graded = attempts.filter((a) => a.status === "GRADED" && a.percentage != null);
  const avgScore = graded.length ? graded.reduce((s, a) => s + Number(a.percentage), 0) / graded.length : null;
  const readiness = paperReadiness(ctx, mastery, grade);
  const attempted = topics.filter((t) => t.attempted);
  const weak = [...attempted].sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0)).slice(0, 5);
  const strong = [...attempted].filter((t) => (t.mastery ?? 0) >= 50).sort((a, b) => (b.mastery ?? 0) - (a.mastery ?? 0)).slice(0, 5);

  const now = nowMs();
  const upcoming = assignments.filter((a) => !a.deadline || new Date(a.deadline).getTime() > now).slice(0, 5);
  const usedByAssignment = new Map<string, number>();
  for (const a of attempts) if (a.assignment_id) usedByAssignment.set(a.assignment_id, (usedByAssignment.get(a.assignment_id) ?? 0) + 1);

  const continueTopic = (() => {
    const t = (lastTheory as unknown as { theory_sections?: { theory_packs?: { topics?: { slug: string; title: string } } } } | null)
      ?.theory_sections?.theory_packs?.topics;
    if (t) return t;
    const next = topics.find((x) => x.status !== "Mastered" && x.grade === grade) ?? topics[0];
    return next ? { slug: next.slug, title: next.title } : null;
  })();

  return (
    <>
      <PageHeader
        title={`Welcome, ${profile.first_name || profile.username}`}
        description={`Grade ${grade}${classes.length ? ` · Class ${classes.map((c) => c.name).join(", ")}` : ""}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Overall mastery" value={formatPercent(overall)} sub="Across all learning objectives" />
        <Stat label="Completed topics" value={`${completed} / ${topics.length}`} sub="Secure or mastered" />
        <Stat label="Exam attempts" value={attempts.filter((a) => a.status !== "IN_PROGRESS").length} sub="Topic exams and mocks" />
        <Stat label="Average exam score" value={formatPercent(avgScore)} sub={`${graded.length} graded`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {continueTopic && (
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-primary-soft px-5 py-5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continue learning</p>
                    <p className="text-lg font-semibold">{continueTopic.title}</p>
                  </div>
                </div>
                <ButtonLink href={`/learn/${continueTopic.slug}/theory`}>
                  Open theory <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Final exam readiness" description="Based on the learning objectives assessed in each paper." />
            <CardBody className="space-y-4">
              {readiness.map((r) => (
                <ReadinessRow key={r.paper} label={`Paper ${r.paper}`} sub={`${r.loCount} objectives`} value={r.value} />
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Recent results"
              action={<Link href="/progress" className="text-sm font-medium text-primary hover:underline">All progress</Link>}
            />
            <CardBody className="p-0">
              {attempts.length === 0 ? (
                <div className="p-5">
                  <EmptyState title="No exams taken yet">Try a topic exam from Learn &amp; Practice or a mock exam.</EmptyState>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {attempts.slice(0, 6).map((a) => (
                    <li key={a.id}>
                      <Link href={attemptLink(a)} className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-surface-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{a.exams?.title ?? "Exam"}</p>
                          <p className="text-xs text-muted">{formatDate(a.submitted_at ?? a.started_at)}</p>
                        </div>
                        {a.status === "GRADED" && a.show_results ? (
                          <span className="font-semibold tabular-nums">{formatPercent(a.percentage)}</span>
                        ) : (
                          <AttemptStatusBadge status={a.status} />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Upcoming exams" />
            <CardBody className="space-y-3">
              {upcoming.length === 0 && (mocks ?? []).length === 0 && <p className="text-sm text-muted">Nothing scheduled.</p>}
              {upcoming.map((a) => {
                const href = a.exam_id ? `/exams/${a.exam_id}?assignment=${a.id}` : a.topics ? `/learn/${a.topics.slug}/practice` : "#";
                return (
                  <Link key={a.id} href={href} className="block rounded-lg border border-border p-3 hover:bg-surface-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{a.title}</p>
                      {usedByAssignment.get(a.id) ? <Badge tone="success">Started</Badge> : <Badge tone="primary">Assigned</Badge>}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                      <CalendarClock className="h-3.5 w-3.5" /> {a.deadline ? `Due ${formatDate(a.deadline)}` : "No deadline"}
                    </p>
                  </Link>
                );
              })}
              {(mocks ?? []).map((m) => (
                <Link key={m.id} href={`/exams/${m.id}`} className="block rounded-lg border border-border p-3 hover:bg-surface-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{m.title}</p>
                    <Badge tone="info">Mock</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {m.availability_end ? `Open until ${formatDate(m.availability_end)}` : "Available now"}
                  </p>
                </Link>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Weak topics" description="Lowest mastery among topics you have practised." />
            <CardBody className="space-y-3">
              {weak.length === 0 ? (
                <p className="text-sm text-muted">Practise some questions to see your weak topics.</p>
              ) : (
                weak.map((t) => (
                  <Link key={t.id} href={`/learn/${t.slug}`} className="block space-y-1.5 hover:opacity-80">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{t.title}</span>
                      <Badge tone={STATUS_TONE[t.status]}>{formatPercent(t.mastery)}</Badge>
                    </div>
                    <ProgressBar value={t.mastery} label={t.title} />
                  </Link>
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Strong topics" />
            <CardBody className="space-y-2">
              {strong.length === 0 ? (
                <p className="text-sm text-muted">Your strongest topics will appear here.</p>
              ) : (
                strong.map((t) => (
                  <Link key={t.id} href={`/learn/${t.slug}`} className="flex items-center justify-between gap-2 text-sm hover:underline">
                    <span className="flex min-w-0 items-center gap-2">
                      <Trophy className="h-4 w-4 shrink-0 text-success" />
                      <span className="truncate">{t.title}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{formatPercent(t.mastery)}</span>
                  </Link>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
