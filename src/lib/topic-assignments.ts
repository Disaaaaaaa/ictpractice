// Topic assignments: a topic assigned to a class — read the theory, complete
// the practice set, sit the topic exam — each part with a deadline.
// Progress comes from the topic_assignment_progress() RPC
// (supabase/migrations/20261012000011_topic_assignments.sql); this file turns
// a progress row into the statuses shown to teachers and students.
import type { Assignment } from "./db-types";
import type { Tone } from "@/components/ui/badge";

export type TopicProgressRow = {
  student_id: string;
  theory_done: number;
  theory_total: number;
  theory_completed_at: string | null;
  practice_done: number;
  practice_total: number;
  practice_needed: number;
  practice_reached_at: string | null;
  exam_attempt_id: string | null;
  exam_status: string | null;
  exam_submitted_at: string | null;
  exam_percentage: number | null;
};

export type PartKey = "theory" | "practice" | "exam";
export type PartState = "done" | "late" | "in_progress" | "not_started" | "overdue" | "none";
export type Part = {
  key: PartKey;
  state: PartState;
  deadline: string | null;
  /** 0–100 */
  percent: number;
  detail: string;
};
export type OverallState = "completed" | "completed_late" | "in_progress" | "not_started" | "overdue";

type Deadlines = Pick<Assignment, "deadline" | "theory_deadline" | "practice_deadline" | "exam_id">;

export function partDeadline(a: Deadlines, key: PartKey): string | null {
  if (key === "theory") return a.theory_deadline ?? a.deadline;
  if (key === "practice") return a.practice_deadline ?? a.deadline;
  return a.deadline;
}

function state(doneAt: string | null, started: boolean, deadline: string | null, now: number): PartState {
  const due = deadline ? new Date(deadline).getTime() : Infinity;
  if (doneAt) return new Date(doneAt).getTime() > due ? "late" : "done";
  if (now > due) return "overdue";
  return started ? "in_progress" : "not_started";
}

const empty: Omit<TopicProgressRow, "student_id"> = {
  theory_done: 0, theory_total: 0, theory_completed_at: null,
  practice_done: 0, practice_total: 0, practice_needed: 0, practice_reached_at: null,
  exam_attempt_id: null, exam_status: null, exam_submitted_at: null, exam_percentage: null,
};

/** The three parts of a topic assignment for one student. A part the topic does not have is "none". */
export function topicParts(a: Deadlines, row: Omit<TopicProgressRow, "student_id"> | undefined, now: number): Part[] {
  const r = row ?? empty;
  const theory: Part = r.theory_total === 0
    ? { key: "theory", state: "none", deadline: null, percent: 0, detail: "No theory pack" }
    : {
        key: "theory",
        state: state(r.theory_completed_at, r.theory_done > 0, partDeadline(a, "theory"), now),
        deadline: partDeadline(a, "theory"),
        percent: Math.min(100, (r.theory_done / r.theory_total) * 100),
        detail: `${r.theory_done} of ${r.theory_total} sections read`,
      };
  const practice: Part = r.practice_needed === 0
    ? { key: "practice", state: "none", deadline: null, percent: 0, detail: "No practice questions" }
    : {
        key: "practice",
        state: state(r.practice_reached_at, r.practice_done > 0, partDeadline(a, "practice"), now),
        deadline: partDeadline(a, "practice"),
        percent: Math.min(100, (r.practice_done / r.practice_needed) * 100),
        detail: `${Math.min(r.practice_done, r.practice_total)} of ${r.practice_needed} questions done`,
      };
  const exam: Part = !a.exam_id
    ? { key: "exam", state: "none", deadline: null, percent: 0, detail: "No topic exam" }
    : {
        key: "exam",
        state: state(r.exam_submitted_at, r.exam_status === "IN_PROGRESS", a.deadline, now),
        deadline: a.deadline,
        percent: r.exam_submitted_at ? 100 : r.exam_status === "IN_PROGRESS" ? 50 : 0,
        detail: r.exam_submitted_at
          ? r.exam_status === "GRADED" ? "Submitted and marked" : "Submitted — being marked"
          : r.exam_status === "IN_PROGRESS" ? "Exam in progress" : "Not started",
      };
  return [theory, practice, exam];
}

export function overallState(parts: Part[]): OverallState {
  const required = parts.filter((p) => p.state !== "none");
  if (required.length && required.every((p) => p.state === "done" || p.state === "late")) {
    return required.some((p) => p.state === "late") ? "completed_late" : "completed";
  }
  if (required.some((p) => p.state === "overdue")) return "overdue";
  return required.some((p) => p.state !== "not_started") ? "in_progress" : "not_started";
}

/** Share of the required parts' work that is done, 0–100. */
export function overallPercent(parts: Part[]): number {
  const required = parts.filter((p) => p.state !== "none");
  return required.length ? required.reduce((s, p) => s + p.percent, 0) / required.length : 0;
}

export const PART_LABEL: Record<PartKey, string> = { theory: "Theory", practice: "Practice", exam: "Exam Mode" };

export const PART_STATE: Record<PartState, { label: string; tone: Tone }> = {
  done: { label: "Done", tone: "success" },
  late: { label: "Done late", tone: "warning" },
  in_progress: { label: "In progress", tone: "info" },
  not_started: { label: "Not started", tone: "neutral" },
  overdue: { label: "Overdue", tone: "danger" },
  none: { label: "Not required", tone: "neutral" },
};

export const OVERALL_STATE: Record<OverallState, { label: string; tone: Tone }> = {
  completed: { label: "Completed", tone: "success" },
  completed_late: { label: "Completed late", tone: "warning" },
  in_progress: { label: "In progress", tone: "info" },
  not_started: { label: "Not started", tone: "neutral" },
  overdue: { label: "Overdue", tone: "danger" },
};
