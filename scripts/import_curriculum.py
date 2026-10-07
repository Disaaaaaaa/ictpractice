#!/usr/bin/env python3
"""
Builds curriculum JSON from the NIS source documents.

    python3 scripts/import_curriculum.py \
        --grade11 "КТП_11_Computer_Science_Grade_2026-2027.docx" \
        --grade12 "КТП_12 кл_англ_26-27_186ч.docx" \
        --papers  "PAPER 1-2-3.docx" \
        --version NIS_CS_2026_2027 --year 2026-2027

Outputs:
    content/curriculum/<version>.json      school programme (KTP) + derived paper mapping
    content/curriculum/exam_spec.json      Paper 1-2-3 specification as published

The KTP and the Paper document number some objectives differently (e.g. 11.3.1.1),
so the Paper document is imported as its own curriculum version and the active
programme is mapped to papers by strand (X.Y of the code) plus explicit overrides.
"""
import argparse
import json
import re
import sys
from pathlib import Path

import docx
from docx.table import Table
from docx.text.paragraph import Paragraph

LO_RE = re.compile(r"(\d{2}\.\d+\.\d+\.\d+)\s*")
ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4}
NON_CONTENT = re.compile(
    r"^(SAU\b|exam preparation|review\b|mini project|revision|preparation for revision)", re.I
)

# Strand → (paper, section) overrides for the 2026-2027 KTP numbering.
STRAND_OVERRIDES = {
    "11.5.4": (3, "5.3"),  # KTP 11.5.4.x = scripting / testing → Programming and testing the system
}
CODE_OVERRIDES = {
    "11.3.2.1": (2, "2.2"),  # minimum hardware requirements → Engineering (spec 11.2.2.7)
}

# Paper 1-2-3 objectives that the 2026-2027 KTP does not teach (or only partly).
# They keep their Paper-document codes (exam-specification version) and are linked
# to topics with "<code>@paper". See docs/LO_COVERAGE.md.
EXAM_ONLY_TOPICS = [
    {"slug": "paper-blockchain", "title": "Blockchain technologies",
     "objectives": ["11.1.2.6"], "placements": [(1, "1.2")]},
    {"slug": "paper-ethics-and-ownership", "title": "Copyright, open and closed source, cloud technologies",
     "objectives": ["11.1.3.1", "11.1.3.2", "11.1.3.3", "11.1.3.4", "11.1.3.5"], "placements": [(1, "1.3")]},
    {"slug": "paper-cpu-memory-and-peripherals", "title": "CPU, memory and peripherals",
     "objectives": ["11.3.2.1", "11.3.2.2", "11.3.4.1", "11.3.4.2", "11.3.4.3"], "placements": [(1, "3.2"), (1, "3.4")]},
    {"slug": "paper-translators-and-language-generations", "title": "Generations of programming languages and translators",
     "objectives": ["11.5.1.1", "11.5.1.7", "11.5.1.8"], "placements": [(1, "5.1")]},
    {"slug": "paper-ip-addressing", "title": "IP addressing: format, public and private addresses",
     "objectives": ["11.6.3.2", "11.6.3.3"], "placements": [(1, "6.3")]},
    {"slug": "paper-new-system-analysis", "title": "Analysing a new system and development frameworks",
     "objectives": ["11.2.2.1", "11.2.2.2", "11.2.2.3"], "placements": [(2, "2.2")]},
    {"slug": "paper-assembly-and-trace-tables", "title": "Assembly language programs and trace tables",
     "objectives": ["11.5.1.3", "11.5.1.4"], "placements": [(3, "5.1")]},
    {"slug": "paper-arrays", "title": "Arrays: terminology and choosing 1D or 2D",
     "objectives": ["11.5.2.1", "11.5.2.2"], "placements": [(3, "5.2")]},
    {"slug": "paper-sorting-and-searching", "title": "Sorting and searching algorithms",
     "objectives": ["11.5.2.4", "11.5.2.5"], "placements": [(3, "5.2")]},
    {"slug": "paper-algorithm-efficiency", "title": "Time and space efficiency of algorithms",
     "objectives": ["11.5.2.6", "11.5.2.7"], "placements": [(3, "5.2")]},
    {"slug": "paper-mobile-application-development", "title": "Mobile application development",
     "objectives": ["11.5.4.1", "11.5.4.2", "11.5.4.3", "11.5.4.4", "11.5.4.5", "11.5.4.6"], "placements": [(3, "5.4")]},
]
# Paper objectives added to existing KTP topics that cover them partly.
PAPER_LINKS = {
    "g11-information-protection-measures": ["11.1.2.2"],
    "g11-data-analysis": ["11.2.1.8"],
    "g12-boolean-logic": ["11.3.3.1", "11.3.3.3"],
    "g11-scripting-language": ["11.5.3.8"],
    "g12-making-a-text-document": ["12.2.1.1"],
    "g12-memory-addressing-principle": ["12.3.4.2"],
}


def rows_of(table):
    out = []
    for r in table.rows:
        cells, prev = [], None
        for c in r.cells:
            if c._tc is prev:
                continue
            prev = c._tc
            cells.append(" ".join(c.text.split()))
        out.append(cells)
    return out


def iter_blocks(path):
    d = docx.Document(path)
    for child in d.element.body.iterchildren():
        tag = child.tag.split("}")[1]
        if tag == "p":
            t = Paragraph(child, d).text.strip()
            if t:
                yield "p", t
        elif tag == "tbl":
            yield "t", rows_of(Table(child, d))


def split_objectives(text):
    """'11.3.1.1 classify software 11.3.1.2 describe ...' → [(code, description)]"""
    parts = LO_RE.split(text or "")
    out = []
    for i in range(1, len(parts) - 1, 2):
        code, desc = parts[i], parts[i + 1].strip().rstrip(";").strip()
        if desc:
            desc = desc[0].lower() + desc[1:] if not desc[:2].isupper() else desc
        out.append((code, desc))
    return out


def slugify(s):
    s = s.lower().replace("&", " and ")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-+", "-", s)


def parse_ktp(path, grade):
    tables = [b for kind, b in iter_blocks(path) if kind == "t"]
    plan = max(tables, key=len)
    terms, objectives, warnings = [], {}, []
    term = unit = None
    for row in plan[1:]:
        first = row[0]
        if len(row) == 1 or len(set(row)) == 1:
            m = re.match(r"^Term\s+([IV]+)(?:\s*[—-]\s*(\d+)\s*hours)?", first)
            if m:
                term = {"number": ROMAN[m.group(1)], "title": f"Term {m.group(1)}",
                        "hours": int(m.group(2)) if m.group(2) else None, "units": []}
                terms.append(term)
                continue
            m = re.match(r"^(\d{2}\.\d[A-ZА-Я])\s*:?\s*(.+)$", first)
            if m:
                code = m.group(1).replace("А", "A").replace("В", "B").replace("С", "C")
                unit = {"code": code, "title": m.group(2).strip(), "topics": []}
                term["units"].append(unit)
                continue
            warnings.append(f"unrecognised heading row: {first!r}")
            continue
        if len(row) < 6:
            continue
        lessons, hours, title, period, resources, lo_text = row[:6]
        if NON_CONTENT.match(title):
            continue
        los = split_objectives(lo_text)
        if not los:
            warnings.append(f"topic without objectives skipped: {title!r}")
            continue
        for code, desc in los:
            if code in objectives and objectives[code] != desc:
                warnings.append(f"{code}: keeping first wording; ignored variant {desc!r}")
            objectives.setdefault(code, desc)
        unit["topics"].append({
            "slug": f"g{grade}-{slugify(title)}",
            "title": title.strip().rstrip("."),
            "lessons": lessons,
            "hours": int(hours) if hours.isdigit() else None,
            "period": period,
            "resources": resources,
            "objectives": list(dict.fromkeys(c for c, _ in los)),
        })
    return terms, objectives, warnings


def parse_papers(path):
    papers, current = [], None
    for kind, block in iter_blocks(path):
        if kind == "p":
            m = re.match(r"^PAPER\s+(\d)", block, re.I)
            if m:
                current = {"number": int(m.group(1)), "title": f"Paper {m.group(1)}", "groups": []}
                papers.append(current)
            continue
        group = None
        for row in block:
            if len(set(row)) == 1:
                group = {"title": row[0].strip().title().replace(" And ", " and "), "sections": []}
                current["groups"].append(group)
                continue
            sec_label, lo_text = row[0], row[1]
            m = re.match(r"^(\d+\.\d+)\s+(.+)$", sec_label)
            code, title = m.group(1), m.group(2).strip()
            section = next((s for s in group["sections"] if s["code"] == code), None)
            if section is None:
                section = {"code": code, "title": title, "objectives": []}
                group["sections"].append(section)
            for lo_code, desc in split_objectives(lo_text):
                section["objectives"].append({"code": lo_code, "description": desc})
    return papers


def words(s):
    return set(re.findall(r"[a-z]{4,}", s.lower()))


def similar(a, b):
    wa, wb = words(a), words(b)
    return bool(wa and wb) and len(wa & wb) / len(wa | wb) >= 0.4


def map_to_papers(objectives, papers):
    """code → {paper, section} for the active programme."""
    by_strand, spec = {}, {}
    for p in papers:
        for g in p["groups"]:
            for s in g["sections"]:
                by_strand.setdefault(s["code"], []).append(p["number"])
                for o in s["objectives"]:
                    spec[o["code"]] = (p["number"], s["code"], o["description"])
    mapping, unmapped = {}, []
    for code, desc in objectives.items():
        g, strand_a, strand_b, _ = code.split(".")
        strand = f"{strand_a}.{strand_b}"
        prefix = f"{g}.{strand}"
        if code in CODE_OVERRIDES:
            paper, section = CODE_OVERRIDES[code]
        elif prefix in STRAND_OVERRIDES:
            paper, section = STRAND_OVERRIDES[prefix]
        elif code in spec and similar(spec[code][2], desc):
            paper, section = spec[code][0], spec[code][1]
        elif strand in by_strand:
            paper, section = min(by_strand[strand]), strand
        else:
            unmapped.append(code)
            continue
        mapping[code] = {"paper": paper, "section": section}
    return mapping, unmapped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--grade11", required=True)
    ap.add_argument("--grade12", required=True)
    ap.add_argument("--papers", required=True)
    ap.add_argument("--version", default="NIS_CS_2026_2027")
    ap.add_argument("--year", default="2026-2027")
    ap.add_argument("--out", default="content/curriculum")
    a = ap.parse_args()

    grades, objectives, warnings = [], {}, []
    for number, path in ((11, a.grade11), (12, a.grade12)):
        terms, los, warn = parse_ktp(path, number)
        grades.append({"number": number, "title": f"Grade {number}", "terms": terms})
        objectives.update(los)
        warnings += [f"G{number}: {w}" for w in warn]

    papers = parse_papers(a.papers)
    mapping, unmapped = map_to_papers(objectives, papers)
    warnings += [f"objective not mapped to any paper: {c}" for c in unmapped]

    spec_codes = {o["code"] for p in papers for g in p["groups"] for s in g["sections"] for o in s["objectives"]}
    topic_slugs = {t["slug"] for g in grades for term in g["terms"] for u in term["units"] for t in u["topics"]}
    for t in EXAM_ONLY_TOPICS:
        for c in t["objectives"]:
            assert c in spec_codes, f"{t['slug']}: {c} not in the Paper document"
    for slug, codes in PAPER_LINKS.items():
        assert slug in topic_slugs, f"unknown topic {slug}"
        for c in codes:
            assert c in spec_codes, f"{slug}: {c} not in the Paper document"

    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    programme = {
        "code": a.version,
        "title": f"NIS Computer Science {a.year}",
        "academic_year": a.year,
        "kind": "school_programme",
        "source_documents": [Path(a.grade11).name, Path(a.grade12).name, Path(a.papers).name],
        "grades": grades,
        "objectives": [{"code": c, "description": d} for c, d in sorted(
            objectives.items(), key=lambda kv: [int(x) for x in kv[0].split(".")])],
        "papers": [{"number": p["number"], "title": p["title"],
                    "groups": [{"title": g["title"],
                                "sections": [{"code": s["code"], "title": s["title"]} for s in g["sections"]]}
                               for g in p["groups"]]} for p in papers],
        "objective_papers": mapping,
        "exam_only_topics": [
            {**t, "objectives": [f"{c}@paper" for c in t["objectives"]],
             "placements": [{"paper": p, "section": sec} for p, sec in t["placements"]]}
            for t in EXAM_ONLY_TOPICS
        ],
        "paper_links": {k: [f"{c}@paper" for c in v] for k, v in PAPER_LINKS.items()},
    }
    (out / f"{a.version}.json").write_text(json.dumps(programme, ensure_ascii=False, indent=2) + "\n")
    spec = {
        "code": "NIS_CS_EXAM_SPEC",
        "title": "NIS Computer Science — Paper 1/2/3 specification",
        "academic_year": a.year,
        "kind": "exam_specification",
        "source_documents": [Path(a.papers).name],
        "papers": papers,
    }
    (out / "exam_spec.json").write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n")

    n_topics = sum(len(u["topics"]) for g in grades for t in g["terms"] for u in t["units"])
    print(f"grades={len(grades)} topics={n_topics} objectives={len(objectives)} mapped={len(mapping)}")
    for w in warnings:
        print("warning:", w, file=sys.stderr)


if __name__ == "__main__":
    main()
