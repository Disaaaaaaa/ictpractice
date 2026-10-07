import "server-only";
import { createClient } from "./supabase/server";
import type { Attempt, ClassRow, Exam, Profile } from "./db-types";

type Supa = Awaited<ReturnType<typeof createClient>>;

export type ClassWithCount = ClassRow & { member_count: number; teacher: Pick<Profile, "first_name" | "last_name" | "username"> | null };

export async function getTeacherClasses(supabase: Supa, profile: Pick<Profile, "id" | "role">, all = false): Promise<ClassWithCount[]> {
  let q = supabase
    .from("classes")
    .select("*, class_members(count), teacher:teacher_id(first_name, last_name, username)")
    .is("archived_at", null)
    .order("grade")
    .order("name");
  if (!(all && profile.role === "admin")) q = q.eq("teacher_id", profile.id);
  const { data } = await q;
  return ((data ?? []) as unknown as (ClassRow & { class_members: { count: number }[]; teacher: ClassWithCount["teacher"] })[]).map(
    ({ class_members, ...c }) => ({ ...c, member_count: class_members[0]?.count ?? 0 }),
  );
}

export type RosterStudent = Profile & { joined_at: string };

export async function getClassRoster(supabase: Supa, classId: string) {
  const { data: cls } = await supabase.from("classes").select("*").eq("id", classId).maybeSingle();
  if (!cls) return null;
  const { data } = await supabase
    .from("class_members")
    .select("joined_at, profiles!class_members_student_id_fkey(*)")
    .eq("class_id", classId)
    .eq("status", "active");
  const students = ((data ?? []) as unknown as { joined_at: string; profiles: Profile }[])
    .filter((r) => r.profiles)
    .map((r) => ({ ...r.profiles, joined_at: r.joined_at }))
    .sort((a, b) => `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`));
  return { cls: cls as ClassRow, students };
}

/** All students the caller can see (their classes; admin: everyone). */
export async function getVisibleStudents(supabase: Supa): Promise<Profile[]> {
  const { data } = await supabase.from("profiles").select("*").eq("role", "student").order("last_name").order("first_name");
  return (data ?? []) as Profile[];
}

export async function getMasteryByStudent(supabase: Supa, studentIds: string[]) {
  const out = new Map<string, Map<string, number>>();
  if (!studentIds.length) return out;
  for (let i = 0; i < studentIds.length; i += 100) {
    const { data } = await supabase
      .from("student_mastery")
      .select("student_id, learning_objective_id, mastery")
      .in("student_id", studentIds.slice(i, i + 100));
    for (const r of data ?? []) {
      const m = out.get(r.student_id) ?? new Map<string, number>();
      m.set(r.learning_objective_id, Number(r.mastery));
      out.set(r.student_id, m);
    }
  }
  return out;
}

export type AttemptRow = Attempt & {
  exams: Pick<Exam, "id" | "title" | "kind" | "year" | "topic_id" | "paper_component_id"> | null;
  profiles: Pick<Profile, "id" | "first_name" | "last_name" | "username"> | null;
};

export async function getAttempts(
  supabase: Supa,
  filter: { studentIds?: string[]; examId?: string; assignmentId?: string; status?: string[]; limit?: number } = {},
): Promise<AttemptRow[]> {
  let q = supabase
    .from("attempts")
    .select("*, exams(id, title, kind, year, topic_id, paper_component_id), profiles!attempts_student_id_fkey(id, first_name, last_name, username)")
    .order("created_at", { ascending: false })
    .limit(filter.limit ?? 500);
  if (filter.studentIds) q = q.in("student_id", filter.studentIds.length ? filter.studentIds : ["00000000-0000-0000-0000-000000000000"]);
  if (filter.examId) q = q.eq("exam_id", filter.examId);
  if (filter.assignmentId) q = q.eq("assignment_id", filter.assignmentId);
  if (filter.status) q = q.in("status", filter.status);
  const { data } = await q;
  return (data ?? []) as AttemptRow[];
}

export function stats(values: number[]) {
  if (!values.length) return { mean: null, median: null, max: null, min: null, n: 0 };
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return {
    mean: s.reduce((a, b) => a + b, 0) / s.length,
    median: s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2,
    max: s[s.length - 1],
    min: s[0],
    n: s.length,
  };
}
