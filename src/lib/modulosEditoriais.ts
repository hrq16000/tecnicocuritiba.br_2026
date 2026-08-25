import MODULOS_DATA, {
  MODULOS_EDITORIAIS_PATHS as PATHS_DATA,
  LIMITE_SOBREPOSICAO as LIMITE_DATA,
  filtrarModulos as filtrarData,
  sobreposicao as sobreposicaoData,
  textoDaSecao as textoData,
} from "../../scripts/lib/modulos-editoriais.mjs";
import type { Secao3T } from "./blocos3t";

/**
 * Módulos editoriais variáveis por serviço prioritário (Fase de Operação).
 *
 * Fonte única compartilhada com os scripts de governança. Nenhuma rota nova:
 * os módulos entram apenas em páginas de serviço já existentes que são destino
 * das URLs consolidadas. Uma seção só aparece quando acrescenta conteúdo
 * realmente diferente do que a página já diz.
 */
export interface ModuloEditorialConfig {
  tocExtra: { id: string; label: string }[];
  secoes: Secao3T[];
}

export const MODULOS_EDITORIAIS = MODULOS_DATA as unknown as Record<
  string,
  ModuloEditorialConfig
>;
export const MODULOS_EDITORIAIS_PATHS = PATHS_DATA as string[];
export const LIMITE_SOBREPOSICAO = LIMITE_DATA as number;

export const textoDaSecao = textoData as (secao: Secao3T) => string;
export const sobreposicaoModulo = sobreposicaoData as (
  secao: Secao3T,
  textoExistente: string,
) => number;

export const modulosEditoriais = (
  path: string,
  textoExistente = "",
): ModuloEditorialConfig | undefined =>
  filtrarData(path, textoExistente) as ModuloEditorialConfig | undefined;
