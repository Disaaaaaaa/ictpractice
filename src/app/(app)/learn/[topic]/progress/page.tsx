import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/curriculum";
import { masteryStatus, STATUS_TONE } from "@/lib/mastery";
import { formatDate, formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Table, Td, Th } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Topic progress" };

export default async function TopicProgressPage({ params }: PageProps<"/learn/[topic]/progress">) {
  const profile = await requireProfile();
  const topic = await getTopicBySlug((await params).topic);
  if (!topic) notFound();
  if (profile.role !== "student") {
    return <EmptyState title="Progress is shown to students">Teachers can see class progress in Analytics.</EmptyState>;
  }
  const supabase = await createClient();
  const loIds = topic.objectives.map((o) => o.id);
  const [{ data: rows }, { data: practice }, { data: sections }] = await Promise.all([
    supabase.from("student_mastery").select("*").eq("student_id", profile.id).in("learning_objective_id", loIds),
    supabase
      .from("practice_attempts")
      .select("awarded_mark, max_mark, created_at, questions!inner(title, topic_id)")
      .eq("student_id", profile.id)
      .eq("questions.topic_id", topic.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("theory_sections")
      .select("id, theory_packs!inner(topic_id), theory_progress(student_id)")
      .eq("theory_packs.topic_id", topic.id),
  ]);
  const by = new Map((rows ?? []).map((r) => [r.learning_objective_id as string, r]));
  const read = (sections ?? []).filter((s) => (s.theory_progress as { student_id: string }[]).some((p) => p.student_id === profile.id)).length;
  const totalSections = (sections ?? []).length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Learning objective mastery" description="Exam answers count for 70% and practice for 30% (most recent attempts weigh more)." />
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Objective</Th>
                <Th className="w-40">Mastery</Th>
                <Th>Practice</Th>
                <Th>Exam</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {topic.objectives.map((lo) => {
                const r = by.get(lo.id);
                const m = r ? Number(r.mastery) : null;
                const status = masteryStatus(m, !!r);
                return (
                  <tr key={lo.id}>
                    <Td>
                      <span className="font-mono text-xs font-semibold text-primary">{lo.code}</span>
                      <p className="text-sm">{lo.description}</p>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={m} label={`${lo.code} mastery`} />
                        <span className="w-10 text-right text-xs tabular-nums">{formatPercent(m)}</span>
                      </div>
                    </Td>
                    <Td className="text-xs tabular-nums text-muted">{r ? `${formatPercent(r.practice_score)} (${r.practice_count})` : "—"}</Td>
                    <Td className="text-xs tabular-nums text-muted">{r ? `${formatPercent(r.exam_score)} (${r.exam_count})` : "—"}</Td>
                    <Td><Badge tone={STATUS_TONE[status]}>{status}</Badge></Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader title="Theory" />
          <CardBody className="space-y-2">
            <p className="text-sm">{totalSections ? `${read} of ${totalSections} sections read` : "No theory pack yet"}</p>
            {totalSections > 0 && <ProgressBar value={(read / totalSections) * 100} tone="primary" label="Theory read" />}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Recent practice" />
          <CardBody>
            {(practice ?? []).length === 0 ? (
              <p className="text-sm text-muted">No practice answers checked yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {(practice ?? []).map((p, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate">{(p.questions as unknown as { title: string }).title}</span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {Number(p.awarded_mark)}/{Number(p.max_mark)} · {formatDate(p.created_at, false)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
