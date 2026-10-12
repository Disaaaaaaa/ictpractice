import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // in 11A
let bob: string; // in no class
let teacher: string; // teaches 11A
let other: string; // teaches 11B
let classA: string;
let classB: string;
let hiddenTopic: string;
let shownTopic: string;
let hiddenExam: string;

const one = async <T>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows[0];
const sees = (who: string, table: "topics" | "exams", id: string) =>
  db.as(who, async () => (await db.query(`select id from ${table} where id = $1`, [id])).rows.length === 1);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  bob = await db.createUser("bob.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  const cls = (name: string, t: string) =>
    one<{ id: string }>(`insert into classes (name, grade, academic_year, teacher_id) values ($1, 11, '2026-2027', $2) returning id`, [name, t]);
  classA = (await cls("11A", teacher)).id;
  classB = (await cls("11B", other)).id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [classA, alice]);
  hiddenTopic = (await one<{ id: string }>(`select id from topics where slug = 'paper-arrays'`)).id;
  shownTopic = (await one<{ id: string }>(`select id from topics where slug = 'paper-blockchain'`)).id;
  hiddenExam = (await one<{ id: string }>(`select id from exams where topic_id = $1 and kind = 'topic' and status = 'published'`, [hiddenTopic])).id;
}, 60_000);

describe("topic visibility per class", () => {
  it("shows every published topic by default", async () => {
    expect(await sees(alice, "topics", hiddenTopic)).toBe(true);
    expect(await sees(alice, "exams", hiddenExam)).toBe(true);
  });

  it("lets only the class teacher (or an admin) hide topics", async () => {
    const hide = (who: string, cls: string) =>
      db.as(who, async () => db.query(`insert into class_hidden_topics (class_id, topic_id, hidden_by) values ($1, $2, $3)`, [cls, hiddenTopic, who]));
    await expect(hide(other, classA)).rejects.toThrow(/row-level security/);
    await expect(hide(alice, classA)).rejects.toThrow(/row-level security/);
    await hide(teacher, classA);
  });

  it("hides the topic and its exam from that class only", async () => {
    expect(await sees(alice, "topics", hiddenTopic)).toBe(false);
    expect(await sees(alice, "exams", hiddenExam)).toBe(false);
    expect(await sees(alice, "topics", shownTopic)).toBe(true);
    expect(await sees(bob, "topics", hiddenTopic)).toBe(true); // not in the class
    expect(await sees(teacher, "topics", hiddenTopic)).toBe(true); // staff see everything
    // hidden topics drop out of joins the app uses to build its navigation
    const n = await db.as(alice, async () =>
      (await db.query(`select 1 from school_placements sp join topics t on t.id = sp.topic_id where t.id = $1`, [hiddenTopic])).rows.length);
    expect(n).toBe(0);
  });

  it("keeps a past result readable", async () => {
    await db.query(`delete from class_hidden_topics where class_id = $1`, [classA]);
    const attempt = await db.as(alice, async () => {
      const id = (await one<{ id: string }>(`select start_attempt($1) as id`, [hiddenExam])).id;
      await db.query(`select claim_attempt_session($1, 'session-aaaaaaaa', false)`, [id]);
      await db.query(`select submit_attempt($1, 'session-aaaaaaaa')`, [id]);
      return id;
    });
    await db.as(teacher, async () => db.query(`insert into class_hidden_topics (class_id, topic_id) values ($1, $2)`, [classA, hiddenTopic]));
    expect(await sees(alice, "topics", hiddenTopic)).toBe(false);
    expect(await sees(alice, "exams", hiddenExam)).toBe(true);
    const joined = await db.as(alice, async () =>
      (await db.query(`select 1 from attempts a join exams e on e.id = a.exam_id where a.id = $1`, [attempt])).rows.length);
    expect(joined).toBe(1);
  });

  it("shows the topic to a student who is also in a class that does not hide it", async () => {
    await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [classB, alice]);
    expect(await sees(alice, "topics", hiddenTopic)).toBe(true);
    await db.query(`update class_members set status = 'removed' where class_id = $1 and student_id = $2`, [classB, alice]);
    expect(await sees(alice, "topics", hiddenTopic)).toBe(false);
  });

  it("always shows an assigned topic", async () => {
    await db.as(teacher, async () => {
      const id = (await one<{ id: string }>(
        `insert into assignments (teacher_id, assignment_type, title, topic_id, deadline, integrity_mode)
         values ($1, 'topic', 'Arrays', $2, now() + interval '3 days', 'monitor') returning id`, [teacher, hiddenTopic])).id;
      await db.query(`insert into assignment_targets (assignment_id, class_id) values ($1, $2)`, [id, classA]);
    });
    expect(await sees(alice, "topics", hiddenTopic)).toBe(true);
    await db.query(`update assignments set archived_at = now() where topic_id = $1`, [hiddenTopic]);
    expect(await sees(alice, "topics", hiddenTopic)).toBe(false);
  });

  it("lets the teacher show the topic again", async () => {
    const r = await db.as(teacher, async () => db.query(`delete from class_hidden_topics where class_id = $1 and topic_id = $2`, [classA, hiddenTopic]));
    expect(r.affectedRows).toBe(1);
    expect(await sees(alice, "topics", hiddenTopic)).toBe(true);
  });
});
