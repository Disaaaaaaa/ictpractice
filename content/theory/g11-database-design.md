---
summary: Designing the database for a new system — finding entities and attributes in the requirements, deciding the degree of each relationship, drawing the ERD and resolving many-to-many relationships, then writing a complete data dictionary (data types, sizes, keys, validation) for every table and turning the design into CREATE TABLE statements.
---
# Database design in the system life cycle
@lo 11.2.2.2 11.4.1.6

During the **design** stage of a new system the analyst turns the **requirements specification** into an exact plan of the database. Nothing is built yet: the plan is checked with the client first, because a mistake found on paper costs minutes, but a mistake found after the tables are full of data costs days.

:::definition Database design
The stage of system design in which the analyst decides **which tables (entities)** the database will have, **which fields (attributes)** each table holds, **how the tables are related**, and the **data type, size, key and validation** of every field. Its products are the **ERD** and the **data dictionary**.
:::

:::definition Entity
A **thing (person, object, event) about which data is stored**, with many instances — e.g. *Student*, *Teacher*, *Lesson*. Each entity becomes **one table**.
:::

:::definition Attribute
A **single property of an entity** — e.g. *Surname*, *DateOfBirth*. Each attribute becomes **one field (column)** of the table.
:::

:::definition Relationship
A **link between two entities**, e.g. *a teacher teaches many lessons*. Its **degree** is one-to-one (1:1), one-to-many (1:M) or many-to-many (M:M). In the database it is made with a **foreign key**.
:::

:::definition Primary key and foreign key
A **primary key (PK)** is a field that **uniquely identifies each record** of a table (e.g. `StudentID`). A **foreign key (FK)** is a field in one table that is the **primary key of another table**, used to **link** the two tables.
:::

:::svg The steps of database design
<svg class="dbd1" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Six steps: requirements, entities and attributes, relationships, ERD, data dictionary, CREATE TABLE in the DBMS">
  <style>
    svg.dbd1 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dbd1 .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dbd1 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.dbd1 .n{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.dbd1 .t{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd1 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dbd1 .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="20" width="230" height="80" rx="10"/>
  <text class="n" x="24" y="42">1</text><text class="t" x="40" y="42">Requirements</text>
  <text class="s" x="24" y="64">what the client needs to</text><text class="s" x="24" y="82">store and report</text>
  <path class="ah" d="M246,54 l12,6 l-12,6 z"/>
  <rect class="on" x="265" y="20" width="230" height="80" rx="10"/>
  <text class="n" x="279" y="42">2</text><text class="t" x="295" y="42">Entities + attributes</text>
  <text class="s" x="279" y="64">nouns with their own data</text><text class="s" x="279" y="82">→ tables and fields</text>
  <path class="ah" d="M501,54 l12,6 l-12,6 z"/>
  <rect class="on" x="520" y="20" width="230" height="80" rx="10"/>
  <text class="n" x="534" y="42">3</text><text class="t" x="550" y="42">Relationships</text>
  <text class="s" x="534" y="64">ask in both directions:</text><text class="s" x="534" y="82">1:1, 1:M or M:M?</text>
  <path d="M635,104 V124 H125 V140" style="fill:none;stroke:var(--muted);stroke-width:1.8"/><path class="ah" d="M119,138 l6,12 l6,-12 z"/>
  <rect class="on" x="10" y="152" width="230" height="80" rx="10"/>
  <text class="n" x="24" y="174">4</text><text class="t" x="40" y="174">ERD</text>
  <text class="s" x="24" y="196">draw it; replace each M:M</text><text class="s" x="24" y="214">with a link entity</text>
  <path class="ah" d="M246,186 l12,6 l-12,6 z"/>
  <rect class="on" x="265" y="152" width="230" height="80" rx="10"/>
  <text class="n" x="279" y="174">5</text><text class="t" x="295" y="174">Data dictionary</text>
  <text class="s" x="279" y="196">type, size, key, validation</text><text class="s" x="279" y="214">of every field</text>
  <path class="ah" d="M501,186 l12,6 l-12,6 z"/>
  <rect class="ok" x="520" y="152" width="230" height="80" rx="10"/>
  <text class="n" x="534" y="174" style="fill:var(--success)">6</text><text class="t" x="550" y="174">CREATE TABLE</text>
  <text class="s" x="534" y="196">the design is built in the</text><text class="s" x="534" y="214">DBMS (development stage)</text>
</svg>
:::

:::compare The two design documents
| | Entity-relationship diagram (ERD) | Data dictionary |
|---|---|---|
| What it is | A **diagram** | A **table / document** |
| Shows | **Which tables** exist and **how they are related** (1:1, 1:M) | **Every field** of every table: name, type, size, key, validation, description, example |
| Level of detail | Overview — the "map" of the database | Detail — the "specification" for programmers |
| Made | First | Second, from the entities of the ERD |
| Used by | Analyst and client to agree the structure | Programmers to build the tables; testers to choose test data |
:::

:::cards
### Why design the database first
- Errors are found **on paper**, before data is entered.
- The client can **check** that every report they need can be produced.
- Several programmers build tables that **fit together** (same keys and types).
- The design becomes part of the **technical documentation** for maintenance.
### What a good design achieves
- Each fact is stored **once** — no data redundancy (tables in 3NF).
- Every table has a **primary key**; every relationship has a **foreign key**.
- Every field has a **suitable data type** and **validation**, so data integrity is high.
- The database can be **extended** later without rebuilding it.
:::

# Step 1 — Entities and attributes from the requirements
@lo 11.2.2.2

The analyst reads the requirements and **underlines the nouns**. A noun that has **its own data** and **many instances** is an **entity**; a noun that is just **one value** about something is an **attribute**.

:::svg Reading the requirements: entities (blue) and attributes (green)
<svg class="dbd2" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A requirements text with entities student, teacher, lesson and room highlighted, and their attributes listed below">
  <style>
    svg.dbd2 .p{font:14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd2 .e{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.2}
    svg.dbd2 .a{fill:var(--success-soft);stroke:var(--success);stroke-width:1.2}
    svg.dbd2 .hd{font:700 14px system-ui,sans-serif;fill:var(--primary)}
    svg.dbd2 .at{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dbd2 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dbd2 .te{font-weight:700;fill:var(--primary)} svg.dbd2 .ta{font-weight:700;fill:var(--success)}
  </style>
  <rect class="bx" x="10" y="10" width="740" height="104" rx="10"/>
  <text class="p" x="26" y="40"><tspan class="te">Student</tspan> has an ID, a name, a <tspan class="ta">date of birth</tspan> and a parent's <tspan class="ta">phone number</tspan>.</text>
  <text class="p" x="26" y="68"><tspan class="te">Teacher</tspan> has an ID, a name and the <tspan class="ta">instrument</tspan> they teach. Every week</text>
  <text class="p" x="26" y="96"><tspan class="te">lessons</tspan> are recorded with a <tspan class="ta">date</tspan>, <tspan class="ta">time</tspan>, <tspan class="te">room</tspan> and whether the student <tspan class="ta">attended</tspan>.</text>
  <rect class="e" x="10" y="132" width="176" height="128" rx="10"/>
  <text class="hd" x="24" y="154">Student</text>
  <text class="at" x="24" y="176">StudentID</text><text class="at" x="24" y="194">FirstName, Surname</text><text class="at" x="24" y="212">DateOfBirth</text><text class="at" x="24" y="230">ParentPhone</text>
  <rect class="e" x="198" y="132" width="176" height="128" rx="10"/>
  <text class="hd" x="212" y="154">Teacher</text>
  <text class="at" x="212" y="176">TeacherID</text><text class="at" x="212" y="194">Name</text><text class="at" x="212" y="212">Instrument</text>
  <rect class="e" x="386" y="132" width="176" height="128" rx="10"/>
  <text class="hd" x="400" y="154">Lesson</text>
  <text class="at" x="400" y="176">LessonID</text><text class="at" x="400" y="194">LessonDate</text><text class="at" x="400" y="212">StartTime</text><text class="at" x="400" y="230">Attended</text>
  <rect class="e" x="574" y="132" width="176" height="128" rx="10"/>
  <text class="hd" x="588" y="154">Room</text>
  <text class="at" x="588" y="176">RoomNo</text><text class="at" x="588" y="194">Capacity</text>
</svg>
:::

:::example Worked example — the Aqkuy music school
*The Aqkuy music school in Almaty wants a system to manage lessons. Each **student** has an ID, first name, surname, date of birth and a parent's phone number. Each **teacher** has an ID, a name and the instrument they teach. Every week a student has individual **lessons**, possibly with several different teachers; for each lesson the school records the date, the start time, the room and whether the student attended. Each **room** has a number and a capacity.*

1. **Underline the nouns:** student, ID, name, date of birth, phone, teacher, instrument, lesson, date, time, room, number, capacity.
2. **Keep the nouns with their own data and many instances:** Student, Teacher, Lesson, Room → **entities**.
3. **The other nouns describe an entity:** name, date of birth, instrument, capacity… → **attributes**.
4. **Give each entity a primary key:** StudentID, TeacherID, LessonID, RoomNo.

| Entity | Attributes (PK underlined in the ERD) |
|---|---|
| Student | **StudentID**, FirstName, Surname, DateOfBirth, ParentPhone |
| Teacher | **TeacherID**, Name, Instrument |
| Room | **RoomNo**, Capacity |
| Lesson | **LessonID**, LessonDate, StartTime, Attended (+ foreign keys added in step 2) |
:::

:::compare Entity or attribute?
| Test | Entity | Attribute |
|---|---|---|
| Does it have its **own data**? | Yes — a Teacher has an ID, a name, an instrument | No — an instrument is just one value |
| Are there **many instances**? | Yes — many teachers | — |
| What does it become? | A **table** | A **field** in a table |
| Example (car rental) | Customer, Car, Rental | Model, DailyPrice, StartDate |
:::

:::steps How to choose a primary key
- Use a field that is **unique** for every record and **never empty** — e.g. a student number.
- If no natural field is unique (names repeat!), **create an ID** field, often auto-incremented.
- The key should **not change** over time — not a phone number or a surname.
- Keep it **short** and simple, because it is copied into other tables as a foreign key.
:::

:::warning Common mistakes
- Making a **single value** an entity — "Date" or "Instrument" are attributes, not tables.
- Choosing **Name** as a primary key — two students can have the same name.
- Forgetting the **event** entities: *Lesson*, *Loan*, *Rental*, *Order* are entities too, not only people and objects.
- Putting the same attribute (e.g. the teacher's name) into **several** entities — store it once.
:::

# Step 2 — Relationships and the ERD
@lo 11.2.2.2

For every pair of entities that are related, ask the question **in both directions**: "Can one A have many B?" and "Can one B have many A?". The two answers give the **degree** of the relationship.

:::compare The three degrees of relationship
| Degree | Meaning | Example | How it is implemented |
|---|---|---|---|
| **1:1** one-to-one | One A is linked to **one** B, and one B to **one** A | Teacher — Classroom they are in charge of | FK in **either** table |
| **1:M** one-to-many | One A is linked to **many** B, but one B to **one** A | Teacher — Lesson | FK in the table on the **"many" side** (Lesson.TeacherID) |
| **M:M** many-to-many | One A to **many** B **and** one B to **many** A | Student — Teacher | **Cannot be stored directly** → add a **link entity** with two FKs |
:::

:::compare Relationships in the music school
| Pair | Question in both directions | Degree |
|---|---|---|
| Student — Lesson | One student has many lessons? **Yes**. One lesson is for many students? **No** (individual) | **1:M** |
| Teacher — Lesson | One teacher gives many lessons? **Yes**. One lesson has many teachers? **No** | **1:M** |
| Room — Lesson | One room is used for many lessons? **Yes**. One lesson uses many rooms? **No** | **1:M** |
| Student — Teacher | One student has many teachers? **Yes**. One teacher has many students? **Yes** | **M:M** — resolved by **Lesson** |
:::

:::svg ERD of the music school (crow's foot notation)
<svg class="dbd3" viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ERD: Student one-to-many Lesson, Teacher one-to-many Lesson, Room one-to-many Lesson; Lesson holds three foreign keys">
  <style>
    svg.dbd3 .en{fill:var(--surface-2);stroke:var(--primary);stroke-width:2}
    svg.dbd3 .eh{fill:var(--primary-soft)}
    svg.dbd3 .h{font:700 14px system-ui,sans-serif;fill:var(--primary)}
    svg.dbd3 .f{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dbd3 .k{font:700 12px system-ui,sans-serif;fill:var(--warning)}
    svg.dbd3 .ln{stroke:var(--foreground);stroke-width:2;fill:none}
    svg.dbd3 .lb{font:italic 13px system-ui,sans-serif;fill:var(--muted)}
    svg.dbd3 .dg{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
  </style>
  <rect class="en" x="20" y="20" width="200" height="134" rx="8"/><rect class="eh" x="21" y="21" width="198" height="28" rx="7"/>
  <text class="h" x="32" y="41">Student</text>
  <text class="f" x="32" y="70">StudentID</text><text class="k" x="170" y="70">PK</text>
  <text class="f" x="32" y="90">FirstName</text><text class="f" x="32" y="108">Surname</text><text class="f" x="32" y="126">DateOfBirth</text><text class="f" x="32" y="144">ParentPhone</text>
  <rect class="en" x="280" y="20" width="200" height="170" rx="8"/><rect class="eh" x="281" y="21" width="198" height="28" rx="7"/>
  <text class="h" x="292" y="41">Lesson</text>
  <text class="f" x="292" y="70">LessonID</text><text class="k" x="440" y="70">PK</text>
  <text class="f" x="292" y="90">StudentID</text><text class="k" x="440" y="90">FK</text>
  <text class="f" x="292" y="108">TeacherID</text><text class="k" x="440" y="108">FK</text>
  <text class="f" x="292" y="126">RoomNo</text><text class="k" x="440" y="126">FK</text>
  <text class="f" x="292" y="144">LessonDate</text><text class="f" x="292" y="162">StartTime</text><text class="f" x="292" y="180">Attended</text>
  <rect class="en" x="540" y="20" width="200" height="98" rx="8"/><rect class="eh" x="541" y="21" width="198" height="28" rx="7"/>
  <text class="h" x="552" y="41">Teacher</text>
  <text class="f" x="552" y="70">TeacherID</text><text class="k" x="700" y="70">PK</text>
  <text class="f" x="552" y="90">Name</text><text class="f" x="552" y="108">Instrument</text>
  <rect class="en" x="280" y="262" width="200" height="80" rx="8"/><rect class="eh" x="281" y="263" width="198" height="28" rx="7"/>
  <text class="h" x="292" y="283">Room</text>
  <text class="f" x="292" y="312">RoomNo</text><text class="k" x="440" y="312">PK</text><text class="f" x="292" y="330">Capacity</text>
  <path class="ln" d="M220,86 H280"/><path class="ln" d="M228,78 V94"/><path class="ln" d="M266,86 L280,76 M266,86 L280,96"/>
  <text class="dg" x="226" y="112">1</text><text class="dg" x="262" y="112">M</text><text class="lb" x="230" y="70">has</text>
  <path class="ln" d="M540,104 H480"/><path class="ln" d="M532,96 V112"/><path class="ln" d="M494,104 L480,94 M494,104 L480,114"/>
  <text class="dg" x="530" y="130">1</text><text class="dg" x="484" y="130">M</text><text class="lb" x="486" y="152">teaches</text>
  <path class="ln" d="M380,262 V190"/><path class="ln" d="M372,254 H388"/><path class="ln" d="M380,204 L370,190 M380,204 L390,190"/>
  <text class="dg" x="392" y="254">1</text><text class="dg" x="394" y="210">M</text><text class="lb" x="392" y="234">is used for</text>
</svg>
:::

:::svg Resolving a many-to-many relationship with a link entity
<svg class="dbd4" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Before: Student many-to-many Teacher, which cannot be implemented. After: Student one-to-many Lesson many-to-one Teacher">
  <style>
    svg.dbd4 .en{fill:var(--surface-2);stroke:var(--primary);stroke-width:2}
    svg.dbd4 .lk{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.dbd4 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd4 .ln{stroke:var(--foreground);stroke-width:2;fill:none}
    svg.dbd4 .bad{stroke:var(--danger);stroke-width:2;fill:none}
    svg.dbd4 .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.dbd4 .r{font:600 13px system-ui,sans-serif;fill:var(--danger)}
    svg.dbd4 .g{font:600 13px system-ui,sans-serif;fill:var(--success)}
    svg.dbd4 .tag{font:700 12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="tag" x="20" y="26">BEFORE — M:M</text>
  <rect class="en" x="120" y="40" width="150" height="48" rx="8"/><text class="h" x="195" y="69" text-anchor="middle">Student</text>
  <rect class="en" x="490" y="40" width="150" height="48" rx="8"/><text class="h" x="565" y="69" text-anchor="middle">Teacher</text>
  <path class="bad" d="M270,64 H490"/><path class="bad" d="M284,64 L270,54 M284,64 L270,74"/><path class="bad" d="M476,64 L490,54 M476,64 L490,74"/>
  <text class="r" x="380" y="56" text-anchor="middle">M : M</text>
  <text class="r" x="380" y="108" text-anchor="middle">✕ no table can hold this link — where would the foreign key go?</text>
  <text class="tag" x="20" y="150">AFTER — two 1:M</text>
  <rect class="en" x="40" y="164" width="150" height="48" rx="8"/><text class="h" x="115" y="193" text-anchor="middle">Student</text>
  <rect class="lk" x="280" y="156" width="200" height="64" rx="8"/><text class="h" x="380" y="182" text-anchor="middle">Lesson</text><text class="s" x="380" y="204" text-anchor="middle" style="font-size:12px">StudentID FK · TeacherID FK</text>
  <rect class="en" x="570" y="164" width="150" height="48" rx="8"/><text class="h" x="645" y="193" text-anchor="middle">Teacher</text>
  <path class="ln" d="M190,188 H280"/><path class="ln" d="M198,180 V196"/><path class="ln" d="M266,188 L280,178 M266,188 L280,198"/>
  <path class="ln" d="M570,188 H480"/><path class="ln" d="M562,180 V196"/><path class="ln" d="M494,188 L480,178 M494,188 L480,198"/>
  <text class="g" x="380" y="246" text-anchor="middle">✓ the link entity is on the "many" side of both relationships and holds both foreign keys</text>
</svg>
:::

:::steps Drawing the ERD
- Draw **one box per entity**, named in the singular (Student, not Students) — or plural everywhere, but be consistent.
- Write the attributes in the box and mark the **PK**; add the **FKs** to the tables on the "many" side.
- Join every pair of **related** entities with **one line** — not every pair is related.
- Show the degree at **both ends**: `1` / single bar on the "one" side, `M` / crow's foot on the "many" side.
- Label the line with a verb if it helps: *teaches*, *attends*.
- Replace every **M:M** with a **link entity** that has two 1:M relationships.
- Check: every table has a PK, every relationship has an FK, no fact is stored twice (3NF).
:::

:::example Worked example — resolving M:M in a school library
*Members borrow many books; over a year each book is borrowed by many members.*
- Member — Book is **M:M**, so it cannot be stored directly.
- Add the link entity **Loan** (one record per borrowing) with `LoanID` (PK), `MemberID` (FK), `BookID` (FK), `LoanDate`, `ReturnDate`.
- Now **Member 1:M Loan** and **Book 1:M Loan**. The dates belong to the **Loan**, not to the member or the book — the link entity is also the right place for facts about the relationship.
:::

:::warning Common mistakes
- Leaving an **M:M** line in the final ERD — always resolve it with a link entity.
- Putting the foreign key on the **"one" side** (TeacherID in Teacher is a PK; the FK belongs in Lesson).
- Drawing a crow's foot at the wrong end — the crow's foot touches the entity that has **many** records per one record of the other.
- Asking the question in **one direction only** — "a student has many lessons" alone does not tell you whether it is 1:M or M:M.
- Linking every entity to every other one — draw a line only where the scenario describes a relationship.
:::

# Exam practice: entities, relationships and the ERD
@lo 11.2.2.2

:::example Exam-style answers
**Q: Define the term entity. [1]**
A thing / object / person / event about which data is stored (and which becomes a table in the database) (1).

**Q: A gym records members, trainers and training sessions. Each session is for one member with one trainer. Identify the entities and the degree of each relationship. [4]**
Entities: Member, Trainer, Session (1). Member — Session **1:M** (1). Trainer — Session **1:M** (1). Member — Trainer is M:M, resolved by **Session** (the link entity) (1).

**Q: Explain why a many-to-many relationship cannot be implemented directly in a relational database. [2]**
A field can hold only **one value** (1), so neither table can hold a single foreign key for its **many** partners; a **link table** with two foreign keys is needed (1).

**Q: State where the foreign key is placed in a one-to-many relationship. [1]**
In the table on the **"many"** side (1).

**Q: Draw the ERD for: one customer places many orders; an order contains many products. [4]**
Entities Customer, Order, Product + link entity OrderLine (1); Customer 1:M Order (1); Order 1:M OrderLine (1); Product 1:M OrderLine (1).
:::

:::warning Common mistakes in exam answers
- Writing the degree as words without saying **which entity is on the "many" side**.
- Naming the link entity vaguely ("Link", "Table3") — use a meaningful name: *Lesson*, *Loan*, *OrderLine*.
- Forgetting to give marks-worthy detail: "because it is M:M" is not an explanation — say **why** one field cannot store many values.
:::

:::steps Check yourself
- Define entity, attribute, relationship, primary key and foreign key.
- From a short scenario, underline the nouns and sort them into entities and attributes.
- Ask the two questions for each pair and decide 1:1, 1:M or M:M.
- Draw the ERD in crow's foot notation with PKs and FKs.
- Resolve an M:M relationship with a link entity and name its keys.
:::

# Step 3 — The data dictionary
@lo 11.4.1.6

When the ERD is agreed, every entity is described **field by field** in the **data dictionary**. This is the document programmers follow to create the tables, so it must be **complete and exact**.

:::definition Data dictionary
A document / table that describes **every field of every table** in the database — its **name, data type, size, format, key, validation rule, description** and an **example** value (data about the data — metadata).
:::

:::definition Referential integrity
The rule that **every foreign-key value must match an existing primary-key value** in the linked table — e.g. a Lesson cannot refer to a student `S9999` who does not exist.
:::

:::svg Each entity of the ERD becomes a table in the data dictionary
<svg class="dbd5" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Teacher entity with three attributes expands into a data dictionary with name, type, size, key, validation and example for each field">
  <style>
    svg.dbd5 .en{fill:var(--surface-2);stroke:var(--primary);stroke-width:2}
    svg.dbd5 .eh{fill:var(--primary-soft)}
    svg.dbd5 .h{font:700 14px system-ui,sans-serif;fill:var(--primary)}
    svg.dbd5 .f{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dbd5 .th{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd5 .row{fill:var(--surface-2)}
    svg.dbd5 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dbd5 .ar{stroke:var(--muted);stroke-width:2;fill:none}
    svg.dbd5 .ah{fill:var(--muted)}
  </style>
  <rect class="en" x="10" y="60" width="150" height="100" rx="8"/><rect class="eh" x="11" y="61" width="148" height="28" rx="7"/>
  <text class="h" x="22" y="81">Teacher</text>
  <text class="f" x="22" y="110">TeacherID</text><text class="f" x="22" y="128">Name</text><text class="f" x="22" y="146">Instrument</text>
  <text class="s" x="10" y="186">entity in the ERD</text>
  <path class="ar" d="M164,110 H190"/><path class="ah" d="M190,104 l12,6 l-12,6 z"/>
  <rect class="eh" x="208" y="40" width="542" height="30" rx="4"/>
  <text class="th" x="216" y="60">Field</text><text class="th" x="316" y="60">Type</text><text class="th" x="400" y="60">Size</text><text class="th" x="446" y="60">Key</text><text class="th" x="490" y="60">Validation</text><text class="th" x="668" y="60">Example</text>
  <rect class="row" x="208" y="72" width="542" height="30"/>
  <text class="f" x="216" y="92">TeacherID</text><text class="f" x="316" y="92">VARCHAR</text><text class="f" x="400" y="92">4</text><text class="f" x="446" y="92">PK</text><text class="f" x="490" y="92">format T + 3 digits</text><text class="f" x="668" y="92">T012</text>
  <rect class="row" x="208" y="104" width="542" height="30"/>
  <text class="f" x="216" y="124">Name</text><text class="f" x="316" y="124">VARCHAR</text><text class="f" x="400" y="124">50</text><text class="f" x="446" y="124">—</text><text class="f" x="490" y="124">presence</text><text class="f" x="668" y="124">Nurlanov</text>
  <rect class="row" x="208" y="136" width="542" height="30"/>
  <text class="f" x="216" y="156">Instrument</text><text class="f" x="316" y="156">VARCHAR</text><text class="f" x="400" y="156">20</text><text class="f" x="446" y="156">—</text><text class="f" x="490" y="156">lookup: piano,</text><text class="f" x="668" y="156">dombra</text>
  <text class="f" x="490" y="182">dombra, violin…</text>
  <text class="s" x="208" y="216">one row per attribute; every column is filled in —</text>
  <text class="s" x="208" y="234">a programmer can build the table without asking questions</text>
</svg>
:::

:::compare Choosing data types and sizes
| Data | Data type | Size | Why |
|---|---|---|---|
| ID with letters, e.g. `S0107` | VARCHAR / CHAR | 5 | Contains a letter; fixed pattern |
| Auto-numbered ID | INT (auto-increment) | — | Whole numbers, generated by the DBMS |
| Name, surname | VARCHAR | 30–50 | Text of varying length |
| Phone `+77015554433` | VARCHAR | 12 | Has `+`, may start with 0, no arithmetic |
| Date of birth, lesson date | DATE | — | Allows date checks and sorting by date |
| Start time | TIME | — | A time of day |
| Price, fee `12500.00` | DECIMAL(8,2) | — | Money has two decimal places |
| Number of seats | INT | — | Whole number, used in calculations |
| Attended? Paid? | BOOLEAN | — | Only True / False |
:::

:::example Worked example — data dictionary for Student
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| StudentID | VARCHAR | 5 | PK | Presence; format `S` + 4 digits; unique | Student number | S0107 |
| FirstName | VARCHAR | 30 | | Presence | First name | Dana |
| Surname | VARCHAR | 30 | | Presence | Family name | Seitova |
| DateOfBirth | DATE | — | | Range 01/01/2008 – 31/12/2020 | Date of birth | 21/05/2014 |
| ParentPhone | VARCHAR | 12 | | Length 12; format `+7` + 10 digits | Parent's phone | +77015554433 |
:::

:::example Worked example — data dictionary for Lesson (the link table)
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| LessonID | INT | — | PK | Unique; auto-increment | Lesson number | 2381 |
| StudentID | VARCHAR | 5 | FK → Student | Must exist in Student | Who has the lesson | S0107 |
| TeacherID | VARCHAR | 4 | FK → Teacher | Must exist in Teacher | Who teaches | T012 |
| RoomNo | INT | — | FK → Room | Must exist in Room | Where | 14 |
| LessonDate | DATE | — | | Presence; format DD/MM/YYYY | Date of the lesson | 12/10/2026 |
| StartTime | TIME | — | | Range 08:00 – 20:00 | Start time | 15:30 |
| Attended | BOOLEAN | — | | True / False; default False | Did the student attend? | True |
:::

:::svg A foreign key must match its primary key exactly
<svg class="dbd6" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="StudentID VARCHAR(5) in Student matches StudentID VARCHAR(5) in Lesson; a version with INT does not match">
  <style>
    svg.dbd6 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dbd6 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.8}
    svg.dbd6 .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.8}
    svg.dbd6 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd6 .f{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dbd6 .g{font:600 13px system-ui,sans-serif;fill:var(--success)}
    svg.dbd6 .r{font:600 13px system-ui,sans-serif;fill:var(--danger)}
  </style>
  <rect class="bx" x="20" y="20" width="230" height="90" rx="8"/><text class="h" x="34" y="44">Student</text>
  <rect class="ok" x="34" y="56" width="202" height="28" rx="5"/><text class="f" x="44" y="75">StudentID VARCHAR(5) PK</text>
  <rect class="bx" x="510" y="20" width="230" height="90" rx="8"/><text class="h" x="524" y="44">Lesson</text>
  <rect class="ok" x="524" y="56" width="202" height="28" rx="5"/><text class="f" x="534" y="75">StudentID VARCHAR(5) FK</text>
  <path d="M236,70 H524" style="stroke:var(--success);stroke-width:2.5"/>
  <text class="g" x="380" y="62" text-anchor="middle">✓ same name, type and size</text>
  <rect class="bx" x="510" y="122" width="230" height="80" rx="8"/><text class="h" x="524" y="146">Lesson (wrong)</text>
  <rect class="no" x="524" y="158" width="202" height="28" rx="5"/><text class="f" x="534" y="177">StudentID INT FK</text>
  <path d="M236,76 C380,76 380,172 524,172" style="stroke:var(--danger);stroke-width:2.5;fill:none;stroke-dasharray:6 5"/>
  <text class="r" x="24" y="150">✕ 'S0107' cannot be stored in an INT —</text>
  <text class="r" x="24" y="170">the join and referential integrity fail</text>
</svg>
:::

:::compare Choosing validation for each field
| Field | Check(s) | Example rule |
|---|---|---|
| Primary key (StudentID) | Presence, format, uniqueness | `S` + 4 digits; no two the same |
| Foreign key (TeacherID in Lesson) | Lookup / existence (referential integrity) | Must exist in Teacher |
| Name | Presence, length | 1–30 characters |
| Date | Format, range | DD/MM/YYYY; not before 01/09/2026 |
| Number (Capacity) | Type, range | Whole number 1–40 |
| Short list (Instrument) | Lookup (list) | piano, dombra, violin, guitar |
:::

:::warning Common mistakes
- Writing a **data type that cannot hold the example** — INT for `S0107`, INT for `+77015554433`.
- Giving a foreign key a **different type or size** from the primary key it refers to.
- Leaving the **validation** column empty for keys — a PK always needs presence + uniqueness, an FK must exist in the other table.
- A validation rule that does not suit the data — a **range** check on a surname, a **lookup** on a date of birth.
- Describing the field in the *Description* column with just its name ("StudentID — student ID"): say what it stores and why.
:::

# Step 4 — From the design to SQL
@lo 11.2.2.2 11.4.1.6

In the **development** stage the data dictionary is turned line by line into `CREATE TABLE` statements: each **row** of the dictionary becomes one **field definition**, the **Key** column becomes `PRIMARY KEY` / `FOREIGN KEY … REFERENCES`, and many **validation** rules become `NOT NULL`, `UNIQUE`, `CHECK` and `DEFAULT`.

:::svg How a data-dictionary row becomes SQL
<svg class="dbd7" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The row RoomNo INT PK and Capacity INT range 1 to 40 become RoomNo INT PRIMARY KEY and Capacity INT CHECK Capacity between 1 and 40">
  <style>
    svg.dbd7 .hd{fill:var(--primary-soft)} svg.dbd7 .row{fill:var(--surface-2)}
    svg.dbd7 .th{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd7 .f{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dbd7 .code{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dbd7 .kw{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.dbd7 .ar{stroke:var(--muted);stroke-width:1.8;fill:none}
    svg.dbd7 .ah{fill:var(--muted)}
    svg.dbd7 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="hd" x="20" y="20" width="400" height="28" rx="4"/>
  <text class="th" x="28" y="39">Field</text><text class="th" x="120" y="39">Type</text><text class="th" x="190" y="39">Key</text><text class="th" x="240" y="39">Validation</text>
  <rect class="row" x="20" y="50" width="400" height="28"/><text class="f" x="28" y="69">RoomNo</text><text class="f" x="120" y="69">INT</text><text class="f" x="190" y="69">PK</text><text class="f" x="240" y="69">unique, presence</text>
  <rect class="row" x="20" y="80" width="400" height="28"/><text class="f" x="28" y="99">Capacity</text><text class="f" x="120" y="99">INT</text><text class="f" x="190" y="99">—</text><text class="f" x="240" y="99">range 1–40</text>
  <text class="s" x="20" y="130">data dictionary (design)</text>
  <rect class="code" x="20" y="146" width="720" height="74" rx="8"/>
  <text class="kw" x="34" y="170">CREATE TABLE</text><text class="f" x="140" y="170">Room (</text>
  <text class="f" x="54" y="190">RoomNo   INT</text><text class="kw" x="160" y="190">PRIMARY KEY</text><text class="f" x="256" y="190">,</text>
  <text class="f" x="54" y="210">Capacity INT</text><text class="kw" x="160" y="210">CHECK</text><text class="f" x="212" y="210">(Capacity BETWEEN 1 AND 40) );</text>
  <path class="ar" d="M430,64 C560,64 560,184 270,186"/><path class="ah" d="M272,180 l-12,6 l12,6 z"/>
  <path class="ar" d="M430,94 C620,94 640,206 480,206"/><path class="ah" d="M482,200 l-12,6 l12,6 z"/>
  <text class="s" x="580" y="126">each row → one field line</text>
</svg>
:::

```sql | The music school design implemented as tables
CREATE TABLE Student (
    StudentID   VARCHAR(5)  PRIMARY KEY,
    FirstName   VARCHAR(30) NOT NULL,
    Surname     VARCHAR(30) NOT NULL,
    DateOfBirth DATE,
    ParentPhone VARCHAR(12)
);
CREATE TABLE Teacher (
    TeacherID  VARCHAR(4)  PRIMARY KEY,
    Name       VARCHAR(50) NOT NULL,
    Instrument VARCHAR(20)
);
CREATE TABLE Room (
    RoomNo   INT PRIMARY KEY,
    Capacity INT CHECK (Capacity BETWEEN 1 AND 40)
);
CREATE TABLE Lesson (
    LessonID   INT AUTO_INCREMENT PRIMARY KEY,
    StudentID  VARCHAR(5) NOT NULL,
    TeacherID  VARCHAR(4) NOT NULL,
    RoomNo     INT,
    LessonDate DATE NOT NULL,
    StartTime  TIME,
    Attended   BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (TeacherID) REFERENCES Teacher(TeacherID),
    FOREIGN KEY (RoomNo)    REFERENCES Room(RoomNo)
);
```

:::compare Data dictionary item → SQL
| In the data dictionary | In `CREATE TABLE` |
|---|---|
| Field name + data type + size | `Surname VARCHAR(30)` |
| Key: PK | `PRIMARY KEY` |
| Key: FK → Student | `FOREIGN KEY (StudentID) REFERENCES Student(StudentID)` |
| Presence check | `NOT NULL` |
| Uniqueness check | `UNIQUE` (a PK is unique automatically) |
| Range check | `CHECK (Capacity BETWEEN 1 AND 40)` |
| Default value | `DEFAULT FALSE` |
| Format / complex checks | In the form or program code (input masks, `pattern`) |
:::

:::tip Order of creation
Create the tables on the **"one" side first** (Student, Teacher, Room) and the link table (Lesson) **last** — a foreign key can only reference a table that already exists.
:::

:::compare Checking the design before it is built
| Check | Question to ask |
|---|---|
| **Requirements** | Can every screen and report the client asked for be produced from these tables? |
| **Normalisation** | Is each fact stored once? No repeating groups, partial or transitive dependencies (3NF)? |
| **Keys** | Does every table have a PK? Is every relationship made with an FK on the "many" side? |
| **Data types and validation** | Does every type fit its example? Does every field have suitable validation? |
| **Test data** | Can sample records be entered, rejected when invalid and joined correctly? |
:::

:::warning Common mistakes
- Creating the **link table first** — its foreign keys refer to tables that do not exist yet.
- A `CHECK` that contradicts the data dictionary (dictionary says 1–40, SQL says `> 0`).
- Forgetting `NOT NULL` on foreign keys that must always be filled (every lesson needs a student).
:::

# Exam practice and summary
@lo 11.2.2.2 11.4.1.6

:::example Exam-style answers
**Q: Name four items that should be recorded in a data dictionary for each field. [4]**
Any four: field name (1), data type (1), field size / length (1), key (PK / FK) (1), validation rule, format, description, example value.

**Q: Complete the data dictionary entry for `ParentPhone`: data type, size and one validation rule. [3]**
VARCHAR / text (1); 12 (1); length check = 12 characters / format `+7` followed by 10 digits / presence (1).

**Q: Explain why `StudentID` must have the same data type and size in Student and Lesson. [2]**
It is the primary key in Student and the foreign key in Lesson, used to join the tables (1); if the types differ, values cannot be matched / stored, so the join and referential integrity fail (1).

**Q: Suggest a suitable validation rule for `StartTime` and justify it. [2]**
Range check 08:00–20:00 (1) because the school is only open in those hours, so impossible times are rejected (1).

**Q: Write the SQL to create the table `Room(RoomNo, Capacity)` with a primary key and a check that the capacity is from 1 to 40. [3]**
`CREATE TABLE Room (` with both fields and suitable types (1); `RoomNo INT PRIMARY KEY` (1); `CHECK (Capacity BETWEEN 1 AND 40)` / `CHECK (Capacity >= 1 AND Capacity <= 40)` (1).
:::

:::warning Common mistakes in exam answers
- Giving only the **name** of a check ("range check") when the question asks for a **rule** — give the limits: "1 to 40".
- Writing "number" as a data type — use the exact type: INT, DECIMAL, VARCHAR, DATE, BOOLEAN.
- Forgetting that the size of a VARCHAR must fit the **longest** value (+7 and 10 digits = 12).
- In SQL, missing `REFERENCES Table(Field)` after `FOREIGN KEY (…)`.
:::

:::compare Summary — database design in one table
| Step | Output | Key rule |
|---|---|---|
| 1 Entities and attributes | List of tables and fields | Nouns with their own data and many instances → entities |
| 2 Relationships | Degree of each link | Ask in both directions; resolve M:M with a link entity |
| ERD | The diagram | FK on the "many" side; crow's foot at the "many" end |
| 3 Data dictionary | Field-by-field specification | Type fits the example; FK = PK type; every field validated |
| 4 SQL | `CREATE TABLE` statements | "One" side first; validation → NOT NULL / UNIQUE / CHECK |
:::

:::steps Check yourself
- Name the two main documents of database design and say what each shows.
- Write a full data dictionary (name, type, size, key, validation, description, example) for one table.
- Choose a data type for an ID, a phone number, a price, a date and a yes/no field — and justify each.
- Explain referential integrity and why FK and PK types must match.
- Turn a data dictionary into `CREATE TABLE` with PK, FK, NOT NULL and CHECK.
:::
