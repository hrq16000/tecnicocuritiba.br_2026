ALTER TABLE public.ordens_servico
  ADD COLUMN IF NOT EXISTS numero_serie text,
  ADD COLUMN IF NOT EXISTS diagnostico text,
  ADD COLUMN IF NOT EXISTS servico_executado text,
  ADD COLUMN IF NOT EXISTS pecas jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS valor_servicos numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_pecas numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS desconto numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pagamento_status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS tecnico_responsavel text,
  ADD COLUMN IF NOT EXISTS aberta_em timestamp with time zone NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS concluida_em timestamp with time zone;

CREATE TABLE IF NOT EXISTS public.os_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordem_id uuid NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text NOT NULL,
  de_status text,
  para_status text,
  ator_id uuid REFERENCES auth.users(id),
  ator_email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.os_eventos TO authenticated;
GRANT ALL ON public.os_eventos TO service_role;
ALTER TABLE public.os_eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read os_eventos" ON public.os_eventos FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert os_eventos" ON public.os_eventos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.os_lembretes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordem_id uuid NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  quando timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  responsavel text,
  observacao text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_lembretes TO authenticated;
GRANT ALL ON public.os_lembretes TO service_role;
ALTER TABLE public.os_lembretes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage os_lembretes" ON public.os_lembretes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER os_lembretes_updated_at BEFORE UPDATE ON public.os_lembretes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.os_pdf_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordem_id uuid NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  versao integer NOT NULL,
  doc_hash text NOT NULL,
  generated_by uuid REFERENCES auth.users(id),
  generated_by_email text,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (ordem_id, versao)
);
GRANT SELECT, INSERT ON public.os_pdf_snapshots TO authenticated;
GRANT ALL ON public.os_pdf_snapshots TO service_role;
ALTER TABLE public.os_pdf_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read os_pdf_snapshots" ON public.os_pdf_snapshots FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert os_pdf_snapshots" ON public.os_pdf_snapshots FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS os_eventos_ordem_idx ON public.os_eventos (ordem_id, created_at DESC);
CREATE INDEX IF NOT EXISTS os_lembretes_ordem_idx ON public.os_lembretes (ordem_id, quando);
CREATE INDEX IF NOT EXISTS ordens_servico_status_idx ON public.ordens_servico (status, created_at DESC);