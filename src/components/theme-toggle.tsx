"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import type { Theme } from "@/lib/theme";
import { cn } from "@/lib/cn";

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/** Compact icon button for the top bar: cycles light → dark → system. */
export function ThemeCycleButton() {
  const { theme, setTheme } = useTheme();
  const i = OPTIONS.findIndex((o) => o.value === theme);
  const current = OPTIONS[i] ?? OPTIONS[2];
  const next = OPTIONS[(i + 1) % OPTIONS.length];
  return (
    <button
      type="button"
      onClick={() => setTheme(next.value)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
      aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
      title={`Theme: ${current.label}`}
    >
      <current.Icon className="h-5 w-5" />
    </button>
  );
}

/** Segmented control for the profile page. */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-2 p-1" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            theme === value ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg",
          )}
        >
          <Icon className="h-4 w-4" /> {label}
        </button>
      ))}
    </div>
  );
}
