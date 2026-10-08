import { z } from "zod";
import { theoryBlocksSchema } from "../theory/blocks";
import {
  CODE_LANGUAGES,
  COMMAND_WORDS,
  CONTENT_STATUSES,
  DIFFICULTIES,
  GRADING_METHODS,
  QUESTION_SOURCES,
  QUESTION_TYPES,
  DETERMINISTIC_TYPES,
  DIAGRAM_TYPES,
} from "../questions/types";
import { parseBoolean } from "../boolean";

// Validation for the authoring files in content/ (seeded into the database by
// scripts/build-seed.ts) and for the question editor.

// "11.2.1.1" (KTP) or "11.5.4.1@paper" (objective from the Paper 1-2-3 specification)
const loCode = z.string().regex(/^\d{2}\.\d+\.\d+\.\d+(@paper)?$/, "LO code like 11.2.1.1 or 11.5.4.1@paper");
const matchItem = z.object({ key: z.string().min(1).max(20), text: z.string().min(1).max(500) });

export const questionContentSchema = z
  .object({
    hint: z.string().max(2000).optional(),
    language: z.enum(CODE_LANGUAGES).optional(),
    starter_code: z.string().max(20000).optional(),
    left: z.array(matchItem).max(20).optional(),
    right: z.array(matchItem).max(20).optional(),
    blank_count: z.number().int().min(1).max(20).optional(),
    columns: z.array(z.string().max(100)).max(12).optional(),
    rows: z.number().int().min(1).max(40).optional(),
    prefill: z.array(z.array(z.string().nullable())).optional(),
    tick: z.boolean().optional(),
    unit: z.string().max(50).optional(),
    answer_lines: z.number().int().min(1).max(40).optional(),
    word_limit: z.number().int().min(1).max(2000).optional(),
    fields: z
      .array(z.object({ key: z.string().min(1).max(20), label: z.string().min(1).max(300), lines: z.number().int().min(1).max(20).optional() }))
      .max(12)
      .optional(),
    inputs: z.array(z.string().regex(/^[A-Z]$/, "single capital letter")).max(6).optional(),
    output: z.string().regex(/^[A-Z]$/).optional(),
    gates: z.array(z.enum(["and", "or", "not", "nand", "nor", "xor"])).optional(),
    starter: z
      .object({
        nodes: z.array(z.object({ id: z.string().min(1).max(40), type: z.string().min(1).max(30), label: z.string().max(300), x: z.number(), y: z.number() })).max(60),
        edges: z
          .array(
            z.object({
              id: z.string().min(1).max(80),
              source: z.string(),
              target: z.string(),
              sourceHandle: z.string().nullable().optional(),
              targetHandle: z.string().nullable().optional(),
              label: z.string().max(100).optional(),
            }),
          )
          .max(100),
      })
      .optional(),
  })
  .strict();

export const acceptedAnswersSchema = z
  .object({
    correct: z.union([z.string(), z.array(z.string()), z.boolean()]).optional(),
    pairs: z.record(z.string(), z.string()).optional(),
    blanks: z.array(z.array(z.string())).optional(),
    values: z.array(z.string()).optional(),
    numeric: z.boolean().optional(),
    tolerance: z.number().min(0).optional(),
    case_sensitive: z.boolean().optional(),
    ignore_spaces: z.boolean().optional(),
    rows: z.array(z.array(z.string().nullable())).optional(),
    fields: z.record(z.string(), z.array(z.string())).optional(),
    expression: z.string().max(500).optional(),
    tree: z.array(z.string().nullable()).max(127).optional(),
    scoring: z.enum(["item", "all"]).optional(),
  })
  .strict();

export const markingPointSchema = z.object({
  criterion: z.string().min(1).max(1000),
  marks: z.number().int().min(0).max(20),
});

const questionBase = z.object({
    key: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1).max(200),
    type: z.enum(QUESTION_TYPES),
    marks: z.number().int().min(1).max(50),
    difficulty: z.enum(DIFFICULTIES),
    command_word: z.enum(COMMAND_WORDS).nullable().optional(),
    grading: z.enum(GRADING_METHODS),
    objectives: z.array(loCode).max(20),
    text: z.string().max(20000),
    options: z.array(z.object({ key: z.string().min(1).max(5), content: z.string().min(1).max(2000) })).optional(),
    content: questionContentSchema.optional(),
    source: z.enum(QUESTION_SOURCES).optional(),
    source_reference: z.string().max(500).optional(),
    practice: z.boolean().optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
    topic: z.string().optional(),
    scheme: z
      .object({
        mark_scheme: z.string().max(20000),
        points: z.array(markingPointSchema).optional(),
        model_answer: z.string().max(20000).optional(),
        accepted: acceptedAnswersSchema.optional(),
        ai_instructions: z.string().max(5000).optional(),
        explanation: z.string().max(20000).optional(),
      })
      .default({ mark_scheme: "" }),
    /** part of a structured question: "(a)", "(b)(i)" */
    part_label: z.string().max(20).optional(),
  });

type QuestionDraft = z.infer<typeof questionBase>;

function checkQuestion(q: QuestionDraft, ctx: z.RefinementCtx) {
  if (q.type === "structured") return; // the shared stem may be empty
  if (!q.text.trim()) ctx.addIssue({ code: "custom", message: `${q.key}: question text is required` });
  if (q.objectives.length === 0) ctx.addIssue({ code: "custom", message: `${q.key}: at least one learning objective` });
  const accepted = q.scheme.accepted ?? {};
  const needsOptions = q.type === "mcq" || q.type === "multiple_response";
  if (needsOptions && (!q.options || q.options.length < 2)) {
    ctx.addIssue({ code: "custom", message: `${q.key}: ${q.type} needs at least two options` });
  }
  if (q.grading === "AUTO" && !DETERMINISTIC_TYPES.includes(q.type)) {
    ctx.addIssue({ code: "custom", message: `${q.key}: ${q.type} cannot be AUTO-graded` });
  }
  if (q.grading === "AUTO" || q.grading === "HYBRID") {
    const hasKey =
      accepted.correct !== undefined ||
      accepted.pairs !== undefined ||
      accepted.blanks !== undefined ||
      accepted.values !== undefined ||
      accepted.rows !== undefined ||
      accepted.fields !== undefined ||
      accepted.expression !== undefined ||
      accepted.tree !== undefined;
    if (!hasKey) ctx.addIssue({ code: "custom", message: `${q.key}: ${q.grading} needs scheme.accepted` });
  }
  if (needsOptions && q.options) {
    const keys = new Set(q.options.map((o) => o.key));
    const correct = accepted.correct;
    const list = Array.isArray(correct) ? correct : typeof correct === "string" ? [correct] : [];
    for (const c of list) {
      if (!keys.has(c)) ctx.addIssue({ code: "custom", message: `${q.key}: correct option ${c} does not exist` });
    }
  }
  if (q.type === "fill_blank") {
    const n = (q.text.match(/\[\[\d+\]\]/g) ?? []).length;
    if (n === 0) ctx.addIssue({ code: "custom", message: `${q.key}: fill_blank text needs [[1]] placeholders` });
    if (accepted.blanks && accepted.blanks.length !== n) {
      ctx.addIssue({ code: "custom", message: `${q.key}: ${n} placeholders but ${accepted.blanks.length} answers` });
    }
  }
  if (q.type === "matching" && (!q.content?.left || !q.content?.right)) {
    ctx.addIssue({ code: "custom", message: `${q.key}: matching needs content.left and content.right` });
  }
  if ((q.grading === "AI" || q.grading === "HYBRID") && !q.scheme.points?.length && !q.scheme.mark_scheme) {
    ctx.addIssue({ code: "custom", message: `${q.key}: AI marking needs a mark scheme` });
  }
  if (q.type === "labelled_answers") {
    const keys = new Set((q.content?.fields ?? []).map((f) => f.key));
    if (keys.size === 0) ctx.addIssue({ code: "custom", message: `${q.key}: labelled_answers needs content.fields` });
    for (const k of Object.keys(accepted.fields ?? {})) {
      if (!keys.has(k)) ctx.addIssue({ code: "custom", message: `${q.key}: accepted.fields.${k} is not a field` });
    }
  }
  if ((q.type === "table_completion" || q.type === "trace_table") && !q.content?.columns?.length) {
    ctx.addIssue({ code: "custom", message: `${q.key}: ${q.type} needs content.columns` });
  }
  if (q.type === "boolean_expression" || q.type === "logic_circuit") {
    if (accepted.expression) {
      try {
        parseBoolean(accepted.expression);
      } catch (e) {
        ctx.addIssue({ code: "custom", message: `${q.key}: accepted.expression: ${(e as Error).message}` });
      }
    } else if (q.grading !== "AI" && q.grading !== "MANUAL") {
      ctx.addIssue({ code: "custom", message: `${q.key}: ${q.type} needs scheme.accepted.expression` });
    }
  }
  if (q.type === "binary_tree" && q.grading !== "AI" && q.grading !== "MANUAL" && !accepted.tree?.length) {
    ctx.addIssue({ code: "custom", message: `${q.key}: binary_tree needs scheme.accepted.tree (level order)` });
  }
  if (DIAGRAM_TYPES.includes(q.type) && q.type !== "logic_circuit" && q.type !== "binary_tree" && q.grading === "AUTO") {
    ctx.addIssue({ code: "custom", message: `${q.key}: ${q.type} diagrams are marked by AI or the teacher` });
  }
}

/** A part of a structured question (answered and marked on its own). */
export const questionPartSchema = questionBase
  .extend({ part_label: z.string().min(1).max(20) })
  .superRefine((q, ctx) => {
    if (q.type === "structured") ctx.addIssue({ code: "custom", message: `${q.key}: parts cannot be structured` });
    checkQuestion(q, ctx);
  });
export type AuthoredPart = z.infer<typeof questionPartSchema>;

export const authoredQuestionSchema = questionBase
  .extend({
    /** structured questions: the parts, in order */
    parts: z.array(questionPartSchema).max(15).optional(),
  })
  .superRefine((q, ctx) => {
    checkQuestion(q, ctx);
    if (q.type === "structured" && q.parts !== undefined && q.parts.length === 0) {
      ctx.addIssue({ code: "custom", message: `${q.key}: a structured question needs at least one part` });
    }
    if (q.type !== "structured" && q.parts?.length) {
      ctx.addIssue({ code: "custom", message: `${q.key}: only structured questions have parts` });
    }
  });

export type AuthoredQuestion = z.infer<typeof authoredQuestionSchema>;

export const authoredTopicSchema = z.object({
  topic: z.string(),
  summary: z.string().max(2000).optional(),
  theory: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        objectives: z.array(loCode).default([]),
        blocks: theoryBlocksSchema,
      }),
    )
    .default([]),
  questions: z.array(authoredQuestionSchema).default([]),
  topic_exam: z
    .object({
      duration: z.number().int().min(5).max(180),
      title: z.string().optional(),
      instructions: z.string().max(2000).optional(),
      /** keys of the questions in the topic exam (default: all questions of the topic) */
      questions: z.array(z.string()).optional(),
    })
    .optional(),
}).superRefine((t, ctx) => {
  const keys = new Set(t.questions.map((q) => q.key));
  for (const k of t.topic_exam?.questions ?? []) {
    if (!keys.has(k)) ctx.addIssue({ code: "custom", message: `topic_exam.questions: unknown question ${k}` });
  }
});
export type AuthoredTopic = z.infer<typeof authoredTopicSchema>;

export const authoredMockSchema = z.object({
  key: z.string().regex(/^[a-z0-9-]+$/),
  year: z.number().int().min(2000).max(2100),
  paper: z.number().int().min(1).max(3),
  grade: z.number().int().min(11).max(12).optional(),
  title: z.string(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  duration: z.number().int().min(5).max(300),
  attempt_limit: z.number().int().min(1).nullable().optional(),
  availability_start: z.string().nullable().optional(),
  availability_end: z.string().nullable().optional(),
  integrity_mode: z.enum(["monitor", "warn", "auto_submit"]).optional(),
  max_violations: z.number().int().min(1).optional(),
  show_mark_scheme: z.boolean().optional(),
  /** Question keys from content/topics/*.json */
  include: z.array(z.string()).default([]),
  /** Staff-only files in the private "papers" bucket (original question paper, mark scheme) */
  teacher_resources: z.array(z.object({ label: z.string().min(1).max(100), path: z.string().min(1).max(300) })).default([]),
  /** Mock-only questions (not available in practice) */
  questions: z.array(authoredQuestionSchema).default([]),
});
export type AuthoredMock = z.infer<typeof authoredMockSchema>;
