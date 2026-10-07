import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui/page-header";
import { Stat } from "@/components/ui/stat";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { relativeTime } from "@/lib/format";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminHome() {
  await requireProfile(["admin"]);
  const supabase = await createClient();
  const version = await getActiveVersion();
  const head = { count: "exact" as const, head: true };
  const n = (p: PromiseLike<{ count: number | null }>) => Promise.resolve(p).then((r) => r.count ?? 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [students, teachers, classes, topics, packs, questions, exams, attemptsToday, live, { data: logs }] = await Promise.all([
    n(supabase.from("profiles").select("id", head).eq("role", "student")),
    n(supabase.from("profiles").select("id", head).in("role", ["teacher", "admin"])),
    n(supabase.from("classes").select("id", head).is("archived_at", null)),
    n(supabase.from("topics").select("id", head).eq("curriculum_version_id", version?.id ?? "")),
    n(supabase.from("theory_packs").select("id", head).eq("status", "published")),
    n(supabase.from("questions").select("id", head).eq("status", "published")),
    n(supabase.from("exams").select("id", head).in("status", ["published", "scheduled"])),
    n(supabase.from("attempts").select("id", head).gte("started_at", today.toISOString())),
    n(supabase.from("attempts").select("id", head).eq("status", "IN_PROGRESS")),
    supabase.from("audit_logs").select("id, action, entity_type, created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const links = [
    { href: "/admin/users", title: "Users", text: "Create students and teachers, CSV import, reset passwords, disable accounts." },
    { href: "/admin/classes", title: "Classes", text: "All classes and their teachers." },
    { href: "/admin/curriculum", title: "Curriculum", text: "Topics, learning objectives, school and paper mapping, theory packs." },
    { href: "/teacher/questions", title: "Question Bank", text: "Create, edit, publish and archive questions." },
    { href: "/teacher/exams?kind=mock", title: "Mock Exams", text: "Build, version and publish mock papers by year." },
    { href: "/admin/settings", title: "System Settings", text: "Mastery weights, AI marking threshold, exam tolerances." },
    { href: "/admin/audit", title: "Audit Logs", text: "Account, exam, marking and settings changes." },
  ];
  return (
    <>
      <PageHeader title="Administration" description={version ? `Active curriculum: ${version.title}` : "No active curriculum"} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Students" value={students} />
        <Stat label="Teachers & admins" value={teachers} />
        <Stat label="Classes" value={classes} />
        <Stat label="Live exams" value={live} sub={`${attemptsToday} started today`} />
        <Stat label="Topics" value={topics} sub={`${packs} published theory packs`} />
        <Stat label="Published questions" value={questions} />
        <Stat label="Published exams" value={exams} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-border bg-surface p-5 hover:border-primary/40 hover:bg-surface-2">
              <p className="font-semibold">{l.title}</p>
              <p className="mt-1 text-sm text-muted">{l.text}</p>
            </Link>
          ))}
        </div>
        <Card>
          <CardHeader title="Recent activity" action={<Link href="/admin/audit" className="text-sm font-medium text-primary hover:underline">All</Link>} />
          <CardBody className="space-y-2 text-sm">
            {(logs ?? []).map((l) => (
              <div key={l.id} className="flex justify-between gap-2"><span className="font-mono text-xs">{l.action}</span><span className="text-xs text-muted">{relativeTime(l.created_at)}</span></div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
