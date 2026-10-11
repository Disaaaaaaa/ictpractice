import "server-only";
import { createClient } from "./supabase/server";
import { getSchoolTree } from "./curriculum";
import { getTeacherClasses, type ClassWithCount } from "./teacher-data";
import type { AttemptStatus, ExamStatus, Profile } from "./db-types";

// Summative assessments for the unit (SAU): exams of kind "summative" that a
// teacher opens and closes class by class. See
// supabase/migrations/20261011000008_summative_assessments.sql.

type Supa = Awaited<ReturnType<typeof createClient>>;

const NONE = "00000000-0000-0000-0000-000000000000";

export type SummativeExam = {
  id: string;
  title: string;
  description: string | null;
  status: ExamStatus;
  unit_id: string | null;
  grade: number | null;
  duration_minutes: number;
  attempt_limit: number | null;
  availability_start: string | null;
  availability_end: string | null;
  created_by: string | null;
  version: { version: number; question_count: number; total_marks: number } | null;
};

export type SummativeUnit<T> = { id: string; code: string; title: string; exams: T[] };
export type SummativeTerm<T> = { grade: number; term: number; title: string; units: SummativeUnit<T>[] };

const EXAM_COLUMNS =
  "id, title, description, status, unit_id, grade, duration_minutes, attempt_limit, availability_start, availability_end, created_by, current:current_version_id(version, question_count, total_marks)";

async function loadExams(supabase: Supa): Promise<SummativeExam[]> {
  const { data } = await supabase
    .from("exams")
    .select(EXAM_COLUMNS)
    .eq("kind", "summative")
    .is("archived_at", null)
    .order("title");
  type Raw = Omit<SummativeExam, "version"> & { current: SummativeExam["version"] };
  return ((data ?? []) as unknown as Raw[]).map(({ current, ...e }) => ({ ...e, version: current }));
}

/** Places each item under its unit; items whose unit is missing go to `other`. */
async function byUnit<T extends { unit_id: string | null }>(items: T[], grades: number[] | null) {
  const tree = await getSchoolTree();
  const placed = new Set<T>();
  const terms: SummativeTerm<T>[] = [];
  for (const g of tree) {
    if (grades && !grades.includes(g.grade)) continue;
    for (const t of g.terms) {
      terms.push({
        grade: g.grade,
        term: t.number,
        title: t.title,
        units: t.units.map((u) => {
          const exams = items.filter((e) => e.unit_id === u.id);
          exams.forEach((e) => placed.add(e));
          return { id: u.id, code: u.code, title: u.title, exams };
        }),
      });
    }
  }
  return { terms, other: items.filter((e) => !placed.has(e)) };
}

/** A published summative with nothing in its own settings stopping a start. */
export function summativeStartable(e: Pick<SummativeExam, "status" | "availability_start" | "availability_end" | "version">) {
  const now = Date.now();
  if (!e.version || !["published", "scheduled"].includes(e.status)) return false;
  if (e.availability_start && new Date(e.availability_start).getTime() > now) return false;
  if (e.availability_end && new Date(e.availability_end).getTime() < now) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Student
// ---------------------------------------------------------------------------
export type StudentSummative = SummativeExam & {
  /** open for one of the student's classes right now */
  open: boolean;
  attempts: { id: string; status: AttemptStatus; percentage: number | null; show_results: boolean; submitted_at: string | null; started_at: string }[];
};

export async function getStudentSummatives(supabase: Supa, profile: Pick<Profile, "id" | "grade">) {
  // RLS returns only the summatives that are open for the student or already sat.
  const exams = await loadExams(supabase);
  const ids = exams.map((e) => e.id).concat(NONE);
  const [{ data: access }, { data: attempts }] = await Promise.all([
    supabase.from("summative_access").select("exam_id").eq("is_open", true).in("exam_id", ids),
    supabase
      .from("attempts")
      .select("id, exam_id, status, percentage, show_results, submitted_at, started_at")
      .eq("student_id", profile.id)
      .in("exam_id", ids)
      .order("created_at", { ascending: false }),
  ]);
  const openIds = new Set((access ?? []).map((a) => a.exam_id));
  const items: StudentSummative[] = exams.map((e) => ({
    ...e,
    open: openIds.has(e.id) && summativeStartable(e),
    attempts: (attempts ?? []).filter((a) => a.exam_id === e.id) as StudentSummative["attempts"],
  }));
  const { terms, other } = await byUnit(items, profile.grade ? [profile.grade] : null);
  return { terms, other, open: items.filter((e) => e.open) };
}

/** Whether a summative is open for the signed-in student (RLS shows only their classes' rows). */
export async function summativeOpenForMe(supabase: Supa, examId: string): Promise<boolean> {
  const { data } = await supabase.from("summative_access").select("class_id").eq("exam_id", examId).eq("is_open", true).limit(1);
  return (data ?? []).length > 0;
}

// ---------------------------------------------------------------------------
// Teacher
// ---------------------------------------------------------------------------
export type ClassAccess = {
  cls: ClassWithCount;
  open: boolean;
  opened_at: string | null;
  closed_at: string | null;
  inProgress: number;
  submitted: number;
};
export type TeacherSummative = SummativeExam & { classes: ClassAccess[]; attemptCount: number; live: number };

export async function getTeacherSummatives(supabase: Supa, profile: Pick<Profile, "id" | "role">, grade: number) {
  const [exams, classes] = await Promise.all([loadExams(supabase), getTeacherClasses(supabase, profile, true)]);
  const ids = exams.map((e) => e.id).concat(NONE);
  const classIds = classes.map((c) => c.id).concat(NONE);
  const [{ data: access }, { data: attempts }, { data: members }] = await Promise.all([
    supabase.from("summative_access").select("exam_id, class_id, is_open, opened_at, closed_at").in("exam_id", ids),
    supabase.from("attempts").select("exam_id, student_id, status").in("exam_id", ids).limit(5000),
    supabase.from("class_members").select("class_id, student_id").eq("status", "active").in("class_id", classIds).limit(5000),
  ]);
  const membersOf = new Map<string, Set<string>>();
  for (const m of members ?? []) {
    if (!membersOf.has(m.class_id)) membersOf.set(m.class_id, new Set());
    membersOf.get(m.class_id)!.add(m.student_id);
  }

  const items: TeacherSummative[] = exams.map((e) => {
    const mine = (attempts ?? []).filter((a) => a.exam_id === e.id);
    return {
      ...e,
      attemptCount: mine.length,
      live: mine.filter((a) => a.status === "IN_PROGRESS").length,
      classes: classes
        .filter((c) => c.grade === (e.grade ?? grade))
        .map((cls) => {
          const row = (access ?? []).find((a) => a.exam_id === e.id && a.class_id === cls.id);
          const students = membersOf.get(cls.id) ?? new Set<string>();
          const ofClass = mine.filter((a) => students.has(a.student_id));
          return {
            cls,
            open: row?.is_open ?? false,
            opened_at: row?.opened_at ?? null,
            closed_at: row?.closed_at ?? null,
            inProgress: ofClass.filter((a) => a.status === "IN_PROGRESS").length,
            submitted: new Set(ofClass.filter((a) => a.status !== "IN_PROGRESS").map((a) => a.student_id)).size,
          };
        }),
    };
  });
  const { terms, other } = await byUnit(items, [grade]);
  return { terms, other: other.filter((e) => e.grade === null || e.grade === grade), classCount: classes.filter((c) => c.grade === grade).length };
}

/** Units of the school programme for a select box: "11.1A · Computer systems". */
export async function getUnitOptions(): Promise<{ id: string; label: string; grade: number }[]> {
  const tree = await getSchoolTree();
  return tree.flatMap((g) =>
    g.terms.flatMap((t) => t.units.map((u) => ({ id: u.id, label: `${u.code} · ${u.title} (Grade ${g.grade}, ${t.title})`, grade: g.grade }))),
  );
}
