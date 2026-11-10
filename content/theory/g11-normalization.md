---
summary: Why databases are normalised (redundancy and the update, insertion and deletion anomalies), the rules for first, second and third normal form, how to normalise a table step by step to 3NF, and how to create a database with multiple related tables in SQL.
---
# Why normalise a database?
@lo 11.4.1.9

:::definition Normalisation
The process of **organising the data in a relational database into well-structured tables** — by following a set of rules called **normal forms** — so that each fact is stored **once**, data **redundancy** is reduced and **anomalies** (problems when inserting, updating or deleting data) are avoided.
:::

:::definition Data redundancy
The **same data stored more than once** in a database (for example a customer's address copied into every one of their orders). Redundant data wastes storage and can become **inconsistent** when only some copies are changed.
:::

:::definition Data anomaly
A **problem that appears when data is inserted, updated or deleted** in a badly designed table: data becomes inconsistent, cannot be added, or is lost by accident.
:::

:::svg One big table: the same customer details are repeated in every order
<svg class="nf" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An Orders table where customer name and address are repeated in three rows, with the three anomalies labelled">
  <style>
    svg.nf .h{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .hd{fill:var(--primary-soft)} svg.nf .row{fill:var(--surface-2)}
    svg.nf .rep{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.nf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nf .tt{font:700 13px system-ui,sans-serif}
  </style>
  <text class="h" x="20" y="22">Orders (unnormalised)</text>
  <rect class="hd" x="20" y="32" width="720" height="28" rx="4"/>
  <text class="h" x="30" y="51">OrderID</text><text class="h" x="110" y="51">OrderDate</text><text class="h" x="220" y="51">CustomerName</text><text class="h" x="370" y="51">CustomerAddress</text><text class="h" x="590" y="51">Product</text>
  <rect class="row" x="20" y="62" width="720" height="26"/>
  <rect class="rep" x="212" y="64" width="370" height="22" rx="3"/>
  <text class="c" x="30" y="80">1001</text><text class="c" x="110" y="80">02/09</text><text class="c" x="220" y="80">A. Nurlanova</text><text class="c" x="370" y="80">Abai St 12, Almaty</text><text class="c" x="590" y="80">Printer</text>
  <rect class="row" x="20" y="90" width="720" height="26"/>
  <rect class="rep" x="212" y="92" width="370" height="22" rx="3"/>
  <text class="c" x="30" y="108">1002</text><text class="c" x="110" y="108">15/09</text><text class="c" x="220" y="108">A. Nurlanova</text><text class="c" x="370" y="108">Abai St 12, Almaty</text><text class="c" x="590" y="108">Ink</text>
  <rect class="row" x="20" y="118" width="720" height="26"/>
  <rect class="rep" x="212" y="120" width="370" height="22" rx="3"/>
  <text class="c" x="30" y="136">1003</text><text class="c" x="110" y="136">01/10</text><text class="c" x="220" y="136">A. Nurlanova</text><text class="c" x="370" y="136">Abai St 12, Almaty</text><text class="c" x="590" y="136">Paper</text>
  <text class="s" x="20" y="164">red = the same fact stored three times (redundancy)</text>
  <rect class="bx" x="20" y="180" width="230" height="104" rx="10"/>
  <text class="tt" x="34" y="204" style="fill:var(--danger)">Update anomaly</text>
  <text class="s" x="34" y="226">She moves house: the address</text>
  <text class="s" x="34" y="244">must be changed in 3 rows —</text>
  <text class="s" x="34" y="262">miss one and data disagrees.</text>
  <rect class="bx" x="265" y="180" width="230" height="104" rx="10"/>
  <text class="tt" x="279" y="204" style="fill:var(--danger)">Insertion anomaly</text>
  <text class="s" x="279" y="226">A new customer cannot be</text>
  <text class="s" x="279" y="244">stored until they place an</text>
  <text class="s" x="279" y="262">order (OrderID is the key).</text>
  <rect class="bx" x="510" y="180" width="230" height="104" rx="10"/>
  <text class="tt" x="524" y="204" style="fill:var(--danger)">Deletion anomaly</text>
  <text class="s" x="524" y="226">Delete a customer's only</text>
  <text class="s" x="524" y="244">order and their name and</text>
  <text class="s" x="524" y="262">address are lost as well.</text>
</svg>
:::

:::compare Anomalies in an unnormalised table
| Anomaly | Problem | Example (one big *Orders* table with customer details in every row) |
|---|---|---|
| **Update anomaly** | The same data is stored many times; changing it in one row but not others makes the data **inconsistent** | A customer's address must be changed in every order row |
| **Insertion anomaly** | Some data cannot be added without other, unrelated data | A new customer cannot be stored until they place an order |
| **Deletion anomaly** | Deleting one record also deletes other important data | Deleting a customer's only order deletes the customer too |
:::

:::cards
### Benefits of normalisation
- **Less redundancy** — each fact is stored once, so less storage is used.
- **Consistency / data integrity** — a fact is changed in **one place**, so copies cannot disagree.
- **No anomalies** when inserting, updating or deleting.
- Clearer structure that is easier to **maintain** and extend (add a new table, not new columns).
### Possible drawbacks
- More tables, so queries need **joins** — some queries become more complex or slower.
- The design takes more time and skill.
- Very large systems (e.g. reporting databases) sometimes **denormalise** a little for speed.
:::

:::example A school register — spotting the problems
A school keeps one spreadsheet `Pupils(PupilID, PupilName, Class, ClassTeacher, TeacherRoom)`. 11A has 25 pupils, so **"Mr Omarov, room 204"** is typed 25 times.
- Mr Omarov moves to room 310: the room must be changed **25 times** → update anomaly.
- A new class 11D is created with its teacher, but has no pupils yet: it **cannot be recorded** → insertion anomaly.
- The last pupil of 11C leaves: deleting the pupil also deletes **who teaches 11C** → deletion anomaly.

Normalisation moves the class data into its own table `Classes(Class, ClassTeacher, TeacherRoom)`, so each class's teacher and room are stored **once**.
:::

:::warning Common mistakes
- Saying normalisation "deletes data" — it **reorganises** data into more tables; no fact is lost.
- Mixing up the anomalies: **update** = change many copies, **insertion** = cannot add, **deletion** = lose other data.
- Writing "it makes the database faster" as the main benefit — the main benefits are **less redundancy** and **consistent data**.
:::

# The rules of the normal forms
@lo 11.4.1.9

A table is normalised **in order**: first to 1NF, then 2NF, then 3NF. Each form includes all the rules of the form before it.

:::svg The normal forms are reached one step at a time
<svg class="nf" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A staircase from unnormalised form to 1NF, 2NF and 3NF with the rule of each step">
  <style>
    svg.nf .st{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nf .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nf .tt{font:700 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .ah{fill:var(--muted)}
  </style>
  <rect class="st" x="10" y="170" width="170" height="66" rx="10"/>
  <text class="tt" x="95" y="196" text-anchor="middle">UNF</text>
  <text class="ss" x="95" y="216" text-anchor="middle">lists in cells, repeats</text>
  <path class="ah" d="M186,170 l14,-10 l0,20 z"/>
  <rect class="on" x="200" y="120" width="170" height="116" rx="10"/>
  <text class="tt" x="285" y="146" text-anchor="middle">1NF</text>
  <text class="ss" x="285" y="168" text-anchor="middle">atomic values</text>
  <text class="ss" x="285" y="186" text-anchor="middle">no repeating groups</text>
  <text class="ss" x="285" y="204" text-anchor="middle">a primary key</text>
  <path class="ah" d="M376,120 l14,-10 l0,20 z"/>
  <rect class="on" x="390" y="70" width="170" height="166" rx="10"/>
  <text class="tt" x="475" y="96" text-anchor="middle">2NF</text>
  <text class="ss" x="475" y="118" text-anchor="middle">1NF +</text>
  <text class="ss" x="475" y="136" text-anchor="middle">no partial</text>
  <text class="ss" x="475" y="154" text-anchor="middle">dependencies</text>
  <path class="ah" d="M566,70 l14,-10 l0,20 z"/>
  <rect class="ok" x="580" y="20" width="170" height="216" rx="10"/>
  <text class="tt" x="665" y="46" text-anchor="middle" style="fill:var(--success)">3NF</text>
  <text class="ss" x="665" y="68" text-anchor="middle">2NF +</text>
  <text class="ss" x="665" y="86" text-anchor="middle">no transitive</text>
  <text class="ss" x="665" y="104" text-anchor="middle">dependencies</text>
  <text class="ss" x="665" y="140" text-anchor="middle">"the key, the whole</text>
  <text class="ss" x="665" y="158" text-anchor="middle">key and nothing but</text>
  <text class="ss" x="665" y="176" text-anchor="middle">the key"</text>
</svg>
:::

:::compare First, second and third normal form
| Normal form | Rule | In other words |
|---|---|---|
| **1NF** | Every field contains **atomic (single) values**; there are **no repeating groups**; each record is **unique** (has a primary key) | One value per cell; no lists; no columns like `Phone1, Phone2, Phone3` |
| **2NF** | In **1NF**, and every non-key field depends on the **whole** primary key — **no partial dependencies** | Only matters when the primary key is **composite**: a field must not depend on just part of the key |
| **3NF** | In **2NF**, and **no non-key field depends on another non-key field** — **no transitive dependencies** | "Every non-key field depends on **the key, the whole key and nothing but the key**" |
:::

:::definition Atomic value
A value that **cannot be split** into smaller meaningful parts for this database — one value per cell. `"Chess, Robotics"` is not atomic; `"Chess"` is.
:::

:::definition Repeating group
A **set of fields or values that repeats** for one record, e.g. columns `Club1, Club2, Club3` or a list of values in one cell.
:::

:::definition Composite key
A **primary key made of two or more fields** that together identify a record, e.g. `(StudentID, SubjectID)` in a `Marks` table.
:::

:::definition Functional dependency
Field B **depends on** field A (written A → B) if each value of A determines **exactly one** value of B. Example: `StudentID → StudentName` (knowing the ID tells you the name).
:::

:::svg Full, partial and transitive dependencies in one table
<svg class="nf" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fields StudentID and SubjectID form the key; Mark depends on both, StudentName on StudentID only, ClassTeacher on Class">
  <defs><marker id="nfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--foreground)"/></marker></defs>
  <style>
    svg.nf .k{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nf .f{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nf .fn{font:600 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nf .lg{font:600 12px system-ui,sans-serif}
    svg.nf .full{stroke:var(--success);stroke-width:2.5;fill:none}
    svg.nf .part{stroke:var(--warning);stroke-width:2.5;fill:none}
    svg.nf .tran{stroke:var(--danger);stroke-width:2.5;fill:none}
  </style>
  <rect class="k" x="20" y="110" width="120" height="40" rx="6"/><text class="fn" x="80" y="135" text-anchor="middle">StudentID</text>
  <rect class="k" x="145" y="110" width="120" height="40" rx="6"/><text class="fn" x="205" y="135" text-anchor="middle">SubjectID</text>
  <rect class="f" x="290" y="110" width="90" height="40" rx="6"/><text class="fn" x="335" y="135" text-anchor="middle">Mark</text>
  <rect class="f" x="400" y="110" width="130" height="40" rx="6"/><text class="fn" x="465" y="135" text-anchor="middle">StudentName</text>
  <rect class="f" x="545" y="110" width="80" height="40" rx="6"/><text class="fn" x="585" y="135" text-anchor="middle">Class</text>
  <rect class="f" x="635" y="110" width="115" height="40" rx="6"/><text class="fn" x="692" y="135" text-anchor="middle">ClassTeacher</text>
  <path class="full" d="M205,108 C230,55 310,55 330,106"/>
  <text class="lg" x="190" y="40" style="fill:var(--success)">full: (StudentID, SubjectID) → Mark</text>
  <path class="part" d="M80,152 C120,240 420,240 462,154"/>
  <text class="lg" x="160" y="258" style="fill:var(--warning)">partial: StudentID → StudentName (only part of the key) — breaks 2NF</text>
  <path class="part" d="M80,152 C130,210 540,210 582,154"/>
  <path class="tran" d="M585,108 C610,70 670,70 690,106"/>
  <text class="lg" x="500" y="40" style="fill:var(--danger)">transitive: Class → ClassTeacher</text>
  <text class="lg" x="500" y="58" style="fill:var(--danger)">— breaks 3NF</text>
  <text class="lg" x="20" y="96" style="fill:var(--primary)">composite primary key</text>
</svg>
:::

:::compare Types of dependency
| Dependency | Meaning | Example | Breaks |
|---|---|---|---|
| **Full** | A non-key field depends on the **whole** (composite) key | `(StudentID, SubjectID) → Mark` | — (this is what we want) |
| **Partial** | A non-key field depends on **part** of a composite key | `StudentID → StudentName` in a table with key `(StudentID, SubjectID)` | **2NF** |
| **Transitive** | A non-key field depends on **another non-key field** | `StudentID → Class → ClassTeacher` | **3NF** |
:::

:::tip Single-field key? No partial dependency is possible
A partial dependency needs a key with **two or more fields**. So a table in 1NF whose primary key is a **single field** is **automatically in 2NF** — go straight to checking for transitive dependencies.
:::

:::warning Common mistakes
- Stating the 2NF rule without "**in 1NF**" and the 3NF rule without "**in 2NF**" — each form builds on the previous one.
- Calling a dependency on another non-key field "partial" — that is **transitive** (3NF); **partial** is about **part of a composite key** (2NF).
- Saying 1NF only means "no empty cells" — it means **atomic values, no repeating groups, a primary key**.
:::

# Exam practice: why normalise and the rules
@lo 11.4.1.9

:::example Exam-style answers
**Q: Define the term normalisation. [2]**
Organising the data of a relational database into (well-structured, related) tables (1) so that data redundancy is reduced / each fact is stored once and anomalies are avoided (1).

**Q: List the rules for first normal form. [2]**
All values are atomic / one value per field (1); there are no repeating groups and each record has a (unique) primary key (1).

**Q: State the rule for third normal form. [2]**
The table is in 2NF (1) and no non-key field depends on another non-key field / there are no transitive dependencies (1).

**Q: A table `Orders(OrderID, CustomerName, CustomerAddress, Product)` stores a customer's address in every order. Describe one update anomaly in this table. [2]**
If the customer changes address, the address must be changed in every one of their orders (1); if one row is missed, the table holds two different addresses for the same customer / the data becomes inconsistent (1).

**Q: Explain why a table in 1NF with a single-field primary key is already in 2NF. [2]**
2NF removes partial dependencies, where a field depends on only part of a composite key (1); with a single-field key there is no "part" of the key, so no partial dependency can exist (1).
:::

:::warning Common mistakes in answers
- Giving the rule for the wrong normal form — learn them in order: **atomic → whole key → nothing but the key**.
- Naming an anomaly without describing **what goes wrong** with an example from the table in the question.
- Writing "duplicate data" without explaining the consequence (**inconsistency**, wasted storage).
:::

:::steps Check yourself
- Define normalisation, redundancy and anomaly.
- Describe the update, insertion and deletion anomalies with one example each.
- State two benefits and one drawback of normalisation.
- State the rules of 1NF, 2NF and 3NF in order.
- Explain full, partial and transitive dependency with an example of each.
- Explain why a single-field key means a 1NF table is in 2NF.
:::

# First normal form (1NF)
@lo 11.4.1.10

:::example A table that is not in 1NF
| MovieID | Title | Year | Country |
|---|---|---|---|
| M1 | The Nomad | 2005 | Kazakhstan, France |
| M2 | Tulpan | 2008 | Kazakhstan, Germany, Russia |

The field **Country** is **not atomic** — it holds **several values**. Searching for "all films made in Germany" or counting films per country is difficult and error-prone.
:::

:::svg 1NF: a list in one cell becomes one row per value
<svg class="nf" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A Movies row with three countries in one cell is split into three rows, one country each">
  <style>
    svg.nf .h{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .hd{fill:var(--primary-soft)} svg.nf .row{fill:var(--surface-2)}
    svg.nf .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.nf .good{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.nf .ah{fill:var(--muted)}
  </style>
  <text class="h" x="20" y="24" style="fill:var(--danger)">Not 1NF</text>
  <rect class="hd" x="20" y="34" width="300" height="28" rx="4"/>
  <text class="h" x="30" y="53">MovieID</text><text class="h" x="100" y="53">Title</text><text class="h" x="190" y="53">Country</text>
  <rect class="row" x="20" y="64" width="300" height="50"/>
  <text class="c" x="30" y="94">M2</text><text class="c" x="100" y="94">Tulpan</text>
  <rect class="bad" x="184" y="68" width="132" height="42" rx="4"/>
  <text class="c" x="190" y="86">Kazakhstan,</text><text class="c" x="190" y="104">Germany, Russia</text>
  <text class="s" x="20" y="138">three values in one cell</text>
  <path class="ah" d="M340,82 h40 v-8 l16,12 l-16,12 v-8 h-40 z"/>
  <text class="h" x="420" y="24" style="fill:var(--success)">1NF</text>
  <rect class="hd" x="420" y="34" width="320" height="28" rx="4"/>
  <text class="h" x="430" y="53">MovieID</text><text class="h" x="510" y="53">Title</text><text class="h" x="610" y="53">Country</text>
  <rect class="row" x="420" y="64" width="320" height="26"/><text class="c" x="430" y="82">M2</text><text class="c" x="510" y="82">Tulpan</text>
  <rect class="good" x="604" y="66" width="132" height="22" rx="3"/><text class="c" x="610" y="82">Kazakhstan</text>
  <rect class="row" x="420" y="92" width="320" height="26"/><text class="c" x="430" y="110">M2</text><text class="c" x="510" y="110">Tulpan</text>
  <rect class="good" x="604" y="94" width="132" height="22" rx="3"/><text class="c" x="610" y="110">Germany</text>
  <rect class="row" x="420" y="120" width="320" height="26"/><text class="c" x="430" y="138">M2</text><text class="c" x="510" y="138">Tulpan</text>
  <rect class="good" x="604" y="122" width="132" height="22" rx="3"/><text class="c" x="610" y="138">Russia</text>
  <text class="s" x="420" y="168">one value per cell; key = (MovieID, Country)</text>
  <text class="s" x="420" y="188">Title is still repeated → fixed in 2NF</text>
  <text class="s" x="20" y="200">Other 1NF fixes: split FullName into FirstName + Surname;</text>
  <text class="s" x="20" y="220">replace columns Phone1, Phone2, Phone3 by one row per phone.</text>
</svg>
:::

:::steps Converting to 1NF
- Make every field **atomic**: one value per cell (split multi-value fields; split `FullName` into `FirstName` and `Surname` if needed).
- Remove **repeating groups** (columns such as `Country1, Country2…`) — one row per value instead.
- Choose a **primary key** so each record is unique — often a **composite** key after splitting.
:::

:::example The same data in 1NF — one row per film–country pair
| MovieID | Title | Year | Country |
|---|---|---|---|
| M1 | The Nomad | 2005 | Kazakhstan |
| M1 | The Nomad | 2005 | France |
| M2 | Tulpan | 2008 | Kazakhstan |
| M2 | Tulpan | 2008 | Germany |
| M2 | Tulpan | 2008 | Russia |

Primary key: **(MovieID, Country)**. The table is now in 1NF, but `Title` and `Year` are **repeated** — they depend only on `MovieID`, which is **part** of the key → not yet 2NF.
:::

:::tip Another 1NF fix
If a field mixes two kinds of information, such as `Address = "Kazakhstan, Almaty"`, split it into **two atomic fields** `Country` and `City`.
:::

# Second normal form (2NF)
@lo 11.4.1.10

:::steps Converting from 1NF to 2NF
- Identify the **primary key**. If it is a **single field**, a table in 1NF is **already in 2NF**.
- If the key is **composite**, check each non-key field: does it depend on the **whole** key or only **part** of it?
- Move every field that depends on **only part** of the key into a **new table**, with that part of the key as its primary key.
- Keep the part of the key in the original table as a **foreign key**.
:::

:::svg 2NF: fields that depend on part of the key move to their own table
<svg class="nf" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MovieCountries with key MovieID and Country is split into Movies with Title and Year, and MovieCountries with only the key">
  <style>
    svg.nf .tb{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nf .nw{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nf .hh{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .ff{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nf .pk{font:700 13px ui-monospace,monospace;fill:var(--primary);text-decoration:underline}
    svg.nf .fk{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.nf .ah{fill:var(--muted)}
  </style>
  <rect class="tb" x="20" y="40" width="250" height="150" rx="10"/>
  <text class="hh" x="35" y="64">1NF table</text>
  <text class="pk" x="35" y="92">MovieID</text>
  <text class="pk" x="35" y="114">Country</text>
  <text class="ff" x="35" y="136" style="fill:var(--danger)">Title  ← MovieID only</text>
  <text class="ff" x="35" y="158" style="fill:var(--danger)">Year   ← MovieID only</text>
  <path class="ah" d="M285,108 h50 v-8 l16,12 l-16,12 v-8 h-50 z"/>
  <rect class="nw" x="380" y="20" width="170" height="120" rx="10"/>
  <text class="hh" x="395" y="44">Movies</text>
  <text class="pk" x="395" y="72">MovieID</text>
  <text class="ff" x="395" y="94">Title</text>
  <text class="ff" x="395" y="116">Year</text>
  <rect class="tb" x="580" y="20" width="160" height="120" rx="10"/>
  <text class="hh" x="595" y="44">MovieCountries</text>
  <text class="fk" x="595" y="72">MovieID*</text>
  <text class="pk" x="595" y="94">Country</text>
  <path class="ln" d="M550,68 H580"/>
  <text class="s" x="380" y="168">underlined = primary key · * = foreign key</text>
  <text class="s" x="380" y="188">Title and Year now depend on the whole key of Movies.</text>
  <text class="s" x="380" y="208">MovieCountries keeps MovieID as a foreign key.</text>
</svg>
:::

:::example 2NF — splitting the films table
```text
Movies         ( _MovieID_, Title, Year )
MovieCountries ( _MovieID*_, _Country_ )
```
`Title` and `Year` now depend on the whole key of `Movies`. `MovieCountries` has only key fields. Both tables are in **2NF**.
:::

:::example 2NF in a shop — order lines
`OrderLines(OrderID, ProductID, Quantity, ProductName, Price)` with key **(OrderID, ProductID)**:
- `Quantity` depends on the **whole** key (how many of *this* product in *this* order) → stays.
- `ProductName` and `Price` depend only on `ProductID` → **partial dependencies** → move to `Products(ProductID, ProductName, Price)`.

Result: `OrderLines(_OrderID_, _ProductID*_, Quantity)` and `Products(_ProductID_, ProductName, Price)`.
:::

# Third normal form (3NF)
@lo 11.4.1.10

:::steps Converting from 2NF to 3NF
- Look for a **non-key field that depends on another non-key field** (a transitive dependency).
- Move those fields into a **new table**; the field they depend on becomes the **primary key** of the new table.
- Leave that field in the original table as a **foreign key**.
- Check every table again: each non-key field depends on the key, the whole key and nothing but the key.
:::

:::example A table in 2NF but not 3NF
| CourseID | CourseName | TeacherName | TeacherDateOfBirth |
|---|---|---|---|
| C1 | Java | Karimov Arman | 12/03/1985 |
| C2 | Python | Karimov Arman | 12/03/1985 |
| C3 | Web design | Sadykova Aigerim | 04/11/1990 |

Primary key: `CourseID`. `TeacherDateOfBirth` depends on **TeacherName**, not on the course → **transitive dependency** (`CourseID → TeacherName → TeacherDateOfBirth`). Karimov's date of birth is stored twice.
:::

:::svg 3NF: the transitive dependency becomes a new table linked by a foreign key
<svg class="nf" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Courses with teacher details is split into Teachers and Courses linked one-to-many by TeacherID">
  <style>
    svg.nf .tb{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nf .nw{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nf .hh{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .ff{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.nf .pk{font:700 13px ui-monospace,monospace;fill:var(--primary);text-decoration:underline}
    svg.nf .fk{font:700 13px ui-monospace,monospace;fill:var(--warning)}
    svg.nf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .ln{stroke:var(--foreground);stroke-width:2;fill:none}
    svg.nf .ah{fill:var(--muted)}
  </style>
  <rect class="tb" x="20" y="40" width="250" height="150" rx="10"/>
  <text class="hh" x="35" y="64">Courses (2NF)</text>
  <text class="pk" x="35" y="92">CourseID</text>
  <text class="ff" x="35" y="114">CourseName</text>
  <text class="ff" x="35" y="136">TeacherName</text>
  <text class="ff" x="35" y="158" style="fill:var(--danger)">TeacherDOB ← TeacherName</text>
  <path class="ah" d="M285,108 h40 v-8 l16,12 l-16,12 v-8 h-40 z"/>
  <rect class="nw" x="360" y="40" width="170" height="120" rx="10"/>
  <text class="hh" x="375" y="64">Teachers</text>
  <text class="pk" x="375" y="92">TeacherID</text>
  <text class="ff" x="375" y="114">TeacherName</text>
  <text class="ff" x="375" y="136">DateOfBirth</text>
  <rect class="tb" x="580" y="40" width="160" height="120" rx="10"/>
  <text class="hh" x="595" y="64">Courses</text>
  <text class="pk" x="595" y="92">CourseID</text>
  <text class="ff" x="595" y="114">CourseName</text>
  <text class="fk" x="595" y="136">TeacherID*</text>
  <path class="ln" d="M530,88 H580"/>
  <path class="ln" d="M545,80 V96"/>
  <path class="ln" d="M565,88 L580,78 M565,88 L580,98"/>
  <text class="s" x="520" y="186">one teacher — many courses (1:M)</text>
  <text class="s" x="360" y="210">Each teacher's date of birth is now stored once.</text>
</svg>
:::

:::example The same data in 3NF
```text
Teachers ( _TeacherID_, TeacherName, DateOfBirth )
Courses  ( _CourseID_, CourseName, TeacherID* )
```
| TeacherID | TeacherName | DateOfBirth |
|---|---|---|
| T1 | Karimov Arman | 12/03/1985 |
| T2 | Sadykova Aigerim | 04/11/1990 |

| CourseID | CourseName | TeacherID |
|---|---|---|
| C1 | Java | T1 |
| C2 | Python | T1 |
| C3 | Web design | T2 |

Each fact is stored **once**; the relationship is **Teachers 1 — M Courses** through the foreign key `TeacherID`.
:::

:::compare What each step removes
| Step | Look for | Fix | New key in the new table |
|---|---|---|---|
| UNF → 1NF | Lists in a cell, repeating columns | One value per cell, one row per value | Often a composite key |
| 1NF → 2NF | A field that depends on **part** of a composite key | Move it with that part of the key | The part of the key |
| 2NF → 3NF | A non-key field that depends on **another non-key field** | Move it with the field it depends on | That non-key field (or a new ID) |
:::

:::warning Common mistakes
- Forgetting to leave a **foreign key** behind when moving fields to a new table — the tables can no longer be linked.
- Moving the field that others depend on **out** of the original table instead of copying it as a foreign key.
- Splitting tables so much that data is **lost** — every original fact must still be stored somewhere.
- Using a name such as `TeacherName` as a key when two teachers could share a name — add an ID such as `TeacherID`.
:::

# Exam practice: normalising to 3NF
@lo 11.4.1.10

:::example Exam-style answers
**Q: `Movies(MovieID, Title, Year, Country)` stores "Kazakhstan, France" in Country. Explain why the table is not in first normal form. [1]**
The field **Country** is **not atomic** — it holds several values in one cell (1). *(Name the field.)*

**Q: `OrderLines(OrderID, ProductID, Quantity, ProductName)` has the key (OrderID, ProductID). Explain why it is not in 2NF. [2]**
ProductName depends only on ProductID (1), which is only part of the composite key — a partial dependency (1).

**Q: Normalise `Courses(CourseID, CourseName, TeacherName, TeacherDOB)` to third normal form. [3]**
`Teachers(TeacherID, TeacherName, TeacherDOB)` with primary key TeacherID (1); `Courses(CourseID, CourseName, TeacherID)` with primary key CourseID (1); TeacherID in Courses is a foreign key linking the tables (1).

**Q: State what happens to the field a transitive dependency depends on. [2]**
It becomes the primary key of the new table (1) and stays in the original table as a foreign key (1).
:::

:::warning Common mistakes in answers
- Writing table designs without marking the **primary key** (underline) and the **foreign key** (asterisk) — marks are given for them.
- Normalising to 3NF but losing a field from the original table.
- Explaining "not 2NF" without naming **which** field depends on **which part** of the key.
:::

:::steps Check yourself
- Convert a table with a list in one cell to 1NF and name its new primary key.
- Explain when a 1NF table is automatically in 2NF.
- Find the partial dependencies in `OrderLines(OrderID, ProductID, Quantity, ProductName, Price)`.
- Find the transitive dependency in `Pupils(PupilID, PupilName, Class, ClassTeacher)`.
- Write a 3NF design with primary keys underlined and foreign keys marked *.
:::

# A full normalisation example
@lo 11.4.1.10 11.4.1.11

:::example Unnormalised data — a school's club register
| PupilID | PupilName | Class | ClassTeacher | Clubs |
|---|---|---|---|---|
| P1 | Dana | 11A | Mr Omarov | Chess, Robotics |
| P2 | Timur | 11B | Ms Ivanova | Chess |
| P3 | Aru | 11A | Mr Omarov | Robotics, Debate |
:::

:::svg The club register from UNF to 3NF
<svg class="nf" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four stages: one unnormalised table, the 1NF table, two 2NF tables and four 3NF tables">
  <style>
    svg.nf .tb{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.nf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.nf .hh{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .ff{font:12px ui-monospace,monospace;fill:var(--foreground)}
    svg.nf .lb{font:700 14px system-ui,sans-serif;fill:var(--primary)}
    svg.nf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .ah{fill:var(--muted)}
  </style>
  <text class="lb" x="20" y="24">UNF</text>
  <rect class="tb" x="20" y="34" width="160" height="110" rx="8"/>
  <text class="ff" x="30" y="56">PupilID</text><text class="ff" x="30" y="74">PupilName</text><text class="ff" x="30" y="92">Class</text><text class="ff" x="30" y="110">ClassTeacher</text><text class="ff" x="30" y="128" style="fill:var(--danger)">Clubs (list)</text>
  <path class="ah" d="M184,84 l12,6 l-12,6 z"/>
  <text class="lb" x="200" y="24">1NF</text>
  <rect class="tb" x="200" y="34" width="160" height="110" rx="8"/>
  <text class="ff" x="210" y="56" style="text-decoration:underline">PupilID</text><text class="ff" x="210" y="74" style="text-decoration:underline">Club</text><text class="ff" x="210" y="92">PupilName</text><text class="ff" x="210" y="110">Class</text><text class="ff" x="210" y="128">ClassTeacher</text>
  <path class="ah" d="M364,84 l12,6 l-12,6 z"/>
  <text class="lb" x="380" y="24">2NF</text>
  <rect class="tb" x="380" y="34" width="160" height="92" rx="8"/>
  <text class="hh" x="390" y="54">Pupils</text>
  <text class="ff" x="390" y="72" style="text-decoration:underline">PupilID</text><text class="ff" x="390" y="90">PupilName</text><text class="ff" x="390" y="108">Class, ClassTeacher</text>
  <rect class="tb" x="380" y="134" width="160" height="58" rx="8"/>
  <text class="hh" x="390" y="154">Memberships</text>
  <text class="ff" x="390" y="174" style="text-decoration:underline">PupilID*, Club</text>
  <path class="ah" d="M542,84 l9,6 l-9,6 z"/>
  <text class="lb" x="552" y="24">3NF</text>
  <rect class="ok" x="552" y="34" width="200" height="50" rx="8"/>
  <text class="hh" x="560" y="54">Classes</text><text class="ff" x="560" y="72"><tspan style="text-decoration:underline">Class</tspan>, ClassTeacher</text>
  <rect class="ok" x="552" y="90" width="200" height="50" rx="8"/>
  <text class="hh" x="560" y="110">Pupils</text><text class="ff" x="560" y="128"><tspan style="text-decoration:underline">PupilID</tspan>, PupilName, Class*</text>
  <rect class="ok" x="552" y="146" width="200" height="50" rx="8"/>
  <text class="hh" x="560" y="166">Clubs</text><text class="ff" x="560" y="184"><tspan style="text-decoration:underline">ClubID</tspan>, ClubName</text>
  <rect class="ok" x="552" y="202" width="200" height="50" rx="8"/>
  <text class="hh" x="560" y="222">Memberships</text><text class="ff" x="560" y="240"><tspan style="text-decoration:underline">PupilID*, ClubID*</tspan></text>
  <text class="s" x="20" y="176">1NF: split the list of clubs, key (PupilID, Club)</text>
  <text class="s" x="20" y="196">2NF: pupil fields depend on PupilID only → Pupils</text>
  <text class="s" x="20" y="216">3NF: ClassTeacher depends on Class → Classes</text>
  <text class="s" x="20" y="236">extra: ClubID added so club details are stored once</text>
  <text class="s" x="20" y="276">underlined = primary key · * = foreign key</text>
</svg>
:::

:::compare Step by step
| Step | Problem found | Result |
|---|---|---|
| **1NF** | `Clubs` contains lists | `PupilClubs(PupilID, PupilName, Class, ClassTeacher, Club)` with key **(PupilID, Club)** |
| **2NF** | `PupilName`, `Class`, `ClassTeacher` depend only on `PupilID` (part of the key) | `Pupils(PupilID, PupilName, Class, ClassTeacher)` and `Memberships(PupilID*, Club)` |
| **3NF** | `ClassTeacher` depends on `Class`, a non-key field | `Classes(Class, ClassTeacher)`; `Pupils(PupilID, PupilName, Class*)`; `Memberships(PupilID*, Club)` |
:::

```text | Final 3NF design (with a Clubs table for club details)
Classes     ( _Class_, ClassTeacher )
Pupils      ( _PupilID_, PupilName, Class* )
Clubs       ( _ClubID_, ClubName )
Memberships ( _PupilID*_, _ClubID*_ )
```

:::definition Link (junction) table
A table that **resolves a many-to-many relationship** into two one-to-many relationships. Its primary key is usually the **composite of the two foreign keys**, e.g. `Memberships(PupilID*, ClubID*)` — one pupil joins many clubs, one club has many pupils.
:::

:::svg Relationships of the normalised design
<svg class="nf" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Classes one-to-many Pupils, Pupils one-to-many Memberships, Clubs one-to-many Memberships">
  <style>
    svg.nf .en{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.nf .lk{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.nf .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.nf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.nf .ln{stroke:var(--foreground);stroke-width:2;fill:none}
  </style>
  <rect class="en" x="20" y="70" width="130" height="50" rx="8"/><text class="tt" x="85" y="100" text-anchor="middle">Classes</text>
  <rect class="en" x="230" y="70" width="130" height="50" rx="8"/><text class="tt" x="295" y="100" text-anchor="middle">Pupils</text>
  <rect class="lk" x="430" y="70" width="140" height="50" rx="8"/><text class="tt" x="500" y="100" text-anchor="middle">Memberships</text>
  <rect class="en" x="640" y="70" width="100" height="50" rx="8"/><text class="tt" x="690" y="100" text-anchor="middle">Clubs</text>
  <path class="ln" d="M150,95 H230 M160,87 V103 M215,95 L230,85 M215,95 L230,105"/>
  <path class="ln" d="M360,95 H430 M370,87 V103 M415,95 L430,85 M415,95 L430,105"/>
  <path class="ln" d="M640,95 H570 M630,87 V103 M585,95 L570,85 M585,95 L570,105"/>
  <text class="s" x="190" y="140" text-anchor="middle">1 : M</text>
  <text class="s" x="395" y="140" text-anchor="middle">1 : M</text>
  <text class="s" x="605" y="140" text-anchor="middle">M : 1</text>
  <text class="s" x="380" y="180" text-anchor="middle">Pupils M : M Clubs is resolved by the link table Memberships</text>
</svg>
:::

:::example Another scenario — a clinic
Unnormalised: `Visits(VisitID, VisitDate, PatientID, PatientName, PatientPhone, DoctorID, DoctorName, Room, Treatments)` where `Treatments` lists several treatments.
1. **1NF**: one row per treatment → key **(VisitID, Treatment)**.
2. **2NF**: everything except the treatment depends on `VisitID` only → `Visits(VisitID, VisitDate, PatientID, PatientName, PatientPhone, DoctorID, DoctorName, Room)` and `VisitTreatments(VisitID*, Treatment)`.
3. **3NF**: `PatientName, PatientPhone` depend on `PatientID`; `DoctorName, Room` depend on `DoctorID` → `Patients(PatientID, PatientName, PatientPhone)`, `Doctors(DoctorID, DoctorName, Room)`, `Visits(VisitID, VisitDate, PatientID*, DoctorID*)`, `VisitTreatments(VisitID*, Treatment)`.
:::

# Creating a database with multiple tables
@lo 11.4.1.11

:::steps From the normalised design to a working database
- Create a table for each table in the 3NF design, with the correct **data types** (from the data dictionary).
- Set each table's **primary key** (composite where needed).
- Create the **foreign keys** (`REFERENCES`) — the relationships between tables, with **referential integrity**.
- Create the tables in the right order: the **"one" side first** (e.g. `Classes`), then the tables that refer to it.
- Enter test data — first in the "one" tables, then in the "many" tables.
- Test with **queries** that join the tables.
:::

:::definition Referential integrity
A rule that **every foreign key value must match an existing primary key value** in the related table. The DBMS rejects, for example, a pupil in class `11Z` if there is no class `11Z` in `Classes`.
:::

```sql | Creating the normalised tables in SQL
CREATE TABLE Classes (
    Class        VARCHAR(4)  PRIMARY KEY,
    ClassTeacher VARCHAR(40) NOT NULL
);
CREATE TABLE Pupils (
    PupilID   VARCHAR(5)  PRIMARY KEY,
    PupilName VARCHAR(40) NOT NULL,
    Class     VARCHAR(4)  REFERENCES Classes(Class)
);
CREATE TABLE Clubs (
    ClubID   INTEGER     PRIMARY KEY,
    ClubName VARCHAR(30) NOT NULL
);
CREATE TABLE Memberships (
    PupilID VARCHAR(5) REFERENCES Pupils(PupilID),
    ClubID  INTEGER    REFERENCES Clubs(ClubID),
    PRIMARY KEY (PupilID, ClubID)
);
```

```sql | Test data and a query that joins the tables
INSERT INTO Classes VALUES ('11A', 'Mr Omarov');
INSERT INTO Pupils  VALUES ('P1', 'Dana', '11A');
INSERT INTO Clubs   VALUES (1, 'Chess');
INSERT INTO Memberships VALUES ('P1', 1);

-- Which club does each pupil of Mr Omarov's class attend?
SELECT Pupils.PupilName, Clubs.ClubName
FROM Pupils
JOIN Classes     ON Pupils.Class = Classes.Class
JOIN Memberships ON Pupils.PupilID = Memberships.PupilID
JOIN Clubs       ON Memberships.ClubID = Clubs.ClubID
WHERE Classes.ClassTeacher = 'Mr Omarov';
```

:::compare Keys in SQL
| What you need | SQL | Example |
|---|---|---|
| Single-field primary key | `PRIMARY KEY` after the field | `PupilID VARCHAR(5) PRIMARY KEY` |
| Composite primary key | `PRIMARY KEY (a, b)` at the end | `PRIMARY KEY (PupilID, ClubID)` |
| Foreign key | `REFERENCES Table(Field)` | `Class VARCHAR(4) REFERENCES Classes(Class)` |
| Required field | `NOT NULL` | `PupilName VARCHAR(40) NOT NULL` |
:::

:::warning Common mistakes
- Giving a foreign key a **different data type or size** from the primary key it refers to — they must match.
- Creating `Pupils` before `Classes` — the foreign key refers to a table that does not exist yet.
- Inserting a pupil with a class that is not in `Classes` — rejected by **referential integrity**.
- Writing two `PRIMARY KEY` words for a composite key — use **one** `PRIMARY KEY (a, b)`.
:::

# Exam practice and summary
@lo 11.4.1.9 11.4.1.10 11.4.1.11

:::example Exam-style answers
**Q: A library stores `Loans(LoanID, BookID, Title, Author, PupilID, PupilName, LoanDate)`. Normalise it to 3NF. [4]**
`Books(BookID, Title, Author)` with key BookID (1); `Pupils(PupilID, PupilName)` with key PupilID (1); `Loans(LoanID, BookID*, PupilID*, LoanDate)` with key LoanID (1); BookID and PupilID in Loans are foreign keys (1).

**Q: Write SQL to create the table `Memberships` with a composite primary key made of the foreign keys PupilID and ClubID. [3]**
`CREATE TABLE Memberships (PupilID VARCHAR(5) REFERENCES Pupils(PupilID), ClubID INTEGER REFERENCES Clubs(ClubID), PRIMARY KEY (PupilID, ClubID));` — CREATE TABLE with both fields and types (1); both REFERENCES (1); PRIMARY KEY (PupilID, ClubID) (1).

**Q: Explain why the table `Classes` must be created before `Pupils`. [2]**
`Pupils.Class` is a foreign key that refers to `Classes` (1); the table it refers to must exist (and contain the class) before pupils can be linked to it / for referential integrity (1).

**Q: Explain what is meant by referential integrity. [2]**
Every foreign key value must match a primary key value in the related table (1), so a record cannot refer to a record that does not exist (1).
:::

:::warning Common mistakes
- Saying a table is "not in 1NF" without naming the **field** and the problem.
- Thinking 2NF matters for single-field keys — a 1NF table with a **single-field key** is automatically in 2NF.
- Forgetting to leave a **foreign key** behind when moving fields to a new table.
- Confusing a **partial** dependency (2NF) with a **transitive** one (3NF).
- Writing SQL with a foreign key whose type does not match the primary key.
:::

:::steps Check yourself
- What is normalisation and why is it used?
- Describe update, insertion and deletion anomalies.
- State the rules for 1NF, 2NF and 3NF.
- Normalise `Orders(OrderID, CustomerName, CustomerPhone, ProductName, Price, Quantity)` to 3NF.
- Explain what a link table is and give its primary key.
- Write SQL to create two related tables with a foreign key, in the correct order.
- Explain referential integrity with an example.
:::
