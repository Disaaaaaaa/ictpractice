---
summary: What a data dictionary is, why it is used in system design, and how to create one for database tables.
---
# The purpose of a data dictionary
@lo 11.4.1.5

:::definition Data dictionary
A document (or table) that describes **every data item** in a system or database: its name, data type, size, format, description, validation rules, keys and relationships. It is "data about data" (**metadata**).
:::

## Why a data dictionary is created

- Gives developers a **single, consistent reference** for every field — everyone uses the same names and types.
- Helps to **design and build the database** correctly (types, sizes, keys).
- Defines **validation rules**, which keeps data accurate.
- Makes the system easier to **maintain and extend** later, even by new developers.
- Avoids **duplication and inconsistency** of data items.
- Forms part of the **technical documentation**.

:::tip
"Name two elements described in a data dictionary": **field name**, **data type**, **field size/length**, **format**, **description**, **validation rule**, **primary/foreign key**, **example value**.
:::

# Creating a data dictionary
@lo 11.4.1.6

:::compare Data dictionary for the table Students
| Field name | Data type | Size | Format / example | Key | Validation | Description |
|---|---|---|---|---|---|---|
| StudentID | VARCHAR | 6 | S00123 | PK | Presence; format: S + 5 digits | Unique student number |
| FirstName | VARCHAR | 30 | Aruzhan | | Presence check | First name |
| LastName | VARCHAR | 30 | Sadykova | | Presence check | Family name |
| DateOfBirth | DATE | | DD/MM/YYYY | | Range: 2005–2012 | Date of birth |
| Grade | INTEGER | | 11 | | Range 7–12 | Current grade |
| Email | VARCHAR | 50 | a.sad@nis.edu.kz | | Format check (contains @) | School email |
| ClassID | VARCHAR | 4 | 11A | FK → Class | Lookup: must exist in Class | Student's class |
| HasLaptop | BOOLEAN | | TRUE/FALSE | | | Whether the student owns a laptop |
:::

:::compare Choosing data types
| Data | Type | Why |
|---|---|---|
| Names, addresses | VARCHAR(n) / text | Letters and symbols |
| Phone numbers, IIN, postcodes | VARCHAR | Contain leading zeros/"+", no arithmetic is done on them |
| Age, quantity | INTEGER | Whole numbers used in calculations |
| Price, average mark | DECIMAL / REAL | Numbers with a fractional part |
| Date of birth, order date | DATE | Allows sorting and date arithmetic |
| Yes/no answers | BOOLEAN | Only two values |
:::

:::warning
A phone number is **text**, not an integer: it can start with 0 or +, and you never add or multiply phone numbers.
:::

:::compare Common validation rules
| Check | Example |
|---|---|
| Presence | StudentID must not be empty |
| Range | Grade between 7 and 12 |
| Length | Password at least 8 characters |
| Type | Age must be a whole number |
| Format | Email contains "@" and "."; ID = letter + 5 digits |
| Lookup | ClassID must exist in the Class table |
:::
