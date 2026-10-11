-- =====================================================================
-- Summative assessment for the unit (SAU)
--
-- A summative assessment is an exam of kind 'summative' that belongs to a
-- unit of the school programme. It is sat in Exam Mode and marked by the
-- same pipeline as every other exam (auto-marking + AI + teacher review).
--
-- Unlike mock and topic exams, a published summative is NOT open to
-- everyone: a teacher opens and closes it class by class
-- (summative_access). Students see a summative only while it is open for
-- one of their classes, or once they have sat it.
-- =====================================================================

-- Compared as text below: a value added to an enum cannot be used as an
-- enum literal in the transaction that added it.
alter type public.exam_kind add value if not exists 'summative';

alter table public.exams
  add column if not exists unit_id uuid references public.units (id) on delete set null;
create index if not exists exams_unit_idx on public.exams (unit_id) where unit_id is not null;

create table if not exists public.summative_access (
  exam_id uuid not null references public.exams (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  is_open boolean not null default false,
  opened_at timestamptz,
  closed_at timestamptz,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (exam_id, class_id)
);
create index if not exists summative_access_class_idx on public.summative_access (class_id) where is_open;

-- ---------------------------------------------------------------------
-- Access checks
-- ---------------------------------------------------------------------
-- True when the summative is open right now for an active class of the caller.
create or replace function public.summative_is_open(p_exam uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.summative_access a
      join public.class_members m on m.class_id = a.class_id
      join public.classes c on c.id = a.class_id
     where a.exam_id = p_exam
       and a.is_open
       and m.student_id = auth.uid()
       and m.status = 'active'
       and c.archived_at is null
  )
$$;

-- A student may see a summative while it is open for them, or after sitting it.
create or replace function public.summative_visible(p_exam uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.summative_is_open(p_exam)
      or exists (select 1 from public.attempts where exam_id = p_exam and student_id = auth.uid())
$$;

-- Teacher opens / closes a summative for one class. Closing stops new
-- starts; attempts already in progress run until their own deadline.
create or replace function public.set_summative_access(p_exam_id uuid, p_class_id uuid, p_open boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exam public.exams;
begin
  if not (public.is_admin() or (public.is_staff() and public.teaches_class(p_class_id))) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if not exists (select 1 from public.classes where id = p_class_id and archived_at is null) then
    raise exception 'CLASS_NOT_FOUND' using errcode = 'P0002';
  end if;

  select * into v_exam from public.exams where id = p_exam_id;
  if not found or v_exam.kind::text <> 'summative' then
    raise exception 'EXAM_NOT_FOUND' using errcode = 'P0002';
  end if;
  if p_open and (v_exam.current_version_id is null or v_exam.archived_at is not null
                 or v_exam.status not in ('published', 'scheduled')) then
    raise exception 'SUMMATIVE_NOT_PUBLISHED' using errcode = 'P0001';
  end if;

  insert into public.summative_access (exam_id, class_id, is_open, opened_at, closed_at, updated_by, updated_at)
  values (p_exam_id, p_class_id, p_open,
          case when p_open then now() end, case when p_open then null else now() end, auth.uid(), now())
  on conflict (exam_id, class_id) do update
     set is_open = excluded.is_open,
         opened_at = case when excluded.is_open then now() else public.summative_access.opened_at end,
         closed_at = case when excluded.is_open then null else now() end,
         updated_by = auth.uid(),
         updated_at = now();

  perform public.write_audit(
    case when p_open then 'summative.open' else 'summative.close' end,
    'exam', p_exam_id, jsonb_build_object('class_id', p_class_id));
  return p_open;
end;
$$;

-- ---------------------------------------------------------------------
-- start_attempt: a summative needs open class access
-- (unchanged apart from the SUMMATIVE_NOT_OPEN check)
-- ---------------------------------------------------------------------
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

  -- Checked after the resume: closing access never locks a student out of
  -- an attempt that is already running.
  if v_exam.kind::text = 'summative' and p_assignment_id is null
     and not public.is_staff() and not public.summative_is_open(p_exam_id) then
    raise exception 'SUMMATIVE_NOT_OPEN' using errcode = 'P0001';
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

-- ---------------------------------------------------------------------
-- Privileges and RLS
-- ---------------------------------------------------------------------
revoke execute on function public.summative_is_open(uuid) from public, anon;
revoke execute on function public.summative_visible(uuid) from public, anon;
revoke execute on function public.set_summative_access(uuid, uuid, boolean) from public, anon;
grant execute on function
  public.summative_is_open(uuid), public.summative_visible(uuid),
  public.set_summative_access(uuid, uuid, boolean)
to authenticated, service_role;

alter table public.summative_access enable row level security;
grant select on public.summative_access to authenticated;
revoke insert, update, delete on public.summative_access from authenticated;

-- Written only through set_summative_access().
drop policy if exists summative_access_select on public.summative_access;
create policy summative_access_select on public.summative_access for select to authenticated
  using (public.is_staff() or public.is_class_member(class_id));

drop policy if exists exams_select on public.exams;
create policy exams_select on public.exams for select to authenticated
  using (
    public.is_staff()
    or (archived_at is null
        and status in ('published', 'scheduled', 'closed')
        and (kind::text <> 'summative' or public.summative_visible(id)))
  );
