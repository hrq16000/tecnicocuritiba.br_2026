import {
  GALERIA_ILUSTRATIVA,
  CREDITO_GALERIA,
  srcSetPara,
  fallbackSrc,
} from "@/lib/galeriaIlustrativa";

/**
 * Galeria ilustrativa de bancada, notebook, desktop, rede e estação de trabalho.
 * Fotografias reais licenciadas (Pexels) — declaradas como ilustrativas.
 * A prova fotográfica da nossa própria operação continua em BancadaRealSection,
 * que permanece fail-closed até o acervo próprio ser aprovado.
 */
export const GaleriaIlustrativaSection = () => (
  <section
    className="border-y border-border bg-background py-14 md:py-18"
    aria-labelledby="galeria-ilustrativa-title"
  >
    <div className="container mx-auto">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          O que fazemos
        </span>
        <h2
          id="galeria-ilustrativa-title"
          className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Bancada, notebook, desktop e rede
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Cada etapa do atendimento tem um procedimento definido: abrir, medir, testar e só então
          trocar peça. Atendimento por agendamento em Curitiba e região, com coleta quando aplicável.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALERIA_ILUSTRATIVA.map((foto, i) => (
          <li key={foto.base} className="overflow-hidden rounded-xl border border-border bg-card">
            <picture>
              <source
                type="image/avif"
                srcSet={srcSetPara(foto.base, "avif")}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              />
              <source
                type="image/webp"
                srcSet={srcSetPara(foto.base, "webp")}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              />
              <img
                src={fallbackSrc(foto.base)}
                alt={foto.alt}
                width={foto.width}
                height={foto.height}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="h-52 w-full bg-muted/40 object-cover"
              />
            </picture>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">{foto.legenda}</p>
              {i === 0 && (
                <p className="mt-2 text-[11px] text-muted-foreground/80">{CREDITO_GALERIA}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Imagens ilustrativas de procedimentos técnicos — fotografias licenciadas, sem uso de
        inteligência artificial. Não exibimos equipamentos, telas ou dados de clientes.{" "}
        {CREDITO_GALERIA}
      </p>
    </div>
  </section>
);

export default GaleriaIlustrativaSection;
