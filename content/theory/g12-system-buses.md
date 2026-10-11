---
summary: The components of the CPU, how data is transferred between the CPU, memory and I/O through the address, data and control buses, the registers and steps of the fetch–decode–execute cycle in register transfer notation, interrupts, and how clock speed, word length, bus width, cores and cache affect performance.
---
# The CPU and the system bus
@lo 12.3.2.4

:::definition Central Processing Unit (CPU)
The part of the computer that **fetches, decodes and executes** program instructions. It contains the **control unit (CU)**, the **arithmetic logic unit (ALU)**, **registers** and **cache**, and is connected to main memory and input/output devices by the **system bus**.
:::

:::cards
### Control unit (CU)
- **Decodes** instructions and **sends control signals** to the other components.
- Coordinates the **fetch–decode–execute** cycle and the movement of data along the buses.
### Arithmetic logic unit (ALU)
- Performs **arithmetic** (add, subtract) and **logical** operations (AND, OR, NOT, comparisons, shifts).
- Results are usually stored in the **accumulator (ACC)**.
### Registers
- Very small, very fast storage locations **inside the CPU** that hold addresses, instructions and data being used right now.
### Clock
- Sends regular **pulses** that keep all components **synchronised**; each pulse is one **clock cycle**.
:::

:::definition System bus
A set of **parallel wires (lines)** on the motherboard that **connects the CPU, main memory and input/output (I/O) controllers**. Each wire carries **one bit** at a time. The system bus is made up of the **address bus**, the **data bus** and the **control bus**.
:::

:::ascii Buses connecting the components
   +---------------------------------+
   |   CPU: control unit, ALU,       |
   |        registers                |
   +---------------------------------+
       |           ^ |          ^ |
       | address   | | data     | | control
       | (one-way) | | (two-way)| | (two-way)
       v           | v          | v
   ===================================  system bus
       |           ^ |          ^ |
       v           | v          | v
   +--------------+    +--------------+
   | Main memory  |    |     I/O      |
   | (RAM / ROM)  |    | controllers  |
   +--------------+    +--------------+
:::

# Address, data and control buses
@lo 12.3.2.4

:::compare The three buses
| Bus | Carries | Direction | Width affects |
|---|---|---|---|
| **Address bus** | The **address** of the memory location (or I/O port) to be read from or written to | **Unidirectional** (one-way): CPU → memory / I/O | How **much memory** can be addressed: n lines → **2ⁿ** locations |
| **Data bus** | The **data or instruction** being transferred | **Bidirectional** (two-way): CPU ↔ memory / I/O | How **many bits** are transferred **at once** |
| **Control bus** | **Control and timing signals** | **Bidirectional**: signals go both to and from the CPU | — |
:::

:::compare Signals on the control bus
| Signal | Purpose |
|---|---|
| **Memory read** | Tells memory to put the contents of the addressed location on the data bus |
| **Memory write** | Tells memory to store the value on the data bus at the addressed location |
| **Clock** | Synchronises the operations of all components |
| **Interrupt request** | A device tells the CPU it needs attention |
| **Bus request / bus grant** | A device asks for / is given control of the bus (e.g. for DMA) |
| **Reset** | Restarts the system |
:::

:::steps Reading data from memory
- The CPU puts the **address** in the **MAR**, and it is sent along the **address bus**.
- The CU sends a **memory read** signal along the **control bus**.
- Memory places the **contents** of that location on the **data bus**.
- The data arrives in the **MDR**.
:::

:::steps Writing data to memory
- The **address** is placed in the **MAR** and sent along the **address bus**.
- The **data** is placed in the **MDR** and sent along the **data bus**.
- The CU sends a **memory write** signal along the **control bus**.
- Memory stores the data at that address.
:::

:::callout info Why is the address bus one-way?
Only the **CPU** decides **which** location to use, so addresses always travel **from** the CPU. Data must travel **both** ways — into the CPU when reading and out of it when writing — so the data bus is **two-way**.
:::

# Registers used in the cycle
@lo 12.3.2.5

:::compare Special-purpose registers
| Register | Purpose |
|---|---|
| **PC** — Program Counter | Holds the **address of the next instruction** to be fetched |
| **MAR** — Memory Address Register | Holds the **address** of the memory location to be read or written |
| **MDR** — Memory Data Register (also **MBR**, Memory Buffer Register) | Holds the **data or instruction** just read from memory or about to be written |
| **CIR** — Current Instruction Register | Holds the **instruction** currently being decoded and executed |
| **ACC** — Accumulator | Holds the **results** of calculations by the ALU |
| **Status register** | Holds **flags**: zero, negative, carry, overflow, interrupt |
| **IX** — Index register | Used for **indexed addressing** |
:::

:::tip Register transfer notation
- **←** means "is copied into".
- **[ ]** means "**the contents of**": `[PC]` = the value stored in the PC.
- **[[MAR]]** means "the contents of the **memory location** whose address is in the MAR".
:::

# The fetch–decode–execute cycle
@lo 12.3.2.5

:::definition Instruction cycle (fetch–decode–execute)
The sequence of steps the CPU repeats **for every instruction**: **fetch** the next instruction from memory, **decode** it to work out what it means, and **execute** it.
:::

:::steps Fetch–decode–execute in register transfer notation
- **MAR ← [PC]** — the address of the next instruction is copied from the PC to the MAR and sent along the **address bus**.
- **PC ← [PC] + 1** — the PC is **incremented** so it points to the following instruction.
- **MDR ← [[MAR]]** — a **memory read** signal is sent on the **control bus**; the instruction at that address travels along the **data bus** into the MDR.
- **CIR ← [MDR]** — the instruction is copied into the CIR.
- **Decode** — the **control unit** splits the instruction into **opcode** and **operand** and works out what must be done.
- **Execute** — the instruction is carried out: e.g. data is loaded or stored, the **ALU** does a calculation, or a **jump** puts a new address into the PC.
- **Check for interrupts**, then start the next cycle.
:::

:::mermaid The instruction cycle
flowchart TB
  F[FETCH: MAR gets PC, PC incremented, MDR gets instruction, CIR gets MDR] --> D[DECODE: control unit splits opcode and operand]
  D --> E[EXECUTE: ALU calculates, data moved, or PC changed by a jump]
  E --> I{Interrupt waiting?}
  I -- no --> F
  I -- yes --> S[Save registers, run interrupt service routine, restore]
  S --> F
:::

:::example Worked example — executing LDD 50 (load the contents of address 50)
PC = **20**, memory address 20 holds the instruction **LDD 50**, address 50 holds **37**.
| Step | Notation | Result |
|---|---|---|
| 1 | MAR ← [PC] | MAR = 20 |
| 2 | PC ← [PC] + 1 | PC = 21 |
| 3 | MDR ← [[MAR]] | MDR = LDD 50 |
| 4 | CIR ← [MDR] | CIR = LDD 50 |
| 5 | Decode | Opcode LDD (load direct), operand 50 |
| 6 | MAR ← 50 | MAR = 50 |
| 7 | MDR ← [[MAR]] | MDR = 37 |
| 8 | ACC ← [MDR] | ACC = 37 |
:::

:::definition Interrupt
A **signal** from hardware or software (e.g. a key pressed, printer out of paper, a timer, a program error) telling the CPU that something **needs attention**. At the end of each cycle the CPU checks for interrupts; if one has a higher priority, it **saves the registers**, runs the **interrupt service routine (ISR)** and then **restores** the registers and continues.
:::

# Factors affecting performance
@lo 12.3.2.6

:::compare Factors that affect CPU performance
| Factor | Definition | Effect of increasing it |
|---|---|---|
| **Clock speed** (clock rate) | The **number of clock cycles per second**, measured in **hertz** (3.5 GHz = 3.5 billion cycles per second) | **More instructions** executed per second; fetch–decode–execute happens faster. But more **heat** and power — risk of overheating |
| **Word length** | The **number of bits the CPU can process as one unit** (e.g. 32 or 64 bits) | Larger numbers and **more data** processed in one operation; fewer instructions needed |
| **Data bus width** | The **number of bits the data bus can carry at one time** | **More data per transfer** → fewer transfers needed |
| **Address bus width** | The **number of lines** in the address bus | **More memory locations** can be addressed (2ⁿ) |
| **Number of cores** | Independent processing units on one chip | Several instructions / tasks processed **in parallel** — if the software is written to use them |
| **Cache size** | Very fast memory inside / near the CPU | Frequently used data and instructions found quickly → fewer slow RAM accesses |
:::

:::example Worked examples
- A **3 GHz** clock gives 3 000 000 000 cycles per second, so one cycle lasts 1 ÷ 3 × 10⁹ ≈ **0.33 ns**.
- Widening the data bus from **32 to 64 bits** transfers **8 bytes instead of 4** per bus cycle, so moving 1 MB takes about **half** as many transfers.
- A **64-bit** data bus at **100 MHz** can transfer 8 bytes × 100 000 000 = **800 MB per second**.
- Adding **one** line to the address bus **doubles** the addressable memory (2²⁰ = 1 MiB → 2²¹ = 2 MiB).
:::

:::cards
### Limits of clock speed
- Higher clock speed produces more **heat**; without good cooling the CPU may **malfunction** or slow itself down (**throttling**).
- **Overclocking** runs a CPU faster than its rated speed — faster, but risk of instability and damage.
### Limits of more cores
- Doubling the cores does **not** double the speed: some tasks cannot be split, and cores must **share** the buses and memory.
:::

# Exam practice and summary
@lo 12.3.2.4 12.3.2.5 12.3.2.6

:::example Exam-style answers
**Q: Write the names and purposes of the buses used by the CPU. [6]**
**Data bus** (1) — carries data / instructions between the CPU, memory and I/O, in **both directions** (1). **Address bus** (1) — carries the **address** of the location data is read from or written to, **one way** from the CPU (1). **Control bus** (1) — carries **control signals** such as memory read / write, clock and interrupts (1).

**Q: The notation has errors: MDR ← [PC]; PC ← [PC] + 2; CIR ← [MAR]. Correct them. [3]**
**MAR ← [PC]** (1); **PC ← [PC] + 1** (1); **CIR ← [MDR]** (1).

**Q: Describe the effect of increasing the clock speed. [3]**
More cycles per second, so instructions are **executed faster** (1); the fetch–decode–execute cycle happens **more often** (1); more **heat** is produced, which may cause overheating / malfunction (1).

**Q: Explain what happens in the fetch stage. [3]**
The address in the **PC** is copied to the **MAR** (1); the PC is **incremented** (1); the instruction at that address is copied into the **MDR** and then the **CIR** (1).
:::

:::warning Common mistakes
- Saying the **address bus** is two-way — it is **one-way** (from the CPU).
- Writing **MDR ← [PC]** — the PC's value goes to the **MAR**.
- Saying the PC holds the **current** instruction — it holds the **address** of the **next** one.
- Confusing **word length** (bits processed at once) with **bus width** (bits transferred at once).
- Saying a higher clock speed "makes the computer store more" — it makes it **process faster**.
:::

:::steps Check yourself
- Name the three buses, what each carries and in which direction.
- Describe how data is read from memory using the buses.
- State the purpose of the PC, MAR, MDR, CIR and ACC.
- Write the fetch stage in register transfer notation.
- What is an interrupt and when does the CPU check for one?
- Explain how clock speed, word length and bus width affect performance.
:::
