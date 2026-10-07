import { createClient } from "@supabase/supabase-js";
import { contentId, splitLoRef } from "../../src/lib/content/ids";
import type { TheoryBlock } from "../../src/lib/theory/blocks";

export const PROGRAMME_VERSION = "NIS_CS_2026_2027";
export const SPEC_VERSION = "NIS_CS_EXAM_SPEC";

export type TheoryInputSection = { title: string; objectives: string[]; blocks: TheoryBlock[] };

/**
 * Replaces a topic's theory pack in Supabase, using the same deterministic ids
 * as the seed builder so seed.sql and imports never create duplicates.
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (from .env.local).
 */
export async function pushTheory(opts: {
  slug: string;
  title: string;
  summary?: string | null;
  sections: TheoryInputSection[];
  status: "draft" | "published";
  source: string;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Uploading needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  const db = createClient(url, key, { auth: { persistSession: false } });

  const { data: version } = await db.from("curriculum_versions").select("id").eq("code", PROGRAMME_VERSION).single();
  const { data: t } = await db.from("topics").select("id, description").eq("curriculum_version_id", version!.id).eq("slug", opts.slug).single();
  if (!t) throw new Error(`Topic ${opts.slug} not found in the database`);
  const loId = (ref: string) => {
    const { code, paper } = splitLoRef(ref);
    return contentId("lo", paper ? SPEC_VERSION : PROGRAMME_VERSION, code);
  };

  const packId = contentId("theory", opts.slug);
  await db.from("theory_packs").delete().eq("topic_id", t.id).neq("id", packId);
  const { data: existing } = await db.from("theory_packs").select("version").eq("id", packId).maybeSingle();
  const { error: packErr } = await db.from("theory_packs").upsert({
    id: packId,
    topic_id: t.id,
    title: opts.title,
    summary: opts.summary ?? null,
    status: opts.status,
    version: (existing?.version ?? 0) + 1,
    published_at: opts.status === "published" ? new Date().toISOString() : null,
  });
  if (packErr) throw new Error(`theory pack: ${packErr.message}`);

  await db.from("theory_sections").delete().eq("theory_pack_id", packId);
  for (const [i, s] of opts.sections.entries()) {
    const sid = contentId("theory-section", opts.slug, i);
    const { error } = await db.from("theory_sections").insert({ id: sid, theory_pack_id: packId, title: s.title, blocks: s.blocks, sort_order: i });
    if (error) throw new Error(`section ${s.title}: ${error.message}`);
    if (s.objectives.length) {
      const { error: loErr } = await db
        .from("theory_section_objectives")
        .insert(s.objectives.map((r) => ({ theory_section_id: sid, learning_objective_id: loId(r) })));
      if (loErr) throw new Error(`section ${s.title} objectives: ${loErr.message}`);
    }
  }
  if (!t.description && opts.summary) await db.from("topics").update({ description: opts.summary }).eq("id", t.id);
  await db.from("audit_logs").insert({
    action: "theory.import",
    entity_type: "theory_pack",
    entity_id: packId,
    details: { source: opts.source, sections: opts.sections.length, status: opts.status },
  });
}
