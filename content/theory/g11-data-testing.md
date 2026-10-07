---
summary: Testing a program with normal, boundary and erroneous data, choosing test values and recording results in a test plan.
---
# Normal test data
@lo 11.5.4.10

:::definition Normal (valid) data
Typical, **sensible data that the program should accept** and process correctly.
:::

Purpose: to check that the program gives the **correct results** for ordinary input.

# Boundary test data
@lo 11.5.4.11

:::definition Boundary (extreme) data
Data **at the edges of the valid range** — the largest and smallest values that should be accepted, and often the values just outside them.
:::

Purpose: to check that comparisons such as `<` and `<=` are written correctly — off-by-one errors are very common.

# Erroneous test data
@lo 11.5.4.12

:::definition Erroneous (invalid / abnormal) data
Data that **should be rejected**: outside the range, of the wrong type, the wrong format or missing.
:::

Purpose: to check that the program **does not crash** and gives a suitable **error message**.

:::example Choosing test data: a mark must be a whole number from 0 to 100
| Type | Test values | Expected result |
|---|---|---|
| Normal | 45, 73 | Accepted |
| Boundary | 0, 100 (accepted); −1, 101 (rejected) | As stated |
| Erroneous | −20, 250, "abc", empty, 45.5 | Rejected with an error message |
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

:::tip
For each test data item the exam expects: the **value**, its **type** (normal/boundary/erroneous) and the **expected outcome**. Choose boundary values from the **exact limits in the question**.
:::
