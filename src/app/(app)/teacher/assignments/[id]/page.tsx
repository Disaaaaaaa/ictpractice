import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts } from "@/lib/teacher-data";
import { INTEGRITY_LABEL } from "@/lib/exams";
import { formatDate } from "@/lib/format";
import type { Assignment, Profile } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { ButtonLink } from "@/components/ui/button";
import { ConfirmButton } from "@/components/action-form";
import { LiveMonitor, type MonitorAttempt } from "@/components/teacher/live-monitor";
import { archiveAssignment } from "../../actions";

export const metadata: Metadata = { title: "Assignment" };

export default async function AssignmentPage({ params }: PageProps<"/teacher/assignments/[id]">) {
  await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("*, exams(id, title, current_version_id, exam_versions!exam_versions_exam_id_fkey(id, question_count, total_marks)), topics(title, slug), assignment_targets(class_id, student_id, classes(name))")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const a = data as Assignment & {
    exams: { id: string; title: string; current_version_id: string | null; exam_versions: { id: string; question_count: number }[] } | null;
    topics: { title: string; slug: string } | null;
    assignment_targets: { class_id: string | null; student_id: string | null; classes: { name: string } | null }[];
  };

  // Resolve targeted students.
  const classIds = a.assignment_targets.map((t) => t.class_id).filter((x): x is string => !!x);
  const directIds = a.assignment_targets.map((t) => t.student_id).filter((x): x is string => !!x);
  const { data: members } = classIds.length
    ? await supabase.from("class_members").select("student_id").in("class_id", classIds).eq("status", "active")
    : { data: [] };
  const ids = [...new Set([...(members ?? []).map((m) => m.student_id as string), ...directIds])];
  const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, first_name, last_name, username").in("id", ids) : { data: [] };
  const students = ((profiles ?? []) as Pick<Profile, "id" | "first_name" | "last_name" | "username">[]).map((p) => ({ id: p.id, name: displayName(p) }));
  const attempts = a.exam_id ? await getAttempts(supabase, { assignmentId: a.id, limit: 1000 }) : [];

  const latest = new Map<string, (typeof attempts)[number]>();
  for (const at of attempts) if (!latest.has(at.student_id)) latest.set(at.student_id, at);
  const count = (pred: (s: string) => boolean) => students.filter((s) => pred(s.id)).length;
  const statusOf = (sid: string) => latest.get(sid)?.status;
  const qCount = a.exams?.exam_versions.find((v) => v.id === a.exams?.current_version_id)?.question_count ?? 0;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Assignments", href: "/teacher/assignments" }, { label: a.title }]}
        title={a.title}
        description={[
          a.exams?.title ?? a.topics?.title,
          a.assignment_targets.map((t) => t.classes?.name).filter(Boolean).join(", "),
          a.deadline ? `Due ${formatDate(a.deadline)}` : "No deadline",
          a.exam_id ? INTEGRITY_LABEL[a.integrity_mode] : null,
        ].filter(Boolean).join(" · ")}
        actions={
          <>
            {a.exam_id && (
              <ButtonLink href={`/api/export?kind=exam&examId=${a.exam_id}&assignmentId=${a.id}&format=xlsx`} variant="secondary" prefetch={false}>
                <Download className="h-4 w-4" /> Export results
              </ButtonLink>
            )}
            <ConfirmButton action={archiveAssignment} fields={{ assignment_id: a.id }} label="Archive" confirm="Archive this assignment? Results are kept." size="md" />
          </>
        }
      />
      {a.exam_id ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Not Started" value={count((s) => !statusOf(s))} />
            <Stat label="In Progress" value={count((s) => statusOf(s) === "IN_PROGRESS")} />
            <Stat label="Submitted" value={count((s) => statusOf(s) === "SUBMITTED")} sub="being marked" />
            <Stat label="Graded" value={count((s) => statusOf(s) === "GRADED")} />
            <Stat label="Teacher Review Required" value={count((s) => statusOf(s) === "REVIEW_REQUIRED")} />
          </div>
          <Card className="mt-6">
            <CardHeader title="Live exam monitoring" description="Updates in real time while students sit the exam." />
            <CardBody className="p-0 pb-2">
              <LiveMonitor
                examId={a.exam_id}
                assignmentId={a.id}
                students={students}
                questionCount={qCount}
                initial={attempts.map((x) => ({
                  id: x.id, student_id: x.student_id, status: x.status, started_at: x.started_at, deadline_at: x.deadline_at,
                  submitted_at: x.submitted_at, current_question: x.current_question, answered_count: x.answered_count,
                  violation_count: x.violation_count, last_heartbeat_at: x.last_heartbeat_at, is_online: x.is_online,
                  percentage: x.percentage, assignment_id: x.assignment_id,
                }) satisfies MonitorAttempt)}
              />
            </CardBody>
          </Card>
        </>
      ) : (
        <Card>
          <CardBody>
            <p className="text-sm">
              Practice assignment on <strong>{a.topics?.title}</strong> for {students.length} students. Track practice in Analytics.
            </p>
          </CardBody>
        </Card>
      )}
    </>
  );
}
