---
summary: The implementation stage of the system life cycle and what must be prepared (hardware, software, data conversion, training, documentation), the four methods of changing over to a new system — direct, parallel, pilot and phased — how each works, its advantages and disadvantages, a comparison of cost, risk and time, and how to choose the right method for a scenario.
---
# Implementing a new system
@lo 11.2.2.6

:::definition Implementation (changeover)
The stage of the **system life cycle** in which the **new system is installed and put into use**, replacing the old system. It comes after **design, development and testing**, and is followed by **evaluation and maintenance**.
:::

:::cards
### What must be done before changeover
- **Install the hardware** — computers, servers, network, printers, scanners.
- **Install and configure the software**, set up user accounts and access rights.
- **Convert and transfer the data** — move records from paper files or the old system into the new database, checking them (**verification**).
- **Train the users** — courses, practice sessions, online tutorials.
- **Prepare the documentation** — **user guide** for the users, **technical documentation** for future maintenance.
### Why the method matters
- The way the organisation changes over decides how much **risk**, **cost**, **time** and **extra work** the change involves.
- A failed changeover can **stop the business**, **lose data** or lose **customers**.
:::

:::cards
### Direct changeover
The old system is **stopped** and the new system is **started** at once (e.g. over a weekend).
### Parallel running
The old and new systems **run side by side** for a period; outputs are compared, then the old system is stopped.
### Pilot implementation
The new system is introduced in **one part of the organisation** (one branch, department or class) first; when it works, it is rolled out everywhere.
### Phased implementation
The new system is introduced **one module (part) at a time** across the whole organisation, until the whole system is replaced.
:::

:::ascii Timelines of the four methods (time →)
Direct    OLD ██████████|
          NEW           |██████████████
Parallel  OLD ██████████████████|
          NEW       ██████████████████████
Pilot     Branch A  ████████████████████████
          Others              ██████████████
Phased    Module 1  ████████████████████████
          Module 2         █████████████████
          Module 3                ██████████
:::

# The four methods in detail
@lo 11.2.2.6 11.2.2.7

:::cards
### Direct changeover — how it works
- A **date** is chosen; on that day the old system is **switched off** and the new one is used for **everything**.
- Often done at a quiet time (weekend, holidays).
- **Used when**: the system is small or simple, the old system has **stopped working**, or running two systems is impossible.
- *Example*: a small café replaces paper order slips with tablets on Monday morning.
### Parallel running — how it works
- Both systems process the **same data** for weeks or months.
- Outputs are **compared**; differences show errors in the new system.
- When the new system is trusted, the old one is **stopped**.
- **Used when**: failure would be **critical** — payroll, banking, hospitals, air-traffic or cargo tracking.
:::

:::cards
### Pilot implementation — how it works
- One **branch / department / class** uses the new system completely (often by direct changeover there).
- The rest of the organisation keeps the old system.
- After the pilot succeeds and problems are fixed, the system is **rolled out** to all other sites.
- **Used when**: the organisation has **many similar units** — a chain of shops, schools of a network, bank branches.
### Phased implementation — how it works
- The system is divided into **modules** (e.g. stock, sales, accounts).
- One module is introduced **across the whole organisation**, then the next, until the old system is fully replaced.
- **Used when**: the system is **large** and naturally **modular**.
- *Example*: a school's information system — first attendance, then marks, then the timetable.
:::

# Advantages and disadvantages
@lo 11.2.2.7

:::compare Advantages and disadvantages
| Method | Advantages | Disadvantages |
|---|---|---|
| **Direct** | **Fastest** and **cheapest**; no duplication of work; benefits are **immediate**; only one system to manage | **Very risky** — if the new system fails there is **no fallback**; data may be **lost**; all staff must be **trained beforehand**; stressful for users |
| **Parallel** | **Lowest risk** — the old system is a **backup**; outputs can be **compared** to check the new system; staff can learn gradually | **Most expensive** — **double work**, staff run two systems (overtime); takes **longer**; data must be entered twice, which may cause errors and confusion |
| **Pilot** | Problems affect **only the pilot area**; the system is tested in **real conditions**; staff there can **train others**; cheaper than parallel | **Slower** to roll out to everyone; the pilot area may **not represent** all others; if it fails the pilot area suffers; two systems in use in the organisation at once |
| **Phased** | Each module is **tested** and staff **learn gradually**; problems are **limited to one module**; easier to manage change | Takes a **long time**; old and new parts must **work together** (compatibility, data transfer between them); may be confusing to use two systems |
:::

:::compare Cost, risk and time
| | Direct | Parallel | Pilot | Phased |
|---|---|---|---|---|
| **Cost** | Low | **High** | Medium | Medium |
| **Risk** | **High** | **Low** | Medium–low | Medium–low |
| **Time to complete** | **Short** | Long | Long | **Long** |
| **Extra work for staff** | Low | **High** (two systems) | In pilot area | During each phase |
| **Backup if the new system fails** | **None** | Old system | Old system elsewhere | Old modules |
:::

# Choosing a method
@lo 11.2.2.7

:::compare Which method suits which situation?
| Situation | Method | Reason |
|---|---|---|
| A tracking system for cargo ships at a port, where failure is unacceptable | **Parallel** | The old system continues if the new one fails; results can be compared |
| A school introduces a hobby-club system class by class | **Pilot** | Test in one group before the whole school |
| A small café replaces paper orders with tablets | **Direct** | Simple, cheap, low risk; the café can start at once |
| A bank introduces new software module by module (accounts, then loans, then cards) | **Phased** | Each part is tested before the next |
| The old computer system has broken down completely | **Direct** | The old system cannot be used, so there is no alternative |
| A supermarket chain with 40 identical shops | **Pilot** | Try in one shop, fix problems, then copy to the others |
| A hospital's patient records system | **Parallel** | Errors could harm patients; the old system acts as a backup |
:::

:::steps How to answer "choose and justify" questions
- **State** the method.
- **Link** it to the scenario: risk, cost, size, number of branches, modules.
- Give the **advantage** that matters in this scenario.
- Optionally mention a **disadvantage** and why it is acceptable here.
:::

:::example Model answer
**Q: A network of mathematics clubs (15 clubs) is introducing a new management system. Recommend an implementation method and justify it. [3]**
**Pilot** implementation (1). The system can be introduced in **one club** first, so any problems affect only that club and can be fixed before the other 14 clubs change over (1). Staff in the pilot club gain experience and can **train** the staff of other clubs, and it is cheaper than running two systems everywhere (1).
:::

:::tip
Choose the method from **the risk and the cost** in the scenario: critical systems → parallel; many similar branches → pilot; modular system → phased; small/simple or the old system is unusable → direct.
:::

# Exam practice and summary
@lo 11.2.2.6 11.2.2.7

:::example Exam-style answers
**Q: List four methods of system implementation. [2]**
Direct, parallel (1); pilot, phased (1).

**Q: Describe parallel running. [2]**
The old and new systems **run at the same time** with the same data (1); outputs are **compared** and the old system is stopped when the new one is shown to work (1).

**Q: Give one advantage and one disadvantage of direct changeover. [2]**
Advantage: **fast / cheap**, benefits immediately (1). Disadvantage: **no backup** — if the new system fails, data and work may be lost (1).

**Q: Explain why phased implementation may be chosen for a large system. [2]**
Each **module** is introduced and tested separately (1), so problems are limited to one part and staff learn the system **gradually** (1).
:::

:::warning Common mistakes
- Mixing up **pilot** (one **place** gets the whole system) and **phased** (the whole organisation gets one **part** at a time).
- Saying parallel running is "cheap" — it is the **most expensive**.
- Giving an advantage without linking it to the **scenario** in "justify" questions.
- Forgetting **training** and **data conversion** when describing implementation.
:::

:::steps Check yourself
- What tasks must be completed before changeover?
- Describe each of the four methods in one sentence.
- Which method has the lowest risk? The lowest cost? The shortest time?
- Recommend a method for a hospital, a café and a chain of 30 schools.
- Compare pilot and phased implementation.
:::
