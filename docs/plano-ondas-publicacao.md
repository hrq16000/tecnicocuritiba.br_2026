# Plano de execução — publicação em ondas (indexação 100% com conteúdo original)

Objetivo: subir o portal inteiro para índice **somente com conteúdo autoral e
prova visual real**, em ondas de 4–6 URLs por semana, sem quebrar as regras
já firmadas (bairro-pruning, anti-canibalização, sem rating inventado).

## Painel de controle

- `npm run report:publish-status` → gera `public/publish-status.json`
- Painel interno: **/admin/publicacao** (noindex) com filtros por estado:
  `rascunho → em-prova → pronto → publicado / publicado-com-pendencia`
- Fontes consolidadas: `reports/originality.json`, `reports/real-images.json`,
  `reports/content-approval.json`, `scripts/lib/content-waves.mjs`

Estado atual (última execução): 161 URLs no sitemap, 130 marcadas
`publicado-com-pendencia` pelo relatório de originalidade em modo estático —
essas são a fila de reescrita autoral.

## Gates que bloqueiam a liberação (fail-closed)

| Gate | Comando | O que bloqueia |
| --- | --- | --- |
| Originalidade | `npm run check:originality` | corpo curto ou Jaccard acima do teto por família |
| Prova visual real | `node scripts/check-real-images.mjs` | menos de 2 fotos locais válidas, placeholder, foto reutilizada |
| Ondas | `npm run check:waves` | onda fora de 4–6 URLs ou sem prova declarada |
| Parceiros | `npm run check:parceiros` | rota de parceiro no sitemap sem prova aprovada |
| Interlinks | `node scripts/generate-interlinks.mjs` | âncoras repetidas / genéricas |

## Ritual semanal

1. **Segunda** — `npm run report:publish-status` e revisar `/admin/publicacao`.
2. **Segunda/terça** — escrever 4–6 briefs seguindo `docs/template-brief-faq.md`
   (≥800 palavras autorais + 5 FAQs exclusivas por URL).
3. **Quarta** — fotografar/catalogar ≥2 fotos reais por URL em `public/`
   (sem IA, sem banco de imagens) e declará-las na onda em
   `scripts/lib/content-waves.mjs`.
4. **Quinta** — `npm run build` (roda os gates) + `npm run check:originality`
   e `node scripts/check-real-images.mjs` no dist renderizado.
5. **Quinta** — mover as URLs aprovadas para `scripts/lib/curated-urls.mjs`
   (sitemap curado). O sitemap remove sozinho quem for bloqueado.
6. **Sexta** — publicar, ping IndexNow e `npm run report:index-alerts`.

## Fila de ondas

| Onda | Foco | Pré-requisito |
| --- | --- | --- |
| A | 4 bairros Wi-Fi/TV com narrativa exclusiva | fotos reais do atendimento no bairro |
| B | 4 páginas `/problemas` de alta intenção | fotos de bancada específicas do sintoma |
| C | 4–6 artigos editoriais do teto atual | revisão técnica + prova visual |
| D | Parceiros prestadores (1ª praça fora do PR) | 3 fotos + 2 casos + 5 FAQs do parceiro |

## Monitoramento pós-deploy

`npm run report:index-alerts` grava `reports/index-state.json` e alerta URLs
aprovadas há ≥7 dias sem indexação confirmada. Com `GSC_ACCESS_TOKEN` e
`GSC_SITE_URL` no ambiente usa a URL Inspection API; sem credenciais opera em
modo prazo e marca o status como `desconhecido` — nunca presume indexação.

## Limites honestos

- Não existe caminho legítimo para "primeira posição hoje": indexação e
  ranqueamento dependem de rastreio do Google. O que controlamos é qualidade,
  prova e velocidade de liberação.
- Nenhuma URL entra no sitemap sem corpo autoral + fotos reais. Preferimos
  menos URLs indexadas a conteúdo duplicado.
