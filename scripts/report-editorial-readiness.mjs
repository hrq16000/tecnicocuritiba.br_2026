#!/usr/bin/env node
/**
 * Consolida a prontidão editorial dos owners sem alterar rotas públicas.
 * A classificação é heurística e serve apenas para priorização em staging.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const inventoryPath = path.join(root, "reports", "editorial-master-inventory.json");
const inventory = JSON.parse(await fs.readFile(inventoryPath, "utf8"));
const items = inventory.inventory ?? [];
const byOwner = new Map();
for (const item of items) {
  const owner = item.target_owner ?? "UNMAPPED";
  const list = byOwner.get(owner) ?? [];
  list.push(item);
  byOwner.set(owner, list);
}

const owners = [...byOwner.entries()].map(([owner, list]) => {
  const avg = (key) => Math.round((list.reduce((sum, item) => sum + Number(item[key] ?? 0), 0) / list.length) * 10) / 10;
  const readiness = Math.round((avg("information_gain") * 20 + avg("diagnostic_gain") * 15 + avg("decision_gain") * 15 + avg("safety_gain") * 10 + avg("uniqueness") * 10) / 3.5);
  return {
    owner,
    primary_intents: [...new Set(list.map((item) => item.primary_intent).filter(Boolean))],
    clusters: [...new Set(list.map((item) => item.cluster).filter(Boolean))],
    questions_answered: list.length,
    related_drafts: list.map((item) => item.id),
    information_gain: avg("information_gain"),
    diagnostic_gain: avg("diagnostic_gain"),
    decision_gain: avg("decision_gain"),
    safety_gain: avg("safety_gain"),
    duplication_risk: list.some((item) => item.duplication_risk === "alto") ? "alto" : list.some((item) => item.duplication_risk === "médio") ? "médio" : "baixo",
    first_page_readiness: Math.min(100, readiness),
    readiness: readiness >= 80 ? "PROMOTION_CANDIDATE" : readiness >= 60 ? "REVIEW" : "KEEP_STAGING",
  };
}).sort((a, b) => b.first_page_readiness - a.first_page_readiness || a.owner.localeCompare(b.owner));

const pillars = ["DIAGNÓSTICO", "NOTEBOOK", "COMPUTADOR", "WINDOWS", "ARMAZENAMENTO", "DADOS", "RAM", "SSD", "REDES", "WI-FI", "MALWARE", "BACKUP", "MANUTENÇÃO", "UPGRADES", "B2B"];
const text = items.map((item) => `${item.id} ${item.title ?? ""} ${item.cluster ?? ""} ${item.primary_intent ?? ""}`).join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
const topical = pillars.map((pillar) => {
  const normalizedPillar = pillar.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const count = (text.match(new RegExp(normalizedPillar.replace("-", "[- ]"), "g")) ?? []).length;
  return { pillar, evidence_count: count, status: count >= 4 ? "STRONG" : count >= 2 ? "ADEQUATE" : count === 1 ? "WEAK" : "MISSING" };
});

const out = path.join(root, "reports");
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, "content-owner-authority-map.json"), `${JSON.stringify({ status: "staging_only", methodology: "média dos sinais editoriais existentes; não é previsão de ranking", owners }, null, 2)}\n`);
await fs.writeFile(path.join(out, "topical-completeness.json"), `${JSON.stringify({ status: "staging_only", methodology: "contagem de evidências no inventário editorial; revisar antes de promoção", pillars: topical }, null, 2)}\n`);
const top = owners.slice(0, 10).map((item, index) => `${index + 1}. ${item.owner} — readiness ${item.first_page_readiness}/100; ganho informacional ${item.information_gain}/5; drafts ${item.related_drafts.length}`).join("\n");
const md = `# Prontidão de enriquecimento editorial\n\nStatus: **STAGING_ONLY**\n\nA análise consolida ${items.length} drafts existentes em ${owners.length} owners. O score é uma ferramenta interna de priorização, não previsão de ranking.\n\n## Top owners por first-page readiness\n\n${top}\n\n## Completude temática\n\n| Pilar | Evidências | Classificação |\n| --- | ---: | --- |\n${topical.map((item) => `| ${item.pillar} | ${item.evidence_count} | ${item.status} |`).join("\n")}\n\n## Próxima decisão\n\nPromover somente após D14, autorização formal, revisão humana e gates técnicos; nenhuma rota pública foi alterada por este relatório.\n`;
await fs.writeFile(path.join(root, "docs", "relatorio-enriquecimento-google-readiness.md"), md);
console.log(`PASS — ${items.length} drafts consolidados em ${owners.length} owners; relatórios staging-only gerados.`);
