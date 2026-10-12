-- =====================================================================
-- Summative assessments: parallel variants
--
-- A summative can have several variants — the same structure, marks and
-- skills with different numbers and contexts — so that students of one
-- class do not all sit the same paper.
--
--   * A variant is itself a summative exam whose variant_of points at the
--     base exam (Variant 1). The base and its variants form a group.
--   * Class access stays one switch per group (summative_access on the base).
--   * Each student is given ONE variant of the group, at random, keeping the
--     numbers per variant equal within the class (summative_variants).
--     It is assigned when the teacher opens access, or the first time a
--     late joiner looks, and it never changes afterwards.
--   * A student sees and can start only their own variant.
--
-- A group with a single usable variant behaves exactly as before.
-- =====================================================================

alter table public.exams
  add column if not exists variant_of uuid references public.exams (id) on delete set null,
  add column if not exists variant_no smallint not null default 1 check (variant_no between 1 and 20);
alter table public.exams drop constraint if exists exams_variant_not_self;
alter table public.exams add constraint exams_variant_not_self check (variant_of is null or variant_of <> id);
create index if not exists exams_variant_of_idx on public.exams (variant_of) where variant_of is not null;

create table if not exists public.summative_variants (
  base_exam_id uuid not null references public.exams (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  exam_id uuid not null references public.exams (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (base_exam_id, student_id)
);
create index if not exists summative_variants_exam_idx on public.summative_variants (exam_id);

alter table public.summative_variants enable row level security;
revoke all on public.summative_variants from anon, authenticated;
grant select on public.summative_variants to authenticated;
drop policy if exists summative_variants_select on public.summative_variants;
create policy summative_variants_select on public.summative_variants for select to authenticated
  using (student_id = auth.uid() or (public.is_staff() and public.can_view_student(student_id)));

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.summative_base(p_exam uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(e.variant_of, e.id) from public.exams e where e.id = p_exam
$$;

-- Variants of a group that a student could sit right now, in order.
create or replace function public.summative_usable_variants(p_base uuid)
returns uuid[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(e.id order by e.variant_no, e.created_at), '{}')
    from public.exams e
   where (e.id = p_base or e.variant_of = p_base)
     and e.kind::text = 'summative'
     and e.archived_at is null
     and e.current_version_id is not null
     and e.status in ('published', 'scheduled')
$$;

-- Gives the student one variant of the group and returns it. Internal.
--   1. a paper they already sat (or are sitting) stays theirs;
--   2. an earlier assignment is kept while that variant is still usable;
--   3. otherwise: the variant with the fewest students in p_class, ties
--      broken at random — so the split is random and equal.
create or replace function public.assign_summative_variant(p_base uuid, p_student uuid, p_class uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usable uuid[] := public.summative_usable_variants(p_base);
  v_exam uuid;
begin
  select t.exam_id into v_exam
    from public.attempts t
    join public.exams e on e.id = t.exam_id
   where t.student_id = p_student and (e.id = p_base or e.variant_of = p_base)
   order by t.created_at desc
   limit 1;

  if v_exam is null then
    select s.exam_id into v_exam from public.summative_variants s
     where s.base_exam_id = p_base and s.student_id = p_student and s.exam_id = any (v_usable);
    if v_exam is not null then
      return v_exam;
    end if;
    if cardinality(v_usable) = 0 then
      return null;
    end if;
    select u.id into v_exam
      from unnest(v_usable) as u(id)
     order by (
               select count(*) from public.summative_variants s
                 join public.class_members m on m.student_id = s.student_id and m.class_id = p_class and m.status = 'active'
                where s.base_exam_id = p_base and s.exam_id = u.id and s.student_id <> p_student
              ),
              random()
     limit 1;
  end if;

  insert into public.summative_variants (base_exam_id, student_id, exam_id)
  values (p_base, p_student, v_exam)
  on conflict (base_exam_id, student_id) do update set exam_id = excluded.exam_id, assigned_at = now()
   where public.summative_variants.exam_id is distinct from excluded.exam_id;
  return v_exam;
end;
$$;

-- True when the group is open right now for an active class of the caller.
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
     where a.exam_id = public.summative_base(p_exam)
       and a.is_open
       and m.student_id = auth.uid()
       and m.status = 'active'
       and c.archived_at is null
  )
$$;

-- A student sees a summative after sitting it, or while its group is open
-- for them and it is THEIR variant. A group with one usable variant shows
-- that variant to everyone.
create or replace function public.summative_visible(p_exam uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.attempts where exam_id = p_exam and student_id = auth.uid())
      or (public.summative_is_open(p_exam)
          and (exists (select 1 from public.summative_variants s
                        where s.base_exam_id = public.summative_base(p_exam)
                          and s.student_id = auth.uid() and s.exam_id = p_exam)
               or public.summative_usable_variants(public.summative_base(p_exam)) = array[p_exam]))
$$;

-- For a student opening the Summative page: makes sure they have a variant of
-- every group that is open for them (covers students who joined the class
-- after access was opened, or variants published later). Returns the groups.
create or replace function public.ensure_my_summative_variants()
returns setof uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  if auth.uid() is null or public.current_user_role() is distinct from 'student' then
    return;
  end if;
  for r in
    select distinct on (a.exam_id) a.exam_id as base_id, a.class_id
      from public.summative_access a
      join public.class_members m on m.class_id = a.class_id and m.student_id = auth.uid() and m.status = 'active'
      join public.classes c on c.id = a.class_id and c.archived_at is null
     where a.is_open
     order by a.exam_id, a.opened_at
  loop
    if cardinality(public.summative_usable_variants(r.base_id)) > 1 then
      perform public.assign_summative_variant(r.base_id, auth.uid(), r.class_id);
    end if;
    return next r.base_id;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Opening access: one switch per group; variants are dealt out on opening
-- ---------------------------------------------------------------------
create or replace function public.set_summative_access(p_exam_id uuid, p_class_id uuid, p_open boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exam public.exams;
  v_base uuid;
  v_student uuid;
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
  v_base := coalesce(v_exam.variant_of, v_exam.id);
  if p_open and cardinality(public.summative_usable_variants(v_base)) = 0 then
    raise exception 'SUMMATIVE_NOT_PUBLISHED' using errcode = 'P0001';
  end if;

  insert into public.summative_access (exam_id, class_id, is_open, opened_at, closed_at, updated_by, updated_at)
  values (v_base, p_class_id, p_open,
          case when p_open then now() end, case when p_open then null else now() end, auth.uid(), now())
  on conflict (exam_id, class_id) do update
     set is_open = excluded.is_open,
         opened_at = case when excluded.is_open then now() else public.summative_access.opened_at end,
         closed_at = case when excluded.is_open then null else now() end,
         updated_by = auth.uid(),
         updated_at = now();

  -- Deal the variants out to the class in random order.
  if p_open and cardinality(public.summative_usable_variants(v_base)) > 1 then
    for v_student in
      select m.student_id from public.class_members m
       where m.class_id = p_class_id and m.status = 'active'
       order by random()
    loop
      perform public.assign_summative_variant(v_base, v_student, p_class_id);
    end loop;
  end if;

  perform public.write_audit(
    case when p_open then 'summative.open' else 'summative.close' end,
    'exam', v_base, jsonb_build_object('class_id', p_class_id));
  return p_open;
end;
$$;

-- ---------------------------------------------------------------------
-- start_attempt: a student may start only their own variant
-- (unchanged apart from the variant check inside the summative block)
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
$$;

-- ---------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------
revoke execute on function public.summative_base(uuid) from public, anon;
revoke execute on function public.summative_usable_variants(uuid) from public, anon;
revoke execute on function public.assign_summative_variant(uuid, uuid, uuid) from public, anon, authenticated;
revoke execute on function public.ensure_my_summative_variants() from public, anon;
grant execute on function
  public.summative_base(uuid), public.summative_usable_variants(uuid), public.ensure_my_summative_variants()
to authenticated, service_role;
grant execute on function public.assign_summative_variant(uuid, uuid, uuid) to service_role;
