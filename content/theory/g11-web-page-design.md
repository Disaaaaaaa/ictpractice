---
summary: The structure of a web page and its common elements, building an interface with HTML and CSS, and creating HTML forms for data entry — text boxes, radio buttons, check boxes, drop-down lists, buttons, labels and the GET and POST methods.
---
# The structure of a web page
@lo 11.5.3.1

A web page is written in **HTML** (HyperText Markup Language). HTML uses **tags** in angle brackets to mark up the **structure and content**; most tags come in pairs — an **opening tag** `<p>` and a **closing tag** `</p>`. **CSS** (Cascading Style Sheets) describes how the elements **look**.

```html | The skeleton of every HTML page
<!DOCTYPE html>                 <!-- tells the browser this is HTML5 -->
<html lang="en">                <!-- root element -->
<head>                          <!-- information ABOUT the page (not shown) -->
    <meta charset="UTF-8">
    <title>School Library</title>          <!-- text on the browser tab -->
    <link rel="stylesheet" href="style.css">  <!-- external CSS file -->
</head>
<body>                          <!-- everything the user SEES -->
    <h1>Welcome to the School Library</h1>
    <p>Opening hours: 8:00–17:00</p>
</body>
</html>
```

:::compare Parts of an HTML document
| Element | Purpose |
|---|---|
| `<!DOCTYPE html>` | Declares the document type (HTML5) |
| `<html>` | The root element that contains the whole page |
| `<head>` | Information about the page: title, character set, links to CSS, meta data for search engines |
| `<title>` | The title shown on the browser tab and in search results |
| `<meta>` | Extra information, e.g. `charset`, `viewport` for mobile screens, description |
| `<body>` | All the visible content of the page |
:::

:::definition Element, tag and attribute
An **element** is a part of the page, e.g. a paragraph: `<p>Hello</p>`. It is made of an **opening tag**, **content** and a **closing tag**. An **attribute** gives extra information inside the opening tag as `name="value"`: `<img src="logo.png" alt="School logo">`.
:::

# Common elements of a web page
@lo 11.5.3.1

:::ascii The typical layout of a web page (semantic elements)
+--------------------------------------------------+
|  <header>   logo, site name                       |
+--------------------------------------------------+
|  <nav>      Home | Books | Events | Contact       |
+-------------------------------+------------------+
|  <main>                       |  <aside>          |
|    <section> / <article>      |  related links,   |
|    headings, text, images,    |  adverts, news    |
|    tables, forms              |                   |
+-------------------------------+------------------+
|  <footer>   copyright, contacts, social links     |
+--------------------------------------------------+
:::

:::compare Structural (semantic) elements
| Element | Contains |
|---|---|
| `<header>` | Logo, site name, sometimes the navigation |
| `<nav>` | The main **navigation links** (menu) |
| `<main>` | The **main content** of the page (only one per page) |
| `<section>` | A group of related content with a heading |
| `<article>` | Independent content: a news story, blog post |
| `<aside>` | Side content: related links, adverts |
| `<footer>` | Copyright, contact details, links at the bottom |
| `<div>` | A general container with no special meaning (used for layout with CSS) |
| `<span>` | A general **inline** container for part of a line of text |
:::

:::compare Content elements
| Element | Purpose | Example |
|---|---|---|
| `<h1>` … `<h6>` | Headings, from most to least important | `<h1>News</h1>` |
| `<p>` | Paragraph | `<p>Text…</p>` |
| `<br>` | Line break (no closing tag) | `Line 1<br>Line 2` |
| `<hr>` | Horizontal line | `<hr>` |
| `<strong>`, `<em>` | Important (bold) and emphasised (italic) text | `<strong>Warning</strong>` |
| `<a href="…">` | **Hyperlink** to another page, file or place | `<a href="books.html">Books</a>` |
| `<img src="…" alt="…">` | Image; `alt` text is shown if the image cannot load and is read by screen readers | `<img src="cat.jpg" alt="A grey cat">` |
| `<ul>`, `<ol>`, `<li>` | Unordered (bullets) and ordered (numbered) lists and their items | `<ul><li>Milk</li></ul>` |
| `<table>`, `<tr>`, `<th>`, `<td>` | Table, row, header cell, data cell | see below |
:::

```html | Lists, a link, an image and a table
<h2>Top books this month</h2>
<ol>
    <li>Abai — Book of Words</li>
    <li>The Hobbit</li>
</ol>
<a href="https://example.com/catalogue" target="_blank">Open the full catalogue</a>
<img src="library.jpg" alt="Students reading in the library" width="300">

<table border="1">
    <tr><th>Day</th><th>Opening hours</th></tr>
    <tr><td>Monday</td><td>8:00–17:00</td></tr>
    <tr><td>Saturday</td><td>10:00–14:00</td></tr>
</table>
```

:::html What the browser shows | 260
<h2>Top books this month</h2>
<ol><li>Abai — Book of Words</li><li>The Hobbit</li></ol>
<a href="#">Open the full catalogue</a>
<table border="1" style="margin-top:10px;border-collapse:collapse">
<tr><th style="padding:4px 10px">Day</th><th style="padding:4px 10px">Opening hours</th></tr>
<tr><td style="padding:4px 10px">Monday</td><td style="padding:4px 10px">8:00–17:00</td></tr>
<tr><td style="padding:4px 10px">Saturday</td><td style="padding:4px 10px">10:00–14:00</td></tr>
</table>
---css---
body { font-family: Arial, sans-serif; padding: 8px; }
:::

:::tip Good structure
Use **one `<h1>`** per page, headings in order (`h1 → h2 → h3`), **semantic elements** instead of many `<div>`s, and **`alt` text** for every image. This helps search engines and users with **screen readers**.
:::

# Creating an interface with HTML and CSS
@lo 11.5.3.2

:::compare Three ways to add CSS
| Method | Where | Example | When to use |
|---|---|---|---|
| **Inline** | In the `style` attribute of one element | `<p style="color:red;">` | One-off change (avoid) |
| **Internal** | In a `<style>` element in the `<head>` | `<style> h1 { color: navy; } </style>` | Styles for one page |
| **External** | In a separate `.css` file linked with `<link>` | `<link rel="stylesheet" href="style.css">` | **Best** for a whole site — one file controls every page |
:::

:::cards
### CSS rule syntax
`selector { property: value; property: value; }`
`h1 { color: navy; text-align: center; }`
### Selectors
- **Element**: `p { … }` — every paragraph.
- **Class**: `.note { … }` used with `class="note"` — can repeat on the page.
- **ID**: `#menu { … }` used with `id="menu"` — must be **unique**.
### Common properties
`color`, `background-color`, `font-family`, `font-size`, `font-weight`, `text-align`, `text-decoration`, `width`, `height`, `margin` (outside space), `padding` (inside space), `border`, `border-radius`, `display`.
:::

```html | A simple page interface
<!DOCTYPE html>
<html>
<head>
  <title>Eco Club</title>
  <style>
    body   { font-family: Arial, sans-serif; margin: 0; }
    header { background-color: #2e7d32; color: white; text-align: center; padding: 12px; }
    nav a  { margin: 0 10px; color: #2e7d32; font-weight: bold; text-decoration: none; }
    .card  { border: 1px solid #ccc; border-radius: 8px; padding: 10px; margin: 10px; }
    footer { font-size: 12px; text-align: center; color: gray; }
  </style>
</head>
<body>
  <header><h1>Eco Club</h1></header>
  <nav><a href="#">Home</a><a href="#">Events</a><a href="#">Join</a></nav>
  <main>
    <section class="card">
      <h2>Next event</h2>
      <p>Tree planting on <strong>Saturday</strong> at 10:00.</p>
    </section>
  </main>
  <footer>© 2026 NIS Eco Club</footer>
</body>
</html>
```

:::html The page in the browser | 250
<header><h1>Eco Club</h1></header>
<nav><a href="#">Home</a><a href="#">Events</a><a href="#">Join</a></nav>
<main><section class="card"><h2>Next event</h2><p>Tree planting on <strong>Saturday</strong> at 10:00.</p></section></main>
<footer>© 2026 NIS Eco Club</footer>
---css---
body   { font-family: Arial, sans-serif; margin: 0; }
header { background-color: #2e7d32; color: white; text-align: center; padding: 6px; }
header h1 { margin: 6px; }
nav    { padding: 8px; }
nav a  { margin: 0 10px; color: #2e7d32; font-weight: bold; text-decoration: none; }
.card  { border: 1px solid #ccc; border-radius: 8px; padding: 10px; margin: 10px; }
footer { font-size: 12px; text-align: center; color: gray; }
:::

:::compare Principles of good interface design
| Principle | Meaning |
|---|---|
| **Consistency** | Same layout, colours, fonts and navigation on every page |
| **Clear navigation** | The user can always find the menu and get back to the home page |
| **Readability** | Good contrast between text and background, readable font size |
| **Simplicity** | Not too much text, colour or animation on one page |
| **Accessibility** | `alt` text, labels on form fields, works with keyboard and screen readers |
| **Responsive** | Works on phones and computers (`<meta name="viewport" …>`, flexible widths) |
:::

# HTML forms for data entry
@lo 11.5.3.4

:::definition HTML form
A part of a web page that **collects data from the user** — text, choices, passwords, files — and **sends it to a server** (or a script) for processing. It is created with the `<form>` element and contains **input controls**.
:::

:::cards
### Why forms are used
- To **get data for processing** — registration, log-in, orders, surveys, search.
- To **collect user input** in a structured way.
- To **mimic paper forms** and database records.
- **Validation** (required fields, number ranges) reduces errors before the data is sent.
### The `<form>` element
`<form action="register.php" method="post">`
- `action` — the **file / URL** that will process the data.
- `method` — **how** the data is sent: `get` or `post`.
- Every control needs a **`name`** — it becomes the key of the data sent (e.g. `email=ali@mail.kz`).
:::

:::compare Form controls
| Control | HTML | Use |
|---|---|---|
| Text box | `<input type="text" name="surname">` | One line of text |
| Password | `<input type="password" name="pwd">` | Characters are hidden |
| E-mail / number / date | `<input type="email">`, `<input type="number" min="1" max="12">`, `<input type="date">` | Browser checks the format / range |
| **Radio buttons** | `<input type="radio" name="gender" value="f">` | Choose **only one** option — all buttons in the group have the **same `name`** |
| **Check boxes** | `<input type="checkbox" name="club" value="chess">` | Choose **zero or more** options |
| Drop-down list | `<select name="grade"><option value="11">Grade 11</option></select>` | Choose one from a long list, saves space |
| Text area | `<textarea name="comment" rows="4" cols="30"></textarea>` | Several lines of text |
| Label | `<label for="surname">Surname:</label>` | Text for a control; `for` matches the control's `id` (click the label to select it) |
| Submit button | `<input type="submit" value="Register">` or `<button type="submit">Go</button>` | Sends the data to the `action` |
| Reset button | `<input type="reset" value="Clear">` | Clears the form |
:::

```html | A registration form
<form action="register.php" method="post">
    <label for="name">Full name:</label>
    <input type="text" id="name" name="fullname" placeholder="e.g. Aruzhan Bekova" required><br>

    <label for="email">E-mail:</label>
    <input type="email" id="email" name="email" required><br>

    <label for="pwd">Password:</label>
    <input type="password" id="pwd" name="password" minlength="8"><br>

    Gender:
    <input type="radio" id="f" name="gender" value="female"><label for="f">Female</label>
    <input type="radio" id="m" name="gender" value="male"><label for="m">Male</label><br>

    Clubs:
    <input type="checkbox" name="club" value="robotics"> Robotics
    <input type="checkbox" name="club" value="chess"> Chess<br>

    <label for="grade">Grade:</label>
    <select id="grade" name="grade">
        <option value="11">Grade 11</option>
        <option value="12">Grade 12</option>
    </select><br>

    <textarea name="about" rows="3" cols="30" placeholder="About you"></textarea><br>
    <input type="submit" value="Register">
    <input type="reset" value="Clear">
</form>
```

:::html The form in the browser | 330
<form>
<label for="name">Full name:</label> <input type="text" id="name" placeholder="e.g. Aruzhan Bekova"><br>
<label for="email">E-mail:</label> <input type="email" id="email"><br>
<label for="pwd">Password:</label> <input type="password" id="pwd"><br>
Gender: <input type="radio" id="f" name="gender"><label for="f">Female</label>
<input type="radio" id="m" name="gender"><label for="m">Male</label><br>
Clubs: <input type="checkbox"> Robotics <input type="checkbox"> Chess<br>
<label for="grade">Grade:</label> <select id="grade"><option>Grade 11</option><option>Grade 12</option></select><br>
<textarea rows="3" cols="30" placeholder="About you"></textarea><br>
<input type="submit" value="Register"> <input type="reset" value="Clear">
</form>
---css---
body { font-family: Arial, sans-serif; padding: 8px; line-height: 2; }
input[type=text], input[type=email], input[type=password] { width: 180px; }
:::

:::compare GET vs POST
| | `method="get"` | `method="post"` |
|---|---|---|
| Where the data goes | Added to the **URL**: `search.php?q=books&page=2` | In the **body** of the HTTP request — not visible in the URL |
| Visible / bookmarkable | Yes — can be bookmarked and shared | No |
| Security | **Not for passwords** or personal data (stored in history, logs) | Better for passwords and personal data (use HTTPS as well) |
| Amount of data | Limited by URL length | Large amounts, files |
| Typical use | Searches, filters | Registration, log-in, orders, uploads |
:::

:::warning Radio buttons
Radio buttons only work as a group (one choice) when they **all have the same `name`**. Give each a different **`value`** so the server knows which was chosen. Check boxes can share a name, but more than one can be ticked.
:::

:::compare Built-in validation attributes
| Attribute | Effect |
|---|---|
| `required` | The field cannot be left empty |
| `min`, `max` | Range for numbers / dates |
| `minlength`, `maxlength` | Length of text |
| `pattern` | The text must match a pattern, e.g. `pattern="[0-9]{6}"` |
| `type="email"` | The browser checks for an e-mail format |
:::

# Exam practice and summary
@lo 11.5.3.1 11.5.3.2 11.5.3.4

:::example Exam-style answers
**Q: Complete the fragment of HTML code for the Gender options of a registration form. [3]**
```html
<input type="radio" name="gender" value="male"> Male
<input type="radio" name="gender" value="female"> Female
```
`<input` for each element (1), `type="radio"` (1), the **same** `name` for each element (1).

**Q: Write the attributes for the tag `<form>` to send data from the form using the GET method. [2]**
`<form action="process.php" method="GET">` — `action` with a file name (1), `method="GET"` (1).

**Q: Write the code to create a text box for the user's city with a hint inside it. [2]**
`<input type="text" name="city" placeholder="Enter your city">` — `type="text"` (1), `name` and `placeholder` (1).

**Q: Give one argument for using HTML forms in web applications. [1]**
To **collect user input** / to get data for processing / to mimic paper or database forms.
:::

:::warning Common mistakes
- Forgetting the **closing tag** (`</p>`, `</form>`, `</select>`) or nesting tags in the wrong order.
- Giving radio buttons **different names** — then the user can select all of them.
- Forgetting the **`name`** attribute — the data from that field is **not sent**.
- Using `GET` for a password — it appears in the URL.
- Putting visible content in the `<head>`.
- Writing CSS without `:` and `;` (`color red` instead of `color: red;`).
:::

:::steps Check yourself
- Write the skeleton of an HTML5 page from memory.
- Name the semantic elements of a page layout and what each contains.
- What is the difference between an element, a tag and an attribute?
- Write the HTML for an image with alternative text and a link that opens another page.
- What are the three ways of adding CSS, and which is best for a whole website?
- Write a form with a text box, two radio buttons, a drop-down list and a submit button.
- Compare the GET and POST methods.
:::
