"use client";
import { useSearchParams } from "next/navigation";
import type { TopicLesson } from "@/lib/lessons";

/** "Lesson 2 of 3 · Rules for drawing a DFD" under the topic title while a lesson is open. */
export function LessonHeading({ lessons }: { lessons: TopicLesson[] }) {
  const n = Number(useSearchParams().get("lesson"));
  const lesson = lessons.find((l) => l.number === n);
  if (!lesson || lessons.length < 2) return null;
  return (
    <p className="-mt-3 mb-4 text-sm">
      <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-fg">
        Lesson {lesson.number} of {lessons.length}
      </span>
      <span className="ml-2 font-medium">{lesson.title}</span>
    </p>
  );
}
