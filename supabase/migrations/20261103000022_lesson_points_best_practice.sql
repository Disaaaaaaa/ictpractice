-- =====================================================================
-- Lesson points: practice now counts the BEST attempt at each question
-- made before the deadline (it was the first attempt). The practice page
-- no longer shows the right option after a wrong answer, so trying again
-- means working the answer out. Notes (best check) and the lesson test
-- (first attempt) are unchanged.
-- =====================================================================
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
  -- the best mark of each lesson question among the attempts made before the deadline
  best as (
    select sl.student_id, sl.topic_id, sl.number, pa.question_id, max(pa.awarded_mark) as best
      from sl
      join pq on pq.topic_id = sl.topic_id and pq.lesson_no = sl.number
      join public.practice_attempts pa on pa.student_id = sl.student_id and pa.question_id = pq.id
     where sl.deadline is null or pa.created_at <= sl.deadline
     group by 1, 2, 3, 4
  ),
  pr as (
    select b.student_id, b.topic_id, b.number, sum(b.best)::numeric as awarded
      from best b
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
