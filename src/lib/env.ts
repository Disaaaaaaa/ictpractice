// Public configuration (safe for the browser).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Domain used to turn a school username into the email-shaped Supabase Auth identifier. */
export const AUTH_EMAIL_DOMAIN = process.env.NEXT_PUBLIC_AUTH_EMAIL_DOMAIN ?? "students.internal";

export const ACADEMIC_YEAR = process.env.NEXT_PUBLIC_ACADEMIC_YEAR ?? "2026-2027";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
