CREATE TABLE public.bairro_enriquecimento (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  regiao text,
  enrichment_status text NOT NULL DEFAULT 'pending' CHECK (enrichment_status IN ('pending','ready')),
  notas text,
  conteudo_gerado jsonb NOT NULL DEFAULT '{}'::jsonb,
  originalidade numeric,
  palavras integer,
  double_opt_in boolean NOT NULL DEFAULT false,
  decidido_por uuid REFERENCES auth.users(id),
  decidido_por_email text,
  decidido_em timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bairro_enriquecimento TO authenticated;
GRANT ALL ON public.bairro_enriquecimento TO service_role;

ALTER TABLE public.bairro_enriquecimento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins gerenciam enriquecimento de bairros"
ON public.bairro_enriquecimento FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER bairro_enriquecimento_updated_at
BEFORE UPDATE ON public.bairro_enriquecimento
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();