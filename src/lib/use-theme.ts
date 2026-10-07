"use client";
import { useCallback, useSyncExternalStore } from "react";
import { THEME_COOKIE, parseTheme, type Theme } from "./theme";

const EVENT = "themechange";

function readTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  return parseTheme(attr ?? null);
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(EVENT, cb);
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq.removeEventListener("change", cb);
  };
}

/** The chosen preference and whether the page is currently dark. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);
  const isDark = useSyncExternalStore(
    subscribe,
    () => readTheme() === "dark" || (readTheme() === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
    () => false,
  );
  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    if (next === "system") delete root.dataset.theme;
    else root.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { theme, isDark, setTheme };
}
