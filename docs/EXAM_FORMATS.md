# NIS Grade 12 Computer Science — exam formats

Analysis of the test specifications (2023-24, 2024-25, 2025-26) and the 2023, 2024 and 2025 papers
in `specification-past papers/` (structure only; no paper content is reproduced here).

## Papers (2025-2026 specification)

| Paper | Title | Time | Marks | Questions | Assessment objectives |
|---|---|---|---|---|---|
| 1 | Theory fundamentals | 90 min | 70 (35%) | 8–14 compulsory structured short-answer questions | AO1 45 · AO2 25 · AO3 0 |
| 2 | Solution design | 90 min | 70 (35%) | 5–10 compulsory structured questions | AO1 15 · AO2 25 · AO3 30 |
| 3 | Problem-solving and programming skills | 120 min | 60 (30%) | 5–10 compulsory structured questions; answers in a programming language or pseudocode | AO1 5 · AO2 20 · AO3 35 |

Paper 3 assesses 12.5.1.2, 11.5.1.3 and 11.5.1.4 from strand 5.1; Paper 1 assesses the rest of 5.1.
Language of assessment: English. Grades A*–E (U = ungraded).

## What the real papers look like

| | 2023 | 2024 | 2025 |
|---|---|---|---|
| Paper 1 questions / parts | 12 / 38 | 8 / 28 | 10 / 36 |
| Paper 2 questions / parts | 6 / 29 | 5 / 25 | 7 / 36 |
| Paper 3 questions / parts | 8 / 26 | 6 / 26 | 8 / 27 |

- **Almost every question has parts** — (a), (b), (c) and sub-parts (i), (ii) — that share one scenario, figure,
  table or piece of code (Paper 1: 28/30 questions, Paper 2: 18/18, Paper 3: 20/22). Typical part: 1–4 marks;
  largest single parts 6–8 marks (tables, SQL, programs).
- Marks are shown per part, `[n]`, and per question, `[Total: n]`.
- Candidates may write code in pseudocode or any programming language they studied.

### Answer formats (share of marks, 2023–2025, approximate)

| Format | Paper 1 | Paper 2 | Paper 3 |
|---|---|---|---|
| Written short / extended (state, describe, explain, compare) | ~75% | ~35% | ~45% |
| Calculations and conversions with working (number bases, two's complement, floating point, file sizes) | ~14% | ~8% | ~8% |
| Table completion (definitions, memory addressing, test data, values) | ~8% | ~7% | ~5% |
| Tick boxes / draw lines to match | ~2% | ~1% | — |
| Program code / pseudocode (write, complete, modify, rewrite, analyse) | ~2% | ~2% | ~30% |
| SQL (DDL and DML, multi-table SELECT) | — | ~18% | ~5% |
| Trace tables | — | — | ~4% |
| Truth tables | — | ~4% | — |
| Logic circuits (draw / derive expression) | — | ~5% | — |
| Diagrams: DFD, flowchart, ERD, other | — | ~20% | ~2% |
| HTML / CSS | — | — | ~3% |

Command words seen most: *state, give, identify, name, define, describe, explain, write, complete, draw,
create, convert, perform, determine, use, modify/rewrite, suggest, compare.*

## What the platform's Exam section needs

| Need | Status | Notes |
|---|---|---|
| Multiple choice, tick boxes, true/false | ✅ | `mcq`, `multiple_response`, `true_false` |
| Draw lines to match | ✅ | `matching` |
| Short / extended written answers | ✅ | AI marking against the mark scheme |
| Calculations with working | ✅ | `calculation` (HYBRID: answer key + AI for method marks) |
| Several labelled answer boxes in one part | ✅ | `labelled_answers` — AUTO with accepted values per box, or AI |
| Program code, pseudocode, HTML/CSS, SQL writing | ✅ | code editor + AI marking (SQL execution sandbox is Phase 2) |
| Trace tables and truth tables | ✅ | `trace_table` with prefilled cells |
| General table completion (text cells) | ✅ | `table_completion` — given cells, AUTO per row (alternatives `a\|\|b`) or AI |
| Questions with parts sharing a stem (1(a), 1(b)(i)…) | ✅ | `structured` stem + parts (`parent_id`, `part_label`); exams show the stem above every part and number parts 1(a), 1(b)(i) |
| Figures and images in questions and theory | ✅ | "Insert image" uploads to the Supabase Storage bucket `media` (PNG/JPEG/WebP/GIF ≤ 5 MB) |
| Boolean expressions | ✅ | `boolean_expression` — any expression with the same truth table scores |
| Logic circuits | ✅ | `logic_circuit` — gate builder; AUTO by truth-table equivalence, HYBRID adds AI partial credit |
| Binary trees | ✅ | `binary_tree` — AUTO against the expected level order (editor can build it from BST insertions) |
| Flowcharts, DFDs, ERDs | ✅ | `flowchart`, `dfd`, `erd` — diagram builder; the drawing is described in text for the AI examiner |
