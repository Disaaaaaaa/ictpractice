---
summary: Implementing the SQL part of a project — inserting records from program code and extracting data from several related tables for the application.
---
# Adding data from program code
@lo 11.5.4.7

```php | Saving an order: one customer, several products
<?php
include "db.php";                                   // $conn = mysqli_connect(...)

$customerId = (int)$_POST["customer"];
$products   = $_POST["product"];                    // e.g. ["AB102", "CD210"]
$quantities = $_POST["qty"];                        // e.g. [3, 1]
$orderId    = time();                               // simple unique number for the example

$stmt = mysqli_prepare($conn,
    "INSERT INTO OrderItem (OrderID, ProductCode, CustomerID, Quantity, OrderDate)
     VALUES (?, ?, ?, ?, CURDATE())");

for ($i = 0; $i < count($products); $i++) {
    $q = (int)$quantities[$i];
    if ($q < 1) continue;                           // skip empty rows
    mysqli_stmt_bind_param($stmt, "isii", $orderId, $products[$i], $customerId, $q);
    mysqli_stmt_execute($stmt);
}
echo "Order $orderId saved.";
?>
```

# Extracting data from several tables
@lo 11.5.4.8, 11.4.2.4

```sql | Report: what each customer ordered, newest first
SELECT c.FullName, p.Name AS Product, o.Quantity,
       p.Price * o.Quantity AS LineTotal, o.OrderDate
FROM OrderItem o
JOIN Customer c ON c.CustomerID = o.CustomerID
JOIN Product  p ON p.ProductCode = o.ProductCode
WHERE o.OrderDate >= '2026-10-01'
ORDER BY o.OrderDate DESC, c.FullName;
```

```php | Displaying the report
<?php
$sql = "SELECT c.FullName, SUM(p.Price * o.Quantity) AS Spent
        FROM OrderItem o
        JOIN Customer c ON c.CustomerID = o.CustomerID
        JOIN Product  p ON p.ProductCode = o.ProductCode
        GROUP BY c.FullName
        ORDER BY Spent DESC";
$result = mysqli_query($conn, $sql);
echo "<table><tr><th>Customer</th><th>Total spent</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr><td>" . htmlspecialchars($row["FullName"]) . "</td><td>{$row['Spent']} ₸</td></tr>";
}
echo "</table>";
?>
```

:::compare Two ways to join tables
| Join in WHERE | INNER JOIN |
|---|---|
| `FROM A, B WHERE A.id = B.a_id` | `FROM A JOIN B ON A.id = B.a_id` |
| Older style, accepted in exams | Clearer — join conditions separate from filters |
:::

:::tip
Every extra table in a query needs **one more join condition**. Three tables → two conditions (PK = FK each).
:::
