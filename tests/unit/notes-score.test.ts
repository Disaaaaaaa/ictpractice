import { describe, expect, it } from "vitest";
import { scoreNotes, type RubricPoint } from "@/lib/notes/score";

const rubric: RubricPoint[] = [
  { title: "Definition of an array", must: "An array is a fixed-size set of elements of the same type under one name.", weight: 3 },
  { title: "Index and bounds", must: "Lower and upper bound; length = upper − lower + 1.", weight: 3 },
  { title: "1D or 2D", must: "1D for a list, 2D for a table with rows and columns.", weight: 2 },
  { title: "Out-of-range error", must: "Using an index outside the bounds is a run-time error.", weight: 2 },
];

describe("notes score", () => {
  it("weights the key points: covered = full, partly = half, missing = none", () => {
    const { percentage, result } = scoreNotes(rubric, [
      { n: 1, s: "c" },
      { n: 2, s: "p", note: "upper bound not explained" },
      { n: 3, s: "m" },
      { n: 4, s: "c" },
    ]);
    // (3 + 1.5 + 0 + 2) / 10
    expect(percentage).toBe(65);
    expect(result.points.map((p) => p.status)).toEqual(["covered", "partial", "missing", "covered"]);
  });

  it("advises the most valuable additions first and says what each is worth", () => {
    const { result } = scoreNotes(rubric, [{ n: 1, s: "c" }, { n: 2, s: "p", note: "upper bound not explained" }, { n: 3, s: "m" }, { n: 4, s: "c" }]);
    expect(result.advice.map((a) => [a.kind, a.title, a.gain])).toEqual([
      ["add", "1D or 2D", 20],
      ["complete", "Index and bounds", 15],
    ]);
    expect(result.advice[1].text).toContain("upper bound not explained");
    // following all the advice reaches 100 %
    expect(65 + result.advice.reduce((s, a) => s + a.gain, 0)).toBe(100);
  });

  it("gives 100 % and no advice when everything is covered", () => {
    const { percentage, result } = scoreNotes(rubric, rubric.map((_, i) => ({ n: i + 1, s: "c" as const })));
    expect(percentage).toBe(100);
    expect(result.advice).toEqual([]);
  });

  it("treats a point the model did not report as missing and ignores unknown numbers", () => {
    const { percentage, result } = scoreNotes(rubric, [{ n: 1, s: "c" }, { n: 9, s: "c" }]);
    expect(percentage).toBe(30);
    expect(result.points.filter((p) => p.status === "missing")).toHaveLength(3);
  });

  it("lists factual mistakes as corrections that do not change the score", () => {
    const { percentage, result } = scoreNotes(rubric, rubric.map((_, i) => ({ n: i + 1, s: "c" as const })), ["Says indexes start at 1 in Python", "b", "c", "d"]);
    expect(percentage).toBe(100);
    expect(result.advice).toHaveLength(3);
    expect(result.advice[0]).toMatchObject({ kind: "fix", gain: 0 });
  });
});
