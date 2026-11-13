import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const { scoreLesson } = await import("@/lib/lessons");

const row = (notes_pct: number | null) => ({
  student_id: "s", topic_id: "t", lesson_no: 1, deadline: null,
  practice_awarded: 32, practice_max: 64, notes_pct, exam_id: "e", exam_pct: 50, exam_pending: false,
});

describe("scoreLesson", () => {
  it("gives the full notes points from 70%", () => {
    expect(scoreLesson(row(70)).notes).toBe(2);
    expect(scoreLesson(row(71)).notes).toBe(2);
    expect(scoreLesson(row(100)).notes).toBe(2);
  });
  it("scales notes below 70% and leaves practice and the test proportional", () => {
    const s = scoreLesson(row(68));
    expect(s.notes).toBe(1.4);
    expect(s.practice).toBe(1);
    expect(s.exam).toBe(1);
    expect(scoreLesson(row(null)).notes).toBe(0);
  });
});

describe("a topic's single Exam Mode (lesson_no 0)", () => {
  const row = { student_id: "s", topic_id: "t", lesson_no: 0, deadline: null, practice_awarded: 0, practice_max: 0, notes_pct: null, exam_id: "e", exam_pct: 75, exam_pending: false };
  it("gives only exam points, up to 2", () => {
    expect(scoreLesson(row)).toMatchObject({ practice: 0, notes: 0, exam: 1.5, total: 1.5, max: 2 });
    expect(scoreLesson({ ...row, exam_pct: 80 })).toMatchObject({ exam: 2, total: 2 });
    expect(scoreLesson({ ...row, exam_pct: 79 })).toMatchObject({ exam: 1.6 });
    expect(scoreLesson({ ...row, exam_pct: null, exam_pending: true })).toMatchObject({ total: 0, max: 2, examPending: true });
  });
  it("a lesson without a test is worth practice + notes only", () => {
    expect(scoreLesson({ ...row, lesson_no: 1, practice_awarded: 10, practice_max: 10, notes_pct: 80, exam_id: null, exam_pct: null }).max).toBe(4);
  });
});
