import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { STATUS_TONE, type MasteryStatus } from "@/lib/mastery";
import { formatPercent } from "@/lib/format";

export function TopicRow({
  slug,
  title,
  meta,
  mastery,
  status,
  showProgress,
}: {
  slug: string;
  title: string;
  meta?: string;
  mastery: number | null;
  status: MasteryStatus;
  showProgress: boolean;
}) {
  return (
    <Link
      href={`/learn/${slug}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40 hover:bg-surface-2"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium group-hover:text-primary">{title}</p>
        {meta && <p className="truncate text-xs text-muted">{meta}</p>}
      </div>
      {showProgress && (
        <div className="hidden w-32 shrink-0 items-center gap-2 sm:flex">
          <ProgressBar value={mastery} label={`${title} mastery`} />
          <span className="w-9 text-right text-xs tabular-nums text-muted">{mastery == null ? "" : formatPercent(mastery)}</span>
        </div>
      )}
      {showProgress && <Badge tone={STATUS_TONE[status]}>{status}</Badge>}
    </Link>
  );
}
