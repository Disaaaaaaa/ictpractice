---
summary: SQL for relational databases — data types, DDL and DML, creating and changing structures with CREATE, ALTER and DROP, managing data with INSERT, SELECT, UPDATE and DELETE, validation and verification, sorting with ORDER BY, querying several tables and building a database with multiple tables.
---
# What SQL is: DDL and DML
@lo 11.4.2.1

:::definition SQL (Structured Query Language)
The standard language used to **create, manage and query relational databases**. It is used by DBMSs such as MySQL, PostgreSQL, SQLite and Microsoft SQL Server. SQL is **declarative**: a statement describes **what** is wanted, and the DBMS decides how to do it.
:::

:::definition DDL — Data Definition Language
The part of SQL that **defines and changes the structure (schema)** of a database: databases, tables, fields, data types, keys and constraints. Commands: `CREATE`, `ALTER`, `DROP`.
:::

:::definition DML — Data Manipulation Language
The part of SQL that **works with the data stored in the tables**: adding, retrieving, changing and deleting records. Commands: `INSERT`, `SELECT`, `UPDATE`, `DELETE`.
:::

All the examples in this pack use a small database for a publishing company in Kazakhstan.

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

:::svg DDL works on the structure of a table, DML works on the records inside it
<svg class="sq1" xml:space="preserve" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The header row of the Titles table is the structure changed by DDL commands; the rows below are the records changed by DML commands">
  <style>
    svg.sq1 text{white-space:pre}
    svg.sq1 .hd{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq1 .rw{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.sq1 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq1 .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq1 .p{font:700 15px system-ui,sans-serif;fill:var(--primary)}
    svg.sq1 .g{font:700 15px system-ui,sans-serif;fill:var(--success)}
    svg.sq1 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.sq1 .k{font:600 13px ui-monospace,monospace}
  </style>
  <text class="h" x="200" y="24">Table Titles</text>
  <rect class="hd" x="200" y="36" width="360" height="34" rx="4"/>
  <text class="c" x="212" y="58">title_ID  title           price  pub_ID</text>
  <rect class="rw" x="200" y="80" width="360" height="30" rx="3"/>
  <text class="c" x="212" y="100">1         Informatika 11  1800   101</text>
  <rect class="rw" x="200" y="114" width="360" height="30" rx="3"/>
  <text class="c" x="212" y="134">2         Algebra 11      2500   102</text>
  <rect class="rw" x="200" y="148" width="360" height="30" rx="3"/>
  <text class="c" x="212" y="168">3         Physics 11      1950   101</text>
  <text class="p" x="20" y="50">DDL</text>
  <text class="s" x="20" y="68">structure: fields,</text>
  <text class="s" x="20" y="84">types, keys</text>
  <path d="M110,52 H190" style="stroke:var(--primary);stroke-width:2"/><path d="M190,46 l10,6 l-10,6 z" style="fill:var(--primary)"/>
  <text class="g" x="20" y="134">DML</text>
  <text class="s" x="20" y="152">data: the records</text>
  <path d="M110,130 H190" style="stroke:var(--success);stroke-width:2"/><path d="M190,124 l10,6 l-10,6 z" style="fill:var(--success)"/>
  <text class="k" x="580" y="46" style="fill:var(--primary)">CREATE TABLE</text>
  <text class="k" x="580" y="64" style="fill:var(--primary)">ALTER TABLE</text>
  <text class="k" x="580" y="82" style="fill:var(--primary)">DROP TABLE</text>
  <text class="k" x="580" y="114" style="fill:var(--success)">INSERT INTO</text>
  <text class="k" x="580" y="132" style="fill:var(--success)">SELECT … FROM</text>
  <text class="k" x="580" y="150" style="fill:var(--success)">UPDATE … SET</text>
  <text class="k" x="580" y="168" style="fill:var(--success)">DELETE FROM</text>
  <rect x="200" y="200" width="360" height="74" rx="8" style="fill:var(--surface-2);stroke:var(--border)"/>
  <text class="s" x="216" y="224">ALTER TABLE Titles ADD Pages INT;  → a new column</text>
  <text class="s" x="216" y="244">INSERT INTO Titles VALUES (…);    → a new row</text>
  <text class="s" x="216" y="264">DDL changes the shape · DML changes the contents</text>
</svg>
:::

:::compare Data Definition Language vs Data Manipulation Language
| | DDL — Data Definition Language | DML — Data Manipulation Language |
|---|---|---|
| Purpose | **Defines / changes the structure** of the database: databases, tables, fields, keys | **Works with the data** inside the tables: add, read, change, delete records |
| Commands | `CREATE`, `ALTER`, `DROP` (also `TRUNCATE`, `RENAME`) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| Example | `CREATE TABLE Titles (…);` | `INSERT INTO Titles VALUES (…);` |
| Affects | The **schema** (table design) | The **records** (rows) |
| Used mainly by | Database designers / administrators | Users, programmers and applications |
| When used | Mostly once, when the database is built or changed | Every day, while the system is in use |
:::

:::tip SQL style
SQL keywords are not case-sensitive, but they are usually written in **CAPITALS** (`SELECT`, `FROM`, `WHERE`). **Text and dates** are written in **single quotes** (`'Mektep'`, `'2026-11-05'`), **numbers without quotes**. A statement ends with a **semicolon** `;`. Names of tables and fields contain **no spaces**.
:::

# Data types in SQL
@lo 11.4.1.4

:::definition Data type
The **kind of data a field can store** (whole numbers, decimals, text, dates, true/false). It decides which values are accepted, how much storage is used and which operations (e.g. arithmetic, sorting by date) can be done.
:::

:::compare Common SQL data types (MySQL)
| Data type | Stores | Example field | Example value |
|---|---|---|---|
| `INT` / `INTEGER` | Whole numbers | Quantity, Age, pub_ID | `12` |
| `FLOAT`, `DOUBLE` | Real numbers (approximate) | Height, Budget | `1.75` |
| `DECIMAL(p, s)` | Exact decimal numbers — `p` digits in total, `s` after the point | Price `DECIMAL(8,2)` | `123456.78` |
| `VARCHAR(n)` | Text of **up to n** characters | Name `VARCHAR(50)`, Phone `VARCHAR(16)` | `'Bekova'` |
| `CHAR(n)` | Text of **exactly n** characters | Grade letter `CHAR(1)`, class code `CHAR(3)` | `'11A'` |
| `TEXT` | Long text | Description, comments | a paragraph |
| `DATE` | A date `'YYYY-MM-DD'` | DateOfBirth | `'2009-03-14'` |
| `DATETIME` / `TIME` | Date and time / time of day | OrderTime | `'2026-11-05 14:30:00'` |
| `BOOLEAN` | TRUE / FALSE (stored as 1 / 0) | IsPaid | `TRUE` |
:::

:::svg VARCHAR(10) keeps only the characters typed; CHAR(10) always uses 10 places
<svg class="sq2" xml:space="preserve" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The value Aru stored in VARCHAR(10) uses 3 characters; in CHAR(10) it is padded with spaces to 10 characters">
  <style>
    svg.sq2 text{white-space:pre}
    svg.sq2 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.sq2 .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.sq2 .pd{fill:var(--warning);opacity:.25}
    svg.sq2 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq2 .c{font:14px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq2 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="20" y="40">VARCHAR(10)</text>
  <rect class="on" x="160" y="20" width="40" height="34"/><text class="c" x="174" y="43">A</text>
  <rect class="on" x="200" y="20" width="40" height="34"/><text class="c" x="214" y="43">r</text>
  <rect class="on" x="240" y="20" width="40" height="34"/><text class="c" x="254" y="43">u</text>
  <text class="s" x="300" y="34">3 characters stored (+ a small length marker)</text>
  <text class="s" x="300" y="50">up to 10 allowed — size varies with the value</text>
  <text class="h" x="20" y="120">CHAR(10)</text>
  <rect class="on" x="160" y="100" width="40" height="34"/><text class="c" x="174" y="123">A</text>
  <rect class="on" x="200" y="100" width="40" height="34"/><text class="c" x="214" y="123">r</text>
  <rect class="on" x="240" y="100" width="40" height="34"/><text class="c" x="254" y="123">u</text>
  <rect class="pd" x="280" y="100" width="280" height="34"/>
  <rect class="bx" x="280" y="100" width="40" height="34" style="fill:none"/><rect class="bx" x="320" y="100" width="40" height="34" style="fill:none"/><rect class="bx" x="360" y="100" width="40" height="34" style="fill:none"/><rect class="bx" x="400" y="100" width="40" height="34" style="fill:none"/><rect class="bx" x="440" y="100" width="40" height="34" style="fill:none"/><rect class="bx" x="480" y="100" width="40" height="34" style="fill:none"/><rect class="bx" x="520" y="100" width="40" height="34" style="fill:none"/>
  <text class="s" x="580" y="114">padded with spaces</text>
  <text class="s" x="580" y="130">always 10 characters</text>
  <text class="s" x="20" y="176">Use CHAR(n) when every value has the same length (country code KZ, class 11A); VARCHAR(n) for names, e-mails, addresses.</text>
</svg>
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
- Dates → `DATE`, not `VARCHAR`, so they can be sorted and compared correctly.
- Yes / no answers → `BOOLEAN`.
- Use the **smallest suitable size** (`VARCHAR(30)`, not `VARCHAR(255)` for a name), but large enough for real data.
:::

:::example Choosing data types for a clinic's Patients table
A clinic in Karaganda stores `Patients ( PatientID, FullName, IIN, Phone, DateOfBirth, Height, IsInsured )`.
- `PatientID` — `INT AUTO_INCREMENT` — a number given by the DBMS, used as the primary key.
- `FullName` — `VARCHAR(60)` — names have different lengths.
- `IIN` — `CHAR(12)` — the Kazakh ID number is **always 12 digits** and can start with 0; nobody calculates with it.
- `Phone` — `VARCHAR(16)` — `+7 701 234 56 78` contains `+` and spaces.
- `DateOfBirth` — `DATE` — so patients can be sorted by age and ages calculated.
- `Height` — `DECIMAL(4,1)` — e.g. `172.5` cm.
- `IsInsured` — `BOOLEAN` — only TRUE or FALSE.
:::

:::warning Common mistakes with data types
- Storing a **phone number, IIN or postcode as INT** — the leading `0` and `+` are lost, and the number may be too big for `INT`.
- Storing **dates as VARCHAR** — `'05/11/2026'` and `'12/01/2026'` then sort as text, not by date.
- Using `FLOAT` for **money** — use `DECIMAL(p,s)`, which is exact.
- Writing `VARCHAR` **without a size** in MySQL — `VARCHAR(50)` needs the number.
:::

# Creating the structure: CREATE, ALTER, DROP
@lo 11.4.2.2 11.4.1.11

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

:::svg The parts of a CREATE TABLE statement
<svg class="sq3" xml:space="preserve" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CREATE TABLE statement with labels: table name, field name, data type with size, constraint, primary key, foreign key and closing bracket with semicolon">
  <style>
    svg.sq3 text{white-space:pre}
    svg.sq3 .cd{font:15px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq3 .kw{font:700 15px ui-monospace,monospace;fill:var(--primary)}
    svg.sq3 .lb{font:600 12px system-ui,sans-serif}
    svg.sq3 .bg{fill:var(--surface-2);stroke:var(--border)}
  </style>
  <rect class="bg" x="20" y="14" width="440" height="244" rx="10"/>
  <text class="cd" x="36" y="44"><tspan class="kw">CREATE TABLE</tspan> Loans (</text>
  <text class="cd" x="56" y="74">LoanID    <tspan class="kw">INT</tspan> AUTO_INCREMENT,</text>
  <text class="cd" x="56" y="104">StudentID <tspan class="kw">VARCHAR(5)</tspan> NOT NULL,</text>
  <text class="cd" x="56" y="134">LoanDate  <tspan class="kw">DATE</tspan>,</text>
  <text class="cd" x="56" y="164">Returned  <tspan class="kw">BOOLEAN</tspan> DEFAULT FALSE,</text>
  <text class="cd" x="56" y="194">PRIMARY KEY (LoanID),</text>
  <text class="cd" x="56" y="224">FOREIGN KEY (StudentID) REFERENCES …</text>
  <text class="cd" x="36" y="250">);</text>
  <path d="M190,38 H480" style="stroke:var(--primary);stroke-dasharray:4 4"/><text class="lb" x="486" y="42" style="fill:var(--primary)">table name (no spaces), then "("</text>
  <path d="M100,80 C120,90 300,90 480,78" style="stroke:var(--muted);fill:none;stroke-dasharray:4 4"/><text class="lb" x="486" y="82" style="fill:var(--muted)">field name · data type · constraint</text>
  <path d="M340,104 H480" style="stroke:var(--warning);stroke-dasharray:4 4"/><text class="lb" x="486" y="108" style="fill:var(--warning)">NOT NULL = presence check</text>
  <path d="M300,164 H480" style="stroke:var(--muted);stroke-dasharray:4 4"/><text class="lb" x="486" y="152" style="fill:var(--muted)">each field line ends with a comma</text>
  <path d="M260,194 H480" style="stroke:var(--success);stroke-dasharray:4 4"/><text class="lb" x="486" y="198" style="fill:var(--success)">primary key: unique + not null</text>
  <path d="M440,224 H480" style="stroke:var(--success);stroke-dasharray:4 4"/><text class="lb" x="486" y="228" style="fill:var(--success)">foreign key links to another table</text>
  <path d="M60,250 H480" style="stroke:var(--danger);stroke-dasharray:4 4"/><text class="lb" x="486" y="254" style="fill:var(--danger)">no comma before ")" · end with ";"</text>
</svg>
:::

:::steps How to write CREATE TABLE
- Start with `CREATE TABLE TableName (` — a name with **no spaces**.
- One line per field: **field name**, **data type** (with size), optional **constraints**; lines separated by **commas**.
- Mark the primary key: `PRIMARY KEY` after the field, or `PRIMARY KEY (field)` on its own line.
- Add `FOREIGN KEY (field) REFERENCES OtherTable(field)` for every link to another table.
- A **composite key** uses two fields: `PRIMARY KEY (StudentID, CourseID)`.
- Close with `);` — no comma after the last line.
:::

```sql | ALTER TABLE — change the structure of an existing table
ALTER TABLE Titles ADD Budget FLOAT;                  -- add a field
ALTER TABLE Titles ADD Pages INT NOT NULL DEFAULT 0;  -- add a field with a default
ALTER TABLE Titles MODIFY title VARCHAR(150);         -- change the data type / size
ALTER TABLE Titles DROP COLUMN year;                  -- delete a field (and all its data)
ALTER TABLE Titles RENAME COLUMN price TO price_tg;   -- rename a field
```

:::svg ALTER TABLE changes the columns of a table that already holds data
<svg class="sq4" xml:space="preserve" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Before: Titles has title_ID, title, price, year. After ALTER TABLE ADD Pages and DROP COLUMN year, Titles has title_ID, title, price, Pages">
  <style>
    svg.sq4 text{white-space:pre}
    svg.sq4 .hd{fill:var(--primary-soft);stroke:var(--primary)}
    svg.sq4 .rw{fill:var(--surface-2);stroke:var(--border)}
    svg.sq4 .nw{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.sq4 .dl{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.sq4 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq4 .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq4 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="20" y="24">Before</text>
  <rect class="hd" x="20" y="34" width="250" height="28"/><text class="c" x="28" y="53">ID  title        price</text>
  <rect class="dl" x="270" y="34" width="60" height="28"/><text class="c" x="280" y="53">year</text>
  <rect class="rw" x="20" y="64" width="310" height="26"/><text class="c" x="28" y="82">1   Informatika  1800   2021</text>
  <rect class="rw" x="20" y="92" width="310" height="26"/><text class="c" x="28" y="110">2   Algebra      2500   2022</text>
  <path d="M345,76 H405" style="stroke:var(--muted);stroke-width:2"/><path d="M405,70 l12,6 l-12,6 z" style="fill:var(--muted)"/>
  <text class="h" x="430" y="24">After</text>
  <rect class="hd" x="430" y="34" width="250" height="28"/><text class="c" x="438" y="53">ID  title        price</text>
  <rect class="nw" x="680" y="34" width="66" height="28"/><text class="c" x="688" y="53">Pages</text>
  <rect class="rw" x="430" y="64" width="316" height="26"/><text class="c" x="438" y="82">1   Informatika  1800   0</text>
  <rect class="rw" x="430" y="92" width="316" height="26"/><text class="c" x="438" y="110">2   Algebra      2500   0</text>
  <text class="c" x="20" y="152" style="fill:var(--success)">ALTER TABLE Titles ADD Pages INT DEFAULT 0;</text>
  <text class="s" x="20" y="170">a new column appears in every row (filled with the default or NULL)</text>
  <text class="c" x="430" y="152" style="fill:var(--danger)">ALTER TABLE Titles DROP COLUMN year;</text>
  <text class="s" x="430" y="170">the column and its values in every row are lost</text>
  <text class="s" x="20" y="198">The rows (records) stay — only the structure changes. This is DDL.</text>
</svg>
:::

```sql | DROP — delete a whole table or database
DROP TABLE Titles;          -- the table, its structure and ALL its data are deleted
DROP DATABASE BooksDB;      -- the whole database is deleted
```

:::compare CREATE, ALTER and DROP
| Command | What it does | Example | Data afterwards |
|---|---|---|---|
| `CREATE` | Makes a **new** database or table | `CREATE TABLE Members (…);` | New, empty table |
| `ALTER` | **Changes** an existing table: add, modify, drop or rename a column | `ALTER TABLE Members ADD Email VARCHAR(50);` | Records stay; columns change |
| `DROP` | **Deletes** a whole table or database | `DROP TABLE Members;` | Structure and all data gone |
:::

:::warning DROP cannot be undone
`DROP TABLE` removes the **structure and all records**; `ALTER TABLE … DROP COLUMN` removes a field and its values in **every** record. There is no "undo" — make a **backup** first.
:::

:::example Describe an SQL statement (exam style)
`ALTER TABLE Movies DROP COLUMN Country;`
**Changes the structure of the table** `Movies` (1) by **deleting the field** `Country` — the Country value is removed from every record (1).
:::

# Exam practice: data types, DDL and DML
@lo 11.4.1.4 11.4.2.1 11.4.2.2

:::example Exam-style answers
**Q: Compare DDL and DML. [2]**
DDL defines / changes the **structure** of the database (tables, fields, keys), e.g. `CREATE`, `ALTER`, `DROP` (1); DML **works with the data / records** in the tables, e.g. `SELECT`, `INSERT`, `UPDATE`, `DELETE` (1).

**Q: Identify the most suitable data type for a field `Price` that stores 1499.50 tenge. [1]**
`DECIMAL(8,2)` / `DECIMAL` (also accept `FLOAT` / real) (1).

**Q: Write an SQL statement to create a database called SchoolLibrary. [1]**
`CREATE DATABASE SchoolLibrary;` (1)

**Q: Write an SQL statement to create the table `Members` with fields `MemberID` (whole number, primary key), `FullName` (up to 40 characters, required) and `JoinDate`. [4]**
`CREATE TABLE Members (` (1) `MemberID INT PRIMARY KEY,` (1) `FullName VARCHAR(40) NOT NULL,` (1) `JoinDate DATE);` (1)

**Q: Fill the gaps to add a `Budget` column to the `Movies` table to store the cost of each movie in dollars. [3]**
`ALTER TABLE Movies` (1) `ADD` (1) `Budget FLOAT;` (1)

**Q: Explain why a phone number is stored as VARCHAR and not INT. [2]**
It can start with `+` or `0` and contain spaces, which an integer would lose / not allow (1); no calculations are done with it (1).
:::

:::warning Common mistakes
- Spaces in table or database names (`CREATE DATABASE School Library`).
- Missing **commas** between fields in `CREATE TABLE`, or a comma after the last field.
- Using `DELETE` when the question asks to remove a **column** — that is `ALTER TABLE … DROP COLUMN`.
- Saying `SELECT` is DDL — it does not change the structure, so it is **DML**.
- Forgetting the size: `VARCHAR` → `VARCHAR(40)`.
:::

:::steps Check yourself
- Define DDL and DML and give two commands of each.
- Name six SQL data types and give a field for each.
- Explain the difference between `CHAR(3)` and `VARCHAR(3)`.
- Write `CREATE TABLE` for `Students(StudentID, Name, Grade, DateOfBirth)` with a primary key.
- Add a field `Email` to `Students`; then delete the field `Grade`.
- State what `DROP TABLE Students;` does to the data.
:::

# Adding and selecting data: INSERT and SELECT
@lo 11.4.2.3

:::definition Query
A request to the database written in SQL, usually to **retrieve** data (`SELECT`), but also to **add, change or delete** data. The result of a `SELECT` query is itself a table (the **result set**).
:::

```sql | INSERT — add records
INSERT INTO Publishers (pub_ID, pub_name, city)
VALUES (104, 'Kitap', 'Shymkent');

INSERT INTO Titles (title, price, pub_ID, year)      -- title_ID is AUTO_INCREMENT
VALUES ('Biology 11', 2300, 104, 2024),
       ('Geography 11', 1900, 101, 2024);           -- several rows at once

INSERT INTO Publishers VALUES (105, 'Arman', 'Aktobe');   -- all fields, in table order
```

:::steps How to write INSERT
- `INSERT INTO TableName` — the table that gets the new record.
- `(field1, field2, …)` — the fields you are filling (can be left out if you give **every** field in table order).
- `VALUES (value1, value2, …)` — values **in the same order** as the fields; text and dates in quotes.
- Leave out an `AUTO_INCREMENT` key — the DBMS fills it.
:::

```sql | SELECT — retrieve data
SELECT * FROM Titles;                                 -- all fields, all records
SELECT title, price FROM Titles;                      -- chosen fields only
SELECT title, price FROM Titles WHERE price < 2000;  -- only matching records
SELECT DISTINCT city FROM Publishers;                 -- without duplicates
```

:::svg SELECT chooses the columns, WHERE chooses the rows
<svg class="sq5" xml:space="preserve" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SELECT title, price picks two columns of Titles; WHERE price less than 2000 keeps only two rows; the result is a smaller table">
  <style>
    svg.sq5 text{white-space:pre}
    svg.sq5 .hd{fill:var(--surface-2);stroke:var(--border)}
    svg.sq5 .col{fill:var(--primary-soft)}
    svg.sq5 .row{fill:none;stroke:var(--success);stroke-width:2.5}
    svg.sq5 .h{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq5 .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq5 .x{font:13px ui-monospace,monospace;fill:var(--muted)}
    svg.sq5 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.sq5 .k{font:700 13px ui-monospace,monospace}
  </style>
  <text class="k" x="20" y="22" style="fill:var(--primary)">SELECT title, price</text><text class="k" x="190" y="22" style="fill:var(--foreground)">FROM Titles</text><text class="k" x="300" y="22" style="fill:var(--success)">WHERE price &lt; 2000;</text>
  <rect class="col" x="62" y="40" width="200" height="190"/>
  <rect class="col" x="262" y="40" width="70" height="190" style="opacity:.8"/>
  <rect class="hd" x="20" y="40" width="400" height="28" style="fill:none"/>
  <text class="h" x="28" y="59">ID</text><text class="h" x="70" y="59">title</text><text class="h" x="270" y="59">price</text><text class="h" x="345" y="59">year</text>
  <text class="x" x="28" y="92">1</text><text class="c" x="70" y="92">Informatika 11</text><text class="c" x="270" y="92">1800</text><text class="x" x="345" y="92">2021</text>
  <text class="x" x="28" y="124">2</text><text class="x" x="70" y="124">Algebra 11</text><text class="x" x="270" y="124">2500</text><text class="x" x="345" y="124">2022</text>
  <text class="x" x="28" y="156">3</text><text class="c" x="70" y="156">Physics 11</text><text class="c" x="270" y="156">1950</text><text class="x" x="345" y="156">2023</text>
  <text class="x" x="28" y="188">4</text><text class="x" x="70" y="188">History of Kazakhstan</text><text class="x" x="270" y="188">3200</text><text class="x" x="345" y="188">2020</text>
  <text class="x" x="28" y="220">5</text><text class="x" x="70" y="220">Chemistry 11</text><text class="x" x="270" y="220">2100</text><text class="x" x="345" y="220">2023</text>
  <rect class="row" x="18" y="76" width="404" height="24" rx="4"/>
  <rect class="row" x="18" y="140" width="404" height="24" rx="4"/>
  <path d="M440,130 H500" style="stroke:var(--muted);stroke-width:2"/><path d="M500,124 l12,6 l-12,6 z" style="fill:var(--muted)"/>
  <text class="h" x="525" y="100">Result set</text>
  <rect class="hd" x="525" y="110" width="220" height="28"/><text class="h" x="535" y="129">title</text><text class="h" x="680" y="129">price</text>
  <rect class="hd" x="525" y="138" width="220" height="26" style="fill:var(--success-soft)"/><text class="c" x="535" y="156">Informatika 11</text><text class="c" x="680" y="156">1800</text>
  <rect class="hd" x="525" y="164" width="220" height="26" style="fill:var(--success-soft)"/><text class="c" x="535" y="182">Physics 11</text><text class="c" x="680" y="182">1950</text>
  <text class="s" x="20" y="258">blue = columns named after SELECT · green outline = rows where the WHERE condition is true</text>
  <text class="s" x="20" y="278">greyed-out values are not returned; the table itself is not changed</text>
</svg>
:::

:::compare Conditions in WHERE
| Operator | Meaning | Example |
|---|---|---|
| `=` `<>` (or `!=`) | equal / not equal | `WHERE city = 'Almaty'` |
| `<` `>` `<=` `>=` | comparison | `WHERE price >= 2000` |
| `AND`, `OR`, `NOT` | combine conditions | `WHERE price < 2000 AND pub_ID = 101` |
| `BETWEEN a AND b` | in a range (**inclusive**) | `WHERE year BETWEEN 2021 AND 2023` |
| `IN (…)` | in a list | `WHERE pub_ID IN (101, 103)` |
| `LIKE` | text pattern: `%` = any characters, `_` = exactly one character | `WHERE title LIKE '%11'` (ends with 11) |
| `IS NULL` / `IS NOT NULL` | missing value | `WHERE city IS NULL` |
:::

:::example Worked example — a school canteen query
The canteen table is `Meals ( MealID, MealName, Price, Category, IsVegetarian )`. The task: *display the name and price of all vegetarian meals that cost less than 900 tenge.*
1. **Which columns?** name and price → `SELECT MealName, Price`
2. **Which table?** → `FROM Meals`
3. **Which rows?** vegetarian **and** under 900 → `WHERE IsVegetarian = TRUE AND Price < 900`
4. End with `;`

```sql
SELECT MealName, Price
FROM Meals
WHERE IsVegetarian = TRUE AND Price < 900;
```
:::

:::warning AND or OR?
"Books from Mektep **and** Atamura" means books whose publisher is **either** of them: `WHERE pub_ID = 101 OR pub_ID = 103` (or `IN (101, 103)`). `WHERE pub_ID = 101 AND pub_ID = 103` returns **no rows**, because one field cannot hold two values at once.
:::

# Changing and deleting data: UPDATE and DELETE
@lo 11.4.2.3

```sql | UPDATE — change existing records
UPDATE Titles
SET title = 'Computer Science 11'
WHERE title = 'Informatika 11';

UPDATE Titles SET price = price * 1.1;               -- all prices up by 10 %
UPDATE Titles SET price = 2000, year = 2025 WHERE title_ID = 3;   -- two fields
```

:::svg UPDATE with WHERE changes only the matching rows
<svg class="sq6" xml:space="preserve" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UPDATE Titles SET price = price * 1.1 WHERE pub_ID = 102 changes the prices of two rows from 2500 to 2750 and 2100 to 2310; other rows stay">
  <style>
    svg.sq6 text{white-space:pre}
    svg.sq6 .hd{fill:var(--primary-soft);stroke:var(--primary)}
    svg.sq6 .rw{fill:var(--surface-2);stroke:var(--border)}
    svg.sq6 .ch{fill:var(--warning);opacity:.3}
    svg.sq6 .h{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq6 .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq6 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="h" x="20" y="22" style="fill:var(--primary)">UPDATE Titles SET price = price * 1.1 WHERE pub_ID = 102;</text>
  <text class="s" x="20" y="48">Before</text>
  <rect class="hd" x="20" y="56" width="300" height="26"/><text class="h" x="28" y="74">title        price  pub_ID</text>
  <rect class="rw" x="20" y="84" width="300" height="24"/><text class="c" x="28" y="101">Informatika  1800   101</text>
  <rect class="ch" x="20" y="110" width="300" height="24"/><rect class="rw" x="20" y="110" width="300" height="24" style="fill:none"/><text class="c" x="28" y="127">Algebra      2500   102</text>
  <rect class="rw" x="20" y="136" width="300" height="24"/><text class="c" x="28" y="153">Physics      1950   101</text>
  <rect class="ch" x="20" y="162" width="300" height="24"/><rect class="rw" x="20" y="162" width="300" height="24" style="fill:none"/><text class="c" x="28" y="179">Chemistry    2100   102</text>
  <path d="M340,130 H400" style="stroke:var(--muted);stroke-width:2"/><path d="M400,124 l12,6 l-12,6 z" style="fill:var(--muted)"/>
  <text class="s" x="430" y="48">After</text>
  <rect class="hd" x="430" y="56" width="300" height="26"/><text class="h" x="438" y="74">title        price  pub_ID</text>
  <rect class="rw" x="430" y="84" width="300" height="24"/><text class="c" x="438" y="101">Informatika  1800   101</text>
  <rect class="rw" x="430" y="110" width="300" height="24" style="fill:var(--success-soft)"/><text class="c" x="438" y="127">Algebra      <tspan style="font-weight:700">2750</tspan>   102</text>
  <rect class="rw" x="430" y="136" width="300" height="24"/><text class="c" x="438" y="153">Physics      1950   101</text>
  <rect class="rw" x="430" y="162" width="300" height="24" style="fill:var(--success-soft)"/><text class="c" x="438" y="179">Chemistry    <tspan style="font-weight:700">2310</tspan>   102</text>
  <text class="s" x="20" y="210">Only the rows where pub_ID = 102 change. Without WHERE all four prices would go up.</text>
</svg>
:::

```sql | DELETE — remove records
DELETE FROM Titles WHERE year < 2021;                -- only old books
DELETE FROM Titles;                                  -- ALL records (the table stays)
```

:::steps How to write UPDATE and DELETE
- `UPDATE TableName` → `SET field = new value` (several: `SET a = 1, b = 2`) → `WHERE condition;`
- A calculation can use the old value: `SET price = price * 1.1` (up 10 %), `SET stock = stock - 1`.
- `DELETE FROM TableName WHERE condition;` — whole rows are removed; no field list is written.
- Before running either, run `SELECT * FROM TableName WHERE condition;` to see which rows will be affected.
:::

:::compare DELETE vs DROP
| `DELETE FROM Titles WHERE …` | `DROP TABLE Titles` |
|---|---|
| **DML** — removes **records** | **DDL** — removes the **whole table** |
| The table structure stays | Structure and data are gone |
| Can remove only some rows | Always removes everything |
| `ALTER TABLE … DROP COLUMN` removes a **column**, not rows | The table can no longer be used in queries |
:::

:::warning Always check the WHERE clause
`UPDATE` and `DELETE` **without WHERE** change or delete **every record** in the table. Use the **primary key** in `WHERE` when you mean one record: `WHERE title_ID = 3`, not `WHERE title = 'Physics 11'` (two books could have the same title).
:::

:::example Worked example — a 15 % discount
The shop table is `Products ( ProductID, Name, Price_tg, Category )`. All products in the category **Stationery** are reduced by 15 %.
```sql
UPDATE Products
SET Price_tg = Price_tg * 0.85
WHERE Category = 'Stationery';
```
A pen that cost 400 ₸ now costs 400 × 0.85 = **340 ₸**; products of other categories are not changed.
:::

# Exam practice: managing data in one table
@lo 11.4.2.3

:::example Exam-style answers
**Q: Write an SQL statement to add the publisher 106, "Daryn", in Pavlodar to the Publishers table. [3]**
`INSERT INTO Publishers (pub_ID, pub_name, city)` (1) `VALUES` (1) `(106, 'Daryn', 'Pavlodar');` (1)

**Q: Write an SQL statement to change all titles "Informatika 11" to "Computer Science 11". [3]**
`UPDATE Titles` (1) `SET title = 'Computer Science 11'` (1) `WHERE title = 'Informatika 11';` (1)

**Q: Write an SQL statement to select the titles and prices of all books of publisher 101 that cost less than 2000 tenge. [4]**
`SELECT title, price` (1) `FROM Titles` (1) `WHERE price < 2000` (1) `AND pub_ID = 101;` (1)

**Q: Prices of all products went up by 10 %. Write an SQL query that will change this data. [2]**
`UPDATE Products` (1) `SET Price_tg = Price_tg * 1.1;` (1)

**Q: Write an SQL statement to delete all books published before 2021. [2]**
`DELETE FROM Titles` (1) `WHERE year < 2021;` (1)

**Q: State what `DELETE FROM Titles;` does. [1]**
Deletes **all records** from Titles; the (empty) table / structure remains (1).
:::

:::warning Common mistakes
- Forgetting **quotes** around text values, or putting quotes around numbers.
- `UPDATE` / `DELETE` without `WHERE`.
- Writing `DELETE title FROM Titles` — `DELETE` removes whole rows; no field names.
- Writing `UPDATE Titles WHERE … SET …` — `SET` comes **before** `WHERE`.
- Using `=` with a pattern: `WHERE title = '%11'` — patterns need `LIKE`.
- Writing `AND` when one field must match one of two values — use `OR` / `IN`.
:::

:::steps Check yourself
- Insert a new student into `Students(StudentID, Name, Grade)`.
- Select the names of all grade 11 students.
- Select all books whose title starts with "A".
- Change the grade of student S0412 to 12; increase every price by 5 %.
- Delete the student S0412.
- Explain the difference between `DELETE FROM Students;` and `DROP TABLE Students;`.
:::

# Validation and verification
@lo 11.5.4.2

:::definition Validation
An **automatic check by the computer** that the data entered is **sensible, reasonable and follows the rules** (type, range, length, format, presence, lookup). It cannot check that the data is **correct**.
:::

:::definition Verification
A check that the data has been **entered or copied accurately** — that it **matches the original source**. Methods: **double entry** (the data is typed twice and the two entries are compared) and **visual check / proofreading** (the data on screen is compared with the original document).
:::

:::svg Data from a paper form is verified (is it what was written?) and validated (is it allowed?)
<svg class="sq7" xml:space="preserve" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A paper form value is typed in, verification compares it with the original by double entry or visual check, validation checks it against rules such as range 0 to 100, then it is stored">
  <style>
    svg.sq7 text{white-space:pre}
    svg.sq7 .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.sq7 .vr{fill:var(--warning);opacity:.18}
    svg.sq7 .vl{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq7 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.sq7 .t{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq7 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.sq7 .m{font:12px ui-monospace,monospace;fill:var(--foreground)}
  </style>
  <rect class="bx" x="10" y="60" width="130" height="90" rx="8"/>
  <text class="t" x="75" y="88" text-anchor="middle">Paper form</text>
  <text class="m" x="75" y="112" text-anchor="middle">Mark: 67</text>
  <text class="s" x="75" y="132" text-anchor="middle">the source</text>
  <path d="M142,105 H170" style="stroke:var(--muted);stroke-width:2"/><path d="M170,99 l10,6 l-10,6 z" style="fill:var(--muted)"/>
  <rect class="vr" x="184" y="30" width="190" height="150" rx="12"/>
  <rect class="bx" x="184" y="30" width="190" height="150" rx="12" style="fill:none;stroke:var(--warning);stroke-width:2"/>
  <text class="t" x="279" y="56" text-anchor="middle">Verification</text>
  <text class="s" x="279" y="76" text-anchor="middle">is it the SAME as the original?</text>
  <text class="m" x="200" y="104">entry 1: 67</text>
  <text class="m" x="200" y="124">entry 2: 67  ✓ match</text>
  <text class="s" x="200" y="150">double entry or</text>
  <text class="s" x="200" y="166">visual check by a person</text>
  <path d="M376,105 H404" style="stroke:var(--muted);stroke-width:2"/><path d="M404,99 l10,6 l-10,6 z" style="fill:var(--muted)"/>
  <rect class="vl" x="418" y="30" width="190" height="150" rx="12"/>
  <text class="t" x="513" y="56" text-anchor="middle" style="fill:var(--primary)">Validation</text>
  <text class="s" x="513" y="76" text-anchor="middle">is it ALLOWED / sensible?</text>
  <text class="m" x="432" y="104">type: whole number ✓</text>
  <text class="m" x="432" y="124">range: 0–100       ✓</text>
  <text class="m" x="432" y="144">presence: given    ✓</text>
  <text class="s" x="432" y="166">done by the computer</text>
  <path d="M610,105 H638" style="stroke:var(--muted);stroke-width:2"/><path d="M638,99 l10,6 l-10,6 z" style="fill:var(--muted)"/>
  <rect class="ok" x="652" y="70" width="100" height="70" rx="10"/>
  <text class="t" x="702" y="100" text-anchor="middle" style="fill:var(--success)">Stored</text>
  <text class="s" x="702" y="120" text-anchor="middle">in the table</text>
  <text class="s" x="10" y="214">76 typed instead of 67 passes validation (it is in range) but fails verification (it does not match the form).</text>
  <text class="s" x="10" y="232">670 fails validation (out of range) even if it was copied "correctly".</text>
</svg>
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

:::compare Validation checks and how SQL applies them
| Check | Rule | In SQL |
|---|---|---|
| **Presence** | A value must be entered | `NOT NULL` |
| **Type** | Must be a whole number / date … | the data type, e.g. `INT`, `DATE` |
| **Range** | Between a lower and upper limit | `CHECK (Mark BETWEEN 0 AND 100)` |
| **Length** | Number of characters | `VARCHAR(40)`, `CHECK (LENGTH(IIN) = 12)` |
| **Lookup** | Must be one of a list | `CHECK (Grade IN (11, 12))` |
| **Format** | Must match a pattern | `CHECK (StudentID LIKE 'S____')` |
| **Uniqueness** | No two rows the same | `UNIQUE`, `PRIMARY KEY` |
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

:::example Worked example — registering for an olympiad
Students register on a school website for a regional olympiad.
- The **e-mail** is typed **twice** and the two must match → **verification** (double entry): it catches a typing mistake such as `aruzhan@mial.kz`.
- **Grade** must be 9, 10 or 11 → **validation** (lookup check): `CHECK (Grade IN (9, 10, 11))`.
- **Date of birth** must be given → **validation** (presence check): `NOT NULL`.
- Before the list is sent, the teacher compares the printed list with the paper forms → **verification** (visual check).
:::

:::warning Common mistakes
- Saying validation checks the data is **correct** — it only checks that it is **reasonable**.
- Calling double entry of a password "validation" — it is **verification**.
- Giving a check without its rule: write "**range check**: mark from 0 to 100", not just "range check".
:::

# Sorting with ORDER BY and summarising data
@lo 11.4.2.5

:::definition ORDER BY
The clause of a `SELECT` statement that **sorts the rows of the result** by one or more fields, **ascending** (`ASC`, the default: A→Z, 0→9, oldest date first) or **descending** (`DESC`). It is always the **last** clause of the query.
:::

```sql | ORDER BY — sort the result
SELECT title, price FROM Titles ORDER BY price;          -- ascending (default, ASC)
SELECT title, price FROM Titles ORDER BY price DESC;     -- descending
SELECT title, year, price FROM Titles
ORDER BY year DESC, title ASC;                           -- by year, then by title
SELECT * FROM Titles WHERE pub_ID = 102 ORDER BY title;  -- WHERE comes before ORDER BY
```

:::svg ORDER BY year DESC, title ASC — the second field only decides ties
<svg class="sq8" xml:space="preserve" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Unsorted titles and years become sorted by year descending; the two 2023 books are then sorted by title ascending, Chemistry before Physics">
  <style>
    svg.sq8 text{white-space:pre}
    svg.sq8 .hd{fill:var(--primary-soft);stroke:var(--primary)}
    svg.sq8 .rw{fill:var(--surface-2);stroke:var(--border)}
    svg.sq8 .tie{fill:var(--warning);opacity:.25}
    svg.sq8 .h{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq8 .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq8 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <text class="s" x="20" y="22">Titles (no order)</text>
  <rect class="hd" x="20" y="30" width="280" height="26"/><text class="h" x="28" y="48">title                  year</text>
  <rect class="rw" x="20" y="58" width="280" height="24"/><text class="c" x="28" y="75">Informatika 11         2021</text>
  <rect class="rw" x="20" y="84" width="280" height="24"/><text class="c" x="28" y="101">Algebra 11             2022</text>
  <rect class="rw" x="20" y="110" width="280" height="24"/><text class="c" x="28" y="127">Physics 11             2023</text>
  <rect class="rw" x="20" y="136" width="280" height="24"/><text class="c" x="28" y="153">History of Kazakhstan  2020</text>
  <rect class="rw" x="20" y="162" width="280" height="24"/><text class="c" x="28" y="179">Chemistry 11           2023</text>
  <path d="M320,110 H390" style="stroke:var(--muted);stroke-width:2"/><path d="M390,104 l12,6 l-12,6 z" style="fill:var(--muted)"/>
  <text class="s" x="420" y="22">ORDER BY year DESC, title ASC</text>
  <rect class="hd" x="420" y="30" width="280" height="26"/><text class="h" x="428" y="48">title                  year ↓</text>
  <rect class="tie" x="420" y="58" width="280" height="50"/>
  <rect class="rw" x="420" y="58" width="280" height="24" style="fill:none"/><text class="c" x="428" y="75">Chemistry 11           2023</text>
  <rect class="rw" x="420" y="84" width="280" height="24" style="fill:none"/><text class="c" x="428" y="101">Physics 11             2023</text>
  <rect class="rw" x="420" y="110" width="280" height="24"/><text class="c" x="428" y="127">Algebra 11             2022</text>
  <rect class="rw" x="420" y="136" width="280" height="24"/><text class="c" x="428" y="153">Informatika 11         2021</text>
  <rect class="rw" x="420" y="162" width="280" height="24"/><text class="c" x="428" y="179">History of Kazakhstan  2020</text>
  <text class="s" x="710" y="88">tie →</text>
  <text class="s" x="420" y="210">newest year first; two books from 2023 are then put in A→Z order</text>
</svg>
:::

:::compare Order of the clauses in a SELECT statement
| Clause | Purpose | Required? |
|---|---|---|
| `SELECT` fields | Which columns | Yes |
| `FROM` tables | Which table(s) | Yes |
| `WHERE` condition | Which rows | Optional |
| `GROUP BY` field | Groups rows for totals | Optional |
| `ORDER BY` field ASC/DESC | Sort order | Optional — **always last** |
:::

:::compare ASC and DESC
| | `ASC` (default) | `DESC` |
|---|---|---|
| Numbers | smallest → largest (cheapest first) | largest → smallest (most expensive first) |
| Text | A → Z | Z → A |
| Dates | oldest / earliest first | newest / latest first |
| Typical task | "in alphabetical order", "cheapest first" | "highest score first", "most recent first" |
:::

```sql | Aggregate functions (summarising data)
SELECT COUNT(*) FROM Titles;                         -- number of books: 5
SELECT AVG(price) FROM Titles WHERE pub_ID = 101;    -- average price of Mektep's books: 1875
SELECT MAX(price), MIN(price) FROM Titles;           -- most and least expensive: 3200, 1800
SELECT SUM(price) FROM Titles WHERE year = 2023;     -- total: 4050
SELECT pub_ID, COUNT(*) AS books FROM Titles
GROUP BY pub_ID ORDER BY books DESC;                 -- number of books per publisher
```

:::example Worked example — a leaderboard
A school quiz stores `Results ( StudentName, Class, Score, FinishTime )`. The task: *show the name and score of class 11B students, highest score first; students with the same score in the order they finished.*
```sql
SELECT StudentName, Score
FROM Results
WHERE Class = '11B'
ORDER BY Score DESC, FinishTime ASC;
```
:::

# Exam practice: validation, verification and ORDER BY
@lo 11.5.4.2 11.4.2.5

:::example Exam-style answers
**Q: Explain the difference between validation and verification. [2]**
Validation is an **automatic check that data is reasonable / follows rules** (e.g. range check) (1); verification checks that data **matches the original source** (e.g. double entry, visual check) (1).

**Q: Describe double entry. [2]**
The data is typed in **twice** (1) and the computer **compares the two entries**; if they differ the user must re-enter it (1).

**Q: Write the constraint that makes sure `Rating` is between 1 and 5. [1]**
`CHECK (Rating BETWEEN 1 AND 5)` (or `CHECK (Rating >= 1 AND Rating <= 5)`) (1)

**Q: Display all deliveries to Store_code 88, sorted by date. [4]**
`SELECT *` (1) `FROM Deliveries` (1) `WHERE Store_code = 88` (1) `ORDER BY Delivery_date ASC;` (1)

**Q: Write a query to show the titles of all books, most expensive first. [3]**
`SELECT title` (1) `FROM Titles` (1) `ORDER BY price DESC;` (1)
:::

:::warning Common mistakes
- Writing `ORDER BY` **before** `WHERE`.
- Writing `SORT BY` or `ORDER price` — the clause is `ORDER BY`.
- Forgetting `DESC` when the question says "highest first" (ASC is the default).
- Saying verification "checks that data is correct" without saying **against the original**.
:::

:::steps Check yourself
- Define validation and verification and give two methods of each.
- Give an error that validation cannot detect but verification can.
- Write `CHECK` constraints for a range check and a lookup check.
- Select the names of grade 11 students sorted alphabetically.
- Sort books by year (newest first) and then by title.
- Count the books of publisher 102.
:::

# Selecting data from multiple tables
@lo 11.4.2.4

:::definition Join
A query that **combines rows from two or more related tables**, matching the **foreign key** in one table with the **primary key** in the other, so that data stored in different tables can be shown together.
:::

To combine data from related tables, the query must state **how the tables are linked** — the **foreign key** in one table must equal the **primary key** in the other.

:::svg Titles.pub_ID (foreign key) is matched with Publishers.pub_ID (primary key)
<svg class="sq9" xml:space="preserve" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rows of Titles are linked to rows of Publishers where pub_ID values are equal; the joined result shows each title with its publisher name">
  <style>
    svg.sq9 text{white-space:pre}
    svg.sq9 .hd{fill:var(--primary-soft);stroke:var(--primary)}
    svg.sq9 .rw{fill:var(--surface-2);stroke:var(--border)}
    svg.sq9 .k{fill:var(--warning);opacity:.3}
    svg.sq9 .h{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq9 .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq9 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.sq9 .ln{stroke:var(--warning);stroke-width:2;fill:none}
  </style>
  <text class="s" x="20" y="20">Titles</text>
  <rect class="hd" x="20" y="28" width="260" height="26"/><text class="h" x="28" y="46">title           pub_ID (FK)</text>
  <rect class="rw" x="20" y="56" width="260" height="24"/><text class="c" x="28" y="73">Informatika 11  101</text>
  <rect class="rw" x="20" y="82" width="260" height="24"/><text class="c" x="28" y="99">Algebra 11      102</text>
  <rect class="rw" x="20" y="108" width="260" height="24"/><text class="c" x="28" y="125">Physics 11      101</text>
  <rect class="rw" x="20" y="134" width="260" height="24"/><text class="c" x="28" y="151">History of KZ   103</text>
  <text class="s" x="480" y="20">Publishers</text>
  <rect class="hd" x="480" y="28" width="260" height="26"/><text class="h" x="488" y="46">pub_ID (PK) pub_name</text>
  <rect class="rw" x="480" y="56" width="260" height="24"/><text class="c" x="488" y="73">101         Mektep</text>
  <rect class="rw" x="480" y="82" width="260" height="24"/><text class="c" x="488" y="99">102         Foliant</text>
  <rect class="rw" x="480" y="108" width="260" height="24"/><text class="c" x="488" y="125">103         Atamura</text>
  <path class="ln" d="M190,68 C340,68 340,68 480,68"/>
  <path class="ln" d="M190,94 C340,94 340,94 480,94"/>
  <path class="ln" d="M190,120 C340,120 340,70 480,70" style="stroke-dasharray:5 4"/>
  <path class="ln" d="M190,146 C340,146 340,120 480,120"/>
  <text class="s" x="300" y="176">ON Titles.pub_ID = Publishers.pub_ID</text>
  <text class="s" x="20" y="200">Result of the join</text>
  <rect class="hd" x="20" y="208" width="400" height="24" style="fill:var(--success-soft);stroke:var(--success)"/><text class="h" x="28" y="225">title           price  pub_name</text>
  <text class="c" x="28" y="248">Informatika 11  1800   Mektep</text>
  <text class="c" x="28" y="268">Algebra 11      2500   Foliant</text>
  <text class="c" x="28" y="288">Physics 11      1950   Mektep   …</text>
  <text class="s" x="450" y="248">each title gets the name of</text>
  <text class="s" x="450" y="266">the publisher whose pub_ID matches</text>
</svg>
:::

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

:::steps How to write a query on two tables
- List the fields you need, each as `Table.field` → `SELECT Titles.title, Publishers.pub_name`
- Name **both** tables → `FROM Titles, Publishers` (or `FROM Titles JOIN Publishers`)
- Write the **join condition**: foreign key = primary key → `WHERE Titles.pub_ID = Publishers.pub_ID` (or `ON …`)
- Add any other conditions with `AND` → `AND Publishers.city = 'Almaty'`
- Sort last → `ORDER BY Titles.price;`
:::

:::example Books published in Almaty, cheapest first
```sql
SELECT Titles.title, Titles.price, Publishers.pub_name
FROM Titles, Publishers
WHERE Titles.pub_ID = Publishers.pub_ID
  AND Publishers.city = 'Almaty'
ORDER BY Titles.price ASC;
```
| title | price | pub_name |
|---|---|---|
| Informatika 11 | 1800 | Mektep |
| Physics 11 | 1950 | Mektep |
| History of Kazakhstan | 3200 | Atamura |
:::

:::svg Without a join condition every row is paired with every row
<svg class="sq10" xml:space="preserve" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Five titles times three publishers gives fifteen rows when no join condition is written; with the condition only five correct rows remain">
  <style>
    svg.sq10 text{white-space:pre}
    svg.sq10 .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.sq10 .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.sq10 .t{font:700 14px system-ui,sans-serif}
    svg.sq10 .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq10 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <rect class="bad" x="20" y="20" width="350" height="160" rx="12"/>
  <text class="t" x="40" y="46" style="fill:var(--danger)">No join condition</text>
  <text class="m" x="40" y="72">SELECT * FROM Titles, Publishers;</text>
  <text class="m" x="40" y="104">5 titles × 3 publishers = 15 rows</text>
  <text class="s" x="40" y="130">"Algebra 11 — Mektep", "Algebra 11 — Atamura" …</text>
  <text class="s" x="40" y="150">most rows pair a book with the WRONG publisher</text>
  <rect class="ok" x="390" y="20" width="350" height="160" rx="12"/>
  <text class="t" x="410" y="46" style="fill:var(--success)">With the join condition</text>
  <text class="m" x="410" y="72">… WHERE Titles.pub_ID</text>
  <text class="m" x="410" y="90">        = Publishers.pub_ID;</text>
  <text class="m" x="410" y="122">5 rows — one per title</text>
  <text class="s" x="410" y="150">each book with its own publisher</text>
</svg>
:::

:::warning Forgetting the join condition
`SELECT * FROM Titles, Publishers;` **without** `WHERE Titles.pub_ID = Publishers.pub_ID` combines **every** title with **every** publisher (5 × 3 = 15 rows) — a meaningless result.
:::

:::tip Table names before field names
When two tables have a field with the **same name** (here `pub_ID`), write `TableName.fieldName` to avoid ambiguity. Short aliases help: `FROM Titles t JOIN Publishers p ON t.pub_ID = p.pub_ID`.
:::

# Creating a database with multiple tables
@lo 11.4.1.11 11.4.2.2

:::definition Relational database with multiple tables
A database in which data about **different entities** is stored in **separate tables** that are **linked by keys**: the primary key of one table appears as a **foreign key** in another. Each fact is stored once, so there is less redundancy and fewer errors.
:::

:::svg From the design (ERD) to the tables: parent tables are created first
<svg class="sq11" xml:space="preserve" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ERD of Students, Loans and Books: one student has many loans, one book has many loans. Create order: Students and Books first, then Loans with two foreign keys">
  <style>
    svg.sq11 text{white-space:pre}
    svg.sq11 .en{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.sq11 .lk{fill:var(--warning);opacity:.2}
    svg.sq11 .t{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.sq11 .m{font:12px ui-monospace,monospace;fill:var(--foreground)}
    svg.sq11 .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.sq11 .n{font:700 13px system-ui,sans-serif;fill:#fff}
  </style>
  <rect class="en" x="20" y="30" width="200" height="96" rx="8"/>
  <text class="t" x="120" y="52" text-anchor="middle">Students</text>
  <text class="m" x="34" y="76">StudentID  PK</text><text class="m" x="34" y="96">FullName</text><text class="m" x="34" y="114">Class</text>
  <rect class="lk" x="280" y="30" width="200" height="96" rx="8"/><rect x="280" y="30" width="200" height="96" rx="8" style="fill:none;stroke:var(--warning);stroke-width:2"/>
  <text class="t" x="380" y="52" text-anchor="middle">Loans</text>
  <text class="m" x="294" y="76">LoanID     PK</text><text class="m" x="294" y="96">StudentID  FK</text><text class="m" x="294" y="114">BookID     FK</text>
  <rect class="en" x="540" y="30" width="200" height="96" rx="8"/>
  <text class="t" x="640" y="52" text-anchor="middle">Books</text>
  <text class="m" x="554" y="76">BookID     PK</text><text class="m" x="554" y="96">Title</text><text class="m" x="554" y="114">Author</text>
  <path d="M220,78 H280" style="stroke:var(--foreground);stroke-width:2"/>
  <path d="M268,66 L280,78 L268,90" style="stroke:var(--foreground);stroke-width:2;fill:none"/>
  <text class="s" x="226" y="70">1</text><text class="s" x="258" y="104">M</text>
  <path d="M540,78 H480" style="stroke:var(--foreground);stroke-width:2"/>
  <path d="M492,66 L480,78 L492,90" style="stroke:var(--foreground);stroke-width:2;fill:none"/>
  <text class="s" x="528" y="70">1</text><text class="s" x="490" y="104">M</text>
  <circle cx="40" cy="170" r="13" style="fill:var(--primary)"/><text class="n" x="40" y="175" text-anchor="middle">1</text>
  <text class="s" x="62" y="168">CREATE TABLE Students</text><text class="s" x="62" y="184">and Books (no foreign keys)</text>
  <circle cx="300" cy="170" r="13" style="fill:var(--warning)"/><text class="n" x="300" y="175" text-anchor="middle">2</text>
  <text class="s" x="322" y="168">CREATE TABLE Loans with</text><text class="s" x="322" y="184">FOREIGN KEY … REFERENCES both</text>
  <circle cx="560" cy="170" r="13" style="fill:var(--success)"/><text class="n" x="560" y="175" text-anchor="middle">3</text>
  <text class="s" x="582" y="168">INSERT students and books</text><text class="s" x="582" y="184">first, then loans</text>
  <text class="s" x="20" y="228">A foreign key can only refer to a table that already exists and to a value that is already stored there.</text>
</svg>
:::

:::steps How to create a database with multiple tables
- From the ERD, list the **tables**, their **fields** and the **primary key** of each.
- For every **one-to-many** relationship, put the primary key of the "one" table into the "many" table as a **foreign key**.
- Choose the **data type** of each field (a foreign key has the **same type and size** as the primary key it refers to).
- `CREATE DATABASE` and then `CREATE TABLE` for the tables **without** foreign keys first.
- Create the tables **with** foreign keys, adding `FOREIGN KEY (…) REFERENCES Table(…)`.
- Insert data: rows of the parent tables first, then the rows that refer to them.
:::

```sql | A school library database with three tables
CREATE DATABASE SchoolLibrary;
USE SchoolLibrary;

CREATE TABLE Students (
    StudentID VARCHAR(5)  PRIMARY KEY,
    FullName  VARCHAR(60) NOT NULL,
    Class     CHAR(3)
);

CREATE TABLE Books (
    BookID INT          PRIMARY KEY,
    Title  VARCHAR(100) NOT NULL,
    Author VARCHAR(60)
);

CREATE TABLE Loans (
    LoanID    INT AUTO_INCREMENT PRIMARY KEY,
    StudentID VARCHAR(5) NOT NULL,
    BookID    INT        NOT NULL,
    LoanDate  DATE,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (BookID)    REFERENCES Books(BookID)
);
```

:::compare Primary key and foreign key
| | Primary key | Foreign key |
|---|---|---|
| Purpose | **Uniquely identifies** each record of its own table | **Links** a record to a record in **another** table |
| Unique? | Yes — no duplicates, never NULL | No — the same value can appear many times (one student, many loans) |
| How many per table | One (may be composite) | Zero, one or several |
| In SQL | `PRIMARY KEY (StudentID)` | `FOREIGN KEY (StudentID) REFERENCES Students(StudentID)` |
:::

```sql | Querying three tables: who has borrowed which book?
SELECT Students.FullName, Books.Title, Loans.LoanDate
FROM Students, Loans, Books
WHERE Students.StudentID = Loans.StudentID
  AND Books.BookID = Loans.BookID
ORDER BY Loans.LoanDate DESC;
```

:::warning Common mistakes when building linked tables
- Creating `Loans` **before** `Students` — the foreign key refers to a table that does not exist yet.
- A foreign key with a **different type** from the primary key (`StudentID INT` in Loans, `VARCHAR(5)` in Students).
- Inserting a loan for a student who is **not** in `Students` — the DBMS rejects it (referential integrity).
- With three tables, writing only **one** join condition — you need **two** (number of tables − 1).
:::

# Exam practice and summary
@lo 11.4.1.4 11.5.4.2 11.4.2.1 11.4.2.2 11.4.2.3 11.4.2.4 11.4.2.5 11.4.1.11

:::example Exam-style answers
**Q: Write an SQL statement to display the title of each book and the name of its publisher. [4]**
`SELECT Titles.title, Publishers.pub_name` (1) `FROM Titles, Publishers` (1) `WHERE Titles.pub_ID` (1) `= Publishers.pub_ID;` (1)

**Q: Write an SQL statement to display the titles of books published in Astana, in alphabetical order. [5]**
`SELECT Titles.title` (1) `FROM Titles, Publishers` (1) `WHERE Titles.pub_ID = Publishers.pub_ID` (1) `AND Publishers.city = 'Astana'` (1) `ORDER BY Titles.title;` (1)

**Q: Explain why the query `SELECT * FROM Titles, Publishers;` gives a wrong result. [2]**
There is no **join condition** linking the foreign key to the primary key (1), so every title is combined with every publisher / 15 rows instead of 5 (1).

**Q: Write the SQL line that makes `StudentID` in `Loans` a foreign key. [2]**
`FOREIGN KEY (StudentID)` (1) `REFERENCES Students(StudentID)` (1)

**Q: Explain why the table `Students` must be created before `Loans`. [2]**
`Loans` contains a **foreign key that refers to** `Students` (1); a foreign key can only reference a table / primary key that **already exists** (1).
:::

:::warning Common mistakes
- Joining tables **without a join condition**.
- Writing a field name that exists in both tables **without** the table name (`pub_ID` → `Titles.pub_ID`).
- Matching the wrong fields: `Titles.title_ID = Publishers.pub_ID`.
- Putting `ORDER BY` before the join condition.
:::

:::steps Check yourself
- Explain what a join is and why the join condition is needed.
- Select each title with its publisher's name for books published after 2021.
- Write `CREATE TABLE` statements for two linked tables with a primary and a foreign key.
- Say in which order the tables of a library database must be created and filled.
- Query three tables: student name, book title and loan date.
:::
