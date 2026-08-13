---
name: Governança de originalidade e ondas de publicação
description: Gate de originalidade (corpo mínimo + Jaccard), filtro do sitemap por aprovação e controle de ondas Wi-Fi/TV com prova visual
type: feature
---

## Originalidade (fail-closed antes de remover noindex)

- `scripts/check-originality.mjs` avalia TODA URL curada (`scripts/lib/curated-urls.mjs`).
- Modo padrão `--rendered`: sobe `scripts/serve-dist.mjs` e mede o `<main>` renderizado
  via Playwright. É o único modo que escreve `reports/content-approval.json`.
- Modo `--static`: mede só o HTML pré-renderizado (relatório aproximado, roda no postbuild).
- Mínimos por família: editorial e `/problemas/*` 800 palavras; bairro Wi-Fi/TV 600;
  serviço×bairro 500; serviço 600; local 450; institucional 250.
- Duplicidade por shingles de 5 palavras (Jaccard), teto por família: 0.35 editorial,
  0.40 problemas, 0.45 Wi-Fi/TV bairro, 0.50 serviços/local, 0.55 institucional.
- Comandos: `npm run check:originality` (gate), `check:originality:report`.
- Relatórios: `reports/originality.json` e `reports/content-approval.json`.

## Sitemap gated por aprovação

`scripts/generate-sitemaps.mjs` lê `reports/content-approval.json` e remove do XML
qualquer URL bloqueada — template só entra no índice depois de passar no check.
Sem relatório presente, o manifesto curado é emitido integralmente.

## Ondas de publicação (Wi-Fi / Smart TV por bairro)

- Fonte única: `scripts/lib/content-waves.mjs` (`WAVE_MIN=4`, `WAVE_MAX=6`,
  `MIN_PROVAS_POR_URL=2`), gate `scripts/check-wave-control.mjs` (`npm run check:waves`,
  também no prebuild).
- Cada onda: 4–6 URLs por semana; cada URL exige ≥2 fotos reais existentes em `public/`.
- Onda sem prova visual completa fica bloqueada e suas URLs não podem estar no sitemap.
- As 32 URLs Wi-Fi/TV liberadas antes do controle ficam em `LEGADO` (grandfathered).

## Brief obrigatório

`docs/template-brief-faq.md` — brief + FAQ único (≥5 perguntas exclusivas) obrigatório
antes de liberar qualquer nova URL indexável.
