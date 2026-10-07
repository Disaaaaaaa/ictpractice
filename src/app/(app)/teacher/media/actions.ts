"use server";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Uploads a figure for a question or theory section to the public "media"
 * bucket. Staff only; the bucket allows images up to 5 MB.
 */
export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  const profile = await requireProfile(["teacher", "admin"]);
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Choose an image." };
  const ext = TYPES[file.type];
  if (!ext) return { ok: false, error: "Use a PNG, JPEG, WebP or GIF image." };
  if (file.size > MAX_BYTES) return { ok: false, error: "The image must be 5 MB or smaller." };
  const folder = formData.get("folder") === "theory" ? "theory" : "questions";
  const path = `${folder}/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const admin = createAdminClient();
  const { error } = await admin.storage.from("media").upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return { ok: false, error: `Upload failed: ${error.message}` };
  await admin.from("audit_logs").insert({ actor_id: profile.id, action: "media.upload", entity_type: "media", details: { path, size: file.size } });
  return { ok: true, url: admin.storage.from("media").getPublicUrl(path).data.publicUrl };
}
