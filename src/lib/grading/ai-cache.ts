import "server-only";
import { createHash } from "node:crypto";
import { createAdminClient } from "../supabase/admin";
import { OPENAI_MODEL, OPENAI_REASONING_EFFORT } from "../server-env";
import type { QuestionType } from "../questions/types";
import { PROMPT_VERSION, type AiMarkingResult, type AiUsage } from "./ai";

// Reuse of AI marking results for identical answers, and a log of every
// OpenAI call so spending can be monitored (tables in migration 0007).

export type Effort = "minimal" | "low" | "medium" | "high";

/** Long written answers keep deeper reasoning; short answers are marked with less. */
export function effortFor(type: QuestionType, marks: number): Effort {
  if (type === "extended" || type === "scenario" || marks >= 5) return "medium";
  return OPENAI_REASONING_EFFORT;
}

/**
 * Same question + same prompt inputs (mark scheme, stem, instructions) + same
 * answer, ignoring case, spacing and final punctuation. Editing the mark
 * scheme, the prompt or the model therefore never reuses an old result.
 */
export function cacheKey(p: { questionId: string; promptInputs: unknown; answerText: string; effort: Effort }) {
  const normalised = p.answerText.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").replace(/[.;,!\s]+$/, "").trim();
  return createHash("sha256")
    .update([PROMPT_VERSION, OPENAI_MODEL, p.effort, p.questionId, JSON.stringify(p.promptInputs), normalised].join("\u0000"))
    .digest("hex");
}

type Cached = Omit<AiMarkingResult, "usage">;

export async function getCachedMarking(key: string): Promise<Cached | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("ai_grading_cache").select("result, hits").eq("cache_key", key).maybeSingle();
    if (!data) return null;
    await admin
      .from("ai_grading_cache")
      .update({ hits: (data.hits as number) + 1, last_used_at: new Date().toISOString() })
      .eq("cache_key", key);
    return data.result as Cached;
  } catch {
    return null; // the cache is an optimisation only
  }
}

/** Only confident results that need no teacher review are reused. */
export async function putCachedMarking(key: string, questionId: string, r: Cached & { usage?: AiUsage }, threshold: number) {
  if (r.needsReview || r.confidence < threshold) return;
  try {
    const { usage: _usage, ...result } = r;
    void _usage;
    await createAdminClient()
      .from("ai_grading_cache")
      .upsert({ cache_key: key, question_id: questionId, result }, { onConflict: "cache_key", ignoreDuplicates: true });
  } catch {
    // ignore
  }
}

export async function logAiUsage(p: {
  context: "practice" | "exam" | "other" | "notes";
  questionId?: string | null;
  model?: string | null;
  effort?: Effort | null;
  cacheHit: boolean;
  usage?: AiUsage;
}) {
  try {
    await createAdminClient()
      .from("ai_usage")
      .insert({
        context: p.context,
        question_id: p.questionId ?? null,
        model: p.model ?? null,
        reasoning_effort: p.effort ?? null,
        cache_hit: p.cacheHit,
        prompt_tokens: p.usage?.promptTokens ?? 0,
        completion_tokens: p.usage?.completionTokens ?? 0,
        reasoning_tokens: p.usage?.reasoningTokens ?? 0,
        cached_tokens: p.usage?.cachedTokens ?? 0,
      });
  } catch {
    // logging must never break marking
  }
}
