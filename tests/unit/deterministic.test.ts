import { describe, expect, it } from "vitest";
import { gradeDeterministic, matchesValue } from "../../src/lib/grading/deterministic";
import { isAnswerBlank } from "../../src/lib/questions/types";
import { parseBoolean, evaluateBoolean } from "../../src/lib/boolean";

const mark = (r: ReturnType<typeof gradeDeterministic>) => (r.decided ? r.awarded : null);

describe("deterministic grading", () => {
  it("marks MCQ and true/false", () => {
    expect(mark(gradeDeterministic("mcq", 1, { correct: "B" }, { selected: "B" }))).toBe(1);
    expect(mark(gradeDeterministic("mcq", 1, { correct: "B" }, { selected: "A" }))).toBe(0);
    expect(mark(gradeDeterministic("true_false", 1, { correct: false }, { value: false }))).toBe(1);
    expect(mark(gradeDeterministic("true_false", 1, { correct: false }, {}))).toBe(0);
  });

  it("penalises wrong selections in multiple response", () => {
    const key = { correct: ["A", "C"] };
    expect(mark(gradeDeterministic("multiple_response", 2, key, { selected: ["A", "C"] }))).toBe(2);
    expect(mark(gradeDeterministic("multiple_response", 2, key, { selected: ["A", "B"] }))).toBe(0);
    expect(mark(gradeDeterministic("multiple_response", 2, key, { selected: ["A"] }))).toBe(1);
    expect(mark(gradeDeterministic("multiple_response", 2, key, { selected: ["A", "B", "C", "D"] }))).toBe(0);
  });

  it("scales matching, blanks and trace tables (floor)", () => {
    const pairs = { L1: "R1", L2: "R2", L3: "R3", L4: "R4" };
    expect(mark(gradeDeterministic("matching", 2, { pairs }, { pairs: { L1: "R1", L2: "R2", L3: "R4" } }))).toBe(1);
    expect(mark(gradeDeterministic("fill_blank", 2, { blanks: [["E5"], ["3CF"]] }, { blanks: [" e5 ", "3cf"] }))).toBe(2);
    expect(
      mark(gradeDeterministic("trace_table", 2, { rows: [["1", null], ["2", "4"]] }, { rows: [["1", "x"], ["2", "5"]] })),
    ).toBe(1);
  });

  it("compares numbers and normalised strings", () => {
    expect(matchesValue("182.0", { values: ["182"], numeric: true })).toBe(true);
    expect(matchesValue("0100 1101", { values: ["01001101"], ignore_spaces: true })).toBe(true);
    expect(matchesValue("Requirements Specification.", { values: ["requirements specification"] })).toBe(true);
    expect(matchesValue("", { values: [""] })).toBe(false);
  });

  it("defers free text to AI or teacher", () => {
    expect(gradeDeterministic("extended", 4, {}, { text: "answer" }).decided).toBe(false);
    expect(gradeDeterministic("short_answer", 2, {}, { text: "answer" }).decided).toBe(false);
    expect(gradeDeterministic("mcq", 1, {}, { selected: "A" }).decided).toBe(false);
  });
});

describe("helpers", () => {
  it("detects blank answers", () => {
    expect(isAnswerBlank(null)).toBe(true);
    expect(isAnswerBlank({ text: "" })).toBe(true);
    expect(isAnswerBlank({ rows: [["", ""]] })).toBe(true);
    expect(isAnswerBlank({ value: false })).toBe(false);
    expect(isAnswerBlank({ selected: "A" })).toBe(false);
  });

  it("evaluates Boolean expressions", () => {
    const ast = parseBoolean("NOT (A AND B) OR C");
    expect(evaluateBoolean(ast, { A: true, B: true, C: false })).toBe(false);
    expect(evaluateBoolean(parseBoolean("A XOR B"), { A: true, B: false })).toBe(true);
    expect(evaluateBoolean(parseBoolean("A NAND B"), { A: true, B: true })).toBe(false);
  });
});
