---
summary: Building the multi-table database of a project — from the design documents to SQL tables with keys, constraints and test data.
---
# Developing the project database
@lo 11.4.1.11

:::steps From design to a working database
- Start from the **ERD** and **data dictionary** produced in the design stage.
- Choose a **DBMS** (MySQL, PostgreSQL, SQLite, MS Access) and create the database.
- Create the tables **in dependency order**: tables without foreign keys first.
- Add **constraints**: `PRIMARY KEY`, `FOREIGN KEY … REFERENCES`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`.
- Insert **test data** covering normal, boundary and erroneous cases.
- Write and test the **queries** the system needs (searches, reports, updates).
- Document the structure (screenshots of the table design, the SQL script).
:::

```sql | Online shop database (3 related tables)
CREATE TABLE Customer (
  CustomerID INT AUTO_INCREMENT PRIMARY KEY,
  FullName   VARCHAR(60) NOT NULL,
  Phone      VARCHAR(15) UNIQUE,
  City       VARCHAR(30) DEFAULT 'Astana'
);

CREATE TABLE Product (
  ProductCode VARCHAR(8) PRIMARY KEY,
  Name        VARCHAR(60) NOT NULL,
  Price       DECIMAL(10,2) CHECK (Price > 0),
  InStock     INT DEFAULT 0
);

CREATE TABLE OrderItem (
  OrderID     INT,
  ProductCode VARCHAR(8),
  CustomerID  INT,
  Quantity    INT CHECK (Quantity BETWEEN 1 AND 100),
  OrderDate   DATE,
  PRIMARY KEY (OrderID, ProductCode),
  FOREIGN KEY (ProductCode) REFERENCES Product(ProductCode),
  FOREIGN KEY (CustomerID)  REFERENCES Customer(CustomerID)
);
```

:::compare Constraints and what they protect
| Constraint | Protects against |
|---|---|
| `PRIMARY KEY` | Duplicate or missing identifiers |
| `FOREIGN KEY` | Orphan records — an order for a product that does not exist (**referential integrity**) |
| `NOT NULL` | Missing required data |
| `UNIQUE` | Two customers with the same phone number |
| `CHECK` | Impossible values (negative price) |
| `DEFAULT` | Empty fields when a sensible default exists |
:::

```sql | Test data and a test query
INSERT INTO Customer (FullName, Phone) VALUES ('Asel Nurlanova', '+77011234567');
INSERT INTO Product VALUES ('AB102', 'Apple juice', 850.00, 40);
INSERT INTO OrderItem VALUES (1, 'AB102', 1, 3, '2026-10-14');

-- Erroneous test: must be rejected by the CHECK constraint
INSERT INTO Product VALUES ('ZZ001', 'Broken', -5, 1);

SELECT c.FullName, p.Name, o.Quantity, p.Price * o.Quantity AS Total
FROM OrderItem o
JOIN Customer c ON c.CustomerID = o.CustomerID
JOIN Product  p ON p.ProductCode = o.ProductCode;
```

:::tip
In the project write-up, show evidence: the **CREATE TABLE** code or table design screenshots, the **relationships** diagram, and **test results** proving that the constraints reject invalid data.
:::
