import type { PaperQuestion } from "./questions/types";

export type MarkRow = { questionId: string; final: number | null; max: number };
export type BreakdownRow = { key: string; label: string; awarded: number; max: number; percent: number | null };

function finish(map: Map<string, BreakdownRow>): BreakdownRow[] {
  return [...map.values()]
    .map((r) => ({ ...r, percent: r.max > 0 ? (100 * r.awarded) / r.max : null }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

/** Score per topic and per learning objective for one attempt (or summed over many). */
export function breakdown(questions: PaperQuestion[], marks: MarkRow[]) {
  const byQ = new Map(marks.map((m) => [m.questionId, m]));
  const topics = new Map<string, BreakdownRow>();
  const los = new Map<string, BreakdownRow>();
  for (const q of questions) {
    const m = byQ.get(q.id);
    const awarded = Number(m?.final ?? 0);
    const max = Number(m?.max ?? q.marks);
    const tKey = q.topic_id ?? "other";
    const t = topics.get(tKey) ?? { key: tKey, label: q.topic_title ?? "Other", awarded: 0, max: 0, percent: null };
    t.awarded += awarded;
    t.max += max;
    topics.set(tKey, t);
    for (const o of q.objectives) {
      const l = los.get(o.id) ?? { key: o.id, label: o.code, awarded: 0, max: 0, percent: null };
      l.awarded += awarded;
      l.max += max;
      los.set(o.id, l);
    }
  }
  return { topics: finish(topics), objectives: finish(los) };
}
