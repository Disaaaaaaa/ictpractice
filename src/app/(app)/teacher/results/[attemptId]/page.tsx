import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDuration, formatMark, formatPercent, formatTime } from "@/lib/format";
import { paperLabel, type AnswerData, type MarkingEntry, type Paper } from "@/lib/questions/types";
import type { Attempt, GradingResult, IntegrityEvent } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";
import { Markdown } from "@/components/markdown";
import { ConfirmButton } from "@/components/action-form";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { AnswerReview } from "@/components/results/answer-review";
import { MarkReview } from "@/components/teacher/mark-review";
import { INTEGRITY_EVENT_LABEL } from "@/components/integrity-labels";
import { forceSubmitAttempt, retryGrading } from "../../actions";

export const metadata: Metadata = { title: "Review attempt" };

const REASON: Record<string, string> = {
  MANUAL_SUBMIT: "Submitted by student", TIME_EXPIRED: "Time expired", VIOLATION_LIMIT: "Violation limit reached",
  TEACHER_FORCED: "Submitted by teacher", SYSTEM: "System",
};

export default async function ReviewAttemptPage({ params }: PageProps<"/teacher/results/[attemptId]">) {
  await requireProfile(["teacher", "admin"]);
  const { attemptId } = await params;
  const supabase = await createClient();
  const { data: attempt } = await supabase
    .from("attempts")
    .select("*, exams(id, title), profiles!attempts_student_id_fkey(id, first_name, last_name, username)")
    .eq("id", attemptId)
    .maybeSingle();
  if (!attempt) notFound();
  const a = attempt as Attempt & { exams: { id: string; title: string }; profiles: { id: string; first_name: string; last_name: string; username: string } };

  const [{ data: review }, { data: results }, { data: answers }, { data: events }, { data: audit }] = await Promise.all([
    supabase.rpc("get_attempt_review", { p_attempt_id: attemptId }),
    supabase.from("grading_results").select("*").eq("attempt_id", attemptId),
    supabase.from("answers").select("question_id, answer_data, submitted_answer, time_spent_seconds, flagged").eq("attempt_id", attemptId),
    supabase.from("integrity_events").select("*").eq("attempt_id", attemptId).order("started_at"),
    supabase.from("grade_audit").select("*, grading_results!inner(attempt_id, question_id), profiles:changed_by(first_name, last_name, username)").eq("grading_results.attempt_id", attemptId).order("changed_at", { ascending: false }),
  ]);
  const r = review as { paper: Paper; marking: Record<string, MarkingEntry> | null };
  const resultBy = new Map(((results ?? []) as GradingResult[]).map((g) => [g.question_id, g]));
  const answerBy = new Map((answers ?? []).map((x) => [x.question_id as string, x]));
  const evs = (events ?? []) as IntegrityEvent[];
  const live = a.status === "IN_PROGRESS";

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Results", href: "/teacher/results" }, { label: displayName(a.profiles), href: `/teacher/students/${a.profiles.id}` }, { label: a.exams.title }]}
        title={`${displayName(a.profiles)} — ${a.exams.title}`}
        description={`Started ${formatDate(a.started_at)}${a.submitted_at ? ` · ${REASON[a.submission_reason ?? "MANUAL_SUBMIT"]} ${formatDate(a.submitted_at)}` : ""}`}
        actions={
          <>
            <AttemptStatusBadge status={a.status} />
            {live && <ConfirmButton action={forceSubmitAttempt} fields={{ attempt_id: a.id }} label="Force submit" variant="danger" size="md" confirm="Submit this exam now?" />}
            {!live && a.grading_status !== "COMPLETE" && <ConfirmButton action={retryGrading} fields={{ attempt_id: a.id }} label="Retry marking" size="md" />}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><p className="text-sm text-muted">Score</p><p className="text-2xl font-semibold tabular-nums">{formatMark(a.score)} / {formatMark(a.max_score)}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Percentage</p><p className="text-2xl font-semibold tabular-nums">{formatPercent(a.percentage)}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Time spent</p><p className="text-2xl font-semibold">{a.submitted_at ? formatDuration((new Date(a.submitted_at).getTime() - new Date(a.started_at).getTime()) / 1000) : "—"}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Violations</p><p className="text-2xl font-semibold tabular-nums">{a.violation_count}</p></Card>
      </div>

      {a.grading_status === "FAILED" && <Alert tone="warning" className="mt-4">Some answers could not be marked automatically yet. They will be retried; you can also mark them yourself.</Alert>}

      <Card className="mt-6">
        <CardHeader title="Integrity log" description="Signals, not proof: a blur can be a notification or a second monitor." />
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Time</Th><Th>Event</Th><Th>Returned</Th><Th>Duration</Th><Th>Counted</Th></tr></thead>
            <tbody>
              {evs.map((e) => (
                <tr key={e.id}>
                  <Td className="tabular-nums">{formatTime(e.started_at)}</Td>
                  <Td>{INTEGRITY_EVENT_LABEL[e.event_type]}</Td>
                  <Td className="tabular-nums">{e.ended_at ? formatTime(e.ended_at) : "—"}</Td>
                  <Td>{formatDuration(e.duration_seconds)}</Td>
                  <Td>{e.counted ? <Badge tone="danger">violation</Badge> : <Badge>signal</Badge>}</Td>
                </tr>
              ))}
              {evs.length === 0 && <tr><Td colSpan={5} className="py-4 text-center text-muted">No integrity events.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Answers</h2>
      <div className="space-y-4">
        {r.paper.questions.map((q, i, all) => {
          const firstOfGroup = Boolean(q.group_id) && all[i - 1]?.group_id !== q.group_id;
          const g = resultBy.get(q.id);
          const m = r.marking?.[q.id];
          const ans = answerBy.get(q.id);
          return (
            <Card key={q.id} className={g?.needs_review ? "border-warning" : undefined}>
              <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
                <h3 className="mr-auto font-semibold">Question {paperLabel(q)} · {q.title}</h3>
                {g && <Badge tone={g.grading_method === "AI" ? "info" : "neutral"}>{g.grading_method}</Badge>}
                {g?.confidence != null && <Badge tone={Number(g.confidence) < 0.8 ? "warning" : "neutral"}>confidence {Math.round(Number(g.confidence) * 100)}%</Badge>}
                {g?.needs_review && <Badge tone="warning">Needs review</Badge>}
                {ans?.flagged && <Badge>flagged by student</Badge>}
                <Badge tone="primary">{formatMark(g?.final_mark)} / {q.marks}</Badge>
              </div>
              <CardBody className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <AnswerReview showStem={firstOfGroup} question={q} answer={((ans?.submitted_answer ?? ans?.answer_data) ?? null) as AnswerData | null} />
                  <p className="text-xs text-muted">Time on question: {formatDuration(ans?.time_spent_seconds ?? 0)}</p>
                </div>
                <div className="space-y-4">
                  {g ? (
                    <>
                      {g.original_ai_mark != null && g.teacher_override_mark != null && (
                        <p className="text-sm">AI: {formatMark(g.original_ai_mark)}/{q.marks} → Teacher: <strong>{formatMark(g.teacher_override_mark)}/{q.marks}</strong></p>
                      )}
                      {g.marking_points.length > 0 && (
                        <ul className="space-y-1 text-sm">
                          {g.marking_points.map((p, i) => (
                            <li key={i} className={p.awarded ? "text-success" : "text-muted"}>{p.awarded ? "✓" : "✗"} {p.criterion}{p.comment ? ` — ${p.comment}` : ""}</li>
                          ))}
                        </ul>
                      )}
                      {g.feedback && <p className="text-sm"><span className="font-semibold">Feedback:</span> {g.feedback}</p>}
                      {g.teacher_feedback && <p className="text-sm"><span className="font-semibold">Teacher feedback:</span> {g.teacher_feedback}</p>}
                      {g.error && <p className="text-xs text-warning">{g.error}</p>}
                      <MarkReview resultId={g.id} attemptId={a.id} max={q.marks} awarded={g.final_mark == null ? null : Number(g.final_mark)} needsReview={g.needs_review} teacherFeedback={g.teacher_feedback} />
                    </>
                  ) : (
                    <p className="text-sm text-muted">{live ? "Exam in progress." : "Not marked yet."}</p>
                  )}
                  {m && (
                    <details className="rounded-lg border border-border p-3 text-sm">
                      <summary className="cursor-pointer font-semibold">Mark scheme (v{m.mark_scheme_version})</summary>
                      <div className="mt-2 space-y-2">
                        {m.mark_scheme && <Markdown>{m.mark_scheme}</Markdown>}
                        {m.model_answer && <><p className="font-semibold">Model answer</p><Markdown>{m.model_answer}</Markdown></>}
                      </div>
                    </details>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {(audit ?? []).length > 0 && (
        <Card className="mt-6">
          <CardHeader title="Mark change history" />
          <CardBody className="p-0">
            <Table>
              <thead><tr><Th>When</Th><Th>Question</Th><Th>Action</Th><Th>AI mark</Th><Th>Before → after</Th><Th>By</Th><Th>Reason</Th></tr></thead>
              <tbody>
                {(audit ?? []).map((x) => {
                  const pq = r.paper.questions.find((q) => q.id === (x.grading_results as { question_id: string }).question_id);
                  const qn = pq ? paperLabel(pq) : "?";
                  const by = x.profiles as { first_name: string; last_name: string; username: string } | null;
                  return (
                    <tr key={x.id}>
                      <Td className="text-xs">{formatDate(x.changed_at)}</Td>
                      <Td>Q{qn}</Td>
                      <Td className="capitalize">{String(x.action).replace("_", " ")}</Td>
                      <Td className="tabular-nums">{formatMark(x.original_ai_mark)}</Td>
                      <Td className="tabular-nums">{formatMark(x.previous_mark)} → {formatMark(x.final_mark)}</Td>
                      <Td>{by ? displayName(by) : "—"}</Td>
                      <Td className="text-xs">{x.reason ?? ""}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
      <p className="mt-6 text-xs text-muted">
        Student view: <Link href={`/results/${a.id}`} className="underline">result page</Link>
      </p>
    </>
  );
}
