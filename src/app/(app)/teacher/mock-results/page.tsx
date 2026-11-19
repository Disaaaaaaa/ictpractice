import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, displayName, byName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts, getClassRoster, getTeacherClasses, getVisibleStudents, stats, type AttemptRow } from "@/lib/teacher-data";
import { formatDate, formatPercent } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Stat } from "@/components/ui/stat";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Mock Exam Results" };

type Paper = { id: string; title: string; year: number | null; short: string };

/** "NIS 2024 · Paper 2: Solution design" → "2024 P2" */
function shortTitle(title: string, year: number | null): string {
  const y = year ?? title.match(/\b(20\d\d)\b/)?.[1] ?? null;
  const p = title.match(/Paper\s*(\d)/i)?.[1];
  return [y, p ? `P${p}` : null].filter(Boolean).join(" ") || title;
}

const tone = (pct: number) => (pct >= 70 ? "text-success" : pct >= 50 ? "text-warning" : "text-danger");

export default async function MockResultsPage({ searchParams }: PageProps<"/teacher/mock-results">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const f = { cls: get("class"), year: get("year") };
  const supabase = await createClient();
  const classes = await getTeacherClasses(supabase, profile);
  const students = f.cls ? ((await getClassRoster(supabase, f.cls))?.students ?? []) : await getVisibleStudents(supabase);

  const { data: examRows } = await supabase
    .from("exams")
    .select("id, title, year")
    .eq("kind", "mock")
    .not("current_version_id", "is", null)
    .is("archived_at", null);
  const allPapers: Paper[] = (examRows ?? [])
    .map((e) => ({ id: e.id as string, title: e.title as string, year: (e.year as number | null) ?? null, short: shortTitle(e.title as string, (e.year as number | null) ?? null) }))
    .sort((a, b) => a.short.localeCompare(b.short));
  const years = [...new Set(allPapers.map((p) => p.short.split(" ")[0]))].sort();
  const papers = f.year ? allPapers.filter((p) => p.short.startsWith(f.year)) : allPapers;

  const attempts = await getAttempts(supabase, {
    studentIds: students.map((s) => s.id),
    examIds: papers.map((p) => p.id),
    status: ["SUBMITTED", "GRADED", "REVIEW_REQUIRED"],
    limit: 2000,
  });

  // best graded attempt of each student on each paper
  const cell = new Map<string, { best: AttemptRow | null; count: number; pending: boolean }>();
  for (const a of attempts) {
    const k = `${a.student_id}:${a.exam_id}`;
    const c = cell.get(k) ?? { best: null, count: 0, pending: false };
    c.count++;
    if (a.status === "GRADED" && a.percentage != null) {
      if (!c.best || Number(a.percentage) > Number(c.best.percentage)) c.best = a;
    } else c.pending = true;
    cell.set(k, c);
  }
  const shownPapers = papers.filter((p) => attempts.some((a) => a.exam_id === p.id));
  const rows = students
    .filter((s) => f.cls || attempts.some((a) => a.student_id === s.id))
    .sort(byName)
    .map((s) => {
      const best = shownPapers.map((p) => cell.get(`${s.id}:${p.id}`)?.best?.percentage).filter((v): v is number => v != null).map(Number);
      return { s, mean: best.length ? best.reduce((x, y) => x + y, 0) / best.length : null };
    });
  const perPaper = shownPapers.map((p) => ({
    p,
    s: stats(students.map((st) => cell.get(`${st.id}:${p.id}`)?.best?.percentage).filter((v): v is number => v != null).map(Number)),
  }));
  const overall = stats(rows.map((r) => r.mean).filter((v): v is number => v != null));
  const recent = [...attempts].sort((a, b) => (b.submitted_at ?? "").localeCompare(a.submitted_at ?? "")).slice(0, 50);
  const paperOf = new Map(allPapers.map((p) => [p.id, p]));

  return (
    <>
      <PageHeader title="Mock Exam Results" description="Past-paper mock exams: the best marked attempt of each student on each paper. Open a cell to see or moderate the attempt." />

      <Card className="mb-6">
        <CardBody>
          <form className="grid gap-2 sm:grid-cols-3">
            <Select name="class" defaultValue={f.cls} aria-label="Class">
              <option value="">All my classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select name="year" defaultValue={f.year} aria-label="Year">
              <option value="">All years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
            <Button type="submit">Filter</Button>
          </form>
        </CardBody>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Students who sat a mock" value={rows.filter((r) => r.mean != null).length} sub={`${attempts.length} attempts`} />
        <Stat label="Average (best per paper)" value={formatPercent(overall.mean)} sub={overall.n ? `median ${formatPercent(overall.median)}` : undefined} />
        {perPaper
          .slice()
          .sort((a, b) => b.s.n - a.s.n)
          .slice(0, 2)
          .map(({ p, s }) => (
            <Stat key={p.id} label={`${p.short} — average`} value={formatPercent(s.mean)} sub={`${s.n} marked · best ${formatPercent(s.max)}`} />
          ))}
      </div>

      <Card className="mb-6">
        <CardHeader title="Students × papers" description="Best marked percentage; ⋯ = being marked or waiting for review; ×N = number of attempts." />
        <CardBody className="p-0">
          {shownPapers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No mock exam attempts yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Student</Th>
                  {shownPapers.map((p) => <Th key={p.id} className="text-center" title={p.title}>{p.short}</Th>)}
                  <Th className="text-right">Average</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ s, mean }) => (
                  <tr key={s.id}>
                    <Td><Link href={`/teacher/students/${s.id}`} className="font-medium hover:underline">{displayName(s)}</Link></Td>
                    {shownPapers.map((p) => {
                      const c = cell.get(`${s.id}:${p.id}`);
                      if (!c) return <Td key={p.id} className="text-center text-muted">—</Td>;
                      return (
                        <Td key={p.id} className="text-center tabular-nums">
                          {c.best ? (
                            <Link href={`/teacher/results/${c.best.id}`} className={cn("font-semibold hover:underline", tone(Number(c.best.percentage)))}>
                              {formatPercent(c.best.percentage)}
                            </Link>
                          ) : null}
                          {c.pending && <span className="ml-1 text-warning" title="Being marked or waiting for review">⋯</span>}
                          {c.count > 1 && <span className="ml-1 text-xs text-muted">×{c.count}</span>}
                        </Td>
                      );
                    })}
                    <Td className={cn("text-right font-semibold tabular-nums", mean != null && tone(mean))}>{formatPercent(mean)}</Td>
                  </tr>
                ))}
                <tr className="bg-surface-2">
                  <Td className="font-semibold">Average</Td>
                  {perPaper.map(({ p, s }) => <Td key={p.id} className="text-center font-semibold tabular-nums">{formatPercent(s.mean)}</Td>)}
                  <Td className="text-right font-semibold tabular-nums">{formatPercent(overall.mean)}</Td>
                </tr>
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Latest attempts" />
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Student</Th><Th>Paper</Th><Th>Submitted</Th><Th>Status</Th><Th>Violations</Th><Th className="text-right">Score</Th></tr></thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id}>
                  <Td><Link href={`/teacher/results/${a.id}`} className="font-medium hover:underline">{a.profiles ? displayName(a.profiles) : "—"}</Link></Td>
                  <Td><Badge tone="primary">{paperOf.get(a.exam_id)?.short ?? "?"}</Badge> <span className="text-muted">{a.exams?.title}</span></Td>
                  <Td className="text-muted">{formatDate(a.submitted_at)}</Td>
                  <Td><AttemptStatusBadge status={a.status} /></Td>
                  <Td>{a.violation_count ? <Badge tone="danger">{a.violation_count}</Badge> : "0"}</Td>
                  <Td className="text-right tabular-nums">{a.score != null ? `${Number(a.score)}/${Number(a.max_score)} · ${formatPercent(a.percentage)}` : "—"}</Td>
                </tr>
              ))}
              {recent.length === 0 && <tr><Td colSpan={6} className="py-8 text-center text-muted">No submitted attempts.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
