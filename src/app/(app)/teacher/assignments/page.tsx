import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, nowMs } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Assignments" };

const TYPE_LABEL = { practice: "Practice", topic_exam: "Topic Exam", mock_exam: "Mock Exam", revision: "Revision" } as const;

export default async function AssignmentsPage() {
  const profile = await requireProfile(["teacher", "admin"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("id, title, assignment_type, available_from, deadline, created_at, assignment_targets(classes(name), profiles(username)), attempts(status)")
    .eq("teacher_id", profile.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false });
  type Row = {
    id: string;
    title: string;
    assignment_type: keyof typeof TYPE_LABEL;
    available_from: string;
    deadline: string | null;
    assignment_targets: { classes: { name: string } | null; profiles: { username: string } | null }[];
    attempts: { status: string }[];
  };
  const rows = (data ?? []) as unknown as Row[];
  return (
    <>
      <PageHeader title="Assignments" actions={<ButtonLink href="/teacher/assignments/new">New assignment</ButtonLink>} />
      {rows.length === 0 ? (
        <EmptyState title="No assignments yet" action={<ButtonLink href="/teacher/assignments/new">Create one</ButtonLink>} />
      ) : (
        <Card>
          <CardBody className="p-0">
            <Table>
              <thead><tr><Th>Assignment</Th><Th>Type</Th><Th>Assigned to</Th><Th>Opens</Th><Th>Deadline</Th><Th>Attempts</Th></tr></thead>
              <tbody>
                {rows.map((a) => {
                  const overdue = a.deadline && new Date(a.deadline).getTime() < nowMs();
                  return (
                    <tr key={a.id}>
                      <Td><Link href={`/teacher/assignments/${a.id}`} className="font-medium hover:underline">{a.title}</Link></Td>
                      <Td><Badge>{TYPE_LABEL[a.assignment_type]}</Badge></Td>
                      <Td className="text-sm">{a.assignment_targets.map((t) => t.classes?.name ?? t.profiles?.username).filter(Boolean).join(", ")}</Td>
                      <Td className="text-muted">{formatDate(a.available_from)}</Td>
                      <Td>{a.deadline ? <span className={overdue ? "text-muted" : ""}>{formatDate(a.deadline)}</span> : "—"}</Td>
                      <Td className="tabular-nums">
                        {a.attempts.length}
                        {a.attempts.some((x) => x.status === "IN_PROGRESS") && <Badge tone="info" className="ml-2">live</Badge>}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </>
  );
}
