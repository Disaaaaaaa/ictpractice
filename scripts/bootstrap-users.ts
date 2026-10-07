/**
 * Creates the first administrator (and, with --demo, a demo teacher, class and
 * students) using the service-role key. Run once after applying migrations:
 *
 *   npm run users:bootstrap -- --admin admin --first Dias --last Asylbek
 *   npm run users:bootstrap -- --admin admin --demo
 *
 * All accounts get DEFAULT_TEMP_PASSWORD (111111 by default) and must change it
 * at first login.
 */
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "node:util";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const domain = process.env.NEXT_PUBLIC_AUTH_EMAIL_DOMAIN ?? "students.internal";
const password = process.env.DEFAULT_TEMP_PASSWORD ?? "111111";
const year = process.env.NEXT_PUBLIC_ACADEMIC_YEAR ?? "2026-2027";
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local).");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const { values } = parseArgs({
  options: {
    admin: { type: "string", default: "admin" },
    first: { type: "string", default: "Platform" },
    last: { type: "string", default: "Administrator" },
    demo: { type: "boolean", default: false },
  },
});

async function ensureUser(username: string, first: string, last: string, role: "student" | "teacher" | "admin", grade: number | null) {
  const { data: existing } = await db.from("profiles").select("id").eq("username", username).maybeSingle();
  if (existing) {
    console.log(`• ${username} already exists`);
    return existing.id as string;
  }
  const { data, error } = await db.auth.admin.createUser({
    email: `${username}@${domain}`,
    password,
    email_confirm: true,
    user_metadata: { username },
    app_metadata: { role },
  });
  if (error || !data.user) throw new Error(`${username}: ${error?.message}`);
  const { error: pErr } = await db.from("profiles").insert({
    id: data.user.id, username, first_name: first, last_name: last, role, grade, force_password_change: true,
  });
  if (pErr) throw new Error(`${username} profile: ${pErr.message}`);
  await db.from("audit_logs").insert({ action: "account.create", entity_type: "profile", entity_id: data.user.id, details: { username, role, via: "bootstrap" } });
  console.log(`✓ created ${role} ${username}`);
  return data.user.id;
}

async function main() {
  await ensureUser(values.admin!, values.first!, values.last!, "admin", null);
  if (values.demo) {
    const teacher = await ensureUser("demo.teacher", "Demo", "Teacher", "teacher", null);
    const { data: cls } = await db
      .from("classes")
      .upsert({ name: "12-DEMO", grade: 12, academic_year: year, teacher_id: teacher }, { onConflict: "name,academic_year" })
      .select("id")
      .single();
    for (const [u, f, l] of [["demo.student1", "Aruzhan", "Demo"], ["demo.student2", "Nurlan", "Demo"], ["demo.student3", "Madina", "Demo"]]) {
      const id = await ensureUser(u, f, l, "student", 12);
      if (cls) await db.from("class_members").upsert({ class_id: cls.id, student_id: id, status: "active" }, { onConflict: "class_id,student_id" });
    }
  }
  console.log(`\nTemporary password for new accounts: ${password} (must be changed at first login).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
