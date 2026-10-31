import { describe, expect, it } from "vitest";
import { SCHOOL_RULES, backupsNeeded, caesar, charsetSize, crackTime, firstMatch } from "@/lib/theory/security";

describe("caesar", () => {
  it("shifts letters and wraps around", () => {
    expect(caesar("DOG", 3)).toBe("GRJ");
    expect(caesar("xyz", 3)).toBe("abc");
    expect(caesar("FRGH", -3)).toBe("CODE");
    expect(caesar("Hi, 2!", 1)).toBe("Ij, 2!");
  });
});

describe("firewall rules", () => {
  it("uses the first rule that matches", () => {
    expect(firstMatch(SCHOOL_RULES, { port: 443, source: "Internet" })).toBe(0);
    expect(firstMatch(SCHOOL_RULES, { port: 22, source: "IT office" })).toBe(1);
    expect(firstMatch(SCHOOL_RULES, { port: 22, source: "Internet" })).toBe(3);
    expect(firstMatch(SCHOOL_RULES, { port: 3306, source: "Internet" })).toBe(2);
  });
});

describe("password strength", () => {
  it("counts the character set and grows with length", () => {
    expect(charsetSize("abc")).toBe(26);
    expect(charsetSize("aB3!")).toBe(95);
    expect(crackTime("abc")).toBe("less than a second");
    expect(crackTime("Xk9#mQ2$vL7&pR4!")).toMatch(/years/);
  });
});

describe("restoring backups", () => {
  it("needs every incremental but only the last differential", () => {
    expect(backupsNeeded("incremental", 4)).toEqual(["Sunday (full)", "Monday (incremental)", "Tuesday (incremental)", "Wednesday (incremental)"]);
    expect(backupsNeeded("differential", 4)).toEqual(["Sunday (full)", "Wednesday (differential)"]);
    expect(backupsNeeded("differential", 1)).toEqual(["Sunday (full)"]);
  });
});
