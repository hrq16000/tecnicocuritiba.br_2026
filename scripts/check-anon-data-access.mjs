#!/usr/bin/env node
/**
 * Gate de regressão de acesso público (PostgREST / papel `anon`).
 *
 * Falha o pipeline quando:
 *  - `reviews?select=*` volta a ser legível por anon (exporia client_phone);
 *  - `reviews?select=client_phone` é legível por anon;
 *  - `og_validation_status` é legível por anon;
 *  - a view pública `reviews_public` deixa de responder 200 (quebraria o site);
 *  - `reviews_public` passa a expor qualquer coluna sensível.
 *
 * Uso: node scripts/check-anon-data-access.mjs
 * Requer VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (ou SUPABASE_ANON_KEY).
 */
import { readFileSync, existsSync } from "node:fs";

const SENSITIVE_COLUMNS = ["client_phone", "client_email", "internal_notes"];

function loadEnv() {
  const env = { ...process.env };
  if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2];
    }
  }
  return env;
}

const env = loadEnv();
const BASE = (env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!BASE || !KEY) {
  console.log("[anon-access] credenciais públicas ausentes — gate ignorado (ambiente offline).");
  process.exit(0);
}

const errors = [];

async function req(path) {
  const res = await fetch(`${BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* corpo vazio */
  }
  return { status: res.status, body };
}

function mustBeDenied(label, { status }) {
  if (status === 200) {
    errors.push(`${label}: acessível por anon (HTTP 200) — deveria ser 401/403.`);
  } else if (![401, 403, 404].includes(status)) {
    console.warn(`[anon-access] ${label}: status inesperado ${status} (tratado como negado).`);
  } else {
    console.log(`[anon-access] OK  ${label} → ${status}`);
  }
}

const checks = [
  ["reviews?select=*", "reviews?select=*&limit=1"],
  ["reviews?select=client_phone", "reviews?select=client_phone&limit=1"],
  ["og_validation_status?select=*", "og_validation_status?select=*&limit=1"],
];

for (const [label, path] of checks) {
  mustBeDenied(label, await req(path));
}

// A view pública precisa continuar funcionando e sem colunas sensíveis.
const pub = await req("reviews_public?select=*&limit=1");
if (pub.status !== 200) {
  errors.push(`reviews_public: HTTP ${pub.status} para anon — o site público quebraria.`);
} else {
  console.log("[anon-access] OK  reviews_public?select=* → 200");
  const row = Array.isArray(pub.body) ? pub.body[0] : null;
  if (row) {
    for (const col of SENSITIVE_COLUMNS) {
      if (col in row) errors.push(`reviews_public expõe coluna sensível "${col}".`);
    }
  }
}

if (errors.length) {
  console.error("\n[anon-access] FALHOU:\n" + errors.map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}
console.log("[anon-access] Todos os gates de exposição pública passaram.");
