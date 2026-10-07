const TZ = process.env.NEXT_PUBLIC_TIMEZONE ?? "Asia/Qyzylorda";

export function formatDate(iso: string | null | undefined, withTime = true): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** 125 → "2:05", 3725 → "1:02:05" */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  const s = Math.round(seconds);
  if (s < 60) return `${s} sec`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${s % 60 ? ` ${s % 60} sec` : ""}`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export function formatPercent(v: number | null | undefined, digits = 0): string {
  if (v == null || Number.isNaN(v)) return "—";
  return `${Number(v).toFixed(digits)}%`;
}

export function formatMark(v: number | string | null | undefined): string {
  if (v == null) return "—";
  const n = Number(v);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "never";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} d ago`;
  return formatDate(iso, false);
}

/** Current time in ms (wrapped so server components stay lint-pure). */
export function nowMs(): number {
  return Date.now();
}
