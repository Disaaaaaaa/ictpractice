---
summary: How text is stored as binary character codes, character sets ASCII, extended ASCII and Unicode (UTF-8, UTF-16, UTF-32), how they compare, and how to calculate the number of bytes needed to store a text fragment.
---
# Characters and character sets
@lo 11.1.1.7

A computer stores **every character** — letters, digits, punctuation, spaces and symbols — as a **binary number** called its **character code**. When you press **A** on the keyboard, the computer stores the code for "A"; when it displays text, it looks up each code and draws the matching symbol.

:::definition Character set
A **defined list of characters** that a computer can recognise, together with the **unique binary code** assigned to each one. Examples: **ASCII**, **extended ASCII**, **Unicode**.
:::

:::cards
### Why a standard character set is needed
- Different computers, programs and countries must use the **same codes**, so a text file written on one computer shows the **same characters** on another.
- Without a common standard, an e-mail or web page could appear as **meaningless symbols** ("mojibake").
### What is in a character set
- **Printable characters** — letters, digits, punctuation, space.
- **Control characters** — not printed; e.g. new line (LF, code 10), carriage return (13), tab (9), backspace.
:::

# ASCII
@lo 11.1.1.7

:::definition ASCII (American Standard Code for Information Interchange)
A character set that uses **7 bits** per character, giving **2⁷ = 128 characters**: the English upper- and lower-case letters, digits 0–9, punctuation, space and control codes. In practice each ASCII character is stored in **one byte** (8 bits).
:::

:::compare Some ASCII codes
| Character | Denary | 7-bit binary | Hexadecimal |
|---|---|---|---|
| Space | 32 | 0100000 | 20 |
| 0 | 48 | 0110000 | 30 |
| 9 | 57 | 0111001 | 39 |
| A | 65 | 1000001 | 41 |
| C | 67 | 1000011 | 43 |
| Z | 90 | 1011010 | 5A |
| a | 97 | 1100001 | 61 |
| z | 122 | 1111010 | 7A |
:::

:::tip Patterns in ASCII
- Letters are in **alphabetical order**, so codes can be used to **sort** text: "A" (65) < "B" (66).
- A lower-case letter is **32 more** than its capital: "a" = 65 + 32 = 97.
- The **digit characters** "0"–"9" have codes 48–57, so the character "7" is **not** the number 7.
:::

:::definition Extended ASCII
Uses **8 bits** per character, giving **256 characters**: the 128 ASCII characters plus 128 more for accented letters, symbols or another alphabet (e.g. Cyrillic in code page Windows-1251). Different countries use **different extensions**, so the same code can mean different characters.
:::

# Unicode
@lo 11.1.1.7

:::definition Unicode
A universal character set that aims to give **every character of every writing system** — Latin, Cyrillic (including Kazakh letters such as **Ә, Қ, Ң, Ө, Ұ, Ү, Һ, І**), Arabic, Chinese, mathematical symbols and **emoji** — its **own unique code point**. It has room for over **1.1 million** characters; about 150 000 are assigned.
:::

:::cards
### Code points
Each character has a code point written **U+** followed by hexadecimal: **U+0041** = "A", **U+04D8** = "Ә", **U+20AC** = "€", **U+1F600** = 😀. The first 128 Unicode code points are the **same as ASCII**, so ASCII text is also valid Unicode.
### Encodings — how code points are stored
- **UTF-8** — **1 to 4 bytes** per character; English letters use 1 byte (same as ASCII), Cyrillic 2 bytes, Chinese 3, emoji 4. The most common encoding on the web.
- **UTF-16** — **2 bytes** for most characters (4 for rare ones and emoji).
- **UTF-32** — always **4 bytes** per character.
:::

:::callout info Bytes per character in exam questions
Unless a question says otherwise, assume **ASCII = 1 byte (8 bits) per character** and **Unicode = 2 bytes (16 bits) per character** (UTF-16). Read the question carefully — it may give a different number of bits.
:::

# Comparing ASCII and Unicode
@lo 11.1.1.7

:::compare ASCII vs Unicode
| | ASCII | Unicode |
|---|---|---|
| Bits per character | **7** (stored in 8 bits / 1 byte); 8 in extended ASCII | **8–32** depending on encoding (UTF-16: usually **16**) |
| Number of characters | **128** (256 extended) | Over **1.1 million** possible code points |
| Languages | **English only** (extended: one extra alphabet) | **All** languages, symbols and emoji |
| Storage | **Less** memory per character | **More** memory per character (except English text in UTF-8) |
| Compatibility | Universal for English; different extended code pages clash | **One** worldwide standard; first 128 codes = ASCII |
| Example use | Old systems, simple data files, programming source code | Web pages, mobile apps, operating systems, documents in Kazakh / Russian / Chinese |
:::

:::cards
### Advantages of Unicode
- Represents **all languages**, so one document can contain Kazakh, Russian, English and Chinese.
- **Consistent worldwide** — the same code means the same character everywhere.
- Includes symbols, mathematical notation and **emoji**.
- **Backward compatible** with ASCII.
### Disadvantages of Unicode
- Needs **more storage** and **bandwidth** per character (2–4 bytes instead of 1 in UTF-16/32).
- More **complex** to process (variable-length encodings).
- Older software may not support it fully.
:::

# Calculating the storage needed for text
@lo 11.1.1.8

:::definition Text file size
**Size = number of characters × bits (or bytes) per character**. Every character counts — **letters, digits, spaces and punctuation** (and new-line characters if mentioned).
:::

:::steps How to calculate
- **Count every character**, including **spaces** and **punctuation**.
- Multiply by the number of **bits per character** (ASCII 8, Unicode 16) — or by **bytes** (1 or 2).
- Convert to the required unit: **÷ 8** for bytes, **÷ 1024** for KB.
:::

:::example Worked example 1 — "Hello, World!"
Characters: H e l l o **,** **space** W o r l d **!** = **13 characters**.
- ASCII: 13 × 1 byte = **13 bytes** (104 bits).
- Unicode (16-bit): 13 × 2 bytes = **26 bytes** (208 bits).
:::

:::example Worked example 2 — "NIS Astana 2026"
N I S _ A s t a n a _ 2 0 2 6 → **15 characters** (2 spaces, 4 digits).
- ASCII: **15 bytes**. Unicode (16-bit): **30 bytes**.
:::

:::example Worked example 3 — a whole document
A report has **2 500 words**, on average **6 characters per word** including the space after it. In 16-bit Unicode: 2 500 × 6 = 15 000 characters × 2 bytes = **30 000 bytes** → ÷ 1024 = **29.3 KB**.
:::

:::example Worked example 4 — Kazakh text in UTF-8
"Сәлем, әлем!" has **12 characters**. In UTF-8 each Cyrillic letter takes **2 bytes** and the comma, space and "!" take **1 byte**: 9 letters × 2 + 3 × 1 = **21 bytes**. In UTF-16 it is 12 × 2 = **24 bytes**.
:::

:::compare Storage for the same 1000-character English text
| Encoding | Bytes |
|---|---|
| ASCII | 1000 |
| UTF-8 | 1000 |
| UTF-16 | 2000 |
| UTF-32 | 4000 |
:::

# Exam practice and summary
@lo 11.1.1.7 11.1.1.8

:::example Exam-style answers
**Q: Compare ASCII and Unicode. [2]**
ASCII uses **7/8 bits** per character and represents **128/256 characters**, mainly **English**, **whereas** Unicode uses **up to 32 bits** (16 in UTF-16) and can represent **characters of all languages** (1). ASCII needs **less storage** per character than Unicode (1).

**Q: Calculate the number of bytes needed to store "Computer Science" in 16-bit Unicode. [2]**
16 characters including the space (1) × 2 bytes = **32 bytes** (1).

**Q: Explain why Unicode is used for a website in Kazakh, Russian and English. [2]**
ASCII cannot represent **Cyrillic / Kazakh letters** (1); Unicode has a **unique code for every character of every language**, so all three languages display correctly (1).
:::

:::warning Common mistakes
- **Not counting spaces and punctuation**.
- Confusing **bits** and **bytes** — multiply by 8 to go from bytes to bits.
- Saying ASCII uses 8 bits for 256 characters — standard ASCII is **7 bits, 128 characters**; 8 bits is **extended** ASCII.
- Thinking the character "5" is stored as the binary number 5 — it is stored as its **code 53**.
:::

:::steps Check yourself
- What is a character set and why is a standard needed?
- How many bits and characters does ASCII use? Extended ASCII?
- Give the ASCII code of "A", "a" and "0".
- Name three Unicode encodings and how many bytes each uses for an English letter.
- Give two advantages and two disadvantages of Unicode.
- How many bytes does "I love CS" need in ASCII and in 16-bit Unicode?
:::
