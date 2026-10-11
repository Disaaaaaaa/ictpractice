---
summary: How an HTML form sends data to a server-side script with GET or POST, reading and validating form data in PHP, one-dimensional arrays and their terminology, processing arrays of form data with loops (total, average, maximum, minimum, counting, searching), associative arrays, and writing code in a good programming style.
---
# Sending form data to a script
@lo 11.5.4.4

An HTML **form** collects data from the user. When it is submitted, the browser sends each field as a **name = value** pair to the script named in the form's **action** attribute, where a **server-side script** (e.g. PHP) processes it and sends back a new page.

:::compare Attributes of the form element
| Attribute | Meaning | Example |
|---|---|---|
| `action` | The **script** that will process the data | `action="order.php"` |
| `method` | **How** the data is sent: `get` or `post` | `method="post"` |
| `name` (on each field) | The **key** used to read the value in the script | `<input name="quantity">` → `$_POST["quantity"]` |
| `value` | The value sent for radio buttons, checkboxes and options | `<input type="radio" name="item" value="coat">` |
:::

:::compare GET vs POST
| | GET | POST |
|---|---|---|
| Where the data goes | Added to the **URL**: `order.php?item=coat&qty=2` | In the **body** of the HTTP request — not visible in the URL |
| Data size | Limited (URL length) | No practical limit; can send files |
| Security | Visible in the address bar, history and logs — **never for passwords** | Not shown in the URL (still needs HTTPS to be secure) |
| Bookmarking | Results **can** be bookmarked or shared | Cannot be bookmarked |
| Typical use | Search forms, filters | Logins, registrations, orders, uploads |
| Read in PHP with | `$_GET["name"]` | `$_POST["name"]` |
:::

```html | order.html — a form that sends data to a PHP script
<form action="order.php" method="post">
  <p>Type of clothes:</p>
  <input type="radio" id="coat"  name="item" value="coat">  <label for="coat">Coat</label><br>
  <input type="radio" id="boots" name="item" value="boots"> <label for="boots">Boots</label><br>
  <label>Price (₸): <input type="number" name="price" min="1" required></label><br>
  <label>Quantity:  <input type="number" name="quantity" min="1" max="10" required></label><br>
  <input type="submit" value="Calculate">
</form>
```

:::html What the form looks like | 200
<form onsubmit="return false">
  <p>Type of clothes:</p>
  <input type="radio" id="coat" name="item" value="coat" checked> <label for="coat">Coat</label><br>
  <input type="radio" id="boots" name="item" value="boots"> <label for="boots">Boots</label><br>
  <label>Price (₸): <input type="number" name="price" value="20000"></label><br>
  <label>Quantity: <input type="number" name="quantity" value="2"></label><br>
  <input type="submit" value="Calculate">
</form>
---css---
body { font-family: Arial, sans-serif; padding: 8px; font-size: 14px; }
p { margin: 4px 0; }
input[type=number] { width: 90px; margin: 3px 0; }
:::

# Processing form data in PHP
@lo 11.5.4.4

:::steps How a PHP script processes a form
- **Check** that the form was submitted and the fields exist: `isset($_POST["price"])`.
- **Read** each value from `$_POST` (or `$_GET`) using the field's **name**.
- **Convert** text to numbers: `(int)`, `(float)`.
- **Validate** the data (presence, type, range) and show errors if it is wrong.
- **Process** it — calculate, or save to a database.
- **Output** the result as HTML with `echo`.
:::

```php | order.php — calculating the cost (with a 10% discount on coats)
<?php
if (!isset($_POST["item"], $_POST["price"], $_POST["quantity"])) {
    die("Please fill in the form.");
}
$item     = $_POST["item"];
$price    = (float)$_POST["price"];
$quantity = (int)$_POST["quantity"];

if ($price <= 0 || $quantity < 1 || $quantity > 10) {        // range check
    die("Price must be positive and quantity 1–10.");
}
$total = $price * $quantity;
if ($item == "coat") {
    $total = $total * 0.9;                                   // 10% discount
}
echo "<h2>Payment details</h2>";
echo "<p>" . htmlspecialchars($item) . ": $quantity * $price</p>";
echo "<p>Total: $total tenge</p>";
?>
```

:::callout warning Never trust form data
Users can type anything — even HTML or JavaScript. Always **validate** values on the server and use `htmlspecialchars()` before printing text the user entered, so that it is shown as text and **not run as code** (this prevents cross-site scripting).
:::

# One-dimensional arrays
@lo 11.5.2.1

:::definition Array
A **data structure** that stores **many values of the same type** under **one identifier**. Each value is an **element** and is accessed by its **index** (position).
:::

:::compare Array terms
| Term | Meaning | Example: `marks = [7, 9, 4, 10, 6]` |
|---|---|---|
| **Identifier** | The name of the array | `marks` |
| **Element** | One value stored in the array | `9` |
| **Index** | The position of an element | In PHP / JavaScript / Python indexes start at **0**: `marks[1]` = 9 |
| **Lower bound** | The smallest index | 0 |
| **Upper bound** | The largest index | 4 (= length − 1) |
| **Length (size)** | The number of elements | 5 |
| **One-dimensional (1D)** | Elements in a single row / list, one index | `marks[i]` |
:::

:::compare The same array in different languages
| Language | Declare | Read element | Length |
|---|---|---|---|
| Pseudocode | `DECLARE Marks : ARRAY[1:5] OF INTEGER` | `Marks[2]` | 5 (bounds 1 to 5) |
| PHP | `$marks = [7, 9, 4, 10, 6];` | `$marks[1]` | `count($marks)` |
| JavaScript | `let marks = [7, 9, 4, 10, 6];` | `marks[1]` | `marks.length` |
| Python | `marks = [7, 9, 4, 10, 6]` | `marks[1]` | `len(marks)` |
:::

```php | Working with a 1D array in PHP
<?php
$marks = [7, 9, 4, 10, 6];
echo $marks[0];                     // 7 — the first element (index 0)
echo $marks[count($marks) - 1];     // 6 — the last element (upper bound 4)
$marks[2] = 5;                      // change the third element: [7, 9, 5, 10, 6]
$marks[] = 8;                       // add an element at the end: 6 elements now
sort($marks);                       // ascending: [5, 6, 7, 8, 9, 10]
echo array_sum($marks);             // 45
echo in_array(10, $marks) ? "found" : "not found";   // found
?>
```

:::warning Index out of range
Using an index **outside the bounds** (e.g. `$marks[5]` when the upper bound is 4) is an error: PHP gives a warning and returns null, JavaScript returns `undefined`, Python stops with an `IndexError`. A loop `for ($i = 0; $i <= count($marks); $i++)` goes **one step too far** — use `<`.
:::

# Processing form data with arrays and loops
@lo 11.5.4.4 11.5.2.1

When several fields have the **same name followed by `[]`**, PHP receives them as an **array**.

```html | A form that sends an array of marks
<form action="marks.php" method="post">
  <input type="number" name="mark[]"> <input type="number" name="mark[]">
  <input type="number" name="mark[]"> <input type="number" name="mark[]">
  <input type="number" name="mark[]">
  <button>Calculate</button>
</form>
```

```php | marks.php — total, average, maximum, minimum and a count
<?php
$marks = $_POST["mark"];            // e.g. ["7", "9", "4", "10", "6"]
$total = 0;
$max   = (int)$marks[0];            // start with the first element
$min   = (int)$marks[0];
$above = 0;
for ($i = 0; $i < count($marks); $i++) {
    $m = (int)$marks[$i];
    $total += $m;                   // running total
    if ($m > $max) $max = $m;       // new maximum
    if ($m < $min) $min = $m;       // new minimum
    if ($m > 5)    $above++;        // count marks above 5
}
$average = $total / count($marks);
echo "Total: $total<br>Average: " . round($average, 2);
echo "<br>Highest: $max<br>Lowest: $min<br>Marks above 5: $above";
?>
```

:::example Trace of marks.php for the marks 7, 9, 4, 10, 6
| i | m | total | max | min | above |
|---|---|---|---|---|---|
| 0 | 7 | 7 | 7 | 7 | 1 |
| 1 | 9 | 16 | 9 | 7 | 2 |
| 2 | 4 | 20 | 9 | 4 | 2 |
| 3 | 10 | 30 | 10 | 4 | 3 |
| 4 | 6 | 36 | 10 | 4 | 4 |

Output: Total 36, Average **7.2**, Highest **10**, Lowest **4**, Marks above 5: **4**.
:::

:::steps Standard algorithms on an array
- **Total / average:** `total ← 0`; add every element; divide by the length.
- **Maximum / minimum:** start with the **first element**; compare each element and keep the larger / smaller.
- **Counting:** `count ← 0`; add 1 when the condition is true.
- **Linear search:** compare each element with the target until it is **found** or the array **ends**.
:::

```php | Checkboxes also arrive as an array — linear search with foreach
<?php
// <input type="checkbox" name="club[]" value="Robotics"> … value="Chess" …
$clubs = $_POST["club"] ?? [];          // only the ticked boxes are sent
echo "You chose " . count($clubs) . " clubs:<br>";
$found = false;
foreach ($clubs as $c) {
    echo htmlspecialchars($c) . "<br>";
    if ($c == "Robotics") $found = true;   // linear search
}
if ($found) echo "Robotics meets on Friday.";
?>
```

:::definition Associative array
An array whose elements are accessed by a **key (name)** instead of a number — useful for **price lists** and for `$_POST` itself.
:::

```php | Looking up prices with an associative array
<?php
$prices = ["coat" => 20000, "boots" => 15000, "jacket" => 12000];
$item = $_POST["item"];                       // e.g. "boots"
$qty  = (int)$_POST["quantity"];
if (array_key_exists($item, $prices)) {        // lookup validation
    echo "Total: " . $prices[$item] * $qty . " tenge";
}
foreach ($prices as $name => $price) {         // key and value
    echo "$name — $price<br>";
}
?>
```

# Good programming style
@lo 11.5.4.9

:::cards
### Meaningful identifiers
`$averageMark`, not `$x`. Use a **consistent** style (camelCase or snake_case).
### Comments
Explain **why** the code does something; describe each function's purpose, inputs and output.
### Indentation and spacing
Indent the body of every IF, loop and function so the structure is visible; one statement per line.
### Constants
`const MAX_STUDENTS = 30;` instead of "magic numbers" in the code — change the value in one place.
### Functions / procedures
Split the program into small, **reusable** subroutines with **one task** each.
### Validation and error handling
Check input data and handle errors (e.g. a failed database connection) with clear messages.
:::

```php | Poor style vs good style
<?php
// Poor
$a=$_POST["p"];if($a<1000){$b=$a*1.3;}else{$b=$a*1.15;}echo $b;

// Good
const MARKUP_CHEAP     = 1.30;   // +30% for goods under 1000 tenge
const MARKUP_EXPENSIVE = 1.15;   // +15% otherwise

// Returns the selling price of an item bought at $price tenge
function sellingPrice(float $price): float {
    if ($price < 1000) {
        return $price * MARKUP_CHEAP;
    }
    return $price * MARKUP_EXPENSIVE;
}

$price = (float)$_POST["price"];
echo "Selling price: " . sellingPrice($price);
?>
```

:::tip Why good style matters
Good style makes code easier to **read, debug, test and maintain**, especially when **another programmer** has to change it later — give this reason in "explain why" questions.
:::

# Exam practice and summary
@lo 11.5.2.1 11.5.4.4 11.5.4.9

:::example Exam-style answers
**Q: Write the attributes for the form tag to send data to calc.php using the GET method. [2]**
`<form action="calc.php" method="get">` — `action` (1), `method="get"` (1).

**Q: For the array Cities = ["Astana", "Almaty", "Shymkent", "Aktobe"], state the lower bound, the upper bound and Cities[2]. [3]**
Lower bound **0** (1); upper bound **3** (1); Cities[2] = **"Shymkent"** (1).

**Q: Write PHP code that outputs the highest mark in the array $marks. [4]**
`$max = $marks[0];` (1) `foreach ($marks as $m)` / for loop through all elements (1) `if ($m > $max) $max = $m;` (1) `echo $max;` after the loop (1).

**Q: Give two reasons why POST is used for a login form. [2]**
The password is **not shown in the URL** / address bar / history (1); data is sent in the request body, so it is **not bookmarked or logged** in server URL logs (1).
:::

:::warning Common mistakes
- Forgetting the **`name`** attribute — fields without a name are **not sent**.
- Reading `$_POST` when the form uses **GET** (or the other way round).
- Starting `max` at **0** — it fails if all values are negative; start with the **first element**.
- Using `<=` with `count()` in a loop — goes **past the upper bound**.
- Forgetting to convert form values (always **strings**) to numbers.
:::

:::steps Check yourself
- What do the `action` and `method` attributes do?
- Give three differences between GET and POST.
- Define element, index, lower bound and upper bound.
- How does PHP receive several fields named `mark[]`?
- Write a loop that counts how many marks are at least 50.
- List four rules of good programming style.
:::
