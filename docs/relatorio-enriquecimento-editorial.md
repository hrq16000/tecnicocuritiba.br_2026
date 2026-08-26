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
