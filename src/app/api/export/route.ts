import { NextResponse, type NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/auth";
import { getAttempts, getClassRoster, getMasteryByStudent, getVisibleStudents } from "@/lib/teacher-data";
import { getProgressContext, overallMastery, paperReadiness, topicProgress } from "@/lib/progress";
import { paperLabel, type Paper } from "@/lib/questions/types";
import type { Profile } from "@/lib/db-types";

type Cell = string | number | null;
const round = (v: number | null | undefined) => (v == null ? null : Math.round(v * 10) / 10);

function csv(rows: Cell[][]): string {
  const esc = (v: Cell) => {
    if (v == null) return "";
    let s = String(v);
    // Neutralise spreadsheet formula injection.
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

async function xlsx(sheet: string, rows: Cell[][]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "NIS Computer Science";
  const ws = wb.addWorksheet(sheet.slice(0, 31));
  rows.forEach((r) => ws.addRow(r.map((v) => (typeof v === "string" && /^[=+\-@]/.test(v) ? `'${v}` : v))));
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.columns.forEach((c) => (c.width = Math.min(40, Math.max(10, ...(c.values ?? []).map((v) => String(v ?? "").length + 2)))));
  return Buffer.from(await wb.xlsx.writeBuffer());
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const p = req.nextUrl.searchParams;
  const kind = p.get("kind") ?? "class";
  const format = p.get("format") === "csv" ? "csv" : "xlsx";
  const classId = p.get("classId");
  const examId = p.get("examId");
  const assignmentId = p.get("assignmentId");

  const students: Profile[] = classId ? ((await getClassRoster(supabase, classId))?.students ?? []) : await getVisibleStudents(supabase);
  const ids = students.map((s) => s.id);
  const ctx = await getProgressContext();
  const mastery = await getMasteryByStudent(supabase, ids);
  const empty = new Map<string, number>();
  const rows: Cell[][] = [];
  let name = "export";

  if (kind === "exam") {
    const attempts = (await getAttempts(supabase, { studentIds: ids, examId: examId ?? undefined, assignmentId: assignmentId ?? undefined, limit: 5000 })).filter((a) => a.status !== "IN_PROGRESS");
    const versionIds = [...new Set(attempts.map((a) => a.exam_version_id))];
    const { data: payloads } = versionIds.length ? await supabase.from("exam_version_payloads").select("exam_version_id, paper").in("exam_version_id", versionIds) : { data: [] };
    const questions = examId && payloads?.length ? (payloads[0].paper as Paper).questions : [];
    const { data: results } = attempts.length
      ? await supabase.from("grading_results").select("attempt_id, question_id, final_mark").in("attempt_id", attempts.map((a) => a.id))
      : { data: [] };
    const mark = new Map((results ?? []).map((r) => [`${r.attempt_id}|${r.question_id}`, r.final_mark == null ? null : Number(r.final_mark)]));
    rows.push(["Student", "Username", "Exam", "Started", "Submitted", "Status", "Submission", "Score", "Max", "Percentage", "Violations", ...questions.map((q) => `Q${paperLabel(q)} (${q.marks})`)]);
    for (const a of attempts) {
      rows.push([
        a.profiles ? displayName(a.profiles) : "", a.profiles?.username ?? "", a.exams?.title ?? "", a.started_at, a.submitted_at, a.status,
        a.submission_reason, a.score == null ? null : Number(a.score), a.max_score == null ? null : Number(a.max_score),
        round(a.percentage == null ? null : Number(a.percentage)), a.violation_count,
        ...questions.map((q) => mark.get(`${a.id}|${q.id}`) ?? null),
      ]);
    }
    name = "exam-results";
  } else if (kind === "topic") {
    rows.push(["Student", "Username", ...ctx.topics.map((t) => `${t.title} (G${t.grade})`)]);
    for (const s of students) {
      const tp = new Map(topicProgress(ctx, mastery.get(s.id) ?? empty).map((t) => [t.id, t.mastery]));
      rows.push([displayName(s), s.username, ...ctx.topics.map((t) => round(tp.get(t.id)))]);
    }
    name = "topic-mastery";
  } else if (kind === "lo") {
    rows.push(["Student", "Username", ...ctx.los.map((l) => l.code)]);
    for (const s of students) rows.push([displayName(s), s.username, ...ctx.los.map((l) => round(mastery.get(s.id)?.get(l.id)))]);
    rows.push([]);
    rows.push(["Code", "Description"]);
    for (const l of ctx.los) rows.push([l.code, l.description]);
    name = "lo-mastery";
  } else {
    const attempts = await getAttempts(supabase, { studentIds: ids, status: ["GRADED"], limit: 5000 });
    rows.push(["Student", "Username", "Grade", "Status", "Overall mastery %", "Paper 1 %", "Paper 2 %", "Paper 3 %", "Exam average %", "Graded attempts", "Last activity"]);
    for (const s of students) {
      const m = mastery.get(s.id) ?? empty;
      const mine = attempts.filter((a) => a.student_id === s.id);
      const pr = paperReadiness(ctx, m, s.grade ?? 12);
      rows.push([
        displayName(s), s.username, s.grade, s.is_active ? (s.force_password_change ? "Awaiting first login" : "Active") : "Disabled",
        round(overallMastery(ctx, m, s.grade ?? 12)), ...pr.map((r) => round(r.value)),
        round(mine.length ? mine.reduce((t, a) => t + Number(a.percentage ?? 0), 0) / mine.length : null), mine.length, s.last_activity_at,
      ]);
    }
    name = "class-progress";
  }

  const stamp = new Date().toISOString().slice(0, 10);
  if (format === "csv") {
    return new NextResponse(csv(rows), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}-${stamp}.csv"` },
    });
  }
  return new NextResponse(new Uint8Array(await xlsx(name, rows)), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${name}-${stamp}.xlsx"`,
    },
  });
}
