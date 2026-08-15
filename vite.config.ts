// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { execSync } from "node:child_process";
import { imagetools } from "vite-imagetools";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { CURATED_ROUTES } from "./scripts/curated-routes-meta.mjs";

/**
 * Prerender estático: raiz + rotas comerciais (serviços, cidades e bairros).
 * Garante HTML com title/description/H1/OG mesmo sem JS, e artefatos em dist
 * para os gates de SEO do postbuild.
 */
const PRERENDER_PATHS: string[] = Array.from(
  new Set<string>(["/", ...CURATED_ROUTES.map((r: { path: string }) => r.path)]),
);

const APP_VERSION = resolveAppVersion();
const APP_BUILD_TIME = new Date().toISOString();
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || "";
const SENTRY_ORG = process.env.SENTRY_ORG || "";
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || "";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    prerender: { enabled: true, concurrency: 4, failOnError: false, crawlLinks: false },
    pages: PRERENDER_PATHS.map((path) => ({ path, prerender: { enabled: true } })),
  },
  vite: {
    plugins: [
      imagetools(),
      mcpPlugin(),
      // Upload de source maps para o Sentry apenas quando o CI tem credenciais.
      SENTRY_AUTH_TOKEN && SENTRY_ORG && SENTRY_PROJECT
        ? sentryVitePlugin({
            org: SENTRY_ORG,
            project: SENTRY_PROJECT,
            authToken: SENTRY_AUTH_TOKEN,
            release: { name: APP_VERSION },
            telemetry: false,
            sourcemaps: { filesToDeleteAfterUpload: ["dist/**/*.map"] },
          })
        : null,
    ].filter(Boolean),
    define: {
      __APP_VERSION__: JSON.stringify(APP_VERSION),
      __APP_BUILD_TIME__: JSON.stringify(APP_BUILD_TIME),
    },
  },
});
