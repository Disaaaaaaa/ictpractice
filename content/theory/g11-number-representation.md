---
summary: The binary, denary and hexadecimal number systems, converting between them, why hexadecimal is used in computer systems, and adding and multiplying binary numbers, including overflow and shifts.
---
# Number systems
@lo 11.1.1.1

Computers store and process **all data as binary** — patterns of **0s and 1s**. People normally count in **denary** (decimal), and programmers often write binary values in **hexadecimal**, a short form of binary. All three systems are **place-value** systems: the value of a digit depends on its **position**.

:::definition Number base
The **number of different digits** a number system uses, which is also the number each place value is **multiplied by** when you move one place to the left. Denary is base 10, binary base 2, hexadecimal base 16.
:::

:::definition Binary (base 2)
A number system that uses only the two digits **0 and 1**; each place value is **double** the one to its right (1, 2, 4, 8, 16, 32, 64, 128 …). It is the system the **computer's hardware** uses.
:::

:::definition Denary (decimal, base 10)
The number system people use every day, with the ten digits **0–9** and place values 1, 10, 100, 1000 …
:::

:::definition Hexadecimal (base 16)
A number system with **sixteen digits, 0–9 and A–F** (A = 10, B = 11, C = 12, D = 13, E = 14, F = 15) and place values 1, 16, 256, 4096 … **One hex digit represents exactly 4 bits.**
:::

:::compare The three number systems
| | Denary (decimal) | Binary | Hexadecimal |
|---|---|---|---|
| **Base** | 10 | 2 | 16 |
| **Digits** | 0–9 | 0, 1 | 0–9 and **A–F** |
| **Place values** | …, 1000, 100, 10, 1 | …, 128, 64, 32, 16, 8, 4, 2, 1 | …, 4096, 256, 16, 1 |
| **Used by** | People | The computer's hardware | Programmers, to write binary compactly |
| **Digits needed for 182** | 3 (182) | 8 (10110110) | 2 (B6) |
| How to show the base | 182₁₀ | 10110110₂ | B6₁₆, 0xB6, #B6 |
:::

## Why computers use binary

:::svg A circuit has only two states — that is why computers use binary
<svg class="nr" viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A circuit has two states, on = 1 and off = 0; eight switches store one byte, 01000001">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <rect class="on" x="20" y="20" width="200" height="70" rx="10"/><text class="h" x="120" y="50" text-anchor="middle">Current on / high voltage</text><text class="dp" x="120" y="78" text-anchor="middle">1</text>
  <rect class="bx" x="20" y="104" width="200" height="70" rx="10"/><text class="h" x="120" y="134" text-anchor="middle">Current off / low voltage</text><text class="d" x="120" y="162" text-anchor="middle">0</text>
  <path class="ar" d="M232,92 l14,7 l-14,7 z"/>
  <text class="h" x="260" y="40">8 switches (transistors) = 1 byte</text>
  <circle cx="282" cy="92" r="20" class="bx"/><text class="d" x="282" y="99" text-anchor="middle">0</text>
  <circle cx="340" cy="92" r="20" class="on"/><text class="dp" x="340" y="99" text-anchor="middle">1</text>
  <circle cx="398" cy="92" r="20" class="bx"/><text class="d" x="398" y="99" text-anchor="middle">0</text>
  <circle cx="456" cy="92" r="20" class="bx"/><text class="d" x="456" y="99" text-anchor="middle">0</text>
  <circle cx="514" cy="92" r="20" class="bx"/><text class="d" x="514" y="99" text-anchor="middle">0</text>
  <circle cx="572" cy="92" r="20" class="bx"/><text class="d" x="572" y="99" text-anchor="middle">0</text>
  <circle cx="630" cy="92" r="20" class="bx"/><text class="d" x="630" y="99" text-anchor="middle">0</text>
  <circle cx="688" cy="92" r="20" class="on"/><text class="dp" x="688" y="99" text-anchor="middle">1</text>
  <text class="t" x="260" y="140">01000001 = 64 + 1 = 65 — the code of the letter "A"</text>
  <text class="s" x="260" y="164">two states are easy to make, store and tell apart, even with electrical noise</text>
</svg>
:::

:::cards
### Two states are reliable
- Each **transistor** in a processor or memory chip is either **on** or **off** — high or low voltage.
- Two states are **easy to tell apart**, even when there is electrical **noise**, so errors are rare.
### Everything becomes binary
- Numbers, text (character codes), images (pixels), sound (samples) and program **instructions** are all stored as bit patterns.
- The same pattern can mean different things: 01000001 is the number 65 **or** the letter "A", depending on how it is used.
:::

## Bits, nibbles and bytes

:::definition Bit
A **binary digit** — a single 0 or 1. The smallest unit of data.
:::

:::cards
### Units
- **Bit** — one binary digit, 0 or 1.
- **Nibble** — **4 bits** (one hexadecimal digit), values 0–15.
- **Byte** — **8 bits**; values 0–255 (00000000–11111111).
### How many values?
- *n* bits can store **2ⁿ** different values: 1 bit → 2, 4 bits → 16, 8 bits → 256, 16 bits → 65 536.
- The **largest** unsigned number in *n* bits is **2ⁿ − 1**: 4 bits → 15, 8 bits → 255.
- Adding **one more bit doubles** the number of values.
:::

:::compare Powers of 2 to remember
| Bits *n* | Different values (2ⁿ) | Largest value (2ⁿ − 1) |
|---|---|---|
| 1 | 2 | 1 |
| 2 | 4 | 3 |
| 3 | 8 | 7 |
| 4 (nibble) | 16 | 15 |
| 5 | 32 | 31 |
| 6 | 64 | 63 |
| 7 | 128 | 127 |
| 8 (byte) | 256 | 255 |
| 16 | 65 536 | 65 535 |
:::

:::example How many bits does a school need?
A school gives every locker a binary number. It has **150 lockers**, numbered 0–149. 7 bits give only 2⁷ = **128** numbers (0–127) — not enough. 8 bits give 2⁸ = **256** numbers (0–255), so **8 bits** is the minimum. If the school grows to 300 lockers, it needs **9 bits** (512 numbers).
:::

# Converting binary and denary
@lo 11.1.1.2

## Binary → denary

:::svg Binary → denary: add the place values of the 1-bits
<svg class="nr" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The binary number 10110110 under the place values 128 to 1; the 1-bits add up to 182">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="26">Place values (powers of 2)</text>
  <text class="pv" x="95" y="56" text-anchor="middle">2⁷</text><text class="t" x="95" y="76" text-anchor="middle">128</text>
  <rect class="on" x="60" y="86" width="70" height="44" rx="6"/><text class="dp" x="95" y="115" text-anchor="middle">1</text>
  <text class="pv" x="177" y="56" text-anchor="middle">2⁶</text><text class="t" x="177" y="76" text-anchor="middle">64</text>
  <rect class="bx" x="142" y="86" width="70" height="44" rx="6"/><text class="d" x="177" y="115" text-anchor="middle">0</text>
  <text class="pv" x="259" y="56" text-anchor="middle">2⁵</text><text class="t" x="259" y="76" text-anchor="middle">32</text>
  <rect class="on" x="224" y="86" width="70" height="44" rx="6"/><text class="dp" x="259" y="115" text-anchor="middle">1</text>
  <text class="pv" x="341" y="56" text-anchor="middle">2⁴</text><text class="t" x="341" y="76" text-anchor="middle">16</text>
  <rect class="on" x="306" y="86" width="70" height="44" rx="6"/><text class="dp" x="341" y="115" text-anchor="middle">1</text>
  <text class="pv" x="423" y="56" text-anchor="middle">2³</text><text class="t" x="423" y="76" text-anchor="middle">8</text>
  <rect class="bx" x="388" y="86" width="70" height="44" rx="6"/><text class="d" x="423" y="115" text-anchor="middle">0</text>
  <text class="pv" x="505" y="56" text-anchor="middle">2²</text><text class="t" x="505" y="76" text-anchor="middle">4</text>
  <rect class="on" x="470" y="86" width="70" height="44" rx="6"/><text class="dp" x="505" y="115" text-anchor="middle">1</text>
  <text class="pv" x="587" y="56" text-anchor="middle">2¹</text><text class="t" x="587" y="76" text-anchor="middle">2</text>
  <rect class="on" x="552" y="86" width="70" height="44" rx="6"/><text class="dp" x="587" y="115" text-anchor="middle">1</text>
  <text class="pv" x="669" y="56" text-anchor="middle">2⁰</text><text class="t" x="669" y="76" text-anchor="middle">1</text>
  <rect class="bx" x="634" y="86" width="70" height="44" rx="6"/><text class="d" x="669" y="115" text-anchor="middle">0</text>
  <text class="s" x="20" y="160">Add the place values where the bit is 1 (blue):</text>
  <text class="h" x="20" y="186">128 + 32 + 16 + 4 + 2 = 182</text>
  <text class="s" x="740" y="186" text-anchor="end">MSB = leftmost bit (128) · LSB = rightmost bit (1)</text>
</svg>
:::

:::steps Binary → denary
- Write the **place values** 128, 64, 32, 16, 8, 4, 2, 1 above the eight bits (for fewer bits, start from 1 on the right).
- **Add** the place values where the bit is **1**; ignore the 0s.
- *Example:* 01011010 → 64 + 16 + 8 + 2 = **90**.
:::

:::tip Quick checks
- A binary number that **ends in 1 is odd**; one that ends in 0 is even.
- If the **leftmost** (128) bit of an 8-bit number is 1, the value is **at least 128**.
- **Leading zeros** do not change the value: 00101 = 101 = 5.
:::

## Denary → binary

:::steps Denary → binary (place-value / subtraction method)
- Start with the largest place value (128). If it **fits** into the number, write **1** and **subtract** it; otherwise write **0**.
- Repeat with the remainder for 64, 32, 16, 8, 4, 2, 1.
- *Example:* **156** → 128 fits (1, remainder 28); 64 no (0); 32 no (0); 16 fits (1, remainder 12); 8 fits (1, remainder 4); 4 fits (1, remainder 0); 2 no (0); 1 no (0) → **10011100**.
- **Check** by converting back: 128 + 16 + 8 + 4 = 156 ✔.
:::

:::svg Denary → binary by repeated division by 2
<svg class="nr" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Division method for 47: divide by 2 repeatedly, read the remainders from the bottom up to get 101111">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="40" y="26">Divide by 2</text><text class="h" x="230" y="26">Quotient</text><text class="h" x="350" y="26">Remainder</text>
  <rect class="bx" x="30" y="36" width="420" height="28" rx="4"/><text class="t" x="40" y="55">47 ÷ 2</text><text class="t" x="230" y="55">23</text><text class="dp" x="390" y="57" text-anchor="middle">1</text>
  <rect class="bx" x="30" y="68" width="420" height="28" rx="4"/><text class="t" x="40" y="87">23 ÷ 2</text><text class="t" x="230" y="87">11</text><text class="dp" x="390" y="89" text-anchor="middle">1</text>
  <rect class="bx" x="30" y="100" width="420" height="28" rx="4"/><text class="t" x="40" y="119">11 ÷ 2</text><text class="t" x="230" y="119">5</text><text class="dp" x="390" y="121" text-anchor="middle">1</text>
  <rect class="bx" x="30" y="132" width="420" height="28" rx="4"/><text class="t" x="40" y="151">5 ÷ 2</text><text class="t" x="230" y="151">2</text><text class="dp" x="390" y="153" text-anchor="middle">1</text>
  <rect class="bx" x="30" y="164" width="420" height="28" rx="4"/><text class="t" x="40" y="183">2 ÷ 2</text><text class="t" x="230" y="183">1</text><text class="dp" x="390" y="185" text-anchor="middle">0</text>
  <rect class="bx" x="30" y="196" width="420" height="28" rx="4"/><text class="t" x="40" y="215">1 ÷ 2</text><text class="t" x="230" y="215">0</text><text class="dp" x="390" y="217" text-anchor="middle">1</text>
  <path d="M430,226 L430,44" style="stroke:var(--success);stroke-width:3;fill:none"/><path d="M422,52 l8,-14 l8,14 z" style="fill:var(--success)"/>
  <text class="h" x="480" y="90">Read the remainders</text><text class="h" x="480" y="110" style="fill:var(--success)">from the bottom up</text>
  <text class="d" x="480" y="160">101111</text><text class="s" x="480" y="184">as 8 bits: 00101111</text><text class="s" x="480" y="204">check: 32 + 8 + 4 + 2 + 1 = 47</text>
  <text class="s" x="30" y="248">stop when the quotient is 0</text>
</svg>
:::

:::steps Denary → binary (division method)
- **Divide by 2** and write down the **remainder** (0 or 1).
- Divide the **quotient** by 2 again; repeat until the quotient is **0**.
- Read the remainders from the **bottom up**; add leading 0s to make 8 bits if the question asks for it.
:::

:::example Worked example: a classroom sensor
A temperature sensor in a school's computer room sends the reading **00011001** to the controller.
1. Place values of the 1-bits: 16, 8 and 1.
2. 16 + 8 + 1 = **25** — the room is at 25 °C.
3. The air conditioner must switch on at **27 °C**. 27 = 16 + 8 + 2 + 1 → **00011011**. The programmer stores this binary value as the limit.
:::

:::widget base_converter Try it: convert between denary, binary and hexadecimal
:::

:::warning Common mistakes
- Reading the division remainders from **top to bottom** — they are read **bottom up**.
- Writing place values from the **left** as 1, 2, 4 … — the **rightmost** bit is worth 1.
- Giving 7 bits when the question says "8-bit binary" — add a **leading 0**.
- Thinking 8 bits can store 256 as a number — 256 **different values**, but the largest is **255**.
:::

# Exam practice: number systems and binary
@lo 11.1.1.1 11.1.1.2

:::example Exam-style answers
**Q: Explain the difference between the binary and denary number systems. [2]**
Binary is **base 2** and uses only the digits **0 and 1**, with place values that double (1, 2, 4, 8 …) (1). Denary is **base 10** and uses the digits **0–9**, with place values 1, 10, 100 … (1).

**Q: Explain why computers use binary to store data. [2]**
Computer circuits / transistors have **two states**, on and off (1); these two states can be represented by **1 and 0**, and are reliable / easy to distinguish (1).

**Q: Convert the denary number 107 into 8-bit binary. [1]**
107 = 64 + 32 + 8 + 2 + 1 → **01101011** (1).

**Q: Convert the binary number 10010011 into denary. [1]**
128 + 16 + 2 + 1 = **147** (1).

**Q: A game stores a player's level in 6 bits. State the highest level that can be stored. [1]**
2⁶ − 1 = **63** (1).
:::

:::warning Common mistakes in answers
- Explaining binary only as "it uses 0 and 1" — also give the **base** and the **place values** for full marks.
- Losing the conversion mark by **not checking**: always convert the answer back.
- Mixing up **number of values** (2ⁿ) and **largest value** (2ⁿ − 1).
:::

:::steps Check yourself
- State the base and the digits of binary, denary and hexadecimal.
- Explain why computers use binary.
- How many values can be stored in 5 bits? What is the largest?
- Convert 11011001 to denary and 77 to 8-bit binary (both methods).
- What is the smallest number of bits needed to store the number 500?
:::

# Converting with hexadecimal
@lo 11.1.1.2

Hexadecimal is closely linked to binary because **16 = 2⁴**: every hex digit stands for **one nibble** (4 bits). That makes binary ↔ hex conversion a matter of **grouping**, with no arithmetic on large numbers.

:::compare Hex digit ↔ denary ↔ 4-bit binary
| Hex | Denary | Binary | Hex | Denary | Binary |
|---|---|---|---|---|---|
| 0 | 0 | 0000 | 8 | 8 | 1000 |
| 1 | 1 | 0001 | 9 | 9 | 1001 |
| 2 | 2 | 0010 | **A** | 10 | 1010 |
| 3 | 3 | 0011 | **B** | 11 | 1011 |
| 4 | 4 | 0100 | **C** | 12 | 1100 |
| 5 | 5 | 0101 | **D** | 13 | 1101 |
| 6 | 6 | 0110 | **E** | 14 | 1110 |
| 7 | 7 | 0111 | **F** | 15 | 1111 |
:::

## Binary ↔ hexadecimal

:::svg Binary → hexadecimal: split into nibbles from the right
<svg class="nr" viewBox="0 0 760 216" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="11010011 is split into 1101 and 0011, giving D3; 101101 is padded to 0010 1101, giving 2D">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="26">Binary → hex: groups of 4 bits from the right</text>
  <rect class="bx" x="30" y="44" width="150" height="40" rx="6"/><text class="d" x="54" y="72" text-anchor="middle" >1</text><text class="d" x="88" y="72" text-anchor="middle" >1</text><text class="d" x="122" y="72" text-anchor="middle" >0</text><text class="d" x="156" y="72" text-anchor="middle" >1</text><text class="pv" x="105" y="102" text-anchor="middle">8 4 2 1 → 13</text><rect class="on" x="75" y="112" width="60" height="38" rx="6"/><text class="dp" x="105" y="138" text-anchor="middle">D</text>
  <rect class="bx" x="200" y="44" width="150" height="40" rx="6"/><text class="d" x="224" y="72" text-anchor="middle" >0</text><text class="d" x="258" y="72" text-anchor="middle" >0</text><text class="d" x="292" y="72" text-anchor="middle" >1</text><text class="d" x="326" y="72" text-anchor="middle" >1</text><text class="pv" x="275" y="102" text-anchor="middle">8 4 2 1 → 3</text><rect class="on" x="245" y="112" width="60" height="38" rx="6"/><text class="dp" x="275" y="138" text-anchor="middle">3</text>
  <text class="h" x="200" y="178">11010011 = D3</text>
  <rect class="bx" x="420" y="44" width="150" height="40" rx="6"/><text class="c" x="444" y="72" text-anchor="middle" style="font-size:20px">0</text><text class="c" x="478" y="72" text-anchor="middle" style="font-size:20px">0</text><text class="d" x="512" y="72" text-anchor="middle" >1</text><text class="d" x="546" y="72" text-anchor="middle" >0</text><text class="pv" x="495" y="102" text-anchor="middle">8 4 2 1 → 2</text><rect class="on" x="465" y="112" width="60" height="38" rx="6"/><text class="dp" x="495" y="138" text-anchor="middle">2</text>
  <rect class="bx" x="590" y="44" width="150" height="40" rx="6"/><text class="d" x="614" y="72" text-anchor="middle" >1</text><text class="d" x="648" y="72" text-anchor="middle" >1</text><text class="d" x="682" y="72" text-anchor="middle" >0</text><text class="d" x="716" y="72" text-anchor="middle" >1</text><text class="pv" x="665" y="102" text-anchor="middle">8 4 2 1 → 13</text><rect class="on" x="635" y="112" width="60" height="38" rx="6"/><text class="dp" x="665" y="138" text-anchor="middle">D</text>
  <text class="h" x="590" y="178">101101 = 2D</text>
  <text class="s" x="420" y="204">6 bits: add leading 0s (orange) on the LEFT</text>
</svg>
:::

:::steps Binary → hexadecimal
- Split the binary number into groups of **4 bits (nibbles)**, starting from the **right**.
- If the last group on the left has fewer than 4 bits, add **leading 0s**.
- Convert each nibble to **one hex digit** using the place values 8, 4, 2, 1 (10–15 become A–F).
- *Example:* 1101 0011 → 13 = **D**, 3 = **3** → **D3**.
:::

:::steps Hexadecimal → binary
- Convert **each hex digit** into **exactly 4 bits** (keep the leading 0s inside each group).
- Write the groups side by side.
- *Example:* **5C** → 5 = 0101, C (12) = 1100 → **01011100**.
:::

## Hexadecimal ↔ denary

:::svg Hexadecimal → denary with place values 256, 16, 1
<svg class="nr" viewBox="0 0 760 196" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="1F4 under the hexadecimal place values 256, 16 and 1 gives 256 + 240 + 4 = 500">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="26">Hexadecimal place values (powers of 16)</text>
  <text class="pv" x="110" y="54" text-anchor="middle">16²</text><text class="t" x="110" y="74" text-anchor="middle">256</text><rect class="on" x="40" y="84" width="140" height="44" rx="6"/><text class="dp" x="110" y="113" text-anchor="middle">1</text><text class="t" x="110" y="152" text-anchor="middle">1 × 256 = 256</text>
  <text class="pv" x="280" y="54" text-anchor="middle">16¹</text><text class="t" x="280" y="74" text-anchor="middle">16</text><rect class="on" x="210" y="84" width="140" height="44" rx="6"/><text class="dp" x="280" y="113" text-anchor="middle">F</text><text class="t" x="280" y="152" text-anchor="middle">15 × 16 = 240</text>
  <text class="pv" x="450" y="54" text-anchor="middle">16⁰</text><text class="t" x="450" y="74" text-anchor="middle">1</text><rect class="on" x="380" y="84" width="140" height="44" rx="6"/><text class="dp" x="450" y="113" text-anchor="middle">4</text><text class="t" x="450" y="152" text-anchor="middle">4 × 1 = 4</text>
  <text class="h" x="560" y="100">256 + 240 + 4</text><text class="h" x="560" y="124" style="fill:var(--success)">= 500</text>
  <text class="s" x="40" y="182">F = 15, so its value in the 16s column is 15 × 16</text>
</svg>
:::

:::steps Hexadecimal → denary
- Write the place values **…, 256, 16, 1** above the digits.
- Change letters into numbers (A = 10 … F = 15).
- **Multiply** each digit by its place value and **add**. *7A* = 7 × 16 + 10 × 1 = 112 + 10 = **122**.
:::

:::steps Denary → hexadecimal
- **Divide by 16**: the **quotient** is the first digit, the **remainder** is the second (for numbers up to 255).
- Write 10–15 as A–F. *245* = 15 × 16 + 5 → **F5**.
- Or go **via binary**: 245 = 11110101 → 1111 0101 → **F5**. This route is often safer.
:::

:::example Worked example: a printer error code
A school printer shows the error code **3C**. The technician's manual lists codes in denary.
1. 3C → 3 × 16 + 12 = 48 + 12 = **60**.
2. In binary: 3 = 0011, C = 1100 → **00111100**.
3. Check: 32 + 16 + 8 + 4 = 60 ✔. The manual says error 60 is "paper jam in tray 2".
:::

:::compare Choosing a conversion route
| From → to | Best method |
|---|---|
| Binary → hex | Group into nibbles from the right |
| Hex → binary | 4 bits for each digit |
| Hex → denary | Place values 256, 16, 1 (or via binary) |
| Denary → hex | ÷ 16 (quotient, remainder) — or denary → binary → hex |
| Denary ↔ binary | Place values 128 … 1, or repeated ÷ 2 |
:::

:::warning Common mistakes
- Grouping nibbles from the **left** when the number of bits is not a multiple of 4 — always start from the **right**.
- Writing 10–15 as two digits ("1 2") instead of **A–F**.
- Dropping the leading zeros of a nibble in the **middle or end** of a number: A5 is 1010 **0101**; writing 5 as 101 gives 1010101 = 85, which is wrong.
- Using place values 10, 100 for hex — they are **16, 256**.
:::

# Why hexadecimal is used
@lo 11.1.1.3

The computer **never** stores hexadecimal — inside it everything is still binary. Hexadecimal is used by **people** (programmers, technicians, web designers) as a **shorthand for binary**.

:::cards
### Advantages of hexadecimal
- **Shorter** than binary — one hex digit replaces **4 bits**, so a byte is just **2 digits** (B6 instead of 10110110).
- **Easier for people to read, write and remember** than long strings of 0s and 1s.
- **Fewer mistakes** when copying, typing or reading values aloud.
- **Easy to convert** to and from binary (each digit = one nibble), much easier than denary.
- **Fits bytes exactly**: 2 digits = 1 byte, 4 digits = 2 bytes, so values line up with memory.
### Where hexadecimal is used
- **Colour codes** in HTML/CSS: `#FF0000` (red), `#1E90C8`.
- **MAC addresses** of network cards: `00:1A:2B:3C:4D:5E` (6 bytes = 12 hex digits).
- **Memory addresses** and **machine code** shown in debuggers and assembly language.
- **Error and status codes**, e.g. `0x0000007B`.
- **IPv6** addresses and **Unicode** code points (U+0041 = "A").
:::

:::svg An HTML colour code is three bytes written in hex
<svg class="nr" viewBox="0 0 760 216" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Colour #2E8B57 split into red 2E = 46, green 8B = 139 and blue 57 = 87, each one byte">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="28">HTML colour code</text><text class="d" x="180" y="30">#2E8B57</text>
  <rect class="bx" x="20" y="50" width="228" height="130" rx="10"/><text class="h" x="134" y="74" text-anchor="middle">Red</text><text class="dp" x="134" y="104" text-anchor="middle">2E</text><text class="t" x="134" y="130" text-anchor="middle">2 × 16 + 14 = 46</text><text class="pv" x="134" y="160" text-anchor="middle" style="font-size:14px">0010 1110</text>
  <rect class="bx" x="268" y="50" width="228" height="130" rx="10"/><text class="h" x="382" y="74" text-anchor="middle">Green</text><text class="dp" x="382" y="104" text-anchor="middle">8B</text><text class="t" x="382" y="130" text-anchor="middle">8 × 16 + 11 = 139</text><text class="pv" x="382" y="160" text-anchor="middle" style="font-size:14px">1000 1011</text>
  <rect class="bx" x="516" y="50" width="228" height="130" rx="10"/><text class="h" x="630" y="74" text-anchor="middle">Blue</text><text class="dp" x="630" y="104" text-anchor="middle">57</text><text class="t" x="630" y="130" text-anchor="middle">5 × 16 + 7 = 87</text><text class="pv" x="630" y="160" text-anchor="middle" style="font-size:14px">0101 0111</text>
  <text class="s" x="20" y="204">each pair of hex digits is one byte (00–FF = 0–255); the whole colour is 3 bytes = 24 bits</text>
</svg>
:::

:::compare The same byte in three systems
| | Binary | Denary | Hexadecimal |
|---|---|---|---|
| Example (one byte) | 11001000 | 200 | C8 |
| Digits for 1 byte | 8 | up to 3 | **always 2** |
| Easy for people to read? | No — long, easy to miscopy | Yes | Yes |
| Easy to convert to binary? | — | No — needs arithmetic | **Yes — digit by digit** |
| Lines up with bytes / nibbles? | Yes | No | **Yes** |
:::

:::example Worked example: a MAC address
A network technician at a clinic reads the MAC address **3C-A8-2A-F0-11-6B** from a label.
- It has **6 pairs** of hex digits = **6 bytes = 48 bits**.
- Written in binary it would be 48 digits long, e.g. the first byte 3C = 00111100 — very easy to misread.
- In hex the technician can read it, type it into the router's filter list and compare it with other devices quickly.
:::

:::definition Hexadecimal prefix
A sign that shows a number is written in hex: **0x** (programming, e.g. `0x1F`), **#** (colours, `#1F4FD8`), **h** suffix (`1Fh`) or subscript ₁₆. Without it, "10" could mean ten, two or sixteen.
:::

:::warning Common mistakes
- Saying the computer **stores** or **processes** data in hexadecimal — it uses **binary**; hex is only a way to **display** it for humans.
- Saying hex "uses less memory" — the stored value takes **exactly the same** number of bits.
- Advantages without explanation: say **why** it is easier (fewer digits, one digit = 4 bits).
:::

# Exam practice: hexadecimal
@lo 11.1.1.2 11.1.1.3

:::example Exam-style answers
**Q: Convert the binary number 10111110 into hexadecimal. [1]**
1011 = B, 1110 = E → **BE** (1).

**Q: Convert the hexadecimal number 4D into denary. Show your working. [2]**
4 × 16 + 13 × 1 (1) = 64 + 13 = **77** (1).

**Q: Convert the denary number 200 into binary and hexadecimal. [2]**
200 = 128 + 64 + 8 → **11001000** (1); 1100 = C, 1000 = 8 → **C8** (1).

**Q: Explain two advantages of using hexadecimal rather than binary in computer systems. [4]**
Hex is **shorter** — one digit replaces four bits (1), so values are **easier for people to read and remember** (1). It is **easy to convert** to binary, digit by digit (1), so there are **fewer errors** when programmers copy or type values (1).

**Q: State two uses of hexadecimal in computer systems. [2]**
Any two: HTML / CSS **colour codes** (1); **MAC addresses** (1); memory addresses; machine code / assembly; error codes; IPv6.
:::

:::warning Common mistakes in answers
- "Hex is easier" with no reason — give the **reason** (shorter / 4 bits per digit) for the second mark.
- Writing "computers use hex because it is faster" — the hardware still uses **binary**.
- Not showing working in a 2-mark conversion — write the place values and the multiplication.
:::

:::steps Check yourself
- Why does one hex digit represent exactly 4 bits?
- Convert 3F and A7 to binary and denary; convert 1011101 and 11110000 to hex.
- Convert 1F4 and 2B7 to denary.
- Give three advantages and four uses of hexadecimal.
- Explain why hex is better than denary for writing binary values.
:::

# Binary addition
@lo 11.1.1.4

Binary addition works like column addition in denary, but a column "fills up" at **2** instead of 10: 1 + 1 = **10₂** (write 0, carry 1).

:::compare Rules of binary addition
| Sum in a column | Result (denary) | Write | Carry to the next column |
|---|---|---|---|
| 0 + 0 | 0 | 0 | 0 |
| 0 + 1 or 1 + 0 | 1 | 1 | 0 |
| 1 + 1 | 2 (10₂) | 0 | **1** |
| 1 + 1 + 1 (with a carry) | 3 (11₂) | 1 | **1** |
:::

:::svg Column addition: 109 + 54 in binary
<svg class="nr" viewBox="0 0 760 228" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Binary addition 01101101 + 00110110 = 10100011 with the carry bits written above the columns">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="s" x="84" y="56">carry</text><text class="c" x="204" y="56" text-anchor="middle">1</text><text class="c" x="242" y="56" text-anchor="middle">1</text><text class="c" x="280" y="56" text-anchor="middle">1</text><text class="c" x="318" y="56" text-anchor="middle">1</text><text class="c" x="356" y="56" text-anchor="middle">1</text>
  <text class="d" x="204" y="96" text-anchor="middle">0</text><text class="d" x="242" y="96" text-anchor="middle">1</text><text class="d" x="280" y="96" text-anchor="middle">1</text><text class="d" x="318" y="96" text-anchor="middle">0</text><text class="d" x="356" y="96" text-anchor="middle">1</text><text class="d" x="394" y="96" text-anchor="middle">1</text><text class="d" x="432" y="96" text-anchor="middle">0</text><text class="d" x="470" y="96" text-anchor="middle">1</text><text class="s" x="510" y="96">109</text>
  <text class="d" x="156" y="134" text-anchor="middle">+</text><text class="d" x="204" y="134" text-anchor="middle">0</text><text class="d" x="242" y="134" text-anchor="middle">0</text><text class="d" x="280" y="134" text-anchor="middle">1</text><text class="d" x="318" y="134" text-anchor="middle">1</text><text class="d" x="356" y="134" text-anchor="middle">0</text><text class="d" x="394" y="134" text-anchor="middle">1</text><text class="d" x="432" y="134" text-anchor="middle">1</text><text class="d" x="470" y="134" text-anchor="middle">0</text><text class="s" x="510" y="134">  54</text>
  <path class="ln" d="M146,148 L488,148"/>
  <text class="ds" x="204" y="180" text-anchor="middle">1</text><text class="ds" x="242" y="180" text-anchor="middle">0</text><text class="ds" x="280" y="180" text-anchor="middle">1</text><text class="ds" x="318" y="180" text-anchor="middle">0</text><text class="ds" x="356" y="180" text-anchor="middle">0</text><text class="ds" x="394" y="180" text-anchor="middle">0</text><text class="ds" x="432" y="180" text-anchor="middle">1</text><text class="ds" x="470" y="180" text-anchor="middle">1</text><text class="s" x="510" y="180">163</text>
  <text class="h" x="20" y="26">Add from the RIGHT, column by column; write each carry above the next column</text>
  <text class="s" x="20" y="214">column 3 from the right: 1 + 1 = 10₂ → write 0, carry 1 · column 6: 1 + 1 + carry 1 = 11₂ → write 1, carry 1</text>
</svg>
:::

:::steps How to add two binary numbers
- Write the numbers **one under the other**, lined up on the right (same number of bits).
- Start with the **rightmost** column; add the two bits **and any carry**.
- Write the result bit under the line and the **carry** above the next column to the left.
- Continue to the leftmost column.
- **Check** in denary: 109 + 54 = 163 and 10100011 = 128 + 32 + 2 + 1 = 163 ✔.
:::

:::widget binary_addition Try it: add two 8-bit numbers and watch the carries
:::

## Overflow

:::definition Overflow error
An error that occurs when the result of a calculation is **too large to be stored in the number of bits available**. In an 8-bit register the largest value is **255**; a result of 256 or more needs a **9th bit**, which is **lost**, so the stored result is **wrong**.
:::

:::svg Overflow: the 9th bit does not fit in the register
<svg class="nr" viewBox="0 0 760 258" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Adding 11001000 and 01100100 gives a 9-bit result; the 9th bit is lost and the register stores 00101100 = 44">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="26">200 + 100 in an 8-bit register</text>
  <text class="s" x="40" y="58">carry</text><text class="c" x="166" y="58" text-anchor="middle">1</text><text class="c" x="204" y="58" text-anchor="middle">1</text>
  <text class="d" x="204" y="96" text-anchor="middle">1</text><text class="d" x="242" y="96" text-anchor="middle">1</text><text class="d" x="280" y="96" text-anchor="middle">0</text><text class="d" x="318" y="96" text-anchor="middle">0</text><text class="d" x="356" y="96" text-anchor="middle">1</text><text class="d" x="394" y="96" text-anchor="middle">0</text><text class="d" x="432" y="96" text-anchor="middle">0</text><text class="d" x="470" y="96" text-anchor="middle">0</text><text class="s" x="510" y="96">200</text>
  <text class="d" x="156" y="134" text-anchor="middle">+</text><text class="d" x="204" y="134" text-anchor="middle">0</text><text class="d" x="242" y="134" text-anchor="middle">1</text><text class="d" x="280" y="134" text-anchor="middle">1</text><text class="d" x="318" y="134" text-anchor="middle">0</text><text class="d" x="356" y="134" text-anchor="middle">0</text><text class="d" x="394" y="134" text-anchor="middle">1</text><text class="d" x="432" y="134" text-anchor="middle">0</text><text class="d" x="470" y="134" text-anchor="middle">0</text><text class="s" x="510" y="134">100</text>
  <path class="ln" d="M146,148 L488,148"/>
  <rect class="no" x="148" y="156" width="36" height="34" rx="6"/><text class="dd" x="166" y="180" text-anchor="middle">1</text>
  <rect class="ok" x="185" y="156" width="304" height="34" rx="6" style="fill:none"/><text class="d" x="204" y="180" text-anchor="middle">0</text><text class="d" x="242" y="180" text-anchor="middle">0</text><text class="d" x="280" y="180" text-anchor="middle">1</text><text class="d" x="318" y="180" text-anchor="middle">0</text><text class="d" x="356" y="180" text-anchor="middle">1</text><text class="d" x="394" y="180" text-anchor="middle">1</text><text class="d" x="432" y="180" text-anchor="middle">0</text><text class="d" x="470" y="180" text-anchor="middle">0</text><text class="s" x="510" y="180">stored: 44</text>
  <text class="t" x="20" y="214" style="fill:var(--danger)">9th bit — no room, lost</text><text class="t" x="356" y="214" text-anchor="middle">the 8 bits that fit in the register</text>
  <text class="s" x="20" y="244">300 needs 9 bits (100101100); only 300 − 256 = 44 is kept → overflow error, the overflow flag is set</text>
</svg>
:::

:::cards
### What happens
- The **carry out** of the leftmost column has **nowhere to go**.
- The register keeps only the **lowest 8 bits** — the stored value is the true answer **minus 256**.
- The processor sets the **overflow (carry) flag** in its status register so a program can detect the error.
### How to spot it
- In the last (leftmost) column there is a **carry out**.
- Check in denary: if the sum is **> 255** (8 bits) or **> 15** (4 bits), overflow occurs.
- Fixes: use **more bits** (a 16-bit register) or **check** the values before adding.
:::

:::example Worked example: counting visitors
A museum's turnstile counts visitors in an **8-bit** register. At 15:00 it holds **11110000** (240). Then **00011111** (31) more people enter.
1. 240 + 31 = 271, which is **more than 255**.
2. The binary sum is **100001111** — 9 bits.
3. The register keeps only **00001111** = 15. The display shows 15 visitors instead of 271 — an **overflow error**. A 16-bit counter (up to 65 535) would solve the problem.
:::

:::warning Common mistakes
- Forgetting the **carry** from the previous column, especially in the 1 + 1 + 1 case (write 1, carry 1).
- Writing the 9th bit as part of an "8-bit answer" — in an 8-bit register it is **lost**.
- Defining overflow as "the number is too big" without saying **for the number of bits / the register**.
:::

# Binary multiplication
@lo 11.1.1.4

Binary multiplication uses the same **long multiplication** as denary, but it is easier: every digit of the multiplier is 0 or 1, so each row is either **a copy of the first number** or **all zeros**.

:::compare Rules of binary multiplication
| | × 0 | × 1 |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 0 | 1 |
:::

:::svg Shift and add: 13 × 5
<svg class="nr" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Binary multiplication 1101 × 101: partial products 1101, 0000 shifted one place and 1101 shifted two places add up to 1000001">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="26">Shift and add: 1101 × 101 (13 × 5)</text>
  <text class="d" x="356" y="62" text-anchor="middle">1</text><text class="d" x="394" y="62" text-anchor="middle">1</text><text class="d" x="432" y="62" text-anchor="middle">0</text><text class="d" x="470" y="62" text-anchor="middle">1</text><text class="s" x="510" y="62">13</text>
  <text class="d" x="318" y="96" text-anchor="middle">×</text><text class="d" x="394" y="96" text-anchor="middle">1</text><text class="d" x="432" y="96" text-anchor="middle">0</text><text class="d" x="470" y="96" text-anchor="middle">1</text><text class="s" x="510" y="96">5</text>
  <path class="ln" d="M204,108 L488,108"/>
  <text class="dp" x="356" y="138" text-anchor="middle">1</text><text class="dp" x="394" y="138" text-anchor="middle">1</text><text class="dp" x="432" y="138" text-anchor="middle">0</text><text class="dp" x="470" y="138" text-anchor="middle">1</text><text class="s" x="510" y="138">1101 × 1 (right bit)</text>
  <text class="d" x="318" y="170" text-anchor="middle">0</text><text class="d" x="356" y="170" text-anchor="middle">0</text><text class="d" x="394" y="170" text-anchor="middle">0</text><text class="d" x="432" y="170" text-anchor="middle">0</text><text class="dw" x="470" y="170" text-anchor="middle">0</text><text class="s" x="510" y="170">1101 × 0, shifted 1 place</text>
  <text class="d" x="204" y="202" text-anchor="middle">+</text><text class="dp" x="280" y="202" text-anchor="middle">1</text><text class="dp" x="318" y="202" text-anchor="middle">1</text><text class="dp" x="356" y="202" text-anchor="middle">0</text><text class="dp" x="394" y="202" text-anchor="middle">1</text><text class="dw" x="432" y="202" text-anchor="middle">0</text><text class="dw" x="470" y="202" text-anchor="middle">0</text><text class="s" x="510" y="202">1101 × 1, shifted 2 places</text>
  <path class="ln" d="M204,214 L488,214"/>
  <text class="ds" x="242" y="246" text-anchor="middle">1</text><text class="ds" x="280" y="246" text-anchor="middle">0</text><text class="ds" x="318" y="246" text-anchor="middle">0</text><text class="ds" x="356" y="246" text-anchor="middle">0</text><text class="ds" x="394" y="246" text-anchor="middle">0</text><text class="ds" x="432" y="246" text-anchor="middle">0</text><text class="ds" x="470" y="246" text-anchor="middle">1</text><text class="s" x="510" y="246">64 + 1 = 65 ✔</text>
  <text class="s" x="20" y="276">orange 0s are the zeros added on the right when a row is shifted left</text>
</svg>
:::

:::steps Multiplying binary numbers (shift and add)
- Write the first number (multiplicand) above the second (multiplier).
- For **each bit of the multiplier**, starting from the **right**: if the bit is **1**, copy the multiplicand; if it is **0**, write zeros.
- **Shift** each new row **one more place to the left** (fill the empty places on the right with 0s).
- **Add** all the rows (partial products) with binary addition.
- **Check** in denary: 13 × 5 = 65 = 1000001₂ ✔.
:::

:::example Worked example: 1011 × 110 (11 × 6)
- Bit 0 of 110 is **0** → 0000
- Bit 1 is **1** → 1011 shifted 1 place → 10110
- Bit 2 is **1** → 1011 shifted 2 places → 101100
- Add: 0 + 10110 + 101100 = **1000010** = 64 + 2 = **66** ✔ (11 × 6 = 66).
:::

## Shifting

:::svg A left shift multiplies by 2
<svg class="nr" viewBox="0 0 760 222" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="00010110 (22) shifted one place left becomes 00101100 (44): the value doubles">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.nr .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nr .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="64">22</text><rect class="bx" x="150" y="36" width="50" height="40" rx="6"/><text class="d" x="175" y="64" text-anchor="middle">0</text><rect class="bx" x="210" y="36" width="50" height="40" rx="6"/><text class="d" x="235" y="64" text-anchor="middle">0</text><rect class="bx" x="270" y="36" width="50" height="40" rx="6"/><text class="d" x="295" y="64" text-anchor="middle">0</text><rect class="on" x="330" y="36" width="50" height="40" rx="6"/><text class="d" x="355" y="64" text-anchor="middle">1</text><rect class="bx" x="390" y="36" width="50" height="40" rx="6"/><text class="d" x="415" y="64" text-anchor="middle">0</text><rect class="on" x="450" y="36" width="50" height="40" rx="6"/><text class="d" x="475" y="64" text-anchor="middle">1</text><rect class="on" x="510" y="36" width="50" height="40" rx="6"/><text class="d" x="535" y="64" text-anchor="middle">1</text><rect class="bx" x="570" y="36" width="50" height="40" rx="6"/><text class="d" x="595" y="64" text-anchor="middle">0</text>
  <path d="M235,80 L175,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>  <path d="M295,80 L235,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>  <path d="M355,80 L295,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>  <path d="M415,80 L355,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>  <path d="M475,80 L415,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>  <path d="M535,80 L475,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>  <path d="M595,80 L535,116" style="stroke:var(--muted);stroke-width:1.5;fill:none"/>
  <text class="h" x="20" y="148">44</text><rect class="bx" x="150" y="120" width="50" height="40" rx="6"/><text class="d" x="175" y="148" text-anchor="middle">0</text><rect class="bx" x="210" y="120" width="50" height="40" rx="6"/><text class="d" x="235" y="148" text-anchor="middle">0</text><rect class="on" x="270" y="120" width="50" height="40" rx="6"/><text class="d" x="295" y="148" text-anchor="middle">1</text><rect class="bx" x="330" y="120" width="50" height="40" rx="6"/><text class="d" x="355" y="148" text-anchor="middle">0</text><rect class="on" x="390" y="120" width="50" height="40" rx="6"/><text class="d" x="415" y="148" text-anchor="middle">1</text><rect class="on" x="450" y="120" width="50" height="40" rx="6"/><text class="d" x="475" y="148" text-anchor="middle">1</text><rect class="bx" x="510" y="120" width="50" height="40" rx="6"/><text class="d" x="535" y="148" text-anchor="middle">0</text><rect class="ok" x="570" y="120" width="50" height="40" rx="6"/><text class="d" x="595" y="148" text-anchor="middle">0</text>
  <text class="s" x="150" y="186">every bit moves one place left; a 0 enters on the right (green); the leftmost bit is lost</text>
  <text class="t" x="150" y="210">left 1 place = × 2 · left 2 places = × 4 · left 3 places = × 8 · right 1 place = ÷ 2</text>
  <text class="h" x="20" y="22">Logical shift left by one place</text>
</svg>
:::

:::definition Logical shift
Moving all the bits of a binary number **left or right** by a number of places; the empty places are filled with **0**. A left shift by *n* places **multiplies by 2ⁿ**; a right shift by *n* places **divides by 2ⁿ** (the remainder is lost).
:::

:::compare Shifts of 00010110 (22)
| Operation | Result | Denary | Effect |
|---|---|---|---|
| Left 1 place | 00101100 | 44 | × 2 |
| Left 2 places | 01011000 | 88 | × 4 |
| Left 3 places | 10110000 | 176 | × 8 |
| Right 1 place | 00001011 | 11 | ÷ 2 |
| Right 2 places | 00000101 | 5 | ÷ 4 (remainder lost: 22 ÷ 4 = 5.5) |
:::

:::tip Why shifts matter
Multiplication in a processor is built from **shifts and additions**. Multiplying by 2, 4, 8 … is just a shift, which is **much faster** than a full multiplication. If a 1 is shifted out of the left end of a register, the result is wrong — another kind of **overflow**.
:::

:::warning Common mistakes
- Forgetting to **shift** each partial product one place further left.
- Starting with the **leftmost** bit of the multiplier (start from the **right**).
- Adding the partial products without **carries**.
- Saying a right shift always halves exactly — odd numbers **lose** their remainder.
:::

# Exam practice: binary arithmetic
@lo 11.1.1.4

:::example Exam-style answers
**Q: Add the binary numbers 01010110 and 00101101. Give your answer in binary. [2]**
**10000011** (2) — one mark for the correct carries / at most one wrong bit. Check: 86 + 45 = 131 ✔.

**Q: Add 10010110 and 01111000 in an 8-bit register and explain the result. [3]**
Sum = 1 00001110 (1). The result 270 is **greater than 255** / needs 9 bits (1), so **overflow** occurs and only **00001110** (14) is stored / the 9th bit is lost (1).

**Q: Multiply 1110 by 11 in binary. Show your working. [2]**
Partial products **1110** and **11100** (1); sum **101010** (1). Check: 14 × 3 = 42 ✔.

**Q: The binary number 00001101 is shifted three places to the left. State the result and its effect. [2]**
**01101000** (1); the value is **multiplied by 8** (13 → 104) (1).

**Q: Define the term overflow. [1]**
The result of a calculation is **too large to fit in the number of bits available** (e.g. greater than 255 in 8 bits) (1).
:::

:::warning Common mistakes in answers
- Giving only the binary answer when "show your working" is asked — write the **carries** or **partial products**.
- Explaining overflow without a **number**: say "greater than 255 / more than 8 bits".
- In a shift question, describing the movement but not the **effect** (× 2ⁿ / ÷ 2ⁿ).
:::

:::steps Check yourself
- State the four rules of binary addition.
- Add 10101101 and 01001101. Does overflow occur in 8 bits?
- Explain what an overflow error is and how a processor detects it.
- Multiply 1010 by 111 in binary and check in denary.
- What is the effect of shifting a binary number two places left? One place right?
:::
