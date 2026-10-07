"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, BookOpen, ClipboardList, Database, FileText, GraduationCap, Layers, LayoutDashboard,
  LineChart, Radio, ScrollText, Settings, Target, User, Users, Library,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { IconName, NavGroup } from "./nav";

const ICONS: Record<IconName, typeof User> = {
  dashboard: LayoutDashboard,
  learn: BookOpen,
  papers: FileText,
  mocks: GraduationCap,
  progress: Target,
  profile: User,
  classes: Layers,
  students: Users,
  assignments: ClipboardList,
  sessions: Radio,
  questions: Database,
  results: BarChart3,
  analytics: LineChart,
  users: Users,
  curriculum: Library,
  settings: Settings,
  audit: ScrollText,
};

const ROOTS = new Set(["/admin"]);

export function NavLinks({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="space-y-5">
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted">{g.label}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = ROOTS.has(item.href)
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = ICONS[item.icon];
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-fg",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
