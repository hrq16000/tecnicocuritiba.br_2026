CREATE TABLE public.bairro_photo_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bairro_slug text NOT NULL,
  route_path text NOT NULL,
  secao text NOT NULL,
  storage_path text NOT NULL,
  legenda text,
  observacoes text,
  aprovada boolean NOT NULL DEFAULT false,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bairro_photo_proofs_bairro_idx ON public.bairro_photo_proofs (bairro_slug, secao);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bairro_photo_proofs TO authenticated;
GRANT ALL ON public.bairro_photo_proofs TO service_role;

ALTER TABLE public.bairro_photo_proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam provas de bairro"
ON public.bairro_photo_proofs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins leem provas de bairro"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'provas-bairros' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins enviam provas de bairro"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'provas-bairros' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam provas de bairro"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'provas-bairros' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem provas de bairro"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'provas-bairros' AND public.has_role(auth.uid(), 'admin'));