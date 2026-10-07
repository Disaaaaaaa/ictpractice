import "server-only";
import { createAdminClient } from "./supabase/admin";
import { DEFAULT_TEMP_PASSWORD } from "./server-env";
import { USERNAME_RE, normalizeUsername, usernameToEmail } from "./auth";
import type { Role } from "./db-types";

export type NewAccount = {
  username: string;
  first_name: string;
  last_name: string;
  role: Role;
  grade?: number | null;
};

export type AccountResult = { ok: true; id: string; username: string } | { ok: false; username: string; error: string };

/**
 * Creates a Supabase Auth user with the temporary password and a profile that
 * forces a password change on first login. The password itself is only ever
 * handled by Supabase Auth.
 */
export async function createAccount(input: NewAccount, actorId: string): Promise<AccountResult> {
  const admin = createAdminClient();
  const username = normalizeUsername(input.username);
  if (!USERNAME_RE.test(username)) {
    return { ok: false, username, error: "Usernames use lowercase letters, digits, dots, dashes or underscores (2–63 characters)." };
  }
  const grade = input.role === "student" ? (input.grade ?? null) : null;
  if (input.role === "student" && grade !== 11 && grade !== 12) {
    return { ok: false, username, error: "Students need grade 11 or 12." };
  }

  const { data: existing } = await admin.from("profiles").select("id").eq("username", username).maybeSingle();
  if (existing) return { ok: false, username, error: "This username already exists." };

  const { data, error } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password: DEFAULT_TEMP_PASSWORD,
    email_confirm: true,
    user_metadata: { username },
    app_metadata: { role: input.role },
  });
  if (error || !data.user) {
    return { ok: false, username, error: error?.message?.includes("already") ? "This username already exists." : "The account could not be created." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    username,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    role: input.role,
    grade,
    force_password_change: true,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { ok: false, username, error: "The profile could not be created." };
  }

  await admin.from("audit_logs").insert({
    actor_id: actorId,
    action: "account.create",
    entity_type: "profile",
    entity_id: data.user.id,
    details: { username, role: input.role, grade },
  });
  return { ok: true, id: data.user.id, username };
}

export async function resetAccountPassword(userId: string, actorId: string): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, { password: DEFAULT_TEMP_PASSWORD });
  if (error) return { ok: false, error: "The password could not be reset." };
  await admin.from("profiles").update({ force_password_change: true }).eq("id", userId);
  await admin.from("audit_logs").insert({ actor_id: actorId, action: "account.password_reset", entity_type: "profile", entity_id: userId });
  return { ok: true };
}

export async function setAccountActive(userId: string, active: boolean, actorId: string) {
  const admin = createAdminClient();
  await admin.from("profiles").update({ is_active: active }).eq("id", userId);
  // Banning in Auth also stops existing refresh tokens from working.
  await admin.auth.admin.updateUserById(userId, { ban_duration: active ? "none" : "876000h" });
  await admin.from("audit_logs").insert({
    actor_id: actorId,
    action: active ? "account.enable" : "account.disable",
    entity_type: "profile",
    entity_id: userId,
  });
}

export type CsvStudent = { first_name: string; last_name: string; username: string; class: string; grade: number | null };

/** Parses "first_name,last_name,username,class,grade" CSV (header required; ; or , separated). */
export function parseStudentCsv(text: string): { rows: CsvStudent[]; errors: string[] } {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { rows: [], errors: ["The file is empty."] };
  const sep = lines[0].includes(";") && !lines[0].includes(",") ? ";" : ",";
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = !quoted;
      } else if (ch === sep && !quoted) {
        out.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };
  const header = split(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const idx = (name: string) => header.indexOf(name);
  const required = ["first_name", "last_name", "username"];
  const missing = required.filter((r) => idx(r) < 0);
  if (missing.length) return { rows: [], errors: [`Missing column(s): ${missing.join(", ")}. Expected: first_name,last_name,username,class,grade`] };

  const rows: CsvStudent[] = [];
  const errors: string[] = [];
  lines.slice(1).forEach((line, i) => {
    const cells = split(line);
    const get = (n: string) => (idx(n) >= 0 ? (cells[idx(n)] ?? "") : "");
    const gradeRaw = get("grade");
    const grade = gradeRaw ? Number(gradeRaw) : null;
    if (gradeRaw && grade !== 11 && grade !== 12) errors.push(`Row ${i + 2}: grade must be 11 or 12.`);
    if (!get("username")) errors.push(`Row ${i + 2}: username is empty.`);
    rows.push({ first_name: get("first_name"), last_name: get("last_name"), username: get("username"), class: get("class"), grade });
  });
  if (rows.length > 500) errors.push("Import at most 500 students at a time.");
  return { rows, errors };
}
