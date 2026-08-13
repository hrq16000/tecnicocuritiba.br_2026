// Gera o sitemap CURADO para tecnico.curitiba.br a partir do manifesto único
// `scripts/lib/curated-urls.mjs` (fonte da verdade das URLs indexáveis).
// Este arquivo NÃO declara URLs: apenas serializa o manifesto em XML.
// Runs via predev/prebuild; outputs to public/.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ACTIVE_SITEMAPS, BASE_URL, EMPTY_SITEMAPS } from "./lib/curated-urls.mjs";
import { lastmodFor } from "./lib/lastmod.mjs";

// Só entra no sitemap URL aprovada no check de originalidade
// (reports/content-approval.json, gerado por scripts/check-originality.mjs).
// Sem relatório disponível, o manifesto curado é usado integralmente.
const APPROVAL_FILE = resolve("reports/content-approval.json");
const blocked = new Set();
if (existsSync(APPROVAL_FILE)) {
  try {
    const data = JSON.parse(readFileSync(APPROVAL_FILE, "utf8"));
    for (const item of data.blocked ?? []) blocked.add(item.path);
  } catch {
    console.warn("aviso: reports/content-approval.json ilegível — sitemap gerado sem filtro de originalidade.");
  }
}

function buildUrlset(entries) {
  const urls = entries
    .filter((e) => !blocked.has(e.path))
    .map((e) => {
      const lastmod = e.lastmod ?? lastmodFor(e.path);
      return `  <url><loc>${BASE_URL}${e.path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;

for (const [name, entries] of ACTIVE_SITEMAPS) {
  writeFileSync(resolve("public", name), buildUrlset(entries));
}

// Zera sub-sitemaps herdados para parar de servir conteúdo thin/duplicado.
for (const name of EMPTY_SITEMAPS) {
  writeFileSync(resolve("public", name), EMPTY_URLSET);
}

// Índice apenas com os sitemaps ativos e curados.
const indexXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ACTIVE_SITEMAPS.map(([name]) => `  <sitemap><loc>${BASE_URL}/${name}</loc></sitemap>`).join("\n") +
  `\n</sitemapindex>\n`;

writeFileSync(resolve("public/sitemap-index.xml"), indexXml);
// Alias legado.
writeFileSync(resolve("public/sitemap.xml"), indexXml);

const declaradas = ACTIVE_SITEMAPS.reduce((n, [, e]) => n + e.length, 0);
const emitidas = ACTIVE_SITEMAPS.reduce((n, [, e]) => n + e.filter((x) => !blocked.has(x.path)).length, 0);
console.log(
  `sitemap curado: index + ${ACTIVE_SITEMAPS.length} sub-sitemaps (${emitidas}/${declaradas} urls${blocked.size ? `, ${declaradas - emitidas} bloqueadas por originalidade` : ""})`,
);
