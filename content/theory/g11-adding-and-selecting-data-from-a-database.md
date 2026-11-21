---
summary: Writing program code that connects to a database and adds records from a web form (INSERT, validation, prepared statements, SQL injection), extracting data with SELECT and processing the result set to show tables, searches and totals, and using two-dimensional arrays — terms, declaration, nested loops, row and column totals, choosing 1D or 2D — to hold table data in a program.
---
# Programs that talk to a database
@lo 11.5.4.7

Almost every useful web application **remembers** something: an online shop remembers orders, a school portal remembers marks, a clinic remembers appointments. A program on its own cannot do this — the values in its variables disappear when the script finishes running. A web script runs once for every request, from top to bottom, and then all of its variables are gone. To keep data between requests, between users and between days, the program must **store it in a database** and **read it back** when it is needed. In this topic you learn to write the program code that does both: code that **adds data** to a database (this lesson), code that **extracts data** from it (lesson 2), and the **two-dimensional arrays** that hold table-shaped data inside the program (lesson 3).

:::definition Database
An **organised, persistent collection of related data**, stored in **tables** (records and fields) so that it can be **searched, sorted and updated** easily by many users and programs.
:::

:::definition Database management system (DBMS)
The **software that stores and manages the database** and runs the SQL statements sent to it — for example **MySQL**, **MariaDB**, **PostgreSQL** or **SQLite**. A program never edits the data files directly; it **sends SQL to the DBMS**.
:::

## Three parts working together

A database-driven web application has three separate parts, often called **tiers**. The **browser** (client) shows the pages and the forms. The **web server** runs the **script** — in this course usually PHP, but the same ideas apply to Python, JavaScript (Node.js) or any other language. The **database server** (the DBMS) holds the tables. The script is the middle part: it receives the data typed into a form, turns it into an **SQL statement**, sends that statement to the DBMS, receives the answer, and builds an HTML page to send back to the browser.

:::svg Three tiers of a database-driven web application
<svg class="ads" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three boxes from left to right. The browser shows a form with Name and Grade and a Submit button. Arrow 1, HTTP request with form data, goes to the web server box containing the script add_student.php. Arrow 2, an SQL INSERT statement, goes from the script to the database server box with the Student table. Arrow 3, the result true or false or rows, returns from the database to the script. Arrow 4, an HTTP response with an HTML page, returns to the browser.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ads .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ads .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ads .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.ads .rq{stroke:var(--primary);stroke-width:2.5;fill:none}
    svg.ads .rs{stroke:var(--success);stroke-width:2.5;fill:none}
  </style>
  <defs>
    <marker id="adsA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="adsA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
  </defs>
  <text class="h" x="105" y="26" text-anchor="middle">1 Browser (client)</text>
  <rect class="bx" x="20" y="40" width="170" height="160" rx="8"/>
  <text class="t" x="34" y="66">Add a student</text>
  <text class="s" x="34" y="94">Name</text><rect class="pb" x="80" y="81" width="96" height="18" rx="3"/>
  <text class="s" x="34" y="122">Grade</text><rect class="pb" x="80" y="109" width="96" height="18" rx="3"/>
  <rect class="ok" x="34" y="144" width="72" height="26" rx="4"/><text class="t" x="70" y="162" text-anchor="middle">Submit</text>
  <text class="h" x="380" y="26" text-anchor="middle">2 Web server</text>
  <rect class="pb" x="290" y="40" width="180" height="160" rx="8"/>
  <text class="h" x="380" y="66" text-anchor="middle">add_student.php</text>
  <text class="t" x="304" y="92">read the form data</text>
  <text class="t" x="304" y="114">validate it</text>
  <text class="t" x="304" y="136">build and send SQL</text>
  <text class="t" x="304" y="158">check the result</text>
  <text class="t" x="304" y="180">output HTML</text>
  <text class="h" x="650" y="26" text-anchor="middle">3 Database server</text>
  <rect class="wn" x="560" y="40" width="180" height="160" rx="8"/>
  <text class="t" x="650" y="66" text-anchor="middle">DBMS (MySQL)</text>
  <rect class="bx" x="578" y="80" width="144" height="100" rx="4"/>
  <text class="s" x="590" y="100">Student</text>
  <text class="s" x="590" y="122">1 Aruzhan 11</text>
  <text class="s" x="590" y="142">2 Daniyar 12</text>
  <text class="s" x="590" y="162">3 Aigerim 11</text>
  <line class="rq" x1="190" y1="90" x2="286" y2="90" marker-end="url(#adsA1)"/>
  <text class="s" x="238" y="80" text-anchor="middle">form data</text>
  <line class="rs" x1="286" y1="170" x2="194" y2="170" marker-end="url(#adsA2)"/>
  <text class="s" x="238" y="190" text-anchor="middle">HTML page</text>
  <line class="rq" x1="470" y1="90" x2="556" y2="90" marker-end="url(#adsA1)"/>
  <text class="s" x="513" y="80" text-anchor="middle">SQL</text>
  <line class="rs" x1="556" y1="170" x2="474" y2="170" marker-end="url(#adsA2)"/>
  <text class="s" x="513" y="190" text-anchor="middle">result</text>
  <text class="t" x="380" y="240" text-anchor="middle">The browser never talks to the database directly — only the script does.</text>
  <text class="s" x="380" y="266" text-anchor="middle">The script sends SQL text; the DBMS runs it and returns true / false or a set of rows.</text>
</svg>
:::

This separation matters for **security** and for **reliability**. The user only ever sees the HTML that the script chooses to send. The password of the database account is written in the script on the server, so the user never sees it. And because every request passes through the script, the script can **check (validate) the data** before anything is stored.

## The example database

All examples in this topic use the database **school_db**. Its main table is **Student**. When you design the code you must know the table exactly — the **field names**, their **data types** and which field is the **primary key** — because the SQL in your program must match it character for character.

:::compare Table Student (database school_db)
| StudentID | Name | Grade | City | BirthDate |
|---|---|---|---|---|
| 1 | Aruzhan | 11 | Astana | 2009-03-14 |
| 2 | Daniyar | 12 | Almaty | 2008-07-02 |
| 3 | Aigerim | 11 | Almaty | 2009-11-25 |
| 4 | Timur | 10 | Astana | 2010-01-30 |
| 5 | Madina | 12 | Shymkent | 2008-05-19 |
:::

:::compare Fields of Student and their data types
| Field | Data type | Notes |
|---|---|---|
| StudentID | INT, **AUTO_INCREMENT**, PRIMARY KEY | The DBMS gives each new record the next number; the program does not supply it |
| Name | VARCHAR(50) | Text up to 50 characters — written in quotes in SQL |
| Grade | INT | A whole number — written without quotes |
| City | VARCHAR(30) | Text — in quotes |
| BirthDate | DATE | Written as text in the format `'YYYY-MM-DD'` |
:::

:::definition Primary key
A **field (or fields) whose value is unique for every record** and identifies it. If it is **AUTO_INCREMENT**, the DBMS creates the value automatically, so an INSERT leaves the field out.
:::

## Connecting to the database

Before a script can send any SQL it must open a **connection** to the DBMS. Opening a connection is like dialling a phone number: the script says **where** the server is, **who** it is (user name and password of a database account) and **which database** it wants to use. If any of these is wrong the connection fails, and the script must stop with a clear message instead of carrying on and producing confusing errors later.

:::definition Database connection
A **link between the program and the DBMS**, opened with the server address, a user name, a password and the database name. All SQL is sent **through the connection**, and it is **closed** when the script has finished.
:::

```php | connect.php — opening a connection with mysqli
<?php
$conn = mysqli_connect("localhost", "school_user", "secret", "school_db");
//                      server       user           password  database
if (!$conn) {                                   // the connection failed
    die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn, "utf8mb4");           // so Kazakh and Russian letters are stored correctly
?>
```

Line by line: `mysqli_connect()` returns a **connection object** when it succeeds, or **false** when it fails. The `if (!$conn)` test catches the failure; `die()` prints a message and **stops the script at once**; `mysqli_connect_error()` gives the reason (wrong password, unknown database, server switched off). Setting the character set to `utf8mb4` makes sure that names such as *Әлия* or *Жанар* are not turned into question marks. In a real project the connection code is written once in a file such as `connect.php` and **included** at the top of every script with `require "connect.php";`, so the password is stored in one place only.

## The pattern of every database script

Whatever the script does — add a student, list a class, delete a booking — it follows the same five steps. Learning this pattern is the most useful thing in the whole topic, because exam questions that say "write program code to add data" or "write program code to extract data" are marked against these steps.

:::steps Five steps of a database script
- **Connect** to the database — and stop with an error message if the connection fails.
- **Prepare the SQL** — an `INSERT` to add data or a `SELECT` to extract it, using the values from the form or the program.
- **Run (execute)** the statement — with `mysqli_query()` or, better, a **prepared statement**.
- **Check / process the result** — show a success or error message after an INSERT; loop through the returned rows after a SELECT.
- **Close** the connection — `mysqli_close($conn)`.
:::

:::mermaid Flow of a script that adds data
flowchart TD
  A[Form submitted] --> B[Connect to the database]
  B --> C{Connected?}
  C -- No --> X[Show error and stop]
  C -- Yes --> D[Read and validate the form data]
  D --> E{Data valid?}
  E -- No --> Y[Show what is wrong and the form again]
  E -- Yes --> F[Build the INSERT and execute it]
  F --> G{Success?}
  G -- Yes --> H[Show confirmation and new ID]
  G -- No --> Z[Show the database error]
  H --> I[Close the connection]
  Z --> I
:::

## The same ideas in other languages

The exam allows any programming language or pseudocode, so it helps to see that the steps are the same everywhere — only the function names change. Python, for example, has the built-in module `sqlite3`; a small desktop program for a school library could use it without any web server at all.

:::compare The five steps in PHP (mysqli) and Python (sqlite3)
| Step | PHP with mysqli | Python with sqlite3 |
|---|---|---|
| Connect | `$conn = mysqli_connect("localhost", "u", "p", "school_db");` | `conn = sqlite3.connect("school.db")` |
| Prepare | `$stmt = mysqli_prepare($conn, "INSERT … VALUES (?, ?)");` | `sql = "INSERT … VALUES (?, ?)"` |
| Run | `mysqli_stmt_bind_param($stmt, "si", $n, $g); mysqli_stmt_execute($stmt);` | `cur = conn.execute(sql, (n, g))` then `conn.commit()` |
| Check | `mysqli_insert_id($conn)` · `mysqli_error($conn)` | `cur.lastrowid` · `try … except sqlite3.Error` |
| Close | `mysqli_close($conn);` | `conn.close()` |
:::

One difference to notice: in Python's sqlite3 a change is only saved after `conn.commit()`. This is called a **transaction** — a group of changes that is saved together or not at all. MySQL with mysqli saves each statement automatically (*autocommit*) unless you start a transaction yourself.

# Writing INSERT statements in program code
@lo 11.5.4.7

Data is added to a table with the SQL statement **INSERT INTO**. In the SQL topic you wrote INSERT statements by hand in a database tool. Now the statement is **built by the program**: the column names are fixed, but the **values come from variables** — usually from the fields of a form that the user has just submitted.

:::definition INSERT statement
The SQL statement that **adds one or more new records** to a table: `INSERT INTO table (field1, field2, …) VALUES (value1, value2, …);` The values are given **in the same order as the fields** listed.
:::

## The three forms of INSERT

:::compare Forms of the INSERT statement
| Form | Example | When to use it |
|---|---|---|
| All fields, in table order | `INSERT INTO Student VALUES (6, 'Nursultan', 11, 'Astana', '2009-09-01');` | Rarely — it breaks if a field is added to the table, and you must supply the key |
| **Named fields** (recommended) | `INSERT INTO Student (Name, Grade, City) VALUES ('Nursultan', 11, 'Astana');` | Almost always — clear, safe, the auto-increment key is left out |
| Several records at once | `INSERT INTO Student (Name, Grade) VALUES ('Ali', 10), ('Dana', 12);` | Loading a list of records in one statement |
:::

With the **named-fields** form, any field that is not listed gets its **default value** or **NULL** (no value). That is why the auto-increment `StudentID` is left out: the DBMS fills it in. If you list a field, you must give a value for it, and the number of values must equal the number of fields — otherwise the DBMS reports *"Column count doesn't match value count"*.

## Writing the values correctly

The values in an INSERT follow strict rules, and most errors in student code break one of them:

:::compare How values are written in SQL
| Kind of value | Written as | Example | Wrong |
|---|---|---|---|
| Text (VARCHAR, CHAR) | In **single quotes** | `'Astana'` | `Astana` (taken as a field name) |
| Whole or decimal number | **No quotes** | `11`, `1250.50` | `'11'` (works in MySQL, but is text) |
| Date | Text in **ISO format** | `'2009-03-14'` | `'14.03.2009'` |
| Boolean | `TRUE` / `FALSE` or `1` / `0` | `TRUE` | `'yes'` |
| No value | `NULL` (no quotes) | `NULL` | `'NULL'` (the text "NULL") |
:::

A text value that itself contains an apostrophe — the surname **O'Brien** or the café name **Ana's** — ends the quoted text too early and breaks the SQL. This harmless example is the first sign of a serious danger, **SQL injection**, which is explained in the next section.

## Building the SQL string from variables

In PHP a string in **double quotes** replaces variable names with their values, so an INSERT can be built like this:

```php | Building an INSERT from variables (the simple way — see the next section for the safe way)
<?php
$name  = "Nursultan";
$grade = 11;
$city  = "Astana";

$sql = "INSERT INTO Student (Name, Grade, City) VALUES ('$name', $grade, '$city')";
echo $sql;   // INSERT INTO Student (Name, Grade, City) VALUES ('Nursultan', 11, 'Astana')

if (mysqli_query($conn, $sql)) {
    echo "New record created. ID = " . mysqli_insert_id($conn);
} else {
    echo "Error: " . mysqli_error($conn);
}
?>
```

Notice the **single quotes inside the double-quoted PHP string**: `'$name'` becomes `'Nursultan'` — the quotes are part of the SQL, telling the DBMS that this value is text. `$grade` has no quotes because it is a number. Printing the finished `$sql` with `echo` is the quickest way to **debug** an INSERT: you see exactly what the DBMS receives, and a missing quote or comma is obvious.

## Checking that the INSERT worked

An INSERT can fail for many reasons: a duplicate primary key, a value too long for its field, a missing required field, a wrong field name, a lost connection. The program must never assume success. These functions tell it what happened:

:::compare Functions that report the result of an INSERT
| Function | Returns | Use |
|---|---|---|
| `mysqli_query($conn, $sql)` | **true** if the statement ran, **false** if it failed | The condition in `if (…)` |
| `mysqli_insert_id($conn)` | The **auto-increment ID** of the record just added | Show "Your booking number is 128" or use it in a second INSERT |
| `mysqli_affected_rows($conn)` | How many records were **added / changed** | 3 after inserting three rows at once |
| `mysqli_error($conn)` | The DBMS's **error message** | Shown while testing; logged in a real system |
:::

The new ID is very useful when one action adds data to **two related tables**. For example, a new order is inserted into `Orders`, then `mysqli_insert_id()` gives its `OrderID`, which is used as the **foreign key** when the order lines are inserted into `OrderLine`.

## From form field to table column

The HTML form, the script and the table are linked by **names**. The `name` attribute of each input becomes a key in `$_POST`; the script copies it into a variable; the variable's value is placed in the VALUES list in the position of the matching column. If any link in this chain uses a different spelling, the data is lost or the SQL fails.

:::svg How a value travels from the form to the table
<svg class="ads" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four columns linked by arrows. Column 1 is the HTML input name equals title. Column 2 is the PHP array element dollar underscore POST title holding Clean Code. Column 3 is the variable dollar title after trim. Column 4 is the column Title in the INSERT statement, INSERT INTO Book open bracket Title, Author, Year close bracket VALUES open bracket question mark, question mark, question mark close bracket. A second row shows input name year becoming dollar underscore POST year, then int cast into dollar year equals 2008, then column Year. Bottom note: the same name links each step; a typing mistake breaks the chain.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ads .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ads .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ads .rq{stroke:var(--primary);stroke-width:2.5;fill:none}
  </style>
  <defs><marker id="adsB1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="h" x="95" y="26" text-anchor="middle">HTML form</text>
  <text class="h" x="285" y="26" text-anchor="middle">$_POST array</text>
  <text class="h" x="470" y="26" text-anchor="middle">PHP variable</text>
  <text class="h" x="655" y="26" text-anchor="middle">Table column</text>
  <rect class="bx" x="15" y="44" width="160" height="56" rx="6"/>
  <text class="c" x="25" y="68">name="title"</text><text class="s" x="25" y="88">typed: Clean Code</text>
  <rect class="pb" x="205" y="44" width="160" height="56" rx="6"/>
  <text class="c" x="215" y="68">$_POST["title"]</text><text class="s" x="215" y="88">"Clean Code"</text>
  <rect class="pb" x="395" y="44" width="150" height="56" rx="6"/>
  <text class="c" x="405" y="68">$title</text><text class="s" x="405" y="88">trim(…)</text>
  <rect class="ok" x="575" y="44" width="165" height="56" rx="6"/>
  <text class="c" x="585" y="68">Title</text><text class="s" x="585" y="88">VARCHAR(80)</text>
  <rect class="bx" x="15" y="124" width="160" height="56" rx="6"/>
  <text class="c" x="25" y="148">name="year"</text><text class="s" x="25" y="168">typed: 2008</text>
  <rect class="pb" x="205" y="124" width="160" height="56" rx="6"/>
  <text class="c" x="215" y="148">$_POST["year"]</text><text class="s" x="215" y="168">"2008" (text!)</text>
  <rect class="pb" x="395" y="124" width="150" height="56" rx="6"/>
  <text class="c" x="405" y="148">$year</text><text class="s" x="405" y="168">(int) → 2008</text>
  <rect class="ok" x="575" y="124" width="165" height="56" rx="6"/>
  <text class="c" x="585" y="148">Year</text><text class="s" x="585" y="168">INT</text>
  <line class="rq" x1="175" y1="72" x2="201" y2="72" marker-end="url(#adsB1)"/>
  <line class="rq" x1="365" y1="72" x2="391" y2="72" marker-end="url(#adsB1)"/>
  <line class="rq" x1="545" y1="72" x2="571" y2="72" marker-end="url(#adsB1)"/>
  <line class="rq" x1="175" y1="152" x2="201" y2="152" marker-end="url(#adsB1)"/>
  <line class="rq" x1="365" y1="152" x2="391" y2="152" marker-end="url(#adsB1)"/>
  <line class="rq" x1="545" y1="152" x2="571" y2="152" marker-end="url(#adsB1)"/>
  <rect class="bx" x="15" y="200" width="725" height="34" rx="6"/>
  <text class="c" x="30" y="222">INSERT INTO Book (Title, Author, Year) VALUES (?, ?, ?)   ← same order as the variables bound</text>
  <text class="s" x="380" y="256" text-anchor="middle">Every value from a form arrives as text; numbers are converted with (int) or (float) before they are stored.</text>
</svg>
:::

:::example Worked example 1 — adding a book to the school library
**Scenario.** The library of NIS Astana keeps its catalogue in a table `Book (BookID INT AUTO_INCREMENT PK, Title VARCHAR(80), Author VARCHAR(60), Year INT, Copies INT)`. The librarian adds new books with a form whose inputs are named `title`, `author`, `year` and `copies`. Write the code that adds the book.

**Step 1 — decide the SQL.** BookID is auto-increment, so it is left out. The statement is `INSERT INTO Book (Title, Author, Year, Copies) VALUES (…, …, …, …)` — four fields, four values, text in quotes, numbers without.

**Step 2 — read the form data into variables**, trimming spaces from text and converting numbers:
`$title = trim($_POST["title"]); $author = trim($_POST["author"]); $year = (int)$_POST["year"]; $copies = (int)$_POST["copies"];`

**Step 3 — build and run the statement.** For the book *Abai Zholy* by *Mukhtar Auezov*, 1942, 5 copies, the SQL that reaches the DBMS is
`INSERT INTO Book (Title, Author, Year, Copies) VALUES ('Abai Zholy', 'Mukhtar Auezov', 1942, 5)`.

**Step 4 — check the result.** If the statement succeeds, `mysqli_insert_id($conn)` returns, say, **214**, and the page shows *"Book added with number 214"*. If it fails, the page shows the error so the librarian knows the book was **not** saved.

**Step 5 — close** the connection with `mysqli_close($conn)`.

**Why this order matters:** reading and converting the data *before* building the SQL means the values in the statement already have the right type; checking the result means the user is never told "saved" when nothing was saved.
:::

## Adding many records with a loop

Sometimes the data to insert is already in the program — for example a list of new pupils typed into one text area, or the rows read from a CSV file. Then the same INSERT is executed **once for every item** in a loop. With a prepared statement (next section) the statement is prepared once and executed many times, which is both safe and fast.

```php | Inserting every pupil from an array
<?php
$newPupils = [["Ali", 10], ["Dana", 12], ["Erlan", 11]];   // a 2D array: [name, grade]
$stmt = mysqli_prepare($conn, "INSERT INTO Student (Name, Grade) VALUES (?, ?)");
$added = 0;
foreach ($newPupils as $p) {
    mysqli_stmt_bind_param($stmt, "si", $p[0], $p[1]);
    if (mysqli_stmt_execute($stmt)) {
        $added++;
    }
}
echo "$added pupils added.";      // 3 pupils added.
?>
```

## Changing and removing data

Adding is the most common write operation, but the same code pattern is used to **change** a record with `UPDATE` and to **remove** one with `DELETE`. Both must include a **WHERE** clause that picks the record, normally by its primary key. Without WHERE, the statement affects **every record in the table** — one of the most expensive mistakes a programmer can make.

:::compare The three statements that change data
| Statement | Purpose | Example |
|---|---|---|
| `INSERT INTO … VALUES …` | Add new records | `INSERT INTO Student (Name, Grade) VALUES ('Dana', 12)` |
| `UPDATE … SET … WHERE …` | Change values in existing records | `UPDATE Student SET City = 'Almaty' WHERE StudentID = 4` |
| `DELETE FROM … WHERE …` | Remove records | `DELETE FROM Student WHERE StudentID = 4` |
:::

# Validating form data and preventing SQL injection
@lo 11.5.4.7

Everything that arrives from a form is **untrusted**. A user may leave a field empty, type letters into a number field, enter an age of 250, or — deliberately — type text designed to attack the database. Before a program adds data to a database it must do two separate jobs: **validate** the data (is it sensible?) and **send it safely** (can it change the meaning of the SQL?). These are different problems with different solutions, and exam questions often ask you to explain both.

## Validation before INSERT

:::definition Validation
An **automatic check by the program that data is sensible and follows the rules** (present, right type, in range, right length or format) **before it is processed or stored**. Validation cannot prove that data is *correct* — only that it is *reasonable*.
:::

The database protects itself a little — a field declared `INT` will not accept *"abc"*, and `NOT NULL` rejects an empty value — but the error messages of the DBMS are technical and unfriendly. A program that validates first can tell the user exactly what is wrong (*"Grade must be between 7 and 12"*) and show the form again with the other values still filled in.

:::compare Validation checks used before adding data
| Check | What it tests | PHP example | Data rejected |
|---|---|---|---|
| **Presence** | A value was entered | `$name !== ""` | an empty name |
| **Type** | The value is a number / date | `is_numeric($_POST["grade"])` | `"eleven"` |
| **Range** | A number is between limits | `$grade >= 7 && $grade <= 12` | `15` |
| **Length** | Text is not too long / short | `strlen($name) <= 50` | a 70-character name |
| **Format** | Text matches a pattern | `preg_match('/^\+7\d{10}$/', $phone)` | `8-701-123` |
| **Lookup** | The value is in a list | `in_array($city, ["Astana", "Almaty", "Shymkent"])` | `"Paris"` |
:::

Validation in the **browser** (HTML attributes such as `required`, `min`, `max`, `maxlength`, `type="email"`) is convenient — the user gets an instant message — but it can be **switched off or bypassed** by anyone who sends the request directly. So the rule for every database program is: browser validation is a convenience, **server-side validation in the script is compulsory**.

:::compare Client-side and server-side validation
| | Client-side (in the browser) | Server-side (in the script) |
|---|---|---|
| Written with | HTML attributes, JavaScript | PHP / Python code before the INSERT |
| Speed | Instant, no request sent | Needs a round trip to the server |
| Can be bypassed? | **Yes** — disable JavaScript, edit the HTML, send a request directly | **No** — the user cannot change the script |
| Purpose | Helps the user | **Protects the database** |
:::

A good script collects **all** error messages in an array instead of stopping at the first one, so the user can fix every problem at once:

```php | Collecting validation errors before inserting
<?php
$name  = trim($_POST["name"] ?? "");
$grade = $_POST["grade"] ?? "";
$errors = [];

if ($name === "")                          $errors[] = "Enter a name.";
elseif (strlen($name) > 50)                $errors[] = "The name is too long (max 50).";
if (!is_numeric($grade))                   $errors[] = "Grade must be a number.";
elseif ($grade < 7 || $grade > 12)         $errors[] = "Grade must be between 7 and 12.";

if (count($errors) > 0) {
    foreach ($errors as $e) echo "<p class='error'>$e</p>";
    exit;                                   // nothing is inserted
}
// … only now build and run the INSERT
?>
```

## SQL injection — how the attack works

:::definition SQL injection
An attack in which a user **types SQL code into an input** so that, when the program **joins the input into its SQL string**, the code becomes **part of the statement** and is executed by the DBMS — for example to read, change or delete data.
:::

Look again at the simple INSERT built by joining strings: `"INSERT INTO Student (Name, Grade) VALUES ('$name', $grade)"`. The program *expects* `$name` to be a name. But suppose that instead of a name the user types:

`x', 0); DELETE FROM Student; --`

After PHP replaces `$name`, the text sent to the DBMS is:

`INSERT INTO Student (Name, Grade) VALUES ('x', 0); DELETE FROM Student; --', 11)`

The user's apostrophe **closed the text value early**; `0);` finished the INSERT; `DELETE FROM Student;` is a **second statement**; and `--` turns the rest of the line into a comment so the leftover characters cause no error. If the database accepts several statements at once, the whole Student table is emptied. Other injections bypass a login check (`' OR '1'='1`), read other users' data, or change marks. The root cause is always the same: **data and code are mixed in one string**, so the DBMS cannot tell which part the programmer wrote and which part the user typed.

:::svg Joining strings versus a prepared statement
<svg class="ads" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top half, labelled unsafe, joined string: the program text INSERT INTO Student Name VALUES open quote is followed by the user's input x quote semicolon DELETE FROM Student semicolon dash dash. The DBMS receives one string and runs two statements: the insert and the delete, shown in red. Bottom half, labelled safe, prepared statement: step 1 the SQL with a question mark placeholder is sent and compiled first; step 2 the user's input is sent separately as data. The DBMS stores the whole input as the name text and nothing is executed, shown in green.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ads .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.ads .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ads .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ads .rq{stroke:var(--primary);stroke-width:2.5;fill:none}
  </style>
  <defs><marker id="adsC1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="h" x="20" y="24">Unsafe — the input is joined into the SQL string</text>
  <rect class="pb" x="20" y="36" width="300" height="34" rx="5"/>
  <text class="c" x="30" y="58">INSERT … VALUES ('</text>
  <rect class="bad" x="320" y="36" width="300" height="34" rx="5"/>
  <text class="c" x="330" y="58">x'); DELETE FROM Student; --</text>
  <text class="s" x="170" y="88" text-anchor="middle">written by the programmer</text>
  <text class="s" x="470" y="88" text-anchor="middle">typed by the user</text>
  <line class="rq" x1="640" y1="53" x2="676" y2="53" marker-end="url(#adsC1)"/>
  <rect class="bad" x="680" y="30" width="66" height="46" rx="6"/>
  <text class="t" x="713" y="50" text-anchor="middle">DBMS</text><text class="s" x="713" y="68" text-anchor="middle">runs 2</text>
  <text class="t" x="20" y="120">The DBMS sees one string and cannot tell code from data → table deleted.</text>
  <line x1="20" y1="142" x2="740" y2="142" style="stroke:var(--border);stroke-width:1.5"/>
  <text class="h" x="20" y="170">Safe — prepared statement: SQL and data are sent separately</text>
  <rect class="pb" x="20" y="184" width="400" height="34" rx="5"/>
  <text class="c" x="30" y="206">1  INSERT INTO Student (Name) VALUES (?)</text>
  <text class="s" x="430" y="206">compiled first — its meaning is fixed</text>
  <rect class="ok" x="20" y="232" width="400" height="34" rx="5"/>
  <text class="c" x="30" y="254">2  data: "x'); DELETE FROM Student; --"</text>
  <text class="s" x="430" y="254">sent later, only ever treated as a value</text>
  <rect class="ok" x="20" y="282" width="720" height="34" rx="5"/>
  <text class="t" x="30" y="304">Result: one new student whose Name is the strange text. No DELETE is run — nothing can be injected.</text>
</svg>
:::

## Prepared statements — the defence

:::definition Prepared statement
An SQL statement **sent to the DBMS with placeholders (`?`) instead of values**; it is **compiled first**, then the values are **bound and sent separately**, so user input is **always treated as data and can never change the SQL**.
:::

A prepared statement works in three steps. **Prepare:** the SQL with question marks is sent to the DBMS, which checks and compiles it — from this moment the structure of the statement (which table, which fields, how many values) is fixed. **Bind:** the program tells the DBMS which variables fill the placeholders and of what type. **Execute:** the values are sent and the statement runs. Because the values arrive after the statement has been compiled, an apostrophe or a semicolon inside them is just a character in the text, exactly like a letter. The name *O'Brien* is stored correctly, and the injection above is stored as a very odd name — harmless.

```php | add_student.php — the complete, safe version
<?php
require "connect.php";                                         // step 1 connect

$name  = trim($_POST["name"] ?? "");                           // read
$grade = (int)($_POST["grade"] ?? 0);
$city  = trim($_POST["city"] ?? "");

if ($name === "" || $grade < 7 || $grade > 12) {               // validate
    die("Please enter a name and a grade between 7 and 12.");
}

$sql  = "INSERT INTO Student (Name, Grade, City) VALUES (?, ?, ?)";   // step 2 prepare
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sis", $name, $grade, $city);    // bind: s = string, i = integer

if (mysqli_stmt_execute($stmt)) {                              // step 3 run
    echo "Student added with ID " . mysqli_insert_id($conn);   // step 4 check
} else {
    echo "Error: " . mysqli_stmt_error($stmt);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);                                           // step 5 close
?>
```

The first argument of `mysqli_stmt_bind_param` is a **type string** with one letter per placeholder, in order: here `"sis"` means *string, integer, string* for Name, Grade, City.

:::compare Bind types for mysqli_stmt_bind_param
| Letter | Type | Used for |
|---|---|---|
| `s` | string | names, cities, e-mail addresses, **dates** (`'2026-03-14'`) |
| `i` | integer | grade, quantity, year, ID |
| `d` | double (decimal number) | price, temperature, average |
| `b` | blob (binary data) | files, images — rarely used in this course |
:::

:::compare Ways to put user data into SQL
| Method | Safe from injection? | Comment |
|---|---|---|
| Join the input into the string: `"… VALUES ('$name')"` | **No** | Never use it with data from users |
| Escape the text: `mysqli_real_escape_string($conn, $name)` | Partly | Adds `\` before quotes; easy to forget for one field; numbers still need checking |
| Convert numbers: `(int)$_POST["grade"]` | Yes, for numbers only | Good extra step, but does not help with text |
| **Prepared statement with placeholders** | **Yes** | The recommended method for every query that uses input |
:::

:::example Worked example 2 — booking an appointment at a clinic
**Scenario.** A clinic in Karaganda lets patients book online. The table is `Appointment (ApptID INT AUTO_INCREMENT PK, PatientName VARCHAR(60), Phone VARCHAR(12), ApptDate DATE, Doctor VARCHAR(40))`. The form sends `pname`, `phone`, `adate` and `doctor`.

**Step 1 — validation rules.** Name present and at most 60 characters; phone in the format `+7` followed by 10 digits; date not in the past; doctor one of *Therapist*, *Dentist*, *Pediatrician* (lookup check).

**Step 2 — the code.**
`$errors = [];`
`if ($pname === "" || strlen($pname) > 60) $errors[] = "Enter your name.";`
`if (!preg_match('/^\+7\d{10}$/', $phone)) $errors[] = "Phone must look like +77011234567.";`
`if ($adate < date("Y-m-d")) $errors[] = "Choose a future date.";`
`if (!in_array($doctor, ["Therapist", "Dentist", "Pediatrician"])) $errors[] = "Choose a doctor.";`

**Step 3 — trace three submissions.**

| Input | Errors | Result |
|---|---|---|
| Saule Bekova, +77015552233, 2026-12-03, Dentist | none | INSERT runs; *"Booking 87 confirmed"* |
| (empty), +77015552233, 2026-12-03, Dentist | "Enter your name." | nothing inserted; form shown again |
| `a'); DROP TABLE Appointment; --`, +77010000000, 2026-12-04, Therapist | none (it is a name under 60 characters) | the **prepared statement** stores it as plain text — the table is **not** dropped |

**Step 4 — the INSERT.** `$stmt = mysqli_prepare($conn, "INSERT INTO Appointment (PatientName, Phone, ApptDate, Doctor) VALUES (?, ?, ?, ?)"); mysqli_stmt_bind_param($stmt, "ssss", $pname, $phone, $adate, $doctor);` — four placeholders, four letters, the date bound as a string.

**Lesson from the trace:** validation and prepared statements do different jobs. Validation stopped the empty name but could not stop the attack (it *looked* like a valid name); the prepared statement made the attack harmless.
:::

## Showing stored data safely

The danger runs in both directions. Text stored in the database is later **displayed on a page**; if a user saved `<script>…</script>` as their name, displaying it unchanged would run that script in every visitor's browser (an attack called **cross-site scripting, XSS**). When data from the database is written into HTML it is passed through `htmlspecialchars()`, which turns `<` into `&lt;` and so displays the text instead of running it. Remember the pair: **prepared statements when data goes in, `htmlspecialchars()` when data comes out**.

:::warning Common mistakes when adding data
- **Quotes**: forgetting the single quotes around text values (`VALUES ($name)`) or putting them around a placeholder (`VALUES ('?')` — the `?` must be bare).
- **Listing the auto-increment key** in the INSERT and giving it a value — the DBMS should create it.
- **Field and value counts differ**: three fields listed, two values given.
- **Wrong bind string**: `"ss"` for three placeholders, or `"i"` for a name — one letter per `?`, in order.
- **Not checking the result** — printing "Saved!" whether or not the INSERT succeeded.
- **Trusting browser validation** (`required`, `min`) and not validating again in the script.
- **Thinking validation stops SQL injection** — it does not; only placeholders do.
- **Dates in local format** (`'14.03.2026'`) instead of `'2026-03-14'`.
- Forgetting a **WHERE** clause in an UPDATE or DELETE, which changes every record.
:::

# Exam practice: adding data to a database
@lo 11.5.4.7

**Q1: The table `Member (MemberID INT AUTO_INCREMENT, FullName VARCHAR(50), Age INT, Club VARCHAR(20))` stores the members of school clubs. Write an SQL statement to add the member Alikhan Serikov, age 16, in the Robotics club. [3]**
`INSERT INTO Member (FullName, Age, Club)` (1) `VALUES ('Alikhan Serikov', 16, 'Robotics');` (1) — text in quotes, number without quotes, MemberID left out because it is auto-increment (1).

**Q2: State the five steps that a program follows to add data to a database. [5]**
Connect to the database (1); prepare / build the INSERT statement using the input values (1); execute / run the statement (1); check the result and show a success or error message (1); close the connection (1).

**Q3: A form sends the fields `fname` and `age` to a PHP script. Write program code that adds the data to the table Member using a prepared statement. [5]**
`$fname = trim($_POST["fname"]); $age = (int)$_POST["age"];` — reads both values (1). `$stmt = mysqli_prepare($conn, "INSERT INTO Member (FullName, Age) VALUES (?, ?)");` — INSERT with placeholders (1). `mysqli_stmt_bind_param($stmt, "si", $fname, $age);` — correct types in order (1). `if (mysqli_stmt_execute($stmt))` — executes (1) `echo "Added"; else echo "Error";` — checks the result (1).

**Q4: Explain how SQL injection can happen when a program adds form data to a database, and how it is prevented. [4]**
The program joins the user's input directly into the SQL string (1); the user types SQL code (e.g. a quote followed by `DELETE …`) that becomes part of the statement and is executed (1). Prevented with prepared statements / parameterised queries (1): the SQL with placeholders is compiled first and the input is sent separately, so it is always treated as data, never as code (1).

**Q5: Give two reasons why the script must validate data even though the form uses the HTML attributes `required` and `max`. [2]**
Browser checks can be switched off / bypassed by editing the page or sending the request directly (1); invalid data in the database would cause wrong results / errors later, and only the server-side script is under the programmer's control (1).

**Q6: Describe the purpose of `mysqli_insert_id()` and give an example of when it is needed. [2]**
It returns the auto-increment primary key of the record just inserted (1), e.g. to show the customer their order number, or to use the new OrderID as the foreign key when inserting the order lines (1).

:::warning Common mistakes in exam answers
- Writing `INSERT INTO Member VALUES (…)` with fewer values than fields — always **name the fields**.
- Writing only the SQL when the question asks for **program code** — show reading the input, running the statement and checking the result.
- Saying "validation prevents SQL injection" — the mark is for **prepared statements / parameterised queries**.
- Answering "SQL injection is a virus" — it is an **input** that becomes **part of an SQL statement**.
:::

:::steps Check yourself
- Name the three tiers of a database web application and say which one sends SQL.
- Write the code that connects to `school_db` and stops with a message if it fails.
- Write an INSERT for the Student table with a name, grade and birth date — which values need quotes?
- Explain why the auto-increment key is left out of an INSERT.
- List four validation checks and give an example of data each one rejects.
- Explain, step by step, how the input `x'); DELETE FROM Student; --` can delete a table.
- Write the prepared-statement version and its bind string.
- What do `mysqli_insert_id()` and `mysqli_affected_rows()` return?
:::

# Writing SELECT queries for a program
@lo 11.5.4.8

Storing data is only half of the job. A database is valuable because a program can **extract exactly the data it needs** — the pupils of one class, the books by one author, the appointments for tomorrow — in the order it wants, and turn them into a page, a report or a calculation. Data is extracted with the SQL statement **SELECT**. In this lesson the SELECT is written **inside a program**: the program builds the query (often from what the user typed into a search form), sends it to the DBMS, receives a **result set**, and processes it row by row.

:::definition SELECT query
An SQL statement that **extracts data from one or more tables** without changing them: `SELECT fields FROM table WHERE condition ORDER BY field;` It returns a **result set**.
:::

:::definition Result set
The **table of rows and columns returned by a SELECT** — only the chosen fields of the records that meet the condition. It may contain **many rows, one row or none**.
:::

## The clauses of SELECT

A SELECT is built from clauses that are always written in the same order. Each clause answers one question about the data you want.

:::compare The clauses of SELECT, in the order they are written
| Clause | Question it answers | Example |
|---|---|---|
| `SELECT` | Which **fields** (columns)? | `SELECT Name, Grade` · `SELECT *` = all fields |
| `FROM` | Which **table(s)**? | `FROM Student` |
| `WHERE` | Which **records** (rows)? | `WHERE Grade = 11 AND City = 'Almaty'` |
| `GROUP BY` | Group records for a total per group | `GROUP BY City` |
| `ORDER BY` | In what **order**? | `ORDER BY Name ASC` (A→Z) · `DESC` (Z→A, high→low) |
| `LIMIT` | How many rows at most? | `LIMIT 10` — the first ten |
:::

The most important idea is the difference between **SELECT** and **WHERE**: SELECT chooses **columns**, WHERE chooses **rows**. A query that shows the names of grade 11 students keeps only the *Name* column (SELECT) and only the rows with *Grade = 11* (WHERE).

:::svg SELECT chooses columns, WHERE chooses rows
<svg class="ads" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="On the left the Student table with five rows and columns StudentID, Name, Grade, City. The Name and City columns are shaded blue because they are chosen by SELECT Name, City. Rows 1 and 3, where Grade is 11, are outlined green because they are chosen by WHERE Grade equals 11. An arrow goes to the right to the result set: a small table with columns Name and City and two rows, Aigerim Almaty and Aruzhan Astana, sorted by ORDER BY Name.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1}
    svg.ads .col{fill:var(--primary-soft);stroke:none}
    svg.ads .row{fill:none;stroke:var(--success);stroke-width:2.5}
    svg.ads .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ads .rq{stroke:var(--primary);stroke-width:2.5;fill:none}
  </style>
  <defs><marker id="adsD1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="c" x="20" y="24">SELECT Name, City FROM Student WHERE Grade = 11 ORDER BY Name</text>
  <rect class="bx" x="20" y="44" width="420" height="180"/>
  <rect class="col" x="110" y="44" width="110" height="180"/>
  <rect class="col" x="310" y="44" width="130" height="180"/>
  <text class="h" x="30" y="66">ID</text><text class="h" x="120" y="66">Name</text><text class="h" x="230" y="66">Grade</text><text class="h" x="320" y="66">City</text>
  <line x1="20" y1="76" x2="440" y2="76" style="stroke:var(--border)"/>
  <text class="t" x="30" y="98">1</text><text class="t" x="120" y="98">Aruzhan</text><text class="t" x="230" y="98">11</text><text class="t" x="320" y="98">Astana</text>
  <text class="t" x="30" y="126">2</text><text class="t" x="120" y="126">Daniyar</text><text class="t" x="230" y="126">12</text><text class="t" x="320" y="126">Almaty</text>
  <text class="t" x="30" y="154">3</text><text class="t" x="120" y="154">Aigerim</text><text class="t" x="230" y="154">11</text><text class="t" x="320" y="154">Almaty</text>
  <text class="t" x="30" y="182">4</text><text class="t" x="120" y="182">Timur</text><text class="t" x="230" y="182">10</text><text class="t" x="320" y="182">Astana</text>
  <text class="t" x="30" y="210">5</text><text class="t" x="120" y="210">Madina</text><text class="t" x="230" y="210">12</text><text class="t" x="320" y="210">Shymkent</text>
  <rect class="row" x="22" y="81" width="416" height="26" rx="3"/>
  <rect class="row" x="22" y="137" width="416" height="26" rx="3"/>
  <text class="s" x="165" y="244" text-anchor="middle">blue = columns from SELECT</text>
  <text class="s" x="345" y="244" text-anchor="middle">green = rows from WHERE</text>
  <line class="rq" x1="450" y1="130" x2="516" y2="130" marker-end="url(#adsD1)"/>
  <text class="h" x="630" y="74" text-anchor="middle">Result set</text>
  <rect class="ok" x="520" y="86" width="220" height="90" rx="4"/>
  <text class="h" x="532" y="108">Name</text><text class="h" x="642" y="108">City</text>
  <text class="t" x="532" y="134">Aigerim</text><text class="t" x="642" y="134">Almaty</text>
  <text class="t" x="532" y="160">Aruzhan</text><text class="t" x="642" y="160">Astana</text>
  <text class="s" x="630" y="196" text-anchor="middle">2 rows, sorted A → Z</text>
  <text class="t" x="380" y="282" text-anchor="middle">The table itself is not changed — SELECT only reads.</text>
</svg>
:::

## SELECT * or named fields?

`SELECT *` is quick to type, but in program code it is usually better to **name the fields** the program will use. Named fields make the code **self-documenting** (a reader sees at once which data the page shows), they send **less data** from the DBMS to the script — important when a table has a large text or image field — and they keep the program working if someone later adds a field to the table. They also fix the **order of the columns** in the result set, which matters when rows are read as numeric arrays: after `SELECT Name, City`, index 0 is always Name. `SELECT *` is fine for a quick test in a database tool, or on a details page that genuinely shows every field.

A query in a program is a **string**, so it can be built step by step. A search page with optional filters might start with `$sql = "SELECT Name, City FROM Student WHERE 1 = 1";` and then add `" AND Grade = ?"` only if a grade was chosen and `" AND City = ?"` only if a city was chosen, collecting the values to bind in an array. The always-true condition `1 = 1` lets every extra condition begin with AND. Whatever is added, the **values** are still passed through placeholders, never joined into the string.

## Writing conditions in WHERE

The condition in WHERE is tested **for every record**; the record is included if the condition is **true**. Conditions use comparison operators and can be combined with the logical operators AND, OR and NOT — the same Boolean logic you use in IF statements.

:::compare Operators in a WHERE condition
| Operator | Meaning | Example | Records chosen (Student) |
|---|---|---|---|
| `=` / `<>` | equal / not equal | `City <> 'Astana'` | Daniyar, Aigerim, Madina |
| `<` `>` `<=` `>=` | comparison | `Grade >= 12` | Daniyar, Madina |
| `BETWEEN a AND b` | in a range (inclusive) | `Grade BETWEEN 10 AND 11` | Aruzhan, Aigerim, Timur |
| `IN (…)` | one of a list | `City IN ('Almaty', 'Shymkent')` | Daniyar, Aigerim, Madina |
| `LIKE` with `%` and `_` | text pattern | `Name LIKE 'A%'` (starts with A) · `'%ar%'` (contains "ar") | Aruzhan, Aigerim · Daniyar |
| `IS NULL` | no value stored | `City IS NULL` | none |
| `AND` / `OR` / `NOT` | combine conditions | `Grade = 11 AND City = 'Almaty'` | Aigerim |
:::

When AND and OR are mixed, **AND is evaluated first**, so use brackets to say what you mean: `WHERE (City = 'Astana' OR City = 'Almaty') AND Grade = 12` returns only Daniyar, but without brackets the same words would also return Aruzhan and Timur from Astana.

## Calculating with aggregate functions

:::definition Aggregate function
An SQL function that **calculates one value from many records**: `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`. With `GROUP BY` it returns **one value per group**.
:::

Aggregate functions let the DBMS do the counting and adding, so the program receives just the answer. `SELECT COUNT(*) FROM Student WHERE City = 'Almaty'` returns a result set with **one row and one column**: the number 2. `SELECT City, COUNT(*) AS Pupils FROM Student GROUP BY City ORDER BY Pupils DESC` returns one row per city — Astana 2, Almaty 2, Shymkent 1. The keyword **AS** gives the calculated column a name (an *alias*) so the program can read it as `$row["Pupils"]`.

## Data from two tables

Real databases are normalised into several related tables, so a program often needs data from more than one table at once. Suppose marks are stored in `Mark (MarkID, StudentID, Subject, Score)`, where `StudentID` is a **foreign key** to Student. To show pupils' names next to their scores the query **joins** the tables on the matching key:

```sql | Joining Student and Mark on the key field
SELECT Student.Name, Mark.Subject, Mark.Score
FROM Student
INNER JOIN Mark ON Student.StudentID = Mark.StudentID
WHERE Mark.Subject = 'Computer Science'
ORDER BY Mark.Score DESC;
```

The condition after **ON** pairs each mark with the student it belongs to. The older but equivalent form puts the join condition in WHERE: `FROM Student, Mark WHERE Student.StudentID = Mark.StudentID AND …`. Forgetting the join condition is a classic mistake: the DBMS then pairs **every** student with **every** mark (5 students × 20 marks = 100 meaningless rows).

:::example Worked example 3 — predicting the result of queries
**Scenario.** The school portal must show several lists from the Student table above. For each requirement we write the query and work out the result set before running it — exactly what an exam question "state the output" asks.

| Requirement | Query | Result set |
|---|---|---|
| Names of grade 11 pupils, A → Z | `SELECT Name FROM Student WHERE Grade = 11 ORDER BY Name;` | Aigerim, Aruzhan |
| Grade 12 pupils with their city | `SELECT Name, City FROM Student WHERE Grade = 12;` | Daniyar Almaty · Madina Shymkent |
| How many pupils live in Almaty | `SELECT COUNT(*) FROM Student WHERE City = 'Almaty';` | 2 |
| Names starting with A | `SELECT Name FROM Student WHERE Name LIKE 'A%';` | Aruzhan, Aigerim |
| Everything about older pupils from Astana | `SELECT * FROM Student WHERE Grade > 10 AND City = 'Astana';` | 1, Aruzhan, 11, Astana, 2009-03-14 |
| Pupils per grade, highest grade first | `SELECT Grade, COUNT(*) FROM Student GROUP BY Grade ORDER BY Grade DESC;` | 12 → 2 · 11 → 2 · 10 → 1 |

**Method.** Apply the clauses in this order: take the table (FROM) → keep the rows that pass WHERE → group if needed → keep the SELECT columns → sort (ORDER BY). For the last query: all five rows pass; grouping by Grade gives the groups 10 {Timur}, 11 {Aruzhan, Aigerim}, 12 {Daniyar, Madina}; COUNT gives 1, 2, 2; sorting DESC puts 12 first.
:::

# Running a query and processing the result set
@lo 11.5.4.8

Writing the SELECT is the SQL part; the programming part is **running it and using the result**. An INSERT returns only *success* or *failure*. A SELECT returns a **result object** — a handle to the rows the DBMS found. The program then **fetches** the rows one at a time, usually in a loop, and does something with each: prints it, adds it to a total, puts it in an array.

:::definition Fetching a row
Reading the **next row of a result set** into the program as an **array** (`mysqli_fetch_assoc($result)`). Each call moves an internal **pointer (cursor)** one row forward and returns **null** when there are no rows left.
:::

## The fetch loop

```php | list_students.php — run a SELECT and print every row
<?php
require "connect.php";

$sql    = "SELECT StudentID, Name, City FROM Student WHERE Grade = 11 ORDER BY Name";
$result = mysqli_query($conn, $sql);            // run: returns a result object (or false)

if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
echo mysqli_num_rows($result) . " pupil(s) found<br>";   // 2 pupil(s) found

while ($row = mysqli_fetch_assoc($result)) {    // fetch the next row until none are left
    echo $row["StudentID"] . " " . $row["Name"] . " (" . $row["City"] . ")<br>";
}
// 3 Aigerim (Almaty)
// 1 Aruzhan (Astana)
mysqli_close($conn);
?>
```

The line `while ($row = mysqli_fetch_assoc($result))` does two things at once. It **assigns** the next row to `$row`, and the **value of the assignment** is used as the loop condition. While there is a row, `$row` is an array, which counts as *true*, so the body runs. After the last row the function returns `null`, which counts as *false*, and the loop ends. The loop therefore runs **exactly as many times as there are rows** — two times here, zero times if nothing was found.

:::svg The result pointer moves one row at each fetch
<svg class="ads" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A result set with two rows, 3 Aigerim Almaty and 1 Aruzhan Astana, and an end marker. Three arrows labelled fetch 1, fetch 2 and fetch 3 point at row 1, row 2 and the end. To the right, what each call returns: fetch 1 returns the array with StudentID 3, Name Aigerim, City Almaty, the loop body runs; fetch 2 returns the array for Aruzhan, the loop body runs; fetch 3 returns null, the while condition is false and the loop stops.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ads .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.ads .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.ads .rq{stroke:var(--primary);stroke-width:2.5;fill:none}
  </style>
  <defs><marker id="adsE1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="h" x="200" y="26" text-anchor="middle">Result set ($result)</text>
  <rect class="bx" x="120" y="40" width="200" height="44" rx="4"/><text class="t" x="134" y="67">3 · Aigerim · Almaty</text>
  <rect class="bx" x="120" y="100" width="200" height="44" rx="4"/><text class="t" x="134" y="127">1 · Aruzhan · Astana</text>
  <rect class="bad" x="120" y="160" width="200" height="44" rx="4"/><text class="t" x="134" y="187">(no more rows)</text>
  <text class="t" x="20" y="67">fetch 1</text><line class="rq" x1="76" y1="62" x2="114" y2="62" marker-end="url(#adsE1)"/>
  <text class="t" x="20" y="127">fetch 2</text><line class="rq" x1="76" y1="122" x2="114" y2="122" marker-end="url(#adsE1)"/>
  <text class="t" x="20" y="187">fetch 3</text><line class="rq" x1="76" y1="182" x2="114" y2="182" marker-end="url(#adsE1)"/>
  <rect class="ok" x="360" y="40" width="380" height="44" rx="4"/><text class="c" x="372" y="67">$row = ["StudentID"=>3, "Name"=>"Aigerim", …]</text>
  <rect class="ok" x="360" y="100" width="380" height="44" rx="4"/><text class="c" x="372" y="127">$row = ["StudentID"=>1, "Name"=>"Aruzhan", …]</text>
  <rect class="bad" x="360" y="160" width="380" height="44" rx="4"/><text class="c" x="372" y="187">$row = null  → condition false, loop ends</text>
  <text class="t" x="380" y="236" text-anchor="middle">while ($row = mysqli_fetch_assoc($result)) { … }</text>
  <text class="s" x="380" y="262" text-anchor="middle">The body runs once per row: 2 rows → 2 iterations; an empty result → 0 iterations.</text>
</svg>
:::

## Different ways to fetch

:::compare Fetch functions in mysqli
| Function | Row returned as | How to read the name | Best for |
|---|---|---|---|
| `mysqli_fetch_assoc($result)` | **Associative array** — keys are field names | `$row["Name"]` | Clear code; the usual choice |
| `mysqli_fetch_row($result)` | **Numeric (indexed) array** — keys 0, 1, 2… in SELECT order | `$row[1]` | Storing rows in a 2D array |
| `mysqli_fetch_array($result)` | Both kinds of key | `$row["Name"]` or `$row[1]` | Flexibility (uses more memory) |
| `mysqli_fetch_all($result, MYSQLI_ASSOC)` | **All rows at once** — an array of rows, i.e. a **2D array** | `$rows[0]["Name"]` | Passing all data to a function or template |
:::

With a numeric array the index depends on the **order of the fields in the SELECT**, not in the table: after `SELECT StudentID, Name, City`, index 0 is StudentID and index 1 is Name. If someone later changes the SELECT, numeric indexes silently point to the wrong data, which is why `fetch_assoc` is preferred.

## When the query uses input: a prepared SELECT

Very often the condition comes from the user — the grade chosen in a list, a word typed into a search box, the ID in a link. The same SQL injection danger exists as with INSERT (`' OR '1'='1` would make the condition true for every record and reveal the whole table), so the SELECT is also written as a **prepared statement**. The only new step is `mysqli_stmt_get_result()`, which turns the executed statement into an ordinary result object for the fetch loop.

```php | A prepared SELECT with a value from the form
<?php
$grade = (int)($_GET["grade"] ?? 11);

$stmt = mysqli_prepare($conn, "SELECT Name, City FROM Student WHERE Grade = ? ORDER BY Name");
mysqli_stmt_bind_param($stmt, "i", $grade);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);     // now fetch as usual

while ($row = mysqli_fetch_assoc($result)) {
    echo htmlspecialchars($row["Name"]) . " — " . htmlspecialchars($row["City"]) . "<br>";
}
?>
```

## Handling an empty result

A query that finds nothing is **not an error** — it is a valid, empty result set. `mysqli_query` still returns a result object; the fetch loop simply runs zero times. If the program does nothing special, the user sees an empty page and cannot tell whether the search failed or there was simply no match. Good code checks `mysqli_num_rows($result)` first and shows a message such as *"No pupils found in grade 9"*.

:::compare Query failed versus no rows found
| Situation | `mysqli_query` returns | `mysqli_num_rows` | What the program shows |
|---|---|---|---|
| SQL error (wrong field name, lost connection) | **false** | — (cannot be called) | An error message; the developer fixes the code |
| Valid query, no matching records | a result object | **0** | "No records found" |
| Valid query, matches found | a result object | 1 or more | The rows |
:::

## The same in Python

```python | Extracting data with Python and sqlite3
import sqlite3
conn = sqlite3.connect("school.db")
cur = conn.execute("SELECT Name, City FROM Student WHERE Grade = ? ORDER BY Name", (11,))
rows = cur.fetchall()                 # a list of tuples = a 2D structure
if len(rows) == 0:
    print("No pupils found")
for name, city in rows:               # one iteration per row
    print(name, "-", city)
conn.close()
```

`fetchall()` returns all rows at once as a list of tuples — `[("Aigerim", "Almaty"), ("Aruzhan", "Astana")]` — which is a two-dimensional structure: `rows[1][0]` is `"Aruzhan"`. `fetchone()` returns the next row, like `mysqli_fetch_assoc`.

## Showing the result as an HTML table

On a web page a result set is usually shown as an HTML **table**: the header row is written **once, before the loop**; one `<tr>` is written **inside the loop for every row**; the closing tag is written **once, after the loop**. Getting this structure right is worth marks in exam questions.

```php | Output of a result set as an HTML table
<?php
if (mysqli_num_rows($result) == 0) {
    echo "<p>No pupils found.</p>";
} else {
    echo "<table border='1'><tr><th>ID</th><th>Name</th><th>City</th></tr>";   // once
    while ($row = mysqli_fetch_assoc($result)) {                                  // per row
        echo "<tr><td>" . $row["StudentID"] . "</td><td>" . htmlspecialchars($row["Name"])
           . "</td><td>" . htmlspecialchars($row["City"]) . "</td></tr>";
    }
    echo "</table>";                                                              // once
}
?>
```

:::html Output for grade 11 | 150
<table border="1"><tr><th>ID</th><th>Name</th><th>City</th></tr>
<tr><td>3</td><td>Aigerim</td><td>Almaty</td></tr>
<tr><td>1</td><td>Aruzhan</td><td>Astana</td></tr></table>
---css---
body { font-family: Arial, sans-serif; padding: 8px; }
table { border-collapse: collapse; }
th, td { padding: 4px 12px; }
th { background: #eef2ff; }
:::

# Searching, displaying and summarising records
@lo 11.5.4.8

With INSERT, SELECT and the fetch loop you can build the features that real applications are made of: a **search page**, a **details page**, a **drop-down list filled from the database**, and **reports with totals and averages**. Each one is just a different SELECT and a different use of the rows.

## A search page

A search form usually uses **method="get"**, because a search only reads data and the address of the results page (for example `search.php?q=abai`) can then be bookmarked and shared. The search word is matched with LIKE. The `%` signs are added to the **value** in the program, not written around the placeholder in the SQL.

:::mermaid Search page: from the typed word to the list of results
flowchart LR
  A[User types abai and clicks Search] --> B[GET search.php?q=abai]
  B --> C[Script reads and trims q]
  C --> D["Bind %abai% to WHERE Title LIKE ?"]
  D --> E[DBMS returns matching rows]
  E --> F{num_rows = 0?}
  F -- Yes --> G[Show: nothing found]
  F -- No --> H[Fetch loop builds the HTML table]
:::

:::example Worked example 4 — a library catalogue search
**Scenario.** Pupils search the `Book (BookID, Title, Author, Year, Copies)` table by part of the title or author. Only books with at least one copy available should be shown, newest first.

**Step 1 — the query.** The word must match the title **or** the author, **and** Copies must be above 0. Because AND is evaluated before OR, brackets are needed:
`SELECT Title, Author, Year FROM Book WHERE (Title LIKE ? OR Author LIKE ?) AND Copies > 0 ORDER BY Year DESC`

**Step 2 — the value.** For the input *abai*: `$pattern = "%" . trim($_GET["q"]) . "%";` gives `"%abai%"`. LIKE in MySQL ignores the difference between capital and small letters, so *Abai Zholy* matches.

**Step 3 — bind and run.** Two placeholders, both text: `mysqli_stmt_bind_param($stmt, "ss", $pattern, $pattern);` then execute and `get_result`.

**Step 4 — trace with sample data.**

| Title | Author | Year | Copies | Matches? |
|---|---|---|---|---|
| Abai Zholy | Mukhtar Auezov | 1942 | 5 | Yes — title contains "abai" |
| The Book of Words | Abai Kunanbayuly | 1890 | 2 | Yes — author contains "abai" |
| Abai: Selected Poems | Abai Kunanbayuly | 2015 | 0 | No — no copies |
| Clean Code | Robert Martin | 2008 | 3 | No — no match |

**Output (newest first):** Abai Zholy (1942), The Book of Words (1890). `mysqli_num_rows` returns 2, so the page says *"2 books found"*.
:::

## A details page and links

A list page often links every row to a **details page**, passing the primary key in the address: `echo "<a href='student.php?id=" . $row["StudentID"] . "'>" . $row["Name"] . "</a>";`. The details page reads `$_GET["id"]`, converts it with `(int)`, and runs `SELECT * FROM Student WHERE StudentID = ?`. Because the key is unique, the result has **one row or none**, so a single `$row = mysqli_fetch_assoc($result)` without a loop is enough; if `$row` is null, the page says *"Student not found"*.

## Filling a drop-down list from the database

Lists such as the cities or the subjects should come from the database, not be typed into the HTML, so that a new city added to the table appears automatically. The fetch loop writes one `<option>` per row:

```php | A select list built from a query
<?php
$result = mysqli_query($conn, "SELECT DISTINCT City FROM Student ORDER BY City");
echo "<select name='city'>";
while ($row = mysqli_fetch_assoc($result)) {
    $c = htmlspecialchars($row["City"]);
    echo "<option value='$c'>$c</option>";      // Almaty, Astana, Shymkent
}
echo "</select>";
?>
```

`DISTINCT` removes repeated values, so Astana and Almaty appear once each although two pupils live in each city.

## Summarising: in SQL or in the program?

A report such as "average mark per pupil" can be calculated in two ways: let the DBMS do it with an **aggregate function**, or fetch the rows and calculate in a **loop** in the program. Both are correct; exam questions may ask for either, and you should know when each is better.

:::compare Totals calculated by SQL or by program code
| | Aggregate function in SQL | Loop in the program |
|---|---|---|
| Code | `SELECT AVG(Score) FROM Mark WHERE StudentID = 3` | `$sum += $row["Score"]; $n++;` then `$sum / $n` |
| Data sent from the DBMS | One number | Every row |
| Speed with large tables | Faster | Slower |
| Flexibility | Limited to the SQL functions | Any calculation: highest *and* who got it, counts above a pass mark, grades |
| Best when | Only the total / average is needed | The rows are displayed anyway, or the rule is complex |
:::

:::example Worked example 5 — a class report with totals in a loop
**Scenario.** A teacher's page lists every computer science score of grade 11 and, underneath, the number of pupils, the average score and the best pupil. Scores are out of 40; 24 or more is a pass.

**Step 1 — query (join, filter, sort).**
`SELECT Student.Name, Mark.Score FROM Student INNER JOIN Mark ON Student.StudentID = Mark.StudentID WHERE Student.Grade = 11 AND Mark.Subject = 'Computer Science' ORDER BY Student.Name`

**Step 2 — variables initialised before the loop:** `$count = 0; $total = 0; $best = -1; $bestName = ""; $passed = 0;`

**Step 3 — in the loop, for each row:** print the row; `$count++; $total += $row["Score"];` `if ($row["Score"] > $best) { $best = $row["Score"]; $bestName = $row["Name"]; }` `if ($row["Score"] >= 24) $passed++;`

**Step 4 — trace with three rows.**

| Row fetched | $count | $total | $best / $bestName | $passed |
|---|---|---|---|---|
| (start) | 0 | 0 | -1 / "" | 0 |
| Aigerim 31 | 1 | 31 | 31 / Aigerim | 1 |
| Aruzhan 36 | 2 | 67 | 36 / Aruzhan | 2 |
| Erlan 22 | 3 | 89 | 36 / Aruzhan | 2 |

**Step 5 — after the loop:** `if ($count > 0) echo "Average: " . round($total / $count, 1);` → **29.7**; best **Aruzhan (36)**; **2 of 3** passed. The check `$count > 0` prevents a division by zero when the class has no scores yet.
:::

## Keeping the data safe when it is displayed

Every text value fetched from the database and written into the page passes through `htmlspecialchars()`. The data was typed by users at some time in the past; if one of them stored HTML or a script, printing it unchanged would let that code run in the browser of every pupil who opens the list.

:::warning Common mistakes when extracting data
- **Confusing SELECT and WHERE** — listing a condition after SELECT, or the fields after WHERE.
- **Text without quotes** in a condition: `WHERE City = Almaty` — must be `'Almaty'`.
- **Mixing AND and OR without brackets**, so the condition means something else.
- **Forgetting the join condition** when two tables are used — every row is paired with every row.
- **Using `if` instead of `while`** around the fetch — only the first row is shown.
- **Writing the table header inside the loop**, so it is repeated for every row.
- **Wrong array keys**: `$row["name"]` when the field is `Name`, or a numeric index that does not match the SELECT order.
- **Not handling an empty result** — the user sees a blank page and thinks the site is broken.
- **Dividing by the count without checking it is above 0.**
- Putting `%` **around the placeholder in the SQL** (`LIKE '%?%'`) instead of into the bound value.
:::

# Exam practice: extracting data from a database
@lo 11.5.4.8

**Q1: Using the table `Book (BookID, Title, Author, Year, Copies)`, write an SQL query to show the title and year of all books by Abai Kunanbayuly, newest first. [3]**
`SELECT Title, Year FROM Book` (1) `WHERE Author = 'Abai Kunanbayuly'` (1) `ORDER BY Year DESC;` (1)

**Q2: Write program code that displays the names of all students in the city entered in a form field `city`, one per line, using a prepared statement. [5]**
`$city = trim($_POST["city"]);` (1) `$stmt = mysqli_prepare($conn, "SELECT Name FROM Student WHERE City = ?");` (1) `mysqli_stmt_bind_param($stmt, "s", $city); mysqli_stmt_execute($stmt);` (1) `$result = mysqli_stmt_get_result($stmt);` `while ($row = mysqli_fetch_assoc($result))` (1) `{ echo $row["Name"] . "<br>"; }` (1)

**Q3: Explain how the loop `while ($row = mysqli_fetch_assoc($result))` processes a result set. [3]**
Each call fetches the next row of the result set as an array (1) and stores it in `$row`, which is used in the body (1); after the last row the function returns null / false, so the condition is false and the loop ends — it runs once per row (1).

**Q4: The query `SELECT Name FROM Student WHERE Grade = 9` returns no rows. Describe how a program should handle this and why. [2]**
Check the number of rows (e.g. `mysqli_num_rows($result) == 0`) before the loop (1) and output a message such as "No students found", so the user knows the search worked but nothing matched rather than seeing an empty page (1).

**Q5: State the output of `SELECT City, COUNT(*) FROM Student GROUP BY City ORDER BY City;` for the Student table in this lesson. [2]**
Almaty 2, Astana 2 (1), Shymkent 1 — in this order (1).

**Q6: Give one advantage of calculating an average with `AVG()` in SQL and one advantage of calculating it in a program loop. [2]**
AVG: only one value is sent from the DBMS / faster for large tables (1). Loop: the rows are already being displayed, and other values (highest, number passed) can be calculated in the same pass (1).

:::warning Common mistakes in exam answers
- Writing a query that is **correct SQL but answers a different question** — re-read which fields, which records and which order are asked for.
- Leaving out the **loop** when the question says "display all".
- Forgetting **ORDER BY** when the question says "in alphabetical order" or "highest first".
- Using `=` with a wildcard (`WHERE Name = 'A%'`) — wildcards only work with **LIKE**.
:::

:::steps Check yourself
- What is the difference between the clauses SELECT and WHERE?
- Write a query that finds pupils in grade 11 or 12 who live in Almaty, sorted by name.
- What does `mysqli_query` return for a SELECT, and what does it return when the SQL is wrong?
- Explain why the fetch loop stops after the last row.
- Compare `mysqli_fetch_assoc` and `mysqli_fetch_row`.
- Write the code that shows a result set as an HTML table, with the header written once.
- How do you search for a word anywhere in a title using a prepared statement?
- Trace a loop that finds the average and the highest score of three rows.
:::

# Two-dimensional arrays: terms and declaration
@lo 11.5.2.2

The rows that come back from a database form a **table**: several records, each with several fields. Lots of other data in programs has the same shape — the marks of a class in several tests, the seats of a cinema hall, the squares of a game board, the temperatures of each day of each week. A one-dimensional array holds a **list**; to hold a **table** inside a program we use a **two-dimensional (2D) array**.

:::definition Array
A **data structure that stores a fixed number of elements of the same data type under one identifier**; each element is accessed by its **index** (position).
:::

:::definition Two-dimensional (2D) array
An **array of arrays** — elements arranged in **rows and columns**, like a table. Each element is accessed with **two indexes**: **[row][column]**.
:::

## Why not just use several 1D arrays?

Imagine storing the marks of 3 pupils in 4 tests. With 1D arrays you would need either one array per pupil (`marks1`, `marks2`, `marks3`) or one array per test. Both are awkward: the number of variables grows with the class, the same code must be written again for each array, and a loop cannot move from `marks1` to `marks2`, because they are separate identifiers. A 2D array keeps all twelve marks under **one name**, `marks`, and a loop can reach every element simply by changing the two indexes.

:::svg A 2D array of marks — 3 rows (pupils) × 4 columns (tests)
<svg class="ads" viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A grid with 3 rows and 4 columns. Column indexes 0 to 3 are written above, labelled Test 1 to Test 4; row indexes 0 to 2 at the left, labelled Aruzhan, Daniyar, Aigerim. Row 0 holds 7, 8, 6, 9; row 1 holds 10, 9, 9, 8; row 2 holds 5, 6, 7, 6. The element in row 1, column 2, value 9, is highlighted and labelled marks[1][2] equals 9. Row 2 is outlined and labelled marks[2] is a whole row, a 1D array. Notes: lower bound 0, upper bound of rows 2, upper bound of columns 3, size 3 times 4 equals 12 elements.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:15px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .cell{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ads .hi{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2.5}
    svg.ads .row{fill:none;stroke:var(--success);stroke-width:2.5}
    svg.ads .ln{stroke:var(--primary);stroke-width:2;fill:none}
  </style>
  <text class="s" x="200" y="24" text-anchor="middle">[0] Test 1</text>
  <text class="s" x="280" y="24" text-anchor="middle">[1] Test 2</text>
  <text class="s" x="360" y="24" text-anchor="middle">[2] Test 3</text>
  <text class="s" x="440" y="24" text-anchor="middle">[3] Test 4</text>
  <text class="s" x="90" y="70" text-anchor="middle">[0] Aruzhan</text>
  <text class="s" x="90" y="130" text-anchor="middle">[1] Daniyar</text>
  <text class="s" x="90" y="190" text-anchor="middle">[2] Aigerim</text>
  <rect class="cell" x="160" y="40" width="80" height="60"/><text class="t" x="200" y="76" text-anchor="middle">7</text>
  <rect class="cell" x="240" y="40" width="80" height="60"/><text class="t" x="280" y="76" text-anchor="middle">8</text>
  <rect class="cell" x="320" y="40" width="80" height="60"/><text class="t" x="360" y="76" text-anchor="middle">6</text>
  <rect class="cell" x="400" y="40" width="80" height="60"/><text class="t" x="440" y="76" text-anchor="middle">9</text>
  <rect class="cell" x="160" y="100" width="80" height="60"/><text class="t" x="200" y="136" text-anchor="middle">10</text>
  <rect class="cell" x="240" y="100" width="80" height="60"/><text class="t" x="280" y="136" text-anchor="middle">9</text>
  <rect class="hi" x="320" y="100" width="80" height="60"/><text class="t" x="360" y="136" text-anchor="middle">9</text>
  <rect class="cell" x="400" y="100" width="80" height="60"/><text class="t" x="440" y="136" text-anchor="middle">8</text>
  <rect class="cell" x="160" y="160" width="80" height="60"/><text class="t" x="200" y="196" text-anchor="middle">5</text>
  <rect class="cell" x="240" y="160" width="80" height="60"/><text class="t" x="280" y="196" text-anchor="middle">6</text>
  <rect class="cell" x="320" y="160" width="80" height="60"/><text class="t" x="360" y="196" text-anchor="middle">7</text>
  <rect class="cell" x="400" y="160" width="80" height="60"/><text class="t" x="440" y="196" text-anchor="middle">6</text>
  <rect class="row" x="157" y="157" width="326" height="66" rx="4"/>
  <line class="ln" x1="400" y1="130" x2="520" y2="90"/>
  <text class="c" x="526" y="94">marks[1][2] = 9</text>
  <text class="s" x="526" y="114">row 1, column 2</text>
  <text class="c" x="526" y="196">marks[2] = [5, 6, 7, 6]</text>
  <text class="s" x="526" y="216">a whole row is a 1D array</text>
  <text class="t" x="20" y="262">Lower bound 0 · upper bound of rows 2 · upper bound of columns 3</text>
  <text class="t" x="20" y="290">Size = 3 rows × 4 columns = 12 elements · all of the same type (INTEGER)</text>
</svg>
:::

## The technical terms

:::compare Terms used with 2D arrays
| Term | Meaning | In the marks array |
|---|---|---|
| **Identifier** | The name of the whole array | `marks` |
| **Element** | One storage place / value | the 9 in row 1, column 2 |
| **Index** (subscript) | The position number of an element; a 2D array needs **two** | `[1][2]` |
| **Row / column** | First index = row, second index = column (by convention) | row = pupil, column = test |
| **Dimension** | The number of indexes needed | 2 |
| **Lower bound** | The smallest index | 0 (PHP, Python, JS) or 1 (pseudocode) |
| **Upper bound** | The largest index | rows 2, columns 3 |
| **Size / length** | The number of elements in a dimension, or in total | 3 rows, 4 columns, 12 elements |
:::

:::definition Lower and upper bound
The **lower bound** is the **first (smallest) index** of an array dimension and the **upper bound** is the **last (largest) index**. Number of elements in a dimension = upper bound − lower bound + 1.
:::

Bounds matter because using an index outside them is an error. In PHP, reading `$marks[3][0]` from a 3-row array gives a warning and the value `null`; in Python `marks[3][0]` stops the program with *IndexError: list index out of range*. Loops are therefore written so that the index goes **from the lower bound to the upper bound and no further** — in PHP `for ($r = 0; $r < count($marks); $r++)`, where `<` (not `<=`) stops at the upper bound, because the count is one more than the last index.

## Declaring and initialising

A 2D array is **declared** (given a name, a size and a type) and **initialised** (given starting values). How this is written depends on the language. Pseudocode in exam papers usually declares the bounds explicitly and starts at 1; PHP, Python and JavaScript create the array from a list of lists and start at 0.

:::compare Declaring a 2D array
| Language | Declaring / creating | Reading and writing an element |
|---|---|---|
| Pseudocode | `DECLARE Marks : ARRAY[1:3, 1:4] OF INTEGER` | `Marks[2, 3] ← 9` · `OUTPUT Marks[2, 3]` |
| PHP | `$marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]];` | `$marks[1][2] = 9;` · `echo $marks[1][2];` |
| Python | `marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]]` | `marks[1][2] = 9` · `print(marks[1][2])` |
| JavaScript | `let marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]];` | `marks[1][2] = 9;` · `console.log(marks[1][2]);` |
:::

Notice that the pseudocode element `Marks[2, 3]` and the PHP element `$marks[1][2]` are **the same element** (second pupil, third test): the pseudocode counts from 1, PHP from 0. Exam questions always tell you which convention they use; read the declaration before answering.

To create an array of a given size filled with a starting value — for example a 5 × 7 table of zeros for five weeks of seven days — use **nested loops** or a built-in function:

```php | Creating a 5 × 7 array of zeros in PHP
<?php
$rain = [];
for ($w = 0; $w < 5; $w++) {          // 5 rows (weeks)
    for ($d = 0; $d < 7; $d++) {      // 7 columns (days)
        $rain[$w][$d] = 0;
    }
}
// shorter: $rain = array_fill(0, 5, array_fill(0, 7, 0));
?>
```

```python | The same in Python — note the trap
rain = [[0] * 7 for w in range(5)]   # correct: 5 separate rows
bad = [[0] * 7] * 5                 # WRONG: 5 references to the SAME row
```

In memory the elements are stored one after another; most languages keep a whole row together (**row-major order**), so element [r][c] of an array with C columns is at position r × C + c from the start. You do not need this formula for programming, but it explains why a 2D array is still a single block of memory with one name.

## Where 2D arrays are used

Two-dimensional arrays appear wherever data has **two coordinates**. A **digital image** is a grid of pixels: the colour of the pixel in row 120, column 45 is `image[120][45]`, and a filter that brightens the picture is a nested loop that changes every element. A **spreadsheet** is a 2D array of cells, and a formula such as `SUM(B2:B10)` is a loop down one column. A **school timetable** is days × lessons, so `timetable[2][4]` is the subject in the fifth lesson on Wednesday. **Board games** such as chess (8 × 8), noughts and crosses (3 × 3) or minesweeper store each square in a 2D array, and the program checks a win by looking along rows, columns and diagonals. A **distance table** between cities — Astana, Almaty, Shymkent, Karaganda — is a square 2D array where `dist[i][j]` is the distance from city *i* to city *j*. In each case the program could not be written sensibly with one long list, because it needs to move **across and down** through the data.

## Accessing an element step by step

Reading `marks[2][1]` is done in two steps. First the **row index** picks one inner array: `marks[2]` is the whole third row, `[5, 6, 7, 6]` — itself a 1D array. Then the **column index** picks one element of that row: `[5, 6, 7, 6][1]` is **6**. This is why the notation is `[row][column]` and why a single index on a 2D array gives a whole row. Assigning works the same way: `$marks[2][1] = 8;` replaces the 6 with 8 and leaves every other element unchanged.

Not every 2D structure has rows of equal length. In PHP and Python each row is a separate list, so a **jagged array** such as the number of lessons each teacher gives on each of their working days is possible — one teacher works 5 days, another 3. Code that processes such an array must use the length of **each row** (`count($a[$r])`) in the inner loop, not a fixed number. In pseudocode and in exam questions arrays are almost always **rectangular**: every row has the same number of columns.

:::example Worked example 6 — a cinema seating plan
**Scenario.** A small cinema in Shymkent has **5 rows of 8 seats**. The booking program stores `"F"` for a free seat and `"B"` for a booked seat.

**Step 1 — choose the structure.** Every seat has a row number and a seat number, and all values are of the same type → a 2D array `seats[5][8]`, indexes rows 0–4 and seats 0–7. Size 5 × 8 = **40 elements**.

**Step 2 — initialise** every element to `"F"` with nested loops (outer: rows, inner: seats).

**Step 3 — book a seat.** A customer chooses row **3**, seat **5** as printed on the ticket (counting from 1). The program converts to indexes: `$r = 3 - 1 = 2`, `$c = 5 - 1 = 4`, then checks `if ($seats[2][4] == "F") { $seats[2][4] = "B"; echo "Booked"; } else { echo "Seat taken"; }`.

**Step 4 — validate the input first.** If the customer types row 6, the index 5 is above the upper bound 4. The program checks `$r >= 0 && $r <= 4 && $c >= 0 && $c <= 7` before using the indexes, otherwise it would read a non-existent element.

**Result.** One identifier holds the whole hall; any seat is reached in one step from its two indexes, and the same loops can later count the free seats or print the plan.
:::

# Processing 2D arrays with nested loops
@lo 11.5.2.2

A single loop visits every element of a 1D array. To visit every element of a 2D array we need **two loops, one inside the other** — a **nested loop**. The **outer loop** chooses the **row**; for each row the **inner loop** runs completely through all the **columns**. When the inner loop finishes, the outer loop moves to the next row and the inner loop starts again from the first column.

:::definition Nested loop
A **loop inside the body of another loop**. For each iteration of the outer loop the inner loop runs **all** its iterations, so the inner body runs **outer count × inner count** times (3 rows × 4 columns = 12).
:::

:::svg Order in which nested loops visit a 3 × 4 array (row by row)
<svg class="ads" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A 3 by 4 grid. Each cell shows the step number at which the nested loop visits it: row 0 cells 1, 2, 3, 4; row 1 cells 5, 6, 7, 8; row 2 cells 9, 10, 11, 12. Arrows run left to right along each row, and dashed arrows return from the end of one row to the start of the next. On the right: outer loop r equals 0 to 2 chooses the row; inner loop c equals 0 to 3 runs through the columns; the inner body runs 12 times.">
  <style>
    svg.ads .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .t{font:15px system-ui,sans-serif;fill:var(--foreground)}
    svg.ads .c{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.ads .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ads .cell{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ads .rq{stroke:var(--primary);stroke-width:2;fill:none}
    svg.ads .rt{stroke:var(--warning);stroke-width:2;fill:none;stroke-dasharray:5 4}
  </style>
  <defs><marker id="adsF1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker></defs>
  <text class="s" x="40" y="70">r=0</text><text class="s" x="40" y="130">r=1</text><text class="s" x="40" y="190">r=2</text>
  <text class="s" x="110" y="28" text-anchor="middle">c=0</text><text class="s" x="190" y="28" text-anchor="middle">c=1</text><text class="s" x="270" y="28" text-anchor="middle">c=2</text><text class="s" x="350" y="28" text-anchor="middle">c=3</text>
  <rect class="cell" x="80" y="40" width="60" height="44"/><text class="t" x="110" y="68" text-anchor="middle">1</text>
  <rect class="cell" x="160" y="40" width="60" height="44"/><text class="t" x="190" y="68" text-anchor="middle">2</text>
  <rect class="cell" x="240" y="40" width="60" height="44"/><text class="t" x="270" y="68" text-anchor="middle">3</text>
  <rect class="cell" x="320" y="40" width="60" height="44"/><text class="t" x="350" y="68" text-anchor="middle">4</text>
  <rect class="cell" x="80" y="100" width="60" height="44"/><text class="t" x="110" y="128" text-anchor="middle">5</text>
  <rect class="cell" x="160" y="100" width="60" height="44"/><text class="t" x="190" y="128" text-anchor="middle">6</text>
  <rect class="cell" x="240" y="100" width="60" height="44"/><text class="t" x="270" y="128" text-anchor="middle">7</text>
  <rect class="cell" x="320" y="100" width="60" height="44"/><text class="t" x="350" y="128" text-anchor="middle">8</text>
  <rect class="cell" x="80" y="160" width="60" height="44"/><text class="t" x="110" y="188" text-anchor="middle">9</text>
  <rect class="cell" x="160" y="160" width="60" height="44"/><text class="t" x="190" y="188" text-anchor="middle">10</text>
  <rect class="cell" x="240" y="160" width="60" height="44"/><text class="t" x="270" y="188" text-anchor="middle">11</text>
  <rect class="cell" x="320" y="160" width="60" height="44"/><text class="t" x="350" y="188" text-anchor="middle">12</text>
  <line class="rq" x1="140" y1="62" x2="158" y2="62" marker-end="url(#adsF1)"/><line class="rq" x1="220" y1="62" x2="238" y2="62" marker-end="url(#adsF1)"/><line class="rq" x1="300" y1="62" x2="318" y2="62" marker-end="url(#adsF1)"/>
  <line class="rq" x1="140" y1="122" x2="158" y2="122" marker-end="url(#adsF1)"/><line class="rq" x1="220" y1="122" x2="238" y2="122" marker-end="url(#adsF1)"/><line class="rq" x1="300" y1="122" x2="318" y2="122" marker-end="url(#adsF1)"/>
  <line class="rq" x1="140" y1="182" x2="158" y2="182" marker-end="url(#adsF1)"/><line class="rq" x1="220" y1="182" x2="238" y2="182" marker-end="url(#adsF1)"/><line class="rq" x1="300" y1="182" x2="318" y2="182" marker-end="url(#adsF1)"/>
  <path class="rt" d="M350,86 L350,93 L110,93 L110,99"/>
  <path class="rt" d="M350,146 L350,153 L110,153 L110,159"/>
  <text class="c" x="420" y="66">for r ← 0 to 2      (outer: rows)</text>
  <text class="c" x="420" y="92">  for c ← 0 to 3    (inner: columns)</text>
  <text class="c" x="420" y="118">    visit a[r][c]</text>
  <text class="s" x="420" y="150">Inner body runs 3 × 4 = 12 times.</text>
  <text class="s" x="420" y="172">Dashed arrows: inner loop restarts at c = 0</text>
  <text class="s" x="420" y="190">for the next row.</text>
  <text class="s" x="380" y="240" text-anchor="middle">Swap the loops (outer = columns) to visit column by column: 1, 5, 9, 2, 6, 10 …</text>
</svg>
:::

## Writing a nested loop step by step

When a question asks you to "write program code using a 2D array", work through the same decisions every time. They turn a word problem into code that earns the method marks even if a small detail is wrong.

:::steps How to write code that processes a 2D array
- **Identify what the rows and columns mean** (pupils × tests, days × times) and their bounds.
- **Decide the loop order**: results per row → outer loop over rows; results per column → outer loop over columns; all elements → either.
- **Initialise** the variables: once before both loops for a result about the whole array, inside the outer loop for a result per row or column.
- **Write the inner-loop body**: the one action done to each element (add, compare, count, change, output).
- **Output or store the result** in the right place: after the inner loop for a per-row result, after both loops for a whole-array result.
- **Check the bounds** with the first and last element, and **trace** a small example.
:::

## Totals for each row

To find each pupil's total, the outer loop goes through the pupils (rows) and the inner loop adds up that pupil's tests (columns). The total must be **reset to 0 at the start of every row** — inside the outer loop, before the inner loop — otherwise each pupil's total would include the previous pupils' marks.

```php | Row totals and averages
<?php
$marks = [
    [7, 8, 6, 9],
    [10, 9, 9, 8],
    [5, 6, 7, 6],
];
for ($r = 0; $r < count($marks); $r++) {            // each pupil (row)
    $sum = 0;                                         // reset for every row
    for ($c = 0; $c < count($marks[$r]); $c++) {     // each test (column)
        $sum += $marks[$r][$c];
    }
    $avg = $sum / count($marks[$r]);
    echo "Pupil " . ($r + 1) . ": total $sum, average $avg<br>";
}
// Pupil 1: total 30, average 7.5
// Pupil 2: total 36, average 9
// Pupil 3: total 24, average 6
?>
```

## Totals for each column

To find the class total for each test, **swap the loops**: the outer loop goes through the columns, the inner loop through the rows. The number of columns is the length of any one row, `count($marks[0])`.

```php | Column totals — the outer loop goes through the columns
<?php
for ($c = 0; $c < count($marks[0]); $c++) {         // each test (column)
    $sum = 0;
    for ($r = 0; $r < count($marks); $r++) {         // each pupil (row)
        $sum += $marks[$r][$c];
    }
    echo "Test " . ($c + 1) . " total: $sum<br>";    // 22, 23, 22, 23
}
?>
```

:::compare Row-wise and column-wise processing
| | Row by row | Column by column |
|---|---|---|
| Outer loop | rows `r` (0 … rows − 1) | columns `c` (0 … columns − 1) |
| Inner loop | columns `c` | rows `r` |
| Element | `marks[r][c]` | still `marks[r][c]` — only the loop order changes |
| Answers | each pupil's total / average / best test | each test's total / average / best pupil |
| Reset the total | inside the outer loop | inside the outer loop |
:::

## The same algorithm in pseudocode

Exam papers often use pseudocode with indexes from 1. The structure is identical; only the bounds and the loop syntax differ.

```text | Pseudocode: total of every row and the grand total
DECLARE Marks : ARRAY[1:3, 1:4] OF INTEGER
DECLARE Grand, Total : INTEGER
Grand ← 0
FOR Row ← 1 TO 3
    Total ← 0
    FOR Col ← 1 TO 4
        Total ← Total + Marks[Row, Col]
    NEXT Col
    OUTPUT "Pupil ", Row, " total ", Total
    Grand ← Grand + Total
NEXT Row
OUTPUT "Grand total ", Grand          // 90
```

## Processing only one row or one column

Not every task needs the whole array. To work with **one row** — the marks of pupil 2 only — the row index is **fixed** and only one loop runs over the columns: `for ($c = 0; $c < 4; $c++) $sum += $marks[1][$c];`. To work with **one column** — the results of test 3 only — the column index is fixed and the loop runs over the rows: `for ($r = 0; $r < 3; $r++) $sum += $marks[$r][2];`. Recognising this saves time and avoids a common error, writing two nested loops and then adding up the whole array when only one row was asked for. The **main diagonal** of a square array (elements `[0][0]`, `[1][1]`, `[2][2]`) also needs only one loop, because the row and column index are equal: `$a[$i][$i]`. A noughts-and-crosses program uses exactly this to check a diagonal win.

## Searching and stopping early

A linear search through a 2D array visits the elements in the same row-by-row order as the other algorithms, but it can **stop as soon as the value is found**. In PHP `break 2;` leaves both loops at once; in pseudocode the loops are usually written as conditional loops (`WHILE NOT Found AND Row <= 3`) so that they end when `Found` becomes TRUE. If the search finishes without finding the value, the flag is still false, and the program reports *"not found"*. The position of the match is the pair of indexes at the moment it was found — for example "seat row 3, seat 5 is free" in the cinema program.

## Other standard algorithms

The nested loop is a framework; by changing what happens inside it you can solve most 2D-array problems. The common ones are:

:::compare Standard algorithms on a 2D array
| Task | Before the loops | Inside the inner loop | Result for the marks array |
|---|---|---|---|
| **Grand total** | `$total = 0` | `$total += $a[$r][$c]` | 90 |
| **Count** values meeting a condition | `$count = 0` | `if ($a[$r][$c] >= 8) $count++` | 6 marks of 8 or more |
| **Maximum and its position** | `$max = $a[0][0]; $mr = 0; $mc = 0` | `if ($a[$r][$c] > $max) { $max = …; $mr = $r; $mc = $c; }` | 10 at [1][0] |
| **Linear search** | `$found = false` | `if ($a[$r][$c] == $target) { $found = true; … }` | 7 found at [0][0] |
| **Change every element** | — | `$a[$r][$c] = $a[$r][$c] * 10` | marks as percentages |
:::

Initialising the maximum to the **first element** rather than to 0 makes the algorithm correct even if every value is negative (for example winter temperatures).

:::example Worked example 7 — tracing a search for the highest mark
**Task.** Trace the maximum algorithm on the marks array and state the output.

`$max = $marks[0][0]; $mr = 0; $mc = 0;` then the nested loops with `if ($marks[$r][$c] > $max) { $max = $marks[$r][$c]; $mr = $r; $mc = $c; }`, then `echo "Highest $max: pupil " . ($mr + 1) . ", test " . ($mc + 1);`

| r | c | marks[r][c] | > max? | max | mr | mc |
|---|---|---|---|---|---|---|
| — | — | — | — | 7 | 0 | 0 |
| 0 | 0 | 7 | No | 7 | 0 | 0 |
| 0 | 1 | 8 | **Yes** | 8 | 0 | 1 |
| 0 | 2 | 6 | No | 8 | 0 | 1 |
| 0 | 3 | 9 | **Yes** | 9 | 0 | 3 |
| 1 | 0 | 10 | **Yes** | 10 | 1 | 0 |
| 1 | 1 … 3 | 9, 9, 8 | No | 10 | 1 | 0 |
| 2 | 0 … 3 | 5, 6, 7, 6 | No | 10 | 1 | 0 |

**Output:** *Highest 10: pupil 2, test 1.* The comparison is `>` (strictly greater), so if another 10 appeared later the **first** position would be kept; with `>=` the last one would be kept. The inner body ran 12 times — once for each element.
:::

:::example Worked example 8 — a week of temperatures in Astana
**Scenario.** A weather station records the temperature at 4 times of day (06:00, 12:00, 18:00, 24:00) for 7 days. Write code that prints each day's average and counts how many readings were below −20 °C.

**Structure.** 7 rows (days) × 4 columns (times) → `$t[7][4]`, 28 elements of type REAL.

**Code idea.** `$cold = 0;` then for each day `$sum = 0;`, for each time `$sum += $t[$d][$k]; if ($t[$d][$k] < -20) $cold++;`, after the inner loop `echo "Day " . ($d + 1) . ": " . round($sum / 4, 1);`.

**Check with one row.** Monday's readings −24, −15, −12, −21: sum = −72, average −18.0; two readings (−24 and −21) are below −20, so `$cold` increases by 2.

**Why two jobs fit in one pass:** the counting test and the adding both happen for every element, so they share the same nested loops. The count is reset **once before both loops** (it is for the whole week); the sum is reset **inside the outer loop** (it is for one day).
:::

# Choosing a data structure and 2D arrays of database data
@lo 11.5.2.2

A frequent exam task is: *"Select a suitable data structure for this task and justify your choice."* The answer depends on the **shape** of the data. Ask two questions: *How many values does each item have?* and *Are all the values of the same type?*

## 1D or 2D?

- If each item has **one value** — the name of each pupil, the price of each product, the score of each game — the data is a **list** and a **1D array** is enough.
- If each item has **several values of the same type**, or the data is naturally a **grid** with two coordinates — marks of each pupil in each test, sales of each shop in each month, the squares of a board — use a **2D array**.
- If each item has **several values of different types** (a name, a grade and a date of birth), a 2D array is possible only if everything is stored as text. A better choice is a **record** or an array of **associative arrays** (PHP) / dictionaries (Python), which is exactly what `mysqli_fetch_all($result, MYSQLI_ASSOC)` returns.

:::compare Choosing a data structure
| Task | Structure | Justification |
|---|---|---|
| The marks of **one** pupil in 10 tests | **1D array** [10] | One list of values of one type |
| The names of all 25 pupils in a class | **1D array** [25] | One value per item |
| The marks of 30 pupils in 5 tests | **2D array** [30][5] | Each pupil has several values of the same type — a table |
| A cinema hall of 12 rows × 20 seats | **2D array** [12][20] | Two coordinates identify each seat |
| A noughts-and-crosses board | **2D array** [3][3] | A grid; a square is found by row and column |
| Daily sales of 4 shops for a week | **2D array** [4][7] | Shop × day; totals per shop and per day are needed |
| Name, grade and birth date of each pupil | Array of records / associative arrays (or 2D array of strings) | Values of different types — fields of a record |
:::

:::compare 1D array and 2D array
| | 1D array | 2D array |
|---|---|---|
| Shape | A list (one row) | A table (rows and columns) |
| Indexes per element | One: `a[i]` | Two: `a[r][c]` |
| Loops to visit all elements | One loop | Two nested loops |
| Number of elements | n | rows × columns |
| Typical use | names, one set of scores | marks per pupil per test, grids, query results |
:::

## Justifying a choice in an exam answer

A justification earns marks when it is about **this data**, not about arrays in general. A strong answer names the structure **with its size and type**, says **what the rows and columns represent**, and gives a **reason linked to the processing** that is needed. For example: *"A 2D array of integers with 30 rows and 6 columns, one row per pupil and one column per test, because every pupil has six marks of the same type, and the program must calculate a total for each pupil (row) and an average for each test (column) with nested loops."* Compare this with a weak answer, *"a 2D array because it stores more data"*, which gets no mark: a 1D array of 180 elements would store the same amount of data, but it would lose the link between a mark and its pupil and test.

Also consider **what the program does with the data**. If marks are only ever added to one running total, a single variable may be enough and no array is needed at all. If the program must look at the data more than once — print it, then find the best pupil, then sort it — an array is necessary because the values must be kept in memory.

## Parallel arrays versus a 2D array

Some programs keep related data in **parallel arrays** — `names[i]` and `scores[i]` belong to the same pupil because they share the index `i`. This works, but every sort or deletion must change all the arrays in exactly the same way, and it is easy to forget one. Data that belongs together is better kept together: in a 2D array (if the types match) or in an array of records.

## Loading database rows into a 2D array

The result of a SELECT is a table, so it maps naturally onto a 2D array: **row index = record**, **column index = field** (in SELECT order). Loading the rows into an array lets the program use them **several times** — display them, calculate totals per column, sort them in a different order, pass them to a function — without running the query again.

:::mermaid From a database table to a 2D array in the program
flowchart LR
  A[(Student table)] -- "SELECT Name, Grade, City" --> B[Result set]
  B -- "while: fetch_row, append" --> C["$students[r][c]"]
  C --> D[Display as HTML table]
  C --> E[Totals and counts]
  C --> F[Sort or search in the program]
:::

```php | Storing query results in a 2D array
<?php
$result = mysqli_query($conn, "SELECT Name, Grade, City FROM Student ORDER BY StudentID");
$students = [];                             // empty array
while ($row = mysqli_fetch_row($result)) {  // $row is a 1D array [Name, Grade, City]
    $students[] = $row;                     // append it as the next row
}
echo $students[0][0];                       // "Aruzhan" — row 0, column 0 (Name)
echo $students[4][2];                       // "Shymkent" — row 4, column 2 (City)
echo count($students);                      // 5 rows
echo count($students[0]);                   // 3 columns
// shorter: $students = mysqli_fetch_all($result);   (numeric 2D array)
?>
```

The line `$students[] = $row;` appends a whole row: the empty brackets mean *"add at the next index"*. After the loop the array has one row per record. Because `fetch_row` returns numeric arrays, column 0 is the first field **in the SELECT** (Name), column 1 the second (Grade) and so on.

## Associative rows and sorting the loaded data

With `mysqli_fetch_all($result, MYSQLI_ASSOC)` each row is an associative array, so the structure is a **numeric array of associative arrays**: `$rows[2]["City"]` is the city of the third record. This is still two-dimensional — one index for the record and one key for the field — but the field is named instead of numbered, which makes the code easier to read and safe if the SELECT order changes. In Python the equivalent is a list of dictionaries.

Once the rows are in an array the program can **sort** them itself — for example with `usort($rows, fn($a, $b) => $b["Score"] <=> $a["Score"]);` to put the highest score first — or **search** them, without asking the DBMS again. For a small amount of data this is convenient; for large tables it is better to let the DBMS sort with ORDER BY, because only the needed rows are then sent to the program.

## Displaying any 2D array as an HTML table

Displaying a 2D array is the nested loop again, with HTML tags in the right places: `<tr>` **opens** in the outer loop before the inner loop and **closes** after it; one `<td>` is written **in the inner loop** for every element.

```php | A function that prints any 2D array as a table
<?php
function printTable($data) {
    echo "<table border='1'>";
    for ($r = 0; $r < count($data); $r++) {
        echo "<tr>";                                    // start the row
        for ($c = 0; $c < count($data[$r]); $c++) {
            echo "<td>" . htmlspecialchars($data[$r][$c]) . "</td>";   // one cell
        }
        echo "</tr>";                                   // end the row
    }
    echo "</table>";
}
printTable($students);
?>
```

:::example Worked example 9 — sales of school canteens, from database to report
**Scenario.** Three NIS canteens store their daily takings (in thousand tenge) in a table `Sales (Canteen, Day, Amount)`. The director wants a grid with one row per canteen and one column per school day (Monday–Friday), plus a total for each canteen and each day.

**Step 1 — choose the structure.** Canteen × day, all values numbers → 2D array `$grid[3][5]`, initialised to 0.

**Step 2 — fill it from the query.** `SELECT Canteen, Day, Amount FROM Sales` returns rows such as (1, 2, 145), meaning canteen 1, day 2 (Tuesday). For each row: `$grid[$row["Canteen"] - 1][$row["Day"] - 1] += $row["Amount"];` — the −1 converts the 1-based numbers in the table into 0-based indexes.

**Step 3 — the filled array.**

| | Mon | Tue | Wed | Thu | Fri | Canteen total |
|---|---|---|---|---|---|---|
| Canteen 1 | 120 | 145 | 130 | 150 | 160 | **705** |
| Canteen 2 | 90 | 85 | 100 | 95 | 110 | **480** |
| Canteen 3 | 60 | 75 | 70 | 80 | 65 | **350** |
| Day total | **270** | **305** | **300** | **325** | **335** | **1535** |

**Step 4 — totals.** Row totals with the outer loop over canteens; column totals with the outer loop over days; the grand total is the sum of either set (705 + 480 + 350 = 270 + 305 + 300 + 325 + 335 = **1535**), which is a good self-check.

**Why a 2D array and not only SQL?** `GROUP BY` could give the canteen totals or the day totals, but the grid needs both at once; loading the data into the array once lets the program produce the whole report from one query.
:::

:::warning Common mistakes with 2D arrays
- **Swapping the indexes**: writing `marks[c][r]` — the convention is **[row][column]**.
- **Off-by-one at the bounds**: `$r <= count($marks)` reads one row too many; PHP/Python/JS indexes start at **0**, pseudocode often at **1**.
- **Resetting the total in the wrong place** — outside the outer loop (totals keep growing) or inside the inner loop (only the last value is kept).
- **Using the number of rows as the number of columns** in a non-square array: columns = `count($a[0])`, rows = `count($a)`.
- **Initialising the maximum to 0**, which fails when all values are negative.
- **Python trap**: `[[0] * 7] * 5` makes five references to the same row.
- **Choosing a 2D array for values of different types** without saying that they must be stored as strings — a record is usually better.
- Forgetting that a database result column index follows the **SELECT** order, not the table order.
:::

# Exam practice: two-dimensional arrays
@lo 11.5.2.2

**Q1: A 2D array `Scores` is declared as `ARRAY[1:6, 1:4] OF INTEGER`. State (a) the number of elements, (b) the upper bound of the second dimension. [2]**
(a) 6 × 4 = 24 (1); (b) 4 (1).

**Q2: For the array `$marks = [[7, 8, 6, 9], [10, 9, 9, 8], [5, 6, 7, 6]]`, state the values of `$marks[0][3]` and `$marks[2][1]`. [2]**
9 (1); 6 (1).

**Q3: Write program code that outputs the total of each column of a 2D array `$sales` with 4 rows and 7 columns. [4]**
Outer loop over the 7 columns `for ($c = 0; $c < 7; $c++)` (1); reset `$sum = 0` inside the outer loop (1); inner loop over the 4 rows adding `$sum += $sales[$r][$c]` (1); output `$sum` after the inner loop, inside the outer loop (1).

**Q4: A program must store the names of 30 pupils, and another must store the scores of 30 pupils in 6 tests. Select a suitable data structure for each and justify your choices. [4]**
Names: 1D array of 30 strings (1) — one value per pupil (1). Scores: 2D array [30][6] of integers (1) — each pupil has several values of the same type, forming a table of rows (pupils) and columns (tests) (1).

**Q5: Explain why the line `$sum = 0;` must be inside the outer loop when calculating each row's total. [2]**
The total must start from zero for every new row (1); if it is set only once before the loops, each row's total includes the values of all previous rows (1).

**Q6: Write code that reads all rows of `SELECT Name, Score FROM Result` into a 2D array `$data` and then outputs the number of rows. [3]**
`$data = []; while ($row = mysqli_fetch_row($result))` (1) `{ $data[] = $row; }` (1) `echo count($data);` (1)

:::warning Common mistakes in exam answers
- Giving the **upper bound** when the question asks for the **number of elements**, or forgetting to add 1 when the lower bound is 0 (bounds 0–5 → 6 elements).
- Writing only one loop for an operation on **all** elements.
- Justifying "2D array because it is better" — say **what the rows and columns represent** and that the values are of the **same type**.
- Mixing 1-based pseudocode indexes with 0-based code in the same answer.
:::

:::steps Check yourself
- Define a 2D array, an index, the lower bound and the upper bound.
- Declare a 4 × 5 array of integers in pseudocode and in PHP or Python.
- How many times does the inner body of nested loops over a 6 × 8 array run?
- Write code for row totals and for column totals — what changes?
- Trace the maximum algorithm on a small array and give the position of the maximum.
- Choose 1D or 2D for: a seating plan, a list of e-mail addresses, monthly rainfall for 5 cities.
- Write the loop that stores the rows of a SELECT in a 2D array.
- Print a 2D array as an HTML table — where do `<tr>` and `<td>` go?
:::
