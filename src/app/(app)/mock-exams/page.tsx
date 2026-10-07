import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getMocks } from "@/lib/mocks";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = { title: "Mock Exams" };

export default async function MockExamsPage() {
  await requireProfile();
  const mocks = await getMocks();
  const years = [...new Set(mocks.map((m) => m.year))].sort((a, b) => b - a);
  return (
    <>
      <PageHeader title="Mock Exams" description="Full-length practice papers under exam conditions, organised by year and paper." />
      {years.length === 0 ? (
        <EmptyState title="No mock exams published yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {years.map((y) => {
            const list = mocks.filter((m) => m.year === y);
            return (
              <Link key={y} href={`/mock-exams/${y}`} className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <p className="mt-3 text-2xl font-semibold">{y}</p>
                <p className="text-sm text-muted">
                  {[1, 2, 3].map((p) => `Paper ${p}: ${list.filter((m) => m.paper?.number === p).length}`).join(" · ")}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
