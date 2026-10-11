---
summary: Execution (runtime) errors that occur when a program starts or runs and how to prevent them, and testing programs with normal, extreme (boundary) and erroneous data using a test plan.
---
# Why programs are tested
@lo 12.5.3.1 12.5.3.2

**Testing** checks that a program **works correctly for every kind of input**, does not crash, and **rejects** data it should not accept. Testing is planned in advance with a **test plan**: for each test, the **test data**, its **type**, the **expected result**, and later the **actual result**.

:::compare Kinds of error found by testing
| Error | When it appears | Example |
|---|---|---|
| **Syntax error** | Before the program runs (translation) | `pritn("Hi")`, missing bracket |
| **Execution (runtime) error** | While the program is **starting or running** — it crashes | Division by zero, file not found |
| **Logic error** | The program runs but gives the **wrong result** | Using `>` instead of `>=` |
:::

:::callout info More about syntax and logic errors
Syntax and logic errors are studied in the topic **Types of errors**. This topic focuses on **execution errors** and on choosing **test data**.
:::

# Execution errors at program startup
@lo 12.5.3.1

:::definition Execution (runtime) error
An error that occurs **while the program is executing**: the code is **syntactically correct**, so it is translated, but an operation **cannot be carried out**, so the program **stops (crashes)** or shows an error message.
:::

Some execution errors happen **as soon as the program starts**, because something the program needs is **missing or unavailable**:

:::compare Execution errors at program startup
| Error | Cause | Typical message / effect |
|---|---|---|
| **File not found** | A configuration or data file that is opened at startup does not exist or has been moved | `FileNotFoundError: settings.txt` |
| **Missing library / DLL** | A library the program needs is not installed or has the wrong version | "The program can't start because xyz.dll is missing" / `ModuleNotFoundError` |
| **Database connection failure** | The database server is not running, the password is wrong or the network is down | "Cannot open database … Login failed" |
| **Insufficient memory** | Not enough RAM to load the program or a large array | `MemoryError`, "Out of memory" |
| **Access denied / permissions** | The user has no right to read a file or write to a folder | `PermissionError` |
| **Invalid start-up arguments / input** | The program is started with missing or wrong parameters, or the first input has the wrong type | `IndexError: list index out of range`, `ValueError` |
| **Port / device already in use** | Another program is using the network port, camera or printer | "Address already in use" |
:::

:::compare Execution errors while the program runs
| Error | Example | Prevention |
|---|---|---|
| **Division by zero** | `average = total / count` when `count = 0` | Check `count > 0` before dividing |
| **Index out of range** | `marks[10]` in an array of 10 elements (indexes 0–9) | Check the index is within the array bounds |
| **Type conversion error** | `int("twelve")` when the user types a word for a number | Validate input; exception handling |
| **Overflow** | A value too large for its data type | Use a suitable data type; check limits |
| **Stack overflow** | Recursion with no base case | Make sure recursion has a base case |
| **Null / undefined reference** | Using a variable or object that has no value | Initialise variables; check before use |
:::

```python | A runtime error caused by input — the program crashes
guess = int(input("Guess a number from 1 to 100: "))   # user types: Twenty
# ValueError: invalid literal for int() with base 10: 'Twenty'
```

```python | Preventing startup and input errors with exception handling
try:
    with open("questions.txt") as f:          # needed at startup
        questions = f.readlines()
except FileNotFoundError:
    print("The question file is missing. Please contact the teacher.")
    questions = []

while True:
    try:
        guess = int(input("Guess a number from 1 to 100: "))
        break                                  # valid integer entered
    except ValueError:
        print("Please type digits, for example 42.")
```

:::example Run-time error with an array (exam style)
`Letters` has 26 elements with indexes **0–25**. The code `Letters[j + 1]` is executed when `j = 25`, because the letter **z** has no next letter. Index **26** does not exist, so an **out-of-range (runtime / execution) error** occurs. The fix: when the letter is `z`, use `Letters[0]` (wrap around to `a`).
:::

:::tip How to answer "determine the type of error"
State the **type** (runtime / execution error) **and justify** it with the **cause** in that code: "*runtime error, because the index j + 1 goes outside the bounds of the array when the input contains z*".
:::

# Normal data
@lo 12.5.3.2

:::definition Normal data
**Typical, valid** data that the program **should accept** and process correctly. It is well **inside** the accepted range and of the correct type and format.
:::

- Purpose: to check that the program gives the **correct results** for ordinary use.
- Choose several normal values, not just one, and work out the **expected result** first.
- *Example: a field accepts a month number from 1 to 12 → normal data: 3, 7, 10.*

# Extreme (boundary) data
@lo 12.5.3.3

:::definition Extreme data
**Valid** data **at the limits (boundaries)** of the accepted range — the **largest and smallest** values that should still be **accepted**.
:::

- Purpose: to check that the boundaries are coded correctly — errors such as `<` instead of `<=` are very common.
- *Example: month 1 to 12 → extreme data: **1** and **12**.*

:::callout info Boundary testing
Many testers also test the values **just outside** the boundary (0 and 13). These are **erroneous** data — they must be **rejected**. Testing both sides of every boundary is called **boundary testing**.
:::

:::ascii Normal, extreme and erroneous data for a range 1–12
      erroneous | extreme   normal   extreme | erroneous
   ... -1  0    |   1    2 ... 11     12     |   13  14 ...
   -------------+----------------------------+-------------
       rejected |          accepted          | rejected
:::

# Erroneous data
@lo 12.5.3.4

:::definition Erroneous (abnormal / invalid) data
Data that **should be rejected** by the program because it is **outside the range**, of the **wrong data type**, in the **wrong format** or **missing**. The program should show an error message and ask again — it must **not crash**.
:::

:::compare Kinds of erroneous data (month 1–12)
| Kind | Example | Expected result |
|---|---|---|
| Out of range | `0`, `13`, `-15` | "Invalid month" message, ask again |
| Wrong type | `july`, `twelve` | Rejected — no crash |
| Wrong format | `3.5`, `12a` | Rejected |
| Missing (empty) | *(nothing typed)* | Rejected |
:::

# Test plans
@lo 12.5.3.2 12.5.3.3 12.5.3.4

```python | Program to be tested: output the season for a month number
month = input("Enter the month number (1-12): ")
if not month.isdigit() or int(month) < 1 or int(month) > 12:
    print("Invalid month")
else:
    m = int(month)
    if m == 12 or m == 1 or m == 2:
        print("Winter")
    elif m >= 3 and m <= 5:
        print("Spring")
    elif m >= 6 and m <= 8:
        print("Summer")
    else:
        print("Autumn")
```

:::compare Test plan for the season program
| Test | Test data | Type | Expected result |
|---|---|---|---|
| 1 | 4 | Normal | Spring |
| 2 | 7 | Normal | Summer |
| 3 | 10 | Normal | Autumn |
| 4 | 1 | Extreme | Winter |
| 5 | 12 | Extreme | Winter |
| 6 | 0 | Erroneous | Invalid month |
| 7 | 13 | Erroneous | Invalid month |
| 8 | july | Erroneous | Invalid month (no crash) |
:::

:::compare Choosing test data — more examples
| Rule | Normal | Extreme | Erroneous |
|---|---|---|---|
| Exam mark 0–100 (integer) | 45, 78 | 0, 100 | −1, 101, "fifty" |
| Password of 8–16 characters | `kazakh2026` (10 chars) | 8 chars, 16 chars | 7 chars, 17 chars, empty |
| Age of a pupil 11–18 | 15 | 11, 18 | 10, 19, 15.5 |
:::

:::steps How to test a program
- Read the **validation rule** (range, type, length, format).
- Choose **normal** values inside the range, **extreme** values on each boundary and **erroneous** values outside it and of the wrong type.
- Write the **expected result** of each test **before** running it.
- Run the tests and record the **actual result**.
- If the actual result differs, find and correct the error, then **re-test**.
:::

# Exam practice and summary
@lo 12.5.3.1 12.5.3.2 12.5.3.3 12.5.3.4

:::example Exam-style answers
**Q: Give one example of each test data type for a program that accepts a month number. [3]**
Normal: any of 2–11, e.g. **6** (1). Extreme: **1** or **12** (1). Erroneous: **0**, **−15**, **13** or **july** (1).

**Q: Give one example of the value for `guess` that will cause a runtime error. [1]**
A string such as **"Twenty"** — `int()` cannot convert it to an integer.

**Q: The program uses the index of an array element that is outside the bounds of the array indices. State the type of error. [1]**
**Run-time / execution error.**

**Q: Describe one execution error that could occur when the program starts. [2]**
The program tries to open a **settings file that does not exist** (1), so it **crashes with a file-not-found error** unless the error is handled (1).
:::

:::warning Common mistakes
- Calling extreme data "invalid" — extreme data is **valid** and must be **accepted**.
- Giving erroneous data that is actually valid (e.g. 12 for months 1–12).
- Giving only out-of-range numbers — also test the **wrong data type** (text instead of a number).
- Confusing a **runtime** error (program crashes while running) with a **syntax** error (program cannot be translated).
- Not stating the **expected result** in a test plan.
:::

:::steps Check yourself
- Define an execution (runtime) error and give four examples.
- Which execution errors can happen at program startup? How can they be prevented?
- Define normal, extreme and erroneous data.
- Write a test plan with six tests for a field that accepts a whole number from 18 to 65.
- Why must erroneous data not crash the program?
- What is boundary testing?
:::
