import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import {
  MapPin,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Home,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { FastHeader } from "@/components/FastHeader";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig, whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import {
  SERVICOS_CANONICOS,
  PROCESSO_ATENDIMENTO,
  MODALIDADES_ATENDIMENTO,
  CURITIBA_BAIRROS,
  CIDADES,
  type CidadeData,
} from "@/lib/cidadesData";

const CTA_CLASS =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]";

export const CidadeLandingLayout = ({ data }: { data: CidadeData }) => {
  const path = `/tecnico-informatica-${data.slug}`;
  const waHref = whatsappLink(data.whatsappMessage);

  useEffect(() => {
    trackPageView(path, data.h1);
  }, [path, data.h1]);

  const handleCta = (location: string) => trackCTAClick("whatsapp", location);
  const cidadesRelacionadas = Object.values(CIDADES)
    .filter((cidade) => cidade.slug !== data.slug)
    .slice(0, 6);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ComputerRepairService"],
    "@id": `${absoluteUrl(path)}#localbusiness`,
    name: `${siteConfig.brandName} — ${data.cidade}`,
    description: data.metaDescription,
    url: absoluteUrl(path),
    telephone: siteConfig.phoneE164,
    areaServed: {
      "@type": "City",
      name: data.areaName,
      containedInPlace: { "@type": "State", name: "Paraná" },
    },
    priceRange: "$$",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  useJsonLdSlot(SCHEMA_SLOTS.localBusiness, localBusinessSchema, SLOT_PRIORITY.page);
  useJsonLdSlot(SCHEMA_SLOTS.faq, faqSchema, SLOT_PRIORITY.page);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={data.metaTitle}
        description={data.metaDescription}
        path={path}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Serviços", path: "/servicos" },
          { name: data.cidade, path },
        ]}
      />

      <FastHeader />
      <main className="pt-[var(--site-header-height)]">
        <Breadcrumbs items={[{ label: data.cidade }]} />

        {/* Hero local */}
        <section className="relative overflow-hidden border-b border-border/60 bg-secondary/40">
          <div className="container mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <MapPin className="h-4 w-4" />
                {data.eyebrow}
              </span>
              <h1 className="mt-5 text-3xl font-heading font-bold leading-tight text-foreground md:text-5xl">
                {data.h1}{" "}
                <span className="text-accent">{data.h1Accent}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{data.subtitulo}</p>
              <div className="mt-8">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="cidade_hero"
                  data-wa-source="whatsapp_cta"
                  data-city={data.cidade}
                  onClick={() => handleCta("cidade_hero")}
                  className={CTA_CLASS}
                >
                  <MessageCircle className="h-5 w-5" />
                  Iniciar atendimento
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Proposta local + perfil */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
                Atendimento técnico em {data.cidade}
              </h2>
              <div className="mt-5 space-y-4 text-muted-foreground">
                {data.proposta.map((par, i) => (
                  <p key={i}>{par}</p>
                ))}
              </div>
            </div>
            <aside className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Perfil local</h3>
              <ul className="mt-4 space-y-3">
                {data.perfilLocal.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* Serviços atendidos na cidade */}
        <section className="border-y border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Serviços atendidos em {data.cidade}
            </h2>
            <p className="mt-2 text-muted-foreground">
              Os 8 serviços principais — clique para ver os detalhes de cada um.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SERVICOS_CANONICOS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/50"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-accent">{s.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/servicos" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                Ver todos os serviços <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Formas de atendimento (modalidades) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Formas de atendimento em {data.cidade}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A modalidade é definida na triagem, conforme o equipamento e o problema. Nem todo caso
              permite atendimento no local — parte dos reparos segue para bancada por coleta e entrega.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {MODALIDADES_ATENDIMENTO.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/50"
                >
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-accent">{m.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bairros atendidos — somente Curitiba é página-mãe dos bairros curados */}
        {data.slug === "curitiba" && (
          <section className="border-y border-border/60 bg-secondary/40 py-12 md:py-16">
            <div className="container mx-auto">
              <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
                Bairros atendidos em Curitiba
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Veja páginas com o atendimento por bairro. A logística é combinada por WhatsApp em toda a cidade.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CURITIBA_BAIRROS.map((b) => (
                  <Link
                    key={b.to}
                    to={b.to}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/50"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-accent">{b.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* Quando chamar um técnico */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Quando chamar um técnico em {data.cidade}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.quandoChamar.map((q, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground">{q.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{q.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intenção técnica: cidade → diagnóstico específico, sem duplicar serviço. */}
        <section className="border-y border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">Diagnósticos para problemas comuns</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Antes de decidir entre formatar, trocar peça ou substituir a máquina, identifique o sintoma predominante.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { to: "/problemas/computador-lento", title: "Computador lento", desc: "Desempenho, disco, memória e aquecimento." },
                { to: "/problemas/notebook-superaquecendo", title: "Notebook aquecendo", desc: "Sinais de risco e manutenção adequada." },
                { to: "/problemas/computador-nao-liga", title: "Computador não liga", desc: "Verificações seguras antes do diagnóstico." },
                { to: "/problemas/tela-azul-windows", title: "Tela azul", desc: "Drivers, memória e armazenamento." },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/50 hover:bg-accent/5">
                  <h3 className="font-semibold text-foreground group-hover:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">Ver diagnóstico <ArrowRight className="h-3.5 w-3.5" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cidade → demais cidades realmente atendidas da RMC. */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">Também atendemos outras cidades da região</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">A modalidade e a logística são definidas conforme o problema e a agenda. Consulte a página da cidade para conhecer serviços e formas de atendimento.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {cidadesRelacionadas.map((cidade) => (
                <Link key={cidade.slug} to={`/tecnico-informatica-${cidade.slug}`} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-accent hover:text-accent">
                  Técnico em {cidade.cidade} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="border-y border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Como funciona o atendimento
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PROCESSO_ATENDIMENTO.map((p) => (
                <div key={p.step} className="rounded-xl border border-border bg-card p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                    {p.step}
                  </span>
                  <h3 className="mt-3 font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preços e políticas + residencial/empresarial */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <ShieldCheck className="h-8 w-8 text-accent" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">Preços e políticas</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Diagnóstico/visita a partir de <strong className="text-foreground">{siteConfig.minPriceLabel}</strong>{" "}
                quando aplicável. O valor final depende de equipamento, deslocamento, urgência, complexidade,
                peças e da condição real do problema. Nada é executado sem sua aprovação.
              </p>
              <Link to="/precos-e-politicas" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                Ver preços e políticas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Home className="h-8 w-8 text-accent" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">Atendimento residencial</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Atendimento a domicílio ou por coleta e entrega em {data.cidade}, com horário combinado e
                diagnóstico transparente antes de aprovar o serviço.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Building2 className="h-8 w-8 text-accent" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">Atendimento empresarial</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Suporte a estações de trabalho, servidores locais e rede da empresa, de forma pontual ou
                recorrente sob consulta, para reduzir paradas.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ local */}
        <section className="border-t border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Perguntas frequentes — {data.cidade}
            </h2>
            <div className="mt-8 space-y-4">
              {data.faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground">{f.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-14">
          <div className="container mx-auto">
            <div className="rounded-2xl border border-border bg-card p-8 text-center md:p-12">
              <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
                Precisa de um técnico em {data.cidade}?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Descreva o problema pelo WhatsApp. Você recebe as primeiras orientações e, se fizer sentido,
                combinamos a avaliação do equipamento.
              </p>
              <div className="mt-7">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="cidade_final"
                  data-wa-source="whatsapp_cta"
                  data-city={data.cidade}
                  onClick={() => handleCta("cidade_final")}
                  className={CTA_CLASS}
                >
                  <MessageCircle className="h-5 w-5" />
                  Iniciar atendimento
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CidadeLandingLayout;
