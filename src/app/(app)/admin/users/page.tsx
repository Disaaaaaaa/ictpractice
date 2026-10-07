import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { relativeTime } from "@/lib/format";
import type { Profile } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ActionForm, ConfirmButton } from "@/components/action-form";
import { createUser, resetPassword, toggleActive, updateUser } from "../actions";
import { importStudents } from "../../teacher/actions";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const me = await requireProfile(["admin"]);
  const sp = await searchParams;
  const role = typeof sp.role === "string" ? sp.role : "";
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const edit = typeof sp.edit === "string" ? sp.edit : "";
  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").order("role").order("last_name").limit(1000);
  if (role) query = query.eq("role", role);
  const { data } = await query;
  const users = ((data ?? []) as Profile[]).filter((u) => !q || `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase().includes(q));
  const { data: classes } = await supabase.from("classes").select("id, name").is("archived_at", null).order("name");
  const editing = users.find((u) => u.id === edit);

  return (
    <>
      <PageHeader title="Users" description={`${users.length} accounts`} />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <CardBody>
            <form className="grid gap-2 sm:grid-cols-[1fr_10rem_auto]">
              <Input name="q" defaultValue={q} placeholder="Search name or username" aria-label="Search" />
              <Select name="role" defaultValue={role} aria-label="Role">
                <option value="">All roles</option><option value="student">Students</option><option value="teacher">Teachers</option><option value="admin">Admins</option>
              </Select>
              <Button type="submit">Filter</Button>
            </form>
          </CardBody>
          <CardBody className="p-0">
            <Table>
              <thead><tr><Th>Name</Th><Th>Username</Th><Th>Role</Th><Th>Grade</Th><Th>Status</Th><Th>Last activity</Th><Th className="text-right">Actions</Th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <Td><Link href={`/admin/users?edit=${u.id}${role ? `&role=${role}` : ""}`} className="font-medium hover:underline">{displayName(u)}</Link></Td>
                    <Td className="font-mono text-xs">{u.username}</Td>
                    <Td className="capitalize">{u.role}</Td>
                    <Td>{u.grade ?? "—"}</Td>
                    <Td>{!u.is_active ? <Badge tone="danger">Disabled</Badge> : u.force_password_change ? <Badge tone="warning">Temporary password</Badge> : <Badge tone="success">Active</Badge>}</Td>
                    <Td className="text-muted">{relativeTime(u.last_activity_at)}</Td>
                    <Td>
                      <div className="flex justify-end gap-1">
                        <ConfirmButton action={resetPassword} fields={{ user_id: u.id }} label={<KeyRound className="h-4 w-4" aria-label="Reset password" />} variant="ghost" confirm={`Reset ${u.username}'s password to the temporary password?`} />
                        {u.id !== me.id && (
                          <ConfirmButton action={toggleActive} fields={{ user_id: u.id, active: String(!u.is_active) }} label={u.is_active ? "Disable" : "Enable"} variant="ghost" confirm={u.is_active ? `Disable ${u.username}? They will not be able to sign in.` : undefined} />
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <div className="space-y-6">
          {editing && (
            <Card>
              <CardHeader title={`Edit ${editing.username}`} />
              <CardBody>
                <ActionForm action={updateUser}>
                  <input type="hidden" name="user_id" value={editing.id} />
                  <Field label="First name" htmlFor="e-fn"><Input id="e-fn" name="first_name" defaultValue={editing.first_name} /></Field>
                  <Field label="Last name" htmlFor="e-ln"><Input id="e-ln" name="last_name" defaultValue={editing.last_name} /></Field>
                  <Field label="Role" htmlFor="e-role">
                    <Select id="e-role" name="role" defaultValue={editing.role}><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></Select>
                  </Field>
                  <Field label="Grade (students)" htmlFor="e-grade">
                    <Select id="e-grade" name="grade" defaultValue={editing.grade ? String(editing.grade) : ""}><option value="">—</option><option value="11">11</option><option value="12">12</option></Select>
                  </Field>
                </ActionForm>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Create account" description="The user signs in with the temporary password and must change it." />
            <CardBody>
              <ActionForm action={createUser} submitLabel="Create">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" htmlFor="fn"><Input id="fn" name="first_name" required /></Field>
                  <Field label="Last name" htmlFor="ln"><Input id="ln" name="last_name" required /></Field>
                </div>
                <Field label="Username" htmlFor="un" hint="e.g. dias.a — lowercase, no spaces"><Input id="un" name="username" required /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Role" htmlFor="role"><Select id="role" name="role" defaultValue="student"><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></Select></Field>
                  <Field label="Grade" htmlFor="grade"><Select id="grade" name="grade" defaultValue="12"><option value="">—</option><option value="11">11</option><option value="12">12</option></Select></Field>
                </div>
                <Field label="Class (students)" htmlFor="class_id">
                  <Select id="class_id" name="class_id" defaultValue=""><option value="">—</option>{(classes ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
                </Field>
              </ActionForm>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Bulk import students" description="CSV: first_name,last_name,username,class,grade" />
            <CardBody>
              <ActionForm action={importStudents} submitLabel="Import" pendingLabel="Importing…" encType="multipart/form-data">
                <input type="file" name="file" accept=".csv,text/csv" required className="block w-full text-sm" />
              </ActionForm>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
