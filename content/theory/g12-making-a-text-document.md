---
summary: Using headers and footers, footnotes and tables when documenting a software project — what each is for, what it should contain, how to insert it in a word processor, and good practice for technical and user documentation.
---
# Documenting a project
@lo 12.2.1.1 12.2.1.2 12.2.1.3

Every software project produces **documentation**: the **requirements specification**, the **design**, the **test plan and results**, **technical documentation** for developers and a **user guide** for the people who will use the system. Good documents are **consistent, easy to navigate and easy to check**. Three word-processing features help with this: **headers and footers**, **footnotes** and **tables**.

:::ascii The parts of a document page
+------------------------------------------------------+
| HEADER  Library System - User Guide v2.1    [logo]   |  <- repeated on every page
+------------------------------------------------------+
|                                                      |
|  3. Borrowing a book                                 |
|                                                      |
|  Scan the student card and then the book's barcode.¹ |  <- footnote reference mark
|                                                      |
|  +-----------+------------------+                    |
|  | Button    | Action           |                    |  <- table
|  +-----------+------------------+                    |
|  | Issue     | Lends the book   |                    |
|  | Return    | Records a return |                    |
|  +-----------+------------------+                    |
|  Table 2. Buttons on the Loans screen                |  <- caption
|  __________                                          |
|  ¹ Use the scanner on the left of the desk.          |  <- footnote text
+------------------------------------------------------+
| FOOTER  © NIS Library 2026            Page 7 of 24   |  <- repeated on every page
+------------------------------------------------------+
:::

:::compare Technical documentation vs user guide
| | Technical documentation | User guide (user documentation) |
|---|---|---|
| Readers | Programmers, maintenance staff, system administrators | The **users** of the system |
| Contents | Algorithms, code listings, data dictionary, ERD, DFD, test plan, hardware/software requirements | Installation instructions, how to carry out tasks, screenshots, error messages and solutions, FAQ, backup procedures |
| Language | Technical | **Simple**, step by step |
:::

# Headers and footers
@lo 12.2.1.1

:::definition Header and footer
A **header** is an area at the **top margin** of every page, and a **footer** an area at the **bottom margin**, whose content is **automatically repeated on every page** (or every page of a section) of the document.
:::

:::compare What headers and footers usually contain
| Item | Typical place | Why it is useful |
|---|---|---|
| **Document title** / project name | Header | The reader always knows which document a page belongs to |
| **Chapter or section name** | Header | Helps the reader find their place |
| **Version number and date** | Header or footer | Shows whether the copy is up to date — vital for project documents that change |
| **Organisation name / logo** | Header | Identifies the owner; looks professional |
| **Page number** ("Page 7 of 24") | Footer | Navigation; matches the table of contents; shows if pages are missing |
| **Author** | Footer | Who to contact about the document |
| **Copyright / confidentiality notice** | Footer | Legal protection; "Confidential — for internal use" |
| **File name / path** | Footer | Where the electronic file is stored |
:::

:::cards
### Advantages
- Entered **once** and appear on **every page** automatically — saves time.
- **Consistent** layout across the whole document.
- **Fields** (page number, date, number of pages) update **automatically** when pages are added.
- Keep important information visible when pages are printed or separated.
### Options in a word processor
- **Different first page** — no header on the title page.
- **Different odd and even pages** — e.g. page numbers on the outside edge for a printed booklet.
- **Sections** — each chapter can have its own header text (e.g. the chapter title).
- Insert **fields**: page number, total pages, date, file name.
:::

:::steps Inserting a header and footer (Microsoft Word / Google Docs)
- **Insert → Header** (or double-click in the top margin) and type the document title and version.
- **Insert → Footer**, then **Insert → Page number** (choose a format such as "Page X of Y").
- Tick **Different first page** if the title page should have no header.
- Close the header/footer area (double-click in the body text or press Esc).
:::

# Footnotes and endnotes
@lo 12.2.1.2

:::definition Footnote
A **note at the bottom of the same page**, linked to a **reference mark** (usually a superscript number¹) in the main text. It gives a **source, explanation or extra detail** without interrupting the main text.
:::

:::definition Endnote
Like a footnote, but all the notes are collected at the **end of the document** (or of a chapter) instead of at the bottom of each page.
:::

:::cards
### What footnotes are used for in project documentation
- **Citing sources** — the book, website or standard a fact comes from (avoids **plagiarism**).
- **Explaining a technical term** or abbreviation for a non-expert reader (e.g. "SQL — Structured Query Language").
- **Extra detail** that would break the flow of the main text (version numbers, exceptions, comments).
- **Cross-references** to another section, appendix or document.
### Why use footnotes rather than brackets in the text
- The main text stays **short and easy to read**.
- The note is on the **same page**, so the reader does not have to search for it.
- Numbering is **automatic** — notes are renumbered when text is added or moved.
:::

:::example Footnotes in a test report
*All tests were run on the school's server¹ using the test data described in the test plan².*

---
¹ Windows Server 2022, 16 GB RAM, PostgreSQL 16.
² See Appendix B, Table 4.
:::

:::steps Inserting a footnote
- Place the cursor where the reference mark should go.
- **References → Insert Footnote** (Word) / **Insert → Footnote** (Google Docs); shortcut **Ctrl + Alt + F** in Word.
- Type the note at the bottom of the page.
- To convert footnotes to endnotes: **References → Footnotes → Convert**.
:::

:::compare Footnotes vs endnotes
| | Footnotes | Endnotes |
|---|---|---|
| Position | Bottom of the **same page** | End of the **document / chapter** |
| Reading | Quick — no need to turn pages | The reader must go to the end |
| Best for | Short explanations, sources the reader needs immediately | Long lists of references; documents with many notes |
:::

# Tables
@lo 12.2.1.3

:::definition Table
An arrangement of information in **rows and columns** of **cells**, used to present related data so that it is **easy to read, compare and find**.
:::

:::compare Tables commonly used in project documentation
| Document | Table | Columns |
|---|---|---|
| Requirements specification | Requirements list | ID, requirement, priority |
| Design | **Data dictionary** | Field name, data type, size, key, validation, description |
| Testing | **Test plan** | Test no., description, test data, type of data, expected result, actual result |
| Project plan | Schedule | Task, start date, end date, person responsible |
| User guide | Buttons / commands | Button, what it does |
| User guide | Troubleshooting | Error message, cause, solution |
:::

:::example A test-plan table
| Test no. | Description | Test data | Type | Expected result | Actual result |
|---|---|---|---|---|---|
| 1 | Valid age accepted | 15 | Normal | Accepted | Accepted ✔ |
| 2 | Lower boundary | 11 | Extreme | Accepted | Accepted ✔ |
| 3 | Out of range | 19 | Erroneous | Error message | Error message ✔ |
| 4 | Wrong type | "ten" | Erroneous | Error message | Program crashed ✘ |
:::

:::cards
### Good practice for tables
- A **header row** with clear column headings (bold, shaded); **repeat the header row** on each page if the table continues.
- A **caption** with a number and title ("Table 3. Test plan for the login form") so it can be referred to in the text.
- **Consistent** alignment: text left, numbers right or centred.
- Use **borders and shading** to make rows easy to follow; avoid too many colours.
- **Merge cells** for headings that span several columns; do not split a row across pages.
- Keep the table **simple** — one type of information per column.
### Inserting and formatting a table
- **Insert → Table**, choose the number of rows and columns.
- **Table Design / Layout** tabs: header row, banded rows, borders, merge and split cells, column width, alignment.
- **Repeat header rows** (Layout → Repeat Header Rows).
- **References → Insert Caption** to number the table automatically.
- **Insert → Table of Figures** creates a list of all tables in the document.
:::

:::compare Why use a table instead of a paragraph?
| Paragraph | Table |
|---|---|
| "Test 1 used 15, which is normal data; the expected result was accepted and it was accepted. Test 2 used 11, an extreme value…" | The same information in rows and columns — each value in its own cell, easy to **scan, compare and check** |
:::

# Exam practice and summary
@lo 12.2.1.1 12.2.1.2 12.2.1.3

:::example Exam-style answers
**Q: A fragment of a page of the "User guide 2025" is shown. Name the element at the top of the page that contains the text "User guide 2025 — page 3". [1]**
**Header.**

**Q: Give two items that need to be included in the user guide. [2]**
**Installation instructions** / the steps required to install the product (1); details of **backup procedures** / required **hardware and software** / how to use each function / **troubleshooting** (1).

**Q: Explain why the programmer should use a footer with page numbers in the technical documentation. [2]**
The page numbers appear **automatically on every page** (1), so readers can **find sections from the table of contents** and notice if pages are **missing** (1).

**Q: Explain one reason for using footnotes in a project report. [2]**
To **cite the source** of information (1) without interrupting the main text, so the report is easy to read and avoids **plagiarism** (1).

**Q: Explain why the test results should be presented in a table. [2]**
Each test's data, expected and actual result are in **separate columns** (1), so they are **easy to compare** and failed tests can be found quickly (1).
:::

:::warning Common mistakes
- Typing the page number by hand on each page instead of inserting a **page-number field**.
- Confusing a **header** (top margin, repeated) with a **heading** (a title in the body text).
- Using footnotes for **main** information — they are for sources and extra detail.
- Tables without **column headings** or **captions**.
- Putting different kinds of data in the same column.
:::

:::steps Check yourself
- What is the difference between a header and a heading?
- List six items that may be placed in a header or footer.
- Why is the version number important in a project document's header?
- What is the difference between a footnote and an endnote?
- Give three uses of footnotes in project documentation.
- Name four tables that appear in project documentation and their columns.
- List five rules for formatting a table well.
:::
