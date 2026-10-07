import { AlertTriangle, BookMarked, Lightbulb, PenLine } from "lucide-react";
import type { TheoryBlock } from "@/lib/theory/blocks";
import { Markdown } from "@/components/markdown";
import { MermaidDiagram } from "./mermaid";
import { InteractiveBlock } from "./widgets";
import { HtmlPreview } from "./html-preview";
import { Info, CheckCircle2, OctagonAlert } from "lucide-react";
import katex from "katex";

function Callout({
  tone,
  icon,
  label,
  children,
}: {
  tone: string;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={`rounded-lg border-l-4 px-4 py-3 ${tone}`}>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </p>
      <div className="text-fg">{children}</div>
    </aside>
  );
}

export function TheoryBlockView({ block }: { block: TheoryBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h4 className="pt-2 text-base font-semibold">{block.text}</h4>
      ) : (
        <h3 className="pt-2 text-lg font-semibold">{block.text}</h3>
      );
    case "paragraph":
      return <Markdown>{block.content}</Markdown>;
    case "definition":
      return (
        <Callout tone="border-primary bg-primary-soft text-primary" icon={<BookMarked className="h-3.5 w-3.5" />} label="Definition">
          <p className="font-semibold">{block.term}</p>
          <Markdown>{block.content}</Markdown>
        </Callout>
      );
    case "example":
      return (
        <Callout tone="border-info bg-info-soft text-info" icon={<PenLine className="h-3.5 w-3.5" />} label={block.title ?? "Example"}>
          <Markdown>{block.content}</Markdown>
        </Callout>
      );
    case "exam_tip":
      return (
        <Callout tone="border-success bg-success-soft text-success" icon={<Lightbulb className="h-3.5 w-3.5" />} label="Exam tip">
          <Markdown>{block.content}</Markdown>
        </Callout>
      );
    case "warning":
      return (
        <Callout tone="border-warning bg-warning-soft text-warning" icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Common mistake">
          <Markdown>{block.content}</Markdown>
        </Callout>
      );
    case "diagram":
      return (
        <figure className="space-y-2 rounded-lg border border-border bg-surface p-4">
          {block.format === "mermaid" ? (
            <MermaidDiagram source={block.content} />
          ) : (
            <pre className="overflow-x-auto font-mono text-sm leading-snug">{block.content}</pre>
          )}
          {block.caption && <figcaption className="text-center text-xs text-muted">{block.caption}</figcaption>}
        </figure>
      );
    case "image":
      return (
        <figure className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.alt} className="mx-auto max-h-[480px] max-w-full rounded-lg border border-border" loading="lazy" />
          {block.caption && <figcaption className="text-center text-xs text-muted">{block.caption}</figcaption>}
        </figure>
      );
    case "code":
      return (
        <figure className="space-y-1">
          <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-surface-2 px-3 py-1 text-xs text-muted">
            <span className="font-mono uppercase">{block.language}</span>
            {block.caption && <span>{block.caption}</span>}
          </div>
          <pre className="overflow-x-auto rounded-b-lg border border-border bg-surface p-3 font-mono text-sm leading-relaxed">
            <code>{block.content}</code>
          </pre>
        </figure>
      );
    case "formula": {
      let html = "";
      try {
        html = katex.renderToString(block.latex, { displayMode: true, throwOnError: false, output: "html" });
      } catch {
        html = "";
      }
      return (
        <figure className="overflow-x-auto rounded-lg bg-surface-2 px-4 py-3 text-center">
          {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <code>{block.latex}</code>}
          {block.caption && <figcaption className="mt-1 text-xs text-muted">{block.caption}</figcaption>}
        </figure>
      );
    }
    case "comparison":
      return (
        <figure className="space-y-2">
          {block.title && <figcaption className="text-sm font-semibold">{block.title}</figcaption>}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {block.columns.map((c, i) => (
                    <th key={i} className="border-b border-border bg-surface-2 px-3 py-2 text-left font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="align-top">
                    {row.map((cell, c) => (
                      <td key={c} className={`border-b border-border px-3 py-2 ${c === 0 && block.columns.length > 2 ? "font-medium" : ""}`}>
                        <Markdown inline>{cell}</Markdown>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case "steps":
      return (
        <div className="space-y-2">
          {block.title && <p className="text-sm font-semibold">{block.title}</p>}
          <ol className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-fg">
                  {i + 1}
                </span>
                <Markdown className="min-w-0 flex-1">{item}</Markdown>
              </li>
            ))}
          </ol>
        </div>
      );
    case "list":
      return (
        <Markdown>{block.items.map((item, i) => (block.ordered ? `${i + 1}. ${item}` : `- ${item}`)).join("\n")}</Markdown>
      );
    case "callout": {
      const tones = {
        info: { cls: "border-primary bg-primary-soft text-primary", Icon: Info },
        success: { cls: "border-success bg-success-soft text-success", Icon: CheckCircle2 },
        warning: { cls: "border-warning bg-warning-soft text-warning", Icon: AlertTriangle },
        danger: { cls: "border-danger bg-danger-soft text-danger", Icon: OctagonAlert },
      } as const;
      const t = tones[block.tone];
      return (
        <aside className={`rounded-r-lg border-l-4 px-4 py-3 ${t.cls}`}>
          {block.title && (
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
              <t.Icon className="h-4 w-4" aria-hidden /> {block.title}
            </p>
          )}
          <Markdown className="text-fg">{block.content}</Markdown>
        </aside>
      );
    }
    case "cards":
      return (
        <div className={`grid gap-3 ${block.items.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : block.items.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {block.items.map((c, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              {c.title && <p className="mb-1 font-semibold">{c.title}</p>}
              <Markdown className="text-sm">{c.content}</Markdown>
            </div>
          ))}
        </div>
      );
    case "html_preview":
      return <HtmlPreview html={block.html} css={block.css} title={block.title} height={block.height} />;
    case "interactive":
      return <InteractiveBlock widget={block.widget} title={block.title} config={block.config} />;
  }
}
