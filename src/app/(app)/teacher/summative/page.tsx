import type { Metadata } from "next";
import Link from "next/link";
import { CopyPlus, Lock, LockOpen, Plus } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTeacherSummatives, summativeStartable, type TeacherSummative } from "@/lib/summative";
import { formatDate, formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge, type Tone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ConfirmButton } from "@/components/action-form";
import { addSummativeVariant, setSummativeAccess } from "./actions";

export const metadata: Metadata = { title: "Summative Assessments" };

const STATUS_TONE: Record<string, Tone> = { draft: "neutral", scheduled: "info", published: "success", closed: "warning", archived: "neutral" };

export default async function TeacherSummativePage({ searchParams }: PageProps<"/teacher/summative">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const grade = sp.grade === "12" ? 12 : 11;
  const error = typeof sp.error === "string" ? sp.error : null;
  const supabase = await createClient();
  const { terms, other, classCount } = await getTeacherSummatives(supabase, profile, grade);
  const isAdmin = profile.role === "admin";

  const renderExam = (e: TeacherSummative) => {
    // Access is opened for the whole group; it needs at least one published variant.
    const ready = e.variants.some(summativeStartable);
    const many = e.variants.length > 1;
    const openCount = e.classes.filter((c) => c.open).length;
    const ids = e.classes.map((c) => c.cls.id).join(",");
    return (
      <div key={e.id} className="rounded-lg border border-border">
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/teacher/exams/${e.id}`} className="font-semibold hover:underline">{e.title}</Link>
              <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
              {ready && <Badge tone={openCount ? "success" : "neutral"}>{openCount ? `Open for ${openCount} class${openCount === 1 ? "" : "es"}` : "Closed for all classes"}</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-muted">
              {e.version ? `v${e.version.version} · ${e.version.total_marks} marks · ` : ""}
              {e.duration_minutes} min · {e.attempt_limit ? `${e.attempt_limit} attempt${e.attempt_limit === 1 ? "" : "s"}` : "unlimited attempts"} · {e.attemptCount} sat
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!many && (
              <>
                <ButtonLink href={`/teacher/exams/${e.id}/live`} variant="secondary" size="sm">{e.live > 0 ? `Live · ${e.live}` : "Live monitor"}</ButtonLink>
                <ButtonLink href={`/teacher/results?exam=${e.id}`} variant="secondary" size="sm">Results</ButtonLink>
                <ButtonLink href={`/teacher/exams/${e.id}`} variant="ghost" size="sm">Edit</ButtonLink>
              </>
            )}
            <ConfirmButton
              action={addSummativeVariant}
              fields={{ exam_id: e.id }}
              label={<><CopyPlus className="h-4 w-4" /> Add variant</>}
              confirm="Create another variant? It starts as a draft copy of this assessment: change the numbers and contexts in its questions, then publish it. Students of a class are then split between the variants at random and equally."
            />
          </div>
        </div>
        {many && (
          <div className="border-t border-border">
            <Table>
              <thead><tr><Th>Variant</Th><Th>Status</Th><Th>Marks · time</Th><Th>Given to</Th><Th>Sat</Th><Th>Average</Th><Th /></tr></thead>
              <tbody>
                {e.variants.map((v) => (
                  <tr key={v.id}>
                    <Td>
                      <span className="mr-2 font-semibold">Variant {v.no}</span>
                      <Link href={`/teacher/exams/${v.id}`} className="hover:underline">{v.title}</Link>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONE[v.status]}>{v.status}</Badge>
                      {!summativeStartable(v) && <span className="ml-2 text-xs text-muted">not in use</span>}
                    </Td>
                    <Td className="tabular-nums">{v.version ? `${v.version.total_marks} · ` : ""}{v.duration_minutes} min</Td>
                    <Td className="tabular-nums">{v.assigned}</Td>
                    <Td className="tabular-nums">{v.sat}</Td>
                    <Td className="tabular-nums">{formatPercent(v.average)}</Td>
                    <Td className="text-right">
                      <span className="inline-flex gap-2">
                        <ButtonLink href={`/teacher/exams/${v.id}/live`} variant="ghost" size="sm">Live</ButtonLink>
                        <ButtonLink href={`/teacher/results?exam=${v.id}`} variant="ghost" size="sm">Results</ButtonLink>
                        <ButtonLink href={`/teacher/exams/${v.id}`} variant="ghost" size="sm">Edit</ButtonLink>
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="px-4 py-2 text-xs text-muted">
              Each student gets one published variant at random, with equal numbers per variant in the class. Compare the averages to check that the variants are equally hard.
            </p>
          </div>
        )}
        {!ready ? (
          <p className="border-t border-border px-4 py-3 text-sm text-muted">
            {e.variants.some((v) => v.version) ? "This assessment is not available (closed, scheduled or outside its dates). " : "Not published yet. "}
            <Link href={`/teacher/exams/${e.id}`} className="font-medium text-primary hover:underline">
              {e.variants.some((v) => v.version) ? "Check its settings" : "Add questions and publish it"}
            </Link>{" "}
            before opening it to a class.
          </p>
        ) : e.classes.length === 0 ? (
          <p className="border-t border-border px-4 py-3 text-sm text-muted">You have no Grade {e.grade ?? grade} classes to open it for.</p>
        ) : (
          <div className="border-t border-border">
            <Table>
              <thead>
                <tr>
                  <Th>Class</Th><Th>Access</Th><Th>Sat</Th>{many && <Th>Variants</Th>}
                  <Th className="text-right">
                    {e.classes.length > 1 && (
                      <span className="inline-flex gap-2 normal-case">
                        <ConfirmButton action={setSummativeAccess} fields={{ exam_id: e.id, class_ids: ids, open: "1", grade: String(grade) }} label="Open for all" />
                        <ConfirmButton action={setSummativeAccess} fields={{ exam_id: e.id, class_ids: ids, open: "0", grade: String(grade) }} label="Close for all" />
                      </span>
                    )}
                  </Th>
                </tr>
              </thead>
              <tbody>
                {e.classes.map((c) => (
                  <tr key={c.cls.id}>
                    <Td>
                      <span className="font-medium">{c.cls.name}</span>
                      {isAdmin && c.cls.teacher && <span className="ml-2 text-xs text-muted">{displayName(c.cls.teacher)}</span>}
                    </Td>
                    <Td>
                      {c.open ? (
                        <><Badge tone="success"><LockOpen className="h-3 w-3" /> Open</Badge><span className="ml-2 text-xs text-muted">since {formatDate(c.opened_at)}</span></>
                      ) : (
                        <><Badge tone="neutral"><Lock className="h-3 w-3" /> Closed</Badge>{c.closed_at && <span className="ml-2 text-xs text-muted">closed {formatDate(c.closed_at)}</span>}</>
                      )}
                    </Td>
                    <Td className="tabular-nums">
                      {c.submitted} / {c.cls.member_count}
                      {c.inProgress > 0 && <Badge tone="info" className="ml-2">{c.inProgress} in progress</Badge>}
                    </Td>
                    {many && (
                      <Td className="whitespace-nowrap text-xs tabular-nums text-muted">
                        {c.split.some((n) => n > 0) ? c.split.map((n, i) => `V${i + 1}: ${n}`).join(" · ") : "dealt out on opening"}
                      </Td>
                    )}
                    <Td className="text-right">
                      <span className="inline-flex">
                        {c.open ? (
                          <ConfirmButton
                            action={setSummativeAccess}
                            fields={{ exam_id: e.id, class_ids: c.cls.id, open: "0", grade: String(grade) }}
                            label={<><Lock className="h-4 w-4" /> Close access</>}
                            confirm={c.inProgress > 0 ? `Close access for ${c.cls.name}? ${c.inProgress} student(s) still writing can finish; nobody else can start.` : undefined}
                          />
                        ) : (
                          <ConfirmButton
                            action={setSummativeAccess}
                            fields={{ exam_id: e.id, class_ids: c.cls.id, open: "1", grade: String(grade) }}
                            label={<><LockOpen className="h-4 w-4" /> Open access</>}
                            variant="primary"
                          />
                        )}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Summative Assessments for the Unit"
        description="One block for every unit's summative assessment (SAU). Create the assessment, publish it, then open it for a class when the lesson starts and close it afterwards. Students sit it in Exam Mode; answers are marked automatically and by AI, and you confirm the marks in Results."
        actions={<ButtonLink href="/teacher/exams/new?kind=summative">New assessment</ButtonLink>}
      />
      {error && <Alert tone="danger" className="mb-4">{error}</Alert>}
      <nav className="mb-6 flex gap-2" aria-label="Grade">
        {[11, 12].map((g) => (
          <Link key={g} href={`/teacher/summative?grade=${g}`} aria-current={grade === g ? "page" : undefined}
            className={cn("rounded-full border px-3 py-1 text-sm font-medium", grade === g ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2")}>
            Grade {g}
          </Link>
        ))}
      </nav>
      {classCount === 0 && (
        <Alert tone="info" className="mb-6">
          {isAdmin ? `There are no Grade ${grade} classes yet.` : `You do not teach a Grade ${grade} class yet, so there is no class to open an assessment for.`}
        </Alert>
      )}

      <div className="space-y-8">
        {terms.map((t) => (
          <section key={`${t.grade}-${t.term}`} aria-labelledby={`term-${t.term}`}>
            <h2 id={`term-${t.term}`} className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Grade {t.grade} · {t.title}</h2>
            <div className="space-y-4">
              {t.units.map((u) => (
                <Card key={u.id}>
                  <CardHeader
                    title={<><span className="text-muted">{u.code}</span> {u.title}</>}
                    description={u.exams.length ? undefined : "No summative assessment yet."}
                    action={
                      <ButtonLink href={`/teacher/exams/new?kind=summative&unit=${u.id}`} variant="secondary" size="sm">
                        <Plus className="h-4 w-4" /> Add
                      </ButtonLink>
                    }
                    className={u.exams.length ? undefined : "border-b-0"}
                  />
                  {u.exams.length > 0 && <CardBody className="space-y-3">{u.exams.map(renderExam)}</CardBody>}
                </Card>
              ))}
            </div>
          </section>
        ))}
        {other.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Not linked to a unit</h2>
            <Card><CardBody className="space-y-3">{other.map(renderExam)}</CardBody></Card>
          </section>
        )}
      </div>
    </>
  );
}
