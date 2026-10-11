---
summary: Writing program code that adds records to a database from a web form (INSERT with prepared statements, validation, SQL injection), extracting data with SELECT and displaying it as an HTML table, and using two-dimensional arrays — terms, declaration, nested loops, row and column totals — to hold table data in a program.
---
# The example database
@lo 11.5.4.7 11.5.4.8

All the examples on this page use the database **school_db** with one table, **Student**.

:::compare Table Student
| StudentID (PK, auto-increment) | Name | Grade | City |
|---|---|---|---|
| 1 | Aruzhan | 11 | Astana |
| 2 | Daniyar | 12 | Almaty |
| 3 | Aigerim | 11 | Almaty |
| 4 | Timur | 10 | Astana |
| 5 | Madina | 12 | Shymkent |
:::

:::steps Every database script follows the same pattern
- **Connect** — `mysqli_connect(server, user, password, database)`; stop with an error message if it fails.
- **Prepare the SQL** — INSERT to add data, SELECT to extract it.
- **Run** the statement — `mysqli_query()` or a **prepared statement**.
- **Check / process** the result — success message, or loop through the returned rows.
- **Close** the connection — `mysqli_close()`.
:::

# Adding data to a database from code
@lo 11.5.4.7

:::compare The INSERT statement
| Form | Example |
|---|---|
| All fields, in table order | `INSERT INTO Student VALUES (6, 'Nursultan', 11, 'Astana');` |
| Named fields (recommended) | `INSERT INTO Student (Name, Grade, City) VALUES ('Nursultan', 11, 'Astana');` |
| Several records | `INSERT INTO Student (Name, Grade) VALUES ('Ali', 10), ('Dana', 12);` |
:::

:::tip Text and numbers in SQL
Text and dates go in **quotes** (`'Astana'`), numbers do **not** (`11`). An **auto-increment** primary key is left out — the database creates it.
:::

```html | add_student.html — the form
<form action="add_student.php" method="post">
  <label>Name: <input type="text" name="name" required></label><br>
  <label>Grade: <input type="number" name="grade" min="7" max="12" required></label><br>
  <label>City: <input type="text" name="city"></label><br>
  <input type="submit" value="Add student">
</form>
```

```php | add_student.php — validate, then INSERT with a prepared statement
<?php
$conn = mysqli_connect("localhost", "school_user", "secret", "school_db");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$name  = trim($_POST["name"] ?? "");
$grade = (int)($_POST["grade"] ?? 0);
$city  = trim($_POST["city"] ?? "");

if ($name === "" || $grade < 7 || $grade > 12) {               // 1 validate first
    die("Please enter a name and a grade between 7 and 12.");
}

$sql  = "INSERT INTO Student (Name, Grade, City) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);                            // 2 prepare
mysqli_stmt_bind_param($stmt, "sis", $name, $grade, $city);    // 3 bind: s = string, i = integer
if (mysqli_stmt_execute($stmt)) {                               // 4 execute
    echo "Student added with ID " . mysqli_insert_id($conn);
} else {
    echo "Error: " . mysqli_error($conn);
}
mysqli_close($conn);                                            // 5 close
?>
```

```php | The simpler (but unsafe) version with mysqli_query
<?php
$sql = "INSERT INTO Student (Name, Grade, City) VALUES ('$name', $grade, '$city')";
if (mysqli_query($conn, $sql)) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
?>
```

:::callout danger SQL injection
If form data is put **directly** into the SQL string, a user can type **SQL code** instead of data. For example the name `x'); DELETE FROM Student; --` could turn the INSERT into a command that **deletes the whole table**. **Prepared statements** send the SQL and the data **separately** (placeholders `?`), so the data can never be run as SQL. At the very least, escape text with `mysqli_real_escape_string()`.
:::

:::compare Bind types for mysqli_stmt_bind_param
| Letter | Type | Example |
|---|---|---|
| `s` | string | name, city, date |
| `i` | integer | grade, quantity |
| `d` | double (decimal) | price |
:::

# Extracting data with SELECT
@lo 11.5.4.8

:::compare SELECT recap
| Clause | Purpose | Example |
|---|---|---|
| `SELECT` | Which **fields** | `SELECT Name, Grade` (`*` = all fields) |
| `FROM` | Which **table(s)** | `FROM Student` |
| `WHERE` | Which **records** (condition) | `WHERE Grade = 11 AND City = 'Almaty'` |
| `ORDER BY` | **Sort** order | `ORDER BY Name ASC` / `DESC` |
| `LIKE` | Pattern match | `WHERE Name LIKE 'A%'` (starts with A) |
| `COUNT`, `AVG`, `SUM`, `MAX`, `MIN` | Calculate a value | `SELECT COUNT(*) FROM Student WHERE City = 'Almaty'` |
:::

:::example Results for the example table
| Query | Result |
|---|---|
| `SELECT Name FROM Student WHERE Grade = 11 ORDER BY Name;` | Aigerim, Aruzhan |
| `SELECT Name, City FROM Student WHERE Grade = 12;` | Daniyar Almaty; Madina Shymkent |
| `SELECT COUNT(*) FROM Student WHERE City = 'Almaty';` | 2 |
| `SELECT Name FROM Student WHERE Name LIKE 'A%';` | Aruzhan, Aigerim |
| `SELECT * FROM Student WHERE Grade > 10 AND City = 'Astana';` | 1, Aruzhan, 11, Astana |
:::

```php | list_students.php — a search form sends the grade; results shown as a table
<?php
$conn  = mysqli_connect("localhost", "school_user", "secret", "school_db");
$grade = (int)($_GET["grade"] ?? 11);

$stmt = mysqli_prepare($conn, "SELECT StudentID, Name, City FROM Student WHERE Grade = ? ORDER BY Name");
mysqli_stmt_bind_param($stmt, "i", $grade);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) == 0) {
    echo "No students found in grade $grade.";
} else {
    echo "<table border='1'><tr><th>ID</th><th>Name</th><th>City</th></tr>";
    while ($row = mysqli_fetch_assoc($result)) {            // one row per loop
        echo "<tr><td>" . $row["StudentID"] . "</td><td>" . htmlspecialchars($row["Name"])
           . "</td><td>" . htmlspecialchars($row["City"]) . "</td></tr>";
    }
    echo "</table>";
    echo mysqli_num_rows($result) . " student(s) found.";
}
mysqli_close($conn);
?>
```

:::html Output for grade 11 | 170
<table border="1"><tr><th>ID</th><th>Name</th><th>City</th></tr>
<tr><td>3</td><td>Aigerim</td><td>Almaty</td></tr>
<tr><td>1</td><td>Aruzhan</td><td>Astana</td></tr></table>
<p>2 student(s) found.</p>
---css---
body { font-family: Arial, sans-serif; padding: 8px; }
table { border-collapse: collapse; }
th, td { padding: 4px 12px; }
th { background: #eef2ff; }
:::

:::compare Ways to read a row
| Function | Row returned as | Access |
|---|---|---|
| `mysqli_fetch_assoc()` | Associative array (field names) | `$row["Name"]` |
| `mysqli_fetch_row()` | Numeric array | `$row[1]` |
| `mysqli_fetch_array()` | Both | `$row["Name"]` or `$row[1]` |
| `mysqli_fetch_all($result, MYSQLI_ASSOC)` | **All rows at once** — a **2D array** | `$rows[0]["Name"]` |
:::

:::callout info Changing and removing data
The same pattern works for `UPDATE Student SET City = ? WHERE StudentID = ?` and `DELETE FROM Student WHERE StudentID = ?`. **Always** include a WHERE clause — without it, **every** record is changed or deleted. `mysqli_affected_rows($conn)` tells you how many records changed.
:::

# Two-dimensional arrays
@lo 11.5.2.2

:::definition Two-dimensional (2D) array
An **array of arrays** — data arranged in **rows and columns**, like a table. Each element is accessed with **two indexes**: **[row][column]**.
:::

:::compare A 2D array of marks — 3 students (rows) × 4 tests (columns)
| | [0] Test 1 | [1] Test 2 | [2] Test 3 | [3] Test 4 |
|---|---|---|---|---|
| **[0]** Student 1 | 7 | 8 | 6 | 9 |
| **[1]** Student 2 | 10 | 9 | 9 | 8 |
| **[2]** Student 3 | 5 | 6 | 7 | 6 |

`marks[1][2]` = **9** (row 1, column 2) · `marks[2][0]` = **5** · number of elements = 3 × 4 = **12**.
:::

:::compare Declaring a 2D array
| Language | Code |
|---|---|
| Pseudocode | `DECLARE Marks : ARRAY[1:3, 1:4] OF INTEGER` — then `Marks[2, 3] ← 9` |
| PHP | `$marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]];` |
| JavaScript | `let marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]];` |
| Python | `marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]]` |
:::

:::cards
### Terms
- **Rows** = the first index; **columns** = the second index.
- In PHP / JS / Python both indexes start at **0**; pseudocode often starts at **1**.
- Number of rows: `count($marks)`; number of columns: `count($marks[0])`.
### Processing with nested loops
- The **outer loop** goes through the **rows**.
- The **inner loop** goes through the **columns** of the current row.
- Total number of inner-loop iterations = rows × columns.
:::

```php | Row totals and averages with nested loops
<?php
$marks = [
    [7, 8, 6, 9],
    [10, 9, 9, 8],
    [5, 6, 7, 6],
];
for ($r = 0; $r < count($marks); $r++) {            // each student (row)
    $sum = 0;
    for ($c = 0; $c < count($marks[$r]); $c++) {     // each test (column)
        $sum += $marks[$r][$c];
    }
    $avg = $sum / count($marks[$r]);
    echo "Student " . ($r + 1) . ": total $sum, average $avg<br>";
}
// Student 1: total 30, average 7.5
// Student 2: total 36, average 9
// Student 3: total 24, average 6
?>
```

```php | Column totals — swap the loops
<?php
for ($c = 0; $c < count($marks[0]); $c++) {         // each test (column)
    $sum = 0;
    for ($r = 0; $r < count($marks); $r++) {         // each student (row)
        $sum += $marks[$r][$c];
    }
    echo "Test " . ($c + 1) . " total: $sum<br>";    // 22, 23, 22, 23
}
?>
```

```php | Storing query results in a 2D array
<?php
$result = mysqli_query($conn, "SELECT Name, Grade, City FROM Student");
$students = [];                             // empty 2D array
while ($row = mysqli_fetch_row($result)) {
    $students[] = $row;                     // each row = [Name, Grade, City]
}
echo $students[0][0];                       // "Aruzhan" — first row, first column
echo count($students);                      // 5 rows
?>
```

:::compare Choosing a data structure
| Task | Suitable structure | Why |
|---|---|---|
| The marks of **one** student in 10 tests | **1D array** | A single list of values |
| The names of all pupils in a class | **1D array** | One value per item |
| The marks of 30 students in 5 tests | **2D array** [30][5] | Each student has several values — a table |
| A cinema seating plan (rows and seats) | **2D array** | A grid |
| A noughts-and-crosses board | **2D array** [3][3] | A grid |
:::

# Exam practice and summary
@lo 11.5.4.7 11.5.4.8 11.5.2.2

:::example Exam-style answers
**Q: Write the SQL to add the student Dana, grade 12, from Almaty. [2]**
`INSERT INTO Student (Name, Grade, City)` (1) `VALUES ('Dana', 12, 'Almaty');` (1).

**Q: Write PHP code to output the names of all students in Almaty. [4]**
`$result = mysqli_query($conn, "SELECT Name FROM Student WHERE City = 'Almaty'");` — SQL (1), query (1); `while ($row = mysqli_fetch_assoc($result))` (1) `{ echo $row["Name"] . "<br>"; }` (1).

**Q: Explain why prepared statements are used. [2]**
Data from the form is sent **separately** from the SQL (1), so code typed by a user cannot change the query — prevents **SQL injection** (1).

**Q: State the value of marks[2][1] for the example array. [1]**
**6** (row 2 = Student 3, column 1 = Test 2).
:::

:::warning Common mistakes
- Putting **numbers in quotes** or forgetting quotes around **text** in SQL.
- Forgetting `WHERE` in an UPDATE or DELETE.
- Mixing up **row** and **column** indexes: `[row][column]`.
- Starting the indexes at 1 in PHP — they start at **0**.
- Forgetting to reset `$sum = 0` **inside** the outer loop, so totals keep growing.
:::

:::steps Check yourself
- List the five steps of a database script.
- Write an INSERT for a new student from the form fields name and grade.
- What is SQL injection and how do prepared statements prevent it?
- Write a SELECT that lists grade-12 students in alphabetical order.
- For the marks array, what is marks[0][3]? How many elements are there?
- Write nested loops that find the highest mark in the 2D array.
:::
