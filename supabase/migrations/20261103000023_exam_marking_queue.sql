-- Exam answers that need the AI are marked by the teacher in batches while
-- system_settings.exam_marking.mode = 'queue' (no AI call): the grader marks
-- them "needs review" at once, scripts/exam-queue.ts exports them and
-- scripts/exam-grade.ts writes the teacher's marks. 'ai' restores AI marking.
insert into public.system_settings (key, value, description)
values ('exam_marking', '{"mode": "queue"}', 'queue: written exam answers wait for the teacher''s check; ai: marked by the AI')
on conflict (key) do nothing;
