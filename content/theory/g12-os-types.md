---
summary: Real-time, network and batch processing operating systems — how each works, their key features, hard and soft real-time, pre-emptive scheduling and interrupts, client–server networks and user account management in a NOS, job queues and scheduling in batch systems, and how to choose the right type for a scenario.
---
# Real-time operating systems
@lo 12.3.1.1

Operating systems are designed for different **workloads**. A laptop OS is built for **one user running many programs** with good average speed. Other systems must **react within a fixed time**, **serve hundreds of users over a network**, or **process millions of records without anyone watching** — each needs a different type of OS.

:::compare Three specialised OS types
| | Real-time OS | Network OS | Batch processing OS |
|---|---|---|---|
| Main goal | **Respond within a guaranteed deadline** | **Manage shared network resources and users** | **Process large volumes of similar jobs efficiently** |
| User interaction | Little or none — sensors and actuators | Many users at once over the network | **None** while jobs run |
| Where used | Embedded and control systems | Servers in schools, offices, data centres | Mainframes, banks, utility companies |
| Examples | FreeRTOS, VxWorks, QNX | Windows Server, Linux server | IBM z/OS jobs, scheduled server jobs |
:::

:::definition Real-time operating system (RTOS)
An operating system that **processes data and responds to events within a strict, guaranteed time limit (deadline)**, so that it can **monitor and control** a physical process as it happens. A result is only correct if it is produced **on time**.
:::

:::svg An RTOS controls a process in a feedback loop
<svg class="ost" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sensor sends readings to the RTOS, which decides within a deadline and drives an actuator that changes the physical process, which the sensor measures again">
  <defs><marker id="ostA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.ost .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ost .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.ost .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.ost .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.ost .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.ost .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.ost .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ost .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ost .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ost .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ost .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.ost .ar{fill:var(--muted)}
  </style>
  <rect class="bx" x="20" y="60" width="160" height="86" rx="10"/><text class="h" x="100" y="84" text-anchor="middle">Sensor</text><text class="s" x="100" y="104" text-anchor="middle">measures a value,</text><text class="s" x="100" y="121" text-anchor="middle">e.g. temperature</text>
  <rect class="on" x="250" y="40" width="260" height="126" rx="10"/><text class="h" x="380" y="64" text-anchor="middle">RTOS</text><text class="s" x="380" y="84" text-anchor="middle">interrupt → highest-priority task</text><text class="s" x="380" y="101" text-anchor="middle">decides within the deadline</text><text class="s" x="380" y="118" text-anchor="middle">e.g. ≤ 2 s (greenhouse)</text><text class="s" x="380" y="135" text-anchor="middle">or ≤ 30 ms (airbag)</text>
  <rect class="bx" x="580" y="60" width="160" height="86" rx="10"/><text class="h" x="660" y="84" text-anchor="middle">Actuator</text><text class="s" x="660" y="104" text-anchor="middle">motor, valve, heater,</text><text class="s" x="660" y="121" text-anchor="middle">alarm, display</text>
  <path d="M180,103 L246,103" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <path d="M510,103 L576,103" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <rect class="ok" x="250" y="210" width="260" height="60" rx="10"/><text class="h" x="380" y="234" text-anchor="middle">Physical process</text><text class="s" x="380" y="254" text-anchor="middle">greenhouse air, car, patient's heart</text>
  <path d="M660,146 C660,240 600,240 514,240" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <path d="M250,240 C100,240 100,200 100,150" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <text class="s" x="560" y="262">changes the process</text><text class="s" x="40" y="262">new reading</text>
  <text class="h" x="20" y="24">Continuous feedback loop — input, decide, output, all inside a guaranteed time</text>
</svg>
:::

:::cards
### Key features of an RTOS
- **Deterministic** — the time to respond to an event is **predictable** and always within the deadline.
- **Priority-based pre-emptive scheduling** — the most urgent task **interrupts** lower-priority tasks immediately.
- **Fast interrupt handling** — very low **interrupt latency**.
- **Continuous monitoring** of sensors with **feedback** to actuators.
- **High reliability / fault tolerance** — runs for years without restarting; often duplicated (redundant) hardware.
- **Small and efficient** — stored in ROM / flash of an **embedded** device; little or no user interface.
### Where RTOSs are used
- Car **airbags** and **anti-lock brakes (ABS)**.
- **Pacemakers** and hospital patient monitors.
- Aircraft **autopilot** and flight control.
- **Industrial robots**, traffic lights, greenhouse and nuclear-plant control.
- Online games and video calls (soft real-time).
:::

:::definition Deterministic
A system is deterministic when the **same event always gets a response within the same, known maximum time**, so the designers can **guarantee** that every deadline is met.
:::

:::svg An urgent task pre-empts a less important one
<svg class="ost" viewBox="0 0 760 246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A low-priority display task is interrupted by a high-priority brake sensor task, which finishes before its deadline; then the display task resumes">
  <style>
    svg.ost .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ost .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.ost .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.ost .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.ost .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.ost .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.ost .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ost .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ost .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ost .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ost .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.ost .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="24">Priority-based pre-emptive scheduling</text>
  <text class="t" x="20" y="72">High priority</text><text class="t" x="20" y="132">Low priority</text>
  <path class="ln" d="M150,170 L740,170"/><text class="s" x="740" y="190" text-anchor="end">time →</text>
  <rect class="bx" x="150" y="112" width="200" height="34" rx="4"/><text class="t" x="250" y="134" text-anchor="middle">display update</text>
  <rect class="no" x="350" y="52" width="160" height="34" rx="4"/><text class="t" x="430" y="74" text-anchor="middle">brake sensor task</text>
  <rect class="bx" x="510" y="112" width="200" height="34" rx="4"/><text class="t" x="610" y="134" text-anchor="middle">display update (resumes)</text>
  <path d="M350,40 L350,170" style="stroke:var(--warning);stroke-width:2;stroke-dasharray:5 4"/><text class="c" x="356" y="44">interrupt</text>
  <path d="M560,40 L560,170" style="stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4"/><text class="c" x="566" y="44" style="fill:var(--danger)">deadline</text>
  <text class="s" x="150" y="214">the urgent task interrupts (pre-empts) the low-priority task at once and finishes before its deadline;</text>
  <text class="s" x="150" y="232">interrupt latency = time from the signal to the start of the task — tiny and predictable in an RTOS</text>
</svg>
:::

:::definition Interrupt
A **signal** from hardware (e.g. a sensor) or software that tells the processor an event **needs attention now**; the OS pauses the current task and runs the task that handles the event.
:::

## Hard and soft real-time

:::svg Hard vs soft real-time: what a missed deadline means
<svg class="ost" viewBox="0 0 760 228" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="In hard real-time a late result is useless; in soft real-time a late result is still useful but of lower quality">
  <style>
    svg.ost .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ost .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.ost .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.ost .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.ost .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.ost .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.ost .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ost .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ost .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ost .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ost .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.ost .ar{fill:var(--muted)}
  </style>
  <text class="h" x="30" y="28">Hard real-time</text><path class="ln" d="M30,170 L350,170 M30,170 L30,50"/><text class="s" x="350" y="190" text-anchor="end">response time →</text><text class="s" x="26" y="46">usefulness</text><path d="M210,50 L210,170" style="stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4"/><text class="c" x="214" y="64" style="fill:var(--danger)">deadline</text><path d="M30,80 L210,80 L210,168 L350,168" style="stroke:var(--danger);stroke-width:3;fill:none"/><text class="s" x="30" y="214">late = failure (airbag, ABS brakes, pacemaker)</text>
  <text class="h" x="410" y="28">Soft real-time</text><path class="ln" d="M410,170 L730,170 M410,170 L410,50"/><text class="s" x="730" y="190" text-anchor="end">response time →</text><text class="s" x="406" y="46">usefulness</text><path d="M590,50 L590,170" style="stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4"/><text class="c" x="594" y="64" style="fill:var(--danger)">deadline</text><path d="M410,80 L590,80 C640,90 680,150 730,160" style="stroke:var(--warning);stroke-width:3;fill:none"/><text class="s" x="410" y="214">late = lower quality (video call, online game)</text>

</svg>
:::

:::compare Hard and soft real-time systems
| | Hard real-time | Soft real-time |
|---|---|---|
| Missed deadline | **System failure** — may be dangerous | Only **lower quality**; system keeps working |
| Examples | Airbag, ABS brakes, pacemaker, flight control, welding robot | Video streaming, video call, online game, ticket booking |
| Design | Every deadline guaranteed, tested for the worst case | Most deadlines met; average performance matters |
:::

:::example Worked example: a greenhouse in Turkistan region
Sensors measure **temperature** and **humidity** every second.
1. The reading 32 °C arrives as an **interrupt** from the temperature sensor.
2. The RTOS runs the **ventilation task** at once, because it has a higher priority than updating the display.
3. The task decides that 32 °C is above the 30 °C limit and opens the windows **within 2 seconds** (the deadline).
4. If the **fire sensor** triggers, the alarm task has the **highest priority** and interrupts every other task immediately.
5. The new temperature is measured again — the **feedback loop** continues day and night.
:::

:::compare RTOS vs general-purpose OS (Windows, macOS)
| | RTOS | General-purpose OS |
|---|---|---|
| Aim | Meet **every** deadline | Good **average** speed, fairness between programs |
| Scheduling | Strict priority, pre-emptive | Time-sharing between many programs |
| Response time | **Deterministic** | Varies with the load |
| Size | Small, embedded | Large, many features |
| Interface | Minimal or none | Rich GUI |
:::

:::warning Common mistakes
- Saying an RTOS is just "very fast" — the key idea is a **guaranteed deadline** (predictability). A slow response that is always on time is fine.
- Mixing up hard and soft: a **video call** is soft real-time, not hard.
- Calling any app that shows live data (e.g. weather) a real-time OS — the OS must **control** something within a deadline.
:::

# Network operating systems
@lo 12.3.1.2

:::definition Network operating system (NOS)
An operating system that **manages a network** of computers: its **shared resources** — files, printers, applications, Internet access — and the **users** who access them. It usually runs on a **server**, and client computers connect to it.
:::

:::svg A NOS on a server manages users and shared resources
<svg class="ost" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Client computers and a shared printer connect to a server running a NOS that manages accounts, access rights, shared files, backup and logs">
  <defs><marker id="ostA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.ost .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ost .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.ost .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.ost .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.ost .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.ost .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.ost .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ost .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ost .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ost .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ost .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.ost .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="24">A network operating system on a school server</text>
  <rect class="on" x="270" y="50" width="220" height="150" rx="10"/><text class="h" x="380" y="74" text-anchor="middle">Server + NOS</text><text class="s" x="380" y="94" text-anchor="middle">user accounts and groups</text><text class="s" x="380" y="111" text-anchor="middle">authentication / authorisation</text><text class="s" x="380" y="128" text-anchor="middle">shared folders, print queue</text><text class="s" x="380" y="145" text-anchor="middle">central backup, updates</text><text class="s" x="380" y="162" text-anchor="middle">audit log</text>
  <rect class="bx" x="20" y="50" width="180" height="60" rx="10"/><text class="h" x="110" y="74" text-anchor="middle">Teacher PC</text><text class="s" x="110" y="94" text-anchor="middle">group: Teachers</text>
  <rect class="bx" x="20" y="140" width="180" height="60" rx="10"/><text class="h" x="110" y="164" text-anchor="middle">Pupil PC</text><text class="s" x="110" y="184" text-anchor="middle">group: Grade 12</text>
  <rect class="bx" x="560" y="50" width="180" height="60" rx="10"/><text class="h" x="650" y="74" text-anchor="middle">Office PC</text><text class="s" x="650" y="94" text-anchor="middle">group: Office</text>
  <rect class="bx" x="560" y="140" width="180" height="60" rx="10"/><text class="h" x="650" y="164" text-anchor="middle">Shared printer</text><text class="s" x="650" y="184" text-anchor="middle">print queue</text>
  <path d="M200,80 L270,100 M200,170 L270,150 M560,80 L490,100 M560,170 L490,150" style="stroke:var(--border);stroke-width:2.5"/>
  <text class="t" x="20" y="236">1 log in: user name + password</text>
  <text class="t" x="400" y="236">2 NOS checks them — authentication</text>
  <text class="t" x="20" y="258">3 NOS checks rights — authorisation</text>
  <text class="t" x="400" y="258">4 access granted only to allowed resources; logged</text>

</svg>
:::

:::cards
### Functions of a NOS
- **User account management** — creates accounts and **groups**, sets **passwords** and **password policies**.
- **Authentication** — checks **who** the user is (user name + password, 2FA).
- **Authorisation** — gives each account **access rights** to resources (read, write, no access).
- **File and printer sharing** — central storage, home folders, **print queues**.
- **Security** — firewall, encryption, **audit logs** of who accessed what.
- **Centralised backup** and **software updates** for all clients.
- **Remote administration** and network services — DHCP, DNS, e-mail.
- Supports **many users at the same time**.
### Why organisations use one
- One administrator controls the whole network from **one place**.
- Users can **log in on any computer** and see their own files.
- Data is **backed up centrally** and access is **controlled**.
- Expensive resources (printers, software licences) are **shared**.
:::

:::steps How a NOS manages user accounts
- The administrator creates an **account** for each user and adds it to **groups** (e.g. Teachers, Grade 12).
- Access rights are given to **groups**, so a new pupil gets the right access just by joining a group.
- When a user **logs in**, the NOS checks the user name and password — **authentication**.
- The NOS checks the rights of the account and its groups — **authorisation**.
- The user can open only the folders and printers they are allowed to use; each access may be **logged**.
- When a user leaves, the administrator **disables** the account in one place.
:::

:::compare Example access rights on a school server
| Folder | Teachers | Grade 12 pupils | Office staff |
|---|---|---|---|
| \\Exams | Read / write | No access | No access |
| \\Homework\\Grade12 | Read / write | Read | No access |
| \\Finance | No access | No access | Read / write |
:::

:::compare Client–server network (with a NOS) and peer-to-peer network
| | Client–server (NOS on a server) | Peer-to-peer |
|---|---|---|
| Control | **Centralised** — the server manages accounts, security and backups | Each computer manages itself |
| Security | Strong; rights set in one place | Weaker; depends on every user |
| Backup | Central and automatic | Each user backs up their own files |
| Cost | Server and network administrator needed | Cheap, simple to set up |
| If the server fails | Users may lose access to shared resources | No single point of failure |
| Size | Large networks (schools, companies) | Small networks (home, small office) |
:::

:::example Worked example: a clinic with 40 staff
A clinic in Shymkent installs a server with a NOS.
- Doctors, nurses and receptionists each have an **account** in a **group**.
- Patient records are in a shared folder: doctors **read / write**, receptionists **read** only the appointments folder.
- Every night the NOS **backs up** the shared folders; the **audit log** shows who opened each patient file.
- A nurse can log in at **any** computer in the clinic and see their own documents.
:::

:::warning Common mistakes
- Describing a NOS as "an OS for the Internet" — it **manages users and shared resources** on a network.
- Confusing **authentication** (who are you?) with **authorisation** (what may you access?).
- Saying a NOS is the same as a **multi-user** OS — a NOS is usually multi-user, but its focus is **managing the network's resources**.
:::

# Batch processing operating systems
@lo 12.3.1.3

:::definition Batch processing OS
An operating system that **groups jobs with similar requirements into batches** and **runs them one after another automatically, without user interaction**, usually at a **scheduled time**. The data is **collected over a period** and processed **together**.
:::

:::svg Batch processing: collect, sort, queue, run
<svg class="ost" viewBox="0 0 760 266" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Transactions are collected, sorted, placed in a job queue and run at night against the master file to produce bills and a new master file">
  <defs><marker id="ostA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.ost .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ost .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ost .d{font:700 20px ui-monospace,monospace;fill:var(--foreground)}
    svg.ost .dp{font:700 20px ui-monospace,monospace;fill:var(--primary)}
    svg.ost .dd{font:700 20px ui-monospace,monospace;fill:var(--danger)}
    svg.ost .ds{font:700 20px ui-monospace,monospace;fill:var(--success)}
    svg.ost .dw{font:700 20px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .c{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.ost .pv{font:600 12px ui-monospace,monospace;fill:var(--muted)}
    svg.ost .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ost .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ost .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ost .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ost .ln{stroke:var(--foreground);stroke-width:1.5}
    svg.ost .ar{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="24">Batch processing of a month's electricity readings</text>
  <rect class="bx" x="20" y="50" width="160" height="90" rx="10"/><text class="h" x="100" y="74" text-anchor="middle">Collect</text><text class="s" x="100" y="94" text-anchor="middle">readings / transactions</text><text class="s" x="100" y="111" text-anchor="middle">over a period</text><text class="s" x="100" y="128" text-anchor="middle">(transaction file)</text>
  <rect class="bx" x="210" y="50" width="140" height="90" rx="10"/><text class="h" x="280" y="74" text-anchor="middle">Sort</text><text class="s" x="280" y="94" text-anchor="middle">by customer ID</text><text class="s" x="280" y="111" text-anchor="middle">to match the</text><text class="s" x="280" y="128" text-anchor="middle">master file</text>
  <rect class="on" x="380" y="50" width="160" height="90" rx="10"/><text class="h" x="460" y="74" text-anchor="middle">Job queue</text><text class="s" x="460" y="94" text-anchor="middle">jobs + JCL script</text><text class="s" x="460" y="111" text-anchor="middle">grouped by type,</text><text class="s" x="460" y="128" text-anchor="middle">wait for start time</text>
  <rect class="ok" x="570" y="50" width="170" height="90" rx="10"/><text class="h" x="655" y="74" text-anchor="middle">Run at night</text><text class="s" x="655" y="94" text-anchor="middle">one job after another,</text><text class="s" x="655" y="111" text-anchor="middle">no user interaction</text>
  <path d="M180,95 L206,95" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <path d="M350,95 L376,95" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <path d="M540,95 L566,95" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <rect class="bx" x="470" y="180" width="130" height="70" rx="10"/><text class="h" x="535" y="204" text-anchor="middle">Master file</text><text class="s" x="535" y="224" text-anchor="middle">customers, tariffs</text>
  <rect class="bx" x="620" y="180" width="120" height="70" rx="10"/><text class="h" x="680" y="204" text-anchor="middle">Output</text><text class="s" x="680" y="224" text-anchor="middle">bills, reports,</text><text class="s" x="680" y="241" text-anchor="middle">new master file</text>
  <path d="M600,215 C620,180 640,160 650,144" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <path d="M690,140 L690,176" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#ostA)"/>
  <text class="s" x="20" y="186">day 1 … day 30: data is only collected</text><text class="s" x="20" y="206">night of day 30: the whole batch is processed</text>
  <text class="s" x="20" y="226">output is spooled to the printer queue</text>
</svg>
:::

:::steps How batch processing works
- Jobs (programs + their data) are **submitted** with instructions written in advance — a **job control language (JCL)** or a script.
- Jobs are placed in a **job queue** and **grouped** with similar jobs.
- Input data is often **sorted** first (e.g. by customer number) so it is in the same order as the **master file**.
- At the scheduled time (often **at night**, off-peak), the OS runs the jobs **one by one**, with no operator.
- Output (bills, payslips, reports) is **spooled** to printers or files, and a **new master file** is produced.
:::

:::definition Spooling
Putting output for a slow device (such as a printer) into a **queue on disk**, so that the processor can carry on with the next job while the device works through the queue.
:::

:::cards
### Features
- Jobs with similar requirements are **batched together** and run as a group.
- Data is **collected over a defined period** and processed as one pack.
- **No interaction** with users while the jobs run.
- **Sorting** before processing; **scheduling** at off-peak times.
- **Spooling** of output for slow devices.
### Uses
- **Payroll** at the end of each month.
- **Utility bills** (electricity, water, gas) and **bank statements**.
- End-of-day processing of **card payments**.
- **Exam results**, census data, overnight **backups** and reports.
:::

:::compare Batch processing — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| **Efficient** for very large volumes of similar data | **Delay** — results are not available immediately |
| Uses the computer at **off-peak** times (e.g. at night) | Errors may be found only **after** the whole batch has run |
| **No operator** needed while it runs | Jobs cannot be changed once they are running |
| Repetitive jobs are done **consistently** | Not suitable for interactive or urgent tasks |
:::

:::example Worked example: electricity bills
An energy company in Almaty has **400 000** customers.
1. Smart meters send readings all month; they are stored in a **transaction file**.
2. On the last day, the readings are **sorted** by customer ID.
3. A **job** is queued to run at 01:00 with the JCL instructions.
4. The OS processes every customer **without interaction**, matching each reading with the **master file** (tariff, address).
5. 400 000 bills are **spooled** to the printers and a new master file is saved. No customer needs their bill instantly, so the delay does not matter.
:::

:::compare Choosing an OS type for a scenario
| Scenario | OS type | Reason |
|---|---|---|
| A car's anti-lock braking system | **Hard real-time** | Must react to wheel sensors within milliseconds; a late response is dangerous |
| A school of 900 pupils sharing files and printers | **Network OS** | Central accounts, access rights, shared resources, backup |
| A water company producing 300 000 bills every quarter | **Batch** | Large volume of similar jobs; no interaction needed |
| A video-call app | **Soft real-time** | Delays reduce quality but are not dangerous |
| Overnight processing of a bank's card payments | **Batch** | Payments collected during the day, processed together |
:::

:::warning Common mistakes
- Saying users can interact with batch jobs while they run — batch processing runs **without** interaction.
- Choosing batch for anything that needs an **immediate** answer (e.g. a cash machine checking a balance).
- Forgetting the **delay**: "efficient" is an advantage only when results are **not** needed at once.
:::

# Exam practice: OS types
@lo 12.3.1.1 12.3.1.2 12.3.1.3

:::example Exam-style answers
**Q: Describe a real-time operating system. [2]**
It processes inputs and responds **within a guaranteed time limit / deadline** (1), so that it can **monitor and control a physical process** as it happens, e.g. an airbag or a factory robot (1).

**Q: Explain why a pacemaker needs a hard real-time operating system. [2]**
The pacemaker must react to the heart's signals **within a strict deadline** (1); a late response could **endanger the patient's life**, so a missed deadline is a failure (1).

**Q: State two functions of a network operating system. [2]**
Any two: managing **user accounts** and groups (1); **authentication** / **access rights** (1); file and printer sharing; central backup; audit logs; software updates.

**Q: Describe how a NOS controls which files a pupil can open. [3]**
The pupil has an **account** in a **group** created by the administrator (1). At log-in the NOS **authenticates** the user name and password (1). It then checks the **access rights** of the account / group and allows only the permitted folders (1).

**Q: Explain why batch processing is suitable for producing monthly payslips. [2]**
There is a **large volume of similar jobs** (one for each employee) that can be processed together (1); payslips are **not needed immediately**, so they can be run **at night / off-peak without an operator** (1).

**Q: State one disadvantage of batch processing. [1]**
Results are **delayed** / errors are found only after the batch has run / no interaction is possible (1).
:::

:::warning Common mistakes in answers
- Giving an **example** only ("an airbag") when the question says **describe** — first say what the OS does (deadline, control), then give the example.
- Writing "it is faster" for any OS type — explain **what** it does differently.
- In scenario questions, naming the type without a **reason linked to the scenario**.
:::

:::steps Check yourself
- Define an RTOS and list five of its features.
- What do deterministic, interrupt and pre-emptive scheduling mean?
- Explain the difference between hard and soft real-time with two examples of each.
- List six functions of a NOS and describe how it authenticates and authorises a user.
- Compare client–server and peer-to-peer networks.
- Describe step by step how a batch job is submitted, queued and run; define spooling.
- Give two advantages and two disadvantages of batch processing.
- Choose an OS type for five scenarios and justify each choice.
:::
