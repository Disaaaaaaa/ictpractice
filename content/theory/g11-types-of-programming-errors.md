---
summary: The three types of programming error — syntax, logic and runtime (execution) errors — what causes each, many examples in Python and pseudocode, when and how each is detected (translator messages, testing, trace tables, crashes), how to prevent runtime errors with validation and exception handling, debugging techniques, and identifying errors from descriptions in exam questions.
---
# Errors and debugging
@lo 11.5.4.13 11.5.4.14 11.5.4.15

:::definition Bug and debugging
A **bug** is an **error in a program** that stops it working as intended. **Debugging** is the process of **finding, identifying and correcting** errors.
:::

:::compare The three types of error at a glance
| | Syntax error | Logic error | Runtime (execution) error |
|---|---|---|---|
| **What is wrong** | The code **breaks the grammar rules** of the language | The **algorithm** is wrong | An operation **cannot be carried out** while the program runs |
| **Does the program run?** | **No** — it cannot be translated | **Yes**, but gives the **wrong result** | It **starts**, then **crashes** / stops unexpectedly |
| **When it is found** | During **translation** (compile / interpret) | During **testing** | During **execution** |
| **Found by** | The **translator** (compiler / interpreter) with an error message and line number | **Testing** (compare actual with expected results), **trace tables**, **dry runs** | The program **stops** with an error message (exception) |
| **Example** | Missing bracket, misspelt keyword | `area = 2 * r * r` instead of `3.14 * r * r` | Division by zero, index out of range |
:::

:::tip Classic exam descriptions
- "The programmer **misspelt a statement** while coding" → **syntax error**.
- "**Incorrectly using brackets** in calculations" → **logic error**.
- "A program tries to access an **element outside the bounds of the array**" → **runtime (execution) error**.
- "Text is entered where a **number** is expected" → **runtime** error (type mismatch).
- "The program outputs the **wrong variable**" → **logic error**.
:::

# Syntax errors
@lo 11.5.4.13

:::definition Syntax error
A mistake that **breaks the grammar (syntax) rules of the programming language**, so the translator cannot understand the code. The program **will not compile or run** until it is corrected.
:::

:::compare Common syntax errors
| Error | Wrong | Correct |
|---|---|---|
| **Misspelt keyword** | `pirnt("Hi")`, `esle:` | `print("Hi")`, `else:` |
| **Missing bracket** | `print("Pass"` | `print("Pass")` |
| **Missing quotation mark** | `print("Hello)` | `print("Hello")` |
| **Missing colon** (Python) | `if mark > 50` | `if mark > 50:` |
| **Wrong indentation** (Python) | body of `if` not indented | indent 4 spaces |
| **Missing semicolon / brace** (C++, Java, JS, PHP) | `x = 5` `}` missing | `x = 5;` `}` |
| **Wrong assignment** | `5 = x` | `x = 5` |
| **Invalid identifier** | `2total = 0`, `my mark = 7` | `total2 = 0`, `my_mark = 7` |
| **Missing END** (pseudocode) | `IF … THEN …` without `ENDIF` | add `ENDIF` / `ENDWHILE` |
:::

```python | Syntax errors and the translator's messages
if mark > 50            # SyntaxError: expected ':'
    print("Pass"        # SyntaxError: '(' was never closed
```

:::cards
### How syntax errors are detected
- The **translator** checks the code during **syntax analysis** and reports each error with a **line number** and a **message**.
- A **compiler** usually lists **all** the syntax errors it finds and produces **no** executable file.
- An **interpreter** stops at the **first** error it reaches.
- Many editors (IDEs) **underline** syntax errors while you type.
### How to fix them
- Read the **error message** and look at the line given — and the line **before** it (a missing bracket is often reported one line later).
- Correct one error at a time and re-run.
:::

# Logic errors
@lo 11.5.4.14

:::definition Logic error
A mistake in the **algorithm**: the program **runs without crashing but gives the wrong result** or behaves incorrectly. The syntax is correct, so the **translator cannot detect** it.
:::

:::compare Common causes of logic errors
| Cause | Example | Correct |
|---|---|---|
| **Wrong operator** | `if age > 18` when 18 should be accepted | `if age >= 18` |
| **Brackets used incorrectly** in a calculation | `average = a + b + c / 3` | `average = (a + b + c) / 3` |
| **Wrong formula** | `area = 2 * r * r` | `area = 3.14 * r * r` |
| **Wrong loop limits** (off-by-one) | `for i in range(1, 10)` to print 1–10 | `range(1, 11)` |
| **Wrong order of statements** | printing the total **before** the loop has added the values | print **after** the loop |
| **Wrong variable** | `print(i)` instead of `print(total)` | `print(total)` |
| **Variable not initialised / reset** | `total` not set to 0 before a loop | `total = 0` first |
| **Wrong condition in a loop** | `while count < 0:` never runs | `while count < 10:` |
| **Wrong output** | `OUTPUT K` instead of the result `Poisson` | `OUTPUT Poisson` |
:::

```python | A logic error found with a trace table
numbers = [4, 9, 2]
largest = 0
for n in numbers:
    if n < largest:          # logic error: should be n > largest
        largest = n
print(largest)               # prints 0 — expected 9
```

:::example Trace table that reveals the logic error
| n | n < largest? | largest |
|---|---|---|
| — | — | 0 |
| 4 | False | 0 |
| 9 | False | 0 |
| 2 | False | 0 |

The output **0** is not the expected **9**, and the trace shows `largest` never changes → the comparison must be `n > largest`.
:::

:::cards
### How logic errors are detected
- **Testing** with normal, boundary and erroneous data and **comparing the actual result with the expected result**.
- **Dry runs** and **trace tables** — following the code by hand to see where the values go wrong.
- **Debugger** tools: breakpoints, stepping through the code line by line, watching variables.
- Adding temporary **print statements** to show the values of variables.
### Why they are the hardest to find
- There is **no error message** — the program looks as if it works.
- The wrong result may only appear for **some** data (e.g. only at a boundary).
:::

# Runtime errors
@lo 11.5.4.15

:::definition Runtime (execution) error
An error that occurs **while the program is running**: an instruction **cannot be carried out**, so the program **crashes** or stops unexpectedly, even though the syntax is correct. It often depends on the **data** being processed.
:::

:::compare Common runtime errors
| Error | Example | Python message |
|---|---|---|
| **Division by zero** | `average = total / count` when `count = 0` | `ZeroDivisionError` |
| **Index out of range** — accessing an element outside the bounds of an array | `marks[3]` when `marks` has 3 elements (indexes 0–2) | `IndexError` |
| **Type mismatch** — wrong data type | `int("abc")`, adding a number to text | `ValueError` / `TypeError` |
| **File not found** | opening `results.txt` that does not exist | `FileNotFoundError` |
| **Undefined variable** used before it has a value | `print(total)` before `total = 0` | `NameError` |
| **Out of memory / stack overflow** | infinite recursion | `RecursionError` |
| **Infinite loop** | the loop condition never becomes false | program "hangs" (no crash, never ends) |
:::

```python | Runtime errors
marks = [7, 9, 4]
print(marks[3])            # IndexError: list index out of range

n = int(input("How many students? "))   # user types "ten" → ValueError
print(100 / n)                           # user types 0     → ZeroDivisionError
```

:::cards
### Preventing runtime errors — validation
- Check input **before** using it: `if n != 0:` before dividing; check an index is between **0** and **length − 1**; check the input is a **number**.
- Check that a **file exists** before opening it.
### Handling runtime errors — exception handling
- Put risky code in a `try` block; if an error happens, the `except` block runs **instead of crashing**, showing a helpful message.
- Other languages: `try … catch` (Java, JavaScript, C++), `On Error` (VB).
:::

```python | Handling runtime errors with try … except
try:
    n = int(input("How many students? "))
    print("Each gets", 100 / n, "points")
except ValueError:
    print("Please enter a whole number.")
except ZeroDivisionError:
    print("The number cannot be 0.")
```

```pseudocode | Preventing an index error in pseudocode
DECLARE Marks : ARRAY[1:30] OF INTEGER
INPUT Position
IF Position >= 1 AND Position <= 30 THEN
    OUTPUT Marks[Position]
ELSE
    OUTPUT "Position must be 1 to 30"
ENDIF
```

# Finding and fixing errors
@lo 11.5.4.13 11.5.4.14 11.5.4.15

:::compare Debugging techniques
| Technique | How it helps |
|---|---|
| **Reading error messages** | Shows the **type** of error and the **line** — for syntax and runtime errors |
| **Trace table / dry run** | Follows the values of variables step by step — finds **logic** errors |
| **Breakpoints** | Stop the program at a chosen line to look at the variables |
| **Stepping** | Execute **one line at a time** and watch the values change |
| **Watch window** | Shows chosen variables continuously while stepping |
| **Print statements** | Output intermediate values to see where they become wrong |
| **Testing with planned data** | Normal, boundary and erroneous data find logic and runtime errors |
:::

:::example Identify and correct — exam style
```pseudocode
1  compnum ← 50
2  count ← 1
3  INPUT guess
4  WHILE guess <> compnum DO
5      count ← count + 1
6      INPUT guess
7  ENDWHILE
8  PRINT "Well done, you took count attempts"
```
**Line 8** contains a **logic error**: the word `count` is inside the quotes, so the text "count" is printed instead of the **value** of the variable. Correct form: `PRINT "Well done, you took ", count, " attempts"`.
:::

# Exam practice and summary
@lo 11.5.4.13 11.5.4.14 11.5.4.15

:::example Exam-style answers
**Q: Determine the type of programming error. (i) The programmer misspelt a statement while coding. (ii) Incorrectly using brackets in calculations. (iii) Accessing an element outside the bounds of an array. [3]**
(i) **Syntax** error (1); (ii) **logic** error (1); (iii) **runtime (execution)** error (1).

**Q: Describe a logic error. [2]**
The program **runs** but produces the **wrong result** (1) because the **algorithm** is wrong, e.g. a wrong operator or formula (1).

**Q: Describe an error that will occur if text is entered into a variable that should hold a number. [1]**
A **type mismatch / runtime error** — the program crashes when it tries to use the text as a number (1).

**Q: Explain why a translator cannot detect logic errors. [2]**
The code **follows the syntax rules** of the language (1); the translator does not know **what the program is meant to do**, so it cannot tell the result is wrong (1).
:::

:::warning Common mistakes
- Calling an index-out-of-range error a **logic** error — it is a **runtime** error (the program crashes).
- Saying a logic error "stops the program" — it **runs** and gives a **wrong** answer.
- Writing "logic" alone when the mark scheme asks for "**logical error**" / "logic error" — use the full term.
- Thinking the translator finds all errors — it finds only **syntax** errors.
:::

:::steps Check yourself
- Define syntax, logic and runtime errors and give two examples of each.
- Which error type is found by the translator? By testing? By the program crashing?
- Write Python that divides two numbers without crashing when the second is 0.
- Find the logic error in `average = a + b / 2`.
- Name four debugging techniques.
- Why is a logic error usually the hardest to find?
:::
