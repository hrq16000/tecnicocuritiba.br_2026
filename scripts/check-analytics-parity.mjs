#!/usr/bin/env node
/**
 * GATE DE PARIDADE DE ANALYTICS
 *
 * Garante que os mesmos IDs de evento e as mesmas chaves de UTM sejam usados em:
 *   - GA4 (src/lib/funnelAnalytics.ts → track())
 *   - persistência no banco (click_events)
 *   - relatório semanal (scripts/report-weekly-seo.mjs)
 *
 * Sem isso, o relatório de conversão por rota deixa de bater com o GA4.
 */
import { readFileSync } from "node:fs";

const EVENTS = ["wa_click", "call_click"];
const UTMS = ["utm_source", "utm_medium", "utm_campaign"];

const funnel = readFileSync(process.argv[2] || "src/lib/funnelAnalytics.ts", "utf8");
const weekly = readFileSync(process.argv[3] || "scripts/report-weekly-seo.mjs", "utf8");

// Implementação atual usa encaminhamento tipado por trackConversionClick:
// trackWaClick/trackCallClick fornecem nomes literais; dispatcher envia o mesmo
// eventName ao GA4 e a click_events. Não exigir calls literais obsoletas.
const conversionBody = funnel.split("const trackConversionClick")[1]?.split("\n};")[0] ?? "";
const forwardsToGa4 = /track\(\s*eventName\s*,\s*payload\s*\)/.test(conversionBody);
const forwardsToDb = /persistClickEvent\(\s*eventName\s*,\s*location\s*,\s*ctx\s*,/.test(conversionBody);
const typedNames = /eventName:\s*"wa_click"\s*\|\s*"call_click"/.test(conversionBody);


const errors = [];

for (const [ev, kind, exportName] of [
  ["wa_click", "whatsapp", "trackWaClick"],
  ["call_click", "phone", "trackCallClick"],
]) {
  const directGa4 = new RegExp(`track\\s*\\(\\s*["']${ev}["']`).test(funnel);
  const directDb = new RegExp(`persistClickEvent\\s*\\(\\s*["']${ev}["']`).test(funnel);
  // Caller MUST bind the required public export to the typed dispatcher.
  const caller = new RegExp(
    `export\\s+const\\s+${exportName}\\b[\\s\\S]{0,220}?trackConversionClick\\s*\\(\\s*["']${kind}["']\\s*,\\s*["']${ev}["']`,
  ).test(funnel);
  if (!directGa4 && !(typedNames && forwardsToGa4 && caller))
    errors.push(`GA4 não dispara "${ev}" em funnelAnalytics.ts`);
  if (!directDb && !(typedNames && forwardsToDb && caller))
    errors.push(`"${ev}" não é persistido em click_events`);
  if (!weekly.includes(`"${ev}"`))
    errors.push(`relatório semanal não contabiliza "${ev}"`);
}

// UTMs precisam existir tanto no payload do GA4 (baseParams) quanto no insert.
const baseParams = funnel.split("function baseParams")[1]?.split("\n}")[0] ?? "";
const persist = funnel.split("function persistClickEvent")[1]?.split("\n}")[0] ?? "";
for (const key of UTMS) {
  if (!baseParams.includes(key)) errors.push(`${key} ausente no payload GA4 (baseParams)`);
  if (!persist.includes(key)) errors.push(`${key} ausente no insert de click_events`);
  if (!weekly.includes(key)) errors.push(`${key} ausente no relatório semanal`);
}

if (errors.length) {
  console.error("BLOQUEADO — paridade de analytics quebrada:");
  errors.forEach((e) => console.error(`  • ${e}`));
  process.exit(1);
}

console.log(`[analytics-parity] OK — eventos ${EVENTS.join(", ")} e UTMs ${UTMS.join(", ")} alinhados em GA4, click_events e relatório semanal.`);
