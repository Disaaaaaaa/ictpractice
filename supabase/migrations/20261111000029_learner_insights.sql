-- =====================================================================
-- Learner insights from Exam Mode.
--
-- learner_insights — what the teacher noticed about a student's exam answers:
--   kind  strength | gap | habit
--   tag   a fixed code (see src/lib/insights.ts), so a class can be summed up
--   text  the observation in plain English, shown to the student and teacher
--   seen  how many checks confirmed it; resolved_at when it no longer applies
-- Written only by the server (the teacher's check scripts); students read their
-- own, teachers their students'.
--
-- exam_skill_stats(student) — marks per learning objective and per command word
-- from the student's marked Exam Mode answers.
-- =====================================================================
create table if not exists public.learner_insights (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  kind text not null check (kind in ('strength', 'gap', 'habit')),
  tag text not null check (tag ~ '^[a-z0-9-]{2,60}$'),
  text text not null check (length(text) between 3 and 400),
  source text not null default 'exam' check (source in ('exam')),
  seen integer not null default 1 check (seen > 0),
  last_attempt_id uuid references public.attempts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);
-- one open insight per student, tag and topic (a topic-less tag counts once)
create unique index if not exists learner_insights_open_uniq
  on public.learner_insights (student_id, tag, coalesce(topic_id, '00000000-0000-0000-0000-000000000000'::uuid))
  where resolved_at is null;
create index if not exists learner_insights_student_idx on public.learner_insights (student_id, updated_at desc);

alter table public.learner_insights enable row level security;
revoke all on public.learner_insights from anon, authenticated;
grant select on public.learner_insights to authenticated;

drop policy if exists learner_insights_select on public.learner_insights;
create policy learner_insights_select on public.learner_insights for select to authenticated
  using (public.can_view_student(student_id));

create or replace function public.exam_skill_stats(p_student uuid)
returns table (
  dimension text,      -- 'objective' or 'command'
  code text,           -- e.g. 11.4.1.6, or explain
  label text,          -- the objective's description, or the command word
  awarded numeric,
  max_marks numeric,
  answers integer
)
language sql
stable
security definer
set search_path = public
as $$
  with r as (
    select g.question_id,
           coalesce(g.teacher_override_mark, g.final_mark, g.awarded_mark, 0)::numeric as awarded,
           g.max_mark::numeric as max_mark
      from public.grading_results g
      join public.attempts a on a.id = g.attempt_id
      join public.exams e on e.id = a.exam_id
     where a.student_id = p_student
       and public.can_view_student(p_student)
       and a.status::text = 'GRADED'
       and e.kind::text = 'topic'
       and g.status::text = 'COMPLETE'
       and g.max_mark > 0
  )
  select 'objective', lo.code, lo.description, sum(r.awarded), sum(r.max_mark), count(*)::int
    from r
    join public.question_objectives qo on qo.question_id = r.question_id
    join public.learning_objectives lo on lo.id = qo.learning_objective_id
   group by lo.code, lo.description
  union all
  select 'command', q.command_word::text, q.command_word::text, sum(r.awarded), sum(r.max_mark), count(*)::int
    from r
    join public.questions q on q.id = r.question_id
   where q.command_word is not null
   group by q.command_word
$$;

revoke execute on function public.exam_skill_stats(uuid) from public, anon;
grant execute on function public.exam_skill_stats(uuid) to authenticated, service_role;
