import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge, type Tone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Exam Sessions" };

const STATUS_TONE: Record<string, Tone> = { draft: "neutral", scheduled: "info", published: "success", closed: "warning", archived: "neutral" };
const KINDS = [
  { key: "", label: "All" },
  { key: "mock", label: "Mock exams" },
  { key: "topic", label: "Topic exams" },
  { key: "custom", label: "Custom" },
];

export default async function ExamsPage({ searchParams }: PageProps<"/teacher/exams">) {
  await requireProfile(["teacher", "admin"]);
  const kind = String((await searchParams).kind ?? "");
  const supabase = await createClient();
  let q = supabase
    .from("exams")
    .select("id, title, kind, status, year, duration_minutes, created_by, paper_components(title), topics(title), current:current_version_id(version, question_count, total_marks), attempts(status)")
    .is("archived_at", null)
    .order("kind")
    .order("year", { ascending: false, nullsFirst: false })
    .order("title");
  if (kind) q = q.eq("kind", kind);
  const { data } = await q;
  type Row = {
    id: string; title: string; kind: string; status: string; year: number | null; duration_minutes: number;
    paper_components: { title: string } | null; topics: { title: string } | null;
    current: { version: number; question_count: number; total_marks: number } | null; attempts: { status: string }[];
  };
  const rows = (data ?? []) as unknown as Row[];
  return (
    <>
      <PageHeader title="Exam Sessions" description="Topic exams, mock exams and custom exams. Students always sit an immutable published version." actions={<ButtonLink href="/teacher/exams/new">New exam</ButtonLink>} />
      <nav className="mb-4 flex gap-2" aria-label="Exam type">
        {KINDS.map((k) => (
          <Link key={k.key} href={k.key ? `/teacher/exams?kind=${k.key}` : "/teacher/exams"} aria-current={kind === k.key ? "page" : undefined}
            className={cn("rounded-full border px-3 py-1 text-sm font-medium", kind === k.key ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2")}>
            {k.label}
          </Link>
        ))}
      </nav>
      <Card>
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Exam</Th><Th>Type</Th><Th>Status</Th><Th>Version</Th><Th>Questions / marks</Th><Th>Attempts</Th><Th className="text-right">Live</Th></tr></thead>
            <tbody>
              {rows.map((e) => {
                const live = e.attempts.filter((a) => a.status === "IN_PROGRESS").length;
                return (
                  <tr key={e.id}>
                    <Td>
                      <Link href={`/teacher/exams/${e.id}`} className="font-medium hover:underline">{e.title}</Link>
                      <p className="text-xs text-muted">{[e.paper_components?.title, e.topics?.title, e.year].filter(Boolean).join(" · ")}</p>
                    </Td>
                    <Td className="capitalize">{e.kind}</Td>
                    <Td><Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge></Td>
                    <Td className="tabular-nums">{e.current ? `v${e.current.version}` : "—"}</Td>
                    <Td className="tabular-nums">{e.current ? `${e.current.question_count} / ${e.current.total_marks}` : "—"}</Td>
                    <Td className="tabular-nums">{e.attempts.length}</Td>
                    <Td className="text-right">
                      {live > 0 ? <Link href={`/teacher/exams/${e.id}/live`}><Badge tone="info">{live} live</Badge></Link> : <Link href={`/teacher/exams/${e.id}/live`} className="text-xs text-muted hover:underline">Monitor</Link>}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
