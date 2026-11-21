---
summary: Binary addition with carries and overflow, binary multiplication by shift-and-add, representing negative integers in two's complement, subtraction by adding the two's complement, fixed-point binary fractions, and normalised floating-point numbers (mantissa and exponent) — converting in both directions, with range and precision.
---
# Binary addition
@lo 12.1.1.3

Everything a computer calculates — a shop total, the score in a game, the position of a character on the screen, the address of the next instruction — is worked out in **binary**. The part of the processor that does this work is the **arithmetic logic unit (ALU)**, and at its heart is a circuit called an **adder**. Before we can understand negative numbers, subtraction or fractions, we have to be able to add two binary numbers exactly the way the ALU does. The good news is that binary addition uses the same column method you learned for denary in primary school; there are simply fewer digits, so there are fewer rules to remember.

## The rules of binary addition

In denary you carry when a column adds up to 10 or more. In binary you carry when a column adds up to **2 or more**, because 2 in binary is written **10** — "one two and no ones". That gives only four situations that can happen in a column.

:::definition Sum bit and carry bit
When one column of a binary addition is added, the **sum bit** is the digit written in that column of the answer, and the **carry bit** is the 1 passed to the **next column on the left** when the column total is 2 or 3.
:::

:::compare Addition rules for one column
| Bits added | Total in denary | Sum bit | Carry to the next column |
|---|---|---|---|
| 0 + 0 | 0 | 0 | 0 |
| 0 + 1 or 1 + 0 | 1 | 1 | 0 |
| 1 + 1 | 2 = 10₂ | 0 | 1 |
| 1 + 1 + 1 (two bits and a carry in) | 3 = 11₂ | 1 | 1 |
:::

The last row is the one students forget. Once a carry has been produced, the next column may have to add **three** ones: the two bits of the numbers and the carry coming in from the right. Three in binary is 11, so you write **1** and carry **1**. A column can never total more than 3 when two numbers are added, so these four rows are all you ever need.

## The column method

:::steps Adding two binary numbers
- Write both numbers with the **same number of bits**, lined up on the **right** (add leading zeros if needed).
- Start with the **rightmost column** (the 1s column) and work **right to left**.
- In each column add the two bits **and any carry** coming in; write the sum bit underneath.
- If the column total is 2 or 3, write the **carry 1** at the top of the next column so it is not forgotten.
- After the leftmost column, check whether a carry is left over — if the answer must fit in a fixed number of bits, that carry means **overflow**.
- **Check** the answer by converting all three numbers to denary.
:::

Look at the addition 109 + 54 in 8 bits below. The first two columns produce no carry. In the 4s column 1 + 1 = 2, so we write 0 and carry 1. From then on almost every column receives a carry, and in the 32s column we have 1 + 1 + 1 = 3, so we write 1 and carry 1 again. The final answer, 10100011, is 128 + 32 + 2 + 1 = 163, which matches 109 + 54 in denary.

:::svg Column addition of 01101101 + 00110110 with carries
<svg class="bar1" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Column addition of 109 and 54 in 8 bits. Place values 128 to 1 across the top. A row of carries shows a carry of 1 into the 8s, 16s, 32s, 64s and 128s columns. 01101101 plus 00110110 equals 10100011, which is 163 in denary.">
  <style>
    svg.bar1 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar1 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bar1 .m{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.bar1 .c{font:700 15px ui-monospace,monospace;fill:var(--warning)}
    svg.bar1 .r{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.bar1 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bar1 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.bar1 .ln{stroke:var(--foreground);stroke-width:2}
  </style>
  <rect class="bx" x="270" y="40" width="340" height="170" rx="8"/>
  <rect class="ok" x="270" y="212" width="340" height="40" rx="8"/>
  <g class="s" text-anchor="middle">
    <text x="300" y="30">128</text><text x="340" y="30">64</text><text x="380" y="30">32</text><text x="420" y="30">16</text>
    <text x="460" y="30">8</text><text x="500" y="30">4</text><text x="540" y="30">2</text><text x="580" y="30">1</text>
  </g>
  <text class="h" x="40" y="80">carries</text>
  <g class="c" text-anchor="middle">
    <text x="300" y="80">1</text><text x="340" y="80">1</text><text x="380" y="80">1</text><text x="420" y="80">1</text><text x="460" y="80">1</text>
  </g>
  <text class="h" x="40" y="125">109</text>
  <g class="m" text-anchor="middle">
    <text x="300" y="125">0</text><text x="340" y="125">1</text><text x="380" y="125">1</text><text x="420" y="125">0</text>
    <text x="460" y="125">1</text><text x="500" y="125">1</text><text x="540" y="125">0</text><text x="580" y="125">1</text>
  </g>
  <text class="h" x="40" y="170">+ 54</text>
  <text class="m" x="250" y="170">+</text>
  <g class="m" text-anchor="middle">
    <text x="300" y="170">0</text><text x="340" y="170">0</text><text x="380" y="170">1</text><text x="420" y="170">1</text>
    <text x="460" y="170">0</text><text x="500" y="170">1</text><text x="540" y="170">1</text><text x="580" y="170">0</text>
  </g>
  <line class="ln" x1="280" y1="190" x2="600" y2="190"/>
  <text class="h" x="40" y="240">= 163</text>
  <g class="r" text-anchor="middle">
    <text x="300" y="240">1</text><text x="340" y="240">0</text><text x="380" y="240">1</text><text x="420" y="240">0</text>
    <text x="460" y="240">0</text><text x="500" y="240">0</text><text x="540" y="240">1</text><text x="580" y="240">1</text>
  </g>
  <text class="s" x="640" y="125">1 + 0 = 1</text>
  <text class="s" x="640" y="150">4s: 1 + 1 = 10</text>
  <text class="s" x="640" y="170">write 0, carry 1</text>
  <text class="s" x="640" y="200">32s: 1+1+1 = 11</text>
  <text class="s" x="640" y="220">write 1, carry 1</text>
  <text class="s" x="40" y="285">Check: 128 + 32 + 2 + 1 = 163 and 109 + 54 = 163 ✓</text>
</svg>
:::

```text | 01101101 + 00110110 written as a column sum (109 + 54 = 163)
  carry  1 1 1 1 1 0 0
         0 1 1 0 1 1 0 1     (109)
       + 0 0 1 1 0 1 1 0     ( 54)
         ---------------
         1 0 1 0 0 0 1 1     (163) ✓
```

## Adding three binary numbers

Exam questions sometimes ask you to add three numbers. You could add all three at once, but then a column can total 4 or 5 and you would need to carry **10** (two places). The safe method is to add the **first two numbers**, write down the result, and then add the **third number** to that result. Each of the two additions only ever uses the four rules above, so mistakes are much less likely.

:::example Worked example — adding three scores
A quiz app stores each round's score as a 4-bit number. A student scored **0101** (5), **0110** (6) and **0011** (3). Find the total in binary.

1. First addition: 0101 + 0110. 1s column: 1 + 0 = 1. 2s column: 0 + 1 = 1. 4s column: 1 + 1 = 10 → write 0, carry 1. 8s column: 0 + 0 + carry 1 = 1. Result **1011** (11).
2. Second addition: 1011 + 0011. 1s column: 1 + 1 = 10 → write 0, carry 1. 2s column: 1 + 1 + 1 = 11 → write 1, carry 1. 4s column: 0 + 0 + 1 = 1. 8s column: 1 + 0 = 1. Result **1110**.
3. Check in denary: 5 + 6 + 3 = 14 and 1110₂ = 8 + 4 + 2 = **14** ✓. The answer still fits in 4 bits, so there is no overflow.
:::

## Overflow

A real computer does not have an unlimited amount of paper. Numbers are held in **registers** and memory locations with a **fixed number of bits** — 8, 16, 32 or 64. If the answer to an addition needs more bits than the register has, the extra carry out of the leftmost column has nowhere to go and is lost.

:::definition Overflow
An error that happens when the result of a calculation is **too large to fit in the number of bits available**. The carry out of the most significant bit is lost, so the stored result is **wrong**.
:::

With 8 bits the largest unsigned value is 2⁸ − 1 = **255**. In the addition 170 + 185 below the true answer is 355, which needs nine bits. The register keeps only the lower eight bits, 01100011, which is **99** — a completely different number.

```text | 10101010 + 10111001 in 8 bits (170 + 185 = 355)
         1 0 1 0 1 0 1 0     (170)
       + 1 0 1 1 1 0 0 1     (185)
         ---------------
       1 0 1 1 0 0 0 1 1     → 9 bits: the 9th bit is an OVERFLOW
                             stored result 01100011 = 99 (wrong)
```

The same thing happens on a smaller scale with 4 bits: 1100 (12) + 0111 (7) = 10011 (19), but a 4-bit register can only hold 0 to 15, so it keeps **0011** = 3.

Why does overflow matter? Because the processor does not "know" the answer is wrong — it simply stores the bits it has. A program that adds money, counts sensor readings or calculates a position can produce a nonsense value and carry on using it. Famous software failures have been caused by a counter that overflowed and suddenly became a small number again. For this reason processors set an **overflow flag** (or carry flag) in the status register after an addition, and well-written programs check it, use more bits for values that might grow, or validate inputs so that the result cannot exceed the range.

:::widget binary_addition Practise binary addition
:::

# Binary multiplication
@lo 12.1.1.3

Multiplication in binary is easier than in denary, because there is no times table to remember. Every digit of the multiplier is either **0** or **1**, and multiplying by 0 gives 0 while multiplying by 1 gives the number itself. So a binary multiplication is really a series of **copies** of the first number, each **shifted** to the left, which are then **added** together. This is called **long multiplication** or the **shift-and-add** method, and it is exactly how simple processors multiply.

:::definition Partial product
One row of a long multiplication: the multiplicand multiplied by **one bit** of the multiplier, shifted left according to the position of that bit. The partial products are added to give the final product.
:::

:::steps Long multiplication (shift and add)
- Write the **multiplicand** (the first number) above the **multiplier** (the second number), lined up on the right.
- Take the **rightmost bit** of the multiplier. If it is **1**, copy the multiplicand; if it is **0**, write a row of zeros.
- Move to the next bit of the multiplier and write the next partial product **shifted one place to the left** (put a 0 in the empty place on the right).
- Repeat for every bit of the multiplier.
- **Add** all the partial products using binary addition (you can add them two at a time).
- **Check** by converting to denary.
:::

:::svg Shift-and-add multiplication of 1011 × 1101 (11 × 13 = 143)
<svg class="bar1" viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Long multiplication of 1011 by 1101. Partial products: 1011 for the rightmost multiplier bit 1, 0000 shifted one place for bit 0, 1011 shifted two places for bit 1, 1011 shifted three places for bit 1. Adding the partial products gives 10001111, which is 143.">
  <style>
    svg.bar1 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar1 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bar1 .m{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.bar1 .z{font:700 20px ui-monospace,monospace;fill:var(--muted)}
    svg.bar1 .p{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.bar1 .r{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.bar1 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.bar1 .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.bar1 .ln{stroke:var(--foreground);stroke-width:2}
  </style>
  <rect class="pb" x="250" y="108" width="340" height="150" rx="8"/>
  <rect class="ok" x="250" y="272" width="340" height="40" rx="8"/>
  <text class="h" x="30" y="50">multiplicand 11</text>
  <g class="m" text-anchor="middle"><text x="440" y="50">1</text><text x="480" y="50">0</text><text x="520" y="50">1</text><text x="560" y="50">1</text></g>
  <text class="h" x="30" y="85">multiplier 13</text>
  <text class="m" x="400" y="85" text-anchor="middle">×</text>
  <g class="m" text-anchor="middle"><text x="440" y="85">1</text><text x="480" y="85">1</text><text x="520" y="85">0</text><text x="560" y="85">1</text></g>
  <line class="ln" x1="260" y1="98" x2="580" y2="98"/>
  <g class="p" text-anchor="middle"><text x="440" y="135">1</text><text x="480" y="135">0</text><text x="520" y="135">1</text><text x="560" y="135">1</text></g>
  <g class="z" text-anchor="middle"><text x="400" y="170">0</text><text x="440" y="170">0</text><text x="480" y="170">0</text><text x="520" y="170">0</text><text x="560" y="170">0</text></g>
  <g class="p" text-anchor="middle"><text x="360" y="205">1</text><text x="400" y="205">0</text><text x="440" y="205">1</text><text x="480" y="205">1</text></g>
  <g class="z" text-anchor="middle"><text x="520" y="205">0</text><text x="560" y="205">0</text></g>
  <g class="p" text-anchor="middle"><text x="320" y="240">1</text><text x="360" y="240">0</text><text x="400" y="240">1</text><text x="440" y="240">1</text></g>
  <g class="z" text-anchor="middle"><text x="480" y="240">0</text><text x="520" y="240">0</text><text x="560" y="240">0</text></g>
  <text class="s" x="610" y="135">bit 1 → copy (11)</text>
  <text class="s" x="610" y="170">bit 0 → zeros</text>
  <text class="s" x="610" y="205">bit 1 → shift 2 (44)</text>
  <text class="s" x="610" y="240">bit 1 → shift 3 (88)</text>
  <text class="h" x="30" y="170">partial products</text>
  <text class="s" x="30" y="190">grey 0s fill the</text>
  <text class="s" x="30" y="206">shifted places</text>
  <line class="ln" x1="260" y1="262" x2="580" y2="262"/>
  <text class="h" x="30" y="298">product 143</text>
  <g class="r" text-anchor="middle"><text x="280" y="298">1</text><text x="320" y="298">0</text><text x="360" y="298">0</text><text x="400" y="298">0</text><text x="440" y="298">1</text><text x="480" y="298">1</text><text x="520" y="298">1</text><text x="560" y="298">1</text></g>
  <text class="s" x="610" y="298">11 + 44 + 88 = 143</text>
</svg>
:::

:::example Worked example — 1011 × 1101
A robotics club multiplies a motor speed of **1011** (11) by a gear factor of **1101** (13).

1. Rightmost multiplier bit is 1 → partial product **1011** (11).
2. Next bit is 0 → partial product **00000** (zeros, shifted one place).
3. Next bit is 1 → **101100** (1011 shifted two places = 44).
4. Leftmost bit is 1 → **1011000** (1011 shifted three places = 88).
5. Add: 1011 + 101100 = 110111 (55); then 110111 + 1011000 = **10001111**.
6. Check: 10001111₂ = 128 + 8 + 4 + 2 + 1 = **143**, and 11 × 13 = 143 ✓.
:::

Two more short examples show that the method always works the same way:

```text | 1101 × 110 (13 × 6 = 78)
            1 1 0 1
          ×   1 1 0
          ---------
            0 0 0 0      × 0
          1 1 0 1        × 1, shifted 1 place
        1 1 0 1          × 1, shifted 2 places
        -----------
        1 0 0 1 1 1 0  = 78 ✓
```

```text | 1011 × 101 (11 × 5 = 55)
            1 0 1 1
          ×   1 0 1
          ---------
            1 0 1 1      × 1
          0 0 0 0        × 0, shifted 1
        1 0 1 1          × 1, shifted 2
        -----------
        1 1 0 1 1 1    = 55 ✓
```

## Shifting left multiplies by 2

Each time the multiplicand moves one place left, every bit moves into a column worth **twice** as much, so the value doubles. That is why a **logical shift left** by one place multiplies an unsigned number by 2, a shift of two places multiplies by 4, and a shift of three places by 8. A shift right does the opposite and divides by 2 (losing any remainder). For example, 00010110 (22) shifted left two places becomes 01011000 (88) = 22 × 4. Processors use shifts because they are much **faster** than a general multiplication: multiplying by a power of 2 needs no adding at all. Long multiplication is simply "one shift for every bit position, and an add for every 1 in the multiplier".

:::definition Logical shift
An operation that moves **all bits** of a binary number a given number of places **left or right**, filling the empty places with **0**. A shift left by *n* places multiplies an unsigned number by **2ⁿ**; bits shifted out of the register are lost.
:::

:::compare Ways to multiply in binary
| Method | How it works | When to use it | Watch out for |
|---|---|---|---|
| **Long multiplication (shift and add)** | One partial product per multiplier bit, shifted, then added | Any two binary numbers | Forgetting to shift a row, or skipping the zero row's place |
| **Shift left only** | Move every bit *n* places left | Multiplying by 2, 4, 8, 16 … (powers of 2) | Bits shifted out of the register are lost (overflow) |
| **Shift and add combined** | Split the multiplier into powers of 2: × 6 = × 4 + × 2 | Small constant multipliers in programs | Adding the right shifted copies |
| **Convert to denary and back** | Multiply in denary, convert the answer | Only to **check** an answer | Exams want the binary method shown |
:::

## How many bits does the answer need?

When you add two *n*-bit numbers the answer needs at most *n* + 1 bits. Multiplication grows much faster: multiplying an *n*-bit number by an *m*-bit number can give an answer of up to **n + m bits**. The largest 4-bit number is 15, and 15 × 15 = 225 = 11100001, which needs 8 = 4 + 4 bits. This is why processors often store the product of two 32-bit registers in a 64-bit result (two registers). If a product is forced back into the original number of bits, overflow is very likely. In an exam, always write the full product and then comment on whether it fits the stated register size.

To **check** a multiplication, convert the two numbers and the product to denary. A quick sanity check is also possible without converting: the product must be at least as large as the multiplicand shifted by the position of the multiplier's leftmost 1. For 1011 × 1101 the leftmost multiplier bit is worth 8, so the answer must be at least 1011000 (88) — and 143 is.

# Two's complement
@lo 12.1.1.4

So far every number has been **unsigned**: all bits had positive place values, and 8 bits held 0 to 255. Real programs need negative numbers too — a temperature of −12 °C in Astana in winter, a bank balance below zero, a change in score of −5. A computer has no "minus sign" symbol; it only has bits. So we need a rule that says which bit patterns stand for negative values. Over the years three main rules have been used, and the one used by practically every modern processor is **two's complement**.

:::definition Signed integer
A whole number that can be **positive or negative**. In binary, a signed representation uses the bits (usually the most significant bit) to show the sign as well as the size of the number.
:::

## Three ways to represent negative numbers

In **sign and magnitude**, the leftmost bit is a sign bit (0 = positive, 1 = negative) and the other bits give the size, so +5 = 00000101 and −5 = 10000101. It is easy for people to read, but it has two zeros (00000000 = +0 and 10000000 = −0), and an ordinary adder gives wrong answers: 00000101 + 10000101 = 10001010, which would mean −10, not 0. In **one's complement**, a negative number is made by inverting every bit of the positive number, so −5 = 11111010. It still has two zeros (00000000 and 11111111) and needs an extra "end-around carry" correction when adding. **Two's complement** fixes both problems.

:::compare Sign and magnitude vs one's complement vs two's complement (8 bits)
| | Sign and magnitude | One's complement | Two's complement |
|---|---|---|---|
| How −5 is made | Set the sign bit: **10000101** | Invert all bits of +5: **11111010** | Invert all bits and add 1: **11111011** |
| Meaning of the MSB | Sign only (no value) | Sign (value −127) | Place value **−128** |
| Zeros | Two: +0 and −0 | Two: 00000000 and 11111111 | **One**: 00000000 |
| Range in 8 bits | −127 to +127 | −127 to +127 | **−128 to +127** |
| Adding with an ordinary adder | Gives wrong results for mixed signs | Needs an end-around carry | **Works directly**; discard the final carry |
| Used today | Floating-point sign bit | Rarely (some checksums) | **Integers in almost all CPUs** |
:::

## The negative place value of the MSB

The simplest way to understand two's complement is to see it as an ordinary place-value system in which **the most significant bit has a negative place value**. In 8 bits the columns are −128, 64, 32, 16, 8, 4, 2, 1. A number that starts with **0** has no −128, so it is positive and reads exactly like unsigned binary. A number that starts with **1** includes −128, and because the other seven bits can add up to at most 127, the total is always negative.

:::definition Two's complement
A way to represent **signed integers** in binary in which the **most significant bit (MSB)** has a **negative place value** (−2ⁿ⁻¹, which is −128 in 8 bits) and all other bits have their usual positive values. A number starting with **0** is positive; a number starting with **1** is negative.
:::

:::compare 8-bit two's complement place values
| −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
:::

So 10110001 = −128 + 32 + 16 + 1 = **−79**. The same byte read as an **unsigned** integer is 128 + 32 + 16 + 1 = **177**. The bits are identical; only the agreed meaning differs. That is why an exam question always tells you whether a number is unsigned or in two's complement — you cannot tell from the bits alone.

:::svg The same 4-bit patterns read as unsigned and as two's complement
<svg class="bar1" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sixteen 4-bit patterns from 0000 to 1111. Read as unsigned they mean 0 to 15. Read as two's complement, 0000 to 0111 mean 0 to 7 and 1000 to 1111 mean minus 8 to minus 1. Patterns starting with 1 are negative.">
  <style>
    svg.bar1 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar1 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bar1 .b{font:12px ui-monospace,monospace;fill:var(--foreground)}
    svg.bar1 .v{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar1 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.bar1 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1}
    svg.bar1 .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1}
  </style>
  <text class="h" x="10" y="22">Pattern, unsigned value and two's complement value (4 bits)</text>
  <g class="s"><text x="10" y="62">bits</text><text x="10" y="112">unsigned</text><text x="10" y="162">two's c.</text></g>
  <g>
    <rect class="bx" x="80" y="45" width="40" height="26"/><rect class="bx" x="122" y="45" width="40" height="26"/><rect class="bx" x="164" y="45" width="40" height="26"/><rect class="bx" x="206" y="45" width="40" height="26"/>
    <rect class="bx" x="248" y="45" width="40" height="26"/><rect class="bx" x="290" y="45" width="40" height="26"/><rect class="bx" x="332" y="45" width="40" height="26"/><rect class="bx" x="374" y="45" width="40" height="26"/>
    <rect class="bx" x="416" y="45" width="40" height="26"/><rect class="bx" x="458" y="45" width="40" height="26"/><rect class="bx" x="500" y="45" width="40" height="26"/><rect class="bx" x="542" y="45" width="40" height="26"/>
    <rect class="bx" x="584" y="45" width="40" height="26"/><rect class="bx" x="626" y="45" width="40" height="26"/><rect class="bx" x="668" y="45" width="40" height="26"/><rect class="bx" x="710" y="45" width="40" height="26"/>
  </g>
  <g class="b" text-anchor="middle">
    <text x="100" y="63">0000</text><text x="142" y="63">0001</text><text x="184" y="63">0010</text><text x="226" y="63">0011</text>
    <text x="268" y="63">0100</text><text x="310" y="63">0101</text><text x="352" y="63">0110</text><text x="394" y="63">0111</text>
    <text x="436" y="63">1000</text><text x="478" y="63">1001</text><text x="520" y="63">1010</text><text x="562" y="63">1011</text>
    <text x="604" y="63">1100</text><text x="646" y="63">1101</text><text x="688" y="63">1110</text><text x="730" y="63">1111</text>
  </g>
  <g class="v" text-anchor="middle">
    <text x="100" y="112">0</text><text x="142" y="112">1</text><text x="184" y="112">2</text><text x="226" y="112">3</text>
    <text x="268" y="112">4</text><text x="310" y="112">5</text><text x="352" y="112">6</text><text x="394" y="112">7</text>
    <text x="436" y="112">8</text><text x="478" y="112">9</text><text x="520" y="112">10</text><text x="562" y="112">11</text>
    <text x="604" y="112">12</text><text x="646" y="112">13</text><text x="688" y="112">14</text><text x="730" y="112">15</text>
  </g>
  <rect class="ok" x="80" y="142" width="334" height="30" rx="4"/>
  <rect class="no" x="416" y="142" width="334" height="30" rx="4"/>
  <g class="v" text-anchor="middle">
    <text x="100" y="162">0</text><text x="142" y="162">1</text><text x="184" y="162">2</text><text x="226" y="162">3</text>
    <text x="268" y="162">4</text><text x="310" y="162">5</text><text x="352" y="162">6</text><text x="394" y="162">7</text>
    <text x="436" y="162">−8</text><text x="478" y="162">−7</text><text x="520" y="162">−6</text><text x="562" y="162">−5</text>
    <text x="604" y="162">−4</text><text x="646" y="162">−3</text><text x="688" y="162">−2</text><text x="730" y="162">−1</text>
  </g>
  <text class="s" x="247" y="200" text-anchor="middle">MSB = 0 → positive, reads like unsigned</text>
  <text class="s" x="583" y="200" text-anchor="middle">MSB = 1 → negative: −8 + the other bits</text>
  <text class="s" x="583" y="220" text-anchor="middle">unsigned value − 16 = two's complement value</text>
</svg>
:::

## Converting denary to two's complement

For a **positive** number there is nothing new: write it in binary with the required number of bits, making sure the MSB is 0. For a **negative** number there are two reliable methods.

:::steps Method 1 — invert and add 1 (e.g. −45 in 8 bits)
- Write the **positive** number in binary with the required number of bits: +45 = **00101101**.
- **Invert** every bit (0 → 1, 1 → 0) — this is the one's complement: **11010010**.
- **Add 1**: **11010011** → this is −45.
- Check with place values: −128 + 64 + 16 + 2 + 1 = −45 ✓
:::

**Method 2 — use the negative place value.** Start with −128 and work out what must be added to reach the number. For −45: −128 + 83 = −45, so the remaining seven bits must hold 83 = 1010011. Put a 1 in the −128 column in front: **11010011**. Both methods always give the same answer, so you can use one to check the other.

:::tip Shortcut
Copy the bits from the **right** up to and including the **first 1**, then **invert** all the bits to its left: 00101101 → keep "1" → invert the rest → 11010011.
:::

## Converting two's complement to denary

If the MSB is 0, convert as normal. If the MSB is 1, either **add the place values** including −128, or **invert and add 1** to get the positive size and then put a minus sign in front. For 11010011: −128 + 64 + 16 + 2 + 1 = −45; or invert to 00101100, add 1 to get 00101101 = 45, so the value is −45. Note that inverting and adding 1 works in **both directions** — applying it twice gives back the original number.

:::example Worked examples — 8-bit two's complement
| Denary | Positive in binary | Invert | +1 → two's complement |
|---|---|---|---|
| −15 | 00001111 | 11110000 | **11110001** |
| −56 | 00111000 | 11000111 | **11001000** |
| −100 | 01100100 | 10011011 | **10011100** |

Two's complement → denary: 11100110 = −128 + 64 + 32 + 4 + 2 = **−26**; 10011011 = −128 + 16 + 8 + 2 + 1 = **−101**; 10000000 = **−128** (the most negative 8-bit value); 11111111 = −128 + 127 = **−1**.
:::

## Range in n bits

Because the MSB is worth −2ⁿ⁻¹, the most negative value is 1 followed by zeros (−2ⁿ⁻¹), and the most positive value is 0 followed by ones (2ⁿ⁻¹ − 1). The range is **not symmetrical**: there is one more negative value than positive values, because zero takes one of the "positive" patterns. The total number of values is still 2ⁿ, the same as unsigned.

:::compare Unsigned and two's complement ranges
| Bits | Unsigned range | Two's complement range | Number of values |
|---|---|---|---|
| 4 | 0 to 15 | **−8 to +7** | 16 |
| 8 | 0 to 255 | **−128 to +127** | 256 |
| 16 | 0 to 65 535 | **−32 768 to +32 767** | 65 536 |
| *n* | 0 to 2ⁿ − 1 | **−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1** | 2ⁿ |
:::

So +128 **cannot** be stored in 8-bit two's complement (the maximum is +127), and −129 cannot either. If a question asks for a number outside the range, the correct answer is to say that it cannot be represented and give the range as the reason.

## Why computers use two's complement

There are two main reasons, and both are common exam answers. First, there is **only one representation of zero** (00000000), so no bit pattern is wasted and comparisons with zero are simple. Second, positive and negative numbers can be **added with the same ordinary binary adder** used for unsigned numbers, and **subtraction becomes addition** of a negative number. The processor therefore does not need a separate subtraction circuit or special rules for signs, which makes the ALU simpler, cheaper and faster.

## Sign extension

Sometimes a number must be moved into a larger register, for example from 4 bits to 8 bits. For unsigned numbers you add zeros on the left. In two's complement you must **copy the sign bit** into all the new places — this is **sign extension**. −5 in 4 bits is 1011 (−8 + 2 + 1); in 8 bits it becomes **11111011** (−128 + 64 + 32 + 16 + 8 + 2 + 1 = −5). Padding with zeros instead would give 00001011 = +11, a different number. Positive numbers are extended with zeros (0101 → 00000101), which is also "copying the sign bit".

:::widget twos_complement Explore two's complement
:::

# Subtraction using two's complement
@lo 12.1.1.5

Subtracting in binary with borrowing is possible, but it is slow and easy to get wrong. Processors use a neater idea: **subtracting a number is the same as adding its negative**. To work out A − B, the computer finds the two's complement of B (that is, −B) and **adds** it to A. The only extra rule is that a carry out of the most significant bit is **ignored** (discarded). In this way one adder circuit handles addition and subtraction.

:::definition Two's complement subtraction
A method of calculating **A − B** by **adding A and the two's complement of B** (A + (−B)) using ordinary binary addition, and **discarding any carry** out of the most significant bit. The result is in two's complement form.
:::

:::steps Subtracting A − B with two's complement
- Write **A** and **B** in binary with the **same number of bits** (e.g. 8).
- Find **−B**: invert all the bits of B and add 1.
- **Add** A + (−B) column by column.
- **Discard** any carry out of the leftmost bit — the answer has the same number of bits as A and B.
- Read the answer: MSB 0 → positive; MSB 1 → negative (convert with −128 or invert-and-add-1).
- Check in denary, and check for overflow.
:::

:::mermaid How the ALU calculates A − B
flowchart LR
  A[A in n bits] --> ADD((binary adder))
  B[B in n bits] --> INV[invert every bit] --> PLUS1[add 1] --> NEG[−B] --> ADD
  ADD --> RES[n-bit result]
  ADD -.-> C[carry out of MSB: discard]
:::

Here are two subtractions with positive answers. In both, the addition produces a ninth bit, which is thrown away.

```text | 73 − 39 in 8 bits (01001001 − 00100111)
 39 = 0010 0111 → invert 1101 1000 → +1 → 1101 1001  (−39)

   0100 1001   (73)
 + 1101 1001   (−39)
 -----------
 1 0010 0010   → discard the carry → 0010 0010 = 34 ✓
```

```text | 23 − 14 in 8 bits
 14 = 0000 1110 → invert 1111 0001 → +1 → 1111 0010  (−14)

   0001 0111   (23)
 + 1111 0010   (−14)
 -----------
 1 0000 1001   → discard the carry → 0000 1001 = 9 ✓
```

Why is it safe to discard the carry? In 8 bits, adding −B is the same as adding 256 − B (the unsigned value of the pattern). So A + (−B) = A − B + 256, and the extra 256 is exactly the ninth bit. Throwing it away leaves A − B. This is not overflow — the final carry in a subtraction is expected.

## Negative answers

If B is larger than A, the answer is negative. There is usually **no** carry out, and the result starts with a 1. Read it as a two's complement number.

:::example Worked example — temperature change 58 − 91
A weather station in Kostanay stores temperatures in tenths of a degree as 8-bit two's complement integers. It calculates the change 58 − 91.

1. A = 58 = **00111010**; B = 91 = **01011011**.
2. −B: invert 01011011 → 10100100, add 1 → **10100101** (check: −128 + 32 + 4 + 1 = −91 ✓).
3. Add: 00111010 + 10100101 = **11011111**. No carry out of the MSB.
4. MSB is 1, so the answer is negative: −128 + 64 + 16 + 8 + 4 + 2 + 1 = **−33**.
5. Check: 58 − 91 = −33 ✓. Both inputs were in range and the result −33 is within −128 to +127, so there is no overflow.
:::

```text | 20 − 45 — another negative answer
 45 = 0010 1101 → −45 = 1101 0011

   0001 0100   (20)
 + 1101 0011   (−45)
 -----------
   1110 0111   → MSB is 1, so negative: −128 + 64 + 32 + 4 + 2 + 1 = −25 ✓
```

:::example Worked example — 112 − 37 with the final carry
1. A = 112 = **01110000**; B = 37 = **00100101**.
2. −37: invert → 11011010, add 1 → **11011011**.
3. Add: 01110000 + 11011011 = **1 01001011** (nine bits).
4. Discard the ninth bit → **01001011** = 64 + 8 + 2 + 1 = **75**.
5. Check: 112 − 37 = 75 ✓.
:::

## Overflow in signed arithmetic

Two's complement arithmetic can also overflow, when the true answer is outside −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1. With signed numbers the **carry out of the MSB is not the sign of overflow** — it is discarded in normal subtraction. Instead use this rule: **overflow happens when two numbers with the same sign are added and the result has the opposite sign.** Adding a positive and a negative number can never overflow, because the answer always lies between them.

- Positive + positive: 100 + 50 = 01100100 + 00110010 = **10010110**, which reads as **−106**. The real answer 150 is larger than +127.
- Negative + negative: (−100) + (−50) = 10011100 + 11001110 = 1 01101010 → after discarding the carry **01101010** = **+106**. The real answer −150 is below −128.

:::compare Carry and overflow
| Situation | Carry out of the MSB | What it means |
|---|---|---|
| Unsigned addition, answer > 2ⁿ − 1 | Yes | **Overflow** — the result is wrong |
| Two's complement subtraction (A + (−B)), answer in range | Often yes | **Normal** — discard the carry |
| Two's complement: two positives give a negative result | No | **Overflow** — answer above 2ⁿ⁻¹ − 1 |
| Two's complement: two negatives give a positive result | Yes | **Overflow** — answer below −2ⁿ⁻¹ |
| Positive + negative | Either | **Never overflow** |
:::

:::warning Common mistakes in binary arithmetic
- Forgetting the **1 + 1 + 1 = 11** rule (write 1, carry 1) when a carry comes into a column of two 1s.
- Not **shifting** the partial products in long multiplication, or leaving out the row for a 0 bit so the later rows are shifted too little.
- Finding the two's complement of the wrong number — in A − B you negate **B**, not A.
- Inverting the bits but **forgetting to add 1** (that gives one's complement, which is off by one).
- Using different numbers of bits for A and B, or not padding a small positive number with leading zeros before inverting.
- Keeping the ninth bit in the answer of a two's complement subtraction instead of discarding it — or calling that carry "overflow".
- Reading a negative two's complement result as unsigned (11011111 is −33, not 223).
- Saying 8-bit two's complement goes from −127 or −128 to +128: the range is **−128 to +127**.
:::

# Exam practice: binary arithmetic and two's complement
@lo 12.1.1.3, 12.1.1.4, 12.1.1.5

:::example Exam-style questions with model answers
**Q: Add the unsigned binary numbers 01011011 and 00101110. Show your working and give the answer in binary. [2]**
Column addition with carries shown (1); **10001001₂** (= 137 = 91 + 46) (1).

**Q: Multiply 1110 by 101. Show your working. [3]**
Partial products 1110, 0000 shifted one place, 1110 shifted two places (111000) (1); added: 1110 + 111000 (1); = **1000110₂** (= 70 = 14 × 5) (1).

**Q: Represent −83 as an 8-bit two's complement integer. Show your working. [2]**
+83 = 01010011, invert → 10101100 (1); add 1 → **10101101** (1).

**Q: The byte 11001010 is a two's complement integer. Convert it to denary. [2]**
MSB worth −128: −128 + 64 + 8 + 2 (1) = **−54** (1).

**Q: Use two's complement to calculate 45 − 76 in 8 bits. Show your working. [4]**
45 = 00101101 and 76 = 01001100 (1); −76: invert 10110011, add 1 → 10110100 (1); 00101101 + 10110100 = **11100001** (1); MSB is 1 so negative: −128 + 64 + 32 + 1 = **−31** (1).

**Q: A program adds 01110000 and 00110000, two 8-bit two's complement numbers. Explain why the result is incorrect. [3]**
The result is 10100000, which is −96 (1); the true answer 112 + 48 = 160 is greater than +127, the largest 8-bit two's complement value (1); two positive numbers gave a negative result, so **overflow** has occurred (1).

**Q: Give two reasons why computers use two's complement rather than sign and magnitude. [2]**
There is only **one representation of zero** (1); positive and negative numbers can be added with the **same adder**, so subtraction is done by addition / no separate subtractor is needed (1).
:::

:::warning Common mistakes in exam answers
- Giving only the final answer when the question says **"show your working"** — show the carries, the partial products, the inverted number and the +1.
- Writing the two's complement answer with too few bits (e.g. 1010011 instead of 10101101).
- In subtraction, forgetting to say that the **carry is discarded**.
- Explaining overflow as "the number is too big" without giving the **range** (largest value) of the number of bits.
:::

:::steps Check yourself
- State the result and carry for 1 + 1 and for 1 + 1 + 1.
- Add 01101101 and 00110110 and check in denary.
- Multiply 1011 by 1101 with shift and add.
- What does a logical shift left by 3 places do to an unsigned number?
- Write −56 and −100 in 8-bit two's complement.
- Convert 10011011 (two's complement) to denary.
- State the range of 4-bit, 8-bit and 16-bit two's complement integers.
- Calculate 58 − 91 using two's complement.
- When does overflow occur in two's complement addition?
:::

# Fixed-point binary fractions
@lo 12.1.1.6

In Lesson 1 every binary number was a **whole number** (an integer). Real programs also need numbers such as 3.75 kg, 36.6 °C or 0.125 seconds. A computer still has only bits, 0 and 1, so it needs a rule for storing the part of a number **after the point**. This lesson explains the two rules used by computers: **fixed point**, which is simple and fast, and **floating point**, which can store very large and very small numbers. Both build on the place-value idea you already know and on two's complement from Lesson 1.

## The binary point and fractional place values

In denary, the places to the right of the decimal point are worth tenths, hundredths and thousandths: in 2.75 the 7 means 7 × 0.1 and the 5 means 5 × 0.01. Each place is the place on its left **divided by ten**. Binary works in exactly the same way, except that each place is the one on its left **divided by two**. To the left of the **binary point** the places are 1, 2, 4, 8 …; to the right they are **½, ¼, ⅛, 1/16** … which are 0.5, 0.25, 0.125, 0.0625 and so on. So 10.11₂ means 2 + 0.5 + 0.25 = 2.75.

:::definition Binary point
The point that separates the **integer part** of a binary number from its **fractional part**. Places to its left are worth 1, 2, 4, 8 …; places to its right are worth ½, ¼, ⅛, 1/16 … (each place is half of the place on its left).
:::

:::definition Fixed-point representation
A way of storing fractional numbers in which a **fixed number of bits** is used for the **integer part** and a fixed number for the **fractional part**, so the **binary point is always in the same position**. The position of the point is not stored; the program or hardware simply knows where it is.
:::

The important word is **fixed**. If a system uses one byte with **4 integer bits and 4 fraction bits** (often written "4.4"), then the byte 01101010 is always read as 0110.1010. Nothing inside the byte shows the point; the meaning comes from an agreement. The same byte read as 5 integer bits and 3 fraction bits (10110.001 for 10110001) has a different value, so an exam question always tells you how many bits are on each side of the point.

:::svg Place values of an 8-bit fixed-point number with 4 integer and 4 fraction bits
<svg class="bar2" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eight boxes holding the bits 0 1 1 0 . 1 0 1 0. Above them the place values 8, 4, 2, 1 to the left of the binary point and 0.5, 0.25, 0.125, 0.0625 to the right. The 1 bits are under 4, 2, 0.5 and 0.125, which add up to 6.625.">
  <style>
    svg.bar2 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar2 .t{font:14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar2 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bar2 .b{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.bar2 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bar2 .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.bar2 .fr{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.bar2 .pt{fill:var(--danger)}
    svg.bar2 .ln{stroke:var(--muted);stroke-width:1.5;fill:none}
  </style>
  <text class="h" x="210" y="26" text-anchor="middle">Integer part (4 bits)</text>
  <text class="h" x="560" y="26" text-anchor="middle">Fraction part (4 bits)</text>
  <text class="t" x="90" y="60" text-anchor="middle">8</text>
  <text class="t" x="170" y="60" text-anchor="middle">4</text>
  <text class="t" x="250" y="60" text-anchor="middle">2</text>
  <text class="t" x="330" y="60" text-anchor="middle">1</text>
  <text class="t" x="440" y="60" text-anchor="middle">0.5</text>
  <text class="t" x="520" y="60" text-anchor="middle">0.25</text>
  <text class="t" x="600" y="60" text-anchor="middle">0.125</text>
  <text class="t" x="680" y="60" text-anchor="middle">0.0625</text>
  <rect class="bx" x="60" y="72" width="60" height="50" rx="6"/>
  <rect class="on" x="140" y="72" width="60" height="50" rx="6"/>
  <rect class="on" x="220" y="72" width="60" height="50" rx="6"/>
  <rect class="bx" x="300" y="72" width="60" height="50" rx="6"/>
  <rect class="fr" x="410" y="72" width="60" height="50" rx="6"/>
  <rect class="bx" x="490" y="72" width="60" height="50" rx="6"/>
  <rect class="fr" x="570" y="72" width="60" height="50" rx="6"/>
  <rect class="bx" x="650" y="72" width="60" height="50" rx="6"/>
  <text class="b" x="90" y="104" text-anchor="middle">0</text>
  <text class="b" x="170" y="104" text-anchor="middle">1</text>
  <text class="b" x="250" y="104" text-anchor="middle">1</text>
  <text class="b" x="330" y="104" text-anchor="middle">0</text>
  <circle class="pt" cx="385" cy="112" r="6"/>
  <text class="s" x="385" y="142" text-anchor="middle">binary point</text>
  <text class="b" x="440" y="104" text-anchor="middle">1</text>
  <text class="b" x="520" y="104" text-anchor="middle">0</text>
  <text class="b" x="600" y="104" text-anchor="middle">1</text>
  <text class="b" x="680" y="104" text-anchor="middle">0</text>
  <path class="ln" d="M60 170 H710"/>
  <text class="t" x="380" y="198" text-anchor="middle">Value = 4 + 2 + 0.5 + 0.125 = 6.625</text>
  <text class="s" x="380" y="228" text-anchor="middle">The point is not stored: the system always reads this byte as 4 bits . 4 bits</text>
</svg>
:::

## Fixed point to denary

To convert a fixed-point number to denary, write the place values above the bits, remembering that the places after the point are fractions, and add the values under every 1. This is the same method as for integers in the previous topic; only the extra places are new.

:::example Fixed point → denary
**(a) 0110.1010 (4 integer, 4 fraction bits).** Integer part 0110 = 4 + 2 = 6. Fraction part .1010 = 0.5 + 0.125 = 0.625. Answer **6.625**.

**(b) The byte 10110001 with 5 integer bits and 3 fraction bits.** Split it: 10110.001. Integer part 10110 = 16 + 4 + 2 = 22. Fraction .001 = 0.125. Answer **22.125**.

**(c) 0101.1100 (4.4).** 4 + 1 + 0.5 + 0.25 = **5.75**.
:::

## Denary to fixed point

Converting the other way is done in two halves. The **integer part** is converted exactly as before (subtract place values or divide repeatedly by 2). The **fractional part** is converted by **repeated multiplication by 2**: multiply the fraction by 2; the digit in front of the point (0 or 1) is the next bit after the binary point; keep only the fractional part and repeat. Stop when the fraction becomes 0 or when you have filled all the fraction bits. The bits are read **from top to bottom** — the first multiplication gives the ½ bit, the second the ¼ bit, and so on. (This is the opposite order to repeated division, where remainders are read bottom up.)

Why does it work? Multiplying a fraction by 2 moves the binary point one place to the right, so the bit that was in the ½ place jumps in front of the point where we can see it. A subtraction method also works: 0.375 is less than 0.5, so the ½ bit is 0; 0.375 ≥ 0.25 so the ¼ bit is 1, leaving 0.125; 0.125 ≥ 0.125 so the ⅛ bit is 1, leaving 0.

:::steps Denary → fixed point: 9.375 with 4 integer and 4 fraction bits
- Integer part: 9 = 8 + 1 → **1001**.
- Fraction 0.375 × 2 = **0**.75 → first fraction bit 0.
- 0.75 × 2 = **1**.5 → second bit 1; keep 0.5.
- 0.5 × 2 = **1**.0 → third bit 1; the fraction is now 0, so stop.
- Fraction bits read top to bottom: .011; pad to 4 bits → **.0110**.
- Answer: **1001.0110** (check: 8 + 1 + 0.25 + 0.125 = 9.375).
:::

## Fractions that cannot be stored exactly

A binary fraction can only be a sum of halves, quarters, eighths and so on. Numbers like 0.5, 0.75 or 0.375 are such sums and are stored exactly. Many ordinary denary fractions are **not**. Try 0.1: 0.1 × 2 = 0.2 → 0; 0.4 → 0; 0.8 → 0; 1.6 → 1; 1.2 → 1; 0.4 → 0; 0.8 → 0; 1.6 → 1 … and the pattern 0011 repeats forever. In binary, 0.1 is a **recurring fraction**, just as ⅓ = 0.333… is in denary. With 8 fraction bits the computer stores 0.00011001₂ = **0.09765625**, not 0.1. The difference, 0.00234375, is a **rounding error** (strictly a truncation error here, because the extra bits were simply cut off).

:::definition Rounding error
The difference between a number and the value actually stored, caused when a number **needs more bits than are available** (or has a recurring binary fraction) and so has to be **rounded or truncated** to the nearest value that can be stored.
:::

Rounding errors matter because they **add up**. If a program adds 0.1 ten times, the total is not exactly 1. A famous everyday consequence is that in many programming languages `0.1 + 0.2 == 0.3` is false. This is why banks and shops often store money as a whole number of tiyn or cents (an integer) instead of a fraction of tenge — integers are exact.

## Range and precision in fixed point

Two words appear in almost every exam question about real numbers.

:::definition Range
The span between the **smallest and largest values** that can be represented with a given number of bits and format.
:::

:::definition Precision
How **accurately** a number can be represented — in fixed point, the size of the **smallest step** between two values that can be stored (the value of the last fraction bit).
:::

In an 8-bit unsigned 4.4 format the largest value is 1111.1111 = 15.9375 and the step between values is 1/16 = 0.0625. If we move the point to make a 6.2 format, the largest value becomes 111111.11 = 63.75 (more **range**) but the step becomes 0.25 (less **precision**). With a fixed number of bits you cannot have both: **every bit given to the integer part increases range and every bit given to the fraction part increases precision**. This trade-off is the main weakness of fixed point and the reason floating point was invented.

:::compare Same 8 bits, different position of the point (unsigned)
| Format | Largest value | Smallest step (precision) | Can store 40.5? | Can store 2.0625? |
|---|---|---|---|---|
| 6 integer . 2 fraction | 111111.11 = 63.75 | 0.25 | Yes (101000.10) | No — rounded to 2.0 |
| 4 integer . 4 fraction | 1111.1111 = 15.9375 | 0.0625 | No — too large | Yes (0010.0001) |
| 2 integer . 6 fraction | 11.111111 = 3.984375 | 0.015625 | No | Yes (10.000100) |
:::

## Negative fixed-point numbers in two's complement

Fixed point can store negative numbers using two's complement, exactly as in Lesson 1. The most significant bit has a **negative place value**. In an 8-bit 4.4 format the place values become **−8, 4, 2, 1 . ½, ¼, ⅛, 1/16**. A number starting with 1 is negative; one starting with 0 is positive. The range of a signed 4.4 number is from 1000.0000 = −8 to 0111.1111 = 7.9375.

There are two ways to read a negative value. **Method 1:** add the place values with the MSB counted as −8: 1110.1000 = −8 + 4 + 2 + 0.5 = **−1.5**. **Method 2:** take the two's complement of the whole pattern (invert all bits, add 1 to the **last** bit, which is the 1/16 place) to get the positive value, then put a minus sign in front. To **store** a negative value, write the positive value in fixed point, then invert every bit and add 1 to the rightmost bit — the binary point does not change anything in the method.

:::example Signed fixed point: storing −2.75 and −3.25 in 8 bits (4.4, two's complement)
**−2.75.** +2.75 = 2 + 0.5 + 0.25 → **0010.1100**. Invert every bit → 1101.0011. Add 1 to the rightmost bit → **1101.0100**. Check with Method 1: −8 + 4 + 1 + 0.25 = **−2.75** ✓.

**−3.25.** +3.25 = **0011.0100**. Invert → 1100.1011. Add 1 → **1100.1100**. Check: −8 + 4 + 0.5 + 0.25 = **−3.25** ✓.
:::

:::warning Common mistakes with fixed point
- Reading fraction bits from repeated ×2 **bottom up** — they are read top down (first result = ½ bit).
- Writing the fraction place values as 0.1, 0.01 … — in binary they are **0.5, 0.25, 0.125, 0.0625**.
- Forgetting to **pad** the fraction to the given number of bits (.011 must be written .0110 in a 4.4 format) or padding on the wrong side.
- In two's complement, adding the 1 to the **units bit** instead of the **rightmost (smallest fraction) bit**.
- Saying a value that cannot be stored exactly is "an error in the program" — it is a **rounding error** caused by the limited number of bits.
:::

# Floating-point representation
@lo 12.1.1.6, 12.1.1.7

Fixed point has a serious problem: the position of the point is chosen once, for all numbers. A physics program might need the mass of an electron (about 0.000 000 000 000 000 000 000 000 000 000 911 kg) and the mass of the Earth (about 5 970 000 000 000 000 000 000 000 kg). No fixed position of the point can store both in a sensible number of bits. Scientists solve the same problem on paper with **standard form**: 5.97 × 10²⁴ and 9.11 × 10⁻³¹. The significant digits are written once, and a power of ten says where the point really is. **Floating point** is standard form in binary.

:::definition Floating-point representation
A way of storing a real number as **mantissa × 2^exponent**. The **mantissa** holds the significant bits of the number and the **exponent** says how many places, and in which direction, the binary point must be moved. The point "floats" because its real position depends on the exponent.
:::

:::definition Mantissa
The part of a floating-point number that holds its **significant bits**. In this course it is a two's complement fraction with an **implied binary point after the first (sign) bit**: 0.xxxxxxx is positive, 1.xxxxxxx is negative (the first bit is worth −1).
:::

:::definition Exponent
The part of a floating-point number that gives the **power of 2** by which the mantissa is multiplied. It is a **two's complement integer**: a positive exponent moves the point to the **right** (bigger number), a negative exponent moves it to the **left** (smaller number).
:::

## The format used in this course

Exam questions give you the sizes. Most often a number is stored in **12 bits: an 8-bit mantissa followed by a 4-bit exponent**, both in two's complement. The 8-bit mantissa has place values **−1 . ½ ¼ ⅛ 1/16 1/32 1/64 1/128** — the first bit is the sign bit and is worth −1, and the binary point is understood to be right after it. A 4-bit two's complement exponent has place values −8, 4, 2, 1, so it can be any whole number from **−8 to +7**. Other questions use, for example, a 10-bit mantissa and 6-bit exponent, or a 12-bit mantissa and 4-bit exponent; the method is identical.

:::svg An 8-bit mantissa and a 4-bit exponent
<svg class="bar2" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A 12-bit floating-point number. The first eight boxes are the mantissa 0 1 1 0 1 0 0 0 with place values minus 1, one half, one quarter, one eighth and so on; the implied binary point is after the first bit. The last four boxes are the exponent 0 0 1 1 with place values minus 8, 4, 2, 1, giving 3. The value is 0.1101 times 2 to the power 3, which is 110.1 or 6.5.">
  <style>
    svg.bar2 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar2 .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar2 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bar2 .b{font:700 18px ui-monospace,monospace;fill:var(--foreground)}
    svg.bar2 .m{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.bar2 .e{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.bar2 .sg{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.bar2 .pt{fill:var(--danger)}
  </style>
  <text class="h" x="270" y="26" text-anchor="middle">Mantissa (8 bits, two's complement)</text>
  <text class="h" x="630" y="26" text-anchor="middle">Exponent (4 bits)</text>
  <text class="t" x="50" y="56" text-anchor="middle">−1</text>
  <text class="t" x="115" y="56" text-anchor="middle">½</text>
  <text class="t" x="175" y="56" text-anchor="middle">¼</text>
  <text class="t" x="235" y="56" text-anchor="middle">⅛</text>
  <text class="t" x="295" y="56" text-anchor="middle">1/16</text>
  <text class="t" x="355" y="56" text-anchor="middle">1/32</text>
  <text class="t" x="415" y="56" text-anchor="middle">1/64</text>
  <text class="t" x="475" y="56" text-anchor="middle">1/128</text>
  <rect class="sg" x="25" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="90" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="150" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="210" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="270" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="330" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="390" y="68" width="50" height="46" rx="6"/>
  <rect class="m" x="450" y="68" width="50" height="46" rx="6"/>
  <text class="b" x="50" y="98" text-anchor="middle">0</text>
  <circle class="pt" cx="82" cy="108" r="5"/>
  <text class="b" x="115" y="98" text-anchor="middle">1</text>
  <text class="b" x="175" y="98" text-anchor="middle">1</text>
  <text class="b" x="235" y="98" text-anchor="middle">0</text>
  <text class="b" x="295" y="98" text-anchor="middle">1</text>
  <text class="b" x="355" y="98" text-anchor="middle">0</text>
  <text class="b" x="415" y="98" text-anchor="middle">0</text>
  <text class="b" x="475" y="98" text-anchor="middle">0</text>
  <text class="t" x="555" y="56" text-anchor="middle">−8</text>
  <text class="t" x="605" y="56" text-anchor="middle">4</text>
  <text class="t" x="655" y="56" text-anchor="middle">2</text>
  <text class="t" x="705" y="56" text-anchor="middle">1</text>
  <rect class="e" x="532" y="68" width="46" height="46" rx="6"/>
  <rect class="e" x="582" y="68" width="46" height="46" rx="6"/>
  <rect class="e" x="632" y="68" width="46" height="46" rx="6"/>
  <rect class="e" x="682" y="68" width="46" height="46" rx="6"/>
  <text class="b" x="555" y="98" text-anchor="middle">0</text>
  <text class="b" x="605" y="98" text-anchor="middle">0</text>
  <text class="b" x="655" y="98" text-anchor="middle">1</text>
  <text class="b" x="705" y="98" text-anchor="middle">1</text>
  <text class="s" x="50" y="138" text-anchor="middle">sign bit</text>
  <text class="s" x="120" y="138">implied binary point</text>
  <text class="t" x="270" y="180" text-anchor="middle">Mantissa = 0.1101000 = 0.8125</text>
  <text class="t" x="630" y="180" text-anchor="middle">Exponent = 2 + 1 = 3</text>
  <text class="h" x="380" y="222" text-anchor="middle">Value = 0.1101 × 2³ → move the point 3 places right → 110.1 = 6.5</text>
  <text class="s" x="380" y="250" text-anchor="middle">Check: 0.8125 × 8 = 6.5</text>
</svg>
:::

## Floating point → denary

The reliable method has three steps. First convert the **exponent** from two's complement into denary. Then write the mantissa with its point after the first bit and **move the point**: right by the exponent if it is positive, left if it is negative (when moving left, copy the **sign bit** into the new places on the left — 0s for a positive number, 1s for a negative number). Finally convert the resulting fixed-point number to denary, remembering that for a negative number the leftmost bit has a negative place value.

An equally valid method is arithmetic: work out the mantissa as a denary fraction (for example 0.1101 = 0.8125, or 1.0011 = −1 + 0.125 + 0.0625 = −0.8125) and multiply it by 2^exponent. Use whichever you find easier, and use the other one to check.

:::example Floating point → denary (8-bit mantissa, 4-bit exponent)
**(a) Mantissa 01101000, exponent 0011.** Exponent = +3. Mantissa 0.1101000. Move the point 3 places right → 0110.1000 = 4 + 2 + 0.5 = **6.5**.

**(b) Mantissa 01001000, exponent 1110.** Exponent = −8 + 4 + 2 = **−2**. Mantissa 0.1001000. Move the point 2 places **left**, filling with 0s → 0.001001 = 0.125 + 0.015625 = **0.140625**.

**(c) Mantissa 10011000, exponent 0100.** Exponent = +4. Mantissa 1.0011000 is negative. Move the point 4 places right → 10011.000. As a 5-bit two's complement integer 10011 = −16 + 2 + 1 = **−13**. Check by arithmetic: mantissa = −1 + 0.125 + 0.0625 = −0.8125; −0.8125 × 2⁴ = −13 ✓.

**(d) Mantissa 10100000, exponent 1111.** Exponent = −1. Mantissa = −1 + 0.25 = −0.75; −0.75 × 2⁻¹ = **−0.375**.
:::

## Denary → floating point

To store a denary number, reverse the process. Write the number in **fixed-point binary** first. Then move the binary point until the number has the form **0.1…** (for a positive number); count how many places you moved it — that count is the exponent (positive if you moved the point left, because you must move it back right to get the number back). Fill the mantissa to its full width with 0s on the right, and write the exponent in two's complement with the given number of bits. For a **negative** number, do all of this for the positive value and then take the **two's complement of the whole mantissa** (invert, add 1). The exponent is not changed by the sign of the number — the exponent's sign only tells you whether the number is large (≥ 1) or a small fraction.

:::steps Denary → floating point: 5.75 in an 8-bit mantissa and 4-bit exponent
- Fixed point: 5 = 101, 0.75 = .11 → **101.11**.
- Move the point left until the number is 0.1…: 101.11 → **0.10111**, moved **3** places → exponent +3.
- Mantissa padded to 8 bits: **01011100**.
- Exponent 3 in 4-bit two's complement: **0011**.
- Check: 0.10111 × 2³ = 101.11 = 5.75 ✓.
:::

:::example Negative numbers: −6.75 and −13.25 (8-bit mantissa, 4-bit exponent)
**−6.75.** +6.75 = 110.11 = 0.11011 × 2³. Positive mantissa **01101100**. Two's complement: invert → 10010011, add 1 → **10010100**. Exponent **0011**. Check: 1.0010100 = −1 + 0.125 + 0.03125 = −0.84375; × 8 = **−6.75** ✓.

**−13.25.** +13.25 = 1101.01 = 0.110101 × 2⁴. Positive mantissa **01101010**; invert → 10010101; add 1 → **10010110**. Exponent 4 → **0100**. Check: −1 + 0.125 + 0.03125 + 0.015625 = −0.828125; × 16 = **−13.25** ✓.

**A small number, 0.1875.** 0.1875 = 0.0011₂. Move the point **right** 2 places to get 0.11 → exponent **−2** = **1110**. Mantissa **01100000**.
:::

:::compare Positive and negative exponents and mantissas
| | Mantissa starts 0 (positive) | Mantissa starts 1 (negative) |
|---|---|---|
| **Exponent positive** (0…) | Positive number with size ≥ ½, e.g. 01011100 / 0011 = 5.75 | Negative number with size ≥ ½, e.g. 10010100 / 0011 = −6.75 |
| **Exponent negative** (1…) | Small positive fraction, e.g. 01100000 / 1110 = 0.1875 | Small negative fraction, e.g. 10100000 / 1111 = −0.375 |
:::

# Normalisation, range and precision
@lo 12.1.1.7

The same value can be written in floating point in several ways. 6.5 is 0.1101 × 2³, but it is also 0.01101 × 2⁴ and 0.001101 × 2⁵. In an 8-bit mantissa these are 01101000/0011, 00110100/0100 and 00011010/0101. All three are correct, but the second and third waste mantissa bits on leading zeros, and the bits pushed off the right end of a longer number would be lost. Computers therefore store numbers in a standard form called **normalised** form.

:::definition Normalised floating point
A floating-point number whose mantissa has **no redundant leading bits**: the first two bits of the mantissa are **different**. A normalised **positive** mantissa starts **0.1**; a normalised **negative** mantissa starts **1.0**.
:::

## Why normalise?

There are two reasons, and exams often ask for both.

- **Maximum precision.** Leading 0s (in a positive mantissa) or leading 1s (in a negative one) carry no information — they only repeat the sign. Removing them frees mantissa bits for **significant** bits on the right, so the number is stored as accurately as the mantissa allows.
- **A unique representation.** Every number has exactly **one** normalised form. This makes it easy to **compare** two numbers and simplifies the hardware that does arithmetic; without it, the same value could appear in many different bit patterns.

## How to normalise

To normalise, **shift the mantissa bits left** until the first two bits differ, filling with 0s on the right. Every shift left doubles the mantissa, so to keep the value the same you must **subtract 1 from the exponent for every place shifted**. (If a mantissa had to be shifted right, you would add to the exponent instead, but in exam questions the usual task is shifting left.)

:::svg Normalising a positive and a negative mantissa
<svg class="bar2" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two rows. Top: mantissa 0.0110100 with exponent 4 is not normalised; shift left 1 place to 0.1101000 and subtract 1 from the exponent to get 3; value stays 6.5. Bottom: mantissa 1.1100110 with exponent 5 is not normalised; shift left 2 places to 1.0011000 and subtract 2 from the exponent to get 3; value stays minus 6.5.">
  <style>
    svg.bar2 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar2 .t{font:14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bar2 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bar2 .b{font:700 17px ui-monospace,monospace;fill:var(--foreground)}
    svg.bar2 .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.bar2 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.bar2 .ar{stroke:var(--primary);stroke-width:2.5;fill:none}
    svg.bar2 .ah{fill:var(--primary)}
  </style>
  <text class="h" x="20" y="28">Positive: 6.5</text>
  <rect class="bad" x="20" y="44" width="270" height="70" rx="8"/>
  <text class="b" x="155" y="74" text-anchor="middle">0.0110100</text>
  <text class="t" x="155" y="100" text-anchor="middle">exponent 0100 (4)</text>
  <path class="ar" d="M300 79 H450"/>
  <path class="ah" d="M450 72 L464 79 L450 86 Z"/>
  <text class="s" x="380" y="66" text-anchor="middle">shift left 1</text>
  <text class="s" x="380" y="100" text-anchor="middle">exponent − 1</text>
  <rect class="ok" x="470" y="44" width="270" height="70" rx="8"/>
  <text class="b" x="605" y="74" text-anchor="middle">0.1101000</text>
  <text class="t" x="605" y="100" text-anchor="middle">exponent 0011 (3)</text>
  <text class="h" x="20" y="168">Negative: −6.5</text>
  <rect class="bad" x="20" y="184" width="270" height="70" rx="8"/>
  <text class="b" x="155" y="214" text-anchor="middle">1.1100110</text>
  <text class="t" x="155" y="240" text-anchor="middle">exponent 0101 (5)</text>
  <path class="ar" d="M300 219 H450"/>
  <path class="ah" d="M450 212 L464 219 L450 226 Z"/>
  <text class="s" x="380" y="206" text-anchor="middle">shift left 2</text>
  <text class="s" x="380" y="240" text-anchor="middle">exponent − 2</text>
  <rect class="ok" x="470" y="184" width="270" height="70" rx="8"/>
  <text class="b" x="605" y="214" text-anchor="middle">1.0011000</text>
  <text class="t" x="605" y="240" text-anchor="middle">exponent 0011 (3)</text>
  <text class="s" x="380" y="285" text-anchor="middle">Red = not normalised (first two bits the same) · Green = normalised (0.1… or 1.0…)</text>
</svg>
:::

:::example Normalising step by step (8-bit mantissa, 4-bit exponent)
**(a) Mantissa 00110100, exponent 0100.** The mantissa starts 00, so it is not normalised. Shift left **1** place → 01101000 (now starts 01). Exponent 4 − 1 = 3 → **0011**. Value before: 0.0110100 × 2⁴ = 0110.1 = 6.5; after: 0.1101 × 2³ = 110.1 = **6.5** — unchanged.

**(b) Mantissa 11100110, exponent 0101.** Starts 11, so not normalised. Shift left **2** places → 10011000 (now starts 10). Exponent 5 − 2 = 3 → **0011**. Check: before, −0.203125 × 2⁵ = −6.5; after, 1.0011 = −0.8125, × 2³ = **−6.5** ✓.

**(c) Mantissa 00011010, exponent 0101.** Shift left **2** → **01101000**, exponent 5 − 2 = 3 → **0011**. Value 6.5 again — three different patterns of the same number, only one of them normalised.
:::

## Range and precision in floating point

In floating point the total number of bits is fixed too, and it is **shared** between the mantissa and the exponent. The two parts control different things.

- The **mantissa** controls **precision**. More mantissa bits means more significant bits, so values are stored with smaller rounding errors.
- The **exponent** controls **range**. Each extra exponent bit roughly **doubles the largest power** of 2 that can be used, so the largest and smallest storable values grow enormously.

With an 8-bit mantissa and 4-bit exponent, the largest positive value is mantissa 01111111 with exponent 0111 (+7): 0.1111111 × 2⁷ = 1111111 = **127**. The most negative value is 10000000 with exponent 0111: −1 × 2⁷ = **−128**. The smallest positive normalised value is 01000000 with exponent 1000 (−8): 0.5 × 2⁻⁸ = **0.001953125**. Compare that with an 8-bit fixed-point byte, whose largest value is at most 255 and whose smallest step can never be shared between big and small numbers.

If the same 12 bits were split differently, a 9-bit mantissa with a 3-bit exponent (exponent −4 … +3) would give a largest value of only about 7.97 but more precision; a 6-bit mantissa with a 6-bit exponent (exponent −32 … +31) would reach about 2 × 10⁹ but keep only 5 significant bits. Designers of real computer formats choose the split for the kind of numbers their users need. The standard 32-bit "single precision" format, used in most programming languages and graphics cards, has 24 bits of precision and 8 exponent bits; "double precision" (64 bits) has 53 and 11.

:::compare Mantissa bits vs exponent bits (total number of bits fixed)
| | More bits for the mantissa | More bits for the exponent |
|---|---|---|
| Effect | Greater **precision** — more significant bits, smaller rounding errors | Greater **range** — much larger and much smaller numbers can be stored |
| Cost | Smaller range | Less precision |
| Good for | Measurements that must be accurate (money calculations, positions) | Science and engineering values that vary hugely in size |
:::

## Overflow and underflow

Because the exponent has a limited range, some results cannot be stored at all.

- **Overflow** happens when a result is **too large** — its exponent would have to be bigger than the largest exponent (e.g. more than +7 with a 4-bit exponent). The value cannot be represented; a program may stop with an error or store "infinity".
- **Underflow** happens when a result is **too close to zero** — its exponent would have to be more negative than the smallest exponent (below −8). The value is usually stored as **0**, losing the information.

Overflow in floating point is the same idea as overflow in Lesson 1's integer addition: a result needs more bits than the format provides.

## Fixed point or floating point?

:::compare Fixed point vs floating point
| | Fixed point | Floating point |
|---|---|---|
| **Position of the point** | Always the same, not stored | Set by the exponent; "floats" |
| **Range** | Small for the number of bits | **Very large** for the same number of bits |
| **Precision** | The same absolute step everywhere | Relative — small numbers are stored with small steps, large numbers with large steps |
| **Speed and hardware** | **Faster**, simple integer hardware | Slower, needs a floating-point unit (FPU) |
| **Exactness** | Exact for values that fit the fraction bits | Most values rounded to the mantissa bits |
| **Typical uses** | Money (as integers of tiyn), simple sensors and embedded controllers, audio processing | Science, engineering, 3D graphics and games, spreadsheets, most real numbers in programs |
:::

A good exam answer links the choice to the situation. A cheap digital thermometer that only shows 35.0–42.0 °C to one decimal place can use fixed point: the range is tiny, and fixed-point arithmetic is fast and uses little power. A weather-forecast program that works with air pressures, tiny particle sizes and the size of the Earth needs floating point because of the huge range. A banking system should avoid binary fractions entirely for money and store whole tiyn, because rounding errors in floating point would make the accounts wrong by small amounts that add up over millions of transactions.

:::warning Common mistakes with floating point
- Moving the point the wrong way: a **positive** exponent moves it **right**, a negative exponent moves it **left**.
- Forgetting that the exponent is **two's complement** — 1110 is −2, not 14.
- Making a negative number by just changing the first bit to 1 — you must take the **two's complement of the whole mantissa**.
- Normalising by shifting but **not changing the exponent** (or changing it in the wrong direction): shift left n places → exponent − n.
- Saying a negative mantissa is normalised when it starts 11 — normalised negative mantissas start **10**.
- Mixing up the effects: mantissa → **precision**, exponent → **range**.
:::

# Exam practice: fixed-point and floating-point numbers
@lo 12.1.1.6, 12.1.1.7

:::example Exam-style questions with model answers
**Q: The byte 01011100 is an unsigned fixed-point number with 4 integer bits and 4 fraction bits. Convert it to denary. Show your working. [2]**
0101 = 4 + 1 = 5 (1); .1100 = 0.5 + 0.25 = 0.75 → **5.75** (1).

**Q: Represent 6.375 as an 8-bit fixed-point number with 4 integer and 4 fraction bits. [2]**
6 = 0110 and 0.375 = .011 (by ×2: 0, 1, 1) (1); **0110.0110** (1).

**Q: Represent −3.25 in 8-bit two's complement fixed point with 4 integer and 4 fraction bits. Show your working. [3]**
+3.25 = 0011.0100 (1); invert → 1100.1011 (1); add 1 → **1100.1100** (1).

**Q: A floating-point number has an 8-bit mantissa and a 4-bit exponent, both in two's complement. Convert (i) mantissa 01110100, exponent 0010 and (ii) mantissa 10101000, exponent 0001 to denary. [4]**
(i) exponent +2 (1); 0.1110100 → 011.101 = **3.625** (1). (ii) exponent +1; mantissa = −1 + 0.25 + 0.0625 = −0.6875 (1); × 2 = **−1.375** (1).

**Q: Convert −13.25 into normalised floating point with an 8-bit mantissa and a 4-bit exponent. Show your working. [4]**
13.25 = 1101.01 (1); = 0.110101 × 2⁴, positive mantissa 01101010 (1); two's complement → mantissa **10010110** (1); exponent **0100** (1).

**Q: Explain why floating-point numbers are normalised, and the effect of giving more of the bits to the exponent. [4]**
Normalising removes redundant leading bits so the mantissa holds the **maximum number of significant bits** → maximum **precision** (1); each number has a **unique** representation, which makes comparison and arithmetic easier (1). More exponent bits gives a **greater range** of numbers (1) but, with the same total, fewer mantissa bits so **less precision** (1).
:::

:::warning Common mistakes in exam answers
- Not showing the fixed-point step or the two's complement step — the method marks are lost.
- Writing the exponent in the wrong number of bits (it must fill exactly the given width, e.g. 0100, not 100).
- Giving an un-normalised answer when the question says **normalised**.
- Answering "precision" and "range" questions with "accuracy" for both — say which part (mantissa / exponent) affects which.
:::

:::steps Check yourself
- Write the place values of a 4.4 fixed-point byte and convert 1010.0101 (unsigned) to denary.
- Convert 9.375 and 2.6 to 4.4 fixed point. Which one has a rounding error, and why?
- Store −1.5 in 8-bit two's complement fixed point (4.4).
- What do the mantissa and the exponent each control?
- Convert mantissa 01001000, exponent 1110 to denary.
- Convert −6.75 to normalised floating point (8-bit mantissa, 4-bit exponent).
- Normalise mantissa 11100110, exponent 0101.
- Give one use of fixed point and one use of floating point and justify each.
:::

