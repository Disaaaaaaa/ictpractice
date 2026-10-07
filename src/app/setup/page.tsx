import { isSupabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";

export const metadata = { title: "Setup required" };

export default function SetupPage() {
  if (isSupabaseConfigured()) redirect("/");
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Setup required</h1>
      <p className="mt-3 text-muted">
        The platform is not connected to a Supabase project yet. Copy <code>.env.example</code> to{" "}
        <code>.env.local</code>, fill in your project URL and keys, run the migrations and restart the server. See{" "}
        <code>README.md</code> for the full steps.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server only
OPENAI_API_KEY=...              # server only`}
      </pre>
    </main>
  );
}
