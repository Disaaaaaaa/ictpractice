"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { homeFor } from "@/lib/auth";
import { validateNewPassword } from "@/lib/password";
import type { Role } from "@/lib/db-types";

export type ChangePasswordState = { error?: string; done?: boolean };

/**
 * Sets a new password through Supabase Auth (passwords are never stored in
 * application tables) and clears force_password_change server-side, so a
 * student cannot clear the flag without actually changing the password.
 */
export async function changePassword(_prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const redirectHome = formData.get("redirect") !== "stay";

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const uid = claims?.claims?.sub;
  if (!uid) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("username, role").eq("id", uid).single();
  if (!profile) redirect("/login");

  const invalid = validateNewPassword(password, confirm, profile.username);
  if (invalid) return { error: invalid };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error: /same|different/i.test(error.message)
        ? "Choose a password different from your temporary password."
        : /weak|pwned|leaked/i.test(error.message)
          ? "This password is too weak or has appeared in a data breach. Choose another."
          : "Your password could not be changed. Please try again.",
    };
  }

  const admin = createAdminClient();
  await admin.from("profiles").update({ force_password_change: false }).eq("id", uid);
  await admin.from("audit_logs").insert({ actor_id: uid, action: "account.password_changed", entity_type: "profile", entity_id: uid });

  if (redirectHome) redirect(homeFor(profile.role as Role));
  return { done: true };
}
