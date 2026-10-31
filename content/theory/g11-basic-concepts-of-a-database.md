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

# The database management system (DBMS)
@lo 11.4.1.1

:::definition Database management system (DBMS)
The **software** that creates, stores, manages and controls access to a database. Users and programs never read the data files directly: every request goes **through the DBMS**. Examples: **MySQL**, **PostgreSQL**, **Microsoft Access**, **SQLite**, **Oracle**.
:::

:::cards
### Defining the structure
The DBMS creates the **tables**, **fields**, **data types** and **keys**, and keeps their description in a **data dictionary**.
### Storing and retrieving data
It **adds, changes, deletes and finds** records, usually through a query language such as **SQL**.
### Integrity
It **checks the data** as it is entered: data types, validation rules, unique primary keys and valid foreign keys (referential integrity).
### Security
**User accounts, passwords and access rights**: e.g. pupils may only read their marks, teachers may change them.
### Many users at once
It lets **many users** work with the same data at the same time without one user's change overwriting another's (**concurrency control**, record locking).
### Backup and recovery
It **backs up** the data and **restores** it after a failure, so data is not lost.
:::

:::ascii Users never touch the data files directly
  Pupils' app      Teachers' website      Office staff
        \                 |                   /
         \                |                  /
          +---------  DBMS (e.g. MySQL)  ----------+
          | checks rights, validates, runs queries |
          +-------------------+--------------------+
                              |
                     Database (tables, indexes)
:::

:::example A school information system
When a teacher enters a mark of **105** out of 100, the DBMS **rejects** it (validation rule). When two teachers enter marks for the same class at the same time, the DBMS **locks** each record while it is being changed. Every night it makes a **backup**.
:::

:::tip Database or DBMS?
The **database** is the organised **data**. The **DBMS** is the **software** that manages it. "MySQL is a database" is a common mistake — MySQL is a **DBMS**.
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

:::example Counting records and fields
| BookID | Title | Author | Year |
|---|---|---|---|
| B01 | Abai Zholy | M. Auezov | 1942 |
| B02 | The Hobbit | J. R. R. Tolkien | 1937 |
| B03 | Kartkozha | Zh. Aimauytov | 1926 |

This table has **3 records** (rows) and **4 fields** (columns). The **field value** in record B02, field `Author`, is `J. R. R. Tolkien`. The column headings are **field names**, not records.
:::

:::cards
### Rules for a well-designed table
- Each table stores data about **one entity** only (pupils **or** books, not both).
- Each **field** holds **one** item of data (not two phone numbers in one field).
- Every record has the **same fields**, in the same order.
- Every record can be **identified uniquely** (by the primary key — see below).
- Field names are **short, clear and without spaces**, e.g. `DateOfBirth`.
:::

# Data types and field sizes
@lo 11.4.1.2

Every field has a **data type**: it tells the DBMS what kind of data the field may hold, how much space to give it and what can be done with it.

:::compare Common data types
| Data type | Stores | SQL name | Example field | Example value |
|---|---|---|---|---|
| **Text / String** | Letters, digits, symbols | `VARCHAR(n)`, `CHAR(n)` | Surname, PhoneNumber | `Bekova`, `+77011234567` |
| **Integer** | Whole numbers | `INT` | Age, Quantity | `16` |
| **Real / Decimal** | Numbers with a decimal part | `DECIMAL(p,s)`, `FLOAT` | Price, Height | `1850.50` |
| **Date / Time** | Dates and times | `DATE`, `DATETIME` | DateOfBirth | `2009-03-14` |
| **Boolean** | True / False only | `BOOLEAN` | IsMember, Paid | `TRUE` |
:::

:::cards
### Why the data type matters
- **Validation** — the DBMS rejects data of the wrong kind (letters in an `Age` field).
- **Storage** — each type uses a known amount of space.
- **Operations** — numbers can be added and averaged, dates compared and sorted by time, text searched.
- **Correct sorting** — numbers stored as text sort wrongly: `"100"` comes before `"9"`.
### Field size
- A **text** field has a **maximum length**: `VARCHAR(30)` holds up to 30 characters.
- Choose a size that fits the **longest real value** with a little spare: too small cuts data off, too large wastes space and lets invalid data in.
- `CHAR(n)` always uses **n** characters — good for codes of fixed length, e.g. `CHAR(2)` for `KZ`.
:::

:::tip Phone numbers are text
Store phone numbers, ID numbers and postcodes as **text**: you never do arithmetic on them, and they may start with `0` or `+`, which a number field would lose.
:::

:::example Designing the fields of a Pupils table
| Field | Data type | Size | Reason |
|---|---|---|---|
| PupilID | Text | `CHAR(5)` | Fixed format such as `P0001`; never used in calculations |
| Surname | Text | `VARCHAR(40)` | Names have different lengths |
| DateOfBirth | Date | — | Lets the DBMS work out ages and sort by date |
| MarkAverage | Real | `DECIMAL(4,2)` | Values such as `87.25` |
| IsBoarder | Boolean | — | Only two possible values |
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

## How an index speeds up a search

:::steps Searching without and with an index
- **Without an index** the DBMS reads **every record** from the first to the last and compares the field (a linear search). In a table of 1 000 000 records it may read all 1 000 000.
- **With an index** the DBMS looks the value up in the **sorted** index (like finding a word in a dictionary) — about **20 steps** for 1 000 000 values — and then follows the **pointer** straight to the record.
:::

:::compare Which fields should be indexed?
| Index it | Do not index it |
|---|---|
| The **primary key** (done automatically) | Fields that are **rarely searched**, e.g. `Notes` |
| **Foreign keys** used to join tables | Small tables with a few dozen records |
| Fields often used in `WHERE` or `ORDER BY`, e.g. `Surname` | Fields that **change very often** (every update rewrites the index) |
:::

# Exam practice: databases, tables and indexes
@lo 11.4.1.1 11.4.1.2

:::example Exam-style answers
**Q: Describe what is meant by a relational database. [2]**
Data is stored in **several tables** (relations) (1) that are **linked by keys / common fields** (1).

**Q: State two functions of a DBMS. [2]**
Any two: controls **access / security** (user rights); **validates** data / keeps integrity; allows **many users** at once; **backup and recovery**; stores / retrieves data with **queries**.

**Q: Explain why a phone number should be stored as text. [2]**
No **calculations** are done with it (1); it may start with **0 or +** / contain spaces, which a number field would lose (1).

**Q: Describe the purpose of an index. [2]**
It stores the values of a field in **sorted order with pointers** to the records (1) so that records can be **found / sorted faster** (1).

**Q: State one disadvantage of an index. [1]**
Uses **extra storage**, or makes **inserting / updating** records **slower**.
:::

:::warning Common mistakes: databases, tables and indexes
- Calling MySQL a **database** — it is a **DBMS**.
- Counting the **field names** row as a record.
- Storing numbers you calculate with (price, quantity) as **text**, or phone numbers as **integers**.
- Saying an index makes **everything** faster.
:::

# Primary keys
@lo 11.4.1.3

:::definition Primary key
A field (or combination of fields) whose value **uniquely identifies each record** in a table. Example: `StudentID` in `Students`.
:::

:::cards
### The rules of a primary key
- **Unique** — no two records have the same value.
- **Not empty (not null)** — every record must have a value.
- **Stable** — the value should never need to change.
- **One per table** — a table has exactly one primary key (which may be made of several fields).
### Choosing a good primary key
- `Surname`, `Class` or `DateOfBirth` are **bad** keys: two pupils can share them.
- `PassportNo` is unique, but some pupils have none (it could be empty).
- An **ID** created for the purpose — `StudentID = S0001` — is the safest choice.
:::

:::compare Natural key vs surrogate key
| | Natural key | Surrogate key |
|---|---|---|
| What it is | A real-world value that is already unique | An ID **invented** only to identify records |
| Example | ISBN of a book, IIN (ИИН) of a citizen | `StudentID` = 1, 2, 3 … (often `AUTO_INCREMENT`) |
| Advantage | Has a meaning; no extra field | Always unique, never empty, never changes |
| Disadvantage | May change, be missing or be private | Has no meaning outside the database |
:::

:::callout info Other kinds of key
- **Candidate key** — any field (or set of fields) that **could** be the primary key, e.g. both `StudentID` and `IIN` in `Students`. One of them is chosen as the primary key.
- **Secondary (alternate) key** — a field that is **indexed** for searching but is not the primary key, e.g. `Surname`.
:::

:::example Finding the primary key
`Employees(EmployeeID, IIN, Name, Department, Phone)`
- **Candidate keys:** `EmployeeID`, `IIN` (both unique for every employee).
- **Primary key:** `EmployeeID` — short, created by the company, never changes.
- **Not keys:** `Name` (two people can share a name), `Department` (many employees), `Phone` (can change, can be shared).
:::

# Foreign keys: linking tables
@lo 11.4.1.3

:::definition Foreign key
A field in one table that is the **primary key of another table**. It **links (relates)** the two tables. Example: `StudentID` in the `Loans` table links each loan to one student.
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

:::steps Following a link
- Loan `L17` has `StudentID = S002` and `BookID = B01`.
- Look up `S002` in `Students` → **Timur Ospanov, 12B**.
- Look up `B01` in `Books` → **Abai Zholy**.
- So: Timur borrowed *Abai Zholy*. The student's name and the book's title are stored **once**, in their own tables.
:::

:::compare Primary key vs foreign key
| | Primary key | Foreign key |
|---|---|---|
| Purpose | **Uniquely identifies** each record in **its own** table | **Links** a record to a record in **another** table |
| Unique? | Yes — no duplicates | No — the same value can appear many times (one student has many loans) |
| Can be empty? | No | Can be empty if the link is optional |
| Number per table | One (which may be composite) | Zero, one or many |
:::

:::tip Where does the foreign key go?
In a **one-to-many** link the foreign key goes on the **many** side: one student has **many** loans, so `StudentID` goes into `Loans`. A **many-to-many** link (students and clubs) needs a **link table** with two foreign keys: `Membership(StudentID*, ClubID*)`.
:::

# Composite keys
@lo 11.4.1.3

:::definition Composite (compound) key
A primary key made of **two or more fields** that **together** uniquely identify a record, when **no single field** is unique on its own.
:::

:::example Results of pupils in subjects
| StudentID | SubjectID | Mark |
|---|---|---|
| S001 | MATH | 87 |
| S001 | CS | 92 |
| S002 | MATH | 75 |

`StudentID` repeats (S001 has two results) and `SubjectID` repeats (MATH twice), so neither is unique alone. The **pair (StudentID, SubjectID)** never repeats → it is the **composite primary key**. Each of its fields is also a **foreign key** (to `Students` and `Subjects`).
:::

:::compare Simple vs composite primary key
| | Simple key | Composite key |
|---|---|---|
| Fields | **One** field | **Two or more** fields together |
| Example | `StudentID` in `Students` | `(StudentID, SubjectID)` in `Results`; `(FlightNo, FlightDate)` for flights; `(RoomNo, Date)` for room bookings |
| When used | A single field is always unique | No single field is unique on its own — typical in **link tables** |
:::

:::warning Composite key traps
- `(StudentID, Mark)` is **not** a good key: one student can get the same mark in two subjects.
- Do not add more fields than needed: if `(StudentID, SubjectID)` is unique, `(StudentID, SubjectID, Mark)` is not the key.
:::

# Referential integrity
@lo 11.4.1.3

:::definition Referential integrity
A rule enforced by the DBMS: every **foreign-key value must match an existing primary-key value** in the linked table (or be empty, if the link is optional). It stops records from pointing to things that do not exist.
:::

:::compare What the DBMS does to keep referential integrity
| Action | Example | What happens |
|---|---|---|
| **Insert** a record with an unknown foreign key | A loan for student `S999`, who is not in `Students` | **Rejected** |
| **Delete** a record that others refer to | Delete student `S002`, who still has loans | **Rejected** (restrict), or the loans are deleted too (**cascade delete**) |
| **Change** a primary key that others refer to | Change `S002` to `S020` | **Rejected**, or the foreign keys are changed too (**cascade update**) |
:::

:::example Why it matters
Without referential integrity a `Loans` record could point to a student who was deleted last year. Nobody would know who has the book — an **orphan record**. With it, the database stays **consistent**: every loan belongs to a real student and a real book.
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
