"use client";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { AnswerInput, QuestionText } from "@/components/questions/answer-input";
import { Markdown } from "@/components/markdown";
import { ImageUploadButton } from "@/components/teacher/image-upload-button";
import { bstLevelOrder } from "@/lib/diagrams";
import { parseBoolean, variablesOf } from "@/lib/boolean";
import {
  CODE_LANGUAGES,
  CODE_TYPES,
  COMMAND_WORDS,
  CONTENT_STATUSES,
  DETERMINISTIC_TYPES,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  GRADING_METHODS,
  QUESTION_SOURCES,
  QUESTION_SOURCE_LABELS,
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  DIAGRAM_TYPES,
  type AnswerData,
  type DiagramKind,
  type QuestionType,
} from "@/lib/questions/types";
import type { AuthoredQuestion } from "@/lib/content/schema";
import { saveQuestion } from "@/app/(app)/teacher/questions/actions";

export type EditorLO = { code: string; description: string; topicIds: string[] };
export type EditorParent = { id: string; title: string; stem: string; topic?: string };
export type EditorPart = { id: string; title: string; part_label: string | null; question_type: QuestionType; marks: number; status: string };

const DiagramBuilder = dynamic(() => import("@/components/questions/diagram-builder"), { ssr: false });
const GATE_TYPES = ["and", "or", "not", "nand", "nor", "xor"] as const;

/** Single "|" separates cells; "||" inside a cell separates accepted alternatives. */
const splitCells = (line: string) => line.split(/(?<!\|)\|(?!\|)/).map((c) => c.trim());

const KEYS = "ABCDEFGH".split("");
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/** Text field for a list ("a, b, c"): keeps what the teacher typed and reports the parsed list. */
function ListInput<T>({
  id,
  value,
  format,
  parse,
  onChange,
  className,
  placeholder,
}: {
  id: string;
  value: T;
  format: (v: T) => string;
  parse: (text: string) => T;
  onChange: (v: T) => void;
  className?: string;
  placeholder?: string;
}) {
  const [text, setText] = useState(() => format(value));
  return (
    <Input
      id={id}
      className={className}
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(parse(e.target.value));
      }}
      onBlur={() => setText(format(value))}
    />
  );
}

const splitList = (t: string) => t.split(",").map((c) => c.trim()).filter(Boolean);

export function QuestionEditor({
  questionId,
  initial,
  topics,
  objectives,
  readOnly,
  parent,
  parts = [],
}: {
  questionId: string | null;
  initial: AuthoredQuestion;
  topics: { id: string; title: string }[];
  objectives: EditorLO[];
  readOnly: boolean;
  /** set when editing a part of a structured question */
  parent?: EditorParent;
  /** structured question: its parts */
  parts?: EditorPart[];
}) {
  const router = useRouter();
  const [q, setQ] = useState<AuthoredQuestion>(initial);
  const [preview, setPreview] = useState<AnswerData | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string; issues?: string[] } | null>(null);
  const [pending, start] = useTransition();
  const [loFilter, setLoFilter] = useState("");
  const [treeKey, setTreeKey] = useState(0);

  const set = (patch: Partial<AuthoredQuestion>) => setQ((x) => ({ ...x, ...patch }));
  const setContent = (patch: Partial<NonNullable<AuthoredQuestion["content"]>>) => setQ((x) => ({ ...x, content: { ...(x.content ?? {}), ...patch } }));
  const setScheme = (patch: Partial<AuthoredQuestion["scheme"]>) => setQ((x) => ({ ...x, scheme: { ...x.scheme, ...patch } }));
  const setAccepted = (patch: Partial<NonNullable<AuthoredQuestion["scheme"]["accepted"]>>) =>
    setQ((x) => ({ ...x, scheme: { ...x.scheme, accepted: { ...(x.scheme.accepted ?? {}), ...patch } } }));
  const accepted = q.scheme.accepted ?? {};
  const content = q.content ?? {};
  const isOptions = q.type === "mcq" || q.type === "multiple_response";
  const isCode = (CODE_TYPES as readonly string[]).includes(q.type);
  const canAuto = (DETERMINISTIC_TYPES as readonly string[]).includes(q.type);
  const isStructured = q.type === "structured";
  const isDiagram = DIAGRAM_TYPES.includes(q.type);
  const insertIntoText = (md: string) => set({ text: q.text ? `${q.text.trimEnd()}\n\n${md}\n` : `${md}\n` });
  let expressionProblem: string | null = null;
  let expressionVars: string[] = [];
  if (accepted.expression) {
    try {
      expressionVars = variablesOf(parseBoolean(accepted.expression));
    } catch (e) {
      expressionProblem = (e as Error).message;
    }
  }

  const loChoices = useMemo(() => {
    const f = loFilter.toLowerCase();
    return objectives
      .filter((o) => !q.objectives.includes(o.code))
      .filter((o) => (q.topic && !f ? o.topicIds.includes(q.topic) : !f || o.code.startsWith(f) || o.description.toLowerCase().includes(f)))
      .slice(0, 40);
  }, [objectives, q.objectives, q.topic, loFilter]);

  const blanks = (q.text.match(/\[\[\d+\]\]/g) ?? []).length;

  const save = () =>
    start(async () => {
      const payload: AuthoredQuestion = {
        ...q,
        content: q.type === "fill_blank" ? { ...content, blank_count: blanks || 1 } : content,
      };
      const r = await saveQuestion(questionId, payload, { parentId: parent?.id });
      if (r.ok) {
        setResult({ ok: true, message: r.message });
        if (!questionId) router.replace(`/teacher/questions/${r.id}`);
        else router.refresh();
      } else setResult({ ok: false, message: r.error, issues: r.issues });
    });

  const previewQuestion = {
    id: "preview",
    question_type: q.type,
    content: q.type === "fill_blank" ? { ...content, blank_count: blanks || 1 } : content,
    options: q.options ?? [],
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
      <fieldset disabled={readOnly} className="min-w-0 space-y-6">
        {parent && (
          <Alert tone="info" title={`Part of: ${parent.title}`}>
            Students see the shared stem of{" "}
            <Link href={`/teacher/questions/${parent.id}`} className="underline">the structured question</Link> above this part.
          </Alert>
        )}
        <Card>
          <CardHeader title={isStructured ? "Structured question (shared stem)" : parent ? "Part" : "Question"} />
          <CardBody className="space-y-4">
            {parent && (
              <Field label="Part label" htmlFor="q-part" hint="e.g. (a), (b)(i). Parts are shown in label order.">
                <Input id="q-part" className="max-w-40 font-mono" value={q.part_label ?? ""} onChange={(e) => set({ part_label: e.target.value })} />
              </Field>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor="q-title"><Input id="q-title" value={q.title} onChange={(e) => set({ title: e.target.value })} /></Field>
              <Field label="Type" htmlFor="q-type">
                <Select id="q-type" value={q.type} onChange={(e) => {
                  const type = e.target.value as AuthoredQuestion["type"];
                  set({ type, grading: (DETERMINISTIC_TYPES as readonly string[]).includes(type) ? q.grading : q.grading === "AUTO" ? "AI" : q.grading });
                }}>
                  {QUESTION_TYPES.filter((t) => !parent || t !== "structured").map((t) => <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>)}
                </Select>
              </Field>
            </div>
            <Field
              label={isStructured ? "Stem: scenario, figure, table or code shared by all parts (Markdown)" : "Question text (Markdown; tables, code blocks and $maths$ supported)"}
              htmlFor="q-text"
              hint={q.type === "fill_blank" ? `Use [[1]], [[2]] … for gaps (${blanks} found).` : undefined}
            >
              <Textarea id="q-text" rows={isStructured ? 10 : 7} className="font-mono" value={q.text} onChange={(e) => set({ text: e.target.value })} />
            </Field>
            {!readOnly && <ImageUploadButton onInsert={insertIntoText} />}
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Marks" htmlFor="q-marks" hint={isStructured ? "Sum of the parts." : undefined}>
                <Input id="q-marks" type="number" min={1} max={50} value={isStructured ? Math.max(1, parts.reduce((t, p) => t + p.marks, 0)) : q.marks} disabled={isStructured} onChange={(e) => set({ marks: Number(e.target.value) })} />
              </Field>
              <Field label="Difficulty" htmlFor="q-diff">
                <Select id="q-diff" value={q.difficulty} onChange={(e) => set({ difficulty: e.target.value as AuthoredQuestion["difficulty"] })}>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
                </Select>
              </Field>
              {!isStructured && (
                <>
              <Field label="Command word" htmlFor="q-cw">
                <Select id="q-cw" value={q.command_word ?? ""} onChange={(e) => set({ command_word: (e.target.value || null) as AuthoredQuestion["command_word"] })}>
                  <option value="">—</option>
                  {COMMAND_WORDS.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
                </Select>
              </Field>
              <Field label="Marking" htmlFor="q-grading" hint={q.grading === "HYBRID" ? "Answer key first, AI if no exact match." : undefined}>
                <Select id="q-grading" value={q.grading} onChange={(e) => set({ grading: e.target.value as AuthoredQuestion["grading"] })}>
                  {GRADING_METHODS.filter((g) => g !== "AUTO" || canAuto).map((g) => <option key={g} value={g}>{g}</option>)}
                </Select>
              </Field>
                </>
              )}
            </div>
            {!isStructured && <Field label="Hint (practice mode only)" htmlFor="q-hint"><Input id="q-hint" value={content.hint ?? ""} onChange={(e) => setContent({ hint: e.target.value || undefined })} /></Field>}
          </CardBody>
        </Card>

        {isStructured && (
          <Card>
            <CardHeader
              title={`Parts (${parts.length})`}
              description="Each part is answered and marked on its own: (a), (b)(i)… Students see the stem above every part."
              action={questionId && !readOnly ? <Link href={`/teacher/questions/new?parent=${questionId}`} className="text-sm font-medium text-primary hover:underline">+ Add part</Link> : undefined}
            />
            <CardBody>
              {!questionId ? (
                <p className="text-sm text-muted">Save the stem first, then add its parts.</p>
              ) : parts.length === 0 ? (
                <p className="text-sm text-warning">No parts yet. An exam cannot be published with an empty structured question.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {parts.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-2 text-sm">
                      <span className="w-16 font-mono font-semibold">{p.part_label}</span>
                      <Link href={`/teacher/questions/${p.id}`} className="flex-1 hover:underline">{p.title}</Link>
                      <Badge>{QUESTION_TYPE_LABELS[p.question_type]}</Badge>
                      <Badge tone={p.status === "published" ? "success" : "neutral"}>{p.status}</Badge>
                      <span className="w-14 text-right tabular-nums">[{p.marks}]</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        )}

        {/* Type-specific answer configuration */}
        {!isStructured && (<>
        <Card>
          <CardHeader title="Answer" description="What the student sees and the answer key for automatic marking." />
          <CardBody className="space-y-4">
            {isOptions && (
              <div className="space-y-2">
                {(q.options ?? []).map((o, i) => {
                  const correct = Array.isArray(accepted.correct) ? accepted.correct.includes(o.key) : accepted.correct === o.key;
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-2 w-5 font-semibold">{o.key}</span>
                      <Textarea rows={1} value={o.content} onChange={(e) => set({ options: (q.options ?? []).map((x, j) => (j === i ? { ...x, content: e.target.value } : x)) })} aria-label={`Option ${o.key}`} />
                      <label className="mt-2 flex items-center gap-1 whitespace-nowrap text-sm">
                        <input
                          type={q.type === "mcq" ? "radio" : "checkbox"}
                          name="correct"
                          checked={correct}
                          onChange={() => {
                            if (q.type === "mcq") setAccepted({ correct: o.key });
                            else {
                              const cur = new Set(Array.isArray(accepted.correct) ? accepted.correct : []);
                              if (cur.has(o.key)) cur.delete(o.key);
                              else cur.add(o.key);
                              setAccepted({ correct: [...cur].sort() });
                            }
                          }}
                        />
                        correct
                      </label>
                      <Button size="sm" variant="ghost" aria-label="Remove option" onClick={() => {
                        const opts = (q.options ?? []).filter((_, j) => j !== i).map((x, j) => ({ ...x, key: KEYS[j] }));
                        set({ options: opts });
                      }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  );
                })}
                {(q.options?.length ?? 0) < 8 && (
                  <Button size="sm" variant="secondary" onClick={() => set({ options: [...(q.options ?? []), { key: KEYS[q.options?.length ?? 0], content: "" }] })}>
                    <Plus className="h-4 w-4" /> Add option
                  </Button>
                )}
              </div>
            )}

            {q.type === "true_false" && (
              <Field label="Correct answer" htmlFor="tf">
                <Select id="tf" value={accepted.correct === true ? "true" : accepted.correct === false ? "false" : ""} onChange={(e) => setAccepted({ correct: e.target.value === "true" })}>
                  <option value="">Choose…</option><option value="true">True</option><option value="false">False</option>
                </Select>
              </Field>
            )}

            {q.type === "matching" && (
              <div className="space-y-2">
                <p className="text-sm text-muted">Each row is a correct pair. Students see the right-hand items shuffled.</p>
                {(content.left ?? []).map((l, i) => {
                  const r = (content.right ?? [])[i];
                  return (
                    <div key={i} className="flex gap-2">
                      <Input value={l.text} placeholder="Left item" aria-label={`Left ${i + 1}`} onChange={(e) => setContent({ left: (content.left ?? []).map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} />
                      <Input value={r?.text ?? ""} placeholder="Matching right item" aria-label={`Right ${i + 1}`} onChange={(e) => setContent({ right: (content.right ?? []).map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} />
                      <Button size="sm" variant="ghost" aria-label="Remove pair" onClick={() => {
                        const left = (content.left ?? []).filter((_, j) => j !== i).map((x, j) => ({ ...x, key: `L${j + 1}` }));
                        const right = (content.right ?? []).filter((_, j) => j !== i).map((x, j) => ({ ...x, key: `R${j + 1}` }));
                        setContent({ left, right });
                        setAccepted({ pairs: Object.fromEntries(left.map((x, j) => [x.key, right[j].key])) });
                      }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  );
                })}
                <Button size="sm" variant="secondary" onClick={() => {
                  const n = (content.left?.length ?? 0) + 1;
                  const left = [...(content.left ?? []), { key: `L${n}`, text: "" }];
                  const right = [...(content.right ?? []), { key: `R${n}`, text: "" }];
                  setContent({ left, right });
                  setAccepted({ pairs: Object.fromEntries(left.map((x, j) => [x.key, right[j].key])) });
                }}><Plus className="h-4 w-4" /> Add pair</Button>
              </div>
            )}

            {q.type === "fill_blank" && (
              <div className="space-y-2">
                {Array.from({ length: blanks }, (_, i) => (
                  <Field key={i} label={`Accepted answers for blank (${i + 1}) — one per line`} htmlFor={`b${i}`}>
                    <Textarea id={`b${i}`} rows={2} value={(accepted.blanks?.[i] ?? []).join("\n")} onChange={(e) => {
                      const next = Array.from({ length: blanks }, (_, j) => (j === i ? lines(e.target.value) : (accepted.blanks?.[j] ?? [])));
                      setAccepted({ blanks: next });
                    }} />
                  </Field>
                ))}
                {blanks === 0 && <p className="text-sm text-warning">Add [[1]] placeholders to the question text.</p>}
              </div>
            )}

            {(q.type === "calculation" || q.type === "short_answer") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Accepted answers — one per line" htmlFor="vals" hint={q.type === "short_answer" ? "Leave empty to mark with AI or by hand." : undefined}>
                  <Textarea id="vals" rows={3} value={(accepted.values ?? []).join("\n")} onChange={(e) => setAccepted({ values: lines(e.target.value).length ? lines(e.target.value) : undefined })} />
                </Field>
                <div className="space-y-3 pt-6">
                  <Checkbox label="Compare as numbers" checked={!!accepted.numeric} onChange={(e) => setAccepted({ numeric: e.target.checked || undefined })} />
                  <Checkbox label="Ignore spaces (e.g. binary)" checked={!!accepted.ignore_spaces} onChange={(e) => setAccepted({ ignore_spaces: e.target.checked || undefined })} />
                  <Checkbox label="Case sensitive" checked={!!accepted.case_sensitive} onChange={(e) => setAccepted({ case_sensitive: e.target.checked || undefined })} />
                  {accepted.numeric && (
                    <Field label="Tolerance" htmlFor="tol"><Input id="tol" type="number" step="any" value={accepted.tolerance ?? ""} onChange={(e) => setAccepted({ tolerance: e.target.value ? Number(e.target.value) : undefined })} /></Field>
                  )}
                  {q.type === "calculation" && <Field label="Unit (shown to students)" htmlFor="unit"><Input id="unit" value={content.unit ?? ""} onChange={(e) => setContent({ unit: e.target.value || undefined })} /></Field>}
                </div>
              </div>
            )}

            {q.type === "trace_table" && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Columns (comma separated)" htmlFor="cols"><ListInput id="cols" value={content.columns ?? []} format={(v) => v.join(", ")} parse={splitList} onChange={(columns) => setContent({ columns })} /></Field>
                  <Field label="Rows" htmlFor="rows"><Input id="rows" type="number" min={1} max={40} value={content.rows ?? 5} onChange={(e) => setContent({ rows: Number(e.target.value) })} /></Field>
                </div>
                <Field label="Expected values — one row per line, cells separated by |, leave a cell empty to not mark it" htmlFor="expected">
                  <Textarea id="expected" rows={6} className="font-mono" value={(accepted.rows ?? []).map((r) => r.map((c) => c ?? "").join(" | ")).join("\n")} onChange={(e) => setAccepted({ rows: lines(e.target.value).map((l) => l.split("|").map((c) => c.trim() || null)) })} />
                </Field>
              </div>
            )}

            {q.type === "labelled_answers" && (
              <div className="space-y-2">
                <p className="text-sm text-muted">One answer box per row. Accepted answers (one per line) mark the box automatically; leave them empty for AI marking.</p>
                {(content.fields ?? []).map((f, i) => (
                  <div key={i} className="grid gap-2 rounded-lg border border-border p-2 sm:grid-cols-[1fr_5rem_1fr_auto]">
                    <Input value={f.label} placeholder="Label, e.g. Mantissa" aria-label={`Label ${i + 1}`} onChange={(e) => setContent({ fields: (content.fields ?? []).map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                    <Input type="number" min={1} max={20} value={f.lines ?? 1} aria-label="Lines" title="Box height (lines)" onChange={(e) => setContent({ fields: (content.fields ?? []).map((x, j) => (j === i ? { ...x, lines: Number(e.target.value) > 1 ? Number(e.target.value) : undefined } : x)) })} />
                    <Textarea rows={1} value={(accepted.fields?.[f.key] ?? []).join("\n")} placeholder="Accepted answers (optional)" aria-label={`Accepted ${i + 1}`} onChange={(e) => {
                      const next = { ...(accepted.fields ?? {}) };
                      if (lines(e.target.value).length) next[f.key] = lines(e.target.value);
                      else delete next[f.key];
                      setAccepted({ fields: Object.keys(next).length ? next : undefined });
                    }} />
                    <Button size="sm" variant="ghost" aria-label="Remove box" onClick={() => {
                      const rest = (content.fields ?? []).filter((_, j) => j !== i);
                      const next = { ...(accepted.fields ?? {}) };
                      delete next[f.key];
                      setContent({ fields: rest });
                      setAccepted({ fields: Object.keys(next).length ? next : undefined });
                    }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="secondary" onClick={() => {
                  const used = new Set((content.fields ?? []).map((f) => f.key));
                  let n = 1;
                  while (used.has(String(n))) n++;
                  setContent({ fields: [...(content.fields ?? []), { key: String(n), label: String(n) }] });
                }}><Plus className="h-4 w-4" /> Add answer box</Button>
              </div>
            )}

            {q.type === "table_completion" && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Columns (comma separated)" htmlFor="tc-cols"><ListInput id="tc-cols" value={content.columns ?? []} format={(v) => v.join(", ")} parse={splitList} onChange={(columns) => setContent({ columns })} /></Field>
                  <Field label="Rows" htmlFor="tc-rows"><Input id="tc-rows" type="number" min={1} max={40} value={content.rows ?? 4} onChange={(e) => setContent({ rows: Number(e.target.value) })} /></Field>
                </div>
                <Field label="Given cells — one row per line, cells separated by |, leave a cell empty for the student to fill" htmlFor="tc-prefill">
                  <Textarea id="tc-prefill" rows={5} className="font-mono" value={(content.prefill ?? []).map((r) => r.map((c) => c ?? "").join(" | ")).join("\n")} onChange={(e) => setContent({ prefill: e.target.value.trim() ? e.target.value.split("\n").map((l) => splitCells(l).map((c) => c || null)) : undefined })} />
                </Field>
                <Checkbox label="Empty cells are tick boxes (a ticked cell is marked as ✓; use ✓ in the answers below, leave other cells empty)" checked={!!content.tick} onChange={(e) => setContent({ tick: e.target.checked || undefined })} />
                <Field label="Exact answers for automatic marking (optional) — same layout; alternatives in a cell separated by ||" htmlFor="tc-exp" hint="Leave empty when answers are descriptions: the AI marks against the mark scheme.">
                  <Textarea id="tc-exp" rows={5} className="font-mono" value={(accepted.rows ?? []).map((r) => r.map((c) => c ?? "").join(" | ")).join("\n")} onChange={(e) => setAccepted({ rows: e.target.value.trim() ? lines(e.target.value).map((l) => splitCells(l).map((c) => c || null)) : undefined })} />
                </Field>
              </div>
            )}

            {(q.type === "boolean_expression" || q.type === "logic_circuit") && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Expected expression (any equivalent answer is accepted)" htmlFor="expr" className="sm:col-span-2" hint={expressionProblem ? `Problem: ${expressionProblem}` : expressionVars.length ? `Inputs: ${expressionVars.join(", ")}` : "e.g. (A AND B) OR NOT C"}>
                    <Input id="expr" className="font-mono" value={accepted.expression ?? ""} onChange={(e) => setAccepted({ expression: e.target.value || undefined })} />
                  </Field>
                  <Field label="Output name" htmlFor="outname"><Input id="outname" className="font-mono" maxLength={1} value={content.output ?? ""} placeholder="X" onChange={(e) => setContent({ output: e.target.value.toUpperCase() || undefined })} /></Field>
                </div>
                {q.type === "logic_circuit" && (
                  <>
                    <Field label="Inputs given to the student (letters, comma separated)" htmlFor="inputs" hint="Default: the letters in the expected expression.">
                      <ListInput
                        id="inputs"
                        className="font-mono"
                        value={content.inputs ?? []}
                        format={(v) => v.join(", ")}
                        parse={(t) => [...new Set(t.toUpperCase().match(/[A-Z]/g) ?? [])]}
                        onChange={(v) => setContent({ inputs: v.length ? v : undefined })}
                      />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-medium">Gates allowed:</span>
                      {GATE_TYPES.map((g) => (
                        <Checkbox key={g} label={g.toUpperCase()} checked={!content.gates || content.gates.includes(g)} onChange={(e) => {
                          const cur = new Set(content.gates ?? GATE_TYPES);
                          if (e.target.checked) cur.add(g);
                          else cur.delete(g);
                          setContent({ gates: cur.size === GATE_TYPES.length ? undefined : GATE_TYPES.filter((x) => cur.has(x)) });
                        }} />
                      ))}
                    </div>
                    <p className="text-xs text-muted">AUTO marks a fully correct circuit; HYBRID also asks the AI for partial credit using the marking points.</p>
                  </>
                )}
              </div>
            )}

            {q.type === "binary_tree" && (
              <div className="space-y-2">
                <Field label="Expected tree in level order — comma separated, - for an empty position" htmlFor="tree" hint="e.g. 50, 30, 70, -, 40, 60">
                  <ListInput
                    key={treeKey}
                    id="tree"
                    className="font-mono"
                    value={accepted.tree}
                    format={(v) => (v ?? []).map((x) => x ?? "-").join(", ")}
                    parse={(t) => (t.trim() ? t.split(",").map((x) => x.trim()).map((x) => (x === "-" || x === "" ? null : x)) : undefined)}
                    onChange={(tree) => setAccepted({ tree })}
                  />
                </Field>
                <Field label="…or build it from keys inserted into a binary search tree" htmlFor="bst">
                  <Input id="bst" className="font-mono" placeholder="50 30 70 40 60 — press Enter" onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    const keys = e.currentTarget.value.split(/[\s,]+/).filter(Boolean);
                    if (keys.length) {
                      setAccepted({ tree: bstLevelOrder(keys) });
                      setTreeKey((k) => k + 1);
                    }
                  }} />
                </Field>
              </div>
            )}

            {isDiagram && q.type !== "logic_circuit" && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Starting diagram (optional)</p>
                <p className="text-xs text-muted">Shapes placed here are given to every student and cannot be deleted by them (e.g. entities of an ERD or the external entities of a DFD).</p>
                <DiagramBuilder
                  key={`starter-${q.type}`}
                  kind={q.type as DiagramKind}
                  content={{ ...content, starter: undefined }}
                  value={content.starter}
                  readOnly={readOnly}
                  onChange={(d) => setContent({ starter: d ?? undefined })}
                />
                <p className="text-xs text-muted">
                  {q.type === "binary_tree" ? "Marked automatically against the expected tree." : "Marked by the AI examiner from a text description of the drawing — write clear marking points."}
                </p>
              </div>
            )}

            {isCode && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Language" htmlFor="lang">
                  <Select id="lang" value={content.language ?? ""} onChange={(e) => setContent({ language: (e.target.value || undefined) as never })}>
                    <option value="">Default</option>
                    {CODE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </Field>
                <Field label="Starter code" htmlFor="starter" className="sm:col-span-2"><Textarea id="starter" rows={5} className="font-mono" value={content.starter_code ?? ""} onChange={(e) => setContent({ starter_code: e.target.value || undefined })} /></Field>
              </div>
            )}

            {["short_answer", "extended", "scenario", "diagram"].includes(q.type) && (
              <Field label="Answer box height (lines)" htmlFor="lines"><Input id="lines" type="number" min={1} max={40} value={content.answer_lines ?? ""} onChange={(e) => setContent({ answer_lines: e.target.value ? Number(e.target.value) : undefined })} /></Field>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Mark scheme" description="Hidden from students during exams. Used by the AI examiner for written answers." />
          <CardBody className="space-y-4">
            <Field label="Mark scheme (Markdown)" htmlFor="ms"><Textarea id="ms" rows={5} value={q.scheme.mark_scheme} onChange={(e) => setScheme({ mark_scheme: e.target.value })} /></Field>
            <div className="space-y-2">
              <p className="text-sm font-medium">Marking points</p>
              {(q.scheme.points ?? []).map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={p.criterion} placeholder="Criterion" aria-label={`Criterion ${i + 1}`} onChange={(e) => setScheme({ points: (q.scheme.points ?? []).map((x, j) => (j === i ? { ...x, criterion: e.target.value } : x)) })} />
                  <Input className="w-20" type="number" min={0} max={20} value={p.marks} aria-label="Marks" onChange={(e) => setScheme({ points: (q.scheme.points ?? []).map((x, j) => (j === i ? { ...x, marks: Number(e.target.value) } : x)) })} />
                  <Button size="sm" variant="ghost" aria-label="Remove point" onClick={() => setScheme({ points: (q.scheme.points ?? []).filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button size="sm" variant="secondary" onClick={() => setScheme({ points: [...(q.scheme.points ?? []), { criterion: "", marks: 1 }] })}><Plus className="h-4 w-4" /> Add marking point</Button>
            </div>
            <Field label="Model answer" htmlFor="model"><Textarea id="model" rows={4} value={q.scheme.model_answer ?? ""} onChange={(e) => setScheme({ model_answer: e.target.value || undefined })} /></Field>
            <Field label="Explanation (practice)" htmlFor="expl"><Textarea id="expl" rows={3} value={q.scheme.explanation ?? ""} onChange={(e) => setScheme({ explanation: e.target.value || undefined })} /></Field>
            {(q.grading === "AI" || q.grading === "HYBRID") && (
              <Field label="Instructions for the AI examiner" htmlFor="ai" hint="e.g. accepted alternatives, maximum marks for generic points."><Textarea id="ai" rows={3} value={q.scheme.ai_instructions ?? ""} onChange={(e) => setScheme({ ai_instructions: e.target.value || undefined })} /></Field>
            )}
          </CardBody>
        </Card>
        </>)}
      </fieldset>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Classification" />
          <CardBody className="space-y-4">
            <fieldset disabled={readOnly} className="space-y-4">
              <Field label="Topic" htmlFor="topic">
                <Select id="topic" value={q.topic ?? ""} onChange={(e) => set({ topic: e.target.value || undefined })}>
                  <option value="">—</option>
                  {topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </Select>
              </Field>
              <div className="space-y-2">
                <p className="text-sm font-medium">Learning objectives</p>
                <div className="flex flex-wrap gap-1.5">
                  {q.objectives.map((c) => (
                    <button key={c} type="button" onClick={() => set({ objectives: q.objectives.filter((x) => x !== c) })} className="rounded-full bg-primary-soft px-2 py-0.5 font-mono text-xs text-primary hover:line-through" title="Remove">
                      {c.replace("@paper", " (Paper)")} ×
                    </button>
                  ))}
                  {q.objectives.length === 0 && !isStructured && <span className="text-xs text-danger">At least one is required.</span>}
                </div>
                <Input placeholder={q.topic ? "Topic objectives shown — type to search all" : "Search code or text"} value={loFilter} onChange={(e) => setLoFilter(e.target.value)} aria-label="Search objectives" />
                <ul className="max-h-48 space-y-1 overflow-y-auto">
                  {loChoices.map((o) => (
                    <li key={o.code}>
                      <button type="button" className="w-full rounded px-2 py-1 text-left text-xs hover:bg-surface-2" onClick={() => set({ objectives: [...q.objectives, o.code] })}>
                        <span className="font-mono font-semibold">{o.code.replace("@paper", "")}</span>
                        {o.code.endsWith("@paper") && <span className="ml-1 rounded bg-warning-soft px-1 text-[10px] font-semibold uppercase text-warning">Paper</span>} {o.description}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <Field label="Source" htmlFor="src">
                <Select id="src" value={q.source ?? "teacher"} onChange={(e) => set({ source: e.target.value as AuthoredQuestion["source"] })}>
                  {QUESTION_SOURCES.map((s) => <option key={s} value={s}>{QUESTION_SOURCE_LABELS[s]}</option>)}
                </Select>
              </Field>
              {(q.source === "past_paper" || q.source === "cambridge_style") && (
                <Field label="Source reference" htmlFor="srcref" hint="Stored separately; never shown to students."><Input id="srcref" value={q.source_reference ?? ""} onChange={(e) => set({ source_reference: e.target.value || undefined })} /></Field>
              )}
              <Checkbox label="Available in Practice Mode" checked={q.practice ?? true} onChange={(e) => set({ practice: e.target.checked })} />
              <Field label="Status" htmlFor="status" hint="Only published questions are visible to students and can be used in published exams.">
                <Select id="status" value={q.status ?? "draft"} onChange={(e) => set({ status: e.target.value as AuthoredQuestion["status"] })}>
                  {CONTENT_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                </Select>
              </Field>
            </fieldset>
            {result && (
              <Alert tone={result.ok ? "success" : "danger"} title={result.message}>
                {result.issues && <ul className="list-disc pl-4 text-xs">{result.issues.map((i, k) => <li key={k}>{i}</li>)}</ul>}
              </Alert>
            )}
            {!readOnly && <Button onClick={save} disabled={pending} className="w-full">{pending ? "Saving…" : "Save question"}</Button>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Student preview" action={<Badge>{q.marks} marks</Badge>} />
          <CardBody className="space-y-4">
            {parent?.stem && (
              <div className="rounded-lg border border-border bg-surface-2 p-3">
                <Markdown>{parent.stem}</Markdown>
              </div>
            )}
            {parent && q.part_label && <p className="font-mono text-sm font-semibold">{q.part_label}</p>}
            <QuestionText text={q.text || "_Question text…_"} type={q.type} />
            {isStructured ? (
              <p className="text-sm text-muted">Students answer each part below this stem.</p>
            ) : (
              <AnswerInput key={`${q.type}-${JSON.stringify(content.starter ?? null).length}`} question={previewQuestion} value={preview} onChange={setPreview} />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
