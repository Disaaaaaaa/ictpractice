"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homeFor, normalizeUsername, usernameToEmail } from "@/lib/auth";
import type { Role } from "@/lib/db-types";

export type LoginState = { error?: string; username?: string };

function safeNext(next: FormDataEntryValue | null): string | null {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/login") ? s : null;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password.", username };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
  if (error || !data.user) {
    const rateLimited = error?.status === 429;
    return {
      error: rateLimited ? "Too many attempts. Wait a minute and try again." : "Incorrect username or password.",
      username,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, force_password_change, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return { error: "This account is disabled. Contact your teacher or the administrator.", username };
  }
  if (profile.force_password_change) redirect("/change-password");
  redirect(safeNext(formData.get("next")) ?? homeFor(profile.role as Role));
}
