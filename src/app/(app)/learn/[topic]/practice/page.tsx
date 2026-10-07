import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/curriculum";
import { EmptyState } from "@/components/ui/empty-state";
import { PracticeSession, type PracticeQuestion } from "@/components/practice/practice-session";

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
  return <PracticeSession questions={questions} canReveal={profile.role !== "student"} />;
}
