import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // in the teacher's class
let bob: string; // in no class
let teacher: string;
let other: string;
let topicId: string;

const count = (who: string, table: string) => db.as(who, async () => (await db.query(`select * from ${table}`)).rows.length);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  bob = await db.createUser("bob.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  const cls = (await db.query<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('11A', 11, '2026-2027', $1) returning id`, [teacher])).rows[0].id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, alice]);
  topicId = (await db.query<{ id: string }>(`select id from topics where slug = 'paper-arrays'`)).rows[0].id;

  // written by the server (service role) only
  await db.query(
    `insert into topic_note_rubrics (topic_id, points, source_hash) values ($1, '[{"title":"Array","must":"Definition","weight":3}]', 'h1')`, [topicId]);
  for (const student of [alice, bob]) {
    await db.query(
      `insert into note_submissions (student_id, topic_id, image_paths, content_hash, rubric_hash, status, percentage, result)
       values ($1, $2, array['x/1.jpg'], 'c', 'h1', 'CHECKED', 70, '{"points":[],"errors":[],"advice":[]}')`, [student, topicId]);
  }
}, 60_000);

describe("notes checks", () => {
  it("shows a student only their own checks", async () => {
    expect(await count(alice, "note_submissions")).toBe(1);
    expect(await count(bob, "note_submissions")).toBe(1);
  });

  it("shows a teacher the checks of their own students only", async () => {
    expect(await count(teacher, "note_submissions")).toBe(1);
    expect(await count(other, "note_submissions")).toBe(0);
  });

  it("keeps the checklist for staff", async () => {
    expect(await count(teacher, "topic_note_rubrics")).toBe(1);
    expect(await count(alice, "topic_note_rubrics")).toBe(0);
  });

  it("cannot be written from the browser", async () => {
    await db.as(alice, async () => {
      await expect(db.query(`update note_submissions set percentage = 100`)).rejects.toThrow(/permission denied/);
      await expect(db.query(
        `insert into note_submissions (student_id, topic_id, image_paths, content_hash, rubric_hash, status, percentage, result)
         values ($1, $2, array['a'], 'c', 'h', 'CHECKED', 100, '{}')`, [alice, topicId])).rejects.toThrow(/permission denied/);
    });
    await db.as(teacher, async () => {
      await expect(db.query(`update topic_note_rubrics set points = '[]'`)).rejects.toThrow(/permission denied/);
    });
  });

  it("keeps the percentage within 0–100 and logs AI usage for notes", async () => {
    await expect(db.query(`update note_submissions set percentage = 120`)).rejects.toThrow(/check/);
    await db.query(`insert into ai_usage (context, prompt_tokens) values ('notes', 2500)`);
  });
});
