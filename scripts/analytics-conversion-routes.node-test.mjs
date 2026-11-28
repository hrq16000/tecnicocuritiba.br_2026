import test from "node:test";
import assert from "node:assert/strict";
import { checkConversionRoutes } from "./analytics-conversion-routes.mjs";

const shared = `
const trackConversionClick = (kind: string, eventName: string, location: string) => {
  track(eventName, {});
  persistClickEvent(eventName, location, {}, {});
};
export const trackWaClick = (location: string) => trackConversionClick("whatsapp", "wa_click", location);
export const trackCallClick = (location: string) => trackConversionClick("phone", "call_click", location);
`;
test("passes shared conversion helper only when both destinations use the supplied event", () => {
  assert.deepEqual(checkConversionRoutes(shared), []);
});
test("does not count commented-out calls or unrelated functions as persistence", () => {
  const bad = shared.replace("persistClickEvent(eventName, location, {}, {});", "// persistClickEvent(eventName, location, {}, {});") + "\nfunction unrelated() { persistClickEvent('wa_click'); persistClickEvent('call_click'); }";
  assert.equal(checkConversionRoutes(bad).filter(x => x.includes("persistido")).length, 2);
});
test("fails incorrect event mapping for either channel", () => {
  const bad = shared.replace('"phone", "call_click"', '"phone", "wa_click"');
  assert.equal(checkConversionRoutes(bad).filter(x => x.includes("call_click")).length, 2);
});
test("passes the legacy direct-call form when both sinks use the correct event", () => {
  const direct = `
  export function trackWaClick() { track("wa_click"); persistClickEvent("wa_click"); }
  export function trackCallClick() { track("call_click"); persistClickEvent("call_click"); }
  `;
  assert.deepEqual(checkConversionRoutes(direct), []);
});
