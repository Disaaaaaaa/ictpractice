---
summary: Syntax, logic and runtime errors — what causes each, when they are detected and how to find and fix them.
---
# Syntax errors
@lo 11.5.4.13

:::definition Syntax error
A mistake that **breaks the grammar rules of the programming language**, so the translator cannot understand the code. The program will not compile/run.
:::

- Misspelt keywords (`pirnt`, `esle`), missing brackets, quotes, colons or semicolons, wrong indentation in Python, using an undeclared variable in some languages.
- **Found by the translator** (compiler/interpreter), which reports the line number.

```python | Syntax errors
if mark > 50            # missing colon
    print("Pass"        # missing closing bracket
```

# Logic errors
@lo 11.5.4.14

:::definition Logic error
The program **runs without crashing but gives the wrong result**, because the algorithm is wrong.
:::

- Wrong operator (`<` instead of `<=`), wrong formula or brackets, wrong order of statements, wrong loop limits (off-by-one), wrong variable used.
- **Not detected by the translator** — found by **testing** (comparing actual and expected results), **trace tables** and **dry runs**.

```python | Logic error: the average is wrong
total = 0
for m in marks:
    total = total + m
average = total / len(marks) + 1   # "+ 1" should not be there
```

# Runtime errors
@lo 11.5.4.15

:::definition Runtime (execution) error
An error that occurs **while the program is running**, causing it to **crash** or stop unexpectedly, even though the syntax is correct.
:::

- Division by zero, an array index **out of range**, opening a file that does not exist, converting text to a number (`int("abc")`), running out of memory, an infinite recursion.
- Prevented by **validation** and **error handling** (`try … except`).

```python | A runtime error and how to handle it
marks = [7, 9, 4]
print(marks[3])            # IndexError: list index out of range

try:
    n = int(input("How many students? "))
    print(100 / n)
except ValueError:
    print("Please enter a whole number.")
except ZeroDivisionError:
    print("The number cannot be 0.")
```

:::compare Summary
| | Syntax error | Logic error | Runtime error |
|---|---|---|---|
| Program runs? | No | Yes, wrong output | Starts, then crashes |
| Detected by | Translator | Testing, trace tables | The program stops with an error message |
| Example | Missing bracket | `area = 2 * r * r` instead of `3.14 * r * r` | Division by zero |
:::

:::tip
Classic exam items: "misspelt a statement" → **syntax**; "index outside the bounds of the array" → **runtime (execution)**; "brackets used incorrectly in a calculation" → **logic**.
:::
