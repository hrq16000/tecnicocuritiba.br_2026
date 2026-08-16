// ⚠️ ARQUIVO GERADO por scripts/generate-interlinks.mjs — não editar à mão.
// Blocos de interlinkagem contextual com âncoras derivadas do conteúdo
// renderizado de cada destino (sem "clique aqui", sem âncora repetida).
// Regenerar: npm run interlinks

export interface InterlinkItem {
  href: string;
  anchor: string;
  family: string;
}

export const INTERLINKS_POR_ROTA: Record<string, InterlinkItem[]> = {};

/** Links contextuais gerados para uma rota (vazio quando não há afinidade). */
export function interlinksDe(pathname: string): InterlinkItem[] {
  return INTERLINKS_POR_ROTA[pathname] ?? [];
}
