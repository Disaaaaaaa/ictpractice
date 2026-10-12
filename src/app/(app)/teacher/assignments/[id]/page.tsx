import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts } from "@/lib/teacher-data";
import { INTEGRITY_LABEL } from "@/lib/exams";
import { formatDate, formatPercent, nowMs } from "@/lib/format";
import {
  OVERALL_STATE, PART_LABEL, PART_STATE, overallPercent, overallState, partDeadline, topicParts,
  type OverallState, type TopicProgressRow,
} from "@/lib/topic-assignments";
import type { Assignment, Profile } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Table, Td, Th } from "@/components/ui/table";
import Link from "next/link";
import { AssignmentDeadlinesForm } from "@/components/teacher/assignment-deadlines-form";
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

  // Topic assignment: theory + practice + exam progress of every student.
  const isTopic = a.assignment_type === "topic";
  const { data: progressRows } = isTopic ? await supabase.rpc("topic_assignment_progress", { p_assignment_id: a.id }) : { data: null };
  const progressBy = new Map(((progressRows ?? []) as TopicProgressRow[]).map((r) => [r.student_id, r]));
  const now = nowMs();
  const ORDER: OverallState[] = ["overdue", "not_started", "in_progress", "completed_late", "completed"];
  const board = isTopic
    ? students
        .map((st) => {
          const row = progressBy.get(st.id);
          const parts = topicParts(a, row, now);
          return { st, row, parts, overall: overallState(parts), percent: overallPercent(parts) };
        })
        .sort((x, y) => ORDER.indexOf(x.overall) - ORDER.indexOf(y.overall) || x.st.name.localeCompare(y.st.name))
    : [];
  const tally = (s: OverallState[]) => board.filter((b) => s.includes(b.overall)).length;
  const sample = topicParts(a, progressRows?.[0] as TopicProgressRow | undefined, now);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Assignments", href: "/teacher/assignments" }, { label: a.title }]}
        title={a.title}
        description={[
          a.exams?.title ?? a.topics?.title,
          a.assignment_targets.map((t) => t.classes?.name).filter(Boolean).join(", "),
          a.deadline ? `Due ${formatDate(a.deadline)}` : "No deadline",
          a.exam_id && !isTopic ? INTEGRITY_LABEL[a.integrity_mode] : null,
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
      {isTopic && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Completed" value={tally(["completed", "completed_late"])} sub={`of ${board.length} students${tally(["completed_late"]) ? ` · ${tally(["completed_late"])} late` : ""}`} />
            <Stat label="In progress" value={tally(["in_progress"])} />
            <Stat label="Not started" value={tally(["not_started"])} />
            <Stat label="Overdue" value={tally(["overdue"])} sub="Missed a deadline" />
          </div>

          <Card className="mt-6">
            <CardHeader
              title="What the students have to do"
              description={a.instructions ?? undefined}
              action={a.topics && <Link href={`/learn/${a.topics.slug}`} className="text-sm font-medium text-primary hover:underline">Open the topic</Link>}
            />
            <CardBody>
              <ol className="grid gap-3 sm:grid-cols-3">
                {sample.map((p, i) => (
                  <li key={p.key} className="rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Step {i + 1}</p>
                    <p className="font-semibold">{PART_LABEL[p.key]}</p>
                    <p className="mt-1 text-sm text-muted">
                      {p.state === "none"
                        ? `${p.detail} for this topic — not required.`
                        : p.key === "theory"
                          ? `Read all ${progressRows?.[0]?.theory_total ?? ""} sections of the theory pack.`
                          : p.key === "practice"
                            ? `Answer and check ${progressRows?.[0]?.practice_needed ?? ""} of ${progressRows?.[0]?.practice_total ?? ""} practice questions (${a.practice_target}%).`
                            : `Sit “${a.exams?.title}” in Exam Mode.`}
                    </p>
                    {p.state !== "none" && <p className="mt-2 text-sm font-medium">Due {formatDate(partDeadline(a, p.key))}</p>}
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Progress by student" description="Theory = sections opened. Practice = questions answered and checked, out of the number required. Students who need attention are listed first." />
            <CardBody className="p-0">
              <Table>
                <thead><tr><Th>Student</Th><Th>Status</Th><Th>Theory</Th><Th>Practice</Th><Th>Exam Mode</Th><Th className="w-40">Overall</Th></tr></thead>
                <tbody>
                  {board.map(({ st, row, parts, overall, percent }) => (
                    <tr key={st.id}>
                      <Td className="whitespace-nowrap"><Link href={`/teacher/students/${st.id}`} className="font-medium hover:underline">{st.name}</Link></Td>
                      <Td><Badge tone={OVERALL_STATE[overall].tone}>{OVERALL_STATE[overall].label}</Badge></Td>
                      {parts.map((p) => (
                        <Td key={p.key}>
                          {p.state === "none" ? (
                            <span className="text-muted">—</span>
                          ) : (
                            <>
                              <Badge tone={PART_STATE[p.state].tone}>{PART_STATE[p.state].label}</Badge>
                              <p className="mt-1 text-xs text-muted">
                                {p.key === "exam" && row?.exam_attempt_id && row.exam_status !== "IN_PROGRESS" ? (
                                  <Link href={`/teacher/results/${row.exam_attempt_id}`} className="hover:underline">
                                    {row.exam_status === "GRADED" ? formatPercent(row.exam_percentage) : "Being marked"}
                                  </Link>
                                ) : (
                                  p.detail
                                )}
                              </p>
                            </>
                          )}
                        </Td>
                      ))}
                      <Td>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={percent} tone={percent >= 100 ? "success" : "primary"} label={`${st.name}: overall progress`} />
                          <span className="w-9 text-right text-xs tabular-nums">{Math.round(percent)}%</span>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  {board.length === 0 && <tr><Td colSpan={6} className="py-6 text-center text-muted">No students are assigned.</Td></tr>}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Deadlines" description="Move a deadline to give the class more time. Work already finished keeps its original completion time." />
            <CardBody>
              <AssignmentDeadlinesForm assignmentId={a.id} deadline={a.deadline} theoryDeadline={a.theory_deadline} practiceDeadline={a.practice_deadline} hasExam={Boolean(a.exam_id)} />
            </CardBody>
          </Card>
        </>
      )}
      {a.exam_id ? (
        <>
          {!isTopic && <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Not Started" value={count((s) => !statusOf(s))} />
            <Stat label="In Progress" value={count((s) => statusOf(s) === "IN_PROGRESS")} />
            <Stat label="Submitted" value={count((s) => statusOf(s) === "SUBMITTED")} sub="being marked" />
            <Stat label="Graded" value={count((s) => statusOf(s) === "GRADED")} />
            <Stat label="Teacher Review Required" value={count((s) => statusOf(s) === "REVIEW_REQUIRED")} />
          </div>}
          <Card className="mt-6">
            <CardHeader title="Live exam monitoring" description={isTopic ? "Students who started the topic exam from this assignment. Updates in real time." : "Updates in real time while students sit the exam."} />
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
      ) : isTopic ? null : (
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
