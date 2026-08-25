#!/usr/bin/env node
/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — relatório operacional.
 *
 * Lê o mapeamento oficial (src/lib/bairrosBaseline.ts) e o gate de indexação
 * (src/lib/bairroPhotos.ts) e gera reports/fila-enriquecimento-bairros.md com:
 *   - cobertura por região (bairro × rota × seoDepth × enrichmentStatus)
 *   - lista priorizada do que precisa de conteúdo autoral + prova visual
 *
 * Fail-closed: se algum bairro mapeado não tiver arquivo de rota, sai com erro.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const baseline = readFileSync(join(ROOT, "src/lib/bairrosBaseline.ts"), "utf8");
const photos = readFileSync(join(ROOT, "src/lib/bairroPhotos.ts"), "utf8");

const comFoto = new Set(
  [...photos.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\[/gm)].map((m) => m[1]),
);
const aprovados = new Set(
  [
    ...(photos.split("BAIRROS_SEM_FOTO_APROVADOS")[1] ?? "").matchAll(/"([a-z0-9-]+)"/g),
  ].map((m) => m[1]),
);
const indexavel = (slug) => comFoto.has(slug) || aprovados.has(slug);

// Regiões e itens declarados no mapeamento oficial.
const regioes = [];
const reBloco = /id:\s*"([a-z-]+)",\s*\n\s*titulo:\s*"([^"]+)",\s*\n\s*itens:\s*\[([\s\S]*?)\n\s*\],/g;
for (const m of baseline.matchAll(reBloco)) {
  const itens = [];
  for (const b of m[3].matchAll(/bairro\("([^"]+)",\s*"([a-z0-9-]+)"\)/g)) {
    itens.push({ nome: b[1], slug: b[2], to: `/bairros/${b[2]}` });
  }
  for (const c of m[3].matchAll(/nome:\s*"([^"]+)",\s*to:\s*"([^"]+)"/g)) {
    itens.push({ nome: c[1], slug: null, to: c[2] });
  }
  regioes.push({ id: m[1], titulo: m[2], itens });
}

const faltando = [];
for (const r of regioes) {
  for (const i of r.itens) {
    if (!i.slug) continue;
    if (!existsSync(join(ROOT, `src/routes/bairros.${i.slug}.tsx`))) faltando.push(i.slug);
  }
}

const total = regioes.flatMap((r) => r.itens.filter((i) => i.slug));
const pendentes = total.filter((i) => !indexavel(i.slug));

const linhas = [
  "# Fila de Enriquecimento Agressivo — páginas de bairro",
  "",
  `Gerado em ${new Date().toISOString()} por \`npm run report:fila-bairros\`.`,
  "",
  `- Bairros mapeados: **${total.length}**`,
  `- Indexáveis (curated): **${total.length - pendentes.length}**`,
  `- Baseline / noindex na fila: **${pendentes.length}**`,
  "",
  "> Regra: nenhuma página baseline é promovida a indexável sem (1) conteúdo",
  "> autoral aprovado no gate de originalidade e (2) prova visual real do",
  "> atendimento. Enquanto isso ela existe, navega e linka — mas fica `noindex`",
  "> e fora do sitemap.",
  "",
];

for (const r of regioes) {
  linhas.push(`## ${r.titulo}`, "", "| Local | Rota | seoDepth | enrichmentStatus |", "| --- | --- | --- | --- |");
  for (const i of r.itens) {
    const depth = i.slug ? (indexavel(i.slug) ? "curated" : "baseline") : "cidade";
    const status = depth === "curated" || depth === "cidade" ? "done" : "pending";
    linhas.push(`| ${i.nome} | \`${i.to}\` | ${depth} | ${status} |`);
  }
  linhas.push("");
}

linhas.push("## Backlog priorizado (pending)", "");
for (const p of pendentes) linhas.push(`- [ ] ${p.nome} — \`${p.to}\``);
linhas.push("");

mkdirSync(join(ROOT, "reports"), { recursive: true });
writeFileSync(join(ROOT, "reports/fila-enriquecimento-bairros.md"), linhas.join("\n"));

if (faltando.length) {
  console.error(`FAIL — bairros mapeados sem arquivo de rota: ${faltando.join(", ")}`);
  process.exit(1);
}
console.log(
  `OK — ${total.length} bairros mapeados | ${pendentes.length} na fila de enriquecimento`,
);
