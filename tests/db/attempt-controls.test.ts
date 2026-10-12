import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string;
let teacher: string;
let other: string;
let examId: string;
let attemptId: string;
let questionId: string;
const S1 = "session-aaaaaaaa";
const S2 = "session-bbbbbbbb";

const one = async <T>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows[0];
const attempt = () =>
  one<{ status: string; deadline_at: string; score: string | null; violation_count: number; reopened_count: number; extra_seconds: number; grading_status: string | null }>(
    `select status, deadline_at, score, violation_count, reopened_count, extra_seconds, grading_status from attempts where id = $1`, [attemptId]);
const minutesLeft = async () => (new Date((await attempt()).deadline_at).getTime() - Date.now()) / 60_000;

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s");
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  const cls = (await one<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('12A', 12, '2026-2027', $1) returning id`, [teacher])).id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, alice]);
  examId = (await one<{ id: string }>(`select id from exams where kind = 'topic' and status = 'published' limit 1`)).id;
  await db.query(`update exams set integrity_mode = 'auto_submit', max_violations = 1 where id = $1`, [examId]);
  attemptId = await db.as(alice, async () => {
    const id = (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id;
    await db.query(`select claim_attempt_session($1, $2, false)`, [id, S1]);
    return id;
  });
  questionId = (await one<{ id: string }>(
    `select q ->> 'id' as id from exam_version_payloads p, jsonb_array_elements(p.paper -> 'questions') q
      where p.exam_version_id = (select exam_version_id from attempts where id = $1) limit 1`, [attemptId])).id;
  await db.as(alice, async () => db.query(`select save_answer($1, $2, '{"text":"first answer"}', $3, false, 5)`, [attemptId, questionId, S1]));
}, 60_000);

describe("extra time", () => {
  it("adds minutes to a running attempt", async () => {
    const before = await minutesLeft();
    await db.as(teacher, async () => db.query(`select teacher_extend_attempt($1, 10)`, [attemptId]));
    expect((await minutesLeft()) - before).toBeCloseTo(10, 0);
    expect((await attempt()).extra_seconds).toBe(600);
    // the student's window learns the new deadline from the heartbeat
    const beat = await db.as(alice, async () =>
      (await one<{ r: { deadline_at: string } }>(`select attempt_heartbeat($1, $2, 1, true) as r`, [attemptId, S1])).r);
    expect(new Date(beat.deadline_at).getTime()).toBe(new Date((await attempt()).deadline_at).getTime());
  });

  it("is for the student's teacher only, with a sensible amount", async () => {
    await db.as(other, async () => {
      await expect(db.query(`select teacher_extend_attempt($1, 10)`, [attemptId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(alice, async () => {
      await expect(db.query(`select teacher_extend_attempt($1, 10)`, [attemptId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(teacher, async () => {
      await expect(db.query(`select teacher_extend_attempt($1, 0)`, [attemptId])).rejects.toThrow(/INVALID_MINUTES/);
      await expect(db.query(`select teacher_extend_attempt($1, 600)`, [attemptId])).rejects.toThrow(/INVALID_MINUTES/);
      await expect(db.query(`select teacher_reopen_attempt($1, 10)`, [attemptId])).rejects.toThrow(/ATTEMPT_NOT_SUBMITTED/);
    });
  });
});

describe("reopening a submitted attempt", () => {
  it("returns work that was auto-submitted for violations", async () => {
    // one violation closes the exam (max_violations = 1), then it is marked
    const r = await db.as(alice, async () =>
      (await one<{ r: { auto_submitted: boolean } }>(`select log_integrity_event($1, $2, 'TAB_HIDDEN') as r`, [attemptId, S1])).r);
    expect(r.auto_submitted).toBe(true);
    await db.query(
      `insert into grading_results (attempt_id, question_id, grading_method, status, awarded_mark, max_mark)
       values ($1, $2, 'AUTO', 'COMPLETE', 1, 2)`, [attemptId, questionId]);
    await db.query(`update attempts set status = 'GRADED', grading_status = 'COMPLETE', score = 1, max_score = 2, percentage = 50 where id = $1`, [attemptId]);
    await expect(db.query(`update answers set answer_data = '{}' where attempt_id = $1`, [attemptId])).rejects.toThrow(/immutable/);

    await db.as(other, async () => {
      await expect(db.query(`select teacher_reopen_attempt($1, 15)`, [attemptId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(alice, async () => {
      await expect(db.query(`select teacher_reopen_attempt($1, 15)`, [attemptId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(teacher, async () => db.query(`select teacher_reopen_attempt($1, 15)`, [attemptId]));

    const a = await attempt();
    expect(a).toMatchObject({ status: "IN_PROGRESS", score: null, grading_status: null, violation_count: 0, reopened_count: 1 });
    expect(await minutesLeft()).toBeCloseTo(15, 0);
    expect((await db.query(`select 1 from grading_results where attempt_id = $1`, [attemptId])).rows).toHaveLength(0);
    expect((await db.query(`select 1 from notifications where user_id = $1 and link = $2`, [alice, `/attempt/${attemptId}`])).rows).toHaveLength(1);
  });

  it("keeps the answers and lets the student continue and submit again", async () => {
    await db.as(alice, async () => {
      await db.query(`select claim_attempt_session($1, $2, false)`, [attemptId, S2]);
      const paper = (await one<{ p: { attempt: { status: string }; answers: { question_id: string; answer: { text: string } }[] } }>(
        `select get_attempt_paper($1) as p`, [attemptId])).p;
      expect(paper.attempt.status).toBe("IN_PROGRESS");
      expect(paper.answers.find((x) => x.question_id === questionId)?.answer.text).toBe("first answer");
      await db.query(`select save_answer($1, $2, '{"text":"improved answer"}', $3, false, 5)`, [attemptId, questionId, S2]);
      await db.query(`select submit_attempt($1, $2)`, [attemptId, S2]);
    });
    expect(await attempt()).toMatchObject({ status: "SUBMITTED", grading_status: "PENDING" });
    const ans = await one<{ submitted_answer: { text: string } }>(`select submitted_answer from answers where attempt_id = $1 and question_id = $2`, [attemptId, questionId]);
    expect(ans.submitted_answer.text).toBe("improved answer");
    // frozen again
    await expect(db.query(`update answers set answer_data = '{}' where attempt_id = $1`, [attemptId])).rejects.toThrow(/immutable/);
  });

  it("refuses while the work is being marked, and is audited", async () => {
    await db.query(`update attempts set grading_status = 'IN_PROGRESS', grading_started_at = now() where id = $1`, [attemptId]);
    await db.as(teacher, async () => {
      await expect(db.query(`select teacher_reopen_attempt($1, 15)`, [attemptId])).rejects.toThrow(/ATTEMPT_BEING_MARKED/);
    });
    const log = (await db.query<{ action: string }>(
      `select action from audit_logs where entity_id = $1 and action in ('attempt.extend_time', 'attempt.reopen') order by created_at`, [attemptId])).rows;
    expect(log.map((l) => l.action)).toEqual(["attempt.extend_time", "attempt.reopen"]);
  });
});
