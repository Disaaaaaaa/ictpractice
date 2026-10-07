import "server-only";
import { createClient } from "./supabase/server";
import type { BankItem } from "@/components/teacher/exam-question-picker";

export async function getBankItems(): Promise<BankItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("id, title, question_type, marks, difficulty, topic_id, status, practice_enabled, topics(title), paper_components(number)")
    .is("archived_at", null)
    .is("parent_id", null) // parts are added through their structured question
    .order("created_at", { ascending: false })
    .limit(2000);
  type Row = Omit<BankItem, "topic_title" | "paper"> & { topics: { title: string } | null; paper_components: { number: number } | null };
  return ((data ?? []) as unknown as Row[]).map(({ topics, paper_components, ...q }) => ({
    ...q,
    topic_title: topics?.title ?? null,
    paper: paper_components?.number ?? null,
  }));
}
