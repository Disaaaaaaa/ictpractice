import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // student in 11A
let carol: string; // student in 11A who never starts
let bob: string; // student in no class
let teacher: string; // teaches 11A
let other: string; // another teacher
let classId: string;
let examId: string;
let draftId: string;

async function one<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T> {
  const r = await db.query<T>(sql, params);
  return r.rows[0];
}

const visible = async (who: string, id: string) =>
  db.as(who, async () => (await db.query(`select id from exams where id = $1`, [id])).rows.length);
const start = (who: string) =>
  db.as(who, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id);

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s", "student", 11);
  carol = await db.createUser("carol.s", "student", 11);
  bob = await db.createUser("bob.s", "student", 11);
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  classId = (await one<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('11A', 11, '2026-2027', $1) returning id`,
    [teacher],
  )).id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2), ($1, $3)`, [classId, alice, carol]);

  const source = await one<{ id: string; curriculum_version_id: string }>(
    `select id, curriculum_version_id from exams where kind = 'topic' and current_version_id is not null limit 1`,
  );
  const unit = await one<{ id: string }>(`select id from units order by code limit 1`);
  const make = async (title: string) =>
    (await one<{ id: string }>(
      `insert into exams (curriculum_version_id, kind, title, unit_id, grade, duration_minutes, attempt_limit, created_by)
       values ($1, 'summative', $2, $3, 11, 40, 1, $4) returning id`,
      [source.curriculum_version_id, title, unit.id, teacher],
    )).id;
  examId = await make("SAU 11.1A");
  draftId = await make("SAU draft");
  await db.query(
    `insert into exam_questions (exam_id, question_id, sort_order)
     select $1, question_id, sort_order from exam_questions where exam_id = $2`,
    [examId, source.id],
  );
  await db.as(teacher, async () => db.query(`select publish_exam($1)`, [examId]));
}, 60_000);

describe("summative assessment access", () => {
  it("is hidden and cannot be started until a teacher opens it", async () => {
    expect((await one<{ status: string }>(`select status from exams where id = $1`, [examId])).status).toBe("published");
    expect(await visible(alice, examId)).toBe(0);
    await expect(start(alice)).rejects.toThrow(/SUMMATIVE_NOT_OPEN/);
    expect(await visible(teacher, examId)).toBe(1);
  });

  it("lets only the class teacher (or an admin) open it", async () => {
    await db.as(other, async () => {
      await expect(db.query(`select set_summative_access($1, $2, true)`, [examId, classId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(alice, async () => {
      await expect(db.query(`select set_summative_access($1, $2, true)`, [examId, classId])).rejects.toThrow(/FORBIDDEN/);
      await expect(
        db.query(`insert into summative_access (exam_id, class_id, is_open) values ($1, $2, true)`, [examId, classId]),
      ).rejects.toThrow(/permission denied/);
    });
    await db.as(teacher, async () => {
      await expect(db.query(`select set_summative_access($1, $2, true)`, [draftId, classId])).rejects.toThrow(/SUMMATIVE_NOT_PUBLISHED/);
      await db.query(`select set_summative_access($1, $2, true)`, [examId, classId]);
    });
    const row = await one<{ is_open: boolean; opened_at: string | null; updated_by: string }>(
      `select is_open, opened_at, updated_by from summative_access where exam_id = $1 and class_id = $2`,
      [examId, classId],
    );
    expect(row.is_open).toBe(true);
    expect(row.opened_at).not.toBeNull();
    expect(row.updated_by).toBe(teacher);
  });

  it("opens it for members of that class only", async () => {
    expect(await visible(alice, examId)).toBe(1);
    expect(await visible(bob, examId)).toBe(0);
    await expect(start(bob)).rejects.toThrow(/SUMMATIVE_NOT_OPEN/);
    await db.as(bob, async () => {
      expect((await db.query(`select * from summative_access`)).rows).toHaveLength(0);
    });
    await db.as(alice, async () => {
      expect((await db.query(`select * from summative_access`)).rows).toHaveLength(1);
    });
  });

  it("closing stops new starts but keeps a running attempt and its result visible", async () => {
    const attemptId = await start(alice);
    await db.as(teacher, async () => db.query(`select set_summative_access($1, $2, false)`, [examId, classId]));

    expect(await start(alice)).toBe(attemptId); // resume
    await expect(start(carol)).rejects.toThrow(/SUMMATIVE_NOT_OPEN/);
    expect(await visible(carol, examId)).toBe(0);
    expect(await visible(alice, examId)).toBe(1); // sat it

    await db.as(alice, async () => {
      await db.query(`select claim_attempt_session($1, 'session-aaaaaaaa', false)`, [attemptId]);
      await db.query(`select submit_attempt($1, 'session-aaaaaaaa')`, [attemptId]);
    });
    await expect(start(alice)).rejects.toThrow(/SUMMATIVE_NOT_OPEN/);
    const row = await one<{ is_open: boolean; closed_at: string | null }>(
      `select is_open, closed_at from summative_access where exam_id = $1`, [examId]);
    expect(row.is_open).toBe(false);
    expect(row.closed_at).not.toBeNull();
  });

  it("applies the attempt limit when it is reopened", async () => {
    await db.as(teacher, async () => db.query(`select set_summative_access($1, $2, true)`, [examId, classId]));
    await expect(start(alice)).rejects.toThrow(/ATTEMPT_LIMIT_REACHED/);
    const id = await start(carol);
    expect(id).toBeTruthy();
  });

  it("records who opened and closed it", async () => {
    const r = await db.query<{ action: string }>(
      `select action from audit_logs where entity_id = $1 and action like 'summative.%' order by created_at`, [examId]);
    expect(r.rows.map((x) => x.action)).toEqual(["summative.open", "summative.close", "summative.open"]);
  });

  it("leaves other exams open to everyone", async () => {
    const topic = (await one<{ id: string }>(`select id from exams where kind = 'topic' and status = 'published' limit 1`)).id;
    expect(await visible(bob, topic)).toBe(1);
  });
});
