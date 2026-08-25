# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Security regression gates

The database security posture for `reviews` and `og_validation_status` is guarded
by two automated gates that use **only** the public URL + publishable/anon key
(never the service_role key, never PII):

```sh
# Run both gates locally with clear per-invariant output (✓ / ✗)
npm run check:security

# Or run each individually
npm run check:public-data-exposure   # anon cannot read client_phone / select=* / og_validation_status
npm run check:security-findings      # fails if a NEW finding appears vs the committed baseline
```

Example output (all invariants holding):

```text
Public data exposure gate (anon key only)

  ✓ R1  anon can read safe public review columns (200)
  ✓ R2  anon cannot read client_phone (401)
  ✓ R3  anon cannot select=* on reviews (401)
  ✓ O1  anon cannot read og_validation_status (401)
  ✓ O2  anon cannot INSERT into og_validation_status (401)

OK: all public-data-exposure invariants hold.
```

If a private surface becomes reachable, the failing line is printed as
`✗ <id>  CONTRACT VIOLATED: ...` / `✗ <finding>  NEW FINDING: ...` and the
process exits non-zero. Both gates run in CI on **every pull request**
(`.github/workflows/security.yml`) and block the merge on any regression, and
`check:security-findings` also runs during `prebuild` so a regression fails the
build. They skip gracefully (exit 0) when run offline / without env.

### Manual check: authenticated non-admin sees zero reviews (no committed credentials)

The gates above only cover the anonymous role. Verifying that a **logged-in
non-admin** user gets zero rows and no `client_phone` requires a real session,
which cannot be automated without storing credentials. Do this by hand — never
commit any e-mail, password, or token:

1. Create a throwaway non-admin account **outside the repo** (do not add it to
   the `user_roles` table). Keep the credentials only in your password manager.
2. Sign in through the running app (`npm run dev`) as that user.
3. Open the browser DevTools console on any app page and run:

   ```js
   // Uses the app's already-authenticated Supabase client — no keys typed here.
   const { data, error } = await window.supabase?.from("reviews").select("*");
   console.log({ rows: data?.length ?? 0, error });
   ```

   If `window.supabase` is not exposed, run the same query from a component
   during development instead.
4. **Expected result:** `rows: 0` and no `client_phone` values anywhere in
   `data`, because the only `authenticated` SELECT policies require
   `has_role('admin')`. A non-zero row count or any `client_phone` value is a
   regression — stop and fix the RLS policy before shipping.
5. Sign out and delete the throwaway account when finished.

> Do not paste credentials into any script, test, `.env`, or commit. The manual
> step exists precisely so no login secret ever enters version control.


## Gate `check:orphan-trend` (páginas órfãs indexáveis)

O gate conta quantas URLs **curadas e indexáveis** (`index, follow`) não recebem
nenhum link interno a partir do código-fonte e falha o build quando esse número
**cresce** em relação ao baseline.

- **Baseline canônico (versionado em git):** `scripts/data/orphan-baseline.json`
- **Cópia publicada no build (paridade staging/produção):** `public/orphan-baseline.json`
  — regravada automaticamente em cada execução do gate.

Comandos:

```bash
npm run check:orphan-trend        # gate (compara com o baseline)
npm run check:orphan-baseline     # falha se o baseline não estiver commitado
npm run orphan:update             # regrava o baseline — COMMITE o arquivo
```

Quando usar `--update` (`npm run orphan:update`):

1. ao **remover** uma URL da lista curada ou ao consolidar rotas com 301;
2. ao **reduzir** o número de órfãs (o novo patamar precisa ser selado);
3. nunca para "silenciar" o gate: se órfãs subiram, adicione o link interno real
   (hub, cluster ou grade local) em vez de reescrever o baseline.

Rotas isentas por contrato (não dependem de link estático e não fazem parte do
funil orgânico): segmentos dinâmicos (`$param`), `/admin/*`,
`/ordem-de-servico/*` e âncoras/modais. O ajuste reduz falso positivo sem
relaxar a checagem estrutural das páginas de conteúdo.

O `prebuild` executa `--assert-baseline` **antes** do gate: se o arquivo estiver
ausente, o build para com instrução explícita de rodar `npm run orphan:update` e
commitar o resultado. O mesmo passo roda no workflow de segurança do CI.

## Ferramentas MCP — autorização e auditoria

- O servidor MCP exige OAuth (token emitido pelo backend do projeto, audiência
  `authenticated`). Sem token válido a resposta é `401`.
- Testes automatizados: `src/lib/mcp/__tests__/mcp-auth-audit.test.ts`
  (configuração de auth + auditoria) e `e2e/mcp-oauth.spec.ts` (negado sem token,
  negado com token inválido, permitido com token válido quando
  `MCP_TEST_ACCESS_TOKEN` existe no ambiente).
- Cada execução de ferramenta emite um log estruturado de uma linha com
  `tool`, `route`, `owner` (hash curto, jamais o identificador em claro) e
  `outcome`. É proibido registrar PII, token, cabeçalhos ou payload do usuário.
