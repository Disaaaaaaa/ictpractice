/**
 * Converts a theory-pack HTML file into platform theory blocks.
 *
 *   npm run import:html -- <file.html> [--topic <slug>] [--apply] [--draft]
 *
 * - Finds the topic from the learning-objective codes in the page header
 *   (or use --topic, e.g. g11-web-page-design).
 * - Writes content/topics/<slug>.json (questions already in that file are kept).
 * - --apply also replaces the topic's theory pack in Supabase (needs .env.local).
 * - --draft saves it unpublished so it can be reviewed in Admin → Theory first.
 *
 * Expected HTML (as produced by the theory generator): <header> with LO codes,
 * then <section> elements with <h2>; inside: h3/h4, p, ul/ol, table, pre>code,
 * .callout(.success|.warning|.danger), .card / .concept-grid, .demo (visual result),
 * .diagram. Scripts and external resources are never imported.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parseArgs } from "node:util";
import { parse, HTMLElement, Node, NodeType, TextNode } from "node-html-parser";

// <pre> must be parsed as HTML (its <code> child and entities), not as raw text.
const parseHtml = (html: string) =>
  parse(html, { comment: false, blockTextElements: { script: true, noscript: true, style: true } });
import { pushTheory } from "./lib/push-theory";
import { authoredTopicSchema } from "../src/lib/content/schema";
import { theoryBlocksSchema, type TheoryBlock } from "../src/lib/theory/blocks";
import { splitLoRef } from "../src/lib/content/ids";

const ROOT = join(__dirname, "..");
const LO_RE = /\b\d{2}\.\d+\.\d+\.\d+\b/g;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { topic: { type: "string" }, apply: { type: "boolean", default: false }, draft: { type: "boolean", default: false } },
});
const file = positionals[0];
if (!file) {
  console.error("Usage: npm run import:html -- <file.html> [--topic <slug>] [--apply] [--draft]");
  process.exit(1);
}

type Programme = {
  code: string;
  objectives: { code: string }[];
  grades: { terms: { units: { topics: { slug: string; title: string; objectives: string[] }[] }[] }[] }[];
  exam_only_topics?: { slug: string; title: string; objectives: string[] }[];
  paper_links?: Record<string, string[]>;
};
const programme: Programme = JSON.parse(readFileSync(join(ROOT, "content/curriculum/NIS_CS_2026_2027.json"), "utf8"));
// Topic objectives are LO refs: "11.2.1.1" (KTP) or "11.5.4.1@paper" (Paper specification).
const topics = [
  ...programme.grades.flatMap((g) => g.terms.flatMap((t) => t.units.flatMap((u) => u.topics))),
  ...(programme.exam_only_topics ?? []),
].map((t) => ({ ...t, objectives: [...t.objectives, ...(programme.paper_links?.[t.slug] ?? [])] }));
/** The topic's LO ref for a bare code found in the HTML (KTP preferred if both exist). */
const refFor = (topic: { objectives: string[] }, code: string) =>
  topic.objectives.find((r) => r === code) ?? topic.objectives.find((r) => splitLoRef(r).code === code);

// ---------------------------------------------------------------------------
// Inline HTML → Markdown
// ---------------------------------------------------------------------------
const isEl = (n: Node): n is HTMLElement => n.nodeType === NodeType.ELEMENT_NODE;
const tag = (n: HTMLElement) => n.rawTagName?.toLowerCase() ?? "";
const classes = (n: HTMLElement) => (n.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const hasClass = (n: HTMLElement, c: string) => classes(n).includes(c);

function escapeMd(text: string): string {
  return text.replace(/([\\`*_[\]<])/g, "\\$1");
}

function inline(node: Node): string {
  if (node.nodeType === NodeType.TEXT_NODE) {
    return escapeMd((node as TextNode).text.replace(/\s+/g, " "));
  }
  if (!isEl(node)) return "";
  const t = tag(node);
  const inner = () => node.childNodes.map(inline).join("");
  switch (t) {
    case "strong":
    case "b": {
      const s = inner().trim();
      return s ? `**${s}**` : "";
    }
    case "em":
    case "i": {
      const s = inner().trim();
      return s ? `*${s}*` : "";
    }
    case "code": {
      const s = node.text.replace(/\s+/g, " ");
      const fence = s.includes("`") ? "``" : "`";
      return `${fence}${s}${fence}`;
    }
    case "a": {
      const href = node.getAttribute("href") ?? "";
      const label = inner().trim();
      return /^(https?:|mailto:)/.test(href) ? `[${label}](${href})` : label;
    }
    case "br":
      return "  \n";
    case "span":
      if (hasClass(node, "tag")) return `\`${node.text.trim()}\` `;
      return inner();
    case "script":
    case "style":
      return "";
    default:
      return inner();
  }
}

const md = (node: HTMLElement) =>
  inline(node)
    .replace(/[ \t]+\n/g, (m) => (m.startsWith("  ") ? "  \n" : "\n"))
    .replace(/ {2,}(?!\n)/g, " ")
    .trim();

const BLOCK_TAGS = new Set(["p", "div", "ul", "ol", "pre", "table", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article", "blockquote", "figure"]);

/** Markdown for a container: inline runs become one paragraph, block children their own. */
function blockMd(node: HTMLElement): string {
  const parts: string[] = [];
  let run: Node[] = [];
  const flush = () => {
    const s = run.map(inline).join("").replace(/ {2,}(?!\n)/g, " ").trim();
    if (s) parts.push(s);
    run = [];
  };
  for (const c of node.childNodes) {
    if (!isEl(c) || !BLOCK_TAGS.has(tag(c))) {
      run.push(c);
      continue;
    }
    flush();
    const t = tag(c);
    if (t === "ul" || t === "ol") parts.push(listItems(c).map((x, i) => (t === "ol" ? `${i + 1}. ${x}` : `- ${x}`)).join("\n"));
    else if (t === "pre") parts.push("```\n" + c.text.replace(/\n+$/, "") + "\n```");
    else if (t === "table") {
      const b = tableBlock(c);
      parts.push(b.type === "paragraph" ? b.content : markdownTable(b));
    } else parts.push(blockMd(c));
  }
  flush();
  return parts.filter(Boolean).join("\n\n");
}

function markdownTable(b: TheoryBlock): string {
  if (b.type !== "comparison") return "";
  const line = (r: string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  return [line(b.columns), line(b.columns.map(() => "---")), ...b.rows.map(line)].join("\n");
}

/** Removes anything executable from a live example (it is sandboxed anyway). */
function safeHtml(el: HTMLElement): string {
  const clone = parseHtml(el.outerHTML);
  for (const n of clone.querySelectorAll("script, iframe, object, embed, link, meta")) n.remove();
  for (const n of clone.querySelectorAll("*")) {
    for (const a of Object.keys(n.attributes)) if (/^on/i.test(a) || /^javascript:/i.test(n.getAttribute(a) ?? "")) n.removeAttribute(a);
  }
  return clone.toString();
}

const listItems = (list: HTMLElement) => list.childNodes.filter(isEl).filter((li) => tag(li) === "li").map((li) => blockMd(li));

// ---------------------------------------------------------------------------
// CSS: keep only the rules a live example needs
// ---------------------------------------------------------------------------
const styleText = (() => {
  const doc = parseHtml(readFileSync(file, "utf8"));
  return doc.querySelectorAll("style").map((s) => s.text).join("\n");
})();

function splitRules(css: string): string[] {
  const rules: string[] = [];
  let depth = 0;
  let start = 0;
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === "{") depth++;
    else if (clean[i] === "}") {
      depth--;
      if (depth === 0) {
        rules.push(clean.slice(start, i + 1).trim());
        start = i + 1;
      }
    }
  }
  return rules.filter(Boolean);
}
const allRules = splitRules(styleText);

function cssFor(html: HTMLElement): string {
  const used = new Set<string>();
  for (const el of [html, ...html.querySelectorAll("*")]) for (const c of classes(el)) used.add(c);
  const matches = (selector: string) => [...selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)].some((m) => used.has(m[1]));
  const out: string[] = [];
  for (const rule of allRules) {
    const selector = rule.slice(0, rule.indexOf("{")).trim();
    if (selector === ":root") out.push(rule);
    else if (selector.startsWith("@media")) {
      const inner = splitRules(rule.slice(rule.indexOf("{") + 1, -1)).filter((r) => matches(r.slice(0, r.indexOf("{"))));
      if (inner.length) out.push(`${selector}{${inner.join("\n")}}`);
    } else if (!selector.startsWith("@") && matches(selector)) out.push(rule);
  }
  return out.join("\n");
}

function estimateHeight(html: HTMLElement): number {
  const blocks = html.querySelectorAll("div,p,h1,h2,h3,h4,li,label,input,select,textarea,button,tr,nav,header,footer,section,article").length;
  // Nested boxes (e.g. the box-model diagram) add padding at every level.
  const depth = (n: HTMLElement): number => 1 + Math.max(0, ...n.childNodes.filter(isEl).map(depth));
  return Math.max(120, Math.min(720, 50 + blocks * 28 + (depth(html) - 2) * 36));
}

// ---------------------------------------------------------------------------
// Block conversion
// ---------------------------------------------------------------------------
function detectLanguage(code: string, label?: string): string {
  const l = label?.trim().toLowerCase();
  if (l) return l === "js" ? "javascript" : l;
  const s = code.trim();
  if (/^<!doctype|^<[a-z]/i.test(s)) return "html";
  if (/^\s*(select|insert|update|delete|create|alter|drop)\b/i.test(s)) return "sql";
  if (/[.#a-z*][^{]*\{[^}]*:[^}]*;?\s*\}/i.test(s)) return "css";
  if (/\b(def|print|import)\b/.test(s)) return "python";
  if (/\b(function|const|let|document\.)\b/.test(s)) return "javascript";
  return "text";
}

function tableBlock(table: HTMLElement): TheoryBlock {
  const rows = table.querySelectorAll("tr").map((tr) => tr.childNodes.filter(isEl).filter((c) => ["td", "th"].includes(tag(c))).map(md));
  const head = table.querySelector("thead tr") ? rows[0] : rows[0];
  const body = rows.slice(1);
  const width = head.length;
  if (width >= 2 && width <= 6 && body.length >= 1 && body.every((r) => r.length === width)) {
    return { type: "comparison", columns: head, rows: body };
  }
  const line = (r: string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  return { type: "paragraph", content: [line(head), line(head.map(() => "---")), ...body.map(line)].join("\n") };
}

function cardItem(card: HTMLElement) {
  const titleEl = card.childNodes.filter(isEl).find((c) => ["h3", "h4", "h5", "strong"].includes(tag(c)));
  const clone = parseHtml(card.innerHTML);
  if (titleEl) {
    const first = clone.childNodes.filter(isEl).find((c) => ["h3", "h4", "h5", "strong"].includes(tag(c)));
    first?.remove();
  }
  return { title: titleEl ? titleEl.text.trim() : "", content: blockMd(clone as unknown as HTMLElement) };
}

function convertChildren(node: HTMLElement, out: TheoryBlock[]) {
  const kids = node.childNodes;
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i];
    if (!isEl(c)) {
      const s = inline(c).trim();
      if (s) out.push({ type: "paragraph", content: s });
      continue;
    }
    const t = tag(c);
    if (t === "h2" || t === "script" || t === "style") continue;
    if (t === "h3") out.push({ type: "heading", text: c.text.trim(), level: 2 });
    else if (t === "h4" || t === "h5") out.push({ type: "heading", text: c.text.trim(), level: 3 });
    else if (t === "p") {
      const s = md(c);
      if (s) out.push({ type: "paragraph", content: s });
    } else if (t === "ul" || t === "ol") {
      const items = listItems(c).filter(Boolean);
      if (items.length) out.push({ type: "list", ordered: t === "ol", items });
    } else if (t === "table") out.push(tableBlock(c));
    else if (t === "pre") {
      const prev = kids.slice(0, i).reverse().find(isEl);
      const label = prev && hasClass(prev, "code-label") ? prev.text : undefined;
      const code = c.text.replace(/\n+$/, "");
      out.push({ type: "code", language: detectLanguage(code, label), content: code });
    } else if (t === "span" && hasClass(c, "code-label")) continue;
    else if (hasClass(c, "callout")) {
      const tone = (["success", "warning", "danger"] as const).find((x) => hasClass(c, x)) ?? "info";
      const strong = c.childNodes.filter(isEl).find((x) => tag(x) === "strong");
      const clone = parseHtml(c.innerHTML);
      clone.childNodes.filter(isEl).find((x) => tag(x) === "strong")?.remove();
      out.push({ type: "callout", tone, title: strong?.text.trim() || undefined, content: blockMd(clone as unknown as HTMLElement) });
    } else if (hasClass(c, "demo") || hasClass(c, "diagram")) {
      const body = c.querySelector(".demo-body") ?? c;
      const title = c.querySelector(".demo-title")?.text.trim();
      const html = hasClass(c, "diagram") ? safeHtml(c) : parseHtml(safeHtml(body)).childNodes.filter(isEl)[0]?.innerHTML.trim() ?? "";
      out.push({ type: "html_preview", title: title || (hasClass(c, "diagram") ? "Diagram" : "Visual result"), html, css: cssFor(c), height: estimateHeight(c) });
    } else if (hasClass(c, "card")) {
      out.push({ type: "cards", items: [cardItem(c)] });
    } else if (c.childNodes.filter(isEl).length > 0 && c.childNodes.filter(isEl).every((x) => hasClass(x, "card"))) {
      out.push({ type: "cards", items: c.childNodes.filter(isEl).map(cardItem) });
    } else if (["div", "article", "aside", "figure", "blockquote"].includes(t)) {
      convertChildren(c, out);
    } else {
      const s = md(c);
      if (s) out.push({ type: "paragraph", content: s });
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const doc = parseHtml(readFileSync(file, "utf8"));
  const header = doc.querySelector("header") ?? doc.querySelector("body")!;
  const headerLos = [...new Set(header.text.match(LO_RE) ?? [])];
  const title = doc.querySelector("h1")?.text.trim() ?? basename(file);
  const summary = header.querySelector("p")?.text.replace(/\s+/g, " ").trim();

  let slug = values.topic;
  if (!slug) {
    const scored = topics
      .map((t) => ({ t, score: headerLos.filter((c) => refFor(t, c)).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    if (!scored.length) throw new Error(`No topic matches LOs ${headerLos.join(", ") || "(none found)"}. Use --topic <slug>.`);
    if (scored[1] && scored[1].score === scored[0].score) {
      throw new Error(`Ambiguous topic: ${scored.filter((x) => x.score === scored[0].score).map((x) => x.t.slug).join(", ")}. Use --topic <slug>.`);
    }
    slug = scored[0].t.slug;
  }
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) throw new Error(`Unknown topic ${slug}`);

  const sections = doc.querySelectorAll("main section").length ? doc.querySelectorAll("main section") : doc.querySelectorAll("section");
  const theory = sections.map((sec) => {
    const h2 = sec.querySelector("h2");
    const sectionTitle = (h2?.text ?? "Section").replace(/^\s*\d+(\.\d+)*\.?\s+/, "").trim();
    const refs = (codes: string[]) => [...new Set(codes.map((c) => refFor(topic, c)).filter((r): r is string => !!r))];
    const mentioned = refs(sec.text.match(LO_RE) ?? []);
    const blocks: TheoryBlock[] = [];
    convertChildren(sec, blocks);
    return { title: sectionTitle, objectives: mentioned.length ? mentioned : refs(headerLos), blocks };
  });

  for (const s of theory) {
    const r = theoryBlocksSchema.safeParse(s.blocks);
    if (!r.success) throw new Error(`Section "${s.title}": ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
  }

  const outPath = join(ROOT, "content/topics", `${slug}.json`);
  const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : {};
  const result = authoredTopicSchema.parse({ ...existing, topic: slug, summary: existing.summary ?? summary, theory });
  writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  const counts = new Map<string, number>();
  for (const s of theory) for (const b of s.blocks) counts.set(b.type, (counts.get(b.type) ?? 0) + 1);
  console.log(`✓ ${title}\n  topic: ${slug} (${topic.title})\n  LOs: ${headerLos.join(", ")}\n  ${theory.length} sections, blocks: ${[...counts].map(([k, v]) => `${k} ${v}`).join(", ")}\n  wrote ${outPath}`);

  if (!values.apply) {
    console.log("  (not uploaded — add --apply to publish it to the platform)");
    return;
  }

  const status = values.draft ? "draft" : "published";
  await pushTheory({ slug, title: topic.title, summary: result.summary, sections: theory, status, source: basename(file) });
  console.log(`✓ uploaded to Supabase (${status})`);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
