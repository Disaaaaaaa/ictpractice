---
summary: Designing processes with flowcharts — standard symbols, sequence, selection and loops, and turning a flowchart into pseudocode.
---
# Flowcharts of processes
@lo 11.2.2.3

:::definition Flowchart
A diagram that shows the **sequence of steps and decisions** in a process or algorithm using standard symbols joined by arrows.
:::

:::compare Flowchart symbols
| Symbol | Name | Use |
|---|---|---|
| Rounded rectangle (oval) | Terminator | START and STOP / END |
| Parallelogram | Input / Output | `INPUT price`, `OUTPUT total` |
| Rectangle | Process | Calculations and assignments: `total ← total + price` |
| Diamond | Decision | A Yes/No question: `price < 1000?` — two labelled exits |
| Rectangle with double sides | Subroutine | Call a predefined procedure |
| Arrow | Flow line | Order of the steps |
:::

## Selection (IF)

:::mermaid Selling price: +30% if the price is under 1000, otherwise +15%
flowchart TD
  A([START]) --> B[/INPUT price/]
  B --> C{price < 1000?}
  C -- Yes --> D[selling ← price × 1.3]
  C -- No --> E[selling ← price × 1.15]
  D --> F[/OUTPUT selling/]
  E --> F
  F --> G([STOP])
:::

## Loops (iteration)

:::mermaid Total profit of all products sold in a day (condition-controlled loop)
flowchart TD
  A([START]) --> B[profit ← 0]
  B --> C[/INPUT code/]
  C --> D{code = 'END'?}
  D -- Yes --> H[/OUTPUT profit/]
  H --> I([STOP])
  D -- No --> E[/INPUT price, selling/]
  E --> F[profit ← profit + selling − price]
  F --> C
:::

```pseudocode | The same loop as pseudocode
profit ← 0
INPUT code
WHILE code <> "END" DO
    INPUT price, selling
    profit ← profit + (selling - price)
    INPUT code
ENDWHILE
OUTPUT profit
```

:::compare Loop types
| Loop | Condition checked | Pseudocode |
|---|---|---|
| Count-controlled | Runs a fixed number of times | `FOR i ← 1 TO 10 … NEXT i` |
| Pre-condition | **Before** each pass — may run 0 times | `WHILE … DO … ENDWHILE` |
| Post-condition | **After** each pass — runs at least once | `REPEAT … UNTIL …` |
:::

:::tip
Mark schemes for flowcharts usually award separate marks for: correct **input**, correct **process/calculation**, correct **decision** with Yes/No labels, a working **loop**, correct **output**, and START/STOP. Label both exits of every decision.
:::

:::warning
A decision diamond has **exactly one** entry and **two** exits (Yes/No). Never leave a branch that goes nowhere — every path must reach STOP.
:::
