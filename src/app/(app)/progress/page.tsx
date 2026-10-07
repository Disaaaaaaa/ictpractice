import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryMap } from "@/lib/curriculum";
import { getProgressContext, overallMastery, paperReadiness, topicProgress } from "@/lib/progress";
import { getRecentAttempts, attemptLink } from "@/lib/student-data";
import { masteryStatus, STATUS_TONE, MASTERY_STATUSES } from "@/lib/mastery";
import { formatDate, formatPercent } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, ReadinessRow } from "@/components/ui/progress";
import { Table, Td, Th } from "@/components/ui/table";
import { Select, Input } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { Stat } from "@/components/ui/stat";
import { LoCode } from "@/components/lo-code";

export const metadata: Metadata = { title: "My Progress" };

export default async function ProgressPage({ searchParams }: PageProps<"/progress">) {
  const profile = await requireProfile(["student"]);
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const f = { grade: get("grade"), term: get("term"), unit: get("unit"), paper: get("paper"), topic: get("topic"), lo: get("lo").trim(), status: get("status") };

  const supabase = await createClient();
  const [ctx, mastery, attempts, { data: rows }] = await Promise.all([
    getProgressContext(),
    getMasteryMap(supabase, profile.id),
    getRecentAttempts(supabase, profile.id, 30),
    supabase.from("student_mastery").select("learning_objective_id, practice_count, exam_count").eq("student_id", profile.id),
  ]);
  const counts = new Map((rows ?? []).map((r) => [r.learning_objective_id as string, r]));
  const allTopics = topicProgress(ctx, mastery);
  const units = [...new Map(allTopics.map((t) => [t.unitCode, t.unitTitle])).entries()].sort();

  const topics = allTopics.filter(
    (t) =>
      (!f.grade || t.grade === Number(f.grade)) &&
      (!f.term || t.termNumber === Number(f.term)) &&
      (!f.unit || t.unitCode === f.unit) &&
      (!f.paper || t.papers.includes(Number(f.paper))) &&
      (!f.topic || t.slug === f.topic) &&
      (!f.status || t.status === f.status),
  );
  const topicIds = new Set(topics.map((t) => t.id));
  const los = ctx.los.filter(
    (l) =>
      l.topicIds.some((id) => topicIds.has(id)) &&
      (!f.paper || l.papers.includes(Number(f.paper))) &&
      (!f.lo || l.code.startsWith(f.lo) || l.description.toLowerCase().includes(f.lo.toLowerCase())),
  );
  const grade = profile.grade ?? 12;

  return (
    <>
      <PageHeader title="My Progress" description="Mastery is measured per learning objective; topics, terms and papers are averages of their objectives." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Overall mastery" value={formatPercent(overallMastery(ctx, mastery, grade))} />
        {paperReadiness(ctx, mastery, grade).map((r) => (
          <Card key={r.paper} className="p-4">
            <ReadinessRow label={`Paper ${r.paper}`} value={r.value} sub="readiness" />
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardBody>
          <form className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8" aria-label="Filters">
            <Select name="grade" defaultValue={f.grade} aria-label="Grade">
              <option value="">All grades</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </Select>
            <Select name="term" defaultValue={f.term} aria-label="Term">
              <option value="">All terms</option>
              {[1, 2, 3, 4].map((t) => (
                <option key={t} value={t}>Term {["I", "II", "III", "IV"][t - 1]}</option>
              ))}
              <option value="0">Exam only</option>
            </Select>
            <Select name="unit" defaultValue={f.unit} aria-label="Unit">
              <option value="">All units</option>
              {units.map(([code, title]) => (
                <option key={code} value={code}>{code} {title}</option>
              ))}
            </Select>
            <Select name="paper" defaultValue={f.paper} aria-label="Paper">
              <option value="">All papers</option>
              {[1, 2, 3].map((p) => (
                <option key={p} value={p}>Paper {p}</option>
              ))}
            </Select>
            <Select name="topic" defaultValue={f.topic} aria-label="Topic">
              <option value="">All topics</option>
              {allTopics.map((t) => (
                <option key={t.id} value={t.slug}>{t.title} ({t.examOnly ? "exam only" : `G${t.grade}`})</option>
              ))}
            </Select>
            <Select name="status" defaultValue={f.status} aria-label="Status">
              <option value="">Any status</option>
              {MASTERY_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Input name="lo" defaultValue={f.lo} placeholder="LO code e.g. 11.2.1" aria-label="Learning objective" />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Filter</Button>
              <ButtonLink href="/progress" variant="ghost">Reset</ButtonLink>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title={`Topics (${topics.length})`} />
          <CardBody className="p-0">
            <Table>
              <thead>
                <tr><Th>Topic</Th><Th className="w-36">Mastery</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {topics.map((t) => (
                  <tr key={t.id}>
                    <Td>
                      <Link href={`/learn/${t.slug}`} className="font-medium hover:underline">{t.title}</Link>
                      <p className="text-xs text-muted">{t.examOnly ? "Exam only" : `G${t.grade} · ${t.termTitle} · ${t.unitCode}`} · {t.papers.map((p) => `P${p}`).join(", ")}</p>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={t.mastery} label={t.title} />
                        <span className="w-9 text-right text-xs tabular-nums">{formatPercent(t.mastery)}</span>
                      </div>
                    </Td>
                    <Td><Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={`Learning objectives (${los.length})`} />
          <CardBody className="max-h-[48rem] overflow-y-auto p-0">
            <Table>
              <thead>
                <tr><Th>Objective</Th><Th className="w-36">Mastery</Th><Th>Evidence</Th></tr>
              </thead>
              <tbody>
                {los.map((l) => {
                  const m = mastery.get(l.id);
                  const c = counts.get(l.id);
                  const status = masteryStatus(m, m != null);
                  return (
                    <tr key={l.id}>
                      <Td>
                        <LoCode code={l.code} paper={l.source === "paper"} className="text-xs font-semibold text-primary" />
                        <p className="text-xs">{l.description}</p>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={m} label={l.code} />
                          <Badge tone={STATUS_TONE[status]}>{m == null ? "—" : formatPercent(m)}</Badge>
                        </div>
                      </Td>
                      <Td className="text-xs text-muted">{c ? `${c.practice_count} practice · ${c.exam_count} exam` : "—"}</Td>
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
            <thead>
              <tr><Th>Exam</Th><Th>Date</Th><Th>Status</Th><Th className="text-right">Score</Th></tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <Td><Link href={attemptLink(a)} className="font-medium hover:underline">{a.exams?.title ?? "Exam"}</Link></Td>
                  <Td className="text-muted">{formatDate(a.submitted_at ?? a.started_at)}</Td>
                  <Td><AttemptStatusBadge status={a.status} /></Td>
                  <Td className="text-right tabular-nums">{a.status === "GRADED" && a.show_results ? formatPercent(a.percentage) : "—"}</Td>
                </tr>
              ))}
              {attempts.length === 0 && (
                <tr><Td colSpan={4} className="text-center text-muted">No exams yet.</Td></tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
