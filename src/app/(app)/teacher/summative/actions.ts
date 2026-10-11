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
          link: `/exams/${exam_id}`,
        })),
      );
    }
  }
  revalidatePath("/teacher/summative");
  revalidatePath("/summative");
}
