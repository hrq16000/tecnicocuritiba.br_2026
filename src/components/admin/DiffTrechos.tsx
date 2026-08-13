import { Copy, ImageIcon } from "lucide-react";

/**
 * Visualização lado a lado (diff) dos trechos e imagens repetidos que estão
 * bloqueando uma URL antes da aprovação da onda.
 *
 * O gate de hash (`npm run check:hashes`) prova que o bloco é IDÊNTICO nas duas
 * URLs — por isso o destaque marca o trecho inteiro nos dois lados. O valor da
 * visualização é ver, na mesma tela, qual página “dona” do conteúdo já usa
 * aquele trecho/imagem e decidir onde reescrever.
 */

export interface OcorrenciaReuso {
  tipo: string;
  amostra: string;
  tambemEm: string[];
  hash?: string;
}

const Coluna = ({
  titulo,
  destaque,
  imagem,
}: {
  titulo: string;
  destaque: string;
  imagem: boolean;
}) => (
  <div className="min-w-0 flex-1 rounded-lg border border-border bg-background/70 p-2">
    <div className="truncate text-[11px] font-medium text-muted-foreground">{titulo}</div>
    {imagem ? (
      <div className="mt-1.5 flex items-center gap-2">
        <img
          src={destaque}
          alt={`Imagem reutilizada em ${titulo}`}
          loading="lazy"
          className="h-14 w-20 rounded border border-border object-cover"
        />
        <code className="break-all text-[10px] text-muted-foreground">{destaque}</code>
      </div>
    ) : (
      <p className="mt-1.5 leading-snug">
        <mark className="bg-red-500/20 px-1 text-foreground">{destaque}</mark>
      </p>
    )}
  </div>
);

export const DiffTrechos = ({
  path,
  ocorrencias,
}: {
  path: string;
  ocorrencias: OcorrenciaReuso[];
}) => {
  if (!ocorrencias.length) return null;
  return (
    <div className="mt-2 space-y-2">
      {ocorrencias.slice(0, 6).map((o, i) => {
        const imagem = o.tipo === "imagem";
        return (
          <div key={`${o.hash ?? o.tipo}-${i}`} className="rounded-lg border border-red-500/30 p-2">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-600">
              {imagem ? (
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {imagem ? "Imagem repetida" : "Bloco de texto repetido"}
              {o.hash && <code className="ml-1 text-muted-foreground">{o.hash}</code>}
              <span className="ml-auto font-normal text-muted-foreground">
                {o.tambemEm.length} outra(s) URL(s)
              </span>
            </div>

            {o.tambemEm.slice(0, 3).map((outra) => (
              <div key={outra} className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Coluna titulo={`${path} (esta URL)`} destaque={o.amostra} imagem={imagem} />
                <Coluna titulo={outra} destaque={o.amostra} imagem={imagem} />
              </div>
            ))}

            {o.tambemEm.length > 3 && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                também em {o.tambemEm.slice(3).join(", ")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiffTrechos;
