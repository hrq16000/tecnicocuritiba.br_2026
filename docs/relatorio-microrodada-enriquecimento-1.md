# Micro-rodada de enriquecimento de conteúdo 1

Data: 2026-08-24 · janela do Search Console 2026-05-24 a 2026-08-22 · propriedade `sc-domain:tecnico.curitiba.br`.

Escopo: aprofundar páginas existentes. **Nenhuma URL nova, nenhuma mudança de indexabilidade, nenhuma remoção de página.**

## Inventário de qualidade e score de enriquecimento

Critério de seleção: só entrou página com demanda medida no Search Console (impressões > 0) e posição fora do top 3. Página sem impressões não foi reescrita por suposição — é caso de descoberta, não de profundidade.

| URL | Impr. | Pos. | Score | Lacuna dominante |
| --- | --- | --- | --- | --- |
| /faq | 16 | 31,4 | D | Consultas de decisão técnica sem resposta na página |
| /servicos/recuperacao-de-dados | 45 | 21,0 | C | Falta urgência, o que evitar e o que é analisado |
| /servicos/upgrade-ssd-ram | 47 | 26,7 | C | Falta diagnóstico de gargalo e expectativa realista |
| /servicos | 6 (hub) | — | C | Falta ponte sintoma → serviço (entrada de intenção) |

Escala: A = profunda e específica · B = suficiente · C = superficial em blocos de decisão · D = responde parcialmente a intenção medida.

## O que foi enriquecido

**/faq** — nova categoria "Decisões técnicas antes de autorizar um serviço", com 8 perguntas substantivas (formatação, SSD, fonte, superaquecimento, HD com ruído, reparo de aparelho antigo, diagnóstico). Cobre a distância entre a consulta genérica e a decisão real do cliente.

**/servicos/recuperacao-de-dados** — blocos de urgência (quando parar de usar o equipamento), do que evitar (improvisos caseiros que reduzem a chance de recuperação) e do que é efetivamente analisado na avaliação técnica.

**/servicos/upgrade-ssd-ram** — diagnóstico do gargalo real (disco × memória × temperatura) e alinhamento explícito do que o upgrade **não** resolve.

**/servicos** — tabela "Qual serviço resolve cada sintoma", ligando sintomas reais às páginas donas da intenção; fortalece o interlinking contextual do hub.

Correção pontual: o hub de serviços apontava para `/servicos/redes-wifi` (prefixo de serviço×bairro, sem página própria). Ajustado para `/servicos/redes-e-wifi`, a rota canônica.

## Checklist P0/P1 por URL

`npm run report:seo-p0p1` → `reports/seo-p0p1-checklist.md`.

Resultado: **11 P0 · 11 P1 · 148 P2** em 170 URLs curadas (22 indexadas).

P0 é sempre URL indexada com demanda medida — é onde a edição muda número. As 148 P2 não têm impressões nem indexação confirmada: continuam sendo problema de descoberta (idade do domínio, links internos, sitemap), coerente com o diagnóstico da Fase 4 (0 URLs em "crawled — currently not indexed", ou seja, sem sinal de rejeição por qualidade).

Concentração de P0: `/precos-e-politicas` (76 impr., pos. 16,9), `/tecnico-informatica-curitiba` (57, 16,3), `/servicos/upgrade-ssd-ram` (47, 26,7), `/servicos/recuperacao-de-dados` (45, 21,0), `/faq` (16, 31,4).

## Mapa de intenção consulta → página

`npm run report:query-intent` → `reports/query-intent-map.md`.

66 consultas reportadas · **47 subaproveitadas** (impressões com posição acima de 10) · **10 com canibalização**.

Dois achados que valem decisão editorial e não foram alterados nesta rodada:

1. `/gestor-responsavel` continua capturando consultas B2B ("suporte técnico empresarial curitiba", "manutenção servidor empresa curitiba", "empresa suporte informatica curitiba pme") que pertencem a `/empresas` e `/empresa-de-ti-curitiba`. A página institucional está no lugar da comercial.
2. `notebook nao liga nao acende nada` cai em `/blog/notebook-nao-liga-o-que-fazer`, disputando com `/problemas/notebook-nao-liga`. O dono da intenção de sintoma deveria ser a página de problema.

## Lista de inspeção de URLs noindex

`npm run report:noindex-inspection` → `reports/noindex-inspection.md`.

4 URLs declaram `noindex` **e** constam no sitemap curado — contradição de sinal: `/bairros/bigorrilho`, `/bairros/cic`, `/blog`, `/tecnico-informatica-campo-magro`. O relatório registra, por URL, a evidência a favor de indexar e a favor de manter fora, mais o encaminhamento sugerido. Nenhuma política de índice foi alterada: a poda de bairros e as cidades-âncora seguem valendo.

## Automação

Novo workflow `.github/workflows/gsc-snapshot.yml` (semanal, segunda 09:20 UTC, e manual): ingestão bruta → inspeção de URL → checklist P0/P1 → mapa de intenção → inspeção de noindex → atualização de `public/seo-priority.json` (consumido por `/admin/vitals`). Somente leitura no Google: não submete sitemap nem solicita indexação.

Scripts registrados: `gsc:pull`, `gsc:inspect`, `report:seo-p0p1`, `report:query-intent`, `report:noindex-inspection`.

## Próximo passo sugerido (não executado)

Resolver os dois casos de dono de intenção acima e revisar title/description das P0 com CTR zero em posição de primeira página (`/bairros/portao` 8,9 · `/bairros/agua-verde` 8,1 · `/tecnico-informatica-colombo` 8,1) — ganho vem de CTR, não de mais texto.
