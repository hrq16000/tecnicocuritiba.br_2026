# Observabilidade e qualidade (front-end)

## Sentry (erros de front + build)

- Módulo: `src/lib/observability/sentry.ts` (import dinâmico do `@sentry/browser`).
- Ativa **apenas** com `VITE_SENTRY_DSN` definido no build; sem DSN o bundle inicial
  não carrega o SDK (custo zero de performance).
- `release` = `__APP_VERSION__` (mesmo hash usado pelo `errorReporter`).
- Espelha o evento `app:error` do `errorReporter`, sem PII (`sendDefaultPii: false`,
  query string removida das URLs).

### Source maps no deploy

`vite.config.ts` gera `sourcemap: "hidden"` e envia os `.map` ao Sentry via
`@sentry/vite-plugin` quando o CI expõe:

| Variável | Uso |
| --- | --- |
| `SENTRY_AUTH_TOKEN` | habilita upload + sourcemap hidden |
| `SENTRY_ORG` / `SENTRY_PROJECT` | destino do release |
| `VITE_SENTRY_DSN` | habilita a captura no runtime |
| `VITE_SENTRY_ENVIRONMENT` | opcional (default: production/development) |

Os `.map` são apagados após o upload (`filesToDeleteAfterUpload`), então nada
é exposto publicamente.

## OpenTelemetry (navegação + CTAs)

- Módulo: `src/lib/observability/otel.ts` — emissor OTLP/HTTP JSON próprio,
  sem SDK pesado (velocidade é prioridade no projeto).
- Spans:
  - `navigation <rota>` — raiz por rota (pushState/replaceState/popstate criam
    um novo `traceId`, correlacionando toda a página).
  - `cta.click.whatsapp` / `cta.click.call` — filhos do span de navegação,
    disparados em `trackWaClick` / `trackCallClick`.
- Atributos: `http.route`, `app.route_type`, `app.cta_location`, `service.version`.
  Nunca inclui PII nem o número de WhatsApp.
- Ativa com `VITE_OTEL_ENDPOINT` (ex.: `https://coletor/v1/traces`) e
  `VITE_OTEL_SERVICE_NAME` (opcional). Sem endpoint → no-op absoluto.
- Envio em lote (20 spans ou 3s) e `sendBeacon` no `pagehide`/`visibilitychange`.

## Codecov

- Job `unit` no `ci.yml`: `npm run check:types` (gate obrigatório) +
  `npm run test:coverage` → upload `coverage/lcov.info` com flag `unit`.
- Job `e2e`: `codecov/test-results-action` com o `junit.xml` do Playwright
  (flag `e2e`; reporter JUnit ativado quando `CI=true`).
- Regras em `codecov.yml`: patch ≥ 70%, projeto `auto` com tolerância de 1%.
- Segredo necessário: `CODECOV_TOKEN`.

## ESLint no CI

- `npm run lint:ci` usa `--cache --cache-location .cache/eslint/ --cache-strategy content`.
- `actions/cache@v4` restaura `.cache/eslint` entre execuções (chave por
  `eslint.config.js` + lockfile), reduzindo o tempo de lint em PRs.
- Lint segue **não bloqueante** (warnings viram `::warning::`); o gate
  bloqueante é o typecheck (`check:types`, também no `prebuild`).

## Gate de Motion Principles

`npm run check:motion-coverage` (roda no `prebuild` e no CI) exige:

1. Shells `App.tsx` e `LegacyApp.tsx` com rotas `lazy`, `<Suspense>` com
   fallback de skeleton (`RouteLoader`) e `RouteProgress`.
2. Primitivas presentes: `RouteProgress`, `SmartImage`, `RouteLoader`,
   `ui/skeleton`, `lib/motion`.
3. Toda `<img>` com `loading` (lazy/eager) e `decoding` explícitos.

Falha fechada: qualquer violação quebra o build.
