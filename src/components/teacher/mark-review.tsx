"use client";
import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form";
import { reviewMark, type ActionState } from "@/app/(app)/teacher/actions";

/** Accept / change mark / add feedback / request regrade for one answer. */
export function MarkReview({
  resultId,
  attemptId,
  max,
  awarded,
  needsReview,
  teacherFeedback,
}: {
  resultId: string;
  attemptId: string;
  max: number;
  awarded: number | null;
  needsReview: boolean;
  teacherFeedback: string | null;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(reviewMark, {});
  const [mode, setMode] = useState<"none" | "override" | "feedback">(awarded === null ? "override" : "none");
  return (
    <form action={action} className="space-y-3 rounded-lg border border-border bg-surface-2 p-4">
      <input type="hidden" name="result_id" value={resultId} />
      <input type="hidden" name="attempt_id" value={attemptId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.ok && <Alert tone="success">{state.message}</Alert>}
      {mode === "override" && (
        <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Mark (0–{max})</span>
            <Input name="mark" type="number" min={0} max={max} step={1} defaultValue={awarded ?? ""} required />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Reason (logged)</span>
            <Input name="reason" required placeholder="e.g. valid alternative point not in scheme" />
          </label>
        </div>
      )}
      {mode !== "none" && (
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Feedback to student</span>
          <Textarea name="feedback" rows={2} defaultValue={teacherFeedback ?? ""} />
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {mode === "none" ? (
          <>
            {needsReview && awarded !== null && (
              <Button type="submit" name="action" value="accept" size="sm" variant="success" disabled={pending}>Accept AI mark</Button>
            )}
            <Button size="sm" variant="secondary" onClick={() => setMode("override")}>Change mark</Button>
            <Button size="sm" variant="secondary" onClick={() => setMode("feedback")}>Add feedback</Button>
            <Button type="submit" name="action" value="regrade_request" size="sm" variant="ghost" disabled={pending}>Request regrade</Button>
          </>
        ) : (
          <>
            <Button type="submit" name="action" value={mode} size="sm" disabled={pending}>{pending ? "Saving…" : mode === "override" ? "Save mark" : "Save feedback"}</Button>
            {awarded !== null && <Button size="sm" variant="ghost" onClick={() => setMode("none")}>Cancel</Button>}
          </>
        )}
      </div>
    </form>
  );
}
