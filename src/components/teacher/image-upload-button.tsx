"use client";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadMedia } from "@/app/(app)/teacher/media/actions";

/** Uploads an image and hands back Markdown to insert, e.g. ![Figure 1](https://…). */
export function ImageUploadButton({ onInsert, folder = "questions" }: { onInsert: (markdown: string) => void; folder?: "questions" | "theory" }) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />} Insert image
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const fd = new FormData();
          fd.set("file", file);
          fd.set("folder", folder);
          setError(null);
          start(async () => {
            const r = await uploadMedia(fd);
            if (!r.ok) setError(r.error);
            else onInsert(`![${file.name.replace(/\.[^.]+$/, "").replace(/[[\]]/g, "")}](${r.url})`);
          });
        }}
      />
    </span>
  );
}
