import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { relativeTime } from "@/lib/format";
import type { NotificationRow } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { markAllRead } from "./actions";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
  const list = (data ?? []) as NotificationRow[];
  return (
    <>
      <PageHeader
        title="Notifications"
        actions={list.some((n) => !n.read_at) && (
          <form action={markAllRead}><Button type="submit" variant="secondary">Mark all as read</Button></form>
        )}
      />
      {list.length === 0 ? (
        <EmptyState title="No notifications yet">New assignments, deadlines, results and feedback will appear here.</EmptyState>
      ) : (
        <Card>
          <ul className="divide-y divide-border">
            {list.map((n) => (
              <li key={n.id}>
                <Link href={n.link ?? "#"} className={cn("flex gap-3 px-5 py-4 hover:bg-surface-2", !n.read_at && "bg-primary-soft/40")}>
                  <Bell className={cn("mt-0.5 h-4 w-4 shrink-0", n.read_at ? "text-muted" : "text-primary")} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", !n.read_at && "font-semibold")}>{n.title}</p>
                    {n.body && <p className="text-sm text-muted">{n.body}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-muted">{relativeTime(n.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
