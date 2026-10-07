---
summary: How memory is addressed, the stored-program (von Neumann) principle, addressing modes, segmented and paged memory organisation, and virtual machines.
---
# The principle of memory addressing
@lo 12.3.4.1

:::definition Memory address
A unique **number identifying each location (cell)** in main memory. The CPU reads or writes a location by putting its address on the **address bus**.
:::

- Each address usually holds **one byte** (byte-addressable memory).
- The number of addressable locations depends on the **width of the address bus**: *n* address lines → **2ⁿ** addresses. A 32-bit address bus can address 2³² bytes = 4 GiB.

## Addressing modes

The **operand** of an instruction can be interpreted in different ways:

:::compare
| Mode | Meaning | Example (accumulator ACC) |
|---|---|---|
| Immediate | The operand **is the value** itself | `LDM #5` → ACC = 5 |
| Direct | The operand is the **address** of the value | `LDD 20` → ACC = contents of address 20 |
| Indirect | The operand is an address that **holds the address** of the value | `LDI 20` → address 20 contains 35, ACC = contents of 35 |
| Indexed | Address = operand **+ contents of the index register (IX)** | `LDX 20`, IX = 3 → ACC = contents of address 23 |
| Relative | Address = operand + current address (PC) | Used for jumps |
:::

:::example Worked example
Memory: address 20 → **25**, address 23 → **30**, address 25 → **35**. IX = 3.
| Instruction | Mode | Value loaded |
|---|---|---|
| `LDM #20` | Immediate | 20 |
| `LDD 20` | Direct | 25 |
| `LDI 20` | Indirect | 35 (address 20 holds 25, address 25 holds 35) |
| `LDX 20` | Indexed | 30 (20 + 3 = 23) |
:::

# Storing programs and data
@lo 12.3.4.2

:::definition Stored-program concept (von Neumann architecture)
**Program instructions and data are stored together in the same main memory** and are fetched by the CPU one at a time, in sequence, through the same buses.
:::

- Instructions and data are both binary — the CPU tells them apart by **when** it fetches them (the PC points to the next instruction).
- Programs can be loaded, changed and replaced without changing the hardware.
- **Von Neumann bottleneck:** instructions and data share one bus, so only one can be transferred at a time.

:::compare Von Neumann vs Harvard architecture
| Von Neumann | Harvard |
|---|---|
| One memory for instructions and data | **Separate** memories and buses for instructions and data |
| Simpler, cheaper, flexible | Instruction and data fetched **at the same time** → faster |
| General-purpose computers | Embedded systems, DSPs, CPU caches |
:::

# Segmented and paged memory
@lo 12.3.4.2@paper

:::cards
### Paging
Memory is divided into **fixed-size blocks**: physical memory into **frames**, a program into **pages** of the same size. A **page table** maps each page to a frame. Pages need not be contiguous; no external fragmentation, but the last page may be partly empty (internal fragmentation).
### Segmentation
A program is divided into **variable-size logical segments** (code, data, stack, functions). An address = **segment number + offset**; a **segment table** stores the base address and length of each segment. Segments match the program's structure but cause external fragmentation.
:::

:::compare Paging vs segmentation
| | Paging | Segmentation |
|---|---|---|
| Block size | Fixed (e.g. 4 KiB) | Variable |
| Division based on | Physical size | Logical structure of the program |
| Visible to the programmer | No | Yes |
| Fragmentation | Internal | External |
| Table | Page table (page → frame) | Segment table (base, limit) |
:::

:::callout info Virtual memory
Paging makes **virtual memory** possible: pages not currently needed are kept on disk and swapped into RAM frames when required. Too much swapping is called **disk thrashing**.
:::

# Virtual machines
@lo 12.3.4.3

:::definition Virtual machine (VM)
**Software that emulates a complete computer**, so that an operating system or a program runs as if on its own hardware, while actually sharing the host computer.
:::

:::cards
### System virtual machine
Runs a whole guest OS on a **hypervisor** (VirtualBox, VMware, Hyper-V) — e.g. Linux inside Windows.
### Process virtual machine
Runs one program in a platform-independent environment — e.g. the **Java Virtual Machine** runs Java bytecode on any OS; Python's interpreter VM.
:::

:::compare Advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| Run several OSs on one computer; test software safely | Slower than running directly on hardware |
| Isolation — a crash or malware inside the VM does not affect the host | Needs a lot of RAM and storage |
| Easy backup, copying and moving of whole systems (snapshots) | Hardware access may be limited |
| Servers can be shared efficiently (cloud computing) | Licensing costs for guest OSs |
:::
