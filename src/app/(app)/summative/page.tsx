import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStudentSummatives, type StudentSummative } from "@/lib/summative";
import { attemptLink } from "@/lib/student-data";
import { formatDate, formatPercent } from "@/lib/format";
import type { AttemptStatus } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { AttemptStatusBadge } from "@/components/attempt-status";

export const metadata: Metadata = { title: "Summative Assessments" };

function Assessment({ e }: { e: StudentSummative }) {
  const running = e.attempts.find((a) => a.status === "IN_PROGRESS");
  const used = e.attempts.length;
  const left = e.attempt_limit == null || used < e.attempt_limit;
  return (
    <div className="rounded-lg border border-border">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{e.title}</h3>
            {running ? <Badge tone="info">In progress</Badge> : e.open ? <Badge tone="success">Open</Badge> : <Badge tone="neutral">Closed</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {e.duration_minutes} min{e.version ? ` · ${e.version.total_marks} marks` : ""}
            {e.attempt_limit ? ` · attempts ${used} / ${e.attempt_limit}` : ""}
          </p>
        </div>
        {running ? (
          <ButtonLink href={`/exams/${e.id}${e.assignmentId ? `?assignment=${e.assignmentId}` : ""}`} size="sm">Resume</ButtonLink>
        ) : e.open && left ? (
          <ButtonLink href={`/exams/${e.id}${e.assignmentId ? `?assignment=${e.assignmentId}` : ""}`} size="sm">Open</ButtonLink>
        ) : null}
      </div>
      {e.attempts.length > 0 && (
        <ul className="divide-y divide-border border-t border-border">
          {e.attempts.map((a) => (
            <li key={a.id}>
              <Link href={attemptLink(a)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-2">
                <span className="flex-1">{formatDate(a.submitted_at ?? a.started_at)}</span>
                {a.status === "GRADED" && a.show_results ? (
                  <span className="font-semibold tabular-nums">{formatPercent(a.percentage)}</span>
                ) : (
                  <AttemptStatusBadge status={a.status as AttemptStatus} />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function SummativePage() {
  const profile = await requireProfile();
  if (profile.role !== "student") redirect("/teacher/summative");
  const supabase = await createClient();
  const { terms, other, open } = await getStudentSummatives(supabase, profile);

  return (
    <>
      <PageHeader
        title="Summative Assessments for the Unit"
        description="The summative assessment (SAU) for each unit appears here when your teacher opens it for your class. It is sat in Exam Mode with a timer and marked after you submit."
      />
      {open.length > 0 && (
        <Card className="mb-8 border-success/40">
          <CardHeader title="Open now" description="Your teacher has opened these assessments for your class." />
          <CardBody className="space-y-3">{open.map((e) => <Assessment key={e.id} e={e} />)}</CardBody>
        </Card>
      )}
      <div className="space-y-8">
        {terms.map((t) => (
          <section key={`${t.grade}-${t.term}`}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Grade {t.grade} · {t.title}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {t.units.map((u) => (
                <Card key={u.id}>
                  <CardHeader title={<><span className="text-muted">{u.code}</span> {u.title}</>} className={u.exams.length ? undefined : "border-b-0 pb-2"} />
                  <CardBody className={u.exams.length ? "space-y-3" : "pt-0"}>
                    {u.exams.length ? (
                      u.exams.map((e) => <Assessment key={e.id} e={e} />)
                    ) : (
                      <p className="flex items-center gap-2 text-sm text-muted"><Lock className="h-4 w-4 shrink-0" aria-hidden /> Closed — it will appear here when your teacher opens it.</p>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        ))}
        {other.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Other assessments</h2>
            <div className="space-y-3">{other.map((e) => <Assessment key={e.id} e={e} />)}</div>
          </section>
        )}
      </div>
    </>
  );
}
