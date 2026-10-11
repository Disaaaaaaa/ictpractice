---
summary: What a relational database is and why it is used, the terms table, record (tuple), field (attribute), data type and index, and the difference between primary, foreign and composite keys.
---
# Databases and their purpose
@lo 11.4.1.1

:::definition Database
An **organised, structured collection of related data**, stored electronically so that it can be **searched, sorted, updated and analysed** easily. A **database management system (DBMS)** is the software used to create, manage and access the database (e.g. MySQL, PostgreSQL, Microsoft Access, SQLite).
:::

:::definition Relational database
A database in which the data is stored in **several linked tables** (relations). Each table holds data about **one type of thing (entity)**, and tables are **linked by keys** — a **primary key** in one table appears as a **foreign key** in another.
:::

:::compare Flat-file database vs relational database
| | Flat file (one big table) | Relational database (linked tables) |
|---|---|---|
| Structure | All data in **one table** | Data split into **several tables** linked by keys |
| Data redundancy | **High** — the same data (e.g. a teacher's name) is repeated in many rows | **Low** — each fact is stored **once** |
| Consistency | Copies can disagree after an update (**update anomaly**) | A change is made in **one place** and applies everywhere |
| Storage | Wastes space | Uses less space |
| Queries | Simple, but limited | Powerful queries across tables (SQL `JOIN`) |
| Design | Easy to set up | Needs careful design (keys, normalisation) |
:::

:::example Why split the data? A school library
**Flat file:**
| LoanID | Student | Class | Book | Author |
|---|---|---|---|---|
| 1 | Aruzhan Bekova | 11A | The Hobbit | J. R. R. Tolkien |
| 2 | Aruzhan Bekova | 11A | Abai Zholy | M. Auezov |
| 3 | Timur Ospanov | 12B | The Hobbit | J. R. R. Tolkien |

Aruzhan's class and *The Hobbit*'s author are stored **twice**. If Aruzhan moves to 11B, **every** row must be changed — miss one and the data becomes **inconsistent**.

**Relational:** a `Students` table, a `Books` table and a `Loans` table that only stores `StudentID`, `BookID` and the date — each student and each book is stored **once**.
:::

:::cards
### Purpose / advantages of a relational database
- **Reduced data redundancy** — less repeated data, less storage.
- **Data consistency and integrity** — a change in one table is seen everywhere; keys stop invalid links.
- **Easier updates** — data is changed in one place.
- **Powerful searching** — complex queries combine data from several tables.
- **Security** — users can be given access only to certain tables.
- **Data sharing** — many users and programs use the same data at the same time.
### Typical uses
- School information systems (students, classes, marks).
- Online shops (customers, products, orders).
- Banks, hospitals, libraries, airline bookings.
- The data behind almost every website and mobile app.
:::

# Tables, records and fields
@lo 11.4.1.2

:::compare Database terms
| Term | Also called | Meaning | Example |
|---|---|---|---|
| **Entity** | — | A thing about which data is stored | A student, a book |
| **Table** | Relation, file | A **collection of related records** about one entity | `Students` |
| **Record** | **Tuple**, row | A **collection of related fields** about **one** item | All the data about Aruzhan |
| **Field** | **Attribute**, column | **One item of data** about every record | `Surname`, `DateOfBirth` |
| **Field value** | Cell | The data in one field of one record | `Bekova` |
| **Data type** | — | The kind of data a field holds | Text, Integer, Real, Date, Boolean |
:::

:::ascii The parts of a table
                       fields / attributes (columns)
                 +-----------+-----------+----------+--------+
                 | StudentID | FirstName | Surname  | Class  |
                 +-----------+-----------+----------+--------+
 record / tuple  | S001      | Aruzhan   | Bekova   | 11A    |   <- one row
 (rows)          | S002      | Timur     | Ospanov  | 12B    |
                 | S003      | Dana      | Seitova  | 11A    |
                 +-----------+-----------+----------+--------+
                   primary key
:::

:::compare Common data types
| Data type | Stores | Example field |
|---|---|---|
| **Text / String / VARCHAR** | Letters, digits, symbols | Surname, PhoneNumber, Postcode |
| **Integer** | Whole numbers | Age, Quantity |
| **Real / Decimal / Float** | Numbers with a decimal part | Price, Height |
| **Date / Time** | Dates and times | DateOfBirth |
| **Boolean** | True / False | IsMember, Paid |
:::

:::tip Phone numbers are text
Store phone numbers, ID numbers and postcodes as **text**: you never do arithmetic on them, and they may start with `0` or `+`.
:::

# Indexes
@lo 11.4.1.2

:::definition Index
A separate data structure that stores the values of **one or more fields** in **sorted order** together with **pointers to the records**, so that the DBMS can **find records quickly** without reading the whole table — like the index at the back of a book.
:::

:::cards
### Advantages of an index
- **Searching and sorting are much faster**, especially in large tables.
- Speeds up **queries** that use `WHERE` and `JOIN` on the indexed field.
- A **unique index** prevents duplicate values (the primary key is indexed automatically).
### Disadvantages
- Takes **extra storage space**.
- **Inserting, updating and deleting** records is slower, because the index must also be updated.
- Too many indexes on small tables give little benefit.
:::

:::example When to add an index
A library table has 2 000 000 loans and staff often search by `StudentID` → add an index on `StudentID`. The `Notes` field is rarely searched → no index needed.
:::

# Primary, foreign and composite keys
@lo 11.4.1.3

:::definition Primary key
A field (or combination of fields) whose value **uniquely identifies each record** in a table. It **cannot be empty (null)** and **cannot be repeated**. Example: `StudentID` in `Students`.
:::

:::definition Foreign key
A field in one table that is the **primary key of another table**. It is used to **link (relate)** the two tables. Example: `StudentID` in the `Loans` table links each loan to a student.
:::

:::definition Composite (compound) key
A primary key made of **two or more fields** that **together** uniquely identify a record, when no single field is unique on its own. Example: in `Results(StudentID, SubjectID, Mark)`, a student has many results and a subject has many results, but the pair **(StudentID, SubjectID)** is unique.
:::

```text | A relational database for a library (primary keys underlined with _, foreign keys marked *)
Students ( _StudentID_, FirstName, Surname, Class )
Books    ( _BookID_, Title, Author, Year )
Loans    ( _LoanID_, StudentID*, BookID*, LoanDate, ReturnDate )
```

:::compare Keys in the library database
| Table | Primary key | Foreign key(s) |
|---|---|---|
| Students | StudentID | None |
| Books | BookID | None |
| Loans | LoanID | StudentID, BookID |
:::

:::compare Primary key vs foreign key
| | Primary key | Foreign key |
|---|---|---|
| Purpose | **Uniquely identifies** each record in **its own** table | **Links** a record to a record in **another** table |
| Unique? | Yes — no duplicates | No — the same value can appear many times (one student has many loans) |
| Can be empty? | No | Can be empty if the link is optional |
| Number per table | One (which may be composite) | Zero, one or many |
:::

:::compare Simple vs composite primary key
| | Simple key | Composite key |
|---|---|---|
| Fields | **One** field | **Two or more** fields together |
| Example | `StudentID` in `Students` | `(StudentID, SubjectID)` in `Results`; `(FlightNo, Date)` for flights |
| When used | A single field is always unique | No single field is unique on its own |
:::

:::callout info Other kinds of key
- **Candidate key** — any field that **could** be the primary key (e.g. `StudentID` or `PassportNo`).
- **Secondary (alternate) key** — a field that is **indexed** for searching but is not the primary key, e.g. `Surname`.
:::

:::definition Referential integrity
A rule enforced by the DBMS: every **foreign-key value must match an existing primary-key value** in the linked table. You cannot add a loan for student `S999` if no such student exists, and you cannot delete a student who still has loans (or the loans are deleted too).
:::

# Exam practice and summary
@lo 11.4.1.1 11.4.1.2 11.4.1.3

:::example Exam-style answers
**Q: Define the terms record and table. [2]**
A **record** is a collection of related fields (about one item) (1). A **table** is a collection of related records (1).

**Q: Define the term tuple. [1]**
A tuple is **one row / record** in a database table.

**Q: State the difference between simple and composite primary keys. [2]**
Simple primary keys use a **single field** (1); composite primary keys use **multiple fields** (1).

**Q: Explain the difference between primary and foreign keys in the given database. [2]**
The primary key `pub_ID` **uniquely identifies each record** in the `Publishers` table (1); `pub_ID` in the `Titles` table is a **foreign key** that **links** each title to its publisher (1).

**Q: State one advantage of using a relational database. [1]**
**Reduced data redundancy** / less repeated data; or maintains **data consistency / integrity**; or a change in one table is automatically reflected everywhere.
:::

:::warning Common mistakes
- Mixing up **record** (a row) and **field** (a column).
- Saying the foreign key is unique — it is the **primary** key that is unique.
- Choosing a primary key that can repeat or be empty (e.g. `Surname`, `Class`).
- Giving only **one** field when the question asks for a composite key or for "all foreign keys".
- Saying an index makes **everything** faster — it slows down inserts and updates.
:::

:::steps Check yourself
- What is the purpose of a relational database? Give three advantages over a flat file.
- Define table, record (tuple), field (attribute) and index.
- What data type would you use for: price, phone number, date of birth, paid?
- Define primary, foreign and composite keys with an example of each.
- Identify the primary and foreign keys in `Orders(OrderID, CustomerID, ProductID, Date)`.
- What is referential integrity?
:::
