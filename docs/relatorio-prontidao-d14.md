# Relatório de prontidão para o D14 — tecnico.curitiba.br

Gerado em 2026-08-25T04:03:17.533Z (UTC).

> Rodada de **congelamento operacional**: nenhuma página, metadado, canonical, sitemap,
> redirect, link interno ou disparo de IndexNow foi alterado para produzir este documento.
> O objetivo é provar prontidão do ferramental — não otimizar SEO.

## TEMPORAL GATE

D0 timestamp: 2026-08-25T01:49:17.273Z
D14 earliest: 2026-09-08T01:49:17.273Z
Current: 2026-08-25T04:03:17.533Z
Status: LOCKED
Tempo restante: 13.91 dia(s).

Fonte única de tempo: epoch UTC. Fuso do servidor, do navegador e do CI não participam do cálculo;
o boundary D14−1s (bloqueado) × D14 exato (liberado) é testado em `scripts/lib/marco-janela.test.mjs`.
Não existe bypass de produção: `--force`, `--skip-date` e `--ignore-window` são recusados, e
`--fora-de-janela` só funciona com `MARCO_FIXTURE=1` / `NODE_ENV=test`.

## SNAPSHOT INTEGRITY

| Marco | Snapshot id | Schema | Registrado em | Hash | Status |
| --- | --- | --- | --- | --- | --- |
| D0 | d0-9b34b1adf637 | marco/1.0-legado | 2026-08-25T01:49:17.273Z | `9b34b1adf6378ee2` | PASS |
| D7 | d7-7e3868c59acc | marco/1.0-legado | 2026-08-25T02:42:36.065Z | `7e3868c59acc38f9` | PASS |

D0: PASS
D7: PASS

Reprocessamento nunca sobrescreve em silêncio: o registro anterior é arquivado em
`reports/marco-reprocessamentos.json` com motivo, hash antigo e hash novo.

## PROVENANCE & FRESHNESS

| Métrica | Fonte | Estado | Coletado em | Idade (h) | Limite (h) |
| --- | --- | --- | --- | --- | --- |
| cobertura (indexed/unknown/discovered/crawled) | gsc | OBSERVED | 2026-08-25T02:38:54.070Z | 1.4 | 72 |
| http/canonical/noindex por URL | crawl | OBSERVED | 2026-08-25T02:38:54.071Z | 1.4 | 48 |
| URLs curadas no sitemap | sitemap | OBSERVED | 2026-08-25T01:36:05.217Z | 2.5 | 168 |
| inbound/profundidade | internal_graph | OBSERVED | 2026-08-25T01:36:05.140Z | 2.5 | 168 |
| submissões | indexnow | OBSERVED | 2026-08-25T01:36:20.032Z | 2.4 | 720 |
| cobertura Bing | bing | N/A | N/A | N/A | 168 |
| identidade de SERP | snapshot_local | OBSERVED | 2026-08-25T01:34:00.527Z | 2.5 | 168 |

Fontes atrasadas: nenhuma · sem dado: bing.
Atraso é declarado, nunca preenchido com estimativa.

## FUNNEL RECONCILIATION

D0: soma 130 × universo 130 → PASS
D7: soma 130 × universo 130 → PASS

## SEARCH WINDOWS

D0 × D7 — janela A 2026-07-28T01:49:17.273Z → 2026-08-25T01:49:17.273Z; janela B 2026-07-28T02:42:36.065Z → 2026-08-25T02:42:36.065Z; overlap 28d (100%); período exclusivo 0d.

## FIXTURES

| Cenário | Situação | Esperado | Obtido | Severidade | Resultado |
| --- | --- | --- | --- | --- | --- |
| A | 22 → 25 indexadas, funil andando | A | A | informativa | PASS |
| B | crawled-not-indexed 0 → 4 sem avanço | C | C | alta | PASS |
| C | Tier A 18/31 → 20/31 com quick wins reais | B | B | media | PASS |
| D | 3 URLs indexadas saem do índice | D | D | critica | PASS |
| E | canonical alterado em URLs curadas | D | D | critica | PASS |
| F | robots/noindex alterado | D | D | critica | PASS |
| G | cluster PROBLEMA começa a avançar | A | A | informativa | PASS |
| H | nenhuma mudança | C | C | alta | PASS |

WAIT: PASS
QUICK WINS: PASS
BOTTLENECK: PASS
REGRESSION: PASS

Fixtures vivem apenas em memória (`scripts/fixtures/marco-cenarios.mjs`); nenhuma delas é gravada
em `reports/`, `public/` ou no banco — o painel real não é contaminado.

## ALERTS

Deduplication: PASS
Severity: PASS

## CONTAINMENT

PASS

## ADMIN SECURITY

PASS

## EXPORTS

CSV: PASS
PDF: PASS

## PUBLIC SITE

SEO diff: PASS (0 esperado)
IndexNow: PASS (0 esperado)

## CHECKLIST DE PRONTIDÃO

- [x] Temporal gate — **PASS**
- [x] Timezone boundary — **PASS**
- [x] D0 immutable — **PASS**
- [x] D7 immutable — **PASS**
- [x] Provenance — **PASS**
- [x] Freshness checks — **PASS**
- [x] Funnel reconciliation — **PASS**
- [x] Fixture A — **PASS**
- [x] Fixture B — **PASS**
- [x] Fixture C — **PASS**
- [x] Fixture D — **PASS**
- [x] Alert deduplication — **PASS**
- [x] Containment — **PASS**
- [x] Admin authorization — **PASS**
- [x] CSV — **PASS**
- [x] PDF — **PASS**
- [x] Idempotency — **PASS**
- [x] IndexNow = 0 — **PASS**
- [x] Public SEO diff = 0 — **PASS**

## DETALHE DAS CHECAGENS

| Seção | Item | Status | Detalhe |
| --- | --- | --- | --- |
| TEMPORAL GATE | janela avaliada em UTC com fonte única | PASS | D0 2026-08-25T01:49:17.273Z · agora 2026-08-25T04:03:17.533Z · elegível 2026-09-08T01:49:17.273Z · status LOCKED |
| TEMPORAL GATE | coleta antecipada de D14 falha fechada | PASS | exit 2 |
| TEMPORAL GATE | bloqueio informa marco, D0, agora, mínimo e restante | PASS | mensagem de bloqueio auditada |
| TEMPORAL GATE | bypass --force recusado | PASS | exit 2 |
| TEMPORAL GATE | bypass --skip-date recusado | PASS | exit 2 |
| TEMPORAL GATE | bypass --ignore-window recusado | PASS | exit 2 |
| TEMPORAL GATE | --fora-de-janela recusado fora de fixture | PASS | exit 2 |
| TEMPORAL GATE | boundary D14−1s bloqueado / D14 exato liberado | PASS | node --test exit 0 |
| SNAPSHOT INTEGRITY | D0 imutável | PASS | hash 9b34b1adf637 confere com o selo |
| SNAPSHOT INTEGRITY | D7 imutável | PASS | hash 7e3868c59acc confere com o selo |
| SNAPSHOT INTEGRITY | reprocessamento gera trilha e preserva o original | PASS | nenhum reprocessamento até agora |
| PROVENANCE | toda métrica declara origem e estado | PASS | 7 fonte(s) declaradas · observado × derivado nunca misturados |
| FRESHNESS | atraso identificado explicitamente (sem inventar atualização) | PASS | atrasadas: nenhuma · sem dado: bing |
| FUNNEL | D0 reconcilia com o universo curado | PASS | 130/130 |
| FUNNEL | D7 reconcilia com o universo curado | PASS | 130/130 |
| SEARCH WINDOWS | overlap entre janelas de 28d explicitado | PASS | D0×D7 overlap 28d (100%) · exclusivo 0d |
| FIXTURES | cenário A — 22 → 25 indexadas, funil andando | PASS | esperado A · obtido A |
| FIXTURES | cenário B — crawled-not-indexed 0 → 4 sem avanço | PASS | esperado C · obtido C |
| FIXTURES | cenário C — Tier A 18/31 → 20/31 com quick wins reais | PASS | esperado B · obtido B |
| FIXTURES | cenário D — 3 URLs indexadas saem do índice | PASS | esperado D · obtido D |
| FIXTURES | cenário E — canonical alterado em URLs curadas | PASS | esperado D · obtido D |
| FIXTURES | cenário F — robots/noindex alterado | PASS | esperado D · obtido D |
| FIXTURES | cenário G — cluster PROBLEMA começa a avançar | PASS | esperado A · obtido A |
| FIXTURES | cenário H — nenhuma mudança | PASS | esperado C · obtido C |
| DECISOES | decisão A reproduzida | PASS | cenário A → A (CONTINUE WAITING) |
| DECISOES | decisão B reproduzida | PASS | cenário C → B (PREPARE QUICK WINS) |
| DECISOES | decisão C reproduzida | PASS | cenário H → C (INVESTIGATE INDEXATION BOTTLENECK) |
| DECISOES | decisão D reproduzida | PASS | cenário D → D (FIX TECHNICAL REGRESSION) |
| DECISOES | quick wins limitados a 5 e sem execução automática | PASS | 4 quick win(s) propostos |
| ALERTS | deduplicação por marco+regra+alvo | PASS | mesma assinatura não reenvia; alvo diferente reenvia |
| ALERTS | WAIT não dispara alerta crítico | PASS | somente INVESTIGATE/REGRESSION notificam |
| ALERTS | severidade cresce de INVESTIGATE para REGRESSION | PASS | C=alta · D=crítica |
| ALERTS | estado de notificação persistido (antirruído) | PASS | assinatura anterior comparada antes de reenviar |
| CONTAINMENT | evidência anterior preservada durante reindexação | PASS | marcos não foram reescritos pelo job de índice |
| CONTAINMENT | verificação registra causa e status | PASS | status ok · exit 0 |
| CONTAINMENT | contenção limita escopo sem afrouxar hash/paridade | PASS | contagem, paridade e hashes seguem integrais |
| ADMIN SECURITY | /admin/monitoramento exige sessão admin | PASS | gate de papel admin no componente |
| ADMIN SECURITY | rota interna marcada noindex | PASS | sem exposição a buscadores |
| ADMIN SECURITY | payloads públicos sem token/webhook/segredo | PASS | 4 arquivo(s) auditados |
| EXPORTS | CSV declara marco, timestamp e filtros | PASS | cabeçalho do CSV auditado |
| EXPORTS | CSV em UTF-8 (BOM) e separador estável | PASS | encoding declarado no blob |
| EXPORTS | sem coluna administrativa sensível | PASS | nenhuma coluna de credencial exportada |
| EXPORTS | PDF é relatório estruturado, não captura de tela | PASS | documento gerado por composição textual (título, seções, tabelas), sem screenshot do dashboard |
| IDEMPOTENCY | mesma entrada produz mesma decisão | PASS | duas execuções idênticas |
| IDEMPOTENCY | timestamp técnico não altera interpretação | PASS | hash ignora campos voláteis |
| PUBLIC SITE | IndexNow não submeteu URL nesta rodada | PASS | última execução 2026-08-25T01:36:20.032Z (dry-run) · submitted 0 · accepted 0 |
| PUBLIC SITE | diff de SEO público = 0 | PASS | nenhuma rota, sitemap, robots ou conteúdo alterado |
| PUBLIC SITE | lastmod não tocado por coleta/relatório | PASS | sitemap intocado |

## DECISÃO

**READY — AGUARDAR D14 REAL**

Ferramental pronto. A próxima ação só ocorre quando o temporal gate liberar o D14 verdadeiro; nenhuma otimização de SEO deve ser iniciada até lá.

Evidências no painel: [visão do marco](/admin/monitoramento) · [drilldown por URL](/admin/monitoramento#drilldown) · [comparação entre marcos](/admin/monitoramento#comparacao) · [execução de jobs](/admin/monitoramento#jobs) · [alertas classificados](/admin/monitoramento#alertas) · [reindexação contida](/admin/monitoramento#reindex).

