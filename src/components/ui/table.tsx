import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}
export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b border-border bg-surface-2 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted",
        className,
      )}
      {...props}
    />
  );
}
export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("border-b border-border px-3 py-2.5 align-middle", className)} {...props} />;
}
