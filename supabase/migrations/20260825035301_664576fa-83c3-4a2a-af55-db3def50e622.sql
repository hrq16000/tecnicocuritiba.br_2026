-- 1) Trilha imutável de classificação de alertas: append-only (sem edição/remoção)
ALTER TABLE public.alerta_classificacoes
  ADD COLUMN IF NOT EXISTS evidencia jsonb NOT NULL DEFAULT '{}'::jsonb;

DROP POLICY IF EXISTS "Admins manage alerta classificacoes" ON public.alerta_classificacoes;

CREATE POLICY "Admins leem classificacoes de alerta"
  ON public.alerta_classificacoes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins registram classificacoes de alerta"
  ON public.alerta_classificacoes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND classificado_por = auth.uid());

REVOKE UPDATE, DELETE ON public.alerta_classificacoes FROM authenticated;

-- 2) Solicitações de reindexação com escopo de contenção (auditoria append-only)
CREATE TABLE IF NOT EXISTS public.reindex_solicitacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marco text,
  escopo_tipo text NOT NULL CHECK (escopo_tipo IN ('cluster', 'url', 'tier', 'global')),
  escopo_valor text,
  modo_contencao boolean NOT NULL DEFAULT true,
  motivo text NOT NULL,
  comando text NOT NULL,
  status text NOT NULL DEFAULT 'solicitado',
  resultado jsonb NOT NULL DEFAULT '{}'::jsonb,
  solicitado_por uuid REFERENCES auth.users(id),
  solicitado_por_email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reindex_solicitacoes TO authenticated;
GRANT ALL ON public.reindex_solicitacoes TO service_role;

ALTER TABLE public.reindex_solicitacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem solicitacoes de reindex"
  ON public.reindex_solicitacoes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins registram solicitacoes de reindex"
  ON public.reindex_solicitacoes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND solicitado_por = auth.uid());