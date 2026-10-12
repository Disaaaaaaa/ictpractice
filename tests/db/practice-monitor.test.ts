import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // in the teacher's class
let bob: string; // in nobody's class
let teacher: string;
let other: string;
let classId: string;
let topicId: string;
let qs: { id: string }[]; // the topic's practice questions, in Practice-page order
let total: number;

type Row = {
  student_id: string; question_id: string; state: string; awarded_mark: string | null; max_mark: string | null;
  topic_id: string; question_no: number; total: number; done: number;
};
const monitor = (who: string, cls: string | null = null, topic: string | null = null) =>
  db.as(who, async () => (await db.query<Row>(`select * from practice_monitor($1, $2)`, [cls, topic])).rows);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  bob = await db.createUser("bob.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  classId = (await db.query<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('11A', 11, '2026-2027', $1) returning id`, [teacher])).rows[0].id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [classId, alice]);

  topicId = (await db.query<{ id: string }>(`select id from topics where slug = 'paper-arrays'`)).rows[0].id;
  qs = (await db.query<{ id: string }>(
    `select q.id from questions q left join questions par on par.id = q.parent_id
      where q.topic_id = $1 and q.status = 'published' and q.practice_enabled and q.archived_at is null
        and q.question_type::text <> 'structured'
      order by array_position(array['easy','medium','hard','exam'], coalesce(par.difficulty, q.difficulty)::text),
               coalesce(par.created_at, q.created_at), q.part_order, q.id`, [topicId])).rows;
  total = qs.length;

  const attempt = (student: string, q: string, mark: number, at: string) =>
    db.query(
      `insert into practice_attempts (student_id, question_id, answer_data, awarded_mark, max_mark, grading_method, created_at)
       values ($1, $2, '{"text":"x"}', $3, 2, 'AUTO', now() - $4::interval)`, [student, q, mark, at]);
  await attempt(alice, qs[0].id, 2, "30 minutes");
  await attempt(alice, qs[0].id, 1, "40 minutes"); // a retry of the same question counts once
  await attempt(alice, qs[1].id, 0, "20 minutes");
  await attempt(bob, qs[0].id, 2, "5 minutes");
}, 60_000);

describe("practice monitor", () => {
  it("shows the last checked question and the share of the practice set completed", async () => {
    const rows = await monitor(teacher);
    expect(rows).toHaveLength(1); // bob is not the teacher's student
    const r = rows[0];
    expect(r.student_id).toBe(alice);
    expect(r.question_id).toBe(qs[1].id);
    expect(r.state).toBe("checked");
    expect(Number(r.awarded_mark)).toBe(0);
    expect(r.topic_id).toBe(topicId);
    expect(r.question_no).toBe(2);
    expect(r.total).toBe(total);
    expect(total).toBeGreaterThan(5);
    expect(r.done).toBe(2); // completion counts answered questions, not marks
  });

  it("follows the answer a student is typing without counting it as completed", async () => {
    await db.query(
      `insert into practice_drafts (student_id, question_id, answer_data) values ($1, $2, '{"text":"draft"}')`, [alice, qs[4].id]);
    const [r] = await monitor(teacher, classId);
    expect(r.question_id).toBe(qs[4].id);
    expect(r.state).toBe("typing");
    expect(r.awarded_mark).toBeNull();
    expect(r.question_no).toBe(5);
    expect(r.done).toBe(2);
  });

  it("counts an answer waiting for teacher review as completed", async () => {
    await db.query(`update practice_drafts set result = '{"ok":true}', updated_at = now() where student_id = $1`, [alice]);
    const [r] = await monitor(teacher);
    expect(r.state).toBe("submitted");
    expect(r.done).toBe(3);
  });

  it("can be narrowed to one topic", async () => {
    // alice then checks a question in another topic: that becomes her latest activity
    const otherTopic = (await db.query<{ id: string }>(`select id from topics where slug = 'paper-blockchain'`)).rows[0].id;
    const q = (await db.query<{ id: string }>(
      `select id from questions where topic_id = $1 and status = 'published' and practice_enabled
          and parent_id is null and question_type::text <> 'structured' limit 1`, [otherTopic])).rows[0].id;
    await db.query(
      `insert into practice_attempts (student_id, question_id, answer_data, awarded_mark, max_mark, grading_method)
       values ($1, $2, '{"text":"x"}', 1, 1, 'AUTO')`, [alice, q]);

    const [latest] = await monitor(teacher);
    expect(latest.topic_id).toBe(otherTopic);
    expect(latest.done).toBe(1);

    const [arrays] = await monitor(teacher, null, topicId);
    expect(arrays.topic_id).toBe(topicId);
    expect(arrays.question_id).toBe(qs[4].id);
    expect(arrays.done).toBe(3);
    expect(arrays.total).toBe(total);

    const sql = (await db.query<{ id: string }>(`select id from topics where slug = 'g11-sql'`)).rows[0].id;
    expect(await monitor(teacher, null, sql)).toHaveLength(0); // nobody has practised it
  });

  it("is limited to the caller's own students and to staff", async () => {
    expect(await monitor(other)).toHaveLength(0);
    expect(await monitor(alice)).toHaveLength(0);
    expect(await monitor(bob)).toHaveLength(0);
    // drafts themselves stay private
    await db.as(teacher, async () => {
      expect((await db.query(`select * from practice_drafts`)).rows).toHaveLength(0);
    });
  });
});
