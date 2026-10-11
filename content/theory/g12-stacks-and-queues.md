---
summary: Abstract data types; how a stack (LIFO) and a queue (FIFO) work, their operations (push, pop, peek, enqueue, dequeue, is_empty, is_full) and pointers; tracing operations; implementing a stack, a linear queue and a circular queue with an array; overflow and underflow; and where stacks and queues are used.
---
# Abstract data types
@lo 12.5.2.1

:::definition Abstract data type (ADT)
A **data type defined by the operations** that can be carried out on it and how they behave, **not** by how it is stored. A stack and a queue are ADTs: we know what **push** or **enqueue** do without knowing whether an **array** or a **linked list** is used inside.
:::

:::cards
### Stack — LIFO
**Last In, First Out.** Items are added and removed at the **same end**, the **top**. Like a pile of plates: you take the plate that was put on last.
### Queue — FIFO
**First In, First Out.** Items are added at the **rear (tail)** and removed from the **front (head)**. Like a line at a shop: the first person to arrive is served first.
:::

:::compare Static vs dynamic implementation
| | Static (array) | Dynamic (linked list) |
|---|---|---|
| Size | **Fixed** maximum — can become **full** | Grows and shrinks as needed |
| Memory | Reserved in advance; may be wasted | Uses only what is needed (+ pointers) |
| Needed checks | **is_full** and **is_empty** | Mainly **is_empty** |
:::

# Stacks
@lo 12.5.2.1

:::compare Stack operations
| Operation | Description |
|---|---|
| `push(data)` | Adds an element to the **top** of the stack |
| `pop()` | **Removes** and returns the element on the **top** |
| `peek()` (top) | Returns a **copy** of the top element **without removing** it |
| `is_empty()` | Checks whether the stack is **empty** |
| `is_full()` | Checks whether the stack is at **maximum capacity** (fixed-size array) |
:::

:::definition Stack pointer (top pointer)
A variable holding the **position of the top item** of the stack. It increases on **push** and decreases on **pop**. When the stack is empty it is 0 (with an array indexed from 1) or −1 (indexed from 0).
:::

:::cards
### Stack overflow
Trying to **push** onto a stack that is **full**.
### Stack underflow
Trying to **pop** from a stack that is **empty**.
:::

:::example Stack trace
Start empty. `push(5)`, `push(8)`, `push(2)`, `pop()` → returns **2**, `push(7)`, `peek()` → returns **7** (still in the stack), `pop()` → returns **7**.
| Operation | Stack (bottom → top) | Returned | Top pointer |
|---|---|---|---|
| push(5) | 5 | — | 1 |
| push(8) | 5, 8 | — | 2 |
| push(2) | 5, 8, 2 | — | 3 |
| pop() | 5, 8 | 2 | 2 |
| push(7) | 5, 8, 7 | — | 3 |
| peek() | 5, 8, 7 | 7 | 3 |
| pop() | 5, 8 | 7 | 2 |
:::

:::example From one state to another
State A (bottom → top): **Java, Python, Kotlin**. State B: **Java, C#, C++**.
Operations: `pop()` (removes Kotlin), `pop()` (removes Python), `push("C#")`, `push("C++")`. You can only reach Java by removing everything above it — you **cannot** take an item from the middle.
:::

:::widget stack_queue Push, pop, enqueue and dequeue
:::

```pseudocode | Stack in an array of 10 elements
DECLARE Stack : ARRAY[1:10] OF INTEGER
DECLARE Top : INTEGER
Top ← 0                                  // empty stack

PROCEDURE Push(Item : INTEGER)
    IF Top = 10 THEN
        OUTPUT "Stack overflow"          // full
    ELSE
        Top ← Top + 1                    // move the pointer up first
        Stack[Top] ← Item
    ENDIF
ENDPROCEDURE

FUNCTION Pop() RETURNS INTEGER
    IF Top = 0 THEN
        OUTPUT "Stack underflow"         // empty
        RETURN -1
    ELSE
        Top ← Top - 1                    // move the pointer down
        RETURN Stack[Top + 1]
    ENDIF
ENDFUNCTION

FUNCTION Peek() RETURNS INTEGER
    RETURN Stack[Top]                    // the pointer does not change
ENDFUNCTION
```

```python | The same stack in Python (a list)
stack = []
stack.append(5)        # push
stack.append(8)
top = stack[-1]        # peek → 8
item = stack.pop()     # pop  → 8
print(len(stack) == 0) # is_empty → False
```

:::tip Popping does not erase
In an array implementation, **pop** only moves the pointer — the old value stays in the array until it is overwritten by the next **push**. The stack contents are only the items **from position 1 up to Top**.
:::

# Queues
@lo 12.5.2.1

:::compare Queue operations
| Operation | Description |
|---|---|
| `enqueue(data)` | Adds an element at the **rear** of the queue |
| `dequeue()` | **Removes** and returns the element at the **front** |
| `peek()` (front) | Returns a copy of the front element without removing it |
| `is_empty()` / `is_full()` | Checks whether the queue is empty / full |
:::

:::definition Front and rear pointers
A queue uses **two pointers**: **Front (head)** — the position of the **next item to leave**; **Rear (tail)** — the position of the **last item added**.
:::

:::example Queue trace
Start empty. `enqueue(A)`, `enqueue(B)`, `enqueue(C)`, `dequeue()` → returns **A**, `enqueue(D)`, `dequeue()` → returns **B**.
| Operation | Queue (front → rear) | Returned | Front | Rear |
|---|---|---|---|---|
| enqueue(A) | A | — | 1 | 1 |
| enqueue(B) | A, B | — | 1 | 2 |
| enqueue(C) | A, B, C | — | 1 | 3 |
| dequeue() | B, C | A | 2 | 3 |
| enqueue(D) | B, C, D | — | 2 | 4 |
| dequeue() | C, D | B | 3 | 4 |
:::

```pseudocode | Linear queue in an array of 10 elements
DECLARE Queue : ARRAY[1:10] OF STRING
DECLARE Front, Rear : INTEGER
Front ← 1
Rear ← 0                                 // empty: Front > Rear

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

:::warning The problem with a linear queue
Each **dequeue** moves Front forward, so the spaces at the **start** of the array are never used again. After 10 enqueues the queue reports **"full"** even if most items have been removed.
:::

# Circular queues
@lo 12.5.2.1

:::definition Circular queue
A queue in an array where the **pointers wrap round** to the start of the array when they reach the end, so freed spaces at the front are **reused**. A **count** of items (or a comparison of the pointers) shows whether it is empty or full.
:::

```pseudocode | Circular queue of 5 elements
DECLARE Queue : ARRAY[1:5] OF STRING
DECLARE Front, Rear, Count : INTEGER
Front ← 1
Rear ← 0
Count ← 0

PROCEDURE Enqueue(Item : STRING)
    IF Count = 5 THEN
        OUTPUT "Queue full"
    ELSE
        Rear ← (Rear MOD 5) + 1          // 5 wraps round to 1
        Queue[Rear] ← Item
        Count ← Count + 1
    ENDIF
ENDPROCEDURE

FUNCTION Dequeue() RETURNS STRING
    IF Count = 0 THEN
        RETURN "Queue empty"
    ELSE
        Item ← Queue[Front]
        Front ← (Front MOD 5) + 1
        Count ← Count - 1
        RETURN Item
    ENDIF
ENDFUNCTION
```

:::example Circular queue trace (5 spaces)
| Operation | Array positions 1–5 | Front | Rear | Count |
|---|---|---|---|---|
| enqueue A, B, C, D | A B C D _ | 1 | 4 | 4 |
| dequeue() → A | _ B C D _ | 2 | 4 | 3 |
| dequeue() → B | _ _ C D _ | 3 | 4 | 2 |
| enqueue(E) | _ _ C D E | 3 | 5 | 3 |
| enqueue(F) | **F** _ C D E | 3 | **1** | 4 |

Rear wrapped from 5 to **1**: (5 MOD 5) + 1 = 1. A linear queue would already be "full".
:::

:::callout info Priority queue
In a **priority queue** each item has a **priority**; the item with the **highest priority** leaves first, and items with equal priority leave in FIFO order — e.g. urgent jobs in an operating system, or patients in an emergency room.
:::

# Applications
@lo 12.5.2.1

:::compare Where stacks and queues are used
| Stack (LIFO) | Queue (FIFO) |
|---|---|
| **Undo** in editors; **Back** button in browsers | **Print queue** — documents printed in the order sent |
| Storing **return addresses** and local variables when subroutines are called; **recursion** | **Keyboard buffer** — key presses processed in the order typed |
| **Evaluating expressions** (reverse Polish notation) and **checking brackets** | **Scheduling** processes in an operating system (round robin) |
| **Depth-first search**, backtracking (mazes) | **Breadth-first search**; buffering data packets / video streaming |
| Reversing a list or a word | Call centres, ticket booking, online orders |
:::

:::example Checking brackets with a stack
To check `( [ ] ( ) )`: **push** every opening bracket; on a closing bracket **pop** and check it matches. The expression is correct if every pop matches and the stack is **empty** at the end. For `( [ ) ]` the `)` pops `[` — **mismatch**.
:::

:::compare Stack vs queue
| | Stack | Queue |
|---|---|---|
| Order | **LIFO** | **FIFO** |
| Ends used | **One** end (top) | **Two** ends (front and rear) |
| Pointers | **One** (top) | **Two** (front, rear) |
| Add / remove | push / pop | enqueue / dequeue |
| Errors | Overflow / underflow | Queue full / queue empty |
:::

# Exam practice and summary
@lo 12.5.2.1

:::example Exam-style answers
**Q: Name the data structure where the item that was added last is removed first. [1]**
**Stack** (1). (Not "LIFO" — name the structure.)

**Q: Stack A (bottom → top): Java, Python, Kotlin. Write the operations to reach Java, C#, C++. [2]**
`pop()`, `pop()` (1); `push("C#")`, `push("C++")` (1).

**Q: Describe how an item is added to a queue implemented in an array. [3]**
Check the queue is **not full** (1); **increase the rear pointer** (wrapping round in a circular queue) (1); store the item at the **position of the rear pointer** (1).

**Q: Explain why a print server uses a queue. [2]**
Documents must be printed in the **order they were sent** (1); a queue is **FIFO**, so the first document sent is printed first (1).
:::

:::warning Common mistakes
- Popping from the **bottom** of a stack, or dequeuing from the **rear** of a queue.
- Forgetting to **check for full / empty** before push / pop.
- Updating the pointer in the **wrong order** — in a stack push, increase Top **before** storing.
- Writing values without quotes in stack operations, e.g. push(C#) instead of push("C#").
:::

:::steps Check yourself
- Explain LIFO and FIFO with an everyday example.
- Trace: push(3), push(9), pop(), push(4), peek(), pop(), pop() — what is returned?
- Write the pseudocode for Push with an overflow check.
- Why does a linear queue waste space? How does a circular queue fix it?
- In a circular queue of 6 items, Rear = 6. What is Rear after the next enqueue?
- Give two uses of a stack and two of a queue.
:::
