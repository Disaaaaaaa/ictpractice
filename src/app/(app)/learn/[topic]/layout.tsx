import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { getSchoolTree, getTopicBySlug, placementsFor, planKey } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { LinkTabs } from "@/components/ui/tabs";

export default async function TopicLayout({ children, params }: { children: ReactNode; params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const [topic, profile, tree] = await Promise.all([getTopicBySlug(slug), requireProfile(), getSchoolTree()]);
  if (!topic) notFound();
  const school = placementsFor(topic.school, tree, profile)[0];
  const gradeHref = school ? `/learn?grade=${planKey(school.grade, school.forStudentGrade)}` : "";
  const base = `/learn/${topic.slug}`;
  return (
    <>
      <PageHeader
        breadcrumbs={[
          school ? { label: "Learn & Practice", href: gradeHref } : { label: "Exam Papers", href: "/papers" },
          ...(school ? [{ label: `${school.forStudentGrade ? school.plan : `Grade ${school.grade}`} · ${school.term}`, href: gradeHref }, { label: `${school.unitCode} ${school.unitTitle}` }] : []),
        ]}
        title={topic.title}
        // an exam-only topic's description says it is outside the plan; not so where an earlier KTP places it
        description={(school && topic.examOnly ? null : topic.description) ?? undefined}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {!school && topic.examOnly && <Badge tone="warning">Exam only — not in the 2026-27 KTP</Badge>}
            {[...new Set(topic.exam.map((e) => e.paperTitle))].map((p) => (
              <Badge key={p} tone="primary">{p}</Badge>
            ))}
          </div>
        }
      />
      <div className="mb-6">
        <LinkTabs
          exact={[base]}
          tabs={[
            { href: base, label: "Overview" },
            { href: `${base}/theory`, label: "Theory Pack" },
            { href: `${base}/notes`, label: "Notes Check" },
            { href: `${base}/practice`, label: "Practice" },
            { href: `${base}/exam`, label: "Exam Mode" },
            { href: `${base}/progress`, label: "Progress" },
          ]}
        />
      </div>
      {children}
    </>
  );
}
