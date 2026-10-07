---
summary: SQL data types, validation vs verification, DDL and DML, creating and changing tables, querying one and several tables, and sorting results.
---
# SQL data types
@lo 11.4.1.4

:::compare
| Type | Stores | Example |
|---|---|---|
| `INT` / `INTEGER` | Whole numbers | `Grade INT` |
| `DECIMAL(p,s)` / `REAL` / `FLOAT` | Numbers with a fractional part | `Price DECIMAL(8,2)` → 12345.67 |
| `CHAR(n)` | Fixed-length text (always n characters) | `Gender CHAR(1)` |
| `VARCHAR(n)` | Variable-length text up to n characters | `Name VARCHAR(40)` |
| `TEXT` | Long text | `Comment TEXT` |
| `DATE` / `TIME` / `DATETIME` | Dates and times | `DateOfBirth DATE` |
| `BOOLEAN` | TRUE / FALSE | `Paid BOOLEAN` |
:::

# Validation and verification
@lo 11.5.4.2

:::compare
| | Validation | Verification |
|---|---|---|
| Question it answers | Is the data **reasonable / allowed**? | Was the data **entered or copied correctly**? |
| Done by | The computer, automatically, using rules | Usually a person, or a comparison |
| Methods | Presence, range, length, type, format, lookup checks | **Double entry** (type twice, compare), **visual check** (proof-reading against the source) |
| Example | Age must be between 14 and 18 | Enter the password twice; both must match |
:::

:::warning
Validation cannot tell whether data is **correct** — "15" passes a 14–18 range check even if the student is really 16. Verification checks that it matches the original.
:::

# DDL and DML
@lo 11.4.2.1

:::compare
| | DDL — Data Definition Language | DML — Data Manipulation Language |
|---|---|---|
| Works with | The **structure** of the database (tables, fields, keys) | The **data** stored in the tables |
| Commands | `CREATE`, `ALTER`, `DROP` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| Example | Add a field to a table | Change a student's grade |
:::

# Creating and changing the structure: CREATE, ALTER, DROP
@lo 11.4.2.2

```sql | CREATE TABLE with keys
CREATE TABLE Class (
  ClassID   VARCHAR(4) PRIMARY KEY,
  Room      INT
);

CREATE TABLE Student (
  StudentID  VARCHAR(6) PRIMARY KEY,
  FirstName  VARCHAR(30) NOT NULL,
  SecondName VARCHAR(30) NOT NULL,
  Grade      INT CHECK (Grade BETWEEN 7 AND 12),
  ClassID    VARCHAR(4),
  FOREIGN KEY (ClassID) REFERENCES Class(ClassID)
);
```

```sql | ALTER and DROP
ALTER TABLE Student ADD Gender VARCHAR(6);      -- add a field
ALTER TABLE Student MODIFY FirstName VARCHAR(50); -- change a field (MySQL)
ALTER TABLE Student DROP COLUMN Gender;           -- remove a field
DROP TABLE Student;                               -- delete the whole table and its data
```

:::warning
`DROP TABLE` deletes the table **and all its data**; `DELETE FROM` deletes rows but keeps the table.
:::

# Managing data in one table: SELECT, INSERT, UPDATE, DELETE
@lo 11.4.2.3

```sql | Data manipulation
INSERT INTO Student (StudentID, FirstName, SecondName, Grade, ClassID)
VALUES ('S004', 'Aiman', 'Armanova', 11, '11A');

SELECT * FROM Student WHERE Grade = 10;

SELECT FirstName, SecondName FROM Student
WHERE Grade >= 11 AND ClassID = '11A';

UPDATE Student SET SecondName = 'Armankyzy' WHERE StudentID = 'S004';

DELETE FROM Student WHERE StudentID = 'S004';
```

:::compare Conditions in WHERE
| Operator | Example |
|---|---|
| `=`, `<>`, `<`, `>`, `<=`, `>=` | `Grade <> 12` |
| `AND`, `OR`, `NOT` | `Grade = 11 AND ClassID = '11B'` |
| `BETWEEN … AND …` | `Price BETWEEN 100 AND 500` |
| `LIKE` with `%` (any characters) and `_` (one character) | `Name LIKE 'A%'` → names starting with A |
| `IN (…)` | `ClassID IN ('11A', '11B')` |
| `IS NULL` | `Email IS NULL` |
:::

:::warning
Always use `WHERE` with `UPDATE` and `DELETE` — without it **every row** is changed or deleted.
:::

# Querying several tables
@lo 11.4.2.4

```sql | Join with a WHERE condition
SELECT Student.FirstName, Student.SecondName, Class.Room
FROM Student, Class
WHERE Student.ClassID = Class.ClassID
  AND Class.ClassID = '11A';
```

```sql | The same with INNER JOIN, plus a link table
SELECT s.FirstName, c.CourseName, e.Mark
FROM Student s
INNER JOIN Enrolment e ON s.StudentID = e.StudentID
INNER JOIN Course c   ON c.CourseID = e.CourseID
WHERE e.Mark >= 5;
```

:::tip
In multi-table queries, write **Table.Field** for fields that exist in more than one table, and always include the **join condition** (PK = FK) — it is usually worth a mark on its own.
:::

# Sorting results with ORDER BY
@lo 11.4.2.5

```sql | ORDER BY
SELECT FirstName, SecondName, Grade
FROM Student
ORDER BY Grade DESC, SecondName ASC;
```

- `ASC` — ascending (A→Z, 0→9), the default.
- `DESC` — descending.
- Several fields: sort by the first, then by the second within equal values.

:::compare Aggregate functions (often used with ORDER BY)
| Function | Example | Result |
|---|---|---|
| `COUNT(*)` | `SELECT COUNT(*) FROM Student WHERE Grade = 11;` | Number of rows |
| `SUM`, `AVG` | `SELECT AVG(Mark) FROM Enrolment;` | Total / average |
| `MIN`, `MAX` | `SELECT MAX(Price) FROM Product;` | Smallest / largest |
| `GROUP BY` | `SELECT ClassID, COUNT(*) FROM Student GROUP BY ClassID;` | One result per group |
:::

# Building a multi-table database with SQL
@lo 11.4.1.11

:::steps
- Create the "one"-side tables first (e.g. **Class**), then the tables with foreign keys (**Student**), then link tables (**Enrolment**).
- Use `PRIMARY KEY`, `FOREIGN KEY … REFERENCES`, `NOT NULL` and `CHECK` to enforce integrity.
- Insert test data with `INSERT INTO`.
- Test joins and conditions with `SELECT`.
:::
