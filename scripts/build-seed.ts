/**
 * Generates supabase/seed.sql from the authoring files in content/.
 *
 *   npm run seed:build
 *
 * content/curriculum/<VERSION>.json   school programme (from scripts/import_curriculum.py)
 * content/curriculum/exam_spec.json   Paper 1/2/3 specification
 * content/topics/*.json               theory packs, practice questions, topic exams
 * content/mocks/*.json                mock examinations
 *
 * IDs are deterministic (UUID v5-style from stable keys) so the seed is
 * idempotent: re-running it never duplicates rows.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  authoredMockSchema,
  authoredTopicSchema,
  type AuthoredQuestion,
  type AuthoredPart,
} from "../src/lib/content/schema";
import { contentId, splitLoRef } from "../src/lib/content/ids";
import { comparePartLabels } from "../src/lib/questions/parts";

const ROOT = join(__dirname, "..");
const VERSION = process.env.CURRICULUM_VERSION ?? "NIS_CS_2026_2027";

type Programme = {
  code: string;
  title: string;
  academic_year: string;
  kind: string;
  source_documents: string[];
  grades: {
    number: number;
    title: string;
    terms: {
      number: number;
      title: string;
      hours: number | null;
      units: {
        code: string;
        title: string;
        topics: {
          slug: string;
          title: string;
          lessons: string;
          hours: number | null;
          period: string;
          resources: string;
          objectives: string[];
        }[];
      }[];
    }[];
  }[];
  objectives: { code: string; description: string }[];
  papers: { number: number; title: string; groups: { title: string; sections: { code: string; title: string }[] }[] }[];
  objective_papers: Record<string, { paper: number; section: string }>;
  exam_only_topics: { slug: string; title: string; objectives: string[]; placements: { paper: number; section: string }[] }[];
  paper_links: Record<string, string[]>;
};

type Spec = {
  code: string;
  title: string;
  academic_year: string;
  kind: string;
  source_documents: string[];
  papers: {
    number: number;
    title: string;
    groups: { title: string; sections: { code: string; title: string; objectives: { code: string; description: string }[] }[] }[];
  }[];
};

// ---------------------------------------------------------------------------
// SQL helpers
// ---------------------------------------------------------------------------
const id = contentId;
const lit = (v: string | number | boolean | null | undefined): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${v.replace(/'/g, "''")}'`;
};
const json = (v: unknown) => `${lit(JSON.stringify(v ?? {}))}::jsonb`;
const out: string[] = [];
function insert(table: string, rows: Record<string, string>[], conflict = "do nothing") {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    out.push(
      `insert into public.${table} (${cols.join(", ")}) values\n` +
        chunk.map((r) => `  (${cols.map((c) => r[c]).join(", ")})`).join(",\n") +
        `\non conflict ${conflict};`,
    );
  }
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
const programme: Programme = JSON.parse(readFileSync(join(ROOT, "content/curriculum", `${VERSION}.json`), "utf8"));
const spec: Spec = JSON.parse(readFileSync(join(ROOT, "content/curriculum/exam_spec.json"), "utf8"));
const errors: string[] = [];

const versionId = id("version", programme.code);
const specVersionId = id("version", spec.code);

const specLoCodes = new Set(spec.papers.flatMap((p) => p.groups.flatMap((g) => g.sections.flatMap((s) => s.objectives.map((o) => o.code)))));
/** LO id for "11.2.1.1" (KTP) or "11.5.4.1@paper" (Paper specification). */
const loId = (ref: string) => {
  const { code, paper } = splitLoRef(ref);
  return paper ? id("lo", spec.code, code) : id("lo", programme.code, code);
};
const loExists = (ref: string) => {
  const { code, paper } = splitLoRef(ref);
  return paper ? specLoCodes.has(code) : loCodes.has(code);
};
const topicId = (slug: string) => id("topic", programme.code, slug);
const paperId = (n: number) => id("paper", programme.code, n);
const sectionId = (paper: number, code: string) => id("section", programme.code, paper, code);
const loCodes = new Set(programme.objectives.map((o) => o.code));
const topicSlugs = new Map<string, { grade: number; objectives: string[]; title: string; examOnly?: boolean }>();

// ---------------------------------------------------------------------------
// Curriculum: school programme
// ---------------------------------------------------------------------------
out.push("-- Generated by scripts/build-seed.ts — do not edit by hand.\nbegin;");
out.push(`-- ${programme.title}`);

insert("curriculum_versions", [
  {
    id: lit(versionId),
    code: lit(programme.code),
    title: lit(programme.title),
    academic_year: lit(programme.academic_year),
    kind: lit("school_programme"),
    is_active: "true",
    source_documents: json(programme.source_documents),
  },
  {
    id: lit(specVersionId),
    code: lit(spec.code),
    title: lit(spec.title),
    academic_year: lit(spec.academic_year),
    kind: lit("exam_specification"),
    is_active: "false",
    source_documents: json(spec.source_documents),
  },
]);

const gradeRows: Record<string, string>[] = [];
const termRows: Record<string, string>[] = [];
const unitRows: Record<string, string>[] = [];
const topicRows: Record<string, string>[] = [];
const topicLoRows: Record<string, string>[] = [];
const placementRows: Record<string, string>[] = [];
let topicOrder = 0;

for (const g of programme.grades) {
  const gid = id("grade", programme.code, g.number);
  gradeRows.push({
    id: lit(gid),
    curriculum_version_id: lit(versionId),
    number: lit(g.number),
    title: lit(g.title),
    total_hours: lit(g.terms.reduce((s, t) => s + (t.hours ?? 0), 0) || null),
    sort_order: lit(g.number),
  });
  for (const t of g.terms) {
    const tid = id("term", programme.code, g.number, t.number);
    termRows.push({ id: lit(tid), grade_id: lit(gid), number: lit(t.number), title: lit(t.title), hours: lit(t.hours), sort_order: lit(t.number) });
    t.units.forEach((u, ui) => {
      const uid = id("unit", programme.code, u.code);
      unitRows.push({ id: lit(uid), term_id: lit(tid), code: lit(u.code), title: lit(u.title), sort_order: lit(ui) });
      u.topics.forEach((tp, ti) => {
        const tpid = topicId(tp.slug);
        if (topicSlugs.has(tp.slug)) errors.push(`duplicate topic slug ${tp.slug}`);
        topicSlugs.set(tp.slug, { grade: g.number, objectives: tp.objectives, title: tp.title });
        topicRows.push({
          id: lit(tpid),
          curriculum_version_id: lit(versionId),
          slug: lit(tp.slug),
          title: lit(tp.title),
          description: "null",
          recommended_minutes: lit(tp.hours ? tp.hours * 30 : null),
          status: lit("published"),
          sort_order: lit(topicOrder++),
        });
        for (const code of tp.objectives) {
          topicLoRows.push({ topic_id: lit(tpid), learning_objective_id: lit(loId(code)) });
        }
        placementRows.push({
          id: lit(id("placement", tp.slug, u.code)),
          topic_id: lit(tpid),
          unit_id: lit(uid),
          lessons: lit(tp.lessons),
          hours: lit(tp.hours),
          period: lit(tp.period),
          resources: lit(tp.resources || null),
          sort_order: lit(ti),
        });
      });
    });
  }
}

insert("grades", gradeRows);
insert("terms", termRows);
insert("units", unitRows);
insert(
  "learning_objectives",
  programme.objectives.map((o) => ({
    id: lit(loId(o.code)),
    curriculum_version_id: lit(versionId),
    code: lit(o.code),
    description: lit(o.description),
    grade: lit(Number(o.code.slice(0, 2))),
  })),
);
// Exam-only topics: Paper 1-2-3 objectives not taught in this KTP (no school placement).
for (const t of programme.exam_only_topics ?? []) {
  if (topicSlugs.has(t.slug)) errors.push(`duplicate topic slug ${t.slug}`);
  const grade = Math.min(...t.objectives.map((r) => Number(splitLoRef(r).code.slice(0, 2))));
  topicSlugs.set(t.slug, { grade, objectives: t.objectives, title: t.title, examOnly: true });
  topicRows.push({
    id: lit(topicId(t.slug)),
    curriculum_version_id: lit(versionId),
    slug: lit(t.slug),
    title: lit(t.title),
    description: lit("Assessed in the exam (Paper 1-2-3 specification) but not part of the 2026-2027 calendar plan."),
    recommended_minutes: lit(t.objectives.length * 45),
    status: lit("published"),
    sort_order: lit(topicOrder++),
  });
  for (const ref of t.objectives) topicLoRows.push({ topic_id: lit(topicId(t.slug)), learning_objective_id: lit(loId(ref)) });
}
for (const [slug, refs] of Object.entries(programme.paper_links ?? {})) {
  const t = topicSlugs.get(slug);
  if (!t) {
    errors.push(`paper_links: unknown topic ${slug}`);
    continue;
  }
  t.objectives = [...t.objectives, ...refs];
  for (const ref of refs) topicLoRows.push({ topic_id: lit(topicId(slug)), learning_objective_id: lit(loId(ref)) });
}

insert("topics", topicRows);
insert("school_placements", placementRows);

// Papers for the active programme
const paperRows: Record<string, string>[] = [];
const sectionRows: Record<string, string>[] = [];
for (const p of programme.papers) {
  paperRows.push({
    id: lit(paperId(p.number)),
    curriculum_version_id: lit(versionId),
    number: lit(p.number),
    title: lit(p.title),
    description: "null",
    sort_order: lit(p.number),
  });
  p.groups.forEach((grp, gi) => {
    const gid = id("section-group", programme.code, p.number, grp.title);
    sectionRows.push({
      id: lit(gid),
      paper_component_id: lit(paperId(p.number)),
      parent_id: "null",
      code: "null",
      title: lit(grp.title),
      sort_order: lit(gi * 100),
    });
    grp.sections.forEach((s, si) => {
      sectionRows.push({
        id: lit(sectionId(p.number, s.code)),
        paper_component_id: lit(paperId(p.number)),
        parent_id: lit(gid),
        code: lit(s.code),
        title: lit(s.title),
        sort_order: lit(gi * 100 + si + 1),
      });
    });
  });
}
insert("paper_components", paperRows);
// parents first
insert("paper_sections", sectionRows.filter((r) => r.parent_id === "null"));
insert("paper_sections", sectionRows.filter((r) => r.parent_id !== "null"));

const lopRows = Object.entries(programme.objective_papers).map(([code, m]) => ({
  id: lit(id("lo-paper", programme.code, code, m.paper)),
  learning_objective_id: lit(loId(code)),
  paper_component_id: lit(paperId(m.paper)),
  paper_section_id: lit(sectionId(m.paper, m.section)),
}));
insert("objective_paper_map", lopRows);

// Exam placements: a topic appears under every paper section its objectives map to.
const specPaperOf = new Map<string, { paper: number; section: string }>();
for (const p of spec.papers) for (const g of p.groups) for (const s of g.sections) for (const o of s.objectives) specPaperOf.set(o.code, { paper: p.number, section: s.code });
const examPlacementRows: Record<string, string>[] = [];
for (const [slug, t] of topicSlugs) {
  const sections = new Set<string>();
  for (const ref of t.objectives) {
    const { code, paper } = splitLoRef(ref);
    const m = paper ? specPaperOf.get(code) : programme.objective_papers[code];
    if (m) sections.add(`${m.paper}|${m.section}`);
    if (!loExists(ref)) errors.push(`${slug}: unknown objective ${ref}`);
  }
  for (const s of sections) {
    const [paper, code] = s.split("|");
    examPlacementRows.push({
      id: lit(id("exam-placement", slug, s)),
      topic_id: lit(topicId(slug)),
      paper_section_id: lit(sectionId(Number(paper), code)),
      sort_order: lit(t.grade * 1000 + [...topicSlugs.keys()].indexOf(slug)),
    });
  }
}
insert("exam_placements", examPlacementRows);

// ---------------------------------------------------------------------------
// Curriculum: exam specification (kept as published; codes may differ from the KTP)
// ---------------------------------------------------------------------------
out.push(`-- ${spec.title}`);
{
  const specLos = new Map<string, string>();
  const sp: Record<string, string>[] = [];
  const ss: Record<string, string>[] = [];
  const sm: Record<string, string>[] = [];
  for (const p of spec.papers) {
    const pid = id("paper", spec.code, p.number);
    sp.push({ id: lit(pid), curriculum_version_id: lit(specVersionId), number: lit(p.number), title: lit(p.title), description: "null", sort_order: lit(p.number) });
    p.groups.forEach((grp, gi) => {
      const gid = id("section-group", spec.code, p.number, grp.title);
      ss.push({ id: lit(gid), paper_component_id: lit(pid), parent_id: "null", code: "null", title: lit(grp.title), sort_order: lit(gi * 100) });
      grp.sections.forEach((s, si) => {
        const sid = id("section", spec.code, p.number, s.code);
        ss.push({ id: lit(sid), paper_component_id: lit(pid), parent_id: lit(gid), code: lit(s.code), title: lit(s.title), sort_order: lit(gi * 100 + si + 1) });
        for (const o of s.objectives) {
          specLos.set(o.code, o.description);
          sm.push({
            id: lit(id("lo-paper", spec.code, o.code, p.number)),
            learning_objective_id: lit(id("lo", spec.code, o.code)),
            paper_component_id: lit(pid),
            paper_section_id: lit(sid),
          });
        }
      });
    });
  }
  insert(
    "learning_objectives",
    [...specLos].map(([code, description]) => ({
      id: lit(id("lo", spec.code, code)),
      curriculum_version_id: lit(specVersionId),
      code: lit(code),
      description: lit(description),
      grade: lit(Number(code.slice(0, 2))),
    })),
  );
  insert("paper_components", sp);
  insert("paper_sections", ss.filter((r) => r.parent_id === "null"));
  insert("paper_sections", ss.filter((r) => r.parent_id !== "null"));
  insert("objective_paper_map", sm);
}

// Topic ↔ objective links (after both versions' objectives exist).
insert("topic_objectives", topicLoRows);

// ---------------------------------------------------------------------------
// Theory packs and questions
// ---------------------------------------------------------------------------
const questionIdByKey = new Map<string, string>();
const qRows: Record<string, string>[] = [];
const qoRows: Record<string, string>[] = [];
const optRows: Record<string, string>[] = [];
const msRows: Record<string, string>[] = [];

function paperForQuestion(q: AuthoredQuestion): number | null {
  const counts = new Map<number, number>();
  for (const ref of q.objectives) {
    const { code, paper } = splitLoRef(ref);
    const m = paper ? specPaperOf.get(code) : programme.objective_papers[code];
    if (m) counts.set(m.paper, (counts.get(m.paper) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function addQuestion(
  q: AuthoredQuestion | AuthoredPart,
  topicSlug: string,
  defaults: { source: string; practice: boolean },
  part?: { parentId: string; order: number },
) {
  if (questionIdByKey.has(q.key)) errors.push(`duplicate question key ${q.key}`);
  const parts = "parts" in q ? (q.parts ?? []) : [];
  if (q.type === "structured") {
    // The stem's marks and objectives come from its parts.
    q = { ...q, marks: Math.max(1, parts.reduce((t, p) => t + p.marks, 0)), objectives: q.objectives.length ? q.objectives : [...new Set(parts.flatMap((p) => p.objectives))] };
    if (parts.length === 0) errors.push(`${q.key}: structured question without parts`);
  }
  const slug = q.topic ?? topicSlug;
  const topic = topicSlugs.get(slug);
  if (!topic) errors.push(`${q.key}: unknown topic ${slug}`);
  for (const code of q.objectives) if (!loExists(code)) errors.push(`${q.key}: unknown LO ${code}`);
  const qid = id("question", q.key);
  questionIdByKey.set(q.key, qid);
  const paper = paperForQuestion(q);
  qRows.push({
    id: lit(qid),
    curriculum_version_id: lit(versionId),
    title: lit(q.title),
    question_text: lit(q.text),
    question_type: lit(q.type),
    marks: lit(q.marks),
    difficulty: lit(q.difficulty),
    command_word: lit(q.command_word ?? null),
    grading_method: lit(q.grading),
    grade: lit(topic?.grade ?? (q.objectives[0] ? Number(splitLoRef(q.objectives[0]).code.slice(0, 2)) : null)),
    paper_component_id: lit(paper ? paperId(paper) : null),
    topic_id: lit(topicId(slug)),
    content: json(q.content ?? {}),
    source_type: lit(q.source ?? defaults.source),
    source_reference: lit(q.source_reference ?? null),
    practice_enabled: lit(q.practice ?? defaults.practice),
    status: lit(q.status ?? "published"),
    parent_id: lit(part?.parentId ?? null),
    part_label: lit(part ? (q.part_label ?? null) : null),
    part_order: lit(part?.order ?? 0),
  });
  for (const code of new Set(q.objectives)) qoRows.push({ question_id: lit(qid), learning_objective_id: lit(loId(code)) });
  (q.options ?? []).forEach((o, i) =>
    optRows.push({ id: lit(id("option", q.key, o.key)), question_id: lit(qid), key: lit(o.key), content: lit(o.content), sort_order: lit(i) }),
  );
  if (q.type === "structured") {
    const sorted = [...parts].sort((a, b) => comparePartLabels(a.part_label, b.part_label));
    sorted.forEach((p, i) => addQuestion({ ...p, topic: p.topic ?? q.topic }, topicSlug, { source: q.source ?? defaults.source, practice: q.practice ?? defaults.practice }, { parentId: qid, order: i }));
    return;
  }
  const pointsTotal = (q.scheme.points ?? []).reduce((s, p) => s + p.marks, 0);
  if (q.scheme.points?.length && q.grading !== "AUTO" && pointsTotal < q.marks) {
    errors.push(`${q.key}: marking points total ${pointsTotal} < ${q.marks} marks`);
  }
  msRows.push({
    id: lit(id("scheme", q.key, 1)),
    question_id: lit(qid),
    version: "1",
    is_current: "true",
    mark_scheme: lit(q.scheme.mark_scheme),
    marking_points: json(q.scheme.points ?? []),
    model_answer: lit(q.scheme.model_answer ?? null),
    accepted_answers: json(q.scheme.accepted ?? {}),
    ai_grading_instructions: lit(q.scheme.ai_instructions ?? null),
    explanation: lit(q.scheme.explanation ?? null),
  });
}

const packRows: Record<string, string>[] = [];
const secRows: Record<string, string>[] = [];
const secLoRows: Record<string, string>[] = [];
const examRows: Record<string, string>[] = [];
const examQRows: Record<string, string>[] = [];
const publish: string[] = [];

const topicFiles = readdirSync(join(ROOT, "content/topics")).filter((f) => f.endsWith(".json")).sort();
for (const file of topicFiles) {
  const raw = JSON.parse(readFileSync(join(ROOT, "content/topics", file), "utf8"));
  const parsed = authoredTopicSchema.safeParse(raw);
  if (!parsed.success) {
    errors.push(`${file}: ${parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
    continue;
  }
  const t = parsed.data;
  const topic = topicSlugs.get(t.topic);
  if (!topic) {
    errors.push(`${file}: unknown topic ${t.topic}`);
    continue;
  }
  const tpid = topicId(t.topic);
  if (t.summary) out.push(`update public.topics set description = ${lit(t.summary)} where id = ${lit(tpid)} and description is null;`);

  if (t.theory.length) {
    const packId = id("theory", t.topic);
    packRows.push({
      id: lit(packId),
      topic_id: lit(tpid),
      title: lit(topic.title),
      summary: lit(t.summary ?? null),
      status: lit("published"),
      published_at: "now()",
    });
    t.theory.forEach((s, i) => {
      const sid = id("theory-section", t.topic, i);
      secRows.push({ id: lit(sid), theory_pack_id: lit(packId), title: lit(s.title), blocks: json(s.blocks), sort_order: lit(i) });
      for (const code of s.objectives) {
        if (!loExists(code)) errors.push(`${file}: theory section "${s.title}" unknown LO ${code}`);
        secLoRows.push({ theory_section_id: lit(sid), learning_objective_id: lit(loId(code)) });
      }
    });
  }

  for (const q of t.questions) addQuestion(q, t.topic, { source: "original", practice: true });

  const examQs = t.topic_exam?.questions?.length ? t.topic_exam.questions.map((k) => t.questions.find((q) => q.key === k)!) : t.questions;
  if (examQs.length >= 3) {
    const examId = id("exam", "topic", t.topic);
    const marks = examQs.reduce((s, q) => s + (q.type === "structured" ? (q.parts ?? []).reduce((a, p) => a + p.marks, 0) : q.marks), 0);
    examRows.push({
      id: lit(examId),
      curriculum_version_id: lit(versionId),
      kind: lit("topic"),
      title: lit(t.topic_exam?.title ?? `${topic.title} — Topic Exam`),
      description: lit(`Exam-style questions on ${topic.title}.`),
      instructions: lit(t.topic_exam?.instructions ?? "Answer all questions. Your answers are saved automatically."),
      topic_id: lit(tpid),
      paper_component_id: "null",
      year: "null",
      grade: lit(topic.grade),
      duration_minutes: lit(t.topic_exam?.duration ?? Math.max(10, Math.round(marks * 1.3))),
      status: lit("draft"),
      availability_start: "null",
      availability_end: "null",
      attempt_limit: "null",
      integrity_mode: lit("warn"),
      max_violations: "3",
      show_mark_scheme: "true",
    });
    examQs.forEach((q, i) =>
      examQRows.push({ id: lit(id("exam-question", examId, q.key)), exam_id: lit(examId), question_id: lit(id("question", q.key)), sort_order: lit(i), section_label: "null" }),
    );
    publish.push(examId);
  }
}

// ---------------------------------------------------------------------------
// Mock exams
// ---------------------------------------------------------------------------
const resourceUpdates: string[] = [];
const mockFiles = readdirSync(join(ROOT, "content/mocks")).filter((f) => f.endsWith(".json")).sort();
for (const file of mockFiles) {
  const parsed = authoredMockSchema.safeParse(JSON.parse(readFileSync(join(ROOT, "content/mocks", file), "utf8")));
  if (!parsed.success) {
    errors.push(`${file}: ${parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
    continue;
  }
  const m = parsed.data;
  for (const q of m.questions) {
    if (!q.topic) errors.push(`${file}: mock question ${q.key} needs "topic"`);
    addQuestion(q, q.topic ?? "", { source: "mock", practice: false });
  }
  const examId = id("exam", "mock", m.key);
  examRows.push({
    id: lit(examId),
    curriculum_version_id: lit(versionId),
    kind: lit("mock"),
    title: lit(m.title),
    description: lit(m.description ?? null),
    instructions: lit(m.instructions ?? null),
    topic_id: "null",
    paper_component_id: lit(paperId(m.paper)),
    year: lit(m.year),
    grade: lit(m.grade ?? 12),
    duration_minutes: lit(m.duration),
    status: lit("draft"),
    availability_start: lit(m.availability_start ?? null),
    availability_end: lit(m.availability_end ?? null),
    attempt_limit: lit(m.attempt_limit ?? null),
    integrity_mode: lit(m.integrity_mode ?? "warn"),
    max_violations: lit(m.max_violations ?? 3),
    show_mark_scheme: lit(m.show_mark_scheme ?? false),
  });
  const keys = [...m.include, ...m.questions.map((q) => q.key)];
  keys.forEach((key, i) => {
    if (!questionIdByKey.has(key)) errors.push(`${file}: unknown question ${key}`);
    examQRows.push({ id: lit(id("exam-question", examId, key)), exam_id: lit(examId), question_id: lit(id("question", key)), sort_order: lit(i), section_label: "null" });
  });
  publish.push(examId);
  if (m.teacher_resources.length) resourceUpdates.push(`update public.exams set teacher_resources = ${json(m.teacher_resources)} where id = ${lit(examId)};`);
}

insert("theory_packs", packRows);
insert("theory_sections", secRows);
insert("theory_section_objectives", secLoRows);
insert("questions", qRows);
insert("question_objectives", qoRows);
insert("question_options", optRows);
insert("mark_schemes", msRows);
insert("exams", examRows);
out.push(...resourceUpdates);
insert("exam_questions", examQRows);
out.push(
  `select public.publish_exam(e.id) from public.exams e where e.id in (${publish.map(lit).join(", ")}) and e.current_version_id is null;`,
);
out.push("commit;");

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
writeFileSync(join(ROOT, "supabase/seed.sql"), out.join("\n\n") + "\n");
console.log(
  `seed.sql: ${topicSlugs.size} topics, ${programme.objectives.length} LOs, ${packRows.length} theory packs, ` +
    `${qRows.length} questions, ${examRows.length} exams`,
);
