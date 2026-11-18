/**
 * Theory depth per lesson, checked against the minimums in docs/TOPIC_EXPANSION.md §1.
 *
 *   npx tsx scripts/theory-stats.ts <slug> [<slug> …]   # exits 1 if a lesson is below a minimum
 *
 * Words are counted outside SVG / code / mermaid blocks and outside "Exam practice" sections.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const THEORY_MIN = { words: 2500, sections: 3, diagrams: 3, examples: 2, compare: 2, definitions: 4, warnings: 1 };

type Stats = { words: number; sections: number; diagrams: number; examples: number; compare: number; definitions: number; warnings: number };

function splitSections(md: string): Map<string, string> {
  const out = new Map<string, string>();
  let title: string | null = null;
  let buf: string[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^# (.+)$/);
    if (m) {
      if (title) out.set(title.trim(), buf.join("\n"));
      title = m[1];
      buf = [];
    } else buf.push(line);
  }
  if (title) out.set(title.trim(), buf.join("\n"));
  return out;
}

function words(text: string): number {
  const prose = text
    .replace(/:::(svg|mermaid|code|sql)[^\n]*\n[\s\S]*?\n:::/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    .replace(/^(:::.*|@\w+.*)$/gm, "");
  return (prose.match(/[A-Za-z0-9][\w'’-]*/g) ?? []).length;
}

const count = (text: string, re: RegExp) => (text.match(re) ?? []).length;

export function lessonStats(slug: string): { lesson: number; title: string; stats: Stats; missing: string[] }[] {
  const root = join(__dirname, "..");
  const md = readFileSync(join(root, "content", "theory", `${slug}.md`), "utf8");
  const topic = JSON.parse(readFileSync(join(root, "content", "topics", `${slug}.json`), "utf8"));
  const sections = splitSections(md);
  return (topic.lessons ?? []).map((l: { title: string; sections?: string[] }, i: number) => {
    const names = (l.sections ?? []).filter((s) => !/exam practice/i.test(s));
    const body = names.map((n) => sections.get(n.trim()) ?? "").join("\n");
    const stats: Stats = {
      words: words(body),
      sections: names.length,
      diagrams: count(body, /^:::(svg|mermaid)/gm),
      examples: count(body, /^:::example/gm),
      compare: count(body, /^:::compare/gm),
      definitions: count(body, /^:::definition/gm),
      warnings: count(body, /^:::warning/gm),
    };
    const missing = (Object.keys(THEORY_MIN) as (keyof Stats)[])
      .filter((k) => stats[k] < THEORY_MIN[k])
      .map((k) => `${k} ${stats[k]}/${THEORY_MIN[k]}`);
    return { lesson: i + 1, title: l.title, stats, missing };
  });
}

if (require.main === module) {
  const slugs = process.argv.slice(2);
  if (!slugs.length) {
    console.error("usage: tsx scripts/theory-stats.ts <slug> …");
    process.exit(2);
  }
  let bad = false;
  for (const slug of slugs) {
    for (const r of lessonStats(slug)) {
      const s = r.stats;
      const line = `${slug} L${r.lesson}: ${s.words} words, ${s.sections} sections, ${s.diagrams} diagrams, ${s.examples} examples, ${s.compare} compare, ${s.definitions} definitions, ${s.warnings} warnings`;
      console.log(r.missing.length ? `✗ ${line} — below minimum: ${r.missing.join(", ")}` : `✓ ${line}`);
      if (r.missing.length) bad = true;
    }
  }
  process.exit(bad ? 1 : 0);
}
