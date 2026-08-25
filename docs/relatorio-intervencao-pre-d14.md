# Relatório de intervenção controlada pré-D14

Projeto: tecnico.curitiba.br
Selo do ledger: `bff936e327fd72f159e3d54347e8986bed312cdd83332ea5a0595055f5aba1d3`
Arquivo selado: `public/intervencoes-d0.json` (gerado por `npm run intervencao:registrar`)

## 1. Por que este documento existe

O experimento D0 → D14 corria sob política **ZERO PUBLIC SEO DIFF**. Durante a janela WAIT
houve duas alterações públicas legítimas, pedidas pelo responsável. Em vez de reverter ou
resetar o baseline, a intervenção foi **registrada e isolada em coortes**, preservando o valor
estatístico das URLs que continuam intocadas.

Nada foi apagado. Nada foi revertido. D0 e D7 permanecem selados por hash no ledger de marcos.

## 2. Eventos registrados

| ID | Data (UTC) | URL direta | Tipo de mudança | Descrição |
| --- | --- | --- | --- | --- |
| INT-2026-08-25-001 | 25/08 04:40 | `/areas-atendidas` | `CONTENT_AND_INTERNAL_LINKS` | Diretório de localidades: busca acento-insensível, filtro por modalidade, ordenação por disponibilidade e por valor real vindo de `precosConfig` (mínimo R$ 99,99), CTA abrindo a triagem com localidade + modalidade. |
| INT-2026-08-25-002 | 25/08 05:30 | `/` | `CONTENT_AND_MEDIA` | Galeria de fotografias reais licenciadas (Pexels), servidas em AVIF/WebP responsivos, com alt factual e crédito visível. Declaradas como **ilustrativas**; a prova fotográfica própria (`provasBancada`) segue fail-closed. |

Nenhum evento alterou title, description, canonical, robots, sitemap ou estrutura de URL.

## 3. Separação de coortes

| Coorte | Total | Uso na leitura do D14 |
| --- | --- | --- |
| `CLEAN_COHORT` | 91 URLs | Único conjunto válido para conclusão causal sobre a consolidação D0→D14. |
| `INTERVENTION_COHORT` | 2 URLs (`/`, `/areas-atendidas`) | Lidas separadamente. Qualquer variação nelas é atribuível à intervenção, não ao baseline. |
| `INDIRECT_DISCOVERY_COHORT` | 37 URLs | Bairros/cidades que passaram a receber inbound novo do diretório. Podem ter ganho de descoberta; não entram na coorte limpa. |
| Universo curado | 130 URLs | Soma auditada contra o conjunto curado do sitemap. |

## 4. Efeito esperado por coorte

- **Coorte limpa:** nenhum efeito. Continua sendo a base de decisão A/B/C/D no D14.
- **Intervenção direta:** possível variação de engajamento e de sinais de qualidade na home e
  em `/areas-atendidas`. Não deve ser lida como resultado da consolidação de URLs.
- **Descoberta indireta:** aumento de links internos de entrada pode antecipar rastreamento de
  bairros e cidades. Uma eventual entrada no índice nessas 37 URLs deve ser atribuída ao
  diretório, e não ao tempo decorrido.

## 5. FREEZE_V2

O ledger sela um novo estado público de referência (`freezeV2`) com hash do conjunto curado e
dos conteúdos após a intervenção. A regra passa a ser: **qualquer mudança pública posterior
exige um novo evento no ledger antes do deploy**, sob pena de contaminar também a coorte limpa.

## 6. Declaração obrigatória no D14

Ao produzir o relatório do D14, a conclusão deve declarar explicitamente:

> "A leitura causal considera apenas as 91 URLs da coorte limpa. As 2 URLs intervencionadas e
> as 37 URLs de descoberta indireta são reportadas em separado."

## 7. Validações executadas nesta rodada

| Verificação | Resultado |
| --- | --- |
| `check:forbidden-copy` (CNPJ, e-mail, telefone visível, "orçamento") | PASS — nenhuma ocorrência |
| Privacidade das fotos (`photos:privacy`) | PASS — 36 arquivos aprovados, 0 reprovados |
| `check:ai-images` com fixtures | PASS — foto real aprovada; nome tipo IA e marcador de gerador bloqueados |
| Tipos (`tsgo --noEmit`) | PASS |
| Deep link `#agendamento` / `#triagem` / `#agendar` | PASS — modal abre em todos |
| Preset por rota (`/servicos/formatacao`) + avanço de etapa | PASS |
| Restauração de contexto após reload | PASS — reabre na mesma rota, sem inventar bairro/cidade |

## 8. Onde acompanhar

`/admin/monitoramento` → seção **Intervenções desde o D0**, que lê o ledger selado e exibe
eventos, coortes e o selo de integridade.
