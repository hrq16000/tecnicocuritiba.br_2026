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
import { checkConversionRoutes } from "./analytics-conversion-routes.mjs";

const EVENTS = ["wa_click", "call_click"];
const UTMS = ["utm_source", "utm_medium", "utm_campaign"];

const funnel = readFileSync("src/lib/funnelAnalytics.ts", "utf8");
const weekly = readFileSync("scripts/report-weekly-seo.mjs", "utf8");

const errors = checkConversionRoutes(funnel);
for (const ev of EVENTS) {
  if (!weekly.includes(`"${ev}"`)) errors.push(`relatório semanal não contabiliza "${ev}"`);
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
