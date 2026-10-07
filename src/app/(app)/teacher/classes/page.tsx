import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTeacherClasses } from "@/lib/teacher-data";
import { ACADEMIC_YEAR } from "@/lib/env";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionForm } from "@/components/action-form";
import { createClass, importStudents } from "../actions";

export const metadata: Metadata = { title: "Classes" };

export default async function ClassesPage() {
  const profile = await requireProfile(["teacher", "admin"]);
  const supabase = await createClient();
  const classes = await getTeacherClasses(supabase, profile);
  return (
    <>
      <PageHeader title="Classes" description="Your classes for this academic year." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {classes.length === 0 ? (
            <EmptyState title="No classes yet">Create a class, then add students individually or import a CSV file.</EmptyState>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {classes.map((c) => (
                <Link key={c.id} href={`/teacher/classes/${c.id}`} className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-2">
                  <p className="text-2xl font-semibold">{c.name}</p>
                  <p className="text-sm text-muted">Grade {c.grade} · {c.academic_year}</p>
                  <p className="mt-3 text-sm font-medium">{c.member_count} student{c.member_count === 1 ? "" : "s"}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="New class" />
            <CardBody>
              <ActionForm action={createClass} submitLabel="Create class">
                <Field label="Name" htmlFor="name"><Input id="name" name="name" placeholder="12A" required maxLength={40} /></Field>
                <Field label="Grade" htmlFor="grade">
                  <Select id="grade" name="grade" defaultValue="12"><option value="11">11</option><option value="12">12</option></Select>
                </Field>
                <Field label="Academic year" htmlFor="academic_year"><Input id="academic_year" name="academic_year" defaultValue={ACADEMIC_YEAR} /></Field>
              </ActionForm>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Import students (CSV)" description="Columns: first_name, last_name, username, class, grade" />
            <CardBody>
              <ActionForm action={importStudents} submitLabel="Import" pendingLabel="Importing…" encType="multipart/form-data">
                <input type="file" name="file" accept=".csv,text/csv" required className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary" />
                <p className="text-xs text-muted">
                  New accounts get the temporary password and must change it at first login. Missing classes are created for you.
                </p>
              </ActionForm>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
