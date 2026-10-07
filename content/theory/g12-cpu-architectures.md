---
summary: RISC and CISC processor architectures — their characteristics, an example of each, and how they compare.
---
# RISC architecture
@lo 12.3.2.1

:::definition RISC — Reduced Instruction Set Computer
A processor design with a **small set of simple instructions**, each of which executes in **one clock cycle**.
:::

- Few, simple, **fixed-length** instructions; few addressing modes.
- Most instructions take **one clock cycle** → well suited to **pipelining**.
- **Load/store architecture**: only LOAD and STORE access memory; all other operations use **registers**.
- **Many general-purpose registers**.
- Programs need **more instructions** (longer machine code), so the **compiler** does more work.
- Simpler hardware → **less power and heat**, cheaper chips.
- *Examples:* **ARM** (smartphones, tablets, Apple M-series), RISC-V, MIPS.

# CISC architecture
@lo 12.3.2.2

:::definition CISC — Complex Instruction Set Computer
A processor design with a **large set of complex instructions**, where one instruction can do several low-level operations (e.g. load from memory, add and store) and may take **several clock cycles**.
:::

- Many instructions, **variable length**, many addressing modes.
- Instructions can work **directly on memory**.
- Fewer instructions per program → **shorter programs**, less RAM for code.
- Complex circuitry (often **microcode**) → more power and heat.
- Harder to pipeline because instructions take different numbers of cycles.
- *Examples:* **Intel x86 / x86-64** and **AMD** processors in most PCs and laptops.

# Comparing RISC and CISC
@lo 12.3.2.3

:::compare
| Feature | RISC | CISC |
|---|---|---|
| Number of instructions | Small | Large |
| Instruction complexity | Simple | Complex, multi-step |
| Instruction length | Fixed | Variable |
| Clock cycles per instruction | Usually 1 | Several |
| Memory access | Only LOAD/STORE | Many instructions access memory directly |
| Registers | Many | Fewer |
| Pipelining | Easy and efficient | Harder |
| Program length (number of instructions) | Longer | Shorter |
| Emphasis | Software (compiler) | Hardware |
| Power consumption | Low — ideal for mobile/embedded devices | Higher |
| Examples | ARM, RISC-V | Intel x86, AMD |
:::

```text | Multiplying two numbers stored in memory
CISC (one instruction):      MULT 2:3, 5:2        ; load both, multiply, store

RISC (several simple ones):  LOAD  A, 2:3
                             LOAD  B, 5:2
                             PROD  A, B
                             STORE 2:3, A
```

:::tip
Put ticks in a RISC/CISC table by remembering two key ideas: **RISC = simple, one cycle, many registers, low power**; **CISC = complex, many cycles, fewer instructions per program**.
:::
