import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ExamRunner, type RunnerInit } from "@/components/exam/exam-runner";
import type { Paper } from "@/lib/questions/types";

export const metadata: Metadata = { title: "Exam in progress" };

export default async function AttemptPage({ params }: PageProps<"/attempt/[attemptId]">) {
  const { attemptId } = await params;
  await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_attempt_paper", { p_attempt_id: attemptId });
  if (error || !data) notFound();

  const payload = data as {
    server_now: string;
    attempt: RunnerInit["attempt"];
    exam: { title: string };
    paper: Paper;
    answers: RunnerInit["answers"];
  };
  if (payload.attempt.status !== "IN_PROGRESS") redirect(`/results/${attemptId}`);

  return (
    <ExamRunner
      init={{
        serverNow: payload.server_now,
        attempt: payload.attempt,
        examTitle: payload.exam.title,
        questions: payload.paper.questions,
        answers: payload.answers,
      }}
    />
  );
}
