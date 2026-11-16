import "server-only";
import { runSql, type SqlResultSet } from "./sandbox";
import type { MarkingPointResult } from "../grading/deterministic";
import type { SqlKey } from "../questions/types";

// Marks a written SQL answer by running it and the model solution on the same
// sample database and comparing what they produce:
//  - "rows":    the result of the last SELECT, in any row order
//  - "ordered": the result of the last SELECT, in the same row order (ORDER BY tasks)
//  - "state":   the database afterwards — key.check_query is run after each,
//               and key.probes (statements that must succeed or fail) are tried

export type SqlGrade = { awarded: number; max: number; points: MarkingPointResult[]; feedback: string };

function norm(v: string | null): string {
  if (v === null) return "∅";
  const t = v.trim();
  if (/^-?\d+(\.\d+)?$/.test(t)) return String(Number(t));
  if (t === "t" || t === "true") return "true";
  if (t === "f" || t === "false") return "false";
  return t;
}

const lastSelect = (rs: SqlResultSet[]) => [...rs].reverse().find((r) => r.columns.length > 0) ?? null;

/** Puts the student's columns in the order of the expected ones when the names match. */
function align(got: SqlResultSet, want: SqlResultSet): (string | null)[][] {
  const g = got.columns.map((c) => c.toLowerCase());
  const w = want.columns.map((c) => c.toLowerCase());
  const sameNames = g.length === w.length && w.every((c) => g.includes(c)) && new Set(g).size === g.length;
  if (!sameNames) return got.rows;
  const idx = w.map((c) => g.indexOf(c));
  return got.rows.map((row) => idx.map((i) => row[i]));
}

function sameRows(a: (string | null)[][], b: (string | null)[][], ordered: boolean): boolean {
  if (a.length !== b.length) return false;
  const ka = a.map((r) => JSON.stringify(r.map(norm)));
  const kb = b.map((r) => JSON.stringify(r.map(norm)));
  if (!ordered) {
    ka.sort();
    kb.sort();
  }
  return ka.every((x, i) => x === kb[i]);
}

function compare(got: SqlResultSet | null, want: SqlResultSet, ordered: boolean): { ok: boolean; columnsOk: boolean; why: string } {
  if (!got) return { ok: false, columnsOk: false, why: "Your code did not return any rows to compare (is the SELECT missing?)." };
  if (got.columns.length !== want.columns.length)
    return {
      ok: false,
      columnsOk: false,
      why: `Your result has ${got.columns.length} column${got.columns.length === 1 ? "" : "s"} (${got.columns.join(", ")}); ${want.columns.length} ${want.columns.length === 1 ? "is" : "are"} expected (${want.columns.join(", ")}).`,
    };
  const rows = align(got, want);
  if (rows.length !== want.rows.length)
    return { ok: false, columnsOk: true, why: `Your result has ${rows.length} row${rows.length === 1 ? "" : "s"}; ${want.rows.length} ${want.rows.length === 1 ? "is" : "are"} expected.` };
  if (sameRows(rows, want.rows, ordered)) return { ok: true, columnsOk: true, why: "" };
  if (ordered && sameRows(rows, want.rows, false)) return { ok: false, columnsOk: true, why: "The right rows, but not in the right order." };
  return { ok: false, columnsOk: true, why: "Some values in your result are not the expected ones." };
}

export async function gradeSql(setup: string, key: SqlKey, code: string, max: number): Promise<SqlGrade> {
  const mode = key.check ?? "rows";
  const opts = mode === "state" ? { after: key.check_query, probes: key.probes } : {};
  const [want, got] = [await runSql(setup, key.solution, opts), await runSql(setup, code, opts)];
  if (!want.ok) throw new Error(`model solution does not run: ${want.error}`);

  const half = Math.min(max - 1, Math.floor(max / 2));
  if (!got.ok) {
    return {
      awarded: 0,
      max,
      points: [{ criterion: "The code runs without errors", awarded: false, comment: got.error ?? undefined }],
      feedback: `Your code gave an error: ${got.error}`,
    };
  }

  if (mode === "state") {
    const points: MarkingPointResult[] = [{ criterion: "The code runs without errors", awarded: true }];
    let ok = true;
    let partial = false;
    if (key.check_query) {
      const w = want.after;
      if (!w) throw new Error("check_query returns nothing for the model solution");
      const c = compare(got.after ?? null, w, true);
      points.push({ criterion: key.check_label ?? "The database ends up as required", awarded: c.ok, comment: c.ok ? undefined : c.why });
      ok &&= c.ok;
      partial ||= c.columnsOk;
    }
    if (key.probes?.length) {
      const wrong = key.probes.filter((_, i) => got.probes?.[i] !== want.probes?.[i]);
      points.push({
        criterion: key.probes_label ?? "The table accepts and rejects the right data",
        awarded: wrong.length === 0,
        comment: wrong.length ? `${wrong.length} of ${key.probes.length} test statement${key.probes.length === 1 ? "" : "s"} behaved differently from the expected table.` : undefined,
      });
      ok &&= wrong.length === 0;
    }
    const awarded = ok ? max : partial ? half : 0;
    return { awarded, max, points, feedback: ok ? "Correct — your code does what was asked." : (points.find((p) => !p.awarded)?.comment ?? "Not quite.") };
  }

  const w = lastSelect(want.results);
  if (!w) throw new Error("model solution returns no rows");
  const c = compare(lastSelect(got.results), w, mode === "ordered");
  return {
    awarded: c.ok ? max : c.columnsOk ? half : 0,
    max,
    points: [
      { criterion: "The code runs without errors", awarded: true },
      { criterion: mode === "ordered" ? "Returns the required rows in the required order" : "Returns the required rows and columns", awarded: c.ok, comment: c.ok ? undefined : c.why },
    ],
    feedback: c.ok ? "Correct — your query returns exactly the required result." : c.why,
  };
}
