import "server-only";
import { createClient } from "./supabase/server";

export type MockRow = {
  id: string;
  title: string;
  description: string | null;
  year: number;
  status: string;
  duration_minutes: number;
  availability_start: string | null;
  availability_end: string | null;
  attempt_limit: number | null;
  paper: { number: number; title: string } | null;
  version: { question_count: number; total_marks: number } | null;
};

export async function getMocks(filter: { year?: number; paper?: number } = {}): Promise<MockRow[]> {
  const supabase = await createClient();
  let q = supabase
    .from("exams")
    .select(
      "id, title, description, year, status, duration_minutes, availability_start, availability_end, attempt_limit, paper_components(number, title), current:current_version_id(question_count, total_marks)",
    )
    .eq("kind", "mock")
    .is("archived_at", null)
    .order("year", { ascending: false })
    .order("title");
  if (filter.year) q = q.eq("year", filter.year);
  const { data } = await q;
  type Raw = Omit<MockRow, "paper" | "version"> & {
    paper_components: { number: number; title: string } | null;
    current: { question_count: number; total_marks: number } | null;
  };
  return ((data ?? []) as unknown as Raw[])
    .map(({ paper_components, current, ...m }) => ({ ...m, paper: paper_components, version: current }))
    .filter((m) => !filter.paper || m.paper?.number === filter.paper);
}

export function mockAvailability(m: Pick<MockRow, "status" | "availability_start" | "availability_end">): {
  label: string;
  tone: "success" | "warning" | "neutral" | "info";
  open: boolean;
} {
  const now = Date.now();
  if (m.status === "draft") return { label: "Draft", tone: "neutral", open: false };
  if (m.status === "closed" || (m.availability_end && new Date(m.availability_end).getTime() < now))
    return { label: "Closed", tone: "neutral", open: false };
  if (m.availability_start && new Date(m.availability_start).getTime() > now) return { label: "Scheduled", tone: "info", open: false };
  return { label: "Open", tone: "success", open: true };
}
