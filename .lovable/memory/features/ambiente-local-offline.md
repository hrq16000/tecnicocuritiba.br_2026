---
name: Ambiente local offline
description: Como rodar o projeto 100% local (Supabase CLI + Docker) e o modo offline obrigatório para integrações externas
type: feature
---

O projeto deve continuar executável 100% localmente, sem nuvem e sem internet.

- `supabase/config.toml` tem a seção local (API 54321, DB 54322, Studio 54323, Inbucket 54324, edge_runtime) além do `project_id`.
- `supabase/seed.sql` cria o admin de teste `admin@local.test` / `admin123456` + dados marcados `[DEMO LOCAL]`. Nunca rodar contra o banco hospedado.
- `.env.example` → copiar para `.env.local` (tem prioridade no Vite). Contém as chaves padrão públicas do Supabase CLI e `LOCAL_DEV=1`.
- `scripts/lib/local-mode.mjs` é a guarda única: `isLocalMode()`, `mockExternal()`, `exitIfLocalMode()`. Ativa por `LOCAL_DEV`/`OFFLINE`/`MOCK_EXTERNAL` ou URL Supabase em 127.0.0.1.
- **Regra:** toda nova integração externa (IndexNow, GSC, Google Indexing, Resend, Slack, PagerDuty, Cloudflare) precisa passar por essa guarda e só logar sucesso simulado em modo local.
- Scripts npm: `dev:local`, `check:local-env`, `functions:serve`, `db:reset`, `db:diff`, `supabase:start/stop/status`.
- Guia: `LOCAL_SETUP.md`.
