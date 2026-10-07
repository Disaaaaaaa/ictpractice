---
summary: How the CPU works with peripherals, the functions of the CPU, system bus and RAM, the differences between RAM and ROM, and the purposes of virtual memory and cache memory.
---
# CPU and peripherals
@lo 11.3.2.1@paper

:::definition Peripheral
A device **outside the CPU and main memory**: input (keyboard, mouse, scanner, microphone, sensors), output (monitor, printer, speakers) and storage (HDD, SSD, USB drive).
:::

:::cards
### Device drivers
Software that translates OS commands into signals the particular device understands.
### I/O controllers / ports
Hardware interfaces (USB, HDMI, network card) that connect peripherals to the system bus.
### Interrupts
A peripheral sends an **interrupt signal** when it needs attention (key pressed, printer out of paper). The CPU finishes its current instruction, saves its state, runs the **interrupt service routine**, then continues.
### Buffers
Areas of memory that hold data temporarily so that a fast CPU and a slow device can work at their own speeds (e.g. printer buffer, keyboard buffer).
:::

:::steps Printing a document
- The CPU sends the document data to the **printer buffer** in RAM and continues with other tasks.
- The printer takes data from the buffer at its own speed.
- When the buffer is empty, the printer sends an **interrupt** asking for more data.
- The CPU suspends its current task, refills the buffer, and returns to the task.
:::

# Functions of the CPU, system bus and RAM
@lo 11.3.2.2@paper

:::compare
| Component | Function |
|---|---|
| **CPU** | Fetches, decodes and executes instructions; processes data |
| — Control unit (CU) | Controls the fetch–decode–execute cycle; sends control signals to other components |
| — ALU | Arithmetic (+, −) and logic (AND, OR, comparisons) operations |
| — Registers | Very fast storage inside the CPU (PC, MAR, MDR, CIR, ACC) |
| **System bus** | Carries addresses (address bus), data (data bus) and control signals (control bus) between CPU, memory and I/O |
| **RAM** | Main memory holding the **programs and data currently in use** |
:::

# RAM and ROM
@lo 11.3.4.1@paper

:::compare
| | RAM (Random Access Memory) | ROM (Read-Only Memory) |
|---|---|---|
| Volatile? | **Volatile** — contents lost when power is off | **Non-volatile** — contents kept without power |
| Read / write | Read and write | Read only (or rarely updated, e.g. flash firmware) |
| Contents | OS, running programs and their data | **Boot program (BIOS/UEFI)**, firmware |
| Capacity | Large (8–64 GB) | Small (MB) |
| Changes | Constantly while the computer runs | Set by the manufacturer |
:::

:::tip
ROM is needed because when the computer is switched on, RAM is **empty** — the **bootstrap** program in ROM loads the OS from storage into RAM.
:::

# Virtual memory
@lo 11.3.4.2@paper

:::definition Virtual memory
Part of **secondary storage (disk)** used as if it were **extra RAM** when RAM is full.
:::

- The OS moves **pages** of programs/data not currently needed from RAM to the disk (**swap file / page file**) and brings them back when required.
- Allows **more or larger programs** to run than RAM alone would allow.
- Disk is much **slower** than RAM, so heavy use makes the computer slow; constant swapping is **disk thrashing**.
- Solution to thrashing: **add more RAM**.

# Cache memory
@lo 11.3.4.3@paper

:::definition Cache memory
Very **fast, small memory** inside or next to the CPU that stores **copies of frequently used instructions and data**, so the CPU does not have to wait for slower RAM.
:::

:::compare Memory hierarchy (fast and small → slow and large)
| Level | Speed | Size |
|---|---|---|
| Registers | Fastest | Bytes |
| Cache L1 / L2 / L3 | Very fast | KB – tens of MB |
| RAM | Fast | GB |
| Virtual memory / SSD / HDD | Slow | Hundreds of GB – TB |
:::

- When the CPU needs data it checks the cache first: a **cache hit** is fast; a **cache miss** means fetching from RAM.
- A larger cache → more hits → better performance, but cache is expensive.
