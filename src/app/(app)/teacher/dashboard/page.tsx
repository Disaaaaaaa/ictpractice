import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ClipboardList, Layers, Radio, Users } from "lucide-react";
import { requireProfile, shortName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts, getTeacherClasses, getVisibleStudents } from "@/lib/teacher-data";
import { formatDate, formatPercent, relativeTime, nowMs } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { ConfirmButton } from "@/components/action-form";
import { retryGrading } from "../actions";

export const metadata: Metadata = { title: "Teacher dashboard" };

export default async function TeacherDashboard() {
  const profile = await requireProfile(["teacher", "admin"]);
  const supabase = await createClient();
  const [classes, students, { data: assignments }] = await Promise.all([
    getTeacherClasses(supabase, profile),
    getVisibleStudents(supabase),
    supabase.from("assignments").select("id, title, deadline, exam_id").eq("teacher_id", profile.id).is("archived_at", null).order("deadline", { ascending: true, nullsFirst: false }).limit(50),
  ]);
  const studentIds = students.map((s) => s.id);
  const attempts = await getAttempts(supabase, { studentIds, limit: 300 });
  const live = attempts.filter((a) => a.status === "IN_PROGRESS" && new Date(a.deadline_at).getTime() > nowMs());
  const review = attempts.filter((a) => a.status === "REVIEW_REQUIRED");
  const pendingGrading = attempts.filter((a) => a.status === "SUBMITTED");
  const recent = attempts.filter((a) => a.status !== "IN_PROGRESS").slice(0, 8);
  const upcoming = (assignments ?? []).filter((a) => !a.deadline || new Date(a.deadline).getTime() > nowMs()).slice(0, 6);
  const liveByExam = new Map<string, { title: string; count: number }>();
  for (const a of live) {
    const k = a.exam_id;
    liveByExam.set(k, { title: a.exams?.title ?? "Exam", count: (liveByExam.get(k)?.count ?? 0) + 1 });
  }

  return (
    <>
      <PageHeader
        title={`Welcome, ${profile.first_name || profile.username}`}
        description="Your classes, live exams and marking at a glance."
        actions={<ButtonLink href="/teacher/assignments/new">New assignment</ButtonLink>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Classes" value={classes.length} icon={<Layers className="h-4 w-4" />} />
        <Stat label="Students" value={students.length} icon={<Users className="h-4 w-4" />} />
        <Stat label="Live exam sessions" value={live.length} icon={<Radio className="h-4 w-4" />} />
        <Stat label="Awaiting your review" value={review.length} sub={pendingGrading.length ? `${pendingGrading.length} still being marked` : undefined} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {liveByExam.size > 0 && (
            <Card className="border-info/40">
              <CardHeader title="Exams in progress now" />
              <CardBody className="space-y-2">
                {[...liveByExam].map(([examId, v]) => (
                  <Link key={examId} href={`/teacher/exams/${examId}/live`} className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-surface-2">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> {v.title}
                    </span>
                    <Badge tone="info">{v.count} active</Badge>
                  </Link>
                ))}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader
              title="Recent submissions"
              action={<Link href="/teacher/results" className="text-sm font-medium text-primary hover:underline">All results</Link>}
            />
            <CardBody className="p-0">
              {recent.length === 0 ? (
                <div className="p-5"><EmptyState title="No submissions yet" /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {recent.map((a) => (
                    <li key={a.id}>
                      <Link href={`/teacher/results/${a.id}`} className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-surface-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{a.profiles ? shortName(a.profiles) : "Student"} · {a.exams?.title}</p>
                          <p className="text-xs text-muted">{relativeTime(a.submitted_at)}{a.violation_count ? ` · ${a.violation_count} violation(s)` : ""}</p>
                        </div>
                        {a.status === "GRADED" ? <span className="font-semibold tabular-nums">{formatPercent(a.percentage)}</span> : <AttemptStatusBadge status={a.status} />}
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
            <CardHeader title="Marking" />
            <CardBody className="space-y-3 text-sm">
              <p>{review.length} attempt(s) need teacher review.</p>
              <ButtonLink href="/teacher/results?status=REVIEW_REQUIRED" variant="secondary" size="sm">Open moderation queue</ButtonLink>
              {pendingGrading.length > 0 && (
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-muted">{pendingGrading.length} attempt(s) are waiting for automatic marking.</p>
                  <ConfirmButton action={retryGrading} fields={{}} label="Retry marking now" />
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Upcoming deadlines" action={<Link href="/teacher/assignments" className="text-sm font-medium text-primary hover:underline">All</Link>} />
            <CardBody className="space-y-2">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted">No upcoming deadlines.</p>
              ) : (
                upcoming.map((a) => (
                  <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="flex items-start gap-2 rounded-lg p-2 text-sm hover:bg-surface-2">
                    <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{a.title}</span>
                      <span className="text-xs text-muted">{a.deadline ? formatDate(a.deadline) : "No deadline"}</span>
                    </span>
                  </Link>
                ))
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="My classes" action={<Link href="/teacher/classes" className="text-sm font-medium text-primary hover:underline">Manage</Link>} />
            <CardBody className="space-y-1">
              {classes.length === 0 ? (
                <p className="text-sm text-muted">No classes yet.</p>
              ) : (
                classes.map((c) => (
                  <Link key={c.id} href={`/teacher/classes/${c.id}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted">{c.member_count} students</span>
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
