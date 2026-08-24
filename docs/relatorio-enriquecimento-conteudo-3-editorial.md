# Micro-rodada de Enriquecimento de Conteúdo 3 — Acervo Editorial

Data: 2026-08 · Escopo: acervo editorial **indexável existente**. Sem novas URLs,
sem novos artigos, sem mudança de indexabilidade, sem redirects, sem liberar 9C.

## 1. Universo real do acervo indexável

Auditoria em `src/lib/blogEditorialRegistry.ts` + `src/lib/seo/blogPostsMeta.ts`:

| Slug | Status | Ação nesta rodada |
| --- | --- | --- |
| `/blog/organizacao-de-ti-para-pequenos-escritorios` | approved / index | Enriquecido |
| `/blog/como-escolher-uma-workstation` | approved / index | Enriquecido |
| Demais slugs de `blogPostsContent.tsx` | `in_review` (fail-closed: 404 em `/blog/$slug`) | Intocados |

Os pilares 9B, a URL em Discovery, as páginas dos Enriquecimentos 1 e 2 e as
páginas Local 2 não foram tocados — nenhum deles pertence ao conjunto acima.

## 2. Enriquecimento aplicado

Padrão editorial: **Pergunta → Resposta → Explicação → Evidência → Decisão**.

### `/blog/organizacao-de-ti-para-pequenos-escritorios`
- "Resposta curta" → **Resposta rápida** com a pergunta explícita respondida em
  bloco autossuficiente (extraível por assistentes de busca).
- Nova **tabela de diagnóstico** (causa → sintoma observável → como diferenciar →
  próxima ação) com 6 linhas de paradas evitáveis reais de escritório.
- Nova seção **"Sincronização e cópia de segurança não são a mesma coisa"** com
  definição dos dois termos e a ressalva de que a estratégia de cópias só protege
  com teste de restauração (sustentada por CISA/NIST, já registradas).
- Nova seção **"Erros comuns"** (7 itens), incluindo o antipadrão de enviar senha
  ou código por mensagem.
- Nova seção **"Segurança dos dados: limites do que fazer sozinho"** — preservar
  estado em suspeita de incidente, cópia antes de movimentação em massa.
- **Fontes primárias agora visíveis** na página via `<EditorialReferences />`
  (antes o artigo tinha fontes registradas, mas não exibidas).

### `/blog/como-escolher-uma-workstation`
- **Resposta rápida** com a pergunta explícita e definição do termo *workstation*
  como carga de trabalho, não faixa de preço.
- Nova **árvore de decisão** (pronta × sob medida × melhoria pontual) em 4 passos.
- Nova **tabela de gargalo observável** (sintoma → causa possível → como
  diferenciar → próxima ação), 5 linhas, sem número de desempenho prometido.
- Nova seção **segurança dos dados na troca de máquina** (cópia recuperável antes
  da migração; estação não é backup).
- Ponte interna contextual para `/servicos/montagem-de-pc`.

Nada de benchmark, configuração universal, promessa de desempenho, SLA ou
avaliação inventada foi introduzido — restrições de `blogEditorialSources.ts`
mantidas (workstation segue como conhecimento técnico estável, sem fonte visível).

## 3. Infraestrutura e testes

Novo gate `src/__tests__/blog-editorial-acervo.test.ts`:
1. todo `<Link to="/...">` dentro dos artigos indexáveis resolve para uma rota
   existente em `src/routes/` — impede repetir o 404 de `/como-funciona`;
2. link para `/blog/<slug>` só passa se o slug estiver aprovado em
   `blogPostsMeta.ts` (fail-closed alinhado ao `beforeLoad` da rota);
3. artigo indexável precisa ter metadata SSR **e** FAQ visível declarada
   (paridade com o JSON-LD `FAQPage`).

Resultado: 6 testes verdes.

## 4. Fora de escopo (registrado, não executado)

- Liberação de novos artigos / Rodada 9C — policy fail-closed em vigor.
- Promoção de slugs `in_review` para index.
- Qualquer redirect 301.
