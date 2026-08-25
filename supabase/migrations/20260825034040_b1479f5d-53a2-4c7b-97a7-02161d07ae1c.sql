CREATE TABLE public.experimentos_indexacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marco text NOT NULL DEFAULT 'D14',
  titulo text NOT NULL,
  hipotese text NOT NULL,
  mudanca_unica text NOT NULL,
  metrica_sucesso text NOT NULL,
  criterio_sucesso text,
  grupo_teste jsonb NOT NULL DEFAULT '[]'::jsonb,
  grupo_controle jsonb NOT NULL DEFAULT '[]'::jsonb,
  cluster text,
  status text NOT NULL DEFAULT 'planejado',
  iniciado_em timestamptz,
  encerrado_em timestamptz,
  resultado text,
  conclusao text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experimentos_indexacao TO authenticated;
GRANT ALL ON public.experimentos_indexacao TO service_role;
ALTER TABLE public.experimentos_indexacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage experimentos" ON public.experimentos_indexacao FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER experimentos_indexacao_updated_at BEFORE UPDATE ON public.experimentos_indexacao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.alerta_classificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alerta_id text NOT NULL,
  assinatura text,
  marco text,
  cluster text,
  url_path text,
  severidade text,
  mensagem text,
  classificacao text NOT NULL,
  justificativa text NOT NULL,
  classificado_por uuid REFERENCES auth.users(id),
  classificado_por_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerta_classificacoes TO authenticated;
GRANT ALL ON public.alerta_classificacoes TO service_role;
ALTER TABLE public.alerta_classificacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage alerta classificacoes" ON public.alerta_classificacoes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));