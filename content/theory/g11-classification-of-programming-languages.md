---
summary: How programming languages are classified into low-level (machine code, assembly) and high-level languages, how they compare, when each is used, language generations, and the difference between imperative and declarative languages.
---
# Low-level and high-level languages
@lo 11.5.1.1

A **programming language** is a formal language for writing instructions that a computer can carry out. Languages are classified by **how close they are to the hardware** (low-level) or **to human language** (high-level).

:::mermaid Classification of programming languages
flowchart LR
  PL[Programming languages] --> LL[Low-level]
  PL --> HL[High-level]
  LL --> MC[Machine code — 1st generation]
  LL --> AS[Assembly language — 2nd generation]
  HL --> IM[Imperative: Python, C, Java, Pascal]
  HL --> DE[Declarative: SQL, Prolog, Haskell]
:::

:::definition Low-level language
A language that is **close to the machine's hardware** — its instructions correspond directly to the processor's **instruction set**. It is **machine-dependent** (written for one type of processor). Includes **machine code** and **assembly language**.
:::

:::definition High-level language
A language that is **close to human language and mathematical notation**, uses **English-like keywords** (`if`, `while`, `print`) and is **machine-independent** (portable). One statement usually becomes **many** machine-code instructions. Examples: Python, Java, C#, C++, Pascal, JavaScript.
:::

# Machine code and assembly language
@lo 11.5.1.1

:::definition Machine code (first generation, 1GL)
Instructions written in **binary** (or hexadecimal) that the **CPU can execute directly**, without translation. Each instruction has an **opcode** (the operation) and an **operand** (the data or address).
:::

:::definition Assembly language (second generation, 2GL)
A low-level language that uses short **mnemonics** (`LDA`, `ADD`, `STA`, `JMP`) and **labels** instead of binary codes. Each assembly instruction usually translates into **exactly one** machine-code instruction (**one-to-one**). It is translated by an **assembler**.
:::

:::compare The same task at three levels — add two numbers and store the result
| High-level (Python) | Assembly language | Machine code (example) |
|---|---|---|
| `total = a + b` | `LDA a` | `0001 0000 1010` |
| | `ADD b` | `0011 0000 1011` |
| | `STA total` | `0010 0000 1100` |
:::

```text | A small assembly program with a label and a loop
        LDA #0        ; accumulator ← 0
        STA count
LOOP:   LDA count
        ADD #1        ; count ← count + 1
        STA count
        CMP #10
        BNE LOOP      ; repeat until count = 10
        HLT
```

:::compare Machine code vs assembly language
| | Machine code | Assembly language |
|---|---|---|
| Written in | Binary / hex | Mnemonics and labels |
| Translation | None — executed directly | Assembler (one-to-one) |
| Readability | Very hard for people | Easier, but still hard |
| Errors | Very easy to make, hard to find | Easier to spot |
| Speed of execution | Fastest | Same as machine code after assembly |
:::

# High-level languages and language generations
@lo 11.5.1.1

:::cards
### Features of high-level languages
- **English-like keywords** and mathematical symbols (`if total > 100:`).
- **Data structures** (arrays, records, lists) and **control structures** (selection, loops, functions).
- **Portable** — the same source code runs on different processors after translation.
- Translated by a **compiler** or **interpreter**; one statement → many machine instructions (**one-to-many**).
- Large **libraries** of ready-made functions.
### Language generations
- **1GL** — machine code (binary).
- **2GL** — assembly language (mnemonics).
- **3GL** — high-level procedural / object-oriented languages: C, Pascal, Python, Java.
- **4GL** — closer to human language, often for a specific purpose: **SQL**, report generators.
- **5GL** — describe the problem with constraints / logic; the system solves it: **Prolog** (AI).
:::

```python | High-level code is readable and short
marks = [72, 85, 64, 90]
average = sum(marks) / len(marks)
if average >= 75:
    print("Merit")
```

# Comparing high-level and low-level languages
@lo 11.5.1.2

:::compare High-level vs low-level languages
| Criterion | High-level language | Low-level language |
|---|---|---|
| Closeness to | Human language | Hardware / processor |
| Ease of writing, reading, debugging | **Easy** — English-like, readable | **Hard** — mnemonics or binary |
| Development time | **Short** | **Long** |
| Portability | **Portable** — machine-independent | **Machine-dependent** — written for one processor |
| Translation | Compiler or interpreter; one statement → many instructions | Assembler (assembly, one-to-one); none for machine code |
| Control of hardware | Indirect — the programmer cannot manage registers / memory directly | **Direct** control of registers, memory addresses, devices |
| Execution speed and memory | Usually slower and larger (less efficient code) | **Faster** and uses **less memory** (can be fully optimised) |
| Knowledge needed | No need to know the hardware | Must know the processor's architecture and instruction set |
| Typical uses | Applications, websites, games, databases | Device drivers, embedded systems, OS kernels, bootloaders, time-critical code |
:::

:::cards
### When to use a high-level language
- Most **applications**: business software, websites, mobile apps, games.
- When **development speed**, readability and **maintenance** by a team matter.
- When the program must run on **different types of computers**.
### When to use a low-level language
- **Device drivers** and parts of the **operating system** that control hardware directly.
- **Embedded systems** with very little memory and slow processors (washing machine, microwave, sensor).
- **Time-critical** code that must run as fast as possible (real-time control, some game engines).
- When a program must fit into a **very small amount of memory** (ROM).
:::

:::example Choose the language
- *A washing-machine controller with 2 KB of ROM* → **assembly** (small, fast, direct control of the motor and sensors).
- *A school timetable app for Android and iPhone* → **high-level** (portable, quick to develop, easy to maintain).
- *A driver for a new graphics card* → **low-level** (direct access to the hardware registers).
:::

# Imperative and declarative languages
@lo 11.5.1.3

High-level languages can also be classified by **paradigm** — the style in which the program describes a problem.

:::compare Imperative vs declarative
| | Imperative | Declarative |
|---|---|---|
| Focus | **How** to solve the problem | **What** the result should be |
| Program is | A **clearly defined sequence of instructions** | Facts, rules, queries or expressions |
| Order of execution | Set by the programmer | **Not clearly delineated** — decided by the system |
| State | Variables are changed by assignment | Little or no changing state |
| Sub-types | **Procedural**, **object-oriented** | **Logic**, **query**, **functional** |
| Examples | Python, C, Java, Pascal, assembly | **SQL**, **Prolog**, Haskell |
:::

```python | Imperative: the steps are given
result = []
for s in students:
    if s.grade == 11:
        result.append(s.name)
```

```sql | Declarative: the result is described
SELECT Name FROM Students WHERE Grade = 11;
```

:::callout info More in Grade 12
Declarative and imperative programming are studied in depth (with Prolog) in the Grade 12 topics **Programming language** and **Expert systems**.
:::

# Exam practice and summary
@lo 11.5.1.1 11.5.1.2 11.5.1.3

:::example Exam-style answers
**Q: Give two differences between high-level and low-level languages. [2]**
A high-level language is **portable / machine-independent**, whereas a low-level language is written for **one type of processor** (1). Low-level code gives **direct control of the hardware** and runs **faster / uses less memory**, whereas high-level code is **easier to write and debug** (1).

**Q: Explain why assembly language might be used to write the program for a microwave oven. [2]**
The microwave has a **small amount of memory**, and assembly produces **compact, fast code** (1); it also gives **direct control** of the hardware such as the timer and the magnetron (1).

**Q: State what is meant by a one-to-one relationship between assembly language and machine code. [1]**
Each assembly-language **instruction translates into exactly one** machine-code instruction.

**Q: Write two differences between declarative and imperative programming. [2]**
Declarative focuses on **what** the program should achieve, whereas imperative focuses on **how** (1). An imperative program is a **clearly defined sequence of instructions**, whereas in a declarative program the execution order is **not clearly delineated** (1).
:::

:::warning Common mistakes
- Saying low-level languages are "easier for the computer to understand" — only **machine code** is executed directly; **assembly must be assembled**.
- Saying high-level programs "run faster" — usually they run **slower** than well-written low-level code.
- Writing "high-level is easy" without a comparison — use **whereas** and state both sides.
- Calling assembly language "binary" — it uses **mnemonics**.
- Thinking SQL and Prolog are low-level — they are **high-level declarative** languages.
:::

:::steps Check yourself
- Define low-level and high-level languages and give two examples of each.
- What is a mnemonic? Give three examples.
- Why is assembly language machine-dependent?
- Give four differences between high-level and low-level languages.
- Give two situations where a low-level language is the better choice.
- Name the five language generations with an example of each.
- Compare imperative and declarative languages in two ways.
:::
