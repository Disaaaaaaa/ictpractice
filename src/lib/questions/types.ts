// Shared question-bank vocabulary. Mirrors the enums in
// supabase/migrations/20261006000001_schema.sql — keep the two in sync.

export const QUESTION_TYPES = [
  "mcq",
  "multiple_response",
  "true_false",
  "matching",
  "fill_blank",
  "short_answer",
  "extended",
  "calculation",
  "code_completion",
  "code_analysis",
  "trace_table",
  "sql",
  "html_css",
  "pseudocode",
  "diagram",
  "scenario",
  "structured",
  "labelled_answers",
  "table_completion",
  "boolean_expression",
  "logic_circuit",
  "flowchart",
  "dfd",
  "erd",
  "binary_tree",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "Multiple choice",
  multiple_response: "Multiple response",
  true_false: "True / False",
  matching: "Matching",
  fill_blank: "Fill in the blank",
  short_answer: "Short answer",
  extended: "Extended answer",
  calculation: "Calculation",
  code_completion: "Code completion",
  code_analysis: "Code analysis",
  trace_table: "Trace table",
  sql: "SQL",
  html_css: "HTML/CSS",
  pseudocode: "Pseudocode",
  diagram: "Diagram-based",
  scenario: "Scenario-based",
  structured: "Structured question (parts)",
  labelled_answers: "Labelled answer boxes",
  table_completion: "Table completion",
  boolean_expression: "Boolean expression",
  logic_circuit: "Logic circuit (draw)",
  flowchart: "Flowchart (draw)",
  dfd: "Data flow diagram (draw)",
  erd: "Entity-relationship diagram (draw)",
  binary_tree: "Binary tree (draw)",
};

/** Types that can always be marked without AI when an answer key exists. */
export const DETERMINISTIC_TYPES: readonly QuestionType[] = [
  "mcq",
  "multiple_response",
  "true_false",
  "matching",
  "fill_blank",
  "calculation",
  "short_answer",
  "trace_table",
  "labelled_answers",
  "table_completion",
  "boolean_expression",
  "logic_circuit",
  "binary_tree",
];

/** Answered in the diagram builder. */
export const DIAGRAM_TYPES: readonly QuestionType[] = ["logic_circuit", "flowchart", "dfd", "erd", "binary_tree"];

/** Types answered in a code editor. */
export const CODE_TYPES: readonly QuestionType[] = [
  "code_completion",
  "code_analysis",
  "sql",
  "html_css",
  "pseudocode",
];

export const DIFFICULTIES = ["easy", "medium", "hard", "exam"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  exam: "Exam-level",
};

export const COMMAND_WORDS = [
  "state",
  "name",
  "identify",
  "define",
  "describe",
  "explain",
  "compare",
  "analyse",
  "evaluate",
  "discuss",
  "suggest",
  "calculate",
  "complete",
  "write",
  "draw",
] as const;
export type CommandWord = (typeof COMMAND_WORDS)[number];

export const GRADING_METHODS = ["AUTO", "AI", "MANUAL", "HYBRID"] as const;
export type GradingMethod = (typeof GRADING_METHODS)[number];

export const QUESTION_SOURCES = [
  "original",
  "teacher",
  "nis_style",
  "cambridge_style",
  "past_paper",
  "mock",
] as const;
export type QuestionSource = (typeof QUESTION_SOURCES)[number];
export const QUESTION_SOURCE_LABELS: Record<QuestionSource, string> = {
  original: "Original platform question",
  teacher: "Teacher-created",
  nis_style: "NIS-style",
  cambridge_style: "Cambridge-style",
  past_paper: "Past-paper-derived",
  mock: "Mock exam",
};

export const CONTENT_STATUSES = ["draft", "review", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CODE_LANGUAGES = [
  "pseudocode",
  "python",
  "html",
  "css",
  "javascript",
  "sql",
  "prolog",
  "assembly",
] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

export type MatchItem = { key: string; text: string };

export type DiagramKind = "logic_circuit" | "flowchart" | "dfd" | "erd" | "binary_tree";
export type DiagramNode = { id: string; type: string; label: string; x: number; y: number };
export type DiagramEdge = { id: string; source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null; label?: string };
export type DiagramData = { nodes: DiagramNode[]; edges: DiagramEdge[] };
export type LabelledField = { key: string; label: string; lines?: number };

/** Public, student-visible configuration of a question. Never contains the answer. */
export type QuestionContent = {
  hint?: string;
  language?: CodeLanguage;
  starter_code?: string;
  /** matching */
  left?: MatchItem[];
  right?: MatchItem[];
  /** fill_blank: the question text contains [[1]], [[2]], ... */
  blank_count?: number;
  /** trace_table */
  columns?: string[];
  rows?: number;
  prefill?: (string | null)[][];
  /** table_completion: empty cells are tick boxes (a ticked cell is stored as "✓") */
  tick?: boolean;
  /** calculation */
  unit?: string;
  /** free-text sizing */
  answer_lines?: number;
  word_limit?: number;
  /** labelled_answers */
  fields?: LabelledField[];
  /** boolean_expression / logic_circuit: input names (default: letters found in the expected answer) */
  inputs?: string[];
  /** logic_circuit: name of the output (default X) */
  output?: string;
  /** logic_circuit: gates students may use (default: all) */
  gates?: ("and" | "or" | "not" | "nand" | "nor" | "xor")[];
  /** diagrams: shapes/nodes given to the student */
  starter?: DiagramData;
};

export type QuestionOption = { key: string; content: string };

/** Answer payloads, one shape per family of question types. */
export type AnswerData = {
  selected?: string | string[];
  value?: boolean | string;
  pairs?: Record<string, string>;
  blanks?: string[];
  text?: string;
  working?: string;
  rows?: string[][];
  /** labelled_answers */
  fields?: Record<string, string>;
  /** diagram types */
  diagram?: DiagramData;
};

/** Answer key stored in mark_schemes.accepted_answers (staff/server only). */
export type AcceptedAnswers = {
  /** mcq: "B"; multiple_response: ["A","C"]; true_false: true */
  correct?: string | string[] | boolean;
  /** matching: left key → right key */
  pairs?: Record<string, string>;
  /** fill_blank: alternatives for each blank, in order */
  blanks?: string[][];
  /** calculation / short_answer: any of these is accepted */
  values?: string[];
  numeric?: boolean;
  tolerance?: number;
  case_sensitive?: boolean;
  ignore_spaces?: boolean;
  /** trace_table / table_completion: expected cells; null = not marked */
  rows?: (string | null)[][];
  /** labelled_answers: accepted values per field key */
  fields?: Record<string, string[]>;
  /** boolean_expression / logic_circuit: any expression with the same truth table */
  expression?: string;
  /** binary_tree: expected tree in level order (null = empty position) */
  tree?: (string | null)[];
  /** "item": marks scale with correct items (default); "all": all-or-nothing */
  scoring?: "item" | "all";
};

export type MarkingPoint = { criterion: string; marks: number };

/** Marking data frozen into an exam version (exam_version_payloads.marking). */
export type MarkingEntry = {
  question_type: QuestionType;
  grading_method: GradingMethod;
  marks: number;
  question_marks?: number;
  command_word: CommandWord | null;
  mark_scheme_version?: number;
  mark_scheme: string;
  marking_points: MarkingPoint[];
  model_answer: string | null;
  accepted_answers: AcceptedAnswers;
  ai_grading_instructions: string | null;
  explanation: string | null;
  /** stem of the structured question this part belongs to */
  group_stem?: string | null;
};

/** Student-visible question inside an exam version (exam_version_payloads.paper). */
export type PaperQuestion = {
  id: string;
  number: number;
  /** Display label: "3" or "1(b)(i)" for parts of a structured question */
  label?: string;
  group_id?: string | null;
  group_number?: number;
  group_title?: string | null;
  group_stem?: string | null;
  part_label?: string | null;
  title: string;
  question_text: string;
  question_type: QuestionType;
  marks: number;
  command_word: CommandWord | null;
  difficulty: Difficulty;
  content: QuestionContent;
  section_label: string | null;
  topic_id: string | null;
  topic_title: string | null;
  options: QuestionOption[];
  objectives: { id: string; code: string }[];
};

export type Paper = {
  exam: { id: string; title: string; kind: string; instructions: string | null; year: number | null };
  questions: PaperQuestion[];
};

export function isAnswerBlank(answer: AnswerData | null | undefined): boolean {
  if (!answer) return true;
  return Object.values(answer).every((v) => {
    if (v === null || v === undefined || v === "") return true;
    if (Array.isArray(v)) {
      return v.every((x) => (Array.isArray(x) ? x.every((c) => !c) : !x));
    }
    if (typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (Array.isArray(o.nodes)) return o.nodes.length === 0;
      return Object.values(o).every((x) => x === null || x === undefined || x === "");
    }
    return false;
  });
}

/** "3", or "1(b)(i)" for a part of a structured question. */
export function paperLabel(q: Pick<PaperQuestion, "label" | "number">): string {
  return q.label || String(q.number);
}
