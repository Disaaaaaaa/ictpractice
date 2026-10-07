import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { ExamSettingsForm } from "@/components/teacher/exam-settings-form";

export const metadata: Metadata = { title: "New exam" };

export default async function NewExamPage() {
  await requireProfile(["teacher", "admin"]);
  const supabase = await createClient();
  const version = await getActiveVersion();
  const { data: topics } = await supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").order("sort_order");
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader breadcrumbs={[{ label: "Exam Sessions", href: "/teacher/exams" }, { label: "New" }]} title="New exam" description="Create the exam, then add questions from the bank and publish." />
      <Card><CardBody className="p-6"><ExamSettingsForm topics={topics ?? []} /></CardBody></Card>
    </div>
  );
}
