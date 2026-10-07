/**
 * Builds theory packs from compact Markdown files in content/theory/<slug>.md
 * into content/topics/<slug>.json (questions in that file are kept), and
 * optionally uploads them.
 *
 *   npm run theory:build -- [slug …] [--apply] [--draft]
 *
 * Format (one file per topic):
 *
 *   ---
 *   summary: One or two sentences shown on the topic page.
 *   ---
 *   # Section title
 *   @lo 11.3.1.1, 11.5.4.1@paper
 *
 *   Paragraph text (Markdown). A blank line ends a paragraph.
 *   ## Sub-heading            ### Smaller heading
 *   - bullet list             1. numbered list
 *   $$ latex formula $$ | optional caption
 *   ```python | optional caption
 *   code
 *   ```
 *   :::definition Term        :::example Title       :::tip        :::warning
 *   :::callout info|success|warning|danger Title
 *   :::steps Title            (one "- " item per step)
 *   :::cards                  (### Card title, then its text)
 *   :::compare Title          (Markdown table; the first row gives the columns)
 *   :::mermaid Caption        :::ascii Caption
 *   :::html Title | 220       (HTML, then a line "---css---", then CSS)
 *   :::widget base_converter Title
 *   :::                       closes a ::: block
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { theoryBlockSchema, type TheoryBlock } from "../src/lib/theory/blocks";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { getTopicInfo } from "./lib/topic-block";
import { pushTheory } from "./lib/push-theory";

const ROOT = join(__dirname, "..");
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { apply: { type: "boolean", default: false }, draft: { type: "boolean", default: false } },
});

type Section = { title: string; objectives: string[]; blocks: TheoryBlock[] };

function parseFile(src: string, file: string): { summary?: string; sections: Section[] } {
  const errors: string[] = [];
  let body = src.replace(/\r\n/g, "\n");
  let summary: string | undefined;
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(body);
  if (fm) {
    summary = /summary:\s*(.+)/.exec(fm[1])?.[1]?.trim();
    body = body.slice(fm[0].length);
  }
  const lines = body.split("\n");
  const sections: Section[] = [];
  let cur: Section | null = null;
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const push = (b: TheoryBlock) => {
    if (!cur) {
      errors.push(`content before the first "# Section": ${JSON.stringify(b).slice(0, 80)}`);
      return;
    }
    const r = theoryBlockSchema.safeParse(b);
    if (!r.success) errors.push(`${cur.title}: ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
    else cur.blocks.push(r.data);
  };
  const flushPara = () => {
    if (para.length) push({ type: "paragraph", content: para.join("\n").trim() });
    para = [];
  };
  const flushList = () => {
    if (list) push({ type: "list", ordered: list.ordered || undefined, items: list.items });
    list = null;
  };
  const flush = () => {
    flushPara();
    flushList();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // section
    const sec = /^# (.+)$/.exec(line);
    if (sec) {
      flush();
      cur = { title: sec[1].trim(), objectives: [], blocks: [] };
      sections.push(cur);
      continue;
    }
    const lo = /^@lo\s+(.+)$/.exec(line);
    if (lo && cur) {
      cur.objectives = lo[1].split(/[,\s]+/).filter(Boolean);
      continue;
    }
    // fenced code
    const fence = /^```(\S*)\s*(?:\|\s*(.+))?$/.exec(line);
    if (fence) {
      flush();
      const content: string[] = [];
      for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) content.push(lines[i]);
      push({ type: "code", language: fence[1] || "text", content: content.join("\n"), ...(fence[2] ? { caption: fence[2].trim() } : {}) });
      continue;
    }
    // ::: blocks
    const blk = /^:::(\w+)\s*(.*)$/.exec(line);
    if (blk) {
      flush();
      const kind = blk[1];
      const arg = blk[2].trim();
      const inner: string[] = [];
      for (i++; i < lines.length && !/^:::\s*$/.test(lines[i]); i++) inner.push(lines[i]);
      const text = inner.join("\n").trim();
      const items = () => inner.filter((l) => /^\s*[-*] /.test(l)).map((l) => l.replace(/^\s*[-*] /, "").trim());
      switch (kind) {
        case "definition":
          push({ type: "definition", term: arg, content: text });
          break;
        case "example":
          push({ type: "example", ...(arg ? { title: arg } : {}), content: text });
          break;
        case "tip":
          push({ type: "exam_tip", content: text });
          break;
        case "warning":
          push({ type: "warning", content: text });
          break;
        case "callout": {
          const [tone, ...title] = arg.split(/\s+/);
          push({ type: "callout", tone: tone as "info", ...(title.length ? { title: title.join(" ") } : {}), content: text });
          break;
        }
        case "steps":
          push({ type: "steps", ...(arg ? { title: arg } : {}), items: items() });
          break;
        case "cards": {
          const cards: { title: string; content: string }[] = [];
          for (const l of inner) {
            const h = /^###\s+(.+)$/.exec(l);
            if (h) cards.push({ title: h[1].trim(), content: "" });
            else if (cards.length) cards[cards.length - 1].content += (cards[cards.length - 1].content ? "\n" : "") + l;
          }
          push({ type: "cards", items: cards.map((c) => ({ ...c, content: c.content.trim() })) });
          break;
        }
        case "compare": {
          const rows = inner
            .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l))
            .map((l) =>
              l
                .trim()
                .replace(/^\|/, "")
                .replace(/(?<!\\)\|$/, "")
                .split(/(?<!\\)\|/)
                .map((c) => c.trim().replace(/\\\|/g, "|")),
            );
          push({ type: "comparison", ...(arg ? { title: arg } : {}), columns: rows[0] ?? [], rows: rows.slice(1) });
          break;
        }
        case "mermaid":
        case "ascii":
          push({ type: "diagram", format: kind, content: inner.join("\n"), ...(arg ? { caption: arg } : {}) });
          break;
        case "html": {
          const [title, height] = arg.split("|").map((x) => x.trim());
          const split = inner.findIndex((l) => l.trim() === "---css---");
          const html = (split >= 0 ? inner.slice(0, split) : inner).join("\n").trim();
          const css = split >= 0 ? inner.slice(split + 1).join("\n").trim() : undefined;
          push({ type: "html_preview", ...(title ? { title } : {}), html, ...(css ? { css } : {}), ...(height ? { height: Number(height) } : {}) });
          break;
        }
        case "widget": {
          const [widget, ...title] = arg.split(/\s+/);
          push({ type: "interactive", widget: widget as "base_converter", ...(title.length ? { title: title.join(" ") } : {}) });
          break;
        }
        default:
          errors.push(`unknown block :::${kind}`);
      }
      continue;
    }
    // formula
    const f = /^\$\$(.+)\$\$\s*(?:\|\s*(.+))?$/.exec(line.trim());
    if (f) {
      flush();
      push({ type: "formula", latex: f[1].trim(), ...(f[2] ? { caption: f[2].trim() } : {}) });
      continue;
    }
    // headings
    const h = /^(##|###) (.+)$/.exec(line);
    if (h) {
      flush();
      push({ type: "heading", text: h[2].trim(), level: h[1] === "##" ? 2 : 3 });
      continue;
    }
    // lists
    const li = /^(?:([-*])|(\d+)\.) (.+)$/.exec(line);
    if (li) {
      flushPara();
      const ordered = Boolean(li[2]);
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push(li[3].trim());
      continue;
    }
    if (/^\s{2,}\S/.test(line) && list) {
      list.items[list.items.length - 1] += `\n${line.trim()}`;
      continue;
    }
    if (line.trim() === "") {
      flush();
      continue;
    }
    flushList();
    para.push(line);
  }
  flush();
  for (const s of sections) if (s.blocks.length === 0) errors.push(`${s.title}: empty section`);
  if (errors.length) throw new Error(`${file}:\n  ${errors.join("\n  ")}`);
  return { summary, sections };
}

async function main() {
  const dir = join(ROOT, "content/theory");
  const slugs = positionals.length ? positionals : readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
  let failed = 0;
  for (const slug of slugs) {
    try {
      const { summary, sections } = parseFile(readFileSync(join(dir, `${slug}.md`), "utf8"), `${slug}.md`);
      const info = getTopicInfo(slug);
      const bad = sections.flatMap((s) => s.objectives.filter((o) => !info.refs.includes(o)).map((o) => `${s.title}: ${o}`));
      if (bad.length) throw new Error(`objectives not in this topic: ${bad.join(", ")}`);
      const missing = info.refs.filter((r) => !sections.some((s) => s.objectives.includes(r)));
      if (missing.length) console.log(`  ! ${slug}: no section covers ${missing.join(", ")}`);
      const file = join(ROOT, "content/topics", `${slug}.json`);
      const existing = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { topic: slug, questions: [] };
      const next = authoredTopicSchema.parse({ ...existing, topic: slug, summary: summary ?? existing.summary, theory: sections });
      writeFileSync(file, JSON.stringify({ ...existing, topic: slug, summary: next.summary, theory: next.theory }, null, 2) + "\n");
      const blocks = sections.reduce((n, s) => n + s.blocks.length, 0);
      if (values.apply) {
        await pushTheory({ slug, title: info.title, summary: next.summary, sections: next.theory, status: values.draft ? "draft" : "published", source: `content/theory/${slug}.md` });
      }
      console.log(`✓ ${slug}: ${sections.length} sections, ${blocks} blocks${values.apply ? " — uploaded" : ""}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${(e as Error).message}`);
    }
  }
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
