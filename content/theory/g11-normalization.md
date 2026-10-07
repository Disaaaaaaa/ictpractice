---
summary: The rules of first, second and third normal form, normalising a table step by step to 3NF, and creating a multi-table database for a new system.
---
# Normalisation rules: 1NF, 2NF, 3NF
@lo 11.4.1.9

:::definition Normalisation
The process of organising data into tables so that **redundancy (repetition) is reduced** and **data integrity is improved**, by applying the rules of the normal forms.
:::

:::cards
### First normal form (1NF)
- Every field contains **atomic (single) values** — no lists in one cell.
- **No repeating groups** of fields (e.g. Course1, Course2, Course3).
- Each table has a **primary key**.
### Second normal form (2NF)
- The table is in **1NF**, and
- every non-key field depends on the **whole** primary key, **not just part** of a composite key (no **partial dependencies**).
### Third normal form (3NF)
- The table is in **2NF**, and
- no non-key field depends on **another non-key field** (no **transitive dependencies**). "Every non-key field depends on the key, the whole key and nothing but the key."
:::

:::tip
A table with a **single-field** primary key that is in 1NF is automatically in 2NF — partial dependency is only possible with a composite key.
:::

# Normalising a table to 3NF
@lo 11.4.1.10

:::compare Un-normalised: Orders
| OrderID | OrderDate | CustomerID | CustomerName | CustomerCity | Products |
|---|---|---|---|---|---|
| 101 | 02/10/2026 | C7 | Asel | Astana | P1 Pen ×3, P4 Notebook ×1 |
| 102 | 03/10/2026 | C2 | Bolat | Almaty | P1 Pen ×10 |
:::

## Step 1 — 1NF: remove repeating groups

The *Products* cell holds several values. Give each product its own row and create a key (OrderID, ProductID).

:::compare 1NF: OrderLines
| OrderID | ProductID | ProductName | Quantity | OrderDate | CustomerID | CustomerName | CustomerCity |
|---|---|---|---|---|---|---|---|
| 101 | P1 | Pen | 3 | 02/10/2026 | C7 | Asel | Astana |
| 101 | P4 | Notebook | 1 | 02/10/2026 | C7 | Asel | Astana |
| 102 | P1 | Pen | 10 | 03/10/2026 | C2 | Bolat | Almaty |
:::

## Step 2 — 2NF: remove partial dependencies

The key is (OrderID, ProductID). *ProductName* depends only on ProductID; *OrderDate* and the customer fields depend only on OrderID. Move them into their own tables.

- **Product**(**ProductID**, ProductName)
- **Order**(**OrderID**, OrderDate, CustomerID, CustomerName, CustomerCity)
- **OrderLine**(**OrderID, ProductID**, Quantity)

## Step 3 — 3NF: remove transitive dependencies

In *Order*, CustomerName and CustomerCity depend on **CustomerID**, which is not the key → move them.

:::compare Final 3NF design
| Table | Fields (PK in bold, FK in italics) |
|---|---|
| Customer | **CustomerID**, CustomerName, CustomerCity |
| Order | **OrderID**, OrderDate, *CustomerID* |
| Product | **ProductID**, ProductName |
| OrderLine | ***OrderID*, *ProductID***, Quantity |
:::

:::mermaid Relationships after normalisation
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ ORDERLINE : contains
  PRODUCT ||--o{ ORDERLINE : "appears in"
:::

:::compare Benefits and drawbacks of normalisation
| Benefits | Drawbacks |
|---|---|
| Less redundant data → less storage | More tables to manage |
| No update anomalies — change a customer's city once | Queries need **joins**, which can be slower |
| Better data integrity and consistency | Design takes more time and skill |
:::

# Creating a multi-table database for a new system
@lo 11.4.1.11

:::steps Designing the database for a new system
- Identify the **entities** from the requirements (e.g. Student, Book, Loan for a library).
- List the **attributes** of each entity; choose **primary keys**.
- Decide the **relationships** and draw an **ERD**; resolve M:M with link tables.
- **Normalise** each table to 3NF.
- Write the **data dictionary** (types, sizes, validation).
- Create the tables with SQL **CREATE TABLE**, including PRIMARY KEY and FOREIGN KEY constraints.
- Insert test data and check queries return the right results.
:::

```sql | Library database in 3NF
CREATE TABLE Student (
  StudentID VARCHAR(6) PRIMARY KEY,
  Name      VARCHAR(40) NOT NULL,
  Grade     INT
);
CREATE TABLE Book (
  BookID VARCHAR(8) PRIMARY KEY,
  Title  VARCHAR(100) NOT NULL,
  Author VARCHAR(60)
);
CREATE TABLE Loan (
  LoanID    INT PRIMARY KEY,
  StudentID VARCHAR(6) REFERENCES Student(StudentID),
  BookID    VARCHAR(8) REFERENCES Book(BookID),
  LoanDate  DATE,
  ReturnDate DATE
);
```
