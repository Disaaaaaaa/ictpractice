---
summary: Converting binary to hexadecimal and back, and the reasons hexadecimal is used in computer systems.
---
# Converting binary to hexadecimal
@lo 12.1.1.1

One hexadecimal digit represents exactly **4 bits** (a nibble), because 16 = 2⁴.

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
- Pad the leftmost group with leading zeros if needed.
- Replace each group with its hex digit.
:::

:::example
- 1011 0111₂ → **B7₁₆**
- 11 1110 1001₂ → 0011 1110 1001 → **3E9₁₆**
- Hex → binary: **2F₁₆** → 0010 1111₂
:::

:::example Checking via denary
B7₁₆ = 11 × 16 + 7 = **183₁₀**, and 10110111₂ = 128 + 32 + 16 + 4 + 2 + 1 = **183₁₀** ✓
:::

:::widget base_converter Convert between bases
:::

# Why hexadecimal is used
@lo 12.1.1.2

:::compare Uses of hexadecimal
| Use | Example |
|---|---|
| Memory addresses | `0x7FFE4A10` in debuggers and error messages |
| Colour codes (24-bit RGB) | `#1F4FD8` = red 1F, green 4F, blue D8 |
| MAC addresses | `3C:52:82:1A:9F:04` |
| Machine code and memory dumps | `B8 04 00 CD 21` |
| Error and status codes | Windows "0x80070005" |
| IPv6 addresses | `2001:0db8::1` |
| Character codes | Unicode `U+04D8` (Ә) |
:::

- **Shorter** than binary — a byte is 2 hex digits instead of 8 bits.
- **Easier to read, remember and write** → fewer mistakes.
- **Easy to convert** to and from binary (unlike denary).
- Makes debugging and low-level programming quicker.

:::warning
Hexadecimal does **not** save memory or make the computer faster — data is always stored in binary. Hex only helps **people** work with binary values.
:::
