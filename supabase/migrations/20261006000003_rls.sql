-- =====================================================================
-- Row Level Security
--
-- Students: own profile, attempts, answers, results; published content.
-- Teachers: only students in their own (active) classes.
-- Admins:   everything.
-- Writes to exam state go through security-definer RPCs, never direct DML.
-- Privileged account operations use the service role on the server.
-- =====================================================================

-- anon never reads application tables directly.
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Users & classes
-- ---------------------------------------------------------------------
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin() or public.teaches_student(id) or public.is_staff_profile(id));
-- Profile fields (role, grade, force_password_change...) are changed server-side only.
create policy profiles_admin_write on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy classes_select on public.classes for select to authenticated
  using (teacher_id = auth.uid() or public.is_admin() or public.is_class_member(id));
create policy classes_teacher_insert on public.classes for insert to authenticated
  with check ((public.is_staff() and teacher_id = auth.uid()) or public.is_admin());
create policy classes_teacher_update on public.classes for update to authenticated
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());
create policy classes_admin_delete on public.classes for delete to authenticated
  using (public.is_admin());

create policy class_members_select on public.class_members for select to authenticated
  using (student_id = auth.uid() or public.teaches_class(class_id) or public.is_admin());
create policy class_members_teacher_write on public.class_members for all to authenticated
  using ((public.is_staff() and public.teaches_class(class_id)) or public.is_admin())
  with check ((public.is_staff() and public.teaches_class(class_id)) or public.is_admin());

-- ---------------------------------------------------------------------
-- Curriculum (readable by every signed-in user, edited by admins)
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'curriculum_versions', 'grades', 'terms', 'units', 'learning_objectives',
    'topic_objectives', 'school_placements', 'paper_components', 'paper_sections',
    'objective_paper_map', 'exam_placements'
  ] loop
    execute format('create policy %I on public.%I for select to authenticated using (true)', t || '_read', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
                   t || '_admin_write', t);
  end loop;
end $$;

create policy topics_select on public.topics for select to authenticated
  using ((status = 'published' and archived_at is null) or public.is_staff());
create policy topics_admin_write on public.topics for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Theory
-- ---------------------------------------------------------------------
create policy theory_packs_select on public.theory_packs for select to authenticated
  using (status = 'published' or public.is_staff());
create policy theory_packs_admin_write on public.theory_packs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy theory_sections_select on public.theory_sections for select to authenticated
  using (public.is_staff() or exists (
    select 1 from public.theory_packs p where p.id = theory_pack_id and p.status = 'published'));
create policy theory_sections_admin_write on public.theory_sections for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy theory_section_objectives_select on public.theory_section_objectives for select to authenticated
  using (true);
create policy theory_section_objectives_admin_write on public.theory_section_objectives for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy theory_progress_own on public.theory_progress for select to authenticated
  using (public.can_view_student(student_id));

-- ---------------------------------------------------------------------
-- Question bank
-- ---------------------------------------------------------------------
create or replace function public.question_visible_to_student(p_question uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.questions q
     where q.id = p_question and q.status = 'published'
       and q.practice_enabled and q.archived_at is null
  )
$$;
grant execute on function public.question_visible_to_student(uuid) to authenticated;
revoke execute on function public.question_visible_to_student(uuid) from anon, public;

create policy questions_select on public.questions for select to authenticated
  using (public.is_staff() or (status = 'published' and practice_enabled and archived_at is null));
create policy questions_staff_insert on public.questions for insert to authenticated
  with check (public.is_staff() and created_by = auth.uid());
create policy questions_staff_update on public.questions for update to authenticated
  using (public.is_admin() or (public.is_staff() and created_by = auth.uid()))
  with check (public.is_admin() or (public.is_staff() and created_by = auth.uid()));

create policy question_objectives_select on public.question_objectives for select to authenticated
  using (public.is_staff() or public.question_visible_to_student(question_id));
create policy question_objectives_staff_write on public.question_objectives for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy question_options_select on public.question_options for select to authenticated
  using (public.is_staff() or public.question_visible_to_student(question_id));
create policy question_options_staff_write on public.question_options for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Mark schemes: staff only. Students receive scheme details exclusively through
-- server actions (practice) or get_attempt_review (when released).
create policy mark_schemes_staff on public.mark_schemes for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------
-- Exams
-- ---------------------------------------------------------------------
create policy exams_select on public.exams for select to authenticated
  using (public.is_staff() or (archived_at is null and status in ('published', 'scheduled', 'closed')));
create policy exams_staff_insert on public.exams for insert to authenticated
  with check (public.is_staff() and created_by = auth.uid());
create policy exams_staff_update on public.exams for update to authenticated
  using (public.is_admin() or (public.is_staff() and created_by = auth.uid()))
  with check (public.is_admin() or (public.is_staff() and created_by = auth.uid()));

create policy exam_questions_staff on public.exam_questions for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy exam_versions_select on public.exam_versions for select to authenticated
  using (public.is_staff() or exists (
    select 1 from public.exams e
     where e.id = exam_id and e.archived_at is null and e.status in ('published', 'scheduled', 'closed')));
-- Versions are created only by publish_exam(); no direct writes.

create policy exam_version_payloads_staff on public.exam_version_payloads for select to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------
-- Assignments
-- ---------------------------------------------------------------------
create policy assignments_select on public.assignments for select to authenticated
  using (teacher_id = auth.uid() or public.is_admin() or public.is_assignment_target(id, auth.uid()));
create policy assignments_teacher_insert on public.assignments for insert to authenticated
  with check (public.is_staff() and teacher_id = auth.uid());
create policy assignments_teacher_update on public.assignments for update to authenticated
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());
create policy assignments_teacher_delete on public.assignments for delete to authenticated
  using (teacher_id = auth.uid() or public.is_admin());

create policy assignment_targets_select on public.assignment_targets for select to authenticated
  using (public.owns_assignment(assignment_id) or public.is_admin()
         or student_id = auth.uid() or (class_id is not null and public.is_class_member(class_id)));
create policy assignment_targets_teacher_write on public.assignment_targets for all to authenticated
  using (public.owns_assignment(assignment_id) or public.is_admin())
  with check (
    (public.owns_assignment(assignment_id) or public.is_admin())
    and (class_id is null or public.teaches_class(class_id) or public.is_admin())
    and (student_id is null or public.teaches_student(student_id) or public.is_admin())
  );

-- ---------------------------------------------------------------------
-- Attempts & results (writes only through RPCs / server)
-- ---------------------------------------------------------------------
create policy attempts_select on public.attempts for select to authenticated
  using (public.can_view_student(student_id));

create policy answers_select on public.answers for select to authenticated
  using (exists (select 1 from public.attempts a
                  where a.id = attempt_id and public.can_view_student(a.student_id)));

-- Students see their marks only once results are released; staff always.
create policy grading_results_select on public.grading_results for select to authenticated
  using (exists (
    select 1 from public.attempts a
     where a.id = attempt_id
       and ((a.student_id = auth.uid() and public.attempt_results_visible(a.id))
            or (a.student_id <> auth.uid() and public.can_view_student(a.student_id)))));

create policy grade_audit_staff on public.grade_audit for select to authenticated
  using (public.is_staff() and exists (
    select 1 from public.grading_results r join public.attempts a on a.id = r.attempt_id
     where r.id = grading_result_id and public.can_view_student(a.student_id)));

create policy integrity_events_select on public.integrity_events for select to authenticated
  using (public.can_view_student(student_id));

create policy practice_attempts_select on public.practice_attempts for select to authenticated
  using (public.can_view_student(student_id));

create policy student_mastery_select on public.student_mastery for select to authenticated
  using (public.can_view_student(student_id));

-- ---------------------------------------------------------------------
-- Platform
-- ---------------------------------------------------------------------
create policy notifications_own_select on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy notifications_own_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy bookmarks_own on public.bookmarks for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy audit_logs_admin on public.audit_logs for select to authenticated
  using (public.is_admin());

create policy system_settings_read on public.system_settings for select to authenticated
  using (true);
create policy system_settings_admin_write on public.system_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Only the read_at column of notifications may be changed by its owner.
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;

-- ---------------------------------------------------------------------
-- Realtime (live exam monitoring). RLS applies to realtime subscribers.
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.attempts, public.integrity_events;
  end if;
end $$;
