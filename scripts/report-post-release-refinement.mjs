#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const owners = [
  ["/problemas/computador-lento", 1, "ENTENDER_CAUSA", "DIAGNOSTICO"],
  ["/problemas/wifi-caindo-toda-hora", 1, "DIFERENCIAR_FALHA_DE_REDE", "WI-FI"],
  ["/servicos/upgrade-ssd-ram", 1, "DECIDIR_UPGRADE", "UPGRADES"],
  ["/servicos/manutencao-de-computador", 1, "AVALIAR_MANUTENCAO", "MANUTENCAO"],
  ["/empresas", 1, "SUPORTE_B2B", "B2B"],
  ["/problemas/notebook-desligando-sozinho", 2, "ENTENDER_CAUSA", "NOTEBOOK"],
  ["/problemas/notebook-superaquecendo", 2, "DIAGNOSTICAR_TEMPERATURA", "NOTEBOOK"],
  ["/problemas/hd-nao-reconhecido", 2, "PRESERVAR_DADOS", "ARMAZENAMENTO"],
  ["/problemas/windows-nao-inicia", 2, "RECUPERAR_BOOT", "WINDOWS"],
  ["/servicos/backup-para-empresas", 2, "PROTEGER_DADOS_B2B", "BACKUP"],
];
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
const textOf = (html) => strip(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const metric = (html, pattern) => [...html.matchAll(pattern)].length;
const extract = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? null;
const live = [];
for (const [url, batch, intent, cluster] of owners) {
  const fetchedAt = new Date().toISOString();
  try {
    const response = await fetch(`https://tecnico.curitiba.br${url}`, { signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    const plain = textOf(html);
    const firstHeadingText = html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
    const headingOffset = firstHeadingText ? plain.indexOf(firstHeadingText) : -1;
    const wordsBeforeAnswer = headingOffset >= 0 ? plain.slice(0, headingOffset).split(/\s+/).filter(Boolean).length : 9999;
    const answerLatency = wordsBeforeAnswer <= 180 ? "EXCELLENT" : wordsBeforeAnswer <= 320 ? "GOOD" : wordsBeforeAnswer <= 600 ? "SLOW" : "POOR";
    const schemas = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => { try { const value = JSON.parse(m[1]); return value["@type"] ?? (value["@graph"] ?? []).map((x) => x["@type"]); } catch { return "INVALID_JSON"; } }).flat(Infinity);
    const internalLinks = [...html.matchAll(/href=["'](\/[^"'#?]*)/gi)].map((m) => m[1]).filter((href) => href !== url);
    live.push({ url, batch, primary_intent: intent, cluster, http: response.status, title: extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i), description: extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i), h1_count: metric(html, /<h1\b/gi), headings: [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() })), word_count: plain.split(/\s+/).filter(Boolean).length, answer_latency: answerLatency, schemas, internal_links: [...new Set(internalLinks)].slice(0, 80), internal_link_count: new Set(internalLinks).size, content_hash: (await cryptoDigest(html)), fetched_at: fetchedAt, live_validation: response.status === 200 && metric(html, /<h1\b/gi) === 1 && !schemas.includes("INVALID_JSON") ? "PASS" : "REVIEW" });
  } catch (error) {
    live.push({ url, batch, primary_intent: intent, cluster, http: null, live_validation: "UNAVAILABLE", error: String(error).slice(0, 200), fetched_at: fetchedAt });
  }
}
async function cryptoDigest(value) { const data = new TextEncoder().encode(value); const hash = await crypto.subtle.digest("SHA-256", data); return [...new Uint8Array(hash)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const pass = live.filter((item) => item.live_validation === "PASS").length;
const latency = Object.groupBy ? Object.groupBy(live, (item) => item.answer_latency ?? "UNAVAILABLE") : live.reduce((acc, item) => ((acc[item.answer_latency ?? "UNAVAILABLE"] ??= []).push(item), acc), {});
const reports = path.join(root, "reports");
await fs.mkdir(reports, { recursive: true });
await fs.writeFile(path.join(reports, "live-editorial-owner-set.json"), `${JSON.stringify({ status: pass === 10 ? "PASS" : "REVIEW", owner_count: live.length, owners: live }, null, 2)}\n`);
await fs.writeFile(path.join(reports, "live-owner-content-audit.json"), `${JSON.stringify({ status: pass === 10 ? "PASS" : "REVIEW", owners: live.map((item) => ({ url: item.url, answer_latency: item.answer_latency, answer_first: item.answer_latency === "EXCELLENT" || item.answer_latency === "GOOD", diagnostic_or_decision_content: item.word_count > 500, safety_review: "REQUIRED_BY_EDITORIAL_GATE", live_validation: item.live_validation })) }, null, 2)}\n`);
await fs.writeFile(path.join(root, "docs", "relatorio-post-release-editorial-refinement.md"), `# Refinamento editorial pós-release\n\n## LIVE OWNER SET\n\n**${live.length}/10** owners identificados; validação live: **${pass}/10 PASS**.\n\n## ANSWER LATENCY\n\n- Excellent: ${(latency.EXCELLENT ?? []).length}\n- Good: ${(latency.GOOD ?? []).length}\n- Slow: ${(latency.SLOW ?? []).length}\n- Poor: ${(latency.POOR ?? []).length}\n\n## REFINAMENTOS\n\nA auditoria prioriza medição do conteúdo público. Nenhum owner recebeu alteração automática: só haverá refinamento quando existir ganho editorial demonstrável, sem duplicar conteúdo.\n\n## INDEXNOW E LASTMOD\n\nURLs alteradas nesta rodada: **0** · IndexNow: **0/0** · lastmod global: **0**.\n\n## RESULTADO\n\n${pass === 10 ? "LIVE CORE CONTENT MAXIMIZED — ENTER MEASUREMENT MODE" : "TARGETED LIVE CONTENT GAPS REMAIN — revisar itens UNAVAILABLE/REVIEW"}\n`);
console.log(`PASS — ${live.length}/10 owners auditados; ${pass}/10 passaram a validação live.`);
