---
summary: Formatting project documentation professionally — sections with their own headers, footers and page numbering, different first and odd/even pages, fields; formatting, numbering and placing footnotes and endnotes; and formatting tables with header rows that repeat, merged cells, alignment, borders, captions and cross-references.
---
# Headers, footers and sections
@lo 12.2.1.4

In the previous topic you **inserted** headers, footers, footnotes and tables. This lesson is about **formatting** them so that a long project document (20–100 pages, several authors, many versions) looks **consistent**, is **easy to navigate** and **updates itself** when it changes.

:::definition Section break
A mark that divides a document into **sections**. Each section can have its **own** headers and footers, page-number format, margins and orientation. Types: **Next page** (the new section starts on a new page) and **Continuous** (on the same page).
:::

:::definition Field
An **automatic code** in the document that is **replaced by a value and updated** by the word processor — e.g. `PAGE` (page number), `NUMPAGES` (total pages), `DATE`, `FILENAME`, `STYLEREF` (the current chapter heading).
:::

:::definition Style
A **named set of formatting** (font, size, colour, spacing, numbering) applied in one click — e.g. *Heading 1*, *Normal*, *Header*, *Footnote Text*, *Caption*. Changing the style changes **all** text that uses it.
:::

:::svg Sections let one document have different headers, footers and page numbers
<svg class="ftd1" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three sections: a title page with no header, front matter numbered i ii iii, and the main chapters numbered 1 2 3 with the chapter name in the header">
  <style>
    svg.ftd1 .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ftd1 .hf{fill:var(--primary-soft)}
    svg.ftd1 .tx{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd1 .mu{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ftd1 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd1 .br{stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4}
    svg.ftd1 .bt{font:600 12px system-ui,sans-serif;fill:var(--danger)}
    svg.ftd1 .ln{stroke:var(--border);stroke-width:3}
  </style>
  <text class="h" x="20" y="24">Section 1 — title page</text>
  <text class="h" x="250" y="24">Section 2 — front matter</text>
  <text class="h" x="520" y="24">Section 3 — chapters</text>
  <rect class="pg" x="40" y="40" width="130" height="180" rx="4"/>
  <text class="h" x="105" y="110" text-anchor="middle">Sabaq</text><text class="mu" x="105" y="130" text-anchor="middle">Project report</text>
  <text class="mu" x="105" y="200" text-anchor="middle">no header, no number</text>
  <line class="br" x1="205" y1="36" x2="205" y2="236"/>
  <rect class="pg" x="230" y="40" width="110" height="180" rx="4"/><rect class="hf" x="230" y="40" width="110" height="24"/><rect class="hf" x="230" y="196" width="110" height="24"/>
  <text class="tx" x="285" y="57" text-anchor="middle">Sabaq report</text><text class="tx" x="285" y="213" text-anchor="middle">i</text>
  <path class="ln" d="M245,90 H325 M245,104 H310 M245,118 H325"/><text class="mu" x="285" y="80" text-anchor="middle">Contents</text>
  <rect class="pg" x="350" y="40" width="110" height="180" rx="4"/><rect class="hf" x="350" y="40" width="110" height="24"/><rect class="hf" x="350" y="196" width="110" height="24"/>
  <text class="tx" x="405" y="57" text-anchor="middle">Sabaq report</text><text class="tx" x="405" y="213" text-anchor="middle">ii</text>
  <path class="ln" d="M365,90 H445 M365,104 H430"/><text class="mu" x="405" y="80" text-anchor="middle">Figures</text>
  <line class="br" x1="490" y1="36" x2="490" y2="236"/>
  <rect class="pg" x="510" y="40" width="110" height="180" rx="4"/><rect class="hf" x="510" y="40" width="110" height="24"/><rect class="hf" x="510" y="196" width="110" height="24"/>
  <text class="tx" x="565" y="57" text-anchor="middle">1 Analysis</text><text class="tx" x="565" y="213" text-anchor="middle">Page 1 of 42</text>
  <path class="ln" d="M525,90 H605 M525,104 H590 M525,118 H605 M525,132 H580"/>
  <rect class="pg" x="630" y="40" width="110" height="180" rx="4"/><rect class="hf" x="630" y="40" width="110" height="24"/><rect class="hf" x="630" y="196" width="110" height="24"/>
  <text class="tx" x="685" y="57" text-anchor="middle">2 Design</text><text class="tx" x="685" y="213" text-anchor="middle">Page 9 of 42</text>
  <path class="ln" d="M645,90 H725 M645,104 H710 M645,118 H725"/>
  <text class="bt" x="205" y="254" text-anchor="middle">section break</text><text class="bt" x="205" y="270" text-anchor="middle">(next page)</text>
  <text class="bt" x="490" y="254" text-anchor="middle">section break</text><text class="bt" x="490" y="270" text-anchor="middle">numbering restarts at 1</text>
  <text class="mu" x="345" y="300" text-anchor="middle">roman numerals i, ii, iii</text>
  <text class="mu" x="625" y="300" text-anchor="middle">STYLEREF field shows the chapter</text>
  <text class="mu" x="625" y="316" text-anchor="middle">PAGE of NUMPAGES fields in the footer</text>
</svg>
:::

:::compare Header and footer options in a word processor
| Option | What it does | When to use it in project documentation |
|---|---|---|
| **Different first page** | The first page of a section gets its own (often empty) header/footer | Title page with no header and no page number |
| **Different odd & even pages** | Left (even) and right (odd) pages get different headers/footers | Printed, bound reports: page numbers on the **outside** edge |
| **Link to previous** | The section uses the **same** header/footer as the section before | Switch it **off** to give a new section its own header |
| **Page number format** | 1, 2, 3 · i, ii, iii · A, B, C; "Start at …" | Roman numerals for the contents pages; restart at 1 for Chapter 1 |
| **Header / footer distance** | Space between the header and the page edge | Keep the text inside the printable area |
| **Fields** | PAGE, NUMPAGES, DATE, FILENAME, STYLEREF, author | "Page 3 of 42"; current chapter title; file name and version |
:::

:::svg Different odd and even pages in a printed report
<svg class="ftd2" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An open booklet: even left page with the page number on the left and the document title, odd right page with the chapter name and the page number on the right">
  <style>
    svg.ftd2 .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ftd2 .hf{fill:var(--primary-soft)}
    svg.ftd2 .tx{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd2 .b{font:700 13px system-ui,sans-serif;fill:var(--primary)}
    svg.ftd2 .mu{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ftd2 .ln{stroke:var(--border);stroke-width:3}
    svg.ftd2 .sp{stroke:var(--foreground);stroke-width:2}
  </style>
  <rect class="pg" x="120" y="20" width="260" height="180"/><rect class="pg" x="380" y="20" width="260" height="180"/>
  <line class="sp" x1="380" y1="16" x2="380" y2="204"/>
  <rect class="hf" x="120" y="20" width="260" height="28"/><rect class="hf" x="380" y="20" width="260" height="28"/>
  <rect class="hf" x="120" y="172" width="260" height="28"/><rect class="hf" x="380" y="172" width="260" height="28"/>
  <text class="b" x="132" y="39">12</text><text class="tx" x="366" y="39" text-anchor="end">Sabaq — Technical documentation</text>
  <text class="tx" x="394" y="39">3 Testing</text><text class="b" x="628" y="39" text-anchor="end">13</text>
  <text class="b" x="132" y="191">12</text><text class="b" x="628" y="191" text-anchor="end">13</text>
  <path class="ln" d="M140,70 H360 M140,86 H340 M140,102 H360 M140,118 H300 M400,70 H620 M400,86 H600 M400,102 H620 M400,118 H560"/>
  <text class="mu" x="110" y="110" text-anchor="end">even page</text><text class="mu" x="110" y="126" text-anchor="end">(left)</text>
  <text class="mu" x="650" y="110">odd page</text><text class="mu" x="650" y="126">(right)</text>
  <text class="mu" x="380" y="226" text-anchor="middle">page numbers on the outside edge; the binding (gutter) in the middle stays clear</text>
</svg>
:::

:::steps Giving a new chapter its own header (Microsoft Word)
- Click at the start of the chapter → **Layout → Breaks → Section Breaks → Next Page**.
- Double-click the header of the new section to open **Header & Footer**.
- Switch **off** *Link to Previous* — now this header can be changed without changing earlier ones.
- Type or insert the chapter title (or a **STYLEREF "Heading 1"** field so it updates automatically).
- In the footer: **Page Number → Format Page Numbers → Start at 1** (and choose 1, 2, 3 or i, ii, iii).
- Close the header and check the previous section still has its old header.
:::

:::example Worked example — formatting the Sabaq project report
A team of three students writes a 42-page report for *Sabaq*, a school timetable app.
1. **Title page** — section 1 with *Different first page*: no header or page number.
2. **Contents and list of figures** — section 2: header "Sabaq — Project report", footer page numbers **i, ii, iii**.
3. **Chapters** — section 3: *Link to previous* off; header = **STYLEREF** field showing the current Heading 1 ("2 Design"); footer "Page **PAGE** of **NUMPAGES**", numbering restarts at **1**.
4. **ERD and Gantt chart** — a short section in **landscape** orientation, with the same header (linked to previous).
5. The **Header** and **Footer** styles are changed once (font 9 pt, grey) — every header in all sections updates.
:::

:::compare Manual formatting vs automatic tools
| Task | Manual way (avoid) | Automatic tool (use) |
|---|---|---|
| Headings | Make text bold and bigger each time | **Heading styles** — also feed the table of contents and STYLEREF |
| Page numbers | Type a number on every page | **PAGE field** in the footer |
| "Page 3 of 42" | Count the pages and type | **PAGE** and **NUMPAGES** fields |
| Chapter name on each page | Type it in every header | **STYLEREF** field, or a section per chapter |
| Landscape page for a wide table | Separate file, printed separately | **Section break** + landscape for that section only |
:::

:::warning Common mistakes
- Changing the header of chapter 3 and finding that **every** header changed — *Link to previous* was still on.
- Using a **page break** where a **section break** is needed — a page break cannot change the header or orientation.
- Typing page numbers by hand — they are wrong as soon as a page is added.
- Pressing Enter many times to reach the next page instead of inserting a break — the layout moves when text is edited.
- Putting so much in the header (logo, long title, date, authors) that it distracts from the content.
:::

# Formatting footnotes and endnotes
@lo 12.2.1.5

:::definition Footnote and endnote
A **footnote** is a note at the **bottom of the page** that is linked to a **reference mark** in the text; an **endnote** is the same kind of note collected at the **end of the document or section**. Both are numbered **automatically** by the word processor.
:::

:::definition Note separator
The short **horizontal line** that separates the main text from the footnotes at the bottom of the page.
:::

:::svg Anatomy of a formatted footnote
<svg class="ftd3" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A page with a superscript reference mark in the text, a note separator line and the footnote in a smaller Footnote Text style; labels explain each part">
  <style>
    svg.ftd3 .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ftd3 .tx{font:14px Georgia,serif;fill:var(--foreground)}
    svg.ftd3 .sm{font:12px Georgia,serif;fill:var(--foreground)}
    svg.ftd3 .sup{font:700 12px Georgia,serif;fill:var(--primary)}
    svg.ftd3 .lb{font:600 13px system-ui,sans-serif;fill:var(--primary)}
    svg.ftd3 .mu{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ftd3 .sep{stroke:var(--foreground);stroke-width:1.2}
    svg.ftd3 .ar{stroke:var(--primary);stroke-width:1.5;fill:none}
  </style>
  <rect class="pg" x="20" y="10" width="440" height="270" rx="4"/>
  <text class="tx" x="40" y="46">The app was tested with 120 pupils</text>
  <text class="tx" x="40" y="68">in grade 10<tspan class="sup" dy="-7">1</tspan><tspan dy="7">. The average load time</tspan></text>
  <text class="tx" x="40" y="90">was 1.8 seconds<tspan class="sup" dy="-7">2</tspan><tspan dy="7">, below the 3-second</tspan></text>
  <text class="tx" x="40" y="112">target set in the requirements.</text>
  <line class="sep" x1="40" y1="212" x2="160" y2="212"/>
  <text class="sup" x="40" y="232">1</text><text class="sm" x="50" y="236">NIS Shymkent, testing week 6–10 October 2026.</text>
  <text class="sup" x="40" y="254">2</text><text class="sm" x="50" y="258">Measured on a school Wi-Fi network, see Table 4.</text>
  <path class="ar" d="M122,58 C250,40 400,40 480,40"/><text class="lb" x="486" y="44">Reference mark</text>
  <text class="mu" x="486" y="62">superscript number, inserted automatically</text>
  <path class="ar" d="M160,212 C300,212 400,120 480,118"/><text class="lb" x="486" y="122">Note separator</text>
  <text class="mu" x="486" y="140">short line above the notes</text>
  <path class="ar" d="M400,240 H480"/><text class="lb" x="486" y="236">Footnote Text style</text>
  <text class="mu" x="486" y="254">smaller font (e.g. 9–10 pt), same</text>
  <text class="mu" x="486" y="270">style for every note</text>
</svg>
:::

:::compare Footnote and endnote formatting options (References → Footnotes dialog)
| Option | Choices | Use in project documentation |
|---|---|---|
| **Location** | Footnotes: *Bottom of page* or *Below text*; Endnotes: *End of section* or *End of document* | Footnotes for short comments; endnotes for a long list of sources |
| **Number format** | 1, 2, 3 · a, b, c · i, ii, iii · *, †, ‡ | Use a **different format** for footnotes and endnotes so the reader can tell them apart (e.g. 1, 2, 3 and i, ii, iii) |
| **Custom mark** | Any symbol, e.g. * | One special note, e.g. "* data from the school office" |
| **Start at** | Any number | Continue numbering from a previous file |
| **Numbering** | *Continuous* / *Restart each section* / *Restart each page* | Restart in each chapter of a long report |
| **Convert** | Footnotes ↔ endnotes | Change all notes at once if the teacher asks for endnotes |
| **Footnote Text style** | Font, size, spacing of all notes | Modify the style once — all notes change |
:::

:::svg Footnotes or endnotes: where the notes appear
<svg class="ftd4" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: footnotes at the bottom of each page. Right: endnotes collected on the last page of the document">
  <style>
    svg.ftd4 .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ftd4 .nt{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1}
    svg.ftd4 .en{fill:var(--success-soft);stroke:var(--success);stroke-width:1}
    svg.ftd4 .ln{stroke:var(--border);stroke-width:3}
    svg.ftd4 .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd4 .mu{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.ftd4 .sup{font:700 12px system-ui,sans-serif;fill:var(--primary)}
    svg.ftd4 .sug{font:700 12px system-ui,sans-serif;fill:var(--success)}
  </style>
  <text class="h" x="20" y="22">Footnotes — bottom of each page</text>
  <rect class="pg" x="20" y="34" width="100" height="140"/><rect class="pg" x="135" y="34" width="100" height="140"/><rect class="pg" x="250" y="34" width="100" height="140"/>
  <path class="ln" d="M30,54 H110 M30,68 H100 M30,82 H110 M145,54 H225 M145,68 H215 M260,54 H340 M260,68 H330 M260,82 H320"/>
  <text class="sup" x="102" y="66">1</text><text class="sup" x="217" y="66">2</text><text class="sup" x="322" y="80">3</text>
  <rect class="nt" x="26" y="146" width="88" height="22"/><text class="sup" x="32" y="161">1 note</text>
  <rect class="nt" x="141" y="146" width="88" height="22"/><text class="sup" x="147" y="161">2 note</text>
  <rect class="nt" x="256" y="146" width="88" height="22"/><text class="sup" x="262" y="161">3 note</text>
  <text class="mu" x="20" y="196">read without turning pages; short notes</text>
  <text class="h" x="410" y="22">Endnotes — end of the document</text>
  <rect class="pg" x="410" y="34" width="100" height="140"/><rect class="pg" x="525" y="34" width="100" height="140"/><rect class="pg" x="640" y="34" width="100" height="140"/>
  <path class="ln" d="M420,54 H500 M420,68 H490 M420,82 H500 M535,54 H615 M535,68 H605"/>
  <text class="sug" x="492" y="66">i</text><text class="sug" x="607" y="66">ii</text>
  <text class="h" x="650" y="54" style="font-size:12px">Notes</text>
  <rect class="en" x="646" y="62" width="88" height="22"/><text class="sug" x="652" y="77">i note</text>
  <rect class="en" x="646" y="88" width="88" height="22"/><text class="sug" x="652" y="103">ii note</text>
  <text class="mu" x="410" y="196">pages stay clean; good for many or long notes (sources)</text>
</svg>
:::

:::steps Formatting the notes of a whole document at once
- **References → Footnotes** dialog launcher (the small arrow) opens the *Footnote and Endnote* dialog.
- Choose **Location** (bottom of page / end of document) and **Number format**.
- Choose **Numbering: Restart each section** if every chapter should start again at 1; click **Apply**.
- To change how all notes look, **modify the *Footnote Text* style** (e.g. 9 pt, single spacing) — never format notes one by one.
- If needed, **Convert…** all footnotes to endnotes in one step.
:::

:::example Worked example — notes in a test report
In the *Testing* chapter of the Sabaq report the team uses:
- **Footnotes** (1, 2, 3, restarting in each chapter) for short comments: *"Measured on the school Wi-Fi network."*
- **Endnotes** (i, ii, iii) at the end of the document for all the **sources** they used — so the two kinds of note cannot be confused.
- The *Footnote Text* style is modified to 9 pt Calibri, so every note in all chapters matches.
:::

:::warning Common mistakes
- Typing a small "1" and the note at the bottom of the page by hand — it does not renumber and moves to the wrong page when text is edited.
- Using the **same number format** for footnotes and endnotes, so reader cannot tell which list a "3" refers to.
- Formatting each note separately instead of modifying the **Footnote Text** style.
- Putting long explanations in footnotes — important information belongs in the main text.
:::

# Formatting tables
@lo 12.2.1.6

Tables in project documentation (data dictionary, test plan, requirements, Gantt plan) are often **long** and **wide**. Formatting makes them readable on screen and in print.

:::definition Header row
The **first row of a table** that contains the **column headings**. It can be set to **repeat at the top of every page** when a table continues onto the next page.
:::

:::definition Caption
A **numbered label** for a table or figure, e.g. *Table 3 — Test plan for the login form*, inserted with **Insert Caption** so the number updates automatically. For tables it is usually placed **above** the table; for figures, **below**.
:::

:::definition Cross-reference
A **field** that refers to a caption, heading or page, e.g. "see **Table 3** on page **12**", and **updates** when the table is renumbered or moved.
:::

:::svg A long table formatted for print
<svg class="ftd5" viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A test plan table split over two pages: the caption is above the table, the header row is shaded, bold and repeated on page 2, merged title cell, rows do not break across pages">
  <style>
    svg.ftd5 .pg{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.ftd5 .hd{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1}
    svg.ftd5 .cl{fill:none;stroke:var(--border);stroke-width:1}
    svg.ftd5 .cp{font:italic 600 12px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd5 .th{font:700 12px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd5 .td{font:12px system-ui,sans-serif;fill:var(--foreground)}
    svg.ftd5 .lb{font:600 12px system-ui,sans-serif;fill:var(--primary)}
    svg.ftd5 .ar{stroke:var(--primary);stroke-width:1.5;fill:none}
  </style>
  <rect class="pg" x="20" y="10" width="300" height="270"/>
  <text class="cp" x="34" y="34">Table 3 — Test plan for the login form</text>
  <rect class="hd" x="34" y="44" width="272" height="24"/><text class="th" x="170" y="61" text-anchor="middle">Login form tests</text>
  <rect class="hd" x="34" y="68" width="272" height="24"/>
  <text class="th" x="40" y="85">No.</text><text class="th" x="78" y="85">Test data</text><text class="th" x="170" y="85">Type</text><text class="th" x="240" y="85">Expected</text>
  <rect class="cl" x="34" y="92" width="272" height="42"/><text class="td" x="40" y="110">1</text><text class="td" x="78" y="110">dana.s / ok</text><text class="td" x="170" y="110">normal</text><text class="td" x="240" y="110">logged in</text>
  <rect class="cl" x="34" y="134" width="272" height="42"/><text class="td" x="40" y="152">2</text><text class="td" x="78" y="152">7-char pass</text><text class="td" x="170" y="152">boundary</text><text class="td" x="240" y="152">rejected</text>
  <rect class="cl" x="34" y="176" width="272" height="42"/><text class="td" x="40" y="194">3</text><text class="td" x="78" y="194">empty login</text><text class="td" x="170" y="194">erroneous</text><text class="td" x="240" y="194">error</text>
  <path d="M34,226 H306" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text class="td" x="170" y="262" text-anchor="middle" style="fill:var(--muted)">— page break —</text>
  <rect class="pg" x="440" y="10" width="300" height="270"/>
  <rect class="hd" x="454" y="44" width="272" height="24"/>
  <text class="th" x="460" y="61">No.</text><text class="th" x="498" y="61">Test data</text><text class="th" x="590" y="61">Type</text><text class="th" x="660" y="61">Expected</text>
  <rect class="cl" x="454" y="68" width="272" height="42"/><text class="td" x="460" y="86">4</text><text class="td" x="498" y="86">16-char pass</text><text class="td" x="590" y="86">boundary</text><text class="td" x="660" y="86">accepted</text>
  <rect class="cl" x="454" y="110" width="272" height="42"/><text class="td" x="460" y="128">5</text><text class="td" x="498" y="128">' OR 1=1</text><text class="td" x="590" y="128">erroneous</text><text class="td" x="660" y="128">rejected</text>
  <path class="ar" d="M322,30 H380"/><text class="lb" x="330" y="24">caption above</text>
  <path class="ar" d="M306,56 H380"/><text class="lb" x="322" y="52">merged cell</text>
  <path class="ar" d="M380,80 H454"/><text class="lb" x="330" y="100">header row</text><text class="lb" x="330" y="116">repeated on</text><text class="lb" x="330" y="132">every page</text>
  <text class="lb" x="330" y="196">rows do not</text><text class="lb" x="330" y="212">break across</text><text class="lb" x="330" y="228">pages</text>
</svg>
:::

:::compare Table formatting tools (Table Design / Layout tabs)
| Tool | What it does | Why it is used in documentation |
|---|---|---|
| **Repeat header rows** | The header row appears at the top of every page the table continues on | A 5-page data dictionary is readable on every page |
| **Allow row to break across pages** (off) | A row is never split between two pages | A test case is never cut in half |
| **Merge cells** | Joins several cells into one | A title across all columns; one group label for several rows |
| **Split cells** | Divides one cell into several | Sub-columns, e.g. *Result: Expected / Actual* |
| **Table styles, shading and borders** | Consistent colours, lines and banded rows | The header stands out; rows are easy to follow |
| **Alignment** | Text left, numbers right / decimal, headings centred | Numbers can be compared quickly |
| **AutoFit / column width** | Fit to contents or to the page width | No table runs off the page |
| **Text direction** | Rotates text in a cell | Narrow columns with long headings |
| **Sort** | Orders the rows by a column | Data dictionary sorted by field name; tests by number |
| **Insert Caption + Cross-reference** | Numbered label + auto-updating reference | "see Table 3" stays correct when tables are added |
:::

:::compare Unformatted vs formatted table
| Feature | Unformatted | Formatted |
|---|---|---|
| Header row | Looks like the other rows | **Bold, shaded, repeated** on every page |
| Numbers | Left-aligned, different decimal places | **Right / decimal aligned**, same decimal places |
| Long table | Header lost after the first page; rows cut in half | Header repeats; rows kept whole |
| Wide table | Runs off the page or tiny font | **Landscape section** or AutoFit to window |
| Label | "the table below" | **Caption** "Table 4 — Data dictionary: Lesson" + cross-reference |
:::

:::steps Formatting a long data-dictionary table
- Select the first row → **Layout → Repeat Header Rows**; make it **bold** and shaded with a **table style**.
- Select the whole table → **Table Properties → Row** → untick **Allow row to break across pages**.
- Align: text columns **left**, number columns **right**, short codes **centred**.
- **AutoFit → AutoFit Window**; if the table is still too wide, put it in a **landscape section**.
- **References → Insert Caption** → *Table*, position **Above selected item**.
- In the text write "see **Insert Cross-reference** → *Table 4*" instead of typing the number.
:::

:::html Example: a formatted test-plan table | 260
<table>
<caption>Table 3 — Test plan for the login form</caption>
<thead><tr><th>No.</th><th>Test data</th><th>Type of data</th><th>Expected result</th></tr></thead>
<tbody>
<tr><td class="c">1</td><td>dana.s / Correct password</td><td>Normal</td><td>User is logged in</td></tr>
<tr><td class="c">2</td><td>Password of 7 characters</td><td>Boundary</td><td>Rejected: "8–16 characters"</td></tr>
<tr><td class="c">3</td><td>Login left empty</td><td>Erroneous</td><td>Rejected: "Enter your login"</td></tr>
</tbody>
</table>
---css---
body{font:14px system-ui,sans-serif;margin:8px}
table{border-collapse:collapse;width:100%}
caption{caption-side:top;text-align:left;font-style:italic;font-weight:600;padding:4px 0}
th{background:#dbeafe;font-weight:700;text-align:left}
th,td{border:1px solid #a1a1aa;padding:6px 8px}
tbody tr:nth-child(even){background:#f4f4f5}
td.c{text-align:center}
:::

:::example Worked example — the Sabaq data dictionary over three pages
The data dictionary has 46 rows and covers three pages. The team:
1. sets the first row to **repeat** — every page shows *Field · Type · Size · Key · Validation*;
2. turns off **row breaking**, so no field's validation is split between pages;
3. **merges** a row above each group of fields with the table name ("Table: Lesson");
4. inserts the caption **Table 4 — Data dictionary** above it and, in the Design chapter, a **cross-reference** "see Table 4". When a new Table 2 is added later, it becomes Table 5 everywhere after **Update Field** (F9).
:::

:::warning Common mistakes
- Typing the column headings again at the top of every page — when rows are added they end up in the middle of the table. Use **Repeat header rows**.
- Typing "Table 3" by hand — after a new table is added all numbers are wrong. Use **captions** and **cross-references**.
- Merging cells in a table that will be **sorted** or converted to a spreadsheet — merged cells break sorting.
- Too many colours and borders: formatting should make the table **easier to read**, not decorate it.
:::

# Exam practice and summary
@lo 12.2.1.4 12.2.1.5 12.2.1.6

:::example Exam-style answers
**Q: Explain why a section break, not a page break, is needed before the first chapter of a report whose contents pages are numbered i, ii, iii. [2]**
A section break lets the new part have its **own page-number format / restart numbering at 1** (and its own header) (1); a page break only starts a new page, so the numbering format and header would continue from the contents pages (1).

**Q: Describe how to give chapter 3 a different header from chapter 2. [3]**
Insert a **section break (next page)** before chapter 3 (1); in the header of chapter 3 switch off **Link to Previous** (1); type / insert the new header text, e.g. a STYLEREF field for the chapter title (1).

**Q: State two fields that could be used in the footer of a project report. [2]**
Any two: PAGE (page number) (1), NUMPAGES (total pages) (1), DATE, FILENAME, author.

**Q: A report uses both footnotes and endnotes. Explain why they should use different number formats. [2]**
So the reader can tell which list a reference mark refers to (1), e.g. footnotes 1, 2, 3 and endnotes i, ii, iii — otherwise a "2" is ambiguous (1).

**Q: A test-plan table continues over four pages. Describe two formatting features that make it easier to read. [4]**
Repeat header rows (1) so the column headings appear at the top of every page (1). Turn off "allow row to break across pages" (1) so a test case is never split between pages (1). *(Also: caption with number; shading/banded rows; alignment.)*

**Q: Explain one advantage of a cross-reference over typing "see Table 3". [2]**
A cross-reference is a field that **updates automatically** (1) when tables are added, removed or moved, so the reference is always correct (1).
:::

:::warning Common mistakes in exam answers
- Answering "use a header" when the question asks **how to make it different** — name *section break* and *Link to Previous*.
- Mixing up **header** (top margin, every page) with **header row** (first row of a table).
- Saying a caption is "a title" without saying it is **numbered automatically**.
- Describing a feature without its **benefit** in a 2-mark "describe/explain" question.
:::

:::compare Summary — formatting tools
| Element | Key formatting tools |
|---|---|
| **Headers and footers** | Section breaks, Link to Previous, Different first page, Different odd & even, page-number format / Start at, fields (PAGE, NUMPAGES, STYLEREF, DATE), Header/Footer styles |
| **Footnotes and endnotes** | Location, number format, custom mark, start at, restart each section/page, convert, Footnote Text style, separator |
| **Tables** | Repeat header rows, no row breaking, merge/split, table styles, borders and shading, alignment, AutoFit, landscape section, caption, cross-reference, sort |
:::

:::steps Check yourself
- Explain the difference between a page break and a section break, and when each is used.
- Give a title page no header, number the contents pages i, ii, iii and restart chapter 1 at page 1.
- Name four fields and what each shows.
- Change the location, number format and numbering of footnotes; convert them to endnotes.
- Format a long table so that its header repeats and rows are not split; add a caption and a cross-reference.
:::
