-- =====================================================================
-- Notes check: a student photographs the notes (конспект) they wrote for a
-- topic and AI checks them against the key points of the topic's theory.
--
-- To keep AI cost low and the result consistent:
--   * topic_note_rubrics holds a short checklist of key points per topic,
--     generated once from the theory pack and reused for every check
--     (regenerated only when the theory changes — source_hash);
--   * the vision call receives that checklist, never the whole theory, and
--     returns one status per point; the percentage and the advice are
--     computed by the server from the checklist weights;
--   * photos are downscaled in the browser before upload;
--   * re-submitting the same photos reuses the stored result (content_hash).
--
-- percentage is 0–100 so that it can later be converted into a mark.
-- Both tables are written by the server only (service role).
-- =====================================================================

create table if not exists public.topic_note_rubrics (
  topic_id uuid primary key references public.topics (id) on delete cascade,
  -- [{ "title": "...", "must": "...", "weight": 1..3 }]
  points jsonb not null check (jsonb_typeof(points) = 'array'),
  source_hash text not null,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.note_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  -- objects in the private "notes" storage bucket
  image_paths text[] not null check (cardinality(image_paths) between 1 and 6),
  content_hash text not null,
  rubric_hash text not null,
  -- CHECKED: marked · UNREADABLE: the photos could not be read or are not notes on this topic
  status text not null check (status in ('CHECKED', 'UNREADABLE')),
  percentage numeric(5, 2) check (percentage is null or percentage between 0 and 100),
  -- { points: [{ title, must, weight, status, note }], errors: [...], advice: [{ kind, title, text, gain }] }
  result jsonb not null,
  model text,
  prompt_tokens int not null default 0,
  completion_tokens int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists note_submissions_student_idx on public.note_submissions (student_id, topic_id, created_at desc);
create index if not exists note_submissions_topic_idx on public.note_submissions (topic_id, created_at desc);

alter table public.topic_note_rubrics enable row level security;
alter table public.note_submissions enable row level security;

revoke all on public.topic_note_rubrics from anon, authenticated;
revoke all on public.note_submissions from anon, authenticated;
grant select on public.topic_note_rubrics to authenticated;
grant select on public.note_submissions to authenticated;

-- The checklist itself is for staff; students see it only through their results.
drop policy if exists topic_note_rubrics_staff on public.topic_note_rubrics;
create policy topic_note_rubrics_staff on public.topic_note_rubrics for select to authenticated
  using (public.is_staff());

-- Own checks, or those of the caller's students.
drop policy if exists note_submissions_select on public.note_submissions;
create policy note_submissions_select on public.note_submissions for select to authenticated
  using (public.can_view_student(student_id));

-- AI usage log: one more context.
alter table public.ai_usage drop constraint if exists ai_usage_context_check;
alter table public.ai_usage
  add constraint ai_usage_context_check check (context in ('practice', 'exam', 'other', 'notes'));

-- Private bucket for the photos; the server hands out short-lived signed URLs.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('notes', 'notes', false, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
    on conflict (id) do nothing;
  end if;
end $$;
