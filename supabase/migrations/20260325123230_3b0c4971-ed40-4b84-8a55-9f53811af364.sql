CREATE TABLE public.guest_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pseudo TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  age INTEGER,
  sexe TEXT,
  style_anime TEXT,
  objectif_fitness TEXT,
  niveau_sportif TEXT,
  frequence_entrainement TEXT,
  motivation TEXT,
  adresse_rue TEXT,
  adresse_ville TEXT,
  adresse_code_postal TEXT,
  adresse_pays TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a response"
  ON public.guest_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read responses"
  ON public.guest_responses
  FOR SELECT
  TO authenticated
  USING (true);