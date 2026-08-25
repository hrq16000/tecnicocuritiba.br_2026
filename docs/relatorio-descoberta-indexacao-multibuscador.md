# Missão — descoberta, crawling e indexação multi-buscador

Execução em 2026-08-25 · propriedade GSC `sc-domain:tecnico.curitiba.br` · sem criação de URLs, sem mudança de indexabilidade.

## 1. Contrato do sitemap (170 URLs) — CONFORME

Auditoria live de todas as URLs declaradas (`npm run report:indexation`):

| Item | Resultado |
| --- | --- |
| HTTP 200 | 170/170 |
| Redirect / 404 / 5xx | 0 |
| `noindex` | 0 |
| Canonical self-referente | 170/170 |
| H1 único | 170/170 |
| Duplicidade entre sub-sitemaps | 0 |

As 4 URLs que o GSC reporta como "Excluded by ‘noindex’ tag"
(`/bairros/bigorrilho`, `/bairros/cic`, `/blog`, `/tecnico-informatica-campo-magro`)
servem hoje `index, follow` em produção — confirmado no crawl desta rodada.
É estado histórico do índice (`GSC_STALE_STATE`), não defeito atual; a correção
possível é forçar recrawl, e as quatro entraram na submissão IndexNow.

## 2. Inventário mestre e tiers

`reports/indexation-inventory.json` traz, por URL: cluster, tier, HTTP, TTFB,
canonical, robots, inbound total e contextual, profundidade, lastmod, estado no
índice do Google, cliques/impressões/posição (90 dias).

| Tier | URLs | Critério |
| --- | --- | --- |
| A | 31 | core comercial, hubs e URLs com impressões reais |
| B | 69 | problemas, artigos, bairros, cidades de apoio |
| C | 58 | long tail serviço × bairro |
| D | 12 | institucional/auxiliar |

## 3. Estado real no índice

| Estado | URLs |
| --- | --- |
| UNKNOWN_TO_GOOGLE | 85 |
| DISCOVERED_NOT_INDEXED | 59 |
| INDEXED | 22 |
| Excluído por noindex histórico | 4 |

Diagnóstico: o gargalo é **descoberta**, não qualidade — 85 URLs nunca foram
vistas mesmo estando no sitemap, com malha interna sadia (0 órfãs,
profundidade média 1,99, nenhuma URL inalcançável pela home) e TTFB p75 de
55 ms. Sem sinal de crawl budget consumido por erro técnico.

## 4. IndexNow — submissão seletiva por mudança real

`scripts/indexnow-submit.mjs` substitui o ping cego do sitemap inteiro:

- valida a existência do key file `public/<KEY>.txt` antes de qualquer envio;
- calcula hash SHA1 apenas dos sinais de busca do HTML servido (title,
  description, canonical, robots, headings, texto do `<main>`), ignorando
  hashes de asset e mudanças de layout;
- persiste `reports/indexnow-manifest.json` e só envia URL nova ou alterada;
- nunca submete URL com HTTP ≠ 200 ou `noindex`.

Baseline desta rodada: **170 URLs aceitas (HTTP 202)**. Execução imediatamente
seguinte: 0 envios ("nada mudou"), comprovando ausência de ruído.

## 5. Desalinhamento de intenção B2B — corrigido

Evidência (90 dias): `/gestor-responsavel` — página institucional e fora do
sitemap — captava 6 consultas comerciais B2B em posições 27 a 68
("suporte técnico para empresas curitiba", "manutenção informática empresa
curitiba", "manutenção servidor empresa curitiba"), enquanto os donos reais da
intenção não recebiam essas impressões.

Correção aplicada em `src/pages/GestorResponsavel.tsx`: bloco explícito de
encaminhamento comercial com âncoras de intenção exata para
`/empresa-de-ti-curitiba` (indexada), `/servicos/suporte-tecnico-empresarial` e
`/servicos/manutencao-preventiva-empresas`. Nenhuma URL criada, nenhum redirect,
indexabilidade intacta.

## 6. Araucária vs Colombo — observação, sem mudança

Ambas captam consultas genéricas sem geo ("técnico computador",
"assistência técnica notebook"), mas em posições 4 a 12 — perfil de resultado
geo-personalizado, não perda por canibalização. Sem prejuízo mensurável, e a
política vigente exige evidência de dano antes de alterar página que já
converte impressão. Fica em monitoramento no relatório semanal.

## 7. Gates de CI adicionados

| Gate | Função |
| --- | --- |
| `check:indexability-contract` | URL no sitemap ⇒ 200 + canonical self + sem noindex + sem duplicidade (modos `dist` e `--live`) |
| `check:sitemap-lastmod` | rejeita formato inválido, data futura, carimbo em massa (> 60% na mesma data) e `new Date()` como origem de lastmod — roda no `prebuild` |

## 8. Comandos

```
npm run report:indexation          # inventário completo (crawl + GSC + inspeção)
npm run report:indexation:fast     # sem URL Inspection
npm run check:indexability-contract:live
npm run check:sitemap-lastmod
npm run indexnow:submit:dry
npm run indexnow:submit
```

Saídas: `reports/indexation-inventory.json`, `reports/indexation-master.md`,
`reports/google-indexation.md`, `reports/indexation-queue.json`,
`reports/indexnow-manifest.json`, `reports/indexnow-last-run.json`.
