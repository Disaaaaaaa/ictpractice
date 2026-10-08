---
summary: Methods of collecting information about a system, qualitative and quantitative analysis, comparing alternative solutions and writing system requirements.
---
# Why the analyst collects information
@lo 11.2.1.3

Before a new system can be designed, the **systems analyst** must understand how the **current system** works, what is wrong with it and what the people who will use the new system need. This is called **fact-finding** and happens in the **analysis** stage of the SDLC.

:::cards
### What the analyst wants to find out
- The **inputs, processes, outputs and storage** of the current system.
- The **problems**: slow processes, errors, lost data, queues, duplicated work.
- The **needs** of each group of users.
- The **volume** of data (how many orders, customers, records per day).
- **Constraints**: budget, deadline, hardware, laws.
### Who the analyst asks (stakeholders)
- The **client** / manager who pays for the system.
- The **end users** who will work with it every day.
- **Customers** affected by it (students, patients, shoppers).
- **Technical staff** who will maintain it.
:::

:::mermaid From fact-finding to a requirements specification
flowchart LR
  F[Fact-finding: questionnaires, interviews, observation, documents] --> A[Analyse the data: quantitative and qualitative]
  A --> P[Identify problems and needs]
  P --> O[Compare alternative solutions]
  O --> R[Requirements specification]
:::

:::tip
The four fact-finding methods named in the specification are **questionnaires**, **interviews**, **observation** and **examining (analysing) existing documents**. Learn at least two advantages and two disadvantages of each.
:::

# Questionnaires
@lo 11.2.1.3

:::definition Questionnaire (survey)
A set of written questions given to **many people** — on paper or online (e.g. Google Forms). Answers are collected and analysed later.
:::

:::compare Types of question
| Type | Example | Gives |
|---|---|---|
| Closed — yes/no | "Have you ever lost a library book? Yes / No" | Quantitative data, easy to count |
| Closed — multiple choice | "How do you pay for lunch? Cash / Card / Kaspi QR" | Quantitative data |
| Rating (Likert) scale | "The queue is too long: 1 strongly disagree … 5 strongly agree" | Quantitative data about opinions |
| Open | "What would you change about the canteen?" | Qualitative data, detailed but harder to analyse |
:::

:::steps Designing a good questionnaire
- Decide exactly **what you need to find out**.
- Use **short, clear** questions — one idea per question; avoid technical words.
- Avoid **leading** questions ("Don't you agree the old system is terrible?").
- Use mostly **closed** questions (easy to analyse) and a few **open** ones for detail.
- Keep it **short** so people finish it; explain its purpose and keep it **anonymous** if possible.
- **Test** it on a few people first (pilot) and correct unclear questions.
:::

:::compare Questionnaires
| Advantages | Disadvantages |
|---|---|
| Reaches **many people** quickly and **cheaply** | Often a **low response rate** — many people do not reply |
| Can be **anonymous**, so people may answer **honestly** | Questions **cannot be explained** — they may be misunderstood |
| Closed answers are **quick to analyse** (counts, percentages, charts) | **Limited depth** — no follow-up questions; complex views are hard to capture |
| People answer **in their own time** | People may give careless or untrue answers |
| Online forms collect and total the answers automatically | Designing good questions takes time |
:::

# Interviews, observation and examining documents
@lo 11.2.1.3

## Interviews

:::definition Interview
A **face-to-face (or online) conversation** in which the analyst asks one person or a small group questions about the system.
:::

:::cards
### Structured
The same prepared questions in the same order for everyone — easy to compare answers.
### Semi-structured
Prepared questions plus **follow-up** questions depending on the answers — the most common type.
### Unstructured
An open conversation about the topic — very detailed but hard to compare and analyse.
:::

:::compare Interviews
| Advantages | Disadvantages |
|---|---|
| **Detailed** answers; the analyst can ask **follow-up** questions | **Time-consuming** — only a **few people** can be interviewed |
| Questions can be **explained** if they are not understood | **Expensive** — the analyst's and the interviewee's time |
| The analyst can see **reactions** and body language | Not anonymous, so people may **not be honest** or may say what the boss wants to hear |
| Good for **key people** (manager, expert user) | Answers depend on the interviewer's skill; notes are hard to analyse |
:::

## Observation

:::definition Observation
The analyst **watches** users doing their work with the current system and records what happens (e.g. how long tasks take, what problems occur).
:::

:::compare Observation
| Advantages | Disadvantages |
|---|---|
| Shows what **really** happens, not what people say happens | People may **behave differently** when they know they are watched |
| **Reliable, first-hand** information — e.g. times and errors | **Time-consuming**; rare events may not be seen |
| Finds problems users do not notice or forget to mention | Some people feel uncomfortable being watched |
| No need to interrupt the work | Does not show users' opinions or reasons |
:::

## Examining existing documents

:::definition Examining documents (document analysis)
Studying the **paper and electronic documents** of the current system — forms, invoices, receipts, reports, spreadsheets, manuals, logs.
:::

:::compare Examining documents
| Advantages | Disadvantages |
|---|---|
| Shows the exact **data items** used — input and output formats for design | Documents may be **out of date**, incomplete or inaccurate |
| **Quick** and cheap; does not disturb staff | Does **not show opinions** or problems users feel |
| Shows the **volume** of data (e.g. 300 orders per day) | Can be hard to understand without explanations |
| Gives facts for the data dictionary and screen layouts | Some documents may be confidential |
:::

## Comparing the four methods

:::compare
| Criterion | Questionnaire | Interview | Observation | Documents |
|---|---|---|---|---|
| Number of people | Many | Few | Few | — |
| Cost | Low | High | Medium | Low |
| Time | Short to collect | Long | Long | Short |
| Depth of information | Low | High | Medium | Medium (facts only) |
| Honesty | High (anonymous) | May be lower | Shows real behaviour | Facts |
| Main type of data | Quantitative | Qualitative | Both | Mostly quantitative |
:::

:::example Choosing a method
- 600 students' opinions about the canteen → **questionnaire** (many people, cheap, anonymous).
- The director's needs for new reports → **interview** (one key person, detail and follow-up).
- How long librarians take to issue a book → **observation** (real times).
- Which data is written on current loan cards → **examining documents** (exact data items).
:::

:::tip
When a question asks for disadvantages of **two** methods, each answer must be specific to **that** method: "Interview: time-consuming, so **only a few people** can be interviewed" — not a general point that applies to both.
:::

# Qualitative and quantitative analysis
@lo 11.2.1.4

:::cards
### Quantitative data
**Numbers**: counts, measurements, ratings, times. Answers "**how many / how much / how often?**". Collected by closed questions, counting and measuring (observation, documents, logs).
### Qualitative data
**Words**: opinions, descriptions, feelings, reasons. Answers "**why / how do people feel?**". Collected by open questions, interviews and observation notes.
:::

## Analysing quantitative data

Techniques: **tallying** and frequency tables, **totals**, **percentages**, **mean / median / mode**, **range**, and **charts** (bar, pie, line).

:::example Canteen survey — 200 students answered "How long do you usually wait in the queue?"
| Waiting time | Students | Percentage |
|---|---|---|
| Under 5 minutes | 36 | 36 ÷ 200 × 100 = **18%** |
| 5–10 minutes | 94 | **47%** |
| Over 10 minutes | 70 | **35%** |
| **Total** | **200** | **100%** |

**Conclusion:** 82% of students wait 5 minutes or more — long queues are a major problem the new system must solve.
:::

:::mermaid Waiting time in the canteen queue (200 students)
pie
  "Under 5 min" : 36
  "5–10 min" : 94
  "Over 10 min" : 70
:::

## Analysing qualitative data

**Thematic analysis**: read all the answers, group similar comments into **themes**, count how often each theme appears, and pick **typical quotations**.

:::example Open question "What would you change about the canteen?" — 120 comments
| Theme | Comments | Typical quote |
|---|---|---|
| Long queues / waiting | 54 | "I spend half the break in the queue." |
| Food sold out | 31 | "My favourite meal is always finished." |
| Paying is slow | 22 | "Cash payment takes ages." |
| Other | 13 | — |

The themes suggest requirements: **pre-ordering**, **showing what is still available**, and **cashless payment**.
:::

:::compare Comparing the two kinds of analysis
| | Quantitative | Qualitative |
|---|---|---|
| Data | Numbers | Words, opinions |
| Typical methods | Closed questions, counting, measuring | Open questions, interviews, observation notes |
| Analysis | Statistics, percentages, charts | Grouping into themes, quotations |
| Advantages | Objective, quick to analyse, easy to compare and show in charts, large samples | Rich detail; explains **reasons** and motives; finds unexpected problems |
| Disadvantages | No reasons or context — says *what*, not *why* | Subjective, slow to analyse, small samples, hard to compare |
:::

:::callout info Use both
Analysts usually **combine** both: numbers show **how big** a problem is; words explain **why** it happens. Checking one method's results against another is called **triangulation**.
:::

# Using data collection to develop a new system
@lo 11.2.1.5

:::steps From collected data to the new system
- **Plan** the fact-finding: what to find out, from whom, with which method.
- **Collect** the data (questionnaires, interviews, observation, documents).
- **Analyse** it — quantitative (counts, percentages) and qualitative (themes).
- **Describe the current system**: inputs, processes, outputs, storage (often as a DFD).
- List the **problems** of the current system and the **needs** of each user group.
- Turn each problem and need into a **requirement** for the new system.
- Agree the requirements with the client.
:::

:::compare Example — school library: from findings to requirements
| Finding (method) | Problem | Requirement for the new system |
|---|---|---|
| Observation: issuing a book takes 3 minutes on paper cards | Slow issuing, queues | The system must issue a book by **scanning barcodes** in under 10 seconds |
| Documents: 15% of loan cards have missing return dates | Lost / incomplete data | The system must **record the loan date and due date automatically** |
| Questionnaire: 64% of students forget return dates | Late returns | The system must **send a reminder** two days before a book is due |
| Interview with the librarian: needs a monthly report of popular books | No reports | The system must produce a **monthly report** of the most borrowed books |
:::

:::tip
A strong answer always links **method → finding → requirement**. Examiners reward requirements that clearly come **from the scenario**.
:::

# Comparing alternative solutions
@lo 11.2.1.6

There is usually more than one way to solve a problem. The analyst lists the alternatives and compares them against the requirements before recommending one.

:::cards
### Typical alternatives
- Buy **off-the-shelf** software.
- Have **bespoke** software written.
- **Adapt** existing software (e.g. a spreadsheet or database template).
- **Improve the manual** system without computerising it.
- Use a **cloud / online service** (subscription).
### Criteria for comparing
- How well it meets the **requirements**.
- **Cost** — buying, development, training, running.
- **Time** to introduce it.
- **Hardware** and compatibility with existing systems.
- **Ease of use** and training needed.
- **Support**, security, reliability, future growth.
:::

## Weighted scoring

Each criterion gets a **weight** (how important it is); each solution gets a **score** (1–5) for every criterion; score × weight are added up. The highest total is the best solution.

:::compare Sports-centre booking system — weighted scoring
| Criterion (weight) | Off-the-shelf | Bespoke web app | Improved paper system |
|---|---|---|---|
| Cost (3) | 4 × 3 = 12 | 2 × 3 = 6 | 5 × 3 = 15 |
| Fit to requirements (5) | 3 × 5 = 15 | 5 × 5 = 25 | 1 × 5 = 5 |
| Time to introduce (2) | 5 × 2 = 10 | 2 × 2 = 4 | 5 × 2 = 10 |
| Support (2) | 4 × 2 = 8 | 3 × 2 = 6 | 2 × 2 = 4 |
| **Total** | **45** | **41** | **34** |
:::

**Recommendation:** off-the-shelf booking software scores highest (45). If online booking that matches the centre's needs *exactly* were essential, the weight of "fit to requirements" could be raised — then the bespoke app might win. The weights must come from the client's priorities.

:::callout info Feasibility (TELOS)
Each alternative is also checked for **T**echnical, **E**conomic, **L**egal, **O**perational and **S**chedule feasibility. An alternative that fails one of them (e.g. too expensive, cannot be ready in time) is rejected.
:::

## Comparing algorithms

Alternative solutions can also be **different algorithms** for the same task. They are compared by **correctness**, **time efficiency** (number of steps), **space efficiency** (memory) and **ease of implementation**.

:::example Searching 10 000 book records by ID
- **Linear search**: works on unsorted data, but up to **10 000** comparisons.
- **Binary search**: data must be **sorted**, but at most **14** comparisons (2¹⁴ = 16 384 ≥ 10 000).
- Since searches happen hundreds of times a day and records are added rarely, keeping the records **sorted and using binary search** is the more effective solution.
:::

# Writing system requirements
@lo 11.2.1.8@paper

:::definition Requirements specification
The agreed list of **what the new system must do** and **the conditions it must meet**. It guides the design and is used at the end to **evaluate** the system.
:::

:::cards
### Functional requirements
What the system must **do** — its functions. "The system must allow teachers to **add and delete** student records." "The system must **email** a weekly report to parents."
### Non-functional requirements
**How well** it must work — performance, security, usability, reliability. "A search must return results in **under 2 seconds**." "Only staff with a password can **edit** marks."
### Hardware and software requirements
What is needed to run it. "Runs on **Android 10** or later." "The server needs at least **8 GB RAM**."
:::

:::compare Good and poor requirements
| Poor | Why it is poor | Better |
|---|---|---|
| "The app should be fast." | Not measurable | "The timetable must load in under 3 seconds." |
| "The system should be easy to use." | Vague | "A new user must be able to place an order without training in under 2 minutes." |
| "Keep data safe." | Not testable | "Each user must log in with a username and a password of at least 8 characters." |
| "The system will use MySQL." | A design decision, not a need | "The system must store records of at least 2000 students." |
:::

:::steps Writing requirements from a scenario
- Underline every **task** the users do and every **problem** mentioned.
- Write each as "The system **must** …" with **one** function per requirement.
- Add **measurable** values where possible (time, number, size).
- Include **security** and **usability** needs.
- Check that each requirement can be **tested** at the evaluation stage.
:::

:::example Requirements from a scenario (Paper 2 style)
*A student wants to develop a mobile app for schoolteachers to keep records of classroom achievements and homework, which are currently kept manually. Teachers should be able to add and delete students, assign homework to classes and send records to students and parents.*

1. The app must allow teachers to **add and delete student records**.
2. The app must allow teachers to **assign homework to a class**.
3. The app must **send** records and results to students and parents automatically.
4. The app must let teachers **record achievements** for each lesson.
5. Each teacher must **log in** with a password so that only they can change their classes' records.
:::

:::callout info Priorities — MoSCoW
Requirements are often labelled **M**ust have, **S**hould have, **C**ould have, **W**on't have (this time), so the most important ones are built first.
:::

# Exam practice
@lo 11.2.1.3, 11.2.1.4, 11.2.1.8@paper

:::example Model answers
**Q: State two disadvantages of using questionnaires and two disadvantages of using interviews when collecting data. [4]**
- Questionnaire 1: low response rate — many people do not return it (1).
- Questionnaire 2: questions cannot be explained, so they may be misunderstood (1).
- Interview 1: time-consuming, so only a few people can be interviewed (1).
- Interview 2: not anonymous, so people may not give honest answers (1).

**Q: State one advantage of analysing existing documentation. [1]**
It shows the exact data items and formats used by the current system (1).

**Q: Explain why an analyst might use both quantitative and qualitative data. [2]**
Quantitative data shows how many people have a problem / how big it is (1), and qualitative data explains why the problem happens / users' reasons (1).
:::

:::warning Common mistakes
- Writing the same disadvantage for two different methods ("it takes time").
- Calling a closed question "qualitative" — closed answers give **quantitative** data.
- Writing vague requirements ("the system should be good") instead of specific, testable ones.
- Forgetting to link the answer to the **scenario** in the question.
:::

:::steps Check yourself
- Name the four fact-finding methods and give one advantage and one disadvantage of each.
- What is the difference between an open and a closed question?
- 45 of 180 students chose "card payment". What percentage is that? (25%)
- What is the difference between a functional and a non-functional requirement?
- Rewrite "the system must be quick" as a testable requirement.
:::
