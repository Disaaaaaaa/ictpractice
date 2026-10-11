---
summary: How main memory is organised into addressed locations, how the address bus width sets the number of addresses, addressing modes (immediate, direct, indirect, indexed, relative), the stored-program (von Neumann) principle and Harvard architecture, memory organisation by pages and segments with address translation, virtual memory, and virtual machines.
---
# Memory locations and addresses
@lo 12.3.4.1

**Main memory (RAM)** is organised as a long list of **storage locations** (cells). Each location holds a fixed amount of data — usually **one byte** — and has its own **address**.

:::definition Memory address
A **unique number that identifies one location** in main memory. To read or write a location, the CPU places its address on the **address bus**; the data travels on the **data bus**; and the **control bus** carries the *read* or *write* signal.
:::

:::ascii Main memory as numbered locations (byte-addressable)
  Address (denary)   Address (binary)   Contents
  ----------------   ----------------   --------
        0              0000 0000        1001 0110
        1              0000 0001        0011 1100
        2              0000 0010        1111 0000
        3              0000 0011        0000 0101
       ...                ...              ...
      255              1111 1111        0100 0001
:::

:::cards
### Byte-addressable and word-addressable
- **Byte-addressable** memory: **every byte** has its own address (most modern computers).
- **Word-addressable** memory: each address holds one **word** (e.g. 16, 32 or 64 bits).
- A **word** is the number of bits the CPU processes as one unit.
### The registers used
- **MAR (Memory Address Register)** holds the **address** of the location to be read or written.
- **MDR (Memory Data Register)** holds the **data** read from or to be written to that location.
:::

:::definition Address bus width and the number of addresses
With an address bus of **n lines (bits)**, the CPU can form **2ⁿ different addresses**. **Maximum memory = 2ⁿ × size of each location.**
:::

:::compare Address bus width and addressable memory (1 byte per location)
| Address bus width | Number of addresses | Maximum memory |
|---|---|---|
| 8 bits | 2⁸ = 256 | 256 bytes |
| 16 bits | 2¹⁶ = 65 536 | **64 KiB** |
| 20 bits | 2²⁰ = 1 048 576 | **1 MiB** |
| 24 bits | 2²⁴ | **16 MiB** |
| 32 bits | 2³² | **4 GiB** |
| 64 bits | 2⁶⁴ | 16 EiB (in practice CPUs use about 48 bits) |
:::

:::example Worked examples
- A computer has a **24-bit** address bus and **2-byte** words in each location: 2²⁴ × 2 = 33 554 432 bytes = **32 MiB**.
- To address **256 MiB** (2²⁸ bytes) of byte-addressable memory you need **28** address lines.
- **Adding one** address line **doubles** the number of addresses.
:::

# Addressing modes
@lo 12.3.4.1

An instruction is made of an **opcode** (what to do) and an **operand**. The **addressing mode** tells the CPU **how to use the operand** to find the data.

:::compare Addressing modes
| Mode | How the operand is used | Example | Result |
|---|---|---|---|
| **Immediate** | The operand **is the value** itself | `LDM #30` | ACC ← 30 |
| **Direct** | The operand is the **address** of the value | `LDD 30` | ACC ← contents of address 30 |
| **Indirect** | The operand is an address that **holds the address** of the value | `LDI 30` | ACC ← contents of (contents of 30) |
| **Indexed** | Address = operand **+ index register (IX)** | `LDX 30` | ACC ← contents of (30 + IX) |
| **Relative** | Address = operand **+ address of the current instruction** (PC) | `JMR 5` | Jump 5 locations forward |
:::

:::example Worked example — loading the accumulator (ACC)
Memory: address **30** → 45, address **31** → 12, address **33** → 60, address **45** → 78. Index register **IX = 3**.
| Instruction | Mode | Working | ACC |
|---|---|---|---|
| `LDM #30` | Immediate | the value 30 | **30** |
| `LDD 30` | Direct | contents of 30 | **45** |
| `LDI 30` | Indirect | address 30 holds 45 → contents of 45 | **78** |
| `LDX 30` | Indexed | 30 + 3 = 33 → contents of 33 | **60** |
:::

:::cards
### Why different modes are useful
- **Immediate** — constants (e.g. a counter starting at 0); fastest, no memory access.
- **Direct** — simple variables at a fixed address.
- **Indirect** — **pointers**; reaching addresses larger than the operand field can hold.
- **Indexed** — stepping through an **array**: increase IX each loop.
- **Relative** — **relocatable code**: the program still works when loaded at a different address.
:::

# Storing programs and data
@lo 12.3.4.2

:::definition Stored-program concept (von Neumann architecture)
**Program instructions and data are both stored in the same main memory** in binary. The CPU **fetches instructions one at a time** from memory, decodes and executes them, using the **same buses** for instructions and data.
:::

:::cards
### Key ideas
- Instructions and data look the same (both binary); the CPU knows a word is an instruction because the **Program Counter (PC)** pointed to it in the **fetch** stage.
- Instructions are executed **in sequence** unless a jump changes the PC.
- A computer can run a **different program** just by loading it into memory — no rewiring.
### Von Neumann bottleneck
- Instructions and data share **one memory and one bus**, so they cannot be fetched **at the same time**.
- The CPU often waits for memory; **cache memory** and **pipelining** reduce the problem.
:::

:::mermaid Fetch–decode–execute using the stored program
flowchart TB
  A[PC holds address of next instruction] --> B[Address copied to MAR]
  B --> C[Instruction fetched into MDR, then CIR]
  C --> D[PC incremented]
  D --> E[Control unit decodes instruction]
  E --> F[Instruction executed - data fetched from memory if needed]
  F --> A
:::

:::compare Von Neumann vs Harvard architecture
| | Von Neumann | Harvard |
|---|---|---|
| Memory | **One** memory for instructions and data | **Separate** memories for instructions and data |
| Buses | Shared buses | **Separate** buses |
| Speed | Instruction and data **cannot** be fetched together | Instruction and data fetched **at the same time** → faster |
| Cost / flexibility | Simpler, cheaper; memory used flexibly | More complex; memory split is fixed |
| Used in | General-purpose PCs, laptops | Embedded systems, microcontrollers, digital signal processors, CPU caches (L1) |
:::

# Paged memory
@lo 12.3.4.2@paper

When several programs run at once, the operating system must decide **where in memory** each one goes. Two methods are **paging** and **segmentation**.

:::definition Paging
**Physical memory** is divided into **fixed-size blocks called frames**; each **program (logical memory)** is divided into blocks of the **same size called pages**. Any page can be placed in **any free frame**, and a **page table** records which frame holds each page.
:::

:::ascii Pages of a program mapped to frames in RAM
  Program (logical)       Page table          RAM (physical)
  +---------+            +------+-------+     +----------+  frame 0
  | Page 0  |  -------   | Page | Frame |     |  OS      |
  +---------+            +------+-------+     +----------+  frame 1
  | Page 1  |            |  0   |   3   |     |  Page 2  |
  +---------+            |  1   |   5   |     +----------+  frame 2
  | Page 2  |            |  2   |   1   |     |  other   |
  +---------+            +------+-------+     +----------+  frame 3
                                              |  Page 0  |
                                              +----------+  frame 4
                                              |  free    |
                                              +----------+  frame 5
                                              |  Page 1  |
                                              +----------+
:::

:::steps Translating a logical address with paging
- Logical address = **page number + offset** (position inside the page).
- Page number = address **div** page size; offset = address **mod** page size.
- Look up the page number in the **page table** to find the **frame**.
- Physical address = **frame × page size + offset**.
:::

:::example Worked example — page size 4 KiB (4096 bytes)
Logical address **8200**: page = 8200 div 4096 = **2**, offset = 8200 − 8192 = **8**. The page table maps page 2 → **frame 5**. Physical address = 5 × 4096 + 8 = **20 488**.

A program of **18 KiB** needs 18 ÷ 4 = 4.5 → **5 pages**; the last page uses only 2 KiB, so **2 KiB is wasted** (internal fragmentation).
:::

:::cards
### Advantages of paging
- Pages do **not** have to be **contiguous** (next to each other) — any free frame can be used.
- **No external fragmentation** — free memory is never split into unusable gaps.
- Makes **virtual memory** easy: pages can be moved between RAM and disk.
### Disadvantages of paging
- **Internal fragmentation** — the last page of a program is often partly empty.
- The **page table** uses memory, and each access needs a table look-up (sped up by a cache called the TLB).
- Pages do not match the **logical structure** of the program (a function may be split across two pages).
:::

# Segmented memory and virtual memory
@lo 12.3.4.2@paper

:::definition Segmentation
A program is divided into **variable-size logical blocks called segments** — for example the **code**, **data**, **stack** or individual **functions**. Each address is given as **segment number + offset**, and a **segment table** stores each segment's **base address** (where it starts in RAM) and **limit** (its length).
:::

:::example Worked example — segment table
| Segment | Contents | Base | Limit |
|---|---|---|---|
| 0 | Code | 1000 | 400 |
| 1 | Data | 3000 | 1200 |
| 2 | Stack | 6000 | 500 |

- Address **(1, 250)**: 250 < 1200 ✓ → physical = 3000 + 250 = **3250**.
- Address **(0, 399)**: 399 < 400 ✓ → **1399**.
- Address **(2, 600)**: 600 ≥ limit 500 → **error** (segmentation fault) — the program tried to go outside its segment. This also gives **memory protection**.
:::

:::compare Paging vs segmentation
| | Paging | Segmentation |
|---|---|---|
| Block size | **Fixed** (e.g. 4 KiB) | **Variable** |
| Division based on | **Physical** size | **Logical** structure of the program |
| Visible to the programmer | No | Yes |
| Address | Page number + offset | Segment number + offset |
| Table | Page table (page → frame) | Segment table (base, limit) |
| Fragmentation | **Internal** (part of last page wasted) | **External** (gaps between segments) |
| Sharing and protection | Harder — pages split logical units | Easier — whole code or data segments can be shared or protected |
:::

:::definition Virtual memory
A technique in which part of **secondary storage** (disk / SSD) is used **as if it were extra RAM**. Pages that are not currently needed are moved to disk (**paged out**) and brought back into a free frame (**paged in / swapped**) when the program needs them.
:::

:::cards
### Benefits of virtual memory
- Programs **larger than RAM** can run.
- **More programs** can be open at once.
### Drawbacks
- Disk is much **slower** than RAM, so swapping slows the computer.
- **Disk thrashing**: when RAM is too small, the computer spends more time swapping pages than doing useful work. Fix: add more RAM or close programs.
:::

# Virtual machines
@lo 12.3.4.3

:::definition Virtual machine (VM)
**Software that emulates a complete computer** — processor, memory, storage and devices — so that an operating system or program runs **as if on its own hardware**, while actually sharing the resources of the **host** computer.
:::

:::cards
### Host and guest
- **Host** — the real (physical) computer and its OS.
- **Guest** — the operating system or program running inside the VM.
- **Hypervisor** — the software that creates and runs VMs and shares the real hardware between them (VirtualBox, VMware, Hyper-V, KVM).
### System virtual machine
- Emulates a **whole computer**, so a complete guest OS can run — e.g. **Linux inside Windows**, or many servers on one physical machine in **cloud computing**.
### Process virtual machine
- Runs **one program** in a **platform-independent** environment.
- The **Java Virtual Machine (JVM)**: Java is compiled to **bytecode**, and the JVM on each OS translates it, so the same program runs on Windows, macOS and Linux ("write once, run anywhere").
- Also: the Python interpreter, the .NET CLR, Android Runtime.
:::

:::compare Advantages and disadvantages of virtual machines
| Advantages | Disadvantages |
|---|---|
| Run **several OSs** on one computer; run old software on new hardware | **Slower** than running directly on the real hardware |
| **Isolation** — a crash or malware inside a VM does not harm the host | Needs a lot of **RAM, CPU power and storage** |
| **Safe testing** of software and suspicious files | Access to some hardware (graphics, USB) may be limited |
| Easy **backup**, copying and moving (snapshots) | Licences may be needed for each guest OS |
| Better use of **servers** — many VMs share one machine (cloud) | If the host fails, **all** VMs on it fail |
:::

# Exam practice and summary
@lo 12.3.4.1 12.3.4.2 12.3.4.3

:::example Exam-style answers
**Q: Explain the principle of memory addressing. [2]**
Memory is divided into locations, each with a **unique address** (1); the CPU puts the address on the **address bus** (via the MAR) to read or write that location (1).

**Q: Calculate the maximum memory with a 20-bit address bus and 1 byte per location. [2]**
2²⁰ = 1 048 576 addresses (1) × 1 byte = **1 MiB** (1).

**Q: Explain the difference between direct and indirect addressing. [2]**
In **direct** addressing the operand **is the address** of the data (1); in **indirect** addressing the operand is the address of a location that **contains the address** of the data (1).

**Q: Compare paging and segmentation. [4]**
Paging divides memory into **fixed-size** pages/frames, **whereas** segmentation uses **variable-size** segments (1). Pages are based on **physical size**, segments on the program's **logical structure** (1). Paging uses a **page table**, segmentation a **segment table** with base and limit (1). Paging causes **internal** fragmentation, segmentation **external** fragmentation (1).

**Q: Explain the concept of a virtual machine. [2]**
Software that **emulates a complete computer** (1), allowing a guest OS / program to run **isolated** on a host computer as if on its own hardware (1).
:::

:::warning Common mistakes
- Saying paging uses **variable** sizes — pages are **fixed**; segments are variable.
- Confusing **virtual memory** (disk used as RAM) with a **virtual machine** (software computer).
- Mixing up **immediate** (the value) and **direct** (the address of the value).
- Forgetting that **n** address lines give **2ⁿ** addresses, not 2 × n.
:::

:::steps Check yourself
- What is a memory address? Which bus and register carry it?
- How much memory can a 16-bit address bus address?
- Give the value loaded by LDM, LDD, LDI and LDX in the worked example.
- State the stored-program concept and the von Neumann bottleneck.
- Translate logical address 5000 with 4 KiB pages if page 1 is in frame 7.
- Give two differences between paging and segmentation.
- Give two advantages and two disadvantages of virtual machines.
:::
