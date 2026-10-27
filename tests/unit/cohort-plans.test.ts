import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const { placementsFor, plansFor } = await import("@/lib/curriculum");

const plan = (grade: number, forStudentGrade: number | null) => ({
  grade,
  forStudentGrade,
  key: forStudentGrade ? `${grade}-for-${forStudentGrade}` : String(grade),
  title: `Grade ${grade}`,
  terms: [],
});
const tree = [plan(11, null), plan(11, 12), plan(12, null)];

describe("plansFor", () => {
  it("gives Grade 12 students the 2025-26 Grade 11 plan instead of the new one", () => {
    expect(plansFor(tree, { role: "student", grade: 12 }).map((g) => g.key)).toEqual(["11-for-12", "12"]);
  });
  it("leaves Grade 11 students on the new plan", () => {
    expect(plansFor(tree, { role: "student", grade: 11 }).map((g) => g.key)).toEqual(["11", "12"]);
  });
  it("shows staff every plan", () => {
    expect(plansFor(tree, { role: "teacher", grade: null })).toHaveLength(3);
  });
});

describe("placementsFor", () => {
  const school = [
    { grade: 11, forStudentGrade: null, unitCode: "11.1A" },
    { grade: 11, forStudentGrade: 12, unitCode: "11.4B" },
  ];
  it("shows each student the placement in their own plan", () => {
    expect(placementsFor(school, tree, { role: "student", grade: 12 }).map((s) => s.unitCode)).toEqual(["11.4B"]);
    expect(placementsFor(school, tree, { role: "student", grade: 11 }).map((s) => s.unitCode)).toEqual(["11.1A"]);
  });
});
