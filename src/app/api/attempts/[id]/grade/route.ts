import { NextResponse, after, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gradeAttempt } from "@/lib/grading/attempt-grader";

export const maxDuration = 60;

/**
 * Starts marking a submitted attempt. Callable by the student who owns it or a
 * teacher who can see it (RLS decides). Marking runs after the response so the
 * student is not kept waiting; failures stay PENDING/FAILED for the cron retry.
 */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/attempts/[id]/grade">) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: attempt } = await supabase.from("attempts").select("id, status").eq("id", id).maybeSingle();
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (attempt.status === "IN_PROGRESS") return NextResponse.json({ error: "Attempt not submitted" }, { status: 409 });

  after(async () => {
    try {
      await gradeAttempt(id);
    } catch (e) {
      console.error("grading failed", id, e);
    }
  });
  return NextResponse.json({ queued: true }, { status: 202 });
}
