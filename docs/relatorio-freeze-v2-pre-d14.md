# Relatório FREEZE_V2 — pré-D14

Gerado em 2026-08-25T06:10:03.004Z · base `https://tecnico.curitiba.br`

## DEPLOY
- Production deployment: `live:5eec352d9a7f460d`
- Coleta live: 2026-08-25T06:05:10.617Z
- Live validation: **PASS** (130/130 HTTP 200, 0 problema(s))

## COHORT RECONCILIATION
| Coorte | URLs |
| --- | --- |
| Clean | 91 |
| Direct | 2 |
| Indirect | 37 |
| **Total** | **130** |

Status: **PASS** — gate `npm run check:coortes` (fail-closed).

## DIRECT INTERVENTIONS

#### /
- evento: `INT-2026-08-25-002` · 2026-08-25T05:30:00.000Z · deployment `2026-08-25T06:05:10.617Z`
- motivo: Substituição da galeria vazia por fotografias reais licenciadas (Pexels) em AVIF/WebP, declaradas como ilustrativas. Prova fotográfica própria (provasBancada) segue fail-closed.
- mudança declarada: `CONTENT_AND_MEDIA` (src/lib/galeriaIlustrativa.ts, src/components/home/GaleriaIlustrativaSection.tsx, src/components/home/HomeSections.tsx, public/fotos/galeria/*)
- HTTP 200 · canonical `https://tecnico.curitiba.br/` · robots `index, follow`
- title hash `2fa85012071c4656df474fd0e353d533` · H1 hash `5e06d2d38c67b9f28a0ad6f3abd3919b` · main hash `9ff60bb1b0d7dbf9e00be6ec338b4dc3`
- JSON-LD `ab3a0cbd3ec63e2673a04a8689d80ce7` (FAQPage, ItemList, LocalBusiness,ProfessionalService,ComputerRepairService, Organization, WebPage, WebSite) · link set `215bb56abe02493dfc60de2308dd6a96` (48 saídas)
- lastmod: — · tier A · cluster HOME
- title/H1/canonical/robots antes×depois: Sem alteração de metadata. / sem alteração declarada / sem alteração / sem alteração
- schema antes×depois: Sem alteração de JSON-LD.
- conteúdo: Seção 'Bancada, notebook, desktop e rede' com 6 figuras e legendas factuais.
- links internos: Nenhum link interno novo. (novos alvos: 0)
- impacto esperado — descoberta: Nenhum link interno novo.
- impacto esperado — conversão: Nenhum CTA novo.

#### /areas-atendidas
- evento: `INT-2026-08-25-001` · 2026-08-25T04:40:00.000Z · deployment `2026-08-25T06:05:10.617Z`
- motivo: Diretório de localidades com busca acento-insensível, filtro por modalidade e valores vindos de precosConfig, atendendo pedido de usabilidade do usuário durante a janela WAIT.
- mudança declarada: `CONTENT_AND_INTERNAL_LINKS` (src/components/areas/DiretorioLocalidades.tsx, src/pages/AreasAtendidas.tsx, .github/workflows/ci.yml)
- HTTP 200 · canonical `https://tecnico.curitiba.br/areas-atendidas` · robots `index, follow`
- title hash `aa7a76836b230938b1f3545b520f9991` · H1 hash `f049d53632a2d1776127bfcbb54f8d35` · main hash `c42c1bf260b1b110a85645addd555593`
- JSON-LD `a98cbdabcbc834e431f3427295900caf` (BreadcrumbList, FAQPage, LocalBusiness,ProfessionalService,ComputerRepairService, Organization, WebSite) · link set `6cffbbf8cd95e8064fda1c220ac47b71` (69 saídas)
- lastmod: 2026-08-08 · tier A · cluster HUB
- title/H1/canonical/robots antes×depois: Sem alteração de metadata. / sem alteração declarada / sem alteração / sem alteração
- schema antes×depois: Sem alteração de JSON-LD.
- conteúdo: Bloco 'Encontre seu bairro ou cidade' adicionado acima do mapa de cobertura.
- links internos: Novos links internos para páginas de bairro e cidade já curadas — aumenta inbound e pode acelerar descoberta. (novos alvos: 37)
- impacto esperado — descoberta: Novos links internos para páginas de bairro e cidade já curadas — aumenta inbound e pode acelerar descoberta.
- impacto esperado — conversão: CTA adicional abrindo a triagem com localidade e modalidade no contexto.

## INDIRECT DISCOVERY
37 URLs registradas com SOURCE/TARGET/NEW_INBOUND/ANCHOR/SSR_LINK/DEPTH/CLUSTER/TIER/D0_STATE/D7_STATE em `reports/intervention-impact-map.json`.

| TARGET_URL | SOURCE | NEW_INBOUND | SSR | DEPTH ANTES→DEPOIS | CLUSTER | TIER | D0 | D7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /bairros/agua-verde | /areas-atendidas | 1 | sim | 1→1 | BAIRRO | B | SEM_DADO | indexed |
| /bairros/bacacheri | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/batel | /areas-atendidas | 1 | sim | 1→1 | BAIRRO | B | SEM_DADO | indexed |
| /bairros/bigorrilho | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | outros |
| /bairros/boa-vista | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/boqueirao | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/cabral | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/cajuru | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/campo-comprido | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/capao-raso | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/centro | /areas-atendidas | 1 | sim | 1→1 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/cic | /areas-atendidas | 1 | sim | 1→1 | BAIRRO | B | SEM_DADO | outros |
| /bairros/cristo-rei | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/fazendinha | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/hauer | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/juveve | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/merces | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/novo-mundo | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/pinheirinho | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/portao | /areas-atendidas | 1 | sim | 1→1 | BAIRRO | B | SEM_DADO | indexed |
| /bairros/reboucas | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/santa-felicidade | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/seminario | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/sitio-cercado | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | discovered |
| /bairros/uberaba | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /bairros/xaxim | /areas-atendidas | 1 | sim | 2→2 | BAIRRO | B | SEM_DADO | unknown |
| /tecnico-informatica-almirante-tamandare | /areas-atendidas | 1 | sim | 2→2 | CIDADE | B | SEM_DADO | unknown |
| /tecnico-informatica-araucaria | /areas-atendidas | 1 | sim | 1→1 | CIDADE | B | SEM_DADO | indexed |
| /tecnico-informatica-campo-largo | /areas-atendidas | 1 | sim | 1→1 | CIDADE | B | SEM_DADO | discovered |
| /tecnico-informatica-campo-magro | /areas-atendidas | 1 | sim | 2→2 | CIDADE | B | SEM_DADO | outros |
| /tecnico-informatica-colombo | /areas-atendidas | 1 | sim | 1→1 | CIDADE | B | SEM_DADO | indexed |
| /tecnico-informatica-curitiba | /areas-atendidas | 1 | sim | 1→1 | CIDADE | A | SEM_DADO | indexed |
| /tecnico-informatica-fazenda-rio-grande | /areas-atendidas | 1 | sim | 2→2 | CIDADE | B | SEM_DADO | discovered |
| /tecnico-informatica-pinhais | /areas-atendidas | 1 | sim | 1→1 | CIDADE | B | SEM_DADO | discovered |
| /tecnico-informatica-piraquara | /areas-atendidas | 1 | sim | 2→2 | CIDADE | B | SEM_DADO | discovered |
| /tecnico-informatica-quatro-barras | /areas-atendidas | 1 | sim | 2→2 | CIDADE | B | SEM_DADO | discovered |
| /tecnico-informatica-sao-jose-pinhais | /areas-atendidas | 1 | sim | 1→1 | CIDADE | B | SEM_DADO | indexed |

Clusters atingidos: BAIRRO 26 · CIDADE 11 · PROBLEMA 0.
Status: **PASS**

## GRAPH
- New inbound: 37
- URLs com profundidade reduzida: 0
- Invalid targets: 0 (consolidadas 0 · 404 0 · noindex 0)
- Status: **PASS**

## TIER A POR COORTE
TIER_A_CLEAN 19 · TIER_A_DIRECT 2 · TIER_A_INDIRECT 1

## FREEZE
- V1 preserved: **PASS** (`82f7d05473cc0590…`)
- V2 sealed: **PASS** (`fb95e1e4d676e89d…`, 130 URLs, 2121 arquivos vigiados)
- Public drift after V2: 0 → **PASS**
- Classificação de diffs: OBSERVABILITY_CHANGE=2

## LASTMOD
- Legitimate: 0 (—)
- Unchanged: 130
- Unexpected: 0 → **PASS**

## SITEMAP
- URLs no sitemap: 130/130
- Consolidadas presentes: 0 · 404: 0 · noindex: 0
- Prioridades/frequências: inalteradas nesta rodada.

## INDEXNOW
- New eligible: 0 (esperado)
- New submitted: 0 (esperado)
- Último estado registrado: {"executadoEm":"2026-08-25T00:23:29.163Z","enviadas":170,"falhas":0,"novas":170,"mudadas":0,"ignoradas":0}

## SEARCH CONSOLE / BING
Coleta operacional normal mantida. Nenhum snapshot D14 criado, nenhum marco selado, decisão inalterada.

## D14
- Temporal state: **LOCKED**
- Elegível a partir de: 2026-09-08T01:49:17.273Z (faltam 13.82 dia(s))
- Decision: **A / WAIT**

## FINAL
READY — FREEZE V2 ACTIVE — WAIT FOR REAL D14
