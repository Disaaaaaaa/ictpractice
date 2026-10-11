---
summary: What a prototype is, throw-away and evolutionary prototyping, the advantages and disadvantages of using prototypes, and how to design prototypes of the interface, input forms and output forms of a new system.
---
# What a prototype is
@lo 11.2.2.4

:::definition Prototype
An **early, simplified working model** of a new system (or part of it) that shows **how it will look and behave** — its screens, menus, forms and reports — so that users can **try it and give feedback** before the full system is built.
:::

A prototype usually has the **interface** but only part of the **functionality**: buttons may not save data yet, and calculations may use example values. The developer changes the prototype after each round of user feedback.

:::mermaid The prototyping cycle
flowchart TB
  A[Identify basic requirements] --> B[Build the prototype]
  B --> C[Users test the prototype]
  C --> D[Collect feedback]
  D --> E{Users satisfied?}
  E -- No --> F[Refine the prototype]
  F --> C
  E -- Yes --> G[Build / complete the final system]
:::

:::compare Types of prototype
| Type | How it is used | Example |
|---|---|---|
| **Throw-away (rapid) prototype** | Built quickly to **clarify requirements**; then **discarded** and the real system is built from scratch | Paper sketches or a clickable mock-up of an app's screens |
| **Evolutionary prototype** | Improved step by step until it **becomes the final system** | A web shop that starts with a catalogue page and grows with each version |
| **Low-fidelity** | Paper sketches, wireframes — quick and cheap | Hand-drawn screens |
| **High-fidelity** | Looks and behaves almost like the real system | An interactive mock-up made in Figma or HTML |
:::

# Advantages and disadvantages of prototyping
@lo 11.2.2.4

:::cards
### Advantages
- **Users see and try** the system early, so **missing or wrong requirements** are found quickly (easy detection of missing functionality).
- **Quick feedback** from users improves the design.
- Users and developers **understand the system better**; fewer misunderstandings.
- Errors are found **early**, when they are **cheaper** to fix → **reduced time and costs** overall.
- Users feel **involved**, so they **accept** the final system more easily.
- The prototype can be used for **training** and for the **user guide**.
### Disadvantages
- Building prototypes adds **additional development cost** and is **time-consuming**.
- Users may think the prototype **is the finished system** and expect it too soon.
- Users may keep asking for **changes** (scope creep), so the project grows.
- The prototype design can **constrain the designer's ideas** — later better solutions are ignored.
- If the designer's knowledge is limited, the prototype may **hide the real complexity** of the system.
- Quick prototype code may be **poorly structured** if it is kept (evolutionary).
:::

:::tip Answering advantage/disadvantage questions
Give a **specific** effect: not "it is good", but "*users can test the input form early, so missing fields are added before the system is coded*".
:::

# Designing the interface
@lo 11.2.2.5

:::cards
### Interface (navigation) design
- A **main menu** or navigation bar that leads to every part of the system.
- **Consistent** layout, colours, fonts and button positions on every screen.
- Clear **headings** so the user knows where they are; a **Back / Home** button.
- **Help** messages and tooltips.
- Suitable for the **users** (large buttons for a touchscreen kiosk, simple words for children).
### Input form design
- Fields in a **logical order** (as on the paper form).
- Clear **labels** next to each field; examples / hints in placeholders.
- Suitable **controls**: text box, drop-down list, radio buttons, check box, date picker.
- **Validation** and clear **error messages**; required fields marked *.
- **Buttons**: Save, Clear, Cancel.
### Output form (report) design
- A clear **title**, date and page numbers.
- Data in **tables** with column headings; **totals** and summaries.
- Only the information the user **needs**; charts where helpful.
- Can be **printed** or **exported** (PDF).
:::

:::compare Choosing input controls
| Data | Control | Why |
|---|---|---|
| Choice from a long fixed list (category, city) | **Drop-down list** | Prevents spelling errors, saves space |
| One of a few options (gender, payment type) | **Radio buttons** | All options visible; exactly one chosen |
| Yes / No (best-sale product, agree to terms) | **Check box** | Simple on / off |
| Date | **Date picker** | Correct format guaranteed |
| Free text (name, address) | **Text box** with validation | Any characters needed |
| A number in a range (quantity) | **Number box / spinner** | Only numbers; min and max |
:::

:::html Prototype of an input form (Product Price Calculator) | 280
<div class="win">
  <h3>Product Price Calculator</h3>
  <label>Product code <input value="AB102"></label>
  <label>Product name <input value="Apple juice"></label>
  <label>Price paid (₸) <input type="number" value="850"></label>
  <label>Category <select><option>Drinks</option><option>Bakery</option></select></label>
  <label>Order date <input type="date" value="2026-10-14"></label>
  <label class="chk"><input type="checkbox" checked> Best sale product</label>
  <button>Calculate</button>
  <p class="out">Selling price: <b>1105 ₸</b></p>
</div>
---css---
body { font-family: Arial, sans-serif; font-size: 13px; }
.win { border: 1px solid #999; border-radius: 6px; padding: 10px 14px; width: 330px; }
h3 { margin: 0 0 8px; }
label { display: flex; justify-content: space-between; margin: 4px 0; }
label input, label select { width: 160px; }
.chk { justify-content: flex-start; gap: 6px; }
button { margin-top: 6px; background: #1f4fd8; color: #fff; border: 0; padding: 5px 12px; border-radius: 4px; }
.out { margin: 8px 0 0; }
:::

:::html Prototype of an administrator screen (online store) | 260
<div class="app">
  <nav><b>Admin</b> <a>Orders</a> <a>Products</a> <a>Customers</a> <a>Log out</a></nav>
  <h3>Orders</h3>
  <table>
    <tr><th>Order no.</th><th>Customer</th><th>Date</th><th>Total (₸)</th><th>Status</th></tr>
    <tr><td>1042</td><td>D. Seitova</td><td>14.10.2026</td><td>12 500</td><td>New</td></tr>
    <tr><td>1041</td><td>A. Nurov</td><td>14.10.2026</td><td>3 200</td><td>Sent</td></tr>
  </table>
  <div class="btns"><button>Add</button><button>Edit</button><button>Delete</button><button>Save</button></div>
</div>
---css---
body { font-family: Arial, sans-serif; font-size: 12px; }
.app { border: 1px solid #999; border-radius: 6px; padding: 8px; width: 420px; }
nav { background: #1f4fd8; color: #fff; padding: 5px 8px; border-radius: 4px; }
nav a { color: #fff; margin-left: 10px; }
h3 { margin: 8px 0 4px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #bbb; padding: 3px 5px; text-align: left; }
th { background: #eef2fc; }
.btns { margin-top: 6px; display: flex; gap: 6px; }
button { padding: 3px 10px; }
:::

:::ascii Prototype of an output form (report) — wireframe
+-----------------------------------------------------------+
|  CITY LIBRARY            Overdue books report   14.10.2026 |
+-----------------------------------------------------------+
|  Student        | Class | Book title         | Days late   |
|-----------------|-------|--------------------|-------------|
|  Bekova A.      | 11A   | The Hobbit         | 5           |
|  Ospanov T.     | 12B   | Abai Zholy         | 12          |
|-----------------------------------------------------------|
|  Total overdue books: 2              [Print]  [Export PDF] |
+-----------------------------------------------------------+
:::

# Developing a prototype
@lo 11.2.2.5

:::steps How to develop a prototype for a scenario
- List the **requirements**: which screens, which data must be entered, which reports are needed.
- Sketch the **navigation** (main menu → screens).
- For each **input form**, list the fields, choose a **control** for each and add **validation**.
- For each **output form**, choose the layout (table, totals, chart).
- Build the prototype (paper, slides, Figma, HTML, a form designer in the programming tool).
- **Test** it with users, collect **feedback**, and **refine** it.
:::

:::example Exam-style marking — "Draw the prototype of the administrator mode" [4]
An **order table** with suitable attributes (order no., customer, date, total, status) (1); a **main menu / navigation** (1); at least **two buttons with names** — Save / Edit / Delete / navigation (2).
:::

# Exam practice and summary
@lo 11.2.2.4 11.2.2.5

:::example Exam-style answers
**Q: Give one advantage of using a prototype in a project. [1]**
**Easy detection of missing functionality** / quick feedback / reduced time and costs / helps developers and users understand the system better.

**Q: Write one disadvantage of using a prototype when developing a new system. [1]**
**Additional development costs** / it is **time-consuming** / prototype design can constrain a designer's ideas.

**Q: Explain why a drop-down list is used for "Category" on the input form. [2]**
The user **chooses from a fixed list** (1), so **spelling errors and invalid categories** are prevented / it saves space (1).
:::

:::warning Common mistakes
- Saying the prototype **is** the final system (unless it is evolutionary).
- Drawing a form without **labels** or without the **fields** listed in the question.
- Choosing a text box where a list or radio buttons would prevent errors.
- Forgetting **buttons** and **navigation** in an interface prototype.
:::

:::steps Check yourself
- Define a prototype and describe the prototyping cycle.
- Compare throw-away and evolutionary prototypes.
- Give three advantages and three disadvantages of prototyping.
- List five features of a good input form.
- Design a prototype of a registration form and a report for a sports club.
:::
