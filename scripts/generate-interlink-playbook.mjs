#!/usr/bin/env node
/**
 * ============================================================================
 * PLAYBOOK DE INTERLINKING LOCAL (Fase de Operação)
 * ============================================================================
 * Páginas locais (bairro, cidade e serviço×bairro remanescente) só deixam de
 * parecer doorway quando estão contextualizadas: precisam apontar, com âncora
 * natural, para o hub do assunto e para a página de intenção mais forte —
 * aquela que realmente resolve a consulta comercial.
 *
 * Este script lê o HTML servido, mede os links de saída reais de cada página
 * local e emite um PLAYBOOK acionável: para cada página, quais destinos faltam
 * e com qual âncora natural inserir (nunca "clique aqui", nunca âncora exata
 * repetida em massa).
 *
 * Também detecta o inverso: âncora idêntica usada em muitas páginas (padrão
 * de rodapé automatizado), que não conta como contextualização.
 *
 * Uso: node scripts/generate-interlink-playbook.mjs [dist] [--gate]
 * Saída: reports/interlink-playbook.json + .md
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";
import { clusterOf } from "./lib/indexation-tiers.mjs";
import { CONSOLIDATED_LOCAL_PATHS } from "./lib/consolidated-local-urls.mjs";

const args = process.argv.slice(2);
const DIST = args.find((a) => !a.startsWith("--")) ?? "dist";
const GATE = args.includes("--gate");

/** Mínimo de links contextuais de saída para hub + intenção forte. */
const MIN_HUBS = 1;
const MIN_INTENCAO = 2;

const HUBS = new Set([
  "/servicos",
  "/problemas",
  "/areas-atendidas",
  "/empresa-de-ti-curitiba",
  "/blog",
]);

/** Páginas de intenção forte (destinos comerciais que absorvem a consulta). */
const INTENCAO = new Set([
  "/servicos/manutencao-de-computador",
  "/servicos/manutencao-de-notebook",
  "/servicos/formatacao",
  "/servicos/recuperacao-de-dados",
  "/servicos/remocao-de-virus",
  "/servicos/upgrade-ssd-memoria",
  "/servicos/redes-e-wifi",
  "/servicos/suporte-tecnico-empresarial",
  "/tecnico-informatica-curitiba",
  "/assistencia-tecnica-curitiba",
  "/precos-e-politicas",
  "/como-funciona",
]);

/**
 * Âncoras naturais sugeridas por destino. São frases que descrevem o destino
 * no contexto da frase — não a keyword exata isolada.
 */
const ANCORAS = {
  "/servicos": ["ver todos os serviços de informática", "lista completa de serviços"],
  "/problemas": ["sintomas mais comuns que atendemos", "problemas frequentes e o que fazer"],
  "/areas-atendidas": ["regiões atendidas com coleta e entrega", "onde atendemos em Curitiba e região"],
  "/servicos/manutencao-de-computador": [
    "manutenção de computador com diagnóstico antes do orçamento",
    "como funciona a manutenção de desktop",
  ],
  "/servicos/manutencao-de-notebook": [
    "manutenção de notebook com coleta no endereço",
    "o que verificamos em um notebook",
  ],
  "/servicos/formatacao": [
    "formatação com backup conferido antes",
    "como fazemos a formatação sem perder arquivos",
  ],
  "/servicos/recuperacao-de-dados": [
    "recuperação de dados: o que é possível e o que não é",
    "primeiros passos quando os arquivos somem",
  ],
  "/servicos/remocao-de-virus": ["remoção de vírus e limpeza do sistema", "quando o problema é infecção"],
  "/servicos/upgrade-ssd-memoria": ["upgrade de SSD e memória", "quando o upgrade resolve a lentidão"],
  "/servicos/redes-e-wifi": ["ajuste de rede e Wi-Fi", "quando o problema está na rede, não no computador"],
  "/servicos/suporte-tecnico-empresarial": ["suporte técnico para empresas", "atendimento para pequenos negócios"],
  "/tecnico-informatica-curitiba": ["técnico de informática em Curitiba", "atendimento técnico em Curitiba"],
  "/assistencia-tecnica-curitiba": ["assistência técnica em Curitiba", "como funciona o atendimento na cidade"],
  "/precos-e-politicas": ["preços e política de atendimento", "como o valor é definido"],
  "/como-funciona": ["como funciona a coleta e a entrega", "passo a passo do atendimento"],
  "/empresa-de-ti-curitiba": ["empresa de TI em Curitiba", "suporte contínuo para empresas"],
  "/blog": ["conteúdos técnicos publicados", "artigos com procedimento detalhado"],
};

function htmlDe(path) {
  const base = DIST.endsWith("client") ? DIST : join(DIST, "client");
  const cands = [
    join(base, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
    join(DIST, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
  ];
  const f = cands.find((c) => existsSync(c));
  return f ? readFileSync(f, "utf8") : null;
}

/** Extrai links internos com a âncora textual. Ignora nav/footer. */
function linksDe(html) {
  const corpo = html
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "");
  const out = [];
  for (const m of corpo.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1].replace(/\/$/, "") || "/";
    const anchor = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (anchor) out.push({ href, anchor });
  }
  return out;
}

const paginasLocais = CURATED_PATHS.filter((p) =>
  ["BAIRRO", "CIDADE", "SERVICO_BAIRRO"].includes(clusterOf(p)),
);

const itens = [];
const ancoraUso = new Map();
const faltantes = [];

for (const path of paginasLocais) {
  const html = htmlDe(path);
  if (!html) {
    itens.push({ path, cluster: clusterOf(path), erro: "HTML não encontrado" });
    continue;
  }
  const links = linksDe(html);
  const hrefs = new Set(links.map((l) => l.href));
  const hubs = [...hrefs].filter((h) => HUBS.has(h));
  const intencao = [...hrefs].filter((h) => INTENCAO.has(h));
  const paraConsolidada = [...hrefs].filter((h) => CONSOLIDATED_LOCAL_PATHS.has(h));

  for (const l of links) {
    const chave = `${l.anchor.toLowerCase()} → ${l.href}`;
    if (!ancoraUso.has(chave)) ancoraUso.set(chave, []);
    ancoraUso.get(chave).push(path);
  }

  const recomendacoes = [];
  if (hubs.length < MIN_HUBS) {
    const alvo = clusterOf(path) === "SERVICO_BAIRRO" ? "/servicos" : "/areas-atendidas";
    recomendacoes.push({
      destino: alvo,
      motivo: "página local sem link para o hub do assunto",
      ancorasSugeridas: ANCORAS[alvo],
    });
  }
  if (intencao.length < MIN_INTENCAO) {
    const candidatos = [...INTENCAO].filter((d) => !hrefs.has(d)).slice(0, 3);
    for (const destino of candidatos.slice(0, MIN_INTENCAO - intencao.length)) {
      recomendacoes.push({
        destino,
        motivo: "poucos links para páginas de intenção comercial forte",
        ancorasSugeridas: ANCORAS[destino] ?? [],
      });
    }
  }
  for (const alvo of paraConsolidada) {
    recomendacoes.push({
      destino: alvo,
      motivo: "link interno aponta para URL CONSOLIDADA (301) — trocar pelo destino final",
      ancorasSugeridas: [],
      bloqueante: true,
    });
  }

  if (recomendacoes.length) faltantes.push(path);
  itens.push({
    path,
    cluster: clusterOf(path),
    linksInternos: links.length,
    hubs,
    intencao,
    recomendacoes,
  });
}

/** Âncora idêntica em muitas páginas = padrão automatizado, não contexto. */
const ancorasSaturadas = [...ancoraUso]
  .filter(([, paths]) => paths.length >= Math.max(8, Math.ceil(paginasLocais.length * 0.5)))
  .map(([chave, paths]) => ({ chave, ocorrencias: paths.length }))
  .sort((a, b) => b.ocorrencias - a.ocorrencias)
  .slice(0, 20);

const bloqueantes = itens.flatMap((i) => (i.recomendacoes ?? []).filter((r) => r.bloqueante));

const out = {
  geradoEm: new Date().toISOString(),
  fonte: DIST,
  paginasLocais: paginasLocais.length,
  paginasComRecomendacao: faltantes.length,
  linksParaConsolidadas: bloqueantes.length,
  ancorasSaturadas,
  itens,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/interlink-playbook.json", `${JSON.stringify(out, null, 2)}\n`);
writeFileSync(
  "reports/interlink-playbook.md",
  [
    "# Playbook de interlinking local",
    "",
    `Gerado em ${out.geradoEm} · fonte \`${DIST}\` · ${out.paginasLocais} páginas locais.`,
    "",
    `- Páginas com recomendação aberta: **${out.paginasComRecomendacao}**`,
    `- Links internos apontando para URL consolidada: **${out.linksParaConsolidadas}**`,
    `- Âncoras saturadas (padrão automatizado): **${ancorasSaturadas.length}**`,
    "",
    "## Ações por página",
    "",
    ...itens
      .filter((i) => (i.recomendacoes ?? []).length)
      .flatMap((i) => [
        `### ${i.path} (${i.cluster})`,
        `Links internos no corpo: ${i.linksInternos} · hubs: ${i.hubs.join(", ") || "nenhum"} · intenção: ${i.intencao.join(", ") || "nenhum"}`,
        "",
        ...i.recomendacoes.map(
          (r) =>
            `- ${r.bloqueante ? "**[BLOQUEANTE]** " : ""}Linkar \`${r.destino}\` — ${r.motivo}` +
            (r.ancorasSugeridas?.length
              ? `\n  - Âncoras naturais: ${r.ancorasSugeridas.map((a) => `“${a}”`).join(" · ")}`
              : ""),
        ),
        "",
      ]),
    ancorasSaturadas.length
      ? ["## Âncoras saturadas (revisar)", "", ...ancorasSaturadas.map((a) => `- ${a.chave} — ${a.ocorrencias} páginas`), ""].join("\n")
      : "",
  ].join("\n"),
);

console.log(
  `[playbook] ${out.paginasLocais} páginas locais · ${out.paginasComRecomendacao} com ação · ${out.linksParaConsolidadas} link(s) para consolidadas → reports/interlink-playbook.md`,
);

if (GATE && bloqueantes.length) {
  console.error(`✖ ${bloqueantes.length} link(s) interno(s) para URL consolidada.`);
  process.exit(1);
}
