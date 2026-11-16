---
summary: Why a system implementation plan is important, what it contains (method, schedule, hardware and software installation, data conversion, staff training, testing, responsibilities, risks and support), and how to make an implementation plan with a task table, dependencies, milestones and a Gantt chart.
---
# The system implementation plan
@lo 12.2.1.9

:::definition System implementation
The stage of the system life cycle in which the new system is **installed, the data is transferred, users are trained and the organisation changes over** from the old system to the new one.
:::

:::definition System implementation plan
A document that describes **how, when and by whom** a new system will be **installed and put into use**, replacing the old system. It lists **every task**, its **order**, **dates**, the **people responsible**, the **resources** needed and what to do **if something goes wrong**.
:::

Implementing a new system involves many people (developers, managers, staff, suppliers) and many tasks that depend on each other: the hardware must be installed before the software, the data must be converted before the system goes live, staff must be trained before they use it. Without a plan, tasks are forgotten, done in the wrong order or late.

:::svg Where the implementation plan fits in the system life cycle
<svg class="nsi" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="System life cycle stages ending with review; the implementation plan is written before implementation and guides installation, data conversion, training and changeover">
  <style>
    svg.nsi .st{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nsi .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nsi .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nsi .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nsi .ah{fill:var(--muted)}
  </style>
  <rect class="st" x="10" y="20" width="110" height="50" rx="10"/><text class="tt" x="65" y="50" text-anchor="middle">Analysis</text>
  <path class="ah" d="M124,39 l10,6 l-10,6 z"/>
  <rect class="st" x="138" y="20" width="110" height="50" rx="10"/><text class="tt" x="193" y="50" text-anchor="middle">Design</text>
  <path class="ah" d="M252,39 l10,6 l-10,6 z"/>
  <rect class="st" x="266" y="20" width="120" height="50" rx="10"/><text class="tt" x="326" y="50" text-anchor="middle">Development</text>
  <path class="ah" d="M390,39 l10,6 l-10,6 z"/>
  <rect class="st" x="404" y="20" width="100" height="50" rx="10"/><text class="tt" x="454" y="50" text-anchor="middle">Testing</text>
  <path class="ah" d="M508,39 l10,6 l-10,6 z"/>
  <rect class="on" x="522" y="20" width="130" height="50" rx="10"/><text class="tt" x="587" y="50" text-anchor="middle" style="fill:var(--primary)">Implementation</text>
  <path class="ah" d="M656,39 l10,6 l-10,6 z"/>
  <rect class="st" x="670" y="20" width="80" height="50" rx="10"/><text class="tt" x="710" y="50" text-anchor="middle">Review</text>
  <path d="M587,74 V96" style="stroke:var(--primary);stroke-width:2"/>
  <rect class="on" x="150" y="96" width="600" height="90" rx="12"/>
  <text class="tt" x="166" y="120" style="fill:var(--primary)">Implementation plan — the "how, when and by whom" of this stage</text>
  <text class="ss" x="166" y="144">method · schedule · hardware · software and accounts · data conversion · staff training</text>
  <text class="ss" x="166" y="166">acceptance testing · responsibilities · budget · risks and contingency · support · review</text>
</svg>
:::

:::cards
### Why the plan is important
- Makes sure **no task is forgotten** (data conversion, training, backups).
- Puts tasks in the **correct order** and shows **dependencies**.
- Sets **deadlines** and **milestones** so the system goes live **on time**.
- Gives each task a **responsible person** — everyone knows their role.
- Controls the **budget** and **resources** (equipment, staff time, trainers).
- **Reduces risk**: plans a **backup** and what to do if the new system fails (contingency).
- **Minimises disruption** to the organisation's normal work (e.g. installing at weekends).
- Allows managers to **monitor progress** and check the implementation was successful.
### What can go wrong without a plan
- Staff are **not trained** when the system starts, so mistakes are made.
- **Data is lost** or entered incorrectly during conversion.
- Hardware arrives **late**, so the go-live date is missed.
- No **backup** of the old system — the business stops if the new one fails.
- Costs run **over budget**; two teams do the same job while another is forgotten.
:::

:::compare Implementation with and without a plan
| | Without a plan | With a plan |
|---|---|---|
| Order of tasks | Software installed before the network is ready; training after go-live | Tasks follow their **dependencies** |
| Time | Go-live date missed; staff do not know when to prepare | **Dates and milestones** known to everyone |
| People | "I thought you were doing that" | A **responsible person** for every task |
| Data | Old records lost or copied with errors | **Backup**, conversion and **verification** planned |
| Risk | The business stops if the new system fails | **Contingency plan**: fall back to the old system or the backup |
| Success | Nobody checks whether the system works as required | **Review** against the requirements on a set date |
:::

:::warning Implementation plan ≠ implementation method
The **method** (direct, parallel, pilot, phased) is only **one element** of the plan. A plan that says only "we will use parallel running" is not a plan: it also needs the schedule, installation, data conversion, training, testing, responsibilities and contingency.
:::

# What the plan contains
@lo 12.2.1.9 12.2.1.10

:::compare Elements of a system implementation plan
| Element | What it describes | Example (school library) |
|---|---|---|
| **Implementation method** | Direct, parallel, pilot or phased — and why it was chosen | Parallel running for 4 weeks — loans must not be lost |
| **Schedule / timetable** | The tasks, their **start and end dates**, their order and **milestones** (often a Gantt chart) | 01.11 – 20.12; go-live 24.11 |
| **Hardware installation** | What equipment is bought and installed, where, and when | 3 PCs, 2 barcode scanners, network points |
| **Software installation** | Installing and configuring the application, OS, database; **user accounts and access rights** | Accounts for 3 librarians; students read-only |
| **Data conversion (migration)** | How data is **transferred** from the old system and how it is **checked** | 2 400 book records typed in, double entry |
| **Staff training** | **Who** is trained, the **method**, the **timing**, who runs it | Two 2-hour sessions before go-live |
| **Testing before go-live** | Final **acceptance testing** with the client; checking converted data | Test loans and returns with the librarian |
| **Responsibilities** | The person or team responsible for each task | IT technician, developer, librarian |
| **Resources and budget** | Equipment, staff time, trainers, costs | 2 assistants for 2 weeks |
| **Risks and contingency plan** | What could go wrong and what to do | Restore from backup; continue on paper |
| **Documentation and support** | User guide, technical documentation, help desk after go-live | Quick guide at the desk; developer on call |
| **Review / evaluation** | How and when the success of the implementation will be checked | Review meeting on 10.01 |
:::

## Data conversion

:::definition Data conversion (data migration)
Transferring the existing data from the **old system** (paper records or old files) into the **new system**, in the **format** the new system needs, and **checking** that it was transferred **completely and correctly**.
:::

:::svg Data conversion: back up, transfer, check, then go live
<svg class="nsi" viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Old data is backed up, transferred by manual entry or import, verified, and only then used by the new system; if checks fail the data is restored from the backup">
  <style>
    svg.nsi .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nsi .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nsi .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nsi .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.nsi .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nsi .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nsi .ah{fill:var(--muted)}
    svg.nsi .ar{fill:none;stroke:var(--muted);stroke-width:1.8}
  </style>
  <rect class="bx" x="10" y="30" width="130" height="64" rx="10"/><text class="tt" x="75" y="56" text-anchor="middle">Old data</text><text class="ss" x="75" y="76" text-anchor="middle">paper / old files</text>
  <path class="ah" d="M146,56 l10,6 l-10,6 z"/>
  <rect class="on" x="162" y="30" width="130" height="64" rx="10"/><text class="tt" x="227" y="56" text-anchor="middle" style="fill:var(--primary)">1 Back up</text><text class="ss" x="227" y="76" text-anchor="middle">full copy kept</text>
  <path class="ah" d="M298,56 l10,6 l-10,6 z"/>
  <rect class="on" x="314" y="30" width="140" height="64" rx="10"/><text class="tt" x="384" y="56" text-anchor="middle" style="fill:var(--primary)">2 Transfer</text><text class="ss" x="384" y="76" text-anchor="middle">type in / import</text>
  <path class="ah" d="M460,56 l10,6 l-10,6 z"/>
  <rect class="on" x="476" y="30" width="130" height="64" rx="10"/><text class="tt" x="541" y="56" text-anchor="middle" style="fill:var(--primary)">3 Verify</text><text class="ss" x="541" y="76" text-anchor="middle">counts, samples</text>
  <path class="ah" d="M612,56 l10,6 l-10,6 z"/>
  <rect class="ok" x="628" y="30" width="122" height="64" rx="10"/><text class="tt" x="689" y="56" text-anchor="middle" style="fill:var(--success)">4 Go live</text><text class="ss" x="689" y="76" text-anchor="middle">correct data</text>
  <path class="ar" d="M541,98 V140 H260"/><path class="ah" d="M260,134 l-10,6 l10,6 z"/>
  <rect class="no" x="20" y="120" width="230" height="44" rx="10"/><text class="tt" x="135" y="147" text-anchor="middle" style="fill:var(--danger)">errors → restore from backup</text>
  <text class="ss" x="400" y="160" text-anchor="middle">checks fail</text>
</svg>
:::

:::compare Data conversion methods
| Method | Use | Advantages | Disadvantages | Check |
|---|---|---|---|---|
| **Manual entry** — typing data from paper records | Old system was paper-based | No special software needed; data can be tidied while typing | Slow, needs staff time; typing errors | **Verification**: double entry / visual check |
| **Import / export** — data copied from old files into the new database (CSV, SQL scripts) | Old system was computerised | Fast for thousands of records; fewer typing errors | Formats may not match; faulty records copied too | Compare **record counts and totals**; sample checks |
| **Conversion program** written to change the format | Old and new formats are very different | Automatic, repeatable | Must be written and tested — extra cost | Test the program on a **copy** first |
:::

:::tip Back up before converting
Always make a **full backup of the old data** before conversion begins, so nothing is lost if the conversion fails. Then **verify** the converted data — compare the number of records, totals (e.g. the sum of all balances) and a sample of records with the originals.
:::

## Staff training

:::compare Staff training methods
| Method | Advantages | Disadvantages |
|---|---|---|
| **Classroom / group sessions** with a trainer | Questions answered immediately; many staff at once | Staff away from work; one pace for all |
| **One-to-one training** | Matches the learner's needs | Expensive, slow for many staff |
| **Online courses / video tutorials** | Any time, at the learner's own pace; cheap to repeat | No immediate help; staff may skip it |
| **User manuals / quick guides** | Always available for reference | Some people do not read them |
| **"Train the trainer"** — key users train colleagues | Cheaper; trainers know the workplace | Quality depends on the key users |
| **Practice / training mode of the system** | Hands-on with realistic data, no risk | Takes time to set up |
:::

:::cards
### Who is trained
- **Users** — how to do their everyday tasks.
- **Managers** — reports and settings.
- **Technical staff** — backups, accounts, fixing faults.
### When
- **Before go-live**, close to it, so staff remember.
- Refresher sessions and help **after** go-live.
- Outside busy hours / in shifts so work continues.
:::

# Making an implementation plan
@lo 12.2.1.10

:::definition Dependency
A task that **cannot start until another task has finished** — e.g. staff training depends on the software being installed. Dependencies decide the **order** of the tasks.
:::

:::definition Milestone
An important **point in the schedule** that marks the **end of a stage**, with a date but no duration — e.g. "hardware installed", "go-live", "old system switched off". Managers use milestones to check that the project is **on time**.
:::

:::definition Contingency plan
A plan of **what to do if something goes wrong** during implementation — e.g. restore the data from the backup, go back to the old system, use a temporary manual procedure.
:::

:::steps How to write the plan
- Choose the **implementation method** and justify it for the organisation.
- List **all tasks**: backup, hardware, software and accounts, data conversion, training, testing, go-live, support, review.
- Put the tasks in **order** and note which depend on others.
- Estimate the **duration** of each task and set **dates** and **milestones**.
- Assign a **responsible person** to each task.
- List **resources** and the **budget**.
- Identify **risks** and write a **contingency plan**.
- Show the plan as a **table** and a **Gantt chart**.
:::

:::example Implementation plan — new library system for a school (parallel running)
| No. | Task | Start | End | Responsible | Depends on |
|---|---|---|---|---|---|
| 1 | Back up all existing paper and electronic records | 01.11 | 02.11 | Librarian | — |
| 2 | Install 3 PCs, barcode scanners and network points | 03.11 | 05.11 | IT technician | — |
| 3 | Install the library software and database; create user accounts | 06.11 | 07.11 | Developer | 2 |
| 4 | Enter book records (2 400 books) and student records; verify by double entry | 08.11 | 20.11 | Librarian + 2 assistants | 3 |
| 5 | Train library staff (two 2-hour sessions) | 18.11 | 21.11 | Developer | 3 |
| 6 | Show students how to search the catalogue (class visits) | 22.11 | 29.11 | Librarian | 5 |
| 7 | Acceptance testing with test loans | 21.11 | 22.11 | Developer + Librarian | 4, 5 |
| 8 | **Parallel running**: loans recorded in both systems | 24.11 | 19.12 | Librarian | 7 |
| 9 | Compare results; stop the old paper system | 20.12 | 20.12 | Head of IT | 8 |
| 10 | Review meeting and evaluation report | 10.01 | 10.01 | Project manager | 9 |
:::

:::svg Gantt chart for the library plan
<svg class="nsi" viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gantt chart of the library implementation plan: backup, hardware, software, data entry, training, testing, parallel running for four weeks, stopping the old system and a review in January">
  <style>
    svg.nsi .lb{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nsi .ax{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nsi .gr{stroke:var(--border);stroke-width:1;stroke-dasharray:3 4}
    svg.nsi .bar{fill:var(--primary)}
    svg.nsi .par{fill:var(--success)}
    svg.nsi .ms{fill:var(--danger)}
  </style>
  <line class="gr" x1="200" y1="40" x2="200" y2="330"/><text class="ax" x="200" y="32" text-anchor="middle">1 Nov</text>
  <line class="gr" x1="306" y1="40" x2="306" y2="330"/><text class="ax" x="306" y="32" text-anchor="middle">15 Nov</text>
  <line class="gr" x1="428" y1="40" x2="428" y2="330"/><text class="ax" x="428" y="32" text-anchor="middle">1 Dec</text>
  <line class="gr" x1="535" y1="40" x2="535" y2="330"/><text class="ax" x="535" y="32" text-anchor="middle">15 Dec</text>
  <line class="gr" x1="664" y1="40" x2="664" y2="330"/><text class="ax" x="664" y="32" text-anchor="middle">1 Jan</text>
  <text class="lb" x="12" y="65">1 Back up old records</text>
  <rect class="bar" x="200" y="53" width="15" height="18" rx="4"/>
  <text class="lb" x="12" y="93">2 Install hardware</text>
  <rect class="bar" x="215" y="81" width="23" height="18" rx="4"/>
  <text class="lb" x="12" y="121">3 Software, accounts</text>
  <rect class="bar" x="238" y="109" width="15" height="18" rx="4"/>
  <text class="lb" x="12" y="149">4 Data entry + verify</text>
  <rect class="bar" x="253" y="137" width="99" height="18" rx="4"/>
  <text class="lb" x="12" y="177">5 Staff training</text>
  <rect class="bar" x="329" y="165" width="30" height="18" rx="4"/>
  <text class="lb" x="12" y="205">6 Student sessions</text>
  <rect class="bar" x="360" y="193" width="61" height="18" rx="4"/>
  <text class="lb" x="12" y="233">7 Acceptance testing</text>
  <rect class="bar" x="352" y="221" width="15" height="18" rx="4"/>
  <text class="lb" x="12" y="261">8 Parallel running</text>
  <rect class="par" x="375" y="249" width="198" height="18" rx="4"/>
  <text class="lb" x="12" y="289">9 Stop old system</text>
  <path class="ms" d="M576,277 l9,9 l-9,9 l-9,-9 z"/>
  <text class="lb" x="12" y="317">10 Review</text>
  <path class="ms" d="M736,305 l9,9 l-9,9 l-9,-9 z"/>
  <rect class="bar" x="200" y="344" width="22" height="12" rx="3"/><text class="ax" x="228" y="355">task</text>
  <rect class="par" x="290" y="344" width="22" height="12" rx="3"/><text class="ax" x="318" y="355">parallel running (old + new)</text>
  <path class="ms" d="M520,344 l7,6 l-7,6 l-7,-6 z"/><text class="ax" x="534" y="355">milestone</text>
</svg>
:::

:::definition Gantt chart
A **bar chart of the schedule**: each task is a row, time runs from left to right, and the length of a bar shows when the task **starts and ends**. Overlapping bars show tasks done **at the same time**; diamonds show **milestones**.
:::

:::compare Plan table and Gantt chart
| | Plan table | Gantt chart |
|---|---|---|
| Shows | Task, dates, **responsible person**, **dependencies**, resources | **When** each task happens and **how long** it takes |
| Best for | Details: who does what | The **overall timeline** at a glance; overlapping tasks |
| Used to | Allocate work | **Monitor progress**: is the project on time? |
:::

:::example Reading the plan
- Task 4 lasts **13 days** (08.11 – 20.11, counting both days).
- Tasks 4 and 5 **overlap** (18.11 – 20.11): staff are trained while the last records are typed in.
- Task 7 depends on tasks 4 **and** 5 — testing cannot start until the data is entered and the staff are trained.
- If the scanners (task 2) arrive late, tasks 3, 4, 5, 7, 8 and 9 all move later — the go-live **milestone** is missed.
:::

:::compare Contingency plan
| Risk | Action |
|---|---|
| The new system crashes during parallel running | Continue with the paper system; developer fixes the fault |
| Data entry takes longer than planned | Two more assistants; parallel running starts later |
| Scanners are delivered late | Use keyboard entry of barcodes temporarily |
| Data lost during conversion | Restore from the backup made in task 1 |
| Key member of staff ill on training day | Second session / video recording of the training |
:::

:::warning Common mistakes in a plan
- Training staff **after** the go-live date.
- Data conversion **before** the software is installed, or **no backup** before conversion.
- Tasks with **no dates** or **no responsible person**.
- No **acceptance testing** before go-live.
- No **contingency** — "nothing will go wrong".
- Stopping the old system **before** the new one has been checked.
:::

# Exam practice and summary
@lo 12.2.1.9 12.2.1.10

:::example Exam-style answers
**Q: The system implementation plan specifies the method of implementing the new system. State two more elements that are described in this plan. [2]**
Determine the **training method** for personnel (1); determine the **timing of staff training** / plan for **installation of the application** / **data conversion** / **schedule** / **responsible persons** (1).

**Q: Explain the importance of making a system implementation plan. [2]**
It makes sure all tasks — installation, data conversion, training — are done in the **correct order and on time** (1), so the changeover causes **little disruption** and **risks** such as data loss are reduced (1).

**Q: Explain why data should be verified after conversion. [2]**
Errors can be made when **copying or typing** the data into the new system (1); verification (double entry / comparing record counts with the original) ensures the new system starts with **accurate data** (1).

**Q: A clinic's plan schedules staff training on the day after go-live. Explain why this is a problem and suggest a change. [3]**
Staff would use the system **without knowing how** (1), so they make mistakes with appointments / patients wait (1). Move training to the days **just before** go-live / after the software is installed (1).

**Q: Explain what is meant by a milestone and give an example. [2]**
A point in the schedule marking the **end of a stage**, used to check progress (1), e.g. "go-live on 24.11" / "all data converted" (1).

**Q: Describe a contingency plan for a shop changing over to a new sales system. [2]**
If the new system fails, the shop **returns to the old tills / manual receipts** (1) and restores data **from the backup** made before the changeover (1).
:::

:::warning Common mistakes
- Listing only the **method** — the plan also covers schedule, installation, data conversion, training, testing and contingency.
- Training staff **after** the system goes live.
- Forgetting to **back up** the old data before conversion.
- A plan without **dates** or **responsible people**.
- Answers about "the system" in general — link each point to the **scenario** (clinic, shop, school).
:::

:::steps Check yourself
- Define a system implementation plan and give four reasons why it is important.
- List ten elements of an implementation plan.
- Describe three methods of data conversion and how the converted data is checked.
- Compare four methods of staff training; when should training happen?
- Define dependency, milestone, contingency plan and Gantt chart.
- Write an implementation plan (tasks, dates, responsible person, dependencies) and draw a Gantt chart for a new attendance system in a school.
:::
