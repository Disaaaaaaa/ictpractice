---
summary: SQL for relational databases — data types, validation and verification, DDL and DML, creating and changing structures with CREATE, ALTER and DROP, managing data with INSERT, SELECT, UPDATE and DELETE, sorting with ORDER BY, and querying several tables.
---
# SQL and the example database
@lo 11.4.2.1

:::definition SQL (Structured Query Language)
The standard language used to **create, manage and query relational databases**. It is used by DBMSs such as MySQL, PostgreSQL, SQLite and Microsoft SQL Server. SQL is **declarative**: a query describes **what** data is wanted, and the DBMS decides how to find it.
:::

All the examples in this pack use a small database for a publishing company.

```text | The Books database
Publishers ( pub_ID, pub_name, city )
Titles     ( title_ID, title, price, pub_ID, year )
```

:::compare Publishers
| pub_ID | pub_name | city |
|---|---|---|
| 101 | Mektep | Almaty |
| 102 | Foliant | Astana |
| 103 | Atamura | Almaty |
:::

:::compare Titles
| title_ID | title | price | pub_ID | year |
|---|---|---|---|---|
| 1 | Informatika 11 | 1800 | 101 | 2021 |
| 2 | Algebra 11 | 2500 | 102 | 2022 |
| 3 | Physics 11 | 1950 | 101 | 2023 |
| 4 | History of Kazakhstan | 3200 | 103 | 2020 |
| 5 | Chemistry 11 | 2100 | 102 | 2023 |
:::

:::tip SQL style
SQL keywords are not case-sensitive, but they are usually written in **CAPITALS** (`SELECT`, `FROM`, `WHERE`). Text values are written in **quotes** (`'Mektep'`), numbers without quotes. A statement ends with a **semicolon** `;`.
:::

# Data types in SQL
@lo 11.4.1.4

:::compare Common SQL data types (MySQL)
| Data type | Stores | Example field |
|---|---|---|
| `INT` / `INTEGER` | Whole numbers | Quantity, Age, pub_ID |
| `FLOAT`, `DOUBLE` | Real numbers (approximate) | Height, Budget |
| `DECIMAL(p, s)` | Exact decimal numbers — `p` digits, `s` after the point | Price `DECIMAL(8,2)` → 123456.78 |
| `VARCHAR(n)` | Text of **up to n** characters | Name `VARCHAR(50)`, Phone `VARCHAR(12)` |
| `CHAR(n)` | Text of **exactly n** characters | Grade letter `CHAR(1)`, country code `CHAR(2)` |
| `TEXT` | Long text | Description, comments |
| `DATE` | A date `'YYYY-MM-DD'` | DateOfBirth |
| `DATETIME` / `TIME` | Date and time / time | OrderTime |
| `BOOLEAN` | TRUE / FALSE (stored as 1 / 0) | IsPaid |
:::

:::cards
### Column constraints
- `PRIMARY KEY` — unique, not null; identifies each row.
- `NOT NULL` — a value must be entered (**presence check**).
- `UNIQUE` — no two rows can have the same value.
- `DEFAULT value` — used when no value is given.
- `CHECK (condition)` — a validation rule, e.g. `CHECK (price > 0)`.
- `AUTO_INCREMENT` — the DBMS numbers new rows automatically (1, 2, 3 …).
- `FOREIGN KEY … REFERENCES` — links to the primary key of another table.
### Choosing the type
- Calculations → `INT` / `DECIMAL`; money → `DECIMAL` (no rounding errors).
- Codes and phone numbers → `VARCHAR` (leading zeros and `+` are kept).
- Use the **smallest suitable size** (`VARCHAR(30)`, not `VARCHAR(255)` for a name), but large enough for real data.
:::

# Validation and verification
@lo 11.5.4.2

:::definition Validation
An **automatic check by the computer** that the data entered is **sensible, reasonable and follows the rules** (type, range, length, format, presence). It cannot check that the data is **correct**.
:::

:::definition Verification
A check that the data has been **entered or copied accurately** — that it **matches the original source**. Methods: **double entry** (type it twice and compare), **visual check / proofreading** (compare the screen with the original document).
:::

:::compare Validation vs verification
| | Validation | Verification |
|---|---|---|
| Question | Is the data **reasonable / allowed**? | Is the data **the same as the original**? |
| Done by | The **computer**, automatically, using rules | The **user** (visual check) or the computer comparing two entries |
| Examples | Range check (mark 0–100), presence check, type check, length check, format check, lookup check | Double entry of a password or e-mail; proofreading against the paper form |
| Can it catch… a mark of 150? | **Yes** — out of range | Only if the original says something else |
| …a mark of 67 typed as 76? | **No** — 76 is within range | **Yes** — it does not match the original |
:::

```sql | Validation rules built into a table
CREATE TABLE Pupils (
    PupilID  VARCHAR(5)  PRIMARY KEY,
    Name     VARCHAR(40) NOT NULL,                       -- presence check
    Grade    INT         CHECK (Grade IN (11, 12)),      -- lookup check
    Mark     INT         CHECK (Mark BETWEEN 0 AND 100), -- range check
    Email    VARCHAR(50) UNIQUE
);
```

# DDL and DML
@lo 11.4.2.1

:::compare Data Definition Language vs Data Manipulation Language
| | DDL — Data Definition Language | DML — Data Manipulation Language |
|---|---|---|
| Purpose | **Defines / changes the structure** of the database: databases, tables, fields, keys | **Works with the data** inside the tables: add, read, change, delete records |
| Commands | `CREATE`, `ALTER`, `DROP` (also `TRUNCATE`, `RENAME`) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| Example | `CREATE TABLE Titles (…);` | `INSERT INTO Titles VALUES (…);` |
| Affects | The **schema** (table design) | The **records** (rows) |
| Used mainly by | Database designers / administrators | Users and applications |
:::

:::example Exam-style answer — explain the term DML
**DML** stands for **Data Manipulation Language** (1). It is responsible for performing all types of **data modification** in a database — adding, retrieving, changing and deleting records (1). Examples of DML commands: `SELECT`, `UPDATE`, `INSERT`, `DELETE`.
:::

# Creating the structure: CREATE, ALTER, DROP
@lo 11.4.2.2

```sql | CREATE DATABASE and CREATE TABLE
CREATE DATABASE BooksDB;          -- no spaces in names
USE BooksDB;

CREATE TABLE Publishers (
    pub_ID   INT          PRIMARY KEY,
    pub_name VARCHAR(50)  NOT NULL,
    city     VARCHAR(30)
);

CREATE TABLE Titles (
    title_ID INT          AUTO_INCREMENT,
    title    VARCHAR(100) NOT NULL,
    price    DECIMAL(8,2) CHECK (price > 0),
    pub_ID   INT,
    year     INT,
    PRIMARY KEY (title_ID),
    FOREIGN KEY (pub_ID) REFERENCES Publishers(pub_ID)
);
```

:::steps The parts of CREATE TABLE
- `CREATE TABLE TableName (` … `);`
- One line per field: **field name**, **data type** (with size), optional **constraints**; lines separated by **commas**.
- `PRIMARY KEY (field)` — or write `PRIMARY KEY` after the field.
- `FOREIGN KEY (field) REFERENCES OtherTable(field)` to create a relationship.
- A **composite key**: `PRIMARY KEY (StudentID, CourseID)`.
:::

```sql | ALTER TABLE — change the structure of an existing table
ALTER TABLE Titles ADD Budget FLOAT;                  -- add a field
ALTER TABLE Titles ADD Pages INT NOT NULL DEFAULT 0;  -- add a field with a default
ALTER TABLE Titles MODIFY title VARCHAR(150);         -- change the data type / size
ALTER TABLE Titles DROP COLUMN year;                  -- delete a field (and all its data)
ALTER TABLE Titles RENAME COLUMN price TO price_tg;   -- rename a field
```

```sql | DROP — delete a whole table or database
DROP TABLE Titles;          -- the table, its structure and ALL its data are deleted
DROP DATABASE BooksDB;      -- the whole database is deleted
```

:::warning DROP cannot be undone
`DROP TABLE` removes the **structure and all records**; `ALTER TABLE … DROP COLUMN` removes a field and its values in **every** record. There is no "undo" — make a **backup** first.
:::

:::example Describe an SQL statement (exam style)
`ALTER TABLE Movies DROP COLUMN Country;`
**Changes the table** `Movies` (1) by **deleting the field** `Country` — the Country value is removed for every record (1).
:::

# Managing data: INSERT, SELECT, UPDATE, DELETE
@lo 11.4.2.3

```sql | INSERT — add records
INSERT INTO Publishers (pub_ID, pub_name, city)
VALUES (104, 'Kitap', 'Shymkent');

INSERT INTO Titles (title, price, pub_ID, year)      -- title_ID is AUTO_INCREMENT
VALUES ('Biology 11', 2300, 104, 2024),
       ('Geography 11', 1900, 101, 2024);           -- several rows at once
```

```sql | SELECT — retrieve data
SELECT * FROM Titles;                                 -- all fields, all records
SELECT title, price FROM Titles;                      -- chosen fields only
SELECT title, price FROM Titles WHERE price < 2000;  -- only matching records
SELECT DISTINCT city FROM Publishers;                 -- without duplicates
```

:::compare Conditions in WHERE
| Operator | Meaning | Example |
|---|---|---|
| `=` `<>` (or `!=`) | equal / not equal | `WHERE city = 'Almaty'` |
| `<` `>` `<=` `>=` | comparison | `WHERE price >= 2000` |
| `AND`, `OR`, `NOT` | combine conditions | `WHERE price < 2000 AND pub_ID = 101` |
| `BETWEEN a AND b` | in a range (inclusive) | `WHERE year BETWEEN 2021 AND 2023` |
| `IN (…)` | in a list | `WHERE pub_ID IN (101, 103)` |
| `LIKE` | text pattern: `%` = any characters, `_` = one character | `WHERE title LIKE '%11'` (ends with 11) |
| `IS NULL` / `IS NOT NULL` | missing value | `WHERE city IS NULL` |
:::

:::example Results of queries on the Titles table
`SELECT title, price FROM Titles WHERE price < 2000 AND pub_ID = 101;`

| title | price |
|---|---|
| Informatika 11 | 1800 |
| Physics 11 | 1950 |
:::

```sql | UPDATE — change existing records
UPDATE Titles
SET title = 'Computer Science 11'
WHERE title = 'Informatika 11';

UPDATE Titles SET price = price * 1.1;               -- all prices up by 10 %
UPDATE Titles SET price = 2000, year = 2025 WHERE title_ID = 3;   -- two fields
```

```sql | DELETE — remove records
DELETE FROM Titles WHERE year < 2021;                -- only old books
DELETE FROM Titles;                                  -- ALL records (the table stays)
```

:::warning Always check the WHERE clause
`UPDATE` and `DELETE` **without WHERE** change or delete **every record** in the table. Run a `SELECT` with the same `WHERE` first to see which rows will be affected.
:::

:::compare DELETE vs DROP
| `DELETE FROM Titles WHERE …` | `DROP TABLE Titles` |
|---|---|
| **DML** — removes **records** | **DDL** — removes the **whole table** |
| The table structure stays | Structure and data are gone |
| Can remove only some rows | Always removes everything |
:::

# Sorting with ORDER BY and summarising data
@lo 11.4.2.5

```sql | ORDER BY — sort the result
SELECT title, price FROM Titles ORDER BY price;          -- ascending (default, ASC)
SELECT title, price FROM Titles ORDER BY price DESC;     -- descending
SELECT title, year, price FROM Titles
ORDER BY year DESC, title ASC;                           -- by year, then by title
SELECT * FROM Titles WHERE pub_ID = 102 ORDER BY title;  -- WHERE comes before ORDER BY
```

:::compare Order of the clauses in a SELECT statement
| Clause | Purpose | Required? |
|---|---|---|
| `SELECT` fields | Which columns | Yes |
| `FROM` tables | Which table(s) | Yes |
| `WHERE` condition | Which rows | Optional |
| `GROUP BY` field | Groups rows for totals | Optional |
| `ORDER BY` field ASC/DESC | Sort order | Optional — **always last** |
:::

```sql | Aggregate functions
SELECT COUNT(*) FROM Titles;                         -- number of books: 5
SELECT AVG(price) FROM Titles WHERE pub_ID = 101;    -- average price of Mektep's books
SELECT MAX(price), MIN(price) FROM Titles;           -- most and least expensive
SELECT pub_ID, COUNT(*) AS books FROM Titles
GROUP BY pub_ID ORDER BY books DESC;                 -- number of books per publisher
```

# Selecting data from multiple tables
@lo 11.4.2.4 11.4.1.11

To combine data from related tables, the query must state **how the tables are linked** — the **foreign key** in one table must equal the **primary key** in the other.

```sql | Joining two tables (two equivalent ways)
-- 1) INNER JOIN
SELECT Titles.title, Titles.price, Publishers.pub_name
FROM Titles
JOIN Publishers ON Titles.pub_ID = Publishers.pub_ID;

-- 2) WHERE condition
SELECT Titles.title, Titles.price, Publishers.pub_name
FROM Titles, Publishers
WHERE Titles.pub_ID = Publishers.pub_ID;
```

:::example Books published in Almaty, cheapest first
```sql
SELECT Titles.title, Titles.price, Publishers.pub_name
FROM Titles
JOIN Publishers ON Titles.pub_ID = Publishers.pub_ID
WHERE Publishers.city = 'Almaty'
ORDER BY Titles.price ASC;
```
| title | price | pub_name |
|---|---|---|
| Informatika 11 | 1800 | Mektep |
| Physics 11 | 1950 | Mektep |
| History of Kazakhstan | 3200 | Atamura |
:::

:::warning Forgetting the join condition
`SELECT * FROM Titles, Publishers;` **without** `WHERE Titles.pub_ID = Publishers.pub_ID` combines **every** title with **every** publisher (5 × 3 = 15 rows) — a meaningless result.
:::

:::tip Table names before field names
When two tables have a field with the **same name** (here `pub_ID`), write `TableName.fieldName` to avoid ambiguity. Short aliases help: `FROM Titles t JOIN Publishers p ON t.pub_ID = p.pub_ID`.
:::

# Exam practice and summary
@lo 11.4.1.4 11.5.4.2 11.4.2.1 11.4.2.2 11.4.2.3 11.4.2.4 11.4.2.5

:::example Exam-style answers
**Q: Write an SQL statement to change all titles "Informatika 11" to "Computer Science 11". [3]**
`UPDATE Titles` (1) `SET title = 'Computer Science 11'` (1) `WHERE title = 'Informatika 11';` (1)

**Q: Write an SQL statement to select the titles and prices of all books of publisher "Mektep" that cost less than 2000 tenge. [5]**
`SELECT title, price` (1) `FROM Titles` (1) `WHERE price < 2000` (1) `AND` (1) `pub_ID = 101;` (1)

**Q: Fill the gaps to add a Budget column to the Movies table to store the cost of each movie in dollars. [3]**
`ALTER TABLE Movies` (1) `ADD` (1) `Budget FLOAT;` (1)

**Q: Prices of all products went up by 10%. Create an SQL query that will change this data. [2]**
`UPDATE Products` (1) `SET Price_tg = 1.1 * Price_tg;` (1)

**Q: Display all deliveries to Store_code 88, sorted by date. [4]**
`SELECT *` (1) `FROM Deliveries` (1) `WHERE Store_code = 88` (1) `ORDER BY Delivery_date ASC;` (1)

**Q: Explain the difference between validation and verification. [2]**
Validation is an **automatic check that data is reasonable / follows rules** (e.g. range check) (1); verification checks that data **matches the original source** (e.g. double entry, visual check) (1).
:::

:::warning Common mistakes
- Spaces in table or database names (`CREATE DATABASE Cinema Star`).
- Forgetting **quotes** around text values or putting quotes around numbers.
- Missing **commas** between fields in `CREATE TABLE`, or a comma after the last field.
- `UPDATE` / `DELETE` without `WHERE`.
- Writing `ORDER BY` before `WHERE`.
- Using `DELETE` when the question asks to remove a **column** (that is `ALTER TABLE … DROP COLUMN`).
- Joining tables without a **join condition**.
:::

:::steps Check yourself
- Name six SQL data types and a field for each.
- Compare DDL and DML and list their commands.
- Write `CREATE TABLE` for `Students(StudentID, Name, Grade, DateOfBirth)` with a primary key.
- Add a field `Email` to Students; then delete the field `Grade`.
- Insert a new student; change his grade; delete him.
- Select the names of grade 11 students sorted alphabetically.
- Select each title with its publisher's name for books published after 2021.
- Give an example of an error that validation cannot detect but verification can.
:::
