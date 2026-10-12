import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { getClassRoster, getTeacherClasses, getVisibleStudents } from "@/lib/teacher-data";
import { formatDate, formatMark, formatPercent, nowMs, relativeTime } from "@/lib/format";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { ProgressBar } from "@/components/ui/progress";
import { Table, Td, Th } from "@/components/ui/table";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { AnalyticsTabs } from "@/components/teacher/analytics-tabs";
import { AutoRefresh } from "@/components/teacher/auto-refresh";

export const metadata: Metadata = { title: "Practice monitor" };

// See supabase/migrations/20261012000010_practice_monitor_topic.sql
type MonitorRow = {
  student_id: string;
  question_id: string;
  state: "typing" | "submitted" | "checked";
  last_at: string;
  awarded_mark: number | null;
  max_mark: number | null;
  question_title: string;
  part_label: string | null;
  group_title: string | null;
  question_type: QuestionType;
  topic_id: string | null;
  topic_slug: string | null;
  topic_title: string | null;
  question_no: number | null;
  total: number;
  done: number;
};

const NOW_MS = 5 * 60_000;
const HOUR_MS = 60 * 60_000;

export default async function PracticeMonitorPage({ searchParams }: PageProps<"/teacher/analytics/practice">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const cls = typeof sp.class === "string" ? sp.class : "";
  const show = sp.show === "active" ? "active" : "all";
  const topicParam = typeof sp.topic === "string" && /^[0-9a-f-]{36}$/i.test(sp.topic) ? sp.topic : "";
  const supabase = await createClient();
  const version = await getActiveVersion();
  const [classes, { data: topicRows }] = await Promise.all([
    getTeacherClasses(supabase, profile),
    supabase.from("topics").select("id, slug, title").eq("curriculum_version_id", version?.id ?? "").is("archived_at", null).order("sort_order"),
  ]);
  const topics = (topicRows ?? []) as { id: string; slug: string; title: string }[];
  // With a topic chosen, every row is about that topic: the student's last question in it and their progress through it.
  const topic = topics.find((t) => t.id === topicParam) ?? null;
  const [students, { data }] = await Promise.all([
    cls ? getClassRoster(supabase, cls).then((r) => r?.students ?? []) : getVisibleStudents(supabase),
    supabase.rpc("practice_monitor", { p_class_id: cls || null, p_topic_id: topic?.id ?? null }),
  ]);
  const monitorRows = (data ?? []) as MonitorRow[];
  const byStudent = new Map(monitorRows.map((r) => [r.student_id, r]));
  // Size of the topic's practice set, also for students who have not started it.
  let topicTotal = monitorRows[0]?.total ?? 0;
  if (topic && !monitorRows.length) {
    const { count } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("topic_id", topic.id).eq("status", "published").eq("practice_enabled", true).is("archived_at", null).neq("question_type", "structured");
    topicTotal = count ?? 0;
  }
  const now = nowMs();
  const age = (r: MonitorRow | undefined) => (r ? now - new Date(r.last_at).getTime() : Infinity);

  const rows = students
    .map((st) => ({ st, r: byStudent.get(st.id) }))
    .sort((a, b) => age(a.r) - age(b.r) || displayName(a.st).localeCompare(displayName(b.st)));
  const working = rows.filter((x) => age(x.r) <= NOW_MS).length;
  const lastHour = rows.filter((x) => age(x.r) <= HOUR_MS).length;
  const never = rows.filter((x) => !x.r).length;
  const visible = show === "active" ? rows.filter((x) => age(x.r) <= HOUR_MS) : rows;
  const average = topic && topicTotal > 0 && rows.length
    ? rows.reduce((sum, x) => sum + Math.min(100, ((x.r?.done ?? 0) / topicTotal) * 100), 0) / rows.length
    : null;

  return (
    <>
      <PageHeader
        title="Analytics"
        description={topic
          ? `How far each student is in the practice set of "${topic.title}": their last question in this topic and the share of its practice questions they have completed.`
          : "Which practice question each student is working on right now, and how much of that topic's practice set they have completed."}
        actions={<AutoRefresh seconds={15} />}
      />
      <AnalyticsTabs />

      {students.length === 0 ? (
        <EmptyState title="No students yet">Add students to a class to see what they are practising.</EmptyState>
      ) : (
        <>
          <Card>
            <CardBody>
              <form className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Select name="class" defaultValue={cls} aria-label="Class">
                  <option value="">All my classes</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Select name="topic" defaultValue={topic?.id ?? ""} aria-label="Topic">
                  <option value="">Any topic (latest activity)</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.slug.startsWith("g11-") ? "G11" : t.slug.startsWith("g12-") ? "G12" : "exam only"})
                    </option>
                  ))}
                </Select>
                <Select name="show" defaultValue={show} aria-label="Students shown">
                  <option value="all">All students</option>
                  <option value="active">Active in the last hour</option>
                </Select>
                <Button type="submit">Apply</Button>
              </form>
            </CardBody>
          </Card>

          <div className={topic ? "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "mt-6 grid gap-4 sm:grid-cols-3"}>
            <Stat label={topic ? "Working on this topic now" : "Working now"} value={working} sub="Active in the last 5 minutes" />
            <Stat label="Active in the last hour" value={lastHour} sub={`of ${rows.length} students`} />
            <Stat label={topic ? "Not started this topic" : "No practice yet"} value={never} />
            {topic && <Stat label="Average completed" value={formatPercent(average)} sub={`${topicTotal} practice questions in the topic`} />}
          </div>

          <Card className="mt-6">
            <CardHeader
              title={topic ? `Practice in progress — ${topic.title}` : "Practice in progress"}
              description="Completed = practice questions of the topic the student has answered and checked at least once, out of all practice questions in that topic. It is not a score."
            />
            <CardBody className="p-0">
              <Table>
                <thead>
                  <tr><Th>Student</Th><Th>Activity</Th><Th>Topic</Th><Th>Current question</Th><Th className="w-56">Practice completed</Th></tr>
                </thead>
                <tbody>
                  {visible.map(({ st, r }) => {
                    const ms = age(r);
                    const percent = r && r.total > 0 ? Math.min(100, (r.done / r.total) * 100) : null;
                    return (
                      <tr key={st.id}>
                        <Td className="whitespace-nowrap">
                          <Link href={`/teacher/students/${st.id}`} className="font-medium hover:underline">{displayName(st)}</Link>
                        </Td>
                        <Td className="whitespace-nowrap">
                          {!r ? (
                            <span className="text-muted">{topic ? "Not started" : "No practice yet"}</span>
                          ) : ms <= NOW_MS ? (
                            <Badge tone="success"><span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden /> Working now</Badge>
                          ) : (
                            <span className="text-muted" title={formatDate(r.last_at)}>{relativeTime(r.last_at)}</span>
                          )}
                        </Td>
                        <Td>
                          {r?.topic_slug ? (
                            <Link href={`/learn/${r.topic_slug}/practice`} className="hover:underline">{r.topic_title}</Link>
                          ) : topic ? (
                            <span className="text-muted">{topic.title}</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </Td>
                        <Td>
                          {r ? (
                            <>
                              <div>
                                {r.question_no != null && <span className="mr-2 font-semibold tabular-nums">Q{r.question_no}</span>}
                                <Link href={`/teacher/questions/${r.question_id}`} className="hover:underline">
                                  {r.group_title ? `${r.group_title} ${r.part_label ?? ""} · ` : ""}{r.question_title}
                                </Link>
                              </div>
                              <p className="mt-0.5 text-xs text-muted">
                                {QUESTION_TYPE_LABELS[r.question_type] ?? r.question_type} ·{" "}
                                {r.state === "typing"
                                  ? "writing an answer"
                                  : r.state === "submitted"
                                    ? "answered — waiting for review"
                                    : `checked: ${formatMark(r.awarded_mark)} / ${formatMark(r.max_mark)}`}
                              </p>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </Td>
                        <Td>
                          {r && percent != null ? (
                            <div className="space-y-1">
                              <div className="flex justify-between gap-2 text-xs tabular-nums">
                                <span>{r.done} of {r.total} questions</span>
                                <span className="font-semibold">{Math.round(percent)}%</span>
                              </div>
                              <ProgressBar value={percent} tone={percent >= 100 ? "success" : "primary"} label={`${displayName(st)}: practice completed`} />
                            </div>
                          ) : topic && topicTotal > 0 ? (
                            <div className="space-y-1">
                              <div className="flex justify-between gap-2 text-xs tabular-nums text-muted">
                                <span>0 of {topicTotal} questions</span>
                                <span className="font-semibold">0%</span>
                              </div>
                              <ProgressBar value={0} tone="primary" label={`${displayName(st)}: practice completed`} />
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                  {visible.length === 0 && (
                    <tr><Td colSpan={5} className="py-6 text-center text-muted">{topic ? "Nobody has practised this topic in the last hour." : "Nobody has practised in the last hour."}</Td></tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
