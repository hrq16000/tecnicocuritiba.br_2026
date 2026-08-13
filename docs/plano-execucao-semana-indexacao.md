# Plano de execução — semana de indexação (publicação em ondas)

Gerado a partir de `public/publish-status.json` (161 URLs curadas) e dos gates
fail-closed já ativos: originalidade (Jaccard + corpo mínimo), prova visual real
(≥2 fotos locais, sem IA), controle de ondas (4–6 URLs/semana) e liberação em
lote (`npm run onda:aprovar`).

## Situação medida

| Família | URLs com pendência | Palavras faltando (soma, medição estática) |
| --- | --- | --- |
| wifi-tv-bairro | 32 | ~15.150 |
| local (/bairros/*) | 23 | ~7.550 |
| servico-bairro | 27 | ~6.950 |
| editorial (/blog/*) | 7 | ~4.150 |
| institucional | 4 | ~630 |
| problemas | 36 | ~76 (praticamente no limite) |

A medição estática subestima páginas com corpo montado no cliente; o número
oficial sai de `npm run check:originality` (modo `--rendered`, exige `dist`).

## Restrição honesta

Não é possível deixar o portal 100% indexável hoje sem violar as regras que já
estão no projeto: cada URL nova exige texto autoral próprio e **fotos reais da
operação** (sem IA). O acelerador disponível é a cadência: 4–6 URLs liberadas
por semana com prova, o que rende ~24 URLs/mês em vez de 200 URLs thin que o
Google filtraria.

## Ondas da semana (ordem de prioridade)

Prioridade = intenção comercial × esforço de prova.

1. **Onda A — /problemas (36 URLs quase no limite).** Faltam ~2 palavras por
   página em média: fechar o corpo autoral e o FAQ único destrava o maior lote
   sem novas fotos além das já catalogadas.
2. **Onda B — institucional (4 URLs).** Corpo de 250 palavras: home, /anuncie e
   pares. Baixo custo, alto peso de entidade.
3. **Onda C — /bairros (23 URLs).** Cada bairro precisa de: 450 palavras
   autorais (referências reais do bairro + relação com os serviços), ≥2 fotos
   reais de atendimento no bairro e interlinking para serviço×bairro.
4. **Onda D — serviço×bairro (27 URLs).** 500 palavras + caso técnico real.
5. **Onda E — Wi‑Fi/TV por bairro (32 URLs).** Maior lacuna; só entra depois das
   sessões fotográficas previstas em `docs/plano-fotografico-operacao-real.md`.
6. **Onda F — editorial.** 7 artigos a completar (800 palavras, revisão técnica).

Cada onda vira um bloco em `scripts/lib/content-waves.mjs` com `week`, `paths`
(4–6) e `provas` (fotos reais em `public/`).

## Rotina por onda

```bash
npm run report:publish-status     # status por URL
node scripts/check-real-images.mjs # prova visual real (fail-closed)
npm run check:originality         # corpo + Jaccard (gera content-approval.json)
npm run check:waves               # cadência e provas mínimas
npm run onda:aprovar -- --week=YYYY-MM-DD   # libera o lote (só se tudo passar)
npm run build && npm run indexnow:ping # sitemap regenerado + ping
```

Painel: `/admin/publicacao` mostra o checklist por URL e habilita o botão
"Aprovar onda em lote" apenas quando 100% das URLs passam.

## Pós-publicação

- `npm run report:index-alerts` — alerta URLs aprovadas ainda não indexadas.
- `npm run report:weekly-seo` — clique/impressão por rota após 7 dias.
- Regra do baseline: mudanças estruturais só com evidência do Search Console.

## Expectativa realista

Primeira página em consultas locais de cauda longa ("conserto de notebook
<bairro>") é alcançável em semanas, não em horas: a indexação de uma URL nova
leva de 2 a 14 dias e o ranqueamento depende de originalidade, provas e sinais
locais. Termos genéricos de Curitiba exigem o acúmulo das ondas.
