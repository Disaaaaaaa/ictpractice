-- =====================================================================
-- Lessons and points towards the unit's SAU.
--
-- A topic is taught over several lessons: one lesson per 2 hours of the
-- KTP. Each lesson has its own part of the theory pack, its own practice
-- questions, its own notes check and its own short Exam Mode test, and
-- earns up to 6 points:
--
--   practice  2 × marks of the first attempt at each lesson question / all marks
--   notes     2 × best notes-check percentage
--   exam      2 × percentage of the first attempt at the lesson exam
--
-- Only work done before the lesson's deadline counts (the deadline of the
-- lesson assignment; no assignment = no deadline). The points of a unit's
-- lessons are added up, and the SAU is worth as many points again.
--
-- Topics without lessons keep working as before (lesson_no is null).
-- =====================================================================

create table if not exists public.topic_lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  number smallint not null check (number between 1 and 20),
  title text not null check (length(title) between 1 and 300),
  unique (topic_id, number)
);
alter table public.topic_lessons enable row level security;
drop policy if exists topic_lessons_select on public.topic_lessons;
-- visible with the topic (topics RLS applies inside the subquery)
create policy topic_lessons_select on public.topic_lessons for select to authenticated
  using (exists (select 1 from public.topics t where t.id = topic_id));
grant select on public.topic_lessons to authenticated;
grant all on public.topic_lessons to service_role;

alter table public.theory_sections add column if not exists lesson_no smallint check (lesson_no between 1 and 20);
alter table public.questions add column if not exists lesson_no smallint check (lesson_no between 1 and 20);
alter table public.exams add column if not exists lesson_no smallint check (lesson_no between 1 and 20);
alter table public.note_submissions add column if not exists lesson_no smallint check (lesson_no between 1 and 20);
alter table public.assignments add column if not exists lesson_no smallint check (lesson_no between 1 and 20);

-- one live exam per lesson
create unique index if not exists exams_one_per_lesson
  on public.exams (topic_id, lesson_no) where lesson_no is not null and archived_at is null;
create index if not exists questions_topic_lesson_idx on public.questions (topic_id, lesson_no);
create index if not exists note_submissions_lesson_idx on public.note_submissions (student_id, topic_id, lesson_no);

-- A notes checklist per lesson (0 = the whole topic).
alter table public.topic_note_rubrics add column if not exists lesson_no smallint not null default 0;
alter table public.topic_note_rubrics drop constraint if exists topic_note_rubrics_pkey;
alter table public.topic_note_rubrics add primary key (topic_id, lesson_no);

-- ---------------------------------------------------------------------
-- The raw figures behind the points of every lesson of a unit, for the
-- students of a class. Staff who teach the class (or an admin) get every
-- student; a student of the class gets only their own rows.
-- ---------------------------------------------------------------------
create or replace function public.lesson_points(p_class_id uuid, p_unit_id uuid)
returns table (
  student_id uuid,
  topic_id uuid,
  lesson_no smallint,
  deadline timestamptz,
  practice_awarded numeric,
  practice_max numeric,
  notes_pct numeric,      -- best checked notes, 0–100; null = none yet
  exam_id uuid,           -- the lesson exam; null = the lesson has none yet
  exam_pct numeric,       -- first attempt, 0–100; null = not sat or not marked
  exam_pending boolean    -- first attempt sat but not marked yet
)
language sql
stable
security definer
set search_path = public
as $$
  with st as (
    select m.student_id as id
      from public.class_members m
     where m.class_id = p_class_id and m.status = 'active'
       and (public.is_admin() or public.teaches_class(p_class_id) or m.student_id = auth.uid())
  ),
  les as (
    select distinct tl.topic_id, tl.number
      from public.topic_lessons tl
      join public.school_placements sp on sp.topic_id = tl.topic_id and sp.unit_id = p_unit_id
  ),
  sl as (
    select st.id as student_id, les.topic_id, les.number,
           (select max(a.deadline)
              from public.assignments a
              join public.assignment_targets t on t.assignment_id = a.id
             where a.topic_id = les.topic_id and a.lesson_no = les.number and a.archived_at is null
               and (t.class_id = p_class_id or t.student_id = st.id)) as deadline
      from st cross join les
  ),
  -- the lesson's practice set, as the Practice page builds it
  pq as (
    select q.id, q.topic_id, q.lesson_no, q.marks
      from public.questions q
      left join public.questions par on par.id = q.parent_id
     where q.topic_id in (select topic_id from les)
       and q.lesson_no is not null
       and q.status = 'published' and q.practice_enabled and q.archived_at is null
       and q.question_type::text <> 'structured'
       and (q.parent_id is null
            or (par.status = 'published' and par.practice_enabled and par.archived_at is null
                and par.question_type::text = 'structured'))
  ),
  pmax as (
    select pq.topic_id, pq.lesson_no, sum(pq.marks)::numeric as marks from pq group by 1, 2
  ),
  firsts as (
    select distinct on (pa.student_id, pa.question_id)
           pa.student_id, pq.topic_id, pq.lesson_no, pa.awarded_mark, pa.created_at
      from public.practice_attempts pa
      join pq on pq.id = pa.question_id
     where pa.student_id in (select id from st)
     order by pa.student_id, pa.question_id, pa.created_at
  ),
  pr as (
    select sl.student_id, sl.topic_id, sl.number, coalesce(sum(f.awarded_mark), 0)::numeric as awarded
      from sl
      join firsts f on f.student_id = sl.student_id and f.topic_id = sl.topic_id and f.lesson_no = sl.number
     where sl.deadline is null or f.created_at <= sl.deadline
     group by 1, 2, 3
  ),
  nt as (
    select sl.student_id, sl.topic_id, sl.number, max(n.percentage) as pct
      from sl
      join public.note_submissions n
        on n.student_id = sl.student_id and n.topic_id = sl.topic_id and n.lesson_no = sl.number
     where n.status = 'CHECKED' and (sl.deadline is null or n.created_at <= sl.deadline)
     group by 1, 2, 3
  ),
  ex as (
    select e.id, e.topic_id, e.lesson_no
      from public.exams e
     where e.topic_id in (select topic_id from les) and e.lesson_no is not null
       and e.archived_at is null and e.current_version_id is not null
       and e.status::text in ('published', 'scheduled', 'closed')
  ),
  first_att as (
    select distinct on (t.student_id, t.exam_id) t.student_id, t.exam_id, t.status::text as status, t.percentage, t.submitted_at
      from public.attempts t
     where t.exam_id in (select id from ex) and t.student_id in (select id from st)
     order by t.student_id, t.exam_id, t.created_at
  )
  select sl.student_id, sl.topic_id, sl.number, sl.deadline,
         coalesce(pr.awarded, 0), coalesce(pmax.marks, 0),
         nt.pct,
         ex.id,
         case when fa.status = 'GRADED' and (sl.deadline is null or fa.submitted_at <= sl.deadline) then fa.percentage end,
         coalesce(fa.status in ('SUBMITTED', 'REVIEW_REQUIRED') and (sl.deadline is null or fa.submitted_at <= sl.deadline), false)
    from sl
    left join pr on pr.student_id = sl.student_id and pr.topic_id = sl.topic_id and pr.number = sl.number
    left join pmax on pmax.topic_id = sl.topic_id and pmax.lesson_no = sl.number
    left join nt on nt.student_id = sl.student_id and nt.topic_id = sl.topic_id and nt.number = sl.number
    left join ex on ex.topic_id = sl.topic_id and ex.lesson_no = sl.number
    left join first_att fa on fa.student_id = sl.student_id and fa.exam_id = ex.id
$$;

revoke execute on function public.lesson_points(uuid, uuid) from public, anon;
grant execute on function public.lesson_points(uuid, uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------
-- A topic assignment for one lesson (lesson_no set): its progress counts
-- the lesson's theory sections and practice questions only; exam_id is
-- the lesson exam.
-- ---------------------------------------------------------------------
create or replace function public.topic_assignment_progress(p_assignment_id uuid)
returns table (
  student_id uuid,
  theory_done int,
  theory_total int,
  theory_completed_at timestamptz,
  practice_done int,
  practice_total int,
  practice_needed int,
  practice_reached_at timestamptz,
  exam_attempt_id uuid,
  exam_status text,
  exam_submitted_at timestamptz,   -- first submission (decides "on time")
  exam_percentage numeric          -- latest attempt; staff only
)
language sql
stable
security definer
set search_path = public
as $$
  with a as (
    select x.* from public.assignments x
     where x.id = p_assignment_id and x.topic_id is not null
       and (x.teacher_id = auth.uid() or public.is_admin() or public.is_assignment_target(x.id, auth.uid()))
  ),
  st as (
    select distinct s.id
      from a
      join public.assignment_targets t on t.assignment_id = a.id
      left join public.class_members m on m.class_id = t.class_id and m.status = 'active'
      join public.profiles s on s.id = coalesce(t.student_id, m.student_id) and s.role = 'student'
     where public.is_staff() or s.id = auth.uid()
  ),
  sec as (
    select s.id
      from a
      join public.theory_packs tp on tp.topic_id = a.topic_id and tp.status = 'published'
      join public.theory_sections s on s.theory_pack_id = tp.id
     where a.lesson_no is null or s.lesson_no = a.lesson_no
  ),
  th as (
    select g.student_id, count(*)::int as done, max(g.viewed_at) as last_at
      from public.theory_progress g
     where g.student_id in (select id from st) and g.theory_section_id in (select id from sec)
     group by g.student_id
  ),
  -- the topic's practice set, exactly as the Practice page builds it
  pq as (
    select q.id
      from public.questions q
      left join public.questions par on par.id = q.parent_id
     where q.topic_id = (select topic_id from a)
       and ((select lesson_no from a) is null or q.lesson_no = (select lesson_no from a))
       and q.status = 'published' and q.practice_enabled and q.archived_at is null
       and q.question_type::text <> 'structured'
       and (q.parent_id is null
            or (par.status = 'published' and par.practice_enabled and par.archived_at is null
                and par.question_type::text = 'structured'))
  ),
  tot as (
    select (select count(*) from sec)::int as theory_total,
           (select count(*) from pq)::int as practice_total
  ),
  need as (
    select case when tot.practice_total = 0 then 0
                else greatest(1, ceil(tot.practice_total * a.practice_target / 100.0))::int end as needed
      from tot, a
  ),
  ans as (
    select x.student_id, x.question_id, min(x.at) as first_at
      from (
        select pa.student_id, pa.question_id, pa.created_at as at
          from public.practice_attempts pa
         where pa.student_id in (select id from st) and pa.question_id in (select id from pq)
        union all
        select d.student_id, d.question_id, d.updated_at
          from public.practice_drafts d
         where d.student_id in (select id from st) and d.question_id in (select id from pq)
           and d.result is not null and d.answer_data is not null
      ) x
     group by x.student_id, x.question_id
  ),
  ranked as (
    select ans.student_id, ans.first_at,
           row_number() over (partition by ans.student_id order by ans.first_at, ans.question_id) as n
      from ans
  ),
  pr as (
    select r.student_id, count(*)::int as done,
           max(r.first_at) filter (where r.n = (select needed from need)) as reached_at
      from ranked r
     group by r.student_id
  ),
  att as (
    select t.*
      from public.attempts t, a
     where a.exam_id is not null and t.exam_id = a.exam_id
       and t.student_id in (select id from st)
       and (t.assignment_id = a.id or t.started_at >= a.available_from)
  ),
  ex_first as (
    select student_id, min(submitted_at) as submitted_at from att where status <> 'IN_PROGRESS' group by student_id
  ),
  ex_last as (
    select distinct on (student_id) student_id, id, status::text as status, percentage
      from att order by student_id, created_at desc
  )
  select st.id,
         coalesce(th.done, 0), tot.theory_total,
         case when tot.theory_total > 0 and coalesce(th.done, 0) >= tot.theory_total then th.last_at end,
         coalesce(pr.done, 0), tot.practice_total, need.needed,
         pr.reached_at,
         ex_last.id, ex_last.status, ex_first.submitted_at,
         case when public.is_staff() then ex_last.percentage end
    from st
    cross join tot
    cross join need
    left join th on th.student_id = st.id
    left join pr on pr.student_id = st.id
    left join ex_first on ex_first.student_id = st.id
    left join ex_last on ex_last.student_id = st.id
$$;

revoke execute on function public.topic_assignment_progress(uuid) from public, anon;
grant execute on function public.topic_assignment_progress(uuid) to authenticated, service_role;
