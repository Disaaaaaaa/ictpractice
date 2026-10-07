---
summary: Real-time, network and batch processing operating systems — their features, how they work and where each is used.
---
# Real-time operating systems
@lo 12.3.1.1

:::definition Real-time operating system (RTOS)
An OS that guarantees to process input and respond **within a strict, fixed time limit (deadline)**, so that the output can control what happens next.
:::

:::cards
### Hard real-time
Missing a deadline is a **failure** — may be dangerous. *Airbag control, pacemaker, aircraft fly-by-wire, ABS brakes.*
### Soft real-time
Occasional late responses only reduce quality. *Video streaming, online games, VoIP calls.*
:::

- **Deterministic** scheduling by **priority**; the most urgent task always runs first; interrupts handled immediately.
- Works with **sensors** and **actuators** in a **feedback loop**.
- Small, reliable, often **embedded** in a device with no user interface; runs continuously.

:::mermaid Feedback loop in a real-time control system
flowchart LR
  S[Sensor: measures temperature] --> C[RTOS + program: compare with target]
  C --> A[Actuator: heater on/off]
  A --> E[Environment]
  E --> S
:::

# Network operating systems
@lo 12.3.1.2

:::definition Network operating system (NOS)
An OS designed to run on **servers** and to manage the resources and users of a **network** centrally.
:::

- **Central user management:** accounts, groups, logins (e.g. Active Directory).
- **Resource sharing:** files, folders, printers, applications, Internet connection.
- **Security:** authentication, access rights, firewalls, encryption, auditing.
- **Administration:** remote management, software deployment, monitoring, central **backup**.
- Supports many simultaneous users and connections; high reliability.
- *Examples:* Windows Server, Linux server distributions (Ubuntu Server, Red Hat), Novell NetWare (historically).

# Batch processing operating systems
@lo 12.3.1.3

:::definition Batch processing
Jobs (or transactions) are **collected over time** into a **batch** and processed **together, without user interaction**, often at a scheduled time when the computer is not busy.
:::

:::steps How a batch system works
- Data/transactions are collected into a **transaction file** during the day.
- The file is **validated** and **sorted** into the same order as the master file.
- At a scheduled time (e.g. overnight) the batch is processed, updating the **master file**.
- Outputs (bills, payslips, reports) are produced at the end.
:::

:::compare Comparing the three types
| | Real-time | Network | Batch |
|---|---|---|---|
| Response | Immediate, within a deadline | Interactive, shared by many users | Delayed — after the whole batch is processed |
| User interaction | Little or none (sensors) | Many users at once | None during processing |
| Main aim | Reliability and timing | Sharing resources, central control | Efficient processing of large volumes |
| Examples | Traffic lights, autopilot, industrial robots | School/office servers | Payroll, utility bills, bank statements, exam result processing |
:::

:::compare Batch processing: advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| Efficient for large amounts of similar data | Results are not available immediately |
| Uses the computer at quiet times (cheaper) | Errors may be found only after processing |
| Little human supervision needed | Not suitable when up-to-date information is needed (e.g. booking seats) |
:::
