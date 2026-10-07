import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/db-types";
import { navFor } from "./nav";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { ThemeCycleButton } from "@/components/theme-toggle";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-fg">CS</span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold">NIS Computer Science</span>
        <span className="block text-xs text-muted">Exam Preparation</span>
      </span>
    </Link>
  );
}

const ROLE_LABEL = { student: "Student", teacher: "Teacher", admin: "Administrator" } as const;

export async function AppShell({ profile, children }: { profile: Profile; children: ReactNode }) {
  const t = getDictionary(profile.locale);
  const groups = navFor(profile.role, t);
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);
  const unread = count ?? 0;

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-3 py-4 lg:flex">
        <div className="px-2 pb-5">
          <Brand />
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto">
          <NavLinks groups={groups} />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
          <MobileNav groups={groups} brand={<Brand />} />
          <form action="/search" className="relative min-w-0 max-w-md flex-1" role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <input
              id="global-search"
              name="q"
              type="search"
              placeholder={t.common.search}
              className="h-10 w-full rounded-lg border border-border bg-surface-2 pl-9 pr-3 text-sm placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
            />
          </form>
          <div className="ml-auto flex items-center gap-1">
            <ThemeCycleButton />
            <Link
              href="/notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-2"
              aria-label={`${t.common.notifications}${unread ? ` (${unread} unread)` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
            <Link href="/profile" className="hidden items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-2 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {(profile.first_name[0] ?? profile.username[0] ?? "?").toUpperCase()}
                {(profile.last_name[0] ?? "").toUpperCase()}
              </span>
              <span className="leading-tight">
                <span className="block max-w-40 truncate text-sm font-medium">{displayName(profile)}</span>
                <span className="block text-xs text-muted">{ROLE_LABEL[profile.role]}</span>
              </span>
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
                aria-label={t.common.signOut}
                title={t.common.signOut}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
