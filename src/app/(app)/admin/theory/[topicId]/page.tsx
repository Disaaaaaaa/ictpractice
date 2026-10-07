import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { theoryBlocksSchema } from "@/lib/theory/blocks";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { TheoryEditor } from "@/components/admin/theory-editor";

export const metadata: Metadata = { title: "Theory editor" };

export default async function TheoryEditorPage({ params }: PageProps<"/admin/theory/[topicId]">) {
  await requireProfile(["admin"]);
  const { topicId } = await params;
  const supabase = await createClient();
  const [{ data: topic }, { data: pack }] = await Promise.all([
    supabase.from("topics").select("id, slug, title, topic_objectives(learning_objectives(id, code, description))").eq("id", topicId).maybeSingle(),
    supabase.from("theory_packs").select("title, summary, status, theory_sections(id, title, blocks, sort_order, theory_section_objectives(learning_objective_id))").eq("topic_id", topicId).maybeSingle(),
  ]);
  if (!topic) notFound();
  const t = topic as unknown as { id: string; slug: string; title: string; topic_objectives: { learning_objectives: { id: string; code: string; description: string } }[] };
  const p = pack as unknown as {
    title: string; summary: string | null; status: "draft" | "review" | "published" | "archived";
    theory_sections: { id: string; title: string; blocks: unknown; sort_order: number; theory_section_objectives: { learning_objective_id: string }[] }[];
  } | null;
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Curriculum", href: "/admin/curriculum" }, { label: t.title, href: `/admin/topics/${t.id}` }, { label: "Theory pack" }]}
        title={`Theory pack — ${t.title}`}
        description="Content is stored as structured blocks (JSON), separate from the application code."
        actions={<ButtonLink href={`/learn/${t.slug}/theory`} variant="secondary">View as student</ButtonLink>}
      />
      <TheoryEditor
        topicId={t.id}
        objectives={t.topic_objectives.map((o) => o.learning_objectives).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))}
        initial={{
          title: p?.title ?? t.title,
          summary: p?.summary ?? null,
          status: p?.status ?? "draft",
          sections: [...(p?.theory_sections ?? [])]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((s) => {
              const parsed = theoryBlocksSchema.safeParse(s.blocks);
              return { id: s.id, title: s.title, objectiveIds: s.theory_section_objectives.map((o) => o.learning_objective_id), blocks: parsed.success ? parsed.data : [] };
            }),
        }}
      />
    </>
  );
}
