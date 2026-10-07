import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, isStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const profile = await requireProfile();
  const q = String((await searchParams).q ?? "").trim().slice(0, 100);
  const version = await getActiveVersion();
  const supabase = await createClient();
  // ilike pattern: escape wildcards typed by the user
  const pattern = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

  const [topicsByTitle, losByCode, losByText, questions] = q
    ? await Promise.all([
        supabase.from("topics").select("slug, title, description").eq("curriculum_version_id", version?.id ?? "").ilike("title", pattern).limit(20),
        supabase.from("learning_objectives").select("id, code, description, topic_objectives(topics(slug, title))").eq("curriculum_version_id", version?.id ?? "").ilike("code", `${q.replace(/[\\%_]/g, "")}%`).limit(30),
        supabase.from("learning_objectives").select("id, code, description, topic_objectives(topics(slug, title))").eq("curriculum_version_id", version?.id ?? "").ilike("description", pattern).limit(30),
        supabase.from("questions").select("id, title, question_text, topics(slug, title)").or(`title.ilike.${JSON.stringify(pattern)},question_text.ilike.${JSON.stringify(pattern)}`).eq("status", "published").limit(20),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  type LO = { id: string; code: string; description: string; topic_objectives: { topics: { slug: string; title: string } | null }[] };
  const los = [...new Map([...((losByCode.data ?? []) as unknown as LO[]), ...((losByText.data ?? []) as unknown as LO[])].map((l) => [l.id, l])).values()];
  const topics = (topicsByTitle.data ?? []) as { slug: string; title: string; description: string | null }[];
  const qs = (questions.data ?? []) as unknown as { id: string; title: string; question_text: string; topics: { slug: string; title: string } | null }[];
  const total = topics.length + los.length + qs.length;

  return (
    <>
      <PageHeader title="Search" description={q ? `${total} result${total === 1 ? "" : "s"} for “${q}”` : "Search topics, learning objective codes, keywords and questions."} />
      {!q ? (
        <EmptyState title="Type in the search box above">Try “SDLC”, “11.2.1.2” or “two’s complement”.</EmptyState>
      ) : total === 0 ? (
        <EmptyState title="No results">Check the spelling or search for an LO code such as 12.1.1.</EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {topics.length > 0 && (
            <Card>
              <CardHeader title="Topics" />
              <CardBody className="space-y-2">
                {topics.map((t) => (
                  <Link key={t.slug} href={`/learn/${t.slug}`} className="block rounded-lg border border-border p-3 hover:bg-surface-2">
                    <p className="font-medium">{t.title}</p>
                    {t.description && <p className="line-clamp-2 text-sm text-muted">{t.description}</p>}
                  </Link>
                ))}
              </CardBody>
            </Card>
          )}
          {los.length > 0 && (
            <Card>
              <CardHeader title="Learning objectives" />
              <CardBody className="space-y-2">
                {los.map((l) => (
                  <div key={l.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm"><span className="mr-2 font-mono font-semibold text-primary">{l.code}</span>{l.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {l.topic_objectives.map((t) => t.topics && (
                        <Link key={t.topics.slug} href={`/learn/${t.topics.slug}`}><Badge tone="primary">{t.topics.title}</Badge></Link>
                      ))}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
          {qs.length > 0 && (
            <Card>
              <CardHeader title="Questions" />
              <CardBody className="space-y-2">
                {qs.map((x) => (
                  <Link
                    key={x.id}
                    href={isStaff(profile) ? `/teacher/questions/${x.id}` : x.topics ? `/learn/${x.topics.slug}/practice` : "#"}
                    className="block rounded-lg border border-border p-3 hover:bg-surface-2"
                  >
                    <p className="font-medium">{x.title}</p>
                    <p className="line-clamp-2 text-sm text-muted">{x.question_text}</p>
                    {x.topics && <p className="mt-1 text-xs text-muted">{x.topics.title}</p>}
                  </Link>
                ))}
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
