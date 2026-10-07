import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { AppShell } from "@/components/shell/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await requireProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
}
