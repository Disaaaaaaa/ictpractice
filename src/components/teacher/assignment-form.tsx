"use client";
import { useMemo, useState } from "react";
import { ActionForm } from "@/components/action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { createAssignment } from "@/app/(app)/teacher/actions";

type Option = { id: string; label: string; group?: string };

export function AssignmentForm({
  classes,
  students,
  exams,
  topics,
  defaultClass,
  defaultExam,
}: {
  classes: Option[];
  students: Option[];
  exams: (Option & { kind: string })[];
  topics: Option[];
  defaultClass?: string;
  defaultExam?: string;
}) {
  const initialType = defaultExam ? (exams.find((e) => e.id === defaultExam)?.kind === "mock" ? "mock_exam" : "topic_exam") : "topic_exam";
  const [type, setType] = useState(initialType);
  const [mode, setMode] = useState("warn");
  const tz = useMemo(() => new Date().getTimezoneOffset(), []);
  const examOptions = exams.filter((e) => (type === "mock_exam" ? e.kind === "mock" : type === "topic_exam" ? e.kind !== "mock" : true));
  const needsExam = type === "topic_exam" || type === "mock_exam";

  return (
    <ActionForm action={createAssignment} submitLabel="Create assignment" pendingLabel="Creating…" className="space-y-6">
      <input type="hidden" name="tz_offset" value={tz} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="assignment_type">
          <Select id="assignment_type" name="assignment_type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="topic_exam">Topic Exam</option>
            <option value="mock_exam">Mock Exam</option>
            <option value="practice">Practice</option>
            <option value="revision">Revision</option>
          </Select>
        </Field>
        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" required maxLength={200} placeholder="e.g. SDLC topic test" />
        </Field>
      </div>

      {needsExam || type === "revision" ? (
        <Field label={needsExam ? "Exam" : "Exam (optional)"} htmlFor="exam_id">
          <Select id="exam_id" name="exam_id" defaultValue={defaultExam ?? ""} required={needsExam}>
            <option value="">Choose…</option>
            {examOptions.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </Select>
        </Field>
      ) : null}
      {!needsExam && (
        <Field label="Topic" htmlFor="topic_id">
          <Select id="topic_id" name="topic_id" defaultValue="">
            <option value="">Choose…</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </Select>
        </Field>
      )}

      <Field label="Instructions (optional)" htmlFor="instructions">
        <Textarea id="instructions" name="instructions" rows={3} />
      </Field>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Assign to classes</legend>
        <div className="flex flex-wrap gap-4">
          {classes.map((c) => (
            <Checkbox key={c.id} name="class_ids" value={c.id} defaultChecked={c.id === defaultClass} label={c.label} />
          ))}
          {classes.length === 0 && <p className="text-sm text-muted">You have no classes yet.</p>}
        </div>
      </fieldset>
      {students.length > 0 && (
        <details>
          <summary className="cursor-pointer text-sm font-medium">…or to individual students</summary>
          <div className="mt-2 grid max-h-60 gap-1 overflow-y-auto rounded-lg border border-border p-3 sm:grid-cols-2">
            {students.map((s) => (
              <Checkbox key={s.id} name="student_ids" value={s.id} label={s.label} />
            ))}
          </div>
        </details>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Available from" htmlFor="available_from" hint="Leave empty to open now.">
          <Input id="available_from" name="available_from" type="datetime-local" />
        </Field>
        <Field label="Deadline" htmlFor="deadline">
          <Input id="deadline" name="deadline" type="datetime-local" />
        </Field>
        {needsExam && (
          <>
            <Field label="Attempt limit" htmlFor="attempt_limit" hint="Empty = use the exam's limit.">
              <Input id="attempt_limit" name="attempt_limit" type="number" min={1} max={20} defaultValue={1} />
            </Field>
            <Field label="Time limit override (minutes)" htmlFor="duration_override_minutes" hint="Empty = the exam's duration.">
              <Input id="duration_override_minutes" name="duration_override_minutes" type="number" min={1} max={600} />
            </Field>
          </>
        )}
      </div>

      {needsExam && (
        <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
          <Field label="Integrity policy" htmlFor="integrity_mode">
            <Select id="integrity_mode" name="integrity_mode" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="monitor">Monitor only</option>
              <option value="warn">Warning</option>
              <option value="auto_submit">Auto-submit after N violations</option>
            </Select>
          </Field>
          <Field label="Maximum violations" htmlFor="max_violations" hint={mode === "auto_submit" ? "The exam submits automatically at this count." : "Shown to students in the warning."}>
            <Input id="max_violations" name="max_violations" type="number" min={1} max={50} defaultValue={3} />
          </Field>
          <div className="space-y-2 sm:col-span-2">
            <Checkbox name="show_results" defaultChecked label="Show results to students when marked" />
            <Checkbox name="show_mark_scheme" label="Show mark scheme and model answers with results" />
          </div>
          <Field label="Release results at (optional)" htmlFor="results_release_at" hint="Hide marks, feedback and mark scheme until this time.">
            <Input id="results_release_at" name="results_release_at" type="datetime-local" />
          </Field>
        </div>
      )}
      {!needsExam && (
        <>
          <input type="hidden" name="integrity_mode" value="monitor" />
          <input type="hidden" name="max_violations" value="3" />
          <input type="hidden" name="show_results" value="on" />
        </>
      )}
    </ActionForm>
  );
}
