import { useEffect, useMemo, useRef, useState } from "react";
import { Star, ShieldCheck, BadgeCheck, Clock, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAggregateRating } from "@/hooks/useAggregateRating";

/**
 * Banner de confiança rotativo do hero.
 * Alterna entre reviews VERIFICADAS reais (quando existem no banco) e
 * garantias/selos factuais. NUNCA inventa nota, contagem ou depoimento:
 * a estrela/nota só aparece quando o agregado real está habilitado
 * (>= mínimo de reviews verificadas) e os textos de review vêm do banco.
 */

interface DbReview {
  author_name: string;
  rating: number;
  comment: string | null;
  city: string | null;
  neighborhood: string | null;
}

type Slide =
  | { kind: "review"; author: string; rating: number; comment: string; place: string }
  | { kind: "trust"; icon: typeof ShieldCheck; title: string; desc: string };

const TRUST_SLIDES: Slide[] = [
  {
    kind: "trust",
    icon: BadgeCheck,
    title: "Diagnóstico transparente",
    desc: "Técnico identificado e valor aprovado antes de qualquer serviço.",
  },
  {
    kind: "trust",
    icon: ShieldCheck,
    title: "Garantia em todos os serviços",
    desc: "Todo reparo acompanha garantia. Confiança em cada etapa do atendimento.",
  },
  {
    kind: "trust",
    icon: Clock,
    title: "Atendimento conforme a agenda",
    desc: "Resposta em até 5 minutos pelo WhatsApp, sem compromisso.",
  },
  {
    kind: "trust",
    icon: Truck,
    title: "A domicílio ou remoto",
    desc: "Vamos até você em Curitiba e região, ou resolvemos com acesso remoto seguro.",
  },
];

interface HeroTrustBannerProps {
  city?: string;
}

export const HeroTrustBanner = ({ city }: HeroTrustBannerProps) => {
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { data: agg } = useAggregateRating({ city });
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let q = supabase
        .from("reviews_public")
        .select("author_name, rating, comment, city, neighborhood")
        .not("comment", "is", null)
        .order("review_date", { ascending: false })
        .limit(6);
      if (city) q = q.eq("city", city);
      const { data } = await q;
      if (!cancelled) setReviews((data as DbReview[]) ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [city]);

  const slides = useMemo<Slide[]>(() => {
    const reviewSlides: Slide[] = reviews
      .filter((r) => r.comment && r.comment.trim().length > 0)
      .map((r) => ({
        kind: "review" as const,
        author: r.author_name,
        rating: r.rating,
        comment: r.comment as string,
        place: r.neighborhood ? `${r.neighborhood} · ${r.city ?? "Curitiba"}` : r.city ?? "Curitiba",
      }));
    // Intercala reviews reais com garantias para uma rotação equilibrada.
    const merged: Slide[] = [];
    const max = Math.max(reviewSlides.length, TRUST_SLIDES.length);
    for (let i = 0; i < max; i++) {
      if (reviewSlides[i]) merged.push(reviewSlides[i]);
      if (TRUST_SLIDES[i]) merged.push(TRUST_SLIDES[i]);
    }
    return merged.length ? merged : TRUST_SLIDES;
  }, [reviews]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer.current);
  }, [paused, slides.length]);

  const active = slides[index] ?? TRUST_SLIDES[0];

  return (
    <div
      className="mt-6 opacity-0 animate-[heroFadeUp_0.5s_ease-out_0.65s_forwards]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rounded-2xl border border-white/[0.12] bg-white/[0.07] backdrop-blur-md px-4 py-3.5 sm:px-5 shadow-lg">
        {agg?.enabled && agg.ratingValue ? (
          <div className="mb-2.5 flex items-center gap-2 border-b border-white/[0.1] pb-2.5">
            <div className="flex" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-4 w-4 ${
                    n <= Math.round(agg.ratingValue ?? 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/25"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-white">
              {agg.ratingValue.toFixed(1)}
            </span>
            <span className="text-xs text-white/75">
              · {agg.reviewCount} avaliações verificadas
            </span>
          </div>
        ) : null}

        <div
          key={index}
          aria-live="polite"
          className="flex min-h-[3rem] items-start gap-3 animate-[heroFadeIn_0.45s_ease-out]"
        >
          {active.kind === "review" ? (
            <>
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <ShieldCheck className="h-4 w-4" aria-label="Cliente verificado" />
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-2">
                  <div className="flex" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${
                          n <= active.rating ? "fill-yellow-400 text-yellow-400" : "text-white/25"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="truncate text-xs font-semibold text-white/90">
                    {active.author}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-white/85">
                  "{active.comment}"
                </p>
                <span className="text-[11px] text-white/55">{active.place}</span>
              </div>
            </>
          ) : (
            <>
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <active.icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{active.title}</p>
                <p className="text-sm leading-snug text-white/80">{active.desc}</p>
              </div>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-3 flex gap-1.5" role="tablist" aria-label="Provas de confiança">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Prova ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroTrustBanner;
