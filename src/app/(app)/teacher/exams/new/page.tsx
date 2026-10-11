import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { getUnitOptions } from "@/lib/summative";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { ExamSettingsForm } from "@/components/teacher/exam-settings-form";

export const metadata: Metadata = { title: "New exam" };

export default async function NewExamPage({ searchParams }: PageProps<"/teacher/exams/new">) {
  await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const summative = sp.kind === "summative";
  const unitId = typeof sp.unit === "string" ? sp.unit : undefined;
  const supabase = await createClient();
  const version = await getActiveVersion();
  const [{ data: topics }, units] = await Promise.all([
    supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").order("sort_order"),
    getUnitOptions(),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumbs={summative ? [{ label: "Summative Assessments", href: "/teacher/summative" }, { label: "New" }] : [{ label: "Exam Sessions", href: "/teacher/exams" }, { label: "New" }]}
        title={summative ? "New summative assessment" : "New exam"}
        description={summative ? "Create the assessment for a unit, add questions from the bank and publish. Then open it for a class on the Summative Assessments page." : "Create the exam, then add questions from the bank and publish."}
      />
      <Card><CardBody className="p-6"><ExamSettingsForm topics={topics ?? []} units={units} defaultKind={summative ? "summative" : undefined} defaultUnitId={unitId} /></CardBody></Card>
    </div>
  );
}
