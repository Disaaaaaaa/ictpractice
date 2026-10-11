---
summary: Real-time, network and batch processing operating systems in depth — how each works, their key features, scheduling and interrupts in real-time systems, client–server and peer-to-peer networks and user account management in a NOS, job queues and scheduling in batch systems, and how to choose the right type.
---
# Types of operating system
@lo 12.3.1.1 12.3.1.2 12.3.1.3

Operating systems are designed for different **workloads**. A laptop OS is optimised for **one user running many programs**; other systems must react **instantly**, serve **hundreds of users over a network**, or process **millions of records without anyone watching**.

:::compare Three specialised OS types
| | Real-time OS | Network OS | Batch processing OS |
|---|---|---|---|
| Main goal | **Respond within a guaranteed deadline** | **Manage shared network resources and users** | **Process large volumes of similar jobs efficiently** |
| User interaction | Little or none; sensors and actuators | Many users at once over the network | **None** while jobs run |
| Where used | Embedded and control systems | Servers in schools, offices, data centres | Mainframes, banks, utilities |
| Examples | FreeRTOS, VxWorks, QNX | Windows Server, Linux server, Novell NetWare | IBM z/OS (JCL jobs), scheduled jobs on servers |
:::

# Real-time operating systems
@lo 12.3.1.1

:::definition Real-time operating system (RTOS)
An operating system that **processes data and responds to events within a strict, guaranteed time limit (deadline)**, so that it can **monitor and control** a physical process as it happens. Correctness depends not only on the **result** but also on **when** it is produced.
:::

:::cards
### Key features
- **Deterministic** — the time to respond to an event is **predictable** and always within the deadline.
- **Priority-based pre-emptive scheduling** — the most urgent task **interrupts** lower-priority tasks immediately.
- **Fast interrupt handling** — very low **interrupt latency** (the time from a signal to the start of its handler).
- **Continuous monitoring** of sensors with **feedback** to control actuators (motors, valves, displays).
- **High reliability and fault tolerance** — runs for years without restarting; often has redundant components.
- **Small and efficient** — stored in ROM / flash in an **embedded** device; minimal or no user interface.
### Hard vs soft real-time
- **Hard** real-time: missing a deadline is a **failure** that may be dangerous — airbags, anti-lock brakes, pacemakers, aircraft flight control, industrial robots.
- **Soft** real-time: missing a deadline only **reduces quality** — video streaming, online games, VoIP calls, ticket booking.
:::

:::mermaid How an RTOS controls a process (feedback loop)
flowchart TB
  S[Sensor measures a value, e.g. temperature] --> I[Interrupt or regular sampling]
  I --> P[RTOS runs the highest-priority task within the deadline]
  P --> D{Value outside the limits?}
  D -- Yes --> A[Actuator acts, e.g. turns heater off]
  D -- No --> W[Wait for next reading]
  A --> S
  W --> S
:::

:::example A greenhouse control system
Sensors measure **temperature** and **humidity** every second. If the temperature rises above 30 °C, the RTOS must open the windows **within 2 seconds**; if a fire sensor triggers, the **highest-priority** task sounds the alarm and switches off the heaters **immediately**, interrupting any other task.
:::

:::compare RTOS vs general-purpose OS
| | RTOS | General-purpose OS |
|---|---|---|
| Priority | Meet every deadline | Good average speed and fairness |
| Scheduling | Strict priority, pre-emptive | Time-sharing between many programs |
| Predictability | Deterministic | Response times vary |
| Size | Small, embedded | Large, many features |
| Interface | Minimal | Rich GUI |
:::

# Network operating systems
@lo 12.3.1.2

:::definition Network operating system (NOS)
An operating system that **manages a network** of computers and its **shared resources** — files, printers, applications, Internet access — and the **users** who access them. It usually runs on a **server**, and client computers connect to it.
:::

:::compare Client–server and peer-to-peer networks
| | Client–server (NOS on a server) | Peer-to-peer |
|---|---|---|
| Control | **Centralised** — the server manages accounts, security and backups | Each computer manages itself |
| Security | Strong; one place to set access rights | Weaker; depends on every user |
| Backup | Central and automatic | Each user backs up their own files |
| Cost | Server and administrator needed | Cheap, simple |
| Size | Large networks (schools, companies) | Small networks (home, small office) |
:::

:::cards
### Functions of a NOS
- **User account management** — creates accounts and **groups**, sets **passwords** and **password policies**.
- **Authentication and authorisation** — verifies who the user is and gives **access rights** to resources.
- **File and printer sharing** — central storage, home folders, print queues.
- **Security** — firewall, encryption, **audit logs** of who accessed what.
- **Centralised backup** and **software updates** for all clients.
- **Remote administration** and **network services** — DHCP, DNS, e-mail, web.
- Supports **many users simultaneously**.
### How user account management works
1. The administrator creates an **account** for each user and adds it to **groups** (e.g. Teachers, Grade 11).
2. When a user **logs in**, the NOS **verifies their identity** (user name + password / 2FA) — **authentication**.
3. The NOS checks the **access rights** of the user's account and groups — **authorisation**.
4. The user can only open the folders and printers they are allowed to use; every access may be **logged**.
:::

:::example Access rights on a school server
| Folder | Teachers | Grade 11 pupils | Office staff |
|---|---|---|---|
| \\Exams | Read / write | No access | No access |
| \\Homework\\Grade11 | Read / write | Read | No access |
| \\Finance | No access | No access | Read / write |
:::

# Batch processing operating systems
@lo 12.3.1.3

:::definition Batch processing OS
An operating system that **groups jobs with similar requirements into batches** and **runs them one after another automatically**, **without user interaction**, usually at a **scheduled time**. Data is **collected over a period** and processed together.
:::

:::steps How batch processing works
- Jobs (programs + their data) are **submitted** with instructions written in advance (e.g. a **job control language**, JCL, or a script).
- Jobs are placed in a **job queue** and **grouped** with similar jobs.
- Input data is often **sorted** first (e.g. by account number) so it matches the master file.
- At the scheduled time (often **at night**), the OS runs the jobs **one by one**, without an operator.
- Output (bills, payslips, reports) is **spooled** to printers or files.
:::

:::cards
### Features
- Jobs with similar requirements are **batched together** and run as a group.
- Data is **collected over a defined period** and processed as a pack.
- **No interaction** with users while the jobs run.
- **Sorting** before processing; **scheduling** at off-peak times.
- **Spooling** — output is queued for slow devices such as printers.
### Uses
- **Payroll** at the end of each month.
- **Utility bills** and **bank statements**.
- End-of-day processing of **card transactions** and **cheques**.
- **Exam results**, census data, overnight database backups and reports.
:::

:::compare Batch processing — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| **Efficient** for very large volumes of similar data | **Delay** — results are not immediate |
| Uses the computer at **off-peak** times | Errors may be found only **after** the whole batch has run |
| **No operator** needed during processing | Jobs cannot be changed while running |
| Repetitive jobs are done **consistently** | Not suitable for interactive or urgent tasks |
:::

# Choosing an OS type and exam practice
@lo 12.3.1.1 12.3.1.2 12.3.1.3

:::compare Scenario → OS type
| Scenario | OS type | Reason |
|---|---|---|
| An aircraft autopilot | **Hard real-time** | Must respond to sensors within milliseconds; failure is dangerous |
| A company with 500 employees sharing files and printers | **Network OS** | Central accounts, access rights, shared resources |
| A water company producing 300 000 bills every quarter | **Batch** | Large volume of similar jobs; no interaction needed |
| A video-call app | **Soft real-time** | Delays reduce quality but are not dangerous |
| Overnight processing of all card payments at a bank | **Batch** | Transactions collected during the day, processed together |
:::

:::example Exam-style answers
**Q: Give two features of the batch operating system. [2]**
Jobs with similar requirements are **batched together** and run through the computer **as a group** (1). Data is **collected for a defined period** of time and processed as a pack of similar tasks / **no user interaction** / sorting is performed before processing (1).

**Q: Describe how a network operating system implements user account management. [2]**
The NOS provides **authentication and authorisation** mechanisms, ensuring that **only authorised users can access network resources** (1); it **verifies user identities** to **assign appropriate access rights** (1).

**Q: Describe a real-time operating system. [2]**
It processes inputs and responds **within a guaranteed time / deadline** (1), so it can **control a physical process** as it happens, e.g. an airbag or a factory robot (1).
:::

:::warning Common mistakes
- Saying an RTOS is just "fast" — the key idea is a **guaranteed deadline** (predictability).
- Describing a NOS only as "an OS for the Internet" — it **manages users and shared resources** on a network.
- Saying batch processing lets users interact with jobs — it runs **without** interaction.
- Confusing **multi-user** (many users) with **network** OS (manages a network's resources) — a NOS is usually multi-user, but the focus is the network.
:::

:::steps Check yourself
- Define an RTOS and give four of its features.
- What is the difference between hard and soft real-time? Give two examples of each.
- Compare client–server and peer-to-peer networks.
- Describe step by step how a NOS authenticates and authorises a user.
- Describe how batch jobs are submitted, queued and run.
- Choose an OS type for five scenarios and justify each choice.
:::
