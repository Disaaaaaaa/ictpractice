-- =====================================================================
-- "Technical issue" during an exam
--
-- When a student's laptop misbehaves (it drops out of fullscreen, loses
-- focus, has to be swapped for another one), the teacher presses
-- "Technical issue" for that student in the live monitor. From then on the
-- student's integrity events are still logged but are NOT counted as
-- violations — no warnings, no auto-submit — and the violations already
-- counted in this attempt are excused. The teacher can switch it off again.
-- =====================================================================

alter table public.attempts
  add column if not exists technical_issue boolean not null default false,
  add column if not exists technical_issue_at timestamptz,
  add column if not exists technical_issue_by uuid references public.profiles (id) on delete set null;

-- Teacher switch. Only for an attempt that is still running.
create or replace function public.teacher_set_technical_issue(p_attempt_id uuid, p_on boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id for update;
  if not found or not (public.is_admin() or (public.is_staff() and public.teaches_student(v_attempt.student_id))) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if v_attempt.status <> 'IN_PROGRESS' then
    raise exception 'ATTEMPT_CLOSED' using errcode = 'P0001';
  end if;

  if p_on then
    update public.attempts
       set technical_issue = true, technical_issue_at = now(), technical_issue_by = auth.uid(), violation_count = 0
     where id = p_attempt_id;
    -- what was counted so far is excused; the events themselves stay in the log
    update public.integrity_events
       set counted = false, metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('excused', 'technical_issue')
     where attempt_id = p_attempt_id and counted;
  else
    update public.attempts set technical_issue = false where id = p_attempt_id;
  end if;

  perform public.write_audit(
    case when p_on then 'attempt.technical_issue_on' else 'attempt.technical_issue_off' end,
    'attempt', p_attempt_id,
    jsonb_build_object('student_id', v_attempt.student_id, 'violations_excused', case when p_on then v_attempt.violation_count else 0 end));
  return p_on;
end;
$$;

-- Internal: insert an event, count it and apply the auto-submit policy.
-- (unchanged apart from: nothing is counted while technical_issue is on)
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
  v_counted := public.integrity_event_counts(p_event_type, v_attempt.require_fullscreen)
               and not v_attempt.technical_issue;

  insert into public.integrity_events (
    attempt_id, exam_id, student_id, event_type, started_at, ended_at, duration_seconds, counted, metadata
  ) values (
    p_attempt_id, v_attempt.exam_id, v_attempt.student_id, p_event_type, v_started, v_ended,
    case when v_ended is null then null else extract(epoch from (v_ended - v_started))::int end,
    v_counted,
    (case when p_metadata is null or pg_column_size(p_metadata) > 4096 then '{}'::jsonb else p_metadata end)
      || case when v_attempt.technical_issue then jsonb_build_object('excused', 'technical_issue') else '{}'::jsonb end
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
    'auto_submitted', v_auto,
    'technical_issue', v_attempt.technical_issue
  );
end;
$$;

-- (unchanged apart from returning technical_issue, so the exam window can
-- stop warning the student and stop insisting on fullscreen)
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
    'superseded', v_superseded,
    'technical_issue', v_attempt.technical_issue
  );
end;
$$;

revoke execute on function public.teacher_set_technical_issue(uuid, boolean) from public, anon;
grant execute on function public.teacher_set_technical_issue(uuid, boolean) to authenticated, service_role;
