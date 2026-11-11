import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // in the teacher's class
let bob: string; // in no class
let teacher: string;
let other: string;

const count = (who: string) => db.as(who, async () => (await db.query(`select * from learner_insights`)).rows.length);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  bob = await db.createUser("bob.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  const cls = (await db.query<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('11A', 11, '2026-2027', $1) returning id`, [teacher])).rows[0].id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, alice]);
  for (const s of [alice, bob]) {
    await db.query(`insert into learner_insights (student_id, kind, tag, text) values ($1, 'habit', 'no-scenario-link', 'Answers are not linked to the scenario.')`, [s]);
  }
}, 60_000);

describe("learner insights", () => {
  it("shows a student only their own insights", async () => {
    expect(await count(alice)).toBe(1);
    expect(await count(bob)).toBe(1);
  });

  it("shows a teacher the insights of their own students only", async () => {
    expect(await count(teacher)).toBe(1);
    expect(await count(other)).toBe(0);
  });

  it("keeps one open insight per student and tag", async () => {
    await expect(db.query(`insert into learner_insights (student_id, kind, tag, text) values ($1, 'habit', 'no-scenario-link', 'Again.')`, [alice])).rejects.toThrow(/duplicate key/);
    await db.query(`update learner_insights set resolved_at = now() where student_id = $1`, [alice]);
    await db.query(`insert into learner_insights (student_id, kind, tag, text) values ($1, 'habit', 'no-scenario-link', 'Back again.')`, [alice]);
  });

  it("cannot be written from the browser", async () => {
    await db.as(alice, async () => {
      await expect(db.query(`update learner_insights set text = 'x'`)).rejects.toThrow(/permission denied/);
      await expect(db.query(`insert into learner_insights (student_id, kind, tag, text) values ($1, 'strength', 'ok-tag', 'Fine.')`, [alice])).rejects.toThrow(/permission denied/);
    });
  });

  it("gives skill stats only to the student and their teacher", async () => {
    const run = (who: string, s: string) => db.as(who, async () => (await db.query(`select * from exam_skill_stats($1)`, [s])).rows.length);
    expect(await run(alice, alice)).toBe(0);
    expect(await run(other, alice)).toBe(0);
    await expect(run(bob, alice)).resolves.toBe(0);
  });
});
