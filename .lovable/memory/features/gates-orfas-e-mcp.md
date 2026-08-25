---
name: Gate de órfãs e autorização MCP
description: Baseline versionado do check:orphan-trend, rotas isentas e regras de OAuth/auditoria das ferramentas MCP
type: feature
---

## Gate `check:orphan-trend`
- Baseline canônico versionado: `scripts/data/orphan-baseline.json` (NUNCA em `reports/`, que é git-ignored).
- Cópia publicada no build: `public/orphan-baseline.json` (regravada pelo gate, paridade staging/produção).
- Scripts: `npm run check:orphan-trend`, `npm run check:orphan-baseline` (--assert-baseline), `npm run orphan:update`.
- `prebuild` roda `--assert-baseline` antes do gate; CI (`.github/workflows/security.yml`) repete os dois.
- `--update` só é legítimo ao remover URL curada, consolidar com 301 ou selar redução de órfãs. Órfã nova ⇒ criar link interno real, jamais reescrever baseline.
- Isentos por contrato: segmentos dinâmicos (`$param`), `/admin/*`, `/ordem-de-servico/*` e âncoras/modais.

## MCP
- Servidor MCP exige OAuth (issuer/JWKS do backend, audiência `authenticated`); sem token ⇒ 401. Nunca voltar a expor sem auth.
- Toda ferramenta MCP é read-only e emite log de auditoria de uma linha: `tool`, `route`, `owner` (hash curto FNV-1a, nunca em claro), `outcome`. Proibido logar PII, token, cabeçalhos ou payload.
- Testes: `src/lib/mcp/__tests__/mcp-auth-audit.test.ts` e `e2e/mcp-oauth.spec.ts` (token opcional via `MCP_TEST_ACCESS_TOKEN`).
