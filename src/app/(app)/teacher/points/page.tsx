import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSchoolTree, mainPlans } from "@/lib/curriculum";
import { getTeacherClasses } from "@/lib/teacher-data";
import { getUnitBoard, LESSON_POINTS } from "@/lib/lessons";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "SAU points" };

const fmt = (x: number | null) => (x == null ? "—" : Number.isInteger(x) ? String(x) : x.toFixed(1));

export default async function TeacherPointsPage({ searchParams }: PageProps<"/teacher/points">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const supabase = await createClient();
  const [classes, tree] = await Promise.all([getTeacherClasses(supabase, profile, true), getSchoolTree()]);
  const header = (
    <PageHeader
      title="SAU points"
      description={`Each lesson (2 hours of the KTP) gives up to ${LESSON_POINTS.practice + LESSON_POINTS.notes + LESSON_POINTS.exam} points: practice ${LESSON_POINTS.practice}, notes check ${LESSON_POINTS.notes}, lesson test ${LESSON_POINTS.exam}. The unit's points are added up and the SAU is worth as many points again.`}
    />
  );
  if (classes.length === 0) {
    return <>{header}<EmptyState title="No classes yet">Points are counted class by class.</EmptyState></>;
  }
  const cls = classes.find((c) => c.id === sp.class) ?? classes[0];

  // Units of the class's grade (its own plan) that have lessons.
  const plan = mainPlans(tree).find((g) => g.grade === cls.grade);
  const units = (plan?.terms ?? []).flatMap((t) => t.units.map((u) => ({ ...u, term: t.title })));
  const { data: withLessons } = await supabase
    .from("topic_lessons")
    .select("topic_id")
    .in("topic_id", units.flatMap((u) => u.topics.map((t) => t.id)).concat("00000000-0000-0000-0000-000000000000"));
  const lessonTopics = new Set((withLessons ?? []).map((r) => r.topic_id as string));
  const usable = units.filter((u) => u.topics.some((t) => lessonTopics.has(t.id)));
  const unit = usable.find((u) => u.id === sp.unit) ?? usable[0];

  const { data: members } = await supabase
    .from("class_members")
    .select("student_id, profiles!class_members_student_id_fkey(first_name, last_name, username)")
    .eq("class_id", cls.id)
    .eq("status", "active");
  type M = { student_id: string; profiles: { first_name: string; last_name: string; username: string } | null };
  const names = new Map(((members ?? []) as unknown as M[]).map((m) => [m.student_id, m.profiles ? displayName(m.profiles) : m.student_id]));
  const board = unit ? await getUnitBoard(supabase, { classId: cls.id, unit, names }) : null;

  const pill = (active: boolean) =>
    cn("rounded-full border px-3 py-1 text-sm font-medium", active ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2");

  return (
    <>
      {header}
      <nav className="mb-3 flex flex-wrap gap-2" aria-label="Class">
        {classes.map((c) => (
          <Link key={c.id} href={`/teacher/points?class=${c.id}`} aria-current={c.id === cls.id ? "page" : undefined} className={pill(c.id === cls.id)}>
            {c.name}
          </Link>
        ))}
      </nav>
      {usable.length === 0 ? (
        <EmptyState title="No lessons yet">The topics of Grade {cls.grade} have not been split into lessons yet.</EmptyState>
      ) : (
        <>
          <nav className="mb-6 flex flex-wrap gap-2" aria-label="Unit">
            {usable.map((u) => (
              <Link key={u.id} href={`/teacher/points?class=${cls.id}&unit=${u.id}`} aria-current={u.id === unit?.id ? "page" : undefined} className={pill(u.id === unit?.id)}>
                {u.code} {u.title}
              </Link>
            ))}
          </nav>
          {unit && board && (
            <div className="space-y-6">
              <Card>
                <CardHeader
                  title={`${unit.code} ${unit.title} · ${cls.name}`}
                  description={`${board.lessons.length} lessons · up to ${board.max} points from lessons + ${board.max} from the SAU = ${board.max * 2}. ${board.sauExamIds.length ? "" : "No SAU for this unit yet."}`}
                />
                <CardBody className="p-0">
                  <Table>
                    <thead>
                      <tr>
                        <Th className="sticky left-0 z-10">Student</Th>
                        {board.lessons.map((l, i) => (
                          <Th key={l.key} className="text-center normal-case" title={`${l.topicTitle} · Lesson ${l.number}: ${l.title}`}>
                            L{i + 1}
                          </Th>
                        ))}
                        <Th className="text-right">Lessons / {board.max}</Th>
                        <Th className="text-right">SAU / {board.max}</Th>
                        <Th className="text-right">Total / {board.max * 2}</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {board.students.map((s) => (
                        <tr key={s.id}>
                          <Td className="sticky left-0 z-10 whitespace-nowrap bg-surface font-medium">{s.name}</Td>
                          {board.lessons.map((l) => {
                            const x = s.lessons.get(l.key);
                            return (
                              <Td
                                key={l.key}
                                className={cn("text-center text-xs tabular-nums", x && x.total === 0 && "text-muted")}
                                title={x ? `Practice ${fmt(x.practice)} · Notes ${fmt(x.notes)} · Test ${x.examPending ? "being marked" : fmt(x.exam)} (of ${x.max})` : undefined}
                              >
                                {x ? fmt(x.total) : "—"}
                                {x?.examPending && <span className="text-info">*</span>}
                              </Td>
                            );
                          })}
                          <Td className="text-right font-semibold tabular-nums">{fmt(s.accumulated)}</Td>
                          <Td className="text-right tabular-nums">{s.sau == null ? <span className="text-muted">—</span> : fmt(s.sau)}</Td>
                          <Td className="text-right font-semibold tabular-nums">{fmt(s.total)}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <p className="px-4 py-3 text-xs text-muted">
                    Hover a cell for practice · notes · test. * = the lesson test is still being marked. The SAU column is the latest marked SAU attempt, scaled to {board.max} points.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Lessons and deadlines" description="Assign each lesson to the class with a deadline: only work done before it counts. A lesson without an assignment has no deadline." />
                <CardBody className="p-0">
                  <Table>
                    <thead>
                      <tr><Th>#</Th><Th>Lesson</Th><Th>Deadline</Th><Th /></tr>
                    </thead>
                    <tbody>
                      {board.lessons.map((l, i) => (
                        <tr key={l.key}>
                          <Td className="tabular-nums text-muted">L{i + 1}</Td>
                          <Td>
                            <Link href={`/learn/${l.slug}`} className="font-medium hover:underline">{l.topicTitle}</Link>
                            <span className="text-muted"> · Lesson {l.number}: {l.title}</span>
                          </Td>
                          <Td className="whitespace-nowrap text-sm">{l.deadline ? formatDate(l.deadline) : <Badge tone="neutral">not assigned</Badge>}</Td>
                          <Td className="text-right">
                            <Link
                              href={`/teacher/assignments/new?type=topic&topic=${l.topicId}&lesson=${l.number}&class=${cls.id}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                              <CalendarPlus className="h-4 w-4" /> {l.deadline ? "Assign again" : "Assign"}
                            </Link>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          )}
        </>
      )}
    </>
  );
}
