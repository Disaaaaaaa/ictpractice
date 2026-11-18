---
summary: Data flow diagrams (DFDs) — what they show, the four symbols (external entity, process, data store, data flow), context diagrams and first-level DFDs, the rules for drawing them correctly, and how to create a level-1 DFD that shows input, processing, storage and output.
---
# What a data flow diagram shows
@lo 11.2.2.1

:::definition Data flow diagram (DFD)
A diagram that shows **how data moves through a system**: where it comes **from** (inputs), how it is **processed**, where it is **stored**, and where it goes **to** (outputs). It shows **what** happens to the data, not **how** the program does it and not the **order** of events.
:::

A DFD is drawn during **analysis** (to describe the current system) and **design** (to plan the new system). It helps the analyst, the programmers and the client agree on the **inputs, processes, outputs and storage (IPOS)** of the system before any code is written. A DFD uses only **four symbols**.

## Why a new system is designed with a DFD

When a school, a clinic or a shop asks for a new computer system, the first problem is not programming — it is **understanding**. The client knows the job ("we take orders, we cook, we deliver") but usually cannot describe it as data. The programmers know how to write code but do not know the business. A DFD is the common language between them. It turns a long, unclear description into a picture that answers four questions: **What data comes into the system? What does the system do with it? What does it keep? What does it give back?** Because the picture uses only four simple shapes, the client can read it, point at a box and say "this is wrong — the receipt also goes to the accountant". Finding that mistake on paper costs minutes; finding it after the program is written can cost weeks.

In the **system life cycle**, the DFD links the stages together. During **analysis** the analyst interviews users, observes the work and collects documents, then draws a DFD of the **current** system to check that they have understood it. During **design** a second DFD shows the **new** system: which processes will be computerised, which new data stores (database tables) are needed and which reports will be produced. Later, each **data store** becomes a table in the database design (ERD and data dictionary), each **process** becomes a part of the program that can be designed with a flowchart or pseudocode, and each **data flow** from or to an entity becomes an **input screen** or an **output** (report, receipt, message). So a good DFD is the plan that the rest of the project follows.

## Logical, not physical

A DFD is a **logical** model: it shows **what** data moves and **what** is done to it, not the hardware, the software or the people that do it. A DFD of a school library looks the same whether loans are written in a paper book or saved in a cloud database. That is why a DFD never contains boxes such as "computer", "printer", "Wi-Fi" or "Python program". It also does not show **time** (when something happens), **order** (what happens first) or **decisions** (if… then…). Those belong in a flowchart. Keeping the DFD logical has a big advantage: the analyst can agree **what** the system must do with the client first, and choose **how** to build it later.

## How the four symbols work together

Each symbol has one job, and the four jobs fit together like a sentence. An **external entity** is the *who* outside the system: a source that supplies data (a customer typing an order) or a sink that receives data (a kitchen receiving a meal list); many entities are both. A **process** is the *verb* of the sentence: it takes data in and produces different or more useful data out — it validates, calculates, records, searches, sorts or prints. A **data store** is the system's *memory*: data that must still exist after the process has finished, for example yesterday's orders or the list of members. A **data flow** is the *noun* that travels: a named packet of data moving in one direction. A complete statement read from a DFD therefore sounds like: "The **Customer** sends **order details** to process **1 Take order**, which saves an **order record** in **D2 Orders**." If you cannot read a part of your diagram as a sentence like this, a symbol or label is probably missing.

:::definition External entity
A person, organisation or other system **outside** the system being designed that **sends data into** the system (a **source**) or **receives data from** it (a **sink**). Named with a **noun**: *Customer*, *Bank*, *Teacher*.
:::

:::definition Process
An action **inside** the system that **transforms input data into output data**. It has a **number** and a **verb + noun** name: *1 Record order*, *2 Calculate bill*.
:::

:::definition Data store
Data that is **held** in the system for later use — a file, a database table, a folder of forms. It has an **ID** (D1, D2…) and a **noun** name: *D1 Orders*.
:::

:::definition Data flow
**Data moving** from one symbol to another, drawn as an **arrow** that shows the direction and is labelled with the **name of the data** (a noun): *order details*, *payment*, *receipt*.
:::

:::svg The four DFD symbols
<svg class="dfd" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The four DFD symbols: external entity rectangle, numbered process with rounded corners, open-ended data store with an ID, and a labelled arrow for a data flow">
  <defs><marker id="dfs1a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs1r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs1g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="en" x="20" y="40" width="150" height="56"/>
  <text class="t" x="95.0" y="73.0" text-anchor="middle">Customer</text>
  <text class="tb" x="95" y="130" text-anchor="middle">External entity</text>
  <text class="s" x="95" y="150" text-anchor="middle">outside the system</text>
  <text class="s" x="95" y="167" text-anchor="middle">noun</text>
  <rect class="pr" x="215" y="28" width="150" height="80" rx="12"/>
  <path class="pl" d="M215,50 H365"/>
  <text class="n" x="290.0" y="44" text-anchor="middle">1</text>
  <text class="t" x="290.0" y="76.0" text-anchor="middle">Record</text>
  <text class="t" x="290.0" y="92.0" text-anchor="middle">order</text>
  <text class="tb" x="290" y="130" text-anchor="middle">Process</text>
  <text class="s" x="290" y="150" text-anchor="middle">changes data</text>
  <text class="s" x="290" y="167" text-anchor="middle">number + verb + noun</text>
  <rect class="dsf" x="410" y="50" width="170" height="38"/>
  <path class="dsl" d="M580,50 H410 V88 H580 M448,50 V88"/>
  <text class="sid" x="429" y="73.0" text-anchor="middle">D1</text>
  <text class="t" x="514.0" y="74.0" text-anchor="middle">Orders</text>
  <text class="tb" x="495" y="130" text-anchor="middle">Data store</text>
  <text class="s" x="495" y="150" text-anchor="middle">data kept for later</text>
  <text class="s" x="495" y="167" text-anchor="middle">ID + plural noun</text>
  <path class="fl" d="M615,69 L735,69" marker-end="url(#dfs1a)"/>
  <text class="l" x="675" y="58" text-anchor="middle">order details</text>
  <text class="tb" x="675" y="130" text-anchor="middle">Data flow</text>
  <text class="s" x="675" y="150" text-anchor="middle">data moving</text>
  <text class="s" x="675" y="167" text-anchor="middle">labelled noun + arrow</text>
  <text class="s" x="380" y="200" text-anchor="middle">Gane–Sarson notation — the one used on this platform</text>
</svg>
:::

:::compare The four DFD symbols
| Symbol | Shape | Represents | Naming | Examples |
|---|---|---|---|---|
| **External entity** | Rectangle (square corners) | A person, organisation or system **outside** the system that **sends data in or receives data out** | A **noun** | Customer, Student, Bank, Supplier |
| **Process** | Rounded rectangle with a **number** (or a circle) | An action that **transforms** input data into output data | **Number + verb + noun** | 1 Check order, 2 Calculate bill, 3 Issue book |
| **Data store** | Open-ended rectangle with an ID (D1, D2…) | Data **held** for later use — a file, database table, folder | **ID + noun** (often plural) | D1 Customers, D2 Orders, D3 Books |
| **Data flow** | **Arrow** with a label | **Data moving** between the other symbols; the arrow shows the direction | A **noun** — the data carried | Order details, Payment, Receipt |
:::

# Input, processing, storage and output in a DFD
@lo 11.2.2.1

Every DFD shows the four parts of a computer system. **Inputs** are the flows that come **from external entities** into processes; **processing** happens in the processes; **storage** is shown by the data stores; **outputs** are the flows that go **from processes to external entities**.

The learning objective asks you to use a first-level DFD **to represent input, processing, storage and output**. That means two skills: **reading** an existing DFD and saying which parts are which, and **drawing** a DFD so that all four parts of the described system appear. Both depend on understanding each part properly, so each one is explained below.

## Input

An **input** is data that **enters the system from outside**. In a DFD it is always a **data flow from an external entity to a process**. Examples: a student's *meal choice*, a patient's *appointment request*, a supplier's *delivery note*, a bank's *payment confirmation*. Notice the last one: an input does not have to come from a person — another organisation or computer system outside the boundary also sends inputs. When you design a new system, every input flow later becomes something real: an **input form** on a screen, a scanned card, a file received from another system. That is why inputs must be named precisely. "Data" or "information" is not a name; *new member details* tells the designer exactly which form to build. An input must also go **to a process**, never straight into a store: someone has to check, validate or record the data before it is kept.

## Processing

**Processing** is shown by the **processes**. A process is where data is **changed**: checked (*Validate card*), calculated (*Calculate total*), combined (*Produce timetable*), searched (*Find available rooms*) or recorded (*Record loan*). A useful test: the data coming **out** of a process must be **different** from the data going **in**. *Order details* in and *order details* out is not a process — but *order details* and *prices* in, *bill* out, is. Every process must therefore have **at least one input and at least one output**. On a level-1 DFD the processes are the **main functions** of the system, normally between three and seven of them. They are numbered 1, 2, 3… so that they can be referred to ("process 2 is missing an output") — the numbers do not show the order in which they happen.

## Storage

**Storage** is shown by the **data stores** together with the flows that touch them. A flow **from a process into a store** means the process **writes** (saves, adds or updates) data; a flow **from a store into a process** means the process **reads** data it needs. Storage is needed whenever data must be **kept between processes or between days**: a pre-order taken in the morning must still exist at 11:00 when the kitchen list is printed, so it is stored in *D1 Pre-orders*. In a scenario, look for words such as *kept, saved, recorded, stored, looked up, the list of…, the file of…* — they almost always point to a data store. A good check is that each store is **written by at least one process and read by at least one process**; a store that is only written to is useless, and a store that is only read from has no way to get its data.

## Output

An **output** is data that **leaves the system** and goes to someone or something outside it: a *receipt* to a customer, a *meal list* to the kitchen, an *overdue report* to the librarian, a *payment request* to the bank. In a DFD it is always a **data flow from a process to an external entity**. Outputs are the reason the system exists — the client pays for a system because of what it gives back. When a scenario says that someone *receives, is sent, is given, gets a report / message / notification*, that is an output. A flow from a process **into a data store is not an output**: the data has not left the system, it has only been saved inside it.

:::svg A canteen pre-order system: input, processing, storage and output
<svg class="dfd" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A small DFD for a canteen pre-order system showing input from the student, processing, storage in a data store and output back to the student and the kitchen">
  <defs><marker id="dfs2a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs2r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs2g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="okbox" x="10" y="10" width="160" height="26" rx="6"/>
  <text class="g" x="90" y="28" text-anchor="middle">INPUT</text>
  <rect class="box" x="230" y="10" width="160" height="26" rx="6" style="stroke:var(--primary)"/>
  <text class="pri" x="310" y="28" text-anchor="middle">PROCESSING</text>
  <rect class="box" x="470" y="10" width="160" height="26" rx="6" style="stroke:var(--success)"/>
  <text class="g" x="550" y="28" text-anchor="middle">STORAGE</text>
  <rect class="en" x="20" y="80" width="140" height="50"/>
  <text class="t" x="90.0" y="110.0" text-anchor="middle">Student</text>
  <rect class="pr" x="230" y="66" width="160" height="78" rx="12"/>
  <path class="pl" d="M230,88 H390"/>
  <text class="n" x="310.0" y="82" text-anchor="middle">1</text>
  <text class="t" x="310.0" y="113.0" text-anchor="middle">Take</text>
  <text class="t" x="310.0" y="129.0" text-anchor="middle">pre-order</text>
  <rect class="dsf" x="470" y="86" width="170" height="38"/>
  <path class="dsl" d="M640,86 H470 V124 H640 M508,86 V124"/>
  <text class="sid" x="489" y="109.0" text-anchor="middle">D1</text>
  <text class="t" x="574.0" y="110.0" text-anchor="middle">Pre-orders</text>
  <path class="fl" d="M160,100 L230,100" marker-end="url(#dfs2a)"/>
  <text class="l" x="195" y="88" text-anchor="middle">meal choice</text>
  <path class="fl" d="M390,100 L470,100" marker-end="url(#dfs2a)"/>
  <text class="l" x="430" y="90" text-anchor="middle">order record</text>
  <path class="fl" d="M230,125 L160,125" marker-end="url(#dfs2a)"/>
  <text class="l" x="195" y="145" text-anchor="middle">order number</text>
  <rect class="pr" x="230" y="170" width="160" height="70" rx="12"/>
  <path class="pl" d="M230,192 H390"/>
  <text class="n" x="310.0" y="186" text-anchor="middle">2</text>
  <text class="t" x="310.0" y="221.0" text-anchor="middle">Print kitchen list</text>
  <path class="fl" d="M555,124 L555,205 L390,205" marker-end="url(#dfs2a)"/>
  <text class="l" x="600" y="170" text-anchor="middle">today's orders</text>
  <rect class="en" x="20" y="182" width="140" height="46"/>
  <text class="t" x="90.0" y="210.0" text-anchor="middle">Kitchen</text>
  <path class="fl" d="M230,205 L160,205" marker-end="url(#dfs2a)"/>
  <text class="l" x="195" y="196" text-anchor="middle">meal list</text>
  <rect class="box" x="650" y="160" width="100" height="60" rx="6" style="stroke:var(--warning)"/>
  <text class="tb" x="700" y="185" text-anchor="middle">OUTPUT</text>
  <text class="s" x="700" y="204" text-anchor="middle">to entities</text>
</svg>
:::

:::compare Reading the canteen DFD as IPOS
| Part of the system | In the DFD | Canteen example |
|---|---|---|
| **Input** | Flow from an entity to a process | *meal choice* from Student to 1 Take pre-order |
| **Processing** | Process | 1 Take pre-order, 2 Print kitchen list |
| **Storage** | Data store (+ flows to and from it) | D1 Pre-orders — written by process 1, read by process 2 |
| **Output** | Flow from a process to an entity | *order number* to Student, *meal list* to Kitchen |
:::

:::callout info Different notations
This platform uses **Gane–Sarson** notation. Some books draw **processes as circles** (Yourdon–DeMarco notation) and data stores as two parallel lines. Any notation is accepted in the exam if it is **used consistently** and the four symbols are clearly different.
:::

:::tip Naming in one line
Entities and stores are **nouns**, processes are **verb + noun**, data flows are **nouns** that name the data — never "send", "check" or "go" on an arrow.
:::

:::example Worked example — reading a clinic DFD as IPOS
*A level-1 DFD for a district clinic in Kyzylorda has: entities **Patient** and **Doctor**; processes **1 Book appointment**, **2 Record visit**, **3 Produce prescription**; stores **D1 Patients**, **D2 Appointments**, **D3 Visits**. Flows: Patient → 1 *appointment request*; D1 → 1 *patient details*; 1 → D2 *appointment*; 1 → Patient *appointment confirmation*; D2 → 2 *today's appointments*; Doctor → 2 *diagnosis*; 2 → D3 *visit record*; D3 → 3 *treatment details*; 3 → Patient *prescription*.*

1. **Inputs** — look for flows that start at an entity: *appointment request* (from Patient) and *diagnosis* (from Doctor). Two inputs.
2. **Processing** — the three numbered processes. For each, check that the output is new data: process 1 turns a request plus patient details into an appointment and a confirmation ✔; process 2 turns the diagnosis into a visit record ✔; process 3 turns treatment details into a prescription ✔.
3. **Storage** — writes: *appointment* (1 → D2), *visit record* (2 → D3). Reads: *patient details* (D1 → 1), *today's appointments* (D2 → 2), *treatment details* (D3 → 3).
4. **Outputs** — flows that end at an entity: *appointment confirmation* and *prescription* (both to Patient).
5. **Spot the gap** — D1 Patients is read but never written in this diagram, so a process such as *4 Register patient* (Patient → 4 → D1) is missing. Saying this in an exam answer shows that you understand storage, not just the symbols.
:::

:::warning Common mistakes with input, processing, storage and output
- Calling a flow **into a data store** an "output" — it is **storage (write)**; outputs go to **entities**.
- Calling a data store an "input" because a process reads from it — reading is **storage (read)**; inputs come from **outside**.
- Listing an **entity** (e.g. "Customer") as an input — the input is the **data** (*order details*), not the person.
- A "process" whose output is the same data as its input (*order → Pass order → order*) — nothing is processed.
- Writing vague flow names such as *data*, *info*, *details* — the examiner cannot tell which input or output you mean.
:::

# Context diagrams and first-level DFDs
@lo 11.2.2.1

:::definition Context diagram (level-0 DFD)
A DFD that shows the **whole system as one single process** with all the **external entities** and the data flows between them and the system. It shows the **boundary** of the system; it has **no data stores**.
:::

:::definition System boundary
The imaginary line between **what is inside the system** (processes and data stores, which the new system will do and keep) and **what is outside** (external entities, which the system cannot control but exchanges data with).
:::

## Why DFDs are drawn in levels

A real system can have dozens of processes and stores. Drawn on one page, it becomes a tangle of arrows that nobody can check. DFDs solve this with **levels**, the same way a map does: a map of Kazakhstan shows cities, a map of one city shows streets. The **context diagram** is the top-level map. It treats the whole system as **one black box** and shows only how it talks to the outside world. It answers the first question the client asks: *"What will this system receive and what will it give us?"* Because it is so simple, it is usually the first diagram the analyst draws and the first one the client signs off.

The context diagram is also where the **system boundary** is fixed. Deciding the boundary is a real design decision. In a school canteen, is the **Bank** inside or outside? The canteen cannot change how the bank works — it only sends payment requests and receives confirmations — so the bank is **outside** and becomes an external entity. Is the **Kitchen** inside? If the new system only prints a list that cooks read, the kitchen is a **sink** outside the boundary. If the system also tracked stock in the kitchen, part of the kitchen's work would move inside. The rule for deciding: anything the system **does or keeps** is inside; any person or organisation the system only **exchanges data with** is outside.

The context diagram has **no data stores** because stores are part of the inside of the black box. As soon as you show a store, you are showing *how* the system works internally, and that is the job of the next level.

## From context diagram to level 1

The **first-level (level-1) DFD** opens the black box. The single process *0 System* is **decomposed** (split) into its main processes, numbered 1, 2, 3…, and the data stores that those processes share appear for the first time. The external entities do not change — they are still outside — and every data flow that crossed the boundary on the context diagram must now arrive at, or leave from, **one of the new processes**. New flows appear only *inside* the boundary: between processes, and between processes and stores. This rule is called **balancing**, and it is what makes the two levels a single, consistent model rather than two unrelated pictures. If a level-1 DFD suddenly has a new entity, or loses a flow that was on the context diagram, either the context diagram or the level-1 DFD is wrong. If needed, any level-1 process can be decomposed again into a level-2 DFD (processes 2.1, 2.2…), but the curriculum asks you to create diagrams up to **level 1**.

:::definition First-level (level-1) DFD
A DFD that **splits the single process of the context diagram into its main processes** (usually 3–7), and shows the **data stores** and all the data flows between entities, processes and stores.
:::

:::svg Each level of DFD shows more detail inside the system
<svg class="dfd" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Levels of DFD: the context diagram has one process; level 1 splits it into main processes and adds data stores; level 2 splits one process further">
  <defs><marker id="dfs3a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs3r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs3g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="box" x="10" y="20" width="220" height="190" rx="10"/>
  <text class="tb" x="120" y="44" text-anchor="middle">Context diagram (level 0)</text>
  <rect class="pr" x="55" y="70" width="130" height="70" rx="12"/>
  <path class="pl" d="M55,92 H185"/>
  <text class="n" x="120.0" y="86" text-anchor="middle">0</text>
  <text class="t" x="120.0" y="113.0" text-anchor="middle">Whole</text>
  <text class="t" x="120.0" y="129.0" text-anchor="middle">system</text>
  <text class="s" x="120" y="172" text-anchor="middle">one process, entities,</text>
  <text class="s" x="120" y="190" text-anchor="middle">no data stores</text>
  <rect class="box" x="270" y="20" width="230" height="190" rx="10" style="stroke:var(--primary);stroke-width:2"/>
  <text class="tb" x="385" y="44" text-anchor="middle">Level-1 DFD</text>
  <rect class="pr" x="285" y="60" width="90" height="54" rx="12"/>
  <path class="pl" d="M285,82 H375"/>
  <text class="n" x="330.0" y="76" text-anchor="middle">1</text>
  <text class="t" x="330.0" y="103.0" text-anchor="middle">Process</text>
  <rect class="pr" x="395" y="60" width="90" height="54" rx="12"/>
  <path class="pl" d="M395,82 H485"/>
  <text class="n" x="440.0" y="76" text-anchor="middle">2</text>
  <text class="t" x="440.0" y="103.0" text-anchor="middle">Process</text>
  <rect class="pr" x="285" y="124" width="90" height="54" rx="12"/>
  <path class="pl" d="M285,146 H375"/>
  <text class="n" x="330.0" y="140" text-anchor="middle">3</text>
  <text class="t" x="330.0" y="167.0" text-anchor="middle">Process</text>
  <rect class="dsf" x="395" y="138" width="90" height="28"/>
  <path class="dsl" d="M485,138 H395 V166 H485 M433,138 V166"/>
  <text class="sid" x="414" y="156.0" text-anchor="middle">D1</text>
  <text class="t" x="459.0" y="157.0" text-anchor="middle">Store</text>
  <text class="s" x="385" y="200" text-anchor="middle">3–7 main processes + stores</text>
  <rect class="box" x="540" y="20" width="210" height="190" rx="10"/>
  <text class="tb" x="645" y="44" text-anchor="middle">Level 2 (of process 2)</text>
  <rect class="pr" x="555" y="60" width="85" height="54" rx="12"/>
  <path class="pl" d="M555,82 H640"/>
  <text class="n" x="597.5" y="76" text-anchor="middle">2.1</text>
  <text class="t" x="597.5" y="103.0" text-anchor="middle">Step</text>
  <rect class="pr" x="655" y="60" width="85" height="54" rx="12"/>
  <path class="pl" d="M655,82 H740"/>
  <text class="n" x="697.5" y="76" text-anchor="middle">2.2</text>
  <text class="t" x="697.5" y="103.0" text-anchor="middle">Step</text>
  <rect class="pr" x="605" y="124" width="85" height="54" rx="12"/>
  <path class="pl" d="M605,146 H690"/>
  <text class="n" x="647.5" y="140" text-anchor="middle">2.3</text>
  <text class="t" x="647.5" y="167.0" text-anchor="middle">Step</text>
  <text class="s" x="645" y="200" text-anchor="middle">more detail of one process</text>
  <path class="fl" d="M232,105 L266,105" marker-end="url(#dfs3a)"/>
  <path class="fl" d="M502,87 L536,87" marker-end="url(#dfs3a)"/>
</svg>
:::

:::compare Levels of DFD
| Level | Shows | Data stores? | Process numbers |
|---|---|---|---|
| **Context diagram (level 0)** | The **whole system as one process**, with all the **external entities** and the data flows between them and the system | **No** | 0 (or none) |
| **Level 1 (first-level) DFD** | The system split into its **main processes**, with the **data stores** and the flows between processes, stores and entities | **Yes** | 1, 2, 3 … |
| Level 2 | One level-1 process broken down further | Yes | 2.1, 2.2 … |
:::

:::svg Context diagram — a school library system
<svg class="dfd" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Context diagram of a school library system: Student and Librarian exchange data with the single process 0 Library system">
  <defs><marker id="dfs4a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs4r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs4g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="en" x="30" y="95" width="150" height="50"/>
  <text class="t" x="105.0" y="125.0" text-anchor="middle">Student</text>
  <rect class="pr" x="300" y="70" width="170" height="100" rx="12"/>
  <path class="pl" d="M300,92 H470"/>
  <text class="n" x="385.0" y="86" text-anchor="middle">0</text>
  <text class="t" x="385.0" y="128.0" text-anchor="middle">Library</text>
  <text class="t" x="385.0" y="144.0" text-anchor="middle">system</text>
  <rect class="en" x="590" y="95" width="150" height="50"/>
  <text class="t" x="665.0" y="125.0" text-anchor="middle">Librarian</text>
  <path class="fl" d="M180,105 L300,98" marker-end="url(#dfs4a)"/>
  <text class="l" x="240" y="70" text-anchor="middle">borrow request,</text>
  <text class="l" x="240" y="85" text-anchor="middle">returned book</text>
  <path class="fl" d="M300,142 L180,135" marker-end="url(#dfs4a)"/>
  <text class="l" x="240" y="162" text-anchor="middle">loan receipt,</text>
  <text class="l" x="240" y="177" text-anchor="middle">overdue notice</text>
  <path class="fl" d="M590,105 L470,98" marker-end="url(#dfs4a)"/>
  <text class="l" x="530" y="85" text-anchor="middle">new book details</text>
  <path class="fl" d="M470,142 L590,135" marker-end="url(#dfs4a)"/>
  <text class="l" x="530" y="162" text-anchor="middle">loan reports</text>
  <text class="s" x="380" y="222" text-anchor="middle">the whole system is ONE process · no data stores · every flow crosses the system boundary</text>
</svg>
:::

:::svg Level-1 DFD — the same library system
<svg class="dfd" viewBox="0 0 760 490" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Level-1 DFD of the library: processes Register book, Issue book, Return book and Produce reports with data stores Books, Students and Loans">
  <defs><marker id="dfs5a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs5r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs5g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="en" x="20" y="30" width="120" height="44"/>
  <text class="t" x="80.0" y="57.0" text-anchor="middle">Librarian</text>
  <rect class="pr" x="250" y="17" width="150" height="70" rx="12"/>
  <path class="pl" d="M250,39 H400"/>
  <text class="n" x="325.0" y="33" text-anchor="middle">1</text>
  <text class="t" x="325.0" y="68.0" text-anchor="middle">Register book</text>
  <rect class="dsf" x="540" y="34" width="190" height="36"/>
  <path class="dsl" d="M730,34 H540 V70 H730 M578,34 V70"/>
  <text class="sid" x="559" y="56.0" text-anchor="middle">D1</text>
  <text class="t" x="654.0" y="57.0" text-anchor="middle">Books</text>
  <path class="fl" d="M140,52 L250,52" marker-end="url(#dfs5a)"/>
  <text class="l" x="195" y="44" text-anchor="middle">new book details</text>
  <path class="fl" d="M400,52 L540,52" marker-end="url(#dfs5a)"/>
  <text class="l" x="470" y="44" text-anchor="middle">book record</text>
  <rect class="en" x="20" y="230" width="120" height="44"/>
  <text class="t" x="80.0" y="257.0" text-anchor="middle">Student</text>
  <rect class="pr" x="250" y="150" width="150" height="70" rx="12"/>
  <path class="pl" d="M250,172 H400"/>
  <text class="n" x="325.0" y="166" text-anchor="middle">2</text>
  <text class="t" x="325.0" y="201.0" text-anchor="middle">Issue book</text>
  <rect class="dsf" x="540" y="167" width="190" height="36"/>
  <path class="dsl" d="M730,167 H540 V203 H730 M578,167 V203"/>
  <text class="sid" x="559" y="189.0" text-anchor="middle">D2</text>
  <text class="t" x="654.0" y="190.0" text-anchor="middle">Students</text>
  <path class="fl" d="M140,238 L250,190" marker-end="url(#dfs5a)"/>
  <text class="l" x="150" y="196" text-anchor="start">card, book ID</text>
  <path class="fl" d="M250,210 L140,250" marker-end="url(#dfs5a)"/>
  <text class="l" x="210" y="245" text-anchor="start">loan receipt</text>
  <path class="fl" d="M540,185 L400,185" marker-end="url(#dfs5a)"/>
  <text class="l" x="470" y="178" text-anchor="middle">student details</text>
  <path class="fl" d="M580,70 L390,150" marker-end="url(#dfs5a)"/>
  <text class="l" x="505" y="103" text-anchor="start">book status</text>
  <rect class="dsf" x="540" y="307" width="190" height="36"/>
  <path class="dsl" d="M730,307 H540 V343 H730 M578,307 V343"/>
  <text class="sid" x="559" y="329.0" text-anchor="middle">D3</text>
  <text class="t" x="654.0" y="330.0" text-anchor="middle">Loans</text>
  <path class="fl" d="M380,220 L570,307" marker-end="url(#dfs5a)"/>
  <text class="l" x="490" y="252" text-anchor="start">loan record</text>
  <rect class="pr" x="250" y="290" width="150" height="70" rx="12"/>
  <path class="pl" d="M250,312 H400"/>
  <text class="n" x="325.0" y="306" text-anchor="middle">3</text>
  <text class="t" x="325.0" y="341.0" text-anchor="middle">Return book</text>
  <path class="fl" d="M140,262 L250,312" marker-end="url(#dfs5a)"/>
  <text class="l" x="130" y="300" text-anchor="start">returned book ID</text>
  <path class="fl" d="M250,340 L130,274" marker-end="url(#dfs5a)"/>
  <text class="l" x="128" y="335" text-anchor="start">fine notice</text>
  <path class="fl" d="M400,318 L540,318" marker-end="url(#dfs5a)"/>
  <text class="l" x="470" y="311" text-anchor="middle">updated loan</text>
  <path class="fl" d="M540,336 L400,336" marker-end="url(#dfs5a)"/>
  <text class="l" x="470" y="352" text-anchor="middle">loan details</text>
  <rect class="pr" x="330" y="405" width="160" height="70" rx="12"/>
  <path class="pl" d="M330,427 H490"/>
  <text class="n" x="410.0" y="421" text-anchor="middle">4</text>
  <text class="t" x="410.0" y="456.0" text-anchor="middle">Produce reports</text>
  <path class="fl" d="M600,343 L470,405" marker-end="url(#dfs5a)"/>
  <text class="l" x="555" y="385" text-anchor="start">loan data</text>
  <rect class="en" x="620" y="420" width="125" height="44"/>
  <path class="pl" style="stroke:var(--foreground)" d="M620,432 L632,420"/>
  <text class="t" x="682.5" y="447.0" text-anchor="middle">Librarian</text>
  <path class="fl" d="M490,442 L620,442" marker-end="url(#dfs5a)"/>
  <text class="l" x="555" y="434" text-anchor="middle">overdue report</text>
  <text class="s" x="20" y="420" text-anchor="start">Librarian is drawn twice</text>
  <text class="s" x="20" y="437" text-anchor="start">(diagonal mark) to avoid</text>
  <text class="s" x="20" y="454" text-anchor="start">crossing lines</text>
</svg>
:::

:::compare Data flows of the library level-1 DFD
| From | Data flow | To | IPOS |
|---|---|---|---|
| Librarian | new book details | 1 Register book | Input |
| 1 Register book | book record | D1 Books | Storage (write) |
| Student | student card, book ID | 2 Issue book | Input |
| D2 Students | student details | 2 Issue book | Storage (read) |
| D1 Books | book status | 2 Issue book | Storage (read) |
| 2 Issue book | loan record | D3 Loans | Storage (write) |
| 2 Issue book | loan receipt | Student | Output |
| Student | returned book ID | 3 Return book | Input |
| D3 Loans ↔ 3 Return book | loan details / updated loan | — | Storage (read and write) |
| 3 Return book | fine notice | Student | Output |
| D3 Loans | loan data | 4 Produce reports | Storage (read) |
| 4 Produce reports | overdue report | Librarian | Output |
:::

:::definition Balancing
A level-1 DFD is **balanced** with its context diagram when it has the **same external entities** and the **same data flows into and out of the system**. The level-1 diagram only adds detail **inside** the boundary.
:::

:::example Worked example — from context diagram to level 1 (school canteen)
*The canteen system receives pre-orders from students, takes card payments through the bank and sends a daily list to the kitchen.*

1. **Context diagram:** one process *0 Canteen system*; entities **Student**, **Bank**, **Kitchen**; flows *meal choice*, *card details* in from Student; *order number* out to Student; *payment request* to Bank, *payment confirmation* from Bank; *meal list* to Kitchen.
2. **Main processes** (verbs in the description): *1 Take pre-order*, *2 Take payment*, *3 Print kitchen list*.
3. **Data stores** (what must be kept between processes): *D1 Pre-orders*, *D2 Menu*.
4. **Connect:** every context-diagram flow now goes to or from **one of the processes**; new flows appear only between processes and stores (e.g. *order record* 1 → D1, *prices* D2 → 1).
5. **Check balance:** the same 3 entities and the same 6 external flows appear on both diagrams. ✔
:::

:::steps How to draw a context diagram
- Draw **one process** in the middle and name it after the whole system: *0 Library system*.
- Find every **external entity** — who gives data to the system or gets data from it.
- Draw one **labelled arrow** for each kind of data going in or out.
- Check: **no data stores**, no flows between two entities, every arrow touches the system.
:::

# Exam practice: DFD symbols and levels
@lo 11.2.2.1

:::example Exam-style answers
**Q: State the purpose of a data flow diagram. [1]**
To show **how data flows through a system** — its inputs, processes, outputs and data stores (1).

**Q: Describe what is represented by an external entity in a DFD. [2]**
A person / organisation / system **outside the system** (1) that **sends data to** or **receives data from** the system (1).

**Q: Give two differences between a context diagram and a level-1 DFD. [2]**
A context diagram shows the system as **one process**, a level-1 DFD shows the **main processes** (1). A context diagram has **no data stores**, a level-1 DFD **shows the data stores** (1).

**Q: In the library DFD, identify one input, one data store and one output. [3]**
Input: *student card, book ID* / *new book details* / *returned book ID* (1). Data store: *D1 Books* / *D2 Students* / *D3 Loans* (1). Output: *loan receipt* / *fine notice* / *overdue report* (1).

**Q: Explain why a context diagram has no data stores. [2]**
It shows the whole system as **one process / a black box** (1); data stores are **inside the system**, so they only appear when the system is split into processes in the level-1 DFD (1).
:::

:::warning Common mistakes
- Drawing a **data store on a context diagram** — stores appear only from level 1.
- Naming a process with a noun only ("Orders") — a process needs a **verb**: *Record order*.
- Naming a flow with an action ("check", "send") instead of the **data** ("order details").
- Drawing the **computer** or the **database** as an external entity — they are part of the system.
- A level-1 DFD with an entity or flow that is **not on the context diagram** (not balanced).
:::

:::steps Check yourself
- Name and draw the four DFD symbols; say how each is named.
- Which flows in a DFD are inputs and which are outputs?
- What is the difference between a context diagram and a level-1 DFD?
- What does it mean that two DFD levels are balanced?
- Draw a context diagram for a cinema ticket-booking system.
:::

# Rules for drawing a correct DFD
@lo 11.2.2.1

Every data flow must **start or end at a process**: data can only be **stored, read, changed or passed on by a process**. This one rule explains all the flows that are not allowed.

## Why the rules exist

A DFD is not just a drawing — it is a **specification** that programmers will build from. Every arrow in it promises that some part of the system will move that data. If an arrow goes **from an entity straight into a data store**, the diagram promises that a customer can write into the database with no program in between: nobody validates the data, nobody decides which record to update, nobody checks the customer is allowed to. In a real system that is impossible (and, if it were possible, it would be a security hole). The arrow must go into a **process** — *1 Register customer* — which checks the data and then writes it to the store. That process later becomes a real input screen with validation.

The same reasoning explains the other illegal flows. **Store → store**: data cannot copy itself from one table to another; a program (process) has to read it, perhaps change it, and write it. **Entity → entity**: if a customer phones the manager, that conversation happens **outside** the system; the system cannot record or control it, so it is not drawn. **Store → entity**: an entity cannot "open the database and look"; a process must search the store and produce an output, such as *1 Search catalogue* producing a *search result*. When you meet a question that asks you to "identify and correct an error", the correction is almost always **"put a process in between"**.

## Rules for each symbol, explained

**Processes** must have at least one input and one output, because a process is defined as something that **transforms** data. With no input it creates data from nothing; with no output its work is wasted. The name must start with a **verb** because a process is an action: *Calculate fee*, not *Fee*. Numbers (1, 2, 3) are labels for reference only; the processes may run in any order, at the same time, or many times a day.

**Data stores** must be written to by at least one process and read by at least one process somewhere in the full set of diagrams. A store may be drawn **twice** on the same diagram (marked with an extra line or an asterisk) to avoid long crossing arrows — it is still the **same** store with the same ID. Stores are named with **nouns**, usually plural, because they hold many records: *D1 Members*, *D2 Bookings*.

**Data flows** carry **data, not actions and not physical goods**. A pizza is not a data flow, but *delivery details* is; money is not a data flow, but *payment details* is. Each flow is a **one-way** arrow named with the data it carries. If data goes both ways between a process and a store — the process reads a record and then writes it back — draw **two arrows** with two names (*member record* and *updated member record*), or one two-headed arrow only when the data is the same in both directions. A flow must never be labelled with a verb such as *send*, *check* or *go to*: the verb belongs in the process.

:::svg Allowed and not allowed data flows
<svg class="dfd" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Allowed flows: entity to process, process to store, store to process, process to process. Not allowed: entity to store, store to store, entity to entity">
  <defs><marker id="dfs6a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs6r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs6g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <text class="g" x="190" y="22" text-anchor="middle">Allowed ✓</text>
  <text class="r" x="570" y="22" text-anchor="middle">Not allowed ✕</text>
  <rect class="en" x="20" y="40" width="110" height="40"/>
  <text class="t" x="75.0" y="65.0" text-anchor="middle">Entity</text>
  <rect class="pr" x="250" y="40" width="110" height="40" rx="10"/>
  <text class="t" x="305" y="65" text-anchor="middle">Process</text>
  <path class="ok" d="M130,60 L250,60" marker-end="url(#dfs6g)"/>
  <rect class="en" x="400" y="40" width="110" height="40"/>
  <text class="t" x="455.0" y="65.0" text-anchor="middle">Entity</text>
  <rect class="dsf" x="630" y="40" width="110" height="40"/>
  <path class="dsl" d="M740,40 H630 V80 H740 M668,40 V80"/>
  <text class="sid" x="649" y="64.0" text-anchor="middle">D</text>
  <text class="t" x="704.0" y="65.0" text-anchor="middle">Store</text>
  <path class="bad" d="M510,60 L630,60" marker-end="url(#dfs6r)"/>
  <circle cx="570" cy="60" r="11" style="fill:var(--danger)"/>
  <text class="t" x="570" y="65" text-anchor="middle" style="fill:#fff">✕</text>
  <rect class="pr" x="20" y="110" width="110" height="40" rx="10"/>
  <text class="t" x="75" y="135" text-anchor="middle">Process</text>
  <rect class="dsf" x="250" y="110" width="110" height="40"/>
  <path class="dsl" d="M360,110 H250 V150 H360 M288,110 V150"/>
  <text class="sid" x="269" y="134.0" text-anchor="middle">D</text>
  <text class="t" x="324.0" y="135.0" text-anchor="middle">Store</text>
  <path class="ok" d="M130,130 L250,130" marker-end="url(#dfs6g)"/>
  <rect class="dsf" x="400" y="110" width="110" height="40"/>
  <path class="dsl" d="M510,110 H400 V150 H510 M438,110 V150"/>
  <text class="sid" x="419" y="134.0" text-anchor="middle">D</text>
  <text class="t" x="474.0" y="135.0" text-anchor="middle">Store</text>
  <rect class="dsf" x="630" y="110" width="110" height="40"/>
  <path class="dsl" d="M740,110 H630 V150 H740 M668,110 V150"/>
  <text class="sid" x="649" y="134.0" text-anchor="middle">D</text>
  <text class="t" x="704.0" y="135.0" text-anchor="middle">Store</text>
  <path class="bad" d="M510,130 L630,130" marker-end="url(#dfs6r)"/>
  <circle cx="570" cy="130" r="11" style="fill:var(--danger)"/>
  <text class="t" x="570" y="135" text-anchor="middle" style="fill:#fff">✕</text>
  <rect class="dsf" x="20" y="180" width="110" height="40"/>
  <path class="dsl" d="M130,180 H20 V220 H130 M58,180 V220"/>
  <text class="sid" x="39" y="204.0" text-anchor="middle">D</text>
  <text class="t" x="94.0" y="205.0" text-anchor="middle">Store</text>
  <rect class="pr" x="250" y="180" width="110" height="40" rx="10"/>
  <text class="t" x="305" y="205" text-anchor="middle">Process</text>
  <path class="ok" d="M130,200 L250,200" marker-end="url(#dfs6g)"/>
  <rect class="en" x="400" y="180" width="110" height="40"/>
  <text class="t" x="455.0" y="205.0" text-anchor="middle">Entity</text>
  <rect class="en" x="630" y="180" width="110" height="40"/>
  <text class="t" x="685.0" y="205.0" text-anchor="middle">Entity</text>
  <path class="bad" d="M510,200 L630,200" marker-end="url(#dfs6r)"/>
  <circle cx="570" cy="200" r="11" style="fill:var(--danger)"/>
  <text class="t" x="570" y="205" text-anchor="middle" style="fill:#fff">✕</text>
  <rect class="pr" x="20" y="250" width="110" height="40" rx="10"/>
  <text class="t" x="75" y="275" text-anchor="middle">Process</text>
  <rect class="pr" x="250" y="250" width="110" height="40" rx="10"/>
  <text class="t" x="305" y="275" text-anchor="middle">Process</text>
  <path class="ok" d="M130,270 L250,270" marker-end="url(#dfs6g)"/>
  <text class="s" x="570" y="278" text-anchor="middle">data can only be stored, read or passed on</text>
  <text class="s" x="570" y="296" text-anchor="middle">BY A PROCESS — put a process in between</text>
</svg>
:::

:::compare Allowed and not allowed data flows
| Flow | Allowed? | Why |
|---|---|---|
| Entity → Process | ✔ | Input to the system |
| Process → Entity | ✔ | Output from the system |
| Process → Data store | ✔ | Saving / updating data |
| Data store → Process | ✔ | Reading data |
| Process → Process | ✔ | One process passes data to another |
| **Entity → Entity** | ✘ | Happens outside the system — not shown |
| **Entity → Data store** (or store → entity) | ✘ | Data can only be stored or read **by a process** |
| **Data store → Data store** | ✘ | Data must be **moved by a process** |
:::

:::cards
### Rules for processes
- Every process needs **at least one input and at least one output**.
- Name it **verb + noun**: *Validate payment*, *Calculate grade*.
- Number processes **1, 2, 3 …** — the numbers identify them, they do **not** show the order.
### Rules for data stores
- A data store is **written to** by at least one process and **read from** by at least one process.
- Give it an ID (**D1**) and a noun name; it can be drawn twice to avoid crossing lines.
### Rules for flows
- Every flow has a **name** — the data, a **noun** ("payment details").
- An arrow shows **one direction**; draw two arrows for data going both ways.
- Do not draw **decisions, loops or control signals** — a DFD is **not** a flowchart.
:::

:::svg Fixing an illegal flow: put a process between the entity and the data store
<svg class="dfd" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Before: Customer sends details directly to the Customers data store, which is wrong. After: a process Register customer is placed between them">
  <defs><marker id="dfs8a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs8r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs8g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="badbox" x="10" y="10" width="360" height="200" rx="10"/>
  <text class="r" x="190" y="34" text-anchor="middle">✕ Wrong</text>
  <rect class="en" x="30" y="90" width="120" height="46"/>
  <text class="t" x="90.0" y="118.0" text-anchor="middle">Customer</text>
  <rect class="dsf" x="220" y="95" width="135" height="38"/>
  <path class="dsl" d="M355,95 H220 V133 H355 M258,95 V133"/>
  <text class="sid" x="239" y="118.0" text-anchor="middle">D1</text>
  <text class="t" x="306.5" y="119.0" text-anchor="middle">Customers</text>
  <path class="bad" d="M150,113 L220,113" marker-end="url(#dfs8r)"/>
  <text class="l" x="185" y="103" text-anchor="middle">details</text>
  <text class="s" x="190" y="180" text-anchor="middle">an entity cannot write to a store</text>
  <rect class="okbox" x="390" y="10" width="360" height="200" rx="10"/>
  <text class="g" x="570" y="34" text-anchor="middle">✓ Correct</text>
  <rect class="en" x="400" y="92" width="88" height="46"/>
  <text class="t" x="444.0" y="120.0" text-anchor="middle">Customer</text>
  <rect class="pr" x="510" y="75" width="100" height="80" rx="12"/>
  <path class="pl" d="M510,97 H610"/>
  <text class="n" x="560.0" y="91" text-anchor="middle">1</text>
  <text class="t" x="560.0" y="123.0" text-anchor="middle">Register</text>
  <text class="t" x="560.0" y="139.0" text-anchor="middle">customer</text>
  <rect class="dsf" x="630" y="96" width="115" height="38"/>
  <path class="dsl" d="M745,96 H630 V134 H745 M668,96 V134"/>
  <text class="sid" x="649" y="119.0" text-anchor="middle">D1</text>
  <text class="t" x="706.5" y="120.0" text-anchor="middle">Customers</text>
  <path class="ok" d="M488,115 L510,115" marker-end="url(#dfs8g)"/>
  <path class="ok" d="M610,115 L630,115" marker-end="url(#dfs8g)"/>
  <text class="s" x="570" y="180" text-anchor="middle">the process validates and saves</text>
  <text class="s" x="570" y="196" text-anchor="middle">customer details → customer record</text>
</svg>
:::

## Errors in processes

:::definition Black hole
A process that has **inputs but no outputs** — data goes in and disappears.
:::

:::definition Miracle
A process that has **outputs but no inputs** — it produces data from nothing.
:::

:::definition Grey hole
A process whose **inputs are not enough to produce its outputs** — some of the data it needs is missing, e.g. it outputs a *total price* but never receives any *prices*.
:::

These three errors are found by checking each process **one at a time**: list what goes in, list what comes out, and ask "could a person with only these inputs produce these outputs?" A black hole usually means the student forgot where the result is saved or sent. A miracle usually means a forgotten read from a data store — the report must come *from* somewhere. A grey hole is the hardest to spot because the process looks complete; it appears when a calculation needs data (prices, rates, dates) that is held in a store the student forgot to connect.

:::svg Black hole, miracle and grey hole
<svg class="dfd" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three process errors: a black hole has inputs but no output, a miracle has outputs but no input, a grey hole has outputs that cannot be made from its inputs">
  <defs><marker id="dfs7a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs7r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs7g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="badbox" x="20" y="10" width="230" height="190" rx="10"/>
  <text class="r" x="135" y="34" text-anchor="middle">Black hole</text>
  <text class="s" x="135" y="52" text-anchor="middle">inputs, NO output</text>
  <rect class="badbox" x="270" y="10" width="230" height="190" rx="10"/>
  <text class="r" x="385" y="34" text-anchor="middle">Miracle</text>
  <text class="s" x="385" y="52" text-anchor="middle">outputs, NO input</text>
  <rect class="badbox" x="520" y="10" width="230" height="190" rx="10"/>
  <text class="r" x="635" y="34" text-anchor="middle">Grey hole</text>
  <text class="s" x="635" y="52" text-anchor="middle">output cannot come from input</text>
  <rect class="pr" x="65" y="90" width="140" height="70" rx="12"/>
  <path class="pl" d="M65,112 H205"/>
  <text class="n" x="135.0" y="106" text-anchor="middle">1</text>
  <text class="t" x="135.0" y="133.0" text-anchor="middle">Record</text>
  <text class="t" x="135.0" y="149.0" text-anchor="middle">order</text>
  <path class="fl" d="M26,125 L65,125" marker-end="url(#dfs7a)"/>
  <text class="l" x="40" y="112" text-anchor="middle">order</text>
  <rect class="pr" x="295" y="90" width="140" height="70" rx="12"/>
  <path class="pl" d="M295,112 H435"/>
  <text class="n" x="365.0" y="106" text-anchor="middle">2</text>
  <text class="t" x="365.0" y="133.0" text-anchor="middle">Print</text>
  <text class="t" x="365.0" y="149.0" text-anchor="middle">invoice</text>
  <path class="fl" d="M435,125 L494,125" marker-end="url(#dfs7a)"/>
  <text class="l" x="465" y="115" text-anchor="middle">invoice</text>
  <rect class="pr" x="565" y="90" width="140" height="70" rx="12"/>
  <path class="pl" d="M565,112 H705"/>
  <text class="n" x="635.0" y="106" text-anchor="middle">3</text>
  <text class="t" x="635.0" y="133.0" text-anchor="middle">Calculate</text>
  <text class="t" x="635.0" y="149.0" text-anchor="middle">total</text>
  <path class="fl" d="M526,110 L565,110" marker-end="url(#dfs7a)"/>
  <text class="l" x="545" y="100" text-anchor="middle">name</text>
  <path class="fl" d="M705,140 L744,140" marker-end="url(#dfs7a)"/>
  <text class="l" x="724" y="160" text-anchor="middle">total</text>
  <text class="s" x="135" y="188" text-anchor="middle">where does the order go?</text>
  <text class="s" x="385" y="188" text-anchor="middle">made from nothing?</text>
  <text class="s" x="635" y="188" text-anchor="middle">a name gives no prices</text>
</svg>
:::

:::compare Common process errors
| Error | Meaning | Example | Fix |
|---|---|---|---|
| **Black hole** | Inputs but **no output** | "1 Record order" receives *order details* but sends nothing anywhere | Add the missing output, e.g. *order record* → D1 Orders |
| **Miracle** | Outputs but **no input** | "2 Print invoice" produces an *invoice* from nothing | Add the input it needs, e.g. *order data* from D1 Orders |
| **Grey hole** | The outputs **cannot be produced** from the inputs | "3 Calculate total" receives only the customer's *name* | Add the data needed, e.g. *prices* from D2 Products |
:::

:::example Worked example — find four errors in a gym DFD
*A student's DFD for a gym: Member → D1 Members (membership form); 1 Book class → Trainer (class list); D2 Classes → D1 Members (class details); 2 Calculate fee has an input "member details" and no output; a flow from Member to Trainer called "question".*

| Error | Why it is wrong | Correction |
|---|---|---|
| Member → D1 Members | An **entity cannot write to a store** | Add *3 Register member*: Member → 3 → D1 Members |
| 1 Book class has no input | A **miracle** — the class list comes from nothing | Add *booking request* from Member and *class details* from D2 Classes |
| D2 Classes → D1 Members | **Store to store** is not allowed | Remove it, or move the data through a process |
| 2 Calculate fee has no output | A **black hole** | Add *fee* → Member (or *fee record* → D1 Members) |
| Member → Trainer "question" | **Entity to entity** is outside the system | Remove it |
:::

:::warning Common mistakes
- Joining an **entity directly to a data store**, or two stores together.
- **Unlabelled arrows**, or labels that are actions ("check") instead of data ("order details").
- Processes with **only inputs** (black hole) or **only outputs** (miracle).
- Thinking process numbers show the **order** — they are only identifiers.
:::

# Creating a first-level DFD from a description
@lo 11.2.2.1

The exam task "create a first-level DFD for the system described" gives you a paragraph of text — a scenario — and asks you to turn it into a diagram. This is a skill of **careful reading** more than drawing. The scenario contains every entity, process, store and flow you need, and examiners award marks for each one you find and connect correctly. The method below works for any scenario.

## Reading the scenario: nouns and verbs

Read the text twice. The first time, just understand the business. The second time, mark three things. **People and organisations** that give or receive information (*customer, bank, teacher, supplier, parent*) are candidate **external entities**. **Things the system keeps** — usually a plural noun after words like *stores, keeps, records, looks up, the list of* (*orders, members, products, results*) — are candidate **data stores**. **Actions the system performs** — verbs such as *checks, calculates, records, sends, produces, updates* — are candidate **processes**. Then group the verbs: "checks the menu, calculates the total and stores the order" is one main function, *Take order*, not three separate processes. A level-1 DFD should show **three to seven** main processes; if you have ten, merge the small ones; if you have one, split it.

## Deciding entity or data store

Students often confuse the two because both can be named with the same word. *"The system records each **customer's** details"* contains both: **Customer** (the person, outside, who supplies the details) is an entity, and **D1 Customers** (the records kept inside) is a store. Ask: *is this someone who acts, or something that is kept?* A person who acts is an entity; records that are kept are a store. Also ask: *does the system control it?* The system controls its own stores; it cannot control a bank or a parent.

## Finding the flows

For every process, write a short list: **inputs** (from which entity or store) and **outputs** (to which entity, store or process). Each item becomes a labelled arrow. Check the scenario for outputs that people *receive* (*receipt, report, confirmation, list*) — they are easy marks and easy to forget. Then check every store: what process **writes** to it and what process **reads** from it? Finally compare with the context diagram, if one was given: every external flow there must appear here, attached to the right process.

:::steps How to draw a level-1 DFD
- Read the description and **underline the external entities** (who gives or receives data).
- Find the **main processes** — the actions the system performs (verbs): *takes orders*, *checks stock*, *sends invoices*.
- Find the **data stores** — data that is **kept** (customers, products, orders).
- For each process list its **inputs** and **outputs** and where they come from / go to.
- Draw the symbols, connect them with **named arrows**, and **check the rules** (no entity–store links, every process has input and output).
- Check that the diagram is **balanced** with the context diagram.
:::

:::example Worked example — an online pizza shop
*Customers order pizzas online. The system checks the menu for prices, calculates the total and stores the order. The customer pays by card through the bank, which sends a payment confirmation. The kitchen receives a list of paid orders to prepare, and the customer receives a receipt.*

| Element | Found in the text |
|---|---|
| External entities | **Customer**, **Bank**, **Kitchen** |
| Processes | **1 Take order**, **2 Process payment**, **3 Send order to kitchen** |
| Data stores | **D1 Menu**, **D2 Orders** |
| Flows | order details, prices, new order, amount due, card details, payment request, payment confirmation, receipt, paid status, paid orders, kitchen order list |
:::

:::svg Level-1 DFD for the pizza shop
<svg class="dfd" viewBox="0 0 760 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Level-1 DFD of an online pizza shop with processes Take order, Process payment and Send order to kitchen, data stores Menu and Orders, and entities Customer, Bank and Kitchen">
  <defs><marker id="dfs9a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker><marker id="dfs9r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker><marker id="dfs9g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker></defs>
  <style>
    svg.dfd .en{fill:var(--surface-2);stroke:var(--foreground);stroke-width:1.6}
    svg.dfd .pr{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dfd .pl{stroke:var(--primary);stroke-width:1.5}
    svg.dfd .dsf{fill:var(--success-soft)}
    svg.dfd .dsl{fill:none;stroke:var(--success);stroke-width:1.8}
    svg.dfd .fl{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dfd .bad{fill:none;stroke:var(--danger);stroke-width:2}
    svg.dfd .ok{fill:none;stroke:var(--success);stroke-width:2}
    svg.dfd .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .tb{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dfd .n{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .sid{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .l{font:italic 12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dfd .r{font:700 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dfd .g{font:700 13px system-ui,sans-serif;fill:var(--success)}
    svg.dfd .pri{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dfd .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dfd .badbox{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dfd .okbox{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dfd .wbox{fill:var(--surface-2);stroke:var(--warning);stroke-width:2;stroke-dasharray:6 4}
  </style>
  <rect class="en" x="20" y="170" width="120" height="46"/>
  <text class="t" x="80.0" y="198.0" text-anchor="middle">Customer</text>
  <rect class="pr" x="220" y="20" width="160" height="72" rx="12"/>
  <path class="pl" d="M220,42 H380"/>
  <text class="n" x="300.0" y="36" text-anchor="middle">1</text>
  <text class="t" x="300.0" y="72.0" text-anchor="middle">Take order</text>
  <rect class="dsf" x="480" y="38" width="180" height="36"/>
  <path class="dsl" d="M660,38 H480 V74 H660 M518,38 V74"/>
  <text class="sid" x="499" y="60.0" text-anchor="middle">D1</text>
  <text class="t" x="589.0" y="61.0" text-anchor="middle">Menu</text>
  <path class="fl" d="M480,56 L380,56" marker-end="url(#dfs9a)"/>
  <text class="l" x="430" y="48" text-anchor="middle">prices</text>
  <path class="fl" d="M140,178 L220,70" marker-end="url(#dfs9a)"/>
  <text class="l" x="92" y="120" text-anchor="start">order details</text>
  <rect class="pr" x="220" y="180" width="160" height="72" rx="12"/>
  <path class="pl" d="M220,202 H380"/>
  <text class="n" x="300.0" y="196" text-anchor="middle">2</text>
  <text class="t" x="300.0" y="232.0" text-anchor="middle">Process payment</text>
  <path class="fl" d="M300,92 L300,180" marker-end="url(#dfs9a)"/>
  <text class="l" x="308" y="140" text-anchor="start">amount due</text>
  <rect class="dsf" x="480" y="198" width="180" height="36"/>
  <path class="dsl" d="M660,198 H480 V234 H660 M518,198 V234"/>
  <text class="sid" x="499" y="220.0" text-anchor="middle">D2</text>
  <text class="t" x="589.0" y="221.0" text-anchor="middle">Orders</text>
  <path class="fl" d="M380,82 L540,198" marker-end="url(#dfs9a)"/>
  <text class="l" x="470" y="130" text-anchor="start">new order</text>
  <path class="fl" d="M380,216 L480,216" marker-end="url(#dfs9a)"/>
  <text class="l" x="430" y="208" text-anchor="middle">paid status</text>
  <path class="fl" d="M140,200 L220,206" marker-end="url(#dfs9a)"/>
  <text class="l" x="150" y="192" text-anchor="start">card details</text>
  <path class="fl" d="M220,238 L140,212" marker-end="url(#dfs9a)"/>
  <text class="l" x="160" y="250" text-anchor="start">receipt</text>
  <rect class="en" x="220" y="380" width="160" height="46"/>
  <text class="t" x="300.0" y="408.0" text-anchor="middle">Bank</text>
  <path class="fl" d="M270,252 L270,380" marker-end="url(#dfs9a)"/>
  <text class="l" x="262" y="305" text-anchor="end">payment</text>
  <text class="l" x="262" y="320" text-anchor="end">request</text>
  <path class="fl" d="M330,380 L330,252" marker-end="url(#dfs9a)"/>
  <text class="l" x="338" y="305" text-anchor="start">payment</text>
  <text class="l" x="338" y="320" text-anchor="start">confirmation</text>
  <rect class="pr" x="490" y="300" width="160" height="72" rx="12"/>
  <path class="pl" d="M490,322 H650"/>
  <text class="n" x="570.0" y="316" text-anchor="middle">3</text>
  <text class="t" x="570.0" y="344.0" text-anchor="middle">Send order</text>
  <text class="t" x="570.0" y="360.0" text-anchor="middle">to kitchen</text>
  <path class="fl" d="M570,234 L570,300" marker-end="url(#dfs9a)"/>
  <text class="l" x="580" y="272" text-anchor="start">paid orders</text>
  <rect class="en" x="490" y="430" width="160" height="46"/>
  <text class="t" x="570.0" y="458.0" text-anchor="middle">Kitchen</text>
  <path class="fl" d="M570,372 L570,430" marker-end="url(#dfs9a)"/>
  <text class="l" x="580" y="406" text-anchor="start">kitchen order list</text>
</svg>
:::

## Reading the finished diagram back

When the diagram is drawn, read it back as a story and compare it with the scenario sentence by sentence. *"Customers order pizzas online"* — the Customer sends *order details* to 1 Take order ✔. *"The system checks the menu for prices"* — D1 Menu sends *prices* to process 1 ✔. *"calculates the total and stores the order"* — process 1 writes a *new order* to D2 Orders and passes the *amount due* on ✔. *"The customer pays by card through the bank"* — *card details* from Customer and a *payment request* to Bank via 2 Process payment ✔. *"The kitchen receives a list of paid orders"* — 3 Send order to kitchen reads *paid orders* from D2 and outputs the *kitchen order list* ✔. *"the customer receives a receipt"* — process 2 outputs the *receipt* ✔. Every sentence of the scenario is now visible in the diagram, and nothing in the diagram is invented. This read-back takes two minutes in the exam and is the most reliable way to catch a missing flow before the examiner does.

:::compare Checking the pizza shop DFD
| Check | Result |
|---|---|
| Every process has an input **and** an output | 1: order details, prices → new order, amount due ✔ · 2: amount due, card details, confirmation → request, receipt, paid status ✔ · 3: paid orders → kitchen order list ✔ |
| Every store is written **and** read | D2 Orders: written by 1 and 2, read by 3 ✔ · D1 Menu: read by 1 (written by a menu process not shown in this part) |
| No entity–store, store–store or entity–entity flows | ✔ |
| Every flow is labelled with a noun | ✔ |
| Balanced with the context diagram (Customer, Bank, Kitchen) | ✔ |
:::

:::cards
### Tips for a neat diagram
- Put **entities at the edges**, **processes in the middle**, **stores** between the processes that share them.
- **Draw an entity or store twice** (with a mark) instead of crossing many lines.
- Use **two separate arrows** for data going in opposite directions.
### What examiners give marks for
- Correct **entities** and **data stores** taken from the scenario.
- **Processes** with verb + noun names that match the scenario.
- **Labelled flows** in the correct direction — inputs, outputs, reads and writes.
- **No rule-breaking** flows; nothing important from the scenario missed.
:::

:::callout info Drawing DFDs on the platform
In DFD questions, add **external entities**, **processes** and **data stores** from the toolbar, connect them by dragging between the dots, then **select each arrow** and type the name of the data flow.
:::

# DFDs compared with other diagrams
@lo 11.2.2.1

A DFD is one of several diagrams produced during design, and each one answers a different question. Exam questions often ask you to **compare** a DFD with a flowchart or to say **why** a DFD was chosen, so you need to know what the others show.

:::definition Flowchart
A diagram that shows the **sequence of steps, decisions and loops** of an algorithm or a single process, using start/stop, process, input/output and decision symbols.
:::

:::definition Entity-relationship diagram (ERD)
A diagram that shows the **entities** (tables) of a database, their attributes and the **relationships** (one-to-one, one-to-many, many-to-many) between them.
:::

A **DFD** answers *"what data moves where?"* for the **whole system**. A **flowchart** answers *"in what order are the steps done, and what happens if…?"* for **one process or program**. An **ERD** answers *"what data is kept, and how are the records connected?"* for the **database**. They are not competitors — they are three views of the same system. In a canteen project, the level-1 DFD shows the process *2 Take payment*; a flowchart then designs that process step by step ("read card → is balance ≥ total? → yes: deduct, no: show error"); and the data stores *D1 Students* and *D2 Pre-orders* become two tables in the ERD, joined by a one-to-many relationship (one student places many pre-orders).

The most common confusion is between a DFD and a flowchart, because both use boxes and arrows. The difference is in what the **arrow means**. In a flowchart an arrow means **"next"** — control passes to the following step. In a DFD an arrow means **"data moves"** — a named piece of data travels from one place to another, and nothing about time or order is implied. That is why a DFD has no **decision diamond**, no **start/stop** symbol and no **loop**: a process in a DFD can happen a thousand times a day, and the diagram does not change.

### Why choose a DFD?

A DFD is the best choice when the analyst needs to **agree the scope** of a system with a client who is not technical, to see **all inputs and outputs at once**, or to find **missing or duplicated data** (for example, two processes each keeping their own copy of the student list). It is a poor choice when you need to design the **logic** of a calculation — use a flowchart or pseudocode — or the **structure** of the database — use an ERD and a data dictionary.

:::compare DFD vs flowchart vs ERD
| | DFD | Flowchart | ERD |
|---|---|---|---|
| Shows | **Movement of data** between entities, processes and stores | The **sequence of steps** and decisions in an algorithm | **Entities** and the **relationships** between them |
| Order / decisions | Not shown | Shown (arrows, decision diamonds) | Not shown |
| Used for | Analysing and designing the **whole system** | Designing **one process / program** | Designing the **database** |
| Link to the others | Each **data store** becomes a table in the ERD | Each **process** can be designed as a flowchart | Each **entity** usually matches a data store |
:::

:::compare Advantages and limitations of DFDs
| Advantages | Limitations |
|---|---|
| Simple symbols — the **client** can understand and check them | Do **not show the order** of processing or decisions |
| Show the **inputs, outputs and storage** of the whole system on one page | Do not show **how** a process works (needs a flowchart / pseudocode) |
| Make **missing data** and duplicated work easy to spot | Large systems need **many levels** of diagrams |
| Levels let the analyst move from **overview to detail** | Do not show timing or **who** does the work inside the system |
:::

# Exam practice and summary
@lo 11.2.2.1

:::example Exam-style answers
**Q: Identify one error in a DFD where the arrow goes directly from "Customer" to "D1 Customers". [2]**
An **external entity cannot send data directly to a data store** (1); the data must pass through a **process**, e.g. "1 Register customer" (1).

**Q: A process "3 Produce report" has two inputs and no outputs. Name this error and explain how to correct it. [2]**
A **black hole** (1); add an output flow, e.g. *report* to the Manager (1).

**Q: Explain why process numbers in a DFD do not show the order of processing. [2]**
A DFD shows the **movement of data**, not the **sequence** of steps (1); the numbers are only **identifiers** used to refer to processes / their level-2 diagrams (1).

**Q: Describe one difference between a DFD and a flowchart. [2]**
A DFD shows **how data moves** between entities, processes and stores (1); a flowchart shows the **sequence of steps and decisions** of an algorithm (1).

**Q: Draw a first-level DFD for the system described. [6]**
Credit is given for: correct **external entities**; correct **processes** with verb + noun names; correct **data stores**; **named data flows** in the correct directions; **no rule-breaking** flows; a diagram that matches the description.
:::

:::warning Common mistakes
- Joining an **entity directly to a data store**, or two stores together.
- **Unlabelled arrows**, or labels that are actions ("check") instead of data ("order details").
- Processes with **only inputs** (black hole) or **only outputs** (miracle).
- Including the **database or the computer** as an external entity.
- Drawing **decisions and loops** as in a flowchart.
- Missing a store that the scenario says is **kept** ("the details are saved…").
:::

:::steps Check yourself
- Which flows are not allowed in a DFD, and what is the one rule behind them?
- What are a black hole, a miracle and a grey hole?
- List the six steps for drawing a level-1 DFD from a description.
- Draw a level-1 DFD for a cinema ticket-booking system with at least three processes and two stores.
- How is a DFD different from a flowchart and from an ERD?
:::
