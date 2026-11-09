"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { blocksOf, makeGroups, type LivePlan, type LiveState } from "@/lib/live-plan";

type Result = { ok: true } | { ok: false; error: string };

async function teacherOf(classId: string) {
  const profile = await requireProfile(["teacher", "admin"]);
  const supabase = await createClient();
  const { data: allowed } = await supabase.rpc("teaches_class", { p_class: classId });
  if (!allowed && profile.role !== "admin") throw new Error("FORBIDDEN");
  return profile;
}

/** Starts the lesson for a class (a lesson already running in the class is ended). */
export async function startLesson(formData: FormData) {
  const classId = String(formData.get("class_id") ?? "");
  const topicId = String(formData.get("topic_id") ?? "");
  const lessonNo = Number(formData.get("lesson_no"));
  const profile = await teacherOf(classId);
  const admin = createAdminClient();
  const { data: plan } = await admin.from("lesson_plans").select("plan").eq("topic_id", topicId).eq("lesson_no", lessonNo).maybeSingle();
  if (!plan) throw new Error("This lesson has no plan yet.");
  await admin.from("live_sessions").update({ ended_at: new Date().toISOString() }).eq("class_id", classId).is("ended_at", null);
  const { data: s, error } = await admin
    .from("live_sessions")
    .insert({ class_id: classId, topic_id: topicId, lesson_no: lessonNo, teacher_id: profile.id, plan: plan.plan, state: { open: [], revealed: [], groups: {}, openedAt: {} } })
    .select("id")
    .single();
  if (error || !s) throw new Error(error?.message ?? "The lesson could not be started.");
  await admin.from("audit_logs").insert({ actor_id: profile.id, action: "live.start", entity_type: "live_session", entity_id: s.id, details: { class_id: classId, topic_id: topicId, lesson_no: lessonNo } });
  redirect(`/teacher/lessons/${s.id}`);
}

async function load(sessionId: string) {
  const admin = createAdminClient();
  const { data: s } = await admin.from("live_sessions").select("id, class_id, plan, state, ended_at").eq("id", sessionId).maybeSingle();
  if (!s) throw new Error("NOT_FOUND");
  await teacherOf(s.class_id as string);
  return { admin, s: s as { id: string; class_id: string; plan: LivePlan; state: LiveState; ended_at: string | null } };
}

async function save(sessionId: string, state: LiveState) {
  const admin = createAdminClient();
  await admin.from("live_sessions").update({ state }).eq("id", sessionId);
  revalidatePath(`/teacher/lessons/${sessionId}`);
}

/** Opens a block to the class (pair and group blocks get random groups the first time). */
export async function openBlock(sessionId: string, blockId: string): Promise<Result> {
  const { admin, s } = await load(sessionId);
  const block = blocksOf(s.plan).find((b) => b.id === blockId);
  if (!block) return { ok: false, error: "Unknown block" };
  const state: LiveState = { ...s.state };
  state.open = [...new Set([...(state.open ?? []), blockId])];
  state.current = blockId;
  state.openedAt = { ...(state.openedAt ?? {}), [blockId]: state.openedAt?.[blockId] ?? new Date().toISOString() };
  if (block.groupSize > 1 && !state.groups?.[blockId]?.length) {
    const ids = await present(admin, s);
    state.groups = { ...(state.groups ?? {}), [blockId]: makeGroups(ids, block.groupSize, block.scenarios.length) };
  }
  await save(sessionId, state);
  return { ok: true };
}

/**
 * The slide on the teacher's screen, shown to the students too. With
 * `openBlockId` the slide's step is also opened to the class (first visit).
 */
export async function showSlide(sessionId: string, key: string, openBlockId: string | null): Promise<Result> {
  const { admin, s } = await load(sessionId);
  if (s.ended_at) return { ok: false, error: "The lesson has ended." };
  const state: LiveState = { ...s.state, slide: key };
  const block = openBlockId ? blocksOf(s.plan).find((b) => b.id === openBlockId) : null;
  if (block) {
    state.open = [...new Set([...(state.open ?? []), block.id])];
    state.current = block.id;
    state.openedAt = { ...(state.openedAt ?? {}), [block.id]: state.openedAt?.[block.id] ?? new Date().toISOString() };
    if (block.groupSize > 1 && !state.groups?.[block.id]?.length) {
      const ids = await present(admin, s);
      state.groups = { ...(state.groups ?? {}), [block.id]: makeGroups(ids, block.groupSize, block.scenarios.length) };
    }
  } else {
    const ref = key.split(":")[1];
    if (ref && (state.open ?? []).includes(ref)) state.current = ref;
  }
  await save(sessionId, state);
  return { ok: true };
}

export async function closeBlock(sessionId: string, blockId: string): Promise<Result> {
  const { s } = await load(sessionId);
  const state: LiveState = { ...s.state, open: (s.state.open ?? []).filter((x) => x !== blockId) };
  if (state.current === blockId) state.current = null;
  await save(sessionId, state);
  return { ok: true };
}

/** Makes new random groups for a block (e.g. after latecomers joined). */
export async function regroup(sessionId: string, blockId: string): Promise<Result> {
  const { admin, s } = await load(sessionId);
  const block = blocksOf(s.plan).find((b) => b.id === blockId);
  if (!block || block.groupSize < 2) return { ok: false, error: "This block is not done in pairs or groups." };
  const ids = await present(admin, s);
  await save(sessionId, { ...s.state, groups: { ...(s.state.groups ?? {}), [blockId]: makeGroups(ids, block.groupSize, block.scenarios.length) } });
  return { ok: true };
}

/** Shows (or hides) the correct answer of a question to the class. */
export async function toggleReveal(sessionId: string, questionId: string): Promise<Result> {
  const { s } = await load(sessionId);
  const r = new Set(s.state.revealed ?? []);
  if (r.has(questionId)) r.delete(questionId);
  else r.add(questionId);
  await save(sessionId, { ...s.state, revealed: [...r] });
  return { ok: true };
}

export async function endLesson(sessionId: string) {
  const { admin } = await load(sessionId);
  await admin.from("live_sessions").update({ ended_at: new Date().toISOString() }).eq("id", sessionId);
  redirect(`/teacher/lessons/${sessionId}/console`);
}

/** Students who joined (seen in the last 10 minutes); everyone in the class if nobody joined yet. */
async function present(admin: ReturnType<typeof createAdminClient>, s: { id: string; class_id: string }) {
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const { data: joined } = await admin.from("live_participants").select("student_id").eq("session_id", s.id).gte("last_seen", since);
  if (joined?.length) return joined.map((j) => j.student_id as string);
  const { data: members } = await admin.from("class_members").select("student_id").eq("class_id", s.class_id).eq("status", "active");
  return (members ?? []).map((m) => m.student_id as string);
}
