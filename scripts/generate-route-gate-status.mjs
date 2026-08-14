#!/usr/bin/env node
/**
 * PAINEL DE INDEXAÇÃO POR ROTA — apta para sitemap × bloqueada, com o motivo
 * exato E A EVIDÊNCIA (trecho/rota semelhante, regra de imagem que falhou),
 * mais o link direto para o artefato do relatório de origem.
 *
 * Fontes:
 *   • originalidade  — reports/originality.json
 *   • prova visual   — reports/real-images.json
 *   • imagens de IA  — reports/ai-images.json
 *   • diferenciação  — reports/route-differentiation.json
 *   • redirects      — reports/curated-redirects.json
 *
 * Saídas:
 *   • public/route-gate-status.json
 *   • public/reports/*.json  (cópia dos artefatos, para link direto no painel)
 *
 * Uso: node scripts/generate-route-gate-status.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const FONTES = {
  originalidade: "reports/originality.json",
  "prova visual": "reports/real-images.json",
  imagens: "reports/ai-images.json",
  "diferenciação": "reports/route-differentiation.json",
  redirects: "reports/curated-redirects.json",
};

const originality = readJson(FONTES.originalidade);
const realImages = readJson(FONTES["prova visual"]);
const aiImages = readJson(FONTES.imagens);
const diff = readJson(FONTES["diferenciação"]);
const redirects = readJson(FONTES.redirects);

// Cópia dos artefatos para /reports/*.json (link direto a partir do painel).
mkdirSync("public/reports", { recursive: true });
const artefatos = {};
for (const [cat, file] of Object.entries(FONTES)) {
  if (!existsSync(file)) continue;
  const nome = file.split("/").pop();
  copyFileSync(file, `public/reports/${nome}`);
  artefatos[cat] = `/reports/${nome}`;
}

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();

const byPath = (list, key = "path") => new Map((list ?? []).map((x) => [x[key], x]));
const orig = byPath(originality?.pages);
const fotos = byPath(realImages?.pages);
const ia = byPath(aiImages?.pages);
const dif = byPath(diff?.rotas);
const red = byPath(redirects?.rows ?? redirects?.pages ?? redirects?.results);

/** Pares semelhantes por rota (evidência de baixa diferenciação). */
const paresPorRota = new Map();
const addPar = (fonte, a, b, jaccard, max) => {
  for (const [rota, outra] of [[a, b], [b, a]]) {
    const lista = paresPorRota.get(rota) ?? [];
    lista.push({ fonte, similarA: outra, jaccard, max: max ?? null });
    paresPorRota.set(rota, lista);
  }
};
for (const p of originality?.duplicatePairs ?? []) addPar("originalidade", p.a, p.b, p.jaccard, p.max);
for (const p of diff?.pares ?? []) addPar("diferenciação", p.a, p.b, p.jaccard, diff?.regras?.maxJaccard);

const rotas = curated.map((path) => {
  const motivos = [];
  const evidencias = [];
  const push = (categoria, motivo, detalhe) => {
    motivos.push(`${categoria}: ${motivo}`);
    evidencias.push({
      categoria,
      motivo,
      detalhe: detalhe ?? null,
      artefato: artefatos[categoria] ?? null,
    });
  };

  const o = orig.get(path);
  const origOk = o ? (o.problems?.length ?? 0) === 0 && (o.words ?? 0) >= (o.minWords ?? 0) : null;
  if (origOk === false) {
    const lista = o.problems?.length ? o.problems : [`corpo com ${o.words} palavras (mín. ${o.minWords})`];
    for (const m of lista) push("originalidade", m, `família ${o.family ?? "—"} · ${o.words ?? "—"} palavras`);
  }

  const f = fotos.get(path);
  for (const m of f?.problems ?? []) {
    push(
      "prova visual",
      m,
      `${f.provas?.length ?? 0} foto(s) válida(s) — regras: mín. ${realImages?.rules?.MIN_FOTOS ?? "?"} fotos, ${
        (realImages?.rules?.MIN_BYTES ?? 0) / 1024
      } KB por foto, reuso máx. ${realImages?.rules?.MAX_REUSO ?? "?"}`,
    );
  }

  const a = ia.get(path);
  for (const m of a?.problems ?? []) {
    push("imagens", m, `${a.reais ?? 0} real(is) · ${a.suspeitas ?? 0} suspeita(s) de IA de ${a.imagens ?? 0}`);
  }

  const d = dif.get(path);
  for (const m of d?.problems ?? []) push("diferenciação", m, d.title ? `title: ${d.title}` : null);

  const r = red.get(path);
  if (r && (r.error || (r.finalStatus && r.finalStatus !== 200))) {
    push("redirects", r.error || `status final ${r.finalStatus}`, r.chain ? `cadeia: ${[].concat(r.chain).join(" → ")}` : null);
  }

  // Evidência de similaridade: as 3 rotas mais parecidas com esta.
  const semelhantes = (paresPorRota.get(path) ?? [])
    .sort((x, y) => y.jaccard - x.jaccard)
    .slice(0, 3);
  for (const s of semelhantes) {
    const ev = evidencias.find((e) => e.categoria === s.fonte);
    if (ev) {
      ev.semelhantes = ev.semelhantes ?? [];
      ev.semelhantes.push(s);
    }
  }

  return {
    path,
    apta: motivos.length === 0,
    motivos,
    evidencias,
    semelhantes,
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
  artefatos,
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
