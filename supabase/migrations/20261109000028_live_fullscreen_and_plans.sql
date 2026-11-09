-- =====================================================================
-- Live lessons: full-screen tracking and downloadable lesson plans.
--
-- live_participants.fullscreen      — is the student's lesson page full screen now
-- live_participants.fullscreen_exits — how many times they left full screen
--                                      (browsers always allow leaving it, so the
--                                      teacher sees who did)
-- Storage bucket "lesson-plans" (private): the ҚМЖ .docx of each lesson,
-- uploaded by npm run kmzh:apply; teachers get a short-lived link.
-- =====================================================================
alter table public.live_participants
  add column fullscreen boolean not null default false,
  add column fullscreen_exits integer not null default 0;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('lesson-plans', 'lesson-plans', false, 5242880, array['application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
    on conflict (id) do nothing;
  end if;
end $$;
