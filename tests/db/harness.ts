// Runs the real Supabase migrations and seed inside PGlite (Postgres compiled
// to WASM) with a minimal stand-in for Supabase's auth schema and API roles,
// so RLS policies and RPCs can be tested without Docker.
import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const ROOT = join(__dirname, "../..");

const SUPABASE_STUB = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz default now()
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub',
    current_setting('request.jwt.claim.sub', true)), '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
create publication supabase_realtime;
`;

export type Db = PGlite & {
  as<T>(user: string | "service", fn: () => Promise<T>): Promise<T>;
  createUser(username: string, role?: "student" | "teacher" | "admin", grade?: number): Promise<string>;
};

export async function createDb(opts: { seed?: boolean } = {}): Promise<Db> {
  const db = new PGlite() as Db;
  await db.exec(SUPABASE_STUB);
  const dir = join(ROOT, "supabase/migrations");
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    try {
      await db.exec(readFileSync(join(dir, f), "utf8"));
    } catch (e) {
      throw new Error(`migration ${f} failed: ${(e as Error).message}`);
    }
  }
  if (opts.seed) {
    try {
      await db.exec(readFileSync(join(ROOT, "supabase/seed.sql"), "utf8"));
    } catch (e) {
      throw new Error(`seed failed: ${(e as Error).message}`);
    }
  }

  db.as = async (user, fn) => {
    if (user === "service") {
      await db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify({ role: "service_role" })]);
      await db.exec("set role service_role");
    } else {
      await db.query(`select set_config('request.jwt.claims', $1, false)`, [
        JSON.stringify({ sub: user, role: "authenticated" }),
      ]);
      await db.exec("set role authenticated");
    }
    try {
      return await fn();
    } finally {
      await db.exec("reset role");
      await db.query(`select set_config('request.jwt.claims', '', false)`);
    }
  };

  db.createUser = async (username, role = "student", grade) => {
    const uid = randomUUID();
    await db.query(`insert into auth.users (id, email) values ($1, $2)`, [uid, `${username}@students.internal`]);
    await db.query(
      `insert into public.profiles (id, username, first_name, last_name, role, grade, force_password_change)
       values ($1, $2, $3, 'Test', $4, $5, false)`,
      [uid, username, username, role, grade ?? (role === "student" ? 12 : null)],
    );
    return uid;
  };

  return db;
}
