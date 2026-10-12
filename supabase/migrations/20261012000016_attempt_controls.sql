-- =====================================================================
-- Teacher controls for one student's exam: extra time and reopening
--
--  * teacher_extend_attempt  — adds minutes to a running attempt (e.g. after
--    a laptop problem). The student's timer follows within one heartbeat.
--  * teacher_reopen_attempt  — returns a submitted attempt to "in progress"
--    with a new time limit: for work that was auto-submitted (violations,
--    time) or handed in by mistake. The student's answers are kept and
--    become editable again; the marks of that attempt are discarded and it
--    is marked afresh when it is submitted again.
-- =====================================================================

alter table public.attempts
  add column if not exists extra_seconds int not null default 0,
  add column if not exists reopened_count int not null default 0;

-- Submitted answers stay immutable — except while teacher_reopen_attempt()
-- is unfreezing the answers of the attempt it names (transaction-local).
create or replace function public.protect_submitted_answer()
returns trigger
language plpgsql
as $$
begin
  if old.submitted_at is not null
     and coalesce(current_setting('app.reopening_attempt', true), '') <> old.attempt_id::text then
    raise exception 'submitted answers are immutable' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create or replace function public.teacher_extend_attempt(p_attempt_id uuid, p_minutes int)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_deadline timestamptz;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id for update;
  if not found or not (public.is_admin() or (public.is_staff() and public.teaches_student(v_attempt.student_id))) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if p_minutes is null or p_minutes not between 1 and 180 then
    raise exception 'INVALID_MINUTES' using errcode = '22023';
  end if;
  if v_attempt.status <> 'IN_PROGRESS' then
    raise exception 'ATTEMPT_CLOSED' using errcode = 'P0001';
  end if;

  -- counted from now if the time has already run out but the work is not yet closed
  v_deadline := greatest(v_attempt.deadline_at, now()) + make_interval(mins => p_minutes);
  update public.attempts
     set deadline_at = v_deadline,
         duration_seconds = duration_seconds + p_minutes * 60,
         extra_seconds = extra_seconds + p_minutes * 60
   where id = p_attempt_id;

  perform public.write_audit('attempt.extend_time', 'attempt', p_attempt_id,
    jsonb_build_object('student_id', v_attempt.student_id, 'minutes', p_minutes, 'deadline_at', v_deadline));
  return v_deadline;
end;
$$;

create or replace function public.teacher_reopen_attempt(p_attempt_id uuid, p_minutes int)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_deadline timestamptz;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id for update;
  if not found or not (public.is_admin() or (public.is_staff() and public.teaches_student(v_attempt.student_id))) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if p_minutes is null or p_minutes not between 1 and 180 then
    raise exception 'INVALID_MINUTES' using errcode = '22023';
  end if;
  if v_attempt.status = 'IN_PROGRESS' then
    raise exception 'ATTEMPT_NOT_SUBMITTED' using errcode = 'P0001';
  end if;
  -- AI marking in flight would write marks for the old answers
  if v_attempt.grading_status = 'IN_PROGRESS' and v_attempt.grading_started_at > now() - interval '10 minutes' then
    raise exception 'ATTEMPT_BEING_MARKED' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.attempts
              where student_id = v_attempt.student_id and exam_id = v_attempt.exam_id
                and status = 'IN_PROGRESS' and id <> p_attempt_id) then
    raise exception 'ATTEMPT_ALREADY_OPEN' using errcode = 'P0001';
  end if;

  -- the marks belong to the answers as they were handed in
  delete from public.grading_results where attempt_id = p_attempt_id;

  perform set_config('app.reopening_attempt', p_attempt_id::text, true);
  update public.answers set submitted_answer = null, submitted_at = null where attempt_id = p_attempt_id;
  perform set_config('app.reopening_attempt', '', true);

  v_deadline := now() + make_interval(mins => p_minutes);
  update public.attempts
     set status = 'IN_PROGRESS',
         submitted_at = null,
         submission_reason = null,
         grading_status = null,
         grading_started_at = null,
         score = null,
         max_score = null,
         percentage = null,
         deadline_at = v_deadline,
         duration_seconds = greatest(1, extract(epoch from (v_deadline - started_at))::int),
         extra_seconds = extra_seconds + p_minutes * 60,
         reopened_count = reopened_count + 1,
         active_session_id = null,
         -- an attempt closed for violations would close again at the next one
         violation_count = case when v_attempt.submission_reason = 'VIOLATION_LIMIT' then 0 else violation_count end
   where id = p_attempt_id;

  perform public.recompute_mastery(v_attempt.student_id);

  insert into public.notifications (user_id, type, title, body, link)
  select v_attempt.student_id, 'exam_available', 'Your exam was reopened: ' || e.title,
         'Your teacher gave you ' || p_minutes || ' more minutes. Your answers are saved — continue where you stopped.',
         '/attempt/' || p_attempt_id
    from public.exams e where e.id = v_attempt.exam_id;

  perform public.write_audit('attempt.reopen', 'attempt', p_attempt_id,
    jsonb_build_object('student_id', v_attempt.student_id, 'minutes', p_minutes,
                       'was', v_attempt.status, 'reason', v_attempt.submission_reason, 'percentage', v_attempt.percentage));
  return v_deadline;
end;
$$;

revoke execute on function public.teacher_extend_attempt(uuid, int) from public, anon;
revoke execute on function public.teacher_reopen_attempt(uuid, int) from public, anon;
grant execute on function public.teacher_extend_attempt(uuid, int), public.teacher_reopen_attempt(uuid, int)
  to authenticated, service_role;
