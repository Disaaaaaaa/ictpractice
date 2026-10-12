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

describe("summative variants", () => {
  let base: string;
  let v2: string;
  let cls: string;
  let students: string[];
  let late: string;
  const assigned = async () =>
    (await db.query<{ student_id: string; exam_id: string }>(`select student_id, exam_id from summative_variants where base_exam_id = $1`, [base])).rows;
  const visibleIds = (who: string) =>
    db.as(who, async () => (await db.query<{ id: string }>(`select id from exams where id = any($1)`, [[base, v2]])).rows.map((r) => r.id));

  beforeAll(async () => {
    const source = await one<{ id: string; curriculum_version_id: string }>(
      `select id, curriculum_version_id from exams where kind = 'topic' and current_version_id is not null limit 1`);
    const unit = await one<{ id: string }>(`select id from units order by code limit 1`);
    const make = async (title: string, variantOf: string | null, no: number) => {
      const id = (await one<{ id: string }>(
        `insert into exams (curriculum_version_id, kind, title, unit_id, grade, duration_minutes, attempt_limit, created_by, variant_of, variant_no)
         values ($1, 'summative', $2, $3, 11, 40, 1, $4, $5, $6) returning id`,
        [source.curriculum_version_id, title, unit.id, teacher, variantOf, no])).id;
      await db.query(
        `insert into exam_questions (exam_id, question_id, sort_order) select $1, question_id, sort_order from exam_questions where exam_id = $2`,
        [id, source.id]);
      return id;
    };
    base = await make("SAU variants", null, 1);
    v2 = await make("SAU variants — Variant 2", base, 2);
    await db.as(teacher, async () => db.query(`select publish_exam($1)`, [base]));

    cls = (await one<{ id: string }>(
      `insert into classes (name, grade, academic_year, teacher_id) values ('11V', 11, '2026-2027', $1) returning id`, [teacher])).id;
    students = [];
    for (let i = 0; i < 9; i++) {
      const id = await db.createUser(`v.student${i}`, "student", 11);
      students.push(id);
      await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, id]);
    }
    late = await db.createUser("v.late", "student", 11);
  }, 60_000);

  it("behaves as a single paper while only one variant is published", async () => {
    await db.as(teacher, async () => db.query(`select set_summative_access($1, $2, true)`, [base, cls]));
    expect(await assigned()).toHaveLength(0);
    expect(await visibleIds(students[0])).toEqual([base]);
    // one student sits Variant 1 before Variant 2 exists
    await db.as(students[0], async () => db.query(`select start_attempt($1)`, [base]));
    await db.as(teacher, async () => db.query(`select set_summative_access($1, $2, false)`, [base, cls]));
  });

  it("deals the variants out at random and equally when access is opened", async () => {
    await db.as(teacher, async () => db.query(`select publish_exam($1)`, [v2]));
    // access is one switch for the group: opening through a variant opens the base
    await db.as(teacher, async () => db.query(`select set_summative_access($1, $2, true)`, [v2, cls]));
    expect((await db.query(`select 1 from summative_access where exam_id = $1 and is_open`, [base])).rows).toHaveLength(1);
    expect((await db.query(`select 1 from summative_access where exam_id = $1`, [v2])).rows).toHaveLength(0);

    const rows = await assigned();
    expect(rows).toHaveLength(9);
    const n1 = rows.filter((r) => r.exam_id === base).length;
    const n2 = rows.filter((r) => r.exam_id === v2).length;
    expect(Math.abs(n1 - n2)).toBeLessThanOrEqual(1);
    // the student who already sat Variant 1 keeps it
    expect(rows.find((r) => r.student_id === students[0])?.exam_id).toBe(base);
  });

  it("shows each student only their own variant and lets them start only that one", async () => {
    const rows = await assigned();
    for (const r of rows.filter((x) => x.student_id !== students[0]).slice(0, 4)) {
      const other = r.exam_id === base ? v2 : base;
      expect(await visibleIds(r.student_id)).toEqual([r.exam_id]);
      await expect(db.as(r.student_id, async () => db.query(`select start_attempt($1)`, [other]))).rejects.toThrow(/SUMMATIVE_OTHER_VARIANT/);
      const id = await db.as(r.student_id, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [r.exam_id])).id);
      expect(id).toBeTruthy();
    }
  });

  it("keeps the assignment when access is closed and opened again", async () => {
    const before = await assigned();
    await db.as(teacher, async () => {
      await db.query(`select set_summative_access($1, $2, false)`, [base, cls]);
      await db.query(`select set_summative_access($1, $2, true)`, [base, cls]);
    });
    const key = (r: { student_id: string; exam_id: string }) => `${r.student_id}:${r.exam_id}`;
    expect((await assigned()).map(key).sort()).toEqual(before.map(key).sort());
  });

  it("gives a late joiner the smaller variant the first time they look", async () => {
    await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [cls, late]);
    expect(await visibleIds(late)).toEqual([]);
    const before = await assigned();
    const smaller = before.filter((r) => r.exam_id === base).length <= before.filter((r) => r.exam_id === v2).length ? base : v2;
    const groups = await db.as(late, async () => (await db.query(`select ensure_my_summative_variants() as id`)).rows);
    expect(groups.map((g) => (g as { id: string }).id)).toContain(base);
    const mine = (await assigned()).find((r) => r.student_id === late)?.exam_id;
    const n = (id: string) => before.filter((r) => r.exam_id === id).length;
    if (n(base) !== n(v2)) expect(mine).toBe(smaller);
    expect(await visibleIds(late)).toEqual([mine]);
  });

  it("does not let students deal or read other students' variants", async () => {
    await db.as(late, async () => {
      await expect(db.query(`select assign_summative_variant($1, $2, $3)`, [base, late, cls])).rejects.toThrow(/permission denied/);
      await expect(db.query(`update summative_variants set exam_id = $1`, [v2])).rejects.toThrow(/permission denied/);
      expect((await db.query(`select * from summative_variants`)).rows).toHaveLength(1);
    });
    await db.as(other, async () => {
      expect((await db.query(`select * from summative_variants`)).rows).toHaveLength(0);
    });
    await db.as(teacher, async () => {
      expect((await db.query(`select * from summative_variants where base_exam_id = $1`, [base])).rows).toHaveLength(10);
    });
  });
});

