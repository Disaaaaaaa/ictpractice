---
summary: Low-level and high-level programming languages, how they compare, and the difference between imperative and declarative programming.
---
# Low-level and high-level languages
@lo 11.5.1.1

:::definition Low-level language
A language **close to the hardware**, whose instructions correspond directly to the processor's instructions. Two kinds: **machine code** (binary) and **assembly language** (mnemonics such as `LDA`, `ADD`, `STO`).
:::

:::definition High-level language
A language **close to human language and mathematics**, independent of a particular processor. One statement usually becomes many machine instructions. *Examples: Python, Java, C#, JavaScript, Pascal.*
:::

```text | The same task at three levels
High-level (Python):   total = a + b
Assembly:              LDA a
                       ADD b
                       STA total
Machine code:          0001 0000 1100
                       0101 0000 1101
                       0010 0000 1110
```

:::callout info Translators
High-level code is translated by a **compiler** or **interpreter**; assembly language is translated by an **assembler**. Machine code needs no translation.
:::

# Comparing high-level and low-level languages
@lo 11.5.1.2

:::compare
| Criterion | High-level language | Low-level language |
|---|---|---|
| Ease of writing and reading | Easy — English-like keywords | Hard — mnemonics or binary |
| Portability | Runs on different processors after translation | Specific to one processor family |
| Development time | Short | Long |
| Debugging | Easier | Harder |
| Execution speed | Usually slower | Fast — can be optimised for the hardware |
| Memory use | Larger programs | Small, efficient programs |
| Hardware control | Indirect | Direct access to registers and memory addresses |
| Typical use | Applications, websites, games | Device drivers, embedded systems, parts of OS kernels |
:::

:::tip
Common exam phrasing: "Give **one** reason why a programmer would use a low-level language." Good answer: "to **directly control the hardware**, e.g. when writing a device driver", or "to produce code that **runs faster and uses less memory** on an embedded device."
:::

# Imperative and declarative languages
@lo 11.5.1.3

:::definition Imperative programming
The programmer writes a **sequence of commands** describing **how** to solve the problem step by step; the program changes the values of variables (state). *Procedural and object-oriented languages are imperative: Python, C, Java, Pascal.*
:::

:::definition Declarative programming
The programmer describes **what** the result should be — facts, rules or conditions — and the language system works out how to obtain it. *Examples: SQL (database queries), Prolog (logic programming), HTML (describes a page).*
:::

```python | Imperative (Python): how to find adults
adults = []
for person in people:
    if person.age >= 18:
        adults.append(person.name)
```

```sql | Declarative (SQL): what we want
SELECT Name FROM People WHERE Age >= 18;
```

```prolog | Declarative (Prolog): facts, a rule and a query
parent(aliya, timur).
parent(timur, dana).
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
?- grandparent(aliya, Who).
```

:::compare
| | Imperative | Declarative |
|---|---|---|
| Programmer describes | How (algorithm, steps) | What (facts, rules, goal) |
| Control flow | Written explicitly: sequence, selection, loops | Handled by the language engine |
| Variables | Change value during execution | Facts/rules; little or no changing state |
| Examples | Python, C++, Java, Pascal | SQL, Prolog, HTML |
| Typical use | General applications, games | Databases, expert systems, AI |
:::

:::warning
Do not say "declarative languages have no logic". They have logic (rules), but the **order of execution** is decided by the system, not by the programmer.
:::
