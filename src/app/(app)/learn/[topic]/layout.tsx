import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getTopicBySlug } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { LinkTabs } from "@/components/ui/tabs";

export default async function TopicLayout({ children, params }: { children: ReactNode; params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();
  const school = topic.school[0];
  const base = `/learn/${topic.slug}`;
  return (
    <>
      <PageHeader
        breadcrumbs={[
          school ? { label: "Learn & Practice", href: `/learn?grade=${school.grade}` } : { label: "Exam Papers", href: "/papers" },
          ...(school ? [{ label: `Grade ${school.grade} · ${school.term}`, href: `/learn?grade=${school.grade}` }, { label: `${school.unitCode} ${school.unitTitle}` }] : []),
        ]}
        title={topic.title}
        description={topic.description ?? undefined}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {topic.examOnly && <Badge tone="warning">Exam only — not in the 2026-27 KTP</Badge>}
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
