import type { TheoryBlock } from "../theory/blocks";

// Compact plain-text version of a theory pack, used once per topic to derive
// the notes checklist. Diagrams, code, images and interactive widgets are left
// out: they cost tokens and a student's notes are checked for ideas, not for
// copied listings.

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);
const plain = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim();

function blockText(b: TheoryBlock): string | null {
  switch (b.type) {
    case "heading":
      return `### ${b.text}`;
    case "paragraph":
      return clip(plain(b.content), 500);
    case "definition":
      return `DEFINITION ${b.term}: ${clip(plain(b.content), 400)}`;
    case "callout":
    case "warning":
    case "exam_tip":
      return clip(plain(b.content), 250);
    case "example":
      // worked exam answers repeat the theory; a short extract is enough
      return /exam/i.test(b.title ?? "") ? null : `Example${b.title ? ` (${b.title})` : ""}: ${clip(plain(b.content), 250)}`;
    case "comparison":
      return [b.title ? `${b.title}:` : null, b.columns.join(" | "), ...b.rows.slice(0, 12).map((r) => clip(r.map(plain).join(" | "), 260))]
        .filter(Boolean)
        .join("\n");
    case "steps":
      return [b.title ? `${b.title}:` : null, ...b.items.slice(0, 10).map((x, i) => `${i + 1}. ${clip(plain(x), 160)}`)].filter(Boolean).join("\n");
    case "list":
      return b.items.slice(0, 12).map((x) => `- ${clip(plain(x), 160)}`).join("\n");
    case "cards":
      return b.items.map((c) => `${c.title}: ${clip(plain(c.content), 300)}`).join("\n");
    case "formula":
      return `Formula: ${b.latex}`;
    default:
      return null;
  }
}

export function theoryToText(sections: { title: string; blocks: TheoryBlock[] }[], maxChars = 16000): string {
  const text = sections
    .filter((s) => !/exam practice|summary/i.test(s.title))
    .map((s) => [`## ${s.title}`, ...s.blocks.map(blockText).filter((x): x is string => Boolean(x))].join("\n"))
    .join("\n\n");
  return clip(text, maxChars);
}
