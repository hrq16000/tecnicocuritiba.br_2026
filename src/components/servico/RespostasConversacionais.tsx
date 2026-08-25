import { conversacionalDoServico } from "@/lib/conversacional";

/**
 * Seção de intenção conversacional (buscas estilo IA).
 * H2 = intenção (O que / Como / Onde / Por que), H3 = pergunta exata.
 * Não emite JSON-LD: as respostas curtas entram no FAQPage único da página
 * (via `faqsConversacionais`), preservando a paridade 1:1 exigida nos gates.
 */
export const RespostasConversacionais = ({ slug }: { slug: string }) => {
  const blocos = conversacionalDoServico(slug);
  if (!blocos?.length) return null;

  return (
    <section id="respostas-diretas" className="scroll-mt-24 bg-background py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Respostas diretas
          </p>
          <p className="mt-2 text-muted-foreground">
            As dúvidas abaixo estão escritas do jeito que chegam até nós — por telefone, no
            WhatsApp e nas buscas — com a explicação técnica correspondente.
          </p>

          <div className="mt-8 space-y-10">
            {blocos.map((bloco) => (
              <div key={bloco.intencao}>
                <h2 className="text-xl font-heading font-bold text-foreground md:text-2xl">
                  {bloco.titulo}
                </h2>
                <div className="mt-4 space-y-5">
                  {bloco.perguntas.map((p) => (
                    <div
                      key={p.pergunta}
                      className="rounded-xl border border-border bg-secondary/40 p-5 transition-shadow hover:shadow-xs"
                    >
                      <h3 className="font-bold text-foreground">{p.pergunta}</h3>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{p.resposta}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
