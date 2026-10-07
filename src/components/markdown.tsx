import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/cn";

/**
 * Renders authored Markdown (theory, questions, mark schemes). Raw HTML is not
 * rendered (react-markdown escapes it), which keeps authored content XSS-safe.
 */
export function Markdown({ children, className, inline = false }: { children: string; className?: string; inline?: boolean }) {
  return (
    <div className={cn("prose-content", inline && "[&>p]:inline", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: ({ href, children }) => {
            const safe = href && /^(https?:|mailto:|\/)/.test(href) ? href : undefined;
            return (
              <a href={safe} target={safe?.startsWith("/") ? undefined : "_blank"} rel="noreferrer noopener">
                {children}
              </a>
            );
          },
          img: ({ src, alt }) =>
            typeof src === "string" && /^(https:|\/)/.test(src) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt ?? ""} className="max-w-full rounded-lg border border-border" loading="lazy" />
            ) : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
