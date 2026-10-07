---
summary: Binary, denary and hexadecimal number systems, converting between them, why hexadecimal is used, and binary addition and multiplication.
---
# Binary, denary and hexadecimal
@lo 11.1.1.1

A **number system** is defined by its **base** — how many different digits it uses. The value of a digit depends on its **place value**, a power of the base.

:::compare
| System | Base | Digits | Place values (right → left) | Example |
|---|---|---|---|---|
| Denary (decimal) | 10 | 0–9 | 1, 10, 100, 1000 … | 245₁₀ |
| Binary | 2 | 0, 1 | 1, 2, 4, 8, 16, 32, 64, 128 … | 11110101₂ |
| Hexadecimal | 16 | 0–9, A–F (A=10 … F=15) | 1, 16, 256, 4096 … | F5₁₆ |
:::

:::callout info Why computers use binary
Computer circuits are made of transistors that have **two states** — on/off (1/0). Two states are easy to make reliable, so all data and instructions are stored as binary digits (**bits**). 8 bits = 1 **byte**; 4 bits = 1 **nibble**.
:::

# Converting between number systems
@lo 11.1.1.2

## Binary → denary: add the place values of the 1s

:::compare 01011011₂
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 0 | 1 | 0 | 1 | 1 | 0 | 1 | 1 |
:::

64 + 16 + 8 + 2 + 1 = **91₁₀**

## Denary → binary

:::steps Method 1 — subtract place values (91)
- Largest place value ≤ 91 is 64 → bit 1, remainder 27.
- 32 > 27 → 0. 16 ≤ 27 → 1, remainder 11.
- 8 ≤ 11 → 1, remainder 3. 4 > 3 → 0.
- 2 ≤ 3 → 1, remainder 1. 1 → 1.
- Result: **1011011₂** (01011011 in 8 bits).
:::

:::steps Method 2 — repeated division by 2 (read remainders bottom-up)
- 91 ÷ 2 = 45 r **1**
- 45 ÷ 2 = 22 r **1**
- 22 ÷ 2 = 11 r **0**
- 11 ÷ 2 = 5 r **1**
- 5 ÷ 2 = 2 r **1**
- 2 ÷ 2 = 1 r **0**
- 1 ÷ 2 = 0 r **1** → read upwards: **1011011**
:::

## Binary ↔ hexadecimal: groups of 4 bits

Each hex digit = exactly 4 bits, so split the binary number into **nibbles from the right**.

:::example 01011011₂ → hexadecimal
0101 | 1011 → 5 | B → **5B₁₆**.
Back: 5B → 0101 1011.
:::

## Hexadecimal ↔ denary

:::example
- 5B₁₆ = 5 × 16 + 11 = 80 + 11 = **91₁₀**
- 183₁₀ = 11 × 16 + 7 → **B7₁₆** (183 ÷ 16 = 11 remainder 7)
:::

:::widget base_converter Try conversions yourself
:::

:::tip
Write the place values above the bits when converting — it prevents most mistakes and shows your **working**, which earns method marks.
:::

# Why hexadecimal is used
@lo 11.1.1.3

- **Shorter** and easier for humans to read and write than binary (one hex digit for every 4 bits).
- **Fewer errors** when copying long binary values.
- Converts to and from binary **very easily** (unlike denary).
- Used for: **memory addresses**, **colour codes** in HTML/CSS (`#FF8800`), **MAC addresses** (`3C:52:82:1A:9F:04`), error/debug codes and machine code listings.

:::warning
Hexadecimal is for **humans** — the computer still stores everything in binary. Hex does **not** use less memory.
:::

# Binary addition and multiplication
@lo 11.1.1.4

:::compare Rules of binary addition
| A + B (+ carry) | Sum bit | Carry |
|---|---|---|
| 0 + 0 | 0 | 0 |
| 0 + 1 | 1 | 0 |
| 1 + 1 | 0 | 1 |
| 1 + 1 + 1 | 1 | 1 |
:::

```text | 01011010 + 00111011 (carries: columns 2, 4, 5, 6 and 7 from the right)
          0 1 0 1 1 0 1 0   (90)
        + 0 0 1 1 1 0 1 1   (59)
        -----------------
          1 0 0 1 0 1 0 1   (149)
```

:::warning
**Overflow:** if the result needs more bits than are available (e.g. more than 8 bits for a byte), the extra carry is lost and the stored result is wrong. 11111111 + 00000001 in 8 bits gives 00000000 with a carry out.
:::

:::widget binary_addition Step through a binary addition
:::

## Binary multiplication

Multiply by each bit of the second number (shifted left), then add — exactly like long multiplication in denary, but each partial product is either 0 or the first number.

```text | 1011 × 101   (11 × 5 = 55)
        1 0 1 1
      ×   1 0 1
      ---------
        1 0 1 1      (1011 × 1)
      0 0 0 0        (1011 × 0, shifted 1)
    1 0 1 1          (1011 × 1, shifted 2)
    -----------
    1 1 0 1 1 1  = 55
```

:::tip
Multiplying by 2 in binary = **shift left one place** (add a 0 on the right). Multiplying by 4 = shift left two places.
:::
