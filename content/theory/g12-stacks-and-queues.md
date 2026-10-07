---
summary: How stacks (LIFO) and queues (FIFO) work, their operations and pointers, implementation with arrays, and where they are used.
---
# Stacks and queues
@lo 12.5.2.1

:::cards
### Stack — LIFO
**Last In, First Out.** Items are added and removed at the **same end** (the top). Like a pile of plates.
### Queue — FIFO
**First In, First Out.** Items are added at the **rear (tail)** and removed from the **front (head)**. Like a line at a shop.
:::

:::compare Operations
| | Stack | Queue |
|---|---|---|
| Add | **Push** — onto the top | **Enqueue** — at the rear |
| Remove | **Pop** — from the top | **Dequeue** — from the front |
| Look without removing | Peek / top | Peek / front |
| Pointers | Top pointer | Front (head) and rear (tail) pointers |
| Error when full | Stack overflow | Queue full |
| Error when empty | Stack underflow | Queue empty |
:::

:::widget stack_queue Push, pop, enqueue and dequeue
:::

:::example Stack trace
Start empty. `push(5)`, `push(8)`, `push(2)`, `pop()` → returns **2**, `push(7)`, `pop()` → returns **7**. Stack now (bottom → top): 5, 8.
:::

:::example Queue trace
Start empty. `enqueue(A)`, `enqueue(B)`, `enqueue(C)`, `dequeue()` → returns **A**, `enqueue(D)`. Queue now (front → rear): B, C, D.
:::

## Implementing a stack with an array

```pseudocode | Stack in an array of 10 elements
DECLARE Stack : ARRAY[1:10] OF INTEGER
DECLARE Top : INTEGER
Top ← 0

PROCEDURE Push(Item : INTEGER)
    IF Top = 10 THEN
        OUTPUT "Stack overflow"
    ELSE
        Top ← Top + 1
        Stack[Top] ← Item
    ENDIF
ENDPROCEDURE

FUNCTION Pop() RETURNS INTEGER
    IF Top = 0 THEN
        OUTPUT "Stack underflow"
        RETURN -1
    ELSE
        Top ← Top - 1
        RETURN Stack[Top + 1]
    ENDIF
ENDFUNCTION
```

## Implementing a queue with an array

```pseudocode | Linear queue
DECLARE Queue : ARRAY[1:10] OF STRING
DECLARE Front, Rear : INTEGER
Front ← 1
Rear ← 0

PROCEDURE Enqueue(Item : STRING)
    IF Rear = 10 THEN
        OUTPUT "Queue full"
    ELSE
        Rear ← Rear + 1
        Queue[Rear] ← Item
    ENDIF
ENDPROCEDURE

FUNCTION Dequeue() RETURNS STRING
    IF Front > Rear THEN
        RETURN "Queue empty"
    ELSE
        Front ← Front + 1
        RETURN Queue[Front - 1]
    ENDIF
ENDFUNCTION
```

:::callout info Circular queue
In a linear queue, space at the front is wasted after dequeuing. A **circular queue** wraps the pointers round to the start of the array (`Rear ← (Rear MOD 10) + 1`), reusing the free space.
:::

:::compare Applications
| Stack | Queue |
|---|---|
| **Undo** in editors, **Back** button in browsers | **Print queue** — documents printed in the order sent |
| Storing **return addresses** when subroutines are called; recursion | **Keyboard buffer** — keys processed in the order pressed |
| Evaluating expressions (reverse Polish notation), checking brackets | **Processor scheduling** of tasks in an OS |
| Depth-first search, backtracking | Breadth-first search; network data packets; call centres |
:::

:::tip
"Identify the data structure that matches the algorithm": if the **last** item added is processed first → **stack**; if items are processed **in the order they arrive** → **queue**.
:::
