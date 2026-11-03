---
summary: Entities, attributes and relationships; one-to-one, one-to-many and many-to-many relationships; how relationships are created with primary and foreign keys and link tables; and how to read and draw entity-relationship diagrams (ERDs).
---
# Entities, attributes and relationships
@lo 11.4.1.7

:::definition Entity
A **thing (person, object, place or event)** about which data is stored — for example *Student*, *Book*, *Order*. Each entity becomes a **table** in a relational database.
:::

:::definition Attribute
A **property** of an entity — one item of data stored about it, e.g. *StudentID*, *Name*, *DateOfBirth*. Each attribute becomes a **field (column)**.
:::

:::definition Relationship
A **link between two entities** that shows how their records are connected, e.g. *a teacher **teaches** many classes*. In a database a relationship is created with a **primary key** in one table and a matching **foreign key** in another.
:::

:::definition Entity-relationship diagram (ERD)
A diagram that shows the **entities** in a system (as boxes), the **relationships** between them (as lines), and the **degree (cardinality)** of each relationship — one-to-one, one-to-many or many-to-many. It is drawn during the **design** stage, before the tables are created.
:::

## Finding entities and attributes in a description

:::steps Reading a description like an analyst
- Underline the **nouns**: the important ones about which **many records** are kept are **entities** (*member*, *trainer*, *class*).
- The **details** stored about each entity are its **attributes** (*member's name*, *phone*, *date joined*).
- The **verbs** that connect two entities are **relationships** (*a trainer **leads** a class*, *a member **books** a class*).
- Choose an attribute that is **unique** for every record as its identifier (*MemberID*) — it will become the primary key.
:::

:::example A gym
*A gym has many **members**. Each member has a member number, a name, a phone number and the date they joined. Members **book** fitness **classes**; each class has a code, a name, a day and a time. Each class is **led** by one **trainer**; a trainer has a staff number and a name and can lead several classes.*

| Entity | Attributes | Identifier |
|---|---|---|
| Member | MemberNo, Name, Phone, DateJoined | MemberNo |
| Class | ClassCode, ClassName, Day, Time | ClassCode |
| Trainer | StaffNo, Name | StaffNo |

Relationships: *Trainer **leads** Class*, *Member **books** Class*.
:::

:::compare Entity, attribute or value?
| | Entity | Attribute | Value |
|---|---|---|---|
| What it is | A **kind of thing** with many records | A **property** of that thing | **One piece of data** in one record |
| Becomes | A table | A field | A cell |
| Example | `Pupil` | `Surname`, `Class` | `Bekova`, `11A` |
:::

:::warning Typical confusion
`11A` is a **value** of the attribute `Class`, not an entity. `DateOfBirth` is an **attribute** of `Pupil`. Something becomes a separate entity only if you need to store **several facts about it** (e.g. `Class` with its room and form tutor).
:::

# Types of relationship
@lo 11.4.1.7

:::compare The three types of relationship
| Type | Meaning | Examples |
|---|---|---|
| **One-to-one (1:1)** | Each record in A is linked to **at most one** record in B, and each record in B to **one** in A | Country — Capital city; Person — Passport; Student — Locker |
| **One-to-many (1:M)** | One record in A is linked to **many** records in B, but each record in B is linked to **only one** in A | Publisher — Titles; Class — Pupils; Customer — Orders |
| **Many-to-many (M:M)** | One record in A is linked to **many** in B **and** one record in B is linked to **many** in A | Students — Courses; Actors — Films; Products — Orders |
:::

:::tip How to decide the type
Ask the question **in both directions**:
1. "Can one **Publisher** have many **Titles**?" — **Yes**.
2. "Can one **Title** have many **Publishers**?" — **No**.
One "yes" and one "no" → **one-to-many** (the "many" is on the Titles side). Two "yes" → many-to-many. Two "no" → one-to-one.
:::

:::ascii ERD notation — crow's foot and labels
  One-to-one                One-to-many                 Many-to-many
+---------+   +---------+  +---------+   +---------+   +---------+   +---------+
| COUNTRY |---| CAPITAL |  |PUBLISHER|--<|  TITLE  |   | STUDENT |>--<| COURSE  |
+---------+   +---------+  +---------+   +---------+   +---------+   +---------+
     1     1:1     1            1     1:M     M             M    M:M    M
                                    the "crow's foot" < marks the MANY side
:::

:::mermaid One-to-many: one publisher publishes many titles
erDiagram
  PUBLISHERS ||--o{ TITLES : publishes
  PUBLISHERS {
    string pub_ID PK
    string pub_name
    string city
  }
  TITLES {
    string title_ID PK
    string title
    string pub_ID FK
  }
:::

## Practising the degree of a relationship

:::compare Reading relationship sentences
| Sentence | Ask in both directions | Degree |
|---|---|---|
| Each pupil has one locker; each locker belongs to one pupil. | 1 pupil → many lockers? **No**. 1 locker → many pupils? **No** | **1:1** |
| A team has many players; each player plays for one team. | **Yes** / **No** | **1:M** (many = Player) |
| A customer places many orders; each order is placed by one customer. | **Yes** / **No** | **1:M** (many = Order) |
| A pupil studies many subjects; a subject is studied by many pupils. | **Yes** / **Yes** | **M:M** |
| A doctor treats many patients; a patient is treated by many doctors. | **Yes** / **Yes** | **M:M** |
| Each country has one capital; each capital is in one country. | **No** / **No** | **1:1** |
| A class has many pupils; each pupil is in one class. | **Yes** / **No** | **1:M** (many = Pupil) |
| An author writes many books; a book can have many authors. | **Yes** / **Yes** | **M:M** |
:::

:::callout info Cardinality and degree
Both words are used for "how many records on each side": **one-to-one**, **one-to-many**, **many-to-many**. In the exam, always say **which side is "many"**, e.g. "one-to-many: one class has many pupils".
:::

## ERD notation

:::compare Symbols used in ERDs
| Symbol | Meaning |
|---|---|
| Rectangle with a name | An **entity** (later a table) |
| Attributes listed inside or under the box | Its **attributes**; the identifier is underlined or marked **PK** |
| Line between two boxes | A **relationship**, often labelled with a verb (*places*, *teaches*) |
| `1` or a short bar across the line at an end | **One** |
| `M` or a crow's foot `<` at an end | **Many** |
:::

:::tip Where the crow's foot goes
Read the sentence "one **Class** has many **Pupils**": the crow's foot is drawn at the **Pupil** end — the side that has many records for one record on the other side.
:::

# Lesson 1 — exam practice
@lo 11.4.1.7

:::example Exam-style answers
**Q: Identify two entities in a library system and two attributes of one of them. [3]**
Entities: Member, Book (1 each). Attributes of Book: BookID, Title (1).

**Q: State the type of relationship between Team and Player. Justify your answer. [2]**
One-to-many (1): one team has many players, but each player plays for only one team (1).

**Q: Define the term entity. [1]**
A thing (person, object, place or event) about which data is stored.
:::

:::warning Common mistakes in Lesson 1
- Naming a **value** (*11A*, *Abai Zholy*) as an entity.
- Saying "one-to-many" without saying **which** entity is on the "many" side.
- Checking the relationship in **one** direction only.
:::

# Defining relationships with keys
@lo 11.4.1.8

:::compare How each relationship is implemented
| Relationship | How it is created in the database |
|---|---|
| **1:M** | The **primary key** of the "one" table is placed as a **foreign key** in the "many" table. *`pub_ID` (PK of Publishers) is a foreign key in Titles.* |
| **1:1** | The primary key of one table is a foreign key in the other (which must be **unique**), or the two tables are combined into one. |
| **M:M** | **Cannot be created directly.** It is replaced by a **link (junction) table** whose primary key is usually a **composite key** of the two foreign keys, giving **two 1:M** relationships. |
:::

:::example Resolving a many-to-many relationship
*A student takes many courses; a course has many students.*

```text
Students    ( _StudentID_, Name, Grade )
Courses     ( _CourseID_, CourseName, Room )
Enrolments  ( _StudentID*_, _CourseID*_, StartDate )      <- link table, composite key
```
`Students 1 —— M Enrolments M —— 1 Courses`
:::

:::mermaid The link table turns M:M into two 1:M relationships
erDiagram
  STUDENTS ||--o{ ENROLMENTS : has
  COURSES ||--o{ ENROLMENTS : has
  STUDENTS {
    string StudentID PK
    string Name
  }
  ENROLMENTS {
    string StudentID FK
    string CourseID FK
    date StartDate
  }
  COURSES {
    string CourseID PK
    string CourseName
  }
:::

:::cards
### Why M:M must be resolved
- A field can hold **only one value** (atomic), so a student record cannot list all its courses in one field.
- The link table stores **one record per pairing** (student + course) and can hold extra data about the pairing (start date, mark).
### Reading the foreign key
- The table that **contains the foreign key** is on the **"many"** side of a 1:M relationship.
- *`course_tbl` contains `StudentID` → one student has many course records → `student_tbl` 1 — M `course_tbl`.*
:::

:::example Describing a relationship (exam style)
**Q: Describe the type of relationship between tables `student_tbl` and `course_tbl`.**
`student_tbl` (primary key `StudentID`) links to the **foreign key** `StudentID` in `course_tbl` (1); the relationship is **one-to-many** — one student can appear in many course records (1).
:::

## From an ERD to tables

:::steps Turning an ERD into a relational design
- Each **entity** becomes a **table**; its identifier becomes the **primary key**.
- For each **1:M** relationship, copy the primary key of the "one" table into the "many" table as a **foreign key**.
- For each **M:M** relationship, create a **link table** with both primary keys as foreign keys (together usually a **composite primary key**).
- For each **1:1** relationship, put the primary key of one table into the other as a **unique** foreign key — or merge the two tables.
:::

:::example A library
*A member can borrow many books over time and a book is borrowed by many members (M:M). Each loan has a loan date and a return date.*

```text
Members ( _MemberID_, Name, Phone )
Books   ( _BookID_, Title, Author )
Loans   ( _LoanID_, MemberID*, BookID*, LoanDate, ReturnDate )
```
`Members 1 — M Loans M — 1 Books`. Here the link table has its own key `LoanID`, because the same member can borrow the same book again on another date — the pair (MemberID, BookID) is **not** unique.
:::

# Creating an ERD
@lo 11.2.2.2

:::steps How to draw an ERD from a description
- **Find the entities** — the nouns about which data is stored (each becomes a table).
- **List the attributes** of each entity and choose a **primary key**.
- **Find the relationships** — the verbs that link entities (*places*, *teaches*, *borrows*).
- **Decide the degree** of each relationship by asking the question in both directions.
- **Resolve every M:M** relationship with a link table.
- **Draw** the boxes and lines, marking each end **1** or **M** (or a crow's foot); add the **foreign keys** on the "many" side.
:::

:::example Worked example — a product supply system
*Stores order products. Each delivery is made to one store and contains one product; a store receives many deliveries and a product appears in many deliveries.*

```text
Stores     ( _Store_code_, Name, City )
Products   ( _Product_code_, Name, Price )
Deliveries ( _Delivery_ID_, Store_code*, Product_code*, Date, Quantity )
```
Relationships: **Stores 1 — M Deliveries** and **Products 1 — M Deliveries**. (Deliveries is the link that resolves the M:M relationship between stores and products.)
:::

:::mermaid ERD for the product supply system
erDiagram
  STORES ||--o{ DELIVERIES : receives
  PRODUCTS ||--o{ DELIVERIES : "is delivered in"
  STORES {
    string Store_code PK
    string Name
  }
  DELIVERIES {
    string Delivery_ID PK
    string Store_code FK
    string Product_code FK
    int Quantity
  }
  PRODUCTS {
    string Product_code PK
    string Name
  }
:::

:::example Worked example — a school
*A teacher can be the form tutor of one class only, and each class has one form tutor. A class has many pupils; each pupil belongs to one class. Pupils take many clubs; each club has many pupils.*

| Relationship | Degree | Implementation |
|---|---|---|
| Teacher — Class (form tutor) | **1:1** | `TutorID` (unique) in Classes |
| Class — Pupil | **1:M** | `ClassID` foreign key in Pupils |
| Pupil — Club | **M:M** | Link table `Memberships(PupilID, ClubID)` |
:::

:::callout info Drawing ERDs on the platform
In the diagram questions, add an **entity** for each table (name on the first line, attributes below), connect two entities with a line, then **select the line** to set its cardinality: **1:1**, **1:M**, **M:1** or **M:M**.
:::

## Checking your ERD

:::steps Before you hand in an ERD
- Every entity is a **box** with a **singular** name (*Pupil*, not *Pupils data*) and its attributes.
- Every relationship line has **both ends** marked (1 or M).
- **No M:M** relationship is left in the final database design — each has a link table.
- Each "many" table contains the **foreign key** of the "one" table.
- Attributes are **not** drawn as separate entities.
:::

:::example A hospital
*A hospital has wards. Each patient is in one ward; a ward holds many patients. A doctor treats many patients and a patient can be treated by many doctors; for each treatment the date and the medicine are recorded.*

| Relationship | Degree | Implementation |
|---|---|---|
| Ward — Patient | **1:M** | `WardID` foreign key in Patients |
| Doctor — Patient | **M:M** | Link table `Treatments(TreatmentID, DoctorID*, PatientID*, Date, Medicine)` |

`Wards 1 — M Patients 1 — M Treatments M — 1 Doctors`
:::

# Exam practice and summary
@lo 11.4.1.7 11.4.1.8 11.2.2.2

:::example Exam-style answers
**Q: Build the ER diagram for the given Books database (Publishers, Titles). [2]**
Two entities **Publishers** and **Titles** (1) joined by a **one-to-many** relationship, with the "many" at Titles (1).

**Q: Explain the type of connection between the entities. [1]**
One item from the **Publishers** table may have **many** related items in the **Titles** table (one-to-many).

**Q: Draw the E–R diagram for `student_tbl`, `course_tbl` and `courseteacher_tbl`. [2]**
`student_tbl` **1 — M** `course_tbl` (1); `course_tbl` **M — 1** `courseteacher_tbl` (1).
:::

:::warning Common mistakes
- Putting the "many" (crow's foot) at the wrong end — it goes at the table that holds the **foreign key**.
- Leaving a **many-to-many** relationship without a link table in the database design.
- Drawing **attributes as separate entities**.
- Writing "one-to-many" without saying **which** side is "many".
- Forgetting to check the relationship **in both directions**.
:::

:::steps Check yourself
- Define entity, attribute, relationship and ERD.
- Give a real example of a 1:1, a 1:M and an M:M relationship.
- Where is the foreign key placed in a one-to-many relationship?
- How is a many-to-many relationship implemented in a relational database?
- Draw the ERD for: *a customer places many orders; an order contains many products*.
:::
