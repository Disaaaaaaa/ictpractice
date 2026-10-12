import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signedPhotoUrls, type NoteSubmission } from "@/lib/notes/service";
import type { Profile } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { NoteResultView } from "@/components/notes/note-result";

export const metadata: Metadata = { title: "Notes check" };

export default async function NoteCheckPage({ params }: PageProps<"/teacher/analytics/notes/[id]">) {
  await requireProfile(["teacher", "admin"]);
  const { id } = await params;
  const supabase = await createClient();
  // RLS: only checks of the caller's own students are returned.
  const { data } = await supabase
    .from("note_submissions")
    .select("id, student_id, topic_id, image_paths, status, percentage, result, created_at, topics(title, slug), profiles!note_submissions_student_id_fkey(id, first_name, last_name, username)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const s = data as unknown as NoteSubmission & {
    topics: { title: string; slug: string } | null;
    profiles: Pick<Profile, "id" | "first_name" | "last_name" | "username"> | null;
  };
  const photoUrls = await signedPhotoUrls(s.image_paths);
  const name = s.profiles ? displayName(s.profiles) : "Student";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumbs={[{ label: "Analytics", href: "/teacher/analytics" }, { label: "Notes checks", href: "/teacher/analytics/notes" }, { label: name }]}
        title={`${name} — notes`}
        description={s.topics?.title}
        actions={s.profiles && <Link href={`/teacher/students/${s.profiles.id}`} className="text-sm font-medium text-primary hover:underline">Student profile</Link>}
      />
      <NoteResultView submission={s} photoUrls={photoUrls} topicTitle={s.topics?.title} audience="teacher" />
    </div>
  );
}
