import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion, getPaperTree } from "@/lib/curriculum";
import { getProgressContext } from "@/lib/progress";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { ActionForm } from "@/components/action-form";
import { cn } from "@/lib/cn";
import { saveObjective } from "../actions";
import { LoCode } from "@/components/lo-code";

export const metadata: Metadata = { title: "Curriculum" };

export default async function CurriculumAdminPage({ searchParams }: PageProps<"/admin/curriculum">) {
  await requireProfile(["admin"]);
  const sp = await searchParams;
  const tab = typeof sp.tab === "string" ? sp.tab : "topics";
  const loCode = typeof sp.lo === "string" ? sp.lo : "";
  const supabase = await createClient();
  const [version, ctx, papers, { data: versions }, { data: packs }, { data: qcounts }] = await Promise.all([
    getActiveVersion(),
    getProgressContext(),
    getPaperTree(),
    supabase.from("curriculum_versions").select("id, code, title, kind, is_active, source_documents").order("code"),
    supabase.from("theory_packs").select("topic_id, status, theory_sections(count)"),
    supabase.from("questions").select("topic_id").neq("status", "archived"),
  ]);
  const packBy = new Map((packs ?? []).map((p) => [p.topic_id as string, p as unknown as { status: string; theory_sections: { count: number }[] }]));
  const qBy = new Map<string, number>();
  for (const q of qcounts ?? []) if (q.topic_id) qBy.set(q.topic_id, (qBy.get(q.topic_id) ?? 0) + 1);
  const { data: allTopics } = await supabase.from("topics").select("id, slug, title, status").eq("curriculum_version_id", version?.id ?? "");
  const statusBy = new Map((allTopics ?? []).map((t) => [t.id as string, t.status as string]));
  const editLo = ctx.los.find((l) => l.code === loCode && l.source === "ktp");
  const sectionsFlat = papers.flatMap((p) => p.groups.flatMap((g) => g.sections.map((s) => ({ ...s, paper: p.number, group: g.title }))));
  const { data: loSections } = editLo ? await supabase.from("objective_paper_map").select("paper_section_id").eq("learning_objective_id", editLo.id) : { data: [] };
  const checked = new Set((loSections ?? []).map((x) => x.paper_section_id as string));

  const tabs = [
    { key: "topics", label: `Topics (${ctx.topics.length})` },
    { key: "objectives", label: `Learning objectives (${ctx.los.length})` },
    { key: "papers", label: "Paper structure" },
    { key: "versions", label: "Versions" },
  ];

  return (
    <>
      <PageHeader title="Curriculum" description={version?.title} actions={<ButtonLink href="/admin/topics/new">New topic</ButtonLink>} />
      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Curriculum sections">
        {tabs.map((t) => (
          <Link key={t.key} href={`/admin/curriculum?tab=${t.key}`} aria-current={tab === t.key ? "page" : undefined}
            className={cn("rounded-full border px-3 py-1 text-sm font-medium", tab === t.key ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2")}>
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "topics" && (
        <Card>
          <CardBody className="p-0">
            <Table>
              <thead><tr><Th>Topic</Th><Th>Placement</Th><Th>Papers</Th><Th>LOs</Th><Th>Theory</Th><Th>Questions</Th><Th>Status</Th><Th /></tr></thead>
              <tbody>
                {ctx.topics.map((t) => {
                  const p = packBy.get(t.id);
                  return (
                    <tr key={t.id}>
                      <Td><Link href={`/admin/topics/${t.id}`} className="font-medium hover:underline">{t.title}</Link><p className="font-mono text-xs text-muted">{t.slug}</p></Td>
                      <Td className="text-xs">{t.examOnly ? <Badge tone="warning">Exam only</Badge> : `G${t.grade} · ${t.termTitle} · ${t.unitCode}`}</Td>
                      <Td className="text-xs">{t.papers.map((n) => `P${n}`).join(", ") || "—"}</Td>
                      <Td className="tabular-nums">{t.loIds.length}</Td>
                      <Td>{p ? <Badge tone={p.status === "published" ? "success" : "warning"}>{p.theory_sections[0]?.count ?? 0} sections</Badge> : <Badge>none</Badge>}</Td>
                      <Td className="tabular-nums">{qBy.get(t.id) ?? 0}</Td>
                      <Td><Badge tone={statusBy.get(t.id) === "published" ? "success" : "neutral"}>{statusBy.get(t.id)}</Badge></Td>
                      <Td><Link href={`/admin/theory/${t.id}`} className="text-sm text-primary hover:underline">Theory</Link></Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}

      {tab === "objectives" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <Card>
            <CardBody className="p-0">
              <Table>
                <thead><tr><Th>Code</Th><Th>Description</Th><Th>Papers</Th><Th>Topics</Th></tr></thead>
                <tbody>
                  {ctx.los.map((l) => (
                    <tr key={l.id} className={l.code === loCode && l.source === "ktp" ? "bg-primary-soft/50" : undefined}>
                      <Td>
                        {l.source === "paper" ? (
                          <LoCode code={l.code} paper className="text-xs font-semibold" />
                        ) : (
                          <Link href={`/admin/curriculum?tab=objectives&lo=${l.code}`} className="font-mono text-xs font-semibold hover:underline">{l.code}</Link>
                        )}
                      </Td>
                      <Td className="text-xs">{l.description}</Td>
                      <Td className="text-xs">{l.papers.map((p) => `P${p}`).join(", ") || <Badge tone="warning">unmapped</Badge>}</Td>
                      <Td className="text-xs">{l.topicIds.length}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title={editLo ? `Edit ${editLo.code}` : "Add learning objective"} description="Codes are unique within the curriculum version." />
            <CardBody>
              <ActionForm action={saveObjective}>
                <Field label="Code" htmlFor="code"><Input id="code" name="code" defaultValue={editLo?.code} placeholder="11.2.1.3" readOnly={!!editLo} required /></Field>
                <Field label="Description" htmlFor="description"><Textarea id="description" name="description" rows={3} defaultValue={editLo?.description} required /></Field>
                <input type="hidden" name="papers_submitted" value="1" />
                <fieldset className="space-y-1">
                  <legend className="mb-1 text-sm font-medium">Assessed in (one section per paper)</legend>
                  <div className="max-h-64 space-y-1 overflow-y-auto">
                    {sectionsFlat.map((s) => (
                      <Checkbox key={s.id} name="paper_sections" value={s.id} defaultChecked={checked.has(s.id)} label={<span className="text-xs">Paper {s.paper} · {s.code} {s.title}</span>} />
                    ))}
                  </div>
                </fieldset>
              </ActionForm>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "papers" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {papers.map((p) => (
            <Card key={p.id}>
              <CardHeader title={p.title} />
              <CardBody className="space-y-3 text-sm">
                {p.groups.map((g) => (
                  <div key={g.id}>
                    <p className="font-semibold">{g.title}</p>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      {g.sections.map((s) => <li key={s.id}><span className="font-mono text-xs">{s.code}</span> {s.title} <span className="text-xs text-muted">({s.topics.length} topics)</span></li>)}
                    </ul>
                  </div>
                ))}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {tab === "versions" && (
        <Card>
          <CardHeader title="Curriculum versions" description="Learning objectives are identified by version + code, so a new academic year can be imported without breaking old results. Re-run scripts/import_curriculum.py with the new documents to create the next version." />
          <CardBody className="p-0">
            <Table>
              <thead><tr><Th>Code</Th><Th>Title</Th><Th>Kind</Th><Th>Sources</Th><Th>Active</Th></tr></thead>
              <tbody>
                {(versions ?? []).map((v) => (
                  <tr key={v.id}>
                    <Td className="font-mono text-xs">{v.code}</Td>
                    <Td>{v.title}</Td>
                    <Td className="text-xs">{v.kind}</Td>
                    <Td className="text-xs">{(v.source_documents as string[]).join(", ")}</Td>
                    <Td>{v.is_active ? <Badge tone="success">active</Badge> : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </>
  );
}
