-- =====================================================================
-- Practice progress survives page reloads and other devices.
--
-- * practice_attempts.result keeps the full feedback shown to the student
--   (marking points, review flag, correct options) so a checked question can
--   be shown again exactly as it was.
-- * practice_drafts keeps the answer a student is typing before checking it.
--   A draft row with answer_data = null means "the student pressed Retry".
--   The newest of {latest attempt, draft} wins when the page is reopened.
-- =====================================================================

alter table public.practice_attempts
  add column if not exists result jsonb;

create index if not exists practice_attempts_student_question_idx
  on public.practice_attempts (student_id, question_id, created_at desc);

create table if not exists public.practice_drafts (
  student_id uuid not null references public.profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  answer_data jsonb,
  -- feedback of a check that could not be marked automatically (no mark stored in practice_attempts)
  result jsonb,
  updated_at timestamptz not null default now(),
  primary key (student_id, question_id)
);

alter table public.practice_drafts enable row level security;

drop policy if exists practice_drafts_select on public.practice_drafts;
create policy practice_drafts_select on public.practice_drafts for select to authenticated
  using (student_id = auth.uid());

drop policy if exists practice_drafts_insert on public.practice_drafts;
create policy practice_drafts_insert on public.practice_drafts for insert to authenticated
  with check (student_id = auth.uid());

drop policy if exists practice_drafts_update on public.practice_drafts;
create policy practice_drafts_update on public.practice_drafts for update to authenticated
  using (student_id = auth.uid()) with check (student_id = auth.uid());

drop policy if exists practice_drafts_delete on public.practice_drafts;
create policy practice_drafts_delete on public.practice_drafts for delete to authenticated
  using (student_id = auth.uid());

grant select, insert, update, delete on public.practice_drafts to authenticated;
