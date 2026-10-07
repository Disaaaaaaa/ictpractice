#!/usr/bin/env python3
"""Writes docs/TOPICS.md (topic blocks for the content-generation prompts)."""
import json

d = json.load(open("content/curriculum/NIS_CS_2026_2027.json"))
spec = json.load(open("content/curriculum/exam_spec.json"))
los = {o["code"]: o["description"] for o in d["objectives"]}
spec_los, spec_paper = {}, {}
for p in spec["papers"]:
    for g in p["groups"]:
        for s in g["sections"]:
            for o in s["objectives"]:
                spec_los[o["code"]] = o["description"]
                spec_paper[o["code"]] = (p["number"], s["code"])
titles = {(p["number"], s["code"]): s["title"] for p in d["papers"] for g in p["groups"] for s in g["sections"]}


def paper_of(ref):
    if ref.endswith("@paper"):
        return spec_paper.get(ref[:-6])
    m = d["objective_papers"].get(ref)
    return (m["paper"], m["section"]) if m else None


def describe(ref):
    return spec_los[ref[:-6]] if ref.endswith("@paper") else los[ref]


def block(slug, title, placement, refs):
    ps = sorted({paper_of(r) for r in refs if paper_of(r)})
    out = [f"## {title} — `{slug}`", "", "```text", f"TOPIC_SLUG: {slug}", f"TOPIC_TITLE: {title}", f"PLACEMENT: {placement}",
           "PAPER: " + "; ".join(f"Paper {p} — {s} {titles.get((p, s), '')}" for p, s in ps), "LEARNING_OBJECTIVES:"]
    out += [f"- {r} {describe(r)}" for r in refs]
    return out + ["```", ""]


lines = ["# Topics and learning objectives (NIS_CS_2026_2027)", "",
         "Copy one block into the content-generation prompts (docs/PROMPTS.md).",
         "Codes ending in `@paper` come from the Paper 1-2-3 specification (not the KTP) — keep the suffix.", ""]
links = d.get("paper_links", {})
for g in d["grades"]:
    for t in g["terms"]:
        for u in t["units"]:
            for tp in u["topics"]:
                lines += block(tp["slug"], tp["title"], f"Grade {g['number']} · {t['title']} · {u['code']} {u['title']}",
                               tp["objectives"] + links.get(tp["slug"], []))
lines += ["# Exam-only topics (Paper 1-2-3, not in the 2026-2027 calendar plan)", ""]
for tp in d.get("exam_only_topics", []):
    lines += block(tp["slug"], tp["title"], "Exam only — Paper 1-2-3 specification", tp["objectives"])
open("docs/TOPICS.md", "w").write("\n".join(lines))
print("topics:", sum(1 for l in lines if l.startswith("## ")))
