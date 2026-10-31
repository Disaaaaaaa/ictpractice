import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { createAdminClient } from "../supabase/admin";
import { logAiUsage } from "../grading/ai-cache";
import { theoryBlocksSchema } from "../theory/blocks";
import { NOTES_PROMPT_VERSION, buildRubric, checkPhotos } from "./ai";
import { scoreNotes, type NoteResult, type RubricPoint } from "./score";
import { theoryToText } from "./theory-text";

// Server-side flow of a notes check. See
// supabase/migrations/20261012000013_note_checks.sql for the cost-saving design.

export const NOTE_LIMITS = {
  maxPhotos: 4,
  /** each photo after the browser has downscaled it */
  maxPhotoBytes: 1_500_000,
  /** Vercel functions accept request bodies up to 4.5 MB */
  maxTotalBytes: 4_000_000,
  perTopicPerDay: 5,
  perDay: 15,
};

export type NoteSubmission = {
  id: string;
  student_id: string;
  topic_id: string;
  lesson_no: number | null;
  image_paths: string[];
  status: "CHECKED" | "UNREADABLE";
  percentage: number | null;
  result: NoteResult;
  created_at: string;
};

export class NotesError extends Error {}

type Admin = ReturnType<typeof createAdminClient>;
const sha = (...parts: (string | Buffer)[]) => parts.reduce((h, p) => h.update(p), createHash("sha256")).digest("hex");

/**
 * The checklist of a topic (or of one lesson: its theory sections only),
 * generated from the theory pack the first time and whenever the theory changes.
 */
export async function getOrCreateRubric(admin: Admin, topic: { id: string; title: string }, lesson: number | null = null): Promise<{ points: RubricPoint[]; hash: string }> {
  const { data: pack } = await admin.from("theory_packs").select("id").eq("topic_id", topic.id).eq("status", "published").maybeSingle();
  if (!pack) throw new NotesError("This topic has no theory pack to check notes against yet.");
  const sectionQuery = admin.from("theory_sections").select("title, blocks").eq("theory_pack_id", pack.id).order("sort_order");
  const { data: rows } = await (lesson ? sectionQuery.eq("lesson_no", lesson) : sectionQuery);
  const sections = (rows ?? []).map((s) => {
    const blocks = theoryBlocksSchema.safeParse(s.blocks);
    return { title: s.title as string, blocks: blocks.success ? blocks.data : [] };
  });
  const text = theoryToText(sections);
  if (text.length < 200) throw new NotesError(`This ${lesson ? "lesson" : "topic"}'s theory is too short to check notes against.`);
  const hash = sha(NOTES_PROMPT_VERSION, text);

  const { data: existing } = await admin
    .from("topic_note_rubrics")
    .select("points, source_hash")
    .eq("topic_id", topic.id)
    .eq("lesson_no", lesson ?? 0)
    .maybeSingle();
  if (existing && existing.source_hash === hash) return { points: existing.points as RubricPoint[], hash };

  const built = await buildRubric(lesson ? `${topic.title} (lesson ${lesson})` : topic.title, text);
  await logAiUsage({ context: "notes", model: built.model, effort: "low", cacheHit: false, usage: built.usage });
  await admin
    .from("topic_note_rubrics")
    .upsert(
      { topic_id: topic.id, lesson_no: lesson ?? 0, points: built.points, source_hash: hash, model: built.model, updated_at: new Date().toISOString() },
      { onConflict: "topic_id,lesson_no" },
    );
  return { points: built.points, hash };
}

/** How many checks the student may still run today (per topic or lesson, and overall). */
export async function remainingChecks(admin: Admin, studentId: string, topicId: string, lesson: number | null = null) {
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();
  const { data } = await admin.from("note_submissions").select("topic_id, lesson_no").eq("student_id", studentId).gte("created_at", since);
  const all = data ?? [];
  const here = all.filter((r) => r.topic_id === topicId && (r.lesson_no ?? null) === lesson).length;
  return Math.max(0, Math.min(NOTE_LIMITS.perDay - all.length, NOTE_LIMITS.perTopicPerDay - here));
}

/**
 * Checks the photos against the topic's checklist and stores the result.
 * Returns the stored submission; identical photos return the earlier result
 * without another AI call.
 */
export async function runNoteCheck(p: {
  studentId: string;
  topic: { id: string; title: string };
  /** the lesson the notes are for (topics taught in lessons) */
  lesson: number | null;
  photos: { bytes: Buffer; type: string }[];
}): Promise<{ id: string; reused: boolean }> {
  const admin = createAdminClient();
  const rubric = await getOrCreateRubric(admin, p.topic, p.lesson);
  const contentHash = sha(...p.photos.map((x) => x.bytes));

  const { data: same } = await admin
    .from("note_submissions")
    .select("id")
    .eq("student_id", p.studentId)
    .eq("topic_id", p.topic.id)
    .eq("content_hash", contentHash)
    .eq("rubric_hash", rubric.hash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (same) return { id: same.id as string, reused: true };

  if ((await remainingChecks(admin, p.studentId, p.topic.id, p.lesson)) <= 0) {
    throw new NotesError("You have reached today's limit of notes checks. Improve your notes and try again tomorrow.");
  }

  const checked = await checkPhotos(
    p.topic.title,
    rubric.points,
    p.photos.map((x) => `data:${x.type};base64,${x.bytes.toString("base64")}`),
  );
  await logAiUsage({ context: "notes", model: checked.model, cacheHit: false, usage: checked.usage });

  const readable = checked.check.readable && checked.check.onTopic;
  const scored = scoreNotes(rubric.points, readable ? checked.check.verdicts : [], readable ? checked.check.errors : []);

  // Photos are kept so the teacher can look at what was checked.
  const id = randomUUID();
  const paths: string[] = [];
  for (const [i, photo] of p.photos.entries()) {
    const path = `${p.studentId}/${id}/${i + 1}.jpg`;
    const { error } = await admin.storage.from("notes").upload(path, photo.bytes, { contentType: photo.type, upsert: false });
    if (error) {
      if (paths.length) await admin.storage.from("notes").remove(paths);
      throw new NotesError("The photos could not be saved. Please try again.");
    }
    paths.push(path);
  }
  const { error } = await admin.from("note_submissions").insert({
    id,
    student_id: p.studentId,
    topic_id: p.topic.id,
    lesson_no: p.lesson,
    image_paths: paths,
    content_hash: contentHash,
    rubric_hash: rubric.hash,
    status: readable ? "CHECKED" : "UNREADABLE",
    percentage: readable ? scored.percentage : null,
    result: readable
      ? scored.result
      : { points: [], errors: [], advice: [], reason: checked.check.readable ? "off_topic" : "unreadable" },
    model: checked.model,
    prompt_tokens: checked.usage.promptTokens,
    completion_tokens: checked.usage.completionTokens,
  });
  if (error) {
    await admin.storage.from("notes").remove(paths);
    throw new NotesError("The result could not be saved. Please try again.");
  }
  return { id, reused: false };
}

/** Short-lived links to the photos of a submission (the bucket is private). */
export async function signedPhotoUrls(paths: string[], seconds = 600): Promise<string[]> {
  if (!paths.length) return [];
  const { data } = await createAdminClient().storage.from("notes").createSignedUrls(paths, seconds);
  return (data ?? []).map((d) => d.signedUrl).filter((u): u is string => Boolean(u));
}
