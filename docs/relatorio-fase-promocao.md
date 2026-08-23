# Fase de promoção — malha interna + correção dos desvios live

Build validado em 2026-08-23 · 170 URLs indexáveis.

## 1. Malha interna (HTML SSR, gate `audit:internal-graph --gate`)

| Métrica | Valor |
| --- | ---: |
| URLs indexáveis | 170 |
| Órfãs (0 inbound) | 0 |
| Órfãs contextuais | 1 (`/anuncie`) |
| Inalcançáveis pela home | 0 |
| Sub-linkadas (1–2 inbound contextuais) | 35 |

Profundidade de clique a partir da home: 0→1 · 1→35 · 2→110 · 3→14 · 4→8 · 5→2.
Todas as páginas de bairro, problema, serviço e cidade estão em ≤2 cliques, exceto
24 combinações `serviço × bairro` das verticais `manutencao-tv` e `redes-wifi`
(3–5 cliques), alcançadas via hub de serviço → bairro → serviço local. Sem risco de
inacessibilidade; entram na fila de encurtamento da próxima onda.

`/anuncie` é comercial (venda de mídia), fora do funil técnico: recebe link apenas
de header/footer por decisão editorial — classificado como aceitável, não é P0.

## 2. Anticanibalização dos sintomas

`reports/problemas-relacoes.md` — 36 rotas com bloco "Próximos problemas",
144 relações: 0 de MESMA INTENÇÃO, 27 de investigação (mesmo equipamento,
sintoma distinto), 117 complementares. O gerador descarta pares acima de 0,8 de
afinidade, então nenhuma página disputa a mesma consulta com outra.

## 3. JSON-LD dos artigos — causa-raiz e consolidação

**Causa-raiz:** `src/pages/BlogPost.tsx` e `src/components/BlogPostFAQ.tsx`
criavam `<script type="application/ld+json">` direto no `document.head` durante a
hidratação, enquanto o SSR (`src/lib/seo/routeHead.ts`) já emitia
BreadcrumbList/FAQPage/entidade editorial. Resultado em produção: BreadcrumbList ×2,
FAQPage ×2 e duas entidades editoriais concorrentes por artigo.

**Correção:** ambos passaram a usar o registry determinístico `useJsonLdSlot`
(`SCHEMA_SLOTS.breadcrumb`, `.article`, `.faq`, prioridade `page`), que adota o nó
já emitido no SSR em vez de criar outro.

**Prova pós-hidratação** (Chromium, `networkidle`): cada artigo expõe exatamente
`Article` + `BreadcrumbList`, 0 `@id` duplicado, 0 erro de console.

**Antirregressão:** gate `check:blog-jsonld` (estático + HTML servido) no pipeline de
build e `e2e/blog-jsonld-hydration.spec.ts` para o DOM hidratado.

## 4. Headers de segurança emitidos pelo app

`src/lib/securityHeaders.ts` espelha a fonte única `scripts/lib/security-headers.mjs`
e `src/server.ts` aplica em toda resposta HTML: `X-Frame-Options: DENY`,
`Permissions-Policy`, `Referrer-Policy`, `X-Content-Type-Options`, COOP e
`Content-Security-Policy-Report-Only` (observação, sem bloqueio). HSTS continua vindo
da plataforma; o app não sobrescreve. Gate `check:security-headers` bloqueia drift
entre a política `.mjs` e a `.ts`.

## 5. Classificação dos desvios live

| Desvio | Classe | Decisão |
| --- | --- | --- |
| `www` → apex responde 302 | PLATFORM LIMITATION | O 301 do `src/server.ts` só executa quando a requisição chega ao worker; o redirect de host é resolvido antes, na borda da plataforma. Sem controle pelo app. Impacto de SEO nulo (consolidação por canonical + destino único). |
| `/index.html` responde 200 | PLATFORM LIMITATION | Servido como asset estático antes do worker. Mitigado por canonical self-referente em `/` e ausência de link interno para `/index.html`. |
| URLs fora do sitemap (`/marcas/*`, `/procedimentos/*`) sem canonical | APP — opção B | Permanecem `noindex` e fora do sitemap pela política de poda; não recebem link interno indexável. Nenhuma ação de indexação. |

## 6. Gates reexecutados (build verde)

`route-head` · `anon-access` · `prerender 170/170` · `dist-artifacts` ·
`sitemap-http` (170 URLs, canonical self-referente, metadados únicos) ·
`jsonld-integrity` (170 páginas) · `blog-jsonld` · `ssr-critical` ·
`internal-graph --gate` · `security-headers`.

**Resultado: GO para a Fase P2.**
