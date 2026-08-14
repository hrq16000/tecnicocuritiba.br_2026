#!/usr/bin/env node
/**
 * CHECKLIST AUTOMATIZADO DE PÓS-DEPLOY
 *
 * Roda contra a URL publicada (ou qualquer base) e repete, a cada release,
 * as validações que hoje são feitas manualmente no runbook:
 *
 *   1. robots.txt        → 200, sem `Disallow: /` global, aponta o sitemap
 *   2. sitemap           → sitemap-index.xml 200, XML válido, filhos 200
 *   3. canonical/og:url  → presentes no HTML ESTÁTICO (pré-hidratação),
 *                          únicos e self-referentes nas rotas prioritárias
 *   4. CTAs              → cada rota prioritária traz CTA de WhatsApp/funil
 *   5. console errors    → opcional (--console) via Playwright, se instalado
 *
 * Uso:
 *   node scripts/checklist-post-deploy.mjs                       # produção
 *   node scripts/checklist-post-deploy.mjs --base=http://localhost:8080
 *   node scripts/checklist-post-deploy.mjs --console              # + browser
 *
 * Saída: reports/post-deploy-checklist.md  (exit 1 em qualquer falha)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { BASE_URL, P0_PATHS, PRECOS_PATH, PILAR_PATHS } from "./lib/priority-urls.mjs";

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("--base="))?.slice(7) ?? BASE_URL).replace(/\/$/, "");
const WITH_CONSOLE = args.includes("--console");
const ROUTES = [...new Set([...P0_PATHS, PRECOS_PATH, ...PILAR_PATHS])];

const errors = [];
const warnings = [];
const rows = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

async function get(path) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "post-deploy-checklist" } });
    return { ok: res.ok, status: res.status, body: await res.text(), url };
  } catch (e) {
    return { ok: false, status: 0, body: "", url, erro: String(e) };
  }
}

/* ── 1. robots.txt ─────────────────────────────────────────────── */
async function checkRobots() {
  const r = await get("/robots.txt");
  if (!r.ok) return fail(`robots.txt: HTTP ${r.status}`);
  if (/^\s*Disallow:\s*\/\s*$/m.test(r.body) && !/^\s*Allow:/m.test(r.body)) {
    fail("robots.txt: bloqueio global `Disallow: /`");
  }
  if (!/^\s*Sitemap:\s*https?:\/\//mi.test(r.body)) warn("robots.txt: sem diretiva Sitemap:");
  rows.push(["robots.txt", r.status, "ok"]);
}

/* ── 2. sitemaps ───────────────────────────────────────────────── */
async function checkSitemaps() {
  const idx = await get("/sitemap-index.xml");
  if (!idx.ok) return fail(`sitemap-index.xml: HTTP ${idx.status}`);
  if (!/<sitemapindex|<urlset/.test(idx.body)) return fail("sitemap-index.xml: XML inválido");

  const filhos = [...idx.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!filhos.length) fail("sitemap-index.xml: nenhum <loc>");
  let urls = 0;
  for (const f of filhos.slice(0, 12)) {
    const s = await get(f);
    if (!s.ok) { fail(`sitemap filho ${f}: HTTP ${s.status}`); continue; }
    if (!/<urlset/.test(s.body)) fail(`sitemap filho ${f}: sem <urlset>`);
    urls += (s.body.match(/<loc>/g) || []).length;
  }
  rows.push(["sitemaps", idx.status, `${filhos.length} arquivos · ${urls} URLs`]);
}

/* ── 3 + 4. canonical/og:url + CTA no HTML estático ────────────── */
const CTA_PATTERNS = [/wa\.me\//i, /api\.whatsapp\.com/i, /#agendamento/i, /data-cta=/i];

async function checkRota(path) {
  const r = await get(path);
  if (!r.ok) { fail(`${path}: HTTP ${r.status}`); rows.push([path, r.status, "—"]); return; }

  const canonicals = [...r.body.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
  const href = canonicals[0]?.[0].match(/href=["']([^"']+)["']/i)?.[1];
  const ogUrl = r.body.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const esperado = `${BASE}${path === "/" ? "/" : path}`;
  const norm = (u) => (u || "").replace(/\/$/, "") || "/";

  if (canonicals.length === 0) fail(`${path}: sem <link rel="canonical"> no HTML estático`);
  else if (canonicals.length > 1) fail(`${path}: ${canonicals.length} canonicals no HTML estático`);
  else if (norm(href) !== norm(esperado)) fail(`${path}: canonical "${href}" não é self-referente`);

  if (!ogUrl) fail(`${path}: sem og:url no HTML estático`);
  else if (norm(ogUrl) !== norm(esperado)) fail(`${path}: og:url "${ogUrl}" não é self-referente`);

  const temCta = CTA_PATTERNS.some((re) => re.test(r.body));
  if (!temCta) fail(`${path}: nenhum CTA de conversão (WhatsApp/#agendamento) no HTML estático`);

  rows.push([path, r.status, `${canonicals.length === 1 && ogUrl ? "canonical+og ok" : "meta incompleta"} · ${temCta ? "CTA ok" : "sem CTA"}`]);
}

/* ── 5. console errors (opcional) ──────────────────────────────── */
async function checkConsole() {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { warn("--console ignorado: Playwright não instalado neste ambiente."); return; }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  for (const path of ROUTES.slice(0, 5)) {
    const page = await ctx.newPage();
    const problemas = [];
    page.on("console", (m) => { if (m.type() === "error") problemas.push(m.text()); });
    page.on("pageerror", (e) => problemas.push(String(e)));
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30000 });
    } catch (e) { fail(`${path}: falha ao carregar no browser (${e})`); }
    const reais = problemas.filter((p) => !/favicon|third-party cookie|ERR_BLOCKED_BY_CLIENT/i.test(p));
    if (reais.length) fail(`${path}: ${reais.length} erro(s) de console — ${reais[0].slice(0, 160)}`);
    rows.push([`console ${path}`, "—", reais.length ? `${reais.length} erros` : "limpo"]);
    await page.close();
  }
  await browser.close();
}

/* ── execução ──────────────────────────────────────────────────── */
await checkRobots();
await checkSitemaps();
for (const p of ROUTES) await checkRota(p);
if (WITH_CONSOLE) await checkConsole();

mkdirSync("reports", { recursive: true });
const md = [
  "# Checklist pós-deploy",
  "",
  `- Base: ${BASE}`,
  `- Execução: ${new Date().toISOString()}`,
  `- Console errors: ${WITH_CONSOLE ? "verificado" : "não verificado (use --console)"}`,
  "",
  "| Item | HTTP | Resultado |",
  "| --- | --- | --- |",
  ...rows.map(([a, b, c]) => `| ${a} | ${b} | ${c} |`),
  "",
  `## Falhas (${errors.length})`,
  ...(errors.length ? errors.map((e) => `- ✖ ${e}`) : ["- nenhuma"]),
  "",
  `## Avisos (${warnings.length})`,
  ...(warnings.length ? warnings.map((w) => `- ⚠ ${w}`) : ["- nenhum"]),
  "",
].join("\n");
writeFileSync("reports/post-deploy-checklist.md", md);

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);
console.log(`\n→ reports/post-deploy-checklist.md (${rows.length} verificações, ${errors.length} falhas)`);
process.exit(errors.length ? 1 : 0);
