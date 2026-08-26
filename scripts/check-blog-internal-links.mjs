#!/usr/bin/env node
/**
 * GATE CONTÍNUO — LINKS INTERNOS DO ACERVO EDITORIAL
 *
 * O acervo do blog é fail-closed: só slugs aprovados existem como rota, e
 * qualquer outro `/blog/<slug>` responde 404 real. Isso torna links internos
 * para artigos em revisão um defeito silencioso de UX e de crawl.
 *
 * Este gate verifica, para todo link interno emitido pelas páginas do blog e
 * por qualquer página que aponte para /blog/*:
 *   - o destino existe como rota real (arquivo em src/routes) ou está no
 *     sitemap curado;
 *   - o destino não é um slug de blog fora do conjunto aprovado;
 *   - opcionalmente (--live), o destino responde HTTP 200 em produção.
 *
 * Saída: reports/blog-link-fixes.json + lista de correções no stdout.
 * Falha (exit 1) sempre que houver link para rota inexistente.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const live = process.argv.includes("--live");
const BASE = "https://tecnico.curitiba.br";

// ── 1. Rotas reais declaradas no roteador de arquivos ──────────────────────
const rotas = new Set();
for (const f of readdirSync("src/routes")) {
  if (!/\.tsx?$/.test(f) || f.startsWith("__")) continue;
  let p = f.replace(/\.tsx?$/, "");
  if (p === "index") {
    rotas.add("/");
    continue;
  }
  p = p.replace(/\.index$/, "");
  if (p.includes("$") || p.includes("[")) continue; // dinâmicas: validadas pelo slug aprovado
  rotas.add(`/${p.replace(/\./g, "/")}`);
}
// Rotas em subdiretórios.
const walk = (dir, prefix) => {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) walk(full, `${prefix}/${entry}`);
    else if (/\.tsx?$/.test(entry) && !entry.startsWith("__")) {
      const name = entry.replace(/\.tsx?$/, "");
      if (name.includes("$")) continue;
      rotas.add(name === "index" ? prefix : `${prefix}/${name.replace(/\./g, "/")}`);
    }
  }
};
for (const entry of readdirSync("src/routes")) {
  const full = resolve("src/routes", entry);
  if (statSync(full).isDirectory()) walk(full, `/${entry}`);
}

// ── 2. Sitemap curado (destinos legítimos servidos hoje) ───────────────────
const sitemap = new Set();
for (const f of readdirSync("public").filter((x) => x.startsWith("sitemap-") && x.endsWith(".xml"))) {
  const xml = readFileSync(resolve("public", f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemap.add(m[1].trim().replace(BASE, "") || "/");
}

// ── 3. Slugs de blog aprovados (fonte única) ──────────────────────────────
const metaFile = "src/lib/seo/blogPostsMeta.ts";
const metaSrc = existsSync(metaFile) ? readFileSync(metaFile, "utf8") : "";
const aprovados = new Set([...metaSrc.matchAll(/^\s*"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]));
for (const p of sitemap) if (p.startsWith("/blog/")) aprovados.add(p.slice("/blog/".length));

// ── 4. Links internos no código-fonte ─────────────────────────────────────
const fontes = [];
const collect = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) collect(full);
    else if (/\.(tsx?|mjs)$/.test(entry)) fontes.push(full);
  }
};
collect("src");
collect("scripts");

const problemas = [];
const informativos = [];
const linksBlog = [];

/**
 * Em `src/data/blogPostsContent.tsx` os corpos de artigos em revisão convivem
 * com os aprovados. Um link para slug não aprovado só é defeito real quando
 * está DENTRO de um artigo servido — o corpo de um artigo que responde 404
 * nunca chega ao usuário. A dona do link é a última chave de slug anterior.
 */
function donoDoTrecho(src, index) {
  let dono = null;
  for (const m of src.matchAll(/^\s{0,4}"([a-z0-9-]+)":\s*\{/gm)) {
    if (m.index > index) break;
    dono = m[1];
  }
  return dono;
}

for (const file of fontes) {
  if (file.includes("__tests__") || file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;
  const src = readFileSync(file, "utf8");
  const rel = file.replace(`${process.cwd()}/`, "");
  const acervo = rel.endsWith("src/data/blogPostsContent.tsx");
  const padroes = [
    /<Link\b[^>]*\bto="(\/[^"]*)"/g,
    /<a\b[^>]*\bhref="(\/blog\/[^"]*)"/g,
    /\bto:\s*"(\/blog\/[^"]*)"/g,
  ];
  for (const re of padroes) {
    for (const m of src.matchAll(re)) {
      const href = m[1].split(/[?#]/)[0].replace(/\/+$/, "") || "/";
      if (href.includes("${") || href.includes("{") || href.includes("$")) continue; // caminho dinâmico: validado em runtime
      const linha = src.slice(0, m.index).split("\n").length;
      const dono = acervo ? donoDoTrecho(src, m.index) : null;
      const servido = !acervo || (dono !== null && aprovados.has(dono));
      if (href.startsWith("/blog/")) {
        const slug = href.slice("/blog/".length);
        linksBlog.push({ file: rel, linha, href, dono, servido });
        if (aprovados.has(slug)) continue;
        const registro = {
          file: rel,
          linha,
          href,
          dono,
          motivo: "slug de blog fora do conjunto aprovado — a rota responde 404 real",
          correcao: "apontar para uma página publicada equivalente ou aprovar o artigo no acervo editorial",
        };
        if (servido) problemas.push(registro);
        else informativos.push({ ...registro, motivo: `${registro.motivo} (dentro de artigo não servido: ${dono})` });
        continue;
      }
      if (href.startsWith("/admin") || href === "/" || href.startsWith("http")) continue;
      if (!rotas.has(href) && !sitemap.has(href)) {
        const registro = {
          file: rel,
          linha,
          href,
          dono,
          motivo: "destino não corresponde a nenhuma rota real nem ao sitemap curado",
          correcao: "corrigir o caminho ou criar/registrar a rota antes do deploy",
        };
        if (servido) problemas.push(registro);
        else informativos.push(registro);
      }
    }
  }
}


// ── 5. Verificação live opcional dos links do blog servidos em produção ───
if (live) {
  const alvos = [...new Set(linksBlog.filter((l) => l.servido).map((l) => l.href))];
  for (const href of alvos) {
    try {
      const res = await fetch(`${BASE}${href}`, { redirect: "manual" });
      if (res.status !== 200)
        problemas.push({
          file: "(live)",
          linha: 0,
          href,
          motivo: `produção responde HTTP ${res.status}`,
          correcao: "remover o link ou publicar o destino",
        });
    } catch (e) {
      problemas.push({ file: "(live)", linha: 0, href, motivo: String(e).slice(0, 100), correcao: "verificar destino" });
    }
  }
}

writeFileSync(
  "reports/blog-link-fixes.json",
  JSON.stringify(
    {
      geradoEm: new Date().toISOString(),
      slugsAprovados: [...aprovados].sort(),
      linksBlogEncontrados: linksBlog.length,
      linksEmPaginasServidas: linksBlog.filter((l) => l.servido).length,
      correcoesPendentes: problemas,
      // Não bloqueiam o deploy hoje, mas viram dívida no dia em que o artigo dono for aprovado.
      pendenciasEmArtigosNaoServidos: informativos,
    },
    null,
    2,
  ),
);

if (problemas.length) {
  console.error(`check:blog-internal-links FALHOU — ${problemas.length} link(s) para rota inexistente em página servida:`);
  for (const p of problemas) console.error(`  ✗ ${p.file}:${p.linha} → ${p.href}\n      ${p.motivo}\n      correção: ${p.correcao}`);
  process.exit(1);
}
console.log(
  `check:blog-internal-links OK — ${linksBlog.filter((l) => l.servido).length} link(s) /blog/* em páginas servidas, todos para slugs aprovados (${aprovados.size}).`,
);
if (informativos.length)
  console.log(
    `  nota: ${informativos.length} link(s) pendente(s) dentro de artigos ainda não servidos — registrados em reports/blog-link-fixes.json e a corrigir antes de aprová-los.`,
  );
