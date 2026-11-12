import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * A small fingerprint of a live lesson, polled by the lesson pages instead of a
 * Realtime subscription: the page reloads its data only when this changes.
 * ?parts=session,answers,participants chooses what is included (RLS applies).
 */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/live/[id]/version">) {
  const { id } = await ctx.params;
  const parts = (req.nextUrl.searchParams.get("parts") ?? "session").split(",");
  const supabase = await createClient();
  const out: string[] = [];
  if (parts.includes("session")) {
    const { data } = await supabase.from("live_sessions").select("state, ended_at").eq("id", id).maybeSingle();
    if (!data) return NextResponse.json({ v: "gone" });
    out.push(JSON.stringify(data));
  }
  if (parts.includes("answers")) {
    const { data, count } = await supabase
      .from("live_answers")
      .select("updated_at", { count: "exact" })
      .eq("session_id", id)
      .order("updated_at", { ascending: false })
      .limit(1);
    out.push(`${count ?? 0}:${data?.[0]?.updated_at ?? ""}`);
  }
  if (parts.includes("participants")) {
    const since = new Date(Date.now() - 3 * 60_000).toISOString();
    const { data } = await supabase.from("live_participants").select("student_id, fullscreen").eq("session_id", id).gte("last_seen", since);
    out.push((data ?? []).map((p) => `${p.student_id}${p.fullscreen ? "+" : "-"}`).sort().join(","));
  }
  // a short hash keeps the response tiny
  let h = 0;
  for (const ch of out.join("|")) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0;
  return NextResponse.json({ v: String(h) }, { headers: { "cache-control": "no-store" } });
}
