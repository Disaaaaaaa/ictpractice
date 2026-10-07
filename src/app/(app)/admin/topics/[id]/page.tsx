import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlacementOptions } from "@/lib/admin-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { TopicForm } from "@/components/admin/topic-form";
import { LoCode } from "@/components/lo-code";
import { setTopicObjectives } from "../../actions";

export const metadata: Metadata = { title: "Edit topic" };

export default async function EditTopicPage({ params }: PageProps<"/admin/topics/[id]">) {
  await requireProfile(["admin"]);
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: topic }, opts] = await Promise.all([
    supabase
      .from("topics")
      .select("id, slug, title, description, status, recommended_minutes, school_placements(unit_id), exam_placements(paper_section_id), topic_objectives(learning_objectives(id, code, description, curriculum_versions(kind)))")
      .eq("id", id)
      .maybeSingle(),
    getPlacementOptions(),
  ]);
  if (!topic) notFound();
  const t = topic as unknown as {
    id: string; slug: string; title: string; description: string | null; status: string; recommended_minutes: number | null;
    school_placements: { unit_id: string }[]; exam_placements: { paper_section_id: string }[];
    topic_objectives: { learning_objectives: { id: string; code: string; description: string; curriculum_versions: { kind: string } | null } }[];
  };
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Curriculum", href: "/admin/curriculum" }, { label: t.title }]}
        title={t.title}
        description={<span className="font-mono">{t.slug}</span>}
        actions={
          <>
            <ButtonLink href={`/admin/theory/${t.id}`} variant="secondary">Edit theory pack</ButtonLink>
            <ButtonLink href={`/teacher/questions/new?topic=${t.id}`} variant="secondary">Add question</ButtonLink>
            <ButtonLink href={`/learn/${t.slug}`} variant="ghost">View as student</ButtonLink>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <Card>
          <CardHeader title="Topic" />
          <CardBody>
            <TopicForm topic={t} units={opts.units} sections={opts.sections} unitId={t.school_placements[0]?.unit_id} sectionIds={t.exam_placements.map((e) => e.paper_section_id)} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Learning objectives" description="LO ↔ topic mapping drives progress and paper readiness." />
          <CardBody className="space-y-3">
            <ul className="space-y-2">
              {t.topic_objectives.map(({ learning_objectives: lo }) => (
                <li key={lo.id} className="flex items-start gap-2 text-sm">
                  {lo.curriculum_versions?.kind === "exam_specification" ? (
                    <LoCode code={lo.code} paper className="text-xs font-semibold text-primary" />
                  ) : (
                    <Link href={`/admin/curriculum?tab=objectives&lo=${lo.code}`} className="font-mono text-xs font-semibold text-primary">{lo.code}</Link>
                  )}
                  <span className="flex-1 text-xs">{lo.description}</span>
                  <form action={setTopicObjectives}>
                    <input type="hidden" name="topic_id" value={t.id} />
                    <input type="hidden" name="remove_id" value={lo.id} />
                    <button type="submit" className="text-xs text-danger hover:underline">remove</button>
                  </form>
                </li>
              ))}
            </ul>
            <form action={setTopicObjectives} className="flex gap-2">
              <input type="hidden" name="topic_id" value={t.id} />
              <Input name="add_code" placeholder="11.2.1.1 or 11.5.4.1@paper" aria-label="Add objective code" />
              <Button type="submit" variant="secondary">Add</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
