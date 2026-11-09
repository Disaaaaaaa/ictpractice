/**
 * Uploads the lesson plans (ҚМЖ) of a topic — content/kmzh/<slug>-L<n>.json —
 * for Teacher → Lessons: the tasks written for the lessons (with the topic's
 * questions) and each lesson's blocks.
 *
 *   npm run kmzh:apply -- <topic-slug>
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { getTopicInfo } from "./lib/topic-block";
import { pushQuestions } from "./lib/push-questions";
import { pushLessons, serviceClient } from "./lib/push-lessons";
import { PROGRAMME_VERSION } from "./lib/push-theory";
import { liveTasksOf, loadKmzh, sitePlan } from "./lib/kmzh";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run kmzh:apply -- <topic-slug>");
  process.exit(1);
}

async function main() {
  const topic = authoredTopicSchema.parse(JSON.parse(readFileSync(join(__dirname, "..", "content/topics", `${slug}.json`), "utf8")));
  const plans = loadKmzh(slug, topic);
  if (!plans.length) throw new Error(`no lesson plans for ${slug} in content/kmzh`);
  const info = getTopicInfo(slug);
  const grade = Math.min(...info.refs.map((x) => Number(x.slice(0, 2))));
  const questions = [...topic.questions, ...liveTasksOf(plans)];
  for (const q of questions) for (const r of q.objectives) if (!info.refs.includes(r)) throw new Error(`${q.key}: objective ${r} is not in this topic`);
  const r = await pushQuestions({
    slug,
    title: info.title,
    grade,
    questions,
    status: "published",
    examMinutes: topic.topic_exam?.duration,
    // the lesson tasks never go into the topic exam
    exam: { keys: topic.topic_exam?.questions ?? topic.questions.map((q) => q.key), title: topic.topic_exam?.title, instructions: topic.topic_exam?.instructions },
    source: `${slug}.json + content/kmzh`,
  });
  console.log(`✓ ${questions.length} questions uploaded (${liveTasksOf(plans).length} lesson tasks); ${r.examNote}`);
  const db = serviceClient();
  if (topic.lessons) console.log(`  lessons: ${await pushLessons(db, slug, topic, info.title, grade)}`);
  const { data: version } = await db.from("curriculum_versions").select("id").eq("code", PROGRAMME_VERSION).single();
  const { data: row } = await db.from("topics").select("id").eq("curriculum_version_id", version!.id).eq("slug", slug).single();
  for (const k of plans) {
    const { error } = await db
      .from("lesson_plans")
      .upsert({ topic_id: row!.id, lesson_no: k.lesson, plan: sitePlan(k), updated_at: new Date().toISOString() }, { onConflict: "topic_id,lesson_no" });
    if (error) throw new Error(`lesson ${k.lesson} plan: ${error.message}`);
    const blocks = k.stages.reduce((n, s) => n + s.blocks.length, 0);
    console.log(`  lesson ${k.lesson} plan: ${blocks} blocks, ${k.minutes} min`);
  }
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
