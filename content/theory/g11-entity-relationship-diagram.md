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
