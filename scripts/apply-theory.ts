/**
 * Uploads the theory pack from content/topics/<slug>.json to Supabase.
 *
 *   npm run theory:apply -- <slug> [--draft]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { pushTheory } from "./lib/push-theory";

const { values, positionals } = parseArgs({ allowPositionals: true, options: { draft: { type: "boolean", default: false } } });
const slug = positionals[0];
if (!slug) {
  console.error("Usage: npm run theory:apply -- <topic-slug> [--draft]");
  process.exit(1);
}

async function main() {
  const root = join(__dirname, "..");
  const topic = authoredTopicSchema.parse(JSON.parse(readFileSync(join(root, "content/topics", `${slug}.json`), "utf8")));
  if (!topic.theory.length) throw new Error(`${slug}.json has no theory sections`);
  const programme = JSON.parse(readFileSync(join(root, "content/curriculum/NIS_CS_2026_2027.json"), "utf8"));
  const all = [
    ...programme.grades.flatMap((g: { terms: { units: { topics: { slug: string; title: string }[] }[] }[] }) =>
      g.terms.flatMap((t) => t.units.flatMap((u) => u.topics)),
    ),
    ...(programme.exam_only_topics ?? []),
  ] as { slug: string; title: string }[];
  const meta = all.find((t) => t.slug === slug);
  if (!meta) throw new Error(`Unknown topic ${slug}`);
  const status = values.draft ? "draft" : "published";
  await pushTheory({ slug, title: meta.title, summary: topic.summary, sections: topic.theory, status, source: `${slug}.json` });
  console.log(`✓ ${meta.title}: ${topic.theory.length} sections uploaded (${status})`);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
