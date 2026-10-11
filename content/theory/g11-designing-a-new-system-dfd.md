---
summary: Data flow diagrams (DFDs) — what they show, the four symbols (external entity, process, data store, data flow), context diagrams and first-level DFDs, the rules for drawing them correctly, and how to create a level-1 DFD that shows input, processing, storage and output.
---
# What a data flow diagram shows
@lo 11.2.2.1

:::definition Data flow diagram (DFD)
A diagram that shows **how data moves through a system**: where it comes **from** (inputs), how it is **processed**, where it is **stored**, and where it goes **to** (outputs). It shows **what** happens to the data, not **how** the program does it and not the **order** of events.
:::

A DFD is drawn during **analysis** (to describe the current system) and **design** (to plan the new system). It helps the analyst, the programmers and the client agree on the **inputs, processes, outputs and storage (IPOS)** of the system.

:::compare The four DFD symbols
| Symbol | Shape | Represents | Naming | Examples |
|---|---|---|---|---|
| **External entity** | Rectangle (square) | A person, organisation or system **outside** the system that **sends data in or receives data out** | A **noun** | Customer, Student, Bank, Supplier |
| **Process** | Rounded rectangle (or circle) with a **number** | An action that **transforms** input data into output data | **Verb + noun** | 1 Check order, 2 Calculate bill, 3 Issue book |
| **Data store** | Open-ended rectangle with an ID (D1, D2…) | Data **held** for later use — a file, database table, folder | A **noun** (plural) | D1 Customers, D2 Orders, D3 Books |
| **Data flow** | **Arrow** with a label | **Data moving** between the other symbols; the arrow shows the direction | A **noun** — the data carried | Order details, Payment, Receipt |
:::

:::ascii DFD notation (Gane–Sarson style)
  +-----------+        order details        +-----------------+        +-----+------------+
  | Customer  | --------------------------> | 1               | -----> | D1  | Orders     |
  +-----------+                             |  Record order   |        +-----+------------+
  external entity      data flow            +-----------------+          data store
                                                 process
:::

:::callout info Different notations
Some books draw **processes as circles** (Yourdon–DeMarco notation) and data stores as two parallel lines. Any notation is accepted if it is **used consistently** and the symbols are clearly different.
:::

# Context diagrams and first-level DFDs
@lo 11.2.2.1

:::compare Levels of DFD
| Level | Shows | Data stores? |
|---|---|---|
| **Context diagram (level 0)** | The **whole system as one process**, with all the **external entities** and the data flows between them and the system | **No** |
| **Level 1 (first-level) DFD** | The system split into its **main processes** (usually 3–7), with the **data stores** and the flows between processes, stores and entities | **Yes** |
| Level 2 | One level-1 process broken down further | Yes |
:::

:::mermaid Context diagram — a school library system
flowchart TB
  S[Student] -- borrow request, returned book --> L((0 Library system))
  L -- loan receipt, overdue notice --> S
  LB[Librarian] -- new book details --> L
  L -- loan reports --> LB
:::

:::ascii Level-1 DFD — the same library system   ( [ ] entity   ( ) process   | | data store )
 [Librarian] --new book details--> (1 Register book) --book record--> |D1 Books|

 [Student] --student card, book ID--> (2 Issue book) <--student details-- |D2 Students|
 [Student] <--loan receipt----------- (2 Issue book) <--book status------ |D1 Books|
                                      (2 Issue book) --loan record------> |D3 Loans|

 [Student] --returned book ID-------> (3 Return book) <--loan details---- |D3 Loans|
 [Student] <--fine notice------------ (3 Return book) --updated loan----> |D3 Loans|

 |D3 Loans| --loan data--> (4 Produce reports) --overdue report--> [Librarian]
:::

:::compare Data flows of the library level-1 DFD
| From | Data flow | To |
|---|---|---|
| Librarian | new book details | 1 Register book |
| 1 Register book | book record | D1 Books |
| Student | student card, book ID | 2 Issue book |
| D2 Students, D1 Books | student details, book status | 2 Issue book |
| 2 Issue book | loan record | D3 Loans |
| 2 Issue book | loan receipt | Student |
| Student | returned book ID | 3 Return book |
| D3 Loans ↔ 3 Return book | loan details / updated loan | — |
| 3 Return book | fine notice | Student |
| D3 Loans | loan data | 4 Produce reports |
| 4 Produce reports | overdue report | Librarian |
:::

:::tip Balancing
The level-1 DFD must be **balanced** with the context diagram: it has the **same external entities** and the **same flows** in and out of the system — the level-1 diagram only adds detail inside.
:::

# Rules for drawing a correct DFD
@lo 11.2.2.1

:::compare Allowed and not allowed data flows
| Flow | Allowed? | Why |
|---|---|---|
| Entity → Process | ✔ | Input to the system |
| Process → Entity | ✔ | Output from the system |
| Process → Data store | ✔ | Saving / updating data |
| Data store → Process | ✔ | Reading data |
| Process → Process | ✔ | One process passes data to another |
| **Entity → Entity** | ✘ | Outside the system — not shown |
| **Entity → Data store** (or store → entity) | ✘ | Data can only be stored or read **by a process** |
| **Data store → Data store** | ✘ | Data must be **moved by a process** |
:::

:::cards
### Rules for processes
- Every process needs **at least one input and at least one output**.
- Name it **verb + noun**: *Validate payment*, *Calculate grade*.
- Number processes **1, 2, 3 …** (numbers do not show order).
### Rules for flows and stores
- Every flow has a **name** (the data, a **noun**), not an action ("send" ✘).
- A data store must be **written to** and **read from** by some process.
- Do not draw decisions, loops or control signals — a DFD is **not** a flowchart.
:::

:::compare Common process errors
| Error | Meaning | Example |
|---|---|---|
| **Black hole** | A process has inputs but **no output** | "Record order" receives order details but sends nothing anywhere |
| **Miracle** | A process has outputs but **no input** | "Print invoice" produces an invoice from nothing |
| **Grey hole** | The outputs could not be produced from the inputs | "Calculate total" receives only the customer's name |
:::

# Creating a first-level DFD from a description
@lo 11.2.2.1

:::steps How to draw a level-1 DFD
- Read the description and **underline the external entities** (who gives or receives data).
- Find the **main processes** — the actions the system performs (verbs): *takes orders*, *checks stock*, *sends invoices*.
- Find the **data stores** — data that is **kept** (customers, products, orders).
- For each process list its **inputs** and **outputs** and where they come from / go to.
- Draw the symbols, connect them with **named arrows**, and **check the rules** (no entity–store links, every process has input and output).
- Check that the diagram is **balanced** with the context diagram.
:::

:::example Worked example — an online pizza shop
*Customers order pizzas online. The system checks the menu for prices, calculates the total and stores the order. The customer pays by card through the bank, which sends a payment confirmation. The kitchen receives a list of orders to prepare, and the customer receives a receipt by e-mail.*

| Element | Found in the text |
|---|---|
| External entities | **Customer**, **Bank**, **Kitchen** |
| Processes | **1 Take order**, **2 Process payment**, **3 Send order to kitchen** |
| Data stores | **D1 Menu**, **D2 Orders** |
| Flows | order details, prices, order, card details, payment confirmation, receipt, kitchen order list |
:::

:::ascii Level-1 DFD for the pizza shop   ( [ ] entity   ( ) process   | | data store )
 [Customer] --order details--> (1 Take order) <--prices---- |D1 Menu|
                               (1 Take order) --new order--> |D2 Orders|
                               (1 Take order) --amount due--> (2 Process payment)

 [Customer] --card details----> (2 Process payment) --payment request------> [Bank]
 [Customer] <--receipt--------- (2 Process payment) <--payment confirmation-- [Bank]
                                (2 Process payment) --paid status--> |D2 Orders|

 |D2 Orders| --paid orders--> (3 Send order to kitchen) --kitchen order list--> [Kitchen]
:::

:::callout info Drawing DFDs on the platform
In DFD questions, add **external entities**, **processes** and **data stores** from the toolbar, connect them by dragging between the dots, then **select each arrow** and type the name of the data flow.
:::

# DFDs compared with other diagrams
@lo 11.2.2.1

:::compare DFD vs flowchart vs ERD
| | DFD | Flowchart | ERD |
|---|---|---|---|
| Shows | **Movement of data** between entities, processes and stores | The **sequence of steps** and decisions in an algorithm | **Entities** and the **relationships** between them |
| Order / decisions | Not shown | Shown (arrows, decision diamonds) | Not shown |
| Used for | Analysing and designing the **whole system** | Designing **one process / program** | Designing the **database** |
:::

# Exam practice and summary
@lo 11.2.2.1

:::example Exam-style answers
**Q: State the purpose of a data flow diagram. [1]**
To show **how data flows through a system** — its inputs, processes, outputs and data stores.

**Q: Identify one error in the DFD where the arrow goes directly from "Customer" to "D1 Customers". [2]**
An **external entity cannot send data directly to a data store** (1); the data must pass through a **process**, e.g. "1 Register customer" (1).

**Q: Draw a first-level DFD for the system described. [6]**
Credit is given for: correct **external entities**; correct **processes** with verb + noun names; correct **data stores**; **named data flows** in the correct directions; **no rule-breaking** flows; a diagram that matches the description.
:::

:::warning Common mistakes
- Joining an **entity directly to a data store**, or two stores together.
- **Unlabelled arrows**, or labels that are actions ("check") instead of data ("order details").
- Processes with **only inputs** (black hole) or **only outputs** (miracle).
- Including the **user's actions** inside the system as entities, e.g. drawing the database as an external entity.
- Drawing **decisions and loops** as in a flowchart.
- Putting data stores on a **context diagram**.
:::

:::steps Check yourself
- Name and draw the four DFD symbols.
- What is the difference between a context diagram and a level-1 DFD?
- Which flows are not allowed in a DFD?
- What are a black hole and a miracle?
- Draw a context diagram and a level-1 DFD for a cinema ticket-booking system.
- How is a DFD different from a flowchart?
:::
