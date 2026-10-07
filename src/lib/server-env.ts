import "server-only";

// Server-only secrets. Never import this module from client components:
// the "server-only" import makes the build fail if that happens.
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
export const CRON_SECRET = process.env.CRON_SECRET ?? "";
/** Temporary password given to new or reset accounts (must be changed at first login). */
export const DEFAULT_TEMP_PASSWORD = process.env.DEFAULT_TEMP_PASSWORD ?? "111111";
