"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { getTopicBySlug } from "@/lib/curriculum";
import { AiUnavailableError } from "@/lib/grading/ai";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { NOTE_LIMITS, NotesError, notePhotoPaths, remainingChecks, runNoteCheck } from "@/lib/notes/service";
import { getTopicLessons } from "@/lib/lessons";

export type NotesActionResult = { ok: true; id: string; reused: boolean } | { ok: false; error: string };

const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** JPEG, PNG or WebP by signature — the declared type alone is not trusted. */
function looksLikeImage(b: Buffer): boolean {
  if (b.length < 12) return false;
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP";
  return jpeg || png || webp;
}

type Target = { profileId: string; topic: { id: string; title: string }; lessonNo: number | null };

/** The signed-in student's topic (and lesson) the notes are for, or an error. */
async function target(slug: string, lesson: number | null): Promise<Target | { error: string }> {
  const profile = await requireProfile();
  // RLS: a topic hidden from the student's class is not found.
  const topic = await getTopicBySlug(slug);
  if (!topic) return { error: "This topic could not be found." };
  // a topic taught in lessons is checked lesson by lesson
  const lessons = await getTopicLessons(topic.id);
  if (lessons.length && !lessons.some((l) => l.number === lesson)) return { error: "Choose the lesson your notes are for." };
  return { profileId: profile.id, topic: { id: topic.id, title: topic.title }, lessonNo: lessons.length ? lesson : null };
}

export type NotesUploadStart =
  | { ok: true; id: string; uploads: { path: string; token: string }[] }
  | { ok: false; error: string };

/**
 * Step 1 of handing in: one-time upload links for the photos. The browser
 * uploads them straight to storage, so many pages do not hit the size limit
 * of a request to the site.
 */
export async function startNotesUpload(slug: string, lesson: number | null, count: number): Promise<NotesUploadStart> {
  const t = await target(slug, lesson);
  if ("error" in t) return { ok: false, error: t.error };
  if (!Number.isInteger(count) || count < 1) return { ok: false, error: "Add at least one photo of your notes." };
  if (count > NOTE_LIMITS.maxPhotos) return { ok: false, error: `Add at most ${NOTE_LIMITS.maxPhotos} photos.` };
  const admin = createAdminClient();
  if ((await remainingChecks(admin, t.profileId, t.topic.id, t.lessonNo)) <= 0) {
    return { ok: false, error: "You have reached today's limit for handing in notes. Try again tomorrow." };
  }
  const id = randomUUID();
  const uploads: { path: string; token: string }[] = [];
  for (const path of notePhotoPaths(t.profileId, id, count)) {
    const { data, error } = await admin.storage.from("notes").createSignedUploadUrl(path);
    if (error || !data) return { ok: false, error: "The upload could not be started. Please try again." };
    uploads.push({ path, token: data.token });
  }
  return { ok: true, id, uploads };
}

/** Step 2: checks the uploaded photos and hands the notes in (or checks them). */
export async function finishNotesUpload(slug: string, lesson: number | null, id: string, count: number): Promise<NotesActionResult> {
  const t = await target(slug, lesson);
  if ("error" in t) return { ok: false, error: t.error };
  if (!/^[0-9a-f-]{36}$/i.test(id) || !Number.isInteger(count) || count < 1 || count > NOTE_LIMITS.maxPhotos) {
    return { ok: false, error: "The upload is not valid. Please try again." };
  }
  const admin = createAdminClient();
  // only this student's own folder for this hand-in
  const paths = notePhotoPaths(t.profileId, id, count);
  const files = await Promise.all(paths.map((path) => admin.storage.from("notes").download(path)));
  const drop = () => admin.storage.from("notes").remove(paths);
  if (files.some((f) => f.error || !f.data)) {
    await drop();
    return { ok: false, error: "Some photos did not upload. Please try again." };
  }
  const photos = await Promise.all(files.map(async (f) => ({ bytes: Buffer.from(await f.data!.arrayBuffer()), type: f.data!.type || "image/jpeg" })));
  if (photos.some((p) => p.bytes.length > NOTE_LIMITS.maxPhotoBytes)) {
    await drop();
    return { ok: false, error: "The photos are too large. Take them again." };
  }
  if (photos.some((p) => !looksLikeImage(p.bytes) || !TYPES.has(p.type))) {
    await drop();
    return { ok: false, error: "One of the files is not a valid image." };
  }

  try {
    const done = await runNoteCheck({ studentId: t.profileId, topic: t.topic, lesson: t.lessonNo, photos, stored: { id, paths } });
    revalidatePath(`/learn/${slug}/notes`);
    return { ok: true, ...done };
  } catch (e) {
    if (e instanceof NotesError) return { ok: false, error: e.message };
    if (e instanceof AiUnavailableError) return { ok: false, error: "AI checking is not set up on this site yet." };
    console.error("notes check failed", e);
    return { ok: false, error: "The check could not be completed. Please try again in a minute." };
  }
}
