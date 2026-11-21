---
summary: Abstract data types; how a stack (LIFO) and a queue (FIFO) work, their operations (push, pop, peek, enqueue, dequeue, is_empty, is_full) and pointers; tracing operations; implementing a stack, a linear queue and a circular queue with an array; overflow and underflow; priority queues; and where stacks and queues are used.
---
# Abstract data types and data structures
@lo 12.5.2.1

Every program stores data while it runs: the names in a class register, the moves in a game, the documents waiting for a printer, the web pages a user has visited. How that data is **organised** decides how easily the program can add, find and remove items. A **data structure** is a way of organising data in memory so that it can be used efficiently. You already know some: a **variable** holds one value, an **array** holds a fixed number of values of the same type side by side, a **record** groups different fields that belong together.

This topic is about two structures that are used everywhere in computing — the **stack** and the **queue**. They are not new ways of storing bits; they are simply **rules about the order** in which items are added and removed. A stack always gives back the item that arrived **last**; a queue always gives back the item that arrived **first**. Those two rules turn out to match a huge number of real problems, from the Undo button in a word processor to the way an operating system shares the processor between programs.

## Thinking in terms of operations

When you use a stack, you do not need to know where in memory the items are kept. You only need to know what you are allowed to do with it: put an item on top, take the top item off, look at the top item, and ask whether the stack is empty. This way of describing a structure — by **what it does** rather than **how it is built** — is called an **abstract data type**.

:::definition Abstract data type (ADT)
A **data type defined by the operations** that can be carried out on it and how they behave, **not** by how it is stored. A stack and a queue are ADTs: we know what **push** or **enqueue** do without knowing whether an **array** or a **linked list** is used inside.
:::

:::definition Data structure
A way of **organising and storing data in memory** so that it can be accessed and changed efficiently, for example an **array**, a **record**, a **stack** or a **queue**. The data structure is the concrete **implementation** of an ADT.
:::

The difference matters in practice. Two programmers can write two completely different stacks — one using an array, one using a linked list — and a third programmer who only calls `push` and `pop` will not notice any difference. This is an example of **abstraction**: hiding the details that the user of the structure does not need, so that the rest of the program is simpler and the inside can be changed or improved later without breaking anything. It is the same idea as a car's steering wheel: the driver knows that turning it left turns the car left, and does not need to know whether the steering is hydraulic or electric.

An ADT has three parts: the **data** it holds (a collection of items), the **operations** allowed on it (with their names, inputs and results), and the **rules** the operations must follow (for example "pop returns the item that was pushed most recently"). In the exam, when you are asked to *describe the operation* of a stack or queue, you are being asked for exactly these three things: what is stored, which operations exist, and in which order items come out.

## Two different orders: LIFO and FIFO

:::svg A stack has one open end; a queue has two
<svg class="sq" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A stack of four items with push and pop at the top, beside a queue of four items with enqueue at the rear and dequeue at the front">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .box{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .new{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.sq .out{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.sq .v{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .ar{stroke:var(--foreground);stroke-width:2;fill:none}
    svg.sq .wall{stroke:var(--border);stroke-width:3;fill:none}
  </style>
  <text class="t" x="40" y="28">Stack — LIFO (one end: the top)</text>
  <path class="wall" d="M90 70 V270 H230 V70"/>
  <rect class="out" x="100" y="110" width="120" height="36" rx="6"/><text class="v" x="160" y="133" text-anchor="middle">D (top)</text>
  <rect class="box" x="100" y="150" width="120" height="36" rx="6"/><text class="v" x="160" y="173" text-anchor="middle">C</text>
  <rect class="box" x="100" y="190" width="120" height="36" rx="6"/><text class="v" x="160" y="213" text-anchor="middle">B</text>
  <rect class="box" x="100" y="230" width="120" height="36" rx="6"/><text class="v" x="160" y="253" text-anchor="middle">A (bottom)</text>
  <path class="ar" d="M120 50 V100 M114 92 L120 100 L126 92"/><text class="s" x="60" y="48">push</text>
  <path class="ar" d="M200 100 V50 M194 58 L200 50 L206 58"/><text class="s" x="212" y="56">pop</text>
  <text class="t" x="330" y="28">Queue — FIFO (two ends: front and rear)</text>
  <path class="wall" d="M420 120 H700 M420 200 H700"/>
  <rect class="out" x="430" y="140" width="60" height="44" rx="6"/><text class="v" x="460" y="167" text-anchor="middle">A</text>
  <rect class="box" x="500" y="140" width="60" height="44" rx="6"/><text class="v" x="530" y="167" text-anchor="middle">B</text>
  <rect class="box" x="570" y="140" width="60" height="44" rx="6"/><text class="v" x="600" y="167" text-anchor="middle">C</text>
  <rect class="new" x="640" y="140" width="60" height="44" rx="6"/><text class="v" x="670" y="167" text-anchor="middle">D</text>
  <path class="ar" d="M420 162 H350 M358 156 L350 162 L358 168"/><text class="s" x="340" y="225">dequeue (front)</text>
  <path class="ar" d="M750 162 H708 M716 156 L708 162 L716 168"/><text class="s" x="630" y="225">enqueue (rear)</text>
  <text class="s" x="430" y="255">A arrived first, so A leaves first</text>
  <text class="s" x="100" y="290">D arrived last, so D leaves first</text>
</svg>
:::

:::cards
### Stack — LIFO
**Last In, First Out.** Items are added and removed at the **same end**, the **top**. Like a pile of plates in a canteen: you take the plate that was put on last, and you cannot pull one from the middle without the pile falling.
### Queue — FIFO
**First In, First Out.** Items are added at the **rear (tail)** and removed from the **front (head)**. Like the line at a bus stop in Astana: the first person to arrive is the first to get on.
:::

A useful way to remember the difference is to ask "**where does the next item leave from?**" In a stack it leaves from the same place the last item arrived. In a queue it leaves from the opposite end. Everything else — the pointers, the error checks, the uses — follows from this one difference.

## Static and dynamic implementations

Because a stack or queue is an ADT, it can be built in more than one way. In this course you will mostly implement them with an **array**, which is a **static** data structure: its size is fixed when it is declared. The alternative is a **linked list**, a **dynamic** structure in which each item stores a pointer to the next item and memory is requested only when a new item is added.

:::definition Static data structure
A data structure whose **size is fixed** when the program is written or the structure is created, for example an array of 10 elements. It can become **full**, and unused spaces still take up memory.
:::

:::definition Dynamic data structure
A data structure that can **grow and shrink while the program runs**, by allocating and freeing memory for each item, for example a linked list. It becomes full only when the computer runs out of free memory (the **heap**).
:::

:::compare Static vs dynamic implementation
| | Static (array) | Dynamic (linked list) |
|---|---|---|
| Size | **Fixed** maximum — can become **full** | Grows and shrinks as needed |
| Memory | Reserved in advance; empty spaces are wasted | Uses only what is needed, plus a pointer per item |
| Access to the n-th item | Direct, by index — fast | Must follow pointers from the start — slower |
| Needed checks | **is_full** and **is_empty** | Mainly **is_empty** |
| Typical use | When the maximum number of items is known (a keyboard buffer of 16 keys) | When the number of items is unpredictable (undo history) |
:::

Choosing between them is a trade-off. An array-based stack is simple, fast and predictable, which is why it is used inside processors and operating systems, but the programmer must choose a maximum size and must handle the situation where it is reached. A linked-list stack never needs a size limit, but every item costs extra memory for its pointer and the program must manage memory carefully. In the exam, if a question says "a stack is implemented as an array of 20 elements", you must always think about the **full** case as well as the **empty** case.

# How a stack works
@lo 12.5.2.1

A **stack** is a collection of items in which items are added and removed at only one end, called the **top**. The other end, the **bottom**, holds the item that has been in the stack the longest. Because the item at the top is always the most recently added one, a stack is described as **LIFO — last in, first out**.

:::definition Stack
An abstract data type in which items are **added (pushed) and removed (popped) at the same end, the top**, so the **last item added is the first item removed (LIFO)**.
:::

Think of a stack of exam papers on the teacher's desk. Each student places their paper on top of the pile. When the teacher starts marking, they pick up the paper on top — the one handed in last. To reach the very first paper, every paper above it must be removed first. You cannot take a paper from the middle, and you cannot add one at the bottom. These restrictions are not a weakness: they are exactly what makes the stack useful, because the program always knows which item it will get next.

## Stack operations

:::compare Stack operations
| Operation | What it does | Changes the stack? | Error case |
|---|---|---|---|
| `push(data)` | Adds an element to the **top** of the stack | Yes — one more item | **Overflow** if the stack is full |
| `pop()` | **Removes** and returns the element on the **top** | Yes — one fewer item | **Underflow** if the stack is empty |
| `peek()` (or `top()`) | Returns a **copy** of the top element **without removing** it | No | Nothing to return if empty |
| `is_empty()` | Returns TRUE if the stack holds **no items** | No | — |
| `is_full()` | Returns TRUE if the stack is at **maximum capacity** (array version) | No | — |
| `size()` | Returns the **number of items** in the stack | No | — |
:::

The two operations that change the stack are **push** and **pop**. Every other operation only *inspects* it. A very common exam error is to confuse **pop** and **peek**: both return the top item, but pop also takes it away, while peek leaves the stack exactly as it was. If you peek three times in a row you get the same value three times; if you pop three times you get three different values (unless some are equal).

## The stack pointer

To know where the top is, a stack keeps a single variable called the **stack pointer** or **top pointer**.

:::definition Stack pointer (top pointer)
A variable holding the **position (index) of the top item** of the stack. It **increases by 1 on push** and **decreases by 1 on pop**. When the stack is empty it is **0** (with an array indexed from 1) or **−1** (indexed from 0).
:::

Only one pointer is needed because items enter and leave at the same place. This is one of the clearest differences from a queue, which needs two pointers. The value of the pointer also tells you **how many items** are in the stack when the array starts at index 1: if Top = 4 there are four items, in positions 1 to 4.

:::svg Push and pop move the top pointer
<svg class="sq" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three snapshots of a five-element array stack: after pushing 5, 8 and 2 Top is 3; after pop Top is 2; after push 7 Top is 3 and 7 overwrites 2">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .cell{fill:var(--surface-2);stroke:var(--border);stroke-width:2}
    svg.sq .used{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .stale{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:5 4}
    svg.sq .v{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .p{font:600 13px system-ui,sans-serif;fill:var(--danger)}
    svg.sq .ar{stroke:var(--danger);stroke-width:2;fill:none}
  </style>
  <g transform="translate(40,20)">
    <text class="t" x="0" y="14">push 5, 8, 2</text>
    <rect class="cell" x="20" y="40" width="90" height="36"/><text class="s" x="0" y="63">5</text>
    <rect class="cell" x="20" y="76" width="90" height="36"/><text class="s" x="0" y="99">4</text>
    <rect class="used" x="20" y="112" width="90" height="36"/><text class="v" x="65" y="135" text-anchor="middle">2</text><text class="s" x="0" y="135">3</text>
    <rect class="used" x="20" y="148" width="90" height="36"/><text class="v" x="65" y="171" text-anchor="middle">8</text><text class="s" x="0" y="171">2</text>
    <rect class="used" x="20" y="184" width="90" height="36"/><text class="v" x="65" y="207" text-anchor="middle">5</text><text class="s" x="0" y="207">1</text>
    <path class="ar" d="M160 130 H118 M126 124 L118 130 L126 136"/><text class="p" x="165" y="135">Top = 3</text>
  </g>
  <g transform="translate(290,20)">
    <text class="t" x="0" y="14">pop() → 2</text>
    <rect class="cell" x="20" y="40" width="90" height="36"/><text class="s" x="0" y="63">5</text>
    <rect class="cell" x="20" y="76" width="90" height="36"/><text class="s" x="0" y="99">4</text>
    <rect class="stale" x="20" y="112" width="90" height="36"/><text class="s" x="65" y="135" text-anchor="middle">2 (old)</text><text class="s" x="0" y="135">3</text>
    <rect class="used" x="20" y="148" width="90" height="36"/><text class="v" x="65" y="171" text-anchor="middle">8</text><text class="s" x="0" y="171">2</text>
    <rect class="used" x="20" y="184" width="90" height="36"/><text class="v" x="65" y="207" text-anchor="middle">5</text><text class="s" x="0" y="207">1</text>
    <path class="ar" d="M160 166 H118 M126 160 L118 166 L126 172"/><text class="p" x="165" y="171">Top = 2</text>
  </g>
  <g transform="translate(540,20)">
    <text class="t" x="0" y="14">push(7)</text>
    <rect class="cell" x="20" y="40" width="90" height="36"/><text class="s" x="0" y="63">5</text>
    <rect class="cell" x="20" y="76" width="90" height="36"/><text class="s" x="0" y="99">4</text>
    <rect class="used" x="20" y="112" width="90" height="36"/><text class="v" x="65" y="135" text-anchor="middle">7</text><text class="s" x="0" y="135">3</text>
    <rect class="used" x="20" y="148" width="90" height="36"/><text class="v" x="65" y="171" text-anchor="middle">8</text><text class="s" x="0" y="171">2</text>
    <rect class="used" x="20" y="184" width="90" height="36"/><text class="v" x="65" y="207" text-anchor="middle">5</text><text class="s" x="0" y="207">1</text>
    <path class="ar" d="M160 130 H118 M126 124 L118 130 L126 136"/><text class="p" x="165" y="135">Top = 3</text>
  </g>
  <text class="s" x="40" y="275">The pop does not erase 2 — it only moves Top down. The next push overwrites position 3.</text>
</svg>
:::

## Overflow and underflow

Two error situations must be handled by every stack. They are named after what goes wrong: either there is **too much** (it overflows) or **too little** (it underflows).

:::cards
### Stack overflow
Trying to **push** onto a stack that is **full** — there is no free space, so the item cannot be stored. With an array of 10 elements this happens when Top = 10. Without a check, the program would write past the end of the array and corrupt other data.
### Stack underflow
Trying to **pop** (or peek) from a stack that is **empty** — there is no item to return. With an array indexed from 1 this happens when Top = 0. Without a check, Top would become −1 and the program would read rubbish.
:::

A well-written program always **checks before it acts**: `is_full()` before push and `is_empty()` before pop. The check is not optional decoration — it is part of the definition of the operation. In real computers the processor's own stack is used to remember where to return after each subroutine call; if a program calls subroutines too deeply (for example, a recursive function that never reaches its base case) the stack runs out of space and the program crashes with a "stack overflow" error. That is where the name of the well-known programmers' website comes from.

## Tracing a stack

Exam questions very often give a sequence of operations and ask you to show the contents of the stack, the value returned and the pointer after each one. The safest method is a **trace table** with one row per operation.

:::steps How to trace stack operations
- Draw columns: **Operation**, **Stack (bottom → top)**, **Returned**, **Top**.
- Start with the given state (usually empty, Top = 0).
- For **push**: write the new item on the **right** (the top) and add 1 to Top.
- For **pop**: remove the **rightmost** item, write it under Returned and subtract 1 from Top.
- For **peek**: write the rightmost item under Returned; the stack and Top **do not change**.
- Before each pop, check the stack is not empty; before each push, check it is not full — write "underflow" or "overflow" if it is.
:::

:::example Stack trace
Start empty. `push(5)`, `push(8)`, `push(2)`, `pop()`, `push(7)`, `peek()`, `pop()`.
| Operation | Stack (bottom → top) | Returned | Top pointer |
|---|---|---|---|
| push(5) | 5 | — | 1 |
| push(8) | 5, 8 | — | 2 |
| push(2) | 5, 8, 2 | — | 3 |
| pop() | 5, 8 | 2 | 2 |
| push(7) | 5, 8, 7 | — | 3 |
| peek() | 5, 8, 7 | 7 | 3 |
| pop() | 5, 8 | 7 | 2 |

Notice that **peek** returned 7 and the next **pop** also returned 7 — peek did not remove it. The values come out in the **reverse** of the order they went in.
:::

:::example From one state to another
State A (bottom → top): **Java, Python, Kotlin**. State B: **Java, C#, C++**.

1. Compare the two states from the **bottom**. Both start with Java; they differ from position 2.
2. Everything **above** Java must be removed: `pop()` (removes Kotlin), `pop()` (removes Python).
3. Now push the new items **in order from bottom to top**: `push("C#")`, then `push("C++")`.

Four operations are needed. You **cannot** remove Python without first removing Kotlin, because only the top item is accessible. Strings are written in quotes in the operations.
:::

:::widget stack_queue Push, pop, enqueue and dequeue
:::

# Implementing a stack with an array
@lo 12.5.2.1

To build a stack in a program we need two things: an **array** to hold the items and an **integer variable** for the top pointer. The array has a fixed size, so this is a **static** stack. We will index the array from 1, as in the school pseudocode, so the empty stack has Top = 0.

## Push: check, move the pointer, store

The order of the steps in push is important. The pointer always points at the **current top item**. To add a new item we must first move the pointer to the **next free space** and only then store the item there. If we stored first, we would overwrite the current top item.

:::steps Algorithm for push
- Check whether the stack is **full** (Top = maximum size).
- If it is full, report **stack overflow** and do not add the item.
- Otherwise **add 1 to Top**.
- Store the new item in the array at position **Top**.
:::

## Pop: check, read, move the pointer

Pop is the mirror image. We must check that there is something to remove, read the item at position Top, and then move Top down by one. The value is not erased from the array — it is simply no longer part of the stack, because the stack is defined as positions 1 to Top. The next push will overwrite it.

:::steps Algorithm for pop
- Check whether the stack is **empty** (Top = 0).
- If it is empty, report **stack underflow** and return nothing (or a rogue value such as −1).
- Otherwise **read** the item at position **Top**.
- **Subtract 1** from Top and return the item.
:::

```pseudocode | Stack in an array of 10 elements
DECLARE Stack : ARRAY[1:10] OF INTEGER
DECLARE Top : INTEGER
CONSTANT MaxSize = 10
Top ← 0                                  // empty stack

PROCEDURE Push(Item : INTEGER)
    IF Top = MaxSize THEN
        OUTPUT "Stack overflow"          // full
    ELSE
        Top ← Top + 1                    // move the pointer up first
        Stack[Top] ← Item
    ENDIF
ENDPROCEDURE

FUNCTION Pop() RETURNS INTEGER
    DECLARE Item : INTEGER
    IF Top = 0 THEN
        OUTPUT "Stack underflow"         // empty
        RETURN -1
    ELSE
        Item ← Stack[Top]
        Top ← Top - 1                    // move the pointer down
        RETURN Item
    ENDIF
ENDFUNCTION

FUNCTION Peek() RETURNS INTEGER
    IF Top = 0 THEN
        RETURN -1
    ENDIF
    RETURN Stack[Top]                    // the pointer does not change
ENDFUNCTION

FUNCTION IsEmpty() RETURNS BOOLEAN
    RETURN Top = 0
ENDFUNCTION

FUNCTION IsFull() RETURNS BOOLEAN
    RETURN Top = MaxSize
ENDFUNCTION
```

Look carefully at how each subroutine uses the pointer. `IsEmpty` and `IsFull` only compare Top with a value; they never change it. `Peek` reads `Stack[Top]` and leaves Top unchanged. Only `Push` and `Pop` change Top, and they change it in **opposite orders**: push changes the pointer **before** storing, pop reads **before** changing the pointer. If you remember "the pointer always points at the top item", you can work out the order every time instead of memorising it.

## Zero-based arrays

Many languages, including Python, number array positions from **0**. Then the empty stack has Top = **−1**, the first item goes into position 0, and the stack is full when Top = MaxSize − 1. The algorithm is identical; only the boundary values change. In the exam, read the declaration carefully — `ARRAY[1:10]` or `ARRAY[0:9]` — and use the matching values.

:::compare Boundary values for a stack of 10 items
| | Array indexed 1–10 | Array indexed 0–9 |
|---|---|---|
| Top when empty | 0 | −1 |
| Position of first item | 1 | 0 |
| Top when full | 10 | 9 |
| Number of items | Top | Top + 1 |
| Overflow test | Top = 10 | Top = 9 |
| Underflow test | Top = 0 | Top = −1 |
:::

```python | The same stack in Python (a list used as a stack)
stack = []
MAX = 10

def push(item):
    if len(stack) == MAX:
        print("Stack overflow")
    else:
        stack.append(item)      # adds at the end = the top

def pop():
    if len(stack) == 0:
        print("Stack underflow")
        return None
    return stack.pop()          # removes from the end = the top

push(5); push(8)
print(stack[-1])               # peek → 8
print(pop())                   # 8
print(len(stack) == 0)         # is_empty → False
```

In Python a list already behaves like a dynamic stack: `append` pushes onto the end and `pop()` removes from the end. The end of the list plays the role of the top. A Python list can grow until memory runs out, so the `MAX` check above is only there to imitate a fixed-size array as in the exam.

:::tip Popping does not erase
In an array implementation, **pop** only moves the pointer — the old value stays in the array until it is overwritten by the next **push**. The stack contents are only the items **from position 1 up to Top**. If an exam question shows the array after some pops, the "old" values may still be visible beyond Top — they are **not** part of the stack.
:::

:::example Implementing a stack for a cafeteria tray counter
A school canteen in Shymkent tracks the trays on a spring-loaded holder that takes at most **6** trays. The program uses `Trays : ARRAY[1:6]` and `Top`.

1. Start: Top = 0 (no trays).
2. Six trays are pushed with numbers 11, 12, 13, 14, 15, 16. After the sixth push Top = 6.
3. A seventh tray arrives: `IsFull()` returns TRUE, so the program outputs **"Stack overflow"** and the tray is not stored.
4. Three students each take a tray: pops return **16, 15, 14**; Top = 3.
5. The holder now contains 11, 12, 13 (bottom → top). Positions 4–6 still hold 14, 15, 16 in memory, but they are outside the stack.

This shows both error checks and why pop leaves old values in the array.
:::

:::warning Common mistakes when coding a stack
- Storing the item **before** increasing Top in push — the new item overwrites the current top.
- Decreasing Top **before** reading the item in pop — the wrong item is returned (unless you return `Stack[Top + 1]`).
- Forgetting the **full** check in push or the **empty** check in pop, or putting the check **after** the pointer has already changed.
- Using `Top > 10` instead of `Top = 10` for full — by then you have already written past the end.
- Mixing 0-based and 1-based boundary values in the same answer.
:::

# Uses of stacks
@lo 12.5.2.1

Stacks appear whenever a program has to **remember things in order and come back to them in reverse**. The rule "the most recent thing first" is exactly how undoing, returning and backtracking work.

## Subroutine calls and the call stack

When a program calls a subroutine, the processor must remember **where to come back to** once the subroutine finishes. It pushes the **return address** (together with the subroutine's parameters and local variables, called a **stack frame**) onto the **call stack**. If that subroutine calls another, a second frame is pushed on top. When the inner subroutine ends, its frame is popped and the program returns to the address stored there — the most recent caller. This is LIFO: the subroutine that was called **last** must finish **first**.

:::definition Call stack
A stack used by the processor or run-time system to store a **stack frame** for each active subroutine call: the **return address**, parameters and local variables. A frame is **pushed on call** and **popped on return**.
:::

:::svg The call stack while Main calls CalcTotal, which calls AddTax
<svg class="sq" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three snapshots of the call stack: Main only; Main and CalcTotal; Main, CalcTotal and AddTax; then AddTax is popped on return">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .f1{fill:var(--surface-2);stroke:var(--border);stroke-width:2}
    svg.sq .f2{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .f3{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.sq .v{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
  </style>
  <g transform="translate(30,30)"><text class="t" x="0" y="0">1. Program starts</text>
    <rect class="f1" x="0" y="170" width="150" height="44" rx="6"/><text class="v" x="75" y="197" text-anchor="middle">Main</text></g>
  <g transform="translate(215,30)"><text class="t" x="0" y="0">2. Call CalcTotal</text>
    <rect class="f2" x="0" y="120" width="150" height="44" rx="6"/><text class="v" x="75" y="138" text-anchor="middle">CalcTotal</text><text class="s" x="75" y="156" text-anchor="middle">return → Main line 12</text>
    <rect class="f1" x="0" y="170" width="150" height="44" rx="6"/><text class="v" x="75" y="197" text-anchor="middle">Main</text></g>
  <g transform="translate(400,30)"><text class="t" x="0" y="0">3. Call AddTax</text>
    <rect class="f3" x="0" y="70" width="150" height="44" rx="6"/><text class="v" x="75" y="88" text-anchor="middle">AddTax</text><text class="s" x="75" y="106" text-anchor="middle">return → CalcTotal 5</text>
    <rect class="f2" x="0" y="120" width="150" height="44" rx="6"/><text class="v" x="75" y="147" text-anchor="middle">CalcTotal</text>
    <rect class="f1" x="0" y="170" width="150" height="44" rx="6"/><text class="v" x="75" y="197" text-anchor="middle">Main</text></g>
  <g transform="translate(585,30)"><text class="t" x="0" y="0">4. AddTax returns</text>
    <rect class="f2" x="0" y="120" width="150" height="44" rx="6"/><text class="v" x="75" y="147" text-anchor="middle">CalcTotal</text>
    <rect class="f1" x="0" y="170" width="150" height="44" rx="6"/><text class="v" x="75" y="197" text-anchor="middle">Main</text></g>
  <text class="s" x="30" y="262">The last subroutine called (AddTax) is the first to finish — its frame is popped and control returns to CalcTotal.</text>
</svg>
:::

**Recursion** relies on the same mechanism. Each recursive call pushes a new frame with its own copy of the local variables. When the base case is reached the frames are popped one by one, and each call finishes its work in reverse order. If there is no base case, frames are pushed until the stack is full — a stack overflow.

## Undo and the Back button

A text editor stores each action (typing a word, deleting a line, changing a font) on an **undo stack**. Pressing **Undo** pops the most recent action and reverses it. Pressing Undo again pops the action before that. A stack is the right choice because the user always wants to cancel the **latest** change first; undoing an action from the middle while later changes depend on it would make no sense. Many editors keep a second stack for **Redo**: every undone action is pushed onto the redo stack, and typing anything new empties it. A web browser's **Back** button works in the same way, with each visited page pushed onto a history stack.

## Checking brackets

A compiler must check that brackets in code are **balanced and correctly nested**. Every opening bracket is pushed; when a closing bracket arrives, the top item is popped and must be the matching opening bracket. A stack works because the bracket opened **most recently** must be closed **first**.

:::example Checking brackets with a stack
Check `( [ ] ( ) )` from left to right.
| Symbol | Action | Stack (bottom → top) |
|---|---|---|
| ( | push | ( |
| [ | push | ( [ |
| ] | pop `[` — matches | ( |
| ( | push | ( ( |
| ) | pop `(` — matches | ( |
| ) | pop `(` — matches | empty |

Every pop matched and the stack is **empty** at the end, so the brackets are **balanced**. For `( [ ) ]` the `)` pops `[` — **mismatch**. For `( ( )` the stack still holds `(` at the end — an opening bracket was never closed. For `( ) )` the last `)` tries to pop an empty stack — **underflow**, a closing bracket with no partner.
:::

## Evaluating expressions in reverse Polish notation

In **reverse Polish notation (RPN, postfix)** the operator is written **after** its operands: `3 + 4` becomes `3 4 +`, and `(3 + 4) × 2` becomes `3 4 + 2 ×`. No brackets are needed. A computer evaluates RPN with a stack: read the symbols left to right; **push** every number; when an operator appears, **pop two** numbers, apply the operator and **push** the result. At the end the single value left on the stack is the answer. For `3 4 + 2 ×`: push 3, push 4, `+` pops 4 and 3 and pushes 7, push 2, `×` pops 2 and 7 and pushes 14. The answer is 14.

## Reversing and backtracking

Pushing the letters of `ASTANA` one by one and then popping them all gives `ANATSA` — the reverse — because the last letter in is the first out. **Backtracking** uses the same idea: a program solving a maze pushes each junction it passes; at a dead end it pops back to the most recent junction and tries another path. This is **depth-first search**.

:::compare Uses of a stack and why LIFO fits
| Use | What is pushed | Why LIFO is needed |
|---|---|---|
| Subroutine calls / recursion | Return address, parameters, local variables | The most recently called subroutine must return first |
| Undo in an editor | Each action the user performs | The latest change must be undone first |
| Browser Back button | Each page visited | Back goes to the most recent previous page |
| Bracket checking | Each opening bracket | The most recently opened bracket must be closed first |
| Evaluating RPN | Numbers and intermediate results | An operator uses the two most recent values |
| Backtracking (maze, DFS) | Each junction or choice made | Return to the most recent choice first |
:::

# Exam practice: stacks
@lo 12.5.2.1

:::example Exam-style answers
**Q: Describe how a stack operates. [3]**
Items are added and removed at **one end only, the top** (1); the **last item added is the first removed — LIFO** (1); **push** adds to the top and **pop** removes from the top, using a **top pointer** that is increased / decreased (1).

**Q: Stack A (bottom → top): Java, Python, Kotlin. Write the operations to reach Java, C#, C++. [2]**
`pop()`, `pop()` (1); `push("C#")`, `push("C++")` (1).

**Q: State the difference between pop and peek. [2]**
Pop **removes** the top item and returns it (1); peek **returns** the top item **without removing** it / the pointer does not change (1).

**Q: A stack is stored in ARRAY[1:8] with pointer Top. Describe the steps to push an item. [3]**
Check whether **Top = 8** / the stack is full; if so report overflow (1); otherwise **add 1 to Top** (1); store the item in **Stack[Top]** (1).

**Q: Explain why a stack is used to store actions for Undo. [2]**
Undo must reverse the **most recent** action first (1); a stack is **LIFO**, so the last action pushed is the first popped (1).

**Q: Explain what is meant by stack underflow. [1]**
An attempt to **pop / remove** an item from an **empty** stack (1).
:::

:::warning Common mistakes in exam answers
- Writing "LIFO" when the question asks you to **name the structure** — the answer is "stack".
- Popping from the **bottom** of a stack, or taking an item from the middle.
- Treating **peek** as if it removed the item in a trace.
- Swapping **overflow** (push when full) and **underflow** (pop when empty).
- Writing values without quotes, e.g. push(C#) instead of push("C#").
:::

:::steps Check yourself
- Define an abstract data type and explain why a stack is one.
- Trace: push(3), push(9), pop(), push(4), peek(), pop(), pop() — what is returned each time and what is Top?
- Write the pseudocode for Push and Pop with overflow and underflow checks.
- Why does pop not need to erase the value from the array?
- Explain how the call stack lets a subroutine return to the right place.
- Use a stack to evaluate `5 1 2 + 4 × +` (answer: 17).
:::

# How a queue works
@lo 12.5.2.1

A **queue** is a collection of items in which items are added at one end, the **rear** (or **tail**), and removed from the other end, the **front** (or **head**). The item that has waited longest is always the next to leave, so a queue is **FIFO — first in, first out**. This is exactly how a fair line works at a shop till, a bank or a passport desk at Almaty airport: newcomers join at the back and the person at the front is served next. Nobody is allowed to push in, and nobody leaves from the middle.

:::definition Queue
An abstract data type in which items are **added at the rear (enqueue)** and **removed from the front (dequeue)**, so the **first item added is the first item removed (FIFO)**.
:::

Queues are used whenever a resource can serve **only one request at a time** and requests must be handled **in the order they arrive**. A printer can print one document at a time; a processor core can run one instruction stream at a time; a call-centre operator can answer one call at a time. While the resource is busy, new requests wait in a queue, and fairness means the oldest request is handled first.

## Queue operations

:::compare Queue operations
| Operation | What it does | Changes the queue? | Error case |
|---|---|---|---|
| `enqueue(data)` | Adds an element at the **rear** of the queue | Yes — one more item | **Queue full** (overflow) |
| `dequeue()` | **Removes** and returns the element at the **front** | Yes — one fewer item | **Queue empty** (underflow) |
| `peek()` (front) | Returns a **copy** of the front element without removing it | No | Nothing to return if empty |
| `is_empty()` | Returns TRUE if the queue holds **no items** | No | — |
| `is_full()` | Returns TRUE if there is **no free space** (array version) | No | — |
| `size()` | Returns the **number of items** | No | — |
:::

The names are different from a stack's but the pattern is the same: two operations change the structure, the others only inspect it, and both changing operations need a check first. The errors are often called **queue overflow** (enqueue when full) and **queue underflow** (dequeue when empty).

## Front and rear pointers

Because items enter at one end and leave at the other, a queue needs **two** pointers.

:::definition Front and rear pointers
A queue uses **two pointers**: **Front (head)** — the position of the **next item to leave**; **Rear (tail)** — the position of the **last item added**. Enqueue moves **Rear**; dequeue moves **Front**.
:::

:::svg Enqueue moves the rear pointer, dequeue moves the front pointer
<svg class="sq" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An array of six cells holding A, B, C with Front at 1 and Rear at 3; after dequeue Front moves to 2; after enqueue D Rear moves to 4">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .cell{fill:var(--surface-2);stroke:var(--border);stroke-width:2}
    svg.sq .used{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .v{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .f{font:600 13px system-ui,sans-serif;fill:var(--success)}
    svg.sq .r{font:600 13px system-ui,sans-serif;fill:var(--danger)}
  </style>
  <g transform="translate(40,20)"><text class="t" x="0" y="14">Start: A, B, C enqueued</text>
    <g transform="translate(0,30)">
      <rect class="used" x="0" width="50" height="40"/><text class="v" x="25" y="26" text-anchor="middle">A</text>
      <rect class="used" x="50" width="50" height="40"/><text class="v" x="75" y="26" text-anchor="middle">B</text>
      <rect class="used" x="100" width="50" height="40"/><text class="v" x="125" y="26" text-anchor="middle">C</text>
      <rect class="cell" x="150" width="50" height="40"/><rect class="cell" x="200" width="50" height="40"/><rect class="cell" x="250" width="50" height="40"/>
      <text class="f" x="5" y="62">↑ Front=1</text><text class="r" x="100" y="62">↑ Rear=3</text></g></g>
  <g transform="translate(400,20)"><text class="t" x="0" y="14">dequeue() → A</text>
    <g transform="translate(0,30)">
      <rect class="cell" x="0" width="50" height="40"/>
      <rect class="used" x="50" width="50" height="40"/><text class="v" x="75" y="26" text-anchor="middle">B</text>
      <rect class="used" x="100" width="50" height="40"/><text class="v" x="125" y="26" text-anchor="middle">C</text>
      <rect class="cell" x="150" width="50" height="40"/><rect class="cell" x="200" width="50" height="40"/><rect class="cell" x="250" width="50" height="40"/>
      <text class="f" x="50" y="62">↑ Front=2</text><text class="r" x="140" y="62">↑ Rear=3</text></g></g>
  <g transform="translate(220,140)"><text class="t" x="0" y="14">enqueue(D)</text>
    <g transform="translate(0,30)">
      <rect class="cell" x="0" width="50" height="40"/>
      <rect class="used" x="50" width="50" height="40"/><text class="v" x="75" y="26" text-anchor="middle">B</text>
      <rect class="used" x="100" width="50" height="40"/><text class="v" x="125" y="26" text-anchor="middle">C</text>
      <rect class="used" x="150" width="50" height="40"/><text class="v" x="175" y="26" text-anchor="middle">D</text>
      <rect class="cell" x="200" width="50" height="40"/><rect class="cell" x="250" width="50" height="40"/>
      <text class="f" x="50" y="62">↑ Front=2</text><text class="r" x="150" y="62">↑ Rear=4</text></g></g>
</svg>
:::

Notice that the items themselves **do not move** in the array. Moving every item one place to the left after each dequeue would be slow for a long queue, so instead the program simply moves the **Front** pointer forward. The queue is "everything from Front to Rear".

Because a queue is an ADT, the program that uses it does not care whether it is built from an array or a linked list. With a linked list, Front points at the first node and Rear at the last; enqueue creates a new node and links it after Rear, dequeue unlinks the first node and moves Front to the next one. A linked-list queue never becomes full until memory runs out, but each item needs extra space for its pointer. In this course the array versions — **linear** and **circular** — are the ones you must be able to trace and write in pseudocode.

## Tracing a queue

:::steps How to trace queue operations
- Draw columns: **Operation**, **Queue (front → rear)**, **Returned**, **Front**, **Rear**.
- For **enqueue**: add 1 to Rear and write the item on the **right** (the rear).
- For **dequeue**: write the **leftmost** item (the front) under Returned and add 1 to Front.
- For **peek**: write the front item; nothing changes.
- Check for empty before dequeue and for full before enqueue.
:::

:::example Queue trace
Start empty (Front = 1, Rear = 0). `enqueue(A)`, `enqueue(B)`, `enqueue(C)`, `dequeue()`, `enqueue(D)`, `dequeue()`.
| Operation | Queue (front → rear) | Returned | Front | Rear |
|---|---|---|---|---|
| enqueue(A) | A | — | 1 | 1 |
| enqueue(B) | A, B | — | 1 | 2 |
| enqueue(C) | A, B, C | — | 1 | 3 |
| dequeue() | B, C | A | 2 | 3 |
| enqueue(D) | B, C, D | — | 2 | 4 |
| dequeue() | C, D | B | 3 | 4 |

Items leave in the **same order** they arrived: A, then B. Compare this with a stack, where they leave in **reverse** order.
:::

# Linear queues in an array
@lo 12.5.2.1

The simplest way to implement a queue is a **linear queue**: an array plus a Front and a Rear pointer that only ever move **forward**. With an array indexed from 1, the empty queue starts with Front = 1 and Rear = 0, so that the first enqueue puts the item in position 1. The queue is empty whenever **Front > Rear**.

:::definition Linear queue
A queue implemented in an array in which the **front and rear pointers only move forwards** towards the end of the array; spaces freed at the front by dequeue are **not reused**.
:::

:::steps Algorithm for enqueue (linear queue)
- Check whether **Rear = maximum size**. If so, report **queue full**.
- Otherwise **add 1 to Rear**.
- Store the item at position **Rear**.
:::

:::steps Algorithm for dequeue (linear queue)
- Check whether the queue is **empty** (Front > Rear). If so, report **queue empty**.
- Otherwise read the item at position **Front**.
- **Add 1 to Front** and return the item.
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
    DECLARE Item : STRING
    IF Front > Rear THEN
        RETURN "Queue empty"
    ELSE
        Item ← Queue[Front]
        Front ← Front + 1
        RETURN Item
    ENDIF
ENDFUNCTION
```

## The problem with a linear queue

The linear queue is easy to understand but it has a serious weakness. Every dequeue moves Front forwards, and Front never comes back. The positions **before** Front are free, but the enqueue algorithm only looks at Rear, so it can never use them. Once Rear reaches the end of the array the queue reports **full**, even if almost every item has already been removed.

:::svg A linear queue that reports "full" with only two items in it
<svg class="sq" viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An eight-cell array where positions 1 to 6 are wasted after dequeues and only positions 7 and 8 hold items; Rear equals 8 so the queue reports full">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .waste{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
    svg.sq .used{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .v{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .f{font:600 13px system-ui,sans-serif;fill:var(--success)}
    svg.sq .r{font:600 13px system-ui,sans-serif;fill:var(--danger)}
  </style>
  <text class="t" x="40" y="28">8 enqueued, 6 dequeued: Front = 7, Rear = 8</text>
  <g transform="translate(40,50)">
    <rect class="waste" x="0" width="80" height="44"/><rect class="waste" x="80" width="80" height="44"/><rect class="waste" x="160" width="80" height="44"/>
    <rect class="waste" x="240" width="80" height="44"/><rect class="waste" x="320" width="80" height="44"/><rect class="waste" x="400" width="80" height="44"/>
    <rect class="used" x="480" width="80" height="44"/><text class="v" x="520" y="28" text-anchor="middle">G</text>
    <rect class="used" x="560" width="80" height="44"/><text class="v" x="600" y="28" text-anchor="middle">H</text>
    <text class="s" x="40" y="28" text-anchor="middle">1</text><text class="s" x="120" y="28" text-anchor="middle">2</text><text class="s" x="200" y="28" text-anchor="middle">3</text>
    <text class="s" x="280" y="28" text-anchor="middle">4</text><text class="s" x="360" y="28" text-anchor="middle">5</text><text class="s" x="440" y="28" text-anchor="middle">6</text>
    <text class="f" x="485" y="66">↑ Front=7</text><text class="r" x="570" y="66">↑ Rear=8</text>
    <text class="s" x="0" y="100">Positions 1–6 are free but can never be used again.</text>
    <text class="s" x="0" y="120">enqueue(I) → Rear = 8 = maximum → "Queue full"</text>
  </g>
</svg>
:::

One fix is to **shuffle** all the items to the start of the array after each dequeue, but for a queue of thousands of items that means thousands of moves every time, which is slow. A much better fix is to let the pointers **wrap round** to the start of the array: a **circular queue**.

:::warning The problem with a linear queue
Each **dequeue** moves Front forward, so the spaces at the **start** of the array are never used again. After 10 enqueues a 10-element linear queue reports **"full"** even if most items have been removed. Do not answer "because the array is full" — explain that the **freed spaces at the front cannot be reused**.
:::

# Circular queues
@lo 12.5.2.1

A **circular queue** (also called a **ring buffer**) uses the same array and the same two pointers, but treats the array as if its last position were joined to its first. When Rear reaches the end of the array and there is free space at the start, the next item goes into **position 1**. Front wraps round in exactly the same way. Freed spaces are therefore reused, and the queue is full only when **every** position holds an item.

:::definition Circular queue
A queue in an array where the **pointers wrap round** to the start of the array when they reach the end, so freed spaces at the front are **reused**. A **count** of items (or a comparison of the pointers) shows whether it is empty or full.
:::

:::svg A circular queue of 8 positions drawn as a ring
<svg class="sq" viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eight positions arranged in a ring. Items are in positions 6, 7, 8 and 1. Front is 6 and Rear has wrapped to 1. Positions 2 to 5 are free">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .cell{fill:var(--surface-2);stroke:var(--border);stroke-width:2}
    svg.sq .used{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .v{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .f{font:600 13px system-ui,sans-serif;fill:var(--success)}
    svg.sq .r{font:600 13px system-ui,sans-serif;fill:var(--danger)}
    svg.sq .ring{fill:none;stroke:var(--border);stroke-width:2;stroke-dasharray:4 4}
  </style>
  <circle class="ring" cx="200" cy="165" r="110"/>
  <g>
    <rect class="used" x="178" y="35" width="44" height="40" rx="6"/><text class="v" x="200" y="60" text-anchor="middle">K</text><text class="s" x="200" y="28" text-anchor="middle">1</text>
    <rect class="cell" x="256" y="67" width="44" height="40" rx="6"/><text class="s" x="312" y="80">2</text>
    <rect class="cell" x="288" y="145" width="44" height="40" rx="6"/><text class="s" x="340" y="170">3</text>
    <rect class="cell" x="256" y="223" width="44" height="40" rx="6"/><text class="s" x="312" y="258">4</text>
    <rect class="cell" x="178" y="255" width="44" height="40" rx="6"/><text class="s" x="200" y="312" text-anchor="middle">5</text>
    <rect class="used" x="100" y="223" width="44" height="40" rx="6"/><text class="v" x="122" y="248" text-anchor="middle">H</text><text class="s" x="82" y="258">6</text>
    <rect class="used" x="68" y="145" width="44" height="40" rx="6"/><text class="v" x="90" y="170" text-anchor="middle">I</text><text class="s" x="50" y="170">7</text>
    <rect class="used" x="100" y="67" width="44" height="40" rx="6"/><text class="v" x="122" y="92" text-anchor="middle">J</text><text class="s" x="82" y="80">8</text>
  </g>
  <text class="t" x="420" y="60">Front = 6 (H leaves next)</text>
  <text class="t" x="420" y="90">Rear = 1 (K was added last)</text>
  <text class="t" x="420" y="120">Count = 4</text>
  <text class="s" x="420" y="160">After position 8 the rear pointer</text>
  <text class="s" x="420" y="180">wrapped round: (8 MOD 8) + 1 = 1</text>
  <text class="s" x="420" y="220">Positions 2–5 are free and</text>
  <text class="s" x="420" y="240">will be used by the next enqueues.</text>
</svg>
:::

## Wrapping round with MOD

The wrap-round is done with the **MOD** operator, which gives the remainder after division. With an array indexed from **1 to N**, the next position after p is `(p MOD N) + 1`. For N = 5: after 3 comes (3 MOD 5) + 1 = 4; after 5 comes (5 MOD 5) + 1 = 0 + 1 = **1**. With an array indexed from **0 to N − 1**, the formula is simply `(p + 1) MOD N`: after 4 comes (4 + 1) MOD 5 = 0. Both formulas do the same job; use the one that matches the array declaration in the question. An equivalent way that students often find clearer is an IF statement: "add 1 to Rear; if Rear > N then Rear ← 1".

## Knowing when the queue is empty or full

In a linear queue, "Front > Rear" meant empty. In a circular queue that test no longer works, because after wrapping round Rear can be **smaller** than Front even when the queue has items in it (in the ring above, Front = 6 and Rear = 1 with four items). The simplest solution is to keep a third variable, **Count**, the number of items: enqueue adds 1, dequeue subtracts 1, the queue is **empty when Count = 0** and **full when Count = N**.

```pseudocode | Circular queue of 5 elements
DECLARE Queue : ARRAY[1:5] OF STRING
DECLARE Front, Rear, Count : INTEGER
CONSTANT N = 5
Front ← 1
Rear ← 0
Count ← 0

PROCEDURE Enqueue(Item : STRING)
    IF Count = N THEN
        OUTPUT "Queue full"
    ELSE
        Rear ← (Rear MOD N) + 1          // 5 wraps round to 1
        Queue[Rear] ← Item
        Count ← Count + 1
    ENDIF
ENDPROCEDURE

FUNCTION Dequeue() RETURNS STRING
    DECLARE Item : STRING
    IF Count = 0 THEN
        RETURN "Queue empty"
    ELSE
        Item ← Queue[Front]
        Front ← (Front MOD N) + 1        // Front wraps round too
        Count ← Count - 1
        RETURN Item
    ENDIF
ENDFUNCTION
```

The structure of these subroutines is the same as for the linear queue — check, move pointer / read, update — with two additions: the pointer moves with MOD so that it wraps, and Count is updated in both operations. If you forget to update Count, the full and empty tests stop working.

:::example Circular queue trace (5 spaces)
| Operation | Array positions 1–5 | Front | Rear | Count |
|---|---|---|---|---|
| enqueue A, B, C, D | A B C D _ | 1 | 4 | 4 |
| dequeue() → A | _ B C D _ | 2 | 4 | 3 |
| dequeue() → B | _ _ C D _ | 3 | 4 | 2 |
| enqueue(E) | _ _ C D E | 3 | 5 | 3 |
| enqueue(F) | **F** _ C D E | 3 | **1** | 4 |
| enqueue(G) | F **G** C D E | 3 | 2 | 5 |
| enqueue(H) | F G C D E | 3 | 2 | 5 → **Queue full** |

Rear wrapped from 5 to **1**: (5 MOD 5) + 1 = 1. A linear queue would have reported "full" already at enqueue(F), with only three items in it. The circular queue becomes full only when all five positions are used. The queue in order from front to rear is now **C, D, E, F, G**.
:::

## Empty and full without a Count variable

Some textbooks and exam questions use a circular queue **without** Count. Then the program must decide empty and full by comparing the two pointers alone, and there is a difficulty: if Front is one position after Rear, the queue could be either completely empty or completely full, because both situations look the same. Two common solutions exist. The first is to **leave one position always unused**: the queue is then **empty** when the position after Rear is Front, and **full** when the position **two** places after Rear is Front (only the one spare slot is left between them), so the two situations no longer look the same. The second is to set both pointers to a special value such as **−1 or 0 when the queue becomes empty**, and reset them when the first item is added again. Both work, but both are easier to get wrong than a simple Count, which is why the Count version is recommended in your own code. In the exam, use whichever method the question describes, and always say **how** the program knows the queue is full or empty — that is often a mark on its own.

## Why circular queues matter in real systems

Circular queues are used wherever data arrives continuously and must be processed in order using a fixed, small amount of memory. A music streaming app on a phone downloads the next few seconds of a song into a circular buffer while the speaker plays from the front of the same buffer; the download writes at Rear, playback reads at Front, and both chase each other round the ring. If the network is slow, Count falls towards zero and playback pauses to "buffer"; if the network is fast, the buffer fills and downloading pauses. The same structure is used for network cards receiving packets, for sound recording, and for the keyboard buffer. A linear queue could not do this job, because it would "fill up" after a few seconds even though the data had already been played.

:::compare Linear queue vs circular queue
| | Linear queue | Circular queue |
|---|---|---|
| Pointer movement | Front and Rear only move **forward** | Pointers **wrap round** to position 1 |
| Freed spaces at the front | **Wasted** — never reused | **Reused** |
| Becomes "full" when | Rear reaches the end of the array | **All** positions hold items |
| Empty / full test | Front > Rear / Rear = N | Count = 0 / Count = N (or pointer comparison) |
| Complexity of code | Simplest | Slightly more — MOD and Count |
| Typical use | Short-lived queues, teaching | Keyboard buffers, audio / video streaming, network buffers |
:::

# Priority queues and uses of queues
@lo 12.5.2.1

## Priority queues

Sometimes strict FIFO is not what we want. In a hospital emergency room in Karaganda, a patient with a heart attack must be seen before a patient with a sprained ankle, even if the second patient arrived first. A **priority queue** handles this.

:::definition Priority queue
A queue in which each item has a **priority**; the item with the **highest priority** is removed first, and items with the **same priority** are removed in **FIFO** order (the order they arrived).
:::

A priority queue can be implemented in two simple ways. Either **enqueue** places each new item in the correct position — behind all items of the same or higher priority, in front of all items of lower priority — so that dequeue just removes the front item as usual; or enqueue adds at the rear and **dequeue** searches the whole queue for the highest-priority item. The first approach makes adding slower and removing fast; the second does the opposite. Operating systems use priority queues to decide which process runs next, so that, for example, the process handling mouse movement gets the processor before a background virus scan.

:::svg Inserting into a priority queue (1 = highest priority)
<svg class="sq" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A priority queue holding P1 priority 1, P2 priority 2, P3 priority 2, P4 priority 3. A new job with priority 2 is inserted after P3 and before P4">
  <style>
    svg.sq .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.sq .used{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq .new{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.sq .v{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq .ar{stroke:var(--success);stroke-width:2;fill:none}
  </style>
  <text class="t" x="40" y="28">Front → rear, ordered by priority, FIFO within a priority</text>
  <g transform="translate(40,90)">
    <rect class="used" x="0" width="110" height="52" rx="6"/><text class="v" x="55" y="22" text-anchor="middle">P1</text><text class="s" x="55" y="42" text-anchor="middle">priority 1</text>
    <rect class="used" x="130" width="110" height="52" rx="6"/><text class="v" x="185" y="22" text-anchor="middle">P2</text><text class="s" x="185" y="42" text-anchor="middle">priority 2</text>
    <rect class="used" x="260" width="110" height="52" rx="6"/><text class="v" x="315" y="22" text-anchor="middle">P3</text><text class="s" x="315" y="42" text-anchor="middle">priority 2</text>
    <rect class="used" x="530" width="110" height="52" rx="6"/><text class="v" x="585" y="22" text-anchor="middle">P4</text><text class="s" x="585" y="42" text-anchor="middle">priority 3</text>
    <rect class="new" x="395" y="-60" width="110" height="44" rx="6"/><text class="v" x="450" y="-33" text-anchor="middle">NEW (2)</text>
    <path class="ar" d="M450 -14 V20 M444 12 L450 20 L456 12"/>
    <text class="s" x="0" y="90">The new job (priority 2) goes behind P2 and P3 (same priority, arrived earlier)</text>
    <text class="s" x="0" y="110">but in front of P4 (lower priority). Dequeue still removes from the front: P1.</text>
  </g>
</svg>
:::

## Where queues are used

:::compare Uses of a queue and why FIFO fits
| Use | What waits in the queue | Why FIFO is needed |
|---|---|---|
| **Print queue** (spooling) | Documents sent to a shared printer | Documents are printed in the order they were sent — fair to all users |
| **Keyboard buffer** | Key presses not yet processed | Characters must appear in the order they were typed |
| **Process scheduling** (round robin) | Processes waiting for the CPU | Each process gets a time slice in turn, then rejoins the rear |
| **Breadth-first search** | Nodes still to be visited | Visit nodes level by level, nearest first |
| **Network / streaming buffers** | Data packets or video frames | Data must be used in the order it was sent |
| **Online orders, call centres, ticket booking** | Customers' requests | First come, first served |
:::

The **keyboard buffer** is a classic circular queue. When you type faster than a program can process keys, each key press is enqueued in a small buffer of, say, 16 positions; the program dequeues them in order. If the buffer is full, further key presses are lost and the computer may beep. In **round-robin scheduling** the operating system dequeues the process at the front, lets it run for a short time slice, and if it has not finished, enqueues it again at the rear, so every process gets a fair share of the processor.

:::example Choosing the right structure
A school's IT system in Astana needs three features. For each one, choose a stack or a queue and justify it.

1. **Students' print jobs on the library printer** → **queue**. Jobs must be printed in the order they were sent; a queue is FIFO, so the first job sent is printed first.
2. **Undo in the online timetable editor** → **stack**. Undo must cancel the most recent change first; a stack is LIFO, so the last change pushed is the first popped.
3. **Sending SMS reminders to parents in the order the requests were made** → **queue** (FIFO), but **urgent** messages (e.g. school closed due to frost) should skip ahead → a **priority queue**.

The justification always links the **required order** to **LIFO** or **FIFO**.
:::

## Stacks and queues compared

:::compare Stack vs queue
| | Stack | Queue |
|---|---|---|
| Order | **LIFO** — last in, first out | **FIFO** — first in, first out |
| Ends used | **One** end (top) | **Two** ends (front and rear) |
| Pointers | **One** (top) | **Two** (front, rear) — plus Count in a circular queue |
| Add / remove | push / pop | enqueue / dequeue |
| Look without removing | peek (top item) | peek (front item) |
| Errors | Stack overflow / underflow | Queue full / queue empty |
| Order items come out | **Reverse** of the order they went in | **Same** as the order they went in |
| Typical uses | Undo, call stack, brackets, RPN, backtracking | Printing, keyboard buffer, scheduling, BFS, buffering |
:::

:::warning Common mistakes with queues
- Dequeuing from the **rear** or enqueuing at the **front**.
- Moving **Front** on enqueue or **Rear** on dequeue — enqueue changes Rear, dequeue changes Front.
- Saying a linear queue is full "because there are no spaces" — the freed spaces exist but **cannot be reused**.
- Forgetting to **wrap** the pointer in a circular queue (Rear becomes 6 in an array of 5) or forgetting to update **Count**.
- Testing "Front > Rear" for empty in a circular queue — after wrapping, Rear can be less than Front while the queue still has items.
- Describing a priority queue as "LIFO" — it is priority order, then **FIFO** within a priority.
:::

# Exam practice: queues
@lo 12.5.2.1

:::example Exam-style answers
**Q: Name the data structure where the item that was added first is removed first. [1]**
**Queue** (1). (Not "FIFO" — name the structure.)

**Q: Describe how an item is added to a queue implemented in an array. [3]**
Check the queue is **not full** (1); **increase the rear pointer** (wrapping round in a circular queue) (1); store the item at the **position of the rear pointer** (1).

**Q: Explain why a print server uses a queue. [2]**
Documents must be printed in the **order they were sent** (1); a queue is **FIFO**, so the first document sent is printed first (1).

**Q: Explain the problem with a linear queue and how a circular queue solves it. [3]**
In a linear queue the front pointer moves forward after each dequeue, so **freed spaces at the start are never reused** (1); the queue can report **full when it is not** (1); a circular queue lets the pointers **wrap round** to the start of the array so freed spaces are reused (1).

**Q: A circular queue uses ARRAY[1:6]. Rear = 6 and the queue is not full. State the value of Rear after the next enqueue and show how it is calculated. [2]**
**Rear = 1** (1); (6 MOD 6) + 1 = 0 + 1 = 1 (1).

**Q: Describe a priority queue. [2]**
Each item has a **priority** and the **highest-priority** item is removed first (1); items with **equal priority** are removed in **FIFO** order (1).
:::

:::warning Common mistakes in exam answers
- Writing only "FIFO" when asked to **describe** — also say which end items are added to and removed from.
- In a trace, removing the item at the **rear** on dequeue.
- In a circular queue, forgetting that Rear wraps round to **1** (or 0 for a 0-indexed array).
- Choosing a structure without a **justification** linked to the required order.
:::

:::steps Check yourself
- Explain FIFO with an everyday example and name two computing uses of a queue.
- Trace: enqueue(P), enqueue(Q), dequeue(), enqueue(R), peek(), dequeue() — what is returned, and what are Front and Rear?
- Write the pseudocode for Enqueue and Dequeue in a circular queue with a Count variable.
- In a circular queue of 6 items, Rear = 6. What is Rear after the next enqueue?
- Why does a linear queue waste space? How does a circular queue fix it?
- Give three differences between a stack and a queue.
:::
