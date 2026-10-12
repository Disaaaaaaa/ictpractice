"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { formatClock, formatPercent } from "@/lib/format";
import type { AttemptStatus } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { AttemptStatusBadge } from "@/components/attempt-status";
import { ConfirmButton } from "@/components/action-form";
import { extendAttemptTime, forceSubmitAttempt, reopenAttempt, setTechnicalIssue, type ActionState } from "@/app/(app)/teacher/actions";
import { Button } from "@/components/ui/button";

export type MonitorAttempt = {
  id: string;
  student_id: string;
  status: AttemptStatus;
  started_at: string;
  deadline_at: string;
  submitted_at: string | null;
  current_question: number;
  answered_count: number;
  violation_count: number;
  last_heartbeat_at: string | null;
  is_online: boolean;
  percentage: number | null;
  assignment_id: string | null;
  /** the teacher marked a technical problem: nothing counts as a violation for this attempt */
  technical_issue: boolean;
};

export type MonitorStudent = { id: string; name: string };

const STALE_MS = 45_000;

/** "minutes + button" for the two per-student time controls. */
function MinutesForm({
  action,
  attemptId,
  label,
  options,
  defaultMinutes,
  confirm,
  ariaLabel,
}: {
  action: (prev: ActionState, data: FormData) => Promise<ActionState>;
  attemptId: string;
  label: string;
  options: number[];
  defaultMinutes: number;
  confirm?: (minutes: string) => string;
  ariaLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  return (
    <form
      action={formAction}
      className="flex items-center gap-1"
      onSubmit={(e) => {
        const minutes = String(new FormData(e.currentTarget).get("minutes"));
        if (confirm && !window.confirm(confirm(minutes))) e.preventDefault();
      }}
    >
      <input type="hidden" name="attempt_id" value={attemptId} />
      <select name="minutes" defaultValue={defaultMinutes} aria-label={ariaLabel}
        className="h-8 rounded-lg border border-border bg-surface px-1.5 text-sm">
        {options.map((m) => <option key={m} value={m}>{m} min</option>)}
      </select>
      <Button type="submit" variant="secondary" size="sm" disabled={pending}>{pending ? "…" : label}</Button>
      {state.error && <span role="alert" className="max-w-40 whitespace-normal text-left text-xs text-danger">{state.error}</span>}
    </form>
  );
}

/**
 * Live exam dashboard. Subscribes to attempt and integrity-event changes via
 * Supabase Realtime (RLS limits rows to the teacher's students) and falls back
 * to periodic refresh if the realtime channel is unavailable.
 */
export function LiveMonitor({
  examId,
  assignmentId,
  students,
  initial,
  questionCount,
}: {
  examId: string;
  assignmentId?: string | null;
  students: MonitorStudent[];
  initial: MonitorAttempt[];
  questionCount: number;
}) {
  const router = useRouter();
  // Realtime updates received since the last server render; reset whenever the server sends fresh data.
  const [base, setBase] = useState(initial);
  const [updates, setUpdates] = useState<Record<string, MonitorAttempt>>({});
  if (base !== initial) {
    setBase(initial);
    setUpdates({});
  }
  const attempts = useMemo(() => {
    const merged: Record<string, MonitorAttempt> = Object.fromEntries(initial.map((a) => [a.id, a]));
    for (const [id, row] of Object.entries(updates)) merged[id] = { ...merged[id], ...row };
    return merged;
  }, [initial, updates]);
  const [now, setNow] = useState(() => new Date(initial[0]?.started_at ?? 0).getTime());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const supabase = getBrowserClient();
    const channel = supabase
      .channel(`exam-monitor-${examId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "attempts", filter: `exam_id=eq.${examId}` }, (payload: { new: unknown }) => {
        const row = payload.new as MonitorAttempt;
        if (!row?.id) return;
        if (assignmentId && row.assignment_id !== assignmentId) return;
        setUpdates((prev) => ({ ...prev, [row.id]: row }));
      })
      .subscribe((status: string) => setConnected(status === "SUBSCRIBED"));
    const poll = setInterval(() => router.refresh(), 20_000);
    return () => {
      void supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [assignmentId, examId, router]);

  const latestByStudent = useMemo(() => {
    const m = new Map<string, MonitorAttempt>();
    for (const a of Object.values(attempts)) {
      const cur = m.get(a.student_id);
      if (!cur || new Date(a.started_at) > new Date(cur.started_at)) m.set(a.student_id, a);
    }
    return m;
  }, [attempts]);

  const active = [...latestByStudent.values()].filter((a) => a.status === "IN_PROGRESS" && new Date(a.deadline_at).getTime() > now);
  const rows = students
    .map((s) => ({ s, a: latestByStudent.get(s.id) }))
    .sort((x, y) => {
      const rank = (a?: MonitorAttempt) => (!a ? 3 : a.status === "IN_PROGRESS" ? 0 : a.status === "SUBMITTED" || a.status === "REVIEW_REQUIRED" ? 1 : 2);
      return rank(x.a) - rank(y.a) || x.s.name.localeCompare(y.s.name);
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-lg font-semibold">
          {active.length} / {students.length} students active
        </span>
        <Badge tone={connected ? "success" : "warning"}>{connected ? "Live" : "Refreshing every 20 s"}</Badge>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Student</Th><Th>Status</Th><Th>Current question</Th><Th>Elapsed</Th><Th>Answered</Th><Th>Violations</Th><Th>Connection</Th><Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ s, a }) => {
            const live = a?.status === "IN_PROGRESS" && new Date(a.deadline_at).getTime() > now;
            const online = live && a?.last_heartbeat_at && now - new Date(a.last_heartbeat_at).getTime() < STALE_MS && a.is_online;
            const elapsed = a ? ((a.submitted_at ? new Date(a.submitted_at).getTime() : now) - new Date(a.started_at).getTime()) / 1000 : 0;
            const remaining = a ? (new Date(a.deadline_at).getTime() - now) / 1000 : 0;
            return (
              <tr key={s.id} className={a && live && a.technical_issue ? "bg-info-soft/40" : a && a.violation_count > 0 && live ? "bg-danger-soft/40" : undefined}>
                <Td className="font-medium">{s.name}</Td>
                <Td>{a ? <AttemptStatusBadge status={a.status} /> : <Badge>Not started</Badge>}</Td>
                <Td className="tabular-nums">{a && live ? `Question ${a.current_question} / ${questionCount}` : "—"}</Td>
                <Td className="tabular-nums">
                  {a ? formatClock(elapsed) : "—"}
                  {live && <span className="ml-1 text-xs text-muted">({formatClock(remaining)} left)</span>}
                </Td>
                <Td className="tabular-nums">{a ? `${a.answered_count} / ${questionCount}` : "—"}</Td>
                <Td>
                  {!a ? "—" : a.technical_issue ? (
                    <Badge tone="info">Technical issue · not counted</Badge>
                  ) : a.violation_count > 0 ? (
                    <Badge tone="danger">{a.violation_count}</Badge>
                  ) : "0"}
                </Td>
                <Td>{live ? (online ? <Badge tone="success">Online</Badge> : <Badge tone="warning">Offline</Badge>) : "—"}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    {a && live && (
                      a.technical_issue ? (
                        <ConfirmButton action={setTechnicalIssue} fields={{ attempt_id: a.id, on: "0" }} label="End technical issue"
                          confirm={`Start counting violations for ${s.name} again?`} />
                      ) : (
                        <ConfirmButton action={setTechnicalIssue} fields={{ attempt_id: a.id, on: "1" }} label="Technical issue"
                          confirm={`Mark a technical issue for ${s.name}? Violations will not be counted for this student, and the ${a.violation_count} already counted will be excused.`} />
                      )
                    )}
                    {a && live && (
                      <MinutesForm action={extendAttemptTime} attemptId={a.id} label="Add time" ariaLabel={`Minutes to add for ${s.name}`}
                        options={[2, 5, 10, 15, 20, 30]} defaultMinutes={5} />
                    )}
                    {a && live && (
                      <ConfirmButton action={forceSubmitAttempt} fields={{ attempt_id: a.id }} label="Force submit" variant="danger" confirm={`Submit ${s.name}'s exam now?`} />
                    )}
                    {a && !live && (
                      <Link href={`/teacher/results/${a.id}`} className="self-center text-sm font-medium text-primary hover:underline">
                        {a.percentage != null ? formatPercent(a.percentage) : "Review"}
                      </Link>
                    )}
                    {a && !live && (
                      <MinutesForm action={reopenAttempt} attemptId={a.id} label="Reopen" ariaLabel={`Minutes to give ${s.name}`}
                        options={[5, 10, 15, 20, 30, 45]} defaultMinutes={10}
                        confirm={(m) => `Return ${s.name}'s work to "in progress" with ${m} minutes? The answers are kept and can be changed; the current marks of this attempt are deleted and it is marked again after the student submits.`} />
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
