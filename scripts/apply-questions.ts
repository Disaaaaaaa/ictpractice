/**
 * Uploads the questions in content/topics/<slug>.json to Supabase and
 * rebuilds the topic exam (no generation — use after editing the file).
 *
 *   npm run questions:apply -- <slug> [--draft]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { getTopicInfo } from "./lib/topic-block";
import { pushQuestions } from "./lib/push-questions";

const { values, positionals } = parseArgs({ allowPositionals: true, options: { draft: { type: "boolean", default: false } } });
const slug = positionals[0];
if (!slug) {
  console.error("Usage: npm run questions:apply -- <topic-slug> [--draft]");
  process.exit(1);
}

async function main() {
  const topic = authoredTopicSchema.parse(JSON.parse(readFileSync(join(__dirname, "..", "content/topics", `${slug}.json`), "utf8")));
  if (!topic.questions.length) throw new Error(`${slug}.json has no questions`);
  const info = getTopicInfo(slug);
  for (const q of topic.questions) for (const r of q.objectives) if (!info.refs.includes(r)) throw new Error(`${q.key}: objective ${r} is not in this topic`);
  const r = await pushQuestions({
    slug,
    title: info.title,
    grade: Math.min(...info.refs.map((x) => Number(x.slice(0, 2)))),
    questions: topic.questions,
    status: values.draft ? "draft" : "published",
    examMinutes: topic.topic_exam?.duration,
    source: `${slug}.json`,
  });
  console.log(`✓ ${topic.questions.length} questions uploaded (${values.draft ? "draft" : "published"}); ${r.examNote}`);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
