import { z } from "zod";

// Structured theory content. Stored as JSON in theory_sections.blocks, so the
// theory can be edited without touching frontend code. Text fields accept
// inline Markdown (bold, italics, code, links, lists, tables).

export const INTERACTIVE_WIDGETS = [
  "base_converter",
  "twos_complement",
  "binary_addition",
  "truth_table",
  "stack_queue",
  "sort_visualizer",
  "binary_search",
] as const;
export type InteractiveWidget = (typeof INTERACTIVE_WIDGETS)[number];

export const INTERACTIVE_WIDGET_LABELS: Record<InteractiveWidget, string> = {
  base_converter: "Number base converter",
  twos_complement: "Two's complement explorer",
  binary_addition: "Binary addition",
  truth_table: "Truth table builder",
  stack_queue: "Stack & queue simulator",
  sort_visualizer: "Bubble / insertion sort step-through",
  binary_search: "Binary search step-through",
};

const text = z.string().max(20000);

export const theoryBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), text: z.string().min(1).max(200), level: z.union([z.literal(2), z.literal(3)]).optional() }),
  z.object({ type: z.literal("paragraph"), content: text }),
  z.object({ type: z.literal("definition"), term: z.string().min(1).max(200), content: text }),
  z.object({ type: z.literal("example"), title: z.string().max(200).optional(), content: text }),
  z.object({ type: z.literal("exam_tip"), content: text }),
  z.object({ type: z.literal("warning"), content: text }),
  z.object({
    type: z.literal("diagram"),
    format: z.enum(["mermaid", "ascii"]),
    content: text,
    caption: z.string().max(300).optional(),
  }),
  z.object({
    type: z.literal("image"),
    url: z.string().url().or(z.string().startsWith("/")),
    alt: z.string().min(1).max(300),
    caption: z.string().max(300).optional(),
  }),
  z.object({
    type: z.literal("code"),
    language: z.string().max(30),
    content: text,
    caption: z.string().max(300).optional(),
  }),
  z.object({ type: z.literal("formula"), latex: z.string().min(1).max(2000), caption: z.string().max(300).optional() }),
  z.object({
    type: z.literal("comparison"),
    title: z.string().max(200).optional(),
    columns: z.array(z.string().max(200)).min(2).max(10),
    rows: z.array(z.array(z.string().max(2000))).min(1).max(40),
  }),
  z.object({ type: z.literal("steps"), title: z.string().max(200).optional(), items: z.array(text).min(1).max(30) }),
  z.object({ type: z.literal("list"), ordered: z.boolean().optional(), items: z.array(text).min(1).max(40) }),
  z.object({
    type: z.literal("callout"),
    tone: z.enum(["info", "success", "warning", "danger"]),
    title: z.string().max(200).optional(),
    content: text,
  }),
  z.object({
    type: z.literal("cards"),
    items: z.array(z.object({ title: z.string().max(200), content: text })).min(1).max(12),
  }),
  z.object({
    // Live HTML/CSS example, rendered in a sandboxed iframe without scripts.
    type: z.literal("html_preview"),
    title: z.string().max(200).optional(),
    html: z.string().min(1).max(50000),
    css: z.string().max(50000).optional(),
    height: z.number().int().min(60).max(1200).optional(),
  }),
  z.object({
    type: z.literal("interactive"),
    widget: z.enum(INTERACTIVE_WIDGETS),
    title: z.string().max(200).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  }),
]);

export type TheoryBlock = z.infer<typeof theoryBlockSchema>;
export type TheoryBlockType = TheoryBlock["type"];

export const theoryBlocksSchema = z.array(theoryBlockSchema).max(200);

export const BLOCK_TYPE_LABELS: Record<TheoryBlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  definition: "Definition",
  example: "Example",
  exam_tip: "Exam tip",
  warning: "Warning",
  diagram: "Diagram",
  image: "Image",
  code: "Code block",
  formula: "Formula",
  comparison: "Comparison",
  steps: "Step-by-step explanation",
  list: "List",
  callout: "Callout",
  cards: "Cards",
  html_preview: "Live HTML/CSS example",
  interactive: "Interactive example",
};

/** A sensible empty block for the editor. */
export function emptyBlock(type: TheoryBlockType): TheoryBlock {
  switch (type) {
    case "heading":
      return { type, text: "New heading", level: 2 };
    case "paragraph":
    case "exam_tip":
    case "warning":
      return { type, content: "" };
    case "definition":
      return { type, term: "Term", content: "" };
    case "example":
      return { type, title: "Example", content: "" };
    case "diagram":
      return { type, format: "mermaid", content: "flowchart LR\n  A[Input] --> B[Process] --> C[Output]" };
    case "image":
      return { type, url: "https://", alt: "Describe the image" };
    case "code":
      return { type, language: "python", content: "" };
    case "formula":
      return { type, latex: "x = y" };
    case "comparison":
      return { type, columns: ["Aspect", "A", "B"], rows: [["", "", ""]] };
    case "steps":
      return { type, items: [""] };
    case "list":
      return { type, items: [""] };
    case "callout":
      return { type, tone: "info", title: "Note", content: "" };
    case "cards":
      return { type, items: [{ title: "Card", content: "" }] };
    case "html_preview":
      return { type, title: "Visual result", html: "<p>Hello</p>", css: "p { color: #2457d6; }", height: 160 };
    case "interactive":
      return { type, widget: "base_converter" };
  }
}
