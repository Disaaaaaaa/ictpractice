-- =====================================================================
-- Database load: the site no longer uses Realtime (lessons and the exam
-- monitor poll small endpoints instead). Removing the tables from the
-- Realtime publication stops the database from decoding every change for it.
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['attempts', 'integrity_events', 'live_sessions', 'live_participants', 'live_answers'] loop
    if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime drop table public.%I', t);
    end if;
  end loop;
end $$;
