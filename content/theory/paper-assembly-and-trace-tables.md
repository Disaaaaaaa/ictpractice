---
summary: Low-level languages and assembly language — mnemonics, opcode and operand, labels, the accumulator and the assembler; the LMC-style instruction set used in NIS papers (INP, OUT, LDA, STA, ADD, SUB, BRA, BRZ, BRP, HLT, DAT) grouped by purpose; sequence, selection and iteration in assembly; analysing programs — variables, condition and loop lines, purpose and output; trace tables for assembly code and for pseudocode, and using them to find the output, verify an algorithm and locate logic errors.
---
# Assembly language
@lo 11.5.1.3@paper

:::definition Assembly language
A **low-level** programming language in which each instruction is written as a short **mnemonic** (e.g. `LDA`, `ADD`) and corresponds to **one machine-code instruction**. It is translated into machine code by an **assembler**.
:::

:::compare Machine code, assembly and high-level code
| | Machine code | Assembly language | High-level language |
|---|---|---|---|
| Example | `0101 1001` | `ADD NUM` | `total = total + num` |
| Written as | Binary (or hex) | **Mnemonics** + addresses / labels | English-like statements |
| Translator | None — run directly by the CPU | **Assembler** | Compiler / interpreter |
| Instructions per statement | 1 | **1 : 1** with machine code | One statement → many machine instructions |
| Depends on the processor? | Yes | **Yes** — each CPU has its own instruction set | No — portable |
:::

:::cards
### Opcode and operand
- Every instruction has an **opcode** — **what** to do (`LDA`, `ADD`, `BRZ`).
- Most have an **operand** — **what to do it with**: a memory **address** or a **label** (`ADD 09`, `ADD NUM`).
- `INP`, `OUT` and `HLT` have no operand.
### The accumulator (ACC)
- A special **register** in the CPU that holds the value currently being worked on.
- Every input goes **into** ACC; every calculation uses ACC; `OUT` outputs ACC.
- Values must be **stored** (`STA`) in memory to keep them, because the next `LDA` or `INP` overwrites ACC.
### Labels
- A **name** for a memory address, written at the start of a line: `LOOP  LDA COUNT`, `COUNT  DAT 6`.
- A label on an **instruction** is a place to **jump** to; a label on a `DAT` line works like a **variable**.
- The assembler replaces each label with its address.
### Why use assembly?
- Direct control of the **hardware**, registers and memory.
- Code is **fast** and **small** — used in device drivers, embedded systems, boot loaders.
- But it is **hard to write, read and debug**, and not **portable** to another processor.
:::

# The instruction set
@lo 11.5.1.3@paper

:::compare Assembly language mnemonics (as given in NIS papers)
| Mnemonic | Description | Effect |
|---|---|---|
| `INP` | Retrieve user **input** and store it in the accumulator | ACC ← input |
| `OUT` | **Output** the value stored in the accumulator | output ACC |
| `LDA xx` | **Load** the accumulator with the contents of the memory address given | ACC ← [xx] |
| `STA xx` | **Store** the value in the accumulator in the memory address given | [xx] ← ACC |
| `ADD xx` | **Add** the contents of the memory address to the accumulator | ACC ← ACC + [xx] |
| `SUB xx` | **Subtract** the contents of the memory address from the accumulator | ACC ← ACC − [xx] |
| `BRA xx` | **Branch always** — jump to the address given | go to xx |
| `BRZ xx` | Jump to the address given **if the accumulator is zero** | if ACC = 0 go to xx |
| `BRP xx` | Jump to the address given **if the accumulator is zero or positive** | if ACC ≥ 0 go to xx |
| `HLT` | **Stop** the code | stop |
| `DAT n` | Not an instruction: reserves a memory address (with a label) and optionally stores the value n in it | [address] ← n |
:::

:::compare Instructions grouped by purpose
| Group | Mnemonics |
|---|---|
| Input / output | `INP`, `OUT` |
| **Data transfer** (move data between memory and ACC) | `LDA`, `STA` |
| Arithmetic | `ADD`, `SUB` |
| Unconditional branch (jump) | `BRA` |
| **Conditional branch** (a condition / selection) | `BRZ`, `BRP` |
| Control | `HLT` |
| Data declaration | `DAT` |
:::

:::ascii Memory of a short program — instructions and data share the same memory
   Address   Label    Instruction        What happens
   ───────   ─────    ───────────        ──────────────────────────────
     00               INP                ACC ← first number
     01               STA  NUM1          [05] ← ACC
     02               INP                ACC ← second number
     03               ADD  NUM1          ACC ← ACC + [05]
     04               OUT                output the sum
     05      NUM1     DAT                variable NUM1 (address 05)
:::

:::warning Important details
- `BRP` jumps when ACC is **zero or positive** — not only positive.
- `BRZ` and `BRP` only **test** ACC; they do not change it.
- `STA` does **not** change ACC — the value is copied into memory and stays in ACC.
- `DAT` lines must come **after** `HLT`, otherwise the CPU would try to run the data as instructions.
- Comparing two numbers is done by **subtracting** them and testing the result with `BRZ` / `BRP`.
:::

# Sequence, selection and iteration
@lo 11.5.1.3@paper

:::cards
### Sequence
Instructions run **one after another** from address 00. Example: input two numbers, add them, output the sum.
### Selection (condition)
A **conditional branch** `BRZ` / `BRP` chooses between two paths. The line with `BRZ` or `BRP` is **where the condition is**.
### Iteration (loop)
A **`BRA` back to an earlier label** makes the code repeat. The loop is the block from the **label jumped to** down to the **`BRA`**. A `BRZ` / `BRP` inside the loop decides when to **leave** it.
:::

```text | Selection — output the larger of two numbers
00         INP
01         STA A
02         INP
03         STA B
04         SUB A           ; ACC = B - A
05         BRP SHOWB       ; condition: if B - A >= 0, B is larger (or equal)
06         LDA A
07         OUT             ; output A
08         HLT
09  SHOWB  LDA B
10         OUT             ; output B
11         HLT
12  A      DAT
13  B      DAT
```

```text | Iteration — multiply NUM by TIMES using repeated addition
00         INP
01         STA NUM
02         INP
03         STA TIMES
04  LOOP   LDA TIMES       ; loop starts here
05         BRZ DONE        ; condition: stop when TIMES = 0
06         SUB ONE
07         STA TIMES       ; TIMES ← TIMES - 1
08         LDA TOTAL
09         ADD NUM
10         STA TOTAL       ; TOTAL ← TOTAL + NUM
11         BRA LOOP        ; loop ends here — jump back
12  DONE   LDA TOTAL
13         OUT
14         HLT
15  NUM    DAT 0
16  TIMES  DAT 0
17  TOTAL  DAT 0
18  ONE    DAT 1
```

:::compare Analysing the multiplication program
| Question | Answer |
|---|---|
| Variables (labels with `DAT`) | `NUM`, `TIMES`, `TOTAL`, `ONE` (a constant) |
| Line of the condition | 05 — `BRZ DONE` |
| Lines of the loop | 04 to 11 (`LOOP` … `BRA LOOP`) |
| Type of algorithm | Loop / iteration (with a condition) |
| Purpose | Multiplies two input numbers by **repeated addition** |
| Output for inputs 4 and 2 | **8** |
:::

:::example Equivalent high-level code
```pseudocode
INPUT NUM
INPUT TIMES
TOTAL ← 0
WHILE TIMES <> 0
    TIMES ← TIMES - 1
    TOTAL ← TOTAL + NUM
ENDWHILE
OUTPUT TOTAL
```
Writing the assembly as pseudocode first is a good way to understand **what a program does**.
:::

# Analysing an assembly program
@lo 11.5.1.3@paper

:::steps How to analyse an assembly program
- List the **variables**: the labels on `DAT` lines and their starting values.
- Find **input** (`INP`) and **output** (`OUT`) lines.
- Find the **condition**: the line(s) with `BRZ` / `BRP`, and say what is tested.
- Find the **loop**: a `BRA` that jumps **back** — the loop runs from the target label to that `BRA`.
- **Trace** the program with sample data to find the output.
- Describe the **purpose** in one sentence: what the program calculates for any input.
:::

:::example Past-paper style program — count down
```text
1   INP
2   STA A
3   OPERATION LDA A
4   OUT
5   SUB ONE
6   STA A
7   BRZ ENDTHIS
8   BRA OPERATION
9   ENDTHIS LDA A
10  SUB ONE
11  OUT
12  HLT
13  A DAT
14  ONE DAT 1
```
- **Variables:** A and ONE.
- **Condition:** line 7 (`BRZ ENDTHIS`). **Loop:** lines 3 to 8.
- **Input 3:** outputs **3, 2, 1**; then A = 0, so `BRZ` jumps to line 9, where 0 − 1 is output → **−1**. Output: **3 2 1 −1**.
:::

:::example Past-paper style program — remainder
```text
Address  Instruction
00       LDA 08
01       SUB 09
02       BRP 06
03       LDA 08
04       OUT
05       HLT
06       STA 08
07       BRA 00
08       DAT 11
09       DAT 4
```
- The program keeps **subtracting** [09] from [08] while the result is **zero or positive**, storing the new value in 08.
- When the result becomes **negative**, it outputs the value left in 08.
- **Purpose:** divides the number in 08 by the number in 09 and outputs the **remainder** (11 MOD 4 = **3**).
- **Loop lines:** 00, 01, 02, 06, 07. **Condition:** address 02 (`BRP 06`).
- With `BRZ` instead of `BRP`, 11 − 4 = 7 is not zero, so the loop would run only **once**.
:::

# Trace tables
@lo 11.5.1.4@paper

:::definition Trace table
A table used to **dry-run** an algorithm by hand: it records the **value of each variable** (and, for assembly, the **accumulator** and **memory addresses**), each **condition** and each **output**, step by step.
:::

:::cards
### What a trace table is used for
- To find the **output** of an algorithm for given data.
- To **verify** that an algorithm is **correct** — compare the traced results with the expected results.
- To **locate logic errors** — find the step where a value first becomes wrong.
- To understand **what an unfamiliar algorithm does** (its purpose).
### Columns for assembly code
- **Instruction address** of the line being executed.
- **Accumulator** — written when ACC changes.
- One column for **each memory address / variable** — written when it changes (`STA`).
- **Condition** — TRUE / FALSE for `BRZ` / `BRP`.
- **Output** — only when `OUT` runs.
:::

:::compare Trace of the remainder program ([08] = 11, [09] = 4)
| Instruction address | Accumulator | Memory address 08 | Memory address 09 | Condition | Output |
|---|---|---|---|---|---|
| | | 11 | 4 | | |
| 00 | 11 | | | | |
| 01 | 7 | | | | |
| 02 | | | | TRUE | |
| 06 | | 7 | | | |
| 07 | | | | | |
| 00 | 7 | | | | |
| 01 | 3 | | | | |
| 02 | | | | TRUE | |
| 06 | | 3 | | | |
| 07 | | | | | |
| 00 | 3 | | | | |
| 01 | −1 | | | | |
| 02 | | | | FALSE | |
| 03 | 3 | | | | |
| 04 | | | | | 3 |
| 05 | | | | | |
:::

:::compare Trace of the multiplication program (inputs 4 and 2)
| Address | ACC | NUM (15) | TIMES (16) | TOTAL (17) | Condition | Output |
|---|---|---|---|---|---|---|
| | | 0 | 0 | 0 | | |
| 00 | 4 | | | | | |
| 01 | | 4 | | | | |
| 02 | 2 | | | | | |
| 03 | | | 2 | | | |
| 04 | 2 | | | | | |
| 05 | | | | | FALSE | |
| 06 | 1 | | | | | |
| 07 | | | 1 | | | |
| 08 | 0 | | | | | |
| 09 | 4 | | | | | |
| 10 | | | | 4 | | |
| 11 | | | | | | |
| 04 | 1 | | | | | |
| 05 | | | | | FALSE | |
| 06 | 0 | | | | | |
| 07 | | | 0 | | | |
| 08 | 4 | | | | | |
| 09 | 8 | | | | | |
| 10 | | | | 8 | | |
| 11 | | | | | | |
| 04 | 0 | | | | | |
| 05 | | | | | TRUE | |
| 12 | 8 | | | | | |
| 13 | | | | | | 8 |
| 14 | | | | | | |
:::

:::steps How to complete a trace table
- Write the **initial values** of memory / variables in the first row (from the `DAT` lines or the first assignments).
- Execute **one instruction at a time**; write the **address** (or line) in a new row.
- Write a value **only in the column that changes** — leave the others empty.
- For `BRZ` / `BRP` write **TRUE / FALSE**, then continue at the jump address if TRUE, otherwise at the next line.
- After `BRA`, the next row starts at the **target address**.
- Write in the **Output** column only for `OUT` (or `OUTPUT` / `PRINT`).
- Stop at `HLT` (or the end of the algorithm).
:::

# Trace tables for pseudocode
@lo 11.5.1.4@paper

```pseudocode | Trace this algorithm
total ← 0
FOR x ← 0 TO 3
    IF x MOD 2 <> 0 THEN
        total ← total + x * 2
    ELSE
        total ← total + 1
    ENDIF
NEXT x
OUTPUT total
```

:::compare Trace table
| x | x MOD 2 <> 0 | total | Output |
|---|---|---|---|
| | | 0 | |
| 0 | FALSE | 1 | |
| 1 | TRUE | 3 | |
| 2 | FALSE | 4 | |
| 3 | TRUE | 10 | |
| | | | 10 |
:::

:::example Using a trace table to find a logic error
The algorithm should output the **largest** of the numbers −5, −2, −9.
```pseudocode
largest ← 0
FOR i ← 0 TO 2
    IF Nums[i] > largest THEN
        largest ← Nums[i]
    ENDIF
NEXT i
OUTPUT largest
```
| i | Nums[i] | Nums[i] > largest | largest | Output |
|---|---|---|---|---|
| | | | 0 | |
| 0 | −5 | FALSE | | |
| 1 | −2 | FALSE | | |
| 2 | −9 | FALSE | | |
| | | | | 0 |

**Expected** output −2, **actual** output 0 → a **logic error**. The trace shows that `largest` never changes because it starts at 0. **Correction:** `largest ← Nums[0]`.
:::

:::compare Verifying an algorithm with test data
| Test | Input | Expected result | Result from the trace | Correct? |
|---|---|---|---|---|
| Normal | 11 and 4 (remainder program) | 3 | 3 | ✓ |
| Exact division | 12 and 4 | 0 | 0 | ✓ |
| First number smaller | 3 and 4 | 3 | 3 | ✓ |
:::

:::tip Exam technique
- Trace **exactly** what the code does, not what you think it should do.
- `FOR x FROM 0 TO 3` runs **4** times; `MOD` gives the **remainder** (7 MOD 2 = 1).
- Use the **number of empty rows** in the given table as a hint — but "you may not need all the lines".
- In assembly traces the marks are usually **one per column**: be careful with every column, especially **Output** (no extra entries).
:::

# Exam practice and summary
@lo 11.5.1.3@paper 11.5.1.4@paper

:::example Exam-style answers
**Q: Give one example of an assembly language instruction used for transferring data. [1]**
`LDA` (or `STA`) (1).

**Q: Identify the type of algorithm used in the code. [1]**
A **loop** / repetition (1).

**Q: State the purpose of the condition in this code. [1]**
To **end the program** (leave the loop) **when the accumulator is zero** (1).

**Q: Identify the line numbers where a condition and a loop are implemented. [2]**
Condition: the line with `BRZ` / `BRP` (1); loop: from the label jumped to down to the `BRA` line (1).

**Q: Determine the number of iterations if BRZ is used instead of BRP. [1]**
Trace again with the new rule: `BRZ` jumps only when ACC is **exactly 0**.
:::

:::warning Common mistakes
- Treating `BRP` as "positive only" — it is TRUE for **0** as well.
- Forgetting that `SUB` / `ADD` change **ACC**, not memory, until `STA` is executed.
- Writing values in every column of every row — write only what **changes**.
- Putting a value in the Output column for a line that is not `OUT`.
- Continuing after `HLT`, or not following a `BRA` jump.
- Naming a jump label (e.g. `LOOP`) as a variable — variables are the **`DAT`** labels.
:::

:::steps Check yourself
- Explain opcode, operand, accumulator, label and mnemonic.
- Group the instructions into input/output, data transfer, arithmetic and branching.
- Write an assembly program that inputs two numbers and outputs their difference.
- Find the condition line and the loop lines of the multiplication program.
- Trace the remainder program with 14 and 5. What is the output?
- Use a trace table to show why `largest ← 0` gives a wrong answer for negative numbers.
:::
