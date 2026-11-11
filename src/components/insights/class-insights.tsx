import Link from "next/link";
import { cn } from "@/lib/cn";
import { KIND_LABEL, summariseClass, type Insight } from "@/lib/insights";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const TONE = { strength: "text-success", gap: "text-danger", habit: "text-warning" } as const;

/**
 * Each class's most common gaps, answer habits and strengths from Exam Mode,
 * with the students who have them.
 */
export function ClassInsightsCard({ classes, insights, names }: { classes: { id: string; name: string; students: string[] }[]; insights: Insight[]; names: Map<string, string> }) {
  const rows = classes
    .map((c) => ({ ...c, summary: summariseClass(insights.filter((i) => c.students.includes(i.student_id))).slice(0, 8) }))
    .filter((c) => c.summary.length > 0);
  return (
    <Card>
      <CardHeader title="Exam feedback by class" description="What keeps coming up in Exam Mode answers. Open a line to see who it applies to." />
      <CardBody className="space-y-6">
        {rows.length === 0 && <p className="text-sm text-muted">Notes made while checking Exam Mode answers will be summed up here.</p>}
        {rows.map((c) => (
          <div key={c.id}>
            <p className="mb-2 text-sm font-semibold">{c.name}</p>
            <ul className="space-y-1">
              {c.summary.map((r) => (
                <li key={`${r.kind}-${r.tag}-${r.topic ?? ""}`}>
                  <details className="group rounded-md px-2 py-1 hover:bg-surface-2">
                    <summary className="flex cursor-pointer list-none items-start gap-2 text-sm">
                      <span className={cn("w-12 shrink-0 text-right font-semibold tabular-nums", TONE[r.kind])}>{r.count}/{c.students.length}</span>
                      <span className="min-w-0">
                        <span className={cn("mr-1.5 text-xs font-semibold uppercase", TONE[r.kind])}>{KIND_LABEL[r.kind]}</span>
                        {r.label}
                        {r.topic && <span className="text-muted"> · {r.topic}</span>}
                      </span>
                    </summary>
                    <p className="ml-14 mt-1 text-xs text-muted">
                      {[...r.students].map((id, k) => (
                        <span key={id}>
                          {k > 0 && ", "}
                          <Link href={`/teacher/students/${id}`} className="hover:underline">{names.get(id) ?? "Student"}</Link>
                        </span>
                      ))}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
