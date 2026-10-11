---
summary: How software is classified into system software and application software, what the operating system, utilities, drivers, libraries and translators are for, and how general-purpose, special-purpose and bespoke applications differ.
---
# What software is and how it is classified
@lo 11.3.1.1

**Hardware** is the physical equipment of a computer. **Software** is the set of **programs** (instructions) and the **data** they use that tell the hardware what to do. Without software, hardware cannot do anything useful.

:::definition Software
A collection of programs, data and documentation that instructs a computer how to carry out tasks.
:::

Every program belongs to one of **two main classes**. The class depends on **who the program works for**: the computer itself, or the user's real-world task.

:::definition System software
Programs that **manage, control and maintain the computer** and provide a **platform** on which other software runs. The user rarely works with it directly. Examples: operating system, utility programs, device drivers, libraries, translators.
:::

:::definition Application software
Programs that let the user **carry out a real-world task** — writing a report, editing a photo, paying for goods, booking a ticket. Applications run **on top of the operating system** and cannot run without it.
:::

:::mermaid The classification of software
flowchart LR
  S[Software] --> SY[System software]
  S --> AP[Application software]
  SY --> OS[Operating system]
  SY --> UT[Utility programs]
  SY --> DR[Device drivers]
  SY --> LB[Libraries]
  SY --> TR[Translators]
  TR --> C[Compiler]
  TR --> I[Interpreter]
  TR --> AS[Assembler]
  AP --> GP[General-purpose]
  AP --> SP[Special-purpose]
  AP --> BS[Bespoke]
:::

:::compare System software vs application software
| Feature | System software | Application software |
|---|---|---|
| Purpose | Controls, manages and maintains the computer | Solves a user's task |
| Who it works for | The computer / hardware | The end user |
| Needed to run the computer? | Yes — at least the OS | No — the computer works without it |
| When it runs | Starts with the computer and runs in the background | When the user opens it |
| Interaction with the user | Little or none (except the OS interface) | Direct — the user works in it |
| Dependence | Works close to the hardware | Depends on the OS to run |
| Examples | Windows, Linux, antivirus, defragmenter, printer driver, compiler | Word processor, web browser, game, payroll program |
:::

:::mermaid Layers — each layer uses the services of the layer below
flowchart TB
  U[User] --> A[Application software: browser, word processor, game]
  A --> S[System software: OS, utilities, drivers, libraries]
  S --> H[Hardware: CPU, memory, disks, devices]
:::

:::example Classify each program
| Program | Class | Subcategory |
|---|---|---|
| Windows 11 | System | Operating system |
| Antivirus scanner | System | Utility |
| Printer driver | System | Device driver |
| Python interpreter | System | Translator |
| The `math` module used by a Python program | System | Library |
| Microsoft Excel | Application | General-purpose |
| A payroll program | Application | Special-purpose |
| A booking system written only for one airline | Application | Bespoke |
:::

:::tip How to classify a program
1. Ask: does it help **the computer** (system) or **the user's task** (application)?
2. Then name the **subcategory**: OS, utility, driver, library, translator — or general-purpose, special-purpose, bespoke.
3. If the question says "explain", add **why**: *"An antivirus is system software because it maintains the computer rather than doing a user's task."*
:::

:::callout info Firmware
**Firmware** is system software stored permanently in **ROM / flash memory** on a device (e.g. the BIOS/UEFI that starts a PC, or the program inside a washing machine). It starts the hardware and loads the operating system.
:::

# The operating system
@lo 11.3.1.2

:::definition Operating system (OS)
System software that **manages the computer's hardware and software resources**, provides a **user interface** and a **platform** on which applications run. Examples: Windows, macOS, Linux, Android, iOS.
:::

The purpose of the OS is to **hide the complexity of the hardware** from the user and from applications, and to **share resources** (processor, memory, devices) fairly and safely.

:::cards
### Memory management
Allocates main memory to programs and data, keeps programs from using each other's memory, frees memory when a program closes, uses virtual memory when RAM is full.
### Processor management
Schedules which process uses the CPU and for how long, so that several programs appear to run at the same time (**multitasking**).
### File management
Creates, names, saves, copies, moves and deletes files; organises folders; controls access to files.
### Input/output and peripheral management
Communicates with devices through **drivers**; handles interrupts and buffers data for printers, keyboards, disks.
### Security and user accounts
Log-in with user names and passwords, **access rights** to files and folders, firewall, updates.
### User interface
Lets the user communicate with the computer — graphical (GUI), command-line, menu-driven, touch or voice.
### Error handling
Detects and reports errors (e.g. a device not responding) and recovers where possible.
:::

:::callout info Learn more
The functions and types of operating systems are covered in detail in the topics **Operating systems** (Grade 11) and **OS types** (Grade 12). For this topic you need to be able to describe the **purpose** of the OS.
:::

# Utility programs
@lo 11.3.1.2

:::definition Utility program
A small system program that **maintains, analyses, optimises or protects** the computer. Utilities do not do a user's real-world task; they help the computer work well.
:::

:::compare Common utility programs
| Utility | What it does | Why it is needed |
|---|---|---|
| **Antivirus** | Scans files, e-mails and memory; compares them with known virus signatures and suspicious behaviour; quarantines or deletes infected files | Protects data and the system from malware |
| **Firewall** | Checks incoming and outgoing network traffic against rules and blocks unauthorised connections | Prevents hacking and unauthorised access |
| **Disk defragmenter** | Moves the scattered fragments of files on a **magnetic hard disk** together into continuous blocks | Files are read faster; the read/write head moves less |
| **Backup** | Copies files to another medium or the cloud, often on a schedule; can restore them | Data can be recovered after loss, damage or ransomware |
| **Compression** | Reduces file size (e.g. ZIP) | Saves storage space and transmission time |
| **Disk clean-up** | Finds and removes temporary, duplicate and unneeded files | Frees storage space |
| **Encryption** | Scrambles data with a key so only authorised users can read it | Keeps data confidential if stolen |
| **Disk formatting** | Prepares a disk for use by creating a file system | A new disk can store files |
| **Disk checker / repair** | Scans a disk for bad sectors and file-system errors and repairs them | Prevents data corruption |
| **System monitor** | Shows CPU, memory and network use of each process | Helps find slow or faulty programs |
:::

:::ascii Defragmentation puts the parts of each file next to each other
Before:  | A1 | B1 | A2 | -- | B2 | A3 |     file A is in 3 places, file B in 2
After:   | A1 | A2 | A3 | B1 | B2 | -- |     each file is continuous; free space together
:::

:::warning Defragmentation and SSDs
Defragmentation helps **magnetic hard disks** because their head must move to each fragment. **Solid-state drives (SSDs)** have no moving parts, so defragmenting them gives no speed benefit and causes unnecessary wear.
:::

# Device drivers
@lo 11.3.1.2

:::definition Device driver
A small system program that lets the **operating system communicate with a particular hardware device** (printer, graphics card, scanner). It translates the OS's general commands into the specific instructions that device understands.
:::

- Each model of device can work differently, so it needs its **own driver**.
- Without the correct driver, the OS cannot use the device, or can use only basic functions.
- Drivers are often installed automatically (*plug and play*) and are updated to fix errors or add features.

:::example A driver in action
The user presses **Print** in a word processor → the application asks the **OS** to print → the OS passes the document to the **printer driver** → the driver converts it into commands for that specific printer model → the printer prints.
:::

# Libraries
@lo 11.3.1.2

:::definition Library (program library)
A collection of **pre-written, pre-compiled and pre-tested code** — functions, procedures, classes — that programmers can **call from their own programs** instead of writing that code again.
:::

```python | A program that uses library functions instead of writing them from scratch
import math        # standard maths library
import random      # random-number library

radius = 4
area = math.pi * radius ** 2          # constant from the library
side = math.sqrt(49)                  # library function
dice = random.randint(1, 6)           # library function
print(round(area, 2), side, dice)
```

:::cards
### Advantages of using libraries
- **Saves development time** — the code is already written.
- Code is **already tested**, so it is more **reliable** and has fewer errors.
- Programmers can use **complex functions** (graphics, encryption, maths, networking) without expert knowledge.
- One library can be **shared by many programs**, saving storage and memory (e.g. Windows **DLL** files).
- When the library is updated, all programs that use it can benefit.
### Disadvantages
- The programmer depends on someone else's code — errors or security flaws in the library affect the program.
- A library may contain **many functions that are not needed**, making the program larger.
- A program may stop working if the library version it needs is missing or changed.
:::

:::compare Static and dynamic libraries
| | Static library | Dynamic (shared) library |
|---|---|---|
| When it is joined to the program | When the program is compiled / **linked** | When the program **runs** |
| Executable file size | Larger — library code is copied in | Smaller |
| Needs the library on the user's computer? | No | Yes (e.g. a `.dll` or `.so` file) |
| Updates | The program must be re-compiled | Replacing the library updates all programs |
:::

:::warning Library ≠ utility
A **library** is not a program the user runs. It is code that **other programs** call. A **utility** is a complete program that the user (or the OS) runs to maintain the computer.
:::

# Translators
@lo 11.3.1.2

The processor can only execute **machine code** (binary instructions). Programs written in **high-level languages** (Python, C#, Java) or **assembly language** must be translated first.

:::definition Translator
System software that **converts program code** written in a programming language (**source code**) into **machine code** (**object code**) that the processor can execute.
:::

:::compare The three translators
| | Compiler | Interpreter | Assembler |
|---|---|---|---|
| Translates | High-level language | High-level language | Assembly language |
| How | The **whole program** at once | **One statement at a time**, executing it immediately | One mnemonic → one machine-code instruction |
| Output | An **executable** (object code) file | No executable file | Machine code (object code) |
| Errors | Reported together after translation | Stops at the **first error** it meets | Reported after translation |
| Running again | Runs the executable — no translation needed | Must be translated **every time** it runs | Runs the machine code |
| Source code needed to run? | No | Yes (and the interpreter) | No |
:::

:::cards
### Advantages of a compiler
- The compiled program **runs faster** — translation is done once.
- Only the **executable** is given to users, so the **source code stays secret**.
- The user does not need the compiler to run the program.
### Advantages of an interpreter
- **Easier debugging** — the program stops at the line with the error.
- Changes can be tested **immediately** without re-compiling.
- The same source code can run on different platforms that have the interpreter.
:::

:::callout info Learn more
Compilation stages (lexical analysis, syntax analysis, code generation, optimisation) are studied in **Program compilation stages** (Grade 12), and language generations in **Translators and language generations**.
:::

# Types of application software
@lo 11.3.1.3

Application software is divided into three subcategories according to **how many tasks** it does and **for whom it was made**.

:::cards
### General-purpose software
Can be used for **many different tasks** by many different users. Bought **off the shelf** (ready-made) or downloaded. *Examples: word processor, spreadsheet, presentation software, database package, web browser, e-mail client.*
### Special-purpose software
Designed to carry out **one specific task or type of task**, but sold to **many users**. Also off the shelf. *Examples: payroll software, accounting software, tax calculator, route planner, photo-editing software, school timetable program, a game.*
### Bespoke (custom-written) software
**Written specially for one organisation** to meet its **exact requirements**, by its own programmers or a hired company. *Examples: the booking system of a particular airline, the control program of one factory's machines, a bank's own online-banking system.*
:::

:::example The same task — three kinds of software
A school needs to record pupils' marks:
- **General-purpose:** the teachers use a **spreadsheet** (e.g. Excel) and create their own tables and formulas.
- **Special-purpose:** the school buys a **gradebook program** designed only for recording and reporting marks.
- **Bespoke:** the school hires developers to write a **marks system** that follows the school's own grading rules and links to its timetable.
:::

:::compare Off-the-shelf (general / special purpose) vs bespoke
| | Off-the-shelf | Bespoke |
|---|---|---|
| **Cost** | Cheaper — development cost is shared by many buyers | Expensive — one client pays for all development |
| **Availability** | Available **immediately** | Takes a **long time** to analyse, design, write and test |
| **Fit to needs** | May contain unneeded features or lack some needed ones; the company may have to change how it works | Contains **exactly the functions required** |
| **Reliability** | Used and tested by many people, so most bugs are already found | Fewer users, so bugs may remain |
| **Support** | Large user community, tutorials, forums, training courses | Support only from the developer |
| **Updates** | Regular updates from the vendor, but the company cannot choose the changes | Can be changed whenever the company wants (it may own the code) |
| **Competitive advantage** | Competitors can buy the same product | Unique to the organisation |
| **Compatibility** | May not fit the company's existing systems | Built to work with existing systems |
:::

:::steps Choosing for a scenario
- If the task is **common** (letters, spreadsheets, e-mail) → **general-purpose**.
- If the task is **specific but common to many organisations** (payroll, accounting) → **special-purpose**.
- If the organisation has **unique requirements**, needs to integrate with its own systems, or wants an advantage over competitors, **and** has enough **money and time** → **bespoke**.
- Always justify with the **scenario**: budget, deadline, how unusual the requirements are.
:::

# Exam practice and summary
@lo 11.3.1.1 11.3.1.2 11.3.1.3

:::example Exam-style answers
**Q: Describe the purpose of a utility program. Give one example. [2]**
A utility program **maintains, analyses or optimises the computer** / helps the computer run efficiently and safely (1), for example an **antivirus** that detects and removes malware (1).

**Q: Explain why a programmer would use a library. [2]**
The functions are **already written and tested** (1), **so** development is **faster** / the program is **more reliable** (1).

**Q: State one advantage and one disadvantage of implementing bespoke software. [2]**
Advantage: it is **custom-built to meet the exact requirements** of the organisation (1). Disadvantage: it has a **higher cost** / **takes a long time** to develop (1).

**Q: A store wants to computerise its daily sales records. Give one reason the store should buy general-purpose software. [1]**
It is **available immediately** / it is **cheaper** because it is mass-produced / it is well tested by many users / there is a large user community for help (any one).
:::

:::warning Common mistakes
- Calling a web browser or a game **system software** — they do a user's task, so they are **application software**.
- Confusing **special-purpose** (one task, many buyers) with **bespoke** (made for **one** organisation).
- Writing "bespoke software is better" without **comparing** — say *what* is better (fits the requirements exactly) and the cost (expensive, slow to develop).
- Saying a compiler "runs the program" — it **translates** it; the executable is run later.
- Describing a utility as "a useful program" — say **what it does for the computer**.
:::

:::steps Check yourself
- What is the difference between system software and application software? Give two examples of each.
- Name five types of system software and describe the purpose of each.
- Name four utility programs and what each does.
- Give two advantages of using libraries.
- Compare a compiler and an interpreter in two ways.
- Define general-purpose, special-purpose and bespoke software, with an example of each.
- Give two advantages and two disadvantages of bespoke software compared with off-the-shelf software.
:::
