import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BookOpen, CalendarClock, FileCheck2, PencilLine } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, nowMs } from "@/lib/format";
import {
  OVERALL_STATE, PART_LABEL, PART_STATE, overallPercent, overallState, topicParts,
  type Part, type TopicProgressRow,
} from "@/lib/topic-assignments";
import type { Assignment } from "@/lib/db-types";
import { cn } from "@/lib/cn";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Assignment" };

const ICON = { theory: BookOpen, practice: PencilLine, exam: FileCheck2 };

export default async function StudentAssignmentPage({ params }: PageProps<"/assignments/[id]">) {
  const profile = await requireProfile();
  const { id } = await params;
  if (profile.role !== "student") redirect(`/teacher/assignments/${id}`);
  const supabase = await createClient();
  // RLS: a student can read only assignments targeted at them.
  const { data } = await supabase
    .from("assignments")
    .select("*, topics(slug, title), exams(id, title, duration_minutes)")
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();
  if (!data) notFound();
  const a = data as Assignment & {
    topics: { slug: string; title: string } | null;
    exams: { id: string; title: string; duration_minutes: number } | null;
  };
  if (a.assignment_type !== "topic" || !a.topics) {
    redirect(a.exam_id ? `/exams/${a.exam_id}?assignment=${a.id}` : a.topics ? `/learn/${a.topics.slug}/practice` : "/assignments");
  }

  const { data: rows } = await supabase.rpc("topic_assignment_progress", { p_assignment_id: a.id });
  const row = ((rows ?? []) as TopicProgressRow[])[0];
  const now = nowMs();
  const parts = topicParts(a, row, now);
  const overall = overallState(parts);
  const percent = overallPercent(parts);
  const notOpen = new Date(a.available_from).getTime() > now;
  const base = `/learn/${a.topics.slug}`;
  const examOpen = a.deadline ? new Date(a.deadline).getTime() > now : true;

  const action = (p: Part) => {
    if (p.key === "theory") return { href: `${base}/theory`, label: p.state === "done" || p.state === "late" ? "Read again" : p.state === "not_started" ? "Read the theory" : "Continue reading" };
    if (p.key === "practice") return { href: `${base}/practice`, label: p.state === "done" || p.state === "late" ? "Practise more" : p.state === "not_started" ? "Start practice" : "Continue practice" };
    if (row?.exam_submitted_at && row.exam_attempt_id) return { href: `/results/${row.exam_attempt_id}`, label: "View result" };
    // After the deadline the exam can still be sat from the topic page; it counts as late.
    return { href: examOpen ? `/exams/${a.exam_id}?assignment=${a.id}` : `/exams/${a.exam_id}`, label: row?.exam_status === "IN_PROGRESS" ? "Resume exam" : "Go to the exam" };
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumbs={[{ label: "Assignments", href: "/assignments" }, { label: a.title }]}
        title={a.title}
        description={`Topic: ${a.topics.title}`}
        actions={<Badge tone={OVERALL_STATE[overall].tone}>{OVERALL_STATE[overall].label}</Badge>}
      />
      {notOpen && <Alert tone="info" className="mb-6">This assignment opens on {formatDate(a.available_from)}. You can already start working on the topic.</Alert>}

      <Card>
        <CardBody className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Overall progress</span>
            <span className="tabular-nums font-semibold">{Math.round(percent)}%</span>
          </div>
          <ProgressBar value={percent} tone={percent >= 100 ? "success" : "primary"} label="Overall progress" />
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <CalendarClock className="h-4 w-4" aria-hidden /> Final deadline: {formatDate(a.deadline)}
          </p>
          {a.instructions && <Markdown className="border-t border-border pt-3 text-sm">{a.instructions}</Markdown>}
        </CardBody>
      </Card>

      <ol className="mt-6 space-y-4">
        {parts.map((p, i) => {
          const Icon = ICON[p.key];
          const finished = p.state === "done" || p.state === "late";
          const act = p.state === "none" ? null : action(p);
          return (
            <li key={p.key}>
              <Card className={cn(p.state === "overdue" && "border-danger/50", finished && "border-success/40")}>
                <CardBody className="flex flex-wrap items-start gap-4 p-5">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", finished ? "bg-success-soft text-success" : "bg-primary-soft text-primary")}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">Step {i + 1}. {PART_LABEL[p.key]}</h2>
                      <Badge tone={PART_STATE[p.state].tone}>{PART_STATE[p.state].label}</Badge>
                    </div>
                    {p.state === "none" ? (
                      <p className="text-sm text-muted">{p.detail} for this topic — nothing to do here.</p>
                    ) : (
                      <>
                        <p className="text-sm text-muted">
                          {p.key === "theory" && "Read every section of the theory pack."}
                          {p.key === "practice" && `Answer and check ${row?.practice_needed ?? ""} of the ${row?.practice_total ?? ""} practice questions.`}
                          {p.key === "exam" && `Sit the topic exam in Exam Mode${a.exams ? ` (${a.exams.duration_minutes} minutes)` : ""}. It is timed and has no hints.`}
                        </p>
                        {p.key !== "exam" && (
                          <div className="flex items-center gap-3">
                            <ProgressBar value={p.percent} tone={finished ? "success" : "primary"} label={PART_LABEL[p.key]} />
                            <span className="whitespace-nowrap text-xs tabular-nums text-muted">{p.detail}</span>
                          </div>
                        )}
                        {p.key === "exam" && <p className="text-sm">{p.detail}</p>}
                        <p className={cn("flex items-center gap-1.5 text-sm", p.state === "overdue" ? "font-medium text-danger" : "text-muted")}>
                          <CalendarClock className="h-4 w-4" aria-hidden />
                          {p.state === "overdue" ? "Was due" : "Due"} {formatDate(p.deadline)}
                        </p>
                      </>
                    )}
                  </div>
                  {act && <ButtonLink href={act.href} variant={finished ? "secondary" : "primary"} size="sm">{act.label}</ButtonLink>}
                </CardBody>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
