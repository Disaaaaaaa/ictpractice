import "server-only";
import { FileText } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export type TeacherResource = { label: string; path: string };

/**
 * Original papers attached to an exam (private "papers" bucket). Render only
 * for staff: links are signed on the server and expire after an hour.
 */
export async function TeacherResources({ resources }: { resources: TeacherResource[] | null | undefined }) {
  if (!resources?.length) return null;
  const { data } = await createAdminClient()
    .storage.from("papers")
    .createSignedUrls(resources.map((r) => r.path), 3600);
  const urls = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return (
    <Card>
      <CardHeader title="Original papers" description="Visible to teachers only. Links expire after an hour." />
      <CardBody>
        <ul className="space-y-2 text-sm">
          {resources.map((r) => {
            const url = urls.get(r.path);
            return (
              <li key={r.path} className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer noopener" className="font-medium text-primary hover:underline">
                    {r.label}
                  </a>
                ) : (
                  <span className="text-muted">{r.label} (file missing)</span>
                )}
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
