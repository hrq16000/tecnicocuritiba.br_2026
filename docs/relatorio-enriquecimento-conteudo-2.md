# Micro-rodada de enriquecimento de conteúdo 2 — páginas de serviço

Objetivo: transformar páginas comerciais rasas em páginas de apoio à decisão,
sem criar URLs novas e sem alterar indexabilidade.

## Seleção (déficit editorial medido antes da rodada)

| Página | Palavras antes | FAQs antes | Déficit principal |
| --- | --- | --- | --- |
| /servicos/remocao-de-virus | 994 | 7 | sem bloco de limites; sem taxonomia de ameaça |
| /servicos/manutencao-preventiva-empresas | 1383 | 10 | sem "não cobre"; rotina sem critério explícito |
| /servicos/manutencao-de-computador | 1387 | 11 | sem sequência sintoma → diagnóstico |
| /servicos/backup-para-empresas | 1466 | 10 | sem diferenciação local/externo/nuvem |
| /servicos/manutencao-de-notebook | 1520 | 12 | sem leitura de bateria/aquecimento |
| /servicos/conserto-placa | 1961 | 10 | sem critério de viabilidade de reparo |

## O que foi entregue em cada página

Dois blocos autorais novos por página, sempre no mesmo eixo de decisão:

1. **Quando o serviço NÃO resolve** — limites técnicos, escopo alheio
   (dados, conta comprometida, software x hardware) e limite econômico.
2. **Discriminação técnica** — o que separa causas que produzem o mesmo
   sintoma, e em que ordem elas são testadas antes de trocar peça.

Duas FAQs novas por página, todas de decisão pré-contato (fonte x
superaquecimento, bateria x desempenho, sincronização x backup,
preventiva x peças, líquido em placa, antivírus x PUP).

## Resultado

| Página | Palavras depois | FAQs depois |
| --- | --- | --- |
| /servicos/remocao-de-virus | ~1.630 | 9 |
| /servicos/manutencao-de-computador | ~2.070 | 13 |
| /servicos/manutencao-de-notebook | ~2.240 | 14 |
| /servicos/manutencao-preventiva-empresas | ~2.020 | 12 |
| /servicos/backup-para-empresas | ~2.180 | 12 |
| /servicos/conserto-placa | ~2.770 | 12 |

## Invariantes respeitadas

- Nenhuma rota criada, removida ou alterada em indexabilidade.
- Nenhum preço, prazo, SLA, avaliação ou garantia inventado; garantia
  sempre escopada ao serviço executado.
- FAQPage estático continua espelhando a fonte única
  (`src/lib/servicosCore.ts` → `scripts/lib/servico-faqs.mjs`);
  `scripts/inject-route-head.mjs` reescreveu os 6 heads afetados.
- `dateModified` atualizado apenas nas páginas efetivamente alteradas.
