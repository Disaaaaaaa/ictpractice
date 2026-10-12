"use client";
import { useMemo } from "react";
import { ActionForm } from "@/components/action-form";
import { Field, Input } from "@/components/ui/form";
import { updateAssignmentDeadlines } from "@/app/(app)/teacher/actions";

function toLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

/** Lets the teacher move the deadlines of a topic assignment. */
export function AssignmentDeadlinesForm({
  assignmentId,
  deadline,
  theoryDeadline,
  practiceDeadline,
  hasExam,
}: {
  assignmentId: string;
  deadline: string | null;
  theoryDeadline: string | null;
  practiceDeadline: string | null;
  hasExam: boolean;
}) {
  const tz = useMemo(() => new Date().getTimezoneOffset(), []);
  return (
    <ActionForm action={updateAssignmentDeadlines} submitLabel="Save deadlines" pendingLabel="Saving…">
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <input type="hidden" name="tz_offset" value={tz} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Theory" htmlFor="theory_deadline" hint="Empty = the final deadline.">
          <Input id="theory_deadline" name="theory_deadline" type="datetime-local" defaultValue={toLocal(theoryDeadline)} />
        </Field>
        <Field label="Practice" htmlFor="practice_deadline" hint="Empty = the final deadline.">
          <Input id="practice_deadline" name="practice_deadline" type="datetime-local" defaultValue={toLocal(practiceDeadline)} />
        </Field>
        <Field label={hasExam ? "Final deadline (exam)" : "Final deadline"} htmlFor="deadline">
          <Input id="deadline" name="deadline" type="datetime-local" defaultValue={toLocal(deadline)} required />
        </Field>
      </div>
    </ActionForm>
  );
}
