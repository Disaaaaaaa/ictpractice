import { cn } from "@/lib/cn";
import { masteryTone } from "@/lib/mastery";

const fill = {
  neutral: "bg-border",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
} as const;

export function ProgressBar({
  value,
  tone,
  className,
  label,
}: {
  value: number | null | undefined;
  tone?: keyof typeof fill;
  className?: string;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  const t = tone ?? masteryTone(value ?? null);
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}
    >
      <div className={cn("h-full rounded-full transition-all", fill[t])} style={{ width: `${v}%` }} />
    </div>
  );
}

/** "Paper 1  ████████░░  82%" style row. */
export function ReadinessRow({ label, value, sub }: { label: string; value: number | null; sub?: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3 text-sm">
      <div className="min-w-0">
        <div className="truncate font-medium">{label}</div>
        {sub && <div className="truncate text-xs text-muted">{sub}</div>}
      </div>
      <ProgressBar value={value} label={label} />
      <div className="text-right tabular-nums font-medium">{value == null ? "—" : `${Math.round(value)}%`}</div>
    </div>
  );
}
