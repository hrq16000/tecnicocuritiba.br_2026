/**
 * ============================================================================
 * JANELA TEMPORAL DE MARCO OPERACIONAL
 * ============================================================================
 * Um marco só existe se o tempo de calendário correspondente realmente passou
 * desde o baseline D0. Registrar D14 no mesmo dia do D0 não produz uma série
 * temporal — produz uma cópia do D0 com outro rótulo, e qualquer análise em
 * cima disso é ficção.
 *
 * Este módulo é a fonte única do contrato temporal. Ele NÃO consulta rede e
 * NÃO altera nada: apenas responde se a coleta do marco é legítima.
 */

/** Dias mínimos de calendário entre o D0 e cada marco. */
export const JANELA_MINIMA_DIAS = { D0: 0, D7: 7, D14: 14, D30: 30 };

/** Tolerância: aceita o marco a partir de meio dia antes do limite exato. */
const TOLERANCIA_DIAS = 0.5;

const MS_DIA = 24 * 60 * 60 * 1000;

/**
 * @param {string} marco  D0 | D7 | D14 | D30
 * @param {{marcos?: {marco:string, registradoEm:string}[]}} historico
 * @param {Date} [agora]
 * @returns {{ok:boolean, marco:string, minimoDias:number, diasDesdeD0:number|null,
 *            baselineEm:string|null, faltamDias:number|null, elegivelEm:string|null,
 *            motivo:string|null}}
 */
export function avaliarJanela(marco, historico, agora = new Date()) {
  const alvo = (marco ?? "").toUpperCase();
  const minimoDias = JANELA_MINIMA_DIAS[alvo] ?? 0;
  const d0 = (historico?.marcos ?? []).find((m) => m.marco === "D0");

  if (alvo === "D0") {
    return {
      ok: true, marco: alvo, minimoDias: 0, diasDesdeD0: 0,
      baselineEm: d0?.registradoEm ?? null, faltamDias: 0, elegivelEm: null, motivo: null,
    };
  }

  if (!d0?.registradoEm) {
    return {
      ok: false, marco: alvo, minimoDias, diasDesdeD0: null, baselineEm: null,
      faltamDias: null, elegivelEm: null,
      motivo: `baseline D0 não registrado — ${alvo} não tem referência temporal`,
    };
  }

  const base = new Date(d0.registradoEm).getTime();
  const dias = Math.round(((agora.getTime() - base) / MS_DIA) * 100) / 100;
  const elegivelEm = new Date(base + minimoDias * MS_DIA).toISOString();
  const ok = dias >= minimoDias - TOLERANCIA_DIAS;

  return {
    ok,
    marco: alvo,
    minimoDias,
    diasDesdeD0: dias,
    baselineEm: d0.registradoEm,
    faltamDias: ok ? 0 : Math.round((minimoDias - dias) * 100) / 100,
    elegivelEm,
    motivo: ok
      ? null
      : `apenas ${dias} dia(s) desde o D0 (${d0.registradoEm}); ${alvo} exige ${minimoDias} dia(s) — elegível a partir de ${elegivelEm}`,
  };
}

export default avaliarJanela;
