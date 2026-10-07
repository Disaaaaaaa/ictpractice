import "server-only";
import { createClient } from "./supabase/server";
import type { AnswerData, Paper, PaperQuestion } from "./questions/types";
import { stats } from "./teacher-data";

type Supa = Awaited<ReturnType<typeof createClient>>;

export type QuestionStat = {
  question: PaperQuestion;
  attempts: number;
  averageMark: number | null;
  successRate: number | null; // % of attempts with full marks
  averageTime: number | null;
  discrimination: number | null; // upper 27% minus lower 27% facility, −1..1
  commonWrong: string | null;
  aiConfidence: number | null;
  overrideRate: number | null;
};

function describeAnswer(q: PaperQuestion, a: AnswerData | null): string | null {
  if (!a) return null;
  if (typeof a.selected === "string") return `Option ${a.selected}`;
  if (Array.isArray(a.selected)) return `Options ${a.selected.join(", ")}`;
  if (typeof a.value === "boolean") return a.value ? "True" : "False";
  if (typeof a.value === "string") return a.value.trim().slice(0, 60) || null;
  if (a.blanks) return a.blanks.join(" / ").slice(0, 60);
  if (q.question_type === "short_answer" && a.text) return a.text.trim().slice(0, 60);
  return null;
}

/**
 * Item analysis for one exam over a set of students (teacher's RLS scope).
 * Uses the paper of each attempt's own version, keyed by question id.
 */
export async function examQuestionAnalysis(supabase: Supa, examId: string, studentIds: string[]): Promise<{
  questions: QuestionStat[];
  scores: number[];
}> {
  const { data: attempts } = await supabase
    .from("attempts")
    .select("id, student_id, exam_version_id, percentage, status")
    .eq("exam_id", examId)
    .in("status", ["GRADED", "REVIEW_REQUIRED"])
    .in("student_id", studentIds.length ? studentIds : ["00000000-0000-0000-0000-000000000000"]);
  const list = attempts ?? [];
  if (!list.length) return { questions: [], scores: [] };

  const versionIds = [...new Set(list.map((a) => a.exam_version_id as string))];
  const [{ data: payloads }, { data: results }, { data: answers }] = await Promise.all([
    supabase.from("exam_version_payloads").select("exam_version_id, paper").in("exam_version_id", versionIds),
    supabase.from("grading_results").select("attempt_id, question_id, final_mark, max_mark, confidence, teacher_override_mark, grading_method").in("attempt_id", list.map((a) => a.id)),
    supabase.from("answers").select("attempt_id, question_id, submitted_answer, time_spent_seconds").in("attempt_id", list.map((a) => a.id)),
  ]);
  const questionsById = new Map<string, PaperQuestion>();
  for (const p of payloads ?? []) for (const q of (p.paper as Paper).questions) if (!questionsById.has(q.id)) questionsById.set(q.id, q);

  const sorted = [...list].sort((a, b) => Number(b.percentage ?? 0) - Number(a.percentage ?? 0));
  const k = Math.max(1, Math.round(sorted.length * 0.27));
  const upper = new Set(sorted.slice(0, k).map((a) => a.id));
  const lower = new Set(sorted.slice(-k).map((a) => a.id));
  const answerKey = (att: string, q: string) => `${att}|${q}`;
  const answerBy = new Map((answers ?? []).map((a) => [answerKey(a.attempt_id, a.question_id), a]));

  const out: QuestionStat[] = [];
  for (const q of questionsById.values()) {
    const rs = (results ?? []).filter((r) => r.question_id === q.id && r.final_mark != null);
    if (!rs.length) continue;
    const facility = (set: Set<string>) => {
      const sub = rs.filter((r) => set.has(r.attempt_id));
      return sub.length ? sub.reduce((s, r) => s + Number(r.final_mark) / Number(r.max_mark), 0) / sub.length : null;
    };
    const fu = facility(upper);
    const fl = facility(lower);
    const wrong = new Map<string, number>();
    const times: number[] = [];
    for (const r of rs) {
      const a = answerBy.get(answerKey(r.attempt_id, q.id));
      if (a?.time_spent_seconds) times.push(a.time_spent_seconds);
      if (Number(r.final_mark) < Number(r.max_mark)) {
        const d = describeAnswer(q, (a?.submitted_answer ?? null) as AnswerData | null);
        if (d) wrong.set(d, (wrong.get(d) ?? 0) + 1);
      }
    }
    const ai = rs.filter((r) => r.grading_method === "AI" || r.confidence != null);
    out.push({
      question: q,
      attempts: rs.length,
      averageMark: rs.reduce((s, r) => s + Number(r.final_mark), 0) / rs.length,
      successRate: (100 * rs.filter((r) => Number(r.final_mark) === Number(r.max_mark)).length) / rs.length,
      averageTime: times.length ? times.reduce((a, b) => a + b, 0) / times.length : null,
      discrimination: fu != null && fl != null && sorted.length >= 4 ? fu - fl : null,
      commonWrong: [...wrong].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
      aiConfidence: ai.length ? ai.reduce((s, r) => s + Number(r.confidence ?? 0), 0) / ai.length : null,
      overrideRate: ai.length ? (100 * ai.filter((r) => r.teacher_override_mark != null).length) / ai.length : null,
    });
  }
  out.sort((a, b) => a.question.number - b.question.number);
  return { questions: out, scores: list.map((a) => Number(a.percentage ?? 0)) };
}

export { stats };
