// Theme preference: "light" | "dark" | "system". Stored in a cookie so the
// server can render <html data-theme> and the page never flashes the wrong theme.
export const THEME_COOKIE = "theme";
export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export function parseTheme(v: string | undefined | null): Theme {
  return v === "light" || v === "dark" ? v : "system";
}

/** Value for <html data-theme>; undefined means "follow the operating system". */
export function themeAttribute(theme: Theme): "light" | "dark" | undefined {
  return theme === "system" ? undefined : theme;
}
