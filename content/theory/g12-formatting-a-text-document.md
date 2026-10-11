---
summary: Formatting project documentation professionally — styles and automatic tables of contents, sections and page layout, advanced headers and footers with fields, formatting and numbering footnotes and endnotes, and formatting tables with captions, header rows and cross-references.
---
# Why formatting matters in project documentation
@lo 12.2.1.4 12.2.1.5 12.2.1.6

Project documents are long (often 20–100 pages), are written by several people and change many times. Using the word processor's **automatic formatting tools** instead of formatting text by hand makes a document **consistent**, **easy to navigate** and **quick to update**.

:::compare Manual formatting vs automatic tools
| Task | Manual way (avoid) | Automatic tool (use) |
|---|---|---|
| Headings | Make text bold and bigger each time | **Heading styles** (Heading 1, 2, 3) |
| Contents page | Type chapter names and page numbers | **Automatic table of contents** from heading styles |
| Page numbers | Type a number on each page | **Page-number field** in the footer |
| Notes | Type "1" and a note at the bottom | **Insert Footnote** — numbered automatically |
| Table and figure numbers | Type "Table 3" | **Insert Caption** — renumbered automatically |
| "See Table 3 on page 12" | Type the number and page | **Cross-reference** — updates when items move |
:::

# Styles and the table of contents
@lo 12.2.1.4

:::definition Style
A named set of formatting (font, size, colour, spacing, numbering) that can be applied to text in one click, e.g. **Heading 1**, **Heading 2**, **Normal**, **Caption**. Changing a style **updates all the text** that uses it.
:::

:::cards
### Advantages of styles
- **Consistent** look across the whole document and all authors.
- Change the design of every heading **at once** by modifying the style.
- Headings appear in the **navigation pane** — quick movement through a long document.
- Needed for an **automatic table of contents** and for chapter names in headers.
### Automatic table of contents
- Apply **Heading 1 / 2 / 3** to chapter and section titles.
- **References → Table of Contents**: the contents is built from the headings with page numbers and links.
- After editing, choose **Update Table** — new page numbers appear automatically.
:::

:::example Heading levels in a project report
```text
1  Analysis                          <- Heading 1
1.1  Current system                  <- Heading 2
1.2  Requirements specification      <- Heading 2
2  Design                            <- Heading 1
2.1  Data dictionary                 <- Heading 2
2.1.1  Table Students                <- Heading 3
```
Use **multilevel list numbering** linked to the heading styles so the numbers (1, 1.1, 1.1.1) update when sections are added or moved.
:::

# Page layout and sections
@lo 12.2.1.4

:::compare Page layout settings
| Setting | Use in documentation |
|---|---|
| **Margins** | Space for binding (wider inside margin); standard 2–2.5 cm |
| **Orientation** | **Portrait** for text; **landscape** for wide tables or diagrams (ERD, Gantt chart) |
| **Page break** | Start each main chapter on a new page |
| **Section break** | Change orientation, margins, headers or page-number format for **part** of the document |
| **Columns** | Rarely in reports; sometimes in user leaflets |
| **Line spacing / paragraph spacing** | 1.15–1.5 for readability; space after paragraphs instead of empty lines |
:::

:::example Why section breaks are needed
A report has a title page (no header), a contents section numbered **i, ii, iii**, chapters numbered **1, 2, 3 …**, and an appendix with a **landscape** ERD. Each part is placed in its own **section** (Layout → Breaks → Section Break (Next Page)), and each section can have its own **orientation**, **header text** and **page-number format**.
:::

# Advanced headers and footers
@lo 12.2.1.4

:::compare Header and footer tools
| Tool | What it does |
|---|---|
| **Different first page** | The title page has no header / footer |
| **Different odd & even pages** | Page numbers on the outer edge, document title on even pages and chapter title on odd pages |
| **Link to previous** (on / off) | Off = a new section can have **different** header text |
| **Page number format** | 1, 2, 3 / i, ii, iii / A, B, C; **start at** a chosen number |
| **Fields** | Page, NumPages ("Page 5 of 40"), Date, FileName, Author, **StyleRef** (shows the current Heading 1 automatically) |
| **Position** | Distance of the header / footer from the page edge |
:::

:::example A professional header and footer
| Area | Left | Centre | Right |
|---|---|---|---|
| **Header** | Library Management System | | Design v2.0 — 14.10.2026 |
| **Footer** | Confidential — NIS Astana | Chapter 2: Design *(StyleRef field)* | Page 7 of 40 *(Page / NumPages fields)* |
:::

:::tip Use tab stops or a table for three-part headers
Put left, centre and right text in a header using the **built-in centre and right tab stops**, or an invisible table with three cells, rather than spaces — spaces move when the font changes.
:::

# Formatting footnotes and endnotes
@lo 12.2.1.5

:::compare Footnote options (References → Footnotes dialog)
| Option | Choices | Example use |
|---|---|---|
| **Location** | Bottom of page / below text; end of document / end of section | Footnotes for explanations, endnotes for the reference list |
| **Number format** | 1, 2, 3 / a, b, c / i, ii, iii / *, †, ‡ | Symbols in a short document |
| **Numbering** | Continuous / restart each section / restart each page | Restart in each chapter |
| **Start at** | Any number | Continue numbering from a previous document |
| **Convert** | Footnotes ↔ endnotes | Change the style of the report quickly |
:::

:::cards
### Good practice for footnotes
- Keep them **short** — one or two sentences.
- Place the reference mark **after the punctuation** at the end of the phrase.²
- Use a **consistent citation format** for sources (author, title, year, URL, date accessed).
- Use the **Footnote Text** style so all notes have the same font size (usually 1–2 points smaller than the main text).
### Footnotes for sources in documentation
- Requirements taken from an **interview** with the client: "¹ Interview with the head librarian, 03.10.2026."
- Data taken from a **standard** or law: "² Law of the RK on Personal Data, Article 8."
- A **definition** for users of a user guide: "³ A barcode scanner reads the black-and-white code on a book."
:::

# Formatting tables
@lo 12.2.1.6

:::compare Table formatting tools
| Tool | Purpose |
|---|---|
| **Table styles** | Apply consistent borders, shading and fonts to all tables |
| **Header row** (bold / shaded) + **Repeat header rows** | Column headings visible on every page of a long table |
| **Banded rows** | Alternate shading makes long rows easier to follow |
| **Merge / split cells** | A heading spanning several columns; two columns under one heading |
| **Column width — AutoFit to contents / window** | Columns fit the data and the page |
| **Cell alignment** | Text left, numbers right or centred; vertical centring |
| **Text direction** | Narrow column headings written vertically |
| **"Allow row to break across pages" — off** | A row is never split between two pages |
| **Convert text to table** | Turn tab-separated data into a table |
| **Formula** (Layout → Formula) | Simple totals, e.g. `=SUM(ABOVE)` |
:::

:::cards
### Captions and lists of tables
- **References → Insert Caption** → "Table 1. Test plan for the login form". Table captions usually go **above** the table, figure captions **below** the figure.
- Captions are **numbered automatically** and renumber when tables are added.
- **Insert Table of Figures** creates a list of all tables / figures with page numbers.
### Cross-references
- **References → Cross-reference** inserts text such as "see **Table 4** on page **17**".
- The number and page **update automatically** (right-click → Update Field / press F9).
:::

:::example A well-formatted table
**Table 4.** Test plan for the age field (valid range 11–18)

| No. | Test data | Type | Expected result | Actual result |
|---|---|---|---|---|
| 1 | 15 | Normal | Accepted | Accepted |
| 2 | 11 | Extreme | Accepted | Accepted |
| 3 | 19 | Erroneous | Error message | Error message |

*Numbered caption above the table; bold header row; numbers centred; consistent columns.*
:::

# Exam practice and summary
@lo 12.2.1.4 12.2.1.5 12.2.1.6

:::example Exam-style answers
**Q: Explain why a programmer should use heading styles in the technical documentation. [2]**
All headings are formatted **consistently** and can be changed at once (1), and an **automatic table of contents** can be created from them / headings appear in the navigation pane (1).

**Q: The report's title page should have no header, and the appendix should be landscape. Explain how this can be done. [2]**
Use **Different first page** for the title page (1) and a **section break** before the appendix so that section can have **landscape orientation** (1).

**Q: Explain the advantage of inserting table captions with the Insert Caption tool. [2]**
Captions are **numbered automatically** and **renumbered** if tables are added or removed (1), and a **list of tables / cross-references** can be created and updated automatically (1).

**Q: State two options that can be changed for footnotes. [2]**
**Number format** (1, a, i, *) (1); **numbering restarts** each section / location — bottom of page or end of document (1).
:::

:::warning Common mistakes
- Making headings look like headings with bold and size instead of **heading styles** — the table of contents cannot be generated.
- Pressing Enter many times to reach a new page instead of inserting a **page break**.
- Typing "Table 3" by hand — the numbering breaks when a table is added.
- Forgetting to switch off **Link to previous**, so a change to one section's header changes all of them.
- Splitting a table row across two pages.
:::

:::steps Check yourself
- What is a style and why is it useful?
- How is an automatic table of contents created and updated?
- What is the difference between a page break and a section break?
- Name four fields that can be inserted in a header or footer.
- Describe three footnote options.
- Name six tools for formatting tables.
- What is a cross-reference and why does it update automatically?
:::
