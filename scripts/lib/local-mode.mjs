/**
 * MODO LOCAL / OFFLINE — guarda única para integrações de terceiros.
 *
 * Objetivo: permitir rodar e testar o projeto 100% na máquina do desenvolvedor,
 * sem internet e sem serviços na nuvem. Quando o modo local está ativo, os
 * scripts que chamariam IndexNow, Google Indexing/Search Console, Resend,
 * Slack, PagerDuty ou Cloudflare apenas registram um sucesso simulado.
 *
 * Ativação (qualquer uma):
 *   LOCAL_DEV=1 | OFFLINE=1 | MOCK_EXTERNAL=1
 *   SUPABASE_URL / VITE_SUPABASE_URL apontando para 127.0.0.1 / localhost
 */

function envUrlIsLocal() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  return /^https?:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0|host\.docker\.internal)(:|\/|$)/.test(url);
}

function flagOn(name) {
  const v = process.env[name];
  return v === "1" || v === "true";
}

export function isLocalMode() {
  return flagOn("LOCAL_DEV") || flagOn("OFFLINE") || flagOn("MOCK_EXTERNAL") || envUrlIsLocal();
}

/** Loga um sucesso simulado e devolve um payload previsível. */
export function mockExternal(service, detail = "") {
  console.log(`[local-mode] ${service}: chamada externa ignorada (sucesso simulado)${detail ? ` — ${detail}` : ""}`);
  return { ok: true, mocked: true, service, detail };
}

/**
 * Atalho para scripts inteiros que só existem para falar com terceiros.
 * Encerra o processo com sucesso quando o modo local está ativo.
 */
export function exitIfLocalMode(service, detail = "") {
  if (!isLocalMode()) return false;
  mockExternal(service, detail);
  process.exit(0);
}
