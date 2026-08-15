import { SkeletonCardGrid } from "@/components/motion/Skeletons";
import { forwardRef, useEffect, useState } from "react";
import { Star, MessageCircle, ShieldCheck, Truck, BadgeCheck, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAggregateRating } from "@/hooks/useAggregateRating";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  comment: string | null;
  service_slug: string | null;
  city: string | null;
  neighborhood: string | null;
  review_date: string | null;
}

interface ReviewsGridProps {
  filter?: {
    service?: string;
    city?: string;
    neighborhood?: string;
  };
  limit?: number;
  showAverage?: boolean;
  title?: string;
  whatsappCta?: boolean;
  /** Exibe prova de confiança alternativa quando não há reviews reais. Default: true. */
  fallback?: boolean;
}

/** Abre o funil obrigatório sem expor o número no DOM. */
const openFunnel = (location: string, message?: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("wa-funnel:open", { detail: { location, message } }),
  );
};

/**
 * Prova de confiança exibida quando ainda não existem reviews verificadas
 * para o filtro atual. NÃO inventa aggregateRating nem contagem de avaliações
 * — apenas comunica garantias reais e verificáveis do atendimento.
 */
const TrustProofFallback = forwardRef<
  HTMLElement,
  { title: string; city?: string; whatsappCta: boolean }
>(({ title, city, whatsappCta }, ref) => {
  const signals = [
    {
      icon: BadgeCheck,
      title: "Atendimento verificado",
      desc: "Técnico identificado e diagnóstico transparente antes de qualquer serviço.",
    },
    {
      icon: Clock,
      title: "atendimento sem compromisso",
      desc: "Você aprova o valor antes de começarmos. Sem surpresas na conta.",
    },
    {
      icon: Truck,
      title: "Coleta e entrega",
      desc: `Retiramos e devolvemos o equipamento${city ? ` em ${city}` : ""} com segurança.`,
    },
    {
      icon: ShieldCheck,
      title: "Garantia no serviço",
      desc: "Todo reparo acompanha garantia. Confiança em cada etapa.",
    },
  ];

  return (
    <section ref={ref} className="py-12 px-4 min-h-[560px] md:min-h-[440px] content-visibility-auto">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ainda estamos reunindo avaliações verificadas
            {city ? ` de clientes em ${city}` : ""}. Enquanto isso, veja os
            compromissos reais do nosso atendimento.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {signals.map((s) => (
            <article
              key={s.title}
              className="rounded-xl border border-border bg-card p-5 shadow-xs text-center"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <s.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </article>
          ))}
        </div>

        {whatsappCta && (
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="gap-2"
              onClick={() =>
                openFunnel(
                  city ? `reviews_fallback_${city}` : "reviews_fallback",
                )
              }
            >
              <MessageCircle className="w-5 h-5" />
              falar com o técnico pelo WhatsApp
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});
TrustProofFallback.displayName = "TrustProofFallback";

export const ReviewsGrid = ({
  filter = {},
  limit = 6,
  showAverage = true,
  title = "Avaliações de clientes reais",
  whatsappCta = true,
  fallback = true,
}: ReviewsGridProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: agg } = useAggregateRating({
    service: filter.service,
    city: filter.city,
    neighborhood: filter.neighborhood,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("reviews")
        .select(
          "id, author_name, author_photo_url, rating, comment, service_slug, city, neighborhood, review_date",
        )
        .eq("verified", true)
        .eq("published", true)
        .order("review_date", { ascending: false })
        .limit(limit);
      if (filter.service) q = q.eq("service_slug", filter.service);
      if (filter.city) q = q.eq("city", filter.city);
      if (filter.neighborhood) q = q.eq("neighborhood", filter.neighborhood);
      const { data } = await q;
      if (!cancelled) {
        setReviews((data as Review[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter.service, filter.city, filter.neighborhood, limit]);

  // Sem reviews reais: exibe prova de confiança alternativa (sem schema/rating).
  if (!loading && reviews.length === 0) {
    if (!fallback) return null;
    return (
      <TrustProofFallback
        title={title}
        city={filter.city}
        whatsappCta={whatsappCta}
      />
    );
  }

  return (
    <section className="py-12 px-4 min-h-[560px] md:min-h-[440px] content-visibility-auto">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            {title}
          </h2>
          {showAverage && agg?.enabled && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-5 h-5 ${
                      n <= Math.round(agg.ratingValue ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">
                {agg.ratingValue?.toFixed(1)}
              </span>
              <span>· {agg.reviewCount} avaliações verificadas</span>
            </div>
          )}
        </header>

        {loading ? (
          <SkeletonCardGrid count={3} className="md:grid-cols-2 lg:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  {r.author_photo_url ? (
                    <img decoding="async"
                      src={r.author_photo_url}
                      alt={r.author_name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {r.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-foreground flex items-center gap-1">
                      {r.author_name}
                      <ShieldCheck className="w-4 h-4 text-green-600" aria-label="Verificado" />
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= r.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    "{r.comment}"
                  </p>
                )}
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>
                    {r.neighborhood ? `${r.neighborhood} · ` : ""}
                    {r.city ?? "Curitiba"}
                  </span>
                  {r.review_date && (
                    <time dateTime={r.review_date}>
                      {new Date(r.review_date).toLocaleDateString("pt-BR")}
                    </time>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {whatsappCta && (
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="gap-2"
              onClick={() =>
                openFunnel(
                  filter.city ? `reviews_grid_${filter.city}` : "reviews_grid",
                )
              }
            >
              <MessageCircle className="w-5 h-5" />
              Quero o mesmo atendimento pelo WhatsApp
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsGrid;
