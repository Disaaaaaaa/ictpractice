import Link from "next/link";
import { formatDate } from "@/lib/format";
import { LESSON_POINTS, type LessonScore, type TopicLesson } from "@/lib/lessons";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fmt = (x: number) => (Number.isInteger(x) ? String(x) : x.toFixed(1));

/** The lessons of a topic with their links and, for a student, their SAU points. */
export function TopicLessons({
  slug,
  lessons,
  examIds,
  points,
  isStudent,
}: {
  slug: string;
  lessons: TopicLesson[];
  /** lesson number → its test */
  examIds: Map<number, string>;
  points: Map<number, LessonScore & { deadline: string | null }>;
  isStudent: boolean;
}) {
  if (!lessons.length) return null;
  const base = `/learn/${slug}`;
  const per = LESSON_POINTS.practice + LESSON_POINTS.notes + LESSON_POINTS.exam;
  return (
    <Card>
      <CardHeader
        title={`Lessons (${lessons.length})`}
        description={`Each lesson: theory, practice (${LESSON_POINTS.practice} points), notes check (${LESSON_POINTS.notes}) and a short test (${LESSON_POINTS.exam}) — up to ${per} points towards the unit's SAU. Work done before the lesson's deadline counts.`}
      />
      <CardBody className="space-y-3">
        {lessons.map((l) => {
          const p = points.get(l.number);
          const exam = examIds.get(l.number);
          const link = "rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-surface-2";
          return (
            <div key={l.number} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">
                    <span className="mr-2 text-muted">Lesson {l.number}</span>
                    {l.title}
                  </p>
                  {p?.deadline && <p className="text-xs text-muted">Due {formatDate(p.deadline)}</p>}
                </div>
                {isStudent && p && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs tabular-nums">
                    <span className="text-muted">P {fmt(p.practice)} · N {fmt(p.notes)} · T {p.examPending ? "…" : fmt(p.exam)}</span>
                    <Badge tone={p.total >= p.max * 0.8 ? "success" : p.total > 0 ? "info" : "neutral"}>
                      {fmt(p.total)} / {p.max}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={`${base}/theory?lesson=${l.number}`} className={link}>Theory</Link>
                <Link href={`${base}/practice?lesson=${l.number}`} className={link}>Practice</Link>
                <Link href={`${base}/notes?lesson=${l.number}`} className={link}>Notes check</Link>
                {exam ? (
                  <Link href={`/exams/${exam}`} className={link}>Lesson test</Link>
                ) : (
                  <span className="rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted">Test coming soon</span>
                )}
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
