"use client";
import { useCallback, useMemo, useState } from "react";
import {
  Background,
  ConnectionMode,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/use-theme";
import type { DiagramData, DiagramKind, QuestionContent } from "@/lib/questions/types";

// Diagram answers: students place shapes and connect them. The answer is saved
// as plain nodes/edges (DiagramData); src/lib/diagrams.ts evaluates circuits
// and trees and describes other diagrams for the AI examiner.

type NodeData = { label: string; fixed?: boolean };
type FlowNode = Node<NodeData>;

type PaletteItem = { type: string; label: string; defaultLabel: string };

const PALETTES: Record<DiagramKind, PaletteItem[]> = {
  logic_circuit: [
    { type: "input", label: "Input", defaultLabel: "" },
    { type: "and", label: "AND", defaultLabel: "" },
    { type: "or", label: "OR", defaultLabel: "" },
    { type: "not", label: "NOT", defaultLabel: "" },
    { type: "nand", label: "NAND", defaultLabel: "" },
    { type: "nor", label: "NOR", defaultLabel: "" },
    { type: "xor", label: "XOR", defaultLabel: "" },
    { type: "output", label: "Output", defaultLabel: "X" },
  ],
  flowchart: [
    { type: "terminator", label: "Start / End", defaultLabel: "START" },
    { type: "process", label: "Process", defaultLabel: "Process" },
    { type: "decision", label: "Decision", defaultLabel: "Condition?" },
    { type: "io", label: "Input / Output", defaultLabel: "INPUT x" },
  ],
  dfd: [
    { type: "entity", label: "External entity", defaultLabel: "Entity" },
    { type: "dfd_process", label: "Process", defaultLabel: "Process" },
    { type: "store", label: "Data store", defaultLabel: "D1 Store" },
  ],
  erd: [{ type: "er_entity", label: "Entity", defaultLabel: "ENTITY" }],
  binary_tree: [{ type: "tree_node", label: "Node", defaultLabel: "" }],
};

const HELP: Record<DiagramKind, string> = {
  logic_circuit: "Add gates, then drag from a gate's output (right) to another gate's input (left). Select a component to rename it.",
  flowchart: "Add shapes and drag between the dots to connect them. Select an arrow to label it (e.g. Yes / No).",
  dfd: "Add entities, processes and data stores, then connect them. Select a flow to name the data it carries.",
  erd: "Add entities (name on the first line, attributes below), then connect them. Select a relationship to set its cardinality.",
  binary_tree: "Add nodes and type their values. Drag from a node's left or right dot to its child.",
};

const CARDINALITIES = ["1:1", "1:M", "M:1", "M:M"];

/* ------------------------------------------------------------------ */
/* Node renderers                                                       */
/* ------------------------------------------------------------------ */

const stroke = "var(--foreground)";
const hCls = "!h-2.5 !w-2.5 !border-2 !border-[var(--surface)] !bg-[var(--primary)]";

function GateShape({ type }: { type: string }) {
  const bubble = type === "nand" || type === "nor" || type === "not";
  const body =
    type === "and" || type === "nand" ? (
      <path d="M6 4 H28 A18 18 0 0 1 28 40 H6 Z" />
    ) : type === "not" ? (
      <path d="M8 4 L44 22 L8 40 Z" />
    ) : (
      <path d="M6 4 Q20 22 6 40 Q34 40 48 22 Q34 4 6 4 Z" />
    );
  const tip = type === "and" || type === "nand" ? 46 : type === "not" ? 44 : 48;
  return (
    <svg width="64" height="44" viewBox="0 0 64 44" fill="var(--surface)" stroke={stroke} strokeWidth="2">
      {body}
      {type === "xor" && <path d="M1 4 Q15 22 1 40" fill="none" />}
      {bubble && <circle cx={tip + 4} cy="22" r="4" />}
      <line x1={bubble ? tip + 8 : tip} y1="22" x2="64" y2="22" />
    </svg>
  );
}

function GateNode({ type, selected }: NodeProps<FlowNode>) {
  const two = type !== "not";
  return (
    <div className={cn("relative rounded", selected && "ring-2 ring-primary/50")} title={type.toUpperCase()}>
      <GateShape type={type} />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center pr-3 text-[9px] font-bold text-muted">
        {type.toUpperCase()}
      </span>
      {two ? (
        <>
          <Handle type="target" position={Position.Left} id="in1" style={{ top: "27%" }} className={hCls} />
          <Handle type="target" position={Position.Left} id="in2" style={{ top: "73%" }} className={hCls} />
        </>
      ) : (
        <Handle type="target" position={Position.Left} id="in1" className={hCls} />
      )}
      <Handle type="source" position={Position.Right} id="out" className={hCls} />
    </div>
  );
}

function PinNode({ type, data, selected }: NodeProps<FlowNode>) {
  const isInput = type === "input";
  return (
    <div
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-full border-2 bg-surface px-2 font-mono text-sm font-bold",
        selected ? "border-primary" : "border-foreground",
      )}
    >
      {data.label || "?"}
      {isInput ? (
        <Handle type="source" position={Position.Right} id="out" className={hCls} />
      ) : (
        <Handle type="target" position={Position.Left} id="in" className={hCls} />
      )}
    </div>
  );
}

/** Four connectable sides; with ConnectionMode.Loose any side can start or end a line. */
function Sides() {
  return (
    <>
      <Handle type="source" position={Position.Top} id="t" className={hCls} />
      <Handle type="source" position={Position.Right} id="r" className={hCls} />
      <Handle type="source" position={Position.Bottom} id="b" className={hCls} />
      <Handle type="source" position={Position.Left} id="l" className={hCls} />
    </>
  );
}

function Label({ text }: { text: string }) {
  return <span className="whitespace-pre-line text-center text-xs leading-tight">{text || " "}</span>;
}

function ShapeNode({ type, data, selected }: NodeProps<FlowNode>) {
  const ring = selected ? "border-primary" : "border-foreground";
  if (type === "decision") {
    return (
      <div className="relative flex h-24 w-32 items-center justify-center">
        <div className={cn("absolute h-16 w-16 border-2 bg-surface", ring)} style={{ transform: "rotate(45deg) scale(1.15)" }} />
        <div className="relative max-w-24">
          <Label text={data.label} />
        </div>
        <Sides />
      </div>
    );
  }
  if (type === "io") {
    return (
      <div className="relative flex min-h-12 min-w-32 items-center justify-center px-6">
        <div className={cn("absolute inset-0 -skew-x-[18deg] border-2 bg-surface", ring)} />
        <div className="relative">
          <Label text={data.label} />
        </div>
        <Sides />
      </div>
    );
  }
  if (type === "store") {
    return (
      <div className={cn("relative flex min-h-10 min-w-36 items-center border-y-2 border-l-2 bg-surface px-3", ring)}>
        <Label text={data.label} />
        <Sides />
      </div>
    );
  }
  if (type === "er_entity") {
    const [name, ...attrs] = data.label.split("\n");
    return (
      <div className={cn("relative min-w-32 border-2 bg-surface text-xs", ring)}>
        <div className="border-b-2 border-inherit px-3 py-1.5 text-center font-bold">{name || "ENTITY"}</div>
        {attrs.length > 0 && <div className="whitespace-pre-line px-3 py-1.5">{attrs.join("\n")}</div>}
        <Sides />
      </div>
    );
  }
  const shape =
    type === "terminator" ? "rounded-full px-5" : type === "dfd_process" ? "rounded-xl px-4" : type === "entity" ? "px-4 bg-surface-2" : "px-4";
  return (
    <div className={cn("relative flex min-h-11 min-w-28 items-center justify-center border-2 bg-surface py-2", shape, ring)}>
      <Label text={data.label} />
      <Sides />
    </div>
  );
}

function TreeNode({ data, selected }: NodeProps<FlowNode>) {
  return (
    <div
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full border-2 bg-surface font-mono text-sm font-semibold",
        selected ? "border-primary" : "border-foreground",
      )}
    >
      {data.label || "?"}
      <Handle type="target" position={Position.Top} id="parent" className={hCls} />
      <Handle type="source" position={Position.Bottom} id="left" style={{ left: "18%" }} className={hCls} />
      <Handle type="source" position={Position.Bottom} id="right" style={{ left: "82%" }} className={hCls} />
    </div>
  );
}

const RENDERERS: Record<string, (p: NodeProps<FlowNode>) => React.ReactNode> = {
  and: GateNode,
  or: GateNode,
  not: GateNode,
  nand: GateNode,
  nor: GateNode,
  xor: GateNode,
  input: PinNode,
  output: PinNode,
  terminator: ShapeNode,
  process: ShapeNode,
  decision: ShapeNode,
  io: ShapeNode,
  entity: ShapeNode,
  dfd_process: ShapeNode,
  store: ShapeNode,
  er_entity: ShapeNode,
  tree_node: TreeNode,
};

// React Flow styles its built-in "input"/"output"/"default" node types, so our
// types are registered with a prefix and the renderers get the plain name.
const RF = "d_";
const rfType = (t: string) => RF + t;
const plainType = (t: string | undefined) => (t?.startsWith(RF) ? t.slice(RF.length) : (t ?? "process"));
const NODE_TYPES = Object.fromEntries(
  Object.entries(RENDERERS).map(([t, R]) => [rfType(t), (p: NodeProps<FlowNode>) => R({ ...p, type: t })]),
);

/* ------------------------------------------------------------------ */
/* Conversion                                                            */
/* ------------------------------------------------------------------ */

function edgeStyle(kind: DiagramKind): Partial<Edge> {
  const style = { stroke, strokeWidth: 1.6 };
  if (kind === "logic_circuit") return { type: "smoothstep", style };
  if (kind === "binary_tree" || kind === "erd") return { type: "straight", style };
  return { type: kind === "flowchart" ? "smoothstep" : "default", style, markerEnd: { type: MarkerType.ArrowClosed, color: "var(--foreground)" } };
}

function toFlow(kind: DiagramKind, d: DiagramData, fixedIds: Set<string>): { nodes: FlowNode[]; edges: Edge[] } {
  return {
    nodes: d.nodes.map((n) => ({
      id: n.id,
      type: rfType(n.type),
      position: { x: n.x, y: n.y },
      data: { label: n.label, fixed: fixedIds.has(n.id) },
      deletable: !fixedIds.has(n.id),
    })),
    edges: d.edges.map((e) => ({
      ...edgeStyle(kind),
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
      targetHandle: e.targetHandle ?? undefined,
      label: e.label || undefined,
    })),
  };
}

function fromFlow(nodes: FlowNode[], edges: Edge[]): DiagramData {
  return {
    nodes: nodes.map((n) => ({ id: n.id, type: plainType(n.type), label: n.data.label, x: Math.round(n.position.x), y: Math.round(n.position.y) })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? null,
      targetHandle: e.targetHandle ?? null,
      ...(typeof e.label === "string" && e.label ? { label: e.label } : {}),
    })),
  };
}

/** Diagram given to the student before they start (from the question, or default circuit pins). */
export function starterDiagram(kind: DiagramKind, content: QuestionContent): DiagramData {
  if (content.starter?.nodes?.length) return content.starter;
  if (kind === "logic_circuit") {
    const inputs = content.inputs?.length ? content.inputs : ["A", "B"];
    return {
      nodes: [
        ...inputs.map((name, i) => ({ id: `in-${name}`, type: "input", label: name, x: 0, y: i * 90 })),
        { id: "out", type: "output", label: content.output ?? "X", x: 460, y: ((inputs.length - 1) * 90) / 2 },
      ],
      edges: [],
    };
  }
  return { nodes: [], edges: [] };
}

/* ------------------------------------------------------------------ */
/* Builder                                                              */
/* ------------------------------------------------------------------ */

export function DiagramBuilder(props: {
  kind: DiagramKind;
  content: QuestionContent;
  value: DiagramData | null | undefined;
  onChange?: (next: DiagramData | null) => void;
  readOnly?: boolean;
}) {
  return (
    <ReactFlowProvider>
      <Builder {...props} />
    </ReactFlowProvider>
  );
}

function Builder({
  kind,
  content,
  value,
  onChange,
  readOnly = false,
}: {
  kind: DiagramKind;
  content: QuestionContent;
  value: DiagramData | null | undefined;
  onChange?: (next: DiagramData | null) => void;
  readOnly?: boolean;
}) {
  const { isDark } = useTheme();
  const flow = useReactFlow();
  // Focus the label box without scrolling the page away from the canvas.
  // The default text is selected so typing replaces it.
  const focusOnMount = useCallback((el: HTMLInputElement | HTMLTextAreaElement | null) => {
    el?.focus({ preventScroll: true });
    el?.select();
  }, []);
  const starter = useMemo(() => starterDiagram(kind, content), [kind, content]);
  const fixedIds = useMemo(() => new Set(starter.nodes.map((n) => n.id)), [starter]);
  // Uncontrolled after mount: the parent remounts the builder per question.
  const [initial] = useState(() => toFlow(kind, value?.nodes?.length ? value : starter, fixedIds));
  const [nodes, setNodes] = useState<FlowNode[]>(initial.nodes);
  const [edges, setEdges] = useState<Edge[]>(initial.edges);

  const palette = PALETTES[kind].filter(
    (p) => kind !== "logic_circuit" || !content.gates?.length || ["input", "output"].includes(p.type) || (content.gates as string[]).includes(p.type),
  );
  const selectedNode = nodes.find((n) => n.selected);
  const selectedEdge = edges.find((e) => e.selected);

  function emit(n: FlowNode[], e: Edge[]) {
    if (!onChange) return;
    const untouched = e.length === 0 && n.every((x) => fixedIds.has(x.id)) && n.length === starter.nodes.length;
    onChange(untouched ? null : fromFlow(n, e));
  }

  function onNodesChange(changes: NodeChange<FlowNode>[]) {
    const next = applyNodeChanges(changes, nodes);
    setNodes(next);
    const meaningful = changes.some((c) => c.type === "remove" || c.type === "add" || (c.type === "position" && c.dragging === false));
    if (meaningful) {
      // removing a node also removes its wires
      const ids = new Set(next.map((n) => n.id));
      const keptEdges = edges.filter((e) => ids.has(e.source) && ids.has(e.target));
      if (keptEdges.length !== edges.length) setEdges(keptEdges);
      emit(next, keptEdges);
    }
  }

  function onEdgesChange(changes: EdgeChange[]) {
    const next = applyEdgeChanges(changes, edges);
    setEdges(next);
    if (changes.some((c) => c.type === "remove" || c.type === "add")) emit(nodes, next);
  }

  function onConnect(c: Connection) {
    if (c.source === c.target) return;
    let next = edges;
    if (kind === "logic_circuit") {
      // one wire per gate input; connecting again replaces it
      next = next.filter((e) => !(e.target === c.target && (e.targetHandle ?? null) === (c.targetHandle ?? null)));
    }
    if (kind === "binary_tree") {
      next = next.filter((e) => !(e.source === c.source && e.sourceHandle === c.sourceHandle) && e.target !== c.target);
    }
    if (next.some((e) => e.source === c.source && e.target === c.target && e.sourceHandle === c.sourceHandle && e.targetHandle === c.targetHandle)) return;
    const edge: Edge = {
      ...edgeStyle(kind),
      id: `e-${c.source}-${c.sourceHandle ?? ""}-${c.target}-${c.targetHandle ?? ""}`,
      source: c.source,
      target: c.target,
      sourceHandle: c.sourceHandle ?? undefined,
      targetHandle: c.targetHandle ?? undefined,
    };
    next = [...next, edge];
    setEdges(next);
    emit(nodes, next);
  }

  function addNode(item: PaletteItem) {
    const used = nodes.map((n) => Number(/^n(\d+)$/.exec(n.id)?.[1] ?? 0));
    const id = `n${Math.max(0, ...used) + 1}`;
    let label = item.defaultLabel;
    if (kind === "logic_circuit" && item.type === "input") label = String.fromCharCode(65 + nodes.filter((n) => plainType(n.type) === "input").length);
    // New shapes go on a grid (below any given shapes); students then drag them into place.
    const added = nodes.filter((n) => !fixedIds.has(n.id)).length;
    const [cols, dx, dy] = kind === "binary_tree" ? [7, 70, 80] : kind === "logic_circuit" ? [3, 110, 80] : [4, 180, 120];
    const given = nodes.filter((n) => fixedIds.has(n.id));
    const x0 = kind === "logic_circuit" ? 130 : 0;
    const y0 = kind === "logic_circuit" || given.length === 0 ? 0 : Math.max(...given.map((n) => n.position.y)) + dy;
    const node: FlowNode = {
      id,
      type: rfType(item.type),
      position: { x: x0 + (added % cols) * dx, y: y0 + Math.floor(added / cols) * dy },
      data: { label },
      selected: true,
    };
    const next = [...nodes.map((n) => ({ ...n, selected: false })), node];
    setNodes(next);
    emit(next, edges);
    // keep the new shape in view
    requestAnimationFrame(() => void flow.fitView({ padding: 0.25, maxZoom: 1.2, duration: 200 }));
  }

  function setLabel(id: string, label: string, isEdge: boolean) {
    if (isEdge) {
      const next = edges.map((e) => (e.id === id ? { ...e, label: label || undefined } : e));
      setEdges(next);
      emit(nodes, next);
    } else {
      const next = nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n));
      setNodes(next);
      emit(next, edges);
    }
  }

  function clearAll() {
    const fresh = toFlow(kind, starter, fixedIds);
    setNodes(fresh.nodes);
    setEdges(fresh.edges);
    emit(fresh.nodes, fresh.edges);
  }

  const selectedType = plainType(selectedNode?.type);
  const labelEditable = selectedNode && !selectedNode.data.fixed && !["and", "or", "not", "nand", "nor", "xor"].includes(selectedType);
  const multiline = selectedNode && ["er_entity", "process", "decision", "io", "dfd_process", "store", "entity"].includes(selectedType);

  return (
    <div className="space-y-2">
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1.5">
          {palette.map((p) => (
            <button
              key={p.type}
              type="button"
              onClick={() => addNode(p)}
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-surface-2"
            >
              + {p.label}
            </button>
          ))}
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => {
              const removable = nodes.filter((n) => n.selected && !n.data.fixed).map((n) => ({ type: "remove" as const, id: n.id }));
              if (removable.length) onNodesChange(removable);
              const edgeIds = edges.filter((e) => e.selected).map((e) => ({ type: "remove" as const, id: e.id }));
              if (edgeIds.length) onEdgesChange(edgeIds);
            }}
            disabled={!selectedEdge && !(selectedNode && !selectedNode.data.fixed)}
            className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-surface-2 disabled:opacity-40"
          >
            Delete selected
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear the whole diagram?")) clearAll();
            }}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-danger hover:bg-danger-soft"
          >
            Clear
          </button>
        </div>
      )}

      {!readOnly && (
        <div className="flex min-h-9 flex-wrap items-center gap-2 text-xs">
          {selectedEdge && kind === "erd" ? (
            <>
              <span className="font-medium">Cardinality</span>
              {CARDINALITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setLabel(selectedEdge.id, selectedEdge.label === c ? "" : c, true)}
                  className={cn("rounded border px-2 py-1 font-mono", selectedEdge.label === c ? "border-primary bg-primary-soft" : "border-border")}
                >
                  {c}
                </button>
              ))}
              <input
                className="h-8 w-48 rounded border border-border bg-surface px-2"
                placeholder="or describe the relationship"
                value={typeof selectedEdge.label === "string" ? selectedEdge.label : ""}
                onChange={(e) => setLabel(selectedEdge.id, e.target.value, true)}
              />
            </>
          ) : selectedEdge && kind !== "logic_circuit" && kind !== "binary_tree" ? (
            <label className="flex items-center gap-2">
              <span className="font-medium">{kind === "dfd" ? "Data flow" : "Arrow label"}</span>
              <input
                key={selectedEdge.id}
                ref={focusOnMount}
                className="h-8 w-56 rounded border border-border bg-surface px-2"
                value={typeof selectedEdge.label === "string" ? selectedEdge.label : ""}
                onChange={(e) => setLabel(selectedEdge.id, e.target.value, true)}
              />
            </label>
          ) : selectedNode && labelEditable ? (
            <label className="flex items-start gap-2">
              <span className="pt-1.5 font-medium">{kind === "erd" ? "Entity (attributes on new lines)" : "Text"}</span>
              {multiline ? (
                <textarea
                  key={selectedNode.id}
                  ref={focusOnMount}
                  rows={kind === "erd" ? 4 : 2}
                  className="w-64 rounded border border-border bg-surface px-2 py-1"
                  value={selectedNode.data.label}
                  onChange={(e) => setLabel(selectedNode.id, e.target.value, false)}
                />
              ) : (
                <input
                  key={selectedNode.id}
                  ref={focusOnMount}
                  className="h-8 w-40 rounded border border-border bg-surface px-2 font-mono"
                  value={selectedNode.data.label}
                  maxLength={kind === "logic_circuit" ? 3 : 40}
                  onChange={(e) => setLabel(selectedNode.id, kind === "logic_circuit" ? e.target.value.toUpperCase() : e.target.value, false)}
                />
              )}
            </label>
          ) : (
            <span className="text-muted">{HELP[kind]}</span>
          )}
        </div>
      )}
      <div className="h-[440px] overflow-hidden rounded-lg border border-border bg-surface">
        <ReactFlow<FlowNode, Edge>
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          connectionMode={kind === "flowchart" || kind === "dfd" || kind === "erd" ? ConnectionMode.Loose : ConnectionMode.Strict}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
          colorMode={isDark ? "dark" : "light"}
          fitView
          fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

    </div>
  );
}

export default DiagramBuilder;
