import "server-only";
import { createClient } from "./supabase/server";
import { getActiveVersion } from "./curriculum";
import type { EditorLO } from "@/components/teacher/question-editor";
import type { AuthoredQuestion } from "./content/schema";
import type { MarkScheme, Question } from "./db-types";

export async function getEditorContext() {
  const version = await getActiveVersion();
  const supabase = await createClient();
  const [{ data: topics }, { data: ktp }, { data: links }] = await Promise.all([
    supabase.from("topics").select("id, title").eq("curriculum_version_id", version?.id ?? "").order("sort_order"),
    supabase.from("learning_objectives").select("id, code, description, sort_key, curriculum_version_id, topic_objectives(topic_id)").eq("curriculum_version_id", version?.id ?? ""),
    supabase.from("topic_objectives").select("learning_objective_id, topics!inner(curriculum_version_id)").eq("topics.curriculum_version_id", version?.id ?? ""),
  ]);
  // Paper-specification objectives linked to this programme's topics ("code@paper").
  const ktpIds = new Set((ktp ?? []).map((l) => l.id as string));
  const paperIds = [...new Set((links ?? []).map((l) => l.learning_objective_id as string))].filter((id) => !ktpIds.has(id));
  const { data: paperLos } = paperIds.length
    ? await supabase.from("learning_objectives").select("id, code, description, sort_key, curriculum_version_id, topic_objectives(topic_id)").in("id", paperIds)
    : { data: [] };
  const los = [...(ktp ?? []), ...(paperLos ?? [])];
  const objectives: EditorLO[] = (los as unknown as { code: string; description: string; sort_key: number[]; curriculum_version_id: string; topic_objectives: { topic_id: string }[] }[])
    .sort((a, b) => {
      for (let i = 0; i < 4; i++) if (a.sort_key[i] !== b.sort_key[i]) return a.sort_key[i] - b.sort_key[i];
      return 0;
    })
    .map((l) => ({
      code: l.curriculum_version_id === version?.id ? l.code : `${l.code}@paper`,
      description: l.description,
      topicIds: l.topic_objectives.map((t) => t.topic_id),
    }));
  return { topics: (topics ?? []) as { id: string; title: string }[], objectives };
}

export function toAuthored(
  q: Question & {
    question_options: { key: string; content: string; sort_order: number }[];
    question_objectives: { learning_objectives: { code: string; curriculum_version_id: string } }[];
  },
  scheme: MarkScheme | null,
): AuthoredQuestion {
  return {
    key: "editor",
    title: q.title,
    type: q.question_type,
    marks: q.marks,
    difficulty: q.difficulty,
    command_word: q.command_word,
    grading: q.grading_method,
    objectives: q.question_objectives.map((o) =>
      o.learning_objectives.curriculum_version_id === q.curriculum_version_id ? o.learning_objectives.code : `${o.learning_objectives.code}@paper`,
    ),
    text: q.question_text,
    options: [...q.question_options].sort((a, b) => a.sort_order - b.sort_order).map(({ key, content }) => ({ key, content })),
    content: q.content ?? {},
    source: q.source_type,
    source_reference: q.source_reference ?? undefined,
    practice: q.practice_enabled,
    status: q.status,
    topic: q.topic_id ?? undefined,
    part_label: q.part_label ?? undefined,
    scheme: {
      mark_scheme: scheme?.mark_scheme ?? "",
      points: scheme?.marking_points ?? [],
      model_answer: scheme?.model_answer ?? undefined,
      accepted: scheme?.accepted_answers ?? {},
      ai_instructions: scheme?.ai_grading_instructions ?? undefined,
      explanation: scheme?.explanation ?? undefined,
    },
  };
}
