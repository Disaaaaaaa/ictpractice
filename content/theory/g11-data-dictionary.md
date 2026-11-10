---
summary: What a data dictionary is and why it is used, what it records about each field (name, data type, size, format, key, validation, description, example), and how to create a data dictionary for the tables of a database.
---
# What a data dictionary is
@lo 11.4.1.5

:::definition Data dictionary
A **document or table that describes the structure of a database** — "data about the data" (**metadata**). For every **table** it lists every **field** with its **name, data type, size, format, key, validation rules, description** and an **example**.
:::

:::definition Metadata
**Data that describes other data.** The value `14/03/2009` is data; the facts "this field is called `DateOfBirth`, it is a Date in the format DD/MM/YYYY and it must be filled in" are metadata.
:::

:::svg A table holds the data; its data dictionary holds the metadata
<svg class="dd" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Students table with data, and its data dictionary describing each field">
  <defs><marker id="dda" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.dd .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dd .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dd .hd{fill:var(--primary-soft)} svg.dd .row{fill:var(--surface-2)}
    svg.dd .ln{stroke:var(--border);stroke-width:1}
  </style>
  <text class="h" x="20" y="24">Table Students — the data</text>
  <rect class="hd" x="20" y="34" width="330" height="28" rx="4"/>
  <text class="h" x="30" y="53">StudentID</text><text class="h" x="120" y="53">Surname</text><text class="h" x="220" y="53">DateOfBirth</text>
  <rect class="row" x="20" y="64" width="330" height="26"/><text class="c" x="30" y="82">S0412</text><text class="c" x="120" y="82">Bekova</text><text class="c" x="220" y="82">14/03/2009</text>
  <rect class="row" x="20" y="92" width="330" height="26"/><text class="c" x="30" y="110">S0413</text><text class="c" x="120" y="110">Serikov</text><text class="c" x="220" y="110">02/11/2008</text>
  <text class="s" x="20" y="138">each row is a record; each cell is a value</text>
  <path d="M355,80 C400,80 400,200 440,200" style="stroke:var(--muted);stroke-width:2;fill:none" marker-end="url(#dda)"/>
  <text class="s" x="372" y="150">described by</text>
  <text class="h" x="20" y="186">Data dictionary — the metadata</text>
  <rect class="hd" x="20" y="196" width="720" height="28" rx="4"/>
  <text class="h" x="30" y="215">Field</text><text class="h" x="145" y="215">Type</text><text class="h" x="235" y="215">Size</text><text class="h" x="290" y="215">Format</text><text class="h" x="400" y="215">Key</text><text class="h" x="450" y="215">Validation</text><text class="h" x="610" y="215">Example</text>
  <rect class="row" x="20" y="226" width="720" height="26"/><text class="c" x="30" y="244">StudentID</text><text class="c" x="145" y="244">Text</text><text class="c" x="235" y="244">5</text><text class="c" x="290" y="244">S0000</text><text class="c" x="400" y="244">PK</text><text class="c" x="450" y="244">presence, format</text><text class="c" x="610" y="244">S0412</text>
  <rect class="row" x="20" y="254" width="720" height="26"/><text class="c" x="30" y="272">Surname</text><text class="c" x="145" y="272">Text</text><text class="c" x="235" y="272">30</text><text class="c" x="290" y="272">—</text><text class="c" x="400" y="272">—</text><text class="c" x="450" y="272">presence</text><text class="c" x="610" y="272">Bekova</text>
  <rect class="row" x="20" y="282" width="720" height="26"/><text class="c" x="30" y="300">DateOfBirth</text><text class="c" x="145" y="300">Date</text><text class="c" x="235" y="300">10</text><text class="c" x="290" y="300">DD/MM/YYYY</text><text class="c" x="400" y="300">—</text><text class="c" x="450" y="300">range 2005–2012</text><text class="c" x="610" y="300">14/03/2009</text>
  <text class="s" x="20" y="324">one row of the dictionary for every field of every table</text>
</svg>
:::

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

The data dictionary also records information about each **table**: its name, what it stores, its primary key and how it is linked to other tables (the relationships from the ERD).

## Data types in a data dictionary

:::compare Common data types
| Data type | Stores | Example field | Example value |
|---|---|---|---|
| **Text / VARCHAR(n)** | Letters, digits and symbols, up to *n* characters | `Surname` VARCHAR(30) | Bekova |
| **CHAR(n)** | Text of a **fixed** length | `ClassCode` CHAR(3) | 11A |
| **Integer** | Whole numbers | `Quantity` | 12 |
| **Real / Decimal** | Numbers with a fractional part | `Price` DECIMAL(6,2) | 1499.50 |
| **Date / Time** | Calendar dates and times | `LoanDate` | 05/11/2026 |
| **Boolean** | Only True or False | `Returned` | False |
:::

:::warning Phone numbers are text
A phone number such as `+7 701 234 56 78` is stored as **Text**, not as a number: it can start with `+` or `0`, contains spaces, and nobody does arithmetic with it.
:::

## Naming fields

:::cards
### Good field names
- **No spaces** — `DateOfBirth` or `date_of_birth`, not `Date of birth`.
- **Meaningful** — `Surname`, not `Field3` or `S`.
- **One style** for the whole database (e.g. CamelCase everywhere).
- **The same name** for the same data in every table — `StudentID` in `Students` and in `Loans`.
### Why it matters
- Programmers write field names in SQL and code; spaces and different spellings cause errors.
- Matching names make the links between tables (primary key → foreign key) easy to see.
- The data dictionary is the place where these names are **agreed and written down**.
:::

## When the data dictionary is written

:::svg The data dictionary is created at the design stage and kept up to date
<svg class="dd" viewBox="0 0 760 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SDLC stages with the data dictionary created at design and updated in maintenance">
  <style>
    svg.dd .st{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dd .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dd .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dd .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dd .ar{fill:var(--muted)}
  </style>
  <rect class="st" x="10" y="30" width="130" height="56" rx="10"/><text class="tt" x="75" y="63" text-anchor="middle">Analysis</text>
  <path class="ar" d="M146,52 l12,6 l-12,6 z"/>
  <rect class="on" x="164" y="30" width="130" height="56" rx="10"/><text class="tt" x="229" y="63" text-anchor="middle" style="fill:var(--primary)">Design</text>
  <path class="ar" d="M300,52 l12,6 l-12,6 z"/>
  <rect class="st" x="318" y="30" width="130" height="56" rx="10"/><text class="tt" x="383" y="63" text-anchor="middle">Development</text>
  <path class="ar" d="M454,52 l12,6 l-12,6 z"/>
  <rect class="st" x="472" y="30" width="130" height="56" rx="10"/><text class="tt" x="537" y="63" text-anchor="middle">Testing</text>
  <path class="ar" d="M608,52 l12,6 l-12,6 z"/>
  <rect class="on" x="626" y="30" width="124" height="56" rx="10"/><text class="tt" x="688" y="63" text-anchor="middle" style="fill:var(--primary)">Maintenance</text>
  <text class="ss" x="229" y="110" text-anchor="middle">ERD + data dictionary</text>
  <text class="ss" x="229" y="128" text-anchor="middle">are written</text>
  <text class="ss" x="383" y="110" text-anchor="middle">tables are built</text>
  <text class="ss" x="383" y="128" text-anchor="middle">from the dictionary</text>
  <text class="ss" x="537" y="110" text-anchor="middle">test data comes from</text>
  <text class="ss" x="537" y="128" text-anchor="middle">the validation rules</text>
  <text class="ss" x="688" y="110" text-anchor="middle">the dictionary is</text>
  <text class="ss" x="688" y="128" text-anchor="middle">updated with changes</text>
</svg>
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

:::svg Without a data dictionary: two programmers, two different keys
<svg class="dd" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="StudentID is Text in Students but Integer in Loans, so the tables cannot be joined">
  <style>
    svg.dd .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dd .hh{font:700 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.dd .cc{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.dd .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.dd .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.dd .tx{font:600 13px system-ui,sans-serif}
  </style>
  <rect class="bx" x="20" y="20" width="250" height="130" rx="10"/>
  <text class="hh" x="35" y="46">Students (programmer A)</text>
  <rect class="bad" x="35" y="60" width="220" height="30" rx="5"/><text class="cc" x="45" y="80">StudentID  Text(5)  "S0412"</text>
  <text class="cc" x="45" y="112">Surname    Text(30)</text>
  <rect class="bx" x="490" y="20" width="250" height="130" rx="10"/>
  <text class="hh" x="505" y="46">Loans (programmer B)</text>
  <text class="cc" x="515" y="80">LoanID     Integer</text>
  <rect class="bad" x="505" y="94" width="220" height="30" rx="5"/><text class="cc" x="515" y="114">Student_ID Integer 412</text>
  <path d="M255,75 C380,75 380,109 505,109" style="stroke:var(--danger);stroke-width:2.5;fill:none;stroke-dasharray:6 5"/>
  <circle cx="380" cy="92" r="16" style="fill:var(--danger)"/><text x="380" y="98" text-anchor="middle" style="font:800 18px system-ui;fill:#fff">✕</text>
  <text class="tx" x="380" y="175" text-anchor="middle" style="fill:var(--danger)">different name, type and value — the tables cannot be linked</text>
  <rect class="ok" x="150" y="190" width="460" height="30" rx="6"/>
  <text class="tx" x="380" y="210" text-anchor="middle" style="fill:var(--success)">with a data dictionary: StudentID · Text(5) · format S0000 in both tables</text>
</svg>
:::

:::example What goes wrong without a data dictionary
A school's database was built by two programmers who did not agree on the fields:
- `StudentID` is **Text** in one table and **Integer** in another — the tables cannot be joined, so loan reports show no names.
- One form saves dates as `05/11/2026`, another as `2026-11-05` — searches by date miss half the records.
- Nobody wrote down that `Mark` must be 0–100 — a mark of `750` was typed and the class average became wrong.
- A new programmer has to read all the code to guess what `Fld7` means.

A data dictionary written at the design stage prevents every one of these problems.
:::

:::compare Active and passive data dictionaries
| | Active (system catalogue) | Passive (document) |
|---|---|---|
| Kept by | The **DBMS itself** | People — analysts, designers |
| Updated | **Automatically** when a table is changed | **By hand** — may become out of date |
| Contains | Table and field definitions, keys, indexes, user permissions | Field descriptions, examples, validation rules in plain language |
| Example | `information_schema` in MySQL / PostgreSQL | A table in the design documentation |
:::

:::compare Data dictionary, ERD and database
| | ERD | Data dictionary | Database |
|---|---|---|---|
| What it is | A **diagram** of entities and relationships | A **description** of every field | The real **tables with the data** |
| Shows | Which tables exist and how they are linked (1:1, 1:M) | Name, type, size, format, key, validation of each field | Records and values |
| Made when | Design | Design (after the ERD) | Development, then used every day |
:::

# Exam practice: what a data dictionary is
@lo 11.4.1.5

:::example Exam-style answers
**Q: Define the term data dictionary. [1]**
A document / table that describes the structure of a database — the fields of every table with their data types, sizes, formats, keys and validation (data about the data / metadata) (1).

**Q: State three items stored in a data dictionary for each field. [3]**
Any three: field name, data type, field size, format, key (PK / FK), validation rule, description, example value.

**Q: Explain two reasons why a data dictionary is used. [4]**
It gives **consistent definitions**, so the same field has the same name and type in every table (1) and keys between tables match / the tables can be linked (1). It records **validation rules** (1), so invalid data is rejected and data integrity improves (1). *(Also: helps programmers build the database; helps maintenance / new developers.)*

**Q: Explain why a phone number is stored as text. [2]**
It may begin with `0` or `+` and contain spaces, which a number field would lose / not allow (1); no calculations are done with it (1).
:::

:::warning Common mistakes
- Writing that a data dictionary **stores the data** — it stores **metadata**, the description of the data.
- Listing only "name and type" — exam answers expect **size, format, key, validation** too.
- Vague reasons like "it organises the database" — say **who** it helps and **what problem** it prevents.
:::

# Validation in a data dictionary
@lo 11.4.1.6

:::definition Validation
An **automatic check made by the computer when data is entered**, to make sure the data is **sensible, reasonable and follows the rules** before it is stored. Data that breaks a rule is **rejected** and the user sees an **error message**.
:::

:::definition Validation rule
The rule a field's data must satisfy, written in the **data dictionary** for every field, e.g. "Mark: whole number from 0 to 100". The DBMS (or the program) then applies it to every value that is entered.
:::

:::svg Every value is checked against the rules in the data dictionary before it is saved
<svg class="dd" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Data entry goes through the validation rules from the data dictionary; valid data is saved, invalid data is rejected with an error message">
  <style>
    svg.dd .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dd .rl{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dd .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.dd .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.dd .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dd .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dd .mo{font:12px ui-monospace,monospace;fill:var(--foreground)}
    svg.dd .ar{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.dd .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="70" width="150" height="70" rx="10"/>
  <text class="tt" x="85" y="98" text-anchor="middle">Data entered</text>
  <text class="mo" x="85" y="120" text-anchor="middle">Mark = 870</text>
  <path class="ar" d="M162,105 H232"/><path class="ah" d="M232,99 l12,6 l-12,6 z"/>
  <rect class="rl" x="246" y="40" width="230" height="130" rx="12"/>
  <text class="tt" x="361" y="66" text-anchor="middle" style="fill:var(--primary)">Validation rules</text>
  <text class="ss" x="361" y="84" text-anchor="middle">from the data dictionary</text>
  <text class="mo" x="262" y="110">Type:  whole number</text>
  <text class="mo" x="262" y="130">Range: 0 to 100</text>
  <text class="mo" x="262" y="150">Presence: required</text>
  <path class="ar" d="M478,80 C520,80 520,50 560,50"/><path class="ah" d="M560,44 l12,6 l-12,6 z"/>
  <path class="ar" d="M478,130 C520,130 520,160 560,160"/><path class="ah" d="M560,154 l12,6 l-12,6 z"/>
  <rect class="ok" x="574" y="22" width="176" height="56" rx="10"/>
  <text class="tt" x="662" y="46" text-anchor="middle" style="fill:var(--success)">Valid → saved</text>
  <text class="ss" x="662" y="65" text-anchor="middle">e.g. Mark = 87</text>
  <rect class="no" x="574" y="132" width="176" height="56" rx="10"/>
  <text class="tt" x="662" y="156" text-anchor="middle" style="fill:var(--danger)">Invalid → rejected</text>
  <text class="ss" x="662" y="175" text-anchor="middle">"Mark must be 0–100"</text>
</svg>
:::

:::compare Validation checks
| Check | What it checks | Example rule | Accepted | Rejected |
|---|---|---|---|---|
| **Presence check** | The field is **not left empty** | Surname must be entered | Bekova | *(empty)* |
| **Range check** | The value is **between a lower and an upper limit** | Mark 0–100 | 0, 57, 100 | −1, 101 |
| **Type check** | The data is of the **correct data type** | Quantity is a whole number | 12 | twelve, 7.5 |
| **Length check** | The number of **characters** is allowed | Password 8–16 characters | Kz2026!pass | abc |
| **Format (picture) check** | The data matches a **pattern** | StudentID = `S` + 4 digits | S0421 | 0421S, S42 |
| **Lookup (list) check** | The value is in a **list of allowed values** | Grade is 11 or 12 | 11 | 10 |
| **Uniqueness check** | No other record has the **same value** | StudentID, e-mail | S0603 | S0421 (already used) |
:::

:::widget validation_checker Test the validation rules of a Students table
:::

## Choosing the right check

:::compare Which checks suit which field
| Field | Data type | Suitable checks | Why |
|---|---|---|---|
| StudentID | VARCHAR(5) | Presence, format, uniqueness | It is the primary key: it must exist, follow the pattern and never repeat |
| Surname | VARCHAR(30) | Presence, length (≤ 30) | Every pupil has a surname; it must fit the field |
| Mark | INTEGER | Type, range 0–100 | A mark is a whole number within known limits |
| DateOfBirth | DATE | Format DD/MM/YYYY, range | Pupils in grades 11–12 were born in a known period |
| Grade | INTEGER | Lookup: 11 or 12 | Only a few allowed values |
| Email | VARCHAR(50) | Format (contains @ and a dot), uniqueness | An address has a pattern; two pupils cannot share it |
| Phone | VARCHAR(12) | Length 12, format `+7` + 10 digits | A phone number has a fixed pattern |
:::

:::example Combining several checks on one field
The rule for `StudentID` in the data dictionary is **"Presence; format `S` + 4 digits; unique"** — three checks together:
- empty → rejected by the **presence check**;
- `S42` → rejected by the **format check**;
- `S0421` when another pupil already has it → rejected by the **uniqueness check**;
- `S0603` → passes all three and is saved.
:::

:::tip Good error messages
A good error message says **what is wrong and how to correct it**: "Mark must be a whole number from 0 to 100" — not "Error 23" or "Invalid input". The data dictionary records the rule, so the programmer knows exactly what to write.
:::

:::warning Choose a check that matches the data
- A **range check** works on numbers and dates — not on a surname.
- A **lookup check** is for a short list of allowed values — not for 8 000 book titles.
- A **length check** on a phone number does not stop letters — add a **format check**.
:::

## Validation and verification

:::definition Verification
Checking that the data entered is **the same as the original** (the source document), so that **copying mistakes** are found. Methods: **double entry** (the data is typed twice and the computer compares the two) and **visual check** (proofreading the screen against the paper form).
:::

:::compare Validation and verification
| | Validation | Verification |
|---|---|---|
| Question it answers | Is the data **sensible / allowed**? | Was the data **copied correctly**? |
| Who / what checks | The computer, using the rules | The computer compares two entries, or a person compares with the source |
| Methods | Presence, range, type, length, format, lookup, uniqueness | Double entry, visual check (proofreading) |
| Example it catches | Mark 870 (out of range) | Mark 78 typed instead of 87 |
| Example it misses | Mark 78 typed instead of 87 | A wrong value on the original form |
:::

:::warning Validation is not verification
**Validation** checks that data is **sensible / reasonable** (it follows the rules). It cannot check that the data is **correct** — "15/04/2009" passes a date check even if the pupil was born on 14/04/2009. To find such mistakes, data is also **verified**.
:::

## Testing a validation rule

:::definition Test data
Values chosen to check that a validation rule works: **normal** data (valid, should be accepted), **boundary** (extreme) data (on the edge of the range, should be accepted) and **erroneous** (invalid) data (should be rejected). Testers take the rules from the data dictionary.
:::

:::example Test data for the rule "Mark: whole number from 0 to 100"
| Type of test data | Values | Expected result |
|---|---|---|
| Normal | 45, 87 | Accepted |
| Boundary (extreme) | 0, 100 | Accepted |
| Just outside the boundary | −1, 101 | Rejected — "Mark must be 0–100" |
| Erroneous | abc, 7.5, *(empty)* | Rejected |
:::

## Validation rules in SQL

:::compare How rules from the data dictionary are written in SQL
| Rule in the data dictionary | SQL |
|---|---|
| Presence (required) | `NOT NULL` |
| Uniqueness | `UNIQUE` (a `PRIMARY KEY` is unique and not null) |
| Range | `CHECK (Mark BETWEEN 0 AND 100)` |
| Lookup | `CHECK (Grade IN (11, 12))` |
| Type and length | the data type, e.g. `INTEGER`, `VARCHAR(30)` |
| Must exist in another table | `FOREIGN KEY (StudentID) REFERENCES Students(StudentID)` |
:::

```sql | Validation rules from the data dictionary in a CREATE TABLE statement
CREATE TABLE Results (
    ResultID   INTEGER     PRIMARY KEY,
    StudentID  VARCHAR(5)  NOT NULL,
    Subject    VARCHAR(20) NOT NULL,
    Mark       INTEGER     CHECK (Mark BETWEEN 0 AND 100),
    Term       INTEGER     CHECK (Term IN (1, 2, 3, 4)),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);
```

# Creating a data dictionary
@lo 11.4.1.6

:::svg From the description of the system to the tables of the database
<svg class="dd" viewBox="0 0 760 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Description, then ERD, then data dictionary, then SQL tables">
  <style>
    svg.dd .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dd .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.dd .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dd .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.dd .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="25" width="160" height="70" rx="10"/><text class="tt" x="90" y="55" text-anchor="middle">Description</text><text class="ss" x="90" y="75" text-anchor="middle">what the client needs</text>
  <path class="ah" d="M178,54 l12,6 l-12,6 z"/>
  <rect class="bx" x="198" y="25" width="160" height="70" rx="10"/><text class="tt" x="278" y="55" text-anchor="middle">ERD</text><text class="ss" x="278" y="75" text-anchor="middle">tables and links</text>
  <path class="ah" d="M366,54 l12,6 l-12,6 z"/>
  <rect class="on" x="386" y="25" width="180" height="70" rx="10"/><text class="tt" x="476" y="55" text-anchor="middle" style="fill:var(--primary)">Data dictionary</text><text class="ss" x="476" y="75" text-anchor="middle">every field described</text>
  <path class="ah" d="M574,54 l12,6 l-12,6 z"/>
  <rect class="bx" x="594" y="25" width="156" height="70" rx="10"/><text class="tt" x="672" y="55" text-anchor="middle">SQL tables</text><text class="ss" x="672" y="75" text-anchor="middle">CREATE TABLE …</text>
  <text class="ss" x="380" y="128" text-anchor="middle">Design stage: the data dictionary is written after the ERD and before the tables are built</text>
</svg>
:::

:::steps How to create a data dictionary
- List the **tables** of the database (from the ERD); link tables for M:M relationships are tables too.
- For each table, list every **field** with a clear name (no spaces, one style, the same name in every table).
- Choose the most suitable **data type** and **size** for each field.
- Mark the **primary key** and any **foreign keys** (a foreign key must have the **same type and size** as the primary key it refers to).
- Add a **validation rule** for each field, a **format** where needed (dates, codes), a short **description** and an **example** that fits the type and the rule.
- **Check** the entries: does every example pass its own validation rule? Do the keys match?
:::

## Choosing data types and sizes

:::compare Choosing a data type
| The value is … | Data type | Example field |
|---|---|---|
| A whole number used in calculations | INTEGER | Quantity, Copies, Age |
| A number with a fractional part (money, measurements) | DECIMAL(p,s) / REAL | Price DECIMAL(8,2), Height |
| A code or number not used in calculations | VARCHAR(n) | Phone, PostCode, ISBN, StudentID S0421 |
| Text of a fixed length | CHAR(n) | ClassCode CHAR(3) = 11A, Gender CHAR(1) |
| Text of different lengths | VARCHAR(n) | Surname, Title, Email |
| A date or time | DATE / TIME | DateOfBirth, LoanDate, StartTime |
| Only two values (yes / no) | BOOLEAN | Paid, Returned, IsActive |
:::

:::cards
### VARCHAR(n)
- n is the **maximum** number of characters.
- Choose it from the **longest real value** with a little spare room: Surname → 30, Email → 50.
### CHAR(n)
- Always **exactly n** characters.
- Use it only when every value has the same length: ClassCode CHAR(3), Gender CHAR(1).
### DECIMAL(p,s)
- **p** digits in total, **s** of them after the point.
- DECIMAL(6,2) stores up to **9999.99**; money usually has 2 decimal places.
### INTEGER, DATE, BOOLEAN
- The size is fixed by the DBMS.
- The data dictionary leaves the size empty or writes "—".
:::

:::warning Keys must match
A foreign key is a copy of a primary key, so it has **exactly the same data type and size**: if `StudentID` is VARCHAR(5) in `Students`, it is VARCHAR(5) in `Loans` too. An **auto-increment** (AutoNumber) primary key is INTEGER, so the foreign key that refers to it is INTEGER as well.
:::

## A worked example

:::example From a description to a data dictionary — a sports centre
**Description:** "Each member has a member number such as M0042, a surname, a date of birth (members must be at least 10), a phone number and the date they joined. We record whether the member is a student, because students pay less. The monthly fee is in tenge, e.g. 8500.50."

**Thinking:** member number has a letter → VARCHAR, format check, primary key; the fee has kopecks → DECIMAL; "whether" → BOOLEAN; "at least 10" → range check on the date of birth.

| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| MemberID | VARCHAR | 5 | PK | Presence; format `M` + 4 digits; unique | Member number | M0042 |
| Surname | VARCHAR | 30 | | Presence; length ≤ 30 | Member's family name | Seitkali |
| DateOfBirth | DATE | — | | Format DD/MM/YYYY; age at least 10 | Date of birth | 21/06/2011 |
| Phone | VARCHAR | 12 | | Length 12; format `+7` + 10 digits | Contact phone | +77051112233 |
| JoinDate | DATE | — | | Presence; not in the future | Date the member joined | 01/09/2026 |
| IsStudent | BOOLEAN | — | | True / False | Pays the student fee? | True |
| MonthlyFee | DECIMAL | 8,2 | | Range > 0 | Fee per month in tenge | 8500.50 |
:::

:::example Data dictionary for a school library — table `Students`
| Field name | Data type | Size | Key | Validation | Description | Example |
|---|---|---|---|---|---|---|
| StudentID | VARCHAR | 5 | PK | Presence; format `S` + 4 digits; unique | Unique student number | S0421 |
| FirstName | VARCHAR | 30 | | Presence | Student's first name | Aruzhan |
| Surname | VARCHAR | 30 | | Presence | Student's family name | Bekova |
| Grade | INTEGER | — | | Lookup: 11 or 12 | School grade | 11 |
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
| ReturnDate | DATE | — | | On or after LoanDate (may be empty) | Date returned | 16/10/2026 |
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

:::warning Common mistakes when creating a data dictionary
- INTEGER for a phone number or an ID with letters or leading zeros (0421 becomes 421).
- A size that does not fit the data: CHAR(8) for a date written DD/MM/YYYY (10 characters) — use DATE.
- A validation rule that contradicts the type: "only digits" for a VARCHAR surname, "only integer" for a text ID.
- An example that breaks its own rule: range 2005–2012 with example 11/09/2004.
- Marking an ordinary field (DateOfBirth, FilmTitle) as a **foreign key** — a foreign key always refers to the primary key of another table.
- A range as the example ("16/11/2026–31/12/2026"): the example is **one typical value**.
:::

# Exam practice and summary
@lo 11.4.1.5 11.4.1.6

:::example Exam-style answers
**Q: Explain the purpose of a data dictionary. [2]**
It **describes every field** of the database — name, data type, size, validation (1) — so that programmers **build the database consistently and correctly** and it is easier to **maintain** later (1).

**Q: Identify a suitable validation check for the field `Grade`, which can only be 11 or 12. [1]**
**Lookup (list) check** — the value must be in the list 11, 12.

**Q: Complete the data dictionary entry for the field `Price`. [3]**
Data type: **Decimal / Real** (1); validation: **range check > 0** (1); example: **450.00** (1).

**Q: The field `Mark` has the rule "0 to 100". Give one item of boundary data and one item of erroneous data. [2]**
Boundary: **0** or **100** (1). Erroneous: **101 / −5 / abc** (1).

**Q: Explain why a validated mark can still be wrong. [2]**
Validation only checks that the mark is **sensible / within the rules** (1); a typing mistake inside the range, e.g. **78 instead of 87**, is accepted — **verification** (double entry / visual check) is needed (1).

**Q: State why a foreign key must have the same data type and size as the primary key it refers to. [1]**
So that the values **match** and the tables can be **linked** (joined) correctly.
:::

:::warning Common mistakes
- Using INTEGER for phone numbers or IDs with letters or leading zeros.
- Writing validation that does not match the data (a range check on a name).
- Confusing **validation** (sensible?) with **verification** (copied correctly?).
- Giving a description that just repeats the field name ("Surname — the surname").
- Forgetting to mark **primary** and **foreign** keys.
- Confusing a data dictionary with a **user guide** — it is **technical** documentation.
:::

:::steps Check yourself
- What is a data dictionary and when is it created?
- List eight items recorded for each field.
- Give three reasons for using a data dictionary.
- Name seven validation checks with an example of each.
- Explain the difference between validation and verification; name two verification methods.
- Give normal, boundary and erroneous test data for "Age 10–18".
- Create a data dictionary for `Products(ProductID, Name, Price, InStock, CategoryID)`.
:::
