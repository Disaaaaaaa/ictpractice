"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Renders an authored HTML/CSS example inside a sandboxed iframe.
 * - opaque origin (no allow-same-origin): cannot read cookies or the platform DOM
 * - CSP blocks every network request and every script except our own
 *   height reporter, which carries a per-render random nonce
 * so the example cannot run author scripts, load resources or leak data.
 */
export function HtmlPreview({ html, css, title, height = 240 }: { html: string; css?: string; title?: string; height?: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = useState<string | null>(null);
  const [h, setH] = useState(height);

  useEffect(() => {
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
    // The nonce must be generated in the browser (not during SSR), so the
    // document is built after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoc(`<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; script-src 'nonce-${nonce}'">
<style>
  *{box-sizing:border-box}
  html,body{margin:0}
  body{padding:16px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;color:#172033;background:#fff}
  ${css ?? ""}
</style></head><body>${html}
<script nonce="${nonce}">(function(){function s(){parent.postMessage({type:"nis-preview-height",h:Math.ceil(document.documentElement.getBoundingClientRect().height)},"*")}new ResizeObserver(s).observe(document.documentElement);window.addEventListener("load",s);s();})();</script>
</body></html>`);
  }, [html, css]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const d = e.data as { type?: string; h?: number };
      if (d?.type === "nis-preview-height" && typeof d.h === "number") setH(Math.max(60, Math.min(1600, d.h)));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <figure className="overflow-hidden rounded-lg border border-border">
      <figcaption className="flex items-center justify-between border-b border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        <span>{title ?? "Visual result"}</span>
        <span className="font-normal normal-case">live preview</span>
      </figcaption>
      {doc ? (
        <iframe ref={ref} title={title ?? "HTML preview"} sandbox="allow-scripts" srcDoc={doc} className="block w-full bg-white" style={{ height: h }} />
      ) : (
        <div className="bg-white" style={{ height }} />
      )}
    </figure>
  );
}
