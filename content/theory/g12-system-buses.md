---
summary: The components of the CPU and how data is transferred between the CPU, main memory and input/output devices through the address, data and control buses; the registers and steps of the fetch–decode–execute cycle in register transfer notation; interrupts; and how clock speed, word length, bus width, cores and cache affect performance.
---
# The CPU and the system bus
@lo 12.3.2.4

## What the CPU does

Every program you run — a browser, a game, the school e-journal — is, in the end, a long list of very simple **machine-code instructions** stored in main memory: "load this number", "add these two values", "store the result here", "jump to that instruction". The part of the computer that carries out those instructions is the **central processing unit (CPU)**, also called the **processor**. The CPU does not "understand" a program as a whole. It repeats one simple job billions of times per second: it **fetches** the next instruction from memory, **decodes** it to find out what it means, and **executes** it. Everything the computer does is built out of this repetition.

To do its job the CPU must constantly exchange information with the rest of the computer. Instructions and data live in **main memory (RAM)**, not inside the CPU, so the CPU has to ask memory for them and receive them. Results must be sent back to memory. Input devices (keyboard, mouse, sensors) and output devices (screen, printer, speakers) must also send and receive data. All of this traffic travels along a shared set of electrical connections called the **system bus**. That is why this topic joins two ideas together: what is inside the CPU, and how the CPU talks to everything else.

:::definition Central Processing Unit (CPU)
The part of the computer that **fetches, decodes and executes** program instructions and processes data. It contains the **control unit (CU)**, the **arithmetic logic unit (ALU)**, **registers** and usually **cache**, and is connected to main memory and input/output devices by the **system bus**.
:::

## The components inside the CPU

A modern processor contains billions of transistors, but for the exam it is described as a small number of functional parts. Each part has one clear job, and the parts work together under the direction of the control unit.

The **control unit (CU)** is the "manager" of the processor. It does not do calculations itself. Instead it **decodes** each instruction — it looks at the bit pattern and works out which operation is required — and then sends **control signals** to the other components to make that operation happen: "ALU, add these two values", "memory, read the location in the MAR", "register, load the value from the data bus". The control unit also coordinates the steps of the fetch–decode–execute cycle and controls the movement of data along the buses, so that two components never try to use the same bus at the same moment.

The **arithmetic logic unit (ALU)** is the part that actually **computes**. It carries out **arithmetic operations** such as addition and subtraction (multiplication and division are usually built from repeated additions, subtractions and shifts), and **logical operations** such as AND, OR, NOT and XOR, comparisons (is A equal to B? is A greater than B?) and **shifts** of bits left or right. The result of an ALU operation is usually placed in a special register, the **accumulator (ACC)**, and the ALU also sets **flags** in the status register — for example the zero flag when the result is 0, or the carry flag when an addition produced a carry out of the top bit.

**Registers** are tiny storage locations **inside the CPU**, each holding one word (for example 32 or 64 bits). They are the fastest storage in the whole computer because they are built into the processor itself and are connected directly to the ALU and control unit. Some are **general-purpose registers** used by programs to hold values they are working on; others are **special-purpose registers** with a fixed job in the instruction cycle — the PC, MAR, MDR, CIR, ACC and status register, which are studied in detail in lesson 2.

The **clock** is an electronic circuit that sends out a regular stream of **pulses**. Each pulse is one **clock cycle**, and every action in the CPU — copying a value into a register, putting an address on the bus, an ALU operation — begins on a clock pulse. The clock keeps all the components **synchronised**, rather like a conductor keeping an orchestra in time. Its frequency, the **clock speed**, is one of the main factors in performance (lesson 3).

Finally, most processors contain **cache memory**: a small amount of very fast memory between the registers and main memory that holds copies of recently and frequently used instructions and data, so the CPU does not have to wait for slow RAM every time.

:::cards
### Control unit (CU)
- **Decodes** instructions and **sends control signals** to the other components.
- Coordinates the **fetch–decode–execute** cycle and the movement of data along the buses.
### Arithmetic logic unit (ALU)
- Performs **arithmetic** (add, subtract) and **logical** operations (AND, OR, NOT, comparisons, shifts).
- Results are usually stored in the **accumulator (ACC)**; the ALU sets the **flags**.
### Registers
- Very small, very fast storage locations **inside the CPU** that hold addresses, instructions and data being used right now.
### Clock
- Sends regular **pulses** that keep all components **synchronised**; each pulse is one **clock cycle**.
:::

:::definition Register
A very small, very fast storage location **inside the CPU** that holds a single value — an address, an instruction or an item of data — that the processor is using at that moment.
:::

## What a bus is

Inside a computer, components are connected by wires — on the motherboard these are thin copper tracks printed on the circuit board. A **bus** is a group of such wires used together for one purpose. Each wire, called a **line**, can carry **one bit at a time**: a high voltage for 1, a low voltage for 0. If a bus has 16 lines, it can carry a 16-bit value in one go, because all 16 bits travel side by side at the same moment. This is called **parallel transmission**, and the number of lines in the bus is called its **width**.

The word "bus" is a good image. A city bus follows a fixed route and stops at many places; anyone at a stop can get on. In the same way, a computer bus is **shared**: the CPU, main memory and several input/output controllers are all connected to the same lines. Sharing saves a huge amount of wiring — imagine needing a separate set of 64 wires from the CPU to every single device — but it brings a rule: **only one component may put a value on a bus at a time**, otherwise the voltages clash and the data is destroyed. Controlling who may use the bus is one of the jobs of the control unit and the control bus.

:::definition System bus
A set of **parallel wires (lines)** on the motherboard that **connects the CPU, main memory and input/output (I/O) controllers** so that they can exchange data, addresses and control signals. Each line carries **one bit** at a time. The system bus is made up of the **address bus**, the **data bus** and the **control bus**.
:::

:::definition Bus width
The **number of lines** (wires) in a bus, and therefore the **number of bits it can carry at the same time**. A 32-bit data bus moves 32 bits (4 bytes) in each transfer.
:::

## Which components the system bus connects

The system bus links three groups of components.

1. **The CPU** — the only component that runs the program and therefore the one that starts almost every transfer. It decides which memory location or device to use and whether to read or write.
2. **Main memory** — RAM, which holds the running programs and their data, and ROM, which holds the start-up instructions (the firmware). Memory is a passive component: it never starts a transfer on its own; it only answers the CPU's read and write requests.
3. **Input/output (I/O) controllers** — the electronics that sit between the bus and each peripheral device: the keyboard controller, the graphics controller, the disk (storage) controller, the network controller, the USB controller. The CPU does not drive a printer or a hard disk directly. It writes data and commands to the device's controller through I/O **ports** (special addresses), and the controller then handles the device at the device's own speed.

:::svg The system bus: three groups of lines shared by the CPU, main memory and the I/O controllers
<svg class="bus" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The CPU at the top contains the control unit, ALU, registers and cache. Below it run three horizontal buses: the address bus with arrows only away from the CPU, the data bus with arrows in both directions and the control bus with arrows in both directions. Main memory, the keyboard controller, the graphics controller and the disk controller hang from the buses below. Each controller connects to its device: keyboard, monitor and disk.">
  <style>
    svg.bus .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bus .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bus .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bus .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bus .ab{stroke:var(--primary);stroke-width:4;fill:none}
    svg.bus .db{stroke:var(--success);stroke-width:4;fill:none}
    svg.bus .cb{stroke:var(--warning);stroke-width:4;fill:none}
    svg.bus .ta{stroke:var(--primary);stroke-width:2;fill:none}
    svg.bus .td{stroke:var(--success);stroke-width:2;fill:none}
    svg.bus .tc{stroke:var(--warning);stroke-width:2;fill:none}
    svg.bus .ln{stroke:var(--border);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="busA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="busA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
    <marker id="busA3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--warning)"/></marker>
  </defs>
  <rect class="pb" x="240" y="10" width="280" height="70" rx="10"/>
  <text class="h" x="380" y="34" text-anchor="middle">CPU</text>
  <text class="t" x="380" y="56" text-anchor="middle">Control unit · ALU · registers · cache</text>
  <line class="ta" x1="300" y1="80" x2="300" y2="122" marker-end="url(#busA1)"/>
  <line class="td" x1="380" y1="84" x2="380" y2="146" marker-start="url(#busA2)" marker-end="url(#busA2)"/>
  <line class="tc" x1="460" y1="84" x2="460" y2="170" marker-start="url(#busA3)" marker-end="url(#busA3)"/>
  <line class="ab" x1="20" y1="128" x2="740" y2="128"/><text class="t" x="24" y="120">Address bus (one way, from the CPU)</text>
  <line class="db" x1="20" y1="152" x2="740" y2="152"/><text class="t" x="560" y="146">Data bus (two way)</text>
  <line class="cb" x1="20" y1="176" x2="740" y2="176"/><text class="t" x="370" y="196" text-anchor="middle">Control bus</text><text class="s" x="370" y="212" text-anchor="middle">(both ways)</text>
  <g>
    <line class="ta" x1="90" y1="128" x2="90" y2="226" marker-end="url(#busA1)"/><line class="td" x1="110" y1="158" x2="110" y2="226" marker-start="url(#busA2)" marker-end="url(#busA2)"/><line class="tc" x1="130" y1="182" x2="130" y2="226" marker-start="url(#busA3)" marker-end="url(#busA3)"/>
    <rect class="ok" x="40" y="230" width="140" height="56" rx="8"/><text class="h" x="110" y="254" text-anchor="middle">Main memory</text><text class="s" x="110" y="274" text-anchor="middle">RAM and ROM</text>
  </g>
  <g>
    <line class="ta" x1="260" y1="128" x2="260" y2="226" marker-end="url(#busA1)"/><line class="td" x1="280" y1="158" x2="280" y2="226" marker-start="url(#busA2)" marker-end="url(#busA2)"/><line class="tc" x1="300" y1="182" x2="300" y2="226" marker-start="url(#busA3)" marker-end="url(#busA3)"/>
    <rect class="bx" x="210" y="230" width="140" height="56" rx="8"/><text class="t" x="280" y="254" text-anchor="middle">Keyboard</text><text class="t" x="280" y="272" text-anchor="middle">controller</text>
    <line class="ln" x1="280" y1="286" x2="280" y2="310"/><rect class="bx" x="230" y="310" width="100" height="34" rx="6"/><text class="s" x="280" y="332" text-anchor="middle">Keyboard</text>
  </g>
  <g>
    <line class="ta" x1="430" y1="128" x2="430" y2="226" marker-end="url(#busA1)"/><line class="td" x1="450" y1="158" x2="450" y2="226" marker-start="url(#busA2)" marker-end="url(#busA2)"/><line class="tc" x1="470" y1="182" x2="470" y2="226" marker-start="url(#busA3)" marker-end="url(#busA3)"/>
    <rect class="bx" x="380" y="230" width="140" height="56" rx="8"/><text class="t" x="450" y="254" text-anchor="middle">Graphics</text><text class="t" x="450" y="272" text-anchor="middle">controller</text>
    <line class="ln" x1="450" y1="286" x2="450" y2="310"/><rect class="bx" x="400" y="310" width="100" height="34" rx="6"/><text class="s" x="450" y="332" text-anchor="middle">Monitor</text>
  </g>
  <g>
    <line class="ta" x1="600" y1="128" x2="600" y2="226" marker-end="url(#busA1)"/><line class="td" x1="620" y1="158" x2="620" y2="226" marker-start="url(#busA2)" marker-end="url(#busA2)"/><line class="tc" x1="640" y1="182" x2="640" y2="226" marker-start="url(#busA3)" marker-end="url(#busA3)"/>
    <rect class="bx" x="550" y="230" width="140" height="56" rx="8"/><text class="t" x="620" y="254" text-anchor="middle">Disk</text><text class="t" x="620" y="272" text-anchor="middle">controller</text>
    <line class="ln" x1="620" y1="286" x2="620" y2="310"/><rect class="bx" x="570" y="310" width="100" height="34" rx="6"/><text class="s" x="620" y="332" text-anchor="middle">SSD / HDD</text>
  </g>
</svg>
:::

## Why a computer uses a shared bus

There are two basic ways to wire components together. In a **point-to-point** design every pair of components that needs to talk gets its own private connection. In a **shared bus** design all components hang on the same set of lines. Early personal computers and the model used in the exam syllabus use the shared system bus, and it is worth understanding why — and what it costs.

:::compare Shared system bus vs separate point-to-point links
| | Shared system bus | Separate point-to-point links |
|---|---|---|
| Wiring | One set of lines for everything — **simple and cheap** | A separate set of wires for every pair of components — complex and expensive |
| Adding a new device | Easy: connect it to the existing bus (**expandable**) | A new link has to be built to every component it talks to |
| Transfers at the same time | **Only one** transfer at a time — devices must take turns | Several pairs can transfer **simultaneously** |
| Main weakness | The bus becomes a **bottleneck** when many devices are busy | Cost, size and power of the extra wiring |
| Where it is used | The classic von Neumann computer model; simple microcontrollers | Modern PCs for the fastest links (e.g. PCIe lanes, dedicated memory channels) |
:::

The shared bus is the reason why bus speed and width matter so much for performance: if all traffic between the CPU and memory squeezes through the same lines, then the number of bits those lines can carry per second sets an upper limit on how fast the whole computer can work. This limit is known as the **von Neumann bottleneck**, and lesson 3 shows how cache, wider buses and faster clocks are used to reduce it.

:::example Worked example — what the CPU and the bus do when you press a key
A student types the letter **A** into a text editor.
1. The keyboard detects the key press and its **controller** stores the key code (for **A**, 65 = 0100 0001) in a small buffer.
2. The keyboard controller sends an **interrupt request** to the CPU along the **control bus** ("I have data for you").
3. When the CPU is ready, it puts the **address of the keyboard controller's port** on the **address bus** and sends a **read** signal on the **control bus**.
4. The controller places **0100 0001** on the **data bus**, and the CPU copies it into a register.
5. The editor program stores the character in its text in RAM: the CPU puts the **RAM address** on the address bus, the character on the data bus and a **memory write** signal on the control bus.
6. To show the letter, the CPU writes data to the **graphics controller** in the same way, and the graphics controller draws **A** on the monitor.

The same three buses were used in every step; only the **address** on the address bus changed which component took part.
:::

# Address, data and control buses
@lo 12.3.2.4

The system bus is not one undivided cable. Its lines are split into three groups, each with a different job. When the CPU wants to use memory or a device it must answer three questions: **where** (which location or port?), **what** (which value is being moved?) and **how** (read or write, and when?). The **address bus** answers "where", the **data bus** carries the "what", and the **control bus** carries the "how".

## The address bus

The **address bus** carries the **address** of the memory location (or the I/O port) that the CPU wants to read from or write to. Every location in main memory has a unique number — its address — and every device controller is given addresses too. When the CPU places a binary number on the address bus, the memory's address decoder (or the matching device) recognises that number and selects that one location, while every other location ignores the bus.

The address bus is **unidirectional** (one-way): addresses travel **only from the CPU** to memory and to the I/O controllers. The reason is simple: the CPU is the component running the program, so it is the CPU that decides which location to use next. Memory never needs to tell the CPU an address on these lines — it only needs to receive one.

The **width** of the address bus decides **how many different locations can be addressed**. Each line carries one bit, so a bus with **n** lines can carry **2ⁿ** different binary patterns, and therefore select **2ⁿ** locations. If each location holds one byte, the maximum memory is 2ⁿ bytes.

$$\text{number of addressable locations} = 2^{n} \quad (n = \text{number of address lines})$$ | Address bus width and addressable memory

:::compare Address bus width and the maximum memory it can address (1 byte per location)
| Address lines (n) | Locations 2ⁿ | Maximum memory | Typical use |
|---|---|---|---|
| 16 | 65 536 | 64 KiB | 1980s home computers, small microcontrollers |
| 20 | 1 048 576 | 1 MiB | The original IBM PC (Intel 8086) |
| 32 | 4 294 967 296 | 4 GiB | 32-bit PCs — the reason a 32-bit system could not use more than 4 GiB of RAM |
| 36 | 68 719 476 736 | 64 GiB | 32-bit PCs with address extension |
| 48 | 2.8 × 10¹⁴ | 256 TiB | Modern 64-bit processors (not all 64 bits are used for addresses) |
:::

Adding **one** line to the address bus **doubles** the number of addressable locations, because 2ⁿ⁺¹ = 2 × 2ⁿ. This is why designers can greatly increase the maximum memory with only a few extra lines. Note carefully what the address bus does **not** affect: it does not change how many bits are moved in each transfer, and it does not by itself make the processor faster. It sets the **capacity** of memory the CPU can reach.

:::definition Address bus
The part of the system bus that carries the **address** of the memory location or I/O port to be read from or written to. It is **unidirectional** (from the CPU). Its width determines the **maximum number of addressable memory locations** (2ⁿ for n lines).
:::

## The data bus

The **data bus** carries the actual **data or instruction** being transferred: the instruction the CPU is fetching, a number it is loading, a result it is storing, or a character on its way to the printer. The data bus is **bidirectional** (two-way): when the CPU **reads**, data travels from memory or the device **into** the CPU; when it **writes**, data travels **out of** the CPU to memory or the device. The same lines are used in both directions, but only one direction at a time — the control signals say which.

The **width** of the data bus decides **how many bits are transferred in one bus operation**. An 8-bit data bus moves one byte at a time; a 64-bit data bus moves eight bytes at a time. A wider data bus therefore needs **fewer transfers** to move the same amount of data, and the CPU spends less time waiting. The data bus width is normally equal to the processor's **word length** (lesson 3), so that one complete word — one instruction or one number — can be fetched in a single transfer.

:::definition Data bus
The part of the system bus that carries **data and instructions** between the CPU, main memory and I/O devices. It is **bidirectional**. Its width determines **how many bits can be transferred at the same time**.
:::

## The control bus

The **control bus** carries **control and timing signals** that coordinate everything happening on the other two buses. Unlike the address and data buses, its lines do not carry one binary number; each line (or small group of lines) has its **own meaning**. One line says "this is a memory read", another "this is a memory write", another carries the clock pulses, others carry interrupt requests from devices.

The control bus is **bidirectional** in the sense that signals travel **both to and from the CPU**: the CPU sends read, write and clock signals out to memory and devices, while devices send signals back to the CPU, such as an **interrupt request** ("I need attention") or a **bus request** ("I want to use the bus"). Its width is not a measure of performance in the same way as the other two buses; it simply has as many lines as there are signals.

:::definition Control bus
The part of the system bus that carries **control and timing signals** — for example memory read, memory write, clock, interrupt request, bus request/grant and reset — to coordinate the use of the address and data buses. Signals travel **both to and from** the CPU.
:::

:::compare Signals on the control bus
| Signal | Direction | Purpose |
|---|---|---|
| **Memory read** | CPU → memory | Tells memory to put the contents of the addressed location on the data bus |
| **Memory write** | CPU → memory | Tells memory to store the value on the data bus at the addressed location |
| **I/O read / I/O write** | CPU → I/O controller | Same as memory read / write, but the address refers to a device port |
| **Clock** | CPU → all | Synchronises the operations of all components |
| **Interrupt request** | Device → CPU | A device tells the CPU it needs attention |
| **Bus request / bus grant** | Device → CPU / CPU → device | A device asks for, and is given, control of the bus (e.g. for DMA) |
| **Reset** | → all | Restarts the system in a known state |
:::

## Comparing the three buses

:::compare The three buses
| Bus | Carries | Direction | Width affects |
|---|---|---|---|
| **Address bus** | The **address** of the memory location (or I/O port) to be read from or written to | **Unidirectional** (one-way): CPU → memory / I/O | How **much memory** can be addressed: n lines → **2ⁿ** locations |
| **Data bus** | The **data or instruction** being transferred | **Bidirectional** (two-way): CPU ↔ memory / I/O | How **many bits** are transferred **at once** — the speed of transfers |
| **Control bus** | **Control and timing signals** (read, write, clock, interrupt) | **Bidirectional**: signals go both to and from the CPU | — (one line per signal) |
:::

:::callout info Why is the address bus one-way?
Only the **CPU** decides **which** location to use, so addresses always travel **from** the CPU. Data must travel **both** ways — into the CPU when reading and out of it when writing — so the data bus is **two-way**. Control signals are two-way because devices also need to signal the CPU (interrupts, bus requests).
:::

:::example Worked example — sizes of a microcontroller's buses
A school robotics kit uses a microcontroller with a **16-bit address bus** and an **8-bit data bus**; each memory location holds one byte.
- Number of addresses: 2¹⁶ = **65 536** locations, so the maximum memory is 65 536 bytes = **64 KiB**.
- Each read moves **8 bits = 1 byte**. To load a 32-bit sensor value (4 bytes) the CPU needs **4 separate reads**, one for each byte at four consecutive addresses.
- If the designers widened the **data** bus to 32 bits, the same value would arrive in **1 read** — four times fewer transfers — but the maximum memory would **not** change.
- If instead they added **4 lines** to the **address** bus (20 lines), memory could grow to 2²⁰ = **1 MiB** (16 times more), but each read would still bring only one byte.
:::

# Transferring data between components
@lo 12.3.2.4

Knowing the names of the buses is only half of the objective; you must be able to **explain how data is transferred** using them. Every transfer on the system bus follows the same pattern: the CPU puts an **address** on the address bus, the control unit sends a **control signal** saying what kind of transfer it is, and the **data** moves on the data bus. Two registers sit between the CPU and the buses: the **Memory Address Register (MAR)**, whose output is connected to the address bus, and the **Memory Data Register (MDR)**, connected to the data bus. Anything leaving or entering the processor via memory passes through these two registers.

:::definition Memory read and memory write
A **memory read** copies the contents of a memory location **into the CPU** (into the MDR); the location keeps its value. A **memory write** copies a value **from the CPU** (from the MDR) into a memory location, replacing what was stored there.
:::

## Reading data from memory

Suppose the CPU needs the value stored at address 200. The steps are:

:::steps Reading data from memory
- The CPU places the **address** (200) in the **MAR**; the MAR puts it on the **address bus**.
- The control unit sends a **memory read** signal along the **control bus**.
- Memory decodes the address, selects location 200 and places its **contents** on the **data bus**.
- The data travels along the data bus into the **MDR**, from where it can be copied to another register (e.g. the ACC or CIR).
:::

Notice the order: the address must be on the bus **before** memory can respond, and the read signal tells memory that it should **output** data rather than accept it. The value in location 200 is copied, not moved — after a read, memory still holds the same value.

## Writing data to memory

To store the result 57 at address 201:

:::steps Writing data to memory
- The **address** (201) is placed in the **MAR** and sent along the **address bus**.
- The **data** (57) is placed in the **MDR** and sent along the **data bus**.
- The control unit sends a **memory write** signal along the **control bus**.
- Memory stores the data from the data bus at that address, overwriting the old contents.
:::

:::svg A memory read (top) and a memory write (bottom): the address always goes out, the data goes in or out
<svg class="bus" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two panels. Top panel, memory read: the CPU's MAR holds 200 and sends it on the address bus to memory; the control bus carries READ to memory; location 200 holds 0010 1101 which travels on the data bus from memory back into the MDR. Bottom panel, memory write: the MAR holds 201 and sends it on the address bus; the MDR holds 0011 1001, which is 57, and sends it on the data bus to memory; the control bus carries WRITE; location 201 now stores 0011 1001.">
  <style>
    svg.bus .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bus .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.bus .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bus .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bus .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bus .ab{stroke:var(--primary);stroke-width:3;fill:none}
    svg.bus .db{stroke:var(--success);stroke-width:3;fill:none}
    svg.bus .cb{stroke:var(--warning);stroke-width:3;fill:none;stroke-dasharray:6 4}
  </style>
  <defs>
    <marker id="busB1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="busB2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
    <marker id="busB3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--warning)"/></marker>
  </defs>
  <text class="h" x="20" y="22">1. Memory READ from address 200</text>
  <rect class="bx" x="20" y="34" width="190" height="130" rx="8"/><text class="h" x="115" y="54" text-anchor="middle">CPU</text>
  <rect class="pb" x="36" y="64" width="158" height="38" rx="5"/><text class="m" x="115" y="88" text-anchor="middle">MAR = 200</text>
  <rect class="ok" x="36" y="112" width="158" height="38" rx="5"/><text class="m" x="115" y="136" text-anchor="middle">MDR ← 0010 1101</text>
  <line class="ab" x1="194" y1="78" x2="520" y2="78" marker-end="url(#busB1)"/><text class="t" x="357" y="70" text-anchor="middle">address bus: 200</text>
  <line class="cb" x1="194" y1="100" x2="520" y2="100" marker-end="url(#busB3)"/><text class="t" x="357" y="117" text-anchor="middle">control bus: READ</text>
  <line class="db" x1="520" y1="140" x2="198" y2="140" marker-end="url(#busB2)"/><text class="t" x="357" y="158" text-anchor="middle">data bus: contents come back</text>
  <rect class="bx" x="530" y="34" width="210" height="130" rx="8"/><text class="h" x="635" y="54" text-anchor="middle">Main memory</text>
  <rect class="pb" x="546" y="66" width="178" height="30" rx="4"/><text class="m" x="635" y="86" text-anchor="middle">200: 0010 1101</text>
  <rect class="bx" x="546" y="100" width="178" height="30" rx="4"/><text class="m" x="635" y="120" text-anchor="middle">201: 0000 0000</text>
  <text class="h" x="20" y="200">2. Memory WRITE of 57 to address 201</text>
  <rect class="bx" x="20" y="212" width="190" height="130" rx="8"/><text class="h" x="115" y="232" text-anchor="middle">CPU</text>
  <rect class="pb" x="36" y="242" width="158" height="38" rx="5"/><text class="m" x="115" y="266" text-anchor="middle">MAR = 201</text>
  <rect class="ok" x="36" y="290" width="158" height="38" rx="5"/><text class="m" x="115" y="314" text-anchor="middle">MDR = 0011 1001</text>
  <line class="ab" x1="194" y1="256" x2="520" y2="256" marker-end="url(#busB1)"/><text class="t" x="357" y="248" text-anchor="middle">address bus: 201</text>
  <line class="cb" x1="194" y1="278" x2="520" y2="278" marker-end="url(#busB3)"/><text class="t" x="357" y="295" text-anchor="middle">control bus: WRITE</text>
  <line class="db" x1="194" y1="318" x2="520" y2="318" marker-end="url(#busB2)"/><text class="t" x="357" y="336" text-anchor="middle">data bus: 57 goes out</text>
  <rect class="bx" x="530" y="212" width="210" height="130" rx="8"/><text class="h" x="635" y="232" text-anchor="middle">Main memory</text>
  <rect class="bx" x="546" y="244" width="178" height="30" rx="4"/><text class="m" x="635" y="264" text-anchor="middle">200: 0010 1101</text>
  <rect class="ok" x="546" y="278" width="178" height="30" rx="4"/><text class="m" x="635" y="298" text-anchor="middle">201: 0011 1001</text>
</svg>
:::

## Transfers to and from input/output devices

Input and output use exactly the same buses. Each I/O controller has one or more **ports** — small registers inside the controller, each identified by an address. To send a byte to a printer, the CPU places the **port address** of the printer controller on the address bus, the byte on the data bus, and an **I/O write** signal on the control bus. To read a key code from the keyboard controller, it places the keyboard port's address on the address bus and sends an **I/O read** signal; the controller answers on the data bus. In many systems the device ports are simply given addresses inside the normal memory address range (**memory-mapped I/O**), so the CPU uses ordinary memory read and write instructions to talk to devices.

Devices are much slower than the CPU. A printer may accept a few hundred characters per second while the processor can execute billions of instructions per second. That is why devices have **controllers with buffers**: the CPU can quickly put a block of data into the buffer and get on with other work, and the controller tells the CPU — with an **interrupt** on the control bus — when it has finished or when new input has arrived. Interrupts are studied in lesson 2.

## Who controls the bus: bus arbitration and DMA

Because the bus is shared, two components must never drive it at the same time. Normally the CPU is the **bus master** and starts every transfer. Sometimes, though, a device needs to move a large block of data — for example a disk controller loading a 50 MB file into RAM. If every byte had to pass through the CPU (device → CPU register → memory), the CPU would be busy for millions of transfers. Instead many computers use **direct memory access (DMA)**: the device sends a **bus request** on the control bus, the CPU finishes its current bus operation and replies with **bus grant**, and the DMA controller then puts addresses and data on the buses itself, copying the block straight between the device and memory. When it has finished, it releases the bus and sends an interrupt to tell the CPU the data is ready. The control bus therefore carries not just read and write signals but also the "permission" signals that decide who may use the address and data buses.

:::compare Programmed I/O vs direct memory access (DMA)
| | CPU moves every item (programmed I/O) | Direct memory access (DMA) |
|---|---|---|
| Path of the data | Device → data bus → CPU register → data bus → memory | Device → data bus → memory, without passing through the CPU |
| CPU time used | High — the CPU executes instructions for every word moved | Low — the CPU only sets up the transfer and handles one interrupt at the end |
| Control bus signals | I/O read, memory write for every word | Bus request, bus grant, then interrupt when finished |
| Suitable for | Small amounts of data (a key press, a sensor reading) | Large blocks (disk files, network packets, audio and video streams) |
:::

:::mermaid Sequence of one memory read on the system bus
sequenceDiagram
  participant CPU
  participant AB as Address bus
  participant CB as Control bus
  participant M as Main memory
  participant DB as Data bus
  CPU->>AB: address from MAR
  AB->>M: location selected
  CPU->>CB: memory read signal
  CB->>M: read
  M->>DB: contents of the location
  DB->>CPU: value arrives in MDR
:::

:::example Worked example — a teacher's laptop saves a mark
A teacher enters a mark of **9** and the e-journal program stores it in variable `mark`, which the program keeps at memory address **4 000**. The value is in the accumulator.
1. **Address**: the CPU copies 4 000 into the **MAR**; the MAR places it on the **address bus** (one way, towards memory).
2. **Data**: the CPU copies 9 from the ACC into the **MDR**; the MDR places 0000 1001 on the **data bus**.
3. **Control**: the control unit sends **memory write** on the **control bus**, timed by the **clock**.
4. **Result**: memory location 4 000 now holds 9.

Later the program checks the mark. This time steps 1 and 3 are an address and a **memory read**, and the value 9 travels the other way along the **same data bus** into the MDR. If an exam asks you to "explain how data is transferred", describe all three buses in this order: **address → control signal → data**, and name the **MAR** and **MDR**.
:::

:::warning Common mistakes
- Saying the **address bus** is two-way — it is **one-way** (from the CPU).
- Saying the **address bus carries data** — it carries only the **location**; the data itself travels on the data bus.
- Saying a wider **address** bus makes transfers faster — it increases the **amount of memory** that can be addressed; it is the **data** bus width that affects how much is moved per transfer.
- Forgetting the **control signal**: a description of a memory read without the **read signal on the control bus** usually loses a mark.
- Describing the buses as "cables to the printer" — they are lines on the **motherboard** connecting the CPU, memory and **I/O controllers**.
:::

# Exam practice: the system bus and data transfer
@lo 12.3.2.4

:::example Exam-style questions with model answers
**Q: Define the term system bus and name the components it connects. [3]**
A set of parallel wires/lines that carries signals between components (1); it connects the **CPU**, **main memory** (1) and **I/O controllers / devices** (1).

**Q: Write the names and purposes of the buses used by the CPU. [6]**
**Data bus** (1) — carries data / instructions between the CPU, memory and I/O, in **both directions** (1). **Address bus** (1) — carries the **address** of the location data is read from or written to, **one way** from the CPU (1). **Control bus** (1) — carries **control signals** such as memory read / write, clock and interrupts (1).

**Q: Explain why the address bus is unidirectional but the data bus is bidirectional. [2]**
Only the CPU decides which location is used, so addresses only travel **from the CPU** to memory/I/O (1); data must travel **into** the CPU when reading and **out of** it when writing (1).

**Q: Explain how data is read from main memory using the system bus. [4]**
The address is placed in the **MAR** and sent along the **address bus** (1); the control unit sends a **memory read** signal on the **control bus** (1); memory places the contents of that location on the **data bus** (1); the data is copied into the **MDR** (1).

**Q: A computer has a 24-bit address bus. Each location stores one byte. Calculate the maximum memory it can address. [2]**
2²⁴ = 16 777 216 locations (1) = 16 777 216 bytes = **16 MiB** (1).

**Q: Explain the purpose of direct memory access (DMA). [2]**
A device controller transfers a block of data **directly between the device and memory** without passing through the CPU (1); the CPU is free to do other work and is told by an **interrupt** when the transfer is finished (1).
:::

:::warning Common mistakes in exam answers
- For "purpose" questions give **what the bus carries and the direction** — a name alone is 1 mark at most.
- In calculations write **2ⁿ**, the number of locations, then the unit. 2²⁴ bytes is 16 **MiB**, not 24 MB.
- Do not mix up the order of a read: the **address and read signal come first**, the data comes back afterwards.
:::

:::steps Check yourself
- Name the four main components of the CPU and the job of each.
- Define system bus and bus width.
- Name the three buses, what each carries and in which direction.
- How many locations can a 20-bit and a 32-bit address bus address?
- Describe a memory read and a memory write in four steps each, naming the MAR and MDR.
- How does the CPU send a byte to a printer, and why does a disk controller use DMA?
:::

# Registers used in the cycle
@lo 12.3.2.5

## Why the CPU needs special-purpose registers

Lesson 1 showed that the CPU talks to memory through the address bus and data bus. To run a program it must do this in a very disciplined way: it has to remember **where** the next instruction is, hold the **address** it is currently using, hold the **value** that has just arrived, keep the **instruction** it is working on, and store the **result** of a calculation. Each of these jobs is given to a dedicated register. Because registers are inside the CPU and are connected directly to the control unit and ALU, copying a value between two registers takes a single clock cycle — far quicker than any access to main memory.

:::definition Special-purpose register
A register inside the CPU with **one fixed job** in the fetch–decode–execute cycle (for example the PC, MAR, MDR, CIR, ACC or status register). Programs cannot use it for any other purpose. A **general-purpose register**, by contrast, can hold any value the program is working on.
:::

## The registers one by one

The **Program Counter (PC)** holds the **address of the next instruction to be fetched**. When the computer starts, the PC is set to the address of the first instruction of the start-up program in ROM. During every fetch the PC is **incremented** so that it points to the instruction that follows. A **jump** or **branch** instruction works by writing a new address into the PC, so that the next fetch comes from somewhere else in the program — this is how selection (IF) and loops are implemented in machine code. A common error is to say the PC holds "the current instruction"; it holds an **address**, and it is the address of the **next** instruction.

The **Memory Address Register (MAR)** holds the **address of the memory location that is about to be read from or written to**. Its output is connected to the **address bus**, so whatever is placed in the MAR is the address that memory sees. Both instruction addresses (copied from the PC) and data addresses (taken from the operand of an instruction such as LDD 50) pass through the MAR.

The **Memory Data Register (MDR)**, also called the **Memory Buffer Register (MBR)**, holds the **data or instruction that has just been read from memory, or that is about to be written to memory**. It is connected to the **data bus** and acts as a buffer between the fast CPU and the slower memory: data arriving from memory waits in the MDR until the CPU copies it onwards.

The **Current Instruction Register (CIR)** holds the **instruction that is currently being decoded and executed**. Once the instruction has been copied from the MDR into the CIR, the MDR is free to be used again — for example to fetch the data that the instruction needs — while the control unit keeps the instruction safely in the CIR. The control unit splits the contents of the CIR into the **opcode** (what to do) and the **operand** (what to do it with, often an address).

The **Accumulator (ACC)** is a general working register connected to the ALU. It holds **one of the values used in a calculation and the result** of the calculation. For example, ADD 51 adds the contents of address 51 to the value in the ACC and leaves the sum in the ACC.

The **Status Register (SR)** holds individual bits called **flags**, each recording a fact about the last operation: the **zero** flag (the result was 0), **negative** flag (the result was negative), **carry** flag (a carry came out of the most significant bit), **overflow** flag (the result was too big for the register) and an **interrupt** flag (interrupts are enabled or an interrupt is waiting). Conditional jumps, such as "jump if zero", look at these flags.

The **Index Register (IX)** is used in **indexed addressing**: the effective address is the operand **plus** the contents of IX, which makes it easy to step through the elements of an array in a loop.

:::compare Special-purpose registers
| Register | Full name | Holds | Connected to |
|---|---|---|---|
| **PC** | Program Counter | The **address of the next instruction** to be fetched | Copies to the MAR; incremented each fetch |
| **MAR** | Memory Address Register | The **address** of the memory location to be read or written | **Address bus** |
| **MDR / MBR** | Memory Data (Buffer) Register | The **data or instruction** just read from memory or about to be written | **Data bus** |
| **CIR** | Current Instruction Register | The **instruction** currently being decoded and executed | Control unit (decoder) |
| **ACC** | Accumulator | Values used in calculations and the **result** from the ALU | ALU |
| **SR** | Status register | **Flags**: zero, negative, carry, overflow, interrupt | ALU, control unit |
| **IX** | Index register | A value added to an address for **indexed addressing** | Address calculation |
:::

:::svg Registers inside the CPU and their connections to the buses
<svg class="bus" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inside a large CPU box: the PC feeds the MAR; the MAR connects out to the address bus. The MDR connects to the data bus in both directions and copies into the CIR. The CIR feeds the control unit, which sends control signals out on the control bus. The ACC and the status register sit next to the ALU, which exchanges values with the MDR. Outside the CPU on the right, main memory is connected to all three buses.">
  <style>
    svg.bus .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bus .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bus .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bus .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bus .wr{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.bus .ab{stroke:var(--primary);stroke-width:3;fill:none}
    svg.bus .db{stroke:var(--success);stroke-width:3;fill:none}
    svg.bus .cb{stroke:var(--warning);stroke-width:3;fill:none;stroke-dasharray:6 4}
    svg.bus .in{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="busC1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="busC2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
    <marker id="busC3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--warning)"/></marker>
    <marker id="busC4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <rect class="bx" x="14" y="14" width="500" height="302" rx="12"/><text class="h" x="30" y="38">CPU</text>
  <rect class="pb" x="40" y="56" width="120" height="48" rx="6"/><text class="h" x="100" y="78" text-anchor="middle">PC</text><text class="s" x="100" y="96" text-anchor="middle">next address</text>
  <rect class="pb" x="240" y="56" width="120" height="48" rx="6"/><text class="h" x="300" y="78" text-anchor="middle">MAR</text><text class="s" x="300" y="96" text-anchor="middle">address in use</text>
  <line class="in" x1="160" y1="80" x2="236" y2="80" marker-end="url(#busC4)"/>
  <rect class="ok" x="240" y="140" width="120" height="48" rx="6"/><text class="h" x="300" y="162" text-anchor="middle">MDR</text><text class="s" x="300" y="180" text-anchor="middle">data / instruction</text>
  <rect class="bx" x="40" y="140" width="120" height="48" rx="6"/><text class="h" x="100" y="162" text-anchor="middle">CIR</text><text class="s" x="100" y="180" text-anchor="middle">current instruction</text>
  <line class="in" x1="240" y1="164" x2="164" y2="164" marker-end="url(#busC4)"/>
  <rect class="wr" x="40" y="236" width="120" height="56" rx="6"/><text class="h" x="100" y="260" text-anchor="middle">Control unit</text><text class="s" x="100" y="279" text-anchor="middle">decodes</text>
  <line class="in" x1="100" y1="188" x2="100" y2="232" marker-end="url(#busC4)"/>
  <rect class="bx" x="200" y="236" width="80" height="56" rx="6"/><text class="h" x="240" y="268" text-anchor="middle">ALU</text>
  <rect class="bx" x="300" y="226" width="90" height="34" rx="6"/><text class="t" x="345" y="248" text-anchor="middle">ACC</text>
  <rect class="bx" x="300" y="268" width="90" height="34" rx="6"/><text class="t" x="345" y="290" text-anchor="middle">Status</text>
  <line class="in" x1="280" y1="252" x2="296" y2="246" marker-start="url(#busC4)" marker-end="url(#busC4)"/>
  <line class="in" x1="300" y1="192" x2="250" y2="232" marker-start="url(#busC4)" marker-end="url(#busC4)"/>
  <line class="ab" x1="360" y1="80" x2="586" y2="80" marker-end="url(#busC1)"/><text class="t" x="470" y="72" text-anchor="middle">address bus</text>
  <line class="db" x1="366" y1="164" x2="582" y2="164" marker-start="url(#busC2)" marker-end="url(#busC2)"/><text class="t" x="470" y="156" text-anchor="middle">data bus</text>
  <path class="cb" d="M160 300 L420 300 L420 250 L586 250" marker-end="url(#busC3)"/><text class="t" x="500" y="242" text-anchor="middle">control bus</text>
  <rect class="ok" x="590" y="50" width="156" height="230" rx="10"/><text class="h" x="668" y="160" text-anchor="middle">Main memory</text><text class="s" x="668" y="180" text-anchor="middle">instructions + data</text>
</svg>
:::

## Register transfer notation

Exam questions describe the cycle in **register transfer notation (RTN)**, a short way of writing "copy this into that". It has only three symbols to learn:

:::tip Register transfer notation
- **←** means "is copied into" (the value on the right is copied into the register on the left; the right-hand side keeps its value).
- **[ ]** means "**the contents of**": `[PC]` = the value stored in the PC.
- **[[MAR]]** means "the contents of the **memory location** whose address is in the MAR".
:::

So `MAR ← [PC]` reads "the contents of the PC are copied into the MAR", and `MDR ← [[MAR]]` reads "the contents of the memory location whose address is held in the MAR are copied into the MDR" — in other words, a memory read. `PC ← [PC] + 1` reads "the PC is given its own value plus one". Writing `MAR ← PC` without brackets is not correct, because it would mean the register itself rather than the value it holds.

:::example Worked example — reading register transfer notation
Before the step: PC = **120**, MAR = 0, memory location 120 holds the instruction **ADD 300**.
| RTN | Read aloud | After the step |
|---|---|---|
| MAR ← [PC] | Copy the contents of the PC into the MAR | MAR = 120, PC still 120 |
| PC ← [PC] + 1 | Add 1 to the contents of the PC | PC = 121 |
| MDR ← [[MAR]] | Copy the contents of the location whose address is in the MAR into the MDR | MDR = ADD 300 |
| CIR ← [MDR] | Copy the contents of the MDR into the CIR | CIR = ADD 300 |
In each step the source keeps its value — "copy", not "move".
:::

# The fetch–decode–execute cycle
@lo 12.3.2.5

:::definition Instruction cycle (fetch–decode–execute)
The sequence of steps the CPU repeats **for every instruction**: **fetch** the next instruction from memory into the CPU, **decode** it to work out what it means, and **execute** it. The cycle is repeated continuously while the computer is switched on.
:::

The **stored-program concept** (von Neumann) says that a program's instructions are kept in main memory, in binary, alongside the data, and are fetched and executed **one at a time, in sequence**. The fetch–decode–execute cycle (in the curriculum sometimes called sampling–decoding–execution) is the mechanism that makes this happen. Its three stages always come in the same order, and each stage uses particular registers and buses.

## Stage 1 — fetch

The goal of the fetch stage is to bring the next instruction from memory into the CIR.

:::steps The fetch stage in register transfer notation
- **MAR ← [PC]** — the address of the next instruction is copied from the PC to the MAR and placed on the **address bus**.
- **PC ← [PC] + 1** — the PC is **incremented** so it points to the following instruction. (If each instruction occupies several memory locations, the PC is increased by the instruction's length.)
- **MDR ← [[MAR]]** — the control unit sends a **memory read** signal on the **control bus**; the instruction at that address travels along the **data bus** into the MDR.
- **CIR ← [MDR]** — the instruction is copied into the CIR, ready for decoding.
:::

Why is the PC incremented **during** the fetch rather than at the end? Because the PC has already done its job once its value is in the MAR, so it can be updated straight away while the slower memory read is in progress — two things happen in parallel and a clock cycle is saved. It also means that, if the instruction turns out to be a jump, the execute stage can simply overwrite the PC with the new address.

## Stage 2 — decode

In the decode stage the **control unit** examines the instruction in the CIR. The instruction is a binary pattern made of two parts. The **opcode** is the part that says **what operation** to perform — load, store, add, compare, jump. The **operand** is the part that says **what to perform it on** — a value, or more often an address. The instruction decoder in the control unit recognises the opcode and works out which sequence of control signals is needed to carry it out. It also works out the **addressing mode** — whether the operand is the data itself (immediate), the address of the data (direct), and so on — and therefore whether more data has to be fetched from memory before the operation can be done.

:::definition Opcode and operand
The **opcode** is the part of a machine-code instruction that specifies the **operation** to be performed (e.g. LDD, ADD, JMP). The **operand** is the part that specifies the **data** to be used or the **address** of that data.
:::

## Stage 3 — execute

In the execute stage the control unit sends control signals to carry the instruction out. What happens depends on the instruction:

- A **load** instruction (e.g. LDD 50) puts the operand in the MAR, performs a memory read, and copies the value from the MDR into the ACC.
- A **store** instruction (STO 51) puts the address in the MAR and the ACC's value in the MDR, then sends a **memory write** signal.
- An **arithmetic or logic** instruction (ADD 52) fetches the value if necessary, then the **ALU** combines it with the ACC and the result is stored in the ACC; the status flags are updated.
- A **jump** instruction (JMP 10) copies the operand into the **PC**, so the next fetch comes from address 10. A conditional jump (JPE, "jump if equal") only does this if the right flag is set.
- An **input/output** instruction transfers data to or from a device port using the buses.

After execution the CPU checks for **interrupts**, and then the cycle begins again with the new value of the PC.

:::mermaid The instruction cycle
flowchart TB
  F[FETCH: MAR gets PC, PC incremented, MDR gets instruction, CIR gets MDR] --> D[DECODE: control unit splits opcode and operand]
  D --> E[EXECUTE: ALU calculates, data moved, or PC changed by a jump]
  E --> I{Interrupt waiting?}
  I -- no --> F
  I -- yes --> S[Save registers, run interrupt service routine, restore]
  S --> F
:::

:::svg The fetch stage: the instruction address goes out on the address bus and the instruction comes back on the data bus
<svg class="bus" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four numbered steps across the CPU. Step 1: PC value 20 is copied into the MAR, which sends 20 along the address bus to memory. Step 2: the PC becomes 21. Step 3: memory sends the instruction LDD 50 from address 20 along the data bus into the MDR after a read signal on the control bus. Step 4: the MDR copies LDD 50 into the CIR.">
  <style>
    svg.bus .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bus .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.bus .n{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.bus .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.bus .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.bus .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.bus .ab{stroke:var(--primary);stroke-width:3;fill:none}
    svg.bus .db{stroke:var(--success);stroke-width:3;fill:none}
    svg.bus .cb{stroke:var(--warning);stroke-width:3;fill:none;stroke-dasharray:6 4}
    svg.bus .in{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="busD1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="busD2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
    <marker id="busD3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--warning)"/></marker>
    <marker id="busD4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <rect class="bx" x="14" y="14" width="450" height="270" rx="12"/><text class="h" x="30" y="38">CPU</text>
  <rect class="pb" x="40" y="60" width="140" height="56" rx="6"/><text class="h" x="110" y="82" text-anchor="middle">PC</text><text class="m" x="110" y="104" text-anchor="middle">20 → 21</text>
  <rect class="pb" x="280" y="60" width="140" height="56" rx="6"/><text class="h" x="350" y="82" text-anchor="middle">MAR</text><text class="m" x="350" y="104" text-anchor="middle">20</text>
  <line class="in" x1="180" y1="88" x2="276" y2="88" marker-end="url(#busD4)"/><text class="n" x="228" y="80" text-anchor="middle">1</text>
  <text class="n" x="110" y="134" text-anchor="middle">2: PC ← [PC] + 1</text>
  <rect class="ok" x="280" y="170" width="140" height="56" rx="6"/><text class="h" x="350" y="192" text-anchor="middle">MDR</text><text class="m" x="350" y="214" text-anchor="middle">LDD 50</text>
  <rect class="bx" x="40" y="170" width="140" height="56" rx="6"/><text class="h" x="110" y="192" text-anchor="middle">CIR</text><text class="m" x="110" y="214" text-anchor="middle">LDD 50</text>
  <line class="in" x1="280" y1="198" x2="184" y2="198" marker-end="url(#busD4)"/><text class="n" x="230" y="190" text-anchor="middle">4</text>
  <text class="s" x="110" y="252" text-anchor="middle">then: decode, execute</text>
  <line class="ab" x1="420" y1="88" x2="566" y2="88" marker-end="url(#busD1)"/><text class="t" x="494" y="80" text-anchor="middle">1 address 20</text>
  <line class="cb" x1="420" y1="140" x2="566" y2="140" marker-end="url(#busD3)"/><text class="t" x="494" y="132" text-anchor="middle">3 READ</text>
  <line class="db" x1="566" y1="198" x2="424" y2="198" marker-end="url(#busD2)"/><text class="t" x="494" y="190" text-anchor="middle">3 instruction</text>
  <rect class="bx" x="570" y="40" width="176" height="230" rx="10"/><text class="h" x="658" y="64" text-anchor="middle">Main memory</text>
  <rect class="pb" x="586" y="80" width="144" height="30" rx="4"/><text class="m" x="658" y="100" text-anchor="middle">20: LDD 50</text>
  <rect class="bx" x="586" y="114" width="144" height="30" rx="4"/><text class="m" x="658" y="134" text-anchor="middle">21: ADD 51</text>
  <rect class="bx" x="586" y="148" width="144" height="30" rx="4"/><text class="m" x="658" y="168" text-anchor="middle">22: STO 52</text>
  <rect class="bx" x="586" y="196" width="144" height="30" rx="4"/><text class="m" x="658" y="216" text-anchor="middle">50: 37</text>
  <rect class="bx" x="586" y="230" width="144" height="30" rx="4"/><text class="m" x="658" y="250" text-anchor="middle">51: 5</text>
</svg>
:::

:::example Worked example — executing LDD 50 (load the contents of address 50)
PC = **20**, memory address 20 holds the instruction **LDD 50**, address 50 holds **37**.
| Step | Stage | Notation | Result |
|---|---|---|---|
| 1 | Fetch | MAR ← [PC] | MAR = 20 |
| 2 | Fetch | PC ← [PC] + 1 | PC = 21 |
| 3 | Fetch | MDR ← [[MAR]] | MDR = LDD 50 |
| 4 | Fetch | CIR ← [MDR] | CIR = LDD 50 |
| 5 | Decode | CU splits the CIR | Opcode LDD (load direct), operand 50 |
| 6 | Execute | MAR ← 50 | MAR = 50 |
| 7 | Execute | MDR ← [[MAR]] | MDR = 37 |
| 8 | Execute | ACC ← [MDR] | ACC = 37 |
The next cycle fetches from address 21 (ADD 51): after it, ACC = 37 + 5 = **42**.
:::

:::compare What each stage does
| | Fetch | Decode | Execute |
|---|---|---|---|
| Purpose | Bring the next instruction into the CPU | Work out what the instruction means | Carry the instruction out |
| Registers used | PC, MAR, MDR, CIR | CIR, control unit (decoder) | Depends on instruction: MAR, MDR, ACC, ALU, PC, status register |
| Buses used | Address bus, control bus (read), data bus | None (all inside the CPU) | Address, data and control buses if memory or I/O is used |
| Example result | CIR = LDD 50, PC = 21 | Opcode = LDD, operand = 50 | ACC = 37 |
:::

# Interrupts
@lo 12.3.2.5

## What an interrupt is and why it is needed

A CPU that only ever followed its program in order would have no way to notice that something important had happened elsewhere: a key being pressed, a network packet arriving, a printer running out of paper, or a program trying to divide by zero. One option is **polling** — the program repeatedly asks every device "do you need anything?" — but this wastes enormous amounts of processor time, because most of the time the answer is "no". The better solution is the **interrupt**: the device itself sends a signal to the CPU when, and only when, it needs attention.

:::definition Interrupt
A **signal** from hardware or software (e.g. a key pressed, printer out of paper, a timer, a program error) telling the CPU that something **needs attention**. At the end of each cycle the CPU checks for interrupts; if one has a higher priority than the current task, it **saves the registers**, runs the **interrupt service routine (ISR)** and then **restores** the registers and continues.
:::

:::compare Types of interrupt
| Type | Caused by | Examples |
|---|---|---|
| **Hardware interrupt** | A device controller, via an interrupt line on the **control bus** | Key pressed, mouse moved, data arrived from the network, printer out of paper, disk transfer finished |
| **Software interrupt** | The running program or the operating system | A program requests an OS service (open a file); division by zero; an illegal instruction |
| **Timer interrupt** | The system clock / timer chip at regular intervals | The OS switches to another program (multitasking) |
| **Hardware failure** | Faults detected by the hardware | Power failure warning, memory parity error |
:::

## How the CPU deals with an interrupt

Interrupts are only checked at a safe moment — at the **end of each fetch–decode–execute cycle**, after the current instruction has completely finished. This guarantees that no instruction is left half-done.

:::steps Handling an interrupt
- A device sends an **interrupt request** on the **control bus**; a bit is set in the interrupt register / status register.
- At the end of the current cycle the CPU **checks** for interrupts. If interrupts are enabled and the new interrupt has **higher priority** than the current task, it is serviced; otherwise it waits.
- The CPU **saves the contents of its registers** — above all the **PC** — onto the **stack** in memory, so the interrupted program can be resumed later.
- The **address of the interrupt service routine (ISR)** for that interrupt is loaded into the **PC** (often from an interrupt vector table).
- The fetch–decode–execute cycle continues as normal, but now it fetches and executes the **ISR**, which deals with the event (e.g. reads the key code).
- When the ISR ends, the saved register values are **restored** from the stack, and the original program **continues** exactly where it stopped.
:::

The key idea is that the interrupt does not need any new "magic" inside the CPU: it simply changes the value of the PC so that the normal cycle starts running different instructions, and the saved registers make it possible to come back. Because a high-priority interrupt (such as a power failure warning) can interrupt a lower-priority ISR, interrupts are given **priorities**, and lower-priority requests wait in turn.

:::example Worked example — a printer interrupt during a calculation
A program is adding up the marks of a class. The PC holds **305** and the ACC holds a running total of **412**. The printer controller finishes printing a page and sends an interrupt.
1. The CPU completes the instruction it is executing (the ADD at address 304).
2. It checks for interrupts and finds the printer interrupt, which has higher priority than the user program.
3. It saves PC = 305, ACC = 412 and the status flags on the **stack**.
4. The PC is loaded with the address of the printer ISR, say **8 000**; the ISR sends the next page of data to the printer's buffer.
5. At the end of the ISR, PC = 305 and ACC = 412 are **restored**, and the next fetch is from address 305.
The marks program never "knows" it was interrupted, and the printer is kept busy without the CPU wasting time polling it.
:::

:::compare Polling vs interrupts
| | Polling | Interrupts |
|---|---|---|
| How a device gets attention | The CPU repeatedly checks the device's status | The device sends a signal on the control bus |
| CPU time | Wasted checking devices that have nothing to report | Used only when an event actually happens |
| Response time | Depends on how often the device is checked | Fast — serviced at the end of the current cycle |
| Complexity | Simple | Needs saving/restoring registers, priorities and ISRs |
:::

:::warning Common mistakes
- Writing **MDR ← [PC]** — the PC's value goes to the **MAR**.
- Saying the PC holds the **current** instruction — it holds the **address** of the **next** one; the current instruction is in the **CIR**.
- Forgetting the brackets: **[[MAR]]** means memory contents, **[MAR]** means the register's contents.
- Saying an interrupt is handled "immediately, in the middle of an instruction" — it is checked at the **end of the cycle**.
- Forgetting to say the registers (PC) are **saved** before the ISR and **restored** after it.
:::

# Exam practice: the instruction cycle
@lo 12.3.2.5

:::example Exam-style questions with model answers
**Q: State the purpose of the PC, MAR and CIR. [3]**
PC holds the **address of the next instruction** to be fetched (1); MAR holds the **address of the location** to be read from or written to (1); CIR holds the **instruction being decoded/executed** (1).

**Q: The notation has errors: MDR ← [PC]; PC ← [PC] + 2; CIR ← [MAR]. Correct them. [3]**
**MAR ← [PC]** (1); **PC ← [PC] + 1** (1); **CIR ← [MDR]** (1).

**Q: Explain what happens in the fetch stage. [4]**
The address in the **PC** is copied to the **MAR** (1); the PC is **incremented** (1); the instruction at that address is read along the data bus into the **MDR** (1) and then copied into the **CIR** (1).

**Q: Explain what happens in the decode and execute stages. [4]**
Decode: the **control unit** examines the instruction in the CIR (1) and splits it into **opcode and operand** (1). Execute: the control unit sends **control signals** to carry out the operation (1), e.g. the ALU performs a calculation and stores the result in the ACC / the PC is changed by a jump (1).

**Q: Explain how the CPU deals with an interrupt. [4]**
At the end of a cycle the CPU **checks** for interrupts (1); if its priority is higher, the **registers / PC are saved** on the stack (1); the address of the **ISR** is loaded into the PC and the ISR is executed (1); the registers are **restored** and the original program continues (1).
:::

:::warning Common mistakes in exam answers
- In "describe the fetch stage" questions give **four** steps and name the register at each step; "it gets the instruction from memory" earns nothing.
- Decode is done by the **control unit**, not the ALU.
- In trace questions remember that the PC is already incremented **before** the instruction executes.
:::

:::steps Check yourself
- State the purpose of PC, MAR, MDR, CIR, ACC and the status register.
- Explain what [PC] and [[MAR]] mean.
- Write the fetch stage in register transfer notation.
- What are the opcode and operand, and which component separates them?
- Trace LDD 75 starting with PC = 40.
- What is an interrupt, when does the CPU check for one and what happens next?
:::

# Clock speed
@lo 12.3.2.6

## Measuring how fast a CPU works

When people compare computers they often quote one number — "a 3.5 GHz processor". That number is the **clock speed**, and it is only one of several factors that decide how quickly a CPU really works. The curriculum asks you to explain three of them in detail — **clock rate, word length and bus width** — and to understand how they combine with others, such as the **number of cores** and the size of the **cache**. Performance in the end means **how many instructions the CPU can complete per second** and **how much data it can process and move per second**. Each factor affects one part of that.

:::definition Clock speed (clock rate)
The **number of clock cycles (pulses) the CPU's clock produces per second**, measured in **hertz (Hz)**. 1 GHz = 1 000 000 000 cycles per second. Each step of the fetch–decode–execute cycle starts on a clock pulse.
:::

## How the clock controls the CPU

The clock is a crystal-controlled oscillator that produces a square wave: the voltage switches between low and high at a perfectly regular rate. Each rising edge of the wave is a "tick", and on each tick the registers, ALU and buses take their next step. Copying the PC into the MAR, sending the read signal, latching the data into the MDR — each of these is timed by the clock. The time for one cycle is the reciprocal of the frequency:

$$t_{\text{cycle}} = \frac{1}{f} \qquad \text{e.g. } \frac{1}{3 \times 10^{9}\ \text{Hz}} \approx 0.33\ \text{ns}$$ | The duration of one clock cycle

An instruction needs a certain number of cycles to complete — for example 4 for a simple load (as in the fetch stage of lesson 2), more for a multiplication or a memory access that misses the cache. If the clock runs **faster**, each cycle is **shorter**, so every instruction finishes sooner and **more instructions are executed per second**. Doubling the clock speed from 1.5 GHz to 3 GHz halves the length of a cycle and, in the ideal case, doubles the number of instructions completed per second.

:::svg A faster clock gives shorter cycles: in the same time the 2 GHz clock completes twice as many cycles as the 1 GHz clock
<svg class="bus" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two square waves over the same 4 nanosecond time span. The upper wave, 1 gigahertz, has 4 cycles of 1 nanosecond each. The lower wave, 2 gigahertz, has 8 cycles of 0.5 nanoseconds each. A label says: in 4 ns, 1 GHz executes 4 cycles and 2 GHz executes 8 cycles.">
  <style>
    svg.bus .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bus .w1{stroke:var(--primary);stroke-width:3;fill:none}
    svg.bus .w2{stroke:var(--success);stroke-width:3;fill:none}
    svg.bus .ax{stroke:var(--border);stroke-width:1.5;fill:none}
  </style>
  <text class="h" x="20" y="30">1 GHz — cycle = 1 ns</text>
  <path class="w1" d="M140 90 L140 50 L215 50 L215 90 L290 90 L290 50 L365 50 L365 90 L440 90 L440 50 L515 50 L515 90 L590 90 L590 50 L665 50 L665 90 L740 90"/>
  <text class="h" x="20" y="130">2 GHz — cycle = 0.5 ns</text>
  <path class="w2" d="M140 190 L140 150 L177 150 L177 190 L215 190 L215 150 L252 150 L252 190 L290 190 L290 150 L327 150 L327 190 L365 190 L365 150 L402 150 L402 190 L440 190 L440 150 L477 150 L477 190 L515 190 L515 150 L552 150 L552 190 L590 190 L590 150 L627 150 L627 190 L665 190 L665 150 L702 150 L702 190 L740 190"/>
  <line class="ax" x1="140" y1="210" x2="740" y2="210"/>
  <text class="s" x="140" y="228" text-anchor="middle">0</text><text class="s" x="290" y="228" text-anchor="middle">1 ns</text><text class="s" x="440" y="228" text-anchor="middle">2 ns</text><text class="s" x="590" y="228" text-anchor="middle">3 ns</text><text class="s" x="740" y="228" text-anchor="end">4 ns</text>
  <text class="t" x="20" y="70">4 cycles</text><text class="t" x="20" y="170">8 cycles</text>
  <text class="s" x="20" y="246">Same time span: twice the frequency → twice as many cycles → (ideally) twice as many instructions.</text>
</svg>
:::

## The limits of clock speed

If faster clocks always meant faster computers, manufacturers would simply keep raising the frequency. They stopped doing so in the mid-2000s, at about 3–5 GHz, for three reasons.

- **Heat and power.** Every time a transistor switches it uses a little energy, which becomes heat. A higher clock speed means more switches per second and therefore more heat. Without powerful cooling the chip can **overheat**, become unreliable and be damaged; most modern CPUs protect themselves by **thermal throttling** — automatically lowering the clock speed when they get too hot. In a laptop or phone, higher power also drains the battery faster.
- **Waiting for memory.** A faster clock only helps if the CPU has something to do on each cycle. Main memory is much slower than the processor, so if an instruction must wait for data from RAM, a faster clock just means **more cycles spent waiting**. This is the von Neumann bottleneck again: bus width and cache matter as much as frequency.
- **Signals need time.** Electrical signals take time to cross the chip and to settle; if the cycle is too short, a value may not be ready when the next tick arrives, and the CPU produces errors.

**Overclocking** means running a CPU above its rated clock speed. It gives extra performance for games or rendering, but increases heat and power use, may make the system **unstable** (random crashes) and can shorten the life of the processor or void its warranty.

:::compare Increasing the clock speed: advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| More clock cycles per second → **more instructions executed per second** | More **heat** is produced → needs better cooling; risk of overheating / damage |
| Each step of the fetch–decode–execute cycle takes **less time** | More **power** used → shorter battery life in laptops and phones |
| Programs and calculations finish **sooner** | Gains are limited if the CPU must **wait for memory** or the bus |
| No change to software is needed | Above the rated speed (overclocking) the system can become **unstable** |
:::

:::example Worked example — clock speed calculations
**a)** A CPU runs at **2.5 GHz**. How long is one clock cycle?
1 ÷ (2.5 × 10⁹) = 0.4 × 10⁻⁹ s = **0.4 ns**.

**b)** Each instruction in a program takes on average **4 cycles**. How many instructions per second can the CPU execute?
2.5 × 10⁹ ÷ 4 = **625 million instructions per second**.

**c)** The same program needs 2 × 10⁹ instructions. How long does it take at 2.5 GHz, and at 4 GHz?
At 2.5 GHz: 2 × 10⁹ ÷ 625 × 10⁶ = **3.2 s**. At 4 GHz: 4 × 10⁹ ÷ 4 = 10⁹ instructions/s, so **2 s** — if memory can keep up.
:::

# Word length and bus width
@lo 12.3.2.6

## Word length

A **word** is the natural unit of data a processor works with: the number of bits that the ALU processes in one operation and that each general-purpose register holds. Common word lengths are 8 bits (small microcontrollers), 16, 32 and 64 bits (modern PCs and smartphones). When a computer is called "64-bit", it is its word length that is meant.

:::definition Word length
The **number of bits the CPU can process as a single unit** in one operation — the size of its registers and of the values handled by the ALU (e.g. 32 or 64 bits).
:::

Word length affects performance in several ways.

- **Size of numbers handled in one step.** An 8-bit ALU can add numbers up to 255 in one operation. To add two 32-bit numbers it must split them into four bytes, add them one pair at a time and pass the carry along — **four** instructions or more instead of one. A 32-bit CPU does it in **one**. Larger word lengths therefore mean **fewer instructions** for the same calculation.
- **Precision.** A longer word can hold numbers with more significant digits, which matters for scientific calculations and graphics.
- **Instructions per fetch.** If the data bus matches the word length, a whole instruction or number arrives in one transfer.
- **Addressing.** Registers that hold addresses (the PC, MAR) are normally one word long, so 64-bit processors can work with much larger addresses and more memory than 32-bit ones.

A longer word length is not free: wider registers, ALU and buses mean a bigger, more expensive and more power-hungry chip, and programs written for 64 bits may use more memory because pointers and integers are larger. It also only helps if the software is written (compiled) for that word length; a 32-bit program running on a 64-bit processor does not gain the full benefit.

:::example Worked example — adding two large numbers
A shop's till adds two sales totals: **150 000 ₸ + 98 500 ₸**. Each total needs **18 bits** (2¹⁸ = 262 144).
- On an **8-bit** CPU each number must be stored in **3 bytes**. The addition needs 3 separate byte additions, each passing a carry to the next — at least **3 add instructions**, plus loads and stores for each byte.
- On a **16-bit** CPU each number still does not fit in one word (maximum 65 535), so it needs **2** additions.
- On a **32-bit** CPU each number fits in **one word**, and the sum 248 500 is produced by **one** ADD instruction.
The longer word length gives the same answer with fewer instructions, so the program runs faster.
:::

## Bus width

Lesson 1 introduced the width of a bus as the number of lines it has. Here we look at its effect on performance. Two widths matter.

The **data bus width** is the **number of bits that can be transferred at the same time** between the CPU and memory or I/O. It decides how many **transfers** are needed to move a block of data. Every transfer takes time — at least one bus cycle — so halving the number of transfers roughly halves the time spent moving data. A wider data bus therefore raises the **bandwidth** (data transferred per second) and reduces the time the CPU spends waiting for instructions and data. When the data bus is narrower than the word length, every word needs several transfers — for instance an older 32-bit processor with a 16-bit data bus needed two bus cycles to fetch each 32-bit instruction.

$$\text{bandwidth} = \text{data bus width (bytes)} \times \text{bus frequency (transfers per second)}$$ | Maximum data transfer rate of a bus

The **address bus width** decides **how many memory locations can be addressed** (2ⁿ). It does not change the speed of a single transfer, but it affects performance indirectly: a computer that can address more RAM can keep more programs and data in main memory instead of on the much slower disk, so it relies less on **virtual memory** and swapping. A 32-bit address bus limits the computer to 4 GiB; a modern 64-bit system with more address lines can use 16, 32 or 64 GiB and more.

:::definition Bandwidth (data transfer rate)
The **amount of data that can be transferred per second** along a bus. It depends on the **width** of the data bus and the **number of transfers per second** (the bus clock).
:::

:::compare Word length, data bus width and address bus width
| | Word length | Data bus width | Address bus width |
|---|---|---|---|
| What it is | Bits the CPU **processes** in one operation | Bits **transferred** at once between CPU and memory/I/O | Number of **address lines** |
| Effect of increasing it | Larger numbers / more data handled per instruction → fewer instructions | More data per transfer → fewer transfers, higher bandwidth | **More memory** can be addressed (2ⁿ) → less use of virtual memory |
| Example | 64-bit CPU adds two 64-bit numbers in one instruction | 64-bit bus moves 8 bytes per transfer instead of 4 | 32 lines → 4 GiB; 33 lines → 8 GiB |
| Does it change speed directly? | Yes — fewer instructions | Yes — fewer transfers | Indirectly — more RAM available |
:::

:::svg The same 16 bytes of data moved over an 8-bit, a 32-bit and a 64-bit data bus
<svg class="bus" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three rows. An 8-bit data bus moves 16 bytes in 16 transfers, drawn as 16 small boxes of one byte each. A 32-bit data bus moves the same 16 bytes in 4 transfers of 4 bytes. A 64-bit data bus moves them in 2 transfers of 8 bytes.">
  <style>
    svg.bus .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.bus .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.bus .b1{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.bus .b2{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.bus .b3{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
  </style>
  <text class="h" x="20" y="30">Moving 16 bytes</text>
  <text class="t" x="20" y="72">8-bit bus</text>
  <g>
    <rect class="b1" x="140" y="52" width="30" height="30" rx="3"/><rect class="b1" x="174" y="52" width="30" height="30" rx="3"/><rect class="b1" x="208" y="52" width="30" height="30" rx="3"/><rect class="b1" x="242" y="52" width="30" height="30" rx="3"/>
    <rect class="b1" x="276" y="52" width="30" height="30" rx="3"/><rect class="b1" x="310" y="52" width="30" height="30" rx="3"/><rect class="b1" x="344" y="52" width="30" height="30" rx="3"/><rect class="b1" x="378" y="52" width="30" height="30" rx="3"/>
    <rect class="b1" x="412" y="52" width="30" height="30" rx="3"/><rect class="b1" x="446" y="52" width="30" height="30" rx="3"/><rect class="b1" x="480" y="52" width="30" height="30" rx="3"/><rect class="b1" x="514" y="52" width="30" height="30" rx="3"/>
    <rect class="b1" x="548" y="52" width="30" height="30" rx="3"/><rect class="b1" x="582" y="52" width="30" height="30" rx="3"/><rect class="b1" x="616" y="52" width="30" height="30" rx="3"/><rect class="b1" x="650" y="52" width="30" height="30" rx="3"/>
  </g>
  <text class="h" x="740" y="72" text-anchor="end">16</text>
  <text class="t" x="20" y="132">32-bit bus</text>
  <rect class="b2" x="140" y="112" width="132" height="30" rx="3"/><rect class="b2" x="276" y="112" width="132" height="30" rx="3"/><rect class="b2" x="412" y="112" width="132" height="30" rx="3"/><rect class="b2" x="548" y="112" width="132" height="30" rx="3"/>
  <text class="s" x="206" y="132" text-anchor="middle">4 bytes</text><text class="s" x="342" y="132" text-anchor="middle">4 bytes</text><text class="s" x="478" y="132" text-anchor="middle">4 bytes</text><text class="s" x="614" y="132" text-anchor="middle">4 bytes</text>
  <text class="h" x="740" y="132" text-anchor="end">4</text>
  <text class="t" x="20" y="192">64-bit bus</text>
  <rect class="b3" x="140" y="172" width="268" height="30" rx="3"/><rect class="b3" x="412" y="172" width="268" height="30" rx="3"/>
  <text class="s" x="274" y="192" text-anchor="middle">8 bytes</text><text class="s" x="546" y="192" text-anchor="middle">8 bytes</text>
  <text class="h" x="740" y="192" text-anchor="end">2</text>
  <text class="s" x="740" y="30" text-anchor="end">transfers</text>
  <text class="s" x="20" y="240">Each box is one bus transfer. Doubling the width halves the number of transfers for the same data.</text>
</svg>
:::

:::example Worked example — bandwidth of a data bus
A **64-bit** data bus runs at **100 MHz** and transfers one word per cycle.
1. Width in bytes: 64 ÷ 8 = **8 bytes** per transfer.
2. Transfers per second: 100 MHz = **100 000 000**.
3. Bandwidth: 8 × 100 000 000 = 800 000 000 bytes/s = **800 MB/s**.

If the bus were only **32 bits** wide at the same frequency, the bandwidth would be 4 × 100 000 000 = **400 MB/s**: loading a 200 MB game level would take 0.5 s instead of 0.25 s.
:::

# Cores, cache and overall performance
@lo 12.3.2.6

## Multiple cores

A **core** is a complete processing unit — its own control unit, ALU and registers — able to run its own fetch–decode–execute cycle. A **dual-core** chip has two, a **quad-core** four; modern phones have 8 and desktop processors 16 or more. Because each core executes instructions independently, a multi-core processor can work on **several instructions or tasks in parallel**: one core plays music, another runs the browser, two more render a video.

:::definition Core
An **independent processing unit within a CPU** that can fetch, decode and execute instructions on its own. A multi-core processor can therefore execute several streams of instructions **at the same time**.
:::

More cores do **not** multiply speed exactly. Doubling the cores from 2 to 4 rarely doubles performance, for three reasons. First, **some tasks cannot be split**: if each step needs the result of the step before, only one core can work on it while the others wait. Second, the software has to be written to divide its work into parallel **threads**; many older programs use only one core. Third, the cores **share** resources — the buses to memory, part of the cache — and spend time **communicating** and coordinating, so adding cores adds traffic on the same buses.

## Cache memory

**Cache** is a small amount of very fast memory (static RAM) built into or very close to the CPU. It stores copies of the instructions and data that have been used **recently** or are **likely to be used next** (for example the next instructions in a loop or the next elements of an array). When the CPU needs a value it looks in the cache first. If the value is there — a **cache hit** — it is delivered in a few cycles, without using the system bus at all. If it is not — a **cache miss** — it must be fetched from main memory over the bus, which may take a hundred cycles or more, and a copy is placed in cache for next time.

Cache is arranged in **levels**: L1 is the smallest and fastest (tens of KB per core), L2 is larger and slightly slower, and L3 is shared by all cores and several MB in size. A larger cache means more hits and fewer slow trips across the bus, so the CPU spends less time waiting and more time executing. This makes cache one of the most effective ways of reducing the **von Neumann bottleneck** described in lesson 1. The disadvantage is cost: cache uses much more chip area per bit than main memory, so it cannot be made very large.

:::definition Cache memory
A small, very fast memory **inside or close to the CPU** that stores **frequently and recently used instructions and data**, so that they can be accessed more quickly than from main memory.
:::

:::compare Factors that affect CPU performance
| Factor | Definition | Effect of increasing it |
|---|---|---|
| **Clock speed** (clock rate) | The **number of clock cycles per second**, in **hertz** (3.5 GHz = 3.5 billion cycles per second) | **More instructions** executed per second; the cycle happens faster. But more **heat** and power |
| **Word length** | The **number of bits the CPU can process as one unit** (e.g. 32 or 64 bits) | Larger numbers and **more data** processed in one operation; fewer instructions needed |
| **Data bus width** | The **number of bits the data bus can carry at one time** | **More data per transfer** → fewer transfers needed, higher bandwidth |
| **Address bus width** | The **number of lines** in the address bus | **More memory locations** can be addressed (2ⁿ) |
| **Number of cores** | Independent processing units on one chip | Several instructions / tasks processed **in parallel** — if the software can use them |
| **Cache size** | Very fast memory inside / near the CPU | Frequently used data found quickly → fewer slow RAM accesses over the bus |
:::

## Putting the factors together

The factors are not independent. A very high clock speed is wasted if the data bus is too narrow to deliver instructions fast enough; a 64-bit word length is wasted if every word needs two transfers over a 32-bit bus; four cores are wasted if they spend their time waiting for one shared memory bus. Designers therefore **balance** the factors, and when comparing processors you should consider them together and think about the **task**: a single-threaded game benefits most from clock speed and cache, video rendering from many cores, and large scientific calculations from a long word length and wide buses.

:::mermaid How the factors work together to give performance
flowchart LR
  C[Clock speed: cycles per second] --> P[Instructions completed per second]
  K[Number of cores: parallel streams] --> P
  W[Word length: work done per instruction] --> P
  B[Data bus width: bytes per transfer] --> D[Data delivered per second]
  H[Cache size: fewer slow memory trips] --> D
  D --> P
  A[Address bus width: memory available] --> R[Less swapping to disk]
  R --> P
:::

:::example Worked example — comparing two processors for a school computer lab
Processor X: **3.0 GHz**, 32-bit word, 32-bit data bus, 2 cores, 4 MB cache.
Processor Y: **3.0 GHz**, 64-bit word, 64-bit data bus, 4 cores, 8 MB cache.
1. **Clock speed** is the same, so each core completes cycles at the same rate.
2. **Word length**: Y processes 64 bits per operation, so calculations on large numbers need about half as many instructions.
3. **Data bus**: Y moves 8 bytes per transfer instead of 4 — twice the bandwidth at the same bus frequency.
4. **Cores**: Y can run four tasks at once (e.g. students using an IDE, a browser and a video call together); X only two.
5. **Cache**: Y's larger cache gives more hits and fewer waits for RAM.
Conclusion: Y should perform better, especially for multitasking and data-heavy programs, but it will **not** be exactly twice as fast, because not all tasks can use 4 cores and both still share the memory bus. Y is likely to cost more and use more power.
:::

:::warning Common mistakes
- Confusing **word length** (bits **processed** at once) with **bus width** (bits **transferred** at once).
- Saying a wider **data** bus increases the amount of memory — that is the **address** bus.
- Saying a higher clock speed "makes the computer store more" — it makes it **process faster**.
- Claiming that doubling the cores **doubles** the speed — tasks may not split, and cores share buses and memory.
- Describing an effect without the reason: "faster" should be followed by **why** (more cycles per second, fewer transfers, fewer instructions).
:::

# Exam practice: CPU performance
@lo 12.3.2.6

:::example Exam-style questions with model answers
**Q: Describe the effect of increasing the clock speed. [3]**
More clock cycles per second, so instructions are **executed faster** (1); the fetch–decode–execute cycle happens **more often** per second (1); more **heat** is produced, which may cause overheating / needs better cooling (1).

**Q: Explain how increasing the width of the data bus affects performance. [2]**
More bits are transferred **at the same time** (1), so **fewer transfers** are needed to move the same data / instructions and the CPU waits less (1).

**Q: Define word length and explain how a longer word length improves performance. [3]**
The number of bits the CPU can **process as one unit** (1); larger numbers / more data can be processed in **one operation** (1), so **fewer instructions** are needed (1).

**Q: A 64-bit data bus runs at 100 MHz and transfers one word per cycle. Calculate the bandwidth in MB/s. [2]**
64 ÷ 8 = 8 bytes per transfer (1); 8 × 100 000 000 = **800 MB/s** (1).

**Q: Explain why doubling the number of cores does not always double the performance. [2]**
Some tasks **cannot be split** into parallel parts / software is not written to use several cores (1); cores **share** buses, memory and cache and must **communicate**, which takes time (1).

**Q: Processor A: 2.4 GHz, 64-bit word, 8 MB cache. Processor B: 3.6 GHz, 32-bit word, 2 MB cache. Discuss which is more suitable for editing large video files. [4]**
B has the higher clock speed, so it executes **more cycles per second** (1); A has the longer word length, so it processes **more data per instruction** (1); A's larger cache means **fewer slow memory accesses** with large files (1); conclusion with reason, e.g. A, because video editing processes large amounts of data, so word length and cache matter more than clock speed (1).
:::

:::warning Common mistakes in exam answers
- "Discuss / compare" questions need **both** processors and a **conclusion** with a reason.
- Each factor must be linked to **why** it helps: more cycles per second, fewer transfers, fewer instructions, fewer RAM accesses.
- In bandwidth calculations convert **bits to bytes** (÷ 8) before multiplying.
:::

:::steps Check yourself
- Define clock speed and give the cycle time of a 2 GHz clock.
- Give two disadvantages of raising the clock speed.
- Define word length, and explain why a 64-bit CPU adds large numbers faster than an 8-bit one.
- Explain the difference between the effect of the data bus width and the address bus width.
- Calculate the bandwidth of a 32-bit bus at 200 MHz.
- Explain how cache and multiple cores affect performance, and their limits.
:::
