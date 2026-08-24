# Enriquecimento 4A — ATP High Opportunity

Escopo: cobrir clusters de alta oportunidade do AnswerThePublic **em owners já existentes**.
Sem novas URLs, sem mudança de indexabilidade, sem redirects.

## 1. Mapa cluster → owner

| Cluster | Keywords ATP (resumo) | Owner | Estado antes | Ação executada |
|---|---|---|---|---|
| A — notebook esquenta / desliga | notebook esquentando muito, esquenta e desliga, esquenta jogando, esquenta carregando, esquenta na cama | `/problemas/notebook-superaquecendo` | PARTIAL | Quadro diagnóstico "quando o calor aparece" (9 cenários) + 2 FAQs (jogos, carregando) |
| B — SSD × HD | ssd vale a pena, diferença hd e ssd, ssd sata ou nvme, m.2 é nvme? | `/servicos/upgrade-ssd-ram` | PARTIAL | Tabela comparativa HD × SATA × NVMe + esclarecimento de formato vs barramento |
| C — RAM ou SSD primeiro | trocar ram ou ssd, quanto de ram preciso, ssd resolve lentidão | `/servicos/upgrade-ssd-ram` | PARTIAL | Árvore sintoma → RAM/SSD/investigar (8 linhas) + bloco de decisão final |
| D — recuperar dados de HD | hd com defeito, hd fazendo barulho, pede para formatar, recuperar arquivos apagados | `/servicos/recuperacao-de-dados` | WEAK | Leitura rápida do sintoma (lógico × físico) + tabela de risco (8 cenários) + limite explícito de não-garantia |
| E — formatar PC / Windows 11 | formatar resolve lentidão, formatar apaga tudo, resetar ou formatar, bitlocker | `/servicos/formatacao` | PARTIAL | Checklist pré-autorização (7 cenários) + diferença recuperação × redefinição × instalação limpa + BitLocker/licença |
| F — identificar / remover vírus | como saber se tenho vírus, pc lento é vírus?, pop-ups, navegador mudou | `/servicos/remocao-de-virus` | PARTIAL | Tabela "sintoma × é malware?" (9 linhas) separando infecção de causas físicas e de conta |

Nenhum cluster gerou owner novo — anticanibalização preservada.

## 2. Infraestrutura

- `ServicoLandingLayout.tsx`: `blocoLocal[].tabela` opcional (`headers`/`rows`), renderizada dentro da mesma seção. Aditivo, sem quebra de contrato para blocos sem tabela.
- Conteúdo comercial permanece centralizado em `src/lib/servicosCore.ts`.
- Página de sintoma (Cluster A) recebeu a tabela inline, com entrada correspondente no índice da página.

## 3. SSR e gates

- `node scripts/inject-route-head.mjs` executado: 168 rotas curadas sincronizadas, FAQs novas refletidas no manifesto de head (FAQPage estático).
- Sem alteração em sitemap, robots, canonicals ou status de indexação.

## 4. Princípios editoriais aplicados

- Toda tabela responde a uma pergunta real de busca, com coluna de "o que verificar" — utilidade pré-contato.
- Limites declarados explicitamente (formatação que não resolve, upgrade que não compensa, recuperação sem garantia).
- Nenhuma métrica, avaliação ou caso inventado; referências a documentação pública citadas de forma genérica, sem números fabricados.

## 5. Parada

Rodada 4A encerrada. Nenhuma etapa posterior iniciada.
