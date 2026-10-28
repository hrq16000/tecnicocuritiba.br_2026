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
import type { Plugin } from "vite";
import { generateProblemaArticles } from "./scripts/generate-problema-articles.mjs";

// Diagnóstico de build no GitHub; não emite arquivo público nem código cliente.
const entryBundleReport: Plugin = {
  name: "entry-bundle-report",
  generateBundle(_options, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== "chunk" || !chunk.fileName.startsWith("assets/index-")) continue;
      const modules = Object.entries(chunk.modules)
        .map(([id, info]) => ({ id: id.replace(process.cwd(), "."), bytes: info.renderedLength }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 15);
      const problemId = Object.keys(chunk.modules).find((id) => id.endsWith("/problemaPagesData.ts"));
      const problemImporters = problemId ? this.getModuleInfo(problemId)?.importers : [];
      console.log("[entry-bundle-report]", JSON.stringify({ file: chunk.fileName, bytes: Buffer.byteLength(chunk.code), modules, problemImporters }));
    }
  },
};

const resolveAppVersion = () => {
  if (process.env.APP_VERSION) return process.env.APP_VERSION;
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  if (process.env.COMMIT_REF) return process.env.COMMIT_REF.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return `b${Date.now().toString(36)}`;
  }
};

const APP_VERSION = resolveAppVersion();
const APP_BUILD_TIME = new Date().toISOString();
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || "";
const SENTRY_ORG = process.env.SENTRY_ORG || "";
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || "";

export default defineConfig({
  nitro: {
    // Evita um ciclo de chunks do Nitro que deixa `__exportAll` indefinido no
    // worker SSR compilado. O bundle único é compatível com o worker
    // Cloudflare e mantém o handler importável no prerender.
    rollupConfig: {
      output: { inlineDynamicImports: true },
    },
  } as any,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      { name: "prepare-problema-articles", configResolved: async () => { await generateProblemaArticles(); } },
      process.env.GITHUB_ACTIONS === "true" ? entryBundleReport : null,
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
