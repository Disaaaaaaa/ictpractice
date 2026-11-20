---
summary: What a scripting language is (client-side JavaScript and server-side PHP), how scripts are interpreted and embedded in web pages, variables, data types, input and output, selection with if, else if, switch and logical operators, count- and condition-controlled loops and how to trace them, the difference between validation and verification and how to code each check, good programming style, connecting to a MySQL database from PHP with safe prepared statements, and using JavaScript events and the DOM to make pages interactive.
---
# What is a scripting language?
@lo 11.5.4.1 11.5.3.8@paper

## Programs that live inside other programs

Most of the programs you have written so far were **stand-alone programs**: you wrote Python code, ran it, and it worked on its own. A **scripting language** is used differently. A script usually runs **inside another program** — a web browser, a web server, a spreadsheet, a game engine or the operating system — and its job is to **control that program** or **add behaviour** to it. When you click "Like" under a photo and the heart turns red without the page reloading, a script in the browser did that. When you log in to a school website and see *your* marks and not someone else's, a script on the server looked you up in a database and built the page for you.

:::definition Scripting language
A high-level, usually **interpreted** programming language used to **automate tasks** and add **behaviour** to applications and web pages. The code (a **script**) is translated and run line by line by an **interpreter** inside a host program (e.g. a browser or a web server) — there is no separate compilation step.
:::

The two scripting languages used in this course are **JavaScript** and **PHP**. JavaScript was created in 1995 to make web pages interactive, and today every web browser — Chrome, Firefox, Safari, Edge, the browser in your phone — contains a JavaScript interpreter. PHP ("PHP: Hypertext Preprocessor") was created in the same period to build web pages on the **server**; it is still used by a large part of the web, including WordPress sites and many school and government portals. Python can also be used as a scripting language (for example to automate file tasks), but on the web the main division is **JavaScript on the client** and **PHP (or Python, Node.js) on the server**.

## Interpreted, not compiled

A **compiler** translates the whole program into machine code **before** it runs and produces an executable file. An **interpreter** reads the source code **one statement at a time**, translates it and executes it immediately. Scripting languages are almost always interpreted (modern browsers use clever "just-in-time" tricks to speed this up, but from the programmer's point of view the script is simply run from its source code).

This has practical consequences you will notice when you write scripts:

- You can **edit and re-run** a script instantly — save the file, refresh the browser, and the new version runs. This makes scripting fast for **prototyping** and small tasks.
- An error is only found when the interpreter **reaches that line**. A script may run correctly for the first five lines and then stop with an error on line six; code inside an `if` that never runs may hide an error for weeks.
- The script is distributed as **source code**. For JavaScript this means anyone can read it with *View source*, so **secrets must never be put in client-side code**.
- Interpreted code is usually **slower** than compiled code, but for web tasks (reacting to a click, building a page from ten database rows) the difference does not matter.

:::compare Compiled programs and interpreted scripts
| | Compiled program (e.g. C++) | Interpreted script (e.g. JavaScript, PHP) |
|---|---|---|
| Translation | Whole program translated **before** running | Translated **line by line while running** |
| What is distributed | Executable machine code | **Source code** |
| Errors reported | All syntax errors at compile time | When the interpreter **reaches** the faulty line |
| Speed of execution | Faster | Slower, but fast enough for web tasks |
| Speed of development | Edit → compile → run | Edit → run immediately |
| Needs on the target computer | Nothing extra | The **interpreter** (browser, PHP on the server) |
:::

## Client-side and server-side scripts

The most important idea in web scripting is **where the script runs**. A web page is the result of a conversation between two computers: the **client** (the user's device and browser) sends a **request**, and the **server** (a computer in a data centre) sends back a **response** — HTML, CSS, JavaScript and images.

:::definition Client-side script
A script that is **downloaded with the web page** and **executed by the user's browser**, e.g. JavaScript. It can react to the user immediately, but its code is **visible** to the user and it **cannot be trusted** to protect data, because the user can change or switch it off.
:::

:::definition Server-side script
A script that is **executed on the web server** before the page is sent, e.g. PHP. It can access the **database** and other private resources; the user receives **only the resulting HTML**, never the script itself.
:::

:::svg Where scripts run: PHP runs on the server before the page is sent, JavaScript runs in the browser after it arrives
<svg class="scr" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="On the left the client: a browser running JavaScript. On the right the web server running PHP, connected to a MySQL database. Arrow 1 from browser to server: HTTP request for marks.php with form data. Arrow 2: PHP queries the database. Arrow 3: the database returns rows. Arrow 4 from server to browser: response with HTML, CSS and JavaScript but no PHP code. Inside the browser, step 5: JavaScript reacts to clicks and typing without contacting the server">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .m{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.scr .ar{stroke:var(--primary);stroke-width:2.5;fill:none}
    svg.scr .ag{stroke:var(--success);stroke-width:2.5;fill:none}
  </style>
  <defs>
    <marker id="scrA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="scrA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
  </defs>
  <rect class="bx" x="20" y="30" width="230" height="270" rx="10"/>
  <text class="h" x="135" y="56" text-anchor="middle">CLIENT (browser)</text>
  <rect class="ok" x="40" y="80" width="190" height="60" rx="6"/>
  <text class="t" x="135" y="104" text-anchor="middle">Page shown to the user</text>
  <text class="s" x="135" y="124" text-anchor="middle">HTML + CSS</text>
  <rect class="wn" x="40" y="160" width="190" height="120" rx="6"/>
  <text class="m" x="135" y="184" text-anchor="middle">JavaScript</text>
  <text class="t" x="135" y="206" text-anchor="middle">5 reacts to clicks,</text>
  <text class="t" x="135" y="224" text-anchor="middle">typing, form submit</text>
  <text class="s" x="135" y="246" text-anchor="middle">no trip to the server</text>
  <text class="s" x="135" y="266" text-anchor="middle">code visible to user</text>
  <rect class="bx" x="470" y="30" width="270" height="270" rx="10"/>
  <text class="h" x="605" y="56" text-anchor="middle">WEB SERVER</text>
  <rect class="pb" x="490" y="80" width="230" height="80" rx="6"/>
  <text class="m" x="605" y="104" text-anchor="middle">marks.php</text>
  <text class="t" x="605" y="126" text-anchor="middle">PHP runs here, builds HTML</text>
  <text class="s" x="605" y="146" text-anchor="middle">code never sent to user</text>
  <rect class="ok" x="530" y="220" width="150" height="60" rx="6"/>
  <text class="t" x="605" y="246" text-anchor="middle">MySQL database</text>
  <text class="s" x="605" y="266" text-anchor="middle">students, marks</text>
  <line class="ar" x1="250" y1="100" x2="486" y2="100" marker-end="url(#scrA1)"/>
  <text class="t" x="368" y="90" text-anchor="middle">1 request: marks.php?id=17</text>
  <line class="ar" x1="590" y1="160" x2="590" y2="216" marker-end="url(#scrA1)"/>
  <text class="s" x="540" y="194" text-anchor="end">2 SQL query</text>
  <line class="ag" x1="625" y1="218" x2="625" y2="164" marker-end="url(#scrA2)"/>
  <text class="s" x="635" y="194">3 rows</text>
  <line class="ag" x1="486" y1="140" x2="254" y2="140" marker-end="url(#scrA2)"/>
  <text class="t" x="368" y="160" text-anchor="middle">4 response: HTML, CSS, JS</text>
  <text class="s" x="368" y="178" text-anchor="middle">(no PHP code inside)</text>
  <text class="s" x="20" y="322">Server-side: secure, can use the database. Client-side: instant response, but can be bypassed.</text>
</svg>
:::

Follow the numbers in the diagram. (1) The browser asks for `marks.php`. (2) The server does not send the file as it is — it **runs** the PHP code, which sends an SQL query to the database. (3) The database returns the rows. (4) PHP uses them to build ordinary HTML, and only that HTML (plus CSS and any JavaScript) is sent back. If the student presses *View source*, they will see `<td>87</td>` but not the PHP code or the database password. (5) Once the page has arrived, JavaScript in it can react to what the user does — show a hint, sort a table, check a form — **without contacting the server**.

:::compare Client-side and server-side scripts
| | Client-side (e.g. **JavaScript**) | Server-side (e.g. **PHP**, Python) |
|---|---|---|
| Runs on | The user's **browser** | The **web server** |
| Code visible to the user | **Yes** (View source) | **No** — the user only receives the resulting HTML |
| Typical uses | Interactivity, animations, instant **validation**, changing the page without reloading | Processing **form data**, **database** access, logins, generating pages |
| Embedded in HTML with | `<script> … </script>` | `<?php … ?>` (file saved as `.php`) |
| Advantages | Fast response; reduces load on the server; works offline once loaded | Secure — data and passwords stay on the server; works even if JavaScript is switched off |
| Disadvantages | Can be **switched off or edited** by the user; code can be copied | Every action needs a **request to the server** (slower, more server load) |
:::

The two kinds of script are not rivals — a real website uses **both**. JavaScript gives the user a smooth experience; PHP does the work that must be trusted (checking a password, saving an order, reading marks from the database).

## Embedding scripts in a web page

JavaScript is placed inside a `<script>` element, either directly in the HTML file or in a separate `.js` file linked with `<script src="app.js"></script>`. Scripts are usually placed at the **end of the body**, so that the HTML elements already exist when the script runs.

```html | Embedding JavaScript in a web page
<!DOCTYPE html>
<html>
  <head><title>Greeting</title></head>
  <body>
    <h1 id="title">Welcome</h1>
    <script>
      let name = prompt("What is your name?");   // input box
      alert("Hello, " + name + "!");              // message box
    </script>
  </body>
</html>
```

PHP code is written between `<?php` and `?>` inside a file whose name ends in **`.php`**. The web server sees the extension, passes the file to the PHP interpreter, and replaces each PHP block with whatever it outputs (with `echo`). The rest of the file is sent as normal HTML.

```php | A PHP page: the server replaces the PHP block with its output
<!DOCTYPE html>
<html>
  <body>
    <h1>School timetable</h1>
    <p>Today is <?php echo date("l, d F Y"); ?>.</p>
  </body>
</html>
<!-- the browser receives: <p>Today is Monday, 01 February 2027.</p> -->
```

:::example Worked example — choosing client-side or server-side
**Scenario.** A school canteen in Almaty builds an online pre-order page. Pupils choose dishes, see the total cost, and submit the order; the canteen sees all orders on its screen. Decide where each task should be done.

1. **Show the running total as dishes are ticked** → **client-side** (JavaScript). It must update instantly, and a wrong total on the screen harms nobody — the server recalculates it anyway.
2. **Check that the pupil's ID field is not empty before sending** → **both**: JavaScript for instant feedback, PHP because the check could be bypassed.
3. **Look up the price of each dish** → **server-side**. Prices are stored in the database; if the price came from the browser, a pupil could edit it to 1 ₸.
4. **Save the order and reduce the stock of each dish** → **server-side** (PHP + SQL). Only the server can access the database.
5. **Show "Order received" with the order number** → generated by **PHP**, because only the server knows the number the database gave the new order.

The rule behind every decision: anything that must be **instant** goes to the client; anything that must be **trusted** or needs the **database** goes to the server.
:::

# Variables, data types, input and output
@lo 11.5.4.1

## Variables and constants

A **variable** is a named storage location in memory whose value can **change** while the script runs. A **constant** is a named value that must **not** change. In JavaScript a variable is declared with `let` and a constant with `const`; the older keyword `var` also works but is avoided in modern code. In PHP every variable name starts with a dollar sign `$`, and there is no need to declare it — it is created the first time a value is assigned to it.

:::definition Variable
A **named location in memory** that stores a value which **can change** during the execution of a program. It has an **identifier** (name), a **value** and a **data type**.
:::

:::definition Constant
A **named value** that is set once and **cannot be changed** while the program runs, e.g. `const VAT_RATE = 0.12;`. Using constants avoids "magic numbers" and means the value is changed in only **one place** if the rule changes.
:::

Both JavaScript and PHP are **dynamically typed**: you do not write the data type when you create a variable; the interpreter works it out from the value, and the same variable can later hold a value of a different type. This is convenient, but it is also the source of the most common scripting bug, described below.

:::compare Data types in JavaScript and PHP
| Data type | Example values | JavaScript | PHP |
|---|---|---|---|
| Integer | 16, −3, 2027 | `number` (one type for all numbers) | `int` |
| Real / float | 7.5, 0.12 | `number` | `float` |
| String | "Aliya", "1234" | `string`, in `"…"` or `'…'` | `string`, in `"…"` or `'…'` |
| Boolean | true, false | `boolean` | `bool` |
| Array | [7, 9, 4] | `Array` | `array` |
| No value | — | `undefined`, `null` | `null` |
:::

## Input and output

A script needs a way to **get data** (input) and **show results** (output). In the first lessons we use simple dialog boxes; in real web pages data comes from **form fields** and results are written **into the page**.

:::compare Variables, input and output
| Task | JavaScript | PHP |
|---|---|---|
| Declare a variable | `let age = 16;`  `const RATE = 0.12;` | `$age = 16;` (always starts with `$`), `define("RATE", 0.12);` |
| Input | `prompt("Enter age:")` — returns **text**; value of a form field: `document.getElementById("age").value` | `$_POST["age"]` or `$_GET["age"]` from a form |
| Convert text to a number | `Number(x)`, `parseInt(x)`, `parseFloat(x)` | `(int)$x`, `intval($x)`, `floatval($x)` |
| Output | `alert(…)`, `console.log(…)`, `document.write(…)`, `element.textContent = …` | `echo …;` or `print …;` |
| Join strings (concatenation) | `"Total: " + total` | `"Total: " . $total` |
| Insert a variable in text | `` `Total: ${total}` `` (back-ticks) | `"Total: $total"` (double quotes) |
:::

`prompt()` shows a small box with a text field; whatever the user types is **returned as a string**, or `null` if they press Cancel. `alert()` shows a message and waits for OK. `console.log()` writes to the browser's developer console — invisible to normal users, but very useful for **debugging**. In PHP, `echo` sends text into the HTML that is being built, so `echo "<p>Hello</p>";` produces a paragraph on the page.

## The string trap: why "5" + "3" is "53"

Every value that comes from `prompt()` or from a form field is a **string**, even if the user typed digits. In JavaScript the `+` operator has two meanings: with two numbers it **adds**, but if either side is a string it **joins** (concatenates). So if the user types 5 and 3, `a + b` gives `"53"`. The other arithmetic operators (`-`, `*`, `/`) only work on numbers, so JavaScript silently converts — `"5" * "3"` gives 15 — which makes the bug even harder to spot, because only addition is wrong.

:::svg The same two inputs give different results depending on whether they are converted to numbers
<svg class="scr" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two paths. Top path: prompt returns the string 5 and the string 3; plus joins them, result the string 53, marked as a bug. Bottom path: the same strings pass through Number(), become the numbers 5 and 3, plus adds them, result 8, marked correct">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .m{font:700 13px ui-monospace,monospace;fill:var(--foreground)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.scr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="scrA3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="20" y="28">Without conversion</text>
  <rect class="bx" x="20" y="40" width="170" height="60" rx="6"/><text class="m" x="105" y="66" text-anchor="middle">a = "5"</text><text class="m" x="105" y="88" text-anchor="middle">b = "3"</text>
  <line class="ln" x1="190" y1="70" x2="276" y2="70" marker-end="url(#scrA3)"/>
  <rect class="bx" x="280" y="40" width="170" height="60" rx="6"/><text class="m" x="365" y="66" text-anchor="middle">a + b</text><text class="s" x="365" y="88" text-anchor="middle">+ joins strings</text>
  <line class="ln" x1="450" y1="70" x2="536" y2="70" marker-end="url(#scrA3)"/>
  <rect class="bad" x="540" y="40" width="200" height="60" rx="6"/><text class="m" x="640" y="66" text-anchor="middle">"53"</text><text class="t" x="640" y="88" text-anchor="middle">logic error</text>
  <text class="h" x="20" y="148">With Number()</text>
  <rect class="bx" x="20" y="160" width="170" height="60" rx="6"/><text class="m" x="105" y="186" text-anchor="middle">Number("5") → 5</text><text class="m" x="105" y="208" text-anchor="middle">Number("3") → 3</text>
  <line class="ln" x1="190" y1="190" x2="276" y2="190" marker-end="url(#scrA3)"/>
  <rect class="pb" x="280" y="160" width="170" height="60" rx="6"/><text class="m" x="365" y="186" text-anchor="middle">a + b</text><text class="s" x="365" y="208" text-anchor="middle">+ adds numbers</text>
  <line class="ln" x1="450" y1="190" x2="536" y2="190" marker-end="url(#scrA3)"/>
  <rect class="ok" x="540" y="160" width="200" height="60" rx="6"/><text class="m" x="640" y="186" text-anchor="middle">8</text><text class="t" x="640" y="208" text-anchor="middle">correct</text>
  <text class="s" x="20" y="244">If Number() gets text that is not a number, e.g. "abc", the result is NaN ("Not a Number").</text>
</svg>
:::

The fix is to **convert** the input before doing arithmetic: `Number(x)` converts the whole string (and gives `NaN` if it is not a valid number), `parseInt(x)` reads a whole number from the start of the string (`parseInt("12kg")` is 12), and `parseFloat(x)` reads a decimal number. PHP avoids the problem partly because it uses a **different operator for joining** — the dot `.` — so `"5" + "3"` in PHP really is 8. Even so, in PHP you should still check and convert input with `is_numeric()` and `(int)` before using it.

:::example Worked example — a fuel-cost calculator
**Scenario.** A driver in Astana wants to know the cost of a trip. The script asks for the distance in km, the fuel use in litres per 100 km, and the price per litre (AI-95 costs about 270 ₸).

```javascript | Input, conversion, calculation and output
const PRICE_PER_LITRE = 270;                                 // constant, ₸
let distance = Number(prompt("Distance (km):"));             // input + conversion
let usage = Number(prompt("Fuel use (litres per 100 km):"));
let litres = distance * usage / 100;                         // process
let cost = litres * PRICE_PER_LITRE;
alert("You need " + litres.toFixed(1) + " litres. Cost: " + cost.toFixed(0) + " ₸");
```

**Trace with inputs 350 and 8.** `distance` = 350, `usage` = 8 → `litres` = 350 × 8 ÷ 100 = **28** → `cost` = 28 × 270 = **7560** → the message is "You need 28.0 litres. Cost: 7560 ₸".

**What if `Number()` were missing?** `distance * usage` would still work (multiplication converts strings), so the bug would not appear here — but if the script later added a toll with `cost + toll`, it would produce something like "7560500". Converting **at the moment of input** is the safe habit.
:::

# Selection in a scripting language
@lo 11.5.4.1

## What selection is and why programs need it

A program that always runs the same statements in the same order (a **sequence**) can only do one thing. Real tasks need decisions: *if* the PIN is correct, open the account, *otherwise* show an error; *if* the mark is 90 or more, the grade is A. **Selection** lets a script choose which statements to run.

:::definition Selection (branching)
A control structure that chooses **which statements to run** depending on whether a **condition** is **true or false** — in JavaScript and PHP: `if`, `else if` / `elseif`, `else` and `switch`.
:::

:::definition Condition (Boolean expression)
An expression whose value is either **true** or **false**, built with **comparison operators** (`==`, `<`, `>=` …) and **logical operators** (AND `&&`, OR `||`, NOT `!`), e.g. `age >= 14 && age <= 18`.
:::

The structure of `if` is the same in JavaScript and PHP: the condition is written **in round brackets**, and the statements to run are written **in curly braces**. Only PHP variables need `$`, and PHP writes `elseif` as one word (JavaScript writes `else if`).

:::compare Selection statements
| Pseudocode | JavaScript | PHP |
|---|---|---|
| `IF mark >= 50 THEN` | `if (mark >= 50) {` | `if ($mark >= 50) {` |
| `ELSE IF mark >= 40 THEN` | `} else if (mark >= 40) {` | `} elseif ($mark >= 40) {` |
| `ELSE` | `} else {` | `} else {` |
| `ENDIF` | `}` | `}` |
| `CASE OF day` | `switch (day) { case "Sat": … break; }` | `switch ($day) { case "Sat": … break; }` |
:::

## Comparison and logical operators

:::compare Comparison and logical operators
| Meaning | JavaScript / PHP | Example | Result when x = 7 |
|---|---|---|---|
| equal to (value) | `==` | `x == "7"` | true (text "7" converted) |
| equal to (value **and type**) | `===` | `x === "7"` | false (number ≠ string) |
| not equal | `!=`  `!==` | `x != 5` | true |
| less / greater | `<`  `>` | `x > 7` | false |
| less or equal / greater or equal | `<=`  `>=` | `x >= 7` | true |
| AND — both must be true | `&&` (PHP also `and`) | `x > 0 && x < 10` | true |
| OR — at least one true | `\|\|` (PHP also `or`) | `x < 0 \|\| x > 10` | false |
| NOT — reverses | `!` | `!(x == 7)` | false |
:::

Three details are tested again and again:

- **`=` is assignment, `==` is comparison.** `if (x = 5)` does not compare — it *puts* 5 into x and the condition is then treated as true, so the `if` always runs. This is a classic **logic error**.
- **`==` compares values after conversion; `===` also compares types.** `"5" == 5` is true but `"5" === 5` is false. Using `===` avoids surprises, but then you must convert input first.
- **A range needs AND with the variable written twice.** "age between 14 and 18" is `age >= 14 && age <= 18`. Writing `14 <= age <= 18` is wrong in JavaScript (it compares `true <= 18`, which is always true).

## Two-way, multi-way and nested selection

A **two-way** selection (`if … else`) chooses between two paths. A **multi-way** selection (`if … else if … else`) tests conditions **in order from top to bottom** and runs the **first** branch whose condition is true; the remaining conditions are not even checked. That is why the order matters: for grades you must test the **highest** boundary first.

```javascript | Checking a PIN code (two-way selection)
let pin = prompt("Input your PIN code:");
if (pin == "1234") {                      // PIN compared as text
  alert("You entered successfully");
} else {
  alert("Error: incorrect PIN code");
}
```

```php | Multi-way selection in PHP: IF … ELSEIF … ELSE
<?php
$mark = 78;
if ($mark >= 90) {
    $grade = "A";
} elseif ($mark >= 75) {
    $grade = "B";
} elseif ($mark >= 50) {
    $grade = "C";
} else {
    $grade = "Fail";
}
echo "Grade: " . $grade;   // Grade: B
?>
```

:::mermaid How a multi-way IF is evaluated for mark = 78: the first true condition wins
flowchart TB
  S([mark = 78]) --> C1{mark >= 90?}
  C1 -- true --> A[grade = A]
  C1 -- false --> C2{mark >= 75?}
  C2 -- true --> B[grade = B]
  C2 -- false --> C3{mark >= 50?}
  C3 -- true --> C[grade = C]
  C3 -- false --> F[grade = Fail]
  A --> O([echo grade])
  B --> O
  C --> O
  F --> O
:::

If the conditions were written in the wrong order — `mark >= 50` first — a mark of 95 would get "C", because the first true condition wins. A **nested** selection is an `if` inside another `if`; it is used when the second question only makes sense after the first, e.g. *if* the user is logged in, *then if* they are a teacher show the marks editor.

```javascript | Logical operators: a discount for pupils aged 14–18 OR members
let age = 16, member = false, price = 2000;
if ((age >= 14 && age <= 18) || member) {
  price = price * 0.9;     // 10% discount
}
```

## The switch statement

When one variable is compared with **many fixed values**, `switch` is clearer than a long chain of `else if`. Each `case` is a possible value; `break` leaves the switch; `default` runs if no case matches. Without `break`, execution "falls through" into the next case — sometimes used on purpose to share code, as below.

```javascript | switch — choosing between many fixed values
let day = "Sat";
let message;
switch (day) {
  case "Sat":
  case "Sun":
    message = "Weekend";
    break;                 // leave the switch
  default:
    message = "School day";
}
```

:::compare if … else if or switch?
| | `if … else if … else` | `switch` |
|---|---|---|
| Tests | **Any** condition, including ranges and AND / OR | **Equality** of one expression with fixed values |
| Example | `mark >= 75`, `age >= 14 && age <= 18` | `case "Sat":`, `case 3:` |
| Readability | Becomes long with many values | Clear list of cases |
| Typical error | Wrong order of overlapping conditions | Forgotten `break` → fall-through |
:::

:::example Worked example — ticket prices at a cinema in Shymkent
**Scenario.** Children under 7 go free, pupils aged 7–17 pay 1 200 ₸, adults pay 2 000 ₸, and on Wednesday everyone pays half price. Write the selection and trace it.

```javascript | Multi-way selection followed by a second, independent if
const BASE = 2000;
let age = Number(prompt("Age:"));
let day = prompt("Day (Mon, Tue, Wed…):");
let price;
if (age < 7) {
  price = 0;
} else if (age <= 17) {          // only reached when age >= 7
  price = 1200;
} else {
  price = BASE;
}
if (day === "Wed") {
  price = price / 2;            // half price on Wednesday
}
alert("Ticket: " + price + " ₸");
```

| Inputs | First `if` chain | Wednesday? | Output |
|---|---|---|---|
| 5, "Mon" | `age < 7` true → 0 | no | Ticket: 0 ₸ |
| 12, "Wed" | `age < 7` false, `age <= 17` true → 1200 | yes → 600 | Ticket: 600 ₸ |
| 30, "Wed" | both false → `else` → 2000 | yes → 1000 | Ticket: 1000 ₸ |
| 17, "Fri" | `age <= 17` true → 1200 | no | Ticket: 1200 ₸ |

Notice that the second condition is `age <= 17`, not `age >= 7 && age <= 17`: because the chain is tested in order, any age that reaches the `else if` is already known to be 7 or more. The Wednesday check is a **separate** `if`, not an `else if`, because it must be applied **in addition** to the age rule.
:::

:::warning Common mistakes with variables and selection
- Using `=` (assignment) instead of `==` / `===` (comparison) in an `if`.
- Forgetting that `prompt()` and form fields return **text** — `"5" + "3"` is `"53"`; convert with `Number()` first.
- Writing the boundaries of a multi-way `if` in the wrong order (`>= 50` before `>= 90`), so higher marks get a lower grade.
- Writing a range as `14 <= age <= 18` instead of `age >= 14 && age <= 18`; using OR where AND is needed.
- Missing `$` on a PHP variable, or writing `else if` / `elseif` the wrong way for the language; forgetting `break` in a `switch`.
- Putting a password or secret price list in client-side JavaScript — anyone can read it with View source.
:::

# Exam practice: scripting basics and selection
@lo 11.5.4.1 11.5.3.8@paper

:::example Exam-style questions with model answers
**Q: State two differences between a client-side script and a server-side script. [2]**
A client-side script runs in the user's **browser**, a server-side script runs on the **web server** (1); client-side code is **visible** to the user / can be switched off, whereas server-side code is hidden and can access the **database** (1).

**Q: The user enters 4 and 6 into two prompt boxes and the script displays a + b. State the output and explain how to correct it. [3]**
Output **46** (1); `prompt()` returns **strings**, and `+` **joins** strings (1); convert with `Number(a) + Number(b)` / `parseInt` to get 10 (1).

**Q: Complete the code to check the PIN code 1234; if it is incorrect, display an error message. [3]**
`if (pin == "1234")` (1) `alert("You entered successfully");` (1) `else alert("Error, wrong PIN");` (1).

**Q: Write PHP code that outputs "Distinction" for $score ≥ 85, "Pass" for $score ≥ 50 and "Fail" otherwise. [4]**
`if ($score >= 85) { echo "Distinction"; }` (1) `elseif ($score >= 50) { echo "Pass"; }` (1) `else { echo "Fail"; }` (1); conditions in the correct order, highest first / correct PHP syntax with `$` and `echo` (1).

**Q: Explain why the order of conditions matters in an IF … ELSE IF statement. [2]**
Conditions are tested **from the top** and only the **first true** branch runs (1); if a lower boundary such as `>= 50` came first, a mark of 95 would match it and get the wrong grade (1).
:::

:::warning Common mistakes in exam answers
- Writing pseudocode (`IF … THEN … ENDIF`) when the question asks for JavaScript or PHP code.
- Forgetting quotes around text values (`pin == 1234` vs `pin == "1234"`) or the brackets around a condition.
- Saying "client-side is faster" without saying **why** (no request to the server).
:::

:::steps Check yourself
- Define a scripting language and say why it is called "interpreted".
- Give two differences between client-side and server-side scripts, with an example language for each.
- Why must a database password never be in JavaScript?
- What does `prompt()` return, and how do you turn it into a number?
- Write an `if … else` that outputs "Pass" if a mark is at least 50.
- What is the difference between `=`, `==` and `===`?
- When would you use `switch` instead of `if … else if`?
:::

# Iteration in a scripting language
@lo 11.5.4.4

## Why scripts repeat

Many tasks are the same small job done many times: add up the marks of 25 pupils, show every product in a shop, give the user three attempts at a password, keep asking for a number until it is valid. Writing the same statement 25 times would be long, error-prone and impossible when the number of repetitions is not known in advance. **Iteration** solves this: the statements are written **once**, inside a **loop**, and the loop repeats them.

:::definition Iteration (loop)
A control structure that **repeats** a block of statements — either a **fixed number of times** (count-controlled loop, `for`) or **while / until a condition** is met (condition-controlled loop, `while`, `do … while`).
:::

:::definition Count-controlled loop
A loop that repeats a **known number of times**, using a **counter** (loop variable) that is set to a start value, tested against an end value, and changed by a step after every iteration — `for (let i = 1; i <= 5; i++)`.
:::

:::definition Condition-controlled loop
A loop that repeats for as long as a **condition** stays true (or until it becomes true). The number of repetitions is **not known in advance**; it depends on data, such as what the user types. **Pre-condition** loops (`while`) test before the body; **post-condition** loops (`do … while`) test after it.
:::

## The for loop

A JavaScript or PHP `for` loop has three parts inside its brackets, separated by semicolons: **initialisation** (runs once, before the loop: `let i = 1`), **condition** (checked **before every** iteration: `i <= 5`) and **update** (runs **after every** iteration: `i++`, which means `i = i + 1`). The body runs only while the condition is true; as soon as it is false the loop ends and the program continues after the closing brace.

:::svg The three parts of a for loop and the order in which they run
<svg class="scr" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Code for (let i = 1; i is at most 5; i++) with three parts labelled: 1 initialisation runs once, 2 condition checked before each iteration, 4 update runs after each iteration. Below, a cycle: initialisation leads to the condition; if true, 3 the body runs, then 4 the update, then back to the condition; if false, the loop exits">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .m{font:700 15px ui-monospace,monospace;fill:var(--foreground)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.scr .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.scr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="scrA4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <rect class="bx" x="120" y="14" width="520" height="40" rx="6"/>
  <text class="m" x="380" y="40" text-anchor="middle">for ( let i = 1 ;  i &lt;= 5 ;  i++ ) { body }</text>
  <text class="s" x="268" y="72" text-anchor="middle">1 initialisation</text>
  <text class="s" x="380" y="72" text-anchor="middle">2 condition</text>
  <text class="s" x="480" y="72" text-anchor="middle">4 update</text>
  <rect class="pb" x="20" y="110" width="160" height="56" rx="6"/><text class="t" x="100" y="134" text-anchor="middle">1 let i = 1</text><text class="s" x="100" y="154" text-anchor="middle">runs once</text>
  <line class="ln" x1="180" y1="138" x2="246" y2="138" marker-end="url(#scrA4)"/>
  <rect class="wn" x="250" y="110" width="170" height="56" rx="6"/><text class="t" x="335" y="134" text-anchor="middle">2 i &lt;= 5 ?</text><text class="s" x="335" y="154" text-anchor="middle">before each pass</text>
  <line class="ln" x1="420" y1="138" x2="496" y2="138" marker-end="url(#scrA4)"/><text class="t" x="458" y="128" text-anchor="middle">true</text>
  <rect class="ok" x="500" y="110" width="150" height="56" rx="6"/><text class="t" x="575" y="134" text-anchor="middle">3 body runs</text><text class="s" x="575" y="154" text-anchor="middle">uses i</text>
  <line class="ln" x1="575" y1="166" x2="575" y2="206" marker-end="url(#scrA4)"/>
  <rect class="pb" x="500" y="210" width="150" height="50" rx="6"/><text class="t" x="575" y="240" text-anchor="middle">4 i++ (i = i + 1)</text>
  <path class="ln" d="M500,235 L335,235 L335,170" marker-end="url(#scrA4)"/>
  <line class="ln" x1="250" y1="150" x2="120" y2="230" marker-end="url(#scrA4)"/><text class="t" x="214" y="206" text-anchor="middle">false</text>
  <rect class="bad" x="20" y="232" width="160" height="44" rx="6"/><text class="t" x="100" y="259" text-anchor="middle">exit the loop</text>
  <text class="s" x="380" y="292" text-anchor="middle">i takes the values 1, 2, 3, 4, 5; when i becomes 6 the condition is false — 5 iterations.</text>
</svg>
:::

The loop variable can count in any step: `i += 2` counts in twos, `i--` counts **down**. To find how many times a `for` loop runs, list the values of the counter until the condition fails: `for (let i = 10; i >= 0; i -= 4)` runs for i = 10, 6, 2; then i = −2 fails the condition, so the body runs **3** times.

```javascript | Count-controlled loop that builds HTML: a 7 times table
let html = "";
for (let i = 1; i <= 5; i++) {
  html += "<li>" + i + " × 7 = " + i * 7 + "</li>";
}
document.getElementById("table").innerHTML = html;   // 7 times table
```

## while and do … while

A **while** loop is a **pre-condition** loop: the condition is tested **first**, so if it is false at the start the body runs **zero** times. A **do … while** loop is a **post-condition** loop: the body runs **first** and the condition is tested **after** it, so the body always runs **at least once**. That makes `do … while` the natural choice for **input that must be asked at least once and repeated until it is valid**.

:::svg Pre-condition (while) and post-condition (do … while) loops
<svg class="scr" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: while loop. The condition diamond comes first; if true, the body runs and control returns to the condition; if false, exit. The body may run zero times. Right: do while loop. The body comes first, then the condition; if true, return to the body; if false, exit. The body runs at least once">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.scr .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.scr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="scrA5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="190" y="24" text-anchor="middle">while (pre-condition)</text>
  <polygon class="wn" points="190,44 290,84 190,124 90,84"/><text class="t" x="190" y="89" text-anchor="middle">condition?</text>
  <line class="ln" x1="190" y1="124" x2="190" y2="160" marker-end="url(#scrA5)"/><text class="t" x="200" y="146">true</text>
  <rect class="ok" x="110" y="162" width="160" height="44" rx="6"/><text class="t" x="190" y="189" text-anchor="middle">body</text>
  <path class="ln" d="M110,184 L60,184 L60,84 L86,84" marker-end="url(#scrA5)"/>
  <line class="ln" x1="290" y1="84" x2="330" y2="84" marker-end="url(#scrA5)"/><text class="t" x="310" y="74" text-anchor="middle">false</text>
  <rect class="bad" x="300" y="100" width="60" height="30" rx="6"/><text class="t" x="330" y="120" text-anchor="middle">exit</text>
  <text class="s" x="190" y="236" text-anchor="middle">tested first → body may run 0 times</text>
  <text class="h" x="560" y="24" text-anchor="middle">do … while (post-condition)</text>
  <rect class="ok" x="480" y="44" width="160" height="44" rx="6"/><text class="t" x="560" y="71" text-anchor="middle">body</text>
  <line class="ln" x1="560" y1="88" x2="560" y2="118" marker-end="url(#scrA5)"/>
  <polygon class="wn" points="560,120 660,160 560,200 460,160"/><text class="t" x="560" y="165" text-anchor="middle">condition?</text>
  <path class="ln" d="M460,160 L430,160 L430,66 L476,66" marker-end="url(#scrA5)"/><text class="t" x="420" y="120" text-anchor="end">true</text>
  <line class="ln" x1="560" y1="200" x2="560" y2="236" marker-end="url(#scrA5)"/><text class="t" x="570" y="222">false</text>
  <rect class="bad" x="530" y="238" width="60" height="30" rx="6"/><text class="t" x="560" y="258" text-anchor="middle">exit</text>
  <text class="s" x="560" y="284" text-anchor="middle">tested after → body runs at least once</text>
</svg>
:::

```javascript | do … while: keep asking until the mark is between 0 and 100
let mark;
do {
  mark = Number(prompt("Enter a mark from 0 to 100:"));
} while (isNaN(mark) || mark < 0 || mark > 100);   // repeat while the input is invalid
alert("Mark accepted: " + mark);
```

The condition of the `do … while` above describes **invalid** input: "repeat *while* the mark is not a number OR below 0 OR above 100". Students often write the valid condition by mistake (`mark >= 0 && mark <= 100`), which repeats the question when the input is *correct* and accepts wrong input.

:::compare Loops
| Loop | When to use | Body runs | JavaScript | PHP |
|---|---|---|---|---|
| **for** | Number of repetitions known | Exactly n times | `for (let i = 1; i <= 5; i++) { … }` | `for ($i = 1; $i <= 5; $i++) { … }` |
| **while** (pre-condition) | Repeat **while** a condition is true; may not be needed at all | 0 or more times | `while (total <= 100) { … }` | `while ($total <= 100) { … }` |
| **do … while** (post-condition) | Body must run **at least once**, e.g. input | 1 or more times | `do { … } while (x < 8);` | `do { … } while ($x < 8);` |
| **for … of / foreach** | Every element of an array | Once per element | `for (const m of marks) { … }` | `foreach ($marks as $m) { … }` |
:::

## Loops over arrays, totals and counters

Loops are most often used to process a **collection** of values. Two patterns appear everywhere: a **total** (running sum), which starts at 0 and has each value added to it, and a **counter**, which starts at 0 and is increased by 1 whenever something is found. Both variables must be set **before** the loop — if `total = 0` were inside the loop, it would be reset on every iteration.

```php | Total and average of an array in PHP
<?php
$marks = [7, 9, 4, 10];
$total = 0;
foreach ($marks as $m) {
    $total += $m;                            // add each mark
}
$average = $total / count($marks);
echo "Total: $total, average: $average";     // Total: 30, average: 7.5
?>
```

## Ending a loop early: break, and avoiding infinite loops

`break` leaves a loop immediately, even if its condition is still true; `continue` skips the rest of the current iteration and goes to the next. A loop whose condition **never becomes false** is an **infinite loop**: the browser tab freezes or PHP stops with "maximum execution time exceeded". The usual cause is forgetting to **change the variable** the condition depends on — for example a `while (attempts < 3)` loop in which `attempts++` is missing.

```javascript | Three attempts to enter a PIN (loop + selection + break)
const MAX_ATTEMPTS = 3;
let attempts = 0;
let success = false;
while (attempts < MAX_ATTEMPTS) {
  let pin = prompt("Input your PIN code:");
  attempts++;                                  // count this attempt
  if (pin == "1234") {
    success = true;
    break;                                     // stop the loop early
  }
  alert("Wrong PIN. Attempts left: " + (MAX_ATTEMPTS - attempts));
}
if (success) alert("You entered successfully");
else alert("Your attempts have ended. Card blocked.");
```

:::example Worked example — tracing a loop with a trace table
**Question.** State the output of this code.

```javascript | Code to trace
let total = 0;
for (let i = 1; i <= 7; i += 2) {
  total = total + i;
}
console.log(total);
```

**Method.** Draw a column for each variable and for the condition, and one row per check of the condition.

| i | i <= 7? | total after body |
|---|---|---|
| 1 | true | 0 + 1 = 1 |
| 3 | true | 1 + 3 = 4 |
| 5 | true | 4 + 5 = 9 |
| 7 | true | 9 + 7 = 16 |
| 9 | **false** — loop ends | 16 |

The body runs **4** times and the output is **16** (the sum of the odd numbers 1 + 3 + 5 + 7). Common slips: stopping at i = 5 because "7 is the end" (the condition is `<=`, so 7 is included), or adding 9 (the body does not run when the condition is false).
:::

:::example Worked example — a condition-controlled loop with unknown repetitions
**Scenario.** A savings account at a Kazakh bank starts with 100 000 ₸ and earns 14 % a year. How many years until it reaches 150 000 ₸?

```javascript | while loop: the number of repetitions depends on the data
let balance = 100000;
let years = 0;
while (balance < 150000) {
  balance = balance * 1.14;   // add 14% interest
  years++;
}
console.log(years + " years, balance " + Math.round(balance) + " ₸");
```

| years | balance before check | balance < 150000? |
|---|---|---|
| 0 | 100 000 | true |
| 1 | 114 000 | true |
| 2 | 129 960 | true |
| 3 | 148 154 | true |
| 4 | 168 896 | **false** |

Output: **4 years, balance 168896 ₸**. A `for` loop would be wrong here, because the number of years is exactly what we are trying to find. A `while` is right because the loop must not run at all if the balance already meets the target.
:::

## Nested loops

A loop can be placed **inside** another loop. The inner loop runs **completely** for every single iteration of the outer loop, so if the outer loop runs 3 times and the inner loop 4 times, the inner body runs 3 × 4 = **12** times. Nested loops are used for anything with **rows and columns**: a multiplication table, the seats in a cinema hall, the cells of a timetable, a two-dimensional array of marks for several classes.

```javascript | Nested loops build a 3 × 4 grid of seat numbers (row letter + seat)
const ROWS = ["A", "B", "C"];
let html = "";
for (const row of ROWS) {               // outer loop: 3 rows
  for (let seat = 1; seat <= 4; seat++) { // inner loop: 4 seats in each row
    html += row + seat + " ";             // A1 A2 A3 A4 B1 …
  }
  html += "<br>";                        // new line after each row
}
document.getElementById("hall").innerHTML = html;
```

When tracing nested loops, change the **inner** loop variable fastest: A1, A2, A3, A4, then the outer variable changes to B and the inner one starts again from 1.

:::tip Choosing the right loop
Ask two questions. *Do I know how many times?* → `for` (or `foreach` for every element of an array). *If not, must the body run at least once?* → `do … while`; otherwise `while`.
:::

# Validation and verification in code
@lo 11.5.4.3

## Why scripts must check data

"Garbage in, garbage out": a program that stores a mark of 750 or an age of −3 will produce nonsense reports, and a program that trusts whatever is typed into a form can be broken or attacked. Before data is processed or saved, the script should check it. There are two different kinds of check, and the exam often asks you to tell them apart.

:::definition Validation
An **automatic check carried out by the program** to make sure that data is **reasonable, sensible and follows the rules** (for example within a range or in the right format) before it is accepted. Validation **cannot** check that data is *correct* — only that it is *allowed*.
:::

:::definition Verification
A check that data has been **entered or copied accurately**, so that it **matches the original source** or what the user intended — for example **double entry** (typing a password twice and comparing) or a **visual check** (reading the data back on screen).
:::

:::compare Validation vs verification
| | Validation | Verification |
|---|---|---|
| Meaning | An **automatic check by the program** that data is **reasonable / sensible** and follows the rules | A check that data has been **entered or copied correctly** — matches the original |
| Question it answers | "Is the data **allowed**?" | "Is the data **what the user meant**?" |
| Examples | Presence, length, type, range, format, lookup, check digit | **Double entry** (type twice and compare), **visual check** (proof-reading, "Confirm your details") |
| Limitation | Valid data can still be **wrong** (age 17 typed instead of 16) | Both entries could contain the **same** mistake; does not check that data is sensible |
| In code | `if (age < 14 \|\| age > 18)` | `if (pass !== confirm)` |
:::

The two checks complement each other. An age of 17 typed instead of 16 passes a range check (it is valid) but is wrong — only verification can catch it. A password typed the same way twice passes verification, but if it is only three characters long it should be rejected by a length check (validation).

## Types of validation check and how to code them

:::compare Validation checks
| Check | What it tests | Example in JavaScript | Example in PHP |
|---|---|---|---|
| **Presence** | A value has been entered | `if (name === "")` | `if (trim($name) === "")` |
| **Length** | Number of characters | `if (password.length < 8)` | `if (strlen($password) < 8)` |
| **Type** | Correct data type, e.g. a number | `if (isNaN(age))` | `if (!is_numeric($age))` |
| **Range** | Between a lower and upper limit | `if (age < 14 \|\| age > 18)` | `if ($age < 14 \|\| $age > 18)` |
| **Format** | Matches a pattern | `/^\d{6}$/.test(postcode)` | `preg_match('/^\d{6}$/', $postcode)`; `filter_var($email, FILTER_VALIDATE_EMAIL)` |
| **Lookup** | Value is in a list of allowed values | `["A","B","C"].includes(grade)` | `in_array($grade, ["A","B","C"])` |
:::

A **format** check uses a **regular expression** — a pattern. `^` means "start", `$` means "end", `\d` means "a digit" and `{6}` means "exactly six times", so `/^\d{6}$/` accepts a Kazakh postcode such as 010000 and rejects "01000" or "01000A". A Kazakh **IIN** (individual identification number) is 12 digits: `/^\d{12}$/`. A phone number in the form +7 7XX XXX XX XX could be `/^\+77\d{9}$/`.

A **check digit** is a special case used for codes such as ISBNs of books, bank card numbers and barcodes. The last digit of the code is **calculated from the other digits** by a fixed formula when the code is created. When the code is typed in, the script repeats the calculation and compares the result with the last digit; if they differ, a digit was mistyped or two digits were swapped. For example, bank card numbers use the Luhn algorithm, so a payment page can reject a mistyped card number **before** sending it to the bank. Although it detects typing errors, a check digit is still classed as **validation**, because the program checks the code automatically against a rule.

Notice that the checks have an order: a **type** check should come before a **range** check, because comparing "abc" with 14 makes no sense. In the PHP example below this is done with `elseif`, so the range is only tested if the value is numeric.

## Validating in the browser and on the server

HTML itself can do simple validation with attributes such as `required`, `min`, `max`, `maxlength`, `type="email"` and `pattern`. JavaScript can do more complex checks and show friendly messages. But anything done in the browser **can be switched off or bypassed** — the user can disable JavaScript, edit the page in developer tools, or send data to the server directly without using the form at all. Therefore the **server must always validate again**.

:::svg Two layers of checks: instant feedback in the browser, trusted checks on the server
<svg class="scr" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The user fills in a form. Layer 1 in the browser: HTML attributes and JavaScript check presence, range and that passwords match; if invalid, an error message appears at once and the form is not sent. If valid, data goes over the internet to layer 2 on the server: PHP repeats every check. If invalid, an error page is returned. If valid, data is saved in the database. A dashed arrow shows an attacker sending data directly to the server, skipping layer 1, which layer 2 still catches">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.scr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.scr .dn{stroke:var(--danger);stroke-width:2;fill:none;stroke-dasharray:6 4}
  </style>
  <defs>
    <marker id="scrA6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
    <marker id="scrA7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker>
  </defs>
  <rect class="bx" x="20" y="60" width="110" height="60" rx="6"/><text class="t" x="75" y="86" text-anchor="middle">User fills</text><text class="t" x="75" y="104" text-anchor="middle">in form</text>
  <line class="ln" x1="130" y1="90" x2="166" y2="90" marker-end="url(#scrA6)"/>
  <rect class="pb" x="170" y="40" width="200" height="100" rx="8"/><text class="h" x="270" y="62" text-anchor="middle">Layer 1: browser</text><text class="t" x="270" y="84" text-anchor="middle">HTML required, min, max</text><text class="t" x="270" y="102" text-anchor="middle">JavaScript checks</text><text class="s" x="270" y="122" text-anchor="middle">instant, can be bypassed</text>
  <line class="ln" x1="270" y1="140" x2="270" y2="186" marker-end="url(#scrA6)"/><text class="t" x="280" y="168">invalid</text>
  <rect class="bad" x="190" y="188" width="160" height="44" rx="6"/><text class="t" x="270" y="215" text-anchor="middle">message, not sent</text>
  <line class="ln" x1="370" y1="90" x2="426" y2="90" marker-end="url(#scrA6)"/><text class="t" x="398" y="80" text-anchor="middle">valid</text>
  <rect class="pb" x="430" y="40" width="200" height="100" rx="8"/><text class="h" x="530" y="62" text-anchor="middle">Layer 2: server</text><text class="t" x="530" y="84" text-anchor="middle">PHP repeats every</text><text class="t" x="530" y="102" text-anchor="middle">check</text><text class="s" x="530" y="122" text-anchor="middle">trusted</text>
  <line class="ln" x1="630" y1="90" x2="666" y2="90" marker-end="url(#scrA6)"/>
  <rect class="ok" x="670" y="60" width="80" height="60" rx="6"/><text class="t" x="710" y="86" text-anchor="middle">save to</text><text class="t" x="710" y="104" text-anchor="middle">database</text>
  <line class="ln" x1="530" y1="140" x2="530" y2="186" marker-end="url(#scrA6)"/><text class="t" x="540" y="168">invalid</text>
  <rect class="bad" x="450" y="188" width="160" height="44" rx="6"/><text class="t" x="530" y="215" text-anchor="middle">error page returned</text>
  <path class="dn" d="M75,120 L75,262 L440,262 L440,144" marker-end="url(#scrA7)"/>
  <text class="t" x="250" y="282" text-anchor="middle">attacker sends data directly — layer 1 skipped, layer 2 still checks</text>
</svg>
:::

```javascript | Client-side validation and verification when a form is submitted
document.getElementById("signup").addEventListener("submit", function (event) {
  const name = document.getElementById("name").value.trim();
  const age = Number(document.getElementById("age").value);
  const pass = document.getElementById("pass").value;
  const confirm = document.getElementById("confirm").value;
  let errors = [];

  if (name === "") errors.push("Name is required");                    // presence
  if (isNaN(age) || age < 14 || age > 18) errors.push("Age 14–18");    // type + range
  if (pass.length < 8) errors.push("Password: at least 8 characters"); // length
  if (pass !== confirm) errors.push("Passwords do not match");         // verification

  if (errors.length > 0) {
    event.preventDefault();                                            // do not send the form
    document.getElementById("msg").textContent = errors.join("; ");
  }
});
```

```php | Server-side validation of the same form in PHP
<?php
$errors = [];
$name  = trim($_POST["name"] ?? "");
$age   = $_POST["age"] ?? "";
$email = $_POST["email"] ?? "";

if ($name === "")                               $errors[] = "Name is required.";        // presence
if (strlen($name) > 40)                         $errors[] = "Name is too long.";         // length
if (!is_numeric($age))                          $errors[] = "Age must be a number.";     // type
elseif ($age < 14 || $age > 18)                 $errors[] = "Age must be 14–18.";        // range
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email format is invalid.";  // format
if ($_POST["password"] !== $_POST["confirm"])   $errors[] = "Passwords do not match.";   // verification

if ($errors) { foreach ($errors as $e) echo "<p class='error'>$e</p>"; }
else { echo "Data accepted."; }
?>
```

Both scripts collect **all** the errors in an array and show them together, instead of stopping at the first one — the user can then fix everything in one go. The JavaScript version calls `event.preventDefault()` to stop the form from being sent while there are errors.

:::example Worked example — designing checks for a school olympiad registration form
**Scenario.** A registration form for a regional informatics olympiad in Karaganda has the fields below. Choose a check for each field and write the condition that **rejects** bad data.

| Field | Rule | Check | JavaScript condition that rejects | Valid / invalid test data |
|---|---|---|---|---|
| Surname | must be entered | Presence | `surname.trim() === ""` | "Akhmetova" / "" |
| Grade | 9, 10 or 11 only | Lookup (or range) | `![9, 10, 11].includes(grade)` | 10 / 8 |
| IIN | exactly 12 digits | Format + length | `!/^\d{12}$/.test(iin)` | 080512650123 / 08051265 |
| Year of birth | 2006–2012 | Type + range | `isNaN(year) \|\| year < 2006 \|\| year > 2012` | 2009 / 1990 |
| Email (twice) | same in both fields | **Verification** (double entry) | `email !== email2` | same / different |

**Testing the checks.** Validation code itself must be tested with three kinds of data: **normal** data that should be accepted (2009), **boundary** data at the very edge of the range (2006 and 2012 must be accepted; 2005 and 2013 rejected), and **erroneous** data of the wrong type or far outside the rules ("two thousand", 1990). Boundary values catch the most common bug in range checks — writing `<` where `<=` was needed.

**Explanation.** Each condition is written as the **error** case, so the code reads `if (condition) errors.push(…)`. The email is checked twice because a typing mistake in the address would be *valid* (it still looks like an email) but the organisers could never contact the pupil — only double entry catches that. For each check you should test **valid**, **invalid** and **boundary** data (2006 and 2012 must be accepted, 2005 and 2013 rejected).
:::

# Good programming style
@lo 11.5.4.1 11.5.4.4

## Code is read more often than it is written

A script is written once but read many times — by you next month, by a classmate in your project team, by the teacher marking it, by the person who maintains the site after you. **Good programming style** is a set of habits that make code **easy to read, understand, test and change**. It does not change what the program does, but it greatly reduces **errors** and the **time** needed to fix them. In the exam you may be asked to state rules of good style or to improve badly written code.

:::cards
### Meaningful identifiers
- Names say what the value **is**: `totalCost`, `attemptsLeft`, not `x`, `a1`, `t`.
- Use **one naming convention**: camelCase in JavaScript (`studentName`), snake_case or camelCase in PHP — but the same everywhere.
### Indentation and layout
- Indent the body of every `if`, loop and function by the same amount (2 or 4 spaces).
- One statement per line; blank lines between logical parts.
### Comments
- Explain **why** the code does something, or what a block is for: `// 10% discount for members`.
- Do not comment the obvious (`i++ // add 1 to i`).
### Constants instead of magic numbers
- `const MAX_ATTEMPTS = 3;` — the rule is changed in **one** place and the code explains itself.
### Functions
- Split the script into **functions** that each do **one job**: `validateAge()`, `showError()`.
- A function can be tested on its own and reused.
### Robustness
- **Validate input**; handle errors (failed database connection, empty result) with clear messages.
:::

:::compare Poor style and good style
| Poor style | Good style | Why it is better |
|---|---|---|
| `let a = prompt(); let b = a*0.9;` | `let price = Number(prompt("Price:")); let discounted = price * (1 - DISCOUNT);` | Names describe the data; input converted; rule in a constant |
| All code on one line, no indentation | Each statement on its own line, bodies indented | Structure of `if` and loops is visible |
| `if (x > 3)` repeated in five places | `const MAX_ATTEMPTS = 3;` used everywhere | Change the rule once |
| 80 lines in one block | Small functions `checkPin()`, `blockCard()` | Each part tested and reused separately |
| No comments, or comments that repeat the code | Comments explaining the purpose | A reader understands the intent |
:::

:::example Worked example — improving a badly written script
**Before.** The code below works, but it is hard to read and to change.

```javascript | Before: poor style
let a=0;let b;while(a<3){b=prompt("pin");a++;if(b=="1234"){alert("ok");break;}}
if(a==3&&b!="1234")alert("blocked");
```

**After.** Same behaviour, written in good style.

```javascript | After: meaningful names, a constant, indentation, comments, a function
const CORRECT_PIN = "1234";   // in a real system the PIN is checked on the server
const MAX_ATTEMPTS = 3;

function askForPin() {
  let attempts = 0;
  while (attempts < MAX_ATTEMPTS) {
    let pin = prompt("Enter your PIN:");
    attempts++;
    if (pin === CORRECT_PIN) {
      return true;              // correct PIN: stop asking
    }
  }
  return false;                 // all attempts used
}

if (askForPin()) alert("Access granted");
else alert("Card blocked");
```

**Improvements made:** (1) identifiers `attempts`, `pin` instead of `a`, `b`; (2) constants for the PIN and the number of attempts; (3) one statement per line with indentation; (4) a function with one job that returns true or false; (5) comments that explain *why*; (6) a simpler final test — the original `a==3&&b!="1234"` was easy to get wrong.
:::

:::warning Common mistakes with loops, validation and style
- A loop that never ends because the counter / condition variable is **not changed** inside it.
- Off-by-one errors: `i < 5` runs 5 times from 0 but only 4 times from 1; check the first and last values.
- Setting `total = 0` **inside** the loop, so it is reset on every pass.
- Writing the condition of a `do … while` for **valid** data, so correct input is asked for again.
- Saying verification checks whether data is "reasonable" — that is **validation**; verification checks that it was **entered correctly**.
- Validating only in JavaScript — client-side checks can be bypassed, so the server must check again.
- Doing a range check before a type check (comparing text with a number).
:::

# Exam practice: loops, validation and style
@lo 11.5.4.3 11.5.4.4

:::example Exam-style questions with model answers
**Q: State the output of `let n = 20; let c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } console.log(c);` [2]**
n takes the values 10, 5, 2, 1 (1); the loop runs 4 times, output **4** (1).

**Q: Explain why a do … while loop is suitable for asking the user to enter a mark between 0 and 100. [2]**
The body runs **at least once**, so the user is always asked (1); the condition is tested **after** the input and the question is **repeated while** the mark is invalid (1).

**Q: Write JavaScript that gives the user 3 attempts to enter the password "qwerty" and shows "Blocked" if all fail. [4]**
A counter starting at 0 and a loop while attempts < 3 (1); input with `prompt` inside the loop and the counter increased (1); `if (password == "qwerty")` with a success message and `break` (1); after the loop, "Blocked" shown only if not successful (1).

**Q: Explain the difference between data validation and data verification. [2]**
Validation is an **automatic check** that data is **sensible / follows rules**, e.g. a range check (1); verification checks that data was **entered correctly / matches the original**, e.g. double entry (1).

**Q: Explain why a form should be validated by both JavaScript and PHP. [2]**
JavaScript gives **instant feedback** without sending data to the server (1); PHP checks are needed because client-side scripts **can be disabled or bypassed** (1).

**Q: State two rules of good programming style and explain how each helps. [4]**
**Meaningful identifiers** (1) — the reader knows what each variable stores (1); **indentation** (1) — shows which statements belong to an `if` or loop, so errors are easier to find (1).
:::

:::warning Common mistakes in exam answers
- In trace questions, writing only the final output — show each value of the variables to earn method marks.
- Naming a check ("range check") without stating the **limits** or giving the code.
- Giving "password entered twice" as a validation check — it is **verification**.
:::

:::steps Check yourself
- Name the three parts of a `for` loop and say when each runs.
- How many times does `for (let i = 10; i >= 0; i -= 4)` run?
- Explain the difference between a pre-condition and a post-condition loop.
- Write a loop that allows three attempts at a password.
- Name six validation checks and two verification methods, with code for three of them.
- Why must data be validated on the server even if it was validated in the browser?
- List five rules of good programming style.
:::

# Connecting to a database from a script
@lo 11.5.4.5

## Why a web page needs a database

A static HTML page shows the same content to everybody until someone edits the file. A school library catalogue, an online shop or a gradebook must show **current** data — books added this morning, today's stock, the mark the teacher entered five minutes ago — and must **remember** what users submit. That data is kept in a **database** managed by a database management system (DBMS) such as **MySQL** or MariaDB, running on the server. A **procedural server-side script** written in PHP acts as the bridge: it connects to the DBMS, sends it **SQL** statements, receives the results and turns them into HTML.

The word *procedural* means the script is written as a sequence of steps and calls to **functions** — `mysqli_connect()`, `mysqli_query()` and so on — rather than objects. (PHP also has an object-oriented style, `$conn->query(…)`, which does the same thing.)

:::definition Database connection
A **link opened by a script to a database server**, identified by the server name (host), a **username**, a **password** and the **database name**. All queries are sent through the connection, and it should be **closed** when the script has finished.
:::

:::definition Result set
The **table of rows returned by a SELECT query**. The script reads it **one row at a time**, usually in a loop, until there are no rows left.
:::

## The five steps of working with a database

:::steps Steps of working with a database in PHP
- **Connect** to the database server with `mysqli_connect(server, username, password, database)`.
- **Check** the connection; if it failed, stop with `die(…)` and show `mysqli_connect_error()`.
- **Send an SQL query** with `mysqli_query($conn, $sql)` — SELECT, INSERT, UPDATE or DELETE.
- **Process the result** — loop through the rows with `mysqli_fetch_assoc($result)`.
- **Close** the connection with `mysqli_close($conn)`.
:::

:::svg A PHP script talks to MySQL in five steps; the user only sees the HTML it produces
<svg class="scr" viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left column: the PHP script with five steps. 1 connect with mysqli_connect, 2 check the connection, 3 send SQL with mysqli_query, 4 fetch rows with mysqli_fetch_assoc in a while loop, 5 close with mysqli_close. Right: the MySQL server with database library and table Book containing three rows. Arrows: the connection request and the SQL go to MySQL; the result set of rows comes back to step 4. At the bottom the HTML list of books sent to the browser">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .m{font:700 12px ui-monospace,monospace;fill:var(--primary)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .ar{stroke:var(--primary);stroke-width:2.5;fill:none}
    svg.scr .ag{stroke:var(--success);stroke-width:2.5;fill:none}
  </style>
  <defs>
    <marker id="scrA8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="scrA9" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
  </defs>
  <text class="h" x="160" y="22" text-anchor="middle">PHP script (books.php)</text>
  <rect class="pb" x="20" y="34" width="280" height="40" rx="6"/><text class="t" x="32" y="52">1 Connect</text><text class="m" x="32" y="67">mysqli_connect(host, user, pass, db)</text>
  <rect class="bx" x="20" y="80" width="280" height="40" rx="6"/><text class="t" x="32" y="98">2 Check</text><text class="m" x="32" y="113">if (!$conn) die(…)</text>
  <rect class="pb" x="20" y="126" width="280" height="40" rx="6"/><text class="t" x="32" y="144">3 Query</text><text class="m" x="32" y="159">mysqli_query($conn, "SELECT …")</text>
  <rect class="ok" x="20" y="172" width="280" height="40" rx="6"/><text class="t" x="32" y="190">4 Fetch rows in a loop</text><text class="m" x="32" y="205">while ($row = mysqli_fetch_assoc(…))</text>
  <rect class="bx" x="20" y="218" width="280" height="40" rx="6"/><text class="t" x="32" y="236">5 Close</text><text class="m" x="32" y="251">mysqli_close($conn)</text>
  <rect class="bx" x="470" y="34" width="270" height="200" rx="10"/><text class="h" x="605" y="58" text-anchor="middle">MySQL server</text><text class="s" x="605" y="78" text-anchor="middle">database: library · table: Book</text>
  <rect class="ok" x="490" y="90" width="230" height="28"/><text class="t" x="500" y="109">Title</text><text class="t" x="640" y="109">Author</text>
  <rect class="bx" x="490" y="118" width="230" height="28"/><text class="t" x="500" y="137">Abai Zholy</text><text class="t" x="640" y="137">Auezov</text>
  <rect class="bx" x="490" y="146" width="230" height="28"/><text class="t" x="500" y="165">Kara sozder</text><text class="t" x="640" y="165">Abai</text>
  <rect class="bx" x="490" y="174" width="230" height="28"/><text class="t" x="500" y="193">Kuyshi</text><text class="t" x="640" y="193">Sh. Ualikhanov</text>
  <line class="ar" x1="300" y1="54" x2="466" y2="54" marker-end="url(#scrA8)"/><text class="s" x="383" y="46" text-anchor="middle">open connection</text>
  <line class="ar" x1="300" y1="146" x2="466" y2="146" marker-end="url(#scrA8)"/><text class="s" x="383" y="138" text-anchor="middle">SQL statement</text>
  <line class="ag" x1="466" y1="192" x2="304" y2="192" marker-end="url(#scrA9)"/><text class="s" x="383" y="210" text-anchor="middle">result set, row by row</text>
  <rect class="ok" x="20" y="272" width="720" height="38" rx="6"/><text class="t" x="380" y="296" text-anchor="middle">Output sent to the browser: Abai Zholy — Auezov&lt;br&gt; Kara sozder — Abai&lt;br&gt; … (HTML only)</text>
</svg>
:::

```php | Connecting to the "library" database and listing books
<?php
$servername = "localhost";
$username   = "username";
$password   = "password";
$db         = "library";

$conn = mysqli_connect($servername, $username, $password, $db);   // 1 connect
if (!$conn) {                                                     // 2 check
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT Title, Author FROM Book ORDER BY Title";
$result = mysqli_query($conn, $sql);                             // 3 query

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {                  // 4 process rows
        echo $row["Title"] . " — " . $row["Author"] . "<br>";
    }
} else {
    echo "No books found";
}
mysqli_close($conn);                                              // 5 close
?>
```

Look closely at each step.

- **Connect.** `localhost` means the database runs on the same computer as the web server. The four parameters must be in the order **server, username, password, database**. The function returns a **connection object**, stored in `$conn`, or **false** if it fails (wrong password, server down, database name misspelled).
- **Check.** `if (!$conn)` means "if the connection is false". `die()` stops the script and prints a message, so the script does not continue and produce confusing errors later. On a public site the detailed error should be **logged**, not shown, because it may reveal information about the server.
- **Query.** `mysqli_query()` sends any SQL statement. For SELECT it returns a **result set**; for INSERT, UPDATE and DELETE it returns **true** or **false**.
- **Process.** `mysqli_num_rows()` tells how many rows were found. `mysqli_fetch_assoc()` returns the **next row** as an **associative array** whose keys are the **field names** — `$row["Title"]` — and returns `null` when there are no more rows, which ends the `while` loop. This is iteration (from lesson 2) applied to data from a database.
- **Close.** `mysqli_close()` frees the connection. PHP closes it automatically at the end of the script, but closing it explicitly is good style, especially in long scripts.

:::compare Key mysqli functions
| Function | Purpose | Returns |
|---|---|---|
| `mysqli_connect()` | Opens a connection | The connection, or **false** |
| `mysqli_connect_error()` | Describes why the connection failed | Text |
| `mysqli_query()` | Sends an SQL statement | A result set for SELECT; true / false for others |
| `mysqli_num_rows()` | Counts the rows in a result | A number |
| `mysqli_fetch_assoc()` | Gets the next row, indexed by **field name** | An array, or null at the end |
| `mysqli_fetch_row()` | Gets the next row, indexed by **number** (`$row[0]`) | An array, or null |
| `mysqli_error()` | Describes the last query error | Text |
| `mysqli_prepare()` / `mysqli_stmt_bind_param()` / `mysqli_stmt_execute()` | **Prepared statement** — safely inserts user data | A statement / true / false |
| `mysqli_close()` | Closes the connection | true / false |
:::

:::example Worked example — showing the results as an HTML table
**Scenario.** The school gradebook database `school` has a table `Result(StudentName, Subject, Mark)`. Show all informatics marks of 70 or more, best first, as an HTML table.

```php | Building an HTML table from a SELECT query
<?php
$conn = mysqli_connect("localhost", "teacher", "s3cret", "school");
if (!$conn) die("Connection failed: " . mysqli_connect_error());

$sql = "SELECT StudentName, Mark FROM Result
        WHERE Subject = 'Informatics' AND Mark >= 70
        ORDER BY Mark DESC";
$result = mysqli_query($conn, $sql);

echo "<table><tr><th>Student</th><th>Mark</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr><td>" . $row["StudentName"] . "</td><td>" . $row["Mark"] . "</td></tr>";
}
echo "</table>";
echo "<p>" . mysqli_num_rows($result) . " students found</p>";
mysqli_close($conn);
?>
```

**How it works.** The table header is printed **once, before** the loop; one `<tr>` row is printed **inside** the loop for each database row; the closing `</table>` comes **after** the loop. If the result held Dana 95, Arman 88, Aigerim 71, the browser would receive a three-row table and "3 students found". Putting `<table>` inside the loop would wrongly create a separate table for every student.
:::

# Reading and changing data safely
@lo 11.5.4.5

## Changing data: INSERT, UPDATE, DELETE

The same connection is used to **change** data. An INSERT adds a record, an UPDATE changes fields of existing records, and a DELETE removes records. These queries do not return rows; the script checks whether they **succeeded** and, if useful, how many rows were affected with `mysqli_affected_rows($conn)`. After an INSERT into a table with an AUTO_INCREMENT key, `mysqli_insert_id($conn)` gives the number the new record received — for example the order number to show the customer.

## The danger: SQL injection

The data for these queries usually comes **from a form**. The tempting way to build the query is to glue the user's input into the SQL string:

```php | DANGEROUS — never build SQL by joining user input into the string
$login = $_POST["login"];
$sql = "SELECT * FROM Users WHERE Login = '" . $login . "'";
```

If a normal user types `aliya`, the query is `… WHERE Login = 'aliya'`. But an attacker can type `' OR '1'='1`. The query becomes `… WHERE Login = '' OR '1'='1'`, and because `'1'='1'` is always true, it returns **every user**. With other input an attacker can read hidden tables or even delete data. This attack is called **SQL injection**, and it is one of the most common causes of real data leaks.

:::definition SQL injection
An attack in which a user enters **SQL code** into an input field, and the script **joins it into a query**, so that the database runs commands the programmer never intended — e.g. returning all records or deleting a table.
:::

:::definition Prepared statement (parameterised query)
An SQL statement sent to the database **with placeholders (`?`) instead of values**; the values are sent **separately** and are always treated as **data, never as SQL code**. This is the standard defence against SQL injection.
:::

:::svg Joining input into SQL lets it change the query; a prepared statement keeps it as data
<svg class="scr" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top half, unsafe: the input quote OR quote 1 equals 1 is joined into the SQL string, producing WHERE Login equals empty OR 1 equals 1, so the database returns all users. Bottom half, safe: the query template WHERE Login equals question mark is sent first and the input is sent separately as a value, so the database looks for a user whose login is literally that text and returns no rows">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .m{font:700 12px ui-monospace,monospace;fill:var(--foreground)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.scr .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="scrA10" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="20" y="24">Unsafe: input joined into the SQL string</text>
  <rect class="bx" x="20" y="36" width="170" height="54" rx="6"/><text class="s" x="105" y="56" text-anchor="middle">input</text><text class="m" x="105" y="78" text-anchor="middle">' OR '1'='1</text>
  <line class="ln" x1="190" y1="63" x2="226" y2="63" marker-end="url(#scrA10)"/>
  <rect class="bad" x="230" y="36" width="330" height="54" rx="6"/><text class="s" x="395" y="56" text-anchor="middle">query the database receives</text><text class="m" x="395" y="78" text-anchor="middle">WHERE Login = '' OR '1'='1'</text>
  <line class="ln" x1="560" y1="63" x2="596" y2="63" marker-end="url(#scrA10)"/>
  <rect class="bad" x="600" y="36" width="140" height="54" rx="6"/><text class="t" x="670" y="60" text-anchor="middle">ALL users</text><text class="t" x="670" y="80" text-anchor="middle">returned</text>
  <text class="s" x="20" y="112">The input changed the meaning of the query: OR '1'='1' is always true.</text>
  <text class="h" x="20" y="154">Safe: prepared statement</text>
  <rect class="ok" x="230" y="166" width="330" height="40" rx="6"/><text class="m" x="395" y="191" text-anchor="middle">1 template: WHERE Login = ?</text>
  <rect class="bx" x="230" y="214" width="330" height="40" rx="6"/><text class="m" x="395" y="239" text-anchor="middle">2 value sent separately: ' OR '1'='1</text>
  <rect class="bx" x="20" y="190" width="170" height="54" rx="6"/><text class="s" x="105" y="210" text-anchor="middle">same input</text><text class="m" x="105" y="232" text-anchor="middle">' OR '1'='1</text>
  <line class="ln" x1="190" y1="226" x2="226" y2="232" marker-end="url(#scrA10)"/>
  <line class="ln" x1="560" y1="210" x2="596" y2="210" marker-end="url(#scrA10)"/>
  <rect class="ok" x="600" y="182" width="140" height="56" rx="6"/><text class="t" x="670" y="206" text-anchor="middle">0 rows: no user</text><text class="t" x="670" y="226" text-anchor="middle">with that login</text>
  <text class="s" x="20" y="280">The value is only ever data, so it cannot change the SQL command.</text>
</svg>
:::

```php | Adding a record from a form with a prepared statement (INSERT)
<?php
$conn = mysqli_connect("localhost", "username", "password", "library");
if (!$conn) die("Connection failed: " . mysqli_connect_error());
$title  = trim($_POST["title"] ?? "");
$author = trim($_POST["author"] ?? "");
$year   = (int)($_POST["year"] ?? 0);

if ($title === "" || $author === "") die("Title and author are required.");  // validation first

$stmt = mysqli_prepare($conn, "INSERT INTO Book (Title, Author, Year) VALUES (?, ?, ?)");
mysqli_stmt_bind_param($stmt, "ssi", $title, $author, $year);   // s = string, i = integer
if (mysqli_stmt_execute($stmt)) {
    echo "New book added with ID " . mysqli_insert_id($conn);
} else {
    echo "Error: " . mysqli_error($conn);
}
mysqli_close($conn);
?>
```

The string `"ssi"` tells `bind_param` the **type** of each placeholder in order: `s` string, `i` integer, `d` decimal (double). There must be exactly as many letters and variables as there are `?` marks.

The same pattern works for UPDATE and DELETE. When a pupil returns a book, the librarian's page might run the script below. The `WHERE` clause is essential: an UPDATE or DELETE **without** `WHERE` changes or removes **every** record in the table.

```php | UPDATE and DELETE with prepared statements and a check of affected rows
<?php
$bookId = (int)$_POST["book_id"];                       // type conversion = simple validation

$stmt = mysqli_prepare($conn, "UPDATE Book SET OnLoan = 0 WHERE BookID = ?");
mysqli_stmt_bind_param($stmt, "i", $bookId);
mysqli_stmt_execute($stmt);
if (mysqli_affected_rows($conn) === 1) echo "Book $bookId returned.";
else echo "No book with ID $bookId.";

$stmt = mysqli_prepare($conn, "DELETE FROM Reservation WHERE BookID = ?");
mysqli_stmt_bind_param($stmt, "i", $bookId);
mysqli_stmt_execute($stmt);                             // remove reservations for this book
?>
```

## Keeping the connection and the output safe

Three further habits protect a database-driven site.

- **Keep credentials out of the web folder.** The database username and password are usually stored in a separate file such as `config.php`, placed outside the public folder and included with `require "config.php";`. Then they are written in **one place**, and a mistake that shows source code does not reveal them. They are never placed in JavaScript, because client-side code is visible to everyone.
- **Give the script only the rights it needs.** The MySQL user that a public search page uses should be allowed to SELECT, but not to DELETE or DROP tables. If an attacker does find a weakness, the damage is limited.
- **Escape data when you output it.** Data in the database was typed by users, so it might contain HTML or JavaScript. If a "book title" contains `<script>…</script>` and the page echoes it directly, that script runs in every visitor's browser — an attack called cross-site scripting (XSS). `htmlspecialchars()` converts `<` and `>` to `&lt;` and `&gt;`, so the text is shown, not run. Prepared statements protect the **database** on the way in; escaping protects the **browser** on the way out.

:::compare Joining input into SQL vs prepared statements
| | String concatenation | Prepared statement |
|---|---|---|
| How the value reaches the database | As **part of the SQL text** | **Separately** from the SQL, as a parameter |
| SQL injection | **Possible** — input can change the query | **Prevented** — input is always data |
| Quotes in names (e.g. O'Neil) | Break the query | Handled automatically |
| Code | `"… WHERE Login = '" . $login . "'"` | `"… WHERE Login = ?"` + `bind_param("s", $login)` |
| Use for | Fixed queries with **no** user input | **Every** query that contains user input |
:::

:::example Worked example — a search form for the library
**Scenario.** Pupils type part of a book title, e.g. *zhol*, and see the matching books. The search must be safe.

```php | search.php — SELECT with a parameter and LIKE
<?php
$conn = mysqli_connect("localhost", "username", "password", "library");
if (!$conn) die("Connection failed");
$word = trim($_GET["q"] ?? "");
if (strlen($word) < 2) die("Type at least 2 letters.");          // length check

$stmt = mysqli_prepare($conn, "SELECT Title, Author FROM Book WHERE Title LIKE ? ORDER BY Title");
$pattern = "%" . $word . "%";                                     // contains the word
mysqli_stmt_bind_param($stmt, "s", $pattern);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$count = 0;
while ($row = mysqli_fetch_assoc($result)) {
    echo htmlspecialchars($row["Title"]) . " — " . htmlspecialchars($row["Author"]) . "<br>";
    $count++;
}
if ($count === 0) echo "No books match.";
mysqli_close($conn);
?>
```

**Step by step.** (1) The search word arrives in `$_GET["q"]` from the form `<form action="search.php" method="get">`. (2) A **length** check rejects one-letter searches. (3) The `%` signs mean "any characters", so `%zhol%` matches *Abai Zholy*. (4) The pattern is bound as a parameter — even if a pupil types `' OR 1=1 --` it is just searched for as text. (5) `htmlspecialchars()` makes sure a title containing `<` or `>` is displayed as text, not run as HTML. (6) A **counter** shows a message when nothing matches. The script combines everything from the topic: **input**, **validation**, **iteration**, **selection** and **database access**.
:::

# Using a script to provide interactivity
@lo 11.5.3.8@paper

## Events: the page reacts to the user

An **interactive** page responds to what the user does — it shows a hint when a field is wrong, opens a menu when a button is clicked, recalculates a price when a quantity changes — **without loading a new page**. JavaScript does this with **events**. The browser constantly notices things that happen: a click, a key press, a form being submitted, the page finishing loading. For each one it creates an *event*, and if the programmer has attached a function to that event on that element, the browser **calls the function**.

Why does this matter? Interactivity improves a site in several measurable ways. **Feedback is immediate**: a pupil learns that the IIN is one digit short while still typing, not after waiting for a new page. **Fewer requests reach the server**, so it can serve more users and the site feels faster on a slow mobile connection. **Complex information becomes manageable**: tabs, collapsible sections and filters let a long timetable or price list fit on a phone screen. And **accessibility** can be improved, for example with buttons that enlarge text or switch to high contrast. The cost is that the page depends on JavaScript — so important functions (submitting an order, logging in) must still work correctly, and be checked, on the server.

:::definition Event
An **action or occurrence detected by the browser** — e.g. a mouse click, typing in a field, submitting a form, the page loading — to which a script can respond.
:::

:::definition Event handler (listener)
A **function that runs automatically when a particular event happens** on a particular element, attached with `element.addEventListener("click", functionName)` or an attribute such as `onclick="functionName()"`.
:::

:::compare Common events
| Event | Happens when | Typical use |
|---|---|---|
| `click` | An element is clicked | Buttons, menus, showing / hiding parts of the page |
| `input` | The value of a field changes, on every key press | Live calculators, character counters, live validation |
| `change` | A field's value is changed and the field loses focus / a select or checkbox changes | Updating a price when an option is chosen |
| `submit` | A form is sent — can be cancelled with `event.preventDefault()` if invalid | Client-side validation |
| `mouseover` / `mouseout` | The pointer moves over / off an element | Highlighting, tooltips |
| `keydown` | A key is pressed | Keyboard shortcuts, games |
| `load` / `DOMContentLoaded` | The page has finished loading | Starting code that needs the page elements |
:::

## The DOM: the page as objects a script can change

When the browser loads HTML it builds the **Document Object Model (DOM)** — a **tree of objects**, one for every element. The `document` object is the root; `<html>` contains `<head>` and `<body>`; the body contains headings, paragraphs, forms and so on. JavaScript can **find** any element in this tree (usually by its `id`), **read** its properties (the value of an input) and **change** them (its text, its HTML, its style, its classes). The browser immediately redraws the page to show the change.

:::definition Document Object Model (DOM)
A representation of a web page as a **tree of objects** (one per HTML element) that scripts can **read and change** — the text, attributes and styles of elements — so the page updates **without reloading**.
:::

:::svg An event triggers a handler, which changes the DOM, and the browser redraws the page
<svg class="scr" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a DOM tree. document at the top, then html, then head and body; body contains input id qty, button id calc and paragraph id res. Right: a cycle of four steps. 1 the user clicks the button. 2 the browser fires the click event. 3 the handler function reads qty value and calculates. 4 it sets res textContent; the paragraph in the tree is highlighted and the page is redrawn without reloading">
  <style>
    svg.scr .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.scr .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.scr .m{font:700 12px ui-monospace,monospace;fill:var(--foreground)}
    svg.scr .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.scr .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.scr .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.scr .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.scr .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.scr .tr{stroke:var(--border);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="scrA11" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="170" y="22" text-anchor="middle">DOM tree</text>
  <rect class="bx" x="120" y="34" width="100" height="28" rx="5"/><text class="m" x="170" y="53" text-anchor="middle">document</text>
  <rect class="bx" x="120" y="82" width="100" height="28" rx="5"/><text class="m" x="170" y="101" text-anchor="middle">html</text>
  <rect class="bx" x="40" y="130" width="90" height="28" rx="5"/><text class="m" x="85" y="149" text-anchor="middle">head</text>
  <rect class="bx" x="210" y="130" width="90" height="28" rx="5"/><text class="m" x="255" y="149" text-anchor="middle">body</text>
  <rect class="bx" x="20" y="200" width="110" height="40" rx="5"/><text class="m" x="75" y="218" text-anchor="middle">input</text><text class="s" x="75" y="233" text-anchor="middle">id="qty"</text>
  <rect class="wn" x="140" y="200" width="110" height="40" rx="5"/><text class="m" x="195" y="218" text-anchor="middle">button</text><text class="s" x="195" y="233" text-anchor="middle">id="calc"</text>
  <rect class="ok" x="260" y="200" width="110" height="40" rx="5"/><text class="m" x="315" y="218" text-anchor="middle">p</text><text class="s" x="315" y="233" text-anchor="middle">id="res"</text>
  <path class="tr" d="M170,62 L170,82 M170,110 L85,130 M170,110 L255,130 M255,158 L75,200 M255,158 L195,200 M255,158 L315,200"/>
  <rect class="wn" x="430" y="34" width="310" height="44" rx="6"/><text class="t" x="445" y="61">1 User clicks the Calculate button</text>
  <rect class="pb" x="430" y="96" width="310" height="44" rx="6"/><text class="t" x="445" y="123">2 Browser fires the "click" event</text>
  <rect class="pb" x="430" y="158" width="310" height="54" rx="6"/><text class="t" x="445" y="180">3 Handler runs: reads qty.value,</text><text class="t" x="445" y="200">validates and calculates</text>
  <rect class="ok" x="430" y="230" width="310" height="54" rx="6"/><text class="t" x="445" y="252">4 Sets res.textContent = "Total…"</text><text class="t" x="445" y="272">→ page redrawn, no reload</text>
  <line class="ln" x1="585" y1="78" x2="585" y2="92" marker-end="url(#scrA11)"/>
  <line class="ln" x1="585" y1="140" x2="585" y2="154" marker-end="url(#scrA11)"/>
  <line class="ln" x1="585" y1="212" x2="585" y2="226" marker-end="url(#scrA11)"/>
  <path class="ln" d="M250,220 L300,180 L426,180" marker-end="url(#scrA11)"/>
  <path class="ln" d="M430,262 L320,262 L318,244" marker-end="url(#scrA11)"/>
</svg>
:::

:::compare Changing the page with the DOM
| Code | Effect |
|---|---|
| `document.getElementById("out")` | Finds the element with `id="out"` |
| `document.querySelector("input[name=item]:checked")` | Finds the first element matching a CSS selector |
| `el.value` | Reads (or sets) the value typed in an input field — always a **string** |
| `el.textContent = "Hi"` / `el.innerHTML = "<b>Hi</b>"` | Changes the text / HTML inside the element |
| `el.style.color = "red"` / `el.style.display = "none"` | Changes a CSS property (e.g. hides the element) |
| `el.classList.toggle("dark")` | Adds the class if it is missing, removes it if present |
| `el.addEventListener("click", f)` or `onclick="f()"` | Runs function `f` when the event happens |
:::

`textContent` is safer than `innerHTML` for showing text typed by users: `innerHTML` would run any HTML tags inside it, while `textContent` displays them as plain text. Changing classes (`classList`) rather than individual styles keeps the design in the **CSS file** and the behaviour in the **script** — a good separation of concerns.

```html | Live price calculator: the result updates as the user types
<label>Price (₸): <input id="price" type="number" value="800"></label>
<p>Selling price: <b id="out"></b></p>
<p id="warn" style="color: red"></p>

<script>
  const price = document.getElementById("price");
  function update() {
    const p = Number(price.value);
    document.getElementById("warn").textContent =
      (p < 1 || p > 50000) ? "Price must be between 1 and 50 000" : "";
    const selling = p < 1000 ? p * 1.3 : p * 1.15;
    document.getElementById("out").textContent = selling.toFixed(0) + " ₸";
  }
  price.addEventListener("input", update);   // run update() whenever the value changes
  update();
</script>
```

:::example Worked example — a dark-mode and text-size switch
**Scenario.** A school news site wants a button that switches between light and dark mode, and a button that makes the text bigger for pupils with poor eyesight.

```html | Two buttons, two handlers, classList and style
<button id="theme">Dark mode</button>
<button id="big">A+</button>
<p id="text">Our team won the regional robotics competition in Pavlodar!</p>

<style>
  body.dark { background: #222; color: #eee; }
</style>
<script>
  const themeBtn = document.getElementById("theme");
  themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");                         // add or remove the class
    themeBtn.textContent = document.body.classList.contains("dark")
      ? "Light mode" : "Dark mode";                                 // the button label follows the state
  });

  let size = 16;                                                    // current font size in px
  document.getElementById("big").addEventListener("click", function () {
    if (size < 28) size += 4;                                       // limit: 16 → 20 → 24 → 28
    document.getElementById("text").style.fontSize = size + "px";
  });
</script>
```

**What happens.** First click on *Dark mode*: `toggle` **adds** the class `dark` to `<body>`, the CSS rule makes the page dark, and the label changes to *Light mode*. Second click: `toggle` **removes** the class. Each click on *A+* increases `size` by 4 up to 28 px — a **range limit** inside an event handler — and sets the paragraph's `style.fontSize`. Nothing is sent to the server; the changes are instant.
:::

:::html Try it — a shopping-cost calculator (change the values) | 230
<h3>Calculator</h3>
<label><input type="radio" name="item" value="20000" checked> Coat — 20 000 ₸</label><br>
<label><input type="radio" name="item" value="15000"> Boots — 15 000 ₸</label><br>
<label><input type="radio" name="item" value="12000"> Jacket — 12 000 ₸</label><br>
<label>Quantity: <input id="qty" type="number" value="1" min="1" max="10"></label>
<button id="calc">Calculate</button>
<p id="res"></p>
<script>
document.getElementById("calc").addEventListener("click", function () {
  const price = Number(document.querySelector("input[name=item]:checked").value);
  const qty = Number(document.getElementById("qty").value);
  const out = document.getElementById("res");
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    out.style.color = "red";
    out.textContent = "Quantity must be a whole number from 1 to 10";
    return;
  }
  let total = price * qty;
  if (price === 20000) total = total * 0.9;   // 10% discount on coats
  out.style.color = "green";
  out.textContent = "Total: " + total.toLocaleString("ru-RU") + " ₸";
});
</script>
---css---
body { font-family: Arial, sans-serif; padding: 8px; }
button { margin-left: 8px; }
:::

## Interactivity on the client, data on the server

Interactivity and database access are usually combined. JavaScript makes the form pleasant to use — instant checks, live totals — and when the user submits, PHP validates again, saves the data with a prepared statement and returns a page. Modern sites go one step further: JavaScript sends a request to a PHP script **in the background** (with `fetch()`, a technique known as AJAX) and puts the answer into the page without reloading, which is how search suggestions and "Like" buttons work. Whatever the technique, the division of work is the one from lesson 1: **instant reactions in the browser, trusted work on the server**.

:::warning Common mistakes with databases and interactivity
- Parameters of `mysqli_connect()` in the wrong order — it is **server, username, password, database**.
- Not checking whether the connection succeeded before running queries.
- Calling `mysqli_fetch_assoc()` once instead of in a **loop**, so only the first row is shown; putting `<table>` inside the loop.
- Building SQL by joining form input into the string — this allows **SQL injection**; use a prepared statement.
- Writing `getElementByID` (wrong capital letters) or using an id that does not exist in the HTML — the script stops with an error.
- Writing `onclick="update"` without brackets, or `addEventListener("click", update())` **with** brackets (that calls the function immediately instead of on the click).
- Forgetting that `el.value` is a **string** before doing arithmetic.
:::

# Exam practice: databases and interactivity
@lo 11.5.4.5 11.5.3.8@paper

:::example Exam-style questions with model answers
**Q: Complete the code to connect to the database "Library". [3]**
`$conn = mysqli_connect($servername, $username, $password, $db);` (1 function, 1 parameters in the correct order) `if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }` (1).

**Q: The table Book has fields Title and Author. Write PHP to display every title and author, one per line. [4]**
`$result = mysqli_query($conn, "SELECT Title, Author FROM Book");` (1); `while ($row = mysqli_fetch_assoc($result))` (1); `echo $row["Title"] . " " . $row["Author"] . "<br>";` (1); `mysqli_close($conn);` (1).

**Q: Explain how a prepared statement protects a database from SQL injection. [2]**
The SQL is sent with **placeholders** and the user's values are sent **separately** (1); the values are treated only as **data**, so input such as `' OR '1'='1` cannot change the query (1).

**Q: Explain how JavaScript can make a web page interactive. Refer to events and the DOM. [4]**
The browser detects **events** such as click, input or submit (1); an **event handler** function is attached to an element with `addEventListener` / `onclick` (1); the handler reads values / makes decisions and **changes the DOM** — e.g. `textContent`, `style`, `classList` (1); the page updates **immediately without reloading** / without contacting the server (1).

**Q: A page has a button with id "show" and a hidden paragraph with id "hint". Write JavaScript so that clicking the button shows the hint. [3]**
`document.getElementById("show")` (1) `.addEventListener("click", function () {` (1) `document.getElementById("hint").style.display = "block"; });` (1).
:::

:::warning Common mistakes in exam answers
- Describing only "it connects to the database" — name the **function** and the **four parameters**.
- Forgetting the **loop** when the question asks for all records.
- Saying interactivity "uses PHP" — reacting to clicks without reloading is **client-side JavaScript**.
:::

:::steps Check yourself
- List the five steps of working with a database in PHP and the function for each.
- What does `mysqli_fetch_assoc()` return, and why is it used in a `while` loop?
- What is SQL injection? Show how `' OR '1'='1` changes a query.
- Write an INSERT with a prepared statement and explain `"ssi"`.
- Name five events and say when each happens.
- What is the DOM? Give three ways a script can change an element.
- Which event would you use to check a form before it is sent, and how do you stop it being sent?
:::
