import type { Metadata } from "next";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Audit log" };

const GROUPS = ["account", "class", "exam", "grade", "question", "topic", "theory", "assignment", "attempt", "settings", "lo"];

export default async function AuditPage({ searchParams }: PageProps<"/admin/audit">) {
  await requireProfile(["admin"]);
  const sp = await searchParams;
  const group = typeof sp.group === "string" ? sp.group : "";
  const entity = typeof sp.entity === "string" ? sp.entity.trim() : "";
  const supabase = await createClient();
  let q = supabase.from("audit_logs").select("*, profiles:actor_id(first_name, last_name, username)").order("created_at", { ascending: false }).limit(300);
  if (group) q = q.like("action", `${group}.%`);
  if (/^[0-9a-f-]{36}$/i.test(entity)) q = q.eq("entity_id", entity);
  const { data } = await q;
  return (
    <>
      <PageHeader title="Audit log" description="Account creation, password resets, exam publication and edits, mark changes and settings." />
      <Card>
        <CardBody>
          <form className="grid gap-2 sm:grid-cols-[12rem_1fr_auto]">
            <Select name="group" defaultValue={group} aria-label="Action group">
              <option value="">All actions</option>
              {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
            <Input name="entity" defaultValue={entity} placeholder="Entity id (UUID)" aria-label="Entity id" />
            <Button type="submit">Filter</Button>
          </form>
        </CardBody>
        <CardBody className="p-0">
          <Table>
            <thead><tr><Th>When</Th><Th>Actor</Th><Th>Action</Th><Th>Entity</Th><Th>Details</Th></tr></thead>
            <tbody>
              {(data ?? []).map((l) => {
                const actor = l.profiles as { first_name: string; last_name: string; username: string } | null;
                return (
                  <tr key={l.id}>
                    <Td className="whitespace-nowrap text-xs">{formatDate(l.created_at)}</Td>
                    <Td className="text-sm">{actor ? displayName(actor) : "system"}</Td>
                    <Td className="font-mono text-xs">{l.action}</Td>
                    <Td className="font-mono text-xs">{l.entity_type}{l.entity_id ? ` · ${String(l.entity_id).slice(0, 8)}` : ""}</Td>
                    <Td className="max-w-md truncate font-mono text-xs text-muted" title={JSON.stringify(l.details)}>{JSON.stringify(l.details)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
