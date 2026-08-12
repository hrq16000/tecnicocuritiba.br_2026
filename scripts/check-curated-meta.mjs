// Validação anti-regressão dos bloqueadores SEO P0 (Onda 1).
// Confirma, sem executar o app:
//  1. Paridade de title/description entre servicosCore.ts (fonte de verdade)
//     e curated-routes-meta.mjs (prerender pré-hidratação) nas 8 rotas de serviço.
//  2. Ausência de storage externo (gpt-engineer) no HTML base.
//  3. og:image === og:image:secure_url === twitter:image no index.html.
//  4. Nome institucional único ("Técnico em Curitiba") nos campos de entidade.
//  5. Exatamente 1 <title>, 1 description e 1 canonical no index.html.
//  6. /valores sem canonical próprio (fora do prerender curado) e
//     /precos-e-politicas presente como rota canônica oficial.
//
// Uso: node scripts/check-curated-meta.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const OFFICIAL_NAME = "Técnico em Curitiba";
const SERVICE_PATHS = [
  "formatacao",
  "manutencao-de-notebook",
  "manutencao-de-computador",
  "upgrade-ssd-ram",
  "remocao-de-virus",
  "recuperacao-de-dados",
  "redes-e-wifi",
  "suporte-tecnico-empresarial",
];

const errors = [];
const fail = (msg) => errors.push(msg);

// ── 1. Fonte de verdade: servicosCore.ts ────────────────────────────
const coreSrc = readFileSync(resolve(root, "src/lib/servicosCore.ts"), "utf8");
const grabAll = (re, s) => [...s.matchAll(re)].map((m) => m[1]);
const paths = grabAll(/path:\s*"([^"]+)"/g, coreSrc);
const titles = grabAll(/metaTitle:\s*"([^"]+)"/g, coreSrc);
const descs = grabAll(/metaDescription:\s*"([^"]+)"/g, coreSrc);
if (paths.length !== titles.length || paths.length !== descs.length) {
  fail(`servicosCore.ts: contagem desalinhada (path=${paths.length}, metaTitle=${titles.length}, metaDescription=${descs.length})`);
}
const official = new Map();
paths.forEach((p, i) => official.set(p, { title: titles[i], description: descs[i] }));
for (const sp of SERVICE_PATHS) {
  if (!official.has(sp)) fail(`servicosCore.ts: serviço ausente "${sp}"`);
}

// ── 2. Prerender: curated-routes-meta.mjs ───────────────────────────
const { CURATED_ROUTES } = await import(pathToFileURL(resolve(root, "scripts/curated-routes-meta.mjs")).href);
const curatedByPath = new Map(CURATED_ROUTES.map((r) => [r.path, r]));

for (const sp of SERVICE_PATHS) {
  const routePath = `/servicos/${sp}`;
  const cur = curatedByPath.get(routePath);
  const off = official.get(sp);
  if (!cur) { fail(`curated: rota ausente ${routePath}`); continue; }
  if (!off) continue;
  if (cur.title !== off.title) fail(`title divergente em ${routePath}\n  prerender: ${cur.title}\n  oficial:   ${off.title}`);
  if (cur.description !== off.description) fail(`description divergente em ${routePath}`);
  if (!cur.title || !cur.description) fail(`curated: title/description vazios em ${routePath}`);
}

// ── /valores e /precos-e-politicas ──────────────────────────────────
if (curatedByPath.has("/valores")) fail("/valores não deve ter entrada própria no prerender curado (canonical próprio)");
if (!curatedByPath.has("/precos-e-politicas")) fail("/precos-e-politicas ausente do prerender curado (URL canônica oficial)");

// ── 3+4+5. index.html ───────────────────────────────────────────────
const html = readFileSync(resolve(root, "index.html"), "utf8");
if (/gpt-engineer/i.test(html)) fail("index.html contém referência a storage do gpt-engineer");

const metaContent = (re) => { const m = html.match(re); return m ? m[1] : null; };
const ogImage = metaContent(/property="og:image"\s+content="([^"]+)"/);
const ogSecure = metaContent(/property="og:image:secure_url"\s+content="([^"]+)"/);
const twImage = metaContent(/name="twitter:image"\s+content="([^"]+)"/);
if (!ogImage || !ogSecure || !twImage) fail("index.html: og:image/og:image:secure_url/twitter:image ausente(s)");
if (!(ogImage === ogSecure && ogSecure === twImage)) {
  fail(`imagens sociais divergentes:\n  og:image=${ogImage}\n  secure_url=${ogSecure}\n  twitter=${twImage}`);
}
if (ogImage && /gpt-engineer/i.test(ogImage)) fail("og:image aponta para storage externo");
if (ogImage && !ogImage.startsWith("https://tecnico.curitiba.br/")) fail("og:image não usa o domínio oficial");

const siteName = metaContent(/property="og:site_name"\s+content="([^"]+)"/);
if (siteName !== OFFICIAL_NAME) fail(`og:site_name divergente: "${siteName}" (esperado "${OFFICIAL_NAME}")`);
const appName = metaContent(/name="application-name"\s+content="([^"]+)"/);
if (appName !== OFFICIAL_NAME) fail(`application-name divergente: "${appName}" (esperado "${OFFICIAL_NAME}")`);

const count = (re) => (html.match(re) || []).length;
if (count(/<title>/g) !== 1) fail(`index.html: esperado exatamente 1 <title> (achou ${count(/<title>/g)})`);
if (count(/name="description"/g) !== 1) fail(`index.html: esperado exatamente 1 meta description (achou ${count(/name="description"/g)})`);
if (count(/rel="canonical"/g) !== 1) fail(`index.html: esperado exatamente 1 canonical (achou ${count(/rel="canonical"/g)})`);

// ── 4. Nome institucional em PageSEO.tsx (og:site_name runtime) ──────
const pageSeo = readFileSync(resolve(root, "src/components/PageSEO.tsx"), "utf8");
const siteNameConst = pageSeo.match(/const SITE_NAME\s*=\s*"([^"]+)"/);
if (!siteNameConst || siteNameConst[1] !== OFFICIAL_NAME) {
  fail(`PageSEO.tsx SITE_NAME divergente: "${siteNameConst ? siteNameConst[1] : "?"}" (esperado "${OFFICIAL_NAME}")`);
}

// ── 6. Identidade institucional: manifest.json ──────────────────────
import { existsSync } from "node:fs";
let manifest;
try {
  manifest = JSON.parse(readFileSync(resolve(root, "public/manifest.json"), "utf8"));
} catch (e) {
  fail(`public/manifest.json inválido: ${e.message}`);
}
if (manifest) {
  if (manifest.name !== OFFICIAL_NAME) fail(`manifest.name divergente: "${manifest.name}" (esperado "${OFFICIAL_NAME}")`);
  if (manifest.short_name !== OFFICIAL_NAME) fail(`manifest.short_name divergente: "${manifest.short_name}" (esperado "${OFFICIAL_NAME}")`);
}

// ── 7. Identidade institucional: prerender-cities.mjs ───────────────
// Campos institucionais (og:site_name, Organization.name, LocalBusiness.name)
// não devem usar o nome antigo "Técnico Curitiba".
const prerenderSrc = readFileSync(resolve(root, "scripts/prerender-cities.mjs"), "utf8");
const badSiteName = [...prerenderSrc.matchAll(/(og:site_name"\s+content=|name:\s*)"Técnico Curitiba"/g)];
if (badSiteName.length) {
  fail(`prerender-cities.mjs ainda usa "Técnico Curitiba" em ${badSiteName.length} campo(s) institucional(is)`);
}

// ── 8. Pós-build: dist/valores/index.html (alias de /precos-e-politicas) ──
const valoresHtmlPath = resolve(root, "dist/valores/index.html");
if (existsSync(valoresHtmlPath)) {
  const v = readFileSync(valoresHtmlPath, "utf8");
  const canonicalCount = (v.match(/rel="canonical"/g) || []).length;
  if (canonicalCount !== 1) fail(`dist/valores: esperado exatamente 1 canonical (achou ${canonicalCount})`);
  const vCanonical = (v.match(/rel="canonical"\s+href="([^"]+)"/) || [])[1];
  if (vCanonical !== "https://tecnico.curitiba.br/precos-e-politicas") {
    fail(`dist/valores: canonical divergente "${vCanonical}" (esperado /precos-e-politicas)`);
  }
  if (/rel="canonical"\s+href="https:\/\/tecnico\.curitiba\.br\/"/.test(v)) {
    fail("dist/valores: canonical aponta para a home (proibido)");
  }
  const vOgUrl = (v.match(/property="og:url"\s+content="([^"]+)"/) || [])[1];
  if (vOgUrl !== "https://tecnico.curitiba.br/precos-e-politicas") {
    fail(`dist/valores: og:url divergente "${vOgUrl}" (esperado /precos-e-politicas)`);
  }
  if (/gpt-engineer/i.test(v)) fail("dist/valores: contém referência a storage do gpt-engineer");

  // /valores fora de todos os sitemaps
  const sitemapDir = resolve(root, "public");
  for (const f of ["sitemap-main.xml", "sitemap-servicos.xml", "sitemap-regioes.xml", "sitemap-bairros.xml", "sitemap.xml"]) {
    const sp = resolve(sitemapDir, f);
    if (existsSync(sp) && /\/valores(<|\/)/.test(readFileSync(sp, "utf8"))) {
      fail(`/valores presente em ${f} (deve ficar fora dos sitemaps)`);
    }
  }
} else {
  console.log("ℹ️  check-curated-meta: dist/valores/index.html ausente (pré-build) — validação de alias adiada para pós-build.");
}

// ── 9. Pós-build: indexabilidade das famílias legadas vs. rotas curadas ──
// Confirma no HTML gerado (dist) que:
//  - as 108 rotas legadas (/arrumar-pc/*, hubs conserto-*-curitiba,
//    conserto-*/local e /cftv/*) são noindex,follow, self-canonical e
//    ausentes de todos os sitemaps;
//  - as rotas curadas pré-renderizadas continuam index,follow, self-canonical;
//  - cada HTML tem exatamente 1 meta robots e 1 canonical.
const SITE = "https://tecnico.curitiba.br";
const distDir = resolve(root, "dist");
if (existsSync(distDir)) {
  const { CITIES, CATEGORIES, LOCAIS, CFTV_ROUTES } = await import(
    pathToFileURL(resolve(root, "scripts/prerender-cities.mjs")).href
  );

  const readDist = (routePath) => {
    const file = routePath === "/"
      ? resolve(distDir, "index.html")
      : resolve(distDir, ...routePath.split("/").filter(Boolean), "index.html");
    return existsSync(file) ? readFileSync(file, "utf8") : null;
  };
  const robotsOf = (h) => {
    const all = [...h.matchAll(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/gi)];
    return { count: all.length, value: all.length ? all[0][1] : null };
  };
  const canonicalsOf = (h) => [...h.matchAll(/rel=["']canonical["']\s+href=["']([^"']+)["']/gi)].map((m) => m[1]);

  // Famílias legadas (fonte única: prerender-cities.mjs).
  const legacyArrumar = CITIES.map((c) => `/arrumar-pc/${c.slug}`);
  const legacyHubs = CATEGORIES.map((c) => `/${c.slug}-curitiba`);
  const legacyLocal = CATEGORIES.flatMap((cat) => LOCAIS.map((l) => `/${cat.slug}/${l.slug}`));
  const legacyCftv = CFTV_ROUTES.map((r) => r.path);
  const legacyPaths = [...legacyArrumar, ...legacyHubs, ...legacyLocal, ...legacyCftv];

  const expected = { arrumar: 20, hubs: 4, local: 76, cftv: 8, total: 108 };
  if (legacyArrumar.length !== expected.arrumar) fail(`legacy /arrumar-pc: esperado ${expected.arrumar}, achou ${legacyArrumar.length}`);
  if (legacyHubs.length !== expected.hubs) fail(`legacy hubs conserto-*-curitiba: esperado ${expected.hubs}, achou ${legacyHubs.length}`);
  if (legacyLocal.length !== expected.local) fail(`legacy conserto-*/local: esperado ${expected.local}, achou ${legacyLocal.length}`);
  if (legacyCftv.length !== expected.cftv) fail(`legacy /cftv/*: esperado ${expected.cftv}, achou ${legacyCftv.length}`);
  if (legacyPaths.length !== expected.total) fail(`legacy total: esperado ${expected.total}, achou ${legacyPaths.length}`);

  for (const p of legacyPaths) {
    const h = readDist(p);
    if (!h) { fail(`legacy: HTML ausente em dist${p}/index.html`); continue; }
    const r = robotsOf(h);
    if (r.count !== 1) fail(`legacy ${p}: esperado exatamente 1 meta robots (achou ${r.count})`);
    if (r.value !== "noindex, follow") fail(`legacy ${p}: robots="${r.value}" (esperado "noindex, follow")`);
    const cans = canonicalsOf(h);
    if (cans.length !== 1) fail(`legacy ${p}: esperado exatamente 1 canonical (achou ${cans.length})`);
    if (cans[0] && cans[0] !== `${SITE}${p}`) fail(`legacy ${p}: canonical "${cans[0]}" não é self-referente`);
    if (cans[0] === `${SITE}/`) fail(`legacy ${p}: canonical aponta para a home (proibido)`);
  }

  // Rotas curadas pré-renderizadas: index,follow + self-canonical.
  for (const route of CURATED_ROUTES) {
    const h = readDist(route.path);
    if (!h) { fail(`curated: HTML ausente em dist${route.path === "/" ? "" : route.path}/index.html`); continue; }
    const r = robotsOf(h);
    if (r.count !== 1) fail(`curated ${route.path}: esperado exatamente 1 meta robots (achou ${r.count})`);
    if (!r.value || !/^index,\s*follow/.test(r.value)) fail(`curated ${route.path}: robots="${r.value}" (esperado index, follow)`);
    if (r.value && /noindex/.test(r.value)) fail(`curated ${route.path}: recebeu noindex (proibido)`);
    const cans = canonicalsOf(h);
    if (cans.length !== 1) fail(`curated ${route.path}: esperado exatamente 1 canonical (achou ${cans.length})`);
    if (cans[0] && cans[0] !== `${SITE}${route.path}`) fail(`curated ${route.path}: canonical "${cans[0]}" não é self-referente`);
  }

  // ── Onda 2 · 6 URLs curadas que antes herdavam o fallback da home ──────
  // Validação reforçada: HTML próprio + index,follow + self-canonical +
  // og:url self + og:title/og:description presentes + og:image oficial +
  // sem gpt-engineer + presença no sitemap. Fonte de verdade: componentes
  // de página (PageSEO) espelhados em curated-routes-meta.mjs.
  const NEW_CURATED = [
    "/atendimento-domicilio",
    "/atendimento-remoto",
    "/coleta-e-entrega",
    "/diagnostico-tecnico",
    "/equipamentos-atendidos",
    "/quando-nao-compensa",
  ];
  const sitemapMainXml = existsSync(resolve(root, "public/sitemap-main.xml"))
    ? readFileSync(resolve(root, "public/sitemap-main.xml"), "utf8")
    : "";
  const metaProp = (h, prop) => (h.match(new RegExp(`property=["']${prop}["']\\s+content=["']([^"']+)["']`, "i")) || [])[1];
  const metaName = (h, name) => (h.match(new RegExp(`name=["']${name}["']\\s+content=["']([^"']+)["']`, "i")) || [])[1];
  for (const p of NEW_CURATED) {
    const h = readDist(p);
    if (!h) { fail(`nova curada ${p}: HTML ausente em dist${p}/index.html`); continue; }
    const r = robotsOf(h);
    if (r.count !== 1) fail(`nova curada ${p}: esperado exatamente 1 meta robots (achou ${r.count})`);
    if (r.value !== "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1") {
      fail(`nova curada ${p}: robots="${r.value}" (esperado index, follow …)`);
    }
    const cans = canonicalsOf(h);
    if (cans.length !== 1) fail(`nova curada ${p}: esperado exatamente 1 canonical (achou ${cans.length})`);
    if (cans[0] !== `${SITE}${p}`) fail(`nova curada ${p}: canonical "${cans[0]}" não é self-referente`);
    if (cans[0] === `${SITE}/`) fail(`nova curada ${p}: canonical aponta para a home (proibido)`);
    const title = (h.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
    if (!title) fail(`nova curada ${p}: <title> ausente`);
    if (!metaName(h, "description")) fail(`nova curada ${p}: meta description ausente`);
    if (metaProp(h, "og:url") !== `${SITE}${p}`) fail(`nova curada ${p}: og:url "${metaProp(h, "og:url")}" não é self-referente`);
    if (!metaProp(h, "og:title")) fail(`nova curada ${p}: og:title ausente`);
    if (!metaProp(h, "og:description")) fail(`nova curada ${p}: og:description ausente`);
    const ogImg = metaProp(h, "og:image");
    if (!ogImg || !ogImg.startsWith(`${SITE}/`)) fail(`nova curada ${p}: og:image "${ogImg}" não usa o domínio oficial`);
    if (metaProp(h, "og:site_name") !== OFFICIAL_NAME) fail(`nova curada ${p}: og:site_name divergente`);
    if (!metaName(h, "twitter:image")) fail(`nova curada ${p}: twitter:image ausente`);
    if (/gpt-engineer/i.test(h)) fail(`nova curada ${p}: contém referência a storage do gpt-engineer`);
    if (!sitemapMainXml.includes(`<loc>${SITE}${p}</loc>`)) fail(`nova curada ${p}: ausente do sitemap-main.xml`);
    if (!curatedByPath.has(p)) fail(`nova curada ${p}: ausente de CURATED_ROUTES (curated-routes-meta.mjs)`);
  }


  // Sitemaps: total = manifesto curado e nenhuma rota legada presente.
  const { ACTIVE_SITEMAPS, CURATED_PATHS } = await import(
    pathToFileURL(resolve(root, "scripts/lib/curated-urls.mjs")).href
  );
  const sitemapFiles = ACTIVE_SITEMAPS.map(([f]) => f);
  let sitemapTotal = 0;
  for (const f of sitemapFiles) {
    const sp = resolve(root, "public", f);
    if (!existsSync(sp)) { fail(`sitemap ausente: ${f}`); continue; }
    const xml = readFileSync(sp, "utf8");
    sitemapTotal += (xml.match(/<loc>/g) || []).length;
    for (const p of legacyPaths) {
      if (xml.includes(`<loc>${SITE}${p}</loc>`)) fail(`rota legada ${p} presente em ${f} (deve ficar fora dos sitemaps)`);
    }
  }
  if (sitemapTotal !== CURATED_PATHS.length)
    fail(`sitemaps: manifesto curado declara ${CURATED_PATHS.length} URLs, sitemap tem ${sitemapTotal}`);
} else {
  console.log("ℹ️  check-curated-meta: dist/ ausente (pré-build) — validação de indexabilidade legada adiada para pós-build.");
}

// ── 10. Onda 2B · anti-canibalização home × /servicos × landing local ──
// Garante propriedade de intenção separada:
//   /                         → marca + conversão (não usa a intenção-alvo)
//   /servicos                 → "Serviços de informática em Curitiba" (hub)
//   /tecnico-informatica-curitiba → "Técnico de informática em Curitiba" (landing)
{
  const INTENT_RE = /técnico de informática em curitiba/i;
  const homeR = curatedByPath.get("/");
  const servicosR = curatedByPath.get("/servicos");
  const landingR = curatedByPath.get("/tecnico-informatica-curitiba");

  if (!homeR || !servicosR || !landingR) {
    fail("curadas home/servicos/landing ausentes de CURATED_ROUTES");
  } else {
    // Titles distintos entre as três rotas
    const titles = [homeR.title, servicosR.title, landingR.title];
    if (new Set(titles).size !== 3) fail("home, /servicos e landing devem ter titles distintos");
    // Propriedade de intenção nos titles
    if (INTENT_RE.test(homeR.title)) fail("home NÃO deve usar 'Técnico de Informática em Curitiba' no title (pertence à landing)");
    if (!INTENT_RE.test(landingR.title)) fail("landing deve conter a intenção 'Técnico de Informática em Curitiba' no title");
    if (!/serviços de informática em curitiba/i.test(servicosR.title)) fail("/servicos deve conter 'Serviços de Informática em Curitiba' no title");
  }

  // Paridade dos titles curados com as fontes de verdade
  const servicosSrc = readFileSync(resolve(root, "src/pages/Servicos.tsx"), "utf8");
  const cidadesSrc = readFileSync(resolve(root, "src/lib/cidadesData.ts"), "utf8");
  const heroSrc = readFileSync(resolve(root, "src/components/home/HeroPremium.tsx"), "utf8");
  const idxHtml = readFileSync(resolve(root, "index.html"), "utf8");

  if (servicosR) {
    const svcTitle = (servicosSrc.match(/const\s+TITLE\s*=\s*"([^"]+)"/) || [])[1];
    if (svcTitle !== servicosR.title) fail(`/servicos: title curado "${servicosR.title}" diverge de Servicos.tsx ("${svcTitle}")`);
    if (!/<h1[^>]*>\s*Serviços de informática em Curitiba/i.test(servicosSrc)) fail("/servicos: H1 deve ser 'Serviços de informática em Curitiba'");
  }

  const curBlock = (cidadesSrc.match(/curitiba:\s*\{[\s\S]*?\n\s{2}\},/) || [])[0] || "";
  const cmt = (curBlock.match(/metaTitle:\s*"([^"]+)"/) || [])[1];
  const ch1 = (curBlock.match(/h1:\s*"([^"]+)"/) || [])[1] || "";
  const ch1a = (curBlock.match(/h1Accent:\s*"([^"]+)"/) || [])[1] || "";
  const landingH1 = `${ch1} ${ch1a}`.trim();
  if (landingR && cmt !== landingR.title) fail(`landing: title curado "${landingR.title}" diverge de cidadesData.curitiba.metaTitle ("${cmt}")`);
  if (!INTENT_RE.test(landingH1)) fail(`landing: H1 "${landingH1}" deve conter a intenção 'Técnico de informática em Curitiba'`);

  // Home: title curado === index.html, H1 não usa a intenção-alvo e difere da landing
  if (homeR) {
    const htmlTitle = (idxHtml.match(/<title>([^<]+)<\/title>/) || [])[1];
    if (htmlTitle !== homeR.title) fail(`home: <title> em index.html ("${htmlTitle}") diverge do curado ("${homeR.title}")`);
  }
  if (INTENT_RE.test(heroSrc)) fail("home (HeroPremium): não pode conter a intenção 'Técnico de informática em Curitiba'");
  if (!/Soluções para computador, notebook, Wi-Fi/i.test(heroSrc)) fail("home: H1 esperado 'Soluções para computador, notebook, Wi-Fi e empresas' ausente no Hero");

  // Home: links para os 8 serviços + hub + landing local
  const HOME_SERVICE_LINKS = SERVICE_PATHS.map((p) => `/servicos/${p}`);
  for (const l of HOME_SERVICE_LINKS) {
    if (!heroSrc.includes(`"${l}"`)) fail(`home: link ausente para ${l}`);
  }
  if (!heroSrc.includes('"/servicos"')) fail("home: link ausente para /servicos");
  if (!heroSrc.includes('"/tecnico-informatica-curitiba"')) fail("home: link ausente para /tecnico-informatica-curitiba");

  // Home não deve linkar rotas legadas noindex
  for (const bad of ["/arrumar-pc", "/cftv", "/conserto-"]) {
    if (heroSrc.includes(bad)) fail(`home: link para rota legada noindex detectado (${bad})`);
  }
}

// ── 11. Onda 2C · fortalecimento dos 8 serviços comerciais ─────────────
// Fatos objetivos: intenção própria, títulos/H1 únicos e distintos de
// home/servicos/landing, empresarial ≠ "Empresa de TI", recuperação com
// aviso de "não garantida", formatação sem promessa universal, links
// internos apenas para rotas curadas (indexáveis) e mensagens de WhatsApp
// com contexto por serviço.
{
  const localSrc = readFileSync(resolve(root, "src/lib/servicosLocal.ts"), "utf8");
  const h1s = grabAll(/h1:\s*"([^"]+)"/g, coreSrc);
  const waMsgs = grabAll(/whatsappMessage:\s*"([^"]+)"/g, coreSrc);
  const bySlug = new Map();
  paths.forEach((p, i) => bySlug.set(p, { title: titles[i], h1: h1s[i], wa: waMsgs[i] }));

  const INTENT = {
    "formatacao": "formatação",
    "manutencao-de-notebook": "assistência técnica de notebook",
    "manutencao-de-computador": "assistência técnica de computador",
    "upgrade-ssd-ram": "instalação de ssd",
    "remocao-de-virus": "remoção de vírus",
    "recuperacao-de-dados": "recuperação de dados",
    "redes-e-wifi": "redes e wi-fi",
    "suporte-tecnico-empresarial": "suporte técnico para empresas",
  };

  const svcTitles = [];
  const svcH1s = [];
  for (const sp of SERVICE_PATHS) {
    const s = bySlug.get(sp);
    if (!s) { fail(`serviço ausente em servicosCore: ${sp}`); continue; }
    if (!s.title) fail(`serviço ${sp}: metaTitle ausente`);
    if (!s.h1) fail(`serviço ${sp}: h1 ausente`);
    if (!s.wa || s.wa.length < 12) fail(`serviço ${sp}: whatsappMessage sem contexto`);
    if (s.title && !s.title.toLowerCase().includes(INTENT[sp])) {
      fail(`serviço ${sp}: title não contém a intenção principal "${INTENT[sp]}"`);
    }
    svcTitles.push(s.title);
    svcH1s.push(s.h1);
  }
  if (new Set(svcTitles).size !== SERVICE_PATHS.length) fail("os 8 serviços devem ter titles distintos entre si");
  if (new Set(svcH1s).size !== SERVICE_PATHS.length) fail("os 8 serviços devem ter H1 distintos entre si");

  // Não colidir com home / /servicos / landing Curitiba (title e H1)
  const homeR2 = curatedByPath.get("/");
  const servicosR2 = curatedByPath.get("/servicos");
  const landingR2 = curatedByPath.get("/tecnico-informatica-curitiba");
  const hubTitles = [homeR2?.title, servicosR2?.title, landingR2?.title].filter(Boolean);
  for (const t of svcTitles) if (hubTitles.includes(t)) fail(`serviço com title idêntico a home/servicos/landing: "${t}"`);

  // Empresarial não usa "Empresa de TI em Curitiba" como foco (title/H1)
  const emp = bySlug.get("suporte-tecnico-empresarial");
  if (emp && /empresa de ti em curitiba/i.test(`${emp.title} ${emp.h1}`)) {
    fail("suporte empresarial: title/H1 não deve usar 'Empresa de TI em Curitiba' (pertence ao hub /empresa-de-ti-curitiba)");
  }

  // Blocos de conteúdo por serviço (bounded por chave de serviço 2-espaços)
  const blockFor = (slug) => {
    const start = coreSrc.indexOf(`path: "${slug}"`);
    if (start < 0) return "";
    const rest = coreSrc.slice(start + 6);
    const nextRel = rest.search(/\n\s{2}"?[a-z-]+"?:\s*\{/);
    return nextRel < 0 ? coreSrc.slice(start) : coreSrc.slice(start, start + 6 + nextRel);
  };
  if (!/não é garantida/i.test(blockFor("recuperacao-de-dados"))) {
    fail("recuperação: falta o aviso de que a recuperação 'não é garantida'");
  }
  if (!/nem sempre/i.test(blockFor("formatacao"))) {
    fail("formatação: falta a ressalva de que formatar 'nem sempre' resolve a lentidão");
  }

  // Links internos: todo destino deve ser rota curada (indexável) — sem legada/quebrada
  const linkTargets = [
    ...grabAll(/to:\s*"([^"]+)"/g, coreSrc),
    ...grabAll(/to:\s*"([^"]+)"/g, localSrc),
  ];
  // Páginas institucionais obrigatórias (não indexáveis, fora do sitemap) são
  // destinos legítimos de rodapé — não são rotas legadas nem quebradas.
  const INSTITUCIONAIS_PERMITIDAS = new Set([
    "/politica-de-privacidade",
    "/termos-e-condicoes",
    "/gestor-responsavel",
  ]);
  for (const t of linkTargets) {
    if (INSTITUCIONAIS_PERMITIDAS.has(t)) continue;
    if (!curatedByPath.has(t)) fail(`link interno para rota não curada/legada: ${t}`);
  }

  // Pós-build: HTML próprio dos 8 serviços — 1 H1, 1 title, 1 description, og:url self
  if (existsSync(distDir)) {
    for (const sp of SERVICE_PATHS) {
      const p = `/servicos/${sp}`;
      const file = resolve(distDir, "servicos", sp, "index.html");
      if (!existsSync(file)) { fail(`serviço ${p}: HTML ausente em dist${p}/index.html`); continue; }
      const h = readFileSync(file, "utf8");
      const h1c = (h.match(/<h1[\s>]/gi) || []).length;
      if (h1c !== 1) fail(`serviço ${p}: esperado exatamente 1 <h1> (achou ${h1c})`);
      if ((h.match(/<title>/g) || []).length !== 1) fail(`serviço ${p}: esperado exatamente 1 <title>`);
      if ((h.match(/name="description"/g) || []).length !== 1) fail(`serviço ${p}: esperado exatamente 1 meta description`);
      const ogUrl = (h.match(/property="og:url"\s+content="([^"]+)"/) || [])[1];
      if (ogUrl !== `${SITE}${p}`) fail(`serviço ${p}: og:url "${ogUrl}" não é self-referente`);
      if (/gpt-engineer/i.test(h)) fail(`serviço ${p}: contém referência a storage do gpt-engineer`);
    }
  }
}

// ── 12. Onda 2D · empresa de TI × suporte empresarial × 4 modalidades ──
// Fatos objetivos: intenção proprietária separada por rota, titles/H1
// distintos, mensagens de WhatsApp com contexto próprio e sem links para
// rotas legadas noindex nas 6 páginas do escopo.
{
  const D2D = {
    "/empresa-de-ti-curitiba": { file: "src/pages/EmpresaDeTiCuritiba.tsx", titleHas: "Empresa de TI", h1: "Soluções de TI para empresas em Curitiba", wa: "Quero avaliar as necessidades de informática da minha empresa em Curitiba." },
    "/atendimento-domicilio": { file: "src/pages/AtendimentoDomicilio.tsx", titleHas: "Domicílio", h1: "Atendimento técnico de informática em domicílio em Curitiba", wa: "Preciso verificar a possibilidade de atendimento técnico em domicílio." },
    "/atendimento-remoto": { file: "src/pages/AtendimentoRemoto.tsx", titleHas: "Suporte Remoto", h1: "Suporte remoto de informática para residências e empresas", wa: "Preciso de suporte remoto de informática." },
    "/coleta-e-entrega": { file: "src/pages/ColetaEntrega.tsx", titleHas: "Coleta e Entrega", h1: "Coleta e entrega agendada para equipamentos de informática", wa: "Preciso avaliar coleta e entrega para um computador ou notebook." },
    "/diagnostico-tecnico": { file: "src/pages/DiagnosticoTecnico.tsx", titleHas: "Diagnóstico Técnico", h1: "Diagnóstico técnico antes do reparo", wa: "Preciso solicitar um diagnóstico técnico para meu equipamento." },
  };

  // Suporte empresarial (fonte: servicosCore.ts, entrada única)
  const empSlug = "suporte-tecnico-empresarial";
  const empCur = curatedByPath.get(`/servicos/${empSlug}`);
  const empEntry = (() => {
    const start = coreSrc.indexOf(`"${empSlug}"`);
    const rest = coreSrc.slice(start);
    return rest.slice(0, rest.indexOf("dateModified"));
  })();
  const empH1 = (empEntry.match(/h1:\s*"([^"]+)"/) || [])[1] || "";
  const empWa = (empEntry.match(/whatsappMessage:\s*"([^"]+)"/) || [])[1] || "";

  if (!empCur || !/suporte técnico/i.test(empCur.title)) fail("suporte empresarial: title curado deve conter 'Suporte Técnico'");
  if (!/suporte técnico/i.test(empH1)) fail("suporte empresarial: H1 deve conter 'Suporte Técnico'");
  if (/empresa de ti em curitiba/i.test(`${empCur?.title} ${empH1}`)) fail("suporte empresarial: não deve usar 'Empresa de TI em Curitiba' no foco (title/H1)");
  if (!empWa || empWa.length < 12) fail("suporte empresarial: whatsappMessage sem contexto");

  const titles6 = [empCur?.title];
  const h1s6 = [empH1];
  const waMsgs6 = [empWa];

  for (const [routePath, spec] of Object.entries(D2D)) {
    const cur = curatedByPath.get(routePath);
    if (!cur) { fail(`Onda 2D ${routePath}: ausente de CURATED_ROUTES`); continue; }
    if (!cur.title.includes(spec.titleHas)) fail(`Onda 2D ${routePath}: title deve conter "${spec.titleHas}" (achou "${cur.title}")`);
    const src = readFileSync(resolve(root, spec.file), "utf8");
    if (!src.includes(spec.h1)) fail(`Onda 2D ${routePath}: H1 esperado ausente no componente ("${spec.h1}")`);
    if (!src.includes(spec.wa)) fail(`Onda 2D ${routePath}: mensagem de WhatsApp contextual ausente ("${spec.wa}")`);
    for (const bad of ["/arrumar-pc", "/cftv", "/conserto-"]) {
      if (src.includes(bad)) fail(`Onda 2D ${routePath}: link para rota legada noindex detectado (${bad})`);
    }
    titles6.push(cur.title);
    h1s6.push(spec.h1);
    waMsgs6.push(spec.wa);
  }

  if (new Set(titles6.filter(Boolean)).size !== 6) fail("Onda 2D: as 6 rotas devem ter titles distintos");
  if (new Set(h1s6.filter(Boolean)).size !== 6) fail("Onda 2D: as 6 rotas devem ter H1 distintos");
  if (new Set(waMsgs6.filter(Boolean)).size !== 6) fail("Onda 2D: as 6 rotas devem ter mensagens de WhatsApp distintas");

  // Pós-build: cada uma das 6 rotas tem exatamente 1 <h1>
  if (existsSync(distDir)) {
    const routes6 = ["/empresa-de-ti-curitiba", "/servicos/suporte-tecnico-empresarial", ...Object.keys(D2D)];
    for (const p of routes6) {
      const file = resolve(distDir, ...p.split("/").filter(Boolean), "index.html");
      if (!existsSync(file)) { fail(`Onda 2D ${p}: HTML ausente em dist${p}/index.html`); continue; }
      const h = readFileSync(file, "utf8");
      const h1c = (h.match(/<h1[\s>]/gi) || []).length;
      if (h1c !== 1) fail(`Onda 2D ${p}: esperado exatamente 1 <h1> (achou ${h1c})`);
    }
  }
}

let CURATED_CITY_COUNT = 0;
// ── 13. Onda 2E · anti-doorway das ${CURATED_CITY_COUNT} cidades + 5 bairros curados ───────
// Fatos objetivos: HTML próprio index/follow self-canonical (já validado
// na seção 9), titles/H1 únicos e com localidade correta, rede de links
// Curitiba↔bairros, ausência de links legados noindex, e ausência de
// introduções/FAQs textualmente idênticas entre localidades.
{
  const bairrosSrc = readFileSync(resolve(root, "src/lib/bairrosData.ts"), "utf8");
  const cidLayout = readFileSync(resolve(root, "src/components/cidade/CidadeLandingLayout.tsx"), "utf8");
  const bairroLayout = readFileSync(resolve(root, "src/components/bairro/BairroLocalLayout.tsx"), "utf8");
  const cidData = readFileSync(resolve(root, "src/lib/cidadesData.ts"), "utf8");

  CURATED_CITY_COUNT = 11;
  const CIDADES_2E = [
    { path: "/tecnico-informatica-curitiba", nome: "Curitiba" },
    { path: "/tecnico-informatica-sao-jose-pinhais", nome: "São José dos Pinhais" },
    { path: "/tecnico-informatica-pinhais", nome: "Pinhais" },
    { path: "/tecnico-informatica-colombo", nome: "Colombo" },
    { path: "/tecnico-informatica-araucaria", nome: "Araucária" },
    { path: "/tecnico-informatica-campo-largo", nome: "Campo Largo" },
    { path: "/tecnico-informatica-piraquara", nome: "Piraquara" },
    { path: "/tecnico-informatica-quatro-barras", nome: "Quatro Barras" },
    { path: "/tecnico-informatica-campo-magro", nome: "Campo Magro" },
    { path: "/tecnico-informatica-almirante-tamandare", nome: "Almirante Tamandaré" },
    { path: "/tecnico-informatica-fazenda-rio-grande", nome: "Fazenda Rio Grande" },
  ];
  const BAIRROS_2E = [
    { path: "/bairros/cic", slug: "cic", nome: "CIC" },
    { path: "/bairros/batel", slug: "batel", nome: "Batel" },
    { path: "/bairros/agua-verde", slug: "agua-verde", nome: "Água Verde" },
    { path: "/bairros/centro", slug: "centro", nome: "Centro" },
    { path: "/bairros/portao", slug: "portao", nome: "Portão" },
  ];

  // 13.1 — todas as 11 rotas presentes em CURATED_ROUTES
  for (const r of [...CIDADES_2E, ...BAIRROS_2E]) {
    if (!curatedByPath.has(r.path)) fail(`Onda 2E: rota ausente de CURATED_ROUTES: ${r.path}`);
  }

  // Helper: extrai blocos por chave de objeto em src (chave: { ... }) até a próxima chave de 4 espaços
  const sliceByKeys = (src, keys) => {
    const map = {};
    const idx = keys.map((k) => ({ k, i: src.indexOf(k) }));
    idx.sort((a, b) => a.i - b.i);
    for (let n = 0; n < idx.length; n++) {
      if (idx[n].i < 0) continue;
      const end = n + 1 < idx.length && idx[n + 1].i > 0 ? idx[n + 1].i : src.length;
      map[idx[n].k] = src.slice(idx[n].i, end);
    }
    return map;
  };

  // 13.2 — titles/H1 das cidades (fonte: curated + cidadesData)
  const cityTitles = [];
  const cityH1s = [];
  const cityBlocks = sliceByKeys(cidData, ["  curitiba:", '  "sao-jose-pinhais":', "  pinhais:", "  colombo:", "  araucaria:", '  "campo-largo":', "  piraquara:", '  "quatro-barras":', '  "campo-magro":', '  "almirante-tamandare":', '  "fazenda-rio-grande":']);
  const cityKeyByNome = {
    "Curitiba": "  curitiba:",
    "São José dos Pinhais": '  "sao-jose-pinhais":',
    "Pinhais": "  pinhais:",
    "Colombo": "  colombo:",
    "Araucária": "  araucaria:",
    "Campo Largo": '  "campo-largo":',
    "Piraquara": "  piraquara:",
    "Quatro Barras": '  "quatro-barras":',
    "Campo Magro": '  "campo-magro":',
    "Almirante Tamandaré": '  "almirante-tamandare":',
    "Fazenda Rio Grande": '  "fazenda-rio-grande":',
  };
  const cityIntros = [];
  for (const c of CIDADES_2E) {
    const cur = curatedByPath.get(c.path);
    if (cur) {
      if (!cur.title.includes(c.nome)) fail(`Onda 2E cidade ${c.path}: title não contém "${c.nome}"`);
      cityTitles.push(cur.title);
    }
    const blk = cityBlocks[cityKeyByNome[c.nome]] || "";
    const h1 = (blk.match(/h1:\s*"([^"]+)"/) || [])[1] || "";
    const h1a = (blk.match(/h1Accent:\s*"([^"]+)"/) || [])[1] || "";
    cityH1s.push(`${h1} ${h1a}`.trim());
    const firstProposta = (blk.match(/proposta:\s*\[\s*"([^"]+)"/) || [])[1] || "";
    cityIntros.push(firstProposta.split(c.nome).join("").replace(/\s+/g, " ").trim());
  }
  if (new Set(cityTitles).size !== CIDADES_2E.length) fail("Onda 2E: as cidades curadas devem ter titles distintos");
  if (new Set(cityH1s.filter(Boolean)).size !== CIDADES_2E.length) fail("Onda 2E: as cidades curadas devem ter H1 distintos");
  if (new Set(cityIntros.filter(Boolean)).size !== CIDADES_2E.length) fail("Onda 2E: introduções das cidades idênticas após remover o nome da cidade (doorway)");

  // 13.3 — titles/H1/intros/FAQ dos bairros (fonte: bairrosData)
  const bairroBlocks = sliceByKeys(bairrosSrc, ["  cic:", "  batel:", '  "agua-verde":', "  centro:", "  portao:"]);
  const bairroKey = { cic: "  cic:", batel: "  batel:", "agua-verde": '  "agua-verde":', centro: "  centro:", portao: "  portao:" };
  const bTitles = [];
  const bH1s = [];
  const bIntros = [];
  const bFaqs = [];
  for (const b of BAIRROS_2E) {
    const cur = curatedByPath.get(b.path);
    if (cur) {
      if (!cur.title.includes(b.nome)) fail(`Onda 2E bairro ${b.path}: title não contém "${b.nome}"`);
      bTitles.push(cur.title);
    }
    const blk = bairroBlocks[bairroKey[b.slug]] || "";
    if (!blk) { fail(`Onda 2E: bloco do bairro ${b.slug} não encontrado em bairrosData.ts`); continue; }
    const h1 = (blk.match(/h1:\s*"([^"]+)"/) || [])[1] || "";
    bH1s.push(h1);
    if (!h1.includes(b.nome)) fail(`Onda 2E bairro ${b.path}: H1 não contém "${b.nome}"`);
    const firstIntro = (blk.match(/introducaoLocal:\s*\[\s*"([^"]+)"/) || [])[1] || "";
    bIntros.push(firstIntro.split(b.nome).join("").replace(/\s+/g, " ").trim());
    const faqQs = [...blk.matchAll(/question:\s*"([^"]+)"/g)].map((m) => m[1]).join("|");
    bFaqs.push(faqQs);
  }
  if (new Set(bTitles).size !== BAIRROS_2E.length) fail("Onda 2E: os 5 bairros devem ter titles distintos");
  if (new Set(bH1s.filter(Boolean)).size !== BAIRROS_2E.length) fail("Onda 2E: os 5 bairros devem ter H1 distintos");
  if (new Set(bIntros.filter(Boolean)).size !== BAIRROS_2E.length) fail("Onda 2E: introduções dos bairros idênticas após remover o nome (doorway)");
  if (new Set(bFaqs.filter(Boolean)).size !== BAIRROS_2E.length) fail("Onda 2E: FAQs dos bairros idênticas entre páginas");

  // 13.4 — H1 de todas as páginas locais curadas distintos entre si
  const allLocalH1 = [...cityH1s, ...bH1s].filter(Boolean);
  const expectedLocalH1 = CIDADES_2E.length + BAIRROS_2E.length;
  if (new Set(allLocalH1).size !== expectedLocalH1)
    fail(`Onda 2E: os H1 das ${expectedLocalH1} páginas locais devem ser todos distintos`);

  // 13.5 — rede de links Curitiba ↔ bairros
  for (const b of BAIRROS_2E) {
    if (!bairroLayout.includes("/tecnico-informatica-curitiba")) {
      fail("Onda 2E: BairroLocalLayout deve linkar para /tecnico-informatica-curitiba");
      break;
    }
  }
  for (const b of BAIRROS_2E) {
    if (!cidData.includes(`"${b.path}"`)) fail(`Onda 2E: CURITIBA_BAIRROS ausente do link para ${b.path}`);
  }
  if (!/data\.slug === "curitiba"/.test(cidLayout) || !cidLayout.includes("CURITIBA_BAIRROS")) {
    fail("Onda 2E: CidadeLandingLayout deve renderizar CURITIBA_BAIRROS apenas para Curitiba");
  }

  // 13.6 — sem links legados noindex nas fontes locais
  for (const [name, src] of [["bairrosData.ts", bairrosSrc], ["BairroLocalLayout.tsx", bairroLayout], ["CidadeLandingLayout.tsx", cidLayout], ["cidadesData.ts", cidData]]) {
    for (const bad of ["/arrumar-pc", "/cftv", "/conserto-"]) {
      if (src.includes(bad)) fail(`Onda 2E: link legado noindex "${bad}" detectado em ${name}`);
    }
  }

  // 13.7 — todos os serviços prioritários dos bairros são rotas curadas
  const bairroServicePaths = [...bairrosSrc.matchAll(/"(\/servicos\/[a-z-]+)"/g)].map((m) => m[1]);
  for (const p of bairroServicePaths) {
    if (!curatedByPath.has(p)) fail(`Onda 2E: bairro linka rota de serviço não curada: ${p}`);
    if ((p.match(/\//g) || []).length > 2) fail(`Onda 2E: bairro linka serviço×bairro legado: ${p}`);
  }

  // 13.8 — WhatsApp com cidade/bairro correto na mensagem
  for (const b of BAIRROS_2E) {
    const blk = bairroBlocks[bairroKey[b.slug]] || "";
    const wa = (blk.match(/whatsappMessage:\s*"([^"]+)"/) || [])[1] || "";
    if (!wa.includes(b.nome)) fail(`Onda 2E bairro ${b.path}: whatsappMessage não contém "${b.nome}"`);
    if (!/curitiba/i.test(wa)) fail(`Onda 2E bairro ${b.path}: whatsappMessage não contém "Curitiba"`);
  }
  // data-neighborhood presente no layout de bairro
  if (!bairroLayout.includes("data-neighborhood")) fail("Onda 2E: BairroLocalLayout deve incluir data-neighborhood nos CTAs");
  if (!bairroLayout.includes('data-city="Curitiba"')) fail("Onda 2E: BairroLocalLayout deve incluir data-city nos CTAs");

  // 13.9 — sem endereço/unidade física inventada nos bairros
  for (const bad of ["addressLocality", "streetAddress", "PostalAddress", "aggregateRating", "AggregateRating"]) {
    if (bairroLayout.includes(bad)) fail(`Onda 2E: BairroLocalLayout não deve declarar "${bad}" (endereço/rating inventado)`);
  }

  // 13.10 — pós-build: cada uma das 11 rotas com exatamente 1 <h1>
  if (existsSync(distDir)) {
    for (const r of [...CIDADES_2E, ...BAIRROS_2E]) {
      const file = resolve(distDir, ...r.path.split("/").filter(Boolean), "index.html");
      if (!existsSync(file)) { fail(`Onda 2E ${r.path}: HTML ausente em dist${r.path}/index.html`); continue; }
      const h = readFileSync(file, "utf8");
      const h1c = (h.match(/<h1[\s>]/gi) || []).length;
      if (h1c !== 1) fail(`Onda 2E ${r.path}: esperado exatamente 1 <h1> (achou ${h1c})`);
    }
  }
}

if (errors.length) {
  console.error("❌ check-curated-meta: falhas encontradas:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

console.log(`✅ check-curated-meta: OK — 8 serviços em paridade, ${CURATED_CITY_COUNT} cidades + 5 bairros curados sem doorway, imagens sociais alinhadas, nome institucional "${OFFICIAL_NAME}", /valores sem canonical próprio, 108 rotas legadas noindex e sitemaps derivados do manifesto curado.`);

