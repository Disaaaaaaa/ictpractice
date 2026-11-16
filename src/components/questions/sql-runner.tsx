"use client";
import { useState, useTransition } from "react";
import { Database, Loader2, Play, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { cn } from "@/lib/cn";
import { runSqlQuestion } from "@/lib/sql/actions";
import type { SqlResultSet, SqlRun, SqlTable } from "@/lib/sql/sandbox";

/**
 * SQL answer box with a Run button: the code runs on the question's sample
 * database (on the server, rolled back afterwards) and the results and the
 * tables are shown underneath. Running never marks the answer.
 */
export function SqlRunner({
  questionId,
  value,
  onChange,
  disabled,
}: {
  questionId: string;
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
}) {
  const [run, setRun] = useState<SqlRun | null>(null);
  const [mode, setMode] = useState<"run" | "tables">("run");
  const [pending, start] = useTransition();
  const go = (code: string, m: "run" | "tables") =>
    start(async () => {
      setMode(m);
      setRun(await runSqlQuestion(questionId, code));
    });

  const shown = run?.results.filter((r) => r.columns.length > 0) ?? [];
  const changes = run?.results.filter((r) => r.columns.length === 0) ?? [];

  return (
    <div className="space-y-3">
      <CodeEditor language="sql" value={value} readOnly={disabled} onChange={onChange} label="SQL answer" minHeight="9rem" />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => go(value, "run")} disabled={pending || !value.trim()}>
          {pending && mode === "run" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run SQL
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => go("", "tables")} disabled={pending}>
          {pending && mode === "tables" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />} Show the database
        </Button>
        <span className="text-xs text-muted">Running does not mark your answer — press Check Answer when you are ready.</span>
      </div>

      {run && (
        <div className="space-y-3 rounded-lg border border-border bg-surface-2 p-3">
          {run.error && (
            <p className="rounded-md border border-danger/40 bg-danger-soft px-3 py-2 font-mono text-xs text-danger">Error: {run.error}</p>
          )}
          {mode === "run" && !run.error && (
            <>
              {changes.length > 0 && (
                <ul className="space-y-0.5 text-xs text-muted">
                  {changes.map((c, i) => (
                    <li key={i}>
                      ✓ {c.command || "Statement"}
                      {["INSERT", "UPDATE", "DELETE"].includes(c.command) ? ` — ${c.rowCount} row${c.rowCount === 1 ? "" : "s"}` : ""}
                    </li>
                  ))}
                </ul>
              )}
              {shown.map((r, i) => (
                <ResultTable key={i} title={shown.length > 1 ? `Result ${i + 1}` : "Result"} set={r} />
              ))}
              {shown.length === 0 && changes.length === 0 && <p className="text-xs text-muted">The code ran but produced nothing.</p>}
            </>
          )}
          {run.tables.length > 0 && (
            <details open={mode === "tables" || shown.length === 0}>
              <summary className="cursor-pointer text-xs font-semibold text-muted">
                <Table2 className="mr-1 inline h-3.5 w-3.5" />
                {mode === "tables" ? "Tables in the database" : "Tables after your code"}
              </summary>
              <div className="mt-2 grid gap-3 xl:grid-cols-2">
                {run.tables.map((t) => (
                  <DbTable key={t.name} table={t} />
                ))}
              </div>
            </details>
          )}
          {run.tables.length === 0 && !run.error && mode === "tables" && <p className="text-xs text-muted">The database has no tables yet.</p>}
        </div>
      )}
    </div>
  );
}

function Grid({ columns, rows }: { columns: string[]; rows: (string | null)[][] }) {
  return (
    <div className="max-h-72 overflow-auto rounded-md border border-border bg-surface">
      <table className="w-full border-collapse font-mono text-xs">
        <thead className="sticky top-0 bg-surface-2">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="border-b border-border px-2 py-1 text-left font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-surface even:bg-surface-2/50">
              {r.map((v, j) => (
                <td key={j} className={cn("border-b border-border/60 px-2 py-1 whitespace-nowrap", v === null && "text-muted italic")}>
                  {v ?? "NULL"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultTable({ title, set }: { title: string; set: SqlResultSet }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold">
        {title} <span className="font-normal text-muted">· {set.rowCount} row{set.rowCount === 1 ? "" : "s"}</span>
      </p>
      {set.rows.length ? <Grid columns={set.columns} rows={set.rows} /> : <p className="text-xs text-muted">No rows.</p>}
    </div>
  );
}

function DbTable({ table }: { table: SqlTable }) {
  return (
    <div>
      <p className="mb-1 font-mono text-xs font-semibold">
        {table.name} <span className="font-sans font-normal text-muted">· {table.total} row{table.total === 1 ? "" : "s"}</span>
      </p>
      {table.columns.length ? <Grid columns={table.columns} rows={table.rows} /> : <p className="text-xs text-muted">No columns.</p>}
    </div>
  );
}
