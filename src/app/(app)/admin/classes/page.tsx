import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTeacherClasses } from "@/lib/teacher-data";
import { ACADEMIC_YEAR } from "@/lib/env";
import type { Profile } from "@/lib/db-types";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ActionForm, ConfirmButton } from "@/components/action-form";
import { archiveClass, assignClassTeacher } from "../actions";
import { createClass } from "../../teacher/actions";

export const metadata: Metadata = { title: "All classes" };

export default async function AdminClassesPage() {
  const me = await requireProfile(["admin"]);
  const supabase = await createClient();
  const classes = await getTeacherClasses(supabase, me, true);
  const { data: teachers } = await supabase.from("profiles").select("id, first_name, last_name, username").in("role", ["teacher", "admin"]).order("last_name");
  const staff = (teachers ?? []) as Pick<Profile, "id" | "first_name" | "last_name" | "username">[];
  return (
    <>
      <PageHeader title="Classes" description={`${classes.length} active classes`} />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <CardBody className="p-0">
            <Table>
              <thead><tr><Th>Class</Th><Th>Grade</Th><Th>Year</Th><Th>Students</Th><Th>Teacher</Th><Th className="text-right">Archive</Th></tr></thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id}>
                    <Td><Link href={`/teacher/classes/${c.id}`} className="font-medium hover:underline">{c.name}</Link></Td>
                    <Td>{c.grade}</Td>
                    <Td>{c.academic_year}</Td>
                    <Td className="tabular-nums">{c.member_count}</Td>
                    <Td>
                      <form action={assignClassTeacher} className="flex gap-2">
                        <input type="hidden" name="class_id" value={c.id} />
                        <Select name="teacher_id" defaultValue={c.teacher_id ?? ""} aria-label={`Teacher for ${c.name}`} className="h-8 text-xs">
                          <option value="">—</option>
                          {staff.map((t) => <option key={t.id} value={t.id}>{displayName(t)}</option>)}
                        </Select>
                        <Button type="submit" size="sm" variant="secondary">Set</Button>
                      </form>
                    </Td>
                    <Td className="text-right"><ConfirmButton action={archiveClass} fields={{ class_id: c.id }} label="Archive" variant="ghost" confirm={`Archive ${c.name}?`} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="New class" />
          <CardBody>
            <ActionForm action={createClass} submitLabel="Create class">
              <Field label="Name" htmlFor="name"><Input id="name" name="name" required /></Field>
              <Field label="Grade" htmlFor="grade"><Select id="grade" name="grade"><option value="11">11</option><option value="12">12</option></Select></Field>
              <Field label="Academic year" htmlFor="ay"><Input id="ay" name="academic_year" defaultValue={ACADEMIC_YEAR} /></Field>
              <Field label="Teacher" htmlFor="teacher_id">
                <Select id="teacher_id" name="teacher_id" defaultValue={me.id}>
                  {staff.map((t) => <option key={t.id} value={t.id}>{displayName(t)}</option>)}
                </Select>
              </Field>
            </ActionForm>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
