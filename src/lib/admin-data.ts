import "server-only";
import { getPaperTree, getSchoolTree } from "./curriculum";

export async function getPlacementOptions() {
  const [school, papers] = await Promise.all([getSchoolTree(), getPaperTree()]);
  const units = school.flatMap((g) => g.terms.flatMap((t) => t.units.map((u) => ({ id: u.id, label: `Grade ${g.grade} · ${t.title} · ${u.code} ${u.title}` }))));
  const sections = papers.flatMap((p) => p.groups.flatMap((g) => g.sections.map((s) => ({ id: s.id, label: `${p.title} · ${g.title} · ${s.code ?? ""} ${s.title}` }))));
  return { units, sections };
}
