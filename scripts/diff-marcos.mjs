#!/usr/bin/env node
/**
 * ============================================================================
 * DIFF AUTOMÁTICO ENTRE SNAPSHOTS DE MARCO (title / H1 / canonical / schema)
 * ============================================================================
 * Compara `reports/serp-signals-<a>.json` com `reports/serp-signals-<b>.json`
 * e reporta, URL a URL, tudo que mudou na identidade de SERP entre dois marcos.
 *
 * Só MEDE: não altera conteúdo, sitemap, canonical ou IndexNow.
 * Mudança de canonical/robots é tratada como severidade ALTA (pode explicar
 * saída do índice); title/H1/description como MÉDIA; schema como MÉDIA.
 *
 * Uso:
 *   node scripts/diff-marcos.mjs                 # dois marcos mais recentes
 *   node scripts/diff-marcos.mjs --de=D0 --para=D7
 *
 * Saídas: reports/diff-marcos.json · public/diff-marcos.json · reports/diff-marcos.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { registrarJob } from "./lib/job-log.mjs";

const inicio = Date.now();
const args = process.argv.slice(2);
const arg = (n) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null;

const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};

const historico = lerJson("reports/operacao-marcos.json") ?? { marcos: [] };
const disponiveis = (historico.marcos ?? [])
  .map((m) => m.marco)
  .filter((m) => existsSync(`reports/serp-signals-${m.toLowerCase()}.json`));

const DE = (arg("de") ?? disponiveis[disponiveis.length - 2] ?? "").toUpperCase();
const PARA = (arg("para") ?? disponiveis[disponiveis.length - 1] ?? "").toUpperCase();

const sinais = (marco) => lerJson(`reports/serp-signals-${marco.toLowerCase()}.json`)?.sinais ?? null;
const a = DE ? sinais(DE) : null;
const b = PARA ? sinais(PARA) : null;

const SEVERIDADE = { canonical: "alta", robots: "alta", title: "media", h1: "media", description: "baixa", schema: "media" };

const mudancas = [];
let comparadas = 0;

if (a && b && DE !== PARA) {
  const paths = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  for (const path of paths) {
    const antes = a[path];
    const depois = b[path];
    if (!antes) {
      mudancas.push({ path, campo: "url", severidade: "media", antes: null, depois: "presente", nota: "URL nova no snapshot" });
      continue;
    }
    if (!depois) {
      mudancas.push({ path, campo: "url", severidade: "alta", antes: "presente", depois: null, nota: "URL saiu do snapshot" });
      continue;
    }
    comparadas += 1;
    for (const campo of ["title", "description", "canonical", "robots", "h1"]) {
      if ((antes[campo] ?? null) !== (depois[campo] ?? null))
        mudancas.push({ path, campo, severidade: SEVERIDADE[campo], antes: antes[campo] ?? null, depois: depois[campo] ?? null });
    }
    const sa = [...(antes.schema ?? [])].sort();
    const sb = [...(depois.schema ?? [])].sort();
    if (JSON.stringify(sa) !== JSON.stringify(sb)) {
      const removidos = sa.filter((t) => !sb.includes(t));
      const adicionados = sb.filter((t) => !sa.includes(t));
      mudancas.push({
        path,
        campo: "schema",
        severidade: removidos.length ? "alta" : "media",
        antes: sa.join(", ") || "—",
        depois: sb.join(", ") || "—",
        nota: [removidos.length ? `removido: ${removidos.join(", ")}` : null, adicionados.length ? `adicionado: ${adicionados.join(", ")}` : null]
          .filter(Boolean)
          .join(" · "),
      });
    }
  }
}

const porSeveridade = (s) => mudancas.filter((m) => m.severidade === s).length;
const relatorio = {
  geradoEm: new Date().toISOString(),
  de: DE || null,
  para: PARA || null,
  disponivel: Boolean(a && b && DE !== PARA),
  motivo: a && b && DE !== PARA ? null : "N/A — são necessários dois marcos com snapshot de SERP registrado",
  urlsComparadas: comparadas || null,
  total: mudancas.length,
  alta: porSeveridade("alta"),
  media: porSeveridade("media"),
  baixa: porSeveridade("baixa"),
  mudancas: mudancas.slice(0, 400),
};

mkdirSync("reports", { recursive: true });
mkdirSync("public", { recursive: true });
writeFileSync("reports/diff-marcos.json", `${JSON.stringify(relatorio, null, 2)}\n`);
writeFileSync("public/diff-marcos.json", `${JSON.stringify(relatorio, null, 2)}\n`);
writeFileSync(
  "reports/diff-marcos.md",
  [
    `# Diff de snapshots — ${DE || "N/A"} × ${PARA || "N/A"}`,
    "",
    relatorio.disponivel
      ? `${comparadas} URL(s) comparadas · ${mudancas.length} mudança(s) (alta ${relatorio.alta} · média ${relatorio.media} · baixa ${relatorio.baixa}).`
      : relatorio.motivo,
    "",
    ...(mudancas.length
      ? [
          "| URL | Campo | Severidade | Antes | Depois |",
          "| --- | --- | --- | --- | --- |",
          ...mudancas.slice(0, 200).map(
            (m) => `| ${m.path} | ${m.campo} | ${m.severidade} | ${String(m.antes ?? "—").slice(0, 80)} | ${String(m.depois ?? "—").slice(0, 80)} |`,
          ),
        ]
      : ["Nenhuma mudança de identidade de SERP entre os marcos — estabilidade confirmada."]),
  ].join("\n"),
);

console.log(
  relatorio.disponivel
    ? `[diff] ${DE} × ${PARA}: ${comparadas} URL(s) · ${mudancas.length} mudança(s) (alta ${relatorio.alta})`
    : `[diff] ${relatorio.motivo}`,
);

registrarJob({
  job: "diff:marcos",
  marco: PARA || null,
  duracaoMs: Date.now() - inicio,
  status: relatorio.disponivel ? (relatorio.alta ? "aviso" : "ok") : "aviso",
  failClosed: relatorio.disponivel ? relatorio.alta === 0 : null,
  contagens: { urlsComparadas: comparadas, mudancas: mudancas.length, alta: relatorio.alta },
  logs: [
    `${DE || "N/A"} × ${PARA || "N/A"}`,
    ...(relatorio.disponivel ? mudancas.slice(0, 10).map((m) => `[${m.severidade}] ${m.path} · ${m.campo}`) : [relatorio.motivo]),
  ],
});

if (args.includes("--gate") && relatorio.alta > 0) {
  console.error("✖ mudanças de severidade alta entre marcos — revisar antes de seguir.");
  process.exit(1);
}
