"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../env";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Browser client acting as the signed-in user (RLS applies). */
export function getBrowserClient() {
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

/**
 * The browser client with Realtime signed in as the user, so RLS lets the
 * user's own rows through (otherwise the socket may connect as anon and get
 * no events).
 */
export async function getRealtimeClient() {
  const supabase = getBrowserClient();
  const { data } = await supabase.auth.getSession();
  if (data.session) await supabase.realtime.setAuth(data.session.access_token);
  return supabase;
}
