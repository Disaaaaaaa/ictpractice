-- =====================================================================
-- Access helpers and exam-runtime RPCs.
--
-- Exam integrity rules live here (not in the browser): the deadline is
-- computed from server time, answers are rejected after the deadline,
-- violations are counted server-side and the violation limit is enforced
-- server-side.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Request identity
-- ---------------------------------------------------------------------
-- Role of the current API request: 'authenticated', 'anon' or 'service_role'.
-- Direct database sessions (migrations, seed, SQL editor) count as service.
create or replace function public.request_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    nullif(current_setting('request.jwt.claim.role', true), ''),
    case when session_user in ('postgres', 'supabase_admin') then 'service_role' else 'anon' end
  )
$$;

create or replace function public.is_service()
returns boolean
language sql
stable
as $$
  select public.request_role() = 'service_role'
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('teacher', 'admin'), false)
$$;

create or replace function public.is_staff_profile(p_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = p_profile and role in ('teacher', 'admin'))
$$;

-- True when the caller teaches an active class that the student belongs to.
create or replace function public.teaches_student(p_student uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_members m
    join public.classes c on c.id = m.class_id
    where m.student_id = p_student
      and m.status = 'active'
      and c.teacher_id = auth.uid()
      and c.archived_at is null
  )
$$;

create or replace function public.teaches_class(p_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.classes where id = p_class and teacher_id = auth.uid())
$$;

-- Own data, admin, or the student's teacher.
create or replace function public.can_view_student(p_student uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_student = auth.uid() or public.is_admin() or public.teaches_student(p_student)
$$;

create or replace function public.is_class_member(p_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.class_members
    where class_id = p_class and student_id = auth.uid() and status = 'active'
  )
$$;

create or replace function public.is_assignment_target(p_assignment uuid, p_student uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignment_targets t
    left join public.class_members m
      on m.class_id = t.class_id and m.student_id = p_student and m.status = 'active'
    where t.assignment_id = p_assignment
      and (t.student_id = p_student or m.student_id is not null)
  )
$$;

create or replace function public.owns_assignment(p_assignment uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.assignments where id = p_assignment and teacher_id = auth.uid())
$$;

create or replace function public.get_setting(p_key text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select value from public.system_settings where key = p_key
$$;

create or replace function public.server_now()
returns timestamptz
language sql
stable
as $$
  select now()
$$;

create or replace function public.write_audit(
  p_action text, p_entity_type text, p_entity_id uuid, p_details jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_details, '{}'::jsonb))
$$;

create or replace function public.bump_activity()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set last_activity_at = now()
   where id = auth.uid()
     and (last_activity_at is null or last_activity_at < now() - interval '2 minutes')
$$;

-- ---------------------------------------------------------------------
-- Publishing: freeze an exam into an immutable version snapshot
-- ---------------------------------------------------------------------
create or replace function public.publish_exam(p_exam_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exam public.exams;
  v_version int;
  v_version_id uuid;
  v_paper jsonb;
  v_marking jsonb;
  v_count int;
  v_total int;
  v_unpublished int;
  v_no_scheme int;
begin
  if not (public.is_staff() or public.is_service()) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  select * into v_exam from public.exams where id = p_exam_id for update;
  if not found then
    raise exception 'EXAM_NOT_FOUND' using errcode = 'P0002';
  end if;
  if v_exam.status = 'archived' then
    raise exception 'EXAM_ARCHIVED' using errcode = 'P0001';
  end if;

  select count(*), coalesce(sum(coalesce(eq.marks_override, q.marks)), 0),
         count(*) filter (where q.status <> 'published' or q.archived_at is not null),
         count(*) filter (where ms.id is null)
    into v_count, v_total, v_unpublished, v_no_scheme
    from public.exam_questions eq
    join public.questions q on q.id = eq.question_id
    left join public.mark_schemes ms on ms.question_id = q.id and ms.is_current
   where eq.exam_id = p_exam_id;

  if v_count = 0 then
    raise exception 'EXAM_HAS_NO_QUESTIONS' using errcode = 'P0001';
  end if;
  if v_unpublished > 0 then
    raise exception 'EXAM_HAS_UNPUBLISHED_QUESTIONS: %', v_unpublished using errcode = 'P0001';
  end if;
  if v_no_scheme > 0 then
    raise exception 'EXAM_HAS_QUESTIONS_WITHOUT_MARK_SCHEME: %', v_no_scheme using errcode = 'P0001';
  end if;

  with ordered as (
    select eq.*, row_number() over (order by eq.sort_order, eq.id) as n
      from public.exam_questions eq
     where eq.exam_id = p_exam_id
  )
  select
    jsonb_build_object(
      'exam', jsonb_build_object(
        'id', v_exam.id, 'title', v_exam.title, 'kind', v_exam.kind,
        'instructions', v_exam.instructions, 'year', v_exam.year
      ),
      'questions', jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'number', o.n,
          'title', q.title,
          'question_text', q.question_text,
          'question_type', q.question_type,
          'marks', coalesce(o.marks_override, q.marks),
          'command_word', q.command_word,
          'difficulty', q.difficulty,
          'content', q.content - 'hint',               -- no hints in exam mode
          'section_label', o.section_label,
          'topic_id', q.topic_id,
          'topic_title', t.title,
          'options', (
            select coalesce(jsonb_agg(jsonb_build_object('key', op.key, 'content', op.content)
                                      order by op.sort_order, op.key), '[]'::jsonb)
              from public.question_options op where op.question_id = q.id
          ),
          'objectives', (
            select coalesce(jsonb_agg(jsonb_build_object('id', lo.id, 'code', lo.code)
                                      order by lo.sort_key), '[]'::jsonb)
              from public.question_objectives qo
              join public.learning_objectives lo on lo.id = qo.learning_objective_id
             where qo.question_id = q.id
          )
        ) order by o.n
      )
    ),
    jsonb_object_agg(
      q.id::text,
      jsonb_build_object(
        'question_type', q.question_type,
        'grading_method', q.grading_method,
        'marks', coalesce(o.marks_override, q.marks),
        'question_marks', q.marks,
        'command_word', q.command_word,
        'mark_scheme_version', ms.version,
        'mark_scheme', ms.mark_scheme,
        'marking_points', ms.marking_points,
        'model_answer', ms.model_answer,
        'accepted_answers', ms.accepted_answers,
        'ai_grading_instructions', ms.ai_grading_instructions,
        'explanation', ms.explanation
      )
    )
    into v_paper, v_marking
    from ordered o
    join public.questions q on q.id = o.question_id
    left join public.topics t on t.id = q.topic_id
    join public.mark_schemes ms on ms.question_id = q.id and ms.is_current;

  select coalesce(max(version), 0) + 1 into v_version
    from public.exam_versions where exam_id = p_exam_id;

  insert into public.exam_versions (exam_id, version, question_count, total_marks, duration_minutes, published_by)
  values (p_exam_id, v_version, v_count, v_total, v_exam.duration_minutes, auth.uid())
  returning id into v_version_id;

  insert into public.exam_version_payloads (exam_version_id, paper, marking)
  values (v_version_id, v_paper, v_marking);

  update public.exams
     set current_version_id = v_version_id,
         status = case
                    when status in ('draft', 'closed')
                      then case when availability_start is not null and availability_start > now()
                                then 'scheduled'::public.exam_status
                                else 'published'::public.exam_status end
                    else status
                  end
   where id = p_exam_id;

  perform public.write_audit('exam.publish', 'exam', p_exam_id,
    jsonb_build_object('version', v_version, 'version_id', v_version_id,
                       'questions', v_count, 'total_marks', v_total));

  return v_version_id;
end;
$$;

-- True if a student may self-start (or start via assignment) the exam right now.
create or replace function public.exam_is_open(p_exam public.exams)
returns boolean
language sql
stable
as $$
  select p_exam.archived_at is null
     and p_exam.current_version_id is not null
     and (p_exam.status = 'published'
          or (p_exam.status = 'scheduled' and p_exam.availability_start <= now()))
     and (p_exam.availability_start is null or p_exam.availability_start <= now())
     and (p_exam.availability_end is null or p_exam.availability_end > now())
$$;

-- ---------------------------------------------------------------------
-- Attempt lifecycle
-- ---------------------------------------------------------------------
-- Internal: freeze answers and close the attempt. Never granted to clients.
create or replace function public.finalize_attempt(p_attempt_id uuid, p_reason public.submission_reason)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id for update;
  if not found or v_attempt.status <> 'IN_PROGRESS' then
    return false;
  end if;

  update public.answers
     set submitted_answer = answer_data,
         submitted_at = now()
   where attempt_id = p_attempt_id
     and submitted_at is null;

  update public.attempts
     set status = 'SUBMITTED',
         submitted_at = case when p_reason = 'TIME_EXPIRED' then least(now(), deadline_at) else now() end,
         submission_reason = p_reason,
         grading_status = 'PENDING',
         active_session_id = null
   where id = p_attempt_id;

  return true;
end;
$$;

create or replace function public.grace_seconds()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((public.get_setting('exam_defaults') ->> 'save_grace_seconds')::int, 30)
$$;

-- Closes every open attempt whose deadline (plus save grace) has passed.
create or replace function public.expire_overdue_attempts()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_n int := 0;
begin
  if not (public.is_staff() or public.is_service()) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  for v_id in
    select id from public.attempts
     where status = 'IN_PROGRESS'
       and now() > deadline_at + make_interval(secs => public.grace_seconds())
  loop
    if public.finalize_attempt(v_id, 'TIME_EXPIRED') then
      v_n := v_n + 1;
    end if;
  end loop;
  return v_n;
end;
$$;

-- Loads an attempt owned by the caller, expiring it lazily if overdue.
create or replace function public.load_own_attempt(p_attempt_id uuid)
returns public.attempts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
  if not found or v_attempt.student_id is distinct from auth.uid() then
    raise exception 'ATTEMPT_NOT_FOUND' using errcode = 'P0002';
  end if;
  if v_attempt.status = 'IN_PROGRESS'
     and now() > v_attempt.deadline_at + make_interval(secs => public.grace_seconds()) then
    perform public.finalize_attempt(p_attempt_id, 'TIME_EXPIRED');
    select * into v_attempt from public.attempts where id = p_attempt_id;
  end if;
  return v_attempt;
end;
$$;

create or replace function public.start_attempt(p_exam_id uuid, p_assignment_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
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
$$;

-- Everything the exam runner needs. The paper never contains answers.
create or replace function public.get_attempt_paper(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_exam public.exams;
  v_paper jsonb;
begin
  v_attempt := public.load_own_attempt(p_attempt_id);
  select * into v_exam from public.exams where id = v_attempt.exam_id;
  select paper into v_paper from public.exam_version_payloads where exam_version_id = v_attempt.exam_version_id;

  return jsonb_build_object(
    'server_now', now(),
    'attempt', jsonb_build_object(
      'id', v_attempt.id,
      'exam_id', v_attempt.exam_id,
      'assignment_id', v_attempt.assignment_id,
      'status', v_attempt.status,
      'started_at', v_attempt.started_at,
      'deadline_at', v_attempt.deadline_at,
      'duration_seconds', v_attempt.duration_seconds,
      'submitted_at', v_attempt.submitted_at,
      'submission_reason', v_attempt.submission_reason,
      'violation_count', v_attempt.violation_count,
      'integrity_mode', v_attempt.integrity_mode,
      'max_violations', v_attempt.max_violations,
      'require_fullscreen', v_attempt.require_fullscreen,
      'current_question', v_attempt.current_question
    ),
    'exam', jsonb_build_object('id', v_exam.id, 'title', v_exam.title, 'kind', v_exam.kind),
    'paper', v_paper,
    'answers', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'question_id', a.question_id,
               'answer', coalesce(a.submitted_answer, a.answer_data),
               'flagged', a.flagged,
               'saved_at', a.saved_at,
               'time_spent_seconds', a.time_spent_seconds)), '[]'::jsonb)
        from public.answers a where a.attempt_id = p_attempt_id
    )
  );
end;
$$;

-- Called once when a runner window opens. The newest window takes over; if a
-- different window was alive moments ago, that is recorded as a possible
-- second device/session.
create or replace function public.claim_attempt_session(
  p_attempt_id uuid, p_session_id text, p_is_reload boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_stale int := coalesce((public.get_setting('exam_defaults') ->> 'session_stale_seconds')::int, 45);
  v_conflict boolean := false;
  v_result jsonb := '{}'::jsonb;
begin
  if p_session_id is null or length(p_session_id) not between 8 and 100 then
    raise exception 'INVALID_SESSION' using errcode = '22023';
  end if;
  v_attempt := public.load_own_attempt(p_attempt_id);
  if v_attempt.status <> 'IN_PROGRESS' then
    return jsonb_build_object('status', v_attempt.status);
  end if;

  perform 1 from public.attempts where id = p_attempt_id for update;

  if v_attempt.active_session_id is not null
     and v_attempt.active_session_id <> p_session_id
     and v_attempt.last_heartbeat_at > now() - make_interval(secs => v_stale) then
    v_conflict := true;
  end if;

  update public.attempts
     set active_session_id = p_session_id, last_heartbeat_at = now(), is_online = true
   where id = p_attempt_id;

  if v_conflict then
    v_result := public.record_integrity_event(
      p_attempt_id, 'MULTIPLE_SESSION_DETECTED', now(), now(),
      jsonb_build_object('previous_session', left(v_attempt.active_session_id, 12),
                         'new_session', left(p_session_id, 12),
                         'user_agent', left(coalesce(nullif(current_setting('request.headers', true), '')::jsonb ->> 'user-agent', ''), 300)));
  elsif p_is_reload and v_attempt.active_session_id = p_session_id then
    v_result := public.record_integrity_event(p_attempt_id, 'PAGE_RELOAD', now(), now(), '{}'::jsonb);
  end if;

  select * into v_attempt from public.attempts where id = p_attempt_id;
  return jsonb_build_object(
    'status', v_attempt.status,
    'violation_count', v_attempt.violation_count,
    'multiple_session_detected', v_conflict,
    'auto_submitted', coalesce((v_result ->> 'auto_submitted')::boolean, false)
  );
end;
$$;

create or replace function public.attempt_heartbeat(
  p_attempt_id uuid, p_session_id text, p_current_question int, p_online boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_superseded boolean := false;
begin
  v_attempt := public.load_own_attempt(p_attempt_id);
  if v_attempt.status = 'IN_PROGRESS' then
    if v_attempt.active_session_id is distinct from p_session_id then
      v_superseded := true;
    else
      update public.attempts
         set last_heartbeat_at = now(),
             current_question = greatest(1, coalesce(p_current_question, current_question)),
             is_online = coalesce(p_online, true)
       where id = p_attempt_id;
      perform public.bump_activity();
    end if;
  end if;
  return jsonb_build_object(
    'status', v_attempt.status,
    'server_now', now(),
    'deadline_at', v_attempt.deadline_at,
    'violation_count', v_attempt.violation_count,
    'superseded', v_superseded
  );
end;
$$;

create or replace function public.answer_is_blank(p jsonb)
returns boolean
language sql
immutable
as $$
  select p is null
      or jsonb_typeof(p) = 'null'
      or p = '{}'::jsonb
      or (jsonb_typeof(p) = 'object' and not exists (
            select 1 from jsonb_each(p) e
             where not (jsonb_typeof(e.value) = 'null'
                        or e.value = '""'::jsonb
                        or e.value = '[]'::jsonb
                        or e.value = '{}'::jsonb)))
$$;

-- Shared core for single and bulk saves.
create or replace function public.save_answer_core(
  p_attempt public.attempts, p_question_id uuid, p_answer jsonb, p_flagged boolean, p_time_delta int
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
begin
  if not exists (
    select 1
      from public.exam_version_payloads p,
           jsonb_array_elements(p.paper -> 'questions') q
     where p.exam_version_id = p_attempt.exam_version_id
       and q ->> 'id' = p_question_id::text
  ) then
    raise exception 'QUESTION_NOT_IN_EXAM' using errcode = 'P0002';
  end if;
  if p_answer is not null and pg_column_size(p_answer) > 65536 then
    raise exception 'ANSWER_TOO_LARGE' using errcode = '22001';
  end if;

  insert into public.answers (attempt_id, question_id, answer_data, flagged, time_spent_seconds, saved_at)
  values (p_attempt.id, p_question_id, p_answer, coalesce(p_flagged, false),
          least(greatest(coalesce(p_time_delta, 0), 0), 300), v_now)
  on conflict (attempt_id, question_id) do update
     set answer_data = excluded.answer_data,
         flagged = coalesce(p_flagged, public.answers.flagged),
         time_spent_seconds = public.answers.time_spent_seconds + excluded.time_spent_seconds,
         saved_at = v_now;

  return v_now;
end;
$$;

create or replace function public.assert_writable_attempt(p_attempt_id uuid, p_session_id text)
returns public.attempts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
begin
  -- May finalize an overdue attempt, so callers must not raise afterwards
  -- (that would roll the finalisation back); they report closure as data.
  v_attempt := public.load_own_attempt(p_attempt_id);
  if v_attempt.status = 'IN_PROGRESS'
     and v_attempt.active_session_id is not null
     and v_attempt.active_session_id is distinct from p_session_id then
    raise exception 'SESSION_SUPERSEDED' using errcode = 'P0001';
  end if;
  return v_attempt;
end;
$$;

create or replace function public.refresh_answered_count(p_attempt_id uuid)
returns int
language sql
security definer
set search_path = public
as $$
  update public.attempts a
     set answered_count = (select count(*) from public.answers x
                            where x.attempt_id = a.id and not public.answer_is_blank(x.answer_data))
   where a.id = p_attempt_id
  returning answered_count
$$;

create or replace function public.save_answer(
  p_attempt_id uuid, p_question_id uuid, p_answer jsonb, p_session_id text,
  p_flagged boolean default null, p_time_delta int default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_saved timestamptz;
  v_count int;
begin
  v_attempt := public.assert_writable_attempt(p_attempt_id, p_session_id);
  if v_attempt.status <> 'IN_PROGRESS' then
    return jsonb_build_object('error', 'ATTEMPT_CLOSED', 'status', v_attempt.status);
  end if;
  v_saved := public.save_answer_core(v_attempt, p_question_id, p_answer, p_flagged, p_time_delta);
  v_count := public.refresh_answered_count(p_attempt_id);
  return jsonb_build_object('saved_at', v_saved, 'answered_count', v_count, 'server_now', now());
end;
$$;

-- Offline sync: p_items = [{"question_id": "...", "answer": {...}, "flagged": false, "time_delta": 12}, ...]
create or replace function public.save_answers_bulk(p_attempt_id uuid, p_session_id text, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_item jsonb;
  v_count int;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 200 then
    raise exception 'INVALID_ITEMS' using errcode = '22023';
  end if;
  v_attempt := public.assert_writable_attempt(p_attempt_id, p_session_id);
  if v_attempt.status <> 'IN_PROGRESS' then
    return jsonb_build_object('error', 'ATTEMPT_CLOSED', 'status', v_attempt.status);
  end if;
  for v_item in select * from jsonb_array_elements(p_items) loop
    perform public.save_answer_core(
      v_attempt,
      (v_item ->> 'question_id')::uuid,
      case when jsonb_typeof(v_item -> 'answer') = 'null' then null else v_item -> 'answer' end,
      (v_item ->> 'flagged')::boolean,
      coalesce((v_item ->> 'time_delta')::int, 0)
    );
  end loop;
  v_count := public.refresh_answered_count(p_attempt_id);
  return jsonb_build_object('saved_at', now(), 'answered_count', v_count, 'server_now', now());
end;
$$;

create or replace function public.integrity_event_counts(p_type public.integrity_event_type, p_require_fullscreen boolean)
returns boolean
language sql
immutable
as $$
  select p_type in ('TAB_HIDDEN', 'WINDOW_BLUR', 'MULTIPLE_SESSION_DETECTED')
      or (p_type = 'FULLSCREEN_EXIT' and p_require_fullscreen)
$$;

-- Internal: insert an event, count it and apply the auto-submit policy.
create or replace function public.record_integrity_event(
  p_attempt_id uuid, p_event_type public.integrity_event_type,
  p_started_at timestamptz, p_ended_at timestamptz, p_metadata jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_counted boolean;
  v_started timestamptz;
  v_ended timestamptz;
  v_event_id uuid;
  v_auto boolean := false;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id for update;
  if v_attempt.status <> 'IN_PROGRESS' then
    return jsonb_build_object('ignored', true, 'status', v_attempt.status);
  end if;
  if (select count(*) from public.integrity_events where attempt_id = p_attempt_id) >= 500 then
    return jsonb_build_object('ignored', true, 'reason', 'event_limit');
  end if;

  -- Client clocks are untrusted: clamp to [attempt start, now].
  v_started := least(greatest(coalesce(p_started_at, now()), v_attempt.started_at), now());
  v_ended := case when p_ended_at is null then null
                  else least(greatest(p_ended_at, v_started), now()) end;
  v_counted := public.integrity_event_counts(p_event_type, v_attempt.require_fullscreen);

  insert into public.integrity_events (
    attempt_id, exam_id, student_id, event_type, started_at, ended_at, duration_seconds, counted, metadata
  ) values (
    p_attempt_id, v_attempt.exam_id, v_attempt.student_id, p_event_type, v_started, v_ended,
    case when v_ended is null then null else extract(epoch from (v_ended - v_started))::int end,
    v_counted,
    case when p_metadata is null or pg_column_size(p_metadata) > 4096 then '{}'::jsonb else p_metadata end
  )
  returning id into v_event_id;

  if v_counted then
    update public.attempts set violation_count = violation_count + 1
     where id = p_attempt_id
    returning * into v_attempt;
    if v_attempt.integrity_mode = 'auto_submit' and v_attempt.violation_count >= v_attempt.max_violations then
      v_auto := public.finalize_attempt(p_attempt_id, 'VIOLATION_LIMIT');
    end if;
  end if;

  return jsonb_build_object(
    'event_id', v_event_id,
    'counted', v_counted,
    'violation_count', v_attempt.violation_count,
    'integrity_mode', v_attempt.integrity_mode,
    'max_violations', v_attempt.max_violations,
    'auto_submitted', v_auto
  );
end;
$$;

create or replace function public.log_integrity_event(
  p_attempt_id uuid, p_session_id text, p_event_type public.integrity_event_type,
  p_started_at timestamptz default null, p_ended_at timestamptz default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
begin
  v_attempt := public.load_own_attempt(p_attempt_id);
  if v_attempt.status <> 'IN_PROGRESS' then
    return jsonb_build_object('ignored', true, 'status', v_attempt.status);
  end if;
  -- Server-detected only; the browser cannot report these itself.
  if p_event_type = 'MULTIPLE_SESSION_DETECTED' then
    raise exception 'INVALID_EVENT' using errcode = '22023';
  end if;
  if v_attempt.active_session_id is distinct from p_session_id then
    return jsonb_build_object('ignored', true, 'reason', 'superseded');
  end if;
  return public.record_integrity_event(
    p_attempt_id, p_event_type, p_started_at, p_ended_at,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('session', left(p_session_id, 12))
  );
end;
$$;

-- Closes an open event (e.g. TAB_HIDDEN when the student returns).
create or replace function public.close_integrity_event(p_event_id uuid, p_ended_at timestamptz default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.integrity_events e
     set ended_at = least(greatest(coalesce(p_ended_at, now()), e.started_at), now()),
         duration_seconds = extract(epoch from (least(greatest(coalesce(p_ended_at, now()), e.started_at), now()) - e.started_at))::int
   where e.id = p_event_id
     and e.student_id = auth.uid()
     and e.ended_at is null;
end;
$$;

create or replace function public.submit_attempt(p_attempt_id uuid, p_session_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
begin
  v_attempt := public.load_own_attempt(p_attempt_id);
  if v_attempt.status <> 'IN_PROGRESS' then
    return jsonb_build_object('status', v_attempt.status, 'already_submitted', true);
  end if;
  if v_attempt.active_session_id is not null and v_attempt.active_session_id is distinct from p_session_id then
    raise exception 'SESSION_SUPERSEDED' using errcode = 'P0001';
  end if;
  perform public.finalize_attempt(
    p_attempt_id,
    case when now() >= v_attempt.deadline_at then 'TIME_EXPIRED' else 'MANUAL_SUBMIT' end::public.submission_reason
  );
  select * into v_attempt from public.attempts where id = p_attempt_id;
  return jsonb_build_object('status', v_attempt.status, 'submission_reason', v_attempt.submission_reason,
                            'submitted_at', v_attempt.submitted_at);
end;
$$;

create or replace function public.teacher_force_submit(p_attempt_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_done boolean;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
  if not found or not (public.is_admin() or (public.is_staff() and public.teaches_student(v_attempt.student_id))) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  v_done := public.finalize_attempt(p_attempt_id, 'TEACHER_FORCED');
  if v_done then
    perform public.write_audit('attempt.force_submit', 'attempt', p_attempt_id,
      jsonb_build_object('student_id', v_attempt.student_id));
  end if;
  return v_done;
end;
$$;

-- ---------------------------------------------------------------------
-- Scores, mastery, moderation
-- ---------------------------------------------------------------------
create or replace function public.recompute_mastery(p_student_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cfg jsonb := coalesce(public.get_setting('mastery'), '{}'::jsonb);
  v_pw numeric := coalesce((v_cfg ->> 'practice_weight')::numeric, 0.3);
  v_ew numeric := coalesce((v_cfg ->> 'exam_weight')::numeric, 0.7);
  v_n int := coalesce((v_cfg ->> 'recent_attempts')::int, 10);
  v_decay numeric := coalesce((v_cfg ->> 'recency_decay')::numeric, 0.85);
  v_dw jsonb := coalesce(v_cfg -> 'difficulty_weights', '{}'::jsonb);
begin
  with practice as (
    select qo.learning_objective_id as lo,
           pa.awarded_mark / pa.max_mark as ratio,
           coalesce((v_dw ->> q.difficulty::text)::numeric, 1) as w,
           row_number() over (partition by qo.learning_objective_id order by pa.created_at desc) as rn
      from public.practice_attempts pa
      join public.questions q on q.id = pa.question_id
      join public.question_objectives qo on qo.question_id = pa.question_id
     where pa.student_id = p_student_id and pa.max_mark > 0
  ),
  exam as (
    select (obj ->> 'id')::uuid as lo,
           gr.final_mark / gr.max_mark as ratio,
           coalesce((v_dw ->> (pq ->> 'difficulty'))::numeric, 1) as w,
           row_number() over (partition by (obj ->> 'id') order by a.submitted_at desc) as rn
      from public.grading_results gr
      join public.attempts a on a.id = gr.attempt_id
      join public.exam_version_payloads p on p.exam_version_id = a.exam_version_id
      cross join lateral jsonb_array_elements(p.paper -> 'questions') pq
      cross join lateral jsonb_array_elements(pq -> 'objectives') obj
     where a.student_id = p_student_id
       and pq ->> 'id' = gr.question_id::text
       and gr.final_mark is not null and gr.max_mark > 0
       and a.status in ('GRADED', 'REVIEW_REQUIRED')
  ),
  p_agg as (
    select lo, count(*) as cnt,
           sum(ratio * w * power(v_decay, rn - 1)) / nullif(sum(w * power(v_decay, rn - 1)), 0) as score
      from practice where rn <= v_n group by lo
  ),
  e_agg as (
    select lo, count(*) as cnt,
           sum(ratio * w * power(v_decay, rn - 1)) / nullif(sum(w * power(v_decay, rn - 1)), 0) as score
      from exam where rn <= v_n group by lo
  ),
  combined as (
    select coalesce(p.lo, e.lo) as lo,
           p.score as ps, e.score as es,
           coalesce(p.cnt, 0) as pc, coalesce(e.cnt, 0) as ec
      from p_agg p full join e_agg e on e.lo = p.lo
  )
  insert into public.student_mastery as sm
    (student_id, learning_objective_id, practice_score, exam_score, mastery, practice_count, exam_count, updated_at)
  select p_student_id, c.lo,
         round(c.ps * 100, 2), round(c.es * 100, 2),
         round(100 * case
                 when c.ps is not null and c.es is not null then (v_pw * c.ps + v_ew * c.es) / nullif(v_pw + v_ew, 0)
                 else coalesce(c.es, c.ps, 0)
               end, 2),
         c.pc, c.ec, now()
    from combined c
    join public.learning_objectives lo on lo.id = c.lo
  on conflict (student_id, learning_objective_id) do update
     set practice_score = excluded.practice_score,
         exam_score = excluded.exam_score,
         mastery = excluded.mastery,
         practice_count = excluded.practice_count,
         exam_count = excluded.exam_count,
         updated_at = now();
end;
$$;

create or replace function public.recompute_attempt_score(p_attempt_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_total numeric;
  v_max numeric;
  v_unfinished int;
  v_failed int;
  v_review int;
  v_status public.attempt_status;
  v_grading public.grading_status;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id for update;
  if not found or v_attempt.status = 'IN_PROGRESS' then
    return;
  end if;

  select coalesce(sum(final_mark), 0),
         count(*) filter (where status in ('PENDING', 'IN_PROGRESS')),
         count(*) filter (where status = 'FAILED'),
         count(*) filter (where needs_review)
    into v_total, v_unfinished, v_failed, v_review
    from public.grading_results where attempt_id = p_attempt_id;

  select total_marks into v_max from public.exam_versions where id = v_attempt.exam_version_id;

  v_grading := case when v_failed > 0 then 'FAILED'
                    when v_unfinished > 0 then 'PENDING'
                    else 'COMPLETE' end;
  v_status := case when v_grading <> 'COMPLETE' then 'SUBMITTED'
                   when v_review > 0 then 'REVIEW_REQUIRED'
                   else 'GRADED' end;

  update public.attempts
     set score = v_total,
         max_score = v_max,
         percentage = case when v_max > 0 then round(100 * v_total / v_max, 2) else null end,
         status = v_status,
         grading_status = v_grading
   where id = p_attempt_id;

  if v_status = 'GRADED' and v_attempt.status <> 'GRADED' and v_attempt.show_results then
    insert into public.notifications (user_id, type, title, body, link)
    select v_attempt.student_id, 'result', 'Result available: ' || e.title,
           'Your exam has been marked.', '/results/' || p_attempt_id
      from public.exams e where e.id = v_attempt.exam_id;
  end if;
end;
$$;

create or replace function public.teacher_review_mark(
  p_result_id uuid, p_action text, p_mark numeric default null,
  p_feedback text default null, p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result public.grading_results;
  v_attempt public.attempts;
  v_previous numeric;
begin
  select * into v_result from public.grading_results where id = p_result_id for update;
  if not found then
    raise exception 'RESULT_NOT_FOUND' using errcode = 'P0002';
  end if;
  select * into v_attempt from public.attempts where id = v_result.attempt_id;
  if not (public.is_admin() or (public.is_staff() and public.teaches_student(v_attempt.student_id))) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  v_previous := v_result.final_mark;

  if p_action = 'accept' then
    if v_result.awarded_mark is null then
      raise exception 'NO_MARK_TO_ACCEPT' using errcode = 'P0001';
    end if;
    update public.grading_results
       set needs_review = false, reviewed_at = now(), teacher_id = auth.uid(),
           teacher_feedback = coalesce(nullif(p_feedback, ''), teacher_feedback)
     where id = p_result_id;
  elsif p_action = 'override' then
    if p_mark is null or p_mark < 0 or p_mark > v_result.max_mark then
      raise exception 'INVALID_MARK' using errcode = '22023';
    end if;
    if nullif(trim(coalesce(p_reason, '')), '') is null then
      raise exception 'REASON_REQUIRED' using errcode = '22023';
    end if;
    update public.grading_results
       set teacher_override_mark = p_mark, needs_review = false, reviewed_at = now(),
           teacher_id = auth.uid(), status = 'COMPLETE',
           teacher_feedback = coalesce(nullif(p_feedback, ''), teacher_feedback)
     where id = p_result_id;
  elsif p_action = 'feedback' then
    update public.grading_results
       set teacher_feedback = p_feedback, teacher_id = auth.uid()
     where id = p_result_id;
  elsif p_action = 'regrade_request' then
    update public.grading_results
       set status = 'PENDING', needs_review = false, teacher_override_mark = null,
           retries = 0, error = null
     where id = p_result_id;
    update public.attempts set grading_status = 'PENDING' where id = v_result.attempt_id;
  else
    raise exception 'INVALID_ACTION' using errcode = '22023';
  end if;

  select * into v_result from public.grading_results where id = p_result_id;

  insert into public.grade_audit (grading_result_id, action, original_ai_mark, previous_mark, final_mark, reason, changed_by)
  values (p_result_id, p_action, v_result.original_ai_mark, v_previous, v_result.final_mark, p_reason, auth.uid());

  perform public.write_audit('grade.' || p_action, 'grading_result', p_result_id,
    jsonb_build_object('attempt_id', v_result.attempt_id, 'previous_mark', v_previous,
                       'final_mark', v_result.final_mark, 'original_ai_mark', v_result.original_ai_mark,
                       'reason', p_reason));

  perform public.recompute_attempt_score(v_result.attempt_id);
  perform public.recompute_mastery(v_attempt.student_id);

  if p_action in ('override', 'feedback') and nullif(p_feedback, '') is not null then
    insert into public.notifications (user_id, type, title, body, link)
    values (v_attempt.student_id, 'feedback', 'New teacher feedback', left(p_feedback, 200),
            '/results/' || v_attempt.id);
  end if;

  return jsonb_build_object('final_mark', v_result.final_mark, 'needs_review', v_result.needs_review,
                            'status', v_result.status);
end;
$$;

-- ---------------------------------------------------------------------
-- Student-facing result access
-- ---------------------------------------------------------------------
create or replace function public.attempt_results_visible(p_attempt_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.attempts a
     where a.id = p_attempt_id
       and a.status = 'GRADED'
       and a.show_results
       and (a.results_release_at is null or a.results_release_at <= now())
  )
$$;

-- Marking details for the result page, only when the teacher allowed it.
create or replace function public.get_attempt_review(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_payload public.exam_version_payloads;
  v_staff boolean;
  v_visible boolean;
  v_scheme boolean;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
  if not found or not public.can_view_student(v_attempt.student_id) then
    raise exception 'ATTEMPT_NOT_FOUND' using errcode = 'P0002';
  end if;
  v_staff := v_attempt.student_id is distinct from auth.uid();
  v_visible := v_staff or public.attempt_results_visible(p_attempt_id);
  v_scheme := v_staff or (v_visible and v_attempt.show_mark_scheme);

  select * into v_payload from public.exam_version_payloads where exam_version_id = v_attempt.exam_version_id;

  return jsonb_build_object(
    'results_visible', v_visible,
    'mark_scheme_visible', v_scheme,
    'paper', v_payload.paper,
    'marking', case when v_scheme then v_payload.marking else null end
  );
end;
$$;

create or replace function public.mark_theory_viewed(p_section_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.theory_progress (student_id, theory_section_id)
  select auth.uid(), p_section_id
   where auth.uid() is not null
     and exists (select 1 from public.theory_sections where id = p_section_id)
  on conflict do nothing;
  select public.bump_activity();
$$;

-- ---------------------------------------------------------------------
-- Privileges: internal functions are never callable from the browser.
-- ---------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon;

revoke execute on function public.finalize_attempt(uuid, public.submission_reason) from authenticated;
revoke execute on function public.record_integrity_event(uuid, public.integrity_event_type, timestamptz, timestamptz, jsonb) from authenticated;
revoke execute on function public.save_answer_core(public.attempts, uuid, jsonb, boolean, int) from authenticated;
revoke execute on function public.assert_writable_attempt(uuid, text) from authenticated;
revoke execute on function public.refresh_answered_count(uuid) from authenticated;
revoke execute on function public.load_own_attempt(uuid) from authenticated;
revoke execute on function public.recompute_mastery(uuid) from authenticated;
revoke execute on function public.recompute_attempt_score(uuid) from authenticated;
revoke execute on function public.write_audit(text, text, uuid, jsonb) from authenticated;
revoke execute on function public.touch_updated_at() from authenticated;

grant execute on function
  public.request_role(), public.is_service(), public.current_user_role(), public.is_admin(),
  public.is_staff(), public.is_staff_profile(uuid), public.teaches_student(uuid), public.teaches_class(uuid),
  public.can_view_student(uuid), public.is_class_member(uuid), public.is_assignment_target(uuid, uuid),
  public.owns_assignment(uuid), public.get_setting(text), public.server_now(), public.bump_activity(),
  public.publish_exam(uuid), public.exam_is_open(public.exams), public.grace_seconds(),
  public.expire_overdue_attempts(), public.start_attempt(uuid, uuid), public.get_attempt_paper(uuid),
  public.claim_attempt_session(uuid, text, boolean), public.attempt_heartbeat(uuid, text, int, boolean),
  public.answer_is_blank(jsonb), public.save_answer(uuid, uuid, jsonb, text, boolean, int),
  public.save_answers_bulk(uuid, text, jsonb), public.integrity_event_counts(public.integrity_event_type, boolean),
  public.log_integrity_event(uuid, text, public.integrity_event_type, timestamptz, timestamptz, jsonb),
  public.close_integrity_event(uuid, timestamptz), public.submit_attempt(uuid, text),
  public.teacher_force_submit(uuid),
  public.teacher_review_mark(uuid, text, numeric, text, text),
  public.attempt_results_visible(uuid), public.get_attempt_review(uuid), public.mark_theory_viewed(uuid)
to authenticated;

grant execute on all functions in schema public to service_role;
