-- =====================================================================
-- NIS Computer Science Exam Preparation Platform — core schema
--
-- Academic model:   curriculum_version → topic → learning_objective → question
-- Classification:   topic ↔ school placement (grade → term → unit)
--                   topic ↔ exam placement   (paper → section)
-- A topic exists exactly once per curriculum version; Term and Paper are
-- two independent ways of classifying it.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type public.user_role as enum ('student', 'teacher', 'admin');

create type public.content_status as enum ('draft', 'review', 'published', 'archived');

create type public.question_type as enum (
  'mcq', 'multiple_response', 'true_false', 'matching', 'fill_blank',
  'short_answer', 'extended', 'calculation', 'code_completion', 'code_analysis',
  'trace_table', 'sql', 'html_css', 'pseudocode', 'diagram', 'scenario'
);

create type public.difficulty_level as enum ('easy', 'medium', 'hard', 'exam');

create type public.command_word as enum (
  'state', 'name', 'identify', 'define', 'describe', 'explain', 'compare',
  'analyse', 'evaluate', 'discuss', 'suggest', 'calculate', 'complete',
  'write', 'draw'
);

create type public.grading_method as enum ('AUTO', 'AI', 'MANUAL', 'HYBRID');

create type public.question_source as enum (
  'original', 'teacher', 'nis_style', 'cambridge_style', 'past_paper', 'mock'
);

create type public.exam_kind as enum ('topic', 'mock', 'revision', 'custom');

create type public.exam_status as enum ('draft', 'scheduled', 'published', 'closed', 'archived');

create type public.attempt_status as enum ('IN_PROGRESS', 'SUBMITTED', 'GRADED', 'REVIEW_REQUIRED');

create type public.submission_reason as enum (
  'MANUAL_SUBMIT', 'TIME_EXPIRED', 'VIOLATION_LIMIT', 'TEACHER_FORCED', 'SYSTEM'
);

create type public.grading_status as enum ('PENDING', 'IN_PROGRESS', 'COMPLETE', 'FAILED');

create type public.integrity_event_type as enum (
  'TAB_HIDDEN', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'PAGE_RELOAD', 'PAGE_LEAVE',
  'CONNECTION_LOST', 'CONNECTION_RESTORED', 'MULTIPLE_SESSION_DETECTED'
);

create type public.integrity_mode as enum ('monitor', 'warn', 'auto_submit');

create type public.assignment_type as enum ('practice', 'topic_exam', 'mock_exam', 'revision');

-- ---------------------------------------------------------------------
-- Generic helpers
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------
-- profiles.id is the Supabase auth user id (auth.users.id). Passwords are
-- never stored here: they live exclusively in Supabase Auth.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9._-]{1,62}$'),
  first_name text not null default '',
  last_name text not null default '',
  role public.user_role not null default 'student',
  grade smallint check (grade in (11, 12)),
  force_password_change boolean not null default true,
  is_active boolean not null default true,
  locale text not null default 'en' check (locale in ('en', 'ru', 'kk')),
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade smallint not null check (grade in (11, 12)),
  academic_year text not null,
  teacher_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (name, academic_year)
);
create index classes_teacher_idx on public.classes (teacher_id);

create table public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'removed')),
  primary key (class_id, student_id)
);
create index class_members_student_idx on public.class_members (student_id);

-- ---------------------------------------------------------------------
-- Curriculum
-- ---------------------------------------------------------------------
create table public.curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                -- e.g. NIS_CS_2026_2027
  title text not null,
  academic_year text,
  kind text not null default 'school_programme'
    check (kind in ('school_programme', 'exam_specification')),
  is_active boolean not null default false,
  source_documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
-- At most one active school programme at a time.
create unique index curriculum_versions_one_active
  on public.curriculum_versions (kind) where is_active;

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete cascade,
  number smallint not null check (number in (11, 12)),
  title text not null,
  total_hours int,
  sort_order int not null default 0,
  unique (curriculum_version_id, number)
);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.grades (id) on delete cascade,
  number smallint not null check (number between 1 and 4),
  title text not null,                      -- "Term I"
  hours int,
  sort_order int not null default 0,
  unique (grade_id, number)
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.terms (id) on delete cascade,
  code text not null,                       -- "11.1A"
  title text not null,                      -- "Computer systems"
  sort_order int not null default 0,
  unique (term_id, code)
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  recommended_minutes int,
  status public.content_status not null default 'draft',
  sort_order int not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_version_id, slug)
);
create trigger topics_touch before update on public.topics
  for each row execute function public.touch_updated_at();

-- A learning objective is identified by (curriculum_version_id, code), never by
-- the code alone: the same code can have different wording in different documents.
create table public.learning_objectives (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete cascade,
  code text not null check (code ~ '^[0-9]{2}\.[0-9]+\.[0-9]+\.[0-9]+$'),
  description text not null,
  grade smallint not null check (grade in (11, 12)),
  strand_code text generated always as (split_part(code, '.', 2) || '.' || split_part(code, '.', 3)) stored,
  sort_key int[] generated always as (string_to_array(code, '.')::int[]) stored,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  unique (curriculum_version_id, code)
);

create table public.topic_objectives (
  topic_id uuid not null references public.topics (id) on delete cascade,
  learning_objective_id uuid not null references public.learning_objectives (id) on delete cascade,
  primary key (topic_id, learning_objective_id)
);
create index topic_objectives_lo_idx on public.topic_objectives (learning_objective_id);

create table public.school_placements (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  unit_id uuid not null references public.units (id) on delete cascade,
  lessons text,                             -- "18-20"
  hours int,
  period text,                              -- "Weeks 6–7 (05.10–16.10)"
  resources text,
  sort_order int not null default 0,
  unique (topic_id, unit_id)
);
create index school_placements_unit_idx on public.school_placements (unit_id);

create table public.paper_components (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete cascade,
  number smallint not null check (number between 1 and 3),
  title text not null,                      -- "Paper 1"
  description text,
  sort_order int not null default 0,
  unique (curriculum_version_id, number)
);

-- Two levels: a strand group ("Data and Information", parent_id null) and its
-- sections ("1.1 Data representation").
create table public.paper_sections (
  id uuid primary key default gen_random_uuid(),
  paper_component_id uuid not null references public.paper_components (id) on delete cascade,
  parent_id uuid references public.paper_sections (id) on delete cascade,
  code text,                                -- "1.1" for sections, null for groups
  title text not null,
  sort_order int not null default 0
);
create index paper_sections_paper_idx on public.paper_sections (paper_component_id);

-- LO ↔ Paper. Preferred over topic.paper because one topic can contain
-- objectives assessed in different papers.
create table public.objective_paper_map (
  id uuid primary key default gen_random_uuid(),
  learning_objective_id uuid not null references public.learning_objectives (id) on delete cascade,
  paper_component_id uuid not null references public.paper_components (id) on delete cascade,
  paper_section_id uuid references public.paper_sections (id) on delete set null,
  unique (learning_objective_id, paper_component_id)
);
create index objective_paper_map_paper_idx on public.objective_paper_map (paper_component_id);

-- Topic ↔ paper section (exam navigation).
create table public.exam_placements (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  paper_section_id uuid not null references public.paper_sections (id) on delete cascade,
  sort_order int not null default 0,
  unique (topic_id, paper_section_id)
);
create index exam_placements_section_idx on public.exam_placements (paper_section_id);

-- ---------------------------------------------------------------------
-- Theory
-- ---------------------------------------------------------------------
create table public.theory_packs (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null unique references public.topics (id) on delete cascade,
  title text not null,
  summary text,
  status public.content_status not null default 'draft',
  version int not null default 1,
  published_at timestamptz,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger theory_packs_touch before update on public.theory_packs
  for each row execute function public.touch_updated_at();

-- blocks: array of structured content blocks, e.g.
--   {"type":"definition","title":"Waterfall model","content":"..."}
-- Allowed types are validated by the application (see src/lib/theory/blocks.ts).
create table public.theory_sections (
  id uuid primary key default gen_random_uuid(),
  theory_pack_id uuid not null references public.theory_packs (id) on delete cascade,
  title text not null,
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index theory_sections_pack_idx on public.theory_sections (theory_pack_id, sort_order);
create trigger theory_sections_touch before update on public.theory_sections
  for each row execute function public.touch_updated_at();

create table public.theory_section_objectives (
  theory_section_id uuid not null references public.theory_sections (id) on delete cascade,
  learning_objective_id uuid not null references public.learning_objectives (id) on delete cascade,
  primary key (theory_section_id, learning_objective_id)
);

create table public.theory_progress (
  student_id uuid not null references public.profiles (id) on delete cascade,
  theory_section_id uuid not null references public.theory_sections (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (student_id, theory_section_id)
);

-- ---------------------------------------------------------------------
-- Question bank
-- ---------------------------------------------------------------------
-- content: public, type-specific data that a student may see
--   (matching sides, blank count, language, starter code, trace-table columns, hint).
-- Anything that reveals the answer lives in mark_schemes, which students cannot read.
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete restrict,
  title text not null,
  question_text text not null,
  question_type public.question_type not null,
  marks int not null check (marks between 0 and 100),
  difficulty public.difficulty_level not null default 'medium',
  command_word public.command_word,
  grading_method public.grading_method not null default 'AUTO',
  grade smallint check (grade in (11, 12)),
  paper_component_id uuid references public.paper_components (id) on delete set null,
  topic_id uuid references public.topics (id) on delete set null,
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  source_type public.question_source not null default 'original',
  source_reference text,
  practice_enabled boolean not null default true,
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
create index questions_topic_idx on public.questions (topic_id) where archived_at is null;
create index questions_status_idx on public.questions (status);
create trigger questions_touch before update on public.questions
  for each row execute function public.touch_updated_at();

create table public.question_objectives (
  question_id uuid not null references public.questions (id) on delete cascade,
  learning_objective_id uuid not null references public.learning_objectives (id) on delete cascade,
  primary key (question_id, learning_objective_id)
);
create index question_objectives_lo_idx on public.question_objectives (learning_objective_id);

-- Options carry no correctness flag: correct keys are in mark_schemes.accepted_answers.
create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  key text not null,                        -- "A", "B", ...
  content text not null,
  sort_order int not null default 0,
  unique (question_id, key)
);

-- Versioned: editing a mark scheme inserts a new row and flips is_current.
create table public.mark_schemes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  version int not null default 1,
  is_current boolean not null default true,
  mark_scheme text not null default '',
  marking_points jsonb not null default '[]'::jsonb,   -- [{"criterion":"...","marks":1}]
  model_answer text,
  accepted_answers jsonb not null default '{}'::jsonb,
  ai_grading_instructions text,
  explanation text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (question_id, version)
);
create unique index mark_schemes_one_current on public.mark_schemes (question_id) where is_current;

-- ---------------------------------------------------------------------
-- Exams, immutable versions, assignments
-- ---------------------------------------------------------------------
create table public.exams (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete restrict,
  kind public.exam_kind not null,
  title text not null,
  description text,
  instructions text,
  topic_id uuid references public.topics (id) on delete set null,
  paper_component_id uuid references public.paper_components (id) on delete set null,
  year int check (year between 2000 and 2100),
  grade smallint check (grade in (11, 12)),
  duration_minutes int not null check (duration_minutes between 1 and 600),
  status public.exam_status not null default 'draft',
  availability_start timestamptz,
  availability_end timestamptz,
  attempt_limit int check (attempt_limit is null or attempt_limit > 0),
  integrity_mode public.integrity_mode not null default 'warn',
  max_violations int not null default 3 check (max_violations > 0),
  require_fullscreen boolean not null default true,
  show_results boolean not null default true,
  results_release_at timestamptz,
  show_mark_scheme boolean not null default false,
  current_version_id uuid,                  -- fk added below
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  check (kind <> 'mock' or (year is not null and paper_component_id is not null)),
  check (availability_end is null or availability_start is null or availability_end > availability_start)
);
create index exams_kind_idx on public.exams (kind, status);
create index exams_topic_idx on public.exams (topic_id);
create trigger exams_touch before update on public.exams
  for each row execute function public.touch_updated_at();

-- Draft composition of an exam. Students never see this; they see a version snapshot.
create table public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete restrict,
  sort_order int not null default 0,
  marks_override int check (marks_override is null or marks_override >= 0),
  section_label text,
  unique (exam_id, question_id)
);

-- Immutable published versions. Attempts reference a version, never live questions,
-- so later edits to the question bank cannot change old results.
create table public.exam_versions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams (id) on delete cascade,
  version int not null,
  question_count int not null,
  total_marks int not null,
  duration_minutes int not null,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles (id) on delete set null,
  unique (exam_id, version)
);
alter table public.exams
  add constraint exams_current_version_fk
  foreign key (current_version_id) references public.exam_versions (id) on delete set null;

-- paper:   what the student sees (no answers)
-- marking: mark schemes / accepted answers — staff and server only
create table public.exam_version_payloads (
  exam_version_id uuid primary key references public.exam_versions (id) on delete cascade,
  paper jsonb not null,
  marking jsonb not null
);

create or replace function public.prevent_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception '% rows are immutable; publish a new exam version instead', tg_table_name
    using errcode = 'P0001';
end;
$$;
create trigger exam_version_payloads_immutable before update on public.exam_version_payloads
  for each row execute function public.prevent_mutation();
create trigger exam_versions_immutable
  before update of exam_id, version, question_count, total_marks, duration_minutes
  on public.exam_versions
  for each row execute function public.prevent_mutation();

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  assignment_type public.assignment_type not null,
  title text not null,
  instructions text,
  exam_id uuid references public.exams (id) on delete restrict,
  topic_id uuid references public.topics (id) on delete set null,
  available_from timestamptz not null default now(),
  deadline timestamptz,
  attempt_limit int check (attempt_limit is null or attempt_limit > 0),
  duration_override_minutes int check (duration_override_minutes is null or duration_override_minutes > 0),
  show_results boolean not null default true,
  results_release_at timestamptz,
  show_mark_scheme boolean not null default false,
  integrity_mode public.integrity_mode not null default 'warn',
  max_violations int not null default 3 check (max_violations > 0),
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  check (assignment_type in ('practice', 'revision') or exam_id is not null),
  check (deadline is null or deadline > available_from)
);
create index assignments_teacher_idx on public.assignments (teacher_id);

-- An assignment may target a student, a class, or several classes.
create table public.assignment_targets (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  class_id uuid references public.classes (id) on delete cascade,
  student_id uuid references public.profiles (id) on delete cascade,
  check ((class_id is null) <> (student_id is null))
);
create index assignment_targets_assignment_idx on public.assignment_targets (assignment_id);
create index assignment_targets_class_idx on public.assignment_targets (class_id);
create index assignment_targets_student_idx on public.assignment_targets (student_id);

-- ---------------------------------------------------------------------
-- Attempts, answers, grading, integrity
-- ---------------------------------------------------------------------
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  exam_id uuid not null references public.exams (id) on delete restrict,
  exam_version_id uuid not null references public.exam_versions (id) on delete restrict,
  assignment_id uuid references public.assignments (id) on delete set null,
  started_at timestamptz not null default now(),
  duration_seconds int not null,
  deadline_at timestamptz not null,
  submitted_at timestamptz,
  status public.attempt_status not null default 'IN_PROGRESS',
  submission_reason public.submission_reason,
  grading_status public.grading_status,
  grading_started_at timestamptz,
  score numeric(7, 2),
  max_score numeric(7, 2),
  percentage numeric(5, 2),
  violation_count int not null default 0,
  -- policy snapshot taken at start
  integrity_mode public.integrity_mode not null,
  max_violations int not null,
  require_fullscreen boolean not null default true,
  show_results boolean not null default true,
  results_release_at timestamptz,
  show_mark_scheme boolean not null default false,
  -- live state
  current_question int not null default 1,
  answered_count int not null default 0,
  active_session_id text,
  last_heartbeat_at timestamptz,
  is_online boolean not null default true,
  created_at timestamptz not null default now()
);
create index attempts_student_idx on public.attempts (student_id, created_at desc);
create index attempts_exam_idx on public.attempts (exam_id);
create index attempts_assignment_idx on public.attempts (assignment_id);
create index attempts_open_idx on public.attempts (deadline_at) where status = 'IN_PROGRESS';
create index attempts_grading_idx on public.attempts (grading_status) where grading_status in ('PENDING', 'FAILED', 'IN_PROGRESS');
-- one open attempt per student per exam
create unique index attempts_one_open on public.attempts (student_id, exam_id) where status = 'IN_PROGRESS';

-- answer_data is the editable working copy; submitted_answer is frozen at submit.
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  question_id uuid not null,                -- id inside the version snapshot
  answer_data jsonb,
  flagged boolean not null default false,
  time_spent_seconds int not null default 0,
  saved_at timestamptz not null default now(),
  submitted_answer jsonb,
  submitted_at timestamptz,
  unique (attempt_id, question_id)
);

create or replace function public.protect_submitted_answer()
returns trigger
language plpgsql
as $$
begin
  if old.submitted_at is not null then
    raise exception 'submitted answers are immutable' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger answers_protect_submitted before update on public.answers
  for each row execute function public.protect_submitted_answer();

create table public.grading_results (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid references public.answers (id) on delete cascade,
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  question_id uuid not null,
  grading_method public.grading_method not null,
  status public.grading_status not null default 'PENDING',
  awarded_mark numeric(6, 2),
  max_mark numeric(6, 2) not null,
  feedback text,
  confidence numeric(4, 3) check (confidence is null or confidence between 0 and 1),
  marking_points jsonb not null default '[]'::jsonb,
  needs_review boolean not null default false,
  ai_model text,
  prompt_version text,
  graded_at timestamptz,
  original_ai_mark numeric(6, 2),
  teacher_override_mark numeric(6, 2),
  teacher_feedback text,
  teacher_id uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  final_mark numeric(6, 2) generated always as (coalesce(teacher_override_mark, awarded_mark)) stored,
  retries int not null default 0,
  error text,
  unique (attempt_id, question_id),
  check (awarded_mark is null or (awarded_mark >= 0 and awarded_mark <= max_mark)),
  check (teacher_override_mark is null or (teacher_override_mark >= 0 and teacher_override_mark <= max_mark))
);
create index grading_results_review_idx on public.grading_results (needs_review) where needs_review;

create table public.grade_audit (
  id uuid primary key default gen_random_uuid(),
  grading_result_id uuid not null references public.grading_results (id) on delete cascade,
  action text not null check (action in ('accept', 'override', 'feedback', 'regrade_request')),
  original_ai_mark numeric(6, 2),
  previous_mark numeric(6, 2),
  final_mark numeric(6, 2),
  reason text,
  changed_by uuid references public.profiles (id) on delete set null,
  changed_at timestamptz not null default now()
);

create table public.integrity_events (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  exam_id uuid not null references public.exams (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  event_type public.integrity_event_type not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds int,
  counted boolean not null default false,  -- counts towards the violation limit
  metadata jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);
create index integrity_events_attempt_idx on public.integrity_events (attempt_id, started_at);
create index integrity_events_student_idx on public.integrity_events (student_id);

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  answer_data jsonb,
  awarded_mark numeric(6, 2) not null,
  max_mark numeric(6, 2) not null,
  grading_method public.grading_method not null,
  feedback text,
  created_at timestamptz not null default now()
);
create index practice_attempts_student_idx on public.practice_attempts (student_id, created_at desc);

-- Learning-objective proficiency (the main unit of progress).
create table public.student_mastery (
  student_id uuid not null references public.profiles (id) on delete cascade,
  learning_objective_id uuid not null references public.learning_objectives (id) on delete cascade,
  practice_score numeric(5, 2),
  exam_score numeric(5, 2),
  mastery numeric(5, 2) not null default 0,
  practice_count int not null default 0,
  exam_count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (student_id, learning_objective_id)
);

-- ---------------------------------------------------------------------
-- Platform
-- ---------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('assignment', 'deadline', 'exam_available', 'result', 'feedback', 'system')),
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.bookmarks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  entity_type text not null check (entity_type in ('topic', 'theory_section', 'question')),
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, entity_type, entity_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

create table public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

insert into public.system_settings (key, value, description) values
  ('mastery', '{"practice_weight":0.3,"exam_weight":0.7,"recent_attempts":10,"recency_decay":0.85,"difficulty_weights":{"easy":0.8,"medium":1.0,"hard":1.2,"exam":1.3}}',
   'Weights used to compute learning-objective mastery'),
  ('mastery_bands', '[{"min":85,"label":"Mastered"},{"min":70,"label":"Secure"},{"min":50,"label":"Developing"},{"min":0,"label":"Learning"}]',
   'Progress status thresholds (percent). "Not Started" = no graded activity yet.'),
  ('ai_grading', '{"confidence_threshold":0.8,"max_retries":5}',
   'AI marking acceptance threshold and retry policy'),
  ('exam_defaults', '{"save_grace_seconds":30,"session_stale_seconds":45}',
   'Exam runtime tolerances');
