import "server-only";

// Server-only secrets. Never import this module from client components:
// the "server-only" import makes the build fail if that happens.
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
/** Reasoning effort for AI marking: matching an answer to a mark scheme needs little reasoning. */
export const OPENAI_REASONING_EFFORT = (process.env.OPENAI_REASONING_EFFORT ?? "low") as "minimal" | "low" | "medium" | "high";
/** Reasoning effort for the notes check (reading photos against a checklist). */
export const NOTES_REASONING_EFFORT = (process.env.NOTES_REASONING_EFFORT ?? "low") as "minimal" | "low" | "medium" | "high";
export const CRON_SECRET = process.env.CRON_SECRET ?? "";
/** Temporary password given to new or reset accounts (must be changed at first login). */
export const DEFAULT_TEMP_PASSWORD = process.env.DEFAULT_TEMP_PASSWORD ?? "111111";
