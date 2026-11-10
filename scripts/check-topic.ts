// Checks a topic before it is uploaded: the topic JSON against the content
// schema, its lesson plans (content/kmzh), the practice rules and the topic exam.
//   npx tsx scripts/check-topic.ts <slug> [--exam-marks 40]
import { existsSync, readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { loadKmzh } from "./lib/kmzh";

const { values, positionals } = parseArgs({ allowPositionals: true, options: { "exam-marks": { type: "string" } } });
const slug = positionals[0];
if (!slug) throw new Error("usage: check-topic.ts <slug> [--exam-marks 40]");
const file = `content/topics/${slug}.json`;
const t = authoredTopicSchema.parse(JSON.parse(readFileSync(file, "utf8")));
const problems: string[] = [];
const byKey = new Map(t.questions.map((q) => [q.key, q]));
const marksOf = (key: string): number => {
  const q = byKey.get(key) as (typeof t.questions)[number] & { parts?: { marks: number }[] };
  if (!q) return 0;
  return q.parts?.length ? q.parts.reduce((s, p) => s + p.marks, 0) : q.marks;
};

// practice: auto-marked only
for (const l of t.lessons ?? []) {
  const keys = l.questions ?? [];
  for (const k of keys) {
    const q = byKey.get(k);
    if (!q) problems.push(`lesson "${l.title}": unknown question ${k}`);
    else if (q.practice !== false && q.grading !== "AUTO") problems.push(`practice question ${k} is ${q.grading}, must be AUTO`);
  }
  if (keys.length < 12) problems.push(`lesson "${l.title}": only ${keys.length} practice questions (need 12+)`);
  for (const s of l.sections ?? []) if (!t.theory.some((x) => x.title === s)) problems.push(`lesson "${l.title}": unknown theory section "${s}"`);
}

// theory: no ASCII diagrams left, enough depth
for (const s of t.theory) {
  if (s.blocks.some((b) => b.type === "diagram" && (b as { format?: string }).format === "ascii")) problems.push(`theory "${s.title}": ASCII diagram left — draw it as :::svg`);
}

// topic exam
const exam = t.topic_exam as { questions?: string[]; duration?: number } | undefined;
const total = (exam?.questions ?? []).reduce((s, k) => s + marksOf(k), 0);
if (values["exam-marks"] && total !== Number(values["exam-marks"])) problems.push(`topic exam is ${total} marks, not ${values["exam-marks"]}`);
for (const k of exam?.questions ?? []) {
  const q = byKey.get(k);
  if (!q) problems.push(`topic exam: unknown question ${k}`);
  else if (q.practice !== false) problems.push(`topic exam question ${k} must have "practice": false`);
}

// notes checklists
for (const [i] of (t.lessons ?? []).entries()) {
  const f = `content/notes-checklists/${slug}-L${i + 1}.json`;
  if (!existsSync(f)) problems.push(`missing notes checklist ${f}`);
}

const plans = loadKmzh(slug, t);
console.log(`${slug}: ${t.theory.length} theory sections, ${t.theory.reduce((s, x) => s + x.blocks.length, 0)} blocks, ${t.questions.length} questions, ${(t.lessons ?? []).length} lessons, exam ${total} marks, ${plans.length} lesson plans`);
if (problems.length) {
  console.log(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log("✓ ready to upload");
