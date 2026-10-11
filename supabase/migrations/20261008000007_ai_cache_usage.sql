-- =====================================================================
-- Fewer and cheaper AI marking calls.
--
-- * ai_grading_cache: the AI result for a (question, mark-scheme version,
--   normalised answer) is reused when the same answer is checked again, by
--   the same or another student. Only confident results are cached, and the
--   key includes the prompt version and model, so changing the mark scheme,
--   the prompt or the model invalidates old entries.
-- * ai_usage: one row per OpenAI call (or cache hit) to monitor spending.
-- Both tables are written by the server only (service role).
-- =====================================================================

create table if not exists public.ai_grading_cache (
  cache_key text primary key,
  question_id uuid references public.questions (id) on delete cascade,
  result jsonb not null,
  hits int not null default 0,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);
create index if not exists ai_grading_cache_question_idx on public.ai_grading_cache (question_id);

create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  context text not null check (context in ('practice', 'exam', 'other')),
  question_id uuid references public.questions (id) on delete set null,
  model text,
  reasoning_effort text,
  cache_hit boolean not null default false,
  prompt_tokens int not null default 0,
  completion_tokens int not null default 0,
  reasoning_tokens int not null default 0,
  cached_tokens int not null default 0
);
create index if not exists ai_usage_created_idx on public.ai_usage (created_at desc);

alter table public.ai_grading_cache enable row level security;
alter table public.ai_usage enable row level security;

-- Administrators may read the usage log; nobody but the server writes either table.
drop policy if exists ai_usage_admin_select on public.ai_usage;
create policy ai_usage_admin_select on public.ai_usage for select to authenticated using (public.is_admin());

revoke all on public.ai_grading_cache from anon, authenticated;
revoke all on public.ai_usage from anon;
grant select on public.ai_usage to authenticated;
