---
summary: Execution (runtime) errors that occur when a program starts or runs, and testing with normal, extreme and erroneous data.
---
# Execution errors at program startup
@lo 12.5.3.1

:::definition Execution (runtime) error
An error that happens **while the program is running** — the code is syntactically correct, but an operation is impossible, so the program **crashes** or stops with an error message.
:::

:::compare Typical execution errors
| Error | Example | How to prevent |
|---|---|---|
| Division by zero | `average = total / count` when `count = 0` | Check `count > 0` before dividing |
| Index out of range | `marks[10]` in an array of 10 elements (indexes 0–9) | Check the index against the array bounds |
| File not found | Opening `data.txt` that does not exist | Check the file exists; use exception handling |
| Type conversion | `int("twelve")` | Validate input; `try … except` |
| Missing resource at startup | Database server not running, missing library (DLL), no network | Check the connection and show a clear message |
| Out of memory / stack overflow | Infinite recursion, very large arrays | Base case in recursion; limits on data size |
:::

```python | Handling errors when the program starts
try:
    with open("settings.txt") as f:
        settings = f.read()
except FileNotFoundError:
    print("Settings file missing — using default settings.")
    settings = "default"
```

# Testing with normal, extreme and erroneous data
@lo 12.5.3.2, 12.5.3.3, 12.5.3.4

:::cards
### Normal data
Typical valid data that the program **should accept** and process correctly. *Age 16 for a field that accepts 14–18.*
### Extreme (boundary) data
Valid data **at the very limits** of the accepted range. *Ages 14 and 18.* (Boundary testing often also tries 13 and 19, just outside.)
### Erroneous (abnormal) data
Data that **should be rejected** — wrong type, out of range, wrong format, missing. *Ages 30, −2, "sixteen", blank.*
:::

:::example Test plan for: "Enter the number of persons (1–4) for the quest game"
| Test | Data | Type | Expected result |
|---|---|---|---|
| 1 | 2 | Normal | Accepted, registration continues |
| 2 | 1 | Extreme | Accepted |
| 3 | 4 | Extreme | Accepted |
| 4 | 0 | Erroneous (just outside the range) | "Choose 1–4 persons" |
| 5 | 7 | Erroneous | "Choose 1–4 persons" |
| 6 | two | Erroneous (wrong type) | "Enter a number" |
:::

:::example PIN code: exactly 4 digits
- Normal: `5821`
- Extreme: `0000`, `9999`
- Erroneous: `582` (too short), `58210` (too long), `58a1` (not digits), blank
:::

:::tip
Mark schemes accept **extreme = the largest and smallest valid values**. Write the **expected outcome** for every item of test data, not only the value.
:::
