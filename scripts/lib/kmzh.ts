import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { authoredQuestionSchema, type AuthoredQuestion, type AuthoredTopic } from "../../src/lib/content/schema";
import { contentId } from "../../src/lib/content/ids";
import type { LivePlan } from "../../src/lib/live-plan";

// Lesson plans (ҚМЖ) in content/kmzh/<slug>-L<n>.json: the lesson's blocks and
// the tasks written for the lesson itself (live_tasks, not practice).

const DIR = join(__dirname, "..", "..", "content", "kmzh");

const block = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  minutes: z.number().int().min(1).max(80),
  title: z.string().min(1),
  mode: z.enum(["class", "individual", "pair", "group"]),
  group_size: z.number().int().min(2).max(6).optional(),
  /** paper: work on a printed worksheet, away from the laptops */
  kind: z.enum(["slides", "task", "poll", "paper"]),
  teacher: z.string(),
  learners: z.string(),
  poll: z.object({ question: z.string(), options: z.array(z.string()).min(2).max(6) }).optional(),
  slides: z.array(z.string()).optional(),
  together: z.array(z.string()).optional(),
  tasks: z.array(z.string()).optional(),
  scenarios: z.string().optional(),
  homework: z.array(z.string()).optional(),
  resources: z.array(z.string()).optional(),
});
export const kmzhSchema = z
  .object({
    topic: z.string(),
    lesson: z.number().int().min(1).max(20),
    title: z.string(),
    minutes: z.number().int(),
    values: z.array(z.object({ value: z.string(), action: z.string() })).max(3, "at most three NIS values in a lesson"),
    lesson_objectives: z.object({ all: z.string(), most: z.string(), some: z.string() }),
    learning_objectives: z.array(z.object({ code: z.string(), text: z.string() })),
    language_objectives: z.object({ vocabulary: z.array(z.string()) }).passthrough(),
    stages: z.array(z.object({ stage: z.enum(["Beginning", "Middle", "End"]), minutes: z.number().int(), blocks: z.array(block).min(1) })).length(3),
    scenarios: z.record(z.string(), z.array(z.object({ client: z.string(), details: z.string() }))).default({}),
    live_tasks: z.array(authoredQuestionSchema).default([]),
  })
  .passthrough()
  .superRefine((k, ctx) => {
    const total = k.stages.reduce((s, st) => s + st.minutes, 0);
    if (total !== k.minutes) ctx.addIssue({ code: "custom", message: `stages add up to ${total} min, not ${k.minutes}` });
    for (const st of k.stages) {
      const m = st.blocks.reduce((s, b) => s + b.minutes, 0);
      if (m !== st.minutes) ctx.addIssue({ code: "custom", message: `${st.stage}: blocks add up to ${m} min, not ${st.minutes}` });
      for (const b of st.blocks) {
        if (b.kind === "poll" && !b.poll) ctx.addIssue({ code: "custom", message: `${b.id}: a poll block needs "poll"` });
        if (b.kind === "slides" && !b.slides?.length) ctx.addIssue({ code: "custom", message: `${b.id}: a slides block needs "slides"` });
        if (b.kind === "task" && !b.tasks?.length) ctx.addIssue({ code: "custom", message: `${b.id}: a task block needs "tasks"` });
        if (b.scenarios && !k.scenarios[b.scenarios]) ctx.addIssue({ code: "custom", message: `${b.id}: unknown scenarios ${b.scenarios}` });
      }
    }
    for (const q of k.live_tasks) if (q.practice !== false) ctx.addIssue({ code: "custom", message: `${q.key}: live tasks must have "practice": false` });
  });
export type Kmzh = z.infer<typeof kmzhSchema>;

/** Every lesson plan of a topic, checked against the topic's questions and theory. */
export function loadKmzh(slug: string, topic: AuthoredTopic): Kmzh[] {
  if (!existsSync(DIR)) return [];
  const files = readdirSync(DIR).filter((f) => f.startsWith(`${slug}-L`) && f.endsWith(".json"));
  return files.map((f) => {
    const k = kmzhSchema.parse(JSON.parse(readFileSync(join(DIR, f), "utf8")));
    if (k.topic !== slug) throw new Error(`${f}: topic is ${k.topic}`);
    const keys = new Set([...topic.questions.map((q) => q.key), ...k.live_tasks.map((q) => q.key)]);
    const sections = new Set(topic.theory.map((s) => s.title));
    for (const st of k.stages)
      for (const b of st.blocks) {
        for (const x of [...(b.tasks ?? []), ...(b.together ?? []), ...(b.homework ?? [])]) if (!keys.has(x)) throw new Error(`${f}: ${b.id}: unknown task ${x}`);
        for (const s of b.slides ?? []) if (!sections.has(s)) throw new Error(`${f}: ${b.id}: unknown theory section "${s}"`);
      }
    return k;
  });
}

/** The tasks written for lessons (uploaded with the topic's questions, never practice). */
export const liveTasksOf = (plans: Kmzh[]): AuthoredQuestion[] => plans.flatMap((k) => k.live_tasks);

/** The plan stored for the site: blocks with question ids instead of keys. */
export function sitePlan(k: Kmzh, docx: string | null = null): LivePlan {
  const q = (keys?: string[]) => (keys ?? []).map((key) => ({ key, id: contentId("question", key) }));
  return {
    title: k.title,
    minutes: k.minutes,
    objectives: k.lesson_objectives,
    learningObjectives: k.learning_objectives,
    values: k.values.map((v) => v.value),
    vocabulary: k.language_objectives.vocabulary,
    docx,
    stages: k.stages.map((st) => ({
      stage: st.stage,
      minutes: st.minutes,
      blocks: st.blocks.map((b) => ({
        id: b.id,
        minutes: b.minutes,
        title: b.title,
        mode: b.mode,
        groupSize: b.mode === "pair" ? 2 : b.mode === "group" ? (b.group_size ?? 4) : 1,
        kind: b.kind,
        teacher: b.teacher,
        learners: b.learners,
        poll: b.poll ?? null,
        slides: b.slides ?? [],
        together: q(b.together),
        tasks: q(b.tasks),
        homework: q(b.homework),
        scenarios: b.scenarios ? k.scenarios[b.scenarios] : [],
      })),
    })),
  };
}
