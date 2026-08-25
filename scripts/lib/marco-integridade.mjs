/**
 * ============================================================================
 * INTEGRIDADE, PROCEDÊNCIA E FRESHNESS DE MARCO — FUNÇÕES PURAS
 * ============================================================================
 * Um marco é evidência histórica. Para valer como evidência precisa carregar,
 * junto do número, como o número foi obtido e se ele fecha matematicamente.
 *
 * Este módulo não lê rede e não escreve arquivo: só assina, reconcilia e
 * classifica. Quem grava é o script de snapshot.
 */
import { createHash } from "node:crypto";

export const SCHEMA_VERSION = "marco/1.1";

/** Estados de procedência — nunca misture observado com inferido. */
export const PROCEDENCIA = {
  OBSERVED: "OBSERVED",
  DERIVED: "DERIVED",
  NA: "N/A",
  STALE: "STALE",
};

/** Idade máxima aceitável, em horas, por fonte antes de virar STALE. */
export const LIMITE_FRESHNESS_H = {
  gsc: 72,
  crawl: 48,
  sitemap: 168,
  indexnow: 720,
  bing: 168,
  internal_graph: 168,
  snapshot_local: 168,
};

/** Serialização estável (chaves ordenadas) para hash reprodutível. */
export function estavel(valor) {
  if (Array.isArray(valor)) return `[${valor.map(estavel).join(",")}]`;
  if (valor && typeof valor === "object") {
    return `{${Object.keys(valor)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${estavel(valor[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(valor ?? null);
}

/**
 * Hash do conteúdo do marco, ignorando campos técnicos que mudam a cada
 * execução (timestamp, id, o próprio hash). Mesma entrada ⇒ mesmo hash.
 */
export function hashMarco(registro) {
  const { integridade, registradoEm, snapshotId, hash, ...conteudo } = registro ?? {};
  return createHash("sha256").update(estavel(conteudo)).digest("hex");
}

/** Identificador determinístico do snapshot: marco + hash de conteúdo. */
export function snapshotIdDe(marco, hash) {
  return `${String(marco).toLowerCase()}-${hash.slice(0, 12)}`;
}

/**
 * Reconciliação do funil: a soma dos estados precisa fechar com o universo.
 * @returns {{ok:boolean, universo:number, soma:number, diferenca:number, estados:object, motivo:string|null}}
 */
export function reconciliarFunil(google = {}, universo = 0) {
  const estados = [
    "indexed", "unknown", "discovered", "crawled_not_indexed",
    "duplicate", "redirect", "soft_404", "canonical_different", "outros",
  ];
  const contagens = {};
  let soma = 0;
  for (const e of estados) {
    const v = typeof google[e] === "number" ? google[e] : 0;
    contagens[e] = v;
    soma += v;
  }
  const diferenca = soma - universo;
  return {
    ok: diferenca === 0,
    universo,
    soma,
    diferenca,
    estados: contagens,
    motivo:
      diferenca === 0
        ? null
        : `soma dos estados (${soma}) não fecha com o universo curado (${universo}); diferença ${diferenca > 0 ? "+" : ""}${diferenca}`,
  };
}

/**
 * Freshness por fonte.
 * @param {{fonte:string, collectedAt:string|null, sourceUpdatedAt?:string|null}[]} fontes
 */
export function avaliarFreshness(fontes = [], agora = new Date()) {
  const itens = fontes.map((f) => {
    const ref = f.sourceUpdatedAt ?? f.collectedAt ?? null;
    if (!ref) {
      return { ...f, ageHoras: null, estado: PROCEDENCIA.NA, limiteH: LIMITE_FRESHNESS_H[f.fonte] ?? null };
    }
    const idade = Math.round(((agora.getTime() - new Date(ref).getTime()) / 3_600_000) * 10) / 10;
    const limite = LIMITE_FRESHNESS_H[f.fonte] ?? 168;
    return {
      ...f,
      ageHoras: idade,
      limiteH: limite,
      estado: idade > limite ? PROCEDENCIA.STALE : PROCEDENCIA.OBSERVED,
    };
  });
  return {
    ok: itens.every((i) => i.estado !== PROCEDENCIA.STALE),
    atrasadas: itens.filter((i) => i.estado === PROCEDENCIA.STALE).map((i) => i.fonte),
    ausentes: itens.filter((i) => i.estado === PROCEDENCIA.NA).map((i) => i.fonte),
    itens,
  };
}

/**
 * Janelas de search performance: torna explícito o overlap entre dois marcos
 * medidos com janela móvel de 28 dias.
 */
export function janelasSearchPerformance(marcoA, marcoB, dias = 28) {
  const MS = 86_400_000;
  const fim = (m) => (m?.registradoEm ? new Date(m.registradoEm) : null);
  const fa = fim(marcoA);
  const fb = fim(marcoB);
  if (!fa || !fb) return null;
  const ia = new Date(fa.getTime() - dias * MS);
  const ib = new Date(fb.getTime() - dias * MS);
  const inicioOverlap = new Date(Math.max(ia.getTime(), ib.getTime()));
  const fimOverlap = new Date(Math.min(fa.getTime(), fb.getTime()));
  const overlapDias = Math.max(0, Math.round(((fimOverlap - inicioOverlap) / MS) * 10) / 10);
  return {
    a: { marco: marcoA.marco, inicio: ia.toISOString(), fim: fa.toISOString(), dias },
    b: { marco: marcoB.marco, inicio: ib.toISOString(), fim: fb.toISOString(), dias },
    overlapDias,
    overlapPct: Math.round((overlapDias / dias) * 1000) / 10,
    naoSobreposto: {
      dias: Math.max(0, Math.round(((fb - fa) / MS) * 10) / 10),
      inicio: fa.toISOString(),
      fim: fb.toISOString(),
      observacao:
        "Período exclusivo do marco mais recente. Não substitui a janela de 28d — é comparação complementar.",
    },
  };
}

/**
 * Assina o registro do marco com schema, hash, id, procedência e freshness.
 * Não muta a entrada.
 */
export function assinarMarco(registro, { fontes = [], reconciliacao = null, agora = new Date() } = {}) {
  const hash = hashMarco(registro);
  const freshness = avaliarFreshness(fontes, agora);
  return {
    ...registro,
    integridade: {
      schemaVersion: SCHEMA_VERSION,
      snapshotId: snapshotIdDe(registro.marco, hash),
      hash,
      hashAlgoritmo: "sha256",
      assinadoEm: agora.toISOString(),
      timezoneFonte: "UTC",
      procedencia: fontes.map((f) => ({
        metrica: f.metrica,
        fonte: f.fonte,
        estado: freshness.itens.find((i) => i.fonte === f.fonte && i.metrica === f.metrica)?.estado ?? PROCEDENCIA.NA,
        collectedAt: f.collectedAt ?? null,
        sourceUpdatedAt: f.sourceUpdatedAt ?? null,
      })),
      freshness: { ok: freshness.ok, atrasadas: freshness.atrasadas, ausentes: freshness.ausentes, itens: freshness.itens },
      reconciliacao,
    },
  };
}

/** Verifica se um registro persistido continua íntegro (hash confere). */
export function verificarMarco(registro) {
  const esperado = registro?.integridade?.hash ?? null;
  if (!esperado) return { ok: false, motivo: "registro sem hash de integridade (schema anterior a marco/1.1)" };
  const atual = hashMarco(registro);
  return {
    ok: atual === esperado,
    esperado,
    calculado: atual,
    motivo: atual === esperado ? null : "conteúdo do marco diverge do hash registrado",
  };
}

export default { assinarMarco, verificarMarco, reconciliarFunil, avaliarFreshness, janelasSearchPerformance };
