import { NextResponse, type NextRequest } from "next/server";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LivePlan } from "@/lib/live-plan";

/** Downloads a lesson's ҚМЖ (.docx): /teacher/lessons/plan?topic=<id>&lesson=<n> */
export async function GET(req: NextRequest) {
  await requireProfile(["teacher", "admin"]);
  const topic = req.nextUrl.searchParams.get("topic") ?? "";
  const lesson = Number(req.nextUrl.searchParams.get("lesson"));
  const admin = createAdminClient();
  const { data } = await admin.from("lesson_plans").select("plan").eq("topic_id", topic).eq("lesson_no", lesson).maybeSingle();
  const path = (data?.plan as LivePlan | undefined)?.docx;
  if (!path) return new NextResponse("This lesson has no lesson plan file yet.", { status: 404 });
  const { data: signed } = await admin.storage.from("lesson-plans").createSignedUrl(path, 120, { download: path.replace(/^g(\d+)-/, "KMZh_G$1_") });
  if (!signed?.signedUrl) return new NextResponse("The lesson plan could not be opened.", { status: 500 });
  return NextResponse.redirect(signed.signedUrl);
}
