---
summary: The address, data and control buses, the registers used in the fetch-decode-execute cycle, and how clock speed, word length and bus width affect performance.
---
# Address, data and control buses
@lo 12.3.2.4

:::definition System bus
A set of parallel wires that **connects the CPU, main memory and input/output controllers**, made of three buses.
:::

:::compare
| Bus | Carries | Direction |
|---|---|---|
| **Address bus** | The **memory address** (or I/O port) to be read or written | **One-way**: CPU → memory/I/O |
| **Data bus** | The **data or instruction** being transferred | **Two-way** (bidirectional) |
| **Control bus** | **Control and timing signals**: memory read, memory write, clock, interrupt request, bus request, reset | Two-way |
:::

:::mermaid Buses connecting the components
flowchart LR
  CPU[CPU] -- address bus --> MEM[Main memory]
  CPU -- address bus --> IO[I/O controllers]
  CPU <-- data bus --> MEM
  CPU <-- data bus --> IO
  CPU <-. control bus .-> MEM
  CPU <-. control bus .-> IO
:::

# The fetch-decode-execute cycle
@lo 12.3.2.5

:::compare Registers
| Register | Purpose |
|---|---|
| **PC** — Program Counter | Holds the **address of the next instruction** |
| **MAR** — Memory Address Register | Holds the address of the location to be read/written |
| **MDR** — Memory Data Register (MBR) | Holds the data/instruction just read from or to be written to memory |
| **CIR** — Current Instruction Register | Holds the instruction being decoded and executed |
| **ACC** — Accumulator | Holds the results of calculations |
| Status register | Flags: zero, negative, carry, overflow |
:::

:::steps Fetch–decode–execute in register transfer notation
- **MAR ← [PC]** — the address of the next instruction is copied to the MAR (sent along the address bus).
- **PC ← [PC] + 1** — the PC is incremented to point to the following instruction.
- **MDR ← [[MAR]]** — the instruction at that address is read into the MDR via the data bus (control bus: *memory read*).
- **CIR ← [MDR]** — the instruction is copied to the CIR.
- **Decode** — the control unit splits the instruction into **opcode** and **operand** and works out what to do.
- **Execute** — the ALU or control unit carries it out (e.g. load, add, store, jump — a jump changes the PC).
- Check for **interrupts**, then repeat.
:::

:::tip
Learn the notation exactly: square brackets `[ ]` mean **"the contents of"**. `[[MAR]]` = the contents of the address held in MAR.
:::

# Factors affecting performance
@lo 12.3.2.6

:::compare
| Factor | Meaning | Effect on performance |
|---|---|---|
| **Clock speed** | Number of cycles per second (GHz) | Higher → more instructions per second (limited by heat) |
| **Word length** | Number of bits the CPU processes as one unit (32, 64 bits) | Longer → larger numbers and more data per operation |
| **Data bus width** | Number of bits transferred at once | Wider → more data per transfer, fewer transfers |
| **Address bus width** | Number of address lines | Wider → more memory can be addressed (2ⁿ locations) |
| Number of cores | Independent processing units | More tasks in parallel (if software supports it) |
| Cache size | Fast memory inside the CPU | Larger → fewer slow RAM accesses |
:::

:::example
Doubling the data bus width from 32 to 64 bits lets the CPU transfer **8 bytes instead of 4** in one bus cycle, so moving a block of data takes about **half as many** transfers.
:::
