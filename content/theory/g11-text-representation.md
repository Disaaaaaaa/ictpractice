---
summary: How characters are stored using character sets, the differences between ASCII and Unicode, and calculating the storage needed for text.
---
# ASCII and Unicode
@lo 11.1.1.7

:::definition Character set
A defined list of characters that a computer recognises, each with a **unique binary code**. The keyboard sends the code; the computer stores and displays it.
:::

:::compare ASCII vs Unicode
| | ASCII | Unicode |
|---|---|---|
| Bits per character | 7 bits (128 characters); extended ASCII uses 8 bits (256) | 8, 16 or 32 bits per character (UTF-8 / UTF-16 / UTF-32) |
| Number of characters | 128 / 256 | Over 1 million possible code points (≈150 000 assigned) |
| Languages | English letters, digits, punctuation, control characters | Almost all world languages (Kazakh, Russian, Chinese, Arabic …) plus symbols and **emoji** |
| Storage | Small files | Larger files (more bits per character) |
| Compatibility | Older systems | The first 128 Unicode codes are the same as ASCII |
:::

:::compare Some ASCII codes
| Character | Denary | Binary |
|---|---|---|
| `A` | 65 | 1000001 |
| `B` | 66 | 1000010 |
| `a` | 97 | 1100001 |
| `0` | 48 | 0110000 |
| space | 32 | 0100000 |
:::

:::tip
Codes are **in order**: if `A` = 65 then `E` = 69, and lower-case letters are 32 more than upper-case (`a` = 97). This is often used in "find the code of…" questions.
:::

:::callout info Why Unicode was needed
ASCII has only 128 (or 256) codes — not enough for alphabets such as Kazakh Cyrillic (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І) or Chinese. Unicode gives every character in every language a unique code, so text displays correctly on any device.
:::

# Calculating the storage needed for text
@lo 11.1.1.8

$$\text{Size (bits)} = \text{number of characters} \times \text{bits per character}$$ | Spaces and punctuation are characters too

:::example "Hello, World!" in 8-bit ASCII
- Characters: H e l l o , space W o r l d ! → **13** characters
- 13 × 8 = 104 bits = **13 bytes**
:::

:::example The same text in UTF-16
13 × 16 = 208 bits = **26 bytes**
:::

:::example A whole document
A 5-page essay, 400 words per page, 6 characters per word on average (including the space), 16-bit Unicode:
- 5 × 400 × 6 = 12 000 characters
- 12 000 × 16 = 192 000 bits = 24 000 bytes ≈ **23.4 KiB**
:::

:::warning
Count **every** character, including spaces, commas and full stops. A common mistake is to forget the spaces between words.
:::
