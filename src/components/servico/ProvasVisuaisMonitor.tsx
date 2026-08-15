import { IMAGES } from "@/lib/images";
import { creditFor } from "@/lib/imageCredits";
import type { ImageKey } from "@/components/RealImageSection";

/**
 * Provas visuais do conserto de monitor (Rodada 3Y — expansão monitor).
 *
 * Fotografia real licenciada (Unsplash/Pexels), nunca imagem gerada por IA.
 * As quatro etapas espelham o checklist interno obrigatório antes da
 * liberação do status do lead: entrada, placa lógica, teste final e
 * embalagem. Cada figura traz legenda curta e crédito visível exigido
 * pelo gate `check:image-credits`.
 */
interface Prova {
  etapa: string;
  imageKey: ImageKey;
  legenda: string;
}

const PROVAS: Prova[] = [
  {
    etapa: "1. Entrada",
    imageKey: "diagnostico",
    legenda: "Recebimento com registro de marca, modelo, série e estado do painel.",
  },
  {
    etapa: "2. Placa lógica",
    imageKey: "microscopio",
    legenda: "Medição das linhas de alimentação e inspeção ampliada da placa.",
  },
  {
    etapa: "3. Teste final",
    imageKey: "bancadaTecnica",
    legenda: "Monitor remontado e ligado em duas entradas de vídeo, em uso contínuo.",
  },
  {
    etapa: "4. Embalagem",
    imageKey: "coletaEntrega",
    legenda: "Aparelho embalado com proteção extra antes da entrega.",
  },
];

export const ProvasVisuaisMonitor = () => (
  <section id="provas-monitor" className="scroll-mt-24 bg-secondary py-14 md:py-16">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
        Como funciona o processo do conserto de monitor
      </h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Todo monitor passa por quatro registros obrigatórios de bancada. Sem esses quatro
        registros, a ordem de serviço não é encerrada e o aparelho não sai da bancada. As imagens
        abaixo são fotografia licenciada ilustrando cada etapa — o registro do seu atendimento é
        feito no dossiê interno da ordem de serviço.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROVAS.map((prova) => {
          const src = IMAGES[prova.imageKey];
          const alt = IMAGES[`${prova.imageKey}Alt` as keyof typeof IMAGES] as string;
          const credit = creditFor(src);
          return (
            <figure key={prova.etapa} className="rounded-xl bg-background p-3 shadow-xs">
              <img
                src={src}
                alt={`${prova.etapa} — ${alt}`}
                loading="lazy"
                decoding="async"
                width={600}
                height={400}
                className="h-44 w-full rounded-lg object-cover"
              />
              <figcaption className="mt-3">
                <span className="block text-sm font-bold text-foreground">{prova.etapa}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{prova.legenda}</span>
                <a
                  href={credit.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-2 block text-[11px] italic text-muted-foreground/80 underline-offset-2 hover:underline"
                >
                  {credit.creditText}
                </a>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  </section>
);
