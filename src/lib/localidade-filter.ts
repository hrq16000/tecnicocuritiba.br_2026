/** Ranking local sem alterar IDs, nomes, cobertura ou fonte de dados. */
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function rankLocalidades(options: readonly string[], query: string, limit = 8): string[] {
  const term = normalize(query);
  const words = term.split(/\s+/).filter(Boolean);
  return options
    .map((value, index) => {
      const label = normalize(value);
      if (words.some(word => !label.includes(word))) return null;
      const score = term && label === term ? 0 : term && label.startsWith(term) ? 1 : 2;
      return { value, index, score };
    })
    .filter((item): item is { value: string; index: number; score: number } => item !== null)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, Math.max(0, limit))
    .map(item => item.value);
}
