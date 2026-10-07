# NIS Computer Science — Exam Preparation Platform

Web platform for Grade 11–12 NIS Computer Science: theory packs, practice with instant feedback, timed Exam Mode with integrity monitoring, mock exams by year and paper, automatic + AI marking with teacher moderation, and LO-level progress analytics.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Postgres, Auth, Realtime, RLS) · OpenAI (server-side only).

## Architecture in one picture

```
Curriculum version ─┬─ Topic (stored once) ─── Learning objectives ─── Questions
                    │     ├─ school placement: Grade → Term → Unit
                    │     └─ exam placement:   Paper → Section
                    └─ LO ↔ Paper map (drives paper readiness)

Exam ─ published → immutable exam_version (paper + marking snapshot) ← attempts → answers
                                                                         ├→ integrity_events
                                                                         └→ grading_results → student_mastery
```

- Topics never duplicate: Term and Paper are two classifications of the same topic.
- Learning objectives are keyed by `(curriculum_version_id, code)` — the KTP and the Paper document use the same code with different wording (e.g. `11.3.1.1`), so the Paper document is imported as its own version (`NIS_CS_EXAM_SPEC`) and the 2026–27 programme is mapped to papers by strand.
- Students sit an immutable **exam version**; editing the question bank never changes past results.
- Exam rules live in Postgres functions: server-time deadline, autosave rejection after the deadline, violation counting, auto-submit on violation limit, second-session detection.
- The OpenAI key is used only in server code (`src/lib/grading/ai.ts`); the prompt is built on the server from the question, mark scheme and answer, and the result must match a strict JSON schema.

## Project layout

| Path | Contents |
|---|---|
| `supabase/migrations/` | Schema, RPCs (exam lifecycle, grading, moderation), RLS policies |
| `supabase/seed.sql` | Generated — curriculum + content (`npm run seed:build`) |
| `content/curriculum/` | Generated from `docs/source/*.docx` (`npm run curriculum:import`) |
| `content/topics/`, `content/mocks/` | Theory packs, questions, mock exams — see [docs/CONTENT.md](docs/CONTENT.md) |
| `src/app/(app)/` | Student, teacher and admin pages |
| `src/app/attempt/[attemptId]` | Exam Mode runner (no navigation shell) |
| `src/app/api/` | Grading trigger, unload beacon, retry cron, CSV/XLSX export |
| `src/lib/grading/` | Deterministic grader, OpenAI examiner, attempt grader with retries |
| `src/proxy.ts` | Session refresh, forced password change, role routing, exam navigation lock |
| `tests/` | Postgres tests (real migrations in PGlite) and unit tests |

## Setup

### 1. Supabase project

1. Create a project at supabase.com.
2. **Authentication → Providers → Email**: turn **off** “Allow new users to sign up” (accounts are created by staff only) and turn off “Confirm email”.
3. Minimum password length 6 or more (the temporary password `111111` is 6 characters). If *leaked password protection* is enabled, choose a different `DEFAULT_TEMP_PASSWORD`.
4. Apply the database:
   - with the Supabase CLI: `supabase init` (keeps the existing `migrations/`), `supabase link --project-ref <ref>`, `supabase db push`, then run `supabase/seed.sql` in the SQL editor; or
   - paste the three files in `supabase/migrations/` (in order) and then `supabase/seed.sql` into the SQL editor.
5. Realtime is enabled for `attempts` and `integrity_events` by the migration (live exam monitoring).

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in the Supabase URL, anon key, service-role key, OpenAI key and a random `CRON_SECRET`. `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only.

### 3. Run

```bash
npm install
npm run users:bootstrap -- --admin admin --first Dias --last Asylbek
npm run dev
```

Sign in as `admin` / `111111`; you will be asked to choose a new password. Add `--demo` to the bootstrap command to also create `demo.teacher`, class `12-DEMO` and three demo students.

Then: *Admin → Users* to create teachers, or *Classes → Import students (CSV)* with columns `first_name,last_name,username,class,grade`.

### 4. Deploy (Vercel)

Set the same environment variables in the Vercel project. `vercel.json` schedules `/api/cron/grade` every 5 minutes to close overdue attempts and retry failed AI marking (the Hobby plan allows only daily crons — use Pro, or call the endpoint from any scheduler with `Authorization: Bearer $CRON_SECRET`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm test` | DB tests (migrations + seed + RLS + exam lifecycle in PGlite) and unit tests |
| `npm run typecheck`, `npm run lint` | Static checks |
| `npm run curriculum:import` | Rebuild `content/curriculum/*.json` from the KTP and Paper documents |
| `npm run seed:build` | Validate `content/` and regenerate `supabase/seed.sql` |
| `npm run users:bootstrap` | Create the first admin (and demo accounts) |
| `npm run content:generate -- <slug> [--part questions\|theory\|all] [--apply] [--draft]` | Generate theory/questions with the OpenAI API (`CONTENT_MODEL`, default `gpt-5.5`), validate, save and optionally upload |
| `npm run theory:apply -- <slug>` / `npm run questions:apply -- <slug>` | Upload a topic's theory or questions (+ topic exam) from `content/topics/<slug>.json` |
| `npm run import:html -- <file.html> [--apply]` | Convert an HTML theory pack and optionally upload it |

## Roles

- **Student** — dashboard, Learn & Practice (by school programme or by paper), Exam Mode, mock exams, results, My Progress.
- **Teacher** — classes and students (create, CSV import, reset password), assignments with integrity policy and result release, live exam monitor (Realtime), exam builder with versioning, question bank, moderation of AI marks (audited), analytics (class stats, topic/LO performance, paper readiness, LO heatmap, item analysis), CSV/XLSX export. Teachers see only students in their own classes (RLS).
- **Admin** — everything above plus users, all classes, curriculum (topics, LOs, school/paper mapping), theory-pack editor, system settings (mastery weights, AI confidence threshold), audit log.

## Exam integrity — what a browser can and cannot do

Recorded: leaving the tab, window blur, fullscreen exit, reload, closing the page, connection loss/restore, the same attempt opened in another window or device. Teachers choose *monitor only*, *warning*, or *auto-submit after N violations*. A web page **cannot** prevent Alt+Tab, other applications, a second monitor or a phone — these events are signals for the teacher, not proof of cheating.
