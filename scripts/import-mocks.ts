/**
 * Turns the NIS past papers in "specification-past papers/" into mock exams.
 *
 *   npm run mocks:import -- [2024] [--paper 2] [--apply] [--draft] [--force] [--effort medium]
 *
 * For each year × paper the question paper and its mark scheme are rendered to
 * page images and sent (with their text layer) to the content model, which
 * returns the questions as structured JSON: stems, parts (a)(b)(i), answer
 * formats, marks, learning objectives and the mark scheme. The result is
 * validated (schema, answer keys, marks per question against "[Total: n]")
 * and repaired by the model if needed, figures are cropped from the pages,
 * and the mock is written to content/mocks/<key>.json.
 *
 * --apply uploads figures, the questions and the exam to Supabase, publishes it,
 * and attaches the original PDFs for teachers (private "papers" bucket).
 *
 * The school has permission to use and publish these papers.
 * Uses OPENAI_API_KEY (cost is charged to that account) and the Supabase service role.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { authoredMockSchema, type AuthoredMock, type AuthoredQuestion } from "../src/lib/content/schema";
import { COMMAND_WORDS, QUESTION_TYPES } from "../src/lib/questions/types";
import { checkOne } from "./lib/question-checks";
import { pushMock } from "./lib/push-mock";
import { PROGRAMME_VERSION, SPEC_VERSION } from "./lib/push-theory";

const ROOT = join(__dirname, "..");
const PAPERS_DIR = join(ROOT, "specification-past papers");
const CACHE = join(ROOT, "content/generated/mocks");

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    paper: { type: "string" },
    apply: { type: "boolean", default: false },
    draft: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    model: { type: "string" },
    effort: { type: "string", default: "medium" },
    /** only re-check and re-crop the figures of already imported papers */
    figures: { type: "boolean", default: false },
    /** with --figures: re-crop from the saved boxes without asking the model */
    "crop-only": { type: "boolean", default: false },
  },
});
const MODEL = values.model ?? process.env.CONTENT_MODEL ?? "gpt-5.5";
const usage = { input: 0, output: 0, calls: 0 };

const PAPER_INFO: Record<number, { title: string; minutes: number; marks: number }> = {
  1: { title: "Theory fundamentals", minutes: 90, marks: 70 },
  2: { title: "Solution design", minutes: 90, marks: 70 },
  3: { title: "Problem-solving and programming skills", minutes: 120, marks: 60 },
};

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------
function findPapers(year: number, paper: number) {
  const files = readdirSync(PAPERS_DIR).filter((f) => f.endsWith(".pdf") && f.startsWith(`${year}_NIS_G12_CS_0${paper}_`));
  const ms = files.find((f) => f.includes("_MS_"));
  const qp = files.find((f) => !f.includes("_MS_"));
  return qp && ms ? { qp, ms } : null;
}

function render(pdf: string, dir: string, dpi: number): string[] {
  mkdirSync(dir, { recursive: true });
  if (!readdirSync(dir).some((f) => f.endsWith(".png"))) {
    execFileSync("pdftoppm", ["-r", String(dpi), "-png", join(PAPERS_DIR, pdf), join(dir, "page")]);
  }
  return readdirSync(dir).filter((f) => f.endsWith(".png")).sort().map((f) => join(dir, f));
}

const pdfText = (pdf: string) => execFileSync("pdftotext", ["-layout", join(PAPERS_DIR, pdf), "-"], { maxBuffer: 50e6 }).toString();

/** Text of each page (pdftotext separates pages with form feeds). */
const pagesOf = (text: string) => text.split("\f");

// ---------------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------------
type SpecLO = { code: string; description: string; paper: number };
function specObjectives(): SpecLO[] {
  const spec = JSON.parse(readFileSync(join(ROOT, "content/curriculum/exam_spec.json"), "utf8")) as {
    papers: { number: number; groups: { sections: { objectives: { code: string; description: string }[] }[] }[] }[];
  };
  return spec.papers.flatMap((p) => p.groups.flatMap((g) => g.sections.flatMap((s) => s.objectives.map((o) => ({ ...o, paper: p.number })))));
}

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Spec LO code → topic slug: direct link, else the KTP objective with the same code, else a topic placed in its paper section. */
async function topicMap(codes: string[]): Promise<Map<string, string>> {
  const c = db();
  const [{ data: versions }, { data: topics }] = await Promise.all([
    c.from("curriculum_versions").select("id, code").in("code", [PROGRAMME_VERSION, SPEC_VERSION]),
    c.from("topics").select("id, slug, sort_order"),
  ]);
  const vid = (code: string) => versions?.find((v) => v.code === code)?.id as string;
  const slugOf = new Map((topics ?? []).map((t) => [t.id as string, t.slug as string]));
  const [{ data: specLos }, { data: ktpLos }] = await Promise.all([
    c.from("learning_objectives").select("id, code, topic_objectives(topic_id), objective_paper_map(paper_section_id)").eq("curriculum_version_id", vid(SPEC_VERSION)).in("code", codes),
    c.from("learning_objectives").select("code, topic_objectives(topic_id)").eq("curriculum_version_id", vid(PROGRAMME_VERSION)).in("code", codes),
  ]);
  const sections = [...new Set((specLos ?? []).flatMap((l) => (l.objective_paper_map as { paper_section_id: string }[]).map((m) => m.paper_section_id)))];
  const { data: placements } = await c.from("exam_placements").select("topic_id, paper_section_id, sort_order").in("paper_section_id", sections.length ? sections : ["00000000-0000-0000-0000-000000000000"]).order("sort_order");
  const out = new Map<string, string>();
  for (const code of codes) {
    const spec = specLos?.find((l) => l.code === code);
    const direct = (spec?.topic_objectives as { topic_id: string }[] | undefined)?.[0]?.topic_id;
    const viaKtp = (ktpLos?.find((l) => l.code === code)?.topic_objectives as { topic_id: string }[] | undefined)?.[0]?.topic_id;
    const sec = (spec?.objective_paper_map as { paper_section_id: string }[] | undefined)?.[0]?.paper_section_id;
    const viaSection = placements?.find((p) => p.paper_section_id === sec)?.topic_id;
    const t = direct ?? viaKtp ?? viaSection;
    if (t && slugOf.get(t)) out.set(code, slugOf.get(t)!);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
type Part = {
  label: string;
  type: string;
  marks: number;
  command_word: string | null;
  grading: string;
  objectives: string[];
  text: string;
  options?: { key: string; content: string }[];
  content?: Record<string, unknown>;
  scheme: { mark_scheme: string; points?: { criterion: string; marks: number }[]; model_answer?: string; accepted?: Record<string, unknown>; ai_instructions?: string; explanation?: string };
};
type RawQuestion = { number: number; title: string; stem: string; parts: Part[] };
type Figure = { id: string; page: number; box: [number, number, number, number]; alt: string };
type RawPaper = { instructions: string; questions: RawQuestion[]; figures: Figure[] };

type Content = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail: "high" } };
type Message = { role: "system" | "user" | "assistant"; content: string | Content[] };

async function chat(messages: Message[]): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set (.env.local)");
  const started = Date.now();
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30 * 60_000),
      body: JSON.stringify({ model: MODEL, messages, reasoning_effort: values.effort, response_format: { type: "json_object" }, max_completion_tokens: 128000 }),
    });
    // Rate limit: wait and retry (quota errors are not retried).
    if (res.status !== 429 || attempt >= 5) break;
    const body = await res.text();
    if (body.includes("insufficient_quota")) throw new Error(`OpenAI quota exhausted: ${body.slice(0, 300)}`);
    const wait = Number(res.headers.get("retry-after")) || 20 * (attempt + 1);
    console.log(`  · rate limited, retrying in ${wait} s`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
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
  if (choice.finish_reason === "length") throw new Error("Response was cut off (token limit)");
  console.log(`  · ${MODEL} answered in ${Math.round((Date.now() - started) / 1000)} s`);
  return choice.message.content;
}

function typeRules(): string {
  const prompts = readFileSync(join(ROOT, "docs/PROMPTS.md"), "utf8");
  const a = prompts.indexOf("PER-TYPE RULES");
  const b = prompts.indexOf("Return ONLY the JSON.", a);
  return prompts.slice(a, b).trim();
}

function buildPrompt(year: number, paper: number, los: SpecLO[], qpPages: number, msPages: number): string {
  const info = PAPER_INFO[paper];
  const list = los.filter((l) => l.paper === paper).map((l) => `${l.code} — ${l.description}`).join("\n");
  const others = los.filter((l) => l.paper !== paper).map((l) => l.code).join(", ");
  return `Convert this NIS Grade 12 Computer Science past paper into the platform's JSON format.
Paper: ${year} Paper ${paper} — ${info.title} (${info.minutes} minutes).
The school holds permission to use and publish this paper: transcribe the questions, data, code and
mark scheme FAITHFULLY (same wording, numbers, tables and code). Do not invent or drop content.

You get: ${qpPages} QUESTION PAPER page images (QP page 1…${qpPages}) and ${msPages} MARK SCHEME page images
(MS page 1…${msPages}), followed by the text layer of both documents (use it for exact wording; use the images
for layout, tables, figures and answer areas). Ignore cover pages, blank pages, "For Examiner's Use" margins,
answer lines and copyright footers.

STRUCTURE
- One entry per numbered question 1, 2, 3 …, in order.
- "stem": the shared introduction of the question (scenario, given table, code listing, figure) that comes
  before part (a). Markdown. "" if there is none.
- "parts": every answerable part in order with its label exactly as printed: "(a)", "(b)(i)", "(b)(ii)" …
  Text that introduces sub-parts (e.g. "(b) A program is written…" before (b)(i)) goes at the start of the
  first sub-part's text. A question without parts has ONE part with label "".
- "marks" = the [n] printed for that part. The parts of a question must add up to its [Total: n].
- Tables → Markdown tables. Code / pseudocode → fenced code blocks, keeping line numbers if printed.
- Figures that cannot be written as text (diagrams, circuits, screenshots, network drawings, graphs) →
  put {{fig:ID}} where the figure appears and add it to "figures" with the QP page number (1-based) and its
  bounding box as fractions of the page width/height [x0, y0, x1, y1]: around the drawing and its labels only —
  exclude the question sentence above it and any answer table or lines below it.
  Never use a figure for a plain table or code that you can transcribe.

ANSWER FORMAT of each part (field "type"), chosen from how the candidate answers on paper:
- written lines → short_answer (1–3 lines) or extended (longer); "1 …… 2 ……" numbered/labelled lines
  (e.g. "1 …", "2 …", "Advantage …", "Disadvantage …", "Questionnaire: disadvantage 1 …") → labelled_answers
  with content.fields one per line/box (key "1","2"… ; label as printed).
- conversions / arithmetic with working → calculation.
- a printed table the candidate completes → table_completion (content.columns, content.rows, content.prefill
  with the printed cells and null for blanks); trace tables of an algorithm → trace_table; truth tables →
  table_completion with the input columns prefilled.
- tick boxes → mcq (one tick) or multiple_response; "draw a line to match" → matching; true/false boxes → true_false.
- SQL → sql; HTML/CSS → html_css; program code → code_completion / pseudocode (content.language "pseudocode"
  unless a language is required); explain given code → code_analysis.
- draw a logic circuit → logic_circuit (content.inputs, content.output); write a Boolean expression → boolean_expression;
  draw a flowchart → flowchart; DFD → dfd; E–R diagram → erd; binary tree → binary_tree;
  draw an interface / other drawing → extended with a note that the candidate describes the design in words.

MARKING (from the mark scheme pages for the same part)
- scheme.mark_scheme: the mark scheme for this part in Markdown, faithfully (one creditworthy point per line
  with (1); keep "max n", "accept …", "do not accept …").
- scheme.points: [{"criterion": "…", "marks": 1}, …] (sum ≥ part marks) — REQUIRED unless grading is AUTO.
- scheme.model_answer: a full-mark answer built from the scheme.
- grading: "AUTO" only for exact answers with an answer key (mcq, multiple_response, true_false, matching,
  numeric calculation without method marks, boolean_expression, binary_tree); tables, labelled boxes and trace
  tables with exact values → "HYBRID" (key + points). In table keys "" = the cell must stay empty, ticks are "✓";
  "HYBRID" for calculations with method marks and logic circuits; otherwise "AI".
  "Simplify" / "show that" / "show your working" questions are ALWAYS "AI" (an equivalent but unsimplified
  answer must not get full marks); still give scheme.accepted.expression for reference.
- scheme.accepted for AUTO/HYBRID exactly as in the rules below. ai_instructions: alternatives / rules from the scheme.

${typeRules()}

LEARNING OBJECTIVES: give each part 1–2 codes (digits only, no suffix). Prefer this paper's list:
${list}
Other valid codes (other papers): ${others}

command_word: one of ${COMMAND_WORDS.join(", ")} or null (map "give" → state, "convert"/"perform" → calculate,
"create"/"construct" → draw or write, "modify"/"rewrite" → write, "determine" → calculate or identify).
type: one of ${QUESTION_TYPES.filter((t) => t !== "structured").join(", ")}.

OUTPUT — ONLY JSON:
{
  "instructions": "2–4 short lines for an ONLINE exam taken from the cover (e.g. answer all questions, marks in brackets [ ]); omit pens, barcodes, staples, writing in margins",
  "questions": [ { "number": 1, "title": "short title (≤ 60 chars)", "stem": "…",
                   "parts": [ { "label": "(a)", "type": "…", "marks": 2, "command_word": "state", "grading": "AI",
                                "objectives": ["12.4.1.1"], "text": "…", "options": [ … ], "content": { … },
                                "scheme": { … } } ] } ],
  "figures": [ { "id": "q3-network", "page": 5, "box": [0.1, 0.3, 0.9, 0.6], "alt": "Network diagram of …" } ]
}`;
}

// ---------------------------------------------------------------------------
// Conversion + validation
// ---------------------------------------------------------------------------
const slugLabel = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, "");

function toMock(
  raw: RawPaper,
  ctx: { year: number; paper: number; key: string; figureUrl: (id: string) => string; topics: Map<string, string>; validCodes: Set<string> },
): { mock: AuthoredMock | null; errors: string[] } {
  const errors: string[] = [];
  const info = PAPER_INFO[ctx.paper];
  const prefix = `m${String(ctx.year).slice(2)}p${ctx.paper}`;
  const figIds = new Set((raw.figures ?? []).map((f) => f.id));
  const fig = (s: string) =>
    s.replace(/\{\{fig:([^}]+)\}\}/g, (_, id: string) => {
      if (!figIds.has(id)) errors.push(`figure ${id} is used but not listed in "figures"`);
      const f = raw.figures.find((x) => x.id === id);
      return `![${(f?.alt ?? id).replace(/[[\]]/g, "")}](${ctx.figureUrl(id)})`;
    });
  const refs = (codes: string[], where: string) =>
    codes.map((c) => {
      const code = c.replace(/@paper$/, "");
      if (!ctx.validCodes.has(code)) errors.push(`${where}: unknown objective ${c}`);
      return `${code}@paper`;
    });
  const topicOf = (codes: string[]) => codes.map((c) => ctx.topics.get(c.replace(/@paper$/, ""))).find(Boolean);

  const questions: AuthoredQuestion[] = (raw.questions ?? []).map((q) => {
    const where = `Q${q.number}`;
    const groupTopic = (q.parts ?? []).map((p) => topicOf(p.objectives ?? [])).find(Boolean);
    const parts = (q.parts ?? []).map((p) => {
      const objectives = refs(p.objectives ?? [], `${where}${p.label}`);
      // Tables, labelled boxes and trace tables: an exact key gives full marks at once,
      // anything else (other notation, partly right) goes to the AI examiner.
      if (p.grading === "AUTO" && ["table_completion", "labelled_answers", "trace_table"].includes(p.type)) {
        p.grading = "HYBRID";
        if (!p.scheme.points?.length) p.scheme.points = [{ criterion: "Answers match the mark scheme (see table / boxes)", marks: p.marks }];
      }
      return {
        key: `${prefix}-${q.number}${slugLabel(p.label)}`,
        title: `${q.title}${p.label ? ` ${p.label}` : ""}`.slice(0, 200),
        type: p.type,
        marks: p.marks,
        difficulty: "exam",
        command_word: p.command_word ?? null,
        grading: p.grading,
        objectives,
        text: fig(p.text || "Answer the question."),
        ...(p.options?.length ? { options: p.options } : {}),
        content: p.content ?? {},
        source: "past_paper",
        source_reference: `NIS ${ctx.year} Paper ${ctx.paper} Q${q.number}${p.label}`,
        practice: false,
        topic: topicOf(objectives) ?? groupTopic,
        part_label: p.label,
        scheme: { ...p.scheme, mark_scheme: fig(p.scheme?.mark_scheme ?? "") },
      };
    });
    if (parts.length === 1 && !parts[0].part_label) {
      // A question without parts: the stem becomes part of its text.
      const { part_label: _unused, ...only } = parts[0];
      void _unused;
      return { ...only, key: `${prefix}-${q.number}`, title: q.title, text: [fig(q.stem ?? ""), only.text].filter(Boolean).join("\n\n") } as AuthoredQuestion;
    }
    return {
      key: `${prefix}-${q.number}`,
      title: q.title,
      type: "structured",
      marks: parts.reduce((t, p) => t + (p.marks ?? 0), 0) || 1,
      difficulty: "exam",
      command_word: null,
      grading: "AI",
      objectives: [],
      text: fig(q.stem?.trim() ?? ""),
      source: "past_paper",
      source_reference: `NIS ${ctx.year} Paper ${ctx.paper} Q${q.number}`,
      practice: false,
      topic: parts.map((p) => p.topic).find(Boolean),
      scheme: { mark_scheme: "" },
      parts,
    } as unknown as AuthoredQuestion;
  });

  const candidate = {
    key: ctx.key,
    year: ctx.year,
    paper: ctx.paper,
    grade: 12,
    title: `NIS ${ctx.year} · Paper ${ctx.paper}: ${info.title}`,
    description: `Past paper ${ctx.year}, Paper ${ctx.paper} (${info.title}) — ${info.minutes} minutes.`,
    instructions: raw.instructions || "Answer all questions.",
    duration: info.minutes,
    integrity_mode: "warn",
    max_violations: 3,
    show_mark_scheme: true,
    include: [],
    questions,
  };
  const parsed = authoredMockSchema.safeParse(candidate);
  if (!parsed.success) {
    errors.push(...parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
    return { mock: null, errors };
  }
  const allRefs = [...ctx.validCodes].map((c) => `${c}@paper`);
  for (const q of parsed.data.questions) {
    const answerable = q.type === "structured" ? (q.parts ?? []) : [q];
    for (const p of answerable) {
      checkOne(p, allRefs, errors, { pastPaper: true });
      if (!p.topic) errors.push(`${p.key}: no topic found for its objectives — choose objectives from the list`);
    }
  }
  return { mock: parsed.data, errors };
}

/** Marks per question from "[Total: n]" in the question paper, in order. */
function expectedTotals(qpText: string): number[] {
  return [...qpText.matchAll(/\[Total:\s*(\d+)\s*\]/g)].map((m) => Number(m[1]));
}

function marksErrors(mock: AuthoredMock, totals: number[], paper: number): string[] {
  const errors: string[] = [];
  const got = mock.questions.map((q) => (q.type === "structured" ? (q.parts ?? []).reduce((t, p) => t + p.marks, 0) : q.marks));
  if (totals.length && totals.length !== got.length) errors.push(`The paper has ${totals.length} questions ([Total: n] lines) but the JSON has ${got.length}`);
  totals.forEach((t, i) => {
    if (got[i] !== undefined && got[i] !== t) errors.push(`Question ${i + 1}: parts add up to ${got[i]} marks but the paper says [Total: ${t}]`);
  });
  const sum = got.reduce((a, b) => a + b, 0);
  if (sum !== PAPER_INFO[paper].marks) errors.push(`Paper total is ${sum}, expected ${PAPER_INFO[paper].marks}`);
  return errors;
}

// ---------------------------------------------------------------------------
// Figures
// ---------------------------------------------------------------------------
async function cropFigures(raw: RawPaper, pages: string[], outDir: string): Promise<string[]> {
  mkdirSync(outDir, { recursive: true });
  const written: string[] = [];
  for (const f of raw.figures ?? []) {
    const src = pages[f.page - 1];
    if (!src) throw new Error(`figure ${f.id}: page ${f.page} does not exist`);
    const meta = await sharp(src).metadata();
    const [x0, y0, x1, y1] = f.box.map((v) => Math.min(1, Math.max(0, v)));
    const pad = 0.01;
    const left = Math.floor(Math.max(0, x0 - pad) * meta.width!);
    const top = Math.floor(Math.max(0, y0 - pad) * meta.height!);
    const width = Math.max(10, Math.min(meta.width! - left, Math.ceil((x1 - x0 + 2 * pad) * meta.width!)));
    const height = Math.max(10, Math.min(meta.height! - top, Math.ceil((y1 - y0 + 2 * pad) * meta.height!)));
    const out = join(outDir, `${f.id}.png`);
    // Trim the white margin, then add a small even border.
    const cut = await sharp(src).extract({ left, top, width, height }).png().toBuffer();
    await sharp(cut)
      .trim({ background: "#ffffff", threshold: 20 })
      .extend({ top: 12, bottom: 12, left: 12, right: 12, background: "#ffffff" })
      .png({ compressionLevel: 9 })
      .toFile(out);
    written.push(out);
  }
  return written;
}

/**
 * Shows the model each figure's crop and its page with the crop box drawn in
 * red, and lets it correct boxes that cut the drawing or include question text.
 */
async function refineFigures(raw: RawPaper, pages: string[], key: string): Promise<boolean> {
  if (!raw.figures?.length) return false;
  let changed = false;
  for (let round = 0; round < 2; round++) {
    const content: Content[] = [
      {
        type: "text",
        text: `These are figures cropped from an exam paper. For EACH figure you get the page with the crop box drawn in red, then the crop.
A good crop contains the whole drawing with all its labels, and NOTHING else: no question sentence, no "(b) …" text of the next part,
no answer lines or answer tables, no "[n]" marks, no margin text. Boxes are [x0, y0, x1, y1] as fractions of the page.
Reply with JSON only: {"figures": [{"id": "…", "ok": true} or {"id": "…", "ok": false, "box": [x0, y0, x1, y1]}]}.`,
      },
    ];
    const dir = join(CACHE, key, "figure-check");
    mkdirSync(dir, { recursive: true });
    for (const f of raw.figures) {
      const page = pages[f.page - 1];
      const small = await sharp(page).resize({ width: 900 }).png().toBuffer();
      const meta = await sharp(small).metadata();
      const [x0, y0, x1, y1] = f.box;
      const W = meta.width!;
      const H = meta.height!;
      const svg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${Math.round(x0 * W)}" y="${Math.round(y0 * H)}" width="${Math.round((x1 - x0) * W)}" height="${Math.round((y1 - y0) * H)}" fill="none" stroke="red" stroke-width="4"/></svg>`,
      );
      const overlay = await sharp(small).composite([{ input: svg, top: 0, left: 0 }]).png().toBuffer();
      const crop = join(dir, `${f.id}.png`);
      await cropFigures({ ...raw, figures: [f] }, pages, dir);
      content.push(
        { type: "text", text: `Figure "${f.id}" (${f.alt}) — page ${f.page} with the box:` },
        { type: "image_url", image_url: { url: `data:image/png;base64,${overlay.toString("base64")}`, detail: "high" } },
        { type: "text", text: `Crop of "${f.id}":` },
        { type: "image_url", image_url: { url: `data:image/png;base64,${readFileSync(crop).toString("base64")}`, detail: "high" } },
      );
    }
    const reply = JSON.parse(await chat([{ role: "user", content }])) as { figures?: { id: string; ok: boolean; box?: number[] }[] };
    const fixes = (reply.figures ?? []).filter((x) => !x.ok && Array.isArray(x.box) && x.box.length === 4);
    if (fixes.length === 0) break;
    for (const fix of fixes) {
      const f = raw.figures.find((x) => x.id === fix.id);
      if (f) f.box = fix.box as [number, number, number, number];
    }
    console.log(`  · corrected ${fixes.length} figure box(es): ${fixes.map((x) => x.id).join(", ")}`);
    changed = true;
  }
  return changed;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function importOne(year: number, paper: number, los: SpecLO[]) {
  const files = findPapers(year, paper);
  const key = `nis-${year}-p${paper}`;
  if (!files) {
    console.log(`– ${key}: question paper or mark scheme not found, skipped`);
    return;
  }
  console.log(`\n▶ ${key}  (${files.qp} + ${files.ms})`);
  const dir = join(CACHE, key);
  mkdirSync(dir, { recursive: true });
  const qpImages = render(files.qp, join(dir, "qp-100"), 100);
  const msImages = render(files.ms, join(dir, "ms-100"), 100);
  const qpHigh = render(files.qp, join(dir, "qp-200"), 200);
  const qpText = pdfText(files.qp);
  const msText = pdfText(files.ms);

  if (values.figures) {
    const rawPath = join(dir, "raw.json");
    if (!existsSync(rawPath)) throw new Error(`${key} has not been imported yet`);
    const raw = JSON.parse(readFileSync(rawPath, "utf8")) as RawPaper;
    if (!values["crop-only"] && (await refineFigures(raw, qpHigh, key))) writeFileSync(rawPath, JSON.stringify(raw, null, 2));
    const figs = await cropFigures(raw, qpHigh, join(ROOT, "content/mocks/figures", key));
    console.log(`  ✓ ${figs.length} figure(s) cropped`);
    return;
  }

  const validCodes = new Set(los.map((l) => l.code));
  const topics = await topicMap([...validCodes]);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const figureUrl = (id: string) => `${supabaseUrl}/storage/v1/object/public/media/mocks/${key}/${id}.png`;
  const totals = expectedTotals(qpText);

  const rawPath = join(dir, "raw.json");
  let raw: RawPaper | null = !values.force && existsSync(rawPath) ? (JSON.parse(readFileSync(rawPath, "utf8")) as RawPaper) : null;
  const messages: Message[] = [];
  if (!raw) {
    const img = (p: string): Content => ({ type: "image_url", image_url: { url: `data:image/png;base64,${readFileSync(p).toString("base64")}`, detail: "high" } });
    messages.push(
      { role: "system", content: "You are a meticulous senior examiner who converts exam papers into structured data. You reply with JSON only." },
      {
        role: "user",
        content: [
          { type: "text", text: buildPrompt(year, paper, los, qpImages.length, msImages.length) },
          ...qpImages.flatMap((p, i): Content[] => [{ type: "text", text: `QP page ${i + 1}` }, img(p)]),
          ...msImages.flatMap((p, i): Content[] => [{ type: "text", text: `MS page ${i + 1}` }, img(p)]),
          { type: "text", text: `QUESTION PAPER — text layer:\n${pagesOf(qpText).map((t, i) => `=== QP page ${i + 1} ===\n${t}`).join("\n")}` },
          { type: "text", text: `MARK SCHEME — text layer:\n${pagesOf(msText).map((t, i) => `=== MS page ${i + 1} ===\n${t}`).join("\n")}` },
        ],
      },
    );
  }

  let result: ReturnType<typeof toMock> = { mock: null, errors: ["not generated"] };
  for (let round = 0; round < 3; round++) {
    if (!raw) {
      const reply = await chat(messages);
      messages.push({ role: "assistant", content: reply });
      try {
        raw = JSON.parse(reply) as RawPaper;
      } catch {
        messages.push({ role: "user", content: "That was not valid JSON. Reply with the complete corrected JSON only." });
        continue;
      }
      writeFileSync(join(dir, `raw-${round}.json`), JSON.stringify(raw, null, 2));
    }
    result = toMock(raw, { year, paper, key, figureUrl, topics, validCodes });
    if (result.mock) result.errors.push(...marksErrors(result.mock, totals, paper));
    if (result.errors.length === 0) break;
    console.log(`  ✗ ${result.errors.length} problem(s):\n    ${result.errors.slice(0, 15).join("\n    ")}`);
    if (round === 2 || messages.length === 0) {
      if (messages.length === 0) {
        // cached raw output with problems: regenerate from scratch next time with --force
        console.log("  (cached result; run with --force to regenerate)");
      }
      break;
    }
    messages.push({
      role: "user",
      content: `Fix these problems and reply with the COMPLETE corrected JSON (same shape):\n- ${result.errors.join("\n- ")}`,
    });
    raw = null;
  }
  if (!raw || !result.mock || result.errors.length) {
    console.log(`  ✗ ${key} not written (problems above).`);
    return;
  }
  if (messages.length) await refineFigures(raw, qpHigh, key); // only for a fresh model answer
  writeFileSync(rawPath, JSON.stringify(raw, null, 2));

  const figDir = join(ROOT, "content/mocks/figures", key);
  const figs = await cropFigures(raw, qpHigh, figDir);
  const mock = { ...result.mock, teacher_resources: [{ label: "Question paper (PDF)", path: `${year}/${files.qp}` }, { label: "Mark scheme (PDF)", path: `${year}/${files.ms}` }] };
  writeFileSync(join(ROOT, "content/mocks", `${key}.json`), JSON.stringify(mock, null, 2) + "\n");
  const parts = mock.questions.reduce((n, q) => n + (q.type === "structured" ? (q.parts?.length ?? 0) : 1), 0);
  console.log(`  ✓ content/mocks/${key}.json — ${mock.questions.length} questions, ${parts} parts, ${figs.length} figures`);

  if (values.apply) {
    const r = await pushMock({
      mock,
      figures: figs.map((f) => ({ file: f, path: `mocks/${key}/${f.split("/").pop()}` })),
      pdfs: [
        { file: join(PAPERS_DIR, files.qp), path: `${year}/${files.qp}` },
        { file: join(PAPERS_DIR, files.ms), path: `${year}/${files.ms}` },
      ],
      status: values.draft ? "draft" : "published",
    });
    console.log(`  ✓ uploaded: ${r.note}`);
  }
}

async function main() {
  const years = positionals.length ? positionals.map(Number) : [2023, 2024, 2025];
  const papers = values.paper ? [Number(values.paper)] : [1, 2, 3];
  const los = specObjectives();
  const jobs = years.flatMap((y) => papers.map((p) => [y, p] as const));
  // A few papers at a time.
  let next = 0;
  const failures: string[] = [];
  await Promise.all(
    Array.from({ length: Math.min(3, jobs.length) }, async () => {
      while (next < jobs.length) {
        const [y, p] = jobs[next++];
        try {
          await importOne(y, p, los);
        } catch (e) {
          failures.push(`nis-${y}-p${p}: ${(e as Error).message}`);
          console.error(`  ✗ nis-${y}-p${p}: ${(e as Error).message}`);
        }
      }
    }),
  );
  console.log(`\nOpenAI: ${usage.calls} call(s), ${usage.input} input + ${usage.output} output tokens (${MODEL})`);
  if (failures.length) {
    console.log(`Failed:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
