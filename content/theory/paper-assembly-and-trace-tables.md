---
summary: Reading simple assembly language programs (Little Man Computer instruction set) and using trace tables to follow and check algorithms.
---
# Simple assembly language programs
@lo 11.5.1.3@paper

Assembly language uses **mnemonics** for machine instructions. NIS papers use an instruction set like the **Little Man Computer (LMC)**: one **accumulator (ACC)**, memory locations 00–99, and these instructions:

:::compare Instruction set
| Mnemonic | Meaning |
|---|---|
| `INP` | Input a value into ACC |
| `OUT` | Output the value in ACC |
| `LDA xx` | Load ACC with the contents of address xx |
| `STA xx` | Store ACC into address xx |
| `ADD xx` | ACC ← ACC + contents of xx |
| `SUB xx` | ACC ← ACC − contents of xx |
| `BRA xx` | Branch always — jump to xx |
| `BRZ xx` | Branch to xx **if ACC = 0** |
| `BRP xx` | Branch to xx **if ACC ≥ 0** (zero or positive) |
| `HLT` | Stop |
| `DAT n` | A memory location holding data n (not an instruction) |
:::

```text | Program: count down from an input number
00  INP          ; read N
01  STA 09       ; store N
02  LDA 09       ; loop: load N
03  BRZ 08       ; if N = 0 finish
04  OUT          ; output N
05  SUB 10       ; N - 1
06  STA 09       ; save the new N
07  BRA 02       ; repeat
08  HLT
09  DAT 0        ; N
10  DAT 1        ; the constant 1
```

:::compare Parts of the program
| Feature | Lines |
|---|---|
| Input / output | 00 / 04 |
| Condition (selection) | 03 (`BRZ`) |
| Loop | 02–07 (the jump back at 07) |
| Data | 09, 10 |
:::

# Trace tables
@lo 11.5.1.4@paper

:::definition Trace table
A table that records the **values of variables (and registers/memory) after each step** of an algorithm, used to **dry-run** it: to find its output, check that it is correct and locate logic errors.
:::

:::example Trace of the count-down program with input 3
| Line | ACC | [09] | Output |
|---|---|---|---|
| 00 | 3 | 0 | |
| 01 | 3 | 3 | |
| 02 | 3 | 3 | |
| 04 | 3 | 3 | 3 |
| 05 | 2 | 3 | |
| 06 | 2 | 2 | |
| 02 | 2 | 2 | |
| 04 | 2 | 2 | 2 |
| 05 | 1 | 2 | |
| 06 | 1 | 1 | |
| 02 | 1 | 1 | |
| 04 | 1 | 1 | 1 |
| 05 | 0 | 1 | |
| 06 | 0 | 0 | |
| 02 | 0 | 0 | |
| 03 → 08 | 0 | 0 | (BRZ jumps, HLT) |
:::

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

:::steps How to complete a trace table
- Make a column for **every variable**, condition and output (and the line number if asked).
- Write the **initial values** in the first row.
- Execute **one statement at a time**; write a value only in the column that changes.
- For loops, check the condition each time; for branches, follow the jump.
- The **last rows** show the final values and the output.
:::

:::tip
Common traps: `BRP` jumps when ACC is **zero too**; `MOD` gives the **remainder** (7 MOD 2 = 1); a `FOR` loop's variable takes the **last value** in the range. Write values in a new row each time they change.
:::
