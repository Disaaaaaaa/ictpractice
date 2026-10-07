import "server-only";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import type { Assignment, Exam, ExamVersion, IntegrityMode } from "./db-types";

type Supa = Awaited<ReturnType<typeof createClient>>;

export const INTEGRITY_LABEL: Record<IntegrityMode, string> = {
  monitor: "Monitor only",
  warn: "Warning",
  auto_submit: "Auto-submit after violations",
};

export type ExamStartInfo = {
  exam: Exam & { paper_components: { number: number; title: string } | null; topics: { slug: string; title: string } | null };
  version: ExamVersion | null;
  /** numbered questions (a structured question with parts counts once) */
  questionCount: number | null;
  assignment: Assignment | null;
  attemptsUsed: number;
  attemptLimit: number | null;
  openAttemptId: string | null;
  lastAttemptId: string | null;
  durationMinutes: number;
  integrityMode: IntegrityMode;
  maxViolations: number;
  availableNow: boolean;
  unavailableReason: string | null;
};

export async function getExamStartInfo(
  supabase: Supa,
  examId: string,
  studentId: string,
  assignmentId: string | null,
): Promise<ExamStartInfo | null> {
  const { data: exam } = await supabase
    .from("exams")
    .select("*, paper_components(number, title), topics(slug, title)")
    .eq("id", examId)
    .maybeSingle();
  if (!exam) return null;
  const e = exam as ExamStartInfo["exam"];

  const [{ data: version }, { data: assignment }, { data: attempts }] = await Promise.all([
    e.current_version_id
      ? supabase.from("exam_versions").select("*").eq("id", e.current_version_id).maybeSingle()
      : Promise.resolve({ data: null }),
    assignmentId
      ? supabase.from("assignments").select("*").eq("id", assignmentId).eq("exam_id", examId).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("attempts")
      .select("id, status, assignment_id, deadline_at, created_at")
      .eq("student_id", studentId)
      .eq("exam_id", examId)
      .order("created_at", { ascending: false }),
  ]);
  // The paper payload is staff-only; the server reads it just to count the numbered questions.
  let questionCount: number | null = (version as ExamVersion | null)?.question_count ?? null;
  if (e.current_version_id) {
    const { data: payload } = await createAdminClient()
      .from("exam_version_payloads")
      .select("paper")
      .eq("exam_version_id", e.current_version_id)
      .maybeSingle();
    const qs = (payload?.paper as { questions?: { id: string; group_id?: string | null }[] } | undefined)?.questions;
    if (qs) questionCount = new Set(qs.map((q) => q.group_id ?? q.id)).size;
  }
  const a = assignment as Assignment | null;
  const list = (attempts ?? []) as { id: string; status: string; assignment_id: string | null; deadline_at: string }[];
  const relevant = a ? list.filter((x) => x.assignment_id === a.id) : list;
  const open = list.find((x) => x.status === "IN_PROGRESS" && new Date(x.deadline_at).getTime() > Date.now());
  const attemptLimit = a ? (a.attempt_limit ?? e.attempt_limit) : e.attempt_limit;
  const now = Date.now();

  let reason: string | null = null;
  if (!e.current_version_id) reason = "This exam has not been published yet.";
  else if (a) {
    if (new Date(a.available_from).getTime() > now) reason = `This assignment opens on ${new Date(a.available_from).toLocaleString("en-GB")}.`;
    else if (a.deadline && new Date(a.deadline).getTime() < now) reason = "The deadline for this assignment has passed.";
  } else {
    if (e.status === "closed") reason = "This exam is closed.";
    else if (e.availability_start && new Date(e.availability_start).getTime() > now)
      reason = `This exam opens on ${new Date(e.availability_start).toLocaleString("en-GB")}.`;
    else if (e.availability_end && new Date(e.availability_end).getTime() < now) reason = "This exam is no longer available.";
  }
  if (!reason && !open && attemptLimit != null && relevant.length >= attemptLimit) {
    reason = "You have used all the attempts allowed for this exam.";
  }

  return {
    exam: e,
    version: version as ExamVersion | null,
    questionCount,
    assignment: a,
    attemptsUsed: relevant.length,
    attemptLimit,
    openAttemptId: open?.id ?? null,
    lastAttemptId: list.find((x) => x.status !== "IN_PROGRESS")?.id ?? null,
    durationMinutes: a?.duration_override_minutes ?? version?.duration_minutes ?? e.duration_minutes,
    integrityMode: a?.integrity_mode ?? e.integrity_mode,
    maxViolations: a?.max_violations ?? e.max_violations,
    availableNow: !reason,
    unavailableReason: reason,
  };
}
