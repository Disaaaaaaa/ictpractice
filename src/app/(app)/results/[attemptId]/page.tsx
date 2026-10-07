import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Hourglass, XCircle } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDuration, formatMark, formatPercent } from "@/lib/format";
import { breakdown } from "@/lib/breakdown";
import { paperLabel, type AnswerData, type MarkingEntry, type Paper } from "@/lib/questions/types";
import type { Attempt, GradingResult } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { ButtonLink } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { GradingPoller } from "@/components/results/grading-poller";
import { AnswerReview } from "@/components/results/answer-review";

export const metadata: Metadata = { title: "Exam result" };

const REASON: Record<string, string> = {
  MANUAL_SUBMIT: "Submitted",
  TIME_EXPIRED: "Submitted automatically when time ran out",
  VIOLATION_LIMIT: "Submitted automatically after reaching the violation limit",
  TEACHER_FORCED: "Submitted by your teacher",
  SYSTEM: "Submitted by the system",
};

export default async function ResultPage({ params, searchParams }: PageProps<"/results/[attemptId]">) {
  const profile = await requireProfile();
  const { attemptId } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: attempt } = await supabase
    .from("attempts")
    .select("*, exams(id, title, kind, year, topic_id, paper_components(title), topics(slug))")
    .eq("id", attemptId)
    .maybeSingle();
  if (!attempt) notFound();
  const a = attempt as Attempt & { exams: { id: string; title: string; kind: string; year: number | null; paper_components: { title: string } | null; topics: { slug: string } | null } };

  const header = (
    <PageHeader
      breadcrumbs={[{ label: a.exams.kind === "mock" ? "Mock Exams" : "Results", href: a.exams.kind === "mock" ? "/mock-exams" : "/progress" }]}
      title={a.exams.title}
      description={`${a.exams.paper_components?.title ? `${a.exams.paper_components.title} · ` : ""}${formatDate(a.submitted_at ?? a.started_at)}`}
    />
  );

  if (a.status === "IN_PROGRESS") {
    return (
      <>
        {header}
        <Alert tone="info" title="This exam is still in progress">
          <ButtonLink href={`/attempt/${a.id}`} className="mt-2">Return to exam</ButtonLink>
        </Alert>
      </>
    );
  }

  const { data: review } = await supabase.rpc("get_attempt_review", { p_attempt_id: attemptId });
  const r = review as { results_visible: boolean; mark_scheme_visible: boolean; paper: Paper; marking: Record<string, MarkingEntry> | null };
  const isOwner = a.student_id === profile.id;
  const reasonNote = sp.reason === "violations" || a.submission_reason === "VIOLATION_LIMIT";

  if (a.status === "SUBMITTED" || a.status === "REVIEW_REQUIRED" || !r.results_visible) {
    const marking = a.status === "SUBMITTED";
    return (
      <>
        {header}
        {reasonNote && <Alert tone="danger" className="mb-4">Your exam was submitted automatically because the violation limit was reached.</Alert>}
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
            <Hourglass className="h-10 w-10 text-primary" />
            <h2 className="text-lg font-semibold">
              {marking ? "Your exam has been submitted and is being marked" : a.status === "REVIEW_REQUIRED" ? "Awaiting teacher review" : "Results not released yet"}
            </h2>
            <p className="max-w-md text-sm text-muted">
              {marking
                ? "Objective questions are marked instantly; written answers may take a little longer. This page updates automatically."
                : a.status === "REVIEW_REQUIRED"
                  ? "Some answers need your teacher to confirm the mark. You will be notified when results are available."
                  : a.results_release_at
                    ? `Your teacher will release results on ${formatDate(a.results_release_at)}.`
                    : "Your teacher has chosen not to show results for this exam yet."}
            </p>
            <p className="text-xs text-muted">{REASON[a.submission_reason ?? "MANUAL_SUBMIT"]} · {formatDate(a.submitted_at)}</p>
          </CardBody>
        </Card>
        {marking && <GradingPoller attemptId={a.id} kick={isOwner && a.grading_status !== "IN_PROGRESS"} />}
      </>
    );
  }

  const [{ data: results }, { data: answers }] = await Promise.all([
    supabase.from("grading_results").select("*").eq("attempt_id", attemptId),
    supabase.from("answers").select("question_id, submitted_answer, time_spent_seconds").eq("attempt_id", attemptId),
  ]);
  const resultBy = new Map(((results ?? []) as GradingResult[]).map((g) => [g.question_id, g]));
  const answerBy = new Map((answers ?? []).map((x) => [x.question_id as string, x]));
  const { topics, objectives } = breakdown(
    r.paper.questions,
    r.paper.questions.map((q) => ({ questionId: q.id, final: resultBy.get(q.id)?.final_mark ?? 0, max: q.marks })),
  );
  const timeSpent = a.submitted_at ? (new Date(a.submitted_at).getTime() - new Date(a.started_at).getTime()) / 1000 : null;

  return (
    <>
      {header}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="space-y-4 p-6 text-center">
            <p className="text-sm font-medium text-muted">Exam completed</p>
            <p className="text-4xl font-bold tabular-nums">
              {formatMark(a.score)} <span className="text-2xl font-medium text-muted">/ {formatMark(a.max_score)}</span>
            </p>
            <p className="text-2xl font-semibold text-primary tabular-nums">{formatPercent(a.percentage)}</p>
            <ProgressBar value={a.percentage} label="Score" />
            <dl className="grid grid-cols-2 gap-2 text-left text-sm">
              <dt className="text-muted">Date</dt>
              <dd>{formatDate(a.submitted_at, false)}</dd>
              <dt className="text-muted">Time spent</dt>
              <dd className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(timeSpent)}</dd>
              {a.exams.paper_components && (
                <>
                  <dt className="text-muted">Paper</dt>
                  <dd>{a.exams.paper_components.title}</dd>
                </>
              )}
              <dt className="text-muted">Submission</dt>
              <dd>{REASON[a.submission_reason ?? "MANUAL_SUBMIT"]}</dd>
            </dl>
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Breakdown" />
          <CardBody className="grid gap-6 md:grid-cols-2">
            <section>
              <h3 className="mb-3 text-sm font-semibold">By topic</h3>
              <ul className="space-y-3">
                {topics.map((t) => (
                  <li key={t.key} className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="truncate">{t.label}</span>
                      <span className="shrink-0 tabular-nums text-muted">{formatMark(t.awarded)}/{t.max}</span>
                    </div>
                    <ProgressBar value={t.percent} label={t.label} />
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold">By learning objective</h3>
              <ul className="space-y-3">
                {objectives.map((o) => (
                  <li key={o.key} className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="font-mono text-xs">{o.label}</span>
                      <span className="tabular-nums text-muted">{formatPercent(o.percent)}</span>
                    </div>
                    <ProgressBar value={o.percent} label={o.label} />
                  </li>
                ))}
              </ul>
            </section>
          </CardBody>
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Questions and feedback</h2>
      <div className="space-y-4">
        {r.paper.questions.map((q, i, all) => {
          const firstOfGroup = Boolean(q.group_id) && all[i - 1]?.group_id !== q.group_id;
          const g = resultBy.get(q.id);
          const m = r.marking?.[q.id];
          const final = g?.final_mark;
          const full = final != null && Number(final) === q.marks;
          const correctKeys = m && r.mark_scheme_visible ? [m.accepted_answers.correct].flat().filter((x): x is string => typeof x === "string") : undefined;
          return (
            <Card key={q.id}>
              <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
                <h3 className="mr-auto font-semibold">Question {paperLabel(q)}</h3>
                {q.objectives.map((o) => (
                  <Badge key={o.id}>{o.code}</Badge>
                ))}
                <Badge tone={full ? "success" : Number(final ?? 0) > 0 ? "warning" : "danger"}>
                  {full ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {formatMark(final)} / {q.marks}
                </Badge>
              </div>
              <CardBody className="space-y-4">
                <AnswerReview showStem={firstOfGroup} question={q} answer={(answerBy.get(q.id)?.submitted_answer ?? null) as AnswerData | null} correctKeys={correctKeys} />
                {(g?.feedback || g?.teacher_feedback) && (
                  <div className="space-y-2 rounded-lg bg-surface-2 p-4 text-sm">
                    {g?.feedback && <p><span className="font-semibold">Feedback: </span>{g.feedback}</p>}
                    {g?.teacher_feedback && <p><span className="font-semibold">Teacher: </span>{g.teacher_feedback}</p>}
                  </div>
                )}
                {m && r.mark_scheme_visible && (
                  <details className="rounded-lg border border-border p-4 text-sm">
                    <summary className="cursor-pointer font-semibold">Mark scheme{m.model_answer ? " and model answer" : ""}</summary>
                    <div className="mt-3 space-y-3">
                      {m.mark_scheme && <Markdown>{m.mark_scheme}</Markdown>}
                      {m.model_answer && (
                        <div>
                          <p className="font-semibold">Model answer</p>
                          <Markdown>{m.model_answer}</Markdown>
                        </div>
                      )}
                      {m.explanation && <Markdown className="text-muted">{m.explanation}</Markdown>}
                    </div>
                  </details>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
