"use client";
import { useEffect, useId, useState } from "react";
import { useTheme } from "@/lib/use-theme";

/** Renders a Mermaid diagram on the client (the library is loaded on demand). */
export function MermaidDiagram({ source }: { source: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: isDark ? "dark" : "neutral", fontFamily: "inherit" });
        const { svg } = await mermaid.render(`m${id}`, source);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, source, isDark]);

  if (failed) {
    return <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 text-xs">{source}</pre>;
  }
  if (!svg) return <div className="h-32 animate-pulse rounded-lg bg-surface-2" aria-label="Loading diagram" />;
  // Mermaid output with securityLevel "strict" is sanitised by the library.
  return <div className="flex justify-center overflow-x-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
