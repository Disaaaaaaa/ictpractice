---
summary: Writing a technical specification for a new system — determining the minimum hardware requirements (processor, RAM, storage, display, network, input and output devices) from the software and the data, and justifying the choice of system and application software with criteria linked to the scenario.
---
# Minimum hardware requirements
@lo 11.3.2.1

:::definition Technical specification
A document, written at the **design stage**, that lists the **hardware and software needed to implement and run a new system**, with the exact figures (e.g. RAM in GB, storage in GB, processor speed) and a **reason for every choice**.
:::

:::definition Minimum hardware requirements
The **lowest specification of each hardware component** (processor, RAM, storage, display, network, peripherals) with which the new system — its operating system, application software and data — **will still run correctly**. Below the minimum the software will not install, or will be too slow to use.
:::

:::definition Recommended requirements
A higher specification, suggested by the software developer, with which the software runs **comfortably** — quickly, with several programs open and with room for growth. A good technical specification is **at least the minimum** and usually close to the **recommended** figures.
:::

## Why a technical specification is written

A new system is not only a program. It is a **combination of hardware, system software, application software and data** that must work together from the first day. During analysis the developers find out *what* the system must do: how many users there are, what is input, what is output and how much data is kept. At the **design stage** these requirements are turned into a technical specification, which answers the question *"what exactly must be bought and installed so that the system works?"*.

The specification is used by several people. The **client** (for example the school director) uses it to approve the budget, because every item has a price. The **supplier** uses it to order the right computers and devices. The **technician** uses it to install and configure the equipment, and the **developer** uses it to make sure the software is tested on the same kind of hardware that the users will have. Because so many people rely on it, the specification must contain **exact figures with units** (8 GB, 2.5 GHz, 256 GB SSD, 1920 × 1080) and not vague words such as "fast" or "big".

Every line also needs a **reason**. A reason shows that the figure was **calculated from the requirements** and was not simply copied from an advertisement. If the client asks "why do we need 16 GB of RAM and not 8 GB?", the reason in the specification answers that question. This is also why exam questions on this topic almost always say *"justify"* or *"give a reason for each"*: a device or a figure without a reason earns at most half of the marks.

The specification deliberately describes the **minimum** that is needed. If the hardware is below the minimum, the software may refuse to install, crash, or be so slow that users stop using it. If it is far above the minimum, the organisation wastes money that could be spent on training or support. A good specification is therefore **just above the minimum**, with a sensible margin for growth.


:::svg How the minimum hardware requirements are determined
<svg class="ts" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The requirements of the operating system, DBMS and application, plus the data and the inputs and outputs, combine into the minimum hardware requirements">
  <style>
    svg.ts .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ts .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ts .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ts .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ts .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ts .mo{font:12px ui-monospace,monospace;fill:var(--foreground)}
    svg.ts .ar{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.ts .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="14" width="248" height="62" rx="10"/>
  <text class="tt" x="22" y="38">Operating system</text><text class="mo" x="22" y="60">CPU 2 GHz · RAM 4 GB · 30 GB</text>
  <rect class="bx" x="10" y="86" width="248" height="62" rx="10"/>
  <text class="tt" x="22" y="110">DBMS</text><text class="mo" x="22" y="132">CPU 2.5 GHz · RAM 2 GB · 5 GB</text>
  <rect class="bx" x="10" y="158" width="248" height="62" rx="10"/>
  <text class="tt" x="22" y="182">Application</text><text class="mo" x="22" y="204">CPU 1.8 GHz · RAM 1 GB · 2 GB</text>
  <rect class="bx" x="10" y="230" width="248" height="62" rx="10"/>
  <text class="tt" x="22" y="254">Data + inputs / outputs</text><text class="mo" x="22" y="276">40 GB · scanner · printer</text>
  <path class="ar" d="M260,45 C290,45 290,150 300,150"/><path class="ar" d="M260,117 C290,117 290,150 300,150"/>
  <path class="ar" d="M260,189 C290,189 290,150 300,150"/><path class="ar" d="M260,261 C290,261 290,150 300,150"/>
  <path class="ah" d="M300,144 l12,6 l-12,6 z"/>
  <rect class="on" x="314" y="60" width="200" height="180" rx="12"/>
  <text class="tt" x="414" y="86" text-anchor="middle" style="fill:var(--primary)">Combine</text>
  <text class="ss" x="326" y="112">CPU → take the highest</text>
  <text class="ss" x="326" y="132">RAM → add programs that</text>
  <text class="ss" x="326" y="150">run at the same time</text>
  <text class="ss" x="326" y="172">Storage → add software</text>
  <text class="ss" x="326" y="190">+ data + growth</text>
  <text class="ss" x="326" y="212">Peripherals → from the</text>
  <text class="ss" x="326" y="230">inputs and outputs</text>
  <path class="ar" d="M516,150 H548"/><path class="ah" d="M548,144 l12,6 l-12,6 z"/>
  <rect class="ok" x="562" y="60" width="188" height="180" rx="12"/>
  <text class="tt" x="656" y="86" text-anchor="middle" style="fill:var(--success)">Minimum spec</text>
  <text class="mo" x="574" y="114">CPU 2.5 GHz</text>
  <text class="mo" x="574" y="138">RAM 7 GB → 8 GB</text>
  <text class="mo" x="574" y="162">Storage 77 GB</text>
  <text class="mo" x="574" y="186">  → 128 GB SSD</text>
  <text class="mo" x="574" y="210">barcode scanner,</text>
  <text class="mo" x="574" y="230">printer</text>
</svg>
:::

:::compare Hardware components in a technical specification
| Component | What to specify | How to decide the minimum | Example |
|---|---|---|---|
| **Processor (CPU)** | Number of cores, clock speed (GHz) | The **highest** minimum of all the software; more for video, graphics, many users | 4 cores, 2.5 GHz |
| **RAM (main memory)** | Capacity in GB | **Add** the RAM of the OS and of every program that runs **at the same time** | 8 GB |
| **Storage (secondary)** | Type (SSD / HDD) and capacity in GB / TB | **Add** the size of all software + the data now + the **growth** of the data + backups | 256 GB SSD |
| **Graphics / display** | Screen size, resolution, graphics card | Design, video and CAD need a high resolution and a graphics card | 1920 × 1080 |
| **Network** | Network card (wired / Wi-Fi), bandwidth (Mbps) | Needed if data is **shared** or the system is **online**; more bandwidth for many users | Gigabit Ethernet |
| **Input devices** | Keyboard, mouse, barcode scanner, touchscreen, camera, card reader, microphone | From the **inputs** of the system | Barcode scanner for books |
| **Output devices** | Monitor, printer type, speakers | From the **outputs** of the system | Thermal printer for receipts |
| **Other** | UPS (backup power), backup drive, server | Systems that must never lose data or stop | UPS for the server |
:::

## Calculating the minimum figures

:::example Worked example — a school library system
The library will run **Windows** (min. 4 GB RAM, 1 GHz, 64 GB), a **DBMS** (min. 2 GB RAM, 2 GHz, 4 GB) and the **library application** (min. 1 GB RAM, 1.5 GHz, 1 GB) **at the same time**. The database is 6 GB now and grows by about **2 GB per year**; the system should last **5 years**.

- **Processor:** the highest minimum is **2 GHz** (the DBMS) → specify at least a **2 GHz** processor (the speeds are **not** added).
- **RAM:** all three run together → 4 + 2 + 1 = **7 GB** → the next standard size is **8 GB**.
- **Storage:** software 64 + 4 + 1 = 69 GB; data 6 + 5 × 2 = 16 GB → 85 GB → specify **128 GB** (or 256 GB to allow backups).
- **Input:** a **barcode scanner** — books and student cards have barcodes, so loans are recorded quickly and without typing errors.
- **Output:** a **printer** for loan slips and overdue letters.
- **Network:** a **network card** — the database is shared with the librarian's and teachers' computers.
:::

:::cards
### Processor
- Clock speed in **GHz** — how many instructions per second.
- More **cores** → several tasks at once (many users on a server).
- Take the **highest** requirement, never the sum.
### RAM
- Holds the OS, the programs and the data **currently in use**.
- Too little RAM → the computer uses **virtual memory** and becomes slow.
- **Add** the needs of programs that run together; round up to 4 / 8 / 16 GB.
### Storage
- Stores software and data **permanently**.
- **SSD**: faster access, no moving parts, quieter — good for databases.
- **HDD**: cheaper per GB — good for large backups and archives.
### Peripherals
- Chosen from the system's **inputs and outputs**.
- Each device needs a **reason**: "a barcode scanner, because …".
:::


## How each component affects the system

**The processor** carries out the instructions of every program. Its **clock speed**, measured in gigahertz (GHz), tells us how many cycles it performs per second, and the number of **cores** tells us how many instructions it can work on at the same time. A program's minimum processor requirement means "the program needs a processor at least this fast to respond in an acceptable time". Because one processor runs all the programs by sharing its time between them, the requirements are **not added**: a 2.5 GHz processor is fast enough for a program that needs 2 GHz *and* for one that needs 1.5 GHz. We therefore take the **highest** minimum. More cores are needed when the work can be split up — a **server** that answers many users at once, video editing, or 3D graphics.

**RAM** is the main memory. It holds the operating system, every program that is **open** and the data those programs are working on **right now**. Unlike the processor, RAM is **divided** between the programs: if Windows uses 4 GB and the DBMS uses 2 GB, those 6 GB cannot be used by anything else. This is why the RAM needs of programs that run **at the same time** are **added**. When RAM runs out, the operating system moves parts of programs to the disk (**virtual memory**); the disk is thousands of times slower than RAM, so the whole computer becomes very slow. RAM is sold in standard sizes (4, 8, 16, 32 GB), so the total is always **rounded up**.

**Storage** (secondary storage) keeps the software and the data **permanently**, even when the power is off. Everything that is installed takes space, so the sizes of the OS and all the programs are added. The **data** must be added too, and data **grows**: a shop adds new sales every day, a clinic adds new patients and scans. The specification is written for the **whole life** of the system (often 3–5 years), so the growth per year is multiplied by the number of years. Space for **backups** and updates is also needed. The **type** of storage matters: an **SSD** has no moving parts and much faster access, so a database answers queries quickly; an **HDD** is cheaper per gigabyte and suits large archives.

**Peripherals** — the input and output devices — come from the **inputs and outputs** of the system found during analysis. If the system reads barcodes, it needs a barcode scanner; if it prints receipts, it needs a receipt printer; if customers pay by card, it needs a card terminal. Each device is chosen because it makes a task **faster, more accurate or possible at all**. Finally the **network**: if the data is shared by several computers, or the system works online, each computer needs a network card and the connection needs enough **bandwidth** (Mbps) for all users at once.

:::definition Peripheral device
A hardware device connected to the computer to **input** data (keyboard, scanner, camera, card reader) or **output** information (monitor, printer, speakers). In a technical specification each peripheral is chosen from the system's inputs and outputs and given a reason.
:::

:::compare Too little or too much hardware
| | Below the minimum | Far above the minimum |
|---|---|---|
| Processor | Programs respond slowly; users wait at every screen | Money wasted; the extra speed is never used |
| RAM | Virtual memory is used; the computer freezes when several programs are open | Unused memory; higher price per computer |
| Storage | The disk fills up; no new records or backups can be saved | Paying for space the data will never need |
| Result | The system fails its requirements | The budget is spent on hardware instead of training or support |
:::

:::warning Common mistakes with hardware requirements
- **Adding processor speeds** (2 + 1.5 + 1 GHz = 4.5 GHz) — speed is not added; take the highest.
- Forgetting the **operating system** when adding RAM or storage.
- Forgetting the **data** and its **growth** — the disk fills up after a year.
- Writing "a fast computer" or "a lot of memory" — the specification needs **figures** (GB, GHz).
- Listing a device without saying **why** this system needs it.
:::

# Justifying the choice of software
@lo 11.3.1.4

:::definition System software
Software that **runs and manages the computer** itself: the **operating system** (Windows, Linux, macOS) and **utility programs** (antivirus, backup, compression, disk tools).
:::

:::definition Application software
Software that does a **task for the user**: a DBMS (MySQL, Microsoft Access), a spreadsheet, a word processor, a web browser, or a specialised program (library, clinic, accounting).
:::

:::definition Justify (a choice of software)
Give a **reason**, linked to the **needs of the scenario**, why this software is chosen: *software* → *criterion* → *because the system needs …*. A list of features without a link to the scenario is **not** a justification.
:::


## How software is chosen

Software is chosen **before** the hardware, because the hardware requirements come from the software. The order is usually: first the **application software** that does the user's task (the booking program, the library system, the DBMS), then an **operating system** that this application runs on, then the **utilities** that keep the system safe (antivirus, backup, drivers for the devices). The choice of operating system is often decided by the application: if the clinic's booking package runs only on Windows, the clinic needs Windows, whatever the IT teacher prefers.

For each type of software there are several options, and the developer must **compare them using criteria**. The most important criterion is **functionality**: software that is cheap but cannot do a required task is useless. After that the options are compared on **compatibility** (with the hardware, the OS, other programs and the existing data), **cost**, **ease of use** for these particular users, **support**, **security**, **scalability** and **multi-user access**. No software is best on every criterion. Off-the-shelf software is cheap and available at once but may not fit exactly; bespoke software fits exactly but is expensive and slow to produce. Open-source software has no licence fee but may have less official support. The developer chooses the option whose strengths match the **most important needs of this scenario** — that is what "justify" means.

Cost is more than the purchase price. A licence may be paid **per computer** or **per user**, or as a yearly **subscription**; there may be costs for upgrades, training and support. This total over the life of the system is called the **total cost of ownership**. Free software is not always cheaper in total if staff need a lot of training to use it.

:::definition Software licence
The legal permission to use a piece of software, stating **how many computers or users** may use it, for **how long** and whether the software may be **copied or changed**. The number of licences needed is part of the technical specification.
:::

:::compare Off-the-shelf and bespoke software
| | Off-the-shelf (ready-made) | Bespoke (custom-written) |
|---|---|---|
| What it is | Bought or downloaded, the **same for many customers** | Written **specially** for one organisation |
| Cost | **Cheaper** — the cost is shared by many users | **Expensive** — programmers are paid to write it |
| Available | **Immediately** | Only after months of development |
| Fits the needs | May have **unneeded features** or **miss** some | Does **exactly** what the client needs |
| Testing and support | Already tested by many users; forums, tutorials, updates | Bugs may be found later; support only from the developer |
| Example | Microsoft Office, MySQL, Moodle | A booking system written for one hotel |
:::

:::compare Proprietary and open-source software
| | Proprietary (commercial) | Open source |
|---|---|---|
| Source code | **Closed** — users cannot see or change it | **Available** — can be studied and changed |
| Cost | Licence fee or subscription | Usually **free** to use |
| Support | Official support from the company, guaranteed updates | Community forums; paid support from some firms |
| Changes | Only the company can change it | The organisation can **adapt** it to its needs |
| Example | Windows, Microsoft Access, Adobe Photoshop | Linux, LibreOffice, MySQL Community, GIMP |
:::

:::compare Criteria for choosing software
| Criterion | Question to ask | Example of a justification |
|---|---|---|
| **Functionality** | Does it do **everything** in the requirements? | "…because it can print overdue letters, which the librarian needs" |
| **Compatibility** | Does it run on the chosen **hardware and OS**? Can it **import** the existing data? | "…because it runs on the school's Linux server and imports the old CSV files" |
| **Cost** | Price of licences for all users, subscription, upgrades, training | "…because it is free, and the school's budget is small" |
| **Ease of use** | Can **these users** learn it quickly? Is it in their **language**? | "…because the nurses have little IT experience and the interface is in Kazakh and Russian" |
| **Support and updates** | Manuals, tutorials, help desk, regular updates | "…because the supplier offers a help desk during clinic hours" |
| **Security** | User accounts, access rights, encryption, backup | "…because patient records are confidential and it encrypts the data" |
| **Scalability** | Can it cope with **more users and data** later? | "…because the shop plans to open two more branches" |
| **Multi-user access** | Can several people use it **at the same time**? | "…because five receptionists book appointments at once" |
:::

:::svg Software for a new system: system software and application software
<svg class="ts" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Layers: hardware at the bottom, then the operating system and utilities, then the application software used by the user">
  <style>
    svg.ts .l1{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ts .l2{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.ts .l3{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.ts .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ts .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="l3" x="20" y="16" width="720" height="62" rx="10"/>
  <text class="tt" x="36" y="42" style="fill:var(--success)">Application software — does the user's task</text>
  <text class="ss" x="36" y="64">DBMS (MySQL) · library application · word processor · web browser</text>
  <rect class="l2" x="20" y="90" width="720" height="62" rx="10"/>
  <text class="tt" x="36" y="116" style="fill:var(--primary)">System software — runs the computer</text>
  <text class="ss" x="36" y="138">operating system (Windows / Linux) · utilities: antivirus, backup, drivers for the scanner and printer</text>
  <rect class="l1" x="20" y="164" width="720" height="62" rx="10"/>
  <text class="tt" x="36" y="190">Hardware — chosen from the minimum requirements</text>
  <text class="ss" x="36" y="212">processor · RAM · storage · network card · barcode scanner · printer</text>
  <text class="ss" x="380" y="250" text-anchor="middle">each layer must be compatible with the layer below it</text>
</svg>
:::

## Writing a justification

:::steps How to justify a choice of software
- **Name** the software and its **type** (e.g. "MySQL — an open-source DBMS").
- Pick a **criterion** (functionality, compatibility, cost, ease of use, support, security, scalability).
- Say **what the software provides** for that criterion.
- **Link** it to a **need of the scenario** with "because" / "so that".
- Repeat for each mark: one criterion + link = usually **2 marks**.
:::

:::example Worked justification — a dental clinic
**Scenario:** a clinic in Shymkent with 4 receptionists books 120 appointments a day, keeps confidential patient records and has a small budget. The receptionists have little IT experience.

- **Operating system: Windows 11** — compatible with the clinic's existing PCs and the booking program (1), and the receptionists already know it, so little training is needed (1).
- **Booking software: an off-the-shelf clinic package** (rather than bespoke) — it is available immediately and cheaper because the cost is shared by many clinics (1); it already has appointment booking and SMS reminders, which the clinic needs (1).
- **Security:** it has user accounts with access rights and encrypts patient records, because medical data is confidential (1).
- **Multi-user:** four receptionists can book at the same time without double-booking a dentist (1).
:::

:::tip A justification has two halves
"**It is cheap**" earns little. "**It is free and open source, so the school does not pay licence fees for 30 computers**" earns the mark — the **feature** plus the **reason it matters in this scenario**.
:::

:::warning Common mistakes when justifying software
- Naming software with **no reason** ("Use Microsoft Access.").
- Reasons that fit **any** system ("it is good", "it is popular") — link to **this** scenario.
- Choosing only by **price** — the software must first meet the **requirements**.
- Forgetting the **operating system** and **utilities** (antivirus, backup) — they are part of the specification.
- Mixing up **open source** (source code available) with **freeware** (free, but the code is closed).
:::

# Writing a technical specification
@lo 11.3.2.1 11.3.1.4


## Hardware and software depend on each other

The two halves of the specification cannot be written separately. The software decides the minimum hardware; but the hardware the organisation **already owns** can also limit the software. If a school has thirty computers with 4 GB of RAM, choosing a program that needs 8 GB means buying thirty new computers or extra memory. In that case a lighter program, or a web-based system that runs on a server, may be the better justified choice. A complete specification therefore shows that **every component is compatible** with every other: the OS supports the devices (there are drivers), the application runs on that OS, and the hardware meets the combined requirements.

The final document is usually a **table** with three columns — component, minimum specification, reason — because a table is easy for the client to read and for the supplier to order from. Software appears in the same table as the hardware, each with its justification. Writing the reason in the same row as the figure makes it clear that every number was **calculated from the requirements**.

:::steps How to write a technical specification for a new system
- Read the **requirements** of the system: tasks, number of users, inputs, outputs, amount of data.
- Choose the **software**: operating system, application software (DBMS, specialised program), utilities — and **justify** each choice.
- Look up each program's **minimum requirements**.
- Work out the **processor** (highest), **RAM** (sum of what runs together), **storage** (software + data + growth).
- Add the **input and output devices** and the **network** needed by the system.
- Add a **margin** for growth and future updates; round up to standard sizes.
- Present the specification as a **table**: component — specification — reason.
:::

:::example Technical specification — reception computer at the dental clinic
| Component | Minimum specification | Reason |
|---|---|---|
| Processor | 4 cores, 2.4 GHz | Highest requirement of the booking software; runs the browser and the booking program together |
| RAM | 8 GB | Windows 4 GB + booking software 2 GB + browser 1 GB = 7 GB, rounded up |
| Storage | 256 GB SSD | Software 80 GB + local data and growth; an SSD opens patient records quickly |
| Display | 24″, 1920 × 1080 | The appointment calendar shows all dentists for a whole day |
| Input | Keyboard, mouse, ID-card reader | The card reader enters patient details from ID cards without typing errors |
| Output | Laser printer | Prints invoices and appointment cards |
| Network | Gigabit Ethernet, Internet 50 Mbps | Shared database on the clinic server; SMS reminders sent online |
| Operating system | Windows 11 | Required by the booking software; staff already know it |
| Utilities | Antivirus, automatic daily backup | Protect confidential records from malware and loss |
:::

:::svg Minimum, recommended and the chosen specification
<svg class="ts" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A RAM scale from 0 to 16 GB showing minimum 7 GB, chosen 8 GB and recommended 12 GB">
  <style>
    svg.ts .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ts .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ts .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.ts .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.ts .rec{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.ts .ln{stroke:var(--foreground);stroke-width:2}
  </style>
  <text class="tt" x="20" y="28">RAM for the library computer (GB)</text>
  <rect class="bad" x="40" y="60" width="297" height="44"/>
  <rect class="ok" x="337" y="60" width="213" height="44"/>
  <rect class="rec" x="550" y="60" width="170" height="44"/>
  <text class="tt" x="188" y="87" text-anchor="middle" style="fill:var(--danger)">below minimum: will not run</text>
  <text class="tt" x="465" y="87" text-anchor="middle" style="fill:var(--success)">runs</text>
  <text class="tt" x="635" y="87" text-anchor="middle" style="fill:var(--primary)">runs comfortably</text>
  <line class="ln" x1="40" y1="116" x2="720" y2="116"/>
  <text class="ss" x="40" y="136" text-anchor="middle">0</text><text class="ss" x="210" y="136" text-anchor="middle">4</text>
  <text class="ss" x="380" y="136" text-anchor="middle">8</text><text class="ss" x="550" y="136" text-anchor="middle">12</text><text class="ss" x="720" y="136" text-anchor="middle">16</text>
  <line class="ln" x1="337" y1="50" x2="337" y2="116"/><text class="tt" x="337" y="168" text-anchor="middle">minimum 7 GB</text>
  <line class="ln" x1="380" y1="50" x2="380" y2="116" style="stroke:var(--success)"/><text class="tt" x="380" y="190" text-anchor="middle" style="fill:var(--success)">specified 8 GB</text>
  <line class="ln" x1="550" y1="50" x2="550" y2="116" style="stroke:var(--primary)"/><text class="tt" x="550" y="168" text-anchor="middle" style="fill:var(--primary)">recommended 12 GB</text>
  <text class="ss" x="380" y="218" text-anchor="middle">the specification is never below the minimum; extra RAM allows growth and several programs at once</text>
</svg>
:::

:::compare Why specify above the minimum?
| Reason | Explanation |
|---|---|
| **Growth of data** | The database gets bigger every year; storage and RAM must cope |
| **More users** | New staff or branches add load on the server and network |
| **Updates** | New versions of the OS and software usually need more resources |
| **Several programs at once** | Users open a browser, e-mail and the system together |
| **Performance** | At the bare minimum the system is slow; users waste time |
| **Cost** | Too far above the minimum wastes money — the specification should be **justified**, not the most expensive |
:::

# Exam practice: technical specification
@lo 11.3.2.1 11.3.1.4

:::example Exam-style answers
**Q: Define the term minimum hardware requirements. [1]**
The lowest specification of hardware (processor, RAM, storage…) on which the system's software will **still run** correctly (1).

**Q: A system runs an OS (4 GB RAM), a DBMS (2 GB) and an app (2 GB) at the same time. State the minimum RAM and show how you found it. [2]**
4 + 2 + 2 = 8 GB (1) — the programs run together, so their RAM needs are **added** (1).

**Q: A supermarket's new checkout system scans products and prints receipts. Identify two devices it needs and give a reason for each. [4]**
**Barcode scanner** (1) — reads the product codes quickly and without typing errors (1). **Thermal / receipt printer** (1) — prints a receipt for every customer (1). *(Also: card payment terminal, touchscreen, customer display.)*

**Q: Explain why an SSD may be chosen for the computer that runs the clinic's database. [2]**
An SSD has **faster access** than an HDD (1), so patient records open quickly while the patient waits / many queries are answered quickly (1). *(Also: no moving parts — more reliable.)*

**Q: A school chooses open-source software for 30 classroom computers. Justify this choice using two criteria. [4]**
**Cost:** it is free (1), so the school pays no licence fee for 30 computers on a small budget (1). **Compatibility / adaptability:** it runs on the school's Linux computers / the source code can be changed (1), so the IT teacher can adapt it to the school's needs (1).

**Q: State one advantage and one disadvantage of bespoke software for a hotel's booking system. [2]**
Advantage: it does **exactly** what the hotel needs (1). Disadvantage: **expensive** / takes a long time to write / may contain bugs (1).
:::

:::warning Common mistakes in exam answers
- Adding processor speeds instead of taking the highest.
- Specifications without **units** (write 8 **GB**, 2.5 **GHz**, 256 **GB SSD**).
- A device or program named with no **reason linked to the scenario**.
- Confusing **RAM** (main memory, temporary) with **storage** (SSD / HDD, permanent).
- Justifying software only by price.
:::

:::steps Check yourself
- Define a technical specification, minimum and recommended requirements.
- List eight hardware components a specification may include, with a unit for each.
- How is the minimum CPU found? The minimum RAM? The minimum storage?
- Calculate the RAM and storage for an OS (4 GB, 40 GB), a DBMS (2 GB, 5 GB) and data of 20 GB growing 5 GB a year for 4 years.
- Give two input and two output devices for a library, a supermarket and a clinic, with reasons.
- Compare off-the-shelf and bespoke software; proprietary and open-source software.
- Name eight criteria for choosing software and write one justification linked to a scenario for each.
:::
