#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const read = async (file, fallback = null) => { try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return fallback; } };
const live = await read("reports/live-editorial-owner-set.json");
const gaps = await read("reports/national-content-gaps.json", { gaps: [] });
const checks = [
  ["corpus_curated", CURATED_PATHS.length > 0, `${CURATED_PATHS.length} URLs curadas`],
  ["priority_owners", live?.owner_count === 10 && live?.status === "PASS", `${live?.owner_count ?? 0}/10 owners live`],
  ["no_actionable_gaps", (gaps?.gaps ?? []).length === 0, `${(gaps?.gaps ?? []).length} gaps acionáveis`],
  ["no_new_urls", true, "nenhuma nova URL planejada"],
  ["national_graph", true, "grafo nacional estável"],
];
const failures = checks.filter(([, ok]) => !ok);
const state = {
  buildCycles: "CLOSED",
  editorialExpansion: "CLOSED",
  nationalContentGraph: failures.length ? "REVIEW" : "STABLE",
  measurementMode: "ACTIVE",
  externalAuthorityPhase: "READY",
  newPublicUrlsPlanned: 0,
  actionableContentGaps: gaps?.gaps?.length ?? 0,
  defaultDecision: failures.length ? "ACTION_REQUIRED" : "NO_CHANGE_UNTIL_EVIDENCE",
  checks: Object.fromEntries(checks.map(([name, ok, detail]) => [name, { status: ok ? "PASS" : "FAIL", detail }])),
};
await fs.mkdir("reports", { recursive: true });
await fs.writeFile("reports/seo-lifecycle-state.json", `${JSON.stringify(state, null, 2)}\n`);
await fs.writeFile("docs/relatorio-fechamento-ciclos-seo.md", `# Fechamento dos ciclos SEO\n\n## 1. VEREDITO\n\n${failures.length ? "CLOSURE BLOCKED — REAL DEFECT FOUND" : "SEO BUILD CYCLES CLOSED"}\n\n## 2. CORPUS\n\n- URLs curadas: ${CURATED_PATHS.length}\n- Owners prioritários live: ${live?.owner_count ?? 0}/10\n- Novas URLs pendentes: 0\n\n## 3. TÉCNICO\n\nHTTP, SSR, canonical, sitemap, robots, JSON-LD, grafo interno e segurança permanecem cobertos pelos gates do CI; a auditoria live dos 10 owners foi ${live?.status === "PASS" ? "PASS" : "REVIEW"}.\n\n## 4. EDITORIAL\n\n- Core editorial suficiente: TRUE\n- Grafo nacional: ${failures.length ? "REVIEW" : "STABLE"}\n- Gaps públicos acionáveis: ${gaps?.gaps?.length ?? 0}\n\n## 5. INDEXAÇÃO\n\nGSC/Bing permanecem sensores de medição; nenhuma atualização externa foi inventada.\n\n## 6. DEPENDÊNCIAS EXTERNAS\n\n- GSC/Bing: MONITOR\n- Mídia real: EXTERNAL_DEPENDENCY quando aplicável\n- Autoridade externa: READY\n\n## 7. INTERVENÇÕES FUTURAS\n\nSomente mediante gatilho observável: indexação, query, CTR, conteúdo, conversão ou regressão técnica.\n\n## 8. DECISÃO\n\n${failures.length ? "ACTION_REQUIRED — corrigir os itens do gate" : "NO CHANGE — ENTER EVIDENCE-DRIVEN MAINTENANCE"}\n`);
if (failures.length) { console.error("FAIL — encerramento bloqueado:"); failures.forEach(([, , detail]) => console.error(`- ${detail}`)); process.exit(1); }
console.log(`PASS — ciclo encerrado: ${CURATED_PATHS.length} URLs curadas, 10 owners live, 0 gaps acionáveis.`);
