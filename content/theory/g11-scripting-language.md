---
summary: Selection and iteration in a scripting language, validating and verifying data in code, connecting to a database from a script, and using JavaScript to make pages interactive.
---
# Selection in a scripting language
@lo 11.5.4.1

A **scripting language** is an interpreted language used to automate tasks or to add behaviour to web pages: **JavaScript** runs in the browser (client side); **PHP** and **Python** often run on the web server (server side).

:::compare Selection statements
| Pseudocode | PHP | JavaScript |
|---|---|---|
| `IF price < 1000 THEN` | `if ($price < 1000) {` | `if (price < 1000) {` |
| `ELSE` | `} else {` | `} else {` |
| `ENDIF` | `}` | `}` |
:::

```php | IF … ELSEIF … ELSE in PHP
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

```javascript | switch in JavaScript
switch (day) {
  case "Sat":
  case "Sun":
    message = "Weekend";
    break;
  default:
    message = "School day";
}
```

:::compare Comparison and logical operators
| Meaning | PHP / JavaScript |
|---|---|
| equal / not equal | `==`  `!=` (strict: `===`  `!==`) |
| less / greater (or equal) | `<`  `>`  `<=`  `>=` |
| and / or / not | `&&`  `\|\|`  `!` |
:::

# Iteration in a scripting language
@lo 11.5.4.4

```php | for, while and foreach in PHP
<?php
for ($i = 1; $i <= 5; $i++) {        // count-controlled
    echo $i * $i . " ";              // 1 4 9 16 25
}

$total = 0;
$n = 1;
while ($total <= 100) {              // condition-controlled
    $total += $n;
    $n++;
}

$marks = [7, 9, 4, 10];
foreach ($marks as $m) {             // every element of an array
    echo $m . "<br>";
}
?>
```

```javascript | Loops in JavaScript
for (let i = 10; i >= 0; i -= 2) console.log(i);   // 10 8 6 4 2 0

let password;
do {
  password = prompt("Password:");
} while (password.length < 8);                     // post-condition loop
```

# Validation and verification in code
@lo 11.5.4.3

```php | Server-side validation of form data
<?php
$errors = [];
$name  = trim($_POST["name"] ?? "");
$age   = $_POST["age"] ?? "";
$email = $_POST["email"] ?? "";

if ($name === "")                               $errors[] = "Name is required.";          // presence
if (strlen($name) > 40)                         $errors[] = "Name is too long.";           // length
if (!is_numeric($age))                          $errors[] = "Age must be a number.";       // type
elseif ($age < 14 || $age > 18)                 $errors[] = "Age must be 14–18.";          // range
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email format is invalid.";    // format
if ($_POST["password"] !== $_POST["confirm"])   $errors[] = "Passwords do not match.";     // verification (double entry)

if ($errors) { foreach ($errors as $e) echo "<p class='error'>$e</p>"; }
else { echo "Data accepted."; }
?>
```

:::tip
Validate on the **client** (JavaScript, HTML `required`/`min`/`max`) for quick feedback, **and** on the **server** (PHP) because client checks can be bypassed.
:::

# Connecting to a database from a script
@lo 11.5.4.5

```php | Connecting to MySQL with mysqli
<?php
$conn = mysqli_connect("localhost", "school_user", "secret", "school_db");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$result = mysqli_query($conn, "SELECT FirstName, Grade FROM Student ORDER BY FirstName");
while ($row = mysqli_fetch_assoc($result)) {
    echo $row["FirstName"] . " — grade " . $row["Grade"] . "<br>";
}
mysqli_close($conn);
?>
```

:::steps Steps of working with a database in a script
- **Connect** to the database server (host, user, password, database name).
- **Check** that the connection succeeded.
- **Send an SQL query** (SELECT, INSERT, UPDATE, DELETE).
- **Process the result** — loop through the rows and output them.
- **Close** the connection.
:::

# Using a script to provide interactivity
@lo 11.5.3.8@paper

JavaScript reacts to **events** (click, input, submit, mouse over) and changes the page without reloading it.

```html | Live price calculator: the result updates as the user types (event "input")
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

:::compare Common events
| Event | Happens when |
|---|---|
| `click` | An element is clicked |
| `input` / `change` | The value of a field changes |
| `submit` | A form is sent — can be cancelled with `event.preventDefault()` if invalid |
| `mouseover` / `mouseout` | The pointer moves over / off an element |
| `load` | The page has finished loading |
:::
