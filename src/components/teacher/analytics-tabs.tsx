import { LinkTabs } from "@/components/ui/tabs";

/** Sections of Teacher → Analytics. */
export function AnalyticsTabs() {
  return (
    <div className="mb-6">
      <LinkTabs
        exact={["/teacher/analytics"]}
        tabs={[
          { href: "/teacher/analytics", label: "Overview" },
          { href: "/teacher/analytics/practice", label: "Practice monitor" },
          { href: "/teacher/analytics/notes", label: "Notes checks" },
        ]}
      />
    </div>
  );
}
