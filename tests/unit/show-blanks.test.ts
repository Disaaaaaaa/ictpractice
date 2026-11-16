import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/sql/actions", () => ({ runSqlQuestion: async () => null }));
import { showBlanks } from "@/components/questions/answer-input";

describe("showBlanks", () => {
  it("uses plain gaps inside code and bold gaps in text", () => {
    const t = "Fill [[1]].\n\n```sql\n[[2]] Movies (\n  Title [[3]](255)\n);\n```\nAnd `x [[4]]`.";
    const s = showBlanks(t);
    expect(s).toContain("Fill **(1)** \\_\\_\\_\\_\\_.");
    expect(s).toContain("(2)______ Movies (");
    expect(s).toContain("Title (3)______(255)");
    expect(s).toContain("`x (4)______`");
    expect(s).not.toContain("**(2)**");
  });
});
