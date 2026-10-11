---
summary: What a data dictionary is and why it is used, what it records about each field (name, data type, size, format, key, validation, description, example), and how to create a data dictionary for the tables of a database.
---
# What a data dictionary is
@lo 11.4.1.5

:::definition Data dictionary
A **document or table that describes the structure of a database** — "data about the data" (**metadata**). For every **table** it lists every **field** with its **name, data type, size, format, key, validation rules, description** and an **example**.
:::

A data dictionary is written during the **design** stage of the system development life cycle, before the database is built, and is kept up to date for as long as the system is used.

:::compare What a data dictionary records for each field
| Item | Meaning | Example |
|---|---|---|
| **Field name** | The exact name used in the database (no spaces) | `DateOfBirth` |
| **Data type** | Text / VARCHAR, Integer, Real / Decimal, Date, Boolean | Date |
| **Field size / length** | Maximum number of characters or digits | 10 |
| **Format** | How the data is displayed or entered | DD/MM/YYYY |
| **Key** | Primary key (PK), foreign key (FK) or none | PK |
| **Validation** | The rule the data must satisfy | Presence check; range 01/01/2005 – 31/12/2012 |
| **Required / null** | Whether the field must have a value | Required |
| **Description** | What the field stores | Date the pupil was born |
| **Example** | A typical value | 14/03/2009 |
:::

# The purpose of a data dictionary
@lo 11.4.1.5

:::cards
### Why a data dictionary is used
- Gives **one clear, agreed definition** of every field, so everyone uses the same names and types.
- Helps **programmers build** the database and write code / SQL correctly.
- Ensures **consistency** — the same field (e.g. `StudentID`) has the same type and size in every table, so keys match.
- Records **validation rules**, which improves **data integrity** (fewer invalid entries).
- Helps **maintenance** — new developers understand the database quickly; changes are documented.
- Forms part of the **technical documentation** of the system.
### Who uses it
- **Database designers** and **analysts** — to plan the tables.
- **Programmers** — to create the tables and write queries and forms.
- **Testers** — to choose test data from the validation rules.
- **Database administrators** — to maintain and change the database later.
:::

:::callout info Data dictionary in a DBMS
Most DBMSs keep an internal **system catalogue** (a data dictionary they update automatically), which stores the table and field definitions, keys, indexes and user permissions.
:::

# Validation in a data dictionary
@lo 11.4.1.6

:::compare Validation checks
| Check | What it checks | Example |
|---|---|---|
| **Presence check** | The field is **not empty** | Surname must be entered |
| **Range check** | The value is **between limits** | Mark 0–100; Age 11–18 |
| **Type check** | The data is the **correct data type** | Quantity must be an integer |
| **Length check** | The number of **characters** is correct | Phone has 11 digits; password 8–16 characters |
| **Format (picture) check** | The data matches a **pattern** | Pupil ID `S` followed by 4 digits, e.g. S0421 |
| **Lookup (list) check** | The value is in a **list of allowed values** | Grade is 11 or 12; Gender is M or F |
| **Uniqueness check** | No two records have the same value | Primary key, e-mail address |
:::

:::warning Validation is not verification
**Validation** checks that data is **sensible / reasonable** (it follows the rules). It cannot check that the data is **correct** — "15/04/2009" passes a date check even if the pupil was born on 14/04/2009.
:::

# Creating a data dictionary
@lo 11.4.1.6

:::steps How to create a data dictionary
- List the **tables** of the database (from the ERD).
- For each table, list every **field** with a clear name (no spaces).
- Choose the most suitable **data type** and **size** for each field.
- Mark the **primary key** and any **foreign keys** (a foreign key must have the **same type and size** as the primary key it refers to).
- Add a **validation rule**, a **format** where needed, a short **description** and an **example**.
:::

:::example Data dictionary for a school library — table `Students`
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| StudentID | VARCHAR | 5 | PK | Presence; format `S` + 4 digits; unique | Unique student number | S0421 |
| FirstName | VARCHAR | 30 | | Presence | Student's first name | Aruzhan |
| Surname | VARCHAR | 30 | | Presence | Student's family name | Bekova |
| Grade | INTEGER | 2 | | Lookup: 11 or 12 | School grade | 11 |
| DateOfBirth | DATE | — | | Range 01/01/2005 – 31/12/2012 | Date of birth, DD/MM/YYYY | 14/03/2009 |
| Phone | VARCHAR | 12 | | Length 12; format `+7` + 10 digits | Contact phone | +77011234567 |
:::

:::example Data dictionary — table `Loans`
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| LoanID | INTEGER | — | PK | Unique; auto-increment | Loan number | 1057 |
| StudentID | VARCHAR | 5 | FK → Students | Must exist in Students | Who borrowed the book | S0421 |
| BookID | VARCHAR | 6 | FK → Books | Must exist in Books | Which book | B00312 |
| LoanDate | DATE | — | | Presence; not in the future | Date borrowed | 02/10/2026 |
| ReturnDate | DATE | — | | Must be on or after LoanDate (may be empty) | Date returned | 16/10/2026 |
| Returned | BOOLEAN | — | | True / False | Has the book been returned? | False |
:::

```sql | The data dictionary turned into SQL
CREATE TABLE Students (
    StudentID   VARCHAR(5)  PRIMARY KEY,
    FirstName   VARCHAR(30) NOT NULL,
    Surname     VARCHAR(30) NOT NULL,
    Grade       INTEGER     CHECK (Grade IN (11, 12)),
    DateOfBirth DATE,
    Phone       VARCHAR(12)
);
```

:::tip Choosing data types
- Numbers you **calculate with** → INTEGER or REAL/DECIMAL (price → DECIMAL).
- **Codes and numbers you do not calculate with** (phone, ID, postcode) → VARCHAR / TEXT.
- **Yes/No** values → BOOLEAN.
- Dates → DATE (so they can be sorted and compared correctly).
:::

# Exam practice and summary
@lo 11.4.1.5 11.4.1.6

:::example Exam-style answers
**Q: Explain the purpose of a data dictionary. [2]**
It **describes every field** of the database — name, data type, size, validation (1) — so that programmers **build the database consistently and correctly** and it is easier to **maintain** later (1).

**Q: Complete the data dictionary entry for the field `Price`. [3]**
Data type: **Decimal / Real** (1); validation: **range check > 0** (1); example: **450.00** (1).

**Q: State why a foreign key must have the same data type and size as the primary key it refers to. [1]**
So that the values **match** and the tables can be **linked** (joined) correctly.
:::

:::warning Common mistakes
- Using INTEGER for phone numbers or IDs with letters or leading zeros.
- Writing validation that does not match the data (a range check on a name).
- Giving a description that just repeats the field name ("Surname — the surname").
- Forgetting to mark **primary** and **foreign** keys.
- Confusing a data dictionary with a **user guide** — it is **technical** documentation.
:::

:::steps Check yourself
- What is a data dictionary and when is it created?
- List eight items recorded for each field.
- Give three reasons for using a data dictionary.
- Name six validation checks with an example of each.
- Create a data dictionary for `Products(ProductID, Name, Price, InStock, CategoryID)`.
:::
