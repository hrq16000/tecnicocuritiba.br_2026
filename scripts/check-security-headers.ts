/**
 * CI guard: fails the build if any required security header disappears
 * from public/_headers. Pair with .github/workflows/security.yml.
 *
 * Prompt 12: the CSP is intentionally REPORT-ONLY this round. This gate
 * therefore:
 *   - requires the always-on headers (HSTS, nosniff, Referrer, framing, etc.);
 *   - accepts CSP delivered via `Content-Security-Policy-Report-Only`;
 *   - FAILS if an enforcing `Content-Security-Policy` reappears (out of scope);
 *   - rejects dangerous CSP tokens (wildcards, http:, unsafe-eval).
 */
import { readFileSync } from "node:fs";
import { CSP_DIRECTIVES, SECURITY_HEADERS } from "./lib/security-headers.mjs";

const REQUIRED = [
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
] as const;

const file = readFileSync("public/_headers", "utf8");

// Antidrift: public/_headers deve refletir exatamente a fonte única
// scripts/lib/security-headers.mjs (nenhuma política paralela por camada).
const drift = Object.entries(SECURITY_HEADERS as Record<string, string>).filter(
  ([nome, valor]) => !file.includes(`  ${nome}: ${valor}\n`),
);
if (drift.length > 0) {
  console.error(
    `[security] public/_headers divergiu da fonte única (scripts/lib/security-headers.mjs): ` +
      `${drift.map(([n]) => n).join(", ")}. Regenere o bloco /* a partir do módulo.`,
  );
  process.exit(1);
}


// Antidrift 2: src/lib/securityHeaders.ts (política aplicada por src/server.ts)
// precisa espelhar a CSP e o Permissions-Policy da fonte única.
const serverPolicy = readFileSync("src/lib/securityHeaders.ts", "utf8");
const serverDrift: string[] = [];
const compacto = serverPolicy
  .replace(/\s+/g, " ")
  .replace(/,\s*\]/g, "]")
  .replace(/\[ /g, "[")
  .replace(/ \]/g, "]");
for (const [nome, valores] of Object.entries(CSP_DIRECTIVES as Record<string, string[]>)) {
  if (!compacto.includes(`"${nome}": [`)) {
    serverDrift.push(`csp:${nome}`);
    continue;
  }
  // Valores podem estar como literal ou via constante (SUPABASE/SUPABASE_WS).
  const faltando = valores.filter(
    (v) => !compacto.includes(`"${v}"`) && !serverPolicy.includes(`"${v}"`),
  );
  if (faltando.length) serverDrift.push(`csp:${nome}`);
}
if (!serverPolicy.includes((SECURITY_HEADERS as Record<string, string>)["Permissions-Policy"]))
  serverDrift.push("Permissions-Policy");
if (!serverPolicy.includes('"X-Frame-Options": "DENY"')) serverDrift.push("X-Frame-Options");
if (serverDrift.length > 0) {
  console.error(
    `[security] src/lib/securityHeaders.ts divergiu da fonte única: ${serverDrift.join(", ")}.`,
  );
  process.exit(1);
}

const missing = REQUIRED.filter((h) => !new RegExp(`^\\s+${h}:`, "m").test(file));

if (missing.length > 0) {
  console.error(`[security] missing required headers in public/_headers: ${missing.join(", ")}`);
  process.exit(1);
}

// CSP must be present — as Report-Only this round.
const reportOnly = file.match(/^\s+Content-Security-Policy-Report-Only:\s*(.+)$/m)?.[1] ?? "";
const enforced = /^\s+Content-Security-Policy:\s*/m.test(file);

if (enforced) {
  console.error(
    "[security] enforcing Content-Security-Policy found — this round must stay Report-Only. " +
      "Convert it back to Content-Security-Policy-Report-Only.",
  );
  process.exit(1);
}

if (!reportOnly) {
  console.error("[security] missing Content-Security-Policy-Report-Only in public/_headers.");
  process.exit(1);
}

// Required directives inside the (report-only) CSP.
const cspMust = ["default-src", "frame-ancestors", "object-src 'none'", "base-uri"];
const cspMissing = cspMust.filter((d) => !reportOnly.includes(d));
if (cspMissing.length > 0) {
  console.error(`[security] CSP missing required directives: ${cspMissing.join(", ")}`);
  process.exit(1);
}

// Dangerous tokens that must never appear in the CSP.
const dangerous: [RegExp, string][] = [
  [/(^|\s)\*(\s|;|$)/, "bare wildcard '*'"],
  [/https?:\/\/\*/, "wildcard host (https://*)"],
  [/(^|\s)http:\/\//, "insecure http: origin"],
  [/'unsafe-eval'/, "'unsafe-eval'"],
];
const bad = dangerous.filter(([re]) => re.test(reportOnly)).map(([, m]) => m);
if (bad.length > 0) {
  console.error(`[security] CSP contains forbidden tokens: ${bad.join(", ")}`);
  process.exit(1);
}

// Framing must be denied effectively (X-Frame-Options: DENY) while CSP observes.
if (!/^\s+X-Frame-Options:\s*DENY\s*$/m.test(file)) {
  console.error("[security] X-Frame-Options must be DENY while CSP is Report-Only.");
  process.exit(1);
}

const hsts = file.match(/Strict-Transport-Security:\s*(.+)/)?.[1] ?? "";
if (!/max-age=\d{7,}/.test(hsts)) {
  console.error("[security] HSTS max-age must be at least 1 year (>= 1,000,000 seconds).");
  process.exit(1);
}

console.log("[security] required headers present; CSP is Report-Only and clean ✔");
