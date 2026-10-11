---
summary: Logic gates (NOT, AND, OR, NAND, NOR, XOR) and their truth tables, writing Boolean expressions in different notations, the laws of Boolean algebra, reducing expressions to normal form and simplifying them step by step, building logic circuits from expressions, and analysing circuits with truth tables.
---
# Logic gates and truth tables
@lo 11.3.3.3@paper

Computers are built from **logic gates** — electronic circuits that take one or more **binary inputs** (0 = false / off, 1 = true / on) and produce a single **binary output**.

:::definition Truth table
A table that lists **every possible combination of inputs** and the **output** for each one. With **n** inputs there are **2ⁿ rows**.
:::

:::compare The six gates
| Gate | Expression | Output is 1 when … |
|---|---|---|
| **NOT** | X = ¬A (also Ā, A′) | the input is **0** (it inverts) |
| **AND** | X = A · B (also AB, A ∧ B) | **both** inputs are 1 |
| **OR** | X = A + B (also A ∨ B) | **at least one** input is 1 |
| **NAND** | X = ¬(A · B) | **not both** inputs are 1 |
| **NOR** | X = ¬(A + B) | **both** inputs are **0** |
| **XOR** | X = A ⊕ B | the inputs are **different** |
:::

:::compare Truth tables of the two-input gates
| A | B | AND | OR | NAND | NOR | XOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |
:::

:::html Standard gate symbols (inputs on the left, output on the right) | 240
<div class="g"><figure><svg viewBox="0 0 90 60" width="120" height="80"><line x1="0" y1="30" x2="16" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M16,10 L54,30 L16,50 Z" stroke="#1f2937" stroke-width="2" fill="none"/><circle cx="59" cy="30" r="5" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="64" y1="30" x2="88" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/></svg><figcaption>NOT</figcaption></figure><figure><svg viewBox="0 0 90 60" width="120" height="80"><line x1="0" y1="20" x2="14" y2="20" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="0" y1="40" x2="14" y2="40" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M14,8 H40 A22,22 0 0 1 40,52 H14 Z" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="62" y1="30" x2="88" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/></svg><figcaption>AND</figcaption></figure><figure><svg viewBox="0 0 90 60" width="120" height="80"><line x1="0" y1="20" x2="14" y2="20" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="0" y1="40" x2="14" y2="40" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M10,8 Q26,30 10,52 Q48,52 66,30 Q48,8 10,8 Z" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="66" y1="30" x2="88" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/></svg><figcaption>OR</figcaption></figure><figure><svg viewBox="0 0 90 60" width="120" height="80"><line x1="0" y1="20" x2="14" y2="20" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="0" y1="40" x2="14" y2="40" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M14,8 H40 A22,22 0 0 1 40,52 H14 Z" stroke="#1f2937" stroke-width="2" fill="none"/><circle cx="67" cy="30" r="5" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="72" y1="30" x2="88" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/></svg><figcaption>NAND</figcaption></figure><figure><svg viewBox="0 0 90 60" width="120" height="80"><line x1="0" y1="20" x2="14" y2="20" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="0" y1="40" x2="14" y2="40" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M10,8 Q26,30 10,52 Q48,52 66,30 Q48,8 10,8 Z" stroke="#1f2937" stroke-width="2" fill="none"/><circle cx="71" cy="30" r="5" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="76" y1="30" x2="88" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/></svg><figcaption>NOR</figcaption></figure><figure><svg viewBox="0 0 90 60" width="120" height="80"><line x1="0" y1="20" x2="18" y2="20" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="0" y1="40" x2="18" y2="40" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M6,8 Q22,30 6,52" stroke="#1f2937" stroke-width="2" fill="none"/><path d="M16,8 Q32,30 16,52 Q54,52 72,30 Q54,8 16,8 Z" stroke="#1f2937" stroke-width="2" fill="none"/><line x1="72" y1="30" x2="88" y2="30" stroke="#1f2937" stroke-width="2" fill="none"/></svg><figcaption>XOR</figcaption></figure></div>
<p class="n">A small circle on the output means NOT: NAND = AND + NOT, NOR = OR + NOT. XOR has an extra curved line at the back.</p>
---css---
body { font-family: Arial, sans-serif; margin: 0; padding: 6px; background: #fff; }
.g { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 4px; }
figure { margin: 0; text-align: center; }
figcaption { font-weight: bold; font-size: 14px; }
.n { font-size: 13px; color: #374151; margin: 6px 4px; }
:::

:::cards
### Identifying a gate from its truth table
- Output 1 **only** on the last row (1,1) → **AND**.
- Output 0 **only** on the first row (0,0) → **OR**.
- Output 0 **only** on the last row → **NAND**.
- Output 1 **only** on the first row → **NOR**.
- Output 1 when inputs **differ** → **XOR**.
### Universal gates
- **NAND** and **NOR** are *universal*: any circuit can be built from NAND gates only (or NOR only).
- NOT A = A NAND A; A AND B = (A NAND B) NAND (A NAND B).
:::

:::widget truth_table Build the truth table of any expression
:::

:::tip Listing the rows
List the inputs in **binary counting order** (000, 001, 010, 011 …) so no row is missed or repeated. Three inputs → 8 rows; four inputs → 16 rows.
:::

# Boolean expressions
@lo 11.3.3.3@paper 12.3.3.4

:::compare Notations you may meet
| Operation | Words | Algebra | Other forms |
|---|---|---|---|
| NOT | NOT A | ¬A | Ā, A′, !A |
| AND | A AND B | A · B | AB, A ∧ B, A * B |
| OR | A OR B | A + B | A ∨ B |
| XOR | A XOR B | A ⊕ B | |
:::

:::callout info Order of operations
**Brackets first**, then **NOT**, then **AND**, then **OR** — just like brackets, powers, × and + in arithmetic. So A + B · ¬C means A + (B · (¬C)).
:::

:::example Truth table for X = A · ¬B + ¬A · B
Add a column for each part of the expression:
| A | B | ¬A | ¬B | A·¬B | ¬A·B | X |
|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | 0 | 1 | **1** |
| 1 | 0 | 0 | 1 | 1 | 0 | **1** |
| 1 | 1 | 0 | 0 | 0 | 0 | **0** |

The output is the same as **A XOR B**.
:::

# Laws of Boolean algebra
@lo 11.3.3.1@paper

:::compare The laws
| Law | AND form | OR form |
|---|---|---|
| **Identity** | A · 1 = A | A + 0 = A |
| **Null (annulment)** | A · 0 = 0 | A + 1 = 1 |
| **Idempotent** | A · A = A | A + A = A |
| **Complement (inverse)** | A · ¬A = 0 | A + ¬A = 1 |
| **Double negation (involution)** | ¬¬A = A | |
| **Commutative** | A · B = B · A | A + B = B + A |
| **Associative** | (A · B) · C = A · (B · C) | (A + B) + C = A + (B + C) |
| **Distributive** | A · (B + C) = A·B + A·C | A + B·C = (A + B)·(A + C) |
| **Absorption** | A · (A + B) = A | A + A·B = A |
| **De Morgan** | ¬(A · B) = ¬A + ¬B | ¬(A + B) = ¬A · ¬B |
:::

:::callout info De Morgan in words
"**Break the bar, change the sign**": a NOT over an AND becomes an OR of the NOTs, and a NOT over an OR becomes an AND of the NOTs. It works for any number of terms: ¬(A + B + C) = ¬A · ¬B · ¬C.
:::

:::example Proving a law with a truth table — absorption A + A·B = A
| A | B | A·B | A + A·B |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 |

The last column is the **same as A**, so the law holds.
:::

# Reducing to normal form
@lo 12.3.3.1

:::definition Normal forms
- **Sum of products (SOP, disjunctive normal form)** — an **OR of AND terms**, e.g. A·¬B + ¬A·B·C.
- **Product of sums (POS, conjunctive normal form)** — an **AND of OR terms**, e.g. (A + B)·(¬A + C).
In both forms NOT is applied **only to single variables**.
:::

:::steps Reducing a formula to sum of products
- Replace XOR, NAND and NOR with AND, OR, NOT: A ⊕ B = A·¬B + ¬A·B; A NAND B = ¬(A·B).
- Use **De Morgan** (repeatedly) to move every NOT down onto single variables.
- Remove double NOTs (**double negation**).
- Use the **distributive law** to multiply out the brackets.
- Remove repeated terms (idempotent), impossible terms A·¬A (complement → 0) and absorbed terms.
:::

:::example From a truth table to SOP
X is 1 on rows **011, 101, 110, 111**. Write one AND term (a *minterm*) for each row, with ¬ for each 0:
X = ¬A·B·C + A·¬B·C + A·B·¬C + A·B·C

This simplifies to **X = A·B + B·C + A·C** (output 1 when at least two inputs are 1 — a "majority" circuit).
:::

:::example Reduce Q₁ = ¬((A + B) · (C + ¬D)) to normal form
| Step | Expression | Law |
|---|---|---|
| 1 | ¬(A + B) + ¬(C + ¬D) | De Morgan (NOT over AND) |
| 2 | ¬A·¬B + ¬C·¬¬D | De Morgan (NOT over OR), twice |
| 3 | **¬A·¬B + ¬C·D** | Double negation |
:::

# Simplifying expressions
@lo 12.3.3.3

:::example Simplify Q = ¬(A + B) + A · (¬A + ¬B)
| Step | Expression | Law |
|---|---|---|
| 1 | ¬A·¬B + A·(¬A + ¬B) | De Morgan |
| 2 | ¬A·¬B + A·¬A + A·¬B | Distributive |
| 3 | ¬A·¬B + 0 + A·¬B | Complement (A·¬A = 0) |
| 4 | ¬A·¬B + A·¬B | Identity (+ 0) |
| 5 | ¬B·(¬A + A) | Distributive (factor out ¬B) |
| 6 | ¬B · 1 | Complement (¬A + A = 1) |
| 7 | **¬B** | Identity |
:::

:::example Simplify X = A·B + A·¬B + ¬A·B
| Step | Expression | Law |
|---|---|---|
| 1 | A·(B + ¬B) + ¬A·B | Distributive |
| 2 | A·1 + ¬A·B | Complement |
| 3 | A + ¬A·B | Identity |
| 4 | (A + ¬A)·(A + B) | Distributive (OR form) |
| 5 | 1·(A + B) | Complement |
| 6 | **A + B** | Identity |
:::

:::example Simplify Q = (¬A + B) · ¬(A + ¬(A + B))
| Step | Expression | Law |
|---|---|---|
| 1 | (¬A + B) · ¬A · ¬¬(A + B) | De Morgan |
| 2 | (¬A + B) · ¬A · (A + B) | Double negation |
| 3 | (¬A + B) · (¬A·A + ¬A·B) | Distributive |
| 4 | (¬A + B) · (0 + ¬A·B) | Complement |
| 5 | (¬A + B) · ¬A·B | Identity |
| 6 | ¬A·¬A·B + ¬A·B·B | Distributive |
| 7 | ¬A·B + ¬A·B | Idempotent |
| 8 | **¬A · B** | Idempotent |
:::

:::tip Check your answer
Make a quick **truth table** of the original and the simplified expression — every row must match. Use the widget above to check.
:::

:::warning Show your work
"Show your working" means **one law per step, named**. A correct final answer without steps usually gets only part of the marks.
:::

# Building logic circuits
@lo 12.3.3.2

:::steps From expression to circuit
- Find the **innermost** brackets and NOTs first.
- Draw one gate for each operation, working **outwards**.
- Connect the output of each gate to the input of the next.
- The **last** operation in the expression is the gate that produces the **output**.
- Label **every input** (A, B, C …) and the **output** (X or Q).
:::

:::example Circuit for X = ¬((A + ¬B) · C)
- **NOT** gate on B → ¬B.
- **OR** gate with inputs A and ¬B → A + ¬B.
- **AND** gate with inputs (A + ¬B) and C.
- **NOT** on the result — or replace the last AND + NOT with one **NAND** gate.
:::

:::ascii Circuit for X = ¬((A + ¬B) · C)
A ─────────────────┐
                   OR ─────┐
B ──── NOT ────────┘       NAND ──── X
C ─────────────────────────┘
:::

:::example Circuit for Q = ¬(A + B) + A · (¬A + ¬B)
| Gate | Inputs | Output |
|---|---|---|
| 1 NOT | A | ¬A |
| 2 NOT | B | ¬B |
| 3 NOR | A, B | ¬(A + B) |
| 4 OR | ¬A, ¬B | ¬A + ¬B |
| 5 AND | A, output of 4 | A · (¬A + ¬B) |
| 6 OR | outputs of 3 and 5 | **Q** |

After simplifying (see above), the same output needs **just one NOT gate** on B — simplification saves gates, cost, space and power.
:::

:::tip Marks for circuits
Each correct gate usually earns a mark — use the standard symbols, give each gate the **right number of inputs**, and label inputs and output.
:::

# Analysing logic circuits
@lo 12.3.3.4

:::steps Analysing a circuit
- Label the output of every gate with a letter (P, Q, C, D …).
- Write the expression for each intermediate output.
- Combine them into the final expression for the output.
- Complete a truth table with a column for each input, each intermediate output and the output.
:::

:::example Circuit: P = A NAND B, R = B OR C, X = P AND R
Expression: **X = ¬(A · B) · (B + C)**
| A | B | C | P = ¬(A·B) | R = B + C | X = P · R |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 1 | 0 | 1 | 0 |
:::

:::example Circuit: C = A AND NOT B, D = A XOR B, X = C OR D
| A | B | C = A · ¬B | D = A ⊕ B | X = C + D |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 |

X = A ⊕ B — gate C adds nothing new, so it could be removed.
:::

:::example A real problem: a car alarm
The alarm **X** sounds if the alarm is **set (S)** and either a **door is opened (D)** or **motion is detected (M)**: **X = S · (D + M)**. Built with one OR gate (D, M) feeding an AND gate with S.
:::

# Exam practice and summary
@lo 11.3.3.3@paper 11.3.3.1@paper 12.3.3.1 12.3.3.2 12.3.3.3 12.3.3.4

:::example Exam-style answers
**Q: Identify the gate: output 1, 1, 1, 0 for inputs 00, 01, 10, 11. [1]**
**NAND** (1).

**Q: Simplify Q = ¬(A · ¬B) · (A + B). Show your working. [4]**
= (¬A + B)·(A + B) — De Morgan, double negation (1); = ¬A·A + ¬A·B + A·B + B·B — distributive (1); = 0 + B·(¬A + A) + B — complement, distributive, idempotent (1); = B·1 + B = **B** — complement, identity, idempotent (1).

**Q: Name one law used in simplifying ¬((A + B)·(C + ¬D)). [1]**
**De Morgan's law** (or double negation) (1).

**Q: Write the Boolean expression for a circuit where B is inverted, ¬B and C enter an AND gate, the result and A enter an OR gate. [2]**
**X = A + ¬B · C** (1 for ¬B·C, 1 for + A).
:::

:::warning Common mistakes
- Forgetting a **row** in the truth table — use 2ⁿ rows in counting order.
- Applying De Morgan without **changing the sign**: ¬(A·B) is ¬A **+** ¬B, not ¬A·¬B.
- Mixing up **NAND** (0 only when both 1) and **NOR** (1 only when both 0).
- Drawing a NOT with **two** inputs, or an AND / OR with one.
- Using AND before NOT in the order of operations.
:::

:::steps Check yourself
- Draw the truth tables of AND, OR, NAND, NOR and XOR.
- State both forms of De Morgan's law.
- Prove the absorption law A·(A + B) = A with a truth table.
- Write the SOP for a truth table with outputs 0, 1, 1, 0.
- Simplify A·B + A·¬B.
- Draw the circuit for X = ¬A · (B + C) and complete its truth table.
:::
