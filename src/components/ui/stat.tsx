import type { ReactNode } from "react";
import { Card } from "./card";

export function Stat({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted">{label}</p>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </Card>
  );
}
