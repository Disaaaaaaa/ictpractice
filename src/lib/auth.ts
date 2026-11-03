import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { AUTH_EMAIL_DOMAIN } from "./env";
import type { Profile, Role } from "./db-types";

export const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{1,62}$/;

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

/** Students sign in with a school username; Supabase Auth needs an email-shaped id. */
export function usernameToEmail(username: string): string {
  const u = normalizeUsername(username);
  return u.includes("@") ? u : `${u}@${AUTH_EMAIL_DOMAIN}`;
}

export function homeFor(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/teacher/dashboard";
    default:
      return "/student/dashboard";
  }
}

/** "Фамилия Имя Отчество": last_name first, then first_name (which holds the given name and the patronymic). */
export function displayName(p: Pick<Profile, "first_name" | "last_name" | "username">): string {
  const name = `${p.last_name} ${p.first_name}`.trim();
  return name || p.username;
}

const names = new Intl.Collator("kk", { sensitivity: "base", numeric: true });
/** Alphabetical order of names, Kazakh letters included (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І). */
export const compareNames = (a: string, b: string) => names.compare(a, b);
/** Orders people by "Фамилия Имя Отчество". */
export const byName = (a: Pick<Profile, "first_name" | "last_name" | "username">, b: Pick<Profile, "first_name" | "last_name" | "username">) =>
  compareNames(displayName(a), displayName(b));

export function shortName(p: Pick<Profile, "first_name" | "last_name" | "username">): string {
  // "Фамилия И."
  if (!p.last_name) return p.first_name || p.username;
  return p.first_name ? `${p.last_name} ${p.first_name[0]}.` : p.last_name;
}

/** The signed-in user's profile, or null. Deduplicated per request. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
  return (profile as Profile | null) ?? null;
});

/**
 * Page/action guard. The proxy already redirects optimistically; this is the
 * authoritative check, executed next to the data access.
 */
export async function requireProfile(roles?: Role[]): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.is_active) redirect("/auth/signout?error=disabled");
  if (profile.force_password_change) redirect("/change-password");
  if (roles && !roles.includes(profile.role)) redirect(homeFor(profile.role));
  return profile;
}

export const isStaff = (p: Pick<Profile, "role">) => p.role === "teacher" || p.role === "admin";
