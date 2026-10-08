import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/curriculum";
import { EmptyState } from "@/components/ui/empty-state";
import { PracticeSession, type PracticeQuestion, type SavedPractice } from "@/components/practice/practice-session";
import type { PracticeResult } from "./actions";
import type { AnswerData } from "@/lib/questions/types";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticePage({ params }: PageProps<"/learn/[topic]/practice">) {
  const profile = await requireProfile();
  const topic = await getTopicBySlug((await params).topic);
  if (!topic) notFound();
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("id, title, question_text, question_type, marks, difficulty, command_word, grading_method, content, parent_id, part_label, part_order, created_at, question_options(key, content, sort_order), question_objectives(learning_objectives(code))")
    .eq("topic_id", topic.id)
    .eq("status", "published")
    .eq("practice_enabled", true)
    .is("archived_at", null)
    .order("created_at");
  type Row = Omit<PracticeQuestion, "options" | "objectives"> & {
    parent_id: string | null;
    part_order: number;
    created_at: string;
    question_options: { key: string; content: string; sort_order: number }[];
    question_objectives: { learning_objectives: { code: string } }[];
  };
  const order = { easy: 0, medium: 1, hard: 2, exam: 3 } as const;
  const rows = (data ?? []) as unknown as Row[];
  // Structured questions are practised part by part; the parent supplies the shared stem.
  const parents = new Map(rows.filter((r) => r.question_type === "structured").map((r) => [r.id, r]));
  const questions: PracticeQuestion[] = rows
    .filter((r) => r.question_type !== "structured" && (!r.parent_id || parents.has(r.parent_id)))
    .map((r) => {
      const parent = r.parent_id ? parents.get(r.parent_id) : undefined;
      return { r, parent, sortKey: [order[(parent ?? r).difficulty], (parent ?? r).created_at, r.part_order] as const };
    })
    .sort((a, b) => a.sortKey[0] - b.sortKey[0] || a.sortKey[1].localeCompare(b.sortKey[1]) || a.sortKey[2] - b.sortKey[2])
    .map(({ r, parent }) => {
      return {
        id: r.id,
        title: r.title,
        question_text: r.question_text,
        question_type: r.question_type,
        marks: r.marks,
        difficulty: r.difficulty,
        command_word: r.command_word,
        grading_method: r.grading_method,
        content: r.content,
        part_label: r.part_label ?? null,
        group_stem: parent?.question_text ?? null,
        group_title: parent?.title ?? null,
        options: [...r.question_options].sort((a, b) => a.sort_order - b.sort_order).map(({ key, content }) => ({ key, content })),
        objectives: r.question_objectives.map((o) => o.learning_objectives.code),
      };
    });

  if (questions.length === 0) {
    return <EmptyState title="No practice questions yet">Questions for this topic will appear here once they are published.</EmptyState>;
  }
  // Restore the student's work: the newest of the latest checked attempt and the draft wins.
  const ids = questions.map((q) => q.id);
  const [{ data: attempts }, { data: drafts }] = await Promise.all([
    supabase
      .from("practice_attempts")
      .select("question_id, answer_data, awarded_mark, max_mark, feedback, result, created_at")
      .eq("student_id", profile.id)
      .in("question_id", ids)
      .order("created_at", { ascending: false }),
    supabase.from("practice_drafts").select("question_id, answer_data, result, updated_at").eq("student_id", profile.id).in("question_id", ids),
  ]);
  type AttemptRow = { question_id: string; answer_data: AnswerData | null; awarded_mark: number; max_mark: number; feedback: string | null; result: PracticeResult | null; created_at: string };
  type DraftRow = { question_id: string; answer_data: AnswerData | null; result: PracticeResult | null; updated_at: string };
  const saved: Record<string, SavedPractice> = {};
  const touched: Record<string, string> = {};
  for (const a of (attempts ?? []) as AttemptRow[]) {
    if (saved[a.question_id]) continue; // newest first
    const awarded = Number(a.awarded_mark);
    const max = Number(a.max_mark);
    saved[a.question_id] = {
      answer: a.answer_data,
      result: a.result?.ok
        ? a.result
        : { ok: true, awarded, max, feedback: a.feedback, points: [], needsReview: false, fullMarks: awarded === max },
    };
    touched[a.question_id] = a.created_at;
  }
  for (const d of (drafts ?? []) as DraftRow[]) {
    if (touched[d.question_id] && touched[d.question_id] >= d.updated_at) continue;
    saved[d.question_id] = { answer: d.answer_data, result: d.result?.ok ? d.result : undefined };
    touched[d.question_id] = d.updated_at;
  }
  // Open the question the student worked on most recently.
  const lastId = Object.entries(touched).sort((a, b) => b[1].localeCompare(a[1]))[0]?.[0];
  const startIndex = Math.max(0, questions.findIndex((q) => q.id === lastId));

  return (
    <PracticeSession
      key={topic.id}
      questions={questions}
      canReveal={profile.role !== "student"}
      saved={saved}
      startIndex={startIndex}
    />
  );
}
