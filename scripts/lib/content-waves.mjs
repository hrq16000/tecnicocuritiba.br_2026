/**
 * ============================================================================
 * CONTROLE DE PUBLICAÇÃO EM ONDAS — hubs Wi-Fi / Smart TV por bairro
 * ============================================================================
 * Fonte única das ondas de liberação de índice. Regras (fail-closed):
 *
 *   • cada onda publica de 4 a 6 URLs por semana (WAVE_MIN / WAVE_MAX);
 *   • cada URL da onda precisa de PROVA VISUAL MÍNIMA: ao menos
 *     MIN_PROVAS_POR_URL fotos reais existentes em public/ (sem IA);
 *   • onda sem prova visual completa fica `blocked` e suas URLs NÃO podem
 *     estar no sitemap curado (permanecem noindex até a prova entrar).
 *
 * O gate é `scripts/check-wave-control.mjs`.
 * URLs liberadas antes deste controle ficam em LEGADO (grandfathered) e
 * seguem cobertas pelos gates de originalidade e de copy de bairro.
 */

export const WAVE_MIN = 4;
export const WAVE_MAX = 6;
export const MIN_PROVAS_POR_URL = 2;

/** URLs Wi-Fi/TV liberadas antes do controle em ondas (não reabrir). */
export const LEGADO = [
  "jardim-das-americas",
  "ecoville",
  "alto-da-xv",
  "reboucas",
  "batel",
  "centro",
  "agua-verde",
  "cic",
  "portao",
  "bigorrilho",
  "cabral",
  "santa-felicidade",
  "boa-vista",
  "cristo-rei",
  "cajuru",
  "boqueirao",
].flatMap((slug) => [`/servicos/redes-wifi/${slug}`, `/servicos/manutencao-tv/${slug}`]);

/**
 * Ondas declaradas. `week` = segunda-feira da semana de publicação (ISO).
 * `provas` = mapa URL -> fotos reais (caminhos dentro de public/).
 * Enquanto uma onda não tiver prova visual mínima, suas URLs precisam
 * ficar fora de `curated-urls.mjs`.
 *
 * @type {{ week: string, paths: string[], provas: Record<string, string[]>, notes?: string }[]}
 */
export const WAVES = [
  // Exemplo de próxima onda (mantida vazia até haver fotos reais catalogadas):
  // {
  //   week: "2026-08-17",
  //   paths: [
  //     "/servicos/redes-wifi/hauer",
  //     "/servicos/manutencao-tv/hauer",
  //     "/servicos/redes-wifi/pinheirinho",
  //     "/servicos/manutencao-tv/pinheirinho",
  //   ],
  //   provas: {
  //     "/servicos/redes-wifi/hauer": ["/lovable-uploads/rede-hauer-1.jpg", "/lovable-uploads/rede-hauer-2.jpg"],
  //   },
  // },
];

/** Conjunto de URLs cobertas por ondas aprovadas (prova visual completa). */
export function waveStatus(existsInPublic) {
  return WAVES.map((wave) => {
    const problems = [];
    if (wave.paths.length < WAVE_MIN || wave.paths.length > WAVE_MAX) {
      problems.push(`onda ${wave.week}: ${wave.paths.length} URLs (permitido ${WAVE_MIN}–${WAVE_MAX} por semana)`);
    }
    for (const p of wave.paths) {
      const provas = (wave.provas?.[p] || []).filter((img) => existsInPublic(img));
      const declaradas = wave.provas?.[p]?.length ?? 0;
      if (declaradas > provas.length) {
        problems.push(`onda ${wave.week}: ${p} declara foto inexistente em public/`);
      }
      if (provas.length < MIN_PROVAS_POR_URL) {
        problems.push(`onda ${wave.week}: ${p} tem ${provas.length} prova(s) visual(is) (mínimo ${MIN_PROVAS_POR_URL})`);
      }
    }
    return { week: wave.week, paths: wave.paths, approved: problems.length === 0, problems };
  });
}
