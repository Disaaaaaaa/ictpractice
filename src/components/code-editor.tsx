"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/use-theme";
import type { Extension } from "@codemirror/state";
import type { CodeLanguage } from "@/lib/questions/types";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-lg border border-border bg-surface-2" />,
});

async function languageExtension(lang: CodeLanguage | undefined): Promise<Extension[]> {
  switch (lang) {
    case "python":
      return [(await import("@codemirror/lang-python")).python()];
    case "html":
      return [(await import("@codemirror/lang-html")).html()];
    case "css":
      return [(await import("@codemirror/lang-css")).css()];
    case "javascript":
      return [(await import("@codemirror/lang-javascript")).javascript()];
    case "sql":
      return [(await import("@codemirror/lang-sql")).sql()];
    default:
      return []; // pseudocode, prolog, assembly: plain monospace editor
  }
}


export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  minHeight = "12rem",
  label,
}: {
  value: string;
  onChange?: (v: string) => void;
  language?: CodeLanguage;
  readOnly?: boolean;
  minHeight?: string;
  label?: string;
}) {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  useEffect(() => {
    let alive = true;
    languageExtension(language).then((ext) => alive && setExtensions(ext));
    return () => {
      alive = false;
    };
  }, [language]);
  const { isDark: dark } = useTheme();
  return (
    <div className="overflow-hidden rounded-lg border border-border text-sm" aria-label={label}>
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-3 py-1 text-xs text-muted">
        <span className="font-mono uppercase">{language ?? "code"}</span>
        {readOnly && <span>read-only</span>}
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        editable={!readOnly}
        readOnly={readOnly}
        theme={dark ? "dark" : "light"}
        minHeight={minHeight}
        basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: false, highlightActiveLine: !readOnly }}
      />
    </div>
  );
}
