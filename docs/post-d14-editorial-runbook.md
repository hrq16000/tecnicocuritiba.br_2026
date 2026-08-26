# Runbook pós-D14 — promoção e medição

## Cenário A — indexação melhorou

Promover um pequeno lote de owners com maior valor, validar canonical/schema e medir D+7/D+14. Enviar somente URLs realmente alteradas.

## Cenário B — indexação continua fraca sem aumento de crawled-not-indexed

Priorizar descoberta, autoridade e interlinking contextual. Não voltar à produção em massa; comparar consultas e cobertura antes de nova alteração.

## Cenário C — crawled-not-indexed aumentou

Suspender expansão, revisar intenção, duplicação, qualidade e seleção de URLs. Consolidar ou manter staging antes de qualquer nova promoção.

## Política comum

IndexNow somente para URL alterada, hash diferente, resposta 200, canonical próprio e indexabilidade confirmada. Não solicitar indexação individual em massa.

## Sequência do canário EDITORIAL_CANARY_1

1. Confirmar decisão D14 e batch autorizado.
2. Fazer snapshot público pré-promoção.
3. Aplicar apenas os patches especificados para até cinco owners.
4. Rodar quality, revisão técnica, SSR/schema, grafo interno e build.
5. Validar o site ao vivo.
6. Atualizar `lastmod` somente nas URLs alteradas.
7. Enviar IndexNow somente para URLs alteradas.
8. Registrar `PROMO_D0` e medir `PROMO_D7`, `PROMO_D14` e `PROMO_D30`.

Rollback usa hash anterior, conteúdo anterior, patch e commit. Só ocorre por erro factual, regressão técnica, UX ou bug — não por flutuação isolada de ranking.

## Fail-closed pré-canário

O comando `npm run editorial:promote-canary -- --dry-run` apenas gera o preview. A promoção real deve recusar execução se D14 não estiver selado, se a autorização não for verdadeira, se faltar baseline GSC/Bing, houver patch/owner drift, falha técnica ou public drift prévio.
