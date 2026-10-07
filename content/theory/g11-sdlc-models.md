---
summary: The stages of the system development life cycle and the advantages and disadvantages of the waterfall, agile and spiral development models.
---
# Stages of the system development life cycle
@lo 11.2.1.1

:::definition System development life cycle (SDLC)
A structured sequence of stages followed when a new information system is planned, built, introduced and maintained.
:::

:::mermaid The SDLC is a cycle — evaluation can start a new project
flowchart LR
  A[Analysis] --> B[Design] --> C[Development and testing] --> D[Implementation] --> E[Documentation] --> F[Evaluation and maintenance]
  F --> A
:::

:::compare What happens at each stage
| Stage | Main activities | Outputs |
|---|---|---|
| Analysis | Study the current system; collect information (interviews, questionnaires, observation, documents); identify problems; produce requirements; feasibility study | Requirements specification, feasibility report |
| Design | Design inputs, outputs, processes, data structures, file/database structure, interface, validation and test plan | DFDs, flowcharts, ERD, data dictionary, screen layouts, test plan |
| Development and testing | Write the program code / build the database; test with normal, boundary and erroneous data | Working, tested system |
| Implementation | Install hardware and software, transfer data, train users; choose a changeover method (direct, parallel, pilot, phased) | System in use |
| Documentation | Write the **technical** documentation (for developers) and the **user** guide | Technical manual, user manual |
| Evaluation and maintenance | Compare the system with the requirements; get user feedback; fix bugs, add features, adapt to changes | Evaluation report, updates |
:::

:::tip
Learn the order of the stages and **one key activity** for each — "state the stage in which…" questions are very common.
:::

# Waterfall, agile and spiral models
@lo 11.2.1.2

## Waterfall model

Stages are completed **one after another in a fixed order**; each stage must be finished and signed off before the next starts, and it is hard to go back.

:::mermaid Waterfall
flowchart TB
  R[Requirements] --> D[Design] --> I[Implementation] --> V[Testing] --> M[Maintenance]
:::

:::compare Waterfall
| Advantages | Disadvantages |
|---|---|
| Simple to understand and manage | Inflexible — changes are hard and expensive once a stage is finished |
| Clear milestones and documentation at each stage | The client sees the working product only at the end |
| Easy to estimate cost and time | Problems found late (testing happens near the end) |
| Good when requirements are clear and stable | Not suitable for long, complex projects with changing requirements |
:::

## Agile model

Work is split into short **iterations (sprints)** of 1–4 weeks. Each sprint produces a working part of the system that the client reviews; requirements can change between sprints.

:::compare Agile
| Advantages | Disadvantages |
|---|---|
| Flexible — adapts to changing requirements | Final cost and deadline are hard to predict |
| Client is involved and gives feedback regularly | Needs constant communication and client availability |
| Working software is delivered early and often | Less documentation |
| Problems are found early | Scope can grow uncontrollably; needs an experienced team |
:::

## Spiral model

Development goes round a spiral several times. Each loop has four phases: **planning → risk analysis → engineering (build and test) → evaluation by the client**. Each loop produces a more complete prototype.

:::mermaid One loop of the spiral
flowchart LR
  P[Plan objectives] --> R[Analyse risks] --> E[Engineer: build and test] --> C[Client evaluation] --> P
:::

:::compare Spiral
| Advantages | Disadvantages |
|---|---|
| Strong **risk management** — risks found and reduced early | Expensive; risk analysis needs experts |
| Suitable for large, complex, high-risk projects | Complex to manage |
| Prototypes allow early client feedback | Can go on for many loops; end date unclear |
| Requirements can be refined each loop | Not worth it for small projects |
:::

:::compare Choosing a model
| Project | Suitable model | Why |
|---|---|---|
| Small school library system with fixed requirements | Waterfall | Requirements known; simple to manage |
| A start-up's mobile app where features change often | Agile | Frequent feedback and changes |
| Software for a bank's new payment system | Spiral | High risk; risk analysis in every loop |
:::

:::tip
The examiner often asks for benefits of the waterfall model: "**clear structure**", "a stage is **completed before** moving to the next", "**easy to manage and document**", "**cost and time can be estimated**".
:::
