"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveVersion } from "@/lib/curriculum";
import { authoredQuestionSchema, type AuthoredQuestion } from "@/lib/content/schema";
import { comparePartLabels, normalizePartLabel } from "@/lib/questions/parts";

type Client = Awaited<ReturnType<typeof createClient>>;

/** Keeps a structured question's marks equal to the sum of its parts and the parts in label order. */
async function syncStructured(supabase: Client, parentId: string) {
  const { data: parts } = await supabase
    .from("questions")
    .select("id, part_label, marks")
    .eq("parent_id", parentId)
    .is("archived_at", null);
  const list = [...(parts ?? [])].sort((a, b) => comparePartLabels(a.part_label ?? "", b.part_label ?? ""));
  await Promise.all(list.map((p, i) => supabase.from("questions").update({ part_order: i }).eq("id", p.id)));
  const total = list.reduce((s, p) => s + (p.marks as number), 0);
  await supabase.from("questions").update({ marks: Math.max(1, total) }).eq("id", parentId);
}

export type SaveQuestionResult = { ok: true; id: string; message: string } | { ok: false; error: string; issues?: string[] };

/**
 * Creates or updates a bank question. Mark-scheme edits create a new
 * mark_schemes version (the old one is kept for audit); exams that were already
 * published keep their frozen copy, so old results never change.
 */
export async function saveQuestion(
  questionId: string | null,
  input: AuthoredQuestion,
  opts: { parentId?: string } = {},
): Promise<SaveQuestionResult> {
  const profile = await requireProfile(["teacher", "admin"]);
  const parsed = authoredQuestionSchema.safeParse({ ...input, key: "editor" });
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted problems.", issues: parsed.error.issues.map((i) => `${i.path.join(".") || "question"}: ${i.message}`) };
  }
  const q = parsed.data;
  const version = await getActiveVersion();
  if (!version) return { ok: false, error: "No active curriculum." };
  const supabase = await createClient();

  // Parts of a structured question
  let parentId: string | null = null;
  if (questionId) {
    const { data: existing } = await supabase.from("questions").select("parent_id").eq("id", questionId).maybeSingle();
    parentId = (existing?.parent_id as string | null) ?? null;
  } else if (opts.parentId) {
    parentId = opts.parentId;
  }
  if (parentId) {
    if (q.type === "structured") return { ok: false, error: "A part cannot itself be a structured question." };
    const { data: parent } = await supabase.from("questions").select("id, question_type, created_by").eq("id", parentId).maybeSingle();
    if (!parent || parent.question_type !== "structured") return { ok: false, error: "The structured question was not found." };
    if (profile.role !== "admin" && parent.created_by !== profile.id) {
      return { ok: false, error: "Only the author of the structured question can add or edit its parts." };
    }
    if (!q.part_label?.trim()) return { ok: false, error: "Give the part a label such as (a) or (b)(i)." };
  }
  if (q.type === "structured" && questionId) {
    const { data: cur } = await supabase.from("questions").select("question_type").eq("id", questionId).maybeSingle();
    if (cur && cur.question_type !== "structured") {
      const { count } = await supabase.from("questions").select("id", { count: "exact", head: true }).eq("parent_id", questionId);
      if (count) return { ok: false, error: "This question already has parts." };
    }
  }
  if (q.type !== "structured" && questionId) {
    const { count } = await supabase.from("questions").select("id", { count: "exact", head: true }).eq("parent_id", questionId).is("archived_at", null);
    if (count) return { ok: false, error: "Archive the parts before changing a structured question to another type." };
  }

  // "11.5.4.1@paper" refers to the Paper 1-2-3 specification, other codes to the KTP.
  const ktpCodes = q.objectives.filter((c) => !c.endsWith("@paper"));
  const paperCodes = q.objectives.filter((c) => c.endsWith("@paper")).map((c) => c.slice(0, -6));
  const { data: spec } = paperCodes.length
    ? await supabase.from("curriculum_versions").select("id").eq("kind", "exam_specification").order("created_at", { ascending: false }).limit(1).maybeSingle()
    : { data: null };
  const [{ data: ktpLos }, { data: paperLos }] = await Promise.all([
    supabase.from("learning_objectives").select("id").eq("curriculum_version_id", version.id).in("code", ktpCodes.length ? ktpCodes : ["-"]),
    supabase.from("learning_objectives").select("id").eq("curriculum_version_id", spec?.id ?? "").in("code", paperCodes.length ? paperCodes : ["-"]),
  ]);
  const loIds = [...(ktpLos ?? []), ...(paperLos ?? [])].map((l) => l.id as string);
  if (loIds.length !== new Set(q.objectives).size) return { ok: false, error: "Unknown learning objective code." };
  if (loIds.length === 0 && q.type !== "structured") return { ok: false, error: "Add at least one learning objective." };

  let topicId: string | null = null;
  if (q.topic) {
    const { data: t } = await supabase.from("topics").select("id").eq("id", q.topic).maybeSingle();
    topicId = t?.id ?? null;
  }
  const { data: papers } = await supabase.from("objective_paper_map").select("paper_component_id").in("learning_objective_id", loIds);
  const paperCounts = new Map<string, number>();
  for (const p of papers ?? []) paperCounts.set(p.paper_component_id, (paperCounts.get(p.paper_component_id) ?? 0) + 1);
  const paperId = [...paperCounts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const row = {
    curriculum_version_id: version.id,
    title: q.title,
    question_text: q.text,
    question_type: q.type,
    marks: q.marks,
    difficulty: q.difficulty,
    command_word: q.command_word ?? null,
    grading_method: q.grading,
    grade: q.objectives[0] ? Number(q.objectives[0].slice(0, 2)) : null,
    paper_component_id: paperId,
    topic_id: topicId,
    content: q.content ?? {},
    source_type: q.source ?? "teacher",
    source_reference: q.source_reference ?? null,
    practice_enabled: q.practice ?? true,
    status: q.status ?? "draft",
    ...(parentId ? { parent_id: parentId, part_label: normalizePartLabel(q.part_label ?? "") } : {}),
  };

  let id = questionId;
  if (id) {
    const { data, error } = await supabase.from("questions").update(row).eq("id", id).select("id");
    if (error || !data?.length) return { ok: false, error: "You can only edit questions you created (admins can edit all)." };
  } else {
    const { data, error } = await supabase.from("questions").insert({ ...row, created_by: profile.id }).select("id").single();
    if (error || !data) return { ok: false, error: "The question could not be created." };
    id = data.id as string;
  }

  await supabase.from("question_objectives").delete().eq("question_id", id);
  await supabase.from("question_objectives").insert(loIds.map((learning_objective_id) => ({ question_id: id, learning_objective_id })));
  await supabase.from("question_options").delete().eq("question_id", id);
  if (q.options?.length) {
    await supabase.from("question_options").insert(q.options.map((o, i) => ({ question_id: id, key: o.key, content: o.content, sort_order: i })));
  }

  if (q.type === "structured") {
    // The stem has no mark scheme of its own: its parts are marked individually.
    await syncStructured(supabase, id!);
    await createAdminClient().from("audit_logs").insert({
      actor_id: profile.id,
      action: questionId ? "question.edit" : "question.create",
      entity_type: "question",
      entity_id: id,
      details: { status: row.status, structured: true },
    });
    revalidatePath("/teacher/questions");
    return { ok: true, id: id!, message: "Saved." };
  }

  const scheme = {
    mark_scheme: q.scheme.mark_scheme,
    marking_points: q.scheme.points ?? [],
    model_answer: q.scheme.model_answer ?? null,
    accepted_answers: q.scheme.accepted ?? {},
    ai_grading_instructions: q.scheme.ai_instructions ?? null,
    explanation: q.scheme.explanation ?? null,
  };
  const { data: current } = await supabase.from("mark_schemes").select("*").eq("question_id", id).eq("is_current", true).maybeSingle();
  const changed =
    !current ||
    JSON.stringify([current.mark_scheme, current.marking_points, current.model_answer, current.accepted_answers, current.ai_grading_instructions, current.explanation]) !==
      JSON.stringify([scheme.mark_scheme, scheme.marking_points, scheme.model_answer, scheme.accepted_answers, scheme.ai_grading_instructions, scheme.explanation]);
  if (changed) {
    if (current) await supabase.from("mark_schemes").update({ is_current: false }).eq("id", current.id);
    const { error } = await supabase.from("mark_schemes").insert({ ...scheme, question_id: id, version: (current?.version ?? 0) + 1, is_current: true, created_by: profile.id });
    if (error) return { ok: false, error: "The mark scheme could not be saved." };
  }

  await createAdminClient().from("audit_logs").insert({
    actor_id: profile.id,
    action: questionId ? "question.edit" : "question.create",
    entity_type: "question",
    entity_id: id,
    details: { status: row.status, mark_scheme_changed: changed },
  });
  if (parentId) await syncStructured(supabase, parentId);
  revalidatePath("/teacher/questions");
  return { ok: true, id: id!, message: changed && current ? `Saved. Mark scheme is now version ${(current.version ?? 0) + 1}.` : "Saved." };
}

export async function archiveQuestion(formData: FormData) {
  const profile = await requireProfile(["teacher", "admin"]);
  const id = String(formData.get("question_id"));
  const supabase = await createClient();
  // Soft delete: the question may be used in published exams.
  const { data: archived } = await supabase
    .from("questions")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", id)
    .select("parent_id");
  const parentId = archived?.[0]?.parent_id as string | null | undefined;
  if (parentId) await syncStructured(supabase, parentId);
  await createAdminClient().from("audit_logs").insert({ actor_id: profile.id, action: "question.archive", entity_type: "question", entity_id: id });
  revalidatePath("/teacher/questions");
}
