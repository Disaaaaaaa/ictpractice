import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function signOut(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const error = request.nextUrl.searchParams.get("error");
  return NextResponse.redirect(new URL(`/login?error=${error === "disabled" ? "disabled" : "signedout"}`, request.url), {
    status: 303,
  });
}

export const GET = signOut;
export const POST = signOut;
