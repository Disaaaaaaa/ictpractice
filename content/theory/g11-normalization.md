---
summary: Why databases are normalised, the rules for first, second and third normal form, how to normalise a table step by step to 3NF, and how to create a database with multiple related tables.
---
# Why normalise a database?
@lo 11.4.1.9

:::definition Normalisation
The process of **organising the data in a relational database into well-structured tables** — by following a set of rules called **normal forms** — so that each fact is stored **once**, data **redundancy** is reduced and **anomalies** (problems when inserting, updating or deleting data) are avoided.
:::

:::compare Anomalies in an unnormalised table
| Anomaly | Problem | Example (one big *Orders* table with customer details in every row) |
|---|---|---|
| **Update anomaly** | The same data is stored many times; changing it in one row but not others makes the data **inconsistent** | A customer's address must be changed in every order row |
| **Insertion anomaly** | Some data cannot be added without other unrelated data | A new customer cannot be stored until they place an order |
| **Deletion anomaly** | Deleting one record also deletes other important data | Deleting a customer's only order deletes the customer too |
:::

:::cards
### Benefits of normalisation
- **Less redundancy** — less repeated data, less storage.
- **Data consistency / integrity** — each fact is changed in one place.
- **No anomalies** when inserting, updating or deleting.
- Clearer structure; easier to **maintain** and extend.
### Possible drawback
- More tables means queries need **joins**, which can make some queries slower or more complex. (Very large systems sometimes **denormalise** a little for speed.)
:::

# The rules of the normal forms
@lo 11.4.1.9

:::compare First, second and third normal form
| Normal form | Rule | In other words |
|---|---|---|
| **1NF** | Every field contains **atomic (single) values**; there are **no repeating groups**; each record is **unique** (has a primary key) | One value per cell; no lists; no columns like `Phone1, Phone2, Phone3` |
| **2NF** | In **1NF**, and every non-key field depends on the **whole** primary key — **no partial dependencies** | Only matters when the primary key is **composite**: a field must not depend on just part of the key |
| **3NF** | In **2NF**, and **no non-key field depends on another non-key field** — **no transitive dependencies** | "Every non-key field depends on **the key, the whole key and nothing but the key**" |
:::

:::definition Functional dependency
Field B **depends on** field A (A → B) if each value of A determines exactly one value of B. Example: `StudentID → StudentName` (knowing the ID tells you the name).
:::

:::compare Types of dependency
| Dependency | Meaning | Example |
|---|---|---|
| **Full** | A non-key field depends on the **whole** (composite) key | `(StudentID, SubjectID) → Mark` |
| **Partial** (breaks 2NF) | A non-key field depends on **part** of a composite key | `(StudentID, SubjectID) → StudentName`, but `StudentName` depends only on `StudentID` |
| **Transitive** (breaks 3NF) | A non-key field depends on **another non-key field** | `StudentID → ClassID → ClassTeacher` |
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

:::steps Converting to 1NF
- Make every field **atomic**: one value per cell (split multi-value fields; split `FullName` into `FirstName` and `Surname` if needed).
- Remove **repeating groups** (columns such as `Country1, Country2…`).
- Ensure each record is unique with a **primary key**.
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
If a field mixes two kinds of information, such as `Country = "Kazakhstan, Almaty"`, split it into **two atomic fields** `Country` and `City`.
:::

# Second normal form (2NF)
@lo 11.4.1.10

:::steps Converting from 1NF to 2NF
- Identify the **primary key**. If it is a **single field**, a table in 1NF is **already in 2NF**.
- If the key is **composite**, check each non-key field: does it depend on the **whole** key or only **part** of it?
- Move every field that depends on **only part** of the key into a **new table**, with that part of the key as its primary key.
- Keep the part of the key in the original table as a **foreign key**.
:::

:::example 2NF — splitting the films table
```text
Movies         ( _MovieID_, Title, Year )
MovieCountries ( _MovieID*_, _Country_ )
```
`Title` and `Year` now depend on the whole key of `Movies`. `MovieCountries` has only key fields. Both tables are in **2NF**.
:::

# Third normal form (3NF)
@lo 11.4.1.10

:::steps Converting from 2NF to 3NF
- Look for a **non-key field that depends on another non-key field** (a transitive dependency).
- Move those fields into a **new table**; the field they depend on becomes the **primary key** of the new table.
- Leave that field in the original table as a **foreign key**.
:::

:::example A table in 2NF but not 3NF
| CourseName | TeacherName | TeacherDateOfBirth |
|---|---|---|
| Java | Karimov Arman | 12/03/1985 |
| Python | Karimov Arman | 12/03/1985 |
| Web design | Sadykova Aigerim | 04/11/1990 |

Primary key: `CourseName`. `TeacherDateOfBirth` depends on **TeacherName**, not on the course → **transitive dependency** (`CourseName → TeacherName → TeacherDateOfBirth`). Karimov's date of birth is stored twice.
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

# A full normalisation example
@lo 11.4.1.10 11.4.1.11

:::example Unnormalised data — a school's club register
| PupilID | PupilName | Class | ClassTeacher | Clubs |
|---|---|---|---|---|
| P1 | Dana | 11A | Mr Omarov | Chess, Robotics |
| P2 | Timur | 11B | Ms Ivanova | Chess |
| P3 | Aru | 11A | Mr Omarov | Robotics, Debate |
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

:::mermaid ERD of the normalised design
erDiagram
  CLASSES ||--o{ PUPILS : contains
  PUPILS ||--o{ MEMBERSHIPS : joins
  CLUBS ||--o{ MEMBERSHIPS : has
:::

# Creating a database with multiple tables
@lo 11.4.1.11

:::steps From the normalised design to a working database
- Create a table for each entity in the 3NF design, with the correct **data types** (from the data dictionary).
- Set each table's **primary key** (composite where needed).
- Create the **foreign keys** and the **relationships** between tables, with **referential integrity**.
- Enter test data — first in the "one" tables, then in the "many" tables.
- Test with **queries** that join the tables.
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

-- Which club does each pupil of Mr Omarov's class attend?
SELECT Pupils.PupilName, Clubs.ClubName
FROM Pupils
JOIN Classes     ON Pupils.Class = Classes.Class
JOIN Memberships ON Pupils.PupilID = Memberships.PupilID
JOIN Clubs       ON Memberships.ClubID = Clubs.ClubID
WHERE Classes.ClassTeacher = 'Mr Omarov';
```

# Exam practice and summary
@lo 11.4.1.9 11.4.1.10 11.4.1.11

:::example Exam-style answers
**Q: Explain why the Movie table is not in first normal form. [1]**
The data in the column **Country** is **not atomic** — the Country field has **multiple values**. *(Name the field.)*

**Q: Bring the Movie table to the first normal form. [1]**
Split the field into atomic values, e.g. add a **City** column: `Movies (MovieID, Title, Year, Genre, Duration, Country, City)`.

**Q: Bring the table (CourseName, TeacherName, DateOfBirth) to third normal form. [3]**
Define a **Course** table with a primary key (1); define a **Teacher** table with a primary key (1); define the **relationship** with a **foreign key** (`TeacherID` in Course) (1).

**Q: List the rule for second normal form. [1]**
The table is in 1NF and every non-key field depends on the **whole** primary key (**no partial dependencies**).
:::

:::warning Common mistakes
- Saying a table is "not in 1NF" without naming the **field** and the problem.
- Thinking 2NF matters for single-field keys — a 1NF table with a **single-field key** is automatically in 2NF.
- Forgetting to leave a **foreign key** behind when moving fields to a new table — the tables can no longer be linked.
- Splitting tables so much that data is **lost** — every original fact must still be stored.
- Confusing a **partial** dependency (2NF) with a **transitive** one (3NF).
:::

:::steps Check yourself
- What is normalisation and why is it used?
- Describe update, insertion and deletion anomalies.
- State the rules for 1NF, 2NF and 3NF.
- What is a partial dependency? A transitive dependency?
- Normalise `Orders(OrderID, CustomerName, CustomerPhone, ProductName, Price, Quantity)` to 3NF.
- Write SQL to create two related tables with a foreign key.
:::
