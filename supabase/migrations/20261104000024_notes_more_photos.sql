-- Notes may have up to 20 photos (the site's limit); the table allows 40 so
-- that a continuation handed in later can be merged into the first hand-in.
alter table public.note_submissions drop constraint note_submissions_image_paths_check;
alter table public.note_submissions
  add constraint note_submissions_image_paths_check check (cardinality(image_paths) between 1 and 40);
