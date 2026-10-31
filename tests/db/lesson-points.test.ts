import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

// Points of a lesson: practice (first attempt of each lesson question), notes
// (best check) and the lesson exam (first attempt), each before the deadline.

let db: Db;
let alice: string;
let teacher: string;
let other: string;
let cls: string;
let topicId: string;
let unitId: string;
let examId: string;
let q1: { id: string; marks: number };
let q2: { id: string; marks: number };
let q3: { id: string; marks: number };

const one = async <T>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows[0];
type Row = { student_id: string; lesson_no: number; practice_awarded: string; practice_max: string; notes_pct: string | null; exam_id: string | null; exam_pct: string | null; exam_pending: boolean };
const points = (who: string) =>
  db.as(who, async () => (await db.query<Row>(`select * from lesson_points($1, $2) order by lesson_no`, [cls, unitId])).rows);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  cls = (await one<{ id: string }>(`insert into classes (name, grade, academic_year, teacher_id) values ('11A', 11, '2026-2027', $1) returning id`, [teacher])).id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, alice]);

  // a topic of the school plan that has a published topic exam
  const t = await one<{ topic_id: string; unit_id: string; exam_id: string }>(
    `select e.topic_id, sp.unit_id, e.id as exam_id from exams e join school_placements sp on sp.topic_id = e.topic_id
      where e.kind = 'topic' and e.status = 'published' limit 1`);
  topicId = t.topic_id;
  unitId = t.unit_id;
  examId = t.exam_id;
  await db.query(`insert into topic_lessons (topic_id, number, title) values ($1, 1, 'First'), ($1, 2, 'Second')`, [topicId]);
  await db.query(`update exams set lesson_no = 1 where id = $1`, [examId]);
  const qs = (await db.query<{ id: string; marks: number }>(
    `select id, marks from questions where topic_id = $1 and practice_enabled and status = 'published' and parent_id is null
        and question_type::text <> 'structured' order by id limit 3`, [topicId])).rows;
  [q1, q2, q3] = qs;
  await db.query(`update questions set lesson_no = 1 where id in ($1, $2)`, [q1.id, q2.id]);
  await db.query(`update questions set lesson_no = 2 where id = $1`, [q3.id]);

  const assign = async (lesson: number, deadline: string) => {
    const a = await one<{ id: string }>(
      `insert into assignments (teacher_id, assignment_type, title, topic_id, lesson_no, available_from, deadline) values ($1, 'topic', 'L', $2, $3, now() - interval '1 day', $4) returning id`,
      [teacher, topicId, lesson, deadline]);
    await db.query(`insert into assignment_targets (assignment_id, class_id) values ($1, $2)`, [a.id, cls]);
  };
  await assign(1, new Date(Date.now() + 86_400_000).toISOString());
  await assign(2, new Date(Date.now() - 3_600_000).toISOString()); // already over

  const practise = (q: string, mark: number, max: number, minutesAgo: number) =>
    db.query(`insert into practice_attempts (student_id, question_id, answer_data, awarded_mark, max_mark, grading_method, created_at)
              values ($1, $2, '{}', $3, $4, 'AUTO', now() - make_interval(mins => $5))`, [alice, q, mark, max, minutesAgo]);
  await practise(q1.id, 0, q1.marks, 30); // first attempt counts
  await practise(q1.id, q1.marks, q1.marks, 10);
  await practise(q2.id, q2.marks, q2.marks, 20);
  await practise(q3.id, q3.marks, q3.marks, 5); // after lesson 2's deadline

  const notes = (pct: number, lesson: number, minutesAgo: number) =>
    db.query(`insert into note_submissions (student_id, topic_id, lesson_no, image_paths, content_hash, rubric_hash, status, percentage, result, created_at)
              values ($1, $2, $3, '{a.jpg}', md5(random()::text), 'r', 'CHECKED', $4, '{}', now() - make_interval(mins => $5))`, [alice, topicId, lesson, pct, minutesAgo]);
  await notes(40, 1, 50);
  await notes(80, 1, 40);
  await notes(90, 2, 1);

  const attempt = await db.as(alice, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id);
  await db.query(`update attempts set status = 'GRADED', submitted_at = now(), percentage = 50 where id = $1`, [attempt]);
}, 60_000);

describe("lesson_points", () => {
  it("counts the first practice attempt, the best notes and the first exam attempt", async () => {
    const [l1] = await points(teacher);
    expect(Number(l1.practice_max)).toBe(q1.marks + q2.marks);
    expect(Number(l1.practice_awarded)).toBe(q2.marks);
    expect(Number(l1.notes_pct)).toBe(80);
    expect(l1.exam_id).toBe(examId);
    expect(Number(l1.exam_pct)).toBe(50);
  });

  it("ignores work done after the lesson's deadline", async () => {
    const [, l2] = await points(teacher);
    expect(Number(l2.practice_max)).toBe(q3.marks);
    expect(Number(l2.practice_awarded)).toBe(0);
    expect(l2.notes_pct).toBeNull();
    expect(l2.exam_id).toBeNull();
  });

  it("shows a student only their own rows and other teachers nothing", async () => {
    expect((await points(alice)).every((r) => r.student_id === alice)).toBe(true);
    expect(await points(alice)).toHaveLength(2);
    expect(await points(other)).toHaveLength(0);
  });

  it("lets students read the lessons of a topic they can see", async () => {
    const rows = await db.as(alice, async () => (await db.query(`select number from topic_lessons where topic_id = $1`, [topicId])).rows);
    expect(rows).toHaveLength(2);
  });
});
