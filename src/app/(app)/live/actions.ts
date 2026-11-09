"use server";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { markLiveAnswer } from "@/lib/live";
import { blocksOf, groupOf, type LivePlan, type LiveState } from "@/lib/live-plan";
import type { AnswerData } from "@/lib/questions/types";

export type LiveSubmit =
  | { ok: true; awarded: number | null; max: number; fullMarks: boolean; needsReview: boolean; feedback: string | null }
  | { ok: false; error: string };

async function sessionFor(studentId: string, sessionId: string) {
  const admin = createAdminClient();
  const { data: s } = await admin.from("live_sessions").select("id, class_id, plan, state, ended_at").eq("id", sessionId).maybeSingle();
  if (!s || s.ended_at) return null;
  const { data: m } = await admin.from("class_members").select("student_id").eq("class_id", s.class_id).eq("student_id", studentId).eq("status", "active").maybeSingle();
  if (!m) return null;
  return { admin, s: s as { id: string; class_id: string; plan: LivePlan; state: LiveState } };
}

/** Marks the student as present (called when the page opens and every 30 s). */
export async function heartbeat(sessionId: string): Promise<{ ok: boolean }> {
  const profile = await requireProfile(["student"]);
  const found = await sessionFor(profile.id, sessionId);
  if (!found) return { ok: false };
  await found.admin
    .from("live_participants")
    .upsert({ session_id: sessionId, student_id: profile.id, last_seen: new Date().toISOString() }, { onConflict: "session_id,student_id" });
  return { ok: true };
}

/** A poll vote (one per student; a new vote replaces the old one). */
export async function vote(sessionId: string, blockId: string, option: number): Promise<{ ok: boolean }> {
  const profile = await requireProfile(["student"]);
  const found = await sessionFor(profile.id, sessionId);
  if (!found) return { ok: false };
  const block = blocksOf(found.s.plan).find((b) => b.id === blockId);
  if (!block?.poll || !found.s.state.open?.includes(blockId) || option < 0 || option >= block.poll.options.length) return { ok: false };
  await found.admin.from("live_answers").upsert(
    { session_id: sessionId, block_id: blockId, item: "poll", student_id: profile.id, members: [profile.id], answer: { selected: String(option) }, updated_at: new Date().toISOString() },
    { onConflict: "session_id,block_id,item,student_id" },
  );
  return { ok: true };
}

/**
 * Answers a task of an open block. In a pair or group block only the host
 * answers, on the group's laptop; the answer counts for every member, and a
 * practice question is also saved as practice for each of them (SAU points).
 */
export async function submitLive(sessionId: string, blockId: string, questionId: string, answer: AnswerData | null): Promise<LiveSubmit> {
  const profile = await requireProfile(["student"]);
  const found = await sessionFor(profile.id, sessionId);
  if (!found) return { ok: false, error: "The lesson has ended." };
  const { admin, s } = found;
  const block = blocksOf(s.plan).find((b) => b.id === blockId);
  if (!block || !s.state.open?.includes(blockId)) return { ok: false, error: "Your teacher has not opened this task yet." };
  if (![...block.tasks, ...block.together].some((q) => q.id === questionId)) return { ok: false, error: "This question is not part of the task." };
  if (!answer || JSON.stringify(answer).length > 60_000) return { ok: false, error: "Write an answer first." };

  let members = [profile.id];
  if (block.groupSize > 1) {
    const g = groupOf(s.state, blockId, profile.id);
    if (!g) return { ok: false, error: "You are not in a group for this task yet — ask your teacher." };
    if (g.host !== profile.id) return { ok: false, error: "Your group answers on the host's laptop." };
    members = g.members;
  }

  const marked = await markLiveAnswer(questionId, answer);
  if (!marked) return { ok: false, error: "This question cannot be marked." };
  const { question, outcome } = marked;
  if (outcome.status === "FAILED") return { ok: false, error: "The answer could not be marked. Try again." };
  const now = new Date().toISOString();
  await admin.from("live_answers").upsert(
    {
      session_id: sessionId,
      block_id: blockId,
      item: questionId,
      question_id: questionId,
      student_id: profile.id,
      members,
      answer,
      awarded: outcome.awarded,
      max_mark: outcome.max,
      needs_review: outcome.needsReview,
      updated_at: now,
    },
    { onConflict: "session_id,block_id,item,student_id" },
  );

  // Practice questions count as practice for every member (best attempt counts).
  if (question.practice_enabled && outcome.awarded !== null) {
    await admin.from("practice_attempts").insert(
      members.map((id) => ({
        student_id: id,
        question_id: questionId,
        answer_data: answer,
        awarded_mark: outcome.awarded,
        max_mark: outcome.max,
        grading_method: outcome.method,
        feedback: outcome.feedback,
        result: { ok: true, awarded: outcome.awarded, max: outcome.max, feedback: outcome.feedback, points: outcome.points, needsReview: false, fullMarks: outcome.awarded === outcome.max, live: sessionId },
      })),
    );
    for (const id of members) await admin.rpc("recompute_mastery", { p_student_id: id });
  }
  return {
    ok: true,
    awarded: outcome.awarded,
    max: outcome.max,
    fullMarks: outcome.awarded !== null && outcome.awarded === outcome.max,
    needsReview: outcome.needsReview,
    feedback: outcome.needsReview ? "Handed in — your teacher will check it." : outcome.feedback,
  };
}

/**
 * Records whether the student's lesson page is full screen. Leaving full
 * screen is counted and shown to the teacher (a browser always lets users leave).
 */
export async function reportFullscreen(sessionId: string, on: boolean): Promise<{ ok: boolean }> {
  const profile = await requireProfile(["student"]);
  const found = await sessionFor(profile.id, sessionId);
  if (!found) return { ok: false };
  const { data: p } = await found.admin.from("live_participants").select("fullscreen, fullscreen_exits").eq("session_id", sessionId).eq("student_id", profile.id).maybeSingle();
  const exits = (p?.fullscreen_exits ?? 0) + (p?.fullscreen && !on ? 1 : 0);
  await found.admin
    .from("live_participants")
    .upsert({ session_id: sessionId, student_id: profile.id, fullscreen: on, fullscreen_exits: exits, last_seen: new Date().toISOString() }, { onConflict: "session_id,student_id" });
  return { ok: true };
}
