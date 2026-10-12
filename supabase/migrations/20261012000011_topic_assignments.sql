-- =====================================================================
-- Topic assignments: a teacher assigns a whole topic to a class.
--
-- The students must (1) read the topic's theory pack, (2) complete its
-- practice set and (3) sit the topic exam in Exam Mode. Each part can have
-- its own deadline; `deadline` is the final one (and the exam's).
--
--   theory_deadline / practice_deadline   null = the final deadline
--   practice_target                       % of the practice set to complete
--
-- Progress is derived, never stored: theory_progress, practice_attempts /
-- practice_drafts and attempts already record everything.
-- =====================================================================

-- Compared as text below: a value added to an enum cannot be used as an
-- enum literal in the transaction that added it.
alter type public.assignment_type add value if not exists 'topic';

alter table public.assignments
  add column if not exists theory_deadline timestamptz,
  add column if not exists practice_deadline timestamptz,
  add column if not exists practice_target smallint not null default 100
    check (practice_target between 1 and 100);

-- A topic assignment has an exam only when the topic has a published one.
do $$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
     where conrelid = 'public.assignments'::regclass and contype = 'c'
       and pg_get_constraintdef(oid) ilike '%exam_id is not null%'
  loop
    execute format('alter table public.assignments drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.assignments
  add constraint assignments_exam_required
  check (assignment_type::text in ('practice', 'revision', 'topic') or exam_id is not null);
alter table public.assignments drop constraint if exists assignments_topic_required;
alter table public.assignments
  add constraint assignments_topic_required
  check (assignment_type::text <> 'topic' or (topic_id is not null and deadline is not null));

-- ---------------------------------------------------------------------
-- Progress of every targeted student through a topic assignment.
-- The teacher who owns it (or an admin) gets all students; a student gets
-- only their own row.
--
-- * theory   — sections of the published theory pack the student has opened
-- * practice — practice questions answered and checked at least once;
--              practice_reached_at is when the target was reached
-- * exam     — attempts at the topic exam started through the assignment or
--              after it opened
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
