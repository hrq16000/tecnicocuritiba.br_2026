/**
 * ============================================================================
 * NÚCLEO TESTÁVEL DO INDEXNOW
 * ============================================================================
 * Toda a decisão ("esta URL deve ser reenviada? por quê?"), o diff de conteúdo
 * e o POST com retry vivem aqui, sem I/O de disco e sem `fetch` global, para
 * que os testes unitários possam injetar dublês e provar duas garantias:
 *
 *   1. URL cujo `lastmod` não mudou desde a última submissão é PULADA — sem
 *      fetch de HTML e sem ping.
 *   2. Falha de rede/5xx/429 não passa silenciosa: há retry com backoff
 *      exponencial e, esgotado o limite, erro explícito.
 */
import { createHash } from "node:crypto";

/** Motivos estáveis (usados no relatório e no painel). */
export const MOTIVOS = {
  NOVA: "nova",
  LASTMOD_MUDOU: "lastmod-mudou",
  SEM_LASTMOD: "sem-lastmod",
  NUNCA_SUBMETIDA: "nunca-submetida",
  FORCE_ALL: "force-all",
  RECHECK: "recheck",
  LASTMOD_INALTERADO: "lastmod-inalterado",
  CONTEUDO_MUDOU: "conteudo-mudou",
  CONTEUDO_IGUAL: "conteudo-igual",
};

/**
 * Decide, só com metadados (sitemap + manifesto), o que entra na fila de
 * verificação e o que é pulado de imediato.
 *
 * @param {object} p
 * @param {string[]} p.paths
 * @param {Map<string,string|null>} p.lastmodPorPath
 * @param {Record<string, {hash?:string, lastmod?:string|null, lastSubmitted?:string|null, submissions?:number}>} p.manifest
 * @param {boolean} [p.forceAll]
 * @param {boolean} [p.recheck]
 */
export function planejar({ paths, lastmodPorPath, manifest = {}, forceAll = false, recheck = false }) {
  const fila = [];
  const puladas = [];
  const atualizado = {};

  for (const path of [...paths].sort()) {
    const lastmod = lastmodPorPath.get(path) ?? null;
    const anterior = manifest[path];

    if (forceAll) {
      fila.push({ path, lastmod, motivo: MOTIVOS.FORCE_ALL });
      continue;
    }
    if (!anterior) {
      fila.push({ path, lastmod, motivo: MOTIVOS.NOVA });
      continue;
    }
    if (recheck) {
      fila.push({ path, lastmod, motivo: MOTIVOS.RECHECK });
      continue;
    }
    if (!anterior.lastSubmitted) {
      fila.push({ path, lastmod, motivo: MOTIVOS.NUNCA_SUBMETIDA });
      continue;
    }
    if (!lastmod || !anterior.lastmod) {
      fila.push({ path, lastmod, motivo: MOTIVOS.SEM_LASTMOD });
      continue;
    }
    if (anterior.lastmod !== lastmod) {
      fila.push({ path, lastmod, motivo: MOTIVOS.LASTMOD_MUDOU });
      continue;
    }
    // lastmod idêntico ao já submetido: nem fetch, nem ping.
    atualizado[path] = { ...anterior, lastmod };
    puladas.push({ path, lastmod, motivo: MOTIVOS.LASTMOD_INALTERADO });
  }

  return { fila, puladas, atualizado };
}

/** Extrai só os sinais que interessam a um buscador e devolve o hash. */
export function seoHash(html) {
  const pick = (re) => (html.match(re)?.[1] ?? "").trim();
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? html;
  const texto = main
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const headings = [...main.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .join("|");
  const partes = [
    pick(/<title>([\s\S]*?)<\/title>/i),
    pick(/name="description"\s+content="([^"]*)"/i),
    pick(/rel="canonical"\s+href="([^"]*)"/i),
    pick(/name="robots"\s+content="([^"]*)"/i),
    headings,
    texto,
  ];
  return createHash("sha1").update(partes.join("\u0000")).digest("hex");
}

/**
 * Busca o HTML das URLs da fila e classifica por mudança real de conteúdo.
 * `fetchImpl` é injetável para teste (default: fetch global).
 */
export async function diagnosticar({
  fila,
  manifest = {},
  base,
  fetchImpl = fetch,
  concurrency = 6,
  atualizado = {},
}) {
  const novas = [];
  const mudadas = [];
  const iguais = [];
  const falhas = [];
  const queue = [...fila];

  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      const { path, lastmod, motivo } = item;
      try {
        const res = await fetchImpl(`${base}${path}`, { redirect: "manual" });
        if (res.status !== 200) {
          falhas.push({ path, motivo: `HTTP ${res.status}` });
          continue;
        }
        const html = await res.text();
        if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
          falhas.push({ path, motivo: "noindex (não submetida)" });
          continue;
        }
        const hash = seoHash(html);
        const anterior = manifest[path];
        atualizado[path] = {
          hash,
          lastmod,
          lastSubmitted: anterior?.lastSubmitted ?? null,
          submissions: anterior?.submissions ?? 0,
        };
        if (!anterior) novas.push({ path, lastmod, motivo: MOTIVOS.NOVA });
        else if (anterior.hash !== hash)
          mudadas.push({ path, lastmod, motivo: motivo === MOTIVOS.LASTMOD_MUDOU ? MOTIVOS.LASTMOD_MUDOU : MOTIVOS.CONTEUDO_MUDOU });
        else iguais.push({ path, lastmod, motivo: MOTIVOS.CONTEUDO_IGUAL });
      } catch (e) {
        falhas.push({ path, motivo: String(e).slice(0, 120) });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return { novas, mudadas, iguais, falhas, atualizado };
}

const dormirPadrao = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * POST no endpoint IndexNow com backoff exponencial.
 * Retenta em erro de rede, 429 e 5xx. 4xx (exceto 429) é definitivo.
 * Devolve { ok, status, tentativas, erro } — nunca falha em silêncio.
 */
export async function postComRetry({
  endpoint,
  payload,
  fetchImpl = fetch,
  tentativas = 4,
  baseDelayMs = 500,
  maxDelayMs = 15000,
  sleep = dormirPadrao,
  onRetry = () => {},
}) {
  let ultimoErro = null;
  let ultimoStatus = 0;

  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      const res = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      ultimoStatus = res.status;
      if (res.ok) return { ok: true, status: res.status, tentativas: tentativa, erro: null };

      const corpo = await res.text().catch(() => "");
      ultimoErro = `HTTP ${res.status} ${corpo.slice(0, 200)}`.trim();
      const retentavel = res.status === 429 || res.status >= 500;
      if (!retentavel) return { ok: false, status: res.status, tentativas: tentativa, erro: ultimoErro };
    } catch (e) {
      ultimoErro = String(e?.message ?? e).slice(0, 200);
    }

    if (tentativa < tentativas) {
      // backoff exponencial com jitter determinístico leve
      const espera = Math.min(maxDelayMs, baseDelayMs * 2 ** (tentativa - 1));
      onRetry({ tentativa, espera, erro: ultimoErro });
      await sleep(espera);
    }
  }

  return { ok: false, status: ultimoStatus, tentativas, erro: ultimoErro ?? "falha desconhecida" };
}
