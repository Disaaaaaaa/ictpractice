---
summary: How bitmap images are stored as pixels, what resolution and colour depth mean and how they affect quality and file size, how to calculate the size of a bitmap image file in bits, bytes, kilobytes and megabytes, and how vector images differ.
---
# Bitmap images and pixels
@lo 11.1.1.5

:::definition Bitmap (raster) image
An image made of a **grid of tiny squares called pixels** (picture elements). Each pixel has **one colour**, stored as a **binary number**. Photos from cameras and scanned images are bitmaps (BMP, PNG, JPEG, GIF).
:::

:::ascii A 6 × 5 black-and-white bitmap (1 bit per pixel: 1 = black, 0 = white)
  0 1 1 1 1 0        . # # # # .
  1 0 0 0 0 1        # . . . . #
  1 0 1 1 0 1   →    # . # # . #
  1 0 0 0 0 1        # . . . . #
  0 1 1 1 1 0        . # # # # .
:::

The computer stores the image as a sequence of binary codes, one for each pixel, plus **metadata** (width, height, colour depth, file type) so that it can be displayed correctly.

# Resolution
@lo 11.1.1.5

:::definition Image resolution
The **number of pixels** in an image, usually given as **width × height** (e.g. **1920 × 1080**). It can also be given as the total number of pixels (2 073 600 ≈ 2 megapixels).
:::

:::cards
### Higher resolution
- **More pixels** → more **detail**; the image stays sharp when enlarged or printed.
- **Larger file size** — more pixels must be stored.
### Lower resolution
- **Fewer pixels** → less detail; enlarging makes the image **pixelated** (blocky).
- **Smaller file** — faster to load and send.
### Screen and print resolution
- **PPI / DPI** (pixels or dots **per inch**) shows how densely pixels are displayed or printed. A 300 PPI print looks sharper than a 72 PPI one.
:::

# Colour depth
@lo 11.1.1.5

:::definition Colour depth (bit depth)
The **number of bits used to store the colour of each pixel**. With a colour depth of *n* bits, **2ⁿ different colours** can be represented.
:::

:::compare Colour depth and number of colours
| Colour depth | Number of colours | Typical use |
|---|---|---|
| 1 bit | 2¹ = **2** | Black and white |
| 4 bits | 2⁴ = **16** | Simple icons |
| 8 bits | 2⁸ = **256** | GIF images, simple graphics |
| 16 bits | 2¹⁶ = **65 536** | "High colour" |
| 24 bits | 2²⁴ = **16 777 216** | "True colour" photos — 8 bits each for **red, green, blue** |
| 32 bits | 2²⁴ colours + 8 bits **transparency** (alpha) | PNG images with transparency |
:::

:::tip Bits needed for a number of colours
Find the smallest *n* with 2ⁿ ≥ the number of colours: **5 colours** need 3 bits (2³ = 8); **100 colours** need 7 bits (2⁷ = 128); **256 colours** need exactly 8 bits.
:::

:::compare Effect of colour depth and resolution
| Change | Image quality | File size |
|---|---|---|
| Increase **resolution** | More detail, sharper | **Increases** (in proportion to the number of pixels) |
| Increase **colour depth** | More colours, smoother shading, more realistic | **Increases** (in proportion to the bits per pixel) |
| **Double** the width **and** the height | — | **4 ×** larger (4 × as many pixels) |
| Change colour depth from 8 to 24 bits | — | **3 ×** larger |
:::

# Calculating the size of a bitmap file
@lo 11.1.1.6

:::definition File size of a bitmap image
**File size (bits) = width (pixels) × height (pixels) × colour depth (bits per pixel)**

Then convert: **÷ 8 → bytes**, **÷ 1024 → kilobytes (KB)**, **÷ 1024 → megabytes (MB)**. (Metadata and compression are ignored in these calculations.)
:::

:::compare Units of storage
| Unit | Size |
|---|---|
| 1 byte | 8 bits |
| 1 kilobyte (KB / KiB) | 1024 bytes |
| 1 megabyte (MB / MiB) | 1024 KB = 1 048 576 bytes |
| 1 gigabyte (GB / GiB) | 1024 MB |
:::

:::callout info 1000 or 1024?
In computer science, 1 KB is usually taken as **1024 bytes**. Some questions and manufacturers use **1000** (kB, MB in the SI system). Use the value the question gives; if it does not say, use **1024** and show your working so either method can be credited.
:::

:::example Worked example 1 — 1024 × 768 pixels, 24-bit colour
1. Pixels: 1024 × 768 = **786 432**
2. Bits: 786 432 × 24 = **18 874 368 bits**
3. Bytes: 18 874 368 ÷ 8 = **2 359 296 bytes**
4. KB: 2 359 296 ÷ 1024 = **2304 KB**
5. MB: 2304 ÷ 1024 = **2.25 MB**
:::

:::example Worked example 2 — 800 × 600 pixels, 256 colours
256 colours → colour depth **8 bits** (2⁸ = 256).
800 × 600 × 8 = 3 840 000 bits → ÷ 8 = **480 000 bytes** → ÷ 1024 = **468.75 KB**.
:::

:::example Worked example 3 — working backwards
A 640 × 480 image has a file size of **600 KB**. What is its colour depth?
600 KB × 1024 × 8 = 4 915 200 bits. 4 915 200 ÷ (640 × 480) = 4 915 200 ÷ 307 200 = **16 bits per pixel**.
:::

:::example Worked example 4 — how many photos fit?
A camera takes 4000 × 3000 photos in 24-bit colour: 4000 × 3000 × 24 ÷ 8 = 36 000 000 bytes ≈ **34.3 MB** each. A 16 GB memory card (16 × 1024 MB = 16 384 MB) holds about 16 384 ÷ 34.3 ≈ **477 photos** (without compression).
:::

# Reducing file size
@lo 11.1.1.5 11.1.1.6

:::compare Ways to reduce the size of an image file
| Method | Effect |
|---|---|
| **Reduce the resolution** (fewer pixels) | Smaller file, less detail |
| **Reduce the colour depth** | Smaller file, fewer colours (may look banded) |
| **Lossless compression** (PNG, GIF) | Smaller file, **no** quality lost — original can be restored exactly |
| **Lossy compression** (JPEG) | Much smaller file; some detail **permanently removed** |
| **Crop** the image | Removes unwanted pixels |
:::

:::compare Bitmap vs vector images
| | Bitmap | Vector |
|---|---|---|
| Stored as | A grid of **pixels** | **Shapes** (lines, curves, circles) described by mathematical properties |
| Enlarging | Becomes **pixelated** | Stays **sharp** at any size |
| File size | Depends on resolution and colour depth | Depends on the number of shapes; usually small |
| Best for | **Photographs**, realistic images | **Logos, icons, diagrams**, fonts |
| Formats | BMP, PNG, JPEG, GIF | SVG, AI, EPS |
:::

# Exam practice and summary
@lo 11.1.1.5 11.1.1.6

:::example Exam-style answers
**Q: Explain how a bitmap image is represented in terms of pixels, resolution and colour depth. [3]**
The image is made of a grid of **pixels**, each storing **one colour as a binary code** (1); the **resolution** is the number of pixels (width × height) — more pixels give more detail (1); the **colour depth** is the number of bits per pixel, which sets the **number of colours** (2ⁿ) (1).

**Q: Calculate the file size in KB of a 1280 × 720 image with 24-bit colour. Show your working. [3]**
1280 × 720 × 24 = 22 118 400 bits (1); ÷ 8 = 2 764 800 bytes (1); ÷ 1024 = **2700 KB** (1).

**Q: Explain the effect on the file size of changing the colour depth from 8 to 16 bits. [2]**
Each pixel needs **twice as many bits** (1), so the file size **doubles** (1).
:::

:::warning Common mistakes
- Forgetting to **divide by 8** to change bits into bytes.
- Using the number of **colours** (256) instead of the **colour depth** (8 bits) in the formula.
- Mixing 1000 and 1024 in one calculation.
- Saying higher resolution means "bigger pixels" — it means **more** pixels.
:::

:::steps Check yourself
- Define pixel, resolution and colour depth.
- How many colours can be shown with 4, 8 and 24 bits?
- How many bits are needed for 30 colours?
- Calculate the size in MB of a 1920 × 1080 image with 24-bit colour.
- What happens to the file size if the width and height are both halved?
- Compare bitmap and vector images.
:::
