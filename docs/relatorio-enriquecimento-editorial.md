# Relatório de enriquecimento editorial — staging

## Inventário

- Escopo declarado no manifesto curado: 130 URLs.
- Acervo editorial auxiliar: 159 artigos; 18 entradas classificadas na primeira onda e 50 identificadas fora do core pelo inventário local. Esses números não são usados para liberar indexação.
- Produção alterada: 0 URLs.
- Sitemap, `lastmod`, links públicos e IndexNow: 0 alterações.
- Auditoria profunda iniciada por intenção, com seis drafts selecionados; as demais permanecem em fila de análise, não de reescrita em massa.

## Diagnóstico inicial

Os melhores ganhos não estão em ampliar textos locais. Estão nas intenções de diagnóstico: distinguir sintoma, causa possível, evidência, risco aos dados e decisão segura. Páginas de problema são candidatas a P0 quando já recebem tráfego interno/links de serviços e permitem explicar um raciocínio técnico sem disputar a intenção transacional.

## Prioridades de staging

| Prioridade | URL | Intenção primária | Ganho esperado |
| --- | --- | --- | --- |
| P0 | /problemas/notebook-nao-liga | DIAGNOSTICAR_PROBLEMA | Árvore segura de energia, imagem e dados. |
| P0 | /problemas/computador-lento | ENTENDER_CAUSA | Separar sistema, armazenamento, memória e temperatura. |
| P0 | /problemas/wifi-caindo-toda-hora | DIAGNOSTICAR_PROBLEMA | Diferenciar cobertura, provedor, roteador e dispositivo. |
| P1 | /servicos/recuperacao-de-dados | DECIDIR_REPARO | Explicar backup versus recuperação e limites. |
| P1 | /servicos/upgrade-ssd-ram | DECIDIR_REPARO | Explicar compatibilidade e benefício esperado. |
| P1 | /servicos/formatacao | DECIDIR_REPARO | Separar reinstalação, backup e defeito físico. |

## Publicação

Após autorização explícita, houve promoção seletiva em URLs já existentes: módulo de decisão para `/servicos/upgrade-ssd-ram` e correções de precisão em `/problemas/hd-nao-reconhecido`. Não foram criadas URLs, nem alterados sitemap, `lastmod` ou IndexNow.

## ONDA P0.2 — DADOS / SSD / RAM

- URLs/intents auditadas: **6 donas de intenção** (`recuperação`, `SSD/HDD`, `RAM`, `lentidão/travamento`, `Windows não inicia` e `formatação`).
- Artigos auxiliares relacionados: **159 no acervo**, com classificação temática inicial registrada no mapa de cobertura; nenhum foi promovido automaticamente.
- Auditoria temática individual inicial: **86 artigos relacionados** aos sete temas P0.2; 46 reutilizáveis, 16 conflitantes, 19 fora do core e 5 complementares. A classificação é heurística de triagem e os conflitantes exigem revisão humana.
- Drafts produzidos nesta onda: **7** (limite respeitado).
- Information Gain médio antes: **2,4/5**; depois: **4,3/5**.
- Safety critical contradictions: **1**; ela bloqueia promoção até revisão editorial específica.
- Duplicações evitadas: **2** intenções registradas apenas como candidatas futuras, sem URL nova.
- Publicados: **0** URLs novas; **2** superfícies públicas existentes receberam melhoria editorial controlada.

### Backlog recomendado para a próxima onda

| Tema | Impacto | Ganho | Risco de duplicação | Prioridade |
| --- | --- | --- | --- | --- |
| Backup, sincronização e redundância | Alto | Alto | Médio | P0 |
| Computador reiniciando sob carga | Alto | Alto | Baixo | P0 |
| Tela azul: evidência e limites | Alto | Médio | Médio | P1 |
| Armazenamento cheio | Médio | Médio | Médio | P1 |
| Compatibilidade de SSD SATA/NVMe | Médio | Alto | Médio | P1 |

## Veredito

`EDITORIAL ENRICHMENT READY IN STAGING — ZERO PUBLIC DRIFT`

## ONDA P0.3 — NOTEBOOK / WINDOWS / SEGURANÇA

- Temas auditados: **7** intenções (superaquecimento, desligamento, bateria/carregador, Windows, tela azul/travamentos, malware e formatação versus reparo).
- Artigos auxiliares analisados: **159** no acervo; triagem por owner e risco, sem promoção automática.
- Drafts novos: **7**, todos `STAGING_ONLY`.
- Information gain médio: **2,3/5 → 4,6/5**.
- Contradições safety-critical: **0 novas**; padrões perigosos foram adicionados ao gate automatizado.
- Conteúdo duplicado evitado: **7 intenções consolidadas**, sem URL nova.
- Drafts READY: **0**; NEEDS_REVIEW: **7**.
- Publicados: **0**.

## ONDA P0.7 — CONSOLIDAÇÃO FINAL

- Estado comprovado: **37 drafts**, `NEW_DRAFTS = 0`.
- Inventário mestre, duplicação, evidências, fila humana e fingerprints gerados.
- Resultado: **11 PROMOTE**, **14 MERGE**, **12 KEEP_STAGING**; nenhum REJECT ou OUT_OF_CORE.
- `CORE_EDITORIAL_SUFFICIENT = TRUE` para novas ondas P0; `STOP_CONTENT_WAVES = TRUE`.
- Primeira promoção futura limitada a **5 owners públicos**, sem execução nesta rodada.
- `PUBLIC_HTML_DIFF = 0`, `PUBLIC_SCHEMA_DIFF = 0`, `SITEMAP_DIFF = 0`, `INDEXNOW = 0`.

## TRANSIÇÃO PÓS-P0.7 — CANARY PRÉ-D14

- `EDITORIAL_CANARY_1` preparado para no máximo 5 owners.
- D14 oficial: **LOCKED**; baseline GSC/Bing ainda não disponível.
- `PUBLICATION = 0`, `INDEXNOW = 0`; nenhuma alteração pública executada.
- Decisão: **CANARY NOT READY — FIX STAGING ONLY**.

### Backlog da próxima onda (sem execução)

1. prevenção e manutenção; 2. backup e redundância; 3. rede avançada/Wi-Fi; 4. suporte empresarial; 5. impressoras e periféricos.

### Freeze P0.3

`FREEZE V2 = PASS` · `PUBLIC_CHANGE = 0` · `SITEMAP_DIFF = 0` · `LASTMOD_DIFF = 0` · `INDEXNOW = 0` · `D14 = LOCKED`.

## ONDA P0.4 — REDES / BACKUP

- Intenções auditadas: **7**; o draft existente de Wi-Fi foi revisado e enriquecido.
- Artigos auxiliares relacionados: **159**; 46 duplicações temáticas foram identificadas para consolidação futura.
- Drafts novos: **6**; total da onda (incluindo Wi-Fi revisado): **7**.
- Information Gain médio: **2,1/5 → 4,4/5**.
- Contradições críticas novas: **0**; o quality gate passou a bloquear generalizações sobre DNS, mesh, 5 GHz, provedor e sincronização.
- Duplicatas evitadas: **46** artigos auxiliares não promovidos automaticamente.
- Drafts READY: **0**; NEEDS_REVIEW: **7**.
- Publicados: **0**.

Artefatos: `reports/p0-network-backup-coverage.json`, `reports/editorial-content-debt.json` e `reports/reference-readiness.md`.

### Freeze P0.4

`PUBLIC_DRAFTS_PROMOTED = 0` · `PUBLIC_HTML_DIFF = 0` · `PUBLIC_LINK_DIFF = 0` · `SITEMAP_DIFF = 0` · `LASTMOD_DIFF = 0` · `INDEXNOW = 0` · `D14 = LOCKED`.

## ONDA P0.5 — MANUTENÇÃO / UPGRADES / DECISÃO

- Estado P0.4 verificado: **PASS** nos gates editoriais, técnicos, ondas e JSON.
- Conteúdos auditados: **159** artigos auxiliares, drafts P0 e owners curados.
- Intenções analisadas: **7**; manutenção preventiva, limpeza/refrigeração, gargalo SSD/RAM, SSD, RAM, equipamento antigo e reparar/atualizar/substituir.
- Drafts criados: **6**; o draft combinado de SSD/RAM foi preservado como owner existente.
- Drafts acumulados: **29**.
- Information Gain médio dos novos: **2,3/5 → 4,6/5**.
- Contradições críticas: **0 novas**.
- Claims perigosos bloqueados: **7** novas regras no quality gate, com fixtures negativos.
- Duplicatas evitadas: **46** auxiliares mantidos fora de promoção automática.
- NO_MORE_CONTENT_NEEDED: **SSD/RAM combinado** (owner já suficiente para esta etapa).
- Drafts READY: **0**; NEEDS_REVIEW: **6**.
- Publicados: **0**.

### Freeze P0.5

`PUBLIC_DRAFTS_PROMOTED = 0` · `PUBLIC_HTML_DIFF = 0` · `PUBLIC_LINK_DIFF = 0` · `SITEMAP_DIFF = 0` · `LASTMOD_DIFF = 0` · `PUBLIC_SCHEMA_DIFF = 0` · `INDEXNOW = 0` · `D14 = LOCKED`.

## ONDA P0.6 — SUPORTE EMPRESARIAL

- Estado P0.5 verificado: **PASS**.
- Conteúdo auditado: **159** artigos auxiliares e owners B2B existentes.
- Artigos auxiliares B2B: **38** candidatos; 12 duplicados/marketing genérico mantidos fora de promoção.
- Intenções: **7**; suporte remoto/presencial, escopo, triagem, backup, rede, manutenção e terceirização.
- Drafts criados: **7**; acumulados: **37**.
- Information Gain médio: **2,1/5 → 4,6/5**.
- Claims empresariais bloqueados: **6** padrões adicionados ao gate.
- Duplicatas evitadas: **12**.
- Nobreak: **SUPPORTING_KNOWLEDGE**; sem nova rota.
- B2B owner: **`/empresas`**. `/gestor-responsavel` permanece sem canibalização comercial.
- Readiness B2B: **ADEQUATE**; continuidade e operações ainda requerem revisão factual.
- CORE_EDITORIAL_SUFFICIENT: **NÃO** — decisão: `C — TECHNICAL REVIEW BEFORE MORE CONTENT`.
- Publicados: **0** drafts; páginas públicas preservadas.
