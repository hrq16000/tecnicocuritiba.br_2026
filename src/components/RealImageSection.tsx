import { IMAGES } from "@/lib/images";
import { SmartImage } from "@/components/motion/SmartImage";

export type ImageKey = "tecnicoTrabalhando" | "notebookReparo" | "placaMae" | "bancadaTecnica" | "ferramentas" | "atendimentoDomiciliar" | "componentesSsd" | "redesWifi" | "cameraSeguranca" | "diagnostico" | "desktopMontado" | "smartTv" | "suporteRemoto" | "servidores" | "segurancaDigital" | "coletaEntrega" | "clienteSatisfeito" | "microsoldagem" | "estacaoSolda" | "microscopio" | "amplificadorSom";

interface RealImageSectionProps {
  imageKey: ImageKey;
  secondaryImageKey?: ImageKey;
  caption?: string;
  secondaryCaption?: string;
  layout?: "single" | "duo";
}

export const RealImageSection = ({
  imageKey,
  secondaryImageKey,
  caption,
  secondaryCaption,
  layout = "single",
}: RealImageSectionProps) => {
  const src = IMAGES[imageKey];
  const alt = IMAGES[`${imageKey}Alt` as keyof typeof IMAGES] as string;

  if (layout === "duo" && secondaryImageKey) {
    const src2 = IMAGES[secondaryImageKey];
    const alt2 = IMAGES[`${secondaryImageKey}Alt` as keyof typeof IMAGES] as string;
    return (
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <figure>
              <SmartImage
                src={src}
                alt={alt}
                width={600}
                height={400}
                wrapperClassName="rounded-xl shadow-md"
                className="rounded-xl w-full h-64 md:h-72 object-cover"
              />
              {caption && (
                <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">{caption}</figcaption>
              )}
            </figure>
            <figure>
              <SmartImage
                src={src2}
                alt={alt2}
                width={600}
                height={400}
                wrapperClassName="rounded-xl shadow-md"
                className="rounded-xl w-full h-64 md:h-72 object-cover"
              />
              {secondaryCaption && (
                <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">{secondaryCaption}</figcaption>
              )}
            </figure>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <figure>
            <SmartImage
              src={src}
              alt={alt}
              width={600}
              height={400}
              wrapperClassName="rounded-xl shadow-md"
              className="rounded-xl w-full h-64 md:h-80 object-cover"
            />
            {caption && (
              <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">{caption}</figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
};
