import { SecaoBloco } from "@/components/servico/Blocos3T";
import type { ModuloEditorialConfig } from "@/lib/modulosEditoriais";

/**
 * Renderiza os módulos editoriais variáveis do serviço (diagnóstico,
 * sintomas × causas, procedimento, limitações e decisão prática).
 * Recebe já filtrado: só chegam aqui os módulos com conteúdo diferente
 * do que a página existente entrega.
 */
export const ModulosEditoriais = ({ cfg }: { cfg?: ModuloEditorialConfig }) => {
  if (!cfg?.secoes.length) return null;
  return (
    <>
      {cfg.secoes.map((secao, i) => (
        <section
          key={secao.id}
          id={secao.id}
          className={`scroll-mt-24 py-14 md:py-16 ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}
        >
          <SecaoBloco secao={secao} />
        </section>
      ))}
    </>
  );
};

export default ModulosEditoriais;
