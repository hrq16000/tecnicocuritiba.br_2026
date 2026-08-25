CREATE TABLE public.url_audit_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_path text NOT NULL,
  marco text,
  item text NOT NULL,
  resultado text NOT NULL,
  observacao text,
  evidencia jsonb,
  conferido_por uuid REFERENCES auth.users,
  conferido_por_email text,
  conferido_em timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT url_audit_item_valido CHECK (item IN ('sitemap','canonical','redirect','http','schema','last_crawl')),
  CONSTRAINT url_audit_resultado_valido CHECK (resultado IN ('ok','falhou','na'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.url_audit_checks TO authenticated;
GRANT ALL ON public.url_audit_checks TO service_role;

ALTER TABLE public.url_audit_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage url audit checks"
ON public.url_audit_checks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX url_audit_checks_path_idx ON public.url_audit_checks (url_path, conferido_em DESC);