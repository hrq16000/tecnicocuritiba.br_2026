#!/usr/bin/env node
/**
 * GATE DE RELEVÂNCIA LOCAL DAS PÁGINAS DE SERVIÇO.
 *
 * Antes de aprovar uma URL de serviço, exige duas provas de localidade:
 *
 *   1. MENÇÕES  — pelo menos MIN_MENCOES bairros distintos citados de forma
 *                 natural no corpo renderizado (nome real do bairro, não slug);
 *   2. LINKS    — pelo menos MIN_LINKS links internos coerentes com o mapa
 *                 bairro→serviços gerado em src/lib/localLinkMap.ts.
 *
 * Saída: public/bairro-mentions.json (lido pelo painel /admin/publicacao).
 *
 * Uso:
 *   node scripts/check-bairro-mentions.mjs dist          # relatório
 *   node scripts/check-bairro-mentions.mjs dist --gate   # falha se houver
 *                                                        # serviço indexável fora da regra
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { BAIRRO_NOMES } from "./lib/local-nomes.mjs";
import { classificarEstatico, corpoPrincipal } from "./lib/static-heuristics.mjs";

const args = process.argv.slice(2);
const GATE = args.includes("--gate");
const STATIC_MODE = args.includes("--static");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");

export const MIN_MENCOES = 3;
export const MIN_LINKS = 3;

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const curatedSet = new Set(curated);
const alvos = curated.filter((p) => p.startsWith("/servicos/"));

/** Mapa esperado de links locais (extraído do arquivo gerado). */
function lerLinkMap() {
  const file = "src/lib/localLinkMap.ts";
  if (!existsSync(file)) return {};
  const src = readFileSync(file, "utf8");
  const bloco = src.split("BAIRROS_POR_SERVICO")[1] ?? "";
  const mapa = {};
  let atual = null;
  for (const linha of bloco.split("\n")) {
    const chave = linha.match(/^\s{2}"(\/[^"]+)":/);
    if (chave) {
      atual = chave[1];
      mapa[atual] = [];
      continue;
    }
    const href = linha.match(/"href":\s*"(\/[^"]+)"/);
    if (href && atual) mapa[atual].push(href[1]);
  }
  return mapa;
}
const LINKMAP = lerLinkMap();

const extractor = () => {
  const root = document.querySelector("main") ?? document.body;
  return {
    texto: (root.textContent || "").replace(/\s+/g, " "),
    links: [...root.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href") || ""),
  };
};

/** confiança da leitura por rota (ver scripts/lib/static-heuristics.mjs). */
const confiancaPorPath = new Map();

function lerEstatico(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (!existsSync(file)) {
    confiancaPorPath.set(routePath, { confianca: "ausente", motivo: "HTML não encontrado no dist" });
    return null;
  }
  const html = readFileSync(file, "utf8");
  const cls = classificarEstatico(html);
  confiancaPorPath.set(routePath, { confianca: cls.confianca, motivo: cls.motivo });
  // Só o <main>: header/footer trazem links globais que não provam nada local.
  const main = corpoPrincipal(html);
  return {
    texto: main
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
    links: [...main.matchAll(/<a[^>]+href="(\/[^"]*)"/gi)].map((m) => m[1]),
  };
}

const dados = new Map();
if (STATIC_MODE) {
  for (const p of alvos) dados.set(p, lerEstatico(p));
} else {
  const { withRenderedPages } = await import("./lib/rendered-dom.mjs");
  try {
    const { results } = await withRenderedPages({
      dist: DIST,
      paths: alvos,
      port: Number(process.env.BAIRRO_MENTIONS_PORT || 4194),
      extractor,
    });
    for (const p of alvos) {
      if (results.has(p)) {
        dados.set(p, results.get(p));
        confiancaPorPath.set(p, { confianca: "renderizado", motivo: "DOM renderizado no Chromium" });
      } else {
        dados.set(p, lerEstatico(p));
      }
    }
  } catch (err) {
    console.warn(`AVISO: gate de menções caiu para o modo estático — ${err.message}`);
    for (const p of alvos) dados.set(p, lerEstatico(p));
  }
}

const urls = alvos.map((p) => {
  const d = dados.get(p);
  const texto = (d?.texto ?? "").toLowerCase();
  const mencionados = Object.entries(BAIRRO_NOMES)
    .filter(([, nome]) => texto.includes(nome.toLowerCase()))
    .map(([slug]) => slug);

  const esperados = LINKMAP[p] ?? [];
  const encontrados = [
    ...new Set(
      (d?.links ?? [])
        .map((h) => h.split("#")[0].split("?")[0].replace(/\/$/, "") || "/")
        .filter((h) => h !== p && curatedSet.has(h) && (h.startsWith("/bairros/") || esperados.includes(h))),
    ),
  ];
  const coerentes = esperados.length ? encontrados.filter((h) => esperados.includes(h)) : encontrados;
  const faltando = esperados.filter((h) => !encontrados.includes(h));

  // O bloco de prova local (links bairro⇄serviço) é hidratado no cliente:
  // no HTML estático a contagem de links nunca é conclusiva. As MENÇÕES, sim —
  // o corpo textual é pré-renderizado. Por isso o modo heurístico avalia texto
  // e deixa os links pendentes até rodar com DOM renderizado.
  const linksConclusivos = confiancaPorPath.get(p)?.confianca === "renderizado";

  const problemas = [];
  const inconclusivos = [];
  if (!d) problemas.push("página não renderizou");
  if (mencionados.length < MIN_MENCOES)
    problemas.push(`${mencionados.length} bairro(s) citado(s), mínimo ${MIN_MENCOES}`);
  if (coerentes.length < MIN_LINKS) {
    const msg = `${coerentes.length} link(s) locais coerentes, mínimo ${MIN_LINKS}`;
    if (linksConclusivos) problemas.push(msg);
    else inconclusivos.push(`${msg} (links não medidos no HTML estático)`);
  }

  const conf = confiancaPorPath.get(p)?.confianca ?? "ausente";
  const conclusiva =
    (conf === "renderizado" || conf === "estatico-confiavel") && inconclusivos.length === 0;

  const comoResolver = [];
  if (mencionados.length < MIN_MENCOES)
    comoResolver.push(
      `Citar naturalmente no corpo pelo menos ${MIN_MENCOES} bairros atendidos (hoje: ${mencionados.length}) — ex.: casos e logística de coleta em ${Object.values(BAIRRO_NOMES).slice(0, 3).join(", ")}.`,
    );
  if (coerentes.length < MIN_LINKS)
    comoResolver.push(
      faltando.length
        ? `Incluir os links internos do mapa local que faltam: ${faltando.join(", ")}.`
        : `Adicionar ${MIN_LINKS - coerentes.length} link(s) para páginas de bairro curadas no bloco de prova local.`,
    );
  if (!conclusiva)
    comoResolver.push(
      'Rodar o gate com DOM renderizado ("npx playwright install --with-deps chromium") — o HTML estático desta rota traz só o shell.',
    );

  return {
    path: p,
    noSitemap: curatedSet.has(p),
    confianca: conf,
    confiancaMotivo: confiancaPorPath.get(p)?.motivo ?? null,
    conclusiva,
    status: !conclusiva ? "pendente" : problemas.length ? "reprovada" : "aprovada",
    inconclusivos,
    evidencias: {
      bairrosEncontrados: mencionados,
      linksEncontrados: coerentes,
      linksFaltando: faltando,
    },
    comoResolver,
    mencoes: mencionados.length,
    bairrosCitados: mencionados,
    linksLocais: coerentes.length,
    linksExemplo: coerentes.slice(0, 6),
    linksFaltando: faltando.slice(0, 6),
    problemas,
    aprovada: problemas.length === 0,
  };
});

mkdirSync("public", { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  regras: { MIN_MENCOES, MIN_LINKS, modo: STATIC_MODE ? "estatico-heuristico" : "renderizado" },
  totals: {
    avaliadas: urls.length,
    aprovadas: urls.filter((u) => u.aprovada).length,
    reprovadas: urls.filter((u) => u.status === "reprovada").length,
    pendentes: urls.filter((u) => u.status === "pendente").length,
  },
  urls,
};
writeFileSync("public/bairro-mentions.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(
  `check-bairro-mentions: ${payload.totals.aprovadas}/${payload.totals.avaliadas} páginas de serviço ` +
    `com relevância local mínima → public/bairro-mentions.json`,
);

if (GATE) {
  // Modo heurístico: só reprova URLs com leitura conclusiva (DOM renderizado
  // ou HTML estático com corpo real). Shell-only fica pendente.
  const pendentes = urls.filter((u) => u.noSitemap && !u.conclusiva);
  const falhas = urls.filter((u) => u.noSitemap && u.conclusiva && !u.aprovada);
  if (falhas.length) {
    console.error(`BLOQUEADO: ${falhas.length} página(s) de serviço sem relevância local mínima:`);
    for (const f of falhas.slice(0, 20)) {
      console.error(
        `  - ${f.path}: ${f.problemas.join("; ")}\n` +
          `      evidência: bairros ${f.evidencias.bairrosEncontrados.slice(0, 6).join(", ") || "—"} · links ${f.evidencias.linksEncontrados.slice(0, 6).join(", ") || "—"}\n` +
          `      como passar: ${f.comoResolver.join(" ")}`,
      );
    }
    process.exit(1);
  }
  if (pendentes.length) {
    console.warn(
      `AVISO: ${pendentes.length} página(s) pendente(s) — HTML estático não conclusivo; rode com DOM renderizado antes de liberar o índice.`,
    );
  }
  console.log("gate de menções de bairro: nenhuma página conclusiva reprovada.");
}
