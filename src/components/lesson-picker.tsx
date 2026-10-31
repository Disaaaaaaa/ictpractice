import Link from "next/link";
import { cn } from "@/lib/cn";
import type { TopicLesson } from "@/lib/lessons";

/** Pills to switch between the lessons of a topic on its Theory, Practice and Notes pages. */
export function LessonPicker({
  base,
  lessons,
  current,
  allowAll = true,
}: {
  base: string;
  lessons: TopicLesson[];
  current: number | null;
  allowAll?: boolean;
}) {
  if (lessons.length === 0) return null;
  const pill = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-sm font-medium",
      active ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-surface-2",
    );
  return (
    <nav aria-label="Lessons" className="mb-5 flex flex-wrap gap-2">
      {lessons.map((l) => (
        <Link key={l.number} href={`${base}?lesson=${l.number}`} aria-current={current === l.number ? "page" : undefined} className={pill(current === l.number)} title={l.title}>
          Lesson {l.number}
          <span className="ml-1.5 hidden font-normal opacity-80 sm:inline">· {l.title}</span>
        </Link>
      ))}
      {allowAll && (
        <Link href={base} aria-current={current === null ? "page" : undefined} className={pill(current === null)}>
          All lessons
        </Link>
      )}
    </nav>
  );
}
