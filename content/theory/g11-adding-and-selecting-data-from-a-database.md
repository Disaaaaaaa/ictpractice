---
summary: Adding records to a database from a web form, extracting data with SELECT, and using two-dimensional arrays to hold table data in a program.
---
# Adding data to a database from code
@lo 11.5.4.7

```php | Insert a new student from a form (prepared statement)
<?php
$conn = mysqli_connect("localhost", "school_user", "secret", "school_db");

$name  = trim($_POST["name"]);
$grade = (int)$_POST["grade"];

if ($name !== "" && $grade >= 7 && $grade <= 12) {          // validate first
    $stmt = mysqli_prepare($conn, "INSERT INTO Student (Name, Grade) VALUES (?, ?)");
    mysqli_stmt_bind_param($stmt, "si", $name, $grade);      // s = string, i = integer
    if (mysqli_stmt_execute($stmt)) {
        echo "Student added with ID " . mysqli_insert_id($conn);
    } else {
        echo "Error: " . mysqli_error($conn);
    }
} else {
    echo "Please enter a name and a grade between 7 and 12.";
}
mysqli_close($conn);
?>
```

:::callout danger SQL injection
Never put form data **directly** into an SQL string (`"... VALUES ('$name')"`): a user could type SQL code and change or delete data. Use **prepared statements** (placeholders `?`) or at least escape the input.
:::

# Extracting data from a database
@lo 11.5.4.8

```php | Search form → SELECT → HTML table
<?php
$conn  = mysqli_connect("localhost", "school_user", "secret", "school_db");
$grade = (int)$_GET["grade"];

$stmt = mysqli_prepare($conn, "SELECT StudentID, Name FROM Student WHERE Grade = ? ORDER BY Name");
mysqli_stmt_bind_param($stmt, "i", $grade);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

echo "<table border='1'><tr><th>ID</th><th>Name</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr><td>{$row['StudentID']}</td><td>{$row['Name']}</td></tr>";
}
echo "</table>";
echo mysqli_num_rows($result) . " student(s) found.";
?>
```

:::compare Useful mysqli functions
| Function | Purpose |
|---|---|
| `mysqli_connect()` | Open a connection |
| `mysqli_query()` | Run an SQL statement |
| `mysqli_fetch_assoc()` | Get the next row as an associative array (`$row["Name"]`) |
| `mysqli_num_rows()` | Number of rows returned |
| `mysqli_insert_id()` | ID of the last inserted record |
| `mysqli_close()` | Close the connection |
:::

# Two-dimensional arrays
@lo 11.5.2.2

:::definition Two-dimensional array
An array of arrays — data arranged in **rows and columns**, like a table. An element is accessed with **two indexes**: `[row][column]`.
:::

```php | Storing query results in a 2D array
<?php
$students = [];                       // empty 2D array
while ($row = mysqli_fetch_row($result)) {
    $students[] = $row;               // each row = [ID, Name, Grade]
}
echo $students[0][1];                 // name in the first row

// marks of 3 students in 4 tests
$marks = [
    [7, 8, 6, 9],
    [10, 9, 9, 8],
    [5, 6, 7, 6],
];
for ($r = 0; $r < count($marks); $r++) {
    $sum = 0;
    for ($c = 0; $c < count($marks[$r]); $c++) {
        $sum += $marks[$r][$c];
    }
    echo "Student " . ($r + 1) . " average: " . $sum / count($marks[$r]) . "<br>";
}
?>
```

:::tip
Use a **1D array** for a single list of values (marks of one student), and a **2D array** when each item has several values or the data is a grid (marks of many students in many tests, a seating plan, a game board).
:::
