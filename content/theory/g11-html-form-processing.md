---
summary: How an HTML form sends data to a script with GET or POST and how that data is read in PHP and JavaScript; one-dimensional arrays, their bounds and the standard algorithms on them; and processing form data with loops — validating every field, building results from arrays — written in a good programming style.
---
# Forms and the request–response cycle
@lo 11.5.4.4

## Why web pages need forms

Almost every useful website has to **collect data from the user**. A pupil logs in to the school e-journal, a patient books an appointment at a clinic, a customer orders a pizza, a teacher types the marks of a test. In each case the person types or chooses something on a web page, presses a button, and a program somewhere does something with what was entered: checks a password, saves a booking, calculates a price, works out an average. The part of a web page that collects this data is an **HTML form**.

In the previous topic (*Scripting language*) you learned how to write scripts in JavaScript and PHP: variables, selection, loops, validation and how a script connects to a database. This topic joins that knowledge to the form itself. You will learn exactly **how the values typed into a form travel to a script**, how the script **reads** them, how **several values** can be sent and stored together in an **array**, and how a script uses **loops** to process all of that data — all written in a **good programming style**. These are the skills tested in Paper 3, where you write code in pseudocode or a programming language.

A form on its own does nothing. HTML only **describes** the boxes, buttons and lists that appear on the screen. The work — checking, calculating, saving — is done by a **script**. A form is therefore always one half of a pair: the form collects, the script processes.

:::definition HTML form
A part of a web page, written with the `<form>` element, that contains **input controls** (text boxes, radio buttons, checkboxes, drop-down lists, buttons) used to **collect data from the user** and **send it to a script** for processing when the form is submitted.
:::

## The request–response cycle

To understand forms you need a clear picture of what happens between the browser and the web server. The web works by a simple conversation called the **request–response cycle**:

1. The user opens a page. The **browser** (the **client**) sends an **HTTP request** to the **web server** asking for that page.
2. The server sends back an **HTTP response** containing the HTML of the page, which the browser displays — including the form.
3. The user fills in the form and clicks the **submit** button. The browser packs the data from the form into a **new HTTP request** and sends it to the address given in the form's `action` attribute.
4. On the server, the web server software passes the request to the **script** named in `action` (for example `register.php`). The script **reads** the data, **validates** it, **processes** it (calculates, saves to a database, looks something up) and **outputs** new HTML.
5. The server sends this HTML back to the browser as the **response**, and the browser displays the result page — "Thank you, your appointment is booked" or a list of error messages.

The important idea is that the **script runs once per request**. A PHP script does not "wait" for the user; it is started when a request arrives, does its work from top to bottom, sends its output and finishes. If the user submits the form again, the script runs again from the beginning with the new data. This is why every PHP form script begins by **reading** the data it has been sent — it has no memory of the previous visit unless the data is stored in a database, a file or a session.

:::svg The request–response cycle when a form is submitted
<svg class="hf" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="On the left, the browser shows a booking form with fields name and date and a Submit button. Arrow 1, labelled HTTP request with name equals value pairs, goes right to the web server. Inside the server the web server software passes the data, arrow 2, to the PHP script booking.php which reads, validates, processes and outputs HTML. The script may read or write the database, arrow 3. Arrow 4, labelled HTTP response with a new HTML page, goes back to the browser, which shows the result page saying booking confirmed.">
  <style>
    svg.hf .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.hf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.hf .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.hf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.hf .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.hf .rq{stroke:var(--primary);stroke-width:2.5;fill:none}
    svg.hf .rs{stroke:var(--success);stroke-width:2.5;fill:none}
    svg.hf .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="hfA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--primary)"/></marker>
    <marker id="hfA2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--success)"/></marker>
    <marker id="hfA3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="110" y="24" text-anchor="middle">Client (browser)</text>
  <rect class="bx" x="20" y="36" width="180" height="130" rx="8"/>
  <text class="t" x="34" y="60">Clinic booking</text>
  <text class="s" x="34" y="84">Name</text><rect class="pb" x="80" y="72" width="104" height="18" rx="3"/>
  <text class="s" x="34" y="110">Date</text><rect class="pb" x="80" y="98" width="104" height="18" rx="3"/>
  <rect class="ok" x="34" y="128" width="72" height="24" rx="4"/><text class="t" x="70" y="145" text-anchor="middle">Submit</text>
  <rect class="ok" x="20" y="200" width="180" height="90" rx="8"/>
  <text class="t" x="34" y="226">Result page</text>
  <text class="s" x="34" y="250">Booking confirmed</text>
  <text class="s" x="34" y="270">for 12 March, 10:00</text>
  <text class="h" x="560" y="24" text-anchor="middle">Web server</text>
  <rect class="bx" x="390" y="36" width="350" height="254" rx="10"/>
  <rect class="pb" x="410" y="70" width="190" height="150" rx="8"/>
  <text class="h" x="505" y="94" text-anchor="middle">booking.php</text>
  <text class="t" x="425" y="120">1 read $_POST</text>
  <text class="t" x="425" y="144">2 validate</text>
  <text class="t" x="425" y="168">3 process</text>
  <text class="t" x="425" y="192">4 echo HTML</text>
  <rect class="wn" x="620" y="110" width="104" height="70" rx="8"/>
  <text class="t" x="672" y="140" text-anchor="middle">Database</text>
  <text class="s" x="672" y="160" text-anchor="middle">bookings</text>
  <line class="ln" x1="602" y1="145" x2="618" y2="145" marker-start="url(#hfA3)" marker-end="url(#hfA3)"/>
  <line class="rq" x1="200" y1="100" x2="406" y2="100" marker-end="url(#hfA1)"/>
  <text class="t" x="300" y="78" text-anchor="middle">1 HTTP request</text>
  <text class="s" x="300" y="94" text-anchor="middle">name=Aruzhan&amp;date=…</text>
  <line class="rs" x1="406" y1="245" x2="204" y2="245" marker-end="url(#hfA2)"/>
  <text class="t" x="300" y="236" text-anchor="middle">2 HTTP response</text>
  <text class="s" x="300" y="266" text-anchor="middle">a new HTML page</text>
  <text class="s" x="565" y="314" text-anchor="middle">The script runs once for every request, from top to bottom.</text>
</svg>
:::

## The form element: action and method

Every form starts with the `<form>` tag. Two of its attributes tell the browser **where** and **how** to send the data.

- `action` gives the **address of the script** that will receive and process the data, for example `action="booking.php"`. If `action` is left out, the data is sent back to the **same page** — a common trick in PHP, where one file both shows the form and processes it.
- `method` says **how** the data is sent in the HTTP request: `get` or `post`. If it is left out, the browser uses **GET**.

Inside the form go the **controls** — `<input>`, `<select>`, `<textarea>` and `<button>` — and ordinary HTML such as `<label>` and `<p>` to make it readable. The form ends with `</form>`. Only controls **inside** the form element are sent when that form is submitted.

```html | booking.html — a clinic booking form sent to a PHP script by POST
<form action="booking.php" method="post">
  <label for="patient">Full name:</label>
  <input type="text" id="patient" name="patient" required>

  <label for="iin">IIN (12 digits):</label>
  <input type="text" id="iin" name="iin" maxlength="12">

  <label for="visit">Date of visit:</label>
  <input type="date" id="visit" name="visit">

  <input type="submit" value="Book">
</form>
```

## GET and POST

The value of `method` changes **where in the HTTP request** the data is placed, and that has practical consequences for security, size and bookmarking.

With **GET**, the browser adds the data to the end of the URL as a **query string**. The query string starts with `?`, each field is written as `name=value`, and fields are separated by `&`. Spaces and special characters are encoded (a space becomes `+` or `%20`). Submitting a search form for clinics in Astana might produce the address `search.php?city=Astana&type=dental`. Because the data is part of the URL, anyone can see it in the address bar, it is saved in the browser **history**, it is written into the server's **log files**, and the page can be **bookmarked** or shared as a link with the same search already filled in. URLs also have a **length limit** (a few thousand characters in practice), so GET is not suitable for long texts or files.

With **POST**, the data is placed in the **body** of the HTTP request, after the headers. It does not appear in the URL, it is not stored in the history as part of the address, and there is no practical size limit, so POST can also upload **files**. A POST result page cannot be bookmarked with its data, and if the user refreshes it the browser warns that the form will be **sent again** — which protects against accidentally placing an order twice.

It is important to understand that POST is **not encryption**. Anyone who can watch the network traffic can still read a POST body unless the site uses **HTTPS**. POST simply keeps the data out of the places where it would be seen casually — the screen, history, logs and shared links. That is why passwords must be sent with POST *and* over HTTPS.

:::compare GET vs POST
| | GET | POST |
|---|---|---|
| Where the data is placed | In the **URL** as a query string: `search.php?city=Astana&type=dental` | In the **body** of the HTTP request — not visible in the URL |
| Visibility | Shown in the address bar, saved in history and server logs | Not shown in the address bar or history |
| Amount of data | Limited by the URL length | No practical limit; files can be uploaded |
| Bookmarking and sharing | The result **can** be bookmarked or sent as a link | The result **cannot** be bookmarked with its data |
| Refreshing the result page | Simply repeats the request — harmless for a search | Browser warns that the data will be **re-sent** |
| Security | Never for passwords or personal data | Better for sensitive data (still needs **HTTPS**) |
| Typical use | Search boxes, filters, page numbers — requests that only **read** data | Logins, registrations, orders, uploads — requests that **change** data |
| Read in PHP with | `$_GET["name"]` | `$_POST["name"]` |
:::

A good rule to remember for the exam: use **GET** when the request only **fetches** information and it would be useful to bookmark it (a search, a timetable for a class); use **POST** when the request **changes something** on the server or contains **private** data (logging in, booking, paying, uploading).

:::definition Query string
The part of a URL after the `?` that carries form data sent by the **GET** method, written as `name=value` pairs separated by `&` — for example `?city=Astana&type=dental`.
:::

:::example Worked example — choosing the method for three school forms
The IT department of a school in Karaganda is building three forms. Choose GET or POST for each and justify the choice.

**Step 1 — A form to search the library catalogue by author.** The search only **reads** data; pupils may want to bookmark "all books by Abai" or send the link to a friend; the data (an author's name) is not private. → **GET**, producing a URL like `catalogue.php?author=Abai`.

**Step 2 — A login form for the e-journal (login and password).** The password must **not** appear in the address bar, the browser history or the server logs, where another person could read it. → **POST** (over HTTPS).

**Step 3 — A form where a teacher uploads a PDF of homework.** Files are far too big for a URL and the upload **changes** data on the server. → **POST** (the form also needs `enctype="multipart/form-data"` for file uploads).

**Step 4 — Write the opening tags.**
`<form action="catalogue.php" method="get">`, `<form action="login.php" method="post">`, `<form action="upload.php" method="post" enctype="multipart/form-data">`.
:::

# Form controls and the name attribute
@lo 11.5.4.4

## Input controls

A form is built from **controls**. Most are written with the `<input>` tag, whose `type` attribute decides what the control looks like and what the user can enter. Choosing the correct type matters: it makes the form easier to use (a phone shows a number keypad for `type="number"`), it gives some **validation in the browser** for free, and it limits the values the script will have to deal with.

:::compare Common form controls
| Control | HTML | What the user does | What is sent |
|---|---|---|---|
| Text box | `<input type="text" name="city">` | Types one line of text | The text typed, e.g. `city=Pavlodar` |
| Number | `<input type="number" name="qty" min="1" max="10">` | Types or steps a number; browser checks `min`/`max` | The number **as text**, e.g. `qty=3` |
| Email | `<input type="email" name="email">` | Types an address; browser checks it contains `@` and a domain | The address typed |
| Password | `<input type="password" name="pass">` | Types text shown as dots | The real password (not hidden in transit — use POST + HTTPS) |
| Radio buttons | `<input type="radio" name="size" value="M">` (several with the **same name**) | Chooses **exactly one** option of a group | Only the `value` of the chosen button, e.g. `size=M` |
| Checkbox | `<input type="checkbox" name="extra" value="cheese">` | Ticks or unticks; several can be ticked | The `value` **only if ticked**; nothing if unticked |
| Drop-down list | `<select name="grade"><option value="11">Grade 11</option>…</select>` | Chooses one option (or several with `multiple`) | The `value` of the chosen option |
| Text area | `<textarea name="comment" rows="4"></textarea>` | Types several lines | All the text, including line breaks |
| Hidden field | `<input type="hidden" name="clinic_id" value="7">` | Nothing — it is not shown | A value the page author put there, e.g. `clinic_id=7` |
| Submit button | `<input type="submit" value="Send">` or `<button>Send</button>` | Clicks to send the form | Usually nothing (unless it has a `name`) |
:::

Several of these controls need a closer look.

**Radio buttons** work as a group. All the buttons of one question share the **same `name`**, and only one of them can be selected at a time — selecting one automatically deselects the others, like the station buttons on an old radio. Each button has a different `value`, and the script receives just the value of the selected one. If the buttons had different names, the browser would treat them as separate questions and the user could select all of them.

**Checkboxes** are independent yes/no choices. A very important detail is that an **unticked checkbox sends nothing at all** — not "off", not an empty string; the field is simply missing from the request. The script must therefore **check whether the field exists** before using it. When a group of checkboxes is meant to collect several choices (for example the school clubs a pupil wants to join), they are given a name ending in `[]` so that PHP collects the ticked values into an **array** — this is studied in lesson 2.

**Drop-down lists** (`<select>`) save space when there are many options, such as the 17 regions of Kazakhstan. The text between `<option>` and `</option>` is what the user sees; the `value` attribute is what is sent. If an option has no `value`, its text is sent.

**Hidden fields** carry information the user does not need to see but the script needs — for example which clinic or which product the form is about. They are *not* secret: anyone can read them in the page source and change them before submitting, so the script must validate them like any other input.

**Labels** (`<label for="id">`) connect a caption to a control. Clicking the label puts the cursor in the box, and screen readers read the label aloud, which makes the form **accessible**. Labels are part of writing a form in a good style.

## The name attribute is the key

When a form is submitted, the browser looks at each control inside it and sends one **name = value pair** for each control that is "successful" (has a name, is not disabled, and — for radio buttons and checkboxes — is selected). The **name** is the label for the data; the **value** is what the user typed or chose.

This means the `name` attribute is the **key** that links the form to the script. If the form contains `<input type="number" name="quantity">`, the PHP script reads the value with `$_POST["quantity"]` and the JavaScript on the page can read it as `form.elements["quantity"].value`. Three rules follow from this:

1. A control **without a `name` is not sent at all**. This is the most common reason why "the script gets nothing" — the `id` attribute is used by CSS, labels and JavaScript, but it is **not** what is sent.
2. The name in the script must match the name in the form **exactly**, including capital letters: `Quantity` and `quantity` are different keys.
3. Names should be **meaningful** (`quantity`, `patient_name`), not `field1`, `x` — the same good-style rule that applies to variable identifiers.

:::definition name attribute
The attribute of a form control that gives the **key** under which its value is sent to the script; the script uses this key to read the value (e.g. `name="quantity"` → `$_POST["quantity"]`). A control without a name is **not sent**.
:::

:::svg How each control becomes a name = value pair and arrives in $_POST
<svg class="hf" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left column: four controls of a pizza order form. A text box with name customer containing Dana. A number box with name qty containing 2. A radio group with name size where M is chosen. A checkbox named extra with value cheese that is ticked, and a second checkbox with value olives that is not ticked. Middle: the request body customer equals Dana and qty equals 2 and size equals M and extra equals cheese. The olives checkbox sends nothing. Right: the PHP array $_POST with keys customer, qty, size and extra and their values, all stored as strings.">
  <style>
    svg.hf .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.hf .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.hf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.hf .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.hf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.hf .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.hf .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="hfA4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="130" y="24" text-anchor="middle">Form controls</text>
  <rect class="bx" x="20" y="36" width="220" height="56" rx="6"/>
  <text class="s" x="32" y="56">text, name="customer"</text><rect class="pb" x="32" y="64" width="120" height="20" rx="3"/><text class="t" x="38" y="79">Dana</text>
  <rect class="bx" x="20" y="100" width="220" height="56" rx="6"/>
  <text class="s" x="32" y="120">number, name="qty"</text><rect class="pb" x="32" y="128" width="60" height="20" rx="3"/><text class="t" x="38" y="143">2</text>
  <rect class="bx" x="20" y="164" width="220" height="56" rx="6"/>
  <text class="s" x="32" y="184">radio group, name="size"</text>
  <text class="t" x="32" y="208">○ S   ● M   ○ L</text>
  <rect class="bx" x="20" y="228" width="220" height="80" rx="6"/>
  <text class="s" x="32" y="248">checkbox, name="extra"</text>
  <text class="t" x="32" y="272">☑ value="cheese"</text>
  <text class="t" x="32" y="296">☐ value="olives"</text>
  <line class="ln" x1="240" y1="64" x2="300" y2="150" marker-end="url(#hfA4)"/>
  <line class="ln" x1="240" y1="128" x2="300" y2="160" marker-end="url(#hfA4)"/>
  <line class="ln" x1="240" y1="196" x2="300" y2="170" marker-end="url(#hfA4)"/>
  <line class="ln" x1="160" y1="268" x2="300" y2="180" marker-end="url(#hfA4)"/>
  <rect class="bad" x="300" y="270" width="170" height="40" rx="6"/>
  <text class="t" x="385" y="295" text-anchor="middle">olives: nothing sent</text>
  <text class="h" x="385" y="112" text-anchor="middle">Request body</text>
  <rect class="pb" x="304" y="124" width="162" height="76" rx="6"/>
  <text class="m" x="314" y="146">customer=Dana</text>
  <text class="m" x="314" y="162">&amp;qty=2</text>
  <text class="m" x="314" y="178">&amp;size=M</text>
  <text class="m" x="314" y="194">&amp;extra=cheese</text>
  <line class="ln" x1="466" y1="162" x2="516" y2="162" marker-end="url(#hfA4)"/>
  <text class="h" x="630" y="24" text-anchor="middle">$_POST in PHP</text>
  <rect class="ok" x="520" y="36" width="220" height="200" rx="8"/>
  <text class="s" x="534" y="60">key</text><text class="s" x="650" y="60">value</text>
  <text class="m" x="534" y="90">"customer"</text><text class="m" x="650" y="90">"Dana"</text>
  <text class="m" x="534" y="126">"qty"</text><text class="m" x="650" y="126">"2"</text>
  <text class="m" x="534" y="162">"size"</text><text class="m" x="650" y="162">"M"</text>
  <text class="m" x="534" y="198">"extra"</text><text class="m" x="650" y="198">"cheese"</text>
  <text class="s" x="630" y="262" text-anchor="middle">Every value arrives as a string,</text>
  <text class="s" x="630" y="280" text-anchor="middle">even the number 2.</text>
</svg>
:::

## Everything arrives as text

A second key fact: **all form data arrives at the script as strings**. Even if the control is `type="number"` and the user typed `2`, the script receives the two-character string `"2"`. In PHP, arithmetic usually converts it automatically, but comparisons and joining can behave unexpectedly, and in JavaScript `"2" + "3"` gives `"23"` (the string trap from the previous topic). A well-written script therefore **converts** numeric fields explicitly — `(int)$_POST["qty"]` or `(float)$_POST["price"]` in PHP, `Number(...)` or `parseInt(...)` in JavaScript — after checking that they really are numbers.

## Browser validation attributes

HTML5 lets the form itself perform simple checks before anything is sent: `required` (presence check), `min` and `max` on numbers and dates (range check), `maxlength` (length check), `type="email"` (format check) and `pattern` (a regular expression format check, e.g. `pattern="[0-9]{12}"` for a 12-digit IIN). These give the user **instant feedback** and reduce the number of wasted requests. But, as you saw in the previous topic, they can be switched off by editing the page or bypassed by sending a request directly, so the **script on the server must always check the data again**.

:::example Worked example — building a pizza order form for a café in Shymkent
A café wants an online order form: customer name, phone, size (S, M or L — exactly one), extra toppings (cheese, mushrooms, olives — any number), number of pizzas (1–10), and a comment. The data is sent to `order.php`.

**Step 1 — Choose the method.** An order **changes** data and includes a phone number → `method="post"`.

**Step 2 — Choose a control for each item.** Name: `text` with `required`. Phone: `tel` with a `pattern`. Size: three `radio` buttons with **one shared name** `size`. Toppings: three `checkbox`es named `extras[]` (an array, lesson 2). Number of pizzas: `number` with `min`/`max`. Comment: `textarea`.

**Step 3 — Give every control a meaningful name** that the script will use as its key.

```html
<form action="order.php" method="post">
  <label>Name: <input type="text" name="customer" required></label>
  <label>Phone: <input type="tel" name="phone" pattern="\+7[0-9]{10}"></label>
  <p>Size:
    <label><input type="radio" name="size" value="S"> Small</label>
    <label><input type="radio" name="size" value="M" checked> Medium</label>
    <label><input type="radio" name="size" value="L"> Large</label>
  </p>
  <p>Extras:
    <label><input type="checkbox" name="extras[]" value="cheese"> Cheese</label>
    <label><input type="checkbox" name="extras[]" value="mushrooms"> Mushrooms</label>
    <label><input type="checkbox" name="extras[]" value="olives"> Olives</label>
  </p>
  <label>Pizzas: <input type="number" name="qty" min="1" max="10" value="1"></label>
  <label>Comment: <textarea name="comment" rows="3"></textarea></label>
  <input type="hidden" name="branch" value="shymkent-1">
  <button type="submit">Order</button>
</form>
```

**Step 4 — Predict what is sent** if Dana orders 2 medium pizzas with cheese: `customer=Dana`, `phone=+77011234567`, `size=M`, `extras[]=cheese`, `qty=2`, `comment=` (empty but present), `branch=shymkent-1`. Mushrooms and olives send **nothing** because they are unticked.
:::

# Reading form data on the server and in the browser
@lo 11.5.4.4, 11.5.4.9

## The superglobal arrays $_GET and $_POST

When a request reaches a PHP script, PHP automatically places the form data into special arrays called **superglobals**, which can be used anywhere in the script:

- `$_GET` holds the data sent in the **query string** (GET method);
- `$_POST` holds the data sent in the **body** of a POST request;
- `$_REQUEST` holds both (it is better style to use the specific one, so it is clear how the data must arrive).

Each of these is an **associative array**: the **keys** are the `name` attributes of the controls and the **values** are what the user entered. So the value of `<input name="qty">` is read with `$_POST["qty"]`. You will study arrays properly in lesson 2; for now it is enough to know that the square brackets with a name inside pick out one value.

:::definition Superglobal ($_GET / $_POST)
A built-in PHP **associative array**, available everywhere in a script, that holds the data received from a form: `$_GET` for data sent in the URL by the GET method and `$_POST` for data sent in the request body by the POST method. Each **key** is the `name` of a form control.
:::

## Checking that data exists: isset and empty

A script must never assume that a field is there. The page may have been opened directly without submitting the form, an unticked checkbox sends nothing, and a user can remove fields from the request. Reading a key that does not exist gives a warning ("Undefined array key") and a `null` value, which can make calculations silently wrong. Two functions help.

- `isset($_POST["qty"])` is **true if the key exists and is not null**. It answers "was this field sent at all?". It is used to find out whether the form has been submitted, and to check checkboxes and radio groups.
- `empty($_POST["customer"])` is **true if the key is missing or its value is "empty"**: `""`, `"0"`, `0`, `null`, `false` or an empty array. It answers "did the user leave this blank?" and is the usual **presence check** for a text box.

Be careful: `empty("0")` is **true**, so `empty()` must not be used as the presence check for a field where `0` is a valid answer (for example "number of absences"). Use `isset($x) && trim($x) !== ""` instead. In modern PHP the **null coalescing operator** `??` gives a default value when a key is missing: `$extras = $_POST["extras"] ?? [];` means "use the sent extras, or an empty array if none were ticked".

:::compare isset() vs empty() on form data
| Situation | `isset($_POST["f"])` | `empty($_POST["f"])` |
|---|---|---|
| Field not sent (unticked checkbox, page opened directly) | false | true |
| Text box left blank, `""` sent | **true** | true |
| User typed `0` | true | **true** (a trap) |
| User typed `Dana` | true | false |
| Best used for | "Was the form / this field submitted?" | "Did the user leave this text box blank?" |
:::

## Detecting that the form was submitted

A popular pattern is a **self-processing page**: one PHP file both displays the form and handles it. The form's `action` points to the same file (or is left out). At the top, the script checks whether a request with data has arrived. If it has, it processes the data; if not, it just shows the empty form. Two common tests are `if ($_SERVER["REQUEST_METHOD"] === "POST")` and `if (isset($_POST["submit"]))` (which requires the submit button to have `name="submit"`).

## Escaping output with htmlspecialchars

Whatever the user typed will often be **printed back** on the result page: "Thank you, Dana". If the script simply echoes the input, a malicious user can type HTML or JavaScript instead of a name, for example `<script>…</script>`, and the browser of anyone who sees that page will **run it**. This attack is called **cross-site scripting (XSS)**. It can steal login cookies, change the page or redirect users to a fake site — very serious on a site like an e-journal where many people view what others have written.

The defence is to **escape** output: convert the characters that have a special meaning in HTML into **HTML entities**, so the browser shows them as ordinary text instead of treating them as tags. PHP's `htmlspecialchars()` does this: `<` becomes `&lt;`, `>` becomes `&gt;`, `&` becomes `&amp;`, `"` becomes `&quot;` (and `'` with the right flag). The rule is simple: **validate input, escape output** — every time user data is placed in HTML, pass it through `htmlspecialchars()`. Numbers that have already been converted with `(int)` or `(float)` are safe, because they can only contain digits.

Note that `htmlspecialchars()` protects **HTML output**. It is not protection for **SQL** — for databases you use prepared statements, as in the previous topic.

:::definition Escaping output
Converting characters that have a special meaning in HTML (`<`, `>`, `&`, `"`, `'`) into HTML entities (`&lt;`, `&gt;`, …) before printing user data, so that the data is **displayed as text and not run as code**. In PHP: `htmlspecialchars()`. It prevents **cross-site scripting (XSS)**.
:::

## A complete PHP form handler

The order of steps in a form handler is always the same, and following it is part of good programming style: **check** that data was sent → **read** each value by its name → **convert** numbers → **validate** → **process** → **output** (escaped).

:::mermaid The standard order of steps in a server-side form handler
flowchart TB
  A(["Request arrives at order.php"]) --> B{"Form submitted? isset or REQUEST_METHOD"}
  B -- no --> F["Show the empty form"]
  B -- yes --> C["Read each value by its name and convert numbers"]
  C --> D{"All values valid?"}
  D -- no --> E["Output error messages and the form again"]
  D -- yes --> G["Process: calculate or save to the database"]
  G --> H["Output the result with htmlspecialchars"]
:::

```php | order.php — reading, validating, processing and escaping a pizza order
<?php
const PRICES = ["S" => 2200, "M" => 3100, "L" => 3900];   // tenge per pizza
const MAX_PIZZAS = 10;

if ($_SERVER["REQUEST_METHOD"] !== "POST") {     // opened without submitting
    die("Please use the order form.");
}

// read and convert
$customer = trim($_POST["customer"] ?? "");
$size     = $_POST["size"] ?? "";
$qty      = (int)($_POST["qty"] ?? 0);

// validate
if ($customer === "") {
    die("Please enter your name.");                         // presence check
}
if (!array_key_exists($size, PRICES)) {
    die("Please choose a size.");                           // lookup check
}
if ($qty < 1 || $qty > MAX_PIZZAS) {
    die("You can order 1 to " . MAX_PIZZAS . " pizzas."); // range check
}

// process
$total = PRICES[$size] * $qty;

// output, escaping the text the user typed
echo "<h2>Thank you, " . htmlspecialchars($customer) . "!</h2>";
echo "<p>$qty × size $size = $total tenge</p>";
?>
```

Using `die()` for every error is simple, but it stops at the **first** problem, so a user with three mistakes has to submit three times. In lesson 3 this handler is improved with a **loop** and an **errors array** so that all problems are reported at once and the form is shown again with the user's values kept.

## Reading form values in JavaScript

A form can also be processed **in the browser**, by JavaScript, without sending anything to the server. This is used for instant calculations (a price that updates as you type), for client-side validation before submitting, and for small tools such as a BMI calculator that do not need a database.

JavaScript reads a control's value through the **DOM**: `document.getElementById("qty").value`, or through the form's `elements` collection using the **name**: `form.elements["qty"].value`. Just like in PHP, the value is **always a string**, so it is converted with `Number()`. Radio groups are read with `form.elements["size"].value` (the value of the checked button) and checkboxes with `.checked` (true or false). To stop the browser from sending the form — for example when there are errors, or when everything is done in the page — the submit event handler calls `event.preventDefault()`.

```javascript | Calculating the order price in the browser as the user changes the form
const form = document.getElementById("order");
const PRICES = { S: 2200, M: 3100, L: 3900 };

form.addEventListener("input", function () {
  const size = form.elements["size"].value;          // value of the checked radio
  const qty = Number(form.elements["qty"].value);    // text -> number
  if (size in PRICES && qty >= 1 && qty <= 10) {
    document.getElementById("price").textContent = PRICES[size] * qty + " tenge";
  } else {
    document.getElementById("price").textContent = "—";
  }
});
```

## Server-side or client-side processing?

Both kinds of processing are used together on a real site, because each does a different job well.

:::compare Server-side vs client-side processing of a form
| | Server-side (PHP) | Client-side (JavaScript) |
|---|---|---|
| Where the code runs | On the web server, after the form is submitted | In the user's browser, before or instead of submitting |
| Speed of feedback | Needs a full request and a new page | **Instant**, no page reload |
| Can it be bypassed? | **No** — the user cannot change server code | **Yes** — JavaScript can be switched off or edited |
| Access to the database and secret data | **Yes** (prices, passwords, stock) | No — everything in the page is visible to the user |
| Can the user see the code? | No, only the output | Yes, in the page source |
| Load | Uses server resources for every request | Uses the user's device |
| Typical job | **Trusted** validation, saving, calculations that must be correct | Convenience checks, live totals, showing/hiding fields |
:::

So the professional rule is: **check in the browser for convenience, check on the server for security**. A price calculated in JavaScript can be shown to the user, but the server must calculate it again from its own price list, because a user could edit the page and "buy" a pizza for 1 tenge.

:::warning Common mistakes with form data
- Forgetting the `name` attribute (or using only `id`) — the field is **not sent**, and `$_POST["qty"]` is undefined.
- Reading `$_POST` when the form uses `method="get"` (or no method, which means GET), or the other way round.
- Spelling the key differently in the script: `$_POST["Qty"]` for `name="qty"`.
- Giving radio buttons of one question **different names**, so several can be selected.
- Assuming an unticked checkbox sends "off" or `""` — it sends **nothing**; use `isset()` or `??`.
- Using `empty()` on a field where `0` is a valid answer.
- Doing arithmetic or comparisons in JavaScript without converting the string with `Number()`.
- Echoing user text without `htmlspecialchars()` — this allows XSS.
- Saying POST is "encrypted" — it only hides data from the URL; encryption needs HTTPS.
:::

# Exam practice: HTML forms and sending data
@lo 11.5.4.4

:::example Exam-style questions with model answers
**Q: A form must send the fields login and password to the script check.php. Write the opening form tag and state why you chose the method. [3]**
`<form action="check.php" method="post">` — `action="check.php"` (1), `method="post"` (1). POST, because the password must not appear in the URL / browser history / server logs (1).

**Q: A search form uses method="get", action="find.php" and has fields named city and type. The user enters Almaty and dental. Write the URL that is requested. [2]**
`find.php?city=Almaty&type=dental` — `?` after the script name with the first pair (1); second pair joined with `&` (1).

**Q: Explain the purpose of the name attribute of a form control. [2]**
It gives the **key** under which the control's value is sent to the script (1); the script reads the value using this key, e.g. `$_POST["city"]` — a control without a name is not sent (1).

**Q: Give three differences between the GET and POST methods. [3]**
GET puts data in the URL / query string, POST in the request body (1); GET data is visible in the address bar and history, POST is not (1); GET has a size limit, POST does not / can upload files (1); GET results can be bookmarked, POST results cannot (1). Any three.

**Q: A form sends the fields price and quantity to cost.php by POST. Write PHP code that checks both fields were sent, calculates the total and outputs "Total: … tenge". [4]**
```php
if (isset($_POST["price"], $_POST["quantity"])) {   // (1) check fields sent
    $price = (float)$_POST["price"];                 // (1) read both by name
    $quantity = (int)$_POST["quantity"];
    $total = $price * $quantity;                     // (1) calculate
    echo "Total: " . $total . " tenge";              // (1) output
}
```

**Q: Explain why a script should use htmlspecialchars() before outputting a name typed into a form. [2]**
The user could type HTML/JavaScript code instead of a name, which the browser would run (cross-site scripting) (1); `htmlspecialchars()` converts `<`, `>`, `&`, `"` into entities so the input is displayed as text, not executed (1).
:::

:::warning Common mistakes in exam answers
- Writing `method="POST"` but reading `$_GET` in the code — examiners check that the method and the superglobal match.
- In GET URLs, using `,` or a second `?` between pairs — it is `?` once, then `&`.
- "POST is secure / encrypted" earns no mark; say **not visible in the URL / history**, and mention HTTPS for encryption.
- Answering "the name is the name of the field" — say it is the **key used by the script to read the value**.
- Forgetting to convert form values to numbers before calculating, or forgetting the output step.
:::

:::steps Check yourself
- Describe the five steps of the request–response cycle when a form is submitted.
- What do the `action` and `method` attributes do, and what happens if each is left out?
- Give four differences between GET and POST and one typical use of each.
- Which control would you use for: exactly one of three sizes; any number of toppings; a 300-word comment; an ID the user should not see?
- What is sent by an unticked checkbox? How does a script check for it?
- What is the difference between `isset()` and `empty()`? Why is `empty("0")` a trap?
- Why must the server validate data even if the HTML form has `required` and `max`?
- What does `htmlspecialchars("<b>Hi</b>")` output, and what attack does it prevent?
:::

# Arrays and their terminology
@lo 11.5.2.1

## Why programs need arrays

Imagine a teacher in Aktobe who wants a script that stores the marks of a class of 30 pupils and works out the average, the highest mark and how many pupils passed. With ordinary variables she would need `$mark1`, `$mark2`, … `$mark30` — thirty separate identifiers. Adding them would need one enormous expression, finding the highest would need dozens of IF statements, and if a new pupil joined the class the program would have to be rewritten. This approach does not scale.

An **array** solves the problem. It stores all thirty marks under **one identifier**, `Marks`, and each mark is reached by its **position number**, the **index**: `Marks[1]`, `Marks[2]`, … `Marks[30]`. Because the index can be a **variable**, a single loop can visit every mark: "for i from 1 to 30, add `Marks[i]` to the total". The same five lines of code work for 30 pupils or 3000. That is the real power of arrays: **combined with iteration they let one short algorithm process any amount of data**.

Arrays appear everywhere in web programming. The list of products in an online shop, the rows returned from a database query, the subjects a pupil ticks on a form, and even `$_POST` itself are arrays. This lesson covers the **one-dimensional array** — a single list of values with one index.

:::definition Array
A **data structure** that holds a **fixed number of elements of the same data type** under a **single identifier**; each element is accessed using its **index** (its position in the array).
:::

:::definition One-dimensional array
An array whose elements are arranged in a **single row (list)**, so that each element is identified by **one index**, e.g. `Marks[5]`.
:::

## The technical terms

The exam specification requires you to use the technical terms associated with arrays correctly, including the **upper and lower bounds**. Each term has a precise meaning.

- **Identifier** — the name of the whole array, e.g. `Marks`. It follows the same rules as a variable name and should be meaningful.
- **Element** — one item of data stored in the array, e.g. the mark 17. An array of 30 marks has 30 elements.
- **Index** (also called a **subscript**) — the whole number that gives an element's **position**. It is written in square brackets after the identifier: `Marks[4]` means "the element at index 4". The index must be an integer and must lie between the bounds.
- **Lower bound** — the **smallest valid index** of the array.
- **Upper bound** — the **largest valid index** of the array.
- **Length** (or **size**) — the **number of elements**. It is calculated as *upper bound − lower bound + 1*.
- **Data type** — in pseudocode and in strongly typed languages, all elements have the same type, e.g. `INTEGER` or `STRING`.

:::definition Lower bound and upper bound
The **lower bound** is the **smallest index** that can be used for an array; the **upper bound** is the **largest index**. For `ARRAY[1:30]` they are 1 and 30; for a JavaScript or PHP array of 30 elements they are 0 and 29.
:::

:::definition Index
The **integer position** of an element within an array, written in square brackets after the array identifier (e.g. `Marks[3]`). It must lie between the lower bound and the upper bound inclusive.
:::

## Zero-based and one-based indexing

Languages disagree about where counting starts. In **pseudocode** (the Cambridge style used in Paper 3) you choose the bounds yourself when you declare the array, and the usual choice is to start at **1**: `ARRAY[1:30]` has a lower bound of 1 and an upper bound of 30. In **JavaScript, PHP, Python, C and Java** the first element always has index **0**, so the lower bound is always 0 and the upper bound is **length − 1**. A JavaScript array of 30 marks has indexes 0 to 29; `marks[30]` does not exist.

Why do programming languages start at 0? Internally the index is an **offset**: the address of `marks[i]` is "start address + i × size of one element". The first element is at offset 0 from the start. Pseudocode, written for humans, is free to start at 1 because "pupil number 1" is more natural.

You must therefore always **read the declaration** to know the bounds. In an exam, if the question declares `Cities : ARRAY[0:3] OF STRING`, then the lower bound is 0 even though it is pseudocode. Many lost marks come from assuming the wrong starting index.

:::svg Anatomy of a one-dimensional array: the same five marks with 1-based and 0-based indexes
<svg class="hf" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An array named Marks drawn as five boxes in a row containing 17, 12, 20, 9 and 15. Above the boxes, the pseudocode indexes 1 to 5; the first is labelled lower bound 1 and the last upper bound 5. Below the boxes, the JavaScript and PHP indexes 0 to 4; lower bound 0 and upper bound 4. An arrow points to the box containing 20 and says element: the value 20; Marks[3] in pseudocode, marks[2] in JavaScript. The length is 5 in both cases, calculated as upper bound minus lower bound plus one.">
  <style>
    svg.hf .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.hf .v{font:700 18px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.hf .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.hf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.hf .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.hf .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.hf .lp{stroke:var(--primary);stroke-width:2;fill:none}
    svg.hf .lg{stroke:var(--success);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="hfA5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="60" y="140" text-anchor="middle">Marks</text>
  <text class="s" x="60" y="158" text-anchor="middle">identifier</text>
  <rect class="bx" x="140" y="115" width="90" height="56"/><text class="v" x="185" y="150" text-anchor="middle">17</text>
  <rect class="bx" x="230" y="115" width="90" height="56"/><text class="v" x="275" y="150" text-anchor="middle">12</text>
  <rect class="wn" x="320" y="115" width="90" height="56"/><text class="v" x="365" y="150" text-anchor="middle">20</text>
  <rect class="bx" x="410" y="115" width="90" height="56"/><text class="v" x="455" y="150" text-anchor="middle">9</text>
  <rect class="bx" x="500" y="115" width="90" height="56"/><text class="v" x="545" y="150" text-anchor="middle">15</text>
  <text class="t" x="140" y="28">Pseudocode: DECLARE Marks : ARRAY[1:5] OF INTEGER</text>
  <rect class="pb" x="160" y="70" width="50" height="26" rx="4"/><text class="t" x="185" y="88" text-anchor="middle">1</text>
  <text class="t" x="275" y="88" text-anchor="middle">2</text><text class="t" x="365" y="88" text-anchor="middle">3</text><text class="t" x="455" y="88" text-anchor="middle">4</text>
  <rect class="pb" x="520" y="70" width="50" height="26" rx="4"/><text class="t" x="545" y="88" text-anchor="middle">5</text>
  <text class="s" x="185" y="58" text-anchor="middle">lower bound</text><text class="s" x="545" y="58" text-anchor="middle">upper bound</text>
  <rect class="ok" x="160" y="190" width="50" height="26" rx="4"/><text class="t" x="185" y="208" text-anchor="middle">0</text>
  <text class="t" x="275" y="208" text-anchor="middle">1</text><text class="t" x="365" y="208" text-anchor="middle">2</text><text class="t" x="455" y="208" text-anchor="middle">3</text>
  <rect class="ok" x="520" y="190" width="50" height="26" rx="4"/><text class="t" x="545" y="208" text-anchor="middle">4</text>
  <text class="s" x="185" y="234" text-anchor="middle">lower bound</text><text class="s" x="545" y="234" text-anchor="middle">upper bound</text>
  <text class="t" x="140" y="268">JavaScript / PHP: let marks = [17, 12, 20, 9, 15];</text>
  <line class="ln" x1="640" y1="110" x2="414" y2="136" marker-end="url(#hfA5)"/>
  <text class="h" x="610" y="70">Element</text>
  <text class="s" x="610" y="88">the value 20</text>
  <text class="s" x="610" y="104">Marks[3] / marks[2]</text>
  <text class="t" x="610" y="160">Length = 5</text>
  <text class="s" x="610" y="180">upper − lower + 1</text>
  <text class="s" x="610" y="198">5 − 1 + 1 = 5</text>
  <text class="s" x="610" y="216">4 − 0 + 1 = 5</text>
</svg>
:::

## Declaring and initialising an array

**Declaring** an array means telling the program its identifier, its bounds (and so its size) and the data type of its elements. **Initialising** means giving the elements their first values. The three languages you use do this differently.

In **pseudocode**, an array is declared with its bounds and type, then elements are assigned one at a time or in a loop:

```pseudocode | Pseudocode — declaring, initialising and using a 1D array
DECLARE Marks : ARRAY[1:30] OF INTEGER
DECLARE Cities : ARRAY[1:4] OF STRING

Cities[1] ← "Astana"
Cities[2] ← "Almaty"
Cities[3] ← "Shymkent"
Cities[4] ← "Aktobe"

// initialise every mark to 0 with a count-controlled loop
FOR Index ← 1 TO 30
    Marks[Index] ← 0
NEXT Index

// input 30 marks
FOR Index ← 1 TO 30
    OUTPUT "Enter mark for pupil ", Index
    INPUT Marks[Index]
NEXT Index
OUTPUT Cities[3]          // Shymkent
```

In **JavaScript** and **PHP** an array is usually created and initialised in one step with a list of values in square brackets. These arrays are **dynamic**: they can grow when new elements are added, so you do not declare a fixed size, and they do not force a single data type (though good style keeps one type per array).

```javascript | JavaScript — creating, reading, changing and growing an array
let cities = ["Astana", "Almaty", "Shymkent", "Aktobe"];
console.log(cities[0]);                  // "Astana"  (lower bound 0)
console.log(cities[cities.length - 1]);  // "Aktobe"  (upper bound = length - 1 = 3)
cities[1] = "Almaty city";               // change an element
cities.push("Turkistan");                // add to the end: length is now 5
let marks = new Array(30).fill(0);       // 30 elements, all 0
```

```php | PHP — the same operations
<?php
$cities = ["Astana", "Almaty", "Shymkent", "Aktobe"];
echo $cities[0];                         // Astana
echo $cities[count($cities) - 1];        // Aktobe
$cities[1] = "Almaty city";              // change an element
$cities[] = "Turkistan";                 // add to the end
$marks = array_fill(0, 30, 0);           // 30 zeros, indexes 0 to 29
?>
```

:::compare Arrays in pseudocode, JavaScript and PHP
| Operation | Pseudocode | JavaScript | PHP |
|---|---|---|---|
| Declare / create | `DECLARE Marks : ARRAY[1:5] OF INTEGER` | `let marks = [];` or `[7, 9, 4]` | `$marks = [];` or `[7, 9, 4]` |
| Lower bound | Chosen in the declaration (usually **1**) | Always **0** | **0** for an indexed array |
| Upper bound | Chosen in the declaration | `marks.length - 1` | `count($marks) - 1` |
| Length | upper − lower + 1 | `marks.length` | `count($marks)` |
| Read an element | `Marks[2]` | `marks[2]` | `$marks[2]` |
| Assign an element | `Marks[2] ← 18` | `marks[2] = 18;` | `$marks[2] = 18;` |
| Add to the end | Not possible — fixed size | `marks.push(18);` | `$marks[] = 18;` |
| Size | **Static** (fixed when declared) | Dynamic | Dynamic |
| Element types | All the same (declared) | Any (same type is good style) | Any (same type is good style) |
:::

## Static and dynamic arrays

A **static** array has a size fixed when it is declared: the memory for all its elements is reserved at once, and the bounds cannot change. Pseudocode arrays are static. A **dynamic** array can change its length while the program runs — elements can be appended or removed. JavaScript and PHP arrays are dynamic. Dynamic arrays are convenient for form data, because a script cannot know in advance how many checkboxes a user will tick. Static arrays are more predictable and are what the exam usually expects in pseudocode: if a question says "an array of 30 marks", declare `ARRAY[1:30]`.

# Traversing arrays: standard algorithms
@lo 11.5.2.1, 11.5.4.4

## Traversing an array with a loop

To **traverse** an array means to **visit every element in turn**, usually from the lower bound to the upper bound. Because the number of elements is known, the natural loop is a **count-controlled** loop: `FOR` in pseudocode, `for` in JavaScript and PHP, with the loop counter used as the **index**. PHP and JavaScript also have loops designed specially for arrays — `foreach` in PHP and `for … of` in JavaScript — which hand you each **element** directly, without an index.

```pseudocode | Pseudocode — output every element
FOR i ← 1 TO 5
    OUTPUT Marks[i]
NEXT i
```

```php | PHP — the same traversal with an index and with foreach
<?php
$marks = [17, 12, 20, 9, 15];
for ($i = 0; $i < count($marks); $i++) {    // i = 0 … 4
    echo "Pupil " . ($i + 1) . ": " . $marks[$i] . "<br>";
}
foreach ($marks as $mark) {                 // each element in turn, no index
    echo $mark . " ";
}
foreach ($marks as $i => $mark) {           // index and element together
    echo "[$i] = $mark<br>";
}
?>
```

```javascript | JavaScript — for with an index and for…of
const marks = [17, 12, 20, 9, 15];
for (let i = 0; i < marks.length; i++) {
  console.log("Pupil " + (i + 1) + ": " + marks[i]);
}
for (const mark of marks) {
  console.log(mark);
}
```

Use a `for` loop with an index when you **need the position** (to report "pupil 3 has the highest mark", to change elements, or to compare neighbouring elements). Use `foreach` / `for…of` when you only need the **values**; it is shorter and cannot go out of bounds.

:::compare for with an index vs foreach / for…of
| | `for` with an index | `foreach` (PHP) / `for…of` (JS) |
|---|---|---|
| What you get each time | The index `i`, then the element `a[i]` | The element itself (PHP can also give the key) |
| Can report the position | **Yes** | Only with `foreach ($a as $i => $v)` |
| Can change elements in the array | Yes: `a[i] = …` | Not directly (the loop variable is a copy) |
| Risk of out-of-bounds errors | Yes, if the condition is wrong | **No** — it stops by itself |
| Works on associative arrays | No (keys are not numbers) | **Yes** |
| Pseudocode equivalent | `FOR i ← 1 TO n … NEXT i` | Usually also written with `FOR` and an index |
:::

## The standard algorithms

A handful of algorithms on arrays appear again and again in exam questions. Each has a fixed pattern: **initialise** a variable before the loop, **update** it inside the loop, **use** it after the loop. Learn the patterns and you can answer almost any "write an algorithm" question about arrays.

**1. Total (running total).** Set `Total ← 0` before the loop; add each element inside the loop. A total must start at 0 — if it is not initialised, it starts with an unknown value (in pseudocode) or `null` / `undefined` (in PHP / JavaScript, where `undefined + 5` gives `NaN`).

**2. Average (mean).** Calculate the total, then divide by the **number of elements** *after* the loop. Dividing inside the loop is a classic error. Check that the length is not 0 before dividing.

**3. Maximum and minimum.** Set `Max ← Marks[1]` — the **first element**, not 0 — then compare every other element with it and replace `Max` when a larger one is found. Starting from 0 fails when every value is negative (temperatures in Astana in January!), and starting a minimum from 0 fails whenever all values are positive. To find **where** the maximum is, keep its index too: `MaxPos ← i` at the same moment.

**4. Counting.** Set `Count ← 0`; add 1 inside an IF when the element meets the condition ("marks of 50 or more", "temperatures below zero").

**5. Linear search.** Look at each element in turn and compare it with the **target**, until it is **found** or the **end** of the array is reached. Because the loop may stop early, a condition-controlled loop (`WHILE`) is the natural choice. If the item is never found, the algorithm must say so.

:::definition Linear search
A search algorithm that **checks each element of an array in turn**, starting from the first, until the **target is found** or **every element has been checked**; it works on unsorted data.
:::

```pseudocode | Pseudocode — total, average, maximum with its position, count
DECLARE Marks : ARRAY[1:30] OF INTEGER
DECLARE Total, Max, MaxPos, CountPass, i : INTEGER
DECLARE Average : REAL

Total ← 0
CountPass ← 0
Max ← Marks[1]
MaxPos ← 1
FOR i ← 1 TO 30
    Total ← Total + Marks[i]
    IF Marks[i] > Max THEN
        Max ← Marks[i]
        MaxPos ← i
    ENDIF
    IF Marks[i] >= 50 THEN
        CountPass ← CountPass + 1
    ENDIF
NEXT i
Average ← Total / 30
OUTPUT "Average: ", Average
OUTPUT "Highest: ", Max, " by pupil ", MaxPos
OUTPUT "Passed: ", CountPass
```

```pseudocode | Pseudocode — linear search for a pupil's name
DECLARE Names : ARRAY[1:30] OF STRING
DECLARE Target : STRING
DECLARE i : INTEGER
DECLARE Found : BOOLEAN

INPUT Target
Found ← FALSE
i ← 1
WHILE Found = FALSE AND i <= 30
    IF Names[i] = Target THEN
        Found ← TRUE
    ELSE
        i ← i + 1
    ENDIF
ENDWHILE
IF Found = TRUE THEN
    OUTPUT Target, " is at position ", i
ELSE
    OUTPUT Target, " is not in the list"
ENDIF
```

:::mermaid Linear search: stop when the target is found or the upper bound is passed
flowchart TB
  S(["Start: Found = FALSE, i = lower bound"]) --> C{"Found = FALSE AND i ≤ upper bound?"}
  C -- no --> R{"Found?"}
  C -- yes --> T{"Names[i] = Target?"}
  T -- yes --> F["Found = TRUE"]
  T -- no --> N["i = i + 1"]
  F --> C
  N --> C
  R -- yes --> Y(["Output position i"])
  R -- no --> X(["Output not found"])
:::

## Trace tables for array algorithms

A **trace table** records the value of every variable after each step of an algorithm. It is the standard way to **test** an algorithm on paper (a dry run) and is very common in Paper 3. For an array algorithm, make one column for the loop counter, one for the current element and one for each variable that changes; write a new row each time round the loop.

:::example Worked example — tracing a maximum-temperature algorithm for a week in Astana
The array `Temps[1:7]` holds the midday temperatures for one week in January: −12, −18, −7, −15, −7, −21, −9. The algorithm finds the warmest day and its position.

```pseudocode
Max ← Temps[1]
Day ← 1
FOR i ← 2 TO 7
    IF Temps[i] > Max THEN
        Max ← Temps[i]
        Day ← i
    ENDIF
NEXT i
OUTPUT "Warmest: ", Max, " on day ", Day
```

**Step 1 — Initialise.** `Max = −12` (the first element), `Day = 1`. The loop starts at 2 because element 1 is already in `Max`.

**Step 2 — Trace each iteration.**

| i | Temps[i] | Temps[i] > Max? | Max | Day |
|---|---|---|---|---|
| — | — | — | −12 | 1 |
| 2 | −18 | no | −12 | 1 |
| 3 | −7 | **yes** | −7 | 3 |
| 4 | −15 | no | −7 | 3 |
| 5 | −7 | no (equal, not greater) | −7 | 3 |
| 6 | −21 | no | −7 | 3 |
| 7 | −9 | no | −7 | 3 |

**Step 3 — Output.** `Warmest: −7 on day 3`.

**Step 4 — What the trace shows.** (a) Because `>` is used, the **first** of two equal maxima (days 3 and 5) is reported; `>=` would report the last. (b) If `Max` had been initialised to **0**, no temperature would ever be greater, and the output would wrongly be "0 on day 1" — the reason to start from the first element.
:::

## Off-by-one and out-of-bounds errors

The most frequent array bugs are about the bounds.

An **out-of-bounds** (index out of range) error happens when a program uses an index **smaller than the lower bound or larger than the upper bound** — for example `marks[5]` when the upper bound is 4. Languages react differently: in pseudocode and in languages such as Python and Java it is a **run-time error** that stops the program; PHP prints a warning ("Undefined array key 5") and uses `null`; JavaScript silently returns `undefined`, which then turns totals into `NaN`. All of these give wrong results.

An **off-by-one error** is a loop that runs **one time too many or too few**. The typical causes are mixing 0-based and 1-based thinking: writing `for ($i = 0; $i <= count($marks); $i++)` (`<=` instead of `<` — one step too far, reading past the upper bound), starting at 1 in PHP (missing the first element), or writing `FOR i ← 0 TO 30` for an `ARRAY[1:30]`. The cure is to **write the bounds down** before writing the loop: "indexes 0 to count − 1" or "indexes 1 to 30", and to test the first and last iteration in a trace table.

:::definition Out-of-bounds error
A run-time error caused by trying to access an array element with an index **below the lower bound or above the upper bound**, i.e. an element that does not exist.
:::

:::warning Common mistakes with arrays
- Assuming every array starts at 1 (or at 0) — **read the declaration**; JavaScript and PHP always start at 0.
- Saying the upper bound of a 5-element JavaScript array is 5 — it is **4** (length − 1).
- Confusing **index** and **element**: in `Marks[3] = 20`, 3 is the index and 20 is the element (value).
- Using `<=` with `length` / `count()` in a 0-based loop — reads past the upper bound.
- Starting a maximum or minimum at 0 instead of the first element.
- Calculating the average **inside** the loop, or dividing by the wrong number.
- Forgetting to set `Total ← 0` / `Count ← 0` before the loop, or resetting it **inside** the loop.
- In a linear search, outputting "not found" inside the loop for every element that does not match.
:::

# Arrays from forms and associative arrays
@lo 11.5.2.1, 11.5.4.4

## Sending an array from a form

Lesson 1 showed that each control sends one name = value pair. Sometimes one question has **several answers**: the subjects a pupil wants to take as electives, the symptoms a patient ticks on a clinic questionnaire, the marks of five tests typed into five boxes. PHP has a simple convention for this: if several controls share a name that **ends in square brackets**, such as `name="subjects[]"`, PHP collects all their values into **one indexed array** `$_POST["subjects"]` (without the brackets in the key).

For **checkboxes**, only the **ticked** boxes are sent, so the array contains exactly the chosen values, in the order they appear in the form, with indexes from 0. If no box is ticked, the key `subjects` does **not exist** at all — so the script must use `isset()` or `$_POST["subjects"] ?? []` before looping. For several **text or number boxes** with the same `name="mark[]"`, every box is sent, including empty ones (as `""`). A `<select name="days[]" multiple>` list sends every selected option into an array in the same way.

:::svg Checkboxes named subjects[] arrive in PHP as one indexed array of the ticked values
<svg class="hf" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: an elective form with five checkboxes all named subjects with square brackets. Physics is ticked, Chemistry is not, Biology is ticked, History is not, Informatics is ticked. Middle arrow: the request sends subjects[]=Physics, subjects[]=Biology and subjects[]=Informatics. Right: in PHP, $_POST['subjects'] is an array with index 0 Physics, index 1 Biology, index 2 Informatics, count 3, lower bound 0, upper bound 2. Below: if nothing is ticked, the key subjects does not exist, so use ?? [].">
  <style>
    svg.hf .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.hf .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.hf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.hf .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.hf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.hf .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.hf .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="hfA6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="120" y="24" text-anchor="middle">Form: name="subjects[]"</text>
  <rect class="bx" x="20" y="36" width="200" height="190" rx="8"/>
  <text class="t" x="36" y="66">☑ Physics</text>
  <text class="s" x="36" y="100">☐ Chemistry</text>
  <text class="t" x="36" y="134">☑ Biology</text>
  <text class="s" x="36" y="168">☐ History</text>
  <text class="t" x="36" y="202">☑ Informatics</text>
  <line class="ln" x1="222" y1="130" x2="262" y2="130" marker-end="url(#hfA6)"/>
  <text class="h" x="370" y="24" text-anchor="middle">Sent (ticked only)</text>
  <rect class="pb" x="266" y="70" width="208" height="110" rx="6"/>
  <text class="m" x="278" y="100">subjects[]=Physics</text>
  <text class="m" x="278" y="130">subjects[]=Biology</text>
  <text class="m" x="278" y="160">subjects[]=Informatics</text>
  <line class="ln" x1="474" y1="130" x2="512" y2="130" marker-end="url(#hfA6)"/>
  <text class="h" x="630" y="24" text-anchor="middle">$_POST["subjects"]</text>
  <rect class="ok" x="516" y="40" width="224" height="186" rx="8"/>
  <text class="s" x="532" y="64">index</text><text class="s" x="600" y="64">element</text>
  <text class="m" x="540" y="96">0</text><text class="m" x="600" y="96">"Physics"</text>
  <text class="m" x="540" y="128">1</text><text class="m" x="600" y="128">"Biology"</text>
  <text class="m" x="540" y="160">2</text><text class="m" x="600" y="160">"Informatics"</text>
  <text class="s" x="532" y="192">count = 3</text>
  <text class="s" x="532" y="212">bounds 0 to 2</text>
  <rect class="bad" x="140" y="246" width="480" height="40" rx="6"/>
  <text class="t" x="380" y="271" text-anchor="middle">Nothing ticked → key missing → use $_POST["subjects"] ?? []</text>
</svg>
:::

```php | electives.php — processing an array of checkbox values with a loop
<?php
const MAX_ELECTIVES = 3;

$subjects = $_POST["subjects"] ?? [];           // empty array if none ticked
$count = count($subjects);

if ($count === 0) {
    echo "<p>Please choose at least one elective.</p>";
} elseif ($count > MAX_ELECTIVES) {
    echo "<p>You may choose at most " . MAX_ELECTIVES . " electives.</p>";
} else {
    echo "<p>You chose $count electives:</p><ul>";
    foreach ($subjects as $subject) {
        echo "<li>" . htmlspecialchars($subject) . "</li>";
    }
    echo "</ul>";
    if (in_array("Informatics", $subjects)) {   // built-in linear search
        echo "<p>Informatics lab: room 214.</p>";
    }
}
?>
```

Reading form data in JavaScript can also produce an array. `document.querySelectorAll('input[name="subjects[]"]:checked')` returns all ticked boxes; a `for…of` loop then pushes each `.value` into an array.

## Associative arrays

So far, every index has been a whole number. An **associative array** uses **keys** that are usually **strings** instead of numbers: each element is a **key → value** pair. You have already met one: `$_POST` is an associative array whose keys are the field names. Associative arrays are ideal for **look-up tables** — a price list, a timetable, the number of beds on each ward of a hospital — where it is more natural to ask "what is the price of a *coat*?" than "what is element 2?".

In PHP an associative array is written with `=>` between key and value. In JavaScript the same idea is an **object** (or a `Map`). In pseudocode, exam questions normally use two **parallel arrays** instead: `Items[1:3]` and `Prices[1:3]`, where `Prices[i]` is the price of `Items[i]`.

```php | Associative array as a price list in a Kostanay clothes shop
<?php
$prices = ["coat" => 28000, "boots" => 19500, "scarf" => 4500];

echo $prices["boots"];                    // 19500
$prices["hat"] = 6000;                    // add a new key → value pair

foreach ($prices as $item => $price) {    // traverse keys and values
    echo "$item: $price tenge<br>";
}

$item = $_POST["item"] ?? "";
if (array_key_exists($item, $prices)) {   // look-up validation
    echo "Price: " . $prices[$item];
} else {
    echo "Unknown item.";
}
?>
```

:::compare Indexed vs associative arrays
| | Indexed array | Associative array |
|---|---|---|
| Index / key | Integer position, from the lower bound (0 in PHP/JS) | A **key**, usually a string: `"coat"` |
| Example | `$marks = [17, 12, 20];` | `$prices = ["coat" => 28000, "boots" => 19500];` |
| Read an element | `$marks[1]` → 12 | `$prices["boots"]` → 19500 |
| Bounds | Has lower and upper bounds | No numeric bounds — check the key with `array_key_exists()` / `isset()` |
| Traverse | `for` with an index, or `foreach` | `foreach ($prices as $key => $value)` |
| Order matters? | Yes — positions are meaningful | Keys identify items; order is the order of insertion |
| Form data example | Checkboxes `subjects[]` | `$_POST` itself (keys = field names) |
| Pseudocode | `ARRAY[1:n]` | Two parallel arrays, e.g. `Items[]` and `Prices[]` |
:::

:::definition Associative array
An array in which each element is stored as a **key → value pair** and is accessed by its **key** (usually a string) instead of a numeric index, e.g. `$prices["coat"]`. `$_POST` and `$_GET` are associative arrays.
:::

:::example Worked example — a test-results form for a school in Pavlodar
A teacher's page has five number boxes, all `name="mark[]"`, for the marks (out of 20) of five sections of a test. The script must output the total, the percentage and the weakest section.

**Step 1 — Read the array and convert.** The marks arrive as strings: `["16", "12", "19", "8", "15"]`. Convert each with `(int)` while traversing.

**Step 2 — Plan the bounds.** PHP array → indexes 0 to `count($marks) − 1` = 0 to 4. Section numbers for people are index + 1.

**Step 3 — Write the code.**

```php
<?php
const MAX_PER_SECTION = 20;
$marks = $_POST["mark"] ?? [];
$total = 0;
$minMark = (int)$marks[0];
$minSection = 1;
for ($i = 0; $i < count($marks); $i++) {
    $mark = (int)$marks[$i];
    $total = $total + $mark;
    if ($mark < $minMark) {
        $minMark = $mark;
        $minSection = $i + 1;
    }
}
$percent = $total / (count($marks) * MAX_PER_SECTION) * 100;
echo "Total: $total<br>Percentage: " . round($percent) . "%<br>";
echo "Weakest section: $minSection ($minMark marks)";
?>
```

**Step 4 — Trace it.**

| i | $mark | $total | $minMark | $minSection |
|---|---|---|---|---|
| start | — | 0 | 16 | 1 |
| 0 | 16 | 16 | 16 | 1 |
| 1 | 12 | 28 | 12 | 2 |
| 2 | 19 | 47 | 12 | 2 |
| 3 | 8 | 55 | 8 | 4 |
| 4 | 15 | 70 | 8 | 4 |

**Step 5 — Output.** Total: 70, Percentage: 70 / 100 × 100 = **70%**, Weakest section: **4 (8 marks)**.
:::

# Exam practice: one-dimensional arrays
@lo 11.5.2.1, 11.5.4.4

:::example Exam-style questions with model answers
**Q: Define the terms array, index and upper bound. [3]**
Array: a data structure holding a number of elements of the same data type under one identifier (1). Index: the integer position of an element in the array (1). Upper bound: the largest valid index of the array (1).

**Q: Write a pseudocode declaration for an array to hold the names of the 25 pupils of class 11A, and state its lower and upper bounds. [3]**
`DECLARE Pupils : ARRAY[1:25] OF STRING` — identifier and `ARRAY[1:25]` (1), `OF STRING` (1). Lower bound 1, upper bound 25 (1). (Bounds `[0:24]` also accepted if stated consistently.)

**Q: In JavaScript, `const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];`. State the length, the upper bound and the value of `days[2]`. [3]**
Length **6** (1); upper bound **5** (1); `days[2]` = **"Wed"** (1).

**Q: The array Rain[1:12] holds the monthly rainfall (mm) in Almaty. Write pseudocode that outputs the total rainfall and the number of the month with the least rain. [5]**
```pseudocode
Total ← 0                                 // (1) total initialised
Min ← Rain[1]                             // (1) min starts at first element
MinMonth ← 1
FOR Month ← 1 TO 12                       // (1) loop over all 12 elements
    Total ← Total + Rain[Month]
    IF Rain[Month] < Min THEN             // (1) compare and keep position
        Min ← Rain[Month]
        MinMonth ← Month
    ENDIF
NEXT Month
OUTPUT Total, MinMonth                    // (1) output after the loop
```

**Q: The PHP loop `for ($i = 0; $i <= count($marks); $i++) { $total += $marks[$i]; }` gives a warning. Explain the error and correct it. [2]**
With `<=` the last iteration uses `$i = count($marks)`, an index above the upper bound / out of range (1). Correct: `$i < count($marks)` (1).

**Q: A form contains checkboxes named `symptoms[]`. Explain how the ticked values arrive in a PHP script and why the script should use `$_POST["symptoms"] ?? []`. [3]**
All ticked boxes are sent with the same name and PHP collects them into one indexed array `$_POST["symptoms"]` (1), starting at index 0 (1). Unticked boxes send nothing, so if none is ticked the key does not exist; `?? []` gives an empty array instead of an undefined-key error (1).
:::

:::warning Common mistakes in exam answers
- Stating an upper bound equal to the length for a 0-based array (length 6 → upper bound **5**).
- Declaring an array in pseudocode without bounds or data type, e.g. `DECLARE Pupils : ARRAY` — both are needed.
- Initialising `Max` / `Min` to 0, or outputting inside the loop instead of once after it.
- Writing `Rain[Month] < Min` but then storing `Month` in `Min` — keep the **value** and the **position** in different variables.
- Describing "an array stores many values" without saying they are under **one identifier** and accessed by **index**.
:::

:::steps Check yourself
- Define array, element, index, lower bound, upper bound and length; how is length calculated from the bounds?
- Declare an array of 30 real numbers in pseudocode and the equivalent in JavaScript and PHP.
- What are the bounds of `[4, 8, 15]` in PHP? Of `ARRAY[1:3]` in pseudocode?
- Write the patterns for total, average, maximum with position, counting and linear search.
- Why must a maximum start with the first element rather than 0?
- What is an off-by-one error? Give an example with `<=`.
- How does a form send several values in one array? What happens when no checkbox is ticked?
- What is the difference between an indexed and an associative array? Give a form-related example of each.
:::

# Iterative processing of form data
@lo 11.5.4.4

## Iteration meets form data

In the previous topic you learned the three loops of a scripting language — `for`, `while` and `do … while` — and used them for counting and simple totals. In lesson 2 of this topic you used loops to traverse arrays. This lesson puts the two together for the job real web scripts do all day: **processing everything that arrives from a form**. A registration form may have ten fields; an order form may have twenty products, each with a quantity; a teacher's form may have a mark for every pupil. Writing separate code for every field is long, repetitive and easy to get wrong. An **iterative algorithm** handles them all with one loop.

:::definition Iterative algorithm
An algorithm that uses **iteration** — a loop — to **repeat a set of instructions**, either a fixed number of times or until a condition is met, e.g. once for every element of an array of form data.
:::

Two kinds of loop are used, and choosing the right one is part of writing a good algorithm.

:::definition Count-controlled loop
A loop that repeats a **fixed number of times, known before the loop starts** — e.g. `FOR i ← 1 TO 30` or `foreach` over an array of known size.
:::

:::definition Condition-controlled loop
A loop that repeats **until (or while) a condition is true**, so the number of repetitions is **not known in advance** — e.g. `WHILE … ENDWHILE` (condition tested first, pre-condition) or `REPEAT … UNTIL` (condition tested at the end, post-condition, runs at least once).
:::

:::compare Count-controlled vs condition-controlled loops when processing forms
| | Count-controlled | Condition-controlled |
|---|---|---|
| Pseudocode | `FOR i ← 1 TO n … NEXT i` | `WHILE cond … ENDWHILE` / `REPEAT … UNTIL cond` |
| PHP / JavaScript | `for (…; i < n; …)`, `foreach`, `for…of` | `while (cond)`, `do { … } while (cond)` |
| Number of repetitions | Known before the loop: the number of fields / elements | Unknown: depends on the data or the user |
| Typical form job | Validate **every** field, total **every** order line, output **every** row | Ask again **until the input is valid**; search **until found**; read rows **while** there are more |
| Risk | Off-by-one errors with the bounds | **Infinite loop** if the condition never changes |
:::

## Validating every field with a loop

In lesson 1 the order handler stopped at the first error with `die()`. That is bad for the user: someone who made three mistakes has to submit three times and discover them one by one. A better design is to **check every field**, **collect every problem** in an **errors array**, and only process the data if the array is empty at the end.

The checks themselves can also be driven by a loop. Most fields of a form need the same **presence check**, so a script can keep an array of the **required field names** and loop through it. Then adding a new required field means adding one word to the array, not writing another IF.

```php | register.php — validating all fields of a sports-club registration in a loop
<?php
const REQUIRED = ["first_name", "last_name", "grade", "email"];
const MIN_GRADE = 7;
const MAX_GRADE = 12;

$errors = [];                                  // empty: no problems yet

// 1. presence check on every required field (count-controlled loop)
foreach (REQUIRED as $field) {
    if (trim($_POST[$field] ?? "") === "") {
        $errors[] = "Please fill in " . str_replace("_", " ", $field) . ".";
    }
}

// 2. field-specific checks
$grade = (int)($_POST["grade"] ?? 0);
if ($grade < MIN_GRADE || $grade > MAX_GRADE) {
    $errors[] = "Grade must be from " . MIN_GRADE . " to " . MAX_GRADE . ".";
}
if (!filter_var($_POST["email"] ?? "", FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

// 3. decide
if (count($errors) > 0) {
    echo "<ul class='errors'>";
    foreach ($errors as $message) {            // output every error
        echo "<li>" . htmlspecialchars($message) . "</li>";
    }
    echo "</ul>";
} else {
    echo "<p>Registration saved. Welcome to the club!</p>";
    // … INSERT into the database with a prepared statement …
}
?>
```

Look at the structure. The errors array is **initialised empty before** the checks, every check **appends** to it with `$errors[] = …`, and **after** all the checks one `if` decides between "show errors" and "process". This is the same *initialise – update – use* pattern as a running total, with an array instead of a number. `count($errors) > 0` (or `!empty($errors)`) is the test.

:::definition Errors array
An array that is **initialised empty** before validation and to which a **message is added for every failed check**; after all checks, the data is processed only if the array is **still empty**, otherwise **all** the messages are shown at once.
:::

## Sticky forms

When there are errors, the user should see the **form again**, with the messages next to it and with everything they already typed **still filled in**. A form that keeps the user's values after a failed submission is called a **sticky form**. It is built by printing the submitted value back into each control's `value` attribute — escaped with `htmlspecialchars()`, because it is user data being placed into HTML. For radio buttons and checkboxes the script prints `checked` for the options that were chosen; for a `<select>` it prints `selected`.

```php | A sticky form in a self-processing page
<?php
$name = $_POST["first_name"] ?? "";
$grade = $_POST["grade"] ?? "";
?>
<form method="post">
  <label>First name:
    <input type="text" name="first_name"
           value="<?php echo htmlspecialchars($name); ?>">
  </label>
  <label>Grade:
    <select name="grade">
      <?php for ($g = MIN_GRADE; $g <= MAX_GRADE; $g++): ?>
        <option value="<?php echo $g; ?>"
          <?php if ((string)$g === $grade) echo "selected"; ?>>
          Grade <?php echo $g; ?>
        </option>
      <?php endfor; ?>
    </select>
  </label>
  <button type="submit">Register</button>
</form>
```

Notice that a **loop also generates the form itself**: the six `<option>` elements for grades 7 to 12 are produced by a `for` loop instead of being typed by hand. If the club later accepts grade 6, one constant changes.

:::svg Validating every field with a loop, collecting errors and re-displaying a sticky form
<svg class="hf" viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The form is submitted. Step 1: errors is set to an empty array. Step 2: a loop goes through each field: first name, last name, grade, email. For each field a check is made; if it fails a message is appended to errors. A loop-back arrow returns to the next field. Step 3 after the loop: is count of errors greater than zero? If yes, the page shows all the error messages and the sticky form again with the user's values kept, and the user corrects and resubmits, which loops back to the start. If no, the data is processed and saved and a confirmation page is shown.">
  <style>
    svg.hf .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.hf .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.hf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.hf .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.hf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.hf .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.hf .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.hf .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.hf .lw{stroke:var(--warning);stroke-width:2;fill:none;stroke-dasharray:6 4}
    svg.hf .ld{stroke:var(--danger);stroke-width:2;fill:none;stroke-dasharray:6 4}
  </style>
  <defs>
    <marker id="hfA7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
    <marker id="hfA8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--warning)"/></marker>
    <marker id="hfA9" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--danger)"/></marker>
  </defs>
  <rect class="bx" x="20" y="40" width="130" height="56" rx="8"/>
  <text class="t" x="85" y="64" text-anchor="middle">Form</text><text class="t" x="85" y="82" text-anchor="middle">submitted</text>
  <line class="ln" x1="150" y1="68" x2="186" y2="68" marker-end="url(#hfA7)"/>
  <rect class="pb" x="190" y="40" width="130" height="56" rx="8"/>
  <text class="h" x="255" y="64" text-anchor="middle">1 initialise</text><text class="m" x="255" y="84" text-anchor="middle">$errors = []</text>
  <line class="ln" x1="320" y1="68" x2="356" y2="68" marker-end="url(#hfA7)"/>
  <rect class="wn" x="360" y="20" width="230" height="150" rx="10"/>
  <text class="h" x="475" y="44" text-anchor="middle">2 loop: foreach field</text>
  <text class="t" x="378" y="70">first_name · last_name</text>
  <text class="t" x="378" y="90">grade · email</text>
  <text class="t" x="378" y="116">check fails?</text>
  <text class="m" x="378" y="136">$errors[] = message</text>
  <text class="s" x="378" y="158">then the next field</text>
  <path class="lw" d="M590,130 C640,130 640,40 594,40" marker-end="url(#hfA8)"/>
  <text class="s" x="652" y="90">repeat</text>
  <line class="ln" x1="475" y1="170" x2="475" y2="196" marker-end="url(#hfA7)"/>
  <rect class="bx" x="370" y="200" width="210" height="50" rx="8"/>
  <text class="h" x="475" y="222" text-anchor="middle">3 after the loop</text><text class="m" x="475" y="242" text-anchor="middle">count($errors) &gt; 0 ?</text>
  <line class="ln" x1="370" y1="225" x2="296" y2="225" marker-end="url(#hfA7)"/><text class="t" x="334" y="216" text-anchor="middle">yes</text>
  <rect class="bad" x="20" y="196" width="272" height="68" rx="8"/>
  <text class="t" x="156" y="220" text-anchor="middle">Show every error message and</text>
  <text class="t" x="156" y="240" text-anchor="middle">the sticky form (values kept)</text>
  <path class="ld" d="M85,196 L85,100" marker-end="url(#hfA9)"/>
  <text class="s" x="96" y="150">user corrects</text><text class="s" x="96" y="166">and resubmits</text>
  <line class="ln" x1="580" y1="225" x2="616" y2="225" marker-end="url(#hfA7)"/><text class="t" x="598" y="216" text-anchor="middle">no</text>
  <rect class="ok" x="620" y="196" width="120" height="68" rx="8"/>
  <text class="t" x="680" y="220" text-anchor="middle">Process and</text><text class="t" x="680" y="240" text-anchor="middle">save data</text>
  <text class="s" x="380" y="300" text-anchor="middle">All problems are found in one pass, so the user corrects them all at once.</text>
  <text class="s" x="380" y="320" text-anchor="middle">Adding a required field means adding one name to the list, not a new IF.</text>
</svg>
:::

## Totals of an order form

Order forms are a perfect example of a count-controlled loop over form data. A canteen form lists several dishes, each with a quantity box. If the quantity boxes are named with the **product code as the key** — `name="qty[plov]"`, `name="qty[manti]"` — PHP builds an **associative array** `$_POST["qty"]` such as `["plov" => "2", "manti" => "0", "samsa" => "3"]`. The script loops through it, looks each code up in its **own** price list (never trusting a price sent from the browser), skips quantities of 0, validates the range, and builds a running total.

:::example Worked example — the order total for a school canteen in Atyrau
The canteen's prices are stored on the server: plov 1200 ₸, manti 1500 ₸, samsa 400 ₸, tea 150 ₸. Pupil Timur submits: plov 1, manti 0, samsa 3, tea 2. Orders of 5000 ₸ or more get 10% off.

**Step 1 — Data structures.** Server price list: `$prices = ["plov" => 1200, "manti" => 1500, "samsa" => 400, "tea" => 150]`. Form data: `$_POST["qty"] = ["plov" => "1", "manti" => "0", "samsa" => "3", "tea" => "2"]`.

**Step 2 — Algorithm.** `total ← 0`; for each product code and quantity: convert to integer; if the code is not in the price list or the quantity is outside 0–10, add an error; if the quantity is 0, skip; otherwise `lineCost ← price × quantity`, add it to the total and output a table row. After the loop apply the discount.

**Step 3 — Code.**

```php
<?php
const DISCOUNT_LIMIT = 5000;    // tenge
const DISCOUNT_RATE = 0.10;
const MAX_QTY = 10;
$prices = ["plov" => 1200, "manti" => 1500, "samsa" => 400, "tea" => 150];

$total = 0;
$errors = [];
echo "<table><tr><th>Item</th><th>Qty</th><th>Cost</th></tr>";
foreach ($_POST["qty"] ?? [] as $code => $qtyText) {
    $qty = (int)$qtyText;
    if (!array_key_exists($code, $prices) || $qty < 0 || $qty > MAX_QTY) {
        $errors[] = "Invalid line: " . htmlspecialchars($code);
        continue;                           // skip this line
    }
    if ($qty === 0) {
        continue;                           // nothing ordered
    }
    $lineCost = $prices[$code] * $qty;
    $total += $lineCost;
    echo "<tr><td>$code</td><td>$qty</td><td>$lineCost</td></tr>";
}
echo "</table>";
if ($total >= DISCOUNT_LIMIT) {
    $total = $total * (1 - DISCOUNT_RATE);
}
echo "<p>To pay: $total tenge</p>";
?>
```

**Step 4 — Trace.**

| $code | $qty | $lineCost | $total |
|---|---|---|---|
| start | — | — | 0 |
| plov | 1 | 1200 | 1200 |
| manti | 0 | (skipped) | 1200 |
| samsa | 3 | 1200 | 2400 |
| tea | 2 | 300 | 2700 |

**Step 5 — After the loop.** 2700 < 5000, so no discount. Output: three table rows and **To pay: 2700 tenge**. If Timur had ordered 4 plov instead, the total would be 6300 → discount → **5670 tenge**.
:::

# Building output and repeating until valid
@lo 11.5.4.4, 11.5.4.9

## Generating HTML from an array

A script's output is HTML, and a lot of HTML is **repetitive**: the rows of a results table, the items of a list, the options of a drop-down. Instead of writing them by hand, a script **generates** them with a loop over an array. This is how every real site builds pages: the e-journal does not contain a hand-written table for every class — a script loops over the pupils returned by a database query and writes one `<tr>` per pupil.

The pattern is always the same: output the **opening** tag(s) **before** the loop (`<table>` and the header row, or `<ul>`), output **one row or item per iteration** inside the loop, and output the **closing** tag(s) **after** the loop. Putting `<table>` inside the loop is a common mistake — it creates a separate table for every row.

```php | Building a results table from two parallel arrays
<?php
const PASS_MARK = 50;
$names  = ["Aigerim", "Bauyrzhan", "Dias", "Madina"];
$scores = [78, 45, 91, 50];

echo "<table>";
echo "<tr><th>No.</th><th>Pupil</th><th>Score</th><th>Result</th></tr>";
for ($i = 0; $i < count($names); $i++) {
    $result = ($scores[$i] >= PASS_MARK) ? "Pass" : "Retake";
    echo "<tr>";
    echo "<td>" . ($i + 1) . "</td>";
    echo "<td>" . htmlspecialchars($names[$i]) . "</td>";
    echo "<td>" . $scores[$i] . "</td>";
    echo "<td>" . $result . "</td>";
    echo "</tr>";
}
echo "</table>";
?>
```

The same thing can be done in the browser with JavaScript, by building elements and adding them to the page through the DOM. Using `textContent` (not `innerHTML`) for user data is the JavaScript equivalent of `htmlspecialchars()` — the text is shown, never run.

```javascript | Building a list of chosen subjects in the browser
const chosen = ["Physics", "Informatics", "Biology"];
const list = document.getElementById("chosen-list");
list.textContent = "";                       // clear the old list
for (const subject of chosen) {
  const item = document.createElement("li");
  item.textContent = subject;                // safe: shown as text
  list.appendChild(item);
}
```

:::svg A loop turns an array into the rows of an HTML table
<svg class="hf" viewBox="0 0 760 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: two parallel arrays, names with Aigerim, Bauyrzhan, Dias and Madina at indexes 0 to 3, and scores with 78, 45, 91 and 50. Middle: the loop. Before the loop, echo table and the header row. Inside the loop, for i from 0 to 3, echo one tr row with names[i] and scores[i]. After the loop, echo the closing table tag. Right: the resulting table on the page with four rows: Aigerim 78 Pass, Bauyrzhan 45 Retake highlighted, Dias 91 Pass, Madina 50 Pass.">
  <style>
    svg.hf .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.hf .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.hf .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.hf .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.hf .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.hf .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.hf .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.hf .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.hf .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="hfA10" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <text class="h" x="110" y="24" text-anchor="middle">Arrays</text>
  <text class="s" x="20" y="48">i</text><text class="s" x="44" y="48">$names[i]</text><text class="s" x="140" y="48">$scores[i]</text>
  <rect class="bx" x="20" y="56" width="200" height="34"/><text class="m" x="24" y="78">0</text><text class="t" x="44" y="78">Aigerim</text><text class="m" x="160" y="78">78</text>
  <rect class="bx" x="20" y="90" width="200" height="34"/><text class="m" x="24" y="112">1</text><text class="t" x="44" y="112">Bauyrzhan</text><text class="m" x="160" y="112">45</text>
  <rect class="bx" x="20" y="124" width="200" height="34"/><text class="m" x="24" y="146">2</text><text class="t" x="44" y="146">Dias</text><text class="m" x="160" y="146">91</text>
  <rect class="bx" x="20" y="158" width="200" height="34"/><text class="m" x="24" y="180">3</text><text class="t" x="44" y="180">Madina</text><text class="m" x="160" y="180">50</text>
  <line class="ln" x1="220" y1="124" x2="256" y2="124" marker-end="url(#hfA10)"/>
  <text class="h" x="385" y="24" text-anchor="middle">Script</text>
  <rect class="pb" x="260" y="40" width="250" height="44" rx="6"/>
  <text class="s" x="272" y="58">before the loop (once)</text><text class="m" x="272" y="76">&lt;table&gt; + header row</text>
  <rect class="wn" x="260" y="96" width="250" height="84" rx="6"/>
  <text class="s" x="272" y="114">inside: for i = 0 to 3 (4 times)</text>
  <text class="m" x="272" y="136">&lt;tr&gt; names[i]</text>
  <text class="m" x="272" y="156">scores[i], result &lt;/tr&gt;</text>
  <rect class="pb" x="260" y="192" width="250" height="44" rx="6"/>
  <text class="s" x="272" y="210">after the loop (once)</text><text class="m" x="272" y="228">&lt;/table&gt;</text>
  <line class="ln" x1="510" y1="138" x2="546" y2="138" marker-end="url(#hfA10)"/>
  <text class="h" x="645" y="24" text-anchor="middle">Page</text>
  <rect class="bx" x="550" y="40" width="190" height="30"/><text class="h" x="560" y="60">Pupil</text><text class="h" x="650" y="60">Score</text><text class="h" x="696" y="60">Res.</text>
  <rect class="ok" x="550" y="70" width="190" height="30"/><text class="t" x="560" y="90">Aigerim</text><text class="t" x="656" y="90">78</text><text class="t" x="696" y="90">Pass</text>
  <rect class="bad" x="550" y="100" width="190" height="30"/><text class="t" x="560" y="120">Bauyrzhan</text><text class="t" x="656" y="120">45</text><text class="t" x="690" y="120">Retake</text>
  <rect class="ok" x="550" y="130" width="190" height="30"/><text class="t" x="560" y="150">Dias</text><text class="t" x="656" y="150">91</text><text class="t" x="696" y="150">Pass</text>
  <rect class="ok" x="550" y="160" width="190" height="30"/><text class="t" x="560" y="180">Madina</text><text class="t" x="656" y="180">50</text><text class="t" x="696" y="180">Pass</text>
  <text class="s" x="380" y="272" text-anchor="middle">Opening and closing tags go outside the loop; one row is written per iteration.</text>
  <text class="s" x="380" y="292" text-anchor="middle">Four elements → four rows; 300 elements → 300 rows, with the same code.</text>
</svg>
:::

## Repeating until the input is valid

Sometimes the number of repetitions depends on the **user**: a program must keep asking for a value **until** it is valid. This is a job for a **condition-controlled** loop. In pseudocode the natural form is `REPEAT … UNTIL`, which always runs at least once (the user must be asked at least once) and tests the condition **at the end**. A `WHILE` loop can do the same if the first input is taken before the loop.

```pseudocode | Pseudocode — repeat until a valid mark is entered (two equivalent versions)
// post-condition loop: runs at least once
REPEAT
    OUTPUT "Enter a mark from 0 to 100"
    INPUT Mark
UNTIL Mark >= 0 AND Mark <= 100

// pre-condition loop: first input before the loop
OUTPUT "Enter a mark from 0 to 100"
INPUT Mark
WHILE Mark < 0 OR Mark > 100
    OUTPUT "Invalid. Enter a mark from 0 to 100"
    INPUT Mark
ENDWHILE
```

Notice how the conditions are **opposites**: `UNTIL` gives the condition to **stop** (the mark is valid), `WHILE` gives the condition to **continue** (the mark is invalid). Swapping AND and OR when negating is a classic error: "not (≥ 0 AND ≤ 100)" is "< 0 **OR** > 100".

In a web page, JavaScript can do the same with `prompt()` and a `do … while` loop, which is the JavaScript post-condition loop. In a real form this is usually done more politely with the submit event, but the loop is a clear way to show the algorithm, and exam questions use it.

```javascript | JavaScript — keep asking for a valid number of tickets
const MAX_TICKETS = 6;
let tickets;
do {
  tickets = Number(prompt("How many tickets (1-" + MAX_TICKETS + ")?"));
} while (!Number.isInteger(tickets) || tickets < 1 || tickets > MAX_TICKETS);
document.getElementById("summary").textContent = "You booked " + tickets + " tickets.";
```

On the **server**, a PHP script cannot "ask again" inside a loop, because it runs once per request and cannot wait for the user. The repeat-until-valid loop is made of **requests**: the script shows the form with errors, the user corrects it and submits again, and the script runs again — the cycle in the diagram above, with the sticky form making each repetition painless.

:::mermaid Repeat until valid: the loop continues while the input is invalid
flowchart TB
  S(["Start"]) --> A["Ask for the number of tickets"]
  A --> B["Convert the text to a number"]
  B --> C{"Whole number from 1 to 6?"}
  C -- no --> M["Show: invalid, try again"]
  M --> A
  C -- yes --> D["Use the value: show the booking"]
  D --> E(["End"])
:::

## Infinite loops and how to avoid them

A condition-controlled loop must contain something that can **change the condition** — usually a new input or an index that increases. If nothing inside the loop affects the condition, it runs forever: an **infinite loop**. In a browser this freezes the tab; on a server the script is stopped after a time limit with an error. Typical causes are forgetting `i ← i + 1` in a `WHILE` search loop, or asking for input **before** the loop but not **inside** it. When writing any `WHILE`, ask: "what inside this loop makes the condition false eventually?"

:::compare Choosing a loop for form-processing tasks
| Task | Best loop | Why |
|---|---|---|
| Check that all 8 required fields are filled | `foreach` / `FOR` | The list of fields is known in advance |
| Output every error message | `foreach` over `$errors` | One pass over a known array |
| Build a `<select>` with grades 7–12 | `for ($g = 7; $g <= 12; $g++)` | Fixed range of numbers |
| Total an order form | `foreach ($qty as $code => $q)` | Every line is visited once; keys are needed |
| Keep asking until a valid value is typed (JS) | `do … while` / `REPEAT … UNTIL` | Unknown number of attempts; must ask at least once |
| Find a pupil's name in an array, stop when found | `WHILE not found AND i ≤ upper bound` | May stop early |
| Read rows of a database result | `while ($row = $result->fetch_assoc())` | Unknown number of rows |
:::

# Good programming style
@lo 11.5.4.9

## Why style matters

A program is written once but **read many times** — by the teacher marking it, by a classmate helping you debug, by the programmer who has to add a new field to the form next year, and by you in three months' time when you have forgotten how it works. Code that only the computer can understand is a problem: it is hard to **read**, hard to **debug**, hard to **test** and expensive to **maintain**. Programming style is the set of rules that makes code **clear to humans**. The computer does not care about indentation or names; the people who work with the code care a great deal.

In Paper 3, questions ask you to identify features of good style in given code, to improve badly written code, and to write code "using good programming practice". You learned the basic rules in the previous topic; here each rule is explained in depth, with examples from form processing.

:::definition Programming style
A set of rules and conventions for writing program code — such as meaningful identifiers, indentation, comments, constants and subroutines — that make the code **easy to read, understand, debug and maintain** by other programmers.
:::

## Meaningful identifiers and naming conventions

An **identifier** is the name of a variable, constant, array, function or form field. A good identifier says **what the value means**: `$averageMark`, `$totalCost`, `$errors`, `isValidEmail()`. Bad identifiers say nothing: `$x`, `$a2`, `$temp`, `$data`. Single letters are acceptable only for short loop counters (`i`, `j`) where the meaning is obvious. Names should be pronounceable and not too long; abbreviations should be standard (`qty`, `max`, `num`).

A **naming convention** is a consistent way of writing names made of several words. **camelCase** (`totalCost`, `firstName`) is the usual style in JavaScript; **snake_case** (`total_cost`, `first_name`) is common in PHP variable and form-field names and in databases; **UPPER_CASE** is used for **constants** (`MAX_PIZZAS`); **PascalCase** (`Marks`, `TotalCost`) is common in Cambridge pseudocode. Which convention you use matters less than using **one convention consistently** throughout the program. Form fields, PHP keys and database columns that hold the same data should have **the same name**, so the link between them is obvious: `name="first_name"` → `$_POST["first_name"]` → column `first_name`.

Booleans read best as questions: `$isPaid`, `found`, `hasErrors`. Functions read best as verbs: `calculateTotal()`, `showErrors()`.

## Indentation and layout

**Indentation** means moving the body of every block — IF, ELSE, loop, function — a fixed number of spaces to the right (usually 4, or 2 in JavaScript), so that the **structure** of the program is visible at a glance: you can see which statements are inside the loop and where each IF ends. Mixed or missing indentation hides bugs, such as a statement you think is inside the loop but is actually after it. Layout rules that go with indentation: **one statement per line**, **spaces around operators** (`$total = $price * $qty;`), **blank lines between logical parts** of the program (read, validate, process, output), and a **consistent** position for braces.

## Comments

**Comments** are notes for humans that the interpreter ignores (`//` or `/* … */` in PHP and JavaScript, `//` in pseudocode). Good comments explain **why** something is done, the **purpose** of a block or function, its **inputs and outputs**, and anything **not obvious** — a business rule, a units choice, a known limitation. Bad comments repeat what the code already says, are out of date, or are used to excuse unclear code that should be rewritten with better names.

:::compare Good comments vs bad comments
| Bad comment | Why it is bad | Good comment |
|---|---|---|
| `$i = $i + 1; // add 1 to i` | Repeats the code; adds nothing | (No comment needed — the code is clear) |
| `$t = $p * 1.12; // calculate` | Vague; the magic number is unexplained | `$total = $price * (1 + VAT_RATE); // price includes 12% VAT` |
| `// loop` above a 30-line loop | Does not say what the loop is for | `// Validate every required field and collect error messages` |
| `// discount 5%` above code that now gives 10% | **Out of date** — worse than no comment | Keep comments updated, or name a constant `DISCOUNT_RATE` |
| No comment on a function | Reader must study the body to know what it does | `// Returns the order total in tenge for an array of code => quantity` |
:::

## Constants instead of magic numbers

A **magic number** is a literal value in the code whose meaning is not explained: `if ($qty > 10)`, `$total * 0.9`, `if ($mark >= 50)`. A reader does not know what 10, 0.9 or 50 represent, and if the rule changes — the maximum order becomes 12 — the programmer must find **every** place the number appears and must not change an unrelated 10 by mistake. A **constant** gives the value a meaningful name and defines it **once**, at the top of the program: `const MAX_PIZZAS = 10;`. Its value cannot be changed accidentally while the program runs, and changing the rule means editing one line.

:::definition Constant
A named value that is **set once and cannot be changed while the program runs** (e.g. `const PASS_MARK = 50;`, pseudocode `CONSTANT PassMark ← 50`). Using constants instead of magic numbers makes code easier to read and to update in one place.
:::

## Subroutines: functions and procedures

A **subroutine** is a named block of code that does **one task** and can be **called** from anywhere in the program. A **function** returns a value (`calculateTotal($prices, $qty)` returns a number); a **procedure** performs an action and returns nothing (`showErrors($errors)` outputs a list). Subroutines bring several benefits: the same code is **reused** instead of copied (the same validation for several forms); the main program becomes a short, readable list of steps; each subroutine can be **tested separately**; and a change is made in one place. A good subroutine has a **meaningful verb name**, receives its data through **parameters** (not global variables), and has **one responsibility** — it either validates, or calculates, or outputs, not all three.

## Validation and error handling as style

Robust code is also good style. A well-written form script checks that data exists and is valid before using it, gives the user **clear** error messages, handles failures (a database that cannot be reached) instead of crashing, and escapes output. Code that "works for the test data" but breaks on an empty field is not good code.

:::example Worked example — refactoring a badly written discount script
A shop in Taraz sent this script, which "works" but is very hard to understand.

```php
<?php
$a=$_POST["p"];$b=$_POST["q"];
if($b>=5){$c=$a*$b*0.95;}else{$c=$a*$b;}
if($c>50000){echo "too much";}else{echo $c;}
?>
```

**Step 1 — Identify the problems.** Meaningless identifiers (`$a`, `$b`, `$c`, field names `p`, `q`); no indentation, several statements per line; magic numbers (5, 0.95, 50000); no comments; no check that the fields were sent or are numbers; calculation and output mixed together.

**Step 2 — Rename.** `$a` → `$price`, `$b` → `$quantity`, `$c` → `$total`; form fields → `price`, `quantity`.

**Step 3 — Replace magic numbers with constants.** `BULK_QUANTITY = 5`, `BULK_DISCOUNT = 0.05`, `ORDER_LIMIT = 50000`.

**Step 4 — Move the calculation into a function** with one responsibility, and add a comment describing its purpose, inputs and output.

**Step 5 — Add validation, indentation and clear messages.**

```php
<?php
const BULK_QUANTITY = 5;       // from 5 items a bulk discount applies
const BULK_DISCOUNT = 0.05;    // 5%
const ORDER_LIMIT   = 50000;   // tenge; larger orders go to the manager

// Returns the cost in tenge of $quantity items at $price each,
// with the bulk discount when enough items are bought.
function calculateTotal(float $price, int $quantity): float {
    $total = $price * $quantity;
    if ($quantity >= BULK_QUANTITY) {
        $total = $total * (1 - BULK_DISCOUNT);
    }
    return $total;
}

$price    = (float)($_POST["price"] ?? 0);
$quantity = (int)($_POST["quantity"] ?? 0);

if ($price <= 0 || $quantity <= 0) {
    echo "Please enter a positive price and quantity.";
} else {
    $total = calculateTotal($price, $quantity);
    if ($total > ORDER_LIMIT) {
        echo "Orders over " . ORDER_LIMIT . " tenge must be approved by the manager.";
    } else {
        echo "Total: " . $total . " tenge";
    }
}
?>
```

**Step 6 — Check the behaviour is unchanged.** Price 2000, quantity 6: `calculateTotal` gives 2000 × 6 = 12000, quantity ≥ 5 → 12000 × 0.95 = **11400**, which is ≤ 50000, so the output is "Total: 11400 tenge" — the same as the original script, but now anyone can read, test and change it.
:::

:::cards
### Meaningful identifiers
`$averageMark`, `calculateTotal()`, `$isPaid` — say what the value or action is; one naming convention throughout.
### Indentation and layout
Indent every block body; one statement per line; spaces around operators; blank lines between read / validate / process / output.
### Comments
Explain **purpose and why**; describe each subroutine's inputs and output; keep them up to date; don't repeat the code.
### Constants
`const MAX_QTY = 10;` — no magic numbers; change a rule in one place.
### Subroutines
Small functions and procedures with one responsibility, parameters and a verb name; reuse instead of copy-paste.
### Robustness
Validate input, give clear messages, handle errors, escape output.
:::

:::warning Common mistakes with loops over form data and with style
- Calling `die()` or `exit` on the first error instead of collecting **all** errors in an array.
- Testing `count($errors)` **inside** the validation loop instead of once **after** it.
- Putting `<table>` or `<ul>` **inside** the loop, so every row becomes a separate table.
- Using a `WHILE` loop whose condition nothing inside the loop can change — an infinite loop.
- Negating a condition wrongly: the opposite of `mark >= 0 AND mark <= 100` is `mark < 0 OR mark > 100`.
- Trusting a price or total sent by the browser instead of recalculating from the server's own list.
- "Improving style" only by adding comments — examiners also look for **renamed identifiers, indentation, constants and subroutines**.
- Writing comments that repeat the code (`// add 1 to i`) and naming everything `data`, `temp`, `x`.
:::

# Exam practice: processing form data and programming style
@lo 11.5.4.4, 11.5.4.9

:::example Exam-style questions with model answers
**Q: A form sends several fields named `score[]`. Write PHP code that outputs the average score and the number of scores of 50 or more. [5]**
```php
$scores = $_POST["score"] ?? [];          // (1) read the array
$total = 0;
$countHigh = 0;                           // (1) total and counter set to 0
foreach ($scores as $score) {             // (1) loop over every element
    $total += (int)$score;
    if ((int)$score >= 50) $countHigh++;  // (1) running total and count
}
echo "Average: " . $total / count($scores) . "<br>"; // (1) average and count output after the loop
echo "50 or more: " . $countHigh;
```

**Q: Write pseudocode that asks the user for a quantity and repeats until a whole number from 1 to 20 is entered. [3]**
`REPEAT` (1) `OUTPUT "Enter quantity 1-20"` / `INPUT Quantity` inside the loop (1) `UNTIL Quantity >= 1 AND Quantity <= 20` (1).

**Q: A registration script stops with an error message at the first invalid field. Describe how it could be improved using an array and a loop. [3]**
Create an empty errors array before validation (1); check every field (e.g. loop through the list of required field names), adding a message to the array for each failure (1); after all the checks, process the data only if the array is empty, otherwise output every message (in a loop) and show the form again with the values kept (1).

**Q: Explain the difference between a count-controlled loop and a condition-controlled loop, giving a form-processing use of each. [4]**
A count-controlled loop repeats a fixed number of times known in advance (1), e.g. checking every one of the 8 required fields / totalling every order line (1). A condition-controlled loop repeats until/while a condition is true, the number of repetitions is not known in advance (1), e.g. asking again until a valid quantity is entered (1).

**Q: Give three features of good programming style and explain how each makes code easier to maintain. [6]**
Meaningful identifiers (1) — another programmer can understand what each variable holds without studying the code (1). Indentation (1) — shows which statements belong to each loop/IF, so the structure and errors are easier to see (1). Constants instead of magic numbers (1) — a value such as the pass mark is changed in one place (1). Also accept comments, subroutines.

**Q: Rewrite `$t=0;for($i=0;$i<count($a);$i++){$t=$t+$a[$i]*1.12;}echo $t;` in a good programming style. [3]**
```php
const VAT_RATE = 0.12;                            // (1) constant instead of 1.12
$totalWithVat = 0;                                // (1) meaningful identifiers
for ($i = 0; $i < count($prices); $i++) {
    $totalWithVat += $prices[$i] * (1 + VAT_RATE); // (1) indentation, one statement per line
}
echo $totalWithVat;
```
:::

:::warning Common mistakes in exam answers
- Dividing by the count **inside** the loop, or by a fixed number when the length of the form array is not known — use `count()`.
- Writing `UNTIL Quantity < 1 OR Quantity > 20` — UNTIL needs the condition for **valid** input (when to stop).
- Naming a style feature without explaining **how it helps** — "explain" questions need the benefit for 2 marks each.
- "Improving" code by adding comments only; renaming, indenting and constants are expected.
- Forgetting that PHP cannot wait for input in a loop — on the server, "repeat until valid" means showing the form again.
:::

:::steps Check yourself
- Define iterative algorithm, count-controlled loop and condition-controlled loop.
- Write the errors-array pattern: what happens before, inside and after the validation loop?
- What is a sticky form and how is it made for a text box, a radio group and a select list?
- Write a loop that outputs an HTML table from two parallel arrays. Which tags go outside the loop?
- Write REPEAT…UNTIL and WHILE versions of "ask until a mark is 0 to 100".
- What causes an infinite loop? How do you avoid one?
- List six rules of good programming style; give a good and a bad comment.
- What is a magic number? Rewrite `if ($qty > 10)` with a constant.
:::
