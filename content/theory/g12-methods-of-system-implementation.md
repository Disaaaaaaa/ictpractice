---
summary: The four methods of implementing (changing over to) a new system — direct, parallel, pilot and phased — how each works, their advantages and disadvantages, and how to choose the right method for a scenario.
---
# System implementation (changeover)
@lo 12.2.1.7

:::definition System implementation (changeover)
The stage of the system life cycle in which the **new system is installed and put into use**, replacing the **old system**. It includes installing hardware and software, **transferring (converting) data** from the old system, **training users** and choosing a **changeover method**.
:::

There are **four** implementation methods. They differ in **how quickly** the old system is replaced and **how much risk** the organisation takes if the new system fails.

:::ascii The four implementation methods (old system = ███, new system = ░░░)
Direct    old ███████████|░░░░░░░░░░░░░  new    the old system stops one day, the new one starts the next
Parallel  old ███████████████████████|          both systems run together for a period
          new        ░░░░░░░░░░░░░░░░░░░░░░
Pilot     dept A   ███|░░░░░░░░░░░░░░░░░░       one department / branch tries it first,
          dept B   ██████████|░░░░░░░░░░       then everyone changes
Phased    module 1 ███|░░░░░░░░░░░░░░░░░░       the system is introduced part by part
          module 2 ███████|░░░░░░░░░░░░░░
          module 3 ███████████|░░░░░░░░░░
:::

# Direct changeover
@lo 12.2.1.7 12.2.1.8

:::definition Direct changeover
The old system is **stopped completely** and the new system is **started immediately** in its place — on a fixed date ("big bang").
:::

:::compare Direct changeover
| Advantages | Disadvantages |
|---|---|
| **Fastest** method — benefits of the new system immediately | **Very risky** — if the new system fails there is **no backup** system to fall back on |
| **Cheapest** — only one system is run, no duplicate work | Data may be **lost** if the new system has errors |
| Staff do not have to use two systems | **All staff** must be trained before the changeover date |
| Simple to plan | Problems affect the **whole organisation** at once |
:::

:::example When direct changeover is suitable
- A **café** introduces electronic ordering instead of ordering from staff — small, simple system; a short failure is not dangerous.
- The old system **no longer works** or is completely different, so running both is impossible.
- A **new organisation** with no old system.
:::

# Parallel running
@lo 12.2.1.7 12.2.1.8

:::definition Parallel running
The **old and new systems run at the same time** for a period. The same data is entered into both and the **results are compared**. When the new system is shown to be reliable, the old one is stopped.
:::

:::compare Parallel running
| Advantages | Disadvantages |
|---|---|
| **Safest** — the old system is a **backup** if the new one fails | **Most expensive** — two systems, more staff time |
| Results of the new system can be **checked** against the old one | **Double workload** — data entered twice; staff may be overworked |
| Staff can be **trained gradually** while the old system still works | Takes **longer** to complete the changeover |
| No data is lost | Staff may keep relying on the old system |
:::

:::example When parallel running is suitable
- **Critical** systems where failure is unacceptable: a **seaport** tracking cargo ships, **hospital / clinic** records, **banking**, **payroll**.
- When the new system's results must be **checked against** the old one.
:::

# Pilot implementation
@lo 12.2.1.7 12.2.1.8

:::definition Pilot implementation
The **whole new system** is introduced in **one part of the organisation first** — one department, branch, shop or class. When it works well there, it is introduced in all the other parts.
:::

:::compare Pilot implementation
| Advantages | Disadvantages |
|---|---|
| If the system fails, **only one part** of the organisation is affected | Takes **longer** than direct changeover before everyone uses the system |
| Errors are found and fixed **before** the full rollout | The pilot site may not be **typical** of the others |
| Staff in the pilot can **train** other staff later | Two systems exist in the organisation at the same time |
| Cheaper and less risky than parallel for the whole organisation | If the pilot fails, that department is still badly affected |
:::

:::example When pilot implementation is suitable
- A **supermarket chain** tries a new checkout system in **one shop**.
- A **school** introduces a new club-management system for **one grade** before the whole school.
- A bank tests new software in **one branch**.
:::

# Phased implementation
@lo 12.2.1.7 12.2.1.8

:::definition Phased implementation
The new system is introduced **gradually, one part (module / function) at a time**, across the whole organisation. Each phase is introduced only when the previous one works.
:::

:::compare Phased implementation
| Advantages | Disadvantages |
|---|---|
| If one module fails, only **that part** of the system is affected | **Slowest** method — the full system is in use only after all phases |
| Staff learn the system **gradually**, one part at a time | Old and new parts must **work together** (interfaces), which can be complex |
| Errors in each phase are fixed before the next | Requires careful **planning** |
| Spreads the **cost** over time | Benefits of the full system arrive late |
:::

:::example When phased implementation is suitable
- A large **ERP** system: first **accounts**, then **stock control**, then **payroll**.
- A school system: first **attendance**, then **marks**, then **reports to parents**.
- A system that can be divided into **independent modules**.
:::

# Comparing and choosing a method
@lo 12.2.1.8

:::compare The four methods compared
| | Direct | Parallel | Pilot | Phased |
|---|---|---|---|---|
| Speed | **Fastest** | Slow | Medium | **Slowest** |
| Cost | **Lowest** | **Highest** | Medium | Medium |
| Risk if the new system fails | **Highest** | **Lowest** | Low — one site | Low — one module |
| Backup | None | Old system | Old system at other sites | Old parts still in use |
| Staff workload | Normal | **Double** | Extra at the pilot site | Spread over time |
| Best for | Small, simple or non-critical systems; old system unusable | **Critical** systems (bank, hospital, port) | Organisations with **many similar branches / departments** | Large systems with **separate modules** |
:::

:::steps How to choose a method for a scenario
- How **critical** is the system? If failure is dangerous or very costly → **parallel**.
- Does the organisation have **several similar sites** (shops, branches, classes)? → **pilot**.
- Can the system be split into **independent parts**? → **phased**.
- Is it **small**, cheap, urgent, or is the old system **unusable**? → **direct**.
- Always **justify** the choice with details from the scenario, and mention the trade-off (cost, time, risk).
:::

:::example Choose the method (exam style)
| Situation | Method | Reason |
|---|---|---|
| A system that tracks the arrival of cargo ships at the seaport is being replaced | **Parallel** | Critical; errors could cause accidents or losses, so the old system is kept as a backup |
| A school introduces a new system for managing hobby clubs, first for one group of students | **Pilot** | Tested on part of the school before all students use it |
| A café lets customers order electronically instead of ordering from staff | **Direct** | Small, simple and not critical; quick and cheap |
| A city hospital replaces patient records, prescriptions and billing over a year | **Phased** | Large system with separate modules introduced one at a time |
:::

# Exam practice and summary
@lo 12.2.1.7 12.2.1.8

:::example Exam-style answers
**Q: List the four methods of system implementation. [2]**
**Direct**, **parallel**, **pilot**, **phased** (any two for 1 mark, all four for 2).

**Q: Choose one type of system implementation that could be used by the clinic, and give one advantage and one disadvantage. [3]**
**Parallel** (1). Advantage: the **old system is available as a backup** / results can be compared (1). Disadvantage: **expensive** and **double work** for staff (1).
*(Or **direct**: advantage — fastest / cheapest; disadvantage — very risky, no backup.)*

**Q: Compare pilot and phased implementation. [2]**
Pilot introduces the **whole system in one part of the organisation** first (1), **whereas** phased introduces the system **one module at a time** across the **whole organisation** (1).
:::

:::warning Common mistakes
- Confusing **pilot** (one **location** gets the **whole** system) with **phased** (everyone gets **one part** at a time).
- Saying parallel running is "fast" — it is the **slowest and most expensive**, but the **safest**.
- Choosing a method without **linking** the reason to the scenario.
- Forgetting **data conversion** and **training**, which are needed with every method.
:::

:::steps Check yourself
- Describe each of the four implementation methods.
- Give two advantages and two disadvantages of each.
- Which method is the safest? The fastest? The cheapest?
- What is the difference between pilot and phased implementation?
- Choose and justify a method for: a new airline booking system; a new library system in one school of a network of 20 schools; a new online menu for a small café.
:::
