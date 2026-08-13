# Rodada 12 — Headers de segurança + CSP Report-Only

Data: 2026-08-13 · Escopo: apenas headers/gates. Sem migration, sem policy, sem
conteúdo, layout, rotas, canonical, sitemap ou SEO.

## 1. Estado inicial do git

`git status --short` vazio — árvore limpa antes das alterações.

## 2. Camada responsável pelos headers

| Camada | Situação |
| --- | --- |
| Lovable managed hosting | **Emite hoje**: HSTS, `Referrer-Policy`, `X-Content-Type-Options`. Não honra `public/_headers`. |
| `public/_headers` | Política canônica; efetiva em Cloudflare Pages / Netlify / self-host. |
| Cloudflare Worker (`cloudflare/worker.js`) | **Camada correta para produção nesta zona** — roda antes da origem. Passou a aplicar a política nas respostas HTML. Ainda não publicado (pré-requisitos de zona/token). |
| vercel.json / netlify.toml / servidor | Não existem no projeto. |

Para não haver política paralela por camada, tudo passou a vir de uma **fonte
única**: `scripts/lib/security-headers.mjs`. O `_headers` é gerado dela e um gate
antidrift falha o build se divergirem.

## 3. Inventário de origens (com consumidor comprovado)

| Origem | Diretiva | Consumidor real |
| --- | --- | --- |
| `hisepaayuwxjrnumbqeq.supabase.co` | connect-src | REST/PostgREST, Auth, Storage, edge functions |
| `wss://hisepaayuwxjrnumbqeq.supabase.co` | connect-src | realtime do painel admin |
| `viacep.com.br` | connect-src | `src/lib/cepLookup.ts` (autopreenchimento bairro/cidade) |
| `ipwho.is` | connect-src | `src/lib/geoContext.ts` (cidade aproximada por IP) |
| `www.googletagmanager.com` | script-src, connect-src, frame-src | GTM |
| `www.google-analytics.com`, `region1.google-analytics.com` | script-src, connect-src | GA4 |
| `www.googleadservices.com`, `googleads.g.doubleclick.net`, `pagead2.googlesyndication.com`, `td.doubleclick.net` | script-src / connect-src / frame-src | Google Ads e conversões |
| `wa.me`, `api.whatsapp.com` | form-action | CTAs do funil (navegação, não subrecurso) |
| `images.unsplash.com` | img-src (`https:`) | imagens creditadas em páginas herdadas |

Não usados, logo **não liberados**: Google Fonts (fontes são locais), Meta,
LinkedIn, tiles de mapa (o roteamento é server-side via edge function
`ors-route`), service worker/PWA (não há registro de SW).
`schema.org` aparece só em JSON-LD (`@context`) — não é requisição de rede.

## 4. Headers antes × depois

**Produção antes (e ainda hoje, até a borda subir):** HTTPS + redirect, HSTS,
nosniff, Referrer-Policy. Sem CSP, sem anti-framing, sem Permissions-Policy.

**Política agora definida (fonte única, aplicada por `_headers` e pelo worker):**

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
X-DNS-Prefetch-Control: on
Content-Security-Policy-Report-Only: <ver abaixo>
```

- `X-Frame-Options: DENY` — nenhuma página do portal é embutida em iframe por
  domínio legítimo (verificado: não há embed/parceria de iframe).
- `geolocation=(self)` — o funil oferece "usar minha localização"; bloquear
  quebraria a funcionalidade. Câmera, microfone, pagamento e USB não têm
  consumidor → desligados.
- COOP `same-origin` é seguro: não há pop-up OAuth dependente de `window.opener`.
- **COEP e CORP ficaram de fora** — quebrariam imagens externas e integrações.

## 5. CSP Report-Only completa

```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none';
form-action 'self' https://wa.me https://api.whatsapp.com;
img-src 'self' data: blob: https:; font-src 'self' data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;
script-src-attr 'unsafe-inline';
connect-src 'self' https://hisepaayuwxjrnumbqeq.supabase.co wss://hisepaayuwxjrnumbqeq.supabase.co https://viacep.com.br https://ipwho.is https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://td.doubleclick.net;
frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net;
media-src 'self'; manifest-src 'self'; worker-src 'self' blob:
```

- **`unsafe-inline`**: mantido em `style-src` (Tailwind/motion injetam estilo em
  runtime) e em `script-src` (bootstrap do GTM e shell crítico). Removê-lo exige
  nonce/hash — refatoração ampla, fora do escopo desta rodada.
- **`unsafe-eval`**: não usado.
- **Wildcards**: nenhum. `img-src https:` é o único esquema amplo e cobre apenas
  imagens (mais restritivo que `*`, sem `http:`).
- **Sem `report-uri`/`report-to`**: não existe endpoint de coleta e esta rodada
  não cria um. Observação de violações fica via DevTools/console e pelo gate de
  inventário.

## 6. Testes

| Teste | Resultado |
| --- | --- |
| `npm run build` | passa |
| `npx tsgo --noEmit` | passa |
| `npm run check:public-data-exposure` | passa (R2, R3, O1, O2 OK) |
| `npm run check:security-headers:file` | passa (+ antidrift) |
| `npm run check:security-headers` (produção) | PASS na baseline; WARN nos headers que dependem da borda |
| `npm run check:csp-inventory` (novo) | passa — 5 origens externas, todas autorizadas |
| `bunx vitest run` | 527 testes, 14 arquivos, todos passam |

**Limitação registrada:** a varredura de violações no navegador não pôde ser
executada — o Chromium do sandbox não sobe (`libglib-2.0.so.0` ausente). Em
substituição foi criado `scripts/check-csp-inventory.mjs`, que confere de forma
determinística toda origem externa do `dist/` (HTML) e toda chamada de rede real
do código-fonte (`fetch`/`WebSocket`/`EventSource`/`XHR`) contra a política.
Violações que só aparecem em runtime (URL montada por concatenação) continuam
dependendo da inspeção do console após a borda entrar no ar.

### Classificação das ocorrências encontradas

| Ocorrência | Classe | Ação |
| --- | --- | --- |
| `viacep.com.br` ausente da CSP | A — recurso legítimo | autorizado em connect-src |
| `ipwho.is` ausente da CSP | A — recurso legítimo | autorizado em connect-src |
| `github.com`, `learn.microsoft.com`, `cisa.gov`, `linkedin.com`, `pexels.com` etc. | D — falso positivo (links `<a href>` editoriais, não subrecursos) | heurística do gate corrigida; nada liberado |
| `https://tecnico.curitiba.br${...}` | D — falso positivo (template literal do próprio domínio) | coberto por `'self'` |

## 7. Publicação

Não publicado nesta rodada. Nenhuma alteração afeta o runtime do site: as
mudanças são de política de headers (`_headers` + worker, camadas ainda não
ativas em produção), gates e um atributo `decoding="async"` em imagem do painel
admin exigido pelo gate de motion.

Consequência a registrar com honestidade: **enquanto o Worker de borda não for
publicado, produção continua sem CSP, sem X-Frame-Options e sem
Permissions-Policy.** A política existe, é validada por gate e entra em vigor no
mesmo instante em que a borda subir — não há passo manual adicional.

## 8. Riscos remanescentes

1. Sem endpoint de report, violações só são vistas por quem abre o DevTools.
2. `unsafe-inline` em script-src reduz materialmente o valor da CSP contra XSS.
3. Origens montadas dinamicamente em runtime podem não estar no inventário.

## 9. Quando converter para enforcement

Converter `Content-Security-Policy-Report-Only` em `Content-Security-Policy`
somente quando, cumulativamente:

1. a borda estiver publicada e servindo os headers por, no mínimo, 7 dias;
2. o console de produção acumular **zero** violação classe A nas rotas de
   maior tráfego (home, hubs de serviço, cidades, funil, admin);
3. `npm run check:csp-inventory` continuar limpo em dois builds seguidos;
4. e, de preferência, `unsafe-inline` de `script-src` tiver sido substituído por
   nonce — a conversão sem isso protege pouco contra XSS, embora já trave
   injeção de origem externa.

Recomendação: converter em duas etapas — primeiro `frame-ancestors`/`object-src`
já são cobertos por XFO, então o ganho real da conversão está em `script-src` e
`connect-src`; ative enforcement nessas duas depois do item 4.
