import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getMocks } from "@/lib/mocks";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Mock Exams" };

export default async function MockYearPage({ params }: PageProps<"/mock-exams/[year]">) {
  await requireProfile();
  const year = Number((await params).year);
  const mocks = await getMocks({ year });
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Mock Exams", href: "/mock-exams" }, { label: String(year) }]} title={`Mock Exams ${year}`} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((p) => {
          const list = mocks.filter((m) => m.paper?.number === p);
          return (
            <Link key={p} href={`/mock-exams/${year}/${p}`} className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-2">
              <p className="text-xl font-semibold">Paper {p}</p>
              <p className="text-sm text-muted">{list.length ? `${list.length} mock${list.length === 1 ? "" : "s"}` : "None yet"}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
