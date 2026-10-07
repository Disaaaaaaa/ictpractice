import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Clock, FileQuestion, GraduationCap } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMasteryMap, getTopicBySlug } from "@/lib/curriculum";
import { masteryStatus, STATUS_TONE } from "@/lib/mastery";
import { loAverage } from "@/lib/progress";
import { formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { LoCode } from "@/components/lo-code";
import { Alert } from "@/components/ui/alert";

export async function generateMetadata({ params }: PageProps<"/learn/[topic]">): Promise<Metadata> {
  const topic = await getTopicBySlug((await params).topic);
  return { title: topic?.title ?? "Topic" };
}

export default async function TopicOverview({ params }: PageProps<"/learn/[topic]">) {
  const profile = await requireProfile();
  const topic = await getTopicBySlug((await params).topic);
  if (!topic) notFound();
  const supabase = await createClient();
  const isStudent = profile.role === "student";
  const [mastery, { count: questionCount }, { data: pack }, { data: exam }] = await Promise.all([
    isStudent ? getMasteryMap(supabase, profile.id) : Promise.resolve(new Map<string, number>()),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("topic_id", topic.id).eq("status", "published").eq("practice_enabled", true),
    supabase.from("theory_packs").select("id, theory_sections(id)").eq("topic_id", topic.id).eq("status", "published").maybeSingle(),
    supabase.from("exams").select("id, duration_minutes").eq("topic_id", topic.id).eq("kind", "topic").eq("status", "published").limit(1).maybeSingle(),
  ]);
  const loIds = topic.objectives.map((o) => o.id);
  const attempted = loIds.some((id) => mastery.has(id));
  const value = loAverage(loIds, mastery);
  const status = masteryStatus(value, attempted);
  const sections = (pack as { theory_sections: { id: string }[] } | null)?.theory_sections.length ?? 0;
  const base = `/learn/${topic.slug}`;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {topic.examOnly && (
          <Alert tone="warning" title="Exam-only topic">
            These objectives are assessed in the exam (Paper 1-2-3 specification) but are not part of the 2026-2027 calendar plan.
          </Alert>
        )}
        <Card>
          <CardHeader title="Learning objectives" description="What you should be able to do after this topic." />
          <CardBody className="space-y-3">
            {topic.objectives.map((lo) => {
              const m = mastery.get(lo.id);
              return (
                <div key={lo.id} className="flex flex-wrap items-start gap-3 rounded-lg border border-border p-3">
                  <span className="rounded bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary"><LoCode code={lo.code} paper={lo.paper} /></span>
                  <p className="min-w-0 flex-1 text-sm">{lo.description}</p>
                  {isStudent && <Badge tone={STATUS_TONE[masteryStatus(m, m != null)]}>{m == null ? "Not Started" : formatPercent(m)}</Badge>}
                </div>
              );
            })}
          </CardBody>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link href={`${base}/theory`} className="rounded-xl border border-border bg-surface p-4 hover:bg-surface-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="mt-2 font-semibold">Theory Pack</p>
            <p className="text-sm text-muted">{sections ? `${sections} sections` : "Coming soon"}</p>
          </Link>
          <Link href={`${base}/practice`} className="rounded-xl border border-border bg-surface p-4 hover:bg-surface-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            <p className="mt-2 font-semibold">Practice</p>
            <p className="text-sm text-muted">{questionCount ?? 0} questions with feedback</p>
          </Link>
          <Link href={`${base}/exam`} className="rounded-xl border border-border bg-surface p-4 hover:bg-surface-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <p className="mt-2 font-semibold">Exam Mode</p>
            <p className="text-sm text-muted">{exam ? `Timed · ${exam.duration_minutes} min` : "Not available yet"}</p>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Topic details" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              {topic.examOnly && <Row label="Programme" value="Exam only (Paper 1-2-3)" />}
              {topic.school.map((s, i) => (
                <div key={i} className="space-y-3">
                  <Row label="Grade" value={String(s.grade)} />
                  <Row label="Term" value={s.term} />
                  <Row label="Unit" value={`${s.unitCode} ${s.unitTitle}`} />
                  {s.period && <Row label="Taught" value={s.period} />}
                </div>
              ))}
              <Row
                label="Paper component"
                value={
                  topic.exam.length
                    ? topic.exam.map((e) => `${e.paperTitle} — ${e.sectionCode ? `${e.sectionCode} ` : ""}${e.section}`).join("; ")
                    : "—"
                }
              />
              <Row
                label="Recommended study time"
                value={
                  topic.recommended_minutes ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {Math.round(topic.recommended_minutes / 60 * 10) / 10} h
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
            </dl>
          </CardBody>
        </Card>
        {isStudent && (
          <Card>
            <CardHeader title="Topic status" />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge tone={STATUS_TONE[status]}>{status}</Badge>
                <span className="text-2xl font-semibold tabular-nums">{formatPercent(attempted ? value : null)}</span>
              </div>
              <ProgressBar value={attempted ? value : 0} label="Topic mastery" />
              <ButtonLink href={sections ? `${base}/theory` : `${base}/practice`} className="w-full">
                {attempted ? "Keep practising" : "Start this topic"}
              </ButtonLink>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
