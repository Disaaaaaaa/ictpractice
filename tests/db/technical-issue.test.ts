import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string;
let teacher: string;
let other: string;
let attemptId: string;
const SESSION = "session-aaaaaaaa";

const one = async <T>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows[0];
const leaveTab = () =>
  db.as(alice, async () =>
    (await one<{ r: { counted: boolean; violation_count: number; auto_submitted: boolean; technical_issue: boolean } }>(
      `select log_integrity_event($1, $2, 'TAB_HIDDEN') as r`, [attemptId, SESSION])).r);
const attempt = () => one<{ status: string; violation_count: number; technical_issue: boolean; technical_issue_by: string | null }>(
  `select status, violation_count, technical_issue, technical_issue_by from attempts where id = $1`, [attemptId]);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s");
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  const cls = (await one<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('12A', 12, '2026-2027', $1) returning id`, [teacher])).id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, alice]);
  const examId = (await one<{ id: string }>(`select id from exams where kind = 'topic' and status = 'published' limit 1`)).id;
  // strict policy: the exam is submitted at the 2nd violation
  await db.query(`update exams set integrity_mode = 'auto_submit', max_violations = 2 where id = $1`, [examId]);
  attemptId = await db.as(alice, async () => {
    const id = (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id;
    await db.query(`select claim_attempt_session($1, $2, false)`, [id, SESSION]);
    return id;
  });
}, 60_000);

describe("technical issue", () => {
  it("counts violations normally before the teacher steps in", async () => {
    const r = await leaveTab();
    expect(r).toMatchObject({ counted: true, violation_count: 1, auto_submitted: false, technical_issue: false });
  });

  it("can be switched on only by the student's teacher", async () => {
    await db.as(other, async () => {
      await expect(db.query(`select teacher_set_technical_issue($1, true)`, [attemptId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(alice, async () => {
      await expect(db.query(`select teacher_set_technical_issue($1, true)`, [attemptId])).rejects.toThrow(/FORBIDDEN/);
      // no direct write either: RLS gives students no update on attempts
      const direct = await db.query(`update attempts set technical_issue = true where id = $1`, [attemptId]).then((r) => r.affectedRows ?? 0, () => 0);
      expect(direct).toBe(0);
    });
    await db.as(teacher, async () => db.query(`select teacher_set_technical_issue($1, true)`, [attemptId]));
    expect(await attempt()).toMatchObject({ status: "IN_PROGRESS", violation_count: 0, technical_issue: true, technical_issue_by: teacher });
  });

  it("excuses the violations already counted but keeps them in the log", async () => {
    const events = (await db.query<{ counted: boolean; metadata: { excused?: string } }>(
      `select counted, metadata from integrity_events where attempt_id = $1`, [attemptId])).rows;
    expect(events).toHaveLength(1);
    expect(events[0].counted).toBe(false);
    expect(events[0].metadata.excused).toBe("technical_issue");
  });

  it("logs further events without counting them or submitting the exam", async () => {
    for (let i = 0; i < 4; i++) {
      const r = await leaveTab();
      expect(r).toMatchObject({ counted: false, violation_count: 0, auto_submitted: false, technical_issue: true });
    }
    expect(await attempt()).toMatchObject({ status: "IN_PROGRESS", violation_count: 0 });
    expect((await db.query(`select 1 from integrity_events where attempt_id = $1`, [attemptId])).rows).toHaveLength(5);
    const beat = await db.as(alice, async () =>
      (await one<{ r: { technical_issue: boolean; violation_count: number } }>(`select attempt_heartbeat($1, $2, 1, true) as r`, [attemptId, SESSION])).r);
    expect(beat).toMatchObject({ technical_issue: true, violation_count: 0 });
  });

  it("counts again after the teacher switches it off", async () => {
    await db.as(teacher, async () => db.query(`select teacher_set_technical_issue($1, false)`, [attemptId]));
    expect((await leaveTab())).toMatchObject({ counted: true, violation_count: 1, auto_submitted: false });
    expect((await leaveTab())).toMatchObject({ counted: true, violation_count: 2, auto_submitted: true });
    expect((await attempt()).status).not.toBe("IN_PROGRESS");
  });

  it("cannot be changed once the exam is submitted, and is audited", async () => {
    await db.as(teacher, async () => {
      await expect(db.query(`select teacher_set_technical_issue($1, true)`, [attemptId])).rejects.toThrow(/ATTEMPT_CLOSED/);
    });
    const log = (await db.query<{ action: string }>(
      `select action from audit_logs where entity_id = $1 and action like 'attempt.technical_issue%' order by created_at`, [attemptId])).rows;
    expect(log.map((l) => l.action)).toEqual(["attempt.technical_issue_on", "attempt.technical_issue_off"]);
  });
});
