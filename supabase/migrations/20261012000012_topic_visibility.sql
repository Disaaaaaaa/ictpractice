-- =====================================================================
-- Topic visibility per class (Teacher → Topic Visibility)
--
-- A teacher can hide topics from a class, e.g. to show only what has been
-- covered so far. A row in class_hidden_topics = "this topic is hidden
-- from this class"; no row = shown (the default).
--
-- A hidden topic disappears for the students of that class everywhere the
-- app reads topics — Learn & Practice, Exam Papers, the topic's theory,
-- practice and exam pages, search and progress — because the rule lives in
-- the topics and exams RLS policies. Staff always see every topic.
--
-- Two exceptions keep students from being locked out:
--   * a student in several classes sees a topic unless it is hidden in
--     all of them;
--   * a topic the student has been assigned is always visible.
-- =====================================================================

create table if not exists public.class_hidden_topics (
  class_id uuid not null references public.classes (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  hidden_by uuid references public.profiles (id) on delete set null,
  hidden_at timestamptz not null default now(),
  primary key (class_id, topic_id)
);
create index if not exists class_hidden_topics_topic_idx on public.class_hidden_topics (topic_id);

create or replace function public.topic_hidden_for_me(p_topic uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    -- the caller belongs to at least one active class ...
    exists (
      select 1 from public.class_members m
        join public.classes c on c.id = m.class_id and c.archived_at is null
       where m.student_id = auth.uid() and m.status = 'active')
    -- ... and none of their classes shows the topic
    and not exists (
      select 1 from public.class_members m
        join public.classes c on c.id = m.class_id and c.archived_at is null
       where m.student_id = auth.uid() and m.status = 'active'
         and not exists (
               select 1 from public.class_hidden_topics h
                where h.class_id = m.class_id and h.topic_id = p_topic))
    -- ... and it has not been assigned to them
    and not exists (
      select 1 from public.assignments a
        left join public.exams e on e.id = a.exam_id
       where a.archived_at is null
         and (a.topic_id = p_topic or e.topic_id = p_topic)
         and public.is_assignment_target(a.id, auth.uid()))
$$;

revoke execute on function public.topic_hidden_for_me(uuid) from public, anon;
grant execute on function public.topic_hidden_for_me(uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.class_hidden_topics enable row level security;
grant select, insert, delete on public.class_hidden_topics to authenticated;
revoke update on public.class_hidden_topics from authenticated;

drop policy if exists class_hidden_topics_select on public.class_hidden_topics;
create policy class_hidden_topics_select on public.class_hidden_topics for select to authenticated
  using (public.is_staff() or public.is_class_member(class_id));

drop policy if exists class_hidden_topics_insert on public.class_hidden_topics;
create policy class_hidden_topics_insert on public.class_hidden_topics for insert to authenticated
  with check (public.is_admin() or (public.is_staff() and public.teaches_class(class_id)));

drop policy if exists class_hidden_topics_delete on public.class_hidden_topics;
create policy class_hidden_topics_delete on public.class_hidden_topics for delete to authenticated
  using (public.is_admin() or (public.is_staff() and public.teaches_class(class_id)));

drop policy if exists topics_select on public.topics;
create policy topics_select on public.topics for select to authenticated
  using (
    public.is_staff()
    or (status = 'published' and archived_at is null and not public.topic_hidden_for_me(id))
  );

-- Exams that belong to a hidden topic (its topic exam) are hidden with it —
-- except for a student who has already sat it, so past results stay readable.
drop policy if exists exams_select on public.exams;
create policy exams_select on public.exams for select to authenticated
  using (
    public.is_staff()
    or (archived_at is null
        and status in ('published', 'scheduled', 'closed')
        and (kind::text <> 'summative' or public.summative_visible(id))
        and (topic_id is null
             or not public.topic_hidden_for_me(topic_id)
             or exists (select 1 from public.attempts t where t.exam_id = exams.id and t.student_id = auth.uid())))
  );
