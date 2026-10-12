"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { friendlyError } from "@/lib/errors";

const schema = z.object({
  exam_id: z.string().uuid(),
  class_ids: z.array(z.string().uuid()).min(1).max(50),
  open: z.enum(["0", "1"]),
  grade: z.enum(["11", "12"]),
});

/**
 * Adds another variant to a summative: a draft copy of the base exam (same
 * settings and questions) for the teacher to rewrite with different numbers
 * and contexts, then publish.
 */
export async function addSummativeVariant(formData: FormData) {
  const profile = await requireProfile(["teacher", "admin"]);
  const baseId = String(formData.get("exam_id") ?? "");
  if (!z.string().uuid().safeParse(baseId).success) return;
  const supabase = await createClient();
  const { data: src } = await supabase.from("exams").select("*").eq("id", baseId).maybeSingle();
  if (!src || src.kind !== "summative" || src.variant_of) return;
  const { data: siblings } = await supabase.from("exams").select("variant_no").eq("variant_of", baseId);
  const no = Math.max(1, ...(siblings ?? []).map((s) => s.variant_no as number)) + 1;
  if (no > 20) return;

  const { id: _id, current_version_id: _v, created_at: _c, updated_at: _u, archived_at: _a, created_by: _b, status: _s, ...rest } = src;
  void [_id, _v, _c, _u, _a, _b, _s];
  const { data: copy } = await supabase
    .from("exams")
    .insert({ ...rest, title: `${src.title} — Variant ${no}`, variant_of: baseId, variant_no: no, status: "draft", created_by: profile.id })
    .select("id")
    .single();
  if (!copy) return;
  const { data: qs } = await supabase.from("exam_questions").select("question_id, sort_order, marks_override, section_label").eq("exam_id", baseId);
  if (qs?.length) await supabase.from("exam_questions").insert(qs.map((q) => ({ ...q, exam_id: copy.id })));
  await createAdminClient().from("audit_logs").insert({ actor_id: profile.id, action: "summative.add_variant", entity_type: "exam", entity_id: copy.id, details: { base: baseId, variant_no: no } });
  revalidatePath("/teacher/summative");
  redirect(`/teacher/exams/${copy.id}`);
}

/** Opens or closes a summative assessment for one or more classes. */
export async function setSummativeAccess(formData: FormData) {
  await requireProfile(["teacher", "admin"]);
  const parsed = schema.safeParse({
    exam_id: formData.get("exam_id"),
    class_ids: String(formData.get("class_ids") ?? "").split(",").filter(Boolean),
    open: formData.get("open"),
    grade: formData.get("grade"),
  });
  if (!parsed.success) return;
  const { exam_id, class_ids, grade } = parsed.data;
  const open = parsed.data.open === "1";
  const back = `/teacher/summative?grade=${grade}`;
  const supabase = await createClient();

  // The RPC checks that the caller teaches the class and that the assessment is published.
  for (const class_id of class_ids) {
    const { error } = await supabase.rpc("set_summative_access", { p_exam_id: exam_id, p_class_id: class_id, p_open: open });
    if (error) {
      revalidatePath("/teacher/summative");
      redirect(`${back}&error=${encodeURIComponent(friendlyError(error, "Access could not be changed."))}`);
    }
  }

  if (open) {
    const admin = createAdminClient();
    const [{ data: exam }, { data: members }] = await Promise.all([
      admin.from("exams").select("title").eq("id", exam_id).maybeSingle(),
      admin.from("class_members").select("student_id").in("class_id", class_ids).eq("status", "active"),
    ]);
    const recipients = [...new Set((members ?? []).map((m) => m.student_id as string))];
    if (exam && recipients.length) {
      await admin.from("notifications").insert(
        recipients.map((user_id) => ({
          user_id,
          type: "exam_available",
          title: `Summative assessment open: ${exam.title}`,
          body: "Your teacher has opened this assessment for your class.",
          link: "/summative", // each student has their own variant
        })),
      );
    }
  }
  revalidatePath("/teacher/summative");
  revalidatePath("/summative");
}
