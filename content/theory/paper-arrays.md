---
summary: Array terminology — elements, indexes, lower and upper bounds — and choosing between one- and two-dimensional arrays for a task.
---
# Array terminology
@lo 11.5.2.1@paper

:::definition Array
A **fixed-size, ordered** collection of elements of the **same data type**, stored under **one identifier** and accessed by **index**.
:::

```pseudocode | Declaring and using arrays
DECLARE Scores : ARRAY[1:5] OF INTEGER          // 1D: lower bound 1, upper bound 5
DECLARE Seats  : ARRAY[1:10, 1:20] OF CHAR       // 2D: 10 rows, 20 columns

Scores[3] ← 87
Seats[2, 15] ← 'X'

FOR i ← 1 TO 5
    OUTPUT Scores[i]
NEXT i
```

:::compare Terms
| Term | Meaning | For `Scores : ARRAY[1:5]` |
|---|---|---|
| Identifier | The array's name | `Scores` |
| Element | One item stored in the array | `Scores[3]` = 87 |
| Index (subscript) | The position of an element | 3 |
| **Lower bound** | The **smallest** index | 1 |
| **Upper bound** | The **largest** index | 5 |
| Length / size | Number of elements = upper − lower + 1 | 5 |
| Dimension | Number of indexes needed | 1 |
:::

:::warning
In many languages (Python, JavaScript, C, PHP) indexes **start at 0**: an array of length *n* has bounds **0 and n − 1**. Accessing index *n* causes a runtime **"index out of range"** error.
:::

# Choosing a 1D or 2D array
@lo 11.5.2.2@paper

:::compare
| Use a 1D array when… | Use a 2D array when… |
|---|---|
| The data is a **single list** of values | The data has **rows and columns** (a table or grid) |
| One value per item | Several values per item, or two indexes are natural |
| Scores of one student; names of 30 students; daily temperatures for a month | Marks of 30 students in 6 subjects; a cinema seating plan; a chess board; temperatures per day per city |
:::

:::example Choosing the structure
- *Store the score of each of 25 students* → **1D** `Score[1:25]`.
- *Store the scores of 25 students in 4 tests* → **2D** `Score[1:25, 1:4]` (row = student, column = test).
- *Store a 9×9 sudoku grid* → **2D** `Grid[1:9, 1:9]`.
:::

```pseudocode | Average of each student in a 2D array
FOR s ← 1 TO 25
    Sum ← 0
    FOR t ← 1 TO 4
        Sum ← Sum + Score[s, t]
    NEXT t
    OUTPUT "Student ", s, " average: ", Sum / 4
NEXT s
```

:::tip
For a 2D array say which index is the **row** and which is the **column** — e.g. "the first index is the student, the second is the test number".
:::
