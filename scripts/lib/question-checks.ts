import type { AuthoredPart, AuthoredQuestion } from "../../src/lib/content/schema";
import { DETERMINISTIC_TYPES } from "../../src/lib/questions/types";

// Consistency checks beyond the schema: things that would make auto-marking wrong.

/** Checks of one answerable question (a standalone question or one part of a structured question). */
export function checkOne(
  qq: AuthoredQuestion | AuthoredPart,
  allowedRefs: string[],
  errors: string[],
  opts: { pastPaper?: boolean } = {},
) {
  for (const ref of qq.objectives) if (!allowedRefs.includes(ref)) errors.push(`${qq.key}: objective ${ref} is not in this topic's list (keep codes exactly, including @paper)`);
  const acc = qq.scheme.accepted ?? {};
  const c = qq.content ?? {};
  if (qq.type === "mcq" && !opts.pastPaper && qq.options?.length !== 4) errors.push(`${qq.key}: mcq needs exactly 4 options`);
  if (qq.type === "multiple_response" && !opts.pastPaper && Array.isArray(acc.correct) && qq.marks !== acc.correct.length) {
    errors.push(`${qq.key}: multiple_response marks (${qq.marks}) must equal the number of correct options (${acc.correct.length})`);
  }
  if (qq.type === "true_false" && typeof acc.correct !== "boolean") errors.push(`${qq.key}: true_false needs accepted.correct true/false`);
  if (qq.type === "matching") {
    const left = new Set((c.left ?? []).map((x) => x.key));
    const right = new Set((c.right ?? []).map((x) => x.key));
    const pairs = acc.pairs ?? {};
    if (left.size !== right.size) errors.push(`${qq.key}: matching needs the same number of left and right items`);
    for (const [l, rr] of Object.entries(pairs)) if (!left.has(l) || !right.has(rr)) errors.push(`${qq.key}: pair ${l}→${rr} uses an unknown key`);
    if (Object.keys(pairs).length !== left.size) errors.push(`${qq.key}: every left item needs a pair`);
  }
  if (qq.type === "fill_blank") {
    const n = (qq.text.match(/\[\[\d+\]\]/g) ?? []).length;
    if (c.blank_count !== n) errors.push(`${qq.key}: content.blank_count must be ${n}`);
  }
  if (qq.type === "trace_table") {
    const cols = c.columns?.length ?? 0;
    if (!cols || !c.rows) errors.push(`${qq.key}: trace_table needs content.columns and content.rows`);
    if (acc.rows && acc.rows.length !== c.rows) errors.push(`${qq.key}: accepted.rows must have exactly content.rows (${c.rows}) rows`);
    if (acc.rows?.some((r) => r.length !== cols)) errors.push(`${qq.key}: every accepted row needs ${cols} cells`);
  }
  if (qq.grading === "AUTO" && !(DETERMINISTIC_TYPES as readonly string[]).includes(qq.type)) errors.push(`${qq.key}: ${qq.type} cannot be AUTO`);
  if ((qq.grading === "AI" || qq.grading === "HYBRID")) {
    const total = (qq.scheme.points ?? []).reduce((s, p) => s + p.marks, 0);
    if (total < qq.marks) errors.push(`${qq.key}: marking points total ${total} is less than ${qq.marks} marks`);
  }
  if (qq.type === "table_completion") {
    const cols = c.columns?.length ?? 0;
    if (!cols || !c.rows) errors.push(`${qq.key}: table_completion needs content.columns and content.rows`);
    if (c.prefill && c.prefill.length !== c.rows) errors.push(`${qq.key}: content.prefill must have content.rows rows`);
    if (acc.rows && acc.rows.length !== c.rows) errors.push(`${qq.key}: accepted.rows must have content.rows rows`);
  }
  if (qq.type === "labelled_answers" && qq.grading === "AUTO") {
    for (const f of c.fields ?? []) if (!acc.fields?.[f.key]?.length) errors.push(`${qq.key}: AUTO labelled_answers needs accepted.fields.${f.key}`);
  }
}

