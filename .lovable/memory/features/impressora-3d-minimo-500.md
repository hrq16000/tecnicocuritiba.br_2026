---
name: Vertical Impressora 3D — mínimo R$ 500,00
description: Regra comercial e triagem da vertical de impressora 3D (mínimo pré-aprovado R$ 500,00, sem rota pública indexável ainda)
type: feature
---

# Impressora 3D

- Qualquer serviço em impressora 3D (diagnóstico de bancada, desentupimento de bico,
  troca de termistor/resistência, calibração, reparo de placa, upgrades) tem
  **mínimo pré-aprovado de R$ 500,00**, coleta e entrega inclusas, peças não inclusas.
- Fonte única: `PRICING.impressora3dMin` em `src/lib/funnel/triageConfig.ts`,
  `VALOR_IMPRESSORA_3D_MINIMO_LABEL` / `REGRA_IMPRESSORA_3D` em `src/lib/precosConfig.ts`
  e `TERMOS_IMPRESSORA_3D_RESUMO` em `src/lib/os/termosOs.ts`.
- Triagem: equipamento `impressora3d` (`forcedRoute: "coleta"`), sintomas próprios
  (bico, termistor, calibração, eixos, placa, firmware, upgrade).
- **Sem promessa de qualidade de impressão** — resultado depende de fatiamento,
  material e desgaste mecânico.
- Ainda **não existe rota pública indexável** `/servicos/...impressora-3d`:
  promoção depende de conteúdo autoral + provas visuais reais + gates de
  originalidade e sitemap curado (política vigente).

## Gates e malha (rodada atual)
- Rota `/servicos/conserto-impressora-3d` nasce SHALLOW (`noindex, follow`), fora do sitemap e sem card no hub /servicos até virar RICH com prova visual real (nunca imagem de IA).
- Gate `check:orphan-trend` (baseline em `reports/orphan-baseline.json`) bloqueia o build se o número de URLs curadas sem link interno crescer.
- E2E `e2e/malha-interna-ssr.spec.ts`: nenhum link interno pode apontar para 301 ou para `noindex` sem `follow`. `e2e/bairros-varredura-200.spec.ts` varre todas as rotas /bairros/*.
