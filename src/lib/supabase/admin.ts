import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "../env";
import { SUPABASE_SERVICE_ROLE_KEY } from "../server-env";

/**
 * Service-role client: bypasses RLS. Use only on the server, only for
 * privileged operations (account management, grading, notifications), and
 * only after the caller's permissions have been checked.
 */
export function createAdminClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
