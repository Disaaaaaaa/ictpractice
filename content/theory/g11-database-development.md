---
summary: Building the multi-table database of a new system — from the ERD and data dictionary to SQL tables with data types, primary, foreign and composite keys and constraints; creating tables in the right order, changing them with ALTER, adding test data (normal, boundary, erroneous), checking referential integrity, writing multi-table queries and documenting the result.
---
# From design to database
@lo 11.4.1.11

Developing the database is the step where the **design documents** of a new system become a **working database**. Everything needed is already decided in the design: the **entities** (tables), **attributes** (fields), **data types**, **keys** and **relationships**.

:::steps From design to a working database
- Start from the **ERD** and the **data dictionary** produced in the design stage, normalised to **3NF**.
- Choose a **DBMS** (MySQL, PostgreSQL, SQLite, MS Access) and **create** the database.
- Create the tables **in dependency order**: tables **without** foreign keys first.
- Add **keys and constraints**: `PRIMARY KEY`, `FOREIGN KEY … REFERENCES`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`.
- Insert **test data** covering **normal, boundary and erroneous** cases and record the results.
- Write and test the **queries** the system needs (searches, reports, updates).
- **Document** the structure: SQL script or screenshots of the table design, relationships diagram, test evidence.
:::

:::example The project: a school library system
**Entities:** Book, Reader, Loan. A reader can borrow many books over time, and a book can be borrowed many times → the **many-to-many** relationship is resolved by the **link table** Loan.

```text
  READER ──< LOAN >── BOOK
  (one reader has many loans; one book has many loans)
```
:::

:::compare Data dictionary (extract)
| Table | Field | Data type | Size | Key | Validation |
|---|---|---|---|---|---|
| Reader | ReaderID | INT | — | **PK** | auto-increment |
| Reader | FullName | VARCHAR | 60 | | required |
| Reader | Grade | INT | — | | 7 to 12 |
| Book | ISBN | CHAR | 13 | **PK** | exactly 13 digits |
| Book | Title | VARCHAR | 100 | | required |
| Book | Copies | INT | — | | ≥ 0, default 1 |
| Loan | ReaderID | INT | — | **PK, FK** → Reader | must exist |
| Loan | ISBN | CHAR | 13 | **PK, FK** → Book | must exist |
| Loan | LoanDate | DATE | — | **PK** | required |
| Loan | ReturnDate | DATE | — | | after LoanDate or empty |
:::

# Creating the tables
@lo 11.4.1.11

```sql | library.sql — creating the three tables (parents first)
CREATE TABLE Reader (
  ReaderID  INT AUTO_INCREMENT PRIMARY KEY,
  FullName  VARCHAR(60) NOT NULL,
  Grade     INT CHECK (Grade BETWEEN 7 AND 12),
  Email     VARCHAR(80) UNIQUE
);

CREATE TABLE Book (
  ISBN      CHAR(13) PRIMARY KEY,
  Title     VARCHAR(100) NOT NULL,
  Author    VARCHAR(60),
  Copies    INT DEFAULT 1 CHECK (Copies >= 0)
);

CREATE TABLE Loan (
  ReaderID   INT,
  ISBN       CHAR(13),
  LoanDate   DATE NOT NULL,
  ReturnDate DATE,
  PRIMARY KEY (ReaderID, ISBN, LoanDate),                -- composite key
  FOREIGN KEY (ReaderID) REFERENCES Reader(ReaderID),
  FOREIGN KEY (ISBN)     REFERENCES Book(ISBN),
  CHECK (ReturnDate IS NULL OR ReturnDate >= LoanDate)
);
```

:::callout info Order matters
**Loan** refers to Reader and Book, so Reader and Book must be created **first**. When deleting tables the order is reversed: `DROP TABLE Loan;` **before** `DROP TABLE Reader;` — otherwise the DBMS refuses because Loan still refers to Reader.
:::

:::compare Constraints and what they protect
| Constraint | Protects against | Example |
|---|---|---|
| `PRIMARY KEY` | Duplicate or missing identifiers | Two books with the same ISBN |
| `FOREIGN KEY` | **Orphan records** — a loan for a reader or book that does not exist (**referential integrity**) | Loan of ISBN 9999999999999 |
| `NOT NULL` | Missing required data | A book with no title |
| `UNIQUE` | Repeated values in a non-key field | Two readers with the same e-mail |
| `CHECK` | Impossible values | Grade 15; return before loan |
| `DEFAULT` | Empty fields when a sensible value exists | Copies = 1 |
:::

:::compare Choosing data types
| Data | Type | Why |
|---|---|---|
| Whole numbers (grade, copies) | `INT` | Calculations, comparisons |
| Prices, marks with decimals | `DECIMAL(8,2)` / `FLOAT` | Exact money values with DECIMAL |
| Names, titles | `VARCHAR(n)` | Variable-length text |
| Fixed-length codes (ISBN, postcode) | `CHAR(n)` | Always the same length |
| Phone numbers | `VARCHAR` | Leading 0 / + must be kept; no arithmetic |
| Dates | `DATE` / `DATETIME` | Date calculations and sorting |
| Yes / no | `BOOLEAN` | Only two values |
:::

```sql | Changing the structure later with ALTER TABLE
ALTER TABLE Reader ADD Phone VARCHAR(15);              -- add a field
ALTER TABLE Book MODIFY Title VARCHAR(150) NOT NULL;   -- change a field
ALTER TABLE Reader DROP COLUMN Email;                  -- remove a field
CREATE INDEX idx_title ON Book(Title);                 -- faster searching by title
```

# Test data
@lo 11.4.1.11

```sql | Inserting normal test data
INSERT INTO Reader (FullName, Grade, Email) VALUES ('Asel Nurlanova', 11, 'asel@nis.kz');
INSERT INTO Reader (FullName, Grade, Email) VALUES ('Timur Bekov', 12, 'timur@nis.kz');
INSERT INTO Book VALUES ('9786010000011', 'Abai — Book of Words', 'Abai Kunanbayev', 3);
INSERT INTO Book VALUES ('9780261102217', 'The Hobbit', 'J. R. R. Tolkien', 2);
INSERT INTO Loan VALUES (1, '9786010000011', '2026-10-01', NULL);
INSERT INTO Loan VALUES (2, '9780261102217', '2026-10-02', '2026-10-09');
```

:::compare Test plan for the constraints
| Test | Type of data | Data | Expected result |
|---|---|---|---|
| 1 | Normal | Reader grade **11** | Accepted |
| 2 | Boundary | Reader grade **7** and **12** | Accepted |
| 3 | Erroneous (just outside) | Reader grade **13** | **Rejected** by CHECK |
| 4 | Erroneous | Book with no title | **Rejected** by NOT NULL |
| 5 | Erroneous | Second book with ISBN 9786010000011 | **Rejected** by PRIMARY KEY |
| 6 | Erroneous | Loan for ReaderID **99** (does not exist) | **Rejected** by FOREIGN KEY |
| 7 | Erroneous | ReturnDate **before** LoanDate | **Rejected** by CHECK |
:::

```sql | Erroneous tests — each must be rejected
INSERT INTO Reader (FullName, Grade) VALUES ('Test Pupil', 13);          -- CHECK fails
INSERT INTO Book (ISBN, Copies) VALUES ('9780000000001', 1);             -- NOT NULL fails
INSERT INTO Loan VALUES (99, '9780261102217', '2026-10-05', NULL);       -- FOREIGN KEY fails
DELETE FROM Reader WHERE ReaderID = 1;   -- fails while Asel still has a loan
```

:::definition Referential integrity
Every **foreign key** value must match an **existing primary key** value in the related table. The DBMS enforces it by **rejecting** inserts of orphan records and **preventing** the deletion of a parent record that still has related child records (or deleting / updating them too with `ON DELETE CASCADE`).
:::

# Queries for the system
@lo 11.4.1.11

```sql | Queries the library needs
-- 1 Books currently on loan, with the reader's name
SELECT r.FullName, b.Title, l.LoanDate
FROM Loan l
JOIN Reader r ON r.ReaderID = l.ReaderID
JOIN Book   b ON b.ISBN = l.ISBN
WHERE l.ReturnDate IS NULL
ORDER BY l.LoanDate;

-- 2 How many times each book has been borrowed
SELECT b.Title, COUNT(*) AS TimesBorrowed
FROM Loan l JOIN Book b ON b.ISBN = l.ISBN
GROUP BY b.Title;

-- 3 Record a returned book
UPDATE Loan SET ReturnDate = '2026-10-15'
WHERE ReaderID = 1 AND ISBN = '9786010000011' AND LoanDate = '2026-10-01';
```

:::example Expected result of query 1 for the test data
| FullName | Title | LoanDate |
|---|---|---|
| Asel Nurlanova | Abai — Book of Words | 2026-10-01 |

Timur's loan is not shown because it has a ReturnDate.
:::

:::tip Evidence for the project
Show: the **CREATE TABLE** code (or table design screenshots) with keys, the **relationships** diagram from the DBMS, the **test plan** with **screenshots** of accepted and rejected data, and the **results** of the main queries.
:::

# Exam practice and summary
@lo 11.4.1.11

:::example Exam-style answers
**Q: Write the SQL to create the table Book with ISBN as primary key, Title required and Copies at least 0. [3]**
`CREATE TABLE Book (ISBN CHAR(13) PRIMARY KEY,` (1) `Title VARCHAR(100) NOT NULL,` (1) `Copies INT CHECK (Copies >= 0));` (1).

**Q: Explain why the table Loan must be created after Reader and Book. [2]**
Loan contains **foreign keys** that **reference** Reader and Book (1); the referenced tables / primary keys must **already exist** (1).

**Q: Explain how a foreign key keeps the data consistent. [2]**
A loan can only be added if the ReaderID / ISBN **exists** in the parent table (1), so there are **no orphan records** — referential integrity (1).

**Q: Give one item of erroneous test data for Grade and the expected result. [2]**
Grade **13** (or "eleven") (1) — **rejected** by the CHECK constraint / error message (1).
:::

:::warning Common mistakes
- Creating a table with a **foreign key before** the table it refers to.
- Storing **phone numbers** as INT (loses the leading + / 0).
- Forgetting the **composite primary key** in a link table.
- Testing only normal data — always include **boundary** and **erroneous** data.
:::

:::steps Check yourself
- List the stages of developing the project database.
- Write CREATE TABLE statements for Reader, Book and Loan with all keys.
- In which order must the tables be dropped? Why?
- Write three erroneous inserts and say which constraint rejects each.
- What is referential integrity?
- Write a query listing the overdue books with the reader's name.
:::
