---
summary: The structure of a web page, building an interface with HTML and CSS, and creating HTML forms for data entry.
---
# Structure of a web page
@lo 11.5.3.1

Every HTML document has the same skeleton. The `<head>` holds information **about** the page; the `<body>` holds what the user **sees**.

```html | Minimal HTML5 page
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My School Club</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header> … </header>
  <nav> … </nav>
  <main> … </main>
  <footer> … </footer>
</body>
</html>
```

:::compare Common structural (semantic) elements
| Element | Purpose |
|---|---|
| `<header>` | Top of the page: logo, site name, sometimes navigation |
| `<nav>` | Main navigation links / menu |
| `<main>` | The unique main content of the page |
| `<section>` | A thematic group of content with a heading |
| `<article>` | Self-contained content, e.g. a news item or blog post |
| `<aside>` | Side content: adverts, related links, sidebar |
| `<footer>` | Bottom: contacts, copyright, extra links |
:::

:::compare Basic content elements
| Element | Use |
|---|---|
| `<h1>` … `<h6>` | Headings (one `<h1>` per page) |
| `<p>` | Paragraph |
| `<a href="…">` | Hyperlink |
| `<img src="…" alt="…">` | Image (`alt` = text for screen readers / if the image fails) |
| `<ul>`, `<ol>`, `<li>` | Unordered / ordered list and list items |
| `<table>`, `<tr>`, `<th>`, `<td>` | Table, row, header cell, data cell |
| `<div>`, `<span>` | Generic block / inline containers for styling |
:::

:::tip
Semantic elements (`header`, `nav`, `main`, `footer`) make the page easier to read for people, **search engines** and **screen readers** — a common "explain why" answer.
:::

# Creating an interface with HTML and CSS
@lo 11.5.3.2

HTML gives the page its **structure and content**; CSS controls its **appearance**: colours, fonts, spacing and layout.

:::html Page layout with header, navigation, content and footer | 300
<header><h1>Robotics Club</h1></header>
<nav><a href="#">Home</a><a href="#">Projects</a><a href="#">Join</a></nav>
<main>
  <section><h2>Next meeting</h2><p>Friday, 15:00, room 204.</p></section>
  <aside>Bring your laptop!</aside>
</main>
<footer>© 2026 NIS Robotics Club</footer>
---css---
body { margin: 0; font-family: Arial, sans-serif; }
header { background: #1f4fd8; color: white; padding: 12px 20px; }
header h1 { margin: 0; font-size: 22px; }
nav { background: #e8eefc; padding: 8px 20px; }
nav a { margin-right: 16px; color: #1f4fd8; text-decoration: none; font-weight: bold; }
main { display: flex; gap: 16px; padding: 16px 20px; }
section { flex: 3; }
aside { flex: 1; background: #fdf3e2; padding: 10px; border-radius: 6px; }
footer { background: #222; color: #ccc; text-align: center; padding: 8px; font-size: 13px; }
:::

## The CSS box model

Every element is a box made of **content**, **padding** (space inside the border), **border** and **margin** (space outside).

:::html The box model | 170
<div class="box">Content</div>
---css---
.box { width: 160px; padding: 20px; border: 4px solid #1f4fd8; margin: 24px; background: #e8eefc; text-align: center; font-family: Arial; }
body { background: #fdf3e2; margin: 0; }
:::

## Principles of good interface design

- **Consistency:** the same colours, fonts and navigation on every page.
- **Readability:** good contrast, readable font size, short paragraphs.
- **Clear navigation:** the user always knows where they are and how to go back.
- **Accessibility:** `alt` text for images, labels for form fields, keyboard access.
- **Responsive design:** the layout adapts to phones and computers.

# HTML forms for data entry
@lo 11.5.3.4

A **form** collects data from the user and sends it to the server for processing (e.g. by a PHP or Python script).

```html | A registration form
<form action="register.php" method="post">
  <label for="name">Full name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="age">Age:</label>
  <input type="number" id="age" name="age" min="14" max="18">

  <p>Grade:</p>
  <input type="radio" id="g11" name="grade" value="11"><label for="g11">11</label>
  <input type="radio" id="g12" name="grade" value="12"><label for="g12">12</label>

  <label for="club">Club:</label>
  <select id="club" name="club">
    <option value="robotics">Robotics</option>
    <option value="chess">Chess</option>
  </select>

  <input type="checkbox" id="agree" name="agree"><label for="agree">I agree to the rules</label>

  <textarea name="comment" rows="3"></textarea>
  <button type="submit">Register</button>
</form>
```

:::html The form rendered | 330
<form>
  <label>Full name: <input type="text" required></label><br>
  <label>Email: <input type="email"></label><br>
  <label>Age: <input type="number" min="14" max="18"></label><br>
  Grade: <label><input type="radio" name="g"> 11</label> <label><input type="radio" name="g"> 12</label><br>
  <label>Club: <select><option>Robotics</option><option>Chess</option></select></label><br>
  <label><input type="checkbox"> I agree to the rules</label><br>
  <textarea rows="2" cols="30" placeholder="Comment"></textarea><br>
  <button type="submit">Register</button>
</form>
---css---
body { font-family: Arial; font-size: 14px; }
label, input, select, textarea, button { margin: 4px 0; }
button { background: #1f4fd8; color: #fff; border: 0; padding: 6px 14px; border-radius: 4px; }
:::

:::compare Form controls
| Control | HTML | When to use |
|---|---|---|
| Text box | `<input type="text">` | Short free text (name) |
| Password | `<input type="password">` | Hidden characters |
| Number / email / date | `type="number"`, `"email"`, `"date"` | Built-in format checking |
| Radio buttons | `type="radio"` with the same `name` | Choose **exactly one** option |
| Check box | `type="checkbox"` | Choose **zero or more** options |
| Drop-down list | `<select>` + `<option>` | One option from a long list, saves space |
| Text area | `<textarea>` | Long text (comments) |
| Button | `<button type="submit">` | Sends the form |
:::

:::compare GET vs POST
| `method="get"` | `method="post"` |
|---|---|
| Data appears in the URL (`?name=Ali`) | Data is sent in the request body, not visible in the URL |
| Limited length; can be bookmarked | No practical length limit |
| For searches and non-sensitive data | For passwords, personal data, uploads |
:::

:::tip
The `name` attribute is what the server uses to read the value (`$_POST["name"]`). Radio buttons in one group **must share the same `name`**.
:::
