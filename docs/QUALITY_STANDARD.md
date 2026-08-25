# Padrão de Qualidade de Referência — tecnico.curitiba.br

Este documento define o que autoriza uma URL a existir e a ser indexável neste
projeto. Ele vale para toda página nova e para toda reescrita. O gate
`npm run check:local-page-quality:gate` aplica a parte mensurável; o restante é
critério de revisão humana antes de liberar qualquer onda.

Princípio: **qualidade → diferenciação → intenção → autoridade → indexação.**
Nunca o contrário. Nenhuma URL é criada para "cobrir palavra-chave".

## Checklist de 10 pontos (todos obrigatórios)

1. **Intenção própria** — a página responde a uma pergunta que nenhuma outra URL
   do site já responde melhor. Se a resposta correta já existe em outra página,
   o certo é linkar, não duplicar.
2. **Resposta direta acima da dobra** — o visitante entende em até 3 linhas o que
   é o problema, se tem solução e qual é o próximo passo.
3. **Informação verificável** — sintomas, causas, prazos, faixas de preço e
   limites vêm da operação real. Nada estimado, nada inventado.
4. **Valor incremental** — a página traz pelo menos um elemento de decisão que o
   texto genérico do mercado não tem: tabela diagnóstica, árvore de decisão,
   critério de "quando NÃO vale consertar", checklist pré-contato.
5. **Honestidade sobre limites** — diz explicitamente o que o serviço não
   resolve e quando o cliente deve procurar outra solução.
6. **Exclusividade textual** — mínimo de 16% de shingles exclusivos e
   similaridade máxima de 0,55 contra qualquer irmã do mesmo cluster.
7. **Prova visual real** — imagens da operação, sem estoque e sem geração
   sintética; gate fail-closed por vertical.
8. **Contexto local verdadeiro** (páginas locais) — logística de coleta, padrão
   de imóvel/rede observado, referência geográfica real. Trocar apenas o nome do
   bairro é doorway e é bloqueado.
9. **Malha interna coerente** — pelo menos um link contextual de entrada de uma
   página-pilar e links de saída para a página dona de cada assunto citado.
10. **Contrato técnico** — canonical próprio, JSON-LD sem duplicação, SSR
    servindo o conteúdo, sem link interno para redirect ou 404.

## Piso de qualidade (mensurável, aplicado no gate)

| Sinal | Piso |
| --- | --- |
| Score de valor (auditoria `report:quality`) | ≥ 60 |
| Texto exclusivo no cluster | ≥ 16% |
| Similaridade máxima com irmã | ≤ 0,55 |
| Risco doorway ALTO | não pode aumentar em relação ao baseline curado |

Páginas locais novas abaixo de qualquer um desses pisos falham o gate. Páginas
já existentes que caem para risco ALTO falham como regressão.

## Decisão para páginas que não atingem o padrão

| Situação | Decisão |
| --- | --- |
| Tem demanda real e informação própria possível | **IMPROVE** — reescrever |
| Não tem intenção própria nem informação local verdadeira | **CONSOLIDATE** — 301 para a página-pilar |
| Sinais mistos, demanda incerta | **REVIEW** — manter fora de nova promoção até haver dado |
| Boa e com demanda | **KEEP** |

Consolidar é resultado legítimo. Não existe compromisso com número de URLs.

## Governança

- `npm run report:quality` — auditoria de valor URL por URL.
- `npm run report:cluster-uniqueness` — similaridade por cluster e trechos
  repetidos com ação de reescrita.
- `npm run check:local-page-quality:gate` — bloqueio de regressão antidoorway.
- `npm run check:local-page-quality:rebaseline` — só após consolidação ou
  reescrita aprovada, com o relatório comparativo anexado.
