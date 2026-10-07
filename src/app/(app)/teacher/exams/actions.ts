"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveVersion } from "@/lib/curriculum";
import { friendlyError } from "@/lib/errors";

export type ExamActionState = { ok?: boolean; error?: string; message?: string };

const settingsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  kind: z.enum(["topic", "mock", "revision", "custom"]),
  description: z.string().max(2000).optional(),
  instructions: z.string().max(5000).optional(),
  topic_id: z.string().uuid().optional().or(z.literal("")),
  paper: z.coerce.number().int().min(1).max(3).optional().or(z.literal("")),
  year: z.coerce.number().int().min(2000).max(2100).optional().or(z.literal("")),
  grade: z.coerce.number().int().min(11).max(12).optional().or(z.literal("")),
  duration_minutes: z.coerce.number().int().min(1).max(600),
  availability_start: z.string().optional(),
  availability_end: z.string().optional(),
  attempt_limit: z.coerce.number().int().min(1).max(50).optional().or(z.literal("")),
  integrity_mode: z.enum(["monitor", "warn", "auto_submit"]),
  max_violations: z.coerce.number().int().min(1).max(50),
  require_fullscreen: z.string().optional(),
  show_results: z.string().optional(),
  results_release_at: z.string().optional(),
  show_mark_scheme: z.string().optional(),
});

const toIso = (v: string | undefined, tz: number) => {
  if (!v) return null;
  const ms = Date.parse(`${v}:00Z`);
  return Number.isNaN(ms) ? null : new Date(ms + tz * 60_000).toISOString();
};
const opt = <T,>(v: T | "" | undefined) => (v === "" || v === undefined ? null : v);

export async function saveExam(_prev: ExamActionState, formData: FormData): Promise<ExamActionState> {
  const profile = await requireProfile(["teacher", "admin"]);
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Check: " + parsed.error.issues.map((i) => i.path.join(".")).join(", ") };
  const v = parsed.data;
  const tz = Number(formData.get("tz_offset") ?? 0) || 0;
  const examId = formData.get("exam_id") ? String(formData.get("exam_id")) : null;
  const supabase = await createClient();
  const version = await getActiveVersion();
  if (!version) return { error: "No active curriculum." };

  let paperComponentId: string | null = null;
  if (v.paper !== "" && v.paper !== undefined) {
    const { data: pc } = await supabase.from("paper_components").select("id").eq("curriculum_version_id", version.id).eq("number", v.paper).single();
    paperComponentId = pc?.id ?? null;
  }
  if (v.kind === "mock" && (!paperComponentId || !opt(v.year))) return { error: "Mock exams need a year and a paper." };

  const row = {
    title: v.title,
    kind: v.kind,
    description: v.description || null,
    instructions: v.instructions || null,
    topic_id: opt(v.topic_id),
    paper_component_id: paperComponentId,
    year: opt(v.year),
    grade: opt(v.grade),
    duration_minutes: v.duration_minutes,
    availability_start: toIso(v.availability_start, tz),
    availability_end: toIso(v.availability_end, tz),
    attempt_limit: opt(v.attempt_limit),
    integrity_mode: v.integrity_mode,
    max_violations: v.max_violations,
    require_fullscreen: v.require_fullscreen === "on",
    show_results: v.show_results === "on",
    results_release_at: toIso(v.results_release_at, tz),
    show_mark_scheme: v.show_mark_scheme === "on",
  };

  if (examId) {
    const { error, data } = await supabase.from("exams").update(row).eq("id", examId).select("id");
    if (error || !data?.length) return { error: "You can only edit exams you created. Duplicate it to make your own copy." };
    await createAdminClient().from("audit_logs").insert({ actor_id: profile.id, action: "exam.edit", entity_type: "exam", entity_id: examId, details: { fields: Object.keys(row) } });
    revalidatePath(`/teacher/exams/${examId}`);
    return { ok: true, message: "Settings saved. Availability, attempt limits and integrity rules apply immediately; duration and question changes apply when you publish a new version." };
  }
  const { data, error } = await supabase
    .from("exams")
    .insert({ ...row, curriculum_version_id: version.id, status: "draft", created_by: profile.id })
    .select("id")
    .single();
  if (error || !data) return { error: "The exam could not be created." };
  await createAdminClient().from("audit_logs").insert({ actor_id: profile.id, action: "exam.create", entity_type: "exam", entity_id: data.id });
  redirect(`/teacher/exams/${data.id}`);
}

const itemsSchema = z
  .array(
    z.object({
      question_id: z.string().uuid(),
      marks_override: z.number().int().min(0).max(100).nullable(),
      section_label: z.string().max(60).nullable(),
    }),
  )
  .max(200);

/** Replaces the draft question list. Published versions are never touched. */
export async function setExamQuestions(examId: string, items: z.infer<typeof itemsSchema>): Promise<ExamActionState> {
  const profile = await requireProfile(["teacher", "admin"]);
  const parsed = itemsSchema.safeParse(items);
  if (!parsed.success) return { error: "Invalid question list." };
  const supabase = await createClient();
  const { data: exam } = await supabase.from("exams").select("id, created_by").eq("id", examId).single();
  if (!exam || (exam.created_by !== profile.id && profile.role !== "admin")) return { error: "You can only edit exams you created." };
  const { error: delErr } = await supabase.from("exam_questions").delete().eq("exam_id", examId);
  if (delErr) return { error: "The question list could not be saved." };
  if (parsed.data.length) {
    const { error } = await supabase
      .from("exam_questions")
      .insert(parsed.data.map((it, i) => ({ exam_id: examId, question_id: it.question_id, sort_order: i, marks_override: it.marks_override, section_label: it.section_label || null })));
    if (error) return { error: "The question list could not be saved." };
  }
  await createAdminClient().from("audit_logs").insert({ actor_id: profile.id, action: "exam.edit_questions", entity_type: "exam", entity_id: examId, details: { count: parsed.data.length } });
  revalidatePath(`/teacher/exams/${examId}`);
  return { ok: true, message: `${parsed.data.length} question(s) saved. Publish to make the change visible to students.` };
}

export async function publishExam(_prev: ExamActionState, formData: FormData): Promise<ExamActionState> {
  await requireProfile(["teacher", "admin"]);
  const examId = String(formData.get("exam_id"));
  const supabase = await createClient();
  const { error } = await supabase.rpc("publish_exam", { p_exam_id: examId });
  if (error) return { error: friendlyError(error, "The exam could not be published.") };
  revalidatePath(`/teacher/exams/${examId}`);
  return { ok: true, message: "Published. Students who already started keep their original version." };
}

export async function setExamStatus(formData: FormData) {
  const profile = await requireProfile(["teacher", "admin"]);
  const examId = String(formData.get("exam_id"));
  const status = String(formData.get("status"));
  if (!["published", "closed", "archived"].includes(status)) return;
  const supabase = await createClient();
  await supabase
    .from("exams")
    .update({ status, archived_at: status === "archived" ? new Date().toISOString() : null })
    .eq("id", examId);
  await createAdminClient().from("audit_logs").insert({ actor_id: profile.id, action: `exam.${status}`, entity_type: "exam", entity_id: examId });
  revalidatePath(`/teacher/exams/${examId}`);
  revalidatePath("/teacher/exams");
}

export async function duplicateExam(formData: FormData) {
  const profile = await requireProfile(["teacher", "admin"]);
  const examId = String(formData.get("exam_id"));
  const supabase = await createClient();
  const { data: src } = await supabase.from("exams").select("*").eq("id", examId).single();
  if (!src) return;
  const { id: _id, current_version_id: _v, created_at: _c, updated_at: _u, archived_at: _a, created_by: _b, status: _s, ...rest } = src;
  void [_id, _v, _c, _u, _a, _b, _s];
  const { data: copy } = await supabase
    .from("exams")
    .insert({ ...rest, title: `${src.title} (copy)`, status: "draft", created_by: profile.id })
    .select("id")
    .single();
  if (!copy) return;
  const { data: qs } = await supabase.from("exam_questions").select("question_id, sort_order, marks_override, section_label").eq("exam_id", examId);
  if (qs?.length) await supabase.from("exam_questions").insert(qs.map((q) => ({ ...q, exam_id: copy.id })));
  redirect(`/teacher/exams/${copy.id}`);
}
