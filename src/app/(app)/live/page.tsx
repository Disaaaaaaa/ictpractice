import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveSessionForStudent, getPlanQuestions, type LiveAnswer } from "@/lib/live";
import { blocksOf, groupOf } from "@/lib/live-plan";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { LiveRefresh } from "@/components/live/live-refresh";
import { AutoRefresh, BoardCard, GoToLaptop, Heartbeat, HostBadge, LessonStage, LiveQuestion, PollCard } from "@/components/live/student-live";

export const metadata: Metadata = { title: "Lesson" };

const MODE = { class: "Whole class", individual: "On your own", pair: "In pairs", group: "In groups" } as const;

export default async function LivePage() {
  const profile = await requireProfile();
  if (profile.role !== "student") redirect("/teacher/lessons");
  const supabase = await createClient();
  const session = await getActiveSessionForStudent(supabase, profile.id);
  if (!session) {
    return (
      <>
        <PageHeader title="Lesson" description="When your teacher starts a lesson, its tasks appear here." />
        <EmptyState title="No lesson right now">This page updates by itself when the lesson starts.</EmptyState>
        <AutoRefresh seconds={10} />
      </>
    );
  }
  const state = session.state;
  const open = new Set(state.open ?? []);
  const all = blocksOf(session.plan);
  const blocks = all.filter((b) => open.has(b.id)).sort((a, b) => (a.id === state.current ? -1 : b.id === state.current ? 1 : all.indexOf(a) - all.indexOf(b)));

  const admin = createAdminClient();
  const [{ data: topic }, questions, { data: mine }] = await Promise.all([
    supabase.from("topics").select("title").eq("id", session.topic_id).single(),
    getPlanQuestions(session.plan),
    supabase.from("live_answers").select("*").eq("session_id", session.id).contains("members", [profile.id]),
  ]);
  const answers = (mine ?? []) as LiveAnswer[];
  // names of the members of the student's groups
  const memberIds = [...new Set(blocks.flatMap((b) => groupOf(state, b.id, profile.id)?.members ?? []))];
  const { data: people } = memberIds.length ? await admin.from("profiles").select("id, first_name, last_name, username").in("id", memberIds) : { data: [] };
  const name = (id: string) => {
    const p = (people ?? []).find((x) => x.id === id);
    return id === profile.id ? "you" : p ? displayName(p) : "a classmate";
  };
  const revealed = (state.revealed ?? []).filter((id) => questions.has(id));
  const { data: schemes } = revealed.length ? await admin.from("mark_schemes").select("question_id, accepted_answers").in("question_id", revealed).eq("is_current", true) : { data: [] };
  const correctOf = new Map(
    ((schemes ?? []) as { question_id: string; accepted_answers: { correct?: unknown } | null }[]).map((s) => {
      const c = s.accepted_answers?.correct;
      return [s.question_id, c === undefined ? undefined : Array.isArray(c) ? c.map(String) : [String(c)]];
    }),
  );

  return (
    <LessonStage sessionId={session.id}>
      <Heartbeat sessionId={session.id} />
      <PageHeader
        title={<span className="flex items-center gap-2">{topic?.title} · Lesson {session.lesson_no} <LiveRefresh sessionId={session.id} watch={["session", "answers"]} /></span>}
        description={`${session.plan.title}. Tasks open here as your teacher goes through the lesson.`}
      />
      {blocks.length === 0 ? (
        <EmptyState title="Waiting for your teacher">Look at the board — the first task will appear here.</EmptyState>
      ) : (
        <div className="space-y-6">
          {blocks.map((b) => {
            const g = b.groupSize > 1 ? groupOf(state, b.id, profile.id) : null;
            const isHost = !g || g.host === profile.id;
            const scenario = g?.scenario != null ? b.scenarios[g.scenario] : null;
            const list = [...b.together, ...b.tasks].map((pq) => questions.get(pq.id)).filter((q): q is NonNullable<typeof q> => Boolean(q));
            return (
              <Card key={b.id} className={b.id === state.current ? "border-primary ring-1 ring-primary" : undefined}>
                <CardHeader
                  title={<span className="flex flex-wrap items-center gap-2">{b.title} <Badge tone={b.mode === "class" ? "neutral" : "info"}>{MODE[b.mode]}</Badge>{b.id === state.current && <Badge tone="primary">now</Badge>}</span>}
                  description={b.learners}
                />
                <CardBody className="space-y-4 pt-0">
                  {b.kind === "slides" && <BoardCard text="Look at the board and follow your teacher." />}
                  {b.poll && (
                    <PollCard
                      sessionId={session.id}
                      blockId={b.id}
                      question={b.poll.question}
                      options={b.poll.options}
                      mine={(() => {
                        const v = answers.find((a) => a.block_id === b.id && a.item === "poll" && a.student_id === profile.id)?.answer?.selected;
                        return v == null ? null : Number(v);
                      })()}
                    />
                  )}
                  {b.groupSize > 1 && !g && <p className="text-sm text-muted">Your teacher is forming the groups…</p>}
                  {g && !isHost && <GoToLaptop host={name(g.host)} members={g.members.map(name)} />}
                  {g && isHost && <HostBadge members={g.members.map(name)} />}
                  {scenario && (
                    <div className="rounded-lg border border-border bg-surface-2 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your client</p>
                      <p className="text-lg font-semibold">{scenario.client}</p>
                      <p className="text-sm">{scenario.details}</p>
                    </div>
                  )}
                  {isHost &&
                    list.map((q) => {
                      const prev = answers.find((a) => a.block_id === b.id && a.item === q.id);
                      return (
                        <LiveQuestion
                          key={q.id}
                          sessionId={session.id}
                          blockId={b.id}
                          question={{ id: q.id, title: q.title, question_text: q.question_text, question_type: q.question_type, content: q.content, options: q.options, marks: q.marks }}
                          previous={prev ? { answer: prev.answer, awarded: prev.awarded == null ? null : Number(prev.awarded), max: prev.max_mark == null ? null : Number(prev.max_mark), needsReview: prev.needs_review, feedback: (prev.answer as { teacher_feedback?: string | null }).teacher_feedback ?? null } : null}
                          correctKeys={correctOf.get(q.id)}
                          canAnswer
                        />
                      );
                    })}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </LessonStage>
  );
}
