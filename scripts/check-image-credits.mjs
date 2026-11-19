#!/usr/bin/env node
/**
 * GATE — Licenças e créditos das fotos públicas.
 *
 * Percorre o dist/ e, para cada página que exibe fotografia remota:
 *   • bloqueia qualquer host fora da allow-list licenciada (Unsplash/Pexels);
 *   • exige crédito visível ("Foto: ...") no mesmo documento;
 *   • exige link para a licença correspondente;
 *   • bloqueia marcadores de imagem gerada por IA (midjourney, dall-e, etc.).
 *
 * Uso: node scripts/check-image-credits.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { ALLOWED_REMOTE_HOSTS, CREDIT_PREFIX, creditFor } from "./lib/image-credits.mjs";

const DIST = path.resolve(process.argv[2] || "dist");
if (!existsSync(DIST)) {
  console.error(`BLOQUEADO: ${DIST} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

const AI_MARKERS = ["midjourney", "dall-e", "dalle", "stable-diffusion", "ai-generated", "leonardo.ai", "firefly-generated"];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) walk(full);
    else if (e === "index.html") files.push(full);
  }
})(DIST);

const errors = [];
let pagesWithPhotos = 0;
let photos = 0;

for (const file of files.sort()) {
  const route = ("/" + path.relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/")).replace(/\/$/, "") || "/";
  const html = readFileSync(file, "utf8");
  // Marcadores de IA são procurados apenas nas tags de imagem (o texto
  // editorial pode citar essas ferramentas legitimamente).
  const imgTags = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0].toLowerCase());
  for (const tag of imgTags)
    for (const marker of AI_MARKERS)
      if (tag.includes(marker)) errors.push(`${route}: imagem gerada por IA ("${marker}")`);

  const srcs = [...html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  if (!srcs.length) continue;
  pagesWithPhotos++;

  const hasCredit = html.includes(CREDIT_PREFIX);
  for (const src of srcs) {
    photos++;
    const remote = new URL(src);
    const host = remote.host;
    // Endereço absoluto no próprio domínio é asset local, não foto de terceiro.
    // Exigir existência no build servido; URL remota não concede licença presumida.
    if (remote.origin === "https://tecnico.curitiba.br") {
      const localPath = path.resolve(DIST, "." + decodeURIComponent(remote.pathname));
      if (!localPath.startsWith(DIST + path.sep) || !existsSync(localPath) || !statSync(localPath).isFile()) {
        errors.push(`${route}: imagem do próprio domínio não encontrada no build — ${remote.pathname}`);
      }
      continue;
    }
    if (!ALLOWED_REMOTE_HOSTS.includes(host)) {
      errors.push(`${route}: host de imagem não licenciado — ${host}`);
      continue;
    }
    const credit = creditFor(src);
    if (!hasCredit) {
      errors.push(`${route}: foto de ${host} sem crédito visível ("${CREDIT_PREFIX} ...")`);
      continue;
    }
    if (!html.includes(credit.licenseUrl))
      errors.push(`${route}: crédito sem link para a licença (${credit.licenseUrl})`);
    // O crédito precisa estar dentro de um <figcaption> — nunca solto no rodapé.
    const inFigcaption = /<figcaption[^>]*>[^<]*Foto:/.test(html) || /<figcaption[\s\S]{0,400}?Foto:/.test(html);
    if (!inFigcaption) errors.push(`${route}: crédito fora de <figcaption> (local incorreto)`);
  }
}

if (errors.length) {
  const unique = [...new Set(errors)];
  console.error(`BLOQUEADO — ${unique.length} problema(s) de licença/crédito de imagem:`);
  unique.slice(0, 40).forEach((e) => console.error(`  • ${e}`));
  if (unique.length > 40) console.error(`  … +${unique.length - 40}`);
  process.exit(1);
}

console.log(`OK — ${photos} foto(s) licenciada(s) em ${pagesWithPhotos} página(s), todas com crédito visível em <figcaption>.`);
