---
summary: The binary, denary and hexadecimal number systems, converting between them, why hexadecimal is used in computer systems, and adding and multiplying binary numbers, including overflow.
---
# Number systems
@lo 11.1.1.1

Computers store and process **all data as binary** — patterns of **0s and 1s** — because their circuits have two states (on/off). People normally use **denary** (decimal), and programmers often use **hexadecimal** as a short way to write binary.

:::compare The three number systems
| | Denary (decimal) | Binary | Hexadecimal |
|---|---|---|---|
| **Base** | 10 | 2 | 16 |
| **Digits** | 0–9 | 0, 1 | 0–9 and **A–F** (A = 10, B = 11, C = 12, D = 13, E = 14, F = 15) |
| **Place values** | …, 1000, 100, 10, 1 | …, 128, 64, 32, 16, 8, 4, 2, 1 | …, 4096, 256, 16, 1 |
| **Used by** | People | The computer's hardware | Programmers, to write binary compactly |
| Example | 182 | 10110110 | B6 |
:::

:::cards
### Units
- **Bit** — one binary digit, 0 or 1.
- **Nibble** — 4 bits (one hexadecimal digit).
- **Byte** — 8 bits; values 0–255 (00000000–11111111, 00–FF).
### How many values?
- *n* bits can store **2ⁿ** different values: 4 bits → 16, 8 bits → 256, 16 bits → 65 536.
- The largest unsigned number in *n* bits is **2ⁿ − 1**: 8 bits → 255.
:::

:::compare Place values of an 8-bit binary number
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 |
:::

**10110110** = 128 + 32 + 16 + 4 + 2 = **182**

# Converting binary and denary
@lo 11.1.1.2

:::steps Binary → denary
- Write the **place values** (128, 64, 32 … 1) above the bits.
- **Add** the place values where the bit is **1**.
- *Example:* 01011010 → 64 + 16 + 8 + 2 = **90**.
:::

:::steps Denary → binary (place-value method)
- Start with the largest place value (128). If it fits into the number, write **1** and **subtract** it; otherwise write **0**.
- Repeat for 64, 32, 16, 8, 4, 2, 1.
- *Example:* **156** → 128 fits (1, remainder 28); 64 no (0); 32 no (0); 16 fits (1, remainder 12); 8 fits (1, 4); 4 fits (1, 0); 2 no (0); 1 no (0) → **10011100**.
:::

:::steps Denary → binary (division method)
- **Divide by 2** repeatedly and write down the **remainders**.
- Read the remainders from the **bottom up**.
:::

:::compare Division method for 47
| Division | Quotient | Remainder |
|---|---|---|
| 47 ÷ 2 | 23 | 1 |
| 23 ÷ 2 | 11 | 1 |
| 11 ÷ 2 | 5 | 1 |
| 5 ÷ 2 | 2 | 1 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |
:::

Reading upwards: **101111** → as 8 bits **00101111**.

# Converting with hexadecimal
@lo 11.1.1.2

:::steps Binary → hexadecimal
- Split the binary number into groups of **4 bits (nibbles)** from the **right**; add leading 0s if needed.
- Convert each nibble to **one hex digit** (8-4-2-1 place values).
- *Example:* 1101 0011 → 13 = **D**, 3 = **3** → **D3**.
:::

:::steps Hexadecimal → binary
- Convert **each hex digit** into **4 bits**.
- *Example:* **5C** → 5 = 0101, C (12) = 1100 → **01011100**.
:::

:::steps Hexadecimal ↔ denary
- **Hex → denary:** multiply each digit by its place value (16, 1) and add. *7A* = 7 × 16 + 10 = **122**.
- **Denary → hex:** divide by 16; the quotient is the first digit, the remainder the second. *245* = 15 × 16 + 5 → **F5**.
- Three digits: *1F4* = 1 × 256 + 15 × 16 + 4 = **500**.
:::

:::compare Hex digit ↔ 4-bit binary
| Hex | Binary | Hex | Binary | Hex | Binary | Hex | Binary |
|---|---|---|---|---|---|---|---|
| 0 | 0000 | 4 | 0100 | 8 | 1000 | C (12) | 1100 |
| 1 | 0001 | 5 | 0101 | 9 | 1001 | D (13) | 1101 |
| 2 | 0010 | 6 | 0110 | A (10) | 1010 | E (14) | 1110 |
| 3 | 0011 | 7 | 0111 | B (11) | 1011 | F (15) | 1111 |
:::

# Why hexadecimal is used
@lo 11.1.1.3

:::cards
### Advantages of hexadecimal
- **Shorter** than binary — one hex digit replaces **4 bits**, so a byte is just **2 digits** (B6 instead of 10110110).
- **Easier for people to read, write and remember** than long binary strings.
- **Fewer mistakes** when copying or typing values.
- **Easy to convert** to and from binary (each digit = one nibble), unlike denary.
- The computer still works in **binary** — hex is only for **people**.
### Where hexadecimal is used
- **Colour codes** in HTML/CSS: `#FF0000` (red), `#1F4FD8`.
- **MAC addresses**: `00:1A:2B:3C:4D:5E`.
- **Memory addresses** and **machine code** in debuggers and assembly.
- **Error codes** (e.g. Windows `0x0000007B`) and **IPv6** addresses.
- Representing **Unicode** characters (U+0041 = "A").
:::

:::example Reading an HTML colour code
`#2E8B57` → red **2E** = 46, green **8B** = 139, blue **57** = 87. Each pair is **one byte** (0–255) for one colour channel.
:::

# Binary addition
@lo 11.1.1.4

:::compare Rules of binary addition
| Sum | Result | Write | Carry |
|---|---|---|---|
| 0 + 0 | 0 | 0 | 0 |
| 0 + 1 | 1 | 1 | 0 |
| 1 + 1 | 2 (10₂) | 0 | 1 |
| 1 + 1 + 1 (with carry) | 3 (11₂) | 1 | 1 |
:::

```text | 01101101 + 00110110  (109 + 54)
  carry   1 1 1 1 1 0 0
          0 1 1 0 1 1 0 1      (109)
        + 0 0 1 1 0 1 1 0      ( 54)
          ---------------
          1 0 1 0 0 0 1 1      (163)
```

:::steps Checking the answer
- Convert both numbers and the answer to **denary**: 109 + 54 = 163 ✔.
- 10100011 = 128 + 32 + 2 + 1 = 163 ✔.
:::

:::definition Overflow
An **overflow error** occurs when the result of a calculation is **too large to fit** in the number of bits available. In 8 bits the largest value is **255**, so a result of 256 or more needs a **9th bit**, which is lost.
:::

```text | 11001000 + 01100100  (200 + 100) — overflow in 8 bits
  carry 1 1 0 0 0 0 0
          1 1 0 0 1 0 0 0      (200)
        + 0 1 1 0 0 1 0 0      (100)
          ---------------
      1   0 0 1 0 1 1 0 0      → 9 bits needed; the 8-bit register keeps 00101100 = 44
```

The correct answer is **300**, but only **44** is stored — the leftmost carry is lost. The processor sets an **overflow flag** so the error can be detected.

# Binary multiplication
@lo 11.1.1.4

:::steps Multiplying binary numbers (shift and add)
- Multiply the first number by **each bit** of the second number, starting from the right: ×1 copies the number, ×0 gives zeros.
- **Shift** each row one place **left** (add a 0 on the right) for each new bit.
- **Add** the rows using binary addition.
:::

```text | 1101 × 101  (13 × 5)
            1 1 0 1
          ×   1 0 1
          ---------
            1 1 0 1      (1101 × 1)
          0 0 0 0        (1101 × 0, shifted 1 place)
      + 1 1 0 1          (1101 × 1, shifted 2 places)
      -------------
      1 0 0 0 0 0 1      = 65 ✔
```

:::tip Shifting
Shifting a binary number **one place left** multiplies it by **2**; two places by 4; three places by 8. *Example:* 0011 (3) → 0110 (6) → 1100 (12). Shifting **right** divides by 2 (the remainder is lost).
:::

# Exam practice and summary
@lo 11.1.1.1 11.1.1.2 11.1.1.3 11.1.1.4

:::example Exam-style answers
**Q: Convert the denary number 200 into binary and hexadecimal. [2]**
200 = 128 + 64 + 8 → **11001000** (1); 1100 = C, 1000 = 8 → **C8** (1).

**Q: Explain two advantages of using hexadecimal in computer systems. [2]**
It is **shorter** than binary, so it is **easier for humans to read and remember** (1); it is **easy to convert** to binary because each digit represents **4 bits**, so there are **fewer errors** (1).

**Q: Add 01010110 and 00101101 and state the denary answer. [2]**
**10000011** (1) = **131** (1).

**Q: Explain what happens when 10010110 and 01111000 are added in an 8-bit register. [2]**
The result 270 is greater than **255**, so **overflow** occurs (1); only **00001110** (14) is stored / the 9th bit is lost (1).
:::

:::warning Common mistakes
- Reading the remainders of the division method from **top to bottom** (they are read **bottom up**).
- Splitting binary into nibbles from the **left** when the number of bits is not a multiple of 4 — always start from the **right**.
- Writing hex digits above 9 as "10", "11" — use **A–F**.
- Forgetting the **carry** in binary addition.
- Saying the computer works in hexadecimal — it works in **binary**; hex is for **humans**.
:::

:::steps Check yourself
- What are the base and digits of binary, denary and hexadecimal?
- Convert 173 to binary and hex; convert 3F to binary and denary.
- Give three advantages and three uses of hexadecimal.
- Add 10101101 and 01001101. Does overflow occur in 8 bits?
- Multiply 1010 by 111 in binary and check in denary.
:::
