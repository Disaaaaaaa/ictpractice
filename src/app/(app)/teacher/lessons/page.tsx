import type { Metadata } from "next";
import Link from "next/link";
import { Play, Radio } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSchoolTree, mainPlans } from "@/lib/curriculum";
import { getTeacherClasses } from "@/lib/teacher-data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { LivePlan } from "@/lib/live-plan";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { startLesson } from "./actions";

export const metadata: Metadata = { title: "Lessons" };

export default async function TeacherLessonsPage({ searchParams }: PageProps<"/teacher/lessons">) {
  const profile = await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const supabase = await createClient();
  const [classes, tree] = await Promise.all([getTeacherClasses(supabase, profile, true), getSchoolTree()]);
  const header = (
    <PageHeader
      title="Lessons"
      description="Teach a lesson live: present the theory as slides, open the tasks step by step and watch the class's answers. Pairs and groups are formed at random."
    />
  );
  if (!classes.length) return <>{header}<EmptyState title="No classes yet">Lessons are taught class by class.</EmptyState></>;
  const cls = classes.find((c) => c.id === sp.class) ?? classes[0];

  const plan = mainPlans(tree).find((g) => g.grade === cls.grade);
  const topics = (plan?.terms ?? []).flatMap((t) => t.units.flatMap((u) => u.topics.map((tp) => ({ ...tp, unit: `${u.code} ${u.title}`, term: t.title }))));
  const ids = topics.map((t) => t.id).concat("00000000-0000-0000-0000-000000000000");
  const [{ data: plans }, { data: sessions }] = await Promise.all([
    supabase.from("lesson_plans").select("topic_id, lesson_no, plan").in("topic_id", ids).order("lesson_no"),
    supabase.from("live_sessions").select("id, topic_id, lesson_no, started_at, ended_at").eq("class_id", cls.id).order("started_at", { ascending: false }).limit(10),
  ]);
  const active = (sessions ?? []).find((s) => !s.ended_at);
  const rows = ((plans ?? []) as { topic_id: string; lesson_no: number; plan: LivePlan }[])
    .map((p) => ({ ...p, topic: topics.find((t) => t.id === p.topic_id)! }))
    .filter((p) => p.topic)
    .sort((a, b) => topics.indexOf(a.topic) - topics.indexOf(b.topic) || a.lesson_no - b.lesson_no);
  const titleOf = (topicId: string, n: number) => {
    const r = rows.find((x) => x.topic_id === topicId && x.lesson_no === n);
    return r ? `${r.topic.title} · Lesson ${n}` : `Lesson ${n}`;
  };

  return (
    <>
      {header}
      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Class">
        {classes.map((c) => (
          <Link key={c.id} href={`/teacher/lessons?class=${c.id}`} aria-current={c.id === cls.id ? "page" : undefined}
            className={cn("rounded-full border px-3 py-1 text-sm", c.id === cls.id ? "border-primary bg-primary text-primary-fg" : "border-border hover:bg-surface-2")}>
            {c.name}
          </Link>
        ))}
      </nav>

      {active && (
        <Card className="mb-6 border-primary">
          <CardBody className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-medium"><Radio className="h-4 w-4 text-danger" /> Lesson in progress: {titleOf(active.topic_id, active.lesson_no)}</p>
            <ButtonLink href={`/teacher/lessons/${active.id}`}>Continue the lesson</ButtonLink>
          </CardBody>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState title="No lesson plans yet">A lesson appears here once its ҚМЖ is uploaded (npm run kmzh:apply).</EmptyState>
      ) : (
        <Card>
          <CardHeader title={`Lesson plans · ${cls.name}`} description="Starting a lesson opens it for every student in the class; a lesson already running in the class is ended." />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={`${r.topic_id}-${r.lesson_no}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{r.topic.title} <span className="text-muted">· Lesson {r.lesson_no}: {r.plan.title}</span></p>
                    <p className="text-xs text-muted">{r.topic.unit} · {r.plan.minutes} min · {r.plan.stages.reduce((n, s) => n + s.blocks.length, 0)} steps</p>
                  </div>
                  <form action={startLesson}>
                    <input type="hidden" name="class_id" value={cls.id} />
                    <input type="hidden" name="topic_id" value={r.topic_id} />
                    <input type="hidden" name="lesson_no" value={r.lesson_no} />
                    <Button type="submit" size="sm"><Play className="h-4 w-4" /> Start lesson</Button>
                  </form>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {(sessions ?? []).some((s) => s.ended_at) && (
        <Card className="mt-6">
          <CardHeader title="Recent lessons" />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {(sessions ?? []).filter((s) => s.ended_at).map((s) => (
                <li key={s.id}>
                  <Link href={`/teacher/lessons/${s.id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-2">
                    <span className="flex-1">{titleOf(s.topic_id, s.lesson_no)}</span>
                    <span className="text-muted">{formatDate(s.started_at)}</span>
                    <Badge>results</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </>
  );
}
