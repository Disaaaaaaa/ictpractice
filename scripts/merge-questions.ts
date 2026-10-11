/**
 * Replaces the questions and topic exam of content/topics/<slug>.json with an
 * authored file { questions: [...], exam: [...], exam_meta: {...} } and checks
 * the result (schema, objectives, answer keys, marks of structured questions).
 *
 *   npx tsx scripts/merge-questions.ts <slug> <file.json>
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { checkOne } from "./lib/question-checks";
import { getTopicInfo } from "./lib/topic-block";

const [slug, file] = process.argv.slice(2);
const path = join(__dirname, "..", "content/topics", `${slug}.json`);
const topic = JSON.parse(readFileSync(path, "utf8"));
const src = JSON.parse(readFileSync(file, "utf8"));
topic.questions = [...src.questions, ...(src.exam ?? [])];
if (src.exam?.length) topic.topic_exam = { ...src.exam_meta, questions: src.exam.map((q: { key: string }) => q.key) };

const parsed = authoredTopicSchema.parse(topic);
const refs = getTopicInfo(slug).refs;
const errors: string[] = [];
const keys = new Set<string>();
for (const q of parsed.questions) {
  for (const k of [q.key, ...(q.parts ?? []).map((p) => p.key)]) {
    if (keys.has(k)) errors.push(`duplicate key ${k}`);
    keys.add(k);
  }
  if (q.parts?.length) {
    const sum = q.parts.reduce((s, p) => s + p.marks, 0);
    if (sum !== q.marks) errors.push(`${q.key}: marks ${q.marks} but parts sum to ${sum}`);
    for (const p of q.parts) checkOne(p, refs, errors);
  } else checkOne(q, refs, errors);
}
// Question ids are derived from keys, so a key used by another topic would overwrite that topic's question.
for (const f of readdirSync(join(__dirname, "..", "content/topics"))) {
  if (!f.endsWith(".json") || f === `${slug}.json`) continue;
  const other = JSON.parse(readFileSync(join(__dirname, "..", "content/topics", f), "utf8"));
  for (const q of other.questions ?? [])
    for (const k of [q.key, ...(q.parts ?? []).map((p: { key: string }) => p.key)]) if (keys.has(k)) errors.push(`key ${k} is already used in ${f}`);
}
if (src.exam?.length && src.exam.length < 3) errors.push("a topic exam needs at least 3 questions to be published");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
writeFileSync(path, JSON.stringify(topic, null, 2) + "\n");
const exam = parsed.questions.filter((q) => topic.topic_exam?.questions?.includes(q.key));
console.log(
  `✓ ${slug}: ${src.questions.length} practice items, exam ${exam.length} questions / ${exam.reduce((s, q) => s + q.marks, 0)} marks / ${topic.topic_exam?.duration ?? "-"} min`,
);
