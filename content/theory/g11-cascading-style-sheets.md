---
summary: Inline, internal and external CSS and how they compare, CSS syntax, selectors, the cascade and specificity, the box model, text, colour and layout properties, and using CSS to design a consistent, responsive website.
---
# What CSS is and why it is used
@lo 11.5.3.5

:::definition CSS (Cascading Style Sheets)
A style-sheet language that describes **how HTML elements are displayed** — colours, fonts, sizes, spacing, borders, backgrounds and layout. HTML gives the **structure and content**; CSS gives the **presentation**.
:::

:::cards
### Why separate style from content?
- The **same HTML** can be shown with different designs (e.g. for screens and for printing).
- One style sheet can control the look of **a whole website** — consistent design.
- Changes are **quick**: edit one rule instead of every page.
- HTML files are **smaller and cleaner**, so they are easier to read and maintain.
- Pages load faster because an external style sheet is **cached** by the browser.
### What CSS can control
- Text: font, size, colour, weight, alignment, decoration.
- Boxes: width, height, margin, padding, border, rounded corners.
- Backgrounds: colours, images, gradients.
- Layout: positioning, columns, flexbox, grid.
- Effects: hover states, transitions, responsive design for phones.
:::

# The three ways to add CSS
@lo 11.5.3.5

:::cards
### Inline CSS
Written in the **`style` attribute** of **one element**.
`<p style="color: red; font-weight: bold;">Warning</p>`
### Internal (embedded) CSS
Written in a **`<style>` element** in the **`<head>`** of **one page**.
`<style> p { color: red; } </style>`
### External CSS
Written in a **separate `.css` file** that is **linked** to many pages with `<link>` in the `<head>`.
`<link rel="stylesheet" href="style.css">`
:::

```html | All three types in one page
<!DOCTYPE html>
<html>
<head>
  <title>Book Club</title>
  <link rel="stylesheet" href="style.css">          <!-- external -->
  <style>                                             <!-- internal -->
    h1 { color: navy; }
  </style>
</head>
<body>
  <h1>Book Club</h1>
  <p style="color: crimson;">Meeting cancelled!</p>   <!-- inline -->
  <p>See you next week.</p>
</body>
</html>
```

```css | style.css — the external file
body { font-family: Verdana, sans-serif; background-color: #fafafa; }
p    { font-size: 16px; }
```

:::compare Comparing CSS implementation types
| Criterion | Inline | Internal | External |
|---|---|---|---|
| Where it is written | `style` attribute of an element | `<style>` in the `<head>` | Separate `.css` file |
| Applies to | **One element** | **One page** | **Every page** that links the file |
| Maintenance | Hard — every element must be changed | Medium — each page must be changed | **Easy** — change **one file** to restyle the whole site |
| Consistency across a site | Poor | Poor | **Excellent** |
| Loading | Makes the HTML larger | Makes the HTML larger | Downloaded **once** and **cached** for all pages |
| Priority when rules conflict | **Highest** | Depends on order (later wins) | Depends on order (later wins) |
| Separation of style and content | None | Partial | **Complete** |
| Best for | A quick one-off change, testing, e-mails | A single page with a unique design | **Multi-page websites** |
:::

:::cards
### Advantages of external CSS
- One file controls the **whole site** → consistent design.
- Change the design of hundreds of pages by editing **one file**.
- Smaller HTML pages; the CSS file is **cached**, so later pages load faster.
- Different style sheets can be linked for different devices / printing.
### Disadvantages of external CSS
- An **extra file** must be downloaded before the page is styled.
- If the file is missing or the link is wrong, the page appears **unstyled**.
- For a single small page it may be unnecessary.
:::

:::tip Answering "compare CSS implementation types"
Give **both sides** each time: "*External CSS is stored in a separate file that **all pages** link to, so the whole site can be changed by editing **one file**, **whereas** inline CSS must be written in **every element**, which is slow to change and makes pages inconsistent.*"
:::

# CSS syntax and selectors
@lo 11.5.3.6

```css | The parts of a CSS rule
/* selector   declaration block                    */
   h1       { color: navy; text-align: center; }
/*            property: value;  property: value;   */
```

:::compare Selectors
| Selector | Example | Selects |
|---|---|---|
| **Element (type)** | `p { }` | Every `<p>` element |
| **Class** | `.note { }` | Every element with `class="note"` — can be **reused** many times |
| **ID** | `#logo { }` | The **one** element with `id="logo"` — must be **unique** |
| **Grouping** | `h1, h2, h3 { }` | All three heading levels |
| **Descendant** | `nav a { }` | Links **inside** a `<nav>` |
| **Child** | `ul > li { }` | `<li>` that are direct children of `<ul>` |
| **Pseudo-class** | `a:hover { }`, `li:first-child { }` | An element in a particular **state** or position |
| **Universal** | `* { }` | Every element |
| **Attribute** | `input[type="text"] { }` | Inputs whose type is text |
:::

:::html Classes, IDs and hover | 230
<h1 id="title">Book Club</h1>
<p class="note">Meeting on Monday.</p>
<p>Bring a book you liked.</p>
<p class="note">New members welcome!</p>
<a href="#">Hover over me</a>
---css---
body { font-family: Arial, sans-serif; padding: 10px; }
#title { color: #1f4fd8; border-bottom: 3px solid #1f4fd8; padding-bottom: 4px; }
.note { background: #fdf3e2; border-left: 5px solid #b45309; padding: 6px 10px; }
a { color: #1f4fd8; font-weight: bold; }
a:hover { color: white; background: #1f4fd8; padding: 2px 6px; border-radius: 4px; }
:::

:::warning Syntax errors in CSS
- A **colon** separates the property and the value: `color: red` (not `color = red`).
- A **semicolon** ends each declaration: `color: red; font-size: 14px;`.
- Rules are written in **curly braces** `{ }`.
- A class selector starts with `.`, an ID selector with `#`.
- The browser simply **ignores** a rule it cannot understand — no error message is shown.
:::

# The cascade, specificity and inheritance
@lo 11.5.3.5 11.5.3.6

When several rules set the same property of the same element, the browser must decide which one **wins** — this is the **cascade**.

:::steps How the browser chooses the winning rule
- **Importance** — a declaration marked `!important` wins (use rarely).
- **Specificity** — the more **specific** selector wins: **inline style > ID > class / pseudo-class > element**.
- **Order** — if specificity is equal, the rule that comes **later** wins (so a `<style>` block placed after the `<link>` overrides the external file).
:::

:::compare Specificity examples
| Rule | Specificity | Wins against |
|---|---|---|
| `style="color: green"` (inline) | Highest | Everything below |
| `#intro { color: blue; }` | ID | Class and element rules |
| `.lead { color: orange; }` | Class | Element rules |
| `p { color: gray; }` | Element | — |
:::

:::example Which colour is the paragraph?
```html
<p id="intro" class="lead">Welcome</p>
```
Rules: `p { color: gray; }`, `.lead { color: orange; }`, `#intro { color: blue; }` → the text is **blue**, because the **ID selector is the most specific**. If the paragraph also had `style="color: green"`, it would be **green** (inline wins).
:::

:::definition Inheritance
Some properties — mostly **text** properties such as `color`, `font-family` and `font-size` — are **inherited** by child elements. Setting `body { font-family: Arial; }` makes every element on the page use Arial unless a more specific rule changes it. Box properties such as `border`, `margin` and `width` are **not** inherited.
:::

# The box model and common properties
@lo 11.5.3.6

:::ascii The CSS box model — every element is a rectangular box
+---------------------------------------------+
|                 margin                      |   space OUTSIDE the border
|   +-------------------------------------+   |
|   |             border                  |   |
|   |   +-----------------------------+   |   |
|   |   |          padding            |   |   |   space INSIDE the border
|   |   |   +---------------------+   |   |   |
|   |   |   |   content (text,    |   |   |   |   width x height
|   |   |   |   images)           |   |   |   |
|   |   |   +---------------------+   |   |   |
|   |   +-----------------------------+   |   |
|   +-------------------------------------+   |
+---------------------------------------------+
:::

:::compare Text and font properties
| Property | Example | Effect |
|---|---|---|
| `color` | `color: navy;` | Text colour |
| `font-family` | `font-family: Arial, sans-serif;` | Font (with a fallback) |
| `font-size` | `font-size: 18px;` / `1.2em` | Size of the text |
| `font-weight` | `font-weight: bold;` | Thickness |
| `font-style` | `font-style: italic;` | Italic text |
| `text-align` | `text-align: center;` | left, right, center, justify |
| `text-decoration` | `text-decoration: underline;` / `none` | Underline, line-through, remove link underline |
| `line-height` | `line-height: 1.5;` | Space between lines |
:::

:::compare Box, background and layout properties
| Property | Example | Effect |
|---|---|---|
| `background-color` | `background-color: #e8f5e9;` | Background colour |
| `background-image` | `background-image: url("bg.jpg");` | Background picture |
| `width` / `height` | `width: 300px;` / `width: 50%;` | Size of the content box |
| `margin` | `margin: 10px auto;` | Space outside; `auto` centres a block horizontally |
| `padding` | `padding: 8px 12px;` | Space inside the border |
| `border` | `border: 2px solid #333;` | Width, style (solid, dashed, dotted), colour |
| `border-radius` | `border-radius: 8px;` | Rounded corners |
| `display` | `display: none;` / `block` / `inline` / `flex` | How the box is laid out (or hidden) |
| `float` | `float: right;` | Moves a box to the side; text wraps around |
| `position` | `position: fixed; top: 0;` | Places a box exactly (e.g. a header that stays at the top) |
:::

:::compare Colour and size units
| Kind | Examples |
|---|---|
| Colour names | `red`, `navy`, `darkgreen` |
| Hexadecimal | `#ff0000` (red), `#1f4fd8`, short form `#fff` |
| RGB | `rgb(255, 0, 0)`, with transparency `rgba(0, 0, 0, 0.5)` |
| Absolute size | `px` (pixels) |
| Relative size | `%` (of the parent), `em` / `rem` (of the font size), `vw` / `vh` (of the window) |
:::

# Designing a website with CSS
@lo 11.5.3.6

```css | style.css — one external style sheet for a whole school-club site
* { box-sizing: border-box; }
body   { font-family: Verdana, sans-serif; margin: 0; background-color: #fafafa; color: #222; }
header { background-color: #1f4fd8; color: white; padding: 16px; text-align: center; }
nav    { background-color: #e8eefc; padding: 8px; }
nav a  { display: inline-block; padding: 8px 12px; color: #1f4fd8; text-decoration: none; font-weight: bold; }
nav a:hover { background-color: #1f4fd8; color: white; border-radius: 4px; }
.container { display: flex; gap: 12px; padding: 12px; }
.card  { flex: 1; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
footer { text-align: center; font-size: 12px; color: #666; padding: 12px; }

@media (max-width: 600px) {          /* phones: cards one under another */
  .container { flex-direction: column; }
}
```

:::html The site design in the browser | 300
<header><h2 style="margin:4px">Robotics Club</h2></header>
<nav><a href="#">Home</a><a href="#">Projects</a><a href="#">Join</a></nav>
<div class="container">
  <div class="card"><h3>Next meeting</h3><p>Thursday 15:00, room 204.</p></div>
  <div class="card"><h3>Competition</h3><p>Regional final on 12 May.</p></div>
</div>
<footer>© 2026 NIS Robotics Club</footer>
---css---
* { box-sizing: border-box; }
body   { font-family: Verdana, sans-serif; margin: 0; padding: 0; background-color: #fafafa; color: #222; }
header { background-color: #1f4fd8; color: white; padding: 8px; text-align: center; }
nav    { background-color: #e8eefc; padding: 6px; }
nav a  { display: inline-block; padding: 6px 12px; color: #1f4fd8; text-decoration: none; font-weight: bold; }
nav a:hover { background-color: #1f4fd8; color: white; border-radius: 4px; }
.container { display: flex; gap: 12px; padding: 12px; }
.card  { flex: 1; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
.card h3 { margin: 0 0 6px; }
footer { text-align: center; font-size: 12px; color: #666; padding: 8px; }
:::

:::cards
### Flexbox for layout
`display: flex;` places child boxes **in a row** (or a column with `flex-direction: column;`). `gap` sets the space between them, `justify-content` and `align-items` align them. It is the easiest way to build menus and card layouts.
### Responsive design
A **media query** `@media (max-width: 600px) { … }` applies rules only on small screens, so the same page works on phones and computers. Use relative widths (`%`) and the viewport meta tag `<meta name="viewport" content="width=device-width, initial-scale=1">`.
:::

:::compare Good design practice with CSS
| Practice | Why |
|---|---|
| Use **one external style sheet** for all pages | Consistent look; easy to change |
| Use **classes** for repeated styles, IDs only for unique elements | Reusable, tidy code |
| Limit the number of fonts and colours | Professional, readable design |
| Ensure good **contrast** between text and background | Readability and accessibility |
| Style links and their **hover** state | Users can see what is clickable |
| Test on **different screen sizes and browsers** | The design works for every user |
:::

# Exam practice and summary
@lo 11.5.3.5 11.5.3.6

:::example Exam-style answers
**Q: Create a CSS rule for changing the colour of the heading text to red and underlining it. [3]**
```css
h1 {
    color: red;
    text-decoration: underline;
}
```
`h1` (1), `color: red;` (1), `text-decoration: underline;` (1).

**Q: Compare inline and external CSS. [2]**
Inline CSS is written in the **style attribute of a single element**, **whereas** external CSS is in a **separate file linked to every page** (1). External CSS lets the whole site be updated by **changing one file**, whereas inline styles must be changed **in every element** (1).

**Q: Write the HTML code to link the style sheet `site.css` to a page. [1]**
`<link rel="stylesheet" href="site.css">` inside the `<head>`.

**Q: Write a CSS rule so that links in the navigation bar are not underlined and turn white on a blue background when the mouse is over them. [3]**
`nav a { text-decoration: none; }` (1) `nav a:hover { color: white; background-color: blue; }` (selector 1, declarations 1).
:::

:::warning Common mistakes
- Using `=` instead of `:` or forgetting `;` between declarations.
- Writing `.` before an ID or `#` before a class.
- Using the **same ID** on several elements — use a **class**.
- Putting the `<link>` or `<style>` in the `<body>` instead of the `<head>`.
- Saying external CSS has the highest priority — **inline** styles override it.
- Writing `colour` (British spelling) — CSS uses **`color`**.
:::

:::steps Check yourself
- Name the three types of CSS and write an example of each.
- Give three ways in which external CSS is better than inline CSS for a website.
- What is the difference between a class selector and an ID selector?
- Which rule wins: `p {}`, `.note {}`, `#main {}` or an inline style? Why?
- Draw the box model and label margin, border, padding and content.
- Write CSS for a navigation bar whose links change colour on hover.
- What does a media query do?
:::
