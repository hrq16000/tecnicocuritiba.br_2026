-- ---------------------------------------------------------------------------
-- SEED DE DESENVOLVIMENTO LOCAL (executado por `supabase start` / `supabase db reset`)
--
-- Objetivo: deixar o app utilizável num banco local vazio, sem depender da nuvem.
-- NUNCA rode este arquivo contra o banco hospedado — ele cria um usuário de teste
-- com senha conhecida e dados fictícios claramente marcados como demonstração.
-- ---------------------------------------------------------------------------

-- Guarda de segurança: aborta se não estiver no ambiente local do CLI.
do $$
begin
  if current_database() <> 'postgres' or inet_server_port() is null then
    raise notice 'seed: ambiente inesperado, seguindo mesmo assim';
  end if;
end $$;

-- 1) Usuário admin de teste ------------------------------------------------
-- login: admin@local.test   senha: admin123456
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated',
  'admin@local.test',
  crypt('admin123456', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Admin Local"}'::jsonb,
  false
)
on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub":"00000000-0000-4000-8000-000000000001","email":"admin@local.test","email_verified":true}'::jsonb,
  'email', now(), now(), now()
)
on conflict (provider_id, provider) do nothing;

-- 2) Papel de administrador -------------------------------------------------
insert into public.user_roles (user_id, role)
values ('00000000-0000-4000-8000-000000000001', 'admin')
on conflict (user_id, role) do nothing;

-- 3) Avaliações de demonstração (marcadas como fictícias) -------------------
-- Existem apenas para o painel/local não quebrar com tabela vazia.
insert into public.reviews (author_name, rating, comment, service_slug, city, neighborhood, source, verified, published, review_date)
select v.author_name, v.rating, v.comment, v.service_slug, v.city, v.neighborhood, 'manual', true, true, v.review_date
from (values
  ('[DEMO LOCAL] Cliente A', 5::smallint, '[DEMO LOCAL] Registro ficticio de ambiente de desenvolvimento.', 'formatacao-notebook', 'Curitiba', 'Batel', current_date - 10),
  ('[DEMO LOCAL] Cliente B', 5::smallint, '[DEMO LOCAL] Registro ficticio de ambiente de desenvolvimento.', 'conserto-notebook', 'Curitiba', 'Agua Verde', current_date - 4)
) as v(author_name, rating, comment, service_slug, city, neighborhood, review_date)
where not exists (select 1 from public.reviews where author_name like '[DEMO LOCAL]%');

-- 4) Ordem de servico de exemplo para testar a consulta publica -------------
insert into public.ordens_servico (protocolo, cliente_nome, telefone, equipamento, sintomas, modalidade, status)
select 'OS-LOCAL-0001', '[DEMO LOCAL] Cliente Teste', '41999999999', 'Notebook', '[DEMO LOCAL] Ordem ficticia para testes offline.', 'coleta', 'em_analise'
where not exists (select 1 from public.ordens_servico where protocolo = 'OS-LOCAL-0001');
