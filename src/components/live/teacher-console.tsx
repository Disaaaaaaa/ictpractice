"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Crown, Eye, EyeOff, Lock, MonitorPlay, Shuffle, Unlock, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { blocksOf, type LiveBlock, type LivePlan, type LiveState } from "@/lib/live-plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { closeBlock, endLesson, openBlock, regroup, toggleReveal } from "@/app/(app)/teacher/lessons/actions";

export type ConsoleQuestion = { id: string; title: string; type: string; marks: number; options: { key: string; content: string }[]; correct: string[] };
export type ConsoleAnswer = { block_id: string; item: string; student_id: string; members: string[]; selected: string | string[] | null; awarded: number | null; max: number | null; needs_review: boolean };

const MODE: Record<LiveBlock["mode"], string> = { class: "Whole class", individual: "Individual", pair: "Pairs", group: "Groups" };

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function TeacherConsole({
  sessionId,
  plan,
  state,
  startedAt,
  ended,
  endedAt = null,
  names,
  present,
  classSize,
  questions,
  answers,
}: {
  sessionId: string;
  plan: LivePlan;
  state: LiveState;
  startedAt: string;
  ended: boolean;
  endedAt?: string | null;
  names: Record<string, string>;
  /** students seen in the last minutes */
  present: string[];
  classSize: number;
  questions: Record<string, ConsoleQuestion>;
  answers: ConsoleAnswer[];
}) {
  const now = useNow();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (fn: () => Promise<{ ok: boolean; error?: string } | void>) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r && !r.ok) setError(r.error ?? "Something went wrong.");
    });
  const open = new Set(state.open ?? []);
  const revealed = new Set(state.revealed ?? []);
  const elapsed = (endedAt ? new Date(endedAt).getTime() : now) - new Date(startedAt).getTime();
  // minute at which each block starts
  const startOf = new Map<string, number>();
  blocksOf(plan).reduce((t, b) => (startOf.set(b.id, t), t + b.minutes), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-surface-2 px-3 py-1.5 font-mono text-lg tabular-nums" title="Time since the lesson started">
            {clock(elapsed)} <span className="text-sm text-muted">/ {plan.minutes}:00</span>
          </span>
          {!ended && state.current ? (
            <Link href={`/teacher/lessons/${sessionId}?block=${state.current}`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2">
              <MonitorPlay className="h-4 w-4" /> Back to the presentation
            </Link>
          ) : null}
          {error && <span className="text-sm text-danger">{error}</span>}
          {!ended && (
            <form action={endLesson.bind(null, sessionId)} className="ml-auto" onSubmit={(e) => { if (!confirm("End the lesson for the whole class?")) e.preventDefault(); }}>
              <Button type="submit" variant="secondary">End lesson</Button>
            </form>
          )}
        </div>

        {plan.stages.map((st) => (
          <section key={st.stage} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{st.stage} · {st.minutes} min</h2>
            {st.blocks.map((b) => {
              const from = startOf.get(b.id) ?? 0;
              const isOpen = open.has(b.id);
              const isCurrent = state.current === b.id;
              const openedAt = state.openedAt?.[b.id];
              const left = openedAt ? b.minutes * 60_000 - (now - new Date(openedAt).getTime()) : null;
              const groups = state.groups?.[b.id] ?? [];
              const expected = b.groupSize > 1 ? groups.length : Math.max(present.length, 1);
              return (
                <Card key={b.id} className={cn(isCurrent && !ended && "border-primary ring-1 ring-primary")}>
                  <CardHeader
                    title={
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted">{from}–{from + b.minutes} min</span>
                        {b.title}
                        <Badge tone={b.mode === "class" ? "neutral" : "info"}>{MODE[b.mode]}{b.groupSize > 1 ? ` of ${b.groupSize}` : ""}</Badge>
                        {ended ? null : isOpen ? <Badge tone="success">open</Badge> : openedAt ? <Badge>closed</Badge> : null}
                        {!ended && isOpen && left != null && <span className={cn("font-mono text-xs", left < 0 ? "text-danger" : "text-muted")}>{left < 0 ? `+${clock(-left)}` : clock(left)} left</span>}
                      </span>
                    }
                    description={b.teacher}
                    action={
                      ended ? null : (
                        <div className="flex flex-wrap gap-2">
                          {b.slides.length > 0 && (
                            <Link href={`/teacher/lessons/${sessionId}?block=${b.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-surface-2">
                              <MonitorPlay className="h-4 w-4" /> Present
                            </Link>
                          )}
                          {isOpen ? (
                            <Button size="sm" variant="secondary" disabled={pending} onClick={() => run(() => closeBlock(sessionId, b.id))}><Lock className="h-4 w-4" /> Close</Button>
                          ) : (
                            <Button size="sm" disabled={pending} onClick={() => run(() => openBlock(sessionId, b.id))}><Unlock className="h-4 w-4" /> Open</Button>
                          )}
                        </div>
                      )
                    }
                  />
                  {(groups.length > 0 || b.poll || b.tasks.length > 0 || b.together.length > 0) && (
                    <CardBody className="space-y-4 pt-0">
                      {groups.length > 0 && (
                        <div>
                          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4" /> {groups.length} {b.mode === "pair" ? (groups.length === 1 ? "pair" : "pairs") : groups.length === 1 ? "group" : "groups"} — each works on the laptop marked <Crown className="inline h-3.5 w-3.5 text-warning" />
                            {!ended && (
                              <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(() => regroup(sessionId, b.id))}><Shuffle className="h-4 w-4" /> New groups</Button>
                            )}
                          </div>
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {groups.map((g, i) => (
                              <li key={i} className="rounded-md border border-border px-3 py-2 text-sm">
                                <p className="text-xs font-semibold text-muted">
                                  {b.mode === "pair" ? "Pair" : "Group"} {i + 1}
                                  {g.scenario != null && b.scenarios[g.scenario] ? ` · ${b.scenarios[g.scenario].client}` : ""}
                                </p>
                                {g.members.map((m) => (
                                  <p key={m} className={cn(m === g.host && "font-semibold")}>
                                    {m === g.host && <Crown className="mr-1 inline h-3.5 w-3.5 text-warning" />}
                                    {names[m] ?? "Student"}
                                  </p>
                                ))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {b.poll && <PollResult options={b.poll.options} question={b.poll.question} votes={answers.filter((a) => a.block_id === b.id && a.item === "poll")} />}
                      {[...b.together, ...b.tasks].map((pq) => {
                        const q = questions[pq.id];
                        if (!q) return null;
                        const rows = answers.filter((a) => a.block_id === b.id && a.item === pq.id);
                        const marked = rows.filter((a) => a.awarded != null && a.max);
                        const pct = marked.length ? Math.round((100 * marked.reduce((s, a) => s + (a.awarded ?? 0), 0)) / marked.reduce((s, a) => s + (a.max ?? 0), 0)) : null;
                        return (
                          <div key={pq.id} className="rounded-md bg-surface-2 px-3 py-2">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="min-w-0 flex-1 font-medium">{q.title}</span>
                              <span className="text-xs text-muted">{rows.length} / {expected} answered</span>
                              {pct != null && <Badge tone={pct >= 70 ? "success" : pct >= 40 ? "warning" : "danger"}>{pct}% correct</Badge>}
                              {rows.some((a) => a.needs_review) && <Badge tone="info">{rows.filter((a) => a.needs_review).length} to check</Badge>}
                              {!ended && q.correct.length > 0 && (
                                <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(() => toggleReveal(sessionId, pq.id))}>
                                  {revealed.has(pq.id) ? <><EyeOff className="h-4 w-4" /> Hide answer</> : <><Eye className="h-4 w-4" /> Show answer</>}
                                </Button>
                              )}
                            </div>
                            {(q.type === "mcq" || q.type === "true_false") && rows.length > 0 && (
                              <Bars
                                labels={q.type === "true_false" ? ["True", "False"] : q.options.map((o) => `${o.key}. ${o.content}`)}
                                counts={(q.type === "true_false" ? ["true", "false"] : q.options.map((o) => o.key)).map((k) => rows.filter((a) => String(a.selected) === k).length)}
                                correct={(q.type === "true_false" ? ["true", "false"] : q.options.map((o) => o.key)).map((k) => q.correct.includes(k))}
                                showCorrect={revealed.has(pq.id) || ended}
                              />
                            )}
                          </div>
                        );
                      })}
                    </CardBody>
                  )}
                </Card>
              );
            })}
          </section>
        ))}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader title={`Joined: ${present.length} / ${classSize}`} description="Students with the lesson open on their laptop." />
          <CardBody className="pt-0">
            <ul className="space-y-1 text-sm">
              {Object.entries(names)
                .sort((a, b) => a[1].localeCompare(b[1], "kk"))
                .map(([id, n]) => (
                  <li key={id} className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", present.includes(id) ? "bg-success" : "bg-border")} />
                    <span className={cn(!present.includes(id) && "text-muted")}>{n}</span>
                  </li>
                ))}
            </ul>
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}

function Bars({ labels, counts, correct, showCorrect }: { labels: string[]; counts: number[]; correct: boolean[]; showCorrect: boolean }) {
  const total = Math.max(1, counts.reduce((a, b) => a + b, 0));
  return (
    <ul className="mt-2 space-y-1">
      {labels.map((l, i) => (
        <li key={i} className="grid grid-cols-[minmax(0,1fr)_8rem_2rem] items-center gap-2 text-xs">
          <span className={cn("truncate", showCorrect && correct[i] && "font-semibold text-success")}>{l}</span>
          <span className="h-2 overflow-hidden rounded bg-border">
            <span className={cn("block h-full", showCorrect && correct[i] ? "bg-success" : "bg-primary")} style={{ width: `${(100 * counts[i]) / total}%` }} />
          </span>
          <span className="text-right tabular-nums">{counts[i]}</span>
        </li>
      ))}
    </ul>
  );
}

function PollResult({ question, options, votes }: { question: string; options: string[]; votes: ConsoleAnswer[] }) {
  return (
    <div className="rounded-md bg-surface-2 px-3 py-2">
      <p className="text-sm font-medium">Poll: {question} <span className="text-xs font-normal text-muted">({votes.length} votes)</span></p>
      <Bars labels={options} counts={options.map((_, i) => votes.filter((v) => String(v.selected) === String(i)).length)} correct={options.map(() => false)} showCorrect={false} />
    </div>
  );
}
