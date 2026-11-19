---
summary: The binary, denary and hexadecimal number systems, converting between them, why hexadecimal is used in computer systems, and adding and multiplying binary numbers, including overflow and shifts.
---
# Number systems
@lo 11.1.1.1

Computers store and process **all data as binary** — patterns of **0s and 1s**. People normally count in **denary** (decimal), and programmers often write binary values in **hexadecimal**, a short form of binary. All three systems are **place-value** systems: the value of a digit depends on its **position**.

A number system is simply an agreed way of writing quantities with symbols. The quantity itself — for example, the number of students in your class — does not change when we write it in a different system; only the **symbols** and the **rules for reading them** change. Twenty-six students can be written as 26 in denary, 11010 in binary or 1A in hexadecimal. All three describe exactly the same quantity. This idea is the key to the whole topic: converting between number systems never changes the value, it only changes the way the value is written down.

## How place value works

In a place-value (positional) system each position in a number has a **weight**, called its **place value**. The rightmost position always has the weight **1**. Every time you move one position to the left, the weight is **multiplied by the base**. To find the value of the whole number you multiply each digit by its place value and add the results.

In denary, the base is 10, so the place values are 1, 10, 100, 1000 and so on. The number 307 means 3 × 100 + 0 × 10 + 7 × 1. The zero is important: it holds the tens place empty, so that the 3 stays in the hundreds place. Without a zero, 307 and 37 would look the same. Binary and hexadecimal use exactly the same idea with a different base. In binary the base is 2, so the place values are 1, 2, 4, 8, 16, 32, 64, 128 — each one **double** the previous. In hexadecimal the base is 16, so the place values are 1, 16, 256, 4096 — each one **sixteen times** the previous.

The base also tells you **how many different digits** the system needs. A system with base *b* needs exactly *b* digits, from 0 up to *b* − 1. Denary needs ten digits (0–9). Binary needs only two (0 and 1), because as soon as a column reaches 2 it "fills up" and a 1 is carried to the next column. Hexadecimal needs sixteen digits, but we only have ten number symbols, so the letters **A to F** are used for the values ten to fifteen. A single hex digit such as **C** therefore stands for the value 12, not for two digits 1 and 2.

:::example Worked example: the same digits in three bases
The digits **1011** mean a different quantity in each system, because the place values are different.
1. **Denary** (place values 1000, 100, 10, 1): 1 × 1000 + 0 × 100 + 1 × 10 + 1 × 1 = **one thousand and eleven**.
2. **Binary** (place values 8, 4, 2, 1): 1 × 8 + 0 × 4 + 1 × 2 + 1 × 1 = **11**.
3. **Hexadecimal** (place values 4096, 256, 16, 1): 1 × 4096 + 0 × 256 + 1 × 16 + 1 × 1 = **4113**.
This is why we must always show which base a number is written in — with a subscript (1011₂), a prefix (0x1011) or words ("the binary number 1011").
:::

:::definition Place value
The **weight of a position** in a number. The rightmost place value is 1 and each place to the left is the previous place value **multiplied by the base**; a digit's contribution is digit × place value.
:::

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

## Explaining the differences

An exam question that asks you to **explain the difference** between the number systems expects more than "binary uses 0 and 1". A full answer compares the systems on several points and gives a reason or a consequence for each one.

**1. The base and the digits.** Denary is base 10 and uses ten digits, 0–9. Binary is base 2 and uses only two digits, 0 and 1. Hexadecimal is base 16 and uses sixteen symbols, 0–9 and A–F. The base is the number of digits, and it is also the number at which a column "fills up" and carries into the next column.

**2. The place values.** Because the bases differ, the weights of the positions grow at different speeds: by ×10 in denary (1, 10, 100), by ×2 in binary (1, 2, 4, 8) and by ×16 in hexadecimal (1, 16, 256). The same row of digits therefore stands for different quantities in each system, as the worked example above shows.

**3. The length of a number.** The smaller the base, the more digits are needed for the same value. The value 182 needs eight binary digits (10110110), three denary digits (182) and only two hex digits (B6). Binary numbers are long because each binary digit carries very little information — only a choice between two possibilities.

**4. Who uses each system and why.** Binary is the only system the **hardware** actually uses, because a circuit can easily be made to have two states. Denary is used by **people** for everyday counting and for input and output (prices, marks, temperatures). Hexadecimal is used by **programmers and technicians** as a compact way of writing binary values; it is never used for storage inside the computer.

**5. Link to binary.** Hexadecimal has a special relationship with binary because 16 = 2⁴: one hex digit always matches exactly four bits. Denary has no such link, because 10 is not a power of 2, so converting between denary and binary always needs arithmetic.

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

A processor contains billions of **transistors**, tiny electronic switches. A transistor could in theory be set to many different voltage levels, but measuring ten different levels accurately would be very difficult: a small change in temperature, a weak battery or interference from a nearby wire could push a voltage from one level into the next, and the stored digit would change. With only **two** levels the circuit just needs to decide "is the voltage above or below the threshold?". There is a wide safety gap between the two states, so small disturbances do not cause errors. This makes binary hardware **reliable**, **cheap to manufacture** and **fast**.

Binary also suits every kind of storage. On a hard disk a tiny area is magnetised in one of **two directions**. On a CD or DVD the surface has **pits and lands** that either reflect the laser or do not. In flash memory (USB sticks, SSDs) a cell either **holds an electric charge or does not**. In each case the medium naturally has two states, which can stand for 1 and 0.

Finally, binary fits the **logic** that processors are built from. Logic gates (AND, OR, NOT) work with two values, true and false, so every calculation the computer performs — addition, comparison, decision — can be built from simple two-state circuits. This is why all data has to be turned into binary before a computer can use it: numbers, letters, the pixels of a photo, the samples of a song and the instructions of a program are all stored as patterns of bits. The pattern itself has no meaning; the **program** that reads it decides whether 01000001 is the number 65, the letter "A" or part of a colour.

## Bits, nibbles and bytes

:::definition Bit
A **binary digit** — a single 0 or 1. The smallest unit of data.
:::

:::definition Byte
A group of **8 bits**. It can hold 2⁸ = **256 different values**, 0 to 255; memory sizes are measured in bytes.
:::

Why does every extra bit **double** the number of values? Think of all the patterns you can make with 2 bits: 00, 01, 10, 11 — four patterns. Adding a third bit, you can put a 0 in front of each of the four patterns or a 1 in front of each of them, giving 4 + 4 = 8 patterns. Each new bit repeats the whole previous list twice, so *n* bits give 2 × 2 × … × 2 = **2ⁿ** patterns. Because one of the patterns is used for zero (00000000), the largest value is one less than the number of patterns: **2ⁿ − 1**.

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

Converting means writing the **same value** in a different number system. In the exam you must be able to convert in both directions and to **show your working**, because a 2-mark conversion usually gives one mark for the method and one for the answer. There are two directions for binary and denary, and for each there is a reliable method.

## Binary → denary

Converting from binary to denary is the easier direction, because it simply uses the meaning of place value. Each bit tells you whether a particular power of two is **included** in the number (1) or **not included** (0). You write the place values above the bits, then add up the place values that have a 1 under them. The 0 bits contribute nothing, so you can ignore them. For an 8-bit number the place values are always 128, 64, 32, 16, 8, 4, 2, 1. If the number has fewer than eight bits, line it up on the **right**: the rightmost bit is always worth 1, whatever the length of the number.

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

Going the other way, you need to find **which powers of two add up to the number**. There are two methods and both are accepted in the exam; choose the one you make fewer mistakes with, and use the other to check.

The **subtraction method** works from the largest place value downwards. You ask "does 128 fit into my number?". If it does, that bit is 1 and you subtract 128; if not, the bit is 0. Then you ask the same question for 64 with what is left, and so on down to 1. Because each place value is bigger than all the smaller ones added together (128 > 64 + 32 + … + 1 = 127), there is always exactly one correct answer, and the remainder at the end must be 0.

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

The **division method** works from the smallest place value upwards. When you divide a number by 2, the remainder tells you whether the number is odd (1) or even (0) — and that is exactly the value of the rightmost bit. Dividing by 2 also shifts all the other bits one place to the right, so the next remainder gives the next bit, and so on. This is why the **first remainder is the rightmost bit** and the remainders must be read from the **bottom up**. The division method is useful for large numbers when you do not remember the place values above 128.

:::compare Two methods for denary → binary
| | Subtraction (place-value) method | Division-by-2 method |
|---|---|---|
| Works from | The **largest** place value down | The **smallest** bit (the 1s) up |
| You need to know | The place values 128, 64 … 1 | Only how to halve a number |
| Order of the answer | Bits are written **left to right** | Remainders are read **bottom up** |
| Good for | Numbers up to 255 in an exam | Large numbers (e.g. 1000, 5000) |
| Typical mistake | Forgetting to write the 0 bits | Reading the remainders top to bottom |
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

# Binary in real systems
@lo 11.1.1.1 11.1.1.2

So far we have converted single numbers. In real computer systems, binary numbers are always stored in a **fixed number of bits** — a register in the processor, a byte in memory, a field in a network packet. Understanding what that fixed size means is what turns conversion practice into real understanding of how data is represented.

## Counting in binary

Counting in binary follows the same pattern as counting in denary or as the wheels of a car's odometer. The rightmost digit goes up by one each time. When it cannot go any higher (9 in denary, 1 in binary), it goes back to 0 and the digit to its left goes up by one. In binary this happens on **every second count**, so the rightmost bit alternates 0, 1, 0, 1; the next bit changes every 2 counts, the next every 4 counts, and the next every 8 counts.

:::compare Counting from 0 to 15 in 4 bits
| Denary | Binary | Hex | Denary | Binary | Hex |
|---|---|---|---|---|---|
| 0 | 0000 | 0 | 8 | 1000 | 8 |
| 1 | 0001 | 1 | 9 | 1001 | 9 |
| 2 | 0010 | 2 | 10 | 1010 | A |
| 3 | 0011 | 3 | 11 | 1011 | B |
| 4 | 0100 | 4 | 12 | 1100 | C |
| 5 | 0101 | 5 | 13 | 1101 | D |
| 6 | 0110 | 6 | 14 | 1110 | E |
| 7 | 0111 | 7 | 15 | 1111 | F |
:::

Look at the pattern: a number of the form 1000…0 is always a **power of two** (1000 = 8, 10000 = 16), and a number made only of 1s is always **one less than a power of two** (111 = 7, 1111 = 15, 11111111 = 255). These two facts are very useful for quick checks in the exam.

## Most and least significant bits

:::definition Most significant bit (MSB)
The **leftmost bit** of a binary number — the bit with the **largest place value** (128 in a byte). Changing it changes the value the most.
:::

:::definition Least significant bit (LSB)
The **rightmost bit** of a binary number, with place value **1**. It shows whether the number is odd (1) or even (0).
:::

When a number is stored in a fixed number of bits, the empty positions on the left are filled with **leading zeros**. The value 5 stored in a byte is 00000101, not 101. Leading zeros do not change the value, but they matter for the computer: the byte always contains exactly eight bits, and the processor reads all eight. That is why an exam question that says "give your answer as an **8-bit** binary number" expects all eight digits.

:::svg A byte: bit positions, place values, MSB and LSB
<svg class="nr" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The byte 00000101 with place values 128 down to 1; the leftmost bit is the most significant bit and the rightmost bit is the least significant bit; leading zeros fill the empty places">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .d{font:700 22px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .dp{font:700 22px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .pv{font:600 13px ui-monospace,monospace;fill:var(--muted)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .wr{fill:none;stroke:var(--warning);stroke-width:2;stroke-dasharray:5 4}
  </style>
  <text class="pv" x="100" y="30" text-anchor="middle">128</text><text class="pv" x="180" y="30" text-anchor="middle">64</text><text class="pv" x="260" y="30" text-anchor="middle">32</text><text class="pv" x="340" y="30" text-anchor="middle">16</text><text class="pv" x="420" y="30" text-anchor="middle">8</text><text class="pv" x="500" y="30" text-anchor="middle">4</text><text class="pv" x="580" y="30" text-anchor="middle">2</text><text class="pv" x="660" y="30" text-anchor="middle">1</text>
  <rect class="bx" x="70" y="42" width="60" height="50" rx="6"/><text class="d" x="100" y="76" text-anchor="middle">0</text>
  <rect class="bx" x="150" y="42" width="60" height="50" rx="6"/><text class="d" x="180" y="76" text-anchor="middle">0</text>
  <rect class="bx" x="230" y="42" width="60" height="50" rx="6"/><text class="d" x="260" y="76" text-anchor="middle">0</text>
  <rect class="bx" x="310" y="42" width="60" height="50" rx="6"/><text class="d" x="340" y="76" text-anchor="middle">0</text>
  <rect class="bx" x="390" y="42" width="60" height="50" rx="6"/><text class="d" x="420" y="76" text-anchor="middle">0</text>
  <rect class="on" x="470" y="42" width="60" height="50" rx="6"/><text class="dp" x="500" y="76" text-anchor="middle">1</text>
  <rect class="bx" x="550" y="42" width="60" height="50" rx="6"/><text class="d" x="580" y="76" text-anchor="middle">0</text>
  <rect class="on" x="630" y="42" width="60" height="50" rx="6"/><text class="dp" x="660" y="76" text-anchor="middle">1</text>
  <rect class="wr" x="62" y="36" width="396" height="62" rx="8"/>
  <text class="t" x="260" y="120" text-anchor="middle">leading zeros: keep the byte 8 bits long</text>
  <text class="h" x="100" y="150" text-anchor="middle">MSB</text><text class="s" x="100" y="168" text-anchor="middle">largest place value</text>
  <text class="h" x="660" y="150" text-anchor="middle">LSB</text><text class="s" x="660" y="168" text-anchor="middle">place value 1 (odd/even)</text>
  <text class="t" x="380" y="190" text-anchor="middle">00000101 = 4 + 1 = 5</text>
</svg>
:::

## Choosing the number of bits

Every system designer has to decide how many bits to use for each value. Too few bits and some values cannot be stored; too many bits and memory, storage and network capacity are wasted. The rule comes straight from 2ⁿ: to store values from 0 up to a maximum *M*, you need the smallest *n* for which **2ⁿ − 1 ≥ M** (or, if you need *N* different values, the smallest *n* with **2ⁿ ≥ N**).

:::steps How to find the minimum number of bits
- Write down the **largest value** to be stored (or the number of different values needed).
- List the powers of two: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 …
- Find the **first power of two that is greater than the largest value** (or at least the number of values).
- Its exponent is the number of bits. *Example:* largest value 500 → 512 = 2⁹ → **9 bits**.
:::

:::example Worked example: an IPv4 address
A school's server has the IPv4 address **192.168.10.37**. An IPv4 address is 32 bits, written as **four denary numbers**, each stored in **one byte** (so each part must be 0–255).
1. 192 = 128 + 64 → **11000000**
2. 168 = 128 + 32 + 8 → **10101000**
3. 10 = 8 + 2 → **00001010** (leading zeros keep it 8 bits)
4. 37 = 32 + 4 + 1 → **00100101**
5. The router actually works with the 32-bit pattern 11000000 10101000 00001010 00100101. A part such as "300" is impossible in an IPv4 address, because 300 > 255 does not fit in a byte.
:::

:::cards
### Where binary sizes matter
- **Colour depth**: 8 bits per colour channel gives 256 shades of red, green and blue.
- **Characters**: 7-bit ASCII has 128 codes; 8-bit extended ASCII has 256.
- **Counters and sensors**: a 10-bit sensor gives readings 0–1023.
- **Addresses**: a 32-bit address can name 2³² ≈ 4.3 billion different locations.
### What goes wrong with too few bits
- Values above 2ⁿ − 1 **cannot be stored** at all.
- A calculation that goes past the limit causes an **overflow** (lesson 3).
- The program may show **wrong results** without any warning.
:::

:::warning Common mistakes
- Using 2ⁿ as the largest value instead of **2ⁿ − 1** (8 bits → 255, not 256).
- Answering "how many bits are needed for 64?" with 6 — 6 bits only reach **63**, so **7 bits** are needed.
- Dropping leading zeros when a fixed number of bits is asked for.
- Calling the leftmost bit the "least" significant — the **MSB is on the left**.
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

Why does this work? A group of four bits can hold 2⁴ = 16 different patterns, from 0000 (0) to 1111 (15). Hexadecimal has exactly sixteen digits, from 0 to F (15). So there is a perfect one-to-one match: **every possible nibble has its own hex digit, and every hex digit has its own nibble**. Furthermore, the hex place values are powers of 16, and 16 = 2⁴, 256 = 2⁸, 4096 = 2¹². That means the second hex digit from the right covers exactly bits 4–7, the third covers bits 8–11, and so on. Each hex digit "owns" its own block of four bits and never affects any other block. Denary does not have this property: 10 is not a power of two, so a single denary digit does not correspond to any fixed group of bits, and converting denary to binary always needs real arithmetic.

:::definition Nibble
A group of **4 bits** — half a byte. It holds 2⁴ = **16 values** (0000–1111, 0–15), so **one nibble = one hexadecimal digit**.
:::

In this lesson you will meet three directions of conversion: binary ↔ hexadecimal (by grouping), hexadecimal ↔ denary (by place values or by division), and the route **via binary**, which is often the safest way to go from denary to hex in an exam. You should learn the sixteen-row table below by heart — it is used in every hex question.

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

To change binary into hexadecimal you cut the bit pattern into nibbles and replace each nibble with its hex digit. The cutting must start from the **right-hand end**, because the rightmost bit is always the 1s bit and each nibble must line up with the place values 8, 4, 2, 1. If the number of bits is not a multiple of four, the leftmost group will be short; you complete it with **leading zeros**, which never change the value. For example, the 6-bit number 101101 is grouped as **10 1101**, completed to **0010 1101**, and gives **2D**. If you grouped from the left (1011 01) you would get a completely different and wrong answer.

The reverse direction is even simpler: each hex digit is written as **exactly four bits**. The important word is *exactly*: the digit 3 must be written as 0011, not 11, otherwise the bits of the other digits move into the wrong places. Only zeros at the very **start** of the whole number may be dropped (unless a fixed size is asked for).

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

Hexadecimal to denary uses the place-value method exactly as in binary, but the place values are **1, 16, 256, 4096**. First change each letter into its value (A = 10 … F = 15), then multiply each digit by its place value and add. For a two-digit hex number the left digit counts how many **sixteens** there are and the right digit how many **ones**: 7A means seven sixteens and ten ones. For three digits, the leftmost digit counts the 256s.

From denary to hexadecimal you can **divide by 16**. For numbers up to 255 one division is enough: the whole-number quotient is the left digit and the remainder is the right digit. For larger numbers, keep dividing the quotient by 16 and read the remainders from the bottom up — the same idea as the division-by-2 method for binary. Many students find it easier and safer to convert **denary → binary → hex**, because both of those steps use methods they already know well, and the binary in the middle gives a natural check.

:::example Worked example: a three-digit hex number
A games console reports that a save file is **1F4** bytes long. What is that in denary, and in binary?
1. Place values: 256, 16, 1. Digits: 1, F (= 15), 4.
2. 1 × 256 + 15 × 16 + 4 × 1 = 256 + 240 + 4 = **500 bytes**.
3. To binary, write 4 bits per digit: 1 = 0001, F = 1111, 4 = 0100 → 0001 1111 0100 → **111110100** (the leading zeros of the whole number can be dropped).
4. Check: 256 + 128 + 64 + 32 + 16 + 4 = 500 ✔. Back to hex from 500: 500 ÷ 16 = 31 r 4; 31 ÷ 16 = 1 r 15 (F); 1 ÷ 16 = 0 r 1 → read bottom up: **1F4** ✔.
:::

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

To understand why hexadecimal is so popular, imagine the job of a programmer who must look at the contents of memory while searching for a bug. Memory is billions of bytes, and every byte is eight 0s and 1s. A screen full of binary — 01001000 01100101 01101100 01101100 — is almost impossible to read: the eye loses its place, two similar patterns look identical, and copying one value by hand easily introduces an error. Denary would be shorter, but the programmer often needs to know **which individual bits** are set (for example, which bit is a flag or which bits make up a colour channel), and a denary number hides the bits. Hexadecimal solves both problems at once: it is short **and** it shows the bits, because each digit can be turned back into its nibble instantly.

## The advantages explained

**It is much shorter than binary.** One hex digit replaces four bits, so a byte is written with two characters instead of eight, and a 32-bit memory address needs eight hex digits instead of thirty-two bits. Shorter values fit on a screen, in a table or on a device label, and can be read aloud over the phone.

**It is easier for people to read, remember and compare.** Humans are poor at handling long strings of identical symbols. FF and F0 are clearly different at a glance; 11111111 and 11110000 need careful counting. Because the digits are more varied, a person can remember a value such as 3C long enough to type it.

**It reduces errors.** Every copied digit is a chance for a mistake. With a quarter of the digits there are far fewer chances to drop, swap or repeat a symbol, so technicians and programmers make fewer transcription errors.

**It converts to and from binary easily.** Unlike denary, no arithmetic is needed: each hex digit maps directly onto four bits. This means a programmer can still "see" the binary — for example, that the hex value 80 is 1000 0000, with only the MSB set.

**It lines up with bytes and memory.** Two hex digits are exactly one byte, four digits are two bytes, and so on. Memory sizes and addresses are powers of two, so they come out as round numbers in hex (a 64 KB block ends at address FFFF), which makes memory layouts easy to understand.

None of these advantages is about the computer itself. Hexadecimal does **not** make the computer faster and does **not** save any memory, because the value is stored in binary whichever way a human writes it.

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

# Hexadecimal at work
@lo 11.1.1.2 11.1.1.3

An exam answer about the advantages of hexadecimal is much stronger when it is linked to a **real use**. In this section we look closely at four places where you meet hexadecimal and see, in each case, exactly why hex is chosen instead of binary or denary.

## Colour codes on web pages

:::definition RGB colour code
A colour written as three bytes — the amounts of **red, green and blue** light, each 0–255 — usually in hex as **#RRGGBB**, e.g. #FF8000 (red 255, green 128, blue 0).
:::

Every colour on a screen is mixed from red, green and blue light. A web page stores each of the three amounts in **one byte**, so a colour takes 24 bits. In CSS that colour is written as a # followed by **six hex digits**: the first pair is red, the second green, the third blue. #000000 is black (no light), #FFFFFF is white (all channels at 255), #FF0000 is pure red. A designer can tell from the code alone that #F0F0F0 is a very light grey (all three channels high and equal) or that #0000AA is a darker blue. The same colour in binary would be a 24-digit string, and in denary three separate numbers that do not show the byte boundaries as neatly.

:::example Worked example: a school website colour
The school website uses the colour **#1E90C8** for its buttons. Find the red, green and blue values.
1. Split into pairs: **1E**, **90**, **C8**.
2. Red: 1E = 1 × 16 + 14 = **30**.
3. Green: 90 = 9 × 16 + 0 = **144**.
4. Blue: C8 = 12 × 16 + 8 = **200**.
5. So the colour is RGB(30, 144, 200) — mostly blue with some green: a sky blue. To make it slightly darker, the designer lowers each pair, e.g. #1A7EB0.
:::

## Memory addresses and memory dumps

:::definition Memory address
A number that identifies **one location (byte) in main memory**. Addresses are shown in hex, e.g. 0x7FFE0010, because they are long binary numbers.
:::

When a program crashes, the operating system or a debugger can show a **memory dump**: a listing of the addresses and the bytes stored at them. Both are shown in hex. Each row of the dump typically shows 16 bytes, so the addresses go up by 10₁₆ each row — a neat pattern that would be lost in denary. A programmer who knows the character codes can even read text in the dump: the bytes 48 65 6C 6C 6F are the ASCII codes of "Hello".

:::svg A memory dump: addresses and bytes shown in hexadecimal
<svg class="nr" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A memory dump. Address 0x0040 holds bytes 48 65 6C 6C 6F, which are the ASCII codes of Hello; the same first byte 48 in binary is 01001000">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .m{font:600 15px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .mp{font:700 15px ui-monospace,monospace;fill:var(--primary)}
    svg.nr .ms{font:700 15px ui-monospace,monospace;fill:var(--success)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
  </style>
  <text class="h" x="30" y="28">Address</text><text class="h" x="160" y="28">Bytes (hex)</text><text class="h" x="560" y="28">As text</text>
  <rect class="bx" x="20" y="40" width="720" height="34" rx="6"/>
  <text class="m" x="30" y="63">0x0030</text><text class="m" x="160" y="63">00 00 00 00 1F 4A 00 02</text><text class="m" x="560" y="63">. . . . . J . .</text>
  <rect class="on" x="20" y="80" width="720" height="34" rx="6"/>
  <text class="mp" x="30" y="103">0x0040</text><text class="mp" x="160" y="103">48 65 6C 6C 6F 21 00 00</text><text class="ms" x="560" y="103">H e l l o ! . .</text>
  <rect class="ok" x="20" y="128" width="340" height="60" rx="8"/>
  <text class="t" x="34" y="152">one byte: hex 48 = 0100 1000</text>
  <text class="s" x="34" y="174">= 64 + 8 = 72 = ASCII code of "H"</text>
  <text class="t" x="390" y="152">2 hex digits per byte, 8 bytes per row</text>
  <text class="s" x="390" y="174">the same row in binary would be 64 digits long</text>
</svg>
:::

## MAC addresses and other identifiers

:::definition MAC address
A **48-bit** hardware address that identifies a network interface card, written as **6 pairs of hex digits**, e.g. 3C-A8-2A-F0-11-6B. The first 3 bytes identify the manufacturer.
:::

A MAC address is burned into every network card, Wi-Fi adapter and phone. Network administrators read them from labels, type them into router filter lists and compare them in log files. Written in binary, each address would be 48 digits long; in hex it is 12 digits, separated into pairs so that each pair is one byte. The same idea is used for **IPv6** addresses (128 bits written as eight groups of four hex digits, e.g. 2001:0db8:0000:0000:0000:ff00:0042:8329) and for **Unicode** character codes (U+0416 is the Cyrillic letter Ж).

## Error codes, machine code and assembly

When Windows stops with an error screen, or a printer shows a fault code, the code is often in hex, for example **0x0000007B**. The value is really a binary number produced by the program, and hex lets an engineer look it up in a manual or type it into a search engine. Programmers who work close to the hardware — writing **assembly language** or examining **machine code** — also see instructions and data in hex, because each instruction is a binary pattern and hex shows its bytes and bits compactly.

:::compare Where hexadecimal is used — and why
| Use | Example | Size | Why hex rather than binary or denary |
|---|---|---|---|
| Colour codes (HTML/CSS) | #1E90C8 | 3 bytes | Each pair = one colour channel; 6 digits instead of 24 bits |
| Memory addresses / dumps | 0x0040: 48 65 6C | Many bytes | Rows line up with bytes; bits of each byte can be seen |
| MAC addresses | 3C-A8-2A-F0-11-6B | 6 bytes | 12 digits instead of 48 bits; easy to read off a label |
| IPv6 addresses | 2001:0db8::8329 | 16 bytes | 32 digits instead of 128 bits |
| Error / status codes | 0x0000007B | 4 bytes | Short, exact value to look up |
| Machine code / assembly | B8 01 00 | Instructions | Shows the bit patterns of instructions compactly |
:::

:::warning Common mistakes
- Splitting a colour code into the wrong pairs — it is always **RR GG BB** from the left after the #.
- Writing that a MAC address has 6 bits — it has **6 bytes = 48 bits**.
- Converting a colour pair with denary place values (C8 = 12 × 10 + 8 ✗) — use **× 16**.
- Naming a use without the reason: the mark is often for **why** hex suits that use.
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

Remember how you add 58 + 67 in denary. You add the units, 8 + 7 = 15; 15 does not fit in one column, so you write 5 and **carry** 1 ten into the tens column. Then 5 + 6 + 1 = 12: write 2, carry 1 into the hundreds. The answer is 125. Binary addition uses exactly the same method. The only difference is that a binary column can hold only 0 or 1, so it overflows into the next column much sooner — as soon as the total in a column reaches **2**. Since 2 in binary is written 10, you write the 0 in the current column and carry the 1. If a column contains two 1s **and** a carry from the right, the total is 3, which is 11 in binary: write 1 and carry 1. These are the only four cases that can ever happen, so binary addition is very easy to learn and very easy to build into hardware.

:::definition Carry
The **1 that is passed to the next column on the left** when the total in a column is too large for one digit — in binary, when a column adds up to 2 (10₂) or 3 (11₂).
:::

Processors add binary numbers all the time — not only for arithmetic in programs, but also to calculate the address of the next instruction, to move through the items of an array and to count loop repetitions. Every one of these additions follows the four rules in the table below.

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

:::example Worked example: a column with three 1s
A shop's stock program adds the morning delivery to the stock of exercise books: **01101111** (111) + **00111011** (59).
1. Column 1 (place value 1): 1 + 1 = 10 → write **0**, carry 1.
2. Column 2: 1 + 1 + carry 1 = 11 → write **1**, carry 1.
3. Column 3: 1 + 0 + 1 = 10 → write **0**, carry 1.
4. Column 4: 1 + 1 + 1 = 11 → write **1**, carry 1.
5. Column 5: 0 + 1 + 1 = 10 → write **0**, carry 1.
6. Column 6: 1 + 1 + 1 = 11 → write **1**, carry 1.
7. Column 7: 1 + 0 + 1 = 10 → write **0**, carry 1.
8. Column 8: 0 + 0 + 1 = 1 → write **1**, no carry out.
9. Result **10101010** = 128 + 32 + 8 + 2 = **170**. Check: 111 + 59 = 170 ✔. There is no carry out of the eighth column, so the answer fits in 8 bits.
:::

Always check an addition by converting both numbers and the result into denary. The check takes less than a minute and catches the most common error — a forgotten carry. If a question asks you to add **three** binary numbers, add the first two, then add the third to that result; trying to add three bits plus carries in one column at once (which can give totals up to 5) leads to mistakes.

## Overflow

Inside a computer, numbers are not written on paper with as many columns as we like — they are held in **registers** and memory locations of a **fixed size**. An 8-bit register has exactly eight places, so the largest number it can hold is 11111111 = 255. When the true result of an addition needs more bits than the register has, the extra bit is simply not stored. The result that remains looks like a normal number, but it is wrong. This is called an **overflow**, and it is one of the classic sources of bugs in real software: counters that suddenly jump back to zero, scores that become small after becoming very large, and clocks that reset. A famous example is a video-view counter that was stored in a 32-bit signed integer; when a popular music video passed about 2.1 billion views the counter could not go any higher, and the programmers had to change it to 64 bits.

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

Why does this work? In denary long multiplication, 23 × 14 is worked out as 23 × 4 plus 23 × 10: the second row is shifted one place left because it represents tens. In binary the multiplier is split into **powers of two** in the same way. The multiplier 101 (5) means 4 + 1, so 13 × 5 = 13 × 4 + 13 × 1. Multiplying by 1 just copies the number; multiplying by 2, 4 or 8 just **shifts** it 1, 2 or 3 places to the left. So every row of a binary long multiplication is either the multiplicand shifted to the position of a 1 in the multiplier, or nothing at all. The rows are then added with ordinary binary addition. There are no times tables to learn — the method needs only **copying, shifting and adding**.

:::definition Partial product
One row of a long multiplication: the **multiplicand × one bit of the multiplier**, shifted to that bit's position. In binary each partial product is either the multiplicand (shifted) or **zero**; the product is the sum of the partial products.
:::

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

A **shift** moves every bit of a number the same number of places to the left or to the right. It is the binary version of multiplying or dividing a denary number by 10 by adding or removing a zero at the end: 47 becomes 470 when every digit moves one place left. In binary, moving every bit one place left puts each 1 into a column worth **twice as much**, so the whole value doubles. Moving two places multiplies by 4, three places by 8 — in general, a left shift by *n* places multiplies by 2ⁿ. The empty places on the right are filled with zeros.

A right shift does the opposite: every bit moves into a column worth half as much, so the value is **halved**. The rightmost bit falls off the end and is lost. If that bit was a 1 (the number was odd), the remainder of the division is lost too: 00010111 (23) shifted right one place becomes 00001011 (11), not 11.5. A left shift has the opposite danger: if a 1 falls off the **left** end of the register, the result is too large to store and an overflow occurs. Shifting is exactly what happens to each row in long multiplication, which is why the two ideas are taught together.

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

# Binary arithmetic in the processor
@lo 11.1.1.4

The methods you use on paper are the same ones the processor uses in hardware. Seeing how the processor does it explains **why** binary arithmetic is so important and **why** overflow is a real problem, not just an exam trick.

:::definition Arithmetic logic unit (ALU)
The part of the **processor** that performs **arithmetic** (addition, subtraction, shifts, multiplication) and **logic** operations (AND, OR, NOT, comparisons) on binary numbers held in registers.
:::

:::definition Register
A very small, very fast **storage location inside the processor** that holds a fixed number of bits (e.g. 8, 16, 32 or 64), such as the numbers an instruction is working on and its result.
:::

## How the ALU adds

When a program contains an instruction such as `total ← total + price`, the processor copies the two values into **registers**, the **ALU** adds them bit by bit with exactly the four rules of binary addition, and the result is written into a register. The ALU contains one small circuit, called an adder, for each column. Each adder takes two bits and the carry from the column on its right, produces one result bit and passes a carry to the next column on its left — just as you do on paper, but for all 32 or 64 columns in a few billionths of a second. The carry that comes out of the leftmost adder has no register column to go into, so the ALU puts it into a special one-bit store called the **carry flag** (often discussed as the overflow flag at this level). After every addition the program can test the flag; if it is 1, the result did not fit and the program can show an error or switch to a larger number size.

:::svg Inside the processor: registers, the ALU and the overflow flag
<svg class="nr" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two 8-bit registers A = 11110000 and B = 00011111 feed the ALU; the 8-bit result register gets 00001111 and the 9th carry bit goes to the overflow flag, which is set to 1">
  <style>
    svg.nr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nr .m{font:700 16px ui-monospace,monospace;fill:var(--foreground)}
    svg.nr .md{font:700 16px ui-monospace,monospace;fill:var(--danger)}
    svg.nr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nr .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.nr .ar{fill:var(--muted)}
  </style>
  <rect class="bx" x="20" y="20" width="210" height="56" rx="8"/><text class="s" x="34" y="40">Register A (240)</text><text class="m" x="34" y="64">11110000</text>
  <rect class="bx" x="20" y="100" width="210" height="56" rx="8"/><text class="s" x="34" y="120">Register B (31)</text><text class="m" x="34" y="144">00011111</text>
  <path class="ln" d="M230,48 H290 V100"/><path class="ln" d="M230,128 H290"/>
  <rect class="on" x="290" y="70" width="150" height="90" rx="10"/><text class="h" x="365" y="108" text-anchor="middle">ALU</text><text class="s" x="365" y="128" text-anchor="middle">adds A + B</text>
  <path class="ln" d="M440,100 H500"/><path class="ar" d="M500,93 l12,7 l-12,7 z"/>
  <rect class="bx" x="514" y="72" width="226" height="56" rx="8"/><text class="s" x="528" y="92">Result register (8 bits)</text><text class="m" x="528" y="116">00001111 = 15 ✗</text>
  <path class="ln" d="M365,160 V190 H500"/><path class="ar" d="M500,183 l12,7 l-12,7 z"/>
  <rect class="no" x="514" y="164" width="226" height="52" rx="8"/><text class="s" x="528" y="184">9th bit → overflow / carry flag</text><text class="md" x="528" y="206">flag = 1</text>
  <text class="t" x="20" y="196">true sum 240 + 31 = 271 = 1 00001111</text>
  <text class="s" x="20" y="216">271 needs 9 bits; only 8 are kept</text>
</svg>
:::

## How the processor multiplies

Simple processors do not have a separate multiplication circuit at all: they multiply by **repeating shifts and additions**, exactly the method on paper. The processor looks at the multiplier one bit at a time, starting from the right. Every time the bit is 1 it adds the (shifted) multiplicand to a running total; every time it moves to the next bit it shifts the multiplicand one more place to the left. Modern processors have fast multiplier circuits, but these are still built from the same two operations. This is also why programmers and compilers replace a multiplication by 2, 4, 8 … with a **left shift**: a shift is a single, very fast operation, whereas a full multiplication takes several steps.

:::steps The shift-and-add algorithm (as the processor does it)
- Set the **total** to 0.
- Look at the **rightmost bit** of the multiplier. If it is **1**, add the multiplicand to the total.
- **Shift the multiplicand one place left** (× 2) and move to the **next bit** of the multiplier.
- Repeat until all bits of the multiplier have been used; the total is the **product**.
- If any addition or shift needs more bits than the register has, an **overflow** occurs.
:::

## Overflow in multiplication

Multiplication makes numbers grow much faster than addition. Adding two 8-bit numbers can give at most 255 + 255 = 510, which needs **9 bits**. Multiplying two 8-bit numbers can give up to 255 × 255 = 65 025, which needs **16 bits**. In general, the product of an *n*-bit number and an *m*-bit number can need up to **n + m bits**. For this reason processors usually put the result of a multiplication into a **double-length** register, or a pair of registers, and programs that keep the product in the original size must check for overflow.

:::example Worked example: overflow in a multiplication
A school canteen's till stores amounts in **8-bit** registers. It multiplies the price of a juice, **00011001** (25 tenge-units), by the number sold, **00001100** (12).
1. The multiplier 1100 has 1s in positions 2 and 3 (place values 4 and 8).
2. Partial products: 11001 shifted 2 places → **1100100** (100); shifted 3 places → **11001000** (200).
3. Add: 1100100 + 11001000 = **100101100** — that is 9 bits (300).
4. 300 > 255, so in an 8-bit register only **00101100** = 44 is kept: an **overflow error**. The till would charge for 44 units instead of 300.
5. Fix: store the result in a **16-bit** register (maximum 65 535).
:::

:::compare Binary addition and binary multiplication
| | Addition | Multiplication |
|---|---|---|
| Basic method | Column addition with carries | Long multiplication: shift and add partial products |
| Operations used | Add bits + carry | Copy, **shift left**, add |
| Rules to learn | 0+0=0, 0+1=1, 1+1=10, 1+1+1=11 | 0×0=0, 0×1=0, 1×1=1 |
| Largest result of two 8-bit numbers | 510 → needs **9 bits** | 65 025 → needs **16 bits** |
| How overflow shows | A **carry out** of the leftmost column | Product has **more bits** than the register |
| Quick check | Convert to denary and add | Convert to denary and multiply |
:::

:::warning Common mistakes
- Thinking overflow only happens in addition — **multiplication and left shifts** overflow too, and more easily.
- Saying the processor "notices it is too big and stores 255" — it keeps the **lowest bits**, giving a wrong, smaller value, and sets a **flag**.
- Saying the ALU stores data — the ALU **calculates**; values are held in **registers**.
- Forgetting that a product of two 4-bit numbers can need **8 bits**.
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
