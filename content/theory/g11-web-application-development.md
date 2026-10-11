---
summary: Building a complete web application step by step — planning the pages and files, creating the interface with semantic HTML and an external CSS file, implementing site navigation, sending form data to a server-side script, processing it with validation, selection and iteration, saving results, reusing code with include, writing in a good programming style and testing the application.
---
# Planning a web application
@lo 11.5.3.2 11.5.3.3

A **web application** is a website whose pages **do something** with the user's data: register for events, place orders, show search results. It combines **HTML** (content and structure), **CSS** (presentation), **client-side JavaScript** (interactivity) and a **server-side script** such as **PHP** (processing and storing data, often in a **database**).

:::compare Site structure for a "School Events" application
| Page / file | Purpose |
|---|---|
| `index.php` | Home: list of upcoming events |
| `event.php?id=…` | Details of one event (the `id` is sent in the URL with GET) |
| `register.php` | Registration form and its processing |
| `admin.php` | Add / edit events (login required) |
| `header.php`, `footer.php` | Shared parts included on every page |
| `css/style.css` | One external style sheet for the whole site |
| `db.php` | Database connection, included where needed |
:::

:::mermaid How a request to a web application is handled
flowchart TB
  B[Browser: user fills in the form and clicks Submit] -->|HTTP POST with form data| S[Web server runs register.php]
  S --> V{Data valid?}
  V -- no --> E[Page with error messages sent back]
  V -- yes --> D[(Database: registration saved)]
  D --> R[Confirmation page sent back to the browser]
:::

:::cards
### Steps of development
- **Analyse** what the users need and list the pages.
- **Design** the layout (wireframe), navigation and forms.
- **Build** the HTML structure and the CSS style sheet.
- **Program** the scripts that process the data.
- **Test** with normal, boundary and erroneous data; fix errors.
- **Publish** the site on a web server.
### Separation of concerns
- **HTML** — what is on the page.
- **CSS** — how it looks.
- **JavaScript** — how it reacts in the browser.
- **PHP** — what happens on the server.
Keeping them in separate files makes the application easier to **maintain**.
:::

# Creating the interface with HTML and CSS
@lo 11.5.3.2

```html | index.php — a page built from semantic elements
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>School Events</title>
  <link rel="stylesheet" href="css/style.css">   <!-- one external style sheet -->
</head>
<body>
  <header><h1>School Events</h1></header>
  <nav class="menu">
    <a href="index.php" class="active">Events</a>
    <a href="register.php">Register</a>
    <a href="admin.php">Admin</a>
  </nav>
  <main>
    <section class="card">
      <h2>Robotics Day</h2>
      <p>Friday, 10:00 · Assembly hall</p>
      <a href="event.php?id=3">Read more</a>
    </section>
  </main>
  <footer>© 2026 NIS</footer>
</body>
</html>
```

```css | css/style.css
body   { margin: 0; font-family: Arial, sans-serif; background: #f5f7fb; }
header { background: #1f4fd8; color: white; padding: 12px 20px; }
.menu  { display: flex; gap: 4px; background: #163aa3; }
.menu a { color: white; padding: 10px 16px; text-decoration: none; }
.menu a:hover  { background: #2b5ce6; }
.menu a.active { background: white; color: #1f4fd8; font-weight: bold; }
.card  { background: white; margin: 16px; padding: 12px 16px; border-radius: 8px; }
footer { text-align: center; color: gray; font-size: 12px; padding: 12px; }
```

:::html What the page looks like | 260
<header><h1>School Events</h1></header>
<nav class="menu"><a class="active" href="#">Events</a><a href="#">Register</a><a href="#">Admin</a></nav>
<main><section class="card"><h2>Robotics Day</h2><p>Friday, 10:00 · Assembly hall</p><a href="#">Read more</a></section></main>
<footer>© 2026 NIS</footer>
---css---
body { margin: 0; font-family: Arial, sans-serif; background: #f5f7fb; }
header { background: #1f4fd8; color: white; padding: 4px 20px; }
header h1 { font-size: 22px; }
.menu { display: flex; gap: 4px; background: #163aa3; }
.menu a { color: white; padding: 10px 16px; text-decoration: none; }
.menu a:hover { background: #2b5ce6; }
.menu a.active { background: white; color: #1f4fd8; font-weight: bold; }
.card { background: white; margin: 16px; padding: 4px 16px 12px; border-radius: 8px; }
footer { text-align: center; color: gray; font-size: 12px; padding: 12px; }
:::

:::tip Principles of a good interface
**Consistency** — the same header, menu and colours on every page. **Clarity** — headings, short text, labelled form fields. **Feedback** — messages after every action. **Accessibility** — `alt` text, enough contrast, labels linked to inputs with `for` and `id`.
:::

# Implementing site navigation
@lo 11.5.3.3

:::compare Types of navigation
| Type | Example | Use |
|---|---|---|
| **Navigation (menu) bar** | Links at the top of every page | Main sections of the site |
| **Hyperlinks in the content** | "Read more" | Details of one item |
| **Breadcrumbs** | Home › Events › Robotics Day | Shows where the user is |
| **Buttons / form steps** | "Next", "Submit" | Moving through a task |
| **Internal links (anchors)** | `<a href="#rules">Rules</a>` → `<h2 id="rules">` | Jump to a section of a long page |
| **Drop-down menu** | Events ▸ Sports / Science | Many sub-pages |
:::

:::compare Absolute and relative links
| | Example | When |
|---|---|---|
| **Absolute** URL | `<a href="https://nis.edu.kz/news">` | A page on **another** website |
| **Relative** URL | `<a href="register.php">`, `<a href="../index.php">` | A page of the **same** site — still works if the site moves to another domain |
| **Anchor** | `<a href="#top">Back to top</a>` | A place on the **same** page |
| New tab | `<a href="…" target="_blank">` | External links |
:::

```php | Highlighting the current page in the menu
<?php $page = basename($_SERVER["PHP_SELF"]); ?>
<nav class="menu">
  <a href="index.php"    class="<?= $page == 'index.php'    ? 'active' : '' ?>">Events</a>
  <a href="register.php" class="<?= $page == 'register.php' ? 'active' : '' ?>">Register</a>
</nav>
```

# Processing form data in a script
@lo 11.5.4.6 11.5.4.1 11.5.4.4 11.5.4.3

```html | The registration form (in register.php)
<form action="register.php" method="post">
  <label for="name">Name:</label>
  <input id="name" name="name" required>
  <label for="grade">Grade:</label>
  <input id="grade" name="grade" type="number" min="7" max="12" required>
  <p>Events:</p>
  <label><input type="checkbox" name="events[]" value="Robotics"> Robotics</label>
  <label><input type="checkbox" name="events[]" value="Chess"> Chess</label>
  <label><input type="checkbox" name="events[]" value="Debate"> Debate</label>
  <button>Register</button>
</form>
```

```php | register.php — validation, selection and iteration
<?php
const FEE_PER_EVENT = 700;      // tenge
const FEE_THREE_OR_MORE = 1500;

$errors = [];
if ($_SERVER["REQUEST_METHOD"] === "POST") {           // the form was submitted
    $name   = trim($_POST["name"] ?? "");
    $grade  = (int)($_POST["grade"] ?? 0);
    $events = $_POST["events"] ?? [];                   // ticked check boxes → array

    // validation
    if ($name === "")                  $errors[] = "Enter your name.";
    if ($grade < 7 || $grade > 12)     $errors[] = "Grade must be 7–12.";
    if (count($events) === 0)          $errors[] = "Choose at least one event.";

    if (!$errors) {
        // selection: the fee depends on the number of events
        if (count($events) >= 3) {
            $fee = FEE_THREE_OR_MORE;
        } else {
            $fee = FEE_PER_EVENT * count($events);
        }

        // iteration: list the chosen events
        echo "<h2>Thank you, " . htmlspecialchars($name) . "!</h2><ul>";
        foreach ($events as $e) {
            echo "<li>" . htmlspecialchars($e) . "</li>";
        }
        echo "</ul><p>Fee: $fee ₸</p>";
    }
}
foreach ($errors as $err) {
    echo "<p class='error'>$err</p>";
}
?>
```

:::example Results for different inputs
| Input | Output |
|---|---|
| Name "Aruzhan", grade 11, Robotics + Chess | Thank you, Aruzhan! · Robotics, Chess · Fee: 1400 ₸ |
| Name "Timur", grade 9, all three events | Fee: **1500 ₸** (three or more) |
| Name empty, grade 13, no events | Three error messages |
:::

```php | Saving the registration in the database
<?php
include "db.php";                         // opens $conn
$stmt = mysqli_prepare($conn, "INSERT INTO Registration (Name, Grade, Events, Fee) VALUES (?, ?, ?, ?)");
$list = implode(", ", $events);           // array → "Robotics, Chess"
mysqli_stmt_bind_param($stmt, "sisi", $name, $grade, $list, $fee);
mysqli_stmt_execute($stmt);
?>
```

```javascript | Client-side check before the form is sent
document.querySelector("form").addEventListener("submit", function (e) {
  const ticked = document.querySelectorAll("input[name='events[]']:checked").length;
  if (ticked === 0) {
    e.preventDefault();                                   // do not send the form
    alert("Choose at least one event.");
  }
});
```

:::warning Security
- Use `htmlspecialchars()` when displaying user input, so that a user cannot inject HTML or JavaScript into the page (**XSS**).
- Use **prepared statements** for database queries (prevents **SQL injection**).
- Repeat every check on the **server** — client-side checks can be switched off.
:::

# Good programming style and testing
@lo 11.5.4.9

:::cards
### Style rules in a project
- Separate **content (HTML)**, **style (CSS file)** and **logic (PHP / JS)**.
- Put repeated code (header, navigation, database connection) in **one file** and `include` it on each page.
- **Meaningful names**, comments, indentation, **constants** instead of magic numbers.
- **Validate** all input and handle errors with clear messages.
### Why it matters
- Several people can work on the site at the same time.
- A change to the menu or the colours is made **once**.
- Errors are easier to find and fix; the code is easier to extend.
:::

```php | Reusing code with include
<?php include "header.php"; include "db.php"; ?>
<main> … page content … </main>
<?php include "footer.php"; ?>
```

:::compare Test plan for the registration page
| Test | Type | Data | Expected result |
|---|---|---|---|
| 1 | Normal | Aruzhan, 11, Robotics + Chess | Fee 1400 ₸, events listed |
| 2 | Boundary | Grade 7 and grade 12 | Accepted |
| 3 | Boundary | Exactly 3 events | Fee 1500 ₸ |
| 4 | Erroneous | Grade 13 | "Grade must be 7–12." |
| 5 | Erroneous | No event ticked | "Choose at least one event." |
| 6 | Erroneous | Name `<b>Hi</b>` | Shown as text, not bold (htmlspecialchars) |
| 7 | Navigation | Click every menu link | Correct page opens; active link highlighted |
:::

# Exam practice and summary
@lo 11.5.3.2 11.5.3.3 11.5.4.6 11.5.4.9

:::example Exam-style answers
**Q: Write HTML for a navigation bar with links to index.php and register.php. [2]**
`<nav>` with `<a href="index.php">Home</a>` (1) and `<a href="register.php">Register</a>` (1).

**Q: Explain why the site uses one external CSS file. [2]**
All pages are styled from **one file**, so the design is **consistent** (1) and a change is made **once** for the whole site (1).

**Q: Write PHP that outputs "Free" if the number of events is 0, otherwise the fee of 700 per event. [3]**
`if (count($events) == 0)` (1) `echo "Free";` `else echo 700 * count($events);` (1 calculation, 1 output).

**Q: Explain why include files are used for the header and the menu. [2]**
The code is written **once** and reused on every page (1), so a change to the menu updates **all pages** and avoids repeated code (1).
:::

:::warning Common mistakes
- Forgetting `name` attributes, or `[]` for check boxes that should arrive as an array.
- Using absolute links for pages of the same site — the links break when the site moves.
- Processing the form before checking `REQUEST_METHOD` — errors appear when the page is first opened.
- Copying the same header into every file instead of using `include`.
:::

:::steps Check yourself
- List the pages and shared files of a small web application.
- Write a navigation bar and the CSS that highlights the active link.
- What is the difference between absolute and relative links?
- Write PHP that validates a grade and a name from a form.
- Use selection and iteration to calculate and list a total.
- Write three tests for a registration page.
:::
