"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { submitNotes } from "@/app/(app)/learn/[topic]/notes/actions";

// Photos are downscaled here before upload: a notebook page is still easy to
// read at this size, the upload is fast on a phone, and the AI is charged for
// far fewer image tokens than for a full camera photo.
const MAX_SIDE = 1344;
const JPEG_QUALITY = 0.82;

type Photo = { id: string; blob: Blob; url: string; name: string };

async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("no blob"))), "image/jpeg", JPEG_QUALITY));
}

export function NotesUploader({ slug, lesson = null, maxPhotos, remaining }: { slug: string; lesson?: number | null; maxPhotos: number; remaining: number }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [pending, startTransition] = useTransition();

  // Release the preview URLs when the component goes away.
  const latest = useRef<Photo[]>([]);
  useEffect(() => {
    latest.current = photos;
  }, [photos]);
  useEffect(() => () => latest.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setPreparing(true);
    const room = maxPhotos - photos.length;
    const added: Photo[] = [];
    let failed = 0;
    for (const file of [...files].slice(0, room)) {
      try {
        const blob = await downscale(file);
        added.push({ id: crypto.randomUUID(), blob, url: URL.createObjectURL(blob), name: file.name });
      } catch {
        failed += 1;
      }
    }
    setPhotos((prev) => [...prev, ...added]);
    setPreparing(false);
    if (failed) setError("A photo could not be opened. Use JPG or PNG photos (on an iPhone choose “Most Compatible” in Camera → Formats).");
    else if (files.length > room) setError(`Only ${maxPhotos} photos can be checked at once.`);
    if (input.current) input.current.value = "";
  };

  const remove = (id: string) =>
    setPhotos((prev) => {
      prev.filter((p) => p.id === id).forEach((p) => URL.revokeObjectURL(p.url));
      return prev.filter((p) => p.id !== id);
    });

  const submit = () => {
    setError(null);
    const data = new FormData();
    photos.forEach((p, i) => data.append("photos", new File([p.blob], `page-${i + 1}.jpg`, { type: "image/jpeg" })));
    startTransition(async () => {
      const res = await submitNotes(slug, lesson, data);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setPhotos([]);
      router.push(`/learn/${slug}/notes?${lesson ? `lesson=${lesson}&` : ""}check=${res.id}`);
      router.refresh();
    });
  };

  const disabled = pending || remaining <= 0;
  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label="Photos of your notes"
        onChange={(e) => void add(e.target.files)}
      />
      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.id} className="relative overflow-hidden rounded-lg border border-border bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file the student just chose */}
              <img src={p.url} alt={`Page ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">Page {i + 1}</span>
              {!pending && (
                <button type="button" onClick={() => remove(p.id)} aria-label={`Remove page ${i + 1}`}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => input.current?.click()} disabled={disabled || preparing || photos.length >= maxPhotos}>
          {preparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          {photos.length ? "Add another page" : "Add photos of your notes"}
        </Button>
        <Button onClick={submit} disabled={disabled || preparing || photos.length === 0}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {pending ? "Checking your notes…" : "Check my notes"}
        </Button>
        <span className="text-xs text-muted">
          {remaining <= 0 ? "Daily limit reached — try again tomorrow." : `Up to ${maxPhotos} pages · ${remaining} check${remaining === 1 ? "" : "s"} left today`}
        </span>
      </div>
      {pending && <p className="text-sm text-muted" role="status">The AI is reading your handwriting. This usually takes 20–60 seconds — keep this page open.</p>}
    </div>
  );
}
