import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getEditorContext, toAuthored } from "@/lib/question-editor-data";
import { formatDate } from "@/lib/format";
import type { MarkScheme, Question } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ConfirmButton } from "@/components/action-form";
import { QuestionEditor, type EditorPart } from "@/components/teacher/question-editor";
import { archiveQuestion } from "../actions";

export const metadata: Metadata = { title: "Edit question" };

export default async function EditQuestionPage({ params }: PageProps<"/teacher/questions/[id]">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: q }, { data: schemes }, { data: usage }, ctx, { data: partRows }] = await Promise.all([
    supabase.from("questions").select("*, question_options(key, content, sort_order), question_objectives(learning_objectives(code, curriculum_version_id))").eq("id", id).maybeSingle(),
    supabase.from("mark_schemes").select("*").eq("question_id", id).order("version", { ascending: false }),
    supabase.from("exam_questions").select("exams(id, title, status)").eq("question_id", id),
    getEditorContext(),
    supabase.from("questions").select("id, title, part_label, question_type, marks, status, part_order").eq("parent_id", id).is("archived_at", null).order("part_order"),
  ]);
  if (!q) notFound();
  const question = q as Question & { question_options: { key: string; content: string; sort_order: number }[]; question_objectives: { learning_objectives: { code: string; curriculum_version_id: string } }[] };
  const list = (schemes ?? []) as MarkScheme[];
  const current = list.find((s) => s.is_current) ?? null;
  const canEdit = profile.role === "admin" || question.created_by === profile.id;
  const { data: parentRow } = question.parent_id
    ? await supabase.from("questions").select("id, title, question_text, topic_id").eq("id", question.parent_id).maybeSingle()
    : { data: null };
  const parent = parentRow ? { id: parentRow.id as string, title: parentRow.title as string, stem: parentRow.question_text as string, topic: (parentRow.topic_id as string | null) ?? undefined } : undefined;
  const parts = (partRows ?? []) as EditorPart[];
  const exams = ((usage ?? []) as unknown as { exams: { id: string; title: string; status: string } | null }[]).map((u) => u.exams).filter(Boolean);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Question Bank", href: "/teacher/questions" },
          ...(parent ? [{ label: parent.title, href: `/teacher/questions/${parent.id}` }] : []),
          { label: question.title },
        ]}
        title={question.title}
        description={`Updated ${formatDate(question.updated_at)}`}
        actions={canEdit && question.status !== "archived" && (
          <ConfirmButton action={archiveQuestion} fields={{ question_id: question.id }} label="Archive" variant="danger" size="md" confirm="Archive this question? It stays in exams that already use it." />
        )}
      />
      {!canEdit && <Alert tone="info" className="mb-6">You can view this question but only its author or an administrator can edit it.</Alert>}
      {exams.length > 0 && (
        <Alert tone="warning" className="mb-6" title={`Used in ${exams.length} exam(s)`}>
          Editing changes future versions only — published exam versions and past results keep their frozen copy.{" "}
          {exams.map((e, i) => (
            <span key={e!.id}>{i > 0 && ", "}<Link href={`/teacher/exams/${e!.id}`} className="underline">{e!.title}</Link></span>
          ))}
        </Alert>
      )}
      <QuestionEditor
        key={question.updated_at}
        questionId={question.id}
        initial={toAuthored(question, current)}
        topics={ctx.topics}
        objectives={ctx.objectives}
        readOnly={!canEdit}
        parent={parent}
        parts={parts}
      />
      {list.length > 1 && (
        <Card className="mt-6">
          <CardHeader title="Mark scheme history" />
          <CardBody>
            <ul className="space-y-1 text-sm">
              {list.map((s) => (
                <li key={s.id}>Version {s.version}{s.is_current ? " (current)" : ""}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </>
  );
}
