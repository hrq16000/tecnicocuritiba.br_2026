#!/usr/bin/env node
/**
 * GATE — ORIGINALIDADE DE CONTEÚDO (fail-closed antes de remover noindex).
 *
 * Roda sobre o dist/ e avalia TODA URL curada (fonte: scripts/lib/curated-urls.mjs).
 * Para cada página:
 *   1. extrai o texto do <main> (fallback: <body> sem header/footer/script);
 *   2. exige corpo autoral mínimo (por família de rota);
 *   3. calcula duplicidade cruzada por shingles de 5 palavras (Jaccard) e
 *      bloqueia pares acima do teto da família.
 *
 * Saídas:
 *   reports/originality.json        — métricas por URL + pares suspeitos
 *   reports/content-approval.json   — { approved: [...], blocked: [...] }
 *
 * O gerador de sitemaps (scripts/generate-sitemaps.mjs) lê o content-approval
 * e REMOVE do XML qualquer URL bloqueada — templates ficam noindex até passar.
 *
 * Modos:
 *   --rendered (padrão)  serve o dist e mede o DOM renderizado (Playwright).
 *                        Único modo que escreve reports/content-approval.json.
 *   --static             mede apenas o HTML pré-renderizado (rápido, relatório).
 *   --report             não falha o build (exit 0).
 *
 * Uso:
 *   npm run check:originality            # gate renderizado (falha o build)
 *   npm run check:originality:report     # relatório renderizado
 *   node scripts/check-originality.mjs --static --report
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const STATIC_MODE = args.includes("--static");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");

// ── Regras por família de rota. Primeira regex que casar vence.
const FAMILIES = [
  { id: "editorial", test: /^\/blog\//, minWords: 800, maxJaccard: 0.35 },
  { id: "problemas", test: /^\/problemas\/[^/]+$/, minWords: 800, maxJaccard: 0.40 },
  { id: "wifi-tv-bairro", test: /^\/servicos\/(redes-wifi|manutencao-tv)\//, minWords: 600, maxJaccard: 0.45 },
  { id: "servico-bairro", test: /^\/servicos\/[^/]+\/[^/]+$/, minWords: 500, maxJaccard: 0.50 },
  { id: "servico", test: /^\/servicos\/[^/]+$/, minWords: 600, maxJaccard: 0.50 },
  { id: "local", test: /^\/(tecnico-informatica-|bairro|regiao)/, minWords: 450, maxJaccard: 0.50 },
  { id: "institucional", test: /.*/, minWords: 250, maxJaccard: 0.55 },
];

const familyOf = (p) => FAMILIES.find((f) => f.test.test(p));

const STOPWORDS = new Set(
  ("a à ao aos as até com como da das de do dos e em entre é era eram essa esse essas esses esta estas este estes eu foi for foram há isso isto já lhe lhes mais mas me mesmo meu meus minha minhas na nas no nos nós num numa o os ou para pela pelas pelo pelos por qual quando que quem se sem ser será seu seus só sob sobre sua suas também te tem tinha tinham um uma umas uns você vocês ainda cada onde qualquer todo toda todos todas")
    .split(/\s+/),
);

function readHtml(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

function mainText(html) {
  const strip = (s) =>
    s
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<header[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  return strip(m ? m[0] : html);
}

const tokens = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));

function shingles(words, n = 5) {
  const set = new Set();
  for (let i = 0; i + n <= words.length; i++) set.add(words.slice(i, i + n).join(" "));
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const s of small) if (big.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

// ── Coleta
const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();

if (!existsSync(DIST)) {
  const msg = `dist ausente em ${DIST} — rode "npm run build" antes do gate de originalidade.`;
  if (REPORT_ONLY) {
    console.warn(`AVISO: ${msg}`);
    process.exit(0);
  }
  console.error(`BLOQUEADO: ${msg}`);
  process.exit(1);
}

const pages = [];
const missing = [];

function pushPage(p, text) {
  const words = tokens(text);
  pages.push({
    path: p,
    family: familyOf(p).id,
    rules: familyOf(p),
    words: text.split(/\s+/).filter(Boolean).length,
    uniqueTokens: new Set(words).size,
    shingles: shingles(words),
  });
}

if (STATIC_MODE) {
  for (const p of curated) {
    const html = readHtml(p);
    if (!html) {
      missing.push(p);
      continue;
    }
    pushPage(p, mainText(html));
  }
} else {
  // Modo renderizado: sobe o servidor de paridade e lê o <main> após hidratação.
  const { spawn } = await import("node:child_process");
  const { chromium } = await import("playwright");
  const port = Number(process.env.ORIGINALITY_PORT || 4187);
  const server = spawn(process.execPath, ["scripts/serve-dist.mjs", String(port), DIST], { stdio: "ignore" });
  const base = `http://127.0.0.1:${port}`;
  const ready = async () => {
    for (let i = 0; i < 40; i++) {
      try {
        const r = await fetch(`${base}/`);
        if (r.ok) return true;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    return false;
  };
  if (!(await ready())) {
    server.kill("SIGKILL");
    console.error("BLOQUEADO: servidor de paridade não subiu para o gate de originalidade.");
    process.exit(REPORT_ONLY ? 0 : 1);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  try {
    for (const p of curated) {
      const res = await page.goto(`${base}${p}`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => null);
      if (!res || res.status() >= 400) {
        missing.push(p);
        continue;
      }
      await page.waitForSelector("main", { timeout: 15000 }).catch(() => null);
      const text = await page
        .evaluate(() => (document.querySelector("main") || document.body)?.innerText || "")
        .catch(() => "");
      if (!text.trim()) {
        missing.push(p);
        continue;
      }
      pushPage(p, text.replace(/\s+/g, " ").trim());
    }
  } finally {
    await browser.close();
    server.kill("SIGKILL");
  }
}

// ── Avaliação
const blocked = new Map(); // path -> reasons[]
const addReason = (p, r) => blocked.set(p, [...(blocked.get(p) || []), r]);

for (const page of pages) {
  if (page.words < page.rules.minWords) {
    addReason(page.path, `corpo autoral insuficiente: ${page.words} palavras (mínimo ${page.rules.minWords} para ${page.family})`);
  }
}

const duplicatePairs = [];
const byFamily = new Map();
for (const page of pages) byFamily.set(page.family, [...(byFamily.get(page.family) || []), page]);

for (const [family, group] of byFamily) {
  const max = group[0].rules.maxJaccard;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const score = jaccard(group[i].shingles, group[j].shingles);
      if (score > max) {
        duplicatePairs.push({ family, a: group[i].path, b: group[j].path, jaccard: Number(score.toFixed(3)), max });
        addReason(group[i].path, `duplicidade ${score.toFixed(3)} com ${group[j].path} (teto ${max})`);
        addReason(group[j].path, `duplicidade ${score.toFixed(3)} com ${group[i].path} (teto ${max})`);
      }
    }
  }
}

const approved = pages.filter((p) => !blocked.has(p.path)).map((p) => p.path);

mkdirSync(path.resolve("reports"), { recursive: true });
writeFileSync(
  path.resolve("reports/originality.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      dist: path.relative(process.cwd(), DIST),
      totals: { curated: curated.length, avaliadas: pages.length, aprovadas: approved.length, bloqueadas: blocked.size, ausentesNoDist: missing.length },
      pages: pages
        .map((p) => ({ path: p.path, family: p.family, words: p.words, uniqueTokens: p.uniqueTokens, minWords: p.rules.minWords }))
        .sort((a, b) => a.words - b.words),
      duplicatePairs: duplicatePairs.sort((a, b) => b.jaccard - a.jaccard),
      missing,
    },
    null,
    2,
  ) + "\n",
);

if (!STATIC_MODE) {
writeFileSync(
  path.resolve("reports/content-approval.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      approved,
      blocked: [...blocked.entries()].map(([p, reasons]) => ({ path: p, reasons })),
    },
    null,
    2,
  ) + "\n",
);
} else {
  console.log("modo --static: reports/content-approval.json NÃO foi atualizado (só o modo renderizado aprova URLs).");
}

// ── Resultado
console.log(
  `originalidade: ${approved.length}/${pages.length} aprovadas | ${blocked.size} bloqueadas | ${duplicatePairs.length} pares acima do teto | ${missing.length} sem HTML estático`,
);
for (const [p, reasons] of blocked) console.log(`  ✗ ${p}\n      - ${reasons.join("\n      - ")}`);

if (REPORT_ONLY) process.exit(0);
if (blocked.size) {
  console.error(
    `\nBLOQUEADO: ${blocked.size} URL(s) curada(s) sem originalidade suficiente. Reescreva o corpo autoral ou remova a URL de curated-urls.mjs (mantendo noindex).`,
  );
  process.exit(1);
}
console.log("OK: todas as URLs curadas passaram no check de originalidade.");
