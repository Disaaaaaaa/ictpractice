import { ActionForm } from "@/components/action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { saveTopic } from "@/app/(app)/admin/actions";

type Unit = { id: string; label: string };
type Section = { id: string; label: string };

export function TopicForm({
  topic,
  units,
  sections,
  unitId,
  sectionIds,
}: {
  topic?: { id: string; title: string; description: string | null; status: string; recommended_minutes: number | null };
  units: Unit[];
  sections: Section[];
  unitId?: string;
  sectionIds: string[];
}) {
  return (
    <ActionForm action={saveTopic} submitLabel={topic ? "Save topic" : "Create topic"}>
      {topic && <input type="hidden" name="topic_id" value={topic.id} />}
      <Field label="Title" htmlFor="title"><Input id="title" name="title" defaultValue={topic?.title} required /></Field>
      <Field label="Description" htmlFor="description"><Textarea id="description" name="description" rows={2} defaultValue={topic?.description ?? ""} /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={topic?.status ?? "draft"}>
            <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
          </Select>
        </Field>
        <Field label="Recommended study time (min)" htmlFor="rm"><Input id="rm" name="recommended_minutes" type="number" min={0} defaultValue={topic?.recommended_minutes ?? ""} /></Field>
        {!topic && (
          <Field label="Grade (slug prefix)" htmlFor="grade"><Select id="grade" name="grade"><option value="11">11</option><option value="12">12</option></Select></Field>
        )}
      </div>
      <Field label="School placement (Grade → Term → Unit)" htmlFor="unit_id">
        <Select id="unit_id" name="unit_id" defaultValue={unitId ?? ""}>
          <option value="">—</option>
          {units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
        </Select>
      </Field>
      <input type="hidden" name="sections_submitted" value="1" />
      <fieldset>
        <legend className="mb-1 text-sm font-medium">Exam placement (Paper → Section)</legend>
        <div className="grid max-h-64 gap-1 overflow-y-auto rounded-lg border border-border p-3 sm:grid-cols-2">
          {sections.map((s) => <Checkbox key={s.id} name="section_ids" value={s.id} defaultChecked={sectionIds.includes(s.id)} label={<span className="text-xs">{s.label}</span>} />)}
        </div>
      </fieldset>
    </ActionForm>
  );
}
