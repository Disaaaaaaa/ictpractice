---
summary: Designing the processes of a new system with flowcharts — the standard symbols and rules, sequence and selection (nested decisions, AND / OR conditions), iteration with count-controlled, pre-condition and post-condition loops, counting and totalling, validation loops, tracing a flowchart with a trace table and converting between flowcharts and pseudocode.
---
# Flowcharts in process design
@lo 11.2.2.3

In the **design** stage of a new system the analyst already has a **DFD**, which shows **what** processes the system has (e.g. *Register client*, *Calculate order cost*). Before anything is coded, each process is designed in detail: **how** it works, step by step. The most common tool for this is the **flowchart** — the programmer later turns it into code.

:::definition Flowchart
A **diagram** that shows the **steps of a process (algorithm) in order**, using **standard symbols** joined by **flow lines (arrows)**. It shows the **inputs, processing, decisions, loops and outputs** of one process.
:::

:::definition Algorithm
A **finite sequence of clear steps** that solves a problem or carries out a task. A flowchart and pseudocode are two ways of **representing** an algorithm.
:::

:::definition Process design
The part of system design in which the **logic of every process** of the new system is planned (with flowcharts or pseudocode), so that it can be **coded, tested and checked** with the client before development starts.
:::

:::svg The standard flowchart symbols
<svg class="pd1" viewBox="0 0 760 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Six flowchart symbols: terminator (rounded box) for start and end, process (rectangle) for a calculation, input/output (parallelogram), decision (diamond) with two exits, subroutine (rectangle with double sides) and flow line (arrow)">
  <style>
    svg.pd1 .sh{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pd1 .ds{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.pd1 .in{stroke:var(--primary);stroke-width:2}
    svg.pd1 .ln{stroke:var(--foreground);stroke-width:2.2;fill:none}
    svg.pd1 .ah{fill:var(--foreground)}
    svg.pd1 .c{font:13px ui-monospace,monospace;fill:var(--foreground);text-anchor:middle}
    svg.pd1 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground);text-anchor:middle}
    svg.pd1 .s{font:12px system-ui,sans-serif;fill:var(--muted);text-anchor:middle}
  </style>
  <rect class="sh" x="20" y="30" width="100" height="50" rx="25"/><text class="c" x="70" y="60">START</text>
  <text class="h" x="70" y="118">Terminator</text><text class="s" x="70" y="138">START / END of</text><text class="s" x="70" y="156">the flowchart</text>
  <rect class="sh" x="145" y="30" width="100" height="50"/><text class="c" x="195" y="60">x ← x + 1</text>
  <text class="h" x="195" y="118">Process</text><text class="s" x="195" y="138">a calculation or</text><text class="s" x="195" y="156">an assignment</text>
  <polygon class="sh" points="282,30 372,30 358,80 268,80"/><text class="c" x="320" y="60">INPUT age</text>
  <text class="h" x="320" y="118">Input / Output</text><text class="s" x="320" y="138">data entered or</text><text class="s" x="320" y="156">displayed</text>
  <polygon class="ds" points="445,20 502,55 445,90 388,55"/><text class="c" x="445" y="60">age≥18?</text>
  <text class="h" x="445" y="118">Decision</text><text class="s" x="445" y="138">a Yes / No question</text><text class="s" x="445" y="156">with two exits</text>
  <rect class="sh" x="520" y="30" width="100" height="50"/><line class="in" x1="532" y1="30" x2="532" y2="80"/><line class="in" x1="608" y1="30" x2="608" y2="80"/><text class="c" x="570" y="60">Tax()</text>
  <text class="h" x="570" y="118">Subroutine</text><text class="s" x="570" y="138">a predefined process</text><text class="s" x="570" y="156">(procedure / function)</text>
  <line class="ln" x1="650" y1="55" x2="728" y2="55"/><path class="ah" d="M740,55 l-14,-7 v14 z"/>
  <text class="h" x="695" y="118">Flow line</text><text class="s" x="695" y="138">shows the order</text><text class="s" x="695" y="156">of the steps</text>
</svg>
:::

:::compare Flowchart symbols
| Symbol | Shape | Use | Example |
|---|---|---|---|
| **Terminator** | Rounded rectangle (oval) | **Start** and **end** of the flowchart | START / END |
| **Process** | Rectangle | A **calculation** or an **assignment** | `total ← total + price` |
| **Input / Output** | Parallelogram | Data **entered** by the user or **displayed / printed** | `INPUT email`, `OUTPUT "Welcome"` |
| **Decision** | Diamond | A **question** with **two exits** (Yes / No, True / False) | `age >= 18?` |
| **Flow line** | Arrow | The **order** of the steps | → |
| **Subroutine (predefined process)** | Rectangle with double sides | A procedure or function defined in another flowchart | `CalculateTax` |
| **Data store** (in some books) | Cylinder | Saving to / reading from a database or file | `Save to Clients table` |
:::

:::compare DFD or flowchart?
| | Data flow diagram (DFD) | Flowchart |
|---|---|---|
| Shows | **What** processes the system has and **how data moves** between them | **How one process works** — the order of its steps |
| Contains | External entities, processes, data stores, data flows | Terminators, processes, inputs / outputs, decisions, flow lines |
| Decisions and loops | **Not shown** | **Shown** (diamonds, arrows back) |
| Level | Whole system (or one level of it) | One process / algorithm |
| Used by | Analyst and client to agree the system's scope | Programmer to **code** the process; tester to choose test data |
:::

:::compare Advantages and disadvantages of flowcharts
| Advantages | Disadvantages |
|---|---|
| **Visual** — the logic is easy to follow, even for a non-programmer (the client) | **Large** processes give big, hard-to-read diagrams |
| Errors in the logic are found **before coding** | **Slow** to draw and to change — a small change may mean redrawing |
| **Independent of any programming language** | Not as close to code as pseudocode |
| Becomes part of the **technical documentation** for maintenance | Complex conditions are hard to fit into a diamond |
:::

:::tip Rules for a good flowchart
- **One START** and at least one **END**.
- Flow from **top to bottom** (and left to right); every flow line has an **arrowhead**.
- Every **decision** has exactly **two exits**, labelled **Yes / No** (or True / False).
- **One step per box**, written clearly — e.g. `INPUT price`, not "the user types something".
- Use the **correct symbol** for each step.
- A loop returns to a point **before** the decision (or body) it repeats.
- No flow line ends in mid-air; avoid crossing lines.
:::

:::warning Common mistakes
- Drawing an **input or output** in a **rectangle**, or a **calculation** in a **parallelogram**.
- Forgetting **START** or **END**, or using a rectangle for them.
- Writing a whole paragraph in one box instead of one step per box.
- Saying that a flowchart "shows the data flow of the whole system" — that is a **DFD**.
:::

# Sequence and selection
@lo 11.2.2.3

Every algorithm is built from only **three** structures: **sequence**, **selection** and **iteration** (lesson 2).

:::definition Sequence
Steps carried out **one after another, in order**, each exactly once. In a flowchart: a straight line of boxes from START to END.
:::

:::definition Selection
A **decision** chooses which path to follow, depending on whether a **condition** is **true or false**. In a flowchart: a **diamond** with two exits (Yes / No) that **join again** later. In pseudocode: `IF … THEN … ELSE … ENDIF`.
:::

:::definition Variable and assignment
A **variable** is a named storage location whose value can change (e.g. `cost`). **Assignment** `cost ← tickets × 2500` stores the value on the right in the variable on the left.
:::

:::svg Sequence (left) and selection (right)
<svg class="pd2" viewBox="0 0 760 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a sequence flowchart START, INPUT tickets, cost = tickets times 2500, OUTPUT cost, END. Right: a selection flowchart START, INPUT total, decision total at least 10000, Yes gives delivery 0, No gives delivery 1500, then OUTPUT total plus delivery and END">
  <style>
    svg.pd2 .sh{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pd2 .ds{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.pd2 .ln{stroke:var(--foreground);stroke-width:1.8;fill:none}
    svg.pd2 .ah{fill:var(--foreground)}
    svg.pd2 .dv{stroke:var(--border);stroke-width:1.5;stroke-dasharray:6 5}
    svg.pd2 .c{font:13px ui-monospace,monospace;fill:var(--foreground);text-anchor:middle}
    svg.pd2 .hd{font:700 15px system-ui,sans-serif;fill:var(--primary);text-anchor:middle}
    svg.pd2 .yn{font:700 13px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="hd" x="150" y="22">Sequence</text>
  <rect class="sh" x="90" y="40" width="120" height="40" rx="20"/><text class="c" x="150" y="65">START</text>
  <line class="ln" x1="150" y1="80" x2="150" y2="102"/><path class="ah" d="M150,110 l-6,-11 h12 z"/>
  <polygon class="sh" points="80,110 230,110 220,150 70,150"/><text class="c" x="150" y="135">INPUT tickets</text>
  <line class="ln" x1="150" y1="150" x2="150" y2="172"/><path class="ah" d="M150,180 l-6,-11 h12 z"/>
  <rect class="sh" x="45" y="180" width="210" height="40"/><text class="c" x="150" y="205">cost ← tickets × 2500</text>
  <line class="ln" x1="150" y1="220" x2="150" y2="242"/><path class="ah" d="M150,250 l-6,-11 h12 z"/>
  <polygon class="sh" points="85,250 225,250 215,290 75,290"/><text class="c" x="150" y="275">OUTPUT cost</text>
  <line class="ln" x1="150" y1="290" x2="150" y2="312"/><path class="ah" d="M150,320 l-6,-11 h12 z"/>
  <rect class="sh" x="90" y="320" width="120" height="40" rx="20"/><text class="c" x="150" y="345">END</text>
  <line class="dv" x1="310" y1="10" x2="310" y2="460"/>
  <text class="hd" x="545" y="22">Selection</text>
  <rect class="sh" x="485" y="40" width="120" height="40" rx="20"/><text class="c" x="545" y="65">START</text>
  <line class="ln" x1="545" y1="80" x2="545" y2="102"/><path class="ah" d="M545,110 l-6,-11 h12 z"/>
  <polygon class="sh" points="480,110 620,110 610,150 470,150"/><text class="c" x="545" y="135">INPUT total</text>
  <line class="ln" x1="545" y1="150" x2="545" y2="167"/><path class="ah" d="M545,175 l-6,-11 h12 z"/>
  <polygon class="ds" points="545,175 640,215 545,255 450,215"/><text class="c" x="545" y="220">total ≥ 10000?</text>
  <polyline class="ln" points="640,215 680,215 680,277"/><path class="ah" d="M680,285 l-6,-11 h12 z"/><text class="yn" x="648" y="207">Yes</text>
  <polyline class="ln" points="450,215 410,215 410,277"/><path class="ah" d="M410,285 l-6,-11 h12 z"/><text class="yn" x="418" y="207">No</text>
  <rect class="sh" x="612" y="285" width="136" height="40"/><text class="c" x="680" y="310">delivery ← 0</text>
  <rect class="sh" x="330" y="285" width="160" height="40"/><text class="c" x="410" y="310">delivery ← 1500</text>
  <polyline class="ln" points="680,325 680,345 545,345"/><polyline class="ln" points="410,325 410,345 545,345 545,362"/><path class="ah" d="M545,370 l-6,-11 h12 z"/>
  <polygon class="sh" points="455,370 650,370 640,410 445,410"/><text class="c" x="545" y="395">OUTPUT total + delivery</text>
  <line class="ln" x1="545" y1="410" x2="545" y2="422"/><path class="ah" d="M545,430 l-6,-11 h12 z"/>
  <rect class="sh" x="485" y="430" width="120" height="36" rx="18"/><text class="c" x="545" y="453">END</text>
</svg>
:::

:::example Worked example — the Keruen cinema, Astana
*A ticket at the Keruen cinema costs **2500 ₸**. Children **under 12** pay **1500 ₸**. Design a process that inputs the age of one customer and outputs the price.*

1. **Inputs:** `age`. **Output:** `price`.
2. **Decision:** the price depends on a condition → **selection**: `age < 12?`
3. **Yes** exit → `price ← 1500`; **No** exit → `price ← 2500`.
4. Both paths **join** before `OUTPUT price`, then END.
5. **Test** it with normal, boundary and other values:

| age | age < 12? | price output |
|---|---|---|
| 8 | Yes | 1500 |
| 11 | Yes | 1500 |
| 12 | No | 2500 (boundary: 12 is **not** under 12) |
| 30 | No | 2500 |
:::

:::mermaid Nested decisions — a grade from a mark
flowchart TB
  A([START]) --> B[/INPUT mark/]
  B --> C{mark >= 85?}
  C -- Yes --> D[/OUTPUT A/]
  C -- No --> E{mark >= 70?}
  E -- Yes --> F[/OUTPUT B/]
  E -- No --> G{mark >= 50?}
  G -- Yes --> H[/OUTPUT C/]
  G -- No --> I[/OUTPUT Fail/]
  D --> Z([END])
  F --> Z
  H --> Z
  I --> Z
:::

**Nested selection** means a decision placed on an exit of another decision. Checking from the **highest** boundary down (85, then 70, then 50) means each later decision only needs one comparison.

:::compare Writing conditions
| Operator | Meaning | Example condition | True when |
|---|---|---|---|
| `=` | equal to | `answer = "Y"` | answer is Y |
| `<>` (≠) | not equal to | `password <> ""` | something was typed |
| `<`, `<=` (≤) | less than, less than or equal | `age < 12` | age is 0 … 11 |
| `>`, `>=` (≥) | greater than, greater than or equal | `mark >= 50` | mark is 50 or more |
| `AND` | **both** conditions true | `age >= 11 AND age <= 18` | age is 11 … 18 |
| `OR` | **at least one** condition true | `day = "Sat" OR day = "Sun"` | it is the weekend |
| `NOT` | reverses a condition | `NOT (stock > 0)` | stock is 0 or less |
:::

:::svg One decision with AND = two nested decisions
<svg class="pd3" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a single decision age at least 11 AND age at most 18 with Yes to Accept and No to Reject. Right: the same logic as two decisions, age at least 11 then age at most 18; both No exits go to Reject">
  <style>
    svg.pd3 .ds{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.pd3 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.pd3 .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.pd3 .ln{stroke:var(--foreground);stroke-width:1.8;fill:none}
    svg.pd3 .ah{fill:var(--foreground)}
    svg.pd3 .dv{stroke:var(--border);stroke-width:1.5;stroke-dasharray:6 5}
    svg.pd3 .c{font:13px ui-monospace,monospace;fill:var(--foreground);text-anchor:middle}
    svg.pd3 .hd{font:700 14px system-ui,sans-serif;fill:var(--primary);text-anchor:middle}
    svg.pd3 .yn{font:700 13px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="hd" x="175" y="24">One decision with AND</text>
  <polygon class="ds" points="175,50 335,110 175,170 15,110"/><text class="c" x="175" y="106">age ≥ 11</text><text class="c" x="175" y="124">AND age ≤ 18?</text>
  <line class="ln" x1="175" y1="170" x2="175" y2="222"/><path class="ah" d="M175,230 l-6,-11 h12 z"/><text class="yn" x="183" y="196">Yes</text>
  <rect class="ok" x="115" y="230" width="120" height="40"/><text class="c" x="175" y="255">Accept</text>
  <polyline class="ln" points="335,110 345,110 345,250 312,250"/><path class="ah" d="M304,250 l11,-6 v12 z"/><text class="yn" x="352" y="104">No</text>
  <rect class="no" x="246" y="232" width="58" height="36"/><text class="c" x="275" y="255">Reject</text>
  <line class="dv" x1="380" y1="10" x2="380" y2="320"/>
  <text class="hd" x="570" y="24">Two nested decisions</text>
  <polygon class="ds" points="520,45 600,80 520,115 440,80"/><text class="c" x="520" y="85">age ≥ 11?</text>
  <line class="ln" x1="520" y1="115" x2="520" y2="142"/><path class="ah" d="M520,150 l-6,-11 h12 z"/><text class="yn" x="528" y="136">Yes</text>
  <polygon class="ds" points="520,150 600,185 520,220 440,185"/><text class="c" x="520" y="190">age ≤ 18?</text>
  <line class="ln" x1="520" y1="220" x2="520" y2="252"/><path class="ah" d="M520,260 l-6,-11 h12 z"/><text class="yn" x="528" y="240">Yes</text>
  <rect class="ok" x="460" y="260" width="120" height="40"/><text class="c" x="520" y="285">Accept</text>
  <polyline class="ln" points="600,80 690,80 690,172"/><path class="ah" d="M690,180 l-6,-11 h12 z"/><text class="yn" x="610" y="72">No</text>
  <polyline class="ln" points="600,185 682,185"/><path class="ah" d="M690,185 l-11,-6 v12 z"/><text class="yn" x="610" y="177">No</text>
  <rect class="no" x="690" y="168" width="60" height="36"/><text class="c" x="720" y="191">Reject</text>
</svg>
:::

:::steps How to draw a flowchart from a description
- Read the task and list the **inputs**, the **outputs** and the **calculations**.
- Find every **condition** ("if", "more than", "only when") → each becomes a **decision**.
- Find every **repetition** ("for each", "until", "keep asking") → a **loop** (lesson 2).
- Draw **START**, then the boxes **top to bottom**, one step per box, with the correct symbols.
- Label the two exits of every decision **Yes / No** and make the paths **join** again.
- Finish with **END**, then **trace** it with test data (normal, boundary, invalid).
:::

:::warning Common mistakes
- A decision with **one exit** only, or exits not labelled Yes / No.
- Writing the decision as a statement (`age = 12`) when a **question** is meant (`age = 12?`), or putting an assignment in a diamond.
- Wrong boundary: "under 12" is `age < 12`, not `age <= 12`; "from 11 to 18" needs `>=` and `<=`.
- Using `OR` where `AND` is needed: `age >= 11 OR age <= 18` is true for **every** age.
- Forgetting to **join** the two paths, so one path has no END.
:::

# Exam practice: symbols, sequence and selection
@lo 11.2.2.3

:::example Exam-style questions with model answers
**Q: State the purpose of a flowchart in the design stage of a new system. [2]**
It shows **how a process works step by step** / the order of inputs, processes, decisions and outputs (1), so that the logic can be checked and the **programmer can code it** (1).

**Q: Name the flowchart symbol used for `INPUT quantity` and the symbol used for `quantity > 10?`. [2]**
Parallelogram (input/output) (1); diamond (decision) (1).

**Q: A shop charges 1500 ₸ delivery for orders under 10 000 ₸; larger orders are delivered free. Draw a flowchart that inputs the order total and outputs the amount to pay. [4]**
INPUT total (1); decision `total >= 10000?` / `total < 10000?` with Yes/No labels (1); correct delivery on each exit (0 or 1500) (1); OUTPUT total + delivery, paths joined and START/END present (1).

**Q: Give the output of the grade flowchart (85 / 70 / 50 boundaries) for the marks 70 and 49. [2]**
70 → "B" (1); 49 → "Fail" (1).

**Q: Explain why the condition `age >= 11 OR age <= 18` is wrong for "ages 11 to 18". [2]**
With OR only one part has to be true (1), so every age (e.g. 40, since 40 ≥ 11) gives Yes; `AND` is needed (1).
:::

:::warning Common mistakes in answers
- Naming shapes incorrectly: the **diamond** is a decision, the **parallelogram** is input/output, the **oval** is the terminator.
- Drawing a flowchart with no labels on the decision exits — examiners do not give the decision mark.
- Describing what the flowchart is "about" instead of giving the **output** for the input asked.
:::

:::steps Check yourself
- Draw the six flowchart symbols and say what each is for.
- Explain the difference between a DFD and a flowchart.
- Give two advantages and one disadvantage of flowcharts.
- Draw a flowchart that inputs two numbers and outputs the larger.
- Draw a flowchart for the cinema price (under 12 → 1500 ₸, otherwise 2500 ₸) and test it with 11 and 12.
- Write a condition for "a mark from 0 to 100".
:::

# Iteration (loops)
@lo 11.2.2.3

:::definition Iteration
**Repeating** a group of steps (the **loop body**) — either a **fixed** number of times or **until / while a condition** is met. In a flowchart a loop is a **flow line going back** to an earlier point, controlled by a **decision**.
:::

:::definition Count-controlled loop
A loop that repeats a **known, fixed number of times**, using a **counter** (`FOR i ← 1 TO 30 … NEXT i`).
:::

:::definition Condition-controlled loop
A loop that repeats **while** a condition is true (**pre-condition**, tested **before** the body: `WHILE … ENDWHILE`) or **until** a condition becomes true (**post-condition**, tested **after** the body: `REPEAT … UNTIL`). Used when the number of repetitions is **not known in advance**.
:::

:::compare Three kinds of loop
| Loop | Condition checked | Repeats | Pseudocode | Typical use |
|---|---|---|---|---|
| **Count-controlled** | Counter compared with a limit | A **fixed** number of times | `FOR i ← 1 TO 850 … NEXT i` | Process every student of a class of 25 |
| **Pre-condition** | **Before** each repetition | **0 or more** times, **while** the condition is true | `WHILE … DO … ENDWHILE` | Read orders while there are more |
| **Post-condition** | **After** each repetition | **At least once**, **until** the condition is true | `REPEAT … UNTIL …` | Ask for a PIN until it is correct |
:::

:::svg Pre-condition loop (left) and post-condition loop (right)
<svg class="pd4" viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: WHILE loop, count set to 0, decision count less than 5 before the loop body, the body loops back above the decision, No exit leaves the loop. Right: REPEAT UNTIL loop, count set to 0, loop body first, then decision count equals 5, No loops back to the body, Yes leaves the loop">
  <style>
    svg.pd4 .sh{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pd4 .bd{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.pd4 .ds{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.pd4 .nx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pd4 .ln{stroke:var(--foreground);stroke-width:1.8;fill:none}
    svg.pd4 .lp{stroke:var(--primary);stroke-width:2.2;fill:none}
    svg.pd4 .ah{fill:var(--foreground)} svg.pd4 .ap{fill:var(--primary)}
    svg.pd4 .dv{stroke:var(--border);stroke-width:1.5;stroke-dasharray:6 5}
    svg.pd4 .c{font:13px ui-monospace,monospace;fill:var(--foreground);text-anchor:middle}
    svg.pd4 .hd{font:700 14px system-ui,sans-serif;fill:var(--primary);text-anchor:middle}
    svg.pd4 .yn{font:700 13px system-ui,sans-serif;fill:var(--muted)}
    svg.pd4 .s{font:13px system-ui,sans-serif;fill:var(--muted);text-anchor:middle}
  </style>
  <text class="hd" x="190" y="20">WHILE — test first</text>
  <rect class="sh" x="110" y="32" width="160" height="38"/><text class="c" x="190" y="56">count ← 0</text>
  <line class="ln" x1="190" y1="70" x2="190" y2="87"/><path class="ah" d="M190,95 l-6,-11 h12 z"/>
  <polygon class="ds" points="190,95 270,128 190,161 110,128"/><text class="c" x="190" y="133">count &lt; 5?</text>
  <line class="ln" x1="190" y1="161" x2="190" y2="180"/><path class="ah" d="M190,188 l-6,-11 h12 z"/><text class="yn" x="198" y="178">Yes</text>
  <rect class="bd" x="110" y="188" width="160" height="56"/><text class="c" x="190" y="211">loop body</text><text class="c" x="190" y="231">count ← count + 1</text>
  <polyline class="lp" points="190,244 190,262 60,262 60,82 180,82"/><path class="ap" d="M189,82 l-11,-6 v12 z"/>
  <polyline class="ln" points="270,128 330,128 330,305 278,305"/><path class="ah" d="M270,305 l11,-6 v12 z"/><text class="yn" x="280" y="120">No</text>
  <rect class="nx" x="110" y="287" width="160" height="36"/><text class="c" x="190" y="310">next step</text>
  <text class="s" x="190" y="350">body runs 0 or more times</text>
  <line class="dv" x1="380" y1="10" x2="380" y2="370"/>
  <text class="hd" x="570" y="20">REPEAT … UNTIL — test last</text>
  <rect class="sh" x="490" y="32" width="160" height="38"/><text class="c" x="570" y="56">count ← 0</text>
  <line class="ln" x1="570" y1="70" x2="570" y2="94"/><path class="ah" d="M570,102 l-6,-11 h12 z"/>
  <rect class="bd" x="490" y="102" width="160" height="56"/><text class="c" x="570" y="125">loop body</text><text class="c" x="570" y="145">count ← count + 1</text>
  <line class="ln" x1="570" y1="158" x2="570" y2="175"/><path class="ah" d="M570,183 l-6,-11 h12 z"/>
  <polygon class="ds" points="570,183 650,216 570,249 490,216"/><text class="c" x="570" y="221">count = 5?</text>
  <polyline class="lp" points="490,216 430,216 430,84 560,84"/><path class="ap" d="M569,84 l-11,-6 v12 z"/><text class="yn" x="458" y="208">No</text>
  <line class="ln" x1="570" y1="249" x2="570" y2="279"/><path class="ah" d="M570,287 l-6,-11 h12 z"/><text class="yn" x="578" y="270">Yes</text>
  <rect class="nx" x="490" y="287" width="160" height="36"/><text class="c" x="570" y="310">next step</text>
  <text class="s" x="570" y="350">body runs at least once</text>
</svg>
:::

## Counting and totalling

:::definition Counting
A **counter** starts at **0** and increases by **1** each time an event happens: `count ← count + 1` — e.g. the number of late students.
:::

:::definition Totalling
A **total** starts at **0** and the **value** of each item is added: `total ← total + price` — e.g. the total value of the day's orders.
:::

:::mermaid Count-controlled loop — counting late students (850 students, lessons start at 8:30)
flowchart TB
  A([START]) --> B["count ← 0, i ← 1"]
  B --> C{i <= 850?}
  C -- No --> H[/OUTPUT count/]
  C -- Yes --> D[/INPUT arrival time/]
  D --> E{time > 8:30?}
  E -- Yes --> F[count ← count + 1]
  E -- No --> G[i ← i + 1]
  F --> G
  G --> C
  H --> Z([END])
:::

:::example Worked example — the school canteen
*At the end of the day the canteen manager enters the value of each sale. Entering **0** means there are no more sales. The process outputs the **number of sales**, the **total takings** and the **average** sale.*

1. The number of sales is not known → a **condition-controlled** loop.
2. **Initialise** before the loop: `count ← 0`, `total ← 0`.
3. `INPUT sale` **before** the loop, then `WHILE sale <> 0`: `count ← count + 1`, `total ← total + sale`, `INPUT sale` again.
4. After the loop: if `count > 0` then `average ← total / count`; OUTPUT count, total, average.
5. Test with 800, 1200, 600, 0 → count = 3, total = 2600, average ≈ 866.67. Test with just 0 → count = 0 and **no division by zero** — this is why the pre-condition loop and the extra check are used.
:::

:::warning Common mistakes
- **Initialising** the counter or total **inside** the loop — it is reset every time.
- Forgetting to **change** the counter (`i ← i + 1`) → an **infinite loop**.
- An **off-by-one** error: `i < 850` instead of `i <= 850` processes only 849 students.
- Using a FOR loop when the number of repetitions is **not known** (e.g. "until the user enters 0").
- Confusing counting (`+ 1`) with totalling (`+ value`).
:::

# Validation processes
@lo 11.2.2.3

Many processes of a system must **validate input** before it is stored: the flowchart **keeps asking** until the data obeys the rule, so wrong data never reaches the database.

:::definition Validation
An **automatic check by the computer** that input data is **sensible / reasonable and obeys the rules** (e.g. within a range, in the right format) **before** it is accepted. It cannot prove that the data is **correct** — only that it is allowed.
:::

:::compare Validation checks as flowchart conditions
| Check | Rule | Decision in the flowchart |
|---|---|---|
| **Range check** | Value between limits | `age >= 11 AND age <= 18?` |
| **Presence check** | Something has been entered | `name <> ""?` |
| **Length check** | Number of characters | `LENGTH(password) >= 8?` |
| **Format check** | Pattern of characters | `email contains "@" and "."?` |
| **Type check** | Correct data type | `mark is an integer?` |
| **Lookup / existence check** | Value is in a list / table | `class in ("11A","11B","11C")?` |
:::

:::svg A validation loop — age from 11 to 18
<svg class="pd5" viewBox="0 0 760 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Validation loop: START, INPUT age, decision age at least 11 and at most 18; No outputs an error message and flows back to INPUT age; Yes outputs Accepted, then END">
  <style>
    svg.pd5 .sh{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pd5 .ds{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.pd5 .er{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.pd5 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.pd5 .nb{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pd5 .ln{stroke:var(--foreground);stroke-width:1.8;fill:none}
    svg.pd5 .lr{stroke:var(--danger);stroke-width:2.2;fill:none}
    svg.pd5 .ah{fill:var(--foreground)} svg.pd5 .ar{fill:var(--danger)}
    svg.pd5 .c{font:13px ui-monospace,monospace;fill:var(--foreground);text-anchor:middle}
    svg.pd5 .yn{font:700 13px system-ui,sans-serif;fill:var(--muted)}
    svg.pd5 .nt{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pd5 .nh{font:700 14px system-ui,sans-serif;fill:var(--primary)}
  </style>
  <rect class="sh" x="240" y="16" width="120" height="38" rx="19"/><text class="c" x="300" y="40">START</text>
  <line class="ln" x1="300" y1="54" x2="300" y2="80"/><path class="ah" d="M300,88 l-6,-11 h12 z"/>
  <polygon class="sh" points="230,88 390,88 375,132 215,132"/><text class="c" x="300" y="115">INPUT age</text>
  <line class="ln" x1="300" y1="132" x2="300" y2="152"/><path class="ah" d="M300,160 l-6,-11 h12 z"/>
  <polygon class="ds" points="300,160 450,205 300,250 150,205"/><text class="c" x="300" y="201">age ≥ 11 AND</text><text class="c" x="300" y="219">age ≤ 18?</text>
  <line class="lr" x1="450" y1="205" x2="492" y2="205"/><path class="ar" d="M500,205 l-11,-6 v12 z"/><text class="yn" x="458" y="196">No</text>
  <polygon class="er" points="520,183 740,183 725,227 505,227"/><text class="c" x="622" y="210">OUTPUT "Age must be 11–18"</text>
  <polyline class="lr" points="622,183 622,110 390,110"/><path class="ar" d="M383,110 l11,-6 v12 z"/>
  <text class="yn" x="470" y="102" style="fill:var(--danger)">back to INPUT</text>
  <line class="ln" x1="300" y1="250" x2="300" y2="272"/><path class="ah" d="M300,280 l-6,-11 h12 z"/><text class="yn" x="308" y="268">Yes</text>
  <polygon class="ok" points="230,280 390,280 375,322 215,322"/><text class="c" x="300" y="306">OUTPUT "Accepted"</text>
  <line class="ln" x1="300" y1="322" x2="300" y2="344"/><path class="ah" d="M300,352 l-6,-11 h12 z"/>
  <rect class="sh" x="240" y="352" width="120" height="38" rx="19"/><text class="c" x="300" y="376">END</text>
  <rect class="nb" x="470" y="262" width="280" height="128" rx="10"/>
  <text class="nh" x="486" y="286">How it works</text>
  <text class="nt" x="486" y="310">• the rule is a range check, 11–18</text>
  <text class="nt" x="486" y="332">• No → error message, back to INPUT</text>
  <text class="nt" x="486" y="354">• Yes → leave the loop</text>
  <text class="nt" x="486" y="376">• invalid data is never accepted</text>
</svg>
:::

:::mermaid Registration process with two validation checks
flowchart TB
  A([START]) --> B[/INPUT name, email, password/]
  B --> C{"email contains @ and . ?"}
  C -- No --> D[/OUTPUT Invalid e-mail/]
  D --> B
  C -- Yes --> E{"LENGTH(password) >= 8?"}
  E -- No --> F[/OUTPUT Password too short/]
  F --> B
  E -- Yes --> G[(Save client in the database)]
  G --> H[/OUTPUT Registration complete/]
  H --> I([END])
:::

:::steps How to build a validation loop
- **Input** the data.
- **Decision**: does it obey the rule (range, presence, length, format, type)?
- **No** → **output an error message** that says what is wrong, and flow **back to the input**.
- **Yes** → continue with the next step (store, calculate, output).
- **Test** it with **normal**, **boundary** (11, 18) and **erroneous** (10, 19, "abc") data.
:::

:::compare Validation or verification?
| | Validation | Verification |
|---|---|---|
| What it checks | Data is **reasonable / allowed** by the rules | Data has been **copied or typed accurately** |
| How | The **computer** applies rules (range, format…) | Double entry, or a **visual check** against the source |
| Example | Age 11–18 accepted, 45 rejected | Enter the password twice; the two must match |
:::

:::warning Common mistakes
- After the error message the flow goes to **END** — the user must be asked **again**.
- The error-message path joins **after** the decision instead of **before the input**.
- A range check written with `OR` (`age >= 11 OR age <= 18`) — it accepts every age.
- Claiming that validation makes data **correct** — a valid age 15 can still be the wrong age.
:::

# Tracing and converting flowcharts
@lo 11.2.2.3

:::definition Trace table (dry run)
A table with **one column per variable** (and for conditions / outputs), filled in **row by row** as the flowchart or algorithm is followed **by hand** with test data. It is used to find the **output** and to find **logic errors**.
:::

:::steps How to trace a flowchart
- Write a column for **every variable**, plus columns for important **conditions** and the **output**.
- Fill in the **initial values** (e.g. `total = 0`) in the first row.
- Follow the arrows one box at a time; write a **new value only when a variable changes**.
- At each **decision** write the result (Yes / No) and follow that exit.
- Stop at **END**; the output column is the answer.
:::

:::example Trace the late-students flowchart for 4 students (times 8:20, 8:35, 8:31, 8:25; limit 4)
| i | time | time > 8:30? | count | output |
|---|---|---|---|---|
| 1 | — | — | 0 | |
| 1 | 8:20 | No | 0 | |
| 2 | 8:35 | Yes | 1 | |
| 3 | 8:31 | Yes | 2 | |
| 4 | 8:25 | No | 2 | |
| 5 | — | i ≤ 4? No | 2 | **2** |
:::

:::svg A flowchart and its pseudocode, step by step
<svg class="pd6" viewBox="0 0 760 450" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A totalling flowchart for five prices aligned with its pseudocode: total and i initialised = total ← 0; decision i at most 5 = FOR i ← 1 TO 5; INPUT price = INPUT price; total ← total + price; i ← i + 1 with the loop back = NEXT i; OUTPUT total = OUTPUT total">
  <style>
    svg.pd6 .sh{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pd6 .ds{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.pd6 .cb{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pd6 .ln{stroke:var(--foreground);stroke-width:1.8;fill:none}
    svg.pd6 .lp{stroke:var(--primary);stroke-width:2.2;fill:none}
    svg.pd6 .ah{fill:var(--foreground)} svg.pd6 .ap{fill:var(--primary)}
    svg.pd6 .lk{stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4}
    svg.pd6 .c{font:13px ui-monospace,monospace;fill:var(--foreground);text-anchor:middle}
    svg.pd6 .k{font:14px ui-monospace,monospace;fill:var(--foreground)}
    svg.pd6 .kw{font-weight:700;fill:var(--primary)}
    svg.pd6 .yn{font:700 13px system-ui,sans-serif;fill:var(--muted)}
    svg.pd6 .hd{font:700 14px system-ui,sans-serif;fill:var(--primary);text-anchor:middle}
  </style>
  <text class="hd" x="150" y="18">Flowchart</text><text class="hd" x="560" y="18">Pseudocode</text>
  <rect class="sh" x="95" y="28" width="110" height="34" rx="17"/><text class="c" x="150" y="50">START</text>
  <line class="ln" x1="150" y1="62" x2="150" y2="72"/><path class="ah" d="M150,80 l-6,-10 h12 z"/>
  <rect class="sh" x="60" y="80" width="180" height="38"/><text class="c" x="150" y="104">total ← 0, i ← 1</text>
  <line class="ln" x1="150" y1="118" x2="150" y2="133"/><path class="ah" d="M150,141 l-6,-10 h12 z"/>
  <polygon class="ds" points="150,141 220,171 150,201 80,171"/><text class="c" x="150" y="176">i ≤ 5?</text>
  <line class="ln" x1="150" y1="201" x2="150" y2="216"/><path class="ah" d="M150,224 l-6,-10 h12 z"/><text class="yn" x="158" y="216">Yes</text>
  <polygon class="sh" points="85,224 225,224 215,260 75,260"/><text class="c" x="150" y="247">INPUT price</text>
  <line class="ln" x1="150" y1="260" x2="150" y2="273"/><path class="ah" d="M150,281 l-6,-10 h12 z"/>
  <rect class="sh" x="45" y="281" width="210" height="38"/><text class="c" x="150" y="305">total ← total + price</text>
  <line class="ln" x1="150" y1="319" x2="150" y2="332"/><path class="ah" d="M150,340 l-6,-10 h12 z"/>
  <rect class="sh" x="80" y="340" width="140" height="38"/><text class="c" x="150" y="364">i ← i + 1</text>
  <polyline class="lp" points="80,359 22,359 22,129 140,129"/><path class="ap" d="M149,129 l-11,-6 v12 z"/>
  <polyline class="ln" points="220,171 272,171 272,422 228,422"/><path class="ah" d="M220,422 l11,-6 v12 z"/><text class="yn" x="228" y="163">No</text>
  <polygon class="sh" points="85,404 225,404 215,440 75,440"/><text class="c" x="150" y="427">OUTPUT total</text>
  <rect class="cb" x="420" y="78" width="330" height="372" rx="8"/>
  <line class="lk" x1="244" y1="99" x2="430" y2="99"/><text class="k" x="440" y="104">total ← 0</text>
  <line class="lk" x1="224" y1="171" x2="430" y2="171"/><text class="k" x="440" y="176"><tspan class="kw">FOR</tspan> i ← 1 <tspan class="kw">TO</tspan> 5</text>
  <line class="lk" x1="222" y1="242" x2="430" y2="242"/><text class="k" x="470" y="247"><tspan class="kw">INPUT</tspan> price</text>
  <line class="lk" x1="258" y1="300" x2="430" y2="300"/><text class="k" x="470" y="305">total ← total + price</text>
  <line class="lk" x1="224" y1="359" x2="430" y2="359"/><text class="k" x="440" y="364"><tspan class="kw">NEXT</tspan> i</text>
  <line class="lk" x1="276" y1="422" x2="430" y2="422"/><text class="k" x="440" y="427"><tspan class="kw">OUTPUT</tspan> total</text>
</svg>
:::

```text | The late-students flowchart as pseudocode
count ← 0
FOR i ← 1 TO 850
    INPUT time
    IF time > 8:30 THEN
        count ← count + 1
    ENDIF
NEXT i
OUTPUT count
```

:::compare Flowchart ↔ pseudocode
| Flowchart | Pseudocode |
|---|---|
| Terminator START / END | (start and end of the program) |
| Parallelogram `INPUT x` / `OUTPUT x` | `INPUT x` / `OUTPUT x` |
| Rectangle `x ← x + 1` | `x ← x + 1` |
| Diamond with Yes / No exits that join again | `IF … THEN … ELSE … ENDIF` |
| Diamond **before** the body + arrow back **up** to the diamond | `WHILE condition DO … ENDWHILE` |
| Body **before** the diamond + arrow back **up** to the body | `REPEAT … UNTIL condition` |
| Counter set, compared with a limit, increased, arrow back | `FOR i ← 1 TO n … NEXT i` |
:::

:::example Worked example — converting pseudocode into a flowchart
```text | A PIN check (at most 3 tries)
tries ← 0
REPEAT
    INPUT pin
    tries ← tries + 1
UNTIL pin = 4321 OR tries = 3
IF pin = 4321 THEN
    OUTPUT "Welcome"
ELSE
    OUTPUT "Card blocked"
ENDIF
```
1. `tries ← 0` → **process** box after START.
2. `REPEAT` → nothing is drawn; remember **where the loop starts** (the next box).
3. `INPUT pin` → **parallelogram**; `tries ← tries + 1` → **rectangle**.
4. `UNTIL …` → **diamond** `pin = 4321 OR tries = 3?`; **No** → arrow back up to `INPUT pin`.
5. **Yes** → second **diamond** `pin = 4321?` → Yes: OUTPUT "Welcome"; No: OUTPUT "Card blocked"; join → END.
:::

:::warning Common mistakes
- In a trace table, rewriting **every** variable on every row — write a value only when it **changes**, but do not skip a change.
- Forgetting the **last test** of the loop condition (the row where the loop ends).
- Converting a post-condition loop into `WHILE` — the body would then not be guaranteed to run once.
- Mixing up the arrow targets: the loop arrow goes **back up**, the exit goes **on** to the next step.
:::

# Exam practice and summary
@lo 11.2.2.3

:::example Exam-style questions with model answers
**Q: Describe the difference between a pre-condition loop and a post-condition loop. [2]**
A pre-condition loop tests the condition **before** the body, so the body may run **zero** times (1); a post-condition loop tests **after** the body, so it always runs **at least once** (1).

**Q: Draw a flowchart that inputs the prices of 10 items and outputs the total. [5]**
`total ← 0` (and counter set) before the loop (1); loop for 10 items with a decision / counter (1); INPUT price inside the loop (1); `total ← total + price` (1); OUTPUT total after the loop, START/END (1).

**Q: Draw a flowchart for a registration process that validates the e-mail (contains "@" and ".") and the password (at least 8 characters), stores the data and shows a confirmation. [5]**
Input of the data (1); e-mail decision (1); password decision (1); invalid data → error message and **back to input** (1); store in the database and output a confirmation (1).

**Q: State the output of this algorithm: `n ← 1`, `REPEAT n ← n × 2 UNTIL n > 20`, `OUTPUT n`. [1]**
32 (1) — n takes the values 2, 4, 8, 16, 32.

**Q: Explain why the canteen process (sales until 0 is entered) uses a condition-controlled loop and not a count-controlled loop. [2]**
The number of sales is **not known in advance** (1), so the loop must stop when a condition (sale = 0) is met, not after a fixed count (1).
:::

:::warning Common mistakes in answers
- A loop with no **decision** — the examiner cannot see when it stops.
- Output **inside** the loop when only the final total is asked for.
- A validation flowchart whose error path ends at END instead of returning to the input.
:::

:::steps Check yourself
- Name the three kinds of loop and give the pseudocode of each.
- Draw a flowchart that totals 10 prices and outputs the total and the average.
- Draw a validation loop for an age between 11 and 18 and test it with 10, 11, 18 and 19.
- Complete a trace table for a loop with a counter and a total.
- Convert a flowchart with a loop into pseudocode, and a `REPEAT … UNTIL` into a flowchart.
- Explain what an infinite loop is and how to avoid it.
:::
