import { describe, expect, it } from "vitest";
import { gradeDeterministic } from "@/lib/grading/deterministic";
import { bstLevelOrder, compileCircuit, diagramToText, treeLevelOrder } from "@/lib/diagrams";
import type { DiagramData } from "@/lib/questions/types";

const mark = (r: ReturnType<typeof gradeDeterministic>) => (r.decided ? r.awarded : null);

const node = (id: string, type: string, label = "") => ({ id, type, label, x: 0, y: 0 });
const edge = (source: string, target: string, targetHandle?: string, sourceHandle?: string) => ({
  id: `${source}-${target}-${targetHandle ?? sourceHandle ?? ""}`,
  source,
  target,
  targetHandle,
  sourceHandle,
});

// X = (A AND B) OR NOT C
const circuit: DiagramData = {
  nodes: [node("a", "input", "A"), node("b", "input", "B"), node("c", "input", "C"), node("g1", "and"), node("g2", "not"), node("g3", "or"), node("x", "output", "X")],
  edges: [edge("a", "g1", "in1"), edge("b", "g1", "in2"), edge("c", "g2", "in1"), edge("g1", "g3", "in1"), edge("g2", "g3", "in2"), edge("g3", "x", "in")],
};

describe("new exam formats", () => {
  it("labelled answers", () => {
    const key = { fields: { m: ["0.1011"], e: ["0011", "3"] } };
    expect(mark(gradeDeterministic("labelled_answers", 2, key, { fields: { m: "0.1011", e: "3" } }))).toBe(2);
    expect(mark(gradeDeterministic("labelled_answers", 2, key, { fields: { m: "0.1", e: "3" } }))).toBe(1);
    expect(gradeDeterministic("labelled_answers", 2, {}, { fields: { m: "x" } }).decided).toBe(false);
  });

  it("table completion with alternatives", () => {
    const key = { rows: [["RAM||main memory", null], ["ROM", "non-volatile"]] };
    expect(mark(gradeDeterministic("table_completion", 2, key, { rows: [["Main memory", ""], ["rom", "Non-volatile"]] }))).toBe(2);
    expect(gradeDeterministic("table_completion", 2, {}, { rows: [["a"]] }).decided).toBe(false);
  });

  it("boolean expression equivalence", () => {
    const key = { expression: "NOT (A AND B)" };
    expect(mark(gradeDeterministic("boolean_expression", 2, key, { text: "X = NOT A OR NOT B" }))).toBe(2);
    expect(mark(gradeDeterministic("boolean_expression", 2, key, { text: "A NAND B" }))).toBe(2);
    expect(mark(gradeDeterministic("boolean_expression", 2, key, { text: "A OR B" }))).toBe(0);
    expect(mark(gradeDeterministic("boolean_expression", 2, key, { text: "A AND (" }))).toBe(0);
  });

  it("logic circuit evaluation", () => {
    const c = compileCircuit(circuit);
    expect("error" in c).toBe(false);
    expect(mark(gradeDeterministic("logic_circuit", 3, { expression: "A AND B OR NOT C" }, { diagram: circuit }))).toBe(3);
    expect(mark(gradeDeterministic("logic_circuit", 3, { expression: "A AND B AND NOT C" }, { diagram: circuit }))).toBe(0);
    const broken = { ...circuit, edges: circuit.edges.filter((e) => e.target !== "g3" || e.targetHandle !== "in2") };
    const r = gradeDeterministic("logic_circuit", 3, { expression: "A" }, { diagram: broken });
    expect(r.decided && r.awarded === 0 && r.feedback.includes("unconnected")).toBe(true);
    expect(diagramToText("logic_circuit", circuit)).toContain("X = (A AND B) OR (NOT C)");
  });

  it("binary tree", () => {
    const expected = bstLevelOrder(["50", "30", "70", "60"]);
    expect(expected).toEqual(["50", "30", "70", null, null, "60"]);
    const drawn: DiagramData = {
      nodes: [node("r", "tree_node", "50"), node("l", "tree_node", "30"), node("rr", "tree_node", "70"), node("rl", "tree_node", "60")],
      edges: [edge("r", "l", undefined, "left"), edge("r", "rr", undefined, "right"), edge("rr", "rl", undefined, "left")],
    };
    expect(treeLevelOrder(drawn)).toEqual(expected);
    expect(mark(gradeDeterministic("binary_tree", 4, { tree: expected }, { diagram: drawn }))).toBe(4);
    const wrong = { ...drawn, edges: [...drawn.edges.slice(0, 2), edge("rr", "rl", undefined, "right")] };
    expect(mark(gradeDeterministic("binary_tree", 4, { tree: expected }, { diagram: wrong }))).toBe(3);
  });
});

import { comparePartLabels, normalizePartLabel } from "@/lib/questions/parts";
describe("part labels", () => {
  it("sorts and normalises", () => {
    const labels = ["(b)", "(a)(ii)", "(a)", "(a)(i)", "(a)(ix)", "(a)(v)", "(c)"];
    expect([...labels].sort(comparePartLabels)).toEqual(["(a)", "(a)(i)", "(a)(ii)", "(a)(v)", "(a)(ix)", "(b)", "(c)"]);
    expect(normalizePartLabel("b ii")).toBe("(b)(ii)");
    expect(normalizePartLabel("(a)")).toBe("(a)");
  });
});

describe("boolean notation", () => {
  it("accepts * and ¬ as in NIS papers", () => {
    expect(mark(gradeDeterministic("boolean_expression", 1, { expression: "¬(A + B) + A * (¬A + ¬B)" }, { text: "NOT A AND NOT B OR A AND NOT B" }))).toBe(1);
  });
});

describe("table completion cells", () => {
  it("marks ticks, required blanks and alternatives per cell", () => {
    const key = { rows: [[null, "", "✓||tick"], [null, "✓", ""], ["RAM||main memory", null, null]] };
    expect(mark(gradeDeterministic("table_completion", 5, key, { rows: [["", "", "x"], ["", "v", ""], ["Main memory", "", ""]] }))).toBe(5);
    // a tick in a cell that must stay empty costs that cell
    expect(mark(gradeDeterministic("table_completion", 5, key, { rows: [["", "✓", "✓"], ["", "✓", ""], ["RAM", "", ""]] }))).toBe(4);
  });
});
