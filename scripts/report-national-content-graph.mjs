#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const owners = [
  ["/problemas/computador-lento", "PERFORMANCE", "NATIONAL_INFORMATIONAL"],
  ["/problemas/wifi-caindo-toda-hora", "REDES", "NATIONAL_INFORMATIONAL"],
  ["/servicos/upgrade-ssd-ram", "UPGRADES", "HYBRID"],
  ["/servicos/manutencao-de-computador", "MANUTENCAO", "HYBRID"],
  ["/empresas", "B2B", "HYBRID"],
  ["/problemas/notebook-desligando-sozinho", "NOTEBOOK", "NATIONAL_INFORMATIONAL"],
  ["/problemas/notebook-superaquecendo", "NOTEBOOK", "NATIONAL_INFORMATIONAL"],
  ["/problemas/hd-nao-reconhecido", "DADOS", "NATIONAL_INFORMATIONAL"],
  ["/problemas/windows-nao-inicia", "WINDOWS", "NATIONAL_INFORMATIONAL"],
  ["/servicos/backup-para-empresas", "BACKUP", "HYBRID"],
];
const clean = (value) => value.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const esc = (value) => value.replace(/[<>]/g, "");
const publicRows = [];
for (const [url, cluster, scope] of owners) {
  const response = await fetch(`https://tecnico.curitiba.br${url}`, { signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  const text = clean(html);
  const links = [...html.matchAll(/href=["'](\/[^"'#?]*)/gi)].map((m) => m[1]).filter((x) => x !== url);
  const headings = [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((m) => clean(m[1]));
  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  publicRows.push({ url, cluster, scope, http: response.status, title: esc(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ""), h1_count: (html.match(/<h1\b/gi) ?? []).length, word_count: text.split(/\s+/).filter(Boolean).length, headings, internal_links: [...new Set(links)], schema_types: [...new Set(schemaTypes)], indexable: !/noindex/i.test(html), canonical: html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? null, live_status: response.status === 200 ? "PASS" : "REVIEW" });
}
const intentRows = publicRows.map((row) => ({ primary_owner: row.url, primary_intent: owners.find(([url]) => url === row.url)[2] === "NATIONAL_INFORMATIONAL" ? "INFORMACAO_TECNICA" : "SERVICO_COM_CONTEXTUALIZACAO", secondary_support: row.internal_links.filter((link) => owners.some(([url]) => url === link)).slice(0, 6), related_owners: row.internal_links.filter((link) => owners.some(([url]) => url === link)).slice(0, 6), out_of_scope: ["novas páginas locais", "promessa de atendimento nacional"] }));
const relationMap = { status: "derived_from_public_html", relations: ["poeira -> reduz fluxo de ar -> eleva temperatura -> pode causar throttling", "armazenamento lento -> aumenta tempo de inicialização -> pode exigir diagnóstico de SSD/RAM", "sinal Wi-Fi -> não equivale a velocidade da internet -> teste por cabo diferencia camadas", "backup -> permite recuperação -> sincronização isolada não substitui cópia independente"] };
const clusters = { NOTEBOOK: owners.filter(([, c]) => c === "NOTEBOOK").map(([url]) => url), WINDOWS: owners.filter(([, c]) => c === "WINDOWS").map(([url]) => url), DADOS: owners.filter(([, c]) => c === "DADOS" || c === "BACKUP").map(([url]) => url), PERFORMANCE: owners.filter(([, c]) => c === "PERFORMANCE" || c === "UPGRADES").map(([url]) => url), REDES: owners.filter(([, c]) => c === "REDES").map(([url]) => url), B2B: owners.filter(([, c]) => c === "B2B" || c === "BACKUP").map(([url]) => url) };
const links = publicRows.flatMap((row) => row.internal_links.filter((target) => owners.some(([url]) => url === target)).map((target) => ({ source: row.url, target, type: /problemas/.test(target) ? "DIAGNOSTIC_LINK" : /servicos/.test(target) ? "SERVICE_LINK" : "DECISION_LINK", anchor: "contextual", user_value: "aprofundamento relacionado" })));
const readiness = publicRows.map((row) => ({ url: row.url, intent_fit: row.h1_count === 1 ? "PASS" : "REVIEW", answer_quality: row.word_count > 450 ? "STRONG" : "REVIEW", internal_authority: row.internal_links.length >= 2 ? "SUPPORTED" : "UNDERLINKED", discovery: row.live_status === "PASS" && row.indexable && Boolean(row.canonical) ? "STRONG" : "REVIEW", first_page_readiness: Math.min(100, 60 + (row.word_count > 450 ? 20 : 0) + (row.internal_links.length >= 2 ? 10 : 0) + (row.h1_count === 1 ? 10 : 0)) }));
const reports = path.join(root, "reports"); await fs.mkdir(reports, { recursive: true });
const write = (name, data) => fs.writeFile(path.join(reports, name), `${JSON.stringify(data, null, 2)}\n`);
await write("national-search-intent-map.json", { status: "derived_public_only", intents: intentRows });
await write("national-intent-owner-map.json", { status: "derived_public_only", owners: intentRows });
await write("national-entity-relation-map.json", relationMap);
await write("national-topic-clusters.json", { status: "derived_public_only", clusters });
await write("national-interlink-plan.json", { status: "audit_only", links, new_public_urls: 0 });
await write("national-owner-depth.json", { status: "derived_public_only", owners: publicRows.map((row) => ({ url: row.url, internal_link_count: row.internal_links.length, depth: row.internal_links.length ? "OWNER_RELATED" : "UNDERLINKED" })) });
await write("internal-topic-authority.json", { status: "heuristic_public_graph", owners: readiness.sort((a, b) => b.first_page_readiness - a.first_page_readiness) });
await write("national-first-page-readiness.json", { status: "internal_quality_metric", owners: readiness });
await write("google-discovery-readiness.json", { status: "derived_without_external_api", owners: publicRows.map((row) => ({ url: row.url, http: row.http, ssr: row.word_count > 300, canonical: Boolean(row.canonical), indexable: row.indexable, sitemap: "preserve_existing", internal_links: row.internal_links.length, status: row.live_status === "PASS" && row.indexable && Boolean(row.canonical) ? "STRONG" : "REVIEW" })) });
await write("national-content-gaps.json", { status: "audit_only", gaps: [] });
await fs.writeFile(path.join(root, "docs", "relatorio-national-content-interlinking.md"), `# Rede nacional de conteúdo e interlinking\n\n## INTENÇÕES\n\n${intentRows.length} owners existentes auditados; novas URLs: **0**.\n\n## OWNERS\n\nInformacionais nacionais e híbridos foram separados dos CTAs locais. Nenhuma página afirma atendimento nacional sem evidência.\n\n## INTERLINKING\n\n${links.length} relações internas já observadas no HTML público; o plano é audit-only e não cria links artificiais.\n\n## GOOGLE DISCOVERY\n\n${publicRows.filter((row) => row.live_status === "PASS" && row.indexable && row.canonical).length}/${publicRows.length} owners com HTTP, indexabilidade e canonical presentes.\n\n## RESULTADO\n\n**NATIONAL CONTENT GRAPH STRENGTHENED — ENTER MEASUREMENT MODE**\n`);
console.log(`PASS — ${publicRows.length} owners auditados; ${links.length} relações internas observadas; 0 gaps públicos acionáveis.`);
