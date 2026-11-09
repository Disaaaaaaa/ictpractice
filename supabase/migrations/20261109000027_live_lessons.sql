-- =====================================================================
-- Lessons taught live in class (Teacher → Lessons).
--
-- lesson_plans  — the plan of a topic lesson from its ҚМЖ (content/kmzh):
--                 stages and blocks (slides, together tasks, individual /
--                 pair / group tasks, polls, exit ticket) with question ids.
-- live_sessions — a lesson being taught to a class: a copy of the plan and
--                 its state (open blocks, revealed answers, random groups).
-- live_participants — students who joined the session (presence).
-- live_answers  — answers given in the lesson; a pair or group answers once
--                 on the host's laptop and the answer is shared by members.
--
-- All writes go through the server (service role) after its checks; the
-- browser only reads, and receives changes through Realtime.
-- =====================================================================
create table public.lesson_plans (
  topic_id uuid not null references public.topics (id) on delete cascade,
  lesson_no smallint not null check (lesson_no between 1 and 20),
  plan jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (topic_id, lesson_no)
);

create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  lesson_no smallint not null,
  teacher_id uuid not null references public.profiles (id),
  plan jsonb not null,
  -- { open: [blockId], current: blockId, revealed: [questionId], groups: { blockId: [{ host, members, scenario }] } }
  state jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
create unique index live_sessions_one_active on public.live_sessions (class_id) where ended_at is null;
create index live_sessions_class on public.live_sessions (class_id, started_at desc);

create table public.live_participants (
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  primary key (session_id, student_id)
);

create table public.live_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  block_id text not null,
  -- a question id, or 'poll' for a block's poll
  item text not null,
  question_id uuid references public.questions (id),
  student_id uuid not null references public.profiles (id) on delete cascade,
  members uuid[] not null,
  answer jsonb not null,
  awarded numeric,
  max_mark numeric,
  needs_review boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (session_id, block_id, item, student_id)
);
create index live_answers_session on public.live_answers (session_id);

alter table public.lesson_plans enable row level security;
alter table public.live_sessions enable row level security;
alter table public.live_participants enable row level security;
alter table public.live_answers enable row level security;

create policy lesson_plans_staff_read on public.lesson_plans for select to authenticated using (public.is_staff());

create or replace function public.in_live_class(p_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.class_members m
                  where m.class_id = p_class and m.student_id = auth.uid() and m.status = 'active')
$$;
revoke execute on function public.in_live_class(uuid) from public, anon;
grant execute on function public.in_live_class(uuid) to authenticated, service_role;

create policy live_sessions_read on public.live_sessions for select to authenticated
  using (public.is_admin() or public.teaches_class(class_id) or public.in_live_class(class_id));

create policy live_participants_read on public.live_participants for select to authenticated
  using (student_id = auth.uid()
         or exists (select 1 from public.live_sessions s where s.id = session_id and (public.is_admin() or public.teaches_class(s.class_id))));

create policy live_answers_read on public.live_answers for select to authenticated
  using (auth.uid() = any (members)
         or exists (select 1 from public.live_sessions s where s.id = session_id and (public.is_admin() or public.teaches_class(s.class_id))));

grant select on public.lesson_plans, public.live_sessions, public.live_participants, public.live_answers to authenticated;
grant all on public.lesson_plans, public.live_sessions, public.live_participants, public.live_answers to service_role;

alter publication supabase_realtime add table public.live_sessions, public.live_participants, public.live_answers;
