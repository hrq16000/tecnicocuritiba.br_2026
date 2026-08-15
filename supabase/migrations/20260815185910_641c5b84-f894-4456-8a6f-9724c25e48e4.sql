-- View com permissões do chamador (sem SECURITY DEFINER).
DROP VIEW IF EXISTS public.reviews_public;
CREATE VIEW public.reviews_public
WITH (security_invoker = on) AS
SELECT
  id, author_name, author_photo_url, rating, comment,
  service_slug, city, neighborhood, review_date, created_at
FROM public.reviews
WHERE verified = true AND published = true;

REVOKE ALL ON public.reviews_public FROM PUBLIC;
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT ALL ON public.reviews_public TO service_role;

-- Policy pública restrita (linhas) + GRANT por coluna (colunas).
-- Assim `select=*` em reviews falha para anon, mas a view continua funcionando.
DROP POLICY IF EXISTS "Public can read verified published reviews" ON public.reviews;
CREATE POLICY "Public can read verified published reviews"
  ON public.reviews FOR SELECT TO anon
  USING (verified = true AND published = true);

REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, author_name, author_photo_url, rating, comment,
              service_slug, city, neighborhood, review_date, created_at,
              verified, published)
  ON public.reviews TO anon;