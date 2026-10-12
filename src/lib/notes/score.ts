// Notes check: turning the AI's per-point verdicts into a percentage and advice.
// Pure functions — the percentage never comes from the model, so the same
// verdicts always give the same result and it can later be mapped to a mark.

export type RubricPoint = {
  /** short name of the key point */
  title: string;
  /** what a complete set of notes contains for this point */
  must: string;
  /** 3 = essential, 2 = important, 1 = supporting detail */
  weight: number;
};

export type PointStatus = "covered" | "partial" | "missing";
export type CheckedPoint = RubricPoint & { status: PointStatus; note: string };
export type Advice = {
  kind: "add" | "complete" | "fix";
  title: string;
  text: string;
  /** percentage points gained by acting on this advice (0 for corrections) */
  gain: number;
};
export type NoteResult = {
  points: CheckedPoint[];
  errors: string[];
  advice: Advice[];
  /** set when the photos could not be marked */
  reason?: "unreadable" | "off_topic";
};

/** One verdict per checklist point, as returned by the model: c = covered, p = partly, m = missing. */
export type Verdict = { n: number; s: "c" | "p" | "m"; note?: string };

const VALUE: Record<PointStatus, number> = { covered: 1, partial: 0.5, missing: 0 };
const STATUS: Record<Verdict["s"], PointStatus> = { c: "covered", p: "partial", m: "missing" };

export function scoreNotes(rubric: RubricPoint[], verdicts: Verdict[], errors: string[] = []): { percentage: number; result: NoteResult } {
  const byNumber = new Map(verdicts.map((v) => [v.n, v]));
  // A point the model did not report counts as missing.
  const points: CheckedPoint[] = rubric.map((p, i) => {
    const v = byNumber.get(i + 1);
    const status = v ? STATUS[v.s] : "missing";
    return { ...p, status, note: status === "partial" ? (v?.note ?? "").trim().slice(0, 200) : "" };
  });
  const total = points.reduce((s, p) => s + p.weight, 0);
  const earned = points.reduce((s, p) => s + p.weight * VALUE[p.status], 0);
  const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;

  const gain = (p: CheckedPoint) => (total > 0 ? Math.max(1, Math.round(((p.weight * (1 - VALUE[p.status])) / total) * 100)) : 0);
  const advice: Advice[] = [
    // biggest gains first
    ...points
      .filter((p) => p.status !== "covered")
      .sort((a, b) => b.weight * (1 - VALUE[b.status]) - a.weight * (1 - VALUE[a.status]))
      .map((p): Advice =>
        p.status === "missing"
          ? { kind: "add", title: p.title, text: p.must, gain: gain(p) }
          : { kind: "complete", title: p.title, text: p.note ? `${p.note.replace(/[.\s]+$/, "")}. Your notes should include: ${p.must}` : p.must, gain: gain(p) },
      ),
    ...errors.slice(0, 3).map((e): Advice => ({ kind: "fix", title: "Correct a mistake", text: e.trim().slice(0, 300), gain: 0 })),
  ];
  return { percentage, result: { points, errors: errors.slice(0, 3), advice } };
}
