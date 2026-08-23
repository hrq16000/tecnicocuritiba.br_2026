# Rodando o projeto 100% localmente (sem nuvem, sem internet)

Este guia deixa o site, o banco, o Auth, o Storage e as Edge Functions rodando
na sua máquina. Nenhuma chamada sai para IndexNow, Google Search Console,
Resend, Slack ou Cloudflare quando o modo local está ativo.

## 1. Pré-requisitos

- **Docker Desktop** (ou Docker Engine) em execução — o Supabase local sobe em containers.
- **Node 20+** e **Bun** (ou npm).
- **Supabase CLI**: `npm i -g supabase` ou `brew install supabase/tap/supabase`.

> As imagens Docker do Supabase precisam ser baixadas **uma vez** com internet.
> Depois disso o ambiente funciona offline.

## 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

`.env.local` tem prioridade sobre `.env` no Vite, então o app passa a usar
`http://127.0.0.1:54321` em vez do backend hospedado. A flag `LOCAL_DEV=1`
liga o modo offline dos scripts.

## 3. Subir o backend local

```bash
supabase start
```

Isso cria o banco a partir de `supabase/migrations/` (todas as tabelas, RLS e
policies atuais) e aplica `supabase/seed.sql`.

Serviços:

| Serviço | URL |
|---|---|
| API / PostgREST | http://127.0.0.1:54321 |
| Postgres | postgresql://postgres:postgres@127.0.0.1:54322/postgres |
| Studio | http://127.0.0.1:54323 |
| Caixa de e-mail (Inbucket) | http://127.0.0.1:54324 |

**Usuário admin de teste (somente local):** `admin@local.test` / `admin123456`.

## 4. Subir o frontend

```bash
npm run dev:local
```

O comando valida o isolamento do ambiente (`check-local-env`) e inicia o Vite
em http://127.0.0.1:8080.

## 5. Edge Functions locais

```bash
npm run functions:serve        # serve todas as funções em supabase/functions
npm run functions:serve:debug  # com inspector para breakpoints
```

## 6. Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run db:reset` | Recria o banco local do zero (migrations + seed) |
| `npm run db:diff -- nome_da_mudanca` | Gera uma nova migration a partir do estado local |
| `npm run supabase:start` / `supabase:stop` | Liga/desliga os containers |
| `npm run supabase:status` | Mostra portas e chaves locais |
| `npm run check:local-env` | Confirma que nada aponta para produção |

## 7. Modo offline dos scripts

Com `LOCAL_DEV=1` (ou `OFFLINE=1`), estes scripts não fazem rede e apenas
registram um sucesso simulado no console:

- `scripts/indexnow-ping.mjs`
- `scripts/request-indexing.mjs` (IndexNow + Google Indexing API)
- `scripts/monitor-index-alerts.mjs` (Search Console)
- `scripts/notify-seo-alerts.mjs` (Slack / Resend)
- `scripts/alert-sitemap-status.mjs` (Slack / Resend / PagerDuty)
- `scripts/alert-edge-errors.mjs` (Cloudflare / Slack / Resend)

A Edge Function `indexnow-ping` faz o mesmo: detecta o Supabase local e
responde `{ ok: true, mocked: true }` sem chamar a internet.

A lógica fica em `scripts/lib/local-mode.mjs` — reutilize `exitIfLocalMode()`
ou `mockExternal()` ao criar qualquer nova integração externa.

## 8. Problemas comuns

- **`supabase start` falha**: confirme que o Docker está rodando e que as portas
  54321–54324 estão livres.
- **App ainda fala com produção**: rode `npm run check:local-env`; provavelmente
  falta o `.env.local`.
- **Banco "sujo"**: `npm run db:reset` recria tudo a partir das migrations.
