import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveVersion } from "@/lib/curriculum";
import { DIFFICULTIES, DIFFICULTY_LABELS, QUESTION_TYPES, QUESTION_TYPE_LABELS, CONTENT_STATUSES, type QuestionType, type Difficulty } from "@/lib/questions/types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge, type Tone } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Question Bank" };

const STATUS_TONE: Record<string, Tone> = { draft: "neutral", review: "warning", published: "success", archived: "neutral" };

export default async function QuestionBankPage({ searchParams }: PageProps<"/teacher/questions">) {
  await requireProfile(["teacher", "admin"]);
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const f = { q: get("q"), topic: get("topic"), type: get("type"), difficulty: get("difficulty"), status: get("status"), paper: get("paper"), source: get("source") };
  const supabase = await createClient();
  const version = await getActiveVersion();
  const { data: topics } = await supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").order("sort_order");

  let query = supabase
    .from("questions")
    .select("id, title, question_type, marks, difficulty, command_word, grading_method, status, practice_enabled, source_type, updated_at, topics(title), paper_components!inner(number), parts:questions!questions_parent_id_fkey(count)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .limit(300);
  if (!f.paper) query = supabase
    .from("questions")
    .select("id, title, question_type, marks, difficulty, command_word, grading_method, status, practice_enabled, source_type, updated_at, topics(title), paper_components(number), parts:questions!questions_parent_id_fkey(count)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .limit(300);
  else query = query.eq("paper_components.number", Number(f.paper));
  query = query.is("parent_id", null); // parts are listed on their structured question
  if (f.q) query = query.ilike("title", `%${f.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
  if (f.topic) query = query.eq("topic_id", f.topic);
  if (f.type) query = query.eq("question_type", f.type);
  if (f.difficulty) query = query.eq("difficulty", f.difficulty);
  if (f.status) query = query.eq("status", f.status);
  else query = query.neq("status", "archived");
  if (f.source) query = query.eq("source_type", f.source);
  const { data, count } = await query;
  type Row = {
    id: string; title: string; question_type: QuestionType; marks: number; difficulty: Difficulty; grading_method: string;
    status: string; practice_enabled: boolean; source_type: string; topics: { title: string } | null; paper_components: { number: number } | null;
    parts: { count: number }[];
  };
  const rows = (data ?? []) as unknown as Row[];

  return (
    <>
      <PageHeader title="Question Bank" description={`${count ?? rows.length} questions`} actions={<ButtonLink href="/teacher/questions/new">New question</ButtonLink>} />
      <Card>
        <CardBody>
          <form className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
            <Input name="q" defaultValue={f.q} placeholder="Search title" aria-label="Search" className="lg:col-span-2" />
            <Select name="topic" defaultValue={f.topic} aria-label="Topic">
              <option value="">All topics</option>
              {(topics ?? []).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </Select>
            <Select name="paper" defaultValue={f.paper} aria-label="Paper">
              <option value="">All papers</option><option value="1">Paper 1</option><option value="2">Paper 2</option><option value="3">Paper 3</option>
            </Select>
            <Select name="type" defaultValue={f.type} aria-label="Type">
              <option value="">All types</option>
              {QUESTION_TYPES.map((t) => <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>)}
            </Select>
            <Select name="difficulty" defaultValue={f.difficulty} aria-label="Difficulty">
              <option value="">Any difficulty</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
            </Select>
            <Select name="status" defaultValue={f.status} aria-label="Status">
              <option value="">Not archived</option>
              {CONTENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Button type="submit">Filter</Button>
          </form>
        </CardBody>
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>Question</Th><Th>Type</Th><Th>Marks</Th><Th>Difficulty</Th><Th>Marking</Th><Th>Paper</Th><Th>Status</Th></tr></thead>
            <tbody>
              {rows.map((q) => (
                <tr key={q.id}>
                  <Td>
                    <Link href={`/teacher/questions/${q.id}`} className="font-medium hover:underline">{q.title}</Link>
                    <p className="text-xs text-muted">{q.topics?.title ?? "No topic"}{!q.practice_enabled && " · exam-only"}{q.source_type === "mock" && " · mock"}{q.question_type === "structured" && ` · ${q.parts?.[0]?.count ?? 0} parts`}</p>
                  </Td>
                  <Td className="text-xs">{QUESTION_TYPE_LABELS[q.question_type]}</Td>
                  <Td className="tabular-nums">{q.marks}</Td>
                  <Td className="text-xs">{DIFFICULTY_LABELS[q.difficulty]}</Td>
                  <Td><Badge tone={q.grading_method === "AI" ? "info" : q.grading_method === "AUTO" ? "primary" : "neutral"}>{q.grading_method}</Badge></Td>
                  <Td className="text-xs">{q.paper_components ? `P${q.paper_components.number}` : "—"}</Td>
                  <Td><Badge tone={STATUS_TONE[q.status]}>{q.status}</Badge></Td>
                </tr>
              ))}
              {rows.length === 0 && <tr><Td colSpan={7} className="py-8 text-center text-muted">No questions match these filters.</Td></tr>}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
