import Link from "next/link";
import { AlertTriangle, CheckCircle2, PenLine } from "lucide-react";
import { cn } from "@/lib/cn";
import { KIND_LABEL, type Insight, type InsightKind, type SkillStat } from "@/lib/insights";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";

const ICON: Record<InsightKind, typeof CheckCircle2> = { strength: CheckCircle2, gap: AlertTriangle, habit: PenLine };
const TONE: Record<InsightKind, string> = { strength: "text-success", gap: "text-danger", habit: "text-warning" };
const ORDER: InsightKind[] = ["gap", "habit", "strength"];

/** What the teacher noticed in the student's Exam Mode answers. */
export function InsightList({ insights, linkTopics = true }: { insights: Insight[]; linkTopics?: boolean }) {
  return (
    <div className="space-y-4">
      {ORDER.map((kind) => {
        const list = insights.filter((i) => i.kind === kind);
        if (!list.length) return null;
        const Icon = ICON[kind];
        return (
          <div key={kind}>
            <p className={cn("mb-1.5 text-xs font-semibold uppercase tracking-wide", TONE[kind])}>{KIND_LABEL[kind]}{list.length > 1 ? "s" : ""}</p>
            <ul className="space-y-1.5">
              {list.map((i) => (
                <li key={i.id} className="flex items-start gap-2 text-sm">
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", TONE[kind])} />
                  <span className="min-w-0">
                    {i.text}
                    {i.topics && (
                      <>
                        {" · "}
                        {linkTopics ? (
                          <Link href={`/learn/${i.topics.slug}/theory`} className="text-primary hover:underline">{i.topics.title}</Link>
                        ) : (
                          <span className="text-muted">{i.topics.title}</span>
                        )}
                      </>
                    )}
                    {i.seen > 1 && <span className="ml-1 text-xs text-muted">(seen {i.seen}×)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Marks by command word and the weakest learning objectives. */
export function SkillBars({ stats }: { stats: SkillStat[] }) {
  const commands = stats.filter((s) => s.dimension === "command" && s.max_marks >= 2).sort((a, b) => a.pct - b.pct);
  const objectives = stats.filter((s) => s.dimension === "objective" && s.max_marks >= 3).sort((a, b) => a.pct - b.pct).slice(0, 5);
  if (!commands.length && !objectives.length) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {commands.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">By command word</p>
          {commands.map((c) => (
            <div key={c.code} className="space-y-1">
              <div className="flex justify-between text-sm"><span className="capitalize">{c.label}</span><span className="tabular-nums text-muted">{c.pct}%</span></div>
              <ProgressBar value={c.pct} label={c.label} />
            </div>
          ))}
        </div>
      )}
      {objectives.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Weakest learning objectives</p>
          {objectives.map((o) => (
            <div key={o.code} className="space-y-1" title={o.label}>
              <div className="flex justify-between gap-2 text-sm"><span className="truncate"><span className="font-mono text-xs">{o.code}</span> {o.label}</span><span className="tabular-nums text-muted">{o.pct}%</span></div>
              <ProgressBar value={o.pct} label={o.code} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function InsightsCard({ title, description, insights, stats, empty }: { title: string; description?: string; insights: Insight[]; stats: SkillStat[]; empty: string }) {
  const hasStats = stats.some((s) => s.max_marks >= 2);
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <CardBody className="space-y-5">
        {insights.length === 0 && !hasStats ? <p className="text-sm text-muted">{empty}</p> : null}
        {insights.length > 0 && <InsightList insights={insights} />}
        {hasStats && <SkillBars stats={stats} />}
      </CardBody>
    </Card>
  );
}
