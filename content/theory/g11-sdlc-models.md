---
summary: The stages of the system development life cycle and how the waterfall, agile and spiral models organise them.
---
# What the system development life cycle is
@lo 11.2.1.1

:::definition System development life cycle (SDLC)
A structured sequence of **stages** that a team follows to **plan, build, introduce and maintain** a new information system. Each stage has clear activities and produces documents or products that the next stage uses.
:::

:::cards
### Why follow an SDLC?
- Breaks a large project into **manageable stages** with clear goals.
- Makes sure the system **meets the users' requirements**.
- Lets managers **plan time, cost and staff** and check progress at **milestones**.
- Produces **documentation** at every stage, so the system can be maintained later.
- Finds problems **early**, when they are cheaper to fix.
### Who is involved?
- **Client / end users** — describe their needs, test and use the system.
- **Systems analyst** — studies the current system and writes the requirements.
- **Designer** — plans the interface, data and processes.
- **Programmers / developers** — write the code and build the database.
- **Testers** — check that the system works and meets the requirements.
- **Project manager** — plans, schedules and controls the project.
:::

:::mermaid The six stages form a cycle — evaluation can start the next version
flowchart LR
  A[1 Analysis] --> B[2 Design] --> C[3 Development and testing] --> D[4 Implementation] --> E[5 Documentation] --> F[6 Evaluation and maintenance]
  F -. new requirements .-> A
:::

:::callout info Same stages, different organisation
Every development model uses the **same stages**. What differs is **how they are organised**: done once in a strict order (**waterfall**), repeated in short cycles (**agile**), or repeated in loops driven by risk (**spiral**).
:::

# Stage 1 — Analysis
@lo 11.2.1.1

The analyst finds out **what the current system does, what is wrong with it and what the new system must do**.

:::steps Activities in the analysis stage
- **Investigate the current system** using questionnaires, interviews, observation and examining documents.
- Identify the **problems** of the current system and the **needs** of the users.
- Identify **inputs, processes, outputs and storage** (often shown in a data flow diagram).
- Carry out a **feasibility study** — is the project worth doing?
- Produce the **requirements specification**, agreed with the client.
:::

:::compare Feasibility study (TELOS)
| Type | Question it answers |
|---|---|
| **T**echnical | Do the hardware, software and skills exist to build it? |
| **E**conomic | Do the benefits outweigh the costs? Is it within the budget? |
| **L**egal | Does it follow the law (e.g. personal data protection)? |
| **O**perational | Will the users actually be able and willing to use it? |
| **S**chedule | Can it be finished by the deadline? |
:::

:::example A requirements specification (extract) — online library
1. The system must allow students to **search** books by title, author or ISBN.
2. The system must let librarians **record loans and returns** by scanning barcodes.
3. The system must **email a reminder** two days before a book is due.
4. A search must return results in **under 2 seconds**.
5. Only staff accounts may **edit** book records.
:::

:::tip
Requirements must be **specific and testable** — they are used again at the evaluation stage to decide whether the project succeeded.
:::

# Stages 2 and 3 — Design, development and testing
@lo 11.2.1.1

## Design

The designer decides **how** the system will meet the requirements — before any code is written.

:::compare What is designed
| Item | Design documents |
|---|---|
| Data and storage | ERD, normalised tables, **data dictionary** (field names, types, sizes, validation rules) |
| Processes | Flowcharts, pseudocode, **data flow diagrams** |
| Inputs and outputs | Screen layouts, input forms, report layouts, **prototypes** |
| User interface | Navigation structure, menus, colour scheme |
| Validation and security | Validation rules, access levels, passwords, backups |
| Testing | **Test plan** with normal, boundary and erroneous data and expected results |
:::

## Development and testing

Programmers **build** the system from the design: write the code, create the database, connect the interface. Testers then check it.

:::compare Kinds of testing
| Testing | What it checks |
|---|---|
| Unit testing | Each module / function on its own |
| Integration testing | Modules working together |
| System testing | The whole system against the requirements |
| **Alpha testing** | By the developers' own team, in-house, before release |
| **Beta testing** | By a limited group of **real users** in real conditions, before full release |
| **Acceptance testing** | By the **client**, to confirm the system meets the requirements before it is accepted |
:::

:::callout info Test data
Each test uses **normal** (valid, typical), **boundary/extreme** (at the limits) and **erroneous** (invalid) data, recorded in the test plan with the **expected** and the **actual** result.
:::

# Stages 4–6 — Implementation, documentation, evaluation and maintenance
@lo 11.2.1.1

## Implementation

The new system is **installed and put into use**: hardware and software are installed, existing data is **converted and transferred**, and users are **trained**. A changeover method is chosen:

:::compare Changeover methods
| Method | How |
|---|---|
| Direct | Old system stopped, new one started at once |
| Parallel | Both run together for a time; results compared |
| Pilot | New system used in one part of the organisation first |
| Phased | New system introduced one module at a time |
:::

## Documentation

:::compare Two kinds of documentation
| | Technical documentation | User documentation (user guide) |
|---|---|---|
| For | Developers, maintenance programmers, technicians | The people who use the system |
| Contents | Program code with comments, algorithms, data dictionary, ERD/DFDs, hardware and software requirements, test results | How to install and log in, how to carry out each task, screenshots, error messages and what to do, FAQ, backup procedures, troubleshooting |
| Purpose | To **maintain and update** the system | To **use** the system correctly |
:::

## Evaluation

The finished system is compared with the **requirements specification**: Does it do everything it should? Is it fast, reliable and easy to use? User feedback is collected; strengths, weaknesses and improvements are recorded.

## Maintenance

:::cards
### Corrective
Fixing **bugs** found after the system is in use.
### Adaptive
Changing the system to fit a **new environment** — a new OS, new law, new tax rate, new hardware.
### Perfective
**Improving** the system — new features, better performance or interface, at the users' request.
:::

:::tip
"Name the stage" questions use key words: *feasibility, requirements* → **analysis**; *ERD, data dictionary, test plan, screen layout* → **design**; *coding, testing* → **development**; *training, data transfer, changeover* → **implementation**; *user guide* → **documentation**; *compare with requirements, bug fixes* → **evaluation and maintenance**.
:::

# The waterfall model
@lo 11.2.1.2

:::definition Waterfall model
A **linear, sequential** model: the stages are carried out **one after another, in a fixed order**. Each stage must be **completed and signed off** before the next starts, and the project does not normally go back to an earlier stage.
:::

:::mermaid Waterfall — each stage flows down into the next
flowchart TB
  R[Requirements and analysis] --> D[Design] --> I[Implementation — coding] --> V[Testing] --> P[Deployment] --> M[Maintenance]
:::

## Characteristics

- Each stage produces **complete documentation** (requirements, design documents) before the next stage begins.
- **Milestones** at the end of each stage make progress easy to measure.
- The client is involved mainly **at the beginning** (requirements) and **at the end** (acceptance).
- **Testing happens late**, after all the code is written.

:::compare Waterfall
| Advantages | Disadvantages |
|---|---|
| **Simple** to understand, plan and manage | **Inflexible** — changing requirements later is difficult and expensive |
| Clear **structure**: a stage is completed before the next one starts | The client sees a **working product only at the end** |
| Each stage has **clear deliverables and milestones** | Errors in requirements or design are found **late**, during testing |
| **Cost and time** are easier to estimate | Long projects risk delivering a system that no longer fits the users' needs |
| Thorough **documentation** helps maintenance and new staff | Little user involvement during development |
| Suits projects with **clear, fixed requirements** | Not suitable for complex projects where requirements are uncertain |
:::

:::example When waterfall fits
A ministry orders a system to calculate a new tax: the rules are **fixed by law**, the requirements are clear from the start, and **detailed documentation** is required. Waterfall is suitable.
:::

# The agile model
@lo 11.2.1.2

:::definition Agile model
An **iterative and incremental** approach: the system is built in **short cycles (iterations or sprints)**, usually 1–4 weeks. Each cycle delivers a **working part** of the system, which the client reviews; the plan is adjusted after every cycle.
:::

:::mermaid Each sprint repeats plan, design, build, test and review
flowchart TB
  B[(Product backlog)] --> P[Sprint planning]
  P --> W[Design, build, test]
  W --> R[Sprint review with the client]
  R --> RE[Retrospective]
  RE --> P
  R --> S[Working increment of the software]
:::

## Values of agile (Agile Manifesto)

:::compare Agile values
| Agile values more … | … than |
|---|---|
| Individuals and interactions | Processes and tools |
| Working software | Comprehensive documentation |
| Customer collaboration | Contract negotiation |
| Responding to change | Following a fixed plan |
:::

## Scrum — a popular agile method

:::cards
### Roles
**Product owner** — represents the client, decides priorities. **Scrum master** — removes obstacles, keeps the process. **Development team** — designs, builds and tests.
### Artefacts
**Product backlog** — prioritised list of all wanted features (user stories). **Sprint backlog** — the features chosen for this sprint. **Increment** — working software at the end of the sprint.
### Events
**Sprint planning**, a short **daily stand-up** meeting (what I did, what I will do, problems), **sprint review** with the client, **retrospective** (how to work better).
:::

:::example A user story
"As a **student**, I want to **see my homework for the week** so that **I can plan my time**." The team estimates it, builds it in one sprint and shows it to the teacher at the review.
:::

:::compare Agile
| Advantages | Disadvantages |
|---|---|
| **Flexible** — requirements can change between sprints | Final **cost and deadline are hard to predict** |
| The client is **involved throughout** and gives regular feedback | Needs the client to be **available often** |
| **Working software early** — the most important features first | **Less documentation**, which can make maintenance harder |
| Problems and misunderstandings are found **early** | Scope may keep growing ("scope creep") |
| Motivated team, continuous improvement | Needs an experienced, self-organised team; hard for very large teams |
:::

# The spiral model
@lo 11.2.1.2

:::definition Spiral model
A **risk-driven, iterative** model (Barry Boehm, 1986). The project goes round a **spiral of loops**; every loop passes through **four phases**, and each loop produces a **more complete prototype** until the final system is built.
:::

:::steps The four phases of each loop
- **Determine objectives** — requirements and alternatives for this loop.
- **Identify and resolve risks** — analyse what could go wrong (technical, cost, schedule); build a **prototype** or run a study to reduce the risk.
- **Develop and test** — design, code and test the next version.
- **Plan the next iteration** — the client **evaluates** the result; decide whether and how to continue.
:::

:::mermaid Every loop passes through the four phases; each new loop builds a more complete version
flowchart TB
  O[1 Objectives] --> R[2 Risk analysis + prototype]
  R --> D[3 Develop and test]
  D --> P[4 Evaluate and plan]
  P -- next loop --> O
  P -- complete --> F([Final system])
:::

:::compare Example — three loops for an online banking app
| Loop | Main risk analysed | Result of the loop |
|---|---|---|
| 1 | Will customers understand and accept the idea? | Paper/screen **prototype** of the main screens, approved by the client |
| 2 | Is the payment process secure and fast enough? | Working prototype of log-in and payments, security tested |
| 3 | Can the system handle thousands of users at once? | Complete system, load-tested and released |
:::

:::compare Spiral
| Advantages | Disadvantages |
|---|---|
| **Risk analysis in every loop** — high-risk problems found early | **Expensive** — risk analysis needs specialists |
| Suitable for **large, complex and high-risk** projects | **Complex** to manage |
| **Prototypes** give early client feedback | The number of loops — and so the end date — is uncertain |
| Requirements can be refined in each loop | **Not cost-effective for small projects** |
| Changes can be added in later loops | Success depends heavily on good risk analysis |
:::

# Comparing and choosing a model
@lo 11.2.1.2

:::compare Waterfall vs agile vs spiral
| Criterion | Waterfall | Agile | Spiral |
|---|---|---|---|
| Structure | Linear, sequential | Iterative, incremental sprints | Iterative loops driven by risk |
| Requirements | Fixed at the start | Can change every sprint | Refined in each loop |
| Client involvement | Start and end | Continuous | At the end of each loop |
| Working product | At the end | After every sprint | Prototype after each loop |
| Testing | After coding | In every sprint | In every loop |
| Documentation | Detailed | Minimal | Detailed, including risk reports |
| Risk management | Little | Through short cycles and feedback | **Central** — every loop |
| Cost/time predictability | High | Low | Low–medium |
| Best for | Small/medium projects with clear, stable requirements | Projects with changing requirements and an available client | Large, expensive, high-risk projects |
:::

:::compare Choosing a model for a scenario
| Scenario | Model | Reason |
|---|---|---|
| A school library system; the requirements are fully known and will not change | **Waterfall** | Clear requirements; simple to manage and document |
| A start-up's mobile app; features change after users try each version | **Agile** | Frequent change and feedback; early releases |
| A new air-traffic control or banking payment system | **Spiral** | Very high risk and cost; risk analysis in every loop |
| A government system whose rules are set by law and need full documentation | **Waterfall** | Fixed requirements; documentation required |
| A school app for teachers who want to see each feature and suggest changes | **Agile** | Users involved throughout |
:::

:::example Exam-style answers
**Q: Name two benefits of using a waterfall model. [2]**
1. It has a **clear structure** — each stage is **completed before** the next begins.
2. It is **easy to manage**, with **clear milestones** and documentation for every stage.

**Q: Explain one disadvantage of the agile model for a client. [2]**
The client must **take part in reviews regularly** throughout the project (1), **which takes up a lot of their time** / and the final cost is hard to predict because requirements keep changing (1).

**Q: Explain why the spiral model is suitable for developing software for a bank. [2]**
The project is **high-risk and expensive** (1), and the spiral model **analyses and reduces risks in every loop** using prototypes before the full system is built (1).
:::

:::warning Common mistakes
- Saying agile has **no** planning or documentation — it has **less**, and plans each sprint.
- Confusing **prototyping** with agile: prototypes are used in several models (especially spiral).
- Giving an advantage without linking it to the **scenario** when the question describes one.
:::

:::steps Check yourself
- List the six SDLC stages in order and one output of each.
- What does each letter of TELOS stand for?
- What is the difference between alpha, beta and acceptance testing?
- Give one advantage and one disadvantage of each model.
- Which model would you choose for a project with very high risk? Why?
:::
