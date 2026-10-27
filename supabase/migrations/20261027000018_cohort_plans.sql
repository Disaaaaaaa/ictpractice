-- A school plan for one cohort. The students now in Grade 12 were taught Grade 11
-- by the 2025-26 KTP, not the 2026-27 one, so the programme can hold a second
-- Grade 11 plan shown only to them. for_student_grade null is the plan everyone
-- else sees; a plan with for_student_grade = 12 replaces it for Grade 12 students.
-- Topics, theory and questions are shared: a cohort plan only places topics.
alter table public.grades
  add column for_student_grade smallint check (for_student_grade in (11, 12));

alter table public.grades drop constraint grades_curriculum_version_id_number_key;
create unique index grades_version_number_plan
  on public.grades (curriculum_version_id, number, coalesce(for_student_grade, 0));

comment on column public.grades.for_student_grade is
  'null: the plan of the grade. Otherwise the plan of this grade shown instead to students of that grade (an earlier KTP they were taught by).';
