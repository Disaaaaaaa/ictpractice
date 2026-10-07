---
summary: What an operating system does and how operating systems differ — single-user vs multi-user, single-tasking vs multitasking, and real-time, network and batch processing systems.
---
# Functions of an operating system
@lo 11.3.1.5

:::definition Operating system (OS)
System software that **manages the computer's hardware and software resources** and provides an interface between the user, applications and the hardware.
:::

:::cards
### Memory management
Allocates RAM to programs and data, keeps programs from using each other's memory, frees memory when a program closes, uses **virtual memory** when RAM is full.
### Process (processor) management
Decides which process uses the CPU and for how long (**scheduling**), so that several programs appear to run at the same time.
### File management
Creates, names, saves, copies, moves and deletes files; organises folders; controls access rights to files.
### Device (input/output) management
Communicates with peripherals through **device drivers**; manages buffers and queues (e.g. a print queue); handles **interrupts**.
### Security
User accounts and passwords, access rights, firewalls, updates/patches, logging of activity.
### User interface
Lets the user communicate with the computer (GUI, CLI, touch, voice) and run programs.
:::

:::tip
"Describe the functions of an OS" — name the function **and** say what it does, e.g. "*Memory management* — allocates RAM to each running program and prevents programs from overwriting each other's data."
:::

:::warning
Error handling and booting (loading itself from storage when the computer starts) are also OS tasks — accept them as functions too.
:::

# Single-user and multi-user operating systems
@lo 11.3.1.6

:::compare
| | Single-user OS | Multi-user OS |
|---|---|---|
| Users at one time | One user | Many users simultaneously (often over a network/terminals) |
| Resource sharing | All resources belong to one user | CPU time, memory and storage are shared fairly between users |
| Security | Simple — one account or a few accounts used one at a time | Strong — each user has an account, permissions and private files |
| Typical hardware | PC, laptop, smartphone | Mainframe, server |
| Examples | Windows 10 Home, macOS, Android | Unix/Linux servers, Windows Server |
:::

:::example
In a bank, hundreds of tellers use terminals connected to one mainframe. The mainframe runs a **multi-user OS** that shares processor time between them and keeps each user's data separate.
:::

# Single-tasking and multitasking operating systems
@lo 11.3.1.7

:::definition Single-tasking OS
Can run **only one program at a time**. The user must close one program before starting another. *Example: MS-DOS, simple embedded systems.*
:::

:::definition Multitasking OS
Can run **several programs (processes) at the same time**. The CPU switches rapidly between processes (**time-slicing**), so they appear to run simultaneously. *Example: Windows, macOS, Linux, Android.*
:::

:::compare
| | Single-tasking | Multitasking |
|---|---|---|
| Programs running | One | Many |
| Hardware needed | Little memory, simple CPU | More RAM and processing power |
| Complexity | Simple, reliable, fast for one job | Complex scheduling and memory management |
| User convenience | Low | High — e.g. listen to music while writing an essay |
:::

# Real-time, network and batch operating systems
@lo 11.3.1.8, 11.3.1.9, 11.3.1.10

## Real-time operating system (RTOS)

:::definition Real-time OS
Processes input and produces output **immediately** (within a fixed, very short time limit) so that the result can affect what happens next.
:::

- Guaranteed response time; tasks have strict **deadlines**.
- Usually controls hardware through **sensors** and **actuators**, often in a continuous feedback loop.
- Very high reliability; often runs without a user interface (embedded).
- *Examples:* aircraft autopilot, anti-lock brakes (ABS), traffic-light control, pacemakers, industrial robots, missile guidance.

## Network operating system (NOS)

:::definition Network OS
Runs on a **server** and manages the resources of a network shared by many computers.
:::

- Manages user accounts, logins and **access rights** centrally.
- Shares files, printers and applications between clients.
- Provides security (authentication, firewalls), backups and monitoring of the network.
- *Examples:* Windows Server, Linux server distributions, Novell NetWare.

## Batch processing operating system

:::definition Batch processing
Similar jobs are **collected into a batch** and processed together later **without user interaction**, usually at a quiet time (e.g. overnight).
:::

- Efficient for large volumes of similar data; uses the computer when it is otherwise idle.
- No immediate output — results are available only after the whole batch is processed.
- An error in the data may be found only after processing.
- *Examples:* payroll, utility (electricity/water) bills, bank statements, exam result processing.

:::compare Choosing a type of OS
| Situation | Best type | Reason |
|---|---|---|
| Controlling an aircraft's engines | Real-time | Must respond instantly to sensor data |
| Printing monthly salary slips for 5000 workers | Batch | Large volume of similar jobs; no interaction needed |
| A school server sharing files and printers | Network | Central management of users and shared resources |
| A personal laptop | Single-user multitasking | One user running several applications |
:::

:::tip
For "describe a real-time OS" always mention **immediate response / time limit** and give an example where a delay would be dangerous.
:::
