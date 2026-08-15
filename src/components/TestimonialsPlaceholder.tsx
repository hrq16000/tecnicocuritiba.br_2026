import { MessageCircle, ShieldCheck, MapPin, Clock, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { trackCTAClick } from "@/lib/analytics";
import { whatsappLink } from "@/lib/siteConfig";

const WHATSAPP_URL = whatsappLink("Olá! Quero um atendimento técnico em Curitiba.");

type Testimonial = {
  name: string;
  city: string;
  service: string;
  text: string;
  verified_at?: string;
};

const differentials = [
  { icon: MapPin, title: "Atendimento local", desc: "Curitiba e região metropolitana, sem terceirizar." },
  { icon: ShieldCheck, title: "Aprovação prévia", desc: "Você só autoriza depois de saber o que será feito." },
  { icon: Wallet, title: "Preço claro", desc: "Valor antes da execução, sem surpresa." },
  { icon: Clock, title: "Conforme agenda do dia", desc: "Janela de atendimento conforme agenda do dia." },
];

/**
 * Bloco de depoimentos REAIS apenas. Renderiza placeholder honesto enquanto
 * a fila de reviews verificadas está vazia — sem números inventados.
 */
export const TestimonialsPlaceholder = ({ items = [] as Testimonial[] }) => {
  const [verified, setVerified] = useState<Testimonial[]>(items);

  useEffect(() => {
    if (items.length === 0) return;
    setVerified(items.filter(Boolean));
  }, [items]);

  return (
    <section
      className="py-12 md:py-16 bg-background relative overflow-hidden"
      aria-labelledby="depoimentos-diferenciais"
    >
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center mb-10">
          <h2
            id="depoimentos-diferenciais"
            className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3"
          >
            Diferenciais reais do atendimento
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sem prova social inventada. Conforme as avaliações verificadas chegam, elas aparecem aqui.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {differentials.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-secondary/60 border border-border/40 rounded-xl p-5 hover:shadow-xs transition-shadow"
            >
              <Icon className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-1 text-base">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {verified.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {verified.map((t, i) => (
              <figure
                key={i}
                className="bg-card border border-border/40 rounded-xl p-5"
              >
                <blockquote className="text-sm text-foreground leading-relaxed mb-3">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{t.name}</strong> · {t.city} · {t.service}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border/60 rounded-xl p-6 text-center text-sm text-muted-foreground mb-8">
            Estrutura pronta para depoimentos verificados. Atendido recentemente?
            Compartilhe sua experiência via WhatsApp.
          </div>
        )}

        <div className="text-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick("whatsapp", "testimonials")}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Falar no WhatsApp agora
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPlaceholder;
