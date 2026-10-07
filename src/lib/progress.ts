import "server-only";
import { cache } from "react";
import { createClient } from "./supabase/server";
import { getActiveVersion } from "./curriculum";
import { masteryStatus, type MasteryStatus } from "./mastery";

export type ProgressTopic = {
  id: string;
  slug: string;
  title: string;
  grade: number;
  termNumber: number;
  termTitle: string;
  unitCode: string;
  unitTitle: string;
  papers: number[];
  loIds: string[];
  sort: number;
  /** Assessed in Paper 1-2-3 but not part of the school calendar plan. */
  examOnly: boolean;
};
export type ProgressLO = {
  id: string;
  code: string;
  description: string;
  grade: number;
  papers: number[];
  topicIds: string[];
  /** "paper": objective from the Paper 1-2-3 specification (not in the KTP). */
  source: "ktp" | "paper";
};
export type ProgressContext = { topics: ProgressTopic[]; los: ProgressLO[]; loById: Map<string, ProgressLO> };

/** Curriculum facts needed to turn LO mastery into topic / term / paper progress. */
export const getProgressContext = cache(async (): Promise<ProgressContext> => {
  const version = await getActiveVersion();
  const supabase = await createClient();
  const loSelect = "id, code, description, grade, sort_key, curriculum_version_id, objective_paper_map(paper_components(number))";
  const [{ data: topicRows }, { data: ktpRows }] = await Promise.all([
    supabase
      .from("topics")
      .select("id, slug, title, sort_order, school_placements(units(code, title, terms(number, title, grades(number)))), topic_objectives(learning_objective_id)")
      .eq("curriculum_version_id", version?.id ?? "")
      .eq("status", "published"),
    supabase.from("learning_objectives").select(loSelect).eq("curriculum_version_id", version?.id ?? ""),
  ]);
  // Paper-specification objectives linked to this programme's topics.
  const ktpIds = new Set((ktpRows ?? []).map((r) => r.id as string));
  const linked = [
    ...new Set(
      ((topicRows ?? []) as unknown as { topic_objectives: { learning_objective_id: string }[] }[]).flatMap((t) =>
        t.topic_objectives.map((o) => o.learning_objective_id),
      ),
    ),
  ].filter((id) => !ktpIds.has(id));
  const { data: paperRows } = linked.length ? await supabase.from("learning_objectives").select(loSelect).in("id", linked) : { data: [] };
  const loRows = [...(ktpRows ?? []), ...(paperRows ?? [])];
  type T = {
    id: string;
    slug: string;
    title: string;
    sort_order: number;
    school_placements: { units: { code: string; title: string; terms: { number: number; title: string; grades: { number: number } } } }[];
    topic_objectives: { learning_objective_id: string }[];
  };
  type L = {
    id: string;
    code: string;
    description: string;
    grade: number;
    sort_key: number[];
    curriculum_version_id: string;
    objective_paper_map: { paper_components: { number: number } }[];
  };
  const los: ProgressLO[] = (loRows as unknown as L[])
    .sort((a, b) => {
      for (let i = 0; i < 4; i++) if (a.sort_key[i] !== b.sort_key[i]) return a.sort_key[i] - b.sort_key[i];
      return 0;
    })
    .map((l) => ({
      id: l.id,
      code: l.code,
      description: l.description,
      grade: l.grade,
      papers: [...new Set(l.objective_paper_map.map((m) => m.paper_components.number))].sort(),
      topicIds: [],
      source: l.curriculum_version_id === version?.id ? ("ktp" as const) : ("paper" as const),
    }));
  const loById = new Map(los.map((l) => [l.id, l]));
  const topics: ProgressTopic[] = ((topicRows ?? []) as unknown as T[])
    .map((t) => {
      const sp = t.school_placements[0]?.units;
      const loIds = t.topic_objectives.map((o) => o.learning_objective_id);
      for (const id of loIds) loById.get(id)?.topicIds.push(t.id);
      const loGrades = loIds.map((id) => loById.get(id)?.grade).filter((g): g is number => !!g);
      return {
        id: t.id,
        slug: t.slug,
        title: t.title,
        grade: sp?.terms.grades.number ?? (loGrades.length ? Math.min(...loGrades) : 11),
        termNumber: sp?.terms.number ?? 0,
        termTitle: sp?.terms.title ?? "Exam only",
        unitCode: sp?.code ?? "Paper",
        unitTitle: sp?.title ?? "Paper 1-2-3 specification",
        examOnly: !sp,
        papers: [...new Set(loIds.flatMap((id) => loById.get(id)?.papers ?? []))].sort(),
        loIds,
        sort: t.sort_order,
      };
    })
    .sort((a, b) => a.sort - b.sort);
  return { topics, los, loById };
});

export type TopicProgress = ProgressTopic & { mastery: number | null; status: MasteryStatus; attempted: boolean };

export function topicProgress(ctx: ProgressContext, mastery: Map<string, number>): TopicProgress[] {
  return ctx.topics.map((t) => {
    const attempted = t.loIds.some((id) => mastery.has(id));
    const value = t.loIds.length ? t.loIds.reduce((s, id) => s + (mastery.get(id) ?? 0), 0) / t.loIds.length : null;
    return { ...t, mastery: attempted ? value : null, attempted, status: masteryStatus(value, attempted) };
  });
}

/** Average over LOs (untouched = 0). Returns null when the set is empty. */
export function loAverage(loIds: string[], mastery: Map<string, number>): number | null {
  if (!loIds.length) return null;
  return loIds.reduce((s, id) => s + (mastery.get(id) ?? 0), 0) / loIds.length;
}

export function paperReadiness(ctx: ProgressContext, mastery: Map<string, number>, maxGrade = 12) {
  return [1, 2, 3].map((n) => {
    const ids = ctx.los.filter((l) => l.papers.includes(n) && l.grade <= maxGrade).map((l) => l.id);
    return { paper: n, value: loAverage(ids, mastery), loCount: ids.length };
  });
}

export function overallMastery(ctx: ProgressContext, mastery: Map<string, number>, maxGrade = 12) {
  return loAverage(
    ctx.los.filter((l) => l.grade <= maxGrade).map((l) => l.id),
    mastery,
  );
}
