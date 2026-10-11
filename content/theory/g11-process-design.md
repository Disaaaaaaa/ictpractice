---
summary: Designing processes with flowcharts — the standard symbols, sequence, selection and iteration, validation processes, counting and totalling loops, tracing a flowchart, converting between flowcharts and pseudocode, and the rules for drawing clear flowcharts.
---
# Flowcharts in process design
@lo 11.2.2.3

:::definition Flowchart
A diagram that shows the **steps of a process or algorithm in order**, using standard **symbols** joined by **arrows** (flow lines). It shows the **inputs, processing, decisions, loops and outputs** of one process in a system.
:::

In the **design** stage, the DFD shows **what** processes the system has; a **flowchart** shows **how** each process works, step by step, so that a programmer can code it.

:::compare Flowchart symbols
| Symbol | Shape | Use | Example |
|---|---|---|---|
| **Terminator** | Rounded rectangle (oval) | **Start** and **end** of the flowchart | START / END |
| **Process** | Rectangle | A calculation or an assignment | `total ← total + price` |
| **Input / Output** | Parallelogram | Data entered or displayed | `INPUT email`, `OUTPUT "Welcome"` |
| **Decision** | Diamond | A question with **two exits** (Yes / No, True / False) | `age >= 18?` |
| **Flow line** | Arrow | The **order** of the steps | → |
| **Subroutine / predefined process** | Rectangle with double sides | A procedure or function defined elsewhere | `CalculateTax` |
| **Data store** (sometimes) | Cylinder / document | Saving to a database or file | `Save to Clients table` |
:::

:::tip Rules for a good flowchart
- **One START** and at least one **END**.
- Flow from **top to bottom** (and left to right); arrows show direction.
- Every **decision** has exactly **two labelled exits** (Yes/No).
- Each box contains **one** clear step.
- Loops return to a point **before** the decision that controls them.
- No arrow ends in mid-air; lines should not cross where avoidable.
:::

# Sequence and selection
@lo 11.2.2.3

:::mermaid Sequence — calculate the cost of tickets
flowchart TB
  A([START]) --> B[/INPUT tickets/]
  B --> C[cost ← tickets × 2000]
  C --> D[/OUTPUT cost/]
  D --> E([END])
:::

:::mermaid Selection — discount for more than two players
flowchart TB
  A([START]) --> B[/INPUT players/]
  B --> C{players > 2?}
  C -- Yes --> D["cost ← 2 × 2000 + (players − 2) × 2000 × 0.9"]
  C -- No --> E[cost ← players × 2000]
  D --> F[/OUTPUT cost/]
  E --> F
  F --> G([END])
:::

:::compare Nested selection — grade from a mark
| Mark | Output |
|---|---|
| 85 or more | "A" |
| 70–84 | "B" |
| 50–69 | "C" |
| below 50 | "Fail" |
:::

:::mermaid Nested decisions
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

# Iteration (loops)
@lo 11.2.2.3

:::compare Three kinds of loop
| Loop | Condition checked | Repeats | Pseudocode |
|---|---|---|---|
| **Count-controlled** | Counter compared with a limit | A **fixed** number of times | `FOR i ← 1 TO 850` |
| **Pre-condition** | **Before** each repetition | **0 or more** times, while the condition is true | `WHILE … DO … ENDWHILE` |
| **Post-condition** | **After** each repetition | **At least once**, until the condition is true | `REPEAT … UNTIL …` |
:::

:::mermaid Count-controlled loop — counting late students
flowchart TB
  A([START]) --> B["count ← 0, i ← 1"]
  B --> C{i <= 850?}
  C -- No --> H[/OUTPUT count/]
  C -- Yes --> D[/INPUT time of student i/]
  D --> E{time > 8:30?}
  E -- Yes --> F[count ← count + 1]
  E -- No --> G[i ← i + 1]
  F --> G
  G --> C
  H --> Z([END])
:::

:::mermaid Loop until the user stops — product price calculator
flowchart TB
  A([START]) --> B[total ← 0]
  B --> C[/INPUT price, quantity/]
  C --> D[total ← total + price × quantity]
  D --> E[/INPUT another? Y/N/]
  E --> F{another = Y?}
  F -- Yes --> C
  F -- No --> G[/OUTPUT total/]
  G --> H([END])
:::

:::callout info Counting and totalling
- **Counting:** a counter starts at **0** and increases by **1** each time an event happens — `count ← count + 1`.
- **Totalling:** a total starts at **0** and the **value** is added each time — `total ← total + price`.
- Always **initialise** counters and totals **before** the loop.
:::

# Validation processes
@lo 11.2.2.3

Many processes in a system **validate input**: they keep asking until the data is acceptable.

:::mermaid Registration process with validation
flowchart TB
  A([START]) --> B[/INPUT name, gender, email, password/]
  B --> C{"email contains @ and . ?"}
  C -- No --> D[/OUTPUT Invalid e-mail/]
  D --> B
  C -- Yes --> E{"password has an uppercase letter and a digit?"}
  E -- No --> F[/OUTPUT Weak password/]
  F --> B
  E -- Yes --> G[(Save client data in the database)]
  G --> H[/OUTPUT Password accepted/]
  H --> I([END])
:::

:::steps Building a validation loop
- **Input** the data.
- **Decision**: does it meet the rule (range, format, presence)?
- **No** → output an **error message** and go **back to the input**.
- **Yes** → continue with the next step (store, calculate, output).
:::

# Tracing and converting flowcharts
@lo 11.2.2.3

:::example Trace the counting flowchart with 4 students (times 8:20, 8:35, 8:31, 8:25; limit 4)
| i | time | time > 8:30? | count |
|---|---|---|---|
| — | — | — | 0 |
| 1 | 8:20 | No | 0 |
| 2 | 8:35 | Yes | 1 |
| 3 | 8:31 | Yes | 2 |
| 4 | 8:25 | No | 2 |
| 5 | — | loop ends | **OUTPUT 2** |
:::

```text | The counting flowchart as pseudocode
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
| Parallelogram `INPUT x` | `INPUT x` |
| Rectangle `x ← x + 1` | `x ← x + 1` |
| Diamond with Yes / No | `IF … THEN … ELSE … ENDIF` |
| Diamond + arrow back **up** to before it | `WHILE … ENDWHILE` (test at the top) or `REPEAT … UNTIL` (test at the bottom) |
| Counter + diamond + arrow back | `FOR i ← 1 TO n … NEXT i` |
:::

# Exam practice and summary
@lo 11.2.2.3

:::example Exam-style mark schemes
**Q: Draw a flowchart of the Product Price Calculator app using a loop structure. [5]**
Marks for: a **condition** (decision) (1), a **loop** back to repeat (1), **input** (1), **output** (1), a **process** (calculation) (1).

**Q: Create a flowchart for counting late students (850 students, first lesson at 8:30). [4]**
Loop for **850** students (1); **input** each arrival time (1); **decision** `time > 8:30` (1); **count ← count + 1** and output the count after the loop (1).

**Q: Draw a flowchart for the registration process that validates the e-mail (contains "." and "@") and the password (uppercase letters and numbers), stores the data and shows a confirmation. [5]**
Input of the four items (1); e-mail validation decision (1); password validation decision (1); store in the database (1); confirmation message, with invalid data looping back (1).
:::

:::warning Common mistakes
- Using a rectangle for input/output, or a parallelogram for a calculation.
- Decisions with only **one** exit, or exits not labelled Yes/No.
- Forgetting to **initialise** the counter or total, or initialising it **inside** the loop.
- A loop that never changes its counter — an **infinite loop**.
- Missing START or END.
:::

:::steps Check yourself
- Draw the six main flowchart symbols and say what each is for.
- Draw a flowchart that inputs two numbers and outputs the larger.
- Draw a flowchart that totals 10 prices entered by the user.
- Draw a validation loop for an age between 11 and 18.
- Trace your flowchart with test data.
- Convert a flowchart with a loop into pseudocode.
:::
