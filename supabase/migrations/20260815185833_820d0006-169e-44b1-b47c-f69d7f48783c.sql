-- 1. View pública de avaliações, sem qualquer coluna sensível (client_phone fora).
CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = off) AS
SELECT
  id,
  author_name,
  author_photo_url,
  rating,
  comment,
  service_slug,
  city,
  neighborhood,
  review_date,
  created_at
FROM public.reviews
WHERE verified = true AND published = true;

REVOKE ALL ON public.reviews_public FROM PUBLIC;
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT ALL ON public.reviews_public TO service_role;

-- 2. Leitura direta da tabela reviews passa a ser exclusiva de admin.
DROP POLICY IF EXISTS "Public can read verified published reviews" ON public.reviews;
REVOKE SELECT ON public.reviews FROM anon;
-- anon continua podendo enviar avaliações pendentes (policy já existente).
GRANT INSERT ON public.reviews TO anon;

-- 3. og_validation_status: sem acesso público.
REVOKE ALL ON public.og_validation_status FROM anon;
GRANT SELECT ON public.og_validation_status TO authenticated;
GRANT ALL ON public.og_validation_status TO service_role;