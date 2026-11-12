---
summary: Using headers and footers, footnotes, tables and a table of contents when documenting a software project — what each is for, what it should contain, how to insert it in a word processor, and good practice for technical and user documentation.
---
# Documenting a project
@lo 12.2.1.1 12.2.1.2 12.2.1.3

Every software project produces **documentation**: the **requirements specification**, the **design** (DFDs, ERD, data dictionary), the **test plan and results**, **technical documentation** for developers and a **user guide** for the people who will use the system. Good documents are **consistent, easy to navigate and easy to check**. Four word-processing features help with this: **headers and footers**, **footnotes**, **tables** and a **table of contents**.

:::definition Project documentation
The written documents produced during the system life cycle that **describe the system** — how it was analysed, designed, built and tested (**technical documentation**) and how to install and use it (**user documentation**).
:::

:::svg The parts of a document page
<svg class="td" viewBox="0 0 760 490" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A document page with a header at the top, a heading, a footnote reference mark, a table with a header row and caption, the footnote text at the bottom of the page and a footer with the page number">
  <defs><marker id="tda1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.td .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.td .hf{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.2}
    svg.td .fn{fill:var(--success-soft);stroke:var(--success);stroke-width:1.2}
    svg.td .tb{fill:none;stroke:var(--foreground);stroke-width:1}
    svg.td .th{fill:var(--warning);opacity:.25}
    svg.td .ln{stroke:var(--border);stroke-width:5;stroke-linecap:round}
    svg.td .sep{stroke:var(--muted);stroke-width:1}
    svg.td .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .b{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.td .c{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .p{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.td .g{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.td .w{font:700 12px system-ui,sans-serif;fill:var(--warning)}
    svg.td .r{font:700 12px system-ui,sans-serif;fill:var(--danger)}
    svg.td .ar{fill:none;stroke:var(--muted);stroke-width:1.6}
    svg.td .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.td .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
  </style>
  <rect class="pg" x="150" y="10" width="360" height="470" rx="4"/>
  <rect class="hf" x="150" y="10" width="360" height="40"/>
  <text class="p" x="162" y="35" text-anchor="start">Library System — User Guide v2.1</text>
  <text class="b" x="170" y="82" text-anchor="start">3. Borrowing a book</text>
  <path class="ln" d="M170,102 H490"/>
  <path class="ln" d="M170,116 H450"/>
  <text class="c" x="170" y="140" text-anchor="start">Scan the student card, then the barcode.</text>
  <text class="g" x="410" y="134" text-anchor="start">1</text>
  <path class="ln" d="M170,158 H450"/>
  <rect class="th" x="170" y="176" width="320" height="26"/>
  <rect class="tb" x="170" y="176" width="320" height="104"/>
  <path class="tb" d="M170,202 H490"/>
  <path class="tb" d="M170,228 H490"/>
  <path class="tb" d="M170,254 H490"/>
  <path class="tb" d="M270,176 V280"/>
  <text class="t" x="180" y="194" text-anchor="start">Button</text>
  <text class="t" x="280" y="194" text-anchor="start">What it does</text>
  <text class="c" x="180" y="220" text-anchor="start">Issue</text>
  <text class="c" x="280" y="220" text-anchor="start">Lends the book</text>
  <text class="c" x="180" y="246" text-anchor="start">Return</text>
  <text class="c" x="280" y="246" text-anchor="start">Records a return</text>
  <text class="c" x="180" y="272" text-anchor="start">Renew</text>
  <text class="c" x="280" y="272" text-anchor="start">Extends the loan</text>
  <text class="s" x="170" y="300" text-anchor="start">Table 2. Buttons on the Loans screen</text>
  <path class="ln" d="M170,325 H490"/>
  <path class="ln" d="M170,339 H490"/>
  <path class="ln" d="M170,353 H490"/>
  <path class="ln" d="M170,367 H450"/>
  <path class="sep" d="M170,398 H260"/>
  <rect class="fn" x="165" y="404" width="330" height="26" rx="3"/>
  <text class="c" x="172" y="422" text-anchor="start">¹ Use the scanner on the left of the desk.</text>
  <rect class="hf" x="150" y="440" width="360" height="40"/>
  <text class="p" x="162" y="465" text-anchor="start">© NIS Library 2026</text>
  <text class="p" x="498" y="465" text-anchor="end">Page 7 of 24</text>
  <text class="p" x="135" y="26" text-anchor="end">HEADER</text>
  <text class="s" x="135" y="42" text-anchor="end">every page</text>
  <text class="p" x="135" y="456" text-anchor="end">FOOTER</text>
  <text class="s" x="135" y="472" text-anchor="end">every page</text>
  <text class="t" x="135" y="78" text-anchor="end">Heading</text>
  <text class="s" x="135" y="94" text-anchor="end">(body text)</text>
  <text class="g" x="530" y="130" text-anchor="start">footnote</text>
  <text class="g" x="530" y="146" text-anchor="start">reference mark</text>
  <path class="ar" d="M528,136 L418,132" marker-end="url(#tda1)"/>
  <text class="t" x="530" y="230" text-anchor="start">table: rows,</text>
  <text class="t" x="530" y="246" text-anchor="start">columns, cells,</text>
  <text class="t" x="530" y="262" text-anchor="start">header row</text>
  <text class="s" x="530" y="300" text-anchor="start">caption</text>
  <path class="ar" d="M528,296 L420,296" marker-end="url(#tda1)"/>
  <text class="g" x="530" y="414" text-anchor="start">footnote text</text>
  <text class="s" x="530" y="430" text-anchor="start">same page</text>
  <path class="ar" d="M528,420 L498,418" marker-end="url(#tda1)"/>
</svg>
:::

:::compare Technical documentation vs user guide
| | Technical documentation | User guide (user documentation) |
|---|---|---|
| Readers | Programmers, maintenance staff, system administrators | The **users** of the system |
| Contents | Algorithms, code listings, data dictionary, ERD, DFD, test plan, hardware/software requirements | Installation instructions, how to carry out tasks, screenshots, error messages and solutions, FAQ, backup procedures |
| Language | Technical | **Simple**, step by step |
| Purpose | To **maintain and improve** the system later | To **use** the system correctly |
:::

:::cards
### Header and footer
Text repeated in the top and bottom margins of every page — title, version, page number.
### Footnote
A numbered note at the bottom of the page — a source or explanation.
### Table
Rows and columns of cells — test plans, data dictionaries, schedules.
### Table of contents
A list of headings with page numbers, built automatically from heading styles.
:::

# Headers and footers
@lo 12.2.1.1

:::definition Header and footer
A **header** is an area in the **top margin** of every page, and a **footer** an area in the **bottom margin**, whose content is **automatically repeated on every page** (or every page of a section) of the document.
:::

:::definition Field
A placeholder in a document that the word processor **fills in and updates automatically**, e.g. the **page number**, total number of pages, date or file name.
:::

:::svg A header and footer are typed once and repeated on every page
<svg class="td" viewBox="0 0 760 275" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four pages: the title page has no header or footer; pages 2 to 4 repeat the same header with the title and version and a footer with an automatic page number">
  <defs><marker id="tda2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.td .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.td .hf{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.2}
    svg.td .fn{fill:var(--success-soft);stroke:var(--success);stroke-width:1.2}
    svg.td .tb{fill:none;stroke:var(--foreground);stroke-width:1}
    svg.td .th{fill:var(--warning);opacity:.25}
    svg.td .ln{stroke:var(--border);stroke-width:5;stroke-linecap:round}
    svg.td .sep{stroke:var(--muted);stroke-width:1}
    svg.td .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .b{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.td .c{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .p{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.td .g{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.td .w{font:700 12px system-ui,sans-serif;fill:var(--warning)}
    svg.td .r{font:700 12px system-ui,sans-serif;fill:var(--danger)}
    svg.td .ar{fill:none;stroke:var(--muted);stroke-width:1.6}
    svg.td .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.td .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
  </style>
  <rect class="pg" x="20" y="20" width="160" height="210" rx="4"/>
  <text class="b" x="100" y="90" text-anchor="middle">Smart Canteen</text>
  <text class="c" x="100" y="110" text-anchor="middle">Design document</text>
  <text class="s" x="100" y="130" text-anchor="middle">Version 1.3</text>
  <text class="w" x="100" y="200" text-anchor="middle">no header / footer</text>
  <text class="s" x="100" y="216" text-anchor="middle">(different first page)</text>
  <rect class="pg" x="205" y="20" width="160" height="210" rx="4"/>
  <rect class="hf" x="205" y="20" width="160" height="30"/>
  <text class="p" x="213" y="40" text-anchor="start">Smart Canteen · v1.3</text>
  <path class="ln" d="M219,70 H351"/>
  <path class="ln" d="M219,88 H351"/>
  <path class="ln" d="M219,106 H351"/>
  <path class="ln" d="M219,124 H351"/>
  <path class="ln" d="M219,142 H351"/>
  <path class="ln" d="M219,160 H311"/>
  <rect class="hf" x="205" y="200" width="160" height="30"/>
  <text class="p" x="357" y="220" text-anchor="end">Page 2 of 4</text>
  <rect class="pg" x="390" y="20" width="160" height="210" rx="4"/>
  <rect class="hf" x="390" y="20" width="160" height="30"/>
  <text class="p" x="398" y="40" text-anchor="start">Smart Canteen · v1.3</text>
  <path class="ln" d="M404,70 H536"/>
  <path class="ln" d="M404,88 H536"/>
  <path class="ln" d="M404,106 H536"/>
  <path class="ln" d="M404,124 H536"/>
  <path class="ln" d="M404,142 H536"/>
  <path class="ln" d="M404,160 H496"/>
  <rect class="hf" x="390" y="200" width="160" height="30"/>
  <text class="p" x="542" y="220" text-anchor="end">Page 3 of 4</text>
  <rect class="pg" x="575" y="20" width="160" height="210" rx="4"/>
  <rect class="hf" x="575" y="20" width="160" height="30"/>
  <text class="p" x="583" y="40" text-anchor="start">Smart Canteen · v1.3</text>
  <path class="ln" d="M589,70 H721"/>
  <path class="ln" d="M589,88 H721"/>
  <path class="ln" d="M589,106 H721"/>
  <path class="ln" d="M589,124 H721"/>
  <path class="ln" d="M589,142 H721"/>
  <path class="ln" d="M589,160 H681"/>
  <rect class="hf" x="575" y="200" width="160" height="30"/>
  <text class="p" x="727" y="220" text-anchor="end">Page 4 of 4</text>
  <text class="s" x="380" y="260" text-anchor="middle">typed ONCE → repeated on every page · page number is a FIELD that updates itself</text>
</svg>
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
- **Fields** (page number, date, number of pages) update **automatically** when pages are added or removed.
- Keep important information (title, version) visible when pages are **printed or separated**.
### Options in a word processor
- **Different first page** — no header on the title page.
- **Different odd and even pages** — e.g. page numbers on the outside edge for a printed booklet.
- **Sections** — each chapter can have its own header text (e.g. the chapter title).
- Insert **fields**: page number, total pages, date, file name.
:::

:::compare Header vs heading
| | Header | Heading |
|---|---|---|
| Where | In the **top margin**, outside the body text | **In the body text**, above a section |
| Repeated? | **Yes** — on every page | **No** — appears once |
| Contains | Title, version, logo, chapter name | The title of one section, e.g. "3. Testing" |
| Used for the table of contents? | No | **Yes** (heading styles) |
:::

:::steps Inserting a header and footer (Microsoft Word / Google Docs)
- **Insert → Header** (or double-click in the top margin) and type the document title and version.
- **Insert → Footer**, then **Insert → Page number** (choose a format such as "Page X of Y").
- Tick **Different first page** if the title page should have no header.
- Close the header/footer area (double-click in the body text or press Esc).
:::

:::example Worked example — headers and footers for a canteen project
Aruzhan is writing the design document for the **Smart Canteen** project at NIS Aktobe.
- **Header:** "Smart Canteen — Design document · v1.3 · 12.11.2026" — readers can see at once that a printed page belongs to the newest version.
- **Footer:** "Page 5 of 18" inserted as **fields** on the left, "Author: A. Nurlanovna" on the right.
- **Different first page:** the title page has no header or footer.
- When she adds a new section, all page numbers and "of 18" change automatically — she never types a page number by hand.
:::

:::warning Common mistakes
- Typing the page number by hand on each page instead of inserting a **page-number field**.
- Confusing a **header** (top margin, repeated) with a **heading** (a title in the body text).
- Forgetting the **version number** — two people then work from different copies.
:::

# Footnotes and endnotes
@lo 12.2.1.2

:::definition Footnote
A **note at the bottom of the same page**, linked to a **reference mark** (usually a superscript number¹) in the main text. It gives a **source, explanation or extra detail** without interrupting the main text.
:::

:::definition Endnote
Like a footnote, but all the notes are collected at the **end of the document** (or of a chapter) instead of at the bottom of each page.
:::

:::svg Footnotes and endnotes
<svg class="td" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Footnotes appear at the bottom of the same page as the reference mark; endnotes are collected together at the end of the document">
  <defs><marker id="tda3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.td .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.td .hf{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.2}
    svg.td .fn{fill:var(--success-soft);stroke:var(--success);stroke-width:1.2}
    svg.td .tb{fill:none;stroke:var(--foreground);stroke-width:1}
    svg.td .th{fill:var(--warning);opacity:.25}
    svg.td .ln{stroke:var(--border);stroke-width:5;stroke-linecap:round}
    svg.td .sep{stroke:var(--muted);stroke-width:1}
    svg.td .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .b{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.td .c{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .p{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.td .g{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.td .w{font:700 12px system-ui,sans-serif;fill:var(--warning)}
    svg.td .r{font:700 12px system-ui,sans-serif;fill:var(--danger)}
    svg.td .ar{fill:none;stroke:var(--muted);stroke-width:1.6}
    svg.td .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.td .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
  </style>
  <text class="g" x="190" y="22" text-anchor="middle">Footnotes — bottom of the SAME page</text>
  <text class="w" x="570" y="22" text-anchor="middle">Endnotes — END of the document</text>
  <rect class="pg" x="30" y="35" width="160" height="220" rx="4"/>
  <path class="ln" d="M44,60 H176"/>
  <path class="ln" d="M44,78 H176"/>
  <path class="ln" d="M44,96 H176"/>
  <path class="ln" d="M44,114 H176"/>
  <path class="ln" d="M44,132 H136"/>
  <text class="g" x="150" y="98" text-anchor="start">1</text>
  <path class="sep" d="M42,200 H100"/>
  <rect class="fn" x="38" y="208" width="144" height="36" rx="3"/>
  <text class="c" x="44" y="230" text-anchor="start">1 source / note</text>
  <rect class="pg" x="210" y="35" width="160" height="220" rx="4"/>
  <path class="ln" d="M224,60 H356"/>
  <path class="ln" d="M224,78 H356"/>
  <path class="ln" d="M224,96 H356"/>
  <path class="ln" d="M224,114 H356"/>
  <path class="ln" d="M224,132 H316"/>
  <text class="g" x="330" y="98" text-anchor="start">3</text>
  <path class="sep" d="M222,200 H280"/>
  <rect class="fn" x="218" y="208" width="144" height="36" rx="3"/>
  <text class="c" x="224" y="230" text-anchor="start">3 source / note</text>
  <rect class="pg" x="410" y="35" width="160" height="220" rx="4"/>
  <path class="ln" d="M424,60 H556"/>
  <path class="ln" d="M424,78 H556"/>
  <path class="ln" d="M424,96 H556"/>
  <path class="ln" d="M424,114 H556"/>
  <path class="ln" d="M424,132 H556"/>
  <path class="ln" d="M424,150 H556"/>
  <path class="ln" d="M424,168 H556"/>
  <path class="ln" d="M424,186 H516"/>
  <text class="w" x="530" y="98" text-anchor="start">1</text>
  <text class="w" x="470" y="170" text-anchor="start">2</text>
  <rect class="pg" x="590" y="35" width="160" height="220" rx="4"/>
  <text class="b" x="604" y="62" text-anchor="start">Notes</text>
  <rect x="600" y="74" width="140" height="22" rx="3" style="fill:var(--surface-2);stroke:var(--warning);stroke-width:1.2"/>
  <text class="c" x="606" y="90" text-anchor="start">1 source / note</text>
  <rect x="600" y="104" width="140" height="22" rx="3" style="fill:var(--surface-2);stroke:var(--warning);stroke-width:1.2"/>
  <text class="c" x="606" y="120" text-anchor="start">2 source / note</text>
  <rect x="600" y="134" width="140" height="22" rx="3" style="fill:var(--surface-2);stroke:var(--warning);stroke-width:1.2"/>
  <text class="c" x="606" y="150" text-anchor="start">3 source / note</text>
  <rect x="600" y="164" width="140" height="22" rx="3" style="fill:var(--surface-2);stroke:var(--warning);stroke-width:1.2"/>
  <text class="c" x="606" y="180" text-anchor="start">4 source / note</text>
  <path class="ar" d="M535,96 L600,82" marker-end="url(#tda3)"/>
  <text class="s" x="190" y="278" text-anchor="middle">the note is next to the text — quick to read</text>
  <text class="s" x="570" y="278" text-anchor="middle">all notes together — the reader turns pages</text>
</svg>
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

:::compare Footnotes vs endnotes
| | Footnotes | Endnotes |
|---|---|---|
| Position | Bottom of the **same page** | End of the **document / chapter** |
| Reading | Quick — no need to turn pages | The reader must go to the end |
| Page layout | Take space on each page | Pages stay clean |
| Best for | Short explanations, sources the reader needs immediately | Long lists of references; documents with many notes |
:::

:::steps Inserting a footnote
- Place the cursor where the reference mark should go.
- **References → Insert Footnote** (Word) / **Insert → Footnote** (Google Docs); shortcut **Ctrl + Alt + F** in Word.
- Type the note at the bottom of the page.
- To convert footnotes to endnotes: **References → Footnotes → Convert**.
:::

:::warning Common mistakes
- Using footnotes for **main** information — they are for sources and extra detail.
- Typing the number ¹ by hand — it will not renumber when notes are added.
- Writing a source as just "Google" or "internet" — give the **author / title / URL and date**.
:::

# Tables
@lo 12.2.1.3

:::definition Table
An arrangement of information in **rows and columns** of **cells**, used to present related data so that it is **easy to read, compare and find**.
:::

:::definition Caption
A **numbered title** above or below a table or figure ("Table 4. Test plan for the age field"), so that it can be **referred to in the text** and listed automatically.
:::

:::svg The parts of a table
<svg class="td" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A test plan table with a shaded header row, rows, columns, cells and a numbered caption underneath">
  <defs><marker id="tda4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.td .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.td .hf{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.2}
    svg.td .fn{fill:var(--success-soft);stroke:var(--success);stroke-width:1.2}
    svg.td .tb{fill:none;stroke:var(--foreground);stroke-width:1}
    svg.td .th{fill:var(--warning);opacity:.25}
    svg.td .ln{stroke:var(--border);stroke-width:5;stroke-linecap:round}
    svg.td .sep{stroke:var(--muted);stroke-width:1}
    svg.td .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .b{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.td .c{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .p{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.td .g{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.td .w{font:700 12px system-ui,sans-serif;fill:var(--warning)}
    svg.td .r{font:700 12px system-ui,sans-serif;fill:var(--danger)}
    svg.td .ar{fill:none;stroke:var(--muted);stroke-width:1.6}
    svg.td .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.td .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
  </style>
  <rect class="th" x="40" y="40" width="640" height="30"/>
  <rect class="tb" x="40" y="40" width="640" height="150"/>
  <path class="tb" d="M40,70 H680"/>
  <path class="tb" d="M40,110 H680"/>
  <path class="tb" d="M40,150 H680"/>
  <path class="tb" d="M110,40 V190"/>
  <path class="tb" d="M260,40 V190"/>
  <path class="tb" d="M380,40 V190"/>
  <path class="tb" d="M530,40 V190"/>
  <text class="t" x="48" y="60" text-anchor="start">No.</text>
  <text class="t" x="118" y="60" text-anchor="start">Test data</text>
  <text class="t" x="268" y="60" text-anchor="start">Type</text>
  <text class="t" x="388" y="60" text-anchor="start">Expected</text>
  <text class="t" x="538" y="60" text-anchor="start">Actual</text>
  <text class="c" x="48" y="95" text-anchor="start">1</text>
  <text class="c" x="118" y="95" text-anchor="start">15</text>
  <text class="c" x="268" y="95" text-anchor="start">Normal</text>
  <text class="c" x="388" y="95" text-anchor="start">Accepted</text>
  <text class="c" x="538" y="95" text-anchor="start">Accepted ✔</text>
  <text class="c" x="48" y="135" text-anchor="start">2</text>
  <text class="c" x="118" y="135" text-anchor="start">11</text>
  <text class="c" x="268" y="135" text-anchor="start">Boundary</text>
  <text class="c" x="388" y="135" text-anchor="start">Accepted</text>
  <text class="c" x="538" y="135" text-anchor="start">Accepted ✔</text>
  <text class="c" x="48" y="175" text-anchor="start">3</text>
  <text class="c" x="118" y="175" text-anchor="start">"ten"</text>
  <text class="c" x="268" y="175" text-anchor="start">Erroneous</text>
  <text class="c" x="388" y="175" text-anchor="start">Error message</text>
  <text class="c" x="538" y="175" text-anchor="start">Crashed ✘</text>
  <text class="s" x="40" y="212" text-anchor="start">Table 4. Test plan for the age field</text>
  <text class="w" x="680" y="30" text-anchor="end">header row (bold, shaded, repeated on each page)</text>
  <path class="ar" d="M20,120 L38,120" marker-end="url(#tda4)"/>
  <text class="s" x="8" y="112" text-anchor="start">row</text>
  <text class="s" x="190" y="18" text-anchor="middle">column</text>
  <path class="ar" d="M190,22 L190,38" marker-end="url(#tda4)"/>
  <text class="s" x="365" y="242" text-anchor="middle">cell</text>
  <path class="ar" d="M365,230 L365,178" marker-end="url(#tda4)"/>
  <text class="g" x="680" y="212" text-anchor="end">caption: number + title</text>
</svg>
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
| Version control | Revision history | Version, date, author, changes |
:::

:::example A test-plan table
| Test no. | Description | Test data | Type | Expected result | Actual result |
|---|---|---|---|---|---|
| 1 | Valid age accepted | 15 | Normal | Accepted | Accepted ✔ |
| 2 | Lower boundary | 11 | Boundary | Accepted | Accepted ✔ |
| 3 | Out of range | 19 | Erroneous | Error message | Error message ✔ |
| 4 | Wrong type | "ten" | Erroneous | Error message | Program crashed ✘ |
:::

:::cards
### Good practice for tables
- A **header row** with clear column headings (bold, shaded); **repeat the header row** on each page if the table continues.
- A **caption** with a number and title so it can be referred to in the text.
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
| "Test 1 used 15, which is normal data; the expected result was accepted and it was accepted. Test 2 used 11, a boundary value…" | The same information in rows and columns — each value in its own cell, easy to **scan, compare and check** |
| Hard to find one value | Find a value by its **row and column** |
| Easy to miss a test or a result | **Empty cells** show at once what is missing |
:::

:::warning Common mistakes
- Tables without **column headings** or **captions**.
- Putting different kinds of data in the same column.
- A header row that does not repeat when the table runs onto the next page.
:::

# Table of contents
@lo 12.2.1.1@paper

:::definition Table of contents (TOC)
A list at the **start of a document** of its **headings** (chapters and sections) with the **page number** of each, used to **navigate** the document. In a word processor it is **generated automatically** from text formatted with **heading styles** and can be **updated** with one click.
:::

:::svg An automatic table of contents is built from heading styles
<svg class="td" viewBox="0 0 760 285" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Headings formatted with Heading 1 and Heading 2 styles are collected by Insert Table of Contents into a contents page with page numbers">
  <defs><marker id="tda5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.td .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.td .hf{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.2}
    svg.td .fn{fill:var(--success-soft);stroke:var(--success);stroke-width:1.2}
    svg.td .tb{fill:none;stroke:var(--foreground);stroke-width:1}
    svg.td .th{fill:var(--warning);opacity:.25}
    svg.td .ln{stroke:var(--border);stroke-width:5;stroke-linecap:round}
    svg.td .sep{stroke:var(--muted);stroke-width:1}
    svg.td .t{font:600 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .b{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.td .c{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.td .p{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.td .g{font:700 12px system-ui,sans-serif;fill:var(--success)}
    svg.td .w{font:700 12px system-ui,sans-serif;fill:var(--warning)}
    svg.td .r{font:700 12px system-ui,sans-serif;fill:var(--danger)}
    svg.td .ar{fill:none;stroke:var(--muted);stroke-width:1.6}
    svg.td .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:1.5}
    svg.td .bad{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
  </style>
  <rect class="pg" x="20" y="20" width="230" height="250" rx="4"/>
  <text class="s" x="135" y="44" text-anchor="middle">Body of the document</text>
  <text class="b" x="34" y="70" text-anchor="start">1 Introduction</text>
  <text class="w" x="240" y="70" text-anchor="end">Heading 1</text>
  <path class="ln" d="M34,82 H200"/>
  <text class="t" x="48" y="110" text-anchor="start">1.1 Purpose</text>
  <text class="w" x="240" y="110" text-anchor="end">Heading 2</text>
  <path class="ln" d="M48,122 H200"/>
  <text class="b" x="34" y="150" text-anchor="start">2 Design</text>
  <text class="w" x="240" y="150" text-anchor="end">Heading 1</text>
  <path class="ln" d="M34,162 H200"/>
  <text class="t" x="48" y="190" text-anchor="start">2.1 Data dictionary</text>
  <text class="w" x="240" y="190" text-anchor="end">Heading 2</text>
  <path class="ln" d="M48,202 H200"/>
  <text class="b" x="34" y="230" text-anchor="start">3 Testing</text>
  <text class="w" x="240" y="230" text-anchor="end">Heading 1</text>
  <path class="ln" d="M34,242 H200"/>
  <rect class="ok" x="300" y="120" width="150" height="56" rx="10"/>
  <text class="t" x="375" y="144" text-anchor="middle">Insert → Table</text>
  <text class="t" x="375" y="162" text-anchor="middle">of Contents</text>
  <path class="ar" d="M252,148 L298,148" marker-end="url(#tda5)"/>
  <path class="ar" d="M452,148 L498,148" marker-end="url(#tda5)"/>
  <rect class="pg" x="500" y="20" width="240" height="250" rx="4"/>
  <text class="b" x="515" y="46" text-anchor="start">Contents</text>
  <text class="c" x="515" y="76" text-anchor="start">1 Introduction</text>
  <path class="sep" style="stroke-dasharray:2 3" d="M614,73 H705"/>
  <text class="c" x="728" y="76" text-anchor="end">3</text>
  <text class="c" x="529" y="106" text-anchor="start">1.1 Purpose</text>
  <path class="sep" style="stroke-dasharray:2 3" d="M610,103 H705"/>
  <text class="c" x="728" y="106" text-anchor="end">3</text>
  <text class="c" x="515" y="136" text-anchor="start">2 Design</text>
  <path class="sep" style="stroke-dasharray:2 3" d="M578,133 H705"/>
  <text class="c" x="728" y="136" text-anchor="end">7</text>
  <text class="c" x="529" y="166" text-anchor="start">2.1 Data dictionary</text>
  <path class="sep" style="stroke-dasharray:2 3" d="M658,163 H705"/>
  <text class="c" x="728" y="166" text-anchor="end">8</text>
  <text class="c" x="515" y="196" text-anchor="start">3 Testing</text>
  <path class="sep" style="stroke-dasharray:2 3" d="M584,193 H705"/>
  <text class="c" x="728" y="196" text-anchor="end">12</text>
  <text class="g" x="620" y="238" text-anchor="middle">page numbers + links</text>
  <text class="g" x="620" y="254" text-anchor="middle">built automatically</text>
  <text class="s" x="375" y="220" text-anchor="middle">after changes:</text>
  <text class="p" x="375" y="236" text-anchor="middle">Update Table</text>
</svg>
:::

:::steps Creating an automatic table of contents
- Format every chapter title with **Heading 1** and every section title with **Heading 2** (Home → Styles).
- Place the cursor on an empty page after the title page.
- **References → Table of Contents** (Word) / **Insert → Table of contents** (Google Docs) and choose a style.
- After editing the document, click **Update Table** (update the entire table) so that headings and page numbers are correct.
- Hold **Ctrl** and click an entry to jump to that section (hyperlinks).
:::

:::compare Automatic vs typed table of contents
| | Automatic TOC | TOC typed by hand |
|---|---|---|
| How it is made | From **heading styles** | Each line and page number typed |
| When pages change | **Update Table** — all numbers corrected | Every number must be checked and retyped |
| Links | Entries are **hyperlinks** to the sections | No links |
| Errors | Few — only missing heading styles | Wrong or missing page numbers are common |
:::

:::cards
### Why a project document needs a TOC
- Readers (teacher, client, programmers) can **find a section quickly**.
- Shows the **structure** of the document at a glance — which parts are included.
- Works together with **page numbers in the footer**: the TOC gives the page, the footer shows where you are.
### Related automatic lists
- **Table of figures** — a list of all diagrams with their captions.
- **List of tables** — from table captions (Insert Table of Figures → label "Table").
- **Index** — key words with the pages where they appear.
:::

:::example Worked example — TOC for a project report
Daniyar's report has chapters *1 Analysis*, *2 Design*, *3 Development*, *4 Testing*, *5 Evaluation*, each with sections such as *2.1 DFD* and *2.2 Data dictionary*.
1. He applies **Heading 1** to the chapter titles and **Heading 2** to the section titles.
2. On page 2 he inserts an automatic **table of contents**.
3. He adds three pages of screenshots to chapter 3, so chapters 4 and 5 move — he clicks **Update Table** and every page number in the TOC is corrected.
4. A heading he typed in bold but without a style is missing from the TOC — he applies **Heading 2** and updates again.
:::

:::warning Common mistakes
- Making headings **bold and large by hand** instead of using **heading styles** — they do not appear in the TOC.
- Forgetting to **update** the TOC after editing, so page numbers are wrong.
- Confusing the **table of contents** (headings + pages) with a **table** (rows and columns of data).
:::

# Exam practice and summary
@lo 12.2.1.1 12.2.1.2 12.2.1.3 12.2.1.1@paper

:::example Exam-style answers
**Q: A fragment of a page of the "User guide 2025" is shown. Name the element at the top of the page that contains the text "User guide 2025 — page 3". [1]**
**Header** (1).

**Q: Give two items that need to be included in the user guide. [2]**
**Installation instructions** / the steps required to install the product (1); details of **backup procedures** / required **hardware and software** / how to use each function / **troubleshooting** (1).

**Q: Explain why the programmer should use a footer with page numbers in the technical documentation. [2]**
The page numbers appear **automatically on every page** (1), so readers can **find sections from the table of contents** and notice if pages are **missing** (1).

**Q: Explain one reason for using footnotes in a project report. [2]**
To **cite the source** of information (1) without interrupting the main text, so the report is easy to read and avoids **plagiarism** (1).

**Q: Explain why the test results should be presented in a table. [2]**
Each test's data, expected and actual result are in **separate columns** (1), so they are **easy to compare** and failed tests can be found quickly (1).

**Q: Describe how to create a table of contents that stays correct when the document changes. [3]**
Apply **heading styles** (Heading 1, Heading 2) to the chapter and section titles (1); insert an **automatic table of contents** (References → Table of Contents) (1); **update the table** after editing so the page numbers are correct (1).
:::

:::warning Common mistakes
- Typing page numbers or footnote numbers by hand instead of using **automatic fields**.
- Confusing a **header** with a **heading**, and a **footnote** with a **footer**.
- Using footnotes for **main** information — they are for sources and extra detail.
- Tables without **column headings** or **captions**.
- A table of contents that was not **updated** after the last edit.
:::

:::steps Check yourself
- What is the difference between a header and a heading, and between a footer and a footnote?
- List six items that may be placed in a header or footer, and say why the version number matters.
- What is the difference between a footnote and an endnote? Give three uses of footnotes.
- Name four tables that appear in project documentation and their columns.
- List five rules for formatting a table well.
- How is an automatic table of contents created and kept up to date?
:::
