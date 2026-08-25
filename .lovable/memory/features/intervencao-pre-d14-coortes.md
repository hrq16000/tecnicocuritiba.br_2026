---
name: Intervenção pré-D14 e coortes do experimento
description: Ledger de intervenções públicas durante a janela WAIT, separação em coortes limpa/intervencionada/descoberta indireta e regra FREEZE_V2
type: feature
---

# Governança de intervenção pré-D14

- O experimento D0→D14 rodava sob ZERO PUBLIC SEO DIFF. Duas mudanças públicas legítimas
  ocorreram na janela WAIT e foram **registradas, não revertidas**.
- Ledger selado: `public/intervencoes-d0.json`, gerado por `npm run intervencao:registrar`
  (fonte declarativa em `scripts/lib/intervencoes.mjs`, selagem SHA-256).
- Coortes (universo curado = 130 URLs):
  - `CLEAN_COHORT` = 91 URLs → única base de conclusão causal no D14.
  - `INTERVENTION_COHORT` = 2 URLs (`/`, `/areas-atendidas`).
  - `INDIRECT_DISCOVERY_COHORT` = 37 URLs que ganharam inbound do diretório de localidades.
- **Regra FREEZE_V2:** toda mudança pública posterior exige novo evento no ledger antes do
  deploy. Sem evento registrado, a coorte limpa é considerada contaminada.
- O relatório do D14 deve declarar explicitamente que a leitura causal usa só a coorte limpa.
- Galeria da home usa fotos licenciadas (Pexels) declaradas como **ilustrativas**; prova
  fotográfica própria (`provasBancada`, `bairroPhotos`) continua fail-closed e nunca aceita IA.
- Painel: `/admin/monitoramento` → seção "Intervenções desde o D0".
- Doc: `docs/relatorio-intervencao-pre-d14.md`.
