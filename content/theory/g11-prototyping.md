---
summary: What a prototype is and where it fits in the system life cycle, throw-away and evolutionary, low- and high-fidelity prototypes, the advantages and disadvantages of prototyping, and how to develop a prototype of the interface, input forms and output forms of a new system.
---
# What a prototype is
@lo 11.2.2.4

:::definition Prototype
An **early, simplified working model** of a new system (or part of it) that shows **how it will look and behave** — its screens, menus, input forms and reports — so that users can **try it and give feedback** before the full system is built.
:::

:::definition Prototyping
A way of developing a system in which a prototype is **built, tested by users and refined in repeated cycles** until the users agree that it meets their requirements.
:::

A prototype usually has the full **interface** but only part of the **functionality**: buttons may not save data yet, searches may return example records, and calculations may use fixed values. Its job is to answer the question *"Is this what you need?"* while changes are still cheap.

:::svg The prototyping cycle — build, test, get feedback, refine
<svg class="pt" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prototyping cycle: identify requirements, build prototype, users test it, collect feedback, decision satisfied; if no refine and test again; if yes build the final system">
  <style>
    svg.pt .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pt .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pt .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.pt .dg{fill:var(--warning);fill-opacity:.18;stroke:var(--warning);stroke-width:2}
    svg.pt .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.pt .ln{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.pt .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="30" width="150" height="56" rx="10"/>
  <text class="tt" x="85" y="54" text-anchor="middle">Identify basic</text>
  <text class="tt" x="85" y="72" text-anchor="middle">requirements</text>
  <path class="ln" d="M162,58 H196"/><path class="ah" d="M196,52 l12,6 l-12,6 z"/>
  <rect class="on" x="210" y="30" width="150" height="56" rx="10"/>
  <text class="tt" x="285" y="63" text-anchor="middle">Build prototype</text>
  <path class="ln" d="M362,58 H396"/><path class="ah" d="M396,52 l12,6 l-12,6 z"/>
  <rect class="on" x="410" y="30" width="150" height="56" rx="10"/>
  <text class="tt" x="485" y="54" text-anchor="middle">Users test</text>
  <text class="tt" x="485" y="72" text-anchor="middle">the prototype</text>
  <path class="ln" d="M562,58 H596"/><path class="ah" d="M596,52 l12,6 l-12,6 z"/>
  <rect class="on" x="610" y="30" width="140" height="56" rx="10"/>
  <text class="tt" x="680" y="63" text-anchor="middle">Collect feedback</text>
  <path class="ln" d="M680,88 V120"/><path class="ah" d="M674,120 l6,12 l6,-12 z"/>
  <path class="dg" d="M680,134 L750,174 L680,214 L610,174 Z"/>
  <text class="tt" x="680" y="170" text-anchor="middle">Users</text>
  <text class="tt" x="680" y="186" text-anchor="middle">satisfied?</text>
  <path class="ln" d="M610,174 H372"/><path class="ah" d="M372,168 l-12,6 l12,6 z"/>
  <text class="ss" x="590" y="166" text-anchor="end">No</text>
  <rect class="bx" x="210" y="146" width="150" height="56" rx="10"/>
  <text class="tt" x="285" y="170" text-anchor="middle">Refine the</text>
  <text class="tt" x="285" y="188" text-anchor="middle">prototype</text>
  <path class="ln" d="M360,160 C400,140 430,110 470,90"/><path class="ah" d="M466,84 l12,2 l-6,11 z"/>
  <text class="ss" x="430" y="140">test again</text>
  <path class="ln" d="M680,216 V240"/><path class="ah" d="M674,240 l6,12 l6,-12 z"/>
  <text class="ss" x="690" y="234">Yes</text>
  <rect class="ok" x="470" y="254" width="280" height="30" rx="8"/>
  <text class="tt" x="610" y="274" text-anchor="middle" style="fill:var(--success)">Build / complete the final system</text>
</svg>
:::

:::cards
### What a prototype usually includes
- The **screens** and the **navigation** between them (menus, buttons, links).
- **Input forms** with their fields, labels and controls.
- **Output forms** — reports, receipts, on-screen lists — filled with example data.
- A few **key functions** that users most want to see working.
### What it usually leaves out
- Full **data storage** (the database may be missing or contain test data only).
- **Security**, backups and error handling.
- **Speed** and the ability to handle many users at once.
- Rare cases and less important functions.
:::

## Where prototyping fits in the system life cycle

:::svg Prototypes are built during analysis and design, before the full system is coded
<svg class="pt" viewBox="0 0 760 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Life cycle stages: analysis, design, development, testing, implementation. Prototypes are built and refined across analysis and design">
  <style>
    svg.pt .st{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pt .hi{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pt .tt{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.pt .ah{fill:var(--muted)}
  </style>
  <rect class="hi" x="10" y="30" width="130" height="50" rx="10"/><text class="tt" x="75" y="60" text-anchor="middle" style="fill:var(--primary)">Analysis</text>
  <path class="ah" d="M146,49 l12,6 l-12,6 z"/>
  <rect class="hi" x="164" y="30" width="130" height="50" rx="10"/><text class="tt" x="229" y="60" text-anchor="middle" style="fill:var(--primary)">Design</text>
  <path class="ah" d="M300,49 l12,6 l-12,6 z"/>
  <rect class="st" x="318" y="30" width="130" height="50" rx="10"/><text class="tt" x="383" y="60" text-anchor="middle">Development</text>
  <path class="ah" d="M454,49 l12,6 l-12,6 z"/>
  <rect class="st" x="472" y="30" width="130" height="50" rx="10"/><text class="tt" x="537" y="60" text-anchor="middle">Testing</text>
  <path class="ah" d="M608,49 l12,6 l-12,6 z"/>
  <rect class="st" x="626" y="30" width="124" height="50" rx="10"/><text class="tt" x="688" y="60" text-anchor="middle">Implementation</text>
  <path d="M20,98 H284" style="stroke:var(--primary);stroke-width:3"/>
  <text class="ss" x="152" y="118" text-anchor="middle">prototypes built, tested by users and refined</text>
  <text class="ss" x="152" y="136" text-anchor="middle">→ requirements agreed, screens and forms approved</text>
  <text class="ss" x="537" y="118" text-anchor="middle">the approved prototype guides</text>
  <text class="ss" x="537" y="136" text-anchor="middle">coding and test plans</text>
</svg>
:::

:::example A prototype for a clinic appointment app
A clinic in Shymkent wants an app for booking doctor appointments. The receptionists are not sure what they need.
- The developer draws **three screens** in a design tool: *Choose a doctor*, *Choose a time*, *Confirm booking*.
- Receptionists click through them with example data. They ask for a **phone-number field** and a list of **free times only**.
- The developer adds both and shows the prototype again; this time it is approved.
- Only now is the database built and the real booking code written — the missing phone field was found **before** any code had to be rewritten.
:::

# Types of prototype
@lo 11.2.2.4

:::definition Throw-away (rapid) prototype
A prototype built **quickly and cheaply** only to **find out and agree the requirements**. When the requirements are clear it is **discarded** and the real system is built from scratch.
:::

:::definition Evolutionary prototype
A prototype that is **improved step by step**, version after version, until it **becomes the final system**. Each version adds functions based on user feedback.
:::

:::svg Throw-away prototypes are discarded; evolutionary prototypes grow into the final system
<svg class="pt" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top row: throw-away prototype versions 1 and 2 are discarded, then the final system is built from scratch. Bottom row: evolutionary prototype versions 1, 2 and 3 grow into the final system">
  <style>
    svg.pt .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pt .bin{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5;stroke-dasharray:5 4}
    svg.pt .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.pt .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pt .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .tt{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.pt .ln{fill:none;stroke:var(--muted);stroke-width:1.8}
    svg.pt .ah{fill:var(--muted)}
  </style>
  <text class="h" x="10" y="22">Throw-away</text>
  <rect class="bin" x="10" y="34" width="130" height="50" rx="8"/><text class="tt" x="75" y="56" text-anchor="middle">Paper sketch</text><text class="ss" x="75" y="73" text-anchor="middle">v1 — discarded</text>
  <path class="ln" d="M142,59 H168"/><path class="ah" d="M168,53 l12,6 l-12,6 z"/>
  <rect class="bin" x="182" y="34" width="130" height="50" rx="8"/><text class="tt" x="247" y="56" text-anchor="middle">Clickable mock-up</text><text class="ss" x="247" y="73" text-anchor="middle">v2 — discarded</text>
  <path class="ln" d="M314,59 H340"/><path class="ah" d="M340,53 l12,6 l-12,6 z"/>
  <rect class="bx" x="354" y="34" width="170" height="50" rx="8"/><text class="tt" x="439" y="56" text-anchor="middle">Requirements agreed</text><text class="ss" x="439" y="73" text-anchor="middle">written specification</text>
  <path class="ln" d="M526,59 H552"/><path class="ah" d="M552,53 l12,6 l-12,6 z"/>
  <rect class="ok" x="566" y="34" width="184" height="50" rx="8"/><text class="tt" x="658" y="56" text-anchor="middle" style="fill:var(--success)">Final system</text><text class="ss" x="658" y="73" text-anchor="middle">coded from scratch</text>
  <text class="h" x="10" y="140">Evolutionary</text>
  <rect class="on" x="10" y="152" width="150" height="50" rx="8"/><text class="tt" x="85" y="174" text-anchor="middle">Version 1</text><text class="ss" x="85" y="191" text-anchor="middle">catalogue page</text>
  <path class="ln" d="M162,177 H188"/><path class="ah" d="M188,171 l12,6 l-12,6 z"/>
  <rect class="on" x="202" y="152" width="160" height="50" rx="8"/><text class="tt" x="282" y="174" text-anchor="middle">Version 2</text><text class="ss" x="282" y="191" text-anchor="middle">+ basket and order form</text>
  <path class="ln" d="M364,177 H390"/><path class="ah" d="M390,171 l12,6 l-12,6 z"/>
  <rect class="on" x="404" y="152" width="160" height="50" rx="8"/><text class="tt" x="484" y="174" text-anchor="middle">Version 3</text><text class="ss" x="484" y="191" text-anchor="middle">+ payment, admin mode</text>
  <path class="ln" d="M566,177 H592"/><path class="ah" d="M592,171 l12,6 l-12,6 z"/>
  <rect class="ok" x="606" y="152" width="144" height="50" rx="8"/><text class="tt" x="678" y="174" text-anchor="middle" style="fill:var(--success)">Final system</text><text class="ss" x="678" y="191" text-anchor="middle">= last version</text>
  <text class="ss" x="10" y="234">feedback after every version decides what is added next</text>
</svg>
:::

:::compare Throw-away and evolutionary prototypes
| | Throw-away (rapid) | Evolutionary |
|---|---|---|
| Purpose | To **clarify the requirements** | To **build the system gradually** |
| What happens to it | **Discarded** when requirements are agreed | **Becomes the final system** |
| Speed of building | Very quick, often without real code | Slower — each version must be well built |
| Code quality | Does not matter — it is thrown away | Must be good, because it is kept |
| Best when | Users **do not know** exactly what they want | Requirements are **partly known** and will grow |
| Example | Paper screens of a school canteen app | An online shop released in versions |
:::

:::definition Low-fidelity and high-fidelity prototypes
A **low-fidelity** prototype is a rough model — paper sketches or simple wireframes — that shows layout but not real appearance. A **high-fidelity** prototype looks and behaves **almost like the real system** — real colours, fonts, clickable buttons, example data.
:::

:::compare Low-fidelity and high-fidelity
| | Low-fidelity | High-fidelity |
|---|---|---|
| Made with | Paper and pen, whiteboard, simple wireframe tool | Figma, PowerPoint with links, HTML / CSS, a form designer |
| Cost and time | Very cheap, minutes | More expensive, hours or days |
| Shows | Layout, which fields and buttons exist | Real look, colours, navigation, example data |
| Good for | Early ideas, many options compared quickly | Final approval of the design, user testing |
| Feedback is about | **What** is on each screen | **How** it looks and feels to use |
:::

:::warning Common mistakes
- Saying every prototype becomes the final system — only an **evolutionary** prototype does.
- Mixing up "throw-away" with "failed": a throw-away prototype has **done its job** when the requirements are agreed.
- Thinking a prototype must be a program — a set of **paper screens** is also a prototype.
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
- The prototype can be used for **training** and for writing the **user guide**.
### Disadvantages
- Building prototypes adds **additional development cost** and is **time-consuming**.
- Users may think the prototype **is the finished system** and expect it to be delivered too soon.
- Users may keep asking for **changes** (scope creep), so the project grows and is late.
- The prototype design can **constrain the designer's ideas** — later, better solutions are ignored.
- A prototype may **hide the real complexity** (security, speed, data storage) of the system.
- Quick prototype code may be **poorly structured** if it is kept (evolutionary).
:::

:::svg Why early feedback saves money: the later an error is found, the more it costs to fix
<svg class="pt" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar chart: relative cost of fixing an error is lowest at analysis and design, and grows through development, testing and after implementation">
  <style>
    svg.pt .ax{stroke:var(--border);stroke-width:1.5}
    svg.pt .b1{fill:var(--success)} svg.pt .b2{fill:var(--primary)} svg.pt .b3{fill:var(--danger)}
    svg.pt .tt{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
  </style>
  <line class="ax" x1="60" y1="210" x2="740" y2="210"/>
  <line class="ax" x1="60" y1="20" x2="60" y2="210"/>
  <text class="ss" x="20" y="30">cost</text>
  <rect class="b1" x="90" y="198" width="90" height="12" rx="3"/><text class="tt" x="135" y="190" text-anchor="middle">×1</text><text class="ss" x="135" y="230" text-anchor="middle">Analysis</text>
  <rect class="b1" x="220" y="186" width="90" height="24" rx="3"/><text class="tt" x="265" y="178" text-anchor="middle">×2</text><text class="ss" x="265" y="230" text-anchor="middle">Design</text>
  <rect class="b2" x="350" y="160" width="90" height="50" rx="3"/><text class="tt" x="395" y="152" text-anchor="middle">×5</text><text class="ss" x="395" y="230" text-anchor="middle">Development</text>
  <rect class="b2" x="480" y="110" width="90" height="100" rx="3"/><text class="tt" x="525" y="102" text-anchor="middle">×10</text><text class="ss" x="525" y="230" text-anchor="middle">Testing</text>
  <rect class="b3" x="610" y="40" width="90" height="170" rx="3"/><text class="tt" x="655" y="32" text-anchor="middle">×30+</text><text class="ss" x="655" y="230" text-anchor="middle">After go-live</text>
  <text class="ss" x="90" y="252">a prototype moves the discovery of wrong requirements into the green stages (illustrative figures)</text>
</svg>
:::

:::compare Linking each advantage to its effect (the "because … so …" chain)
| Point | Because… | …so |
|---|---|---|
| Missing requirements found early | Users try the screens before coding | Fields and functions are added while changes are cheap |
| Reduced time and cost overall | Fewer errors survive to the coding and testing stages | Less code has to be rewritten later |
| Better understanding | Users and developers look at the same screens | Fewer misunderstandings in the specification |
| Higher user acceptance | Users helped to design the system | They are happier to use it and need less persuading |
| Extra cost and time (disadvantage) | Each prototype version has to be built and tested | The project needs more budget at the start |
| Scope creep (disadvantage) | Users see how easy changes look | They keep asking for more, and the deadline slips |
:::

:::example Should a prototype be built? — weighing it up for a scenario
**Scenario:** a bakery chain in Almaty wants an app for ordering birthday cakes. The managers have never used an ordering app and cannot describe what the order form needs.

- **For a prototype:** the requirements are **unclear**, so a quick throw-away prototype of the order form lets managers point at what is missing (cake size, message on the cake, delivery time) before coding starts.
- **Against:** it adds **cost and time** at the start; managers may ask for many extra features.
- **Conclusion:** build a cheap **low-fidelity** prototype of the order form and the confirmation screen; agree a list of changes in advance to limit scope creep. The benefit (correct requirements) is bigger than the extra cost.
:::

:::tip Answering advantage / disadvantage questions
Give a **specific** effect, not a vague word: not "it is good" or "it is expensive", but "*users can test the input form early, so missing fields are added before the system is coded*". For "explain" questions write the point **and** its consequence.
:::

:::warning Common mistakes
- Writing "it saves time" with no reason — say **why**: errors are found early, before code is written.
- Giving the same point twice in different words (e.g. "quick feedback" and "users comment quickly").
- Forgetting that the extra cost of the prototype is a **disadvantage** even though it may reduce the **total** cost.
:::

# Exam practice: prototypes and their advantages
@lo 11.2.2.4

:::example Exam-style answers
**Q: Define the term prototype. [2]**
An early / simplified working model of a new system or part of it (1) used to show users how it will look and work so that they can test it and give feedback (before the full system is built) (1).

**Q: Describe the difference between a throw-away prototype and an evolutionary prototype. [2]**
A throw-away prototype is used only to agree the requirements and is then discarded (1); an evolutionary prototype is refined step by step until it becomes the final system (1).

**Q: Give two advantages of using a prototype when developing a new system. [2]**
Any two: missing functionality / requirements are found early (1); quick feedback from users (1); users and developers understand the system better (1); errors fixed early so time and cost are reduced (1); users feel involved and accept the system (1).

**Q: Write one disadvantage of using a prototype. [1]**
Additional development cost / it is time-consuming / users may think it is the finished system / users keep requesting changes / it can constrain the designer's ideas (1).

**Q: A prototype costs money to build, yet it can reduce the total cost of a project. Explain why. [2]**
Users find missing or wrong requirements while testing the prototype, before the system is coded (1); fixing errors at the design stage is much cheaper than rewriting code after development or implementation (1).

**Q: Explain why a throw-away prototype is suitable for a school that cannot describe exactly what it wants from a new timetable app. [2]**
The requirements are unclear, so a quick, cheap model lets staff see and comment on the screens (1); it can be discarded once the requirements are agreed, so no poorly built code is kept (1).
:::

:::warning Common mistakes in this lesson's exam answers
- A definition that says only "a model of the system" — add **why**: users test it and give feedback.
- Calling the prototype "the first version of the final system" for **every** type.
- Listing advantages without the consequence when the command word is **explain**.
:::

:::steps Check yourself
- Define a prototype and describe the four steps of the prototyping cycle.
- Say what a prototype usually includes and what it usually leaves out.
- Compare throw-away and evolutionary prototypes (purpose, what happens to them, code quality).
- Compare low-fidelity and high-fidelity prototypes.
- Give three advantages and three disadvantages of prototyping, each with its effect.
- Decide, for a given scenario, whether a prototype should be built, and justify the answer.
:::

# Designing the interface
@lo 11.2.2.5

:::definition User interface
The part of a system that the **user sees and interacts with** — screens, menus, buttons, forms and messages — through which data is entered and results are shown.
:::

:::definition Navigation
The way the user **moves between the screens** of a system — a main menu, navigation bar, buttons and links such as *Back* and *Home*.
:::

:::cards
### Principles of a good interface
- **Consistent** layout, colours, fonts and button positions on every screen.
- Clear **headings** so the user always knows which screen they are on.
- A **main menu** or navigation bar that reaches every part of the system; *Back* / *Home* buttons.
- **Simple language** and icons the users understand.
- **Help** messages, tooltips and clear error messages.
### Suit the interface to the users
- **Young children:** large buttons, pictures, few words.
- **Touchscreen kiosk:** big targets, few steps, no typing if possible.
- **Experienced staff:** keyboard shortcuts, many fields on one screen.
- **Users with poor eyesight:** large text, high contrast.
- Languages: Kazakh / Russian / English switch if users need it.
:::

:::svg Navigation structure of a library system — every screen is reachable from the main menu
<svg class="pt" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Navigation structure: login screen leads to main menu; main menu leads to Search books, Loans, Members and Reports; each screen has sub-screens and a Back to menu link">
  <style>
    svg.pt .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.pt .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.pt .tt{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.pt .ln{fill:none;stroke:var(--muted);stroke-width:1.6}
  </style>
  <rect class="bx" x="300" y="10" width="160" height="36" rx="8"/><text class="tt" x="380" y="33" text-anchor="middle">Log-in screen</text>
  <path class="ln" d="M380,46 V66"/>
  <rect class="on" x="290" y="66" width="180" height="40" rx="8"/><text class="tt" x="380" y="91" text-anchor="middle" style="fill:var(--primary)">Main menu</text>
  <path class="ln" d="M380,106 V124 M95,124 H665 M95,124 V140 M285,124 V140 M475,124 V140 M665,124 V140"/>
  <rect class="bx" x="20" y="140" width="150" height="36" rx="8"/><text class="tt" x="95" y="163" text-anchor="middle">Search books</text>
  <rect class="bx" x="210" y="140" width="150" height="36" rx="8"/><text class="tt" x="285" y="163" text-anchor="middle">Loans</text>
  <rect class="bx" x="400" y="140" width="150" height="36" rx="8"/><text class="tt" x="475" y="163" text-anchor="middle">Members</text>
  <rect class="bx" x="590" y="140" width="150" height="36" rx="8"/><text class="tt" x="665" y="163" text-anchor="middle">Reports</text>
  <text class="ss" x="95" y="198" text-anchor="middle">results list → book details</text>
  <text class="ss" x="285" y="198" text-anchor="middle">issue form · return form</text>
  <text class="ss" x="475" y="198" text-anchor="middle">add / edit member form</text>
  <text class="ss" x="665" y="198" text-anchor="middle">overdue · popular books</text>
  <text class="ss" x="380" y="236" text-anchor="middle">every screen has a "Back to menu" button and the same header</text>
</svg>
:::

:::compare Common interface elements
| Element | Used for | Example |
|---|---|---|
| **Menu / navigation bar** | Moving between the main parts of the system | Home · Orders · Products · Log out |
| **Button** | Starting an action | Save, Search, Print, Cancel |
| **Icon** | A quick, language-free picture of an action | 🔍 search, 🖨 print |
| **Message / dialog box** | Confirming an action or showing an error | "Delete this order? Yes / No" |
| **Tooltip / help text** | Explaining a field when the mouse is over it | "Enter the date as DD/MM/YYYY" |
| **Status / progress bar** | Showing that the system is working | "Uploading… 60 %" |
:::

:::tip Marks for an interface prototype
Examiners usually give marks for: a **title / heading**, a **menu or navigation**, the **fields or data** the scenario asks for, **named buttons**, and **labels**. Read the scenario and include every item it mentions.
:::

# Input and output forms
@lo 11.2.2.5

:::definition Input form
A screen (or paper form) used to **enter data into the system**, with labelled fields, suitable controls, validation and buttons.
:::

:::definition Output form
A screen or printed **report** that **presents information from the system** to the user — e.g. a receipt, a list of orders, a report of overdue books.
:::

:::svg A well-designed input form — the features examiners look for
<svg class="pt" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wireframe of a sports club registration form with labels pointing to the title, labelled fields, required marker, drop-down list, radio buttons, check box, error message and buttons">
  <style>
    svg.pt .fr{fill:none;stroke:var(--border);stroke-width:1.5}
    svg.pt .fd{fill:var(--surface-2);stroke:var(--border);stroke-width:1.2}
    svg.pt .er{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.2}
    svg.pt .bt{fill:var(--primary)}
    svg.pt .h{font:700 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .l{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.pt .note{font:600 12px system-ui,sans-serif;fill:var(--primary)}
    svg.pt .cl{stroke:var(--primary);stroke-width:1.2;stroke-dasharray:4 3}
  </style>
  <rect class="fr" x="20" y="10" width="420" height="310" rx="10"/>
  <text class="h" x="40" y="38">Join the Qyran Sports Club</text>
  <text class="l" x="40" y="72">Full name *</text><rect class="fd" x="170" y="56" width="250" height="24" rx="4"/><text class="ss" x="178" y="73">e.g. Aruzhan Bekova</text>
  <text class="l" x="40" y="108">Date of birth *</text><rect class="fd" x="170" y="92" width="250" height="24" rx="4"/><text class="ss" x="178" y="109">DD/MM/YYYY  📅</text>
  <text class="l" x="40" y="144">Sport *</text><rect class="fd" x="170" y="128" width="250" height="24" rx="4"/><text class="l" x="178" y="145">Swimming</text><text class="l" x="404" y="145">▾</text>
  <text class="l" x="40" y="180">Membership</text><circle cx="178" cy="176" r="6" style="fill:var(--primary)"/><text class="l" x="190" y="181">Basic</text><circle cx="258" cy="176" r="6" class="fd"/><text class="l" x="270" y="181">Premium</text>
  <text class="l" x="40" y="214">Phone *</text><rect class="er" x="170" y="198" width="250" height="24" rx="4"/><text class="l" x="178" y="215">8701 23</text>
  <text class="ss" x="170" y="238" style="fill:var(--danger)">Phone must have 11 digits</text>
  <rect class="fd" x="40" y="254" width="14" height="14"/><text class="l" x="62" y="266">I agree to the club rules</text>
  <rect class="bt" x="170" y="282" width="80" height="28" rx="5"/><text class="l" x="210" y="301" text-anchor="middle" style="fill:#fff">Submit</text>
  <rect class="fd" x="262" y="282" width="70" height="28" rx="5"/><text class="l" x="297" y="301" text-anchor="middle">Clear</text>
  <rect class="fd" x="344" y="282" width="76" height="28" rx="5"/><text class="l" x="382" y="301" text-anchor="middle">Cancel</text>
  <line class="cl" x1="300" y1="33" x2="470" y2="33"/><text class="note" x="476" y="37">clear title</text>
  <line class="cl" x1="422" y1="68" x2="470" y2="68"/><text class="note" x="476" y="72">label + hint; * = required (presence check)</text>
  <line class="cl" x1="420" y1="104" x2="470" y2="104"/><text class="note" x="476" y="108">date picker → correct format</text>
  <line class="cl" x1="420" y1="140" x2="470" y2="140"/><text class="note" x="476" y="144">drop-down → no spelling errors</text>
  <line class="cl" x1="330" y1="176" x2="470" y2="176"/><text class="note" x="476" y="180">radio buttons → exactly one choice</text>
  <line class="cl" x1="420" y1="232" x2="470" y2="232"/><text class="note" x="476" y="236">validation + error message</text>
  <line class="cl" x1="240" y1="262" x2="470" y2="262"/><text class="note" x="476" y="266">check box → yes / no</text>
  <line class="cl" x1="420" y1="296" x2="470" y2="296"/><text class="note" x="476" y="300">named buttons</text>
</svg>
:::

:::compare Choosing input controls
| Data | Control | Why |
|---|---|---|
| Choice from a long fixed list (category, city, sport) | **Drop-down list** | Prevents spelling errors and invalid values, saves space |
| One of a few options (membership type, payment method) | **Radio buttons** | All options visible; exactly one can be chosen |
| Yes / No (agree to terms, best-sale product) | **Check box** | Simple on / off |
| Several of a few options (interests) | **Several check boxes** | More than one may be ticked |
| Date | **Date picker** | Correct format guaranteed |
| Free text (name, address) | **Text box** with validation | Any characters needed |
| A number in a range (quantity, age) | **Number box / spinner** | Only numbers; min and max set |
| Long text (comments) | **Text area** | Several lines |
:::

:::html Prototype of an input form (Product Price Calculator) | 290
<div class="win">
  <h3>Product Price Calculator</h3>
  <label>Product code * <input value="AB102"></label>
  <label>Product name * <input value="Apple juice"></label>
  <label>Price paid (₸) * <input type="number" value="850" min="1"></label>
  <label>Category <select><option>Drinks</option><option>Bakery</option><option>Dairy</option></select></label>
  <label>Order date <input type="date" value="2026-10-14"></label>
  <label class="chk"><input type="checkbox" checked> Best sale product</label>
  <div class="btns"><button>Calculate</button><button class="g">Clear</button></div>
  <p class="out">Selling price: <b>1105 ₸</b></p>
</div>
---css---
body { font-family: Arial, sans-serif; font-size: 13px; }
.win { border: 1px solid #999; border-radius: 6px; padding: 10px 14px; width: 340px; }
h3 { margin: 0 0 8px; }
label { display: flex; justify-content: space-between; margin: 4px 0; }
label input, label select { width: 160px; }
.chk { justify-content: flex-start; gap: 6px; }
.btns { display: flex; gap: 6px; margin-top: 6px; }
button { background: #1f4fd8; color: #fff; border: 0; padding: 5px 12px; border-radius: 4px; }
button.g { background: #888; }
.out { margin: 8px 0 0; }
:::

:::svg Prototype of an output form — an overdue-books report
<svg class="pt" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Report wireframe: header with library name, report title and date; table with columns Student, Class, Book title, Days late; total line; Print and Export PDF buttons; page number">
  <style>
    svg.pt .fr{fill:none;stroke:var(--border);stroke-width:1.5}
    svg.pt .hd{fill:var(--primary-soft)}
    svg.pt .ln{stroke:var(--border);stroke-width:1}
    svg.pt .h{font:700 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .th{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .c{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.pt .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.pt .bt{fill:var(--primary)}
  </style>
  <rect class="fr" x="20" y="10" width="720" height="250" rx="10"/>
  <text class="h" x="40" y="40">CITY LIBRARY</text>
  <text class="h" x="380" y="40" text-anchor="middle">Overdue books report</text>
  <text class="c" x="720" y="40" text-anchor="end">14.10.2026</text>
  <line class="ln" x1="40" y1="52" x2="720" y2="52"/>
  <rect class="hd" x="40" y="62" width="680" height="28"/>
  <text class="th" x="50" y="81">Student</text><text class="th" x="250" y="81">Class</text><text class="th" x="340" y="81">Book title</text><text class="th" x="620" y="81">Days late</text>
  <text class="c" x="50" y="114">Bekova A.</text><text class="c" x="250" y="114">11A</text><text class="c" x="340" y="114">The Hobbit</text><text class="c" x="620" y="114">5</text>
  <line class="ln" x1="40" y1="124" x2="720" y2="124"/>
  <text class="c" x="50" y="146">Ospanov T.</text><text class="c" x="250" y="146">12B</text><text class="c" x="340" y="146">Abai Zholy</text><text class="c" x="620" y="146">12</text>
  <line class="ln" x1="40" y1="156" x2="720" y2="156"/>
  <text class="th" x="50" y="184">Total overdue books: 2</text>
  <rect class="bt" x="520" y="168" width="80" height="26" rx="5"/><text class="c" x="560" y="186" text-anchor="middle" style="fill:#fff">Print</text>
  <rect class="bt" x="610" y="168" width="110" height="26" rx="5"/><text class="c" x="665" y="186" text-anchor="middle" style="fill:#fff">Export PDF</text>
  <text class="ss" x="380" y="216" text-anchor="middle">sorted by days late · only the fields the librarian needs</text>
  <text class="ss" x="720" y="246" text-anchor="end">Page 1 of 1</text>
</svg>
:::

:::cards
### Features of a good input form
- A clear **title** and **instructions**.
- Fields in a **logical order** (as on the paper form).
- A **label** next to every field; hints / examples in placeholders.
- Suitable **controls** (drop-down, radio buttons, check box, date picker).
- **Validation** with clear **error messages**; required fields marked *.
- **Buttons**: Save / Submit, Clear, Cancel; navigation back to the menu.
### Features of a good output form
- A clear **title**, the **date** and **page numbers**.
- Data in a **table** with **column headings**; sensible **sort order**.
- **Totals**, counts or averages where needed; charts if they help.
- Only the information the user **needs** — no clutter.
- Can be **printed** or **exported** (PDF, spreadsheet).
:::

:::compare Input form and output form
| | Input form | Output form (report) |
|---|---|---|
| Purpose | Get data **into** the system | Show information **from** the system |
| Main parts | Labels, fields, controls, buttons | Title, table with headings, totals |
| Checks | **Validation** of every entry | Data already stored — no validation |
| Example | Registration form, order form | Receipt, class list, sales report |
| User does | Types, chooses, clicks *Save* | Reads, sorts, prints, exports |
:::

:::warning Common mistakes
- Drawing a form with fields but **no labels**, or labels with no fields.
- Choosing a **text box** where a drop-down list or radio buttons would prevent errors.
- Forgetting the **buttons** (Save, Cancel) and the **navigation**.
- An output form with **no title or column headings**, or one that shows every field of the database.
:::

# Developing a prototype
@lo 11.2.2.5

:::steps How to develop a prototype for a scenario
- List the **requirements**: which screens, which data must be entered, which reports are needed.
- Sketch the **navigation** — main menu → screens → sub-screens.
- For each **input form**, list the fields, choose a **control** for each and add **validation**.
- For each **output form**, choose the layout — table with headings, totals, sort order.
- Build the prototype: paper, slides with links, Figma, HTML, or a form designer in the programming tool.
- **Test** it with users, collect **feedback**, and **refine** it until it is approved.
:::

:::example Worked example — a prototype for a school canteen pre-order system
**Scenario:** pupils will order lunch online before 10:00; the canteen manager needs a list of orders to prepare.

**Step 1 — requirements.** Screens: *Log in*, *Menu of the day*, *Order form*, *Order confirmation*; report: *Today's orders* for the manager.

**Step 2 — navigation.** Log in → Main menu (Order lunch · My orders · Log out). Manager: Main menu → Today's orders.

**Step 3 — input form (Order form).**

| Field | Control | Validation |
|---|---|---|
| Pupil ID | Filled in automatically after log-in | — |
| Dish | Drop-down list of today's dishes | Presence check |
| Portion | Radio buttons: Small / Normal | One must be chosen |
| Extra drink | Check box | — |
| Collection time | Drop-down: 12:30 / 13:15 / 14:00 | Presence check |

Buttons: **Place order**, **Cancel**. Error message if the time is after 10:00: "Orders close at 10:00".

**Step 4 — output form (Today's orders).** Title and date; table *Class · Pupil · Dish · Portion · Time*, sorted by collection time; **total portions of each dish** at the bottom; *Print* button.

**Step 5 — test.** The manager tries it and asks for a **count per class**; the cook asks for **allergies** on the order form. Both are added in version 2 before any database code is written.
:::

:::html Prototype of an administrator screen (online store) | 270
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

```html | HTML for a simple prototype of a book-search form
<form>
  <h3>Search the library</h3>
  <label>Title <input type="text" name="title" placeholder="e.g. Abai Zholy"></label>
  <label>Genre
    <select name="genre">
      <option>Fiction</option><option>History</option><option>Science</option>
    </select>
  </label>
  <label><input type="checkbox" name="available"> Available only</label>
  <button type="submit">Search</button>
</form>
```

:::compare Tools for building a prototype
| Tool | Fidelity | Advantages | Disadvantages |
|---|---|---|---|
| Paper and pen | Low | Fastest, free, easy to change in a meeting | Cannot be clicked; looks unfinished |
| Slides with links (PowerPoint) | Medium | Clickable navigation, quick | Fields do not really work |
| Design tool (Figma) | High | Realistic look, shareable link, users can click through | Takes time to learn |
| HTML / CSS or a form designer | High | Real controls; can grow into the system (evolutionary) | Needs programming skills, slower |
:::

:::example Exam-style marking — "Draw the prototype of the administrator mode of an online store" [4]
An **order table** with suitable attributes (order no., customer, date, total, status) (1); a **main menu / navigation bar** (1); at least **two named buttons** — Add / Edit / Delete / Save (2).
:::

# Exam practice: designing a prototype
@lo 11.2.2.5

:::example Exam-style answers
**Q: State three features of a well-designed input form. [3]**
Any three: clear title (1); a label for each field (1); fields in a logical order (1); suitable controls such as drop-down lists (1); validation with error messages (1); required fields marked (1); Save / Cancel buttons (1).

**Q: Explain why a drop-down list is used for the field "City" on an input form. [2]**
The user chooses from a fixed list of cities (1), so spelling mistakes / invalid cities cannot be entered and the data is consistent (1).

**Q: Suggest a suitable control for "Payment method: Cash / Card / Kaspi QR" and justify it. [2]**
Radio buttons (1) — there are only a few options and exactly one must be chosen; all options are visible (1).

**Q: State two features of a well-designed output form (report). [2]**
Any two: title and date (1); table with column headings (1); totals / summaries (1); only the data the user needs (1); print / export option (1); page numbers (1).

**Q: A gym is developing a membership system. Describe the prototype of the "New member" input form. [4]**
Title "New member" (1); fields with labels: name, date of birth, phone, membership type (1); suitable controls — date picker for date of birth, radio buttons for membership type (1); Save and Cancel buttons / validation with an error message (1).
:::

:::warning Common mistakes
- Listing fields that the scenario **did not ask for** while missing the ones it did.
- Writing "a nice design" or "colourful" — name a **feature** (labels, validation, drop-down list).
- Mixing up input and output forms: reports do not need validation; input forms do not need totals.
- Forgetting to **justify** a control: say what error it prevents.
:::

:::steps Check yourself
- Define user interface, navigation, input form and output form.
- Draw the navigation structure for a small system (menu → screens).
- List six features of a good input form and five features of a good output form.
- Choose and justify a control for each field of a registration form.
- Design the prototype of an input form and a report for a given scenario, with labels, controls, validation and buttons.
- Compare four tools for building a prototype.
:::
