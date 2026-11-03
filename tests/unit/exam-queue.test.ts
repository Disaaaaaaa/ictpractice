import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
// the AI must never be called in queue mode
vi.mock("@/lib/grading/ai", () => ({ gradeWithAI: vi.fn(() => { throw new Error("AI called"); }), AiUnavailableError: class extends Error {} }));
vi.mock("@/lib/grading/ai-cache", () => ({ cacheKey: vi.fn(), getCachedMarking: vi.fn(), logAiUsage: vi.fn() }));

const { gradeAnswer } = await import("@/lib/grading/engine");

const marking = (method: "AI" | "AUTO" | "HYBRID", accepted = {}) => ({
  question_type: "short_answer", grading_method: method, marks: 2, command_word: "state", mark_scheme: "x",
  marking_points: [], model_answer: null, accepted_answers: accepted, ai_grading_instructions: null, explanation: null,
}) as never;

describe("exam marking in queue mode", () => {
  it("sends written answers to the teacher without calling the AI", async () => {
    const r = await gradeAnswer({ questionText: "Q", questionType: "short_answer", objectives: [], marking: marking("AI"), answer: { text: "my answer" }, aiConfidenceThreshold: 0.8, aiDisabled: true });
    expect(r.status).toBe("COMPLETE");
    expect(r.needsReview).toBe(true);
    expect(r.awarded).toBeNull();
  });
  it("still marks auto-marked answers at once", async () => {
    const r = await gradeAnswer({ questionText: "Q", questionType: "short_answer", objectives: [], marking: marking("AUTO", { values: ["tuple"] }), answer: { text: "tuple" }, aiConfidenceThreshold: 0.8, aiDisabled: true });
    expect(r.awarded).toBe(2);
    expect(r.needsReview).toBe(false);
  });
});
