---
summary: The main functions of an operating system and the features of single-user, multi-user, single-tasking, multitasking, real-time, network and batch processing operating systems.
---
# What an operating system does
@lo 11.3.1.5

:::definition Operating system (OS)
System software that **manages the computer's hardware and software resources**, provides a **user interface**, and provides a **platform** on which application software runs.
:::

Without an OS, every application would need to contain its own code for controlling the screen, keyboard, disks and memory. The OS does this **once, for all programs**, and shares the hardware between them safely.

:::mermaid The OS sits between the applications and the hardware
flowchart TB
  U[User] <--> UI[User interface]
  UI <--> APP[Applications]
  APP <--> OS[Operating system kernel]
  OS <--> DRV[Device drivers]
  DRV <--> HW[Hardware: CPU, RAM, disks, devices]
:::

:::steps What happens when a computer is switched on (booting)
- The **BIOS / UEFI** firmware in ROM runs a **power-on self-test (POST)** of the hardware.
- It finds the storage device that holds the OS and runs the **bootstrap loader**.
- The bootstrap loader copies the OS **kernel** from secondary storage into **RAM**.
- The OS starts its services and drivers and shows the **log-in screen / user interface**.
:::

# The main functions of an operating system
@lo 11.3.1.5

:::cards
### Memory management
- **Allocates** RAM to each program and its data when it starts, and **frees** it when the program closes.
- **Protects** memory so one program cannot overwrite another program's data.
- Uses **virtual memory** (part of the disk used as RAM) when main memory is full.
### Processor (process) management
- Decides **which process uses the CPU** and for how long (**scheduling**).
- Switches between processes so that many programs appear to run at once (**multitasking**).
- Handles **interrupts** — signals from hardware or software that need the CPU's attention.
### File management
- Creates, names, opens, saves, copies, moves and deletes files.
- Organises files in a **hierarchical folder (directory) structure**.
- Records **where** each file is stored on the disk and controls **access rights** to files.
### Input/output and peripheral management
- Communicates with devices through **device drivers**.
- Uses **buffers** to hold data travelling between fast and slow devices.
- Uses **spooling** to queue print jobs so the CPU does not wait for the printer.
### Security and user management
- **User accounts**, **log-in** with user names and passwords / biometrics.
- **Access rights** (read, write, execute) to files and folders.
- Firewall, security updates, logging of activity.
### User interface
- Lets the user communicate with the computer: **GUI**, **command line**, menu, touch, voice.
- Displays error and status messages.
### Error handling
- Detects errors (a device not responding, a program crashing) and reports or recovers from them without stopping the whole system.
### Loading and running software
- **Loads** applications from storage into memory, starts and stops them, and provides services (system calls) they can use.
:::

:::example The OS at work — printing a document
1. The user clicks **Print** (user interface).
2. The OS **loads** the printer driver and places the document in the **print queue** (spooling).
3. While the printer prints, the **processor manager** lets the user continue typing (multitasking).
4. Data is sent to the printer through a **buffer** (I/O management).
5. If the printer runs out of paper, an **interrupt** is sent and the OS shows an error message (error handling).
:::

:::compare Memory management terms
| Term | Meaning |
|---|---|
| Allocation | Giving a program the memory it needs |
| Protection | Preventing a program from accessing another program's memory |
| Virtual memory | Using part of secondary storage as an extension of RAM |
| Paging | Memory divided into fixed-size blocks (pages) moved between RAM and disk |
| Thrashing | The computer slows down because pages are swapped too often |
:::

:::tip Describing a function
Name the function **and** say what the OS does: not just "memory management", but "*memory management — the OS allocates RAM to each program and stops programs from overwriting each other's memory*".
:::

# Single-user and multi-user operating systems
@lo 11.3.1.6

:::definition Single-user OS
An OS that allows **only one user** to use the computer **at a time**. Examples: Windows 11 or macOS on a personal laptop, Android on a phone.
:::

:::definition Multi-user OS
An OS that allows **many users** to use the computer's resources **at the same time**, usually from different terminals or over a network. Each user has an account, and the OS shares processor time, memory and storage between them. Examples: **UNIX / Linux servers**, mainframe OSs (z/OS), Windows Server.
:::

:::mermaid A multi-user system shares one powerful computer between many terminals
flowchart LR
  T1[Terminal 1] --> S[Mainframe or server running a multi-user OS]
  T2[Terminal 2] --> S
  T3[Terminal 3] --> S
  T4[Terminal 4] --> S
:::

:::compare Single-user vs multi-user OS
| Feature | Single-user | Multi-user |
|---|---|---|
| Users at the same time | One | Many |
| Hardware | Personal computer, laptop, phone | Mainframe, server, supercomputer |
| Resource sharing | All resources belong to one user | CPU time, memory and storage are shared fairly between users (**time-sharing**) |
| Security | Simpler — one account at a time | Must **keep users' data separate**; strong authentication and access rights |
| Complexity / cost | Simpler, cheaper | More complex, more expensive |
| If the computer fails | One user is affected | All users are affected |
| Examples | Windows 11 (home), macOS, Android | Linux / UNIX servers, z/OS, Windows Server |
:::

:::callout info Single-user can still have many accounts
A family laptop may have several **user accounts**, but only **one person** is logged in and using it at a time, so it is still a **single-user** OS in this classification.
:::

# Single-tasking and multitasking operating systems
@lo 11.3.1.7

:::definition Single-tasking OS
An OS that can run **only one program (task) at a time**. The next task starts only when the current one finishes. Examples: MS-DOS, the OS of a simple calculator or embedded device.
:::

:::definition Multitasking OS
An OS that can run **several programs at the same time**. The processor switches between tasks very quickly, giving each a short **time slice**, so they **appear** to run simultaneously. Examples: Windows, macOS, Linux, Android.
:::

:::ascii Time slicing — one CPU, three tasks (each block is one time slice)
CPU:  | Music | Browser | Editor | Music | Browser | Editor | Music | ...
time  --------------------------------------------------------------->
The switching happens many times per second, so the user sees all three programs running.
:::

:::steps How multitasking works
- Each running program is a **process** held in memory.
- The **scheduler** gives each process a **time slice** of CPU time (e.g. round-robin), often based on **priority**.
- When the time slice ends (or an interrupt occurs), the OS **saves the state** of the process (registers, program counter) and **loads** the next one — a **context switch**.
- The cycle repeats many times per second.
:::

:::compare Single-tasking vs multitasking
| Feature | Single-tasking | Multitasking |
|---|---|---|
| Programs at once | One | Several |
| CPU use | CPU is idle while the task waits for input/output | CPU is kept busy — another task runs while one waits |
| Memory | Needs little memory | Needs more memory — every running task is held in RAM |
| Complexity | Simple OS, few errors | Complex scheduling, memory protection |
| User experience | Must close one program to open another | Switch between programs; background tasks (downloads, music) |
| Speed of each task | Full CPU power for one task | Each task may run slower as the CPU is shared |
| Examples | MS-DOS, simple embedded devices | Windows, macOS, Linux, Android, iOS |
:::

:::warning Multitasking is not parallel processing
On a single-core processor, multitasking only **looks** simultaneous — the CPU runs **one** instruction stream at a time and switches quickly. A **multi-core** processor can really run tasks in parallel.
:::

:::compare The four combinations
| | Single-tasking | Multitasking |
|---|---|---|
| **Single-user** | MS-DOS | Windows 11 on a laptop, Android |
| **Multi-user** | Early batch mainframes | Linux / UNIX servers, mainframes |
:::

# Real-time operating systems
@lo 11.3.1.8

:::definition Real-time operating system (RTOS)
An OS that **processes inputs and responds within a guaranteed, very short time** (a deadline), so that it can **control** a physical process as it happens. Used in embedded and safety-critical systems.
:::

:::cards
### Features of an RTOS
- **Guaranteed response time** — inputs are processed within a fixed deadline (milliseconds or less).
- **Deterministic / predictable** — the same input always takes the same time to handle.
- **Priority-based, pre-emptive scheduling** — the most urgent task interrupts less urgent ones.
- **Continuously monitors sensors** and uses **feedback** to control actuators.
- **Very reliable**, runs non-stop for long periods; often has **fail-safe** / backup systems.
- **Small, efficient** and usually has a **minimal or no user interface**; often stored in ROM (embedded).
### Hard and soft real-time
- **Hard real-time** — missing a deadline is a **system failure** and may be dangerous: airbag control, aircraft autopilot, pacemaker, anti-lock brakes.
- **Soft real-time** — missing a deadline only **reduces quality**: video streaming, online games, ticket booking.
:::

:::mermaid An RTOS controls a process using a feedback loop
flowchart TB
  S[Sensor reads value] --> P[RTOS processes the input within the deadline]
  P --> A[Actuator acts]
  A --> E[Physical process changes]
  E --> S
:::

:::example Real-time systems
| System | Why real time is needed |
|---|---|
| **Car airbag** | Must inflate within about 30 ms of a crash being detected |
| **Anti-lock brakes (ABS)** | Must release and reapply the brakes many times a second |
| **Aircraft autopilot / flight control** | Must react instantly to changes in speed, height and wind |
| **Hospital patient monitor** | Must sound an alarm immediately when heart rate is dangerous |
| **Industrial robot / traffic lights** | Must perform actions at exact times |
:::

:::compare RTOS vs general-purpose OS
| | Real-time OS | General-purpose OS (Windows, macOS) |
|---|---|---|
| Main aim | Meet deadlines; predictable response | Good average performance and ease of use |
| Scheduling | Strict priority, pre-emptive | Fair sharing between many programs |
| User interface | Minimal or none | Rich GUI |
| Size | Small, embedded | Large |
| Reliability | Must not fail; runs continuously | Occasional crashes are acceptable |
:::

# Network operating systems
@lo 11.3.1.9

:::definition Network operating system (NOS)
An OS designed to **manage a network and its shared resources** — users, files, printers, applications — usually running on a **server** that client computers connect to. Examples: **Windows Server**, **Linux** server distributions (Ubuntu Server), UNIX, Novell NetWare (historic).
:::

:::cards
### Features of a NOS
- **User account management** — creates accounts and groups and **authenticates** users when they log in.
- **Authorisation / access rights** — controls which users can read, change or delete each shared file, folder and printer.
- **File and printer sharing** — central storage that all authorised users can reach; print queues for network printers.
- **Security** — firewall, encryption, logging of activity, enforcing password policies.
- **Centralised backup** and software updates for the whole network.
- **Remote access** and administration of client computers.
- **Network services** — e.g. DHCP, DNS, e-mail, web hosting.
- Supports **multi-user** access at the same time.
:::

:::example How a NOS implements user account management (exam answer)
The NOS provides **authentication and authorisation** mechanisms (1) so that only **authorised users** can access network resources (1). It **verifies each user's identity** with a user name and password when they log in (1) and **assigns appropriate access rights** to that user's account or group (1).
:::

:::mermaid Clients use resources managed by the network OS on the server
flowchart LR
  C1[Client PC] --> SRV[Server running a NOS]
  C2[Client laptop] --> SRV
  C3[Client tablet] --> SRV
  SRV --> F[Shared files]
  SRV --> PR[Network printer]
  SRV --> DB[Shared database]
:::

:::compare Network OS vs desktop OS
| | Network OS (server) | Desktop OS (client) |
|---|---|---|
| Purpose | Manages network resources and users | Runs applications for one user |
| Users | Many at once | One at a time |
| Security | Centralised accounts, access rights, auditing | Local accounts |
| Hardware | Powerful server, runs 24/7 | PC or laptop |
:::

# Batch processing operating systems
@lo 11.3.1.10

:::definition Batch processing OS
An OS that **collects jobs with similar requirements into groups (batches)** and processes them **one after another, automatically, without user interaction**, usually at a scheduled time.
:::

:::cards
### Features
- Jobs with similar requirements are **batched together** and run as a group.
- Data is **collected over a period of time** (a day, a week, a month) and then processed together.
- **No interaction** with the user while the jobs run — instructions are given in advance (job control language / scripts).
- Data is often **sorted before processing** (e.g. by account number).
- Usually runs at **off-peak times** (at night) when the computer is otherwise idle.
- Suited to **large volumes** of similar data.
### Typical uses
- **Payroll** — all salaries calculated at the end of the month.
- **Bank statements** and **utility bills** (electricity, water) printed for all customers.
- **Exam results** processing.
- Processing **cheques** or end-of-day sales records.
:::

:::mermaid Batch processing
flowchart TB
  J[Jobs collected during the day] --> B[Grouped into a batch and sorted]
  B --> R[Run automatically at night, no user input]
  R --> O[Output: bills, payslips, reports]
:::

:::compare Batch processing — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| Large amounts of data processed **efficiently** | Results are **not immediate** — there is a delay |
| Uses the computer at **off-peak** times | An error in one job may only be found after the whole batch runs |
| **No operator** needed while it runs | No interaction — jobs cannot be changed while running |
| Repetitive jobs are done the same way every time | Not suitable when up-to-date information is needed |
:::

:::compare Batch vs real-time processing
| | Batch | Real-time |
|---|---|---|
| When data is processed | Later, in groups | Immediately, as it arrives |
| User interaction | None during processing | Continuous |
| Example | Monthly electricity bills | Airline seat booking, airbag control |
:::

# Choosing an OS type and exam practice
@lo 11.3.1.5 11.3.1.6 11.3.1.7 11.3.1.8 11.3.1.9 11.3.1.10

:::compare Which type of OS?
| Scenario | Type of OS | Key reason |
|---|---|---|
| Car engine-management system | **Real-time** | Must respond to sensors within milliseconds |
| School network with 300 pupils sharing files and printers | **Network** | Central user accounts, access rights, shared resources |
| A bank printing monthly statements for 2 million customers | **Batch** | Large volume of similar jobs, no interaction needed |
| A university mainframe used by hundreds of researchers at once | **Multi-user** | Many users share one powerful computer |
| A pupil's laptop running a browser, music and a word processor | **Single-user multitasking** | One user, several programs at once |
| A digital watch or a simple calculator | **Single-tasking** (embedded) | Only one task needed |
:::

:::example Exam-style answers
**Q: Explain two functions of an operating system. [2]**
1. **Memory management** — allocates RAM to programs and prevents them from overwriting each other's data (1).
2. **Processor management** — schedules processes so that several programs can share the CPU (multitasking) (1).

**Q: Give two features of the batch operating system. [2]**
Jobs with similar requirements are **batched together** and run as a group (1). Data is **collected over a period of time** and processed **without user interaction** (1).

**Q: Describe one feature of a real-time operating system. [2]**
It processes inputs **within a guaranteed time** (1) so that it can control a physical process **immediately**, e.g. inflating an airbag (1).

**Q: Compare single-tasking and multitasking operating systems. [2]**
A single-tasking OS runs **only one program at a time**, **whereas** a multitasking OS runs **several programs at once** by giving each a **time slice** of the CPU (1). Multitasking keeps the CPU busier but **needs more memory** (1).
:::

:::warning Common mistakes
- Confusing **multi-user** (many people) with **multitasking** (many programs).
- Saying a multitasking OS runs programs "at exactly the same time" on one core — it **switches** between them very quickly.
- Describing real-time as "fast". The key idea is a **guaranteed response within a deadline**.
- Writing "the OS manages memory" without saying **what** it does (allocate, protect, free).
- Thinking batch processing involves the user — it runs **without** user interaction.
:::

:::steps Check yourself
- List six functions of an OS and describe each in one sentence.
- What is the difference between single-user and multi-user OS? Give an example of each.
- Explain how time slicing makes multitasking possible.
- Give three features of an RTOS and two examples of hard real-time systems.
- How does a NOS manage user accounts?
- Give two features, one advantage and one disadvantage of batch processing.
:::
