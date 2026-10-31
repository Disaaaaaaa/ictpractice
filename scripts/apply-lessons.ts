/**
 * Writes the lessons of a topic from content/topics/<slug>.json ("lessons")
 * to Supabase: lesson rows, the lesson of each theory section and practice
 * question, and the lesson tests. The theory and questions must already be
 * uploaded (theory:apply / questions:apply also run this).
 *
 *   npm run lessons:apply -- <slug> [<slug> ...]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { getTopicInfo } from "./lib/topic-block";
import { pushLessons, serviceClient } from "./lib/push-lessons";

async function main() {
  const slugs = process.argv.slice(2);
  if (!slugs.length) throw new Error("Usage: npm run lessons:apply -- <topic-slug> [...]");
  const db = serviceClient();
  for (const slug of slugs) {
    const topic = authoredTopicSchema.parse(JSON.parse(readFileSync(join(__dirname, "..", "content/topics", `${slug}.json`), "utf8")));
    const info = getTopicInfo(slug);
    const grade = Math.min(...info.refs.map((x) => Number(x.slice(0, 2))));
    console.log(`✓ ${slug}: ${await pushLessons(db, slug, topic, info.title, grade)}`);
  }
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
