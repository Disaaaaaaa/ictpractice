import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSchoolTree, plansFor } from "@/lib/curriculum";
import { getStudentClass, getUnitBoard, LESSON_POINTS } from "@/lib/lessons";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";

export const metadata: Metadata = { title: "SAU points" };

const fmt = (x: number | null) => (x == null ? "—" : Number.isInteger(x) ? String(x) : x.toFixed(1));

export default async function StudentPointsPage() {
  const profile = await requireProfile();
  if (profile.role !== "student") redirect("/teacher/points");
  const supabase = await createClient();
  const header = (
    <PageHeader
      title="SAU points"
      description={`Every lesson gives up to ${LESSON_POINTS.practice + LESSON_POINTS.notes + LESSON_POINTS.exam} points: practice ${LESSON_POINTS.practice} (your first answer to each question), notes check ${LESSON_POINTS.notes} (your best check) and the lesson test ${LESSON_POINTS.exam} (your first attempt). Only work done before the lesson's deadline counts. The SAU at the end of the unit is worth as many points as all its lessons.`}
    />
  );
  const classId = await getStudentClass(supabase, profile.id, profile.grade);
  if (!classId) return <>{header}<EmptyState title="You are not in a class yet">Points are counted in your class.</EmptyState></>;

  // the units of the student's own grade
  const plan = plansFor(await getSchoolTree(), profile).find((g) => g.grade === profile.grade);
  const units = (plan?.terms ?? []).flatMap((t) => t.units.map((u) => ({ ...u, term: t.title })));
  const boards = (
    await Promise.all(units.map(async (u) => ({ unit: u, board: await getUnitBoard(supabase, { classId, unit: u }) })))
  ).filter((x) => x.board.lessons.length > 0);

  if (boards.length === 0) return <>{header}<EmptyState title="No lessons yet">Your topics have not been split into lessons yet.</EmptyState></>;

  return (
    <>
      {header}
      <div className="space-y-6">
        {boards.map(({ unit, board }) => {
          const me = board.students.find((s) => s.id === profile.id);
          return (
            <Card key={unit.id}>
              <CardHeader
                title={<><span className="text-muted">{unit.code}</span> {unit.title}</>}
                description={`${unit.term} · ${board.lessons.length} lessons`}
                action={
                  <div className="text-right text-sm tabular-nums">
                    <p>Lessons <span className="font-semibold">{fmt(me?.accumulated ?? 0)}</span> / {board.max}</p>
                    <p>SAU <span className="font-semibold">{fmt(me?.sau ?? null)}</span> / {board.max}</p>
                    <p className="font-semibold">Total {fmt(me?.total ?? 0)} / {board.max * 2}</p>
                  </div>
                }
              />
              <CardBody className="space-y-2">
                <ProgressBar value={board.max ? ((me?.accumulated ?? 0) / board.max) * 100 : 0} label={`${unit.code} lesson points`} />
                <ul className="divide-y divide-border">
                  {board.lessons.map((l) => {
                    const x = me?.lessons.get(l.key);
                    return (
                      <li key={l.key} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                        <Link href={`/learn/${l.slug}`} className="min-w-0 flex-1 hover:underline">
                          <span className="font-medium">{l.topicTitle}</span>
                          <span className="text-muted"> · Lesson {l.number}: {l.title}</span>
                        </Link>
                        {l.deadline && <span className="text-xs text-muted">due {formatDate(l.deadline)}</span>}
                        {x && (
                          <span className="text-xs tabular-nums text-muted">
                            P {fmt(x.practice)} · N {fmt(x.notes)} · T {x.examPending ? "…" : fmt(x.exam)}
                          </span>
                        )}
                        <Badge tone={x && x.total >= x.max * 0.8 ? "success" : x && x.total > 0 ? "info" : "neutral"}>
                          {fmt(x?.total ?? 0)} / {x?.max ?? 0}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
