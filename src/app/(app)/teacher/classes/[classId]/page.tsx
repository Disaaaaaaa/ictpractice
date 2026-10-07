import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, KeyRound, UserMinus } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts, getClassRoster, getMasteryByStudent } from "@/lib/teacher-data";
import { getProgressContext, overallMastery, topicProgress } from "@/lib/progress";
import { formatDate, formatPercent, relativeTime } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Field, Input } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { ActionForm, ConfirmButton } from "@/components/action-form";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { addStudentToClass, createStudentInClass, importStudents, removeStudentFromClass, resetStudentPassword } from "../../actions";

export const metadata: Metadata = { title: "Class" };

export default async function ClassPage({ params }: PageProps<"/teacher/classes/[classId]">) {
  await requireProfile(["teacher", "admin"]);
  const { classId } = await params;
  const supabase = await createClient();
  const roster = await getClassRoster(supabase, classId);
  if (!roster) notFound();
  const { cls, students } = roster;
  const ids = students.map((s) => s.id);
  const [ctx, masteryBy, attempts, { data: targets }] = await Promise.all([
    getProgressContext(),
    getMasteryByStudent(supabase, ids),
    getAttempts(supabase, { studentIds: ids, limit: 1000 }),
    supabase.from("assignment_targets").select("assignments(id, title, deadline, assignment_type, archived_at)").eq("class_id", classId),
  ]);

  const graded = attempts.filter((a) => a.status === "GRADED" && a.percentage != null);
  const avgBy = new Map<string, number>();
  for (const s of students) {
    const mine = graded.filter((a) => a.student_id === s.id);
    if (mine.length) avgBy.set(s.id, mine.reduce((t, a) => t + Number(a.percentage), 0) / mine.length);
  }
  // Weak topics: class average of topic mastery among topics someone has attempted.
  const topicAgg = new Map<string, { title: string; slug: string; sum: number; n: number }>();
  for (const s of students) {
    for (const t of topicProgress(ctx, masteryBy.get(s.id) ?? new Map())) {
      if (!t.attempted) continue;
      const a = topicAgg.get(t.id) ?? { title: t.title, slug: t.slug, sum: 0, n: 0 };
      a.sum += t.mastery ?? 0;
      a.n++;
      topicAgg.set(t.id, a);
    }
  }
  const weak = [...topicAgg.values()].map((t) => ({ ...t, avg: t.sum / t.n })).sort((a, b) => a.avg - b.avg).slice(0, 8);
  const assignments = ((targets ?? []) as unknown as { assignments: { id: string; title: string; deadline: string | null; archived_at: string | null } | null }[])
    .map((t) => t.assignments)
    .filter((a): a is NonNullable<typeof a> => !!a && !a.archived_at);
  const sessions = attempts.slice(0, 15);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Classes", href: "/teacher/classes" }, { label: cls.name }]}
        title={`Class ${cls.name}`}
        description={`Grade ${cls.grade} · ${cls.academic_year} · ${students.length} students`}
        actions={
          <>
            <ButtonLink href={`/teacher/analytics?class=${cls.id}`} variant="secondary">Analytics &amp; LO heatmap</ButtonLink>
            <ButtonLink href={`/api/export?kind=class&classId=${cls.id}&format=xlsx`} variant="secondary" prefetch={false}>
              <Download className="h-4 w-4" /> Export
            </ButtonLink>
            <ButtonLink href={`/teacher/assignments/new?class=${cls.id}`}>Assign work</ButtonLink>
          </>
        }
      />

      <Card>
        <CardHeader title="Students" />
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Name</Th><Th>Username</Th><Th>Status</Th><Th className="w-40">Progress</Th><Th>Average</Th><Th>Last activity</Th><Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const overall = overallMastery(ctx, masteryBy.get(s.id) ?? new Map(), s.grade ?? 12);
                return (
                  <tr key={s.id}>
                    <Td><Link href={`/teacher/students/${s.id}`} className="font-medium hover:underline">{displayName(s)}</Link></Td>
                    <Td className="font-mono text-xs">{s.username}</Td>
                    <Td>
                      {!s.is_active ? <Badge tone="danger">Disabled</Badge> : s.force_password_change ? <Badge tone="warning">Awaiting first login</Badge> : <Badge tone="success">Active</Badge>}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={overall} label="Overall mastery" />
                        <span className="w-9 text-right text-xs tabular-nums">{formatPercent(overall)}</span>
                      </div>
                    </Td>
                    <Td className="tabular-nums">{formatPercent(avgBy.get(s.id))}</Td>
                    <Td className="text-muted">{relativeTime(s.last_activity_at)}</Td>
                    <Td>
                      <div className="flex justify-end gap-1">
                        <ConfirmButton action={resetStudentPassword} fields={{ student_id: s.id }} label={<KeyRound className="h-4 w-4" aria-label="Reset password" />} variant="ghost" confirm={`Reset ${s.username}'s password to the temporary password?`} />
                        <ConfirmButton action={removeStudentFromClass} fields={{ class_id: cls.id, student_id: s.id }} label={<UserMinus className="h-4 w-4" aria-label="Remove from class" />} variant="ghost" confirm={`Remove ${s.username} from ${cls.name}?`} />
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {students.length === 0 && <tr><Td colSpan={7} className="py-8 text-center text-muted">No students yet — add them on the right or import a CSV.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Weak topics" description="Lowest class average mastery." />
          <CardBody className="space-y-3">
            {weak.length === 0 ? <p className="text-sm text-muted">No activity yet.</p> : weak.map((t) => (
              <div key={t.slug} className="space-y-1">
                <div className="flex justify-between gap-2 text-sm"><span className="truncate">{t.title}</span><span className="tabular-nums text-muted">{formatPercent(t.avg)} · {t.n}</span></div>
                <ProgressBar value={t.avg} label={t.title} />
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Assignments" action={<Link href="/teacher/assignments" className="text-sm font-medium text-primary hover:underline">All</Link>} />
          <CardBody className="space-y-2">
            {assignments.length === 0 ? <p className="text-sm text-muted">Nothing assigned to this class.</p> : assignments.map((a) => (
              <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="block rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted">{a.deadline ? `Due ${formatDate(a.deadline)}` : "No deadline"}</p>
              </Link>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Add students" />
          <CardBody className="space-y-6">
            <ActionForm action={addStudentToClass} submitLabel="Add existing student">
              <input type="hidden" name="class_id" value={cls.id} />
              <Field label="Username" htmlFor="add-username"><Input id="add-username" name="username" placeholder="dias.a" required /></Field>
            </ActionForm>
            <details>
              <summary className="cursor-pointer text-sm font-medium">Create a new student account</summary>
              <div className="mt-3">
                <ActionForm action={createStudentInClass} submitLabel="Create account">
                  <input type="hidden" name="class_id" value={cls.id} />
                  <Field label="First name" htmlFor="fn"><Input id="fn" name="first_name" required /></Field>
                  <Field label="Last name" htmlFor="ln"><Input id="ln" name="last_name" required /></Field>
                  <Field label="Username" htmlFor="un" hint="The temporary password must be changed at first login."><Input id="un" name="username" required /></Field>
                </ActionForm>
              </div>
            </details>
            <details>
              <summary className="cursor-pointer text-sm font-medium">Import CSV into this class</summary>
              <div className="mt-3">
                <ActionForm action={importStudents} submitLabel="Import" encType="multipart/form-data">
                  <input type="hidden" name="class_id" value={cls.id} />
                  <input type="file" name="file" accept=".csv,text/csv" required className="block w-full text-sm" />
                </ActionForm>
              </div>
            </details>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Exam sessions" description="Most recent attempts by students in this class." />
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Student</Th><Th>Exam</Th><Th>Started</Th><Th>Status</Th><Th>Violations</Th><Th className="text-right">Score</Th></tr></thead>
            <tbody>
              {sessions.map((a) => (
                <tr key={a.id}>
                  <Td>{a.profiles ? displayName(a.profiles) : "—"}</Td>
                  <Td><Link href={`/teacher/results/${a.id}`} className="hover:underline">{a.exams?.title}</Link></Td>
                  <Td className="text-muted">{formatDate(a.started_at)}</Td>
                  <Td><AttemptStatusBadge status={a.status} /></Td>
                  <Td>{a.violation_count ? <Badge tone="danger">{a.violation_count}</Badge> : "0"}</Td>
                  <Td className="text-right tabular-nums">{formatPercent(a.percentage)}</Td>
                </tr>
              ))}
              {sessions.length === 0 && <tr><Td colSpan={6} className="py-6 text-center text-muted">No exam attempts yet.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
