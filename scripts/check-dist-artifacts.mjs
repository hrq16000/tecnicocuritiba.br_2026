#!/usr/bin/env node
/**
 * Gate: valida que o build gerou os artefatos HTML estáticos esperados.
 * Falha com mensagem clara quando o prerender não produziu HTML — evita que
 * gates de SEO do postbuild quebrem com "arquivo não encontrado".
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const DIST = resolve(process.argv[2] ?? "dist");
const CLIENT = existsSync(join(DIST, "client")) ? join(DIST, "client") : DIST;

const htmlFor = (path) =>
  path === "/" ? join(CLIENT, "index.html") : join(CLIENT, path.replace(/^\//, ""), "index.html");

const expected = [
  "/",
  ...CURATED_PATHS.filter((p) => p.startsWith("/servicos") || p.startsWith("/tecnico-informatica")),
];

const missing = expected.filter((p) => !existsSync(htmlFor(p)));

if (!existsSync(htmlFor("/"))) {
  console.error(
    `[dist-artifacts] HTML estático da raiz não encontrado em ${htmlFor("/")}.\n` +
      "  O prerender do TanStack Start não rodou ou falhou.\n" +
      "  Verifique `tanstackStart.prerender`/`pages` em vite.config.ts e rode `npm run build`.",
  );
  process.exit(1);
}

const semTitulo = expected
  .filter((p) => existsSync(htmlFor(p)))
  .filter((p) => {
    const html = readFileSync(htmlFor(p), "utf8");
    return !/<title>[^<]{10,}<\/title>/i.test(html) || !/name="description"/i.test(html);
  });

if (missing.length) {
  console.error(
    `[dist-artifacts] ${missing.length} rota(s) sem HTML estático em ${CLIENT}:\n  ${missing
      .slice(0, 20)
      .join("\n  ")}`,
  );
}
if (semTitulo.length) {
  console.error(
    `[dist-artifacts] ${semTitulo.length} HTML sem <title>/<meta description>:\n  ${semTitulo
      .slice(0, 20)
      .join("\n  ")}`,
  );
}
if (missing.length || semTitulo.length) process.exit(1);

console.log(`[dist-artifacts] ok — ${expected.length} HTML estáticos validados em ${CLIENT}`);
