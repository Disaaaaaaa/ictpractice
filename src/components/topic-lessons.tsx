import Link from "next/link";
import { formatDate } from "@/lib/format";
import { EXAM_FULL_AT, LESSON_POINTS, type LessonScore, type TopicLesson } from "@/lib/lessons";
import type { ExamRequirement } from "@/lib/exams";
import { ExamRequirements } from "@/components/exam/exam-requirements";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fmt = (x: number) => (Number.isInteger(x) ? String(x) : x.toFixed(1));

/** The lessons of a topic with their links and, for a student, their SAU points. */
export function TopicLessons({
  slug,
  lessons,
  total,
  examIds,
  points,
  isStudent,
  examLock = null,
}: {
  slug: string;
  lessons: TopicLesson[];
  /** lessons of the topic (when only one of them is shown) */
  total?: number;
  /** lesson number → its test */
  examIds: Map<number, string>;
  points: Map<number, LessonScore & { deadline: string | null }>;
  isStudent: boolean;
  /** a student's progress towards opening the topic's single Exam Mode */
  examLock?: { rows: ExamRequirement[]; locked: boolean } | null;
}) {
  if (!lessons.length) return null;
  const base = `/learn/${slug}`;
  // topics taught from now on: no lesson tests, one Exam Mode for the whole topic
  const oneExam = examIds.size === 0;
  const per = LESSON_POINTS.practice + LESSON_POINTS.notes + (oneExam ? 0 : LESSON_POINTS.exam);
  const topicExam = points.get(0);
  return (
    <Card>
      <CardHeader
        title={lessons.length === 1 && (total ?? 1) > 1 ? `Lesson ${lessons[0].number} of ${total}` : `Lessons (${lessons.length})`}
        description={
          oneExam
            ? `Each lesson: theory, practice (${LESSON_POINTS.practice} points) and notes check (${LESSON_POINTS.notes}) — up to ${per} points towards the unit's SAU. The topic's Exam Mode gives ${LESSON_POINTS.exam} more (full from ${EXAM_FULL_AT}%). Work done before the deadline counts.`
            : `Each lesson: theory, practice (${LESSON_POINTS.practice} points), notes check (${LESSON_POINTS.notes}) and a short test (${LESSON_POINTS.exam}, full from ${EXAM_FULL_AT}%) — up to ${per} points towards the unit's SAU. Work done before the lesson's deadline counts.`
        }
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
                    <span className="text-muted">P {fmt(p.practice)} · N {fmt(p.notes)}{oneExam ? "" : ` · T ${p.examPending ? "…" : fmt(p.exam)}`}</span>
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
                ) : oneExam ? null : (
                  <span className="rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted">Test coming soon</span>
                )}
              </div>
            </div>
          );
        })}
        {oneExam && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
            <div className="min-w-0">
              <p className="font-medium">Exam Mode — the whole topic</p>
              <p className="text-xs text-muted">
                One timed exam after the lessons: your first attempt gives up to {LESSON_POINTS.exam} points.
                {topicExam?.deadline ? ` Due ${formatDate(topicExam.deadline)}.` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs tabular-nums">
              {isStudent && topicExam && (
                <Badge tone={topicExam.total >= topicExam.max * 0.8 && topicExam.max > 0 ? "success" : topicExam.total > 0 ? "info" : "neutral"}>
                  {topicExam.examPending ? "being marked" : `${fmt(topicExam.total)} / ${topicExam.max}`}
                </Badge>
              )}
              {examLock?.locked ? (
                <span className="rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted">Locked</span>
              ) : (
                <Link href={`${base}/exam`} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-surface-2">Exam Mode</Link>
              )}
            </div>
            {examLock?.locked && (
              <div className="w-full border-t border-border pt-2">
                <p className="mb-1.5 text-xs text-muted">Opens after you answer every practice question and hand in your notes for every lesson:</p>
                <ExamRequirements slug={slug} rows={examLock.rows} />
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
