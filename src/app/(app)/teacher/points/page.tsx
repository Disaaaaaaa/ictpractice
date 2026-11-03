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
const round1 = (x: number | null) => (x == null ? null : Math.round(x * 10) / 10);

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
  // one lesson in detail: practice, notes and test for every student
  const selected = board?.lessons.find((l) => l.key === sp.lesson) ?? null;
  const { data: waiting } = selected
    ? await supabase
        .from("note_submissions")
        .select("student_id")
        .eq("topic_id", selected.topicId)
        .eq("lesson_no", selected.number)
        .eq("status", "PENDING")
    : { data: [] };
  const waitingNotes = new Set((waiting ?? []).map((w) => w.student_id as string));
  const unitHref = unit ? `/teacher/points?class=${cls.id}&unit=${unit.id}` : "";

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
              <nav className="flex flex-wrap items-center gap-1.5" aria-label="Lesson">
                <span className="mr-1 text-sm font-medium text-muted">Lesson:</span>
                <Link href={unitHref} aria-current={!selected ? "page" : undefined} className={cn(pill(!selected), "px-2.5 py-0.5 text-xs")}>All</Link>
                {board.lessons.map((l, i) => (
                  <Link
                    key={l.key}
                    href={`${unitHref}&lesson=${encodeURIComponent(l.key)}#lesson`}
                    aria-current={selected?.key === l.key ? "page" : undefined}
                    title={`${l.topicTitle} · Lesson ${l.number}: ${l.title}`}
                    className={cn(pill(selected?.key === l.key), "px-2.5 py-0.5 text-xs")}
                  >
                    L{i + 1}
                  </Link>
                ))}
              </nav>

              {selected && (() => {
                const rows = board.students.map((st) => ({ st, x: st.lessons.get(selected.key) }));
                const avg = (f: (x: NonNullable<(typeof rows)[number]["x"]>) => number) => {
                  const xs = rows.map((r) => r.x).filter((x): x is NonNullable<typeof x> => Boolean(x));
                  return xs.length ? xs.reduce((a, x) => a + f(x), 0) / xs.length : null;
                };
                const any = rows.find((r) => r.x)?.x;
                return (
                  <Card id="lesson" className="scroll-mt-24">
                    <CardHeader
                      title={`${selected.topicTitle} · Lesson ${selected.number}: ${selected.title}`}
                      description={`${selected.deadline ? `Due ${formatDate(selected.deadline)} — only work done before it counts.` : "Not assigned yet — no deadline."} Practice: best attempt at each question (${any?.raw.practiceMax ?? 0} marks in all). Notes: best checked result. Test: first attempt.`}
                      action={<Link href={`/learn/${selected.slug}?lesson=${selected.number}`} className="text-sm font-medium text-primary hover:underline">Open the lesson</Link>}
                    />
                    <CardBody className="p-0">
                      <Table>
                        <thead>
                          <tr>
                            <Th>Student</Th>
                            <Th className="text-right">Practice / {LESSON_POINTS.practice}</Th>
                            <Th className="text-right">Notes / {LESSON_POINTS.notes}</Th>
                            <Th className="text-right">Exam Mode / {LESSON_POINTS.exam}</Th>
                            <Th className="text-right">Lesson / {any?.max ?? 6}</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(({ st, x }) => (
                            <tr key={st.id}>
                              <Td className="whitespace-nowrap font-medium">{st.name}</Td>
                              <Td className="text-right tabular-nums">
                                <span className="font-semibold">{fmt(x?.practice ?? 0)}</span>
                                <span className="ml-2 text-xs text-muted">{x && x.raw.practiceMax ? `${fmt(x.raw.practiceAwarded)} / ${fmt(x.raw.practiceMax)} marks` : "no practice"}</span>
                              </Td>
                              <Td className="text-right tabular-nums">
                                <span className="font-semibold">{fmt(x?.notes ?? 0)}</span>
                                <span className="ml-2 text-xs text-muted">
                                  {x?.raw.notesPct != null ? `best ${Math.round(x.raw.notesPct)}%` : waitingNotes.has(st.id) ? <Badge tone="info">waiting for check</Badge> : "not handed in"}
                                </span>
                              </Td>
                              <Td className="text-right tabular-nums">
                                <span className="font-semibold">{fmt(x?.exam ?? 0)}</span>
                                <span className="ml-2 text-xs text-muted">
                                  {!x?.raw.hasExam ? "no test" : x.examPending ? "being marked" : x.raw.examPct != null ? `${Math.round(x.raw.examPct)}%` : "not sat"}
                                </span>
                              </Td>
                              <Td className="text-right font-semibold tabular-nums">{fmt(x?.total ?? 0)}</Td>
                            </tr>
                          ))}
                          <tr className="bg-surface-2">
                            <Td className="font-semibold">Class average</Td>
                            <Td className="text-right font-semibold tabular-nums">{fmt(round1(avg((x) => x.practice)))}</Td>
                            <Td className="text-right font-semibold tabular-nums">{fmt(round1(avg((x) => x.notes)))}</Td>
                            <Td className="text-right font-semibold tabular-nums">{fmt(round1(avg((x) => x.exam)))}</Td>
                            <Td className="text-right font-semibold tabular-nums">{fmt(round1(avg((x) => x.total)))}</Td>
                          </tr>
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                );
              })()}

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
                          <Th key={l.key} className={cn("text-center normal-case", selected?.key === l.key && "bg-primary-soft text-primary")} title={`${l.topicTitle} · Lesson ${l.number}: ${l.title}`}>
                            <Link href={`${unitHref}&lesson=${encodeURIComponent(l.key)}#lesson`} className="hover:underline">L{i + 1}</Link>
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
