---
summary: The four methods of introducing a new system — direct, parallel, pilot and phased — and their advantages and disadvantages.
---
# Methods of system implementation
@lo 11.2.2.6

When a new system is ready, the organisation must **change over** from the old system to the new one. There are four methods.

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

# Comparing implementation methods
@lo 11.2.2.7

:::compare
| Method | Advantages | Disadvantages |
|---|---|---|
| **Direct** | Fastest and cheapest; no duplication of work; benefits are immediate | Very risky — if the new system fails there is no fallback; data may be lost; staff must be trained beforehand |
| **Parallel** | Lowest risk — the old system is a backup; outputs can be compared to check the new system | Most expensive — double work, staff run two systems; takes longer |
| **Pilot** | Problems affect only the pilot area; staff there can train others; real-world testing | Slower to roll out; the pilot area may not represent all others; if it fails the pilot area suffers |
| **Phased** | Each module is tested and staff learn gradually; problems are limited to one module | Takes a long time; old and new parts must work together (compatibility) |
:::

:::compare Which method suits which situation?
| Situation | Method | Reason |
|---|---|---|
| A tracking system for cargo ships at a port, where failure is unacceptable | Parallel | The old system continues if the new one fails; results can be compared |
| A school introduces a hobby-club system class by class | Pilot | Test in one group before the whole school |
| A small café replaces paper orders with tablets | Direct | Simple, cheap, low risk; the café can start at once |
| A bank introduces new software module by module (accounts, then loans, then cards) | Phased | Each part is tested before the next |
:::

:::tip
Choose the method from **the risk and the cost** in the scenario: critical systems → parallel; many similar branches → pilot; modular system → phased; small/simple or the old system is unusable → direct.
:::
