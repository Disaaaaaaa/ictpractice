---
summary: Data flow diagrams — their symbols, context (level 0) and level 1 diagrams, and how to draw a DFD that shows input, processing, storage and output.
---
# Data flow diagrams
@lo 11.2.2.1

:::definition Data flow diagram (DFD)
A diagram that shows **how data moves through a system**: where it comes from, how it is processed, where it is stored and where it goes. It shows *data*, not the order of steps or decisions.
:::

:::compare DFD symbols
| Symbol | Name | Meaning | Labelled with |
|---|---|---|---|
| Rectangle | External entity | A person/organisation/system **outside** the system that sends or receives data | A noun: *Customer*, *Supplier* |
| Rounded rectangle (or circle) | Process | An action that **transforms data** | Number + verb phrase: *1 Check order* |
| Open-ended rectangle | Data store | Where data is **kept** (file, table) | ID + name: *D1 Orders* |
| Arrow | Data flow | Data moving between the other symbols | The data: *order details* |
:::

:::cards
### Context diagram (level 0)
The **whole system is one process**. Shows only the external entities and the data flows between them and the system. Gives an overview of the system boundary.
### Level 1 DFD
Breaks the system into its **main processes** (1, 2, 3 …), shows the **data stores** and every data flow between processes, stores and entities.
:::

:::mermaid Context (level 0) diagram — online toy shop
flowchart LR
  C[Customer] -- order details --> S((0 Toy shop system))
  S -- invoice / bill --> C
  S -- stock request --> P[Supplier]
  P -- delivery note --> S
:::

:::mermaid Level 1 DFD — the same system
flowchart LR
  C[Customer] -- order details --> P1([1 Check customer])
  P1 <-- customer details --> D1[(D1 Customers)]
  P1 -- valid order --> P2([2 Record order])
  P2 -- order --> D2[(D2 Orders)]
  D3[(D3 Products)] -- price, stock --> P2
  P2 -- order total --> P3([3 Generate bill])
  P3 -- bill --> C
:::

## Rules for a correct DFD

- Every **process** must have at least one input **and** one output.
- Data cannot flow **directly** between two external entities, between two data stores, or between an entity and a data store — it must pass through a **process**.
- Every data flow is **labelled** with the data it carries (nouns, not actions).
- Processes are numbered and named with a **verb** ("Calculate price").
- Data stores and entities in level 1 must match the context diagram.

:::steps Drawing a level 1 DFD from a scenario
- Find the **external entities** (who gives or receives data).
- Find the **processes** — the verbs in the scenario ("checks the client", "places the order", "generates the bill").
- Find the **data stores** — data that is saved (customers, orders, products).
- Join them with labelled **data flows**, following the order of events.
- Check the rules above.
:::

## Why DFDs are used

- Show clearly how data moves between processes, stores and users.
- Define the **boundary** of the system (what is inside and outside).
- Help analysts and clients **communicate** — easy to understand without technical knowledge.
- Help find missing or duplicated data and processes before coding.
- Form part of the design documentation.

:::tip
Marks in DFD questions are typically for: correct **entities**, all **processes**, **data stores**, and a number of **correctly labelled data flows**. Never leave an arrow unlabelled.
:::
