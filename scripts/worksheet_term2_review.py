"""Printable written review worksheet for grade 11, term 2 (databases, ERD,
data dictionary L1), with a separate mark scheme. Run:
    python3 scripts/worksheet_term2_review.py
Writes content/kmzh/out/Worksheet_G11_Term2_Review.docx and ..._MarkScheme.docx
"""
from pathlib import Path
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = Path(__file__).resolve().parent.parent / "content" / "kmzh" / "out"
FONT = "Arial"


def new_doc():
    d = Document()
    s = d.sections[0]
    s.page_height, s.page_width = Cm(29.7), Cm(21.0)
    s.left_margin = s.right_margin = Cm(1.8)
    s.top_margin = s.bottom_margin = Cm(1.5)
    st = d.styles["Normal"]
    st.font.name = FONT
    st.font.size = Pt(11)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    st.paragraph_format.space_after = Pt(3)
    return d


def para(d, text="", bold=False, size=None, italic=False, align=None, after=None, before=None, color=None):
    p = d.add_paragraph()
    add_runs(p, text, bold, size, italic, color)
    if align:
        p.alignment = align
    if after is not None:
        p.paragraph_format.space_after = Pt(after)
    if before is not None:
        p.paragraph_format.space_before = Pt(before)
    return p


def add_runs(p, text, bold=False, size=None, italic=False, color=None):
    """**bold** and `code` inside text."""
    import re
    for part in re.split(r"(\*\*[^*]+\*\*|`[^`]+`)", text):
        if not part:
            continue
        r = p.add_run(part.strip("*`") if part[:2] == "**" or part[:1] == "`" else part)
        r.bold = bold or part.startswith("**")
        r.italic = italic
        if part.startswith("`"):
            r.font.name = "Courier New"
        if size:
            r.font.size = Pt(size)
        if color:
            r.font.color.rgb = RGBColor.from_string(color)


def question(d, num, text, marks=None):
    p = d.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.keep_with_next = True
    tab = p.paragraph_format.tab_stops
    tab.add_tab_stop(Cm(17.4), alignment=2)  # right
    r = p.add_run(f"{num}  ")
    r.bold = True
    add_runs(p, text)
    if marks is not None:
        r = p.add_run(f"\t[{marks}]")
        r.bold = True


def lines(d, n):
    t = d.add_table(rows=n, cols=1)
    fix_table(t, [17.4], only_bottom=True)
    for r in t.rows:
        r.height = Cm(0.85)
    d.add_paragraph().paragraph_format.space_after = Pt(0)


def fix_table(t, widths, borders=True, only_bottom=False):
    """Explicit widths and borders, so every program (Word, Pages, Google Docs) shows the same table."""
    t.autofit = False
    tblPr = t._tbl.tblPr
    w = OxmlElement("w:tblW")
    w.set(qn("w:w"), str(int(sum(widths) * 567)))
    w.set(qn("w:type"), "dxa")
    tblPr.append(w)
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    grid = t._tbl.tblGrid
    for gc, wd in zip(grid.findall(qn("w:gridCol")), widths):
        gc.set(qn("w:w"), str(int(wd * 567)))
    for row in t.rows:
        for c, wd in zip(row.cells, widths):
            c.width = Cm(wd)
    if borders:
        b = OxmlElement("w:tblBorders")
        for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
            e = OxmlElement(f"w:{side}")
            on = not only_bottom or side in ("bottom", "insideH")
            e.set(qn("w:val"), "single" if on else "nil")
            e.set(qn("w:sz"), "4" if only_bottom else "6")
            e.set(qn("w:color"), "999999" if only_bottom else "555555")
            b.append(e)
        tblPr.append(b)


def shade(cell, hex_):
    tcPr = cell._tc.get_or_add_tcPr()
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear")
    sh.set(qn("w:color"), "auto")
    sh.set(qn("w:fill"), hex_)
    tcPr.append(sh)


def table(d, rows, widths, header=True, height=None, mono_cols=()):
    t = d.add_table(rows=len(rows), cols=len(widths))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(rows):
        for j, val in enumerate(row):
            c = t.cell(i, j)
            c.width = Cm(widths[j])
            c.paragraphs[0].text = ""
            add_runs(c.paragraphs[0], str(val), bold=header and i == 0, size=10)
            if j in mono_cols and i > 0:
                for r in c.paragraphs[0].runs:
                    r.font.name = "Courier New"
            if header and i == 0:
                shade(c, "E8EEF7")
        if height and (i > 0 or not header):
            t.rows[i].height = Cm(height)
    fix_table(t, widths)
    d.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def box(d, height_cm, caption=""):
    t = d.add_table(rows=1, cols=1)
    t.style = "Table Grid"
    t.rows[0].height = Cm(height_cm)
    fix_table(t, [17.4])
    c = t.cell(0, 0)
    if caption:
        add_runs(c.paragraphs[0], caption, size=9, italic=True, color="777777")
    d.add_paragraph().paragraph_format.space_after = Pt(2)


def section(d, title, marks):
    p = para(d, f"{title}", bold=True, size=12.5, before=10, after=2)
    r = p.add_run(f"   ({marks} marks)")
    r.font.size = Pt(10)
    p.paragraph_format.keep_with_next = True


def header(d, title, sub):
    para(d, "NIS · Computer Science · Grade 11", size=9, color="666666", after=0)
    para(d, title, bold=True, size=16, after=0)
    para(d, sub, size=10.5, color="444444", after=6)
    t = d.add_table(rows=1, cols=3)
    t.style = "Table Grid"
    for c, (lab, w) in zip(t.rows[0].cells, (("Name:", 9.4), ("Class:", 3.5), ("Mark:        / 30", 4.5))):
        c.width = Cm(w)
        add_runs(c.paragraphs[0], lab, bold=True, size=10.5)
    t.rows[0].height = Cm(0.9)
    fix_table(t, [9.4, 3.5, 4.5])
    para(d, "", after=2)


# --------------------------------------------------------------- worksheet
def worksheet():
    d = new_doc()
    header(d, "Term 2 review: databases, ERD and the data dictionary", "Time: 30 minutes · Answer all questions in writing · No laptops or notes · Total: 30 marks")

    section(d, "Section A — Databases", 10)
    question(d, "1", "Complete the table with the correct database term.", 3)
    table(d, [["Description", "Term"], ["All the data about one item, e.g. one student (one row)", ""], ["One item of data stored about every record, e.g. Surname (one column)", ""], ["A collection of related records about one entity", ""]], [12.4, 5.0], height=0.85)
    question(d, "2", "State **two** advantages of a relational database compared with a flat file.", 2)
    lines(d, 3)
    para(d, "A school database has the table:", before=6)
    para(d, "`Students ( StudentID, Surname, Phone, ClassID )`   — `ClassID` is the primary key of the table `Classes`.", after=2)
    question(d, "3 (a)", "Identify the primary key of `Students` and state why it is needed.", 1)
    lines(d, 2)
    question(d, "3 (b)", "Explain what a **foreign key** is, using `ClassID` as an example.", 2)
    lines(d, 3)
    question(d, "4", "The teacher adds an **index** on `Surname`. State **one** advantage and **one** disadvantage of an index.", 2)
    lines(d, 3)

    section(d, "Section B — Entity-relationship diagrams", 10)
    para(d, "A sports centre stores data about **members**, **trainers** and **classes**:")
    for s in ("Each member has one personal trainer; a trainer trains many members.", "A member can attend many classes, and each class has many members."):
        p = d.add_paragraph(style="List Bullet")
        add_runs(p, s)
    question(d, "5 (a)", "State the degree of the relationship between **Trainer** and **Member**.", 1)
    lines(d, 1)
    question(d, "5 (b)", "State the degree of the relationship between **Member** and **Class**.", 1)
    lines(d, 1)
    question(d, "5 (c)", "Draw the ERD for the sports centre. Resolve any many-to-many relationship with a **link entity** and show the degree of every relationship (1 and M, or crow's feet).", 4)
    box(d, 6.0)
    question(d, "5 (d)", "Name the fields of your link entity and identify its primary key.", 2)
    lines(d, 2)
    question(d, "6", "Explain how a one-to-many relationship between two tables is created using keys.", 2)
    lines(d, 3)

    section(d, "Section C — The data dictionary", 10)
    question(d, "7", "Define a **data dictionary**.", 2)
    lines(d, 2)
    question(d, "8", "Complete the data dictionary: give the most suitable **data type** and an **example** value for each field.", 4)
    table(d, [["Field name", "Description", "Data type", "Example"], ["DateOfBirth", "The pupil's date of birth", "", ""], ["Price", "Price of a meal in tenge, with tiyn", "", ""], ["IsPaid", "Whether the parents have paid", "", ""], ["Phone", "Parent's phone, e.g. starting +7", "", ""]], [3.2, 6.4, 3.6, 4.2], height=0.85)
    para(d, "(1 mark per row: both the data type and the example must be correct)", size=9, italic=True, color="666666")
    question(d, "9", "Explain **two** reasons why a data dictionary is used when a database is developed.", 2)
    lines(d, 4)
    question(d, "10", "Describe **one** difference between an **active** and a **passive** data dictionary.", 2)
    lines(d, 3)
    para(d, "End of worksheet — check your answers.", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, before=8, color="666666")
    return d


# ------------------------------------------------------------- mark scheme
MS = [
    ("Section A — Databases (10)", None),
    ("1", 3, "Record (1); Field (1); Table / relation / file (1). Accept tuple / row for record, attribute / column for field."),
    ("2", 2, "Any two (1 each): less data redundancy / each fact stored once; data stays consistent / fewer update errors (integrity); easier to update in one place; powerful queries across linked tables; better security / access rights; data can be shared by many users."),
    ("3 (a)", 1, "StudentID — it uniquely identifies each student / record (both needed for the mark)."),
    ("3 (b)", 2, "A field in one table that is the primary key of another table (1); ClassID in Students links each student to one record in Classes, so the tables are linked / it can repeat for many students (1)."),
    ("4", 2, "Advantage (1): records are found / sorted / searched faster. Disadvantage (1): takes extra storage space / inserting and updating records is slower."),
    ("Section B — Entity-relationship diagrams (10)", None),
    ("5 (a)", 1, "One-to-many (1:M) — one trainer, many members."),
    ("5 (b)", 1, "Many-to-many (M:M)."),
    ("5 (c)", 4, "Entities Trainer, Member, Class and a link entity (e.g. Attendance / Booking / MemberClass) (1); Trainer 1 — M Member, with the many end at Member (1); Member 1 — M link entity (1); Class 1 — M link entity (1). Do not award the last two marks if a direct M:M line between Member and Class remains."),
    ("5 (d)", 2, "Fields MemberID and ClassID (both foreign keys) (1); primary key = composite key (MemberID, ClassID) (1). Accept an own key such as AttendanceID with MemberID and ClassID as foreign keys."),
    ("6", 2, "The primary key of the table on the 'one' side (1) is added as a foreign key to the table on the 'many' side (1), e.g. TrainerID in Members."),
    ("Section C — The data dictionary (10)", None),
    ("7", 2, "A document / table that describes the structure of a database / data about the data (metadata) (1); for every field it lists e.g. name, data type, size, format, key, validation, description (1)."),
    ("8", 4, "1 mark per row (type and example both correct): DateOfBirth — DATE, e.g. 14/03/2009; Price — DECIMAL / REAL / CURRENCY, e.g. 850.50; IsPaid — BOOLEAN, True / False / Yes / No; Phone — VARCHAR / TEXT / STRING, e.g. +77011234567. Integer for Phone gets no mark."),
    ("9", 2, "Any two (1 each), explained: everyone uses the same agreed field names and types, so the database is consistent; primary and foreign keys get the same type / size, so tables can be linked; programmers build the tables / write SQL correctly; validation rules are recorded, so invalid data is rejected (integrity); testers choose test data from it; helps maintenance / new developers understand the database."),
    ("10", 2, "Active: kept and updated automatically by the DBMS (system catalogue) (1); passive: a separate document kept by people, updated by hand, can become out of date (1). One clear difference with both sides = 2."),
]


def markscheme():
    d = new_doc()
    para(d, "NIS · Computer Science · Grade 11 · FOR THE TEACHER", size=9, color="666666", after=0)
    para(d, "Mark scheme — Term 2 review worksheet", bold=True, size=16, after=0)
    para(d, "Total 30 marks. Accept any valid answer worded differently. Grade guide: 27–30 excellent · 21–26 good · 15–20 satisfactory · below 15 revise the term.", size=10, color="444444", after=6)
    rows = [["Question", "Marks", "Answer / marking points"]]
    for item in MS:
        if item[1] is None:
            rows.append([item[0], "", ""])
        else:
            rows.append([item[0], str(item[1]), item[2]])
    t = table(d, rows, [2.0, 1.4, 14.0])
    for i, item in enumerate(MS, start=1):
        if item[1] is None:
            a = t.cell(i, 0).merge(t.cell(i, 2))
            a.paragraphs[0].text = ""
            add_runs(a.paragraphs[0], item[0], bold=True, size=10.5)
            shade(a, "F2F2F2")
    p = para(d, "", before=8)
    add_runs(p, "**Model ERD for 5 (c):**  Trainer (TrainerID, Name) 1 —< M  Member (MemberID, Surname, TrainerID)  1 —< M  Attendance (MemberID, ClassID)  M >— 1  Class (ClassID, Name, Day)", size=10)
    return d


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    worksheet().save(OUT / "Worksheet_G11_Term2_Review.docx")
    markscheme().save(OUT / "Worksheet_G11_Term2_Review_MarkScheme.docx")
    print("written to", OUT)
