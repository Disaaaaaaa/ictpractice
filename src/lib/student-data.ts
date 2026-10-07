import "server-only";
import { createClient } from "./supabase/server";
import type { Assignment, Attempt, Exam } from "./db-types";

type Supa = Awaited<ReturnType<typeof createClient>>;

export type AttemptWithExam = Attempt & { exams: Pick<Exam, "id" | "title" | "kind" | "year" | "topic_id"> | null };

export async function getStudentClasses(supabase: Supa, studentId: string) {
  const { data } = await supabase
    .from("class_members")
    .select("status, classes(id, name, grade, academic_year, teacher:teacher_id(first_name, last_name, username))")
    .eq("student_id", studentId)
    .eq("status", "active");
  type Row = {
    classes: { id: string; name: string; grade: number; academic_year: string; teacher: { first_name: string; last_name: string; username: string } | null };
  };
  return ((data ?? []) as unknown as Row[]).map((r) => r.classes).filter(Boolean);
}

export async function getRecentAttempts(supabase: Supa, studentId: string, limit = 10): Promise<AttemptWithExam[]> {
  const { data } = await supabase
    .from("attempts")
    .select("*, exams(id, title, kind, year, topic_id)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as AttemptWithExam[];
}

export type StudentAssignment = Assignment & {
  exams: Pick<Exam, "id" | "title" | "kind" | "duration_minutes"> | null;
  topics: { slug: string; title: string } | null;
};

/** Assignments targeted at the student (RLS returns only those). */
export async function getStudentAssignments(supabase: Supa): Promise<StudentAssignment[]> {
  const { data } = await supabase
    .from("assignments")
    .select("*, exams(id, title, kind, duration_minutes), topics(slug, title)")
    .is("archived_at", null)
    .order("deadline", { ascending: true, nullsFirst: false })
    .limit(50);
  return (data ?? []) as StudentAssignment[];
}

export function attemptLink(a: Pick<Attempt, "id" | "status">) {
  return a.status === "IN_PROGRESS" ? `/attempt/${a.id}` : `/results/${a.id}`;
}
