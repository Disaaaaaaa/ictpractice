import { describe, expect, it } from "vitest";
import { parseDate, SAMPLE_RECORDS, validateStudent } from "@/lib/theory/validation";

const sample = (label: string) => SAMPLE_RECORDS.find((s) => s.label === label)!.record;
const failed = (label: string) =>
  validateStudent(sample(label))
    .fields.flatMap((f) => f.results.filter((c) => !c.ok).map((c) => `${f.label}:${c.kind}`))
    .sort();

describe("validation checker", () => {
  it("parses only real DD/MM/YYYY dates", () => {
    expect(parseDate("14/03/2009")?.toISOString().slice(0, 10)).toBe("2009-03-14");
    expect(parseDate("31/02/2009")).toBeNull();
    expect(parseDate("2009-03-14")).toBeNull();
    expect(parseDate("29/02/2008")).not.toBeNull();
  });

  it("accepts the valid record and the wrong-but-sensible one", () => {
    expect(validateStudent(sample("A valid record")).accepted).toBe(true);
    // validation cannot tell that the data is wrong
    expect(validateStudent(sample("Passes, but wrong")).accepted).toBe(true);
  });

  it("rejects typing mistakes with the right checks", () => {
    expect(failed("Typing mistakes")).toEqual(
      ["DateOfBirth:Format", "DateOfBirth:Range", "Grade:Lookup", "Mark:Range", "Phone:Format", "Phone:Length", "StudentID:Format"].sort(),
    );
  });

  it("rejects a duplicate primary key", () => {
    expect(failed("Duplicate key")).toEqual(["StudentID:Uniqueness"]);
  });

  it("checks boundaries of the range", () => {
    const r = { ...sample("A valid record") };
    for (const [mark, ok] of [["0", true], ["100", true], ["-1", false], ["101", false], ["7.5", false]] as const) {
      expect(validateStudent({ ...r, mark }).accepted, mark).toBe(ok);
    }
    expect(validateStudent({ ...r, dateOfBirth: "01/01/2005" }).accepted).toBe(true);
    expect(validateStudent({ ...r, dateOfBirth: "31/12/2004" }).accepted).toBe(false);
  });
});
