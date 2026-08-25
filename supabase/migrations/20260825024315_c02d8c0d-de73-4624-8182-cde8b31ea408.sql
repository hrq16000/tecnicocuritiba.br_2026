CREATE TABLE public.quick_wins_backlog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marco text NOT NULL DEFAULT 'D14',
  url_path text NOT NULL,
  cluster text,
  titulo text NOT NULL,
  hipotese text NOT NULL,
  evidencia text,
  acao text,
  prioridade integer NOT NULL DEFAULT 3,
  status text NOT NULL DEFAULT 'aberto',
  responsavel text,
  resultado text,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quick_wins_status_valido CHECK (status IN ('aberto','em_andamento','concluido','descartado')),
  CONSTRAINT quick_wins_prioridade_valida CHECK (prioridade BETWEEN 1 AND 5)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quick_wins_backlog TO authenticated;
GRANT ALL ON public.quick_wins_backlog TO service_role;

ALTER TABLE public.quick_wins_backlog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage quick wins backlog"
ON public.quick_wins_backlog
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER quick_wins_backlog_updated_at
BEFORE UPDATE ON public.quick_wins_backlog
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX quick_wins_backlog_status_idx ON public.quick_wins_backlog (status, prioridade);