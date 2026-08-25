CREATE TABLE public.os_publicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo text NOT NULL UNIQUE,
  tipo text NOT NULL CHECK (tipo IN ('visita','laboratorio')),
  nome text NOT NULL,
  local text,
  equipamento text NOT NULL,
  marca_modelo text,
  acessorios text,
  sintoma text NOT NULL,
  modalidade_id text NOT NULL,
  valor_label text NOT NULL,
  status text NOT NULL DEFAULT 'aberta',
  termos_versao text NOT NULL,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.os_publicas TO service_role;

ALTER TABLE public.os_publicas ENABLE ROW LEVEL SECURITY;

CREATE INDEX os_publicas_created_at_idx ON public.os_publicas (created_at DESC);
CREATE INDEX os_publicas_ip_hash_idx ON public.os_publicas (ip_hash, created_at DESC);