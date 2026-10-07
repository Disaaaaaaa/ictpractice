---
summary: One-to-one, one-to-many and many-to-many relationships, how keys link tables, and how to draw entity-relationship diagrams.
---
# Types of relationships between tables
@lo 11.4.1.7

:::cards
### One-to-one (1:1)
One record in table A is linked to **at most one** record in table B, and vice versa. *A student has one student ID card; a card belongs to one student.*
### One-to-many (1:M)
One record in A is linked to **many** records in B, but each record in B is linked to **only one** in A. *One class has many students; each student is in one class.* The most common relationship.
### Many-to-many (M:M)
Many records in A are linked to many records in B. *A student takes many courses; a course has many students.*
:::

:::warning
A many-to-many relationship **cannot be implemented directly** in a relational database. It is split into two one-to-many relationships with a **link (junction) table**, e.g. Students — **Enrolments** — Courses.
:::

# Defining relationships with keys
@lo 11.4.1.8

A relationship is created by placing the **primary key of the "one" side** as a **foreign key in the "many" side**.

:::compare Example: Class 1 : M Student
| Table | Fields |
|---|---|
| Class | **ClassID** (PK), ClassName, Room |
| Student | **StudentID** (PK), Name, *ClassID* (FK) |
:::

:::example Resolving M:M
Students(**StudentID**, Name) and Courses(**CourseID**, Title) have a many-to-many relationship.
Create **Enrolments(StudentID, CourseID, Grade)** with the composite primary key (StudentID, CourseID):
- Students 1 : M Enrolments
- Courses 1 : M Enrolments
:::

:::steps Deciding the type of relationship
- Ask: "Can one A have **many** B?"
- Ask the reverse: "Can one B have **many** A?"
- Both "one" → 1:1. One yes, one no → 1:M (the "many" side gets the foreign key). Both yes → M:M → add a link table.
:::

# Drawing entity-relationship diagrams
@lo 11.2.2.2

:::definition Entity-relationship diagram (ERD)
A diagram that shows the **entities** (tables) of a database and the **relationships** between them, including their **cardinality** (1:1, 1:M, M:M).
:::

Entities are drawn as rectangles; relationships as lines. Cardinality is shown with **crow's-foot notation** (a "foot" on the many side) or by writing 1 and M on the line.

:::mermaid ERD for a school database (crow's foot)
erDiagram
  SCHOOL_CLASS ||--o{ STUDENT : contains
  STUDENT ||--o{ ENROLMENT : makes
  COURSE ||--o{ ENROLMENT : "is taken in"
  TEACHER ||--o{ COURSE : teaches
:::

:::ascii The same relationships written with 1 and M
SCHOOL_CLASS 1 ──── M STUDENT
STUDENT 1 ──── M ENROLMENT M ──── 1 COURSE
TEACHER 1 ──── M COURSE
:::

:::steps How to draw an ERD from a scenario
- Underline the **nouns** in the scenario — they are candidate entities (Student, Course, Teacher).
- List the **attributes** of each entity and choose a **primary key**.
- For each pair of related entities, decide the **cardinality**.
- Replace every M:M relationship with a link entity.
- Draw rectangles and lines; mark 1 and M (or crow's feet) at the correct ends.
:::

:::tip
In ERD questions marks are usually given **per correct relationship** (e.g. "student_tbl to course_tbl 1–M (1)"). Label both ends of every line clearly.
:::
