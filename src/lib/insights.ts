// Learner insights from Exam Mode: what the teacher noticed about a student's
// answers (table learner_insights) and the marks per objective / command word
// (rpc exam_skill_stats).
import type { SupabaseClient } from "@supabase/supabase-js";

export type InsightKind = "strength" | "gap" | "habit";

/**
 * Tags for habits in answers — the same for every topic, so a class can be
 * summed up. Gaps and strengths in content use their own tags (any
 * lowercase-with-dashes code, e.g. "backup-types"), tied to the topic.
 */
export const HABIT_TAGS: Record<string, string> = {
  "no-scenario-link": "Answers are not linked to the scenario",
  "too-brief": "Answers are too short for the marks",
  "definition-not-explanation": "Gives a definition where an explanation is asked",
  "one-sided": "Compares or discusses only one side",
  "no-conclusion": "No justified conclusion in discuss / evaluate answers",
  "no-example": "No example where one is asked",
  "missing-second-point": "Stops after the first point of a two-mark answer",
  "vague-terms": "Uses vague words instead of subject terms",
  "misreads-question": "Answers a different question from the one asked",
  "diagram-direction": "Draws relationship ends the wrong way round",
  "copied-wording": "Answer copied word for word from a source or a classmate",
  "precise-terms": "Uses precise subject terms",
  "well-structured": "Well-structured answers that follow the marks",
  "applies-to-scenario": "Applies knowledge to the scenario well",
};

export const KIND_LABEL: Record<InsightKind, string> = { strength: "Strength", gap: "Gap", habit: "Habit in answers" };

export type Insight = {
  id: string;
  student_id: string;
  topic_id: string | null;
  kind: InsightKind;
  tag: string;
  text: string;
  seen: number;
  updated_at: string;
  topics?: { title: string; slug: string } | null;
};

export type SkillStat = { dimension: "objective" | "command"; code: string; label: string; awarded: number; max_marks: number; answers: number; pct: number };

type Supa = SupabaseClient;

/** Open insights of one or more students, most confirmed first. */
export async function getInsights(supabase: Supa, studentIds: string[]): Promise<Insight[]> {
  if (!studentIds.length) return [];
  const { data } = await supabase
    .from("learner_insights")
    .select("id, student_id, topic_id, kind, tag, text, seen, updated_at, topics(title, slug)")
    .in("student_id", studentIds)
    .is("resolved_at", null)
    .order("seen", { ascending: false })
    .order("updated_at", { ascending: false });
  return (data ?? []) as unknown as Insight[];
}

/** Marks per learning objective and command word from the student's Exam Mode answers. */
export async function getSkillStats(supabase: Supa, studentId: string): Promise<SkillStat[]> {
  const { data } = await supabase.rpc("exam_skill_stats", { p_student: studentId });
  return ((data ?? []) as Omit<SkillStat, "pct">[])
    .map((r) => ({ ...r, awarded: Number(r.awarded), max_marks: Number(r.max_marks), pct: Number(r.max_marks) > 0 ? Math.round((100 * Number(r.awarded)) / Number(r.max_marks)) : 0 }))
    .filter((r) => r.max_marks > 0);
}

/** The class picture: each tag with the students who have it. */
export function summariseClass(insights: Insight[]) {
  const byTag = new Map<string, { kind: InsightKind; tag: string; label: string; topic: string | null; students: Set<string> }>();
  for (const i of insights) {
    const key = `${i.kind}:${i.tag}:${i.kind === "habit" ? "" : (i.topic_id ?? "")}`;
    const row = byTag.get(key) ?? { kind: i.kind, tag: i.tag, label: HABIT_TAGS[i.tag] ?? i.text, topic: i.kind === "habit" ? null : (i.topics?.title ?? null), students: new Set<string>() };
    row.students.add(i.student_id);
    byTag.set(key, row);
  }
  return [...byTag.values()].map((r) => ({ ...r, count: r.students.size })).sort((a, b) => b.count - a.count);
}
