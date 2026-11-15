---
summary: The four methods of implementing (changing over to) a new system — direct, parallel, pilot and phased — how each works, their advantages and disadvantages compared on speed, cost and risk, and how to choose and justify the right method for a scenario.
---
# System implementation (changeover)
@lo 12.2.1.7

:::definition System implementation (changeover)
The stage of the system life cycle in which the **new system is installed and put into use**, replacing the **old system**. It includes installing hardware and software, **transferring (converting) data** from the old system, **training** staff and **changing over** to the new way of working.
:::

:::definition Implementation method (changeover method)
The **plan for how the old system is replaced by the new one** — all at once, side by side, in one place first, or one part at a time. The four methods are **direct**, **parallel**, **pilot** and **phased**.
:::

:::cards
### Tasks in every implementation
- **Install** the hardware, network and software.
- **Convert data** — move the existing records into the new system's files or database, and check them.
- **Train** the users and the technical staff.
- Hand over the **user guide** and **technical documentation**.
- **Change over** from the old system using the chosen method.
### Why the method matters
- If the new system has a fault, the organisation may **lose data** or be **unable to work**.
- Some methods keep the **old system as a backup**; others do not.
- The methods differ in **speed**, **cost**, **risk** and **staff workload**.
- The right choice depends on **how critical** the system is and how the organisation is **organised**.
:::

:::definition Data conversion
Transferring the existing data from the old system (paper files or old software) into the **format of the new system**, then **checking** it — e.g. typing paper patient cards into the new database, or exporting old records and importing them.
:::

There are **four** implementation methods. They differ in **how quickly** the old system is replaced and **how much risk** the organisation takes if the new system fails.

:::svg The four implementation methods over time (dark bar = old system, light bar = new system)
<svg class="mi" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timelines. Direct: old system stops on one day and the new starts. Parallel: old and new overlap for a period. Pilot: department A changes first, departments B and C later. Phased: module 1, then module 2, then module 3 change over at different times">
  <style>
    svg.mi .o{fill:var(--muted)}
    svg.mi .n{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.mi .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mi .l{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.mi .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mi .ax{stroke:var(--border);stroke-width:1.5}
  </style>
  <text class="h" x="10" y="30">Direct</text>
  <rect class="o" x="190" y="18" width="200" height="16" rx="3"/><rect class="n" x="390" y="18" width="250" height="16" rx="3"/>
  <text class="ss" x="650" y="31">one day</text>
  <text class="h" x="10" y="80">Parallel</text>
  <rect class="o" x="190" y="62" width="330" height="14" rx="3"/><rect class="n" x="330" y="80" width="310" height="14" rx="3"/>
  <text class="ss" x="335" y="110">both run</text><text class="ss" x="650" y="83">overlap</text>
  <text class="h" x="10" y="150">Pilot</text>
  <text class="l" x="110" y="140">Dept A</text><rect class="o" x="190" y="129" width="80" height="13" rx="3"/><rect class="n" x="270" y="129" width="370" height="13" rx="3"/>
  <text class="l" x="110" y="160">Dept B</text><rect class="o" x="190" y="149" width="250" height="13" rx="3"/><rect class="n" x="440" y="149" width="200" height="13" rx="3"/>
  <text class="l" x="110" y="180">Dept C</text><rect class="o" x="190" y="169" width="250" height="13" rx="3"/><rect class="n" x="440" y="169" width="200" height="13" rx="3"/>
  <text class="ss" x="650" y="160">one site first</text>
  <text class="h" x="10" y="232">Phased</text>
  <text class="l" x="100" y="222">Module 1</text><rect class="o" x="190" y="211" width="90" height="13" rx="3"/><rect class="n" x="280" y="211" width="360" height="13" rx="3"/>
  <text class="l" x="100" y="242">Module 2</text><rect class="o" x="190" y="231" width="200" height="13" rx="3"/><rect class="n" x="390" y="231" width="250" height="13" rx="3"/>
  <text class="l" x="100" y="262">Module 3</text><rect class="o" x="190" y="251" width="310" height="13" rx="3"/><rect class="n" x="500" y="251" width="140" height="13" rx="3"/>
  <text class="ss" x="650" y="242">one part at a time</text>
  <line class="ax" x1="190" y1="290" x2="640" y2="290"/>
  <path d="M640,284 l12,6 l-12,6 z" style="fill:var(--border)"/>
  <text class="ss" x="415" y="312" text-anchor="middle">time →</text>
  <rect class="o" x="10" y="300" width="22" height="12" rx="2"/><text class="ss" x="38" y="311">old system</text>
  <rect class="n" x="10" y="316" width="22" height="12" rx="2"/><text class="ss" x="38" y="327">new system</text>
</svg>
:::

:::warning Common mistakes
- Writing "testing" or "analysis" as an implementation method — the four methods are **direct, parallel, pilot, phased**.
- Forgetting that **data conversion and training** are needed whichever method is chosen.
:::

# Direct changeover and parallel running
@lo 12.2.1.7, 12.2.1.8

:::definition Direct changeover
The old system is **stopped completely** and the new system is **started immediately** in its place, on a fixed date ("big bang").
:::

:::compare Direct changeover
| Advantages | Disadvantages |
|---|---|
| **Fastest** method — the benefits of the new system arrive immediately | **Most risky** — if the new system fails there is **no backup** system to fall back on |
| **Cheapest** — only one system is run, no duplicate work | Data may be **lost** or the organisation may **stop working** if there are errors |
| Staff never have to use two systems at once | **All staff** must be trained **before** the changeover date |
| Simple to plan and manage | Problems affect the **whole organisation** at once |
:::

:::example When direct changeover is suitable
- A **café** introduces electronic ordering instead of ordering from staff — small, simple system; a short failure is not dangerous.
- The old system **no longer works**, or is so different that running both is impossible.
- A **new organisation** with no old system at all.
:::

:::definition Parallel running
The **old and new systems run at the same time** for a period. The same data is entered into **both** and the **results are compared**. When the new system has been shown to be reliable, the old one is stopped.
:::

:::compare Parallel running
| Advantages | Disadvantages |
|---|---|
| **Safest** — the old system is a **backup** if the new one fails | **Most expensive** — two systems, extra staff time |
| The new system's results can be **checked against** the old one | **Double workload** — data entered twice; staff may be overworked and make errors |
| Staff can be **trained gradually** while the old system still works | Takes **longer** to complete the changeover |
| No data is lost if the new system fails | Staff may keep relying on the old system |
:::

:::example When parallel running is suitable
- **Critical** systems where failure is unacceptable: a **seaport** tracking cargo ships, **hospital** records, **banking**, **payroll**, air-traffic data.
- When the new system's results **must be checked** against the old one (e.g. the first month of a new payroll).
:::

:::compare Direct and parallel — the two extremes
| | Direct | Parallel |
|---|---|---|
| Old system after the changeover date | **Switched off** | Still **running** alongside |
| Backup if the new system fails | **None** | The **old system** |
| Cost | **Lowest** | **Highest** |
| Time to complete | **Shortest** | Long |
| Staff workload | Normal | **Double** |
| Risk | **Highest** | **Lowest** |
:::

:::warning Common mistakes
- Saying parallel running is "fast" or "cheap" — it is the **most expensive** method and slow, but the **safest**.
- Writing only "it is risky" for direct — say **why**: there is **no old system to fall back on** if the new one fails.
:::

# Pilot and phased implementation
@lo 12.2.1.7, 12.2.1.8

:::definition Pilot implementation
The **whole new system** is introduced in **one part of the organisation first** — one department, branch, shop or class. When it works well there, it is introduced in all the other parts.
:::

:::definition Phased implementation
The new system is introduced **gradually, one part (module / function) at a time**, across the **whole organisation**. Each phase is introduced only when the previous one works.
:::

:::svg Pilot = the whole system in one place first; phased = one part of the system everywhere at a time
<svg class="mi" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two grids of three branches by three modules. Pilot: all three modules switched on in branch 1 only. Phased: module 1 switched on in all three branches only">
  <style>
    svg.mi .c0{fill:var(--surface-2);stroke:var(--border);stroke-width:1.2}
    svg.mi .c1{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mi .c2{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.mi .h{font:700 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.mi .l{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.mi .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mi .ok{font:700 13px system-ui,sans-serif}
  </style>
  <text class="h" x="200" y="24" text-anchor="middle">Pilot</text>
  <text class="l" x="125" y="50" text-anchor="middle">Sales</text><text class="l" x="205" y="50" text-anchor="middle">Stock</text><text class="l" x="285" y="50" text-anchor="middle">Payroll</text>
  <text class="l" x="30" y="85">Branch 1</text><text class="l" x="30" y="145">Branch 2</text><text class="l" x="30" y="205">Branch 3</text>
  <rect class="c1" x="90" y="62" width="70" height="44" rx="6"/><rect class="c1" x="170" y="62" width="70" height="44" rx="6"/><rect class="c1" x="250" y="62" width="70" height="44" rx="6"/>
  <text class="ok" x="125" y="89" text-anchor="middle" style="fill:var(--primary)">new</text><text class="ok" x="205" y="89" text-anchor="middle" style="fill:var(--primary)">new</text><text class="ok" x="285" y="89" text-anchor="middle" style="fill:var(--primary)">new</text>
  <rect class="c0" x="90" y="122" width="70" height="44" rx="6"/><rect class="c0" x="170" y="122" width="70" height="44" rx="6"/><rect class="c0" x="250" y="122" width="70" height="44" rx="6"/>
  <rect class="c0" x="90" y="182" width="70" height="44" rx="6"/><rect class="c0" x="170" y="182" width="70" height="44" rx="6"/><rect class="c0" x="250" y="182" width="70" height="44" rx="6"/>
  <text class="ss" x="205" y="252" text-anchor="middle">one ROW: the whole system,</text>
  <text class="ss" x="205" y="270" text-anchor="middle">one branch only — then the rest</text>
  <text class="h" x="560" y="24" text-anchor="middle">Phased</text>
  <text class="l" x="485" y="50" text-anchor="middle">Sales</text><text class="l" x="565" y="50" text-anchor="middle">Stock</text><text class="l" x="645" y="50" text-anchor="middle">Payroll</text>
  <text class="l" x="390" y="85">Branch 1</text><text class="l" x="390" y="145">Branch 2</text><text class="l" x="390" y="205">Branch 3</text>
  <rect class="c2" x="450" y="62" width="70" height="44" rx="6"/><rect class="c2" x="450" y="122" width="70" height="44" rx="6"/><rect class="c2" x="450" y="182" width="70" height="44" rx="6"/>
  <text class="ok" x="485" y="89" text-anchor="middle" style="fill:var(--success)">new</text><text class="ok" x="485" y="149" text-anchor="middle" style="fill:var(--success)">new</text><text class="ok" x="485" y="209" text-anchor="middle" style="fill:var(--success)">new</text>
  <rect class="c0" x="530" y="62" width="70" height="44" rx="6"/><rect class="c0" x="610" y="62" width="70" height="44" rx="6"/>
  <rect class="c0" x="530" y="122" width="70" height="44" rx="6"/><rect class="c0" x="610" y="122" width="70" height="44" rx="6"/>
  <rect class="c0" x="530" y="182" width="70" height="44" rx="6"/><rect class="c0" x="610" y="182" width="70" height="44" rx="6"/>
  <text class="ss" x="565" y="252" text-anchor="middle">one COLUMN: one module,</text>
  <text class="ss" x="565" y="270" text-anchor="middle">every branch — then the next module</text>
</svg>
:::

:::compare Pilot implementation
| Advantages | Disadvantages |
|---|---|
| If the system fails, **only one part** of the organisation is affected | Takes **longer** than direct changeover before everyone uses the system |
| Errors are found and fixed **before** the full rollout | The pilot site may not be **typical** of the others, so some problems appear later |
| Staff at the pilot site can **train** other staff later | Two different systems are in use in the organisation at the same time |
| Cheaper and less risky than running parallel everywhere | If the pilot fails, that department is still badly affected |
:::

:::example When pilot implementation is suitable
- A **supermarket chain** tries a new checkout system in **one shop**.
- A **school** introduces a new club-management system for **one grade** before the whole school.
- A bank tests new software in **one branch** of its network.
:::

:::compare Phased implementation
| Advantages | Disadvantages |
|---|---|
| If one module fails, only **that part** of the system is affected | **Slowest** method — the full system is in use only after all phases |
| Staff learn the system **gradually**, one part at a time | Old and new parts must **work together** (interfaces), which can be complex |
| Errors in each phase are fixed before the next | Requires careful **planning** of the order of phases |
| Spreads the **cost** over time | The benefits of the complete system arrive late |
:::

:::example When phased implementation is suitable
- A large **ERP** system: first **accounts**, then **stock control**, then **payroll**.
- A school system: first **attendance**, then **marks**, then **reports to parents**.
- Any system that can be divided into **independent modules**.
:::

:::compare Pilot and phased — the pair students confuse
| | Pilot | Phased |
|---|---|---|
| What changes first | The **whole system** | **One module / function** |
| Where | In **one location** (department, branch, class) | Across the **whole organisation** |
| Then | The other locations change over | The next module is introduced |
| Best for | Organisations with **many similar sites** | Large systems with **separate modules** |
| If it fails | One **site** is affected | One **function** is affected |
:::

:::warning Common mistakes
- Describing pilot as "a small part of the system is introduced first" — that is **phased**. Pilot = **whole** system, **one place**.
- Saying pilot "has no risk" — the pilot site itself is still affected if the system fails.
:::

# Comparing and choosing a method
@lo 12.2.1.8

:::compare The four methods compared
| | Direct | Parallel | Pilot | Phased |
|---|---|---|---|---|
| Speed | **Fastest** | Slow | Medium | **Slowest** |
| Cost | **Lowest** | **Highest** | Medium | Medium, spread over time |
| Risk if the new system fails | **Highest** | **Lowest** | Low — one site | Low — one module |
| Backup | None | The old system | Old system at the other sites | Old parts still in use |
| Staff workload | Normal (training before) | **Double** | Extra at the pilot site | Spread over time |
| Best for | Small, simple or non-critical systems; old system unusable | **Critical** systems (bank, hospital, port) | Organisations with **many similar branches** | Large systems with **separate modules** |
:::

:::svg Cost and risk of the four methods — no method is both cheap and safe
<svg class="mi" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chart with cost on the horizontal axis and risk on the vertical axis. Direct: low cost, high risk. Pilot and phased: medium cost, low to medium risk. Parallel: high cost, lowest risk">
  <style>
    svg.mi .ax{stroke:var(--foreground);stroke-width:1.5}
    svg.mi .gd{stroke:var(--border);stroke-width:1;stroke-dasharray:4 4}
    svg.mi .d{fill:var(--danger)} svg.mi .p{fill:var(--success)} svg.mi .m{fill:var(--primary)}
    svg.mi .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.mi .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <line class="ax" x1="90" y1="250" x2="720" y2="250"/><line class="ax" x1="90" y1="20" x2="90" y2="250"/>
  <path d="M720,244 l12,6 l-12,6 z" style="fill:var(--foreground)"/><path d="M84,20 l6,-12 l6,12 z" style="fill:var(--foreground)"/>
  <line class="gd" x1="300" y1="20" x2="300" y2="250"/><line class="gd" x1="510" y1="20" x2="510" y2="250"/>
  <line class="gd" x1="90" y1="135" x2="720" y2="135"/>
  <text class="ss" x="405" y="280" text-anchor="middle">cost and staff workload →</text>
  <text class="ss" x="20" y="30">risk</text><text class="ss" x="20" y="48">↑</text>
  <circle class="d" cx="160" cy="55" r="14"/><text class="tt" x="182" y="51">Direct</text><text class="ss" x="182" y="69">fast, cheap, no backup</text>
  <circle class="m" cx="390" cy="160" r="14"/><text class="tt" x="412" y="156">Pilot</text><text class="ss" x="412" y="174">one site at risk</text>
  <circle class="m" cx="350" cy="120" r="14"/><text class="tt" x="372" y="116">Phased</text><text class="ss" x="372" y="134">one module at risk, slowest</text>
  <circle class="p" cx="690" cy="222" r="14"/><text class="tt" x="666" y="218" text-anchor="end">Parallel</text><text class="ss" x="666" y="236" text-anchor="end">safest, most expensive</text>
</svg>
:::

:::svg Choosing an implementation method — questions to ask about the scenario
<svg class="mi" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decision flow: Is failure dangerous or very costly? Yes: parallel. No: Are there several similar sites? Yes: pilot. No: Can the system be split into independent modules? Yes: phased. No: direct, if small, urgent or the old system is unusable">
  <style>
    svg.mi .q{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:1.8}
    svg.mi .a{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.mi .tt{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.mi .aa{font:700 14px system-ui,sans-serif;fill:var(--primary)}
    svg.mi .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.mi .ln{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.mi .ah{fill:var(--muted)}
  </style>
  <rect class="q" x="10" y="20" width="250" height="50" rx="10"/><text class="tt" x="135" y="42" text-anchor="middle">Is failure dangerous or</text><text class="tt" x="135" y="60" text-anchor="middle">very costly (critical)?</text>
  <path class="ln" d="M262,45 H560"/><path class="ah" d="M560,39 l12,6 l-12,6 z"/><text class="ss" x="280" y="38">Yes</text>
  <rect class="a" x="574" y="22" width="176" height="46" rx="10"/><text class="aa" x="662" y="50" text-anchor="middle">Parallel</text>
  <path class="ln" d="M135,72 V96"/><path class="ah" d="M129,96 l6,12 l6,-12 z"/><text class="ss" x="143" y="92">No</text>
  <rect class="q" x="10" y="110" width="250" height="50" rx="10"/><text class="tt" x="135" y="132" text-anchor="middle">Several similar sites</text><text class="tt" x="135" y="150" text-anchor="middle">(branches, shops, classes)?</text>
  <path class="ln" d="M262,135 H560"/><path class="ah" d="M560,129 l12,6 l-12,6 z"/><text class="ss" x="280" y="128">Yes</text>
  <rect class="a" x="574" y="112" width="176" height="46" rx="10"/><text class="aa" x="662" y="140" text-anchor="middle">Pilot</text>
  <path class="ln" d="M135,162 V186"/><path class="ah" d="M129,186 l6,12 l6,-12 z"/><text class="ss" x="143" y="182">No</text>
  <rect class="q" x="10" y="200" width="250" height="50" rx="10"/><text class="tt" x="135" y="222" text-anchor="middle">Can it be split into</text><text class="tt" x="135" y="240" text-anchor="middle">independent modules?</text>
  <path class="ln" d="M262,225 H560"/><path class="ah" d="M560,219 l12,6 l-12,6 z"/><text class="ss" x="280" y="218">Yes</text>
  <rect class="a" x="574" y="202" width="176" height="46" rx="10"/><text class="aa" x="662" y="230" text-anchor="middle">Phased</text>
  <path class="ln" d="M135,252 V270 H560"/><path class="ah" d="M560,264 l12,6 l-12,6 z"/><text class="ss" x="143" y="266">No</text>
  <rect class="a" x="574" y="256" width="176" height="40" rx="10"/><text class="aa" x="662" y="281" text-anchor="middle">Direct</text>
  <text class="ss" x="300" y="290">small, cheap, urgent or old system unusable</text>
</svg>
:::

:::steps How to choose and justify a method for a scenario
- How **critical** is the system? If failure is dangerous or very costly → **parallel**.
- Does the organisation have **several similar sites** (shops, branches, classes)? → **pilot**.
- Can the system be split into **independent parts**? → **phased**.
- Is it **small**, cheap, urgent, or is the old system **unusable**? → **direct**.
- **Justify** with details from the scenario, and mention the **trade-off** (cost, time, risk).
:::

:::example Choose the method — four scenarios
| Situation | Method | Reason linked to the scenario |
|---|---|---|
| A system that tracks the arrival of cargo ships at the Aktau seaport is being replaced | **Parallel** | Critical; errors could cause accidents or losses, so the old system is kept as a backup and results are compared |
| A school introduces a new system for managing hobby clubs, first for one grade | **Pilot** | Tried on one grade before all students use it; problems affect only that grade |
| A café lets customers order electronically instead of ordering from staff | **Direct** | Small, simple and not critical; quick and cheap; staff can take orders by hand if it fails |
| A city hospital replaces patient records, prescriptions and billing over a year | **Phased** | Large system with separate modules introduced one at a time; staff learn gradually |
:::

:::example Worked evaluation — a national bank's payment system [6-mark style]
**Scenario:** a national bank is replacing the software that processes all customer payments.
- **Direct:** fastest and cheapest, **but** if the new software fails, no payments can be made anywhere — unacceptable for a bank.
- **Pilot:** one branch first limits the risk, **but** payments move between all branches, so a single branch cannot easily use a different system.
- **Phased:** modules (card payments, transfers, loans) one at a time, **but** old and new modules must exchange data, which is complex for money.
- **Parallel:** both systems process every payment and the results are compared; the old system is a backup. **Most expensive** and double work, **but** the bank can afford it and errors would cost far more.
- **Recommendation:** **parallel running**, because the system is critical and every result can be checked before the old system is switched off.
:::

:::tip Exam technique
For "choose and justify" questions: **name** the method (1), give a reason **linked to the scenario** (1), and — if asked — a disadvantage **for that organisation** (1). "Parallel because it is safe" is weaker than "parallel because a fault in ship-tracking could cause accidents, and the old system stays as a backup".
:::

# Exam practice: implementation methods
@lo 12.2.1.7, 12.2.1.8

:::example Exam-style answers
**Q: List the four methods of system implementation. [2]**
Direct, parallel, pilot, phased (any two for 1 mark, all four for 2).

**Q: Describe parallel running. [2]**
The old and new systems run at the same time / the same data is entered into both (1); results are compared and the old system is stopped once the new one is shown to work (1).

**Q: Choose one type of system implementation that could be used by a clinic replacing paper patient records, and give one advantage and one disadvantage. [3]**
Parallel (1). Advantage: the old records remain as a backup / results can be compared (1). Disadvantage: expensive / double work for the staff (1).
*(Or direct: advantage — fastest / cheapest; disadvantage — very risky, no backup.)*

**Q: Compare pilot and phased implementation. [2]**
Pilot introduces the whole system in one part of the organisation first (1), whereas phased introduces the system one module at a time across the whole organisation (1).

**Q: Explain one disadvantage of direct changeover for a supermarket's checkout system. [2]**
If the new checkout software fails there is no old system to fall back on (1), so the shop cannot sell goods / loses sales and data until it is fixed (1).

**Q: Explain why parallel running is the most expensive method. [2]**
Two systems must be run and maintained at the same time (1), and staff enter the same data twice / need extra time or overtime (1).
:::

:::warning Common mistakes in exam answers
- Confusing **pilot** (one **location** gets the **whole** system) with **phased** (everyone gets **one part** at a time).
- Saying parallel running is "fast" — it is the **slowest and most expensive**, but the **safest**.
- Choosing a method without **linking** the reason to the scenario.
- "Compare" answers that describe only **one** method — use **whereas** and say something about **both**.
:::

:::steps Check yourself
- List the four implementation methods and describe each in one sentence.
- Give two advantages and two disadvantages of each method.
- Which method is the safest? The fastest? The cheapest? The slowest?
- Explain the difference between pilot and phased implementation with an example of each.
- Choose and justify a method for: a new airline booking system; a new library system for a network of 20 schools; a new online menu for a small café; a new school system with attendance, marks and reports modules.
:::
