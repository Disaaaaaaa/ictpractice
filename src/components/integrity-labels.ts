import type { IntegrityEventType } from "@/lib/db-types";

export const INTEGRITY_EVENT_LABEL: Record<IntegrityEventType, string> = {
  TAB_HIDDEN: "Left the exam tab",
  WINDOW_BLUR: "Exam window lost focus",
  FULLSCREEN_EXIT: "Exited fullscreen",
  PAGE_RELOAD: "Reloaded the page",
  PAGE_LEAVE: "Closed or left the page",
  CONNECTION_LOST: "Connection lost",
  CONNECTION_RESTORED: "Connection restored",
  MULTIPLE_SESSION_DETECTED: "Opened in another window/device",
};
