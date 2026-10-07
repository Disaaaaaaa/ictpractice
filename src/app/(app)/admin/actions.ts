"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAccount, resetAccountPassword, setAccountActive } from "@/lib/accounts";
import { getActiveVersion } from "@/lib/curriculum";
import { theoryBlocksSchema } from "@/lib/theory/blocks";

export type AdminState = { ok?: boolean; error?: string; message?: string; details?: string[] };

const admin = () => requireProfile(["admin"]);

async function audit(actor: string, action: string, entity_type: string, entity_id: string | null, details: object = {}) {
  await createAdminClient().from("audit_logs").insert({ actor_id: actor, action, entity_type, entity_id, details });
}

// ---------------------------------------------------------------- users
export async function createUser(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const me = await admin();
  const role = String(formData.get("role")) as "student" | "teacher" | "admin";
  if (!["student", "teacher", "admin"].includes(role)) return { error: "Choose a role." };
  const grade = formData.get("grade") ? Number(formData.get("grade")) : null;
  const result = await createAccount(
    {
      username: String(formData.get("username") ?? ""),
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      role,
      grade,
    },
    me.id,
  );
  if (!result.ok) return { error: result.error };
  const classId = formData.get("class_id") ? String(formData.get("class_id")) : null;
  if (classId && role === "student") await createAdminClient().from("class_members").insert({ class_id: classId, student_id: result.id });
  revalidatePath("/admin/users");
  return { ok: true, message: `Created ${result.username} with the temporary password (must be changed at first login).` };
}

export async function updateUser(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const me = await admin();
  const id = String(formData.get("user_id"));
  const parsed = z
    .object({
      first_name: z.string().trim().max(80),
      last_name: z.string().trim().max(80),
      role: z.enum(["student", "teacher", "admin"]),
      grade: z.union([z.literal(""), z.coerce.number().int().min(11).max(12)]),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Check the fields." };
  if (id === me.id && parsed.data.role !== "admin") return { error: "You cannot remove your own admin role." };
  const v = parsed.data;
  const db = createAdminClient();
  await db.from("profiles").update({ first_name: v.first_name, last_name: v.last_name, role: v.role, grade: v.role === "student" ? (v.grade === "" ? null : v.grade) : null }).eq("id", id);
  await db.auth.admin.updateUserById(id, { app_metadata: { role: v.role } });
  await audit(me.id, "account.update", "profile", id, { role: v.role });
  revalidatePath("/admin/users");
  return { ok: true, message: "Saved." };
}

export async function resetPassword(formData: FormData) {
  const me = await admin();
  await resetAccountPassword(String(formData.get("user_id")), me.id);
  revalidatePath("/admin/users");
}

export async function toggleActive(formData: FormData) {
  const me = await admin();
  const id = String(formData.get("user_id"));
  if (id === me.id) return;
  await setAccountActive(id, formData.get("active") === "true", me.id);
  revalidatePath("/admin/users");
}

// ---------------------------------------------------------------- classes
export async function assignClassTeacher(formData: FormData) {
  const me = await admin();
  const classId = String(formData.get("class_id"));
  const teacherId = String(formData.get("teacher_id") || "") || null;
  await createAdminClient().from("classes").update({ teacher_id: teacherId }).eq("id", classId);
  await audit(me.id, "class.assign_teacher", "class", classId, { teacher_id: teacherId });
  revalidatePath("/admin/classes");
}

export async function archiveClass(formData: FormData) {
  const me = await admin();
  const classId = String(formData.get("class_id"));
  await createAdminClient().from("classes").update({ archived_at: new Date().toISOString() }).eq("id", classId);
  await audit(me.id, "class.archive", "class", classId);
  revalidatePath("/admin/classes");
}

// ---------------------------------------------------------------- curriculum
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function saveTopic(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const me = await admin();
  const version = await getActiveVersion();
  if (!version) return { error: "No active curriculum version." };
  const id = formData.get("topic_id") ? String(formData.get("topic_id")) : null;
  const parsed = z
    .object({
      title: z.string().trim().min(1).max(200),
      description: z.string().max(2000).optional(),
      status: z.enum(["draft", "review", "published", "archived"]),
      recommended_minutes: z.union([z.literal(""), z.coerce.number().int().min(0).max(10000)]),
      unit_id: z.string().uuid().optional().or(z.literal("")),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Check the fields." };
  const v = parsed.data;
  const db = createAdminClient();
  const row = {
    title: v.title,
    description: v.description || null,
    status: v.status,
    recommended_minutes: v.recommended_minutes === "" ? null : v.recommended_minutes,
    archived_at: v.status === "archived" ? new Date().toISOString() : null,
  };
  let topicId = id;
  if (id) {
    await db.from("topics").update(row).eq("id", id);
  } else {
    const grade = formData.get("grade") ? `g${formData.get("grade")}-` : "";
    const { data, error } = await db
      .from("topics")
      .insert({ ...row, curriculum_version_id: version.id, slug: `${grade}${slugify(v.title)}`, sort_order: 10_000 })
      .select("id")
      .single();
    if (error || !data) return { error: error?.code === "23505" ? "A topic with this name already exists." : "The topic could not be created." };
    topicId = data.id;
  }
  if (v.unit_id) {
    await db.from("school_placements").delete().eq("topic_id", topicId!);
    await db.from("school_placements").insert({ topic_id: topicId, unit_id: v.unit_id });
  }
  const sections = formData.getAll("section_ids").map(String);
  if (formData.get("sections_submitted")) {
    await db.from("exam_placements").delete().eq("topic_id", topicId!);
    if (sections.length) await db.from("exam_placements").insert(sections.map((s) => ({ topic_id: topicId, paper_section_id: s })));
  }
  await audit(me.id, id ? "topic.edit" : "topic.create", "topic", topicId);
  revalidatePath("/admin/curriculum");
  if (!id) redirect(`/admin/topics/${topicId}`);
  revalidatePath(`/admin/topics/${topicId}`);
  return { ok: true, message: "Topic saved." };
}

export async function setTopicObjectives(formData: FormData) {
  const me = await admin();
  const topicId = String(formData.get("topic_id"));
  const add = String(formData.get("add_code") ?? "").trim();
  const remove = formData.get("remove_id") ? String(formData.get("remove_id")) : null;
  const db = createAdminClient();
  const version = await getActiveVersion();
  if (add) {
    // "11.5.4.1@paper" links an objective from the Paper 1-2-3 specification.
    const paper = add.endsWith("@paper");
    const code = paper ? add.slice(0, -6) : add;
    let versionId = version?.id ?? "";
    if (paper) {
      const { data: spec } = await db.from("curriculum_versions").select("id").eq("kind", "exam_specification").order("created_at", { ascending: false }).limit(1).maybeSingle();
      versionId = spec?.id ?? "";
    }
    const { data: lo } = await db.from("learning_objectives").select("id").eq("curriculum_version_id", versionId).eq("code", code).maybeSingle();
    if (lo) await db.from("topic_objectives").upsert({ topic_id: topicId, learning_objective_id: lo.id });
  }
  if (remove) await db.from("topic_objectives").delete().eq("topic_id", topicId).eq("learning_objective_id", remove);
  await audit(me.id, "topic.map_lo", "topic", topicId, { add, remove });
  revalidatePath(`/admin/topics/${topicId}`);
}

export async function saveObjective(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const me = await admin();
  const version = await getActiveVersion();
  if (!version) return { error: "No active curriculum version." };
  const parsed = z
    .object({ code: z.string().regex(/^\d{2}\.\d+\.\d+\.\d+$/), description: z.string().trim().min(3).max(1000) })
    .safeParse({ code: formData.get("code"), description: formData.get("description") });
  if (!parsed.success) return { error: "Use a code like 11.2.1.3 and a description." };
  const db = createAdminClient();
  const { data, error } = await db
    .from("learning_objectives")
    .upsert({ curriculum_version_id: version.id, code: parsed.data.code, description: parsed.data.description, grade: Number(parsed.data.code.slice(0, 2)) }, { onConflict: "curriculum_version_id,code" })
    .select("id")
    .single();
  if (error || !data) return { error: "The objective could not be saved." };
  const papers = formData.getAll("paper_sections").map(String);
  if (formData.get("papers_submitted")) {
    await db.from("objective_paper_map").delete().eq("learning_objective_id", data.id);
    if (papers.length) {
      const { data: secs } = await db.from("paper_sections").select("id, paper_component_id").in("id", papers);
      const seen = new Set<string>();
      const rows = (secs ?? []).filter((s) => !seen.has(s.paper_component_id) && seen.add(s.paper_component_id));
      if (rows.length) await db.from("objective_paper_map").insert(rows.map((s) => ({ learning_objective_id: data.id, paper_component_id: s.paper_component_id, paper_section_id: s.id })));
    }
  }
  await audit(me.id, "lo.save", "learning_objective", data.id, { code: parsed.data.code });
  revalidatePath("/admin/curriculum");
  return { ok: true, message: `Saved ${parsed.data.code}.` };
}

// ---------------------------------------------------------------- theory packs
const theorySchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().max(2000).nullable(),
  status: z.enum(["draft", "review", "published", "archived"]),
  sections: z
    .array(
      z.object({
        id: z.string().uuid().nullable(),
        title: z.string().min(1).max(200),
        objectiveIds: z.array(z.string().uuid()),
        blocks: theoryBlocksSchema,
      }),
    )
    .max(60),
});
export type TheoryInput = z.infer<typeof theorySchema>;

/** Saves a whole theory pack (sections + blocks + LO mapping) atomically enough for authoring. */
export async function saveTheoryPack(topicId: string, input: TheoryInput): Promise<AdminState> {
  const me = await admin();
  const parsed = theorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Some blocks are invalid.", details: parsed.error.issues.slice(0, 10).map((i) => `${i.path.join(".")}: ${i.message}`) };
  }
  const v = parsed.data;
  const db = createAdminClient();
  const { data: existing } = await db.from("theory_packs").select("id, version, status").eq("topic_id", topicId).maybeSingle();
  let packId = existing?.id as string | undefined;
  const meta = {
    title: v.title,
    summary: v.summary,
    status: v.status,
    updated_by: me.id,
    published_at: v.status === "published" && existing?.status !== "published" ? new Date().toISOString() : undefined,
  };
  if (packId) {
    await db.from("theory_packs").update({ ...meta, version: (existing?.version ?? 1) + 1 }).eq("id", packId);
  } else {
    const { data } = await db.from("theory_packs").insert({ ...meta, topic_id: topicId }).select("id").single();
    packId = data?.id;
  }
  if (!packId) return { error: "The theory pack could not be saved." };

  const keep = v.sections.map((s) => s.id).filter((x): x is string => !!x);
  const { data: current } = await db.from("theory_sections").select("id").eq("theory_pack_id", packId);
  const toDelete = (current ?? []).map((c) => c.id as string).filter((x) => !keep.includes(x));
  if (toDelete.length) await db.from("theory_sections").delete().in("id", toDelete);

  for (const [i, s] of v.sections.entries()) {
    let sid = s.id;
    if (sid) await db.from("theory_sections").update({ title: s.title, blocks: s.blocks, sort_order: i }).eq("id", sid).eq("theory_pack_id", packId);
    else {
      const { data } = await db.from("theory_sections").insert({ theory_pack_id: packId, title: s.title, blocks: s.blocks, sort_order: i }).select("id").single();
      sid = data?.id ?? null;
    }
    if (!sid) continue;
    await db.from("theory_section_objectives").delete().eq("theory_section_id", sid);
    if (s.objectiveIds.length) await db.from("theory_section_objectives").insert(s.objectiveIds.map((lo) => ({ theory_section_id: sid, learning_objective_id: lo })));
  }
  await audit(me.id, "theory.save", "theory_pack", packId, { sections: v.sections.length, status: v.status });
  revalidatePath(`/admin/theory/${topicId}`);
  return { ok: true, message: v.status === "published" ? "Saved and published." : "Saved as " + v.status + "." };
}

// ---------------------------------------------------------------- settings
const settingsSchema = z.object({
  practice_weight: z.coerce.number().min(0).max(1),
  exam_weight: z.coerce.number().min(0).max(1),
  recent_attempts: z.coerce.number().int().min(1).max(100),
  recency_decay: z.coerce.number().min(0.1).max(1),
  w_easy: z.coerce.number().min(0).max(5),
  w_medium: z.coerce.number().min(0).max(5),
  w_hard: z.coerce.number().min(0).max(5),
  w_exam: z.coerce.number().min(0).max(5),
  confidence_threshold: z.coerce.number().min(0).max(1),
  max_retries: z.coerce.number().int().min(1).max(20),
  save_grace_seconds: z.coerce.number().int().min(0).max(300),
  session_stale_seconds: z.coerce.number().int().min(15).max(600),
});

export async function saveSettings(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const me = await admin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Check the values: " + parsed.error.issues.map((i) => i.path.join(".")).join(", ") };
  const v = parsed.data;
  if (v.practice_weight + v.exam_weight <= 0) return { error: "Practice and exam weights cannot both be zero." };
  const db = createAdminClient();
  const now = new Date().toISOString();
  await db.from("system_settings").upsert([
    {
      key: "mastery",
      value: {
        practice_weight: v.practice_weight,
        exam_weight: v.exam_weight,
        recent_attempts: v.recent_attempts,
        recency_decay: v.recency_decay,
        difficulty_weights: { easy: v.w_easy, medium: v.w_medium, hard: v.w_hard, exam: v.w_exam },
      },
      updated_at: now,
      updated_by: me.id,
    },
    { key: "ai_grading", value: { confidence_threshold: v.confidence_threshold, max_retries: v.max_retries }, updated_at: now, updated_by: me.id },
    { key: "exam_defaults", value: { save_grace_seconds: v.save_grace_seconds, session_stale_seconds: v.session_stale_seconds }, updated_at: now, updated_by: me.id },
  ]);
  await audit(me.id, "settings.update", "system_settings", null, v);
  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings saved. Mastery is recalculated the next time each student is marked." };
}
