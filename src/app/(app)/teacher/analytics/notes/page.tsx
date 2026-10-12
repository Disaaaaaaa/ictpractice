import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { getClassRoster, getTeacherClasses, getVisibleStudents, stats } from "@/lib/teacher-data";
import { formatDate, formatPercent } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Table, Td, Th } from "@/components/ui/table";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { AnalyticsTabs } from "@/components/teacher/analytics-tabs";
import { percentTone } from "@/components/notes/note-result";

export const metadata: Metadata = { title: "Notes checks" };

type Row = { id: string; student_id: string; topic_id: string; status: string; percentage: number | null; image_paths: string[]; created_at: string };

export default async function NotesChecksPage({ searchParams }: PageProps<"/teacher/analytics/notes">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const cls = typeof sp.class === "string" ? sp.class : "";
  const topicId = typeof sp.topic === "string" && /^[0-9a-f-]{36}$/i.test(sp.topic) ? sp.topic : "";
  const view = sp.view === "all" ? "all" : "best";
  const supabase = await createClient();
  const version = await getActiveVersion();
  const [classes, students, { data: topicRows }] = await Promise.all([
    getTeacherClasses(supabase, profile),
    cls ? getClassRoster(supabase, cls).then((r) => r?.students ?? []) : getVisibleStudents(supabase),
    supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").is("archived_at", null).order("sort_order"),
  ]);
  const topics = new Map(((topicRows ?? []) as { id: string; title: string }[]).map((t) => [t.id, t.title]));
  const names = new Map(students.map((s) => [s.id, displayName(s)]));

  // RLS already limits the rows to the caller's students.
  let q = supabase
    .from("note_submissions")
    .select("id, student_id, topic_id, status, percentage, image_paths, created_at")
    .in("student_id", students.map((s) => s.id).concat("00000000-0000-0000-0000-000000000000"))
    .order("created_at", { ascending: false })
    .limit(1000);
  if (topicId) q = q.eq("topic_id", topicId);
  const { data } = await q;
  const all = (data ?? []) as Row[];

  // "Best" keeps each student's best check per topic.
  const best = new Map<string, Row & { attempts: number }>();
  for (const r of all) {
    const key = `${r.student_id}:${r.topic_id}`;
    const cur = best.get(key);
    if (!cur) best.set(key, { ...r, attempts: 1 });
    else best.set(key, { ...(Number(r.percentage ?? -1) > Number(cur.percentage ?? -1) ? r : cur), attempts: cur.attempts + 1 });
  }
  const rows: (Row & { attempts?: number })[] = view === "best" ? [...best.values()].sort((a, b) => b.created_at.localeCompare(a.created_at)) : all;
  const s = stats([...best.values()].filter((r) => r.percentage != null).map((r) => Number(r.percentage)));
  const studentsChecked = new Set(all.map((r) => r.student_id)).size;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Notes checks: students photograph their handwritten notes and the AI checks them against the key points of the topic's theory. The result is a percentage of the key points covered."
      />
      <AnalyticsTabs />
      {students.length === 0 ? (
        <EmptyState title="No students yet">Add students to a class to see their notes checks.</EmptyState>
      ) : (
        <>
          <Card>
            <CardBody>
              <form className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Select name="class" defaultValue={cls} aria-label="Class">
                  <option value="">All my classes</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Select name="topic" defaultValue={topicId} aria-label="Topic">
                  <option value="">All topics</option>
                  {[...topics].map(([id, title]) => <option key={id} value={id}>{title}</option>)}
                </Select>
                <Select name="view" defaultValue={view} aria-label="Rows">
                  <option value="best">Best result per student and topic</option>
                  <option value="all">Every check</option>
                </Select>
                <Button type="submit">Apply</Button>
              </form>
            </CardBody>
          </Card>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Students who checked notes" value={studentsChecked} sub={`of ${students.length} students`} />
            <Stat label="Average (best results)" value={formatPercent(s.mean)} sub={`${s.n} student–topic results`} />
            <Stat label="Highest" value={formatPercent(s.max)} />
            <Stat label="Lowest" value={formatPercent(s.min)} />
          </div>

          <Card className="mt-6">
            <CardHeader title={view === "best" ? "Best result per student and topic" : "Every check"} description="Open a row to see the photos, the key points and the advice the student received." />
            <CardBody className="p-0">
              <Table>
                <thead><tr><Th>Student</Th><Th>Topic</Th><Th>Result</Th><Th>Pages</Th>{view === "best" && <Th>Checks</Th>}<Th>Checked</Th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <Td><Link href={`/teacher/analytics/notes/${r.id}`} className="font-medium hover:underline">{names.get(r.student_id) ?? "Student"}</Link></Td>
                      <Td>{topics.get(r.topic_id) ?? "—"}</Td>
                      <Td>
                        {r.percentage != null
                          ? <Badge tone={percentTone(Number(r.percentage))}>{Math.round(Number(r.percentage))}%</Badge>
                          : <Badge tone="warning">Not readable</Badge>}
                      </Td>
                      <Td className="tabular-nums">{r.image_paths.length}</Td>
                      {view === "best" && <Td className="tabular-nums">{r.attempts}</Td>}
                      <Td className="text-muted">{formatDate(r.created_at)}</Td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><Td colSpan={6} className="py-6 text-center text-muted">No notes have been checked yet.</Td></tr>}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
