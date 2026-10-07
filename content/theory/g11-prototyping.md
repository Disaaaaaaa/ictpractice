---
summary: What prototypes are, the advantages and disadvantages of prototyping, and how to design prototypes of interfaces, input forms and output forms.
---
# Using prototypes in development
@lo 11.2.2.4

:::definition Prototype
An **early, simplified working model** of a system (or part of it, usually the interface) that is shown to users to get **feedback** before the full system is built.
:::

:::cards
### Throw-away prototype
Built quickly (even on paper or in a design tool), used to collect feedback, then **discarded**; the real system is built from scratch.
### Evolutionary prototype
Improved step by step after each round of feedback until it **becomes the final system**.
:::

:::compare Advantages and disadvantages of prototyping
| Advantages | Disadvantages |
|---|---|
| Users see and try the system early, so **misunderstandings are found early** | Users may think the prototype is the finished system and expect it soon |
| Requirements can be refined from feedback | Repeated changes can increase **time and cost** |
| Users feel involved → more likely to accept the system | Focus on the interface may hide problems with the processing/data |
| Errors are cheaper to fix at the design stage | Documentation may be neglected |
| Helps the developer estimate the work needed | Scope may grow ("can it also do …?") |
:::

# Designing interface, input and output prototypes
@lo 11.2.2.5

:::cards
### Interface design
Layout of screens and navigation: menus, buttons, consistent colours and fonts, clear headings, help messages.
### Input form design
Fields in a logical order, clear **labels**, suitable controls (drop-down lists, radio buttons, check boxes, date pickers), **validation** and error messages, default values.
### Output form design
Reports and screens that show results clearly: headings, tables, totals, charts; only the information the user needs; printable.
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

:::compare Choosing input controls
| Data | Control | Why |
|---|---|---|
| Choice from a fixed list (category) | Drop-down list | Prevents spelling errors, saves space |
| One of few options (gender, payment type) | Radio buttons | All options visible; exactly one chosen |
| Yes/No (best sale product, agree to terms) | Check box | Simple on/off |
| Date | Date picker | Correct format guaranteed |
| Free text (name) | Text box with validation | Any characters needed |
:::

:::tip
When asked to "draw the interface", label every component (text box, drop-down list, check box, button) and include all the fields mentioned in the scenario — marks are given per required component.
:::
