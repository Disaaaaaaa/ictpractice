---
summary: Designing the database for a new system — finding entities and attributes in the requirements, deciding the degree of each relationship, drawing the ERD and resolving many-to-many relationships, then writing a complete data dictionary (data types, sizes, keys, validation) for every table and turning the design into CREATE TABLE statements.
---
# Database design in the system life cycle
@lo 11.2.2.2 11.4.1.6

During the **design** stage of a new system the analyst turns the **requirements specification** into an exact plan of the database. Nothing is built yet: the plan is checked with the client first, because a mistake found on paper costs minutes, but a mistake found after the tables are full of data costs days.

## Where database design fits in the life cycle

Database design sits between **analysis** and **development**. In the analysis stage the analyst interviewed the users, observed the current system and collected its documents, and the result was a **requirements specification**: a list of what the new system must store, what it must let users do and which reports it must produce. Database design takes that list and answers a different question — not *what* is needed, but *how exactly the data will be organised* so that every requirement can be met. The output of design is then the input of development: a programmer opens the ERD and the data dictionary and builds the tables in the chosen DBMS (for example MySQL, PostgreSQL, SQLite or Microsoft Access) without having to guess anything.

The design is also used **after** development. Testers read the data dictionary to choose **test data** — a valid value, a boundary value and an invalid value for every validated field — and to check that invalid data really is rejected. Years later, when the system is maintained or extended, a new programmer reads the same documents to understand the database before changing it. This is why the ERD and the data dictionary are kept as part of the **technical documentation** of the system, not thrown away once the tables exist.

## Restrictions that shape the design

A database is never designed in a vacuum. Before drawing anything the analyst must analyse the **restrictions (constraints)** of the new system, because each one changes the design:

- **The DBMS and hardware.** The chosen DBMS decides which data types exist (SQLite has no true BOOLEAN or DATE type; MySQL has both) and how large a table can become. A school that already has a licence for one product will not buy another.
- **Volume of data and number of users.** A library of 3 000 books and a national register of 20 million people need very different decisions about key sizes, indexes and performance. An `INT` key is enough for millions of records; a two-digit `VARCHAR(2)` key would run out after 100.
- **Legal restrictions.** In Kazakhstan the Law on Personal Data and its Protection requires that personal data (names, IIN, phone numbers, health data) is collected only with consent, stored securely and kept only as long as needed. The design must therefore decide which personal fields are really necessary, and may put sensitive data (e.g. medical notes) in a separate table with stricter access rights.
- **Time and budget.** A small project may use a simpler design with fewer tables if it still meets every requirement; there is no reason to model data that nobody will ever ask for.
- **Existing data.** If records are imported from an old spreadsheet, the new field types and sizes must be able to hold the old values — or the data must be cleaned during conversion.

Writing these restrictions down explains *why* the design looks the way it does, and in an exam a 4–6-mark "analyse" question about a new system expects you to link each restriction to a concrete consequence for the database.

## Why a poor design causes problems

Imagine the music school stores everything in **one** big table: every lesson row repeats the student's name and phone number and the teacher's name and instrument. It looks simple, but it causes three kinds of **anomaly**:

- **Update anomaly.** A parent changes their phone number. The number is stored in all 120 lesson rows of their child, so all 120 must be changed; if one is missed, the database now contains two different numbers and nobody knows which is right.
- **Insertion anomaly.** A new teacher is hired but has no lessons yet. There is no lesson row to put them in, so the teacher cannot be recorded at all.
- **Deletion anomaly.** A student's only lesson is deleted, and with it the only copy of the student's details.

A good design avoids all three by storing **each fact once**, in the table about the thing it describes (the phone number in *Student*, the instrument in *Teacher*), and by linking tables through **keys** instead of copying data. This is exactly what the ERD and the data dictionary make visible before a single record is typed in.

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

## Entity, instance and attribute — getting the level right

It helps to separate three ideas. An **entity** is the *kind* of thing — *Student*. An **instance** (or occurrence) of the entity is one particular student — Dana Seitova, S0107 — and becomes one **record (row)** in the table. An **attribute** is one property that every instance has — *DateOfBirth* — and becomes one **field (column)**. So the entity *Student* with five attributes and 300 instances becomes a table with five columns and 300 rows. If you can only think of **one** instance of something (the school itself, "the director"), it is usually not an entity at all but a fixed setting of the system.

Two further rules decide which attributes to keep. First, attributes should be **atomic** — one value that cannot sensibly be split. *FullName* is better stored as *FirstName* and *Surname*, because the school will want to sort by surname and write letters "Dear Dana"; an address is often split into *Street*, *City* and *PostCode* for the same reason. Second, **derived** attributes are normally **not stored**. A student's *Age* can always be calculated from *DateOfBirth* and today's date; if *Age* were stored it would be wrong one day a year. Likewise a lesson's *TotalFee* is calculated from the price and the number of lessons, not typed in.

## Choosing primary keys

Every entity needs a **primary key** so that each instance can be found and referred to without confusion. Sometimes the scenario already contains a field that is unique and stable — a **natural key**, such as a car's registration number or a book's ISBN. Often it does not: names repeat, phone numbers change and e-mail addresses are given up. Then the designer adds a **surrogate key** — an ID with no meaning of its own, such as `StudentID` or an auto-numbered `LessonID`. Surrogate keys are short, never change and never repeat, which makes them ideal for copying into other tables as foreign keys.

A key can also be **composite** — made of two or more fields together. In a link entity such as *Lesson*, the combination *StudentID + TeacherID + LessonDate + StartTime* identifies a lesson uniquely, so it could be the key. In practice designers usually add a single surrogate key (`LessonID`) because a one-field key is easier to refer to, and they keep the combination unique with a separate rule.

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

Why both directions? Because one answer alone is ambiguous. "One teacher gives many lessons" is true for a 1:M relationship *and* for an M:M one; only the reverse question — "can one lesson have many teachers?" — tells them apart. Always answer the questions **for the scenario you are given**, not for the real world in general: in a music school with individual lessons, a lesson has one student; in a school with group lessons the same pair would be M:M and would need another link entity (*Enrolment*).

## Understanding the three degrees

**One-to-many (1:M)** is by far the most common relationship and the one a relational database stores most naturally. One record on the "one" side (a teacher) is linked to any number of records on the "many" side (lessons), but each "many" record belongs to exactly one "one" record. It is implemented by putting the **primary key of the "one" table into the "many" table as a foreign key**: each lesson row has a `TeacherID` column. The foreign key must go on the "many" side because each lesson has *one* teacher — one value that fits in one field — while a teacher has *many* lessons, which would never fit in one field.

**One-to-one (1:1)** is rare. One instance of A is linked to at most one instance of B and vice versa — for example, each teacher is in charge of one classroom and each classroom has one teacher in charge. A 1:1 relationship can often be merged into one table; it is kept separate when the two entities have different lives (classrooms exist without a teacher in charge) or when some of the data is sensitive and must be protected separately (a *StudentMedical* table linked 1:1 to *Student*). The foreign key can go in either table, usually in the one whose records are optional.

**Many-to-many (M:M)** means that both questions get the answer "yes": a student has many teachers and a teacher has many students. Relational databases **cannot store an M:M relationship directly**. Try it: if `TeacherID` is put in *Student*, each student can have only one teacher. If columns *Teacher1*, *Teacher2*, *Teacher3* are added, the table has a **repeating group** — there is never the right number of columns, most of them are empty, and searching "all students of T012" means searching three columns. Putting `StudentID` in *Teacher* fails in the same way. The solution is a **link entity** (also called a junction or associative entity) between them, whose every record links **one** student to **one** teacher. The M:M is then replaced by two 1:M relationships, each with its foreign key in the link entity.

:::definition Link entity
An entity added to **resolve a many-to-many relationship**: it sits between the two entities, is on the **"many" side of two 1:M relationships**, and holds the **primary keys of both as foreign keys** — e.g. *Lesson* between *Student* and *Teacher*, *Loan* between *Member* and *Book*.
:::

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

## Reading crow's foot notation

An ERD is only useful if everyone reads it the same way, so a standard notation is used. In **crow's foot notation** each entity is a box with its name at the top (and, in a detailed ERD, its attributes, with the PK and FKs marked). A line joins two related entities, and the symbol at **each end** describes how many instances of *that* entity can be linked to one instance of the entity at the other end: a **single bar** means "one", a **crow's foot** (three prongs) means "many". To read a relationship, start at one box, follow the line and read the symbol at the far end: "one **Teacher** … teaches … **many** (crow's foot) Lessons"; then go back the other way: "one **Lesson** … is taught by … **one** (bar) Teacher".

Some textbooks and exam papers also mark **optionality** with a small circle ("zero or …"): a teacher who has just been hired may have **zero** lessons, so the Lesson end could show circle + crow's foot ("zero or many"). At this level you are mainly assessed on the **degree**, but if the scenario says "every lesson *must* have a teacher" you can show the single bar as "exactly one". Whatever notation is used, labels like `1` and `M` written next to the ends are always acceptable in an exam and remove any doubt.

:::example Worked example — an ERD for the Shipager clinic
*A private clinic in Shymkent records patients (IIN, name, phone), doctors (ID, name, speciality) and appointments (date, time, room, notes). Each appointment is for one patient with one doctor. At an appointment the doctor may prescribe several medicines; each medicine (code, name, price) is prescribed at many appointments, with a dose.*

1. **Entities:** Patient, Doctor, Appointment, Medicine.
2. **Patient — Appointment:** a patient has many appointments; an appointment is for one patient → **1:M**, FK `PatientIIN` in Appointment.
3. **Doctor — Appointment:** a doctor has many appointments; an appointment has one doctor → **1:M**, FK `DoctorID` in Appointment.
4. **Appointment — Medicine:** one appointment → many medicines, and one medicine → many appointments → **M:M**. Resolve it with the link entity **Prescription** (`AppointmentID` FK, `MedicineCode` FK, `Dose`). The *Dose* belongs here: it is not a fact about the medicine in general, nor about the appointment in general, but about *this medicine at this appointment*.
5. **Final ERD:** Patient 1:M Appointment M:1 Doctor; Appointment 1:M Prescription M:1 Medicine — five lines of reasoning, four 1:M relationships, no M:M left.
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

**Q: A clinic stores the doctor's name and phone number in every appointment record. Explain one problem this causes. [2]**
The doctor's details are repeated in many records (data redundancy) (1); if the phone number changes it must be updated in every appointment, and a missed record leaves inconsistent data (update anomaly) (1).

**Q: Explain how one restriction of a new system can affect the database design. [2]**
E.g. the Law on Personal Data requires personal data to be protected (1), so sensitive fields such as medical notes are kept in a separate table with restricted access / only necessary fields are stored (1).
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

## What a data dictionary is for

The ERD shows the *shape* of the database — which tables exist and how they are linked — but it says nothing about what a value looks like. Is `TeacherID` a number or text? How long can a surname be? What happens if someone types a start time of 25:00? The **data dictionary** answers these questions. It is often described as **"data about the data" (metadata)**: it does not contain the school's records, it describes the rules every record must follow.

Because it is so exact, the data dictionary serves several people at once. **Programmers** build each table directly from it, and when several programmers work on different parts of the system they all use the same names, types and sizes, so their parts fit together. **Testers** use the validation column to plan test data: for `Capacity` with a range of 1–40 they test 20 (normal), 1 and 40 (boundary), 0 and 41 (just outside) and "ten" (wrong type). The **client** can check that the information they need is really stored. And during **maintenance** it is the first document a new developer reads. A data dictionary that leaves cells empty or says "number" instead of a real data type fails all of these people.

## The columns of a data dictionary, one by one

Each **row** of the data dictionary describes one **field**, and each **column** records one fact about it:

- **Field name** — the exact name used in the DBMS and in SQL. It should be meaningful and contain **no spaces** (`DateOfBirth` or `date_of_birth`, not `Date of birth`), and the same name should be used for a foreign key as for the primary key it refers to, so the link is obvious.
- **Data type** — the kind of value stored: `INT`, `DECIMAL`, `VARCHAR`, `CHAR`, `DATE`, `TIME`, `BOOLEAN`. The type decides what the DBMS will accept and what can be done with the value (arithmetic on numbers, date comparisons on dates).
- **Size / length** — for text, the maximum number of characters (`VARCHAR(30)`); for decimals, the total digits and the decimal places (`DECIMAL(8,2)`). It must fit the **longest** real value and no more, so storage is not wasted.
- **Format** — how the value is written: `DD/MM/YYYY`, `S` followed by 4 digits, `+7` followed by 10 digits.
- **Key** — `PK`, `FK → Table`, or blank. A field can be both part of a key and validated.
- **Validation** — the rule a value must pass to be accepted, with its **limits**: "range 1–40", not just "range check".
- **Description** — what the field means in the real world and why it is stored, e.g. "Parent's mobile number, used for SMS reminders".
- **Example** — one realistic value. The example is a quick self-check: if the example `S0107` cannot be stored in the type you wrote, the type is wrong.

Some data dictionaries also include **Required (Y/N)** and **Default value** columns; both are useful and turn directly into SQL (`NOT NULL`, `DEFAULT`).

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

:::warning Common mistakes
- Writing a **data type that cannot hold the example** — INT for `S0107`, INT for `+77015554433`.
- Giving a foreign key a **different type or size** from the primary key it refers to.
- Leaving the **validation** column empty for keys — a PK always needs presence + uniqueness, an FK must exist in the other table.
- A validation rule that does not suit the data — a **range** check on a surname, a **lookup** on a date of birth.
- Describing the field in the *Description* column with just its name ("StudentID — student ID"): say what it stores and why.
:::

# Data types, field sizes and validation
@lo 11.4.1.6

The hardest columns of the data dictionary to fill in well are **data type**, **size** and **validation**. They decide whether the database will accept correct data, reject wrong data and still work when the data grows. This section explains how to choose each one and how they protect the **integrity** of the data.

:::definition Data type
The **kind of value a field can hold** — e.g. integer, decimal, text, date, time, Boolean. It decides which values the DBMS accepts, how much storage each value uses and which operations (calculation, sorting, date comparison) can be done on it.
:::

:::definition Validation
An **automatic check made by the computer** that input data is **reasonable and follows the rules** before it is accepted — e.g. presence, length, range, type, format, lookup and uniqueness checks. Validation cannot prove that data is *correct*, only that it is *sensible*.
:::

:::definition Data integrity
The **accuracy, consistency and completeness** of the data in a database. It is protected by **entity integrity** (every table has a unique, non-empty primary key), **referential integrity** (every foreign key matches an existing primary key) and **domain integrity** (every value has the right type, size and passes validation).
:::

## Choosing a data type

The rule is simple to say: **choose the type that matches what the value is and what will be done with it**. A value is a *number* only if you might calculate with it or compare it as a quantity. A seat count, a quantity in stock or a mark out of 40 is an `INT` (a whole number). A price or a fee has two decimal places and must be exact, so it is `DECIMAL(8,2)` — not a floating-point `REAL`, which can turn 0.10 + 0.20 into 0.30000000000000004. A height or a temperature measured approximately can be `REAL` / `FLOAT`.

Many values that look like numbers are really **text**. A phone number `+77015554433` contains a `+`, may start with `0` (which an integer would drop) and is never added up — it is a `VARCHAR(12)`. The same is true of an IIN (12 digits, may start with 0), a postcode and an ID such as `S0107`. Text comes in two forms: `CHAR(n)` always stores exactly *n* characters and suits fixed-length codes (`CHAR(2)` for a region code), while `VARCHAR(n)` stores up to *n* and suits names and descriptions whose length varies.

Dates and times have their own types, `DATE`, `TIME` and `DATETIME`. Storing a date as text (`"12/10/2026"`) looks harmless, but then the DBMS sorts it alphabetically — "02/11/2026" comes before "12/10/2026" — and cannot check that "31/02/2026" does not exist. A `DATE` field sorts correctly, rejects impossible dates and allows calculations such as "lessons in the last 30 days". Finally, a field with only two possible values — attended / not attended, paid / not paid — is a `BOOLEAN`.

:::compare Choosing data types and sizes
| Data | Data type | Size | Why |
|---|---|---|---|
| ID with letters, e.g. `S0107` | VARCHAR / CHAR | 5 | Contains a letter; fixed pattern |
| Auto-numbered ID | INT (auto-increment) | — | Whole numbers, generated by the DBMS |
| Name, surname | VARCHAR | 30–50 | Text of varying length |
| Phone `+77015554433` | VARCHAR | 12 | Has `+`, may start with 0, no arithmetic |
| IIN `050312500123` | CHAR | 12 | Always 12 digits, may start with 0, no arithmetic |
| Date of birth, lesson date | DATE | — | Allows date checks and sorting by date |
| Start time | TIME | — | A time of day |
| Price, fee `12500.00` | DECIMAL(8,2) | — | Money has two decimal places and must be exact |
| Number of seats | INT | — | Whole number, used in calculations |
| Attended? Paid? | BOOLEAN | — | Only True / False |
:::

## Choosing the size

For text fields the size is the **maximum length** the field will ever need. Work it out from the longest realistic value, not from the example: a Kazakh surname such as *Nurmukhambetova* has 15 letters, so `VARCHAR(30)` leaves room for double-barrelled names, while `VARCHAR(10)` would cut real names short. For a code with a fixed format the size is exact — `S` + 4 digits is 5 characters, `+7` + 10 digits is 12. A size that is far too large (`VARCHAR(255)` for everything) is not an error in a small database, but it hides the designer's thinking and allows nonsense input; in an exam always give a size you can justify. A foreign key always takes **exactly the same type and size** as the primary key it refers to.

## Choosing validation

Validation stops obviously wrong data from entering the database. Each check has a purpose, and a good data dictionary picks the checks that suit each field:

- **Presence check** — the field must not be left empty. Used for every primary key and for data the system cannot work without (a lesson's date).
- **Type check** — the value must be of the right data type (a number in `Capacity`, a real date in `LessonDate`).
- **Length check** — the number of characters is within limits (a phone number has exactly 12 characters; a surname 1–30).
- **Range check** — a number or date lies between a lower and an upper limit (capacity 1–40; lesson date not before the start of the school year).
- **Format check** — the value follows a pattern (`S` followed by four digits; `+7` followed by ten digits).
- **Lookup (list) check** — the value must be one of a fixed list (instrument: piano, dombra, violin, guitar) or, for a foreign key, must **exist in the other table**.
- **Uniqueness check** — no two records may have the same value (every primary key; often an e-mail or IIN too).

:::svg How validation and integrity rules protect the database
<svg class="dbd8" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A new lesson record passes presence, type and range checks, then a referential integrity check against the Student table, and is either stored or rejected with an error message">
  <style>
    svg.dbd8 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dbd8 .ck{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.8}
    svg.dbd8 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.8}
    svg.dbd8 .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.8}
    svg.dbd8 .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.dbd8 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dbd8 .ln{stroke:var(--muted);stroke-width:1.8;fill:none}
    svg.dbd8 .ah{fill:var(--muted)}
    svg.dbd8 .r{font:600 12px system-ui,sans-serif;fill:var(--danger)}
    svg.dbd8 .g{font:600 12px system-ui,sans-serif;fill:var(--success)}
  </style>
  <rect class="bx" x="10" y="40" width="130" height="70" rx="8"/>
  <text class="t" x="22" y="66">New Lesson</text><text class="s" x="22" y="86">S0107, T012,</text><text class="s" x="22" y="102">room 14, 15:30</text>
  <path class="ln" d="M140,75 H160"/><path class="ah" d="M160,69 l12,6 l-12,6 z"/>
  <rect class="ck" x="174" y="40" width="160" height="70" rx="8"/>
  <text class="t" x="186" y="64">Validation</text><text class="s" x="186" y="84">presence · type ·</text><text class="s" x="186" y="100">range 08:00–20:00</text>
  <path class="ln" d="M334,75 H354"/><path class="ah" d="M354,69 l12,6 l-12,6 z"/>
  <rect class="ck" x="368" y="40" width="204" height="70" rx="8"/>
  <text class="t" x="380" y="64">Referential integrity</text><text class="s" x="380" y="84">does S0107 exist in Student?</text><text class="s" x="380" y="100">does T012 exist in Teacher?</text>
  <path class="ln" d="M572,75 H588"/><path class="ah" d="M588,69 l12,6 l-12,6 z"/>
  <rect class="ok" x="602" y="40" width="148" height="70" rx="8"/>
  <text class="t" x="614" y="66">Record stored</text><text class="g" x="614" y="88">✓ all rules passed</text>
  <path class="ln" d="M254,110 V160"/><path class="ah" d="M248,158 l6,12 l6,-12 z"/>
  <path class="ln" d="M463,110 V160"/><path class="ah" d="M457,158 l6,12 l6,-12 z"/>
  <rect class="no" x="174" y="172" width="384" height="66" rx="8"/>
  <text class="t" x="188" y="196">Rejected with an error message</text>
  <text class="r" x="188" y="218">e.g. "Start time must be 08:00–20:00" or "Student S9999 not found"</text>
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

## Validation is not verification

Validation only checks that data is **sensible**: a phone number `+77015554433` passes the format check even if the parent's real number is `+77015554434`. Making sure that data was **copied correctly** from its source is called **verification** — for example, asking the user to type a password twice, or checking the entered data against the paper form. A data dictionary records validation rules; verification is a procedure of data entry.

:::compare Validation vs verification
| | Validation | Verification |
|---|---|---|
| Question it answers | Is the data **reasonable** and does it follow the rules? | Was the data **entered exactly as in the source**? |
| Done by | The computer, automatically | The user or a second person / second entry |
| Examples | Range 1–40, format `S`+4 digits, presence | Double entry of a password, visual check against the form |
| Recorded in the data dictionary? | Yes — the *Validation* column | No — part of the data-entry procedure |
| Can it catch `+77015554434` typed instead of `…33`? | No — it is a valid phone number | Yes — it differs from the source |
:::

:::example Worked example — choosing types, sizes and checks for a shop's Product table
*An online bookshop in Astana stores for each product: a code like `BK-00451`, a title, a price in tenge (up to 99 999.99), the number in stock, the date it was added and whether it is on sale.*

| Field | Decision | Reasoning |
|---|---|---|
| ProductCode | VARCHAR(8), PK; presence, format `BK-` + 5 digits, unique | Contains letters and a dash, fixed length 8 |
| Title | VARCHAR(100); presence, length 1–100 | Book titles are long and vary in length |
| Price | DECIMAL(7,2); range 0.01–99 999.99 | Money: exact, two decimals; 5 digits before the point + 2 after = 7 |
| InStock | INT; range 0–9 999, default 0 | A whole-number quantity used in calculations; cannot be negative |
| DateAdded | DATE; not in the future | Allows "new this month" reports and correct sorting |
| OnSale | BOOLEAN; default False | Only two possible values |
:::

:::warning Common mistakes
- Choosing `INT` for a phone number, an IIN or a postcode — the leading `0` or `+` is lost, and nobody calculates with them.
- Using `REAL` / `FLOAT` for money instead of `DECIMAL` — rounding errors appear in totals.
- Storing dates as `VARCHAR` — they sort in the wrong order and impossible dates are accepted.
- Saying validation makes data **correct** — it only makes it **reasonable**; correctness needs verification.
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

## What the DBMS does with the design

Once the tables are created, the rules of the data dictionary are no longer just written on paper — the **DBMS enforces them** on every insert and update, whichever program or user sends the data. If a receptionist tries to add a lesson for student `S9999`, the `FOREIGN KEY … REFERENCES Student(StudentID)` constraint makes the DBMS refuse the record, because no such student exists: this is **referential integrity** at work. If someone tries to delete student `S0107` while lessons still refer to them, the DBMS refuses that too, so no lesson is left pointing at nobody. A `PRIMARY KEY` refuses a second record with the same ID and refuses an empty one (**entity integrity**); a `CHECK` refuses a capacity of 0; `NOT NULL` refuses an empty date.

Not every rule can be written in a simple `CREATE TABLE`. A format such as "`S` followed by four digits" or a lookup list that changes often is usually checked in the **input form** or the program (an input mask, a drop-down list, a `pattern` attribute in an HTML form) as well. Good systems validate **twice**: in the form, so the user gets a friendly message at once, and in the database, so that no route around the form can store bad data.

## Testing the design

Before real data is loaded, the designer enters a small set of **test records** to prove the design works: normal records that must be accepted, boundary values (capacity 1 and 40), and erroneous values (capacity 41, a lesson for a student who does not exist) that must be rejected. Then the queries for every required report are run — "all lessons of teacher T012 this week", "students who missed more than two lessons" — to check that the tables and their links really can answer the client's questions. Any failure sends the analyst back to the ERD or the data dictionary, which is still far cheaper than discovering it after the system goes live.

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

**Q: Explain why a phone number should be stored as VARCHAR rather than INT. [2]**
It contains a `+` / may start with 0, which an integer cannot store / would lose (1); no calculations are done with it, so it is text (1).

**Q: Explain the difference between validation and verification. [2]**
Validation is an automatic check that data is reasonable / follows rules, e.g. a range check (1); verification checks that data was entered exactly as in the source, e.g. double entry (1).
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
