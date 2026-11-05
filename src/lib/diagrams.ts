import { evaluateBoolean, parseBoolean, variablesOf } from "./boolean";
import type { DiagramData, DiagramKind, ErdKey } from "./questions/types";

// Pure helpers for diagram answers: evaluate logic circuits, read binary trees,
// and describe any diagram as text for the AI examiner.

export const GATES = ["and", "or", "not", "nand", "nor", "xor"] as const;
export type Gate = (typeof GATES)[number];

type Env = Record<string, boolean>;
type Fn = (env: Env) => boolean;

/** Builds a function from the circuit wired to the output node, or explains why it cannot. */
export function compileCircuit(d: DiagramData, outputName?: string): { fn: Fn; inputs: string[]; expression: string } | { error: string } {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const outputs = d.nodes.filter((n) => n.type === "output");
  const out = outputName ? (outputs.find((n) => n.label.trim().toUpperCase() === outputName.toUpperCase()) ?? outputs[0]) : outputs[0];
  if (!out) return { error: "The circuit has no output." };
  const into = (id: string, handle?: string) =>
    d.edges.filter((e) => e.target === id && (handle === undefined || (e.targetHandle ?? "in1") === handle));
  const inputs = new Set<string>();
  const visiting = new Set<string>();

  const build = (id: string): { fn: Fn; expr: string } => {
    const n = byId.get(id);
    if (!n) throw new Error("A wire is connected to a missing component.");
    if (n.type === "input") {
      const name = n.label.trim().toUpperCase() || "?";
      inputs.add(name);
      return { fn: (env) => env[name] ?? false, expr: name };
    }
    if (visiting.has(id)) throw new Error("The circuit contains a loop.");
    visiting.add(id);
    const operand = (handle: string) => {
      const e = into(id, handle);
      if (e.length === 0) throw new Error(`A ${n.type.toUpperCase()} gate has an unconnected input.`);
      if (e.length > 1) throw new Error(`A ${n.type.toUpperCase()} gate input has more than one wire.`);
      return build(e[0].source);
    };
    let res: { fn: Fn; expr: string };
    switch (n.type) {
      case "not": {
        const a = operand("in1");
        res = { fn: (env) => !a.fn(env), expr: `NOT ${wrap(a.expr)}` };
        break;
      }
      case "and":
      case "or":
      case "nand":
      case "nor":
      case "xor": {
        const a = operand("in1");
        const b = operand("in2");
        const op = n.type.toUpperCase();
        const f: Record<string, (x: boolean, y: boolean) => boolean> = {
          and: (x, y) => x && y,
          or: (x, y) => x || y,
          nand: (x, y) => !(x && y),
          nor: (x, y) => !(x || y),
          xor: (x, y) => x !== y,
        };
        const g = f[n.type];
        res = { fn: (env) => g(a.fn(env), b.fn(env)), expr: `${wrap(a.expr)} ${op} ${wrap(b.expr)}` };
        break;
      }
      case "output": {
        res = operand("in");
        break;
      }
      default:
        throw new Error(`Unknown component "${n.type}".`);
    }
    visiting.delete(id);
    return res;
  };

  try {
    const { fn, expr } = build(out.id);
    return { fn, inputs: [...inputs].sort(), expression: expr };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

const wrap = (e: string) => (/\s/.test(e) ? `(${e})` : e);

/** Truth-table equivalence between a function and an expected Boolean expression. */
export function equivalentTo(expected: string, fn: Fn, extraVars: string[] = []): { equivalent: boolean; correctRows: number; totalRows: number } {
  const ast = parseBoolean(expected);
  const vars = [...new Set([...variablesOf(ast), ...extraVars.map((v) => v.toUpperCase())])].sort().slice(0, 8);
  const total = 2 ** vars.length;
  let correct = 0;
  for (let i = 0; i < total; i++) {
    const env = Object.fromEntries(vars.map((v, j) => [v, Boolean((i >> (vars.length - 1 - j)) & 1)]));
    if (evaluateBoolean(ast, env) === fn(env)) correct++;
  }
  return { equivalent: correct === total, correctRows: correct, totalRows: total };
}

export function expressionFunction(src: string): Fn {
  const ast = parseBoolean(src);
  return (env) => evaluateBoolean(ast, env);
}

/** Binary tree drawn in the builder → level-order array (null for empty positions). */
export function treeLevelOrder(d: DiagramData): (string | null)[] | { error: string } {
  if (d.nodes.length === 0) return { error: "The tree is empty." };
  const incoming = new Map<string, number>();
  for (const e of d.edges) incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1);
  if ([...incoming.values()].some((n) => n > 1)) return { error: "A node has more than one parent." };
  const roots = d.nodes.filter((n) => !incoming.has(n.id));
  if (roots.length !== 1) return { error: roots.length === 0 ? "The tree has no root." : "Some nodes are not connected to the tree." };
  const child = (id: string, side: "left" | "right") => {
    const e = d.edges.find((x) => x.source === id && (x.sourceHandle ?? "") === side);
    return e ? d.nodes.find((n) => n.id === e.target) : undefined;
  };
  const out: (string | null)[] = [];
  let level: ({ id: string; label: string } | undefined)[] = [roots[0]];
  for (let depth = 0; depth < 8 && level.some(Boolean); depth++) {
    const next: ({ id: string; label: string } | undefined)[] = [];
    for (const n of level) {
      out.push(n ? n.label.trim() : null);
      next.push(n ? child(n.id, "left") : undefined, n ? child(n.id, "right") : undefined);
    }
    level = next;
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/** Builds the expected level-order array for keys inserted into a binary search tree. */
export function bstLevelOrder(keys: string[]): (string | null)[] {
  type N = { v: string; l?: N; r?: N };
  const cmp = (a: string, b: string) => {
    const x = Number(a);
    const y = Number(b);
    return Number.isFinite(x) && Number.isFinite(y) ? x - y : a.localeCompare(b);
  };
  let root: N | undefined;
  for (const k of keys) {
    const node: N = { v: k };
    if (!root) {
      root = node;
      continue;
    }
    let cur = root;
    for (;;) {
      if (cmp(k, cur.v) < 0) {
        if (!cur.l) {
          cur.l = node;
          break;
        }
        cur = cur.l;
      } else {
        if (!cur.r) {
          cur.r = node;
          break;
        }
        cur = cur.r;
      }
    }
  }
  const out: (string | null)[] = [];
  let level: (N | undefined)[] = [root];
  while (level.some(Boolean)) {
    const next: (N | undefined)[] = [];
    for (const n of level) {
      out.push(n ? n.v : null);
      next.push(n?.l, n?.r);
    }
    level = next;
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

const SHAPE: Record<string, string> = {
  terminator: "Start/End",
  process: "Process",
  decision: "Decision",
  io: "Input/Output",
  entity: "External entity",
  dfd_process: "Process",
  store: "Data store",
  er_entity: "Entity",
  input: "Input",
  output: "Output",
  tree_node: "Node",
};

/** Plain-text description of a diagram answer for the AI examiner. */
export function diagramToText(kind: DiagramKind, d: DiagramData): string {
  const name = new Map(d.nodes.map((n, i) => [n.id, `[${i + 1}] ${n.label.trim() || "(no label)"}`]));
  const lines: string[] = [];
  if (kind === "logic_circuit") {
    const c = compileCircuit(d);
    lines.push("Logic circuit components:");
    for (const n of d.nodes) lines.push(`- ${name.get(n.id)}: ${n.type.toUpperCase()}`);
    lines.push("Wires:");
    for (const e of d.edges) lines.push(`- ${name.get(e.source)} → ${name.get(e.target)}${e.targetHandle ? ` (${e.targetHandle})` : ""}`);
    lines.push("error" in c ? `The circuit cannot be evaluated: ${c.error}` : `Equivalent Boolean expression of the drawn circuit: X = ${c.expression}`);
    return lines.join("\n");
  }
  if (kind === "binary_tree") {
    const t = treeLevelOrder(d);
    lines.push("error" in t ? `Tree drawing problem: ${t.error}` : `Binary tree in level order (null = empty): [${t.map((x) => x ?? "null").join(", ")}]`);
    return lines.join("\n");
  }
  lines.push("Shapes:");
  for (const n of d.nodes) lines.push(`- ${name.get(n.id)} — ${SHAPE[n.type] ?? n.type}`);
  lines.push(kind === "erd" ? "Relationships:" : "Arrows / flows:");
  for (const e of d.edges) {
    lines.push(`- ${name.get(e.source)} ${kind === "erd" ? "—" : "→"} ${name.get(e.target)}${e.label ? `  [${e.label}]` : ""}`);
  }
  if (d.edges.length === 0) lines.push("- (none)");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// ERD marking: entities, the pairs they link and the degree of each link
// ---------------------------------------------------------------------------
const word = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b(pk|fk|primary key|foreign key)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
/** "Members", "MEMBER", "member" → "member"; "Classes" → "class"; "Categories" → "category" */
const singular = (w: string) => (w.endsWith("ies") ? `${w.slice(0, -3)}y` : w.endsWith("sses") || w.endsWith("ches") || w.endsWith("shes") ? w.slice(0, -2) : w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
const same = (a: string, b: string) => singular(word(a)) === singular(word(b));

/** "1:M", "1:N", "one-to-many", "1-M" … → "1:M" | "M:1" | "1:1" | "M:M" (null when it says nothing). */
export function erdDegree(label: string | undefined): "1:1" | "1:M" | "M:1" | "M:M" | null {
  const t = (label ?? "").toLowerCase().replace(/\s+/g, "").replace(/[-–]/g, ":").replace(/to/g, ":");
  const side = (x: string) => (/^(1|one)$/.test(x) ? "1" : /^(m|n|many|\*|∞)$/.test(x) ? "M" : null);
  const m = /^([a-z0-9*∞]+):+([a-z0-9*∞]+)$/.exec(t);
  if (!m) return null;
  const a = side(m[1]);
  const b = side(m[2]);
  return a && b ? (`${a}:${b}` as "1:1" | "1:M" | "M:1" | "M:M") : null;
}

export type ErdMarking = {
  entities: { found: number; total: number };
  keys: { found: number; total: number };
  relationships: { correct: number; linked: number; total: number };
  /** entities and links drawn that the scenario does not need */
  extra: number;
};

/** Compares a drawn ERD with the answer key. Names are matched ignoring case, plurals and spaces. */
export function markErd(d: DiagramData, key: ErdKey): ErdMarking {
  const boxes = d.nodes
    .filter((n) => n.type === "er_entity")
    .map((n) => {
      // "MEMBER" then attributes on new lines, or "Member (MemberID, Name)", or "Member: MemberID, Name"
      const [first = "", ...rest] = n.label.split(/\n/).map((x) => x.trim()).filter(Boolean);
      const m = /^([^(:]*)[(:]?(.*?)\)?$/.exec(first);
      const name = (m?.[1] ?? first).trim();
      const attrs = [m?.[2] ?? "", ...rest].flatMap((x) => x.split(/[,;]/)).map((x) => x.trim()).filter(Boolean);
      return { id: n.id, name, attrs };
    });
  const which = new Map<string, number>(); // node id → key entity index
  key.entities.forEach((e, i) => {
    const box = boxes.find((b) => !which.has(b.id) && [e.name, ...(e.aliases ?? [])].some((x) => same(x, b.name)));
    if (box) which.set(box.id, i);
  });
  const found = new Set(which.values());
  const keysTotal = key.entities.filter((e) => e.key?.length).length;
  let keysFound = 0;
  key.entities.forEach((e, i) => {
    if (!e.key?.length) return;
    const box = boxes.find((b) => which.get(b.id) === i);
    if (box && box.attrs.some((at) => e.key!.some((k) => same(k, at)))) keysFound++;
  });

  const index = (name: string) => key.entities.findIndex((e) => e.name === name);
  let correct = 0;
  let linked = 0;
  const used = new Set<string>();
  for (const r of key.relationships) {
    const ia = index(r.a);
    const ib = index(r.b);
    const edge = d.edges.find((x) => !used.has(x.id) && ((which.get(x.source) === ia && which.get(x.target) === ib) || (which.get(x.source) === ib && which.get(x.target) === ia)));
    if (!edge) continue;
    used.add(edge.id);
    linked++;
    const forward = which.get(edge.source) === ia;
    const drawn = erdDegree(typeof edge.label === "string" ? edge.label : undefined);
    const want = forward ? r.degree : r.degree === "1:M" ? "M:1" : r.degree;
    if (drawn === want) correct++;
  }
  const extra = boxes.filter((b) => !which.has(b.id)).length + d.edges.filter((x) => !used.has(x.id)).length;
  return {
    entities: { found: found.size, total: key.entities.length },
    keys: { found: keysFound, total: keysTotal },
    relationships: { correct, linked, total: key.relationships.length },
    extra,
  };
}
