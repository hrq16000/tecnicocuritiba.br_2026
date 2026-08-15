import { upsertCanonical } from "@/lib/canonicalUrl";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { CheckCircle2, MessageCircle, Clock, MapPin, Wrench, Truck, Monitor, ArrowRight } from "lucide-react";
import { FastHeader } from "@/components/FastHeader";
import { Footer } from "@/components/Footer";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

type Modality = "remoto" | "visita" | "coleta";

interface TriageContext {
  modality?: Modality;
  equipmentLabel?: string;
  equipmentId?: string;
  triageId?: string;
  ctaLocation?: string;
  savedAt?: number;
}

const MODALITY_COPY: Record<Modality, {
  title: string;
  intro: string;
  prazo: string;
  icon: typeof Monitor;
  steps: string[];
  cta: string;
}> = {
  remoto: {
    title: "Atendimento remoto em andamento",
    intro: "Você acabou de abrir a conversa no WhatsApp. Um técnico responde para confirmar o horário e enviar o link seguro de acesso remoto.",
    prazo: "Resposta em minutos no horário comercial.",
    icon: Monitor,
    steps: [
      "Fique com o computador ligado e conectado à internet.",
      "Aguarde o link seguro de acesso remoto pelo WhatsApp.",
      "Você acompanha tudo em tempo real e aprova cada etapa.",
    ],
    cta: "Reabrir conversa no WhatsApp",
  },
  visita: {
    title: "Visita técnica em Curitiba",
    intro: "Sua solicitação foi registrada. O técnico responde no WhatsApp para confirmar endereço, janela de horário e o valor do deslocamento.",
    prazo: "Janelas de atendimento combinadas por WhatsApp.",
    icon: Wrench,
    steps: [
      "Confirme endereço e melhor horário na conversa.",
      "Diagnóstico é feito no local antes de qualquer serviço.",
      "Nada é executado sem sua aprovação por escrito.",
    ],
    cta: "Continuar no WhatsApp",
  },
  coleta: {
    title: "Coleta e entrega em andamento",
    intro: "Como o serviço exige bancada, combinamos a coleta do equipamento. O diagnóstico completo acontece em bancada, com registro técnico do que foi verificado.",
    prazo: "Coleta agendada por WhatsApp; laudo em 1–3 dias úteis após recebimento.",
    icon: Truck,
    steps: [
      "Prepare o equipamento (acessórios, senha, backup se possível).",
      "Combine a coleta pelo WhatsApp — endereço e janela de horário.",
      "Após o laudo, você decide se aprova o valor do atendimento.",
    ],
    cta: "Ver mensagem no WhatsApp",
  },
};

const GENERIC_COPY = {
  title: "Obrigado por entrar em contato",
  intro: "Para agilizar seu atendimento, inicie a triagem para que o técnico já receba as informações do problema.",
  cta: "Iniciar triagem agora",
};

const FAQ = [
  {
    q: "Quando o técnico responde?",
    a: "Respondemos no WhatsApp em minutos durante o horário comercial. Fora dele, o primeiro retorno ocorre no próximo dia útil.",
  },
  {
    q: "Preciso preparar alguma coisa?",
    a: "Se o atendimento for remoto, mantenha o equipamento ligado. Para visita, deixe o local acessível. Para coleta, separe o equipamento e acessórios.",
  },
  {
    q: "Como acompanho o andamento?",
    a: "Tudo é registrado na conversa do WhatsApp. Enviamos fotos, laudos e atualizações; nada é executado sem sua aprovação explícita.",
  },
];

const Obrigado = () => {
  const [ctx, setCtx] = useState<TriageContext | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Obrigado — Técnico em Curitiba";
    const setMeta = (sel: string, attr: string, val: string) => {
      const el = document.querySelector<HTMLMetaElement>(sel);
      if (el) el.setAttribute(attr, val);
    };
    setMeta(
      'meta[name="description"]',
      "content",
      "Sua mensagem foi enviada. Veja próximos passos, prazos e como acompanhar o atendimento pelo WhatsApp.",
    );
    upsertCanonical(absoluteUrl("/obrigado"));
    setMeta('meta[property="og:url"]', "content", absoluteUrl("/obrigado"));
    setMeta('meta[property="og:title"]', "content", "Obrigado — Técnico em Curitiba");
    setMeta(
      'meta[property="og:description"]',
      "content",
      "Sua triagem chegou por WhatsApp. Confira os próximos passos e prazos.",
    );

    // robots noindex — página de agradecimento não deve indexar
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const prevRobots = robots.getAttribute("content");
    robots.setAttribute("content", "noindex,follow");

    try {
      const raw = sessionStorage.getItem("wa-funnel:last-triage");
      if (raw) setCtx(JSON.parse(raw) as TriageContext);
    } catch { /* noop */ }
    setReady(true);
    trackPageView("/obrigado", "Obrigado");

    return () => {
      if (robots && prevRobots) robots.setAttribute("content", prevRobots);
    };
  }, []);

  const modality = ctx?.modality;
  const copy = modality ? MODALITY_COPY[modality] : null;

  const localBusinessSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ComputerRepairService"],
      name: siteConfig.brandName,
      url: absoluteUrl("/"),
      telephone: siteConfig.phoneE164,
      areaServed: siteConfig.serviceArea.map((n) => ({ "@type": "City", name: n })),
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.primaryCity,
        addressRegion: siteConfig.region,
        addressCountry: siteConfig.country,
      },
      priceRange: siteConfig.minPriceLabel,
    }),
    [],
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [],
  );

  const handleReopenFunnel = () => {
    trackCTAClick("whatsapp", "obrigado_reopen");
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", { detail: { location: "obrigado_reopen" } }),
    );
  };

  const Icon = copy?.icon ?? CheckCircle2;

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FastHeader />
      <main className="pt-[var(--site-header-height)]">
        <section className="border-b border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <CheckCircle2 className="h-4 w-4" /> Mensagem enviada
            </span>
            <h1 className="mt-5 text-3xl font-heading font-bold leading-tight text-foreground md:text-4xl">
              {ready && copy ? copy.title : GENERIC_COPY.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {ready && copy ? copy.intro : GENERIC_COPY.intro}
            </p>
            {ready && copy ? (
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" /> {copy.prazo}
              </p>
            ) : null}

            <div className="mt-8">
              <button
                type="button"
                onClick={handleReopenFunnel}
                data-cta-location="obrigado_reopen"
                data-wa-funnel="required"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5" />
                {ready && copy ? copy.cta : GENERIC_COPY.cta}
              </button>
            </div>
          </div>
        </section>

        {ready && copy ? (
          <section className="py-12 md:py-16">
            <div className="container mx-auto max-w-3xl px-4">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-heading font-bold text-foreground">Próximos passos</h2>
                </div>
                <ol className="mt-6 space-y-3">
                  {copy.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                {ctx?.equipmentLabel ? (
                  <p className="mt-6 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                    Contexto registrado: <strong className="text-foreground">{ctx.equipmentLabel}</strong>
                    {ctx.triageId ? ` · triagem #${ctx.triageId}` : ""}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-y border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-heading font-bold text-foreground">Perguntas frequentes</h2>
            <div className="mt-6 space-y-4">
              {FAQ.map((f, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" /> Atendemos Curitiba e região metropolitana.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/servicos"
                className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent/50"
              >
                Ver serviços <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/como-funciona"
                className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent/50"
              >
                Como funciona <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/precos-e-politicas"
                className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent/50"
              >
                Preços e políticas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Obrigado;
