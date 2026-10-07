---
summary: Binary addition and multiplication, two's complement for negative integers, subtraction by adding the complement, fixed-point binary fractions and normalised floating-point representation.
---
# Binary addition and multiplication
@lo 12.1.1.3

:::compare Addition rules
| Bits added | Result | Carry |
|---|---|---|
| 0 + 0 | 0 | 0 |
| 0 + 1 | 1 | 0 |
| 1 + 1 | 0 | 1 |
| 1 + 1 + 1 | 1 | 1 |
:::

```text | 10101010 + 10111001 in 8 bits
    1 0 1 0 1 0 1 0     (170)
  + 1 0 1 1 1 0 0 1     (185)
  -----------------
  1 0 1 1 0 0 0 1 1     → 9 bits: the 9th bit is an OVERFLOW
```

The 8-bit result is **01100011** (99) — wrong, because 170 + 185 = 355 > 255. This is **overflow**.

:::widget binary_addition Practise binary addition
:::

```text | Multiplication 1101 × 110 (13 × 6 = 78)
        1 1 0 1
      ×   1 1 0
      ---------
        0 0 0 0      × 0
      1 1 0 1        × 1, shifted 1
    1 1 0 1          × 1, shifted 2
    -----------
    1 0 0 1 1 1 0  = 78
```

# Two's complement
@lo 12.1.1.4

:::definition Two's complement
A way to represent **signed integers** in binary: the most significant bit (MSB) has a **negative place value** (−128 in 8 bits); the other bits are positive.
:::

:::compare 8-bit two's complement place values
| −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
:::

10110001 = −128 + 32 + 16 + 1 = **−79**. (As an *unsigned* integer the same byte is 177.)

:::steps Writing −45 in 8-bit two's complement
- Write +45 in binary: **00101101**.
- **Invert** every bit: 11010010.
- **Add 1**: 11010011 → **−45**.
- Check: −128 + 64 + 16 + 2 + 1 = −45 ✓
:::

:::callout info Range
With *n* bits, two's complement represents **−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1**. In 8 bits: **−128 to +127**. A positive number starts with 0, a negative number with 1.
:::

:::widget twos_complement Explore two's complement
:::

# Subtraction using two's complement
@lo 12.1.1.5

To calculate **A − B**, add **A + (−B)** where −B is the two's complement of B; ignore any carry out of the MSB.

```text | 23 − 14 in 8 bits
 14 = 0000 1110 → invert 1111 0001 → +1 → 1111 0010  (−14)

   0001 0111   (23)
 + 1111 0010   (−14)
 -----------
 1 0000 1001   → ignore the carry → 0000 1001 = 9 ✓
```

:::warning
Overflow in two's complement happens when adding two numbers **with the same sign** gives a result with the **opposite sign** (e.g. 100 + 50 in 8 bits gives a negative result).
:::

# Fixed-point binary fractions
@lo 12.1.1.6

A fixed number of bits is used for the **integer part** and for the **fractional part**; the binary point is in a fixed position. Fraction place values are **½, ¼, ⅛, 1/16 …**

:::compare 8 bits: 4 integer bits . 4 fraction bits
| 8 | 4 | 2 | 1 | . | 0.5 | 0.25 | 0.125 | 0.0625 |
|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 0 | . | 1 | 0 | 1 | 0 |
:::

0110.1010 = 4 + 2 + 0.5 + 0.125 = **6.625**

:::example Byte 10110001 as unsigned fixed point with 5 integer and 3 fraction bits
10110.001 = 16 + 4 + 2 + 0.125 = **22.125**
:::

:::steps Denary → fixed point: 5.75 with 4.4 bits
- Integer part 5 → 0101.
- Fraction 0.75 = 0.5 + 0.25 → .1100.
- Result: **0101.1100**.
:::

:::warning
Some fractions (e.g. 0.1) **cannot be stored exactly** in binary — they are rounded, which causes small errors.
:::

# Floating-point representation
@lo 12.1.1.7

:::definition Floating point
A number is stored as **mantissa × 2^exponent**. The **mantissa** holds the significant digits (precision); the **exponent** says where the binary point is (range). Both are usually in two's complement.
:::

:::steps Denary → normalised floating point: 17.75 (10-bit mantissa, 6-bit exponent)
- 17.75 in binary: 10001.11
- Move the point so the number is 0.1…: **0.1000111** × 2⁵ (point moved 5 places left).
- Mantissa (10 bits, sign bit first): **0100011100**
- Exponent 5 in 6 bits: **000101**
:::

:::steps Negative number: −3.5 (8-bit mantissa, 4-bit exponent)
- +3.5 = 11.1 = 0.111 × 2² → mantissa 0.1110000, exponent 0010.
- Two's complement of the mantissa 01110000 → 10010000.
- −3.5 = mantissa **10010000**, exponent **0010**.
:::

:::callout info Normalisation
A normalised **positive** mantissa starts **0.1**; a normalised **negative** mantissa starts **1.0**. Normalisation gives the **maximum precision** for the bits available and a **unique** representation for each number.
:::

:::compare Mantissa vs exponent bits
| More bits for the mantissa | More bits for the exponent |
|---|---|
| Greater **precision** (accuracy) | Greater **range** (larger and smaller numbers) |
:::

:::example Floating point → denary
Mantissa 0.1010000, exponent 0011 (= 3): 0.101 × 2³ = 101.0₂ = **5**
:::
