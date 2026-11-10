"use client";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { EXISTING_IDS, SAMPLE_RECORDS, validateStudent, type StudentRecord } from "@/lib/theory/validation";

const box = "rounded-lg border border-border bg-surface p-4";
const inputCls = "h-9 w-full rounded-lg border bg-surface px-2.5 font-mono text-sm focus:outline-none";

/** Enter a record of the Students table and see which validation checks accept or reject it. */
export function ValidationChecker() {
  const [rec, setRec] = useState<StudentRecord>(SAMPLE_RECORDS[0].record);
  const { fields, accepted } = validateStudent(rec);
  return (
    <div className={box}>
      <div className="mb-3 flex flex-wrap gap-2">
        {SAMPLE_RECORDS.map((s) => (
          <button key={s.label} type="button" onClick={() => setRec(s.record)} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-surface-2">
            {s.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {fields.map((f) => {
          const bad = f.results.some((c) => !c.ok);
          return (
            <div key={f.field} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="text-sm">
                <p className="font-mono font-semibold">{f.label}</p>
                <p className="text-xs text-muted">{f.type}</p>
              </div>
              <input
                aria-label={f.label}
                className={cn(inputCls, "max-w-xs", bad ? "border-danger" : "border-border focus:border-primary")}
                value={rec[f.field]}
                onChange={(e) => setRec({ ...rec, [f.field]: e.target.value })}
              />
              <ul className="col-start-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs">
                {f.results.map((c) => (
                  <li key={c.kind + c.rule} className={cn("flex items-start gap-1.5", c.ok ? "text-success" : "text-danger")}>
                    {c.ok ? <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" /> : <XCircle className="mt-px h-3.5 w-3.5 shrink-0" />}
                    <span>
                      <b>{c.kind} check</b> — {c.ok ? c.rule : c.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className={cn("mt-4 rounded-md px-3 py-2 text-sm font-medium", accepted ? "bg-success-soft text-success" : "bg-danger-soft text-danger")}>
        {accepted ? "Record accepted and saved." : "Record rejected — the DBMS shows the error messages above."}
      </p>
      <p className="mt-2 text-xs text-muted">
        IDs already in the table: {EXISTING_IDS.join(", ")}. Try <b>Passes, but wrong</b>: every check passes, yet the surname, mark, date and phone were typed wrongly — validation checks that data is sensible, not that it is correct.
      </p>
    </div>
  );
}
