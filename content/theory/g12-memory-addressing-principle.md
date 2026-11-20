---
summary: How main memory is organised into addressed locations, how the address bus width sets the number of addresses, addressing modes (immediate, direct, indirect, indexed, relative), the stored-program (von Neumann) principle and Harvard architecture, memory organisation by pages and segments with address translation, virtual memory, and virtual machines.
---
# Memory locations and addresses
@lo 12.3.4.1

## Main memory as a list of numbered locations

**Main memory (RAM)** holds the programs that are running and the data they are working on. Physically it is a huge grid of tiny storage cells, but logically the CPU sees it as one very long **list of storage locations**, numbered from **0** upwards. Each location holds a fixed amount of data — in almost all modern computers **one byte** (8 bits) — and each has its own number, its **address**. The address is like a house number on a long street: the house number does not tell you who lives there, it only tells you **where** to go. In the same way, the address of a location is not the data; it is the **number of the place** where the data is kept.

This idea is the **principle of memory addressing**: memory is divided into locations, **every location has a unique address**, and the CPU can **read or write any location directly** by giving its address. Because any address can be reached in the same time, no matter where it is, main memory is called **random-access memory** — the CPU does not have to read locations 0, 1, 2… in order to reach location 5 000, as it would with a tape.

:::definition Memory address
A **unique number that identifies one storage location** in main memory. The CPU uses the address to select the location it wants to **read from** or **write to**. The address and the contents of a location are two different things.
:::

:::definition Memory location (cell)
A unit of main memory that stores a **fixed number of bits** — usually **one byte** — and is identified by **one address**.
:::

## The buses and registers that use the address

The CPU and main memory are joined by three groups of wires, the **system buses**. Each has a clear job in memory addressing:

- The **address bus** carries the **address** of the location from the CPU to memory. It is **one-way** (CPU → memory): memory never sends addresses back.
- The **data bus** carries the **contents** — the data or instruction — between CPU and memory. It is **two-way**: data goes to memory when writing and to the CPU when reading.
- The **control bus** carries **control signals**, for example *memory read*, *memory write* and the **clock** signal, so memory knows what to do with the address it receives.

Inside the CPU two special registers sit at the ends of these buses. The **Memory Address Register (MAR)** holds the address of the location that is about to be used; its contents are placed on the address bus. The **Memory Data Register (MDR)** — also called the memory buffer register — holds the data that has just been read from memory, or that is about to be written to it; it is connected to the data bus.

:::svg The CPU selects a location by putting its address on the address bus; the contents travel on the data bus
<svg class="mem" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="On the left the CPU contains the MAR holding address 3 and the MDR holding 00000101. Three buses link it to main memory on the right: the address bus one way from the MAR, the data bus both ways from the MDR and the control bus carrying read or write. Main memory is a column of numbered locations 0 to 7 with their binary addresses and contents; location 3 is highlighted and holds 00000101">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.mem .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .ab{stroke:var(--primary);stroke-width:3;fill:none}
    svg.mem .db{stroke:var(--success);stroke-width:3;fill:none}
    svg.mem .cb{stroke:var(--warning);stroke-width:3;fill:none;stroke-dasharray:6 4}
  </style>
  <defs>
    <marker id="memA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="memA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
    <marker id="memA3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--warning)"/></marker>
  </defs>
  <rect class="bx" x="20" y="30" width="200" height="270" rx="10"/><text class="h" x="120" y="54" text-anchor="middle">CPU</text>
  <rect class="pb" x="40" y="80" width="160" height="56" rx="6"/><text class="t" x="120" y="102" text-anchor="middle">MAR (address)</text><text class="mp" x="120" y="124" text-anchor="middle">0000 0011 = 3</text>
  <rect class="ok" x="40" y="160" width="160" height="56" rx="6"/><text class="t" x="120" y="182" text-anchor="middle">MDR (data)</text><text class="mp" x="120" y="204" text-anchor="middle">0000 0101</text>
  <rect class="bx" x="40" y="238" width="160" height="44" rx="6"/><text class="t" x="120" y="265" text-anchor="middle">Control unit</text>
  <line class="ab" x1="200" y1="108" x2="470" y2="108" marker-end="url(#memA1)"/><text class="t" x="335" y="98" text-anchor="middle">Address bus (one way)</text>
  <line class="db" x1="206" y1="188" x2="464" y2="188" marker-start="url(#memA2)" marker-end="url(#memA2)"/><text class="t" x="335" y="178" text-anchor="middle">Data bus (two way)</text>
  <line class="cb" x1="200" y1="260" x2="470" y2="260" marker-end="url(#memA3)"/><text class="t" x="335" y="250" text-anchor="middle">Control bus: READ / WRITE, clock</text>
  <text class="h" x="610" y="24" text-anchor="middle">Main memory</text>
  <text class="s" x="520" y="42" text-anchor="middle">Address</text><text class="s" x="680" y="42" text-anchor="middle">Contents</text>
  <rect class="bx" x="475" y="50" width="265" height="30"/><text class="m" x="520" y="70" text-anchor="middle">0 · 000</text><text class="m" x="680" y="70" text-anchor="middle">1001 0110</text>
  <rect class="bx" x="475" y="80" width="265" height="30"/><text class="m" x="520" y="100" text-anchor="middle">1 · 001</text><text class="m" x="680" y="100" text-anchor="middle">0011 1100</text>
  <rect class="bx" x="475" y="110" width="265" height="30"/><text class="m" x="520" y="130" text-anchor="middle">2 · 010</text><text class="m" x="680" y="130" text-anchor="middle">1111 0000</text>
  <rect class="pb" x="475" y="140" width="265" height="30"/><text class="mp" x="520" y="160" text-anchor="middle">3 · 011</text><text class="mp" x="680" y="160" text-anchor="middle">0000 0101</text>
  <rect class="bx" x="475" y="170" width="265" height="30"/><text class="m" x="520" y="190" text-anchor="middle">4 · 100</text><text class="m" x="680" y="190" text-anchor="middle">0100 0001</text>
  <rect class="bx" x="475" y="200" width="265" height="30"/><text class="m" x="520" y="220" text-anchor="middle">5 · 101</text><text class="m" x="680" y="220" text-anchor="middle">0000 0000</text>
  <rect class="bx" x="475" y="230" width="265" height="30"/><text class="m" x="520" y="250" text-anchor="middle">6 · 110</text><text class="m" x="680" y="250" text-anchor="middle">1110 0011</text>
  <rect class="bx" x="475" y="260" width="265" height="30"/><text class="m" x="520" y="280" text-anchor="middle">7 · 111</text><text class="m" x="680" y="280" text-anchor="middle">0010 1010</text>
  <line x1="600" y1="50" x2="600" y2="290" style="stroke:var(--border);stroke-width:1.5"/>
  <text class="s" x="475" y="318">A 3-bit address bus gives 2³ = 8 locations (0–7).</text>
</svg>
:::

:::steps Reading from memory (for example, loading the contents of address 3)
- The CPU copies the address **3** into the **MAR**.
- The MAR puts the address on the **address bus**; memory decodes it and selects location 3.
- The control unit sends a **memory read** signal on the **control bus**.
- Memory places the contents of location 3 (0000 0101) on the **data bus**.
- The data arrives in the **MDR**, from where it is copied to the register that needs it (e.g. the accumulator).
:::

:::steps Writing to memory (for example, storing 42 at address 6)
- The CPU copies the address **6** into the **MAR** and the data **42** into the **MDR**.
- The address goes on the **address bus** and the data on the **data bus**.
- The control unit sends a **memory write** signal.
- Memory stores 42 in location 6; the **old contents are overwritten** and lost.
:::

## Byte-addressable and word-addressable memory

A **word** is the number of bits the CPU handles as one unit — the size of its registers and usually the width of the data bus, for example 16, 32 or 64 bits. Memory can be addressed in two ways. In **byte-addressable** memory every **byte** has its own address, so a 64-bit (8-byte) word occupies 8 consecutive addresses, for example 1000–1007, and the next word starts at 1008. Almost all modern computers are byte-addressable, because text characters and many other data items are one byte long and must be reachable individually. In **word-addressable** memory each address holds a **whole word**; this was common in older computers and is still used in some digital signal processors. With the same number of addresses, word-addressable memory can hold more data, but single bytes cannot be reached directly.

## How the address bus width limits the memory

Each line (wire) of the address bus carries one bit of the address. With **n lines** the CPU can form **2ⁿ different binary numbers**, so it can select **2ⁿ different locations** — no more. This is why the width of the address bus sets the **maximum amount of memory** the CPU can use. **Adding one line doubles** the number of addresses, because every existing address can now be combined with a 0 or a 1 in the new bit.

:::definition Addressable memory
The **maximum memory a CPU can address**: **2ⁿ × size of each location**, where **n** is the width of the address bus in bits. With byte-addressable memory, this is simply **2ⁿ bytes**.
:::

:::compare Address bus width and maximum addressable memory (1 byte per location)
| Address bus width | Number of addresses | Maximum memory | Example |
|---|---|---|---|
| 8 bits | 2⁸ = 256 | 256 bytes | Very simple microcontrollers |
| 16 bits | 2¹⁶ = 65 536 | **64 KiB** | 1980s home computers |
| 20 bits | 2²⁰ = 1 048 576 | **1 MiB** | Intel 8086 (first IBM PC) |
| 24 bits | 2²⁴ = 16 777 216 | **16 MiB** | Intel 80286 |
| 32 bits | 2³² | **4 GiB** | 32-bit Windows — the "4 GB limit" |
| 64 bits | 2⁶⁴ | 16 EiB | In practice CPUs use about 48 lines → 256 TiB |
:::

:::example Worked example — address bus calculations
1. A computer has a **24-bit** address bus and each location holds a **2-byte** word. Maximum memory = 2²⁴ × 2 = 16 777 216 × 2 = 33 554 432 bytes = **32 MiB**.
2. How many address lines are needed for **256 MiB** of byte-addressable memory? 256 MiB = 2⁸ × 2²⁰ = 2²⁸ bytes → **28 lines**.
3. A school's old laptop runs a 32-bit operating system and has 8 GB of RAM fitted. It can use only **4 GiB**, because 32 address bits give only 2³² addresses — the rest of the RAM has no address the system can form. Installing a 64-bit operating system solves the problem.
:::

## Why memory addressing matters

Memory addressing is what makes a general-purpose computer possible. Because every location can be reached **directly** by its address, a program can keep thousands of variables and jump straight to any one of them; the CPU can fetch the next instruction from wherever the program counter points; and the operating system can place different programs in different **ranges of addresses** and keep them apart. Every topic in the rest of this lesson — addressing modes, the stored-program concept, paging and segmentation — is a way of **using or translating addresses**.

# Addressing modes
@lo 12.3.4.1

## Opcode, operand and addressing mode

A machine-code instruction has two parts. The **opcode** says **what to do** (load, add, store, jump…). The **operand** gives the information the instruction works on. But an operand is just a number — 30, for example — and the CPU needs to know **what that number means**: is it the value itself, the address of the value, or something from which the address must be worked out? The **addressing mode** tells it. In assembly language the mode is often built into the opcode (LDM, LDD, LDI, LDX) or shown by a symbol such as **#** for an immediate value.

:::definition Addressing mode
The method the CPU uses to **interpret the operand** of an instruction in order to find the **data** (or the address) it needs — for example as the value itself, as an address, or as an address to which an index is added.
:::

## The five addressing modes

- **Immediate addressing** — the operand **is the actual value** to be used. `LDM #30` loads the number 30 into the accumulator. No memory access is needed to fetch the data, so it is the **fastest** mode, but the value is fixed when the program is written. Used for **constants**: setting a counter to 0, adding 1, comparing with 100.
- **Direct addressing** — the operand is the **address** of the value. `LDD 30` goes to location 30 and loads whatever is stored there. One memory access is needed. Used for **simple variables** stored at a fixed address. Its limit: the address must fit into the operand field — an 8-bit operand can only reach addresses 0–255.
- **Indirect addressing** — the operand is the address of a location that **holds the address** of the value. `LDI 30` reads location 30, finds (say) 45 there, and then loads the contents of location 45. Two memory accesses are needed, so it is slower, but it allows **pointers** (the address of the data can be changed while the program runs) and reaching addresses **larger than the operand field** could hold, because a whole memory word can store the address.
- **Indexed addressing** — the address is the operand **plus the contents of the index register (IX)**. `LDX 30` with IX = 3 loads from address 33. Increasing IX by 1 each time round a loop makes the same instruction read 30, 31, 32… — perfect for stepping through an **array** or a list of marks.
- **Relative addressing** — the address is worked out **relative to the current instruction**, i.e. the operand is added to the **program counter**. `JMR 5` jumps five locations forward from where the program is. Because no absolute address appears in the code, the program still works when the operating system loads it at a **different place** in memory — the code is **relocatable**. Used mainly for jumps in loops and IF statements.

:::svg How each addressing mode turns the operand 30 into the value that is loaded
<svg class="mem" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Memory contents: address 30 holds 45, 31 holds 12, 33 holds 60, 45 holds 78; the index register holds 3. Immediate LDM #30 loads 30 itself. Direct LDD 30 goes to address 30 and loads 45. Indirect LDI 30 reads 45 at address 30 and then loads 78 from address 45. Indexed LDX 30 adds IX 3 to get address 33 and loads 60">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.mem .mp{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .ln{stroke:var(--primary);stroke-width:2;fill:none}
  </style>
  <defs><marker id="memB1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="h" x="620" y="22" text-anchor="middle">Memory</text>
  <rect class="bx" x="540" y="32" width="160" height="34"/><text class="m" x="580" y="54" text-anchor="middle">30</text><text class="mp" x="660" y="54" text-anchor="middle">45</text>
  <rect class="bx" x="540" y="66" width="160" height="34"/><text class="m" x="580" y="88" text-anchor="middle">31</text><text class="m" x="660" y="88" text-anchor="middle">12</text>
  <rect class="bx" x="540" y="100" width="160" height="34"/><text class="m" x="580" y="122" text-anchor="middle">32</text><text class="m" x="660" y="122" text-anchor="middle">7</text>
  <rect class="bx" x="540" y="134" width="160" height="34"/><text class="m" x="580" y="156" text-anchor="middle">33</text><text class="mp" x="660" y="156" text-anchor="middle">60</text>
  <rect class="bx" x="540" y="180" width="160" height="34"/><text class="m" x="580" y="202" text-anchor="middle">45</text><text class="mp" x="660" y="202" text-anchor="middle">78</text>
  <line x1="620" y1="32" x2="620" y2="168" style="stroke:var(--border)"/><line x1="620" y1="180" x2="620" y2="214" style="stroke:var(--border)"/>
  <text class="s" x="580" y="236" text-anchor="middle">address</text><text class="s" x="660" y="236" text-anchor="middle">contents</text>
  <rect class="ok" x="560" y="256" width="120" height="40" rx="6"/><text class="t" x="620" y="281" text-anchor="middle">IX = 3</text>
  <rect class="pb" x="20" y="30" width="150" height="44" rx="6"/><text class="m" x="95" y="57" text-anchor="middle">LDM #30</text>
  <text class="t" x="185" y="47">Immediate: the operand is the value</text><text class="h" x="185" y="67">ACC = 30</text><text class="s" x="270" y="67">(no memory access)</text>
  <rect class="pb" x="20" y="100" width="150" height="44" rx="6"/><text class="m" x="95" y="127" text-anchor="middle">LDD 30</text>
  <text class="t" x="185" y="117">Direct: go to address 30</text><text class="h" x="185" y="137">ACC = 45</text>
  <path class="ln" d="M370,117 C450,117 470,49 536,49" marker-end="url(#memB1)"/>
  <rect class="pb" x="20" y="170" width="150" height="44" rx="6"/><text class="m" x="95" y="197" text-anchor="middle">LDI 30</text>
  <text class="t" x="185" y="187">Indirect: address 30 holds 45,</text><text class="t" x="185" y="205">then go to address 45</text><text class="h" x="380" y="205">ACC = 78</text>
  <path class="ln" d="M705,49 C745,80 745,170 703,197" marker-end="url(#memB1)"/>
  <rect class="pb" x="20" y="240" width="150" height="44" rx="6"/><text class="m" x="95" y="267" text-anchor="middle">LDX 30</text>
  <text class="t" x="185" y="257">Indexed: 30 + IX (3) = 33</text><text class="h" x="185" y="277">ACC = 60</text>
  <path class="ln" d="M370,257 C450,257 470,151 536,151" marker-end="url(#memB1)"/>
  <text class="s" x="20" y="318">Relative (JMR 5): next address = address of the current instruction + 5 — used for jumps.</text>
</svg>
:::

:::example Worked example — what is loaded into the accumulator?
Memory: address **30** → 45, **31** → 12, **33** → 60, **45** → 78. Index register **IX = 3**.

| Instruction | Mode | Working | ACC |
|---|---|---|---|
| `LDM #30` | Immediate | the value 30 itself | **30** |
| `LDD 30` | Direct | contents of address 30 | **45** |
| `LDI 30` | Indirect | address 30 holds 45 → contents of address 45 | **78** |
| `LDX 30` | Indexed | 30 + 3 = 33 → contents of address 33 | **60** |

If the program then executes `INC IX` (IX becomes 4) and `LDX 30` again, it loads the contents of address 34 — the next element of the array.
:::

:::example Worked example — adding up the marks of a class with indexed addressing
The marks of 25 students are stored in addresses 200–224. A program sets **IX = 0** and **ACC = 0** (immediate addressing: `LDM #0`). In a loop it executes `ADD` with indexed addressing on base address 200, so the first time it adds the contents of 200 + 0, then IX is incremented and the same instruction adds 200 + 1, 200 + 2 … up to 200 + 24. After 25 passes the accumulator holds the total. Without indexed addressing the programmer would need 25 different instructions, one for each address. The loop's jump back to its start uses **relative** addressing, so the whole program can be loaded anywhere in memory.
:::

:::compare Addressing modes compared
| Mode | The operand is… | Memory accesses to get the data | Main use | Limitation |
|---|---|---|---|---|
| **Immediate** | the **value** | 0 | Constants, counters | Value fixed in the program |
| **Direct** | the **address** of the value | 1 | Simple variables | Address must fit in the operand |
| **Indirect** | the address of the **address** | 2 | Pointers, large addresses | Slowest |
| **Indexed** | base address; **+ IX** gives the address | 1 (+ addition) | Arrays, lists, tables | Needs an index register |
| **Relative** | an **offset from the PC** | — (mainly jumps) | Loops, IF jumps, relocatable code | Can only reach nearby addresses |
:::

# Storing programs and data
@lo 12.3.4.2

## The stored-program concept

The earliest electronic computers, such as ENIAC (1945), were programmed by **rewiring**: to change the program, engineers moved cables and switches, which could take days. In 1945 John von Neumann described a different design, which every ordinary computer still follows today. Its central idea is that **the program itself is data**: the instructions are coded as binary numbers and stored in **the same main memory** as the data they work on. To run a different program, you do not touch the hardware — you simply **load a different set of instructions into memory**.

:::definition Stored-program concept (von Neumann architecture)
**Program instructions and data are stored together in the same main memory**, both in binary. The CPU **fetches the instructions one at a time** from memory, **decodes** and **executes** them, using the **same buses** for instructions and data.
:::

The key principles, each of which can be asked in an exam:

1. **One memory for instructions and data.** Both are sequences of bits stored at addresses. A location that contains 0100 0001 could be the letter "A", the number 65 or an instruction — memory itself does not know which.
2. **The CPU tells instructions from data by context.** A word is treated as an instruction because the **program counter (PC)** pointed to it during the **fetch** stage. It is treated as data when an instruction refers to its address as an operand.
3. **Sequential execution.** Instructions are stored in consecutive addresses and executed **one after another**: after each fetch the PC is **incremented** to the next address. Only a **jump/branch** instruction changes the order, by loading a new address into the PC.
4. **Programs can be changed easily.** Because programs live in memory, a computer becomes a word processor, a game or a compiler simply by loading different software. A program can even **produce another program** as its output — this is exactly what a compiler does.

:::mermaid The fetch–decode–execute cycle uses the stored program
flowchart TB
  A[PC holds the address of the next instruction] --> B[Address copied from PC to MAR]
  B --> C[Instruction read from memory into MDR, then copied to CIR]
  C --> D[PC incremented to point to the next instruction]
  D --> E[Control unit decodes the instruction in CIR]
  E --> F[Instruction executed - data read from or written to memory if needed]
  F --> A
:::

## Where programs and data are kept in memory

When a program runs, the operating system gives it a range of addresses and organises them into areas. The **code** area holds the machine-code instructions. The **data** area holds global variables and constants. The **stack** stores local variables, parameters and return addresses while subroutines run, and the **heap** holds data created while the program runs (for example a list that grows). Keeping instructions and data in separate **areas** does not break the von Neumann idea — they are still in the same memory and reached over the same buses — but it lets the operating system mark the code area as **read-only**, so that a bug or a virus cannot overwrite the instructions. This division into logical areas is the basis of **segmentation**, studied in the next lesson.

:::example Worked example — a tiny program and its data in the same memory
A program that adds two numbers is loaded starting at address 100. Its data is stored at addresses 200–202.

| Address | Contents | Instruction or data? |
|---|---|---|
| 100 | `LDD 200` | instruction — load the first number |
| 101 | `ADD 201` | instruction — add the second number |
| 102 | `STO 202` | instruction — store the result |
| 103 | `END` | instruction — stop |
| 200 | 17 | data |
| 201 | 25 | data |
| 202 | 42 (after running) | data — the result |

The PC starts at 100. Fetches take place from 100, 101, 102, 103, so those words are treated as instructions. Addresses 200–202 are only ever used as **operands**, so they are treated as data. If, by mistake, a jump sent the PC to 200, the CPU would try to decode 17 as an instruction — showing that memory itself does not distinguish code from data.
:::

## The von Neumann bottleneck

Sharing one memory and one set of buses is simple and flexible, but it has a cost. An instruction and the data it needs **cannot be transferred at the same time**, because they would both need the data bus. In addition, the CPU is many times faster than main memory, so it often has to **wait** for the next instruction or data item to arrive. This limit on performance is called the **von Neumann bottleneck**. Modern computers reduce it with **cache memory** (small, very fast memory inside the CPU that keeps recently used instructions and data), **pipelining** (fetching the next instruction while the current one is executing), wider data buses and higher bus speeds.

:::definition Von Neumann bottleneck
The **limit on speed** caused by instructions and data **sharing the same memory and bus**: they cannot be fetched at the same time, so the CPU often waits for memory.
:::

## Harvard architecture

The **Harvard architecture** removes the bottleneck by giving instructions and data **separate memories with separate buses**. While one instruction is being executed and its data is read over the data bus, the next instruction can already be fetched over the instruction bus. The price is a more complex and expensive design, and the split of memory between code and data is **fixed** — free space in the instruction memory cannot be used for data. Harvard architecture is used where speed and predictability matter more than flexibility: **microcontrollers** (in a washing machine, a car's ABS, an Arduino), **digital signal processors** that process sound and video in real time, and inside modern CPUs, where the **level 1 cache** is split into an instruction cache and a data cache, while main memory stays von Neumann (a "modified Harvard" design).

:::svg Von Neumann: one memory and one bus for instructions and data. Harvard: separate memories and buses
<svg class="mem" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: von Neumann architecture, the CPU is linked by one shared bus to a single memory holding both instructions and data, marked as the bottleneck. Right: Harvard architecture, the CPU is linked by an instruction bus to an instruction memory and by a separate data bus to a data memory, so both can be used at the same time">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .wn{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.mem .bus{stroke:var(--foreground);stroke-width:4}
    svg.mem .busr{stroke:var(--danger);stroke-width:4}
  </style>
  <text class="h" x="180" y="24" text-anchor="middle">Von Neumann</text>
  <rect class="pb" x="40" y="50" width="120" height="70" rx="8"/><text class="h" x="100" y="90" text-anchor="middle">CPU</text>
  <line class="busr" x1="160" y1="85" x2="220" y2="85"/>
  <rect class="bx" x="220" y="40" width="130" height="90" rx="8"/><text class="t" x="285" y="66" text-anchor="middle">One memory</text><text class="s" x="285" y="88" text-anchor="middle">instructions</text><text class="s" x="285" y="106" text-anchor="middle">+ data</text>
  <rect class="wn" x="60" y="150" width="270" height="60" rx="8"/><text class="t" x="195" y="174" text-anchor="middle">One shared bus = bottleneck</text><text class="s" x="195" y="194" text-anchor="middle">instruction OR data at a time</text>
  <line x1="380" y1="20" x2="380" y2="240" style="stroke:var(--border);stroke-width:1.5;stroke-dasharray:4 4"/>
  <text class="h" x="570" y="24" text-anchor="middle">Harvard</text>
  <rect class="pb" x="410" y="90" width="120" height="70" rx="8"/><text class="h" x="470" y="130" text-anchor="middle">CPU</text>
  <line class="bus" x1="530" y1="105" x2="590" y2="70"/><line class="bus" x1="530" y1="145" x2="590" y2="180"/>
  <rect class="ok" x="590" y="35" width="150" height="70" rx="8"/><text class="t" x="665" y="64" text-anchor="middle">Instruction</text><text class="t" x="665" y="82" text-anchor="middle">memory</text>
  <rect class="ok" x="590" y="150" width="150" height="70" rx="8"/><text class="t" x="665" y="180" text-anchor="middle">Data</text><text class="t" x="665" y="198" text-anchor="middle">memory</text>
  <text class="s" x="545" y="76" text-anchor="end">instruction bus</text><text class="s" x="545" y="185" text-anchor="end">data bus</text>
  <text class="s" x="410" y="248">Both buses work at the same time → faster</text>
</svg>
:::

:::compare Von Neumann vs Harvard architecture
| | Von Neumann | Harvard |
|---|---|---|
| Memory | **One** memory for instructions and data | **Separate** memories for instructions and data |
| Buses | **Shared** buses | **Separate** instruction and data buses |
| Speed | Instruction and data **cannot** be fetched together → bottleneck | Instruction and data fetched **at the same time** → faster |
| Flexibility | Memory used freely for code or data; programs easy to load | Memory split is **fixed** |
| Cost / complexity | Simpler, cheaper | More complex, more wiring |
| Used in | General-purpose PCs, laptops, phones (main memory) | Microcontrollers, DSPs, embedded systems, L1 cache inside CPUs |
:::

:::warning Common mistakes about addressing and stored programs
- Confusing the **address** with the **contents**. "Location 30 holds 45" — 30 is the address, 45 the contents.
- Saying **n** address lines give **2 × n** addresses. They give **2ⁿ**: 16 lines → 65 536, not 32.
- Mixing up **immediate** (the operand is the value) and **direct** (the operand is the address of the value).
- In indirect addressing, stopping after one step. LDI 30 loads the contents of the address **stored in** 30, not the contents of 30.
- Writing that the von Neumann architecture keeps instructions and data in **separate** memories — that is **Harvard**.
- Saying the **data bus** is one-way. The **address bus** is one-way (CPU → memory); the data bus is two-way.
:::

# Exam practice: memory addressing and stored programs
@lo 12.3.4.1 12.3.4.2

:::example Exam-style questions with model answers
**Q: Explain the principle of memory addressing. [3]**
Main memory is divided into locations, each storing a fixed number of bits (e.g. one byte) (1); each location has a **unique address** (1); the CPU places the address in the **MAR** and on the **address bus** to select the location, and the contents are transferred on the **data bus** (1).

**Q: A computer has a 20-bit address bus and 1 byte per location. Calculate the maximum memory it can address. [2]**
2²⁰ = 1 048 576 addresses (1) × 1 byte = **1 MiB** (1).

**Q: Explain the difference between direct and indirect addressing. [2]**
In **direct** addressing the operand is the **address of the data** (1); in **indirect** addressing the operand is the address of a location that **contains the address** of the data (1).

**Q: Explain why indexed addressing is useful when processing an array. [2]**
The address = base address + contents of the **index register** (1); incrementing IX in a loop lets the **same instruction** access each element in turn (1).

**Q: Explain the stored-program concept. [3]**
Instructions and data are stored in the **same memory** in binary (1); instructions are **fetched one at a time**, decoded and executed in sequence (1); the program can be changed by loading a different program into memory, without changing the hardware (1).

**Q: Describe one advantage and one disadvantage of the Harvard architecture compared with von Neumann. [2]**
Advantage: an instruction and data can be fetched **at the same time** (separate buses), so it is faster (1). Disadvantage: more complex / expensive; the memory split between code and data is **fixed** (1).
:::

:::warning Common mistakes in exam answers
- "Explain" questions on memory addressing need the **buses or registers**, not just "every cell has a number".
- In calculations, show **2ⁿ** and the unit conversion; an answer like "1 MB" alone may get only 1 mark.
- When comparing architectures, use **comparative** words ("whereas", "faster because…") rather than two separate descriptions.
:::

:::steps Check yourself
- What is a memory address? Which register and which bus carry it?
- List the steps of a memory read and a memory write.
- How much memory can a 16-bit and a 32-bit address bus address?
- How many address lines are needed for 64 MiB of byte-addressable memory?
- Give the value loaded by LDM #30, LDD 30, LDI 30 and LDX 30 in the worked example.
- State four principles of the stored-program concept.
- What is the von Neumann bottleneck, and how does the Harvard architecture avoid it?
:::

# Paged memory
@lo 12.3.4.2@paper

## Why memory has to be organised

A modern computer runs many programs at once: a browser, a messenger, a music player and the operating system itself. All of them need space in main memory, programs start and finish at different times, and they need different amounts of memory. The **operating system's memory manager** must decide **where** each program goes, keep programs from **interfering** with each other, and make good use of the free space. The simplest approach — giving each program one **contiguous** (continuous) block of addresses — quickly fails: as programs finish, the free memory breaks up into small separate holes, and a new program may not fit into any single hole even though the total free memory is large enough. This waste is called **external fragmentation**. Two methods of organising memory solve the problem in different ways: **paging** and **segmentation**.

Both methods depend on the difference between two kinds of address. A **logical (virtual) address** is the address the program uses — each program believes it starts at address 0. A **physical address** is the real address of a location in RAM. While the program runs, every logical address is **translated** into a physical address by hardware called the **memory management unit (MMU)**, using tables that the operating system keeps.

:::definition Logical and physical address
A **logical address** is an address as seen by the program (relative to its own start, e.g. page + offset). A **physical address** is the actual address of the location in main memory. The **memory management unit (MMU)** translates logical addresses into physical ones.
:::

## Paging: fixed-size pages and frames

:::definition Paging
A method of memory organisation in which **physical memory is divided into fixed-size blocks called frames**, and each program's **logical memory is divided into blocks of the same size called pages**. Any page can be loaded into **any free frame**, and a **page table** records which frame holds each page.
:::

With paging, the operating system no longer needs one large hole for a program. It cuts the program into pages — typically **4 KiB** each — and puts each page into whatever frame is free, anywhere in RAM. The pages of one program can be scattered, out of order, between the pages of other programs. The program does not notice, because each program has its own **page table**: for every page number it gives the **frame number** where that page is stored at the moment (and a *valid* bit saying whether the page is in RAM at all).

:::definition Page table
A table kept by the operating system for each process that **maps each page number to the frame number** where the page is stored in physical memory, together with status bits (e.g. whether the page is in RAM).
:::

:::svg Paging: the pages of a program are placed in any free frames; the page table records where each one is
<svg class="mem" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A program of four pages, 0 to 3, on the left. In the middle its page table maps page 0 to frame 3, page 1 to frame 5, page 2 to frame 1 and page 3 to frame 6. On the right, physical RAM has frames 0 to 7: frame 0 holds the operating system, frame 1 page 2, frame 2 another program, frame 3 page 0, frame 4 is free, frame 5 page 1, frame 6 page 3, frame 7 another program">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .wr{fill:var(--warning);opacity:.25;stroke:var(--warning);stroke-width:1.5}
    svg.mem .ln{stroke:var(--primary);stroke-width:1.8;fill:none}
  </style>
  <defs><marker id="memC1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="h" x="90" y="24" text-anchor="middle">Program (logical)</text>
  <rect class="pb" x="30" y="40" width="120" height="44"/><text class="t" x="90" y="67" text-anchor="middle">Page 0</text>
  <rect class="pb" x="30" y="84" width="120" height="44"/><text class="t" x="90" y="111" text-anchor="middle">Page 1</text>
  <rect class="pb" x="30" y="128" width="120" height="44"/><text class="t" x="90" y="155" text-anchor="middle">Page 2</text>
  <rect class="pb" x="30" y="172" width="120" height="44"/><text class="t" x="90" y="199" text-anchor="middle">Page 3</text>
  <text class="s" x="90" y="236" text-anchor="middle">each page 4 KiB</text>
  <text class="h" x="315" y="24" text-anchor="middle">Page table</text>
  <rect class="bx" x="245" y="40" width="140" height="30"/><text class="h" x="280" y="60" text-anchor="middle">Page</text><text class="h" x="350" y="60" text-anchor="middle">Frame</text>
  <rect class="bx" x="245" y="70" width="140" height="30"/><text class="m" x="280" y="90" text-anchor="middle">0</text><text class="m" x="350" y="90" text-anchor="middle">3</text>
  <rect class="bx" x="245" y="100" width="140" height="30"/><text class="m" x="280" y="120" text-anchor="middle">1</text><text class="m" x="350" y="120" text-anchor="middle">5</text>
  <rect class="bx" x="245" y="130" width="140" height="30"/><text class="m" x="280" y="150" text-anchor="middle">2</text><text class="m" x="350" y="150" text-anchor="middle">1</text>
  <rect class="bx" x="245" y="160" width="140" height="30"/><text class="m" x="280" y="180" text-anchor="middle">3</text><text class="m" x="350" y="180" text-anchor="middle">6</text>
  <line x1="315" y1="40" x2="315" y2="190" style="stroke:var(--border)"/>
  <line class="ln" x1="150" y1="62" x2="243" y2="85" marker-end="url(#memC1)"/>
  <line class="ln" x1="150" y1="106" x2="243" y2="115" marker-end="url(#memC1)"/>
  <line class="ln" x1="150" y1="150" x2="243" y2="145" marker-end="url(#memC1)"/>
  <line class="ln" x1="150" y1="194" x2="243" y2="175" marker-end="url(#memC1)"/>
  <text class="h" x="620" y="24" text-anchor="middle">RAM (physical)</text>
  <rect class="bx" x="540" y="36" width="160" height="34"/><text class="t" x="620" y="58" text-anchor="middle">OS</text><text class="s" x="720" y="58">0</text>
  <rect class="ok" x="540" y="70" width="160" height="34"/><text class="t" x="620" y="92" text-anchor="middle">Page 2</text><text class="s" x="720" y="92">1</text>
  <rect class="bx" x="540" y="104" width="160" height="34"/><text class="s" x="620" y="126" text-anchor="middle">other program</text><text class="s" x="720" y="126">2</text>
  <rect class="ok" x="540" y="138" width="160" height="34"/><text class="t" x="620" y="160" text-anchor="middle">Page 0</text><text class="s" x="720" y="160">3</text>
  <rect class="wr" x="540" y="172" width="160" height="34"/><text class="t" x="620" y="194" text-anchor="middle">free</text><text class="s" x="720" y="194">4</text>
  <rect class="ok" x="540" y="206" width="160" height="34"/><text class="t" x="620" y="228" text-anchor="middle">Page 1</text><text class="s" x="720" y="228">5</text>
  <rect class="ok" x="540" y="240" width="160" height="34"/><text class="t" x="620" y="262" text-anchor="middle">Page 3</text><text class="s" x="720" y="262">6</text>
  <rect class="bx" x="540" y="274" width="160" height="34"/><text class="s" x="620" y="296" text-anchor="middle">other program</text><text class="s" x="720" y="296">7</text>
  <text class="s" x="712" y="24">frame</text>
  <line class="ln" x1="385" y1="85" x2="538" y2="155" marker-end="url(#memC1)"/>
  <line class="ln" x1="385" y1="115" x2="538" y2="223" marker-end="url(#memC1)"/>
  <line class="ln" x1="385" y1="145" x2="538" y2="87" marker-end="url(#memC1)"/>
  <line class="ln" x1="385" y1="175" x2="538" y2="257" marker-end="url(#memC1)"/>
  <text class="s" x="245" y="236">Pages need not be next to each other</text><text class="s" x="245" y="254">or in order in RAM.</text>
</svg>
:::

## Translating an address with paging

Every logical address is split into two parts: the **page number** (which page) and the **offset** (how far into the page). Because pages and frames are the same size, the offset is the same in both — only the page number has to be changed into a frame number. If the page size is a power of two, the split is very fast in hardware: with 4 KiB = 2¹² byte pages, the lowest **12 bits** of the address are the offset and the remaining bits are the page number.

:::steps How to translate a logical address with paging
- **Page number** = logical address **div** page size (whole-number division).
- **Offset** = logical address **mod** page size (the remainder).
- Look up the page number in the **page table** to find the **frame number**.
- **Physical address = frame number × page size + offset.**
- If the page table says the page is **not in RAM**, a **page fault** occurs and the OS must load the page first (see virtual memory).
:::

:::example Worked example — translating addresses (page size 4 KiB = 4 096 bytes)
The page table of a program is: page 0 → frame 3, page 1 → frame 5, page 2 → frame 1, page 3 → frame 6.
1. Logical address **8 200**: page = 8 200 div 4 096 = **2**; offset = 8 200 − 2 × 4 096 = **8**. Page 2 is in frame **1**. Physical address = 1 × 4 096 + 8 = **4 104**.
2. Logical address **5 000**: page = **1**, offset = 5 000 − 4 096 = **904**. Page 1 → frame 5. Physical = 5 × 4 096 + 904 = **21 384**.
3. Logical address **100**: page **0**, offset **100**. Page 0 → frame 3. Physical = 12 288 + 100 = **12 388**.
4. Logical address **17 000**: page = 17 000 div 4 096 = **4**. The program has only pages 0–3, so this address is **invalid** — the MMU raises an error and the OS stops the program. This is how paging also provides **memory protection**.
:::

:::example Worked example — how many pages, and how much is wasted?
A program needs **18 KiB** and the page size is **4 KiB**. 18 ÷ 4 = 4.5, so it needs **5 pages** (always round **up** — you cannot have half a page). Five pages provide 20 KiB, so the last page has 20 − 18 = **2 KiB unused**. This waste **inside** the last page is **internal fragmentation**. On average a program wastes half a page, so smaller pages waste less memory but need bigger page tables.
:::

## Advantages and disadvantages of paging

Paging removes external fragmentation completely: every free frame is the right size for any page, so if there are enough free frames, the program fits, no matter where they are. It makes loading and removing programs simple, gives each program its own protected address space, and — most importantly — makes **virtual memory** possible, because a single page can be moved between RAM and disk without moving the rest of the program. Its costs are **internal fragmentation**, the memory used by **page tables** (one per process), and the extra time for a table look-up on every memory access. To avoid doubling every access time, the MMU keeps recently used translations in a small fast cache called the **translation lookaside buffer (TLB)**. Finally, pages are cut by **size, not by meaning**: one function may be split across two pages, and one page may contain both code and data, which makes **sharing** and **protecting** logical parts of a program harder.

:::compare Advantages and disadvantages of paging
| Advantages | Disadvantages |
|---|---|
| Pages need **not be contiguous** — any free frame can be used | **Internal fragmentation** — the last page is usually partly empty |
| **No external fragmentation** | Every process needs a **page table**, which uses memory |
| Easy allocation: just find free frames | Each access needs a table look-up (sped up by the **TLB**) |
| Each process has its own protected address space | Pages ignore the **logical structure** — a function or array may be split |
| Makes **virtual memory** easy — single pages can be swapped | Sharing or protecting whole modules is less natural |
:::

# Segmented memory
@lo 12.3.4.2@paper

## Segmentation: blocks that follow the program's structure

Paging cuts a program into equal pieces without looking at what is inside. **Segmentation** takes the opposite view: a program is made of **logical parts** — the main code, each library or module, global data, the stack — and these parts have **different sizes**. Segmentation gives each part its own **segment** of exactly the size it needs. The programmer (or the compiler) can see the segments, and an address is written as a pair **(segment number, offset)**: "byte 250 of the data segment".

:::definition Segmentation
A method of memory organisation in which a program is divided into **variable-size logical blocks called segments** (e.g. code, data, stack, individual modules). Each address is **segment number + offset**, and a **segment table** stores each segment's **base address** and **limit**.
:::

:::definition Segment table: base and limit
For each segment, the **base** is the **physical address where the segment starts** in RAM and the **limit** is its **length**. A logical address (s, d) is valid only if **d < limit**; then the physical address = **base + d**.
:::

## Translating an address with segmentation

:::steps How to translate a logical address with segmentation
- Split the logical address into **segment number s** and **offset d**.
- Look up segment s in the **segment table** to find its **base** and **limit**.
- Check **d < limit**. If not, the address is outside the segment → **error (segmentation fault)**; the program is stopped.
- If the check passes, **physical address = base + d**.
:::

:::svg Segmentation: each logical segment has its own size; the segment table gives its base and limit
<svg class="mem" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A program is divided into three segments of different sizes: code 400 bytes, data 1200 bytes, stack 500 bytes. The segment table lists segment 0 code base 1000 limit 400, segment 1 data base 3000 limit 1200, segment 2 stack base 6000 limit 500. In physical memory the code occupies 1000 to 1399, the data 3000 to 4199 and the stack 6000 to 6499, with gaps of free memory between them showing external fragmentation">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .wn{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5;stroke-dasharray:4 3}
    svg.mem .ln{stroke:var(--primary);stroke-width:1.8;fill:none}
  </style>
  <defs><marker id="memD1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="h" x="85" y="24" text-anchor="middle">Segments</text>
  <rect class="pb" x="30" y="40" width="110" height="40"/><text class="t" x="85" y="58" text-anchor="middle">0: Code</text><text class="s" x="85" y="74" text-anchor="middle">400 bytes</text>
  <rect class="pb" x="30" y="95" width="110" height="90"/><text class="t" x="85" y="136" text-anchor="middle">1: Data</text><text class="s" x="85" y="154" text-anchor="middle">1 200 bytes</text>
  <rect class="pb" x="30" y="200" width="110" height="50"/><text class="t" x="85" y="222" text-anchor="middle">2: Stack</text><text class="s" x="85" y="240" text-anchor="middle">500 bytes</text>
  <text class="h" x="320" y="24" text-anchor="middle">Segment table</text>
  <rect class="bx" x="200" y="40" width="240" height="30"/><text class="h" x="235" y="60" text-anchor="middle">Seg</text><text class="h" x="315" y="60" text-anchor="middle">Base</text><text class="h" x="400" y="60" text-anchor="middle">Limit</text>
  <rect class="bx" x="200" y="70" width="240" height="30"/><text class="m" x="235" y="90" text-anchor="middle">0</text><text class="m" x="315" y="90" text-anchor="middle">1000</text><text class="m" x="400" y="90" text-anchor="middle">400</text>
  <rect class="bx" x="200" y="100" width="240" height="30"/><text class="m" x="235" y="120" text-anchor="middle">1</text><text class="m" x="315" y="120" text-anchor="middle">3000</text><text class="m" x="400" y="120" text-anchor="middle">1200</text>
  <rect class="bx" x="200" y="130" width="240" height="30"/><text class="m" x="235" y="150" text-anchor="middle">2</text><text class="m" x="315" y="150" text-anchor="middle">6000</text><text class="m" x="400" y="150" text-anchor="middle">500</text>
  <rect class="ok" x="200" y="190" width="240" height="70" rx="6"/><text class="t" x="320" y="212" text-anchor="middle">(1, 250): 250 &lt; 1200 ✓</text><text class="t" x="320" y="232" text-anchor="middle">physical = 3000 + 250 = 3250</text><text class="s" x="320" y="250" text-anchor="middle">(2, 600): 600 ≥ 500 → error</text>
  <text class="h" x="620" y="24" text-anchor="middle">RAM (physical)</text>
  <rect class="bx" x="540" y="36" width="160" height="30"/><text class="s" x="620" y="56" text-anchor="middle">OS</text>
  <rect class="ok" x="540" y="66" width="160" height="30"/><text class="t" x="620" y="86" text-anchor="middle">Code</text><text class="s" x="706" y="76">1000</text>
  <rect class="wn" x="540" y="96" width="160" height="34"/><text class="s" x="620" y="118" text-anchor="middle">free hole</text>
  <rect class="ok" x="540" y="130" width="160" height="70"/><text class="t" x="620" y="170" text-anchor="middle">Data</text><text class="s" x="706" y="140">3000</text>
  <rect class="bx" x="540" y="200" width="160" height="34"/><text class="s" x="620" y="222" text-anchor="middle">other program</text>
  <rect class="wn" x="540" y="234" width="160" height="26"/><text class="s" x="620" y="252" text-anchor="middle">free hole</text>
  <rect class="ok" x="540" y="260" width="160" height="40"/><text class="t" x="620" y="285" text-anchor="middle">Stack</text><text class="s" x="706" y="270">6000</text>
  <line class="ln" x1="440" y1="85" x2="538" y2="80" marker-end="url(#memD1)"/>
  <line class="ln" x1="440" y1="115" x2="538" y2="150" marker-end="url(#memD1)"/>
  <line class="ln" x1="440" y1="145" x2="538" y2="278" marker-end="url(#memD1)"/>
  <text class="s" x="740" y="320" text-anchor="end">Holes between segments = external fragmentation</text>
</svg>
:::

:::example Worked example — translating addresses with the segment table above
| Logical address | Check | Physical address |
|---|---|---|
| (1, 250) | 250 < 1 200 ✓ | 3 000 + 250 = **3 250** |
| (0, 399) | 399 < 400 ✓ (the last byte of the code) | 1 000 + 399 = **1 399** |
| (2, 0) | 0 < 500 ✓ | **6 000** (the first byte of the stack) |
| (0, 400) | 400 is **not** < 400 ✗ | **error** — one byte past the end of the code |
| (2, 600) | 600 ≥ 500 ✗ | **segmentation fault** — the program tried to go outside its stack |

The limit check is what gives segmentation its strong **protection**: a program cannot read or overwrite memory outside its own segments.
:::

## Strengths and weaknesses of segmentation

Because segments match the **logical structure** of the program, the operating system can treat each part differently. The **code** segment can be marked **read-only and executable**, the **data** segment **read/write but not executable**, so an attempt to overwrite instructions or to run data as code is stopped. Whole segments can be **shared**: if thirty students run the same text editor on a school server, one copy of its code segment can be shared by all thirty processes, each with its own data segment. A segment can also **grow** (for example the stack) without affecting the others. There is **no internal fragmentation**, because each segment is exactly as large as it needs to be.

The weakness is the other kind of fragmentation. Segments of different sizes are loaded and removed over time, leaving **holes of different sizes** between them in RAM. A new 2 KiB segment may not fit into any of several 1 KiB holes, even though there is enough free memory in total — **external fragmentation**. The operating system then has to **compact** memory (move segments together), which takes time. Allocation is also harder, because the OS must search for a hole big enough for each segment. Many real systems therefore **combine** the two methods — **segmentation with paging**: a program is divided into logical segments, and each segment is then divided into pages, giving the protection of segments and the easy allocation of pages.

:::compare Paging vs segmentation
| | Paging | Segmentation |
|---|---|---|
| Block size | **Fixed** (e.g. 4 KiB) | **Variable** — each segment as large as needed |
| Division based on | **Physical** size | **Logical** structure of the program (code, data, stack, modules) |
| Visible to the programmer | No — done by the OS and hardware | Yes — addresses name the segment |
| Logical address | Page number + offset | Segment number + offset |
| Table | **Page table** (page → frame) | **Segment table** (base, limit) |
| Physical address | frame × page size + offset | base + offset (after checking offset < limit) |
| Fragmentation | **Internal** (part of the last page unused) | **External** (holes between segments) |
| Sharing and protection | Harder — pages split logical units | Easier — whole code or data segments can be shared or protected |
| Allocation | Simple — any free frame | Harder — must find a hole big enough |
:::

# Virtual memory
@lo 12.3.4.2@paper

## Using secondary storage as an extension of RAM

Main memory is limited, but users open more and more programs, and some programs are larger than the whole of RAM. **Virtual memory** solves this by using part of **secondary storage** (the hard disk or SSD) **as if it were extra main memory**. The idea relies on paging: a program does not need all its pages in RAM at the same time — only the pages it is using **right now** (the code it is executing and the data it is working on). The other pages can wait on the disk, in an area called the **swap file** or **page file**.

:::definition Virtual memory
A memory-management technique in which an area of **secondary storage** is used **as an extension of main memory**. Pages that are not currently needed are **moved out to disk (paged out)** and brought back into a free frame (**paged in**) when they are needed, so programs can use more memory than the physical RAM.
:::

:::definition Page fault
An interrupt that occurs when a program uses a page that is **not currently in RAM**. The operating system finds the page on disk, loads it into a free frame (removing another page if necessary) and updates the page table; the program then continues.
:::

:::steps What happens on a page fault
- The program uses an address; the MMU looks up its page and finds that the page is **not in RAM** → **page fault**.
- The OS finds a **free frame**. If none is free, it chooses a **victim page** — usually one that has not been used for the longest time (least recently used) — and writes it to disk if it was changed.
- The OS **reads the required page** from the disk into the frame.
- The **page table** is updated: the page is now valid and in that frame.
- The instruction that caused the fault is **restarted** and now succeeds.
:::

:::svg Virtual memory: only the pages in use are in RAM; the rest wait in the swap file on disk
<svg class="mem" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Main memory with six frames holds pages that are in use from three programs. A secondary storage swap file holds pages not in use. An arrow labelled page out moves an unused page from RAM to the disk; an arrow labelled page in brings a needed page from the disk into RAM after a page fault. Disk access is much slower than RAM">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .wn{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.mem .ln{stroke:var(--foreground);stroke-width:2.5;fill:none}
  </style>
  <defs><marker id="memE1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--foreground)"/></marker></defs>
  <rect class="bx" x="20" y="30" width="250" height="220" rx="10"/><text class="h" x="145" y="52" text-anchor="middle">RAM (fast, small)</text>
  <rect class="pb" x="40" y="66" width="100" height="40" rx="4"/><text class="t" x="90" y="91" text-anchor="middle">Browser p0</text>
  <rect class="pb" x="150" y="66" width="100" height="40" rx="4"/><text class="t" x="200" y="91" text-anchor="middle">Browser p3</text>
  <rect class="ok" x="40" y="116" width="100" height="40" rx="4"/><text class="t" x="90" y="141" text-anchor="middle">Editor p1</text>
  <rect class="ok" x="150" y="116" width="100" height="40" rx="4"/><text class="t" x="200" y="141" text-anchor="middle">Editor p2</text>
  <rect class="bx" x="40" y="166" width="100" height="40" rx="4"/><text class="t" x="90" y="191" text-anchor="middle">Music p0</text>
  <rect class="bx" x="150" y="166" width="100" height="40" rx="4"/><text class="t" x="200" y="191" text-anchor="middle">OS</text>
  <text class="s" x="145" y="234" text-anchor="middle">only the pages in use now</text>
  <rect class="bx" x="490" y="30" width="250" height="220" rx="10"/><text class="h" x="615" y="52" text-anchor="middle">Disk / SSD (slow, large)</text>
  <rect class="wn" x="510" y="66" width="210" height="150" rx="6"/><text class="t" x="615" y="88" text-anchor="middle">Swap file / page file</text>
  <text class="s" x="615" y="112" text-anchor="middle">Browser p1, p2, p4</text><text class="s" x="615" y="132" text-anchor="middle">Editor p0, p3</text><text class="s" x="615" y="152" text-anchor="middle">Music p1, p2</text><text class="s" x="615" y="172" text-anchor="middle">Game p0 … p9</text>
  <text class="s" x="615" y="234" text-anchor="middle">pages not in use</text>
  <path class="ln" d="M270,100 C340,80 420,80 488,100" marker-end="url(#memE1)"/><text class="h" x="380" y="76" text-anchor="middle">page out</text>
  <path class="ln" d="M488,180 C420,200 340,200 272,180" marker-end="url(#memE1)"/><text class="h" x="380" y="216" text-anchor="middle">page in</text><text class="s" x="380" y="234" text-anchor="middle">after a page fault</text>
  <text class="s" x="380" y="140" text-anchor="middle">disk ≈ thousands of times</text><text class="s" x="380" y="156" text-anchor="middle">slower than RAM</text>
</svg>
:::

## Benefits and the problem of disk thrashing

Virtual memory lets programs **larger than RAM** run, lets **more programs** be open at once, and frees programmers from worrying about how much RAM a particular computer has. Its weakness is **speed**: even a fast SSD is thousands of times slower than RAM. As long as most accesses go to pages already in RAM, the computer feels normal. But if RAM is far too small for the programs that are open, the OS keeps removing pages that are needed again a moment later. The computer then spends most of its time **moving pages in and out** instead of running programs: the disk light stays on, the mouse stutters and programs freeze. This is **disk thrashing**. The cure is to **add more RAM**, close programs, or run fewer programs at once.

:::example Worked example — a student laptop with 4 GB of RAM
Daniyar has 4 GB of RAM. Windows uses 1.5 GB, a browser with twenty tabs 2 GB, an IDE 1 GB and a video call 0.8 GB — 5.3 GB in total. Without virtual memory the last program could not start. With virtual memory, pages of the tabs he is not looking at are paged out to the SSD, so everything runs. When he switches to an old tab there is a short delay while its pages are paged in. When he also starts a game needing 3 GB, nearly every page the game needs pushes out a page another program will soon need — the laptop starts **thrashing** and becomes almost unusable. Closing the browser or upgrading to 16 GB of RAM fixes the problem.
:::

:::compare Virtual memory: benefits and drawbacks
| Benefits | Drawbacks |
|---|---|
| Programs **larger than physical RAM** can run | Disk is much **slower** than RAM — paging in causes delays |
| **More programs** can be open at the same time | **Disk thrashing** if RAM is far too small |
| Each program gets a large, private **logical address space** | Uses space on the disk for the swap file |
| RAM is used only for pages actually needed | Heavy swapping can wear out SSDs faster |
:::

# Virtual machines
@lo 12.3.4.3

## The concept of a virtual machine

Paging and virtual memory already give each program the **illusion** of having a large memory of its own. A **virtual machine** takes the same idea much further: it gives software the illusion of having a **whole computer** of its own — processor, memory, storage, network card and screen — when in fact it is running inside software on a real computer and sharing its hardware with other virtual machines.

:::definition Virtual machine (VM)
**Software that emulates (imitates) a complete computer system** — processor, memory, storage and devices — so that an operating system or program runs **as if on its own hardware**, while actually sharing the resources of a real **host** computer.
:::

:::cards
### Host
The **real, physical computer** with its hardware (and usually its own operating system) on which the virtual machines run.
### Guest
The **operating system or program running inside the VM**. It "thinks" it has the hardware to itself.
### Hypervisor (virtual machine monitor)
The software that **creates and runs VMs** and **shares the real hardware** between them: it gives each VM a slice of CPU time, a part of RAM (using paging) and a virtual disk, which is just a large file on the host. Examples: **VirtualBox**, **VMware**, **Hyper-V**, **KVM**.
:::

## System virtual machines

A **system virtual machine** emulates the **whole hardware** of a computer, so a **complete guest operating system** can be installed on it. Examples: running **Linux inside Windows** in VirtualBox to learn the command line; running an old Windows XP program that no longer works on Windows 11; or, in a data centre, running **dozens of virtual servers on one physical server**. This last use is the basis of **cloud computing**: when a company rents a "server" from a cloud provider, it is usually given a virtual machine. The hypervisor keeps the VMs **isolated**: a crash, a misconfiguration or malware inside one VM does not affect the host or the other VMs. A whole VM can be saved as a **snapshot** and restored later, copied to another server or backed up as a single file.

## Process virtual machines

A **process virtual machine** does not emulate a whole computer; it runs **one program** and provides it with a **platform-independent environment**. The best-known example is the **Java Virtual Machine (JVM)**. A Java program is compiled not into the machine code of a particular CPU but into an intermediate code called **bytecode**. Each platform — Windows on x86, macOS on ARM, Linux, Android — has its own JVM, which **translates the bytecode** into the machine code of that computer while the program runs. So the **same compiled program runs on any computer that has a JVM** ("write once, run anywhere"). Other process VMs are the **.NET Common Language Runtime (CLR)**, the **Python** virtual machine that runs Python bytecode, and the **Android Runtime**.

:::svg System VM: a hypervisor runs complete guest operating systems. Process VM: the JVM runs the same bytecode on different platforms
<svg class="mem" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a stack of layers, from the bottom: host hardware, host operating system, hypervisor, and on top two virtual machines, one running a Linux guest with its apps and one running a Windows guest with its apps. Right: one Java program compiled to bytecode is run by a JVM on Windows, a JVM on macOS and a JVM on Linux, each translating it for its own hardware">
  <style>
    svg.mem .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mem .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mem .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.mem .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mem .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mem .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="memF1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="190" y="22" text-anchor="middle">System virtual machine</text>
  <rect class="ok" x="30" y="36" width="155" height="96" rx="6"/><text class="t" x="107" y="58" text-anchor="middle">VM 1</text><rect class="bx" x="42" y="68" width="131" height="26" rx="4"/><text class="s" x="107" y="86" text-anchor="middle">apps</text><rect class="bx" x="42" y="98" width="131" height="26" rx="4"/><text class="t" x="107" y="116" text-anchor="middle">Guest: Linux</text>
  <rect class="ok" x="195" y="36" width="155" height="96" rx="6"/><text class="t" x="272" y="58" text-anchor="middle">VM 2</text><rect class="bx" x="207" y="68" width="131" height="26" rx="4"/><text class="s" x="272" y="86" text-anchor="middle">apps</text><rect class="bx" x="207" y="98" width="131" height="26" rx="4"/><text class="t" x="272" y="116" text-anchor="middle">Guest: Windows</text>
  <rect class="pb" x="30" y="142" width="320" height="40" rx="6"/><text class="h" x="190" y="167" text-anchor="middle">Hypervisor (e.g. VirtualBox)</text>
  <rect class="bx" x="30" y="192" width="320" height="40" rx="6"/><text class="t" x="190" y="217" text-anchor="middle">Host operating system</text>
  <rect class="bx" x="30" y="242" width="320" height="40" rx="6"/><text class="t" x="190" y="267" text-anchor="middle">Host hardware: CPU, RAM, disk, network</text>
  <line x1="380" y1="20" x2="380" y2="290" style="stroke:var(--border);stroke-width:1.5;stroke-dasharray:4 4"/>
  <text class="h" x="570" y="22" text-anchor="middle">Process virtual machine</text>
  <rect class="pb" x="470" y="36" width="200" height="40" rx="6"/><text class="t" x="570" y="61" text-anchor="middle">Java source → compiler</text>
  <line class="ln" x1="570" y1="76" x2="570" y2="100" marker-end="url(#memF1)"/>
  <rect class="ok" x="470" y="100" width="200" height="40" rx="6"/><text class="h" x="570" y="125" text-anchor="middle">Bytecode (.class)</text>
  <line class="ln" x1="520" y1="140" x2="450" y2="180" marker-end="url(#memF1)"/><line class="ln" x1="570" y1="140" x2="570" y2="180" marker-end="url(#memF1)"/><line class="ln" x1="620" y1="140" x2="690" y2="180" marker-end="url(#memF1)"/>
  <rect class="bx" x="395" y="180" width="110" height="50" rx="6"/><text class="t" x="450" y="202" text-anchor="middle">JVM</text><text class="s" x="450" y="220" text-anchor="middle">Windows / x86</text>
  <rect class="bx" x="515" y="180" width="110" height="50" rx="6"/><text class="t" x="570" y="202" text-anchor="middle">JVM</text><text class="s" x="570" y="220" text-anchor="middle">macOS / ARM</text>
  <rect class="bx" x="635" y="180" width="110" height="50" rx="6"/><text class="t" x="690" y="202" text-anchor="middle">JVM</text><text class="s" x="690" y="220" text-anchor="middle">Linux</text>
  <text class="s" x="570" y="258" text-anchor="middle">same bytecode runs on every platform</text><text class="s" x="570" y="276" text-anchor="middle">"write once, run anywhere"</text>
</svg>
:::

:::compare System virtual machine vs process virtual machine
| | System VM | Process VM |
|---|---|---|
| What it emulates | A **complete computer** (hardware) | An environment for **one program** |
| What runs inside | A whole **guest operating system** and its apps | A single application (e.g. Java bytecode) |
| Lifetime | Runs until it is shut down, like a real PC | Starts when the program starts, ends when it ends |
| Main purpose | Several OSs on one machine, isolation, server consolidation | **Platform independence** — same program on any OS |
| Examples | VirtualBox, VMware, Hyper-V, KVM, cloud servers | **JVM**, .NET CLR, Python VM, Android Runtime |
:::

## Advantages and disadvantages of virtual machines

The benefits come from three properties. **Isolation**: a guest cannot see or damage the host or other guests, so VMs are used for **testing new software**, opening **suspicious files** (a "sandbox") and running exam or security labs — if something goes wrong, the VM is simply deleted or restored from a snapshot. **Flexibility**: one computer can run **several operating systems**, old software can run on new hardware, and a VM can be **copied, backed up or moved** to another machine as easily as a file. **Efficient use of hardware**: a physical server that is 10 % busy with one service can host ten VMs, saving money, electricity and space — the core idea of the cloud.

The drawbacks come from the extra layer. Every instruction that touches hardware must pass through the hypervisor, so a VM is **slower** than running directly on the hardware. Each guest OS needs its own **RAM, CPU time and disk space**, so the host must be powerful. Some hardware — powerful graphics cards, special USB devices — may be **hard to access** from a VM. Each guest OS may need its own **licence**. And because many VMs share one physical machine, **if the host fails, every VM on it fails**.

:::example Worked example — the school's computer science lab
The school's IT technician wants students to practise installing Linux and configuring a network, but must not risk damaging the lab PCs.
1. VirtualBox (a hypervisor) is installed on each Windows PC — the **host**.
2. Each student creates a VM with 2 CPU cores, 4 GB RAM and a 20 GB virtual disk and installs **Ubuntu** as the **guest** OS.
3. Students practise freely; one student accidentally deletes system files — only their VM breaks, and it is restored from a **snapshot** in a minute. The Windows host is unaffected (**isolation**).
4. In programming lessons the same students write Java programs on Windows; the compiled bytecode is copied to a classmate's Mac and runs unchanged on its JVM (**process VM**, platform independence).
5. Drawback seen: PCs with only 8 GB of RAM become slow when the VM is running, because the host and the guest share that memory.
:::

:::compare Advantages and disadvantages of virtual machines
| Advantages | Disadvantages |
|---|---|
| Run **several operating systems** on one computer; run old software on new hardware | **Slower** than running directly on the real hardware (extra hypervisor layer) |
| **Isolation** — a crash or malware in a VM does not harm the host or other VMs | Needs a lot of **RAM, CPU power and storage** on the host |
| **Safe testing** of new software and suspicious files; easy restore from **snapshots** | Access to some hardware (graphics, USB devices) may be limited |
| Easy **backup, copying and moving** — a VM is a set of files | A **licence** may be needed for each guest OS |
| Better use of **servers** — many VMs share one machine (cloud computing) | If the host fails, **all** VMs on it fail |
| Process VMs give **platform independence** (same bytecode everywhere) | Bytecode must be translated at run time — slower than native code |
:::

:::warning Common mistakes about memory organisation and virtual machines
- Saying paging uses **variable-size** blocks — **pages are fixed**; **segments are variable**.
- Mixing up the two kinds of fragmentation: paging → **internal**, segmentation → **external**.
- Forgetting the **limit check** in segmentation: an offset equal to or larger than the limit is an **error**, not a valid address.
- In page calculations, rounding the number of pages **down** — always round **up** (18 KiB with 4 KiB pages → 5 pages).
- Confusing **virtual memory** (disk used as an extension of RAM) with a **virtual machine** (software that imitates a whole computer).
- Writing that a VM "has no disadvantages because it is free" — always mention **performance** and **resources**.
:::

# Exam practice: memory organisation and virtual machines
@lo 12.3.4.2@paper 12.3.4.3

:::example Exam-style questions with model answers
**Q: Describe how a logical address is translated into a physical address using paging. [3]**
The logical address is split into a **page number and an offset** (1); the page number is looked up in the **page table** to find the **frame number** (1); physical address = frame number × page size + offset (1).

**Q: The page size is 4 096 bytes and page 1 of a program is stored in frame 7. Calculate the physical address for logical address 5 000. [2]**
Page 1, offset 5 000 − 4 096 = **904** (1); 7 × 4 096 + 904 = **29 576** (1).

**Q: Compare paging and segmentation. [4]**
Paging uses **fixed-size** pages and frames **whereas** segmentation uses **variable-size** segments (1). Pages are based on **physical size**, segments on the program's **logical structure** (1). Paging uses a **page table** (page → frame), segmentation a **segment table** with base and limit (1). Paging causes **internal** fragmentation, segmentation **external** fragmentation (1).

**Q: Explain what is meant by virtual memory and one problem it can cause. [3]**
Part of **secondary storage** is used as an **extension of RAM** (1); pages not in use are moved to disk and paged back in when needed (1); if RAM is too small, the computer spends most time swapping pages — **disk thrashing** — and slows down (1).

**Q: Explain the concept of a virtual machine. [2]**
Software that **emulates a complete computer** (processor, memory, devices) (1), so that a guest OS or program runs **isolated** on a host computer as if on its own hardware (1).

**Q: Explain why Java programs can run on different operating systems without being recompiled. [2]**
Java is compiled to **bytecode**, not machine code (1); a **JVM** (process virtual machine) on each platform translates/runs the bytecode for that computer (1).
:::

:::warning Common mistakes in exam answers
- In translation questions, writing only the answer — show **page/offset** (or the **limit check**) for the method marks.
- In "compare" questions, describing paging and then segmentation separately — make **each point a comparison**.
- In VM answers, forgetting the words **host**, **guest** and **isolation**.
:::

:::steps Check yourself
- What is the difference between a logical and a physical address? Which hardware translates them?
- Define page, frame and page table. How is a logical address translated with paging?
- How many 4 KiB pages does a 13 KiB program need, and how much memory is wasted?
- Translate (1, 600), (0, 120) and (2, 350) with a segment table of your own.
- Give three differences between paging and segmentation.
- Describe what happens on a page fault, and explain disk thrashing.
- Compare system and process virtual machines with one example of each.
- Give three advantages and three disadvantages of virtual machines.
:::
