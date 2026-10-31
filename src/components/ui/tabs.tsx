"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Route-based tabs: the active tab is the one whose href matches the path.
 * `keep` lists query parameters carried over to every tab (e.g. the lesson).
 */
export function LinkTabs({ tabs, exact = [], keep = [] }: { tabs: { href: string; label: string }[]; exact?: string[]; keep?: string[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const kept = new URLSearchParams();
  for (const k of keep) {
    const v = params.get(k);
    if (v) kept.set(k, v);
  }
  const query = kept.size ? `?${kept.toString()}` : "";
  return (
    <nav aria-label="Sections" className="-mb-px flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((t) => {
        const active = exact.includes(t.href) ? pathname === t.href : pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={`${t.href}${query}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
