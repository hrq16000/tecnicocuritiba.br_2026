---
name: Análise D7/D14 e reindexação de snapshots
description: Fase de observação pós-consolidação — relatório analista somente-leitura, reindexação de memórias/snapshots e verificação por amostragem no painel.
type: feature
---

Fase de observação (pós-baseline D0, 130 URLs curadas): a regra padrão é NÃO alterar o site.
Medição e diagnóstico usam scripts somente-leitura; nenhuma rota, sitemap, canonical, redirect
ou disparo de IndexNow é feito para produzir relatório.

- `npm run report:monitoramento` → `docs/relatorio-monitoramento-d7-d14.md` + `public/monitoramento-analise.json`.
  Classifica cada URL Tier A não indexada em WAIT / DISCOVERY_PROBLEM / CRAWL_PROBLEM /
  QUALITY_REVIEW / CANONICAL_PROBLEM / TECHNICAL_PROBLEM / INTENT_PROBLEM, compara queries
  entre snapshots de marco e emite DECISÃO D7 (WAIT/INVESTIGATE/REGRESSION) e D14 (A/B/C/D).
  Quick wins só são abertos no D14 e no máximo 5.
- `npm run reindex:snapshots` (`:gate` = fail-closed) → indexa `.lovable/memory/**`, marcos,
  resumos, snapshots de SERP e de queries em `public/snapshot-index.json`; verifica contagem por
  marco, paridade `public` vs `reports`, amostragem re-hashada e cobertura de URLs do marco atual.
  Roda automaticamente ao final de `scripts/snapshot-marco.mjs`.
- Resultado da verificação aparece em `/admin/monitoramento` (seção "Reindexação de memórias e snapshots").
- Dado ausente é sempre "N/A"/"sem dado" — nunca estimativa.

## Instrumentação D7 (painel)

- `scripts/snapshot-marco.mjs` congela também `urls[]` (estado, cobertura GSC, canonical,
  lastCrawl, inbound, http/ttfb, impressões) por marco → base do drilldown e das transições.
  Marco antigo sem esse campo aparece como "sem dado" (D0 não tem).
- `npm run report:diff-marcos` (`:gate`) compara `serp-signals-<a/b>.json`:
  canonical/robots = severidade alta, title/H1/schema = média. D0×D7: 0 mudanças.
- `scripts/lib/job-log.mjs` grava toda execução em `reports/job-runs.json` + `public/job-runs.json`
  (duração, status, fail-closed, contagens, logs) — seção "Execução de jobs" do painel.
- Alertas ganharam agregação por CLUSTER (`quedaClusterPp: 5`, `quedaImpressoesPct: 30`) com link
  `/admin/monitoramento?cluster=<CLUSTER>`; o painel lê esse parâmetro e pré-filtra o drilldown.
- Backlog de quick wins persistido na tabela `quick_wins_backlog` (só admin): máx. 5 itens ativos
  e criação liberada apenas a partir do marco D14.

## Ferramental D14 (bloqueio, exportação, auditoria)

- `scripts/lib/marco-janela.mjs` valida janela temporal mínima (D7=7d, D14=14d desde D0) e o
  `snapshot-marco.mjs` é fail-closed: marco fora de janela não é registrado (`--fora-de-janela`
  só para teste, marca o registro como não comparável). D0 e D7 foram gravados no mesmo dia, então
  D14 legítimo só depois de 14 dias reais de D0.
- `scripts/notify-marco-decision.mjs` dispara webhook/e-mail em decisões INVESTIGATE/REGRESSION.
- `scripts/reindex-snapshots.mjs` tem modo de contenção (`--conter-auto` ou escopo manual por
  cluster/tier) para limitar a verificação de cobertura sem tocar no site.
- Painel `/admin/monitoramento`: `ExportarMarco` (CSV/PDF do marco com funil, clusters, tiers,
  transições, Tier A e alertas), `ComparacaoMarcos` (deltas D7×D14 por URL/cluster/Tier A) e
  `ChecklistAuditoria` no drilldown, persistido em `public.url_audit_checks` (só admin).
