---
summary: Logic gates (NOT, AND, OR, NAND, NOR, XOR) and their truth tables, writing Boolean expressions from problems, the laws of Boolean algebra and step-by-step simplification, reducing formulas to normal form (SOP and POS), building logic circuits from expressions, problems and truth tables, and analysing circuits with truth tables.
---
# Propositions, truth values and logic gates
@lo 11.3.3.3@paper

Every decision a computer makes — whether a password is correct, whether a sensor value is too high, whether two numbers are equal — is reduced in the end to a question with only **two possible answers**: *yes* or *no*, *true* or *false*. The branch of mathematics that works with such two-valued answers is called **Boolean logic** (or Boolean algebra), after the English mathematician **George Boole**, who described it in 1854. Almost a century later Claude Shannon showed that Boole's algebra describes exactly how circuits of switches behave. That discovery is the reason every processor, memory chip and controller today is designed with Boolean logic.

## Propositions and truth values

Boolean logic starts with **propositions**. A proposition is a statement that is either true or false — never both, and never "a little bit true". "The door is open", "The temperature is above 30 °C" and "The card is valid" are propositions. "Close the door!" or "How warm is it?" are not, because they cannot be true or false.

:::definition Proposition
A **statement that is either true or false**. In Boolean logic a proposition is represented by a **variable** (A, B, C …) whose value is **1 (true)** or **0 (false)**.
:::

:::definition Truth value
The value of a proposition or expression: **true (1)** or **false (0)**. Boolean logic has **only these two values**.
:::

We give each proposition a short name, a **Boolean variable**. In a school access system we might write *C* = "the student's card is valid" and *H* = "it is school hours". The variable then takes the **truth value 1** when the statement is true and **0** when it is false. More complicated statements are built from simple ones with the words **AND**, **OR** and **NOT**: "the card is valid **and** it is school hours" is true only when both parts are true.

Why only two values? Inside a computer each bit is stored and moved as an electrical signal. A transistor is either **conducting or not**, a wire is either at a **high voltage (about 1–5 V) or a low voltage (about 0 V)**. Two states are easy to tell apart even when there is electrical noise, so two-valued logic is cheap and reliable to build. Logic 1 is usually the high voltage and logic 0 the low voltage, but the logic does not depend on the exact voltages — only on the two states.

:::compare Ways of writing the two truth values
| Logic | Number | Electronics | Switch | Lamp |
|---|---|---|---|---|
| **True** | 1 | High voltage | Closed (on) | Lit |
| **False** | 0 | Low voltage | Open (off) | Not lit |
:::

## Logic gates

A **logic gate** is the physical building block that carries out one Boolean operation. It is a tiny electronic circuit, made from a few transistors, with one or more **inputs** and **one output**. Each input and the output carry a single bit. The output depends **only on the current inputs** (in the gates studied here), so a gate can be completely described by listing its output for every possible input combination — its **truth table**.

:::definition Logic gate
An **electronic component that performs a Boolean operation** on one or more binary inputs and produces **a single binary output**.
:::

:::definition Truth table
A table that lists **every possible combination of inputs** of a gate, expression or circuit together with the **output** for each combination. With **n** inputs there are **2ⁿ rows**.
:::

A modern processor contains billions of gates. Each is very simple, but by connecting the output of one gate to the inputs of others we can build **logic circuits** that add numbers, compare values, select memory locations and decode instructions. The same idea appears in everyday control systems: a washing machine will not start unless the door is closed **and** a programme is selected; a car's interior light turns on if the driver's door **or** the passenger's door is open.

## The switch model of AND and OR

The easiest way to understand AND and OR is to imagine a lamp, a battery and two switches. If the switches are connected **in series** (one after the other), current flows only when switch A **and** switch B are closed — this is the AND operation. If the switches are connected **in parallel** (side by side), current flows when switch A **or** switch B (or both) is closed — this is the OR operation. A NOT operation is like a switch that is normally closed and opens when you press it: pressing (1) turns the lamp off (0).

:::svg AND and OR as switches: in series both switches must be closed; in parallel one closed switch is enough
<svg class="bl" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two circuits, each with a battery and a lamp X. In the left circuit switches A and B are in series on the top wire, so the lamp lights only if A and B are both closed: this is AND. In the right circuit switches A and B are on two parallel branches, so the lamp lights if A or B or both are closed: this is OR.">
  <style>
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .sw{fill:none;stroke:var(--primary);stroke-width:3}
    svg.bl .lp{fill:var(--warning);fill-opacity:.25;stroke:var(--foreground);stroke-width:2}
    svg.bl .d{fill:var(--foreground)}
    svg.bl .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="bx" x="6" y="6" width="368" height="218" rx="10"/>
  <rect class="bx" x="386" y="6" width="368" height="218" rx="10"/>
  <path class="w" d="M40,100 L40,60 L110,60"/>
  <line class="sw" x1="110" y1="60" x2="146" y2="42"/>
  <circle class="d" cx="110" cy="60" r="3"/><circle class="d" cx="150" cy="60" r="3"/>
  <path class="w" d="M150,60 L200,60"/>
  <line class="sw" x1="200" y1="60" x2="236" y2="42"/>
  <circle class="d" cx="200" cy="60" r="3"/><circle class="d" cx="240" cy="60" r="3"/>
  <path class="w" d="M240,60 L330,60 L330,99"/>
  <circle class="lp" cx="330" cy="115" r="16"/>
  <path class="w" d="M319,104 L341,126 M341,104 L319,126"/>
  <path class="w" d="M330,131 L330,170 L40,170 L40,110"/>
  <line class="w" x1="26" y1="100" x2="54" y2="100"/><line class="w" x1="33" y1="110" x2="47" y2="110"/>
  <text class="t" x="128" y="32" text-anchor="middle">Switch A</text>
  <text class="t" x="218" y="32" text-anchor="middle">Switch B</text>
  <text class="t" x="306" y="120" text-anchor="end">Lamp X</text>
  <text class="s" x="62" y="108">battery</text>
  <text class="h" x="190" y="196" text-anchor="middle">AND = switches in series</text>
  <text class="s" x="190" y="214" text-anchor="middle">X = 1 only if A = 1 and B = 1</text>
  <path class="w" d="M430,100 L430,60 L530,60"/>
  <line class="sw" x1="530" y1="60" x2="566" y2="42"/>
  <circle class="d" cx="530" cy="60" r="3"/><circle class="d" cx="570" cy="60" r="3"/>
  <path class="w" d="M570,60 L720,60 L720,99"/>
  <path class="w" d="M490,60 L490,120 L530,120"/>
  <line class="sw" x1="530" y1="120" x2="566" y2="102"/>
  <circle class="d" cx="530" cy="120" r="3"/><circle class="d" cx="570" cy="120" r="3"/>
  <path class="w" d="M570,120 L640,120 L640,60"/>
  <circle class="d" cx="490" cy="60" r="3"/><circle class="d" cx="640" cy="60" r="3"/>
  <circle class="lp" cx="720" cy="115" r="16"/>
  <path class="w" d="M709,104 L731,126 M731,104 L709,126"/>
  <path class="w" d="M720,131 L720,170 L430,170 L430,110"/>
  <line class="w" x1="416" y1="100" x2="444" y2="100"/><line class="w" x1="423" y1="110" x2="437" y2="110"/>
  <text class="t" x="548" y="32" text-anchor="middle">Switch A</text>
  <text class="t" x="600" y="98" text-anchor="start">Switch B</text>
  <text class="t" x="696" y="150" text-anchor="end">Lamp X</text>
  <text class="h" x="570" y="196" text-anchor="middle">OR = switches in parallel</text>
  <text class="s" x="570" y="214" text-anchor="middle">X = 1 if A = 1 or B = 1 (or both)</text>
</svg>
:::

The switch model also explains **why the truth table has to show every combination**. With two switches there are exactly four situations — both open, only B closed, only A closed, both closed — and the lamp's behaviour must be known in all four. A truth table is simply a complete, organised list of these situations.

:::compare Logic gates, Boolean expressions and logic circuits
| Term | What it is | Example |
|---|---|---|
| **Logic gate** | One physical component doing one operation | A single AND gate |
| **Boolean expression** | The operation(s) written in symbols | X = A · B + ¬C |
| **Logic circuit** | Several gates connected together | The gates that make X = A · B + ¬C |
| **Truth table** | The behaviour of any of the above for all inputs | 8 rows for inputs A, B, C |
:::

# The six logic gates
@lo 11.3.3.3@paper

The curriculum requires six gates: **NOT, AND, OR, NAND, NOR and XOR**. For each one you must know its **meaning in words**, its **symbol**, its **Boolean notation** and its **truth table**, and be able to recognise it from any of the four. The standard ("distinctive-shape") symbols are used in NIS and Cambridge papers: inputs are drawn on the left and the output on the right.

:::svg The six logic gates: symbol, expression and when the output is 1
<svg class="bl" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Six panels. NOT: a triangle with a small circle at its tip, one input A, output X equals not A. AND: a D-shaped gate with inputs A and B, output 1 only when both inputs are 1. OR: a curved shield-shaped gate, output 1 when at least one input is 1. NAND: the AND shape with a small circle on the output, output 0 only when both inputs are 1. NOR: the OR shape with a circle on the output, output 1 only when both inputs are 0. XOR: the OR shape with an extra curved line behind it, output 1 when the inputs are different.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="bx" x="6" y="10" width="241" height="150" rx="10"/>
  <rect class="bx" x="259" y="10" width="241" height="150" rx="10"/>
  <rect class="bx" x="512" y="10" width="241" height="150" rx="10"/>
  <rect class="bx" x="6" y="170" width="241" height="150" rx="10"/>
  <rect class="bx" x="259" y="170" width="241" height="150" rx="10"/>
  <rect class="bx" x="512" y="170" width="241" height="150" rx="10"/>
  <line class="w" x1="40" y1="55" x2="95" y2="55"/>
  <path class="g" d="M95,38 L129,55 L95,72 Z"/><circle class="g" cx="134" cy="55" r="5"/>
  <line class="w" x1="139" y1="55" x2="200" y2="55"/>
  <text class="t" x="26" y="60">A</text><text class="t" x="208" y="60">X</text>
  <text class="h" x="126" y="115" text-anchor="middle">NOT</text>
  <text class="t" x="126" y="135" text-anchor="middle">X = ¬A (also Ā)</text>
  <text class="s" x="126" y="152" text-anchor="middle">output is the opposite of the input</text>
  <line class="w" x1="293" y1="42" x2="343" y2="42"/><line class="w" x1="293" y1="68" x2="343" y2="68"/>
  <path class="g" d="M343,30 H371 A25,25 0 0 1 371,80 H343 Z"/>
  <line class="w" x1="396" y1="55" x2="453" y2="55"/>
  <text class="t" x="279" y="47">A</text><text class="t" x="279" y="73">B</text><text class="t" x="461" y="60">X</text>
  <text class="h" x="379" y="115" text-anchor="middle">AND</text>
  <text class="t" x="379" y="135" text-anchor="middle">X = A · B</text>
  <text class="s" x="379" y="152" text-anchor="middle">1 only when both inputs are 1</text>
  <line class="w" x1="546" y1="42" x2="602" y2="42"/><line class="w" x1="546" y1="68" x2="602" y2="68"/>
  <path class="g" d="M596,30 Q614,55 596,80 Q634,80 652,55 Q634,30 596,30 Z"/>
  <line class="w" x1="652" y1="55" x2="706" y2="55"/>
  <text class="t" x="532" y="47">A</text><text class="t" x="532" y="73">B</text><text class="t" x="714" y="60">X</text>
  <text class="h" x="632" y="115" text-anchor="middle">OR</text>
  <text class="t" x="632" y="135" text-anchor="middle">X = A + B</text>
  <text class="s" x="632" y="152" text-anchor="middle">1 when at least one input is 1</text>
  <line class="w" x1="40" y1="202" x2="90" y2="202"/><line class="w" x1="40" y1="228" x2="90" y2="228"/>
  <path class="g" d="M90,190 H118 A25,25 0 0 1 118,240 H90 Z"/><circle class="g" cx="148" cy="215" r="5"/>
  <line class="w" x1="153" y1="215" x2="200" y2="215"/>
  <text class="t" x="26" y="207">A</text><text class="t" x="26" y="233">B</text><text class="t" x="208" y="220">X</text>
  <text class="h" x="126" y="275" text-anchor="middle">NAND</text>
  <text class="t" x="126" y="295" text-anchor="middle">X = ¬(A · B)</text>
  <text class="s" x="126" y="312" text-anchor="middle">0 only when both inputs are 1</text>
  <line class="w" x1="293" y1="202" x2="349" y2="202"/><line class="w" x1="293" y1="228" x2="349" y2="228"/>
  <path class="g" d="M343,190 Q361,215 343,240 Q381,240 399,215 Q381,190 343,190 Z"/><circle class="g" cx="404" cy="215" r="5"/>
  <line class="w" x1="409" y1="215" x2="453" y2="215"/>
  <text class="t" x="279" y="207">A</text><text class="t" x="279" y="233">B</text><text class="t" x="461" y="220">X</text>
  <text class="h" x="379" y="275" text-anchor="middle">NOR</text>
  <text class="t" x="379" y="295" text-anchor="middle">X = ¬(A + B)</text>
  <text class="s" x="379" y="312" text-anchor="middle">1 only when both inputs are 0</text>
  <line class="w" x1="546" y1="202" x2="595" y2="202"/><line class="w" x1="546" y1="228" x2="595" y2="228"/>
  <path class="w" style="stroke:var(--primary)" d="M588,190 Q606,215 588,240"/>
  <path class="g" d="M596,190 Q614,215 596,240 Q634,240 652,215 Q634,190 596,190 Z"/>
  <line class="w" x1="652" y1="215" x2="706" y2="215"/>
  <text class="t" x="532" y="207">A</text><text class="t" x="532" y="233">B</text><text class="t" x="714" y="220">X</text>
  <text class="h" x="632" y="275" text-anchor="middle">XOR</text>
  <text class="t" x="632" y="295" text-anchor="middle">X = A ⊕ B</text>
  <text class="s" x="632" y="312" text-anchor="middle">1 when the inputs are different</text>
</svg>
:::

## NOT (inverter)

The NOT gate has **one input** and **inverts** it: an input of 1 gives 0, an input of 0 gives 1. It is written **¬A**, **Ā** (a bar over the letter), **A′** or **NOT A**; on this site we mostly use ¬A. Its symbol is a triangle with a small circle (the "bubble") at the tip — wherever you see that bubble on any gate, it means "NOT". Real-life analogy: a fridge light that is **on when the door is NOT closed**; a "Do not disturb" sign that blocks room cleaning.

| A | ¬A |
|---|---|
| 0 | 1 |
| 1 | 0 |

## AND

The AND gate outputs 1 **only when all of its inputs are 1**. It is written **A · B**, **AB** or **A ∧ B**. Its symbol has a straight back and a round front (a "D" shape). Analogy: a bank's safe deposit box opens only with the customer's key **and** the bank's key; a microwave runs only if the door is closed **and** the start button is pressed. AND behaves like multiplication of 0s and 1s: the product is 1 only when every factor is 1.

## OR

The OR gate outputs 1 **when at least one input is 1**; it outputs 0 only when all inputs are 0. It is written **A + B** or **A ∨ B**. Its symbol has a curved back and a pointed front. Analogy: the interior light of a car comes on if the driver's door **or** any passenger door is open. Note that this is the **inclusive** OR of logic: "A or B" includes the case where both are true. In everyday speech "tea or coffee?" usually means "one, but not both" — that meaning is a different gate, XOR.

## NAND (NOT AND)

NAND is an AND gate followed by a NOT. Its output is the **opposite of AND**: it is 0 **only when all inputs are 1**, and 1 in every other case. It is written **¬(A · B)**, the bar covering the whole product, or **A NAND B**. The symbol is the AND shape with a bubble on the output. Analogy: a two-hand safety press in a factory stays **safe** (output 1 = "blade locked") unless both of the operator's hands are on the buttons.

## NOR (NOT OR)

NOR is an OR gate followed by a NOT. Its output is 1 **only when all inputs are 0**. It is written **¬(A + B)** or **A NOR B**; the symbol is the OR shape with a bubble on the output. Analogy: a "room is safe to lock" signal that is 1 only when **neither** the window sensor **nor** the motion sensor is active.

## XOR (exclusive OR)

XOR outputs 1 **when the inputs are different** — exactly one of two inputs is 1 — and 0 when they are the same. It is written **A ⊕ B** or **A XOR B**. Its symbol is the OR shape with an extra curved line behind the back. Analogy: a staircase light controlled by two switches, one at the bottom and one at the top of the stairs; flipping either switch changes the state of the light. XOR is also the gate that produces the **sum bit** when two binary digits are added (1 + 1 = 10₂, sum bit 0), as you will see with the half adder in lesson 3.

:::compare Truth tables of the two-input gates
| A | B | AND A·B | OR A+B | NAND ¬(A·B) | NOR ¬(A+B) | XOR A⊕B |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |
:::

Look at the columns in pairs. **NAND is AND with every output inverted**, and **NOR is OR with every output inverted**. XOR agrees with OR on the first three rows and differs only on the last row, where both inputs are 1. These relationships are a quick way to rebuild the whole table in an exam if you only remember AND and OR.

:::compare Notations you may meet
| Operation | Words | Algebra (this site) | Other forms |
|---|---|---|---|
| NOT | NOT A | ¬A | Ā, A′, !A |
| AND | A AND B | A · B | AB, A ∧ B, A & B |
| OR | A OR B | A + B | A ∨ B, A \| B |
| NAND | A NAND B | ¬(A · B) | bar over AB, A ↑ B |
| NOR | A NOR B | ¬(A + B) | bar over A + B, A ↓ B |
| XOR | A XOR B | A ⊕ B | A ⊻ B |
:::

In printed exam papers the NOT is very often written as a **bar** over a letter or over a whole group. The bar works like brackets: a bar over A · B means NOT applied to the product, which is NAND:

$$\overline{A \cdot B} \neq \overline{A} \cdot \overline{B}$$ | A long bar over the whole product is NAND; two short bars over the separate letters is something else (NOR, by De Morgan's law)

:::cards
### Identifying a gate from its truth table
- Output 1 **only** on the last row (1, 1) → **AND**.
- Output 0 **only** on the first row (0, 0) → **OR**.
- Output 0 **only** on the last row → **NAND**.
- Output 1 **only** on the first row → **NOR**.
- Output 1 when the inputs **differ** (0, 1, 1, 0) → **XOR**.
- One input, output the opposite → **NOT**.
### Gates with more than two inputs
AND, OR, NAND and NOR can have **three or more inputs**. A 3-input AND gives 1 only when A, B and C are all 1 (1 row out of 8); a 3-input OR gives 0 only when all are 0. A multi-input XOR gives 1 when an **odd number** of inputs are 1 — that is how a **parity bit** is calculated. NOT always has exactly **one** input.
:::

## NAND and NOR as universal gates

A remarkable fact is that **NAND on its own is enough to build every other gate**, and so is **NOR on its own**. Such a gate is called a **universal gate**. This matters to chip manufacturers: making a chip from millions of identical NAND gates is simpler and cheaper than mixing many different gate types, and a NAND gate needs only four transistors in CMOS technology. Flash memory (the "NAND flash" in USB drives and phones) is named after the NAND-like way its cells are connected.

:::definition Universal gate
A gate from which **any other logic gate, and therefore any logic circuit, can be built**. **NAND** and **NOR** are universal gates.
:::

The three key constructions with NAND are:

- **NOT from NAND** — join both inputs together: A NAND A = ¬(A · A) = ¬A.
- **AND from NAND** — a NAND followed by a NAND used as NOT: ¬(¬(A · B)) = A · B.
- **OR from NAND** — invert each input with a NAND, then NAND the results: ¬(¬A · ¬B) = A + B (this uses De Morgan's law, lesson 2).

:::svg Building NOT, AND and OR from NAND gates only
<svg class="bl" viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three rows of NAND circuits. Row one: input A goes to both inputs of one NAND gate, giving not A. Row two: A and B enter a NAND gate; its output goes to both inputs of a second NAND gate, giving A AND B. Row three: A enters both inputs of a NAND gate giving not A, B enters both inputs of another NAND gate giving not B, and these two outputs enter a third NAND gate whose output is A OR B.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .d{fill:var(--foreground)}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="20" y="20">NOT from one NAND</text>
  <text class="t" x="28" y="60">A</text>
  <path class="w" d="M45,55 L90,55 M90,42 L90,68 M90,42 L130,42 M90,68 L130,68"/>
  <circle class="d" cx="90" cy="55" r="3"/>
  <path class="g" d="M130,30 H158 A25,25 0 0 1 158,80 H130 Z"/><circle class="g" cx="188" cy="55" r="5"/>
  <line class="w" x1="193" y1="55" x2="250" y2="55"/>
  <text class="t" x="258" y="60">¬A</text>
  <text class="t" x="460" y="50">A NAND A = ¬(A · A) = ¬A</text>
  <text class="s" x="460" y="70">both inputs joined: the gate works as NOT</text>
  <text class="h" x="20" y="118">AND from two NANDs</text>
  <text class="t" x="28" y="147">A</text><text class="t" x="28" y="173">B</text>
  <path class="w" d="M45,142 L130,142 M45,168 L130,168"/>
  <path class="g" d="M130,130 H158 A25,25 0 0 1 158,180 H130 Z"/><circle class="g" cx="188" cy="155" r="5"/>
  <path class="w" d="M193,155 L225,155 M225,142 L225,168 M225,142 L260,142 M225,168 L260,168"/>
  <circle class="d" cx="225" cy="155" r="3"/>
  <text class="s" x="209" y="132" text-anchor="middle">¬(A·B)</text>
  <path class="g" d="M260,130 H288 A25,25 0 0 1 288,180 H260 Z"/><circle class="g" cx="318" cy="155" r="5"/>
  <line class="w" x1="323" y1="155" x2="370" y2="155"/>
  <text class="t" x="378" y="160">A · B</text>
  <text class="t" x="460" y="150">a NAND, then a NAND used as NOT</text>
  <text class="s" x="460" y="170">¬(¬(A · B)) = A · B</text>
  <text class="h" x="20" y="218">OR from three NANDs</text>
  <text class="t" x="28" y="255">A</text><text class="t" x="28" y="315">B</text>
  <path class="w" d="M45,250 L90,250 M90,237 L90,263 M90,237 L130,237 M90,263 L130,263"/>
  <circle class="d" cx="90" cy="250" r="3"/>
  <path class="g" d="M130,225 H158 A25,25 0 0 1 158,275 H130 Z"/><circle class="g" cx="188" cy="250" r="5"/>
  <path class="w" d="M45,310 L90,310 M90,297 L90,323 M90,297 L130,297 M90,323 L130,323"/>
  <circle class="d" cx="90" cy="310" r="3"/>
  <path class="g" d="M130,285 H158 A25,25 0 0 1 158,335 H130 Z"/><circle class="g" cx="188" cy="310" r="5"/>
  <path class="w" d="M193,250 L250,250 L250,267 L300,267 M193,310 L250,310 L250,293 L300,293"/>
  <text class="s" x="220" y="243" text-anchor="middle">¬A</text>
  <text class="s" x="220" y="303" text-anchor="middle">¬B</text>
  <path class="g" d="M300,255 H328 A25,25 0 0 1 328,305 H300 Z"/><circle class="g" cx="358" cy="280" r="5"/>
  <line class="w" x1="363" y1="280" x2="410" y2="280"/>
  <text class="t" x="418" y="285">A + B</text>
  <text class="t" x="490" y="275">¬A NAND ¬B = ¬(¬A · ¬B)</text>
  <text class="s" x="490" y="295">= A + B by De Morgan's law</text>
</svg>
:::

NOR is universal in the same way: **A NOR A = ¬A**; **(A NOR B) NOR (A NOR B) = A + B**; **(A NOR A) NOR (B NOR B) = ¬(¬A + ¬B) = A · B**. Notice the symmetry: with NAND, AND takes two gates and OR takes three; with NOR it is the other way round. The Apollo Guidance Computer that landed astronauts on the Moon in 1969 was built almost entirely from 3-input NOR gates.

:::compare NAND and NOR side by side
| Property | NAND | NOR |
|---|---|---|
| Made from | AND followed by NOT | OR followed by NOT |
| Output 0 when | all inputs are 1 | at least one input is 1 |
| Output 1 when | at least one input is 0 | all inputs are 0 |
| NOT from it | A NAND A | A NOR A |
| Gates needed for AND | 2 | 3 |
| Gates needed for OR | 3 | 2 |
| Universal? | Yes | Yes |
:::

:::warning Common mistakes with gates
- Mixing up **NAND** and **NOR**: NAND is 0 **only on (1, 1)**; NOR is 1 **only on (0, 0)**. Say it aloud: "NAND — not both; NOR — neither".
- Thinking OR means "one or the other but not both". In logic, **OR includes the case where both inputs are 1**; that "not both" meaning is **XOR**.
- Drawing a NOT gate with **two inputs**, or an AND / OR gate with **one** input.
- Forgetting the **bubble** on NAND / NOR symbols, or drawing XOR without its **second curved line** — the examiner will read it as AND or OR.
- Writing ¬A · ¬B for NAND. NAND is **¬(A · B)** — the NOT covers the whole product.
:::

# Truth tables and Boolean expressions
@lo 11.3.3.3@paper, 12.3.3.4

Gates are rarely used alone. Real problems need **Boolean expressions** that combine several operations, such as X = A + ¬B · C, and the circuits that compute them. This section explains how to build a complete truth table for any expression, the rules for reading an expression in the right order, and how to turn a problem described in words into an expression.

:::definition Boolean expression
A combination of **Boolean variables, the constants 0 and 1, and the operators NOT, AND, OR** (and XOR, NAND, NOR) that has a value of **0 or 1** for every combination of inputs, for example X = A · ¬B + C.
:::

## How many rows? The 2ⁿ rule and the row order

Each input can be 0 or 1, so every extra input **doubles** the number of combinations. One input gives 2 rows, two inputs 4 rows, three inputs 8 rows, four inputs 16 rows: **n inputs give 2ⁿ rows**. Writing the rows in a **fixed systematic order** guarantees that no combination is missed and none appears twice. The standard order is **binary counting**: the inputs, read as a binary number, go 000, 001, 010, 011, 100, 101, 110, 111 (that is 0 to 7).

A quick way to fill the input columns for three inputs: the **last** column (C) alternates every row (0, 1, 0, 1 …), the **middle** column (B) changes every **2** rows (0, 0, 1, 1 …) and the **first** column (A) changes every **4** rows (0, 0, 0, 0, 1, 1, 1, 1). For four inputs the first column changes every 8 rows. Using the same order every time also makes it easy for the examiner — and for you — to compare two tables row by row.

:::compare Number of inputs and rows
| Inputs | Rows (2ⁿ) | Pattern of the first column |
|---|---|---|
| 1 | 2 | 0, 1 |
| 2 | 4 | 0, 0, 1, 1 |
| 3 | 8 | four 0s, then four 1s |
| 4 | 16 | eight 0s, then eight 1s |
| 5 | 32 | sixteen 0s, then sixteen 1s |
:::

## Order of precedence

When an expression has no brackets, the operations are carried out in a fixed order, just as in arithmetic multiplication comes before addition:

1. **Brackets** (and anything under a NOT bar) first.
2. **NOT**.
3. **AND**.
4. **OR**.

So **A + B · ¬C** means **A + (B · (¬C))**: first invert C, then AND it with B, then OR the result with A. It does *not* mean (A + B) · ¬C — that is a different expression with a different truth table. XOR has no single agreed position in this order, so exam questions write brackets around XOR terms; you should do the same in your own answers, e.g. (A ⊕ B) · C.

:::callout info Analogy with ordinary algebra
AND behaves like **×** and OR like **+**: 1 · 0 = 0 and 1 · 1 = 1 just as with numbers, and A + B · C is read like 2 + 3 × 4. The difference is that in Boolean algebra **1 + 1 = 1** (true or true is still true), not 2.
:::

## Building a truth table for an expression

The safest method is to give **each part of the expression its own column**, working from the innermost operation outwards, and only then to compute the final output. These **intermediate columns** make mistakes visible, and in an exam they earn method marks even if the last column has an error.

:::steps How to build the truth table of an expression
- Count the different input variables n and draw 2ⁿ rows.
- Fill the input columns in binary counting order (000, 001, … 111).
- Add a column for every NOT applied to a variable, then for every AND, OR, XOR term, in the order of precedence.
- Work out each column row by row using the gate tables.
- Compute the final output column from the last operation.
- Check one or two rows by reading the expression in words.
:::

:::example Truth table for X = (A + B) · ¬C
The expression has three inputs, so there are 2³ = **8 rows**. The brackets are done first (A + B), then the NOT (¬C), then the AND of the two.

| A | B | C | A + B | ¬C | X = (A + B) · ¬C |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | **0** |
| 0 | 0 | 1 | 0 | 0 | **0** |
| 0 | 1 | 0 | 1 | 1 | **1** |
| 0 | 1 | 1 | 1 | 0 | **0** |
| 1 | 0 | 0 | 1 | 1 | **1** |
| 1 | 0 | 1 | 1 | 0 | **0** |
| 1 | 1 | 0 | 1 | 1 | **1** |
| 1 | 1 | 1 | 1 | 0 | **0** |

**Check in words:** X is 1 when "A or B is 1, and C is 0" — rows 010, 100 and 110. That is exactly what the table shows.
:::

:::example Showing that A · ¬B + ¬A · B behaves like XOR
| A | B | ¬A | ¬B | A · ¬B | ¬A · B | X |
|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | 0 | 1 | **1** |
| 1 | 0 | 0 | 1 | 1 | 0 | **1** |
| 1 | 1 | 0 | 0 | 0 | 0 | **0** |

The output column 0, 1, 1, 0 is the same as **A ⊕ B**. Two expressions are **equivalent** when their output columns agree on **every** row — this is how XOR can be built from AND, OR and NOT.
:::

:::widget truth_table Build the truth table of any expression
:::

## From a word problem to a Boolean expression

Paper 2 often describes a control system in words and asks you to write the Boolean expression, complete the truth table or draw the circuit. The method is always the same:

1. **Identify the inputs** and give each one a letter and a meaning for 1 (e.g. *T* = 1 means "temperature is too high"). Identify the **output** and when it is 1.
2. **Translate key words**: "and", "both", "as well as" → **AND**; "or", "either", "at least one" → **OR**; "not", "is off", "is closed" (when 1 means open) → **NOT**; "exactly one", "one but not the other", "different" → **XOR**; "neither … nor" → **NOR**.
3. **Group the conditions** with brackets so the expression follows the sentence: "the alarm is set **and** (a door is opened **or** motion is detected)" becomes S · (D + M).
4. **Check** the expression with the truth table: pick a row, read it as a situation, and see if the output makes sense.

:::compare Key words and the operation they mean
| Words in the problem | Operation | Example |
|---|---|---|
| "and", "both", "as well as", "while" | AND | the door is closed **and** the button is pressed: D · P |
| "or", "either", "at least one", "any of" | OR | smoke **or** heat is detected: S + H |
| "not", "is off", "is not pressed" | NOT | the seatbelt is **not** fastened: ¬B |
| "exactly one of", "only one", "different" | XOR | **exactly one** of switches B and C is on: B ⊕ C |
| "neither … nor", "none of" | NOR | **neither** window **nor** door is open: ¬(W + D) |
| "not both" | NAND | the two keys are **not both** turned: ¬(K · L) |
:::

:::svg Circuit for the greenhouse fan F = T · ¬W + H with the intermediate outputs labelled
<svg class="bl" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Input W passes through a NOT gate giving not W. Input T and not W enter an AND gate giving T AND not W. That result and input H enter an OR gate whose output is F, the fan.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .o{fill:none;stroke:var(--success);stroke-width:3}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="22" y="62">T</text><text class="h" x="22" y="100">W</text><text class="h" x="22" y="133">H</text>
  <line class="w" x1="45" y1="57" x2="250" y2="57"/>
  <line class="w" x1="45" y1="95" x2="120" y2="95"/>
  <path class="g" d="M120,78 L154,95 L120,112 Z"/><circle class="g" cx="159" cy="95" r="5"/>
  <path class="w" d="M164,95 L210,95 L210,83 L250,83"/>
  <text class="s" x="186" y="88" text-anchor="middle">¬W</text>
  <path class="g" d="M250,45 H278 A25,25 0 0 1 278,95 H250 Z"/>
  <path class="w" d="M303,70 L360,70 L360,102 L426,102"/>
  <text class="s" x="335" y="62" text-anchor="middle">T · ¬W</text>
  <line class="w" x1="45" y1="128" x2="426" y2="128"/>
  <path class="g" d="M420,90 Q438,115 420,140 Q458,140 476,115 Q458,90 420,90 Z"/>
  <line class="o" x1="476" y1="115" x2="560" y2="115"/>
  <text class="h" x="570" y="120">F</text>
  <text class="s" x="140" y="30" text-anchor="middle">T = too hot</text>
  <text class="s" x="80" y="160">W = window open, H = humidity too high</text>
  <text class="t" x="600" y="160" text-anchor="middle">F = T · ¬W + H</text>
  <text class="s" x="600" y="180" text-anchor="middle">last operation (OR) = output gate</text>
</svg>
:::

:::example Greenhouse in Almaty — fan control
A greenhouse near Almaty has three sensors: **T** = 1 when the temperature is too high, **W** = 1 when the roof window is open, **H** = 1 when the humidity is too high. The ventilation fan **F** must switch on when *it is too hot and the window is closed*, or *whenever the humidity is too high*.

**Step 1 — translate the parts.** "Too hot" = T. "Window closed" = NOT open = ¬W. "And" joins them: T · ¬W. "Or whenever humidity is high" adds + H.

**Step 2 — write the expression:** **F = T · ¬W + H** (by precedence the AND is done before the OR, so no brackets are needed).

**Step 3 — truth table** with intermediate columns:

| T | W | H | ¬W | T · ¬W | F |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 0 | **0** |
| 0 | 0 | 1 | 1 | 0 | **1** |
| 0 | 1 | 0 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | 0 | **1** |
| 1 | 0 | 0 | 1 | 1 | **1** |
| 1 | 0 | 1 | 1 | 1 | **1** |
| 1 | 1 | 0 | 0 | 0 | **0** |
| 1 | 1 | 1 | 0 | 0 | **1** |

**Step 4 — check a row.** Row 110: hot, window open, humidity normal → the open window already cools the greenhouse, so the fan stays off (F = 0). This agrees with the specification.
:::

:::example School turnstile — access control
At the entrance of a school in Astana a turnstile **O** opens when a **valid card** is shown (**C** = 1) and either it is **school hours** (**H** = 1) or the card belongs to a **member of staff** (**S** = 1).

**Expression.** The sentence has the shape "C and (H or S)", so the brackets are essential: **O = C · (H + S)**. Without them, C · H + S would let any staff card holder in even with an invalid card — a security fault.

| C | H | S | H + S | O = C · (H + S) |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | 1 | **0** |
| 0 | 1 | 0 | 1 | **0** |
| 0 | 1 | 1 | 1 | **0** |
| 1 | 0 | 0 | 0 | **0** |
| 1 | 0 | 1 | 1 | **1** |
| 1 | 1 | 0 | 1 | **1** |
| 1 | 1 | 1 | 1 | **1** |

The turnstile never opens without a valid card (the first four rows are all 0), and with a valid card it opens in school hours or for staff.
:::

## More scenarios to practise the translation

- **Car warning buzzer.** A buzzer **W** sounds if the engine is running (**E** = 1) and either the driver's seatbelt is **not** fastened (**B** = 0) or a door is open (**D** = 1): **W = E · (¬B + D)**.
- **Burglar alarm.** An alarm **X** sounds when the system is **set** (S) and a door is opened (D) or motion is detected (M): **X = S · (D + M)**.
- **Factory press.** A press **P** may operate only if both safety buttons are pressed (L and R) and the guard is **not** lifted (G): **P = L · R · ¬G**.
- **Water pump.** A pump runs if **exactly one** of two float switches is triggered: **P = A ⊕ B**, which can also be written A · ¬B + ¬A · B.

Each of these expressions can be turned straight into a circuit — one gate per operation, with the **last operation in the order of precedence** becoming the **output gate**. In the greenhouse example the last operation is the OR, so the OR gate produces F; in the turnstile the bracket is done first, so the AND gate produces O. Recognising the output gate is also the first step in the reverse task — analysing a given circuit and writing its expression — which is developed fully in lesson 3.

:::warning Common mistakes with truth tables and expressions
- Too few rows: 3 inputs need **8** rows, 4 inputs **16**. Always use binary counting order so no row is missing or repeated.
- Ignoring precedence: A + B · C is **A + (B · C)**, not (A + B) · C.
- Missing brackets in word problems: "C and (H or S)" must be written **C · (H + S)**.
- Applying NOT to the wrong part: ¬A · B inverts **only A**; ¬(A · B) inverts the **whole product**.
- Skipping intermediate columns — they make errors easy to spot and earn method marks.
:::

# Exam practice: logic gates and truth tables
@lo 11.3.3.3@paper, 12.3.3.4

:::example Exam-style questions with model answers
**Q: A two-input gate gives the outputs 0, 1, 1, 0 for the inputs 00, 01, 10, 11. Identify the gate and state its Boolean expression. [2]**
**XOR** (exclusive OR) (1); X = A ⊕ B, or A · ¬B + ¬A · B (1).

**Q: Explain the difference between an OR gate and an XOR gate. [2]**
OR gives 1 when **at least one** input is 1, including when both are 1 (1); XOR gives 1 only when the inputs are **different**, so it gives 0 when both inputs are 1 (1).

**Q: State how many rows the truth table of a circuit with 5 inputs has and describe how the input rows should be ordered. [2]**
2⁵ = **32 rows** (1); in binary counting order from 00000 to 11111, so every combination appears exactly once (1).

**Q: Complete the truth table for X = ¬(A + B) · C. [4]**

| A | B | C | A + B | ¬(A + B) | X |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 |

A + B column (1); ¬(A + B) column (1); X = 1 **only** on row 001 (1); all other rows 0 (1).

**Q: A bank safe in Almaty opens (O = 1) when the correct code is entered (K = 1) and either the manager's key is turned (M = 1) or the time lock is off (T = 0). Write a Boolean expression for O. [3]**
**O = K · (M + ¬T)** — K AND … (1); M + ¬T in brackets (1); NOT applied to T only (1).

**Q: Explain why NAND is called a universal gate and show how a NOT gate is made from a NAND gate. [3]**
Any other gate / any logic circuit can be built **using only NAND gates** (1). Connect the **same input A to both inputs** of the NAND gate (1); the output is ¬(A · A) = **¬A** (1).
:::

:::warning Common mistakes in exam answers
- Writing "NAND = output 0 when both inputs are 0" — that is wrong; NAND is 0 **only when both are 1**.
- Giving 2 × n rows instead of **2ⁿ** (5 inputs → 32 rows, not 10).
- In word problems, forgetting **brackets** or putting NOT on the wrong variable.
- Leaving out intermediate columns when the question gives them — each one is usually worth a mark.
:::

:::steps Check yourself
- Define proposition, logic gate, truth table and universal gate.
- Draw the symbols of NOT, AND, OR, NAND, NOR and XOR and write the expression for each.
- Write the full truth table of the five two-input gates from memory.
- Show how to make NOT, AND and OR from NAND gates only.
- State the order of precedence and use it to bracket A + ¬B · C fully.
- Build the truth table of X = A · ¬C + B with intermediate columns.
- Write the expression for "the fan is on when it is hot and the window is closed, or the humidity is high".
:::

# Laws of Boolean algebra
@lo 11.3.3.1@paper

In ordinary algebra we use rules such as a × 1 = a, a + b = b + a and a(b + c) = ab + ac to rewrite expressions without changing their value. Boolean algebra has its own set of rules, called the **laws of Boolean algebra** (or laws of logic). They allow us to replace one expression with another that is **always equal** to it — for every possible combination of inputs. The laws are the tools for the two big tasks of this unit: **simplifying** expressions (this lesson) and **reducing** them to normal form (lesson 3).

:::definition Law of Boolean algebra
A rule stating that **two Boolean expressions are equal for every combination of values** of their variables, so one may always be replaced by the other.
:::

:::definition Equivalent expressions
Two expressions are **equivalent** when they give the **same output on every row** of their truth table. Equivalent expressions can be built as different circuits that behave identically.
:::

An important idea is that each letter in a law can stand for **any expression**, not only a single variable. The complement law says A · ¬A = 0; it is equally true that (B + C) · ¬(B + C) = 0, because whatever value (B + C) has, it cannot be 1 and 0 at the same time. Recognising a law "hidden" inside a larger expression is the main skill of simplification.

## The laws one by one

### Identity law
**A · 1 = A** and **A + 0 = A**. ANDing with 1 or ORing with 0 leaves a value unchanged, just as multiplying by 1 or adding 0 does in arithmetic. Think of an AND gate with one input wired permanently to 1: the output simply follows the other input.

### Null (annulment, domination) law
**A · 0 = 0** and **A + 1 = 1**. If one input of an AND gate is fixed at 0, the output is always 0 whatever the other input is; if one input of an OR gate is fixed at 1, the output is always 1. In the switch model: a switch that is permanently open in series blocks the current; a permanently closed switch in parallel always lets it through.

### Idempotent law
**A · A = A** and **A + A = A**. Combining a value with itself changes nothing: "the door is open and the door is open" says no more than "the door is open". This law is used to **remove repeated terms** — and also, in reverse, to **duplicate** a term when you need to combine it with two others.

### Complement (inverse) law
**A · ¬A = 0** and **A + ¬A = 1**. A variable and its complement are never both 1, so their AND is always 0; one of them is always 1, so their OR is always 1. This law is the source of most simplifications: whenever a pair such as B + ¬B appears, it can be replaced by 1.

### Double negation (involution) law
**¬(¬A) = A**. Inverting twice returns the original value — two NOT gates in a row cancel out. In bar notation two bars on top of each other disappear.

### Commutative law
**A · B = B · A** and **A + B = B + A**. The order of the inputs does not matter; the two inputs of an AND or OR gate can be swapped. (Note that this is not true for implication A → B, which you will meet in lesson 3.)

### Associative law
**(A · B) · C = A · (B · C)** and **(A + B) + C = A + (B + C)**. When all operations are the same, the brackets can be moved or dropped. This is why a 3-input AND gate can be built from two 2-input AND gates in any grouping, and why we write simply A · B · C.

### Distributive law
**A · (B + C) = A · B + A · C** — AND distributes over OR, exactly like multiplying out brackets in arithmetic. Read from right to left it lets us **factor out** a common variable: A · B + A · C = A · (B + C).

**A + B · C = (A + B) · (A + C)** — OR distributes over AND. This second form has **no equivalent in ordinary arithmetic** (2 + 3 × 4 is not (2 + 3) × (2 + 4)), so students often forget it, but it is just as valid in Boolean algebra and is needed to turn expressions into product-of-sums form.

### Absorption law
**A + A · B = A** and **A · (A + B) = A**. In A + A · B, whenever A · B is 1, A is already 1, so the term A · B adds nothing — it is "absorbed" by A. In A · (A + B), whenever A is 1 the bracket is 1 too, so the result simply equals A. Example: "the lights are on if the main switch is on, or the main switch is on and it is dark" just means "the lights are on if the main switch is on".

### Redundancy law (the "absorption of a complement")
**A + ¬A · B = A + B** and **A · (¬A + B) = A · B**. In A + ¬A · B, the ¬A inside the second term is unnecessary: if A is 1 the whole expression is already 1, and if A is 0 then ¬A is 1 and the term reduces to B. It is proved by the distributive law: A + ¬A · B = (A + ¬A) · (A + B) = 1 · (A + B) = A + B.

### De Morgan's laws
**¬(A · B) = ¬A + ¬B** and **¬(A + B) = ¬A · ¬B**. These two laws describe how a NOT applied to a whole group can be pushed onto the individual variables; they are explained in detail in the next section.

:::compare The laws of Boolean algebra (AND form and OR form)
| Law | AND form | OR form |
|---|---|---|
| **Identity** | A · 1 = A | A + 0 = A |
| **Null (annulment)** | A · 0 = 0 | A + 1 = 1 |
| **Idempotent** | A · A = A | A + A = A |
| **Complement (inverse)** | A · ¬A = 0 | A + ¬A = 1 |
| **Double negation (involution)** | ¬(¬A) = A | (same law) |
| **Commutative** | A · B = B · A | A + B = B + A |
| **Associative** | (A · B) · C = A · (B · C) | (A + B) + C = A + (B + C) |
| **Distributive** | A · (B + C) = A · B + A · C | A + B · C = (A + B) · (A + C) |
| **Absorption** | A · (A + B) = A | A + A · B = A |
| **Redundancy** | A · (¬A + B) = A · B | A + ¬A · B = A + B |
| **De Morgan** | ¬(A · B) = ¬A + ¬B | ¬(A + B) = ¬A · ¬B |
:::

## The duality principle

Look at the two columns of the table: every OR-form law can be obtained from the AND-form law by **swapping · with +** and **swapping 0 with 1** (the variables and the NOTs stay as they are). For example, the dual of A · 1 = A is A + 0 = A, and the dual of A · (B + C) = A · B + A · C is A + B · C = (A + B) · (A + C). This is called the **duality principle**: if a law is true, its dual is also true. It halves the number of laws you need to remember and explains why the "strange" OR-form distributive law must be correct.

:::definition Duality principle
If a Boolean identity is true, then the identity obtained by **swapping AND with OR and 0 with 1** throughout (leaving variables and NOTs unchanged) is **also true**. The new identity is called the **dual**.
:::

:::callout info Why the laws are true
Every law can be **proved by a truth table**: because each variable has only two values, a law with two variables needs only 4 rows and with three variables 8 rows. If the columns for the left side and the right side agree on every row, the law holds for all inputs. This "proof by perfect induction" is impossible in ordinary algebra, where variables have infinitely many values.
:::

# De Morgan's laws and proving the laws
@lo 11.3.3.1@paper

## De Morgan's laws

De Morgan's laws, named after Augustus De Morgan, are the most used — and most often misused — laws in the exam. They connect AND, OR and NOT:

$$\overline{A \cdot B} = \overline{A} + \overline{B}$$ | De Morgan (1): NOT of an AND is the OR of the NOTs — NAND equals OR with inverted inputs

$$\overline{A + B} = \overline{A} \cdot \overline{B}$$ | De Morgan (2): NOT of an OR is the AND of the NOTs — NOR equals AND with inverted inputs

:::definition De Morgan's laws
**¬(A · B) = ¬A + ¬B** and **¬(A + B) = ¬A · ¬B**: the complement of a product is the sum of the complements, and the complement of a sum is the product of the complements.
:::

A useful phrase is "**break the bar, change the sign**": when you split a long NOT bar into separate bars over each variable, the operation under the bar must change from · to + or from + to ·. In words: "it is **not** true that **both** A and B are on" means the same as "A is off **or** B is off"; "it is **not** true that A **or** B is on" means "A is off **and** B is off" — in other words, *neither* is on.

The laws extend to any number of variables: **¬(A · B · C) = ¬A + ¬B + ¬C** and **¬(A + B + C) = ¬A · ¬B · ¬C**. They also apply to groups: ¬(A · B + C) = ¬(A · B) · ¬C = (¬A + ¬B) · ¬C. When the NOT covers a complicated expression, apply De Morgan to the **outermost** operation first, then repeat on the inner parts until every NOT is on a single variable.

:::svg De Morgan's laws as gate equivalences: a bubble moved from the output to the inputs changes AND into OR and OR into AND
<svg class="bl" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top row: a NAND gate with inputs A and B equals an OR gate with a NOT bubble on each input; both give not A or not B. Bottom row: a NOR gate with inputs A and B equals an AND gate with a NOT bubble on each input; both give not A and not B.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .g2{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .eq{font:700 28px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="bx" x="6" y="6" width="748" height="112" rx="10"/>
  <rect class="bx" x="6" y="128" width="748" height="112" rx="10"/>
  <text class="t" x="30" y="57">A</text><text class="t" x="30" y="83">B</text>
  <path class="w" d="M45,52 L100,52 M45,78 L100,78"/>
  <path class="g" d="M100,40 H128 A25,25 0 0 1 128,90 H100 Z"/><circle class="g" cx="158" cy="65" r="5"/>
  <line class="w" x1="163" y1="65" x2="220" y2="65"/>
  <text class="t" x="228" y="70">¬(A · B)</text>
  <text class="eq" x="345" y="75" text-anchor="middle">=</text>
  <text class="t" x="400" y="57">A</text><text class="t" x="400" y="83">B</text>
  <path class="w" d="M415,52 L440,52 M415,78 L440,78 M450,52 L457,52 M450,78 L457,78"/>
  <circle class="g2" cx="445" cy="52" r="5"/><circle class="g2" cx="445" cy="78" r="5"/>
  <path class="g2" d="M450,40 Q468,65 450,90 Q488,90 506,65 Q488,40 450,40 Z"/>
  <line class="w" x1="506" y1="65" x2="560" y2="65"/>
  <text class="t" x="568" y="70">¬A + ¬B</text>
  <text class="s" x="380" y="108" text-anchor="middle">NAND = OR with inverted inputs</text>
  <text class="t" x="30" y="167">A</text><text class="t" x="30" y="193">B</text>
  <path class="w" d="M45,162 L106,162 M45,188 L106,188"/>
  <path class="g" d="M100,150 Q118,175 100,200 Q138,200 156,175 Q138,150 100,150 Z"/><circle class="g" cx="161" cy="175" r="5"/>
  <line class="w" x1="166" y1="175" x2="220" y2="175"/>
  <text class="t" x="228" y="180">¬(A + B)</text>
  <text class="eq" x="345" y="185" text-anchor="middle">=</text>
  <text class="t" x="400" y="167">A</text><text class="t" x="400" y="193">B</text>
  <path class="w" d="M415,162 L440,162 M415,188 L440,188"/>
  <circle class="g2" cx="445" cy="162" r="5"/><circle class="g2" cx="445" cy="188" r="5"/>
  <path class="g2" d="M450,150 H478 A25,25 0 0 1 478,200 H450 Z"/>
  <line class="w" x1="503" y1="175" x2="560" y2="175"/>
  <text class="t" x="568" y="180">¬A · ¬B</text>
  <text class="s" x="380" y="228" text-anchor="middle">NOR = AND with inverted inputs</text>
</svg>
:::

De Morgan's laws are what make NAND and NOR **universal**: an OR can be made from a NAND by inverting its inputs, and an AND from a NOR in the same way. They are also used every day by programmers: the condition `not (age >= 18 and has_ticket)` can be rewritten as `age < 18 or not has_ticket`.

## Proving a law with a truth table

To prove a law with a truth table, list all input combinations, add columns for each part of the **left-hand side** and of the **right-hand side**, and show that the two final columns are **identical on every row**. State the conclusion in words — the examiner wants to see that you understand what the matching columns mean.

:::example Proving De Morgan's law ¬(A · B) = ¬A + ¬B
| A | B | A · B | ¬(A · B) | ¬A | ¬B | ¬A + ¬B |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | **1** | 1 | 1 | **1** |
| 0 | 1 | 0 | **1** | 1 | 0 | **1** |
| 1 | 0 | 0 | **1** | 0 | 1 | **1** |
| 1 | 1 | 1 | **0** | 0 | 0 | **0** |

**Conclusion:** the columns ¬(A · B) and ¬A + ¬B are the same (1, 1, 1, 0) for all four input combinations, so the two expressions are equivalent and the law is proved. Notice that ¬A · ¬B would give 1, 0, 0, 0 — a different column, which is why "keeping the sign" is wrong.
:::

:::example Proving the redundancy law A + ¬A · B = A + B
| A | B | ¬A | ¬A · B | A + ¬A · B | A + B |
|---|---|---|---|---|---|
| 0 | 0 | 1 | 0 | **0** | **0** |
| 0 | 1 | 1 | 1 | **1** | **1** |
| 1 | 0 | 0 | 0 | **1** | **1** |
| 1 | 1 | 0 | 0 | **1** | **1** |

Both final columns are 0, 1, 1, 1, so A + ¬A · B = A + B. **Algebraic proof** of the same law: A + ¬A · B = (A + ¬A) · (A + B) by the distributive law (OR form), = 1 · (A + B) by the complement law, = A + B by the identity law.
:::

A law can also be proved **algebraically** from other laws. For example, the OR-form distributive law follows from the AND-form one:

(A + B) · (A + C) = A · A + A · C + B · A + B · C (distributive) = A + A · C + A · B + B · C (idempotent, commutative) = A · (1 + C + B) + B · C (distributive, factor A) = A · 1 + B · C (null law: 1 + anything = 1) = **A + B · C** (identity).

## Distinguishing laws that look alike

Exam questions often show an identity and ask you to **name the law**, or give several laws and ask which one was used in a step. Many laws look similar at first glance. The quickest way to tell them apart is to ask three questions: *Is there a constant (0 or 1)? Is the same variable repeated? Does a variable appear with its complement?*

:::compare Laws that are easy to confuse
| Identity | Law | How to recognise it |
|---|---|---|
| A + 0 = A | Identity | constant that **does not change** A |
| A + 1 = 1 | Null (annulment) | constant that **forces** the result |
| A + A = A | Idempotent | the **same** variable twice |
| A + ¬A = 1 | Complement | a variable with **its NOT** → constant |
| A + A · B = A | Absorption | A **and a term containing A** → just A |
| A + ¬A · B = A + B | Redundancy | A and a term containing **¬A** → ¬A dropped |
| A · (B + C) = A · B + A · C | Distributive | brackets **multiplied out / factored** |
| ¬(A · B) = ¬A + ¬B | De Morgan | NOT over a group, **sign changes** |
| ¬(¬A) = A | Double negation | **two** NOTs cancel |
:::

When two laws look alike, compare their truth tables. Absorption A + A · B has output 0, 0, 1, 1 (equal to A), while redundancy A + ¬A · B has 0, 1, 1, 1 (equal to A + B). The identity law A · 1 = A keeps the column of A, while the null law A · 0 = 0 turns every row into 0. Seeing the columns side by side makes it obvious that these are genuinely different laws, not variations of the same one.

:::warning Common mistakes with the laws
- **De Morgan without changing the sign**: ¬(A · B) is ¬A **+** ¬B, never ¬A · ¬B.
- Breaking a bar **halfway**: ¬(A + B · C) becomes ¬A · ¬(B · C) = ¬A · (¬B + ¬C) — every level must be changed.
- Confusing **identity** (A · 1 = A) with **null** (A · 0 = 0), and **absorption** (A + A·B = A) with **redundancy** (A + ¬A·B = A + B).
- Using ordinary arithmetic: in Boolean algebra **A + A = A** (not 2A), **1 + 1 = 1**, and A · A = A (not A²).
- Forgetting the OR-form distributive law **A + B · C = (A + B) · (A + C)** because it does not exist in arithmetic.
:::

# Simplifying Boolean expressions
@lo 12.3.3.3

## Why simplification matters

A Boolean expression describes a circuit: every operator becomes a gate and every term needs wires. Two **equivalent** expressions produce the same outputs, but the simpler one needs **fewer gates and fewer gate inputs**. In the design of real hardware this has direct practical benefits:

- **Lower cost** — fewer gates means fewer transistors and a smaller chip area; for products made in millions, every gate saved matters.
- **Higher speed** — a signal takes a small time (the **propagation delay**) to pass through each gate. Fewer levels of gates mean the output is ready sooner, so the clock can run faster.
- **Lower power consumption and heat** — each gate uses power every time it switches; this is critical in phones and battery-powered sensors.
- **Higher reliability and easier testing** — fewer components and connections mean fewer things that can fail and fewer cases to check.

:::definition Simplification (minimisation)
Rewriting a Boolean expression, using the laws of Boolean algebra, as an **equivalent expression with fewer operations, terms or variables**, so that it can be built with **fewer logic gates**.
:::

:::compare The same function before and after simplification
| Property | Q = ¬(A + B) + A · (¬A + ¬B) | Q = ¬B |
|---|---|---|
| Gates needed | 6 (NOR, two NOT, two OR, AND) | 1 (NOT) |
| Gate levels the signal passes | 4 | 1 |
| Inputs actually used | A and B | B only |
| Truth table output | 1, 0, 1, 0 | 1, 0, 1, 0 (identical) |
| Cost, delay, power | high | very low |
:::

:::svg Simplification in hardware: the six-gate circuit for Q = ¬(A + B) + A · (¬A + ¬B) does exactly the same job as one NOT gate
<svg class="bl" viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top panel, before simplification: inputs A and B run down two vertical lines. A and B enter a NOR gate. A passes through a NOT gate and B through another NOT gate; these two outputs enter an OR gate. The OR output and input A enter an AND gate. The NOR output and the AND output enter a final OR gate giving Q. Six gates in total. Bottom panel, after simplification: input B passes through one NOT gate to give Q.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .g2{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .d{fill:var(--foreground)}
    svg.bl .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="bx" x="6" y="6" width="748" height="262" rx="10"/>
  <rect class="bx" x="6" y="278" width="748" height="96" rx="10"/>
  <text class="h" x="20" y="28">Before: Q = ¬(A + B) + A · (¬A + ¬B) — 6 gates</text>
  <g transform="translate(0,30)">
    <text class="h" x="80" y="16" text-anchor="middle">A</text>
    <text class="h" x="120" y="16" text-anchor="middle">B</text>
    <path class="w" d="M80,22 L80,225 L400,225 L400,178 L420,178"/>
    <path class="w" d="M120,22 L120,185"/>
    <path class="w" d="M80,52 L206,52 M120,78 L206,78"/>
    <circle class="d" cx="80" cy="52" r="3"/><circle class="d" cx="120" cy="78" r="3"/>
    <path class="g" d="M200,40 Q218,65 200,90 Q238,90 256,65 Q238,40 200,40 Z"/><circle class="g" cx="261" cy="65" r="5"/>
    <path class="w" d="M80,125 L200,125"/><circle class="d" cx="80" cy="125" r="3"/>
    <path class="g" d="M200,108 L234,125 L200,142 Z"/><circle class="g" cx="239" cy="125" r="5"/>
    <path class="w" d="M120,185 L200,185"/>
    <path class="g" d="M200,168 L234,185 L200,202 Z"/><circle class="g" cx="239" cy="185" r="5"/>
    <path class="w" d="M244,125 L270,125 L270,139 L306,139 M244,185 L280,185 L280,165 L306,165"/>
    <path class="g" d="M300,127 Q318,152 300,177 Q338,177 356,152 Q338,127 300,127 Z"/>
    <path class="w" d="M356,152 L420,152"/>
    <path class="g" d="M420,140 H448 A25,25 0 0 1 448,190 H420 Z"/>
    <path class="w" d="M266,65 L520,65 L520,92 L566,92 M473,165 L530,165 L530,118 L566,118"/>
    <path class="g" d="M560,80 Q578,105 560,130 Q598,130 616,105 Q598,80 560,80 Z"/>
    <path class="w" d="M616,105 L660,105"/>
    <text class="h" x="668" y="110">Q</text>
    <text class="s" x="390" y="58" text-anchor="middle">¬(A + B)</text>
    <text class="s" x="252" y="116" text-anchor="middle">¬A</text>
    <text class="s" x="252" y="202" text-anchor="middle">¬B</text>
    <text class="s" x="388" y="145" text-anchor="middle">¬A + ¬B</text>
    <text class="s" x="560" y="182">A · (¬A + ¬B)</text>
  </g>
  <text class="h" x="20" y="300">After simplification: Q = ¬B — 1 gate</text>
  <text class="h" x="60" y="345">B</text>
  <line class="w" x1="80" y1="340" x2="200" y2="340"/>
  <path class="g2" d="M200,323 L234,340 L200,357 Z"/><circle class="g2" cx="239" cy="340" r="5"/>
  <line class="w" x1="244" y1="340" x2="300" y2="340"/>
  <text class="h" x="308" y="345">Q</text>
  <text class="t" x="420" y="345">same truth table, 1/6 of the gates</text>
</svg>
:::

## A strategy for simplifying

There is no single fixed algorithm for algebraic simplification, but the following order of attack works for almost every exam question. Write **one step per line** and **name the law** used in each step — this is what earns the marks.

:::steps How to simplify a Boolean expression
- Remove NOTs over groups with **De Morgan's laws**, and cancel double NOTs (**double negation**).
- Multiply out brackets with the **distributive law** so the expression becomes a sum of products.
- Remove terms such as A · ¬A (**complement** → 0) and repeated factors A · A (**idempotent**).
- Look for pairs of terms that differ in only one variable, X · B + X · ¬B, and **factor** them: X · (B + ¬B) = X · 1 = X.
- Apply **absorption** (A + A · B = A) and **redundancy** (A + ¬A · B = A + B) to remove unnecessary terms and variables.
- Tidy up with **identity** and **null** laws, then **check** the result with a truth table.
:::

:::example Simplify Q = ¬(A + B) + A · (¬A + ¬B)
| Step | Expression | Law used |
|---|---|---|
| 1 | ¬A · ¬B + A · (¬A + ¬B) | De Morgan (NOT over OR) |
| 2 | ¬A · ¬B + A · ¬A + A · ¬B | Distributive (multiply out) |
| 3 | ¬A · ¬B + 0 + A · ¬B | Complement (A · ¬A = 0) |
| 4 | ¬A · ¬B + A · ¬B | Identity (X + 0 = X) |
| 5 | ¬B · (¬A + A) | Distributive (factor out ¬B), commutative |
| 6 | ¬B · 1 | Complement (¬A + A = 1) |
| 7 | **¬B** | Identity |

**Check:** for A, B = 00, 01, 10, 11 the original gives ¬(0) + 0 = 1; 0 + 0 = 0; 0 + 1·(0 + 1) = 1; 0 + 1·(0 + 0) = 0 → 1, 0, 1, 0, which is exactly ¬B.
:::

:::example Computer lab door in a NIS school — simplify, then check
The door of a computer lab opens (L = 1) in three situations, written by a student straight from the specification: L = A · B · C + A · B · ¬C + A · ¬B · C, where A = valid teacher card, B = timetable lesson now, C = technician on duty.

| Step | Expression | Law used |
|---|---|---|
| 1 | A · B · (C + ¬C) + A · ¬B · C | Distributive (factor out A · B) |
| 2 | A · B · 1 + A · ¬B · C | Complement (C + ¬C = 1) |
| 3 | A · B + A · ¬B · C | Identity |
| 4 | A · (B + ¬B · C) | Distributive (factor out A) |
| 5 | **A · (B + C)** | Redundancy (B + ¬B · C = B + C) |

**Check by truth table** — every row must match:

| A | B | C | original L | A · (B + C) |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |

The circuit shrinks from three 3-input AND gates, two NOT gates and a 3-input OR gate to **one OR and one AND gate**. In words: "the door opens with a teacher card when there is a lesson **or** a technician is on duty".
:::

:::example Simplify Q = (¬A + B) · ¬(A + ¬(A + B))
| Step | Expression | Law used |
|---|---|---|
| 1 | (¬A + B) · ¬A · ¬¬(A + B) | De Morgan (NOT over OR) |
| 2 | (¬A + B) · ¬A · (A + B) | Double negation |
| 3 | (¬A + B) · (¬A · A + ¬A · B) | Distributive |
| 4 | (¬A + B) · (0 + ¬A · B) | Complement |
| 5 | (¬A + B) · ¬A · B | Identity |
| 6 | ¬A · ¬A · B + B · ¬A · B | Distributive |
| 7 | ¬A · B + ¬A · B | Idempotent (¬A · ¬A = ¬A, B · B = B), commutative |
| 8 | **¬A · B** | Idempotent (X + X = X) |

Step 6 could also be shortened with absorption: (¬A + B) · (¬A · B) = ¬A · B because whenever ¬A · B is 1, ¬A + B is 1 too.
:::

## Checking a simplification

Algebra is easy to get wrong by one symbol, so always **verify** your answer: make a truth table with a column for the **original** expression and a column for the **simplified** one. If even one row differs, there is a mistake in a step — go back and look for a wrongly applied De Morgan or a lost NOT. A quick partial check is to substitute two or three rows (for example all 0s and all 1s) into both expressions. You can also use the truth-table builder in lesson 1 to check your work.

:::callout success Signs that an expression can be simplified further
- The same variable appears twice in one term (A · A · B, or A · ¬A · C).
- Two terms differ in **only one** variable: A · B · C and A · B · ¬C.
- One term contains all the variables of another: A + A · B.
- A NOT still covers a group: ¬(A · B).
:::

## Karnaugh maps — a visual short cut

For expressions with up to four variables there is a graphical method, the **Karnaugh map (K-map)**. It is the truth table redrawn as a grid in which **neighbouring cells differ in only one variable** (the columns follow the Gray code 00, 01, 11, 10 rather than binary order). You write the output of each row into its cell, then draw loops around groups of **adjacent 1s** in sizes 1, 2, 4 or 8. Inside a loop, the variable that changes is eliminated — exactly what the complement law does in algebra (X · C + X · ¬C = X). Each loop gives one product term; the OR of the loops is the simplified expression.

:::svg A Karnaugh map for the lab door L: two overlapping loops give L = A · B + A · C = A · (B + C)
<svg class="bl" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A Karnaugh map with rows A equals 0 and A equals 1 and columns BC equals 00, 01, 11, 10. The A equals 0 row is all zeros. The A equals 1 row has 0, 1, 1, 1. A blue loop around the cells BC equals 01 and 11 gives A AND C. A green loop around the cells BC equals 11 and 10 gives A AND B. Result: L equals A B plus A C, which equals A times B plus C.">
  <style>
    svg.bl .c{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bl .l1{fill:none;stroke:var(--primary);stroke-width:3}
    svg.bl .l2{fill:none;stroke:var(--success);stroke-width:3}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .v{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="150" y="40" text-anchor="end">A \ BC</text>
  <text class="h" x="200" y="40" text-anchor="middle">00</text>
  <text class="h" x="280" y="40" text-anchor="middle">01</text>
  <text class="h" x="360" y="40" text-anchor="middle">11</text>
  <text class="h" x="440" y="40" text-anchor="middle">10</text>
  <text class="h" x="140" y="95" text-anchor="middle">0</text>
  <text class="h" x="140" y="155" text-anchor="middle">1</text>
  <rect class="c" x="160" y="60" width="80" height="60"/><rect class="c" x="240" y="60" width="80" height="60"/>
  <rect class="c" x="320" y="60" width="80" height="60"/><rect class="c" x="400" y="60" width="80" height="60"/>
  <rect class="c" x="160" y="120" width="80" height="60"/><rect class="c" x="240" y="120" width="80" height="60"/>
  <rect class="c" x="320" y="120" width="80" height="60"/><rect class="c" x="400" y="120" width="80" height="60"/>
  <text class="v" x="200" y="97" text-anchor="middle">0</text><text class="v" x="280" y="97" text-anchor="middle">0</text>
  <text class="v" x="360" y="97" text-anchor="middle">0</text><text class="v" x="440" y="97" text-anchor="middle">0</text>
  <text class="v" x="200" y="157" text-anchor="middle">0</text><text class="v" x="280" y="157" text-anchor="middle">1</text>
  <text class="v" x="360" y="157" text-anchor="middle">1</text><text class="v" x="440" y="157" text-anchor="middle">1</text>
  <rect class="l1" x="246" y="126" width="148" height="48" rx="20"/>
  <rect class="l2" x="330" y="132" width="144" height="36" rx="16"/>
  <text class="s" x="320" y="205" text-anchor="middle">columns in Gray code: neighbours differ in one bit</text>
  <rect class="l1" x="520" y="64" width="26" height="16" rx="6"/>
  <text class="t" x="556" y="77">A = 1, C = 1, B changes → A · C</text>
  <rect class="l2" x="520" y="100" width="26" height="16" rx="6"/>
  <text class="t" x="556" y="113">A = 1, B = 1, C changes → A · B</text>
  <text class="h" x="520" y="152">L = A · B + A · C</text>
  <text class="t" x="520" y="174">= A · (B + C)</text>
</svg>
:::

The K-map gives the same answer as the algebra in the lab-door example, but in one picture. Algebra remains the method the exam asks for when it says "**using the laws of Boolean algebra**", so learn K-maps as a checking tool, not as a replacement.

:::warning Common mistakes when simplifying
- Writing several laws in one step without naming them — examiners give marks for **named, separate steps**.
- "Cancelling" like in arithmetic: A · B + A = B is **wrong**; by absorption A · B + A = **A**.
- Losing a NOT while copying a line — check each line against the previous one.
- Stopping too early: A · (¬A + B) still simplifies to **A · B** (redundancy).
- Never checking — a quick truth table of the original and the result catches almost every error.
:::

# Exam practice: laws and simplification
@lo 11.3.3.1@paper, 12.3.3.3

:::example Exam-style questions with model answers
**Q: Name the law of Boolean algebra shown by each identity: (i) A + 0 = A (ii) A · (A + B) = A (iii) ¬(A + B) = ¬A · ¬B. [3]**
(i) **Identity** law (1); (ii) **Absorption** law (1); (iii) **De Morgan's** law (1).

**Q: State the duality principle and write the dual of A · ¬A = 0. [2]**
If an identity is true, the identity obtained by swapping AND with OR and 0 with 1 is also true (1); dual: **A + ¬A = 1** (1).

**Q: Use a truth table to prove that A · (¬A + B) = A · B. [3]**

| A | B | ¬A + B | A · (¬A + B) | A · B |
|---|---|---|---|---|
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

¬A + B column correct (1); both final columns correct (1); statement that the columns are identical for every row, so the expressions are equal (1).

**Q: Simplify X = ¬(¬A + B) + A · B. Show your working and name the laws. [3]**
X = ¬¬A · ¬B + A · B — De Morgan (1); = A · ¬B + A · B — double negation; = A · (¬B + B) — distributive (1); = A · 1 = **A** — complement, identity (1).

**Q: Simplify Q = A · B · C + A · B · ¬C + ¬A · B. Show your working. [4]**
Q = A · B · (C + ¬C) + ¬A · B — distributive (1); = A · B · 1 + ¬A · B = A · B + ¬A · B — complement, identity (1); = B · (A + ¬A) — distributive (1); = B · 1 = **B** — complement, identity (1).

**Q: Explain two reasons why designers simplify Boolean expressions before building circuits. [4]**
Fewer gates are needed (1), so the circuit is **cheaper** / uses less chip area (1). Signals pass through **fewer levels of gates** (1), so the propagation delay is shorter and the circuit is **faster** (1). (Also accept: less power / heat; more reliable, fewer connections to fail.)
:::

:::warning Common mistakes in exam answers
- Naming the law **vaguely** ("the NOT law"): use the exact names — complement, double negation, De Morgan.
- Simplifying **several steps at once** and getting only the final mark.
- In proofs, completing the table but **not stating** that the final columns match.
- Writing A + A = 2A or 1 + 1 = 2 — in Boolean algebra both are **A** and **1**.
:::

:::steps Check yourself
- Write every law in both its AND form and its OR form.
- Explain the duality principle and write the dual of A + B · C = (A + B) · (A + C).
- State De Morgan's laws in symbols and in words, and apply them to ¬(A · B · C).
- Prove A + ¬A · B = A + B with a truth table and with algebra.
- Explain the difference between absorption and redundancy using their truth tables.
- Simplify A · B + A · ¬B and (A + B) · (A + ¬B), naming every law.
- Give three reasons why simplification matters in circuit design.
:::

# Normal forms and logical transformation
@lo 12.3.3.1

A Boolean function can be written in infinitely many equivalent ways: A ⊕ B, A · ¬B + ¬A · B and (A + B) · ¬(A · B) all describe the same truth table. To compare functions, to build circuits in a standard way and to feed expressions to design software, engineers bring them to an agreed **standard shape**, called a **normal form**. The two normal forms used in this course are the **sum of products** (disjunctive normal form) and the **product of sums** (conjunctive normal form).

## Literals, minterms and maxterms

A **literal** is a variable or its complement: A, ¬A, B, ¬B … are literals. Normal forms are built only from literals joined by AND and OR — a NOT is allowed **only directly on a single variable**, never on a bracket.

:::definition Minterm
An **AND (product) term that contains every input variable exactly once**, either plain or complemented. A minterm is **1 for exactly one row** of the truth table: a variable is written plain where the row has 1 and with NOT where it has 0. Example: row A = 1, B = 0, C = 1 → minterm **A · ¬B · C**.
:::

:::definition Maxterm
An **OR (sum) term that contains every input variable exactly once**, plain or complemented. A maxterm is **0 for exactly one row**: a variable is written plain where the row has **0** and with NOT where it has **1**. Example: row A = 1, B = 0, C = 1 → maxterm **¬A + B + ¬C**.
:::

:::compare Minterms and maxterms for two variables
| A | B | Minterm (1 only on this row) | Maxterm (0 only on this row) |
|---|---|---|---|
| 0 | 0 | ¬A · ¬B | A + B |
| 0 | 1 | ¬A · B | A + ¬B |
| 1 | 0 | A · ¬B | ¬A + B |
| 1 | 1 | A · B | ¬A + ¬B |
:::

Notice that each maxterm is the **complement** of the minterm in the same row (by De Morgan, ¬(¬A · B) = A + ¬B). This is why the two forms mirror each other exactly — another example of the duality principle.

## Sum of products and product of sums

:::definition Sum of products (SOP) — disjunctive normal form (DNF)
An expression written as an **OR of AND terms**, where each AND term is made of literals only. Example: A · ¬B + ¬A · B · C. If every term is a full minterm the form is called **canonical** (or *perfect*) DNF.
:::

:::definition Product of sums (POS) — conjunctive normal form (CNF)
An expression written as an **AND of OR terms**, where each OR term is made of literals only. Example: (A + B) · (¬A + C). If every bracket is a full maxterm the form is called **canonical** (or *perfect*) CNF.
:::

Both forms are **two-level** expressions: one layer of operations on literals, then one combining operation. That is why they translate directly into a two-level circuit — a row of AND gates feeding one OR gate (SOP), or a row of OR gates feeding one AND gate (POS). Two-level circuits are fast because every signal passes through at most two gates (plus any NOT gates on the inputs).

## From a truth table to a normal form

**SOP method:** find every row where the output is **1**, write the minterm of each such row, and OR the minterms together. **POS method:** find every row where the output is **0**, write the maxterm of each such row, and AND them together. Choose SOP when the output has few 1s and POS when it has few 0s — the expression will be shorter.

:::example A majority-vote circuit for a school debate jury
Three judges A, B and C press a button (1) if they vote "yes". The light X shows "pass" when **at least two** judges vote yes.

| A | B | C | X | Minterm (rows with X = 1) | Maxterm (rows with X = 0) |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | | A + B + C |
| 0 | 0 | 1 | 0 | | A + B + ¬C |
| 0 | 1 | 0 | 0 | | A + ¬B + C |
| 0 | 1 | 1 | 1 | ¬A · B · C | |
| 1 | 0 | 0 | 0 | | ¬A + B + C |
| 1 | 0 | 1 | 1 | A · ¬B · C | |
| 1 | 1 | 0 | 1 | A · B · ¬C | |
| 1 | 1 | 1 | 1 | A · B · C | |

**Canonical SOP:** X = ¬A · B · C + A · ¬B · C + A · B · ¬C + A · B · C

**Canonical POS:** X = (A + B + C) · (A + B + ¬C) · (A + ¬B + C) · (¬A + B + C)

**Simplifying the SOP.** Use the idempotent law to copy A · B · C three times (X + X = X), then pair each copy with one other term:
(¬A · B · C + A · B · C) + (A · ¬B · C + A · B · C) + (A · B · ¬C + A · B · C)
= B · C · (¬A + A) + A · C · (¬B + B) + A · B · (¬C + C) — distributive
= **A · B + B · C + A · C** — complement, identity.
The final expression reads exactly like the specification: "A and B, or B and C, or A and C vote yes".
:::

## Rules of logical transformation

Formulas from formal logic often contain operations that are not part of a normal form: **implication** (→, "if … then"), **equivalence** (↔, "if and only if"), **XOR**, **NAND** and **NOR**. Before a formula can be reduced to DNF or CNF, these operations must be **replaced by AND, OR and NOT** using the rules of logical transformation.

:::definition Implication
**A → B** ("if A then B") is **false only when A is true and B is false**; in every other case it is true. It is transformed as **A → B = ¬A + B**.
:::

| A | B | A → B | ¬A + B | A ↔ B | A ⊕ B |
|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 0 |

The columns A → B and ¬A + B are identical, which proves the implication rule. A school example: "if it rains (A), the PE lesson is indoors (B)" is broken only when it rains **and** the lesson is outdoors. Equivalence A ↔ B is 1 when A and B are **equal**, so it is the exact opposite of XOR: A ↔ B = ¬(A ⊕ B).

:::compare Rules of logical transformation
| Operation | Replace with (AND, OR, NOT only) | Form obtained |
|---|---|---|
| Implication A → B | ¬A + B | SOP and POS at once |
| Equivalence A ↔ B | A · B + ¬A · ¬B, or (¬A + B) · (A + ¬B) | SOP / POS |
| XOR A ⊕ B | A · ¬B + ¬A · B, or (A + B) · (¬A + ¬B) | SOP / POS |
| NAND ¬(A · B) | ¬A + ¬B (De Morgan) | SOP |
| NOR ¬(A + B) | ¬A · ¬B (De Morgan) | SOP |
| NOT over a group | De Morgan, repeated, then double negation | literals only |
| OR of ANDs → POS | A + B · C = (A + B) · (A + C) | POS |
| AND of ORs → SOP | A · (B + C) = A · B + A · C | SOP |
:::

:::mermaid Reducing a formula to normal form
flowchart TD
  S["Formula with →, ↔, ⊕, NAND, NOR"] --> R["1. Replace them using the transformation rules"]
  R --> M["2. Push every NOT down onto single variables (De Morgan)"]
  M --> D["3. Remove double NOTs (double negation)"]
  D --> X["4. Distribute: AND over OR for SOP, OR over AND for POS"]
  X --> Y["5. Tidy up: complement, idempotent, identity, absorption"]
  Y --> N["Normal form (DNF or CNF)"]
:::

:::example Reduce F = (A → B) · (B → A) to DNF
| Step | Expression | Rule / law |
|---|---|---|
| 1 | (¬A + B) · (¬B + A) | Implication rule, twice (this is already a CNF) |
| 2 | ¬A · ¬B + ¬A · A + B · ¬B + B · A | Distributive (multiply out) |
| 3 | ¬A · ¬B + 0 + 0 + A · B | Complement |
| 4 | **¬A · ¬B + A · B** | Identity, commutative |

The result is 1 when A and B are equal — the formula is the **equivalence** A ↔ B, as its meaning ("A implies B and B implies A") suggests.
:::

:::example Reduce F = ¬((A ⊕ B) + ¬C) to CNF and to DNF
| Step | Expression | Rule / law |
|---|---|---|
| 1 | ¬(A ⊕ B) · ¬¬C | De Morgan (NOT over OR) |
| 2 | ¬(A ⊕ B) · C | Double negation |
| 3 | ¬(A · ¬B + ¬A · B) · C | XOR rule |
| 4 | ¬(A · ¬B) · ¬(¬A · B) · C | De Morgan (NOT over OR) |
| 5 | (¬A + B) · (A + ¬B) · C | De Morgan (NOT over AND), double negation — **CNF** |
| 6 | (¬A · A + ¬A · ¬B + B · A + B · ¬B) · C | Distributive |
| 7 | (¬A · ¬B + A · B) · C | Complement, identity |
| 8 | **¬A · ¬B · C + A · B · C** | Distributive — **DNF** |

**Check:** the formula is 1 only when C = 1 and A = B, i.e. on rows 001 and 111 — exactly the two minterms in the DNF.
:::

:::example Reduce Q = ¬((A + B) · (C + ¬D)) to SOP
| Step | Expression | Law |
|---|---|---|
| 1 | ¬(A + B) + ¬(C + ¬D) | De Morgan (NOT over AND) |
| 2 | ¬A · ¬B + ¬C · ¬¬D | De Morgan (NOT over OR), twice |
| 3 | **¬A · ¬B + ¬C · D** | Double negation |

To get a **POS** from an SOP, use the OR-form distributive law: for example A + B · ¬C = **(A + B) · (A + ¬C)**.
:::

# Building logic circuits
@lo 12.3.3.2

A **logical structure** (logic circuit) is a set of logic gates connected so that the outputs of some gates become the inputs of others. Building one means turning a description — an expression, a word problem or a truth table — into a correct diagram. In Paper 2 this is marked gate by gate, so a clear, systematic method is essential.

:::definition Logic circuit (logical structure)
A **combination of logic gates connected by wires** that produces one or more outputs from a set of binary inputs; its behaviour is described by a Boolean expression or a truth table.
:::

## From an expression to a circuit

The order of precedence tells you the order in which the gates are reached. The **innermost** operations are the gates nearest the inputs; the operation done **last** is the gate that produces the output.

:::steps How to draw a circuit from an expression
- Write the inputs (A, B, C …) on the left, one line each; an input used by several gates branches with a dot.
- Draw a NOT gate for every complemented variable.
- Draw the gates for the innermost brackets, then the next level, working outwards.
- The last operation in the expression is the output gate; label its output X (or Q).
- Check: every gate has the right number of inputs, every input and the output are labelled.
:::

:::example Circuit for X = (¬A + B) · (B ⊕ C)
| Gate | Inputs | Output |
|---|---|---|
| 1 NOT | A | ¬A |
| 2 OR | ¬A, B | ¬A + B |
| 3 XOR | B, C | B ⊕ C |
| 4 AND | outputs of 2 and 3 | **X** |

Input B is used twice, so its line **branches** (a dot at the junction) to the OR gate and to the XOR gate. The AND gate is last because the brackets are evaluated first. Truth table for checking the finished circuit:

| A | B | C | ¬A + B | B ⊕ C | X |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 |
:::

## From a problem statement to a circuit

Combine the skills of lesson 1 and this section: (1) name the inputs and output, (2) write the expression, (3) simplify it if possible, (4) draw the circuit. For example, the ventilation in a school server room in Shymkent must switch on (V = 1) when the temperature is high (**T**) **and** the room is occupied (**O**), **or** whenever the smoke sensor (**S**) is triggered. The expression is **V = T · O + S**: an AND gate with inputs T and O, and an OR gate that combines its output with S. Its truth table is 0, 1, 0, 1, 0, 1, 1, 1 for the rows 000 to 111 (inputs T, O, S).

## From a truth table to a circuit

When only the truth table is given, write the **SOP** (one minterm per row with output 1), **simplify** it, then draw it. A staircase light that changes whenever either switch is flipped has the table A B → X: 00 → 0, 01 → 1, 10 → 1, 11 → 0. The minterms are ¬A · B and A · ¬B, so **X = ¬A · B + A · ¬B** (which is A ⊕ B). Drawn directly, the SOP gives the typical three-layer structure: NOT gates, one AND gate per minterm, one OR gate.

:::svg An SOP circuit for X = ¬A · B + A · ¬B: a NOT layer, one AND gate per product term and one OR gate for the sum
<svg class="bl" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inputs A and B run down two vertical lines. A goes through a NOT gate; not A and B enter the upper AND gate giving not A AND B. B goes through a NOT gate; A and not B enter the lower AND gate giving A AND not B. The two AND outputs enter an OR gate whose output is X. Labels under the circuit show the NOT layer, the AND layer and the OR layer.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .g2{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .d{fill:var(--foreground)}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="60" y="20" text-anchor="middle">A</text>
  <text class="h" x="100" y="20" text-anchor="middle">B</text>
  <path class="w" d="M60,26 L60,200 M100,26 L100,200"/>
  <path class="w" d="M60,45 L160,45"/><circle class="d" cx="60" cy="45" r="3"/>
  <path class="g" d="M160,28 L194,45 L160,62 Z"/><circle class="g" cx="199" cy="45" r="5"/>
  <path class="w" d="M204,45 L250,45 L250,52 L300,52"/>
  <path class="w" d="M100,78 L300,78"/><circle class="d" cx="100" cy="78" r="3"/>
  <path class="g2" d="M300,40 H328 A25,25 0 0 1 328,90 H300 Z"/>
  <path class="w" d="M60,152 L300,152"/><circle class="d" cx="60" cy="152" r="3"/>
  <path class="w" d="M100,195 L160,195"/><circle class="d" cx="100" cy="195" r="3"/>
  <path class="g" d="M160,178 L194,195 L160,212 Z"/><circle class="g" cx="199" cy="195" r="5"/>
  <path class="w" d="M204,195 L250,195 L250,178 L300,178"/>
  <path class="g2" d="M300,140 H328 A25,25 0 0 1 328,190 H300 Z"/>
  <path class="w" d="M353,65 L400,65 L400,102 L456,102 M353,165 L400,165 L400,128 L456,128"/>
  <path class="g" d="M450,90 Q468,115 450,140 Q488,140 506,115 Q488,90 450,90 Z"/>
  <line class="w" x1="506" y1="115" x2="580" y2="115"/>
  <text class="h" x="590" y="120">X</text>
  <text class="s" x="228" y="38" text-anchor="middle">¬A</text>
  <text class="s" x="228" y="212" text-anchor="middle">¬B</text>
  <text class="s" x="372" y="58" text-anchor="middle">¬A · B</text>
  <text class="s" x="372" y="182" text-anchor="middle">A · ¬B</text>
  <text class="t" x="180" y="240" text-anchor="middle">NOT layer</text>
  <text class="t" x="326" y="240" text-anchor="middle">AND: one per term</text>
  <text class="t" x="478" y="240" text-anchor="middle">OR: the sum</text>
  <text class="s" x="600" y="160">X = A ⊕ B</text>
  <text class="s" x="600" y="178">(one XOR gate)</text>
</svg>
:::

The same function needs only **one XOR gate**. This shows why the SOP read straight from a table is a *correct* design but not always the *best* one: after writing the SOP, always look for simplifications (lesson 2) or for a single gate that does the same job.

## Circuits built from NAND gates only

Because NAND is universal, any circuit can be made from NAND gates only. The neatest method works on an SOP: **every two-level AND–OR circuit can be replaced by a NAND–NAND circuit with the same layout**. The proof uses double negation and De Morgan's law:

$$A \cdot B + C \cdot D = \overline{\overline{A \cdot B + C \cdot D}} = \overline{\overline{A \cdot B} \cdot \overline{C \cdot D}}$$ | Double negation, then De Morgan: the outer expression is a NAND of two NANDs

:::svg An AND–OR circuit and the equivalent NAND–NAND circuit for X = A · B + C · D
<svg class="bl" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: A and B enter an AND gate, C and D enter another AND gate, and both outputs enter an OR gate giving X. Right: the same layout with every gate replaced by a NAND gate: A and B enter a NAND, C and D enter a NAND, and both outputs enter a third NAND giving the same X.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .g2{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="bx" x="6" y="20" width="368" height="210" rx="10"/>
  <rect class="bx" x="386" y="20" width="368" height="210" rx="10"/>
  <text class="t" x="22" y="57">A</text><text class="t" x="22" y="83">B</text>
  <text class="t" x="22" y="147">C</text><text class="t" x="22" y="173">D</text>
  <path class="w" d="M36,52 L80,52 M36,78 L80,78 M36,142 L80,142 M36,168 L80,168"/>
  <path class="g" d="M80,40 H108 A25,25 0 0 1 108,90 H80 Z"/>
  <path class="g" d="M80,130 H108 A25,25 0 0 1 108,180 H80 Z"/>
  <path class="w" d="M133,65 L180,65 L180,97 L226,97 M133,155 L180,155 L180,123 L226,123"/>
  <path class="g" d="M220,85 Q238,110 220,135 Q258,135 276,110 Q258,85 220,85 Z"/>
  <line class="w" x1="276" y1="110" x2="330" y2="110"/>
  <text class="h" x="338" y="115">X</text>
  <text class="h" x="190" y="210" text-anchor="middle">AND–OR</text>
  <text class="t" x="402" y="57">A</text><text class="t" x="402" y="83">B</text>
  <text class="t" x="402" y="147">C</text><text class="t" x="402" y="173">D</text>
  <path class="w" d="M416,52 L470,52 M416,78 L470,78 M416,142 L470,142 M416,168 L470,168"/>
  <path class="g2" d="M470,40 H498 A25,25 0 0 1 498,90 H470 Z"/><circle class="g2" cx="528" cy="65" r="5"/>
  <path class="g2" d="M470,130 H498 A25,25 0 0 1 498,180 H470 Z"/><circle class="g2" cx="528" cy="155" r="5"/>
  <path class="w" d="M533,65 L570,65 L570,97 L610,97 M533,155 L570,155 L570,123 L610,123"/>
  <path class="g2" d="M610,85 H638 A25,25 0 0 1 638,135 H610 Z"/><circle class="g2" cx="668" cy="110" r="5"/>
  <line class="w" x1="673" y1="110" x2="720" y2="110"/>
  <text class="h" x="728" y="115">X</text>
  <text class="s" x="585" y="58" text-anchor="middle">¬(A·B)</text>
  <text class="s" x="585" y="172" text-anchor="middle">¬(C·D)</text>
  <text class="h" x="570" y="210" text-anchor="middle">NAND–NAND (same output)</text>
  <text class="t" x="380" y="256" text-anchor="middle">¬(¬(A · B) · ¬(C · D)) = A · B + C · D — De Morgan and double negation</text>
</svg>
:::

The method: (1) write the expression as an SOP; (2) replace every AND gate and the final OR gate with NAND gates, keeping the wiring; (3) any single variable that goes straight into the OR gate must first pass through a NAND used as NOT; (4) any NOT gate is replaced by a NAND with its inputs joined. Manufacturers like NAND-only designs because one standard cell can be repeated across the chip.

:::compare AND–OR circuit and NAND–NAND circuit
| Feature | AND–OR (SOP) | NAND–NAND |
|---|---|---|
| Gate types | AND, OR (and NOT) | NAND only |
| Layout | two levels | the same two levels |
| Output | X | the same X |
| Ease of manufacture | several cell types | one repeated cell, cheaper |
| Gates for X = A·B + C·D | 3 | 3 |
:::

## An applied structure: the half adder

The most important practical logic circuit is the **adder** in the ALU of the processor. Adding two single bits gives four cases: 0 + 0 = 0, 0 + 1 = 1, 1 + 0 = 1 and 1 + 1 = 10₂. The result needs two outputs: a **sum** bit S and a **carry** bit C.

:::definition Half adder
A logic circuit that **adds two single bits** A and B and produces a **sum bit S = A ⊕ B** and a **carry bit C = A · B**.
:::

| A | B | C (carry) | S (sum) |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 |

The S column (0, 1, 1, 0) is the XOR table and the C column (0, 0, 0, 1) is the AND table, so the half adder is just an **XOR gate and an AND gate sharing the same inputs**.

:::svg A half adder: XOR gives the sum bit, AND gives the carry bit
<svg class="bl" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inputs A and B both branch. One branch of each goes into an XOR gate whose output is S, the sum bit. The other branches go into an AND gate whose output is C, the carry bit.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .o{fill:none;stroke:var(--success);stroke-width:3}
    svg.bl .d{fill:var(--foreground)}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="26" y="65">A</text><text class="h" x="26" y="91">B</text>
  <path class="w" d="M45,60 L247,60 M100,60 L100,150 L250,150"/>
  <path class="w" d="M45,86 L247,86 M130,86 L130,176 L250,176"/>
  <circle class="d" cx="100" cy="60" r="3"/><circle class="d" cx="130" cy="86" r="3"/>
  <path class="w" style="stroke:var(--primary)" d="M240,48 Q258,73 240,98"/>
  <path class="g" d="M248,48 Q266,73 248,98 Q286,98 304,73 Q286,48 248,48 Z"/>
  <line class="o" x1="304" y1="73" x2="400" y2="73"/>
  <path class="g" d="M250,138 H278 A25,25 0 0 1 278,188 H250 Z"/>
  <line class="o" x1="303" y1="163" x2="400" y2="163"/>
  <text class="h" x="410" y="78">S (sum) = A ⊕ B</text>
  <text class="h" x="410" y="168">C (carry) = A · B</text>
  <text class="s" x="276" y="38" text-anchor="middle">XOR</text>
  <text class="s" x="276" y="204" text-anchor="middle">AND</text>
  <text class="t" x="410" y="115">Example: 1 + 1 = 10₂ → S = 0, C = 1</text>
</svg>
:::

A **full adder** adds three bits (A, B and the carry-in from the previous column) and is built from two half adders and an OR gate; chaining full adders gives an adder for 8, 16, 32 or 64-bit numbers. This is how the ALU uses logical structures built from the gates of lesson 1.

:::compare Half adder and full adder
| Feature | Half adder | Full adder |
|---|---|---|
| Inputs | 2 (A, B) | 3 (A, B, carry-in) |
| Outputs | sum, carry | sum, carry-out |
| Sum | A ⊕ B | A ⊕ B ⊕ Cin |
| Carry | A · B | A · B + Cin · (A ⊕ B) |
| Used for | the lowest bit only | every other bit of a multi-bit adder |
:::

# Analysing logic circuits
@lo 12.3.3.4, 12.3.3.2

Analysing is the reverse of building: you are given a circuit diagram and must find out **what it does**. Typical exam tasks are: write the Boolean expression for the output, complete the truth table, simplify the expression, and **describe in words** when the output is 1. A careful, labelled approach avoids nearly all errors.

:::steps How to analyse a logic circuit
- Label the output of every gate with a letter (P, Q, R …), working from the inputs towards the output.
- Write the expression for each labelled point, using the gate type and its inputs.
- Substitute the labels to get one expression for the output in terms of the inputs only.
- Complete a truth table with columns for the inputs, every labelled point and the output.
- Simplify the expression if asked, and check it against the truth table.
- Describe the behaviour in words: "the output is 1 when …".
:::

:::svg A circuit to analyse: P = A NAND B, R = B OR C, X = P AND R
<svg class="bl" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inputs A and B enter a NAND gate whose output is labelled P. Input B also branches into an OR gate together with input C; the OR output is labelled R. P and R enter an AND gate whose output is X.">
  <style>
    svg.bl .g{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bl .w{fill:none;stroke:var(--foreground);stroke-width:2}
    svg.bl .p{fill:none;stroke:var(--warning);stroke-width:3}
    svg.bl .d{fill:var(--foreground)}
    svg.bl .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bl .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="28" y="57">A</text><text class="h" x="28" y="105">B</text><text class="h" x="28" y="153">C</text>
  <path class="w" d="M50,52 L200,52"/>
  <path class="w" d="M50,100 L140,100 M140,78 L140,122 M140,78 L200,78 M140,122 L206,122"/>
  <circle class="d" cx="140" cy="100" r="3"/>
  <path class="w" d="M50,148 L206,148"/>
  <path class="g" d="M200,40 H228 A25,25 0 0 1 228,90 H200 Z"/><circle class="g" cx="258" cy="65" r="5"/>
  <path class="g" d="M200,110 Q218,135 200,160 Q238,160 256,135 Q238,110 200,110 Z"/>
  <path class="p" d="M263,65 L330,65 L330,87 L400,87"/>
  <path class="p" d="M256,135 L330,135 L330,113 L400,113"/>
  <text class="h" x="295" y="58" text-anchor="middle">P</text>
  <text class="h" x="295" y="128" text-anchor="middle">R</text>
  <path class="g" d="M400,75 H428 A25,25 0 0 1 428,125 H400 Z"/>
  <line class="w" x1="453" y1="100" x2="520" y2="100"/>
  <text class="h" x="528" y="105">X</text>
  <text class="s" x="230" y="30" text-anchor="middle">P = ¬(A · B)</text>
  <text class="s" x="230" y="185" text-anchor="middle">R = B + C</text>
  <text class="t" x="560" y="140">X = P · R</text>
  <text class="t" x="560" y="160">= ¬(A · B) · (B + C)</text>
</svg>
:::

:::example Analysing the circuit above
**Step 1 — intermediate expressions.** P = ¬(A · B) (NAND of A and B); R = B + C (OR of B and C).

**Step 2 — output expression.** X = P · R = **¬(A · B) · (B + C)**.

**Step 3 — truth table.**

| A | B | C | P = ¬(A · B) | R = B + C | X = P · R |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 1 | 0 | 1 | 0 |

**Step 4 — simplify to SOP.** (¬A + ¬B) · (B + C) by De Morgan; = ¬A · B + ¬A · C + ¬B · B + ¬B · C by the distributive law; = **¬A · B + ¬A · C + ¬B · C** by the complement and identity laws. The SOP gives 1 on rows 001, 010, 011 and 101 — the same as the table.

**Step 5 — describe.** X is 1 when **at least one of B and C is 1, but A and B are not both 1**.
:::

:::example Finding a redundant gate by analysis
A circuit has C = A AND (NOT B), D = A XOR B and X = C OR D.

| A | B | C = A · ¬B | D = A ⊕ B | X = C + D |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 |

The output column equals D, so **X = A ⊕ B**. Algebraically: A · ¬B + (A · ¬B + ¬A · B) = A · ¬B + ¬A · B by the idempotent law. Gate C (and its NOT gate) add nothing: whenever C is 1, D is already 1. Analysis has shown that two of the four gates can be **removed** without changing the behaviour — saving cost and power.
:::

## Describing what a circuit does

The final part of an analysis question often asks you to "describe the function" or "state when the output is 1". Read the **rows where the output is 1** and look for a simple pattern. Common patterns: output 1 when **all** inputs are 1 (AND), when **any** input is 1 (OR), when inputs are **different** (XOR), when inputs are **equal** (XNOR / equivalence), when **at least two** inputs are 1 (majority, also the carry of a full adder), or when an **odd number** of inputs are 1 (parity). Linking the circuit to a real use — an adder, an alarm, a comparator — shows the examiner that you understand the structure, not only the table.

:::compare Building a circuit and analysing a circuit
| | Building (synthesis) | Analysing |
|---|---|---|
| Given | expression, word problem or truth table | circuit diagram |
| Produce | circuit diagram | expression, truth table, description |
| Work from | the output's last operation back to the inputs | the inputs forwards to the output |
| Key tools | precedence, SOP from table, simplification | labelling P, Q, R; intermediate columns |
| Check by | truth table of the circuit vs the specification | substituting rows; simplifying |
:::

:::warning Common mistakes when building and analysing circuits
- Drawing an AND gate where the expression has OR (check the **shape**: straight back = AND, curved back = OR).
- Not **branching** an input that is used twice — draw one input line that splits with a dot, not two separate inputs with the same name.
- Forgetting that the **last** operation is the output gate: X = ¬A · B needs NOT on A only, not a NAND.
- Writing the expression of a circuit without **brackets**: the output of an OR gate that feeds an AND gate must be in brackets, (B + C) · P.
- Skipping the labelled intermediate columns in an analysis truth table.
- In SOP from a table, writing the minterm with the wrong NOTs: a **0 in the row → NOT** on that variable.
:::

# Exam practice: normal forms and logic circuits
@lo 12.3.3.1, 12.3.3.2, 12.3.3.4

:::example Exam-style questions with model answers
**Q: Write the minterm and the maxterm for the row A = 1, B = 0, C = 1. [2]**
Minterm **A · ¬B · C** (1); maxterm **¬A + B + ¬C** (1).

**Q: X is 1 only on the rows 001, 011 and 111 (inputs A, B, C). Write X in sum-of-products form and simplify it. [4]**
X = ¬A · ¬B · C + ¬A · B · C + A · B · C (1); = ¬A · C · (¬B + B) + A · B · C — distributive (1); = ¬A · C + A · B · C — complement, identity (1); = C · (¬A + A · B) = **C · (¬A + B)** — distributive, redundancy (1).

**Q: Reduce F = A → (B · ¬C) to disjunctive normal form. [2]**
Implication rule A → Y = ¬A + Y (1); **F = ¬A + B · ¬C** (1).

**Q: Describe how to draw the logic circuit for X = ¬A · (B + C). [3]**
An **OR** gate with inputs B and C (1); a **NOT** gate on input A (1); an **AND** gate whose inputs are ¬A and the OR output, giving X (1).

**Q: In a circuit P = A XOR B, Q = P AND C, R = A AND B and X = Q OR R. Complete the truth table and describe the function of X. [5]**

| A | B | C | P | Q | R | X |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 | 1 | 1 |

P column (1); Q column (1); R column (1); X column (1); X is 1 when **at least two inputs are 1** — it is the **carry-out of a full adder** (1).

**Q: A half adder adds two bits. State the gates it uses and the outputs when A = 1 and B = 1. [3]**
An **XOR** gate for the sum and an **AND** gate for the carry (1); sum S = 1 ⊕ 1 = **0** (1); carry C = 1 · 1 = **1** (1).
:::

:::warning Common mistakes in exam answers
- Writing a "normal form" with a NOT still over a bracket — in DNF / CNF NOT may stand **only on single variables**.
- Using the rows with output **0** for SOP (they are for POS) or the wrong NOTs in a minterm.
- Transforming A → B as A + ¬B or ¬A · B — the correct rule is **¬A + B**.
- Describing a circuit's function by repeating the expression; "describe" needs **words** (e.g. "1 when at least two inputs are 1").
:::

:::steps Check yourself
- Define literal, minterm, maxterm, SOP (DNF) and POS (CNF).
- Write the canonical SOP and POS for the majority function and simplify the SOP.
- State the transformation rules for →, ↔, ⊕, NAND and NOR.
- Reduce ¬((A + B) · ¬C) to sum-of-products form.
- Draw the circuit for X = (A + ¬B) · C and convert X = A · B + C · D to NAND gates only.
- Draw a half adder and write its truth table.
- Analyse a three-gate circuit: label P, Q, R, write X, complete the table, describe it.
:::
