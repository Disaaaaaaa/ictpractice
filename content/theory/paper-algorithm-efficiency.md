---
summary: What makes an algorithm efficient; time efficiency — counting basic operations, best, average and worst cases, Big O notation and its rules, the common complexity classes and how they grow, the complexity of linear search, binary search, bubble sort and insertion sort with worked counts; space efficiency — the extra memory an algorithm needs; practical ways to optimise code for time and for space, worked optimisation examples and the time–space trade-off.
---
# Efficiency of algorithms
@lo 11.5.2.6@paper 11.5.2.7@paper

:::definition Algorithm efficiency
How well an algorithm uses **resources** as the size of its input **n** grows: **time** (how many steps / how long it runs) and **space** (how much memory it needs). Two algorithms can give the **same result** with very different efficiency.
:::

:::cards
### Time efficiency
- How the **number of operations** — and so the running time — grows with **n**.
- A time-efficient algorithm finishes quickly even for large inputs.
### Space efficiency
- How much **extra memory** (variables, arrays, stack space) the algorithm needs as **n** grows.
- A space-efficient algorithm uses little memory — important on phones and embedded devices.
### Why efficiency matters
- Data sets are **huge** (millions of records): an inefficient algorithm can take hours instead of seconds.
- Faster programs give a better **user experience**, use **less energy** and cost less to run on servers.
:::

# Time efficiency
@lo 11.5.2.6@paper

:::definition Time complexity
How the **number of steps** (and so the running time) of an algorithm **grows as the size of the input *n* grows**. It is usually described for the **worst case** using **Big O notation**.
:::

:::cards
### Counting basic operations
- We do not measure seconds (they depend on the computer); we **count** the **basic operations**: comparisons, assignments, arithmetic.
- A statement **outside** loops runs **once**; a statement inside a loop runs **as many times as the loop repeats**.
### Best, average and worst case
- **Best case** — the input that needs the **fewest** steps (the item is first in the list).
- **Worst case** — the input that needs the **most** steps (the item is last or not present).
- **Average case** — the typical number of steps.
- Big O normally describes the **worst case**, so we know the **upper limit**.
:::

```pseudocode | Counting the operations of a single loop — O(n)
total ← 0                          // 1 operation
FOR i ← 1 TO n
    total ← total + A[i]           // runs n times
NEXT i
OUTPUT total                       // 1 operation
// about n + 2 operations → O(n)
```

```pseudocode | Counting the steps of nested loops — O(n²)
count ← 0
FOR i ← 1 TO n
    FOR j ← 1 TO n
        count ← count + 1      // runs n × n times
    NEXT j
NEXT i
```

```pseudocode | Halving the problem each time — O(log n)
steps ← 0
WHILE n > 1
    n ← n DIV 2                    // n is halved
    steps ← steps + 1
ENDWHILE
// n = 1024 → 10 steps (2¹⁰ = 1024)
```

:::compare Big O rules
| Rule | Example |
|---|---|
| Keep only the **dominant** (fastest-growing) term | n² + 3n + 5 → **O(n²)** |
| **Ignore constants** | 3n + 5 → **O(n)**; 100 → **O(1)** |
| Loops **one after another** → add | O(n) + O(n) = O(n) |
| Loops **inside each other** → multiply | O(n) × O(n) = **O(n²)** |
| Halving (or doubling) each step | **O(log n)** |
:::

:::compare Common complexities
| Big O | Name | Example | Steps for n = 1000 |
|---|---|---|---|
| O(1) | Constant | Access `A[5]`; push onto a stack | 1 |
| O(log n) | Logarithmic | **Binary search** | ≈ 10 |
| O(n) | Linear | **Linear search**; finding the maximum | 1000 |
| O(n log n) | Linearithmic | Merge sort, quick sort (average) | ≈ 10 000 |
| O(n²) | Quadratic | **Bubble sort**, **insertion sort**; nested loops | 1 000 000 |
| O(2ⁿ) | Exponential | Trying every subset | astronomically large |
:::

:::compare How fast they grow
| n | log₂ n | n | n² | 2ⁿ |
|---|---|---|---|---|
| 10 | ≈ 3 | 10 | 100 | 1024 |
| 100 | ≈ 7 | 100 | 10 000 | ≈ 1.3 × 10³⁰ |
| 1000 | ≈ 10 | 1000 | 1 000 000 | — |
| 1 000 000 | ≈ 20 | 1 000 000 | 10¹² | — |
:::

# Efficiency of searching and sorting
@lo 11.5.2.6@paper

:::compare Searching and sorting algorithms
| Algorithm | Best case | Worst case | Notes |
|---|---|---|---|
| Linear search | O(1) — first item | O(n) — last item or absent | Works on **unsorted** data |
| Binary search | O(1) — middle item | O(log n) | Data must be **sorted** |
| Bubble sort | O(n) — already sorted (with a "swapped" flag) | O(n²) | Simple; many swaps |
| Insertion sort | O(n) — already sorted | O(n²) — reverse order | Good for small or nearly sorted lists |
:::

:::example Binary search: how many iterations in the worst case?
Each comparison **halves** the list. For 100 items: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 → at most **7** comparisons, because 2⁷ = 128 ≥ 100. In general the worst case is ⌈log₂(n + 1)⌉ comparisons.

| Number of items n | Worst-case comparisons — linear search | Worst-case comparisons — binary search |
|---|---|---|
| 100 | 100 | 7 |
| 1000 | 1000 | 10 |
| 1 000 000 | 1 000 000 | 20 |
:::

:::example Bubble sort: number of comparisons
Without the "swapped" flag, bubble sort makes (n − 1) + (n − 2) + … + 1 = **n(n − 1) / 2** comparisons.
- n = 5 → 4 + 3 + 2 + 1 = **10** comparisons.
- n = 10 → **45**; n = 1000 → **499 500** ≈ n² / 2 → **O(n²)**.

With the flag, an **already sorted** list needs only **one pass** of n − 1 comparisons → best case **O(n)**.
:::

:::callout info Choosing an algorithm
For a **sorted** phone book of 100 names, **binary search** (O(log n), 7 steps) is far better than linear search (up to 100 steps). For a list that changes all the time and is **unsorted**, linear search may be better because sorting first costs O(n²) with a simple sort.
:::

# Optimising for time
@lo 11.5.2.6@paper

:::cards
### Ways to improve time efficiency
- **Select the most appropriate algorithm** — binary instead of linear search on sorted data.
- **Minimise loop iterations** — stop early with a flag or `BREAK` when the answer is found; use a larger step.
- **Exclude redundant operations** — do not repeat the same calculation inside a loop; move it before the loop.
- **Use efficient data structures** — an index or hash table instead of searching the whole table.
- **Use built-in operators** — `L ^ K` instead of a loop of K multiplications.
:::

:::example Optimising "count the even numbers"
```pseudocode
N ← 100
K ← 0
FOR i FROM 0 TO N
   IF i MOD 2 = 0
   K = K + 1
ENDIF
ENDFOR
PRINT K
```
**Purpose:** counts (and prints) the number of **even numbers** from 0 to 100 → **51**. The loop runs **101** times and does a MOD test each time.

**Optimised versions:**
- Step through the even numbers only — `FOR i FROM 0 TO N STEP 2  K ← K + 1` → **51** iterations, no MOD test.
- Or no loop at all: `PRINT N DIV 2 + 1` → **one** calculation, and the variables `i` and `K` are not needed (better space efficiency too).
:::

:::example Replacing a loop with an operator
```pseudocode
Lp ← 1
FOR i FROM 1 TO K DO
   Lp ← Lp * L          // K multiplications
ENDFOR
```
Replace with `Lp ← L ^ K` — the **K repeated multiplications** become **one** operation, so the number of iterations is reduced.
:::

:::example Searching with early exit
```python
found = False
for name in names:
    if name == target:
        found = True
        break            # stop as soon as the name is found
```
Without `break` the loop always checks **all n** names; with it, the **average** number of comparisons is about **n / 2**.
:::

# Space efficiency
@lo 11.5.2.7@paper

:::definition Space complexity
The amount of **extra memory** an algorithm needs, as a function of the input size *n* (not counting the input itself).
:::

:::compare
| Algorithm | Extra memory | Why |
|---|---|---|
| Bubble sort, insertion sort | **O(1)** | Sort **in place** — only a temporary variable for swapping |
| Linear / binary search (iterative) | O(1) | A few index variables |
| Merge sort | O(n) | Needs an extra array to merge into |
| Recursive binary search | O(log n) | Each recursive call uses stack space |
| Copying data into a new array | O(n) | A second array of the same size |
:::

:::cards
### Ways to improve space efficiency
- **Choose appropriate data structures** — a 1D array instead of a 2D array when only one value per item is needed.
- **Eliminate duplicate data** — do not keep two copies of the same list.
- **Remove unnecessary variables** — calculate a value directly in the output instead of storing it in an extra variable.
- **Sort in place** instead of creating a new array.
- Use **suitable data types** — an integer instead of a real, a Boolean instead of a string "yes"/"no".
- **Release memory** that is no longer needed (close files, delete large temporary lists).
:::

:::example Removing intermediate variables
```pseudocode
Lp ← L ^ K
Poisson ← (Lp * Ep) / factorial
OUTPUT Poisson
```
Can become `OUTPUT (L ^ K * Ep) / factorial` — the variables **Lp** and **Poisson** are no longer needed, so less memory is used.
:::

:::compare Time–space trade-off
| Faster but more memory | Slower but less memory |
|---|---|
| Store results in a lookup table or cache | Recalculate each time |
| Merge sort — O(n log n) time, O(n) space | Insertion sort — O(n²) time, O(1) space |
| Keep an index for searching a database | Search the table row by row |
:::

# Exam practice and summary
@lo 11.5.2.6@paper 11.5.2.7@paper

:::example Exam-style answers
**Q: The array PhoneBook stores 100 names in alphabetical order and binary search is used. Determine the time complexity. [1]**
**O(log N)** — log₂ 100 (1).

**Q: How many iterations will the algorithm take in the worst case? [1]**
**7** — because 2⁷ = 128 ≥ 100 (1).

**Q: State two actions that can optimise a code in terms of time-efficiency. [2]**
Select the **most appropriate algorithm** (1); **minimise loop iterations** / exclude **redundant** operations / use efficient data structures (1).

**Q: State one action that can optimise a code in terms of space-efficiency. [1]**
Choose **appropriate data structures** / **eliminate duplicate data** / remove unnecessary variables (1).
:::

:::warning Common mistakes
- Saying binary search is O(n) — it is **O(log n)**, but only on **sorted** data.
- Counting the loop **range wrongly**: `FOR i FROM 0 TO 100` runs **101** times.
- Keeping constants in Big O: write O(n), not O(3n + 5).
- Confusing **time** efficiency (number of steps) with **space** efficiency (memory).
:::

:::steps Check yourself
- Give the Big O of a single loop, two nested loops and a loop that halves n.
- How many comparisons does binary search need in the worst case for 1000 items?
- How many comparisons does bubble sort make for 6 items without the flag?
- Optimise a loop that counts multiples of 5 from 0 to 1000.
- Give three ways to improve time efficiency and two ways to improve space efficiency.
- Explain the time–space trade-off with an example.
:::
