-- =====================================================================
-- Notes checked by the teacher in batches instead of instantly by the AI.
--
-- With system_settings.notes.mode = 'queue' a student's photos are stored
-- as PENDING (no AI call). The teacher's checking session later marks the
-- waiting notes of the whole class against the lesson's checklist and sets
-- them to CHECKED or UNREADABLE (scripts/notes-queue.ts, notes-grade.ts).
-- 'ai' keeps the instant AI check.
--
-- A PENDING check counts towards the lesson's points once it is marked; its
-- time is when the student handed it in, so a deadline is met on submission.
-- =====================================================================
alter table public.note_submissions drop constraint if exists note_submissions_status_check;
alter table public.note_submissions
  add constraint note_submissions_status_check check (status in ('PENDING', 'CHECKED', 'UNREADABLE'));

alter table public.note_submissions
  add column if not exists checked_at timestamptz,
  add column if not exists checked_by text check (checked_by in ('ai', 'teacher'));
update public.note_submissions set checked_at = created_at, checked_by = 'ai' where checked_at is null and status <> 'PENDING';

create index if not exists note_submissions_pending_idx on public.note_submissions (created_at) where status = 'PENDING';

insert into public.system_settings (key, value)
values ('notes', '{"mode": "queue"}')
on conflict (key) do nothing;
