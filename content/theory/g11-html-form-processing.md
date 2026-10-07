---
summary: Processing HTML form data with one-dimensional arrays and loops, and writing program code in a good programming style.
---
# One-dimensional arrays
@lo 11.5.2.1

:::definition Array
A **data structure** that stores **many values of the same type** under **one identifier**; each element is accessed by its **index**.
:::

:::compare Array terms
| Term | Meaning | Example (`marks = [7, 9, 4, 10]`) |
|---|---|---|
| Element | One value in the array | `9` |
| Index | Position of an element | In PHP/JS indexes start at **0**: `marks[1]` = 9 |
| Lower bound / upper bound | Smallest / largest index | 0 and 3 |
| Length (size) | Number of elements | 4 |
:::

```php | Working with a 1D array in PHP
<?php
$marks = [7, 9, 4, 10];
$marks[] = 8;                       // add an element at the end
echo count($marks);                 // 5
echo $marks[0];                     // 7
$marks[2] = 6;                      // change the third element
sort($marks);                       // 6 7 8 9 10
?>
```

:::callout info Pseudocode arrays
In Cambridge-style pseudocode arrays are usually declared with bounds and often start at 1:
`DECLARE Marks : ARRAY[1:30] OF INTEGER`
:::

# Processing form data with loops
@lo 11.5.4.4

Several form fields with the same name followed by `[]` arrive in PHP as an **array**.

```html | Form sending an array of marks
<form action="marks.php" method="post">
  <input type="number" name="mark[]"> <input type="number" name="mark[]">
  <input type="number" name="mark[]"> <input type="number" name="mark[]">
  <button>Calculate</button>
</form>
```

```php | marks.php — total, average, maximum and count above 5
<?php
$marks = $_POST["mark"];            // array of strings
$total = 0;
$max   = $marks[0];
$above = 0;
for ($i = 0; $i < count($marks); $i++) {
    $m = (int)$marks[$i];
    $total += $m;
    if ($m > $max)  $max = $m;
    if ($m > 5)     $above++;
}
$average = $total / count($marks);
echo "Total: $total<br>Average: " . round($average, 2) . "<br>Highest: $max<br>Marks above 5: $above";
?>
```

:::steps Standard algorithms on an array
- **Total / average:** start `total ← 0`, add every element, divide by the length.
- **Maximum / minimum:** start with the first element, compare each element, keep the larger/smaller.
- **Counting:** start `count ← 0`, add 1 when the condition is true.
- **Linear search:** compare each element with the target until it is found or the array ends.
:::

# Good programming style
@lo 11.5.4.9

:::cards
### Meaningful identifiers
`$averageMark`, not `$x`. Use a consistent style (camelCase or snake_case).
### Comments
Explain **why** the code does something, and describe each function.
### Indentation and spacing
Indent the body of every IF, loop and function so the structure is visible.
### Constants
`define("MAX_STUDENTS", 30);` instead of "magic numbers" in the code.
### Functions / procedures
Split the program into small, reusable subroutines with one task each.
### Validation and error handling
Check input data and handle errors (e.g. a failed database connection).
:::

```php | Poor style vs good style
<?php
// Poor
$a=$_POST["p"];if($a<1000){$b=$a*1.3;}else{$b=$a*1.15;}echo $b;

// Good
const MARKUP_CHEAP     = 1.30;   // +30% for goods under 1000 tenge
const MARKUP_EXPENSIVE = 1.15;   // +15% otherwise

function sellingPrice(float $price): float {
    return $price < 1000 ? $price * MARKUP_CHEAP : $price * MARKUP_EXPENSIVE;
}

$price = (float)$_POST["price"];
echo "Selling price: " . sellingPrice($price);
?>
```

:::tip
Good style makes code easier to **read, debug and maintain**, especially when someone else has to change it later — that is the reason to give in "explain why" questions.
:::
