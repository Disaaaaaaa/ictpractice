import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveSessionForStudent, getPlanQuestions, type LiveAnswer } from "@/lib/live";
import { blocksOf, groupOf, parseSlide, type LiveBlock } from "@/lib/live-plan";
import { theoryBlocksSchema, type TheoryBlock } from "@/lib/theory/blocks";
import { TheoryBlockView } from "@/components/theory/theory-block";
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
        <AutoRefresh seconds={60} />
      </>
    );
  }
  const state = session.state;
  const open = new Set(state.open ?? []);
  const all = blocksOf(session.plan);
  const slide = parseSlide(state.slide);
  // the block on the teacher's screen is shown on top; the other open blocks below it
  const onBoard = slide && slide.kind !== "title" ? slide.blockId : null;
  const blocks = all.filter((b) => open.has(b.id) && b.id !== onBoard).sort((a, b) => all.indexOf(b) - all.indexOf(a));
  const boardBlock = onBoard ? (all.find((b) => b.id === onBoard) ?? null) : null;

  const admin = createAdminClient();
  const [{ data: topic }, questions, { data: mine }] = await Promise.all([
    supabase.from("topics").select("title").eq("id", session.topic_id).single(),
    getPlanQuestions(session.plan),
    supabase.from("live_answers").select("*").eq("session_id", session.id).contains("members", [profile.id]),
  ]);
  const answers = (mine ?? []) as LiveAnswer[];
  // names of the members of the student's groups
  const memberIds = [...new Set([...blocks, ...(boardBlock ? [boardBlock] : [])].flatMap((b) => groupOf(state, b.id, profile.id)?.members ?? []))];
  const { data: people } = memberIds.length ? await admin.from("profiles").select("id, first_name, last_name, username").in("id", memberIds) : { data: [] };
  const name = (id: string) => {
    const p = (people ?? []).find((x) => x.id === id);
    return id === profile.id ? "you" : p ? displayName(p) : "a classmate";
  };
  // the theory slide on the board
  let theory: { section: string; sub: string; block: TheoryBlock } | null = null;
  if (slide?.kind === "theory") {
    const { data: pack } = await supabase.from("theory_packs").select("id").eq("topic_id", session.topic_id).maybeSingle();
    const { data: sec } = pack ? await supabase.from("theory_sections").select("blocks").eq("theory_pack_id", pack.id).eq("title", slide.section).maybeSingle() : { data: null };
    const parsed = theoryBlocksSchema.safeParse(sec?.blocks);
    const list = parsed.success ? parsed.data : [];
    const block = list[slide.index];
    if (block) {
      const head = list.slice(0, slide.index).filter((b) => b.type === "heading").pop();
      theory = { section: slide.section, sub: head && head.type === "heading" ? head.text : slide.section, block };
    }
  }
  const revealed = (state.revealed ?? []).filter((id) => questions.has(id));
  const { data: schemes } = revealed.length ? await admin.from("mark_schemes").select("question_id, accepted_answers").in("question_id", revealed).eq("is_current", true) : { data: [] };
  const correctOf = new Map(
    ((schemes ?? []) as { question_id: string; accepted_answers: { correct?: unknown } | null }[]).map((s) => {
      const c = s.accepted_answers?.correct;
      return [s.question_id, c === undefined ? undefined : Array.isArray(c) ? c.map(String) : [String(c)]];
    }),
  );

  const renderBlock = (b: LiveBlock, board = false, only: string | null = null) => {
            const g = b.groupSize > 1 ? groupOf(state, b.id, profile.id) : null;
            const isHost = !g || g.host === profile.id;
            const scenario = g?.scenario != null ? b.scenarios[g.scenario] : null;
            const list = [...b.together, ...b.tasks].map((pq) => questions.get(pq.id)).filter((q): q is NonNullable<typeof q> => Boolean(q));
            return (
              <Card key={b.id} className={board ? "border-primary ring-1 ring-primary" : undefined}>
                <CardHeader
                  title={<span className="flex flex-wrap items-center gap-2">{b.title} <Badge tone={b.mode === "class" ? "neutral" : "info"}>{MODE[b.mode]}</Badge>{board && <Badge tone="primary">on the board</Badge>}</span>}
                  description={b.learners}
                />
                <CardBody className="space-y-4 pt-0">
                  {b.kind === "slides" && !only && <BoardCard text="Look at the board and follow your teacher." />}
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
                    list.filter((q) => !only || q.id === only).map((q) => {
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
  };

  // what the teacher is showing now
  let now: React.ReactNode = null;
  if (slide?.kind === "title") {
    const o = session.plan.objectives;
    now = (
      <Card className="border-primary ring-1 ring-primary">
        <CardHeader title={session.plan.title} description="On the board now" />
        {o && (
          <CardBody className="space-y-1 pt-0 text-sm">
            <p><b>All</b> will be able to {o.all}.</p>
            <p><b>Most</b> will be able to {o.most}.</p>
            <p><b>Some</b> will be able to {o.some}.</p>
          </CardBody>
        )}
      </Card>
    );
  } else if (slide?.kind === "theory" && theory) {
    now = (
      <Card className="border-primary ring-1 ring-primary">
        <CardHeader title={theory.sub} description={`${theory.section} · on the board now`} />
        <CardBody className="space-y-4 pt-0 text-lg"><TheoryBlockView block={theory.block} /></CardBody>
      </Card>
    );
  } else if (boardBlock && open.has(boardBlock.id)) {
    // a question done together: only that question; a task question: the whole task
    const together = slide?.kind === "question" && boardBlock.together.some((q) => q.id === slide.questionId) ? slide.questionId : null;
    now = renderBlock(boardBlock, true, together);
  }

  return (
    <LessonStage sessionId={session.id}>
      <Heartbeat sessionId={session.id} />
      <PageHeader
        title={<span className="flex items-center gap-2">{topic?.title} · Lesson {session.lesson_no} <LiveRefresh sessionId={session.id} watch={["session", "answers"]} wait={400} /></span>}
        description={`${session.plan.title}. This page follows your teacher's slides.`}
      />
      {now && <div className="mb-6">{now}</div>}
      {now && blocks.length > 0 && <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Earlier tasks</h2>}
      {!now && blocks.length === 0 ? (
        <EmptyState title="Waiting for your teacher">Look at the board — the first task will appear here.</EmptyState>
      ) : (
        <div className="space-y-6">
          {blocks.map((b) => renderBlock(b))}
        </div>
      )}
    </LessonStage>
  );
}
