"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Markdown } from "@/components/markdown";
import { parseBoolean } from "@/lib/boolean";
import { CodeEditor } from "@/components/code-editor";
import { cn } from "@/lib/cn";
import type { AnswerData, CodeLanguage, DiagramKind, QuestionContent, QuestionOption, QuestionType } from "@/lib/questions/types";
import { CODE_TYPES, DIAGRAM_TYPES } from "@/lib/questions/types";

// React Flow is heavy and browser-only: load it when a diagram question is shown.
const DiagramBuilder = dynamic(() => import("./diagram-builder"), {
  ssr: false,
  loading: () => <div className="h-[440px] animate-pulse rounded-lg border border-border bg-surface-2" />,
});

export type AnswerableQuestion = {
  id: string;
  question_type: QuestionType;
  content: QuestionContent;
  options: QuestionOption[];
};

/** Deterministic shuffle so the order is stable for a question but not alphabetical. */
function stableShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const textCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70";

function codeLanguageFor(q: AnswerableQuestion): CodeLanguage | undefined {
  if (q.content.language) return q.content.language;
  if (q.question_type === "sql") return "sql";
  if (q.question_type === "html_css") return "html";
  if (q.question_type === "pseudocode") return "pseudocode";
  return undefined;
}

export function AnswerInput({
  question,
  value,
  onChange,
  disabled = false,
  correctKeys,
}: {
  question: AnswerableQuestion;
  value: AnswerData | null;
  onChange: (next: AnswerData | null) => void;
  disabled?: boolean;
  /** Review mode: highlight correct option keys. */
  correctKeys?: string[];
}) {
  const v = value ?? {};
  const q = question;
  const name = `q-${q.id}`;

  switch (q.question_type) {
    case "mcq":
    case "multiple_response": {
      const multi = q.question_type === "multiple_response";
      const selected = new Set(Array.isArray(v.selected) ? v.selected : v.selected ? [v.selected] : []);
      return (
        <fieldset className="space-y-2" disabled={disabled}>
          <legend className="sr-only">{multi ? "Select all that apply" : "Select one answer"}</legend>
          {multi && <p className="text-xs text-muted">Select all that apply.</p>}
          {q.options.map((o) => {
            const checked = selected.has(o.key);
            const correct = correctKeys?.includes(o.key);
            return (
              <label
                key={o.key}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                  checked ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2",
                  correct && "ring-2 ring-success",
                  disabled && "cursor-default",
                )}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={name}
                  value={o.key}
                  checked={checked}
                  onChange={() => {
                    if (multi) {
                      const next = new Set(selected);
                      if (next.has(o.key)) next.delete(o.key);
                      else next.add(o.key);
                      onChange(next.size ? { selected: [...next].sort() } : null);
                    } else onChange({ selected: o.key });
                  }}
                  className="mt-1 h-4 w-4 accent-[var(--primary)]"
                />
                <span className="w-5 shrink-0 font-semibold">{o.key}</span>
                <Markdown className="min-w-0 flex-1 text-sm">{o.content}</Markdown>
              </label>
            );
          })}
        </fieldset>
      );
    }

    case "true_false":
      return (
        <fieldset className="flex flex-wrap gap-3" disabled={disabled}>
          <legend className="sr-only">True or false</legend>
          {[true, false].map((b) => (
            <label
              key={String(b)}
              className={cn(
                "flex min-w-32 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5",
                v.value === b ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2",
              )}
            >
              <input
                type="radio"
                name={name}
                checked={v.value === b}
                onChange={() => onChange({ value: b })}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="font-medium">{b ? "True" : "False"}</span>
            </label>
          ))}
        </fieldset>
      );

    case "matching":
      return <MatchingInput q={q} value={v} onChange={onChange} disabled={disabled} />;

    case "fill_blank": {
      const n = q.content.blank_count ?? 1;
      const blanks = v.blanks ?? [];
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: n }, (_, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <span className="w-10 shrink-0 font-semibold">({i + 1})</span>
              <input
                className={cn(textCls, "h-10")}
                value={blanks[i] ?? ""}
                disabled={disabled}
                onChange={(e) => {
                  const next = Array.from({ length: n }, (_, j) => (j === i ? e.target.value : (blanks[j] ?? "")));
                  onChange(next.some((x) => x.trim()) ? { blanks: next } : null);
                }}
                aria-label={`Blank ${i + 1}`}
              />
            </label>
          ))}
        </div>
      );
    }

    case "calculation":
      return (
        <div className="space-y-3">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Working (optional)</span>
            <textarea
              className={cn(textCls, "font-mono")}
              rows={4}
              value={v.working ?? ""}
              disabled={disabled}
              onChange={(e) => onChange({ ...v, working: e.target.value })}
            />
          </label>
          <label className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Final answer</span>
            <input
              className={cn(textCls, "h-10 max-w-xs font-mono")}
              value={typeof v.value === "string" ? v.value : ""}
              disabled={disabled}
              onChange={(e) => onChange({ ...v, value: e.target.value })}
            />
            {q.content.unit && <span className="text-muted">{q.content.unit}</span>}
          </label>
        </div>
      );

    case "trace_table":
      return <TraceTableInput q={q} value={v} onChange={onChange} disabled={disabled} />;

    case "table_completion":
      return <TraceTableInput q={q} value={v} onChange={onChange} disabled={disabled} wide />;

    case "labelled_answers": {
      const fields = q.content.fields?.length ? q.content.fields : [{ key: "1", label: "1" }, { key: "2", label: "2" }];
      const given = v.fields ?? {};
      return (
        <div className="space-y-3">
          {fields.map((f) => (
            <label key={f.key} className="grid gap-1 text-sm sm:grid-cols-[minmax(6rem,12rem)_1fr] sm:items-start sm:gap-3">
              <span className="pt-2 font-semibold">
                <Markdown className="inline">{f.label}</Markdown>
              </span>
              {(f.lines ?? 1) > 1 ? (
                <textarea
                  className={textCls}
                  rows={f.lines}
                  aria-label={f.label}
                  value={given[f.key] ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChange(withField(given, f.key, e.target.value))}
                />
              ) : (
                <input
                  className={cn(textCls, "h-10")}
                  aria-label={f.label}
                  value={given[f.key] ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChange(withField(given, f.key, e.target.value))}
                />
              )}
            </label>
          ))}
        </div>
      );
    }

    case "boolean_expression":
      return <BooleanInput q={q} value={v} onChange={onChange} disabled={disabled} />;

    default: {
      if (DIAGRAM_TYPES.includes(q.question_type)) {
        return (
          <DiagramBuilder
            key={q.id}
            kind={q.question_type as DiagramKind}
            content={q.content}
            value={v.diagram}
            readOnly={disabled}
            onChange={(diagram) => onChange(diagram ? { diagram } : null)}
          />
        );
      }
      if (CODE_TYPES.includes(q.question_type)) {
        return (
          <CodeEditor
            language={codeLanguageFor(q)}
            value={v.text ?? q.content.starter_code ?? ""}
            readOnly={disabled}
            onChange={(text) => onChange(text.trim() ? { text } : null)}
            label="Answer code editor"
          />
        );
      }
      const rows = q.content.answer_lines ?? (q.question_type === "extended" || q.question_type === "scenario" ? 10 : 4);
      const words = (v.text ?? "").trim().split(/\s+/).filter(Boolean).length;
      return (
        <div className="space-y-1">
          <textarea
            className={textCls}
            rows={rows}
            value={v.text ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value.trim() ? { text: e.target.value } : null)}
            aria-label="Your answer"
          />
          <p className="text-right text-xs text-muted">
            {words} word{words === 1 ? "" : "s"}
            {q.content.word_limit ? ` / ${q.content.word_limit}` : ""}
          </p>
        </div>
      );
    }
  }
}

function withField(given: Record<string, string>, key: string, text: string): AnswerData | null {
  const next = { ...given, [key]: text };
  return Object.values(next).some((x) => x.trim()) ? { fields: next } : null;
}

function BooleanInput({
  q,
  value,
  onChange,
  disabled,
}: {
  q: AnswerableQuestion;
  value: AnswerData;
  onChange: (v: AnswerData | null) => void;
  disabled: boolean;
}) {
  const text = value.text ?? "";
  let problem: string | null = null;
  if (text.trim()) {
    try {
      parseBoolean(text.replace(/^\s*[A-Z]\s*=/i, ""));
    } catch (e) {
      problem = (e as Error).message;
    }
  }
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 font-mono text-sm">
        <span className="whitespace-nowrap font-semibold">{q.content.output ?? "X"} =</span>
        <input
          className={cn(textCls, "h-10 font-mono")}
          value={text}
          disabled={disabled}
          spellCheck={false}
          placeholder="e.g. (A AND B) OR NOT C"
          onChange={(e) => onChange(e.target.value.trim() ? { text: e.target.value } : null)}
          aria-label="Boolean expression"
        />
      </label>
      <p className={cn("text-xs", problem ? "text-warning" : "text-muted")}>
        {problem ? `Check the expression: ${problem}` : "Use AND, OR, NOT, NAND, NOR, XOR and brackets."}
      </p>
    </div>
  );
}

function MatchingInput({
  q,
  value,
  onChange,
  disabled,
}: {
  q: AnswerableQuestion;
  value: AnswerData;
  onChange: (v: AnswerData | null) => void;
  disabled: boolean;
}) {
  const left = q.content.left ?? [];
  const right = useMemo(() => stableShuffle(q.content.right ?? [], q.id), [q.content.right, q.id]);
  const pairs = value.pairs ?? {};
  return (
    <div className="space-y-2">
      {left.map((l) => (
        <div key={l.key} className="grid items-center gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_1.4fr]">
          <Markdown className="text-sm font-medium">{l.text}</Markdown>
          <select
            className={cn(textCls, "h-10")}
            value={pairs[l.key] ?? ""}
            disabled={disabled}
            aria-label={`Match for ${l.text}`}
            onChange={(e) => {
              const next = { ...pairs, [l.key]: e.target.value };
              if (!e.target.value) delete next[l.key];
              onChange(Object.keys(next).length ? { pairs: next } : null);
            }}
          >
            <option value="">Choose…</option>
            {right.map((r) => (
              <option key={r.key} value={r.key}>
                {r.text}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function TraceTableInput({
  q,
  value,
  onChange,
  disabled,
  wide = false,
}: {
  q: AnswerableQuestion;
  value: AnswerData;
  onChange: (v: AnswerData | null) => void;
  disabled: boolean;
  /** table_completion: text cells instead of short values */
  wide?: boolean;
}) {
  const columns = q.content.columns ?? ["Value"];
  const nRows = q.content.rows ?? 5;
  const prefill = q.content.prefill ?? [];
  const rows = value.rows ?? [];
  const cell = (r: number, c: number) => prefill[r]?.[c] ?? rows[r]?.[c] ?? "";
  const update = (r: number, c: number, text: string) => {
    const next = Array.from({ length: nRows }, (_, i) =>
      Array.from({ length: columns.length }, (_, j) => (i === r && j === c ? text : (rows[i]?.[j] ?? ""))),
    );
    onChange(next.some((row) => row.some((x) => x.trim())) ? { rows: next } : null);
  };
  return (
    <div className="overflow-x-auto">
      <table className={cn("border-collapse text-sm", wide ? "w-full" : "font-mono")}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className={cn(
                  "border border-border bg-surface-2 py-1.5 font-semibold",
                  q.content.tick ? "px-2" : "px-3",
                  q.content.tick && !prefill.some((row) => row?.[columns.indexOf(c)] != null) ? "text-center" : "text-left",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: nRows }, (_, r) => (
            <tr key={r}>
              {columns.map((_, c) => {
                const fixed = prefill[r]?.[c] != null;
                return (
                  <td key={c} className="border border-border p-0">
                    {wide && fixed ? (
                      <div className={cn("px-3 py-2 align-top", q.content.tick ? "min-w-32" : "min-w-40")}>
                        <Markdown className="text-sm">{cell(r, c)}</Markdown>
                      </div>
                    ) : wide && q.content.tick ? (
                      <label className="flex min-h-11 min-w-14 cursor-pointer items-center justify-center">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-[var(--primary)]"
                          checked={cell(r, c).trim() !== ""}
                          disabled={disabled}
                          aria-label={`${columns[c]} row ${r + 1}`}
                          onChange={(e) => update(r, c, e.target.checked ? "✓" : "")}
                        />
                      </label>
                    ) : wide ? (
                      <textarea
                        className="block min-h-16 w-full min-w-40 resize-y bg-transparent px-2 py-1.5 font-sans focus:bg-primary-soft focus:outline-none"
                        rows={2}
                        value={cell(r, c)}
                        disabled={disabled}
                        aria-label={`${columns[c]} row ${r + 1}`}
                        onChange={(e) => update(r, c, e.target.value)}
                      />
                    ) : (
                      <input
                        className={cn("h-9 w-24 bg-transparent px-2 focus:bg-primary-soft focus:outline-none", fixed && "text-muted")}
                        value={cell(r, c)}
                        readOnly={fixed}
                        disabled={disabled}
                        aria-label={`${columns[c]} row ${r + 1}`}
                        onChange={(e) => update(r, c, e.target.value)}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Question text, with fill-in-the-blank placeholders shown as numbered gaps. */
export function QuestionText({ text, type }: { text: string; type: QuestionType }) {
  const shown = type === "fill_blank" ? text.replace(/\[\[(\d+)\]\]/g, (_, n) => `**(${n})** \\_\\_\\_\\_\\_`) : text;
  return <Markdown>{shown}</Markdown>;
}
