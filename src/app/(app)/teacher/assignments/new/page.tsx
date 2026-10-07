import type { Metadata } from "next";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTeacherClasses, getVisibleStudents } from "@/lib/teacher-data";
import { getActiveVersion } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { AssignmentForm } from "@/components/teacher/assignment-form";

export const metadata: Metadata = { title: "New assignment" };

export default async function NewAssignmentPage({ searchParams }: PageProps<"/teacher/assignments/new">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const supabase = await createClient();
  const version = await getActiveVersion();
  const [classes, students, { data: exams }, { data: topics }] = await Promise.all([
    getTeacherClasses(supabase, profile),
    getVisibleStudents(supabase),
    supabase.from("exams").select("id, title, kind, year, duration_minutes").in("status", ["published", "scheduled"]).is("archived_at", null).not("current_version_id", "is", null).order("kind").order("title"),
    supabase.from("topics").select("id, title, slug").eq("curriculum_version_id", version?.id ?? "").eq("status", "published").order("sort_order"),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader breadcrumbs={[{ label: "Assignments", href: "/teacher/assignments" }, { label: "New" }]} title="New assignment" />
      <Card>
        <CardBody className="p-6">
          <AssignmentForm
            classes={classes.map((c) => ({ id: c.id, label: `${c.name} (${c.member_count})` }))}
            students={students.map((s) => ({ id: s.id, label: `${displayName(s)} · ${s.username}` }))}
            exams={(exams ?? []).map((e) => ({ id: e.id, kind: e.kind, label: `${e.kind === "mock" ? `Mock ${e.year ?? ""} · ` : ""}${e.title} (${e.duration_minutes} min)` }))}
            topics={(topics ?? []).map((t) => ({ id: t.id, label: t.title }))}
            defaultClass={typeof sp.class === "string" ? sp.class : undefined}
            defaultExam={typeof sp.exam === "string" ? sp.exam : undefined}
          />
        </CardBody>
      </Card>
    </div>
  );
}
