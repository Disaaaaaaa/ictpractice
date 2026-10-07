import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KeyRound } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryMap } from "@/lib/curriculum";
import { getProgressContext, loAverage, overallMastery, paperReadiness, topicProgress } from "@/lib/progress";
import { getAttempts } from "@/lib/teacher-data";
import { getStudentClasses } from "@/lib/student-data";
import { masteryStatus, STATUS_TONE } from "@/lib/mastery";
import { formatDate, formatDuration, formatPercent, relativeTime } from "@/lib/format";
import type { IntegrityEvent, Profile } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { ProgressBar, ReadinessRow } from "@/components/ui/progress";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/action-form";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { INTEGRITY_EVENT_LABEL } from "@/components/integrity-labels";
import { LoCode } from "@/components/lo-code";
import { resetStudentPassword } from "../../actions";

export const metadata: Metadata = { title: "Student" };

export default async function StudentProfilePage({ params }: PageProps<"/teacher/students/[studentId]">) {
  await requireProfile(["teacher", "admin"]);
  const { studentId } = await params;
  const supabase = await createClient();
  const { data: student } = await supabase.from("profiles").select("*").eq("id", studentId).eq("role", "student").maybeSingle();
  if (!student) notFound();
  const s = student as Profile;
  const [ctx, mastery, attempts, classes, { data: events }] = await Promise.all([
    getProgressContext(),
    getMasteryMap(supabase, s.id),
    getAttempts(supabase, { studentIds: [s.id], limit: 200 }),
    getStudentClasses(supabase, s.id),
    supabase.from("integrity_events").select("*, exams(title)").eq("student_id", s.id).order("started_at", { ascending: false }).limit(100),
  ]);
  const classIds = classes.map((c) => c.id);
  const { data: targets } = await supabase
    .from("assignment_targets")
    .select("assignments(id, title, deadline, exam_id)")
    .or(`student_id.eq.${s.id}${classIds.length ? `,class_id.in.(${classIds.join(",")})` : ""}`);
  const grade = s.grade ?? 12;
  const topics = topicProgress(ctx, mastery).filter((t) => t.grade <= grade);
  const graded = attempts.filter((a) => a.status === "GRADED");
  const avg = graded.length ? graded.reduce((t, a) => t + Number(a.percentage ?? 0), 0) / graded.length : null;
  const terms = [11, 12].filter((g) => g <= grade).flatMap((g) =>
    [1, 2, 3, 4].map((n) => {
      const ts = topics.filter((t) => t.grade === g && t.termNumber === n);
      return { label: `G${g} Term ${["I", "II", "III", "IV"][n - 1]}`, value: loAverage([...new Set(ts.flatMap((t) => t.loIds))], mastery), n: ts.length };
    }),
  ).filter((t) => t.n > 0);
  const examOnlyTopics = topics.filter((t) => t.examOnly);
  if (examOnlyTopics.length) {
    terms.push({ label: "Exam only (Paper)", value: loAverage([...new Set(examOnlyTopics.flatMap((t) => t.loIds))], mastery), n: examOnlyTopics.length });
  }
  const assignmentIds = new Set(attempts.map((a) => a.assignment_id).filter(Boolean));
  const assignments = ((targets ?? []) as unknown as { assignments: { id: string; title: string; deadline: string | null; exam_id: string | null } | null }[])
    .map((t) => t.assignments)
    .filter((a, i, arr): a is NonNullable<typeof a> => !!a && arr.findIndex((x) => x?.id === a.id) === i);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Students", href: "/teacher/students" }, { label: displayName(s) }]}
        title={displayName(s)}
        description={`${s.username} · Grade ${s.grade ?? "—"}${classes.length ? ` · ${classes.map((c) => c.name).join(", ")}` : ""} · last active ${relativeTime(s.last_activity_at)}`}
        actions={<ConfirmButton action={resetStudentPassword} fields={{ student_id: s.id }} label={<><KeyRound className="h-4 w-4" /> Reset password</>} confirm="Reset this student's password to the temporary password? They will have to change it at next login." />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Overall progress" value={formatPercent(overallMastery(ctx, mastery, grade))} />
        <Stat label="Exam average" value={formatPercent(avg)} sub={`${graded.length} graded attempts`} />
        <Stat label="Topics secure+" value={`${topics.filter((t) => t.status === "Secure" || t.status === "Mastered").length} / ${topics.length}`} />
        <Stat label="Integrity events" value={(events ?? []).filter((e) => e.counted).length} sub="Counted violations" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Paper progress" />
          <CardBody className="space-y-4">
            {paperReadiness(ctx, mastery, grade).map((r) => <ReadinessRow key={r.paper} label={`Paper ${r.paper}`} value={r.value} />)}
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Term progress" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {terms.map((t) => <ReadinessRow key={t.label} label={t.label} value={t.value} sub={`${t.n} topics`} />)}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Topic progress" />
          <CardBody className="max-h-[36rem] overflow-y-auto p-0">
            <Table>
              <thead><tr><Th>Topic</Th><Th className="w-36">Mastery</Th><Th>Status</Th></tr></thead>
              <tbody>
                {topics.map((t) => (
                  <tr key={t.id}>
                    <Td><span className="font-medium">{t.title}</span><p className="text-xs text-muted">{t.examOnly ? "Exam only" : `G${t.grade} · ${t.unitCode}`}</p></Td>
                    <Td><ProgressBar value={t.mastery} label={t.title} /></Td>
                    <Td><Badge tone={STATUS_TONE[t.status]}>{t.attempted ? formatPercent(t.mastery) : t.status}</Badge></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Learning objective progress" />
          <CardBody className="max-h-[36rem] overflow-y-auto p-0">
            <Table>
              <thead><tr><Th>LO</Th><Th>Description</Th><Th className="text-right">Mastery</Th></tr></thead>
              <tbody>
                {ctx.los.filter((l) => l.grade <= grade).map((l) => {
                  const m = mastery.get(l.id);
                  return (
                    <tr key={l.id}>
                      <Td className="text-xs font-semibold"><LoCode code={l.code} paper={l.source === "paper"} /></Td>
                      <Td className="text-xs">{l.description}</Td>
                      <Td className="text-right"><Badge tone={STATUS_TONE[masteryStatus(m, m != null)]}>{m == null ? "—" : formatPercent(m)}</Badge></Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Exam history" />
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Exam</Th><Th>Started</Th><Th>Status</Th><Th>Violations</Th><Th className="text-right">Score</Th></tr></thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <Td><Link href={`/teacher/results/${a.id}`} className="font-medium hover:underline">{a.exams?.title}</Link></Td>
                  <Td className="text-muted">{formatDate(a.started_at)}</Td>
                  <Td><AttemptStatusBadge status={a.status} /></Td>
                  <Td>{a.violation_count ? <Badge tone="danger">{a.violation_count}</Badge> : "0"}</Td>
                  <Td className="text-right tabular-nums">{formatPercent(a.percentage)}</Td>
                </tr>
              ))}
              {attempts.length === 0 && <tr><Td colSpan={5} className="py-6 text-center text-muted">No attempts yet.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Integrity history" description="Signals only — leaving the window is not proof of cheating." />
          <CardBody className="max-h-96 overflow-y-auto p-0">
            <Table>
              <thead><tr><Th>When</Th><Th>Event</Th><Th>Exam</Th><Th>Duration</Th></tr></thead>
              <tbody>
                {((events ?? []) as (IntegrityEvent & { exams: { title: string } | null })[]).map((e) => (
                  <tr key={e.id}>
                    <Td className="whitespace-nowrap text-xs text-muted">{formatDate(e.started_at)}</Td>
                    <Td>{e.counted ? <Badge tone="danger">{INTEGRITY_EVENT_LABEL[e.event_type]}</Badge> : <Badge>{INTEGRITY_EVENT_LABEL[e.event_type]}</Badge>}</Td>
                    <Td className="text-xs">{e.exams?.title}</Td>
                    <Td className="text-xs tabular-nums">{formatDuration(e.duration_seconds)}</Td>
                  </tr>
                ))}
                {(events ?? []).length === 0 && <tr><Td colSpan={4} className="py-6 text-center text-muted">No events recorded.</Td></tr>}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Assignments" />
          <CardBody className="space-y-2">
            {assignments.length === 0 ? <p className="text-sm text-muted">No assignments.</p> : assignments.map((a) => (
              <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2">
                <span><span className="font-medium">{a.title}</span><span className="block text-xs text-muted">{a.deadline ? `Due ${formatDate(a.deadline)}` : "No deadline"}</span></span>
                {assignmentIds.has(a.id) ? <Badge tone="success">Started</Badge> : <Badge>Not started</Badge>}
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
