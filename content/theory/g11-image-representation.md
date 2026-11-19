---
summary: How bitmap images are stored as a grid of pixels, what resolution and colour depth mean and how they affect quality and file size, how to calculate the size of a bitmap image file in bits, bytes, kilobytes and megabytes (and work backwards), how compression and other methods reduce file size, and how vector images differ from bitmaps.
---
# Bitmap images and pixels
@lo 11.1.1.5

A computer can only store and process **binary** — patterns of 0s and 1s. Text is stored as character codes, numbers as binary values, and an image must also be turned into numbers before a computer can keep it in memory, save it to a disk or send it across the Internet. There are two main ways of doing this. A **bitmap** image (also called a **raster** image) records the colour of every tiny point of the picture. A **vector** image records a list of shapes and their properties. This lesson is about bitmaps, which is how every photograph from a phone camera, every scanned document and every screenshot is stored; vectors are compared with bitmaps in lesson 2.

:::definition Bitmap (raster) image
An image made of a **grid of tiny squares called pixels**, arranged in rows and columns. Each pixel has **one colour**, and that colour is stored as a **binary number**. Photos, scans and screenshots are bitmaps (file types BMP, PNG, JPEG, GIF).
:::

:::definition Pixel
Short for **picture element**: the **smallest single-coloured element** of a bitmap image (or of a screen). A pixel cannot show detail inside itself — the whole square is one colour.
:::

## How a bitmap is stored

Imagine laying a sheet of squared paper over a picture and colouring each square with the single colour that is closest to what lies underneath. That is exactly what a camera sensor or a scanner does. The result is a grid of coloured squares. To store it, the computer gives every possible colour a **binary code**, then writes down the code of each pixel one after another — normally starting at the **top-left** pixel, going **left to right** along the first row, then along the second row, and so on to the bottom-right pixel.

In the simplest case an image has only two colours, black and white. Two colours need only **one bit** per pixel: the code **1** can mean black and **0** can mean white. The 8 × 8 smiley below therefore needs 64 pixels × 1 bit = **64 bits** (8 bytes) of pixel data. Each row is one byte, which makes it easy to read the picture straight from the binary.

:::svg A bitmap is a grid of pixels; each pixel's colour is stored as a binary code
<svg class="imr" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An 8 by 8 black-and-white bitmap of a smiley face; each row of pixels is stored as an 8-bit binary code, 1 for black and 0 for white">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.imr .on{fill:var(--foreground);stroke:var(--border);stroke-width:1}
    svg.imr .off{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.imr .px{fill:var(--primary);stroke:var(--border);stroke-width:0.5}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.imr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.imr .ci{fill:none;stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
  </style>
  <defs><marker id="imrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="40" y="24">The image (8 × 8 pixels)</text><text class="h" x="330" y="24">What is stored (1 bit per pixel)</text>
  <rect class="off" x="40" y="40" width="30" height="30"/>
  <rect class="off" x="70" y="40" width="30" height="30"/>
  <rect class="on" x="100" y="40" width="30" height="30"/>
  <rect class="on" x="130" y="40" width="30" height="30"/>
  <rect class="on" x="160" y="40" width="30" height="30"/>
  <rect class="on" x="190" y="40" width="30" height="30"/>
  <rect class="off" x="220" y="40" width="30" height="30"/>
  <rect class="off" x="250" y="40" width="30" height="30"/>
  <text class="s" x="330" y="60">row 1</text><text class="m" x="385" y="60">0 0 1 1 1 1 0 0</text>
  <rect class="off" x="40" y="70" width="30" height="30"/>
  <rect class="on" x="70" y="70" width="30" height="30"/>
  <rect class="off" x="100" y="70" width="30" height="30"/>
  <rect class="off" x="130" y="70" width="30" height="30"/>
  <rect class="off" x="160" y="70" width="30" height="30"/>
  <rect class="off" x="190" y="70" width="30" height="30"/>
  <rect class="on" x="220" y="70" width="30" height="30"/>
  <rect class="off" x="250" y="70" width="30" height="30"/>
  <text class="s" x="330" y="90">row 2</text><text class="m" x="385" y="90">0 1 0 0 0 0 1 0</text>
  <rect class="on" x="40" y="100" width="30" height="30"/>
  <rect class="off" x="70" y="100" width="30" height="30"/>
  <rect class="on" x="100" y="100" width="30" height="30"/>
  <rect class="off" x="130" y="100" width="30" height="30"/>
  <rect class="off" x="160" y="100" width="30" height="30"/>
  <rect class="on" x="190" y="100" width="30" height="30"/>
  <rect class="off" x="220" y="100" width="30" height="30"/>
  <rect class="on" x="250" y="100" width="30" height="30"/>
  <text class="s" x="330" y="120">row 3</text><text class="m" x="385" y="120">1 0 1 0 0 1 0 1</text>
  <rect class="on" x="40" y="130" width="30" height="30"/>
  <rect class="off" x="70" y="130" width="30" height="30"/>
  <rect class="off" x="100" y="130" width="30" height="30"/>
  <rect class="off" x="130" y="130" width="30" height="30"/>
  <rect class="off" x="160" y="130" width="30" height="30"/>
  <rect class="off" x="190" y="130" width="30" height="30"/>
  <rect class="off" x="220" y="130" width="30" height="30"/>
  <rect class="on" x="250" y="130" width="30" height="30"/>
  <text class="s" x="330" y="150">row 4</text><text class="m" x="385" y="150">1 0 0 0 0 0 0 1</text>
  <rect class="on" x="40" y="160" width="30" height="30"/>
  <rect class="off" x="70" y="160" width="30" height="30"/>
  <rect class="on" x="100" y="160" width="30" height="30"/>
  <rect class="off" x="130" y="160" width="30" height="30"/>
  <rect class="off" x="160" y="160" width="30" height="30"/>
  <rect class="on" x="190" y="160" width="30" height="30"/>
  <rect class="off" x="220" y="160" width="30" height="30"/>
  <rect class="on" x="250" y="160" width="30" height="30"/>
  <text class="s" x="330" y="180">row 5</text><text class="m" x="385" y="180">1 0 1 0 0 1 0 1</text>
  <rect class="on" x="40" y="190" width="30" height="30"/>
  <rect class="off" x="70" y="190" width="30" height="30"/>
  <rect class="off" x="100" y="190" width="30" height="30"/>
  <rect class="on" x="130" y="190" width="30" height="30"/>
  <rect class="on" x="160" y="190" width="30" height="30"/>
  <rect class="off" x="190" y="190" width="30" height="30"/>
  <rect class="off" x="220" y="190" width="30" height="30"/>
  <rect class="on" x="250" y="190" width="30" height="30"/>
  <text class="s" x="330" y="210">row 6</text><text class="m" x="385" y="210">1 0 0 1 1 0 0 1</text>
  <rect class="off" x="40" y="220" width="30" height="30"/>
  <rect class="on" x="70" y="220" width="30" height="30"/>
  <rect class="off" x="100" y="220" width="30" height="30"/>
  <rect class="off" x="130" y="220" width="30" height="30"/>
  <rect class="off" x="160" y="220" width="30" height="30"/>
  <rect class="off" x="190" y="220" width="30" height="30"/>
  <rect class="on" x="220" y="220" width="30" height="30"/>
  <rect class="off" x="250" y="220" width="30" height="30"/>
  <text class="s" x="330" y="240">row 7</text><text class="m" x="385" y="240">0 1 0 0 0 0 1 0</text>
  <rect class="off" x="40" y="250" width="30" height="30"/>
  <rect class="off" x="70" y="250" width="30" height="30"/>
  <rect class="on" x="100" y="250" width="30" height="30"/>
  <rect class="on" x="130" y="250" width="30" height="30"/>
  <rect class="on" x="160" y="250" width="30" height="30"/>
  <rect class="on" x="190" y="250" width="30" height="30"/>
  <rect class="off" x="220" y="250" width="30" height="30"/>
  <rect class="off" x="250" y="250" width="30" height="30"/>
  <text class="s" x="330" y="270">row 8</text><text class="m" x="385" y="270">0 0 1 1 1 1 0 0</text>
  <path class="ln" d="M292,160 L322,160" marker-end="url(#imrA)"/>
  <text class="s" x="560" y="80">1 = black pixel</text><text class="s" x="560" y="100">0 = white pixel</text><text class="s" x="560" y="140">8 × 8 = 64 pixels</text><text class="s" x="560" y="160">64 × 1 bit = 64 bits</text><text class="s" x="560" y="180">= 8 bytes of pixel data</text><text class="s" x="560" y="220">Stored in order: row 1</text><text class="s" x="560" y="240">left to right, then row 2 …</text>
</svg>
:::

If the image has more colours, each pixel needs more bits. With **2 bits** per pixel there are four possible codes — 00, 01, 10 and 11 — so four colours can be used, for example 00 = white, 01 = light grey, 10 = dark grey, 11 = black. With **24 bits** per pixel there are more than 16 million codes, enough for realistic photographs. The number of bits per pixel is called the **colour depth**, and it is explained in the third section. The important idea for now is that **every pixel is a binary number**, and the picture is simply a long list of these numbers.

## Metadata: how the computer rebuilds the picture

A list of bits on its own is not enough to show an image. Suppose a file contains just 24 bits of 1-bit pixel data. Is the picture 6 pixels wide and 4 high, 4 wide and 6 high, 8 wide and 3 high, or 24 pixels in a single row? Each choice gives a completely different picture. Even if the shape is known, the computer must know how many bits belong to each pixel and which colour each code stands for. This extra information is stored at the start of the file, in a part called the **header**, and it is called **metadata** — "data about the data".

:::definition Metadata
**Data about the data**: information stored with the image (in the file header) that the computer needs to **display it correctly** — for a bitmap at least the **width** and **height** in pixels and the **colour depth**, and often the file type, compression method, date taken, camera model and GPS location.
:::

When a program opens the file, it first reads the header, learns that the image is, for example, 800 pixels wide, 600 pixels high, with 24 bits per pixel, and then reads the pixel data 24 bits at a time, placing 800 pixels in each row before starting the next row. Metadata makes the real file slightly larger than the pixel data alone, but the header is usually only a few dozen bytes to a few kilobytes, so in exam calculations of file size it is **ignored** unless the question says otherwise.

:::svg A bitmap file = a header of metadata followed by the pixel data
<svg class="imr" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A bitmap file begins with a header holding width, height, colour depth and file type, followed by the pixel data stored row by row from the top-left pixel">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <text class="h" x="20" y="26">One image file</text>
  <rect class="pb" x="20" y="40" width="220" height="120" rx="8"/>
  <text class="h" x="130" y="62" text-anchor="middle">Header (metadata)</text>
  <text class="m" x="36" y="86">width  = 800</text>
  <text class="m" x="36" y="106">height = 600</text>
  <text class="m" x="36" y="126">depth  = 24 bits</text>
  <text class="m" x="36" y="146">type   = BMP</text>
  <rect class="ok" x="240" y="40" width="500" height="120" rx="8"/>
  <text class="h" x="490" y="62" text-anchor="middle">Pixel data</text>
  <text class="m" x="256" y="90">pixel 1: 11111111 00000000 00000000</text>
  <text class="m" x="256" y="112">pixel 2: 11111111 11111111 00000000</text>
  <text class="m" x="256" y="134">…  480 000 pixels × 24 bits</text>
  <text class="s" x="20" y="186">The header is read first: it tells the program how many pixels go in each row and how many bits belong to each pixel.</text>
  <text class="s" x="20" y="206">Without it the pixel data is just a long string of bits that could be split up in many different ways.</text>
</svg>
:::

:::example Worked example: rebuilding a picture from binary
A file header says: **width 5 pixels, height 4 pixels, colour depth 1 bit (1 = black, 0 = white)**. The pixel data is `00100 01110 11111 00100` (spaces added between rows).

1. The header says each row has 5 pixels, so the 20 bits are split into 4 rows of 5 bits.
2. Row 1 `00100` → white, white, **black**, white, white.
3. Row 2 `01110` → three black pixels in the middle.
4. Row 3 `11111` → a full black row.
5. Row 4 `00100` → one black pixel in the middle.
6. The picture is a small **arrow pointing up** (a triangle on a stem).

If the header had said width 4, the same 20 bits would form 5 rows of 4 pixels and a completely different, meaningless pattern would appear — which shows why the width and height must be stored as metadata.
:::

## Where pixels come from and where they go

A **digital camera** has a sensor covered with millions of light-sensitive cells. Each cell measures the brightness of red, green or blue light falling on it, and the camera's processor turns these measurements into one colour value per pixel. A **scanner** does the same line by line as a light bar moves under a page. A **screenshot** simply copies the colour values that the graphics card is already sending to the screen. In the other direction, a **monitor** is itself a grid of physical pixels; each screen pixel is made of tiny red, green and blue sub-pixels whose brightness is set from the binary colour values. A printer uses dots of ink to reproduce the pixel colours on paper. So the bitmap is a natural format: it matches the way images are captured and the way they are displayed.

Bitmaps are excellent for **photographs and realistic pictures**, because a photo contains smooth, irregular changes of colour that cannot easily be described as simple shapes. Their weakness is that the number of pixels is fixed when the image is created. The next two sections explain the two properties that decide how good a bitmap looks and how much storage it needs: the **resolution** (how many pixels) and the **colour depth** (how many bits per pixel).

# Resolution
@lo 11.1.1.5

:::definition Image resolution
The **number of pixels** in an image, given as **width × height** in pixels (for example **1920 × 1080**), or as the total number of pixels (1920 × 1080 = 2 073 600 pixels ≈ 2 megapixels).
:::

Resolution answers the question "**how many pixels are used to make up the picture?**" A higher resolution means the same scene is divided into **more, smaller pixels**. A common misunderstanding is that a high-resolution image has "bigger" or "better" pixels. In fact each pixel is still just one colour; there are simply **more of them**, so each one covers a smaller part of the scene. Phone cameras describe resolution in **megapixels** (millions of pixels): a 12-megapixel camera produces photos of about 4000 × 3000 = 12 000 000 pixels.

## Why more pixels give more detail

Because every pixel can hold only a single colour, any detail **smaller than one pixel cannot be recorded**. When the camera divides the scene into a coarse grid, the colour of each square is an average of everything inside it, and fine edges, text and texture are lost. When the grid is finer, the edges of objects can be followed much more closely. The diagram shows the same circle stored with three different resolutions. At 8 × 8 the edge is a staircase of large squares; at 32 × 32 the outline is very close to the real curve.

:::svg The same circle at three resolutions
<svg class="imr" viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The same circle stored at 8 by 8, 16 by 16 and 32 by 32 pixels: more pixels follow the curve more closely and show more detail">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.imr .on{fill:var(--foreground);stroke:var(--border);stroke-width:1}
    svg.imr .off{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.imr .px{fill:var(--primary);stroke:var(--border);stroke-width:0.5}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.imr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.imr .ci{fill:none;stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
  </style>
  <defs><marker id="imrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <rect class="off" x="30" y="40" width="200" height="200"/>
  <rect style="fill:var(--primary)" x="80" y="65" width="100" height="25"/>
  <rect style="fill:var(--primary)" x="55" y="90" width="150" height="25"/>
  <rect style="fill:var(--primary)" x="55" y="115" width="150" height="25"/>
  <rect style="fill:var(--primary)" x="55" y="140" width="150" height="25"/>
  <rect style="fill:var(--primary)" x="55" y="165" width="150" height="25"/>
  <rect style="fill:var(--primary)" x="80" y="190" width="100" height="25"/>
  <path d="M30,40v200M30,40h200M55,40v200M30,65h200M80,40v200M30,90h200M105,40v200M30,115h200M130,40v200M30,140h200M155,40v200M30,165h200M180,40v200M30,190h200M205,40v200M30,215h200M230,40v200M30,240h200" style="stroke:var(--border);stroke-width:1;fill:none"/>
  <circle class="ci" cx="130" cy="140" r="84"/>
  <text class="h" x="130" y="270" text-anchor="middle">8 × 8 = 64 pixels</text>
  <text class="s" x="130" y="292" text-anchor="middle">blocky edge, little detail</text>
  <rect class="off" x="280" y="40" width="200" height="200"/>
  <rect style="fill:var(--primary)" x="355" y="52.5" width="50" height="12.5"/>
  <rect style="fill:var(--primary)" x="330" y="65" width="100" height="12.5"/>
  <rect style="fill:var(--primary)" x="317.5" y="77.5" width="125" height="12.5"/>
  <rect style="fill:var(--primary)" x="305" y="90" width="150" height="12.5"/>
  <rect style="fill:var(--primary)" x="305" y="102.5" width="150" height="12.5"/>
  <rect style="fill:var(--primary)" x="292.5" y="115" width="175" height="12.5"/>
  <rect style="fill:var(--primary)" x="292.5" y="127.5" width="175" height="12.5"/>
  <rect style="fill:var(--primary)" x="292.5" y="140" width="175" height="12.5"/>
  <rect style="fill:var(--primary)" x="292.5" y="152.5" width="175" height="12.5"/>
  <rect style="fill:var(--primary)" x="305" y="165" width="150" height="12.5"/>
  <rect style="fill:var(--primary)" x="305" y="177.5" width="150" height="12.5"/>
  <rect style="fill:var(--primary)" x="317.5" y="190" width="125" height="12.5"/>
  <rect style="fill:var(--primary)" x="330" y="202.5" width="100" height="12.5"/>
  <rect style="fill:var(--primary)" x="355" y="215" width="50" height="12.5"/>
  <path d="M280,40v200M280,40h200M292.5,40v200M280,52.5h200M305,40v200M280,65h200M317.5,40v200M280,77.5h200M330,40v200M280,90h200M342.5,40v200M280,102.5h200M355,40v200M280,115h200M367.5,40v200M280,127.5h200M380,40v200M280,140h200M392.5,40v200M280,152.5h200M405,40v200M280,165h200M417.5,40v200M280,177.5h200M430,40v200M280,190h200M442.5,40v200M280,202.5h200M455,40v200M280,215h200M467.5,40v200M280,227.5h200M480,40v200M280,240h200" style="stroke:var(--border);stroke-width:1;fill:none"/>
  <circle class="ci" cx="380" cy="140" r="84"/>
  <text class="h" x="380" y="270" text-anchor="middle">16 × 16 = 256 pixels</text>
  <text class="s" x="380" y="292" text-anchor="middle">smoother edge</text>
  <rect class="off" x="530" y="40" width="200" height="200"/>
  <rect style="fill:var(--primary)" x="598.8" y="58.8" width="62.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="586.3" y="65" width="87.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="580" y="71.3" width="100" height="6.3"/>
  <rect style="fill:var(--primary)" x="567.5" y="77.5" width="125" height="6.3"/>
  <rect style="fill:var(--primary)" x="567.5" y="83.8" width="125" height="6.3"/>
  <rect style="fill:var(--primary)" x="561.3" y="90" width="137.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="555" y="96.3" width="150" height="6.3"/>
  <rect style="fill:var(--primary)" x="555" y="102.5" width="150" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="108.8" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="115" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="121.3" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="127.5" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="133.8" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="140" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="146.3" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="152.5" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="158.8" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="548.8" y="165" width="162.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="555" y="171.3" width="150" height="6.3"/>
  <rect style="fill:var(--primary)" x="555" y="177.5" width="150" height="6.3"/>
  <rect style="fill:var(--primary)" x="561.3" y="183.8" width="137.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="567.5" y="190" width="125" height="6.3"/>
  <rect style="fill:var(--primary)" x="567.5" y="196.3" width="125" height="6.3"/>
  <rect style="fill:var(--primary)" x="580" y="202.5" width="100" height="6.3"/>
  <rect style="fill:var(--primary)" x="586.3" y="208.8" width="87.5" height="6.3"/>
  <rect style="fill:var(--primary)" x="598.8" y="215" width="62.5" height="6.3"/>
  <path d="M530,40v200M530,40h200M536.3,40v200M530,46.3h200M542.5,40v200M530,52.5h200M548.8,40v200M530,58.8h200M555,40v200M530,65h200M561.3,40v200M530,71.3h200M567.5,40v200M530,77.5h200M573.8,40v200M530,83.8h200M580,40v200M530,90h200M586.3,40v200M530,96.3h200M592.5,40v200M530,102.5h200M598.8,40v200M530,108.8h200M605,40v200M530,115h200M611.3,40v200M530,121.3h200M617.5,40v200M530,127.5h200M623.8,40v200M530,133.8h200M630,40v200M530,140h200M636.3,40v200M530,146.3h200M642.5,40v200M530,152.5h200M648.8,40v200M530,158.8h200M655,40v200M530,165h200M661.3,40v200M530,171.3h200M667.5,40v200M530,177.5h200M673.8,40v200M530,183.8h200M680,40v200M530,190h200M686.3,40v200M530,196.3h200M692.5,40v200M530,202.5h200M698.8,40v200M530,208.8h200M705,40v200M530,215h200M711.3,40v200M530,221.3h200M717.5,40v200M530,227.5h200M723.8,40v200M530,233.8h200M730,40v200M530,240h200" style="stroke:var(--border);stroke-width:0.5;fill:none"/>
  <circle class="ci" cx="630" cy="140" r="84"/>
  <text class="h" x="630" y="270" text-anchor="middle">32 × 32 = 1024 pixels</text>
  <text class="s" x="630" y="292" text-anchor="middle">close to the real curve</text>
  <text class="s" x="30" y="24">Dashed line = the real circle. Each square can be only one colour, so detail smaller than one pixel is lost.</text>
</svg>
:::

This is also why a photo of a whiteboard taken from the back of the classroom may be impossible to read: the words cover only a few pixels each, so the shapes of the letters were never recorded. No software can bring back detail that was not captured. Programs that "enlarge" an image can only stretch the existing pixels or **interpolate** (invent in-between pixels by averaging their neighbours), which makes the picture bigger but blurry, not sharper.

## Pixelation

When a low-resolution image is displayed or printed at a large size, each pixel has to be stretched to cover a large area of the screen or paper. The individual squares become visible and the picture looks blocky. This effect is called **pixelation**. The image has not changed — it still has the same number of pixels — but now each one is big enough to see. Pixelation is the reason why a small logo copied from a website looks terrible on a printed banner, and why a profile picture looks fine as a tiny icon but poor when opened full-screen.

:::definition Pixelation
The **blocky appearance** of a bitmap image when it is enlarged so much that its **individual pixels become visible** — caused by a resolution that is too low for the display or print size.
:::

## Image resolution, screen resolution and pixel density

The word "resolution" is used in three related ways, and exam answers should be clear about which one is meant.

- **Image resolution** — the number of pixels stored in the image file, e.g. 4000 × 3000.
- **Screen resolution** — the number of physical pixels on a display, e.g. a laptop screen of 1920 × 1080. A photo larger than the screen is shrunk to fit; a smaller photo is either shown small or stretched.
- **Pixel density** — how closely pixels are packed, measured in **PPI** (pixels per inch) for screens and **DPI** (dots per inch) for printers. The higher the density, the smaller each pixel appears and the sharper the result looks.

:::definition Pixel density (PPI / DPI)
The number of **pixels (or printed dots) per inch** of length. It links the pixel size of an image to its **physical size**: printed width (inches) = width in pixels ÷ PPI.
:::

Pixel density explains why the same image can look sharp in one place and pixelated in another. A 1200-pixel-wide photo shown on a phone that is 3 inches wide is displayed at about 400 PPI and looks perfect. The same 1200 pixels spread across a 40-inch-wide poster are only 30 PPI, and every pixel is a clearly visible block almost 1 mm across. Photographic prints normally need about **300 PPI** to look sharp at reading distance; large posters seen from several metres away can use less.

:::example Worked example: can this photo be printed as a school poster?
The school wants to print an A4 poster (about **8.3 × 11.7 inches**) for the Nauryz concert at **300 PPI**. A teacher has a photo of **1280 × 720** pixels sent through a messenger app.

1. Pixels needed across the shorter side: 8.3 × 300 ≈ **2490** pixels; across the longer side: 11.7 × 300 ≈ **3510** pixels. So about 2490 × 3510 pixels are needed.
2. The photo has only 1280 × 720 pixels. If it is stretched across 11.7 inches, the density is 1280 ÷ 11.7 ≈ **109 PPI** — far below 300.
3. Each pixel would be almost three times wider than it should be, so the poster would look **pixelated** and soft.
4. Solution: ask for the **original camera photo** (for example 4000 × 3000 pixels, which gives 4000 ÷ 11.7 ≈ 342 PPI), or print the photo smaller.
:::

## The trade-off: quality against file size

If more pixels always give more detail, why are images not always stored at the highest possible resolution? Because **every pixel must be stored**. Doubling the width and the height of an image gives four times as many pixels, and so — with the same colour depth — a file **four times larger**. Large files fill phone storage and cloud accounts more quickly, take longer to upload and download, use more mobile data, and need more memory and processing power to edit and display. A school website that uses full-size 12-megapixel photos for small thumbnails would load slowly for every visitor while showing no visible improvement, because the screen cannot display all those pixels at thumbnail size anyway. The right resolution is the **lowest one that still looks good for the intended use**.

:::compare High resolution vs low resolution
| | High resolution (more pixels) | Low resolution (fewer pixels) |
|---|---|---|
| Detail | More detail; fine edges and small text are recorded | Less detail; small features are lost |
| Enlarging / printing | Stays sharp at larger sizes | Becomes **pixelated** when enlarged |
| File size | **Larger** — more pixels to store | **Smaller** |
| Upload / download / loading time | Slower; uses more bandwidth and data | Faster |
| Editing | Needs more RAM and processing power | Quick to edit |
| Typical use | Printed photos, posters, medical scans, photo editing | Web thumbnails, icons, messenger previews, emails |
:::

# Colour depth
@lo 11.1.1.5

:::definition Colour depth (bit depth)
The **number of bits used to store the colour of each pixel**. With a colour depth of *n* bits, **2ⁿ different colours** can be represented.
:::

Resolution decides **how many** pixels there are; colour depth decides **how many different colours each pixel can be**. The two are independent: a huge photo can have only two colours, and a tiny icon can use millions. The link between bits and colours comes straight from binary. One bit has two possible values (0 and 1), so it can code two colours. Two bits have four possible patterns (00, 01, 10, 11), three bits have eight, and in general **n bits give 2ⁿ patterns**. Every extra bit **doubles** the number of colours, because each existing pattern can now be followed by either a 0 or a 1.

:::compare Colour depth and number of colours
| Colour depth | Number of colours | Typical use |
|---|---|---|
| 1 bit | 2¹ = **2** | Black-and-white images, simple fax or barcode images |
| 2 bits | 2² = **4** | Very simple graphics, early games |
| 4 bits | 2⁴ = **16** | Simple icons |
| 8 bits | 2⁸ = **256** | GIF images, simple graphics, greyscale photos (256 shades of grey) |
| 16 bits | 2¹⁶ = **65 536** | "High colour" |
| 24 bits | 2²⁴ = **16 777 216** | "True colour" photos — 8 bits each for **red, green, blue** |
| 32 bits | 2²⁴ colours + 8 bits of **transparency** (alpha) | PNG images with transparent backgrounds |
:::

## How colours are coded

With a small colour depth, the image uses a **palette** (also called a colour table). The file stores a short list of the colours that the image uses, and each pixel stores only the **number of its colour in that list**. A 4-bit image, for example, has a palette of 16 colours, and a pixel with the code 0101 (5 in denary) is painted with the sixth colour in the list. This keeps the file small while allowing the designer to choose which 16 colours are used — useful for logos and icons with a few flat colours.

With **24-bit colour**, no palette is needed. Each pixel stores its colour directly as three 8-bit numbers: one for the amount of **red**, one for **green** and one for **blue** light. This is the **RGB** model, which matches how screens produce colour by mixing red, green and blue sub-pixels. Each channel can take 2⁸ = 256 values (0–255), so the total number of colours is 256 × 256 × 256 = 2²⁴ = 16 777 216. Programmers and web designers often write these values in **hexadecimal**, two hex digits per channel: `#FF8000` means red 255, green 128, blue 0 — orange.

:::definition RGB colour model
A way of coding colour as the amounts of **red, green and blue light**. In 24-bit colour each channel uses **8 bits (0–255)**, so 2⁸ × 2⁸ × 2⁸ = 2²⁴ ≈ 16.7 million colours can be made. (0, 0, 0) is black and (255, 255, 255) is white.
:::

:::svg One 24-bit pixel = three bytes: red, green and blue
<svg class="imr" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A 24-bit pixel is split into three 8-bit bytes for red, green and blue; the values 255, 128 and 0 mix to make orange, written in hexadecimal as FF8000">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="imrB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="20" y="26">24 bits for one pixel</text>
  <rect class="bx" x="20" y="40" width="180" height="70" rx="8"/><text class="h" x="110" y="62" text-anchor="middle">Red (8 bits)</text><text class="m" x="110" y="84" text-anchor="middle">11111111</text><text class="s" x="110" y="102" text-anchor="middle">= 255 = FF</text>
  <rect class="bx" x="210" y="40" width="180" height="70" rx="8"/><text class="h" x="300" y="62" text-anchor="middle">Green (8 bits)</text><text class="m" x="300" y="84" text-anchor="middle">10000000</text><text class="s" x="300" y="102" text-anchor="middle">= 128 = 80</text>
  <rect class="bx" x="400" y="40" width="180" height="70" rx="8"/><text class="h" x="490" y="62" text-anchor="middle">Blue (8 bits)</text><text class="m" x="490" y="84" text-anchor="middle">00000000</text><text class="s" x="490" y="102" text-anchor="middle">= 0 = 00</text>
  <path class="ln" d="M590,75 L640,75" marker-end="url(#imrB)"/>
  <rect x="650" y="40" width="90" height="70" rx="8" style="fill:var(--warning);stroke:var(--border);stroke-width:1.5"/>
  <text class="h" x="695" y="130" text-anchor="middle">orange</text><text class="m" x="695" y="150" text-anchor="middle">#FF8000</text>
  <text class="s" x="20" y="150">Each channel: 2⁸ = 256 levels (0–255)</text>
  <text class="s" x="20" y="172">All three together: 256 × 256 × 256 = 2²⁴ = 16 777 216 colours</text>
  <text class="s" x="20" y="194">Smaller depths (1, 4, 8 bits) usually store a palette number instead: the code points to a colour in a table in the header.</text>
  <text class="s" x="20" y="216">32-bit colour adds an 8-bit alpha channel that says how transparent the pixel is.</text>
</svg>
:::

## How many bits are needed for a given number of colours?

Exam questions often give the number of colours and ask for the colour depth. The rule is: **find the smallest n for which 2ⁿ is at least the number of colours**. You cannot use a fraction of a bit, so if the number of colours is not an exact power of two you must round **up** to the next power. For 5 colours, 2 bits (4 codes) are not enough, so 3 bits (8 codes) are needed and three of the codes are simply unused. For exactly 256 colours, 8 bits are enough because 2⁸ = 256. It helps to know the powers of two by heart: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.

:::example Worked example: choosing the colour depth
**a)** A school logo uses **5** colours (blue, yellow, white, black, red). 2² = 4 < 5, but 2³ = 8 ≥ 5, so the minimum colour depth is **3 bits**.

**b)** A pixel-art game uses a palette of **20** colours. 2⁴ = 16 < 20 and 2⁵ = 32 ≥ 20, so **5 bits** per pixel are needed.

**c)** A greyscale X-ray needs **1000** shades of grey. 2⁹ = 512 < 1000 and 2¹⁰ = 1024 ≥ 1000, so **10 bits** per pixel. (Real medical images often use 12 or 16 bits for exactly this reason — doctors need to see very small differences in density.)

**d)** Going the other way: an image with a colour depth of **6 bits** can show at most 2⁶ = **64** colours.
:::

## Effect of colour depth on quality

With a higher colour depth, each pixel can be set to a colour much closer to the real colour of the scene, so the image looks **more realistic**, with **smoother shading** and gradual changes of tone. With a low colour depth, many slightly different real colours must be forced into the same code. Areas where the colour changes gradually — a blue sky becoming lighter near the horizon, the shading on a face — then show visible stripes of flat colour instead of a smooth change. This effect is called **banding** (or posterisation).

:::svg Low colour depth causes banding in gradients
<svg class="imr" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A sky gradient stored with 2-bit colour shows only 4 visible bands, while with 5-bit colour it shows 32 bands and looks smooth">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.imr .on{fill:var(--foreground);stroke:var(--border);stroke-width:1}
    svg.imr .off{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.imr .px{fill:var(--primary);stroke:var(--border);stroke-width:0.5}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.imr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.imr .ci{fill:none;stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
  </style>
  <defs><marker id="imrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <rect x="40.00" y="34" width="170.40" height="60" style="fill:var(--primary);fill-opacity:0.000"/>
  <rect x="210.00" y="34" width="170.40" height="60" style="fill:var(--primary);fill-opacity:0.333"/>
  <rect x="380.00" y="34" width="170.40" height="60" style="fill:var(--primary);fill-opacity:0.667"/>
  <rect x="550.00" y="34" width="170.40" height="60" style="fill:var(--primary);fill-opacity:1.000"/>
  <rect x="40" y="34" width="680" height="60" style="fill:none;stroke:var(--border);stroke-width:1.5"/>
  <text class="h" x="40" y="26">2-bit colour depth → 2² = 4 shades: clear stripes (banding)</text>
  <rect x="40.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.000"/>
  <rect x="61.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.032"/>
  <rect x="82.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.065"/>
  <rect x="103.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.097"/>
  <rect x="125.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.129"/>
  <rect x="146.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.161"/>
  <rect x="167.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.194"/>
  <rect x="188.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.226"/>
  <rect x="210.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.258"/>
  <rect x="231.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.290"/>
  <rect x="252.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.323"/>
  <rect x="273.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.355"/>
  <rect x="295.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.387"/>
  <rect x="316.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.419"/>
  <rect x="337.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.452"/>
  <rect x="358.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.484"/>
  <rect x="380.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.516"/>
  <rect x="401.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.548"/>
  <rect x="422.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.581"/>
  <rect x="443.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.613"/>
  <rect x="465.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.645"/>
  <rect x="486.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.677"/>
  <rect x="507.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.710"/>
  <rect x="528.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.742"/>
  <rect x="550.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.774"/>
  <rect x="571.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.806"/>
  <rect x="592.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.839"/>
  <rect x="613.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.871"/>
  <rect x="635.00" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.903"/>
  <rect x="656.25" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.935"/>
  <rect x="677.50" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:0.968"/>
  <rect x="698.75" y="140" width="21.65" height="60" style="fill:var(--primary);fill-opacity:1.000"/>
  <rect x="40" y="140" width="680" height="60" style="fill:none;stroke:var(--border);stroke-width:1.5"/>
  <text class="h" x="40" y="132">5-bit colour depth → 2⁵ = 32 shades: almost smooth</text>
  <text class="s" x="40" y="220">With 8 bits per channel (24-bit colour) there are 256 levels of each primary colour, and the eye cannot see the steps.</text>
</svg>
:::

The human eye can distinguish roughly ten million colours, which is why 24-bit "true colour" with about 16.7 million colours is the standard for photos: going beyond it gives almost no visible improvement for normal viewing. Higher depths (30, 36 or 48 bits) are used in professional photo editing and medical imaging, where images are processed heavily or examined for tiny differences.

## Effect of colour depth on file size

Every pixel stores colour-depth bits, so the colour depth **multiplies** the size of the pixel data. An image stored with 24-bit colour is **three times** the size of the same image with 8-bit colour, and **24 times** the size of a 1-bit version. Doubling the colour depth (for example from 8 to 16 bits) **doubles** the file size, even though the number of colours goes up much more (from 256 to 65 536). This is a useful point in "explain" answers: the number of colours grows as a power of two, but the file size grows only in proportion to the number of bits.

:::compare Effect of resolution and colour depth
| Change | Image quality | File size |
|---|---|---|
| Increase the **resolution** | More pixels → more detail, sharper when enlarged | **Increases** in proportion to the number of pixels |
| Decrease the **resolution** | Less detail, may look pixelated | Decreases |
| Increase the **colour depth** | More colours → smoother shading, more realistic, less banding | **Increases** in proportion to the bits per pixel |
| Decrease the **colour depth** | Fewer colours → banding, less realistic | Decreases |
| **Double** the width **and** the height | More detail | **× 4** (four times as many pixels) |
| Colour depth 8 → 24 bits | 256 → 16.7 million colours | **× 3** |
:::

## Choosing resolution and colour depth together

Resolution and colour depth are chosen together for each purpose. A scanned page of printed text needs a **high resolution** so that the letters are sharp, but only **1 bit** of colour depth, because the page is black ink on white paper. A family photograph needs both a good resolution and **24-bit** colour. A small icon for an app may be only 64 × 64 pixels but use 32-bit colour so that its edges can be partly transparent. Thinking about what the image will be used for — viewed on a phone, printed on a poster, read by a doctor — is what lets you justify a choice in an exam answer instead of just saying "higher is better".

:::warning Common mistakes
- Saying higher resolution means "bigger pixels" or "better pixels" — it means **more** pixels in the same picture.
- Confusing **colour depth** (bits per pixel, e.g. 8) with the **number of colours** (e.g. 256). The number of colours is 2 to the power of the colour depth.
- Rounding **down** when finding the colour depth: 20 colours need 5 bits, not 4, because 2⁴ = 16 is too few.
- Saying that increasing the colour depth "makes the image sharper". Sharpness and detail come from **resolution**; colour depth gives **more colours and smoother shading**.
- Thinking enlarging a photo in software adds detail. It only stretches or interpolates the pixels that are already there.
- Forgetting that both properties increase the **file size**, and not explaining **why** (more pixels to store / more bits per pixel).
:::

# Exam practice: pixels, resolution and colour depth
@lo 11.1.1.5

:::example Exam-style questions with model answers
**Q: Explain how a bitmap image is represented in terms of pixels, resolution and colour depth. [3]**
The image is made of a grid of **pixels**, each pixel storing **one colour as a binary code** (1); the **resolution** is the number of pixels (width × height) — more pixels give more detail (1); the **colour depth** is the number of bits used for each pixel, which sets the number of colours (2ⁿ) (1).

**Q: State why the width and height of an image must be stored in the file. [1]**
So the computer knows **how many pixels are in each row**, to rebuild the grid correctly from the stream of bits (1).

**Q: An image uses 40 different colours. State the minimum colour depth. [1]**
**6 bits** (2⁵ = 32 is too few, 2⁶ = 64 ≥ 40) (1).

**Q: Explain the effect of increasing the colour depth of a photo from 8 bits to 24 bits. [4]**
The number of colours increases from 256 to about 16.7 million (1), so colours are closer to the real ones / shading is smoother / less banding (1). Each pixel needs three times as many bits (1), so the file size is **three times larger** (1).

**Q: A photo taken with an old phone looks pixelated when it is printed on a large poster. Explain why. [2]**
The photo has a **low resolution** / too few pixels for the size of the poster (1), so each pixel is stretched over a large area and the individual squares become visible (1).

**Q: Describe one advantage and one disadvantage of storing a photo with a higher resolution. [2]**
Advantage: more detail / stays sharp when enlarged or printed (1). Disadvantage: larger file size, so more storage needed and slower to upload or download (1).
:::

:::warning Common mistakes in exam answers
- Answering "explain" questions with single words ("quality goes up"). Say **what** changes and **why**: more pixels → more detail; more bits per pixel → more colours.
- Writing "colour depth = number of colours". Write "number of **bits per pixel**".
- For a "state the colour depth" question, giving 2ⁿ (the number of colours) instead of n.
:::

:::steps Check yourself
- Define pixel, bitmap image, resolution, colour depth and metadata.
- Why must the header store the width, height and colour depth?
- How many colours can be shown with 1, 4, 8 and 24 bits per pixel?
- How many bits are needed for 30 colours? For 129 colours?
- What causes pixelation? What causes banding?
- Explain why a scanned page of text can use high resolution but a 1-bit colour depth.
:::

# Calculating the size of a bitmap file
@lo 11.1.1.6

Because a bitmap stores a fixed number of bits for every pixel, its size can be **calculated exactly** before the image is even taken. This matters in real life: a camera designer must know how many photos fit on a memory card, a web developer must know how long a page will take to load on a mobile connection, and a school IT technician must know how much server space a year of scanned documents will need. In the exam, this calculation is one of the most common questions in the topic.

:::definition File size of a bitmap image
**File size (bits) = width (pixels) × height (pixels) × colour depth (bits per pixel)**

Then convert: **÷ 8 → bytes**, **÷ 1024 → kilobytes (KB)**, **÷ 1024 → megabytes (MB)**, **÷ 1024 → gigabytes (GB)**. Metadata (the header) and compression are ignored unless the question says otherwise.
:::

## Why the formula works

The formula follows directly from how a bitmap is stored. **Width × height** gives the total **number of pixels** in the grid. Each of those pixels uses exactly **colour-depth bits**. Multiplying the number of pixels by the bits per pixel therefore gives the **total number of bits** of pixel data. Nothing else is needed — the content of the picture does not matter. An uncompressed 800 × 600 image with 24-bit colour is always the same size, whether it shows a white wall or a busy market in Almaty, because every pixel uses 24 bits regardless of its colour. (Compression, explained in the next section, is what makes files of different content end up different sizes.)

Because the three values are multiplied, each of them affects the size **in proportion**: double any one of them and the file size doubles; double two of them and the size goes up four times. This makes it possible to answer many "what happens if…" questions without a full calculation.

## Units of storage

The answer to width × height × depth is in **bits**, which gives very large numbers. Storage is normally measured in bytes and multiples of bytes, so the final step of almost every question is a **unit conversion**.

:::definition Byte
A group of **8 bits**; the basic unit used to measure storage. One byte can store 2⁸ = 256 different values — for example one 8-bit pixel or one ASCII character.
:::

:::compare Units of storage (binary prefixes)
| Unit | Size | Convert from the unit below |
|---|---|---|
| 1 bit | a single 0 or 1 | — |
| 1 byte (B) | 8 bits | bits ÷ 8 |
| 1 kilobyte (KB / KiB) | 1024 bytes | bytes ÷ 1024 |
| 1 megabyte (MB / MiB) | 1024 KB = 1 048 576 bytes | KB ÷ 1024 |
| 1 gigabyte (GB / GiB) | 1024 MB | MB ÷ 1024 |
| 1 terabyte (TB / TiB) | 1024 GB | GB ÷ 1024 |
:::

To go to a **larger** unit, **divide**; to go to a **smaller** unit, **multiply**. Going from bits to bytes is ÷ 8 (not ÷ 1024 — this is the most common slip). The factor 1024 = 2¹⁰ is used because memory is addressed in binary, so sizes come naturally in powers of two.

:::callout info 1000 or 1024?
In computer science, 1 KB is usually taken as **1024 bytes** (strictly, a kibibyte, KiB). Some questions and storage manufacturers use **1000** (the SI kilobyte, kB). Use the value the question gives; if it does not say, use **1024**, state which you used, and show every step so that the method can be credited either way. Never mix the two in one calculation.
:::

:::svg From pixels to megabytes: the calculation chain
<svg class="imr" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Calculation chain: width times height gives pixels, times colour depth gives bits, divide by 8 for bytes, divide by 1024 for kilobytes, divide by 1024 again for megabytes; the example 1024 by 768 at 24 bits gives 2.25 megabytes">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="imrC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <rect class="bx" x="10" y="40" width="120" height="64" rx="8"/><text class="h" x="70" y="64" text-anchor="middle">Pixels</text><text class="s" x="70" y="84" text-anchor="middle">width × height</text>
  <rect class="bx" x="165" y="40" width="120" height="64" rx="8"/><text class="h" x="225" y="64" text-anchor="middle">Bits</text><text class="s" x="225" y="84" text-anchor="middle">× colour depth</text>
  <rect class="bx" x="320" y="40" width="120" height="64" rx="8"/><text class="h" x="380" y="64" text-anchor="middle">Bytes</text><text class="s" x="380" y="84" text-anchor="middle">÷ 8</text>
  <rect class="bx" x="475" y="40" width="120" height="64" rx="8"/><text class="h" x="535" y="64" text-anchor="middle">KB</text><text class="s" x="535" y="84" text-anchor="middle">÷ 1024</text>
  <rect class="pb" x="630" y="40" width="120" height="64" rx="8"/><text class="h" x="690" y="64" text-anchor="middle">MB</text><text class="s" x="690" y="84" text-anchor="middle">÷ 1024</text>
  <path class="ln" d="M130,72 L161,72" marker-end="url(#imrC)"/><path class="ln" d="M285,72 L316,72" marker-end="url(#imrC)"/><path class="ln" d="M440,72 L471,72" marker-end="url(#imrC)"/><path class="ln" d="M595,72 L626,72" marker-end="url(#imrC)"/>
  <text class="h" x="10" y="24">Each step to a larger unit divides; going back multiplies</text>
  <text class="mp" x="70" y="134" text-anchor="middle">786 432</text><text class="mp" x="225" y="134" text-anchor="middle">18 874 368</text><text class="mp" x="380" y="134" text-anchor="middle">2 359 296</text><text class="mp" x="535" y="134" text-anchor="middle">2304</text><text class="mp" x="690" y="134" text-anchor="middle">2.25</text>
  <text class="s" x="10" y="170">Example: 1024 × 768 pixels, 24-bit colour. Working backwards (from MB to bits) multiply by 1024, 1024 and 8,</text>
  <text class="s" x="10" y="190">then divide by the number of pixels to find the colour depth, or by (height × depth) to find the width.</text>
</svg>
:::

:::steps How to calculate the size of a bitmap image
- Write down the width, height and colour depth. If the question gives the **number of colours**, first convert it to a colour depth (smallest n with 2ⁿ ≥ colours).
- Multiply **width × height** to get the number of pixels.
- Multiply by the **colour depth** to get the size in **bits**.
- Divide by **8** to get **bytes**.
- Divide by **1024** for **KB**, and again by **1024** for **MB** — stop at the unit the question asks for.
- Show every line of working with its unit, and round only at the end (say how many decimal places).
:::

:::example Worked example 1 — 1024 × 768 pixels, 24-bit colour, answer in MB
1. Pixels: 1024 × 768 = **786 432** pixels
2. Bits: 786 432 × 24 = **18 874 368 bits**
3. Bytes: 18 874 368 ÷ 8 = **2 359 296 bytes**
4. KB: 2 359 296 ÷ 1024 = **2304 KB**
5. MB: 2304 ÷ 1024 = **2.25 MB**
:::

:::example Worked example 2 — 800 × 600 pixels, 256 colours, answer in KB
1. Colour depth: 256 colours → 2⁸ = 256, so **8 bits** per pixel. (Using 256 in the formula instead of 8 is a classic mistake.)
2. Bits: 800 × 600 × 8 = **3 840 000 bits**
3. Bytes: 3 840 000 ÷ 8 = **480 000 bytes**
4. KB: 480 000 ÷ 1024 = **468.75 KB**
:::

## Working backwards

Some questions give the file size and ask for a missing value — the colour depth, or the width. The method is the same chain **in reverse**: convert the file size back to **bits** (× 1024 for each step down from MB or KB, then × 8), and then **divide** by the values you know.

:::example Worked example 3 — finding the colour depth
A **640 × 480** image has a file size of **600 KB**. Calculate its colour depth.
1. Bytes: 600 × 1024 = **614 400 bytes**
2. Bits: 614 400 × 8 = **4 915 200 bits**
3. Pixels: 640 × 480 = **307 200**
4. Colour depth = bits ÷ pixels = 4 915 200 ÷ 307 200 = **16 bits per pixel** (so 2¹⁶ = 65 536 colours).
:::

:::example Worked example 4 — finding the width
A scanned image is **1200** pixels high, uses **1-bit** colour and has a pixel data size of **175 KB**. Find its width.
1. Bits: 175 × 1024 × 8 = **1 433 600 bits**
2. Each pixel is 1 bit, so there are 1 433 600 pixels.
3. Width = pixels ÷ height = 1 433 600 ÷ 1200 ≈ **1195 pixels** (the scanner probably used 1195 × 1200; a small difference can come from rounding the file size).
:::

## Real-life calculations: storage and transfer time

The same calculation lets you answer practical questions. To find **how many images fit** on a device, divide the free space by the size of one image (in the same unit) and round **down**, because a half-stored photo is useless. To find **how long a transfer takes**, divide the file size **in bits** by the transfer speed in bits per second — network speeds are given in **bits** per second (Mbps), not bytes, which is a common trap.

:::example Worked example 5 — photos on a memory card and over the network
A camera takes **4000 × 3000** photos in **24-bit** colour (uncompressed).
1. Size of one photo: 4000 × 3000 × 24 = 288 000 000 bits ÷ 8 = **36 000 000 bytes** ÷ 1024 ÷ 1024 ≈ **34.3 MB**.
2. A **16 GB** card holds 16 × 1024 = **16 384 MB**. 16 384 ÷ 34.3 ≈ 477.6, so **477 photos** (round down).
3. Sending one photo over a **20 Mbps** connection (20 000 000 bits per second): 288 000 000 ÷ 20 000 000 = **14.4 seconds**.
This is why cameras and phones **compress** photos as JPEG: the same photo is often only 3–5 MB, so ten times more fit on the card and it uploads ten times faster.
:::

The real file on a disk is always slightly bigger than the calculated pixel data because of the **header (metadata)**, and for some formats each row is padded to a whole number of bytes. Exam questions say "ignore metadata" or simply expect the pixel-data calculation; if a question gives a header size, add it at the end, in the same unit.

# Changing and reducing file size
@lo 11.1.1.5 11.1.1.6

## Predicting the effect of a change

Because the file size is a product of three numbers, any change to one of them changes the file size by the same factor. This lets you answer "what happens to the file size if…" questions in one line, and check full calculations.

- **Width × 2** (height unchanged) → twice as many pixels → file size **× 2**.
- **Width × 2 and height × 2** → 2 × 2 = 4 times as many pixels → file size **× 4**.
- **Width ÷ 2 and height ÷ 2** → a quarter of the pixels → file size **÷ 4**.
- **Colour depth 8 → 24 bits** → three times as many bits per pixel → file size **× 3**.
- **Colour depth 24 → 1 bit** → file size **÷ 24**.

:::svg Doubling the width and the height gives four times the pixels
<svg class="imr" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An image of 4 by 3 pixels has 12 pixels; doubling both the width and the height to 8 by 6 gives 48 pixels, four times as many, so the file is four times larger">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.imr .on{fill:var(--foreground);stroke:var(--border);stroke-width:1}
    svg.imr .off{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.imr .px{fill:var(--primary);stroke:var(--border);stroke-width:0.5}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.imr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.imr .ci{fill:none;stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
  </style>
  <defs><marker id="imrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <rect class="px" x="40" y="60" width="30" height="30"/>
  <rect class="px" x="70" y="60" width="30" height="30"/>
  <rect class="px" x="100" y="60" width="30" height="30"/>
  <rect class="px" x="130" y="60" width="30" height="30"/>
  <rect class="px" x="40" y="90" width="30" height="30"/>
  <rect class="px" x="70" y="90" width="30" height="30"/>
  <rect class="px" x="100" y="90" width="30" height="30"/>
  <rect class="px" x="130" y="90" width="30" height="30"/>
  <rect class="px" x="40" y="120" width="30" height="30"/>
  <rect class="px" x="70" y="120" width="30" height="30"/>
  <rect class="px" x="100" y="120" width="30" height="30"/>
  <rect class="px" x="130" y="120" width="30" height="30"/>
  <text class="h" x="100" y="40" text-anchor="middle">4 × 3 = 12 pixels</text>
  <text class="s" x="100" y="180" text-anchor="middle">8-bit colour: 12 × 8 = 96 bits</text>
  <path class="ln" d="M190,105 L290,105" marker-end="url(#imrA)"/><text class="s" x="240" y="95" text-anchor="middle">× 2 width</text><text class="s" x="240" y="128" text-anchor="middle">× 2 height</text>
  <rect class="px" x="310" y="40" width="25" height="25"/>
  <rect class="px" x="335" y="40" width="25" height="25"/>
  <rect class="px" x="360" y="40" width="25" height="25"/>
  <rect class="px" x="385" y="40" width="25" height="25"/>
  <rect class="pb" x="410" y="40" width="25" height="25"/>
  <rect class="pb" x="435" y="40" width="25" height="25"/>
  <rect class="pb" x="460" y="40" width="25" height="25"/>
  <rect class="pb" x="485" y="40" width="25" height="25"/>
  <rect class="px" x="310" y="65" width="25" height="25"/>
  <rect class="px" x="335" y="65" width="25" height="25"/>
  <rect class="px" x="360" y="65" width="25" height="25"/>
  <rect class="px" x="385" y="65" width="25" height="25"/>
  <rect class="pb" x="410" y="65" width="25" height="25"/>
  <rect class="pb" x="435" y="65" width="25" height="25"/>
  <rect class="pb" x="460" y="65" width="25" height="25"/>
  <rect class="pb" x="485" y="65" width="25" height="25"/>
  <rect class="px" x="310" y="90" width="25" height="25"/>
  <rect class="px" x="335" y="90" width="25" height="25"/>
  <rect class="px" x="360" y="90" width="25" height="25"/>
  <rect class="px" x="385" y="90" width="25" height="25"/>
  <rect class="pb" x="410" y="90" width="25" height="25"/>
  <rect class="pb" x="435" y="90" width="25" height="25"/>
  <rect class="pb" x="460" y="90" width="25" height="25"/>
  <rect class="pb" x="485" y="90" width="25" height="25"/>
  <rect class="pb" x="310" y="115" width="25" height="25"/>
  <rect class="pb" x="335" y="115" width="25" height="25"/>
  <rect class="pb" x="360" y="115" width="25" height="25"/>
  <rect class="pb" x="385" y="115" width="25" height="25"/>
  <rect class="pb" x="410" y="115" width="25" height="25"/>
  <rect class="pb" x="435" y="115" width="25" height="25"/>
  <rect class="pb" x="460" y="115" width="25" height="25"/>
  <rect class="pb" x="485" y="115" width="25" height="25"/>
  <rect class="pb" x="310" y="140" width="25" height="25"/>
  <rect class="pb" x="335" y="140" width="25" height="25"/>
  <rect class="pb" x="360" y="140" width="25" height="25"/>
  <rect class="pb" x="385" y="140" width="25" height="25"/>
  <rect class="pb" x="410" y="140" width="25" height="25"/>
  <rect class="pb" x="435" y="140" width="25" height="25"/>
  <rect class="pb" x="460" y="140" width="25" height="25"/>
  <rect class="pb" x="485" y="140" width="25" height="25"/>
  <rect class="pb" x="310" y="165" width="25" height="25"/>
  <rect class="pb" x="335" y="165" width="25" height="25"/>
  <rect class="pb" x="360" y="165" width="25" height="25"/>
  <rect class="pb" x="385" y="165" width="25" height="25"/>
  <rect class="pb" x="410" y="165" width="25" height="25"/>
  <rect class="pb" x="435" y="165" width="25" height="25"/>
  <rect class="pb" x="460" y="165" width="25" height="25"/>
  <rect class="pb" x="485" y="165" width="25" height="25"/>
  <text class="h" x="410" y="210" text-anchor="middle">8 × 6 = 48 pixels</text>
  <text class="s" x="410" y="230" text-anchor="middle">48 × 8 = 384 bits = 4 × 96</text>
  <rect class="bx" x="540" y="50" width="200" height="130" rx="10"/><text class="h" x="640" y="74" text-anchor="middle">Scale factors</text><text class="s" x="640" y="98" text-anchor="middle">width × 2 only → size × 2</text><text class="s" x="640" y="118" text-anchor="middle">width and height × 2 → × 4</text><text class="s" x="640" y="138" text-anchor="middle">width and height ÷ 2 → ÷ 4</text><text class="s" x="640" y="158" text-anchor="middle">8-bit → 24-bit → × 3</text>
</svg>
:::

A common error is to think that doubling the dimensions doubles the file. It is the **area** — the number of pixels — that matters, and doubling both sides of a rectangle multiplies its area by four. Likewise, going from 1-bit to 8-bit colour does not multiply the size by 256 (the increase in colours) but by 8 (the increase in bits).

## Ways to reduce the file size

Large images cause real problems: slow web pages, full storage, high mobile-data use and long upload times. There are several ways to make an image file smaller, and each has a cost.

1. **Reduce the resolution** (resample to fewer pixels). Fewer pixels must be stored, so the size falls in proportion. The cost is lost detail; the image may look pixelated if it is later enlarged. This is the right choice when the image will only ever be shown small, such as a thumbnail.
2. **Reduce the colour depth.** Fewer bits per pixel give a smaller file. The cost is fewer colours, which can cause banding in photos; it works well for logos, diagrams and scanned text with few colours.
3. **Crop the image.** Cutting away unwanted edges removes pixels that are not needed at all, so no important detail is lost.
4. **Compress the file**, either losslessly or lossily, as explained below.

:::definition Compression
Reducing the **number of bits needed to store a file**, so that it takes **less storage** and is **faster to transmit**. **Lossless** compression lets the original be rebuilt **exactly**; **lossy** compression **permanently removes** some data to make the file much smaller.
:::

## Lossless compression

Lossless compression looks for **patterns and repetition** in the data and stores them more efficiently, without throwing anything away. A simple method is **run-length encoding (RLE)**: instead of storing the same colour code many times in a row, the file stores **how many times** it repeats and the colour once. A row of a black-and-white image `W W W W W W B B B W W W` (12 pixels) can be stored as `6W 3B 3W` — three pairs instead of twelve values. When the image is opened, the runs are expanded back into the identical row of pixels. Lossless methods work best on images with large areas of flat colour — screenshots, logos, cartoons, scanned text — and are used in **PNG** and **GIF** files. They are essential where every pixel matters, for example medical scans or images that will be edited again and again.

## Lossy compression

Lossy compression makes files much smaller by **permanently removing information the human eye is unlikely to notice**: tiny changes in colour between neighbouring pixels, very fine detail, and colour information (the eye is more sensitive to brightness than to colour). **JPEG** is the best-known lossy format for photos; a 34 MB uncompressed photo may become a 3 MB JPEG that looks almost the same on screen. The user can usually choose a **quality level**: lower quality gives a smaller file but visible **artefacts** — blocky squares and blurry halos around sharp edges. Because the removed data is gone for ever, the original cannot be restored, and saving a JPEG again and again loses a little more quality each time.

:::compare Lossless vs lossy compression
| | Lossless | Lossy |
|---|---|---|
| Data removed? | **No** — the original is rebuilt **exactly** | **Yes** — some detail is removed **permanently** |
| Typical size reduction | Moderate (often 2–3 times smaller) | Large (often 10 times smaller or more) |
| Quality | Identical to the original | Slightly lower; artefacts at high compression |
| How | Stores patterns more efficiently, e.g. run-length encoding | Removes detail and colour differences the eye barely notices |
| Image formats | PNG, GIF, BMP with RLE | JPEG |
| Best for | Logos, screenshots, text, medical images, master copies for editing | Photos for websites, social media, messaging, email |
:::

:::compare Ways to reduce the size of an image file
| Method | Effect on file size | Cost |
|---|---|---|
| **Reduce the resolution** | Smaller in proportion to the pixels removed | Less detail; pixelated if enlarged later |
| **Reduce the colour depth** | Smaller in proportion to the bits removed | Fewer colours, possible banding |
| **Crop** | Removes unwanted pixels | None for the part that is kept |
| **Lossless compression** (PNG, GIF) | Moderately smaller | **No** quality lost |
| **Lossy compression** (JPEG) | Much smaller | Some detail **permanently** lost |
:::

:::example Worked example: preparing photos for the school website
The IT club must put 40 event photos on the school website. Each original is **4000 × 3000, 24-bit** (≈ **34.3 MB** uncompressed). The page must load quickly on students' phones.
1. The page shows each photo at most **1200** pixels wide, so the resolution is reduced to **1200 × 900**: 1200 × 900 × 24 ÷ 8 = 3 240 000 bytes ≈ **3.09 MB**. The width and height were both divided by 3.33, so the size fell by 3.33² ≈ **11 times**, with no visible loss on a phone screen.
2. The photos are then saved as **JPEG** at a medium-high quality, which typically makes them about 10 times smaller again — roughly **300 KB** each.
3. The 40 photos now total about 12 MB instead of 1.3 GB. The originals are kept unchanged (losslessly) on the school server in case they are needed for printing.
:::

# Bitmap and vector images
@lo 11.1.1.5

Everything so far has been about bitmaps, but not every image is stored as pixels. Logos, icons, maps, diagrams and fonts are usually stored as **vector graphics**, and knowing the difference explains why bitmaps behave the way they do.

:::definition Vector graphic
An image stored as a list of **objects (shapes)** — lines, curves, rectangles, circles, text — each described by **mathematical properties** such as coordinates, size, line colour, line width and fill colour. The image is **redrawn from these instructions** whenever it is displayed, at any size.
:::

A vector file does not store a colour for every point. It stores **drawing instructions**. A red circle is stored as "circle, centre (100, 100), radius 80, fill red" — a few dozen bytes — instead of tens of thousands of pixels. When the image is displayed, the computer calculates which screen pixels the shape covers at the current size and colours them. When the user zooms in, the shape is simply **recalculated** at the larger size, so the edges stay perfectly smooth. Enlarging a bitmap, in contrast, can only stretch the existing pixels.

```xml | A tiny vector image in SVG format: two shapes, about 150 bytes
<svg width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#00AFCA"/>
  <rect x="60" y="150" width="80" height="20" fill="#FFD700"/>
</svg>
```

:::svg Zooming in: a bitmap shows its pixels, a vector stays sharp
<svg class="imr" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zooming in on a bitmap edge shows square pixels in a staircase, while a vector edge is recalculated from its mathematical description and stays smooth">
  <style>
    svg.imr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.imr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.imr .m{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.imr .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.imr .on{fill:var(--foreground);stroke:var(--border);stroke-width:1}
    svg.imr .off{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.imr .px{fill:var(--primary);stroke:var(--border);stroke-width:0.5}
    svg.imr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.imr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.imr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.imr .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.imr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.imr .ci{fill:none;stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
  </style>
  <defs><marker id="imrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="40" y="24">Bitmap zoomed × 8</text><text class="h" x="390" y="24">Vector zoomed × 8</text>
  <rect class="off" x="40" y="40" width="20" height="20"/>
  <rect class="off" x="60" y="40" width="20" height="20"/>
  <rect class="off" x="80" y="40" width="20" height="20"/>
  <rect class="off" x="100" y="40" width="20" height="20"/>
  <rect class="off" x="120" y="40" width="20" height="20"/>
  <rect class="off" x="140" y="40" width="20" height="20"/>
  <rect class="off" x="160" y="40" width="20" height="20"/>
  <rect class="off" x="180" y="40" width="20" height="20"/>
  <rect class="off" x="200" y="40" width="20" height="20"/>
  <rect class="off" x="220" y="40" width="20" height="20"/>
  <rect class="off" x="240" y="40" width="20" height="20"/>
  <rect class="off" x="260" y="40" width="20" height="20"/>
  <rect class="px" x="40" y="60" width="20" height="20"/>
  <rect class="px" x="60" y="60" width="20" height="20"/>
  <rect class="px" x="80" y="60" width="20" height="20"/>
  <rect class="off" x="100" y="60" width="20" height="20"/>
  <rect class="off" x="120" y="60" width="20" height="20"/>
  <rect class="off" x="140" y="60" width="20" height="20"/>
  <rect class="off" x="160" y="60" width="20" height="20"/>
  <rect class="off" x="180" y="60" width="20" height="20"/>
  <rect class="off" x="200" y="60" width="20" height="20"/>
  <rect class="off" x="220" y="60" width="20" height="20"/>
  <rect class="off" x="240" y="60" width="20" height="20"/>
  <rect class="off" x="260" y="60" width="20" height="20"/>
  <rect class="px" x="40" y="80" width="20" height="20"/>
  <rect class="px" x="60" y="80" width="20" height="20"/>
  <rect class="px" x="80" y="80" width="20" height="20"/>
  <rect class="px" x="100" y="80" width="20" height="20"/>
  <rect class="px" x="120" y="80" width="20" height="20"/>
  <rect class="off" x="140" y="80" width="20" height="20"/>
  <rect class="off" x="160" y="80" width="20" height="20"/>
  <rect class="off" x="180" y="80" width="20" height="20"/>
  <rect class="off" x="200" y="80" width="20" height="20"/>
  <rect class="off" x="220" y="80" width="20" height="20"/>
  <rect class="off" x="240" y="80" width="20" height="20"/>
  <rect class="off" x="260" y="80" width="20" height="20"/>
  <rect class="px" x="40" y="100" width="20" height="20"/>
  <rect class="px" x="60" y="100" width="20" height="20"/>
  <rect class="px" x="80" y="100" width="20" height="20"/>
  <rect class="px" x="100" y="100" width="20" height="20"/>
  <rect class="px" x="120" y="100" width="20" height="20"/>
  <rect class="px" x="140" y="100" width="20" height="20"/>
  <rect class="px" x="160" y="100" width="20" height="20"/>
  <rect class="off" x="180" y="100" width="20" height="20"/>
  <rect class="off" x="200" y="100" width="20" height="20"/>
  <rect class="off" x="220" y="100" width="20" height="20"/>
  <rect class="off" x="240" y="100" width="20" height="20"/>
  <rect class="off" x="260" y="100" width="20" height="20"/>
  <rect class="px" x="40" y="120" width="20" height="20"/>
  <rect class="px" x="60" y="120" width="20" height="20"/>
  <rect class="px" x="80" y="120" width="20" height="20"/>
  <rect class="px" x="100" y="120" width="20" height="20"/>
  <rect class="px" x="120" y="120" width="20" height="20"/>
  <rect class="px" x="140" y="120" width="20" height="20"/>
  <rect class="px" x="160" y="120" width="20" height="20"/>
  <rect class="px" x="180" y="120" width="20" height="20"/>
  <rect class="off" x="200" y="120" width="20" height="20"/>
  <rect class="off" x="220" y="120" width="20" height="20"/>
  <rect class="off" x="240" y="120" width="20" height="20"/>
  <rect class="off" x="260" y="120" width="20" height="20"/>
  <rect class="px" x="40" y="140" width="20" height="20"/>
  <rect class="px" x="60" y="140" width="20" height="20"/>
  <rect class="px" x="80" y="140" width="20" height="20"/>
  <rect class="px" x="100" y="140" width="20" height="20"/>
  <rect class="px" x="120" y="140" width="20" height="20"/>
  <rect class="px" x="140" y="140" width="20" height="20"/>
  <rect class="px" x="160" y="140" width="20" height="20"/>
  <rect class="px" x="180" y="140" width="20" height="20"/>
  <rect class="px" x="200" y="140" width="20" height="20"/>
  <rect class="off" x="220" y="140" width="20" height="20"/>
  <rect class="off" x="240" y="140" width="20" height="20"/>
  <rect class="off" x="260" y="140" width="20" height="20"/>
  <rect class="px" x="40" y="160" width="20" height="20"/>
  <rect class="px" x="60" y="160" width="20" height="20"/>
  <rect class="px" x="80" y="160" width="20" height="20"/>
  <rect class="px" x="100" y="160" width="20" height="20"/>
  <rect class="px" x="120" y="160" width="20" height="20"/>
  <rect class="px" x="140" y="160" width="20" height="20"/>
  <rect class="px" x="160" y="160" width="20" height="20"/>
  <rect class="px" x="180" y="160" width="20" height="20"/>
  <rect class="px" x="200" y="160" width="20" height="20"/>
  <rect class="off" x="220" y="160" width="20" height="20"/>
  <rect class="off" x="240" y="160" width="20" height="20"/>
  <rect class="off" x="260" y="160" width="20" height="20"/>
  <rect class="px" x="40" y="180" width="20" height="20"/>
  <rect class="px" x="60" y="180" width="20" height="20"/>
  <rect class="px" x="80" y="180" width="20" height="20"/>
  <rect class="px" x="100" y="180" width="20" height="20"/>
  <rect class="px" x="120" y="180" width="20" height="20"/>
  <rect class="px" x="140" y="180" width="20" height="20"/>
  <rect class="px" x="160" y="180" width="20" height="20"/>
  <rect class="px" x="180" y="180" width="20" height="20"/>
  <rect class="px" x="200" y="180" width="20" height="20"/>
  <rect class="px" x="220" y="180" width="20" height="20"/>
  <rect class="off" x="240" y="180" width="20" height="20"/>
  <rect class="off" x="260" y="180" width="20" height="20"/>
  <rect class="px" x="40" y="200" width="20" height="20"/>
  <rect class="px" x="60" y="200" width="20" height="20"/>
  <rect class="px" x="80" y="200" width="20" height="20"/>
  <rect class="px" x="100" y="200" width="20" height="20"/>
  <rect class="px" x="120" y="200" width="20" height="20"/>
  <rect class="px" x="140" y="200" width="20" height="20"/>
  <rect class="px" x="160" y="200" width="20" height="20"/>
  <rect class="px" x="180" y="200" width="20" height="20"/>
  <rect class="px" x="200" y="200" width="20" height="20"/>
  <rect class="px" x="220" y="200" width="20" height="20"/>
  <rect class="off" x="240" y="200" width="20" height="20"/>
  <rect class="off" x="260" y="200" width="20" height="20"/>
  <rect class="px" x="40" y="220" width="20" height="20"/>
  <rect class="px" x="60" y="220" width="20" height="20"/>
  <rect class="px" x="80" y="220" width="20" height="20"/>
  <rect class="px" x="100" y="220" width="20" height="20"/>
  <rect class="px" x="120" y="220" width="20" height="20"/>
  <rect class="px" x="140" y="220" width="20" height="20"/>
  <rect class="px" x="160" y="220" width="20" height="20"/>
  <rect class="px" x="180" y="220" width="20" height="20"/>
  <rect class="px" x="200" y="220" width="20" height="20"/>
  <rect class="px" x="220" y="220" width="20" height="20"/>
  <rect class="px" x="240" y="220" width="20" height="20"/>
  <rect class="off" x="260" y="220" width="20" height="20"/>
  <rect class="px" x="40" y="240" width="20" height="20"/>
  <rect class="px" x="60" y="240" width="20" height="20"/>
  <rect class="px" x="80" y="240" width="20" height="20"/>
  <rect class="px" x="100" y="240" width="20" height="20"/>
  <rect class="px" x="120" y="240" width="20" height="20"/>
  <rect class="px" x="140" y="240" width="20" height="20"/>
  <rect class="px" x="160" y="240" width="20" height="20"/>
  <rect class="px" x="180" y="240" width="20" height="20"/>
  <rect class="px" x="200" y="240" width="20" height="20"/>
  <rect class="px" x="220" y="240" width="20" height="20"/>
  <rect class="px" x="240" y="240" width="20" height="20"/>
  <rect class="off" x="260" y="240" width="20" height="20"/>
  <rect class="px" x="40" y="260" width="20" height="20"/>
  <rect class="px" x="60" y="260" width="20" height="20"/>
  <rect class="px" x="80" y="260" width="20" height="20"/>
  <rect class="px" x="100" y="260" width="20" height="20"/>
  <rect class="px" x="120" y="260" width="20" height="20"/>
  <rect class="px" x="140" y="260" width="20" height="20"/>
  <rect class="px" x="160" y="260" width="20" height="20"/>
  <rect class="px" x="180" y="260" width="20" height="20"/>
  <rect class="px" x="200" y="260" width="20" height="20"/>
  <rect class="px" x="220" y="260" width="20" height="20"/>
  <rect class="px" x="240" y="260" width="20" height="20"/>
  <rect class="off" x="260" y="260" width="20" height="20"/>
  <path d="M390,40 L390,280 L606,280 A216,216 0 0 0 390,64 Z" style="fill:var(--primary);stroke:var(--primary);stroke-width:1"/>
  <rect x="390" y="40" width="240" height="240" style="fill:none;stroke:var(--border);stroke-width:1.5"/>
  <text class="s" x="300" y="120">staircase of</text><text class="s" x="300" y="138">square pixels —</text><text class="s" x="300" y="156">no new detail</text><text class="s" x="645" y="120">curve redrawn</text><text class="s" x="645" y="138">from its</text><text class="s" x="645" y="156">equation —</text><text class="s" x="645" y="174">still sharp</text>
</svg>
:::

The size of a vector file depends on the **number and complexity of the objects**, not on the display size. A simple logo is tiny and stays tiny whether it is printed on a business card or on the side of a bus. However, vectors cannot easily represent a **photograph**: a photo contains millions of slightly different colours with no simple shapes, and describing it as objects would need an enormous number of them. That is why cameras always produce bitmaps, while designers draw logos as vectors and convert them to bitmaps (for example PNG) only at the moment they are needed.

:::compare Bitmap vs vector images
| | Bitmap (raster) | Vector |
|---|---|---|
| Stored as | A grid of **pixels**, each with a binary colour code | **Objects / shapes** with mathematical properties (coordinates, colours, line widths) |
| Enlarging | Becomes **pixelated** — pixels are stretched | Stays **sharp** at any size — redrawn from the instructions |
| File size depends on | **Resolution × colour depth** | The **number and complexity of objects** |
| Typical file size | Large for photos | Usually small |
| Editing | Pixels can be edited one by one (retouching, filters) | Each object can be moved, resized or recoloured separately |
| Best for | **Photographs**, scans, realistic images with complex colours | **Logos, icons, diagrams, maps, fonts**, technical drawings |
| Formats | BMP, PNG, JPEG, GIF | SVG, AI, EPS, PDF drawings |
:::

## Choosing the right type

When an exam question asks which type to use, link the choice to the **content** of the image and how it will be **used**. A photo of the graduation ceremony must be a bitmap, because it is captured by a camera sensor and full of complex colour; it should be saved as JPEG for the website and kept at high resolution for printing. The school logo should be a vector, because it is made of a few shapes and flat colours and must appear sharp on a tiny website icon, a letterhead and a large banner from the same file. A screenshot of a program for a user guide is a bitmap with large flat areas, so PNG (lossless) keeps the text crisp.

:::warning Common mistakes
- Forgetting to **divide by 8** to change bits into bytes, or dividing by 1024 instead of 8 at that step.
- Using the number of **colours** (256) instead of the **colour depth** (8 bits) in the formula.
- Mixing 1000 and 1024 in one calculation, or rounding in the middle of a calculation.
- Saying that doubling the width and height **doubles** the file size — it multiplies it by **4**.
- Using **bytes** per second instead of **bits** per second when calculating transfer time.
- Saying lossless compression "removes unimportant data" — that describes **lossy**; lossless removes **no** data.
- Saying a vector image is made of "very small pixels". It is made of **shapes described mathematically**.
:::

# Exam practice: bitmap file size
@lo 11.1.1.6 11.1.1.5

:::example Exam-style questions with model answers
**Q: Calculate the file size in KB of a 1280 × 720 image with 24-bit colour. Show your working. [3]**
1280 × 720 × 24 = 22 118 400 bits (1); ÷ 8 = 2 764 800 bytes (1); ÷ 1024 = **2700 KB** (1).

**Q: A black-and-white (1-bit) image is 400 × 300 pixels. Calculate its size in bytes. [2]**
400 × 300 × 1 = 120 000 bits (1); ÷ 8 = **15 000 bytes** (1).

**Q: A 1600 × 1200 image has a file size of 5.5 MB. Calculate its colour depth. [3]**
5.5 × 1024 × 1024 × 8 = 46 137 344 bits (1); 1600 × 1200 = 1 920 000 pixels (1); 46 137 344 ÷ 1 920 000 ≈ 24.03 → **24 bits** (1).

**Q: An image file is 6 MB. Its width and height are both halved and its colour depth is changed from 24 bits to 8 bits. Calculate the new file size. [2]**
Halving width and height → ¼ of the pixels → 1.5 MB (1); 24 → 8 bits → ⅓ → **0.5 MB** (1).

**Q: Explain why a JPEG photo cannot be restored to its original quality. [2]**
JPEG uses **lossy** compression (1), which **permanently removes** data/detail to make the file smaller, so the removed data cannot be recovered (1).

**Q: A company logo will be used on business cards and on large banners. Explain why it should be stored as a vector graphic. [3]**
A vector is stored as shapes with mathematical properties (1), so it is **redrawn** at any size (1) and stays **sharp / does not pixelate** on the large banner, while the file stays small (1).
:::

:::warning Common mistakes in exam answers
- Not showing working — in calculation questions most marks are for the **method**, so write every step with its unit.
- Giving the final answer in the wrong unit (bytes when KB were asked).
- Writing "compression makes the image smaller" without saying **lossy or lossless** and what happens to the data.
:::

:::steps Check yourself
- Write the formula for the size of a bitmap image and explain why it works.
- Convert 3 145 728 bytes into KB and MB.
- Calculate the size in MB of a 1920 × 1080 image with 24-bit colour.
- A 1000 × 800 image is 781.25 KB. What is its colour depth?
- What happens to the file size if the width and height are both halved? If the colour depth goes from 4 to 16 bits?
- Describe the difference between lossless and lossy compression, with a format for each.
- Compare bitmap and vector images, and choose one for a photo and one for a logo.
:::
