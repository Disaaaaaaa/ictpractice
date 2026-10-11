---
summary: Syntax errors and logic errors in program code — what causes them, how they are detected, how they differ from runtime errors, and how to find and correct them using error messages, trace tables and debugging tools.
---
# Three kinds of programming error
@lo 12.5.3.5 12.5.3.6

Every program a programmer writes can contain errors (**bugs**). They are grouped by **when** they show themselves and **what** goes wrong.

:::compare Syntax, runtime and logic errors
| | Syntax error | Runtime (execution) error | Logic error |
|---|---|---|---|
| What is wrong | The code **breaks the grammar rules** of the language | An operation is **impossible** while the program runs | The **algorithm is wrong** |
| When it is found | During **translation** (compiling / interpreting) — before or as the line is run | While the program is **running** | Only when the **output is checked** |
| Does the program run? | **No** (compiler) / stops at that line (interpreter) | Starts, then **crashes** | **Yes** — it runs to the end |
| Error message? | **Yes**, with a line number | **Yes** (exception) | **No** |
| Example | `pritn("Hi")`, missing `)` | Division by zero, index out of range | `>` instead of `>=`, wrong formula |
| How to find | Read the translator's error message | Testing with erroneous / extreme data | Testing, **trace tables**, dry runs, debugging |
:::

:::callout info Runtime errors
Runtime (execution) errors and test data are covered in the topic **Types of test data**. This topic focuses on **syntax** and **logic** errors.
:::

# Syntax errors
@lo 12.5.3.5

:::definition Syntax error
An error in the **spelling, grammar or punctuation** of the program code — the code **does not follow the rules (syntax)** of the programming language — so the **translator cannot translate it** into machine code.
:::

:::compare Common syntax errors
| Cause | Wrong code | Correct code |
|---|---|---|
| **Misspelt keyword** / function name | `pritn("Total")` / `whlie x < 5:` | `print("Total")` / `while x < 5:` |
| **Missing or extra bracket** | `print("Total"` | `print("Total")` |
| **Missing quotation mark** | `print("Total)` | `print("Total")` |
| **Missing colon** (Python) | `if score > 50` | `if score > 50:` |
| **Wrong indentation** (Python) | `if x > 0:` ⏎ `print(x)` (not indented) | `if x > 0:` ⏎ `····print(x)` |
| **Using `=` instead of `==`** in a condition | `if x = 5:` | `if x == 5:` |
| **Missing `END…`** in pseudocode | `IF … THEN … ` (no `ENDIF`) | `IF … THEN … ENDIF` |
| **Invalid variable name** | `2total = 0`, `my score = 0` | `total2 = 0`, `my_score = 0` |
| **Missing operator** | `total = price quantity` | `total = price * quantity` |
| **Missing semicolon** (C, Java, PHP) | `$x = 5` | `$x = 5;` |
:::

```python | A program with three syntax errors
1  score = int(input("Enter score: "))
2  if score >= 50
3      print("Pass)
4  else:
5      pirnt("Fail")
```

:::compare Finding and correcting the syntax errors
| Line | Error | Correction |
|---|---|---|
| 2 | Missing colon at the end of the `if` statement | `if score >= 50:` |
| 3 | Missing closing quotation mark | `print("Pass")` |
| 5 | Misspelt function name | `print("Fail")` |
:::

:::cards
### How syntax errors are detected
- The **compiler** lists all syntax errors after translation, with **line numbers and messages**; no executable is produced.
- An **interpreter** stops at the **first** syntax error it meets.
- An **IDE** underlines syntax errors **as you type** and suggests fixes.
### Reading an error message
```text
  File "grades.py", line 2
    if score >= 50
                  ^
SyntaxError: expected ':'
```
The message gives the **file**, the **line number**, a **pointer** (^) to the place, and the **type** of error.
:::

:::warning The line number is not always exact
A missing bracket or quotation mark is often reported on the **next** line, because the translator only notices the problem when it reads further. Check the reported line **and the line before it**.
:::

# Logic errors
@lo 12.5.3.6

:::definition Logic error
An error in the **design / algorithm** of the program: the code is **syntactically correct** and **runs without crashing**, but it **does not do what was intended** — it gives **wrong output** or behaves incorrectly.
:::

:::compare Common logic errors
| Cause | Wrong code | What happens | Correct code |
|---|---|---|---|
| **Wrong relational operator** | `if age > 18:` (adult means 18 or over) | An 18-year-old is not counted | `if age >= 18:` |
| **Incorrect use of brackets** / order of operations | `average = a + b + c / 3` | Only `c` is divided by 3 | `average = (a + b + c) / 3` |
| **Wrong arithmetic operator** | `area = length + width` | Adds instead of multiplying | `area = length * width` |
| **Off-by-one loop** | `for i in range(1, 10):` to print 1–10 | Prints 1–9 | `for i in range(1, 11):` |
| **Wrong variable** | `print(count)` instead of `print(total)` | Shows the wrong value | `print(total)` |
| **Variable not initialised / reset in the wrong place** | `total = 0` inside the loop | Total is reset every time | `total = 0` before the loop |
| **Wrong logical operator** | `if mark < 0 and mark > 100:` | Condition can never be true — invalid marks accepted | `if mark < 0 or mark > 100:` |
| **Infinite loop** | `while count < 10:` without `count = count + 1` | Program never ends | Increase `count` inside the loop |
| **Statements in the wrong order** | Output before the calculation | Old value printed | Calculate, then output |
:::

```text | Pseudocode with a logic error — find the line
1  count ← 0
2  secret ← 7
3  guess ← 0
4  WHILE guess <> secret
5      INPUT guess
6      count ← count + 1
7  ENDWHILE
8  OUTPUT "Well done, you took ", count - 1, " attempts"
```

:::compare Correcting the logic error
| Line | Problem | Correct line |
|---|---|---|
| 8 | `count` already holds the number of attempts; subtracting 1 gives a wrong answer | `OUTPUT "Well done, you took ", count, " attempts"` |
:::

:::cards
### How logic errors are found
- **Testing** with normal, extreme and erroneous data and comparing the **actual** result with the **expected** result.
- **Dry run / trace table** — follow the algorithm by hand, writing the value of each variable after each step.
- **Debugging tools** in the IDE (see below).
- **Code review** — another programmer reads the code.
### Why they are the hardest to find
- There is **no error message** — the translator accepts the code.
- The program may give correct results for **most** inputs and fail only for some (often at the **boundaries**).
- The programmer must understand **what the correct result should be**.
:::

# Finding logic errors with trace tables
@lo 12.5.3.6

```python | Intended: output the largest of the numbers
numbers = [4, 9, 2, 7]
largest = 0
for n in numbers:
    if n < largest:
        largest = n
print(largest)
```

:::compare Trace table — the output should be 9 but is 0
| n | n < largest? | largest |
|---|---|---|
| — | — | 0 |
| 4 | 4 < 0 → No | 0 |
| 9 | 9 < 0 → No | 0 |
| 2 | 2 < 0 → No | 0 |
| 7 | 7 < 0 → No | 0 |
:::

The trace shows `largest` never changes: the comparison is the **wrong way round**. Correct line: `if n > largest:`. (Better still, start with `largest = numbers[0]`, so the program also works when every number is negative.)

:::compare Debugging tools in an IDE
| Tool | What it does |
|---|---|
| **Breakpoint** | Pauses the program at a chosen line |
| **Stepping** (step into / over) | Runs the program **one line at a time** |
| **Watch / variable window** | Shows the **current values** of variables while paused |
| **Print statements** | Temporary `print()` lines show values at points in the program |
| **Error messages / stack trace** | Show where a syntax or runtime error happened |
:::

# Exam practice and summary
@lo 12.5.3.5 12.5.3.6

:::example Exam-style answers
**Q: Determine the type of programming error by its description. [3]**
(i) *The programmer misspelt a statement while coding* → **syntax error**.
(ii) *The program tried to divide by zero* → **runtime (execution) error**.
(iii) *Incorrect use of brackets in calculations* → **logic error**.

**Q: Describe a syntax error. [2]**
An error where the code **breaks the rules / grammar of the programming language**, e.g. a misspelt keyword or missing bracket (1), so the program **cannot be translated / will not run** and the translator reports the error (1).

**Q: Describe a logic error. [2]**
An error in the **algorithm**: the program **runs without crashing** (1) but **produces incorrect results / does not do what was intended**, e.g. using `>` instead of `>=` (1).

**Q: State the number of the line that contains a logic error, and rewrite it in the correct form. [2]**
Trace the code with a simple input, compare with the expected result, find the line responsible, then write the **whole corrected line**.
:::

:::warning Common mistakes
- Calling every error a "syntax error". If the program **runs** but the answer is wrong, it is a **logic** error.
- Saying a logic error "crashes the program" — that is a **runtime** error.
- Saying logic errors produce error messages — they do **not**.
- Rewriting only part of a line when the question asks to "rewrite the line".
- Forgetting that `=` instead of `==` in a Python condition is a **syntax** error, but `>` instead of `>=` is a **logic** error.
:::

:::steps Check yourself
- Define syntax error and logic error, and give three examples of each.
- How are syntax errors detected by a compiler and by an interpreter?
- Why are logic errors harder to find than syntax errors?
- Classify: missing bracket; `average = a + b / 2`; index outside the array; `for i in range(10)` when 1–10 is needed.
- Use a trace table to find the error in a "find the largest number" program.
- Name three debugging tools and what each does.
:::
