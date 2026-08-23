#!/usr/bin/env node
/**
 * GATE — Conteúdo crítico no HTML servido (sem depender de JS).
 *
 * Amostra as famílias de rotas mais importantes (home, serviços, bairros,
 * cidades, problemas) e exige, no HTML estático:
 *   • exatamente 1 <h1> com texto;
 *   • quantidade mínima de <h2> (blocos principais renderizados no servidor);
 *   • quantidade mínima de palavras visíveis;
 *   • FAQ visível quando a página declara FAQPage (pergunta + resposta em texto);
 *   • pelo menos 3 links internos <a href="/...">.
 *
 * Uso: node scripts/check-ssr-critical.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const DIST = resolve(process.argv[2] ?? "dist");
const CLIENT = existsSync(join(DIST, "client")) ? join(DIST, "client") : DIST;

if (!existsSync(CLIENT)) {
  console.error(`[ssr-critical] BLOQUEADO: ${CLIENT} não existe — rode "npm run build".`);
  process.exit(1);
}

/** Famílias auditadas: prefixo → requisitos mínimos. */
const FAMILIES = [
  { id: "home", match: (p) => p === "/", minWords: 800, minH2: 5 },
  { id: "servico", match: (p) => p.startsWith("/servicos/"), minWords: 450, minH2: 3 },
  { id: "bairro", match: (p) => p.startsWith("/bairros/"), minWords: 400, minH2: 3 },
  { id: "cidade", match: (p) => p.startsWith("/tecnico-informatica-"), minWords: 400, minH2: 3 },
  { id: "problema", match: (p) => p.startsWith("/problemas/"), minWords: 450, minH2: 3 },
];

const locs = new Set();
for (const file of readdirSync(CLIENT).filter((f) => /^sitemap.*\.xml$/.test(f))) {
  const xml = readFileSync(join(CLIENT, file), "utf8");
  if (/<sitemapindex/i.test(xml)) continue;
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) locs.add(m[1]);
}

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const errors = [];
const stats = new Map();

for (const loc of [...locs].sort()) {
  let pathname;
  try {
    pathname = new URL(loc).pathname;
  } catch {
    continue;
  }
  const fam = FAMILIES.find((f) => f.match(pathname));
  if (!fam) continue;
  const file =
    pathname === "/" ? join(CLIENT, "index.html") : join(CLIENT, pathname.replace(/^\/|\/$/g, ""), "index.html");
  if (!existsSync(file)) continue;

  const html = readFileSync(file, "utf8");
  stats.set(fam.id, (stats.get(fam.id) ?? 0) + 1);

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1])).filter(Boolean);
  if (h1s.length !== 1) errors.push(`${pathname}: ${h1s.length} <h1> com texto (esperado 1)`);

  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => text(m[1])).filter(Boolean);
  if (h2s.length < fam.minH2) errors.push(`${pathname}: ${h2s.length} <h2> no SSR (mínimo ${fam.minH2})`);

  const words = text(html).split(" ").filter(Boolean).length;
  if (words < fam.minWords) errors.push(`${pathname}: ${words} palavras no HTML servido (mínimo ${fam.minWords})`);

  const internos = new Set(
    [...html.matchAll(/<a[^>]+href=["'](\/[^"'#?]*)["']/gi)].map((m) => m[1].replace(/\/$/, "")),
  );
  if (internos.size < 3) errors.push(`${pathname}: apenas ${internos.size} link(s) interno(s) no SSR`);

  // Paridade FAQ: se declara FAQPage, as perguntas precisam estar no texto.
  const faqBlock = html.match(/"@type"\s*:\s*"FAQPage"[\s\S]{0,60}/i);
  if (faqBlock) {
    const visible = text(html).toLowerCase();
    const perguntas = [...html.matchAll(/"@type"\s*:\s*"Question"\s*,\s*"name"\s*:\s*"([^"]{10,120})"/g)].map(
      (m) => m[1],
    );
    if (!perguntas.length) errors.push(`${pathname}: FAQPage sem perguntas legíveis`);
    const ausentes = perguntas.filter((q) => !visible.includes(q.slice(0, 35).toLowerCase()));
    if (ausentes.length)
      errors.push(`${pathname}: ${ausentes.length} pergunta(s) de FAQ fora do HTML visível (ex.: "${ausentes[0]}")`);
  }
}

if (errors.length) {
  console.error(`[ssr-critical] BLOQUEADO — ${errors.length} problema(s):`);
  errors.slice(0, 60).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 60) console.error(`  … +${errors.length - 60}`);
  process.exit(1);
}

const resumo = [...stats].map(([k, v]) => `${k}:${v}`).join(" · ");
console.log(`[ssr-critical] ok — H1, blocos, FAQs e links internos presentes no HTML servido (${resumo}).`);
