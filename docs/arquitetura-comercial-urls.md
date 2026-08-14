# Arquitetura comercial de URLs e clusters de palavras-chave

Fonte única de verdade em código: `scripts/lib/comercial-onda2.mjs`.
Nenhuma rota nova é criada por este documento — ele organiza a intenção de
busca das páginas curadas já existentes e evita canibalização.

## Regras

1. **Uma keyword principal por URL.** Duplicidade derruba o gate
   `npm run check:comercial-seo` (função `keywordsDuplicadas`).
2. **Canonical self-referente absoluto** em `https://tecnico.curitiba.br<path>`,
   idêntico ao `og:url`; `og:site_name` sempre `Técnico em Curitiba`.
3. **Sem novas famílias de URL.** Intenções novas são absorvidas por H2/FAQ de
   páginas existentes.
4. **Interlinking mínimo obrigatório:** hub → serviços empresariais e de
   manutenção (gate `check:hub-links`); serviço → cidades âncora; cidade →
   serviços do cluster.

## Clusters

| Cluster | Hub / pilar | Páginas | Intenção |
| --- | --- | --- | --- |
| empresarial | `/empresa-de-ti-curitiba` | suporte-tecnico-empresarial, manutencao-preventiva-empresas, backup-para-empresas, suporte-home-office | comercial B2B |
| reparo | `/servicos` | manutencao-de-computador, manutencao-de-notebook | transacional |
| hardware | `/servicos` | montagem-de-pc, upgrade-ssd-ram | transacional |
| software | `/servicos` | formatacao, remocao-de-virus | transacional |
| dados | `/servicos` | recuperacao-de-dados | transacional |
| redes | `/servicos` | redes-e-wifi | transacional |
| multieletrônicos | `/servicos` | conserto-tv, conserto-placa, conserto-monitor | transacional |
| local | `/tecnico-informatica-curitiba` | 6 cidades âncora | local |

## Hierarquia de headings das páginas curadas

- **H1 único** = keyword principal + cidade quando a intenção for local
  (ex.: "Manutenção de computador em Curitiba").
- **H2 (3 a 6)** = keywords de apoio do mapa, em linguagem natural:
  sintomas atendidos, como funciona, prazo e garantia, preço/orçamento,
  bairros e cidades atendidas, perguntas frequentes.
- **H3** apenas dentro de FAQ e checklists — nunca para repetir a keyword.
- Meta title ≤ 70 caracteres com keyword principal + marca;
  meta description 70–165 caracteres com benefício + chamada ao WhatsApp.
  Limites validados por `scripts/lib/seo-meta.mjs` e `check:meta-uniqueness`.

## Schemas obrigatórios

| Tipo de página | Schemas |
| --- | --- |
| Hub empresarial | Service + FAQPage + LocalBusiness |
| Serviço | Service + FAQPage |
| Cidade | LocalBusiness + FAQPage |

Nunca emitir `aggregateRating`/`review` sem avaliação real verificada.

## Gates e relatórios

| Comando | O que garante |
| --- | --- |
| `npm run check:comercial-seo` | canonical, og:url, og:site_name, schemas e presença no sitemap das rotas comerciais |
| `npm run check:hub-links` | hub empresarial linka todas as páginas de suporte/manutenção, sem link quebrado |
| `npm run report:sitemap-inclusions` | o que entrou no sitemap e por qual gate cada URL ficou de fora |
| `npm run report:ci-dashboard` | painel pós-deploy + Lighthouse por ambiente/branch com histórico |
| `npm run monitor:indexing:alert -- --target=80` | cobertura de indexação no GSC abaixo do alvo |
