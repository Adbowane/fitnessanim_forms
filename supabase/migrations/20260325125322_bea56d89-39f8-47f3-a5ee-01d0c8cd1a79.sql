
ALTER TABLE public.guest_responses
  ALTER COLUMN pseudo SET DEFAULT 'Héros',
  ALTER COLUMN pseudo DROP NOT NULL,
  ALTER COLUMN age TYPE text USING age::text,
  ADD COLUMN IF NOT EXISTS avatar_motivation text,
  ADD COLUMN IF NOT EXISTS presentation_seances text,
  ADD COLUMN IF NOT EXISTS recompense_preferee text,
  ADD COLUMN IF NOT EXISTS personnalisation_avatar text,
  ADD COLUMN IF NOT EXISTS visualisation_stats text,
  ADD COLUMN IF NOT EXISTS ambiance_visuelle text,
  ADD COLUMN IF NOT EXISTS leaderboard text,
  ADD COLUMN IF NOT EXISTS creation_defis text;
