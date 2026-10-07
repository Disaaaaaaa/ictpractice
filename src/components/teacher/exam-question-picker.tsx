"use client";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, type Difficulty, type QuestionType } from "@/lib/questions/types";
import { setExamQuestions, type ExamActionState } from "@/app/(app)/teacher/exams/actions";

export type BankItem = {
  id: string;
  title: string;
  question_type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  topic_id: string | null;
  topic_title: string | null;
  paper: number | null;
  status: string;
  practice_enabled: boolean;
};
export type SelectedItem = { question_id: string; marks_override: number | null; section_label: string | null };

export function ExamQuestionPicker({
  examId,
  bank,
  initial,
  readOnly,
}: {
  examId: string;
  bank: BankItem[];
  initial: SelectedItem[];
  readOnly: boolean;
}) {
  const [items, setItems] = useState<SelectedItem[]>(initial);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [paper, setPaper] = useState("");
  const [result, setResult] = useState<ExamActionState>({});
  const [pending, start] = useTransition();
  const byId = useMemo(() => new Map(bank.map((b) => [b.id, b])), [bank]);
  const topics = useMemo(() => [...new Map(bank.filter((b) => b.topic_id).map((b) => [b.topic_id!, b.topic_title ?? ""])).entries()].sort((a, b) => a[1].localeCompare(b[1])), [bank]);
  const chosen = new Set(items.map((i) => i.question_id));
  const filtered = bank.filter(
    (b) =>
      !chosen.has(b.id) &&
      (!topic || b.topic_id === topic) &&
      (!paper || String(b.paper) === paper) &&
      (!q || b.title.toLowerCase().includes(q.toLowerCase())),
  );
  const total = items.reduce((s, i) => s + (i.marks_override ?? byId.get(i.question_id)?.marks ?? 0), 0);
  const dirty = JSON.stringify(items) !== JSON.stringify(initial);

  const move = (i: number, d: number) =>
    setItems((list) => {
      const next = [...list];
      const j = i + d;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">In this exam ({items.length} questions · {total} marks)</h3>
          {!readOnly && (
            <Button onClick={() => start(async () => setResult(await setExamQuestions(examId, items)))} disabled={pending || !dirty}>
              {pending ? "Saving…" : "Save question list"}
            </Button>
          )}
        </div>
        {result.error && <Alert tone="danger">{result.error}</Alert>}
        {result.ok && !dirty && <Alert tone="success">{result.message}</Alert>}
        <ol className="space-y-2">
          {items.map((it, i) => {
            const b = byId.get(it.question_id);
            return (
              <li key={it.question_id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
                <span className="w-6 text-sm font-semibold tabular-nums">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b?.title ?? "Unknown question"}</p>
                  <p className="text-xs text-muted">
                    {b ? `${QUESTION_TYPE_LABELS[b.question_type]} · ${b.topic_title ?? "—"}` : ""}
                    {b && b.status !== "published" && <Badge tone="warning" className="ml-2">{b.status}</Badge>}
                  </p>
                </div>
                <Input
                  className="h-8 w-20"
                  type="number"
                  min={0}
                  aria-label="Marks"
                  disabled={readOnly}
                  placeholder={String(b?.marks ?? "")}
                  value={it.marks_override ?? ""}
                  onChange={(e) => setItems((l) => l.map((x, j) => (j === i ? { ...x, marks_override: e.target.value === "" ? null : Number(e.target.value) } : x)))}
                />
                <Input
                  className="h-8 w-28"
                  aria-label="Section label"
                  placeholder="Section"
                  disabled={readOnly}
                  value={it.section_label ?? ""}
                  onChange={(e) => setItems((l) => l.map((x, j) => (j === i ? { ...x, section_label: e.target.value || null } : x)))}
                />
                {!readOnly && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setItems((l) => l.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
              </li>
            );
          })}
          {items.length === 0 && <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">Add questions from the bank.</p>}
        </ol>
      </div>
      {!readOnly && (
        <div className="space-y-3">
          <h3 className="font-semibold">Question bank</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            <Input placeholder="Search title" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search questions" />
            <Select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
              <option value="">All topics</option>
              {topics.map(([id, t]) => <option key={id} value={id}>{t}</option>)}
            </Select>
            <Select value={paper} onChange={(e) => setPaper(e.target.value)} aria-label="Paper">
              <option value="">All papers</option>
              <option value="1">Paper 1</option><option value="2">Paper 2</option><option value="3">Paper 3</option>
            </Select>
          </div>
          <ul className="max-h-[36rem] space-y-1.5 overflow-y-auto">
            {filtered.slice(0, 200).map((b) => (
              <li key={b.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-muted">
                    {b.marks} marks · {QUESTION_TYPE_LABELS[b.question_type]} · {DIFFICULTY_LABELS[b.difficulty]} · {b.topic_title ?? "—"}
                    {!b.practice_enabled && " · exam-only"}
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setItems((l) => [...l, { question_id: b.id, marks_override: null, section_label: null }])}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </li>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted">No matching questions.</p>}
          </ul>
        </div>
      )}
    </div>
  );
}
