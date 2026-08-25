# Relatório de monitoramento — marco D14

Gerado em 2026-08-25T03:44:40.972Z · projeto tecnico.curitiba.br.
Registro do marco: N/A · commit `N/A` · denominador N/A URLs curadas.

> Documento de **medição**. Nenhuma rota, sitemap, canonical, redirect, conteúdo ou disparo
> de IndexNow foi alterado para produzi-lo. Dado ausente aparece como `N/A` — nunca estimativa.

## 1. Sumário executivo

- Decisão do marco: **PENDENTE** — Marco D14 ainda não registrado.
- Indexadas: N/A de N/A (Δ vs D7: N/A)
- Tier A: N/A (Δ vs D0: N/A)
- Search performance 28d: N/A impressões · N/A cliques · CTR N/A · posição média N/A
- Alertas ativos: 0 · assinatura `97d170e1550e`
- Janela temporal do marco: válida.

Evidências no painel: [visão do marco](/admin/monitoramento) · [drilldown por URL](/admin/monitoramento#drilldown) · [comparação entre marcos](/admin/monitoramento#comparacao) · [tendências](/admin/monitoramento#tendencias) · [execução de jobs](/admin/monitoramento#jobs) · [alertas classificados](/admin/monitoramento#alertas).

## 2. Funil de indexação

| Marco | Funil | Impressões 28d | Cliques 28d |
| --- | --- | --- | --- |
| D0 | unknown 56 · discovered 48 · crawled-not-indexed 0 · indexed 22 | 473 | 6 |
| D7 | unknown 57 · discovered 47 · crawled-not-indexed 0 · indexed 22 | 473 | 6 |
| D14 | N/A — marco não registrado | N/A | N/A |
| D30 | N/A — marco não registrado | N/A | N/A |

Δ D7 → D14: indexed N/A · unknown N/A · discovered N/A · crawled-not-indexed N/A.

## 3. Tiers

| Tier | Total | Indexadas | Taxa | Impressões | Cliques |
| --- | --- | --- | --- | --- | --- |
| N/A | | | | | |

## 4. Clusters

| Cluster | Total | Indexadas | Unknown | Discovered | Crawled n/i | Taxa | Impressões | Cliques |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N/A | | | | | | | | |

Drilldown por cluster: [abrir no painel](/admin/monitoramento?cluster=SERVICO#drilldown) (troque o parâmetro `cluster`).

## 5. Tier A não indexadas — diagnóstico individual

| URL | Cluster | Estado | Último crawl | Inbound | Prof. | Quality | Impr. | Classificação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /areas-atendidas | HUB | unknown | N/A | 129 | 1 | N/A | 0 | WAIT |
| /blog | BLOG_HUB | unknown | 2026-07-25T12:07:58Z | 3 | 1 | N/A | 0 | WAIT |
| /como-funciona | INSTITUCIONAL | discovered | N/A | 129 | 1 | N/A | 0 | CRAWL_PROBLEM |
| /contato | INSTITUCIONAL | discovered | N/A | 129 | 1 | N/A | 0 | CRAWL_PROBLEM |
| /problemas | HUB | unknown | N/A | 129 | 1 | N/A | 0 | WAIT |
| /servicos/backup-para-empresas | SERVICO | discovered | N/A | 9 | 2 | N/A | 0 | CRAWL_PROBLEM |
| /servicos/manutencao-de-computador | SERVICO | discovered | N/A | 69 | 1 | N/A | 0 | CRAWL_PROBLEM |
| /servicos/manutencao-de-notebook | SERVICO | unknown | N/A | 129 | 1 | N/A | 0 | WAIT |
| /servicos/manutencao-preventiva-empresas | SERVICO | unknown | N/A | 6 | 2 | N/A | 0 | WAIT |
| /servicos/montagem-de-pc | SERVICO | unknown | N/A | 9 | 2 | N/A | 0 | WAIT |
| /servicos/redes-e-wifi | SERVICO | unknown | N/A | 129 | 1 | N/A | 0 | WAIT |
| /servicos/remocao-de-virus | SERVICO | unknown | N/A | 129 | 1 | N/A | 0 | WAIT |
| /servicos/suporte-tecnico-empresarial | SERVICO | unknown | N/A | 129 | 1 | N/A | 0 | WAIT |

## 6. Identidade de SERP (diff entre marcos)

Comparação D0 × D7: 0 mudança(s) — alta 0, média 0. Detalhe: [diff no painel](/admin/monitoramento#diff).

## 7. Quick wins elegíveis

Nenhum quick win elegível (limite de governança: 5 ativos, liberados a partir de D14).

Backlog gerenciável: [quick wins no painel](/admin/monitoramento#quick-wins).

## 8. Consultas (top 15 por impressões)

N/A — sem snapshot de queries para este marco.

## 9. Saúde técnica e governança

- Grafo interno: N/A URLs · órfãs N/A · links para consolidadas N/A
- Doorway (risco alto): N/A
- Consolidação 301: N/A/N/A ok · falhas N/A
- IndexNow: N/A enviadas em N/A
- Reindexação de snapshots: ok · 15 artefatos · amostragem 5
- Jobs registrados: 4 — [ver execuções](/admin/monitoramento#jobs)

## 10. Alertas

Nenhum alerta ativo — operação dentro dos limiares.

Classificação de cada alerta como verdadeiro ou falso positivo (com justificativa e cluster/URL afetado): [painel de alertas](/admin/monitoramento#alertas).

## 11. Decisão e próximo passo

Decisão registrada: **PENDENTE**.

- **A / WAIT** — não alterar o site; próxima leitura no marco seguinte.
- **B / QUICK WINS** — abrir no máximo 5 itens no backlog, um por URL.
- **C / INVESTIGATE** — planejar experimento controlado (test group × control group, mudança única, métrica de sucesso): [tela de experimentos](/admin/monitoramento#experimentos).
- **D / REGRESSION** — correção técnica mínima autorizada, registrada como job.

Próximo marco: D30 — coleta agendada com o mesmo fail-closed de janela temporal.

