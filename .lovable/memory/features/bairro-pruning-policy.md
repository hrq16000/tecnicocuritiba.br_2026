---
name: Política de poda e liberação de bairros
description: Bairros-âncora indexáveis de Curitiba, critérios de promoção e regra de imagens
type: feature
---

## Bairros-âncora indexáveis (26, atualizado 2026-08-16)

cic, batel, agua-verde, centro, portao, bigorrilho, santa-felicidade, cabral,
cristo-rei, boa-vista, cajuru, boqueirao, **xaxim, novo-mundo, uberaba, reboucas**,
**hauer, pinheirinho, bacacheri, capao-raso**,
**sitio-cercado, fazendinha, campo-comprido, merces, juveve, seminario**.

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
- Gate de prova visual: `src/lib/bairroPhotos.ts` é a fonte única. Bairro sem foto
  real e fora de `BAIRROS_SEM_FOTO_APROVADOS` recebe `noindex` automático no build
  (`scripts/inject-route-head.mjs` + `PageSEO`). Nunca usar imagem gerada por IA.
- FAQPage SSR de todos os bairros vem de `scripts/curated-routes-meta.mjs` (campo `faq`).
- Promoção em ondas de 4–6 páginas; após promover, rodar
  `inject-route-head`, `generate-sitemaps`, `generate-local-linkmap`.

## Fila de Enriquecimento Agressivo (25/08/2026)

- Mapeamento oficial de cobertura (45 bairros de Curitiba em 7 regiões + 9
  municípios da RMC) vive em `src/lib/bairrosBaseline.ts` — fonte única do
  escopo geográfico exibido em `/areas-atendidas`.
- Toda página mapeada existe e navega, mas nasce `seoDepth: "baseline"` /
  `enrichmentStatus: "pending"` → `noindex` explícito no `head()` da rota e
  fora do sitemap. O teto de indexáveis **não muda** por criar página nova.
- Promoção baseline → curated exige narrativa exclusiva aprovada em
  `check:bairro-copy` + entrada em `bairroPhotos.ts`; nunca manual.
- Backlog operacional: `npm run report:fila-bairros` →
  `reports/fila-enriquecimento-bairros.md`.
- Gate de cobertura/vazamento: `src/__tests__/bairros-cobertura-oficial.test.ts`
  (rota existe, módulo carrega, nenhum baseline no sitemap).
