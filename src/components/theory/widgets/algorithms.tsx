"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

// Step-through visualisations for sorting and binary search. Indexes are shown
// from 1, matching the Cambridge-style pseudocode used in the theory packs.

type SortStep = {
  array: number[];
  active: number[]; // indexes being compared / moved
  sorted: number[]; // indexes known to be in final position
  key?: number | null; // insertion sort: value being inserted
  note: string;
  comparisons: number;
  moves: number;
};

function bubbleSteps(input: number[]): SortStep[] {
  const a = [...input];
  const n = a.length;
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;
  const push = (active: number[], note: string) =>
    steps.push({ array: [...a], active, sorted: [...sorted], note, comparisons, moves });
  push([], "Start. Each pass compares neighbours and swaps them if they are in the wrong order.");
  for (let pass = 1; pass <= n - 1; pass++) {
    let swapped = false;
    for (let j = 0; j < n - pass; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) {
        push([j, j + 1], `Pass ${pass}: ${a[j]} > ${a[j + 1]} → swap.`);
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        moves++;
        swapped = true;
        push([j, j + 1], `Swapped. Array is now ${a.join(", ")}.`);
      } else {
        push([j, j + 1], `Pass ${pass}: ${a[j]} ≤ ${a[j + 1]} → no swap.`);
      }
    }
    sorted.add(n - pass);
    if (!swapped) {
      for (let i = 0; i < n; i++) sorted.add(i);
      push([], `Pass ${pass} made no swaps, so the array is sorted — stop early.`);
      return steps;
    }
    push([], `End of pass ${pass}: the largest remaining value (${a[n - pass]}) is now in its final position.`);
  }
  for (let i = 0; i < n; i++) sorted.add(i);
  push([], "Sorted.");
  return steps;
}

function insertionSteps(input: number[]): SortStep[] {
  const a = [...input];
  const n = a.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;
  const sortedUpTo = (i: number) => Array.from({ length: i + 1 }, (_, k) => k);
  const push = (active: number[], note: string, sortedCount: number, key: number | null = null) =>
    steps.push({ array: [...a], active, sorted: sortedUpTo(sortedCount), key, note, comparisons, moves });
  push([], "Start. The first item on its own is a sorted list. Each new item is inserted into the sorted part.", 0);
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    push([i], `Take item ${i + 1} (value ${key}) as the key to insert.`, i - 1, key);
    while (j >= 0) {
      comparisons++;
      if (a[j] > key) {
        a[j + 1] = a[j];
        moves++;
        push([j, j + 1], `${a[j]} > ${key} → shift ${a[j]} one place right.`, i - 1, key);
        j--;
      } else {
        push([j], `${a[j]} ≤ ${key} → stop shifting.`, i - 1, key);
        break;
      }
    }
    a[j + 1] = key;
    push([j + 1], `Insert ${key} at position ${j + 2}. Items 1–${i + 1} are now sorted.`, i);
  }
  push([], "Sorted.", n - 1);
  return steps;
}

function parseNumbers(text: string, max = 12): number[] | null {
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  if (parts.length < 2 || parts.length > max) return null;
  const nums = parts.map(Number);
  return nums.every((x) => Number.isInteger(x) && Math.abs(x) < 1000) ? nums : null;
}

const inputCls =
  "h-10 rounded-lg border border-border bg-surface px-3 font-mono text-sm focus:border-primary focus:outline-none";
const btn = "h-9 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-2 disabled:opacity-40";

function useStepper(length: number) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setI((x) => {
        if (x >= length - 1) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, [playing, length]);
  return { i: Math.min(i, Math.max(0, length - 1)), setI, playing, setPlaying };
}

export function SortVisualizer({ algorithm: initialAlgorithm = "bubble", values = [5, 1, 4, 2, 8] }: { algorithm?: "bubble" | "insertion"; values?: number[] }) {
  const [algorithm, setAlgorithm] = useState(initialAlgorithm);
  const [text, setText] = useState(values.join(", "));
  const [data, setData] = useState(values);
  const steps = useMemo(() => (algorithm === "bubble" ? bubbleSteps(data) : insertionSteps(data)), [algorithm, data]);
  const { i, setI, playing, setPlaying } = useStepper(steps.length);
  const step = steps[i];
  const parsed = parseNumbers(text);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border p-0.5 text-sm">
          {(["bubble", "insertion"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAlgorithm(a);
                setI(0);
                setPlaying(false);
              }}
              aria-pressed={algorithm === a}
              className={cn("rounded-md px-3 py-1 font-medium", algorithm === a ? "bg-primary text-primary-fg" : "text-muted")}
            >
              {a === "bubble" ? "Bubble sort" : "Insertion sort"}
            </button>
          ))}
        </div>
        <input className={cn(inputCls, "w-52")} value={text} onChange={(e) => setText(e.target.value)} aria-label="Values to sort" />
        <button
          type="button"
          className={btn}
          disabled={!parsed}
          onClick={() => {
            if (!parsed) return;
            setData(parsed);
            setI(0);
            setPlaying(false);
          }}
        >
          Use these values
        </button>
      </div>
      {!parsed && <p className="mt-1 text-xs text-danger">Enter 2–12 whole numbers separated by commas.</p>}

      <div className="mt-5 flex flex-wrap items-end gap-2" aria-live="polite">
        {step.array.map((v, k) => (
          <div key={k} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono text-base font-semibold transition-colors",
                step.active.includes(k)
                  ? "border-warning bg-warning-soft text-warning"
                  : step.sorted.includes(k)
                    ? "border-success bg-success-soft text-success"
                    : "border-border bg-surface-2",
              )}
            >
              {v}
            </div>
            <span className="text-[10px] text-muted">{k + 1}</span>
          </div>
        ))}
        {algorithm === "insertion" && step.key != null && (
          <div className="ml-3 flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-primary bg-primary-soft font-mono font-semibold text-primary">
              {step.key}
            </div>
            <span className="text-[10px] font-semibold text-primary">key</span>
          </div>
        )}
      </div>

      <p className="mt-4 min-h-10 text-sm">{step.note}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={() => setI(0)} disabled={i === 0}>Reset</button>
        <button type="button" className={btn} onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
        <button type="button" className={btn} onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i >= steps.length - 1}>Step</button>
        <button type="button" className={cn(btn, "bg-primary text-primary-fg hover:bg-primary-hover")} onClick={() => setPlaying(!playing)} disabled={i >= steps.length - 1}>
          {playing ? "Pause" : "Play"}
        </button>
        <span className="ml-auto text-xs text-muted tabular-nums">
          Step {i + 1}/{steps.length} · comparisons {step.comparisons} · {algorithm === "bubble" ? "swaps" : "shifts"} {step.moves}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">
        <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-warning" />compared / moved</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-success" />{algorithm === "bubble" ? "in final position" : "sorted part"}</span>
      </p>
    </div>
  );
}

type SearchStep = { low: number; high: number; mid: number | null; note: string; found: number | null; done: boolean };

function binarySteps(a: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let low = 1;
  let high = a.length;
  steps.push({ low, high, mid: null, note: `Search for ${target}. low = 1, high = ${a.length}.`, found: null, done: false });
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const v = a[mid - 1];
    if (v === target) {
      steps.push({ low, high, mid, note: `mid = (${low} + ${high}) DIV 2 = ${mid}. A[${mid}] = ${v} = ${target} → found at position ${mid}.`, found: mid, done: true });
      return steps;
    }
    if (v < target) {
      steps.push({ low, high, mid, note: `mid = (${low} + ${high}) DIV 2 = ${mid}. A[${mid}] = ${v} < ${target} → search the upper half: low = ${mid + 1}.`, found: null, done: false });
      low = mid + 1;
    } else {
      steps.push({ low, high, mid, note: `mid = (${low} + ${high}) DIV 2 = ${mid}. A[${mid}] = ${v} > ${target} → search the lower half: high = ${mid - 1}.`, found: null, done: false });
      high = mid - 1;
    }
  }
  steps.push({ low, high, mid: null, note: `low (${low}) > high (${high}) → ${target} is not in the array.`, found: null, done: true });
  return steps;
}

export function BinarySearchVisualizer({ values = [3, 8, 12, 17, 23, 31, 38, 44, 52, 60, 71], target: initialTarget = 38 }: { values?: number[]; target?: number }) {
  const [text, setText] = useState(values.join(", "));
  const [data, setData] = useState([...values].sort((x, y) => x - y));
  const [targetText, setTargetText] = useState(String(initialTarget));
  const target = Number(targetText);
  const steps = useMemo(() => (Number.isInteger(target) ? binarySteps(data, target) : []), [data, target]);
  const { i, setI, playing, setPlaying } = useStepper(steps.length);
  const step = steps[i];
  const parsed = parseNumbers(text, 16);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className={cn(inputCls, "w-64")} value={text} onChange={(e) => setText(e.target.value)} aria-label="Values (sorted automatically)" />
        <button
          type="button"
          className={btn}
          disabled={!parsed}
          onClick={() => {
            if (!parsed) return;
            setData([...parsed].sort((x, y) => x - y));
            setI(0);
            setPlaying(false);
          }}
        >
          Use (sorted)
        </button>
        <label className="ml-2 flex items-center gap-2 text-sm">
          Find
          <input
            className={cn(inputCls, "w-20")}
            value={targetText}
            onChange={(e) => {
              setTargetText(e.target.value);
              setI(0);
              setPlaying(false);
            }}
            aria-label="Target value"
          />
        </label>
      </div>
      <p className="mt-1 text-xs text-muted">Binary search only works on a sorted array, so the values are sorted first.</p>

      {step && (
        <>
          <div className="mt-5 flex flex-wrap gap-1.5" aria-live="polite">
            {data.map((v, k) => {
              const pos = k + 1;
              const inRange = pos >= step.low && pos <= step.high;
              const isMid = step.mid === pos;
              return (
                <div key={k} className="flex flex-col items-center gap-1">
                  <span className="h-3 text-[10px] font-semibold text-primary">
                    {pos === step.low && !step.done ? "low" : ""}
                  </span>
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono font-semibold transition-colors",
                      step.found === pos
                        ? "border-success bg-success text-white"
                        : isMid
                          ? "border-warning bg-warning-soft text-warning"
                          : inRange
                            ? "border-primary/50 bg-primary-soft"
                            : "border-border bg-surface-2 text-muted opacity-50",
                    )}
                  >
                    {v}
                  </div>
                  <span className="text-[10px] text-muted">{pos}</span>
                  <span className="h-3 text-[10px] font-semibold text-primary">
                    {isMid && !step.found ? "mid" : pos === step.high && !step.done ? "high" : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 min-h-10 text-sm">{step.note}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" className={btn} onClick={() => setI(0)} disabled={i === 0}>Reset</button>
            <button type="button" className={btn} onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
            <button type="button" className={btn} onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i >= steps.length - 1}>Step</button>
            <button type="button" className={cn(btn, "bg-primary text-primary-fg hover:bg-primary-hover")} onClick={() => setPlaying(!playing)} disabled={i >= steps.length - 1}>
              {playing ? "Pause" : "Play"}
            </button>
            <span className="ml-auto text-xs text-muted tabular-nums">
              Comparisons: {steps.slice(0, i + 1).filter((s) => s.mid !== null).length} · items: {data.length} · worst case ⌈log₂(n+1)⌉ = {Math.ceil(Math.log2(data.length + 1))}
            </span>
          </div>
        </>
      )}
      {!step && <p className="mt-3 text-sm text-danger">Enter a whole number to search for.</p>}
    </div>
  );
}
