---
summary: How text is stored as binary character codes — character sets, ASCII, extended ASCII and code pages, Unicode code points and the UTF-8, UTF-16 and UTF-32 encodings, a full comparison of ASCII and Unicode, and how to calculate (and work backwards from) the number of bytes needed to store a text fragment.
---
# Characters and character sets
@lo 11.1.1.7

A computer can only store and process **binary** — patterns of 0s and 1s. Numbers are easy to store in binary, but text is not made of numbers: it is made of letters, digits, spaces, punctuation marks and symbols. To store text, the computer therefore needs an agreement that turns **every character into a number**. That number is called the character's **character code**, and the agreed list of characters and their codes is called a **character set**. Once every character has a number, the number can be written in binary and stored in memory, saved in a file or sent across a network like any other data.

This idea is used every time you type. When you press the key **A**, the keyboard sends a signal to the computer, the operating system looks up the code for capital "A" (65 in ASCII and in Unicode) and stores the binary pattern **01000001**. Nothing in memory "looks like" the letter A — there is only the number. When the text is shown on the screen or printed, the process runs the other way: the program reads the number 65, looks it up in the same character set, and the **font** draws the shape (the **glyph**) for "A". The same code 65 may be drawn in Arial, Times New Roman or a handwriting font — the code says **which** character it is, the font decides **what it looks like**.

:::definition Character
A single **symbol** that can be stored as text: an upper- or lower-case letter, a digit, a punctuation mark, a space, a mathematical or currency symbol, an emoji, or an invisible **control character** such as a new line or a tab.
:::

:::definition Character code
The **unique binary number** that represents one character in a character set. For example, in ASCII the character "A" has the character code **65** (binary **1000001**).
:::

:::definition Character set
A **defined list of characters** that a computer can recognise, together with the **unique binary code** assigned to each one. Examples: **ASCII**, **extended ASCII**, **Unicode**.
:::

:::svg From key press to stored binary and back to a glyph on the screen
<svg class="txr" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Typing the letter A: the key press is looked up in the character set to give code 65, which is stored as binary 01000001; when displayed, code 65 is looked up again and the font draws the glyph A">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .m{font:700 14px ui-monospace,monospace;fill:var(--primary)}
    svg.txr .big{font:700 34px Georgia,serif;fill:var(--foreground)}
    svg.txr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.txr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.txr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.txr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="txrA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="20" y="24">Storing (encoding)</text>
  <rect class="bx" x="20" y="38" width="130" height="70" rx="8"/><text class="t" x="85" y="68" text-anchor="middle">Key press</text><text class="big" x="85" y="100" text-anchor="middle" style="font-size:22px">[A]</text>
  <line class="ln" x1="150" y1="73" x2="200" y2="73" marker-end="url(#txrA1)"/>
  <rect class="pb" x="200" y="38" width="170" height="70" rx="8"/><text class="t" x="285" y="64" text-anchor="middle">Look up in the</text><text class="t" x="285" y="82" text-anchor="middle">character set</text><text class="s" x="285" y="100" text-anchor="middle">"A" → 65</text>
  <line class="ln" x1="370" y1="73" x2="420" y2="73" marker-end="url(#txrA1)"/>
  <rect class="ok" x="420" y="38" width="170" height="70" rx="8"/><text class="t" x="505" y="64" text-anchor="middle">Store the code</text><text class="m" x="505" y="90" text-anchor="middle">01000001</text>
  <line class="ln" x1="590" y1="73" x2="640" y2="73" marker-end="url(#txrA1)"/>
  <rect class="bx" x="640" y="38" width="100" height="70" rx="8"/><text class="t" x="690" y="68" text-anchor="middle">Memory /</text><text class="t" x="690" y="86" text-anchor="middle">file</text>
  <text class="h" x="20" y="146">Displaying (decoding)</text>
  <rect class="ok" x="20" y="160" width="170" height="70" rx="8"/><text class="t" x="105" y="186" text-anchor="middle">Read the code</text><text class="m" x="105" y="212" text-anchor="middle">01000001 = 65</text>
  <line class="ln" x1="190" y1="195" x2="240" y2="195" marker-end="url(#txrA1)"/>
  <rect class="pb" x="240" y="160" width="190" height="70" rx="8"/><text class="t" x="335" y="186" text-anchor="middle">Look up 65 in the</text><text class="t" x="335" y="204" text-anchor="middle">same character set</text><text class="s" x="335" y="222" text-anchor="middle">65 → "A"</text>
  <line class="ln" x1="430" y1="195" x2="480" y2="195" marker-end="url(#txrA1)"/>
  <rect class="bx" x="480" y="160" width="260" height="70" rx="8"/><text class="t" x="560" y="186" text-anchor="middle">Font draws the glyph</text><text class="big" x="660" y="210" text-anchor="middle">A</text><text class="big" x="710" y="210" text-anchor="middle" style="font-family:system-ui,sans-serif">A</text><text class="s" x="560" y="214" text-anchor="middle">same code, any font</text>
</svg>
:::

## Why a standard character set is needed

A character set only works if **everybody uses the same one**. Imagine that the school's computers stored "A" as 65 but a computer at home stored "A" as 193. A homework file typed at school and opened at home would show the wrong characters — every code would be looked up in the wrong list. This is exactly what happens when a file is opened with the wrong character set: the reader sees strange symbols such as "РЎ" instead of "С". This garbled text has a name — **mojibake** (a Japanese word meaning "character transformation").

A **standard** character set solves the problem. When every computer, program, keyboard, printer and web browser agrees on the same codes, text can be **exchanged** between devices, programs and countries and will always appear as the same characters. This is why character sets are published as international standards: ASCII was published as an American standard in 1963, and Unicode is maintained by the Unicode Consortium and matches the international standard ISO/IEC 10646. A standard also makes **processing** possible: if the codes of the letters are in alphabetical order, a program can **sort** names simply by comparing their codes, and it can **search** for a word by comparing codes one by one.

:::cards
### Printable characters
Characters that appear on the screen or paper: **letters** (A–Z, a–z, Ә, Қ, Ж…), **digits** (0–9), **punctuation** (. , ! ? ; :), the **space**, and **symbols** (@ # % + € ₸).
### Control characters
Codes that are **not printed** but tell the device what to do: **line feed / new line** (LF, code 10), **carriage return** (CR, code 13), **tab** (code 9), **backspace** (code 8), **escape** (code 27). They were originally commands for teleprinters and are still used in every text file.
### The digit characters
The **character** "7" is **not** the **number** 7. In ASCII and Unicode the character "7" has the code **55**. A program that reads "7" from the keyboard must convert the character code into the number before it can do arithmetic with it.
:::

## How many characters can a code size represent?

The number of **bits** used for each character code decides **how many different characters** the character set can contain. With **n** bits there are **2ⁿ** different binary patterns, so 2ⁿ different characters can be given a code. This is the same rule as for colour depth in images: every extra bit **doubles** the number of possible codes.

:::compare Bits per character and the number of possible characters
| Bits per character | Number of codes (2ⁿ) | Enough for… |
|---|---|---|
| 5 | 32 | The 26 capital letters only (early telegraph codes) |
| 7 | 128 | English letters (upper and lower case), digits, punctuation, control codes — **ASCII** |
| 8 | 256 | ASCII plus one extra alphabet or accented letters — **extended ASCII** |
| 16 | 65 536 | Most characters of the world's modern languages — UTF-16 for the common characters |
| 21 (stored in 32) | 2 097 152 (Unicode uses 1 114 112 of them) | **Every** character of **every** writing system, plus emoji — **Unicode** |
:::

The trade-off is already visible in this table. **More bits per character** means **more characters can be represented**, but every character then takes **more memory**, so a file of the same text becomes **larger** and takes **longer to send**. Fewer bits save space but limit the character set to fewer languages. The whole comparison between ASCII and Unicode later in this lesson follows from this one idea.

:::example Worked example: how many bits does a character set need?
A school designs a simple code for a display board that only needs the **26 capital letters**, the **10 digits** and the **space** — 37 characters in total.
- 5 bits give 2⁵ = **32** codes — not enough for 37 characters.
- 6 bits give 2⁶ = **64** codes — enough (27 codes are left unused).
- So the minimum is **6 bits per character**.

If lower-case letters were added (26 more → 63 characters), 6 bits would still just be enough (63 ≤ 64). Adding a full stop as well (64 characters) uses the last code. One more character would need **7 bits**.
:::

# ASCII and extended ASCII
@lo 11.1.1.7

**ASCII** — the **American Standard Code for Information Interchange** — was one of the first widely used character sets. It was designed in the early 1960s, when computers and teleprinters in the USA needed a common way to exchange English text. Its designers chose **7 bits** per character, which gives **2⁷ = 128** codes, numbered **0 to 127**. That was enough for everything an English typewriter could produce, plus control codes for the machines.

:::definition ASCII (American Standard Code for Information Interchange)
A character set that uses **7 bits** per character, giving **2⁷ = 128 characters**: the English upper- and lower-case letters, digits 0–9, punctuation, space and 33 control codes. In practice each ASCII character is stored in **one byte** (8 bits), with the extra (leftmost) bit set to 0.
:::

## How the ASCII table is organised

The 128 ASCII codes are not in a random order. They are arranged in **blocks**, and knowing the blocks lets you work out codes instead of memorising them.

:::svg The 128 ASCII codes are arranged in blocks
<svg class="txr" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ASCII codes 0 to 127 shown as a bar: 0 to 31 control characters, 32 space, 33 to 47 punctuation, 48 to 57 digits, 65 to 90 capital letters, 97 to 122 lower-case letters, 127 delete, with punctuation in between">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .m{font:600 12px ui-monospace,monospace;fill:var(--foreground)}
    svg.txr .c0{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.txr .c1{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.txr .c2{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.txr .c3{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
  </style>
  <text class="h" x="20" y="24">ASCII codes 0 – 127 (one box width ≈ 5 codes)</text>
  <rect class="c0" x="20" y="50" width="160" height="50"/><text class="t" x="100" y="72" text-anchor="middle">Control</text><text class="s" x="100" y="90" text-anchor="middle">0 – 31</text>
  <rect class="c1" x="180" y="50" width="80" height="50"/><text class="t" x="220" y="72" text-anchor="middle">Space,</text><text class="s" x="220" y="90" text-anchor="middle">32 – 47 ! " # …</text>
  <rect class="c2" x="260" y="50" width="50" height="50"/><text class="t" x="285" y="72" text-anchor="middle">0–9</text><text class="s" x="285" y="90" text-anchor="middle">48–57</text>
  <rect class="c1" x="310" y="50" width="35" height="50"/><text class="s" x="327" y="80" text-anchor="middle">: ; @</text>
  <rect class="c3" x="345" y="50" width="130" height="50"/><text class="t" x="410" y="72" text-anchor="middle">A – Z</text><text class="s" x="410" y="90" text-anchor="middle">65 – 90</text>
  <rect class="c1" x="475" y="50" width="30" height="50"/><text class="s" x="490" y="80" text-anchor="middle">[ \ ]</text>
  <rect class="c3" x="505" y="50" width="130" height="50"/><text class="t" x="570" y="72" text-anchor="middle">a – z</text><text class="s" x="570" y="90" text-anchor="middle">97 – 122</text>
  <rect class="c1" x="635" y="50" width="25" height="50"/><text class="s" x="647" y="80" text-anchor="middle">{ }</text>
  <rect class="c0" x="660" y="50" width="80" height="50"/><text class="t" x="700" y="72" text-anchor="middle">DEL</text><text class="s" x="700" y="90" text-anchor="middle">127</text>
  <text class="h" x="20" y="136">Useful patterns</text>
  <text class="m" x="20" y="160">"A" = 65 = 100 0001     "a" = 97 = 110 0001     difference = 32 (one bit: the 2⁵ column)</text>
  <text class="m" x="20" y="184">"0" = 48 = 011 0000     "7" = 48 + 7 = 55       the digit's value is in the last 4 bits</text>
  <text class="m" x="20" y="208">"E" = 65 + 4 = 69       "e" = 97 + 4 = 101      letters follow alphabetical order</text>
</svg>
:::

- **Codes 0–31 and 127** are **control characters**. Only a few are still used in everyday files: **9** (tab), **10** (line feed), **13** (carriage return).
- **Code 32** is the **space**. A space is a real character with its own code — it takes up storage like any letter.
- **Codes 48–57** are the **digit characters** "0" to "9". Because "0" is 48, the code of any digit is 48 + its value: "7" = 55.
- **Codes 65–90** are the **capital letters** A–Z, in alphabetical order: "A" = 65, "B" = 66, … "Z" = 90.
- **Codes 97–122** are the **lower-case letters** a–z. Each lower-case letter is exactly **32 more** than its capital: "a" = 65 + 32 = 97, "m" = 77 + 32 = 109. In binary, this is a single bit (the 32s column), so converting between cases is very fast for a computer.
- The remaining codes are punctuation and symbols: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~

Because the letters are in order, comparing codes is the same as comparing alphabetical positions. This is why a program can sort "Aliya" before "Bauyrzhan": 65 < 66. It also explains a strange result you may see in spreadsheets and programs: "Zarina" may be sorted **before** "aliya", because every capital (65–90) has a smaller code than every lower-case letter (97–122).

:::compare Selected ASCII codes in denary, binary and hexadecimal
| Character | Denary | 7-bit binary | Hexadecimal |
|---|---|---|---|
| Line feed (new line) | 10 | 0001010 | 0A |
| Space | 32 | 0100000 | 20 |
| ! | 33 | 0100001 | 21 |
| 0 | 48 | 0110000 | 30 |
| 9 | 57 | 0111001 | 39 |
| A | 65 | 1000001 | 41 |
| C | 67 | 1000011 | 43 |
| Z | 90 | 1011010 | 5A |
| a | 97 | 1100001 | 61 |
| z | 122 | 1111010 | 7A |
:::

:::example Worked example: encoding and decoding a word in ASCII
**Encode "Cab1"** using ASCII.
- "C" is the 3rd capital letter: 65 + 2 = **67** = 1000011.
- "a" = **97** = 1100001.
- "b" = 97 + 1 = **98** = 1100010.
- "1" is a digit character: 48 + 1 = **49** = 0110001.

Stored in four bytes (leftmost bit 0): **01000011 01100001 01100010 00110001**.

**Decode** the codes 72 105 33. 72 = 65 + 7 → the 8th capital letter, **H**. 105 = 97 + 8 → the 9th lower-case letter, **i**. 33 = **!**. The text is **"Hi!"**.
:::

## Why ASCII is stored in 8 bits

ASCII needs only 7 bits, but computers store and move data in **bytes** of 8 bits. So each ASCII character is normally stored in **one byte**, with the **most significant bit set to 0**. In the past, that spare 8th bit was sometimes used as a **parity bit** to check for errors in transmission. Later, people realised that the spare bit could double the number of codes — and this led to extended ASCII.

## Extended ASCII and code pages

Standard ASCII has no letters with accents (é, ü, ñ), no Cyrillic (А, Б, Ж), no Kazakh letters (Ә, Қ, Ө) and no symbols such as € or £. Countries that did not use English needed more characters. The solution was to use **all 8 bits**, giving **2⁸ = 256** codes. Codes **0–127 stayed the same as ASCII**, and the new codes **128–255** were filled with extra characters.

:::definition Extended ASCII
A character set that uses **8 bits** per character, giving **256 characters**: the 128 standard ASCII characters (codes 0–127) plus 128 extra characters (codes 128–255) for accented letters, symbols or another alphabet. Different extended sets — called **code pages** — use codes 128–255 for **different** characters.
:::

The problem was that **128 extra codes are not enough for everybody**. Western Europe needed accented Latin letters; Russia and Kazakhstan needed Cyrillic; Greece needed Greek. So many **different** extended ASCII sets were created, each called a **code page**: for example **ISO 8859-1 / Windows-1252** for Western European languages, **Windows-1251** and **KOI8-R** for Cyrillic, and **KZ-1048** for Kazakh (Windows-1251 does not contain the Kazakh letters Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І). In each code page, the same byte means a **different character**.

:::svg The same byte means different characters in different code pages
<svg class="txr" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The byte 11000000, code 192, is shown as À in the Western European code page Windows-1252, as Cyrillic А in Windows-1251 and as ю in KOI8-R; a Russian word saved in one code page appears as wrong symbols when opened with another">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .m{font:700 14px ui-monospace,monospace;fill:var(--primary)}
    svg.txr .big{font:700 30px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.txr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.txr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.txr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="txrA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <rect class="pb" x="20" y="70" width="170" height="80" rx="8"/><text class="t" x="105" y="96" text-anchor="middle">One stored byte</text><text class="m" x="105" y="120" text-anchor="middle">11000000</text><text class="s" x="105" y="140" text-anchor="middle">= 192</text>
  <line class="ln" x1="190" y1="110" x2="300" y2="40" marker-end="url(#txrA2)"/>
  <line class="ln" x1="190" y1="110" x2="300" y2="110" marker-end="url(#txrA2)"/>
  <line class="ln" x1="190" y1="110" x2="300" y2="180" marker-end="url(#txrA2)"/>
  <rect class="bx" x="300" y="16" width="200" height="50" rx="8"/><text class="t" x="312" y="46">Windows-1252</text><text class="big" x="470" y="52" text-anchor="middle">À</text>
  <rect class="bx" x="300" y="86" width="200" height="50" rx="8"/><text class="t" x="312" y="116">Windows-1251</text><text class="big" x="470" y="122" text-anchor="middle">А</text>
  <rect class="bx" x="300" y="156" width="200" height="50" rx="8"/><text class="t" x="312" y="186">KOI8-R</text><text class="big" x="470" y="192" text-anchor="middle">ю</text>
  <rect class="no" x="530" y="60" width="210" height="100" rx="8"/><text class="h" x="635" y="84" text-anchor="middle">Mojibake</text><text class="t" x="635" y="106" text-anchor="middle">File saved with one</text><text class="t" x="635" y="124" text-anchor="middle">code page, opened with</text><text class="t" x="635" y="142" text-anchor="middle">another → wrong symbols</text>
  <text class="s" x="20" y="228">Codes 0–127 are identical in every code page, so English text survives; only codes 128–255 change meaning.</text>
</svg>
:::

This caused real problems. An e-mail written in Russian in Windows-1251 and opened on a computer using KOI8-R arrived as nonsense. A single document could not mix Kazakh, Greek and French, because one code page could only hold one extra alphabet. A file did not usually record which code page it used, so the receiving program had to **guess**. Languages with thousands of characters — Chinese, Japanese, Korean — could not fit in 256 codes at all and needed their own, more complicated, multi-byte systems. Extended ASCII solved the problem for one country at a time, but it made **international** exchange of text unreliable. This is the problem Unicode was designed to solve.

:::compare ASCII and extended ASCII
| | ASCII | Extended ASCII |
|---|---|---|
| Bits per character | **7** (stored in a byte with a leading 0) | **8** |
| Number of characters | **128** (codes 0–127) | **256** (codes 0–255) |
| Characters included | English letters, digits, punctuation, control codes | All of ASCII **plus** 128 extra: accented letters, symbols, or **one** other alphabet |
| Is it one standard? | **Yes** — the same everywhere | **No** — many different **code pages**; code 192 can be À, А or ю |
| Main problem | Cannot show any non-English characters | Text looks wrong if opened with the wrong code page; still only one extra alphabet |
:::

# Unicode and its encodings
@lo 11.1.1.7

**Unicode** was created at the end of the 1980s with a simple but ambitious goal: **one character set for every character of every writing system in the world**. Instead of hundreds of code pages that each re-use the same 256 codes, Unicode gives **every character its own unique number**, which never changes and means the same thing on every computer, phone and web page in every country.

:::definition Unicode
A universal character set that aims to give **every character of every writing system** — Latin, Cyrillic (including Kazakh letters such as **Ә, Қ, Ң, Ө, Ұ, Ү, Һ, І**), Arabic, Chinese, mathematical symbols and **emoji** — its **own unique code**, called a **code point**. It has room for **1 114 112** code points; about 150 000 characters are already assigned, and new ones (for example new emoji) are added in each version.
:::

:::definition Code point
The **unique number** that Unicode assigns to one character, written as **U+** followed by at least four **hexadecimal** digits. Examples: **U+0041** = "A", **U+04D8** = "Ә", **U+20AC** = "€", **U+1F600** = 😀.
:::

## Code points and backward compatibility

Unicode code points run from **U+0000** to **U+10FFFF**. They are grouped into 17 **planes** of 65 536 code points each. The first plane, the **Basic Multilingual Plane (BMP)**, U+0000 to U+FFFF, contains almost all characters used in modern languages — Latin, Cyrillic, Greek, Arabic, Hebrew, Indian scripts and the common Chinese, Japanese and Korean characters. The other planes hold rare historic scripts, rarely used Chinese characters, musical notation and **emoji**.

A very important design decision is that **the first 128 Unicode code points are exactly the same as ASCII**: U+0041 is "A" (65), U+0030 is "0" (48), U+0020 is the space. This is called **backward compatibility**: every old ASCII text is automatically valid Unicode text with the same meaning, and programs could move to Unicode without converting old English files. The next 128 code points (U+0080 to U+00FF) are the same as the Western European code page ISO 8859-1.

:::compare Example code points
| Character | Name | Code point | Denary | Plane |
|---|---|---|---|---|
| A | Latin capital A | U+0041 | 65 | BMP (same as ASCII) |
| 7 | Digit seven | U+0037 | 55 | BMP (same as ASCII) |
| А | Cyrillic capital A | U+0410 | 1040 | BMP |
| Ә | Cyrillic capital schwa (Kazakh) | U+04D8 | 1240 | BMP |
| Қ | Cyrillic capital ka with descender (Kazakh) | U+049A | 1178 | BMP |
| € | Euro sign | U+20AC | 8364 | BMP |
| 中 | Chinese "middle" | U+4E2D | 20013 | BMP |
| 😀 | Grinning face emoji | U+1F600 | 128512 | Plane 1 (outside the BMP) |
:::

Notice that the Latin "A" (U+0041) and the Cyrillic "А" (U+0410) look identical on screen but are **different characters with different codes**. A computer searching for the Latin word "Astana" will not find it if the first letter was typed on a Cyrillic keyboard. The code identifies the character; the shape is only the font's drawing of it.

## Encodings: how code points are stored as bytes

A code point is just a number. To store it in memory or a file, the number must be turned into a sequence of **bytes**. The rule for doing this is called a **character encoding** (or **encoding form**). Unicode has three standard encodings. They all represent exactly the same characters — the difference is only **how many bytes** each character takes and how the bytes are arranged.

:::definition Character encoding (UTF-8, UTF-16, UTF-32)
The **rule that converts each Unicode code point into a sequence of bytes** for storage or transmission. **UTF-8** uses **1–4 bytes** per character, **UTF-16** uses **2 or 4 bytes**, and **UTF-32** always uses **4 bytes**. "UTF" stands for Unicode Transformation Format.
:::

:::cards
### UTF-8 — variable length, 1 to 4 bytes
Characters **U+0000–U+007F** (all of ASCII) take **1 byte** — identical to ASCII. Characters up to U+07FF (Latin with accents, **Cyrillic**, Greek, Arabic, Hebrew) take **2 bytes**. The rest of the BMP (Chinese, Japanese, Indian scripts, €) takes **3 bytes**. Characters outside the BMP (**emoji**, rare scripts) take **4 bytes**. UTF-8 is used by about **98 %** of web pages and is the default in most modern software.
### UTF-16 — 2 or 4 bytes
Every character in the BMP takes exactly **2 bytes (16 bits)**; characters outside the BMP, such as emoji, take **4 bytes** (a "surrogate pair" of two 16-bit units). Used inside Windows, Java and JavaScript. In exam questions, "16-bit Unicode" means **2 bytes per character**.
### UTF-32 — fixed length, 4 bytes
Every character takes exactly **4 bytes (32 bits)** — the code point is simply written as a 32-bit binary number. Simple to process (the 10th character is always at bytes 36–39) but wastes a lot of space: English text is **four times** larger than in ASCII. Rarely used for files.
:::

## How UTF-8 works

UTF-8 is clever because it is **variable length** but the computer can still always tell where each character starts and how many bytes it has. The first bits of each byte act as a signal:

:::svg UTF-8: the first bits of each byte say how many bytes the character uses
<svg class="txr" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UTF-8 byte patterns: A, code point 41, is one byte starting with 0; Kazakh Ә, U+04D8, is two bytes 110 10011 and 10 011000; the euro sign is three bytes starting 1110; an emoji is four bytes starting 11110; continuation bytes always start with 10">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.txr .mp{font:700 13px ui-monospace,monospace;fill:var(--danger)}
    svg.txr .b1{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.txr .b2{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.txr .b3{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
  </style>
  <text class="h" x="20" y="22">Character</text><text class="h" x="150" y="22">Code point</text><text class="h" x="280" y="22">Bytes stored in UTF-8 (prefix bits in red)</text>
  <text class="t" x="20" y="58">A</text><text class="m" x="150" y="58">U+0041</text>
  <rect class="b1" x="280" y="38" width="110" height="30" rx="4"/><text class="mp" x="292" y="58">0</text><text class="m" x="302" y="58">1000001</text><text class="s" x="610" y="58">1 byte — same as ASCII</text>
  <text class="t" x="20" y="108">Ә (Kazakh)</text><text class="m" x="150" y="108">U+04D8</text>
  <rect class="b2" x="280" y="88" width="110" height="30" rx="4"/><text class="mp" x="292" y="108">110</text><text class="m" x="320" y="108">10011</text>
  <rect class="b3" x="396" y="88" width="110" height="30" rx="4"/><text class="mp" x="408" y="108">10</text><text class="m" x="428" y="108">011000</text><text class="s" x="610" y="108">2 bytes: D3 98</text>
  <text class="t" x="20" y="158">€</text><text class="m" x="150" y="158">U+20AC</text>
  <rect class="b2" x="280" y="138" width="110" height="30" rx="4"/><text class="mp" x="292" y="158">1110</text><text class="m" x="328" y="158">0010</text>
  <rect class="b3" x="396" y="138" width="100" height="30" rx="4"/><text class="mp" x="406" y="158">10</text><text class="m" x="426" y="158">000010</text>
  <rect class="b3" x="502" y="138" width="100" height="30" rx="4"/><text class="mp" x="512" y="158">10</text><text class="m" x="532" y="158">101100</text><text class="s" x="610" y="182">3 bytes: E2 82 AC</text>
  <text class="t" x="20" y="214">😀 (emoji)</text><text class="m" x="150" y="214">U+1F600</text>
  <rect class="b2" x="280" y="194" width="74" height="30" rx="4"/><text class="mp" x="284" y="214">11110</text><text class="m" x="328" y="214">000</text>
  <rect class="b3" x="358" y="194" width="80" height="30" rx="4"/><text class="mp" x="362" y="214">10</text><text class="m" x="380" y="214">011111</text>
  <rect class="b3" x="442" y="194" width="80" height="30" rx="4"/><text class="mp" x="446" y="214">10</text><text class="m" x="464" y="214">011000</text>
  <rect class="b3" x="526" y="194" width="80" height="30" rx="4"/><text class="mp" x="530" y="214">10</text><text class="m" x="548" y="214">000000</text><text class="s" x="620" y="214">4 bytes</text>
  <text class="s" x="20" y="254">A first byte starting 0 = 1-byte character; 110 = 2 bytes; 1110 = 3 bytes; 11110 = 4 bytes. Every following byte starts 10.</text>
</svg>
:::

- If a byte starts with **0**, it is a complete 1-byte character — and its other 7 bits are the ASCII code. That is why ASCII text is already valid UTF-8.
- If a byte starts with **110**, the character has **2 bytes**; **1110** means **3 bytes**; **11110** means **4 bytes**.
- Every **continuation byte** starts with **10**, so a program that jumps into the middle of a file can always find the start of the next character.
- The remaining bits (shown in black in the diagram) are filled with the bits of the code point.

You do not need to encode characters into UTF-8 by hand in the exam, but you must know **why** UTF-8 is so popular: it is **backward compatible** with ASCII, it uses **only 1 byte** for English letters, digits and punctuation (so English text is no larger than in ASCII), and it can still represent **every Unicode character**. Its disadvantage is that characters have **different lengths**, so a program cannot jump straight to "the 500th character" without counting through the text, and the number of bytes in a file is **not** simply the number of characters.

:::example Worked example: one Kazakh greeting in three encodings
The text **"Сәлем!"** ("Hello!") has 6 characters: five Cyrillic letters and "!".
- **UTF-8**: each Cyrillic letter (code points U+0400–U+04FF) takes **2 bytes**, "!" takes **1 byte**: 5 × 2 + 1 = **11 bytes**.
- **UTF-16**: every character here is in the BMP, so 6 × 2 = **12 bytes**.
- **UTF-32**: 6 × 4 = **24 bytes**.
- **ASCII**: **impossible** — ASCII has no code for С, ә, л, е or м. Extended ASCII could store Russian letters (С, л, е, м) in Windows-1251, but not the Kazakh letter "ә".

All three Unicode encodings store **exactly the same text**; only the size differs. This is why a question must say which encoding (or how many bits per character) to use.
:::

:::callout info Bytes per character in exam questions
Unless a question says otherwise, assume **ASCII = 1 byte (8 bits) per character** and **Unicode = 2 bytes (16 bits) per character** (UTF-16). Read the question carefully — it may give a different number of bits (for example "7-bit ASCII" or "32-bit Unicode").
:::

# Comparing ASCII and Unicode
@lo 11.1.1.7

A "compare" question asks for **similarities and differences**, and each difference must mention **both** character sets. The comparison between ASCII and Unicode comes down to one trade-off: Unicode can represent **far more characters** because it uses **more bits per character**, and the price is **more storage and bandwidth**. Everything else follows from this.

:::compare ASCII vs Unicode
| | ASCII | Unicode |
|---|---|---|
| Bits per character | **7** (stored in 8 bits / 1 byte); 8 in extended ASCII | **8–32** depending on encoding (UTF-8: 8–32, UTF-16: usually **16**, UTF-32: **32**) |
| Number of characters | **128** (256 extended) | Over **1.1 million** possible code points; about 150 000 assigned |
| Languages | **English only** (extended: one extra alphabet per code page) | **All** languages, plus symbols, mathematical notation and emoji |
| Storage per character | **Less** — 1 byte | **More** — 2–4 bytes (except English text in UTF-8, 1 byte) |
| File size / transfer time | **Smaller** files, **faster** to send | **Larger** files, more bandwidth (up to 4× for English in UTF-32) |
| Standardisation | One standard for English; extended code pages **clash** | **One** worldwide standard; a code means the same character everywhere |
| Compatibility | Older systems all support it | First 128 code points = ASCII, so it is **backward compatible**; very old software may not support it |
| Processing | Simple — every character is 1 byte | More **complex** in UTF-8/UTF-16 (variable length) |
| Typical use | Simple data files, programming source code, older systems and devices with little memory | Web pages, apps, operating systems, documents in Kazakh / Russian / Chinese, messages with emoji |
:::

## Similarities

ASCII and Unicode have more in common than students often realise. **Both** are character sets: **both** give every character a **unique binary code**, so that text can be stored, processed and exchanged. **Both** include the English letters, digits, punctuation and control characters — and with **the same codes**, because the first 128 Unicode code points are ASCII. **Both** keep letters in alphabetical order, so codes can be used for sorting. A good comparison mentions at least one similarity as well as the differences.

## Advantages and disadvantages of Unicode

:::cards
### Advantages of Unicode
- **Represents all languages**: one document, web page or database can contain Kazakh, Russian, English, Chinese and Arabic at the same time — impossible with any single extended ASCII code page.
- **Consistent worldwide**: a code point means the same character on every device in every country, so files do not turn into mojibake when sent abroad and no "guessing" of the code page is needed.
- **Room to grow**: over a million code points, so new characters — new emoji, the Kazakh Latin alphabet letters, currency symbols such as ₸ (U+20B8) — can be added without changing existing codes.
- Includes **symbols**: mathematical notation, arrows, box-drawing, music, and **emoji**.
- **Backward compatible** with ASCII: old English text files are already valid Unicode (and valid UTF-8).
### Disadvantages of Unicode
- Needs **more storage** per character: 2 bytes in UTF-16 or 4 in UTF-32 instead of 1, so files are **larger** and need more disk space and memory.
- Larger files need **more bandwidth** and take **longer to transmit**.
- **More complex to process**: in UTF-8 and UTF-16 characters have different lengths, so counting characters, finding the n-th character or cutting a string is harder and slower.
- Some **old software and devices** (old printers, embedded systems, legacy databases) do not support it fully and may show boxes or "?" for unknown characters.
- A font must contain the glyph for a character to display it; otherwise a blank box (often called "tofu") appears.
:::

## Which character set should be used?

In an exam scenario you must choose and **justify** a character set. Think about **which characters** the text needs and **how important** storage and speed are.

:::example Worked example: choosing a character set for a scenario
**Scenario A** — A school in Astana is building a website with pages in **Kazakh, Russian and English**, and students' names are stored in a database.
Unicode (UTF-8) should be used. ASCII has no codes for Cyrillic or Kazakh letters such as Ә, Қ or Ө, so names like "Әлихан" could not be stored. Unicode has a unique code for every character of every language, so all three languages display correctly on every visitor's device. UTF-8 keeps the English pages as small as ASCII would.

**Scenario B** — A small temperature sensor sends readings such as **"T=21.5C"** to a server over a slow radio link, thousands of times a day. Only digits, capital letters and a few symbols are ever needed.
ASCII is enough and is the better choice: every character it needs is in ASCII, each character takes only **1 byte**, so each message is smaller, uses less of the slow link and less battery power. (Because UTF-8 stores these characters in exactly the same single bytes, the data would also be valid UTF-8.)

**Scenario C** — A messaging app is used by teenagers who send emoji.
Unicode is the only option: emoji (for example 😀, U+1F600) exist only in Unicode. In UTF-8 or UTF-16 each emoji takes 4 bytes.
:::

:::warning Common mistakes when comparing ASCII and Unicode
- Writing one-sided points such as "Unicode has more characters". A comparison needs **both** sides: "ASCII has 128 characters **whereas** Unicode can represent over a million".
- Saying "ASCII uses 8 bits for 256 characters". Standard ASCII is **7 bits, 128 characters**; 8 bits / 256 characters is **extended** ASCII.
- Saying "Unicode always uses 16 bits". UTF-8 uses 8–32 bits and UTF-32 always uses 32 — "16 bits" is UTF-16 and the usual exam assumption.
- Saying Unicode "replaced" ASCII so ASCII codes are different. The first 128 Unicode codes **are** the ASCII codes.
- Confusing a **character set** (the list of characters and codes) with a **font** (how the characters look). Changing the font does not change the codes.
- Forgetting the cost: Unicode's main disadvantage is **more storage / bandwidth per character**, not "it is slower to type".
:::

# Exam practice: ASCII and Unicode
@lo 11.1.1.7

:::example Exam-style questions with model answers
**Q: Define the term character set. [2]**
A list of all the characters that a computer can recognise/represent (1), with a unique binary code assigned to each character (1).

**Q: Compare ASCII and Unicode. [4]**
ASCII uses 7 bits (stored in 1 byte) per character, whereas Unicode uses up to 32 bits / 16 bits in UTF-16 (1). ASCII can represent 128 characters, whereas Unicode can represent over a million / every character of every language (1). ASCII needs less storage per character, so files are smaller (1). Both give each character a unique code, and the first 128 Unicode codes are the same as ASCII (1).

**Q: The ASCII code for "D" is 68. State the ASCII codes for "G" and "g". [2]**
"G" = 68 + 3 = **71** (1). "g" = 71 + 32 = **103** (1).

**Q: Explain why extended ASCII caused problems when text was sent between countries. [2]**
Different countries used different code pages, so the same code (128–255) meant different characters (1); a file opened with a different code page displayed the wrong characters / was unreadable (1).

**Q: Explain why a Kazakh news website should use Unicode rather than ASCII. [3]**
ASCII only represents English letters / cannot represent Cyrillic and Kazakh letters such as Ә, Қ, Ө (1). Unicode has a unique code for every character of every language (1), so Kazakh, Russian and English text displays correctly on every reader's device (1).

**Q: Give one disadvantage of using UTF-32 rather than UTF-8 for an English text file. [1]**
UTF-32 uses 4 bytes for every character whereas UTF-8 uses 1 byte for English characters, so the file is four times larger / needs more storage and bandwidth (1).
:::

:::warning Common mistakes in exam answers
- Writing "ASCII is old, Unicode is new" — that is not a technical difference and earns no marks. Talk about **bits per character**, **number of characters**, **languages** and **storage**.
- In "explain why" questions, stopping after the fact ("ASCII has 128 characters"). Add the **consequence** for the scenario ("…so it cannot store the Kazakh letters in the students' names").
- Calculating "g" as 71 + 26. The difference between a capital and its lower-case letter is **32**, not 26.
:::

:::steps Check yourself
- Define character, character code and character set. Why must a character set be a standard?
- How many characters can be represented with 5, 7, 8 and 16 bits?
- Give the ASCII codes of "A", "a", "0" and the space. Work out the codes of "K", "k" and "5".
- What is extended ASCII, what is a code page, and why did code pages cause mojibake?
- What is a Unicode code point? Write the code point of "A" and explain why it equals the ASCII code.
- How many bytes does UTF-8 use for an English letter, a Cyrillic letter, a Chinese character and an emoji?
- Give two advantages and two disadvantages of Unicode compared with ASCII.
:::

# Calculating the number of bytes in a text fragment
@lo 11.1.1.8

Knowing how many bytes a piece of text needs is a practical skill. It decides how much storage a database of names needs, whether a message fits into one SMS, how much memory a program must reserve for a string, and how long a document takes to send over a network. Because each character is stored as a code of a **fixed number of bits** (in ASCII or in a fixed-length Unicode encoding), the calculation is a simple multiplication — the difficulty is in **counting the characters correctly** and **converting the units**.

:::definition Text file size
The amount of storage needed for a piece of text: **size = number of characters × bits (or bytes) per character**. Every character counts — **letters, digits, spaces, punctuation** and any **new-line** characters if the question mentions them. Metadata and formatting are ignored unless the question says otherwise.
:::

$$ \text{size (bits)} = \text{number of characters} \times \text{bits per character} $$ | Divide by 8 for bytes, then by 1024 for kilobytes

:::definition Bit, byte and kilobyte
A **bit** is a single binary digit, 0 or 1. A **byte** is a group of **8 bits** — enough to store one ASCII character. A **kilobyte (KB)** is **1024 bytes** (strictly a kibibyte, KiB; some questions use 1000 — follow the question). A **megabyte (MB)** is 1024 KB.
:::

## Step 1 — count every character

The most common mistake in these questions is a wrong count. A computer stores **every** character the person typed, including the invisible ones. Count:

- every **letter** (upper and lower case each count once — "A" and "a" are both one character);
- every **digit** — "2026" is **four** characters, not one number;
- every **space** — between words, and also double spaces if there are any;
- every **punctuation mark and symbol** — commas, full stops, apostrophes, hyphens, brackets, quotation marks that are part of the text, @, #, %, ₸;
- **new-line** characters, if the text is on several lines and the question says to include them (in Windows a new line is two characters, CR + LF; in Linux and macOS it is one, LF).

Do **not** count the quotation marks that the question puts around the text to show you where it starts and ends, unless they are clearly part of the text.

:::svg Counting the characters in "NIS Astana, 2026!"
<svg class="txr" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The text NIS Astana, 2026! split into 17 boxes, one per character: letters, two spaces, a comma, four digits and an exclamation mark; each box is one byte in ASCII and two bytes in 16-bit Unicode">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .m{font:700 16px ui-monospace,monospace;fill:var(--foreground)}
    svg.txr .n{font:12px ui-monospace,monospace;fill:var(--muted)}
    svg.txr .l{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.txr .sp{fill:var(--warning);fill-opacity:0.25;stroke:var(--warning);stroke-width:1.5}
    svg.txr .p{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.txr .d{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
  </style>
  <g>
    <rect class="l" x="20" y="40" width="40" height="44"/><text class="m" x="40" y="68" text-anchor="middle">N</text><text class="n" x="40" y="100" text-anchor="middle">1</text>
    <rect class="l" x="62" y="40" width="40" height="44"/><text class="m" x="82" y="68" text-anchor="middle">I</text><text class="n" x="82" y="100" text-anchor="middle">2</text>
    <rect class="l" x="104" y="40" width="40" height="44"/><text class="m" x="124" y="68" text-anchor="middle">S</text><text class="n" x="124" y="100" text-anchor="middle">3</text>
    <rect class="sp" x="146" y="40" width="40" height="44"/><text class="m" x="166" y="68" text-anchor="middle">␣</text><text class="n" x="166" y="100" text-anchor="middle">4</text>
    <rect class="l" x="188" y="40" width="40" height="44"/><text class="m" x="208" y="68" text-anchor="middle">A</text><text class="n" x="208" y="100" text-anchor="middle">5</text>
    <rect class="l" x="230" y="40" width="40" height="44"/><text class="m" x="250" y="68" text-anchor="middle">s</text><text class="n" x="250" y="100" text-anchor="middle">6</text>
    <rect class="l" x="272" y="40" width="40" height="44"/><text class="m" x="292" y="68" text-anchor="middle">t</text><text class="n" x="292" y="100" text-anchor="middle">7</text>
    <rect class="l" x="314" y="40" width="40" height="44"/><text class="m" x="334" y="68" text-anchor="middle">a</text><text class="n" x="334" y="100" text-anchor="middle">8</text>
    <rect class="l" x="356" y="40" width="40" height="44"/><text class="m" x="376" y="68" text-anchor="middle">n</text><text class="n" x="376" y="100" text-anchor="middle">9</text>
    <rect class="l" x="398" y="40" width="40" height="44"/><text class="m" x="418" y="68" text-anchor="middle">a</text><text class="n" x="418" y="100" text-anchor="middle">10</text>
    <rect class="p" x="440" y="40" width="40" height="44"/><text class="m" x="460" y="68" text-anchor="middle">,</text><text class="n" x="460" y="100" text-anchor="middle">11</text>
    <rect class="sp" x="482" y="40" width="40" height="44"/><text class="m" x="502" y="68" text-anchor="middle">␣</text><text class="n" x="502" y="100" text-anchor="middle">12</text>
    <rect class="d" x="524" y="40" width="40" height="44"/><text class="m" x="544" y="68" text-anchor="middle">2</text><text class="n" x="544" y="100" text-anchor="middle">13</text>
    <rect class="d" x="566" y="40" width="40" height="44"/><text class="m" x="586" y="68" text-anchor="middle">0</text><text class="n" x="586" y="100" text-anchor="middle">14</text>
    <rect class="d" x="608" y="40" width="40" height="44"/><text class="m" x="628" y="68" text-anchor="middle">2</text><text class="n" x="628" y="100" text-anchor="middle">15</text>
    <rect class="d" x="650" y="40" width="40" height="44"/><text class="m" x="670" y="68" text-anchor="middle">6</text><text class="n" x="670" y="100" text-anchor="middle">16</text>
    <rect class="p" x="692" y="40" width="40" height="44"/><text class="m" x="712" y="68" text-anchor="middle">!</text><text class="n" x="712" y="100" text-anchor="middle">17</text>
  </g>
  <text class="h" x="20" y="24">17 characters: 9 letters + 2 spaces + 4 digits + 2 punctuation marks</text>
  <text class="h" x="20" y="140">ASCII: 17 × 1 byte = 17 bytes (136 bits)</text>
  <text class="h" x="20" y="166">16-bit Unicode: 17 × 2 bytes = 34 bytes (272 bits)</text>
  <text class="s" x="20" y="190">Spaces (␣) and punctuation are characters too — leaving them out is the most common error.</text>
</svg>
:::

## Step 2 — multiply by the size of one character

Once you have the number of characters, multiply by the size of **one** character in the character set the question gives:

:::compare Size of one character
| Character set / encoding | Bits per character | Bytes per character |
|---|---|---|
| 7-bit ASCII (if the question insists on 7 bits) | 7 | 0.875 (normally rounded up to 1 byte when stored) |
| ASCII / extended ASCII (normal assumption) | 8 | **1** |
| 16-bit Unicode / UTF-16 (normal assumption for "Unicode") | 16 | **2** |
| UTF-32 / 32-bit Unicode | 32 | **4** |
| UTF-8 | 8, 16, 24 or 32 | 1, 2, 3 or 4 — depends on the character |
:::

Work in **bytes** when the characters are whole bytes — it keeps the numbers small. Work in **bits** when the question gives an unusual number of bits per character (for example 7 bits, or a 5-bit code for a sensor display), then divide by 8 at the end.

## Step 3 — convert to the unit the question asks for

- bits **÷ 8** → bytes;
- bytes **÷ 1024** → kilobytes (KB);
- KB **÷ 1024** → megabytes (MB);
- MB **÷ 1024** → gigabytes (GB).

Going the other way (to a smaller unit), **multiply**. Show the units at every step, and only round at the very end — an early rounding error can cost the final mark.

:::steps How to calculate the storage needed for a text fragment
- **Count every character** — letters, digits, spaces, punctuation (and new lines if told). Write the count down.
- Identify the **bits or bytes per character** from the question (ASCII 8 bits = 1 byte; Unicode 16 bits = 2 bytes unless stated otherwise).
- **Multiply**: number of characters × bytes (or bits) per character.
- **Convert** to the required unit: ÷ 8 for bytes, ÷ 1024 for KB, ÷ 1024 again for MB.
- Write the answer **with its unit**, and round only at the end if asked.
:::

:::example Worked example 1 — "Hello, World!"
Characters: H e l l o **,** **space** W o r l d **!** = **13 characters** (10 letters, a comma, a space and "!").
- ASCII: 13 × 1 byte = **13 bytes** (13 × 8 = **104 bits**).
- 16-bit Unicode: 13 × 2 bytes = **26 bytes** (208 bits).
- UTF-32: 13 × 4 bytes = **52 bytes**.
:::

:::example Worked example 2 — a student's name list
A teacher stores the full names of 25 students for a class register. Each name is stored in a field of **exactly 30 characters** (shorter names are padded with spaces). The register uses **16-bit Unicode** so that Kazakh names are stored correctly.
- One name: 30 characters × 2 bytes = **60 bytes**.
- 25 names: 25 × 60 = **1500 bytes**.
- In kilobytes: 1500 ÷ 1024 = **1.46 KB** (to 2 d.p.).

If the school stored the names in ASCII instead, it would need only 750 bytes — but names such as "Ақжол" or "Өмірзақ" could not be stored at all, so the saving is worthless.
:::

## Why the calculation matters: real limits

These calculations are not only exam exercises. A classic real example is the **SMS text message**. One SMS can carry **140 bytes** (1120 bits) of text. When a message uses only the basic Latin alphabet, the phone uses a **7-bit** code, so it can fit 1120 ÷ 7 = **160 characters**. As soon as a message contains a character outside that alphabet — a Cyrillic or Kazakh letter, or an emoji — the phone switches to a **16-bit** Unicode encoding, and the same 1120 bits now hold only 1120 ÷ 16 = **70 characters**. A message in Kazakh therefore needs more SMS parts than an English message of the same length. Databases, network packets and memory chips have similar limits: the number of characters that fits depends on the bits per character.

# Text in different encodings and languages
@lo 11.1.1.8 11.1.1.7

With ASCII, UTF-16 for ordinary text and UTF-32, every character has the **same** size, so the size is simply "characters × bytes per character". UTF-8 is different: the number of bytes depends on **which** characters the text contains. To calculate the size of a text in UTF-8 you must **group the characters by type** and add up the bytes of each group.

:::definition Fixed-length and variable-length encoding
In a **fixed-length** encoding every character takes the **same number of bytes** (ASCII 1, UTF-32 4), so size = characters × bytes per character. In a **variable-length** encoding (UTF-8, and UTF-16 for characters outside the BMP) different characters take **different numbers of bytes**, so the bytes must be added up character by character or group by group.
:::

:::compare UTF-8 bytes for each type of character
| Type of character | Code point range | Examples | UTF-8 bytes | UTF-16 bytes |
|---|---|---|---|---|
| ASCII: English letters, digits, space, punctuation | U+0000 – U+007F | A z 7 , ! space | **1** | 2 |
| Accented Latin, **Cyrillic** (incl. Kazakh), Greek, Arabic, Hebrew | U+0080 – U+07FF | é Ж ә Қ Ω | **2** | 2 |
| Rest of the BMP: Chinese, Japanese, Korean, Indian scripts, €, ₸ | U+0800 – U+FFFF | 中 あ € ₸ | **3** | 2 |
| Outside the BMP: **emoji**, rare and historic characters | U+10000 – U+10FFFF | 😀 👍 | **4** | 4 |
:::

:::example Worked example 3 — a mixed Kazakh and English text in UTF-8, UTF-16 and UTF-32
Calculate the storage for **"Сәлем, әлем!"** ("Hello, world!" in Kazakh).
1. **Count and group.** С ә л е м , ␣ ә л е м ! → **12 characters**: **9 Cyrillic letters**, and **3 ASCII characters** (comma, space, "!").
2. **UTF-8.** Cyrillic letters 9 × 2 = 18 bytes; ASCII characters 3 × 1 = 3 bytes. Total = 18 + 3 = **21 bytes**.
3. **UTF-16.** All characters are in the BMP, so 12 × 2 = **24 bytes**.
4. **UTF-32.** 12 × 4 = **48 bytes**.
5. **ASCII.** Not possible — the Cyrillic letters have no ASCII codes.

Compare with the English "Hello, world!" (13 characters): 13 bytes in UTF-8, 26 in UTF-16. For English, UTF-8 is half the size of UTF-16; for Kazakh, it is only a little smaller (21 vs 24 bytes).
:::

:::svg The same text needs different amounts of storage in each encoding
<svg class="txr" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar chart: English text Hello, world! with 13 characters needs 13 bytes in ASCII and UTF-8, 26 in UTF-16 and 52 in UTF-32; the Kazakh text with 12 characters cannot be stored in ASCII and needs 21 bytes in UTF-8, 24 in UTF-16 and 48 in UTF-32">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .v{font:700 12px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .e{fill:var(--primary)}
    svg.txr .k{fill:var(--success)}
    svg.txr .x{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5;stroke-dasharray:4 3}
    svg.txr .ax{stroke:var(--border);stroke-width:1.5}
  </style>
  <text class="h" x="20" y="22">Bytes needed (1 byte = 10 px)</text>
  <rect class="e" x="560" y="10" width="14" height="14"/><text class="t" x="580" y="22">"Hello, world!" (13)</text>
  <rect class="k" x="560" y="32" width="14" height="14"/><text class="t" x="580" y="44">"Сәлем, әлем!" (12)</text>
  <line class="ax" x1="110" y1="60" x2="110" y2="270"/>
  <text class="t" x="20" y="88">ASCII</text>
  <rect class="e" x="110" y="74" width="130" height="16"/><text class="v" x="246" y="87">13</text>
  <rect class="x" x="110" y="94" width="200" height="16"/><text class="v" x="316" y="107">not possible</text>
  <text class="t" x="20" y="138">UTF-8</text>
  <rect class="e" x="110" y="124" width="130" height="16"/><text class="v" x="246" y="137">13</text>
  <rect class="k" x="110" y="144" width="210" height="16"/><text class="v" x="326" y="157">21</text>
  <text class="t" x="20" y="188">UTF-16</text>
  <rect class="e" x="110" y="174" width="260" height="16"/><text class="v" x="376" y="187">26</text>
  <rect class="k" x="110" y="194" width="240" height="16"/><text class="v" x="356" y="207">24</text>
  <text class="t" x="20" y="238">UTF-32</text>
  <rect class="e" x="110" y="224" width="520" height="16"/><text class="v" x="636" y="237">52</text>
  <rect class="k" x="110" y="244" width="480" height="16"/><text class="v" x="596" y="257">48</text>
  <text class="s" x="20" y="284">UTF-8 is smallest for English; for Cyrillic text UTF-8 and UTF-16 are close; UTF-32 is always 4 bytes per character.</text>
</svg>
:::

## Emoji and characters outside the BMP

Emoji are a common trap. In UTF-16 most characters take 2 bytes, but an emoji such as 👍 (U+1F44D) is outside the Basic Multilingual Plane and needs **4 bytes** — two 16-bit units. In UTF-8 it also takes **4 bytes**. Some emoji are made of **several code points** joined together (a family emoji or a flag), so they can take 8, 16 or even more bytes, although they look like one picture. For the exam, treat one simple emoji as one character of 4 bytes in UTF-8, UTF-16 and UTF-32, unless the question says otherwise.

:::example Worked example 4 — a chat message with an emoji
The message **"OK 👍"** has 4 characters: "O", "K", a space and the emoji.
- **UTF-8**: 3 ASCII characters × 1 byte + 1 emoji × 4 bytes = 3 + 4 = **7 bytes**.
- **UTF-16**: 3 × 2 bytes + 1 emoji × 4 bytes = 6 + 4 = **10 bytes**.
- **UTF-32**: 4 × 4 = **16 bytes**.

If the question simply says "16-bit Unicode, 2 bytes per character" and does not mention the special size of emoji, follow the question: 4 × 2 = 8 bytes.
:::

## Choosing the encoding to save space

The calculations show a pattern that is useful in "explain" questions:

- For text that is mostly **English** (or programming code, HTML, numbers), **UTF-8** is the smallest Unicode encoding — the same size as ASCII and **half** of UTF-16.
- For text in **Cyrillic** (Kazakh, Russian), UTF-8 and UTF-16 are **almost the same** size: 2 bytes per letter in both, but spaces and punctuation are 1 byte in UTF-8.
- For text in **Chinese or Japanese**, **UTF-16** is **smaller**: 2 bytes per character instead of 3 in UTF-8.
- **UTF-32** is always the **largest** and is used only where simple fixed-length processing matters more than space.

:::warning Common mistakes in text-size calculations
- **Not counting spaces and punctuation.** "Hello, World!" is 13 characters, not 10.
- Counting a number such as "2026" as **one** character — it is **four** digit characters.
- Confusing **bits** and **bytes**: 13 characters in ASCII is 13 **bytes** or 104 **bits**. Multiply bytes by 8 to get bits; divide bits by 8 to get bytes.
- Dividing by 1000 instead of 1024 (or the other way round) — use 1024 unless the question says otherwise, and say which you used.
- Using 1 byte per character for Cyrillic text "because it is UTF-8" — Cyrillic letters take **2 bytes** in UTF-8.
- Forgetting that the answer needs a **unit** — "26" on its own scores nothing; "26 bytes" scores.
:::

# Larger texts, units and working backwards
@lo 11.1.1.8

Exam questions often move from one short phrase to a **whole document**, a **book**, a **database** or a **file transfer**. The method is the same — characters × size of one character — but you first have to **estimate the number of characters** from the information in the question, and the answers are large enough that **unit conversion** becomes important.

## Estimating the number of characters in a document

Questions usually give you the structure of a document rather than the exact count. Build the number of characters up from the parts:

- **pages × lines per page × characters per line**, or
- **words × average characters per word** (the average should include the space after each word — the question normally tells you).

:::example Worked example 5 — a whole report
A report has **2 500 words**, on average **6 characters per word** including the space after it. It is saved in **16-bit Unicode**.
1. Characters: 2 500 × 6 = **15 000 characters**.
2. Bytes: 15 000 × 2 = **30 000 bytes**.
3. Kilobytes: 30 000 ÷ 1024 = **29.30 KB** (to 2 d.p.).
In ASCII the same report would be 15 000 bytes = 14.65 KB — exactly half.
:::

:::example Worked example 6 — a textbook
A Kazakh-language textbook has **300 pages**. Each page has **40 lines** of **60 characters**. It is stored in **16-bit Unicode**.
1. Characters per page: 40 × 60 = **2 400**.
2. Characters in the book: 300 × 2 400 = **720 000 characters**.
3. Bytes: 720 000 × 2 = **1 440 000 bytes**.
4. KB: 1 440 000 ÷ 1024 = **1 406.25 KB**.
5. MB: 1 406.25 ÷ 1024 = **1.37 MB** (to 2 d.p.).
So the plain text of a whole textbook fits easily on any device — a single photo from a phone is usually larger. (A real e-book file is larger again because of images, fonts and formatting, which this calculation ignores.)
:::

:::svg Converting between units: multiply going down, divide going up
<svg class="txr" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Unit ladder from bits to bytes to kilobytes to megabytes to gigabytes: divide by 8 from bits to bytes, then divide by 1024 at each step up; multiply when going the other way. Example: 1 440 000 bytes is 1406.25 KB which is 1.37 MB">
  <style>
    svg.txr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .t{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.txr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.txr .m{font:600 12px ui-monospace,monospace;fill:var(--primary)}
    svg.txr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.txr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.txr .lg{stroke:var(--success);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="txrA3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
    <marker id="txrA4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
  </defs>
  <rect class="pb" x="20" y="70" width="110" height="50" rx="8"/><text class="t" x="75" y="100" text-anchor="middle">bits</text>
  <rect class="pb" x="175" y="70" width="110" height="50" rx="8"/><text class="t" x="230" y="100" text-anchor="middle">bytes</text>
  <rect class="pb" x="330" y="70" width="110" height="50" rx="8"/><text class="t" x="385" y="100" text-anchor="middle">KB</text>
  <rect class="pb" x="485" y="70" width="110" height="50" rx="8"/><text class="t" x="540" y="100" text-anchor="middle">MB</text>
  <rect class="pb" x="640" y="70" width="100" height="50" rx="8"/><text class="t" x="690" y="100" text-anchor="middle">GB</text>
  <path class="ln" d="M110,66 C130,34 170,34 190,66" marker-end="url(#txrA3)"/><text class="m" x="150" y="32" text-anchor="middle">÷ 8</text>
  <path class="ln" d="M265,66 C285,34 325,34 345,66" marker-end="url(#txrA3)"/><text class="m" x="305" y="32" text-anchor="middle">÷ 1024</text>
  <path class="ln" d="M420,66 C440,34 480,34 500,66" marker-end="url(#txrA3)"/><text class="m" x="460" y="32" text-anchor="middle">÷ 1024</text>
  <path class="ln" d="M575,66 C595,34 635,34 655,66" marker-end="url(#txrA3)"/><text class="m" x="615" y="32" text-anchor="middle">÷ 1024</text>
  <path class="lg" d="M190,124 C170,156 130,156 110,124" marker-end="url(#txrA4)"/><text class="m" x="150" y="166" text-anchor="middle">× 8</text>
  <path class="lg" d="M345,124 C325,156 285,156 265,124" marker-end="url(#txrA4)"/><text class="m" x="305" y="166" text-anchor="middle">× 1024</text>
  <path class="lg" d="M500,124 C480,156 440,156 420,124" marker-end="url(#txrA4)"/><text class="m" x="460" y="166" text-anchor="middle">× 1024</text>
  <path class="lg" d="M655,124 C635,156 595,156 575,124" marker-end="url(#txrA4)"/><text class="m" x="615" y="166" text-anchor="middle">× 1024</text>
  <text class="s" x="20" y="192">Example: 1 440 000 bytes ÷ 1024 = 1 406.25 KB ÷ 1024 = 1.37 MB. Going to a bigger unit → divide; to a smaller unit → multiply.</text>
</svg>
:::

## Working backwards

Some questions give the **size** and ask for the **number of characters**, or give the size and the number of characters and ask **which character set** was used. Rearrange the same formula:

- **number of characters = size ÷ size of one character** (convert the size into bytes or bits first);
- **bits per character = size in bits ÷ number of characters**.

:::example Worked example 7 — working backwards
**a)** A memory buffer of **4 KB** holds text in **16-bit Unicode**. How many characters fit?
4 KB = 4 × 1024 = **4 096 bytes**. Each character is 2 bytes, so 4 096 ÷ 2 = **2 048 characters**.

**b)** A file of **1 000** characters is **2 000 bytes**. Which kind of encoding was used?
2 000 × 8 = 16 000 bits ÷ 1 000 = **16 bits per character** → 16-bit Unicode (UTF-16).

**c)** A display board uses a **6-bit** code. A message is stored in **24 bytes**. How many characters does it contain?
24 bytes × 8 = **192 bits**. 192 ÷ 6 = **32 characters**.
:::

## Fixed-length fields and real storage

In a database or a program, text is often kept in **fields** of a fixed size. A field declared for 30 characters always uses the space of 30 characters, even when the name stored in it has only 5 letters — the rest is filled with spaces (padding). This is why Worked example 2 multiplied by the **field length**, not by the length of each name. Other fields are **variable-length**: they store only the characters actually typed, plus a small amount of extra data (for example a number saying how long the text is). When a question describes fixed-size fields, use the field size; when it gives the actual text, count the actual characters. Real files may also contain a few extra bytes that a simple calculation ignores — for example a **byte order mark** at the start of a UTF-16 file, or formatting information in a word-processor document. Exam calculations ignore these unless they are mentioned.

:::definition Bit rate
The **number of bits transmitted per second** over a communication link, measured in **bps** (bits per second), kbps, Mbps or Gbps. It is used to calculate the time needed to send a file: time = size in bits ÷ bit rate.
:::

## Time to transmit text

The size of a text also decides how long it takes to send. The transmission speed (**bit rate**) of a network is given in **bits per second**, so the size must be converted to **bits** first:

$$ \text{time (s)} = \frac{\text{size in bits}}{\text{bit rate (bits per second)}} $$ | Remember: the size must be in bits, not bytes

For example, the textbook above (1 440 000 bytes in 16-bit Unicode) is 1 440 000 × 8 = 11 520 000 bits. Over a slow 2 Mbps connection (2 000 000 bits per second) it takes 11 520 000 ÷ 2 000 000 = **5.76 seconds**; in ASCII it would take half the time. This is one concrete reason why the choice of character set matters for web pages and messages: **more bytes per character means more data to transmit**.

:::compare Forward and backward calculations
| You are given | You want | Method | Example |
|---|---|---|---|
| Characters and bytes per character | Size | characters × bytes per character | 50 chars × 2 = 100 bytes |
| Size and bytes per character | Number of characters | size in bytes ÷ bytes per character | 4 096 bytes ÷ 2 = 2 048 chars |
| Size and number of characters | Bits per character / encoding | size in bits ÷ characters | 16 000 bits ÷ 1 000 = 16 bits → Unicode |
| Number of characters in the set | Minimum bits per character | smallest n with 2ⁿ ≥ number of characters | 37 characters → 6 bits |
| Size and bit rate | Transmission time | size in **bits** ÷ bits per second | 11 520 000 ÷ 2 000 000 = 5.76 s |
:::

:::warning Common mistakes with large texts
- Forgetting to multiply **all** the parts: pages × lines × characters per line — leaving out one factor gives an answer many times too small.
- Dividing by 1024 **once** when the question asks for MB — bytes → KB → MB needs **two** divisions.
- In transmission-time questions, dividing **bytes** by a speed in **bits** per second — convert to bits first (× 8).
- Rounding in the middle of the calculation and getting a slightly wrong final answer — keep full values until the end.
:::

# Exam practice: storage for text
@lo 11.1.1.8 11.1.1.7

:::example Exam-style questions with model answers
**Q: Calculate the number of bytes needed to store "Computer Science" in 16-bit Unicode. Show your working. [2]**
16 characters including the space (1) × 2 bytes = **32 bytes** (1).

**Q: Calculate the number of bits needed to store "Year 11, 2026" in ASCII. [2]**
13 characters (Y e a r ␣ 1 1 , ␣ 2 0 2 6) (1) × 8 bits = **104 bits** (1).

**Q: A text file stored in ASCII is 6 KB. The same text is saved in 16-bit Unicode. State the new size and explain why it has changed. [2]**
**12 KB** (1); each character now takes 2 bytes / 16 bits instead of 1 byte / 8 bits, so the file is twice as large (1).

**Q: A book has 250 pages, each with 32 lines of 50 characters. Calculate the storage needed in 16-bit Unicode, in KB. [3]**
250 × 32 × 50 = 400 000 characters (1); × 2 = 800 000 bytes (1); ÷ 1024 = **781.25 KB** (1).

**Q: A 2 KB memory area stores text in 16-bit Unicode. Calculate how many characters it can hold. [2]**
2 × 1024 = 2 048 bytes (1); ÷ 2 = **1 024 characters** (1).

**Q: The Kazakh word "Қазақстан" is stored in UTF-8. Calculate the number of bytes, and explain why it is not 9 bytes. [3]**
9 characters × 2 bytes = **18 bytes** (1). Cyrillic letters are outside the ASCII range (1), so UTF-8 uses 2 bytes for each of them; only ASCII characters use 1 byte (1).
:::

:::warning Common mistakes in exam answers
- Giving only the final number. In calculation questions most marks are for **working**: write the character count, the multiplication and each conversion.
- Answering in bits when the question asks for bytes (or the other way round). Underline the unit in the question before you start.
- Counting characters in a hurry. Write the text out and number each character, as in the diagram above.
:::

:::steps Check yourself
- Write the formula for the size of a text and state what counts as a character.
- How many bytes does "I love CS!" need in ASCII and in 16-bit Unicode?
- How many bytes does "Алматы 2026" need in UTF-8, in UTF-16 and in UTF-32?
- Convert 1 500 000 bytes into KB and MB.
- A 1 KB buffer holds ASCII text. How many characters fit? How many if the text is 16-bit Unicode?
- Why can a Kazakh SMS hold fewer characters than an English one?
- How long does a 1 MB text file take to send at 1 Mbps (1 000 000 bits per second)?
:::
