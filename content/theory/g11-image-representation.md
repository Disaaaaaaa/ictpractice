---
summary: How bitmap images are stored as pixels, the meaning of resolution and colour depth, and how to calculate the file size of an image.
---
# Bitmap images: pixels, resolution and colour depth
@lo 11.1.1.5

:::definition Pixel
The **smallest element** of a bitmap image — one dot of a single colour. ("Picture element".)
:::

:::definition Bitmap image
An image stored as a **grid of pixels**; the colour of each pixel is stored as a **binary code**.
:::

:::cards
### Image resolution
The number of pixels in the image: **width × height** (e.g. 1920 × 1080). More pixels → more detail, larger file.
### Colour depth (bit depth)
The **number of bits used to store the colour of each pixel**. With *n* bits there are **2ⁿ** possible colours.
### Screen/print resolution
Pixels per inch (ppi) or dots per inch (dpi) — how densely pixels are displayed or printed.
:::

:::compare Colour depth and number of colours
| Colour depth | Colours | Typical use |
|---|---|---|
| 1 bit | 2 (black/white) | Simple icons, fax |
| 4 bits | 16 | Old graphics |
| 8 bits | 256 | GIF images |
| 16 bits | 65 536 | "High colour" |
| 24 bits | 16 777 216 | "True colour" (8 bits each for red, green, blue) |
:::

:::example A 1-bit image
A 4 × 3 image with 1 bit per pixel (1 = black, 0 = white):
```text
1 0 0 1
0 1 1 0
1 0 0 1
```
The image is stored as 12 bits: 100101101001.
:::

:::compare Effect of increasing resolution or colour depth
| Increase | Effect on quality | Effect on file size |
|---|---|---|
| Resolution | More detail, sharper edges, can be enlarged before pixels show | Larger (more pixels) |
| Colour depth | More colours, smoother gradients, more realistic | Larger (more bits per pixel) |
:::

:::callout info Metadata
An image file also stores **metadata** — data about the image: width, height, colour depth, file type, date taken, camera settings. It lets the computer display the image correctly.
:::

# Calculating the size of a bitmap file
@lo 11.1.1.6

$$\text{File size (bits)} = \text{width} \times \text{height} \times \text{colour depth}$$ | Divide by 8 for bytes, then by 1024 for KiB, again for MiB

:::example 800 × 600 pixels, 24-bit colour
- Bits: 800 × 600 × 24 = 11 520 000 bits
- Bytes: 11 520 000 ÷ 8 = 1 440 000 bytes
- KiB: 1 440 000 ÷ 1024 = 1406.25 KiB
- MiB: 1406.25 ÷ 1024 ≈ **1.37 MiB**
:::

:::example Finding the colour depth
An image 100 × 50 pixels is 2500 bytes. How many colours can it use?
- 2500 bytes × 8 = 20 000 bits
- 20 000 ÷ (100 × 50) = **4 bits per pixel** → 2⁴ = **16 colours**
:::

:::compare Units of storage
| Unit | Size |
|---|---|
| 1 byte | 8 bits |
| 1 kibibyte (KiB) | 1024 bytes (1 KB = 1000 bytes) |
| 1 mebibyte (MiB) | 1024 KiB |
| 1 gibibyte (GiB) | 1024 MiB |
:::

:::tip
Always show the formula, the substituted numbers and the **unit** at every step. Check whether the question uses 1000 or 1024 — if not stated, either is accepted when your working is clear.
:::
