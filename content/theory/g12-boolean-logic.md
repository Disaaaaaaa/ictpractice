---
summary: Logic gates and truth tables, the laws of Boolean algebra, simplifying expressions, building and analysing logic circuits.
---
# Logic gates and truth tables
@lo 11.3.3.3@paper

:::compare The six gates
| Gate | Expression | Output is 1 when … |
|---|---|---|
| NOT | X = ¬A (Ā) | A is 0 |
| AND | X = A · B | **both** inputs are 1 |
| OR | X = A + B | **at least one** input is 1 |
| NAND | X = ¬(A · B) | NOT both inputs are 1 |
| NOR | X = ¬(A + B) | **both** inputs are 0 |
| XOR | X = A ⊕ B | the inputs are **different** |
:::

:::compare Truth tables
| A | B | AND | OR | NAND | NOR | XOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |
:::

:::widget truth_table Build the truth table of any expression
:::

:::tip
With *n* inputs a truth table has **2ⁿ rows**. List the inputs in binary counting order (000, 001, 010 …) so no row is missed.
:::

# Laws of Boolean algebra
@lo 11.3.3.1@paper

:::compare
| Law | AND form | OR form |
|---|---|---|
| Identity | A · 1 = A | A + 0 = A |
| Null (annulment) | A · 0 = 0 | A + 1 = 1 |
| Idempotent | A · A = A | A + A = A |
| Complement (inverse) | A · ¬A = 0 | A + ¬A = 1 |
| Double negation | ¬¬A = A | |
| Commutative | A · B = B · A | A + B = B + A |
| Associative | (A · B) · C = A · (B · C) | (A + B) + C = A + (B + C) |
| Distributive | A · (B + C) = A·B + A·C | A + B·C = (A + B)·(A + C) |
| Absorption | A · (A + B) = A | A + A·B = A |
| **De Morgan** | ¬(A · B) = ¬A + ¬B | ¬(A + B) = ¬A · ¬B |
:::

:::callout info De Morgan in words
"Break the bar, change the sign": a NOT over an AND becomes OR of the NOTs, and a NOT over an OR becomes AND of the NOTs.
:::

# Reducing and simplifying expressions
@lo 12.3.3.1, 12.3.3.3

:::example Simplify Q = ¬(A + B) + A · (¬A + ¬B)
| Step | Expression | Law |
|---|---|---|
| 1 | ¬A·¬B + A·(¬A + ¬B) | De Morgan |
| 2 | ¬A·¬B + A·¬A + A·¬B | Distributive |
| 3 | ¬A·¬B + 0 + A·¬B | Complement (A·¬A = 0) |
| 4 | ¬A·¬B + A·¬B | Identity (+0) |
| 5 | ¬B·(¬A + A) | Distributive (factor out ¬B) |
| 6 | ¬B · 1 | Complement (¬A + A = 1) |
| 7 | **¬B** | Identity |
:::

:::example Simplify X = A·B + A·¬B + ¬A·B
- A·B + A·¬B = A·(B + ¬B) = A·1 = **A** (distributive, complement, identity)
- X = A + ¬A·B = (A + ¬A)·(A + B) = 1·(A + B) = **A + B** (distributive, complement)
:::

:::steps Reducing to a normal form (sum of products)
- Remove NAND/NOR/XOR by writing them with AND, OR, NOT (A ⊕ B = A·¬B + ¬A·B).
- Use **De Morgan** to move NOTs onto single variables.
- Use the **distributive law** to multiply out brackets → a sum (OR) of products (AND).
- Remove repeated or impossible terms (idempotent, complement, absorption).
:::

:::warning
"Show your work" means **one law per step, named**. A correct final answer without steps usually gets only part of the marks.
:::

# Building logic circuits
@lo 12.3.3.2

:::steps From expression to circuit: X = ¬((A + ¬B) · C)
- Innermost first: **NOT** gate on B → ¬B.
- **OR** gate with inputs A and ¬B → A + ¬B.
- **AND** gate with inputs (A + ¬B) and C.
- **NOT** on the result — or replace the last AND + NOT with one **NAND** gate.
:::

:::ascii Circuit for X = ¬((A + ¬B) · C)
A ─────────────┐
               OR ───┐
B ── NOT ──────┘     NAND ─── X
C ───────────────────┘
:::

:::tip
Each gate in your drawing usually earns a mark — use the standard gate symbols, label the inputs and the output, and make sure every gate has the right number of inputs.
:::

# Analysing logic circuits
@lo 12.3.3.4

:::steps Analysing a circuit
- Label the output of every gate with an intermediate letter (C, D …).
- Write the expression for each intermediate output.
- Combine them into the final expression for X.
- Fill in a truth table with columns for the inputs, each intermediate output and X.
:::

:::example Circuit: D = A XOR B, C = A AND NOT B, X = D OR C
| A | B | D = A ⊕ B | C = A · ¬B | X = D + C |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 |
X = A ⊕ B (C adds nothing new).
:::
