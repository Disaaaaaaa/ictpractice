import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <Inbox className="h-8 w-8 text-muted" aria-hidden />
      <p className="font-medium">{title}</p>
      {children && <div className="max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
