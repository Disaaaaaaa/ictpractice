import type { AcceptedAnswers, AnswerData, QuestionType } from "../questions/types";
import { compileCircuit, equivalentTo, expressionFunction, treeLevelOrder } from "../diagrams";

export type MarkingPointResult = { criterion: string; awarded: boolean; comment?: string };

export type DeterministicResult =
  | {
      decided: true;
      awarded: number;
      max: number;
      points: MarkingPointResult[];
      feedback: string;
      /** true when every item was correct */
      fullyCorrect: boolean;
    }
  | { decided: false; reason: string };

const undecided = (reason: string): DeterministicResult => ({ decided: false, reason });

export function normalizeText(
  value: string,
  opts: { caseSensitive?: boolean; ignoreSpaces?: boolean } = {},
): string {
  let s = value.normalize("NFKC").trim();
  s = s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  s = s.replace(/[.;,]+$/, "");
  s = opts.ignoreSpaces ? s.replace(/\s+/g, "") : s.replace(/\s+/g, " ");
  return opts.caseSensitive ? s : s.toLowerCase();
}

function parseNumber(value: string): number | null {
  const s = value.replace(/[\s,]/g, "").replace(/[^0-9eE+\-.]/g, "");
  if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function matchesValue(answer: string, accepted: AcceptedAnswers): boolean {
  const values = accepted.values ?? [];
  if (!answer.trim()) return false;
  if (accepted.numeric) {
    const n = parseNumber(answer);
    if (n === null) return false;
    const tol = accepted.tolerance ?? 1e-9;
    return values.some((v) => {
      const target = parseNumber(v);
      return target !== null && Math.abs(target - n) <= tol;
    });
  }
  const opts = {
    caseSensitive: accepted.case_sensitive,
    ignoreSpaces: accepted.ignore_spaces,
  };
  const a = normalizeText(answer, opts);
  return values.some((v) => normalizeText(v, opts) === a);
}

/** Scale a count of correct items to the question's marks (floor, as in exam mark schemes). */
function scale(correct: number, total: number, marks: number, scoring: "item" | "all" = "item"): number {
  if (total <= 0) return 0;
  if (scoring === "all") return correct === total ? marks : 0;
  return Math.floor((correct * marks) / total + 1e-9);
}

/**
 * Marks objective questions. Returns `decided: false` when the question needs a
 * human or AI examiner (no answer key, free text, or a HYBRID miss).
 */
export function gradeDeterministic(
  type: QuestionType,
  marks: number,
  accepted: AcceptedAnswers | null | undefined,
  answer: AnswerData | null | undefined,
): DeterministicResult {
  const key = accepted ?? {};
  const a = answer ?? {};

  switch (type) {
    case "mcq": {
      if (typeof key.correct !== "string") return undecided("missing answer key");
      const ok = typeof a.selected === "string" && a.selected === key.correct;
      return {
        decided: true,
        awarded: ok ? marks : 0,
        max: marks,
        fullyCorrect: ok,
        points: [{ criterion: "Selects the correct option", awarded: ok }],
        feedback: ok ? "Correct." : a.selected ? "Incorrect option selected." : "No option selected.",
      };
    }

    case "true_false": {
      if (typeof key.correct !== "boolean") return undecided("missing answer key");
      const ok = typeof a.value === "boolean" && a.value === key.correct;
      return {
        decided: true,
        awarded: ok ? marks : 0,
        max: marks,
        fullyCorrect: ok,
        points: [{ criterion: `Identifies the statement as ${key.correct ? "true" : "false"}`, awarded: ok }],
        feedback: ok ? "Correct." : "Incorrect.",
      };
    }

    case "multiple_response": {
      if (!Array.isArray(key.correct)) return undecided("missing answer key");
      const correct = new Set(key.correct);
      const chosen = new Set(Array.isArray(a.selected) ? a.selected : []);
      let hits = 0;
      let wrong = 0;
      for (const c of chosen) {
        if (correct.has(c)) hits++;
        else wrong++;
      }
      // One mark per correct option, minus one per wrong selection (never below zero).
      const net = Math.max(0, hits - wrong);
      const awarded = scale(net, correct.size, marks, key.scoring);
      return {
        decided: true,
        awarded,
        max: marks,
        fullyCorrect: hits === correct.size && wrong === 0,
        points: [...correct].map((c) => ({ criterion: `Selects option ${c}`, awarded: chosen.has(c) })),
        feedback:
          wrong > 0
            ? `${hits} of ${correct.size} correct options selected; ${wrong} incorrect selection(s) cost marks.`
            : `${hits} of ${correct.size} correct options selected.`,
      };
    }

    case "matching": {
      const pairs = key.pairs;
      if (!pairs || Object.keys(pairs).length === 0) return undecided("missing answer key");
      const given = a.pairs ?? {};
      const entries = Object.entries(pairs);
      const points = entries.map(([left, right]) => ({
        criterion: `Matches ${left}`,
        awarded: given[left] === right,
      }));
      const hits = points.filter((p) => p.awarded).length;
      return {
        decided: true,
        awarded: scale(hits, entries.length, marks, key.scoring),
        max: marks,
        fullyCorrect: hits === entries.length,
        points,
        feedback: `${hits} of ${entries.length} pairs matched correctly.`,
      };
    }

    case "fill_blank": {
      const blanks = key.blanks;
      if (!blanks || blanks.length === 0) return undecided("missing answer key");
      const given = a.blanks ?? [];
      const points = blanks.map((alternatives, i) => ({
        criterion: `Blank ${i + 1}`,
        awarded: matchesValue(given[i] ?? "", { ...key, values: alternatives }),
      }));
      const hits = points.filter((p) => p.awarded).length;
      return {
        decided: true,
        awarded: scale(hits, blanks.length, marks, key.scoring),
        max: marks,
        fullyCorrect: hits === blanks.length,
        points,
        feedback: `${hits} of ${blanks.length} blanks correct.`,
      };
    }

    case "calculation":
    case "short_answer": {
      if (!key.values || key.values.length === 0) return undecided("free-text answer");
      const given = typeof a.value === "string" ? a.value : (a.text ?? "");
      const ok = matchesValue(given, key);
      return {
        decided: true,
        awarded: ok ? marks : 0,
        max: marks,
        fullyCorrect: ok,
        points: [{ criterion: "Correct final answer", awarded: ok }],
        feedback: ok ? "Correct." : given.trim() ? "The answer does not match the expected value." : "No answer given.",
      };
    }

    case "trace_table": {
      const expected = key.rows;
      if (!expected || expected.length === 0) return undecided("missing answer key");
      const given = a.rows ?? [];
      const points: MarkingPointResult[] = expected.map((row, r) => {
        const cells = row.map((cell, c) =>
          cell === null ? true : matchesValue(given[r]?.[c] ?? "", { ...key, values: [cell], ignore_spaces: true }),
        );
        return { criterion: `Row ${r + 1}`, awarded: cells.every(Boolean) };
      });
      const hits = points.filter((p) => p.awarded).length;
      return {
        decided: true,
        awarded: scale(hits, expected.length, marks, key.scoring),
        max: marks,
        fullyCorrect: hits === expected.length,
        points,
        feedback: `${hits} of ${expected.length} rows completed correctly.`,
      };
    }

    case "table_completion": {
      // Marked cell by cell. "" in the key = the cell must stay empty (e.g. no tick);
      // alternatives are separated by "||"; a tick accepts ✓ ✔ v x + or "yes".
      const expected = key.rows;
      if (!expected || expected.length === 0) return undecided("free-text table");
      const given = a.rows ?? [];
      const TICKS = ["✓", "✔", "v", "x", "+", "yes", "tick"];
      const cellOk = (want: string, got: string) => {
        const g = got.trim();
        if (want.trim() === "") return g === "" || g === "-";
        const alts = want.split("||").map((x) => x.trim());
        if (alts.some((x) => TICKS.includes(x.toLowerCase()))) return TICKS.includes(g.toLowerCase());
        return alts.some((alt) => matchesValue(g, { ...key, values: [alt] }));
      };
      let total = 0;
      let hits = 0;
      const points: MarkingPointResult[] = expected.map((row, r) => {
        let ok = true;
        row.forEach((cell, c) => {
          if (cell === null) return;
          total++;
          if (cellOk(cell, given[r]?.[c] ?? "")) hits++;
          else ok = false;
        });
        return { criterion: `Row ${r + 1}`, awarded: ok };
      });
      return {
        decided: true,
        awarded: scale(hits, total, marks, key.scoring),
        max: marks,
        fullyCorrect: hits === total,
        points,
        feedback: `${hits} of ${total} cells completed correctly.`,
      };
    }

    case "labelled_answers": {
      const fields = key.fields;
      if (!fields || Object.keys(fields).length === 0) return undecided("free-text answers");
      const given = a.fields ?? {};
      const entries = Object.entries(fields);
      const points = entries.map(([k, alternatives]) => ({
        criterion: `Answer ${k}`,
        awarded: matchesValue(given[k] ?? "", { ...key, values: alternatives }),
      }));
      const hits = points.filter((p) => p.awarded).length;
      return {
        decided: true,
        awarded: scale(hits, entries.length, marks, key.scoring),
        max: marks,
        fullyCorrect: hits === entries.length,
        points,
        feedback: `${hits} of ${entries.length} answers correct.`,
      };
    }

    case "boolean_expression": {
      if (!key.expression) return undecided("missing answer key");
      const raw = (a.text ?? (typeof a.value === "string" ? a.value : "")).replace(/^\s*[A-Z]\s*=/i, "");
      let fn;
      try {
        fn = expressionFunction(raw);
      } catch (e) {
        return {
          decided: true,
          awarded: 0,
          max: marks,
          fullyCorrect: false,
          points: [{ criterion: "Equivalent Boolean expression", awarded: false }],
          feedback: `The expression could not be read: ${(e as Error).message}`,
        };
      }
      const eq = equivalentTo(key.expression, fn);
      return {
        decided: true,
        awarded: eq.equivalent ? marks : 0,
        max: marks,
        fullyCorrect: eq.equivalent,
        points: [{ criterion: "Equivalent Boolean expression", awarded: eq.equivalent }],
        feedback: eq.equivalent
          ? "Correct — the expression has the required truth table."
          : `Not equivalent: ${eq.correctRows} of ${eq.totalRows} truth-table rows match.`,
      };
    }

    case "logic_circuit": {
      if (!key.expression) return undecided("missing answer key");
      if (!a.diagram || a.diagram.nodes.length === 0) return undecided("no circuit drawn");
      const c = compileCircuit(a.diagram);
      if ("error" in c) {
        return {
          decided: true,
          awarded: 0,
          max: marks,
          fullyCorrect: false,
          points: [{ criterion: "Circuit produces the required output", awarded: false }],
          feedback: `The circuit cannot be evaluated: ${c.error}`,
        };
      }
      const eq = equivalentTo(key.expression, c.fn, c.inputs);
      return {
        decided: true,
        awarded: eq.equivalent ? marks : 0,
        max: marks,
        fullyCorrect: eq.equivalent,
        points: [{ criterion: "Circuit produces the required output", awarded: eq.equivalent }],
        feedback: eq.equivalent
          ? "Correct — the circuit has the required truth table."
          : `The circuit's output matches ${eq.correctRows} of ${eq.totalRows} truth-table rows.`,
      };
    }

    case "binary_tree": {
      const expected = key.tree;
      if (!expected || expected.length === 0) return undecided("missing answer key");
      if (!a.diagram) return undecided("no tree drawn");
      const t = treeLevelOrder(a.diagram);
      if ("error" in t) {
        return {
          decided: true,
          awarded: 0,
          max: marks,
          fullyCorrect: false,
          points: [{ criterion: "Correct tree", awarded: false }],
          feedback: t.error,
        };
      }
      const norm = (v: string | null | undefined) => (v ? normalizeText(v) : null);
      const positions = expected.map((v, i) => (v === null ? null : i)).filter((i): i is number => i !== null);
      const placed = positions.filter((i) => norm(t[i]) === norm(expected[i])).length;
      // nodes drawn beyond the expected ones cost a mark (misplaced ones already score nothing)
      const extra = t.filter((v) => v !== null).length > positions.length;
      const ok = placed === positions.length && !extra;
      return {
        decided: true,
        awarded: ok ? marks : scale(Math.max(0, placed - (extra ? 1 : 0)), positions.length, marks, key.scoring),
        max: marks,
        fullyCorrect: ok,
        points: [{ criterion: "All nodes in the correct positions", awarded: ok }],
        feedback: `${placed} of ${positions.length} nodes in the correct position${extra ? "; extra nodes were added" : ""}.`,
      };
    }

    default:
      return undecided("free-text answer");
  }
}
