import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, Clock, FileText, Maximize, Save, ShieldAlert } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getExamStartInfo, INTEGRITY_LABEL } from "@/lib/exams";
import { formatDate } from "@/lib/format";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { StartExamButton } from "@/components/exam/start-exam-button";
import { TeacherResources, type TeacherResource } from "@/components/teacher/teacher-resources";

export const metadata: Metadata = { title: "Start exam" };

export default async function ExamStartPage({ params, searchParams }: PageProps<"/exams/[examId]">) {
  const profile = await requireProfile();
  const { examId } = await params;
  const sp = await searchParams;
  const assignmentId = typeof sp.assignment === "string" ? sp.assignment : null;
  const supabase = await createClient();
  const info = await getExamStartInfo(supabase, examId, profile.id, assignmentId);
  if (!info) notFound();
  const { exam, version } = info;

  const isStaff = profile.role === "teacher" || profile.role === "admin";
  const { data: res } = isStaff ? await supabase.from("exams").select("teacher_resources").eq("id", examId).maybeSingle() : { data: null };

  const kindLabel = exam.kind === "mock" ? "Mock Exam" : exam.kind === "topic" ? "Topic Exam" : "Exam";
  const breadcrumbs =
    exam.kind === "mock" && exam.year && exam.paper_components
      ? [
          { label: "Mock Exams", href: "/mock-exams" },
          { label: String(exam.year), href: `/mock-exams/${exam.year}` },
          { label: exam.paper_components.title, href: `/mock-exams/${exam.year}/${exam.paper_components.number}` },
        ]
      : exam.topics
        ? [{ label: "Learn & Practice", href: "/learn" }, { label: exam.topics.title, href: `/learn/${exam.topics.slug}` }]
        : [];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader breadcrumbs={breadcrumbs} title={exam.title} description={info.assignment ? `Assignment: ${info.assignment.title}` : kindLabel} />
      {isStaff && (
        <div className="mb-6">
          <TeacherResources resources={res?.teacher_resources as TeacherResource[] | undefined} />
        </div>
      )}
      <Card>
        <CardBody className="space-y-6 p-6 sm:p-8">
          <dl className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-surface-2 p-3">
              <dt className="text-xs text-muted">Questions</dt>
              <dd className="text-2xl font-semibold tabular-nums">{info.questionCount ?? "—"}</dd>
              {version && info.questionCount !== null && version.question_count > info.questionCount && (
                <dd className="text-xs text-muted">{version.question_count} parts</dd>
              )}
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <dt className="text-xs text-muted">Total marks</dt>
              <dd className="text-2xl font-semibold tabular-nums">{version?.total_marks ?? "—"}</dd>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <dt className="text-xs text-muted">Time</dt>
              <dd className="text-2xl font-semibold tabular-nums">{info.durationMinutes} min</dd>
            </div>
          </dl>

          {exam.instructions && (
            <div>
              <h2 className="mb-1 text-sm font-semibold">Instructions</h2>
              <Markdown className="text-sm">{exam.instructions}</Markdown>
            </div>
          )}

          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-3"><Clock className="h-4 w-4 shrink-0 text-muted" /> The timer starts when you press Start and continues even if you close the page. The exam submits automatically when time runs out.</li>
            <li className="flex gap-3"><Save className="h-4 w-4 shrink-0 text-muted" /> Your answers are saved automatically.</li>
            <li className="flex gap-3"><ShieldAlert className="h-4 w-4 shrink-0 text-muted" /> Leaving the exam tab will be recorded. Integrity policy: {INTEGRITY_LABEL[info.integrityMode]}{info.integrityMode === "auto_submit" ? ` (${info.maxViolations} violations)` : ""}.</li>
            {exam.require_fullscreen && <li className="flex gap-3"><Maximize className="h-4 w-4 shrink-0 text-muted" /> The exam opens in fullscreen. Exiting fullscreen is recorded.</li>}
            <li className="flex gap-3"><FileText className="h-4 w-4 shrink-0 text-muted" /> No hints, feedback or mark schemes are available during the exam.</li>
          </ul>

          {(info.attemptLimit != null || info.assignment?.deadline) && (
            <p className="text-sm text-muted">
              {info.attemptLimit != null && <>Attempts used: {info.attemptsUsed} / {info.attemptLimit}. </>}
              {info.assignment?.deadline && <>Deadline: {formatDate(info.assignment.deadline)}.</>}
            </p>
          )}

          {info.openAttemptId ? (
            <StartExamButton examId={exam.id} assignmentId={assignmentId} requireFullscreen={exam.require_fullscreen} label="Resume exam" />
          ) : info.availableNow ? (
            <StartExamButton examId={exam.id} assignmentId={assignmentId} requireFullscreen={exam.require_fullscreen} />
          ) : (
            <Alert tone="warning" title="Not available">{info.unavailableReason}</Alert>
          )}
          {info.lastAttemptId && (
            <ButtonLink href={`/results/${info.lastAttemptId}`} variant="ghost">
              View last result
            </ButtonLink>
          )}
          <p className="flex items-start gap-2 text-xs text-muted">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Exam Mode is designed for a laptop or desktop computer.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
