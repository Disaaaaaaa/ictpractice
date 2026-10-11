---
summary: RISC and CISC processor architectures — what an instruction set is, the characteristics of RISC and CISC, how each executes the same task, pipelining, examples of processors that use each, and a full comparison with exam-style answers.
---
# Instruction sets and processor architecture
@lo 12.3.2.1 12.3.2.2

Every processor (CPU) can only carry out a fixed list of **machine-code instructions** — such as LOAD, ADD, STORE, JUMP and COMPARE. The design of this list, and of the circuits that carry it out, is called the processor's **architecture**.

:::definition Instruction set
The **complete set of machine-code instructions** that a particular processor can decode and execute. Each instruction has an **opcode** (what to do) and usually an **operand** (the data or address to use).
:::

:::cards
### Why the architecture matters
- It decides **how many instructions** a program needs and **how long** each one takes.
- It affects the **speed**, **power consumption**, **heat**, **cost** and **size** of the chip.
- Programs compiled for one instruction set **cannot run directly** on a processor with a different one (e.g. x86 software on an ARM phone).
### Two design approaches
- **RISC** — *Reduced* Instruction Set Computer: a **small** set of **simple** instructions.
- **CISC** — *Complex* Instruction Set Computer: a **large** set of **complex** instructions.
:::

:::definition Clock cycle
One "tick" of the processor's clock. The **clock speed** (e.g. 3 GHz = 3 000 000 000 cycles per second) is how many cycles happen each second. An instruction takes one or more clock cycles to execute.
:::

# RISC architecture
@lo 12.3.2.1

:::definition RISC — Reduced Instruction Set Computer
A processor design with a **small set of simple instructions**, each of which is the **same length** and executes in **one clock cycle**. Complex tasks are built from **several simple instructions**.
:::

:::cards
### Instructions
- **Few, simple** instructions (often fewer than 100).
- **Fixed-length** instructions → easy and fast to **decode**.
- **Few addressing modes**.
- Most instructions execute in **one clock cycle**.
### Registers and memory
- **Load/store architecture**: only **LOAD** and **STORE** instructions access main memory; all calculations use **registers**.
- **Many general-purpose registers**, so data stays inside the CPU and memory is accessed less often.
### Hardware and software
- **Hard-wired** control unit — simple circuits, **fewer transistors**.
- Programs contain **more instructions**, so the **compiler** does more work and the machine code takes **more RAM**.
- Simple hardware → **low power consumption** and **less heat** → ideal for **battery-powered** devices.
:::

:::callout success Examples of RISC processors
**ARM** (almost all smartphones and tablets, Raspberry Pi, Apple M-series Macs), **RISC-V**, **MIPS**, **PowerPC**. Used in **mobile phones, tablets, embedded systems, smart TVs, IoT devices**.
:::

# CISC architecture
@lo 12.3.2.2

:::definition CISC — Complex Instruction Set Computer
A processor design with a **large set of complex instructions**. A **single instruction** can carry out **several low-level operations** (for example load from memory, calculate and store the result) and may take **several clock cycles**.
:::

:::cards
### Instructions
- **Many** instructions (hundreds or more), including specialised ones.
- **Variable-length** instructions → more complex decoding.
- **Many addressing modes**.
- Instructions take **different numbers of clock cycles**.
### Registers and memory
- Instructions can work **directly on data in memory** (memory-to-memory operations).
- **Fewer general-purpose registers** are needed.
### Hardware and software
- Complex control unit, often **microprogrammed** (microcode) — **more transistors**.
- Programs contain **fewer instructions** → **shorter machine code**, less RAM needed for code, simpler compiler.
- More complex hardware → **higher power consumption** and **more heat**.
:::

:::callout success Examples of CISC processors
**Intel x86 / x86-64** (Core i3/i5/i7/i9) and **AMD** (Ryzen) processors used in most **desktop PCs, laptops and servers**. Older examples: Motorola 68000, VAX.
:::

# The same task on RISC and CISC
@lo 12.3.2.1 12.3.2.2 12.3.2.3

The task: **multiply** two numbers stored in memory locations 2:3 and 5:2 and **store** the result in 2:3.

```assembly | CISC — one complex instruction (several clock cycles)
MULT 2:3, 5:2        ; loads both values, multiplies them, stores the result
```

```assembly | RISC — four simple instructions (one clock cycle each)
LOAD  A, 2:3         ; copy first value into register A
LOAD  B, 5:2         ; copy second value into register B
PROD  A, B           ; multiply registers A and B, result in A
STORE 2:3, A         ; copy the result back to memory
```

:::compare What the example shows
| | CISC | RISC |
|---|---|---|
| Number of instructions in the program | **1** | **4** |
| Clock cycles for each instruction | **Several** | **1** |
| Work done by | **Hardware** (complex circuits) | **Software** (the compiler generates more instructions) |
| Memory for the program code | **Less** | **More** |
:::

:::tip The performance equation
**Time for a program = number of instructions × cycles per instruction × time per cycle.** CISC tries to make the **number of instructions** small; RISC tries to make the **cycles per instruction** small (ideally 1).
:::

# Pipelining
@lo 12.3.2.1 12.3.2.3

:::definition Pipelining
A technique in which the processor works on **several instructions at the same time**, each at a **different stage** of the fetch–decode–execute cycle — while one instruction is being executed, the next is being decoded and the one after that is being fetched.
:::

:::ascii A three-stage pipeline (each column is one clock cycle)
Clock cycle:     1        2        3        4        5
Instruction 1:   Fetch    Decode   Execute
Instruction 2:            Fetch    Decode   Execute
Instruction 3:                     Fetch    Decode   Execute

Without pipelining: 3 instructions × 3 cycles = 9 cycles
With pipelining:    5 cycles — after the pipeline fills, one instruction finishes every cycle
:::

:::cards
### Why RISC suits pipelining
- Every instruction has the **same length** and takes **one cycle**, so each stage takes the **same time** and the pipeline flows smoothly.
- Simple decoding means each stage is quick.
### Why CISC is harder to pipeline
- Instructions have **different lengths** and take **different numbers of cycles**, so a long instruction **holds up** those behind it.
- Modern CISC chips (Intel, AMD) translate complex instructions into simple RISC-like **micro-operations** inside the CPU so they can be pipelined.
:::

# Comparing RISC and CISC
@lo 12.3.2.3

:::compare RISC vs CISC
| Feature | RISC | CISC |
|---|---|---|
| Number of instructions | **Small** | **Large** |
| Instruction complexity | **Simple** | **Complex**, multi-step |
| Instruction length | **Fixed** | **Variable** |
| Clock cycles per instruction | Usually **one** | **Several** (varies) |
| Addressing modes | **Few** | **Many** |
| Memory access | Only **LOAD / STORE** | Many instructions access memory **directly** |
| General-purpose registers | **Many** | **Fewer** |
| Control unit | **Hard-wired** | Often **microprogrammed** |
| Pipelining | **Easy** and efficient | **Harder** |
| Instructions per program | **More** (longer code) | **Fewer** (shorter code) |
| RAM needed for program code | **More** | **Less** |
| Emphasis | **Software** / compiler | **Hardware** |
| Power consumption and heat | **Low** | **Higher** |
| Chip cost / transistors | **Cheaper**, fewer transistors | **More expensive**, more transistors |
| Typical use | Phones, tablets, embedded systems | Desktop PCs, laptops, servers |
| Examples | **ARM**, RISC-V, MIPS | **Intel x86**, **AMD** |
:::

:::cards
### Advantages of RISC
- Each instruction executes **quickly** (one cycle).
- **Pipelining** is efficient.
- **Low power and heat** → longer battery life, no fan needed.
- **Simpler, smaller, cheaper** chips.
### Disadvantages of RISC
- Programs need **more instructions** → larger code, more RAM.
- More work for the **compiler** / programmer of assembly code.
### Advantages of CISC
- **Fewer instructions** per program → shorter code, less memory.
- Easier to write **assembly code**; simpler compilers.
- **Backward compatible** — huge amount of existing x86 software.
### Disadvantages of CISC
- Complex instructions take **several cycles**; harder to pipeline.
- **More power and heat**; more expensive chips.
- Many complex instructions are **rarely used**.
:::

:::callout warning Registers — a common trap
Remember: **RISC has many registers** (because all calculations happen in registers, and only LOAD/STORE use memory). CISC can work directly on memory, so it needs **fewer** registers. Do not say CISC has more registers.
:::

# Exam practice and summary
@lo 12.3.2.1 12.3.2.2 12.3.2.3

:::example Exam-style answers
**Q: Describe RISC architecture. [3]**
RISC uses a **small set of simple instructions** (1) of **fixed length** that each execute in **one clock cycle** (1); only **LOAD/STORE** access memory and it has **many registers** (1), so it is well suited to **pipelining** (1).

**Q: Give two differences between RISC and CISC. [2]**
RISC has a **small** set of simple instructions, **whereas** CISC has a **large** set of complex instructions (1). RISC instructions take **one clock cycle**, **whereas** CISC instructions may take **several** (1).

**Q: Explain why smartphones usually use RISC processors. [2]**
RISC processors have **simpler circuits / fewer transistors** (1), so they use **less power and produce less heat**, giving **longer battery life** without a fan (1).

**Q: Explain why CISC programs need less memory. [2]**
One CISC instruction can do **several operations** (1), so a program has **fewer instructions** and the machine code is **shorter** (1).
:::

:::warning Common mistakes
- Saying RISC is "slower because it has fewer instructions" — each instruction is **faster**; overall speed depends on the task.
- Saying CISC has **more registers** — RISC has more.
- Comparing only one side ("RISC has simple instructions") — a comparison needs **both** RISC **and** CISC.
- Mixing up **number of instructions in the set** (RISC fewer) with **number of instructions in a program** (RISC more).
:::

:::steps Check yourself
- What is an instruction set?
- Give four characteristics of RISC and four of CISC.
- Name one RISC and one CISC processor family and a device that uses each.
- Why does RISC need more instructions for the same task?
- What is pipelining and why does it suit RISC?
- Why do phones use RISC while most desktop PCs use CISC?
:::
