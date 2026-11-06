-- =====================================================================
-- Exam Mode of a topic taught with ONE exam (no lesson tests) opens for a
-- student only after they have answered every practice question and handed
-- in notes for every lesson of the topic. Notes waiting for the teacher's
-- check count; notes rejected as typed or copied (UNREADABLE) do not.
-- Topics that still have lesson tests, and teachers, are not affected.
-- =====================================================================
create or replace function public.exam_requirements(p_exam_id uuid, p_student_id uuid default null)
returns table (lesson_no smallint, title text, practice_done int, practice_total int, notes_ok boolean)
language sql
stable
security definer
set search_path = public
as $$
  with me as (
    select coalesce(p_student_id, auth.uid()) as id
     where coalesce(p_student_id, auth.uid()) = auth.uid() or public.is_staff()
  ),
  ex as (
    select e.topic_id
      from public.exams e
     where e.id = p_exam_id and e.kind = 'topic' and e.lesson_no is null
       and exists (select 1 from public.topic_lessons l where l.topic_id = e.topic_id)
       and not exists (select 1 from public.exams x
                        where x.topic_id = e.topic_id and x.lesson_no is not null and x.archived_at is null)
  ),
  pq as (
    select q.id, q.lesson_no
      from public.questions q
      left join public.questions par on par.id = q.parent_id
     where q.topic_id = (select topic_id from ex)
       and q.lesson_no is not null
       and q.status = 'published' and q.practice_enabled and q.archived_at is null
       and q.question_type::text <> 'structured'
       and (q.parent_id is null
            or (par.status = 'published' and par.practice_enabled and par.archived_at is null
                and par.question_type::text = 'structured'))
  )
  select l.number, l.title,
         (select count(distinct pq.id)::int from pq
           where pq.lesson_no = l.number
             and exists (select 1 from public.practice_attempts pa where pa.student_id = (select id from me) and pa.question_id = pq.id)),
         (select count(*)::int from pq where pq.lesson_no = l.number),
         exists (select 1 from public.note_submissions n
                  where n.student_id = (select id from me) and n.topic_id = l.topic_id and n.lesson_no = l.number
                    and n.status in ('PENDING', 'CHECKED'))
    from public.topic_lessons l
   where l.topic_id = (select topic_id from ex) and exists (select 1 from me)
   order by l.number
$$;

revoke execute on function public.exam_requirements(uuid, uuid) from public, anon;
grant execute on function public.exam_requirements(uuid, uuid) to authenticated, service_role;

CREATE OR REPLACE FUNCTION public.start_attempt(p_exam_id uuid, p_assignment_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid := auth.uid();
  v_exam public.exams;
  v_assignment public.assignments;
  v_version public.exam_versions;
  v_existing public.attempts;
  v_used int;
  v_limit int;
  v_duration int;
  v_deadline timestamptz;
  v_window_end timestamptz;
  v_id uuid;
  v_base uuid;
  v_class uuid;
begin
  if v_uid is null or public.current_user_role() is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  select * into v_exam from public.exams where id = p_exam_id;
  if not found then
    raise exception 'EXAM_NOT_FOUND' using errcode = 'P0002';
  end if;

  if p_assignment_id is not null then
    select * into v_assignment from public.assignments where id = p_assignment_id;
    if not found or v_assignment.exam_id is distinct from p_exam_id
       or not public.is_assignment_target(p_assignment_id, v_uid) then
      raise exception 'ASSIGNMENT_NOT_FOUND' using errcode = 'P0002';
    end if;
    if v_assignment.archived_at is not null or now() < v_assignment.available_from then
      raise exception 'ASSIGNMENT_NOT_AVAILABLE' using errcode = 'P0001';
    end if;
    if v_assignment.deadline is not null and now() > v_assignment.deadline then
      raise exception 'ASSIGNMENT_DEADLINE_PASSED' using errcode = 'P0001';
    end if;
    if v_exam.current_version_id is null or v_exam.archived_at is not null then
      raise exception 'EXAM_NOT_AVAILABLE' using errcode = 'P0001';
    end if;
  elsif not public.exam_is_open(v_exam) then
    raise exception 'EXAM_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  -- Resume an open attempt instead of creating a second one.
  select * into v_existing from public.attempts
   where student_id = v_uid and exam_id = p_exam_id and status = 'IN_PROGRESS';
  if found then
    v_existing := public.load_own_attempt(v_existing.id);
    if v_existing.status = 'IN_PROGRESS' then
      return v_existing.id;
    end if;
  end if;

  -- Topics with one Exam Mode: a student opens it only after answering every
  -- practice question and handing in notes for every lesson of the topic.
  if public.current_user_role()::text = 'student' and p_assignment_id is null
     and exists (select 1 from public.exam_requirements(p_exam_id, v_uid) r
                  where r.practice_done < r.practice_total or not r.notes_ok) then
    raise exception 'EXAM_LOCKED' using errcode = 'P0001';
  end if;

  -- Checked after the resume: closing access never locks a student out of
  -- an attempt that is already running.
  if v_exam.kind::text = 'summative' and p_assignment_id is null and not public.is_staff() then
    if not public.summative_is_open(p_exam_id) then
      raise exception 'SUMMATIVE_NOT_OPEN' using errcode = 'P0001';
    end if;
    v_base := coalesce(v_exam.variant_of, v_exam.id);
    if cardinality(public.summative_usable_variants(v_base)) > 1 then
      select a.class_id into v_class
        from public.summative_access a
        join public.class_members m on m.class_id = a.class_id and m.student_id = v_uid and m.status = 'active'
       where a.exam_id = v_base and a.is_open
       order by a.opened_at
       limit 1;
      if public.assign_summative_variant(v_base, v_uid, v_class) is distinct from p_exam_id then
        raise exception 'SUMMATIVE_OTHER_VARIANT' using errcode = 'P0001';
      end if;
    end if;
  end if;

  v_limit := case when p_assignment_id is not null
                  then coalesce(v_assignment.attempt_limit, v_exam.attempt_limit)
                  else v_exam.attempt_limit end;
  if v_limit is not null then
    select count(*) into v_used from public.attempts
     where student_id = v_uid and exam_id = p_exam_id
       and (p_assignment_id is null or assignment_id = p_assignment_id);
    if v_used >= v_limit then
      raise exception 'ATTEMPT_LIMIT_REACHED' using errcode = 'P0001';
    end if;
  end if;

  select * into v_version from public.exam_versions where id = v_exam.current_version_id;

  v_duration := coalesce(v_assignment.duration_override_minutes, v_version.duration_minutes) * 60;
  v_window_end := case when p_assignment_id is not null then v_assignment.deadline else v_exam.availability_end end;
  v_deadline := least(now() + make_interval(secs => v_duration), coalesce(v_window_end, 'infinity'::timestamptz));

  insert into public.attempts (
    student_id, exam_id, exam_version_id, assignment_id, started_at, duration_seconds, deadline_at,
    integrity_mode, max_violations, require_fullscreen, show_results, results_release_at, show_mark_scheme
  ) values (
    v_uid, p_exam_id, v_version.id, p_assignment_id, now(),
    greatest(1, extract(epoch from (v_deadline - now()))::int), v_deadline,
    coalesce(v_assignment.integrity_mode, v_exam.integrity_mode),
    coalesce(v_assignment.max_violations, v_exam.max_violations),
    v_exam.require_fullscreen,
    coalesce(v_assignment.show_results, v_exam.show_results),
    case when p_assignment_id is not null then v_assignment.results_release_at else v_exam.results_release_at end,
    coalesce(v_assignment.show_mark_scheme, v_exam.show_mark_scheme)
  )
  returning id into v_id;

  perform public.bump_activity();
  return v_id;
end;
$function$;
