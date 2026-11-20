---
summary: RISC and CISC processor architectures — what an instruction set is, opcodes, operands and clock cycles, the characteristics of RISC (simple fixed-length instructions, load/store, many registers, hard-wired control, pipelining) and of CISC (complex variable-length instructions, memory operands, microcode), the same task on both, the performance equation, and a full comparison with uses, advantages, disadvantages and exam-style answers.
---
# Instruction sets and processor architecture
@lo 12.3.2.1 12.3.2.2

Every program that runs on a computer — a web browser, a game, the operating system itself — is finally carried out by the **processor (CPU)** as a long sequence of very small steps called **machine-code instructions**. A processor cannot understand Python, Java or C++. It only understands its own fixed list of binary instructions, such as "load a value from memory", "add two numbers", "store a result", "compare two values" and "jump to another instruction". A compiler or interpreter translates the programmer's code into these instructions.

The designers of a processor must decide **which instructions** it will understand, **how complex** each instruction is, **how long** each one is in bits, **where** the data for each instruction can come from (registers or memory), and **how** the control unit will carry each one out. Together these design decisions are called the processor's **architecture** (more precisely, its **instruction set architecture**, ISA). There are two main approaches: **RISC** and **CISC**.

:::definition Machine-code instruction
A single **binary command** that the processor can decode and execute directly. It is made of an **opcode**, which says **what operation** to perform (for example ADD or LOAD), and usually one or more **operands**, which give the **data**, the **register** or the **memory address** to use.
:::

:::definition Instruction set
The **complete set of machine-code instructions** that a particular processor can decode and execute. Programs compiled for one instruction set **cannot run directly** on a processor with a different instruction set.
:::

## Opcodes, operands and instruction formats

An instruction is stored in memory as a binary pattern, just like data. Part of the pattern is the **opcode**; the remaining bits hold the **operands**. For example, an instruction meaning "ADD R1, R2, R3" (add the contents of registers R2 and R3 and put the result in R1) might be stored as a 32-bit word: some bits for the opcode ADD, and a few bits for each register number. An instruction such as "LOAD R1, 2048" needs bits for an address instead.

How these bits are laid out is called the **instruction format**. In some processors **every instruction has the same length** (for example exactly 32 bits) and the fields are always in the same places. In others, instructions have **different lengths** — a short instruction might be 1 byte and a long one 15 bytes — depending on how many operands it has and what kind they are. As you will see, this one choice has a big effect on how fast and how simply the processor can **decode** instructions.

:::svg Fixed-length instructions (RISC) and variable-length instructions (CISC)
<svg class="cpa" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RISC instructions are all 32 bits long with the opcode and register fields always in the same place; CISC instructions vary from 1 to 15 bytes, so the decoder must read the first bytes before it knows where the instruction ends">
  <style>
    svg.cpa .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.cpa .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.cpa .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.cpa .m{font:600 12px ui-monospace,monospace;fill:var(--foreground)}
    svg.cpa .op{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.cpa .rg{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.cpa .ad{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.cpa .cx{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
  </style>
  <text class="h" x="20" y="22">RISC: every instruction is 32 bits — fields always in the same place</text>
  <rect class="op" x="20" y="34" width="120" height="30"/><text class="m" x="80" y="54" text-anchor="middle">opcode ADD</text>
  <rect class="rg" x="140" y="34" width="90" height="30"/><text class="m" x="185" y="54" text-anchor="middle">R1</text>
  <rect class="rg" x="230" y="34" width="90" height="30"/><text class="m" x="275" y="54" text-anchor="middle">R2</text>
  <rect class="rg" x="320" y="34" width="90" height="30"/><text class="m" x="365" y="54" text-anchor="middle">R3</text>
  <rect class="ad" x="410" y="34" width="110" height="30"/><text class="m" x="465" y="54" text-anchor="middle">unused</text>
  <rect class="op" x="20" y="70" width="120" height="30"/><text class="m" x="80" y="90" text-anchor="middle">opcode LOAD</text>
  <rect class="rg" x="140" y="70" width="90" height="30"/><text class="m" x="185" y="90" text-anchor="middle">R1</text>
  <rect class="ad" x="230" y="70" width="290" height="30"/><text class="m" x="375" y="90" text-anchor="middle">address / offset</text>
  <text class="s" x="540" y="62">same length →</text><text class="s" x="540" y="80">decode in one</text><text class="s" x="540" y="98">simple step</text>
  <text class="h" x="20" y="140">CISC: instructions are 1 to 15 bytes — length depends on the instruction</text>
  <rect class="op" x="20" y="152" width="40" height="30"/><text class="m" x="40" y="172" text-anchor="middle">1 B</text>
  <text class="s" x="70" y="172">e.g. a short register instruction</text>
  <rect class="op" x="20" y="188" width="40" height="30"/><rect class="rg" x="60" y="188" width="40" height="30"/><rect class="ad" x="100" y="188" width="160" height="30"/><text class="m" x="180" y="208" text-anchor="middle">4-byte address</text>
  <text class="s" x="270" y="208">6 bytes: operation on a value in memory</text>
  <rect class="cx" x="20" y="224" width="40" height="30"/><rect class="op" x="60" y="224" width="40" height="30"/><rect class="rg" x="100" y="224" width="40" height="30"/><rect class="ad" x="140" y="224" width="160" height="30"/><rect class="ad" x="300" y="224" width="160" height="30"/><text class="m" x="220" y="244" text-anchor="middle">address</text><text class="m" x="380" y="244" text-anchor="middle">constant</text>
  <text class="s" x="470" y="244">11 bytes — the decoder must read</text><text class="s" x="470" y="260">the first bytes to find the length</text>
</svg>
:::

## Clock cycles and cycles per instruction

The processor is driven by a **clock** that sends out pulses at a fixed rate. Each pulse is one **clock cycle**. A 3 GHz processor has 3 000 000 000 cycles every second, so one cycle lasts about a third of a nanosecond. Each instruction takes a certain number of clock cycles to be fetched, decoded and executed. The average number of cycles an instruction needs is called **CPI — cycles per instruction**.

:::definition Clock cycle
One "tick" of the processor's clock — the smallest unit of time in which the CPU does a step of work. The **clock speed** (for example 3 GHz = 3 × 10⁹ cycles per second) is the number of cycles per second. An instruction takes **one or more** clock cycles.
:::

The time a program takes depends on three things, and this gives the most useful idea for understanding RISC and CISC:

$$ \text{time for a program} = \text{number of instructions} \times \text{cycles per instruction (CPI)} \times \text{time per cycle} $$ | The performance equation

A designer can make a program faster by reducing **any** of the three factors. The **CISC** approach tries to reduce the **number of instructions** in a program: if one powerful instruction can do the work of four simple ones, the program is shorter. The **RISC** approach tries to reduce the **cycles per instruction**: if every instruction is so simple that it finishes in one cycle (and the processor can overlap instructions), the program runs quickly even though it contains more instructions. Both approaches can also raise the clock speed, but simpler circuits make that easier for RISC.

## The control unit: hard-wired or microprogrammed

The **control unit** decodes each instruction and sends control signals to the other parts of the CPU (the ALU, registers, buses) to carry it out. There are two ways of building it. A **hard-wired** control unit uses fixed logic circuits: each opcode directly switches on the right signals. This is very fast but only practical when the instructions are few and simple. A **microprogrammed** control unit stores, inside the CPU, a small program of **micro-instructions (microcode)** for each machine-code instruction; executing one complex instruction means running its little microprogram step by step. This makes it possible to have hundreds of complex instructions, but each one takes several cycles.

:::definition Microcode (microprogrammed control unit)
A set of **micro-instructions stored inside the CPU's control unit**. Each complex machine-code instruction is carried out by running its own short sequence of micro-instructions. Used in **CISC** processors; RISC processors usually have a **hard-wired** control unit made of fixed logic circuits.
:::

:::compare Hard-wired and microprogrammed control units
| | Hard-wired control unit | Microprogrammed control unit |
|---|---|---|
| How it works | Fixed logic circuits turn each opcode directly into control signals | Each instruction runs a stored sequence of micro-instructions (microcode) |
| Speed | **Fast** — signals produced at once | **Slower** — several micro-steps per instruction |
| Number / complexity of instructions it suits | **Few, simple** instructions | **Many, complex** instructions |
| Changing the instruction set | Hard — the circuit must be redesigned | Easier — the microcode can be changed (even updated after manufacture) |
| Used in | **RISC** processors | **CISC** processors |
:::

# RISC architecture
@lo 12.3.2.1

The RISC idea came from research in the late 1970s and early 1980s (IBM, and university projects at Berkeley and Stanford). Researchers measured real programs and found that compilers used a **small number of simple instructions** most of the time; the many complex instructions of the processors of that time were **rarely used**, yet they made the chips complicated and slow. Their conclusion was to build processors with **only simple instructions**, make each of them **very fast**, and let the **compiler** combine them to do complex work.

:::definition RISC — Reduced Instruction Set Computer
A processor architecture with a **small set of simple instructions**, each of the **same (fixed) length**, most of which execute in **one clock cycle**. Only **LOAD** and **STORE** instructions access main memory; all other operations use the processor's **many registers**. Complex tasks are built from **several simple instructions**, so the emphasis is on **software** (the compiler).
:::

## Characteristics of RISC

Each characteristic below is a possible mark in a "describe" question. Learn **what** it is and **why** RISC has it.

:::cards
### A small set of simple instructions
A RISC processor has a **reduced** number of instructions (often fewer than a hundred basic ones), and each does **one simple job**: add two registers, load one value, compare, branch. Because each instruction is simple, the circuits to carry it out are small and fast.
### One instruction per clock cycle
Most RISC instructions are designed to finish their execution in **one clock cycle**, so the CPI is close to 1. This makes the time each instruction takes **predictable**, which is exactly what a pipeline needs.
### Fixed-length instructions
Every instruction is the **same size** (for example 32 bits) with the opcode and register numbers always in the same bit positions. The decoder never has to work out where an instruction ends, so decoding is **simple and fast**, and the next instruction can be fetched straight away.
### Load/store architecture
Only two kinds of instruction — **LOAD** (memory → register) and **STORE** (register → memory) — can access main memory. Arithmetic and logic work **only on registers**. This keeps every other instruction short and quick, because accessing memory is slow compared with accessing a register.
### Many general-purpose registers
Since all calculations take place in registers, RISC processors provide **many** of them — typically **32** (MIPS, RISC-V; 64-bit ARM has 31). Values can stay inside the CPU instead of being written to and read from memory again and again.
### Few, simple addressing modes
An addressing mode is the way an instruction says where its data is (a constant, a register, an address). RISC offers only **a few simple modes**, again keeping decoding fast and circuits small.
### Hard-wired control unit, fewer transistors
Simple instructions can be decoded by **fixed logic circuits** instead of microcode. The chip needs **fewer transistors** for control, so it is **smaller, cheaper**, uses **less power** and produces **less heat**. The space saved on the chip can be used for more registers or cache.
### More work for the compiler
Because there are no complex instructions, a program needs **more instructions** and its machine code is **longer**, taking **more memory (RAM)**. The **compiler** must be clever: it chooses the simple instructions, keeps values in registers and orders instructions so that the pipeline is never kept waiting.
:::

## Pipelining

The biggest advantage of RISC's simple, equal-sized, one-cycle instructions is that they are ideal for **pipelining**. Every instruction goes through the same stages — **fetch**, **decode**, **execute** (real processors split these into more stages, such as memory access and write-back). Without a pipeline the CPU finishes one instruction completely before starting the next, so most of its circuits are idle most of the time. With a pipeline, as soon as an instruction moves from the fetch stage to the decode stage, the **next instruction is fetched**, just as on a factory assembly line several cars are being built at once, each at a different station.

:::definition Pipelining
A technique in which the processor works on **several instructions at the same time**, each at a **different stage** of the fetch–decode–execute cycle: while one instruction is being executed, the next is being decoded and the one after that is being fetched. Once the pipeline is full, **one instruction is completed every clock cycle**.
:::

:::svg A three-stage pipeline: after it fills, one instruction finishes every cycle
<svg class="cpa" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grid of clock cycles 1 to 6 against instructions 1 to 4. Each instruction is fetched, decoded and executed in three consecutive cycles, starting one cycle after the previous instruction, so 4 instructions finish in 6 cycles instead of 12">
  <style>
    svg.cpa .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.cpa .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.cpa .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.cpa .f{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.cpa .d{fill:var(--warning);fill-opacity:0.25;stroke:var(--warning);stroke-width:1.5}
    svg.cpa .e{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.cpa .g{fill:none;stroke:var(--border);stroke-width:1}
  </style>
  <text class="h" x="20" y="24">Clock cycle →</text>
  <text class="t" x="215" y="24" text-anchor="middle">1</text><text class="t" x="305" y="24" text-anchor="middle">2</text><text class="t" x="395" y="24" text-anchor="middle">3</text><text class="t" x="485" y="24" text-anchor="middle">4</text><text class="t" x="575" y="24" text-anchor="middle">5</text><text class="t" x="665" y="24" text-anchor="middle">6</text>
  <text class="t" x="20" y="62">Instruction 1</text><text class="t" x="20" y="112">Instruction 2</text><text class="t" x="20" y="162">Instruction 3</text><text class="t" x="20" y="212">Instruction 4</text>
  <rect class="f" x="172" y="40" width="86" height="36" rx="4"/><text class="t" x="215" y="63" text-anchor="middle">Fetch</text>
  <rect class="d" x="262" y="40" width="86" height="36" rx="4"/><text class="t" x="305" y="63" text-anchor="middle">Decode</text>
  <rect class="e" x="352" y="40" width="86" height="36" rx="4"/><text class="t" x="395" y="63" text-anchor="middle">Execute</text>
  <rect class="f" x="262" y="90" width="86" height="36" rx="4"/><text class="t" x="305" y="113" text-anchor="middle">Fetch</text>
  <rect class="d" x="352" y="90" width="86" height="36" rx="4"/><text class="t" x="395" y="113" text-anchor="middle">Decode</text>
  <rect class="e" x="442" y="90" width="86" height="36" rx="4"/><text class="t" x="485" y="113" text-anchor="middle">Execute</text>
  <rect class="f" x="352" y="140" width="86" height="36" rx="4"/><text class="t" x="395" y="163" text-anchor="middle">Fetch</text>
  <rect class="d" x="442" y="140" width="86" height="36" rx="4"/><text class="t" x="485" y="163" text-anchor="middle">Decode</text>
  <rect class="e" x="532" y="140" width="86" height="36" rx="4"/><text class="t" x="575" y="163" text-anchor="middle">Execute</text>
  <rect class="f" x="442" y="190" width="86" height="36" rx="4"/><text class="t" x="485" y="213" text-anchor="middle">Fetch</text>
  <rect class="d" x="532" y="190" width="86" height="36" rx="4"/><text class="t" x="575" y="213" text-anchor="middle">Decode</text>
  <rect class="e" x="622" y="190" width="86" height="36" rx="4"/><text class="t" x="665" y="213" text-anchor="middle">Execute</text>
  <text class="h" x="20" y="262">Without pipelining: 4 instructions × 3 cycles = 12 cycles.   With pipelining: 3 + (4 − 1) = 6 cycles.</text>
  <text class="s" x="20" y="286">In cycle 3 all three stages are busy at once: instruction 1 executes, 2 is decoded, 3 is fetched.</text>
</svg>
:::

For **n** instructions in a pipeline with **k** stages (each taking one cycle), the first instruction needs **k** cycles to come out of the end, and after that one more instruction finishes **every cycle**:

- without pipelining: **n × k** cycles;
- with pipelining: **k + (n − 1)** cycles.

For 100 instructions in a 3-stage pipeline that is 300 cycles without pipelining and only 102 with it — almost three times faster. This works smoothly only if every stage takes the **same time**, which is why RISC's fixed-length, one-cycle instructions matter so much. A pipeline can still be slowed down: if an instruction needs the result of the instruction just before it, or if a **branch** (jump) means the instructions already fetched are the wrong ones, the pipeline must wait or be emptied ("flushed").

:::callout success Examples of RISC processors and where they are used
**ARM** processors are in almost every **smartphone and tablet**, in the **Raspberry Pi**, smart watches, smart TVs and many **embedded systems** (washing machines, cars, routers). **Apple M-series** chips in MacBooks and iPads are ARM-based. Other RISC families: **RISC-V** (an open, royalty-free design growing fast in IoT devices), **MIPS**, **PowerPC**. Many of the world's fastest supercomputers also use RISC (ARM) processors.
:::

# CISC architecture
@lo 12.3.2.2

CISC is the older approach. In the 1960s and 1970s **memory was very expensive and slow**, and much software was written directly in **assembly language** by hand, while compilers were simple. Designers therefore tried to make each instruction do **as much work as possible**: a program with fewer, more powerful instructions took up **less memory**, needed **fewer slow fetches from memory**, and was easier for a programmer to write. Over time more and more specialised instructions were added — for string copying, loops, decimal arithmetic and so on. The name "CISC" was only invented later, to contrast these designs with RISC.

:::definition CISC — Complex Instruction Set Computer
A processor architecture with a **large set of complex instructions** of **variable length**. A **single instruction** can carry out **several low-level operations** — for example load a value from memory, perform a calculation and store the result — and may take **several clock cycles**. Instructions can work **directly on data in memory**, and the emphasis is on **hardware**.
:::

## Characteristics of CISC

:::cards
### A large set of complex instructions
A CISC processor has **hundreds** of instructions (modern x86 has well over a thousand variants), including very specialised ones such as "copy a whole block of memory", "repeat until a counter reaches zero" or "multiply two values from memory". One instruction may do the work of several RISC instructions.
### Multi-cycle instructions
Complex instructions need **several clock cycles** — and **different** instructions need **different numbers** of cycles (a register addition may take 1, a division or a memory-to-memory operation many more). The CPI is greater than 1 and not predictable.
### Variable-length instructions
Instructions have **different sizes** (in x86, from 1 to 15 bytes) depending on the operation and its operands. Short instructions save memory, but the decoder must examine the first bytes of each instruction to find out **how long** it is before it can find the next one, which makes decoding **slower and more complex**.
### Memory operands (memory-to-memory operations)
Many CISC instructions can use data **directly in main memory**: one instruction can read a value from memory, change it and write it back. There is no need to load everything into registers first, so CISC processors traditionally have **fewer general-purpose registers** (early x86 had 8; x86-64 has 16).
### Many addressing modes
CISC offers **many ways** to specify an operand — a constant, a register, a memory address, an address held in a register, an address plus an offset, an address plus an index × a scale… This gives the programmer flexibility but makes instructions longer and decoding more complex.
### Microprogrammed control unit, more transistors
Complex instructions are carried out by **microcode** stored in the control unit. The decoding and control circuits need **many more transistors**, so the chip is **larger, more expensive**, uses **more power** and produces **more heat** — desktop CPUs need heat sinks and fans.
### Shorter programs, simpler compilers
Because each instruction does more, programs contain **fewer instructions**, so the machine code is **shorter** and needs **less RAM**. Translating a high-level statement into one complex instruction is easier, so the **compiler** has less work to do, and assembly language is easier to write by hand.
:::

:::callout success Examples of CISC processors and where they are used
**Intel x86 / x86-64** (Core i3/i5/i7/i9, Xeon) and **AMD** (Ryzen, EPYC) processors in most **desktop PCs, laptops and servers**, and in games consoles such as the PlayStation 5 and Xbox Series X. Older examples: Intel 8086, Motorola 68000, VAX. A huge amount of existing software (Windows programs, games) is compiled for x86, which is one important reason CISC is still used: **backward compatibility**.
:::

## Modern CISC processors work like RISC inside

Today the difference between the two is less sharp than it used to be. Since the mid-1990s, Intel and AMD processors have **translated** each complex x86 instruction, as it is decoded, into one or more simple, fixed-size **micro-operations** — effectively RISC-like instructions — which are then executed by a fast, deeply **pipelined** core. The processor still accepts the CISC instruction set, so old software runs unchanged, but internally it gets many of RISC's speed advantages. At the same time, RISC instruction sets have gradually added some more powerful instructions (for example for multimedia and encryption). The cost for CISC is the extra translation hardware, which uses chip space and power — one reason why ARM processors are more energy-efficient in phones and laptops.

# Comparing RISC and CISC
@lo 12.3.2.1 12.3.2.2 12.3.2.3

The clearest way to see the difference is to give both architectures **the same job**.

The task: **multiply** the two numbers stored in memory locations **2:3** and **5:2** and **store** the result back in **2:3**. On a **CISC** processor one instruction does everything:

```assembly | CISC — one complex instruction (several clock cycles)
MULT 2:3, 5:2        ; load both values, multiply them, store the result in 2:3
```

On a **RISC** processor the same job needs four simple instructions, because only LOAD and STORE may touch memory and the multiplication works on registers:

```assembly | RISC — four simple instructions (about one clock cycle each)
LOAD  A, 2:3         ; copy the first value from memory into register A
LOAD  B, 5:2         ; copy the second value into register B
PROD  A, B           ; multiply registers A and B, result in A
STORE 2:3, A         ; copy the result from A back to memory
```

:::example Worked example 1 — what the two programs show
- **Length of the program.** The CISC program is **one** instruction long, the RISC program **four**. So the CISC code needs **less memory**, and the RISC code needs **more RAM** and a compiler that generates more instructions.
- **Cycles per instruction.** The CISC instruction must load two values, multiply and store, so it takes **several clock cycles** and needs complex circuits (microcode). Each RISC instruction is simple and takes about **one cycle**, and the four instructions can flow through a **pipeline**.
- **Who does the work.** In CISC the **hardware** does the work of splitting the job into steps; in RISC the **software** (the compiler) does it by producing four instructions.
- **Total time.** The total time can be similar — CISC has fewer instructions but more cycles each; RISC has more instructions but fewer cycles each. The work has moved from **hardware** (CISC) to **software** (RISC).
:::

:::example Worked example 2 — using the performance equation
A program is compiled for two processors, both running at **2 GHz** (one cycle = 0.5 ns).
- **CISC** version: **1 000 000** instructions, average **CPI = 4**. Time = 1 000 000 × 4 × 0.5 ns = 2 000 000 ns = **2 ms**.
- **RISC** version: the compiler needs **1 500 000** instructions (50 % more), but with pipelining the average **CPI = 1.2**. Time = 1 500 000 × 1.2 × 0.5 ns = 900 000 ns = **0.9 ms**.

The RISC program has **more instructions** but finishes in **less than half the time**, because each instruction takes far fewer cycles. If the RISC CPI rose to 3 (for example because branches kept emptying the pipeline), its time would be 1 500 000 × 3 × 0.5 ns = 2.25 ms — slower than CISC. Neither design is "always faster": it depends on the number of instructions **and** the cycles per instruction.
:::

:::svg Load/store (RISC) versus memory operands (CISC)
<svg class="cpa" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a RISC CPU with many registers; data moves between memory and registers only by LOAD and STORE, and the ALU works on registers. Right: a CISC CPU with fewer registers; one instruction can read a value from memory into the ALU and write the result straight back to memory">
  <style>
    svg.cpa .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.cpa .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.cpa .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.cpa .m{font:600 12px ui-monospace,monospace;fill:var(--foreground)}
    svg.cpa .cpu{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.cpa .rg{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.cpa .al{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.cpa .mem{fill:var(--warning);fill-opacity:0.2;stroke:var(--warning);stroke-width:2}
    svg.cpa .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.cpa .lr{stroke:var(--danger);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="cpaA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
    <marker id="cpaR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker>
  </defs>
  <text class="h" x="20" y="22">RISC — load/store</text>
  <rect class="cpu" x="20" y="34" width="230" height="190" rx="10"/><text class="s" x="30" y="52">CPU</text>
  <rect class="al" x="40" y="62" width="90" height="44" rx="6"/><text class="t" x="85" y="89" text-anchor="middle">ALU</text>
  <g><rect class="rg" x="150" y="60" width="80" height="20"/><text class="m" x="190" y="75" text-anchor="middle">R0 … R7</text>
  <rect class="rg" x="150" y="82" width="80" height="20"/><text class="m" x="190" y="97" text-anchor="middle">R8 … R15</text>
  <rect class="rg" x="150" y="104" width="80" height="20"/><text class="m" x="190" y="119" text-anchor="middle">R16 … R23</text>
  <rect class="rg" x="150" y="126" width="80" height="20"/><text class="m" x="190" y="141" text-anchor="middle">R24 … R31</text></g>
  <text class="s" x="40" y="130">ALU uses</text><text class="s" x="40" y="146">registers only</text>
  <line class="ln" x1="130" y1="84" x2="148" y2="84" marker-end="url(#cpaA)"/>
  <text class="s" x="40" y="190">32 registers</text>
  <rect class="mem" x="290" y="60" width="90" height="120" rx="8"/><text class="t" x="335" y="124" text-anchor="middle">Memory</text>
  <line class="ln" x1="290" y1="90" x2="234" y2="90" marker-end="url(#cpaA)"/><text class="m" x="262" y="84" text-anchor="middle">LOAD</text>
  <line class="ln" x1="234" y1="140" x2="290" y2="140" marker-end="url(#cpaA)"/><text class="m" x="262" y="160" text-anchor="middle">STORE</text>
  <text class="h" x="410" y="22">CISC — memory operands</text>
  <rect class="cpu" x="410" y="34" width="200" height="190" rx="10"/><text class="s" x="420" y="52">CPU</text>
  <rect class="al" x="430" y="62" width="90" height="44" rx="6"/><text class="t" x="475" y="89" text-anchor="middle">ALU</text>
  <rect class="rg" x="530" y="60" width="66" height="20"/><text class="m" x="563" y="75" text-anchor="middle">8–16 regs</text>
  <text class="s" x="430" y="140">One instruction,</text><text class="s" x="430" y="156">e.g. ADD [count], 1:</text><text class="s" x="430" y="172">read, add, write back</text>
  <rect class="mem" x="650" y="60" width="90" height="120" rx="8"/><text class="t" x="695" y="124" text-anchor="middle">Memory</text>
  <path class="lr" d="M650,84 C600,30 560,30 522,70" marker-end="url(#cpaR)"/>
  <path class="lr" d="M522,100 C580,200 610,190 650,150" marker-end="url(#cpaR)"/>
  <text class="s" x="20" y="250">RISC keeps data in its many registers and touches memory only with LOAD/STORE; CISC instructions may read and write memory directly.</text>
</svg>
:::

## The full comparison

:::compare RISC vs CISC
| Feature | RISC | CISC |
|---|---|---|
| Number of instructions in the instruction set | **Small** (reduced) | **Large** (hundreds or more) |
| Instruction complexity | **Simple** — one operation each | **Complex** — several operations in one instruction |
| Instruction length | **Fixed** (e.g. 32 bits) | **Variable** (e.g. 1–15 bytes) |
| Clock cycles per instruction | Usually **one** | **Several**, different for each instruction |
| Addressing modes | **Few**, simple | **Many** |
| Memory access | Only **LOAD / STORE** instructions | Many instructions access memory **directly** |
| General-purpose registers | **Many** (typically 32) | **Fewer** (8–16) |
| Control unit | **Hard-wired** | Usually **microprogrammed** (microcode) |
| Decoding | **Simple and fast** | **Complex**, slower |
| Pipelining | **Easy** and efficient | **Harder** (modern chips convert to micro-operations first) |
| Instructions per program | **More** (longer machine code) | **Fewer** (shorter machine code) |
| RAM needed for program code | **More** | **Less** |
| Emphasis | **Software** — the compiler does more work | **Hardware** — the processor does more work |
| Transistors, chip size and cost | **Fewer** transistors, smaller, **cheaper** | **More** transistors, larger, **more expensive** |
| Power consumption and heat | **Low** | **Higher** |
| Typical use | Smartphones, tablets, embedded and IoT devices, Apple M-series laptops | Desktop PCs, most laptops, servers, games consoles |
| Examples | **ARM**, RISC-V, MIPS, PowerPC | **Intel x86 / x86-64**, **AMD** |
:::

## Advantages and disadvantages

:::compare Advantages and disadvantages of each architecture
| | RISC | CISC |
|---|---|---|
| Advantages | Each instruction executes **quickly** (about one cycle) · **pipelining** is simple and efficient · simple hard-wired circuits → **low power and heat**, long battery life, no fan · **smaller, cheaper** chips · spare chip area for more registers / cache | **Fewer instructions** per program → **shorter code**, less RAM · **simpler compilers** and easier assembly programming · one instruction can do a complex job such as copying a block of memory · **backward compatible** with decades of x86 software |
| Disadvantages | Programs need **more instructions** → longer code, **more RAM** · **more work for the compiler** (and for anyone writing assembly) · performance depends heavily on a good compiler · software compiled for x86 must be recompiled or emulated | Complex instructions take **several cycles** · variable length makes decoding and **pipelining harder** · **more transistors → more power, more heat, higher cost** · many complex instructions are **rarely used**, wasting chip area |
:::

## Why phones use RISC and desktop PCs use CISC

This is a typical "explain" question, and the answer comes from the characteristics above. A **smartphone** runs on a **battery** and has **no fan**, so the most important requirement is **low power consumption and little heat**. A RISC processor such as ARM has simple, hard-wired circuits with **fewer transistors**, so it uses less power and produces less heat, giving **longer battery life** in a thin case; it is also **cheaper and smaller**, which matters in a device made in hundreds of millions. A **desktop PC** is plugged into the mains and has room for a heat sink and fan, so power matters less; what matters is running the huge range of existing **Windows software and games compiled for x86**, so CISC processors from Intel and AMD remain the standard there. The line is moving, though: Apple moved its Mac computers to ARM (RISC) chips in 2020 because they gave high performance with much lower power use, and ARM processors are increasingly used in servers to save electricity in data centres.

:::warning Common mistakes when comparing RISC and CISC
- Saying RISC is "slower because it has fewer instructions". Each RISC instruction is **faster**; overall speed depends on the number of instructions **and** the cycles per instruction.
- Saying CISC has **more registers**. RISC has **more** registers, because all its calculations use registers; CISC can work directly on memory.
- Mixing up the **number of instructions in the instruction set** (RISC has **fewer**) with the **number of instructions in a program** (RISC needs **more**).
- Writing one-sided "comparisons" ("RISC uses one clock cycle"). Each point must cover **both**: "RISC instructions usually take one clock cycle, **whereas** CISC instructions may take several".
- Saying CISC programs use **more** memory. CISC programs are **shorter**, so they use **less** memory for code.
- Saying RISC means "no complex tasks are possible". RISC can do any task — it builds complex operations from **several simple instructions**.
:::

# Exam practice: RISC and CISC
@lo 12.3.2.1 12.3.2.2 12.3.2.3

:::example Exam-style questions with model answers
**Q: State what is meant by the instruction set of a processor. [1]**
The complete set of machine-code instructions that the processor can decode and execute (1).

**Q: Describe the RISC architecture. [4]**
RISC uses a small set of simple instructions (1) of fixed length (1) that each execute in about one clock cycle (1); only LOAD/STORE instructions access memory and it has many general-purpose registers (1); it is well suited to pipelining / has a hard-wired control unit (1). (Max 4.)

**Q: Describe the CISC architecture. [3]**
CISC has a large set of complex instructions (1); one instruction can carry out several low-level operations, e.g. load, calculate and store, and take several clock cycles (1); instructions are of variable length and can operate directly on data in memory / use a microprogrammed control unit (1).

**Q: Compare RISC and CISC. [4]**
RISC has a small set of simple instructions, whereas CISC has a large set of complex instructions (1). RISC instructions are fixed length and take one cycle, whereas CISC instructions are variable length and take several cycles (1). RISC programs need more instructions / more RAM, whereas CISC programs are shorter (1). RISC uses less power and produces less heat, whereas CISC uses more power because it has more transistors (1).

**Q: Explain why most smartphones use RISC processors. [2]**
RISC processors have simpler circuits / fewer transistors (1), so they use less power and produce less heat, giving longer battery life without a fan (1).

**Q: A 4-stage pipeline executes 20 instructions, each stage taking one clock cycle. Calculate the number of cycles needed with and without pipelining. [2]**
Without: 20 × 4 = **80 cycles** (1). With: 4 + (20 − 1) = **23 cycles** (1).
:::

:::warning Common mistakes in exam answers
- Listing features with no explanation in a "describe" or "explain" question. Add **why**: "fixed-length instructions, **so** they are quick to decode".
- Giving examples without the architecture: "ARM" earns a mark only when linked to RISC ("ARM is a RISC processor used in smartphones").
- In pipeline calculations, writing n + k instead of k + (n − 1).
:::

:::steps Check yourself
- Define instruction set, opcode, operand and clock cycle.
- Write the performance equation and say which factor RISC and CISC each try to reduce.
- Give five characteristics of RISC and explain why each makes the processor fast or efficient.
- Give five characteristics of CISC and explain why CISC was designed this way.
- What is pipelining? Why does it suit RISC better than CISC?
- Explain the difference between a hard-wired and a microprogrammed control unit.
- Name a RISC and a CISC processor family and a device that uses each. Why do phones use RISC?
:::
