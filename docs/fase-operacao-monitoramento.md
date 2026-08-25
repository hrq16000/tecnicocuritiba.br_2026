# Fase de Operação — monitoramento 30/60/90

Marco: a consolidação antidoorway está concluída (170 → 130 URLs canônicas,
40 URLs com 301, risco doorway ALTO 42 → 2). A partir daqui **não há nova
reforma de arquitetura**: o ciclo é publicar → validar → medir → priorizar →
melhorar apenas onde houver evidência de Search Console / Bing.

## Ferramentas desta fase

| Comando | O que faz | Quando rodar |
| --- | --- | --- |
| `npm run check:post-consolidation` | Gate pré-deploy: sitemap sem URL consolidada, nenhum link/JSON-LD interno para 301, breadcrumb coerente, nenhum HTML emitido para URL removida | a cada build |
| `npm run check:post-consolidation:live` | Mesma auditoria contra produção: 301/308, 1 hop, destino 200 e canônico, sem 404 em rota antiga | logo após o deploy |
| `npm run check:entity-consistency` | Consistência de Organization/LocalBusiness/author, claims não comprovadas e schema duplicado/instável nas páginas locais | a cada build e após otimizações locais |
| `npm run report:interlink-playbook` | Playbook de interlinking: o que cada página local deve linkar (hub + intenção forte) e com qual âncora natural | semanal e depois de qualquer reescrita local |
| `npm run check:interlink-playbook:gate` | Falha quando ainda existe link interno para URL consolidada | pipeline |
| `npm run report:cluster-uniqueness` | Similaridade por cluster + **diff por par** + checklist de reescrita por URL | antes de qualquer promoção/reescrita |
| `npm run check:local-page-quality:gate` | Piso de qualidade (score 60, exclusividade 16%, similaridade ≤ 0,55) | pipeline |

## Sequência de deploy desta fase

1. `npm run build` (o build já roda os gates registrados).
2. `npm run check:post-consolidation` e `npm run check:entity-consistency`.
3. Publicar exatamente esse build — sem features novas no mesmo deploy.
4. `npm run check:post-consolidation:live` contra `https://tecnico.curitiba.br`.
5. IndexNow incremental (somente URLs realmente modificadas).
6. Registrar baseline D0 em `/admin/indexacao-diaria`.

## Métrica principal

**Tier A indexation rate** (baseline informado: 58,1%). Indexação absoluta das
130 URLs não é meta. Janelas de leitura: 7, 14 e 30 dias — oscilação diária não
gera decisão.

## Módulos editoriais por serviço prioritário

`scripts/lib/modulos-editoriais.mjs` é a fonte única dos módulos variáveis
(diagnóstico, sintoma × causa, procedimento, limitações e decisão prática)
aplicados às páginas de serviço que são **destino das URLs consolidadas**:
`manutencao-de-computador`, `manutencao-de-notebook`, `formatacao` e
`recuperacao-de-dados`.

Regra de aplicação: uma seção só é renderizada quando sua sobreposição com o
texto já existente da página fica abaixo de 30% (`filtrarModulos`). Módulo que
repete o que a página já diz é descartado em runtime — nenhuma rota nova é
criada e nenhuma página recebe bloco genérico.

## Guardrails

Sem novas URLs serviço×bairro, sem artigos em massa, sem reenvio integral no
IndexNow, sem alteração diária de titles, sem flexibilizar
`docs/QUALITY_STANDARD.md` para aumentar contagem de páginas.
