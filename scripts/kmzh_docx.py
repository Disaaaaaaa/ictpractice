"""
Builds a short-term lesson plan (ҚМЖ) in English from content/kmzh/<slug>-L<n>.json,
filling the school's template (content/kmzh/template.docx) so its layout is kept.

    python3 scripts/kmzh_docx.py content/kmzh/g12-data-protection-measures-L3.json -o out.docx

Needs python-docx. Task titles are read from content/topics/<topic>.json.
"""
import argparse
import copy
import json
import os
import re

import docx
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHOOL = "Nazarbayev Intellectual School of Science and Mathematics in Kyzylorda"
MODE = {"class": "whole class", "individual": "individual", "pair": "pairs (random)", "group": "groups of {n} (random)"}


def plain(md: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"\1", md)


def unique_cells(row):
    out = []
    for c in row.cells:
        if not any(c._tc is u._tc for u in out):
            out.append(c)
    return out


def fill(cell, lines, size=11):
    """lines: list of str | (str, {'bold': bool, 'bullet': bool, 'italic': bool}) | list of (text, bold) runs"""
    first = cell.paragraphs[0]
    ppr = copy.deepcopy(first._p.pPr) if first._p.pPr is not None else None
    for p in cell.paragraphs[1:]:
        p._p.getparent().remove(p._p)
    for r in list(first.runs):
        r._r.getparent().remove(r._r)
    for i, line in enumerate(lines):
        if isinstance(line, str):
            runs, opt = [(line, False)], {}
        elif isinstance(line, tuple) and isinstance(line[1], dict):
            runs, opt = [(line[0], line[1].get("bold", False))], line[1]
        else:
            runs, opt = line, {}
        p = first if i == 0 else cell.add_paragraph()
        if i > 0 and ppr is not None:
            if p._p.pPr is not None:
                p._p.remove(p._p.pPr)
            p._p.insert(0, copy.deepcopy(ppr))
        if opt.get("bullet"):
            p.paragraph_format.left_indent = Pt(10)
            p.paragraph_format.first_line_indent = Pt(-8)
            runs = [("• ", False)] + runs
        p.paragraph_format.space_after = Pt(2 if opt.get("gap") else 0)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for text, bold in runs:
            r = p.add_run(text)
            r.bold = bold
            r.italic = bool(opt.get("italic"))
            r.font.name = "Times New Roman"
            r.font.size = Pt(size)
            r._r.get_or_add_rPr().get_or_add_rFonts().set(qn("w:cs"), "Times New Roman")
            lang = r._r.get_or_add_rPr().find(qn("w:lang"))
            if lang is None:
                lang = r._r.get_or_add_rPr().makeelement(qn("w:lang"), {})
                r._r.get_or_add_rPr().append(lang)
            lang.set(qn("w:val"), "en-GB")


def bullets(items):
    return [(plain(x), {"bullet": True}) for x in items]


def build(plan_path, out_path):
    k = json.load(open(plan_path))
    topic = json.load(open(os.path.join(ROOT, "content", "topics", f"{k['topic']}.json")))
    titles = {q["key"]: q["title"] for q in topic["questions"]}
    live = {q["key"]: q for q in k.get("live_tasks", [])}
    titles.update({key: q["title"] for key, q in live.items()})

    d = docx.Document(os.path.join(ROOT, "content", "kmzh", "template.docx"))
    for s in d.sections:
        for p in s.header.paragraphs:
            if p.text.strip():
                for i, r in enumerate(p.runs):
                    r.text = "Short-term plan" if i == 0 else ""
    t = d.tables[0]
    R = [unique_cells(r) for r in t.rows]
    B = 12  # label size

    fill(R[0][0], [[("Unit: ", True), (k["unit"], False)], [("Lesson topic: ", True), (k["title"], False)]], B)
    fill(R[0][1], [SCHOOL], B)
    fill(R[1][1], [[("Teacher: ", True), (k["teacher"], False)]], B)
    fill(R[2][0], [[("Date: ", True), (k.get("date") or "", False)]], B)
    fill(R[2][1], [[("Grade: ", True), (f"{k['grade']}", False), ("     Class: ", True), (k.get("class") or "", False)]], B)

    labels = ["Learning objectives:", "Lesson objectives:", "Assessment criteria and descriptors:", "Language objectives:",
              "NIS values in action:", "Cross-curricular links:", "Use of ICT:", "Previous learning:"]
    for i, lab in enumerate(labels):
        fill(R[3 + i][0], [(lab, {"bold": True})], B)

    fill(R[3][1], [[(lo["code"] + " ", True), (lo["text"], False)] for lo in k["learning_objectives"]])
    lo = k["lesson_objectives"]
    fill(R[4][1], [
        [("All learners will be able to: ", True), (lo["all"], False)],
        [("Most learners will be able to: ", True), (lo["most"], False)],
        [("Some learners will be able to: ", True), (lo["some"], False)],
    ])
    crit = []
    for c in k["assessment_criteria"]:
        crit.append((c["criterion"], {"bold": True}))
        crit += [(x, {"bullet": True}) for x in c["descriptors"]]
    fill(R[5][1], crit)
    lang = k["language_objectives"]
    fill(R[6][1], [("Learners can:", {"bold": True})] + bullets(lang["learners_can"])
         + [[("Subject vocabulary: ", True), (", ".join(lang["vocabulary"]), False)], ("Useful phrases for discussion and writing:", {"bold": True})]
         + [(x, {"bullet": True, "italic": True}) for x in lang["phrases"]])
    fill(R[7][1], [[(v["value"] + ": ", True), (v["action"], False)] for v in k["values"]])
    fill(R[8][1], bullets(k["cross_curricular"]))
    fill(R[9][1], bullets(k["ict"]))
    fill(R[10][1], [k["previous_learning"]])

    fill(R[11][0], [("Lesson stages", {"bold": True})], B)
    fill(R[11][1], [("Planned activities", {"bold": True})], B)
    fill(R[11][2], [("Resources", {"bold": True})], B)

    clock = 0
    for si, st in enumerate(k["stages"]):
        start = clock
        acts, res = [], []
        for b in st["blocks"]:
            mode = MODE[b["mode"]].format(n=b.get("group_size", 4))
            acts.append([(f"{clock}–{clock + b['minutes']} min  ", True), (f"{b['title']} ", True), (f"({mode})", False)])
            acts.append([("Teacher: ", True), (plain(b["teacher"]), False)])
            acts.append([("Learners: ", True), (plain(b["learners"]), False)])
            if b.get("poll"):
                acts.append([("Poll: ", True), (plain(b["poll"]["question"]) + " (" + " / ".join(b["poll"]["options"]) + ")", False)])
            if b.get("together"):
                for key in b["together"]:
                    acts.append([("Together task: ", True), (plain(live[key]["text"]), False)])
            if b.get("tasks"):
                acts.append([("Tasks: ", True), ("; ".join(titles[x] for x in b["tasks"]), False)])
            if b.get("scenarios"):
                cl = k["scenarios"][b["scenarios"]]
                acts.append([("Client cards: ", True), ("; ".join(c["client"] for c in cl), False)])
            if b.get("homework"):
                acts.append([("Homework: ", True), ("finish the practice questions — " + "; ".join(titles[x] for x in b["homework"]) + ".", False)])
            res += [(x, {"bullet": True}) for x in b.get("resources", [])]
            clock += b["minutes"]
            acts.append(("", {}))
        name = {"Beginning": "Beginning of the lesson", "Middle": "Middle of the lesson", "End": "End of the lesson"}[st["stage"]]
        fill(R[12 + si][0], [(name, {"bold": True}), f"({st['minutes']} min)", f"{start}–{clock} min"], B)
        fill(R[12 + si][1], acts[:-1], 10.5)
        fill(R[12 + si][2], res, 10.5)

    fill(R[15][0], [("Additional information", {"bold": True})], B)
    fill(R[16][0], [[("Differentiation: ", True), ("how do you plan to give more support? How do you plan to challenge the more able learners?", False)]], 11)
    fill(R[16][1], [[("Assessment: ", True), ("how are you planning to check learners' learning?", False)]], 11)
    fill(R[16][2], [("Cross-curricular links", {"bold": True}), ("Health and safety", {"bold": True}), ("ICT links", {"bold": True}), ("NIS values in action", {"bold": True})], 11)
    dif = k["differentiation"]
    fill(R[17][0], [("More support:", {"bold": True})] + bullets(dif["support"]) + [("More able learners:", {"bold": True})] + bullets(dif["stretch"]), 10.5)
    fill(R[17][1], bullets(k["assessment"]), 10.5)
    fill(R[17][2], [("Cross-curricular links:", {"bold": True})] + bullets(k["cross_curricular"])
         + [("Health and safety:", {"bold": True})] + bullets(k["safety"])
         + [("ICT links:", {"bold": True})] + bullets(k["ict"][:2])
         + [("NIS values:", {"bold": True})] + [(v["value"], {"bullet": True}) for v in k["values"]], 10.5)
    fill(R[18][0], [("Reflection", {"bold": True})] + [(x, {"italic": True}) for x in k["reflection"]], 11)
    fill(R[19][0], [""], 11)
    d.save(out_path)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("-o", "--out", required=True)
    a = ap.parse_args()
    build(a.plan, a.out)
    print("✓", a.out)
