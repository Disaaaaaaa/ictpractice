import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // in 11A, does everything
let carol: string; // in 11A, does nothing
let bob: string; // not targeted
let teacher: string;
let other: string;
let classId: string;
let topicId: string;
let examId: string;
let assignmentId: string;
let sections: string[];
let practice: string[];

type Row = {
  student_id: string;
  theory_done: number; theory_total: number; theory_completed_at: string | null;
  practice_done: number; practice_total: number; practice_needed: number; practice_reached_at: string | null;
  exam_attempt_id: string | null; exam_status: string | null; exam_submitted_at: string | null; exam_percentage: string | null;
};
const progress = (who: string) =>
  db.as(who, async () => (await db.query<Row>(`select * from topic_assignment_progress($1)`, [assignmentId])).rows);
const ids = async (sql: string, params: unknown[]) => (await db.query<{ id: string }>(sql, params)).rows.map((r) => r.id);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  carol = await db.createUser("carol.s", "student", 11);
  bob = await db.createUser("bob.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  [classId] = await ids(`insert into classes (name, grade, academic_year, teacher_id) values ('11A', 11, '2026-2027', $1) returning id`, [teacher]);
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2), ($1, $3)`, [classId, alice, carol]);

  [topicId] = await ids(`select id from topics where slug = 'paper-arrays'`, []);
  [examId] = await ids(`select id from exams where topic_id = $1 and kind = 'topic' and current_version_id is not null`, [topicId]);
  sections = await ids(
    `select s.id from theory_sections s join theory_packs p on p.id = s.theory_pack_id where p.topic_id = $1 and p.status = 'published'`, [topicId]);
  practice = await ids(
    `select q.id from questions q where q.topic_id = $1 and q.status = 'published' and q.practice_enabled
        and q.archived_at is null and q.question_type::text <> 'structured' order by q.created_at, q.id`, [topicId]);

  // The teacher creates the assignment through RLS, exactly as the app does.
  assignmentId = await db.as(teacher, async () => {
    const [id] = await ids(
      `insert into assignments (teacher_id, assignment_type, title, topic_id, exam_id, deadline, theory_deadline, practice_target, integrity_mode)
       values ($1, 'topic', 'Arrays', $2, $3, now() + interval '7 days', now() + interval '2 days', 50, 'monitor') returning id`,
      [teacher, topicId, examId]);
    await db.query(`insert into assignment_targets (assignment_id, class_id) values ($1, $2)`, [id, classId]);
    return id;
  });
}, 60_000);

describe("topic assignment", () => {
  it("needs a topic and a final deadline", async () => {
    await expect(db.query(
      `insert into assignments (teacher_id, assignment_type, title, topic_id, integrity_mode) values ($1, 'topic', 'x', $2, 'monitor')`,
      [teacher, topicId])).rejects.toThrow(/assignments_topic_required/);
    // ...but not an exam: a topic without one is assigned as theory + practice
    await db.query(
      `insert into assignments (teacher_id, assignment_type, title, topic_id, deadline, integrity_mode)
       values ($1, 'topic', 'no exam', $2, now() + interval '1 day', 'monitor')`, [teacher, topicId]);
    await expect(db.query(
      `insert into assignments (teacher_id, assignment_type, title, integrity_mode) values ($1, 'topic_exam', 'x', 'monitor')`,
      [teacher])).rejects.toThrow(/assignments_exam_required/);
  });

  it("starts with every targeted student at zero", async () => {
    const rows = await progress(teacher);
    expect(rows.map((r) => r.student_id).sort()).toEqual([alice, carol].sort());
    expect(sections.length).toBeGreaterThan(1);
    for (const r of rows) {
      expect(r.theory_done).toBe(0);
      expect(r.theory_total).toBe(sections.length);
      expect(r.theory_completed_at).toBeNull();
      expect(r.practice_done).toBe(0);
      expect(r.practice_total).toBe(practice.length);
      expect(r.practice_needed).toBe(Math.ceil(practice.length / 2)); // target 50 %
      expect(r.exam_attempt_id).toBeNull();
    }
  });

  it("tracks theory, practice and the exam", async () => {
    // theory: all but one section, then the last one
    await db.as(alice, async () => {
      for (const s of sections.slice(1)) await db.query(`select mark_theory_viewed($1)`, [s]);
    });
    let [r] = (await progress(teacher)).filter((x) => x.student_id === alice);
    expect(r.theory_done).toBe(sections.length - 1);
    expect(r.theory_completed_at).toBeNull();
    await db.as(alice, async () => db.query(`select mark_theory_viewed($1)`, [sections[0]]));

    // practice: one question short of the target, with a repeated question
    const needed = r.practice_needed;
    const check = (q: string, ago: string) => db.query(
      `insert into practice_attempts (student_id, question_id, answer_data, awarded_mark, max_mark, grading_method, created_at)
       values ($1, $2, '{"text":"x"}', 0, 1, 'AUTO', now() - $3::interval)`, [alice, q, ago]);
    for (const [i, q] of practice.slice(0, needed - 1).entries()) await check(q, `${60 - i} minutes`);
    await check(practice[0], "1 minute"); // a retry is not a new question
    [r] = (await progress(teacher)).filter((x) => x.student_id === alice);
    expect(r.theory_completed_at).not.toBeNull();
    expect(r.practice_done).toBe(needed - 1);
    expect(r.practice_reached_at).toBeNull();

    await check(practice[needed - 1], "30 seconds");
    [r] = (await progress(teacher)).filter((x) => x.student_id === alice);
    expect(r.practice_done).toBe(needed);
    expect(r.practice_reached_at).not.toBeNull();

    // exam through the assignment
    const attemptId = await db.as(alice, async () => {
      const id = (await db.query<{ id: string }>(`select start_attempt($1, $2) as id`, [examId, assignmentId])).rows[0].id;
      await db.query(`select claim_attempt_session($1, 'session-aaaaaaaa', false)`, [id]);
      return id;
    });
    [r] = (await progress(teacher)).filter((x) => x.student_id === alice);
    expect(r.exam_attempt_id).toBe(attemptId);
    expect(r.exam_status).toBe("IN_PROGRESS");
    expect(r.exam_submitted_at).toBeNull();
    await db.as(alice, async () => db.query(`select submit_attempt($1, 'session-aaaaaaaa')`, [attemptId]));
    [r] = (await progress(teacher)).filter((x) => x.student_id === alice);
    expect(r.exam_status).toBe("SUBMITTED");
    expect(r.exam_submitted_at).not.toBeNull();

    const [c] = (await progress(teacher)).filter((x) => x.student_id === carol);
    expect([c.theory_done, c.practice_done, c.exam_attempt_id]).toEqual([0, 0, null]);
  });

  it("shows a student only their own progress, without the mark", async () => {
    await db.query(`update attempts set status = 'GRADED', percentage = 80 where student_id = $1 and exam_id = $2`, [alice, examId]);
    const mine = await progress(alice);
    expect(mine).toHaveLength(1);
    expect(mine[0].student_id).toBe(alice);
    expect(mine[0].exam_status).toBe("GRADED");
    expect(mine[0].exam_percentage).toBeNull();
    const [t] = (await progress(teacher)).filter((x) => x.student_id === alice);
    expect(Number(t.exam_percentage)).toBe(80);
  });

  it("is hidden from students who are not targeted and from other teachers", async () => {
    expect(await progress(bob)).toHaveLength(0);
    expect(await progress(other)).toHaveLength(0);
  });
});
