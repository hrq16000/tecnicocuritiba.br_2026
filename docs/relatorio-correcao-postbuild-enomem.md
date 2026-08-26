# Correção do ENOMEM no pós-build

## Erro

O pós-build falhava no comando `tsx scripts/dump-dynamic-slugs.ts dist/dynamic-slugs.json`, após os audits de SSR, sitemap e JSON-LD. O processo terminava com `uv_os_get_passwd returned ENOMEM`.

## Causa-raiz

O utilitário simples de inventário inicializava, via `tsx`, o grafo completo de módulos TypeScript do aplicativo. Em um ambiente com memória limitada, esse overhead adicional ocorria no fim de uma cadeia já pesada de validações.

Classificação: `PROCESS_OVERHEAD`, `LARGE_IMPORT_GRAPH` e `ENVIRONMENT_LIMIT`.

## Correção

Foi criado `scripts/dump-dynamic-slugs.mjs`, que lê somente os dois registries de origem (`brandsData.ts` e `problemaPagesData.ts`) e extrai os mesmos campos `slug` por expressão regular. O pós-build e o comando `routes:manifest` agora usam Node diretamente, eliminando o runtime `tsx` sem reduzir cobertura.

## Memória

- Antes: falha ENOMEM ao inicializar `tsx` no pós-build.
- Depois: nenhum aumento artificial de heap; 404 rotas dinâmicas geradas com 0 URLs omitidas.

## Validação

- Typecheck: PASS.
- 130 URLs curadas: PASS.
- Interlinking local: PASS.
- Gates de sitemap, SSR, JSON-LD, HTTP e grafo interno: PASS.
- Duas execuções completas consecutivas: PASS/PASS, sem ENOMEM.

## Public SEO diff

0. Nenhum conteúdo, metadata, schema, canonical, sitemap editorial, lastmod ou link interno foi alterado.

## IndexNow

0 enviados. Deploy operacional não gera submissão.

## Veredito

`POSTBUILD STABLE — SEO LIFECYCLE FULLY CLOSED`
