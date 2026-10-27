#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// RODADA 4F — GATE DE CLUSTER EDITORIAL + INTERLINKING EDITORIAL
//
// Falha (exit != 0) quando:
//  - a primeira onda excede os limites da rodada (8/4/4/4);
//  - artigo prioritário sem cluster/pilar canônico;
//  - pilar inexistente no app;
//  - CTA editorial abrindo WhatsApp direto (wa.me em blog/CTA editorial);
//  - claim inventado no CTA editorial (diagnóstico grátis, garantido, etc.);
//  - rating/review no runtime editorial;
//  - artigo prioritário sem link para pilar ou sem link editorial relacionado;
//  - relacionado inexistente no acervo;
//  - conteúdo fora de foco recebendo link a partir do core;
//  - consolidação apontando para slug inexistente ou para si mesma;
//  - título/consulta duplicada entre artigos prioritários.
// ─────────────────────────────────────────────────────────────

import { promises as fs } from "node:fs";
import path from "node:path";
import { tanstackRouteIndex } from "./lib/tanstack-routes.mjs";

const ROOT = process.cwd();
const errors = [];
const notes = [];
const fail = (m) => errors.push(m);
const note = (m) => notes.push(m);

const read = (p) => fs.readFile(path.join(ROOT, p), "utf8");

// 8 aprofundamentos da Rodada 4F + 2 conteúdos empresariais da Rodada 3O.
const LIMITS = { aprofundar: 10, novo: 4, consolidar: 4, noindex: 4 };

const CLAIMS = [
  /diagn[óo]stico\s+gr[áa]tis/i,
  /diagn[óo]stico\s+gratuito/i,
  /paga\s+apenas\s+se/i,
  /garantido/i,
  /solu[çc][ãa]o\s+definitiva/i,
  /no\s+mesmo\s+dia/i,
];

function parseFirstWave(src) {
  const entries = [];
  const blockRe = /\{\s*slug:\s*"([a-z0-9-]+)",([\s\S]*?)\n  \},/g;
  let m;
  while ((m = blockRe.exec(src))) {
    const [, slug, body] = m;
    const get = (k) => (body.match(new RegExp(`${k}:\\s*"([^"]*)"`)) || [])[1];
    const rel = (body.match(/relacionados:\s*\[([^\]]*)\]/) || [])[1];
    entries.push({
      slug,
      cluster: get("cluster"),
      acao: get("acao"),
      consulta: get("consulta"),
      consolidarEm: get("consolidarEm"),
      relacionados: rel ? [...rel.matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]) : [],
    });
  }
  return entries;
}

function parseClusters(src) {
  const clusters = {};
  const re = /"([a-z-]+)":\s*\{\s*id:\s*"[a-z-]+",[\s\S]*?pilar:\s*"([^"]+)"[\s\S]*?ctaBranch:\s*"(pf|pj)"/g;
  let m;
  while ((m = re.exec(src))) clusters[m[1]] = { pilar: m[2], branch: m[3] };
  return clusters;
}

async function main() {
  const clusterSrc = await read("src/lib/editorialClusters.ts");
  const clusters = parseClusters(clusterSrc);
  const wave = parseFirstWave(clusterSrc);
  if (wave.length === 0) fail("cluster editorial: primeira onda vazia (parser não encontrou entradas)");

  // Acervo real de slugs.
  const base = await read("src/data/blogPostsContent.tsx");
  const prog = await read("src/data/blogProgrammaticPosts.tsx");
  const slugs = new Set([
    ...[...base.matchAll(/^ {2}"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]),
    ...[...prog.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]),
  ]);

  // Rotas reais do TanStack: App/LegacyApp não definem mais o roteamento.
  const { staticRoutes: appPaths } = tanstackRouteIndex(ROOT);

  // 1. Limites da rodada.
  const counts = wave.reduce((acc, e) => ((acc[e.acao] = (acc[e.acao] || 0) + 1), acc), {});
  if ((counts.aprofundar || 0) > LIMITS.aprofundar)
    fail(`primeira onda: ${counts.aprofundar} aprofundamentos (máximo ${LIMITS.aprofundar})`);
  if ((counts.consolidar || 0) > LIMITS.consolidar)
    fail(`primeira onda: ${counts.consolidar} consolidações (máximo ${LIMITS.consolidar})`);
  const noindexCount = (counts["manter-noindex"] || 0) + (counts["fora-de-foco"] || 0);
  if (noindexCount > LIMITS.noindex)
    fail(`primeira onda: ${noindexCount} conteúdos noindex/arquivo (máximo ${LIMITS.noindex})`);
  note(
    `primeira onda: ${counts.aprofundar || 0} aprofundar · ${counts.consolidar || 0} consolidar · ${noindexCount} noindex/fora de foco`,
  );

  // 2. Integridade por entrada.
  const consultas = new Map();
  for (const e of wave) {
    if (!slugs.has(e.slug)) fail(`${e.slug}: slug não existe no acervo editorial`);
    const c = clusters[e.cluster];
    if (!c) { fail(`${e.slug}: cluster "${e.cluster}" inexistente`); continue; }
    if (!appPaths.has(c.pilar))
      fail(`${e.slug}: pilar ${c.pilar} não corresponde a rota real`);

    if (e.acao === "consolidar") {
      if (!e.consolidarEm) fail(`${e.slug}: consolidação sem slug canônico (consolidarEm)`);
      else if (!slugs.has(e.consolidarEm)) fail(`${e.slug}: consolidarEm "${e.consolidarEm}" inexistente`);
      else if (e.consolidarEm === e.slug) fail(`${e.slug}: consolidação circular`);
    }

    if (e.acao === "aprofundar") {
      if (!e.relacionados.length)
        fail(`${e.slug}: conteúdo prioritário sem link editorial relacionado`);
      for (const r of e.relacionados) {
        if (!slugs.has(r)) fail(`${e.slug}: relacionado "${r}" não existe no acervo`);
        const target = wave.find((x) => x.slug === r);
        if (target && (target.acao === "fora-de-foco" || target.acao === "manter-noindex"))
          fail(`${e.slug} → ${r}: link do core para conteúdo fora de foco/noindex`);
        if (r === e.slug) fail(`${e.slug}: auto-link editorial`);
      }
      const key = e.consulta?.toLowerCase().trim();
      if (key && consultas.has(key))
        fail(`consulta duplicada entre ${consultas.get(key)} e ${e.slug}: "${e.consulta}"`);
      if (key) consultas.set(key, e.slug);
    }
  }

  // 3. CTA editorial — sem WhatsApp direto e sem claim inventado.
  const ctaSrc = await read("src/components/editorial/EditorialCta.tsx");
  if (/wa\.me|api\.whatsapp/.test(ctaSrc)) fail("CTA editorial: link direto para WhatsApp");
  if (!/wa-funnel:open/.test(ctaSrc)) fail("CTA editorial: não abre a triagem (evento wa-funnel:open ausente)");
  for (const re of CLAIMS)
    if (re.test(ctaSrc)) fail(`CTA editorial: claim proibido (${re})`);

  const blogPost = await read("src/pages/BlogPost.tsx");
  if (/wa\.me|api\.whatsapp/.test(blogPost)) fail("BlogPost: CTA direto para WhatsApp");
  if (!/EditorialCta/.test(blogPost)) fail("BlogPost: CTA editorial de cluster ausente");
  if (/aggregateRating|AggregateRating|"Review"/.test(blogPost)) fail("BlogPost: rating/review no runtime editorial");

  for (const [file, src] of [
    ["src/data/blogProgrammaticPosts.tsx", prog],
    ["src/data/blogPostsContent.tsx", base],
  ]) {
    if (/wa\.me|api\.whatsapp/.test(src)) fail(`${file}: link direto para WhatsApp no conteúdo`);
    for (const re of CLAIMS) {
      const m = src.match(re);
      if (m) fail(`${file}: claim proibido no conteúdo ("${m[0]}")`);
    }
  }

  // 4. Pilares recebem o bloco de apoio (fail-closed por aprovação).
  const pilarComp = await read("src/components/editorial/PilarEditorialLinks.tsx");
  if (!/isEditorialApproved/.test(pilarComp))
    fail("PilarEditorialLinks: deve filtrar por aprovação editorial (fail-closed)");
  for (const f of [
    "src/pages/TecnicoInformaticaCuritiba.tsx",
    "src/pages/EmpresaDeTiCuritiba.tsx",
    "src/pages/AtendimentoDomicilio.tsx",
  ]) {
    const s = await read(f);
    if (!/PilarEditorialLinks/.test(s)) fail(`${f}: pilar sem bloco de conteúdos de apoio`);
  }
  note("pilares P0 conectados ao cluster editorial (renderização condicionada à aprovação)");

  // Saída.
  for (const n of notes) console.log(`  · ${n}`);
  if (errors.length) {
    console.error(`\n✖ Gate de cluster editorial: ${errors.length} problema(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("\n✔ Cluster editorial OK: pilares, relacionados, limites da onda e CTA de triagem íntegros.");
}

main().catch((e) => { console.error(e); process.exit(1); });
