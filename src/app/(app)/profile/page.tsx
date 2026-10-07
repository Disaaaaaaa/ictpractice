import type { Metadata } from "next";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStudentClasses } from "@/lib/student-data";
import { LOCALES } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChangePasswordForm } from "@/components/change-password-form";
import { setLocale } from "./actions";
import { ThemeSelector } from "@/components/theme-toggle";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const classes = profile.role === "student" ? await getStudentClasses(supabase, profile.id) : [];
  const rows: [string, string][] = [
    ["Name", displayName(profile)],
    ["Username", profile.username],
    ["Role", profile.role[0].toUpperCase() + profile.role.slice(1)],
    ...(profile.grade ? ([["Grade", String(profile.grade)]] as [string, string][]) : []),
    ...(classes.length
      ? ([["Class", classes.map((c) => `${c.name}${c.teacher ? ` (${c.teacher.first_name} ${c.teacher.last_name})` : ""}`).join(", ")]] as [string, string][])
      : []),
    ["Member since", formatDate(profile.created_at, false)],
  ];
  return (
    <>
      <PageHeader title="Profile" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Account" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-2">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <form action={setLocale} className="mt-6 flex items-end gap-2">
              <label className="flex-1 space-y-1 text-sm">
                <span className="font-medium">Interface language</span>
                <Select name="locale" defaultValue={profile.locale}>
                  {LOCALES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </Select>
              </label>
              <Button type="submit" variant="secondary">Save</Button>
            </form>
            <p className="mt-2 text-xs text-muted">Learning content and exams remain in English.</p>
            <div className="mt-6 space-y-1.5">
              <p className="text-sm font-medium">Theme</p>
              <ThemeSelector />
              <p className="text-xs text-muted">“System” follows your device setting. Saved in this browser.</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Change password" />
          <CardBody>
            <ChangePasswordForm stay />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
