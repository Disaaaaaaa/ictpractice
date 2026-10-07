---
summary: Methods of collecting information about a system, qualitative and quantitative analysis, comparing alternative solutions and writing system requirements.
---
# Data collection methods
@lo 11.2.1.3

During **analysis**, the analyst collects information about how the current system works and what users need.

:::compare The four main methods
| Method | Advantages | Disadvantages |
|---|---|---|
| **Questionnaire** | Many people at low cost; anonymous so answers may be honest; quick to analyse (closed questions) | Low response rate; questions cannot be explained; limited depth — no follow-up |
| **Interview** | Detailed answers; follow-up questions; analyst can explain questions | Time-consuming and expensive; few people; interviewee may not be honest; not anonymous |
| **Observation** | See what really happens; reliable first-hand information | People may behave differently when watched; time-consuming; may miss rare events |
| **Examining documents** | Shows data used (forms, reports, invoices); quick to understand inputs/outputs | Documents may be out of date or incomplete; does not show opinions |
:::

:::example Choosing a method
- 600 students' opinions about the canteen → **questionnaire** (many people, cheap).
- The school director's needs for a new report → **interview** (one key person, detail needed).
- How librarians actually issue books → **observation**.
- What data appears on current library cards → **examining documents**.
:::

:::tip
Questions often ask for disadvantages of questionnaires *and* interviews separately — make sure each answer refers to **that** method (e.g. interview: "time-consuming, so only a few people can be interviewed").
:::

# Qualitative and quantitative analysis
@lo 11.2.1.4

:::compare
| | Quantitative | Qualitative |
|---|---|---|
| Data | Numbers, measurements, counts | Words, opinions, descriptions, feelings |
| Collected by | Closed questions, counting, measuring, logs | Open questions, interviews, observation notes |
| Analysed by | Statistics: totals, averages, percentages, charts | Finding themes and patterns in answers |
| Answers | "How many?", "How often?", "How much?" | "Why?", "How do people feel?" |
| Advantages | Objective, easy to compare and graph, large samples | Rich detail; explains reasons and motives |
| Disadvantages | Lacks reasons/context | Subjective, harder to analyse, small samples |
| Example | "72% of users wait more than 5 minutes" | "Users say the menu is confusing" |
:::

# Using data collection to develop a new system
@lo 11.2.1.5

:::steps From collected data to a requirement
- Decide **what you need to know** (inputs, outputs, processes, problems, users' needs).
- Choose suitable **methods** for each group of people.
- Collect the data (questionnaire, interviews, observation, documents).
- **Analyse** it — count closed answers (quantitative) and group open answers into themes (qualitative).
- Identify the **problems** of the current system and the **needs** of users.
- Write the **requirements specification** for the new system.
:::

# Comparing alternative solutions
@lo 11.2.1.6

There is usually more than one way to solve a problem, e.g. buy off-the-shelf software, have bespoke software written, or improve the paper system. The analyst compares them against criteria.

:::compare Example: a new booking system for a sports centre
| Criterion | Off-the-shelf booking software | Bespoke web application | Improved paper system |
|---|---|---|---|
| Initial cost | Medium (licence) | High | Low |
| Time to introduce | Short | Long | Very short |
| Fit to requirements | Partial | Exact | Poor |
| Online booking | Yes | Yes | No |
| Maintenance | By supplier | By developer (paid) | Staff |
:::

:::callout info Feasibility
Alternatives are judged on **technical** (can it be built?), **economic** (cost vs benefit), **legal**, **operational** (will users use it?) and **schedule** (time) feasibility.
:::

# Writing system requirements
@lo 11.2.1.8@paper

:::definition Requirements specification
A list of what the new system **must do** and **the conditions** it must meet, agreed with the client. It is used to design the system and later to evaluate it.
:::

:::cards
### Functional requirements
What the system must **do**. "The system must allow teachers to add and delete student records." "The system must email a weekly report to parents."
### Non-functional requirements
**How well** it must work: performance, security, usability, reliability. "A search must return results within 2 seconds." "Only staff with a password can edit marks."
### Hardware and software requirements
What is needed to run it: "Runs on Android 10 or later", "Needs 4 GB RAM".
:::

:::example Requirements from a scenario
*Scenario: teachers record homework and achievement manually and want an app to share results with students and parents.*
1. The app must allow teachers to **add, edit and delete** student records.
2. The app must allow teachers to **assign homework** to a class.
3. The app must **send results** to students and parents automatically.
4. The app must keep data **secure** — each user logs in with a password.
:::

:::tip
Requirements must be **specific and testable** and must come from the scenario. "The app should be good" earns nothing; "The app must allow teachers to send announcements to parents" does.
:::
