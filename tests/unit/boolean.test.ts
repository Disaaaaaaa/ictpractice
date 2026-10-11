import { describe, expect, it } from "vitest";
import { evaluateBoolean, parseBoolean, variablesOf } from "@/lib/boolean";

const table = (src: string) => {
  const ast = parseBoolean(src);
  const vars = variablesOf(ast);
  return Array.from({ length: 2 ** vars.length }, (_, i) =>
    evaluateBoolean(ast, Object.fromEntries(vars.map((v, j) => [v, Boolean((i >> (vars.length - 1 - j)) & 1)]))) ? 1 : 0,
  ).join("");
};

describe("parseBoolean", () => {
  it("reads word and symbol operators", () => {
    expect(table("A AND NOT B")).toBe(table("A · ¬B"));
    expect(table("A OR B")).toBe(table("A + B"));
    expect(table("A XOR B")).toBe("0110");
  });

  it("reads a postfix prime as NOT", () => {
    expect(table("A′")).toBe("10");
    expect(table("A'")).toBe("10");
    expect(table("(A + B)′")).toBe(table("NOT (A OR B)"));
    expect(table("A′′")).toBe("01");
  });

  it("treats adjacent terms as AND", () => {
    expect(table("AB")).toBe(table("A AND B"));
    expect(table("A B′ + A′B")).toBe(table("A XOR B"));
    expect(table("A(B + C)")).toBe(table("A AND (B OR C)"));
    expect(table("(A + B)(A + C)")).toBe(table("A + BC"));
  });

  it("keeps keywords intact and rejects nonsense", () => {
    expect(table("A NAND B")).toBe("1110");
    expect(table("A NOR B")).toBe("1000");
    expect(() => parseBoolean("A + ")).toThrow();
    expect(() => parseBoolean("A )")).toThrow();
  });
});
