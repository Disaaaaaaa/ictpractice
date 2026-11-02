/**
 * Marks notes that wait for the teacher's check (see notes-queue.ts).
 *
 *   npx tsx --env-file=.env.local scripts/notes-grade.ts <results.json> [--dry-run]
 *
 * results.json:
 *   {
 *     "rubrics": [ { "topic": "<slug>", "lesson": 1, "hash": "<rubric_hash from the manifest>",
 *                    "points": [ { "title": "...", "must": "...", "weight": 3 }, ... ] } ],   // new checklists (optional)
 *     "results": [ { "id": "<submission id>", "readable": true, "on_topic": true,
 *                    "verdicts": [ { "n": 1, "s": "c" }, { "n": 2, "s": "p", "note": "..." }, ... ],
 *                    "errors": [ "a factual mistake in the notes" ] } ]
 *   }
 *
 * The percentage and the advice come from scoreNotes(), exactly as for an AI
 * check. Each student gets a notification with the result.
 */
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { scoreNotes, type RubricPoint } from "../src/lib/notes/score";

const point = z.object({ title: z.string().min(1).max(120), must: z.string().min(1).max(400), weight: z.number().int().min(1).max(3) });
const fileSchema = z.object({
  rubrics: z.array(z.object({ topic: z.string(), lesson: z.number().int().nullable(), hash: z.string(), points: z.array(point).min(3).max(20) })).default([]),
  results: z.array(
    z.object({
      id: z.string().uuid(),
      readable: z.boolean(),
      on_topic: z.boolean().default(true),
      verdicts: z.array(z.object({ n: z.number().int().min(1), s: z.enum(["c", "p", "m"]), note: z.string().max(200).optional() })).default([]),
      errors: z.array(z.string().max(300)).max(3).default([]),
    }),
  ),
});

const { values, positionals } = parseArgs({ allowPositionals: true, options: { "dry-run": { type: "boolean", default: false } } });

async function main() {
  if (!positionals[0]) throw new Error("Usage: scripts/notes-grade.ts <results.json> [--dry-run]");
  const input = fileSchema.parse(JSON.parse(readFileSync(positionals[0], "utf8")));
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const dry = values["dry-run"];

  // New checklists are stored like the AI's, so a later AI check would reuse them.
  for (const r of input.rubrics) {
    const { data: t } = await db.from("topics").select("id").eq("slug", r.topic).single();
    if (!t) throw new Error(`topic ${r.topic} not found`);
    if (!dry) {
      const { error } = await db.from("topic_note_rubrics").upsert(
        { topic_id: t.id, lesson_no: r.lesson ?? 0, points: r.points, source_hash: r.hash, model: "teacher", updated_at: new Date().toISOString() },
        { onConflict: "topic_id,lesson_no" },
      );
      if (error) throw new Error(`checklist ${r.topic}: ${error.message}`);
    }
    console.log(`checklist ${r.topic} L${r.lesson ?? "-"}: ${r.points.length} points${dry ? " (dry run)" : ""}`);
  }

  for (const r of input.results) {
    const { data: s } = await db
      .from("note_submissions")
      .select("id, student_id, topic_id, lesson_no, status, topics(slug, title)")
      .eq("id", r.id)
      .single();
    if (!s) throw new Error(`${r.id}: not found`);
    if (s.status !== "PENDING") {
      console.log(`${r.id}: already ${s.status}, skipped`);
      continue;
    }
    const topic = s.topics as unknown as { slug: string; title: string };
    const fromFile = input.rubrics.find((x) => x.topic === topic.slug && (x.lesson ?? null) === (s.lesson_no ?? null));
    let points: RubricPoint[];
    let hash: string;
    if (fromFile) {
      points = fromFile.points;
      hash = fromFile.hash;
    } else {
      const { data: rub } = await db.from("topic_note_rubrics").select("points, source_hash").eq("topic_id", s.topic_id).eq("lesson_no", s.lesson_no ?? 0).maybeSingle();
      if (!rub) throw new Error(`${r.id}: no checklist for ${topic.slug} lesson ${s.lesson_no ?? "-"}`);
      points = rub.points as RubricPoint[];
      hash = rub.source_hash as string;
    }
    const ok = r.readable && r.on_topic;
    const scored = scoreNotes(points, ok ? r.verdicts : [], ok ? r.errors : []);
    const update = {
      status: ok ? "CHECKED" : "UNREADABLE",
      percentage: ok ? scored.percentage : null,
      result: ok ? scored.result : { points: [], errors: [], advice: [], reason: r.readable ? "off_topic" : "unreadable" },
      rubric_hash: hash,
      model: "teacher",
      checked_by: "teacher",
      checked_at: new Date().toISOString(),
    };
    const label = `${topic.title}${s.lesson_no ? `, lesson ${s.lesson_no}` : ""}`;
    console.log(`${r.id}: ${ok ? `${scored.percentage}%` : update.status}  (${label})`);
    if (dry) continue;
    const { error } = await db.from("note_submissions").update(update).eq("id", r.id).eq("status", "PENDING");
    if (error) throw new Error(`${r.id}: ${error.message}`);
    await db.from("notifications").insert({
      user_id: s.student_id,
      type: "feedback",
      title: ok ? `Your notes were checked: ${scored.percentage}%` : "Your notes could not be checked",
      body: ok ? `${label}. See what to add for a higher score.` : `${label}. Take the photos again and hand them in once more.`,
      link: `/learn/${topic.slug}/notes?${s.lesson_no ? `lesson=${s.lesson_no}&` : ""}check=${r.id}`,
    });
  }
  if (!dry) await db.from("audit_logs").insert({ action: "notes.teacher_check", entity_type: "note_submission", details: { checked: input.results.length } });
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
