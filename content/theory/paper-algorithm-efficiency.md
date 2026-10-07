---
summary: Time efficiency (counting steps, Big O notation) and space efficiency of algorithms, with linear search, binary search, bubble sort and insertion sort as examples.
---
# Time efficiency of algorithms
@lo 11.5.2.6@paper

:::definition Time complexity
How the **number of steps** (and so the running time) of an algorithm **grows as the size of the input *n* grows**. It is usually described for the **worst case** using **Big O notation**.
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

:::example Binary search: how many iterations in the worst case?
Each comparison **halves** the list. For 100 items: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 → at most **7** comparisons, because 2⁷ = 128 ≥ 100. In general the worst case is ⌈log₂(n + 1)⌉ comparisons.
:::

:::compare Searching and sorting algorithms
| Algorithm | Best case | Worst case | Notes |
|---|---|---|---|
| Linear search | O(1) — first item | O(n) — last item or absent | Works on **unsorted** data |
| Binary search | O(1) — middle item | O(log n) | Data must be **sorted** |
| Bubble sort | O(n) — already sorted (with a "swapped" flag) | O(n²) | Simple; many swaps |
| Insertion sort | O(n) — already sorted | O(n²) — reverse order | Good for small or nearly sorted lists |
:::

```pseudocode | Counting the steps of nested loops — O(n²)
count ← 0
FOR i ← 1 TO n
    FOR j ← 1 TO n
        count ← count + 1      // runs n × n times
    NEXT j
NEXT i
```

:::tip
To find the complexity, look at the **loops**: one loop over the data → O(n); two nested loops → O(n²); halving the data each step → O(log n). Ignore constants: 3n + 5 is O(n).
:::

# Space efficiency of algorithms
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

:::compare Time–space trade-off
| Faster but more memory | Slower but less memory |
|---|---|
| Store results in a lookup table or cache | Recalculate each time |
| Merge sort — O(n log n) time, O(n) space | Insertion sort — O(n²) time, O(1) space |
| Keep an index for searching a database | Search the table row by row |
:::
