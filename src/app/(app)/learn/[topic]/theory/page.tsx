import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/curriculum";
import { theoryBlocksSchema, type TheoryBlock } from "@/lib/theory/blocks";
import { TheoryBlockView } from "@/components/theory/theory-block";
import { SectionViewTracker } from "@/components/theory/view-tracker";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { LoCode } from "@/components/lo-code";
import { TheoryFullscreen } from "@/components/theory/theory-fullscreen";

export const metadata: Metadata = { title: "Theory Pack" };

export default async function TheoryPage({
  params,
}: PageProps<"/learn/[topic]/theory">) {
  const profile = await requireProfile();
  const topic = await getTopicBySlug((await params).topic);
  if (!topic) notFound();
  const supabase = await createClient();
  const { data: pack } = await supabase
    .from("theory_packs")
    .select(
      "id, title, summary, status, theory_sections(id, title, blocks, sort_order, theory_section_objectives(learning_objectives(code, curriculum_version_id)))",
    )
    .eq("topic_id", topic.id)
    .maybeSingle();
  type Pack = {
    id: string;
    summary: string | null;
    status: string;
    theory_sections: {
      id: string;
      title: string;
      blocks: unknown;
      sort_order: number;
      theory_section_objectives: {
        learning_objectives: { code: string; curriculum_version_id: string };
      }[];
    }[];
  };
  const p = pack as Pack | null;
  const isStudent = profile.role === "student";

  if (!p || p.theory_sections.length === 0) {
    return (
      <EmptyState
        title="The theory pack for this topic is being written"
        action={
          <ButtonLink href={`/learn/${topic.slug}/practice`}>
            Go to practice
          </ButtonLink>
        }
      >
        The learning objectives are listed on the Overview tab.
      </EmptyState>
    );
  }

  const { data: viewed } = isStudent
    ? await supabase
        .from("theory_progress")
        .select("theory_section_id")
        .eq("student_id", profile.id)
    : { data: [] };
  const viewedIds = new Set(
    (viewed ?? []).map((v) => v.theory_section_id as string),
  );
  const sections = [...p.theory_sections].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <TheoryFullscreen title={`${topic.title} — Theory`}>
      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Theory sections" className="hidden lg:block">
          <ol className="sticky top-24 space-y-1 text-sm group-data-[fs=true]:top-16">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#s-${s.id}`}
                  className="flex items-start gap-2 rounded-md px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-fg"
                >
                  <span className="tabular-nums">{i + 1}.</span>
                  <span className="flex-1">{s.title}</span>
                  {viewedIds.has(s.id) && (
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                      aria-label="Read"
                    />
                  )}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="min-w-0 space-y-6">
          {p.status !== "published" && (
            <Badge tone="warning">
              Preview — this theory pack is not published
            </Badge>
          )}
          {sections.map((s, i) => {
            const parsed = theoryBlocksSchema.safeParse(s.blocks);
            const blocks: TheoryBlock[] = parsed.success ? parsed.data : [];
            const codes = s.theory_section_objectives.map((o) => ({
              code: o.learning_objectives.code,
              paper:
                o.learning_objectives.curriculum_version_id !==
                topic.curriculumVersionId,
            }));
            return (
              <Card
                key={s.id}
                id={`s-${s.id}`}
                className="scroll-mt-24 group-data-[fs=true]:scroll-mt-16"
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-4 sm:px-7">
                  <h2 className="mr-auto text-lg font-semibold">
                    <span className="mr-2 text-muted tabular-nums">
                      {i + 1}.
                    </span>
                    {s.title}
                  </h2>
                  {codes.map((c) => (
                    <Badge key={c.code + c.paper} tone="primary">
                      LO <LoCode code={c.code} paper={c.paper} />
                    </Badge>
                  ))}
                </div>
                <div className="space-y-4 px-5 py-5 sm:px-7">
                  {blocks.map((b, j) => (
                    <TheoryBlockView key={j} block={b} />
                  ))}
                  {!parsed.success && (
                    <p className="text-sm text-danger">
                      This section contains invalid content.
                    </p>
                  )}
                </div>
                <SectionViewTracker
                  sectionId={s.id}
                  enabled={isStudent && !viewedIds.has(s.id)}
                />
              </Card>
            );
          })}
          <div className="flex justify-end">
            <ButtonLink href={`/learn/${topic.slug}/practice`}>
              Practise this topic
            </ButtonLink>
          </div>
        </div>
      </div>
    </TheoryFullscreen>
  );
}
