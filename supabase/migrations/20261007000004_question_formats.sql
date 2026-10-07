-- =====================================================================
-- Exam-style question formats (see docs/EXAM_FORMATS.md)
--
-- * Structured questions: a "structured" parent holds the shared stem
--   (scenario, figure, table, code); its parts are ordinary questions with
--   parent_id + part_label ("(a)", "(b)(i)"). Parts are answered and marked
--   individually; publishing an exam expands a parent into its parts.
-- * New answer formats: labelled answer boxes, table completion, Boolean
--   expressions, and diagrams (logic circuits, flowcharts, DFDs, ERDs,
--   binary trees).
-- * Public "media" storage bucket for figures in questions and theory.
-- =====================================================================

alter type public.question_type add value if not exists 'structured';
alter type public.question_type add value if not exists 'labelled_answers';
alter type public.question_type add value if not exists 'table_completion';
alter type public.question_type add value if not exists 'boolean_expression';
alter type public.question_type add value if not exists 'logic_circuit';
alter type public.question_type add value if not exists 'flowchart';
alter type public.question_type add value if not exists 'dfd';
alter type public.question_type add value if not exists 'erd';
alter type public.question_type add value if not exists 'binary_tree';

alter table public.questions
  add column if not exists parent_id uuid references public.questions (id) on delete cascade,
  add column if not exists part_label text,
  add column if not exists part_order int not null default 0;
alter table public.questions drop constraint if exists questions_parent_not_self;
alter table public.questions add constraint questions_parent_not_self check (parent_id is null or parent_id <> id);
create index if not exists questions_parent_idx on public.questions (parent_id, part_order) where parent_id is not null;

-- ---------------------------------------------------------------------
-- publish_exam: expand structured questions into their parts
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
  v_empty int;
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

  -- Answerable items in paper order: standalone questions, and the parts of structured ones.
  create temporary table _items on commit drop as
  with ordered as (
    select eq.question_id, eq.marks_override, eq.section_label,
           row_number() over (order by eq.sort_order, eq.id) as gn
      from public.exam_questions eq
     where eq.exam_id = p_exam_id
  ),
  expanded as (
    select o.gn, 0 as po, q.id as qid, null::uuid as group_id, o.marks_override, o.section_label
      from ordered o join public.questions q on q.id = o.question_id
     where q.question_type::text <> 'structured'
    union all
    select o.gn, c.part_order, c.id, p.id, null::int, o.section_label
      from ordered o
      join public.questions p on p.id = o.question_id and p.question_type::text = 'structured'
      join public.questions c on c.parent_id = p.id and c.archived_at is null
  )
  select e.*, row_number() over (order by e.gn, e.po, e.qid) as n from expanded e;

  select count(*), coalesce(sum(coalesce(i.marks_override, q.marks)), 0),
         count(*) filter (where q.status <> 'published' or q.archived_at is not null),
         count(*) filter (where ms.id is null)
    into v_count, v_total, v_unpublished, v_no_scheme
    from _items i
    join public.questions q on q.id = i.qid
    left join public.mark_schemes ms on ms.question_id = q.id and ms.is_current;

  -- structured parents must be published too, and must have at least one part
  select v_unpublished + count(*) filter (where p.status <> 'published' or p.archived_at is not null),
         count(*) filter (where not exists (select 1 from public.questions c where c.parent_id = p.id and c.archived_at is null))
    into v_unpublished, v_empty
    from public.exam_questions eq
    join public.questions p on p.id = eq.question_id and p.question_type::text = 'structured'
   where eq.exam_id = p_exam_id;

  if v_count = 0 then
    raise exception 'EXAM_HAS_NO_QUESTIONS' using errcode = 'P0001';
  end if;
  if v_empty > 0 then
    raise exception 'EXAM_HAS_EMPTY_STRUCTURED_QUESTION: %', v_empty using errcode = 'P0001';
  end if;
  if v_unpublished > 0 then
    raise exception 'EXAM_HAS_UNPUBLISHED_QUESTIONS: %', v_unpublished using errcode = 'P0001';
  end if;
  if v_no_scheme > 0 then
    raise exception 'EXAM_HAS_QUESTIONS_WITHOUT_MARK_SCHEME: %', v_no_scheme using errcode = 'P0001';
  end if;

  select
    jsonb_build_object(
      'exam', jsonb_build_object(
        'id', v_exam.id, 'title', v_exam.title, 'kind', v_exam.kind,
        'instructions', v_exam.instructions, 'year', v_exam.year
      ),
      'questions', jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'number', i.n,
          'label', i.gn::text || coalesce(q.part_label, ''),
          'title', q.title,
          'question_text', q.question_text,
          'question_type', q.question_type,
          'marks', coalesce(i.marks_override, q.marks),
          'command_word', q.command_word,
          'difficulty', q.difficulty,
          'content', q.content - 'hint',               -- no hints in exam mode
          'section_label', i.section_label,
          'topic_id', coalesce(q.topic_id, g.topic_id),
          'topic_title', coalesce(t.title, gt.title),
          'group_id', i.group_id,
          'group_number', i.gn,
          'group_title', g.title,
          'group_stem', g.question_text,
          'part_label', q.part_label,
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
        ) order by i.n
      )
    ),
    jsonb_object_agg(
      q.id::text,
      jsonb_build_object(
        'question_type', q.question_type,
        'grading_method', q.grading_method,
        'marks', coalesce(i.marks_override, q.marks),
        'question_marks', q.marks,
        'command_word', q.command_word,
        'mark_scheme_version', ms.version,
        'mark_scheme', ms.mark_scheme,
        'marking_points', ms.marking_points,
        'model_answer', ms.model_answer,
        'accepted_answers', ms.accepted_answers,
        'ai_grading_instructions', ms.ai_grading_instructions,
        'explanation', ms.explanation,
        'group_stem', g.question_text
      )
    )
    into v_paper, v_marking
    from _items i
    join public.questions q on q.id = i.qid
    left join public.questions g on g.id = i.group_id
    left join public.topics t on t.id = q.topic_id
    left join public.topics gt on gt.id = g.topic_id
    join public.mark_schemes ms on ms.question_id = q.id and ms.is_current;

  drop table if exists _items;

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

revoke execute on function public.publish_exam(uuid) from public, anon;
grant execute on function public.publish_exam(uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Media bucket for figures (uploads go through a server action that
-- checks the user is staff; public read so images load in exams).
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage')
     and exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
    on conflict (id) do nothing;
  end if;
end $$;
