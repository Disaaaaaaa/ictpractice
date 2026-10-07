import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { ActionForm } from "@/components/action-form";
import { saveSettings } from "../actions";

export const metadata: Metadata = { title: "System settings" };

export default async function SettingsPage() {
  await requireProfile(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase.from("system_settings").select("key, value");
  const get = (k: string) => (data ?? []).find((r) => r.key === k)?.value ?? {};
  const m = get("mastery") as { practice_weight?: number; exam_weight?: number; recent_attempts?: number; recency_decay?: number; difficulty_weights?: Record<string, number> };
  const ai = get("ai_grading") as { confidence_threshold?: number; max_retries?: number };
  const ex = get("exam_defaults") as { save_grace_seconds?: number; session_stale_seconds?: number };
  const num = (name: string, label: string, value: number | undefined, step = "0.05", hint?: string) => (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input id={name} name={name} type="number" step={step} defaultValue={value} required />
    </Field>
  );
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="System settings" />
      <ActionForm action={saveSettings} submitLabel="Save settings" className="space-y-6">
        <Card>
          <CardHeader title="Mastery calculation" description="Mastery per learning objective = weighted mix of recent practice and exam answers." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {num("practice_weight", "Practice weight", m.practice_weight ?? 0.3)}
            {num("exam_weight", "Exam weight", m.exam_weight ?? 0.7)}
            {num("recent_attempts", "Recent answers counted per LO", m.recent_attempts ?? 10, "1")}
            {num("recency_decay", "Recency decay (1 = no decay)", m.recency_decay ?? 0.85, "0.01")}
            {num("w_easy", "Weight: Easy", m.difficulty_weights?.easy ?? 0.8)}
            {num("w_medium", "Weight: Medium", m.difficulty_weights?.medium ?? 1)}
            {num("w_hard", "Weight: Hard", m.difficulty_weights?.hard ?? 1.2)}
            {num("w_exam", "Weight: Exam-level", m.difficulty_weights?.exam ?? 1.3)}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="AI marking" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {num("confidence_threshold", "Auto-accept confidence ≥", ai.confidence_threshold ?? 0.8, "0.01", "Below this, the mark is queued for teacher review.")}
            {num("max_retries", "Retries before teacher marking", ai.max_retries ?? 5, "1")}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Exam runtime" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {num("save_grace_seconds", "Save grace after deadline (s)", ex.save_grace_seconds ?? 30, "1", "Late autosaves accepted while the browser submits.")}
            {num("session_stale_seconds", "Second-session window (s)", ex.session_stale_seconds ?? 45, "1", "A new window within this time of the last heartbeat is recorded as a second session.")}
          </CardBody>
        </Card>
      </ActionForm>
    </div>
  );
}
