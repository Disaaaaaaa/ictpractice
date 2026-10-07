import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Copy } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { getBankItems } from "@/lib/bank";
import { formatDate } from "@/lib/format";
import type { Exam } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ActionForm, ConfirmButton } from "@/components/action-form";
import { ExamSettingsForm } from "@/components/teacher/exam-settings-form";
import { ExamQuestionPicker } from "@/components/teacher/exam-question-picker";
import { TeacherResources, type TeacherResource } from "@/components/teacher/teacher-resources";
import { duplicateExam, publishExam, setExamStatus } from "../actions";

export const metadata: Metadata = { title: "Exam" };

export default async function ExamBuilderPage({ params }: PageProps<"/teacher/exams/[id]">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const supabase = await createClient();
  const version = await getActiveVersion();
  const [{ data: exam }, { data: versions }, { data: items }, { data: topics }, bank, { count: attemptCount }] = await Promise.all([
    supabase.from("exams").select("*, paper_components(number)").eq("id", id).maybeSingle(),
    supabase.from("exam_versions").select("*").eq("exam_id", id).order("version", { ascending: false }),
    supabase.from("exam_questions").select("question_id, marks_override, section_label, sort_order").eq("exam_id", id).order("sort_order"),
    supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").order("sort_order"),
    getBankItems(),
    supabase.from("attempts").select("id", { count: "exact", head: true }).eq("exam_id", id),
  ]);
  if (!exam) notFound();
  const e = exam as Exam & { paper_components: { number: number } | null };
  const canEdit = profile.role === "admin" || e.created_by === profile.id;
  const current = (versions ?? []).find((v) => v.id === e.current_version_id);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Exam Sessions", href: "/teacher/exams" }, { label: e.title }]}
        title={e.title}
        description={current ? `Published v${current.version} · ${current.question_count} questions · ${current.total_marks} marks · ${attemptCount ?? 0} attempts` : "Not published yet"}
        actions={
          <>
            <Badge tone={e.status === "published" ? "success" : e.status === "draft" ? "neutral" : "warning"}>{e.status}</Badge>
            <ButtonLink href={`/teacher/exams/${e.id}/live`} variant="secondary">Live monitor</ButtonLink>
            {e.current_version_id && <ButtonLink href={`/teacher/assignments/new?exam=${e.id}`} variant="secondary">Assign</ButtonLink>}
            <ConfirmButton action={duplicateExam} fields={{ exam_id: e.id }} label={<><Copy className="h-4 w-4" /> Duplicate</>} size="md" />
          </>
        }
      />
      {!canEdit && <Alert tone="info" className="mb-6">This exam was created by someone else. Duplicate it to make an editable copy.</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Settings" />
          <CardBody>
            <ExamSettingsForm exam={e} topics={topics ?? []} paperNumber={e.paper_components?.number} readOnly={!canEdit} />
          </CardBody>
        </Card>
        <div className="space-y-6">
          <TeacherResources resources={(e as { teacher_resources?: TeacherResource[] }).teacher_resources} />
          <Card>
            <CardHeader title="Publish" description="Publishing freezes the current questions and mark schemes into a new immutable version." />
            <CardBody className="space-y-3">
              {(attemptCount ?? 0) > 0 && (
                <p className="text-sm text-muted">Students have already sat this exam. Publishing creates a new version; their results stay linked to the version they took.</p>
              )}
              {canEdit && (
                <ActionForm action={publishExam} submitLabel={current ? "Publish new version" : "Publish"} pendingLabel="Publishing…" submitVariant="success">
                  <input type="hidden" name="exam_id" value={e.id} />
                </ActionForm>
              )}
              {canEdit && e.status !== "draft" && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                  {e.status !== "closed" && <ConfirmButton action={setExamStatus} fields={{ exam_id: e.id, status: "closed" }} label="Close" confirm="Close this exam? Students can no longer start it." />}
                  {e.status === "closed" && <ConfirmButton action={setExamStatus} fields={{ exam_id: e.id, status: "published" }} label="Reopen" />}
                  <ConfirmButton action={setExamStatus} fields={{ exam_id: e.id, status: "archived" }} label="Archive" variant="danger" confirm="Archive this exam? Existing results are kept." />
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Versions" />
            <CardBody>
              {(versions ?? []).length === 0 ? (
                <p className="text-sm text-muted">No published versions.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {(versions ?? []).map((v) => (
                    <li key={v.id} className="flex items-center justify-between">
                      <span>Version {v.version} {v.id === e.current_version_id && <Badge tone="success" className="ml-1">current</Badge>}</span>
                      <span className="text-xs text-muted">{v.question_count} q · {v.total_marks} marks · {formatDate(v.published_at, false)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader title="Questions" description="Edits here change the draft only. Publish to release them." />
        <CardBody>
          <ExamQuestionPicker examId={e.id} bank={bank} readOnly={!canEdit} initial={(items ?? []).map((i) => ({ question_id: i.question_id, marks_override: i.marks_override, section_label: i.section_label }))} />
        </CardBody>
      </Card>
    </>
  );
}
