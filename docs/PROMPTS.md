# Content-generation prompts

Two prompts for any AI model (ChatGPT, Claude, Gemini). For each topic:

1. Open `docs/TOPICS.md`, copy the topic's block (slug, title, placement, paper, learning objectives).
2. Paste it in place of `{{TOPIC_BLOCK}}` in the prompt.
3. Save the output:
   - Prompt 1 → `<slug>.html` → `npm run import:html -- <slug>.html --apply`
   - Prompt 2 → `<slug>.questions.json` → send it for import into the question bank.

---

## Prompt 1 — Theory pack (HTML)

````text
You are an experienced NIS (Nazarbayev Intellectual Schools) Computer Science teacher and examiner,
writing for Grade 11–12 students preparing for exams of Cambridge International AS & A Level standard.

Write a COMPLETE THEORY PACK for this topic:

{{TOPIC_BLOCK}}

CONTENT REQUIREMENTS
- Cover EVERY learning objective listed, to the depth needed to answer exam questions on it.
  Use the objective's command verb as a guide (describe → features; explain → reasons/how;
  compare → similarities AND differences; calculate → worked numeric examples; create/write → code).
- British English, precise exam terminology, short paragraphs, no filler.
- For every key term give a one-sentence definition a student could write in an exam.
- Include worked examples (step by step for calculations, conversions, algorithms, SQL, code).
- Include comparison tables where two or more things are contrasted (advantages/disadvantages etc.).
- Include exam tips (how marks are awarded) and common mistakes.
- Typical length: 8–16 sections.
- The last two sections MUST be "Exam knowledge and common mistakes" and "Lesson summary".
- Do not invent learning-objective codes; mention only the codes given above
  (write a code ending in "@paper" WITHOUT the suffix in the HTML, e.g. 11.5.4.1).

OUTPUT FORMAT — a single self-contained HTML file. Follow this structure EXACTLY:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>…topic title…</title>
  <style> …your CSS (allowed, optional)… </style>
</head>
<body>
<header class="hero">
  <h1>…full lesson title…</h1>
  <p>…one-paragraph summary of the lesson…</p>
  <div class="objective-row">
    <div class="objective"><strong>LO CODE</strong> LO description</div>
    …one div per learning objective…
  </div>
</header>
<main>
  <section id="short-id">
    <h2>1. Section title</h2>
    …section content…
  </section>
  …more sections…
</main>
</body>
</html>

ALLOWED ELEMENTS INSIDE A <section> (use only these):
- <h3>, <h4> for sub-headings (exactly one <h2> per section, at the top)
- <p> with inline <strong>, <em>, <code>, <a href="https://…">, <br>
- <ul>/<ol> with <li>
- <table> with <thead> (one header row) and <tbody>; 2–6 columns; no merged cells
- Code: optional label then the block:
    <span class="code-label">Python</span>
    <pre><code>…code with &lt; and &gt; escaped…</code></pre>
  Labels: HTML, CSS, JavaScript, Python, SQL, Pseudocode, Prolog, Assembly
- Callout boxes, the first <strong> is the title:
    <div class="callout"><strong>Key idea</strong> text…</div>            (blue: notes, key ideas)
    <div class="callout success"><strong>Exam tip</strong> text…</div>    (green: exam tips)
    <div class="callout warning"><strong>Common mistake</strong> text…</div> (amber)
    <div class="callout danger"><strong>Important</strong> text…</div>    (red: critical rules)
- Concept cards (a grid of short items):
    <div class="concept-grid">
      <div class="card"><h3>Term</h3><p>explanation…</p></div>
      …2–6 cards…
    </div>
- Diagrams built only from HTML/CSS (no images):
    <div class="diagram"> …nested divs styled with classes defined in <style>… </div>
- ONLY for HTML/CSS/web topics — live rendered examples:
    <div class="demo">
      <div class="demo-title">Visual result</div>
      <div class="demo-body"> …the HTML being demonstrated (inline styles or classes from <style>)… </div>
    </div>

FORBIDDEN: <script>, inline event handlers (onclick, onload…), <iframe>, <img>, external fonts,
CDNs or links to stylesheets, SVG files, base64 images, emojis in headings.

Return ONLY the HTML file, nothing before or after it.
````

---

## Prompt 2 — Practice and exam questions (JSON)

````text
You are a senior NIS Computer Science examiner writing exam-style questions of
Cambridge International AS & A Level standard.

Write the QUESTION BANK for this topic:

{{TOPIC_BLOCK}}

REQUIREMENTS
- 14–18 questions in total, covering EVERY learning objective at least twice.
- Difficulty mix: ~4 "easy", ~5 "medium", ~4 "hard", ~3 "exam" (full exam-style, 4–8 marks).
- Use a variety of types suited to the topic. Always include: mcq, multiple_response, true_false,
  matching, fill_blank, short_answer, and at least one extended or scenario question.
  Also include, where the topic allows: calculation (number systems, file sizes, data rates),
  trace_table (algorithms), sql, html_css, pseudocode, code_completion, code_analysis,
  table_completion, labelled_answers, boolean_expression, logic_circuit, binary_tree,
  flowchart, dfd, erd.
- Include 2–3 "structured" questions in the style of the real papers: one shared stem (scenario,
  table, figure or code) followed by 2–5 parts (a), (b), (b)(i)… of 1–6 marks each.
- Each mark must be earnable by a clearly identifiable point in the mark scheme.
- Questions must be original (do not copy past-paper wording). British English.
- Use only the learning-objective codes listed above, exactly as written —
  keep the "@paper" suffix where it appears (e.g. "11.5.4.1@paper").

OUTPUT — ONLY valid JSON (no comments, no trailing commas, no markdown fences), in this shape:

{
  "topic": "<TOPIC_SLUG>",
  "questions": [ <question>, … ]
}

Each <question> object:
{
  "key": "<TOPIC_SLUG without the g11-/g12- prefix>-<short-name>",   // unique, lowercase, digits and dashes only
  "title": "Short title (≤ 60 characters)",
  "type": "mcq | multiple_response | true_false | matching | fill_blank | short_answer | extended |
           calculation | code_completion | code_analysis | trace_table | sql | html_css | pseudocode |
           diagram | scenario | structured | labelled_answers | table_completion |
           boolean_expression | logic_circuit | flowchart | dfd | erd | binary_tree",
  "marks": 1–12,
  "difficulty": "easy | medium | hard | exam",
  "command_word": "state | name | identify | define | describe | explain | compare | analyse |
                   evaluate | discuss | suggest | calculate | complete | write | draw",
  "grading": "AUTO | AI | HYBRID",
  "objectives": ["11.x.x.x"],                // 1–3 codes from the list above (keep any @paper suffix)
  "text": "Question text in Markdown. Code in ``` fences. Tables in Markdown.",
  "options": [ {"key": "A", "content": "…"}, … ],   // ONLY for mcq and multiple_response (4 options A–D)
  "content": { … },                          // see per-type rules; may be {} 
  "scheme": {
    "mark_scheme": "Markdown mark scheme: one line per creditworthy point, with (1) after each",
    "points": [ {"criterion": "…", "marks": 1}, … ],  // REQUIRED for AI/HYBRID; sum of marks ≥ question marks
    "model_answer": "A full-mark answer written as a strong student would write it",
    "accepted": { … },                       // REQUIRED for AUTO and HYBRID, see per-type rules
    "ai_instructions": "Optional extra marking rules (alternatives to accept, what not to credit)",
    "explanation": "2–4 sentences explaining the correct answer (shown after practice)"
  }
}

PER-TYPE RULES (follow exactly — answers are auto-marked from these fields):
- mcq: 4 options A–D, exactly one correct. grading "AUTO". accepted: {"correct": "B"}
- multiple_response: 4–6 options, 2–3 correct; text must say how many to select ("Select **two** …").
  marks = number of correct options. grading "AUTO". accepted: {"correct": ["A", "C"]}
- true_false: text is a single statement. marks 1. grading "AUTO". accepted: {"correct": true}
- matching: content: {"left": [{"key":"L1","text":"…"}, …], "right": [{"key":"R1","text":"…"}, …]}
  with the SAME number of items on both sides (3–6), right item Rn matching left item Ln.
  marks = number of pairs. grading "AUTO". accepted: {"pairs": {"L1":"R1","L2":"R2", …}}
- fill_blank: text contains placeholders [[1]], [[2]] … (one per gap). content: {"blank_count": N}
  marks = N. grading "AUTO". accepted: {"blanks": [["answer","accepted alternative"], ["…"]]}
  (one inner list per placeholder, in order; list every reasonable spelling/synonym)
- calculation: grading "HYBRID" when working earns marks (points must include method marks),
  "AUTO" for a single final value. content: {"unit": "bytes"} if relevant.
  accepted: {"values": ["30000"], "numeric": true}  — or for binary/hex strings:
  {"values": ["01001101"], "ignore_spaces": true}
- short_answer: for one exact term use grading "HYBRID" with accepted {"values": ["term","synonym"]};
  for explanations use grading "AI" (no "accepted"). content: {"answer_lines": 3–5}
- trace_table: content: {"columns": ["i","total","OUTPUT"], "rows": N}; the algorithm in "text".
  grading "AUTO". accepted: {"rows": [["1","5",""], …]} — exactly N rows, one value per column,
  use null for cells that are not marked. marks = number of rows (or fewer, marks scale per row).
- extended, scenario, diagram: grading "AI". content: {"answer_lines": 8–12}. For "discuss/evaluate"
  include points for both sides and a justified conclusion.
- sql, html_css, pseudocode, code_completion, code_analysis: grading "AI".
  content: {"language": "sql | html | css | python | javascript | pseudocode | prolog | assembly",
            "starter_code": "optional code shown in the editor"}.
  Put any given tables/code in "text". points must award specific correct elements
  (e.g. "SELECT correct columns (1)", "WHERE condition correct (1)").
- structured: "text" is the shared stem (scenario / table / code; no question in it).
  "parts": [ <question> with an extra "part_label": "(a)" | "(b)(i)" … ], each part a complete question
  of any type except structured, with its own key, marks, objectives and scheme.
  The stem needs no scheme ("scheme": {"mark_scheme": ""}); its "marks" = sum of the parts.
- labelled_answers: several labelled boxes in one answer, e.g. "Advantage" / "Disadvantage",
  "Mantissa" / "Exponent", "1" / "2". content: {"fields": [{"key":"1","label":"Advantage","lines":2}, …]}.
  Exact values: grading "AUTO", accepted: {"fields": {"1": ["answer","alternative"], …}}.
  Written answers: grading "AI" with points per box.
- table_completion: content: {"columns": ["Term","Description"], "rows": N,
  "prefill": [["RAM", null], [null, "Stores the boot program"], …]} (null = cell the student fills).
  Exact cells: grading "AUTO", accepted: {"rows": [[null,"…"], ["ROM", null], …]} (alternatives in one
  cell separated by "||"). Descriptions: grading "AI" with one point per row.
- boolean_expression: the student writes X = … ; grading "AUTO", accepted: {"expression": "(A AND B) OR NOT C"}
  (any equivalent expression scores). content: {"output": "X"}.
- logic_circuit: the student draws the circuit with gates. content: {"inputs": ["A","B","C"], "output": "X"}.
  accepted: {"expression": "…"}; grading "HYBRID" with points (e.g. "correct gate for A AND B (1)").
- binary_tree: the student draws the tree. accepted: {"tree": ["50","30","70",null,"40"]} (level order,
  null = empty position); grading "AUTO".
- flowchart, dfd, erd: the student draws shapes and arrows; grading "AI" with specific points
  (e.g. "decision box tests count < 10 (1)", "data flow 'order details' from Customer to process (1)",
  "one-to-many relationship between CLASS and STUDENT (1)"). content may give a starting diagram:
  {"starter": {"nodes": [{"id":"e1","type":"entity","label":"Customer","x":0,"y":0}], "edges": []}}
  (node types — flowchart: terminator, process, decision, io; dfd: entity, dfd_process, store;
  erd: er_entity with "NAME\nattribute1, attribute2").

Return ONLY the JSON.
````
