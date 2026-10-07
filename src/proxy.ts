import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./lib/env";

// Refreshes the Supabase session cookie and performs optimistic routing:
// signed-out users → /login, forced password change → /change-password,
// role areas (/teacher, /admin), and students with an exam in progress are
// kept on the exam page. Pages re-check authorisation with requireProfile().

const PUBLIC = ["/login", "/setup", "/auth/signout"];
const HOME: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
};

function redirectTo(request: NextRequest, path: string, carry?: NextResponse) {
  const res = NextResponse.redirect(new URL(path, request.url));
  carry?.cookies.getAll().forEach((c) => res.cookies.set(c));
  return res;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isApi = path.startsWith("/api/");

  if (!isSupabaseConfigured()) {
    return path === "/setup" || isApi ? NextResponse.next() : redirectTo(request, "/setup");
  }
  if (path.startsWith("/api/cron/")) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  const isPublic = PUBLIC.some((p) => path === p || path.startsWith(`${p}/`));

  if (!uid) {
    if (isPublic) return response;
    if (isApi) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const next = path === "/" ? "" : `?next=${encodeURIComponent(path + request.nextUrl.search)}`;
    return redirectTo(request, `/login${next}`, response);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, force_password_change, is_active")
    .eq("id", uid)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    if (path === "/auth/signout") return response;
    return redirectTo(request, "/auth/signout?error=disabled", response);
  }

  if (profile.force_password_change) {
    if (path === "/change-password" || path === "/auth/signout") return response;
    if (isApi) return NextResponse.json({ error: "Password change required" }, { status: 403 });
    return redirectTo(request, "/change-password", response);
  }

  const home = HOME[profile.role] ?? "/login";
  if (path === "/" || path === "/login" || path === "/change-password") return redirectTo(request, home, response);
  if (path.startsWith("/admin") && profile.role !== "admin") return redirectTo(request, home, response);
  if (path.startsWith("/teacher") && profile.role === "student") return redirectTo(request, home, response);
  if (path.startsWith("/student") && profile.role !== "student") return redirectTo(request, home, response);

  // Navigation is restricted while an exam is running.
  if (profile.role === "student" && !isApi && !path.startsWith("/attempt/") && path !== "/auth/signout") {
    const { data: open } = await supabase
      .from("attempts")
      .select("id")
      .eq("student_id", uid)
      .eq("status", "IN_PROGRESS")
      .gt("deadline_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();
    if (open) return redirectTo(request, `/attempt/${open.id}`, response);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff2?)$).*)"],
};
