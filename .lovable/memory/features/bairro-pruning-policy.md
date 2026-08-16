---
name: Política de poda e liberação de bairros
description: Bairros-âncora indexáveis de Curitiba, critérios de promoção e regra de imagens
type: feature
---

## Bairros-âncora indexáveis (16, atualizado 2026-08-16)

cic, batel, agua-verde, centro, portao, bigorrilho, santa-felicidade, cabral,
cristo-rei, boa-vista, cajuru, boqueirao, **xaxim, novo-mundo, uberaba, reboucas**.

Todos usam `BairroLocalLayout` + entrada curada em `src/lib/bairrosData.ts`
(introdução local, operação, atendimento, coleta/bancada, FAQ exclusiva).

## Regras

- Bairro só entra em `scripts/lib/curated-urls.mjs` (sitemap) depois de passar em
  `check:bairro-copy` (Jaccard ≤ 0.55 e narrativa própria).
- Demais bairros de `src/pages/bairros/*` seguem `BairroTemplate` e permanecem
  noindex/fora do sitemap até receberem narrativa exclusiva.
- **Imagens reais não são pré-requisito para indexar bairro** (autorizado pelo
  usuário em 2026-08-16); o gate `check:real-images` continua valendo para as
  demais famílias sensíveis (Wi-Fi/TV, /problemas).
- Promoção em ondas de 4–6 páginas; após promover, rodar
  `inject-route-head`, `generate-sitemaps`, `generate-local-linkmap`.
