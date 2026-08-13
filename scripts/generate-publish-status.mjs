#!/usr/bin/env node
/**
 * PAINEL DE PUBLICAÇÃO — consolida o status por URL antes de cada onda.
 *
 * Junta, em um único arquivo lido pelo painel interno (/admin/publicacao):
 *   • sitemap        — URL já está no sitemap curado?
 *   • originalidade  — reports/originality.json (palavras, mínimo, aprovação)
 *   • fotos          — reports/real-images.json (prova visual real)
 *   • onda           — scripts/lib/content-waves.mjs (semana, aprovação)
 *   • pronto         — originalidade OK + fotos OK + onda OK
 *
 * Saída: public/publish-status.json  (servido ao painel; sem dado sensível)
 *
 * Uso: node scripts/generate-publish-status.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { LEGADO, WAVES, WAVE_MAX, WAVE_MIN, waveStatus } from "./lib/content-waves.mjs";

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const originality = readJson("reports/originality.json");
const realImages = readJson("reports/real-images.json");
const approval = readJson("reports/content-approval.json");

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const curatedSet = new Set(curated);

const existsInPublic = (p) => existsSync(path.resolve("public", p.replace(/^\//, "")));
const ondas = waveStatus(existsInPublic);
const ondaDe = new Map();
for (const onda of ondas) {
  for (const p of onda.paths) ondaDe.set(p, { week: onda.week, approved: onda.approved, problems: onda.problems });
}
const legado = new Set(LEGADO);

const origPorPath = new Map((originality?.pages ?? []).map((p) => [p.path, p]));
const origBloqueadas = new Map((originality?.blocked ?? []).map((b) => [b.path ?? b, b.reasons ?? []]));
const fotosPorPath = new Map((realImages?.pages ?? []).map((p) => [p.path, p]));
const aprovadasOrig = new Set(approval?.approved ?? []);

const urls = [];
const todas = [...new Set([...curated, ...WAVES.flatMap((w) => w.paths)])].sort();

for (const p of todas) {
  const orig = origPorPath.get(p);
  const fotos = fotosPorPath.get(p);
  const onda = ondaDe.get(p);

  const originalidade = {
    words: orig?.words ?? null,
    minWords: orig?.minWords ?? orig?.rules?.minWords ?? null,
    ok: aprovadasOrig.size ? aprovadasOrig.has(p) : orig ? (orig.words ?? 0) >= (orig.minWords ?? Infinity) : null,
    reasons: origBloqueadas.get(p) ?? [],
  };

  const provaVisual = fotos
    ? { avaliada: true, fotos: fotos.provas?.length ?? 0, ok: (fotos.problems?.length ?? 0) === 0, problems: fotos.problems ?? [] }
    : { avaliada: false, fotos: null, ok: null, problems: [] };

  const ondaInfo = onda
    ? { week: onda.week, approved: onda.approved, problems: onda.problems }
    : legado.has(p)
      ? { week: "legado", approved: true, problems: [] }
      : { week: null, approved: null, problems: [] };

  const bloqueios = [
    ...(originalidade.ok === false ? originalidade.reasons.length ? originalidade.reasons : ["originalidade insuficiente"] : []),
    ...(provaVisual.ok === false ? provaVisual.problems : []),
    ...(ondaInfo.approved === false ? ondaInfo.problems : []),
  ];

  const prontoParaSitemap =
    originalidade.ok === true && provaVisual.ok !== false && ondaInfo.approved !== false;

  urls.push({
    path: p,
    family: orig?.family ?? fotos?.family ?? null,
    noSitemap: curatedSet.has(p),
    originalidade,
    provaVisual,
    onda: ondaInfo,
    bloqueios,
    // rascunho → em prova → pronto → publicado
    estado: curatedSet.has(p)
      ? prontoParaSitemap
        ? "publicado"
        : "publicado-com-pendencia"
      : prontoParaSitemap
        ? "pronto"
        : bloqueios.length
          ? "em-prova"
          : "rascunho",
  });
}

const payload = {
  generatedAt: new Date().toISOString(),
  fontes: {
    originality: originality?.generatedAt ?? null,
    realImages: realImages?.generatedAt ?? null,
    contentApproval: approval ? "presente" : "ausente",
  },
  regras: { WAVE_MIN, WAVE_MAX },
  ondas,
  totals: {
    urls: urls.length,
    noSitemap: urls.filter((u) => u.noSitemap).length,
    prontas: urls.filter((u) => u.estado === "pronto").length,
    comPendencia: urls.filter((u) => u.estado === "publicado-com-pendencia").length,
    emProva: urls.filter((u) => u.estado === "em-prova").length,
  },
  urls,
};

mkdirSync("public", { recursive: true });
writeFileSync("public/publish-status.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(
  `publish-status: ${payload.totals.urls} URLs · ${payload.totals.noSitemap} no sitemap · ` +
    `${payload.totals.prontas} pronta(s) · ${payload.totals.comPendencia} publicada(s) com pendência`,
);
