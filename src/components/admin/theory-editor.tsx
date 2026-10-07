"use client";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Braces, Eye, Plus, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageUploadButton } from "@/components/teacher/image-upload-button";
import { TheoryBlockView } from "@/components/theory/theory-block";
import {
  BLOCK_TYPE_LABELS,
  INTERACTIVE_WIDGETS,
  INTERACTIVE_WIDGET_LABELS,
  emptyBlock,
  theoryBlockSchema,
  type TheoryBlock,
  type TheoryBlockType,
} from "@/lib/theory/blocks";
import { saveTheoryPack, type TheoryInput } from "@/app/(app)/admin/actions";

type Section = TheoryInput["sections"][number];
type LO = { id: string; code: string; description: string };

const TYPES = Object.keys(BLOCK_TYPE_LABELS) as TheoryBlockType[];

function move<T>(list: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Edits one block with type-appropriate fields (or raw JSON). */
function BlockEditor({ block, onChange }: { block: TheoryBlock; onChange: (b: TheoryBlock) => void }) {
  const [raw, setRaw] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const set = (patch: Partial<TheoryBlock>) => onChange({ ...block, ...patch } as TheoryBlock);

  if (raw !== null) {
    return (
      <div className="space-y-2">
        <Textarea rows={8} className="font-mono text-xs" value={raw} onChange={(e) => setRaw(e.target.value)} aria-label="Block JSON" />
        {rawError && <p className="text-xs text-danger">{rawError}</p>}
        <div className="flex gap-2">
          <Button size="sm" onClick={() => {
            try {
              const parsed = theoryBlockSchema.parse(JSON.parse(raw));
              onChange(parsed);
              setRaw(null);
              setRawError(null);
            } catch (e) {
              setRawError((e as Error).message.slice(0, 300));
            }
          }}>Apply JSON</Button>
          <Button size="sm" variant="ghost" onClick={() => setRaw(null)}>Cancel</Button>
        </div>
      </div>
    );
  }

  const text = (key: string, label: string, rows = 3, mono = false) => (
    <Field label={label} htmlFor={key}>
      <Textarea
        rows={rows}
        className={mono ? "font-mono text-xs" : undefined}
        value={String((block as Record<string, unknown>)[key] ?? "")}
        onChange={(e) => set({ [key]: e.target.value } as Partial<TheoryBlock>)}
      />
    </Field>
  );
  const line = (key: string, label: string) => (
    <Field label={label} htmlFor={key}>
      <Input value={String((block as Record<string, unknown>)[key] ?? "")} onChange={(e) => set({ [key]: e.target.value || undefined } as Partial<TheoryBlock>)} />
    </Field>
  );

  const body = (() => {
    switch (block.type) {
      case "heading":
        return (
          <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
            {line("text", "Heading")}
            <Field label="Level" htmlFor="lvl">
              <Select value={String(block.level ?? 2)} onChange={(e) => set({ level: Number(e.target.value) as 2 | 3 })}>
                <option value="2">Large</option><option value="3">Small</option>
              </Select>
            </Field>
          </div>
        );
      case "paragraph":
      case "exam_tip":
      case "warning":
        return text("content", "Content (Markdown)", 5);
      case "definition":
        return <>{line("term", "Term")}{text("content", "Definition (Markdown)")}</>;
      case "example":
        return <>{line("title", "Title")}{text("content", "Content (Markdown)", 5)}</>;
      case "diagram":
        return (
          <>
            <Field label="Format" htmlFor="fmt">
              <Select value={block.format} onChange={(e) => set({ format: e.target.value as "mermaid" | "ascii" })}>
                <option value="mermaid">Mermaid</option><option value="ascii">Plain text / ASCII</option>
              </Select>
            </Field>
            {text("content", "Diagram source", 6, true)}
            {line("caption", "Caption")}
          </>
        );
      case "image":
        return (
          <>
            {line("url", "Image URL (https:// or /path)")}
            <ImageUploadButton
              folder="theory"
              onInsert={(md) => {
                const m = /^!\[(.*)\]\((.*)\)$/.exec(md);
                if (m) set({ url: m[2], alt: block.alt || m[1] } as Partial<TheoryBlock>);
              }}
            />
            {line("alt", "Alt text (required)")}
            {line("caption", "Caption")}
          </>
        );
      case "code":
        return <>{line("language", "Language")}{text("content", "Code", 8, true)}{line("caption", "Caption")}</>;
      case "formula":
        return <>{text("latex", "LaTeX", 2, true)}{line("caption", "Caption")}</>;
      case "steps":
      case "list":
        return (
          <Field label="Items — one per line (Markdown)" htmlFor="items">
            <Textarea rows={6} value={block.items.join("\n")} onChange={(e) => set({ items: e.target.value.split("\n") } as Partial<TheoryBlock>)} />
          </Field>
        );
      case "comparison":
        return (
          <>
            {line("title", "Title")}
            <Field label="Columns (separated by |)" htmlFor="cols"><Input value={block.columns.join(" | ")} onChange={(e) => set({ columns: e.target.value.split("|").map((c) => c.trim()) })} /></Field>
            <Field label="Rows — one per line, cells separated by |" htmlFor="rows">
              <Textarea rows={6} className="font-mono text-xs" value={block.rows.map((r) => r.join(" | ")).join("\n")} onChange={(e) => set({ rows: e.target.value.split("\n").map((l) => l.split("|").map((c) => c.trim())) })} />
            </Field>
          </>
        );
      case "callout":
        return (
          <>
            <Field label="Colour" htmlFor="tone">
              <Select value={block.tone} onChange={(e) => set({ tone: e.target.value as "info" | "success" | "warning" | "danger" })}>
                <option value="info">Blue — note</option><option value="success">Green — key point</option>
                <option value="warning">Amber — caution</option><option value="danger">Red — important</option>
              </Select>
            </Field>
            {line("title", "Title")}
            {text("content", "Content (Markdown)", 4)}
          </>
        );
      case "cards":
        return (
          <div className="space-y-3">
            {block.items.map((c, k) => (
              <div key={k} className="grid gap-2 rounded-md border border-border p-3">
                <Input value={c.title} placeholder="Card title" aria-label={`Card ${k + 1} title`} onChange={(e) => set({ items: block.items.map((x, j) => (j === k ? { ...x, title: e.target.value } : x)) })} />
                <Textarea rows={3} value={c.content} aria-label={`Card ${k + 1} content`} onChange={(e) => set({ items: block.items.map((x, j) => (j === k ? { ...x, content: e.target.value } : x)) })} />
                <Button size="sm" variant="ghost" onClick={() => set({ items: block.items.filter((_, j) => j !== k) })}>Remove card</Button>
              </div>
            ))}
            <Button size="sm" variant="secondary" onClick={() => set({ items: [...block.items, { title: "", content: "" }] })}>Add card</Button>
          </div>
        );
      case "html_preview":
        return (
          <>
            {line("title", "Title")}
            {text("html", "HTML", 6, true)}
            {text("css", "CSS", 6, true)}
            <Field label="Height (px)" htmlFor="h">
              <Input type="number" min={60} max={1200} value={block.height ?? 240} onChange={(e) => set({ height: Number(e.target.value) })} />
            </Field>
          </>
        );
      case "interactive":
        return (
          <>
            <Field label="Widget" htmlFor="widget">
              <Select value={block.widget} onChange={(e) => set({ widget: e.target.value as (typeof INTERACTIVE_WIDGETS)[number] })}>
                {INTERACTIVE_WIDGETS.map((w) => <option key={w} value={w}>{INTERACTIVE_WIDGET_LABELS[w]}</option>)}
              </Select>
            </Field>
            {line("title", "Title")}
          </>
        );
    }
  })();

  return (
    <div className="space-y-3">
      {body}
      <button type="button" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg" onClick={() => setRaw(JSON.stringify(block, null, 2))}>
        <Braces className="h-3.5 w-3.5" /> Edit as JSON
      </button>
    </div>
  );
}

export function TheoryEditor({
  topicId,
  initial,
  objectives,
}: {
  topicId: string;
  initial: TheoryInput;
  objectives: LO[];
}) {
  const [pack, setPack] = useState<TheoryInput>(initial);
  const [open, setOpen] = useState<number>(0);
  const [preview, setPreview] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; error?: string; message?: string; details?: string[] } | null>(null);
  const [pending, start] = useTransition();

  const setSection = (i: number, patch: Partial<Section>) =>
    setPack((p) => ({ ...p, sections: p.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  const setBlocks = (i: number, blocks: TheoryBlock[]) => setSection(i, { blocks });

  const save = (status?: TheoryInput["status"]) =>
    start(async () => {
      const payload = { ...pack, status: status ?? pack.status };
      // drop empty list items authors leave behind
      payload.sections = payload.sections.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) => (b.type === "list" || b.type === "steps" ? { ...b, items: b.items.filter((x) => x.trim()) } : b)) as TheoryBlock[],
      }));
      const r = await saveTheoryPack(topicId, payload);
      setResult(r);
      if (r.ok) setPack(payload);
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="grid gap-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
          <Field label="Theory pack title" htmlFor="pt"><Input id="pt" value={pack.title} onChange={(e) => setPack({ ...pack, title: e.target.value })} /></Field>
          <Field label="Status" htmlFor="ps">
            <Select id="ps" value={pack.status} onChange={(e) => setPack({ ...pack, status: e.target.value as TheoryInput["status"] })}>
              <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPreview((p) => !p)}><Eye className="h-4 w-4" /> {preview ? "Edit" : "Preview"}</Button>
            <Button onClick={() => save()} disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
            {pack.status !== "published" && <Button variant="success" onClick={() => save("published")} disabled={pending}>Publish</Button>}
          </div>
          <Field label="Summary" htmlFor="psum" className="sm:col-span-3">
            <Textarea id="psum" rows={2} value={pack.summary ?? ""} onChange={(e) => setPack({ ...pack, summary: e.target.value || null })} />
          </Field>
        </CardBody>
      </Card>
      {result?.error && (
        <Alert tone="danger" title={result.error}>
          {result.details && <ul className="list-disc pl-4 text-xs">{result.details.map((d, i) => <li key={i}>{d}</li>)}</ul>}
        </Alert>
      )}
      {result?.ok && <Alert tone="success">{result.message}</Alert>}

      {pack.sections.map((s, i) => (
        <Card key={s.id ?? `new-${i}`}>
          <CardHeader
            title={<button type="button" className="text-left hover:underline" onClick={() => setOpen(open === i ? -1 : i)}>{i + 1}. {s.title || "Untitled section"}</button>}
            description={`${s.blocks.length} blocks · ${s.objectiveIds.length} LOs`}
            action={
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" aria-label="Move section up" onClick={() => setPack({ ...pack, sections: move(pack.sections, i, -1) })}><ArrowUp className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" aria-label="Move section down" onClick={() => setPack({ ...pack, sections: move(pack.sections, i, 1) })}><ArrowDown className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" aria-label="Delete section" onClick={() => window.confirm("Delete this section?") && setPack({ ...pack, sections: pack.sections.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
              </div>
            }
          />
          {open === i && (
            <CardBody className="space-y-5">
              {preview ? (
                <div className="space-y-4">{s.blocks.map((b, j) => <TheoryBlockView key={j} block={b} />)}</div>
              ) : (
                <>
                  <Field label="Section title" htmlFor={`st${i}`}><Input id={`st${i}`} value={s.title} onChange={(e) => setSection(i, { title: e.target.value })} /></Field>
                  <fieldset>
                    <legend className="mb-1 text-sm font-medium">Learning objectives covered by this section</legend>
                    <div className="flex flex-wrap gap-2">
                      {objectives.map((lo) => {
                        const on = s.objectiveIds.includes(lo.id);
                        return (
                          <button key={lo.id} type="button" title={lo.description} aria-pressed={on}
                            onClick={() => setSection(i, { objectiveIds: on ? s.objectiveIds.filter((x) => x !== lo.id) : [...s.objectiveIds, lo.id] })}
                            className={on ? "rounded-full bg-primary px-2.5 py-0.5 font-mono text-xs text-primary-fg" : "rounded-full border border-border px-2.5 py-0.5 font-mono text-xs"}>
                            {lo.code}
                          </button>
                        );
                      })}
                      {objectives.length === 0 && <p className="text-xs text-muted">Map learning objectives to the topic first.</p>}
                    </div>
                  </fieldset>
                  <ol className="space-y-3">
                    {s.blocks.map((b, j) => (
                      <li key={j} className="rounded-lg border border-border p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Badge tone="primary">{BLOCK_TYPE_LABELS[b.type]}</Badge>
                          <div className="ml-auto flex gap-1">
                            <Button size="sm" variant="ghost" aria-label="Move block up" onClick={() => setBlocks(i, move(s.blocks, j, -1))}><ArrowUp className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" aria-label="Move block down" onClick={() => setBlocks(i, move(s.blocks, j, 1))}><ArrowDown className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" aria-label="Delete block" onClick={() => setBlocks(i, s.blocks.filter((_, k) => k !== j))}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <BlockEditor block={b} onChange={(nb) => setBlocks(i, s.blocks.map((x, k) => (k === j ? nb : x)))} />
                      </li>
                    ))}
                  </ol>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted">Add block:</span>
                    {TYPES.map((t) => (
                      <Button key={t} size="sm" variant="secondary" onClick={() => setBlocks(i, [...s.blocks, emptyBlock(t)])}>{BLOCK_TYPE_LABELS[t]}</Button>
                    ))}
                  </div>
                </>
              )}
            </CardBody>
          )}
        </Card>
      ))}
      <Button variant="secondary" onClick={() => {
        setPack({ ...pack, sections: [...pack.sections, { id: null, title: "New section", objectiveIds: [], blocks: [emptyBlock("paragraph")] }] });
        setOpen(pack.sections.length);
      }}><Plus className="h-4 w-4" /> Add section</Button>
    </div>
  );
}
