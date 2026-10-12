"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { getTopicBySlug } from "@/lib/curriculum";
import { AiUnavailableError } from "@/lib/grading/ai";
import { NOTE_LIMITS, NotesError, runNoteCheck } from "@/lib/notes/service";

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

/** Checks the photos of a student's notes for the topic and stores the result. */
export async function submitNotes(slug: string, formData: FormData): Promise<NotesActionResult> {
  const profile = await requireProfile();
  // RLS: a topic hidden from the student's class is not found.
  const topic = await getTopicBySlug(slug);
  if (!topic) return { ok: false, error: "This topic could not be found." };

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { ok: false, error: "Add at least one photo of your notes." };
  if (files.length > NOTE_LIMITS.maxPhotos) return { ok: false, error: `Add at most ${NOTE_LIMITS.maxPhotos} photos.` };
  if (files.some((f) => !TYPES.has(f.type))) return { ok: false, error: "Use JPG, PNG or WebP photos." };
  if (files.some((f) => f.size > NOTE_LIMITS.maxPhotoBytes) || files.reduce((s, f) => s + f.size, 0) > NOTE_LIMITS.maxTotalBytes) {
    return { ok: false, error: "The photos are too large. Take them again or add fewer pages." };
  }
  const photos = await Promise.all(files.map(async (f) => ({ bytes: Buffer.from(await f.arrayBuffer()), type: f.type })));
  if (photos.some((p) => !looksLikeImage(p.bytes))) return { ok: false, error: "One of the files is not a valid image." };

  try {
    const done = await runNoteCheck({ studentId: profile.id, topic: { id: topic.id, title: topic.title }, photos });
    revalidatePath(`/learn/${slug}/notes`);
    return { ok: true, ...done };
  } catch (e) {
    if (e instanceof NotesError) return { ok: false, error: e.message };
    if (e instanceof AiUnavailableError) return { ok: false, error: "AI checking is not set up on this site yet." };
    console.error("notes check failed", e);
    return { ok: false, error: "The check could not be completed. Please try again in a minute." };
  }
}
