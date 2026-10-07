"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/** Route-based tabs: the active tab is the one whose href matches the path. */
export function LinkTabs({ tabs, exact = [] }: { tabs: { href: string; label: string }[]; exact?: string[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" className="-mb-px flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((t) => {
        const active = exact.includes(t.href) ? pathname === t.href : pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
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
