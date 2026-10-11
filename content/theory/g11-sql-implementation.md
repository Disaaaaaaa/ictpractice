---
summary: Implementing the SQL part of a project — the related tables of an online shop, inserting a new order and its items from program code (prepared statements, the new ID, loops, updating stock), and extracting data from several tables with joins in WHERE and INNER JOIN, aliases, three- and four-table queries, aggregate functions with GROUP BY, LEFT JOIN and displaying the results.
---
# The project database
@lo 11.5.4.7 11.5.4.8

The examples on this page use the database of a small **online shop**. It is normalised into four related tables: one order has **many** order items, and each item refers to one product.

:::compare Customer
| CustomerID (PK) | FullName | City |
|---|---|---|
| 1 | Asel Nurlanova | Astana |
| 2 | Bauyrzhan Seitov | Almaty |
| 3 | Dana Kim | Astana |
:::

:::compare Product
| ProductCode (PK) | Name | Price | InStock |
|---|---|---|---|
| AB102 | Apple juice | 850 | 40 |
| CD210 | Notebook | 1200 | 25 |
| EF305 | Pen | 300 | 100 |
:::

:::compare Orders and OrderItem
| Orders: OrderID (PK) | CustomerID (FK) | OrderDate |
|---|---|---|
| 101 | 1 | 2026-10-02 |
| 102 | 2 | 2026-10-05 |
| 103 | 1 | 2026-10-07 |

| OrderItem: OrderID (PK, FK) | ProductCode (PK, FK) | Quantity |
|---|---|---|
| 101 | AB102 | 3 |
| 101 | EF305 | 2 |
| 102 | CD210 | 1 |
| 103 | CD210 | 2 |
| 103 | AB102 | 1 |
:::

:::ascii Relationships
  CUSTOMER 1 ───< ORDERS 1 ───< ORDERITEM >─── 1 PRODUCT
  (CustomerID)     (OrderID)     (OrderID, ProductCode)   (ProductCode)
:::

# Adding data from program code
@lo 11.5.4.7

Saving an order from the shop's web page takes **several** SQL statements: one row in **Orders**, then **one row per product** in **OrderItem**, and an update of the **stock**.

```php | save_order.php — one order, several items
<?php
include "db.php";                                   // $conn = mysqli_connect(...)

$customerId = (int)$_POST["customer"];
$products   = $_POST["product"] ?? [];              // e.g. ["AB102", "CD210"]
$quantities = $_POST["qty"] ?? [];                  // e.g. [3, 1]

// 1 the order header
$stmt = mysqli_prepare($conn, "INSERT INTO Orders (CustomerID, OrderDate) VALUES (?, CURDATE())");
mysqli_stmt_bind_param($stmt, "i", $customerId);
mysqli_stmt_execute($stmt);
$orderId = mysqli_insert_id($conn);                 // the new auto-increment OrderID

// 2 one row per product, 3 reduce the stock
$item  = mysqli_prepare($conn, "INSERT INTO OrderItem (OrderID, ProductCode, Quantity) VALUES (?, ?, ?)");
$stock = mysqli_prepare($conn, "UPDATE Product SET InStock = InStock - ? WHERE ProductCode = ?");
for ($i = 0; $i < count($products); $i++) {
    $q = (int)$quantities[$i];
    if ($q < 1) continue;                           // skip empty rows of the form
    mysqli_stmt_bind_param($item, "isi", $orderId, $products[$i], $q);
    mysqli_stmt_execute($item);
    mysqli_stmt_bind_param($stock, "is", $q, $products[$i]);
    mysqli_stmt_execute($stock);
}
echo "Order $orderId saved.";
?>
```

:::steps What the code does
- **Reads** the customer and the arrays of products and quantities from the form.
- **Inserts** the order header and gets the new **OrderID** with `mysqli_insert_id()`.
- **Loops** through the products, inserting one **OrderItem** row for each non-empty quantity.
- **Updates** the stock of each product with `UPDATE … SET InStock = InStock - ?`.
- Uses **prepared statements** throughout, so form data cannot change the SQL (no SQL injection).
:::

:::compare SQL statements used by the application
| Task | Statement |
|---|---|
| Add a customer | `INSERT INTO Customer (FullName, City) VALUES ('Dana Kim', 'Astana');` |
| Add several rows | `INSERT INTO OrderItem VALUES (104, 'AB102', 2), (104, 'EF305', 5);` |
| Change a price | `UPDATE Product SET Price = 900 WHERE ProductCode = 'AB102';` |
| Remove an item | `DELETE FROM OrderItem WHERE OrderID = 104 AND ProductCode = 'EF305';` |
:::

:::callout info Transactions
An order should be saved **completely or not at all**. With `mysqli_begin_transaction($conn)` … `mysqli_commit($conn)` the DBMS keeps all the statements together; if one fails, `mysqli_rollback($conn)` undoes the others.
:::

# Joining tables
@lo 11.5.4.8 11.4.2.4

:::definition Join
Combining rows from **two or more tables** in one query, by matching a **foreign key** in one table with the **primary key** in another.
:::

:::compare Two ways to join tables
| Join in WHERE | INNER JOIN |
|---|---|
| `FROM Customer, Orders WHERE Customer.CustomerID = Orders.CustomerID` | `FROM Customer JOIN Orders ON Customer.CustomerID = Orders.CustomerID` |
| Older style — accepted in exams | Clearer — join conditions are separate from the filters in WHERE |
:::

```sql | Two tables: dates of orders by customers from Astana
SELECT Customer.FullName, Orders.OrderDate
FROM Customer, Orders
WHERE Customer.CustomerID = Orders.CustomerID      -- join condition
  AND Customer.City = 'Astana'                     -- filter
ORDER BY Orders.OrderDate;
```

:::example Result
| FullName | OrderDate |
|---|---|
| Asel Nurlanova | 2026-10-02 |
| Asel Nurlanova | 2026-10-07 |

Dana Kim lives in Astana but has **no** orders, so she does not appear.
:::

:::tip Aliases and dot notation
`Customer.CustomerID` means "the CustomerID field **of the Customer table**" — needed when two tables have a field with the same name. **Aliases** make long queries shorter: `FROM Customer c JOIN Orders o ON c.CustomerID = o.CustomerID`.
:::

:::tip How many join conditions?
Every extra table needs **one more** join condition: **2** tables → 1 condition, **3** tables → 2, **4** tables → 3 (each one PK = FK).
:::

# Queries for the application
@lo 11.5.4.8 11.4.2.4

```sql | Three tables: everything customer 1 has bought
SELECT p.Name, i.Quantity, o.OrderDate
FROM Orders o
JOIN OrderItem i ON i.OrderID = o.OrderID
JOIN Product  p ON p.ProductCode = i.ProductCode
WHERE o.CustomerID = 1
ORDER BY o.OrderDate;
```

:::example Result
| Name | Quantity | OrderDate |
|---|---|---|
| Apple juice | 3 | 2026-10-02 |
| Pen | 2 | 2026-10-02 |
| Notebook | 2 | 2026-10-07 |
| Apple juice | 1 | 2026-10-07 |
:::

:::compare Aggregate functions
| Function | Returns | Example |
|---|---|---|
| `COUNT(*)` | Number of rows | number of orders |
| `SUM(field)` | Total | total quantity sold |
| `AVG(field)` | Average | average price |
| `MAX(field)` / `MIN(field)` | Largest / smallest | most expensive product |
:::

```sql | Totals with GROUP BY
-- value of each order
SELECT o.OrderID, SUM(p.Price * i.Quantity) AS OrderTotal
FROM Orders o
JOIN OrderItem i ON i.OrderID = o.OrderID
JOIN Product  p ON p.ProductCode = i.ProductCode
GROUP BY o.OrderID;

-- quantity sold of each product, best seller first
SELECT p.Name, SUM(i.Quantity) AS Sold
FROM Product p JOIN OrderItem i ON i.ProductCode = p.ProductCode
GROUP BY p.Name
ORDER BY Sold DESC;
```

:::example Results
| OrderID | OrderTotal |
|---|---|
| 101 | 3150 (3 × 850 + 2 × 300) |
| 102 | 1200 |
| 103 | 3250 (2 × 1200 + 850) |

| Name | Sold |
|---|---|
| Apple juice | 4 |
| Notebook | 3 |
| Pen | 2 |
:::

```sql | Four tables: how much each customer has spent
SELECT c.FullName, SUM(p.Price * i.Quantity) AS Spent
FROM Customer c
JOIN Orders    o ON o.CustomerID = c.CustomerID
JOIN OrderItem i ON i.OrderID = o.OrderID
JOIN Product   p ON p.ProductCode = i.ProductCode
GROUP BY c.FullName
ORDER BY Spent DESC;
-- Asel Nurlanova 6400, Bauyrzhan Seitov 1200
```

:::callout info LEFT JOIN
An inner join shows only rows that have a match. `LEFT JOIN` keeps **every** row of the left table: `SELECT c.FullName, COUNT(o.OrderID) FROM Customer c LEFT JOIN Orders o ON o.CustomerID = c.CustomerID GROUP BY c.FullName;` also lists **Dana Kim — 0** orders.
:::

```php | Displaying a multi-table report in the application
<?php
$sql = "SELECT c.FullName, SUM(p.Price * i.Quantity) AS Spent
        FROM Customer c
        JOIN Orders o    ON o.CustomerID = c.CustomerID
        JOIN OrderItem i ON i.OrderID = o.OrderID
        JOIN Product p   ON p.ProductCode = i.ProductCode
        GROUP BY c.FullName ORDER BY Spent DESC";
$result = mysqli_query($conn, $sql);
echo "<table><tr><th>Customer</th><th>Total spent</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr><td>" . htmlspecialchars($row["FullName"]) . "</td><td>" . $row["Spent"] . " ₸</td></tr>";
}
echo "</table>";
?>
```

# Exam practice and summary
@lo 11.5.4.7 11.5.4.8 11.4.2.4

:::example Exam-style answers
**Q: Write a query to display the names of the products in order 102. [3]**
`SELECT Product.Name FROM Product, OrderItem` (1) `WHERE Product.ProductCode = OrderItem.ProductCode` (1) `AND OrderItem.OrderID = 102;` (1).

**Q: Explain why mysqli_insert_id() is used when saving an order. [2]**
The OrderID is created **automatically** by the database (auto-increment) (1); the program needs it to insert the **OrderItem** rows that refer to this order (1).

**Q: Write a query that shows the total quantity sold of each product. [3]**
`SELECT Name, SUM(Quantity)` (1) `FROM Product JOIN OrderItem ON Product.ProductCode = OrderItem.ProductCode` (1) `GROUP BY Name;` (1).
:::

:::warning Common mistakes
- Forgetting the **join condition** — every row is combined with every other row (a huge, wrong result).
- Writing `CustomerID` alone when two tables have it — use `Customer.CustomerID`.
- Using an aggregate without **GROUP BY** for the other selected fields.
- Inserting the OrderItem rows **before** the order exists — the foreign key rejects them.
:::

:::steps Check yourself
- Draw the relationships of the shop tables and mark PKs and FKs.
- Write the PHP that saves an order with two items.
- Write a two-table query in both join styles.
- Write a three-table query listing what one customer bought.
- Calculate the value of order 101 from the tables.
- What does LEFT JOIN add that INNER JOIN does not?
:::
