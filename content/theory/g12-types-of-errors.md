---
summary: Syntax and logic errors in program code — how to recognise, locate and correct them, with examples in pseudocode and Python.
---
# Syntax errors
@lo 12.5.3.5

:::definition Syntax error
Code that **breaks the grammar rules** of the language, so it cannot be translated. The compiler or interpreter reports it, usually with the line number.
:::

```python | Find the syntax errors
1  def average(marks)
2      total = 0
3      for m in marks
4          total = total + m
5      retrun total / len(marks)
6  print(average([7, 9, 4])
```

:::compare Corrections
| Line | Error | Correction |
|---|---|---|
| 1 | Missing colon after the function header | `def average(marks):` |
| 3 | Missing colon after `for` | `for m in marks:` |
| 5 | Misspelt keyword | `return total / len(marks)` |
| 6 | Missing closing bracket | `print(average([7, 9, 4]))` |
:::

# Logic errors
@lo 12.5.3.6

:::definition Logic error
The program runs but **produces incorrect results** because the algorithm or a calculation is wrong. The translator cannot detect it.
:::

```pseudocode | Find the logic errors: count marks of 5 or more and find the largest mark
01 count ← 0
02 largest ← 0
03 FOR i ← 1 TO 9            // array has 10 marks: Marks[1:10]
04     IF Marks[i] > 5 THEN
05         count ← count + 1
06     ENDIF
07     IF Marks[i] < largest THEN
08         largest ← Marks[i]
09     ENDIF
10 NEXT i
11 OUTPUT count, largest
```

:::compare Corrections
| Line | Logic error | Correction |
|---|---|---|
| 03 | Loop stops at 9, the last mark is never checked (off-by-one) | `FOR i ← 1 TO 10` |
| 04 | `>` misses marks equal to 5 | `IF Marks[i] >= 5 THEN` |
| 07 | Wrong comparison: finds nothing (largest stays 0) | `IF Marks[i] > largest THEN` |
:::

:::steps Finding logic errors
- Work out the **expected result** by hand for simple test data.
- **Dry-run** the code with a **trace table**, recording every variable after each line.
- Compare the trace with the expected values — the first difference shows the faulty line.
- Use **breakpoints**, **watches** and **step-through** in an IDE debugger, or print intermediate values.
:::

:::compare Syntax vs logic errors
| | Syntax error | Logic error |
|---|---|---|
| Program runs? | No | Yes |
| Output | Error message from the translator | Wrong or unexpected result |
| Found by | Compiler / interpreter | Testing, trace tables, debugging |
| Example | `prnt("Hi")` | `area = length + width` instead of `length * width` |
:::
