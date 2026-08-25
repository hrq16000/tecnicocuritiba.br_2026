# Auditoria — "Excluída pela tag noindex" (Search Console)

Data da verificação: execução de `npm run audit:noindex-live` contra
`https://tecnico.curitiba.br` (produção real, não preview).

## Resultado

**130 URLs curadas verificadas · 0 bloqueadas.**

Nenhuma URL do conjunto indexável responde com `noindex` — nem em
`X-Robots-Tag`, nem em `<meta name="robots">`. Todas retornam HTTP 200 com
canonical self-referente.

## Diagnóstico das URLs relatadas

As URLs sinalizadas no relatório do Search Console caem em dois grupos:

### 1. Páginas de serviço × localidade (ex.: `/servicos/upgrade-ssd/colombo`,
`/servicos/conserto-notebook/campo-largo`, `/servicos/conserto-pc/curitiba`,
`/servicos/computador-nao-liga`)

Verificação live: **HTTP 200, `index, follow`, canonical self**. O `noindex`
que o Search Console reporta é estado **histórico**, anterior à consolidação e
à migração de stack. Nada há para corrigir no código — o relatório é defasado
(o GSC leva de dias a semanas para reprocessar). A ação correta é solicitar
revalidação no próprio Search Console, não alterar o registro de indexação.

Essas URLs ainda **não estão no sitemap curado**. Incluí-las agora alteraria o
conjunto de 130 URLs que sustenta o experimento D0 → D14 e quebraria o gate de
reconciliação de coortes (91 CLEAN + 2 DIRECT + 37 INDIRECT). Ficam
**enfileiradas para promoção pós-D14**, com o mesmo rito das ondas anteriores.

### 2. URLs de blog listadas (ex.: `/blog/como-instalar-segundo-ssd-notebook`,
`/blog/preciso-de-um-*`, `/blog/melhores-ias-para-programacao-2026`)

Verificação live: **HTTP 404**. Esses caminhos não existem neste projeto — são
resquícios de conteúdo herdado de outra propriedade. Um 404 não pode ser
"desbloqueado": não há página para indexar. O comportamento atual (404 real,
sem canonical, sem JSON-LD, `noindex` aplicado no cliente) é o correto.
Publicar conteúdo nesses caminhos só faria sentido com material autoral novo,
o que é decisão editorial — não correção técnica.

## Gate permanente

`npm run audit:noindex-live` passa a ser o verificador oficial: falha (exit 1)
se qualquer URL curada aparecer bloqueada em produção. Use-o antes de reagir a
qualquer relatório de `noindex` do Search Console.
