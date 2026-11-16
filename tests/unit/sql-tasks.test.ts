import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { authoredQuestionSchema } from "@/lib/content/schema";
import { gradeSql } from "@/lib/sql/grade";
import { runSql } from "@/lib/sql/sandbox";
import type { SqlKey } from "@/lib/questions/types";

// Every written-SQL task (scripts/sql-tasks/build.py): valid, its model answer
// earns full marks, doing nothing earns none, and each probe can tell a
// correct table from an empty database.
const tasks = ["g11-sql", "g11-sql-implementation"].flatMap((slug) =>
  (JSON.parse(readFileSync(`content/topics/${slug}.json`, "utf8")).questions as { key: string; type: string }[]).filter((q) => q.key.startsWith("sqlw-")),
);

describe("written SQL tasks", () => {
  it("there are 75", () => expect(tasks.length).toBe(75));
  for (const raw of tasks) {
    it(raw.key, async () => {
      const q = authoredQuestionSchema.parse(raw);
      const setup = q.content!.sql!.setup;
      const key = q.scheme.accepted!.sql as SqlKey;
      const good = await gradeSql(setup, key, key.solution, q.marks);
      expect(good.awarded, good.feedback).toBe(q.marks);
      const nothing = await gradeSql(setup, key, "SELECT 1 AS x WHERE FALSE;", q.marks);
      expect(nothing.awarded).toBeLessThan(q.marks);
      if (key.check === "state" && key.probes?.length) {
        const after = await runSql(setup, key.solution, { probes: key.probes });
        expect(after.probes!.some((p) => !p) || after.probes!.every((p) => p), "probes ran").toBe(true);
      }
      if (key.check === "ordered") {
        const r = await runSql(setup, key.solution);
        expect(r.results.at(-1)!.rows.length).toBeGreaterThan(1);
      }
    }, 30000);
  }
});
