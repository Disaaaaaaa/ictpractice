import type { Role } from "@/lib/db-types";
import type { Dict } from "@/lib/i18n";

export type IconName =
  | "dashboard" | "learn" | "papers" | "mocks" | "progress" | "profile" | "classes" | "students"
  | "assignments" | "sessions" | "questions" | "results" | "analytics" | "users" | "curriculum"
  | "settings" | "audit";

export type NavItem = { href: string; label: string; icon: IconName };
export type NavGroup = { label?: string; items: NavItem[] };

export function navFor(role: Role, t: Dict): NavGroup[] {
  const student: NavGroup = {
    items: [
      { href: "/student/dashboard", label: t.nav.dashboard, icon: "dashboard" },
      { href: "/learn", label: t.nav.learn, icon: "learn" },
      { href: "/papers", label: t.nav.papers, icon: "papers" },
      { href: "/mock-exams", label: t.nav.mocks, icon: "mocks" },
      { href: "/progress", label: t.nav.progress, icon: "progress" },
      { href: "/profile", label: t.nav.profile, icon: "profile" },
    ],
  };
  const teaching: NavGroup = {
    label: t.nav.teaching,
    items: [
      { href: "/teacher/dashboard", label: t.nav.dashboard, icon: "dashboard" },
      { href: "/teacher/classes", label: t.nav.classes, icon: "classes" },
      { href: "/teacher/students", label: t.nav.students, icon: "students" },
      { href: "/teacher/assignments", label: t.nav.assignments, icon: "assignments" },
      { href: "/teacher/exams", label: t.nav.sessions, icon: "sessions" },
      { href: "/teacher/questions", label: t.nav.questions, icon: "questions" },
      { href: "/teacher/results", label: t.nav.results, icon: "results" },
      { href: "/teacher/analytics", label: t.nav.analytics, icon: "analytics" },
    ],
  };
  const content: NavGroup = {
    label: t.nav.curriculum,
    items: [
      { href: "/learn", label: t.nav.learn, icon: "learn" },
      { href: "/papers", label: t.nav.papers, icon: "papers" },
      { href: "/mock-exams", label: t.nav.mocks, icon: "mocks" },
    ],
  };
  const admin: NavGroup = {
    label: t.nav.administration,
    items: [
      { href: "/admin", label: t.nav.overview, icon: "dashboard" },
      { href: "/admin/users", label: t.nav.users, icon: "users" },
      { href: "/admin/classes", label: t.nav.classes, icon: "classes" },
      { href: "/admin/curriculum", label: t.nav.curriculum, icon: "curriculum" },
      { href: "/admin/settings", label: t.nav.settings, icon: "settings" },
      { href: "/admin/audit", label: t.nav.audit, icon: "audit" },
    ],
  };
  const profile: NavGroup = { items: [{ href: "/profile", label: t.nav.profile, icon: "profile" }] };

  if (role === "student") return [student];
  if (role === "teacher") return [teaching, content, profile];
  return [admin, teaching, content, profile];
}
