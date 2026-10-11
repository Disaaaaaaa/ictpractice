---
summary: Designing the database for a new system — from the requirements to entities and relationships, drawing the ERD, resolving many-to-many relationships, and producing a complete data dictionary with data types, keys and validation for every table.
---
# Database design in the system life cycle
@lo 11.2.2.2 11.4.1.6

During the **design** stage of a new system, the analyst turns the **requirements specification** into a precise plan for the database. The two main design documents are:

:::cards
### Entity-relationship diagram (ERD)
Shows **which tables (entities)** the database has and **how they are related** (1:1, 1:M, M:M). It is the "map" of the database.
### Data dictionary
Describes **every field of every table**: name, data type, size, key, validation, description and example. It is the "specification" that programmers use to build the tables.
:::

:::mermaid From requirements to a working database
flowchart TB
  R[Requirements specification] --> E[Identify entities and attributes]
  E --> RL[Identify relationships and their degree]
  RL --> ERD[Draw the ERD and resolve M:M relationships]
  ERD --> N[Check the tables are normalised to 3NF]
  N --> DD[Write the data dictionary]
  DD --> SQL[Create the tables in the DBMS]
:::

# Step 1 — Entities and attributes from the requirements
@lo 11.2.2.2

:::example Case study — a music school
*A music school wants a system to manage lessons. Each **student** has an ID, name, date of birth and parent's phone number. Each **teacher** has an ID, name and the instrument they teach. Every week a student has **lessons** with one or more teachers; for each lesson the school records the date, time, room and whether the student attended. Each **room** has a number and a capacity.*

| Entity | Attributes |
|---|---|
| Student | StudentID, FirstName, Surname, DateOfBirth, ParentPhone |
| Teacher | TeacherID, Name, Instrument |
| Room | RoomNo, Capacity |
| Lesson | LessonID, LessonDate, StartTime, Attended (+ links to student, teacher, room) |
:::

:::tip Finding entities
**Nouns** in the requirements that have their **own data** (several attributes) and **many instances** are entities. Single values such as "date" or "instrument" are **attributes**.
:::

# Step 2 — Relationships and the ERD
@lo 11.2.2.2

:::compare Relationships in the music school
| Relationship | Question in both directions | Degree |
|---|---|---|
| Student — Lesson | A student has many lessons? Yes. A lesson is for many students? No (individual lessons) | **1:M** |
| Teacher — Lesson | A teacher gives many lessons? Yes. A lesson has many teachers? No | **1:M** |
| Room — Lesson | A room is used for many lessons? Yes. A lesson uses many rooms? No | **1:M** |
| Student — Teacher | A student has many teachers? Yes. A teacher has many students? Yes | **M:M** — resolved by **Lesson** |
:::

:::mermaid ERD of the music school database
erDiagram
  STUDENT ||--o{ LESSON : attends
  TEACHER ||--o{ LESSON : teaches
  ROOM ||--o{ LESSON : "is used for"
:::

:::steps Rules when drawing the ERD
- One box per **entity**; name in the singular or plural, but consistently.
- Connect related entities with a line; show the **degree** at each end (1 / M or crow's foot).
- The **foreign key** goes in the table on the **"many"** side.
- Replace each **M:M** relationship with a **link entity** (here *Lesson*), giving two **1:M** relationships.
- Check that each table describes **one** entity and has a **primary key** (normalised to 3NF).
:::

# Step 3 — The data dictionary
@lo 11.4.1.6

:::example Data dictionary — Student
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| StudentID | VARCHAR | 5 | PK | Presence; format `S` + 4 digits; unique | Student number | S0107 |
| FirstName | VARCHAR | 30 | | Presence | First name | Dana |
| Surname | VARCHAR | 30 | | Presence | Family name | Seitova |
| DateOfBirth | DATE | — | | Range 2008-01-01 – 2020-12-31 | Date of birth | 2014-05-21 |
| ParentPhone | VARCHAR | 12 | | Length 12; format `+7` + 10 digits | Parent's phone | +77015554433 |
:::

:::example Data dictionary — Lesson
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| LessonID | INT | — | PK | Unique; auto-increment | Lesson number | 2381 |
| StudentID | VARCHAR | 5 | FK → Student | Must exist in Student | Who has the lesson | S0107 |
| TeacherID | VARCHAR | 4 | FK → Teacher | Must exist in Teacher | Who teaches | T012 |
| RoomNo | INT | — | FK → Room | Must exist in Room | Where | 14 |
| LessonDate | DATE | — | | Presence | Date of the lesson | 2026-10-12 |
| StartTime | TIME | — | | Range 08:00 – 20:00 | Start time | 15:30 |
| Attended | BOOLEAN | — | | True / False; default False | Did the student attend? | True |
:::

:::warning Keys must match
A **foreign key** must have **exactly the same data type and size** as the primary key it refers to — `StudentID` is VARCHAR(5) in both Student and Lesson. Otherwise the tables cannot be joined and referential integrity cannot be enforced.
:::

# Step 4 — From the design to SQL
@lo 11.2.2.2 11.4.1.6

```sql | The design implemented as tables
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
    Instrument VARCHAR(30)
);
CREATE TABLE Room (
    RoomNo   INT PRIMARY KEY,
    Capacity INT CHECK (Capacity > 0)
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

:::compare Checking the design
| Check | Question |
|---|---|
| **Requirements** | Can every report and screen the client asked for be produced from these tables? |
| **Normalisation** | Is each fact stored once? No repeating groups, partial or transitive dependencies? |
| **Keys** | Does every table have a primary key? Is every relationship implemented with a foreign key? |
| **Data types and validation** | Is every field's type suitable? Do validation rules prevent invalid data? |
| **Test data** | Can sample records be entered and joined correctly? |
:::

# Exam practice and summary
@lo 11.2.2.2 11.4.1.6

:::example Exam-style answers
**Q: Draw the ERD for the product supply management system (Stores, Products, Deliveries). [3]**
Entities defined (1); **Stores 1 — M Deliveries** (1); **Products 1 — M Deliveries** (1).

**Q: Name two elements that should be described in a data dictionary. [2]**
The **names of the fields** (1); their **data types / formats** (1). *(Also: descriptions, validation, field size, key field.)*

**Q: Complete the data dictionary entry for `LessonDate`. [2]**
Data type **DATE** (1); validation **presence check / not before the school year starts** (1).
:::

:::warning Common mistakes
- Leaving an **M:M** relationship in the ERD without a link entity.
- Choosing data types that do not fit the data (INT for phone numbers, VARCHAR for dates).
- A foreign key with a **different type or size** from its primary key.
- Validation that does not suit the field (a range check on a name).
- Designing tables that are not normalised (repeated customer data in every order).
:::

:::steps Check yourself
- What are the two main documents of database design?
- From a short scenario, list the entities and their attributes.
- Decide the degree of each relationship and draw the ERD.
- Write a data dictionary for one of the tables.
- Turn the design into `CREATE TABLE` statements.
:::
