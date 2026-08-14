#!/usr/bin/env node
/**
 * PAINEL DE INDEXAÇÃO POR ROTA — apta para sitemap × bloqueada, com o motivo exato.
 *
 * Consolida em um único JSON lido por /admin/indexacao:
 *   • originalidade  — reports/originality.json
 *   • prova visual   — reports/real-images.json
 *   • imagens de IA  — reports/ai-images.json
 *   • diferenciação  — reports/route-differentiation.json
 *   • redirects      — reports/curated-redirects.json
 *   • sitemap        — presença na lista curada
 *
 * Saída: public/route-gate-status.json
 * Uso: node scripts/generate-route-gate-status.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const originality = readJson("reports/originality.json");
const realImages = readJson("reports/real-images.json");
const aiImages = readJson("reports/ai-images.json");
const diff = readJson("reports/route-differentiation.json");
const redirects = readJson("reports/curated-redirects.json");

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();

const byPath = (list, key = "path") => new Map((list ?? []).map((x) => [x[key], x]));
const orig = byPath(originality?.pages);
const fotos = byPath(realImages?.pages);
const ia = byPath(aiImages?.pages);
const dif = byPath(diff?.rotas);
const red = byPath(redirects?.rows ?? redirects?.pages ?? redirects?.results);

const rotas = curated.map((path) => {
  const motivos = [];

  const o = orig.get(path);
  const origOk = o ? (o.problems?.length ?? 0) === 0 && (o.words ?? 0) >= (o.minWords ?? 0) : null;
  if (origOk === false) motivos.push(...(o.problems?.length ? o.problems : [`corpo com ${o.words} palavras (mín. ${o.minWords})`]).map((m) => `originalidade: ${m}`));

  const f = fotos.get(path);
  if (f && (f.problems?.length ?? 0) > 0) motivos.push(...f.problems.map((m) => `prova visual: ${m}`));

  const a = ia.get(path);
  if (a && (a.problems?.length ?? 0) > 0) motivos.push(...a.problems.map((m) => `imagens: ${m}`));

  const d = dif.get(path);
  if (d && (d.problems?.length ?? 0) > 0) motivos.push(...d.problems.map((m) => `diferenciação: ${m}`));

  const r = red.get(path);
  if (r && (r.error || (r.finalStatus && r.finalStatus !== 200))) {
    motivos.push(`redirects: ${r.error || `status final ${r.finalStatus}`}`);
  }

  return {
    path,
    apta: motivos.length === 0,
    motivos,
    sinais: {
      palavras: o?.words ?? d?.words ?? null,
      minPalavras: o?.minWords ?? null,
      fotosReais: f?.provas?.length ?? f?.fotos ?? null,
      imagensSuspeitas: a?.suspeitas ?? null,
      statusHttp: r?.finalStatus ?? null,
      title: d?.title ?? null,
    },
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  fontes: {
    originality: originality?.generatedAt ?? null,
    realImages: realImages?.generatedAt ?? null,
    aiImages: aiImages?.generatedAt ?? null,
    differentiation: diff?.generatedAt ?? null,
    redirects: redirects?.generatedAt ?? null,
  },
  totals: {
    rotas: rotas.length,
    aptas: rotas.filter((r) => r.apta).length,
    bloqueadas: rotas.filter((r) => !r.apta).length,
  },
  rotas,
};

mkdirSync("public", { recursive: true });
writeFileSync("public/route-gate-status.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(
  `route-gate-status: ${payload.totals.rotas} rotas · ${payload.totals.aptas} aptas · ${payload.totals.bloqueadas} bloqueadas`,
);
