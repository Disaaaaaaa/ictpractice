// The plan of a lesson taught live (lesson_plans.plan / live_sessions.plan),
// built from the lesson's ҚМЖ by scripts/apply-kmzh.ts.

export type LiveMode = "class" | "individual" | "pair" | "group";
export type LiveBlockKind = "slides" | "task" | "poll";
export type PlanQuestion = { key: string; id: string };

export type LiveBlock = {
  id: string;
  minutes: number;
  title: string;
  mode: LiveMode;
  /** 1 for individual and whole-class blocks */
  groupSize: number;
  kind: LiveBlockKind;
  /** what the teacher does (from the ҚМЖ) */
  teacher: string;
  learners: string;
  poll: { question: string; options: string[] } | null;
  /** theory section titles shown as slides */
  slides: string[];
  /** questions done together during the slides (everyone votes) */
  together: PlanQuestion[];
  tasks: PlanQuestion[];
  homework: PlanQuestion[];
  /** cards given to groups, one per group in turn */
  scenarios: { client: string; details: string }[];
};

export type LivePlan = {
  title: string;
  minutes: number;
  stages: { stage: "Beginning" | "Middle" | "End"; minutes: number; blocks: LiveBlock[] }[];
};

export type LiveGroup = { host: string; members: string[]; scenario: number | null };

export type LiveState = {
  /** blocks opened to the class, in the order they were opened */
  open?: string[];
  /** block the teacher is on */
  current?: string | null;
  /** when each block was opened (ISO) */
  openedAt?: Record<string, string>;
  /** questions whose correct answer is shown to the class */
  revealed?: string[];
  /** random pairs / groups of a block */
  groups?: Record<string, LiveGroup[]>;
};

export const blocksOf = (plan: LivePlan) => plan.stages.flatMap((s) => s.blocks);

/** The group a student belongs to in a block (null when the block has no groups). */
export function groupOf(state: LiveState, blockId: string, studentId: string): LiveGroup | null {
  return state.groups?.[blockId]?.find((g) => g.members.includes(studentId)) ?? null;
}

/**
 * Splits students into random groups of `size`. One student left over joins the
 * last group (a trio instead of a single). The first member is the host — the
 * group works on the host's laptop.
 */
export function makeGroups(studentIds: string[], size: number, scenarios: number, random: () => number = Math.random): LiveGroup[] {
  const ids = [...studentIds];
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const groups: string[][] = [];
  for (let i = 0; i < ids.length; i += size) groups.push(ids.slice(i, i + size));
  if (groups.length > 1 && groups[groups.length - 1].length < Math.max(2, Math.ceil(size / 2))) {
    const rest = groups.pop()!;
    rest.forEach((id, i) => groups[groups.length - 1 - (i % groups.length)].push(id));
  }
  return groups.map((members, i) => ({ host: members[0], members, scenario: scenarios ? i % scenarios : null }));
}
