import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStudentAssignments, type StudentAssignment } from "@/lib/student-data";
import { formatDate, nowMs } from "@/lib/format";
import {
  OVERALL_STATE, PART_LABEL, PART_STATE, overallPercent, overallState, topicParts,
  type OverallState, type Part, type TopicProgressRow,
} from "@/lib/topic-assignments";
import type { Tone } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Assignments" };

const TYPE_LABEL: Record<string, string> = { topic: "Topic", practice: "Practice", topic_exam: "Topic Exam", mock_exam: "Mock Exam", revision: "Revision" };

type Item = {
  a: StudentAssignment;
  href: string;
  status: { label: string; tone: Tone };
  done: boolean;
  parts: Part[] | null;
  percent: number | null;
};

export default async function StudentAssignmentsPage() {
  const profile = await requireProfile();
  if (profile.role !== "student") redirect("/teacher/assignments");
  const supabase = await createClient();
  const assignments = await getStudentAssignments(supabase);
  const now = nowMs();

  const topicOnes = assignments.filter((a) => a.assignment_type === "topic");
  const [progress, { data: attempts }] = await Promise.all([
    Promise.all(topicOnes.map((a) => supabase.rpc("topic_assignment_progress", { p_assignment_id: a.id }).then((r) => [a.id, (r.data ?? [])[0] as TopicProgressRow | undefined] as const))),
    supabase.from("attempts").select("assignment_id, status").eq("student_id", profile.id).not("assignment_id", "is", null),
  ]);
  const progressBy = new Map(progress);

  const items: Item[] = assignments.map((a) => {
    if (a.assignment_type === "topic") {
      const parts = topicParts(a, progressBy.get(a.id), now);
      const overall: OverallState = overallState(parts);
      return {
        a, parts, href: `/assignments/${a.id}`, status: OVERALL_STATE[overall],
        done: overall === "completed" || overall === "completed_late", percent: overallPercent(parts),
      };
    }
    const mine = (attempts ?? []).filter((x) => x.assignment_id === a.id);
    const submitted = mine.some((x) => x.status !== "IN_PROGRESS");
    const overdue = !submitted && a.deadline != null && new Date(a.deadline).getTime() < now;
    return {
      a, parts: null, percent: null,
      href: a.exam_id ? `/exams/${a.exam_id}?assignment=${a.id}` : a.topics ? `/learn/${a.topics.slug}/practice` : "#",
      done: submitted,
      status: submitted ? { label: "Submitted", tone: "success" } : overdue ? { label: "Overdue", tone: "danger" } : mine.length ? { label: "In progress", tone: "info" } : { label: "Assigned", tone: "primary" },
    };
  });
  const todo = items.filter((i) => !i.done);
  const finished = items.filter((i) => i.done);

  const render = (list: Item[]) => (
    <div className="space-y-3">
      {list.map(({ a, href, status, parts, percent }) => (
        <Link key={a.id} href={href} className="block">
          <Card className="transition-colors hover:border-primary/40 hover:bg-surface-2">
            <CardBody className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{a.title}</h3>
                    <Badge>{TYPE_LABEL[a.assignment_type] ?? a.assignment_type}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <CalendarClock className="h-4 w-4" aria-hidden /> {a.deadline ? `Due ${formatDate(a.deadline)}` : "No deadline"}
                    {a.topics && a.assignment_type !== "topic" ? ` · ${a.topics.title}` : ""}
                  </p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
              {parts && percent != null && (
                <>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={percent} tone={percent >= 100 ? "success" : "primary"} label={`${a.title}: progress`} />
                    <span className="w-9 text-right text-xs tabular-nums">{Math.round(percent)}%</span>
                  </div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                    {parts.filter((p) => p.state !== "none").map((p) => (
                      <li key={p.key} className="flex items-center gap-1.5">
                        <span className="text-muted">{PART_LABEL[p.key]}:</span>
                        <Badge tone={PART_STATE[p.state].tone}>{PART_STATE[p.state].label}</Badge>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Assignments" description="Work set by your teacher. A topic assignment has three steps — theory, practice and the topic exam — each with a deadline." />
      {items.length === 0 ? (
        <EmptyState title="No assignments yet">When your teacher assigns a topic or an exam, it will appear here.</EmptyState>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">To do · {todo.length}</h2>
            {todo.length ? render(todo) : <p className="text-sm text-muted">Nothing left to do — well done.</p>}
          </section>
          {finished.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Completed · {finished.length}</h2>
              {render(finished)}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
