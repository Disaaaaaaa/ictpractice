---
summary: Using headers and footers, footnotes, tables and an automatic table of contents when documenting a project.
---
# Headers and footers
@lo 12.2.1.1

:::definition Header and footer
Areas at the **top (header)** and **bottom (footer)** margin of every page whose content is **repeated automatically** on each page or each section.
:::

- Typical content: **project title**, author, organisation logo, **page numbers** ("Page 3 of 20"), date, version number, chapter name, "Confidential".
- Purpose: helps the reader **identify the document and find their place**; gives a professional, consistent look; page numbers are needed for the table of contents.
- Options: **different first page** (no header on the title page), **different odd and even pages**, different headers in different **sections** (use section breaks and unlink "Same as previous").

:::example A header and footer in a user guide
Header: **E-Journal — User guide 2025** (right-aligned) · Footer: *Page 4 of 18* (centred).
:::

# Footnotes
@lo 12.2.1.2

:::definition Footnote
A note at the **bottom of the page**, linked to a **reference mark** (a superscript number) in the text. **Endnotes** are the same but collected at the end of the document or section.
:::

- Used for: **citing sources**, explaining a term, giving extra details without interrupting the main text.
- The word processor numbers footnotes **automatically** and renumbers them when notes are added or deleted.
- Insert: *References → Insert Footnote* (Word) / *Insert → Footnote* (Google Docs).

:::example
"The system uses MySQL¹ as its database."
— ¹ MySQL is an open-source relational database management system, https://www.mysql.com.
:::

# Tables in documentation
@lo 12.2.1.3

Tables present structured information clearly: test plans, data dictionaries, hardware requirements, timelines, comparisons.

:::steps Good practice for tables
- Give each table a **number and caption**: "Table 3 — Test plan".
- Use a **header row**, repeated on every page if the table is long (*Repeat as header row*).
- Keep columns aligned; numbers right-aligned.
- Use borders and shading consistently; avoid overcrowding.
- Refer to the table in the text ("see Table 3").
:::

:::compare Table 2 — Minimum hardware requirements
| Component | Requirement |
|---|---|
| Processor | 2 GHz dual-core |
| RAM | 4 GB |
| Storage | 500 MB free |
:::

# Table of contents
@lo 12.2.1.1@paper

:::definition Table of contents (TOC)
A list of the document's **headings with their page numbers**, at the start of the document, usually with **clickable links**.
:::

:::steps Creating an automatic table of contents
- Apply **heading styles** (Heading 1, Heading 2, Heading 3) to all titles.
- Place the cursor where the TOC should go and choose *References → Table of Contents*.
- After editing the document, use **Update table** so headings and page numbers stay correct.
:::

:::compare Automatic vs manual table of contents
| Automatic | Manual (typed) |
|---|---|
| Built from heading styles | Typed by hand |
| Updates page numbers and headings in one click | Must be corrected manually after every change |
| Entries are hyperlinks to the sections | No links |
| Consistent formatting | Errors are likely |
:::

:::tip
In questions about a documentation screenshot, identify features by **where they are**: text repeated at the top of the page → **header**; small numbered note at the bottom → **footnote**; list of headings with page numbers → **table of contents**.
:::
