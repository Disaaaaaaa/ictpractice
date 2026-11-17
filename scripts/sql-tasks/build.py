"""Builds the written-SQL practice tasks (type "sql", run and auto-marked on a
sample database) and adds them to content/topics/g11-sql.json (15 per lesson)
and content/topics/g11-sql-implementation.json (15).

    python3 scripts/sql-tasks/build.py

Re-running replaces the tasks it made before (keys starting with "sqlw-").
Check them afterwards with:  npx vitest run tests/unit/sql-tasks.test.ts
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
MARKS = {"easy": 2, "medium": 3, "hard": 4}


def cols(table):
    t = table.lower()
    return (
        "SELECT lower(column_name) AS column_name, data_type, character_maximum_length AS size, "
        "numeric_precision, numeric_scale, is_nullable FROM information_schema.columns "
        f"WHERE table_schema = 'public' AND lower(table_name) = '{t}' ORDER BY ordinal_position"
    )


def tables_query():
    return "SELECT lower(table_name) AS table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1"


def task(key, title, text, difficulty, objectives, solution, check="rows", check_query=None, probes=None,
         hint=None, check_label=None, probes_label=None):
    accepted = {"solution": solution.strip()}
    if check != "rows":
        accepted["check"] = check
    if check_query:
        accepted["check_query"] = check_query
    if check_label:
        accepted["check_label"] = check_label
    if probes:
        accepted["probes"] = probes
    if probes_label:
        accepted["probes_label"] = probes_label
    return {
        "key": f"sqlw-{key}",
        "title": title,
        "type": "sql",
        "marks": MARKS[difficulty],
        "difficulty": difficulty,
        "command_word": "write",
        "grading": "AUTO",
        "objectives": objectives,
        "source": "original",
        "practice": True,
        "text": text.strip(),
        "content": {"language": "sql", "sql": {"setup": None}, **({"hint": hint} if hint else {})},
        "scheme": {
            "mark_scheme": "Marked by running your code on the sample database and comparing the result with a model answer.",
            "model_answer": "```sql\n" + solution.strip() + "\n```",
            "accepted": {"sql": accepted},
        },
    }


TIP = "\n\nPress **Show the database** to see the tables, **Run SQL** to try your code, then **Check Answer**."

# ---------------------------------------------------------------- lesson 1: DDL
L1_SETUP = """
CREATE TABLE Books (
  BookID INT PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Author VARCHAR(60),
  Year INT,
  Price DECIMAL(6,2)
);
CREATE TABLE Members (
  MemberID INT PRIMARY KEY,
  FirstName VARCHAR(30) NOT NULL,
  LastName VARCHAR(30) NOT NULL,
  Class VARCHAR(4)
);
INSERT INTO Books VALUES
  (1, 'The Little Prince', 'Antoine de Saint-Exupery', 1943, 2500.00),
  (2, 'Abai Joly', 'Mukhtar Auezov', 1942, 4200.00),
  (3, 'The Hobbit', 'J. R. R. Tolkien', 1937, 3900.00),
  (4, 'Clean Code', 'Robert Martin', 2008, 9800.00);
INSERT INTO Members VALUES
  (1, 'Aliya', 'Serikova', '11A'),
  (2, 'Daniyar', 'Omarov', '11B'),
  (3, 'Madina', 'Akhmetova', '11A');
"""
O_DDL = ["11.4.2.2"]
O_TYPES = ["11.4.1.4", "11.4.2.2"]
L1 = [
    task("create-students", "Create the Students table",
         "Write an SQL statement that creates a table **Students** with these fields:\n\n"
         "| Field | Data | Rule |\n|---|---|---|\n| StudentID | whole number | primary key |\n"
         "| FirstName | text, up to 30 characters | must be filled in |\n| LastName | text, up to 30 characters | must be filled in |\n"
         "| DateOfBirth | date | |" + TIP,
         "easy", O_TYPES,
         "CREATE TABLE Students (StudentID INT PRIMARY KEY, FirstName VARCHAR(30) NOT NULL, LastName VARCHAR(30) NOT NULL, DateOfBirth DATE);",
         check="state", check_query=cols("Students"), check_label="The fields, data types and sizes are right",
         probes=["INSERT INTO Students VALUES (1, 'Aru', 'Bek', '2009-05-01')",
                 "INSERT INTO Students VALUES (1, 'Aru', 'Bek', NULL), (1, 'Dana', 'Nur', NULL)",
                 "INSERT INTO Students (StudentID, LastName) VALUES (2, 'Bek')"],
         probes_label="The primary key and NOT NULL rules work"),
    task("create-subjects", "Create the Subjects table",
         "Create a table **Subjects**: `SubjectCode` is a code of exactly **4** characters and is the primary key; "
         "`SubjectName` is text up to **40** characters and must be filled in; `Hours` is a whole number." + TIP,
         "easy", O_TYPES,
         "CREATE TABLE Subjects (SubjectCode CHAR(4) PRIMARY KEY, SubjectName VARCHAR(40) NOT NULL, Hours INT);",
         check="state", check_query=cols("Subjects"), check_label="The fields, data types and sizes are right",
         probes=["INSERT INTO Subjects VALUES ('CS11', 'Computer Science', 3)",
                 "INSERT INTO Subjects VALUES ('CS11', 'A', 1), ('CS11', 'B', 2)",
                 "INSERT INTO Subjects (SubjectCode, Hours) VALUES ('MA11', 4)"],
         probes_label="The primary key and NOT NULL rules work"),
    task("create-products", "Create the Products table",
         "Create a table **Products**: `ProductID` (whole number, primary key), `Name` (text up to 50 characters, required), "
         "`Price` (money: up to 6 digits with **2** after the decimal point) and `InStock` (yes / no)." + TIP,
         "medium", O_TYPES,
         "CREATE TABLE Products (ProductID INT PRIMARY KEY, Name VARCHAR(50) NOT NULL, Price DECIMAL(6,2), InStock BOOLEAN);",
         check="state", check_query=cols("Products"), check_label="The fields, data types and sizes are right",
         hint="Money is DECIMAL(p, s); yes / no is BOOLEAN."),
    task("create-autonumber", "A primary key numbered automatically",
         "Create a table **Clubs** where `ClubID` is a whole number that the database numbers **automatically** "
         "and is the primary key, and `ClubName` is text up to 50 characters that must be filled in." + TIP,
         "medium", O_TYPES,
         "CREATE TABLE Clubs (ClubID INT AUTO_INCREMENT PRIMARY KEY, ClubName VARCHAR(50) NOT NULL);",
         check="state",
         check_query="INSERT INTO Clubs (ClubName) VALUES ('Chess'), ('Robotics'); SELECT ClubID, ClubName FROM Clubs ORDER BY ClubID",
         check_label="New clubs get the numbers 1, 2, … automatically",
         hint="In the MySQL style taught in class: INT AUTO_INCREMENT PRIMARY KEY."),
    task("add-genre", "Add a column",
         "The table **Books** already exists. Write an SQL statement that adds a field `Genre` (text up to 30 characters) to it." + TIP,
         "easy", O_DDL, "ALTER TABLE Books ADD Genre VARCHAR(30);",
         check="state", check_query=cols("Books"), check_label="Books has the new field"),
    task("drop-price", "Remove a column",
         "Write an SQL statement that removes the field `Price` from the table **Books**." + TIP,
         "easy", O_DDL, "ALTER TABLE Books DROP COLUMN Price;",
         check="state", check_query=cols("Books"), check_label="Price is no longer in Books"),
    task("drop-members", "Delete a table",
         "The library no longer needs the table **Members**. Write an SQL statement that deletes the whole table." + TIP,
         "easy", O_DDL, "DROP TABLE Members;",
         check="state", check_query=tables_query(), check_label="Only the right tables are left"),
    task("add-email", "Add an e-mail field",
         "Add a field `Email` (text up to 80 characters) to the table **Members**." + TIP,
         "easy", O_DDL, "ALTER TABLE Members ADD Email VARCHAR(80);",
         check="state", check_query=cols("Members"), check_label="Members has the new field"),
    task("rename-author", "Rename a column",
         "Rename the field `Author` in the table **Books** to `Writer`." + TIP,
         "medium", O_DDL, "ALTER TABLE Books RENAME COLUMN Author TO Writer;",
         check="state", check_query=cols("Books"), check_label="The field is called Writer",
         hint="ALTER TABLE … RENAME COLUMN old TO new;"),
    task("create-loans", "A table with foreign keys",
         "Create a table **Loans**: `LoanID` (whole number, primary key), `BookID` (whole number, a foreign key to **Books**), "
         "`MemberID` (whole number, a foreign key to **Members**) and `LoanDate` (date, required)." + TIP,
         "hard", O_TYPES,
         "CREATE TABLE Loans (LoanID INT PRIMARY KEY, BookID INT REFERENCES Books(BookID), MemberID INT REFERENCES Members(MemberID), LoanDate DATE NOT NULL);",
         check="state", check_query=cols("Loans"), check_label="The fields, data types and sizes are right",
         probes=["INSERT INTO Loans VALUES (1, 2, 1, '2026-11-02')",
                 "INSERT INTO Loans VALUES (2, 99, 1, '2026-11-02')",
                 "INSERT INTO Loans VALUES (3, 1, 99, '2026-11-02')",
                 "INSERT INTO Loans VALUES (4, 1, 1, NULL)"],
         probes_label="The foreign keys only accept existing books and members",
         hint="FOREIGN KEY (BookID) REFERENCES Books(BookID)"),
    task("create-teachers", "A field that must be unique",
         "Create a table **Teachers**: `TeacherID` (whole number, primary key), `FullName` (text up to 60 characters) and "
         "`Email` (text up to 80 characters, required, and **no two teachers may have the same e-mail**)." + TIP,
         "medium", O_TYPES,
         "CREATE TABLE Teachers (TeacherID INT PRIMARY KEY, FullName VARCHAR(60), Email VARCHAR(80) NOT NULL UNIQUE);",
         check="state", check_query=cols("Teachers"), check_label="The fields, data types and sizes are right",
         probes=["INSERT INTO Teachers VALUES (1, 'A', 'a@nis.edu.kz'), (2, 'B', 'b@nis.edu.kz')",
                 "INSERT INTO Teachers VALUES (1, 'A', 'a@nis.edu.kz'), (2, 'B', 'a@nis.edu.kz')",
                 "INSERT INTO Teachers VALUES (3, 'C', NULL)"],
         probes_label="E-mails must be filled in and unique"),
    task("create-and-fill", "Create a table and fill it",
         "Create a table **Rooms** with `RoomNo` (whole number, primary key) and `Floor` (whole number), "
         "then add two rooms: room **101** on floor **1** and room **204** on floor **2**." + TIP,
         "medium", ["11.4.2.1", "11.4.2.2"],
         "CREATE TABLE Rooms (RoomNo INT PRIMARY KEY, Floor INT); INSERT INTO Rooms VALUES (101, 1), (204, 2);",
         check="state", check_query="SELECT RoomNo, Floor FROM Rooms ORDER BY RoomNo", check_label="Rooms holds the two rooms",
         hint="Two statements: CREATE TABLE (DDL), then INSERT (DML). End each with ;"),
    task("add-default", "A column with a default value",
         "Add a field `JoinYear` (whole number) to **Members** whose value is **2026** when nothing is entered." + TIP,
         "medium", O_DDL, "ALTER TABLE Members ADD JoinYear INT DEFAULT 2026;",
         check="state", check_query="INSERT INTO Members (MemberID, FirstName, LastName) VALUES (9, 'Test', 'Pupil'); SELECT MemberID, JoinYear FROM Members ORDER BY MemberID",
         check_label="New and existing members get 2026"),
    task("composite-key", "A composite primary key",
         "Create a table **Enrolments** that links students to subjects: `StudentID` (whole number) and `SubjectCode` "
         "(exactly 4 characters). The **pair** of fields together is the primary key." + TIP,
         "hard", O_TYPES,
         "CREATE TABLE Enrolments (StudentID INT, SubjectCode CHAR(4), PRIMARY KEY (StudentID, SubjectCode));",
         check="state", check_query=cols("Enrolments"), check_label="The fields and data types are right",
         probes=["INSERT INTO Enrolments VALUES (1, 'CS11'), (1, 'MA11'), (2, 'CS11')",
                 "INSERT INTO Enrolments VALUES (1, 'CS11'), (1, 'CS11')",
                 "INSERT INTO Enrolments VALUES (NULL, 'CS11')"],
         probes_label="Only the pair has to be unique",
         hint="PRIMARY KEY (field1, field2) at the end of the field list."),
    task("drop-and-add", "Change the structure in two steps",
         "In **Books**, remove the field `Year` and add a new field `PublishYear` (whole number). Use two statements." + TIP,
         "medium", O_DDL, "ALTER TABLE Books DROP COLUMN Year; ALTER TABLE Books ADD PublishYear INT;",
         check="state", check_query=cols("Books"), check_label="Books has PublishYear and no Year"),
]

# ---------------------------------------------------------------- lesson 2: DML
L2_SETUP = """
CREATE TABLE Students (
  StudentID INT PRIMARY KEY,
  FirstName VARCHAR(30) NOT NULL,
  LastName VARCHAR(30) NOT NULL,
  Class VARCHAR(4),
  Town VARCHAR(30),
  Points INT
);
INSERT INTO Students VALUES
  (1, 'Aliya', 'Serikova', '11A', 'Almaty', 92),
  (2, 'Daniyar', 'Omarov', '11B', 'Astana', 75),
  (3, 'Madina', 'Akhmetova', '11A', 'Shymkent', 64),
  (4, 'Arman', 'Kassymov', '11B', 'Almaty', 88),
  (5, 'Zhanel', 'Bekova', '11C', 'Karaganda', 39),
  (6, 'Timur', 'Abenov', '11A', 'Astana', 81),
  (7, 'Dana', 'Nurlanova', '11C', 'Almaty', 57),
  (8, 'Erlan', 'Tokayev', '11B', 'Shymkent', NULL),
  (9, 'Aigerim', 'Zhunusova', '11C', 'Aktobe', 70),
  (10, 'Nursultan', 'Iskakov', '11A', 'Almaty', 33);
"""
O_DML = ["11.4.2.3"]
STATE_ALL = "SELECT * FROM Students ORDER BY StudentID"
L2 = [
    task("select-all", "Show the whole table",
         "Write an SQL query that shows **all fields** of **all students**." + TIP, "easy", O_DML,
         "SELECT * FROM Students;"),
    task("select-class", "Students of one class",
         "Show the `FirstName` and `LastName` of the students in class **11A**." + TIP, "easy", O_DML,
         "SELECT FirstName, LastName FROM Students WHERE Class = '11A';", hint="Text values go in single quotes: '11A'."),
    task("select-points", "A condition on a number",
         "Show the `FirstName` and `Points` of students with **more than 80** points." + TIP, "easy", O_DML,
         "SELECT FirstName, Points FROM Students WHERE Points > 80;"),
    task("select-and", "Two conditions with AND",
         "Show the `FirstName`, `LastName` and `Class` of students who live in **Almaty** and are in class **11B**." + TIP,
         "medium", O_DML, "SELECT FirstName, LastName, Class FROM Students WHERE Town = 'Almaty' AND Class = '11B';"),
    task("select-or", "Two conditions with OR",
         "Show the `FirstName` and `Town` of students who live in **Astana** or in **Shymkent**." + TIP,
         "medium", O_DML, "SELECT FirstName, Town FROM Students WHERE Town = 'Astana' OR Town = 'Shymkent';"),
    task("select-like", "Names that start with a letter",
         "Show the `LastName` of every student whose last name **starts with A**." + TIP, "medium", O_DML,
         "SELECT LastName FROM Students WHERE LastName LIKE 'A%';", hint="LIKE 'A%' — % stands for any characters."),
    task("select-between", "A range of values",
         "Show the `FirstName` and `Points` of students with **60 to 80** points (both included)." + TIP,
         "medium", O_DML, "SELECT FirstName, Points FROM Students WHERE Points BETWEEN 60 AND 80;"),
    task("select-null", "Missing values",
         "Show the `StudentID` and `FirstName` of students who have **no points recorded**." + TIP, "medium", O_DML,
         "SELECT StudentID, FirstName FROM Students WHERE Points IS NULL;", hint="Use IS NULL, not = NULL."),
    task("insert-one", "Add a student",
         "Add a new student: ID **11**, **Asel Muratova**, class **11B**, from **Taraz**, with **68** points." + TIP,
         "easy", O_DML, "INSERT INTO Students VALUES (11, 'Asel', 'Muratova', '11B', 'Taraz', 68);",
         check="state", check_query=STATE_ALL, check_label="The table holds the new student"),
    task("insert-two", "Add two students at once",
         "Add two students with **one** INSERT statement: ID **12** Bauyrzhan Saparov, 11C, Almaty, 74 points; "
         "ID **13** Kamila Ermekova, 11A, Astana, 90 points." + TIP,
         "medium", O_DML,
         "INSERT INTO Students VALUES (12, 'Bauyrzhan', 'Saparov', '11C', 'Almaty', 74), (13, 'Kamila', 'Ermekova', '11A', 'Astana', 90);",
         check="state", check_query=STATE_ALL, check_label="The table holds both new students"),
    task("insert-some", "Add a student with some fields only",
         "Add student ID **14**, **Ruslan Ali**, class **11C**. The town and points are not known yet — fill in only the known fields." + TIP,
         "medium", O_DML, "INSERT INTO Students (StudentID, FirstName, LastName, Class) VALUES (14, 'Ruslan', 'Ali', '11C');",
         check="state", check_query=STATE_ALL, check_label="The new student has empty Town and Points",
         hint="List the fields after the table name: INSERT INTO Students (StudentID, …) VALUES (…);"),
    task("update-one", "Change one record",
         "Student **4** has moved. Change his town to **Aktobe**." + TIP, "easy", O_DML,
         "UPDATE Students SET Town = 'Aktobe' WHERE StudentID = 4;",
         check="state", check_query=STATE_ALL, check_label="Only student 4 has changed"),
    task("update-many", "Change several records",
         "Every student in class **11A** gets **5 extra points**. Write the UPDATE statement." + TIP, "medium", O_DML,
         "UPDATE Students SET Points = Points + 5 WHERE Class = '11A';",
         check="state", check_query=STATE_ALL, check_label="Only the 11A students have 5 more points"),
    task("delete-one", "Delete one record",
         "Student **7** has left the school. Delete the student's record." + TIP, "easy", O_DML,
         "DELETE FROM Students WHERE StudentID = 7;",
         check="state", check_query=STATE_ALL, check_label="Only student 7 is gone"),
    task("delete-many", "Delete with a condition",
         "Delete the records of all students with **fewer than 40** points." + TIP, "medium", O_DML,
         "DELETE FROM Students WHERE Points < 40;",
         check="state", check_query=STATE_ALL, check_label="Exactly the right students are gone"),
]

# ------------------------------------------------- lesson 3: ORDER BY and validation
L3_SETUP = """
CREATE TABLE Products (
  ProductID INT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Category VARCHAR(30),
  Price DECIMAL(8,2),
  Stock INT
);
INSERT INTO Products VALUES
  (1, 'Notebook A5', 'Stationery', 450.00, 120),
  (2, 'Gel pen', 'Stationery', 300.00, 340),
  (3, 'USB flash 32GB', 'Electronics', 3900.00, 25),
  (4, 'Headphones', 'Electronics', 12500.00, 8),
  (5, 'Backpack', 'Bags', 18900.00, 14),
  (6, 'Pencil case', 'Bags', 2700.00, 40),
  (7, 'Calculator', 'Electronics', 7600.00, 17),
  (8, 'Ruler 30cm', 'Stationery', 250.00, 210),
  (9, 'Mouse', 'Electronics', 5400.00, 30);
"""
O_SORT = ["11.4.2.5"]
O_VAL = ["11.5.4.2", "11.4.2.2"]
L3 = [
    task("order-price", "Cheapest first",
         "Show all fields of all products, **cheapest first**." + TIP, "easy", O_SORT,
         "SELECT * FROM Products ORDER BY Price;", check="ordered"),
    task("order-desc", "Most expensive first",
         "Show the `Name` and `Price` of all products, **most expensive first**." + TIP, "easy", O_SORT,
         "SELECT Name, Price FROM Products ORDER BY Price DESC;", check="ordered"),
    task("order-two", "Sort by two fields",
         "Show the `Category` and `Name` of all products, sorted by **category** A–Z and, inside each category, by **name** A–Z." + TIP,
         "medium", O_SORT, "SELECT Category, Name FROM Products ORDER BY Category, Name;", check="ordered"),
    task("order-where", "Filter, then sort",
         "Show the `Name` and `Stock` of the **Stationery** products, the one with the **most** stock first." + TIP,
         "medium", O_SORT, "SELECT Name, Stock FROM Products WHERE Category = 'Stationery' ORDER BY Stock DESC;", check="ordered"),
    task("order-limit", "The three most expensive",
         "Show the `Name` and `Price` of the **three** most expensive products, most expensive first." + TIP,
         "hard", O_SORT, "SELECT Name, Price FROM Products ORDER BY Price DESC LIMIT 3;", check="ordered",
         hint="Sort, then keep only the first rows with LIMIT 3."),
    task("count", "Count the products",
         "Write a query that shows **how many products** there are in the table." + TIP, "easy", O_SORT,
         "SELECT COUNT(*) FROM Products;", hint="COUNT(*) counts the rows."),
    task("avg", "Average price",
         "Show the **average price** of the **Electronics** products." + TIP, "medium", O_SORT,
         "SELECT AVG(Price) FROM Products WHERE Category = 'Electronics';"),
    task("sum", "Total stock",
         "Show the **total number of items in stock** (all products together)." + TIP, "easy", O_SORT,
         "SELECT SUM(Stock) FROM Products;"),
    task("min-max", "Cheapest and dearest",
         "Show the **lowest** and the **highest** price in one query (two columns)." + TIP, "medium", O_SORT,
         "SELECT MIN(Price), MAX(Price) FROM Products;"),
    task("group", "Products in each category",
         "Show each `Category` and **how many products** it has, sorted by category A–Z." + TIP, "hard", O_SORT,
         "SELECT Category, COUNT(*) FROM Products GROUP BY Category ORDER BY Category;", check="ordered",
         hint="GROUP BY Category, then ORDER BY Category."),
    task("check-quantity", "Validation: a positive quantity",
         "Create a table **OrderLines** with `LineID` (whole number, primary key), `ProductID` (whole number) and `Quantity` "
         "(whole number). Add a **validation rule** so that the quantity must be **greater than 0**." + TIP,
         "medium", O_VAL,
         "CREATE TABLE OrderLines (LineID INT PRIMARY KEY, ProductID INT, Quantity INT CHECK (Quantity > 0));",
         check="state", check_query=cols("OrderLines"), check_label="The fields and data types are right",
         probes=["INSERT INTO OrderLines VALUES (1, 3, 2)", "INSERT INTO OrderLines VALUES (2, 3, 0)", "INSERT INTO OrderLines VALUES (3, 3, -5)"],
         probes_label="The validation rule accepts and rejects the right quantities",
         hint="CHECK (Quantity > 0) after the data type."),
    task("check-range", "Validation: a range check",
         "Create a table **Marks** with `MarkID` (whole number, primary key), `StudentID` (whole number, required) and "
         "`Mark` (whole number) that must be **from 0 to 100**." + TIP,
         "medium", O_VAL,
         "CREATE TABLE Marks (MarkID INT PRIMARY KEY, StudentID INT NOT NULL, Mark INT CHECK (Mark BETWEEN 0 AND 100));",
         check="state", check_query=cols("Marks"), check_label="The fields and data types are right",
         probes=["INSERT INTO Marks VALUES (1, 5, 0), (2, 5, 100), (3, 5, 57)", "INSERT INTO Marks VALUES (4, 5, 101)",
                 "INSERT INTO Marks VALUES (5, 5, -1)", "INSERT INTO Marks VALUES (6, NULL, 50)"],
         probes_label="Boundary, normal and wrong data are accepted / rejected correctly"),
    task("check-lookup", "Validation: a lookup (list) check",
         "Create a table **Uniforms** with `ItemID` (whole number, primary key) and `Size` (text up to 2 characters) "
         "that may only be **S**, **M**, **L** or **XL**." + TIP,
         "medium", O_VAL,
         "CREATE TABLE Uniforms (ItemID INT PRIMARY KEY, Size VARCHAR(2) CHECK (Size IN ('S', 'M', 'L', 'XL')));",
         check="state", check_query=cols("Uniforms"), check_label="The fields and data types are right",
         probes=["INSERT INTO Uniforms VALUES (1, 'S'), (2, 'XL')", "INSERT INTO Uniforms VALUES (3, 'XS')", "INSERT INTO Uniforms VALUES (4, 'm')"],
         probes_label="Only the four sizes are accepted", hint="CHECK (Size IN ('S', 'M', 'L', 'XL'))"),
    task("check-alter", "Add a validation rule to a table",
         "The table **Products** exists. Add a validation rule to it so that a price must be **greater than 0**." + TIP,
         "hard", O_VAL, "ALTER TABLE Products ADD CHECK (Price > 0);",
         check="state",
         probes=["INSERT INTO Products VALUES (20, 'Eraser', 'Stationery', 150.00, 50)",
                 "INSERT INTO Products VALUES (21, 'Free sticker', 'Stationery', 0, 50)",
                 "UPDATE Products SET Price = -1 WHERE ProductID = 1"],
         probes_label="Zero and negative prices are rejected", hint="ALTER TABLE Products ADD CHECK (…);"),
    task("check-format", "Validation: a format check",
         "Create a table **Pupils** with `PupilCode` (exactly 5 characters, primary key) and `FullName` (text up to 60 characters). "
         "A pupil code must be the letter **S** followed by **four** characters, e.g. `S1234` (use LIKE)." + TIP,
         "hard", O_VAL,
         "CREATE TABLE Pupils (PupilCode CHAR(5) PRIMARY KEY CHECK (PupilCode LIKE 'S____'), FullName VARCHAR(60));",
         check="state", check_query=cols("Pupils"), check_label="The fields and data types are right",
         probes=["INSERT INTO Pupils VALUES ('S1234', 'Aru')", "INSERT INTO Pupils VALUES ('T1234', 'Bek')", "INSERT INTO Pupils VALUES ('S12', 'Dana')"],
         probes_label="Only codes in the right format are accepted", hint="In LIKE, _ stands for exactly one character."),
]

# ------------------------------------------------- lesson 4: several tables
L4_SETUP = """
CREATE TABLE Authors (
  AuthorID INT PRIMARY KEY,
  Name VARCHAR(60) NOT NULL,
  Country VARCHAR(30)
);
CREATE TABLE Books (
  BookID INT PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  AuthorID INT REFERENCES Authors(AuthorID),
  Genre VARCHAR(30),
  Year INT
);
CREATE TABLE Members (
  MemberID INT PRIMARY KEY,
  Name VARCHAR(40) NOT NULL,
  Class VARCHAR(4)
);
CREATE TABLE Loans (
  LoanID INT PRIMARY KEY,
  BookID INT REFERENCES Books(BookID),
  MemberID INT REFERENCES Members(MemberID),
  LoanDate DATE NOT NULL,
  Returned BOOLEAN
);
INSERT INTO Authors VALUES
  (1, 'Mukhtar Auezov', 'Kazakhstan'), (2, 'J. K. Rowling', 'UK'), (3, 'Abai Kunanbayev', 'Kazakhstan'),
  (4, 'Jules Verne', 'France'), (5, 'Ilyas Yessenberlin', 'Kazakhstan');
INSERT INTO Books VALUES
  (1, 'Abai Joly', 1, 'Novel', 1942), (2, 'Harry Potter 1', 2, 'Fantasy', 1997), (3, 'Book of Words', 3, 'Poetry', 1918),
  (4, 'Twenty Thousand Leagues', 4, 'Adventure', 1870), (5, 'The Nomads', 5, 'Novel', 1976), (6, 'Harry Potter 2', 2, 'Fantasy', 1998),
  (7, 'The Mysterious Island', 4, 'Adventure', 1875);
INSERT INTO Members VALUES
  (1, 'Aliya', '11A'), (2, 'Daniyar', '11B'), (3, 'Madina', '11A'), (4, 'Arman', '11C');
INSERT INTO Loans VALUES
  (1, 2, 1, '2026-10-01', TRUE), (2, 1, 2, '2026-10-03', FALSE), (3, 6, 1, '2026-10-05', FALSE),
  (4, 4, 3, '2026-10-06', TRUE), (5, 2, 4, '2026-10-08', FALSE), (6, 5, 3, '2026-10-10', FALSE),
  (7, 3, 1, '2026-10-12', TRUE);
"""
O_JOIN = ["11.4.2.4"]
O_MULTI = ["11.4.1.11", "11.4.2.2"]
L4 = [
    task("join-author", "Book and author",
         "Show the `Title` of every book together with the `Name` of its author." + TIP, "easy", O_JOIN,
         "SELECT Books.Title, Authors.Name FROM Books JOIN Authors ON Books.AuthorID = Authors.AuthorID;",
         hint="Join on the field the two tables share: Books.AuthorID = Authors.AuthorID."),
    task("join-country", "Books by Kazakh authors",
         "Show the `Title` and the author's `Name` of books whose author is from **Kazakhstan**." + TIP, "medium", O_JOIN,
         "SELECT Books.Title, Authors.Name FROM Books JOIN Authors ON Books.AuthorID = Authors.AuthorID WHERE Authors.Country = 'Kazakhstan';"),
    task("join-loans", "Who borrowed what",
         "Show the member's `Name` and the book's `Title` for every loan." + TIP, "medium", O_JOIN,
         "SELECT Members.Name, Books.Title FROM Loans JOIN Members ON Loans.MemberID = Members.MemberID JOIN Books ON Loans.BookID = Books.BookID;",
         hint="Loans links Members and Books — join all three."),
    task("join-order", "Loans in date order",
         "Show the `LoanDate`, member `Name` and book `Title` of every loan, **oldest loan first**." + TIP, "medium",
         O_JOIN + ["11.4.2.5"],
         "SELECT Loans.LoanDate, Members.Name, Books.Title FROM Loans JOIN Members ON Loans.MemberID = Members.MemberID JOIN Books ON Loans.BookID = Books.BookID ORDER BY Loans.LoanDate;",
         check="ordered"),
    task("join-not-returned", "Books not returned",
         "Show the book `Title` and the member `Name` for every loan that has **not been returned**." + TIP, "medium", O_JOIN,
         "SELECT Books.Title, Members.Name FROM Loans JOIN Books ON Loans.BookID = Books.BookID JOIN Members ON Loans.MemberID = Members.MemberID WHERE Loans.Returned = FALSE;"),
    task("join-member", "Aliya's books",
         "Show the `Title` of every book borrowed by the member **Aliya**." + TIP, "medium", O_JOIN,
         "SELECT Books.Title FROM Loans JOIN Books ON Loans.BookID = Books.BookID JOIN Members ON Loans.MemberID = Members.MemberID WHERE Members.Name = 'Aliya';"),
    task("join-genre", "Authors of fantasy",
         "Show the `Name` of each author who has written a **Fantasy** book. Each name should appear **once**." + TIP, "hard", O_JOIN,
         "SELECT DISTINCT Authors.Name FROM Authors JOIN Books ON Books.AuthorID = Authors.AuthorID WHERE Books.Genre = 'Fantasy';",
         hint="SELECT DISTINCT removes repeated rows."),
    task("join-count", "Books per author",
         "Show each author's `Name` and **how many books** by that author are in the library, sorted by name A–Z." + TIP,
         "hard", O_JOIN,
         "SELECT Authors.Name, COUNT(*) FROM Authors JOIN Books ON Books.AuthorID = Authors.AuthorID GROUP BY Authors.Name ORDER BY Authors.Name;",
         check="ordered"),
    task("join-three-class", "Three tables and a condition",
         "For loans by members of class **11A**, show the member `Name`, the book `Title` and the author's `Name`." + TIP,
         "hard", O_JOIN,
         "SELECT Members.Name, Books.Title, Authors.Name FROM Loans JOIN Members ON Loans.MemberID = Members.MemberID JOIN Books ON Loans.BookID = Books.BookID JOIN Authors ON Books.AuthorID = Authors.AuthorID WHERE Members.Class = '11A';"),
    task("join-never", "Books never borrowed",
         "Show the `Title` of every book that has **never** been borrowed." + TIP, "hard", O_JOIN,
         "SELECT Books.Title FROM Books LEFT JOIN Loans ON Loans.BookID = Books.BookID WHERE Loans.LoanID IS NULL;",
         hint="A LEFT JOIN keeps books without loans; their loan fields are NULL."),
    task("join-most", "Most active readers",
         "Show each member's `Name` and their **number of loans**, the member with the **most** loans first "
         "(members with the same number in name order A–Z). Show only members who have borrowed something." + TIP, "hard", O_JOIN,
         "SELECT Members.Name, COUNT(*) FROM Loans JOIN Members ON Loans.MemberID = Members.MemberID GROUP BY Members.Name ORDER BY COUNT(*) DESC, Members.Name;",
         check="ordered"),
    task("create-reviews", "A linked table for reviews",
         "Create a table **Reviews**: `ReviewID` (whole number, primary key), `BookID` (foreign key to **Books**), "
         "`MemberID` (foreign key to **Members**) and `Stars` (whole number from **1 to 5**)." + TIP,
         "hard", O_MULTI,
         "CREATE TABLE Reviews (ReviewID INT PRIMARY KEY, BookID INT REFERENCES Books(BookID), MemberID INT REFERENCES Members(MemberID), Stars INT CHECK (Stars BETWEEN 1 AND 5));",
         check="state", check_query=cols("Reviews"), check_label="The fields and data types are right",
         probes=["INSERT INTO Reviews VALUES (1, 1, 1, 5)", "INSERT INTO Reviews VALUES (2, 99, 1, 4)",
                 "INSERT INTO Reviews VALUES (3, 1, 99, 4)", "INSERT INTO Reviews VALUES (4, 1, 1, 6)"],
         probes_label="The keys and the 1–5 rule work"),
    task("create-two", "A database with two tables",
         "Create two linked tables for a football league: **Teams** (`TeamID` whole number primary key, `TeamName` text up to 40 "
         "characters, required) and **Players** (`PlayerID` whole number primary key, `Name` text up to 50 characters, "
         "`TeamID` a foreign key to **Teams**)." + TIP,
         "hard", O_MULTI,
         "CREATE TABLE Teams (TeamID INT PRIMARY KEY, TeamName VARCHAR(40) NOT NULL); CREATE TABLE Players (PlayerID INT PRIMARY KEY, Name VARCHAR(50), TeamID INT REFERENCES Teams(TeamID));",
         check="state",
         check_query="SELECT lower(table_name), lower(column_name), data_type, character_maximum_length, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND lower(table_name) IN ('teams', 'players') ORDER BY 1, ordinal_position",
         check_label="Both tables have the right fields",
         probes=["INSERT INTO Teams VALUES (1, 'Kairat'); INSERT INTO Players VALUES (1, 'Arman', 1)",
                 "INSERT INTO Players VALUES (2, 'Dias', 7)", "INSERT INTO Teams VALUES (2, NULL)"],
         probes_label="A player can only belong to an existing team", hint="Create Teams first — Players refers to it."),
    task("insert-loan", "Record a new loan",
         "Member **4** borrows book **7** on **2026-11-16**. Record the loan with ID **8**; it has not been returned yet." + TIP,
         "medium", ["11.4.2.3", "11.4.2.4"],
         "INSERT INTO Loans VALUES (8, 7, 4, '2026-11-16', FALSE);",
         check="state", check_query="SELECT * FROM Loans ORDER BY LoanID", check_label="The loan is recorded",
         hint="Dates are written as text: '2026-11-16'."),
    task("join-where-style", "Join with WHERE",
         "Show the `Title` and `Year` of books together with the author's `Country`, for books written **before 1900**." + TIP,
         "medium", O_JOIN,
         "SELECT Books.Title, Books.Year, Authors.Country FROM Books, Authors WHERE Books.AuthorID = Authors.AuthorID AND Books.Year < 1900;"),
]

# ------------------------------------------------- SQL implementation: an online shop
SHOP_SETUP = """
CREATE TABLE Customers (
  CustomerID INT PRIMARY KEY,
  FirstName VARCHAR(30) NOT NULL,
  LastName VARCHAR(30) NOT NULL,
  City VARCHAR(30)
);
CREATE TABLE Products (
  ProductCode CHAR(5) PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Price DECIMAL(8,2) NOT NULL,
  Stock INT NOT NULL
);
CREATE TABLE Orders (
  OrderID INT PRIMARY KEY,
  CustomerID INT NOT NULL REFERENCES Customers(CustomerID),
  OrderDate DATE NOT NULL
);
CREATE TABLE OrderItems (
  OrderID INT REFERENCES Orders(OrderID),
  ProductCode CHAR(5) REFERENCES Products(ProductCode),
  Quantity INT NOT NULL,
  PRIMARY KEY (OrderID, ProductCode)
);
INSERT INTO Customers VALUES
  (1, 'Aliya', 'Serikova', 'Almaty'), (2, 'Daniyar', 'Omarov', 'Astana'), (3, 'Madina', 'Akhmetova', 'Almaty'),
  (4, 'Arman', 'Kassymov', 'Shymkent'), (5, 'Zhanel', 'Bekova', 'Astana');
INSERT INTO Products VALUES
  ('AB102', 'Backpack', 18900.00, 12), ('CD210', 'Notebook', 450.00, 200), ('CD215', 'Sketchbook', 1200.00, 35),
  ('EF300', 'Calculator', 7600.00, 6), ('GH410', 'Headphones', 12500.00, 9), ('PN100', 'Gel pen', 300.00, 500);
INSERT INTO Orders VALUES
  (101, 1, '2026-10-02'), (102, 2, '2026-10-05'), (103, 1, '2026-10-09'), (104, 3, '2026-10-15');
INSERT INTO OrderItems VALUES
  (101, 'CD210', 4), (101, 'PN100', 10), (102, 'AB102', 1), (102, 'EF300', 1),
  (103, 'GH410', 1), (103, 'CD210', 2), (104, 'CD215', 3), (104, 'PN100', 5);
"""
O_ADD = ["11.5.4.7"]
O_GET = ["11.5.4.8"]
ORDER_STATE = ("SELECT o.OrderID, o.CustomerID, o.OrderDate, i.ProductCode, i.Quantity FROM Orders o "
               "LEFT JOIN OrderItems i ON i.OrderID = o.OrderID ORDER BY o.OrderID, i.ProductCode")
SHOP = [
    task("shop-customer", "Add a customer",
         "A new customer registers on the shop's website: ID **6**, **Timur Abenov** from **Karaganda**. "
         "Write the SQL statement the program sends to the database." + TIP,
         "easy", O_ADD, "INSERT INTO Customers VALUES (6, 'Timur', 'Abenov', 'Karaganda');",
         check="state", check_query="SELECT * FROM Customers ORDER BY CustomerID", check_label="The customer is stored"),
    task("shop-order", "Record an order",
         "Customer **2** orders **3** Notebooks (`CD210`) on **2026-11-16**. Record it as order **105**: "
         "first the order, then its item." + TIP,
         "medium", O_ADD,
         "INSERT INTO Orders VALUES (105, 2, '2026-11-16'); INSERT INTO OrderItems VALUES (105, 'CD210', 3);",
         check="state", check_query=ORDER_STATE, check_label="Order 105 and its item are stored",
         hint="The order must exist before its items (foreign key)."),
    task("shop-stock", "Update the stock",
         "After a sale, the stock of the Backpack (`AB102`) must go down by **3**. Write the UPDATE statement." + TIP,
         "easy", O_ADD, "UPDATE Products SET Stock = Stock - 3 WHERE ProductCode = 'AB102';",
         check="state", check_query="SELECT ProductCode, Stock FROM Products ORDER BY ProductCode", check_label="Only AB102's stock went down by 3"),
    task("shop-full-order", "A complete order",
         "Customer **5** buys **2** Calculators (`EF300`) and **1** pair of Headphones (`GH410`) on **2026-11-16**. "
         "Record order **106** with both items **and** reduce the stock of both products." + TIP,
         "hard", O_ADD,
         "INSERT INTO Orders VALUES (106, 5, '2026-11-16'); INSERT INTO OrderItems VALUES (106, 'EF300', 2), (106, 'GH410', 1); "
         "UPDATE Products SET Stock = Stock - 2 WHERE ProductCode = 'EF300'; UPDATE Products SET Stock = Stock - 1 WHERE ProductCode = 'GH410';",
         check="state",
         check_query=("SELECT 'order' AS part, OrderID::text AS a, CustomerID::text AS b, OrderDate::text AS c FROM Orders WHERE OrderID = 106 "
                      "UNION ALL SELECT 'item', ProductCode, Quantity::text, OrderID::text FROM OrderItems WHERE OrderID = 106 "
                      "UNION ALL SELECT 'stock', ProductCode, Stock::text, '' FROM Products ORDER BY 1, 2"),
         check_label="The order, its items and the stock are all right"),
    task("shop-city", "Customers from one city",
         "Show the `FirstName` and `LastName` of customers from **Almaty**, sorted by last name A–Z." + TIP,
         "easy", O_GET, "SELECT FirstName, LastName FROM Customers WHERE City = 'Almaty' ORDER BY LastName;", check="ordered"),
    task("shop-orders-names", "Orders with customer names",
         "Show the customer's `FirstName`, `LastName` and the `OrderDate` of every order, **newest first**." + TIP,
         "medium", O_GET + ["11.4.2.4"],
         "SELECT Customers.FirstName, Customers.LastName, Orders.OrderDate FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID ORDER BY Orders.OrderDate DESC;",
         check="ordered"),
    task("shop-bought", "What customer 1 bought",
         "Show the `Name` of every product bought by customer **1** and the `Quantity`, sorted by product name A–Z." + TIP,
         "hard", O_GET + ["11.4.2.4"],
         "SELECT Products.Name, OrderItems.Quantity FROM Orders JOIN OrderItems ON OrderItems.OrderID = Orders.OrderID JOIN Products ON Products.ProductCode = OrderItems.ProductCode WHERE Orders.CustomerID = 1 ORDER BY Products.Name;",
         check="ordered"),
    task("shop-best", "Best sellers",
         "Show each product's `Name` and the **total quantity sold**, the best seller first (equal totals in name order A–Z). Only products that have been sold." + TIP,
         "hard", O_GET,
         "SELECT Products.Name, SUM(OrderItems.Quantity) FROM OrderItems JOIN Products ON Products.ProductCode = OrderItems.ProductCode GROUP BY Products.Name ORDER BY SUM(OrderItems.Quantity) DESC, Products.Name;",
         check="ordered"),
    task("shop-value", "Value of each order",
         "Show each `OrderID` and the **total value** of the order (quantity × price, added up), sorted by OrderID." + TIP,
         "hard", O_GET,
         "SELECT OrderItems.OrderID, SUM(OrderItems.Quantity * Products.Price) FROM OrderItems JOIN Products ON Products.ProductCode = OrderItems.ProductCode GROUP BY OrderItems.OrderID ORDER BY OrderItems.OrderID;",
         check="ordered"),
    task("shop-low-stock", "Running out",
         "Show the `ProductCode`, `Name` and `Stock` of products with **fewer than 15** in stock, the lowest stock first." + TIP,
         "easy", O_GET, "SELECT ProductCode, Name, Stock FROM Products WHERE Stock < 15 ORDER BY Stock;", check="ordered"),
    task("shop-no-orders", "Customers who never ordered",
         "Show the `FirstName` and `LastName` of customers who have **never** placed an order." + TIP,
         "hard", O_GET + ["11.4.2.4"],
         "SELECT Customers.FirstName, Customers.LastName FROM Customers LEFT JOIN Orders ON Orders.CustomerID = Customers.CustomerID WHERE Orders.OrderID IS NULL;"),
    task("shop-cancel", "Cancel an order",
         "Order **103** is cancelled. Delete it from the database — its items first, then the order." + TIP,
         "medium", O_ADD, "DELETE FROM OrderItems WHERE OrderID = 103; DELETE FROM Orders WHERE OrderID = 103;",
         check="state", check_query=ORDER_STATE, check_label="Order 103 and its items are gone, nothing else",
         hint="The items refer to the order, so they go first."),
    task("shop-price-rise", "Raise some prices",
         "The prices of all products whose code starts with **CD** go up by **10%**." + TIP,
         "medium", O_ADD, "UPDATE Products SET Price = Price * 1.1 WHERE ProductCode LIKE 'CD%';",
         check="state", check_query="SELECT ProductCode, Price FROM Products ORDER BY ProductCode", check_label="Only the CD products cost 10% more"),
    task("shop-city-count", "Orders per city",
         "Show each `City` and the **number of orders** placed by customers from it, sorted by city A–Z. Only cities with orders." + TIP,
         "hard", O_GET + ["11.4.2.4"],
         "SELECT Customers.City, COUNT(*) FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID GROUP BY Customers.City ORDER BY Customers.City;",
         check="ordered"),
    task("shop-receipt", "A receipt",
         "The program prints a receipt for order **101**: show the product `Name`, `Quantity`, `Price` and the line total "
         "(`Quantity * Price`) for each item, sorted by product name." + TIP,
         "medium", O_GET,
         "SELECT Products.Name, OrderItems.Quantity, Products.Price, OrderItems.Quantity * Products.Price FROM OrderItems JOIN Products ON Products.ProductCode = OrderItems.ProductCode WHERE OrderItems.OrderID = 101 ORDER BY Products.Name;",
         check="ordered"),
]


def fill(tasks, setup):
    for t in tasks:
        t["content"]["sql"]["setup"] = setup.strip()
    return tasks


# Practice tasks left out of the lessons (each merged lesson has 20 run-and-check tasks).
NOT_IN_PRACTICE = {f"sqlw-{k}" for k in [
    "add-email", "drop-and-add", "rename-author", "add-default", "create-subjects",
    "select-all", "select-or", "insert-some", "delete-one", "select-between",
    "sum", "min-max", "order-price", "check-alter", "count",
    "join-where-style", "insert-loan", "join-genre", "join-member", "join-not-returned",
]}
# Old lesson → lesson of g11-sql after lessons 1+2 and 3+4 were merged.
NEW_LESSON = {1: 1, 2: 1, 3: 2, 4: 2}


def merge(path, groups):
    p = ROOT / "content/topics" / path
    d = json.loads(p.read_text())
    d["questions"] = [q for q in d["questions"] if not q["key"].startswith("sqlw-")]
    for les in d.get("lessons") or []:
        les["questions"] = [k for k in les["questions"] if not k.startswith("sqlw-")]
    for lesson, tasks in groups:
        for t in tasks:
            if t["key"] in NOT_IN_PRACTICE:
                t["practice"] = False
        d["questions"].extend(tasks)
        if lesson is not None:
            les = d["lessons"][NEW_LESSON[lesson] - 1]
            les["questions"] += [t["key"] for t in tasks if t["key"] not in NOT_IN_PRACTICE]
    p.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    groups = [(1, fill(L1, L1_SETUP)), (2, fill(L2, L2_SETUP)), (3, fill(L3, L3_SETUP)), (4, fill(L4, L4_SETUP))]
    for _, g in groups:
        assert len(g) == 15, len(g)
    merge("g11-sql.json", groups)
    shop = fill(SHOP, SHOP_SETUP)
    assert len(shop) == 15
    merge("g11-sql-implementation.json", [(None, shop)])
    keys = [t["key"] for _, g in groups for t in g] + [t["key"] for t in shop]
    assert len(keys) == len(set(keys))
    print(f"{len(keys)} SQL tasks written")
