---
summary: Why programs are tested, the types of test data — normal, boundary (extreme) and erroneous (abnormal) — how to choose test values for ranges, lengths, choices, formats and several inputs, writing and using a test plan with expected and actual results, dry runs and trace tables, black-box and white-box testing, and what to do when a test fails.
---
# Why programs are tested
@lo 11.5.4.10

:::definition Testing
Running a program with **carefully chosen data** to check that it **works correctly**, **meets the requirements** and **does not crash** — and to **find and remove errors** before the program is used for real.
:::

:::cards
### What testing checks
- The program gives **correct results** for valid input.
- It works at the **limits** of what is allowed.
- It **rejects** invalid input with a **clear error message** instead of crashing.
- It meets the **user requirements** of the new system.
### Why it matters
- Errors found **early** are cheaper and easier to fix.
- A program with errors can give **wrong results** (wrong marks, wrong bills) and lose **data** or **trust**.
- Testing gives **evidence** that the system works — required in the project documentation.
:::

:::compare Types of test data at a glance
| Type | Also called | What it is | Expected result |
|---|---|---|---|
| **Normal** | Valid, typical | Sensible data the program **should accept** | **Accepted**, correct output |
| **Boundary** | Extreme, limit | Data at the **edges** of the valid range — the largest and smallest accepted values (and the values **just outside** them) | Limits **accepted**; just outside **rejected** |
| **Erroneous** | Invalid, abnormal | Data that **should be rejected**: out of range, wrong type, wrong format, missing | **Rejected** with an error message; no crash |
:::

# Normal test data
@lo 11.5.4.10

:::definition Normal (valid) data
Typical, **sensible data that the program should accept** and process correctly — values well **inside** the valid range and of the correct type.
:::

:::cards
### Purpose
- To check that the program gives the **correct results** for ordinary input — the calculations, decisions and outputs are right.
### How to choose normal data
- Pick **several** values from the **middle** of the range, not at the edges.
- Work out the **expected result** **before** running the test (by hand or with a calculator).
- Include values that take **different paths** through the program (each branch of an IF).
:::

:::example Normal data for a ticket price program
Rule: age 0–17 pays 1500 ₸, age 18–64 pays 3000 ₸, age 65–120 pays 1000 ₸.
Normal test data: **10** → 1500 ₸, **35** → 3000 ₸, **70** → 1000 ₸ (one value for **each** branch).
:::

# Boundary test data
@lo 11.5.4.11

:::definition Boundary (extreme) data
Data **at the edges of the valid range** — the **largest and smallest values that should be accepted**. Many teachers and mark schemes also test the values **just outside** the limits, which must be rejected.
:::

:::cards
### Purpose
- To check that comparisons such as `<` and `<=`, `>` and `>=` are written correctly — **off-by-one errors** are very common.
- To check that the program does not reject the **limits** themselves.
### How to choose boundary data
- Read the **exact limits** from the question.
- Test **each limit**: the lowest and the highest valid value.
- Optionally test **just below** the lowest and **just above** the highest value (these are rejected).
- For **whole numbers** "just outside" means ±1; for decimals use the smallest step, e.g. 100.1.
:::

:::example Boundary data for a mark from 0 to 100
| Value | Accepted? | Reason |
|---|---|---|
| **0** | Yes | Lowest valid value |
| **100** | Yes | Highest valid value |
| −1 | No | Just below the range |
| 101 | No | Just above the range |
:::

:::callout warning Extreme data in NIS mark schemes
For a variable that may only be **3, 4 or 5** (e.g. midfielders in a football formation), the **extreme** values are **3 and 5** — the smallest and largest accepted values. Erroneous data is any other number (2, 6, 9) or a non-numeric value.
:::

```python | An off-by-one error found with boundary data
mark = int(input("Mark: "))
if mark > 0 and mark < 100:        # bug: should be >= 0 and <= 100
    print("Mark saved")
else:
    print("Mark must be 0–100")
# Test 0   → "Mark must be 0–100"   ✗ expected "Mark saved"
# Test 100 → "Mark must be 0–100"   ✗ expected "Mark saved"
# Normal data such as 45 would NOT have found this error.
```

# Erroneous test data
@lo 11.5.4.12

:::definition Erroneous (invalid / abnormal) data
Data that **should be rejected** by the program: **outside the range**, of the **wrong data type**, in the **wrong format**, too **long / short**, or **missing**.
:::

:::cards
### Purpose
- To check that **validation** works — invalid data is **not accepted** or saved.
- To check that the program **does not crash** and gives a **suitable error message**, so the user can correct the input.
### Kinds of erroneous data
- **Out of range**: −20, 250 for a mark 0–100.
- **Wrong type**: "abc", 45.5 when a whole number is required.
- **Wrong format**: an e-mail without "@", a date 31/02/2026.
- **Wrong length**: a 3-character password when at least 8 are needed.
- **Missing**: an empty field.
:::

:::compare Choosing test data for different rules
| Rule | Normal | Boundary | Erroneous |
|---|---|---|---|
| Age 14–18 (whole number) | 15, 16 | 14, 18 (13, 19 rejected) | 25, −3, "fifteen", empty |
| Password length 8–16 characters | `Pass1234word` (12) | 8 and 16 characters (7, 17 rejected) | `abc`, empty |
| Choice: grade "A", "B" or "C" | "B" | "A", "C" | "D", "7", empty |
| Price > 0 with 2 decimal places | 450.50 | 0.01 (0.00 rejected) | −10, "free" |
| Date of a lesson in 2026 | 15/03/2026 | 01/01/2026, 31/12/2026 | 31/02/2026, 2025-12-31, "tomorrow" |
:::

:::example Choosing test data: a mark must be a whole number from 0 to 100
| Type | Test values | Expected result |
|---|---|---|
| Normal | 45, 73 | Accepted |
| Boundary | 0, 100 (accepted); −1, 101 (rejected) | As stated |
| Erroneous | −20, 250, "abc", empty, 45.5 | Rejected with an error message |
:::

# Test plans
@lo 11.5.4.10 11.5.4.11 11.5.4.12

:::definition Test plan
A table, written **before** testing, that lists each **test**, its **purpose**, the **test data**, the **type** of data and the **expected result**. During testing the **actual result** is recorded and compared.
:::

:::compare Test plan
| No. | Purpose of test | Test data | Type | Expected result | Actual result | Pass? |
|---|---|---|---|---|---|---|
| 1 | Valid mark accepted | 73 | Normal | "Mark saved" | "Mark saved" | ✓ |
| 2 | Upper limit accepted | 100 | Boundary | "Mark saved" | "Mark saved" | ✓ |
| 3 | Just above the limit rejected | 101 | Boundary | "Mark must be 0–100" | "Mark saved" | ✗ — fix the `<=` condition |
| 4 | Text rejected | abc | Erroneous | "Enter a number" | "Enter a number" | ✓ |
| 5 | Empty field rejected | (blank) | Erroneous | "Mark is required" | Program crashed | ✗ — add a presence check |
:::

:::steps What to do when a test fails
- Record the **actual result** and mark the test as **failed**.
- Find the **cause** — trace the code or use a debugger.
- **Correct** the code.
- **Re-run** the failed test **and** the earlier tests (**regression testing**) to make sure nothing else has broken.
:::

:::cards
### Dry run and trace table
- Following the code **by hand** with test data, writing the value of each variable after every step in a **trace table**.
- Finds **logic errors** before the program is run.
### Black-box testing
- Tests **inputs and outputs** against the requirements **without looking at the code** — normal, boundary and erroneous data.
### White-box testing
- Tests are chosen **from the code**, so that **every branch and loop** is executed at least once.
### Testing by users
- **Alpha** testing by the developers' team; **beta** testing by real users before release; **acceptance** testing by the client.
:::

:::example A dry run with a trace table
```python
total = 0
for n in [4, -1, 6]:
    if n > 0:
        total = total + n
print(total)
```
| n | n > 0 | total |
|---|---|---|
| — | — | 0 |
| 4 | True | 4 |
| −1 | False | 4 |
| 6 | True | 10 |

Output **10** — matches the expected result (sum of the positive numbers).
:::

# Exam practice and summary
@lo 11.5.4.10 11.5.4.11 11.5.4.12

:::example Exam-style answers
**Q: A program accepts the number of midfielders mid = 3, 4 or 5. Give examples of data that test the variable mid. [2]**
Extreme: **3** (or 5) (1); erroneous: any number that is not 3, 4 or 5, e.g. **9**, or a non-numeric value (1).

**Q: A field accepts a whole number of tickets from 1 to 10. Complete a test plan with one normal, one boundary and one erroneous value. [3]**
Normal **5** → accepted (1); boundary **10** → accepted (1); erroneous **15** / "two" → rejected with an error message (1).

**Q: Explain why boundary data is used in testing. [2]**
It checks the program accepts the values **at the limits** (1) and finds **off-by-one errors** in comparisons such as `<` instead of `<=` (1).

**Q: Explain why expected results are written before testing. [2]**
So that the **actual result** can be **compared** with them (1) and errors noticed; working out the result after the run may just copy a wrong output (1).
:::

:::warning Common mistakes
- Giving a **boundary** value that is not the exact limit (e.g. 98 for a range 0–100).
- Giving only **one** erroneous value when several kinds exist (range, type, missing).
- Forgetting the **expected result** — every test needs one.
- Calling "−1" normal data for a range 0–100 — it is **boundary (just outside)** or **erroneous**.
- Testing only with normal data — it does **not** find off-by-one or validation errors.
:::

:::steps Check yourself
- Define normal, boundary and erroneous data with an example for a range 1–50.
- Give test data for a password that must be 8–12 characters long.
- What columns does a test plan have?
- What should happen when a test fails?
- Explain the difference between black-box and white-box testing.
- Dry-run a short loop and record it in a trace table.
:::
