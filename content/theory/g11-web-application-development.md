---
summary: Building a complete web application — interface and site navigation in HTML and CSS, processing form data with a scripting language using selection, iteration and validation, and keeping code in a good style.
---
# Interface and site navigation
@lo 11.5.3.2, 11.5.3.3

A web application usually has several pages that share a **common layout** (header, navigation, footer) and an **external style sheet**.

:::compare Site structure for a "School Events" application
| Page | Purpose |
|---|---|
| `index.php` | Home: list of upcoming events |
| `event.php?id=…` | Details of one event |
| `register.php` | Registration form |
| `admin.php` | Add / edit events (login required) |
:::

```html | Navigation bar shared by all pages
<nav class="menu">
  <a href="index.php" class="active">Events</a>
  <a href="register.php">Register</a>
  <a href="admin.php">Admin</a>
</nav>
```

:::html Navigation bar with hover and active states | 90
<nav class="menu"><a class="active" href="#">Events</a><a href="#">Register</a><a href="#">Admin</a></nav>
---css---
body { margin: 0; font-family: Arial; }
.menu { display: flex; background: #1f4fd8; }
.menu a { color: #fff; padding: 12px 18px; text-decoration: none; }
.menu a:hover { background: #1a43b8; }
.menu a.active { background: #fff; color: #1f4fd8; font-weight: bold; }
:::

:::compare Types of navigation
| Type | Example |
|---|---|
| Menu bar / navigation bar | Links at the top of every page |
| Hyperlinks in the content | "Read more" links |
| Breadcrumbs | Home › Events › Robotics Day |
| Buttons and forms that move to the next step | "Next", "Submit" |
| Internal links (anchors) | `<a href="#rules">Rules</a>` to a section of the page |
:::

# Processing form data in a script
@lo 11.5.4.6, 11.5.4.1, 11.5.4.4, 11.5.4.3

```php | register.php — validate, decide and repeat
<?php
$errors = [];
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name   = trim($_POST["name"] ?? "");
    $grade  = (int)($_POST["grade"] ?? 0);
    $events = $_POST["events"] ?? [];            // check boxes → array

    // validation
    if ($name === "")                  $errors[] = "Enter your name.";
    if ($grade < 7 || $grade > 12)     $errors[] = "Grade must be 7–12.";
    if (count($events) === 0)          $errors[] = "Choose at least one event.";

    if (!$errors) {
        // selection: price depends on the number of events
        $fee = count($events) >= 3 ? 1500 : 700 * count($events);

        // iteration: list chosen events
        echo "<h2>Thank you, " . htmlspecialchars($name) . "!</h2><ul>";
        foreach ($events as $e) {
            echo "<li>" . htmlspecialchars($e) . "</li>";
        }
        echo "</ul><p>Fee: $fee ₸</p>";
    }
}
foreach ($errors as $err) echo "<p class='error'>$err</p>";
?>
```

:::warning
Use `htmlspecialchars()` when displaying user input, so that a user cannot inject HTML or JavaScript into the page (**XSS**).
:::

# Good programming style in a project
@lo 11.5.4.9

- Separate **content (HTML)**, **style (CSS file)** and **logic (PHP/JS)**.
- Put repeated code (header, navigation, database connection) in one file and `include` it on each page.
- Meaningful names, comments, indentation, constants instead of magic numbers.
- Validate all input and handle errors with clear messages.
- Test every page with normal, boundary and erroneous data.

```php | Reusing code with include
<?php include "header.php"; include "db.php"; ?>
<main> … page content … </main>
<?php include "footer.php"; ?>
```
