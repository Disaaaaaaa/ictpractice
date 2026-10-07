"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { getBrowserClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";

export function StartExamButton({
  examId,
  assignmentId,
  requireFullscreen,
  label = "Start Exam",
}: {
  examId: string;
  assignmentId?: string | null;
  requireFullscreen: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setPending(true);
    setError(null);
    // Must run inside the click handler (user gesture) for the browser to allow it.
    // Not awaited: some embedded browsers never settle the promise, and the
    // exam must start regardless (the runner asks again if fullscreen is missing).
    if (requireFullscreen && document.fullscreenEnabled && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    const { data, error } = await getBrowserClient().rpc("start_attempt", {
      p_exam_id: examId,
      p_assignment_id: assignmentId ?? null,
    });
    if (error || !data) {
      setPending(false);
      setError(friendlyError(error, "The exam could not be started. Please try again."));
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      return;
    }
    router.push(`/attempt/${data}`);
  };

  return (
    <div className="space-y-3">
      {error && <Alert tone="danger">{error}</Alert>}
      <Button size="lg" onClick={start} disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
        {label}
      </Button>
    </div>
  );
}
