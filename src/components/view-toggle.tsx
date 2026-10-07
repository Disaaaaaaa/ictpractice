import Link from "next/link";
import { cn } from "@/lib/cn";

export function CurriculumViewToggle({ active }: { active: "school" | "paper" }) {
  const item = (key: "school" | "paper", href: string, label: string) => (
    <Link
      href={href}
      aria-current={active === key ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active === key ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg",
      )}
    >
      {label}
    </Link>
  );
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-2 p-1" role="navigation" aria-label="Browse by">
      {item("school", "/learn", "By School Programme")}
      {item("paper", "/papers", "By Exam Component")}
    </div>
  );
}
