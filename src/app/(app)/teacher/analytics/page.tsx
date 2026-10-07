import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { requireProfile, displayName, shortName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAttempts, getClassRoster, getMasteryByStudent, getTeacherClasses, getVisibleStudents, stats } from "@/lib/teacher-data";
import { getProgressContext, loAverage, overallMastery, paperReadiness, topicProgress } from "@/lib/progress";
import { examQuestionAnalysis } from "@/lib/analytics";
import { breakdown } from "@/lib/breakdown";
import { formatDuration, formatMark, formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { paperLabel, type Paper } from "@/lib/questions/types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { ProgressBar, ReadinessRow } from "@/components/ui/progress";
import { Table, Td, Th } from "@/components/ui/table";
import { Select } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoCode } from "@/components/lo-code";

export const metadata: Metadata = { title: "Analytics" };

function heatClass(v: number | undefined) {
  if (v == null) return "bg-surface-2 text-muted";
  if (v >= 85) return "bg-success text-white";
  if (v >= 70) return "bg-success-soft text-success";
  if (v >= 50) return "bg-warning-soft text-warning";
  return "bg-danger-soft text-danger";
}

export default async function AnalyticsPage({ searchParams }: PageProps<"/teacher/analytics">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const f = { cls: get("class"), exam: get("exam"), topic: get("topic"), paper: get("paper") };
  const supabase = await createClient();
  const classes = await getTeacherClasses(supabase, profile);
  const students = f.cls ? ((await getClassRoster(supabase, f.cls))?.students ?? []) : await getVisibleStudents(supabase);
  const ids = students.map((s) => s.id);
  const [ctx, masteryBy, attempts, { data: exams }] = await Promise.all([
    getProgressContext(),
    getMasteryByStudent(supabase, ids),
    getAttempts(supabase, { studentIds: ids, status: ["GRADED", "REVIEW_REQUIRED"], limit: 3000 }),
    supabase.from("exams").select("id, title, kind").not("current_version_id", "is", null).is("archived_at", null).order("kind").order("title"),
  ]);

  if (students.length === 0) {
    return (
      <>
        <PageHeader title="Analytics" />
        <EmptyState title="No students yet">Add students to a class to see analytics.</EmptyState>
      </>
    );
  }

  const empty = new Map<string, number>();
  const examAttempts = f.exam ? attempts.filter((a) => a.exam_id === f.exam && a.status === "GRADED") : attempts.filter((a) => a.status === "GRADED");
  const s = stats(examAttempts.map((a) => Number(a.percentage ?? 0)));

  // Class mastery averages
  const avgLo = (loId: string) => {
    const vals = ids.map((id) => masteryBy.get(id)?.get(loId)).filter((v): v is number => v != null);
    return vals.length ? { avg: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length } : null;
  };
  const classMastery = new Map<string, number>();
  for (const lo of ctx.los) {
    const a = avgLo(lo.id);
    if (a) classMastery.set(lo.id, (a.avg * a.n) / ids.length); // untouched students count as 0
  }
  const readiness = [1, 2, 3].map((p) => ({
    paper: p,
    value: ids.length ? ids.reduce((sum, id) => sum + (paperReadiness(ctx, masteryBy.get(id) ?? empty).find((r) => r.paper === p)?.value ?? 0), 0) / ids.length : null,
  }));
  const topics = topicProgress(ctx, classMastery)
    .map((t) => ({ ...t, value: loAverage(t.loIds, classMastery) }))
    .filter((t) => t.loIds.some((id) => classMastery.has(id)));
  const weak = [...topics].sort((a, b) => (a.value ?? 0) - (b.value ?? 0)).slice(0, 6);
  const strong = [...topics].sort((a, b) => (b.value ?? 0) - (a.value ?? 0)).slice(0, 6);

  const ranking = students
    .map((st) => {
      const mine = attempts.filter((a) => a.student_id === st.id && a.status === "GRADED");
      return {
        st,
        overall: overallMastery(ctx, masteryBy.get(st.id) ?? empty, st.grade ?? 12) ?? 0,
        examAvg: mine.length ? mine.reduce((t, a) => t + Number(a.percentage ?? 0), 0) / mine.length : null,
        n: mine.length,
      };
    })
    .sort((a, b) => b.overall - a.overall);

  // LO heatmap columns
  const heatLos = ctx.los
    .filter((l) => (f.topic ? l.topicIds.includes(f.topic) : true) && (f.paper ? l.papers.includes(Number(f.paper)) : true))
    .filter((l) => f.topic || classMastery.has(l.id))
    .slice(0, 40);

  // Exam detail
  const analysis = f.exam ? await examQuestionAnalysis(supabase, f.exam, ids) : null;
  let examBreakdown: ReturnType<typeof breakdown> | null = null;
  if (f.exam && analysis && analysis.questions.length) {
    const qs = analysis.questions.map((x) => x.question);
    const { data: res } = await supabase.from("grading_results").select("question_id, final_mark, max_mark").in("attempt_id", examAttempts.map((a) => a.id));
    const sums = new Map<string, { final: number; max: number }>();
    for (const r of res ?? []) {
      const cur = sums.get(r.question_id) ?? { final: 0, max: 0 };
      cur.final += Number(r.final_mark ?? 0);
      cur.max += Number(r.max_mark);
      sums.set(r.question_id, cur);
    }
    examBreakdown = breakdown(qs as Paper["questions"], qs.map((q) => ({ questionId: q.id, final: sums.get(q.id)?.final ?? 0, max: sums.get(q.id)?.max ?? 0 })));
  }
  const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);

  return (
    <>
      <PageHeader
        title="Analytics"
        description={`${students.length} students${f.cls ? ` in ${classes.find((c) => c.id === f.cls)?.name}` : " in your classes"}`}
        actions={<ButtonLink href={`/api/export?kind=lo&format=xlsx${f.cls ? `&classId=${f.cls}` : ""}`} variant="secondary" prefetch={false}><Download className="h-4 w-4" /> Export LO report</ButtonLink>}
      />
      <Card>
        <CardBody>
          <form className="grid gap-2 sm:grid-cols-5">
            <Select name="class" defaultValue={f.cls} aria-label="Class">
              <option value="">All my classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select name="exam" defaultValue={f.exam} aria-label="Exam">
              <option value="">All exams</option>
              {(exams ?? []).map((e) => <option key={e.id} value={e.id}>{e.kind === "mock" ? "Mock · " : ""}{e.title}</option>)}
            </Select>
            <Select name="paper" defaultValue={f.paper} aria-label="Paper (heatmap)">
              <option value="">Heatmap: all papers</option>
              <option value="1">Paper 1</option><option value="2">Paper 2</option><option value="3">Paper 3</option>
            </Select>
            <Select name="topic" defaultValue={f.topic} aria-label="Topic (heatmap)">
              <option value="">Heatmap: objectives with data</option>
              {ctx.topics.map((t) => <option key={t.id} value={t.id}>{t.title} ({t.examOnly ? "exam only" : `G${t.grade}`})</option>)}
            </Select>
            <Button type="submit">Apply</Button>
          </form>
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={f.exam ? "Exam average" : "Class average (all exams)"} value={formatPercent(s.mean)} sub={`${s.n} graded attempts`} />
        <Stat label="Median" value={formatPercent(s.median)} />
        <Stat label="Highest" value={formatPercent(s.max)} />
        <Stat label="Lowest" value={formatPercent(s.min)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Paper readiness" description="Class average of each student's readiness." />
          <CardBody className="space-y-4">
            {readiness.map((r) => <ReadinessRow key={r.paper} label={`Paper ${r.paper}`} value={r.value} />)}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Weak areas" />
          <CardBody className="space-y-3">
            {weak.length === 0 ? <p className="text-sm text-muted">No data yet.</p> : weak.map((t) => (
              <div key={t.id} className="space-y-1">
                <div className="flex justify-between gap-2 text-sm"><span className="truncate">{t.title}</span><span className="tabular-nums">{formatPercent(t.value)}</span></div>
                <ProgressBar value={t.value} label={t.title} />
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Strong areas" />
          <CardBody className="space-y-3">
            {strong.length === 0 ? <p className="text-sm text-muted">No data yet.</p> : strong.map((t) => (
              <div key={t.id} className="space-y-1">
                <div className="flex justify-between gap-2 text-sm"><span className="truncate">{t.title}</span><span className="tabular-nums">{formatPercent(t.value)}</span></div>
                <ProgressBar value={t.value} label={t.title} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {f.exam && analysis && (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Result breakdown by topic" />
              <CardBody className="space-y-3">
                {(examBreakdown?.topics ?? []).map((t) => (
                  <div key={t.key} className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm"><span className="truncate">{t.label}</span><span className="tabular-nums">{formatPercent(t.percent)}</span></div>
                    <ProgressBar value={t.percent} label={t.label} />
                  </div>
                ))}
                {!examBreakdown && <p className="text-sm text-muted">No graded attempts for this exam.</p>}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Result breakdown by learning objective" />
              <CardBody className="grid gap-2 sm:grid-cols-2">
                {(examBreakdown?.objectives ?? []).map((o) => (
                  <div key={o.key} className="space-y-1">
                    <div className="flex justify-between text-xs"><span className="font-mono">{o.label}</span><span className="tabular-nums">{formatPercent(o.percent)}</span></div>
                    <ProgressBar value={o.percent} label={o.label} />
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader title="Question analysis" description="Discrimination compares the top and bottom 27% of scorers (≥ 0.3 is good, < 0.1 needs review)." />
            <CardBody className="p-0">
              <Table>
                <thead><tr><Th>Q</Th><Th>Question</Th><Th>Attempts</Th><Th>Avg mark</Th><Th>Success</Th><Th>Avg time</Th><Th>Discrimination</Th><Th>Most common wrong answer</Th><Th>AI confidence</Th><Th>Override rate</Th></tr></thead>
                <tbody>
                  {analysis.questions.map((x) => (
                    <tr key={x.question.id}>
                      <Td className="tabular-nums">{paperLabel(x.question)}</Td>
                      <Td><Link href={`/teacher/questions/${x.question.id}`} className="hover:underline">{x.question.title}</Link></Td>
                      <Td className="tabular-nums">{x.attempts}</Td>
                      <Td className="tabular-nums">{formatMark(x.averageMark)} / {x.question.marks}</Td>
                      <Td className="tabular-nums">{formatPercent(x.successRate)}</Td>
                      <Td className="tabular-nums">{formatDuration(x.averageTime)}</Td>
                      <Td className={cn("tabular-nums", x.discrimination != null && x.discrimination < 0.1 && "text-danger")}>{x.discrimination == null ? "—" : x.discrimination.toFixed(2)}</Td>
                      <Td className="text-xs">{x.commonWrong ?? "—"}</Td>
                      <Td className="tabular-nums">{x.aiConfidence == null ? "—" : `${Math.round(x.aiConfidence * 100)}%`}</Td>
                      <Td className="tabular-nums">{formatPercent(x.overrideRate)}</Td>
                    </tr>
                  ))}
                  {analysis.questions.length === 0 && <tr><Td colSpan={10} className="py-6 text-center text-muted">No graded attempts for this exam yet.</Td></tr>}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}

      <Card className="mt-6">
        <CardHeader title="Learning objective heatmap" description="Mastery per student and objective. Click a student for details." />
        <CardBody className="p-0">
          {heatLos.length === 0 ? (
            <p className="p-5 text-sm text-muted">No objective data yet — choose a topic to see its objectives.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 border-b border-border bg-surface px-3 py-2 text-left">Student</th>
                    {heatLos.map((l) => (
                      <th key={l.id} className="border-b border-border px-1 py-2 font-mono font-medium" title={l.description}>
                        <span className="mx-auto block rotate-180 whitespace-nowrap py-1 [writing-mode:vertical-rl]">{l.code}{l.source === "paper" ? " ·P" : ""}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ranking.map(({ st }) => (
                    <tr key={st.id}>
                      <td className="sticky left-0 z-10 border-b border-border bg-surface px-3 py-1.5 whitespace-nowrap">
                        <Link href={`/teacher/students/${st.id}`} className="hover:underline">{shortName(st)}</Link>
                      </td>
                      {heatLos.map((l) => {
                        const v = masteryBy.get(st.id)?.get(l.id);
                        return (
                          <td key={l.id} className="border-b border-border p-0.5">
                            <span className={cn("flex h-7 w-10 items-center justify-center rounded tabular-nums", heatClass(v))} title={`${displayName(st)} · ${l.code}: ${v == null ? "no data" : Math.round(v) + "%"}`}>
                              {v == null ? "·" : Math.round(v)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="sticky left-0 z-10 bg-surface px-3 py-1.5 font-semibold">Class</td>
                    {heatLos.map((l) => {
                      const v = classMastery.get(l.id);
                      return (
                        <td key={l.id} className="p-0.5">
                          <span className={cn("flex h-7 w-10 items-center justify-center rounded font-semibold tabular-nums", heatClass(v))}>{v == null ? "·" : Math.round(v)}</span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Topic performance" />
          <CardBody className="max-h-[32rem] overflow-y-auto p-0">
            <Table>
              <thead><tr><Th>Topic</Th><Th className="w-40">Class mastery</Th></tr></thead>
              <tbody>
                {topics.sort((a, b) => a.sort - b.sort).map((t) => (
                  <tr key={t.id}>
                    <Td><Link href={`/teacher/analytics?${new URLSearchParams({ ...Object.fromEntries(qs), topic: t.id })}`} className="hover:underline">{t.title}</Link><p className="text-xs text-muted">{t.examOnly ? "Exam only" : `G${t.grade} · ${t.unitCode}`} · {t.papers.map((p) => `P${p}`).join(", ")}</p></Td>
                    <Td><div className="flex items-center gap-2"><ProgressBar value={t.value} label={t.title} /><span className="w-9 text-right tabular-nums">{formatPercent(t.value)}</span></div></Td>
                  </tr>
                ))}
                {topics.length === 0 && <tr><Td colSpan={2} className="py-6 text-center text-muted">No activity yet.</Td></tr>}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Student ranking" />
          <CardBody className="max-h-[32rem] overflow-y-auto p-0">
            <Table>
              <thead><tr><Th>#</Th><Th>Student</Th><Th>Overall mastery</Th><Th>Exam average</Th></tr></thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr key={r.st.id}>
                    <Td className="tabular-nums">{i + 1}</Td>
                    <Td><Link href={`/teacher/students/${r.st.id}`} className="hover:underline">{displayName(r.st)}</Link></Td>
                    <Td className="tabular-nums">{formatPercent(r.overall)}</Td>
                    <Td className="tabular-nums">{formatPercent(r.examAvg)}{r.n ? <span className="text-xs text-muted"> ({r.n})</span> : null}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Learning objective performance" />
        <CardBody className="max-h-[32rem] overflow-y-auto p-0">
          <Table>
            <thead><tr><Th>LO</Th><Th>Description</Th><Th>Papers</Th><Th className="w-40">Class mastery</Th></tr></thead>
            <tbody>
              {ctx.los.filter((l) => classMastery.has(l.id)).map((l) => (
                <tr key={l.id}>
                  <Td className="text-xs font-semibold"><LoCode code={l.code} paper={l.source === "paper"} /></Td>
                  <Td className="text-xs">{l.description}</Td>
                  <Td className="text-xs">{l.papers.map((p) => `P${p}`).join(", ")}</Td>
                  <Td><div className="flex items-center gap-2"><ProgressBar value={classMastery.get(l.id)} label={l.code} /><span className="w-9 text-right text-xs tabular-nums">{formatPercent(classMastery.get(l.id))}</span></div></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
