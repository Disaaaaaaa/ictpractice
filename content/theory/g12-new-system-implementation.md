---
summary: Why a system implementation plan is important, what it contains (method, schedule, hardware and software installation, data conversion, staff training, testing, responsibilities, risks and support), and how to make an implementation plan with a timeline for a new system.
---
# The system implementation plan
@lo 12.2.1.9

:::definition System implementation plan
A document that describes **how, when and by whom** a new system will be **installed and put into use**, replacing the old system. It lists **every task**, its **order**, **dates**, the **people responsible**, the **resources** needed and what to do **if something goes wrong**.
:::

Implementing a new system involves many people (developers, managers, staff, suppliers) and many tasks that depend on each other: the hardware must be installed before the software, the data must be converted before the system goes live, staff must be trained before they use it. Without a plan, tasks are forgotten, done in the wrong order or late.

:::cards
### Why the plan is important
- Makes sure **no task is forgotten** (data conversion, training, backups).
- Puts tasks in the **correct order** and shows **dependencies**.
- Sets **deadlines** so the system goes live **on time**.
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
- Costs run **over budget**.
:::

# What the plan contains
@lo 12.2.1.9 12.2.1.10

:::compare Elements of a system implementation plan
| Element | What it describes |
|---|---|
| **Implementation method** | Direct, parallel, pilot or phased — and why it was chosen |
| **Schedule / timetable** | The tasks, their **start and end dates**, their order and **milestones** (often a Gantt chart) |
| **Hardware installation** | What equipment is bought and installed, where, and when (computers, servers, network, scanners) |
| **Software installation** | Installing and configuring the application, OS, database; setting up **user accounts and access rights** |
| **Data conversion (migration)** | How data is **transferred** from the old system (manual entry, import from files), and how it is **checked** (verification) |
| **Staff training** | **Who** is trained, the **training method**, the **timing** of training, who runs it |
| **Testing before go-live** | Final **acceptance testing** with the client; checking converted data |
| **Responsibilities** | The person or team responsible for each task |
| **Resources and budget** | Equipment, staff time, trainers, costs |
| **Risks and contingency plan** | What could go wrong and what to do (backup of the old data, rollback to the old system) |
| **Documentation and support** | User guide, technical documentation, help desk after go-live |
| **Review / evaluation** | How and when the success of the implementation will be checked |
:::

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

:::compare Data conversion methods
| Method | Use | Check |
|---|---|---|
| **Manual entry** — typing data from paper records | Old system was paper-based | **Verification**: double entry / visual check |
| **Import / export** — data copied from old files into the new database (CSV, SQL scripts) | Old system was computerised | Compare record counts and totals; sample checks |
| **Conversion program** written to change the format | Old and new formats are very different | Test the program on a copy first |
:::

:::tip Back up before converting
Always make a **full backup of the old data** before conversion begins, so nothing is lost if the conversion fails.
:::

# Making an implementation plan
@lo 12.2.1.10

:::steps How to write the plan
- Choose the **implementation method** and justify it.
- List **all tasks**: hardware, software, accounts, data conversion, training, testing, go-live, support, review.
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

:::ascii Gantt chart for the library plan (each ■ ≈ 2 days)
Task                         Nov 1        Nov 15        Dec 1        Dec 15      Jan 10
1 Backup                     ■
2 Hardware                    ■■
3 Software, accounts            ■
4 Data entry + verification      ■■■■■■
5 Staff training                       ■■
6 Student sessions                       ■■■■
7 Acceptance testing                    ■
8 Parallel running                        ■■■■■■■■■■■■■
9 Stop old system                                        ■
10 Review                                                                   ■
:::

:::compare Contingency plan
| Risk | Action |
|---|---|
| The new system crashes during parallel running | Continue with the paper system; developer fixes the fault |
| Data entry takes longer than planned | Two more assistants; parallel running starts later |
| Scanners are delivered late | Use keyboard entry of barcodes temporarily |
| Data lost during conversion | Restore from the backup made in task 1 |
:::

# Exam practice and summary
@lo 12.2.1.9 12.2.1.10

:::example Exam-style answers
**Q: The system implementation plan specifies the method of implementing the new system. State two more elements that are described in this plan. [2]**
Determine the **training method** for personnel (1); determine the **timing of staff training** / plan for **installation of the application** / **data conversion** / **schedule** / **responsible persons** (1).

**Q: Explain the importance of making a system implementation plan. [2]**
It makes sure all tasks — installation, data conversion, training — are done in the **correct order and on time** (1), so the changeover causes **little disruption** and **risks** such as data loss are reduced (1).

**Q: Explain why data should be verified after conversion. [2]**
Errors can be made when **copying or typing** the data into the new system (1); verification (double entry / comparing with the original) ensures the new system starts with **accurate data** (1).
:::

:::warning Common mistakes
- Listing only the **method** — the plan also covers schedule, installation, data conversion, training, testing and contingency.
- Training staff **after** the system goes live.
- Forgetting to **back up** the old data before conversion.
- A plan without **dates** or **responsible people**.
:::

:::steps Check yourself
- Give four reasons why an implementation plan is important.
- List eight elements of an implementation plan.
- Compare three methods of staff training.
- Describe two methods of data conversion and how the data is checked.
- Write an implementation plan (tasks, dates, responsibilities) for a new attendance system in a school.
:::
