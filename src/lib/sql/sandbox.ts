import "server-only";
import type { PGlite } from "@electric-sql/pglite";

// A throw-away PostgreSQL (PGlite, in memory, inside the server function) for
// SQL practice: students run their code against a small sample database and
// the same engine marks it. Nothing here touches the real database.
//
// Every run happens inside BEGIN … ROLLBACK, so the sample database is always
// back to empty afterwards; runs are queued one at a time.

export type SqlResultSet = {
  command: string;
  columns: string[];
  rows: (string | null)[][];
  rowCount: number;
};
export type SqlTable = { name: string; columns: string[]; rows: (string | null)[][]; total: number };
export type SqlRun = {
  ok: boolean;
  /** one entry per statement that ran */
  results: SqlResultSet[];
  error: string | null;
  /** the database's tables after the code (for showing what changed) */
  tables: SqlTable[];
};

export const SQL_MAX_LENGTH = 4000;
const MAX_ROWS = 100;

let dbPromise: Promise<PGlite> | null = null;
function db(): Promise<PGlite> {
  if (!dbPromise) {
    dbPromise = import("@electric-sql/pglite").then(async ({ PGlite }) => {
      const d = new PGlite();
      await d.waitReady;
      return d;
    });
    dbPromise.catch(() => (dbPromise = null));
  }
  return dbPromise;
}

let queue: Promise<unknown> = Promise.resolve();
function serial<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => undefined);
  return run;
}

/** MySQL habits taught in class, turned into PostgreSQL. */
export function toPostgres(sql: string): string {
  return sql
    .replace(/`([^`]*)`/g, '"$1"')
    .replace(/\b(?:INT|INTEGER)\b\s+(NOT\s+NULL\s+)?AUTO_?INCREMENT\b/gi, (_, nn?: string) => (nn ? `SERIAL ${nn.trim()}` : "SERIAL"))
    .replace(/\bAUTO_?INCREMENT\b/gi, "")
    .replace(/\bDATETIME\b/gi, "TIMESTAMP")
    .replace(/\bDOUBLE\b(?!\s+PRECISION)/gi, "DOUBLE PRECISION")
    .replace(/\bTINYINT\s*\(\s*1\s*\)/gi, "BOOLEAN")
    .replace(/\bTINYINT\b/gi, "SMALLINT")
    .replace(/\bINT\s*\(\s*\d+\s*\)/gi, "INT")
    .replace(/\bENGINE\s*=\s*\w+/gi, "");
}

const BLOCKED = /\b(generate_series|pg_sleep|copy|recursive|lo_import|lo_export|dblink|set\s+role|create\s+(?:or\s+replace\s+)?function|create\s+extension|do\s+\$|begin|commit|rollback|savepoint|vacuum)\b/i;

export function checkSqlInput(code: string): string | null {
  if (code.length > SQL_MAX_LENGTH) return `Your code is too long (over ${SQL_MAX_LENGTH} characters).`;
  const bare = code.replace(/'(?:[^']|'')*'/g, "''").replace(/--[^\n]*/g, "");
  const m = bare.match(BLOCKED);
  if (m) return `"${m[1].toUpperCase()}" is not allowed here.`;
  return null;
}

function cell(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v.toISOString().slice(0, v.getUTCHours() || v.getUTCMinutes() ? 16 : 10).replace("T", " ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

type Raw = { command?: string; fields: { name: string }[]; rows: unknown[][]; rowCount?: number; affectedRows?: number };

function toResult(r: Raw): SqlResultSet {
  return {
    command: (r.command ?? "").toUpperCase(),
    columns: r.fields.map((f) => f.name),
    rows: r.rows.slice(0, MAX_ROWS).map((row) => row.map(cell)),
    rowCount: r.rowCount ?? r.rows.length,
  };
}

function friendly(e: unknown, code: string): string {
  let msg = (e as Error).message || "The code could not run.";
  const col = msg.match(/^column "([^"]+)" does not exist/);
  if (col && code.includes(`"${col[1]}"`)) msg += ' — text values need single quotes: \'like this\'.';
  if (/syntax error at end of input/.test(msg)) msg += " — something is missing at the end (a bracket or a value?).";
  return msg;
}

async function snapshot(d: PGlite): Promise<SqlTable[]> {
  const names = await d.query<[string]>(
    "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by table_name",
    [],
    { rowMode: "array" },
  );
  const out: SqlTable[] = [];
  for (const [name] of names.rows) {
    const q = `"${name.replace(/"/g, '""')}"`;
    const r = (await d.query(`select * from ${q} limit ${MAX_ROWS}`, [], { rowMode: "array" })) as unknown as Raw;
    const total = (await d.query<[number]>(`select count(*)::int from ${q}`, [], { rowMode: "array" })).rows[0][0];
    out.push({ name, columns: r.fields.map((f) => f.name), rows: r.rows.map((row) => row.map(cell)), total });
  }
  return out;
}

/**
 * Runs `setup` (the sample database) and then `code`, returns what each
 * statement produced, then rolls everything back. `after` runs once more
 * at the end (e.g. a query that shows the result of the student's changes)
 * and `probes` are statements that are each tried and undone, reporting
 * whether they succeeded (to test constraints such as NOT NULL or CHECK).
 */
export async function runSql(
  setup: string,
  code: string,
  opts: { snapshot?: boolean; after?: string; probes?: string[] } = {},
): Promise<SqlRun & { after?: SqlResultSet | null; probes?: boolean[] }> {
  const blocked = checkSqlInput(code);
  if (blocked) return { ok: false, results: [], error: blocked, tables: [] };
  const d = await db();
  return serial(async () => {
    await d.exec("BEGIN");
    try {
      if (setup.trim()) await d.exec(setup);
      await d.exec("SAVEPOINT student");
      let results: SqlResultSet[] = [];
      let error: string | null = null;
      try {
        if (code.trim()) results = ((await d.exec(toPostgres(code), { rowMode: "array" })) as unknown as Raw[]).map(toResult);
      } catch (e) {
        error = friendly(e, code);
        await d.exec("ROLLBACK TO SAVEPOINT student");
      }
      let after: SqlResultSet | null | undefined;
      if (opts.after) {
        try {
          const r = (await d.exec(opts.after, { rowMode: "array" })) as unknown as Raw[];
          after = r.length ? toResult(r[r.length - 1]) : null;
        } catch {
          after = null;
          await d.exec("ROLLBACK TO SAVEPOINT student").catch(() => undefined);
        }
      }
      let probes: boolean[] | undefined;
      if (opts.probes?.length) {
        probes = [];
        for (const p of opts.probes) {
          await d.exec("SAVEPOINT probe");
          try {
            await d.exec(p);
            probes.push(true);
          } catch {
            probes.push(false);
          }
          await d.exec("ROLLBACK TO SAVEPOINT probe");
        }
      }
      const tables = opts.snapshot ? await snapshot(d) : [];
      return { ok: !error, results, error, tables, after, probes };
    } finally {
      await d.exec("ROLLBACK").catch(() => undefined);
    }
  });
}
