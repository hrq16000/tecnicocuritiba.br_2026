# Fase Final — Consolidação de qualidade, antidoorway e autoridade

Projeto: tecnico.curitiba.br · escopo: auditoria individual das 59 URLs do
cluster `SERVICO_BAIRRO`, consolidação por 301, piso de qualidade e governança.

## 1. Diagnóstico que motivou a fase

- Indexação real medida no Search Console: **22 de 170 URLs (12,9%)**.
- TTFB p95 de **64 ms** — latência e SSR descartados como causa.
- 42 das 96 páginas locais em risco doorway **ALTO**, com 6–9% de texto
  exclusivo dentro do próprio cluster.
- `SERVICO_BAIRRO`: score mediano 53 (o pior do site) e 3/59 indexadas.

Conclusão: o gargalo não era técnico nem de descoberta, e sim de **valor
incremental**. O Google encontrava as páginas locais e decidia não indexá-las.

## 2. Auditoria individual (59 URLs)

Rubrica aplicada por URL (`scripts/audit-servico-bairro.mjs`), combinando
indexação/impressões do GSC, exclusividade textual, similaridade com irmãs,
score de valor, links internos e existência de informação local verdadeira.

| Decisão | URLs |
| --- | --- |
| CONSOLIDATE | 40 |
| REVIEW | 15 |
| KEEP | 3 |
| IMPROVE | 1 |

KEEP: `/servicos/manutencao-tv/boa-vista`, `/servicos/redes-wifi/jardim-das-americas`,
`/servicos/upgrade-ssd-memoria/reboucas` — indexadas ou com demanda observada.

Evidência completa: `reports/servico-bairro-decisions.json` / `.md`.

## 3. Execução da consolidação

- Contrato gerado em `src/lib/consolidatedLocalUrls.ts` (+ espelho Node) como
  fonte única de verdade.
- 14 rotas estáticas de bairro (Wi-Fi/TV) convertidas em **301** via
  `beforeLoad` + `throw redirect`.
- Rota dinâmica `servicos.$servico.$cidade` redireciona 301 antes de renderizar
  qualquer combinação consolidada.
- `redirectMatrix.ts` recebeu o motivo `consolidacao-local` para as 40 rotas.
- `servicoBairroFactory.ts` exclui os caminhos consolidados dos indexáveis; se
  acessados fora do redirect, respondem `noindex`.
- Sitemaps, `localLinkMap.ts` e `llms.txt` regenerados: **0 referências** a URL
  consolidada.

## 4. Antes vs Depois

| Métrica | Antes | Depois |
| --- | --- | --- |
| URLs curadas no sitemap | 170 | **130** |
| URLs `SERVICO_BAIRRO` indexáveis | 59 | **19** |
| Páginas locais avaliadas | 96 | **56** |
| Risco doorway ALTO | **42** | **2** |
| Risco MÉDIO / BAIXO / OK | 16 / 32 / 6 | 16 / 32 / 6 |
| Links internos para redirect ou 404 | — | **0** |
| Taxa de indexação Tier A (compromisso) | — | **58,1% (18/31)** |

As 2 páginas que seguem em risco ALTO são justamente KEEP com demanda real
(`redes-wifi/jardim-das-americas`, `upgrade-ssd-memoria/reboucas`): entram na
fila de reescrita **IMPROVE**, não de consolidação.

## 5. Governança instalada

- **Piso de qualidade** documentado em `docs/QUALITY_STANDARD.md`
  (score ≥ 60, exclusividade ≥ 16%, similaridade ≤ 0,55, checklist de 10 pontos).
- `check:local-page-quality --gate` falha em três situações: regressão de página
  existente para ALTO, página local nova abaixo do piso e piora agregada do
  total ALTO. Baseline explícito por caminho, não só por contagem.
- `report:cluster-uniqueness` passa a listar os **trechos repetidos por cluster**
  com a ação de reescrita correspondente — alarme editorial, não paráfrase.
- Painel `/admin/indexacao-diaria` mostra taxa de indexação por Tier (com Tier A
  destacado como compromisso), distribuição de qualidade por faixa, score
  mediano, piso vigente e o efeito da consolidação.

## 6. Próximos 30 / 60 / 90 dias

**30 dias — consolidar o ganho**
Reescrever as 4 URLs IMPROVE/KEEP em risco; monitorar Tier A rumo a 90%;
acompanhar queda de "descobertas sem indexar" após os 301.

**60 dias — autoridade temática**
Aprofundar os pilares de serviço que receberam a consolidação, para que absorvam
a intenção local; decidir as 15 REVIEW com dado de impressões, não por palpite.

**90 dias — referência**
Só promover novas URLs locais que nasçam acima do piso, com informação local
verdadeira e prova visual própria. Quantidade de páginas deixa de ser meta.
