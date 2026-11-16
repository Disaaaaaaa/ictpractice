"use server";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { QuestionContent } from "@/lib/questions/types";
import { runSql, type SqlRun } from "./sandbox";

// "Run" in an SQL question: runs the student's code on the question's sample
// database (a throw-away PostgreSQL in the server, see sandbox.ts) and returns
// what it produced and the tables afterwards. It never marks the answer.

const recent = new Map<string, number[]>();
function tooMany(userId: string): boolean {
  const now = Date.now();
  const list = (recent.get(userId) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  recent.set(userId, list);
  return list.length > 40;
}

export async function runSqlQuestion(questionId: string, code: string): Promise<SqlRun> {
  const profile = await requireProfile();
  if (tooMany(profile.id)) return { ok: false, results: [], error: "Too many runs — wait a minute.", tables: [] };
  const { data: q } = await createAdminClient()
    .from("questions")
    .select("content, question_type, status")
    .eq("id", questionId)
    .is("archived_at", null)
    .maybeSingle();
  const setup = (q?.content as QuestionContent | undefined)?.sql?.setup;
  if (!q || q.question_type !== "sql" || q.status !== "published" || !setup) {
    return { ok: false, results: [], error: "This question has no sample database.", tables: [] };
  }
  try {
    const r = await runSql(setup, code, { snapshot: true });
    return { ok: r.ok, results: r.results, error: r.error, tables: r.tables };
  } catch (e) {
    return { ok: false, results: [], error: `The SQL engine failed: ${(e as Error).message}`, tables: [] };
  }
}
