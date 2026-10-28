import { defineConfig, devices, type ReporterDescription } from "@playwright/test";

/**
 * Configuração usada exclusivamente pelo CI para a suíte completa por navegador.
 *
 * Cada job da matriz roda com:
 *   PW_BROWSER=chromium|firefox|webkit
 *   --shard=<i>/<n>  (sharding oficial do Playwright)
 *
 * Modos de relatório (PW_REPORT_MODE):
 *   - "blob"  → gera blob report por shard, consolidado depois com `merge-reports`.
 *   - default → list + json + html locais (uso no sandbox/dev).
 *
 * Retries = 0 por padrão: a matriz não deve mascarar falhas. O rerun seletivo
 * do CI é um passo separado (`--last-failed`) cujo resultado é publicado como
 * evidência de flakiness, nunca como substituto do resultado original.
 */
const browser = (process.env.PW_BROWSER || "chromium") as "chromium" | "firefox" | "webkit";
const deviceName =
  browser === "firefox" ? "Desktop Firefox" : browser === "webkit" ? "Desktop Safari" : "Desktop Chrome";

const reportMode = process.env.PW_REPORT_MODE || "local";
const shardTag = process.env.PW_SHARD_TAG || "1";

const reporter: ReporterDescription[] =
  reportMode === "blob"
    ? [["list"], ["blob", { outputDir: `blob-report/${browser}-${shardTag}` }]]
    : [
        ["list"],
        ["json", { outputFile: `playwright-report/${browser}-${shardTag}/results.json` }],
        ["html", { outputFolder: `playwright-report/${browser}-${shardTag}/html`, open: "never" }],
      ];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: true,
  // Sem retries: falha reproduzida é falha registrada.
  retries: 0,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter,
  outputDir: `test-results/${browser}-${shardTag}`,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    launchOptions: { args: browser === "chromium" ? ["--no-sandbox", "--disable-dev-shm-usage"] : [] },
  },
  projects: [{
    name: browser,
    use: {
      ...devices[deviceName],
      // Workflow rápido pode usar o Chrome Stable pré-instalado no runner.
      ...(browser === "chromium" && process.env.PW_CHANNEL === "chrome" ? { channel: "chrome" } : {}),
    },
  }],
});
