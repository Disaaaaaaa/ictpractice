---
summary: Comparing declarative and imperative programming — what a paradigm is, how imperative (procedural, object-oriented) and declarative (logic, query, functional) programs describe a problem, how they are executed and where each is used.
---
# Programming paradigms
@lo 12.5.1.1

:::definition Programming paradigm
A **style or approach** to programming: a way of thinking about a problem and of structuring the program that solves it. Each programming language supports one or more paradigms.
:::

All paradigms fall into two big families. The key question is: **does the programmer write *how* to solve the problem, or only *what* the result must be?**

:::definition Imperative programming
The program is a **sequence of instructions (commands)** that the computer executes **in a defined order**, changing the program's **state** (the values stored in variables). The programmer describes **how** to reach the result, step by step.
:::

:::definition Declarative programming
The program describes **what** the result should be — as **facts, rules, constraints, queries or expressions** — **without** stating the steps or their order. The language system (interpreter, inference engine, query optimiser) decides **how** to compute the result.
:::

:::mermaid The two families of paradigms
flowchart LR
  P[Programming paradigms] --> I[Imperative — HOW]
  P --> D[Declarative — WHAT]
  I --> PR[Procedural: Python, C, Pascal, BASIC]
  I --> OO[Object-oriented: Java, C#, C++, Python]
  I --> AS[Low-level: assembly language]
  D --> LO[Logic: Prolog]
  D --> QU[Query: SQL]
  D --> FU[Functional: Haskell, Lisp, F#]
  D --> MK[Markup / style: HTML, CSS]
:::

:::example Everyday analogy — getting to the school
**Imperative:** "Walk 200 m to the bus stop, take bus 12, get off after 5 stops, turn left, walk 100 m." — every step and its order are given.

**Declarative:** "Take me to Nazarbayev Intellectual School on Turan Avenue." — you say *what* you want; the taxi driver (the "engine") decides the route.
:::

:::callout info Multi-paradigm languages
Many modern languages support more than one paradigm. **Python** is mainly imperative (procedural and object-oriented) but also has declarative features such as list comprehensions, `map` and `filter`. **SQL** is declarative, but database systems can also run imperative stored procedures.
:::

# Imperative programming
@lo 12.5.1.1

Imperative programs reflect how the processor actually works: fetch an instruction, execute it, change a value in memory, move to the next instruction.

:::cards
### Features
- A program is a **sequence of statements** executed **in order**.
- **Variables** hold the program's **state**; **assignment** (`x ← x + 1`) changes it.
- The programmer controls the **flow of execution** with **sequence, selection (IF) and iteration (loops)**.
- The same statement can give different results depending on the current state.
- The programmer is responsible for the **algorithm**.
### Sub-paradigms
- **Procedural** — the program is divided into **procedures and functions** that are called in a sequence (Python, C, Pascal).
- **Object-oriented** — the program is built from **objects** that combine data (attributes) and the procedures that change it (methods) (Java, C#, C++).
- **Low-level** — **assembly language** and machine code are imperative: each instruction changes a register or memory location.
:::

```python | Imperative (procedural) — find the total of the even numbers in a list
numbers = [3, 8, 5, 12, 7, 4]
total = 0                      # state: total
for n in numbers:              # iteration — controlled by the programmer
    if n % 2 == 0:             # selection
        total = total + n      # assignment changes the state
print(total)                   # 24
```

:::compare How the state changes (trace)
| n | n % 2 == 0? | total |
|---|---|---|
| — | — | 0 |
| 3 | No | 0 |
| 8 | Yes | 8 |
| 5 | No | 8 |
| 12 | Yes | 20 |
| 7 | No | 20 |
| 4 | Yes | 24 |
:::

```python | Object-oriented (still imperative) — methods change the object's state
class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0          # attribute = state of the object

    def deposit(self, amount):    # method: a step that changes the state
        self.balance = self.balance + amount

acc = BankAccount("Dana")
acc.deposit(500)
acc.deposit(200)
print(acc.balance)                # 700
```

:::cards
### Advantages of imperative languages
- The programmer has **full control** over every step, so code can be **optimised** for speed and memory.
- Close to how the **hardware** works — efficient; suitable for operating systems, games, embedded systems.
- **Easy to follow** for beginners: the program runs line by line, like a recipe.
- Suitable for almost **any type of problem**.
### Disadvantages
- Programs are often **longer** — every step must be written.
- **Changing state** makes errors harder to find: a variable can be changed in many places.
- The programmer must design the whole **algorithm** — more time and more chance of logic errors.
- Harder to run in **parallel**, because steps depend on the state left by earlier steps.
:::

# Declarative programming
@lo 12.5.1.1

In a declarative program there is **no explicit sequence of instructions**. The programmer writes a **description** of the problem and the result; the execution order is **not clearly delineated** and is decided by the system.

## Logic programming — Prolog

A Prolog program is a **knowledge base** of **facts** and **rules**. The user asks a **query** (goal); Prolog's **inference engine** searches the facts and rules — using **pattern matching** and **backtracking** — to find every answer.

```prolog | Facts, rules and queries in Prolog
% facts: parent(Parent, Child)
parent(asel, timur).
parent(asel, dana).
parent(timur, aru).

% rule: X is a grandparent of Z if X is a parent of Y and Y is a parent of Z
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

% rule: X and Y are siblings if they have the same parent and are different people
sibling(X, Y) :- parent(P, X), parent(P, Y), X \= Y.

% queries
?- grandparent(asel, aru).    % true
?- sibling(dana, Who).        % Who = timur
?- parent(asel, Child).       % Child = timur ; Child = dana
```

:::compare Parts of a Prolog program
| Part | Meaning | Example |
|---|---|---|
| **Fact** | Something that is always true | `parent(asel, timur).` |
| **Rule** | Something that is true **if** its conditions are true (`:-` means "if", `,` means "and") | `grandparent(X, Z) :- parent(X, Y), parent(Y, Z).` |
| **Query / goal** | A question asked of the knowledge base | `?- grandparent(asel, Who).` |
| **Variable** | Starts with a capital letter; Prolog finds the values that make the goal true | `X`, `Who` |
:::

:::steps How Prolog answers ?- grandparent(asel, Who).
- Finds the rule for `grandparent` and needs `parent(asel, Y)` **and** `parent(Y, Who)`.
- First match: `parent(asel, timur)` → `Y = timur`.
- Searches `parent(timur, Who)` → `Who = aru`. **Answer found.**
- If asked for more answers, it **backtracks**: tries `Y = dana`, but there is no `parent(dana, …)` fact, so there are no more answers.
:::

## Query languages — SQL

SQL describes **which data** is wanted; the database's **query optimiser** decides how to find it (which index to use, the order of the searches).

```sql | Declarative (SQL): describe the rows you want, not how to find them
SELECT Name, Score
FROM Students
WHERE Grade = 12 AND Score > 80
ORDER BY Score DESC;
```

```python | The same task written imperatively in Python
result = []
for s in students:
    if s.grade == 12 and s.score > 80:
        result.append((s.name, s.score))
result.sort(key=lambda r: r[1], reverse=True)
```

## Functional programming

A functional program is built from **expressions and functions** that return values **without changing state** (no assignment to variables, no side effects). Repetition is done by **recursion** or by applying functions to whole lists.

```haskell | Functional (Haskell): the total of the even numbers is described as an expression
sumEvens xs = sum (filter even xs)

sumEvens [3, 8, 5, 12, 7, 4]   -- 24
```

```python | Declarative style inside Python
numbers = [3, 8, 5, 12, 7, 4]
print(sum(n for n in numbers if n % 2 == 0))   # 24 — no loop counter, no changing total
```

:::callout info Markup languages
**HTML** and **CSS** are also declarative: a page **describes** the headings, paragraphs and styles it should have; the browser decides how to draw them. They are not programming languages, because they cannot express algorithms (no variables, selection or iteration).
:::

:::cards
### Advantages of declarative languages
- Programs are **shorter** and closer to the **problem description**, so they are quicker to write and easier to read.
- The programmer does not need to design the **algorithm** — the engine finds the solution.
- **No (or little) changing state**, so fewer side-effect errors; easier to **test** and to **run in parallel**.
- Well suited to **searching data**, **knowledge-based systems**, **AI**, **expert systems** and **databases**.
### Disadvantages
- The programmer has **less control** over how the result is calculated, so the program may be **less efficient** (slower, more memory).
- Hard to write programs that need a **fixed sequence** of steps (e.g. controlling a machine, input/output).
- **Debugging** can be harder — it is not obvious in which order the engine worked.
- A different way of thinking — **harder to learn** for programmers used to imperative code.
- Each language suits only certain types of problem.
:::

# Comparing the two paradigms
@lo 12.5.1.1

:::compare Imperative vs declarative
| Criterion | Imperative | Declarative |
|---|---|---|
| Focus | **How** to solve the problem — the algorithm | **What** the result is — the logic / description |
| Program made of | A **clearly defined sequence of instructions** | **Facts, rules, queries or expressions** |
| Order of execution | Set by the programmer; **clearly delineated** | **Not clearly delineated** — decided by the system |
| State | **Variables** are assigned and changed | Little or **no changing state** / no side effects |
| Control structures | Sequence, selection, iteration (loops) | Pattern matching, backtracking, recursion, queries |
| Who finds the solution | The programmer's algorithm | The language engine (inference engine, optimiser) |
| Code length | Usually **longer** | Usually **shorter** for suitable problems |
| Efficiency | Can be **highly optimised** by the programmer | Depends on the engine; may be **less efficient** |
| Typical uses | Applications, games, operating systems, device drivers, embedded systems | Databases, expert systems, AI, natural-language processing, configuration |
| Sub-paradigms | **Procedural, object-oriented** | **Logic, query, functional** |
| Examples | Python, C, C++, Java, C#, Pascal, assembly | **Prolog, SQL, Haskell**, Lisp |
:::

:::example The same problem in both styles — "Is Aru a grandchild of Asel?"
**Imperative (Python):** store the parent pairs in a list, loop through every pair to find Asel's children, then loop again to find their children, and compare each one with "Aru" — the programmer writes all the loops and comparisons.

**Declarative (Prolog):** write the facts `parent(…)` and the rule `grandparent(X, Z) :- parent(X, Y), parent(Y, Z).` then ask `?- grandparent(asel, aru).` — Prolog does the searching.
:::

:::compare Which paradigm suits the task?
| Task | Paradigm | Reason |
|---|---|---|
| Finding all customers from Almaty who spent more than 100 000 ₸ | **Declarative (SQL)** | The result can be described; the database finds the rows |
| A medical expert system that suggests a diagnosis from symptoms | **Declarative (Prolog)** | Knowledge is stored as facts and rules; the inference engine finds conclusions |
| Software that controls a traffic light in a fixed order with timings | **Imperative** | A fixed sequence of steps and changing state (the current light) |
| A fast 3D game | **Imperative** | Full control of every step for speed |
| A program that sorts and prints a report in a set layout | **Imperative** | Step-by-step processing and output |
:::

:::tip Writing a comparison
Use **"whereas"** and mention **both** paradigms in each point:
*"In an imperative language the programmer writes a sequence of instructions that says **how** to solve the problem, **whereas** in a declarative language the programmer states **what** is required (facts and rules) and the system works out how."*
:::

# Exam practice and summary
@lo 12.5.1.1

:::example Exam-style answers
**Q: Write two differences between declarative and imperative programming. [2]**
1. Declarative programming focuses on **what** the program should achieve, **whereas** imperative programming focuses on **how** to achieve the result (1).
2. An imperative program is a **clearly defined sequence of instructions**, **whereas** in a declarative program the order of execution is **not clearly delineated** / decided by the system (1).
*(Also accepted: functional, logic and query languages are declarative, whereas procedural and object-oriented languages are imperative.)*

**Q: Give one example of a declarative language and one example of an imperative language. [2]**
Declarative: **Prolog** / SQL / Haskell (1). Imperative: **Python** / C / Java / Pascal (1).

**Q: Explain why a declarative language is suitable for an expert system. [2]**
The knowledge can be written as **facts and rules** (1), and the language's **inference engine** searches them to reach a conclusion, so the programmer does not have to write the search algorithm (1).

**Q: State one disadvantage of declarative programming. [1]**
The programmer has **less control over how** the solution is found, so the program may be **less efficient**.
:::

:::warning Common mistakes
- Saying a declarative program has "no instructions at all" — it has statements (facts, rules, queries), but **not a sequence of steps** to follow.
- Calling **object-oriented** programming declarative — OOP is **imperative**: methods are sequences of instructions that change objects' state.
- Writing only one side of a difference: "imperative uses loops" — add "**whereas** declarative uses rules / recursion / queries".
- Thinking SQL is imperative because the statements are written in order — each SQL query **describes the result**; the DBMS decides how to obtain it.
- Mixing up a **paradigm** (a style) with a **language** (a tool that may support several paradigms).
:::

:::steps Check yourself
- What is a programming paradigm?
- Explain the difference between "how" and "what" in imperative and declarative programming.
- Name two sub-paradigms of each family and one language for each.
- In Prolog, what is the difference between a fact, a rule and a query?
- What does backtracking mean?
- Give two advantages and two disadvantages of declarative languages.
- Which paradigm would you choose for a database search, and which for a traffic-light controller? Why?
:::
