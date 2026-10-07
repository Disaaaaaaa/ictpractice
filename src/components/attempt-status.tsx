import { Badge } from "@/components/ui/badge";
import type { AttemptStatus } from "@/lib/db-types";

export function AttemptStatusBadge({ status }: { status: AttemptStatus }) {
  switch (status) {
    case "IN_PROGRESS":
      return <Badge tone="info">In progress</Badge>;
    case "SUBMITTED":
      return <Badge tone="warning">Marking</Badge>;
    case "REVIEW_REQUIRED":
      return <Badge tone="warning">Teacher review</Badge>;
    case "GRADED":
      return <Badge tone="success">Graded</Badge>;
  }
}
