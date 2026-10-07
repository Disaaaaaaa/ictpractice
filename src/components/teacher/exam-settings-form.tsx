"use client";
import { useActionState, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { saveExam, type ExamActionState } from "@/app/(app)/teacher/exams/actions";
import type { Exam } from "@/lib/db-types";

function toLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export function ExamSettingsForm({
  exam,
  topics,
  paperNumber,
  readOnly = false,
}: {
  exam?: Exam;
  topics: { id: string; title: string }[];
  paperNumber?: number | null;
  readOnly?: boolean;
}) {
  const [state, action, pending] = useActionState<ExamActionState, FormData>(saveExam, {});
  const [kind, setKind] = useState(exam?.kind ?? "custom");
  const tz = useMemo(() => new Date().getTimezoneOffset(), []);
  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.ok && <Alert tone="success">{state.message}</Alert>}
      <input type="hidden" name="tz_offset" value={tz} />
      {exam && <input type="hidden" name="exam_id" value={exam.id} />}
      <fieldset disabled={readOnly} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="title"><Input id="title" name="title" defaultValue={exam?.title} required /></Field>
          <Field label="Type" htmlFor="kind">
            <Select id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value as Exam["kind"])}>
              <option value="topic">Topic exam</option>
              <option value="mock">Mock exam</option>
              <option value="revision">Revision</option>
              <option value="custom">Custom exam</option>
            </Select>
          </Field>
          {kind === "topic" && (
            <Field label="Topic" htmlFor="topic_id">
              <Select id="topic_id" name="topic_id" defaultValue={exam?.topic_id ?? ""}>
                <option value="">—</option>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </Select>
            </Field>
          )}
          <Field label="Paper" htmlFor="paper" hint={kind === "mock" ? "Required for mock exams." : undefined}>
            <Select id="paper" name="paper" defaultValue={paperNumber ? String(paperNumber) : ""}>
              <option value="">—</option>
              <option value="1">Paper 1</option>
              <option value="2">Paper 2</option>
              <option value="3">Paper 3</option>
            </Select>
          </Field>
          {kind === "mock" && (
            <Field label="Year" htmlFor="year"><Input id="year" name="year" type="number" min={2000} max={2100} defaultValue={exam?.year ?? new Date().getFullYear()} /></Field>
          )}
          <Field label="Grade" htmlFor="grade">
            <Select id="grade" name="grade" defaultValue={exam?.grade ? String(exam.grade) : ""}>
              <option value="">Any</option><option value="11">11</option><option value="12">12</option>
            </Select>
          </Field>
          <Field label="Duration (minutes)" htmlFor="duration_minutes">
            <Input id="duration_minutes" name="duration_minutes" type="number" min={1} max={600} defaultValue={exam?.duration_minutes ?? 45} required />
          </Field>
          <Field label="Attempt limit" htmlFor="attempt_limit" hint="Empty = unlimited.">
            <Input id="attempt_limit" name="attempt_limit" type="number" min={1} max={50} defaultValue={exam?.attempt_limit ?? ""} />
          </Field>
          <Field label="Available from" htmlFor="availability_start"><Input id="availability_start" name="availability_start" type="datetime-local" defaultValue={toLocal(exam?.availability_start)} /></Field>
          <Field label="Available until" htmlFor="availability_end"><Input id="availability_end" name="availability_end" type="datetime-local" defaultValue={toLocal(exam?.availability_end)} /></Field>
        </div>
        <Field label="Description" htmlFor="description"><Textarea id="description" name="description" rows={2} defaultValue={exam?.description ?? ""} /></Field>
        <Field label="Instructions shown before the exam (Markdown)" htmlFor="instructions"><Textarea id="instructions" name="instructions" rows={3} defaultValue={exam?.instructions ?? ""} /></Field>
        <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
          <Field label="Integrity policy" htmlFor="integrity_mode">
            <Select id="integrity_mode" name="integrity_mode" defaultValue={exam?.integrity_mode ?? "warn"}>
              <option value="monitor">Monitor only</option>
              <option value="warn">Warning</option>
              <option value="auto_submit">Auto-submit after N violations</option>
            </Select>
          </Field>
          <Field label="Maximum violations" htmlFor="max_violations"><Input id="max_violations" name="max_violations" type="number" min={1} max={50} defaultValue={exam?.max_violations ?? 3} /></Field>
          <div className="space-y-2 sm:col-span-2">
            <Checkbox name="require_fullscreen" defaultChecked={exam?.require_fullscreen ?? true} label="Require fullscreen (exits are recorded)" />
            <Checkbox name="show_results" defaultChecked={exam?.show_results ?? true} label="Show results to students when marked" />
            <Checkbox name="show_mark_scheme" defaultChecked={exam?.show_mark_scheme ?? false} label="Show mark scheme and model answers with results" />
          </div>
          <Field label="Release results at (optional)" htmlFor="results_release_at"><Input id="results_release_at" name="results_release_at" type="datetime-local" defaultValue={toLocal(exam?.results_release_at)} /></Field>
        </div>
      </fieldset>
      {!readOnly && <Button type="submit" disabled={pending}>{pending ? "Saving…" : exam ? "Save settings" : "Create exam"}</Button>}
    </form>
  );
}
