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
