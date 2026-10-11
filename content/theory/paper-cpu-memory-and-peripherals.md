---
summary: The von Neumann architecture and the stored program concept; the parts of a computer system and how they are connected; types of peripherals, ports, device drivers and I/O controllers; how the CPU communicates with peripherals using polling, interrupts, buffers, spooling and DMA; the functions of the CPU (control unit, ALU, registers, clock), the system bus and RAM; RAM and ROM (DRAM, SRAM, PROM, EPROM, EEPROM, flash, the boot process, embedded systems); virtual memory and paging; cache memory (levels, hits and misses, locality); the memory hierarchy and secondary storage.
---
# The computer system
@lo 11.3.2.1@paper 11.3.2.2@paper

:::definition Von Neumann architecture
A **stored-program** computer model: program **instructions and data are held together in main memory**. The CPU **fetches** instructions from memory, **decodes** and **executes** them one at a time, and communicates with memory and input/output devices through **buses**. It was described by **John von Neumann** in 1945 and is used by almost all general-purpose computers.
:::

:::callout info Core rule
A program must be **loaded into main memory** before the CPU can execute its instructions.
:::

:::image Von Neumann architecture: memory, control unit, ALU with accumulator, input and output
https://icnwfwszbwyewktnnupl.supabase.co/storage/v1/object/public/media/theory/paper-cpu-memory-and-peripherals/von-neumann-architecture.png
alt: Block diagram: Memory at the top connected by two-way arrows to the Control Unit and the Arithmetic Logic Unit; the Control Unit and ALU exchange signals; the ALU contains the Accumulator, which receives data from Input and sends results to Output.
:::

A computer system **takes in data (input)**, **processes** it, **stores** it and **produces results (output)**. In the **von Neumann architecture**, used by almost all computers, these jobs are done by four groups of components connected by the **system bus**.

:::ascii The main components of a computer system
              ┌────────────────────────────────────┐
              │                CPU                 │
              │  Control unit │  ALU  │  Registers │
              └─────────────────┬──────────────────┘
  ══════════════════════════════╪═════════════════════════════  system bus
        │                       │                        │      (address, data, control)
  ┌─────┴───────┐      ┌────────┴────────┐      ┌────────┴───────┐
  │ Main memory │      │ I/O controllers │ ──── │  Peripherals:  │
  │ (RAM + ROM) │      │  (USB, video,   │      │ input, output, │
  └─────────────┘      │  disk, network) │      │ storage        │
                       └─────────────────┘      └────────────────┘
:::

:::compare Components and their jobs
| Component | Job |
|---|---|
| **CPU** (processor) | **Fetches, decodes and executes** program instructions; processes data; controls the other components |
| **Main memory** (RAM and ROM) | Holds the **programs and data the CPU is using now** (RAM) and the start-up instructions (ROM) |
| **System bus** | Carries **addresses**, **data** and **control signals** between the CPU, memory and I/O controllers |
| **I/O controllers** | Electronic interfaces that connect **peripherals** to the system bus |
| **Peripherals** | Devices **outside** the CPU and main memory: input, output and secondary storage |
:::

:::tip Exam wording
If you are asked to **name the four main components** of the von Neumann architecture, write: **CPU, main memory, input/output devices, system bus**.
:::

:::image CPU, main memory and I/O devices sharing one bus
https://icnwfwszbwyewktnnupl.supabase.co/storage/v1/object/public/media/theory/paper-cpu-memory-and-peripherals/cpu-memory-io-bus.png
alt: The CPU (control unit, ALU and registers), main memory and the I/O devices disk and printer are all connected to one shared bus.
:::

:::example Input, process, output
The simplest view of what a computer does: the input value **10** enters the system, the processor executes an instruction to **multiply it by 3**, and the result **30** becomes the output. One input may lead to **several processes and outputs** (the result could also be stored or printed).
:::

:::image Input 10 → Process: multiply by 3 → Output 30
https://icnwfwszbwyewktnnupl.supabase.co/storage/v1/object/public/media/theory/paper-cpu-memory-and-peripherals/input-process-output.png
alt: Three boxes connected by arrows: Input 10, Process multiply by 3, Output 30.
:::

# The stored program concept
@lo 11.3.2.2@paper

:::definition Stored program concept
A program must be **stored in main memory** in order to be executed. Its **instructions and the data** it uses are kept in the **same memory**, and the CPU **fetches, decodes and executes** the instructions **one at a time**, following the instruction sequence (unless a jump changes the order).
:::

:::steps From storage to results
- **Secondary storage** — the program is kept permanently on an SSD, hard disk, USB drive or optical disc.
- **Main memory** — the operating system **copies** the program's instructions and the data it needs into **RAM**.
- **Processor** — the CPU fetches, decodes and executes the instructions from RAM.
- **Output / storage** — the results are displayed, printed or saved back to secondary storage.
:::

:::image A program is loaded from secondary storage into main memory, then executed by the processor
https://icnwfwszbwyewktnnupl.supabase.co/storage/v1/object/public/media/theory/paper-cpu-memory-and-peripherals/storage-to-memory.png
alt: Hard disk, USB drive and DVD/Blu-ray in a secondary storage group, with an arrow to Main Memory, which exchanges data in both directions with the Processor.
:::

:::callout info Why the program must be copied into RAM
**RAM is volatile** — it loses its contents when the power is removed — so programs and files are kept long term on **secondary storage**. But secondary storage is far too **slow** for the CPU to fetch instructions from directly, so **loading** a program means copying the code and data it needs from secondary storage into **RAM**.
:::

:::example Running a program from storage
- A program is stored on an SSD, hard disk, USB drive or optical disc.
- The **operating system** loads the required instructions and data into **RAM**.
- The CPU **fetches** the first instruction from RAM.
- The **control unit** decodes the instruction.
- The CPU **executes** it.
- The cycle **repeats** until the program finishes or branches elsewhere.
:::

# Peripherals
@lo 11.3.2.1@paper

:::definition Peripheral
A hardware device **outside the CPU and main memory** that is connected to the computer to **input**, **output** or **store** data. Peripherals are much **slower** than the CPU.
:::

:::compare Types of peripheral
| Type | Purpose | Examples |
|---|---|---|
| **Input devices** | Enter data and commands into the computer | Keyboard, mouse, touch screen, microphone, scanner, webcam, barcode reader, sensors (temperature, light, motion) |
| **Output devices** | Present results to the user or control other devices | Monitor, printer, speakers, headphones, projector, actuators (motors, valves), LEDs |
| **Storage devices** | Keep data **permanently** (non-volatile) | Hard disk drive (HDD), solid-state drive (SSD), USB flash drive, memory card, optical disc |
| **Communication devices** | Connect the computer to other devices and networks | Network interface card, Wi-Fi adapter, modem, Bluetooth adapter |
| **Input and output** | Both directions | Touch screen, headset with microphone, multifunction printer/scanner |
:::

:::compare Ports and connections
| Port / connection | Typical use | Notes |
|---|---|---|
| **USB** (USB-A, USB-C) | Keyboard, mouse, flash drive, printer, phone | Universal; also supplies **power**; USB-C carries data, video and charging |
| **HDMI / DisplayPort** | Monitor, TV, projector | Digital video and audio |
| **Ethernet (RJ-45)** | Wired network | Fast, stable connection |
| **Audio jack (3.5 mm)** | Headphones, microphone | Analogue sound |
| **Bluetooth** | Wireless keyboard, mouse, headphones | Short-range radio |
| **Wi-Fi** | Network, wireless printers | Radio, medium range |
| **SATA / M.2 (NVMe)** | Internal HDD / SSD | Inside the case |
:::

:::definition I/O port
A **physical connection point** (or logical interface) where a peripheral's cable or wireless interface connects to the computer — for example a USB, HDMI or Ethernet port. The **I/O controller** behind the port manages the flow of information between the device and the processor.
:::

:::cards
### Device drivers
- A **device driver** is **software** that lets the **operating system** communicate with one particular hardware device.
- It **translates** general OS commands ("print this page") into the exact signals the device understands, and passes the device's messages (errors, status) back.
- New hardware usually needs its driver installed; **plug and play** devices are recognised and set up automatically.
### I/O controllers
- An **I/O controller** (interface) is **hardware** — a circuit board or chip — between the system bus and a device.
- It converts data to the **form and speed** the device needs, has its own small **buffer** and signals the CPU when the device needs attention.
- Examples: USB controller, graphics card (video controller), disk controller, network card.
:::

:::compare Typical data flow
| Direction | What happens |
|---|---|
| **Input** | The **keyboard controller** detects a key press, **encodes** it as a key code and makes it available; it raises an **interrupt**; the CPU reads the data through the I/O interface and the **bus system** |
| **Output** | The CPU sends the data and **control information** to the **printer controller**; the controller manages the **timing** of the printer and sends it suitable signals; the printed page is the output |
:::

:::callout info Why controllers are needed
Peripherals work at **different speeds** and use **different protocols** from the CPU. Controllers **bridge** this difference: they convert the data, **buffer** it and use **interrupts** so the CPU does not have to check the device continuously.
:::

# How the CPU communicates with peripherals
@lo 11.3.2.1@paper

The CPU is **millions of times faster** than a printer or a person typing. If it waited for each device it would waste almost all its time. Several techniques let the CPU and the peripherals work **at their own speeds**.

:::compare Polling vs interrupts
| | Polling | Interrupts |
|---|---|---|
| How it works | The CPU **checks each device in turn**, again and again, to see if it needs attention | The **device sends a signal** to the CPU only when it needs attention |
| CPU time | **Wasted** checking devices that do not need anything | Used for other work until a device interrupts |
| Response | Delayed until the device's turn comes | Fast, according to priority |
| Use | Simple embedded systems | All modern computers |
:::

:::definition Interrupt
A **signal** sent to the CPU from **hardware** (key pressed, mouse moved, printer out of paper, data arrived from the network), from **software** (an error such as division by zero, a request to the OS) or from a **timer**, telling the CPU that something **needs attention**.
:::

:::steps How the CPU handles an interrupt
- The device sends an interrupt signal along the **control bus**; it is stored in the **interrupt register**.
- At the **end of each fetch–decode–execute cycle** the CPU checks for interrupts.
- If the interrupt has a **higher priority** than the current task, the CPU **saves the contents of its registers** (PC, ACC …) on the **stack**.
- The CPU runs the **interrupt service routine (ISR)** — the code that deals with this interrupt (e.g. reads the key code).
- The saved register values are **restored** and the CPU **continues** the interrupted program exactly where it stopped.
- A lower-priority interrupt waits until the current task or a more urgent interrupt is finished.
:::

:::compare Examples of interrupt priority
| Interrupt | Priority |
|---|---|
| Power failure, hardware fault | Highest |
| Timer (for multitasking) | High |
| Disk or network data ready | Medium |
| Key pressed, mouse moved | Medium |
| Printer out of paper | Low |
:::

:::definition Buffer
An area of **memory** that holds data **temporarily** while it is being moved between two devices that work at **different speeds** — for example between the CPU / RAM and a printer, or between the network and a video player.
:::

:::steps Printing a document with a buffer and interrupts
- The CPU sends the first part of the document to the **printer buffer** in RAM and **returns to other tasks**.
- The printer takes data from the buffer and prints it at its own (slow) speed.
- When the buffer is **empty**, the printer sends an **interrupt** asking for more data.
- The CPU suspends its current task, **refills the buffer**, and returns to the task.
- This repeats until the document is printed; the user can keep working the whole time.
:::

:::cards
### Keyboard buffer
- Each key pressed causes an **interrupt**; the key code is placed in the **keyboard buffer** (a **queue**).
- The program reads the keys **in the order typed**, even if the user types faster than it processes them.
### Video streaming buffer
- Data from the Internet is stored in a buffer a few seconds ahead of what is being played, so short network delays do not stop the video.
### Spooling
- Print jobs from several users are stored on **disk** in a **print queue (spool)** and sent to the printer one by one, so users do not have to wait for the printer.
### Direct Memory Access (DMA)
- A **DMA controller** moves large blocks of data between a device (disk, network card) and **RAM** **without the CPU**, and interrupts the CPU only when the whole block has been transferred.
:::

# Functions of the CPU
@lo 11.3.2.2@paper

:::definition Central Processing Unit (CPU)
The part of the computer that **fetches, decodes and executes** the instructions of programs and **processes data**. It contains the **control unit**, the **arithmetic logic unit**, **registers**, **cache** and a **clock**.
:::

:::compare Parts of the CPU
| Part | Function |
|---|---|
| **Control unit (CU)** | **Manages the execution of instructions**: controls the fetch–decode–execute cycle, **decodes** instructions and sends **control signals** that tell memory, the ALU and the I/O devices what to do |
| **Arithmetic logic unit (ALU)** | **Processes data**: **arithmetic** operations (+, −, ×, ÷) and **logic** operations (AND, OR, NOT, comparisons such as >, =), shifts |
| **Registers** | Very small, extremely fast storage **inside the CPU** for the data and addresses being used **now** |
| **Clock** | Sends regular pulses that **synchronise** all operations; its speed (GHz) is the number of cycles per second |
| **Cache** | Fast memory holding copies of frequently used data and instructions |
:::

:::callout warning Clock speed is not everything
Clock speed is measured in **hertz** — modern CPUs run at several **gigahertz** (billions of cycles per second). A higher clock speed **alone does not guarantee** a faster CPU: performance also depends on the **architecture**, **cache** size, number of **cores**, how much work each instruction does, **memory latency** and the **workload**.
:::

:::image A physical processor package
https://icnwfwszbwyewktnnupl.supabase.co/storage/v1/object/public/media/theory/paper-cpu-memory-and-peripherals/cpu-chip.png
alt: Photograph of processor chips: the top and the underside of a CPU package.
:::

Inside a modern processor are **billions of transistor switches** that implement the logic of the control unit, the ALU and the registers.

:::compare Main registers
| Register | Holds |
|---|---|
| **PC** — Program Counter | The **address of the next instruction** |
| **MAR** — Memory Address Register | The **address** of the memory location to be read or written |
| **MDR** — Memory Data Register | The **data or instruction** read from, or to be written to, memory |
| **CIR** — Current Instruction Register | The **instruction** being decoded and executed |
| **ACC** — Accumulator | **Intermediate results** of ALU calculations |
:::

:::tip MDR or MBR?
Some syllabuses call the MDR the **MBR (Memory Buffer Register)**. The function is the same: it holds the data or instruction being transferred to or from memory.
:::

:::steps The CPU's main cycle (fetch–decode–execute) — simple version
- **Fetch** — retrieve the **next instruction** from main memory and bring it into the CPU.
- **Decode** — the **control unit** interprets the instruction and determines what operation is required.
- **Execute** — the CPU carries out the instruction: a **calculation**, a **memory access**, a **logical decision** or an **I/O operation**.
- The CPU checks for **interrupts**, then repeats — billions of times per second.
:::

:::image The fetch cycle (control unit) and the execution cycle (ALU), with registers and main memory
https://icnwfwszbwyewktnnupl.supabase.co/storage/v1/object/public/media/theory/paper-cpu-memory-and-peripherals/fetch-execute-cycle.png
alt: Cycle diagram: in the fetch cycle the control unit 1 fetches the instruction and 2 decodes it; in the execution cycle the ALU 3 gets data and 4 executes the instruction; registers sit between them and main memory is below; arrows show the cycle repeating.
:::

:::steps Detailed fetch phase
- The **PC** contains the address of the next instruction.
- The address is copied from the **PC** to the **MAR**.
- The MAR places the address on the **address bus**.
- The **control unit** sends a **memory read** signal through the **control bus**.
- **RAM** locates the instruction stored at that address.
- The instruction travels back to the CPU through the **data bus** and enters the **MDR**.
- The instruction is copied to the **CIR** for decoding.
- The **PC** advances to the address of the next instruction.
:::

:::cards
### Decode phase
- The **control unit** interprets the instruction in the **CIR**.
- It identifies the **operation (opcode)** and any required **operands**, and the **addressing mode**.
- It prepares the **control signals** needed for execution.
### Execute phase
- The required action takes place: the **ALU** does arithmetic or a logic operation, data is **read into the accumulator**, a value is **written from the accumulator back to RAM**, or a **jump** changes the PC.
:::

:::tip Common exam sequence
**PC → MAR → address bus → RAM → data bus → MDR → CIR → decode → execute**
:::

# The system bus and RAM
@lo 11.3.2.2@paper

:::compare The three buses of the system bus
| Bus | Carries | Direction |
|---|---|---|
| **Address bus** | The **address** of the memory location or I/O port to use | One-way: from the CPU |
| **Data bus** | The **data or instructions** being transferred | Two-way |
| **Control bus** | **Control signals**: memory read, memory write, clock, interrupt request | Two-way |
:::

:::callout info Bus width
The **wider** the data bus, the more bits are moved at once (64-bit → 8 bytes per transfer). The **wider** the address bus, the more memory locations can be addressed (n lines → 2ⁿ locations).
:::

:::definition RAM (Random Access Memory) — main memory
The computer's **main working memory**. It holds the **operating system**, the **programs that are running** and the **data they are using**. "Random access" means any location can be read or written directly, in the same time, by its address.
:::

:::cards
### Functions of RAM
- Stores the **instructions** of running programs so the CPU can **fetch** them.
- Stores the **data** being processed (an open document, a game level).
- Holds **buffers** for devices and parts of the OS.
- Is **much faster** than secondary storage, so programs run quickly.
### How the amount of RAM affects performance
- **More RAM** → more programs and data fit in memory at once → **less virtual memory** is used → the computer is **faster**.
- **Too little RAM** → the OS swaps data to disk → the computer slows down, or shows "**Not enough memory**".
:::

# Advantages and limitations of the von Neumann architecture
@lo 11.3.2.2@paper

:::cards
### Advantages
- Instructions and data share **one memory system**, which **simplifies the design** and makes it cheaper.
- The control unit retrieves data and instructions through **one common mechanism** (the same buses).
- Memory is **general-purpose**: its capacity is not permanently split between program and data, so it is used **flexibly**.
- A new program can be run just by **loading it into memory** — no rewiring; suitable for **general-purpose computing**.
### Limitations
- **Von Neumann bottleneck** — instructions and data share the **same path** between the CPU and memory, so only one can be transferred at a time; this **limits throughput** and the CPU often waits for memory.
- The classical model processes **one instruction at a time, in sequence**.
- Because program instructions share memory with data, **faulty or malicious writes** to the memory holding a program can change it if there is no **memory protection**.
:::

:::callout info Reducing the bottleneck
The von Neumann bottleneck is the **throughput limitation** caused by instructions and data **sharing the memory pathway**. Modern processors reduce its practical impact with **cache memory**, **pipelining**, **branch prediction**, **multiple cores** and wider, faster buses. The **Harvard architecture** uses **separate** memories and buses for instructions and data, so both can be fetched at the same time.
:::

# RAM and ROM
@lo 11.3.4.1@paper

:::definition Volatile memory
Memory that **loses its contents when the power is turned off** (RAM). **Non-volatile** memory keeps its contents without power (ROM, flash, disks).
:::

:::compare RAM vs ROM
| | RAM (Random Access Memory) | ROM (Read-Only Memory) |
|---|---|---|
| **Volatile?** | **Volatile** — contents lost when power is off | **Non-volatile** — contents kept without power |
| **Read / write** | **Read and write** | **Read only** (or only rarely updated, e.g. firmware update in flash) |
| **Contents** | OS, **running programs** and their **data** | **Boot program (BIOS / UEFI)**, firmware, fixed programs of embedded devices |
| **Capacity** | Large (8–64 GB in a PC) | Small (KB – MB) |
| **Changes** | Constantly while the computer runs | Written by the manufacturer |
| **Speed** | Fast | Slower than RAM |
:::

:::compare Types of RAM
| | DRAM (dynamic RAM) | SRAM (static RAM) |
|---|---|---|
| Built from | Capacitors that must be **refreshed** thousands of times per second | Flip-flop circuits — **no refresh** needed |
| Speed | Slower | **Faster** |
| Cost and size | Cheaper, more bits per chip | Expensive, fewer bits per chip |
| Use | **Main memory** | **Cache memory** |
:::

:::compare Types of ROM
| Type | Description |
|---|---|
| **ROM** | Contents written during manufacture, cannot be changed |
| **PROM** | Programmable once by the user, then fixed |
| **EPROM** | Erasable with **ultraviolet light**, then reprogrammed |
| **EEPROM / flash** | Erased and rewritten **electrically** — used for BIOS/UEFI so the firmware can be updated |
:::

:::steps The boot process — why ROM is needed
- When the computer is switched on, **RAM is empty** (volatile).
- The CPU starts running the **bootstrap / BIOS (UEFI)** program stored in **ROM**.
- It **tests the hardware** (POST — power-on self-test) and finds the boot device.
- It **loads the operating system** from secondary storage into **RAM**.
- Control passes to the OS, which keeps running from RAM.
:::

:::example Embedded systems need both ROM and RAM
A **washing machine** has a microcontroller with:
- **ROM** — the **control program** (all the washing programmes and how to run the motor, pump and heater); it never changes and must survive power cuts.
- **RAM** — the **user's input** and current state: chosen programme, temperature, **spin speed**, time remaining, readings from the sensors; it changes during every wash.

A microwave oven similarly keeps its program in ROM and the **time and power setting** in RAM.
:::

# Virtual memory
@lo 11.3.4.2@paper

:::definition Virtual memory
A part of **secondary storage (HDD / SSD)** that the operating system uses **as if it were extra RAM** when the physical RAM is full. The file on the disk is called the **page file** or **swap file**.
:::

:::cards
### Purpose of virtual memory
- **Frees up space in RAM** for the program currently being used.
- **Increases the amount of memory available** beyond the physical RAM.
- Allows **more programs** to be open at once (**multitasking**) and **larger programs** to run than RAM alone would allow.
- Prevents programs from crashing when RAM runs out.
:::

:::steps How virtual memory works (paging)
- Programs and data are divided into fixed-size blocks called **pages**.
- When RAM is full, the OS moves pages that are **not being used now** from RAM to the **page file** on the disk (**paging out / swapping out**).
- When the CPU needs one of those pages, the OS moves it **back into RAM** (**paging in**), first moving another unused page out.
- The program does not know where its pages are — the OS keeps a **page table**.
:::

:::cards
### Problems of virtual memory
- **Slower** — reading and writing the disk is much slower than RAM, so data processing slows down.
- **Disk thrashing** — when RAM is far too small, the computer spends more time **moving pages between RAM and disk** than running programs; it becomes very slow and the disk is constantly busy.
- More **wear** on the HDD / SSD because of frequent reads and writes.
### Preventing "Not enough memory" errors and thrashing
- **Install more RAM** (the best solution).
- **Close** programs that are not needed.
- **Increase** the size of the page file (virtual memory).
- Reduce the cache sizes of applications.
:::

# Cache memory
@lo 11.3.4.3@paper

:::definition Cache memory
Very **fast, small memory** inside or next to the CPU that stores **copies of frequently used instructions and data**, so that the CPU does not have to wait for the slower RAM.
:::

:::steps How the cache works
- When the CPU needs data or an instruction, it checks the **cache first**.
- **Cache hit** — the data is in the cache and is used immediately (fast).
- **Cache miss** — the data is fetched from **RAM**, and a copy (with nearby data) is placed in the cache for next time.
- When the cache is full, the **least recently used** data is replaced.
:::

:::cards
### Why cache is faster than RAM
- It is **physically closer** to (or inside) the CPU, so signals travel a shorter distance.
- It is made of **SRAM**, which has **lower latency** and needs no refresh.
- It is **much smaller**, so the right data is found faster.
- It runs at (or close to) the **speed of the CPU**.
### Why it works — locality of reference
- **Temporal locality** — data used recently is likely to be used again soon (a loop counter).
- **Spatial locality** — data near recently used data is likely to be needed next (the next elements of an array, the next instructions).
:::

:::compare Cache levels
| Level | Location | Typical size | Speed |
|---|---|---|---|
| **L1** | Inside each CPU core (separate for instructions and data) | 32–64 KB per core | Fastest (≈ 1 ns) |
| **L2** | Inside each core or shared by two | 256 KB – 2 MB | Very fast |
| **L3** | Shared by all cores on the chip | 4–64 MB | Fast, slower than L2 |
:::

:::callout info Effect of cache size
A **larger** cache gives **more cache hits** and fewer slow RAM accesses, so the CPU is faster. But cache is **expensive** and takes space on the chip, and beyond a certain size the benefit becomes small.
:::

# The memory hierarchy and secondary storage
@lo 11.3.4.1@paper 11.3.4.3@paper

:::compare Memory hierarchy (fast and small → slow and large)
| Level | Typical access time | Typical size | Volatile? |
|---|---|---|---|
| **Registers** | < 1 ns | Bytes | Yes |
| **Cache L1 / L2 / L3** | 1–20 ns | KB – tens of MB | Yes |
| **RAM** | 50–100 ns | GB | Yes |
| **SSD** (also used for virtual memory) | ≈ 0.1 ms | Hundreds of GB – TB | No |
| **HDD** | 5–10 ms | TB | No |
| **Optical disc, tape (backup)** | Seconds | GB – TB | No |
:::

:::tip Reading the hierarchy
Going **down** the hierarchy, memory becomes **slower**, **larger** and **cheaper per GB**. Going **up**, it becomes **faster**, **smaller** and **more expensive**. Each level holds copies of the data most likely to be needed by the level above.
:::

:::compare Secondary storage devices
| | HDD (magnetic) | SSD (flash) | Optical (CD/DVD/Blu-ray) |
|---|---|---|---|
| How data is stored | Magnetised spinning platters, moving read/write head | Electrical charge in flash memory chips, **no moving parts** | Pits read by a laser |
| Speed | Slower | **Much faster** | Slowest |
| Capacity / cost | Large and cheap | More expensive per GB | Small |
| Durability | Damaged by knocks | Robust, silent, low power | Scratches |
| Use | Large storage, backups | Laptops, OS drive, phones | Distribution, archives |
:::

# Exam practice and summary
@lo 11.3.2.1@paper 11.3.2.2@paper 11.3.4.1@paper 11.3.4.2@paper 11.3.4.3@paper

:::example Exam-style answers
**Q: Name the four main components of the von Neumann architecture. [2]**
CPU, main memory (1); input/output devices, system bus (1).

**Q: Explain what is meant by the von Neumann bottleneck. [2]**
Instructions and data share the **same memory and bus** (1), so they cannot be transferred at the same time and the CPU often **waits for memory**, limiting performance (1).

**Q: Describe the fetch stage of the cycle. [3]**
The address in the **PC** is copied to the **MAR** and sent on the **address bus** (1); a **memory read** signal is sent and the instruction returns on the **data bus** to the **MDR** (1); it is copied to the **CIR** and the **PC is incremented** (1).

**Q: Describe the purpose of the ALU and the CU. [2]**
**ALU** — processes data: carries out **arithmetic** (+, −, ×, ÷) and **logic** (AND, OR, NOT, comparisons) operations (1). **CU** — **manages the execution of instructions**: directs the processor and tells memory, the ALU and I/O devices how to respond (1).

**Q: Define the term volatile memory. [1]**
Memory that **loses its contents when the power is turned off** (1).

**Q: Explain why embedded systems such as washing machines need RAM. [2]**
To store the **user's input** (1), for example the **spin speed and washing programme** chosen, which change for each wash (1).

**Q: Explain the purpose of virtual memory. [2]**
It **frees up space in RAM** (1) and **increases the memory available** beyond the physical RAM, so more programs / tasks can run at once (1).

**Q: Explain one problem that may arise when using virtual memory. [2]**
The system **slows down** (1) because it spends much time **moving data between RAM and the disk**, which is much slower than RAM (1).

**Q: Explain why access to data in cache memory is faster than in RAM. [2]**
Cache is located **in / closer to the CPU** (1), which **reduces the time** it takes to access the data (1). (Or: cache uses **SRAM**, which has lower latency.)

**Q: Explain how an interrupt is handled. [3]**
The CPU checks for interrupts at the **end of each cycle** (1); it **saves its registers** and runs the **interrupt service routine** (1); then **restores** the registers and continues the previous task (1).
:::

:::compare Key terms — one-sentence definitions
| Term | Definition |
|---|---|
| **Von Neumann architecture** | A stored-program architecture where instructions and data share main memory and are processed by a CPU |
| **CPU** | The processor that executes instructions, processes data and coordinates system operations |
| **CU** | The CPU component that manages instruction execution and sends control signals |
| **ALU** | The CPU component that performs arithmetic and logical operations |
| **Registers** | Small, high-speed storage locations inside the CPU |
| **Processor clock** | A timing mechanism that synchronises CPU activity |
| **Main memory** | Memory holding the active program instructions and data for CPU access |
| **System bus** | The communication system linking the CPU, memory and I/O devices |
| **Stored program concept** | The principle that a program must be stored in main memory to be executed |
| **Fetch / decode / execute** | Get the next instruction from memory / interpret it / carry it out |
| **I/O controller** | Hardware that manages the flow of information between the CPU and a peripheral |
| **I/O port** | A physical or logical interface used to connect a peripheral or network interface |
| **Interrupt** | A signal telling the CPU that a device or program needs attention |
| **Buffer** | Temporary memory between devices working at different speeds |
:::

:::warning Common mistakes
- Saying ROM "is used for storing files" — files are stored on **secondary storage**; ROM holds the **boot program / firmware**.
- Saying virtual memory **makes the computer faster** — it allows more programs to run, but it is **slower** than RAM.
- Confusing **cache** (fast memory near the CPU) with **virtual memory** (disk used as RAM).
- Saying the PC holds the **current** instruction — it holds the **address of the next** one.
- Explaining the von Neumann bottleneck as "the CPU is slow" — it is the **shared path** between CPU and memory.
- Saying a device driver is hardware — it is **software**; the I/O controller is hardware.
- Writing "RAM stores data permanently" — RAM is **volatile**.
:::

:::steps Check yourself
- Name the four main components of the von Neumann architecture.
- State the stored program concept and describe how a program gets from storage to the CPU.
- Describe the detailed fetch phase, naming the registers and buses used.
- What is the von Neumann bottleneck and how do modern CPUs reduce it?
- Name three input, three output and three storage peripherals.
- What is the difference between a device driver and an I/O controller?
- Compare polling with interrupts; list the steps of handling an interrupt.
- Describe how a buffer and interrupts are used when printing.
- State the functions of the CU, ALU and five registers.
- Give four differences between RAM and ROM, and explain why a computer needs ROM.
- Explain the purpose of virtual memory, how paging works and what disk thrashing is.
- Explain cache hits, cache misses and why a bigger cache improves performance.
:::
