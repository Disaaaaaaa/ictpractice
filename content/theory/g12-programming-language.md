---
summary: Comparing declarative and imperative programming — how each describes a problem, how programs are executed and where each paradigm is used.
---
# Declarative and imperative languages
@lo 12.5.1.1

:::definition Programming paradigm
A **style or approach** to programming that determines how a problem is described and solved.
:::

:::cards
### Imperative paradigm
The program is a **sequence of instructions** that change the program's **state** (variables). The programmer says **how** to reach the result, step by step. Includes **procedural** (Python, C, Pascal) and **object-oriented** (Java, C#) programming.
### Declarative paradigm
The program states **what** is wanted — facts, rules, constraints or a description of the result. The language engine decides **how** to compute it. Includes **logic** (Prolog), **query** (SQL) and **functional** (Haskell) languages.
:::

```python | Imperative (Python): how — loop through the students and test each one
result = []
for s in students:
    if s.grade == 12:
        result.append(s.name)
```

```sql | Declarative (SQL): what — describe the rows you want
SELECT Name FROM Students WHERE Grade = 12;
```

```prolog | Declarative (Prolog): facts, rules and a query
% facts
likes(aruzhan, chess).
likes(timur, football).
likes(dana, chess).
% rule: two different people are friends if they like the same game
friends(X, Y) :- likes(X, G), likes(Y, G), X \= Y.
% query
?- friends(aruzhan, Who).
% Who = dana
```

:::compare Detailed comparison
| Criterion | Imperative | Declarative |
|---|---|---|
| Focus | How — the algorithm | What — the result/logic |
| Program structure | Statements executed in order; sequence, selection, iteration | Facts, rules, queries or expressions |
| State | Variables are assigned and changed | Little or no changing state |
| Control of execution | Written by the programmer | Built into the language (e.g. Prolog backtracking, SQL optimiser) |
| Code length | Often longer | Often shorter for suitable problems |
| Efficiency | Programmer can optimise every step | Depends on the engine; may be less efficient |
| Typical uses | Applications, games, operating systems, embedded systems | Databases, expert systems, AI, configuration |
| Examples | Python, C++, Java, Pascal, Assembly | Prolog, SQL, Haskell, HTML/CSS (markup) |
:::

:::tip
A strong comparison sentence: "In an **imperative** language the programmer writes the **steps** to solve the problem and the order of execution, **whereas** in a **declarative** language the programmer describes the **facts and rules** and the system finds the solution itself."
:::
