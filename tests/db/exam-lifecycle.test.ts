import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;
let alice: string; // student in 12A
let bob: string; // student, not in teacher's class
let teacher: string;
let other: string; // another teacher
let classId: string;
let examId: string;

async function one<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T> {
  const r = await db.query<T>(sql, params);
  return r.rows[0];
}

beforeAll(async () => {
  db = await createDb({ seed: true });
  alice = await db.createUser("alice.s");
  bob = await db.createUser("bob.s");
  teacher = await db.createUser("t.teacher", "teacher");
  other = await db.createUser("o.teacher", "teacher");
  classId = (await one<{ id: string }>(
    `insert into classes (name, grade, academic_year, teacher_id) values ('12A', 12, '2026-2027', $1) returning id`,
    [teacher],
  )).id;
  await db.query(`insert into class_members (class_id, student_id) values ($1, $2)`, [classId, alice]);
  examId = (await one<{ id: string }>(`select id from exams where kind = 'topic' limit 1`)).id;
}, 60_000);

describe("curriculum", () => {
  it("stores each topic once but places it in both navigations", async () => {
    const t = await one<{ id: string; school: number; exam: number }>(`
      select t.id,
        (select count(*)::int from school_placements sp where sp.topic_id = t.id) as school,
        (select count(*)::int from exam_placements ep where ep.topic_id = t.id) as exam
      from topics t where slug = 'g11-sdlc-models'`);
    expect(t.school).toBe(1);
    expect(t.exam).toBeGreaterThanOrEqual(1);
    const dupes = await one<{ n: number }>(
      `select count(*)::int as n from (select curriculum_version_id, slug from topics group by 1, 2 having count(*) > 1) d`,
    );
    expect(dupes.n).toBe(0);
  });

  it("keeps the same LO code with different wording in different versions", async () => {
    const r = await db.query<{ code: string; version: string; description: string }>(`
      select lo.code, v.code as version, lo.description
      from learning_objectives lo join curriculum_versions v on v.id = lo.curriculum_version_id
      where lo.code = '11.3.1.1' order by v.code`);
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0].description).not.toEqual(r.rows[1].description);
  });

  it("links every Paper 1-2-3 objective missing from the KTP to a topic", async () => {
    const r = await one<{ linked: number; exam_only: number; unplaced: number }>(`
      select
        (select count(distinct lo.id)::int from learning_objectives lo
           join curriculum_versions v on v.id = lo.curriculum_version_id and v.code = 'NIS_CS_EXAM_SPEC'
           join topic_objectives t on t.learning_objective_id = lo.id) as linked,
        (select count(*)::int from topics t where not exists (select 1 from school_placements sp where sp.topic_id = t.id)) as exam_only,
        (select count(*)::int from topics t
           where not exists (select 1 from school_placements sp where sp.topic_id = t.id)
             and not exists (select 1 from exam_placements ep where ep.topic_id = t.id)) as unplaced`);
    expect(r).toEqual({ linked: 40, exam_only: 11, unplaced: 0 });
    const mobile = await one<{ paper: string; section: string }>(`
      select pc.title as paper, ps.title as section from exam_placements ep
      join paper_sections ps on ps.id = ep.paper_section_id
      join paper_components pc on pc.id = ps.paper_component_id
      join topics t on t.id = ep.topic_id where t.slug = 'paper-mobile-application-development'`);
    expect(mobile).toEqual({ paper: "Paper 3", section: "Mobile applications development" });
  });

  it("maps SDLC to Paper 2 / System life cycle", async () => {
    const r = await one<{ paper: string; section: string }>(`
      select pc.title as paper, ps.title as section
      from exam_placements ep
      join paper_sections ps on ps.id = ep.paper_section_id
      join paper_components pc on pc.id = ps.paper_component_id
      join topics t on t.id = ep.topic_id where t.slug = 'g11-sdlc-models'`);
    expect(r).toEqual({ paper: "Paper 2", section: "System life cycle" });
  });
});

describe("RLS", () => {
  it("hides mark schemes and exam payloads from students", async () => {
    await db.as(alice, async () => {
      expect((await db.query(`select * from mark_schemes`)).rows).toHaveLength(0);
      expect((await db.query(`select * from exam_version_payloads`)).rows).toHaveLength(0);
      expect((await db.query(`select * from questions`)).rows.length).toBeGreaterThan(0);
    });
  });

  it("lets a teacher see only students in their classes", async () => {
    await db.as(teacher, async () => {
      const ids = (await db.query<{ id: string }>(`select id from profiles where role = 'student'`)).rows.map((r) => r.id);
      expect(ids).toContain(alice);
      expect(ids).not.toContain(bob);
    });
    await db.as(other, async () => {
      const ids = (await db.query<{ id: string }>(`select id from profiles where role = 'student'`)).rows.map((r) => r.id);
      expect(ids).toHaveLength(0);
    });
  });

  it("stops students from reading other students", async () => {
    await db.as(alice, async () => {
      const ids = (await db.query<{ id: string }>(`select id from profiles`)).rows.map((r) => r.id);
      expect(ids).toContain(alice);
      expect(ids).not.toContain(bob);
    });
  });

  it("blocks direct writes to attempts and profiles by students", async () => {
    await db.as(alice, async () => {
      await expect(
        db.query(`update profiles set role = 'admin' where id = $1`, [alice]).then((r) => r.affectedRows),
      ).resolves.toBe(0);
      await expect(
        db.query(`insert into attempts (student_id, exam_id, exam_version_id, duration_seconds, deadline_at, integrity_mode, max_violations)
                  select $1, id, current_version_id, 60, now(), 'warn', 3 from exams where id = $2`, [alice, examId]),
      ).rejects.toThrow();
    });
  });

  it("denies internal functions to clients", async () => {
    await db.as(alice, async () => {
      await expect(db.query(`select finalize_attempt(gen_random_uuid(), 'SYSTEM')`)).rejects.toThrow(/permission denied/);
      await expect(db.query(`select recompute_mastery($1)`, [alice])).rejects.toThrow(/permission denied/);
    });
  });
});

describe("exam lifecycle", () => {
  let attemptId: string;
  let questionIds: string[];
  const session = "session-aaaaaaaa";

  it("starts an attempt with a server-side deadline", async () => {
    attemptId = await db.as(alice, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id);
    const a = await one<{ secs: number; status: string }>(
      `select extract(epoch from deadline_at - started_at)::int as secs, status from attempts where id = $1`,
      [attemptId],
    );
    const exam = await one<{ d: number }>(`select duration_minutes * 60 as d from exams where id = $1`, [examId]);
    expect(a.status).toBe("IN_PROGRESS");
    expect(a.secs).toBe(exam.d);
  });

  it("resumes instead of creating a second attempt", async () => {
    const again = await db.as(alice, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id);
    expect(again).toBe(attemptId);
  });

  it("returns the paper without answers or hints", async () => {
    const paper = await db.as(alice, async () => (await one<{ p: { paper: { questions: { id: string; content: object }[] } } }>(
      `select get_attempt_paper($1) as p`, [attemptId])).p);
    questionIds = paper.paper.questions.map((q) => q.id);
    const text = JSON.stringify(paper);
    expect(text).not.toContain("accepted_answers");
    expect(text).not.toContain("mark_scheme");
    expect(text).not.toContain('"hint"');
  });

  it("saves and restores answers (autosave + refresh)", async () => {
    await db.as(alice, async () => {
      await db.query(`select claim_attempt_session($1, $2, false)`, [attemptId, session]);
      await db.query(`select save_answer($1, $2, $3, $4)`, [attemptId, questionIds[0], { selected: "B" }, session]);
      await db.query(`select save_answer($1, $2, $3, $4)`, [attemptId, questionIds[0], { selected: "C" }, session]);
      const p = await one<{ p: { answers: { question_id: string; answer: unknown }[] } }>(`select get_attempt_paper($1) as p`, [attemptId]);
      expect(p.p.answers).toEqual([expect.objectContaining({ question_id: questionIds[0], answer: { selected: "C" } })]);
    });
  });

  it("rejects saves from a superseded session and records the second session", async () => {
    await db.as(alice, async () => {
      const r = await one<{ r: { multiple_session_detected: boolean } }>(
        `select claim_attempt_session($1, 'session-bbbbbbbb', false) as r`, [attemptId]);
      expect(r.r.multiple_session_detected).toBe(true);
      await expect(
        db.query(`select save_answer($1, $2, $3, $4)`, [attemptId, questionIds[1], { value: "x" }, session]),
      ).rejects.toThrow(/SESSION_SUPERSEDED/);
      await db.query(`select claim_attempt_session($1, $2, false)`, [attemptId, session]);
    });
    const ev = await one<{ n: number }>(
      `select count(*)::int as n from integrity_events where attempt_id = $1 and event_type = 'MULTIPLE_SESSION_DETECTED'`, [attemptId]);
    expect(ev.n).toBe(2);
  });

  it("counts tab switches and lets the teacher see them", async () => {
    await db.query(`update attempts set started_at = now() - interval '1 minute' where id = $1`, [attemptId]);
    await db.as(alice, async () => {
      const r = await one<{ r: { event_id: string; violation_count: number } }>(
        `select log_integrity_event($1, $2, 'TAB_HIDDEN', now() - interval '12 seconds', null, '{}') as r`, [attemptId, session]);
      await db.query(`select close_integrity_event($1, now())`, [r.r.event_id]);
      expect(r.r.violation_count).toBe(3);
      await expect(
        db.query(`select log_integrity_event($1, $2, 'MULTIPLE_SESSION_DETECTED')`, [attemptId, session]),
      ).rejects.toThrow(/INVALID_EVENT/);
    });
    await db.as(teacher, async () => {
      const rows = (await db.query<{ event_type: string; duration_seconds: number }>(
        `select event_type, duration_seconds from integrity_events where attempt_id = $1 and event_type = 'TAB_HIDDEN'`, [attemptId])).rows;
      expect(rows).toHaveLength(1);
      expect(rows[0].duration_seconds).toBeGreaterThanOrEqual(11);
    });
    await db.as(other, async () => {
      expect((await db.query(`select * from integrity_events`)).rows).toHaveLength(0);
    });
  });

  it("freezes answers on submit and hides marks until graded", async () => {
    await db.as(alice, async () => {
      const r = await one<{ r: { status: string; submission_reason: string } }>(`select submit_attempt($1, $2) as r`, [attemptId, session]);
      expect(r.r).toMatchObject({ status: "SUBMITTED", submission_reason: "MANUAL_SUBMIT" });
      const closed = await one<{ r: { error: string } }>(
        `select save_answer($1, $2, $3, $4) as r`, [attemptId, questionIds[0], { selected: "A" }, session]);
      expect(closed.r.error).toBe("ATTEMPT_CLOSED");
    });
    const a = await one<{ submitted_answer: unknown }>(`select submitted_answer from answers where attempt_id = $1`, [attemptId]);
    expect(a.submitted_answer).toEqual({ selected: "C" });
    await expect(db.query(`update answers set submitted_answer = '{}' where attempt_id = $1`, [attemptId])).rejects.toThrow(/immutable/);
  });

  it("grades, hides results until released, and audits teacher overrides", async () => {
    // Server grader (service role) writes results.
    await db.as("service", async () => {
      for (const qid of questionIds) {
        await db.query(
          `insert into grading_results (attempt_id, question_id, grading_method, status, awarded_mark, max_mark, original_ai_mark, needs_review, confidence)
           values ($1, $2, 'AI', 'COMPLETE', 0, 4, 0, $3, 0.6)
           on conflict do nothing`,
          [attemptId, qid, qid === questionIds[0]],
        );
      }
      await db.query(`select recompute_attempt_score($1)`, [attemptId]);
    });
    expect((await one<{ status: string }>(`select status from attempts where id = $1`, [attemptId])).status).toBe("REVIEW_REQUIRED");
    await db.as(alice, async () => {
      expect((await db.query(`select * from grading_results`)).rows).toHaveLength(0);
    });

    const resultId = (await one<{ id: string }>(`select id from grading_results where attempt_id = $1 and question_id = $2`, [attemptId, questionIds[0]])).id;
    await db.as(other, async () => {
      await expect(db.query(`select teacher_review_mark($1, 'override', 3, 'good', 'reason')`, [resultId])).rejects.toThrow(/FORBIDDEN/);
    });
    await db.as(teacher, async () => {
      await expect(db.query(`select teacher_review_mark($1, 'override', 3, 'good', null)`, [resultId])).rejects.toThrow(/REASON_REQUIRED/);
      await db.query(`select teacher_review_mark($1, 'override', 3, 'Good answer', 'Valid alternative point')`, [resultId]);
    });
    const g = await one<{ final_mark: string; original_ai_mark: string }>(`select final_mark, original_ai_mark from grading_results where id = $1`, [resultId]);
    expect(Number(g.final_mark)).toBe(3);
    expect(Number(g.original_ai_mark)).toBe(0);
    const audit = await one<{ n: number }>(`select count(*)::int as n from grade_audit where grading_result_id = $1 and action = 'override'`, [resultId]);
    expect(audit.n).toBe(1);

    expect((await one<{ status: string; score: string }>(`select status, score from attempts where id = $1`, [attemptId]))).toMatchObject({ status: "GRADED", score: "3.00" });
    await db.as(alice, async () => {
      expect((await db.query(`select * from grading_results`)).rows.length).toBe(questionIds.length);
      const rev = await one<{ r: { marking: unknown; results_visible: boolean } }>(`select get_attempt_review($1) as r`, [attemptId]);
      expect(rev.r.results_visible).toBe(true);
      expect(rev.r.marking).not.toBeNull(); // topic exams release the mark scheme
    });
    const mastery = await one<{ n: number }>(`select count(*)::int as n from student_mastery where student_id = $1`, [alice]);
    expect(mastery.n).toBeGreaterThan(0);
  });

  it("auto-submits when the violation limit is reached", async () => {
    await db.query(`update exams set integrity_mode = 'auto_submit', max_violations = 2, attempt_limit = null where id = $1`, [examId]);
    const id = await db.as(alice, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id);
    await db.as(alice, async () => {
      await db.query(`select claim_attempt_session($1, $2, false)`, [id, session]);
      await db.query(`select log_integrity_event($1, $2, 'WINDOW_BLUR')`, [id, session]);
      const r = await one<{ r: { auto_submitted: boolean } }>(`select log_integrity_event($1, $2, 'TAB_HIDDEN') as r`, [id, session]);
      expect(r.r.auto_submitted).toBe(true);
    });
    expect(await one(`select status, submission_reason from attempts where id = $1`, [id])).toEqual({
      status: "SUBMITTED",
      submission_reason: "VIOLATION_LIMIT",
    });
  });

  it("expires overdue attempts lazily (timer auto-submit)", async () => {
    await db.query(`update exams set integrity_mode = 'warn' where id = $1`, [examId]);
    const id = await db.as(alice, async () => (await one<{ id: string }>(`select start_attempt($1) as id`, [examId])).id);
    await db.query(`update attempts set deadline_at = now() - interval '5 minutes', started_at = now() - interval '40 minutes' where id = $1`, [id]);
    await db.as(alice, async () => {
      const r = await one<{ r: { error: string } }>(`select save_answer($1, $2, $3, $4) as r`, [id, questionIds[0], { selected: "A" }, session]);
      expect(r.r.error).toBe("ATTEMPT_CLOSED");
    });
    expect(await one(`select status, submission_reason from attempts where id = $1`, [id])).toEqual({
      status: "SUBMITTED",
      submission_reason: "TIME_EXPIRED",
    });
  });

  it("enforces attempt limits", async () => {
    await db.query(`update exams set attempt_limit = 1 where id = $1`, [examId]);
    await db.as(alice, async () => {
      await expect(db.query(`select start_attempt($1)`, [examId])).rejects.toThrow(/ATTEMPT_LIMIT_REACHED/);
    });
  });

  it("keeps old attempts on their snapshot after the question bank changes", async () => {
    const qid = questionIds[0];
    await db.query(`update questions set question_text = 'EDITED' where id = $1`, [qid]);
    const p = await one<{ txt: string }>(`
      select q ->> 'question_text' as txt
      from attempts a join exam_version_payloads p on p.exam_version_id = a.exam_version_id,
           jsonb_array_elements(p.paper -> 'questions') q
      where a.id = $1 and q ->> 'id' = $2`, [attemptId, qid]);
    expect(p.txt).not.toBe("EDITED");
    await expect(db.query(`update exam_version_payloads set paper = '{}'`)).rejects.toThrow(/immutable/);
    // Republishing makes a new version; the old attempt still points at v1.
    const v2 = await one<{ v: string }>(`select publish_exam($1) as v`, [examId]);
    const a = await one<{ exam_version_id: string }>(`select exam_version_id from attempts where id = $1`, [attemptId]);
    expect(a.exam_version_id).not.toBe(v2.v);
  });
});

describe("structured questions", () => {
  it("expands a structured question into labelled parts that share its stem", async () => {
    const v = await one<{ cv: string; q: string }>(`select curriculum_version_id as cv, id as q from questions where status = 'published' and parent_id is null and question_type <> 'structured' limit 1`);
    const mk = async (type: string, text: string, marks: number, parent: string | null = null, label: string | null = null, order = 0) =>
      (await one<{ id: string }>(
        `insert into questions (curriculum_version_id, title, question_text, question_type, marks, grading_method, status, parent_id, part_label, part_order)
         values ($1, $2, $3, $4::question_type, $5, 'AI', 'published', $6, $7, $8) returning id`,
        [v.cv, `S ${label ?? "stem"}`, text, type, marks, parent, label, order],
      )).id;
    const stem = await mk("structured", "A school stores marks in a table.", 5);
    const b = await mk("short_answer", "State one benefit.", 2, stem, "(b)", 1);
    const a = await mk("labelled_answers", "Name two fields.", 3, stem, "(a)", 0);
    for (const id of [a, b]) {
      await db.query(`insert into mark_schemes (question_id, version, is_current, mark_scheme) values ($1, 1, true, 'x')`, [id]);
    }
    const exam = (await one<{ id: string }>(
      `insert into exams (curriculum_version_id, kind, title, duration_minutes) values ($1, 'custom', 'Structured', 30) returning id`,
      [v.cv],
    )).id;
    await db.query(`insert into exam_questions (exam_id, question_id, sort_order) values ($1, $2, 0), ($1, $3, 1)`, [exam, v.q, stem]);
    const ver = await one<{ v: string }>(`select publish_exam($1) as v`, [exam]);
    const p = await one<{ paper: { questions: { id: string; label: string; group_stem: string | null; group_id: string | null }[] }; marking: Record<string, { group_stem: string | null }> }>(
      `select paper, marking from exam_version_payloads where exam_version_id = $1`,
      [ver.v],
    );
    expect(p.paper.questions.map((q) => q.label)).toEqual(["1", "2(a)", "2(b)"]);
    expect(p.paper.questions.map((q) => q.id)).toEqual([v.q, a, b]);
    expect(p.paper.questions[1].group_stem).toContain("marks in a table");
    expect(p.paper.questions[1].group_id).toBe(stem);
    expect(p.paper.questions[0].group_id).toBeNull();
    expect(p.marking[b].group_stem).toContain("marks in a table");
    const totals = await one<{ question_count: number; total_marks: number }>(`select question_count, total_marks from exam_versions where id = $1`, [ver.v]);
    expect(totals.question_count).toBe(3);

    // An exam with an empty structured question cannot be published.
    const empty = await mk("structured", "Nothing here yet.", 1);
    await db.query(`insert into exam_questions (exam_id, question_id, sort_order) values ($1, $2, 2)`, [exam, empty]);
    await expect(db.query(`select publish_exam($1)`, [exam])).rejects.toThrow(/EMPTY_STRUCTURED/);
  });
});

