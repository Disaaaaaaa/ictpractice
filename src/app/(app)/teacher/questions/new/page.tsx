import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getEditorContext } from "@/lib/question-editor-data";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionEditor } from "@/components/teacher/question-editor";

export const metadata: Metadata = { title: "New question" };

export default async function NewQuestionPage({ searchParams }: PageProps<"/teacher/questions/new">) {
  await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const parentId = String(sp.parent ?? "") || undefined;
  const { topics, objectives } = await getEditorContext();
  type ParentRow = { id: string; title: string; question_text: string; topic_id: string | null; difficulty: "easy" | "medium" | "hard" | "exam"; practice_enabled: boolean; source_type: string };
  let parent: ParentRow | null = null;
  let nextLabel = "(a)";
  if (parentId) {
    const supabase = await createClient();
    const [{ data }, { count }] = await Promise.all([
      supabase.from("questions").select("id, title, question_text, topic_id, difficulty, practice_enabled, source_type, question_type").eq("id", parentId).maybeSingle(),
      supabase.from("questions").select("id", { count: "exact", head: true }).eq("parent_id", parentId).is("archived_at", null),
    ]);
    if (!data || data.question_type !== "structured") notFound();
    parent = data as ParentRow;
    nextLabel = `(${String.fromCharCode(97 + Math.min(25, count ?? 0))})`;
  }
  const topic = parent?.topic_id ?? (String(sp.topic ?? "") || undefined);
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Question Bank", href: "/teacher/questions" },
          ...(parent ? [{ label: parent.title, href: `/teacher/questions/${parent.id}` }] : []),
          { label: parent ? "New part" : "New" },
        ]}
        title={parent ? `New part of “${parent.title}”` : "New question"}
      />
      <QuestionEditor
        questionId={null}
        readOnly={false}
        topics={topics}
        objectives={objectives}
        parent={parent ? { id: parent.id, title: parent.title, stem: parent.question_text, topic: parent.topic_id ?? undefined } : undefined}
        initial={{
          key: "editor",
          title: parent ? `${parent.title} ${nextLabel}` : "",
          part_label: parent ? nextLabel : undefined,
          type: "short_answer",
          marks: 2,
          difficulty: parent?.difficulty ?? "medium",
          command_word: "explain",
          grading: "AI",
          objectives: [],
          text: "",
          options: [],
          content: {},
          source: (parent?.source_type as "teacher" | undefined) ?? "teacher",
          practice: parent?.practice_enabled ?? true,
          status: "draft",
          topic,
          scheme: { mark_scheme: "", points: [], accepted: {} },
        }}
      />
    </>
  );
}
