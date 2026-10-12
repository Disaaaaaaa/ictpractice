-- =====================================================================
-- Practice monitor: optional topic filter.
--
-- With p_topic_id the monitor answers "how far is everyone in THIS topic":
-- each student's last practice question in that topic and the share of
-- its practice set they have completed. Without it the behaviour is
-- unchanged (the question each student touched most recently, any topic).
-- =====================================================================

drop function if exists public.practice_monitor(uuid);

create or replace function public.practice_monitor(p_class_id uuid default null, p_topic_id uuid default null)
returns table (
  student_id uuid,
  question_id uuid,
  state text,                 -- 'typing' | 'submitted' (awaiting review) | 'checked'
  last_at timestamptz,
  awarded_mark numeric,
  max_mark numeric,
  question_title text,
  part_label text,
  group_title text,
  question_type text,
  topic_id uuid,
  topic_slug text,
  topic_title text,
  question_no int,
  total int,
  done int
)
language sql
stable
security definer
set search_path = public
as $$
  with st as (
    select p.id
      from public.profiles p
     where p.role = 'student'
       and public.is_staff()
       and public.can_view_student(p.id)
       and (p_class_id is null or exists (
             select 1 from public.class_members m
              where m.class_id = p_class_id and m.student_id = p.id and m.status = 'active'))
  ),
  touch as (
    select a.student_id, a.question_id, a.created_at as at, 'checked'::text as state, a.awarded_mark, a.max_mark
      from public.practice_attempts a
     where a.student_id in (select id from st)
    union all
    select d.student_id, d.question_id, d.updated_at,
           case when d.result is not null then 'submitted' else 'typing' end, null, null
      from public.practice_drafts d
     where d.student_id in (select id from st) and d.answer_data is not null
  ),
  last as (
    select distinct on (t.student_id) t.*, q.topic_id
      from touch t
      join public.questions q on q.id = t.question_id
     where p_topic_id is null or q.topic_id = p_topic_id
     order by t.student_id, t.at desc
  ),
  -- The practice set of each topic in play, numbered as on the Practice page.
  pq as (
    select q.id, q.topic_id,
           row_number() over (
             partition by q.topic_id
             order by array_position(array['easy', 'medium', 'hard', 'exam'], coalesce(par.difficulty, q.difficulty)::text),
                      coalesce(par.created_at, q.created_at), q.part_order, q.id
           )::int as question_no,
           count(*) over (partition by q.topic_id)::int as total
      from public.questions q
      left join public.questions par on par.id = q.parent_id
     where q.status = 'published' and q.practice_enabled and q.archived_at is null
       and q.question_type::text <> 'structured'
       and (q.parent_id is null
            or (par.status = 'published' and par.practice_enabled and par.archived_at is null
                and par.question_type::text = 'structured'))
       and q.topic_id in (select l.topic_id from last l)
  ),
  answered as (
    select a.student_id, a.question_id from public.practice_attempts a where a.student_id in (select id from st)
    union
    select d.student_id, d.question_id from public.practice_drafts d
     where d.student_id in (select id from st) and d.result is not null and d.answer_data is not null
  ),
  done as (
    select l.student_id, count(distinct x.question_id)::int as done
      from last l
      join pq on pq.topic_id = l.topic_id
      join answered x on x.student_id = l.student_id and x.question_id = pq.id
     group by l.student_id
  )
  select l.student_id, l.question_id, l.state, l.at, l.awarded_mark, l.max_mark,
         q.title, q.part_label, par.title, q.question_type::text,
         t.id, t.slug, t.title,
         pq.question_no,
         coalesce(pq.total, (select max(p2.total) from pq p2 where p2.topic_id = l.topic_id), 0),
         coalesce(d.done, 0)
    from last l
    join public.questions q on q.id = l.question_id
    left join public.questions par on par.id = q.parent_id
    left join public.topics t on t.id = l.topic_id
    left join pq on pq.id = l.question_id
    left join done d on d.student_id = l.student_id
$$;

revoke execute on function public.practice_monitor(uuid, uuid) from public, anon;
grant execute on function public.practice_monitor(uuid, uuid) to authenticated, service_role;
