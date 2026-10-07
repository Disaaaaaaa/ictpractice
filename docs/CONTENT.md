# Content authoring guide

Theory packs, questions and mock exams can be added in two ways:

1. **In the app** — *Admin → Curriculum → topic → Edit theory pack* (block editor) and *Question Bank → New question*. Changes are live immediately, no deployment needed.
2. **As files** in `content/` (best for bulk loading). Files are validated and compiled into `supabase/seed.sql`:

```bash
npm run seed:build
```

To upload one topic's theory straight to the platform: `npm run theory:apply -- <topic-slug>` (add `--draft` to review before publishing).

Or run `supabase/seed.sql` against the database (SQL editor or `supabase db reset` locally). The seed is idempotent: re-running it never duplicates rows (IDs are derived from slugs and question keys).

The curriculum itself (grades, terms, units, topics, learning objectives, Paper 1/2/3 mapping) is generated from the KTP and Paper documents in `docs/source/` by `npm run curriculum:import`. Do not edit `content/curriculum/*.json` by hand — re-run the importer with new documents for a new academic year.

`content/topics/` currently contains four example topics (SDLC models, Number representation, Operating systems, Image representation) that show the format. Replace or delete them freely.

### Generating content with the OpenAI API

```bash
npm run content:generate -- paper-sorting-and-searching                 # questions (theory exists) → content/topics/<slug>.json
npm run content:generate -- paper-sorting-and-searching --apply         # …and publish questions + topic exam
npm run content:generate -- paper-blockchain --part all --apply --draft # theory + questions, unpublished for review
```

Uses the prompts in `docs/PROMPTS.md` and `CONTENT_MODEL` (default `gpt-5.5`). Output is validated against the schema and
auto-marking consistency checks; the model is asked to fix any problems (up to 2 rounds). Raw output is kept in
`content/generated/`. Existing theory is never overwritten without `--force`. Review generated content before publishing.

### Importing theory from HTML files

Theory written as an HTML page (header with LO codes, one `<section>` with an `<h2>` per part) can be converted automatically:

```bash
npm run import:html -- path/to/theory.html            # preview: writes content/topics/<slug>.json
npm run import:html -- path/to/theory.html --apply    # also publishes it to the platform
npm run import:html -- path/to/theory.html --apply --draft   # upload unpublished for review
npm run import:html -- path/to/theory.html --topic g11-web-page-design --apply   # choose the topic explicitly
```

The topic is detected from the LO codes in the page header. Headings, paragraphs, lists, tables, code, `.card` grids, `.callout` boxes, `.demo` "visual result" examples and `.diagram` elements are converted; scripts, event handlers and external resources are dropped. Re-importing replaces the topic's theory pack; questions in the same JSON file are kept.

---

## Topic file — `content/topics/<topic-slug>.json`

The file name is free; `topic` must be an existing topic slug (see *Admin → Curriculum → Topics*, e.g. `g11-sdlc-models`, `g12-boolean-logic`).

```json
{
  "topic": "g11-sdlc-models",
  "summary": "One-sentence description shown on the topic page.",
  "theory": [
    {
      "title": "The waterfall model",
      "objectives": ["11.2.1.2"],
      "blocks": [ { "type": "paragraph", "content": "Markdown **text**…" } ]
    }
  ],
  "questions": [ { "...": "see below" } ],
  "topic_exam": { "duration": 25 }
}
```

- `objectives` on a theory section maps it to learning objectives (used for progress).
- A **topic exam** is created automatically when a topic has 3 or more questions; `topic_exam.duration` (minutes) is optional.

### Theory block types

All text fields accept Markdown (bold, lists, tables, `code`, `$maths$`).

| `type` | Fields |
|---|---|
| `heading` | `text`, `level` (2 or 3) |
| `paragraph` | `content` |
| `definition` | `term`, `content` |
| `example` | `title?`, `content` |
| `exam_tip` | `content` |
| `warning` | `content` (shown as “Common mistake”) |
| `diagram` | `format` (`mermaid` or `ascii`), `content`, `caption?` |
| `image` | `url` (https:// or /path), `alt`, `caption?` |
| `code` | `language`, `content`, `caption?` |
| `formula` | `latex`, `caption?` |
| `comparison` | `title?`, `columns` (2–6), `rows` (array of arrays) |
| `steps` | `title?`, `items` (step-by-step explanation) |
| `list` | `items`, `ordered?` |
| `callout` | `tone` (`info`, `success`, `warning`, `danger`), `title?`, `content` |
| `cards` | `items`: `[{ "title": "…", "content": "…" }]` (shown as a grid) |
| `html_preview` | `html`, `css?`, `title?` — live HTML/CSS example in a sandboxed frame (no scripts, no network) |
| `interactive` | `widget`: `base_converter`, `twos_complement`, `binary_addition`, `truth_table`, `stack_queue`, `sort_visualizer`, `binary_search`; `title?`, `config?` — e.g. `{ "expression": "A AND B" }` (truth_table), `{ "algorithm": "insertion", "values": [5,1,4] }` (sort_visualizer), `{ "values": [3,8,12], "target": 8 }` (binary_search) |

### Question fields

```json
{
  "key": "sdlc-stage-order",          // unique, lowercase-with-dashes, never change once used
  "title": "Order of SDLC stages",
  "type": "mcq",
  "marks": 1,
  "difficulty": "easy",               // easy | medium | hard | exam
  "command_word": "identify",         // state, name, identify, define, describe, explain, compare,
                                      // analyse, evaluate, discuss, suggest, calculate, complete, write, draw
  "grading": "AUTO",                  // AUTO | AI | MANUAL | HYBRID
  "objectives": ["11.2.1.1"],
  "text": "Question text in Markdown",
  "options": [ { "key": "A", "content": "…" } ],     // mcq / multiple_response only
  "content": { "hint": "Shown only in Practice Mode" },
  "source": "original",               // original | teacher | nis_style | cambridge_style | past_paper | mock
  "source_reference": "optional, never shown to students",
  "practice": true,                   // false = exam-only (not visible in Practice)
  "scheme": {
    "mark_scheme": "Markdown mark scheme",
    "points": [ { "criterion": "…", "marks": 1 } ],  // used by the AI examiner
    "model_answer": "…",
    "accepted": { "correct": "B" },                  // answer key for AUTO / HYBRID
    "ai_instructions": "Extra rules for the AI examiner",
    "explanation": "Shown after checking in Practice"
  }
}
```

**Grading methods**

- `AUTO` — marked from `scheme.accepted` (objective types only). Instant, free.
- `AI` — marked by OpenAI against `mark_scheme` / `points` / `model_answer`; low-confidence marks go to the teacher.
- `HYBRID` — exact answer key first; if it does not match, the AI examiner marks it (good for calculations with working).
- `MANUAL` — always marked by the teacher.

**Answer keys (`scheme.accepted`) and extra `content` per type**

| Type | `content` | `accepted` |
|---|---|---|
| `mcq` | — (`options` required) | `{ "correct": "B" }` |
| `multiple_response` | — (`options` required) | `{ "correct": ["A","C"] }` — 1 mark per correct option, −1 per wrong one |
| `true_false` | — | `{ "correct": true }` |
| `matching` | `left`/`right`: `[{ "key": "L1", "text": "…" }]` | `{ "pairs": { "L1": "R2" } }` |
| `fill_blank` | text contains `[[1]]`, `[[2]]` … | `{ "blanks": [["answer","alternative"], ["…"]] }` |
| `calculation` | `unit?` | `{ "values": ["30000"], "numeric": true, "tolerance": 0.01 }` |
| `short_answer` | `answer_lines?` | optional `{ "values": [...] }` (otherwise AI) |
| `trace_table` | `columns`, `rows`, `prefill?` | `{ "rows": [["1", null, "3"]] }` (`null` = not marked) |
| `extended`, `scenario`, `diagram` | `answer_lines?`, `word_limit?` | — (AI or MANUAL) |
| `code_completion`, `code_analysis`, `sql`, `html_css`, `pseudocode` | `language`, `starter_code?` | — (AI or MANUAL) |

Also available for `values`/`blanks`: `"case_sensitive": true`, `"ignore_spaces": true`, and `"scoring": "all"` (all-or-nothing instead of per item).

---

## Mock exam file — `content/mocks/<key>.json`

```json
{
  "key": "mock-2026-paper-1",
  "year": 2026,
  "paper": 1,
  "grade": 12,
  "title": "Mock 2026 — Paper 1",
  "instructions": "Answer all questions.",
  "duration": 90,
  "attempt_limit": 1,
  "availability_start": "2026-12-01T09:00:00+05:00",
  "availability_end": "2026-12-01T12:00:00+05:00",
  "integrity_mode": "warn",
  "max_violations": 3,
  "show_mark_scheme": false,
  "include": ["question-key-from-a-topic-file"],
  "questions": [ { "key": "m26p1-q1", "topic": "g12-system-buses", "...": "same fields as above" } ]
}
```

Questions listed under `questions` are **mock-only** (not shown in Practice) and need a `topic` slug for analytics. Mocks are published automatically by the seed; after students start one, edits create a new exam version.

## Theory packs in Markdown (`content/theory/<slug>.md`)

Every topic's theory is written in a compact Markdown file and built into
`content/topics/<slug>.json` (questions in that file are kept):

```bash
npm run theory:build -- [slug …] [--apply] [--draft]
```

`--apply` uploads to Supabase (no OpenAI calls). The format is documented at the
top of `scripts/build-theory.ts`: `# Section` + `@lo codes`, paragraphs, `##`/`###`
headings, lists, ```` ``` ```` code with `| caption`, `$$latex$$`, and blocks
`:::definition`, `:::example`, `:::tip`, `:::warning`, `:::callout tone Title`,
`:::steps`, `:::cards`, `:::compare` (Markdown table), `:::mermaid`, `:::ascii`,
`:::html Title | height` (HTML, `---css---`, CSS — no scripts), `:::widget name`.
Escape a literal `|` inside a table cell as `\|`.
