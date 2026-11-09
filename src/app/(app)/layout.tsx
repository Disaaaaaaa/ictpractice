import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { AppShell } from "@/components/shell/app-shell";
import { LessonWatcher } from "@/components/live/lesson-watcher";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await requireProfile();
  return (
    <AppShell profile={profile}>
      {profile.role === "student" && <LessonWatcher />}
      {children}
    </AppShell>
  );
}
