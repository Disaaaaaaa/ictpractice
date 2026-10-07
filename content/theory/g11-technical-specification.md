---
summary: Writing a technical specification — determining the minimum hardware requirements of a new system and justifying the choice of software.
---
# Minimum hardware requirements
@lo 11.3.2.1

:::definition Technical specification
A document that lists the **hardware and software needed** to run a new system and explains why each item was chosen.
:::

:::compare Hardware to consider
| Component | What to specify | How to decide |
|---|---|---|
| Processor (CPU) | Cores, clock speed (GHz) | Heavier processing (video, databases, many users) needs a faster CPU |
| RAM | Capacity (GB) | Number and size of programs open at once; OS minimum + application needs |
| Storage | Type (SSD/HDD) and capacity | Size of software + data now + expected growth + backups; SSD for speed |
| Display | Resolution, size | Graphics/design work needs higher resolution |
| Input devices | Keyboard, mouse, barcode scanner, camera, touchscreen | From the system's inputs (e.g. scanning products) |
| Output devices | Printer type, speakers | From required outputs (receipts → thermal printer) |
| Network | Network card, Wi-Fi, bandwidth | Online/cloud systems, number of users |
:::

:::steps Determining the minimum requirements
- List the **software** the system needs (OS, DBMS, applications) and read each one's **minimum requirements**.
- Take the **highest** value for each component and add the needs of the **data** (size, growth).
- Add the **peripherals** required by the system's inputs and outputs.
- Allow a **margin** for future growth and for running several programs at once.
:::

:::example Library system for 600 students
- CPU: 4-core, 2.5 GHz — runs the DBMS and the library app together.
- RAM: 8 GB — OS (4 GB) + DBMS + application.
- Storage: 256 GB SSD — software, database, daily backups.
- Barcode scanner — to scan book and student cards quickly and accurately.
- Receipt printer — to print loan slips.
- Network card — the database is shared with other computers in the school.
:::

# Justifying the choice of software
@lo 11.3.1.4

:::compare Criteria for choosing software
| Criterion | Questions to ask |
|---|---|
| Functionality | Does it do everything in the requirements specification? |
| Compatibility | Does it run on the chosen hardware and OS? Can it import existing data? |
| Cost | Licence price, subscription, cost of upgrades, training |
| Ease of use | Is it easy to learn for these users? Is the interface in the right language? |
| Support | Manuals, tutorials, technical support, regular updates |
| Security | User accounts, permissions, encryption, backups |
| Scalability | Can it cope with more users and data later? |
| Type of licence | Proprietary vs open source; bespoke vs off-the-shelf |
:::

:::example Justification
"**MySQL** was chosen as the DBMS because it is **free and open-source**, runs on the school's **Linux server**, supports **many simultaneous users** and is widely used, so **documentation and support** are easy to find."
:::

:::tip
A justification needs a **reason linked to the scenario**: not just "it is good", but "it is chosen *because* the clinic needs X, and this software provides X".
:::
