import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryByStudent, getVisibleStudents } from "@/lib/teacher-data";
import { getProgressContext, overallMastery } from "@/lib/progress";
import { formatPercent, relativeTime } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Input } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage({ searchParams }: PageProps<"/teacher/students">) {
  await requireProfile(["teacher", "admin"]);
  const q = String((await searchParams).q ?? "").trim().toLowerCase();
  const supabase = await createClient();
  const all = await getVisibleStudents(supabase);
  const students = q ? all.filter((s) => `${s.first_name} ${s.last_name} ${s.username}`.toLowerCase().includes(q)) : all;
  const [ctx, mastery, { data: memberships }] = await Promise.all([
    getProgressContext(),
    getMasteryByStudent(supabase, students.map((s) => s.id)),
    supabase.from("class_members").select("student_id, classes(name)").eq("status", "active"),
  ]);
  const classOf = new Map<string, string[]>();
  for (const m of (memberships ?? []) as unknown as { student_id: string; classes: { name: string } | null }[]) {
    if (m.classes) classOf.set(m.student_id, [...(classOf.get(m.student_id) ?? []), m.classes.name]);
  }
  return (
    <>
      <PageHeader title="Students" description={`${all.length} students in your classes`} />
      <Card>
        <CardBody>
          <form className="max-w-sm"><Input name="q" defaultValue={q} placeholder="Search by name or username" aria-label="Search students" /></form>
        </CardBody>
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Name</Th><Th>Username</Th><Th>Class</Th><Th>Grade</Th><Th className="w-40">Overall</Th><Th>Last activity</Th></tr></thead>
            <tbody>
              {students.map((s) => {
                const o = overallMastery(ctx, mastery.get(s.id) ?? new Map(), s.grade ?? 12);
                return (
                  <tr key={s.id}>
                    <Td>
                      <Link href={`/teacher/students/${s.id}`} className="font-medium hover:underline">{displayName(s)}</Link>
                      {!s.is_active && <Badge tone="danger" className="ml-2">Disabled</Badge>}
                    </Td>
                    <Td className="font-mono text-xs">{s.username}</Td>
                    <Td>{(classOf.get(s.id) ?? []).join(", ") || "—"}</Td>
                    <Td>{s.grade ?? "—"}</Td>
                    <Td><div className="flex items-center gap-2"><ProgressBar value={o} label="Overall" /><span className="w-9 text-right text-xs tabular-nums">{formatPercent(o)}</span></div></Td>
                    <Td className="text-muted">{relativeTime(s.last_activity_at)}</Td>
                  </tr>
                );
              })}
              {students.length === 0 && <tr><Td colSpan={6} className="py-6 text-center text-muted">No students found.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
