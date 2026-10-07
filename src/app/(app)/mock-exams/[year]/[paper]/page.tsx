import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMocks, mockAvailability } from "@/lib/mocks";
import { formatDate, formatPercent } from "@/lib/format";
import { attemptLink } from "@/lib/student-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AttemptStatusBadge } from "@/components/attempt-status";
import type { AttemptStatus } from "@/lib/db-types";

export const metadata: Metadata = { title: "Mock Exams" };

export default async function MockPaperPage({ params }: PageProps<"/mock-exams/[year]/[paper]">) {
  const profile = await requireProfile();
  const { year: y, paper: p } = await params;
  const year = Number(y);
  const paper = Number(p);
  const mocks = await getMocks({ year, paper });
  const supabase = await createClient();
  const { data: attempts } = await supabase
    .from("attempts")
    .select("id, exam_id, status, percentage, show_results, submitted_at, started_at")
    .eq("student_id", profile.id)
    .in("exam_id", mocks.map((m) => m.id).concat("00000000-0000-0000-0000-000000000000"))
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Mock Exams", href: "/mock-exams" }, { label: String(year), href: `/mock-exams/${year}` }, { label: `Paper ${paper}` }]}
        title={`${year} · Paper ${paper}`}
      />
      {mocks.length === 0 ? (
        <EmptyState title="No mock exams for this paper yet" />
      ) : (
        <div className="space-y-4">
          {mocks.map((m) => {
            const av = mockAvailability(m);
            const mine = (attempts ?? []).filter((a) => a.exam_id === m.id);
            return (
              <Card key={m.id}>
                <CardBody className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{m.title}</h2>
                        <Badge tone={av.tone}>{av.label}</Badge>
                      </div>
                      {m.description && <p className="mt-1 text-sm text-muted">{m.description}</p>}
                    </div>
                    {av.open || mine.length ? (
                      <ButtonLink href={`/exams/${m.id}`}>{mine.some((a) => a.status === "IN_PROGRESS") ? "Resume" : "Open"}</ButtonLink>
                    ) : null}
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div><dt className="text-muted">Duration</dt><dd className="font-medium">{m.duration_minutes} min</dd></div>
                    <div><dt className="text-muted">Total marks</dt><dd className="font-medium">{m.version?.total_marks ?? "—"}</dd></div>
                    <div><dt className="text-muted">Attempts</dt><dd className="font-medium">{m.attempt_limit ? `${mine.length} / ${m.attempt_limit}` : `${mine.length} (unlimited)`}</dd></div>
                    <div><dt className="text-muted">Available</dt><dd className="font-medium">{m.availability_end ? `until ${formatDate(m.availability_end)}` : m.availability_start ? `from ${formatDate(m.availability_start)}` : "Any time"}</dd></div>
                  </dl>
                  {mine.length > 0 && (
                    <ul className="divide-y divide-border rounded-lg border border-border">
                      {mine.map((a) => (
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
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
