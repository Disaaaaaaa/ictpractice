# Expanding a topic — full checklist

The standard every topic must meet before it is taught. Used by the teacher and by the nightly
routine (`content/expansion-queue.json`). Reference topics that already meet it:
`g11-data-dictionary` (lessons 1–2, theory with SVG and a widget, auto practice, ҚМЖ) and
`g12-data-protection-measures`.

Everything is in **English**. Learning objectives are listed per topic in `docs/TOPICS.md`; the
exam format rules are in `docs/EXAM_FORMATS.md`; block syntax in `docs/CONTENT.md`
("Theory packs in Markdown").

## 0. Before you start

- [ ] Read the topic's current files: `content/theory/<slug>.md`, `content/topics/<slug>.json`,
      its learning objectives in `docs/TOPICS.md`, and one reference topic above.
- [ ] Lessons: one lesson = 2 hours (80 min). If the topic has no `lessons` in its JSON, create them from
      the hours in the queue / KTP (2 h → 1 lesson, 4 h → 2, 6 h → 3, 8 h → 4), each with a clear title.
      Never renumber lessons of a topic that students have already handed notes or practice for.
- [ ] Is the topic already being taught? (students have practice attempts, notes or exam attempts for it).
      Then: do not remove questions that have attempts, do not change lesson numbers, and do not replace
      the topic exam if it already has attempts — only add.

## 1. Theory (per lesson, `content/theory/<slug>.md`, one `#` section per part of a lesson)

Each lesson has 2–3 theory sections plus one **"Exam practice"** section. Each lesson's theory must contain:

- [ ] Every learning objective of the lesson covered explicitly (`@lo` line under each `#` section).
- [ ] **Definitions** (`:::definition`) for every key term, in exam wording.
- [ ] At least one **comparison table** (`:::compare`) — e.g. advantages / disadvantages, A vs B.
- [ ] At least **two diagrams drawn as SVG** (`:::svg Caption`): processes, structures, before/after.
      Rules: `<svg class="xx" viewBox="0 0 760 H">` with a topic prefix class, CSS scoped like
      `svg.xx .t{…}`, colours only from CSS variables (`--primary`, `--primary-soft`, `--success`,
      `--success-soft`, `--danger`, `--danger-soft`, `--warning`, `--surface-2`, `--border`, `--muted`,
      `--foreground`), text ≥ 12px, an `aria-label`. No `<script>`, no event handlers, no external images.
- [ ] **No ASCII diagrams** — replace every existing one with SVG (or mermaid for simple flows).
- [ ] At least one **worked example** (`:::example`) taken step by step from a realistic scenario
      (school, clinic, shop, Kazakhstan context welcome).
- [ ] **Cards / steps** for procedures ("How to …").
- [ ] **Common mistakes** (`:::warning`) — the real errors students make.
- [ ] Code / SQL / pseudocode blocks where the topic needs them, with a caption.
- [ ] "Exam practice" section: 4–6 exam-style questions with **model answers and marks**
      (`**Q: … [2]**` then the answer with (1) marks), a common-mistakes box and a
      **"Check yourself"** list.
- [ ] Depth: about 12–25 blocks per lesson. Wide tables are fine (they scroll).
- [ ] `npm run theory:build -- <slug>` passes; no section is empty.
- [ ] Interactive widgets (`:::widget name`) only from the existing list in
      `src/lib/theory/blocks.ts` — do not write new app code at night.

## 2. Practice (per lesson, in `content/topics/<slug>.json`)

- [ ] **12–20 questions per lesson, all `"grading": "AUTO"`** (teacher's rule: practice is auto-marked only).
      Allowed types: `mcq`, `true_false`, `multiple_response`, `matching`, `fill_blank`
      (accepted alternatives per blank), `short_answer` with `accepted.values`, `table_completion` with
      ticks (`tick: true`) or text cells (`accepted.rows`, alternatives `a||b`, `""` = must stay empty).
- [ ] Mix of types and difficulties (easy → hard), command words, explanations on MCQs.
- [ ] Every question tests something in that lesson's theory; no question needs knowledge from a later lesson.
- [ ] Old practice questions graded `AI` / `HYBRID`: convert to AUTO if possible, otherwise remove them
      from the lesson (removed questions are archived on upload; their past attempts stay).
- [ ] Keys are unique, lowercase-with-dashes, and **never reused or renamed** once uploaded.
- [ ] Lesson `questions` lists the keys in a sensible order (easy first).

## 3. Exam Mode — one exam per topic, exactly 40 marks

- [ ] `topic_exam`: `{ "title": "<Topic> — Exam (Paper 1 style)" or "(Paper 2 style)", "duration": 50,
      "instructions": "Answer **all** questions. … Total: 40 marks. Time: 50 minutes.", "questions": [...] }`.
- [ ] Paper style from `docs/TOPICS.md` (PAPER line). Paper 1: mostly state / describe / explain /
      compare, some tables and calculations. Paper 2: scenarios, diagrams (ERD, DFD, flowchart via the
      diagram question types), SQL, tables.
- [ ] 4–6 **structured** questions (`type: structured`, a scenario stem, parts (a), (b), (c)…),
      parts of 1–6 marks, total **exactly 40**. Covers every learning objective of the topic and every
      lesson. Command words as in real papers; marks shown in the part text are not needed (the platform shows them).
- [ ] Each part has a full mark scheme: `mark_scheme` text with (1) per point, `points` that add up to
      the part's marks, a `model_answer`. Written parts are `"grading": "AI"` (checked by the teacher's
      nightly routine); objective parts `AUTO`.
- [ ] All exam questions `"practice": false`; none copied from the practice set.
- [ ] Never reproduce real past-paper or SAU questions (copyright / exam security) — write new ones.
- [ ] If the topic already has an exam **with attempts**, leave it unchanged and report it.

## 4. Notes checklist (per lesson)

- [ ] `content/notes-checklists/<slug>-L<n>.json`:
      `{ "topic": slug, "lesson": n, "points": [ { "title", "must", "weight": 1–3 } ] }`,
      10–15 points that follow the lesson's theory in order; weight 3 = core definition / key idea,
      1 = detail. `must` says exactly what a full note contains.

## 5. Check and upload

- [ ] `npx tsx scripts/check-topic.ts <slug> --exam-marks 40` prints "✓ ready to upload".
- [ ] `npm test` passes.
- [ ] Upload: `npm run theory:apply -- <slug>` then `npm run questions:apply -- <slug>`
      (needs `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] Commit only the topic's files (`content/theory/<slug>.md`, `content/topics/<slug>.json`,
      `content/notes-checklists/<slug>-L*.json`, `content/expansion-queue.json`) and push to `main`.
