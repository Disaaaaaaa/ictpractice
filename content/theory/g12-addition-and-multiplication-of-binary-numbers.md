---
summary: Binary addition with carries and overflow, binary multiplication by shift-and-add, representing negative integers in two's complement, subtraction by adding the two's complement, fixed-point binary fractions, and normalised floating-point numbers (mantissa and exponent) — converting in both directions, with range and precision.
---
# Binary addition
@lo 12.1.1.3

:::compare Addition rules
| Bits added | Sum bit | Carry |
|---|---|---|
| 0 + 0 | 0 | 0 |
| 0 + 1 | 1 | 0 |
| 1 + 1 | 0 | 1 |
| 1 + 1 + 1 (with a carry in) | 1 | 1 |
:::

:::steps Adding two binary numbers
- Line the numbers up on the **right**.
- Add each column from **right to left**, writing the sum bit and **carrying** 1 to the next column when needed.
- Write the carries in a row above (or below) so they are not forgotten.
- Check by converting to denary.
:::

```text | 01101101 + 00110110 (109 + 54 = 163)
  carry  1 1 1 1 1 0 0
         0 1 1 0 1 1 0 1     (109)
       + 0 0 1 1 0 1 1 0     ( 54)
         ---------------
         1 0 1 0 0 0 1 1     (163) ✓
```

:::definition Overflow
When the result of a calculation is **too large** to fit in the number of bits available. In an 8-bit register a carry out of the 8th bit is lost, so the stored result is **wrong**.
:::

```text | 10101010 + 10111001 in 8 bits (170 + 185 = 355)
         1 0 1 0 1 0 1 0     (170)
       + 1 0 1 1 1 0 0 1     (185)
         ---------------
       1 0 1 1 0 0 0 1 1     → 9 bits: the 9th bit is an OVERFLOW
```

The 8-bit result is **01100011** (99), not 355, because the largest 8-bit unsigned value is **255**.

:::widget binary_addition Practise binary addition
:::

# Binary multiplication
@lo 12.1.1.3

:::steps Long multiplication (shift and add)
- Multiply the first number by **each bit** of the second, starting from the right: a **1** copies the number, a **0** gives zeros.
- **Shift** each partial result **one place left** for each new bit.
- **Add** the partial results using binary addition.
:::

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

:::callout info Shifting
A **logical shift left** by one place **multiplies** an unsigned number by **2** (0011 = 3 → 0110 = 6); a shift right divides by 2. Multiplying by 4 = shift 2 places; by 8 = 3 places.
:::

# Two's complement
@lo 12.1.1.4

:::definition Two's complement
A way to represent **signed (positive and negative) integers** in binary. The **most significant bit (MSB)** has a **negative place value** (−128 in 8 bits); all other bits are positive. A number starting with **0** is positive; a number starting with **1** is negative.
:::

:::compare 8-bit two's complement place values
| −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
:::

10110001 = −128 + 32 + 16 + 1 = **−79**. (As an **unsigned** integer the same byte is **177**.)

:::steps Writing a negative denary number in two's complement (e.g. −45)
- Write the **positive** number in binary with the required number of bits: +45 = **00101101**.
- **Invert** every bit (one's complement): **11010010**.
- **Add 1**: **11010011** → −45.
- Check: −128 + 64 + 16 + 2 + 1 = −45 ✓
:::

:::tip Shortcut
Copy the bits from the **right** up to and including the **first 1**, then **invert** all the bits to its left: 00101101 → copy "1" → invert the rest → 11010011.
:::

:::example More examples (8 bits)
| Denary | Positive | Invert | +1 → two's complement |
|---|---|---|---|
| −15 | 00001111 | 11110000 | **11110001** |
| −56 | 00111000 | 11000111 | **11001000** |
| −100 | 01100100 | 10011011 | **10011100** |

Two's complement → denary: 11100110 = −128 + 64 + 32 + 4 + 2 = **−26**; 10011011 = −128 + 16 + 8 + 2 + 1 = **−101**.
:::

:::callout info Range
With *n* bits, two's complement represents **−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1**. In **8 bits: −128 to +127**; in 4 bits: −8 to +7; in 16 bits: −32 768 to +32 767. There is only **one zero** (00000000).
:::

:::widget twos_complement Explore two's complement
:::

# Subtraction using two's complement
@lo 12.1.1.5

To calculate **A − B**, the computer **adds A + (−B)**, where −B is the two's complement of B, and **ignores** any carry out of the most significant bit. This way the CPU only needs an **adder** circuit.

```text | 73 − 39 in 8 bits (01001001 − 00100111)
 39 = 0010 0111 → invert 1101 1000 → +1 → 1101 1001  (−39)

   0100 1001   (73)
 + 1101 1001   (−39)
 -----------
 1 0010 0010   → ignore the carry → 0010 0010 = 34 ✓
```

```text | 23 − 14 in 8 bits
 14 = 0000 1110 → invert 1111 0001 → +1 → 1111 0010  (−14)

   0001 0111   (23)
 + 1111 0010   (−14)
 -----------
 1 0000 1001   → ignore the carry → 0000 1001 = 9 ✓
```

```text | 20 − 45 — a negative answer
 45 = 0010 1101 → −45 = 1101 0011

   0001 0100   (20)
 + 1101 0011   (−45)
 -----------
   1110 0111   → MSB is 1, so negative: −128 + 64 + 32 + 4 + 2 + 1 = −25 ✓
```

:::warning Overflow in two's complement
Overflow happens when adding two numbers **with the same sign** gives a result with the **opposite sign**. Example: 100 + 50 = 01100100 + 00110010 = **10010110**, which reads as **−106** — the real answer 150 is above the 8-bit maximum of +127.
:::

# Fixed-point binary fractions
@lo 12.1.1.6

:::definition Fixed-point representation
A fixed number of bits is used for the **integer part** and a fixed number for the **fractional part**; the **binary point** is always in the same position. Place values after the point are **½, ¼, ⅛, 1/16 …** (0.5, 0.25, 0.125, 0.0625 …).
:::

:::compare 8 bits: 4 integer bits . 4 fraction bits
| 8 | 4 | 2 | 1 | . | 0.5 | 0.25 | 0.125 | 0.0625 |
|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 0 | . | 1 | 0 | 1 | 0 |
:::

0110.1010 = 4 + 2 + 0.5 + 0.125 = **6.625**

:::example Byte 10110001 as unsigned fixed point with 5 integer and 3 fraction bits
10110.001 = 16 + 4 + 2 + 0.125 = **22.125**
:::

:::steps Denary → fixed point: 9.375 with 4.4 bits
- Integer part 9 → **1001**.
- Fraction 0.375: multiply by 2 repeatedly — 0.375 × 2 = **0**.75; 0.75 × 2 = **1**.5; 0.5 × 2 = **1**.0 → **.011**.
- Pad to 4 fraction bits: **1001.0110**.
:::

:::example Signed fixed point (two's complement, 4.4 bits)
The MSB is worth −8: **1110.1000** = −8 + 4 + 2 + 0.5 = **−1.5**.
:::

:::cards
### Advantages of fixed point
- **Simple and fast** arithmetic (like integers).
- Exact for fractions that are sums of ½, ¼, ⅛ …
### Disadvantages
- **Limited range** — few bits for the integer part.
- **Limited precision** — few bits for the fraction.
- Moving bits from one part to the other gains range but loses precision (or the reverse).
:::

:::warning Rounding errors
Some fractions (e.g. **0.1**, 0.2, ⅓) **cannot be stored exactly** in binary — they are **rounded**, which causes small errors in calculations.
:::

# Floating-point representation
@lo 12.1.1.7

:::definition Floating point
A number is stored as **mantissa × 2^exponent**. The **mantissa** holds the significant digits (**precision**); the **exponent** says how far to move the binary point (**range**). Both are usually stored in **two's complement**; the mantissa has an implied binary point **after its first (sign) bit**.
:::

:::callout info Normalisation
A normalised **positive** mantissa starts **0.1**; a normalised **negative** mantissa starts **1.0**. Normalisation removes leading 0s (or 1s), giving the **maximum precision** for the bits available and a **unique** representation for each number.
:::

:::steps Denary → normalised floating point: 17.75 (10-bit mantissa, 6-bit exponent)
- 17.75 in fixed point: 17 = 10001, 0.75 = .11 → **10001.11**.
- Move the point so the number is 0.1…: **0.100011100** × 2⁵ (the point moved **5** places left).
- Mantissa (10 bits, sign bit first): **0100011100**.
- Exponent 5 in 6-bit two's complement: **000101**.
:::

:::steps Negative number: −23.75 (12-bit mantissa, 4-bit exponent)
- 23.75 = 10111.11 = **0.1011111 × 2⁵**.
- Positive mantissa in 12 bits: 010111110000.
- Two's complement (invert, add 1): **101000010000**.
- Exponent 5 → **0101**. Result: mantissa **101000010000**, exponent **0101**.
:::

:::steps Floating point → denary
- Convert the **exponent** (two's complement) to denary.
- Write the mantissa as 0.xxx or 1.xxx and **move the point** right (positive exponent) or left (negative exponent).
- Convert the result to denary (the leading 1 of a negative number is worth −1 before the point moves, or use two's complement on the result).
:::

:::example Floating point → denary (8-bit mantissa, 4-bit exponent)
| Mantissa | Exponent | Working | Value |
|---|---|---|---|
| 01010000 | 0011 (3) | 0.101 × 2³ = 101.0 | **5** |
| 01011000 | 0100 (4) | 0.1011 × 2⁴ = 1011 | **11** |
| 01100000 | 1111 (−1) | 0.11 × 2⁻¹ = 0.011 | **0.375** |
| 10100000 | 0010 (2) | 1.0100000 = −1 + 0.25 = −0.75; × 2² | **−3** |
| 10110000 | 0011 (3) | −1 + 0.25 + 0.125 = −0.625; × 2³ | **−5** |
:::

:::example Normalising a number
Mantissa **00011010**, exponent **0101** (5) is not normalised (starts 0.00…). Shift the mantissa **2** places left → **01101000** and **subtract 2** from the exponent → **0011** (3). Value is unchanged: 0.1101 × 2³ = 110.1 = **6.5**.
:::

:::compare Mantissa vs exponent bits
| More bits for the mantissa | More bits for the exponent |
|---|---|
| Greater **precision** (accuracy, more significant digits) | Greater **range** (much larger and much smaller numbers) |
| Smaller range with the same total bits | Less precision with the same total bits |
:::

:::compare Fixed point vs floating point
| | Fixed point | Floating point |
|---|---|---|
| Range | Small | **Very large** for the same number of bits |
| Precision | Same absolute precision everywhere | Precision depends on the size of the number |
| Speed | **Faster**, simpler hardware | Slower, needs more complex processing |
| Use | Money in some systems, simple embedded devices | Science, graphics, most real numbers in programs |
:::

# Exam practice and summary
@lo 12.1.1.3 12.1.1.4 12.1.1.5 12.1.1.6 12.1.1.7

:::example Exam-style answers
**Q: Represent −15 as an 8-bit two's complement integer. Show your working. [3]**
+15 = 00001111 (1); invert → 11110000 (1); add 1 → **11110001** (1).

**Q: Subtract 14₁₀ from 23₁₀ using binary. [3]**
23 = 00010111 (1); −14 = 11110010 (1); 00010111 + 11110010 = 1 00001001 → ignore carry → **00001001** = 9 (1).

**Q: The byte 10110001 is an unsigned fixed-point number with three fraction bits. Give its denary value. [2]**
10110 = **22** (1); .001 = **0.125** (1) → 22.125.

**Q: Convert 17.75 to normalised floating point with a 10-bit mantissa and 6-bit exponent. [4]**
Fixed point 010001.1100 (1); normalised 0.100011100 × 2⁵ (1); exponent **000101** (1); mantissa **0100011100** (1).
:::

:::warning Common mistakes
- Forgetting the **carry** in addition, or not ignoring the final carry in two's complement subtraction.
- Inverting the bits but **forgetting to add 1**.
- Using the **wrong number of bits** — pad positive numbers with leading 0s **before** inverting.
- In floating point, moving the point the **wrong way**: a positive exponent moves it **right**.
- Not **normalising** the mantissa when the question asks for normalised form.
:::

:::steps Check yourself
- Add 00111011 and 01010110. Did overflow occur?
- Multiply 1110 by 11.
- Write −56 in 8-bit two's complement; convert 10011011 to denary.
- Calculate 12 − 30 using 8-bit two's complement.
- Convert 9.375 to fixed point with 4 integer and 4 fraction bits.
- Convert −6.75 to normalised floating point (8-bit mantissa, 4-bit exponent).
:::
