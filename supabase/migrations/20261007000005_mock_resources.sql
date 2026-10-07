-- =====================================================================
-- Original past papers (question paper + mark scheme PDFs) attached to
-- mock exams for teachers. Files live in the private "papers" bucket;
-- the server hands staff short-lived signed URLs. Students never see them.
-- =====================================================================

alter table public.exams
  add column if not exists teacher_resources jsonb not null default '[]'::jsonb
    check (jsonb_typeof(teacher_resources) = 'array');

comment on column public.exams.teacher_resources is
  'Staff-only files: [{"label": "Question paper", "path": "2024/....pdf"}] in the private "papers" bucket';

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('papers', 'papers', false, 52428800, array['application/pdf'])
    on conflict (id) do nothing;
  end if;
end $$;
