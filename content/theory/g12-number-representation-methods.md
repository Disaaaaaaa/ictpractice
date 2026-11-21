---
summary: Number systems used in computing — denary, binary, octal and hexadecimal — place value and number ranges, converting between all of them (place value, subtraction, repeated division and grouping bits into nibbles or triples), and why hexadecimal is used in computer systems (colour codes, memory addresses, MAC and IPv6 addresses, machine code and error codes).
---
# Number systems and place value
@lo 12.1.1.1

Every number you have ever written uses a **number system**. In everyday life we use the **denary** system: ten digits, 0 to 9, and a number such as 2025 means "two thousands, no hundreds, two tens and five ones". Computers do not work with ten digits. Inside a processor or a memory chip every value is stored as a pattern of **two states** — a transistor that is on or off, a voltage that is high or low, a magnetic area that points one way or the other. Two states give us two digits, 0 and 1, and so computers use the **binary** number system. People who design, program and repair computers also use two more systems, **octal** (eight digits) and **hexadecimal** (sixteen digits), because they are short ways of writing binary. This lesson explains how all four systems work and how to convert a number from any of them into denary and back.

## What a number system is

:::definition Number system (base)
A way of writing numbers using a **fixed set of digits**. The **base** (or radix) is the **number of different digits** the system uses: denary has base 10, binary base 2, octal base 8 and hexadecimal base 16.
:::

:::definition Place value
The **value of a position** in a number. In a positional number system each place is worth **base times the place to its right**, and the value of a digit = **digit × place value** of its position.
:::

All four systems we study are **positional**: the same digit means different amounts in different positions. In the denary number 555 the three fives are worth 500, 50 and 5. The rightmost place is always worth 1 (any base to the power 0 is 1). Moving one place to the left multiplies the place value by the base. In denary the places are 1, 10, 100, 1000; in binary they are 1, 2, 4, 8, 16 …; in octal 1, 8, 64, 512 …; in hexadecimal 1, 16, 256, 4096 …. This one rule explains every conversion method in the topic: to find the value of a number in any base, **multiply each digit by its place value and add the results**.

Because the place values grow by the base, a system with **fewer digits needs more places** to write the same number. The denary number 183 needs three denary digits, but eight binary digits (10110111), three octal digits (267) and only two hexadecimal digits (B7). That is the first reason people prefer hexadecimal when they read data stored in binary: it is much shorter.

A digit in a number system must always be **smaller than the base**. Binary has only the digits 0 and 1, so "2" can never appear in a binary number; octal has 0–7, so "8" and "9" never appear in an octal number. If you see 1829 labelled as octal, it is an error. This is a useful self-check during an exam.

:::svg Place values in the four number systems
<svg class="nrm" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A grid of place values. Binary row: 128, 64, 32, 16, 8, 4, 2, 1, each place twice the one to its right. Octal row: 4096, 512, 64, 8, 1, each place eight times the one on the right. Denary row: 10000, 1000, 100, 10, 1. Hexadecimal row: 65536, 4096, 256, 16, 1. The rightmost place in every row is base to the power 0, which equals 1.">
  <style>
    svg.nrm .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nrm .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nrm .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.nrm .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.nrm .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:1.5}
    svg.nrm .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <text class="h" x="20" y="28">Base</text>
  <text class="h" x="400" y="28" text-anchor="middle">Place values (each place = base × the place to its right)</text>
  <text class="t" x="20" y="72">Binary (2)</text>
  <g>
    <rect class="pb" x="150" y="52" width="66" height="32" rx="4"/><text class="t" x="183" y="73" text-anchor="middle">128</text>
    <rect class="pb" x="222" y="52" width="66" height="32" rx="4"/><text class="t" x="255" y="73" text-anchor="middle">64</text>
    <rect class="pb" x="294" y="52" width="66" height="32" rx="4"/><text class="t" x="327" y="73" text-anchor="middle">32</text>
    <rect class="pb" x="366" y="52" width="66" height="32" rx="4"/><text class="t" x="399" y="73" text-anchor="middle">16</text>
    <rect class="pb" x="438" y="52" width="66" height="32" rx="4"/><text class="t" x="471" y="73" text-anchor="middle">8</text>
    <rect class="pb" x="510" y="52" width="66" height="32" rx="4"/><text class="t" x="543" y="73" text-anchor="middle">4</text>
    <rect class="pb" x="582" y="52" width="66" height="32" rx="4"/><text class="t" x="615" y="73" text-anchor="middle">2</text>
    <rect class="ok" x="654" y="52" width="66" height="32" rx="4"/><text class="t" x="687" y="73" text-anchor="middle">1</text>
  </g>
  <text class="t" x="20" y="132">Octal (8)</text>
  <rect class="wn" x="366" y="112" width="66" height="32" rx="4"/><text class="t" x="399" y="133" text-anchor="middle">4096</text>
  <rect class="wn" x="438" y="112" width="66" height="32" rx="4"/><text class="t" x="471" y="133" text-anchor="middle">512</text>
  <rect class="wn" x="510" y="112" width="66" height="32" rx="4"/><text class="t" x="543" y="133" text-anchor="middle">64</text>
  <rect class="wn" x="582" y="112" width="66" height="32" rx="4"/><text class="t" x="615" y="133" text-anchor="middle">8</text>
  <rect class="ok" x="654" y="112" width="66" height="32" rx="4"/><text class="t" x="687" y="133" text-anchor="middle">1</text>
  <text class="t" x="20" y="192">Denary (10)</text>
  <rect class="bx" x="366" y="172" width="66" height="32" rx="4"/><text class="t" x="399" y="193" text-anchor="middle">10000</text>
  <rect class="bx" x="438" y="172" width="66" height="32" rx="4"/><text class="t" x="471" y="193" text-anchor="middle">1000</text>
  <rect class="bx" x="510" y="172" width="66" height="32" rx="4"/><text class="t" x="543" y="193" text-anchor="middle">100</text>
  <rect class="bx" x="582" y="172" width="66" height="32" rx="4"/><text class="t" x="615" y="193" text-anchor="middle">10</text>
  <rect class="ok" x="654" y="172" width="66" height="32" rx="4"/><text class="t" x="687" y="193" text-anchor="middle">1</text>
  <text class="t" x="20" y="252">Hexadecimal (16)</text>
  <rect class="pb" x="366" y="232" width="66" height="32" rx="4"/><text class="t" x="399" y="253" text-anchor="middle">65536</text>
  <rect class="pb" x="438" y="232" width="66" height="32" rx="4"/><text class="t" x="471" y="253" text-anchor="middle">4096</text>
  <rect class="pb" x="510" y="232" width="66" height="32" rx="4"/><text class="t" x="543" y="253" text-anchor="middle">256</text>
  <rect class="pb" x="582" y="232" width="66" height="32" rx="4"/><text class="t" x="615" y="253" text-anchor="middle">16</text>
  <rect class="ok" x="654" y="232" width="66" height="32" rx="4"/><text class="t" x="687" y="253" text-anchor="middle">1</text>
  <text class="s" x="687" y="290" text-anchor="middle">base⁰ = 1</text>
  <text class="s" x="300" y="290" text-anchor="middle">← places get bigger to the left</text>
</svg>
:::

## The four number systems

:::compare The four number systems
| System | Base | Digits | Place values (right to left) | Example | Used for |
|---|---|---|---|---|---|
| **Denary** (decimal) | 10 | 0–9 | 1, 10, 100, 1000 | 183₁₀ | Everyday counting, input and output for people |
| **Binary** | 2 | 0, 1 | 1, 2, 4, 8, 16, 32, 64, 128 | 10110111₂ | How computers **store and process** all data |
| **Octal** | 8 | 0–7 | 1, 8, 64, 512 | 267₈ | Older computers, Linux/Unix file permissions (`chmod 755`) |
| **Hexadecimal** | 16 | 0–9, A–F | 1, 16, 256, 4096 | B7₁₆ | A **short, readable way to write binary** for people |
:::

**Denary** is the system people think in, so most conversion questions begin or end in denary. **Binary** is the system the hardware actually uses; a single binary digit is called a **bit**, a group of 4 bits is a **nibble** and a group of 8 bits is a **byte**. **Octal** was popular on early computers whose words were 12, 24 or 36 bits long (multiples of 3); today you meet it mainly in Unix file permissions. **Hexadecimal** ("hex") is everywhere in modern computing because modern computers group bits in bytes, and a byte is exactly two hex digits.

## Hexadecimal digits

Hexadecimal needs **sixteen** different digits, but we only have ten number symbols. The six extra digits are the letters **A to F**. Each letter is a **single digit** with a value from 10 to 15. This matters: in hex, "F" is one digit worth fifteen, while "15" is two digits worth 1 × 16 + 5 = 21. Lower-case letters (a–f) mean the same as capitals; programmers often write `0xff` and `0xFF` interchangeably.

:::compare Hexadecimal digits and their values
| Hex digit | 0–9 | A | B | C | D | E | F |
|---|---|---|---|---|---|---|---|
| Denary value | 0–9 | 10 | 11 | 12 | 13 | 14 | 15 |
| Binary (4 bits) | 0000–1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |
:::

## Writing the base

The digits 101 could mean five (binary), sixty-five (octal), one hundred and one (denary) or two hundred and fifty-seven (hexadecimal). To avoid confusion we **show the base**. In mathematics and in exam answers the base is written as a **subscript**: 101₂, 101₈, 101₁₀, 101₁₆. In program code and on the Web, prefixes and suffixes are used instead.

:::compare Notations for the base
| Base | Subscript | Program code | Other notations |
|---|---|---|---|
| Binary | 10110111₂ | `0b10110111` (Python, JavaScript, C) | 10110111B |
| Octal | 267₈ | `0o267` (Python), `0267` (C) | 267Q |
| Denary | 183₁₀ | `183` | 183D |
| Hexadecimal | B7₁₆ | `0xB7` | `#B7` in HTML colours, B7h, `U+00B7` for Unicode, `&#xB7;` in HTML |
:::

:::definition Bit, nibble and byte
A **bit** (binary digit) is a single 0 or 1. A **nibble** is a group of **4 bits**. A **byte** is a group of **8 bits** (two nibbles).
:::

## How many values fit in n digits?

A number system with base *b* can write **bⁿ different values** with *n* digits, from 0 up to **bⁿ − 1**. With 3 denary digits we can write 10³ = 1000 values, 000 to 999. With **n bits** we can write **2ⁿ** values, from 0 to 2ⁿ − 1. This is the **range** of an unsigned binary number, and it is often asked in exams because it decides how many colours, characters or memory locations a system can represent.

:::compare Range of unsigned numbers
| Number of digits | Binary (bits) | Octal | Hexadecimal |
|---|---|---|---|
| 1 | 2 values: 0–1 | 8 values: 0–7 | 16 values: 0–F (0–15) |
| 2 | 4 values: 0–3 | 64 values: 0–77₈ (0–63) | 256 values: 0–FF (0–255) |
| 4 | 16 values: 0–15 | 4096 values | 65 536 values: 0–FFFF |
| 8 | 256 values: 0–255 | 16 777 216 values | 4 294 967 296 values |
| 16 | 65 536 values: 0–65 535 | — | — |
:::

Notice that **2 hex digits and 8 bits have the same range** (0 to 255), and 4 hex digits match 16 bits. That is not a coincidence — it is the reason hexadecimal is so convenient, and it is the subject of the next lesson.

:::example Worked example: how many bits for a school register?
A school in Karaganda wants to give every one of its 900 students a unique binary ID number. What is the smallest number of bits needed?

1. 9 bits give 2⁹ = **512** values — too few (512 < 900).
2. 10 bits give 2¹⁰ = **1024** values (0 to 1023) — enough, because 1024 ≥ 900.
3. Answer: **10 bits**. The largest ID would be 1111111111₂ = 1023₁₀, and 124 IDs are spare for new students.
4. In hexadecimal the IDs need **3 digits** (16² = 256 is too few, 16³ = 4096 is enough), because 10 bits round up to three nibbles.
:::

:::warning Common mistakes with number systems
- Saying the range of 8 bits is **0 to 256** — it is **0 to 255**: there are 256 values, but the first one is 0.
- Writing a digit that is **too big for the base**, such as 8 in an octal number or 2 in a binary number.
- Treating a hex letter as two digits: **F = 15 is one digit**; the hex number 15 is worth 21.
- Forgetting to show the base, so the examiner cannot tell whether 101 is binary or denary.
:::

# Converting between binary and denary
@lo 12.1.1.1

Binary ↔ denary is the most important conversion in the topic. Every other base can be reached through binary, and every exam paper has at least one question that needs it. There are two directions and, for denary → binary, two good methods. Choose one method you trust, but understand both, because a question may ask you to "show your working" in a particular way.

## Binary to denary: add the place values

A binary digit is either 0 or 1, so each bit either **adds its place value** to the total (bit = 1) or adds nothing (bit = 0). To convert binary to denary you therefore only need to **write the place values above the bits and add the place values under which there is a 1**. There is no multiplication to do, because multiplying by 1 or 0 is trivial.

:::steps Binary → denary
- Write the binary number with its bits under the place values, starting with **1 at the right**: …, 128, 64, 32, 16, 8, 4, 2, 1.
- Make sure the **rightmost bit is under 1** — line the number up from the right, not from the left.
- **Add** the place values of every bit that is **1**; ignore the 0 bits.
- Check: an **odd** binary number ends in 1; an even one ends in 0.
:::

:::example Worked example: 1011011₂ to denary
The number has 7 bits, so the leftmost place is 64.

| 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 1 | 1 |

Add the place values with a 1: 64 + 16 + 8 + 2 + 1 = **91₁₀**. The last bit is 1, so the answer must be odd — and 91 is odd. ✓
:::

A quicker mental method for long numbers is **doubling**: start with 0, and for each bit from the left, double the running total and add the bit. For 1011011: 0→1, 1→2, 2→5, 5→11, 11→22, 22→45, 45→91. This works because each step moves every earlier bit one place to the left, which doubles its value. It is a nice check, but in an exam the place-value table is clearer to the examiner.

## Denary to binary: method 1 — subtract place values

The first method works like paying an amount with the largest possible banknotes. Find the **largest place value that fits** into the number, write a 1 under it, subtract it, and repeat with what remains. Every place value that does not fit gets a 0.

:::steps Denary → binary by subtraction
- Write the place values 128, 64, 32, 16, 8, 4, 2, 1 (add 256, 512, 1024 … for bigger numbers).
- Find the **largest place value ≤ the number**; write 1 under it and **subtract** it.
- Move right: for each place, write **1 if it fits** into what remains (and subtract), otherwise **0**.
- Stop when the remainder is 0; fill all remaining places with 0.
- Check by adding the place values of the 1s — you must get the original number.
:::

:::example Worked example: 183₁₀ to binary (subtraction)
183 − 128 = 55 → 64 does not fit (0) → 55 − 32 = 23 → 23 − 16 = 7 → 8 does not fit (0) → 7 − 4 = 3 → 3 − 2 = 1 → 1 − 1 = 0

| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 0 | 1 | 1 | 1 |

183₁₀ = **10110111₂**. Check: 128 + 32 + 16 + 4 + 2 + 1 = 183 ✓
:::

## Denary to binary: method 2 — repeated division by 2

The second method does not need you to remember place values, so it is ideal for large numbers. **Divide the number by 2** and write down the **remainder** (always 0 or 1). Divide the **quotient** by 2 again, and keep going until the quotient is 0. The remainders, **read from the bottom up**, are the binary number.

Why bottom up? The first remainder tells us whether the number is odd or even — that is the **rightmost bit** (the 1s place). Dividing by 2 shifts the number one place to the right, so the next remainder is the 2s bit, then the 4s bit, and so on. The last remainder is the **most significant bit**, so it is written first.

:::svg Repeated division by 2: 92 in denary becomes 1011100 in binary
<svg class="nrm" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A division ladder for 92. 92 divided by 2 is 46 remainder 0; 46 divided by 2 is 23 remainder 0; 23 divided by 2 is 11 remainder 1; 11 divided by 2 is 5 remainder 1; 5 divided by 2 is 2 remainder 1; 2 divided by 2 is 1 remainder 0; 1 divided by 2 is 0 remainder 1. An arrow runs up the remainder column from the bottom to the top, showing the remainders are read bottom up to give 1011100. The first remainder is the least significant bit and the last remainder is the most significant bit.">
  <style>
    svg.nrm .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nrm .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nrm .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.nrm .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nrm .up{stroke:var(--success);stroke-width:3;fill:none}
  </style>
  <defs><marker id="nrmA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <text class="h" x="120" y="26" text-anchor="middle">Divide</text>
  <text class="h" x="260" y="26" text-anchor="middle">Quotient</text>
  <text class="h" x="380" y="26" text-anchor="middle">Remainder</text>
  <rect class="bx" x="40" y="38" width="400" height="266" rx="8"/>
  <text class="t" x="120" y="64" text-anchor="middle">92 ÷ 2</text><text class="t" x="260" y="64" text-anchor="middle">46</text><text class="h" x="380" y="64" text-anchor="middle">0</text>
  <text class="t" x="120" y="100" text-anchor="middle">46 ÷ 2</text><text class="t" x="260" y="100" text-anchor="middle">23</text><text class="h" x="380" y="100" text-anchor="middle">0</text>
  <text class="t" x="120" y="136" text-anchor="middle">23 ÷ 2</text><text class="t" x="260" y="136" text-anchor="middle">11</text><text class="h" x="380" y="136" text-anchor="middle">1</text>
  <text class="t" x="120" y="172" text-anchor="middle">11 ÷ 2</text><text class="t" x="260" y="172" text-anchor="middle">5</text><text class="h" x="380" y="172" text-anchor="middle">1</text>
  <text class="t" x="120" y="208" text-anchor="middle">5 ÷ 2</text><text class="t" x="260" y="208" text-anchor="middle">2</text><text class="h" x="380" y="208" text-anchor="middle">1</text>
  <text class="t" x="120" y="244" text-anchor="middle">2 ÷ 2</text><text class="t" x="260" y="244" text-anchor="middle">1</text><text class="h" x="380" y="244" text-anchor="middle">0</text>
  <text class="t" x="120" y="280" text-anchor="middle">1 ÷ 2</text><text class="t" x="260" y="280" text-anchor="middle">0 (stop)</text><text class="h" x="380" y="280" text-anchor="middle">1</text>
  <line class="up" x1="420" y1="284" x2="420" y2="52" marker-end="url(#nrmA1)"/>
  <text class="s" x="470" y="64">first remainder = least significant bit (1s)</text>
  <text class="s" x="470" y="280">last remainder = most significant bit (64s)</text>
  <text class="h" x="470" y="160">Read bottom up:</text>
  <rect class="ok" x="470" y="174" width="250" height="44" rx="8"/>
  <text class="h" x="595" y="202" text-anchor="middle">92₁₀ = 1011100₂</text>
  <text class="s" x="470" y="244">Check: 64 + 16 + 8 + 4 = 92 ✓</text>
</svg>
:::

:::compare Two methods for denary → binary
| | Subtracting place values | Repeated division by 2 |
|---|---|---|
| **How it works** | Take away the largest power of 2 that fits, repeat | Divide by 2, keep the remainders, read them bottom up |
| **You need to know** | The place values 1, 2, 4 … 128, 256 … | Only how to halve a number |
| **Best for** | Numbers up to about 1000; quick mental work | Large numbers; the same method works for any base (÷ 8, ÷ 16) |
| **Typical error** | Missing a place (forgetting a 0) | Reading the remainders top down |
| **Self-check** | Add the place values of the 1s | Count the bits: 2ⁿ⁻¹ ≤ number < 2ⁿ |
:::

## Leading zeros and fixed lengths

Computers store numbers in a **fixed number of bits**, for example one byte. A value smaller than 128 does not need all 8 bits, so the unused places on the left are filled with **leading zeros**: 92 in one byte is **01011100**. Leading zeros do not change the value (just as 007 is still seven), but an exam question that says "in 8 bits" or "as a byte" expects you to write all 8 bits. Zeros on the **right** are different — they change the value: 1011100 is 92, but 10111000 is 184, because every bit moved one place to the left and doubled.

:::definition Most and least significant bit
The **most significant bit (MSB)** is the **leftmost** bit, which has the largest place value. The **least significant bit (LSB)** is the **rightmost** bit, with place value 1; it shows whether the number is odd (1) or even (0).
:::

## Why binary is used — and why people need help with it

Binary is ideal for hardware: it needs only two clearly different states, which are cheap to build, fast to switch and easy to tell apart even when there is electrical noise. For people, however, binary is awkward. A single byte is eight characters long, a memory address in a modern computer is 64 bits, and strings of 0s and 1s all look alike, so it is easy to drop or swap a bit when reading or copying. That is why the next sections introduce octal and hexadecimal: they keep a simple link to binary but are much shorter.

:::example Worked example: a student's exam result in a byte
A school system in Shymkent stores each test score as an unsigned 8-bit integer. Daniyar scored **74** and Aigerim's score is stored as **01100011**.

1. 74 → binary by division: 74 ÷ 2 = 37 r 0; 37 ÷ 2 = 18 r 1; 18 ÷ 2 = 9 r 0; 9 ÷ 2 = 4 r 1; 4 ÷ 2 = 2 r 0; 2 ÷ 2 = 1 r 0; 1 ÷ 2 = 0 r 1.
2. Read bottom up: 1001010 — that is 7 bits, so add one leading zero: **01001010**.
3. Check: 64 + 8 + 2 = 74 ✓.
4. Aigerim: 0 1 1 0 0 0 1 1 under 128 64 32 16 8 4 2 1 → 64 + 32 + 2 + 1 = **99**.
5. The largest score a byte can hold is 11111111₂ = **255**, so scores out of 100 fit easily.
:::

:::warning Common mistakes in binary ↔ denary
- Lining the bits up from the **left**, so the last bit is not under 1. Always align from the **right**.
- Reading the division remainders **top down** — that gives the number backwards.
- Stopping the division too early: carry on until the **quotient is 0** (the last step 1 ÷ 2 = 0 r 1 gives the MSB).
- Adding zeros on the right "to make 8 bits" — padding goes on the **left**.
:::

# Octal and hexadecimal to and from denary
@lo 12.1.1.1

The methods of the previous section work for **any base**. To convert **into denary**, multiply each digit by its place value and add. To convert **from denary**, either subtract place values or — far easier for bases 8 and 16 — use **repeated division by the base** and read the remainders bottom up. The only new difficulty is that the place values grow much faster (×8 or ×16 per place) and that hexadecimal digits 10–15 are written as letters.

:::definition Octal
The **base-8** number system, with digits **0–7** and place values 1, 8, 64, 512, 4096 …. One octal digit represents exactly **3 bits**, because 8 = 2³.
:::

:::definition Hexadecimal
The **base-16** number system, with digits **0–9 and A–F** (A = 10 … F = 15) and place values 1, 16, 256, 4096 …. One hexadecimal digit represents exactly **4 bits** (a nibble), because 16 = 2⁴.
:::

## Octal and hexadecimal to denary

:::steps Octal or hexadecimal → denary
- Write the place values above the digits, starting with **1 at the right**: octal 512, 64, 8, 1; hex 4096, 256, 16, 1.
- In hex, change any letter into its value first (A = 10, B = 11, C = 12, D = 13, E = 14, F = 15).
- **Multiply** each digit by its place value.
- **Add** the products. Show each product — method marks are given for the working.
:::

:::svg Hexadecimal 1A3 to denary: digit × place value, then add
<svg class="nrm" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The hexadecimal number 1A3 is written in three boxes under place values 256, 16 and 1. The digit 1 times 256 gives 256. The digit A, which is 10, times 16 gives 160. The digit 3 times 1 gives 3. The three products are added: 256 plus 160 plus 3 equals 419 in denary.">
  <style>
    svg.nrm .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nrm .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nrm .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nrm .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nrm .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="nrmA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="s" x="150" y="30" text-anchor="middle">place 16² = 256</text>
  <text class="s" x="330" y="30" text-anchor="middle">place 16¹ = 16</text>
  <text class="s" x="510" y="30" text-anchor="middle">place 16⁰ = 1</text>
  <rect class="pb" x="110" y="40" width="80" height="50" rx="6"/><text class="h" x="150" y="71" text-anchor="middle">1</text>
  <rect class="pb" x="290" y="40" width="80" height="50" rx="6"/><text class="h" x="330" y="71" text-anchor="middle">A</text>
  <rect class="pb" x="470" y="40" width="80" height="50" rx="6"/><text class="h" x="510" y="71" text-anchor="middle">3</text>
  <line class="ln" x1="150" y1="92" x2="150" y2="122" marker-end="url(#nrmA2)"/>
  <line class="ln" x1="330" y1="92" x2="330" y2="122" marker-end="url(#nrmA2)"/>
  <line class="ln" x1="510" y1="92" x2="510" y2="122" marker-end="url(#nrmA2)"/>
  <rect class="bx" x="80" y="126" width="140" height="40" rx="6"/><text class="t" x="150" y="151" text-anchor="middle">1 × 256 = 256</text>
  <rect class="bx" x="250" y="126" width="160" height="40" rx="6"/><text class="t" x="330" y="151" text-anchor="middle">A = 10 → 10 × 16 = 160</text>
  <rect class="bx" x="440" y="126" width="140" height="40" rx="6"/><text class="t" x="510" y="151" text-anchor="middle">3 × 1 = 3</text>
  <rect class="ok" x="180" y="190" width="400" height="44" rx="8"/>
  <text class="h" x="380" y="218" text-anchor="middle">256 + 160 + 3 = 419₁₀</text>
  <text class="s" x="680" y="70" text-anchor="middle">1A3₁₆</text>
</svg>
:::

:::example Worked example: converting octal and hex values to denary
- **267₈** = 2 × 64 + 6 × 8 + 7 × 1 = 128 + 48 + 7 = **183₁₀**
- **755₈** (a Linux permission) = 7 × 64 + 5 × 8 + 5 = 448 + 40 + 5 = **493₁₀**
- **B7₁₆** = 11 × 16 + 7 = 176 + 7 = **183₁₀**
- **3E9₁₆** = 3 × 256 + 14 × 16 + 9 = 768 + 224 + 9 = **1001₁₀**
- **FF₁₆** = 15 × 16 + 15 = 240 + 15 = **255₁₀** — the largest value of one byte.

Notice that 10110111₂, 267₈, B7₁₆ and 183₁₀ are **the same number** written in four systems.
:::

## Denary to octal and hexadecimal: repeated division

To convert a denary number into base 8 or base 16, divide by the base and keep the remainders, exactly as you divided by 2 for binary. Each remainder is one digit of the answer and must be **smaller than the base**. In hexadecimal, a remainder of 10–15 must be written as the **letter** A–F. Read the remainders **from the bottom up**.

:::steps Denary → octal or hexadecimal by repeated division
- Divide the denary number by the base (**8** for octal, **16** for hex). Write the **quotient** and the **remainder**.
- Divide the quotient by the base again; repeat until the quotient is **0**.
- In hex, write remainders 10–15 as **A–F**.
- Read the remainders **from the last to the first** (bottom up) — that is the answer.
- Check by converting back: digit × place value, then add.
:::

For numbers up to 255 there is a quicker hex method: divide by 16 once. The **whole-number quotient is the first hex digit** and the **remainder is the second**. For 183: 183 ÷ 16 = 11 remainder 7 (11 × 16 = 176, 183 − 176 = 7), so the digits are 11 = B and 7: **B7₁₆**. You can also go **via binary**: convert to binary first, then group the bits into nibbles (next lesson). Many students find that route the most reliable because it avoids long division by 16.

:::example Worked example: the year 1991 in octal and hexadecimal
Kazakhstan declared independence in **1991**. Convert 1991₁₀ to hexadecimal and to octal.

**Hexadecimal** (÷ 16):

| Divide | Quotient | Remainder | Hex digit |
|---|---|---|---|
| 1991 ÷ 16 | 124 | 7 | 7 |
| 124 ÷ 16 | 7 | 12 | C |
| 7 ÷ 16 | 0 | 7 | 7 |

Read bottom up: **7C7₁₆**. Check: 7 × 256 + 12 × 16 + 7 = 1792 + 192 + 7 = 1991 ✓

**Octal** (÷ 8): 1991 ÷ 8 = 248 r **7**; 248 ÷ 8 = 31 r **0**; 31 ÷ 8 = 3 r **7**; 3 ÷ 8 = 0 r **3** → bottom up: **3707₈**. Check: 3 × 512 + 7 × 64 + 0 × 8 + 7 = 1536 + 448 + 0 + 7 = 1991 ✓
:::

## Choosing a route

When a question asks you to convert between two non-denary bases, such as octal to hexadecimal, there is no direct method. Go through **binary** (octal → binary in groups of 3, then regroup in 4s → hex) or through **denary** (octal → denary → hex). Through binary is usually faster and has fewer arithmetic steps. The flowchart summarises which method to use.

:::mermaid Which conversion method to use
flowchart TD
  A[Number to convert] --> B{Is the target denary?}
  B -- Yes --> C[Multiply each digit by its place value and add]
  B -- No --> D{Is the starting number denary?}
  D -- Yes --> E[Repeated division by the target base, read remainders bottom up]
  D -- No --> F{Binary to or from octal or hex?}
  F -- Yes --> G[Group bits: 3 per octal digit, 4 per hex digit, from the right]
  F -- No --> H[Go via binary: octal to binary in 3s, regroup in 4s to hex]
:::

:::compare Conversion methods at a glance
| From → to | Method | Example |
|---|---|---|
| Binary → denary | Add the place values of the 1 bits | 1011011 → 64 + 16 + 8 + 2 + 1 = 91 |
| Denary → binary | Subtract powers of 2, or divide by 2 repeatedly | 92 → 1011100 |
| Octal → denary | Digit × 512, 64, 8, 1, then add | 267₈ → 128 + 48 + 7 = 183 |
| Denary → octal | Divide by 8 repeatedly, remainders bottom up | 1991 → 3707₈ |
| Hex → denary | Digit × 4096, 256, 16, 1, then add (A = 10 … F = 15) | 3E9 → 768 + 224 + 9 = 1001 |
| Denary → hex | Divide by 16 repeatedly (or via binary) | 1991 → 7C7₁₆ |
| Binary ↔ octal | Groups of **3** bits from the right | 10 110 111 → 267₈ |
| Binary ↔ hex | Groups of **4** bits from the right | 1011 0111 → B7₁₆ |
:::

## Binary and octal: groups of three

Because 8 = 2³, each octal digit stands for exactly **three bits**. To convert binary to octal, split the bits into **groups of 3 from the right**, pad the left group with zeros, and replace each group with its value 0–7. To convert octal to binary, replace each digit with its 3-bit pattern. This is the method behind **Linux file permissions**: `chmod 755` means owner = 7 = **111** (read, write, execute), group = 5 = **101** (read, execute), others = 5 = **101**. Three bits per user, one octal digit per user — octal fits the permissions perfectly.

:::compare One value in every base
| Denary | Binary | Octal | Hexadecimal |
|---|---|---|---|
| 45 | 101101 | 55 | 2D |
| 91 | 1011011 | 133 | 5B |
| 156 | 10011100 | 234 | 9C |
| 183 | 10110111 | 267 | B7 |
| 255 | 11111111 | 377 | FF |
| 1991 | 11111000111 | 3707 | 7C7 |
:::

:::warning Common mistakes in octal and hexadecimal conversions
- Writing a remainder of 12 as "12" in a hex answer — it must be the **single digit C**.
- Using place values 1, 10, 100 or 1, 8, 16 for octal — octal places are **1, 8, 64, 512**; hex places are **1, 16, 256, 4096**.
- Dividing 183 by 16 and writing the answer as a decimal, 11.4375 — you need the **whole-number quotient and the remainder**.
- Forgetting to convert letters before multiplying: in 3E9, E must be treated as **14**.
- Writing a digit 8 or 9 in an octal answer — impossible, every octal digit is 0–7.
:::

:::widget base_converter Check your conversions between bases
:::

# Exam practice: number systems and denary conversions
@lo 12.1.1.1

:::example Exam-style questions with model answers
**Q: State the number of different values that can be represented with 6 bits, and the largest unsigned value. [2]**
2⁶ = **64** values (1); largest = 2⁶ − 1 = **63** (111111₂) (1).

**Q: Convert 01011011₂ to denary. Show your working. [2]**
Place values 64, 16, 8, 2, 1 are under 1 bits (1); 64 + 16 + 8 + 2 + 1 = **91** (1).

**Q: Convert 156₁₀ to binary. Show your working. [2]**
156 − 128 = 28 → 28 − 16 = 12 → 12 − 8 = 4 → 4 − 4 = 0 / or repeated division with remainders 0,0,1,1,1,0,0,1 (1); **10011100₂** (1).

**Q: Convert 92₁₀ into (i) octal (ii) hexadecimal. [2]**
(i) 92 ÷ 8 = 11 r 4; 11 ÷ 8 = 1 r 3; 1 ÷ 8 = 0 r 1 → **134₈** (1). (ii) 92 ÷ 16 = 5 r 12 → **5C₁₆** (1).

**Q: Convert 3E9₁₆ and 745₈ to denary. [2]**
3 × 256 + 14 × 16 + 9 = **1001** (1); 7 × 64 + 4 × 8 + 5 = 448 + 32 + 5 = **485** (1).

**Q: A digital thermometer stores readings in 7 bits. Explain whether it can store a reading of 130. [2]**
7 bits store values from 0 to 2⁷ − 1 = **127** (1); 130 is larger than 127 so it **cannot** be stored — at least 8 bits are needed (1).
:::

:::warning Common mistakes in exam answers
- Giving only the final answer when the question says **"show your working"** — the method marks are lost.
- Writing 256 instead of **255** as the largest 8-bit value.
- Not showing the base of the answer (write 134₈, 5C₁₆).
- Reading division remainders top down.
:::

:::steps Check yourself
- What is the base of octal and which digits does it use?
- Write the place values of an 8-bit binary number.
- Convert 11001000₂ to denary.
- Convert 200₁₀ to binary using repeated division.
- Convert 4D₁₆ and 157₈ to denary.
- Convert 500₁₀ to octal and to hexadecimal.
- How many bits are needed to give 3000 different values?
:::

# Converting between binary and hexadecimal
@lo 12.1.1.1

In the previous lesson every conversion went through denary and needed multiplication or division. Between binary and hexadecimal there is a much simpler link: **no arithmetic at all** is needed, only a table of sixteen 4-bit patterns. This direct link is the main reason hexadecimal exists, so understanding it is also the key to the second learning objective — explaining why hexadecimal is used.

## Why one hex digit equals four bits

Four bits can be arranged in 2⁴ = **16** different patterns, from 0000 to 1111. Hexadecimal has exactly **16 digits**, from 0 to F. So every 4-bit pattern has **its own hex digit**, and every hex digit stands for **exactly one** 4-bit pattern. A group of 4 bits is called a **nibble**, and one byte is two nibbles, so **one byte is always exactly two hex digits**: 00 to FF. Denary has no such link: 10 is not a power of 2, so a denary digit does not match a fixed number of bits, and converting denary ↔ binary always needs calculation.

:::definition Nibble
A group of **4 bits** (half a byte). A nibble has 2⁴ = 16 possible values, so it is represented by **exactly one hexadecimal digit**.
:::

:::compare Nibble ↔ hexadecimal ↔ denary (learn this table)
| Binary | Hex | Denary | Binary | Hex | Denary |
|---|---|---|---|---|---|
| 0000 | 0 | 0 | 1000 | 8 | 8 |
| 0001 | 1 | 1 | 1001 | 9 | 9 |
| 0010 | 2 | 2 | 1010 | A | 10 |
| 0011 | 3 | 3 | 1011 | B | 11 |
| 0100 | 4 | 4 | 1100 | C | 12 |
| 0101 | 5 | 5 | 1101 | D | 13 |
| 0110 | 6 | 6 | 1110 | E | 14 |
| 0111 | 7 | 7 | 1111 | F | 15 |
:::

You do not need to memorise the table blindly. Each nibble has place values **8 4 2 1**, so 1011 = 8 + 2 + 1 = 11 = B, and 1101 = 8 + 4 + 1 = 13 = D. Anything with value 10–15 becomes a letter. With practice you will recognise the common ones immediately: 1111 = F, 1010 = A, 1000 = 8, 0111 = 7.

## Binary to hexadecimal

:::steps Binary → hexadecimal
- Split the binary number into **groups of 4 bits, starting from the right** (the least significant bit).
- If the leftmost group has fewer than 4 bits, **pad it with leading zeros**.
- Replace **each group** with its hex digit (8 4 2 1 inside the group; 10–15 → A–F).
- Write the digits in the same order. Do not drop a 0 digit in the middle.
:::

:::svg Binary to hexadecimal by grouping bits into nibbles from the right
<svg class="nrm" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The 10-bit binary number 1111101001 is split from the right into groups of four: 1001, 1110 and the leftover 11. The leftover group is padded with two leading zeros to 0011. Each nibble is converted using place values 8 4 2 1: 0011 is 3, 1110 is 8 plus 4 plus 2 which is 14, written E, and 1001 is 8 plus 1 which is 9. The result is 3E9 in hexadecimal.">
  <style>
    svg.nrm .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nrm .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nrm .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.nrm .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nrm .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="nrmA3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="20" y="28">1  Binary number:</text>
  <text class="h" x="200" y="28">1111101001₂</text>
  <text class="s" x="330" y="28">(10 bits)</text>
  <text class="h" x="20" y="74">2  Group in 4s from the right:</text>
  <rect class="wn" x="260" y="52" width="130" height="36" rx="6"/><text class="h" x="325" y="76" text-anchor="middle">00 11</text>
  <rect class="pb" x="410" y="52" width="130" height="36" rx="6"/><text class="h" x="475" y="76" text-anchor="middle">1110</text>
  <rect class="pb" x="560" y="52" width="130" height="36" rx="6"/><text class="h" x="625" y="76" text-anchor="middle">1001</text>
  <text class="s" x="325" y="106" text-anchor="middle">padded with 2 zeros</text>
  <text class="s" x="625" y="106" text-anchor="middle">start here ←</text>
  <line class="ln" x1="325" y1="114" x2="325" y2="144" marker-end="url(#nrmA3)"/>
  <line class="ln" x1="475" y1="114" x2="475" y2="144" marker-end="url(#nrmA3)"/>
  <line class="ln" x1="625" y1="114" x2="625" y2="144" marker-end="url(#nrmA3)"/>
  <text class="h" x="20" y="172">3  8 4 2 1 in each group:</text>
  <text class="t" x="325" y="170" text-anchor="middle">2 + 1 = 3</text>
  <text class="t" x="475" y="170" text-anchor="middle">8 + 4 + 2 = 14</text>
  <text class="t" x="625" y="170" text-anchor="middle">8 + 1 = 9</text>
  <text class="h" x="20" y="222">4  Hex digits:</text>
  <rect class="ok" x="290" y="198" width="70" height="40" rx="6"/><text class="h" x="325" y="224" text-anchor="middle">3</text>
  <rect class="ok" x="440" y="198" width="70" height="40" rx="6"/><text class="h" x="475" y="224" text-anchor="middle">E</text>
  <rect class="ok" x="590" y="198" width="70" height="40" rx="6"/><text class="h" x="625" y="224" text-anchor="middle">9</text>
  <text class="h" x="475" y="274" text-anchor="middle">1111101001₂ = 3E9₁₆ (= 1001₁₀)</text>
</svg>
:::

:::example Worked example: binary → hexadecimal
- 1011 0111₂ → B (11) and 7 → **B7₁₆**
- 101 1011₂ → pad → **0101 1011** → 5 and B → **5B₁₆**
- 11 1110 1001₂ → **0011 1110 1001** → 3, E, 9 → **3E9₁₆**
- 1 0000 0110₂ → **0001 0000 0110** → 1, 0, 6 → **106₁₆** (the middle 0 must stay)
- 1111 1111 1111 1111₂ (16 bits) → **FFFF₁₆** — four hex digits instead of sixteen bits.
:::

## Hexadecimal to binary

The reverse direction is even easier: replace **every hex digit with its 4-bit pattern**, keeping the leading zeros of each nibble inside the number. Only zeros at the very front of the whole number may be dropped.

:::steps Hexadecimal → binary
- Take each hex digit separately (A–F first become 10–15).
- Write each one as **exactly 4 bits** (8 4 2 1), including leading zeros: 2 → 0010, not 10.
- Join the groups in the same order.
- Leading zeros at the start of the whole number may be dropped; zeros **inside** must stay.
:::

:::example Worked example: hex → binary from a computer's memory
A technician in Aktobe reads the byte values **2F**, **A0** and **1A3** in a diagnostic program.

1. 2F → 2 = **0010**, F = **1111** → **0010 1111₂** (= 101111₂ without the leading zeros).
2. A0 → A = **1010**, 0 = **0000** → **1010 0000₂**. The final 0000 must be written, otherwise the value would be 1010₂ = 10 instead of 160.
3. 1A3 → 1 = 0001, A = 1010, 3 = 0011 → **0001 1010 0011₂** = 110100011₂.
4. Check 1A3 via denary: 1 × 256 + 10 × 16 + 3 = 419, and 256 + 128 + 32 + 2 + 1 = 419 ✓
:::

## Binary, octal and hexadecimal side by side

Octal uses the same idea with groups of **3** bits. The same binary number therefore has a short octal form and an even shorter hex form. Converting octal ↔ hex goes through binary: write each octal digit as 3 bits, then regroup the bits in 4s from the right.

:::compare Grouping bits: octal vs hexadecimal
| | Octal | Hexadecimal |
|---|---|---|
| **Base** | 8 = 2³ | 16 = 2⁴ |
| **Bits per digit** | 3 | 4 (a nibble) |
| **Digits per byte** | Does not divide evenly (8 bits = 2⅔ digits) | Exactly **2** |
| **Example: 10110111₂** | 010 110 111 → 267₈ | 1011 0111 → B7₁₆ |
| **Typical use today** | Unix/Linux file permissions | Colours, memory addresses, MAC and IPv6 addresses, machine code |
:::

The last two rows explain why hexadecimal won: modern computers use **8-bit bytes** and words of 16, 32 or 64 bits — all multiples of 4 but not of 3. A byte splits neatly into two hex digits, while in octal a byte needs three digits and the first digit only uses 2 bits.

:::example Worked example: octal → hexadecimal through binary
Convert **755₈** to hexadecimal.

1. Each octal digit → 3 bits: 7 = 111, 5 = 101, 5 = 101 → **111 101 101₂**.
2. Regroup from the right in 4s: 1 1110 1101 → **0001 1110 1101**.
3. Each nibble → hex: 1, E, D → **1ED₁₆**.
4. Check through denary: 755₈ = 493; 1ED₁₆ = 256 + 14 × 16 + 13 = 256 + 224 + 13 = 493 ✓
:::

:::warning Common mistakes in binary ↔ hexadecimal
- Grouping from the **left**: 1011011 grouped as 1011 011 gives B3, which is wrong; from the right it is 0101 1011 = **5B**.
- Writing a nibble with fewer than 4 bits in the middle of a number: 2F written as 10 1111 instead of **0010 1111**.
- Dropping a zero digit: 0001 0000 0110 is **106**, not 16.
- Writing a group value such as 12 instead of the letter **C**.
:::

# Why hexadecimal is used in computer systems
@lo 12.1.1.2

Hexadecimal is not used **by the computer**. The processor, memory and storage hold everything in **binary** and know nothing about hex. Hexadecimal is used **by people** — programmers, network engineers, web designers and technicians — whenever they need to read, write or talk about binary values. It is a **human-friendly shorthand for binary**. An exam answer that says "hex makes the computer faster" or "hex uses less memory" earns no marks; an answer that compares hex with binary **from the point of view of a person** does.

:::definition Hexadecimal as a representation
Hexadecimal is a **way of displaying binary values to humans**: each hex digit is a short name for one nibble. The data inside the computer remains **binary**; converting it to hex changes how it is **shown**, not how it is **stored**.
:::

## Advantage 1: shorter

Every hex digit replaces **four** binary digits, so a value written in hex is **four times shorter** than in binary. One byte is 2 hex digits instead of 8 bits; a 32-bit memory address is 8 hex digits instead of 32 bits; a 128-bit IPv6 address is 32 hex digits instead of 128 bits. Shorter values fit on a screen, in an error message or in a printed listing, and they are quicker to type. Hex is also shorter than denary for large values: the largest 32-bit number is FFFFFFFF (8 digits) in hex but 4 294 967 295 (10 digits) in denary.

## Advantage 2: easier for people to read, remember and copy — fewer errors

Long strings of 0s and 1s all look alike. When a person reads 0111111111101001 aloud or copies it from a screen, it is very easy to **skip, repeat or swap a bit** without noticing. The same value in hex, **7FE9**, has only four characters with different shapes, so it is easier to read, to remember for a few seconds, to compare with another value and to copy correctly. Fewer characters mean **fewer human errors** when entering data, writing documentation or debugging. In an exam, explain this as a chain: hex is shorter → so it is easier to read and copy → so fewer mistakes are made.

## Advantage 3: easy and exact conversion to and from binary

Because **one hex digit = exactly 4 bits**, converting between hex and binary is a simple look-up of 16 patterns, which a person can do in their head and a computer can do with almost no work. Denary does not have this property: converting denary to binary needs repeated division, and the digits of a denary number do not line up with groups of bits. With hex, a person can see **which bits are set** in each nibble: 0x80 means "only the top bit of the byte is 1", 0x0F means "the low four bits are 1". This makes hex perfect for working with **flags, masks and individual bits**.

## Advantage 4: matches the way computers group data

Computers store data in **bytes**, and memory addresses, registers and instructions are 8, 16, 32 or 64 bits wide. All of these are multiples of 4, so they are always a **whole number of hex digits**: a byte is always 2 digits, a 16-bit value 4 digits, a 32-bit value 8 digits. Each byte in a memory dump therefore appears as one neat pair of hex digits, and you can find the boundaries between bytes at a glance. Octal does not fit bytes this neatly, and denary does not fit them at all.

:::svg The same four bytes shown in binary, denary and hexadecimal
<svg class="nrm" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four bytes stored in memory are shown three ways. In binary they take 32 characters: 10111000 00000100 00000000 11001101, which is long and easy to misread. In denary they are 184 4 0 205, where the digits do not line up with bits. In hexadecimal they are B8 04 00 CD: exactly two digits per byte, eight characters in total, and each digit maps to four bits. A note says the memory itself stores only the binary.">
  <style>
    svg.nrm .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .t{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nrm .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nrm .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.nrm .bx{fill:var(--surface-2);stroke:var(--warning);stroke-width:1.5}
    svg.nrm .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nrm .mem{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
  </style>
  <text class="h" x="20" y="28">Stored in memory (the hardware only holds bits)</text>
  <rect class="mem" x="20" y="40" width="720" height="40" rx="6"/>
  <text class="t" x="380" y="65" text-anchor="middle">10111000 00000100 00000000 11001101</text>
  <text class="h" x="20" y="116">Binary — 32 characters</text>
  <rect class="bad" x="230" y="96" width="510" height="34" rx="6"/>
  <text class="t" x="485" y="118" text-anchor="middle">10111000000001000000000011001101</text>
  <text class="s" x="230" y="146">long, all characters look alike → easy to skip or swap a bit</text>
  <text class="h" x="20" y="186">Denary — 9 characters</text>
  <rect class="bx" x="230" y="166" width="510" height="34" rx="6"/>
  <text class="t" x="485" y="188" text-anchor="middle">184  4  0  205</text>
  <text class="s" x="230" y="216">digits do not line up with bits → conversion needs division</text>
  <text class="h" x="20" y="256">Hexadecimal — 8 characters</text>
  <rect class="ok" x="230" y="236" width="510" height="34" rx="6"/>
  <text class="t" x="485" y="258" text-anchor="middle">B8  04  00  CD</text>
  <text class="s" x="230" y="284">2 digits per byte, 1 digit per nibble → short and converts instantly</text>
</svg>
:::

:::compare Hexadecimal compared with binary and denary (for a person)
| Feature | Binary | Denary | Hexadecimal |
|---|---|---|---|
| Characters for one byte | 8 | 1–3 | Always 2 |
| Easy for people to read and copy | No — long, error-prone | Yes | Yes — short |
| Conversion to binary | — | Needs repeated division | Direct: 1 digit = 4 bits |
| Shows individual bits | Yes | No | Yes, per nibble |
| Fits bytes and words exactly | Yes | No | Yes |
| Used by the hardware | **Yes** | No | No |
:::

## What hexadecimal does not do

:::callout warning Hex is only for humans
Hexadecimal does **not** save memory, does **not** make processing faster and is **not** what the computer stores. A program written with the colour `#FF8000` and one written with the binary value 111111111000000000000000 produce **exactly the same bits** in memory. The benefit of hex is entirely on the human side: shorter, more readable, fewer mistakes, simple conversion.
:::

:::example Worked example: explaining an advantage for 4 marks
**Q: A programmer looks at the contents of a memory location. Explain two reasons why the contents are displayed in hexadecimal rather than binary.**

1. Identify the first advantage: hex is **shorter** — each hex digit represents 4 bits, so a byte is 2 characters instead of 8 (1).
2. Explain its effect: it is therefore **easier for the programmer to read and remember**, and **fewer errors** are made when copying the value (1).
3. Identify the second advantage: conversion between hex and binary is **simple** because each digit maps to exactly one nibble (1).
4. Explain its effect: the programmer can quickly work out **which bits are set**, which is much harder from denary (1).

Each advantage is **identified** and then **explained** — that is how an "explain" question earns both marks.
:::

:::warning Common mistakes when explaining hexadecimal
- "Hex uses less memory / storage" — **wrong**: data is always stored in binary.
- "The computer understands hex" or "hex is faster to process" — **wrong**: hex is only a representation for people.
- Saying only "it is easier" without saying **for whom** and **why** (shorter → fewer errors).
- Comparing hex with denary instead of binary when the question asks "rather than binary".
:::

# Hexadecimal in practice
@lo 12.1.1.2, 12.1.1.1

Hexadecimal appears wherever people work close to the binary inside computers. In each case the reason is the same — a long binary value becomes short and readable — but the details differ, and exam questions often describe one of these situations and ask you to convert a value or explain why hex is used.

## Colour codes in web pages and graphics

A colour on screen is mixed from **red, green and blue** light. In 24-bit colour each component is stored in **one byte**, 0–255, so a colour is 24 bits. In HTML and CSS it is written as **#RRGGBB**: two hex digits for red, two for green, two for blue. `#FF0000` is pure red (red 255, green 0, blue 0), `#000000` is black and `#FFFFFF` is white. Six hex digits are much easier to type and check than 24 bits, and the designer can still see each byte separately.

:::definition Hexadecimal colour code
A 24-bit colour written as **#RRGGBB**: three pairs of hex digits giving the **red, green and blue** intensities, each one **byte** from 00 (0, none) to FF (255, full).
:::

:::svg A 24-bit colour code: #1F4FD8 split into red, green and blue bytes
<svg class="nrm" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The CSS colour code hash 1F4FD8 is split into three pairs of hex digits. Red is 1F, which is 0001 1111 in binary and 31 in denary. Green is 4F, which is 0100 1111 in binary and 79 in denary. Blue is D8, which is 1101 1000 in binary and 216 in denary. Together they are 24 bits, written as 6 hex digits instead of 24 binary digits.">
  <style>
    svg.nrm .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nrm .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nrm .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nrm .r{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nrm .g{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nrm .b{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nrm .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="nrmA4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="380" y="30" text-anchor="middle">color: #1F4FD8;</text>
  <rect class="r" x="80" y="50" width="160" height="44" rx="6"/><text class="h" x="160" y="78" text-anchor="middle">1F</text>
  <rect class="g" x="300" y="50" width="160" height="44" rx="6"/><text class="h" x="380" y="78" text-anchor="middle">4F</text>
  <rect class="b" x="520" y="50" width="160" height="44" rx="6"/><text class="h" x="600" y="78" text-anchor="middle">D8</text>
  <text class="s" x="160" y="114" text-anchor="middle">Red byte</text>
  <text class="s" x="380" y="114" text-anchor="middle">Green byte</text>
  <text class="s" x="600" y="114" text-anchor="middle">Blue byte</text>
  <line class="ln" x1="160" y1="122" x2="160" y2="146" marker-end="url(#nrmA4)"/>
  <line class="ln" x1="380" y1="122" x2="380" y2="146" marker-end="url(#nrmA4)"/>
  <line class="ln" x1="600" y1="122" x2="600" y2="146" marker-end="url(#nrmA4)"/>
  <text class="m" x="160" y="170" text-anchor="middle">0001 1111</text>
  <text class="m" x="380" y="170" text-anchor="middle">0100 1111</text>
  <text class="m" x="600" y="170" text-anchor="middle">1101 1000</text>
  <text class="t" x="160" y="198" text-anchor="middle">1×16 + 15 = 31</text>
  <text class="t" x="380" y="198" text-anchor="middle">4×16 + 15 = 79</text>
  <text class="t" x="600" y="198" text-anchor="middle">13×16 + 8 = 216</text>
  <text class="s" x="380" y="240" text-anchor="middle">24 bits = 6 hex digits · each colour channel 00–FF (0–255) · 2²⁴ = 16 777 216 colours</text>
</svg>
:::

## Memory addresses, memory dumps and machine code

Every byte in main memory has an **address**, a binary number. On a 64-bit computer an address can be 64 bits long — far too long to read in binary. Debuggers, crash reports and assembly listings show addresses in hex, for example `0x7FFE4A10`. When a programmer views the **contents** of memory (a **memory dump**) or the **machine code** of a program, each byte is shown as two hex digits, such as `B8 04 00 CD 21`. This lets the programmer spot a wrong value, find an instruction or compare two dumps quickly.

:::definition Memory address
A **unique binary number that identifies one location (byte) in main memory**. People usually see it written in hexadecimal, e.g. `0x7FFE4A10`.
:::

:::definition Memory dump
A **display of the contents of an area of memory**, usually as rows of bytes written as **pairs of hex digits** next to their addresses; used for debugging.
:::

## Error codes and status codes

Operating systems and hardware report problems with **error codes** that are binary values in which groups of bits have meanings. Windows, for example, shows errors such as `0x80070005` ("access denied"). In hex the code is short enough to read out to a help desk or search for on the Internet, and the separate parts of the code (each a group of bits) line up with hex digits.

## Network addresses: MAC and IPv6

:::definition MAC address
A **48-bit physical address** that uniquely identifies a **network interface card**; written as **12 hexadecimal digits** in six pairs.
:::

A **MAC address** identifies a network interface card. It is **48 bits** long and is written as **12 hex digits** in six pairs, e.g. `3C:52:82:1A:9F:04`; each pair is one byte. An **IPv6 address** is **128 bits** and is written as 8 groups of 4 hex digits, e.g. `2001:0db8:0000:0000:0000:ff00:0042:8329`. Writing 128 bits in binary would make network configuration practically impossible for people.

## Character codes

Characters are stored as numbers (ASCII and Unicode). Their **code points** are listed in hex: the letter A is `U+0041` (65), and the Kazakh letter Ә is `U+04D8`. HTML lets you write a character by its hex code, for example `&#x04D8;`. Hex tables of characters are compact and line up with the bytes the text is stored in.

:::compare Uses of hexadecimal
| Use | Example | Binary size | Why hex |
|---|---|---|---|
| **Colour codes** (24-bit RGB) | `#1F4FD8` | 24 bits → 6 hex digits | Each colour byte is 2 digits; easy to type and adjust |
| **Memory addresses** | `0x7FFE4A10` | 32 or 64 bits | Long addresses become short and readable |
| **Memory dumps / machine code** | `B8 04 00 CD 21` | 1 byte per pair | Byte boundaries are clear; quick to spot values |
| **Error and status codes** | `0x80070005` | 32 bits | Compact to report; bit groups line up with digits |
| **MAC addresses** | `3C:52:82:1A:9F:04` | 48 bits → 12 hex digits | Short to write on labels and in settings |
| **IPv6 addresses** | `2001:0db8::ff00:42:8329` | 128 bits → 32 hex digits | Binary would be far too long |
| **Character codes** | `U+04D8` (Ә) | 16–21 bits | Code tables and HTML entities |
:::

:::example Worked example: working with a MAC address
A school network administrator in Astana sees the MAC address **3C:52:82:1A:9F:04** on a new laptop.

1. How many bits? 6 pairs × 2 hex digits = 12 digits × 4 bits = **48 bits**.
2. The first byte **3C** in binary: 3 = 0011, C = 1100 → **00111100**.
3. The last byte **04** in denary: 0 × 16 + 4 = **4**.
4. Written in binary the address would need **48 characters** instead of 17 (with colons), so the administrator could easily mistype it when adding it to the allowed-devices list. Hex makes the address shorter and errors less likely.
:::

## Changing a colour in CSS

:::example Worked example: making a colour darker
A student designs a web page for a Kostanay school club. The heading colour is **#40A0E0**. They want each component halved to make it darker.

1. Split into bytes: red **40**, green **A0**, blue **E0**.
2. To denary: 40₁₆ = 4 × 16 = **64**; A0₁₆ = 10 × 16 = **160**; E0₁₆ = 14 × 16 = **224**.
3. Halve each: 32, 80, 112.
4. Back to hex: 32 = 2 × 16 + 0 → **20**; 80 = 5 × 16 + 0 → **50**; 112 = 7 × 16 + 0 → **70**.
5. The new colour is **#205070**. (In binary halving is just a shift right by one place: 01000000 → 00100000.)
:::

```css | Colours in CSS are written as hexadecimal bytes
h1      { color: #205070; }   /* red 20, green 50, blue 70 */
.alert  { color: #FF0000; }   /* pure red: 255, 0, 0 */
.notice { background: #FFFF00; } /* red + green = yellow */
```

:::mermaid How a hex value is used inside the computer
flowchart LR
  A[Person types #FF8000 or 0x7FFE] --> B[Compiler / browser converts to binary]
  B --> C[Stored and processed as bits 1111 1111 1000 0000 ...]
  C --> D[Debugger / tool converts back to hex for display]
  D --> E[Person reads the short hex value]
:::

The flowchart shows the key idea of the whole topic: **hexadecimal lives only at the edges**, where people meet the machine. Between those edges, all storage and processing is binary.

:::warning Common mistakes with hexadecimal uses
- Saying a MAC address is 12 bits — it is **12 hex digits = 48 bits**.
- Reading a colour code as one big number instead of **three separate bytes** (RR, GG, BB).
- Thinking `#FFFFFF` is black — FF in every channel is full brightness, so it is **white**; `#000000` is black.
- Forgetting that each hex pair is **one byte**, so a 6-digit colour is 3 bytes = 24 bits.
:::

# Exam practice: hexadecimal in computer systems
@lo 12.1.1.1, 12.1.1.2

:::example Exam-style questions with model answers
**Q: Convert 1011011101₂ to hexadecimal. Show your working. [2]**
Groups from the right: 0010 1101 1101 (1); **2DD₁₆** (1).

**Q: Convert A7₁₆ to binary and to denary. [2]**
A = 1010, 7 = 0111 → **10100111₂** (1); 10 × 16 + 7 = **167₁₀** (1).

**Q: Explain why one hexadecimal digit can represent exactly one nibble. [2]**
A nibble is 4 bits, which have 2⁴ = **16** possible patterns (1); hexadecimal has **16 digits** (0–F), so each pattern matches exactly one digit (1).

**Q: Explain two advantages of using hexadecimal rather than binary to display the contents of memory. [4]**
Hex is **shorter** — 2 digits per byte instead of 8 bits (1) — so it is **easier for people to read/remember and fewer errors** are made when copying (1). It is **easy to convert** to and from binary (1) because each hex digit maps directly to **4 bits**, so the bits can still be seen (1).

**Q: The colour of a heading is #3C9F00. State the denary value of the green component and the number of bits used for the whole colour. [2]**
9F = 9 × 16 + 15 = **159** (1); 6 hex digits × 4 = **24 bits** (1).

**Q: A student says "computers store data in hexadecimal because it uses less memory". Explain why the student is wrong. [2]**
Computers store all data in **binary** (1); hex is only a **representation for humans** — the same bits are stored whichever way the value is written, so no memory is saved (1).
:::

:::warning Common mistakes in exam answers
- Listing an advantage ("it's shorter") without the **explanation** ("so fewer errors when people copy it").
- Claiming hex saves memory or speeds up the processor.
- Grouping bits from the left when converting to hex.
- Writing hex values 10–15 as two digits.
:::

:::steps Check yourself
- Why is one hex digit equal to 4 bits?
- Convert 110101110₂ to hexadecimal.
- Convert 5E₁₆ to binary and to denary.
- Convert 641₈ to hexadecimal through binary.
- Give four places where hex is used and explain why for one of them.
- Explain why hex is preferred to denary for showing machine code.
- Split the colour #FFA500 into its three components in denary.
:::
