#!/usr/bin/env node
/**
 * FILA DE PROVA VISUAL POR BAIRRO.
 *
 * Cada bairro indexável (ou candidato em onda) precisa de fotografia real da
 * operação em seções específicas. Este script cruza o relatório de prova
 * visual (reports/real-images.json) com o mínimo exigido por seção e publica
 * a fila em public/bairro-photo-queue.json, consumida pelo painel interno
 * /admin/fotos-bairros (upload + marcação de seções cobertas).
 *
 * Nenhuma imagem gerada por IA entra na fila: o gate de prova visual só aceita
 * arquivos locais de fotografia com tamanho mínimo e sem reuso excessivo.
 *
 * Uso: node scripts/generate-bairro-photo-queue.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { WAVES } from "./lib/content-waves.mjs";
import { nomeBairro } from "./lib/local-nomes.mjs";

/** Seções que precisam de foto própria em toda página de bairro. */
export const SECOES_OBRIGATORIAS = [
  { id: "contexto-local", titulo: "Contexto do bairro", minimo: 1, exigencia: "Rua, referência ou fachada reconhecível do bairro atendido (foto própria, sem banco de imagem)." },
  { id: "atendimento", titulo: "Atendimento em campo", minimo: 1, exigencia: "Coleta, entrega ou visita técnica realizada no bairro, com equipamento e contexto visíveis." },
  { id: "bancada", titulo: "Bancada", minimo: 1, exigencia: "Equipamento do atendimento em bancada, com instrumentação real visível." },
];

export const MINIMO_TOTAL = SECOES_OBRIGATORIAS.reduce((s, x) => s + x.minimo, 0);

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const realImages = readJson("reports/real-images.json");
const fotosPorPath = new Map((realImages?.pages ?? []).map((p) => [p.path, p]));

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))];
const emOnda = WAVES.flatMap((w) => w.paths.map((p) => ({ path: p, week: w.week })));
const ondaDe = new Map(emOnda.map((x) => [x.path, x.week]));

const alvos = [...new Set([...curated, ...emOnda.map((x) => x.path)])]
  .filter((p) => /^\/bairros\/[^/]+$/.test(p))
  .sort();

const fila = alvos.map((p) => {
  const slug = p.split("/").pop();
  const fotos = fotosPorPath.get(p);
  const provas = fotos?.provas ?? [];
  // Heurística de cobertura: o gate valida arquivos, aqui distribuímos as
  // provas conhecidas pelas seções na ordem declarada — o que sobra fica
  // pendente e precisa de upload no painel.
  let restante = provas.length;
  const secoes = SECOES_OBRIGATORIAS.map((s) => {
    const cobertas = Math.min(s.minimo, Math.max(restante, 0));
    restante -= cobertas;
    return { ...s, cobertas, ok: cobertas >= s.minimo };
  });
  const faltando = secoes.filter((s) => !s.ok);
  return {
    path: p,
    slug,
    nome: nomeBairro(slug),
    noSitemap: curated.includes(p),
    onda: ondaDe.get(p) ?? null,
    fotosValidas: provas.length,
    minimoTotal: MINIMO_TOTAL,
    secoes,
    problemasGate: fotos?.problems ?? [],
    status: !fotos ? "sem-avaliacao" : faltando.length ? "pendente" : "completo",
    liberavel: Boolean(fotos) && faltando.length === 0 && (fotos.problems?.length ?? 0) === 0,
  };
});

mkdirSync("public", { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  regras: { MINIMO_TOTAL, secoes: SECOES_OBRIGATORIAS },
  totals: {
    bairros: fila.length,
    completos: fila.filter((f) => f.status === "completo").length,
    pendentes: fila.filter((f) => f.status === "pendente").length,
    semAvaliacao: fila.filter((f) => f.status === "sem-avaliacao").length,
  },
  fila,
};
writeFileSync("public/bairro-photo-queue.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(
  `fila de prova visual: ${payload.totals.completos}/${payload.totals.bairros} bairros completos ` +
    `(${payload.totals.pendentes} pendentes) → public/bairro-photo-queue.json`,
);
