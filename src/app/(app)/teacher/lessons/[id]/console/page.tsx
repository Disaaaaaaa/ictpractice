import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";
import { getPlanQuestions, getSession, minutesAgo, type LiveAnswer } from "@/lib/live";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { LiveRefresh } from "@/components/live/live-refresh";
import { TeacherConsole, type ConsoleAnswer, type ConsoleQuestion } from "@/components/live/teacher-console";

export const metadata: Metadata = { title: "Class overview" };

export default async function LessonConsolePage({ params }: PageProps<"/teacher/lessons/[id]/console">) {
  await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const supabase = await createClient();
  const session = await getSession(supabase, id);
  if (!session) notFound();

  const since = minutesAgo(3);
  const [{ data: cls }, { data: topic }, { data: members }, { data: parts }, { data: answers }, questions] = await Promise.all([
    supabase.from("classes").select("name").eq("id", session.class_id).single(),
    supabase.from("topics").select("title").eq("id", session.topic_id).single(),
    supabase.from("class_members").select("student_id, profiles!class_members_student_id_fkey(first_name, last_name, username)").eq("class_id", session.class_id).eq("status", "active"),
    supabase.from("live_participants").select("student_id, last_seen").eq("session_id", id),
    supabase.from("live_answers").select("*").eq("session_id", id),
    getPlanQuestions(session.plan),
  ]);
  type M = { student_id: string; profiles: { first_name: string; last_name: string; username: string } | null };
  const names = Object.fromEntries(((members ?? []) as unknown as M[]).map((m) => [m.student_id, m.profiles ? displayName(m.profiles) : "Student"]));
  const present = (parts ?? []).filter((p) => session.ended_at || p.last_seen >= since).map((p) => p.student_id as string);

  // the correct options of choice questions, for the class results and "Show answer"
  const ids = [...questions.keys()];
  const { data: schemes } = ids.length
    ? await createAdminClient().from("mark_schemes").select("question_id, accepted_answers").in("question_id", ids).eq("is_current", true)
    : { data: [] };
  const correctOf = new Map(
    ((schemes ?? []) as { question_id: string; accepted_answers: { correct?: string | string[] | boolean } | null }[]).map((s) => {
      const c = s.accepted_answers?.correct;
      return [s.question_id, c === undefined ? [] : Array.isArray(c) ? c : [String(c)]];
    }),
  );
  const consoleQuestions: Record<string, ConsoleQuestion> = Object.fromEntries(
    [...questions.values()].map((q) => [q.id, { id: q.id, title: q.title, type: q.question_type, marks: q.marks, options: q.options, correct: correctOf.get(q.id) ?? [] }]),
  );
  const consoleAnswers: ConsoleAnswer[] = ((answers ?? []) as LiveAnswer[]).map((a) => ({
    block_id: a.block_id,
    item: a.item,
    student_id: a.student_id,
    members: a.members,
    selected: a.answer?.selected ?? (typeof a.answer?.value === "boolean" ? String(a.answer.value) : null),
    awarded: a.awarded == null ? null : Number(a.awarded),
    max: a.max_mark == null ? null : Number(a.max_mark),
    needs_review: a.needs_review,
  }));

  return (
    <>
      <PageHeader
        title={<span className="flex items-center gap-2">{topic?.title} · Lesson {session.lesson_no} {!session.ended_at && <LiveRefresh sessionId={id} />}</span>}
        description={`${cls?.name ?? ""} · ${session.plan.title} · started ${formatDate(session.started_at)}`}
        breadcrumbs={[{ label: "Lessons", href: "/teacher/lessons" }, { label: `${topic?.title ?? ""} · Lesson ${session.lesson_no}`, href: `/teacher/lessons/${id}` }, { label: "Class overview" }]}
      />
      {session.ended_at && <Alert tone="info" title="This lesson has ended" className="mb-4">The results below are final. Written answers are checked with the other Exam Mode answers.</Alert>}
      <TeacherConsole
        sessionId={id}
        plan={session.plan}
        state={session.state}
        startedAt={session.started_at}
        ended={Boolean(session.ended_at)}
        endedAt={session.ended_at}
        names={names}
        present={present}
        classSize={Object.keys(names).length}
        questions={consoleQuestions}
        answers={consoleAnswers}
      />
    </>
  );
}
