import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts, getClassRoster, getTeacherClasses } from "@/lib/teacher-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { LiveMonitor } from "@/components/teacher/live-monitor";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Live monitor" };

export default async function ExamLivePage({ params, searchParams }: PageProps<"/teacher/exams/[id]/live">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const classId = String((await searchParams).class ?? "");
  const supabase = await createClient();
  const { data: exam } = await supabase.from("exams").select("id, title, current:current_version_id(question_count)").eq("id", id).maybeSingle();
  if (!exam) notFound();
  await supabase.rpc("expire_overdue_attempts");
  const [classes, attempts] = await Promise.all([getTeacherClasses(supabase, profile), getAttempts(supabase, { examId: id, limit: 2000 })]);

  let students: { id: string; name: string }[];
  if (classId) {
    const roster = await getClassRoster(supabase, classId);
    students = (roster?.students ?? []).map((s) => ({ id: s.id, name: displayName(s) }));
  } else {
    const seen = new Map<string, string>();
    for (const a of attempts) if (a.profiles && !seen.has(a.student_id)) seen.set(a.student_id, displayName(a.profiles));
    students = [...seen].map(([sid, name]) => ({ id: sid, name }));
  }
  const ids = new Set(students.map((s) => s.id));
  const qCount = (exam as unknown as { current: { question_count: number } | null }).current?.question_count ?? 0;

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Exam Sessions", href: "/teacher/exams" }, { label: exam.title, href: `/teacher/exams/${id}` }, { label: "Live" }]} title={`${exam.title} — live`} />
      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Class">
        <Link href={`/teacher/exams/${id}/live`} className={cn("rounded-full border px-3 py-1 text-sm", !classId ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface")}>Everyone who started</Link>
        {classes.map((c) => (
          <Link key={c.id} href={`/teacher/exams/${id}/live?class=${c.id}`} className={cn("rounded-full border px-3 py-1 text-sm", classId === c.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface")}>{c.name}</Link>
        ))}
      </nav>
      <Card>
        <CardBody className="p-0 pb-2">
          <LiveMonitor
            examId={id}
            students={students}
            questionCount={qCount}
            initial={attempts.filter((a) => ids.has(a.student_id)).map((x) => ({
              id: x.id, student_id: x.student_id, status: x.status, started_at: x.started_at, deadline_at: x.deadline_at,
              submitted_at: x.submitted_at, current_question: x.current_question, answered_count: x.answered_count,
              violation_count: x.violation_count, last_heartbeat_at: x.last_heartbeat_at, is_online: x.is_online,
              percentage: x.percentage, assignment_id: x.assignment_id,
            }))}
          />
        </CardBody>
      </Card>
    </>
  );
}
