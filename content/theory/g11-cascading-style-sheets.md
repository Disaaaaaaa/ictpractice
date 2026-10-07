---
summary: Inline, internal and external CSS and when to use each, CSS syntax, selectors and the most useful properties for designing a website.
---
# Ways to add CSS to a page
@lo 11.5.3.5

:::definition CSS (Cascading Style Sheets)
A language that describes **how HTML elements are displayed**: colours, fonts, sizes, spacing and layout. Separating style from content makes websites easier to maintain.
:::

:::cards
### Inline CSS
Written in the `style` attribute of one element.
`<p style="color: red;">Warning</p>`
### Internal (embedded) CSS
Written in a `<style>` element in the `<head>` of **one page**.
`<style> p { color: red; } </style>`
### External CSS
Written in a separate **.css file** linked to **many pages**.
`<link rel="stylesheet" href="style.css">`
:::

:::compare Comparing the three types
| | Inline | Internal | External |
|---|---|---|---|
| Applies to | One element | One page | Every page that links the file |
| Maintenance | Hard — change every element | Medium — change each page | Easy — change one file to restyle the whole site |
| Consistency across a site | Poor | Poor | Excellent |
| Page loading | Increases HTML size | Increases HTML size | File is downloaded once and **cached** |
| Priority (specificity) | Highest | Middle | Lowest (if same selector) |
| Best for | A quick one-off change or testing | A single page with a unique style | Multi-page websites |
:::

:::callout info Why "cascading"?
When several rules apply to the same element, the browser decides which wins: **inline** beats **internal/external**, a more **specific** selector beats a general one, and a **later** rule beats an earlier one with the same specificity.
:::

:::tip
For "compare CSS implementation types", the key point is **external CSS = one file controls the whole site** (consistent, easy to update, cached), while **inline CSS** must be repeated in every element.
:::

# Using CSS to design a website
@lo 11.5.3.6

## Syntax

```css | A CSS rule
selector {
  property: value;
  property: value;
}

h1 { color: #1f4fd8; font-size: 28px; }
```

:::compare Selectors
| Selector | Example | Selects |
|---|---|---|
| Element | `p { }` | All `<p>` elements |
| Class | `.note { }` | Elements with `class="note"` (can be reused) |
| ID | `#logo { }` | The one element with `id="logo"` |
| Descendant | `nav a { }` | Links inside `<nav>` |
| Grouping | `h1, h2 { }` | Both `h1` and `h2` |
| Pseudo-class | `a:hover { }` | A link when the mouse is over it |
:::

:::compare Useful properties
| Property | Example | Effect |
|---|---|---|
| `color` | `color: navy;` | Text colour |
| `background-color` | `background-color: #f0f0f0;` | Background colour |
| `font-family` / `font-size` | `font-family: Arial; font-size: 16px;` | Font and size |
| `font-weight` / `text-align` | `font-weight: bold; text-align: center;` | Boldness, alignment |
| `margin` / `padding` | `margin: 10px; padding: 8px 12px;` | Space outside / inside the border |
| `border` | `border: 2px solid black;` | Border width, style, colour |
| `width` / `height` | `width: 50%;` | Size of the box |
| `display` | `display: flex;` | Layout model (block, inline, flex, grid, none) |
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

## A simple external style sheet for a whole site

```css | style.css
body   { font-family: Verdana, sans-serif; margin: 0; background: #fafafa; }
header { background: #1f4fd8; color: #fff; padding: 16px; }
nav a  { display: inline-block; padding: 8px 12px; color: #1f4fd8; }
nav a:hover { background: #e8eefc; }
.card  { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin: 12px; }
footer { text-align: center; font-size: 12px; color: #666; padding: 12px; }
```

:::warning
An **ID** must be unique on a page; use a **class** for styles that repeat. Remember the semicolon after each declaration and the colon between property and value — missing ones are common errors in "find the mistake" questions.
:::
