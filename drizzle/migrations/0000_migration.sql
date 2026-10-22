CREATE TABLE public.interesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_id text NOT NULL CHECK (char_length(anuncio_id) BETWEEN 1 AND 80),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200 AND email LIKE '%@%'),
  mensagem text NOT NULL CHECK (char_length(mensagem) BETWEEN 1 AND 1000),
  origem text NOT NULL DEFAULT 'site' CHECK (origem IN ('site','site-pronto')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.interesses TO anon, authenticated;
GRANT ALL ON public.interesses TO service_role;
ALTER TABLE public.interesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer visitante pode enviar interesse" ON public.interesses FOR INSERT TO anon, authenticated WITH CHECK (true);