import "server-only";
import { cache } from "react";
import { createClient } from "./supabase/server";

type Supa = Awaited<ReturnType<typeof createClient>>;

export type TopicRef = { id: string; slug: string; title: string; status: string; recommended_minutes: number | null };
export type SchoolTree = {
  grade: number;
  title: string;
  /** null for the grade's plan; otherwise the earlier KTP shown instead to students of this grade */
  forStudentGrade: number | null;
  /** grade, or "11-for-12" for a cohort plan (URL parameter) */
  key: string;
  terms: {
    id: string;
    number: number;
    title: string;
    hours: number | null;
    units: {
      id: string;
      code: string;
      title: string;
      topics: (TopicRef & { lessons: string | null; period: string | null })[];
      /** topics of the unit the viewer cannot see (hidden from their class, or not published) */
      hiddenTopics: number;
    }[];
  }[];
}[];
export type PaperTree = {
  id: string;
  number: number;
  title: string;
  groups: {
    id: string;
    title: string;
    sections: { id: string; code: string | null; title: string; topics: TopicRef[] }[];
  }[];
}[];

export const getActiveVersion = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("curriculum_versions")
    .select("id, code, title, academic_year")
    .eq("kind", "school_programme")
    .eq("is_active", true)
    .maybeSingle();
  return data as { id: string; code: string; title: string; academic_year: string } | null;
});

const byOrder = <T extends { sort_order?: number | null }>(a: T, b: T) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

export const getSchoolTree = cache(async (): Promise<SchoolTree> => {
  const version = await getActiveVersion();
  if (!version) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("grades")
    .select(
      "number, title, sort_order, for_student_grade, terms(id, number, title, hours, units(id, code, title, sort_order, school_placements(lessons, period, sort_order, topics(id, slug, title, status, recommended_minutes))))",
    )
    .eq("curriculum_version_id", version.id)
    .order("number")
    .order("sort_order");
  type Row = {
    number: number;
    title: string;
    for_student_grade: number | null;
    terms: {
      id: string;
      number: number;
      title: string;
      hours: number | null;
      units: {
        id: string;
        code: string;
        title: string;
        sort_order: number;
        school_placements: { lessons: string | null; period: string | null; sort_order: number; topics: TopicRef | null }[];
      }[];
    }[];
  };
  return ((data ?? []) as unknown as Row[]).map((g) => ({
    grade: g.number,
    title: g.title,
    forStudentGrade: g.for_student_grade,
    key: planKey(g.number, g.for_student_grade),
    terms: [...g.terms]
      .sort((a, b) => a.number - b.number)
      .map((t) => ({
        id: t.id,
        number: t.number,
        title: t.title,
        hours: t.hours,
        units: [...t.units].sort(byOrder).map((u) => ({
          id: u.id,
          code: u.code,
          title: u.title,
          hiddenTopics: u.school_placements.filter((p) => !p.topics).length,
          topics: [...u.school_placements]
            .sort(byOrder)
            .filter((p) => p.topics)
            .map((p) => ({ ...(p.topics as TopicRef), lessons: p.lessons, period: p.period })),
        })),
      })),
  }));
});

/**
 * The plans a viewer works through: a student gets one plan per grade, the
 * plan of their cohort where there is one (Grade 12 students see the 2025-26
 * Grade 11 KTP they were taught by); staff see every plan.
 */
export function plansFor(tree: SchoolTree, viewer: { role: string; grade: number | null } | null): SchoolTree {
  if (!viewer || viewer.role !== "student") return tree;
  return tree.filter((g) => {
    if (g.forStudentGrade !== null) return g.forStudentGrade === viewer.grade;
    return !tree.some((o) => o.grade === g.grade && o.forStudentGrade !== null && o.forStudentGrade === viewer.grade);
  });
}

export const planKey = (grade: number, forStudentGrade: number | null) => (forStudentGrade ? `${grade}-for-${forStudentGrade}` : String(grade));

/** Where a topic sits in the plans this viewer works through (see plansFor). */
export function placementsFor<T extends { grade: number; forStudentGrade: number | null }>(
  school: T[],
  tree: SchoolTree,
  viewer: { role: string; grade: number | null },
): T[] {
  const visible = new Set(plansFor(tree, viewer).map((g) => g.key));
  return school.filter((s) => visible.has(planKey(s.grade, s.forStudentGrade)));
}

/** The plan of each grade that everyone else sees (no cohort plans). */
export const mainPlans = (tree: SchoolTree) => tree.filter((g) => g.forStudentGrade === null);

export const getPaperTree = cache(async (): Promise<PaperTree> => {
  const version = await getActiveVersion();
  if (!version) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("paper_components")
    .select(
      "id, number, title, paper_sections(id, parent_id, code, title, sort_order, exam_placements(sort_order, topics(id, slug, title, status, recommended_minutes)))",
    )
    .eq("curriculum_version_id", version.id)
    .order("number");
  type Section = {
    id: string;
    parent_id: string | null;
    code: string | null;
    title: string;
    sort_order: number;
    exam_placements: { sort_order: number; topics: TopicRef | null }[];
  };
  type Row = { id: string; number: number; title: string; paper_sections: Section[] };
  return ((data ?? []) as unknown as Row[]).map((p) => {
    const sections = [...p.paper_sections].sort(byOrder);
    return {
      id: p.id,
      number: p.number,
      title: p.title,
      groups: sections
        .filter((s) => !s.parent_id)
        .map((g) => ({
          id: g.id,
          title: g.title,
          sections: sections
            .filter((s) => s.parent_id === g.id)
            .map((s) => ({
              id: s.id,
              code: s.code,
              title: s.title,
              topics: [...s.exam_placements]
                .sort(byOrder)
                .filter((ep) => ep.topics)
                .map((ep) => ep.topics as TopicRef),
            })),
        })),
    };
  });
});

/** topic id → learning objective ids (active programme). */
export const getTopicObjectiveMap = cache(async (): Promise<Map<string, string[]>> => {
  const supabase = await createClient();
  const { data } = await supabase.from("topic_objectives").select("topic_id, learning_objective_id");
  const map = new Map<string, string[]>();
  for (const r of data ?? []) {
    const list = map.get(r.topic_id) ?? [];
    list.push(r.learning_objective_id);
    map.set(r.topic_id, list);
  }
  return map;
});

/** paper number → learning objective ids. */
export const getPaperObjectiveMap = cache(async (): Promise<Map<number, string[]>> => {
  const version = await getActiveVersion();
  const supabase = await createClient();
  const { data } = await supabase
    .from("objective_paper_map")
    .select("learning_objective_id, paper_components!inner(number, curriculum_version_id)")
    .eq("paper_components.curriculum_version_id", version?.id ?? "");
  const map = new Map<number, string[]>();
  for (const r of (data ?? []) as unknown as { learning_objective_id: string; paper_components: { number: number } }[]) {
    const list = map.get(r.paper_components.number) ?? [];
    list.push(r.learning_objective_id);
    map.set(r.paper_components.number, list);
  }
  return map;
});

export async function getMasteryMap(supabase: Supa, studentId: string): Promise<Map<string, number>> {
  const { data } = await supabase
    .from("student_mastery")
    .select("learning_objective_id, mastery")
    .eq("student_id", studentId);
  return new Map((data ?? []).map((r) => [r.learning_objective_id as string, Number(r.mastery)]));
}

export type TopicDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  recommended_minutes: number | null;
  status: string;
  objectives: { id: string; code: string; description: string; paper: boolean }[];
  examOnly: boolean;
  curriculumVersionId: string;
  school: { grade: number; forStudentGrade: number | null; plan: string; term: string; termNumber: number; unitCode: string; unitTitle: string; lessons: string | null; period: string | null; resources: string | null }[];
  exam: { paper: number; paperTitle: string; group: string | null; sectionCode: string | null; section: string }[];
};

export const getTopicBySlug = cache(async (slug: string): Promise<TopicDetail | null> => {
  const version = await getActiveVersion();
  if (!version) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("topics")
    .select(
      `id, slug, title, description, recommended_minutes, status,
       topic_objectives(learning_objectives(id, code, description, sort_key, curriculum_version_id)),
       school_placements(lessons, period, resources, units(code, title, terms(number, title, grades(number, title, for_student_grade)))),
       exam_placements(paper_sections(code, title, parent:parent_id(title), paper_components(number, title)))`,
    )
    .eq("curriculum_version_id", version.id)
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  type Raw = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    recommended_minutes: number | null;
    status: string;
    topic_objectives: { learning_objectives: { id: string; code: string; description: string; sort_key: number[]; curriculum_version_id: string } }[];
    school_placements: {
      lessons: string | null;
      period: string | null;
      resources: string | null;
      units: { code: string; title: string; terms: { number: number; title: string; grades: { number: number; title: string; for_student_grade: number | null } } };
    }[];
    exam_placements: {
      paper_sections: {
        code: string | null;
        title: string;
        parent: { title: string } | null;
        paper_components: { number: number; title: string };
      };
    }[];
  };
  const t = data as unknown as Raw;
  const cmp = (a: number[], b: number[]) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) - (b[i] ?? 0);
    return 0;
  };
  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    description: t.description,
    recommended_minutes: t.recommended_minutes,
    status: t.status,
    objectives: t.topic_objectives
      .map((o) => o.learning_objectives)
      .sort((a, b) => cmp(a.sort_key, b.sort_key))
      .map(({ id, code, description, curriculum_version_id }) => ({ id, code, description, paper: curriculum_version_id !== version.id })),
    examOnly: !t.school_placements.some((p) => p.units.terms.grades.for_student_grade === null),
    curriculumVersionId: version.id,
    // the grade's own plan first, then an earlier KTP of one cohort
    school: [...t.school_placements]
      .sort((a, b) => Number(a.units.terms.grades.for_student_grade !== null) - Number(b.units.terms.grades.for_student_grade !== null))
      .map((p) => ({
      grade: p.units.terms.grades.number,
      forStudentGrade: p.units.terms.grades.for_student_grade,
      plan: p.units.terms.grades.title,
      term: p.units.terms.title,
      termNumber: p.units.terms.number,
      unitCode: p.units.code,
      unitTitle: p.units.title,
      lessons: p.lessons,
      period: p.period,
      resources: p.resources,
    })),
    exam: t.exam_placements
      .map((e) => ({
        paper: e.paper_sections.paper_components.number,
        paperTitle: e.paper_sections.paper_components.title,
        group: e.paper_sections.parent?.title ?? null,
        sectionCode: e.paper_sections.code,
        section: e.paper_sections.title,
      }))
      .sort((a, b) => a.paper - b.paper),
  };
});
