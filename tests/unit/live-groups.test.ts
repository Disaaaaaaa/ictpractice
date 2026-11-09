import { describe, expect, it } from "vitest";
import { groupOf, makeGroups } from "@/lib/live-plan";

const ids = (n: number) => Array.from({ length: n }, (_, i) => `s${i + 1}`);
const seeded = (seed = 1) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

describe("random pairs and groups", () => {
  it("puts every student in exactly one group, the host first", () => {
    for (const [n, size] of [[16, 2], [16, 4], [15, 4], [13, 4], [17, 2], [3, 4], [1, 2]] as const) {
      const g = makeGroups(ids(n), size, 0, seeded(n));
      const all = g.flatMap((x) => x.members);
      expect(new Set(all).size).toBe(n);
      expect(all.length).toBe(n);
      for (const x of g) expect(x.host).toBe(x.members[0]);
    }
  });
  it("never leaves a student alone: an odd one joins a pair, small leftovers join groups", () => {
    expect(makeGroups(ids(17), 2, 0, seeded()).map((g) => g.members.length).sort()).toEqual([2, 2, 2, 2, 2, 2, 2, 3]);
    expect(makeGroups(ids(13), 4, 0, seeded()).map((g) => g.members.length).sort()).toEqual([4, 4, 5]);
    expect(makeGroups(ids(14), 4, 0, seeded()).map((g) => g.members.length).sort()).toEqual([2, 4, 4, 4]);
  });
  it("hands out client cards in turn and finds a student's group", () => {
    const g = makeGroups(ids(16), 4, 3, seeded());
    expect(g.map((x) => x.scenario)).toEqual([0, 1, 2, 0]);
    const state = { groups: { m6: g } };
    expect(groupOf(state, "m6", g[2].members[1])).toBe(g[2]);
    expect(groupOf(state, "m2", "s1")).toBeNull();
  });
});
