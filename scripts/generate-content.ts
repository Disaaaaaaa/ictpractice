/**
 * Generates topic content with the OpenAI API, validates it and (optionally) uploads it.
 *
 *   npm run content:generate -- <topic-slug> [--part questions|theory|all] [--apply] [--draft]
 *                                 [--model gpt-5.5] [--effort low|medium|high] [--force]
 *
 * - Prompts come from docs/PROMPTS.md (edit them there); the topic block is built
 *   from the curriculum exactly like docs/TOPICS.md.
 * - Questions are validated against the platform schema plus extra consistency
 *   checks; if anything is wrong the model is asked to fix it (up to 2 times).
 * - Results are saved to content/generated/ and merged into content/topics/<slug>.json.
 * - --apply uploads to Supabase (questions + topic exam, or the theory pack);
 *   --draft uploads unpublished so a teacher can review first.
 * - Existing theory is not regenerated unless --force is given.
 *
 * Uses OPENAI_API_KEY from .env.local; cost is charged to that OpenAI account.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { authoredQuestionSchema, authoredTopicSchema, type AuthoredQuestion } from "../src/lib/content/schema";
import { getTopicInfo, loadPrompt } from "./lib/topic-block";
import { checkOne } from "./lib/question-checks";
import { pushQuestions } from "./lib/push-questions";

const ROOT = join(__dirname, "..");
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    part: { type: "string" },
    apply: { type: "boolean", default: false },
    draft: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    model: { type: "string" },
    effort: { type: "string", default: "medium" },
  },
});
const slug = positionals[0];
if (!slug) {
  console.error("Usage: npm run content:generate -- <topic-slug> [--part questions|theory|all] [--apply] [--draft] [--model gpt-5.5]");
  process.exit(1);
}
const MODEL = values.model ?? process.env.CONTENT_MODEL ?? "gpt-5.5";
const usage = { input: 0, output: 0, calls: 0 };

type Message = { role: "system" | "user" | "assistant"; content: string };

async function chat(messages: Message[], json: boolean): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set (.env.local)");
  const started = Date.now();
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15 * 60_000),
    body: JSON.stringify({
      model: MODEL,
      messages,
      reasoning_effort: values.effort,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const data = (await res.json()) as {
    choices: { message: { content: string | null; refusal?: string | null }; finish_reason: string }[];
    usage?: { prompt_tokens: number; completion_tokens: number };
  };
  usage.calls++;
  usage.input += data.usage?.prompt_tokens ?? 0;
  usage.output += data.usage?.completion_tokens ?? 0;
  const choice = data.choices[0];
  if (!choice?.message.content) throw new Error(`Empty response (${choice?.finish_reason}) ${choice?.message.refusal ?? ""}`);
  if (choice.finish_reason === "length") throw new Error("Response was cut off (token limit) — try --effort low");
  console.log(`  · ${MODEL} answered in ${Math.round((Date.now() - started) / 1000)} s`);
  return choice.message.content;
}

// ---------------------------------------------------------------------------
// Validation beyond the schema: things that would make auto-marking wrong
// ---------------------------------------------------------------------------
function checkQuestions(raw: unknown, allowedRefs: string[], keyPrefix: string, otherKeys: Set<string>): { questions: AuthoredQuestion[]; errors: string[] } {
  const errors: string[] = [];
  const doc = raw as { topic?: string; questions?: unknown[] };
  if (!doc || !Array.isArray(doc.questions)) return { questions: [], errors: ['Top level must be {"topic": "...", "questions": [ ... ]}'] };
  const questions: AuthoredQuestion[] = [];
  const seen = new Set<string>();
  doc.questions.forEach((q, i) => {
    const item = q as Record<string, unknown>;
    if (typeof item.key === "string" && !item.key.startsWith(`${keyPrefix}-`)) item.key = `${keyPrefix}-${item.key}`;
    if (Array.isArray(item.parts)) {
      for (const part of item.parts as Record<string, unknown>[]) {
        if (typeof part.key === "string" && !part.key.startsWith(`${keyPrefix}-`)) part.key = `${keyPrefix}-${part.key}`;
      }
    }
    const r = authoredQuestionSchema.safeParse(item);
    const label = typeof item.key === "string" ? item.key : `#${i + 1}`;
    if (!r.success) {
      errors.push(...r.error.issues.map((x) => `${label}: ${x.path.join(".") || "question"} — ${x.message}`));
      return;
    }
    const qq = r.data;
    if (seen.has(qq.key) || otherKeys.has(qq.key)) errors.push(`${qq.key}: duplicate key`);
    seen.add(qq.key);
    if (qq.type === "structured") {
      for (const part of qq.parts ?? []) {
        if (seen.has(part.key) || otherKeys.has(part.key)) errors.push(`${part.key}: duplicate key`);
        seen.add(part.key);
        checkOne(part, allowedRefs, errors);
      }
    } else checkOne(qq, allowedRefs, errors);
    questions.push(qq);
  });
  if (questions.length < 10) errors.push(`Only ${questions.length} valid questions — at least 14 are required`);
  for (const ref of allowedRefs) {
    if (!questions.some((q) => q.objectives.includes(ref) || (q.parts ?? []).some((p) => p.objectives.includes(ref)))) errors.push(`No question covers objective ${ref}`);
  }
  return { questions, errors };
}

function theorySummary(file: string): string {
  if (!existsSync(file)) return "";
  const t = JSON.parse(readFileSync(file, "utf8")) as { theory?: { title: string; blocks: { type: string; term?: string; text?: string; title?: string }[] }[] };
  if (!t.theory?.length) return "";
  const lines = t.theory.map((s) => {
    const terms = s.blocks.filter((b) => b.type === "definition" || b.type === "heading").map((b) => b.term ?? b.text).filter(Boolean);
    return `- ${s.title}${terms.length ? `: ${terms.join("; ")}` : ""}`;
  });
  return `\n\nTHE STUDENTS' THEORY PACK FOR THIS TOPIC (align terminology, notation and pseudocode style with it):\n${lines.join("\n")}`.slice(0, 6000);
}

async function generateQuestions(info: ReturnType<typeof getTopicInfo>, topicFile: string) {
  const otherKeys = new Set<string>();
  for (const f of readdirSync(join(ROOT, "content/topics"))) {
    if (!f.endsWith(".json") || f === `${slug}.json`) continue;
    for (const q of (JSON.parse(readFileSync(join(ROOT, "content/topics", f), "utf8")).questions ?? []) as { key: string }[]) otherKeys.add(q.key);
  }
  const keyPrefix = slug.replace(/^g1[12]-/, "");
  const prompt = loadPrompt(2).replace("{{TOPIC_BLOCK}}", info.block) + theorySummary(topicFile) +
    "\n\nPseudocode in questions and mark schemes must use the Cambridge style: arrays indexed from 1, ← for assignment, DIV for integer division, FOR…NEXT, WHILE…ENDWHILE, REPEAT…UNTIL, IF…THEN…ELSE…ENDIF.";
  const messages: Message[] = [{ role: "user", content: prompt }];

  for (let round = 0; round < 3; round++) {
    console.log(round === 0 ? "→ generating questions…" : `→ asking the model to fix ${round === 1 ? "problems" : "remaining problems"}…`);
    const text = await chat(messages, true);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      messages.push({ role: "assistant", content: text }, { role: "user", content: "That was not valid JSON. Return the complete corrected JSON only." });
      continue;
    }
    const { questions, errors } = checkQuestions(parsed, info.refs, keyPrefix, otherKeys);
    writeFileSync(join(ROOT, "content/generated", `${slug}.questions.json`), JSON.stringify(parsed, null, 2) + "\n");
    if (!errors.length) return questions;
    console.log(`  ✗ ${errors.length} problem(s):\n${errors.slice(0, 15).map((e) => `    - ${e}`).join("\n")}`);
    messages.push(
      { role: "assistant", content: text },
      { role: "user", content: `The JSON has these problems:\n${errors.map((e) => `- ${e}`).join("\n")}\n\nReturn the COMPLETE corrected JSON (all questions), only the JSON.` },
    );
  }
  throw new Error("Questions still invalid after 2 repair rounds — see content/generated/" + `${slug}.questions.json`);
}

async function generateTheory(info: ReturnType<typeof getTopicInfo>) {
  console.log("→ generating theory pack (HTML)…");
  const prompt = loadPrompt(1).replace("{{TOPIC_BLOCK}}", info.block) +
    "\n\nPseudocode must use the Cambridge style: arrays indexed from 1, ← for assignment, DIV for integer division.";
  let html = await chat([{ role: "user", content: prompt }], false);
  html = html.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/, "").trim();
  if (!/<section[\s>]/i.test(html) || !/<h2[\s>]/i.test(html)) throw new Error("The model did not return the expected HTML structure");
  const file = join(ROOT, "content/generated", `${slug}.html`);
  writeFileSync(file, html + "\n");
  const args = [join(ROOT, "node_modules/.bin/tsx"), join(ROOT, "scripts/import-html-theory.ts"), file, "--topic", slug];
  if (values.apply) args.push("--apply");
  if (values.draft) args.push("--draft");
  execFileSync(process.execPath, args.slice(0), { stdio: "inherit", env: process.env });
}

async function main() {
  mkdirSync(join(ROOT, "content/generated"), { recursive: true });
  const info = getTopicInfo(slug);
  const topicFile = join(ROOT, "content/topics", `${slug}.json`);
  const existing = existsSync(topicFile) ? authoredTopicSchema.parse(JSON.parse(readFileSync(topicFile, "utf8"))) : null;
  const hasTheory = Boolean(existing?.theory.length);
  const part = values.part ?? (hasTheory ? "questions" : "all");
  console.log(`Topic: ${info.title} (${slug}) · model ${MODEL} · effort ${values.effort} · part ${part}`);

  if (part === "theory" || part === "all") {
    if (hasTheory && !values.force) console.log("• theory already exists — skipped (use --force to regenerate)");
    else await generateTheory(info);
  }

  if (part === "questions" || part === "all") {
    const questions = await generateQuestions(info, topicFile);
    const current = existsSync(topicFile) ? JSON.parse(readFileSync(topicFile, "utf8")) : { topic: slug };
    // Questions chosen for the topic exam (e.g. hand-written exam-style ones) are kept.
    const examKeys = new Set<string>(current.topic_exam?.questions ?? []);
    const kept = (current.questions ?? []).filter((q: { key: string }) => examKeys.has(q.key) && !questions.some((n) => n.key === q.key));
    const merged = authoredTopicSchema.parse({ ...current, topic: slug, questions: [...questions, ...kept] });
    writeFileSync(topicFile, JSON.stringify(merged, null, 2) + "\n");
    const byType = new Map<string, number>();
    for (const q of questions) byType.set(q.type, (byType.get(q.type) ?? 0) + 1);
    console.log(`✓ ${questions.length} questions, ${questions.reduce((s, q) => s + q.marks, 0)} marks — ${[...byType].map(([t, n]) => `${t} ${n}`).join(", ")}`);
    console.log(`  saved to content/topics/${slug}.json`);
    if (values.apply) {
      const grade = Math.min(...info.refs.map((r) => Number(r.slice(0, 2))));
      const r = await pushQuestions({
        slug,
        title: info.title,
        grade,
        status: values.draft ? "draft" : "published",
        questions: merged.questions,
        examMinutes: merged.topic_exam?.duration,
        exam: { keys: merged.topic_exam?.questions, title: merged.topic_exam?.title, instructions: merged.topic_exam?.instructions },
        source: `generated:${MODEL}`,
      });
      console.log(`✓ uploaded to Supabase (${values.draft ? "draft" : "published"}); ${r.examNote}${r.archived ? `; ${r.archived} old question(s) archived` : ""}`);
    } else {
      console.log("  (not uploaded — add --apply)");
    }
  }
  console.log(`OpenAI usage: ${usage.calls} call(s), ${usage.input} input + ${usage.output} output tokens`);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  console.log(`OpenAI usage so far: ${usage.calls} call(s), ${usage.input} input + ${usage.output} output tokens`);
  process.exit(1);
});
