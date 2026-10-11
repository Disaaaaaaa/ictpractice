---
summary: Number systems used in computing — denary, binary, octal and hexadecimal — place values, converting between them (by place value, repeated division and grouping bits), and why hexadecimal is used in computer systems.
---
# Number systems
@lo 12.1.1.1

A **number system (base)** is defined by how many different **digits** it uses. The value of each digit depends on its **position** (place value), and each place is worth **base** times the place to its right.

:::compare The four number systems
| System | Base | Digits | Example | Used for |
|---|---|---|---|---|
| **Denary** (decimal) | 10 | 0–9 | 183₁₀ | Everyday counting |
| **Binary** | 2 | 0, 1 | 10110111₂ | How computers **store** all data |
| **Octal** | 8 | 0–7 | 267₈ | Older systems, Linux file permissions (`chmod 755`) |
| **Hexadecimal** | 16 | 0–9, A–F | B7₁₆ | A **short way to write binary** for people |
:::

:::compare Place values
| Base | … | 4th place | 3rd place | 2nd place | 1st place |
|---|---|---|---|---|---|
| Binary | … | 2³ = 8 | 2² = 4 | 2¹ = 2 | 2⁰ = 1 |
| Octal | … | 8³ = 512 | 8² = 64 | 8¹ = 8 | 8⁰ = 1 |
| Denary | … | 10³ = 1000 | 10² = 100 | 10¹ = 10 | 10⁰ = 1 |
| Hexadecimal | … | 16³ = 4096 | 16² = 256 | 16¹ = 16 | 16⁰ = 1 |
:::

:::compare Hexadecimal digits
| Hex | 0–9 | A | B | C | D | E | F |
|---|---|---|---|---|---|---|---|
| Denary | 0–9 | 10 | 11 | 12 | 13 | 14 | 15 |
:::

:::tip Writing the base
Write the base as a subscript (B7₁₆, 10110111₂) or with a prefix: **0x**B7 or **#**B7 for hex, **0b**10110111 for binary. In exam answers always show the base if there could be any doubt.
:::

# Binary and denary
@lo 12.1.1.1

:::steps Binary → denary
- Write the place values (… 128, 64, 32, 16, 8, 4, 2, 1) above the bits.
- **Add** the place values where the bit is **1**.
:::

:::example 1011011₂ → denary
| 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 1 | 1 |

64 + 16 + 8 + 2 + 1 = **91₁₀**
:::

:::steps Denary → binary (subtraction method)
- Find the **largest place value** that fits into the number; write 1 there.
- **Subtract** it and repeat with the remainder; write 0 in places that do not fit.
:::

:::example 183₁₀ → binary
183 − 128 = 55 → 55 − 32 = 23 → 23 − 16 = 7 → 7 − 4 = 3 → 3 − 2 = 1 → 1 − 1 = 0
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 1 | 1 | 1 |

183₁₀ = **10110111₂**
:::

:::example Denary → binary (repeated division by 2)
| Divide | Quotient | Remainder |
|---|---|---|
| 92 ÷ 2 | 46 | 0 |
| 46 ÷ 2 | 23 | 0 |
| 23 ÷ 2 | 11 | 1 |
| 11 ÷ 2 | 5 | 1 |
| 5 ÷ 2 | 2 | 1 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |

Read the remainders from the **bottom up**: 92₁₀ = **1011100₂**.
:::

:::callout info Bits and range
With **n bits** you can store **2ⁿ** different values, from **0** to **2ⁿ − 1** (unsigned): 8 bits → 0 to 255; 16 bits → 0 to 65 535.
:::

# Binary and hexadecimal
@lo 12.1.1.1

One hexadecimal digit represents exactly **4 bits** (a **nibble**), because 16 = 2⁴. So one **byte** (8 bits) is always exactly **two** hex digits.

:::compare Nibble ↔ hex
| Binary | Hex | Binary | Hex |
|---|---|---|---|
| 0000 | 0 | 1000 | 8 |
| 0001 | 1 | 1001 | 9 |
| 0010 | 2 | 1010 | A |
| 0011 | 3 | 1011 | B |
| 0100 | 4 | 1100 | C |
| 0101 | 5 | 1101 | D |
| 0110 | 6 | 1110 | E |
| 0111 | 7 | 1111 | F |
:::

:::steps Binary → hexadecimal
- Split the binary number into groups of **4 bits from the right**.
- **Pad** the leftmost group with leading zeros if needed.
- Replace each group with its hex digit.
:::

:::steps Hexadecimal → binary
- Replace **each** hex digit with its **4-bit** binary group.
- Join the groups; leading zeros may be dropped.
:::

:::example Examples
- 1011 0111₂ → **B7₁₆**
- 101 1011₂ → 0101 1011 → **5B₁₆**
- 11 1110 1001₂ → 0011 1110 1001 → **3E9₁₆**
- **2F₁₆** → 0010 1111₂
- **1A3₁₆** → 0001 1010 0011₂ = 110100011₂
:::

:::widget base_converter Convert between bases
:::

# Hexadecimal and denary
@lo 12.1.1.1

:::steps Hexadecimal → denary
- Multiply each digit by its place value (… 256, 16, 1); A = 10 … F = 15.
- **Add** the results.
:::

:::example Hex → denary
- B7₁₆ = 11 × 16 + 7 = 176 + 7 = **183₁₀**
- 1A3₁₆ = 1 × 256 + 10 × 16 + 3 = 256 + 160 + 3 = **419₁₀**
- 3E9₁₆ = 3 × 256 + 14 × 16 + 9 = 768 + 224 + 9 = **1001₁₀**
:::

:::steps Denary → hexadecimal
- **Method 1 — divide by 16:** the quotient is the first digit and the remainder the second (for numbers up to 255); repeat for larger numbers, reading remainders bottom up.
- **Method 2 — via binary:** convert to binary, then group into nibbles.
:::

:::example Denary → hex
- 183 ÷ 16 = 11 remainder 7 → **B7₁₆**
- 92 ÷ 16 = 5 remainder 12 → **5C₁₆**
- 300 ÷ 16 = 18 r 12 (C); 18 ÷ 16 = 1 r 2; 1 ÷ 16 = 0 r 1 → read bottom up: **12C₁₆**
- 250 → 1111 1010₂ → **FA₁₆**
:::

# Octal
@lo 12.1.1.1

One octal digit represents exactly **3 bits**, because 8 = 2³.

:::steps Conversions with octal
- **Binary → octal:** split into groups of **3 bits from the right**, replace each group with a digit 0–7.
- **Octal → binary:** replace each digit with **3 bits**.
- **Denary → octal:** repeated division by **8**, remainders read bottom up.
- **Octal → denary:** multiply by place values 64, 8, 1 and add.
:::

:::example Octal examples
- 92₁₀: 92 ÷ 8 = 11 r **4**; 11 ÷ 8 = 1 r **3**; 1 ÷ 8 = 0 r **1** → **134₈**
- 10110111₂ → 010 110 111 → **267₈**
- 745₈ = 7 × 64 + 4 × 8 + 5 = 448 + 32 + 5 = **485₁₀** = 111 100 101₂
- Linux permission **755** = 111 101 101 → owner rwx, group r-x, others r-x
:::

:::compare One value in every base
| Denary | Binary | Octal | Hexadecimal |
|---|---|---|---|
| 45 | 101101 | 55 | 2D |
| 91 | 1011011 | 133 | 5B |
| 156 | 10011100 | 234 | 9C |
| 183 | 10110111 | 267 | B7 |
| 255 | 11111111 | 377 | FF |
:::

# Why hexadecimal is used
@lo 12.1.1.2

:::cards
### Advantages of hexadecimal
- **Shorter** than binary — a byte is **2** hex digits instead of **8** bits.
- **Easier for people to read, remember and write** → **fewer mistakes** when copying long binary values.
- **Easy and quick to convert** to and from binary (each digit = 4 bits) — much easier than denary.
- Makes **debugging** and low-level programming quicker.
### What hex does NOT do
- It does **not save memory** — the computer still stores everything in **binary**.
- It does **not make the computer faster**. Hex is only a **representation for humans**.
:::

:::compare Uses of hexadecimal
| Use | Example | Why hex |
|---|---|---|
| **Colour codes** (24-bit RGB) | `#1F4FD8` = red 1F (31), green 4F (79), blue D8 (216) | 6 digits instead of 24 bits |
| **Memory addresses** | `0x7FFE4A10` in debuggers and error messages | Long addresses become short |
| **MAC addresses** | `3C:52:82:1A:9F:04` | 48 bits → 12 hex digits |
| **Machine code / memory dumps** | `B8 04 00 CD 21` | Each byte = 2 digits |
| **Error and status codes** | Windows `0x80070005` | Compact, matches binary flags |
| **IPv6 addresses** | `2001:0db8::1` | 128 bits → 32 hex digits |
| **Character codes** | Unicode `U+04D8` (Ә) | Code points are listed in hex |
:::

:::example Colour code in binary and hex
Pure orange **#FF8000**: red = FF = 11111111, green = 80 = 10000000, blue = 00 = 00000000. Writing **24 bits** by hand (111111111000000000000000) is slow and error-prone; **6 hex digits** are quick to read and type.
:::

# Exam practice and summary
@lo 12.1.1.1 12.1.1.2

:::example Exam-style answers
**Q: Convert 01011011₂ to denary and to hexadecimal. [2]**
64 + 16 + 8 + 2 + 1 = **91** (1); 0101 1011 → **5B** (1).

**Q: Convert 92₁₀ into (i) octal (ii) hexadecimal. [2]**
**134₈** (1); **5C₁₆** (1).

**Q: Convert 183₁₀ to hexadecimal. [1]**
183 ÷ 16 = 11 r 7 → **B7₁₆** (1).

**Q: Explain two advantages of using hexadecimal in computer systems. [2]**
Hex is **shorter / easier for people to read and remember** than binary, so there are **fewer errors** (1); it is **easy to convert to and from binary** because each digit is 4 bits (1).
:::

:::warning Common mistakes
- Grouping bits from the **left** — always group from the **right** and pad the left.
- Reading division remainders **top down** — read them **bottom up**.
- Writing 10 – 15 as two digits in hex (e.g. "1 5" for F).
- Saying hex "uses less memory" or "is faster for the computer".
:::

:::steps Check yourself
- Convert 11001000₂ to denary, octal and hex.
- Convert 156₁₀ to binary and hexadecimal.
- Convert 4D₁₆ to denary.
- Convert 745₈ to binary.
- Why does one hex digit represent exactly 4 bits?
- Give three places where hexadecimal is used and explain why.
:::
