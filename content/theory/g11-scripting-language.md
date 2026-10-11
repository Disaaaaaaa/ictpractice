---
summary: What a scripting language is (client-side JavaScript and server-side PHP), variables, input and output, selection and iteration in scripts, the difference between validation and verification and how to code them, connecting to a database from a PHP script, using JavaScript events to make pages interactive, and good programming style.
---
# What is a scripting language?
@lo 11.5.4.1 11.5.3.8@paper

:::definition Scripting language
A high-level, usually **interpreted** programming language used to **automate tasks** and add **behaviour** to applications and web pages. The code (a **script**) is translated and run line by line by an **interpreter** — no separate compilation step.
:::

:::compare Client-side and server-side scripts
| | Client-side (e.g. **JavaScript**) | Server-side (e.g. **PHP**, Python) |
|---|---|---|
| Runs on | The user's **browser** | The **web server** |
| Code visible to the user | **Yes** (View source) | **No** — the user only receives the resulting HTML |
| Typical uses | Interactivity, animations, instant **validation**, changing the page without reloading | Processing **form data**, **database** access, logins, generating pages |
| Embedded in HTML with | `<script> … </script>` | `<?php … ?>` (file saved as `.php`) |
| Advantages | Fast response; reduces load on the server | Secure — data and passwords stay on the server; works in every browser |
:::

```html | Embedding JavaScript in a web page
<!DOCTYPE html>
<html>
  <head><title>Greeting</title></head>
  <body>
    <script>
      let name = prompt("What is your name?");   // input box
      alert("Hello, " + name + "!");              // message box
    </script>
  </body>
</html>
```

:::compare Variables, input and output
| Task | JavaScript | PHP |
|---|---|---|
| Declare a variable | `let age = 16;`  `const RATE = 0.12;` | `$age = 16;` (always starts with `$`) |
| Input | `prompt("Enter age:")` — returns **text**; value of a form field: `document.getElementById("age").value` | `$_POST["age"]` or `$_GET["age"]` from a form |
| Convert text to a number | `Number(x)`, `parseInt(x)`, `parseFloat(x)` | `(int)$x`, `intval($x)` |
| Output | `alert(…)`, `console.log(…)`, `document.write(…)`, `element.textContent = …` | `echo …;` |
| Join strings | `"Total: " + total` | `"Total: " . $total` |
:::

:::warning Input is text
`prompt()` and form fields always return a **string**. `"5" + "3"` gives **"53"**, not 8. Convert with `Number()` before doing arithmetic.
:::

# Selection in a scripting language
@lo 11.5.4.1

:::definition Selection (branching)
A structure that chooses **which statements to run** depending on whether a **condition** is **true or false** — `if`, `else if`, `else` and `switch`.
:::

:::compare Selection statements
| Pseudocode | JavaScript | PHP |
|---|---|---|
| `IF mark >= 50 THEN` | `if (mark >= 50) {` | `if ($mark >= 50) {` |
| `ELSE IF mark >= 40 THEN` | `} else if (mark >= 40) {` | `} elseif ($mark >= 40) {` |
| `ELSE` | `} else {` | `} else {` |
| `ENDIF` | `}` | `}` |
:::

:::compare Comparison and logical operators
| Meaning | JavaScript / PHP |
|---|---|
| equal / not equal | `==`  `!=` (strict, also compares type: `===`  `!==`) |
| less / greater (or equal) | `<`  `>`  `<=`  `>=` |
| AND / OR / NOT | `&&`  `\|\|`  `!` |
:::

```javascript | Checking a PIN code (two-way selection)
let pin = prompt("Input your PIN code:");
if (pin == "1234") {                      // PIN compared as text
  alert("You entered successfully");
} else {
  alert("Error: incorrect PIN code");
}
```

```php | Multi-way selection in PHP: IF … ELSEIF … ELSE
<?php
$mark = 78;
if ($mark >= 90) {
    $grade = "A";
} elseif ($mark >= 75) {
    $grade = "B";
} elseif ($mark >= 50) {
    $grade = "C";
} else {
    $grade = "Fail";
}
echo "Grade: " . $grade;   // Grade: B
?>
```

```javascript | switch — choosing between many fixed values
let day = "Sat";
let message;
switch (day) {
  case "Sat":
  case "Sun":
    message = "Weekend";
    break;                 // leave the switch
  default:
    message = "School day";
}
```

```javascript | Logical operators: a discount for pupils aged 14–18 OR members
let age = 16, member = false;
if ((age >= 14 && age <= 18) || member) {
  price = price * 0.9;     // 10% discount
}
```

# Iteration in a scripting language
@lo 11.5.4.4

:::definition Iteration (loop)
A structure that **repeats** a block of statements — a **fixed number of times** (count-controlled `for`) or **while / until a condition** is met (condition-controlled `while`, `do … while`).
:::

:::compare Loops
| Loop | When to use | JavaScript | PHP |
|---|---|---|---|
| **for** | Number of repetitions known | `for (let i = 1; i <= 5; i++) { … }` | `for ($i = 1; $i <= 5; $i++) { … }` |
| **while** (pre-condition) | Repeat **while** a condition is true; may run **0** times | `while (total <= 100) { … }` | `while ($total <= 100) { … }` |
| **do … while** (post-condition) | Body must run **at least once** | `do { … } while (x < 8);` | `do { … } while ($x < 8);` |
| **for … of / foreach** | Every element of an array | `for (const m of marks) { … }` | `foreach ($marks as $m) { … }` |
:::

```javascript | Three attempts to enter a PIN (loop + selection + break)
let attempts = 0;
let success = false;
while (attempts < 3) {
  let pin = prompt("Input your PIN code:");
  attempts++;                                  // count this attempt
  if (pin == "1234") {
    success = true;
    break;                                     // stop the loop early
  }
  alert("Wrong PIN. Attempts left: " + (3 - attempts));
}
if (success) alert("You entered successfully");
else alert("Your attempts have ended. Card blocked.");
```

```php | Total and average of an array in PHP
<?php
$marks = [7, 9, 4, 10];
$total = 0;
foreach ($marks as $m) {
    $total += $m;                            // add each mark
}
$average = $total / count($marks);
echo "Total: $total, average: $average";     // Total: 30, average: 7.5
?>
```

```javascript | Count-controlled loop that builds HTML
let html = "";
for (let i = 1; i <= 5; i++) {
  html += "<li>" + i + " × 7 = " + i * 7 + "</li>";
}
document.getElementById("table").innerHTML = html;   // 7 times table
```

:::tip Trace a loop with a table
For questions such as "write the output", make a table with a column for **each variable** and a row for **each iteration**: e.g. `for (i = 10; i >= 0; i -= 4)` gives i = 10, 6, 2 — then i = −2 fails the condition and the loop stops.
:::

# Validation and verification in code
@lo 11.5.4.3

:::compare Validation vs verification
| | Validation | Verification |
|---|---|---|
| Meaning | An **automatic check by the program** that data is **reasonable / sensible** and follows the rules | A check that data has been **entered or copied correctly** — matches the original |
| Question it answers | "Is the data **allowed**?" | "Is the data **what the user meant**?" |
| Examples | Presence, length, type, range, format, check digit | **Double entry** (type twice and compare), **visual check** (proof-reading) |
| Limitation | Valid data can still be **wrong** (age 17 instead of 16) | Does not check that data is sensible |
:::

:::compare Validation checks
| Check | What it tests | Example in code |
|---|---|---|
| **Presence** | A value has been entered | `if (name == "")` |
| **Length** | Number of characters | `if (password.length < 8)` |
| **Type** | Correct data type | `if (isNaN(age))` |
| **Range** | Between a lower and upper limit | `if (age < 14 \|\| age > 18)` |
| **Format** | Matches a pattern | `/^\d{6}$/.test(postcode)`; email contains `@` |
| **Lookup** | Value is in a list | `["A","B","C"].includes(grade)` |
:::

```javascript | Client-side validation and verification when a form is submitted
document.getElementById("signup").addEventListener("submit", function (event) {
  const name = document.getElementById("name").value.trim();
  const age = Number(document.getElementById("age").value);
  const pass = document.getElementById("pass").value;
  const confirm = document.getElementById("confirm").value;
  let errors = [];

  if (name === "") errors.push("Name is required");                    // presence
  if (isNaN(age) || age < 14 || age > 18) errors.push("Age 14–18");    // type + range
  if (pass.length < 8) errors.push("Password: at least 8 characters"); // length
  if (pass !== confirm) errors.push("Passwords do not match");         // verification

  if (errors.length > 0) {
    event.preventDefault();                                            // do not send the form
    document.getElementById("msg").textContent = errors.join("; ");
  }
});
```

```php | Server-side validation of the same form in PHP
<?php
$errors = [];
$name  = trim($_POST["name"] ?? "");
$age   = $_POST["age"] ?? "";
$email = $_POST["email"] ?? "";

if ($name === "")                               $errors[] = "Name is required.";        // presence
if (strlen($name) > 40)                         $errors[] = "Name is too long.";         // length
if (!is_numeric($age))                          $errors[] = "Age must be a number.";     // type
elseif ($age < 14 || $age > 18)                 $errors[] = "Age must be 14–18.";        // range
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email format is invalid.";  // format
if ($_POST["password"] !== $_POST["confirm"])   $errors[] = "Passwords do not match.";   // verification

if ($errors) { foreach ($errors as $e) echo "<p class='error'>$e</p>"; }
else { echo "Data accepted."; }
?>
```

:::tip Validate twice
Validate on the **client** (JavaScript, HTML `required` / `min` / `max` / `pattern`) for **instant feedback**, **and** on the **server** (PHP) because client-side checks can be **switched off or bypassed**.
:::

# Connecting to a database from a script
@lo 11.5.4.5

A server-side script can **read and change data in a database** (e.g. MySQL) and show the results as a web page.

:::steps Steps of working with a database in PHP
- **Connect** to the database server with `mysqli_connect(server, username, password, database)`.
- **Check** the connection; if it failed, stop with `die(…)` and show `mysqli_connect_error()`.
- **Send an SQL query** with `mysqli_query($conn, $sql)` — SELECT, INSERT, UPDATE or DELETE.
- **Process the result** — loop through the rows with `mysqli_fetch_assoc($result)`.
- **Close** the connection with `mysqli_close($conn)`.
:::

```php | Connecting to the "library" database and listing books
<?php
$servername = "localhost";
$username   = "username";
$password   = "password";
$db         = "library";

$conn = mysqli_connect($servername, $username, $password, $db);   // 1 connect
if (!$conn) {                                                     // 2 check
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";

$sql = "SELECT Title, Author FROM Book ORDER BY Title";
$result = mysqli_query($conn, $sql);                             // 3 query

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {                  // 4 process rows
        echo $row["Title"] . " — " . $row["Author"] . "<br>";
    }
} else {
    echo "No books found";
}
mysqli_close($conn);                                              // 5 close
?>
```

```php | Adding a record from a form (INSERT)
<?php
$conn = mysqli_connect("localhost", "username", "password", "library");
$title  = $_POST["title"];
$author = $_POST["author"];

$stmt = mysqli_prepare($conn, "INSERT INTO Book (Title, Author) VALUES (?, ?)");
mysqli_stmt_bind_param($stmt, "ss", $title, $author);   // "ss" = two strings
if (mysqli_stmt_execute($stmt)) echo "New book added";
else echo "Error: " . mysqli_error($conn);
mysqli_close($conn);
?>
```

:::compare Key mysqli functions
| Function | Purpose |
|---|---|
| `mysqli_connect()` | Opens a connection; returns the connection or **false** |
| `mysqli_connect_error()` | Text describing why the connection failed |
| `mysqli_query()` | Sends an SQL statement; returns a result set for SELECT |
| `mysqli_num_rows()` | Number of rows in a result |
| `mysqli_fetch_assoc()` | Returns the next row as an array indexed by **field name**, or null at the end |
| `mysqli_prepare()` / `bind_param()` | **Prepared statement** — safely inserts user data and prevents **SQL injection** |
| `mysqli_close()` | Closes the connection |
:::

# Using a script to provide interactivity
@lo 11.5.3.8@paper

JavaScript can **react to events** — clicks, typing, submitting a form, moving the mouse — and **change the page** through the **DOM** (Document Object Model) without reloading it.

:::compare Common events
| Event | Happens when |
|---|---|
| `click` | An element is clicked |
| `input` / `change` | The value of a field changes |
| `submit` | A form is sent — can be cancelled with `event.preventDefault()` if invalid |
| `mouseover` / `mouseout` | The pointer moves over / off an element |
| `load` | The page has finished loading |
:::

:::compare Changing the page with the DOM
| Code | Effect |
|---|---|
| `document.getElementById("out")` | Finds the element with `id="out"` |
| `el.textContent = "Hi"` / `el.innerHTML = "<b>Hi</b>"` | Changes the text / HTML inside the element |
| `el.style.color = "red"` | Changes a CSS property |
| `el.classList.toggle("dark")` | Adds or removes a CSS class |
| `el.addEventListener("click", f)` or `onclick="f()"` | Runs function `f` when the event happens |
:::

```html | Live price calculator: the result updates as the user types
<label>Price (₸): <input id="price" type="number" value="800"></label>
<p>Selling price: <b id="out"></b></p>
<p id="warn" style="color: red"></p>

<script>
  const price = document.getElementById("price");
  function update() {
    const p = Number(price.value);
    document.getElementById("warn").textContent =
      (p < 1 || p > 50000) ? "Price must be between 1 and 50 000" : "";
    const selling = p < 1000 ? p * 1.3 : p * 1.15;
    document.getElementById("out").textContent = selling.toFixed(0) + " ₸";
  }
  price.addEventListener("input", update);   // run update() whenever the value changes
  update();
</script>
```

:::html Try it — a shopping-cost calculator (change the values) | 230
<h3>Calculator</h3>
<label><input type="radio" name="item" value="20000" checked> Coat — 20 000 ₸</label><br>
<label><input type="radio" name="item" value="15000"> Boots — 15 000 ₸</label><br>
<label><input type="radio" name="item" value="12000"> Jacket — 12 000 ₸</label><br>
<label>Quantity: <input id="qty" type="number" value="1" min="1" max="10"></label>
<button id="calc">Calculate</button>
<p id="res"></p>
<script>
document.getElementById("calc").addEventListener("click", function () {
  const price = Number(document.querySelector("input[name=item]:checked").value);
  const qty = Number(document.getElementById("qty").value);
  const out = document.getElementById("res");
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    out.style.color = "red";
    out.textContent = "Quantity must be a whole number from 1 to 10";
    return;
  }
  let total = price * qty;
  if (price === 20000) total = total * 0.9;   // 10% discount on coats
  out.style.color = "green";
  out.textContent = "Total: " + total.toLocaleString("ru-RU") + " ₸";
});
</script>
---css---
body { font-family: Arial, sans-serif; padding: 8px; }
button { margin-left: 8px; }
:::

# Good programming style
@lo 11.5.4.1 11.5.4.4

:::cards
### Make code readable
- **Meaningful identifiers**: `totalCost`, not `x`.
- **Indentation** inside `if`, loops and functions shows the structure.
- **Comments** explain *why* the code does something.
### Make code maintainable
- Use **constants** for fixed values: `const MAX_ATTEMPTS = 3;`.
- Split code into **functions** that do one job.
- Use **one consistent style** for names (camelCase in JavaScript).
:::

# Exam practice and summary
@lo 11.5.4.1 11.5.4.3 11.5.4.4 11.5.4.5 11.5.3.8@paper

:::example Exam-style answers
**Q: Complete the code to check the PIN code 1234; if incorrect, display a message. [3]**
`if (pin == "1234")` (1) `alert("You entered successfully");` (1) `else alert("Error, wrong PIN");` (1).

**Q: Explain the difference between validation and verification. [2]**
Validation is an **automatic check** that data is **sensible / follows rules** (e.g. a range check) (1); verification checks that data was **entered correctly / matches the original** (e.g. double entry) (1).

**Q: Complete the code to connect to the database "Library". [3]**
`$conn = mysqli_connect($servername, $username, $password, $db);` (1 function, 1 parameters) `if (!$conn) { die(…); }` (1).

**Q: Explain why a form is validated by both JavaScript and PHP. [2]**
JavaScript gives **instant feedback** without sending data to the server (1); PHP checks are needed because client-side scripts **can be disabled or bypassed** (1).
:::

:::warning Common mistakes
- Using `=` (assignment) instead of `==` / `===` (comparison) in an `if`.
- Forgetting that `prompt()` returns **text** — convert before arithmetic.
- A loop that never ends because the counter is **not changed** inside it.
- Forgetting `$` before PHP variables, or `;` at the end of statements.
- Saying verification checks whether data is "reasonable" — that is **validation**.
:::

:::steps Check yourself
- Give one difference between client-side and server-side scripts.
- Write an `if … else` that outputs "Pass" if a mark is at least 50.
- Write a loop that allows three attempts at a password.
- Name four validation checks and one verification method.
- List the five steps of working with a database in PHP.
- Which event would you use to check a form before it is sent?
:::
