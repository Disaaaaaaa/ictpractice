import { createHash } from "node:crypto";

/** Deterministic UUID (v5-style) from stable keys, shared by the seed builder and importers. */
export function contentId(...parts: (string | number)[]): string {
  const h = createHash("sha1").update(["nis-cs", ...parts].join("|")).digest();
  h[6] = (h[6] & 0x0f) | 0x50;
  h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.subarray(0, 16).toString("hex");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`;
}

/** "11.5.4.1@paper" → objective from the Paper 1-2-3 specification instead of the KTP. */
export const PAPER_SUFFIX = "@paper";
export function splitLoRef(ref: string): { code: string; paper: boolean } {
  return ref.endsWith(PAPER_SUFFIX) ? { code: ref.slice(0, -PAPER_SUFFIX.length), paper: true } : { code: ref, paper: false };
}
