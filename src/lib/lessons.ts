import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import { compareNames } from "./auth";

// Lessons of a topic and their points towards the unit's SAU. See
// supabase/migrations/20261030000020_lessons.sql.

type Supa = Awaited<ReturnType<typeof createClient>>;

export const LESSON_POINTS = { practice: 2, notes: 2, exam: 2 } as const;
/** Notes checked at this percentage or more earn the full notes points. */
export const NOTES_FULL_AT = 70;
/** A lesson test or Exam Mode marked at this percentage or more earns the full exam points. */
export const EXAM_FULL_AT = 80;

/** Exam points from the percentage: full from EXAM_FULL_AT, otherwise in proportion. */
export function examPoints(pct: number | null): number {
  if (pct == null) return 0;
  return pct >= EXAM_FULL_AT ? LESSON_POINTS.exam : (LESSON_POINTS.exam * pct) / 100;
}

export type TopicLesson = { number: number; title: string };

export const getTopicLessons = cache(async (topicId: string): Promise<TopicLesson[]> => {
  const supabase = await createClient();
  const { data } = await supabase.from("topic_lessons").select("number, title").eq("topic_id", topicId).order("number");
  return (data ?? []) as TopicLesson[];
});

/** ?lesson=2 → 2 when the topic has that lesson. */
export function lessonParam(lessons: TopicLesson[], value: unknown): number | null {
  const n = Number(typeof value === "string" ? value : NaN);
  return lessons.some((l) => l.number === n) ? n : null;
}

export type LessonRow = {
  student_id: string;
  topic_id: string;
  lesson_no: number;
  deadline: string | null;
  practice_awarded: number;
  practice_max: number;
  notes_pct: number | null;
  exam_id: string | null;
  exam_pct: number | null;
  exam_pending: boolean;
};

export type LessonScore = {
  practice: number;
  notes: number;
  exam: number;
  total: number;
  /** points that can be earned: a part the lesson does not have yet is left out */
  max: number;
  examPending: boolean;
  /** the figures behind the points */
  raw: {
    practiceAwarded: number;
    practiceMax: number;
    notesPct: number | null;
    examPct: number | null;
    hasExam: boolean;
  };
};

const round1 = (x: number) => Math.round(x * 10) / 10;

/** lesson_no 0: the topic's single Exam Mode (topics without lesson tests). */
export const TOPIC_EXAM_LESSON = 0;

export function scoreLesson(r: LessonRow): LessonScore {
  if (r.lesson_no === TOPIC_EXAM_LESSON) {
    const exam = examPoints(r.exam_pct);
    return {
      practice: 0,
      notes: 0,
      exam: round1(exam),
      total: round1(exam),
      max: r.exam_id ? LESSON_POINTS.exam : 0,
      examPending: r.exam_pending,
      raw: { practiceAwarded: 0, practiceMax: 0, notesPct: null, examPct: r.exam_pct, hasExam: Boolean(r.exam_id) },
    };
  }
  const practice = r.practice_max > 0 ? (LESSON_POINTS.practice * r.practice_awarded) / r.practice_max : 0;
  const notes =
    r.notes_pct == null ? 0 : r.notes_pct >= NOTES_FULL_AT ? LESSON_POINTS.notes : (LESSON_POINTS.notes * r.notes_pct) / 100;
  const exam = examPoints(r.exam_pct);
  const max = (r.practice_max > 0 ? LESSON_POINTS.practice : 0) + LESSON_POINTS.notes + (r.exam_id ? LESSON_POINTS.exam : 0);
  return {
    practice: round1(practice),
    notes: round1(notes),
    exam: round1(exam),
    total: round1(practice + notes + exam),
    max,
    examPending: r.exam_pending,
    raw: { practiceAwarded: r.practice_awarded, practiceMax: r.practice_max, notesPct: r.notes_pct, examPct: r.exam_pct, hasExam: Boolean(r.exam_id) },
  };
}

// The points of a class in a unit, computed once and kept for two minutes
// (lesson_points is the heaviest query of the site; every student of a class
// opening SAU points used to compute the whole class again).
const classPointsCached = unstable_cache(
  async (classId: string, unitId: string) => {
    const { data, error } = await createAdminClient().rpc("lesson_points", { p_class_id: classId, p_unit_id: unitId });
    if (error) throw new Error(error.message);
    return (data ?? []) as LessonRow[];
  },
  ["lesson-points"],
  { revalidate: 120 },
);

/**
 * Points rows of a class in a unit, limited to what the viewer may see: a
 * student gets only their own rows, a teacher only classes they teach.
 */
export async function getLessonRows(supabase: Supa, classId: string, unitId: string): Promise<LessonRow[]> {
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims as { sub?: string; app_metadata?: { role?: string } } | undefined;
  if (!claims?.sub) return [];
  const role = claims.app_metadata?.role ?? "student";
  if (role === "teacher") {
    const { data: allowed } = await supabase.rpc("teaches_class", { p_class: classId });
    if (!allowed) return [];
  } else if (role !== "admin" && role !== "student") return [];
  const rows = await classPointsCached(classId, unitId);
  return rows
    .filter((r) => role !== "student" || r.student_id === claims.sub)
    .map((r) => ({
      ...r,
      practice_awarded: Number(r.practice_awarded),
      practice_max: Number(r.practice_max),
      notes_pct: r.notes_pct == null ? null : Number(r.notes_pct),
      exam_pct: r.exam_pct == null ? null : Number(r.exam_pct),
    }));
}

/** The class a student earns points in: their active class of their own grade. */
export async function getStudentClass(supabase: Supa, studentId: string, grade: number | null): Promise<string | null> {
  const { data } = await supabase
    .from("class_members")
    .select("class_id, classes!inner(grade, archived_at)")
    .eq("student_id", studentId)
    .eq("status", "active");
  type Row = { class_id: string; classes: { grade: number; archived_at: string | null } };
  const rows = ((data ?? []) as unknown as Row[]).filter((r) => !r.classes.archived_at);
  return (rows.find((r) => r.classes.grade === grade) ?? rows[0])?.class_id ?? null;
}

/** The unit of the grade's own plan a topic is taught in. */
export async function getTopicUnit(supabase: Supa, topicId: string): Promise<string | null> {
  const { data } = await supabase
    .from("school_placements")
    .select("unit_id, units!inner(terms!inner(grades!inner(for_student_grade)))")
    .eq("topic_id", topicId);
  type Row = { unit_id: string; units: { terms: { grades: { for_student_grade: number | null } } } };
  return ((data ?? []) as unknown as Row[]).find((r) => r.units.terms.grades.for_student_grade === null)?.unit_id ?? null;
}

/** A student's points for each lesson of a topic (empty when they are in no class). */
export async function getMyTopicPoints(supabase: Supa, profile: { id: string; grade: number | null }, topicId: string) {
  const [classId, unitId] = await Promise.all([getStudentClass(supabase, profile.id, profile.grade), getTopicUnit(supabase, topicId)]);
  if (!classId || !unitId) return new Map<number, LessonScore & { deadline: string | null }>();
  const rows = await getLessonRows(supabase, classId, unitId);
  return new Map(
    rows.filter((r) => r.topic_id === topicId && r.student_id === profile.id).map((r) => [r.lesson_no, { ...scoreLesson(r), deadline: r.deadline }]),
  );
}

// ---------------------------------------------------------------------------
// A unit's board: every lesson of the unit, every student, and the SAU
// ---------------------------------------------------------------------------
/** A lesson of the unit, or (number 0) the single Exam Mode of a topic taught without lesson tests. */
export type BoardLesson = { key: string; topicId: string; slug: string; topicTitle: string; number: number; title: string; deadline: string | null; isExam: boolean };
export type BoardStudent = {
  id: string;
  name: string;
  lessons: Map<string, LessonScore>;
  accumulated: number;
  /** latest marked SAU attempt, 0–100 */
  sauPct: number | null;
  sau: number | null;
  total: number;
};
export type UnitBoard = { lessons: BoardLesson[]; students: BoardStudent[]; max: number; sauExamIds: string[] };

export const lessonKey = (topicId: string, n: number) => `${topicId}:${n}`;

export async function getUnitBoard(
  supabase: Supa,
  opts: { classId: string; unit: { id: string; topics: { id: string; slug: string; title: string }[] }; names?: Map<string, string> },
): Promise<UnitBoard> {
  const topicIds = opts.unit.topics.map((t) => t.id);
  const [{ data: lessonRows }, rows, { data: exams }] = await Promise.all([
    supabase.from("topic_lessons").select("topic_id, number, title").in("topic_id", topicIds.concat("00000000-0000-0000-0000-000000000000")),
    getLessonRows(supabase, opts.classId, opts.unit.id),
    supabase.from("exams").select("id").eq("kind", "summative").eq("unit_id", opts.unit.id).is("archived_at", null),
  ]);
  const deadlineOf = (topicId: string, n: number) => rows.find((r) => r.topic_id === topicId && r.lesson_no === n)?.deadline ?? null;
  const lessons: BoardLesson[] = opts.unit.topics.flatMap((t) =>
    ((lessonRows ?? []) as { topic_id: string; number: number; title: string }[])
      .filter((l) => l.topic_id === t.id)
      .sort((a, b) => a.number - b.number)
      .map((l) => ({ key: lessonKey(t.id, l.number), topicId: t.id, slug: t.slug, topicTitle: t.title, number: l.number, title: l.title, deadline: deadlineOf(t.id, l.number), isExam: false }))
      // the topic's single Exam Mode after its lessons
      .concat(
        rows.some((r) => r.topic_id === t.id && r.lesson_no === TOPIC_EXAM_LESSON)
          ? [{ key: lessonKey(t.id, TOPIC_EXAM_LESSON), topicId: t.id, slug: t.slug, topicTitle: t.title, number: TOPIC_EXAM_LESSON, title: "Exam Mode", deadline: deadlineOf(t.id, TOPIC_EXAM_LESSON), isExam: true }]
          : [],
      ),
  );
  const sauExamIds = (exams ?? []).map((e) => e.id as string);
  const studentIds = [...new Set(rows.map((r) => r.student_id))];
  const { data: attempts } = sauExamIds.length && studentIds.length
    ? await supabase
        .from("attempts")
        .select("student_id, percentage, created_at")
        .in("exam_id", sauExamIds)
        .in("student_id", studentIds)
        .eq("status", "GRADED")
        .order("created_at", { ascending: false })
    : { data: [] };
  const sauOf = new Map<string, number>();
  for (const a of attempts ?? []) if (!sauOf.has(a.student_id) && a.percentage != null) sauOf.set(a.student_id, Number(a.percentage)); // latest first

  let max = 0;
  const students: BoardStudent[] = studentIds.map((id) => {
    const scores = new Map(rows.filter((r) => r.student_id === id).map((r) => [lessonKey(r.topic_id, r.lesson_no), scoreLesson(r)]));
    const list = lessons.map((l) => scores.get(l.key)).filter((x): x is LessonScore => Boolean(x));
    const accumulated = round1(list.reduce((s, x) => s + x.total, 0));
    max = Math.max(max, list.reduce((s, x) => s + x.max, 0));
    return { id, name: opts.names?.get(id) ?? "", lessons: scores, accumulated, sauPct: sauOf.get(id) ?? null, sau: null, total: 0 };
  });
  for (const s of students) {
    s.sau = s.sauPct == null ? null : round1((s.sauPct / 100) * max);
    s.total = round1(s.accumulated + (s.sau ?? 0));
  }
  students.sort((a, b) => compareNames(a.name, b.name));
  return { lessons, students, max, sauExamIds };
}
