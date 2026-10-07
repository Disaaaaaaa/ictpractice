import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Receives navigator.sendBeacon() payloads when the exam page is being closed:
// the last unsaved answers and a PAGE_LEAVE event. Authenticated by the
// session cookie that sendBeacon sends with same-origin requests.

const bodySchema = z.object({
  session_id: z.string().min(8).max(100),
  answers: z
    .array(
      z.object({
        question_id: z.string().uuid(),
        answer: z.unknown(),
        flagged: z.boolean().optional(),
        time_delta: z.number().int().min(0).max(300).optional(),
      }),
    )
    .max(200)
    .default([]),
  leaving: z.boolean().default(false),
});

export async function POST(req: NextRequest, ctx: RouteContext<"/api/attempts/[id]/beacon">) {
  const { id } = await ctx.params;
  const text = await req.text();
  if (text.length > 512_000) return NextResponse.json({ error: "Too large" }, { status: 413 });
  const parsed = bodySchema.safeParse(JSON.parse(text || "{}"));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { session_id, answers, leaving } = parsed.data;

  const supabase = await createClient();
  if (answers.length) {
    await supabase.rpc("save_answers_bulk", { p_attempt_id: id, p_session_id: session_id, p_items: answers });
  }
  if (leaving) {
    await supabase.rpc("log_integrity_event", {
      p_attempt_id: id,
      p_session_id: session_id,
      p_event_type: "PAGE_LEAVE",
      p_started_at: new Date().toISOString(),
      p_ended_at: null,
      p_metadata: {},
    });
  }
  return new NextResponse(null, { status: 204 });
}
