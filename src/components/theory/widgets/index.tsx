"use client";
import { useMemo, useState } from "react";
import type { InteractiveWidget } from "@/lib/theory/blocks";
import { evaluateBoolean, parseBoolean, variablesOf } from "@/lib/boolean";
import { BinarySearchVisualizer, SortVisualizer } from "./algorithms";

const box = "rounded-lg border border-border bg-surface p-4";
const inputCls =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-sm focus:border-primary focus:outline-none";

function BaseConverter() {
  const [value, setValue] = useState("45");
  const [base, setBase] = useState(10);
  const n = useMemo(() => {
    const clean = value.trim().replace(/\s+/g, "");
    if (!clean) return null;
    const valid = { 2: /^[01]+$/, 10: /^\d+$/, 16: /^[0-9a-fA-F]+$/ }[base as 2 | 10 | 16];
    if (!valid?.test(clean)) return null;
    const parsed = parseInt(clean, base);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }, [value, base]);
  const steps = useMemo(() => {
    if (n === null || n === 0 || n > 1_000_000) return [];
    const out: string[] = [];
    let x = n;
    while (x > 0) {
      out.push(`${x} ÷ 2 = ${Math.floor(x / 2)} remainder ${x % 2}`);
      x = Math.floor(x / 2);
    }
    return out;
  }, [n]);
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Number</span>
          <input className={inputCls} value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Base</span>
          <select className={inputCls} value={base} onChange={(e) => setBase(Number(e.target.value))}>
            <option value={2}>Binary (2)</option>
            <option value={10}>Denary (10)</option>
            <option value={16}>Hexadecimal (16)</option>
          </select>
        </label>
      </div>
      {n === null ? (
        <p className="mt-3 text-sm text-danger">Enter a valid non-negative whole number for this base.</p>
      ) : (
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          {[
            ["Binary", n.toString(2).replace(/\B(?=(\d{4})+(?!\d))/g, " ")],
            ["Denary", n.toString(10)],
            ["Hexadecimal", n.toString(16).toUpperCase()],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-surface-2 px-3 py-2">
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="font-mono text-base font-semibold break-all">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {steps.length > 0 && base !== 2 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium">Show repeated division by 2</summary>
          <ol className="mt-2 space-y-0.5 font-mono text-xs">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="mt-1 text-xs text-muted">Read the remainders from bottom to top.</p>
        </details>
      )}
    </div>
  );
}

function TwosComplement({ bits: initialBits = 8 }: { bits?: number }) {
  const [bits, setBits] = useState(initialBits);
  const [value, setValue] = useState(-45);
  const min = -(2 ** (bits - 1));
  const max = 2 ** (bits - 1) - 1;
  const inRange = Number.isInteger(value) && value >= min && value <= max;
  const pattern = inRange ? ((value + 2 ** bits) % 2 ** bits).toString(2).padStart(bits, "0") : null;
  const magnitude = Math.abs(value).toString(2).padStart(bits, "0");
  const inverted = magnitude.replace(/[01]/g, (c) => (c === "0" ? "1" : "0"));
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Denary value</span>
          <input type="number" className={inputCls} value={value} onChange={(e) => setValue(Number(e.target.value))} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Number of bits</span>
          <select className={inputCls} value={bits} onChange={(e) => setBits(Number(e.target.value))}>
            {[4, 8, 12, 16].map((b) => (
              <option key={b} value={b}>
                {b} bits (range {-(2 ** (b - 1))} to {2 ** (b - 1) - 1})
              </option>
            ))}
          </select>
        </label>
      </div>
      {!inRange ? (
        <p className="mt-3 text-sm text-danger">
          {value} cannot be represented in {bits}-bit two&apos;s complement (range {min} to {max}).
        </p>
      ) : (
        <div className="mt-4 space-y-2 font-mono text-sm">
          <div className="flex flex-wrap gap-1">
            {pattern!.split("").map((b, i) => (
              <span key={i} className="flex flex-col items-center">
                <span className="text-[10px] text-muted">{i === 0 ? -(2 ** (bits - 1)) : 2 ** (bits - 1 - i)}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-md border ${b === "1" ? "border-primary bg-primary-soft font-bold text-primary" : "border-border"}`}>
                  {b}
                </span>
              </span>
            ))}
          </div>
          {value < 0 && (
            <ol className="list-decimal space-y-0.5 pl-5 font-sans text-xs text-muted">
              <li>Write +{Math.abs(value)} in binary: <code>{magnitude}</code></li>
              <li>Invert every bit: <code>{inverted}</code></li>
              <li>Add 1: <code>{pattern}</code></li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

function BinaryAddition() {
  const [a, setA] = useState("01101101");
  const [b, setB] = useState("00110110");
  const ok = /^[01]{1,16}$/.test(a) && /^[01]{1,16}$/.test(b);
  const width = Math.max(a.length, b.length);
  const sum = ok ? (parseInt(a, 2) + parseInt(b, 2)).toString(2) : "";
  const carries = useMemo(() => {
    if (!ok) return "";
    const A = a.padStart(width, "0");
    const B = b.padStart(width, "0");
    let c = 0;
    const row: string[] = [];
    for (let i = width - 1; i >= 0; i--) {
      const s = Number(A[i]) + Number(B[i]) + c;
      c = s >= 2 ? 1 : 0;
      row.unshift(c ? "1" : " ");
    }
    return row.join("");
  }, [a, b, ok, width]);
  const overflow = ok && sum.length > width;
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={inputCls} value={a} onChange={(e) => setA(e.target.value.trim())} aria-label="First binary number" />
        <input className={inputCls} value={b} onChange={(e) => setB(e.target.value.trim())} aria-label="Second binary number" />
      </div>
      {!ok ? (
        <p className="mt-3 text-sm text-danger">Use only 0 and 1 (up to 16 bits).</p>
      ) : (
        <pre className="mt-4 overflow-x-auto rounded-md bg-surface-2 p-3 text-right font-mono text-base leading-7">
{`carry  ${carries.padStart(sum.length)}
       ${a.padStart(sum.length)}
     + ${b.padStart(sum.length)}
       ${"-".repeat(sum.length)}
       ${sum}`}
        </pre>
      )}
      {overflow && (
        <p className="mt-2 text-sm text-warning">
          The result needs {sum.length} bits: in a {width}-bit register this is an <strong>overflow</strong>.
        </p>
      )}
    </div>
  );
}

function TruthTable({ expression = "NOT (A AND B) OR C" }: { expression?: string }) {
  const [expr, setExpr] = useState(expression);
  const result = useMemo(() => {
    try {
      const ast = parseBoolean(expr);
      const vars = variablesOf(ast);
      if (vars.length > 5) return { error: "Use at most 5 variables." };
      const rows = Array.from({ length: 2 ** vars.length }, (_, i) => {
        const env = Object.fromEntries(vars.map((v, j) => [v, Boolean((i >> (vars.length - 1 - j)) & 1)]));
        return { env, out: evaluateBoolean(ast, env) };
      });
      return { vars, rows };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [expr]);
  return (
    <div className={box}>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Expression</span>
        <input className={inputCls} value={expr} onChange={(e) => setExpr(e.target.value)} />
      </label>
      <p className="mt-1 text-xs text-muted">Operators: AND, OR, NOT, NAND, NOR, XOR, brackets. Variables: single capital letters.</p>
      {"error" in result ? (
        <p className="mt-3 text-sm text-danger">{result.error}</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="border-collapse font-mono text-sm">
            <thead>
              <tr>
                {result.vars!.map((v) => (
                  <th key={v} className="border border-border bg-surface-2 px-3 py-1">{v}</th>
                ))}
                <th className="border border-border bg-primary-soft px-3 py-1 text-primary">X</th>
              </tr>
            </thead>
            <tbody>
              {result.rows!.map((r, i) => (
                <tr key={i}>
                  {result.vars!.map((v) => (
                    <td key={v} className="border border-border px-3 py-1 text-center">{r.env[v] ? 1 : 0}</td>
                  ))}
                  <td className="border border-border px-3 py-1 text-center font-bold">{r.out ? 1 : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StackQueue() {
  const [mode, setMode] = useState<"stack" | "queue">("stack");
  const [items, setItems] = useState<string[]>(["12", "7", "31"]);
  const [next, setNext] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const capacity = 6;
  const add = () => {
    const v = next.trim() || String(Math.floor(Math.random() * 90) + 10);
    if (items.length >= capacity) return setLog((l) => [`${mode === "stack" ? "PUSH" : "ENQUEUE"} ${v} → overflow (structure full)`, ...l]);
    setItems((s) => [...s, v]);
    setLog((l) => [`${mode === "stack" ? "PUSH" : "ENQUEUE"} ${v}`, ...l]);
    setNext("");
  };
  const remove = () => {
    if (items.length === 0) return setLog((l) => [`${mode === "stack" ? "POP" : "DEQUEUE"} → underflow (structure empty)`, ...l]);
    const v = mode === "stack" ? items[items.length - 1] : items[0];
    setItems((s) => (mode === "stack" ? s.slice(0, -1) : s.slice(1)));
    setLog((l) => [`${mode === "stack" ? "POP" : "DEQUEUE"} → ${v}`, ...l]);
  };
  return (
    <div className={box}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border p-0.5 text-sm">
          {(["stack", "queue"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setLog([]);
              }}
              className={`rounded-md px-3 py-1 font-medium ${mode === m ? "bg-primary text-primary-fg" : "text-muted"}`}
            >
              {m === "stack" ? "Stack (LIFO)" : "Queue (FIFO)"}
            </button>
          ))}
        </div>
        <input className={`${inputCls} w-24`} value={next} placeholder="value" onChange={(e) => setNext(e.target.value)} aria-label="Value to add" />
        <button type="button" onClick={add} className="h-10 rounded-lg bg-primary px-3 text-sm font-medium text-primary-fg">
          {mode === "stack" ? "Push" : "Enqueue"}
        </button>
        <button type="button" onClick={remove} className="h-10 rounded-lg border border-border px-3 text-sm font-medium">
          {mode === "stack" ? "Pop" : "Dequeue"}
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {mode === "stack" ? (
          <div className="flex flex-col-reverse items-center gap-1">
            {items.map((v, i) => (
              <div key={i} className="flex w-32 items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-1.5 font-mono text-sm">
                <span>{v}</span>
                {i === items.length - 1 && <span className="text-xs font-semibold text-primary">← top</span>}
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-muted">empty (top = −1)</p>}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1">
            {items.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] font-semibold text-primary">{i === 0 ? "front" : i === items.length - 1 ? "rear" : " "}</span>
                <span className="rounded-md border border-border bg-surface-2 px-3 py-1.5 font-mono text-sm">{v}</span>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-muted">empty</p>}
          </div>
        )}
        <ol className="max-h-40 space-y-0.5 overflow-y-auto font-mono text-xs text-muted">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function InteractiveBlock({ widget, title, config }: { widget: InteractiveWidget; title?: string; config?: Record<string, unknown> }) {
  const body = (() => {
    switch (widget) {
      case "base_converter":
        return <BaseConverter />;
      case "twos_complement":
        return <TwosComplement bits={typeof config?.bits === "number" ? config.bits : 8} />;
      case "binary_addition":
        return <BinaryAddition />;
      case "truth_table":
        return <TruthTable expression={typeof config?.expression === "string" ? config.expression : undefined} />;
      case "stack_queue":
        return <StackQueue />;
      case "sort_visualizer": {
        const values = Array.isArray(config?.values) ? (config.values as unknown[]).filter((x): x is number => typeof x === "number") : undefined;
        return <SortVisualizer algorithm={config?.algorithm === "insertion" ? "insertion" : "bubble"} values={values && values.length >= 2 ? values : undefined} />;
      }
      case "binary_search": {
        const values = Array.isArray(config?.values) ? (config.values as unknown[]).filter((x): x is number => typeof x === "number") : undefined;
        return <BinarySearchVisualizer values={values && values.length >= 2 ? values : undefined} target={typeof config?.target === "number" ? config.target : undefined} />;
      }
    }
  })();
  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-semibold uppercase tracking-wide text-primary">
        Interactive · {title ?? widget.replace(/_/g, " ")}
      </figcaption>
      {body}
    </figure>
  );
}
