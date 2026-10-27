import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion, getSchoolTree, plansFor } from "@/lib/curriculum";
import { getTeacherClasses } from "@/lib/teacher-data";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { TopicVisibilityForm, type VisibilitySection } from "@/components/teacher/topic-visibility-form";

export const metadata: Metadata = { title: "Topic Visibility" };

export default async function TopicVisibilityPage({ searchParams }: PageProps<"/teacher/topics">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const supabase = await createClient();
  const classes = await getTeacherClasses(supabase, profile, true);
  const cls = classes.find((c) => c.id === sp.class) ?? classes[0];

  const header = (
    <PageHeader
      title="Topic Visibility"
      description="Choose which topics each class can see. A hidden topic disappears for the students of that class from Learn & Practice, Exam Papers, search and progress, together with its theory, practice and topic exam. Topics you assign are always visible, and you always see everything yourself."
    />
  );
  if (!cls) {
    return (
      <>
        {header}
        <EmptyState title="No classes yet" action={<ButtonLink href="/teacher/classes">Create a class</ButtonLink>}>
          Topic visibility is set class by class.
        </EmptyState>
      </>
    );
  }

  const version = await getActiveVersion();
  const [tree, { data: topicRows }, { data: hiddenRows }] = await Promise.all([
    getSchoolTree(),
    supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").eq("status", "published").is("archived_at", null).order("sort_order"),
    supabase.from("class_hidden_topics").select("topic_id").eq("class_id", cls.id),
  ]);
  const published = new Map(((topicRows ?? []) as { id: string; title: string }[]).map((t) => [t.id, t]));

  // The class's own grade first, then the other grade, then topics that are only in the exam papers.
  const placed = new Set<string>();
  // The plans the class's students see: a Grade 12 class gets the 2025-26 Grade 11 KTP.
  const sections: VisibilitySection[] = plansFor(tree, { role: "student", grade: cls.grade })
    .sort((a, b) => Number(b.grade === cls.grade) - Number(a.grade === cls.grade) || a.grade - b.grade)
    .map((g) => ({
      key: `g${g.key}`,
      title: `${g.forStudentGrade ? g.title : `Grade ${g.grade}`}${g.grade === cls.grade ? "" : " (other grade)"}`,
      groups: g.terms.flatMap((t) =>
        t.units.map((u) => ({
          key: u.id,
          title: `${t.title} · ${u.code} ${u.title}`,
          // a topic the plan teaches twice gets one checkbox, where it is first taught
          topics: u.topics.filter((x) => published.has(x.id) && !placed.has(x.id)).map((x) => {
            placed.add(x.id);
            return { id: x.id, title: x.title };
          }),
        })),
      ),
    }));
  const examOnly = [...published.values()].filter((t) => !placed.has(t.id));
  if (examOnly.length) {
    sections.push({ key: "exam-only", title: "Exam-only topics (Paper 1–3, not in the school plan)", groups: [{ key: "exam-only", title: "Exam Papers", topics: examOnly }] });
  }

  return (
    <>
      {header}
      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Class">
        {classes.map((c) => (
          <Link key={c.id} href={`/teacher/topics?class=${c.id}`} aria-current={c.id === cls.id ? "page" : undefined}
            className={cn("rounded-full border px-3 py-1 text-sm font-medium", c.id === cls.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2")}>
            {c.name}
            {profile.role === "admin" && c.teacher ? <span className="ml-1.5 font-normal opacity-80">· {displayName(c.teacher)}</span> : null}
          </Link>
        ))}
      </nav>
      <TopicVisibilityForm
        key={cls.id}
        classId={cls.id}
        className={cls.name}
        sections={sections}
        hidden={((hiddenRows ?? []) as { topic_id: string }[]).map((r) => r.topic_id).filter((id) => published.has(id))}
      />
    </>
  );
}
