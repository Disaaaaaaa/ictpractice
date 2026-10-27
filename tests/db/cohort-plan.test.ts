import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

// The 2025-26 Grade 11 KTP for the students now in Grade 12. The seed is loaded
// after the migrations, so the data migration is run again here.
const PLAN = readFileSync(join(__dirname, "../../supabase/migrations/20261027000019_ktp_2025_26_cohort_plan.sql"), "utf8");

let db: Db;
const rows = async <T>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows;

beforeAll(async () => {
  db = await createDb({ seed: true });
  await db.exec(PLAN);
}, 60_000);

describe("cohort plan (2025-26 Grade 11 KTP)", () => {
  it("adds a second Grade 11 plan beside the main one", async () => {
    const g = await rows<{ title: string; for_student_grade: number | null }>(`select title, for_student_grade from grades where number = 11 order by for_student_grade nulls first`);
    expect(g.map((x) => x.for_student_grade)).toEqual([null, 12]);
  });

  it("has four terms and the eleven units of the KTP, placing existing topics only", async () => {
    const units = await rows<{ code: string; term: number }>(
      `select u.code, t.number term from units u join terms t on t.id = u.term_id join grades g on g.id = t.grade_id where g.for_student_grade = 12 order by u.code`,
    );
    expect(units.map((u) => u.code)).toEqual(["11.1A", "11.1B", "11.1C", "11.2A", "11.2B", "11.3A", "11.3B", "11.3C", "11.4A", "11.4B", "11.4C"]);
    expect(units.every((u) => Number(u.code[3]) === u.term)).toBe(true);
    const [{ n }] = await rows<{ n: number }>(
      `select count(*)::int n from school_placements sp join units u on u.id = sp.unit_id join terms t on t.id = u.term_id join grades g on g.id = t.grade_id where g.for_student_grade = 12`,
    );
    expect(n).toBeGreaterThan(40);
  });

  it("puts the exam-only topics of the old programme into the plan", async () => {
    const slugs = await rows<{ slug: string }>(
      `select distinct tp.slug from topics tp join school_placements sp on sp.topic_id = tp.id join units u on u.id = sp.unit_id
       join terms t on t.id = u.term_id join grades g on g.id = t.grade_id where g.for_student_grade = 12 and tp.slug like 'paper-%'`,
    );
    expect(slugs.map((s) => s.slug)).toEqual(expect.arrayContaining(["paper-blockchain", "paper-arrays", "paper-assembly-and-trace-tables"]));
  });

  it("can be run again without duplicating anything", async () => {
    const count = async () => (await rows<{ n: number }>(`select count(*)::int n from school_placements`))[0].n;
    const before = await count();
    await db.exec(PLAN);
    expect(await count()).toBe(before);
  });

  it("still allows only one main plan per grade", async () => {
    await expect(
      db.query(`insert into grades (curriculum_version_id, number, title) select curriculum_version_id, 11, 'dup' from grades where number = 11 limit 1`),
    ).rejects.toThrow(/duplicate key/);
  });
});
