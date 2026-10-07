---
summary: What a relational database is and why it is used, the key terms table, record, field (attribute) and index, and primary, foreign and composite keys.
---
# Relational databases and their purpose
@lo 11.4.1.1

:::definition Database
An organised, structured collection of related data stored so that it can be easily **searched, sorted, updated and shared**.
:::

:::definition Relational database
A database in which data is stored in several **tables (relations)** that are **linked to each other by keys**. Each table stores data about one kind of thing (entity).
:::

:::compare Why use a relational database instead of one flat file?
| Problem with a single flat file | How a relational database solves it |
|---|---|
| **Data redundancy** — the same data is repeated in many rows | Each fact is stored **once**, in one table |
| **Inconsistency** — a change made in one row but not another | One copy → updates are consistent |
| Wasted storage | Less repeated data |
| Hard to search and combine data | Queries (SQL) join tables and filter data quickly |
| Weak security | Access rights per table/user; validation rules protect **data integrity** |
:::

:::example
A school stores student details in **Students**, course details in **Courses**, and which student takes which course in **Enrolments**. A student's address is stored once, even if they take ten courses.
:::

# Tables, attributes, records and indexes
@lo 11.4.1.2

:::compare Table: Students
| StudentID | FirstName | LastName | Grade | DateOfBirth |
|---|---|---|---|---|
| S001 | Aruzhan | Sadykova | 11 | 12/03/2009 |
| S002 | Timur | Ospanov | 12 | 30/11/2008 |
| S003 | Dana | Kim | 11 | 05/07/2009 |
:::

:::cards
### Table (relation)
A set of data about **one type of entity**, arranged in rows and columns. *Students* above is a table.
### Field / attribute
**One column** — one item of data stored about every entity. *FirstName, Grade.*
### Record (tuple)
**One row** — all the data about one entity. *S002, Timur, Ospanov, 12, 30/11/2008.*
### Index
An extra data structure that stores selected field values with pointers to records, so that searching and sorting on that field are **much faster** (like the index at the back of a book).
:::

:::tip
Mark-scheme definitions: "A **record** is a collection of related fields"; "A **table** is a collection of related records." Learn them word for word.
:::

:::warning
An index speeds up **searching**, but slows down inserting and updating (the index must be updated too) and uses extra storage.
:::

# Primary, foreign and composite keys
@lo 11.4.1.3

:::definition Primary key
A field (or fields) whose value **uniquely identifies each record** in a table. It cannot be empty and cannot repeat. *StudentID in Students.*
:::

:::definition Foreign key
A field in one table that is the **primary key of another table**; it creates the **link (relationship)** between the tables. *StudentID in Enrolments.*
:::

:::definition Composite (compound) key
A primary key made of **two or more fields** together, used when no single field is unique. *(StudentID, CourseID) in Enrolments — a student can take many courses and a course has many students, but each pair appears once.*
:::

:::compare Table: Enrolments
| StudentID (FK) | CourseID (FK) | Year |
|---|---|---|
| S001 | CS12 | 2026 |
| S001 | MA12 | 2026 |
| S002 | CS12 | 2026 |
:::

:::compare Simple vs composite primary key
| Simple primary key | Composite primary key |
|---|---|
| A **single field** | **Two or more fields** combined |
| e.g. StudentID | e.g. StudentID + CourseID |
| Used when one field is unique on its own | Used when only the combination is unique |
:::

:::tip
To explain a relationship in an exam, name **both** keys: "StudentID is the **primary key** in Students and a **foreign key** in Enrolments, which links the two tables."
:::
