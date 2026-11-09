import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanQuestions, getSession, minutesAgo, type LiveAnswer } from "@/lib/live";
import { theoryBlocksSchema, type TheoryBlock } from "@/lib/theory/blocks";
import { TheoryBlockView } from "@/components/theory/theory-block";
import { Markdown } from "@/components/markdown";
import { LiveRefresh } from "@/components/live/live-refresh";
import { LessonPresenter, type Slide, type SlideText } from "@/components/live/lesson-presenter";

export const metadata: Metadata = { title: "Lesson" };

const MODE = { class: "Whole class", individual: "Individual", pair: "Pairs (random)", group: "Groups (random)" } as const;

/** One slide per theory block; a sub-heading becomes the title of the slides after it. */
function theorySlides(blockId: string, section: string, blocks: TheoryBlock[]): Slide[] {
  const out: Slide[] = [];
  let sub = section;
  blocks.forEach((b, k) => {
    if (b.type === "heading") {
      sub = b.text;
      return;
    }
    out.push({ kind: "theory", blockId, heading: section, sub, body: <TheoryBlockView key={`${blockId}-${section}-${k}`} block={b} /> });
  });
  return out;
}

/** A written answer as lines of text, for the teacher's slide. */
function answerLines(a: LiveAnswer, fields: { key: string; label: string }[] | undefined): string[] {
  const x = a.answer ?? {};
  if (x.fields) return Object.entries(x.fields).map(([k, v]) => `${fields?.find((f) => f.key === k)?.label ?? k}: ${v}`);
  if (typeof x.text === "string") return [x.text];
  if (Array.isArray(x.blanks)) return [x.blanks.map((b, i) => `(${i + 1}) ${b}`).join("   ")];
  return [];
}

export default async function LessonPage({ params, searchParams }: PageProps<"/teacher/lessons/[id]">) {
  await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const session = await getSession(supabase, id);
  if (!session) notFound();
  const { plan, state } = session;

  const since = minutesAgo(3);
  const [{ data: cls }, { data: topic }, { data: members }, { data: parts }, { data: answerRows }, questions, { data: pack }] = await Promise.all([
    supabase.from("classes").select("name").eq("id", session.class_id).single(),
    supabase.from("topics").select("title").eq("id", session.topic_id).single(),
    supabase.from("class_members").select("student_id, profiles!class_members_student_id_fkey(first_name, last_name, username)").eq("class_id", session.class_id).eq("status", "active"),
    supabase.from("live_participants").select("*").eq("session_id", id),
    supabase.from("live_answers").select("*").eq("session_id", id),
    getPlanQuestions(plan),
    supabase.from("theory_packs").select("id").eq("topic_id", session.topic_id).maybeSingle(),
  ]);
  type M = { student_id: string; profiles: { first_name: string; last_name: string; username: string } | null };
  const names = new Map(((members ?? []) as unknown as M[]).map((m) => [m.student_id, m.profiles ? displayName(m.profiles) : "Student"]));
  const nameOf = (sid: string) => names.get(sid) ?? "Student";
  const people = (parts ?? []) as { student_id: string; last_seen: string; fullscreen?: boolean }[];
  const present = people.filter((p) => session.ended_at || p.last_seen >= since);
  const answers = (answerRows ?? []) as LiveAnswer[];

  const allSlides = [...new Set(plan.stages.flatMap((s) => s.blocks.flatMap((b) => b.slides)))];
  const [{ data: sections }, { data: schemes }] = await Promise.all([
    allSlides.length ? supabase.from("theory_sections").select("title, blocks, sort_order").eq("theory_pack_id", pack?.id ?? "").in("title", allSlides) : Promise.resolve({ data: [] }),
    questions.size ? createAdminClient().from("mark_schemes").select("question_id, accepted_answers").in("question_id", [...questions.keys()]).eq("is_current", true) : Promise.resolve({ data: [] }),
  ]);
  const correctOf = new Map(
    ((schemes ?? []) as { question_id: string; accepted_answers: { correct?: unknown } | null }[]).map((s) => {
      const c = s.accepted_answers?.correct;
      return [s.question_id, c === undefined ? [] : Array.isArray(c) ? c.map(String) : [String(c)]];
    }),
  );
  const revealed = new Set(state.revealed ?? []);

  const slides: Slide[] = [
    {
      kind: "title",
      blockId: null,
      title: plan.title,
      topic: `${topic?.title ?? ""} · Lesson ${session.lesson_no}`,
      className: cls?.name ?? "",
      objectives: plan.objectives ?? null,
      codes: (plan.learningObjectives ?? []).map((l) => l.code),
      values: plan.values ?? [],
      vocabulary: plan.vocabulary ?? [],
    },
  ];
  let t = 0;
  for (const st of plan.stages) {
    for (const b of st.blocks) {
      const groups = state.groups?.[b.id] ?? [];
      const pollVotes = answers.filter((a) => a.block_id === b.id && a.item === "poll");
      slides.push({
        kind: "step",
        blockId: b.id,
        stage: st.stage,
        from: t,
        to: t + b.minutes,
        title: b.title,
        mode: MODE[b.mode],
        learners: b.learners,
        teacher: b.teacher,
        poll: b.poll ? { question: b.poll.question, labels: b.poll.options, counts: b.poll.options.map((_, k) => pollVotes.filter((v) => String(v.answer?.selected) === String(k)).length) } : null,
        groups: groups.map((g, k) => ({
          label: `${b.mode === "pair" ? "Pair" : "Group"} ${k + 1}`,
          client: g.scenario != null ? (b.scenarios[g.scenario]?.client ?? null) : null,
          members: g.members.map((m) => ({ name: nameOf(m), host: m === g.host })),
        })),
      });
      t += b.minutes;
      for (const title of b.slides) {
        const sec = (sections ?? []).find((x) => x.title === title);
        const parsed = theoryBlocksSchema.safeParse(sec?.blocks);
        slides.push(...theorySlides(b.id, title, parsed.success ? parsed.data : []));
      }
      for (const [together, list] of [[true, b.together], [false, b.tasks]] as const) {
        for (const pq of list) {
          const q = questions.get(pq.id);
          if (!q) continue;
          const rows = answers.filter((a) => a.block_id === b.id && a.item === pq.id);
          const marked = rows.filter((a) => a.awarded != null && Number(a.max_mark) > 0);
          const pct = marked.length ? Math.round((100 * marked.reduce((x, a) => x + Number(a.awarded), 0)) / marked.reduce((x, a) => x + Number(a.max_mark), 0)) : null;
          const tf = q.question_type === "true_false";
          const keys = tf ? ["true", "false"] : q.options.map((o) => o.key);
          const choice = tf || q.question_type === "mcq";
          const correct = correctOf.get(pq.id) ?? [];
          const texts: SlideText[] = choice
            ? []
            : rows
                .map((a) => ({ who: a.members.map(nameOf).join(", "), lines: answerLines(a, q.content.fields) }))
                .filter((x) => x.lines.length);
          slides.push({
            kind: "question",
            blockId: b.id,
            together,
            question: { id: q.id, question_type: q.question_type, content: q.content, options: q.options, title: q.title, text: <Markdown key={`${b.id}-${pq.id}`}>{q.question_text}</Markdown>, marks: q.marks },
            correct,
            revealed: revealed.has(pq.id),
            stats: { answered: rows.length, expected: b.groupSize > 1 ? groups.length : Math.max(present.length, 1), pct, toCheck: rows.filter((a) => a.needs_review).length },
            bars: choice
              ? {
                  labels: tf ? ["True", "False"] : q.options.map((o) => `${o.key}. ${o.content}`),
                  counts: keys.map((k) => rows.filter((a) => String(a.answer?.selected ?? (typeof a.answer?.value === "boolean" ? a.answer.value : "")) === k).length),
                  correct: keys.map((k) => correct.includes(k)),
                }
              : null,
            texts,
          });
        }
      }
    }
  }

  const block = typeof sp.block === "string" ? sp.block : (state.current ?? null);
  return (
    <LessonPresenter
      sessionId={id}
      title={`${topic?.title ?? ""} · Lesson ${session.lesson_no} · ${cls?.name ?? ""}`}
      minutes={plan.minutes}
      startedAt={session.started_at}
      ended={Boolean(session.ended_at)}
      slides={slides}
      open={state.open ?? []}
      startBlock={block}
      planHref={plan.docx ? `/teacher/lessons/plan?topic=${session.topic_id}&lesson=${session.lesson_no}` : null}
      joined={present.length}
      classSize={names.size}
      outOfFullscreen={session.ended_at ? [] : present.filter((p) => p.fullscreen === false).map((p) => nameOf(p.student_id))}
      live={session.ended_at ? null : <LiveRefresh sessionId={id} />}
    />
  );
}
