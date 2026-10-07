import { readFileSync } from "node:fs";
import { join } from "node:path";
import { splitLoRef } from "../../src/lib/content/ids";

// Builds the {{TOPIC_BLOCK}} text used by docs/PROMPTS.md (same content as docs/TOPICS.md).

const ROOT = join(__dirname, "..", "..");

type Programme = {
  objectives: { code: string; description: string }[];
  papers: { number: number; groups: { sections: { code: string; title: string }[] }[] }[];
  objective_papers: Record<string, { paper: number; section: string }>;
  grades: { number: number; terms: { title: string; units: { code: string; title: string; topics: { slug: string; title: string; objectives: string[] }[] }[] }[] }[];
  exam_only_topics?: { slug: string; title: string; objectives: string[] }[];
  paper_links?: Record<string, string[]>;
};
type Spec = { papers: { number: number; groups: { sections: { code: string; objectives: { code: string; description: string }[] }[] }[] }[] };

export type TopicInfo = { slug: string; title: string; placement: string; refs: string[]; block: string; examOnly: boolean };

export function getTopicInfo(slug: string): TopicInfo {
  const programme: Programme = JSON.parse(readFileSync(join(ROOT, "content/curriculum/NIS_CS_2026_2027.json"), "utf8"));
  const spec: Spec = JSON.parse(readFileSync(join(ROOT, "content/curriculum/exam_spec.json"), "utf8"));
  const ktp = new Map(programme.objectives.map((o) => [o.code, o.description]));
  const specLo = new Map<string, { description: string; paper: number; section: string }>();
  for (const p of spec.papers) for (const g of p.groups) for (const s of g.sections) for (const o of s.objectives) {
    specLo.set(o.code, { description: o.description, paper: p.number, section: s.code });
  }
  const sectionTitle = new Map<string, string>(programme.papers.flatMap((p) => p.groups.flatMap((g) => g.sections.map((s) => [`${p.number}|${s.code}`, s.title] as [string, string]))));

  let found: { title: string; placement: string; objectives: string[]; examOnly: boolean } | null = null;
  for (const g of programme.grades) for (const t of g.terms) for (const u of t.units) for (const tp of u.topics) {
    if (tp.slug === slug) found = { title: tp.title, placement: `Grade ${g.number} · ${t.title} · ${u.code} ${u.title}`, objectives: tp.objectives, examOnly: false };
  }
  const exam = programme.exam_only_topics?.find((t) => t.slug === slug);
  if (exam) found = { title: exam.title, placement: "Exam only — Paper 1-2-3 specification", objectives: exam.objectives, examOnly: true };
  if (!found) throw new Error(`Unknown topic ${slug}`);

  const refs = [...found.objectives, ...(programme.paper_links?.[slug] ?? [])];
  const describe = (ref: string) => {
    const { code, paper } = splitLoRef(ref);
    return paper ? specLo.get(code)?.description : ktp.get(code);
  };
  const papers = new Set<string>();
  for (const ref of refs) {
    const { code, paper } = splitLoRef(ref);
    const m = paper ? specLo.get(code) : programme.objective_papers[code];
    if (m) papers.add(`${m.paper}|${m.section}`);
  }
  const block = [
    `TOPIC_SLUG: ${slug}`,
    `TOPIC_TITLE: ${found.title}`,
    `PLACEMENT: ${found.placement}`,
    `PAPER: ${[...papers].sort().map((k) => `Paper ${k.split("|")[0]} — ${k.split("|")[1]} ${sectionTitle.get(k) ?? ""}`).join("; ")}`,
    "LEARNING_OBJECTIVES:",
    ...refs.map((r) => `- ${r} ${describe(r)}`),
  ].join("\n");
  return { slug, title: found.title, placement: found.placement, refs, block, examOnly: found.examOnly };
}

/** Extracts prompt N's text (the ````text block after "## Prompt N") from docs/PROMPTS.md. */
export function loadPrompt(n: 1 | 2): string {
  const doc = readFileSync(join(ROOT, "docs/PROMPTS.md"), "utf8");
  const start = doc.indexOf(`## Prompt ${n}`);
  if (start < 0) throw new Error(`Prompt ${n} not found in docs/PROMPTS.md`);
  const open = doc.indexOf("````text", start);
  const close = doc.indexOf("````", open + 8);
  if (open < 0 || close < 0) throw new Error(`Prompt ${n} block not found in docs/PROMPTS.md`);
  return doc.slice(open + "````text".length, close).trim();
}
