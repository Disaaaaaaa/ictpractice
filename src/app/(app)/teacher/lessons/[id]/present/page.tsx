import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanQuestions, getSession, type LiveAnswer } from "@/lib/live";
import { blocksOf } from "@/lib/live-plan";
import { theoryBlocksSchema, type TheoryBlock } from "@/lib/theory/blocks";
import { TheoryBlockView } from "@/components/theory/theory-block";
import { Markdown } from "@/components/markdown";
import { LiveRefresh } from "@/components/live/live-refresh";
import { Presenter, type PresenterSlide } from "@/components/live/presenter";

export const metadata: Metadata = { title: "Present" };

/** One slide per theory block; a sub-heading becomes the title of the slides after it. */
function toSlides(section: string, blocks: TheoryBlock[]): PresenterSlide[] {
  const out: PresenterSlide[] = [];
  let sub: string | null = null;
  for (const b of blocks) {
    if (b.type === "heading") {
      sub = b.text;
      continue;
    }
    out.push({ kind: "theory", heading: section, sub: sub ?? section, body: <TheoryBlockView block={b} /> });
  }
  return out;
}

export default async function PresentPage({ params, searchParams }: PageProps<"/teacher/lessons/[id]/present">) {
  await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const session = await getSession(supabase, id);
  if (!session) notFound();
  const block = blocksOf(session.plan).find((b) => b.id === sp.block) ?? blocksOf(session.plan).find((b) => b.slides.length);
  if (!block) notFound();

  const { data: pack } = await supabase.from("theory_packs").select("id").eq("topic_id", session.topic_id).maybeSingle();
  const { data: sections } = await supabase.from("theory_sections").select("title, blocks, sort_order").eq("theory_pack_id", pack?.id ?? "").in("title", block.slides.length ? block.slides : [""]).order("sort_order");
  const slides: PresenterSlide[] = (sections ?? []).flatMap((s) => {
    const parsed = theoryBlocksSchema.safeParse(s.blocks);
    return toSlides(s.title as string, parsed.success ? parsed.data : []);
  });

  // together tasks: a vote slide each, with the class's answers
  if (block.together.length) {
    const questions = await getPlanQuestions(session.plan);
    const [{ data: answers }, { data: schemes }] = await Promise.all([
      supabase.from("live_answers").select("*").eq("session_id", id).eq("block_id", block.id),
      createAdminClient().from("mark_schemes").select("question_id, accepted_answers").in("question_id", block.together.map((q) => q.id)).eq("is_current", true),
    ]);
    const revealed = new Set(session.state.revealed ?? []);
    for (const pq of block.together) {
      const q = questions.get(pq.id);
      if (!q) continue;
      const rows = ((answers ?? []) as LiveAnswer[]).filter((a) => a.item === pq.id);
      const tf = q.question_type === "true_false";
      const keys = tf ? ["true", "false"] : q.options.map((o) => o.key);
      const c = ((schemes ?? []) as { question_id: string; accepted_answers: { correct?: unknown } | null }[]).find((x) => x.question_id === pq.id)?.accepted_answers?.correct;
      const correct = c === undefined ? [] : Array.isArray(c) ? c.map(String) : [String(c)];
      slides.push({
        kind: "vote",
        vote: {
          id: pq.id,
          title: q.title,
          text: <Markdown>{q.question_text}</Markdown>,
          labels: tf ? ["True", "False"] : q.options.map((o) => `${o.key}. ${o.content}`),
          counts: keys.map((k) => rows.filter((a) => String(a.answer?.selected ?? (typeof a.answer?.value === "boolean" ? a.answer.value : "")) === k).length),
          correct: keys.map((k) => correct.includes(k)),
          revealed: revealed.has(pq.id),
          answered: rows.length,
        },
      });
    }
  }

  return <Presenter sessionId={id} title={`${session.plan.title} · ${block.title}`} slides={slides} live={<LiveRefresh sessionId={id} watch={["session", "answers"]} />} />;
}
