import { NextResponse, type NextRequest } from "next/server";
import { CRON_SECRET } from "@/lib/server-env";
import { gradePendingAttempts } from "@/lib/grading/attempt-grader";

export const maxDuration = 300;

/**
 * Scheduled job (see vercel.json): closes overdue attempts and retries marking
 * that is pending or failed (e.g. after an OpenAI outage).
 */
export async function GET(req: NextRequest) {
  if (!CRON_SECRET || req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const graded = await gradePendingAttempts(25);
  return NextResponse.json({ graded });
}
