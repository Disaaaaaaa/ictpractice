"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAccount, parseStudentCsv, resetAccountPassword } from "@/lib/accounts";
import { gradeAttempt, gradePendingAttempts } from "@/lib/grading/attempt-grader";
import { friendlyError } from "@/lib/errors";
import { ACADEMIC_YEAR } from "@/lib/env";

export type ActionState = { ok?: boolean; error?: string; message?: string; details?: string[] };

const staff = () => requireProfile(["teacher", "admin"]);

/** True when the caller owns the class (or is admin) — checked through RLS. */
async function canManageClass(classId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("teaches_class", { p_class: classId });
  const { data: admin } = await supabase.rpc("is_admin");
  return Boolean(data) || Boolean(admin);
}

async function canManageStudent(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("can_view_student", { p_student: studentId });
  return Boolean(data);
}

// ---------------------------------------------------------------- classes
export async function createClass(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await staff();
  const parsed = z
    .object({ name: z.string().trim().min(1).max(40), grade: z.coerce.number().int().min(11).max(12), academic_year: z.string().trim().min(4).max(20) })
    .safeParse({ name: formData.get("name"), grade: formData.get("grade"), academic_year: formData.get("academic_year") || ACADEMIC_YEAR });
  if (!parsed.success) return { error: "Enter a class name and grade." };
  const supabase = await createClient();
  const teacherId = profile.role === "admin" && formData.get("teacher_id") ? String(formData.get("teacher_id")) : profile.id;
  const { data, error } = await supabase
    .from("classes")
    .insert({ ...parsed.data, teacher_id: teacherId })
    .select("id")
    .single();
  if (error) return { error: error.code === "23505" ? "A class with this name already exists for this year." : "The class could not be created." };
  revalidatePath("/teacher/classes");
  redirect(`/teacher/classes/${data.id}`);
}

export async function addStudentToClass(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await staff();
  const classId = String(formData.get("class_id"));
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  if (!(await canManageClass(classId))) return { error: "You do not manage this class." };
  const admin = createAdminClient();
  const { data: student } = await admin.from("profiles").select("id, role").eq("username", username).maybeSingle();
  if (!student || student.role !== "student") return { error: `No student with username “${username}”.` };
  const { error } = await admin
    .from("class_members")
    .upsert({ class_id: classId, student_id: student.id, status: "active" }, { onConflict: "class_id,student_id" });
  if (error) return { error: "The student could not be added." };
  await admin.from("audit_logs").insert({ actor_id: profile.id, action: "class.add_student", entity_type: "class", entity_id: classId, details: { student_id: student.id } });
  revalidatePath(`/teacher/classes/${classId}`);
  return { ok: true, message: `${username} added to the class.` };
}

export async function removeStudentFromClass(formData: FormData) {
  const profile = await staff();
  const classId = String(formData.get("class_id"));
  const studentId = String(formData.get("student_id"));
  if (!(await canManageClass(classId))) return;
  const admin = createAdminClient();
  await admin.from("class_members").update({ status: "removed" }).eq("class_id", classId).eq("student_id", studentId);
  await admin.from("audit_logs").insert({ actor_id: profile.id, action: "class.remove_student", entity_type: "class", entity_id: classId, details: { student_id: studentId } });
  revalidatePath(`/teacher/classes/${classId}`);
}

export async function createStudentInClass(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await staff();
  const classId = String(formData.get("class_id"));
  if (!(await canManageClass(classId))) return { error: "You do not manage this class." };
  const admin = createAdminClient();
  const { data: cls } = await admin.from("classes").select("grade").eq("id", classId).single();
  const result = await createAccount(
    {
      username: String(formData.get("username") ?? ""),
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      role: "student",
      grade: cls?.grade ?? null,
    },
    profile.id,
  );
  if (!result.ok) return { error: result.error };
  await admin.from("class_members").insert({ class_id: classId, student_id: result.id });
  revalidatePath(`/teacher/classes/${classId}`);
  return { ok: true, message: `Account ${result.username} created with the temporary password. The student must change it at first login.` };
}

/**
 * Bulk import: first_name,last_name,username,class,grade. Teachers import into
 * their own classes (missing classes are created for them); admins may import
 * into any class.
 */
export async function importStudents(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await staff();
  const file = formData.get("file");
  const fixedClassId = formData.get("class_id") ? String(formData.get("class_id")) : null;
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a CSV file." };
  if (file.size > 1_000_000) return { error: "The file is too large (max 1 MB)." };
  const { rows, errors } = parseStudentCsv(await file.text());
  if (errors.length) return { error: "The file has problems.", details: errors.slice(0, 20) };
  if (fixedClassId && !(await canManageClass(fixedClassId))) return { error: "You do not manage this class." };

  const admin = createAdminClient();
  const classIds = new Map<string, string>();
  const details: string[] = [];
  let created = 0;
  let added = 0;

  for (const row of rows) {
    let classId = fixedClassId;
    if (!classId && row.class) {
      if (!classIds.has(row.class)) {
        const { data: found } = await admin.from("classes").select("id, teacher_id").eq("name", row.class).eq("academic_year", ACADEMIC_YEAR).maybeSingle();
        if (found && (found.teacher_id === profile.id || profile.role === "admin")) classIds.set(row.class, found.id);
        else if (found) {
          details.push(`${row.username}: class ${row.class} belongs to another teacher — skipped.`);
          continue;
        } else {
          const grade = row.grade ?? Number(row.class.match(/^\d{2}/)?.[0] ?? 12);
          const { data: newClass } = await admin
            .from("classes")
            .insert({ name: row.class, grade: grade === 11 ? 11 : 12, academic_year: ACADEMIC_YEAR, teacher_id: profile.id })
            .select("id")
            .single();
          if (newClass) classIds.set(row.class, newClass.id);
        }
      }
      classId = classIds.get(row.class) ?? null;
    }
    let grade = row.grade;
    if (!grade && classId) {
      const { data: c } = await admin.from("classes").select("grade").eq("id", classId).single();
      grade = c?.grade ?? null;
    }

    const result = await createAccount({ ...row, role: "student", grade }, profile.id);
    let studentId: string | null = result.ok ? result.id : null;
    if (result.ok) created++;
    else if (result.error === "This username already exists.") {
      const { data: existing } = await admin.from("profiles").select("id, role").eq("username", result.username).maybeSingle();
      if (existing?.role === "student") studentId = existing.id;
      details.push(`${result.username}: already exists${studentId && classId ? " — added to class" : ""}.`);
    } else details.push(`${result.username}: ${result.error}`);

    if (studentId && classId) {
      await admin.from("class_members").upsert({ class_id: classId, student_id: studentId, status: "active" }, { onConflict: "class_id,student_id" });
      added++;
    }
  }
  await admin.from("audit_logs").insert({ actor_id: profile.id, action: "account.bulk_import", entity_type: "profile", details: { rows: rows.length, created, added } });
  revalidatePath("/teacher/classes");
  if (fixedClassId) revalidatePath(`/teacher/classes/${fixedClassId}`);
  return { ok: true, message: `${created} account(s) created, ${added} class membership(s) added.`, details };
}

export async function resetStudentPassword(formData: FormData) {
  const profile = await staff();
  const studentId = String(formData.get("student_id"));
  if (!(await canManageStudent(studentId))) return;
  await resetAccountPassword(studentId, profile.id);
  revalidatePath(`/teacher/students/${studentId}`);
}

// ---------------------------------------------------------------- assignments
const assignmentSchema = z.object({
  assignment_type: z.enum(["practice", "topic_exam", "mock_exam", "revision"]),
  title: z.string().trim().min(1).max(200),
  instructions: z.string().max(5000).optional(),
  exam_id: z.string().uuid().optional().or(z.literal("")),
  topic_id: z.string().uuid().optional().or(z.literal("")),
  available_from: z.string().optional(),
  deadline: z.string().optional(),
  attempt_limit: z.coerce.number().int().min(1).max(20).optional().or(z.literal("")),
  duration_override_minutes: z.coerce.number().int().min(1).max(600).optional().or(z.literal("")),
  show_results: z.string().optional(),
  results_release_at: z.string().optional(),
  show_mark_scheme: z.string().optional(),
  integrity_mode: z.enum(["monitor", "warn", "auto_submit"]),
  max_violations: z.coerce.number().int().min(1).max(50),
});

function localToIso(v: string | undefined, tzOffsetMinutes: number): string | null {
  if (!v) return null;
  // datetime-local has no zone: interpret it in the teacher's browser timezone.
  const ms = Date.parse(`${v}:00Z`);
  if (Number.isNaN(ms)) return null;
  return new Date(ms + tzOffsetMinutes * 60_000).toISOString();
}

export async function createAssignment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await staff();
  const raw = Object.fromEntries(formData.entries());
  const parsed = assignmentSchema.safeParse(raw);
  if (!parsed.success) return { error: "Check the form: " + parsed.error.issues.map((i) => i.path.join(".")).join(", ") };
  const v = parsed.data;
  const tz = Number(formData.get("tz_offset") ?? 0) || 0;
  const classIds = formData.getAll("class_ids").map(String).filter(Boolean);
  const studentIds = formData.getAll("student_ids").map(String).filter(Boolean);
  if (classIds.length === 0 && studentIds.length === 0) return { error: "Choose at least one class or student." };
  const needsExam = v.assignment_type === "topic_exam" || v.assignment_type === "mock_exam";
  if (needsExam && !v.exam_id) return { error: "Choose an exam." };
  if (!needsExam && !v.topic_id && !v.exam_id) return { error: "Choose a topic or an exam." };

  for (const c of classIds) if (!(await canManageClass(c))) return { error: "You can only assign to your own classes." };
  for (const s of studentIds) if (!(await canManageStudent(s))) return { error: "You can only assign to your own students." };

  const supabase = await createClient();
  const availableFrom = localToIso(v.available_from, tz) ?? new Date().toISOString();
  const deadline = localToIso(v.deadline, tz);
  if (deadline && deadline <= availableFrom) return { error: "The deadline must be after the start time." };

  const { data: assignment, error } = await supabase
    .from("assignments")
    .insert({
      teacher_id: profile.id,
      assignment_type: v.assignment_type,
      title: v.title,
      instructions: v.instructions || null,
      exam_id: v.exam_id || null,
      topic_id: v.topic_id || null,
      available_from: availableFrom,
      deadline,
      attempt_limit: v.attempt_limit === "" || v.attempt_limit === undefined ? null : v.attempt_limit,
      duration_override_minutes: v.duration_override_minutes === "" || v.duration_override_minutes === undefined ? null : v.duration_override_minutes,
      show_results: v.show_results === "on",
      results_release_at: localToIso(v.results_release_at, tz),
      show_mark_scheme: v.show_mark_scheme === "on",
      integrity_mode: v.integrity_mode,
      max_violations: v.max_violations,
    })
    .select("id")
    .single();
  if (error || !assignment) return { error: "The assignment could not be created." };

  const targets = [...classIds.map((class_id) => ({ assignment_id: assignment.id, class_id })), ...studentIds.map((student_id) => ({ assignment_id: assignment.id, student_id }))];
  const { error: tErr } = await supabase.from("assignment_targets").insert(targets);
  if (tErr) {
    await supabase.from("assignments").delete().eq("id", assignment.id);
    return { error: "The assignment targets could not be saved." };
  }

  // Notify every targeted student.
  const admin = createAdminClient();
  const { data: members } = classIds.length
    ? await admin.from("class_members").select("student_id").in("class_id", classIds).eq("status", "active")
    : { data: [] };
  const recipients = [...new Set([...(members ?? []).map((m) => m.student_id as string), ...studentIds])];
  if (recipients.length) {
    const link = v.exam_id ? `/exams/${v.exam_id}?assignment=${assignment.id}` : "/student/dashboard";
    await admin.from("notifications").insert(
      recipients.map((user_id) => ({
        user_id,
        type: "assignment",
        title: `New assignment: ${v.title}`,
        body: deadline ? `Due ${new Date(deadline).toLocaleString("en-GB")}` : null,
        link,
      })),
    );
  }
  await admin.from("audit_logs").insert({ actor_id: profile.id, action: "assignment.create", entity_type: "assignment", entity_id: assignment.id, details: { classes: classIds.length, students: studentIds.length } });
  revalidatePath("/teacher/assignments");
  redirect(`/teacher/assignments/${assignment.id}`);
}

export async function archiveAssignment(formData: FormData) {
  await staff();
  const id = String(formData.get("assignment_id"));
  const supabase = await createClient();
  await supabase.from("assignments").update({ archived_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/teacher/assignments");
  redirect("/teacher/assignments");
}

// ---------------------------------------------------------------- live exam control
export async function forceSubmitAttempt(formData: FormData) {
  await staff();
  const attemptId = String(formData.get("attempt_id"));
  const supabase = await createClient();
  const { data } = await supabase.rpc("teacher_force_submit", { p_attempt_id: attemptId });
  if (data) after(() => gradeAttempt(attemptId).then(() => undefined, () => undefined));
  revalidatePath("/teacher", "layout");
}

// ---------------------------------------------------------------- moderation
export async function reviewMark(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await staff();
  const action = String(formData.get("action"));
  const resultId = String(formData.get("result_id"));
  const attemptId = String(formData.get("attempt_id"));
  const markRaw = formData.get("mark");
  const supabase = await createClient();
  const { error } = await supabase.rpc("teacher_review_mark", {
    p_result_id: resultId,
    p_action: action,
    p_mark: markRaw === null || markRaw === "" ? null : Number(markRaw),
    p_feedback: String(formData.get("feedback") ?? "") || null,
    p_reason: String(formData.get("reason") ?? "") || null,
  });
  if (error) return { error: friendlyError(error) };
  if (action === "regrade_request") after(() => gradeAttempt(attemptId).then(() => undefined, () => undefined));
  revalidatePath(`/teacher/results/${attemptId}`);
  return { ok: true, message: action === "regrade_request" ? "Sent for re-marking." : "Saved." };
}

export async function retryGrading(formData: FormData) {
  await staff();
  const attemptId = formData.get("attempt_id");
  if (attemptId) {
    await gradeAttempt(String(attemptId)).catch(() => null);
    revalidatePath(`/teacher/results/${attemptId}`);
  } else {
    await gradePendingAttempts(20);
    revalidatePath("/teacher", "layout");
  }
}
