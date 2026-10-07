import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts, getClassRoster, getTeacherClasses, getVisibleStudents } from "@/lib/teacher-data";
import { formatDate, formatPercent } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { AttemptStatusBadge } from "@/components/attempt-status";

export const metadata: Metadata = { title: "Results" };

export default async function ResultsPage({ searchParams }: PageProps<"/teacher/results">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const f = { exam: get("exam"), cls: get("class"), status: get("status") };
  const supabase = await createClient();
  const classes = await getTeacherClasses(supabase, profile);
  const students = f.cls ? ((await getClassRoster(supabase, f.cls))?.students ?? []) : await getVisibleStudents(supabase);
  const attempts = await getAttempts(supabase, {
    studentIds: students.map((s) => s.id),
    examId: f.exam || undefined,
    status: f.status ? [f.status] : ["SUBMITTED", "GRADED", "REVIEW_REQUIRED"],
    limit: 1000,
  });
  const { data: exams } = await supabase.from("exams").select("id, title").not("current_version_id", "is", null).order("title");
  const { data: queue } = await supabase
    .from("grading_results")
    .select("id, attempt_id, question_id, awarded_mark, max_mark, confidence, error")
    .eq("needs_review", true)
    .in("attempt_id", attempts.map((a) => a.id).concat("00000000-0000-0000-0000-000000000000"))
    .limit(500);
  const queueByAttempt = new Map<string, number>();
  for (const r of queue ?? []) queueByAttempt.set(r.attempt_id, (queueByAttempt.get(r.attempt_id) ?? 0) + 1);
  const exportHref = `/api/export?kind=exam&format=xlsx${f.exam ? `&examId=${f.exam}` : ""}${f.cls ? `&classId=${f.cls}` : ""}`;

  return (
    <>
      <PageHeader
        title="Results"
        description="Submitted attempts by your students. Open an attempt to moderate AI marks."
        actions={<ButtonLink href={exportHref} variant="secondary" prefetch={false}><Download className="h-4 w-4" /> Export</ButtonLink>}
      />
      {(queue ?? []).length > 0 && (
        <Card className="mb-6 border-warning/40">
          <CardHeader title={`Moderation queue — ${(queue ?? []).length} answer(s)`} description="Low AI confidence, manual questions or marking errors." />
          <CardBody className="flex flex-wrap gap-2">
            {[...queueByAttempt].slice(0, 30).map(([attemptId, n]) => {
              const a = attempts.find((x) => x.id === attemptId);
              return (
                <Link key={attemptId} href={`/teacher/results/${attemptId}`} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2">
                  <span className="font-medium">{a?.profiles ? displayName(a.profiles) : "Student"}</span> · {a?.exams?.title} <Badge tone="warning" className="ml-1">{n}</Badge>
                </Link>
              );
            })}
          </CardBody>
        </Card>
      )}
      <Card>
        <CardBody>
          <form className="grid gap-2 sm:grid-cols-4">
            <Select name="exam" defaultValue={f.exam} aria-label="Exam">
              <option value="">All exams</option>
              {(exams ?? []).map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </Select>
            <Select name="class" defaultValue={f.cls} aria-label="Class">
              <option value="">All my classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select name="status" defaultValue={f.status} aria-label="Status">
              <option value="">All submitted</option>
              <option value="GRADED">Graded</option>
              <option value="REVIEW_REQUIRED">Teacher review required</option>
              <option value="SUBMITTED">Being marked</option>
            </Select>
            <Button type="submit">Filter</Button>
          </form>
        </CardBody>
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Student</Th><Th>Exam</Th><Th>Submitted</Th><Th>Status</Th><Th>Violations</Th><Th className="text-right">Score</Th></tr></thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <Td><Link href={`/teacher/results/${a.id}`} className="font-medium hover:underline">{a.profiles ? displayName(a.profiles) : "—"}</Link></Td>
                  <Td>{a.exams?.title}</Td>
                  <Td className="text-muted">{formatDate(a.submitted_at)}</Td>
                  <Td>
                    <AttemptStatusBadge status={a.status} />
                    {queueByAttempt.get(a.id) ? <Badge tone="warning" className="ml-1">{queueByAttempt.get(a.id)} to review</Badge> : null}
                  </Td>
                  <Td>{a.violation_count ? <Badge tone="danger">{a.violation_count}</Badge> : "0"}</Td>
                  <Td className="text-right tabular-nums">{a.score != null ? `${Number(a.score)}/${Number(a.max_score)} · ${formatPercent(a.percentage)}` : "—"}</Td>
                </tr>
              ))}
              {attempts.length === 0 && <tr><Td colSpan={6} className="py-8 text-center text-muted">No submitted attempts.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
