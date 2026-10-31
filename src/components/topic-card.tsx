import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { STATUS_TONE, type MasteryStatus } from "@/lib/mastery";
import { formatPercent } from "@/lib/format";

export function TopicRow({
  slug,
  href,
  title,
  meta,
  mastery,
  status,
  showProgress,
  hours,
}: {
  slug: string;
  /** default: the topic page */
  href?: string;
  title: string;
  meta?: string;
  mastery: number | null;
  status: MasteryStatus;
  showProgress: boolean;
  /** KTP hours for the topic; shown to teachers */
  hours?: number | null;
}) {
  return (
    <Link
      href={href ?? `/learn/${slug}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40 hover:bg-surface-2"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium group-hover:text-primary">{title}</p>
        {meta && <p className="truncate text-xs text-muted">{meta}</p>}
      </div>
      {hours != null && (
        <span title="Hours in the KTP" className="shrink-0">
          <Badge tone="neutral" className="tabular-nums">{hours} h</Badge>
        </span>
      )}
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
