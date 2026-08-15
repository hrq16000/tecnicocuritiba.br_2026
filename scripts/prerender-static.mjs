#!/usr/bin/env node
/**
 * Prerender estático das rotas curadas.
 *
 * O prerender nativo do TanStack Start não funciona neste projeto porque o
 * nitro reescreve `dist/server` (o preview server procura `dist/server/server.js`).
 * Aqui importamos o handler já buildado e gravamos o HTML em `dist/client`,
 * garantindo title/description/H1/OG/JSON-LD mesmo sem JavaScript.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { CURATED_ROUTES } from "./curated-routes-meta.mjs";

const DIST = resolve(process.argv[2] ?? "dist");
const SERVER = join(DIST, "server/index.mjs");
const CLIENT = join(DIST, "client");
const ORIGIN = "https://tecnico.curitiba.br";
const CONCURRENCY = 6;

if (!existsSync(SERVER)) {
  console.error(`[prerender] handler não encontrado em ${SERVER}. Rode \`npm run build\` antes.`);
  process.exit(1);
}

const handler = (await import(pathToFileURL(SERVER).href)).default;

const paths = Array.from(
  new Set(["/", ...CURATED_ROUTES.map((r) => r?.path).filter((p) => typeof p === "string")]),
);

const outFile = (path) =>
  path === "/" ? join(CLIENT, "index.html") : join(CLIENT, path.replace(/^\//, ""), "index.html");

const failures = [];
let ok = 0;

async function render(path) {
  try {
    const res = await handler.fetch(new Request(`${ORIGIN}${path}`), {}, { waitUntil() {} });
    if (res.status !== 200) {
      failures.push(`${path} → HTTP ${res.status}`);
      return;
    }
    const html = await res.text();
    if (!/<title>[^<]{10,}<\/title>/i.test(html)) {
      failures.push(`${path} → HTML sem <title>`);
      return;
    }
    const file = outFile(path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    ok += 1;
  } catch (error) {
    failures.push(`${path} → ${error instanceof Error ? error.message : String(error)}`);
  }
}

const queue = [...paths];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await render(queue.shift());
  }),
);

console.log(`[prerender] ${ok}/${paths.length} rotas gravadas em ${CLIENT}`);
if (failures.length) {
  console.error(`[prerender] falhas:\n  ${failures.slice(0, 20).join("\n  ")}`);
  process.exit(1);
}
