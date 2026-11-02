/**
 * Exports the notes waiting for the teacher's check (status PENDING) so they
 * can be checked in one sitting for the whole class, then marked with
 * notes-grade.ts.
 *
 *   npx tsx --env-file=.env.local scripts/notes-queue.ts --out <dir> [--topic <slug>]
 *
 * <dir>/manifest.json lists one group per topic lesson: its checklist (or, if
 * the lesson has none yet, the theory text to write one from) and the waiting
 * submissions; each submission's photos are saved in <dir>/<submission id>/.
 * The photos are pupils' work: keep <dir> private and delete it afterwards.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { theoryBlocksSchema } from "../src/lib/theory/blocks";
import { theoryToText } from "../src/lib/notes/theory-text";
import { NOTES_PROMPT_VERSION } from "../src/lib/notes/score";

const { values } = parseArgs({ options: { out: { type: "string" }, topic: { type: "string" } } });

async function main() {
  if (!values.out) throw new Error("Usage: scripts/notes-queue.ts --out <dir> [--topic <slug>]");
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  let q = db
    .from("note_submissions")
    .select("id, student_id, topic_id, lesson_no, image_paths, created_at, topics!inner(slug, title), profiles!note_submissions_student_id_fkey(first_name, last_name, username)")
    .eq("status", "PENDING")
    .order("created_at");
  if (values.topic) q = q.eq("topics.slug", values.topic);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  type Row = {
    id: string; student_id: string; topic_id: string; lesson_no: number | null; image_paths: string[]; created_at: string;
    topics: { slug: string; title: string }; profiles: { first_name: string; last_name: string; username: string };
  };
  const rows = (data ?? []) as unknown as Row[];
  mkdirSync(values.out, { recursive: true });

  const { data: members } = await db.from("class_members").select("student_id, classes(name)").eq("status", "active");
  const classOf = new Map(((members ?? []) as unknown as { student_id: string; classes: { name: string } }[]).map((m) => [m.student_id, m.classes.name]));

  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const k = `${r.topic_id}:${r.lesson_no ?? 0}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }

  const manifest = [];
  for (const [k, list] of groups) {
    const { topic_id: topicId, lesson_no: lesson, topics } = list[0];
    const { data: pack } = await db.from("theory_packs").select("id").eq("topic_id", topicId).eq("status", "published").maybeSingle();
    const sq = db.from("theory_sections").select("title, blocks").eq("theory_pack_id", pack?.id ?? "").order("sort_order");
    const { data: secs } = await (lesson ? sq.eq("lesson_no", lesson) : sq);
    const text = theoryToText(
      (secs ?? []).map((s) => {
        const b = theoryBlocksSchema.safeParse(s.blocks);
        return { title: s.title as string, blocks: b.success ? b.data : [] };
      }),
    );
    const hash = createHash("sha256").update(NOTES_PROMPT_VERSION).update(text).digest("hex");
    const { data: rubric } = await db.from("topic_note_rubrics").select("points, source_hash").eq("topic_id", topicId).eq("lesson_no", lesson ?? 0).maybeSingle();
    const current = rubric?.source_hash === hash ? rubric.points : null;

    const submissions = [];
    for (const r of list) {
      const dir = join(values.out, r.id);
      mkdirSync(dir, { recursive: true });
      const photos: string[] = [];
      for (const [i, path] of r.image_paths.entries()) {
        const { data: blob, error: dErr } = await db.storage.from("notes").download(path);
        if (dErr || !blob) throw new Error(`${r.id}: ${dErr?.message}`);
        const file = join(dir, `${i + 1}.jpg`);
        writeFileSync(file, Buffer.from(await blob.arrayBuffer()));
        photos.push(file);
      }
      submissions.push({
        id: r.id,
        student: `${r.profiles.first_name} ${r.profiles.last_name}`.trim() || r.profiles.username,
        class: classOf.get(r.student_id) ?? null,
        handed_in: r.created_at,
        photos,
      });
    }
    manifest.push({ key: k, topic: topics.slug, topic_title: topics.title, lesson, rubric_hash: hash, rubric: current, theory: current ? undefined : text, submissions });
  }
  writeFileSync(join(values.out, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`${rows.length} waiting notes in ${manifest.length} lesson group(s) → ${values.out}/manifest.json`);
  for (const g of manifest) console.log(`  ${g.topic} L${g.lesson ?? "-"}: ${g.submissions.length} · checklist ${g.rubric ? "ready" : "MISSING — write one from the theory text"}`);
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
