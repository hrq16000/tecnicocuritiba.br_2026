#!/usr/bin/env node
/**
 * IndexNow ping helper.
 * Lê todas as URLs dos sitemaps em public/ e dispara um POST batch para
 * os principais search engines que suportam IndexNow (Bing/Yandex/Seznam).
 *
 * Uso: node scripts/indexnow-ping.mjs [--key <KEY>] [--host tecnico.curitiba.br]
 *
 * O key file precisa estar disponível em https://<host>/<KEY>.txt contendo só a KEY.
 * Definimos KEY default em INDEXNOW_KEY env var. Se ausente, gera um aviso e sai 0.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { exitIfLocalMode } from "./lib/local-mode.mjs";

// Ambiente local/offline: nao chama servicos externos.
exitIfLocalMode("IndexNow", "ping de sitemaps");

const HOST = process.env.INDEXNOW_HOST || "tecnico.curitiba.br";
const KEY = process.env.INDEXNOW_KEY;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

if (!KEY) {
  console.warn("[indexnow] INDEXNOW_KEY não definido — pulando ping (sem erro).");
  process.exit(0);
}

function extractUrlsFromSitemap(xml) {
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  return Array.from(matches, (m) => m[1].trim()).filter((u) => u.includes(HOST));
}

const publicDir = resolve(process.cwd(), "public");
const sitemaps = readdirSync(publicDir).filter((f) => f.startsWith("sitemap") && f.endsWith(".xml"));
const urls = new Set();
for (const f of sitemaps) {
  try {
    const xml = readFileSync(resolve(publicDir, f), "utf8");
    extractUrlsFromSitemap(xml).forEach((u) => urls.add(u));
  } catch (e) {
    console.warn(`[indexnow] falha ao ler ${f}:`, e.message);
  }
}

const urlList = Array.from(urls);
if (urlList.length === 0) {
  console.warn("[indexnow] nenhuma URL encontrada nos sitemaps.");
  process.exit(0);
}

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
console.log(`[indexnow] ${res.status} ${res.statusText} — ${urlList.length} URLs enviadas`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
