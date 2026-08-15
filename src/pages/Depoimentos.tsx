import { SkeletonCardGrid } from "@/components/motion/Skeletons";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useJsonLdSlot, SCHEMA_SLOTS, SLOT_PRIORITY } from "@/lib/jsonLdSlots";
import { trackCTAClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

const PATH = "/depoimentos";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  service_slug: string | null;
  city: string | null;
  neighborhood: string | null;
  review_date: string;
}

const Stars = ({ value }: { value: number }) => (
  <div className="flex" aria-label={`${value} de 5 estrelas`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`w-4 h-4 ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const Depoimentos = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bairro, setBairro] = useState("");
  const [servico, setServico] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select(
          "id, author_name, rating, comment, service_slug, city, neighborhood, review_date",
        )
        // Apenas avaliações autorizadas (verificadas) e publicadas pelo admin.
        .eq("verified", true)
        .eq("published", true)
        .order("review_date", { ascending: false })
        .limit(120);
      if (!cancelled) {
        setReviews((data as Review[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bairros = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.neighborhood).filter(Boolean) as string[])).sort(),
    [reviews],
  );
  const servicos = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.service_slug).filter(Boolean) as string[])).sort(),
    [reviews],
  );

  const filtradas = useMemo(
    () =>
      reviews.filter(
        (r) =>
          (!bairro || r.neighborhood === bairro) &&
          (!servico || r.service_slug === servico),
      ),
    [reviews, bairro, servico],
  );

  // Review JSON-LD gerado somente com avaliações reais autorizadas e publicadas.
  const schema = useMemo(() => {
    if (filtradas.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Depoimentos verificados de clientes",
      itemListElement: filtradas.slice(0, 20).map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Review",
          author: { "@type": "Person", name: r.author_name },
          datePublished: r.review_date,
          reviewBody: r.comment,
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          itemReviewed: {
            "@type": "LocalBusiness",
            name: siteConfig.legalName,
            "@id": `${siteConfig.baseUrl}/#localbusiness`,
          },
        },
      })),
    };
  }, [filtradas]);

  useJsonLdSlot(SCHEMA_SLOTS.itemListServices, schema, SLOT_PRIORITY.page);

  const abrirWhatsApp = () => {
    trackCTAClick("whatsapp", "depoimentos");
    const msg = encodeURIComponent(
      "Olá! Vi os depoimentos no site e quero um diagnóstico do meu equipamento.",
    );
    window.open(`https://wa.me/${siteConfig.phoneE164.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <>
      <PageSEO
        title="Depoimentos de clientes | Técnico em Curitiba"
        description="Avaliações verificadas de clientes atendidos em Curitiba e região. Filtre por bairro e por serviço e veja o que foi resolvido em cada atendimento."
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Depoimentos", path: PATH },
        ]}
      />
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Depoimentos de clientes em Curitiba e região
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              Publicamos apenas avaliações enviadas por clientes reais, com autorização
              expressa de publicação. Nada é gerado automaticamente e nenhuma nota é
              inventada. Use os filtros abaixo para ver atendimentos no seu bairro ou no
              tipo de serviço que você precisa.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <label className="flex-1">
              <span className="block text-sm text-muted-foreground mb-1">Bairro</span>
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full h-11 rounded-lg border border-border bg-background px-3 text-foreground"
              >
                <option value="">Todos os bairros</option>
                {bairros.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm text-muted-foreground mb-1">Serviço</span>
              <select
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                className="w-full h-11 rounded-lg border border-border bg-background px-3 text-foreground"
              >
                <option value="">Todos os serviços</option>
                {servicos.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <SkeletonCardGrid count={3} className="md:grid-cols-2 lg:grid-cols-3" />
          ) : filtradas.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-muted-foreground">
                {reviews.length === 0
                  ? "Ainda não há avaliações publicadas com autorização do cliente. Assim que os primeiros clientes autorizarem a publicação, os depoimentos aparecem aqui — sem nota fictícia e sem texto genérico."
                  : "Nenhuma avaliação para esse filtro. Tente outro bairro ou serviço."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtradas.map((r) => (
                <article
                  key={r.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-xs"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {r.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        {r.author_name}
                        <ShieldCheck className="w-4 h-4 text-green-600" aria-label="Verificado" />
                      </div>
                      <Stars value={r.rating} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{r.comment}</p>
                  <p className="text-xs text-muted-foreground/80">
                    {[r.neighborhood, r.city].filter(Boolean).join(" · ")}
                    {r.service_slug ? ` · ${r.service_slug.replace(/-/g, " ")}` : ""}
                  </p>
                </article>
              ))}
            </div>
          )}

          <section className="mt-12 rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Foi atendido e quer registrar sua avaliação?
            </h2>
            <p className="text-muted-foreground mb-4">
              Você recebe o link no WhatsApp após o atendimento, mas também pode avaliar
              direto pelo site. Veja o passo a passo em{" "}
              <Link to="/como-avaliar" className="text-primary underline">
                como avaliar
              </Link>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/avaliar">Registrar minha avaliação</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={abrirWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Depoimentos;
