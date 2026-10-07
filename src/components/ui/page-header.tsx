import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <header className="mb-6 space-y-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              {b.href ? (
                <Link href={b.href} className="hover:text-fg hover:underline">
                  {b.label}
                </Link>
              ) : (
                <span aria-current="page">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
