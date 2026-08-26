# Plano de indexação por ondas

## Objetivo

Indexar 100% do conteúdo **elegível** do Técnico em Curitiba sem expor rotas privadas, duplicar intenções ou criar páginas locais artificiais. Uma URL só entra no sitemap depois de cumprir conteúdo, identidade, links internos e evidência local.

## Linha de base executada

Em 26/08/2026, a execução local registrou:

- 130 URLs elegíveis no sitemap curado, todas HTTP 200, indexáveis e sem órfãs.
- 45 bairros mapeados: 25 curados/indexáveis e 20 na fila de enriquecimento.
- 9 cidades da Região Metropolitana já tratadas como páginas de cidade.
- A consulta de cobertura do Search Console depende das credenciais configuradas no GitHub; sem elas, o relatório não deve interpretar `0 indexadas` como dado real.

## Regras de decisão

| Tipo de URL | Decisão | Condição |
| --- | --- | --- |
| Serviço, problema, cidade ou hub com intenção própria | indexar | canonical próprio, conteúdo útil, H1, schema e links internos |
| Bairro | promover por onda | narrativa exclusiva, FAQ local, links para cidade/serviços/vizinhos e prova visual real ou aprovação documentada |
| URL legada | redirecionar 301 | existir uma página canônica que responda à mesma intenção |
| Página duplicada/variação de slug | consolidar | uma única dona da intenção e remoção do sitemap da variação |
| Admin, login, ordem de serviço, agradecimento e 404 | manter noindex | privacidade, segurança ou ausência de intenção de busca |

## Ondas

1. **Onda 1 — qualidade do conjunto atual.** Manter as 130 URLs elegíveis com HTTP 200, canonical self, schema, sitemap e links internos validados.
2. **Onda 2 — problemas e serviços.** Corrigir lacunas de intenção antes de criar URLs: sintoma → diagnóstico → serviço canônico.
3. **Onda 3 — bairros de Curitiba.** Promover no máximo 4 bairros por rodada, começando por Centro Cívico, Alto da XV, Campina do Siqueira e Fanny quando houver prova e texto exclusivo.
4. **Onda 4 — serviço × localidade.** Só criar/promover quando houver procura, conteúdo específico e nenhum conflito com a página de serviço ou cidade.
5. **Onda 5 — editorial de apoio.** Artigos apenas quando responderem uma dúvida que não cabe em uma página comercial ou de problema.

## Checklist obrigatório de promoção

- Conteúdo original e específico da intenção/localidade.
- Pelo menos um caminho interno: cidade → bairro → serviço e sintoma → diagnóstico → serviço.
- Canonical autorreferente, `index,follow`, H1 único, metadados e JSON-LD válidos.
- Inclusão no sitemap somente após aprovação.
- Sem promessa de prazo, unidade física, avaliação ou preço não comprovados.
- Revalidação pelo Search Console após o deploy.

## Rotina semanal automatizada

O workflow `.github/workflows/indexation-waves.yml` gera e arquiva a fila de bairros e o inventário de indexação. A revisão humana usa esses artefatos para escolher o próximo lote; a promoção continua fail-closed pelos gates existentes.
