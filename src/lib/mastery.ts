import type { Tone } from "@/components/ui/badge";

// Progress statuses (spec §62). Thresholds mirror system_settings.mastery_bands.
export const MASTERY_STATUSES = ["Not Started", "Learning", "Developing", "Secure", "Mastered"] as const;
export type MasteryStatus = (typeof MASTERY_STATUSES)[number];

export function masteryStatus(value: number | null | undefined, attempted = value != null): MasteryStatus {
  if (!attempted || value == null) return "Not Started";
  if (value >= 85) return "Mastered";
  if (value >= 70) return "Secure";
  if (value >= 50) return "Developing";
  return "Learning";
}

export function masteryTone(value: number | null | undefined): Exclude<Tone, "neutral"> | "neutral" {
  if (value == null) return "neutral";
  if (value >= 85) return "success";
  if (value >= 70) return "primary";
  if (value >= 50) return "warning";
  return "danger";
}

export const STATUS_TONE: Record<MasteryStatus, Tone> = {
  "Not Started": "neutral",
  Learning: "danger",
  Developing: "warning",
  Secure: "primary",
  Mastered: "success",
};

/** Average of LO masteries; untouched objectives count as 0. */
export function averageMastery(loIds: string[], mastery: Map<string, number>): number | null {
  if (loIds.length === 0) return null;
  const sum = loIds.reduce((s, id) => s + (mastery.get(id) ?? 0), 0);
  return sum / loIds.length;
}

export function anyAttempted(loIds: string[], mastery: Map<string, number>): boolean {
  return loIds.some((id) => mastery.has(id));
}
