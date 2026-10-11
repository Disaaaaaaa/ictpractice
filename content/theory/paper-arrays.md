---
summary: What an array is and why it is better than many separate variables; array terminology — identifier, element, index, lower and upper bound, length, dimension, zero-based indexing and out-of-range errors; declaring and processing 1D arrays (traversal, total, maximum, search, swap, shift); 2D arrays — rows, columns, row and column totals, nested loops; parallel arrays; and choosing a suitable 1D or 2D array for a given task.
---
# What an array is
@lo 11.5.2.1@paper

:::definition Array
A **data structure** that stores a **fixed number** of elements of the **same data type** under **one identifier** (name). Each element is accessed by its **index** (position).
:::

:::compare Separate variables or one array?
| Separate variables | One array |
|---|---|
| `Score1 ← 56`, `Score2 ← 71`, … `Score30 ← 88` | `Score[0] ← 56`, `Score[1] ← 71`, … `Score[29] ← 88` |
| 30 different names to declare and remember | **One name** for all 30 values |
| Every value must be written out separately | A **loop** can process every element using the index |
| Adding a 31st value means changing the code | Change the **size** only |
:::

:::cards
### Why a programmer uses an array
- Only **one identifier** is needed for many values.
- It is **easy to iterate** over the elements with a loop and an index.
- Code is **shorter**, easier to read and to maintain.
- It is an **efficient** way of storing many values of a similar type — the elements are stored **next to each other** in memory.
- It is **quicker to search and sort** an array than a set of separate variables.
### Properties of an array
- **Homogeneous** — all elements have the **same data type** (all INTEGER, all STRING…).
- **Static** (in pseudocode) — the size is fixed when it is declared.
- **Ordered** — every element has a position; the order is kept.
- **Random (direct) access** — any element can be reached at once by its index, e.g. `Score[17]`, without reading the others → **O(1)**.
:::

:::ascii An array in memory — elements are stored in consecutive locations
   Identifier: Score
              ┌──────┬──────┬──────┬──────┬──────┐
   Element →  │  56  │  71  │  43  │  90  │  88  │
              └──────┴──────┴──────┴──────┴──────┘
   Index   →     0      1      2      3      4
                 ▲                           ▲
            lower bound                 upper bound
                         length = 5
:::

# Array terminology
@lo 11.5.2.1@paper

:::compare Technical terms
| Term | Meaning | For `Score = [56, 71, 43, 90, 88]` (indexes from 0) |
|---|---|---|
| **Identifier** | The name of the array | `Score` |
| **Element** | One value stored in the array | `Score[3]` = 90 |
| **Index (subscript)** | The position number used to access an element | 3 |
| **Lower bound** | The **smallest** (first) index | **0** |
| **Upper bound** | The **largest** (last) index | **4** = length − 1 |
| **Length / size** | The number of elements | 5 |
| **Dimension** | The number of indexes needed to locate one element | 1 (1D) |
| **Data type** | The type that every element has | INTEGER |
:::

:::definition Lower and upper bound
The **lower bound** is the index of the **first** element and the **upper bound** is the index of the **last** element. Number of elements = **upper bound − lower bound + 1**.
:::

:::compare Bounds depend on how indexing starts
| Declaration | Lower bound | Upper bound | Length |
|---|---|---|---|
| `DECLARE Score : ARRAY[1:5] OF INTEGER` (1-based) | 1 | 5 | 5 |
| `Score = [0] * 5` in Python (0-based) | 0 | 4 | 5 |
| `fieldP` storing **11** players (0-based) | **0** | **10** | 11 |
| `DECLARE Temp : ARRAY[0:30] OF REAL` | 0 | 30 | **31** |
| `DECLARE Year : ARRAY[2000:2025] OF INTEGER` | 2000 | 2025 | **26** |
:::

:::callout info Exam convention
NIS exams usually use **0-based** arrays (like Python): an array of length **N** has minimum index **0** and maximum index **N − 1**. If the question declares bounds, e.g. `ARRAY[1:10]`, use those.
:::

```pseudocode | Declaring arrays in pseudocode
DECLARE Score : ARRAY[0:4] OF INTEGER            // 1D, 5 integers
DECLARE Name  : ARRAY[0:29] OF STRING            // 1D, 30 strings
DECLARE Marks : ARRAY[0:29, 0:5] OF INTEGER      // 2D, 30 rows × 6 columns

Score ← [56, 71, 43, 90, 88]                     // initialise with values
Score[2] ← 45                                     // change one element
OUTPUT Score[LENGTH(Score) - 1]                   // last element → 88
```

```python | The same in Python
score = [56, 71, 43, 90, 88]      # a list used as an array
score[2] = 45                     # change one element
print(score[len(score) - 1])      # last element → 88
names = [""] * 30                 # 30 empty strings
marks = [[0] * 6 for _ in range(30)]   # 30 rows × 6 columns
```

:::warning Index out of range
Using an index **below the lower bound** or **above the upper bound** (e.g. `Score[5]` when the upper bound is 4) causes a **run-time (execution) error** — the program is syntactically correct but crashes while running. A common cause is a loop `FOR i FROM 0 TO LENGTH(Score)` that should stop at `LENGTH(Score) − 1`.
:::

# Processing a 1D array
@lo 11.5.2.1@paper 11.5.2.2@paper

:::definition Traversal
Visiting **every element** of an array in turn, usually with a `FOR` loop from the **lower bound** to the **upper bound**.
:::

```pseudocode | Total and average
Total ← 0
FOR i FROM 0 TO LENGTH(Score) - 1
    Total ← Total + Score[i]
ENDFOR
Average ← Total / LENGTH(Score)
OUTPUT Total, Average
```

```pseudocode | Largest value and its position
Max ← Score[0]
Pos ← 0
FOR i FROM 1 TO LENGTH(Score) - 1
    IF Score[i] > Max THEN
        Max ← Score[i]
        Pos ← i
    ENDIF
ENDFOR
OUTPUT "Highest ", Max, " at index ", Pos
```

```pseudocode | Linear search — index of a value, or -1
INPUT Target
Index ← -1
i ← 0
WHILE i <= LENGTH(Names) - 1 AND Index = -1
    IF Names[i] = Target THEN
        Index ← i
    ENDIF
    i ← i + 1
ENDWHILE
OUTPUT Index
```

:::cards
### Comparing adjacent elements
- Neighbours are `ARR[i]` and `ARR[i + 1]`.
- **Not in ascending order:** `IF ARR[i] > ARR[i + 1]` — the condition used in bubble sort.
- The loop must stop at `LENGTH(ARR) − 2`, otherwise `ARR[i + 1]` is out of range.
### Swapping two elements
- Needs a **temporary** variable:
- `Temp ← A[i]`, `A[i] ← A[j]`, `A[j] ← Temp`.
- Without `Temp`, the first value would be overwritten and lost.
:::

:::example Shifting elements — move the last element to the front
The array `ACTIVITIES` = [task1, task2, task3, Break] must become [Break, task1, task2, task3].

```pseudocode
N ← LENGTH(ACTIVITIES) - 1           // upper bound
Buf ← ACTIVITIES[N]                  // save the last element (Break)
FOR i FROM N DOWNTO 1 STEP -1
    ACTIVITIES[i] ← ACTIVITIES[i - 1]  // move each element one place right
ENDFOR
ACTIVITIES[0] ← Buf                  // put Break at the front
```
The loop must go **backwards** — going forwards would copy task1 into every position.
:::

:::example Updating two arrays — a substitution
`fieldP` holds the 11 players on the field and `subP` the 3 substitutes. To replace player `s1` with substitute `s2`:

```pseudocode
INPUT s1, s2
FOR i FROM 0 TO 2
    IF subP[i] = s2 THEN
        FOR j FROM 0 TO 10
            IF fieldP[j] = s1 THEN
                subP[i] ← fieldP[j]       // the player leaves the field
                fieldP[j] ← s2            // the substitute comes on
            ENDIF
        ENDFOR
    ENDIF
ENDFOR
```
:::

:::compare Tracing an array loop
The code `ARRAY arr ← [7, 5, 3, 6]` / `FOR x FROM 0 TO LENGTH(arr) − 1` / `IF x MOD 2 <> 0 THEN arr[x] ← x + arr[x] ELSE arr[x] ← arr[x] − x` / `PRINT arr[x] * 2`:

| x | x MOD 2 <> 0? | arr[x] after | Output |
|---|---|---|---|
| 0 | False | 7 − 0 = 7 | 14 |
| 1 | True | 1 + 5 = 6 | 12 |
| 2 | False | 3 − 2 = 1 | 2 |
| 3 | True | 3 + 6 = 9 | 18 |
:::

# Two-dimensional arrays
@lo 11.5.2.1@paper 11.5.2.2@paper

:::definition 2D array
An array that needs **two indexes** to locate an element — usually **[row, column]**. It can be thought of as a **table** or **grid**, or as an array of 1D arrays.
:::

:::ascii Marks : ARRAY[0:3, 0:2] — 4 students (rows) × 3 tests (columns)
                     column 0   column 1   column 2
                     (Test 1)   (Test 2)   (Test 3)
                   ┌──────────┬──────────┬──────────┐
   row 0 (Aliya)   │    12    │    15    │    18    │
                   ├──────────┼──────────┼──────────┤
   row 1 (Bek)     │     9    │    14    │    11    │
                   ├──────────┼──────────┼──────────┤
   row 2 (Dana)    │    20    │    17    │    19    │
                   ├──────────┼──────────┼──────────┤
   row 3 (Timur)   │    16    │    10    │    13    │
                   └──────────┴──────────┴──────────┘
   Marks[2, 1] = 17   (row 2 = Dana, column 1 = Test 2)
:::

:::compare 2D array terms
| Term | For `Marks : ARRAY[0:3, 0:2]` |
|---|---|
| Dimension | **2** |
| Row bounds | lower **0**, upper **3** → 4 rows |
| Column bounds | lower **0**, upper **2** → 3 columns |
| Total number of elements | rows × columns = 4 × 3 = **12** |
| Element in the last row, last column | `Marks[3, 2]` = 13 |
| In Python | `marks[3][2]` — one pair of brackets per index |
:::

```pseudocode | Total of each row (each student) — outer loop over rows
FOR r FROM 0 TO 3
    RowTotal ← 0
    FOR c FROM 0 TO 2
        RowTotal ← RowTotal + Marks[r, c]
    ENDFOR
    OUTPUT "Student ", r, " total ", RowTotal
ENDFOR
```

```pseudocode | Average of each column (each test) — outer loop over columns
FOR c FROM 0 TO 2
    ColTotal ← 0
    FOR r FROM 0 TO 3
        ColTotal ← ColTotal + Marks[r, c]
    ENDFOR
    OUTPUT "Test ", c + 1, " average ", ColTotal / 4
ENDFOR
```

```python | A 2D array in Python — list of lists
arr2D = [["red", "blue"],
         ["green", "yellow"],
         ["black", "white"]]
print(len(arr2D))        # 3 rows
print(len(arr2D[0]))     # 2 columns
print(arr2D[1][0])       # green
for row in arr2D:        # visit every element
    for colour in row:
        print(colour)
```

:::compare Row totals and column totals of the Marks table
| | Test 1 | Test 2 | Test 3 | **Row total** |
|---|---|---|---|---|
| Aliya | 12 | 15 | 18 | **45** |
| Bek | 9 | 14 | 11 | **34** |
| Dana | 20 | 17 | 19 | **56** |
| Timur | 16 | 10 | 13 | **39** |
| **Column total** | **57** | **56** | **61** | 174 |
:::

:::tip Which loop goes outside?
To process **row by row** (each student), the **row** index is the outer loop. To process **column by column** (each test), the **column** index is the outer loop. The inner loop always runs completely for each value of the outer loop.
:::

# Choosing a 1D or 2D array
@lo 11.5.2.2@paper

:::compare
| Use a 1D array when… | Use a 2D array when… |
|---|---|
| The data is a **single list** of values | The data has **rows and columns** (a table or grid) |
| **One value** is stored for each item | **Several values of the same type** for each item, or two indexes are natural |
| One index is enough to find a value | Two indexes are needed — e.g. student and test, row and seat |
| Names of 30 students; daily temperatures in a month; the 11 players on a field | Marks of 30 students in 6 subjects; a cinema seating plan; a chess or sudoku board; temperature per day per city; pixels of an image |
:::

:::example Selecting the structure for a task
| Task | Structure | Declaration |
|---|---|---|
| Store the score of each of 25 students | **1D** | `Score : ARRAY[0:24] OF INTEGER` |
| Store the scores of 25 students in 4 tests | **2D** — row = student, column = test | `Score : ARRAY[0:24, 0:3] OF INTEGER` |
| Store a 9 × 9 sudoku grid | **2D** | `Grid : ARRAY[0:8, 0:8] OF INTEGER` |
| Store whether each of 12 rows × 20 seats is booked | **2D** of BOOLEAN | `Booked : ARRAY[0:11, 0:19] OF BOOLEAN` |
| Store the rainfall for each day of a year | **1D** | `Rain : ARRAY[0:364] OF REAL` |
| Store the rainfall per day for 12 cities | **2D** | `Rain : ARRAY[0:11, 0:364] OF REAL` |
:::

:::definition Parallel arrays
Two or more **1D arrays** of the **same length** in which elements with the **same index** belong to the same item — e.g. `Name[3]` and `Score[3]` describe the same student. Used when the data items have **different data types** (a STRING name and an INTEGER score), because one array can hold **only one** data type.
:::

:::ascii Parallel arrays — the same index links the data
   Index    0        1        2        3
          ┌────────┬────────┬────────┬────────┐
   Name   │ Aliya  │  Bek   │  Dana  │ Timur  │   ARRAY OF STRING
          └────────┴────────┴────────┴────────┘
          ┌────────┬────────┬────────┬────────┐
   Score  │   45   │   34   │   56   │   39   │   ARRAY OF INTEGER
          └────────┴────────┴────────┴────────┘
   Name[2] and Score[2] → Dana scored 56
:::

:::callout warning Justify your choice
An exam answer must give a **reason**: "A **2D array**, because each student has **several marks of the same type**, so one index is the **student (row)** and the other is the **test (column)**." Simply writing "2D array" usually earns only part of the marks.
:::

# Exam practice and summary
@lo 11.5.2.1@paper 11.5.2.2@paper

:::example Exam-style answers
**Q: Explain why the programmer might prefer to use an array instead of a set of variables. [2]**
Only **one name** is needed (1); it is **easy to iterate** over the elements with a loop using the index (1). Also accepted: efficient storage of many values of the same type; quicker to search.

**Q: Identify the possible minimum and maximum indexes of an array. [2]**
Minimum: **0** (1); maximum: **length of array − 1** (1).

**Q: Array fieldP stores 11 players. Determine the indexes of the first and last elements. [1]**
**0 and 10** (1).

**Q: Write a condition that checks if two adjacent elements of an array ARR are not in ascending order. [1]**
`IF ARR[i] > ARR[i + 1]` (1).

**Q: The program uses an index outside the bounds of the array. Name the type of error. [1]**
**Run-time** (execution) error (1).
:::

:::warning Common mistakes
- Saying the upper bound is the **length** — for 0-based arrays it is **length − 1**.
- Writing `FOR i FROM 0 TO LENGTH(A)` — the last pass is **out of range**.
- Mixing up the order of 2D indexes: say clearly which is the **row** and which is the **column**.
- Trying to store a name and a score in the **same** array — use **parallel arrays** (or a record).
- Swapping without a temporary variable, which **loses** one of the values.
- Shifting elements to the right with a **forward** loop — it copies the same value into every position.
:::

:::steps Check yourself
- Give four reasons for using an array rather than separate variables.
- Define element, index, lower bound, upper bound and dimension.
- How many elements does `ARRAY[2000:2025]` have? What are the bounds of a 0-based array of 11 elements?
- Write code to find the total, the maximum and the position of a value in a 1D array.
- Write code to move the last element of an array to the front.
- Write nested loops for the row totals and the column totals of a 2D array.
- Choose and justify a 1D or 2D array for: a seating plan, the names of a class, the marks of a class in 5 subjects.
:::
