import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { ExamRequirement } from "@/lib/exams";
import { cn } from "@/lib/cn";

/** What a student still has to do before a topic's Exam Mode opens. */
export function ExamRequirements({ slug, rows }: { slug: string; rows: ExamRequirement[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {rows.map((r) => {
        const practiceOk = r.practice_done >= r.practice_total;
        return (
          <li key={r.lesson_no} className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="min-w-0 flex-1 font-medium">
              Lesson {r.lesson_no}: <span className="font-normal text-muted">{r.title}</span>
            </span>
            <Link href={`/learn/${slug}/practice?lesson=${r.lesson_no}`} className={cn("inline-flex items-center gap-1 hover:underline", practiceOk ? "text-success" : "text-fg")}>
              {practiceOk ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 text-muted" />}
              Practice {r.practice_done} / {r.practice_total}
            </Link>
            <Link href={`/learn/${slug}/notes?lesson=${r.lesson_no}`} className={cn("inline-flex items-center gap-1 hover:underline", r.notes_ok ? "text-success" : "text-fg")}>
              {r.notes_ok ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 text-muted" />}
              Notes {r.notes_ok ? "handed in" : "not handed in"}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
