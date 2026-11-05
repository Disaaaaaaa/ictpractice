import { describe, expect, it } from "vitest";
import { gradeDeterministic } from "@/lib/grading/deterministic";
import { erdDegree, markErd } from "@/lib/diagrams";
import type { DiagramData, ErdKey } from "@/lib/questions/types";

const box = (id: string, label: string) => ({ id, type: "er_entity", label, x: 0, y: 0 });
const line = (source: string, target: string, label = "") => ({ id: `${source}-${target}`, source, target, label });

// A gym: a trainer leads many classes; members and classes are many-to-many.
const key: ErdKey = {
  entities: [{ name: "Trainer", key: ["TrainerID", "StaffNumber"] }, { name: "Class", aliases: ["FitnessClass"] }, { name: "Member" }],
  relationships: [
    { a: "Trainer", b: "Class", degree: "1:M" },
    { a: "Member", b: "Class", degree: "M:M" },
  ],
};
const right: DiagramData = {
  nodes: [box("t", "TRAINER\nTrainerID PK\nName"), box("c", "Classes"), box("m", "member")],
  edges: [line("t", "c", "1:M"), line("c", "m", "M:M")],
};
const mark = (d: DiagramData, marks = 6) => {
  const r = gradeDeterministic("erd", marks, { erd: key }, { diagram: d });
  return r.decided ? r.awarded : null;
};

describe("ERD degree labels", () => {
  it("reads the usual ways of writing a degree", () => {
    expect(erdDegree("1:M")).toBe("1:M");
    expect(erdDegree("1:n")).toBe("1:M");
    expect(erdDegree("one-to-many")).toBe("1:M");
    expect(erdDegree("M:1")).toBe("M:1");
    expect(erdDegree("m:n")).toBe("M:M");
    expect(erdDegree("1 - 1")).toBe("1:1");
    expect(erdDegree("teaches")).toBeNull();
    expect(erdDegree(undefined)).toBeNull();
  });
});

describe("ERD marking", () => {
  it("gives full marks for a correct diagram, whatever the case, plurals or direction", () => {
    expect(mark(right)).toBe(6);
    // the same 1:M drawn from Class to Trainer reads M:1
    expect(mark({ ...right, edges: [line("c", "t", "M:1"), line("m", "c", "m:n")] })).toBe(6);
  });

  it("marks entities, identifiers and degrees separately", () => {
    const m = markErd({ ...right, edges: [line("t", "c", "M:1"), line("c", "m", "M:M")] }, key);
    expect(m.entities).toEqual({ found: 3, total: 3 });
    expect(m.keys).toEqual({ found: 1, total: 1 });
    expect(m.relationships).toEqual({ correct: 1, linked: 2, total: 2 });
    expect(mark({ ...right, edges: [line("t", "c", "M:1"), line("c", "m", "M:M")] })).toBe(5); // 5 of 6 items
  });

  it("accepts aliases and an alternative identifier", () => {
    expect(mark({ ...right, nodes: [box("t", "Trainer\nStaff number"), box("c", "Fitness class"), box("m", "Members")] })).toBe(6);
  });

  it("an attribute drawn as an entity, or a missing identifier, costs marks", () => {
    const extra = { ...right, nodes: [...right.nodes, box("x", "Phone")], edges: [...right.edges, line("m", "x", "1:1")] };
    expect(mark(extra)).toBe(4); // 6 items, 2 extra
    expect(mark({ ...right, nodes: [box("t", "Trainer\nName"), box("c", "Class"), box("m", "Member")] })).toBe(5);
  });

  it("nothing drawn is not marked; a missing key is undecided", () => {
    expect(gradeDeterministic("erd", 6, { erd: key }, { diagram: { nodes: [], edges: [] } }).decided).toBe(false);
    expect(gradeDeterministic("erd", 6, {}, { diagram: right }).decided).toBe(false);
  });

  it("does not reveal the answer in the feedback", () => {
    const r = gradeDeterministic("erd", 6, { erd: key }, { diagram: { nodes: [box("t", "Trainer")], edges: [] } });
    expect(r.decided && r.feedback).toContain("1 of 3 entities");
    expect(r.decided && r.feedback).not.toMatch(/Member|Class/);
  });
});

describe("ERD attributes written in different ways", () => {
  it("finds the identifier on one line, after commas or in brackets", () => {
    const k: ErdKey = { entities: [{ name: "Member", key: ["MemberID"] }], relationships: [] };
    for (const label of ["Member\nMemberID, Name, Phone", "Member (MemberID, Name)", "Member: MemberID; Name", "MEMBERS\n_MemberID_ (PK)\nName"]) {
      expect(markErd({ nodes: [box("m", label)], edges: [] }, k).keys.found).toBe(1);
    }
  });
});

describe("many-to-many left in a final-form diagram", () => {
  const k: ErdKey = {
    entities: [{ name: "Doctor" }, { name: "Patient" }, { name: "Treatment" }],
    relationships: [
      { a: "Doctor", b: "Treatment", degree: "1:M" },
      { a: "Patient", b: "Treatment", degree: "1:M" },
    ],
  };
  it("costs marks and says why, without giving the answer", () => {
    const r = gradeDeterministic("erd", 3, { erd: k }, { diagram: { nodes: [box("d", "Doctor"), box("p", "Patient")], edges: [line("d", "p", "M:M")] } });
    expect(r.decided && r.awarded).toBe(0);
    expect(r.decided && r.feedback).toContain("replace it with a link entity");
    expect(r.decided && r.feedback).not.toContain("Treatment");
  });
  it("full marks once the link entity is drawn", () => {
    const d = { nodes: [box("d", "Doctor"), box("p", "Patient"), box("t", "Treatments")], edges: [line("d", "t", "1:M"), line("t", "p", "M:1")] };
    expect(gradeDeterministic("erd", 3, { erd: k }, { diagram: d })).toMatchObject({ decided: true, awarded: 3 });
  });
});
