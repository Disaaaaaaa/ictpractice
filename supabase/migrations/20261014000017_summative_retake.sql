-- =====================================================================
-- Summative retake for one student
--
-- A teacher can give a single student another variant of a summative (a
-- retake after technical problems) with an ordinary individual assignment
-- of that exam. start_attempt() already lets an assignment start the exam
-- without class access; this makes the paper visible to the student it is
-- assigned to, while it stays hidden from everyone else.
-- =====================================================================

create or replace function public.summative_visible(p_exam uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.attempts where exam_id = p_exam and student_id = auth.uid())
      -- assigned to this student (e.g. a retake)
      or exists (select 1 from public.assignments a
                  where a.exam_id = p_exam and a.archived_at is null
                    and public.is_assignment_target(a.id, auth.uid()))
      or (public.summative_is_open(p_exam)
          and (exists (select 1 from public.summative_variants s
                        where s.base_exam_id = public.summative_base(p_exam)
                          and s.student_id = auth.uid() and s.exam_id = p_exam)
               or public.summative_usable_variants(public.summative_base(p_exam)) = array[p_exam]))
$$;
