# Fase 6 — Autoridade temática, qualidade de referência e consolidação semântica

Data do diagnóstico: 2026-08-25 · escopo: as 170 URLs do sitemap curado
(produção, `https://tecnico.curitiba.br`). Nenhuma URL foi criada, removida ou
teve indexabilidade alterada nesta etapa.

## 1. O que foi instrumentado

| Comando | Papel |
| --- | --- |
| `npm run report:quality` | Auditoria de valor URL por URL: rubrica de 6 dimensões, score 0–100, faixa A–E, causas dominantes e similaridade intra-cluster por shingles. |
| `npm run check:local-page-quality` | Gate de risco doorway nas páginas locais, por sinais combinados (similaridade, texto exclusivo, utilidade, valor incremental) — nunca por contagem de palavras. |
| `npm run check:crawl-latency` | TTFB e tempo de resposta SSR das URLs ainda não indexadas, com limiar de 800 ms e 3 amostras por URL. |
| `npm run check:blog-internal-links` | Verificação contínua de links internos do acervo editorial contra rotas reais, com lista de correções antes do deploy. |
| `npm run report:consolidated` | Relatório final único (GSC + Bing + IndexNow + latência + qualidade + JSON-LD + smoke) e payload do painel diário. |
| `/admin/indexacao-diaria` | Painel interno com indexadas, descobertas, desconhecidas e métricas por cluster, dia a dia. |

## 2. Estado real de indexação

| Status | URLs | % |
| --- | --- | --- |
| Desconhecidas pelo Google | 85 | 50,0% |
| Descobertas sem indexar | 59 | 34,7% |
| Indexadas | 22 | 12,9% |
| Outros | 4 | 2,4% |

Por cluster, os dois maiores volumes são os que menos entram no índice:
`SERVICO_BAIRRO` (59 URLs, 3 indexadas) e `PROBLEMA` (36 URLs, 2 indexadas).
Os clusters com poucas URLs e conteúdo autoral são justamente os que já
produzem impressões: `CIDADE` (157), `SERVICO` (113) e `INSTITUCIONAL` (98).

## 3. Latência descartada como causa

144 URLs não indexadas medidas com 3 amostras cada: **TTFB p50 45 ms, p75 50 ms,
p95 64 ms, nenhuma falha de limiar (800 ms)**. Resposta do servidor não explica
o atraso de descoberta — o gargalo não é técnico de entrega.

## 4. Auditoria de valor (rubrica Fase 6)

| Faixa | Critério | URLs |
| --- | --- | --- |
| A — excelente | 85–100 | 22 |
| B — forte | 70–84 | 85 |
| C — aceitável | 55–69 | 42 |
| D — fraca | 40–54 | 21 |
| E — redundante | < 40 | 0 |

Causas dominantes: informação rasa, valor incremental baixo, evidência fraca e
**risco de doorway local**. Mediana por cluster: `SERVICO_BAIRRO` 53 é o pior do
site; `SERVICO` 83, `EQUIPAMENTO` 88 e `HUB` 81 são o topo.

## 5. O achado central, sem rodeio

Nas 96 páginas locais avaliadas, o gate de doorway aponta **42 em risco ALTO**.
Nas piores, a proporção de texto exclusivo em relação às páginas irmãs do mesmo
cluster fica entre **6% e 9%** — ou seja, a página existe, responde 200, tem
canonical correto e ainda assim é praticamente a mesma página com o nome do
bairro trocado. Exemplos medidos: `/servicos/remocao-virus/agua-verde`,
`/servicos/remocao-virus/alto-da-xv`, `/servicos/redes-wifi/portao`.

Isso reposiciona o diagnóstico das fases anteriores. O problema de 12,9% de
indexação não é só descoberta: metade do sitemap é composta por páginas que o
Google descobre e escolhe não indexar porque não há informação nova nelas.
Continuar empurrando sinais de descoberta (IndexNow, malha interna, lastmod) não
resolve o que falta, que é conteúdo próprio por página.

## 6. Consequência para a próxima rodada

1. Tratar `SERVICO_BAIRRO` como o cluster a resolver — reescrever com informação
   local verificável ou consolidar em menos URLs, sem quebrar caminho existente.
2. Usar a fila de otimização do painel (piores scores com impressão real) como
   ordem de trabalho, não a ordem alfabética do sitemap.
3. Manter `check:local-page-quality` em modo report com baseline registrado
   (ALTO = 42) e usar `--strict` no CI para impedir que o risco piore.

## 7. Pendência conhecida

`reports/blog-link-fixes.json` registra 28 links internos apontando para slugs
de blog não aprovados. Nenhum deles está em página servida hoje (todos vivem
dentro de artigos que respondem 404 real), então não há link quebrado para o
usuário — mas cada um vira defeito no dia em que o artigo dono for aprovado, e o
gate falha se isso acontecer sem correção.
